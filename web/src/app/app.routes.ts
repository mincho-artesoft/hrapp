import { Routes, ResolveFn } from '@angular/router';

import { LIVE_LOCALES } from './content/article-index';
import { loadArticleContentFor, loadComparisonContentFor } from './content/registry';
import type { ArticleLocale } from './content/types';
import { DEFAULT_LOCALE, LOCALES } from './core/locales';

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
const resolveArticleContent: ResolveFn<ArticleLocale> = route => loadArticleContentFor(route.data['locale'].code, route.paramMap.get('slug') ?? undefined);
const resolveComparisonContent: ResolveFn<ArticleLocale> = route => loadComparisonContentFor(route.paramMap.get('slug') ?? '');

const homeRoutes: Routes = LOCALES.map((locale) => ({
  path: locale.slug,
  loadComponent: () => import('./pages/home-page/home-page.component').then(m => m.HomePageComponent),
  pathMatch: 'full' as const,
  data: { locale },
  resolve: { articleContent: resolveArticleContent },
}));

/**
 * Shareable fixed-date events. The public event page at `/event` (reads `?e=`),
 * and the registrant's manage page at `/event/manage` (reads `?t=`). These are
 * independent of the removed scheduling portal. All noindex, browser-rendered; the
 * handle/token ride in the query, so one static file per language each.
 */
const eventRoutes: Routes = LOCALES.flatMap((locale) => {
  const p = (path: string) => (locale.slug ? `${locale.slug}/${path}` : path);
  return [
    {
      path: p('event'),
      loadComponent: () => import('./pages/event-page/event-page.component').then((m) => m.EventPageComponent),
      data: { locale },
    },
    {
      path: p('event/manage'),
      loadComponent: () => import('./pages/event-manage-page/event-manage-page.component').then((m) => m.EventManagePageComponent),
      data: { locale },
    },
    {
      path: p('calendar'),
      loadComponent: () => import('./pages/web-calendar-page/web-calendar-page.component').then((m) => m.WebCalendarPageComponent),
      data: { locale },
      children: [{ path: 'bookings', data: { bookings: true }, children: [] }],
    },
    {
      path: p('admin'),
      loadComponent: () => import('./pages/admin-console-page/admin-console-page.component').then((m) => m.AdminConsolePageComponent),
      data: { locale },
    },
    {
      path: p('app-auth'),
      loadComponent: () => import('./pages/app-auth-page/app-auth-page.component').then((m) => m.AppAuthPageComponent),
      data: { locale },
    },
  ];
});

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
      resolve: { articleContent: resolveArticleContent },
    },
    {
      path: `${prefix}articles/:slug`,
      loadComponent: () =>
        import('./pages/article-page/article-page.component').then((m) => m.ArticlePageComponent),
      data: { locale },
      resolve: { articleContent: resolveArticleContent },
    },
  ];
});

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home-page/home-page.component').then(m => m.HomePageComponent),
    pathMatch: 'full',
    data: { locale: DEFAULT_LOCALE },
    resolve: { articleContent: resolveArticleContent },
  },
  ...homeRoutes,
  ...eventRoutes,
  {
    path: 'articles/topics/:family/:page',
    loadComponent: () => import('./pages/articles-page/articles-page.component').then(m => m.ArticlesPageComponent),
    data: { locale: DEFAULT_LOCALE, topicHub: true },
    resolve: { articleContent: resolveArticleContent },
  },
  ...articleRoutes,
  {
    path: 'compare',
    loadComponent: () => import('./pages/compare-page/compare-page.component').then((m) => m.ComparePageComponent),
    data: { locale: DEFAULT_LOCALE },
  },
  {
    path: 'compare/:slug',
    loadComponent: () => import('./pages/article-page/article-page.component').then((m) => m.ArticlePageComponent),
    data: { locale: DEFAULT_LOCALE, isComparison: true },
    resolve: { articleContent: resolveComparisonContent },
  },
  { path: 'privacy-policy', loadComponent: () => import('./pages/privacy-policy-page/privacy-policy-page.component').then(m => m.PrivacyPolicyPageComponent) },
  { path: 'terms-of-service', loadComponent: () => import('./pages/terms-page/terms-page.component').then(m => m.TermsPageComponent) },
];
