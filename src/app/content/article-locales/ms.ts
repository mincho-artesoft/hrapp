import { PRIORITY_MS } from '../ms/articles-priority';
import type { ArticleLocale } from '../types';
import { CHROME_MS } from '../ms/chrome';
import { ARTICLES_MS } from '../ms/articles';
import { GOOGLE_MS } from '../ms/articles-google';
export const ARTICLE_LOCALE: ArticleLocale = {
    chrome: CHROME_MS,
    articles: { ...PRIORITY_MS, ...ARTICLES_MS, ...GOOGLE_MS },
  };
