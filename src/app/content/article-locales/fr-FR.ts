import type { ArticleLocale } from '../types';
import { CHROME_FR_FR } from '../fr-FR/chrome';
import { ARTICLES_FR_FR } from '../fr-FR/articles';
import { GOOGLE_FR_FR } from '../fr-FR/articles-google';
import { HELP_FR_FR } from '../fr-FR/articles-help';
export const ARTICLE_LOCALE: ArticleLocale = {
    chrome: CHROME_FR_FR,
    articles: { ...ARTICLES_FR_FR, ...GOOGLE_FR_FR, ...HELP_FR_FR },
  };
