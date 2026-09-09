# AASA production routing repair — 2026-09-09

## Change

The viewer-request function treated the extensionless Apple association file as
a website page. Its 301 added a trailing slash, which then returned an S3 404.
Apple's CDN reported `SWCERR00101 Bad HTTP Response: 404 Not Found`.

Published only the narrow AASA exception in `cloudfront-router.js`. Requests
for the canonical file, root alias, and their trailing-slash forms now internally
resolve to the existing JSON object. No website assets, application builds,
Lambda configuration, or AASA contents were changed.

## Deployment

- Function: `apex-to-www-cloud-calendars`, runtime `cloudfront-js-2.0`.
- Distribution: `E91A0MU1YHGPR`.
- Published at 2026-09-09 11:35:06 UTC / 14:35:06 Europe/Sofia.
- LIVE status confirmed `DEPLOYED`; ETag `E3UN6WX5RRO2AG`.
- Scoped invalidation: `IBW4SEKIRHUP1TDHZOAFTKUVYP`, confirmed `Completed`.
- Backups: `/Users/aleksandarsvinarov/Desktop/Cloud Calendars Production Backups/aasa-router-20260909-faGkm4/`.
  Contains the previous LIVE code, unchanged AASA object, and downloaded fixed
  LIVE code. Downloaded fixed code matches the repository source byte for byte.
- Previous function ETag: `ETVPDKIKX0DER`.
- Previous config comment: `cloud-calendars.com to www; bare path to slash`.

## Verification

- 28 local router tests passed.
- 180 non-AASA routing comparisons against the previous LIVE function matched.
- Four AWS DEVELOPMENT executions passed with no function errors: canonical
  AASA GET, apex/slash HEAD, root alias GET, and normal page redirect.
- All 16 live AASA checks passed: GET and HEAD, four path variants, both hosts.
  Each returned 200, `application/json`, no Location, and the expected JSON.
- The homepage, legal pages, robots file, and normal redirects were checked.
  Exploratory checks initially assumed `/privacy/` was a legal page and
  `/articles/` was retired. Actual existing routes are `/privacy-policy/` (200),
  `/privacy/` (404), and `/articles/` (200); `/book/` is 404. Those paths and
  website content were not changed by this repair.
- At 11:37:24 UTC, Apple's normal CDN endpoint returned 200, matching JSON,
  `Apple-From: https://www.cloud-calendars.com/.well-known/apple-app-site-association`,
  and no `Apple-Failure-Reason`.
- App Clip ID remains `8293TNMX6S.Deksan.CalendarASD.Clip`.
- App Store Connect's displayed status was not refreshed during this repair;
  use its **Load Debug Status** action to refresh the prior result.

The normal website deployment script now also runs the strict no-redirect AASA
live check, so a future redirect regression fails post-deploy verification.
