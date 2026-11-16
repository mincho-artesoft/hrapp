import { PRIORITY_IT } from '../it/articles-priority';
import type { ArticleLocale } from '../types';
import { CHROME_IT } from '../it/chrome';
import { ARTICLES_IT } from '../it/articles';
import { GOOGLE_IT } from '../it/articles-google';
import { HELP_IT } from '../it/articles-help';
export const ARTICLE_LOCALE: ArticleLocale = {
    chrome: CHROME_IT,
    articles: { ...PRIORITY_IT, ...ARTICLES_IT, ...GOOGLE_IT, ...HELP_IT },
  };
