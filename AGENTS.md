# HRApp simulator workflow

- After changes to application code, run a Debug build and update-install it on both HRApp simulators, then launch and verify the affected UI:
  - Sender (English US, iPhone 17, iOS 27.0): `1ECB51E0-0840-4C24-BF9E-39F427B7823F`
  - Receiver (`HRApp Duo — Store captures`, English US, iPhone Duo, iOS 27.1): `C488FBB6-7CCA-4473-921C-6084F99E9C18`
- The user requested only Sender and Receiver on 2026-10-20; an Arabic simulator is not required.
- The user requested iPhone Duo for one of the two simulators on 2026-10-20. The former Sender, Receiver, and Receiver Backup UUIDs were absent when rechecked later that day. Reuse the existing Duo capture instance and preserve its local demo calendars. The new Sender is a fresh iPhone 17 on the compatible iOS 27.0 runtime; do not restore old accounts or caches.
- Bundle identifier: `Deksan.CalendarASD`. Preserve simulator data, accounts, language and appearance during ordinary build/install cycles. Uninstalling or reseeding is a separate, explicitly requested operation.
- Do not include other booted simulators in this workflow.
- These are fresh instances created on 2026-10-20 after the previous HRApp simulator UUIDs were found to be absent. Do not restore their accounts or caches. Do not sign into iCloud or delete real synced iCloud data without explicit authorization. If native calendars are explicitly seeded, use independent device-local EventKit storage on each simulator.
- Backend deployments are Debug-only until the user explicitly requests a production deployment. Never clear production storage as part of Debug cleanup.
- For normal app launches, disable test fixtures with `-EventEditorReferencePreview NO -ResetAndSeedSimulatorCalendars NO -ScreenshotMode NO`.
