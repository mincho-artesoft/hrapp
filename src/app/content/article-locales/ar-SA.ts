import type { ArticleLocale } from '../types';
import { CHROME_AR_SA } from '../ar-SA/chrome';
import { ARTICLES_AR_SA } from '../ar-SA/articles';
import { GOOGLE_AR_SA } from '../ar-SA/articles-google';
export const ARTICLE_LOCALE: ArticleLocale = {
    chrome: CHROME_AR_SA,
    articles: { ...ARTICLES_AR_SA, ...GOOGLE_AR_SA },
  };
