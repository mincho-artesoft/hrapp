#!/usr/bin/env bash
set -euo pipefail

OUT_DIR="${OUT_DIR:-$HOME/Desktop}"
STAMP="$(date +%Y%m%d-%H%M%S)"
RAW_MOV="$OUT_DIR/cloud-calendars-oauth-raw-$STAMP.mov"
OUT_MP4="$OUT_DIR/cloud-calendars-google-oauth-demo.mp4"
MAX_SECONDS="${MAX_SECONDS:-90}"
FFMPEG_BIN="${FFMPEG_BIN:-$(command -v ffmpeg || echo /opt/homebrew/bin/ffmpeg)}"

cat <<'EOF'
======================================================================
  Cloud Calendars — Google OAuth Verification Demo Recorder
======================================================================
ПРЕДИ да натиснеш [Enter] (подготовка без запис):
  А) В таба myaccount.google.com/connections:
     -> Кликни на "Cloud Calendars" -> "Delete all connections..." ->
        Confirm, след което ЗАТВОРИ този таб (НЕ излизай от Google профила си!).
  Б) В таба cloud-calendars.com/calendar/:
     -> Ако горе вдясно виждаш имейла си, цъкни "Sign out" до него
        (това изчиства само сесията в Chrome, без да трие събитията ти).

Какво правиш ПО ВРЕМЕ на записа (35–50 сек.):
  1. В https://www.cloud-calendars.com/calendar/ цъкни бутона горе вдясно
     "Sign in (Google / Microsoft / Email)" -> избери "Continue with Google".
  2. Когато излезе OAuth popup прозорецът на accounts.google.com:
     -> Разшири леко popup-а надясно за 2-3 сек., за да се вижда в
        горния му URL бар: client_id=540859420644-v48f1d7of1pcmn5fbautiormsmqa7rtd...
     -> Ако езикът долу вляво на popup-а е български, смени го на
        "English (United States)".
     -> Минаваш през екрана за съгласие (Advanced -> Go to
        cloud-calendars.com -> отмяташ правата -> Continue).
  3. След като се зареди календарът ти, премести с drag-and-drop (или
     създай) едно събитие.
  4. Цъкни на съседния таб Google Calendar (calendar.google.com), за да
     се види, че събитието е синхронизирано на новия час.
  5. Спри записа от иконата [⏹ Stop] горе вдясно в macOS Menu Bar
     (или с клавишна комбинация Cmd + Ctrl + Esc).
======================================================================
EOF

echo ""
echo "▸ Отварям Google Chrome с подготвителния таб и двата таба за записа..."
open -a "Google Chrome" \
  "https://myaccount.google.com/connections?hl=en" \
  "https://calendar.google.com/calendar/u/0/r/week?hl=en" \
  "https://www.cloud-calendars.com/calendar/"

echo ""
read -r -p "Подреди прозореца на основния екран и натисни [Enter], за да започне записът..."

for i in 3 2 1; do
  echo "  Запис след $i..."
  sleep 1
done

osascript -e 'tell application "Google Chrome" to activate' >/dev/null 2>&1 || true

echo ""
echo "🔴 ЗАПИСЪТ ТЕЧЕ (макс. ${MAX_SECONDS} сек., без микрофон)."
echo "👉 Когато си готов, цъкни [⏹] горе в Menu Bar (или Cmd + Ctrl + Esc)."

screencapture -v -k -x -D 1 -V "$MAX_SECONDS" "$RAW_MOV"

if [[ ! -s "$RAW_MOV" ]]; then
  echo "❌ Записът не създаде файл ($RAW_MOV). Провери дали Terminal има Screen Recording права в System Settings -> Privacy & Security -> Screen & System Audio Recording."
  exit 1
fi

echo ""
echo "▸ Конвертирам към чист 1080p MP4 (без звук) за YouTube..."
"$FFMPEG_BIN" -y -hide_banner -loglevel error \
  -i "$RAW_MOV" \
  -vf "scale='min(1920,iw)':-2,fps=30" \
  -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p -movflags +faststart \
  -an \
  "$OUT_MP4"

echo ""
echo "✅ ГОТОВО!"
echo "   MP4 за YouTube (Unlisted): $OUT_MP4"
echo "   Суров запис (архив):       $RAW_MOV"

open -R "$OUT_MP4"
