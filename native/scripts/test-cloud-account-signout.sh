#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/../.."
test_dir=$(mktemp -d /tmp/hrapp-signout-tests.XXXXXX)
trap 'rm -rf "$test_dir"' EXIT
# Only the storage directory name differs, so tests cannot touch the app session.
python3 - "$test_dir" <<'PY'
import pathlib,sys,uuid
root=pathlib.Path(sys.argv[1]); folder='HRAppSignOutTests-'+uuid.uuid4().hex
source=pathlib.Path('native/Calendar/Sharing/CalendarFeedSession.swift').read_text()
source=source.replace('private static let storageDirectoryName = "CloudCalendars"',f'private static let storageDirectoryName = "{folder}"')
(root/'CalendarFeedSession.swift').write_text(source)
(root/'folder').write_text(folder)
PY
xcrun swiftc -swift-version 6 -D DEBUG -parse-as-library \
  native/Calendar/Sharing/ReceivedSharingVisibility.swift \
  "$test_dir/CalendarFeedSession.swift" \
  native/scripts/tests/CloudAccountSignOutTests.swift -o "$test_dir/signout-tests"
"$test_dir/signout-tests" "$(cat "$test_dir/folder")"
