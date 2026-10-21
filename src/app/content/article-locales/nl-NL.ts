import type { ArticleLocale } from '../types';
import { CHROME_NL_NL } from '../nl-NL/chrome';
import { ARTICLES_NL_NL } from '../nl-NL/articles';
import { GOOGLE_NL_NL } from '../nl-NL/articles-google';
export const ARTICLE_LOCALE: ArticleLocale = {
    chrome: CHROME_NL_NL,
    articles: { ...ARTICLES_NL_NL, ...GOOGLE_NL_NL },
  };
