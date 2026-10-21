import { HomeCopy } from './types';

/**
 * The home page in English.
 *
 * Locale-specific copy; changes here do not automatically update other
 * languages. Keep product claims aligned with the source-backed app facts.
 */
export const HOME_EN_US: HomeCopy = {
  // Clarify the app's platforms for generic calendar searches. Baseline and
  // segmentation: research/measurement/gsc-baseline-20261021.json.
  // This editorial change is a hypothesis, not a demonstrated CTR improvement.
  metaTitle: 'Cloud Calendars — Calendar App for iPhone & iPad',
  metaDescription:
    'See iCloud and Google calendars with weather and widgets on iPhone and iPad. Download free; Premium adds Microsoft calendars and Teams.',

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
    lead: 'See iCloud and Google calendars together on iPhone and iPad, with weather alongside your plans. Premium also connects Microsoft calendars.',
    seeItMove: 'See it in motion',
    onTheAppStore: 'on the App Store',
    freeToStart: "Download free",
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
    "Local calendars",
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
    title: ["Your calendar,","at a glance."],
    lead: "Choose date-and-weather widgets or upcoming event lists. A separate Live Activity adds a countdown.",
    newIn: 'New in',
    items: [
      {
        title: 'Three widget sizes',
        body: "Small and medium layouts show date and weather. Medium and large event lists show future timed appointments; find all-day entries in the app.",
      },
      {
        title: 'Live Activity on the Lock Screen',
        body: "Use Live Activity on supported devices. Updates may take time; check the app after a schedule change.",
      },
      {
        title: "Reminders you choose",
        body: "Choose event alerts and notification settings. Check travel time and the forecast in the app.",
      },
    ],
  },

  weather: {
demoLabel: "Website demo · Open-Meteo. The app uses Apple WeatherKit; available dates may differ.",
loadingLabel: "Loading weather for the selected place…",
tabs: {"hourly":"Hourly","daily":"Daily","weekend":"Weekend","range":"Forecast range"},

    eyebrow: 'Weather hub',
    title: ['A weather station,', 'parked in your calendar.'],
    lead: "Explore weather alongside your plans in the app. This website demo uses Open-Meteo; the app uses Apple WeatherKit, with available hourly and daily forecasts for your selected place.",
    searchLabel: 'Search for a city',
    searchPlaceholder: 'Try another city — anywhere',
    searching: 'Searching…',
    alt: 'Weather hub showing current temperature, hourly graph and ten-day forecast',
    unavailable: "Website demo: sample data, not a live forecast for the selected place.",
    liveFrom: "Website demo · Open-Meteo · as of {t}.",
    tapAnHour: "In the app, choose an available forecast hour to start an event draft, then review its time and calendar.",
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
        title: "Meet · Teams",
        body: "Google Meet links · Microsoft Teams links",
        badge: 'Meet · Teams',
      },
      {
        title: 'Turn a forecast into a plan',
        body: 'Tap any hour in the weather hub and a new event opens, already set to that time. Find the dry window, then book it.',
        badge: 'One tap',
      },
      {
        title: "Local calendars",
        body: "Use local calendars without an account. Connecting calendar services and sharing may require sign-in.",
        badge: "Local calendars",
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
        tagline: "No ads, anywhere",
        yearlyNote: 'Save 15% yearly',
        features: ["No ads, anywhere"],
      },
      premium: {
        name: 'Premium',
        tagline: 'For work calendars that live in Microsoft.',
        yearlyNote: 'Save 16% yearly',
        features: ["Microsoft Calendar","Microsoft Teams links"],
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
        a: "Use local calendars without an account. Connecting calendar services and sharing may require sign-in.",
      },
      {
        q: 'Is Google Calendar sync really free?',
        a: "Google Calendar and Google Meet support are included in Free. Advanced removes ads; Premium adds Microsoft Calendar and Teams.",
      },
      {
        q: 'Where does the weather data come from?',
        a: "The app uses Apple WeatherKit for your current or selected place. Check the available dates and hours; its daily list shows up to ten returned days. The website demo uses Open-Meteo and may show a different range.",
      },
      {
        q: 'Can I change an event by dragging it?',
        a: 'That is the main way to edit. Drag an event to another time or another day, or pull its top or bottom edge to change the duration. Changes sync straight back to the source calendar.',
      },
      {
        q: 'What do the widgets show?',
        a: "Small and medium layouts show date and weather. Medium and large event lists show future timed appointments; find all-day entries in the app. Use Live Activity on supported devices. Updates may take time; check the app after a schedule change.",
      },
      {
        q: 'Which devices are supported?',
        a: "iPhone / iPad · iOS / iPadOS 18+",
      },
      {
        q: 'How do I cancel a subscription?',
        a: 'Subscriptions are handled by Apple, so you cancel in your App Store account settings. Do it at least 24 hours before the period ends and you will not be charged again.',
      },
    ],
  },

  cta: {
    title: ['Tomorrow already has', 'a forecast attached.'],
    lead: "Download free. Use local calendars without an account. Connecting calendar services and sharing may require sign-in.",
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
