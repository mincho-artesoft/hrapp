import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Which routes the build renders, and how.
 *
 * Everything is prerendered — this site has no server, only a bucket behind a
 * CDN. Until this file existed the site shipped one empty index.html and asked
 * every visitor's browser to draw the rest, which is why the AI visibility
 * report found the product absent from answers about its own core features:
 * most crawlers that feed those models do not run JavaScript, so there was
 * nothing to read.
 *
 * Parameterised routes are added here as the content grows. A route without a
 * `getPrerenderParams` is a route the build has no way to enumerate, and it
 * ships none of its pages.
 */
export const serverRoutes: ServerRoute[] = [
  { path: '**', renderMode: RenderMode.Prerender },
];
