#!/usr/bin/env bash
#
# Lay the ElevenLabs narration onto the silent hero film.
#
#   ./scripts/build-vo.sh [--retime] [--offset SECONDS] [--dry-run]
#
# Reads  public/videos/welock-draft.mp4    (silent picture, never modified)
#      + public/videos/welock-draft-vo.mp3 (the ElevenLabs download)
# Writes public/videos/welock-draft-vo.mp4 (what the hero modal plays)
#
# The picture is stream-copied, so this re-encodes audio only and is lossless
# for video. Audio is padded or cut to the picture's exact length, so the two
# can never disagree about where the film ends.
#
#   (no flag)  mux as-is, and report where every line landed
#   --offset   shift the whole track (negative = earlier), for a read that is
#              uniformly late or early but correctly paced
#   --retime   move each line onto its own beat and rebuild the silence between
#              them. Use when the read is the wrong LENGTH rather than merely
#              displaced -- a voice reading faster or slower than the beat sheet
#              assumes cannot be fixed by sliding it. Speech is never stretched,
#              so the delivery is untouched; only the gaps change.

set -euo pipefail

cd "$(dirname "$0")/.."

VIDEO="public/videos/welock-draft.mp4"
AUDIO="public/videos/welock-draft-vo.mp3"
OUT="public/videos/welock-draft-vo.mp4"

# Line onsets and word counts from VOICEOVER.md section 2. The word counts are
# not decoration: they are how the analyser works out which detected spans
# belong to which line. Change the script, change both.
TARGETS="0.4,3.3,5.6,7.7,9.3,11.3,15.1,17.9,21.0,25.0,27.0,29.0,32.3"
WORDS="6,5,5,3,4,7,6,6,6,4,4,6,3"
SYLLABLES="9,7,5,5,5,11,6,12,8,5,4,8,5"

OFFSET=0
RETIME=0
DRY_RUN=0
while [ $# -gt 0 ]; do
  case "$1" in
    --offset) OFFSET="${2:?--offset needs a value in seconds}"; shift 2 ;;
    --retime) RETIME=1; shift ;;
    --dry-run) DRY_RUN=1; shift ;;
    -h|--help) sed -n '2,26p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "unknown flag: $1" >&2; exit 2 ;;
  esac
done

command -v ffmpeg  >/dev/null || { echo "ffmpeg not found (brew install ffmpeg)" >&2; exit 1; }
command -v ffprobe >/dev/null || { echo "ffprobe not found (brew install ffmpeg)" >&2; exit 1; }
command -v python3 >/dev/null || { echo "python3 not found" >&2; exit 1; }
[ -f "$VIDEO" ] || { echo "missing $VIDEO" >&2; exit 1; }
if [ ! -f "$AUDIO" ]; then
  echo "missing $AUDIO" >&2
  echo "Export the ElevenLabs read as MP3 and save it there. See VOICEOVER.md section 4." >&2
  exit 1
fi

dur() { ffprobe -v error -show_entries format=duration -of csv=p=0 "$1"; }
VDUR=$(dur "$VIDEO")
ADUR=$(dur "$AUDIO")

printf '\n  picture  %6.2fs  %s\n' "$VDUR" "$VIDEO"
printf '  read     %6.2fs  %s\n'   "$ADUR" "$AUDIO"
[ "$OFFSET" != "0" ] && printf '  offset   %+6.2fs\n' "$OFFSET"
[ "$RETIME" = "1" ]  && printf '  retime   on\n'
printf '\n'

# 0.15s is low enough to catch the pause a full stop leaves inside a line, which
# the analyser needs: it groups spans back into lines rather than assuming one
# span per line.
rm -f /tmp/vo_filter.txt
ffmpeg -v info -i "$AUDIO" -af "silencedetect=noise=-35dB:d=0.15" -f null - 2>&1 \
  | python3 scripts/vo_analyse.py \
      --targets "$TARGETS" --words "$WORDS" --syllables "$SYLLABLES" \
      --duration "$ADUR" --video "$VDUR" --offset "$OFFSET" \
      $([ "$RETIME" = "1" ] && echo --retime)
printf '\n'

[ "$DRY_RUN" = "1" ] && { echo "  --dry-run: nothing written."; exit 0; }

if [ "$RETIME" = "1" ]; then
  [ -f /tmp/vo_filter.txt ] || { echo "  retime produced no filter" >&2; exit 1; }
  ffmpeg -v error -y -i "$VIDEO" -i "$AUDIO" \
    -filter_complex "$(cat /tmp/vo_filter.txt);[vo]apad[a]" \
    -map 0:v:0 -map "[a]" \
    -c:v copy -c:a aac -b:a 128k -ar 44100 -ac 2 \
    -t "$VDUR" -movflags +faststart \
    "$OUT"
else
  # Shift, then pad-and-cut to the picture's exact length. apad guarantees the
  # audio is never the short one, -t makes the cut; together they pin the output
  # to VDUR whether the read came back long or short.
  if awk -v k="$OFFSET" 'BEGIN{exit !(k>0)}'; then
    MS=$(awk -v k="$OFFSET" 'BEGIN{printf "%d", k*1000}')
    FILTER="adelay=${MS}:all=1,apad"
  elif awk -v k="$OFFSET" 'BEGIN{exit !(k<0)}'; then
    S=$(awk -v k="$OFFSET" 'BEGIN{print -k}')
    FILTER="atrim=start=${S},asetpts=PTS-STARTPTS,apad"
  else
    FILTER="apad"
  fi
  ffmpeg -v error -y -i "$VIDEO" -i "$AUDIO" \
    -map 0:v:0 -map 1:a:0 \
    -c:v copy -c:a aac -b:a 128k -ar 44100 -ac 2 \
    -af "$FILTER" -t "$VDUR" -movflags +faststart \
    "$OUT"
fi

printf '  wrote %s  (%.2fs, %s)\n\n' "$OUT" "$(dur "$OUT")" \
  "$(ls -lh "$OUT" | awk '{print $5}')"
