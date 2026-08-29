import { Routes } from '@angular/router';

import { LIVE_LOCALES } from './content/registry';
import { DEFAULT_LOCALE, LOCALES } from './core/locales';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { PrivacyPolicyPageComponent } from './pages/privacy-policy-page/privacy-policy-page.component';
import { TermsPageComponent } from './pages/terms-page/terms-page.component';

/**
 * Routes, one set per published language.
 *
 * The locale travels in `data` rather than being parsed back out of the URL by
 * every component. A component that re-derived it would have to know about the
 * slug scheme, and two of them would eventually disagree.
 *
 * Only languages that have articles get article routes. Generating them for
 * all twenty-nine would build a page for every unwritten translation: blank,
 * indexed, and pointed at by the hreflang set of the article that does exist.
 */
/**
 * The home page, once per language.
 *
 * The articles were translated first, which left a language switcher that
 * worked on every page except the one most people arrive at. A reader could
 * choose Japanese and land back on English, which reads as the switcher being
 * broken rather than the page being untranslated.
 */
const homeRoutes: Routes = LOCALES.map((locale) => ({
  path: locale.slug,
  component: HomePageComponent,
  pathMatch: 'full' as const,
  data: { locale },
}));

/**
 * The booking page, once per language.
 *
 * One static path each — `/book`, `/es/book`, and so on — all pointing at the
 * same component. The owner's handle rides in on `?c=xxxx` rather than in the
 * path, so there is nothing to enumerate: the prerendered page is the empty
 * landing pitch, and the scheduler for a specific owner is drawn in the browser
 * from the query string. A query string cannot make the static host serve a
 * different file, which is exactly why the handle is not a path segment.
 */
const bookingRoutes: Routes = LOCALES.map((locale) => ({
  path: locale.slug ? `${locale.slug}/book` : 'book',
  loadComponent: () =>
    import('./pages/booking-page/booking-page.component').then((m) => m.BookingPageComponent),
  data: { locale },
}));

/**
 * The owner-setup form, once per language, at `/book/setup`.
 *
 * A separate route from `/book` — the public page is prerendered and indexable,
 * this is a noindex tool reached from that page's CTA. Both are static files on
 * the same bucket; the setup page does its work (register, save) in the browser.
 */
const bookingSetupRoutes: Routes = LOCALES.map((locale) => ({
  path: locale.slug ? `${locale.slug}/book/setup` : 'book/setup',
  loadComponent: () =>
    import('./pages/booking-setup-page/booking-setup-page.component').then(
      (m) => m.BookingSetupPageComponent,
    ),
  data: { locale },
}));

/**
 * The invitee's manage page at `/booking/manage` — reached from a tokenised
 * link in the confirmation e-mail, so noindex and browser-rendered like setup.
 * The token rides in `?t=`, so there is one static file per language.
 */
const bookingManageRoutes: Routes = LOCALES.map((locale) => ({
  path: locale.slug ? `${locale.slug}/booking/manage` : 'booking/manage',
  loadComponent: () =>
    import('./pages/booking-manage-page/booking-manage-page.component').then(
      (m) => m.BookingManagePageComponent,
    ),
  data: { locale },
}));

const articleRoutes: Routes = LIVE_LOCALES.flatMap((locale) => {
  const prefix = locale.slug ? `${locale.slug}/` : '';
  return [
    {
      path: `${prefix}articles`,
      loadComponent: () =>
        import('./pages/articles-page/articles-page.component').then(
          (m) => m.ArticlesPageComponent,
        ),
      data: { locale },
    },
    {
      path: `${prefix}articles/:slug`,
      loadComponent: () =>
        import('./pages/article-page/article-page.component').then((m) => m.ArticlePageComponent),
      data: { locale },
    },
  ];
});

export const routes: Routes = [
  { path: '', component: HomePageComponent, pathMatch: 'full', data: { locale: DEFAULT_LOCALE } },
  ...homeRoutes,
  ...bookingRoutes,
  ...bookingSetupRoutes,
  ...bookingManageRoutes,
  ...articleRoutes,
  { path: 'privacy-policy', component: PrivacyPolicyPageComponent },
  { path: 'terms-of-service', component: TermsPageComponent },
];
