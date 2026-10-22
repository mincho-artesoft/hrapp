# Cloud Calendars media storage

- Owner instruction (22 October 2026): do not retain local marketing screenshots, image exports or video recordings for Cloud Calendars. Keep them in S3.
- Use in-memory processing where possible. Upload unavoidable scratch media immediately, verify its checksum and size in S3, then remove the local file. Never delete the only verified copy.
- Website marketing media must use S3-backed `/media/` URLs rather than local `public/assets` files. Preserve application code, native project resources and small UI icons required by the website.
- S3 recovery mappings and checksums: `research/media-asc-20261022/` and `s3://cloud-calendars-appstore-media/1.7.4/local-media-archive-20261022/`.
- The owner is filling App Store Connect App Privacy manually. Do not edit or publish it. The proposed rewritten website privacy policy has not been approved for publication; preserve the existing public policy.

# Article indexing hold

- Owner instruction (22 October 2026): keep every translated article and translated article hub out of Google until editorial approval. English articles remain indexable; localized product homepages remain indexable.
- Apply `noindex,follow` in prerendered HTML and client navigation. Do not block these pages in robots.txt: crawlers must read the directive.
- Exclude held pages from sitemap/llms discovery lists and article hreflang groups. Keep translations available to readers. New translations inherit the hold through `src/app/core/article-indexing.ts`.
