import { DEFAULT_LOCALE, Locale, LocaleCode } from './locales';

// Approved languages for Google article & article-hub indexing.
// Other translated locales remain indexable by Bing and AI crawlers (robots="index,follow")
// while carrying googlebot="noindex,follow" until individually approved for Google.
export const GOOGLE_INDEXED_ARTICLE_LOCALES: ReadonlySet<LocaleCode> = new Set<LocaleCode>([
  DEFAULT_LOCALE.code as LocaleCode,
  'es-ES',
  'de-DE',
  'fr-FR',
  'it',
  'ja',
  'pt-BR',
  'pl',
]);

export function isArticleLocaleIndexable(locale: Locale): boolean {
  return GOOGLE_INDEXED_ARTICLE_LOCALES.has(locale.code as LocaleCode);
}
