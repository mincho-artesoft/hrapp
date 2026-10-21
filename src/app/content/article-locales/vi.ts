import type { ArticleLocale } from '../types';
import { CHROME_VI } from '../vi/chrome';
import { ARTICLES_VI } from '../vi/articles';
import { GOOGLE_VI } from '../vi/articles-google';
export const ARTICLE_LOCALE: ArticleLocale = {
    chrome: CHROME_VI,
    articles: { ...ARTICLES_VI, ...GOOGLE_VI },
  };
