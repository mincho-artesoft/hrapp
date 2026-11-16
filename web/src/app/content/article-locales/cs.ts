import { PRIORITY_CS } from '../cs/articles-priority';
import type { ArticleLocale } from '../types';
import { CHROME_CS } from '../cs/chrome';
import { ARTICLES_CS } from '../cs/articles';
import { GOOGLE_CS } from '../cs/articles-google';
export const ARTICLE_LOCALE: ArticleLocale = {
    chrome: CHROME_CS,
    articles: { ...PRIORITY_CS, ...ARTICLES_CS, ...GOOGLE_CS },
  };
