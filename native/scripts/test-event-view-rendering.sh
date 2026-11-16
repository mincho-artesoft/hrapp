#!/bin/bash
set -euo pipefail
repo_dir=$(cd "$(dirname "$0")/.." && pwd)
simulator_id="${1:-1A67A8FA-A72D-4244-9C1C-551D1C473FD4}"
test_dir=$(mktemp -d "${TMPDIR:-/tmp}/event-view-rendering.XXXXXX")
test_app="$test_dir/EventViewTests.app"
test_bundle="com.hrapp.eventview-regression-tests"
mkdir "$test_app"
cp "$repo_dir/scripts/tests/EventViewRenderingTests-Info.plist" "$test_app/Info.plist"
xcrun swiftc -sdk "$(xcrun --sdk iphonesimulator --show-sdk-path)" \
    -target "$(uname -m)-apple-ios18.0-simulator" \
    "$repo_dir/Calendar/CalendarKit/EventDescriptor.swift" \
    "$repo_dir/Calendar/CalendarKit/BasicEvent.swift" \
    "$repo_dir/Calendar/CalendarKit/EventLayoutAttributes.swift" \
    "$repo_dir/Calendar/CalendarKit/EventResizeHandleDotView.swift" \
    "$repo_dir/Calendar/CalendarKit/EventResizeHandleView.swift" \
    "$repo_dir/Calendar/CalendarKit/EventTimelineColors.swift" \
    "$repo_dir/Calendar/CalendarKit/EventView.swift" \
    "$repo_dir/Calendar/CalendarKit/TimedEventLayout.swift" \
    "$repo_dir/Calendar/AppLocal/EventDetailTimelineLayout.swift" \
    "$repo_dir/scripts/tests/EventViewRenderingTests.swift" \
    -o "$test_app/EventViewTests"
codesign --force --sign - "$test_app"
xcrun simctl install "$simulator_id" "$test_app"
trap 'xcrun simctl uninstall "$simulator_id" "$test_bundle" >/dev/null 2>&1 || true' EXIT
xcrun simctl launch "$simulator_id" "$test_bundle"
test_data=$(xcrun simctl get_app_container "$simulator_id" "$test_bundle" data)
for attempt in {1..30}; do
    if [[ -f "$test_data/Documents/result.json" ]]; then
        cp "$test_data/Documents/result.json" "$test_dir/result.json"
        jq . "$test_dir/result.json"
        jq -e '.status == "PASS"' "$test_dir/result.json" >/dev/null
        xcrun simctl io "$simulator_id" screenshot "$test_dir/preview.png"
        echo "Rendering artifacts: $test_dir"
        exit 0
    fi
    sleep 1
done
echo "Rendering tests did not produce a result; artifacts: $test_dir" >&2
exit 1
