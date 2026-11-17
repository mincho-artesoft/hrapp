#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/../.."
test_dir=$(mktemp -d /tmp/hrapp-push-signout-tests.XXXXXX)
trap 'rm -rf "$test_dir"' EXIT
python3 - "$test_dir" <<'PY'
from pathlib import Path
import sys
root=Path(sys.argv[1])
s=Path('native/Calendar/Sources/InvitationPushRegistration.swift').read_text()
s=s.replace('import UIKit\n','').replace('import UserNotifications\n','')
a=s.index('    private func storageURL() throws -> URL {');b=s.index('\n    private func loadInstallation',a)
s=s[:a]+'    private func storageURL() throws -> URL { URL(fileURLWithPath: CommandLine.arguments[1]) }\n'+s[b:]
s=s.replace('[.atomic, .completeFileProtectionUntilFirstUserAuthentication]', '[.atomic]')
(root/'InvitationPushRegistration.swift').write_text(s)
PY
xcrun swiftc -swift-version 6 -D DEBUG -parse-as-library \
 "$test_dir/InvitationPushRegistration.swift" native/scripts/tests/InvitationPushSignOutTests.swift \
 -o "$test_dir/push-signout-tests"
"$test_dir/push-signout-tests" "$test_dir/installation.json"
