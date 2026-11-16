import { PRIORITY_SV } from '../sv/articles-priority';
import type { ArticleLocale } from '../types';
import { CHROME_SV } from '../sv/chrome';
import { ARTICLES_SV } from '../sv/articles';
import { GOOGLE_SV } from '../sv/articles-google';
export const ARTICLE_LOCALE: ArticleLocale = {
    chrome: CHROME_SV,
    articles: { ...PRIORITY_SV, ...ARTICLES_SV, ...GOOGLE_SV },
  };
