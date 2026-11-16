#!/usr/bin/env bash
set -euo pipefail

OUT_DIR="${OUT_DIR:-$HOME/Desktop}"
PART1="$OUT_DIR/cloud-calendars-google-oauth-demo-trimmed.mp4"
STAMP="$(date +%Y%m%d-%H%M%S)"
RAW_PART2="$OUT_DIR/cloud-calendars-oauth-part2-raw-$STAMP.mov"
PART2_MP4="$OUT_DIR/cloud-calendars-oauth-part2-$STAMP.mp4"
FINAL_MP4="$OUT_DIR/cloud-calendars-google-oauth-FINAL.mp4"
MAX_SECONDS="${MAX_SECONDS:-75}"
FFMPEG_BIN="${FFMPEG_BIN:-$(command -v ffmpeg || echo /opt/homebrew/bin/ffmpeg)}"

if [[ ! -s "$PART1" ]]; then
  echo "❌ Липсва първата част: $PART1"
  exit 1
fi

cat <<'EOF'
======================================================================
  Cloud Calendars — Google OAuth Demo (Част 2 + Сглобяване във FINAL)
======================================================================
Без да триеш връзката с Google и без да излизаш от профила:

Какво правиш ПО ВРЕМЕ на този кратък запис (~25–30 сек.):
  1. Показване на пълния OAuth Client ID:
     -> В https://www.cloud-calendars.com/calendar/ цъкни бутона долу
        вляво "Google 2-Way Synced ✓".
     -> Веднага се отваря OAuth popup-ът ("Choose an account"). Хвани
        десния му ръб и го РАЗШИРИ широко надясно за 3 сек., така че в
        горния URL бар да се чете целият:
        client_id=540859420644-v48f1d7of1pcmn5fbautiormsmqa7rtd.apps.googleusercontent.com
     -> Цъкни върху mincho.milev@gmail.com (затваря се сам след секунда).
  2. Създаване на тестово събитие в Cloud Calendars:
     -> Цъкни синия бутон "+ New Event" горе вляво, напиши заглавие
        напр. "Google OAuth Demo Sync" и натисни "Create Event" / Save
        (по желание може и да го преместиш с drag-and-drop).
  3. Показване в Google Calendar:
     -> Превключи на съседния таб "Google Calendar" (calendar.google.com),
        задръж 3–4 сек. върху новото събитие (може да цъкнеш върху него,
        за да се отвори детайлът му).
  4. Спри записа от иконата [⏹ Stop] горе в macOS Menu Bar
     (или с Cmd + Ctrl + Esc).
======================================================================
EOF

echo ""
echo "▸ Активирам Google Chrome с двата таба..."
open -a "Google Chrome" \
  "https://calendar.google.com/calendar/u/0/r/week?hl=en" \
  "https://www.cloud-calendars.com/calendar/"

echo ""
read -r -p "Когато си на таба cloud-calendars.com/calendar/, натисни [Enter] за старт на Част 2..."

for i in 3 2 1; do
  echo "  Запис след $i..."
  sleep 1
done

osascript -e 'tell application "Google Chrome" to activate' >/dev/null 2>&1 || true

echo ""
echo "🔴 ЗАПИСВАМ ЧАСТ 2 (макс. ${MAX_SECONDS} сек., без микрофон)."
echo "👉 Когато си готов, цъкни [⏹] горе в Menu Bar (или Cmd + Ctrl + Esc)."

screencapture -v -k -x -D 1 -V "$MAX_SECONDS" "$RAW_PART2"

if [[ ! -s "$RAW_PART2" ]]; then
  echo "❌ Записът не създаде файл ($RAW_PART2)."
  exit 1
fi

echo ""
echo "▸ Конвертирам Част 2 и я залепвам към готовите 41.5 сек...."
"$FFMPEG_BIN" -y -hide_banner -loglevel error \
  -i "$RAW_PART2" \
  -vf "scale=1920:1242:force_original_aspect_ratio=decrease,pad=1920:1242:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=30" \
  -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p -an \
  "$PART2_MP4"

"$FFMPEG_BIN" -y -hide_banner -loglevel error \
  -i "$PART1" \
  -i "$PART2_MP4" \
  -filter_complex "[0:v]setsar=1,fps=30[v0];[1:v]setsar=1,fps=30[v1];[v0][v1]concat=n=2:v=1:a=0[outv]" \
  -map "[outv]" \
  -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p -movflags +faststart -an \
  "$FINAL_MP4"

echo ""
echo "✅ ГОТОВО! Обединеното видео е записано в:"
echo "   $FINAL_MP4"
echo "   (Отделна Част 2 при нужда от подрязване: $PART2_MP4)"

open -R "$FINAL_MP4"
