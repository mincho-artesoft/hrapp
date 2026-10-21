import type { ArticleLocale } from '../types';
import { CHROME_RO } from '../ro/chrome';
import { ARTICLES_RO } from '../ro/articles';
import { GOOGLE_RO } from '../ro/articles-google';
export const ARTICLE_LOCALE: ArticleLocale = {
    chrome: CHROME_RO,
    articles: { ...ARTICLES_RO, ...GOOGLE_RO },
  };
