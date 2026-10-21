import type { ArticleLocale } from '../types';
import { CHROME_KO } from '../ko/chrome';
import { ARTICLES_KO } from '../ko/articles';
import { GOOGLE_KO } from '../ko/articles-google';
export const ARTICLE_LOCALE: ArticleLocale = {
    chrome: CHROME_KO,
    articles: { ...ARTICLES_KO, ...GOOGLE_KO },
  };
