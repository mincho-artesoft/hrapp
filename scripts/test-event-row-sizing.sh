#!/bin/bash
set -euo pipefail
repo_dir=$(cd "$(dirname "$0")/.." && pwd)
simulator_id="${1:?Pass an explicitly selected simulator UUID}"
test_dir=$(mktemp -d "${TMPDIR:-/tmp}/event-row-sizing.XXXXXX")
test_app="$test_dir/EventRowSizingTests.app"
test_bundle="com.hrapp.event-row-sizing-tests"
# This optional source directory lets a regression check run against an older
# copy of the two row files without changing the application working tree.
row_source_dir="${EVENT_ROW_SOURCE_DIR:-$repo_dir/Calendar/ListView}"
mkdir "$test_app"
cat > "$test_app/Info.plist" <<'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
<key>CFBundleIdentifier</key><string>com.hrapp.event-row-sizing-tests</string>
<key>CFBundleExecutable</key><string>EventRowSizingTests</string>
<key>CFBundleName</key><string>EventRowSizingTests</string>
<key>CFBundleVersion</key><string>1</string>
<key>CFBundlePackageType</key><string>APPL</string>
<key>MinimumOSVersion</key><string>18.0</string>
<key>UIDeviceFamily</key><array><integer>1</integer><integer>2</integer></array>
<key>UILaunchScreen</key><dict/>
<key>UIApplicationSceneManifest</key><dict>
<key>UIApplicationSupportsMultipleScenes</key><false/>
<key>UISceneConfigurations</key><dict/>
</dict>
</dict></plist>
PLIST
xcrun swiftc -sdk "$(xcrun --sdk iphonesimulator --show-sdk-path)" \
    -target "$(uname -m)-apple-ios18.0-simulator" \
    "$repo_dir/Calendar/CalendarKit/EventDescriptor.swift" \
    "$repo_dir/Calendar/CalendarKit/BasicEvent.swift" \
    "$repo_dir/Calendar/Sources/EKMultiDayWrapper.swift" \
    "$repo_dir/Calendar/Еxtensions/EKMultiDayWrapper+Extension.swift" \
    "$repo_dir/Calendar/Components/CalendarEventRowAccent.swift" \
    "$row_source_dir/EventRowView.swift" \
    "$row_source_dir/SearchEventRowView.swift" \
    "$repo_dir/scripts/tests/EventRowSizingTests.swift" \
    -o "$test_app/EventRowSizingTests"
codesign --force --sign - "$test_app"
xcrun simctl install "$simulator_id" "$test_app"
trap 'xcrun simctl uninstall "$simulator_id" "$test_bundle" >/dev/null 2>&1 || true' EXIT
xcrun simctl launch "$simulator_id" "$test_bundle"
test_data=$(xcrun simctl get_app_container "$simulator_id" "$test_bundle" data)
for attempt in {1..60}; do
    if [[ -f "$test_data/Documents/result.json" ]]; then
        cp "$test_data/Documents/result.json" "$test_dir/result.json"
        cat "$test_dir/result.json"
        echo
        echo "Sizing test artifacts: $test_dir"
        jq -e '.status == "PASS"' "$test_dir/result.json" >/dev/null
        exit 0
    fi
    sleep 1
done
echo "Sizing tests did not finish; artifacts: $test_dir" >&2
exit 1
