# HRApp simulator workflow

- After changes to application code, run a Debug build and update-install it on both HRApp simulators, then launch and verify the affected UI:
  - Sender (English US, iPhone 11): `B4B9D2E4-C431-4B1C-B41F-2A58A73E6252`
  - Receiver (English US, iPhone Duo, iOS 27.1): `E4FA2729-52EB-4B2E-A119-47A251746142`
- The user requested only Sender and Receiver on 2026-10-20; an Arabic simulator is not required.
- The user requested iPhone Duo for one of the two simulators on 2026-10-20. The previous Receiver (`0AF6E322-DAA0-4C9E-BA23-D64ACD31223F`, iPhone 17) is retained shut down as `HRApp Receiver Backup — iPhone 17` to preserve its data; it is not part of the build/install workflow.
- Bundle identifier: `Deksan.CalendarASD`. Preserve simulator data, accounts, language and appearance during ordinary build/install cycles. Uninstalling or reseeding is a separate, explicitly requested operation.
- Do not include other booted simulators in this workflow.
- These are fresh instances created on 2026-10-20 after the previous HRApp simulator UUIDs were found to be absent. Do not restore their accounts or caches. Do not sign into iCloud or delete real synced iCloud data without explicit authorization. If native calendars are explicitly seeded, use independent device-local EventKit storage on each simulator.
- Backend deployments are Debug-only until the user explicitly requests a production deployment. Never clear production storage as part of Debug cleanup.
- For normal app launches, disable test fixtures with `-EventEditorReferencePreview NO -ResetAndSeedSimulatorCalendars NO -ScreenshotMode NO`.
