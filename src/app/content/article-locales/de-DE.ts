import type { ArticleLocale } from '../types';
import { CHROME_DE_DE } from '../de-DE/chrome';
import { ARTICLES_DE_DE } from '../de-DE/articles';
import { GOOGLE_DE_DE } from '../de-DE/articles-google';
import { HELP_DE_DE } from '../de-DE/articles-help';
export const ARTICLE_LOCALE: ArticleLocale = {
    chrome: CHROME_DE_DE,
    articles: { ...ARTICLES_DE_DE, ...GOOGLE_DE_DE, ...HELP_DE_DE },
  };
