# Cloud Calendars storage and deployment

## Production storage

Cloud Calendars runs its own service on the existing Hetzner host. The production Lambda and the calendar feed CDN connect to `https://storage.cloud-calendars.com`. The worker runs as `cloud-cal-store` with its own credentials, SQLite database and backup timer. The public API and subscription URLs stay the same.

The [storage directory](storage/) contains the Python server, test suite, nginx configuration, backup program and systemd units. Run the tests with `cd backend/storage && python3 -m unittest`. The runtime requires Python 3.9 or later and SQLite with JSON support.

To deploy an update, copy this repository's `backend/storage/` directory to the host and run its `install.sh` as root there. It restarts the Cloud Calendars worker. Nginx uses `storage/nginx.conf` with the Let's Encrypt certificate for the storage host. The worker listens on loopback port 9467.

The operator configuration lives outside Git in `~/Library/Application Support/CloudCalendarsInfrastructure/production-storage.json`. On the host, install it as `/etc/cloud-calendars-storage/config.json`, readable by root and the service group. It contains `root` (`/srv/cloud-calendars-storage`), `port`, and three independently generated secrets for `adminToken`, `originToken`, and `bucketTokens["cal.cloud-calendars.com"]`. Configure the last two on the feed origin and Lambda respectively. To restore, stop the Cloud Calendars worker, restore a verified SQLite snapshot to `/srv/cloud-calendars-storage/cal.cloud-calendars.com/objects.sqlite3` in a clean directory owned by the worker, then start the service.

The daily backup uses SQLite's online backup API and verifies integrity locally and checksums offsite. It retains two local copies under `/var/backups/cloud-calendars-storage` and fourteen in the separate `server-backups/cloud-calendars-storage` directory on the mounted Storage Box.

On 2026-11-27 the live database moved with its existing inode after the API and CDN switched to the new service. Both endpoints read and wrote the same database throughout the transition. The former service account lost filesystem access to the production calendar database.

## Historical production cutover, 2026-11-25

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

Before the 2026-11-27 separation, the common Hetzner service was deployed from the separate
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
