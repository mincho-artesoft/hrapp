import { PRIORITY_TR } from '../tr/articles-priority';
import type { ArticleLocale } from '../types';
import { CHROME_TR } from '../tr/chrome';
import { ARTICLES_TR } from '../tr/articles';
import { GOOGLE_TR } from '../tr/articles-google';
export const ARTICLE_LOCALE: ArticleLocale = {
    chrome: CHROME_TR,
    articles: { ...PRIORITY_TR, ...ARTICLES_TR, ...GOOGLE_TR },
  };
