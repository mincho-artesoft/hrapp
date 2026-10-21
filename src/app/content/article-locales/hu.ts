import type { ArticleLocale } from '../types';
import { CHROME_HU } from '../hu/chrome';
import { ARTICLES_HU } from '../hu/articles';
import { GOOGLE_HU } from '../hu/articles-google';
export const ARTICLE_LOCALE: ArticleLocale = {
    chrome: CHROME_HU,
    articles: { ...ARTICLES_HU, ...GOOGLE_HU },
  };
