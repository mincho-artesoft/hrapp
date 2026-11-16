import { PRIORITY_ID } from '../id/articles-priority';
import type { ArticleLocale } from '../types';
import { CHROME_ID } from '../id/chrome';
import { ARTICLES_ID } from '../id/articles';
import { GOOGLE_ID } from '../id/articles-google';
export const ARTICLE_LOCALE: ArticleLocale = {
    chrome: CHROME_ID,
    articles: { ...PRIORITY_ID, ...ARTICLES_ID, ...GOOGLE_ID },
  };
