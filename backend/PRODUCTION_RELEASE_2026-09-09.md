# Production API deployment — 2026-09-09

Explicit user approval: redeploy the production backend and open App Store Connect.
No App Store submission, website deployment, calendar reset, or test emails were
performed as part of this release.

## Deployment

- Source revision: `9bc33b6` (clean working tree before deployment).
- Function: `cloud-calendars-api`, account `303803840503`, region `us-east-1`.
- Endpoint: https://api.cloud-calendars.com
- Completed Lambda update: `2026-09-09T10:30:09.000+0000` (13:30 Sofia).
- State `Active`; last update `Successful`.
- Handler `dist/lambda.handler`, runtime `nodejs20.x`.
- Production bucket remains `cal.cloud-calendars.com`.
- Deployment archive SHA-256 (base64): `/Y1AmuDxCmkndNMUkXS7hko+DPTuU4//bleDAXGhoL0=`.
- Live function hash matches the uploaded archive.
- Environment map unchanged, verified by SHA-256 fingerprint before/after.

## Verification

- Sharing integration tests passed for EventKit and app-local calendars,
  Reader/Writer/Owner rights, legacy edits, explicit extension clearing,
  calendar-kind preservation, concurrent snapshot protection, and past invitations.
- APNs unit tests passed, including multi-device account behavior.
- All 24 intercepted SES/inline PNG cases passed; all 24 actual QR images decoded
  with Vision and the legacy scanner's required-field checks. No email was sent.
- Live read-only smoke checks: `/me`, `/shared-state`, and both pending-invitation
  routes return 401 without authentication; malformed event invitation returns
  400; missing feed returns 404; calendar icon and QR assets return valid PNG/200.
- Exact distributed App Store binary end-to-end testing remains unconfirmed.

## Deliberately unchanged

Production APNs credentials, SQS queue, and allowed APNs environments are not yet
configured. The new server-push implementation is deployed but inactive. Sharing
and invitation email retain their existing production configuration. Do not copy
Debug device registrations or Debug storage into production.

## Rollback archive

The previous live ZIP was verified against Lambda's code hash before deployment
and copied to:

`/Users/aleksandarsvinarov/Desktop/Cloud Calendars Production Backups/cloud-calendars-api-before-1.7.2-20260909.zip`

Previous archive SHA-256 (base64): `fQSCfh5AekYkHZTWBvc4iZhnEmKQ4cUWqwk8e5rk/n0=`.
Hex: `7d04827e1e407a46241d94d606f738899867126290e1c516ab093c7b9ae4fe7d`.

If rollback is authorized, restore that ZIP to the same production Lambda using
`aws lambda update-function-code`, then wait for `function-updated`. The previous
handler/runtime are also `dist/lambda.handler` / `nodejs20.x`; no environment or
S3 data rollback is required. Do not use the older August migration rollback for
this September release.
