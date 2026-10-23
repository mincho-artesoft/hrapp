import { PRIORITY_JA } from '../ja/articles-priority';
import type { ArticleLocale } from '../types';
import { CHROME_JA } from '../ja/chrome';
import { ARTICLES_JA } from '../ja/articles';
import { GOOGLE_JA } from '../ja/articles-google';
export const ARTICLE_LOCALE: ArticleLocale = {
    chrome: CHROME_JA,
    articles: { ...PRIORITY_JA, ...ARTICLES_JA, ...GOOGLE_JA },
  };
