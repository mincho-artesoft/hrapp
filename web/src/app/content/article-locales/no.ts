import { PRIORITY_NO } from '../no/articles-priority';
import type { ArticleLocale } from '../types';
import { CHROME_NO } from '../no/chrome';
import { ARTICLES_NO } from '../no/articles';
import { GOOGLE_NO } from '../no/articles-google';
export const ARTICLE_LOCALE: ArticleLocale = {
    chrome: CHROME_NO,
    articles: { ...PRIORITY_NO, ...ARTICLES_NO, ...GOOGLE_NO },
  };
