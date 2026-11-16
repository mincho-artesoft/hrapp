import { PILOT_EN_US } from '../en-US/articles-pilot-20261023';
import type { ArticleLocale } from '../types';
import { CHROME_EN_US } from '../en-US/chrome';
import { WEATHER_EN_US } from '../en-US/articles-weather';
import { UNIFY_EN_US } from '../en-US/articles-unify';
import { WIDGETS_EN_US } from '../en-US/articles-widgets';
import { SHARING_EN_US } from '../en-US/articles-sharing';
import { PLANNING_EN_US } from '../en-US/articles-planning';
import { COMPARE_EN_US } from '../en-US/articles-compare';
import { HELP_EN_US } from '../en-US/articles-help';
import { DISCOVERY_EN_US } from '../en-US/articles-discovery';
import { GOOGLE_EN_US } from '../en-US/articles-google';
import { WEB_STUDIO_EN_US } from '../en-US/articles-web-studio';
import { OPERATIONS_20261115_EN_US } from '../en-US/articles-operations-20261115';
export const ARTICLE_LOCALE: ArticleLocale = {
    chrome: CHROME_EN_US,
    articles: { ...PILOT_EN_US,
      ...WEATHER_EN_US,
      ...UNIFY_EN_US,
      ...WIDGETS_EN_US,
      ...SHARING_EN_US,
      ...PLANNING_EN_US,
      ...COMPARE_EN_US,
      ...HELP_EN_US,
      ...GOOGLE_EN_US,
      ...DISCOVERY_EN_US,
      ...WEB_STUDIO_EN_US,
      ...OPERATIONS_20261115_EN_US,
    },
  };
