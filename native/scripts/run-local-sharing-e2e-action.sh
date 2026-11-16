#!/bin/bash
set -euo pipefail
role="${1:?sender or receiver}"
action="${2:?test action}"
output_dir="${3:?report directory}"
case "$role" in
    sender) simulator_id=1A67A8FA-A72D-4244-9C1C-551D1C473FD4 ;;
    receiver) simulator_id=786598BD-4158-4A5B-851F-8E04FDE3BC98 ;;
    *) exit 2 ;;
esac
case "$action" in
    accept|owner-update|receiver-check|writer-role|writer-update|owner-check-writer|revoke|receiver-check-revoked) ;;
    *) exit 2 ;;
esac
app_data=$(xcrun simctl get_app_container "$simulator_id" Deksan.CalendarASD data)
test_data="$app_data/Documents/LocalSharingE2E"
test -f "$test_data/manifest.json"
mkdir -p "$output_dir"
result="$test_data/result-$action.json"
if test -f "$result"; then
    mv "$result" "$output_dir/$role-$action-previous-$(date +%s).json"
fi
SIMCTL_CHILD_LOCAL_SHARING_E2E_ACTION="$action" xcrun simctl launch --terminate-running-process \
    "$simulator_id" Deksan.CalendarASD -EventEditorReferencePreview NO -ResetAndSeedSimulatorCalendars NO -ScreenshotMode NO
for attempt in {1..50}; do
    if test -f "$result"; then
        cp "$result" "$output_dir/$role-$action.json"
        cp "$test_data/manifest.json" "$output_dir/$role-manifest.json"
        jq . "$result"
        jq -e '.status == "PASS"' "$result" >/dev/null
        exit
    fi
    sleep 1
done
echo "Timed out waiting for $role/$action" >&2
exit 1
