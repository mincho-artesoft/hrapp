/**
 * Single source of truth for anything that comes from the App Store listing.
 * Update here when the app ships and the whole site follows.
 */

export const APP_STORE_URL = 'https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319';
export const APP_NAME = 'Cloud Calendars';
/** Exactly as Apple prints it. EOOD is the Bulgarian single-member limited
 *  form; a reader matching this against a receipt will not find 'Ltd'. */
export const APP_DEVELOPER = 'ARTE SOFT EOOD';
export const APP_VERSION = '1.7.0';
/**
 * The release that introduced the widgets and the Live Activity.
 *
 * Fixed, not the current version. The widgets section used to hardcode '1.5';
 * when its copy was made translatable the substitution was wired to
 * APP_VERSION, so the section began claiming the widgets were new in whatever
 * shipped last -- "New in 1.6.1" for a feature from 1.5.
 */
export const WIDGETS_SINCE = '1.5';
/** Verified against the store 2026-08-28. Quote it with the count below:
 *  an average without its sample size is a claim without a scale. */
export const APP_RATING = 4.4;
export const APP_RATING_COUNT = 8;
export const APP_MIN_IOS = '18.0';
export const APP_SIZE_MB = 35.4;
export const SITE_URL = 'https://www.cloud-calendars.com';
export const SUPPORT_EMAIL = 'support@cloud-calendars.com';

/** Subscription tiers, mirroring the App Store in-app purchase list. */
export interface Plan {
  id: string;
  name: string;
  tagline: string;
  monthly: string;
  yearly?: string;
  yearlyNote?: string;
  featured?: boolean;
  inherits?: string;
  features: { label: string; strong?: boolean }[];
}

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Everything you need to run your week.',
    monthly: '0',
    features: [
      { label: 'Day, Week, Month, Year and List views' },
      { label: 'iCloud calendar sync', strong: true },
      { label: 'Google Calendar sync', strong: true },
      { label: 'Full weather hub and in-calendar forecasts' },
      { label: 'Home Screen widgets' },
      { label: 'Google Meet links on events' },
      { label: 'Drag, drop and resize events' },
    ],
  },
  {
    id: 'advanced',
    name: 'Advanced',
    tagline: 'A quieter app and deeper calendar control.',
    monthly: '0.49',
    yearly: '4.99',
    yearlyNote: 'Save 15% yearly',
    featured: true,
    inherits: 'Free',
    features: [
      { label: 'No ads, anywhere', strong: true },
      { label: 'Cross-calendar management across iCloud and Google' },
      { label: 'Google Calendar sharing permissions' },
      { label: 'Automatic Google Meet link generation' },
      { label: 'Priority weather refresh' },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    tagline: 'For work calendars that live in Microsoft.',
    monthly: '4.99',
    yearly: '49.99',
    yearlyNote: 'Save 16% yearly',
    inherits: 'Advanced',
    features: [
      { label: 'Microsoft Outlook & Exchange sync', strong: true },
      { label: 'Automatic Microsoft Teams links', strong: true },
      { label: 'Full cross-calendar management across all three accounts' },
      { label: 'Attendee management and invitations' },
    ],
  },
];
