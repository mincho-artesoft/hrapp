import type { ArticleLocale } from '../types';
import { CHROME_DA } from '../da/chrome';
import { ARTICLES_DA } from '../da/articles';
import { GOOGLE_DA } from '../da/articles-google';
export const ARTICLE_LOCALE: ArticleLocale = {
    chrome: CHROME_DA,
    articles: { ...ARTICLES_DA, ...GOOGLE_DA },
  };
