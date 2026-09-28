# Cloud Calendars storage and deployment

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

## Deploy from this repository only

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
