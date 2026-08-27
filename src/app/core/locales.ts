/**
 * The languages this site is published in.
 *
 * The App Store carries 31 localisations, but two of them — en-CA and fr-CA —
 * hold the same words as en-US and fr-FR. Publishing identical copy at two
 * addresses is duplicate content, not regional targeting, so the web ships 29
 * languages and the two Canadian storefronts reuse the language page. The
 * `media` field keeps the link to the App Store folder the screenshots came
 * from, which is why it is not simply derived from `code`.
 *
 * `slug` is the URL prefix. English has none: it is the site's default and
 * lives at the root, so /guides/x rather than /en/guides/x.
 *
 * `dir` matters for more than text alignment. Arabic and Hebrew ship their
 * five App Store screenshots in mirrored order, which the media manifest
 * records; a carousel that assumed a fixed order would show the wrong picture
 * in exactly the two languages nobody on the team can proofread.
 */
export interface Locale {
  /** BCP 47, as Apple writes it. */
  readonly code: string;
  /** URL prefix. Empty for the default language. */
  readonly slug: string;
  /** The hreflang value search engines are given. */
  readonly hreflang: string;
  /** The language's own name for itself, for the switcher. */
  readonly label: string;
  readonly dir: 'ltr' | 'rtl';
  /** Folder in the media bucket, which follows App Store naming. */
  readonly media: string;
  /** App Store storefront country code, for download links. */
  readonly storefront: string;
}

export const LOCALES: readonly Locale[] = [
  {
    code: 'en-US',
    slug: '',
    hreflang: 'en',
    label: 'English',
    dir: 'ltr',
    media: 'en-US',
    storefront: 'us',
  },
  {
    code: 'ar-SA',
    slug: 'ar',
    hreflang: 'ar',
    label: 'العربية',
    dir: 'rtl',
    media: 'ar-SA',
    storefront: 'sa',
  },
  {
    code: 'cs',
    slug: 'cs',
    hreflang: 'cs',
    label: 'Čeština',
    dir: 'ltr',
    media: 'cs',
    storefront: 'cz',
  },
  {
    code: 'da',
    slug: 'da',
    hreflang: 'da',
    label: 'Dansk',
    dir: 'ltr',
    media: 'da',
    storefront: 'dk',
  },
  {
    code: 'de-DE',
    slug: 'de',
    hreflang: 'de',
    label: 'Deutsch',
    dir: 'ltr',
    media: 'de-DE',
    storefront: 'de',
  },
  {
    code: 'el',
    slug: 'el',
    hreflang: 'el',
    label: 'Ελληνικά',
    dir: 'ltr',
    media: 'el',
    storefront: 'gr',
  },
  {
    code: 'es-ES',
    slug: 'es',
    hreflang: 'es',
    label: 'Español',
    dir: 'ltr',
    media: 'es-ES',
    storefront: 'es',
  },
  {
    code: 'fi',
    slug: 'fi',
    hreflang: 'fi',
    label: 'Suomi',
    dir: 'ltr',
    media: 'fi',
    storefront: 'fi',
  },
  {
    code: 'fr-FR',
    slug: 'fr',
    hreflang: 'fr',
    label: 'Français',
    dir: 'ltr',
    media: 'fr-FR',
    storefront: 'fr',
  },
  {
    code: 'he',
    slug: 'he',
    hreflang: 'he',
    label: 'עברית',
    dir: 'rtl',
    media: 'he',
    storefront: 'il',
  },
  {
    code: 'hi',
    slug: 'hi',
    hreflang: 'hi',
    label: 'हिन्दी',
    dir: 'ltr',
    media: 'hi',
    storefront: 'in',
  },
  {
    code: 'hu',
    slug: 'hu',
    hreflang: 'hu',
    label: 'Magyar',
    dir: 'ltr',
    media: 'hu',
    storefront: 'hu',
  },
  {
    code: 'id',
    slug: 'id',
    hreflang: 'id',
    label: 'Indonesia',
    dir: 'ltr',
    media: 'id',
    storefront: 'id',
  },
  {
    code: 'it',
    slug: 'it',
    hreflang: 'it',
    label: 'Italiano',
    dir: 'ltr',
    media: 'it',
    storefront: 'it',
  },
  {
    code: 'ja',
    slug: 'ja',
    hreflang: 'ja',
    label: '日本語',
    dir: 'ltr',
    media: 'ja',
    storefront: 'jp',
  },
  {
    code: 'ko',
    slug: 'ko',
    hreflang: 'ko',
    label: '한국어',
    dir: 'ltr',
    media: 'ko',
    storefront: 'kr',
  },
  {
    code: 'ms',
    slug: 'ms',
    hreflang: 'ms',
    label: 'Melayu',
    dir: 'ltr',
    media: 'ms',
    storefront: 'my',
  },
  {
    code: 'nl-NL',
    slug: 'nl',
    hreflang: 'nl',
    label: 'Nederlands',
    dir: 'ltr',
    media: 'nl-NL',
    storefront: 'nl',
  },
  {
    code: 'no',
    slug: 'no',
    hreflang: 'no',
    label: 'Norsk',
    dir: 'ltr',
    media: 'no',
    storefront: 'no',
  },
  {
    code: 'pl',
    slug: 'pl',
    hreflang: 'pl',
    label: 'Polski',
    dir: 'ltr',
    media: 'pl',
    storefront: 'pl',
  },
  {
    code: 'pt-BR',
    slug: 'pt',
    hreflang: 'pt',
    label: 'Português',
    dir: 'ltr',
    media: 'pt-BR',
    storefront: 'br',
  },
  {
    code: 'ro',
    slug: 'ro',
    hreflang: 'ro',
    label: 'Română',
    dir: 'ltr',
    media: 'ro',
    storefront: 'ro',
  },
  {
    code: 'ru',
    slug: 'ru',
    hreflang: 'ru',
    label: 'Русский',
    dir: 'ltr',
    media: 'ru',
    storefront: 'ru',
  },
  {
    code: 'sv',
    slug: 'sv',
    hreflang: 'sv',
    label: 'Svenska',
    dir: 'ltr',
    media: 'sv',
    storefront: 'se',
  },
  {
    code: 'th',
    slug: 'th',
    hreflang: 'th',
    label: 'ไทย',
    dir: 'ltr',
    media: 'th',
    storefront: 'th',
  },
  {
    code: 'tr',
    slug: 'tr',
    hreflang: 'tr',
    label: 'Türkçe',
    dir: 'ltr',
    media: 'tr',
    storefront: 'tr',
  },
  {
    code: 'vi',
    slug: 'vi',
    hreflang: 'vi',
    label: 'Tiếng Việt',
    dir: 'ltr',
    media: 'vi',
    storefront: 'vn',
  },
  {
    code: 'zh-Hans',
    slug: 'zh-hans',
    hreflang: 'zh-Hans',
    label: '简体中文',
    dir: 'ltr',
    media: 'zh-Hans',
    storefront: 'cn',
  },
  {
    code: 'zh-Hant',
    slug: 'zh-hant',
    hreflang: 'zh-Hant',
    label: '繁體中文',
    dir: 'ltr',
    media: 'zh-Hant',
    storefront: 'tw',
  },
];

export const DEFAULT_LOCALE: Locale = LOCALES[0];

/** Look one up by code, falling back to English rather than throwing. */
export function localeByCode(code: string): Locale {
  return LOCALES.find((l) => l.code === code) ?? DEFAULT_LOCALE;
}

/** Prefix a route path with a locale's slug. `/` stays `/`. */
export function localePath(locale: Locale, path: string): string {
  const clean = path === '/' ? '' : path.replace(/^\/+/, '');
  const parts = [locale.slug, clean].filter(Boolean);
  return '/' + parts.join('/');
}

/**
 * The App Store link for a locale.
 *
 * Apple resolves the storefront from the path segment, so a German reader
 * lands on the German listing instead of the American one and sees prices in
 * the currency they will actually be charged in.
 */
export function storeUrl(locale: Locale, base: string): string {
  return base.replace(/\/[a-z]{2}\/app\//, `/${locale.storefront}/app/`);
}
