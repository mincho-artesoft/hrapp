import type { LocalisedArticle } from '../types';

export const COMPARISONS_BATCH_1: Readonly<Record<string, LocalisedArticle>> = {
  'cloud-calendars-vs-apple-calendar': {
    updated: '2026-11-04',
    seoTitle: 'Cloud Calendars vs Apple Calendar (iPhone, iPad & Mac)',
    title: 'Cloud Calendars vs Apple Calendar (iPhone, iPad & Mac)',
    short: 'Cloud Calendars vs Apple Calendar',
    description:
      'Compare Cloud Calendars and built-in Apple Calendar on iPhone and iPad: multi-calendar columns, hourly WeatherKit forecasts, Google OAuth sync, Reminders, and Mac support.',
    lede: 'Apple Calendar is pre-installed, ad-free, and tightly integrated with Siri, Apple Watch, Mac, and iOS 18 Reminders, making it a strong default for single-ecosystem Apple schedules. Cloud Calendars upgrades iPhone and iPad planning with side-by-side multi-calendar columns, hourly and up-to-10-day Apple WeatherKit forecasts inside the timeline, direct Google OAuth with Google Meet links, and Lock Screen Live Activity countdowns. Arte Soft develops Cloud Calendars and publishes this comparison.',
    comparison: {
      heading: 'Feature-by-Feature Comparison Matrix',
      caption: 'Cloud Calendars vs built-in Apple Calendar on iOS and iPadOS 18+',
      columns: ['Capability', 'Cloud Calendars (iPhone & iPad)', 'Apple Calendar (Built-in)'],
      rows: [
        {
          cells: [
            'Planning views',
            'Day, Week (portrait & landscape), Month, Year, List & Multi-calendar column Day view',
            'Day, Multi-day/Landscape Week, Month (compact/stacked/details in iOS 18), Year & List',
          ],
        },
        {
          cells: [
            'Side-by-side account columns',
            'Dedicated Multi-calendar view with one column per selected calendar',
            'Overlays all calendars into one shared timeline on iPhone',
          ],
        },
        {
          cells: [
            'Weather integration',
            'Full Apple WeatherKit hub + hourly temp, rain, UV, wind/gusts beside hours & tap-hour draft',
            'No built-in hourly weather grid or 10-day weather station inside Apple Calendar on iPhone',
          ],
        },
        {
          cells: [
            'Reminders & tasks',
            'Event alerts and second alerts only; does not display Apple Reminders checklists',
            'Native iOS 18+ Apple Reminders creation and completion directly inside Calendar',
          ],
        },
        {
          cells: [
            'Conferencing links',
            'Google Meet (Free) and Microsoft Teams (Premium) link support on events',
            'FaceTime video links built in; third-party links pasted or added via providers',
          ],
        },
        {
          cells: [
            'Widgets & Lock Screen',
            'Small/medium date+weather widgets, medium/large timed event lists & Live Activity countdown',
            'Up Next, Month & List widgets across Home Screen, Lock Screen, StandBy & Apple Watch',
          ],
        },
        {
          cells: [
            'Event sharing options',
            'Provider invites plus Cloud Calendars link/QR/email sharing & iPhone App Clip preview',
            'iCloud calendar sharing and standard iCalendar/email attendee invitations',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'How Account Sync Differs Under the Hood on iPhone',
        body: [
          'On iOS, third-party apps do not replace Apple Calendar’s database; instead, Apple provides the shared EventKit calendar store alongside direct provider OAuth APIs. Apple Calendar syncs iCloud with native Push, Exchange via ActiveSync/OAuth, and Google Calendar via iOS Calendar Accounts (which uses periodic Fetch rather than instant Google Push on standard Gmail accounts).',
          'Cloud Calendars reads any device calendar you grant Full Access to in iPhone Settings (including iCloud, CalDAV, and subscribed ICS feeds) and adds direct Sign in with Google (Free) and Sign in with Microsoft (Premium) connections that synchronize via mirrored calendars in the iOS store. Avoid enabling the exact same Google account through both routes without hiding one list, or meetings will display twice.',
        ],
        table: {
          heading: 'Account Sync, Protocol & Platform Support',
          caption: 'Provider sync paths, refresh mechanics, and Apple ecosystem hardware support',
          columns: ['Provider / Dimension', 'Cloud Calendars', 'Apple Calendar'],
          rows: [
            {
              cells: [
                'Google Calendar',
                'Direct Sign in with Google OAuth + Meet links (Free), or read via iOS Calendar Accounts',
                'Configured in iOS Settings > Apps > Calendar > Calendar Accounts (Fetch-based refresh)',
              ],
            },
            {
              cells: [
                'Microsoft 365 / Outlook / Exchange',
                'Sign in with Microsoft OAuth + Teams (Premium), or read Exchange via iOS Calendar Accounts',
                'Native Exchange / Outlook.com account support in iOS Settings (subject to org policy)',
              ],
            },
            {
              cells: [
                'Apple iCloud & CalDAV',
                'Full read/write via iOS Calendar Accounts (EventKit permission required); Free',
                'First-party native iCloud Push & CalDAV account configuration in iOS/macOS Settings',
              ],
            },
            {
              cells: [
                'ICS URL Subscriptions',
                'Displays iOS subscribed ICS calendars as read-only feeds',
                'Native Add Subscription Calendar (.ics URL) with optional iCloud sync across Apple devices',
              ],
            },
            {
              cells: [
                'Supported Platforms',
                'iPhone & iPad (iOS / iPadOS 18.0+)',
                'iPhone, iPad, Mac, Apple Watch, Apple Vision Pro & iCloud.com web',
              ],
            },
            {
              cells: [
                'Offline & Local Storage',
                'Account-free on-device local calendars + cached iOS store events offline',
                'Full offline cache via iOS/macOS system store + "On My iPhone" local calendars',
              ],
            },
          ],
        },
      },
      {
        heading: 'Pricing and When to Use Apple Calendar vs Cloud Calendars',
        body: [
          'Apple Calendar costs $0 with zero advertising across every Apple device. Because both apps can read the same iCloud and device calendars simultaneously, many people keep Apple Calendar on Mac and Apple Watch while using Cloud Calendars on iPhone and iPad for multi-column week reviews and weather planning.',
          'In Cloud Calendars, every view, Google sync, Home Screen widgets, and the Apple WeatherKit forecast hub are included in Free (ad-supported). Advanced ($0.49/month or $4.99/year in the US App Store) removes ads, while Premium ($4.99/month or $49.99/year) adds Microsoft Calendar and Teams links.',
        ],
        table: {
          heading: 'Pricing & Best Choice by User Scenario',
          caption: 'Plan comparison and scenario-based guidance for iPhone, iPad, and Mac users',
          columns: ['User Scenario', 'Cloud Calendars', 'Apple Calendar', 'Best Choice'],
          rows: [
            {
              cells: [
                'Zero-cost, zero-ad calendar across iPhone, Mac & Watch',
                'Free tier has ads (Advanced is $4.99/yr); iPhone & iPad only',
                '$0 built-in, zero ads across iOS, iPadOS, macOS & watchOS',
                'Apple Calendar',
              ],
            },
            {
              cells: [
                'Checking Apple Reminders alongside meetings',
                'Does not render Apple Reminders checklists in timeline',
                'Scheduled iOS 18+ Reminders appear directly in Day/Month views',
                'Apple Calendar',
              ],
            },
            {
              cells: [
                'Outdoor work, travel, sports & weather-sensitive days',
                'Hourly WeatherKit temps, wind, UV & rain beside timeline hours',
                'Requires switching between Calendar and Apple Weather apps',
                'Cloud Calendars',
              ],
            },
            {
              cells: [
                'Comparing 3–5 busy calendars without overlapping bars',
                'Multi-calendar Day view puts each calendar in its own column',
                'Overlays all calendars into one combined day column',
                'Cloud Calendars',
              ],
            },
            {
              cells: [
                'Google Meet + portrait Week grid on iPhone',
                'Readable portrait & landscape Week grid + Google Meet in Free',
                'iPhone portrait defaults to Day/Stacked Month; Week needs landscape',
                'Cloud Calendars',
              ],
            },
            {
              cells: [
                'Lock Screen countdown to next timed appointment',
                'Dedicated Live Activity countdown + date/weather widgets',
                'System Up Next widgets & standard notifications',
                'Cloud Calendars',
              ],
            },
          ],
        },
      },
      {
        heading: 'Portrait Week Grids, Multi-Column Days, and Weather Context',
        body: [
          'iOS 18 improved Apple Calendar with zoomable Month views and inline Reminders, yet seeing a full 7-day Week grid in portrait orientation on iPhone and checking hourly weather beside appointments still require extra taps or separate apps.',
          'Cloud Calendars renders both portrait and landscape Week views with daily high/low temperatures in column headers, plus a dedicated Weather Hub showing feels-like temperature, precipitation, wind and gusts, UV index, humidity, and pressure for up to ten returned Apple WeatherKit forecast days.',
        ],
      },
      {
        heading: 'Running Both Apps Together Without Duplicate Alerts',
        body: [
          'Installing Cloud Calendars alongside Apple Calendar is non-destructive: moving an iCloud appointment in Cloud Calendars updates the underlying iOS record immediately. However, leaving notifications enabled in both apps will trigger double banners before every meeting.',
          'Choose one primary app for audible reminders and disable notifications for the secondary app in iPhone Settings > Notifications, rather than deleting alerts saved on the calendar event itself.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Grant Full Access in Settings > Privacy & Security > Calendars so Cloud Calendars can read existing iCloud/device events.',
      'Check whether your Google account is already enabled in iOS Settings before adding a second route, or hide the duplicate list.',
      'Compare portrait Week view and Multi-calendar Day columns on your iPhone against Apple Calendar’s stacked Month view.',
      'Silence notifications in whichever app is secondary so you avoid duplicate banners before meetings.',
      'Keep Apple Calendar on Mac and Apple Watch when you need desktop editing or wrist complications.',
    ],
    faq: [
      {
        q: 'Does Cloud Calendars sync with Apple iCloud Calendar?',
        a: 'Yes. Enable iCloud Calendar on your iPhone or iPad under your Apple Account and grant Cloud Calendars Full Access to Calendars in iOS Privacy settings. iCloud calendars are supported in the Free plan.',
      },
      {
        q: 'Why am I getting two notifications for every iCloud event?',
        a: 'Both Apple Calendar and Cloud Calendars can deliver local notifications for selected calendars. Keep the event alert intact and turn off notifications for one of the two apps in iPhone Settings > Notifications.',
      },
      {
        q: 'Does Cloud Calendars show iOS 18 Apple Reminders?',
        a: 'No. Apple Calendar displays scheduled Apple Reminders natively in iOS 18+, whereas Cloud Calendars focuses on calendar events, event alerts, multi-account columns, and weather forecasts.',
      },
    ],
    sourcesHeading: 'Official Apple and Cloud Calendars references',
    sources: [
      { label: 'Apple: Use multiple calendars on iPhone', url: 'https://support.apple.com/guide/iphone/use-multiple-calendars-iph3d1110d4/ios' },
      { label: 'Apple: Set up iCloud Calendar on your devices', url: 'https://support.apple.com/guide/icloud/set-up-calendar-mme4d73a8727/icloud' },
      { label: 'Apple: Control access to calendars on iPhone', url: 'https://support.apple.com/en-ca/guide/iphone/iph251e92810/ios' },
      { label: 'Cloud Calendars on the App Store', url: 'https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319' },
    ],
    relatedComparisons: [
      { slug: 'cloud-calendars-vs-fantastical', label: 'Cloud Calendars vs Fantastical' },
      { slug: 'cloud-calendars-vs-google-calendar-iphone', label: 'Cloud Calendars vs Google Calendar on iPhone' },
      { slug: 'month-view-event-titles-vs-dots-iphone-calendars', label: 'iPhone Calendar Month View: Event Titles vs Dots' },
    ],
    seeAlso: [
      'weather-inside-your-calendar',
      'calendar-notifications-missing-silent-or-duplicated',
      'iphone-calendar-tasks-reminders-versus-event-alerts',
      'the-widget-that-shows-what-is-next',
    ],
  },

  'cloud-calendars-vs-google-calendar-iphone': {
    updated: '2026-11-04',
    seoTitle: 'Cloud Calendars vs Google Calendar App on iPhone',
    title: 'Cloud Calendars vs Google Calendar App on iPhone',
    short: 'Cloud Calendars vs Google Calendar iOS',
    description:
      'Compare Cloud Calendars and the official Google Calendar iPhone app across iCloud & Outlook sync, hourly WeatherKit forecasts, 12-month Year view, and Google Tasks.',
    lede: 'The official Google Calendar iPhone app is free, ad-free, and ideal when your entire workflow lives inside Google—offering native Google Tasks, Gmail flight imports, working locations, and Workspace room booking. Cloud Calendars is built for iPhone and iPad users who combine Google Calendar with Apple iCloud or Microsoft Outlook, adding a 12-month Year view, side-by-side multi-calendar columns, Apple WeatherKit hourly forecasts, and date+weather Home Screen widgets. Arte Soft develops Cloud Calendars and publishes this comparison.',
    comparison: {
      heading: 'Feature-by-Feature Comparison Matrix',
      caption: 'Cloud Calendars vs official Google Calendar app on iPhone and iPad',
      columns: ['Capability', 'Cloud Calendars', 'Google Calendar App (iOS)'],
      rows: [
        {
          cells: [
            'Available views',
            'Day, Week, Month, 12-month Year, List & Multi-calendar side-by-side column view',
            'Schedule (Agenda), Day, 3-Day, Week & Month views (no dedicated 12-month Year view)',
          ],
        },
        {
          cells: [
            'Google Calendar & Meet',
            'Sign in with Google OAuth + Google Meet links included in Free plan',
            'First-party Google sync, Google Meet, Gmail auto-events & Workspace room picker',
          ],
        },
        {
          cells: [
            'iCloud & device calendars',
            'Full read/write on writable iCloud & local calendars via iOS EventKit permissions',
            'Displays local calendars read-only for local creation or switches profiles with non-Google limits',
          ],
        },
        {
          cells: [
            'Weather inside timeline',
            'Hourly WeatherKit temp, wind, UV & rain beside Day/Week grid + 10-day Weather Hub',
            'No built-in hourly weather forecast grid or weather hub in the iOS app',
          ],
        },
        {
          cells: [
            'Tasks & Focus Time',
            'Focused on calendar appointments, drag/resize editing & dual event alerts',
            'Native Google Tasks creation/completion plus Workspace Out of Office & Working Location',
          ],
        },
        {
          cells: [
            'Home Screen & Lock Screen',
            '3 widget sizes (date+weather, upcoming timed events) + Lock Screen Live Activity',
            'Up Next and Month Home Screen/Lock Screen widgets (no weather widget or Live Activity)',
          ],
        },
        {
          cells: [
            'Account-free local mode',
            'Create and manage on-device local calendars without signing into any cloud account',
            'Requires signing in with a Google Account to use the app',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'Multi-Ecosystem Sync vs Google-First Design',
        body: [
          'Google Calendar on iPhone centers on your Google Account. While it can pull events from local device calendars for viewing, local iPhone calendars cannot be selected as the native destination when creating events inside Google’s app, and Google Workspace features do not extend to iCloud or Exchange.',
          'Cloud Calendars treats iCloud, Google Calendar, local calendars, and (with Premium) Microsoft Calendar as equal sources on one iOS grid. You can view a partner’s shared iCloud calendar in column one, your personal Gmail in column two, and your Microsoft 365 schedule in column three while choosing the exact owning destination calendar on every new event.',
        ],
        table: {
          heading: 'Account Sync, Protocol & Platform Support',
          caption: 'How Cloud Calendars and Google Calendar on iPhone handle cross-provider accounts',
          columns: ['Provider / Dimension', 'Cloud Calendars', 'Google Calendar App (iOS)'],
          rows: [
            {
              cells: [
                'Google Calendar',
                'Native Sign in with Google OAuth + Google Meet links (included in Free)',
                'First-party native sync across personal Gmail and Google Workspace accounts',
              ],
            },
            {
              cells: [
                'Microsoft 365 / Outlook',
                'Direct Sign in with Microsoft OAuth + Teams links (Premium) or via iOS Exchange',
                'Limited non-Google display; no native Microsoft Teams link generator',
              ],
            },
            {
              cells: [
                'Apple iCloud & CalDAV',
                'Full two-way read/write on writable iCloud & CalDAV accounts configured in iOS',
                'Local device display restrictions; public iCloud URL subscriptions are one-way & delayed',
              ],
            },
            {
              cells: [
                'ICS URL Subscriptions',
                'Reads subscribed ICS feeds configured directly in iPhone Settings',
                'Subscribes via Google Calendar desktop web ("From URL"); mobile cannot add new URLs',
              ],
            },
            {
              cells: [
                'Supported Platforms',
                'iPhone & iPad (iOS / iPadOS 18.0+)',
                'iPhone, iPad, Apple Watch, Android & full desktop Web app',
              ],
            },
            {
              cells: [
                'Offline & Privacy Model',
                'Supports offline local calendars without sign-in; Google sync mirrors locally in iOS store',
                'Cloud-first tied to Google Account with cached mobile offline window',
              ],
            },
          ],
        },
      },
      {
        heading: 'Pricing and Which App Fits Your Daily Routine',
        body: [
          'Google Calendar is free without ads for personal Gmail accounts (and part of paid Google Workspace tiers for businesses). Cloud Calendars also includes full Google Calendar sync and Google Meet links in its $0 Free plan, with optional Advanced ($0.49/month or $4.99/year) to remove ads and Premium ($4.99/month or $49.99/year) to add Microsoft Calendar and Teams.',
          'You never pay a paywall fee just to sync Google Calendar in Cloud Calendars; you only upgrade if you prefer an ad-free screen or also connect Microsoft 365.',
        ],
        table: {
          heading: 'Pricing & Best Choice by User Scenario',
          caption: 'Scenario recommendations for Gmail, Google Workspace, and multi-account iPhone users',
          columns: ['User Scenario', 'Cloud Calendars', 'Google Calendar App', 'Recommended Choice'],
          rows: [
            {
              cells: [
                '100% Google user who wants zero ads at $0',
                'Free tier includes Google sync & Meet (ad-supported; $4.99/yr ad-free)',
                '$0 with zero ads for personal Google accounts',
                'Google Calendar App',
              ],
            },
            {
              cells: [
                'Google Tasks, Working Location & Workspace Rooms',
                'Events, alerts & location text only (no Google Tasks or room picker)',
                'Built-in Tasks, Out of Office, Focus Time & Workspace Rooms',
                'Google Calendar App',
              ],
            },
            {
              cells: [
                'Personal Google Calendar + family iCloud Calendar on iPhone',
                'Two-way editing on both iCloud & Google side-by-side (Free or $4.99/yr)',
                'Restricted local iCloud writing; URL workarounds are read-only',
                'Cloud Calendars',
              ],
            },
            {
              cells: [
                'Google Calendar + Work Microsoft 365 + Teams links',
                'Premium ($49.99/yr) combines Google, iCloud & Microsoft + Meet & Teams',
                'No native Microsoft Teams link generator',
                'Cloud Calendars Premium',
              ],
            },
            {
              cells: [
                'Planning commutes, outdoor sports & trips around weather',
                'Apple WeatherKit hourly/10-day forecast in grid + weather widgets',
                'Requires opening a separate weather app',
                'Cloud Calendars',
              ],
            },
            {
              cells: [
                'Subscribing to an .ics feed on iPhone without a computer',
                'Add subscription in iPhone Settings and view immediately',
                'Requires desktop browser to add a new URL calendar',
                'Cloud Calendars + iOS Settings',
              ],
            },
          ],
        },
      },
      {
        heading: 'Keeping Secondary and Shared Google Calendars Visible',
        body: [
          'In Cloud Calendars, Sign in with Google exposes your primary and shared secondary Google calendars directly inside the calendar selector—simply check the calendars you want visible on your timeline and widgets.',
          'Keep in mind that Google’s server-side sharing permissions ("See only free/busy" vs "Make changes to events") govern every connected app; neither client can edit a read-only shared calendar.',
        ],
      },
      {
        heading: 'Year Overview, Side-by-Side Columns, and Widget Choices',
        body: [
          'Cloud Calendars adds two high-level spatial views missing in Google’s iOS app: a 12-month Year overview for scanning busy seasons and a Multi-calendar column Day view that separates overlapping accounts cleanly.',
          'On the Home Screen, you can pair date-and-weather tiles with upcoming timed-appointment lists and a Lock Screen Live Activity countdown.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Sign in with Google in Cloud Calendars and select your primary and shared secondary Google calendars.',
      'Keep the Google Calendar app installed if you regularly manage Google Tasks or Workspace conference rooms.',
      'Create one disposable event with a Google Meet link and verify it on calendar.google.com.',
      'Compare Multi-calendar Day columns with both iCloud and Google calendars enabled.',
      'Turn off duplicate notifications in one of the two apps once you pick your primary mobile view.',
    ],
    faq: [
      {
        q: 'Is Google Calendar sync included free in Cloud Calendars?',
        a: 'Yes. Sign in with Google, Google Calendar sync, Google Meet links, all five views, Apple WeatherKit forecasts, and Home Screen widgets are included in the Free Base plan. Advanced ($4.99/year) only removes ads.',
      },
      {
        q: 'Does Cloud Calendars sync Google Tasks?',
        a: 'No. Cloud Calendars focuses on calendar events and alerts rather than Google Tasks checklists.',
      },
      {
        q: 'Can I edit both iCloud and Google Calendar events in Cloud Calendars?',
        a: 'Yes, on any calendar where your iCloud or Google account has write access. Always confirm the selected destination calendar before saving.',
      },
    ],
    sourcesHeading: 'Official Google Calendar and Cloud Calendars documentation',
    sources: [
      { label: 'Google: Get started with Google Calendar on iPhone & iPad', url: 'https://support.google.com/calendar/answer/6596?hl=en&co=GENIE.Platform%3DiOS' },
      { label: 'Google: Share your calendar and manage permissions', url: 'https://support.google.com/calendar/answer/37082?hl=en' },
      { label: 'Google: Subscribe to a calendar URL on desktop', url: 'https://support.google.com/calendar/answer/37100?hl=en' },
      { label: 'Cloud Calendars on the App Store', url: 'https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319' },
    ],
    relatedComparisons: [
      { slug: 'cloud-calendars-vs-apple-calendar', label: 'Cloud Calendars vs Apple Calendar' },
      { slug: 'shared-icloud-calendar-vs-shared-google-calendar-families', label: 'Shared iCloud vs Shared Google Calendar for Families' },
      { slug: 'merge-icloud-google-outlook-exchange-calendars-iphone', label: 'Merge iCloud, Google & Outlook on iPhone' },
    ],
    seeAlso: [
      'free-google-sync-without-adverts',
      'who-can-see-what-in-google-calendar',
      'google-calendars-that-never-reach-your-iphone',
      'can-others-see-google-calendar-tasks',
    ],
  },

  'cloud-calendars-vs-fantastical': {
    updated: '2026-11-04',
    seoTitle: 'Cloud Calendars vs Fantastical on iPhone & iPad',
    title: 'Cloud Calendars vs Fantastical on iPhone & iPad',
    short: 'Cloud Calendars vs Fantastical',
    description:
      'Compare Cloud Calendars and Fantastical on iOS across Google, iCloud & Outlook sync, Apple WeatherKit forecasts, natural-language entry, desktop apps, and pricing.',
    lede: 'Cloud Calendars is the stronger value when you plan on iPhone and iPad and want iCloud plus Google Calendar sync, five views, Apple WeatherKit hourly/10-day forecasts, and Home Screen widgets in the free tier (with ad-free Advanced at $4.99/year and Microsoft Outlook/Teams in Premium at $49.99/year). Fantastical (Flexibits Premium, ~$56.99/year individual) is the better choice when you rely on natural-language sentence parsing, Openings booking links, Apple Watch/Mac/Windows apps, or integrated task lists. Arte Soft develops Cloud Calendars and publishes this comparison.',
    comparison: {
      heading: 'Feature-by-Feature Comparison Matrix',
      caption: 'Cloud Calendars vs Fantastical core workflow and feature comparison on iOS',
      columns: ['Capability', 'Cloud Calendars', 'Fantastical (Flexibits)'],
      rows: [
        {
          cells: [
            'Core calendar views',
            'Day, Week (portrait & landscape), Month, Year, List & Multi-calendar column view (all Free)',
            'DayTicker, Day, Week, Month, Quarter, Year & full-screen views (full sets in Premium)',
          ],
        },
        {
          cells: [
            'In-calendar weather',
            'Full Apple WeatherKit hub + hourly & up-to-10-day forecast in grid (Free)',
            'AccuWeather forecast integration (3-day basic free; 10-day/hourly in Flexibits Premium)',
          ],
        },
        {
          cells: [
            'Event entry workflow',
            'Structured form, tap forecast hour to draft, drag to reschedule & timeline resize',
            'Natural-language sentence parser (with slash calendar syntax), editor & templates',
          ],
        },
        {
          cells: [
            'Video conferencing links',
            'Google Meet (Free) and Microsoft Teams (Premium)',
            'Google Meet, Microsoft Teams, Zoom, Webex & GoToMeeting (auto-links in Premium)',
          ],
        },
        {
          cells: [
            'Booking links & polls',
            'Single-event & calendar sharing (Reader/Writer/Owner, App Clip preview); no slot-booking page',
            'Openings booking links and RSVP meeting polls included in Flexibits Premium',
          ],
        },
        {
          cells: [
            'Tasks & checklists',
            'Focused on calendar events, alerts & second alerts; no integrated task checklists',
            'Integrated Apple Reminders, Google Tasks & Microsoft To Do alongside events',
          ],
        },
        {
          cells: [
            'Widgets & Lock Screen',
            '3 Home Screen widget sizes (date+weather, timed events) + Lock Screen Live Activity (Free)',
            'Customizable Home/Lock Screen widgets & Calendar Sets (advanced widget options in Premium)',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'Account Sync, Protocols, and Platform Coverage',
        body: [
          'Start by checking every screen where you manage your calendar. Cloud Calendars is built specifically for iPhone and iPad (iOS/iPadOS 18.0+), reading iCloud, CalDAV, and subscribed ICS feeds through Apple’s iOS Calendar Accounts while providing direct Sign in with Google (Free) and Sign in with Microsoft (Premium).',
          'Fantastical spans iPhone, iPad, Mac, Apple Watch, Apple Vision Pro, and Windows via a Flexibits Account or direct CalDAV/OAuth connections. If desktop Mac/Windows apps and Watch complications are non-negotiable, Fantastical covers every platform; if your mobile planning happens on iPhone and iPad, Cloud Calendars avoids paying for desktop seats you do not use.',
        ],
        table: {
          heading: 'Account Sync, Protocol & Platform Support',
          caption: 'Supported calendar providers, sync protocols, platforms, and storage behavior',
          columns: ['Provider / Dimension', 'Cloud Calendars', 'Fantastical'],
          rows: [
            {
              cells: [
                'Google Calendar',
                'Native Sign in with Google OAuth + Google Meet links in Free tier',
                'Direct Google OAuth connection or via iOS system calendar accounts',
              ],
            },
            {
              cells: [
                'Microsoft 365 / Outlook / Exchange',
                'Sign in with Microsoft OAuth + Teams in Premium (or via iOS Exchange)',
                'Direct Microsoft 365 / Exchange connection (full multi-account Sets in Premium)',
              ],
            },
            {
              cells: [
                'Apple iCloud & CalDAV',
                'Supported via iPhone/iPad Calendar Accounts (EventKit full access); Free',
                'Direct iCloud/CalDAV connection or via system Calendar Accounts on Apple devices',
              ],
            },
            {
              cells: [
                'ICS URL Subscriptions',
                'Displays read-only ICS feeds subscribed in iOS Settings',
                'Supports ICS feed subscriptions directly or via Flexibits/iOS sync',
              ],
            },
            {
              cells: [
                'Supported Platforms',
                'iPhone & iPad (iOS / iPadOS 18.0+)',
                'iPhone, iPad, Mac, Apple Watch, Apple Vision Pro & Windows',
              ],
            },
            {
              cells: [
                'Offline & Privacy Model',
                'Local calendars need no account; connected Google/Microsoft mirror in iOS store',
                'Optional Flexibits Account cloud sync for sets/openings + local cache',
              ],
            },
          ],
        },
      },
      {
        heading: 'Pricing Tiers and Best Choice by User Scenario',
        body: [
          'For Google Calendar and iCloud users on iOS, the annual cost gap is substantial. Cloud Calendars includes all five views, multi-calendar columns, Google sync, Meet links, the full WeatherKit hub, and widgets for $0, removes ads for $0.49/month ($4.99/year) in Advanced, and adds Microsoft Calendar + Teams for $4.99/month ($49.99/year) in Premium (US App Store figures; check local pricing).',
          'Fantastical’s free tier handles basic calendar reading, while Flexibits Premium (~$56.99/year individual or ~$89.99/year family of five) unlocks full Calendar Sets, extended 10-day weather, Openings links, templates, and Cardhop.',
        ],
        table: {
          heading: 'Pricing & Best Choice by User Scenario',
          caption: 'Subscription tiers (US reference pricing) and recommended app by daily scenario',
          columns: ['Scenario or Plan Tier', 'Cloud Calendars', 'Fantastical', 'Recommended Choice'],
          rows: [
            {
              cells: [
                'Free tier scope',
                '$0 — All 5 views, iCloud + Google sync, 10-day WeatherKit, widgets & Meet',
                '$0 — Basic calendar reading, manual entry & 3-day weather',
                'Cloud Calendars',
              ],
            },
            {
              cells: [
                'Ad-free Google + iCloud + full weather on iOS',
                'Advanced: $0.49/mo or $4.99/yr',
                'Flexibits Premium: ~$56.99/yr',
                'Cloud Calendars Advanced',
              ],
            },
            {
              cells: [
                'Work Microsoft 365 + personal Google/iCloud on iOS',
                'Premium: $4.99/mo or $49.99/yr',
                'Flexibits Premium: ~$56.99/yr',
                'Cloud Calendars (iOS) / Fantastical (if Mac needed)',
              ],
            },
            {
              cells: [
                'Typing sentences like "Lunch Fri 1pm /Personal"',
                'Structured editor, drag/resize & tap-forecast-hour draft',
                'Natural-language parser with slash calendar & alert syntax',
                'Fantastical',
              ],
            },
            {
              cells: [
                'Side-by-side per-calendar columns + WeatherKit wind/UV',
                'Multi-calendar column view + full Apple WeatherKit hub',
                'Combined timeline with Calendar Sets + AccuWeather',
                'Cloud Calendars',
              ],
            },
            {
              cells: [
                'Client booking links + Mac, Windows & Watch apps',
                'iPhone & iPad only; event sharing rather than slot booking',
                'Includes Openings links, polls, Mac, Windows & Watch',
                'Fantastical',
              ],
            },
          ],
        },
      },
      {
        heading: 'Weather-Driven Visual Grids vs Sentence Parsing',
        body: [
          'Fantastical shines when typing speed is your main bottleneck: entering recurring cross-time-zone meetings with a single sentence and reusable templates saves taps every day.',
          'Cloud Calendars shines when visual clarity and outdoor conditions shape your day: hourly temperature and weather icons sit directly inside the Day grid, tapping a forecast hour opens an event draft, and Multi-calendar Day view gives each calendar its own vertical column.',
        ],
      },
      {
        heading: 'Testing Safely Without Disrupting Existing Calendars',
        body: [
          'Because both apps connect to your underlying iCloud, Google, or Microsoft accounts, testing one alongside the other never requires migrating events. Read-only shared feeds stay read-only in both apps.',
          'Verify one disposable solo appointment on a writable calendar before canceling an existing subscription, and manage renewals through Settings > [Your Name] > Subscriptions.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Confirm whether you need iPhone/iPad only or also native Mac, Windows, and Apple Watch apps.',
      'Test Google + iCloud + WeatherKit in Cloud Calendars Free ($0) or ad-free Advanced ($4.99/yr).',
      'Compare typing natural-language sentences in Fantastical against tapping forecast hours and dragging blocks in Cloud Calendars.',
      'Verify one disposable appointment reaches your provider account cleanly.',
      'Check local App Store subscription terms before switching annual plans.',
    ],
    faq: [
      {
        q: 'How much cheaper is Cloud Calendars than Fantastical for Google and iCloud?',
        a: 'Cloud Calendars includes Google Calendar sync, iCloud access, all 5 views, WeatherKit forecasts, and widgets for $0, or $4.99/year ad-free on Advanced—saving over $50/year compared with Flexibits Premium (~$56.99/year) if you do not need Fantastical’s desktop or parser features.',
      },
      {
        q: 'Does Cloud Calendars parse natural-language sentences?',
        a: 'No. Cloud Calendars uses structured fields, drag-and-resize timeline gestures, and one-tap drafting from forecast hours.',
      },
      {
        q: 'Does Cloud Calendars have a Mac or Apple Watch app like Fantastical?',
        a: 'No. Cloud Calendars is built for iPhone and iPad (iOS/iPadOS 18+). Choose Fantastical if native macOS, Windows, or watchOS apps are essential.',
      },
    ],
    sourcesHeading: 'Official product and pricing documentation',
    sources: [
      { label: 'Cloud Calendars on the App Store', url: 'https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319' },
      { label: 'Flexibits: Fantastical features and platforms', url: 'https://flexibits.com/fantastical' },
      { label: 'Flexibits: Fantastical iOS getting started', url: 'https://flexibits.com/fantastical-ios/help/getting-started' },
      { label: 'Flexibits: Flexibits Premium pricing', url: 'https://flexibits.com/pricing' },
    ],
    relatedComparisons: [
      { slug: 'fantastical-alternatives-cheaper-iphone-mac', label: 'Best Cheaper Fantastical Alternatives' },
      { slug: 'cloud-calendars-vs-busycal-ios-mac', label: 'Cloud Calendars vs BusyCal' },
      { slug: 'natural-language-event-entry-calendar-apps-compared', label: 'Natural-Language Event Entry Apps Compared' },
    ],
    seeAlso: [
      'what-fantastical-costs-and-what-this-does',
      'fantastical-readdle-calendar366-iphone-comparison',
      'natural-language-calendar-events-iphone',
      'what-a-subscription-actually-buys',
    ],
  },

  'cloud-calendars-vs-microsoft-outlook-mobile': {
    updated: '2026-11-04',
    seoTitle: 'Cloud Calendars vs Microsoft Outlook Mobile Calendar',
    title: 'Cloud Calendars vs Microsoft Outlook Mobile Calendar',
    short: 'Cloud Calendars vs Outlook Mobile',
    description:
      'Compare Cloud Calendars and Microsoft Outlook Mobile on iPhone and iPad across Exchange/Microsoft 365 MDM rules, Google & iCloud sync, WeatherKit forecasts, and widgets.',
    lede: 'Microsoft Outlook Mobile is essential when your employer enforces Microsoft Intune app-protection policies or when you need corporate email, Room Finder, and colleague Scheduling Assistant inside one container. Cloud Calendars (with Premium for Microsoft Calendar and Teams) is built for iPhone and iPad users who want a calm, email-free 5-view planner combining work Microsoft schedules, personal Google/iCloud calendars, side-by-side columns, and hourly Apple WeatherKit forecasts. Arte Soft develops Cloud Calendars and publishes this comparison.',
    comparison: {
      heading: 'Feature-by-Feature Comparison Matrix',
      caption: 'Cloud Calendars vs Microsoft Outlook Mobile calendar capabilities on iOS',
      columns: ['Capability', 'Cloud Calendars (with Premium)', 'Microsoft Outlook Mobile (iOS)'],
      rows: [
        {
          cells: [
            'Primary focus',
            'Dedicated calendar + WeatherKit station (zero email inbox clutter)',
            'Combined corporate email inbox, calendar, contacts & files app',
          ],
        },
        {
          cells: [
            'Calendar views on iOS',
            'Day, Week (portrait & landscape), Month, 12-month Year, List & Multi-calendar columns',
            'Agenda, Day, 3-Day & Month views (Week in landscape; no 12-month Year view)',
          ],
        },
        {
          cells: [
            'Microsoft Teams & Meet',
            'Microsoft Teams (Premium) + Google Meet (Free) links on events',
            'Native Microsoft Teams toggle (plus org-deployed Zoom/Webex add-ins)',
          ],
        },
        {
          cells: [
            'Enterprise scheduling tools',
            'Views & edits permitted Microsoft calendars; no Room Finder or Scheduling Assistant',
            'Built-in Scheduling Assistant, Room Finder, shared mailboxes & delegate access',
          ],
        },
        {
          cells: [
            'Weather integration',
            'Full Apple WeatherKit hub + hourly temp, wind/gusts, UV & rain beside timeline',
            'Minimal daily weather icon; no hourly forecast grid or 10-day weather hub',
          ],
        },
        {
          cells: [
            'Widgets & Live Activity',
            'Date+weather widgets, timed event list widgets & Lock Screen Live Activity',
            'Calendar Up Next & email widgets (often restricted on MDM-managed work profiles)',
          ],
        },
        {
          cells: [
            'Timeline drag & resize',
            'Drag to reschedule across hours/days and resize duration with recurrence check',
            'Drag-and-drop time adjustments in Day/3-Day grid plus Propose New Time RSVP',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'Enterprise MDM Policies, Microsoft Cloud Relay, and Device Storage',
        body: [
          'Check your employer’s IT policy first: organizations using Microsoft Intune MAM or Entra Conditional Access frequently restrict external OAuth apps so corporate data remains inside Outlook Mobile. No third-party subscription—including Cloud Calendars Premium—can override an enterprise administrator’s block.',
          'Also note how personal accounts work inside Outlook Mobile: Microsoft documents syncing added Gmail and iCloud accounts via the Microsoft Cloud (requiring an Apple app-specific password for iCloud). Cloud Calendars reads iCloud directly from Apple’s on-device EventKit store without an app password and pairs permitted Google and Microsoft connections in mirrored iOS calendars.',
        ],
        table: {
          heading: 'Account Sync, Protocol & Platform Support',
          caption: 'Microsoft, Google, and iCloud connection architecture across both iOS apps',
          columns: ['Provider / Dimension', 'Cloud Calendars', 'Microsoft Outlook Mobile'],
          rows: [
            {
              cells: [
                'Microsoft 365 / Exchange / Outlook.com',
                'Sign in with Microsoft OAuth in Premium (or via iOS Exchange where permitted)',
                'First-party Microsoft sync supporting Intune MAM, Conditional Access & shared mailboxes',
              ],
            },
            {
              cells: [
                'Google Calendar',
                'Native Sign in with Google OAuth + Google Meet links in Free tier',
                'Supported as an added account synced through Microsoft Cloud',
              ],
            },
            {
              cells: [
                'Apple iCloud & CalDAV',
                'Reads/writes iCloud & CalDAV directly via iOS Calendar Accounts (no app password)',
                'iCloud requires Apple app-specific password; custom CalDAV not native',
              ],
            },
            {
              cells: [
                'ICS URL Subscriptions',
                'Displays iOS subscribed ICS calendars as read-only feeds',
                'Subscribed through Outlook on the web / Outlook.com',
              ],
            },
            {
              cells: [
                'Supported Platforms',
                'iPhone & iPad (iOS / iPadOS 18.0+)',
                'iPhone, iPad, Apple Watch, Android, Mac, Windows & Web',
              ],
            },
            {
              cells: [
                'Storage & Privacy Model',
                'On-device local calendars + mirrored provider calendars in iOS store',
                'Enterprise MAM container for M365; personal accounts route via Microsoft Cloud',
              ],
            },
          ],
        },
      },
      {
        heading: 'Pricing and Pairing Both Apps Smartly',
        body: [
          'Outlook Mobile is free to download (included with work Microsoft 365 seats; free personal Outlook.com accounts can show inbox ads). Cloud Calendars places Microsoft Calendar and Microsoft Teams support in Premium ($4.99/month or $49.99/year in the US App Store, which also removes ads and includes Google/iCloud/WeatherKit).',
          'Many professionals keep Outlook Mobile for work email, Room Finder, and colleague availability while using Cloud Calendars as their daily visual dashboard for work + family + weather.',
        ],
        table: {
          heading: 'Pricing & Best Choice by User Scenario',
          caption: 'When to use Outlook Mobile, Cloud Calendars Premium, or both',
          columns: ['User Scenario', 'Cloud Calendars', 'Outlook Mobile', 'Recommended Choice'],
          rows: [
            {
              cells: [
                'Employer mandates Intune MAM / blocks external OAuth',
                'Cannot bypass enterprise admin blocks',
                'IT-approved enterprise mobile container',
                'Outlook Mobile',
              ],
            },
            {
              cells: [
                'Booking conference rooms & checking 8 coworkers’ free/busy',
                'No Room Finder or Scheduling Assistant',
                'Native Room Finder, Scheduling Assistant & delegates',
                'Outlook Mobile',
              ],
            },
            {
              cells: [
                'Reviewing your week on Sunday without seeing work email',
                'Dedicated calendar + WeatherKit app; zero email badges',
                'Lives one tap beside unread corporate inbox',
                'Cloud Calendars',
              ],
            },
            {
              cells: [
                'Side-by-side columns for Work M365 + Personal iCloud + Gmail',
                'Multi-calendar columns + EventKit iCloud ($49.99/yr Premium)',
                'Stacked overlay; iCloud needs app-specific password',
                'Cloud Calendars Premium',
              ],
            },
            {
              cells: [
                'Commute & client site visits planned around hourly weather',
                'Hourly WeatherKit temps, wind, UV & rain beside meetings',
                'Minimal daily icon only',
                'Cloud Calendars',
              ],
            },
            {
              cells: [
                'Personal Google + iCloud only (no Microsoft account)',
                '$0 Free or $4.99/yr Advanced (ad-free)',
                'Routes non-Microsoft accounts via Microsoft Cloud',
                'Cloud Calendars Free / Advanced',
              ],
            },
          ],
        },
      },
      {
        heading: 'Keeping Work Commitments Visible Without Inbox Burnout',
        body: [
          'Opening an email-plus-calendar app on a weekend afternoon just to check Monday’s first meeting time pulls your attention straight into unread threads. Separating your calendar viewer from your email client keeps schedule awareness calm and intentional.',
          'Displaying your Microsoft work calendar alongside personal Google and iCloud calendars in Cloud Calendars never shares personal event details with your employer—each calendar stays inside its own account.',
        ],
      },
      {
        heading: 'Verifying Tenant Permissions Safely',
        body: [
          'Test your Microsoft sign-in before relying on mobile edits. If Entra ID asks for admin approval, check with IT rather than creating duplicate workarounds.',
          'Verify write-back using a solo 15-minute private appointment on your own calendar so no invited colleagues receive test notifications.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Confirm whether your organization allows Microsoft OAuth or iOS Exchange calendar connections.',
      'Keep Outlook Mobile installed for Room Finder, Scheduling Assistant, and shared mailboxes.',
      'Connect Sign in with Microsoft (Premium) alongside personal Google and iCloud in Cloud Calendars.',
      'Use Multi-calendar Day columns to inspect work and personal commitments side by side.',
      'Test one solo private appointment on Outlook Web to confirm two-way synchronization.',
    ],
    faq: [
      {
        q: 'Which Cloud Calendars plan includes Microsoft Outlook and Teams?',
        a: 'Cloud Calendars Premium ($4.99/month or $49.99/year in the US App Store) includes Microsoft Calendar sync, Microsoft Teams links, ad removal, and all Base features.',
      },
      {
        q: 'Does Cloud Calendars Premium override corporate Intune or Exchange blocks?',
        a: 'No. Organization administrators control external OAuth consent and MDM rules; an app subscription cannot bypass workplace security policies.',
      },
      {
        q: 'Can my employer see my personal iCloud events if I view them next to Outlook in Cloud Calendars?',
        a: 'No. Combined viewing happens locally on your iPhone/iPad and never copies personal appointments into your work mailbox.',
      },
    ],
    sourcesHeading: 'Official Microsoft and Cloud Calendars documentation',
    sources: [
      { label: 'Microsoft: Set up Outlook for iOS mobile app', url: 'https://support.microsoft.com/en-us/office/set-up-email-in-outlook-for-ios-mobile-app-b2de2161-cc1d-49ef-9ef9-81acd1c8e234' },
      { label: 'Microsoft: Scheduling Assistant and Room Finder in Outlook', url: 'https://support.microsoft.com/en-us/outlook/use-the-scheduling-assistant-and-room-finder-for-meetings-in-outlook' },
      { label: 'Microsoft Learn: Outlook calendar API overview', url: 'https://learn.microsoft.com/en-us/graph/outlook-calendar-concept-overview' },
      { label: 'Cloud Calendars on the App Store', url: 'https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319' },
    ],
    relatedComparisons: [
      { slug: 'work-exchange-microsoft-365-and-personal-icloud-iphone', label: 'Work Exchange / M365 + Personal iCloud on iPhone' },
      { slug: 'merge-icloud-google-outlook-exchange-calendars-iphone', label: 'Merge iCloud, Google & Outlook on iPhone' },
      { slug: 'privacy-first-direct-sync-vs-cloud-relay-calendar-apps', label: 'Direct Sync vs Cloud-Relay Privacy on iOS' },
    ],
    seeAlso: [
      'exchange-calendars-on-an-iphone',
      'work-and-personal-without-two-apps',
      'calendar-event-or-room-reservation',
      'what-a-subscription-actually-buys',
    ],
  },

  'cloud-calendars-vs-calendars-by-readdle': {
    updated: '2026-11-04',
    seoTitle: 'Cloud Calendars vs Calendars by Readdle on iOS',
    title: 'Cloud Calendars vs Calendars by Readdle on iOS',
    short: 'Cloud Calendars vs Calendars by Readdle',
    description:
      'Compare Cloud Calendars and Calendars by Readdle across Google Tasks/Reminders time-blocking, Apple WeatherKit forecasts, multi-account views, Mac/Watch apps, and pricing.',
    lede: 'Calendars by Readdle is built for task-centric time-blockers who want to drag iOS Reminders or Google Tasks onto an hourly grid, track recurring habits, and sync across iPhone, iPad, Mac, and Apple Watch under Calendars PRO (~$19.99/year). Cloud Calendars is built for people who keep checklists separate and want a cleaner, weather-first iPhone and iPad calendar—including Google Calendar sync, iCloud access, side-by-side multi-calendar columns, and a full Apple WeatherKit hub in its $0 Free plan ($4.99/year ad-free). Arte Soft develops Cloud Calendars and publishes this comparison.',
    comparison: {
      heading: 'Feature-by-Feature Comparison Matrix',
      caption: 'Cloud Calendars vs Calendars by Readdle across views, tasks, weather, and sharing',
      columns: ['Capability', 'Cloud Calendars', 'Calendars by Readdle'],
      rows: [
        {
          cells: [
            'Core calendar views',
            'Day, Week (portrait & landscape), Month, Year, List & Multi-calendar per-source columns',
            'Day, Week, Month, Year, List Agenda & pull-out Tasks/Planner sidebar',
          ],
        },
        {
          cells: [
            'Tasks & habit tracking',
            'Events & dual alerts only (no Google Tasks, Reminders, or habit checklists)',
            'Drag-and-drop Google Tasks or iOS Reminders onto timeline + recurring routines/habits (PRO)',
          ],
        },
        {
          cells: [
            'Weather integration',
            'Full Apple WeatherKit hub (hourly, 10-day, wind/gusts, UV, rain) + tap hour to draft (Free)',
            'Optional weather icons in PRO planner settings; no full 10-day meteorological hub',
          ],
        },
        {
          cells: [
            'Event entry shortcuts',
            'Structured form, drag/resize on grid & one-tap forecast-hour draft',
            'Natural-language phrase input (PRO), task drag-blocking & structured form',
          ],
        },
        {
          cells: [
            'Conferencing links',
            'Google Meet (Free) and Microsoft Teams (Premium)',
            'Google Meet, Zoom & Microsoft Teams links (unlocked with multi-account PRO)',
          ],
        },
        {
          cells: [
            'Widgets & Live Activity',
            '3 Home Screen widget sizes (date+weather, timed events) + Lock Screen Live Activity',
            'Agenda, Month & task Home/Lock Screen widgets + Apple Watch app',
          ],
        },
        {
          cells: [
            'Single-event & calendar sharing',
            'Provider invites + Cloud Calendars link/QR/email sharing & iPhone App Clip preview',
            'Standard Google, Outlook & iCloud attendee invitations',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'Account Sync, Task Backends, and Apple Hardware Support',
        body: [
          'Readdle’s Calendars app connects directly to Google, Outlook, and iCloud calendars and lets you pick iOS Reminders or Google Tasks inside Task Options so checking off an item on your timeline updates the original task list. It also ships native macOS and Apple Watch apps.',
          'Cloud Calendars targets iPhone and iPad (iOS/iPadOS 18.0+) exclusively, combining iOS EventKit access (for iCloud, CalDAV, and ICS feeds without app-specific passwords) with direct Sign in with Google (Free) and Sign in with Microsoft (Premium).',
        ],
        table: {
          heading: 'Account Sync, Protocol & Platform Support',
          caption: 'Supported calendar providers, task connections, and devices',
          columns: ['Provider / Dimension', 'Cloud Calendars', 'Calendars by Readdle'],
          rows: [
            {
              cells: [
                'Google Calendar',
                'Sign in with Google OAuth + Meet links in Free tier',
                'Direct Google Calendar + Google Tasks sync (multiple accounts in PRO)',
              ],
            },
            {
              cells: [
                'Microsoft 365 / Outlook',
                'Sign in with Microsoft OAuth + Teams (Premium) or iOS Exchange',
                'Direct Outlook / Exchange connection (PRO for unlimited accounts)',
              ],
            },
            {
              cells: [
                'Apple iCloud & CalDAV',
                'Via iPhone/iPad Calendar Accounts (EventKit permission); Free',
                'Local/iOS calendars & direct iCloud sync',
              ],
            },
            {
              cells: [
                'ICS URL Subscriptions',
                'Reads subscribed ICS feeds configured in iOS Settings',
                'Reads subscribed calendars via iOS or connected accounts',
              ],
            },
            {
              cells: [
                'Supported Platforms',
                'iPhone & iPad (iOS / iPadOS 18.0+)',
                'iPhone, iPad, Mac & Apple Watch',
              ],
            },
            {
              cells: [
                'Offline & Local Mode',
                'Zero-account local calendars + mirrored offline iOS store records',
                'Local calendar support + offline cache of synced accounts',
              ],
            },
          ],
        },
      },
      {
        heading: 'Pricing Comparison and Best Choice by Workflow',
        body: [
          'If you combine Google Calendar and iCloud on iPhone/iPad without needing task lists or a Mac app, Cloud Calendars includes every view and the full WeatherKit hub at $0 (with ads) or $4.99/year on Advanced (no ads). Adding Microsoft Outlook/Teams moves you to Cloud Calendars Premium ($49.99/year).',
          'Calendars by Readdle offers a free base download and unlocks unlimited accounts, natural-language entry, Planner task dragging, conferencing, and Mac/Watch access via Calendars PRO (~$19.99/year or a ~$59.99 lifetime purchase, varying by region and legacy purchase history).',
        ],
        table: {
          heading: 'Pricing & Best Choice by User Scenario',
          caption: 'Reference US pricing and scenario winners between Cloud Calendars and Readdle',
          columns: ['User Scenario', 'Cloud Calendars', 'Calendars by Readdle', 'Recommended Choice'],
          rows: [
            {
              cells: [
                'Google + iCloud + hourly weather on iPhone at lowest cost',
                '$0 Free or $4.99/yr Advanced (ad-free)',
                '~$19.99/yr PRO for full multi-account & weather',
                'Cloud Calendars',
              ],
            },
            {
              cells: [
                'Dragging Google Tasks or Reminders onto free hours',
                'No task list integration',
                'Built-in Planner sidebar with two-way task completion',
                'Calendars by Readdle',
              ],
            },
            {
              cells: [
                'Microsoft Outlook + Google + Mac + Apple Watch under $25/yr',
                '$49.99/yr Premium; iPhone & iPad only',
                'Calendars PRO (~$19.99/yr) includes Outlook, Mac & Watch',
                'Calendars by Readdle',
              ],
            },
            {
              cells: [
                'Side-by-side per-calendar columns + 10-day WeatherKit hub',
                'Dedicated Multi-calendar columns + wind/UV/rain Weather Hub',
                'Single combined timeline + basic forecast icons',
                'Cloud Calendars',
              ],
            },
            {
              cells: [
                'Sharing a single event via link/QR/App Clip without full calendar',
                'Built-in Reader/Writer/Owner event & calendar links',
                'Standard email attendee invitations',
                'Cloud Calendars',
              ],
            },
            {
              cells: [
                'One-time lifetime purchase option',
                'Free tier or monthly/yearly subscriptions',
                'Offers ~$59.99 lifetime purchase alongside annual PRO',
                'Calendars by Readdle',
              ],
            },
          ],
        },
      },
      {
        heading: 'Side-by-Side Columns vs Task-Blocking Sidebar',
        body: [
          'Readdle treats open space on your calendar as slots waiting to be filled from your task backlog. If you practice strict daily time-blocking from Google Tasks or Apple Reminders, that drag-and-drop loop is genuinely cohesive.',
          'If task chips cluttering your calendar stress you out, Cloud Calendars keeps your grid dedicated to real time commitments—giving each calendar its own side-by-side column in Multi-calendar Day view and pairing hours with live WeatherKit forecasts.',
        ],
      },
      {
        heading: 'Checking Current vs Legacy Entitlements Before Switching',
        body: [
          'Readdle’s help documentation covers both legacy paid upgrades and modern Calendars PRO subscriptions, so always verify the exact paywall screen inside the installed app after any 7-day trial.',
          'Test a disposable event (and task, if evaluating Readdle) on your own phone first so you confirm two-way updates before changing daily habits.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Decide whether you want tasks/habits inside your calendar timeline or kept in a separate to-do app.',
      'Compare Cloud Calendars’ Multi-calendar columns and WeatherKit hub against Readdle’s Planner task sidebar.',
      'Check if Mac or Apple Watch apps are required alongside your iPhone and iPad.',
      'Test one disposable event edit on Google or iCloud and confirm it syncs back cleanly.',
      'Review the exact local App Store subscription or lifetime terms before paying.',
    ],
    faq: [
      {
        q: 'Does Cloud Calendars sync Apple Reminders or Google Tasks like Calendars by Readdle?',
        a: 'No. Cloud Calendars focuses strictly on calendar appointments, alerts, multi-calendar columns, and WeatherKit forecasts. Choose Calendars by Readdle if dragging tasks onto your day grid is essential.',
      },
      {
        q: 'Which app is cheaper for combining Google Calendar and iCloud on iPhone?',
        a: 'Cloud Calendars includes Google Calendar sync, iCloud access, all 5 views, weather, and widgets in its $0 Free plan, and removes ads for $4.99/year on Advanced.',
      },
      {
        q: 'Does Cloud Calendars have a Mac app like Calendars by Readdle?',
        a: 'No. Cloud Calendars runs on iPhone and iPad (iOS/iPadOS 18+). Readdle offers a macOS and Apple Watch app under Calendars PRO.',
      },
    ],
    sourcesHeading: 'Official Readdle and Cloud Calendars documentation',
    sources: [
      { label: 'Cloud Calendars on the App Store', url: 'https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319' },
      { label: 'Readdle: Calendars overview, features and FAQ', url: 'https://readdle.com/calendars' },
      { label: 'Readdle Support: Sync tasks with iOS Reminders or Google Tasks', url: 'https://support.readdle.com/calendars/synchronization/how-to-sync-tasks-with-ios-reminders-or-google-tasks' },
    ],
    relatedComparisons: [
      { slug: 'cloud-calendars-vs-busycal-ios-mac', label: 'Cloud Calendars vs BusyCal' },
      { slug: 'cloud-calendars-vs-structured-daily-planner', label: 'Cloud Calendars vs Structured Daily Planner' },
      { slug: 'cloud-calendars-vs-todoist-and-ticktick-calendar-views', label: 'Cloud Calendars vs Todoist & TickTick' },
    ],
    seeAlso: [
      'fantastical-readdle-calendar366-iphone-comparison',
      'iphone-calendar-tasks-reminders-versus-event-alerts',
      'free-google-sync-without-adverts',
      'weather-inside-your-calendar',
    ],
  },

  'cloud-calendars-vs-timepage-moleskine': {
    updated: '2026-11-04',
    seoTitle: 'Cloud Calendars vs Moleskine Timepage on iPhone',
    title: 'Cloud Calendars vs Moleskine Timepage on iPhone',
    short: 'Cloud Calendars vs Moleskine Timepage',
    description:
      'Compare Cloud Calendars and Moleskine Timepage on iOS across built-in weather forecasts, traditional Month/Week grids vs vertical heatmaps, free tier access, and widgets.',
    lede: 'Moleskine Timepage and Cloud Calendars both treat weather as a first-class part of daily planning on iPhone and iPad, yet they approach layout and pricing from opposite angles. Timepage uses a continuous vertical timeline, monthly activity heatmaps, custom color themes, and a paid membership model (standalone or Moleskine Studio bundle), whereas Cloud Calendars provides classic Day, Week, Month, Year, and side-by-side Multi-calendar grids plus a full Apple WeatherKit hub and Google sync in its $0 Free plan ($4.99/year ad-free). Arte Soft develops Cloud Calendars and publishes this comparison.',
    comparison: {
      heading: 'Feature-by-Feature Comparison Matrix',
      caption: 'Cloud Calendars vs Moleskine Timepage design, views, and weather capabilities',
      columns: ['Capability', 'Cloud Calendars', 'Moleskine Timepage'],
      rows: [
        {
          cells: [
            'Visual layout philosophy',
            'Spatial hour grids: Day, Week, Month chips, 12-month Year, List & Multi-calendar columns',
            'Continuous scrolling ribbon timeline + Month density heatmap (minimalist editorial style)',
          ],
        },
        {
          cells: [
            'Weather forecasting',
            'Apple WeatherKit hub (hourly, 10-day, wind/gusts, UV, feels-like, pressure) + tap hour to draft',
            'Hyper-local hourly/daily weather & rain graphs integrated into daily ribbon',
          ],
        },
        {
          cells: [
            'Side-by-side calendar columns',
            'Yes — Multi-calendar Day view gives each calendar its own column',
            'No — blends events into a single continuous typographic stream',
          ],
        },
        {
          cells: [
            'Usable free plan after trial?',
            'Yes — full views, Google sync, iCloud, WeatherKit & widgets stay usable free (with ads)',
            'Paid membership required after trial for ongoing full event editing & creation',
          ],
        },
        {
          cells: [
            'Conferencing links',
            'Google Meet (Free) and Microsoft Teams (Premium)',
            'Displays & joins meeting links; less focused on native Meet/Teams creation',
          ],
        },
        {
          cells: [
            'Companion apps & Watch',
            'iPhone & iPad (with Home Screen widgets & Lock Screen Live Activity)',
            'iPhone, iPad & Apple Watch + integrates with Moleskine Actions & Flow',
          ],
        },
        {
          cells: [
            'Timeline drag & resize',
            'Drag events across hours/days and resize duration directly on the hour grid',
            'Gesture-driven rescheduling along the continuous day/week ribbon',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'Account Sync, Moleskine Ecosystem, and Platform Reach',
        body: [
          'Timepage acts as a design-forward front end over the calendars configured on your Apple device (iCloud, Google, Exchange, Outlook, CalDAV), syncing preferences across iPhone, iPad, and Apple Watch and linking with Moleskine Studio’s separate Actions to-do app.',
          'Cloud Calendars also reads iCloud, CalDAV, and ICS feeds via Apple’s iOS Calendar Accounts while adding direct Sign in with Google OAuth (with Google Meet links in Free) and Sign in with Microsoft OAuth (with Teams links in Premium) on iPhone and iPad.',
        ],
        table: {
          heading: 'Account Sync, Protocol & Platform Support',
          caption: 'Calendar connections and platform support for Cloud Calendars and Timepage',
          columns: ['Provider / Dimension', 'Cloud Calendars', 'Moleskine Timepage'],
          rows: [
            {
              cells: [
                'Google Calendar',
                'Direct Sign in with Google OAuth + Meet links (Free) or via iOS Settings',
                'Connected via iOS Calendar Accounts / Google sync',
              ],
            },
            {
              cells: [
                'Microsoft 365 / Exchange',
                'Sign in with Microsoft OAuth + Teams (Premium) or via iOS Exchange',
                'Connected via iOS Exchange / Outlook calendar accounts',
              ],
            },
            {
              cells: [
                'Apple iCloud & CalDAV',
                'Direct via iOS Calendar Accounts (EventKit permission); Free',
                'Direct via iOS Calendar Accounts (EventKit permission)',
              ],
            },
            {
              cells: [
                'ICS URL Subscriptions',
                'Displays iOS subscribed ICS calendars as read-only feeds',
                'Displays iOS subscribed calendars as read-only feeds',
              ],
            },
            {
              cells: [
                'Supported Platforms',
                'iPhone & iPad (iOS / iPadOS 18.0+)',
                'iPhone, iPad & Apple Watch',
              ],
            },
            {
              cells: [
                'Offline & Local Mode',
                'Works with account-free local calendars + cached iOS store offline',
                'Reads local/cached iOS calendar store offline (with active membership)',
              ],
            },
          ],
        },
      },
      {
        heading: 'Pricing and Choosing Between Spatial Grids vs Editorial Ribbons',
        body: [
          'Timepage pioneered subscription calendar memberships on iOS—requiring an active Timepage membership or Moleskine Studio bundle to continue creating and editing events once the trial expires. Cloud Calendars keeps its core calendar views, Google sync, iCloud access, widgets, and WeatherKit forecasts free permanently (supported by ads, or $4.99/year on Advanced to remove ads; $49.99/year on Premium for direct Microsoft/Teams).',
          'Visually, ask yourself how your brain reads a busy Wednesday: if two overlapping meetings from work and family make sense only when drawn as proportional spatial blocks side by side on a 24-hour grid, Cloud Calendars is far easier to scan than a list-style ribbon.',
        ],
        table: {
          heading: 'Pricing & Best Choice by User Scenario',
          caption: 'Membership comparison and scenario recommendations',
          columns: ['User Scenario', 'Cloud Calendars', 'Moleskine Timepage', 'Recommended Choice'],
          rows: [
            {
              cells: [
                'Permanent $0 free tier with weather + Google + iCloud',
                'Yes ($0 Free w/ ads; $4.99/yr ad-free)',
                'Requires paid membership after free trial',
                'Cloud Calendars',
              ],
            },
            {
              cells: [
                'Seeing proportional hour gaps & overlapping blocks on a grid',
                'True proportional Day, Week & Multi-calendar column grids',
                'Typographic list ribbon rather than traditional proportional blocks',
                'Cloud Calendars',
              ],
            },
            {
              cells: [
                'Reading Month event title chips instead of heatmap dots',
                'Month cells display readable event chips + overflow count',
                'Month view emphasizes busyness heatmap circles',
                'Cloud Calendars',
              ],
            },
            {
              cells: [
                'Bespoke typography, sound effects & Moleskine Actions pairing',
                'Modern dark aurora glass UI focused on clarity',
                'Signature Moleskine themes, haptics & Studio bundle',
                'Moleskine Timepage',
              ],
            },
            {
              cells: [
                'Apple Watch wrist companion with weather',
                'iPhone & iPad only (Lock Screen Live Activity included)',
                'Includes dedicated Apple Watch app & complications',
                'Moleskine Timepage',
              ],
            },
            {
              cells: [
                'Tapping a dry forecast hour to draft an outdoor workout',
                'One-tap event draft directly from WeatherKit hourly view',
                'View hourly rain/temp alongside day ribbon',
                'Cloud Calendars',
              ],
            },
          ],
        },
      },
      {
        heading: 'Comparing Weather Depth: WeatherKit Station vs Ribbon Summaries',
        body: [
          'Both apps save you from opening a separate weather app before scheduling dinner on a patio or a morning run. Timepage weaves poetic weather summaries and rain graphs into its daily view.',
          'Cloud Calendars pairs inline hourly temperature and sky icons on the Day/Week grid with a full Weather Hub powered by Apple WeatherKit—exposing feels-like temperature, precipitation bands, UV index, wind speed and gusts, humidity, and barometric pressure, while reminding you honestly that available forecast days (up to ten returned days) depend on location and date range.',
        ],
      },
      {
        heading: 'Switching Between Timepage and Cloud Calendars Effortlessly',
        body: [
          'Because Timepage stores your appointments inside your connected iOS/iCloud/Google calendars rather than locking events into a proprietary vault, every appointment you created in Timepage is immediately visible in Cloud Calendars once you grant iOS Calendar access.',
          'Remember to manage any active Timepage or Cloud Calendars trial through iPhone Settings > [Your Name] > Subscriptions before renewal.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Compare how your busiest day looks on Cloud Calendars’ proportional hour grid vs Timepage’s scrolling ribbon.',
      'Check Month view readability: event title chips in Cloud Calendars vs activity heatmap circles in Timepage.',
      'Open Cloud Calendars’ Weather Hub to inspect wind gusts, UV, and hourly rain alongside your week.',
      'Check whether you require an Apple Watch companion app (Timepage) or Lock Screen Live Activity (Cloud Calendars).',
      'Verify subscription renewal dates in Apple Account Settings > Subscriptions.',
    ],
    faq: [
      {
        q: 'Can I use Cloud Calendars with weather forecasts for free without a paid membership?',
        a: 'Yes. Cloud Calendars includes its full Apple WeatherKit hub, hourly/daily calendar forecasts, all five views, Google sync, iCloud access, and widgets in its $0 Free tier (ad-supported, or $4.99/year on Advanced to remove ads).',
      },
      {
        q: 'Will I lose my Timepage events if I switch to Cloud Calendars?',
        a: 'No. Events saved to iCloud, Google, or Exchange through Timepage live in those calendar accounts and appear automatically when you connect the same accounts in Cloud Calendars.',
      },
      {
        q: 'Does Cloud Calendars show actual event names in Month view?',
        a: 'Yes. Cloud Calendars renders readable single-line event chips inside Month cells (with a +N count when more events exist on that date) rather than heatmap dots alone.',
      },
    ],
    sourcesHeading: 'Official Moleskine Studio and Cloud Calendars references',
    sources: [
      { label: 'Cloud Calendars on the App Store', url: 'https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319' },
      { label: 'Moleskine Studio: Timepage overview and membership', url: 'https://moleskinestudio.com/timepage/' },
      { label: 'Apple: Manage App Store subscriptions on iPhone', url: 'https://support.apple.com/en-us/118428' },
    ],
    relatedComparisons: [
      { slug: 'calendar-apps-with-built-in-weather-forecast-iphone', label: 'iPhone Calendar Apps with Built-In Weather Compared' },
      { slug: 'month-view-event-titles-vs-dots-iphone-calendars', label: 'iPhone Calendar Month View: Event Titles vs Dots' },
      { slug: 'cloud-calendars-vs-fantastical', label: 'Cloud Calendars vs Fantastical' },
    ],
    seeAlso: [
      'weather-inside-your-calendar',
      'wind-the-forecast-nobody-reads',
      'month-view-on-a-bigger-screen',
      'what-you-get-without-paying-anything',
    ],
  },
};
