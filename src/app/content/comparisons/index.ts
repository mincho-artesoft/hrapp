import type { LocalisedArticle } from '../types';

export type ComparisonGroup = 'apps' | 'sync' | 'views' | 'devices';

export interface ComparisonCardMeta {
  readonly slug: string;
  readonly group: ComparisonGroup;
  readonly badge: string;
  readonly title: string;
  readonly seoTitle: string;
  readonly short: string;
  readonly description: string;
  readonly verdict: string;
  readonly updated: string;
  readonly featuredOnHome?: boolean;
}

export const COMPARISON_GROUP_META: Readonly<
  Record<ComparisonGroup, { readonly heading: string; readonly subtitle: string }>
> = {
  apps: {
    heading: 'Head-to-Head Calendar App Comparisons',
    subtitle:
      'Direct feature, pricing, weather, task, and sync breakdowns comparing Cloud Calendars with popular iPhone, iPad, Mac, and cross-platform calendar apps.',
  },
  sync: {
    heading: 'Multi-Account Sync, Protocols & Sharing Setups',
    subtitle:
      'Compare iCloud + Google + Microsoft 365 unification, CalDAV vs ICS vs native OAuth sync, work/personal separation, family sharing, booking links, and time zones.',
  },
  views: {
    heading: 'Widgets, Month Titles, Weather & Quick Entry',
    subtitle:
      'Evaluate Home Screen and Lock Screen widgets, Month view event chips vs dots, built-in hourly weather forecasts, and natural-language event parsing on iOS.',
  },
  devices: {
    heading: 'iPad, Mac, Apple Watch, Privacy & Shift Workflows',
    subtitle:
      'Compare tablet and desktop options, wrist complications vs Live Activities, lower-cost Fantastical alternatives, direct vs cloud-relay privacy, shift rotas, and multi-day banners.',
  },
};

export const COMPARISON_CARDS: readonly ComparisonCardMeta[] = [
  // 1–14: Head-to-Head App Comparisons
  {
    slug: 'cloud-calendars-vs-apple-calendar',
    group: 'apps',
    badge: 'vs Apple Calendar',
    title: 'Cloud Calendars vs Apple Calendar (iPhone, iPad & Mac)',
    seoTitle: 'Cloud Calendars vs Apple Calendar (iPhone, iPad & Mac)',
    short: 'Cloud Calendars vs Apple Calendar',
    description:
      'Compare Cloud Calendars and built-in Apple Calendar on iPhone and iPad: multi-calendar columns, hourly WeatherKit forecasts, Google OAuth sync, Reminders, and Mac support.',
    verdict:
      'Pick Cloud Calendars for side-by-side calendar columns, hourly WeatherKit grids, and Live Activities; keep Apple Calendar for zero-cost Mac/Watch continuity and iOS 18 Reminders.',
    updated: '2026-11-04',
    featuredOnHome: true,
  },
  {
    slug: 'cloud-calendars-vs-google-calendar-iphone',
    group: 'apps',
    badge: 'vs Google Calendar',
    title: 'Cloud Calendars vs Google Calendar App on iPhone',
    seoTitle: 'Cloud Calendars vs Google Calendar App on iPhone',
    short: 'Cloud Calendars vs Google Calendar iOS',
    description:
      'Compare Cloud Calendars and the official Google Calendar iPhone app across iCloud & Outlook sync, hourly WeatherKit forecasts, 12-month Year view, and Google Tasks.',
    verdict:
      'Pick Cloud Calendars to combine iCloud, Google, and Outlook with hourly weather and Year/column views on iOS; pick Google Calendar for Gmail auto-events, Tasks, and Workspace rooms.',
    updated: '2026-11-04',
    featuredOnHome: true,
  },
  {
    slug: 'cloud-calendars-vs-fantastical',
    group: 'apps',
    badge: 'vs Fantastical',
    title: 'Cloud Calendars vs Fantastical on iPhone & iPad',
    seoTitle: 'Cloud Calendars vs Fantastical on iPhone & iPad',
    short: 'Cloud Calendars vs Fantastical',
    description:
      'Compare Cloud Calendars and Fantastical on iOS across Google, iCloud & Outlook sync, Apple WeatherKit forecasts, natural-language entry, desktop apps, and pricing.',
    verdict:
      'Pick Cloud Calendars for free Google + iCloud views with WeatherKit forecasts on iOS ($4.99/yr ad-free); pick Fantastical (~$57/yr) for natural-language entry, Openings, and Mac/Windows.',
    updated: '2026-11-04',
    featuredOnHome: true,
  },
  {
    slug: 'cloud-calendars-vs-microsoft-outlook-mobile',
    group: 'apps',
    badge: 'vs Outlook Mobile',
    title: 'Cloud Calendars vs Microsoft Outlook Mobile Calendar',
    seoTitle: 'Cloud Calendars vs Microsoft Outlook Mobile Calendar',
    short: 'Cloud Calendars vs Outlook Mobile',
    description:
      'Compare Cloud Calendars and Microsoft Outlook Mobile on iPhone and iPad across Exchange/Microsoft 365 MDM rules, Google & iCloud sync, WeatherKit forecasts, and widgets.',
    verdict:
      'Pick Outlook Mobile when corporate Intune MAM, Room Finder, or inbox triage are required; pick Cloud Calendars for dedicated 5-view iOS planning with hourly weather and zero email.',
    updated: '2026-11-04',
    featuredOnHome: true,
  },
  {
    slug: 'cloud-calendars-vs-calendars-by-readdle',
    group: 'apps',
    badge: 'vs Readdle',
    title: 'Cloud Calendars vs Calendars by Readdle on iOS',
    seoTitle: 'Cloud Calendars vs Calendars by Readdle on iOS',
    short: 'Cloud Calendars vs Calendars by Readdle',
    description:
      'Compare Cloud Calendars and Calendars by Readdle across Google Tasks/Reminders time-blocking, Apple WeatherKit forecasts, multi-account views, Mac/Watch apps, and pricing.',
    verdict:
      'Pick Cloud Calendars for free multi-column Google + iCloud views with hourly WeatherKit forecasts; pick Calendars by Readdle for drag-and-drop task time-blocking, habits, and Mac/Watch.',
    updated: '2026-11-04',
  },
  {
    slug: 'cloud-calendars-vs-timepage-moleskine',
    group: 'apps',
    badge: 'vs Timepage',
    title: 'Cloud Calendars vs Moleskine Timepage on iPhone',
    seoTitle: 'Cloud Calendars vs Moleskine Timepage on iPhone',
    short: 'Cloud Calendars vs Moleskine Timepage',
    description:
      'Compare Cloud Calendars and Moleskine Timepage on iOS across built-in weather forecasts, traditional Month/Week grids vs vertical heatmaps, free tier access, and widgets.',
    verdict:
      'Pick Cloud Calendars for classic Day/Week/Month/Year grids, side-by-side columns, and free Google + WeatherKit sync; pick Timepage for editorial Moleskine aesthetics and Actions pairing.',
    updated: '2026-11-04',
  },
  {
    slug: 'cloud-calendars-vs-busycal-ios-mac',
    group: 'apps',
    badge: 'vs BusyCal',
    title: 'Cloud Calendars vs BusyCal on iPhone, iPad & Mac',
    seoTitle: 'Cloud Calendars vs BusyCal on iPhone, iPad & Mac',
    short: 'Cloud Calendars vs BusyCal',
    description:
      'Compare Cloud Calendars and BusyCal across custom CalDAV servers, smart filters, rolling tasks, hourly WeatherKit forecasts, macOS support, and one-time vs subscription pricing.',
    verdict:
      'Pick Cloud Calendars for an airy, weather-first iOS grid with free Google + iCloud sync; pick BusyCal for power-user smart filters, custom CalDAV, rolling tasks, and one-time iOS licensing.',
    updated: '2026-11-04',
  },
  {
    slug: 'cloud-calendars-vs-notion-calendar-cron',
    group: 'apps',
    badge: 'vs Notion Calendar',
    title: 'Cloud Calendars vs Notion Calendar (Cron) on iOS',
    seoTitle: 'Cloud Calendars vs Notion Calendar (Cron) on iOS',
    short: 'Cloud Calendars vs Notion Calendar',
    description:
      'Compare Cloud Calendars and Notion Calendar (formerly Cron) across Notion database timelines, native iOS EventKit iCloud access, WeatherKit forecasts, and Month/Year views.',
    verdict:
      'Pick Notion Calendar if you link Notion docs/databases and work on Mac, Windows, or Web; pick Cloud Calendars for native iOS iCloud access without app passwords plus hourly weather.',
    updated: '2026-11-04',
    featuredOnHome: true,
  },
  {
    slug: 'cloud-calendars-vs-timetree-family-sharing',
    group: 'apps',
    badge: 'vs TimeTree',
    title: 'Cloud Calendars vs TimeTree for Couples & Families',
    seoTitle: 'Cloud Calendars vs TimeTree for Couples & Families',
    short: 'Cloud Calendars vs TimeTree',
    description:
      'Compare Cloud Calendars and TimeTree across couple/family sharing, per-event chat vs two-way Google/iCloud/Outlook sync, Android compatibility, and hourly weather planning.',
    verdict:
      'Pick TimeTree when mixed iPhone + Android groups want per-event chat threads; pick Cloud Calendars on iOS when you need live two-way Google/iCloud/Outlook sync and hourly weather.',
    updated: '2026-11-04',
  },
  {
    slug: 'cloud-calendars-vs-cozi-family-organizer',
    group: 'apps',
    badge: 'vs Cozi',
    title: 'Cloud Calendars vs Cozi Family Organizer on iPhone',
    seoTitle: 'Cloud Calendars vs Cozi Family Organizer on iPhone',
    short: 'Cloud Calendars vs Cozi',
    description:
      'Compare Cloud Calendars and Cozi Family Organizer across shared grocery/meal lists, read-only ICS feeds vs live two-way Google/iCloud/Outlook sync, and WeatherKit forecasts.',
    verdict:
      'Pick Cozi when shared shopping lists, dinner recipes, and Android access lead your household; pick Cloud Calendars on iPhone/iPad for live two-way provider sync and WeatherKit.',
    updated: '2026-11-04',
  },
  {
    slug: 'cloud-calendars-vs-structured-daily-planner',
    group: 'apps',
    badge: 'vs Structured',
    title: 'Cloud Calendars vs Structured Daily Planner on iOS',
    seoTitle: 'Cloud Calendars vs Structured Daily Planner on iOS',
    short: 'Cloud Calendars vs Structured',
    description:
      'Compare Cloud Calendars and Structured Daily Planner on iPhone and iPad across visual day time-blocking, subtasks, Month/Year multi-account grids, free Google sync, and weather.',
    verdict:
      'Pick Structured for step-by-step daily visual time-blocking, subtasks, and ADHD-friendly routines; pick Cloud Calendars for full Week/Month/Year multi-account grids and free Google + weather.',
    updated: '2026-11-04',
  },
  {
    slug: 'cloud-calendars-vs-todoist-and-ticktick-calendar-views',
    group: 'apps',
    badge: 'vs Todoist & TickTick',
    title: 'Cloud Calendars vs Todoist & TickTick Calendar Views',
    seoTitle: 'Cloud Calendars vs Todoist & TickTick Calendar Views',
    short: 'Cloud Calendars vs Todoist & TickTick',
    description:
      'Compare dedicated calendar management in Cloud Calendars against the paid calendar layouts inside Todoist Pro and TickTick Premium on iPhone and iPad.',
    verdict:
      'Pick Todoist Pro or TickTick Premium when GTD task backlogs, priorities, and habits drive your day; pick Cloud Calendars when true multi-account calendar sync, invites, and weather come first.',
    updated: '2026-11-04',
  },
  {
    slug: 'cloud-calendars-vs-proton-and-tuta-encrypted-calendars',
    group: 'apps',
    badge: 'vs Proton & Tuta',
    title: 'Cloud Calendars vs Proton & Tuta Encrypted Calendars',
    seoTitle: 'Cloud Calendars vs Proton & Tuta Encrypted Calendars',
    short: 'Cloud Calendars vs Proton & Tuta',
    description:
      'Compare zero-knowledge end-to-end encrypted calendars (Proton Calendar, Tuta) with Cloud Calendars on iOS: why E2EE blocks EventKit/CalDAV, local mode, and weather trade-offs.',
    verdict:
      'Pick Proton or Tuta for server-side zero-knowledge encryption; pick Cloud Calendars when you need standard iCloud/Google/Microsoft interoperability, account-free local calendars, and weather.',
    updated: '2026-11-04',
  },
  {
    slug: 'cloud-calendars-vs-acalendar-and-digical-switchers',
    group: 'apps',
    badge: 'Android to iPhone',
    title: 'aCalendar & DigiCal Alternatives on iPhone Compared',
    seoTitle: 'aCalendar & DigiCal Alternatives on iPhone Compared',
    short: 'aCalendar & DigiCal iOS Alternatives',
    description:
      'Moving from Android to iPhone? Neither aCalendar nor DigiCal exists on iOS—compare Cloud Calendars, Google Calendar, BusyCal, and Fantastical for readable month chips, weather, and widgets.',
    verdict:
      'Neither aCalendar nor DigiCal runs on iOS; Android switchers get the closest free Google sync + readable Month event chips + built-in weather widgets in Cloud Calendars on iPhone.',
    updated: '2026-11-04',
  },

  // 15–20: Multi-Account Sync, Protocols & Sharing Setups
  {
    slug: 'merge-icloud-google-outlook-exchange-calendars-iphone',
    group: 'sync',
    badge: 'Unify 3 Accounts',
    title: 'Merge iCloud, Google & Outlook Calendars on iPhone',
    seoTitle: 'Merge iCloud, Google & Outlook Calendars on iPhone',
    short: 'Merge iCloud, Google & Outlook on iPhone',
    description:
      'Compare unified calendar viewers (Cloud Calendars, Apple Calendar, Fantastical, Notion) vs server-side busy-block cloning (OneCal) for iCloud, Google, and Outlook on iPhone.',
    verdict:
      'Use a unified iOS viewer like Cloud Calendars to see all three accounts in side-by-side columns without mixing ownership; add server-side cloning only if coworkers must see Busy blocks.',
    updated: '2026-11-04',
    featuredOnHome: true,
  },
  {
    slug: 'caldav-vs-ics-subscribed-url-vs-oauth-calendar-sync',
    group: 'sync',
    badge: 'Sync Protocols',
    title: 'CalDAV vs ICS Subscribed URL vs OAuth Sync on iOS',
    seoTitle: 'CalDAV vs ICS Subscribed URL vs OAuth Sync on iOS',
    short: 'CalDAV vs ICS URL vs OAuth Sync',
    description:
      'Technical comparison of CalDAV (RFC 4791), read-only ICS URL subscriptions (RFC 5545), and native Google/Microsoft OAuth sync on iPhone: write-back, refresh speed, and security.',
    verdict:
      'Use native OAuth (Google/Microsoft) or CalDAV (iCloud/Fastmail) for two-way editing and RSVPs; use ICS URLs strictly for read-only broadcasts like school terms, holidays, or sports.',
    updated: '2026-11-04',
    featuredOnHome: true,
  },
  {
    slug: 'shared-icloud-calendar-vs-shared-google-calendar-families',
    group: 'sync',
    badge: 'Family Sync',
    title: 'Shared iCloud vs Shared Google Calendar for Families',
    seoTitle: 'Shared iCloud vs Shared Google Calendar for Families',
    short: 'Shared iCloud vs Shared Google Calendar',
    description:
      'Compare Apple iCloud Shared Calendars, Google Family/Shared Calendars, and Cloud Calendars sharing for couples and households across iPhone-only and mixed Android setups.',
    verdict:
      'Choose Shared iCloud for all-Apple households, Shared Google Calendar when any family member uses Android/Windows, and view both together with weather in Cloud Calendars on iOS.',
    updated: '2026-11-04',
  },
  {
    slug: 'work-exchange-microsoft-365-and-personal-icloud-iphone',
    group: 'sync',
    badge: 'Work + Personal',
    title: 'Work Exchange / M365 + Personal iCloud on iPhone',
    seoTitle: 'Work Exchange / M365 + Personal iCloud on iPhone',
    short: 'Work Exchange/M365 + Personal iCloud',
    description:
      'Compare safe architectures for viewing a corporate Exchange or Microsoft 365 calendar alongside personal iCloud and Gmail on iPhone without leaking private event titles to IT.',
    verdict:
      'Keep corporate Exchange/M365 and personal iCloud in separate accounts viewed side by side in Cloud Calendars (or Apple Calendar) with your personal calendar set as the default destination.',
    updated: '2026-11-04',
  },
  {
    slug: 'calendar-conflict-detection-vs-calendly-booking-links',
    group: 'sync',
    badge: 'Booking vs Viewing',
    title: 'Calendar Conflict Views vs Calendly Booking Links',
    seoTitle: 'Calendar Conflict Views vs Calendly Booking Links',
    short: 'Conflict Views vs Calendly Booking Links',
    description:
      'Compare external slot-booking tools (Calendly, Google Appointment Schedules, Fantastical Openings, SavvyCal) with multi-column conflict inspection in Cloud Calendars.',
    verdict:
      'Use Calendly or Google Appointment Schedules when external clients pick an open slot; use Cloud Calendars Multi-calendar columns to spot overlaps visually and share single events.',
    updated: '2026-11-04',
  },
  {
    slug: 'timezone-travel-calendar-handling-comparison-iphone',
    group: 'sync',
    badge: 'Time Zones & Travel',
    title: 'Time Zone & Flight Calendar Handling on iPhone',
    seoTitle: 'Time Zone & Flight Calendar Handling on iPhone',
    short: 'Time Zone & Travel Calendar Handling',
    description:
      'Compare how Cloud Calendars, Apple Calendar, Google Calendar, Outlook, and Notion Calendar handle Time Zone Override, floating times, flights, and destination weather on iPhone.',
    verdict:
      'Anchor flights to departure/arrival local zones, check Time Zone Override settings before landing, and use Cloud Calendars’ city-selectable WeatherKit hub to check destination forecasts.',
    updated: '2026-11-04',
  },

  // 21–24: Widgets, Month Titles, Weather & Quick Entry
  {
    slug: 'best-iphone-calendar-widgets-home-and-lock-screen',
    group: 'views',
    badge: 'Widgets & Live Activity',
    title: 'Best iPhone Calendar Widgets: Home & Lock Screen',
    seoTitle: 'Best iPhone Calendar Widgets: Home & Lock Screen',
    short: 'Best iPhone Calendar Widgets Compared',
    description:
      'Compare Home Screen widgets, Lock Screen widgets, StandBy displays, and Live Activity countdowns across Cloud Calendars, Apple Calendar, Fantastical, Google Calendar, and Widgetsmith.',
    verdict:
      'Pick Cloud Calendars for combined date+WeatherKit widgets, clean timed-event lists, and a Lock Screen Live Activity countdown—all included in the Free plan.',
    updated: '2026-11-04',
    featuredOnHome: true,
  },
  {
    slug: 'month-view-event-titles-vs-dots-iphone-calendars',
    group: 'views',
    badge: 'Month View Chips',
    title: 'iPhone Calendar Month View: Event Titles vs Dots',
    seoTitle: 'iPhone Calendar Month View: Event Titles vs Dots',
    short: 'Month View Event Titles vs Dots',
    description:
      'Tired of meaningless gray dots in monthly views? Compare readable Month-cell event title chips, +N overflow counts, and zoom modes across Cloud Calendars, Apple Calendar iOS 18, Google, and BusyCal.',
    verdict:
      'Cloud Calendars, iOS 18 Apple Calendar (Details zoom), Google Calendar, and BusyCal all show readable Month event chips instead of dots alone—and Cloud Calendars adds Month drag-to-move.',
    updated: '2026-11-04',
  },
  {
    slug: 'calendar-apps-with-built-in-weather-forecast-iphone',
    group: 'views',
    badge: 'Weather Calendars',
    title: 'iPhone Calendar Apps with Built-In Weather Compared',
    seoTitle: 'iPhone Calendar Apps with Built-In Weather Compared',
    short: 'iPhone Calendars with Built-In Weather',
    description:
      'Compare iPhone calendar apps with integrated weather forecasts—Cloud Calendars (Apple WeatherKit), Fantastical (AccuWeather), Timepage, BusyCal, and Calendar 366—by hourly detail and cost.',
    verdict:
      'Cloud Calendars is the standout free option offering a full Apple WeatherKit station (hourly temp, wind/gusts, UV, rain, pressure) plus tap-hour event drafting right inside Day and Week grids.',
    updated: '2026-11-04',
    featuredOnHome: true,
  },
  {
    slug: 'natural-language-event-entry-calendar-apps-compared',
    group: 'views',
    badge: 'Quick Event Entry',
    title: 'Natural-Language Event Entry Calendar Apps on iOS',
    seoTitle: 'Natural-Language Event Entry Calendar Apps on iOS',
    short: 'Natural-Language Entry vs Visual Drafting',
    description:
      'Compare sentence-parsing calendar entry (Fantastical, BusyCal, Calendars by Readdle, Siri) against visual timeline drag, resize, and forecast-hour drafting in Cloud Calendars.',
    verdict:
      'Pick Fantastical, BusyCal, or Readdle if typing slash-syntax sentences is your top priority; pick Cloud Calendars if you prefer visual hour-grid tapping, drag/resize, and explicit field review.',
    updated: '2026-11-04',
  },

  // 25–30: iPad, Mac, Apple Watch, Privacy & Shift Workflows
  {
    slug: 'best-ipad-and-mac-calendar-app-comparison',
    group: 'devices',
    badge: 'iPad & Mac',
    title: 'iPad & Mac Calendar Apps Compared: Views & Sync',
    seoTitle: 'iPad & Mac Calendar Apps Compared: Views & Sync',
    short: 'iPad & Mac Calendar Apps Compared',
    description:
      'Compare landscape iPad planning and macOS desktop calendar apps: Cloud Calendars (iPhone & iPad), Apple Calendar, Fantastical, BusyCal, Calendars by Readdle, and Notion Calendar.',
    verdict:
      'Cloud Calendars delivers native iPad landscape Week, Month, Year, and Multi-column views with WeatherKit; pair it with Apple Calendar or Notion Calendar on Mac if you also need desktop.',
    updated: '2026-11-04',
  },
  {
    slug: 'apple-watch-calendar-complications-comparison',
    group: 'devices',
    badge: 'Watch vs Live Activity',
    title: 'Apple Watch Calendar Complications vs iPhone Live Activity',
    seoTitle: 'Apple Watch Calendar Complications vs iPhone Live Activity',
    short: 'Apple Watch Complications vs Live Activity',
    description:
      'Compare native Apple Watch calendar apps and complications (Apple Calendar, Fantastical, BusyCal, Google Calendar) with Cloud Calendars’ iPhone Lock Screen Live Activity and store sync.',
    verdict:
      'Choose Apple Calendar, Fantastical, or BusyCal if interactive wrist complications are mandatory; Cloud Calendars targets iPhone/iPad Lock Screen Live Activities while keeping iOS store events Watch-readable.',
    updated: '2026-11-04',
  },
  {
    slug: 'fantastical-alternatives-cheaper-iphone-mac',
    group: 'devices',
    badge: 'Value Alternatives',
    title: 'Best Cheaper Fantastical Alternatives for iPhone & Mac',
    seoTitle: 'Best Cheaper Fantastical Alternatives for iPhone & Mac',
    short: 'Cheaper Fantastical Alternatives',
    description:
      'Looking for a lower-cost alternative to Flexibits Premium (~$57/yr)? Compare Cloud Calendars ($0 / $4.99 yr ad-free), Apple Calendar ($0), Notion Calendar ($0), BusyCal, and Calendar 366.',
    verdict:
      'For iPhone and iPad users using Google + iCloud + weather, Cloud Calendars ($0 Free or $4.99/yr ad-free Advanced) cuts ~$52/yr vs Fantastical; BusyCal and Calendar 366 win for one-time Mac+iOS buyers.',
    updated: '2026-11-04',
    featuredOnHome: true,
  },
  {
    slug: 'privacy-first-direct-sync-vs-cloud-relay-calendar-apps',
    group: 'devices',
    badge: 'Privacy & Storage',
    title: 'Direct Sync vs Cloud-Relay Calendar Privacy on iOS',
    seoTitle: 'Direct Sync vs Cloud-Relay Calendar Privacy on iOS',
    short: 'Direct Sync vs Cloud-Relay Privacy',
    description:
      'Understand where your schedule actually lives: compare account-free on-device calendars and direct EventKit/OAuth sync (Cloud Calendars, Apple Calendar) against cloud-relay servers and E2EE apps.',
    verdict:
      'Use Cloud Calendars local mode or direct iOS EventKit/OAuth when you want zero intermediary vendor cloud storing your iCloud events; use Proton/Tuta when you need E2EE cloud storage.',
    updated: '2026-11-04',
  },
  {
    slug: 'best-calendar-app-for-shift-workers-and-rotating-schedules',
    group: 'devices',
    badge: 'Shift Work & Rotas',
    title: 'Best iPhone Calendar Apps for Shift Workers & Rotas',
    seoTitle: 'Best iPhone Calendar Apps for Shift Workers & Rotas',
    short: 'Calendar Apps for Shift Workers',
    description:
      'Compare dedicated shift-pattern generators (Supershift, MyShiftPlanner) with multi-account iPhone calendar viewers (Cloud Calendars, Apple Calendar, BusyCal) for Pitman, DuPont, 24/48, and night shifts.',
    verdict:
      'Generate complex non-7-day rotations in a specialist rota tool (Supershift/MyShiftPlanner) if needed, then view shifts beside family plans and commute weather in Cloud Calendars on iPhone.',
    updated: '2026-11-04',
  },
  {
    slug: 'all-day-multi-day-banners-and-week-numbers-calendars-ios',
    group: 'devices',
    badge: 'Banners & ISO Weeks',
    title: 'All-Day Banners & Week Numbers in iOS Calendars',
    seoTitle: 'All-Day Banners & Week Numbers in iOS Calendars',
    short: 'All-Day Banners & Week Numbers on iOS',
    description:
      'Compare how Cloud Calendars, Apple Calendar, Google Calendar, BusyCal, and Fantastical render multi-day trip banners, widget all-day filtering, Monday week starts, and ISO 8601 week numbers.',
    verdict:
      'Cloud Calendars separates multi-day all-day banners cleanly in the app while keeping Home Screen event widgets focused strictly on timed meetings; use Apple Calendar or Fantastical when ISO week numbers are required.',
    updated: '2026-11-04',
  },
];

export const COMPARISON_SLUGS: readonly string[] = COMPARISON_CARDS.map((card) => card.slug);

const BATCH_1 = new Set([
  'cloud-calendars-vs-apple-calendar',
  'cloud-calendars-vs-google-calendar-iphone',
  'cloud-calendars-vs-fantastical',
  'cloud-calendars-vs-microsoft-outlook-mobile',
  'cloud-calendars-vs-calendars-by-readdle',
  'cloud-calendars-vs-timepage-moleskine',
]);

const BATCH_2 = new Set([
  'cloud-calendars-vs-busycal-ios-mac',
  'cloud-calendars-vs-notion-calendar-cron',
  'cloud-calendars-vs-timetree-family-sharing',
  'cloud-calendars-vs-cozi-family-organizer',
  'cloud-calendars-vs-structured-daily-planner',
  'cloud-calendars-vs-todoist-and-ticktick-calendar-views',
]);

const BATCH_3 = new Set([
  'cloud-calendars-vs-proton-and-tuta-encrypted-calendars',
  'cloud-calendars-vs-acalendar-and-digical-switchers',
  'merge-icloud-google-outlook-exchange-calendars-iphone',
  'caldav-vs-ics-subscribed-url-vs-oauth-calendar-sync',
  'shared-icloud-calendar-vs-shared-google-calendar-families',
  'work-exchange-microsoft-365-and-personal-icloud-iphone',
]);

const BATCH_4 = new Set([
  'calendar-conflict-detection-vs-calendly-booking-links',
  'timezone-travel-calendar-handling-comparison-iphone',
  'best-iphone-calendar-widgets-home-and-lock-screen',
  'month-view-event-titles-vs-dots-iphone-calendars',
  'calendar-apps-with-built-in-weather-forecast-iphone',
  'natural-language-event-entry-calendar-apps-compared',
]);

const BATCH_5 = new Set([
  'best-ipad-and-mac-calendar-app-comparison',
  'apple-watch-calendar-complications-comparison',
  'fantastical-alternatives-cheaper-iphone-mac',
  'privacy-first-direct-sync-vs-cloud-relay-calendar-apps',
  'best-calendar-app-for-shift-workers-and-rotating-schedules',
  'all-day-multi-day-banners-and-week-numbers-calendars-ios',
]);

export async function loadComparisonArticle(slug: string): Promise<LocalisedArticle | undefined> {
  if (BATCH_1.has(slug)) {
    return (await import('./batch-1-core-apps')).COMPARISONS_BATCH_1[slug];
  }
  if (BATCH_2.has(slug)) {
    return (await import('./batch-2-specialty-apps')).COMPARISONS_BATCH_2[slug];
  }
  if (BATCH_3.has(slug)) {
    return (await import('./batch-3-encrypted-switchers-sync')).COMPARISONS_BATCH_3[slug];
  }
  if (BATCH_4.has(slug)) {
    return (await import('./batch-4-scheduling-views-weather')).COMPARISONS_BATCH_4[slug];
  }
  if (BATCH_5.has(slug)) {
    return (await import('./batch-5-devices-alternatives-workflows')).COMPARISONS_BATCH_5[slug];
  }
  return undefined;
}
