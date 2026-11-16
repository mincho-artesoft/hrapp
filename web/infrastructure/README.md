# CloudFront website router

`cloudfront-router.js` is the source for the existing viewer-request function
`apex-to-www-cloud-calendars` on production distribution `E91A0MU1YHGPR`.
It uses runtime `cloudfront-js-2.0`. The `/media/*` cache behavior is separate.

Apple must receive AASA directly, without a redirect. The function internally
rewrites the root and trailing-slash aliases to the existing S3 object
`public/.well-known/apple-app-site-association`, on both the apex and www host.
Normal website canonical-host and trailing-slash redirects remain unchanged.
Do not add wildcard Universal Link routes to fix an HTTP delivery issue.

## Verification and publishing

1. Run `npm run test:cloudfront`.
2. Back up the current LIVE function with `aws cloudfront get-function` and
   check whether DEVELOPMENT differs before overwriting another pending edit.
3. Update DEVELOPMENT with `aws cloudfront update-function`, the current
   DEVELOPMENT ETag, runtime `cloudfront-js-2.0`, and
   `--function-code fileb://infrastructure/cloudfront-router.js`.
4. Run `aws cloudfront test-function` against DEVELOPMENT: AASA should return
   the request with the canonical URI, while a normal bare page still redirects.
5. Publish that tested version with `aws cloudfront publish-function`, using
   its ETag. Wait until the LIVE status is `DEPLOYED`.
6. If cached responses need clearing, invalidate only the four AASA paths.
7. Run `npm run check:associated-domain` and
   `node scripts/check-associated-domain.mjs https://cloud-calendars.com`.
   These checks reject redirects and verify GET, HEAD, MIME type, and JSON.
8. Check Apple's independently cached response at
   `https://app-site-association.cdn-apple.com/a/v1/www.cloud-calendars.com`.
   App Store Connect's previously displayed status may need refreshing.

`scripts/deploy.sh` also runs the strict AASA check after normal website deploys.
It does not automatically publish CloudFront function changes. An edge-only
fix does not require rebuilding the iOS app, uploading Angular assets, or
redeploying the API Lambda.

For rollback, update DEVELOPMENT with the backed-up function code and its
original config, test it, and publish using the new ETag. Do not replace the
distribution configuration or unrelated cache behaviors.
