#!/usr/bin/env bash
set -euo pipefail

# Read-only production smoke test for the two signed-in sharing accounts.
# It deliberately does not create events, calendars, invitations, or e-mails.

SENDER_UDID="${1:-E40E5DD1-EEE5-45A3-8FE6-445A5B837DE0}"
RECEIVER_UDID="${2:-29A386F0-28CE-4D25-8016-3A2AE1970CE1}"
APP_BUNDLE_ID="Deksan.CalendarASD"
API_BASE_URL="https://api.cloud-calendars.com"
TEST_TEMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TEST_TEMP_DIR"' EXIT

require_command() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Missing required command: $1" >&2
    exit 1
  }
}

require_command curl
require_command jq
require_command xcrun

smoke_device() {
  local udid="$1"
  local label="$2"
  local container session token email

  xcrun simctl boot "$udid" >/dev/null 2>&1 || true
  xcrun simctl bootstatus "$udid" -b >/dev/null
  container="$(xcrun simctl get_app_container "$udid" "$APP_BUNDLE_ID" data)"
  session="$container/Library/Application Support/CloudCalendars/feed-session.json"

  [[ -f "$session" ]] || {
    echo "FAIL $label: sharing session is missing" >&2
    exit 1
  }
  token="$(jq -er '.deviceToken | select(length > 0)' "$session")"
  email="$(jq -er '.email | select(length > 0)' "$session")"

  request_and_validate() {
    local path="$1"
    local jq_assertion="$2"
    local output="$TEST_TEMP_DIR/${label// /-}-$(echo "$path" | tr '/?' '--').json"
    local status
    status="$(curl --silent --show-error \
      --output "$output" \
      --write-out '%{http_code}' \
      --header "Authorization: Bearer $token" \
      --header 'Cache-Control: no-cache, no-store' \
      "$API_BASE_URL$path")"
    [[ "$status" == "200" ]] || {
      echo "FAIL $label $path: HTTP $status" >&2
      jq -c '{error, message}' "$output" 2>/dev/null || true
      exit 1
    }
    jq -e "$jq_assertion" "$output" >/dev/null || {
      echo "FAIL $label $path: unexpected response" >&2
      exit 1
    }
  }

  request_and_validate '/shared-state' '(.outgoing | type == "array") and (.received | type == "array")'
  request_and_validate '/event-invitations/pending' '.invitations | type == "array"'
  request_and_validate '/icloud-calendars-shared-with-me' '.calendars | type == "array"'
  request_and_validate '/icloud-calendar-invitations/pending' '.invitations | type == "array"'

  echo "PASS $label: authenticated sharing endpoints respond for $email"
}

smoke_device "$SENDER_UDID" 'sender simulator'
smoke_device "$RECEIVER_UDID" 'receiver simulator'
