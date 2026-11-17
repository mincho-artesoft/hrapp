# HRApp device workflow

## Current workflow (user request, 2026-11-16)

- After each change to application code, Debug-build, update-install, and launch on **both connected physical devices and native Mac**:
  - Aleksandar’s iPhone (iPhone SE): `00008030-001204D12E04C02E`
  - Aleksandar’s iPad (iPad Air 11-inch M3): `00008122-000240191451801C`
  - Native macOS, the same `Calendar` target and `Deksan.CalendarASD` bundle ID.
- Build only HRApp from this repository. Do not build, install, launch, or change the Wonek app or its simulators; its repository is a read-only design reference.
- Preserve device and Mac application data. Use normal launch arguments listed below.
- Native Mac requires Apple Development signing with its WeatherKit capability; use automatic provisioning, not ad-hoc signing.
- Update-install the signed Mac build into `/Users/aleksandarsvinarov/Applications/Cloud Calendars.app` and launch that installed copy. Do not launch the build directly from `/tmp`: Launch Services excludes apps in temporary directories from OAuth/deep-link handler resolution. Keep the same bundle ID and container data, and quit the running app before replacing its bundle. Register the installed bundle with `lsregister -f` after updating it.
- Do not reset permissions in routine cycles. The explicit one-time Mac permission reset requested on 2026-11-16 was completed after verification with `tccutil reset All Deksan.CalendarASD`; the app was left closed. Do not repeat this reset without a new user request.
- The physical-device workflow supersedes the historical simulator workflow below. Do not create or alter Wonek simulators.

## Historical simulator workflow


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
