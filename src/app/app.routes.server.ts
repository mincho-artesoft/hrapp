import { RenderMode, ServerRoute } from '@angular/ssr';

import { contentFor, LIVE_LOCALES } from './content/registry';

/**
 * Which routes the build renders, and how.
 *
 * Everything is prerendered — this site has no server, only a bucket behind a
 * CDN. Until this file existed the site shipped one empty index.html and asked
 * every visitor's browser to draw the rest, which is why the visibility report
 * found the product absent from answers about its own core features: most
 * crawlers feeding those models do not run JavaScript, so there was nothing to
 * read.
 *
 * The parameterised entry is the one that needs saying out loud. Without
 * getPrerenderParams the build has no way to know that /articles/:slug stands
 * for real pages, and would ship none of them.
 */
export const serverRoutes: ServerRoute[] = [
  ...LIVE_LOCALES.map((locale) => ({
    path: locale.slug ? `${locale.slug}/articles/:slug` : 'articles/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () =>
      Object.keys(contentFor(locale.code).articles).map((slug) => ({ slug })),
  })),
  { path: '**', renderMode: RenderMode.Prerender },
];
