# cloud-calendars-api (NestJS serverless)

Current storage and deployment: [Hetzner storage](HETZNER_STORAGE.md). Both
calendar namespaces now live on Hetzner, while production and Debug Lambdas
remain in AWS. This repository deploys only Cloud Calendars. The common storage
service is maintained separately in `calendar-storage-infra`.

The NestJS port of the Cloud Calendars API. It **replaces** the original single
`index.mjs` Lambda while preserving the whole architecture:

- **Separate calendar stores** — production uses the Hetzner namespace
  `cal.cloud-calendars.com`; Debug uses `cloud-calendars-api-debug-303803840503`.
  Both keep the same object keys and conditional-write semantics through the
  private HTTPS storage service.
- **Isolated debug invocation** — debug uses its own Lambda and API Gateway;
  production keeps the existing custom domain `api.cloud-calendars.com`.
  NestJS runs behind `@codegenie/serverless-express` in both environments.
- **Same contract** — every route, status code, and response body is identical,
  so the web app and PsyConnect keep working unchanged. Verified by a 36-check
  parity suite run locally, on a staging Lambda, and against production.
- **Same runtime deps** — `@aws-sdk/*` stays provided by the Node 20 Lambda
  runtime (it is a *devDependency* here, excluded from the deploy bundle).

## Layout

```
src/
  util/            ids, ics (RFC 5545), verify  — pure ports
  store/           keys.ts (data model) + StoreService (S3 CRUD)
  email/           EmailService (SES)
  core/            CoreService (regenerate, createCalendar, tokens, entitlement)
                   + CoreModule (@Global) + AuthGuard
  common/          ApiResult helper, AuthGuard, AllExceptionsFilter
  calendar|me|shared-event/   controllers + services per resource
  bootstrap.ts     shared Nest app config (CORS, rawBody, filter)
  lambda.ts        serverless-express handler (dist/lambda.handler)
  local.ts         local HTTP server for dev
```

## Develop

```bash
npm install
npm run build                 # tsc -> dist/
AWS_REGION=us-east-1 CAL_BUCKET=cal.cloud-calendars.com \
  FEED_HOST=cal.cloud-calendars.com PORT=3010 node dist/local.js
```

Leave `EMAIL_FROM` unset locally so SES sends become no-ops. Book with
`success@simulator.amazonses.com` to exercise the flow without real email.

## Deploy

```bash
bash deploy.sh package        # build + zip only (dist + prod node_modules, no @aws-sdk)
bash deploy.sh                # isolated debug S3 + Lambda + HTTP API (default)
bash deploy.sh debug          # same explicit debug deploy
ALLOW_PRODUCTION_DEPLOY=I_UNDERSTAND_THIS_UPDATES_LIVE \
  bash deploy.sh production   # CUT OVER live only after explicit approval
```

The debug endpoint is written to `.debug-endpoint`. Debug data never uses the
production bucket. `production` is deliberately locked unless the safety flag
is present; it updates the live function's code and sets its handler to
`dist/lambda.handler`; runtime, memory, timeout, and env are left as they are.

## Sharing compatibility with older apps

The sharing API retains its existing sessions, identifiers, roles and feed URLs.
Compatibility checks use the 1.7.0 wire model (iOS source `84ca418bc`) as a baseline.
The sharing API and event wire model are unchanged in the 1.7.1 source
(`36dfc4c30`); the new app version is 1.7.2:

- Missing `travelTime`, `attachments` or `videoCallURL` on an older client's edit
  preserves the existing value, for both individual events and calendar snapshots.
  Explicit null/empty values from capable clients clear those fields normally.
- Calendar kind remains immutable when an older client omits `calendarKind`.
- Conditional snapshot writes reject concurrent replacements instead of silently
  overwriting newer data with a stale legacy snapshot.
- Event QR codes retain title/start/end/allDay and the existing scoped identifiers
  required by older scanners. Long optional content is fetched from the feed.
  Link previews use canonical event metadata, including for compact incoming links.
- Past-event invitations remain available. New server pushes still require an app
  version that registers its APNs installation; old apps retain their prior behavior.

This is sharing compatibility, not restoration of the retired Booking product.
Automated API/wire-format and actual QR-image decoding tests are not a substitute
for a final smoke test of the exact distributed App Store binary before release.
Production was deployed with explicit user approval on 2026-09-09. See
[the release record](PRODUCTION_RELEASE_2026-09-09.md) for verification and rollback.
The existing production environment was preserved; server invitation pushes
remain disabled there until production APNs/SQS configuration is added.

## Roll back

The pre-NestJS backend is snapshotted for one-click restore at
`~/work/cloud-calendars-api-backup-2026-08-30/` (the exact code zip + config):

```bash
bash ~/work/cloud-calendars-api-backup-2026-08-30/restore.sh
```

That redeploys the original `index.mjs` code and resets the handler to
`index.handler` with the original env. The HTTP API, domain, IAM role, and S3
bucket are untouched by either direction, so the swap is fully reversible.
