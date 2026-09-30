#!/bin/bash
set -euo pipefail
repo_dir=$(cd "$(dirname "$0")/.." && pwd)
cd "$repo_dir"
test_dir=$(mktemp -d "${TMPDIR:-/tmp}/travel-reminder-tests.XXXXXX")
# Compile the production recurrence DTO, without the unrelated networking layer.
python3 - "$test_dir/RecurrenceModels.swift" <<'PYMODEL'
import sys
from pathlib import Path
source = Path('Calendar/Sharing/CloudCalendarsAPI.swift').read_text()
models = source[source.index('struct SharedEventRecurrenceDay:'):source.index('struct SharedEventParticipant:')]
Path(sys.argv[1]).write_text('import Foundation\nimport EventKit\n' + models)
PYMODEL
xcrun swiftc "$test_dir/RecurrenceModels.swift" Calendar/Travel/TravelRecurrence.swift Calendar/Travel/TravelReminderSettings.swift Calendar/Travel/TravelReminderPolicy.swift scripts/tests/TravelRecurrenceTests.swift scripts/tests/TravelReminderPolicyTests.swift -o "$test_dir/travel-policy-tests"
"$test_dir/travel-policy-tests"
python3 - <<'PY'
import plistlib, subprocess
from pathlib import Path
locales = list(Path('Calendar').glob('*.lproj/Localizable.strings'))
expected = {'title','question','enable','notnow','explanation','pending','permissions','unavailable','scheduled','notification','transport','driving','walking','transit','buffer','advance'}
for locale in locales:
    file = locale.with_name('CalendarTravel.strings')
    raw = subprocess.check_output(['plutil','-convert','xml1','-o','-',str(file)])
    values = plistlib.loads(raw)
    assert set(values) == {'travel.' + key for key in expected}, file
    assert all(values.values()), file
    assert values['travel.notification'].count('%@') == 2, file
    subprocess.run(['plutil','-lint',str(locale.with_name('InfoPlist.strings'))],check=True,stdout=subprocess.DEVNULL)
print(f'PASS: {len(locales)} travel translations, notification placeholders and permission resources')
PY
