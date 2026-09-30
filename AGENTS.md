# HRApp simulator workflow

- After changes to application code, run a Debug build and update-install it on all three HRApp simulators, then launch and verify the affected UI:
  - Sender (English US): `3ED181D6-AEEC-42C0-B77B-F1F4CADB051E`
  - Receiver (English US): `742C50AD-4799-4697-8E62-7259448E36C0`
  - Arabic: `A70C6A27-AD63-4D44-A1E1-C1AA30CA1334`
- Bundle identifier: `Deksan.CalendarASD`. Preserve simulator data, accounts, language and appearance during ordinary build/install cycles. Uninstalling or reseeding is a separate, explicitly requested operation.
- Do not include other booted simulators in this workflow.
- These are fresh instances created on 2026-09-30 with explicit user authorization; the previous three identifiers were no longer present in Xcode. Do not restore their accounts or caches. Do not sign into iCloud or delete real synced iCloud data without explicit authorization. Do not seed native calendars unless explicitly requested.
- Backend deployments are Debug-only until the user explicitly requests a production deployment. Never clear production storage as part of Debug cleanup.
- For normal app launches, disable test fixtures with `-EventEditorReferencePreview NO -ResetAndSeedSimulatorCalendars NO -ScreenshotMode NO`.
