#!/bin/bash
set -euo pipefail
repo_dir=$(cd "$(dirname "$0")/.." && pwd)
simulator_id="${1:-1A67A8FA-A72D-4244-9C1C-551D1C473FD4}"
output_dir="${2:?Supply an output directory}"
test_dir=$(mktemp -d "${TMPDIR:-/tmp}/event-extension-snapshots.XXXXXX")
test_app="$test_dir/EventExtensionSnapshots.app"
test_bundle="com.hrapp.event-extension-snapshots"
mkdir -p "$test_app" "$output_dir"
cp "$repo_dir/scripts/tests/EventViewRenderingTests-Info.plist" "$test_app/Info.plist"
/usr/libexec/PlistBuddy -c "Set CFBundleIdentifier $test_bundle" "$test_app/Info.plist"
/usr/libexec/PlistBuddy -c 'Set CFBundleExecutable EventExtensionSnapshots' "$test_app/Info.plist"
for source in CalendarWidget/CalendarWidget.swift CalendarWidget/CalendarLiveActivityWidget.swift CalendarAppClip/EventClipPreviewView.swift; do
    cp "$repo_dir/$source" "$test_dir/$(basename "$source")"
done
# Access control only: layouts remain the real production source. WidgetKit
# family cannot be overridden, so call each concrete family's body directly.
perl -0pi -e 's/\bprivate //g; s/^\@main\n//mg; s/\n#Preview \{[\s\S]*$//;' "$test_dir/CalendarWidget.swift" "$test_dir/CalendarLiveActivityWidget.swift" "$test_dir/EventClipPreviewView.swift"
xcrun swiftc -D DEBUG -sdk "$(xcrun --sdk iphonesimulator --show-sdk-path)" \
    -target "$(uname -m)-apple-ios18.0-simulator" \
    "$repo_dir/Calendar/CalendarKit/EventTimelineColors.swift" \
    "$repo_dir/Calendar/CalendarKit/CalendarEventCard.swift" \
    "$repo_dir/Calendar/Screenshots/EventSurfaceSnapshotSupport.swift" \
    "$repo_dir/CalendarAppClip/SharedEventPayload.swift" \
    "$test_dir/CalendarWidget.swift" "$test_dir/CalendarLiveActivityWidget.swift" "$test_dir/EventClipPreviewView.swift" \
    "$repo_dir/scripts/tests/EventExtensionSnapshots.swift" -o "$test_app/EventExtensionSnapshots"
cp -R "$repo_dir/CalendarWidget/Assets.xcassets" "$test_dir/Assets.xcassets"
cp -R "$repo_dir/CalendarAppClip/Assets.xcassets/AppClipHeaderIcon.imageset" "$test_dir/Assets.xcassets/"
xcrun actool "$test_dir/Assets.xcassets" --compile "$test_app" --platform iphonesimulator --minimum-deployment-target 18.0 --target-device iphone > "$test_dir/assets.log"
mkdir "$test_app/en.lproj"
cp "$repo_dir/CalendarWidget/en.lproj/Localizable.strings" "$test_app/en.lproj/Localizable.strings"
if [[ -n "${3:-}" ]]; then cp -R "$3" "$test_app/html"; fi
codesign --force --sign - "$test_app"
xcrun simctl install "$simulator_id" "$test_app"
trap 'xcrun simctl uninstall "$simulator_id" "$test_bundle" >/dev/null 2>&1 || true' EXIT
if [[ "${FULL_SCREEN_APP_CLIP_CAPTURE:-0}" == "1" ]]; then
    original_appearance=$(xcrun simctl ui "$simulator_id" appearance)
    trap 'xcrun simctl ui "$simulator_id" appearance "$original_appearance" >/dev/null; xcrun simctl uninstall "$simulator_id" "$test_bundle" >/dev/null 2>&1 || true' EXIT
    for theme in light dark; do
        xcrun simctl ui "$simulator_id" appearance "$theme"
        SIMCTL_CHILD_FULL_SCREEN_APP_CLIP=1 xcrun simctl launch --terminate-running-process "$simulator_id" "$test_bundle"
        sleep 3
        xcrun simctl io "$simulator_id" screenshot "$output_dir/app-clip-preview-$theme.png"
    done
    exit 0
fi
if [[ "${FULL_SCREEN_HTML_CAPTURE:-0}" == "1" ]]; then
    test_data=$(xcrun simctl get_app_container "$simulator_id" "$test_bundle" data)
    original_appearance=$(xcrun simctl ui "$simulator_id" appearance)
    trap 'xcrun simctl ui "$simulator_id" appearance "$original_appearance" >/dev/null; xcrun simctl uninstall "$simulator_id" "$test_bundle" >/dev/null 2>&1 || true' EXIT
    for theme in light dark; do
        xcrun simctl ui "$simulator_id" appearance "$theme"
        for file in "$test_app/html/"*.html; do
            template=$(basename "$file" .html)
            capture_id="$template-$theme-$(uuidgen)"
            SIMCTL_CHILD_FULL_SCREEN_TEMPLATE="$template" SIMCTL_CHILD_FULL_SCREEN_CAPTURE_ID="$capture_id" xcrun simctl launch --terminate-running-process "$simulator_id" "$test_bundle"
            ready=0
            for attempt in {1..30}; do
                if [[ -f "$test_data/Documents/full-screen-ready.txt" ]] && [[ "$(<"$test_data/Documents/full-screen-ready.txt")" == "$capture_id" ]]; then ready=1; break; fi
                sleep 1
            done
            [[ "$ready" == "1" ]] || { echo "Template did not load: $template" >&2; exit 1; }
            # Navigation completion can precede WebKit's final text paint.
            sleep 3
            xcrun simctl io "$simulator_id" screenshot "$output_dir/$template-$theme.png"
        done
    done
    exit 0
fi
xcrun simctl launch "$simulator_id" "$test_bundle"
test_data=$(xcrun simctl get_app_container "$simulator_id" "$test_bundle" data)
for attempt in {1..45}; do
    if [[ -f "$test_data/Documents/EventSurfaceSnapshots/complete.txt" ]]; then
        cp "$test_data/Documents/EventSurfaceSnapshots/"*.png "$output_dir/"
        echo "Extension snapshots: $output_dir"
        exit 0
    fi
    sleep 1
done
echo "Snapshots did not finish: $test_dir" >&2
exit 1
