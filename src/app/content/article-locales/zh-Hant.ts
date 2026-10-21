import type { ArticleLocale } from '../types';
import { CHROME_ZH_HANT } from '../zh-Hant/chrome';
import { ARTICLES_ZH_HANT } from '../zh-Hant/articles';
import { GOOGLE_ZH_HANT } from '../zh-Hant/articles-google';
export const ARTICLE_LOCALE: ArticleLocale = {
    chrome: CHROME_ZH_HANT,
    articles: { ...ARTICLES_ZH_HANT, ...GOOGLE_ZH_HANT },
  };
