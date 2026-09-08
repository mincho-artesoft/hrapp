# HRApp simulator workflow

- After changes to application code, run a Debug build and update-install it on all three HRApp simulators, then launch and verify the affected UI:
  - Sender (English US): `1A67A8FA-A72D-4244-9C1C-551D1C473FD4`
  - Receiver (English US): `786598BD-4158-4A5B-851F-8E04FDE3BC98`
  - Arabic: `6CC8E36B-735C-440C-9AAA-47069C0C310E`
- Bundle identifier: `Deksan.CalendarASD`. Preserve simulator data, accounts, language and appearance during ordinary build/install cycles. Uninstalling or reseeding is a separate, explicitly requested operation.
- Do not include other booted simulators in this workflow.
- These are fresh instances created on 2026-09-08; the previous three instances were explicitly deleted at the user's request. Do not restore their accounts or caches. Do not sign into iCloud or delete real synced iCloud data without explicit authorization. Seeded native calendars use independent device-local EventKit storage on all three.
- Backend deployments are Debug-only until the user explicitly requests a production deployment. Never clear production storage as part of Debug cleanup.
- For normal app launches, disable test fixtures with `-EventEditorReferencePreview NO -ResetAndSeedSimulatorCalendars NO -ScreenshotMode NO`.
