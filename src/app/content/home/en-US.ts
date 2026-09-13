import { HomeCopy } from './types';

/**
 * The home page in English.
 *
 * Lifted verbatim out of the components rather than rewritten, so that
 * introducing this layer changed the machinery and not a single word the
 * reader sees. Every other language is a translation of this file.
 */
export const HOME_EN_US: HomeCopy = {
  // Written for the query that actually reaches this page. "cloud calendar"
  // draws 3,743 impressions a month at around position ten and converts two of
  // them, because the old title led with the brand and then talked about
  // weather -- which reads as a forecast app to somebody looking for a calendar
  // that holds their accounts. The job goes first now; the weather closes the
  // description, where it is a reason to choose us rather than a reason to
  // scroll past.
  metaTitle: 'Cloud Calendars — iCloud, Google and Outlook in one view',
  metaDescription:
    'One view for your iCloud, Google and Outlook calendars on iPhone and iPad. Free to start, no account to create, and each day’s forecast in the grid.',

  nav: {
    tour: 'Tour',
    widgets: 'Widgets',
    weather: 'Weather',
    features: 'Features',
    pricing: 'Pricing',
    faq: 'FAQ',
    articles: 'Articles',
    getApp: 'Get the app',
    menu: 'Menu',
    language: 'Language',
  },

  hero: {
    badge: 'Version {v} — shared events now keep themselves up to date',
    title: ['Your calendar.', 'Your sky.', 'One view.'],
    lead: 'Every calendar you own — iCloud, Google, Microsoft — in one place, with the forecast built into the day itself. Stop guessing what the afternoon looks like.',
    seeItMove: 'See it in motion',
    onTheAppStore: 'on the App Store',
    freeToStart: 'Free to start — no account needed',
    scroll: 'Scroll',
    ratingLabel: '{r} out of 5 from {n} App Store ratings',
    altMonth: 'Cloud Calendars month view with event indicators on every day',
    altDay: 'Cloud Calendars day view showing an hourly grid with weather beside each hour',
    altWeather: 'Cloud Calendars weather hub with hourly and ten-day forecast',
  },

  marquee: [
    'iCloud',
    'Google Calendar',
    'Microsoft Outlook',
    'Hourly forecasts',
    'Home Screen widgets',
    'Live Activities',
    'Google Meet links',
    'Microsoft Teams links',
    'Day · Week · Month · Year',
    'Drag to reschedule',
    'Wind & gusts',
    'No account required',
  ],

  showcase: {
    eyebrow: 'The tour',
    title: ['Five ways to look', 'at the same week.'],
    lead: 'The same events, arranged for the question you are actually asking — and every one of them carrying the forecast.',
    panels: [
      {
        kicker: 'Day view',
        title: 'The hour-by-hour plan, with the sky attached',
        body: 'An hourly grid where every row carries its own forecast. You see the 3pm meeting and the 3pm rain in the same glance — no second app, no guessing.',
        alt: 'Day view with an hourly grid, events and hourly weather icons',
        bullets: ['Live "now" line', 'Hourly temperature', 'Drag to reschedule'],
      },
      {
        kicker: 'Week view',
        title: 'A whole week you can actually read',
        body: 'Seven columns, each headed by its own high, low and condition. Rotate to landscape for the full spread. Grab an event and slide it to another day.',
        alt: 'Week view with daily columns, each showing a weather summary',
        bullets: ['Portrait & landscape', 'Daily high / low', 'Drag across days'],
      },
      {
        kicker: 'Multi-calendar',
        title: 'Work and life, side by side instead of stacked',
        body: 'Give each calendar its own column and stop untangling colour-coded overlap. The one view that makes a shared household or a split work week make sense.',
        alt: 'Multi-calendar day view with each calendar in its own column',
        bullets: ['One column per calendar', 'Colour coded', 'Toggle any source'],
      },
      {
        kicker: 'Month & year',
        title: 'Pull back far enough to see the shape of things',
        body: 'Month view marks every day that has something on it. Year view puts twelve months on one screen — the fastest way to find a free week.',
        alt: 'Month view with event indicators on each day',
        bullets: ['Event density at a glance', 'Twelve-month overview', 'Jump to any date'],
      },
      {
        kicker: 'List view',
        title: 'When you just want to know what is next',
        body: 'A clean chronological agenda. No grid, no columns — just the next thing, and the thing after that.',
        alt: 'List view showing events in chronological order',
        bullets: ['Chronological', 'Nothing to decode', 'Search from here'],
      },
    ],
  },

  widgets: {
    eyebrow: 'New in {v}',
    title: ['Your day, before', 'you unlock anything.'],
    lead: 'Cloud Calendars lives on the Home Screen and the Lock Screen, not just inside an app icon. Widgets carry the date, the forecast and what’s next; a Live Activity counts down to it.',
    newIn: 'New in',
    items: [
      {
        title: 'Three widget sizes',
        body: 'Small for the date and temperature, medium for conditions, moon phase and wind, large for the day’s agenda alongside the forecast.',
      },
      {
        title: 'Live Activity on the Lock Screen',
        body: 'Your next event counts down in the Dynamic Island and on the Lock Screen, so you never have to open anything to know how long you have.',
      },
      {
        title: 'Notifications that arrive in time',
        body: 'Event reminders that respect travel time and tell you what the weather is doing when you get there.',
      },
    ],
  },

  weather: {
    eyebrow: 'Weather hub',
    title: ['A weather station,', 'parked in your calendar.'],
    lead: 'Temperature, feels-like, precipitation, UV, wind, humidity, visibility and pressure — each one a scrubable hourly chart. Tap any hour in the forecast and the app opens a new event already set to that time.',
    searchLabel: 'Search for a city',
    searchPlaceholder: 'Try another city — anywhere',
    searching: 'Searching…',
    alt: 'Weather hub showing current temperature, hourly graph and ten-day forecast',
    unavailable: 'Live forecast unavailable right now — showing sample data.',
    liveFrom: 'Live from Open-Meteo, as of {t}.',
    tapAnHour: 'In the app, tap an hour to drop an event straight onto it.',
    readings: {
      feelsLike: 'Two degrees below actual — the wind is doing it.',
      precipitation: 'A band moving through between 4 and 7pm.',
      uv: 'High around noon. Cover up between 11 and 3.',
      wind: 'West-south-west, gusting to 17 late afternoon.',
      humidity: 'Dew point 55° — comfortable.',
      pressure: 'Rising steadily since dawn.',
    },
  },

  features: {
    eyebrow: 'Everything else',
    title: ['Built for the way', 'a real week goes.'],
    lead: 'Three accounts, one grid, and a set of gestures that behave the way your hands expect them to.',
    unified: {
      title: 'Three accounts. One grid.',
      body: 'iCloud, Google Calendar and Microsoft Outlook, synced two ways and colour-coded in a single view. Toggle any calendar off when you don’t want to see it — the rest keeps working.',
    },
    gestures: {
      title: 'Drag it. Stretch it. Done.',
      body: 'Grab an event and slide it to a new time or a different day. Pull its top or bottom edge to change how long it runs. No modal, no save button.',
    },
    tiles: [
      {
        title: 'Meeting links, generated for you',
        body: 'Create an event on a Google calendar and a Meet link is attached. Create one on Microsoft and you get a Teams link. Nobody has to paste anything.',
        badge: 'Meet · Teams',
      },
      {
        title: 'Turn a forecast into a plan',
        body: 'Tap any hour in the weather hub and a new event opens, already set to that time. Find the dry window, then book it.',
        badge: 'One tap',
      },
      {
        title: 'Your calendar stays yours',
        body: 'Events are read through Apple, Google and Microsoft’s own APIs and rendered on device. Nothing is sold, and there is no account to create.',
        badge: 'No account',
      },
    ],
    sourceNotes: { builtIn: 'Built in', twoWay: 'Two-way', premium: 'Premium' },
  },

  pricing: {
    eyebrow: 'Pricing',
    title: ['Free is', 'genuinely free.'],
    lead: 'iCloud sync, Google sync, every view, the whole weather hub and all the widgets cost nothing. Upgrade only if you want the ads gone or your Microsoft calendar in there too.',
    monthly: 'Monthly',
    yearly: 'Yearly',
    saveMore: 'save more',
    billingPeriod: 'Billing period',
    mostPopular: 'Most popular',
    everythingIn: 'Everything in {tier}, plus:',
    forever: 'forever',
    perMonth: '/ month',
    perYear: '/ year',
    downloadFree: 'Download free',
    startWith: 'Start with {tier}',
    note: 'Subscriptions renew automatically and are billed through your Apple ID. Cancel any time in your App Store account settings, at least 24 hours before the period ends.',
    plans: {
      free: {
        name: 'Free',
        tagline: 'Everything you need to run your week.',
        features: [
          'Day, Week, Month, Year and List views',
          'iCloud calendar sync',
          'Google Calendar sync',
          'Full weather hub and in-calendar forecasts',
          'Home Screen widgets',
          'Google Meet links on events',
          'Drag, drop and resize events',
        ],
      },
      advanced: {
        name: 'Advanced',
        tagline: 'A quieter app and deeper calendar control.',
        yearlyNote: 'Save 15% yearly',
        features: [
          'No ads, anywhere',
          'Cross-calendar management across iCloud and Google',
          'Google Calendar sharing permissions',
          'Automatic Google Meet link generation',
          'Priority weather refresh',
        ],
      },
      premium: {
        name: 'Premium',
        tagline: 'For work calendars that live in Microsoft.',
        yearlyNote: 'Save 16% yearly',
        features: [
          'Microsoft Outlook & Exchange sync',
          'Automatic Microsoft Teams links',
          'Full cross-calendar management across all three accounts',
          'Attendee management and invitations',
        ],
      },
    },
  },

  faq: {
    eyebrow: 'Questions',
    title: ['The things people', 'ask first.'],
    lead: 'Still stuck? Everything about data handling is written out in the {link}.',
    privacyLink: 'privacy policy',
    items: [
      {
        q: 'Do I need an account to use Cloud Calendars?',
        a: 'No. The app reads the calendars already on your iPhone through Apple’s own EventKit, so iCloud works the moment you grant permission. You only sign in to Google or Microsoft if you want those calendars in there too.',
      },
      {
        q: 'Is Google Calendar sync really free?',
        a: 'Yes. Google sync, every calendar view, the complete weather hub, all the Home Screen widgets and Google Meet links are in the free tier. Advanced removes ads and adds cross-calendar management; Premium adds Microsoft.',
      },
      {
        q: 'Where does the weather data come from?',
        a: 'Forecasts are fetched for your current or chosen location and cover hourly and ten-day outlooks, feels-like temperature, precipitation, UV, wind and gusts, humidity and dew point, visibility, pressure, sunrise and sunset, and moon phase.',
      },
      {
        q: 'Can I change an event by dragging it?',
        a: 'That is the main way to edit. Drag an event to another time or another day, or pull its top or bottom edge to change the duration. Changes sync straight back to the source calendar.',
      },
      {
        q: 'What do the widgets show?',
        a: 'Three sizes. Small gives the date with the current condition and temperature. Medium adds conditions, moon phase and wind direction. Large puts your next few events beside the forecast. A Live Activity counts down to your next event.',
      },
      {
        q: 'Which devices are supported?',
        a: 'iPhone and iPad running iOS 18 or later. The app is about 35 MB.',
      },
      {
        q: 'How do I cancel a subscription?',
        a: 'Subscriptions are handled by Apple, so you cancel in your App Store account settings. Do it at least 24 hours before the period ends and you will not be charged again.',
      },
    ],
  },

  cta: {
    title: ['Tomorrow already has', 'a forecast attached.'],
    lead: 'Free on the App Store. No account, no onboarding wizard — grant calendar access and your week is already there.',
    fromRatings: 'from {n} ratings',
    download: 'download',
    requiresIos: 'requires iOS {v}',
    alt: 'Cloud Calendars week view with weather in every day header',
  },

  footer: {
    tagline: 'Your calendars and the forecast, in one place. Built for iPhone and iPad.',
    product: 'Product',
    legal: 'Legal',
    app: 'App',
    privacy: 'Privacy policy',
    terms: 'Terms of service',
    eula: 'Apple EULA',
    version: 'Version {v}',
    iosOrLater: 'iOS {v} or later',
    viewOnStore: 'View on the App Store',
    rights: '© {year} {developer}. All rights reserved.',
    weatherBy: 'Live weather by',
  },
};
