import type { ArticleLocale } from '../types';
import { CHROME_PT_BR } from '../pt-BR/chrome';
import { ARTICLES_PT_BR } from '../pt-BR/articles';
import { GOOGLE_PT_BR } from '../pt-BR/articles-google';
import { HELP_PT_BR } from '../pt-BR/articles-help';
export const ARTICLE_LOCALE: ArticleLocale = {
    chrome: CHROME_PT_BR,
    articles: { ...ARTICLES_PT_BR, ...GOOGLE_PT_BR, ...HELP_PT_BR },
  };
