import { LOCALES, Locale, LocaleCode } from '../core/locales';
import { CHROME_EN_US } from './en-US/chrome';
import { ARTICLES_DE_DE } from './de-DE/articles';
import { GOOGLE_DE_DE } from './de-DE/articles-google';
import { CHROME_DE_DE } from './de-DE/chrome';
import { ARTICLES_ES_ES } from './es-ES/articles';
import { GOOGLE_ES_ES } from './es-ES/articles-google';
import { CHROME_ES_ES } from './es-ES/chrome';
import { ARTICLES_FR_FR } from './fr-FR/articles';
import { GOOGLE_FR_FR } from './fr-FR/articles-google';
import { CHROME_FR_FR } from './fr-FR/chrome';
import { ARTICLES_IT } from './it/articles';
import { GOOGLE_IT } from './it/articles-google';
import { CHROME_IT } from './it/chrome';
import { COMPARE_EN_US } from './en-US/articles-compare';
import { PLANNING_EN_US } from './en-US/articles-planning';
import { SHARING_EN_US } from './en-US/articles-sharing';
import { UNIFY_EN_US } from './en-US/articles-unify';
import { WIDGETS_EN_US } from './en-US/articles-widgets';
import { WEATHER_EN_US } from './en-US/articles-weather';
import { GOOGLE_EN_US } from './en-US/articles-google';
import { ARTICLES_NL_NL } from './nl-NL/articles';
import { GOOGLE_NL_NL } from './nl-NL/articles-google';
import { CHROME_NL_NL } from './nl-NL/chrome';
import { ARTICLES_PT_BR } from './pt-BR/articles';
import { GOOGLE_PT_BR } from './pt-BR/articles-google';
import { CHROME_PT_BR } from './pt-BR/chrome';
import { ARTICLES_PL } from './pl/articles';
import { GOOGLE_PL } from './pl/articles-google';
import { CHROME_PL } from './pl/chrome';
import { ARTICLES_RU } from './ru/articles';
import { GOOGLE_RU } from './ru/articles-google';
import { CHROME_RU } from './ru/chrome';
import { ARTICLES_SV } from './sv/articles';
import { GOOGLE_SV } from './sv/articles-google';
import { CHROME_SV } from './sv/chrome';
import { ARTICLES_DA } from './da/articles';
import { GOOGLE_DA } from './da/articles-google';
import { CHROME_DA } from './da/chrome';
import { ARTICLES_NO } from './no/articles';
import { GOOGLE_NO } from './no/articles-google';
import { CHROME_NO } from './no/chrome';
import { ARTICLES_FI } from './fi/articles';
import { GOOGLE_FI } from './fi/articles-google';
import { CHROME_FI } from './fi/chrome';
import { ARTICLES_CS } from './cs/articles';
import { GOOGLE_CS } from './cs/articles-google';
import { CHROME_CS } from './cs/chrome';
import { ARTICLES_HU } from './hu/articles';
import { GOOGLE_HU } from './hu/articles-google';
import { CHROME_HU } from './hu/chrome';
import { ARTICLES_RO } from './ro/articles';
import { GOOGLE_RO } from './ro/articles-google';
import { CHROME_RO } from './ro/chrome';
import { ARTICLES_EL } from './el/articles';
import { GOOGLE_EL } from './el/articles-google';
import { CHROME_EL } from './el/chrome';
import { ARTICLES_TR } from './tr/articles';
import { GOOGLE_TR } from './tr/articles-google';
import { CHROME_TR } from './tr/chrome';
import { ARTICLES_ID } from './id/articles';
import { GOOGLE_ID } from './id/articles-google';
import { CHROME_ID } from './id/chrome';
import { ARTICLES_MS } from './ms/articles';
import { GOOGLE_MS } from './ms/articles-google';
import { CHROME_MS } from './ms/chrome';
import { ARTICLES_VI } from './vi/articles';
import { GOOGLE_VI } from './vi/articles-google';
import { CHROME_VI } from './vi/chrome';
import { ARTICLES_JA } from './ja/articles';
import { GOOGLE_JA } from './ja/articles-google';
import { CHROME_JA } from './ja/chrome';
import { ARTICLES_KO } from './ko/articles';
import { GOOGLE_KO } from './ko/articles-google';
import { CHROME_KO } from './ko/chrome';
import { ARTICLES_ZH_HANS } from './zh-Hans/articles';
import { GOOGLE_ZH_HANS } from './zh-Hans/articles-google';
import { CHROME_ZH_HANS } from './zh-Hans/chrome';
import { ARTICLES_ZH_HANT } from './zh-Hant/articles';
import { GOOGLE_ZH_HANT } from './zh-Hant/articles-google';
import { CHROME_ZH_HANT } from './zh-Hant/chrome';
import { ARTICLES_HI } from './hi/articles';
import { GOOGLE_HI } from './hi/articles-google';
import { CHROME_HI } from './hi/chrome';
import { ARTICLES_TH } from './th/articles';
import { GOOGLE_TH } from './th/articles-google';
import { CHROME_TH } from './th/chrome';
import { ARTICLES_BG } from './bg/articles';
import { GOOGLE_BG } from './bg/articles-google';
import { CHROME_BG } from './bg/chrome';
import { ARTICLES_AR_SA } from './ar-SA/articles';
import { GOOGLE_AR_SA } from './ar-SA/articles-google';
import { CHROME_AR_SA } from './ar-SA/chrome';
import { ARTICLES_HE } from './he/articles';
import { GOOGLE_HE } from './he/articles-google';
import { CHROME_HE } from './he/chrome';
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
      ...GOOGLE_EN_US,
    },
  },
  bg: {
    chrome: CHROME_BG,
    articles: { ...ARTICLES_BG, ...GOOGLE_BG },
  },
  'de-DE': {
    chrome: CHROME_DE_DE,
    articles: { ...ARTICLES_DE_DE, ...GOOGLE_DE_DE },
  },
  'es-ES': {
    chrome: CHROME_ES_ES,
    articles: { ...ARTICLES_ES_ES, ...GOOGLE_ES_ES },
  },
  'fr-FR': {
    chrome: CHROME_FR_FR,
    articles: { ...ARTICLES_FR_FR, ...GOOGLE_FR_FR },
  },
  it: {
    chrome: CHROME_IT,
    articles: { ...ARTICLES_IT, ...GOOGLE_IT },
  },
  'nl-NL': {
    chrome: CHROME_NL_NL,
    articles: { ...ARTICLES_NL_NL, ...GOOGLE_NL_NL },
  },
  'pt-BR': {
    chrome: CHROME_PT_BR,
    articles: { ...ARTICLES_PT_BR, ...GOOGLE_PT_BR },
  },
  pl: {
    chrome: CHROME_PL,
    articles: { ...ARTICLES_PL, ...GOOGLE_PL },
  },
  ru: {
    chrome: CHROME_RU,
    articles: { ...ARTICLES_RU, ...GOOGLE_RU },
  },
  sv: {
    chrome: CHROME_SV,
    articles: { ...ARTICLES_SV, ...GOOGLE_SV },
  },
  da: {
    chrome: CHROME_DA,
    articles: { ...ARTICLES_DA, ...GOOGLE_DA },
  },
  no: {
    chrome: CHROME_NO,
    articles: { ...ARTICLES_NO, ...GOOGLE_NO },
  },
  fi: {
    chrome: CHROME_FI,
    articles: { ...ARTICLES_FI, ...GOOGLE_FI },
  },
  cs: {
    chrome: CHROME_CS,
    articles: { ...ARTICLES_CS, ...GOOGLE_CS },
  },
  hu: {
    chrome: CHROME_HU,
    articles: { ...ARTICLES_HU, ...GOOGLE_HU },
  },
  ro: {
    chrome: CHROME_RO,
    articles: { ...ARTICLES_RO, ...GOOGLE_RO },
  },
  el: {
    chrome: CHROME_EL,
    articles: { ...ARTICLES_EL, ...GOOGLE_EL },
  },
  tr: {
    chrome: CHROME_TR,
    articles: { ...ARTICLES_TR, ...GOOGLE_TR },
  },
  id: {
    chrome: CHROME_ID,
    articles: { ...ARTICLES_ID, ...GOOGLE_ID },
  },
  ms: {
    chrome: CHROME_MS,
    articles: { ...ARTICLES_MS, ...GOOGLE_MS },
  },
  vi: {
    chrome: CHROME_VI,
    articles: { ...ARTICLES_VI, ...GOOGLE_VI },
  },
  ja: {
    chrome: CHROME_JA,
    articles: { ...ARTICLES_JA, ...GOOGLE_JA },
  },
  ko: {
    chrome: CHROME_KO,
    articles: { ...ARTICLES_KO, ...GOOGLE_KO },
  },
  'zh-Hans': {
    chrome: CHROME_ZH_HANS,
    articles: { ...ARTICLES_ZH_HANS, ...GOOGLE_ZH_HANS },
  },
  'zh-Hant': {
    chrome: CHROME_ZH_HANT,
    articles: { ...ARTICLES_ZH_HANT, ...GOOGLE_ZH_HANT },
  },
  hi: {
    chrome: CHROME_HI,
    articles: { ...ARTICLES_HI, ...GOOGLE_HI },
  },
  th: {
    chrome: CHROME_TH,
    articles: { ...ARTICLES_TH, ...GOOGLE_TH },
  },
  'ar-SA': {
    chrome: CHROME_AR_SA,
    articles: { ...ARTICLES_AR_SA, ...GOOGLE_AR_SA },
  },
  he: {
    chrome: CHROME_HE,
    articles: { ...ARTICLES_HE, ...GOOGLE_HE },
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
