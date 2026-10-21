import type { ArticleLocale } from '../types';
import { CHROME_EL } from '../el/chrome';
import { ARTICLES_EL } from '../el/articles';
import { GOOGLE_EL } from '../el/articles-google';
export const ARTICLE_LOCALE: ArticleLocale = {
    chrome: CHROME_EL,
    articles: { ...ARTICLES_EL, ...GOOGLE_EL },
  };
