import { LOCALES, Locale, LocaleCode } from '../core/locales';
import { CHROME_EN_US } from './en-US/chrome';
import { ARTICLES_DE_DE } from './de-DE/articles';
import { CHROME_DE_DE } from './de-DE/chrome';
import { ARTICLES_ES_ES } from './es-ES/articles';
import { CHROME_ES_ES } from './es-ES/chrome';
import { ARTICLES_FR_FR } from './fr-FR/articles';
import { CHROME_FR_FR } from './fr-FR/chrome';
import { ARTICLES_IT } from './it/articles';
import { CHROME_IT } from './it/chrome';
import { COMPARE_EN_US } from './en-US/articles-compare';
import { PLANNING_EN_US } from './en-US/articles-planning';
import { SHARING_EN_US } from './en-US/articles-sharing';
import { UNIFY_EN_US } from './en-US/articles-unify';
import { WIDGETS_EN_US } from './en-US/articles-widgets';
import { WEATHER_EN_US } from './en-US/articles-weather';
import { ArticleLocale } from './types';

/**
 * Which language has which articles.
 *
 * A language appears here only once it has something to show. That is what
 * keeps the build from prerendering a page for every unwritten translation —
 * blank, indexed, and linked to from the hreflang set of the article that does
 * exist, which is worse than not existing at all.
 *
 * The plan is forty articles in English, twelve in German, Spanish, French and
 * Italian, and four plus the interface everywhere else. Each language is added
 * to this map as its own articles land, so the sitemap and the language
 * switcher always describe what is actually published.
 */
export const CONTENT: Readonly<Partial<Record<LocaleCode, ArticleLocale>>> = {
  'en-US': {
    chrome: CHROME_EN_US,
    articles: {
      ...WEATHER_EN_US,
      ...UNIFY_EN_US,
      ...WIDGETS_EN_US,
      ...SHARING_EN_US,
      ...PLANNING_EN_US,
      ...COMPARE_EN_US,
    },
  },
  'de-DE': {
    chrome: CHROME_DE_DE,
    articles: ARTICLES_DE_DE,
  },
  'es-ES': {
    chrome: CHROME_ES_ES,
    articles: ARTICLES_ES_ES,
  },
  'fr-FR': {
    chrome: CHROME_FR_FR,
    articles: ARTICLES_FR_FR,
  },
  it: {
    chrome: CHROME_IT,
    articles: ARTICLES_IT,
  },
};

/** Languages with at least one article. Everything else is not yet published. */
export const LIVE_LOCALES: readonly Locale[] = LOCALES.filter((l) => l.code in CONTENT);

export function contentFor(code: string): ArticleLocale {
  return CONTENT[code as LocaleCode] ?? CONTENT['en-US']!;
}

/** Every locale that has this particular article, for the hreflang set. */
export function localesWith(slug: string): readonly Locale[] {
  return LIVE_LOCALES.filter((l) => slug in CONTENT[l.code as LocaleCode]!.articles);
}
