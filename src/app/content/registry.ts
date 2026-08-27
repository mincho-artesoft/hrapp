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
import { ARTICLES_NL_NL } from './nl-NL/articles';
import { CHROME_NL_NL } from './nl-NL/chrome';
import { ARTICLES_PT_BR } from './pt-BR/articles';
import { CHROME_PT_BR } from './pt-BR/chrome';
import { ARTICLES_PL } from './pl/articles';
import { CHROME_PL } from './pl/chrome';
import { ARTICLES_RU } from './ru/articles';
import { CHROME_RU } from './ru/chrome';
import { ARTICLES_SV } from './sv/articles';
import { CHROME_SV } from './sv/chrome';
import { ARTICLES_DA } from './da/articles';
import { CHROME_DA } from './da/chrome';
import { ARTICLES_NO } from './no/articles';
import { CHROME_NO } from './no/chrome';
import { ARTICLES_FI } from './fi/articles';
import { CHROME_FI } from './fi/chrome';
import { ARTICLES_CS } from './cs/articles';
import { CHROME_CS } from './cs/chrome';
import { ARTICLES_HU } from './hu/articles';
import { CHROME_HU } from './hu/chrome';
import { ARTICLES_RO } from './ro/articles';
import { CHROME_RO } from './ro/chrome';
import { ARTICLES_EL } from './el/articles';
import { CHROME_EL } from './el/chrome';
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
  'nl-NL': {
    chrome: CHROME_NL_NL,
    articles: ARTICLES_NL_NL,
  },
  'pt-BR': {
    chrome: CHROME_PT_BR,
    articles: ARTICLES_PT_BR,
  },
  pl: {
    chrome: CHROME_PL,
    articles: ARTICLES_PL,
  },
  ru: {
    chrome: CHROME_RU,
    articles: ARTICLES_RU,
  },
  sv: {
    chrome: CHROME_SV,
    articles: ARTICLES_SV,
  },
  da: {
    chrome: CHROME_DA,
    articles: ARTICLES_DA,
  },
  no: {
    chrome: CHROME_NO,
    articles: ARTICLES_NO,
  },
  fi: {
    chrome: CHROME_FI,
    articles: ARTICLES_FI,
  },
  cs: {
    chrome: CHROME_CS,
    articles: ARTICLES_CS,
  },
  hu: {
    chrome: CHROME_HU,
    articles: ARTICLES_HU,
  },
  ro: {
    chrome: CHROME_RO,
    articles: ARTICLES_RO,
  },
  el: {
    chrome: CHROME_EL,
    articles: ARTICLES_EL,
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
