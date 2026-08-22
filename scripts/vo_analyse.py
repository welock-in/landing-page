#!/usr/bin/env python3
"""Map an ElevenLabs read onto the film's beat sheet.

Reads a silencedetect log on stdin, prints a per-line drift report, and -- with
--retime -- emits the ffmpeg filter that moves each line onto its target.

Silence detection finds *sentences*, not lines: a line carrying an internal full
stop ("No exit. No negotiating with yourself.") splits into two spans, so a read
of 13 lines routinely yields 16-19. Deciding which spans belong together is the
whole problem, and it is not guesswork: a single voice reads at one steady rate,
so the correct grouping is the one whose per-line seconds-per-word is most
uniform. That is what gets searched below, over every way of merging the surplus
gaps, scored by variance. A grouping that needs a wildly fast line next to a
wildly slow one is the wrong grouping.
"""
import argparse, itertools, re, sys

ap = argparse.ArgumentParser()
ap.add_argument("--targets", required=True)   # comma-separated line onsets
ap.add_argument("--words", required=True)     # comma-separated word counts
ap.add_argument("--syllables", required=True) # comma-separated syllable counts
ap.add_argument("--duration", type=float, required=True)   # audio length
ap.add_argument("--video", type=float, required=True)      # picture length
ap.add_argument("--offset", type=float, default=0.0)
ap.add_argument("--retime", action="store_true")
a = ap.parse_args()

targets = [float(x) for x in a.targets.split(",")]
words   = [int(x)   for x in a.words.split(",")]
syll    = [int(x)   for x in a.syllables.split(",")]
N = len(targets)

# --- speech spans, rebuilt from the silences between them --------------------
ev = [(m.group(1), float(m.group(2)))
      for m in re.finditer(r"silence_(start|end):\s*([0-9.]+)", sys.stdin.read())]
spans, cur = [], 0.0
for kind, t in ev:
    if kind == "start":
        if t - cur > 0.05: spans.append([cur, t])
    else:
        cur = t
if a.duration - cur > 0.05: spans.append([cur, a.duration])

if not spans:
    print("  no speech found in the read", file=sys.stderr); sys.exit(1)

# --- group the spans into one per line ---------------------------------------
def merged_groups(spans, drop):
    """Bundle the spans into one list per line, joining across gaps in `drop`."""
    out = [[spans[0]]]
    for i in range(1, len(spans)):
        if (i - 1) in drop: out[-1].append(spans[i])
        else: out.append([spans[i]])
    return out

def pace(groups):
    """Syllables per second of ACTUAL SPEECH in each line.

    Syllables rather than words because "Choose the distractions" is three words
    but six syllables, and a rate model that cannot tell those apart invents
    differences that are not there. Speech time rather than the group's extent
    because a line with an internal full stop carries that pause inside it."""
    return [u / sum(b - a for a, b in g) for g, u in zip(groups, syll)]

def pace_variance(groups):
    r = pace(groups)
    m = sum(r) / len(r)
    return sum((x - m) ** 2 for x in r) / len(r)

surplus = len(spans) - N
if surplus < 0:
    print(f"  ! the read has {len(spans)} spans but the script has {N} lines.",
          file=sys.stderr)
    print("    Lines have run together -- most often a line ending in a comma",
          file=sys.stderr)
    print("    rather than a full stop. Fix the punctuation and regenerate.",
          file=sys.stderr)
    sys.exit(1)

if surplus == 0:
    groups = [[s] for s in spans]
else:
    best, best_score = None, None
    for drop in itertools.combinations(range(len(spans) - 1), surplus):
        g = merged_groups(spans, set(drop))
        score = pace_variance(g)
        if best_score is None or score < best_score:
            best, best_score = g, score
    groups = best

rates = pace(groups)
mean = sum(rates) / len(rates)

# --- report -------------------------------------------------------------------
spread = max(abs(r - mean) for r in rates) / mean

print(f"  {len(spans)} speech spans -> {N} lines   |   pace {mean:.1f} syllables/s")
print()
print("  line  spans   spoken   syl/s      target   starts    drift")
print("  ----  -----   ------   -----      ------   ------   ------")
for i, (g, t) in enumerate(zip(groups, targets)):
    got = g[0][0] + a.offset
    d = got - t
    spoken = sum(b - x for x, b in g)
    print(f"  {i+1:4d}  {len(g):5d}   {spoken:5.2f}s   {syll[i]/spoken:5.1f}      "
          f"{t:6.2f}   {got:6.2f}   {d:+6.2f}" + ("  !" if abs(d) > 0.30 else ""))
print()

# A single voice does not change pace threefold between two adjacent lines. When
# the per-line rates disagree that much, the spans have been grouped onto the
# wrong lines and every number above is fiction -- so say so, and refuse to
# retime on it rather than shuffling speech onto beats it does not belong to.
CONFIDENT, USABLE = 0.45, 0.75
if spread > USABLE:
    print(f"  ! per-line pace varies by ±{spread*100:.0f}% -- the spans could not be")
    print( "    matched to the lines with any confidence. Almost always this is a")
    print( "    line that ends in a comma instead of a full stop: the read runs it")
    print( "    into the next line, leaving no pause to split on. Fix the")
    print( "    punctuation in VOICEOVER.md section 2 and regenerate.")
    print()
elif spread > CONFIDENT:
    print(f"  ~ per-line pace varies by ±{spread*100:.0f}%; the line matching is")
    print( "    plausible but not certain. Check the words/s column above.")
    print()

speech = sum(b - x for g in groups for x, b in g)
print(f"  speech {speech:.2f}s   read {a.duration:.2f}s   picture {a.video:.2f}s")
if a.duration < a.video - 0.5:
    print(f"  the read is {a.video - a.duration:.2f}s short of the picture."
          " No offset can fix that -- use --retime,")
    print("  or slow the Speed slider and regenerate.")

# --- the retime filter ---------------------------------------------------------
if a.retime and spread > USABLE:
    print("  retime refused: see the pace warning above.", file=sys.stderr)
    sys.exit(1)

if a.retime:
    parts, mix = [], ""
    prev_end = 0.0
    for i, (g, t) in enumerate(zip(groups, targets)):
        s, e = g[0][0], g[-1][1]
        if t < prev_end - 0.01:
            print(f"  ! line {i+1} cannot start at {t:.2f}s: line {i} still running"
                  f" until {prev_end:.2f}s.", file=sys.stderr)
            print("    The read is too slow for the beat sheet at this point.",
                  file=sys.stderr)
            sys.exit(1)
        # [1:a], not [0:a]: build-vo.sh feeds the picture as input 0 and the
        # read as input 1, and the picture has no audio stream to trim.
        parts.append(f"[1:a]atrim=start={s:.3f}:end={e:.3f},asetpts=PTS-STARTPTS,"
                     f"adelay={int(round(t*1000))}:all=1[s{i}]")
        mix += f"[s{i}]"
        prev_end = t + (e - s)
    # normalize=0 sums rather than averages: the segments never overlap, so this
    # is a concatenation with silence, at the original level.
    filt = ";".join(parts) + f";{mix}amix=inputs={N}:normalize=0:duration=longest[vo]"
    with open("/tmp/vo_filter.txt", "w") as f: f.write(filt)
    print(f"  retime: each line moved onto its beat, gaps rebuilt around it.")
    gaps = [targets[i+1] - (targets[i] + (groups[i][-1][1]-groups[i][0][0])) for i in range(N-1)]
    print(f"  resulting gaps {min(gaps):.2f}s to {max(gaps):.2f}s"
          f"   tail {a.video - (targets[-1] + (groups[-1][-1][1]-groups[-1][0][0])):.2f}s")
