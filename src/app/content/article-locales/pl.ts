import type { ArticleLocale } from '../types';
import { CHROME_PL } from '../pl/chrome';
import { ARTICLES_PL } from '../pl/articles';
import { GOOGLE_PL } from '../pl/articles-google';
export const ARTICLE_LOCALE: ArticleLocale = {
    chrome: CHROME_PL,
    articles: { ...ARTICLES_PL, ...GOOGLE_PL },
  };
