import { DEFAULT_LOCALE, Locale } from './locales';

// Translated articles and their hubs remain readable while awaiting individual
// editorial approval. New translations inherit the hold automatically.
export function isArticleLocaleIndexable(locale: Locale): boolean {
  return locale.code === DEFAULT_LOCALE.code;
}
