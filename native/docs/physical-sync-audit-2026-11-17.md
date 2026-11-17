# Physical calendar sync audit — 2026-11-17

## Environment and method

Debug builds of the `Calendar` target ran on the connected iPhone SE, iPad Air 11-inch M3, and native Mac. Mac and iPad used the same authenticated Cloud Calendars account; iPhone used the other account. Wonek was not built or modified.

The opt-in `--physical-sharing-audit` runner executed the application's actual stores, importers and sync services on each device. Calendar and event invitations were sent through the real Debug API, not injected into UI state. Fixtures were restricted to the `QA-PHYSICAL-20261117-A` namespace. Offline conflicts were staged by withholding sync on the two devices; in-flight edits were inserted deterministically after the actual upload snapshot was captured. These are service integration tests on physical devices, not an exhaustive UI automation or network-disconnection endurance test.

Only the Hetzner Debug backend was deployed: release `20261117-102508-account-local`. Production and legacy AWS storage were unchanged. SES continues to send invitations.

## Same-account local calendars

Previously, device replicas exposed local calendars to the website but did not import another device's personal local calendars. `AccountLocalCalendarSync` now gives these calendars an account-scoped identity and imports them into app-local storage on iOS and Mac. It runs only with an authenticated, verified-email Cloud Calendars session. Device-native, provider and received shared-calendar storage keep their existing sync paths.

Account ownership is retained locally so a calendar already bound to one account is not uploaded into a different signed-in account. The server enforces principal isolation, immutable replica scope and revision-based conditional writes. Remote deletion is retained as a tombstone; a stale device cannot resurrect the calendar. Concurrent changes to different events merge; conflicting changes to the same event converge on the first server commit.

| Physical test | Result |
| --- | --- |
| Personal calendar created on Mac appears once on iPad | Pass |
| Personal calendar created on iPad appears on Mac | Pass |
| Timed, all-day and multiday events; notes and time zone | Pass |
| iPad move, resize and calendar rename reach Mac | Pass |
| Independent offline edits are both preserved | Pass |
| Conflicting edits to one event converge | Pass |
| Repeated sync creates no duplicate calendar/event | Pass |
| Delete Mac → iPad and iPad → Mac, without resurrection | Pass |
| Personal calendar does not appear in the iPhone's different account | Pass |
| Calendar identity and subsequent editing survive Mac/iPad restart | Pass |
| Existing EventKit calendar identities remain unchanged | Pass |
| Unchanged personal calendars do not create extra server revisions | Pass |

## Sharing and access tests

- iPhone → Mac/iPad calendar invitations with Reader, Writer and Owner roles; reverse invitations from Mac/iPad → iPhone.
- Repeated calendar and individual-event acceptance retains the local identity.
- Reader event/calendar writes rejected with HTTP 403; Writer recipient-management requests rejected with HTTP 403; delegated Owner recipient access allowed.
- Writer and Owner move/resize changes propagate, including exact start/end times in the reverse direction.
- Shared-calendar event additions and deletions propagate without resurrection.
- Independent offline edits merge; same-event edits converge; stale revisions are rejected with HTTP 409.
- Reader → Writer upgrade, Writer → Reader downgrade, and revoked calendar/event access propagate to both same-account devices. An offline edit made before downgrade is not uploaded after access is lost.
- Calendar decline, re-invite, accept, leave and creator deletion were checked.
- Individual-event decline and delegated Owner cancellation were checked. Cancellation reaches all three devices; editing/reactivating a cancelled received event is rejected with HTTP 409. Cancelled/revoked copies are read-only.
- A second local edit during a real calendar upload survives on iPad/iPhone and reaches Mac on the next sync.

## Bugs found and repaired

1. Mac-created/added shared-calendar events used raw UUIDs where the server requires portable event identifiers, causing HTTP 400 and missing additions. Wire IDs are now canonical while local IDs are retained when applying server responses.
2. Reaccepting an individual invitation on Mac made another local copy. The account-wide server receipt was also overwritten when iPad accepted, which disconnected the Mac's existing copy from later edits. Mac now persists a device-local, account-scoped mapping from the shared event to its local copy and reuses it.
3. iOS could replace edits made while a calendar upload was in flight. Applying the server result now preserves later local edits and keeps the uploaded baseline for the next sync.
4. Cancelled individual events could remain editable in iOS. Cancellation now participates in edit/share availability and prevents outgoing upload attempts. Mac cancellation/unavailable state is persisted and used by event presentation.

The original failing assertions remain in the raw log. Each of the six application-failure assertions has a successful post-fix regression check. Two test-sequence corrections were necessary: re-inviting a declined calendar first saves the recipient again; the cancellation mutation probe must use the receiving Owner account rather than call the received-event endpoint as the creator.

## Validation and evidence

- Signed Debug Mac and iOS builds: successful; update-installed on all three devices with accounts/data preserved.
- Backend build and sharing suite: passed.
- Native calendar storage/route regressions: passed, including cross-device account edits, immutable scope, account isolation, unauthenticated HTTP 401, conflict detection and deletion.
- Standalone Swift Mac calendar merge/portable identifier regressions: passed.
- On-host detailed requests, responses, assertions and logs: `/tmp/hrapp-physical-matrix/`. Credentials were not written to the report or action output. Server fixture backup is permission-restricted.

This audit does not establish exhaustive coverage of every editor gesture, recurrence/attachment combination, provider outage, or account-switch UI flow. Individual invitations were explicitly accepted on each receiving platform; automatic discovery of an individually shared event on another same-account device without accepting it there was not established by these tests. Signed-out behavior is enforced by the session guard and authenticated endpoint checks; the user's existing accounts were not signed out for testing.

## Cleanup and final state

The normal Mac Calendar UI displayed the synced personal calendar once. QA calendars, native events and tracking were removed from all three devices; each device retained its baseline EventKit calendar inventory. A restricted backup was made before removing the 70 QA server objects and removing five QA events from one existing device-calendar replica (other events and calendar data were preserved).

After cleanup, all three devices synced again without recreating QA data; their QA invitation/share inventories were empty and Mac reported no sync error. All three were returned to normal launch flags. A temporary CoreDevice disconnection was retried successfully on iPhone. The final server inventory contained no QA objects or QA events awaiting removal.

The tests covered plain personal calendars and explicit shared-event imports. They do not prove duplicate-free automatic reconciliation of an individually shared event imported into different destination calendars on two devices; this remains outside the verified matrix.

Raw assertion ledger: 153 recorded assertions, 146 passing entries, six retained pre-fix application failures and one incorrect creator/receiver cancellation probe. The corresponding post-fix regressions and corrected receiving-Owner probe passed. No final verification assertion failed.
