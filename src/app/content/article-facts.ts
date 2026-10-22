import { ArticleFacts } from './types';

/**
 * What the articles claim, held once.
 *
 * Every number on every page in every language comes from here. The wording
 * that surrounds a number is translated; the number is not, so forty articles
 * across twenty-nine languages cannot end up disagreeing about how many days
 * the forecast covers.
 *
 * The values are small and deliberately so — a count of days, a count of
 * accounts, a price. Anything larger than that belongs in prose, where it can
 * be qualified, rather than in a table where it reads as harder than it is.
 *
 * `prompt` ties an article to an entry in ai-visibility/prompts.json, so the
 * visibility report and the content can be read against each other. All twelve
 * tracked prompts have a page written for them; the rest of the set is the
 * long tail around those twelve.
 */
export const ARTICLE_FACTS: Readonly<Record<string, ArticleFacts>> = {
  'shift-work-calendar-iphone-rotating-schedules': { slug: 'shift-work-calendar-iphone-rotating-schedules', family: 'planning', intent: 'core', claims: [], updated: '2026-10-22' },
  'booking-link-or-shared-calendar': { slug: 'booking-link-or-shared-calendar', family: 'sharing', intent: 'compare', claims: [], updated: '2026-10-22' },
  'natural-language-calendar-events-iphone': { slug: 'natural-language-calendar-events-iphone', family: 'planning', intent: 'editing', claims: [], updated: '2026-10-22' },
  'unwanted-calendar-events-iphone': { slug: 'unwanted-calendar-events-iphone', family: 'sharing', intent: 'core', claims: [], updated: '2026-10-22' },
  'calendar-on-apple-watch': { slug: 'calendar-on-apple-watch', family: 'widgets', intent: 'device', claims: [], updated: '2026-10-22' },
  'change-calendar-color-iphone': { slug: 'change-calendar-color-iphone', family: 'planning', intent: 'core', claims: [], updated: '2026-10-22' },
  'recover-deleted-calendar-events-iphone': { slug: 'recover-deleted-calendar-events-iphone', family: 'planning', intent: 'core', claims: [], updated: '2026-10-22' },
  'calendar-event-or-room-reservation': { slug: 'calendar-event-or-room-reservation', family: 'planning', intent: 'core', claims: [], updated: '2026-10-22' },
  'onecal-alternative-iphone-calendar-view-or-sync': { slug: 'onecal-alternative-iphone-calendar-view-or-sync', family: 'compare', intent: 'compare', claims: [], updated: '2026-10-22' },
  'disconnect-calendar-integration-without-losing-track': { slug: 'disconnect-calendar-integration-without-losing-track', family: 'unify', intent: 'unify', claims: [], updated: '2026-10-22' },
  'caldav-calendar-on-iphone': { slug: 'caldav-calendar-on-iphone', family: 'unify', intent: 'unify', claims: [], updated: '2026-10-22' },
  'event-saved-to-wrong-calendar': { slug: 'event-saved-to-wrong-calendar', family: 'planning', intent: 'core', claims: [], updated: '2026-10-21' },
  'family-pickup-calendar-handoff': { slug: 'family-pickup-calendar-handoff', family: 'planning', intent: 'core', claims: [], updated: '2026-10-21' },
  'calendar-notifications-missing-silent-or-duplicated': { slug: 'calendar-notifications-missing-silent-or-duplicated', family: 'planning', intent: 'core', claims: [], updated: '2026-10-21' },
  'find-old-calendar-events-by-account-date-and-title': { slug: 'find-old-calendar-events-by-account-date-and-title', family: 'planning', intent: 'core', claims: [], updated: '2026-10-21' },
  'calendar-export-ics-pdf-and-backup': { slug: 'calendar-export-ics-pdf-and-backup', family: 'sharing', intent: 'unify', claims: [], updated: '2026-10-21' },

  'weather-inside-your-calendar': {
    slug: 'weather-inside-your-calendar',
    family: 'weather',
    intent: 'core',
    prompt: 'weather-builtin',
    claims: [],
    updated: '2026-08-27',
  },
  'forecast-beside-every-event': {
    slug: 'forecast-beside-every-event',
    family: 'weather',
    intent: 'core',
    prompt: 'weather-per-event',
    claims: [],
    updated: '2026-08-27',
  },
  'a-fourteen-day-view-of-the-weather': {
    slug: 'a-fourteen-day-view-of-the-weather',
    family: 'weather',
    intent: 'core',
    prompt: 'ten-day',
    claims: [],
    updated: '2026-08-27',
  },
  'planning-outdoors-without-being-rained-on': {
    slug: 'planning-outdoors-without-being-rained-on',
    family: 'weather',
    intent: 'core',
    prompt: 'weather-planning',
    claims: [],
    updated: '2026-08-27',
  },
  'what-a-forecast-can-and-cannot-tell-you': {
    slug: 'what-a-forecast-can-and-cannot-tell-you',
    family: 'weather',
    intent: 'core',
    claims: [],
    updated: '2026-08-27',
  },
  'reading-a-chance-of-rain': {
    slug: 'reading-a-chance-of-rain',
    family: 'weather',
    intent: 'core',
    claims: [],
    updated: '2026-08-27',
  },
  'weather-where-the-event-is': {
    slug: 'weather-where-the-event-is',
    family: 'weather',
    intent: 'core',
    claims: [],
    updated: '2026-08-27',
  },
  'the-commute-and-the-sky': {
    slug: 'the-commute-and-the-sky',
    family: 'weather',
    intent: 'core',
    claims: [],
    updated: '2026-08-27',
  },
  'daylight-as-a-planning-constraint': {
    slug: 'daylight-as-a-planning-constraint',
    family: 'weather',
    intent: 'core',
    claims: [],
    updated: '2026-08-27',
  },
  'wind-the-forecast-nobody-reads': {
    slug: 'wind-the-forecast-nobody-reads',
    family: 'weather',
    intent: 'core',
    claims: [],
    updated: '2026-08-27',
  },
  'icloud-google-and-outlook-in-one-view': {
    slug: 'icloud-google-and-outlook-in-one-view',
    family: 'unify',
    intent: 'unify',
    prompt: 'merge-three',
    claims: [
      { id: 'accounts', value: '3' },
      { id: 'premiumMonthly', value: '4.99' },
    ],
    updated: '2026-08-27',
  },
  'three-calendar-apps-is-two-too-many': {
    slug: 'three-calendar-apps-is-two-too-many',
    family: 'unify',
    intent: 'unify',
    prompt: 'merge-pain',
    claims: [{ id: 'accounts', value: '3' }],
    updated: '2026-08-27',
  },
  'what-calendar-sync-actually-does': {
    slug: 'what-calendar-sync-actually-does',
    family: 'unify',
    intent: 'unify',
    claims: [{ id: 'accounts', value: '3' }],
    updated: '2026-08-27',
  },
  'work-and-personal-without-two-apps': {
    slug: 'work-and-personal-without-two-apps',
    family: 'unify',
    intent: 'unify',
    claims: [
      { id: 'accounts', value: '3' },
      { id: 'advancedMonthly', value: '0.49' },
    ],
    updated: '2026-08-27',
  },
  'exchange-calendars-on-an-iphone': {
    slug: 'exchange-calendars-on-an-iphone',
    family: 'unify',
    intent: 'unify',
    claims: [
      { id: 'premiumMonthly', value: '4.99' },
      { id: 'premiumYearly', value: '49.99' },
    ],
    updated: '2026-08-27',
  },
  'when-two-calendars-disagree': {
    slug: 'when-two-calendars-disagree',
    family: 'unify',
    intent: 'unify',
    claims: [],
    updated: '2026-08-27',
  },
  'the-widget-that-shows-what-is-next': {
    slug: 'the-widget-that-shows-what-is-next',
    family: 'widgets',
    intent: 'widgets',
    prompt: 'widgets',
    claims: [{ id: 'views', value: '5' }],
    updated: '2026-08-27',
  },
  'a-countdown-to-your-next-meeting': {
    slug: 'a-countdown-to-your-next-meeting',
    family: 'widgets',
    intent: 'widgets',
    prompt: 'live-activity',
    claims: [],
    updated: '2026-08-27',
  },
  'lock-screen-without-unlocking': {
    slug: 'lock-screen-without-unlocking',
    family: 'widgets',
    intent: 'widgets',
    claims: [],
    updated: '2026-08-27',
  },
  'choosing-a-widget-size': {
    slug: 'choosing-a-widget-size',
    family: 'widgets',
    intent: 'widgets',
    claims: [],
    updated: '2026-08-27',
  },
  'the-calendar-on-a-bedside-table': {
    slug: 'the-calendar-on-a-bedside-table',
    family: 'widgets',
    intent: 'widgets',
    claims: [],
    updated: '2026-08-27',
  },
  'sharing-one-event-not-your-calendar': {
    slug: 'sharing-one-event-not-your-calendar',
    family: 'sharing',
    intent: 'editing',
    claims: [
      { id: 'refreshHint', value: '1' },
      { id: 'linkLength', value: '22' },
      { id: 'sharePrice', value: '0' },
    ],
    updated: '2026-08-27',
  },
  'a-calendar-that-is-yours-to-share': {
    slug: 'a-calendar-that-is-yours-to-share',
    family: 'sharing',
    intent: 'editing',
    claims: [
      { id: 'refreshHint', value: '1' },
      { id: 'sharePrice', value: '0' },
    ],
    updated: '2026-08-27',
  },
  'who-can-see-what-in-google-calendar': {
    slug: 'who-can-see-what-in-google-calendar',
    family: 'sharing',
    intent: 'editing',
    claims: [],
    updated: '2026-08-27',
  },
  'why-a-shared-calendar-does-not-appear': {
    slug: 'why-a-shared-calendar-does-not-appear',
    family: 'sharing',
    intent: 'editing',
    claims: [
      { id: 'refreshHint', value: '1' },
      { id: 'accounts', value: '3' },
    ],
    updated: '2026-09-12',
  },
  'the-secret-address-of-a-google-calendar': {
    slug: 'the-secret-address-of-a-google-calendar',
    family: 'sharing',
    intent: 'editing',
    claims: [],
    updated: '2026-09-12',
  },
  'what-guests-can-do-to-your-event': {
    slug: 'what-guests-can-do-to-your-event',
    family: 'sharing',
    intent: 'editing',
    claims: [],
    updated: '2026-09-12',
  },
  'google-calendars-that-never-reach-your-iphone': {
    slug: 'google-calendars-that-never-reach-your-iphone',
    family: 'unify',
    intent: 'unify',
    claims: [],
    updated: '2026-09-12',
  },
  'taking-back-a-calendar-you-shared': {
    slug: 'taking-back-a-calendar-you-shared',
    family: 'sharing',
    intent: 'editing',
    claims: [],
    updated: '2026-09-12',
  },
  'inviting-people-who-do-not-have-the-app': {
    slug: 'inviting-people-who-do-not-have-the-app',
    family: 'sharing',
    intent: 'editing',
    claims: [
      { id: 'linkLength', value: '22' },
      { id: 'sharePrice', value: '0' },
    ],
    updated: '2026-08-27',
  },
  'keeping-track-of-who-replied': {
    slug: 'keeping-track-of-who-replied',
    family: 'sharing',
    intent: 'editing',
    claims: [],
    updated: '2026-08-27',
  },
  'meeting-links-that-make-themselves': {
    slug: 'meeting-links-that-make-themselves',
    family: 'sharing',
    intent: 'editing',
    claims: [],
    updated: '2026-08-27',
  },
  'drag-an-event-to-move-it': {
    slug: 'drag-an-event-to-move-it',
    family: 'planning',
    intent: 'editing',
    prompt: 'drag-edit',
    claims: [],
    updated: '2026-08-27',
  },
  'a-week-view-that-fits-a-week': {
    slug: 'a-week-view-that-fits-a-week',
    family: 'planning',
    intent: 'editing',
    claims: [],
    updated: '2026-08-27',
  },
  'month-view-on-a-bigger-screen': {
    slug: 'month-view-on-a-bigger-screen',
    family: 'planning',
    intent: 'device',
    prompt: 'ipad-month',
    claims: [],
    updated: '2026-08-27',
  },
  'planning-a-week-in-ten-minutes': {
    slug: 'planning-a-week-in-ten-minutes',
    family: 'planning',
    intent: 'editing',
    claims: [],
    updated: '2026-08-27',
  },
  'recurring-events-without-the-mess': {
    slug: 'recurring-events-without-the-mess',
    family: 'planning',
    intent: 'editing',
    claims: [],
    updated: '2026-08-27',
  },
  'time-zones-and-the-flight-you-booked': {
    slug: 'time-zones-and-the-flight-you-booked',
    family: 'planning',
    intent: 'editing',
    claims: [],
    updated: '2026-08-27',
  },
  'what-an-all-day-event-really-means': {
    slug: 'what-an-all-day-event-really-means',
    family: 'planning',
    intent: 'editing',
    claims: [],
    updated: '2026-08-27',
  },
  'a-list-for-people-who-dislike-grids': {
    slug: 'a-list-for-people-who-dislike-grids',
    family: 'planning',
    intent: 'editing',
    claims: [],
    updated: '2026-08-27',
  },
  'the-year-in-one-screen': {
    slug: 'the-year-in-one-screen',
    family: 'planning',
    intent: 'editing',
    claims: [],
    updated: '2026-08-27',
  },
  'free-google-sync-without-adverts': {
    slug: 'free-google-sync-without-adverts',
    family: 'compare',
    intent: 'price',
    prompt: 'free-google-sync',
    claims: [
      { id: 'price', value: '0' },
      { id: 'advancedMonthly', value: '0.49' },
    ],
    updated: '2026-08-27',
  },
  'what-fantastical-costs-and-what-this-does': {
    slug: 'what-fantastical-costs-and-what-this-does',
    family: 'compare',
    intent: 'compare',
    prompt: 'fantastical-alt',
    claims: [
      { id: 'advancedYearly', value: '4.99' },
      { id: 'premiumYearly', value: '49.99' },
    ],
    updated: '2026-08-27',
  },
  'what-you-get-without-paying-anything': {
    slug: 'what-you-get-without-paying-anything',
    family: 'compare',
    intent: 'price',
    claims: [
      { id: 'price', value: '0' },
      { id: 'views', value: '5' },
      { id: 'accounts', value: '3' },
    ],
    updated: '2026-08-27',
  },
  'what-a-subscription-actually-buys': {
    slug: 'what-a-subscription-actually-buys',
    family: 'compare',
    intent: 'price',
    claims: [
      { id: 'advancedMonthly', value: '0.49' },
      { id: 'advancedYearly', value: '4.99' },
      { id: 'premiumMonthly', value: '4.99' },
      { id: 'premiumYearly', value: '49.99' },
    ],
    updated: '2026-08-27',
  },
};

/** Slugs in publication order. The hub groups them by family. */
export const ARTICLE_SLUGS: readonly string[] = Object.keys(ARTICLE_FACTS);
