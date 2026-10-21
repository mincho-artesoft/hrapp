import type { ArticleLocale } from '../types';
import { CHROME_ES_ES } from '../es-ES/chrome';
import { ARTICLES_ES_ES } from '../es-ES/articles';
import { GOOGLE_ES_ES } from '../es-ES/articles-google';
import { HELP_ES_ES } from '../es-ES/articles-help';
export const ARTICLE_LOCALE: ArticleLocale = {
    chrome: CHROME_ES_ES,
    articles: { ...ARTICLES_ES_ES, ...GOOGLE_ES_ES, ...HELP_ES_ES },
  };
