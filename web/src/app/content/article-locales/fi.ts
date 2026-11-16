import { PRIORITY_FI } from '../fi/articles-priority';
import type { ArticleLocale } from '../types';
import { CHROME_FI } from '../fi/chrome';
import { ARTICLES_FI } from '../fi/articles';
import { GOOGLE_FI } from '../fi/articles-google';
export const ARTICLE_LOCALE: ArticleLocale = {
    chrome: CHROME_FI,
    articles: { ...PRIORITY_FI, ...ARTICLES_FI, ...GOOGLE_FI },
  };
