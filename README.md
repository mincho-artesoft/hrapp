# cloud-calendars-api (NestJS serverless)

The NestJS port of the Cloud Calendars API. It **replaces** the original single
`index.mjs` Lambda while preserving the whole architecture:

- **Same S3-as-DB** — same bucket (`cal.cloud-calendars.com`), same key layout
  (`src/store/keys.ts`), same objects. No database was introduced.
- **Same invocation** — the same API Gateway v2 HTTP API and custom domain
  `api.cloud-calendars.com`. NestJS runs behind `@codegenie/serverless-express`.
- **Same contract** — every route, status code, and response body is identical,
  so the web app and PsyConnect keep working unchanged. Verified by a 36-check
  parity suite run locally, on a staging Lambda, and against production.
- **Same runtime deps** — `@aws-sdk/*` stays provided by the Node 20 Lambda
  runtime (it is a *devDependency* here, excluded from the deploy bundle).

## Layout

```
src/
  util/            ids, ics (RFC 5545), booking-slots, verify  — pure ports
  store/           keys.ts (data model) + StoreService (S3 CRUD)
  email/           EmailService (SES)
  core/            CoreService (regenerate, createCalendar, tokens, entitlement)
                   + CoreModule (@Global) + AuthGuard
  common/          ApiResult helper, AuthGuard, AllExceptionsFilter
  calendar|booking|me|pairing|billing/   controllers + services per resource
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
bash deploy.sh staging        # scratch function + its own HTTP API (safe to test)
bash deploy.sh production     # CUT OVER the live cloud-calendars-api function
```

`production` updates the live function's code and sets its handler to
`dist/lambda.handler`; runtime, memory, timeout, and env are left as they are.

## Roll back

The pre-NestJS backend is snapshotted for one-click restore at
`~/work/cloud-calendars-api-backup-2026-08-30/` (the exact code zip + config):

```bash
bash ~/work/cloud-calendars-api-backup-2026-08-30/restore.sh
```

That redeploys the original `index.mjs` code and resets the handler to
`index.handler` with the original env. The HTTP API, domain, IAM role, and S3
bucket are untouched by either direction, so the swap is fully reversible.
