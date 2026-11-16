#!/bin/bash
set -euo pipefail
repo_dir=$(cd "$(dirname "$0")/.." && pwd)
cd "$repo_dir"
# Do not use CODE_SIGNING_ALLOWED=NO: it strips the simulated App Group
# entitlements, separating the widget's cache from the main application.
# Ad-hoc simulator signing needs neither a device profile nor a signing cert.
xcodebuild -project 'Cloud Calendars for Google, Microsoft and iCloud.xcodeproj' \
    -scheme Calendar -configuration Debug \
    -destination 'generic/platform=iOS Simulator' \
    CODE_SIGN_IDENTITY=- CODE_SIGNING_ALLOWED=YES "$@"
