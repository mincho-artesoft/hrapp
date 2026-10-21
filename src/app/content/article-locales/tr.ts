import type { ArticleLocale } from '../types';
import { CHROME_TR } from '../tr/chrome';
import { ARTICLES_TR } from '../tr/articles';
import { GOOGLE_TR } from '../tr/articles-google';
export const ARTICLE_LOCALE: ArticleLocale = {
    chrome: CHROME_TR,
    articles: { ...ARTICLES_TR, ...GOOGLE_TR },
  };
