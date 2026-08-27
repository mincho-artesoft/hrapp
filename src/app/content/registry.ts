import { LOCALES, Locale } from '../core/locales';
import { CHROME_EN_US } from './en-US/chrome';
import { SHARING_EN_US } from './en-US/articles-sharing';
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
export const CONTENT: Readonly<Record<string, ArticleLocale>> = {
  'en-US': {
    chrome: CHROME_EN_US,
    articles: { ...WEATHER_EN_US, ...SHARING_EN_US },
  },
};

/** Languages with at least one article. Everything else is not yet published. */
export const LIVE_LOCALES: readonly Locale[] = LOCALES.filter((l) => l.code in CONTENT);

export function contentFor(code: string): ArticleLocale {
  return CONTENT[code] ?? CONTENT['en-US'];
}

/** Every locale that has this particular article, for the hreflang set. */
export function localesWith(slug: string): readonly Locale[] {
  return LIVE_LOCALES.filter((l) => slug in CONTENT[l.code].articles);
}
