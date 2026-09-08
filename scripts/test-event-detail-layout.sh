#!/bin/bash
set -euo pipefail
repo_dir=$(cd "$(dirname "$0")/.." && pwd)
test_dir=$(mktemp -d "${TMPDIR:-/tmp}/event-detail-layout.XXXXXX")
xcrun swiftc "$repo_dir/Calendar/AppLocal/EventDetailTimelineLayout.swift" \
    "$repo_dir/scripts/tests/EventDetailTimelineLayoutTests.swift" \
    -o "$test_dir/event-detail-layout-tests"
"$test_dir/event-detail-layout-tests"
xcrun swiftc "$repo_dir/Calendar/AppLocal/EventDetailTimelineLayout.swift" \
    "$repo_dir/Calendar/CalendarKit/TimedEventLayout.swift" \
    "$repo_dir/scripts/tests/TimedEventLayoutTests.swift" \
    -o "$test_dir/timed-event-layout-tests"
TZ=UTC "$test_dir/timed-event-layout-tests"
