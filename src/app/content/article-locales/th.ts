import type { ArticleLocale } from '../types';
import { CHROME_TH } from '../th/chrome';
import { ARTICLES_TH } from '../th/articles';
import { GOOGLE_TH } from '../th/articles-google';
export const ARTICLE_LOCALE: ArticleLocale = {
    chrome: CHROME_TH,
    articles: { ...ARTICLES_TH, ...GOOGLE_TH },
  };
