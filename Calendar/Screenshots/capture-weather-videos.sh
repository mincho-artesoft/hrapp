#!/bin/zsh

set -euo pipefail

if [[ $# -lt 2 ]]; then
    print -u2 "Usage: $0 <simulator-udid|booted> <path-to-debug-app> [output-directory]"
    exit 64
fi

device_id="$1"
app_path="$2"
output_directory="${3:-$PWD/WeatherPreviewVideos}"
bundle_id="Deksan.CalendarASD"

conditions=(
    blizzard
    blowingDust
    blowingSnow
    breezy
    clear
    cloudy
    drizzle
    flurries
    foggy
    freezingDrizzle
    freezingRain
    frigid
    hail
    haze
    heavyRain
    heavySnow
    hot
    hurricane
    isolatedThunderstorms
    mostlyClear
    mostlyCloudy
    partlyCloudy
    rain
    scatteredThunderstorms
    sleet
    smoky
    snow
    strongStorms
    sunFlurries
    sunShowers
    thunderstorms
    tropicalStorm
    windy
    wintryMix
)

mkdir -p "$output_directory"
xcrun simctl install "$device_id" "$app_path"
xcrun simctl privacy "$device_id" grant location "$bundle_id" >/dev/null
xcrun simctl privacy "$device_id" grant calendar "$bundle_id" >/dev/null
xcrun simctl privacy "$device_id" grant notifications "$bundle_id" >/dev/null 2>&1 || true

capture_video() {
    local condition="$1"
    local filename="$2"
    shift 2
    raw_video="$(mktemp -t "weather-${condition}").mp4"
    final_video="$output_directory/${filename}.mp4"

    xcrun simctl launch --terminate-running-process "$device_id" "$bundle_id" \
        -ScreenshotMode 1 \
        -ScreenshotScreen weather \
        -WeatherPreviewCondition "$condition" \
        -AppleLanguages '(en)' \
        -AppleLocale en_US \
        "$@" >/dev/null

    sleep 1.2
    xcrun simctl io "$device_id" recordVideo --codec=h264 --force "$raw_video" >/dev/null 2>&1 &
    recorder_pid=$!
    sleep 2.8
    kill -INT "$recorder_pid"
    wait "$recorder_pid" || true

    ffmpeg -hide_banner -loglevel error -y -i "$raw_video" \
        -an -vf "fps=24,scale=540:-2:flags=lanczos" \
        -c:v libx264 -preset veryfast -crf 27 -pix_fmt yuv420p -movflags +faststart \
        "$final_video"
    rm -f "$raw_video"
    print "$filename"
}

for condition in "${conditions[@]}"; do
    capture_video "$condition" "$condition"
done

# Extra astronomical comparisons: stars fade with cloud cover, while the
# moon follows its nightly arc and uses the supplied forecast phase.
capture_video clear clearNightWaxingGibbous \
    -WeatherPreviewSky night -WeatherPreviewMoonPhase waxingGibbous
capture_video partlyCloudy partlyCloudyNightFirstQuarter \
    -WeatherPreviewSky night -WeatherPreviewMoonPhase firstQuarter
capture_video cloudy cloudyNightFullMoon \
    -WeatherPreviewSky night -WeatherPreviewMoonPhase full

xcrun simctl terminate "$device_id" "$bundle_id" >/dev/null 2>&1 || true
