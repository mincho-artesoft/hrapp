# Cloud Calendars — marketing site

Angular 19 single-page site for the [Cloud Calendars](https://apps.apple.com/us/app/cloud-calendars/id6744690319)
iOS app. Dark, cinematic design: a live WebGL backdrop behind the hero, CSS 3D
everywhere else, and scroll-driven motion throughout.

## Getting started

```bash
npm install     # three.js and the self-hosted fonts are new dependencies
npm start       # dev server on http://localhost:4200
npm run build   # production build into dist/arte-calendar/browser
```

## How it is put together

```
src/
├── styles.scss                   design tokens, reset, shared components
├── styles/
│   ├── _mixins.scss              glass, bevel, breakpoints, type helpers
│   └── _legal.scss               shared styling for the two legal pages
└── app/
    ├── core/
    │   ├── app-facts.ts          single source of truth for App Store data
    │   ├── motion.ts             reduced-motion + device capability checks
    │   ├── scroll.service.ts     the one rAF loop the whole site shares
    │   ├── reveal.directive.ts   scroll-into-view reveals (+ stagger)
    │   ├── tilt.directive.ts     pointer-driven 3D tilt with matching sheen
    │   ├── seo.service.ts        per-route title, description, OG tags
    │   └── weather.service.ts    Open-Meteo forecast + city geocoding
    ├── components/
    │   ├── webgl-backdrop/       three.js scene, rendered in a worker
    │   │   ├── scene.ts          the scene itself, DOM-free so it can run anywhere
    │   │   ├── backdrop.worker.ts OffscreenCanvas render loop
    │   │   └── aurora.glsl.ts    shaders
    │   ├── device-frame/         sizing + light spill; the frame is in the art
    │   ├── hero/                 headline, device cluster, floating chips
    │   ├── marquee/              feature ticker
    │   ├── showcase/             product tour, screenshots on a coverflow
    │   ├── widgets/              Home Screen widgets rebuilt in CSS
    │   ├── weather-hub/          live Open-Meteo readings + city search
    │   ├── features/             bento grid, orbit, gesture demo
    │   ├── pricing/              plan cards + monthly/yearly toggle
    │   ├── faq/                  accordion
    │   ├── cta/                  closing section
    │   ├── header/  footer/
    └── pages/                    home, privacy policy, terms
```

### A few decisions worth knowing

**One animation loop, and it stays off the root element.** `ScrollService` owns
the only `requestAnimationFrame` loop, the only scroll listener and the only
pointermove listener on the site; everything scroll- or pointer-driven
subscribes through `onFrame()`.

It deliberately publishes **nothing** as a custom property on `<html>`. An
inherited custom property set on the root element invalidates style for the
entire document, so driving effects that way costs a full style recalculation
every frame — for a page this size that alone made scrolling stutter. Effects
write to their own element instead (see `HeroComponent.ngAfterViewInit`).

For the same reason `backdrop-filter` is opt-in rather than baked into the
`glass()` mixin. It was on roughly twenty elements — every card, every metric
tile, every pricing tier — all sitting over a near-flat background, so it cost
a great deal and showed almost nothing. Only the header, the mobile sheet and
the hero's floating chips still use one.

**Body scroll, not an inner container.** The previous layout scrolled inside a
flex child, which breaks `position: sticky`, scroll-linked animation and mobile
URL-bar collapse. The page now scrolls on `<body>`.

**The hero scene renders on a worker thread.** `WebglBackdropComponent` hands
the canvas to a worker with `transferControlToOffscreen()`. three.js is parsed
there, the scene graph lives there, and every frame is built and submitted
there — so none of it competes with scrolling. The main thread's entire job is
to post pointer and scroll values, and only when they actually change; a still
page posts nothing. Initial transfer is ~107 KB and three.js never touches the
main thread at all.

Two things about that worker are worth knowing before editing it:

- **The loop must use `requestAnimationFrame`.** Chromium exposes it on
  `DedicatedWorkerGlobalScope`, and for WebGL it is not optional: a frame drawn
  to an OffscreenCanvas outside a rAF callback is never presented to the
  placeholder canvas. On a `setTimeout` loop the scene renders happily at 60fps
  and puts absolutely nothing on screen, with no error anywhere.
- **`scene.ts` must stay free of DOM and Angular**, because the identical file
  is also the main-thread fallback for browsers without OffscreenCanvas. That
  fallback lives in its own lazy chunk and is only fetched if the worker path
  is unavailable.

**The aurora shader is the expensive part, so it is deliberately cheap.** The
fBm runs per pixel, seven times per fragment. It is three octaves, not five;
the domain warp and the shimmer streak use a single octave, since both are seen
only through heavy blur; fragments outside the ribbon mask `discard` early; and
the canvas renders at a device pixel ratio capped at 1.35 rather than the
display's native ratio. Together that is roughly a third of the original
fragment cost for no visible difference.

**The screenshots carry their own device frame.** Each App Store shot is an
iPhone mockup, originally sitting on a green chroma key (a couple on white,
several with a green outline traced around the frame). Those backdrops are
keyed out and the shots ship as transparent `.webp` — 11.6 MB of PNG down to
0.81 MB. `DeviceFrameComponent` therefore draws **no** chrome of its own: no
rail, no buttons, no bezel, no screen. Wrapping these in a CSS iPhone produced
a frame inside a frame, which is what made the first design look heavy.

**The tour is a coverflow, and it is written to the DOM by hand.** The product
tour used to cross-dissolve one screenshot into another inside a single frame,
with a few empty cards drifting behind for depth. It now moves all five
screenshots on one track: the current view square on, its neighbours turned
away, pushed back and dimmed, the ones beyond that faded out. The track wraps,
so the first step is flanked by the last rather than by nothing.

Every frame is assigned straight to the elements' `style` from the shared rAF
loop — no bindings. Five covers and five rail fills at 60fps is 600 bindings a
second through change detection; the same values written directly are ten
property assignments and no change detection at all. `active()` stays a signal
because it changes a handful of times per section rather than per frame.

Two things there are load-bearing. The `perspective` lives on the track and the
covers are its direct children, rather than the track carrying
`transform-style: preserve-3d` — under preserve-3d the covers share one 3D
space and a turned one can intersect the centre plane, which is exactly what
drew a hard diagonal seam across the phone in an earlier version. And the
neighbour spread is a CSS custom property (`--flow-x`) that the component reads
back through a `ResizeObserver`, because the right spread is a question of how
much room the column has: a phone is a fifth of a desktop viewport and two
thirds of a handset.

`DeviceFrameComponent`'s size presets are written as
`var(--device-lg-w, min(318px, 33vh))` so a section that needs a smaller phone
than the preset can set `--device-lg-w` on an ancestor and win. Setting
`--device-w` from outside would not work — it is declared on the element
itself, and a declaration always beats an inherited value.

The keying script floods the backdrop in from the image border, so the app's
own green event blocks and chart fills — interior regions that never touch the
border — survive untouched. The Open Graph share image deliberately stays PNG,
because social scrapers are still inconsistent with WebP.

**The 3D degrades honestly.** `canRunHeavyScene()` in `core/motion.ts` checks
reduced-motion, WebGL support, core count, device memory and data-saver before
the three.js scene initialises. When it says no, the CSS gradient underneath is
the whole design — it is meant to look finished on its own. Every CSS animation
has a `prefers-reduced-motion` branch too.

**The widgets section is real footage.** It was a CSS recreation of the Home
Screen; it is now a Simulator capture from an iPhone 17 Pro showing all three
widget sizes and the Live Activity counting down to a dinner reservation. A
recreation can always be accused of flattering the product — a recording
cannot.

`public/assets/video/` holds a 640×1392 MP4 and WebM (about 550 KB each, 30fps)
plus a poster frame.

That section does **not** use `DeviceFrameComponent`. The screenshots elsewhere
carry their own frame, so that component is fixed to their 735 × 1506 shape;
the recording has no frame of its own and a different aspect, and fitting one
into the other left `object-fit` to reconcile the difference — which silently
sliced the status bar and the dock off the ends of the phone. In
`widgets.component.scss` the bezel is instead grown *from* the clip: the video
is an ordinary block at `height: auto` with its aspect ratio declared, and the
shell is padding around it. The two cannot disagree, so neither a crop nor a
letterbox is possible even if the footage is re-recorded at another size.

`InViewVideoDirective` keeps the cost off the critical
path: the element carries `preload="none"` and **no `autoplay` attribute** —
that attribute makes browsers fetch the clip at page load regardless of
`preload`, which defeats the point. The directive starts playback when the
section scrolls into view and pauses it on the way out, re-checking intent when
the `play()` promise settles so a pause is not undone by a promise that
resolves after the element has already left.

It also carries **no `controls` attribute**. Native controls cannot be trimmed —
`controlsList` drops download, fullscreen and playback rate, but there is no way
to remove the timeline — and a scrubber on a nine-second silent loop reads like
a film player. The directive instead exports a `playing` signal and a `toggle()`
method (`exportAs: 'inViewVideo'`), and the section draws one button of its own,
beneath the phone rather than over it: the dock sits in the bottom corner of the
shot, which is exactly what a floating overlay would cover.

Once that button is pressed the visitor's intent outranks the scroll position —
a deliberate pause is not undone by scrolling away and back — and under
`prefers-reduced-motion` nothing starts until they ask for it. **The footage is
silent**; the Simulator capture has no audio track at all, so the control is
play/pause rather than mute. If sound is ever added, `toggle()` is the only
thing that needs to change.

Marketing screenshots, exported images and recordings are stored in S3 rather
than local media folders (owner instruction, 22 October 2026). Website media uses
S3-backed `/media/` URLs; do not recreate local `media-source`, `media-build`,
`shots`, `exports` or `art` collections. Process in memory where possible; upload,
checksum-verify and immediately remove any unavoidable scratch recording.
Recovery mappings are in `research/media-asc-20261022/` and in the private
`s3://cloud-calendars-appstore-media/1.7.4/local-media-archive-20261022/` archive.

**Fonts are self-hosted.** Sora, Inter and JetBrains Mono ship from
`@fontsource-variable/*` rather than Google Fonts, so there is no third-party
request on the critical path and no flash of fallback text. Angular's build-time
font inlining is switched off in `angular.json` for the same reason — it made
production builds depend on reaching Google.

**Brand assets.** The app icon is the single source: `public/icons/` holds the
favicon PNGs, the opaque 180px Apple touch icon (iOS composites its own mask,
so that one must not be transparent) and `mark-128.webp`, the 4 KB mark used in
the header, footer, orbit, dock and Live Activity. `public/favicon.ico` is a
multi-resolution 16/32/48/64 file for legacy requests. The icon master is archived in S3; use the recovery mapping rather than keeping
a local master. Small runtime icons remain part of the website code; marketing
images and recordings do not.

**The weather is live.** The hub calls [Open-Meteo](https://open-meteo.com)
directly from the browser — `core/weather.service.ts` is the whole integration.
Two keyless endpoints: `geocoding-api.open-meteo.com/v1/search` for the city
finder and `api.open-meteo.com/v1/forecast` for current conditions plus an
hourly series. No key means nothing secret in the bundle and no proxy to run.

> **The licence is the catch.** Open-Meteo's free tier is for **non-commercial
> use** (10,000 calls a day). A marketing site for a paid app is arguably
> commercial, so this either wants a subscription — which swaps the host for
> `customer-api.open-meteo.com` and appends `&apikey=` — or a provider whose
> free tier covers commercial use. `BASE` and `GEO` at the top of the service
> are the only two lines that change; everything below them is already
> provider-shaped. Attribution is required either way (CC BY 4.0) and is in the
> footer.

Units follow the searched country, not the visitor's browser: Fahrenheit and
mph for the US, metric everywhere else. "72°" under "Berlin" is wrong however
the reader's own phone is set.

Every caption is generated from the numbers it sits under. The tiles used to
carry hand-written lines — "West-south-west, gusting to 17 late afternoon" —
which read well and become a lie the instant the data behind them is real. The
generators live at the bottom of the service.

The old hand-written figures are still in `weather-hub.component.ts`, demoted
to the fallback: they are what renders before the first response lands, and
what stays if the request fails, with the hint line changing to say so. A panel
that empties itself on a network error reads as broken.

Three views share one request: **Hourly** (the next eight hours), **14 days**
(the fortnight, each row a range bar positioned against the whole span so the
column reads as one temperature profile, weekends tinted) and **Weekend** — the
next Saturday and Sunday, searched for rather than assumed at a fixed offset,
because on a Saturday the weekend is today and tomorrow.

**A change-detection trap worth knowing about.** This component's async work
reaches Angular through neither path zone.js can see: `IntersectionObserver` is
not patched, so the callback that starts the fetch is already outside the zone,
and the app compiles to ES2022, so `async`/`await` is native and native promise
jobs skip zone.js's patched `Promise` too. Every signal updated correctly and
nothing re-rendered — the panel sat on its fallback looking exactly as though
the request had failed, until any unrelated click ticked and the real data
appeared at once. `NgZone.run` around the writes is not enough; the writes go
through `apply()`, which calls `detectChanges()` directly.

Nothing is requested until the section is within 400px of the viewport, so a
visitor who bounces at the hero never costs an API call, and a reading is
cached for ten minutes per location. The chosen city is remembered in
`localStorage`.

The sparklines draw themselves on as they scroll into view, then a short bright
dash runs the length of each curve on a loop — `stroke-dashoffset` rather than a
moving dot, because the chart viewBox is scaled non-uniformly and a circle would
render as an ellipse. The bar chart rolls its brightness left to right on the
same cadence, and the hourly glyphs each behave like their weather: the sun's
rays turn behind a breathing disc, clouds drift, rain falls, the moon glows.

**App Store facts live in one file.** Version, rating, pricing tiers, size and
minimum iOS all come from `core/app-facts.ts`. Update it there and the hero
badge, pricing table, FAQ, footer and CTA all follow.

## Deploying

```bash
cp .env.example .env     # fill in the AWS keys
npm run deploy           # build, upload, invalidate, wait — one command
npm run deploy:dry       # prints every AWS call, changes nothing
```

`npm run deploy` is the whole thing: it builds, uploads, invalidates CloudFront
and waits for the invalidation to reach every edge before returning, so when it
exits the new build really is live.

If no distribution can be found the deploy **fails**, deliberately. An upload
without an invalidation looks like a success and behaves like a no-op — the
assets change, the cached HTML does not, and the site appears unchanged. That
failure mode is worth an error rather than a warning. `ALLOW_NO_CLOUDFRONT=1`
overrides it if the bucket is ever served without a CDN.

`scripts/deploy.sh` replaces `ng deploy` (`@jefiozie/ngx-aws-deploy`), which
applied one blanket `Cache-Control` to every object and could not invalidate
CloudFront — so a deploy either served stale HTML or gave up long-term caching
on the hashed bundles. The script separates them:

| What | Cache-Control |
| --- | --- |
| Fingerprinted `*.js`, `*.css`, `media/*` | `max-age=31536000, immutable` |
| Images, icons, `favicon.ico`, text files | `max-age=86400` |
| `index.html` and the SPA route keys | `no-cache, no-store, must-revalidate` |

It also uploads `index.html` under the `privacy-policy` and `terms-of-service`
keys, so a direct hit on those routes resolves without a CloudFront
custom-error rule, then finds the distribution by matching the bucket name
against distribution aliases and invalidates `/*`.

Flags: `DRY_RUN=1` prints every AWS call without making it, `SKIP_BUILD=1`
reuses `dist/`, `INVALIDATE_ONLY=1` (`npm run deploy:invalidate`) just busts the
CDN cache, `NO_WAIT=1` returns as soon as the invalidation is created rather
than when it finishes, `PRUNE=1` also deletes bucket objects no longer in the
build.

> **The bucket is not the domain.** The bucket is `www.arte-calendar.com`, an
> old brand name; the site is served at `www.cloud-calendars.com`. `SITE_DOMAIN`
> in `.env` carries the public hostname, and the CloudFront lookup searches it,
> the compiled canonical host and the bucket name. Without it the lookup finds
> no distribution, skips invalidation, and the CDN keeps serving the previous
> `index.html` — the assets update but the page does not.

> **Credentials** live in `.env`, which is gitignored. They used to be
> hard-coded in the `deploy` script in `package.json`, which means **they are
> still in this repository's git history** — rotate that key pair. The new
> script never has them on a command line, so they will not show up in `ps`
> output or shell history either.

The script also compares `SITE_URL` in `src/app/core/app-facts.ts` against
`SITE_DOMAIN` and warns if they diverge, since a canonical tag pointing at a
host other than the one serving the page keeps a site out of search results.
