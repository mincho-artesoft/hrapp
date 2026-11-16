# Invitation push notifications

The app registers an APNs token through authenticated `PUT /me/push-devices/:installationId`.
The request includes a private installation capability, increasing revision,
APNs environment, token and the combined OS/app invitation notification setting.
An anonymous registration cannot subscribe to invitation pushes. Canonical device
ownership is checked again on dispatch; account switches and disabled registrations
cannot receive the old account's invitations through stale indexes.

Both invitation endpoints enqueue after persisting recipients and pending indexes:

- Event invitations (independent of the original local/EventKit/provider source).
- Whole calendar invitations, including `app_local` and `eventkit` sharing.

The encrypted SQS queue invokes the existing Lambda. It retries transient failures,
then retains failures in a dead-letter queue after five attempts. A CloudWatch
alarm records a nonempty dead-letter queue; no external alarm recipient is configured.
Per-device receipts and leases suppress retries of successful deliveries. Apple
may replace an older alert for the same invitation via its collapse identifier.
The worker rechecks pending status and verified recipient identity, so queued
invitations already accepted, removed, cancelled or revoked are not sent.
Past events remain shareable: their pending invitations stay visible and fresh
invitation jobs notify regardless of the event's end date. Queue jobs older than
24 hours still expire; this limit concerns delivery age, not the event date.

APNs alert payloads use the app's localized strings and unchanged event/calendar
titles. They carry the same pending invitation IDs as local notifications, so
tapping continues to open Sharing → Pending invitations. Foreground polling still
refreshes this list; after successful push registration it no longer creates a
duplicate local banner. Devices without remote registration retain the foreground
fallback.

## Debug setup

Only the existing isolated `cloud-calendars-api-debug` Lambda/bucket are eligible.
The original `CalendarASD` key `C35N297RPG` could not be recovered. At the user's
request, the replacement `Cloud Calendars Services` key `622H394VG7` was created
on 2026-09-09. The Apple account confirmed APNs for Sandbox & Production (Team
Scoped / All Topics), WeatherKit, and Sign in with Apple for
`8293TNMX6S.Deksan.CalendarASD`. A separate Debug key is not required.
The downloaded `.p8` is backed up at `.local-secrets/AuthKey_622H394VG7.p8`.
The app currently uses native `WeatherKit` (`WeatherService.shared`), which does
not embed this private key in the app. Do not change its weather authentication.
Team: `8293TNMX6S`. The user explicitly requested a backup under `.local-secrets/`
in this private backend repository, without Git ignoring it. This exposes the key
to anyone with repository/history access, including its production and other
enabled service permissions. Do not place it in source code, logs or the deployment ZIP.
The shared key does not change the deployment boundary: this setup script still
configures Debug only and accepts only Sandbox device registrations. Production
can use the same key when a production deployment is explicitly authorized.

The user chose Lambda's encrypted environment variables instead of Secrets Manager
or Parameter Store. Configuration is passed directly through the AWS SDK, not process arguments.
The deploy script preserves these variables across subsequent Debug deployments:

- `APNS_PRIVATE_KEY`, `APNS_KEY_ID`, `APNS_TEAM_ID`
- `PUSH_QUEUE_URL`, `APNS_ALLOWED_ENVIRONMENTS=sandbox`

```sh
bash deploy.sh debug
node configure-debug-push.mjs .local-secrets/AuthKey_KEYID.p8 KEYID 8293TNMX6S
```

Calling the configuration script without arguments reuses the existing Lambda key.
The routine creates only the Debug retry queue, dead-letter queue, scoped IAM
permissions, alarm and seven-day delivery-receipt retention. There are ordinary
SQS/Lambda/S3/CloudWatch usage costs; there is no separate secret-storage service.
Do not execute a production deployment without explicit release authorization.

## Verification

```sh
npx ts-node test/invitation-push.test.ts
npm run test:sharing
npm run build
```

The unit tests stub APNs and are not evidence of actual Apple delivery. For the
end-to-end audit, install the signed app on the three named HRApp simulators,
register Sender/Receiver, terminate Receiver, send real invitations through Debug,
then inspect actual delivered notifications (`UNPushNotificationTrigger`) and APNs
responses. Never substitute `simctl push` for a real server-delivery test.

Simulator audit actions in the app: `notifications-push-register` and
`notifications-push-observe`. They report no APNs token or installation secret.
