# Cloud Calendars storage and deployment

## Production cutover, 2026-11-25

The Mac, iPhone, iPad and browser clients use `https://api.cloud-calendars.com` for development and release builds. Account data is in `cal.cloud-calendars.com`. Users sign in to Production when upgrading an installation that only had a Debug session. The old HTTP endpoints forward public invitation and scoped feed links to Production.

The two merged owners use their existing Production subscription URLs. Existing event-specific subscriptions retain their individual permissions. The six private demo copies belong to the requesting account. All seven cancelled demo events remain in its private history.

The dedicated Hetzner calendar container was stopped with its restart policy disabled. The former AWS Debug Lambda has reserved concurrency zero. The storage service and unrelated workloads continue to run. A private, integrity-checked snapshot of both namespaces is retained in the server backup directory `cloud-calendars-cutover-20261125T143316Z`. Production Lambda version 7 retains the previous route contract.

## Historical Debug deployment, 2026-11-16

The current Debug native app and development web app use
`https://storage.wonek.com/cloud-calendars-debug`. NestJS runs as the isolated
`cloud-calendars-debug` container on Hetzner, behind the existing HTTPS host.
The calendar namespace and account tokens are unchanged. Client merge baselines
and Mac account storage retain their legacy keys, so changing the API does not
create a fresh inventory or sign users out.

The old Debug Lambda/API Gateway address remains active for older releases.
Hetzner handles API requests, calendar data and the durable APNs work queue.
Email remains Amazon SES, through a private bearer-authenticated endpoint in
the Debug Lambda with the existing email deduplication guard. No AWS access
keys are copied to Hetzner. The relay is not exposed through the Hetzner API.
Production API, feeds and storage are unchanged by this Debug deployment.

Build and package the backend with `bash deploy.sh package` before running
`python3 deploy-hetzner-debug.py`. The Hetzner deployment script accepts only
the existing Debug Lambda and Debug storage namespace, preserves its private
configuration, updates the compatibility Lambda, and health-checks the new
container before updating its isolated nginx location. Private backups and
relay credentials live outside the repository in
`~/Library/Application Support/CloudCalendarsInfrastructure/`.

Validation: the sharing suite, native calendar route/merge tests and durable
queue/email relay tests pass. Both public Debug sync routes reject an
unauthenticated request with 401; the Hetzner provider discovery route returns
200. Relay tests use a fake sender and do not deliver email.

Both Lambda functions remain in AWS account `303803840503`, region `us-east-1`:

| Function | API | Hetzner namespace |
| --- | --- | --- |
| `cloud-calendars-api` | `api.cloud-calendars.com` | `cal.cloud-calendars.com` |
| `cloud-calendars-api-debug` | existing API Gateway endpoint | `cloud-calendars-api-debug-303803840503` |

`CALENDAR_STORAGE_URL=https://storage.wonek.com` and a separate private
`CALENDAR_STORAGE_TOKEN` per Lambda select Hetzner storage. `CAL_BUCKET` retains
its name as the logical namespace. The service keeps each namespace in its own
directory under `/srv/calendar-storage/` on `punch-eu`, with transactional object
versions and metadata. No calendar S3 bucket is created during deployment.

## Historical deployment commands

```sh
npm run build
npm run test:sharing
bash deploy.sh debug
ALLOW_PRODUCTION_DEPLOY=I_UNDERSTAND_THIS_UPDATES_LIVE bash deploy.sh production
```

Both updates preserve existing private Lambda environment values. Production
still requires explicit user authorization. Debug deployment requires the
existing Hetzner configuration and fails instead of recreating an S3 bucket.
This repository does not deploy Wonek or read Wonek's source or credentials.

The common Hetzner service is deployed from the separate
`calendar-storage-infra` repository. CDN configuration belongs here:
`deploy-feed-origin.py` points the existing feed distribution at the HTTPS
origin without changing public feed URLs. Its private origin credential comes
from `CALENDAR_FEED_ORIGIN_TOKEN` or the Cloud Calendars-only file
`~/Library/Application Support/CloudCalendarsInfrastructure/feed-origin.json`,
outside Git. It does not read another application's storage credentials.

## Migration verification, 2026-09-28

170 production objects were copied and compared byte-for-byte; Debug was empty.
Each live Lambda package changed only in its storage adapter. The full local
sharing suite passed (rights, invitation/acceptance, legacy writes, conflicts,
revocation and calendar/event synchronization). Prepared packages and deployed
APIs passed live read/write/conditional-write/list/delete storage checks.
The unchanged `cal.cloud-calendars.com` feed URLs read through CloudFront from
Hetzner. Original packages, metadata and object copies were saved privately on
the operator's Mac before source bucket removal.
