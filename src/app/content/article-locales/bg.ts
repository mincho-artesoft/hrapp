import { PRIORITY_BG } from '../bg/articles-priority';
import type { ArticleLocale } from '../types';
import { CHROME_BG } from '../bg/chrome';
import { ARTICLES_BG } from '../bg/articles';
import { GOOGLE_BG } from '../bg/articles-google';
import { HELP_BG } from '../bg/articles-help';
export const ARTICLE_LOCALE: ArticleLocale = {
    chrome: CHROME_BG,
    articles: { ...PRIORITY_BG, ...ARTICLES_BG, ...GOOGLE_BG, ...HELP_BG },
  };
