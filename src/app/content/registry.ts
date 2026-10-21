import type { ArticleLocale } from './types';
export { LIVE_LOCALES, localesWith } from './article-index';

// Each route loads only its own language; the shell uses article-index, not bodies.
const LOADERS: Readonly<Record<string, () => Promise<{ ARTICLE_LOCALE: ArticleLocale }>>> = {
  "en-US": () => import('./article-locales/en-US'),
  "bg": () => import('./article-locales/bg'),
  "de-DE": () => import('./article-locales/de-DE'),
  "es-ES": () => import('./article-locales/es-ES'),
  "fr-FR": () => import('./article-locales/fr-FR'),
  "it": () => import('./article-locales/it'),
  "nl-NL": () => import('./article-locales/nl-NL'),
  "pt-BR": () => import('./article-locales/pt-BR'),
  "pl": () => import('./article-locales/pl'),
  "ru": () => import('./article-locales/ru'),
  "sv": () => import('./article-locales/sv'),
  "da": () => import('./article-locales/da'),
  "no": () => import('./article-locales/no'),
  "fi": () => import('./article-locales/fi'),
  "cs": () => import('./article-locales/cs'),
  "hu": () => import('./article-locales/hu'),
  "ro": () => import('./article-locales/ro'),
  "el": () => import('./article-locales/el'),
  "tr": () => import('./article-locales/tr'),
  "id": () => import('./article-locales/id'),
  "ms": () => import('./article-locales/ms'),
  "vi": () => import('./article-locales/vi'),
  "ja": () => import('./article-locales/ja'),
  "ko": () => import('./article-locales/ko'),
  "zh-Hans": () => import('./article-locales/zh-Hans'),
  "zh-Hant": () => import('./article-locales/zh-Hant'),
  "hi": () => import('./article-locales/hi'),
  "th": () => import('./article-locales/th'),
  "ar-SA": () => import('./article-locales/ar-SA'),
  "he": () => import('./article-locales/he'),
};
const pending = new Map<string, Promise<ArticleLocale>>();
export function loadContentFor(code: string): Promise<ArticleLocale> {
  const key = Object.hasOwn(LOADERS, code) ? code : 'en-US';
  let result = pending.get(key);
  if (!result) {
    result = LOADERS[key]().then(module => module.ARTICLE_LOCALE);
    pending.set(key, result);
    void result.catch(() => pending.delete(key));
  }
  return result;
}
