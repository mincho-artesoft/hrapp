import { ArticleChrome } from '../types';

/**
 * The wording every English article shares.
 *
 * Kept apart from the articles themselves so that adding a language means
 * translating one object plus the pieces that language actually has, rather
 * than hunting for stray English inside forty files.
 */
export const CHROME_EN_US: ArticleChrome = {
  allArticles: 'All articles',
  hubTitle: 'Guides for iCloud, Google and Outlook calendars',
  hubDescription:
    'Plain answers about sharing a calendar, keeping iCloud, Google and Outlook in one view on iPhone and iPad, widgets, and planning around the weather.',
  commonBelief: 'What most people assume',
  whatIsTrue: 'What is actually true',
  theNumbers: 'The numbers',
  colWhat: 'What it describes',
  colValue: 'Value',
  practical: 'What to do',
  seeAlso: 'Related',
  updated: 'Last reviewed',
  ctaLine: 'Your calendar and the forecast, in one view — on iPhone and iPad.',
  gallery: 'What it looks like',
  familyWeather: 'Weather',
  familyUnify: 'One view, every account',
  familyWidgets: 'Widgets and the Home Screen',
  familySharing: 'Sharing',
  familyPlanning: 'Planning and editing',
  familyCompare: 'Cost and comparison',
};
