import type { LocalisedArticle } from '../types';

export const COMPARISONS_BATCH_3: Readonly<Record<string, LocalisedArticle>> = {
  'cloud-calendars-vs-proton-and-tuta-encrypted-calendars': {
    updated: '2026-11-04',
    seoTitle: 'Cloud Calendars vs Proton & Tuta Encrypted Calendars',
    title: 'Cloud Calendars vs Proton & Tuta Encrypted Calendars',
    short: 'Cloud Calendars vs Proton & Tuta',
    description:
      'Compare zero-knowledge end-to-end encrypted calendars (Proton Calendar, Tuta) with Cloud Calendars on iOS: why E2EE blocks EventKit/CalDAV, local mode, and weather trade-offs.',
    lede: 'Proton Calendar and Tuta Calendar encrypt event titles, locations, and descriptions before they leave your device so even the cloud server operator cannot read them—making them the right choice when server-side zero-knowledge cryptography is mandatory. Because iOS EventKit and standard CalDAV require unencrypted client access, encrypted calendars live inside isolated app silos that cannot merge natively with Apple Calendar, Siri, or standard iOS clients. Cloud Calendars serves iPhone and iPad users who need standard interoperability across iCloud, Google, and Microsoft—or account-free on-device local calendars that never touch a cloud server at all—paired with Apple WeatherKit forecasts. Arte Soft develops Cloud Calendars and publishes this comparison.',
    comparison: {
      heading: 'Feature-by-Feature Comparison Matrix',
      caption: 'Cloud Calendars vs Proton Calendar and Tuta Calendar on iPhone and iPad',
      columns: ['Capability', 'Cloud Calendars', 'Proton Calendar', 'Tuta Calendar'],
      rows: [
        {
          cells: [
            'Primary privacy model',
            'Account-free local device mode + direct EventKit / Google & Microsoft OAuth',
            'Zero-knowledge end-to-end encrypted (E2EE) cloud storage in Switzerland',
            'Zero-knowledge post-quantum-ready E2EE cloud storage in Germany',
          ],
        },
        {
          cells: [
            'Two-way iCloud / Google / M365 merge',
            'Full read/write across iCloud/CalDAV, Google (Free) & Microsoft (Premium)',
            'No two-way CalDAV/EventKit sync; supports read-only external ICS subscriptions',
            'Isolated encrypted store; imports/exports ICS snapshots rather than live CalDAV',
          ],
        },
        {
          cells: [
            'Planning views on iOS',
            'Day, Week, Month, 12-month Year, List & Multi-calendar side-by-side columns',
            'Agenda, Day, 3-Day, Week & Month views',
            'Agenda, Day, Week & Month views inside Tuta Mail/Calendar app',
          ],
        },
        {
          cells: [
            'Weather integration',
            'Full Apple WeatherKit hub + hourly temp, wind/gusts, UV & rain beside hours',
            'No built-in weather forecasts (avoids location telemetry)',
            'No built-in weather forecasts',
          ],
        },
        {
          cells: [
            'Account-free offline calendar',
            'Yes — create local on-device calendars without registering any account',
            'Requires a Proton Account (Free or Paid) to open and sync',
            'Requires a Tuta Account (Free or Paid) to open and sync',
          ],
        },
        {
          cells: [
            'Widgets & Lock Screen',
            'Date+WeatherKit widgets, timed-event Home Screen lists & Live Activity countdown',
            'iOS Up Next / Today Home Screen widgets',
            'Dedicated encrypted agenda widget options',
          ],
        },
        {
          cells: [
            'External attendee invitations',
            'Standard Google, Microsoft, iCloud & App Clip/link/QR sharing',
            'Sends standard unencrypted ICS email invites to external non-Proton guests',
            'Sends standard or password-protected invites via Tuta Mail',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'Why End-to-End Encryption Prevents Standard iOS EventKit Sync',
        body: [
          'A frequent question from Proton and Tuta users on iPhone is why their encrypted events do not show up inside Apple Calendar, CarPlay, Apple Watch’s system calendar, or third-party viewers. If Proton or Tuta decrypted your schedule into Apple’s shared iOS EventKit database—or exposed an unencrypted CalDAV endpoint—any app granted Calendar permission (and iCloud backups, if enabled) could read the cleartext records, defeating the zero-knowledge guarantee.',
          'Proton offers a read-only secret ICS link if you explicitly choose to share a calendar externally, which Cloud Calendars or iOS Settings can subscribe to as a one-way feed. Conversely, if your threat model is avoiding cloud servers altogether on a single iPhone or iPad, Cloud Calendars lets you create purely local calendars on device without signing into Google, Microsoft, iCloud, or Arte Soft.',
        ],
        table: {
          heading: 'Account Sync, Protocol & Platform Support',
          caption: 'Encryption boundaries, protocol support, and platform availability',
          columns: ['Dimension', 'Cloud Calendars', 'Proton Calendar', 'Tuta Calendar'],
          rows: [
            {
              cells: [
                'Google & Microsoft OAuth',
                'Direct Google OAuth (Free) & Microsoft OAuth (Premium)',
                'One-time Easy Switch import or read-only ICS URL subscription',
                'Manual .ics file import/export only',
              ],
            },
            {
              cells: [
                'Apple iCloud & CalDAV',
                'Full two-way EventKit access to iCloud & standard CalDAV accounts',
                'No CalDAV bridge for Calendar (Proton Bridge is Mail-only)',
                'No CalDAV support by cryptographic design',
              ],
            },
            {
              cells: [
                'ICS URL Subscriptions',
                'Reads subscribed ICS feeds configured in iOS Settings',
                'Subscribes to external ICS links (up to plan limit) & can publish secret ICS link',
                'Supports manual ICS file import and export',
              ],
            },
            {
              cells: [
                'Server-side data visibility',
                'Local mode stays on device; cloud providers follow Apple/Google/Microsoft policies',
                'Server sees only encrypted ciphertext and minimal timing metadata',
                'Server encrypts subject, body, location, and metadata with user keys',
              ],
            },
            {
              cells: [
                'Supported Platforms',
                'iPhone & iPad (iOS / iPadOS 18.0+)',
                'iOS, Android, Web & desktop wrapper apps',
                'iOS, Android, Web, macOS, Windows & Linux',
              ],
            },
            {
              cells: [
                'Offline access',
                'Full local calendar editing + cached iOS store events offline',
                'Cached viewing offline; full sync resumes online',
                'Offline cache available on paid tiers / mobile clients',
              ],
            },
          ],
        },
      },
      {
        heading: 'Pricing and Threat-Model Scenarios Compared',
        body: [
          'Privacy is not one uniform setting; different threat models call for different architectures. Journalists, legal teams, and activists protecting cloud-synced schedules across desktop and mobile need E2EE providers like Proton or Tuta, even at the cost of losing CarPlay, EventKit, and multi-provider OAuth convenience.',
          'Professionals and families whose employers or relatives already run on Google Workspace, Microsoft 365, or iCloud gain little from an isolated E2EE calendar if every shared invite immediately travels over standard unencrypted email ICS anyway. For those workflows, Cloud Calendars unifies standard providers on iOS from $0 (Free) or $4.99/year ad-free (Advanced).',
        ],
        table: {
          heading: 'Pricing & Best Choice by User Scenario',
          caption: 'Plan pricing and privacy-fit recommendations across Cloud Calendars, Proton, and Tuta',
          columns: ['User Scenario', 'Cloud Calendars', 'Proton / Tuta', 'Best Choice'],
          rows: [
            {
              cells: [
                'Zero-knowledge E2EE cloud sync across iPhone, Web & Linux/Windows',
                'iPhone/iPad only; relies on standard provider clouds or device-local storage',
                'Free basic E2EE calendar; paid plans ~$3.30–$9.99/mo add more calendars & sharing',
                'Proton or Tuta',
              ],
            },
            {
              cells: [
                'Strictly offline calendar on iPhone with zero cloud account at all',
                'Account-free Local calendars included in Free ($0) or $4.99/yr ad-free',
                'Requires creating a cloud account to initialize mailbox/calendar keys',
                'Cloud Calendars (Local mode)',
              ],
            },
            {
              cells: [
                'Unifying work Google/Microsoft 365 with personal iCloud on iOS',
                'Two-way Google + iCloud (Free) and Microsoft (Premium $49.99/yr)',
                'Cannot sync two-way with Google, Exchange, or iCloud CalDAV',
                'Cloud Calendars',
              ],
            },
            {
              cells: [
                'Viewing encrypted Proton schedule read-only beside iCloud + weather',
                'Displays Proton’s published secret ICS URL via iOS Subscriptions + WeatherKit',
                'Creates the secret read-only ICS link (note: publishing link exposes cleartext to URL holders)',
                'Proton + Cloud Calendars',
              ],
            },
            {
              cells: [
                'Outdoor schedule planning with hourly wind, rain & UV',
                'Built-in Apple WeatherKit station and hourly timeline indicators',
                'No weather integration in either app',
                'Cloud Calendars',
              ],
            },
            {
              cells: [
                'Encrypted email + calendar bundle under one subscription',
                'Calendar-only iOS app ($0 / $4.99 yr / $49.99 yr)',
                'Proton Unlimited / Mail Plus or Tuta Revolutionary bundles mail + calendar',
                'Proton or Tuta',
              ],
            },
          ],
        },
      },
      {
        heading: 'What Happens When You Export a Secret ICS Link from Proton',
        body: [
          'If you publish a Proton Calendar via its "Share via link" ICS feature so iPhone Calendar or Cloud Calendars can read it, Proton must decrypt and re-encrypt that feed for the URL token so standard calendar clients can fetch cleartext iCalendar records over HTTPS.',
          'Treat any secret ICS link like a bearer password: anyone who obtains the URL can read those events without logging in, and you should never publish sensitive medical or legal details over a public ICS feed if your goal was strict end-to-end encryption.',
        ],
      },
      {
        heading: 'Using Account-Free Local Calendars on iPhone',
        body: [
          'When you want events to stay exclusively on your iPhone or iPad hardware without syncing to Apple iCloud, Google, or Microsoft, create a Local calendar inside Cloud Calendars and skip account sign-in.',
          'Remember that local-only calendars are not backed up to an external calendar provider—if you lose your phone without an encrypted device backup, local-only schedules cannot be recovered from a web login.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Decide first whether your threat model requires cloud-synced E2EE (Proton/Tuta) or device-only local storage / standard OAuth interoperability (Cloud Calendars).',
      'To run Cloud Calendars without any cloud account, skip Google/Microsoft sign-in and create a Local calendar on your iPhone.',
      'If you bridge Proton into iOS via a secret ICS link, subscribe in iOS Settings > Apps > Calendar > Calendar Accounts > Add Subscription Calendar.',
      'Keep sensitive E2EE events inside Proton or Tuta directly rather than exposing them through bearer ICS links.',
    ],
    faq: [
      {
        q: 'Can Cloud Calendars sync two-way with Proton Calendar or Tuta?',
        a: 'No. Proton Calendar and Tuta use end-to-end encryption without standard CalDAV or iOS EventKit write access. At most, Proton allows a read-only secret ICS URL subscription, which iOS and Cloud Calendars can display one-way.',
      },
      {
        q: 'Does Cloud Calendars store my iCloud or Google events on Arte Soft servers?',
        a: 'No for device, iCloud, Google, and Microsoft sync—those connect directly via Apple EventKit and official Google/Microsoft OAuth. Cloud Calendars account sign-in is only used if you explicitly use Cloud Calendars’ own cross-user calendar/event sharing.',
      },
      {
        q: 'Can I use Cloud Calendars without creating any account?',
        a: 'Yes. You can create local calendars directly on your iPhone or iPad with no email registration and no cloud calendar provider required.',
      },
    ],
    sourcesHeading: 'Official encryption and calendar protocol references',
    sources: [
      { label: 'Proton Calendar: Security and encryption model', url: 'https://proton.me/calendar/security' },
      { label: 'Proton Support: Share your calendar via link (ICS)', url: 'https://proton.me/support/share-calendar-via-link' },
      { label: 'Tuta: Encrypted online calendar overview', url: 'https://tuta.com/calendar' },
      { label: 'Cloud Calendars Privacy Policy', url: 'https://www.cloud-calendars.com/privacy-policy/' },
    ],
    relatedComparisons: [
      { slug: 'privacy-first-direct-sync-vs-cloud-relay-calendar-apps', label: 'Direct Sync vs Cloud-Relay Calendar Privacy on iOS' },
      { slug: 'caldav-vs-ics-subscribed-url-vs-oauth-calendar-sync', label: 'CalDAV vs ICS Subscribed URL vs OAuth Sync on iOS' },
      { slug: 'cloud-calendars-vs-apple-calendar', label: 'Cloud Calendars vs Apple Calendar' },
    ],
    seeAlso: [
      'what-is-a-cloud-calendar',
      'what-calendar-sync-actually-does',
      'caldav-calendar-on-iphone',
      'the-secret-address-of-a-google-calendar',
    ],
  },

  'cloud-calendars-vs-acalendar-and-digical-switchers': {
    updated: '2026-11-04',
    seoTitle: 'aCalendar & DigiCal Alternatives on iPhone Compared',
    title: 'aCalendar & DigiCal Alternatives on iPhone Compared',
    short: 'aCalendar & DigiCal iOS Alternatives',
    description:
      'Moving from Android to iPhone? Neither aCalendar nor DigiCal exists on iOS—compare Cloud Calendars, Google Calendar, BusyCal, and Fantastical for readable month chips, weather, and widgets.',
    lede: 'Neither Tapir Apps’ aCalendar / aCalendar+ nor Digibites’ DigiCal is available on the Apple App Store—both are Android-exclusive apps built around Android’s native Calendar Provider. Android switchers moving to iPhone usually miss three specific features: readable colored event title bars in Month view (instead of tiny dots), built-in weather forecasts inside the agenda, and clean Home Screen widgets backed by Google Calendar. Cloud Calendars delivers all three on iPhone and iPad in its Free plan, while BusyCal, Google Calendar, and Fantastical cover adjacent power-user niches. Arte Soft develops Cloud Calendars and publishes this comparison.',
    comparison: {
      heading: 'Feature-by-Feature Comparison Matrix for Android-to-iPhone Switchers',
      caption: 'Mapping classic aCalendar+ and DigiCal features to top iPhone replacements',
      columns: ['What Android Switchers Miss', 'Cloud Calendars (iOS)', 'Google Calendar (iOS)', 'BusyCal / Fantastical (iOS)'],
      rows: [
        {
          cells: [
            'Readable Month-cell event titles (like aCalendar Month)',
            'Colored single-line event title chips + +N overflow & drag-to-move',
            'Colored event chips inside Month grid',
            'Configurable Month text rows (BusyCal) or heatmaps/bars (Fantastical)',
          ],
        },
        {
          cells: [
            'Built-in weather forecast (like DigiCal Weather)',
            'Full Apple WeatherKit 10-day hub + hourly temp, wind, UV & rain in Free',
            'No built-in weather forecast on iOS',
            'Included in BusyCal ($14.99) or Fantastical Premium (~$57/yr)',
          ],
        },
        {
          cells: [
            '12-month Year overview (like aCalendar+ Year)',
            'Full 12-month Year view included in Free',
            'No dedicated 12-month Year overview grid',
            'Year view / heatmap available',
          ],
        },
        {
          cells: [
            'Side-by-side per-calendar Day columns',
            'Multi-calendar Day view (one column per selected calendar)',
            'Merged single-column day/3-day/week timeline only',
            'Merged timeline (filtered via Calendar Sets in BusyCal/Fantastical)',
          ],
        },
        {
          cells: [
            'Home Screen widgets & Lock Screen glance',
            'Date+WeatherKit widgets, timed-event lists & Live Activity countdown',
            'Up Next & Month Home Screen widgets',
            'Extensive customizable iOS Home & Lock Screen widgets',
          ],
        },
        {
          cells: [
            'Google Tasks / Android task checklists',
            'Calendar events & alerts only (no Google Tasks sync)',
            'Native Google Tasks creation and completion inside calendar',
            'Apple Reminders (BusyCal) or Google Tasks + Todoist (Fantastical)',
          ],
        },
        {
          cells: [
            'ISO week numbers in grid headers',
            'Follows device locale week start; no inline ISO week-number badges',
            'No native iOS Month week-number badges',
            'Optional week numbers in Apple Calendar, BusyCal & Fantastical',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'How iPhone Calendar Sync Replaces Android’s Calendar Provider',
        body: [
          'On Android, apps like aCalendar and DigiCal read Google, Exchange, and DAVx5 accounts from Android’s shared system Calendar Storage without charging a subscription for account sync. When you switch to iPhone, your existing Google Calendar events are still intact in the cloud—you simply connect your Google account on iOS.',
          'Cloud Calendars lets you tap Sign in with Google directly via OAuth (with Google Meet link support in Free) while simultaneously reading Apple iCloud, CalDAV (replacing DAVx5), and subscribed ICS feeds from iPhone Settings. If your employer also uses Microsoft 365 or Outlook, you can either add Exchange in iOS Settings or connect Microsoft OAuth directly in Cloud Calendars Premium.',
        ],
        table: {
          heading: 'Account Sync, Protocol & Platform Support for Android Migrants',
          caption: 'How Android sync habits translate to Cloud Calendars and iOS alternatives',
          columns: ['Android Setup', 'Cloud Calendars on iPhone', 'Google Calendar iOS', 'BusyCal iOS'],
          rows: [
            {
              cells: [
                'Gmail / Google Workspace Calendar',
                'Direct Sign in with Google OAuth + Meet links (Free)',
                'First-party native Google account sync (Free)',
                'Google/CalDAV sync ($14.99 one-time app)',
              ],
            },
            {
              cells: [
                'Microsoft 365 / Outlook / Exchange',
                'Direct Microsoft OAuth + Teams (Premium) or via iOS Settings',
                'Displays iOS local Exchange calendars if toggle enabled',
                'Exchange/CalDAV/iOS system store support',
              ],
            },
            {
              cells: [
                'Nextcloud / Fastmail / Fruux (formerly DAVx5)',
                'Add natively in iOS Settings > Calendar Accounts > CalDAV (no extra app needed!)',
                'Visible only if synced into iOS system calendar store',
                'Direct CalDAV client or via iOS Calendar Accounts',
              ],
            },
            {
              cells: [
                'Public holiday & sports ICS feeds',
                'Displays iOS subscribed ICS calendars read-only',
                'Subscribes via Google Calendar web settings',
                'Subscribes via iOS or direct ICS URL',
              ],
            },
            {
              cells: [
                'Device coverage',
                'iPhone & iPad (iOS / iPadOS 18.0+)',
                'iPhone, iPad, Android & Web',
                'iPhone, iPad & macOS (separate license)',
              ],
            },
            {
              cells: [
                'Offline local-only calendars',
                'Built-in account-free Local calendars on device',
                'Requires Google account login',
                'Supports local/system calendars offline',
              ],
            },
          ],
        },
      },
      {
        heading: 'Pricing Comparison: Avoiding Subscription Shock After Android',
        body: [
          'The biggest surprise for aCalendar+ and DigiCal+ veterans—who typically paid a single $5–$10 one-time upgrade years ago—is seeing iOS calendar apps ask $40 to $57 every year just to show weather or connect a second account.',
          'Cloud Calendars keeps all views, Google OAuth, iCloud sync, widgets, and Apple WeatherKit forecasts unlocked at $0 in Free, with a $4.99/year ($0.49/month) Advanced tier solely to remove ads—matching the spirit of classic lightweight utility pricing. If you strictly prefer a one-time upfront purchase with zero recurring billing, BusyCal iOS ($14.99 one-time) is the closest match.',
        ],
        table: {
          heading: 'Pricing & Best Choice by Android Switcher Scenario',
          caption: 'US App Store reference pricing and best match by former Android calendar workflow',
          columns: ['Former Android Workflow', 'Cloud Calendars', 'Alternative iOS App', 'Best Choice'],
          rows: [
            {
              cells: [
                'DigiCal user wanting weather + readable Month bars + widgets',
                '$0 Free (or $4.99/yr ad-free) with Apple WeatherKit + Month chips',
                'Fantastical (~$57/yr) or BusyCal ($14.99 one-time)',
                'Cloud Calendars',
              ],
            },
            {
              cells: [
                'aCalendar+ user wanting Day/Week/Month/Year + drag-to-move',
                'All 5 views + Multi-calendar columns + drag-to-move in Free',
                'Apple Calendar ($0, no built-in weather grid)',
                'Cloud Calendars',
              ],
            },
            {
              cells: [
                'aCalendar user relying heavily on Google Tasks checklists',
                'Does not display Google Tasks',
                'Google Calendar iOS ($0) includes native Google Tasks',
                'Google Calendar App',
              ],
            },
            {
              cells: [
                'aCalendar+ buyer wanting a strict one-time purchase + smart filters',
                'Free w/ ads or $4.99/yr subscription',
                'BusyCal iOS ($14.99 one-time upfront)',
                'BusyCal iOS',
              ],
            },
            {
              cells: [
                'Household still split between your new iPhone and partner’s Android',
                'Syncs shared Google Calendars two-way with Android users in Free',
                'Shared iCloud Calendar is cumbersome on Android browsers',
                'Shared Google + Cloud Calendars',
              ],
            },
            {
              cells: [
                'Adding Microsoft 365 + Teams alongside Gmail & iCloud',
                'Premium ($4.99/mo or $49.99/yr) adds direct Microsoft + Teams',
                'Outlook Mobile ($0, includes email inbox)',
                'Cloud Calendars or Outlook',
              ],
            },
          ],
        },
      },
      {
        heading: 'Bonus for Former DAVx5 Users: iOS Speaks CalDAV Out of the Box',
        body: [
          'On Android, syncing Fastmail, Nextcloud, Synology, or Mailbox.org calendars required buying or sideloading DAVx5 because AOSP lacks a built-in CalDAV settings screen. iOS includes a native RFC 4791 CalDAV client in system settings.',
          'Open Settings > Apps > Calendar > Calendar Accounts > Add Account > Other > Add CalDAV Account, enter your server credentials once, and both Apple Calendar and Cloud Calendars can read and edit those calendars immediately.',
        ],
      },
      {
        heading: 'Keeping Shared Calendars Live with Family Still on Android',
        body: [
          'When you move to iPhone, resist moving shared household calendars from Google Calendar into iCloud if your partner or children still carry Samsung or Pixel phones. Android phones cannot natively sync iCloud calendars without third-party CalDAV bridges and Apple app-specific passwords.',
          'Keep shared family schedules hosted on Google Calendar, sign into Google inside Cloud Calendars on your new iPhone, and everyone keeps instant two-way editing on their preferred hardware.',
        ],
      },
    ],
    claims: {},
    practical: [
      'After activating your iPhone, install Cloud Calendars and tap Sign in with Google to bring over all existing Google Calendars and colors.',
      'If you used DAVx5 on Android for Nextcloud or Fastmail, add those credentials natively in iOS Settings > Apps > Calendar > Calendar Accounts > Other > Add CalDAV Account.',
      'Switch to Month view in Cloud Calendars to get colored single-line event title chips instead of dots, or open Year view for a 12-month overview.',
      'Long-press your iPhone Home Screen to add the Calendar & Weather or Calendar Events Large widget.',
    ],
    faq: [
      {
        q: 'Is aCalendar or DigiCal available for iPhone on the App Store?',
        a: 'No. Both aCalendar (by Tapir Apps) and DigiCal (by Digibites) are built exclusively for Android and do not offer iPhone or iPad versions.',
      },
      {
        q: 'Do I lose my DigiCal or aCalendar events when switching from Android to iPhone?',
        a: 'Any events synced to Google Calendar, Microsoft Outlook/Exchange, or a CalDAV server remain safely in the cloud and appear on iPhone as soon as you sign in. Only "Local / My Phone" Android events must be exported to an .ics file before wiping your old phone.',
      },
      {
        q: 'Which iPhone calendar app has built-in weather like DigiCal without an expensive subscription?',
        a: 'Cloud Calendars includes hourly and up-to-10-day Apple WeatherKit forecasts inside Day and Week grids—plus date+weather widgets—in its $0 Free plan, with ad removal available for $4.99/year.',
      },
    ],
    sourcesHeading: 'Official platform migration and sync references',
    sources: [
      { label: 'Apple Support: Move from Android to iPhone or iPad', url: 'https://support.apple.com/en-us/118670' },
      { label: 'Apple Support: Set up mail, contacts, and calendar accounts on iPhone', url: 'https://support.apple.com/guide/iphone/set-up-mail-contacts-and-calendar-accounts-ipha0d932e96/ios' },
      { label: 'Google Calendar Help: Sync Google Calendar on iPhone & iPad', url: 'https://support.google.com/calendar/answer/99358' },
      { label: 'Cloud Calendars on the App Store', url: 'https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319' },
    ],
    relatedComparisons: [
      { slug: 'month-view-event-titles-vs-dots-iphone-calendars', label: 'iPhone Calendar Month View: Event Titles vs Dots' },
      { slug: 'calendar-apps-with-built-in-weather-forecast-iphone', label: 'iPhone Calendar Apps with Built-In Weather Compared' },
      { slug: 'cloud-calendars-vs-google-calendar-iphone', label: 'Cloud Calendars vs Google Calendar on iPhone' },
    ],
    seeAlso: [
      'free-google-sync-without-adverts',
      'caldav-calendar-on-iphone',
      'weather-inside-your-calendar',
      'calendar-export-ics-pdf-and-backup',
    ],
  },

  'merge-icloud-google-outlook-exchange-calendars-iphone': {
    updated: '2026-11-04',
    seoTitle: 'Merge iCloud, Google & Outlook Calendars on iPhone',
    title: 'Merge iCloud, Google & Outlook Calendars on iPhone',
    short: 'Merge iCloud, Google & Outlook on iPhone',
    description:
      'Compare unified calendar viewers (Cloud Calendars, Apple Calendar, Fantastical, Notion) vs server-side busy-block cloning (OneCal) for iCloud, Google, and Outlook on iPhone.',
    lede: 'There are two fundamentally different ways to "merge" iCloud, Google Calendar, and Microsoft Outlook/Exchange on an iPhone: unified client viewing (displaying all three accounts together on your screen while keeping each event in its original provider) and server-side cloning (copying "Busy" placeholder blocks from one server into another so coworkers’ scheduling tools see you as unavailable). For 90% of people who simply want one screen without switching between three apps, a unified iOS viewer like Cloud Calendars or Apple Calendar solves the problem cleanly without polluting work calendars with copied records. Arte Soft develops Cloud Calendars and publishes this comparison.',
    comparison: {
      heading: 'Feature-by-Feature Comparison Matrix: Unified Viewers vs Server Sync',
      caption: 'Comparing 4 ways to combine iCloud, Google Calendar, and Microsoft 365 / Outlook on iPhone',
      columns: ['Capability', 'Cloud Calendars', 'Apple Calendar (iOS)', 'Fantastical / Notion', 'Server Sync (OneCal / Reclaim)'],
      rows: [
        {
          cells: [
            'Integration architecture',
            'Unified iOS client viewer (EventKit + Google & Microsoft OAuth)',
            'Unified iOS client viewer via iOS Calendar Accounts',
            'Unified client viewer across mobile & desktop',
            'Cloud-to-cloud server cloner copying Busy/detail blocks across APIs',
          ],
        },
        {
          cells: [
            'Coworkers see personal blocks in Find a Time / Teams?',
            'No — personal iCloud/Gmail stays invisible to work server',
            'No — client-only display on your Apple devices',
            'No — client-only display inside the app',
            'Yes — writes actual Busy placeholder events onto your work calendar',
          ],
        },
        {
          cells: [
            'Side-by-side per-account Day columns',
            'Dedicated Multi-calendar Day view (one column per calendar)',
            'Single merged timeline on iPhone',
            'Single merged timeline (filterable via Calendar Sets)',
            'Web dashboard only; relies on your calendar app to view',
          ],
        },
        {
          cells: [
            'Native iCloud access without app-specific passwords',
            'Yes — direct iOS EventKit permission (Free)',
            'Yes — built-in iCloud Push',
            'Yes on Fantastical iOS; Notion requires Apple app-specific password',
            'Requires Apple ID app-specific password stored on third-party server',
          ],
        },
        {
          cells: [
            'Video meeting link creation',
            'Google Meet (Free) & Microsoft Teams (Premium)',
            'FaceTime built in',
            'Meet, Teams, Zoom & Webex',
            'Not an event editor',
          ],
        },
        {
          cells: [
            'Built-in hourly weather beside all 3 accounts',
            'Apple WeatherKit hourly & 10-day forecast in Free',
            'None on iPhone',
            'Fantastical Premium (~$57/yr); none in Notion Calendar',
            'None (background sync service)',
          ],
        },
        {
          cells: [
            'Risk of duplicate events if misconfigured',
            'Low — hide duplicate iOS/OAuth list with one toggle',
            'Low — single system account table',
            'Low — per-account visibility toggles',
            'Medium — chained two-way rules can loop if not carefully scoped',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'Provider-by-Provider Connection Paths on iPhone',
        body: [
          'Unifying iCloud, Google, and Outlook fails most often when people try to forward calendars via read-only ICS links—which take hours to refresh on Google Calendar and strip away editing rights—instead of connecting each provider natively.',
          'In Cloud Calendars, iCloud connects via Apple EventKit (zero extra login), Google connects via Sign in with Google OAuth in Free, and Microsoft Outlook / 365 connects either via Sign in with Microsoft OAuth in Premium or via an Exchange account already approved in iPhone Settings.',
        ],
        table: {
          heading: 'Account Sync, Protocol & Platform Support Across Unification Tools',
          caption: 'How each provider connects and refreshes across unified iOS viewers and server cloners',
          columns: ['Provider / Dimension', 'Cloud Calendars', 'Apple Calendar', 'OneCal / Server Sync'],
          rows: [
            {
              cells: [
                'Google Calendar',
                'Direct Google OAuth + Meet (Free) or via iOS Settings',
                'iOS Settings > Calendar Accounts (periodic Fetch)',
                'Google Calendar API webhook sync',
              ],
            },
            {
              cells: [
                'Microsoft 365 / Exchange',
                'Direct Microsoft OAuth + Teams (Premium) or iOS Exchange store',
                'Native Exchange ActiveSync / OAuth in iOS Settings',
                'Microsoft Graph API (often requires IT admin consent)',
              ],
            },
            {
              cells: [
                'Apple iCloud Calendar',
                'Native iOS EventKit read/write (no app password needed)',
                'Native iCloud Push across Apple devices',
                'CalDAV via user-generated Apple app-specific password',
              ],
            },
            {
              cells: [
                'ICS URL Subscriptions',
                'Reads iOS subscribed ICS calendars read-only',
                'Native iOS subscribed ICS support',
                'Generally requires read/write API accounts rather than ICS feeds',
              ],
            },
            {
              cells: [
                'Supported Platforms',
                'iPhone & iPad (iOS / iPadOS 18.0+)',
                'iPhone, iPad, Mac, Watch & Vision Pro',
                'Web configuration; synced events appear everywhere',
              ],
            },
            {
              cells: [
                'Data separation & privacy',
                'Events stay in their native provider; zero cross-account copying',
                'Events stay in their native provider',
                'Copies stripped Busy blocks or metadata across servers',
              ],
            },
          ],
        },
      },
      {
        heading: 'Pricing and Choosing Viewer vs Server Sync',
        body: [
          'Ask one decisive question before paying for any tool: "Who needs to see the combined schedule—just me on my iPhone, or my coworkers inside Outlook Scheduling Assistant?" If only you need to see everything so you stop double-booking dentist visits over sprint reviews, a client viewer is faster, cheaper, and keeps private appointments completely off employer servers.',
          'If coworkers routinely drop meetings onto open afternoon slots on your work calendar because they cannot see your personal commitments, combine a server-side busy-block tool (or manual private blocks) with a unified iPhone viewer—making sure to hide the cloned secondary calendar in your mobile view so you do not see every appointment twice.',
        ],
        table: {
          heading: 'Pricing & Best Choice by Multi-Account Scenario',
          caption: 'Cost and architecture fit for combining iCloud, Google, and Microsoft calendars',
          columns: ['User Scenario', 'Cloud Calendars', 'Alternative Tool', 'Best Choice'],
          rows: [
            {
              cells: [
                'Combining iCloud + Google Calendar + weather on iPhone for $0',
                'Free ($0, ad-supported) or $4.99/yr ad-free Advanced',
                'Apple Calendar ($0, no weather or column view)',
                'Cloud Calendars',
              ],
            },
            {
              cells: [
                'Combining iCloud + Google + Microsoft Teams in side-by-side columns',
                'Premium ($4.99/mo or $49.99/yr) includes Microsoft OAuth + Teams',
                'Fantastical (~$57/yr, single merged column)',
                'Cloud Calendars Premium',
              ],
            },
            {
              cells: [
                'Blocking coworkers in Outlook Find a Time automatically from personal Gmail',
                'Client viewer only — does not copy blocks to work server',
                'OneCal / Reclaim (~$60–$120/yr server sync)',
                'OneCal + unified iOS viewer',
              ],
            },
            {
              cells: [
                'Corporate IT blocks all third-party Microsoft Graph OAuth apps',
                'Can read Exchange via iOS Settings if iOS profile is permitted',
                'Outlook Mobile ($0) when strict Intune MAM container is enforced',
                'Apple Calendar / Cloud Calendars or Outlook',
              ],
            },
            {
              cells: [
                'Viewing all 3 accounts on both Mac desktop and iPhone for $0',
                'iPhone & iPad only',
                'Apple Calendar ($0 across macOS + iOS)',
                'Apple Calendar (Mac) + Cloud Calendars (iOS)',
              ],
            },
            {
              cells: [
                'Sharing a single merged event without exposing full calendars',
                'Single-event link, QR & iPhone App Clip preview included',
                'Standard email ICS invite',
                'Cloud Calendars',
              ],
            },
          ],
        },
      },
      {
        heading: 'How to Prevent Duplicate Events When Mixing iOS Settings and OAuth',
        body: [
          'Because Cloud Calendars reads the iOS calendar store and also offers direct Sign in with Google and Sign in with Microsoft, connecting the same Gmail address in both places can make two copies of that calendar available.',
          'Open the calendar list selector inside Cloud Calendars and uncheck one copy—or use iOS Settings exclusively for iCloud/CalDAV and Cloud Calendars OAuth for Google/Microsoft—so every meeting renders once and fires one alert.',
        ],
      },
      {
        heading: 'Why Side-by-Side Columns Beat Merged Color Soup',
        body: [
          'When you combine work Outlook, personal Gmail, a partner’s iCloud calendar, and kids’ school schedules, traditional Day view crams four overlapping bars into sliver-thin columns that truncate every title.',
          'Cloud Calendars’ Multi-calendar view assigns each selected calendar its own dedicated vertical lane across the day, letting you scan "Work", "Personal", and "Family" side by side at a glance.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Enable iCloud Calendar in iPhone Settings and grant Cloud Calendars Full Access so your Apple calendars appear immediately.',
      'Connect Gmail via Sign in with Google inside Cloud Calendars (Free), and connect Microsoft 365 either via iOS Exchange settings or Sign in with Microsoft (Premium).',
      'Open the calendar visibility picker and uncheck any duplicate calendar that is synced through both iOS Settings and direct OAuth.',
      'Tap Multi-calendar Day view to inspect Work, Personal, and Family schedules in separate side-by-side columns.',
      'Choose your personal calendar as the default creation target so private appointments never accidentally save onto a work server.',
    ],
    faq: [
      {
        q: 'If I connect my work Outlook and personal iCloud in Cloud Calendars, can my employer see my iCloud events?',
        a: 'No. Cloud Calendars unifies accounts visually on your iPhone and iPad without copying events between servers. Your employer only sees events you explicitly create on or move into your work Exchange/Microsoft 365 calendar.',
      },
      {
        q: 'Why do Google ICS imports into Outlook or iCloud take up to 24 hours to update?',
        a: 'Subscribed .ics URLs rely on periodic server polling controlled by the receiving provider—Google and Outlook Web often refresh external ICS feeds only once every 12 to 24 hours. Native OAuth and EventKit sync update within seconds or minutes.',
      },
      {
        q: 'Does Cloud Calendars require an Apple app-specific password for iCloud?',
        a: 'No. On iPhone and iPad, Cloud Calendars reads and edits iCloud calendars directly through Apple’s native EventKit permission.',
      },
    ],
    sourcesHeading: 'Official Apple, Google, and Microsoft multi-account references',
    sources: [
      { label: 'Apple Support: Set up multiple calendars on iPhone', url: 'https://support.apple.com/guide/iphone/use-multiple-calendars-iph3d1110d4/ios' },
      { label: 'Google Calendar Help: Add or subscribe to another calendar', url: 'https://support.google.com/calendar/answer/37100' },
      { label: 'Microsoft Support: Sync basics — what you can and cannot sync in Outlook', url: 'https://support.microsoft.com/en-us/office/sync-basics-what-you-can-and-cannot-sync-5537d587-ff9d-48b6-b214-c00b7947b2b4' },
      { label: 'Cloud Calendars on the App Store', url: 'https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319' },
    ],
    relatedComparisons: [
      { slug: 'work-exchange-microsoft-365-and-personal-icloud-iphone', label: 'Work Exchange / M365 + Personal iCloud on iPhone' },
      { slug: 'caldav-vs-ics-subscribed-url-vs-oauth-calendar-sync', label: 'CalDAV vs ICS Subscribed URL vs OAuth Sync on iOS' },
      { slug: 'cloud-calendars-vs-microsoft-outlook-mobile', label: 'Cloud Calendars vs Microsoft Outlook Mobile' },
    ],
    seeAlso: [
      'icloud-google-and-outlook-in-one-view',
      'three-calendar-apps-is-two-too-many',
      'onecal-alternative-iphone-calendar-view-or-sync',
      'when-two-calendars-disagree',
    ],
  },

  'caldav-vs-ics-subscribed-url-vs-oauth-calendar-sync': {
    updated: '2026-11-04',
    seoTitle: 'CalDAV vs ICS Subscribed URL vs OAuth Sync on iOS',
    title: 'CalDAV vs ICS Subscribed URL vs OAuth Sync on iOS',
    short: 'CalDAV vs ICS URL vs OAuth Sync',
    description:
      'Technical comparison of CalDAV (RFC 4791), read-only ICS URL subscriptions (RFC 5545), and native Google/Microsoft OAuth sync on iPhone: write-back, refresh speed, and security.',
    lede: 'When a calendar on your iPhone refuses to let you edit an event, misses a Google Meet button, or lags behind by half a day, the culprit is almost always the sync protocol rather than the calendar app. iOS supports three distinct calendar transport layers: native provider OAuth APIs (Google Calendar API & Microsoft Graph), CalDAV (RFC 4791, used by iCloud, Fastmail, and Nextcloud), and subscribed `.ics` URLs (RFC 5545 `webcal://` or `https://` feeds). Use native OAuth or CalDAV whenever you need two-way editing and RSVPs, and reserve ICS URLs strictly for read-only broadcasts like school terms, sports fixtures, or public holidays. Arte Soft develops Cloud Calendars and publishes this comparison.',
    comparison: {
      heading: 'Protocol-by-Protocol Technical Matrix',
      caption: 'Comparing Native OAuth APIs, CalDAV (RFC 4791), and Subscribed ICS URLs (RFC 5545) on iOS',
      columns: ['Technical Capability', 'Native OAuth API (Google / Microsoft)', 'CalDAV (RFC 4791 / iCloud)', 'Subscribed ICS URL (.ics / webcal)'],
      rows: [
        {
          cells: [
            'Read vs write direction',
            'Full two-way read, create, move, resize & delete',
            'Full two-way read, create, move, resize & delete (per ACL)',
            'Strictly one-way read-only feed (cannot edit back to host)',
          ],
        },
        {
          cells: [
            'Update & refresh latency',
            'Near-instant via OAuth sync tokens & webhooks',
            'Push on iCloud; configurable Fetch (15–60 min) or manual pull on standard CalDAV',
            'Minutes to hours on iOS; up to 12–24 hours if subscribed via Google/Outlook servers',
          ],
        },
        {
          cells: [
            'Authentication & revocation',
            'Scoped OAuth 2.0 token (revokable per app without password change)',
            'System Apple ID (iCloud) or username + app-specific password',
            'Unauthenticated public link or secret bearer token embedded in URL',
          ],
        },
        {
          cells: [
            'Attendee RSVPs (Accept / Maybe / Decline)',
            'Full attendee status & organizer updates',
            'Supported via CalDAV Scheduling Extensions (RFC 6638)',
            'Read-only snapshot; cannot send attendee replies through feed',
          ],
        },
        {
          cells: [
            'Native conferencing link generation',
            'Creates Google Meet (Google API) & Microsoft Teams (Graph API) links',
            'Preserves URLs in location/notes; does not mint Meet/Teams rooms natively',
            'Displays static join links already written in event description',
          ],
        },
        {
          cells: [
            'Color & per-calendar metadata',
            'Syncs account calendar list, titles, colors & access roles',
            'Syncs CalDAV collection display name and color properties',
            'Single feed-level name and locally chosen color',
          ],
        },
        {
          cells: [
            'Payload efficiency on large histories',
            'Incremental delta sync (fetches only changed events)',
            'ETag / sync-token collection diffs per modified `.ics` resource',
            'Re-downloads the entire monolithic `.ics` file on every refresh',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'How Cloud Calendars and iOS Handle All Three Protocols',
        body: [
          'Understanding where each protocol lives on iPhone saves hours of troubleshooting. Apple’s system Settings (`Settings > Apps > Calendar > Calendar Accounts`) hosts iCloud, generic CalDAV accounts, Exchange ActiveSync, and subscribed `.ics` URLs, exposing them to apps you authorize via EventKit.',
          'Cloud Calendars reads all of those EventKit calendars—including iCloud, Fastmail/Nextcloud CalDAV, and read-only `.ics` subscriptions—and adds direct Sign in with Google OAuth (Free) and Sign in with Microsoft OAuth (Premium) so Google Meet and Microsoft Teams metadata work first-class without relying on iOS Mail’s legacy Google CalDAV wrapper.',
        ],
        table: {
          heading: 'Account Sync, Protocol & Platform Support in Practice',
          caption: 'Recommended protocol for each major calendar provider on iPhone and iPad',
          columns: ['Calendar Source', 'Best Protocol on iPhone', 'How Cloud Calendars Connects', 'Plan Required'],
          rows: [
            {
              cells: [
                'Google Calendar / Workspace',
                'Native Google OAuth 2.0 API',
                'Direct Sign in with Google inside Cloud Calendars (+ Meet links)',
                'Free ($0)',
              ],
            },
            {
              cells: [
                'Microsoft 365 / Outlook.com',
                'Microsoft OAuth (Graph) or iOS Exchange',
                'Sign in with Microsoft (Premium) or via iOS Calendar Accounts',
                'Premium ($49.99/yr) or Free via iOS store',
              ],
            },
            {
              cells: [
                'Apple iCloud Calendar',
                'Apple EventKit / iCloud Push (CalDAV-based)',
                'Automatic once Full Access to Calendars is granted on iOS',
                'Free ($0)',
              ],
            },
            {
              cells: [
                'Fastmail, Nextcloud, Synology, Mailbox.org',
                'CalDAV (RFC 4791)',
                'Add CalDAV account in iOS Settings > Calendar Accounts; read via EventKit',
                'Free ($0)',
              ],
            },
            {
              cells: [
                'School terms, Canvas/Blackboard, sports & shift feeds',
                'Subscribed ICS URL (`https://` or `webcal://`)',
                'Subscribe in iOS Calendar Accounts (not static file import); read-only in app',
                'Free ($0)',
              ],
            },
            {
              cells: [
                'One-time archive backup or migration',
                'Static `.ics` file import/export',
                'Import into a target writable calendar; never updates automatically afterward',
                'Free ($0)',
              ],
            },
          ],
        },
      },
      {
        heading: 'Subscribed ICS URL vs Imported ICS File: Avoiding the Dead-Snapshot Trap',
        body: [
          'Two actions share the `.ics` extension and confuse millions of users every semester: subscribing to an ICS URL versus importing a downloaded `.ics` file. Importing copies events once into your personal calendar; when the university moves an exam or an airline changes a departure next week, your imported copy stays frozen at the old time—and you cannot bulk-delete 200 imported events with one tap.',
          'Subscribing to the URL keeps the feed isolated in its own read-only calendar layer that updates when the publisher edits the source, and lets you hide or delete the entire feed cleanly in five seconds.',
        ],
        table: {
          heading: 'Scenario Guide: Choosing Between OAuth, CalDAV, ICS Subscribe & ICS Import',
          caption: 'Best protocol choice by real-world scheduling scenario and security requirement',
          columns: ['User Scenario', 'Protocol to Avoid', 'Recommended Protocol', 'Why It Wins'],
          rows: [
            {
              cells: [
                'Editing Google Calendar + creating Google Meet links on iPhone',
                'Secret ICS URL (read-only)',
                'Native Google OAuth in Cloud Calendars',
                'Instant two-way edits, Meet links & revokable OAuth token',
              ],
            },
            {
              cells: [
                'Self-hosted Nextcloud or Fastmail calendar on iPhone',
                'Exported static `.ics` files',
                'CalDAV in iOS Calendar Accounts + Cloud Calendars',
                'Standard RFC 4791 two-way sync without vendor lock-in',
              ],
            },
            {
              cells: [
                'Child’s school athletics, TripIt, or Canvas assignment feed',
                'Importing downloaded `.ics` into main calendar',
                'iOS Subscribed ICS URL (`Add Subscription Calendar`)',
                'Auto-updates schedule changes & toggles off cleanly',
              ],
            },
            {
              cells: [
                'Subscribing to an ICS feed so it updates fast on iPhone',
                'Subscribing via Google Calendar web (12–24h lag)',
                'Subscribing directly on iPhone in iOS Settings',
                'iOS polls the HTTPS `.ics` endpoint directly on device',
              ],
            },
            {
              cells: [
                'Sharing one editable calendar with an iPhone + Android partner',
                'Public ICS URL (neither partner can edit via URL)',
                'Shared Google Calendar via OAuth on both phones',
                'Real-time two-way write permissions on iOS & Android',
              ],
            },
            {
              cells: [
                'Revoking access after sharing a private schedule',
                'Secret ICS address (must reset token for everyone)',
                'Named-user OAuth / ACL sharing (or Cloud Calendars roles)',
                'Remove one person’s Reader/Writer access individually',
              ],
            },
          ],
        },
      },
      {
        heading: 'Why Google Calendar Subscribed ICS Feeds Lag Behind iPhone Subscriptions',
        body: [
          'If you paste a school or shift `.ics` link into Google Calendar on the web ("Add calendar > From URL") and then sync Google to your iPhone, Google’s backend crawlers fetch that external URL on an unconfigurable schedule that routinely takes 12 to 24 hours.',
          'Subscribing to that exact same `.ics` URL directly in iPhone `Settings > Apps > Calendar > Calendar Accounts > Add Account > Other > Add Subscription Calendar` lets your iPhone fetch the feed directly from the source server, bypassing Google’s crawler queue while displaying right beside your Google and iCloud events in Cloud Calendars.',
        ],
      },
      {
        heading: 'Security Hygiene for Secret ICS Addresses',
        body: [
          'Google’s "Secret address in iCalendar format" and Outlook’s published ICS links bypass login screens intentionally so dumb feed readers can fetch them. Anyone who sees that URL in a forwarded email, Slack channel, or browser history can read every event on that calendar until you click "Reset" in provider settings.',
          'Prefer OAuth, CalDAV, or role-based calendar sharing (`Reader` / `Writer`) whenever events contain private addresses, client names, or medical appointments.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Use Sign in with Google (Free) or Sign in with Microsoft (Premium) in Cloud Calendars whenever you need two-way editing and conferencing links.',
      'Configure iCloud and third-party CalDAV servers (Fastmail, Nextcloud) once in iOS Settings > Apps > Calendar > Calendar Accounts.',
      'For read-only `.ics` links, always choose Add Subscription Calendar in iOS Settings rather than tapping a downloaded `.ics` file to import static copies.',
      'Subscribe to time-sensitive ICS feeds directly on iOS rather than routing them through Google Calendar web’s slow URL crawler.',
      'Audit and reset any "Secret address in iCalendar format" in Google Calendar settings if you ever pasted it into a shared chat or former tool.',
    ],
    faq: [
      {
        q: 'Why can’t I edit or delete an event on a subscribed ICS calendar on my iPhone?',
        a: 'An ICS subscription (`webcal://` or `.ics` URL) is an HTTP GET feed defined by RFC 5545—the server publishes a read-only file and accepts no write-back requests. To edit events two-way, connect the source account via OAuth or CalDAV.',
      },
      {
        q: 'What is the difference between CalDAV and OAuth?',
        a: 'CalDAV (RFC 4791) is an open WebDAV wire protocol for syncing calendar items, whereas OAuth 2.0 is an authorization framework. Google and Microsoft pair OAuth 2.0 tokens with their modern REST APIs (Google Calendar API and Microsoft Graph), while Fastmail and Nextcloud use CalDAV for calendar transport.',
      },
      {
        q: 'Does Cloud Calendars support both CalDAV and ICS subscriptions?',
        a: 'Yes. Add any CalDAV account or ICS URL subscription in iOS Settings > Apps > Calendar > Calendar Accounts and grant Cloud Calendars Full Access; CalDAV calendars work read/write and ICS feeds appear read-only in the Free plan.',
      },
    ],
    sourcesHeading: 'IETF standards and official vendor sync documentation',
    sources: [
      { label: 'IETF RFC 4791: Calendaring Extensions to WebDAV (CalDAV)', url: 'https://datatracker.ietf.org/doc/html/rfc4791' },
      { label: 'IETF RFC 5545: Internet Calendaring and Scheduling Core Object Specification (iCalendar)', url: 'https://datatracker.ietf.org/doc/html/rfc5545' },
      { label: 'Apple Support: Subscribe to calendars on iPhone', url: 'https://support.apple.com/guide/iphone/use-multiple-calendars-iph3d1110d4/ios' },
      { label: 'Google Calendar Help: Subscribe to someone’s Google Calendar', url: 'https://support.google.com/calendar/answer/37100' },
    ],
    relatedComparisons: [
      { slug: 'merge-icloud-google-outlook-exchange-calendars-iphone', label: 'Merge iCloud, Google & Outlook Calendars on iPhone' },
      { slug: 'privacy-first-direct-sync-vs-cloud-relay-calendar-apps', label: 'Direct Sync vs Cloud-Relay Calendar Privacy on iOS' },
      { slug: 'cloud-calendars-vs-proton-and-tuta-encrypted-calendars', label: 'Cloud Calendars vs Proton & Tuta Encrypted Calendars' },
    ],
    seeAlso: [
      'caldav-calendar-on-iphone',
      'what-calendar-sync-actually-does',
      'outlook-subscribe-or-import-ics-calendar',
      'the-secret-address-of-a-google-calendar',
    ],
  },

  'shared-icloud-calendar-vs-shared-google-calendar-families': {
    updated: '2026-11-04',
    seoTitle: 'Shared iCloud vs Shared Google Calendar for Families',
    title: 'Shared iCloud vs Shared Google Calendar for Families',
    short: 'Shared iCloud vs Shared Google Calendar',
    description:
      'Compare Apple iCloud Shared Calendars, Google Family/Shared Calendars, and Cloud Calendars sharing for couples and households across iPhone-only and mixed Android setups.',
    lede: 'Choosing between a Shared iCloud Calendar and a Shared Google Calendar comes down to one household hardware rule: if every family member uses an iPhone, iPad, or Mac, Apple’s Shared iCloud Calendar (including the automatic iCloud Family Sharing calendar) delivers instant Push updates with zero extra accounts. The moment one parent, grandparent, or nanny uses an Android phone or Windows PC, Shared Google Calendar is far more reliable—and iPhone family members can view both iCloud and shared Google calendars side by side with hourly weather in Cloud Calendars. Arte Soft develops Cloud Calendars and publishes this comparison.',
    comparison: {
      heading: 'Household Calendar Sharing Comparison Matrix',
      caption: 'Apple Shared iCloud Calendar vs Shared Google Calendar vs Cloud Calendars Sharing',
      columns: ['Household Requirement', 'Shared iCloud Calendar', 'Shared Google Calendar', 'Cloud Calendars Sharing (iOS)'],
      rows: [
        {
          cells: [
            'Best device mix',
            '100% Apple households (iPhone, iPad, Mac, Watch)',
            'Mixed iPhone + Android + Windows/Web households',
            'iPhone & iPad households + quick App Clip preview for iPhone guests',
          ],
        },
        {
          cells: [
            'Two-way editing on Android',
            'Poor — requires paid third-party CalDAV bridge + app-specific password',
            'First-party native sync on every Android phone',
            'No Android app (share via Google Calendar if partner uses Android)',
          ],
        },
        {
          cells: [
            'Permission granularity',
            'View & Edit OR View Only per Apple Account invitee',
            'See free/busy, See all details, Make changes, or Manage sharing',
            'Reader, Writer & Owner roles (whole calendar or single event)',
          ],
        },
        {
          cells: [
            'Sharing a single event without exposing whole calendar',
            'Standard email/iCalendar attendee invite',
            'Standard Google attendee invite',
            'Share link, QR code, email, or iPhone App Clip event card',
          ],
        },
        {
          cells: [
            'Push alert when partner adds/edits a pickup',
            'Native iOS "Shared Calendar Changes" notification option',
            'Optional email notifications for new/changed/canceled events',
            'In-app sync + configurable iOS event reminder alerts',
          ],
        },
        {
          cells: [
            'Side-by-side column view per family member on iPhone',
            'Overlaid in Apple Calendar; side-by-side when opened in Cloud Calendars',
            'Overlaid in Google app; side-by-side when opened in Cloud Calendars',
            'Multi-calendar Day view gives Mom, Dad & Kids separate columns',
          ],
        },
        {
          cells: [
            'Outdoor sports & weekend weather beside family events',
            'Requires opening Apple Weather separately (unless viewed in Cloud Calendars)',
            'No weather on iOS (unless viewed in Cloud Calendars)',
            'Hourly & up-to-10-day Apple WeatherKit forecasts built in (Free)',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'Why Shared Google Calendars Sometimes Disappear on iPhone (and the Fix)',
        body: [
          'The number-one frustration for mixed iPhone + Android couples is accepting a Shared Google Calendar invite and seeing nothing inside Apple Calendar. When you connect Google via iPhone `Settings > Calendar Accounts` (Apple’s legacy CalDAV connector), Google hides newly shared secondary calendars until you visit `calendar.google.com/calendar/syncselect` in a browser and check the box for that calendar.',
          'Connecting via direct Sign in with Google inside Cloud Calendars (or opening the Google Calendar app) bypasses that hidden CalDAV syncselect page and displays your shared family calendars alongside your personal iCloud calendars immediately.',
        ],
        table: {
          heading: 'Account Sync, Protocol & Platform Support for Family Setups',
          caption: 'How family members connect and edit shared schedules across devices',
          columns: ['Setup Dimension', 'Shared iCloud Calendar', 'Shared Google Calendar', 'Cloud Calendars (Viewer + Sharing)'],
          rows: [
            {
              cells: [
                'iPhone & iPad access',
                'Native iOS Settings > iCloud > Calendars',
                'Direct Google OAuth in Cloud Calendars (Free) or Google app',
                'Native iOS/iPadOS 18.0+ app reading both iCloud & Google',
              ],
            },
            {
              cells: [
                'Android smartphone access',
                'Public read-only webcal link or third-party DAVx5 workaround',
                'Built into Android OS & pre-installed Google Calendar',
                'Not available on Android (use Shared Google backend)',
              ],
            },
            {
              cells: [
                'Windows & Web browser access',
                'iCloud.com web or iCloud for Windows Outlook add-in',
                'Full calendar.google.com web experience in any browser',
                'Google/iCloud backends remain accessible on their web portals',
              ],
            },
            {
              cells: [
                'Child accounts (under 13)',
                'Supported via Apple Family Sharing child Apple Accounts',
                'Google Family Link accounts have restrictions on some sharing settings',
                'Displays whichever family calendars are on the iPhone/iPad',
              ],
            },
            {
              cells: [
                'School & team `.ics` feeds',
                'iOS ICS subscriptions can sync across your own iCloud devices, not shared to family automatically',
                'Each parent subscribes or imports onto a shared calendar',
                'Renders iOS subscribed ICS feeds right next to family columns',
              ],
            },
            {
              cells: [
                'Account requirement for native Cloud Calendars sharing',
                'Apple Account required for private read/write iCloud sharing',
                'Google Account required for two-way editing',
                'Verified email sign-in in Cloud Calendars required for Reader/Writer sharing',
              ],
            },
          ],
        },
      },
      {
        heading: 'Pricing and Household Architecture Recommendations',
        body: [
          'Neither iCloud Shared Calendars nor Google Shared Calendars costs money—both run on standard free Apple and Google accounts. Your real decision is picking the right underlying cloud host for your family’s phones, then choosing the clearest daily iPhone interface on top.',
          'Because Cloud Calendars includes iCloud access, direct Google OAuth, Multi-calendar side-by-side columns, Home Screen widgets, and Apple WeatherKit in its $0 Free plan (or $4.99/year ad-free Advanced), iPhone parents do not have to choose between iCloud and Google—they can view both together on one grid.',
        ],
        table: {
          heading: 'Pricing & Best Choice by Family Scenario',
          caption: 'Zero-cost and low-cost sharing setups matched to household device combinations',
          columns: ['Household Scenario', 'Recommended Cloud Backend', 'Recommended iPhone App', 'Total Cost'],
          rows: [
            {
              cells: [
                'Both partners & teens use iPhone / iPad / Mac exclusively',
                'Shared iCloud Calendar (Apple Family Sharing)',
                'Cloud Calendars (columns + weather) or Apple Calendar',
                '$0 Free (or $4.99/yr ad-free)',
              ],
            },
            {
              cells: [
                'One partner on iPhone, one partner on Samsung / Pixel Android',
                'Shared Google Calendar (Make changes to events)',
                'Cloud Calendars on iPhone + Google Calendar on Android',
                '$0 Free (or $4.99/yr ad-free)',
              ],
            },
            {
              cells: [
                'Grandparent or babysitter only needs Saturday’s soccer game details',
                'Single-event share (no full calendar access)',
                'Cloud Calendars single-event link / QR / iPhone App Clip',
                '$0 Free',
              ],
            },
            {
              cells: [
                'Wall-mounted iPad in kitchen showing 4 family members’ lanes',
                'Shared iCloud or Shared Google calendars per person',
                'Cloud Calendars on iPad (landscape Week or Multi-calendar columns)',
                '$0 Free or $4.99/yr ad-free',
              ],
            },
            {
              cells: [
                'Adding one parent’s Microsoft 365 work schedule beside family pickups',
                'Exchange/M365 + Shared iCloud/Google',
                'Cloud Calendars (via iOS Exchange or $49.99/yr Premium)',
                '$0 via iOS Settings or $49.99/yr',
              ],
            },
            {
              cells: [
                'Family wants shared grocery lists, dinner recipes & chat threads inside one app',
                'Dedicated family portal',
                'Cozi Family Organizer or TimeTree',
                '$0 w/ ads or ~$39–$45/yr',
              ],
            },
          ],
        },
      },
      {
        heading: 'One Calendar Per Person vs One Shared "Family" Calendar',
        body: [
          'Creating one shared calendar called "Family" works well for couples, but once two children have separate school, music, and soccer schedules, a single color quickly becomes unreadable.',
          'Create one shared color-coded calendar per person or activity ("Family Logistics", "Maya Activities", "Leo Sports") and open Cloud Calendars’ Multi-calendar Day view on busy mornings to see right away which parent is free for the 15:30 pickup.',
        ],
      },
      {
        heading: 'Avoiding the Pending iCloud Invite Email Trap',
        body: [
          'When an iCloud calendar invite never arrives, check which email address you typed: inviting a spouse’s `@gmail.com` address that is NOT registered as their Apple Account email sends a confusing web link instead of an in-app iPhone calendar prompt.',
          'Always send private iCloud calendar invitations to the exact primary email address shown at the top of the recipient’s iPhone `Settings > [Name]` screen.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Audit every adult and teen’s phone OS first: pick Shared iCloud for all-Apple homes and Shared Google Calendar if anyone uses Android or Windows.',
      'On iPhone, connect both iCloud (via EventKit) and Google (via Sign in with Google) inside Cloud Calendars so you never miss events from either side.',
      'If a shared Google calendar is missing from Apple Calendar, sign into Google directly in Cloud Calendars or enable it at calendar.google.com/calendar/syncselect.',
      'Use distinct calendar colors per family member and open Multi-calendar Day view to check overlapping afternoon pickups.',
      'Use single-event link, QR, or App Clip sharing for babysitters and relatives instead of granting permanent whole-calendar access.',
    ],
    faq: [
      {
        q: 'Can an Android user edit a Shared iCloud Calendar?',
        a: 'Not natively. Apple’s "Public Calendar" link is strictly read-only for non-Apple users, and two-way editing on Android requires configuring a third-party CalDAV sync app with an Apple app-specific password. A Shared Google Calendar is much easier for mixed iPhone + Android couples.',
      },
      {
        q: 'Why doesn’t a shared Google Calendar show up in my iPhone’s built-in Calendar app?',
        a: 'Apple’s system Google connector uses CalDAV, which hides newly shared calendars until you check them on Google’s hidden `calendar.google.com/calendar/syncselect` page. Signing into Google via OAuth inside Cloud Calendars displays shared Google calendars directly.',
      },
      {
        q: 'How does Cloud Calendars’ App Clip sharing work for family events?',
        a: 'When you share a single event from Cloud Calendars, an iPhone recipient can open a lightweight App Clip card to preview the time and location immediately; installing the full app is required if they want to save it into Cloud Calendars.',
      },
    ],
    sourcesHeading: 'Official Apple and Google family calendar sharing guides',
    sources: [
      { label: 'Apple Support: Share iCloud calendars on iPhone', url: 'https://support.apple.com/guide/iphone/share-icloud-calendars-iph7613c4fb/ios' },
      { label: 'Google Support: Share your calendar with someone', url: 'https://support.google.com/calendar/answer/37082' },
      { label: 'Google Support: Sync shared Google calendars to Apple Calendar (syncselect)', url: 'https://support.google.com/calendar/answer/99358' },
      { label: 'Cloud Calendars on the App Store', url: 'https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319' },
    ],
    relatedComparisons: [
      { slug: 'cloud-calendars-vs-timetree-family-sharing', label: 'Cloud Calendars vs TimeTree for Couples & Families' },
      { slug: 'cloud-calendars-vs-cozi-family-organizer', label: 'Cloud Calendars vs Cozi Family Organizer' },
      { slug: 'merge-icloud-google-outlook-exchange-calendars-iphone', label: 'Merge iCloud, Google & Outlook Calendars on iPhone' },
    ],
    seeAlso: [
      'cozi-timetree-family-calendar-iphone-android',
      'why-a-shared-calendar-does-not-appear',
      'google-calendars-that-never-reach-your-iphone',
      'family-pickup-calendar-handoff',
    ],
  },

  'work-exchange-microsoft-365-and-personal-icloud-iphone': {
    updated: '2026-11-04',
    seoTitle: 'Work Exchange / M365 + Personal iCloud on iPhone',
    title: 'Work Exchange / M365 + Personal iCloud on iPhone',
    short: 'Work Exchange/M365 + Personal iCloud',
    description:
      'Compare safe architectures for viewing a corporate Exchange or Microsoft 365 calendar alongside personal iCloud and Gmail on iPhone without leaking private event titles to IT.',
    lede: 'Combining a corporate Microsoft 365 or Exchange calendar with personal iCloud on a personal iPhone raises two practical worries: "Can workplace IT read my private iCloud appointments?" and "Will I accidentally save a doctor’s visit onto my company calendar?" When you view both accounts side by side in an iOS client like Cloud Calendars or Apple Calendar—rather than importing or syncing personal events into Exchange—your iCloud data stays exclusively in Apple’s store and never touches employer servers, provided you set your Default Calendar to iCloud. Arte Soft develops Cloud Calendars and publishes this comparison.',
    comparison: {
      heading: 'Work Exchange / M365 + Personal iCloud Architecture Matrix',
      caption: 'Comparing 4 ways to view corporate Microsoft 365 and personal iCloud schedules on iPhone',
      columns: ['Privacy & Workflow Check', 'Cloud Calendars (Side-by-Side)', 'Apple Calendar (iOS System)', 'Outlook Mobile App', 'Publishing iCloud ICS into Work M365'],
      rows: [
        {
          cells: [
            'Does employer Exchange server receive personal iCloud titles?',
            'No — client-side visual merge only on your iPhone/iPad',
            'No — client-side visual merge only on your iPhone/iPad',
            'Local calendar toggle stays on device (check org policy before adding iCloud account)',
            'Yes — Microsoft 365 server fetches and stores your ICS feed copy',
          ],
        },
        {
          cells: [
            'Visual separation between Work & Personal',
            'Multi-calendar Day view puts Work & Personal in separate columns',
            'Color-coded bars overlaid in a single column',
            'Color-coded bars inside an app that also shows work emails',
            'Appears inside desktop & mobile Outlook',
          ],
        },
        {
          cells: [
            'Microsoft Teams meeting link support',
            'Supported via Sign in with Microsoft OAuth (Premium)',
            'Displays existing Teams join URLs in notes/location',
            'Native one-tap Teams toggle & presence status',
            'Not applicable to personal ICS feed',
          ],
        },
        {
          cells: [
            'Works when Intune MAM blocks third-party Graph OAuth?',
            'Only if iOS Exchange calendar store access is allowed by MDM',
            'Works if MDM permits native iOS Exchange profile',
            'Works under strict Microsoft Intune App Protection Policies',
            'Works if external webcal subscriptions are allowed in OWA',
          ],
        },
        {
          cells: [
            'Off-hours calm (weekends without work inbox badges)',
            'Zero email inbox + one-tap toggle to hide Work calendar on Friday at 18:00',
            'Zero email inbox + calendar visibility checkboxes',
            'Work unread email badges sit right beside calendar tab',
            'Personal events remain stored on work account until removed',
          ],
        },
        {
          cells: [
            'Commute & business-trip weather context',
            'Hourly & up-to-10-day Apple WeatherKit forecasts built in',
            'Separate Apple Weather app required',
            'Minimal desktop weather icon; limited mobile hourly detail',
            'None',
          ],
        },
        {
          cells: [
            'Clean offboarding when changing jobs',
            'Sign out of Microsoft / remove iOS Exchange account; iCloud untouched',
            'Remove Exchange account in iOS Settings; iCloud untouched',
            'Delete Outlook app or work account',
            'Must remember to revoke secret iCloud URL and delete feed in OWA',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'Two Ways to Connect Work Microsoft 365 in Cloud Calendars',
        body: [
          'Corporate Microsoft 365 tenants vary widely in how Microsoft Entra ID (formerly Azure AD) governs mobile apps. Some organizations allow approved OAuth clients, others allow Apple’s native iOS Exchange profile, and strict financial or healthcare tenants lock corporate data exclusively inside Microsoft Outlook Mobile via Intune App Protection Policies.',
          'Cloud Calendars supports two distinct routes on iPhone and iPad: (1) if your Exchange or Microsoft 365 calendar is already added in `iOS Settings > Apps > Calendar > Calendar Accounts`, Cloud Calendars can display it via EventKit at $0; (2) if you want direct Microsoft OAuth sign-in and Microsoft Teams link generation inside Cloud Calendars without touching iOS Mail/Calendar settings, Cloud Calendars Premium connects via Sign in with Microsoft.',
        ],
        table: {
          heading: 'Account Sync, MDM Policy & Platform Compatibility',
          caption: 'Matching corporate IT policies to the right iPhone calendar setup',
          columns: ['IT / MDM Policy Level', 'What IT Allows', 'How Cloud Calendars Works', 'Fallback If Blocked'],
          rows: [
            {
              cells: [
                'Standard Microsoft 365 / Outlook.com',
                'User OAuth consent + standard Exchange',
                'Direct Sign in with Microsoft + Teams (Premium) or iOS Exchange (Free)',
                'None needed — full two-way read/write',
              ],
            },
            {
              cells: [
                'Entra Admin Consent Required for Third-Party OAuth',
                'Blocks unverified third-party Graph apps, allows Apple iOS native Exchange',
                'Add Exchange in iOS Settings > Calendar Accounts; read via EventKit in Cloud Calendars',
                'Request Entra app approval or use iOS native profile',
              ],
            },
            {
              cells: [
                'Strict Intune MAM Container (Managed Apps Only)',
                'Blocks both third-party OAuth and unmanaged iOS native Calendar store',
                'Cannot read corporate Exchange container (enforced by OS security)',
                'Use Outlook Mobile for work; keep iCloud + Google in Cloud Calendars',
              ],
            },
            {
              cells: [
                'Personal iCloud + Personal Gmail alongside Work',
                'Personal accounts owned by you',
                'iCloud via EventKit + Sign in with Google OAuth + Meet (Free)',
                '100% independent of employer tenant',
              ],
            },
            {
              cells: [
                'Device Wipe Scope (BYOD vs Corporate Phone)',
                'Exchange account remote wipe vs full MDM enrollment',
                'Removing Exchange account leaves iCloud/Google untouched',
                'Avoid full device supervision on personal phones if MAM-only is offered',
              ],
            },
            {
              cells: [
                'Supported Hardware',
                'Mobile BYOD',
                'iPhone & iPad (iOS / iPadOS 18.0+)',
                'Use Apple Calendar or Outlook on Mac/Windows desktop',
              ],
            },
          ],
        },
      },
      {
        heading: 'Pricing and Safest Work + Personal Configurations',
        body: [
          'Before subscribing to any calendar app solely for work sync, test your company’s login policy first. If your Exchange calendar already appears inside Apple’s built-in iPhone Calendar app, Cloud Calendars can read that device calendar immediately in the Free tier alongside your personal iCloud and Gmail accounts.',
          'Upgrade to Cloud Calendars Premium ($4.99/month or $49.99/year) when you specifically want direct Sign in with Microsoft OAuth and native Microsoft Teams link creation inside Cloud Calendars.',
        ],
        table: {
          heading: 'Pricing & Best Choice by Work + Personal Scenario',
          caption: 'Cost and privacy guidance for balancing Microsoft 365 work calendars with personal iCloud',
          columns: ['User Scenario', 'Cloud Calendars', 'Apple Calendar / Outlook', 'Best Choice'],
          rows: [
            {
              cells: [
                'Exchange already synced in iOS Settings + personal iCloud + weather',
                'Reads iOS Exchange + iCloud + WeatherKit in Free ($0) or $4.99/yr ad-free',
                'Apple Calendar ($0, no weather or column view)',
                'Cloud Calendars (Free / Advanced)',
              ],
            },
            {
              cells: [
                'Direct Microsoft 365 OAuth + Teams links + Gmail + iCloud columns',
                'Premium ($4.99/mo or $49.99/yr) unifies all three + Teams & Meet',
                'Outlook Mobile ($0, mixes work email with calendar)',
                'Cloud Calendars Premium',
              ],
            },
            {
              cells: [
                'Strict Intune MAM blocks all non-Microsoft apps from reading work data',
                'Use Free/Advanced for personal iCloud + Google + weather',
                'Outlook Mobile ($0) required for locked corporate calendar',
                'Outlook (Work) + Cloud Calendars (Personal)',
              ],
            },
            {
              cells: [
                'Hiding work meetings completely on weekends and vacations',
                'Uncheck Work calendar in 2 taps; zero unread email badges',
                'Outlook still shows unread work mail badge unless notifications muted',
                'Cloud Calendars',
              ],
            },
            {
              cells: [
                'Preventing accidental private events on company Exchange',
                'Set default calendar to Personal iCloud + verify color chip before saving',
                'Set iOS Settings > Calendar > Default Calendar to iCloud',
                'Cloud Calendars + iOS Default Calendar check',
              ],
            },
            {
              cells: [
                'Booking corporate conference rooms & checking 15 coworkers’ free/busy',
                'Does not query Exchange Room Lists or org free/busy',
                'Outlook Mobile ($0) includes Room Finder & Scheduling Assistant',
                'Outlook Mobile',
              ],
            },
          ],
        },
      },
      {
        heading: 'The One Setting Every BYOD iPhone User Must Check Today',
        body: [
          'Adding an Exchange account in iPhone Settings very frequently switches `Settings > Apps > Calendar > Default Calendar` to your work calendar. Two weeks later, you quickly add "Therapy 16:00" or "Interview with Acme Corp" without checking the calendar picker, writing the full title straight onto your employer’s Exchange server where delegates or admins can see it.',
          'Open `Settings > Apps > Calendar > Default Calendar` right now and set it permanently to a personal iCloud or Gmail calendar, then only switch the picker manually when intentionally creating a work meeting.',
        ],
      },
      {
        heading: 'Weekend Boundaries Without Deleting Your Work Account',
        body: [
          'Checking Saturday soccer times inside Outlook Mobile almost always pulls your eyes toward a badge of 14 unread Friday-night emails. Keeping your combined schedule in a dedicated calendar app lets you toggle the corporate calendar off on Friday evening and turn it back on Sunday night in two taps.',
          'Your work account remains synced in the background without occupying mental space during family hours.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Immediately open iPhone Settings > Apps > Calendar > Default Calendar and set it to a personal iCloud or Google calendar—never your employer’s Exchange calendar.',
      'Check whether your work Exchange calendar is already permitted in iOS Calendar Accounts (readable in Cloud Calendars for $0) or connect via Sign in with Microsoft in Premium.',
      'Use distinct high-contrast colors (such as navy for Work M365 and warm green for Personal iCloud) so a wrong-calendar draft stands out instantly.',
      'Open Multi-calendar Day view in Cloud Calendars on weekday mornings to compare work calls and personal commitments in separate columns.',
      'When blocking time on your work calendar for a personal errand, create a manual event titled simply "Busy" or "Personal Appointment" marked Private rather than publishing your iCloud ICS link.',
    ],
    faq: [
      {
        q: 'Can my company see my personal iCloud Calendar if I add Exchange to my iPhone?',
        a: 'No—merely viewing an Exchange account alongside iCloud on your iPhone does not upload your iCloud events to Microsoft 365. Your employer can only see events you accidentally save onto the Exchange calendar itself (or if you enrolled a personal phone in invasive full-device MDM supervision rather than standard Exchange/MAM).',
      },
      {
        q: 'What happens to my iCloud events if IT wipes my work Exchange account when I leave my job?',
        a: 'Removing an Exchange account (or triggering an account-scoped Exchange/Intune selective wipe) deletes only corporate mail, contacts, and Exchange calendar entries, leaving your iCloud and Google calendars intact.',
      },
      {
        q: 'Why does Sign in with Microsoft say "Need admin approval" on my work account?',
        a: 'Many Microsoft Entra ID admins require explicit IT approval before third-party OAuth apps can access corporate Graph data. Check whether native iOS Exchange sync is allowed in iPhone Settings, or keep Outlook Mobile for work.',
      },
    ],
    sourcesHeading: 'Official Microsoft Entra, Intune, and Apple BYOD references',
    sources: [
      { label: 'Microsoft Learn: What data can my organization see in Intune?', url: 'https://learn.microsoft.com/en-us/mem/intune/user-help/what-info-can-your-company-see-when-you-enroll-your-device-in-intune' },
      { label: 'Apple Support: Set up Exchange ActiveSync on iPhone', url: 'https://support.apple.com/guide/deployment/exchange-activesync-dep158966b83/web' },
      { label: 'Apple Support: Change your default calendar on iPhone', url: 'https://support.apple.com/guide/iphone/use-multiple-calendars-iph3d1110d4/ios' },
      { label: 'Cloud Calendars on the App Store', url: 'https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319' },
    ],
    relatedComparisons: [
      { slug: 'cloud-calendars-vs-microsoft-outlook-mobile', label: 'Cloud Calendars vs Microsoft Outlook Mobile' },
      { slug: 'merge-icloud-google-outlook-exchange-calendars-iphone', label: 'Merge iCloud, Google & Outlook Calendars on iPhone' },
      { slug: 'privacy-first-direct-sync-vs-cloud-relay-calendar-apps', label: 'Direct Sync vs Cloud-Relay Calendar Privacy on iOS' },
    ],
    seeAlso: [
      'exchange-calendars-on-an-iphone',
      'work-and-personal-without-two-apps',
      'event-saved-to-wrong-calendar',
      'disconnect-calendar-integration-without-losing-track',
    ],
  },
};
