import { PRIORITY_ZH_HANS } from '../zh-Hans/articles-priority';
import type { ArticleLocale } from '../types';
import { CHROME_ZH_HANS } from '../zh-Hans/chrome';
import { ARTICLES_ZH_HANS } from '../zh-Hans/articles';
import { GOOGLE_ZH_HANS } from '../zh-Hans/articles-google';
export const ARTICLE_LOCALE: ArticleLocale = {
    chrome: CHROME_ZH_HANS,
    articles: { ...PRIORITY_ZH_HANS, ...ARTICLES_ZH_HANS, ...GOOGLE_ZH_HANS },
  };
