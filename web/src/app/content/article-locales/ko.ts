import { PRIORITY_KO } from '../ko/articles-priority';
import type { ArticleLocale } from '../types';
import { CHROME_KO } from '../ko/chrome';
import { ARTICLES_KO } from '../ko/articles';
import { GOOGLE_KO } from '../ko/articles-google';
export const ARTICLE_LOCALE: ArticleLocale = {
    chrome: CHROME_KO,
    articles: { ...PRIORITY_KO, ...ARTICLES_KO, ...GOOGLE_KO },
  };
