import type { ArticleLocale } from '../types';
import { CHROME_HE } from '../he/chrome';
import { ARTICLES_HE } from '../he/articles';
import { GOOGLE_HE } from '../he/articles-google';
export const ARTICLE_LOCALE: ArticleLocale = {
    chrome: CHROME_HE,
    articles: { ...ARTICLES_HE, ...GOOGLE_HE },
  };
