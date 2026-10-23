import { PRIORITY_HI } from '../hi/articles-priority';
import type { ArticleLocale } from '../types';
import { CHROME_HI } from '../hi/chrome';
import { ARTICLES_HI } from '../hi/articles';
import { GOOGLE_HI } from '../hi/articles-google';
export const ARTICLE_LOCALE: ArticleLocale = {
    chrome: CHROME_HI,
    articles: { ...PRIORITY_HI, ...ARTICLES_HI, ...GOOGLE_HI },
  };
