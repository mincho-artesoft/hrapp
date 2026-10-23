import { PRIORITY_RU } from '../ru/articles-priority';
import type { ArticleLocale } from '../types';
import { CHROME_RU } from '../ru/chrome';
import { ARTICLES_RU } from '../ru/articles';
import { GOOGLE_RU } from '../ru/articles-google';
export const ARTICLE_LOCALE: ArticleLocale = {
    chrome: CHROME_RU,
    articles: { ...PRIORITY_RU, ...ARTICLES_RU, ...GOOGLE_RU },
  };
