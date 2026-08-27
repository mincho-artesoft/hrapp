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
  ...articleRoutes,
  { path: 'privacy-policy', component: PrivacyPolicyPageComponent },
  { path: 'terms-of-service', component: TermsPageComponent },
];
