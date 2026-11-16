#!/bin/bash
set -euo pipefail
repo_dir=$(cd "$(dirname "$0")/.." && pwd)
simulator_id="${1:-1A67A8FA-A72D-4244-9C1C-551D1C473FD4}"
test_dir=$(mktemp -d "${TMPDIR:-/tmp}/local-timeline-store.XXXXXX")
test_app="$test_dir/LocalStoreTests.app"
test_bundle="com.hrapp.local-timeline-store-tests"
mkdir "$test_app"
cp "$repo_dir/scripts/tests/EventViewRenderingTests-Info.plist" "$test_app/Info.plist"
/usr/libexec/PlistBuddy -c "Set :CFBundleIdentifier $test_bundle" "$test_app/Info.plist"
/usr/libexec/PlistBuddy -c 'Add :NSCalendarsFullAccessUsageDescription string Test calendar transfers in an isolated regression calendar.' "$test_app/Info.plist"
xcrun swiftc -sdk "$(xcrun --sdk iphonesimulator --show-sdk-path)" \
    -target "$(uname -m)-apple-ios18.0-simulator" \
    "$repo_dir/Calendar/CalendarKit/EventDescriptor.swift" \
    "$repo_dir/Calendar/AppLocal/AppLocalCalendarStore.swift" \
    "$repo_dir/Calendar/AppLocal/AppLocalCalendarMerge.swift" \
    "$repo_dir/Calendar/Sources/EKMultiDayWrapper.swift" \
    "$repo_dir/Calendar/AppLocal/EventKitEventSupplementStore.swift" \
    "$repo_dir/Calendar/AppLocal/CalendarTimelineTransfer.swift" \
    "$repo_dir/scripts/tests/LocalSharingStoreTests.swift" \
    "$repo_dir/scripts/tests/LocalTimelineStoreTests.swift" \
    -o "$test_app/EventViewTests"
codesign --force --sign - "$test_app"
xcrun simctl install "$simulator_id" "$test_app"
xcrun simctl privacy "$simulator_id" grant calendar "$test_bundle"
trap 'xcrun simctl uninstall "$simulator_id" "$test_bundle" >/dev/null 2>&1 || true' EXIT
xcrun simctl launch "$simulator_id" "$test_bundle"
test_data=$(xcrun simctl get_app_container "$simulator_id" "$test_bundle" data)
for attempt in {1..30}; do
    if [[ -f "$test_data/Documents/result.json" ]]; then
        cp "$test_data/Documents/result.json" "$test_dir/result.json"
        jq . "$test_dir/result.json"
        jq -e '.status == "PASS"' "$test_dir/result.json" >/dev/null
        exit 0
    fi
    sleep 1
done
echo "Local timeline tests produced no result: $test_dir" >&2
exit 1
