# Hero demo voice-over

The hero film (`public/videos/welock-draft.mp4`, 34.20 s, 1280×720, 30 fps) was
cut silent: one H.264 stream, no audio track. This document is the record of
what is on screen, the narration written against it, and how the two are put
back together into `welock-draft-vo.mp4` — the file the hero modal actually
plays.

Nothing here is a guess about the film. The beat sheet below was read off the
frames themselves (2 fps contact sheets over the full 34.2 s), which is also how
the two errors in the old caption file were found: the first title card is ~0.4 s
earlier than it claimed, and the **"You're now locked in."** card was missing
from it altogether.

---

## 1. Beat sheet

Timings are ±0.25 s (the film crossfades between beats rather than cutting, so
there is no single frame to point at).

| In | Out | On screen | Burned-in card |
| --- | --- | --- | --- |
| 0.0 | 0.4 | A social feed, scrolling on its own | — |
| 0.4 | 2.5 | Feed keeps scrolling | **Shouldn't you be working?** |
| 2.5 | 3.0 | Feed, card gone | — |
| 3.0 | 5.0 | Logo; the padlock shackle closes | welock.in — *locks your distractions away* |
| 5.0 | 5.4 | Blurred desktop, the **Lock in** sheet rises | — |
| 5.4 | 7.3 | `DURATION` scrubs `00 h` → `02 h 00 m` | **Select your time.** |
| 7.3 | 8.9 | `BLOCKLIST` — *Deep Work · 6 apps* is ticked | **Choose what to block.** |
| 8.9 | 11.1 | **Hard lock-in** *(Recommended)* flips on, red. Helper text becomes *"Locked in. There's no way out until your timer ends."* | **Lock it in.** |
| 11.1 | 14.3 | `SELECT YOUR DEVICES` — MacBook, iPhone, iPad all tick | **Select your devices.** |
| 14.3 | 14.8 | Cursor presses **Start Focus** | — |
| 14.8 | 16.8 | Padlock closes again | **You're now locked in.** |
| 16.8 | 20.3 | Ink-black session screen. `2:00:00 remaining`, *0m focused · ends at 16:00*, *6 apps & sites · locked on 3 devices*, *Hard lock-in active. No way out until 16:00*, focus-sound bar (Rain, playing) | **No way out until the timer ends.** |
| 20.6 | 24.2 | A browser opens; `instagram.com` is typed into the bar | — |
| 24.2 | 24.5 | Block page: *Don't you have a deadline?* — **Instagram.com** *is blocked by welock.in* | — |
| 24.5 | 25.2 | Same page | **Blocked. Everywhere.** |
| 25.2 | 27.2 | iPhone home screen, apps in full colour | **Blocked. Everywhere.** |
| 27.2 | 31.3 | The phone drains to black behind a padlock: *Locked in. / 1:59 left. / Get back to it. / welock.in* | **Blocked. Everywhere.** |
| 31.7 | 34.2 | End card: welock.in — *Lock in.* | — |

**Shape of it:** hook (0–3) → name (3–5) → four setup steps (5–14) → the lock
lands (14–20) → proof it holds, on two devices (20–31) → sign-off (31–34).

---

## 2. The script

Paste this into ElevenLabs **exactly as written**, break tags included. The tags
are not decoration — they are what puts each line on its beat. Total lands at
about **33.5 s** against a 34.20 s picture.

```text
<break time="0.4s" /> Need to work? Too many distractions.
<break time="0.5s" /> That's what Welockin is for.
<break time="0.5s" /> Set how long you need.
<break time="0.3s" /> Choose the distractions.
<break time="0.4s" /> Turn on hard lock-in.
<break time="0.5s" /> Block your computer, your iPhone, your iPad.
<break time="1.0s" /> One click, and you're locked in.
<break time="0.5s" /> No exit. No negotiating with yourself.
<break time="0.7s" /> Go ahead. Try to open it.
<break time="1.6s" /> Blocked on your laptop.
<break time="0.5s" /> Blocked on your phone.
<break time="0.5s" /> Every device, at the same time.
<break time="1.0s" /> Welockin. Lock in.
```

### Where each line is meant to sit

| Line | Target in | Lands on |
| --- | --- | --- |
| Need to work? Too many distractions. | 0.4 | the doomscroll, under *Shouldn't you be working?* |
| That's what Welockin is for. | 3.3 | the logo, as the padlock closes |
| Set how long you need. | 5.6 | the duration scrubbing to 02:00 |
| Choose the distractions. | 7.7 | Deep Work being ticked |
| Turn on hard lock-in. | 9.3 | the toggle going red |
| Block your computer, your iPhone, your iPad. | 11.3 | the three devices ticking |
| One click, and you're locked in. | 15.1 | the padlock closing |
| No exit. No negotiating with yourself. | 17.9 | the 2:00:00 countdown |
| Go ahead. Try to open it. | 21.0 | instagram.com being typed |
| *(silence)* | 23.x | **the block page lands on its own -- the joke needs the beat** |
| Blocked on your laptop. | 25.0 | the block page |
| Blocked on your phone. | 27.0 | the iPhone going dark |
| Every device, at the same time. | 29.0 | the locked phone |
| Welockin. Lock in. | 32.3 | the end card |

**Every line must end in a full stop, question mark, or exclamation mark.** This
is a hard requirement, not house style. `build-vo.sh` finds the line boundaries
by listening for the pauses between them, and a line ending in a comma is read
straight into the next one, leaving nothing to split on -- the two lines fuse and
every line after them is matched to the wrong beat.

### Why it reads this way

- **"Need to work? Too many distractions."** names the problem in the viewer's
  own words rather than telling them off. The brand is a firm hand on the
  shoulder, never a drill sergeant: the card on screen does the nudging, the
  voice does the understanding. Two short sentences, not one clause -- an
  11-word opener runs past the card and pushes every later line off its beat.
- **"Block your computer"**, not *your Mac*. The sheet on screen says MacBook,
  but the app ships on Windows too and the line has to hold for both.
- **"No exit. No negotiating with yourself."** The first half doubles the card
  underneath it (*No way out until the timer ends.*); the second half is the
  part that is **not** on screen, and it is the actual product -- not blocking,
  pre-commitment. If a line ever has to be cut for length, cut *No exit.*
- The voice never repeats a title card verbatim. Every line either sets up the
  card or pays it off.

---

## 3. ElevenLabs settings

Voice **Blain -- Conversational Ad Voice** on **Eleven Multilingual v2** is the
right pairing for this. Set:

| Control | Value | Why |
| --- | --- | --- |
| Speed | **centre, or one notch left** | The one setting that actually matters. See below. |
| Stability | ~65 % (right of centre) | Steady enough to sound decided. Fully stable goes flat. |
| Similarity | ~55 % (centre) | -- |
| Style exaggeration | low, ~20 % | Confident, not salesy. Pushing this is what makes ad reads sound like ad reads. |
| Speaker boost | on | -- |
| Output format | **MP3 44.1 kHz 128 kbps** | Matches what `build-vo.sh` expects. |

**Judge the Speed slider by the number, not by ear.** The export should come
back at roughly **30-34 s**. Blain is a fast voice: a first pass right of centre
came back at 26.98 s -- 3.5 words a second, seven seconds shorter than the film,
which is a rushed read rather than a mistimed one. `--retime` can rescue that
(section 4), but a calmer delivery suits a film about not rushing, so fix it at
the slider first and retime only for the remainder.

**Check the brand name on the first take.** `Welockin` should come out
*we-LOCK-in*. If it does not, re-spell that one word and regenerate -- try
`WeLockin`, then `We-Lock-In`. Do not change it in the caption file; that stays
spelled `Welockin`.

---

## 4. Putting it on the picture

Save the download as `public/videos/welock-draft-vo.mp3`, then:

```bash
./scripts/build-vo.sh
```

That writes `public/videos/welock-draft-vo.mp4` (video copied through untouched,
AAC 128 k audio, cut to the picture's exact length) and prints a table of where
every line actually landed. Read it before anything else:

```
line  words   spoken   words/s      target   starts    drift
   1      6    1.71s       3.5        0.40     0.50    +0.10
```

**Read the `words/s` column first.** It should be near-identical down the whole
table -- one voice, one pace. If it swings wildly, the tool has matched the
spans to the wrong lines and every other number is fiction; it says so, and
refuses to retime. The cause is nearly always a line that ends in a comma.

Once the pace column looks sane, read `drift`:

| What you see | What to do |
| --- | --- |
| Drift under ~0.3 s | Done. Ship it. |
| Every line out by the same amount | `--offset -0.4` shifts the whole track (negative pulls it earlier). |
| Drift growing line after line, and the read is shorter or longer than ~34 s | The read is the wrong *length*; sliding it cannot help. `--retime`. |
| One line out on its own | Change that line's break tag by the drift and regenerate. |

### `--retime`

```bash
./scripts/build-vo.sh --retime
```

Cuts the read at the silences and moves each line onto its own beat, rebuilding
the gaps around it. **Speech is never stretched or pitched** -- the delivery is
exactly as recorded, only the pauses change -- so a read that is seconds too
short is fixed without touching how it sounds. The film is a montage of distinct
beats, so the silence this opens up between lines reads as intent, not as
absence. It reports the resulting gap range; much past ~2.5 s and the read is
too short to carry the film, and the Speed slider is the better fix.

If `welock-draft-vo.mp4` is missing the hero simply plays the silent original,
so a half-finished pass never reaches the page.

---

## 5. What is wired to what

| File | Role |
| --- | --- |
| `public/videos/welock-draft.mp4` | Silent. The hero's ambient thumbnail loop, and the fallback. Never gets the audio track — it autoplays muted behind a poster and should stay light. |
| `public/videos/welock-draft-vo.mp3` | The ElevenLabs download. Input only; not served. |
| `public/videos/welock-draft-vo.mp4` | Silent picture + narration. **This is what the modal plays.** |
| `public/videos/welock-draft.vtt` | Captions for the narration. Offered in the player's menu, not forced on. |
| `src/components/home/Hero.tsx` | Ambient loop, the click, the modal, the fallback. |
