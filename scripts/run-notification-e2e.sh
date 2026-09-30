#!/bin/bash
set -euo pipefail
role="${1:?sender receiver arabic}"
action="${2:?notifications action}"
output_dir="${3:?report directory}"
case "$role" in
  sender) simulator_id=3ED181D6-AEEC-42C0-B77B-F1F4CADB051E ;;
  receiver) simulator_id=742C50AD-4799-4697-8E62-7259448E36C0 ;;
  arabic) simulator_id=A70C6A27-AD63-4D44-A1E1-C1AA30CA1334 ;;
  *) exit 2 ;;
esac
case "$action" in notifications-prepare|notifications-observe|notifications-cleanup|notifications-push-register|notifications-push-observe) ;; *) exit 2 ;; esac
app_data=$(xcrun simctl get_app_container "$simulator_id" Deksan.CalendarASD data)
test_data="$app_data/Documents/NotificationDeliveryE2E"
mkdir -p "$output_dir/$role"
result="$test_data/$action.json"
if test -f "$result"; then mv "$result" "$output_dir/$role/$action-previous-$(date +%s).json"; fi
SIMCTL_CHILD_LOCAL_SHARING_E2E_ACTION="$action" xcrun simctl launch --terminate-running-process \
  "$simulator_id" Deksan.CalendarASD -EventEditorReferencePreview NO -ResetAndSeedSimulatorCalendars NO -ScreenshotMode NO
for attempt in {1..90}; do
  if test -f "$result"; then
    cp "$result" "$output_dir/$role/$action.json"
    if test -f "$test_data/state.json"; then cp "$test_data/state.json" "$output_dir/$role/state.json"; fi
    jq . "$result"
    jq -e '.status == "PASS" or .status == "OBSERVED"' "$result" >/dev/null
    exit
  fi
  sleep 1
done
echo "Timed out waiting for $role/$action" >&2
exit 1
