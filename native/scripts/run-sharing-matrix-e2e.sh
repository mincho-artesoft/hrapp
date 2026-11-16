#!/bin/bash
set -euo pipefail
role="${1:?sender or receiver}"
action="${2:?matrix action}"
output_dir="${3:?report directory}"
case "$role" in
  sender) simulator_id=1A67A8FA-A72D-4244-9C1C-551D1C473FD4 ;;
  receiver) simulator_id=786598BD-4158-4A5B-851F-8E04FDE3BC98 ;;
  *) exit 2 ;;
esac
case "$action" in matrix-seed|matrix-send|matrix-receiver|matrix-owner|matrix-repair) ;; *) exit 2 ;; esac
app_data=$(xcrun simctl get_app_container "$simulator_id" Deksan.CalendarASD data)
test_data="$app_data/Documents/SharingMatrixE2E"
mkdir -p "$output_dir" "$test_data"
if [[ "$role" == receiver && ! -f "$test_data/manifest.json" ]]; then
  sender_data=$(xcrun simctl get_app_container 1A67A8FA-A72D-4244-9C1C-551D1C473FD4 Deksan.CalendarASD data)
  cp "$sender_data/Documents/SharingMatrixE2E/manifest.json" "$test_data/manifest.json"
fi
result="$test_data/$action.json"
if test -f "$result"; then mv "$result" "$output_dir/$action-previous-$(date +%s).json"; fi
launch_output=$(SIMCTL_CHILD_LOCAL_SHARING_E2E_ACTION="$action" xcrun simctl launch --terminate-running-process \
  "$simulator_id" Deksan.CalendarASD -EventEditorReferencePreview NO -ResetAndSeedSimulatorCalendars NO -ScreenshotMode NO)
echo "$launch_output"
test_pid=${launch_output##*: }
case "$test_pid" in ''|*[!0-9]*) exit 2 ;; esac
for attempt in {1..400}; do
  if test -f "$result"; then
    cp "$result" "$output_dir/$action.json"
    cp "$test_data/manifest.json" "$output_dir/$role-manifest.json"
    jq . "$result"
    jq -e '.status == "PASS"' "$result" >/dev/null
    exit
  fi
  if ! kill -0 "$test_pid" 2>/dev/null; then
    echo "Test app exited without a report; inspect Simulator diagnostic reports." >&2
    exit 1
  fi
  sleep 1
done
echo "Timed out waiting for $role/$action" >&2
exit 1
