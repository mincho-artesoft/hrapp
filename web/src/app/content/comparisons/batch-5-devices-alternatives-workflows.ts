import type { LocalisedArticle } from '../types';

export const COMPARISONS_BATCH_5: Readonly<Record<string, LocalisedArticle>> = {
  'best-ipad-and-mac-calendar-app-comparison': {
    updated: '2026-11-04',
    seoTitle: 'iPad & Mac Calendar Apps Compared: Views & Sync',
    title: 'iPad & Mac Calendar Apps Compared: Views & Sync',
    short: 'iPad & Mac Calendar Apps Compared',
    description:
      'Compare landscape iPad planning and macOS desktop calendar apps: Cloud Calendars (iPhone & iPad), Apple Calendar, Fantastical, BusyCal, Calendars by Readdle, and Notion Calendar.',
    lede: 'iPad and Mac planners have different strengths: an 11-inch or 13-inch iPad excels at touch drag-and-drop, kitchen-counter family dashboards, and side-by-side multi-calendar columns, whereas a Mac favors keyboard shortcuts and menu-bar countdowns. Cloud Calendars is built natively for iPhone and iPad (`iOS / iPadOS 18.0+`)—delivering spacious iPad Day, Week, Month, Year, List, Multi-calendar columns, and Apple WeatherKit forecasts—and does not ship a dedicated macOS client. Because events sync directly through iCloud, Google Calendar, and Microsoft 365, you can run Cloud Calendars on iPad and iPhone while using Apple Calendar, Notion Calendar, or BusyCal on your Mac without lock-in. Arte Soft develops Cloud Calendars and publishes this comparison.',
    comparison: {
      heading: 'iPad & Mac Calendar Apps Matrix',
      caption: 'Comparing native iPadOS layouts, macOS desktop features, weather, and cross-device sync',
      columns: ['Tablet & Desktop Capability', 'Cloud Calendars', 'Apple Calendar', 'Fantastical / Readdle', 'BusyCal / Notion Calendar'],
      rows: [
        {
          cells: [
            'Native iPadOS interface',
            'Yes — full-screen landscape & portrait Day, Week, Month, Year & Multi-column views',
            'Yes — native iPadOS Split View, Slide Over & Apple Pencil support',
            'Yes — full-screen iPad grids, tasks & customizable sidebars',
            'Yes in BusyCal iOS; Notion Calendar runs mobile iOS layout on iPad',
          ],
        },
        {
          cells: [
            'Native macOS desktop app',
            'No — iPhone & iPad (`iOS / iPadOS 18.0+`) only',
            'Yes — pre-installed on every Mac',
            'Yes — native macOS app + menu-bar mini calendar',
            'Yes — power-user macOS apps for both BusyCal & Notion Calendar',
          ],
        },
        {
          cells: [
            'Side-by-side per-calendar columns on iPad',
            'Dedicated Multi-calendar Day view (one column per person/account)',
            'Single merged timeline per day',
            'Merged timeline (filtered by Calendar Sets)',
            'Merged timeline',
          ],
        },
        {
          cells: [
            'Built-in iPad weather station',
            'Full Apple WeatherKit hub + hourly/daily forecasts in Free ($0)',
            'No weather inside iPad or Mac Calendar',
            'Fantastical Premium (~$57/yr); none in Readdle',
            'Included in BusyCal; none in Notion Calendar',
          ],
        },
        {
          cells: [
            'Menu-bar quick calendar on Mac',
            'Not applicable (no Mac app)',
            'None built in (pair with Calendar 366 / Itsycal)',
            'Built-in Mac menu-bar dropdown & join button',
            'BusyCal menu-bar app; Notion Calendar menu-bar countdown',
          ],
        },
        {
          cells: [
            'Kitchen-counter / wall-stand iPad suitability',
            'High — readable Month chips, family columns & date+weather widgets',
            'Good for clean Month grid; no weather or family lanes',
            'Strong in Fantastical; pricey if used solely as family display',
            'BusyCal customizable fonts; Notion lacks iPad Month grid polish',
          ],
        },
        {
          cells: [
            'Touch drag, drop & resize on iPad',
            'Move across hours/days & resize durations directly on grid',
            'Native touch & trackpad drag-and-drop',
            'Touch & trackpad drag-and-drop + task time-blocking',
            'Supported in BusyCal',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'Why You Don’t Need the Exact Same App on iPad and Mac',
        body: [
          'A common misconception is that picking a calendar app on iPad or iPhone locks your Mac into the same vendor’s subscription. Unlike proprietary note-taking apps, calendar events live in standard cloud backends—Apple iCloud, Google Calendar, Microsoft 365, or CalDAV.',
          'When you drag a Google or iCloud meeting from Tuesday to Thursday on your iPad inside Cloud Calendars, that change syncs straight to Google or iCloud and updates inside macOS Apple Calendar or Notion Calendar on your MacBook seconds later.',
        ],
        table: {
          heading: 'Account Sync, Hardware & Widget Support Across iPad and Mac',
          caption: 'How accounts, widgets, and hardware platforms line up across leading Apple ecosystem calendars',
          columns: ['Dimension', 'Cloud Calendars', 'Apple Calendar', 'Fantastical', 'Notion Calendar'],
          rows: [
            {
              cells: [
                'Google Calendar & Meet',
                'Direct Google OAuth + Meet links in Free ($0)',
                'macOS/iOS System Settings account',
                'Google OAuth + Meet (multi-set in Premium)',
                'First-class Google OAuth + Meet ($0)',
              ],
            },
            {
              cells: [
                'Microsoft 365 / Exchange & Teams',
                'Microsoft OAuth + Teams (Premium) or iOS Exchange store',
                'macOS/iOS Exchange account support',
                'Microsoft 365 + Teams (Premium)',
                'Basic Microsoft / Outlook preview support',
              ],
            },
            {
              cells: [
                'Apple iCloud Calendar',
                'Native iPadOS/iOS EventKit permission (Free)',
                'First-party iCloud Push on iPad & Mac',
                'EventKit or cloud Flexibits sync',
                'Requires Apple ID app-specific password',
              ],
            },
            {
              cells: [
                'iPad Home Screen widgets',
                'Small/Medium Date+Weather & Medium/Large Timed Event lists',
                'Small, Medium, Large & XL iPad widgets',
                'Small through XL iPad widgets',
                'Basic mobile Up Next widget',
              ],
            },
            {
              cells: [
                'macOS Desktop & Notification Center widgets',
                'No macOS app (iPhone/iPad widgets on Mac Continuity vary by macOS)',
                'Native macOS Sonoma/Sequoia desktop widgets',
                'Native macOS desktop widgets',
                'Desktop app + menu-bar upcoming title',
              ],
            },
            {
              cells: [
                'Supported OS versions',
                'iOS / iPadOS 18.0+',
                'Bundled with iOS, iPadOS & macOS',
                'iOS, iPadOS, macOS, watchOS, visionOS & Windows',
                'macOS, Windows, Web, iOS & Android',
              ],
            },
          ],
        },
      },
      {
        heading: 'Pricing Comparison: iPad Family Display vs Full Desktop Suite',
        body: [
          'Dedicated wall-mounted hardware calendars like Skylight Calendar or Hearth Display often cost $300+ for the screen plus $40–$80/year for weather or photo features. Repurposing an existing iPad on a kitchen stand running Cloud Calendars gives your household a touch-screen Month grid, Multi-calendar family columns, and live Apple WeatherKit forecasts for $0 (or $4.99/year ad-free).',
          'For Mac-heavy keyboard workflows, pair Cloud Calendars on iPhone/iPad with Apple Calendar ($0), Notion Calendar ($0), Itsycal ($0 Mac menu bar), or Calendar 366 II (~$14.99 one-time Mac) instead of paying ~$57–$90/year unless you actively use Flexibits Openings and collaborative sets.',
        ],
        table: {
          heading: 'Pricing & Best Choice by iPad + Mac Combination',
          caption: 'Cost-effective app combinations across iPhone, iPad, and Mac',
          columns: ['Hardware Workflow', 'Recommended iPad / iPhone App', 'Recommended Mac App', 'Combined Annual Cost'],
          rows: [
            {
              cells: [
                'Google + iCloud + Weather on iPad/iPhone + clean Mac viewing',
                'Cloud Calendars ($0 Free or $4.99/yr Advanced)',
                'Apple Calendar ($0) + optional Itsycal ($0)',
                '$0 – $4.99 / year',
              ],
            },
            {
              cells: [
                'Kitchen-counter iPad family dashboard (replace $300 Skylight)',
                'Cloud Calendars on iPad (Multi-column + Month + WeatherKit)',
                'Shared iCloud / Google editable from any Mac browser',
                '$0 – $4.99 / year',
              ],
            },
            {
              cells: [
                'Google Workspace + Notion docs on Mac + iCloud/weather on iPad',
                'Cloud Calendars ($0 / $4.99 yr)',
                'Notion Calendar ($0)',
                '$0 – $4.99 / year',
              ],
            },
            {
              cells: [
                'Identical single-vendor app with NLP & Openings on Mac + iPad + Windows',
                'Fantastical iPad',
                'Fantastical Mac',
                '~$56.99 / year',
              ],
            },
            {
              cells: [
                'Power-user smart filters & custom CalDAV with one-time licenses',
                'BusyCal iOS ($14.99 one-time)',
                'BusyCal Mac (~$49.99 one-time)',
                '~$65 one-time upfront',
              ],
            },
            {
              cells: [
                'Microsoft 365 + Teams across iPad, iPhone & corporate MacBook',
                'Cloud Calendars Premium ($49.99/yr) or iOS Exchange ($0)',
                'Microsoft Outlook for Mac or Apple Calendar',
                '$0 – $49.99 / year',
              ],
            },
          ],
        },
      },
      {
        heading: 'Setting Up an iPad as a Shared Household Command Center',
        body: [
          'Because iPadOS does not support multi-user login profiles like macOS, an iPad parked in the kitchen should only connect to shared household calendars rather than one parent’s private email inbox. Create a dedicated family Google account or shared iCloud calendars, open Cloud Calendars in landscape Week or Multi-calendar view, and place the `Calendar & Weather` widget on the iPad Home Screen.',
          'Remember that an account working on your iPhone does not automatically mean the iPad has granted calendar permission—open Cloud Calendars on the iPad itself to verify permissions and loaded events.',
        ],
      },
      {
        heading: 'Landscape Week View on iPad: Where Grids Finally Breathe',
        body: [
          'On a phone screen, 7-day Week grids inevitably abbreviate titles; on an iPad in landscape orientation, seven wide columns display full appointment names, daily weather highs and lows, and multi-day banners without squinting.',
          'You can drag meetings across days with a finger or Apple Pencil and jump up to the 12-month Year view whenever school holidays or quarterly travel come up.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Install Cloud Calendars on your iPad (`iPadOS 18.0+`) and confirm Calendar permissions directly on the iPad rather than assuming iPhone settings carry over.',
      'Rotate your iPad into landscape Week view or Multi-calendar Day view to compare family or work lanes without truncated titles.',
      'On your Mac, open Apple Calendar (or Notion Calendar for Google Workspace) signed into the same iCloud/Google accounts for instant cloud sync.',
      'Add Cloud Calendars’ Calendar Events Large and Calendar & Weather widgets to your iPad Home Screen for walk-by visibility.',
    ],
    faq: [
      {
        q: 'Is there a native Cloud Calendars app for Mac?',
        a: 'No. Cloud Calendars is built specifically for iPhone and iPad (`iOS / iPadOS 18.0+`). Because your events sync directly with iCloud, Google Calendar, and Microsoft 365, edits made in Cloud Calendars appear automatically in Apple Calendar, Outlook, or Notion Calendar on your Mac.',
      },
      {
        q: 'Can an iPad running Cloud Calendars replace a Skylight wall calendar?',
        a: 'For many families, yes: an existing iPad on a stand running Cloud Calendars displays color-coded Month chips, side-by-side family columns, Home Screen widgets, and Apple WeatherKit forecasts without buying $300 single-purpose hardware.',
      },
      {
        q: 'Do I have to pay twice to use Cloud Calendars on both my iPhone and my iPad?',
        a: 'No. The Free plan works on both devices at $0, and an Advanced or Premium App Store subscription tied to the same Apple Account covers both your iPhone and iPad.',
      },
    ],
    sourcesHeading: 'Official iPadOS and macOS calendar documentation',
    sources: [
      { label: 'Apple Support: View multiple calendars on iPad', url: 'https://support.apple.com/guide/ipad/use-multiple-calendars-ipad99cd52ab/ipados' },
      { label: 'Apple Support: Calendar User Guide for Mac', url: 'https://support.apple.com/guide/calendar/welcome/mac' },
      { label: 'Cloud Calendars on the App Store (iPhone & iPad)', url: 'https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319' },
    ],
    relatedComparisons: [
      { slug: 'fantastical-alternatives-cheaper-iphone-mac', label: 'Best Cheaper Fantastical Alternatives for iPhone & Mac' },
      { slug: 'cloud-calendars-vs-apple-calendar', label: 'Cloud Calendars vs Apple Calendar' },
      { slug: 'cloud-calendars-vs-busycal-ios-mac', label: 'Cloud Calendars vs BusyCal' },
    ],
    seeAlso: [
      'month-view-on-a-bigger-screen',
      'ipad-family-calendar-display-skylight-dakboard',
      'a-week-view-that-fits-a-week',
      'the-widget-that-shows-what-is-next',
    ],
  },

  'apple-watch-calendar-complications-comparison': {
    updated: '2026-11-04',
    seoTitle: 'Apple Watch Calendar Complications vs iPhone Live Activity',
    title: 'Apple Watch Calendar Complications vs iPhone Live Activity',
    short: 'Apple Watch Complications vs Live Activity',
    description:
      'Compare native Apple Watch calendar apps and complications (Apple Calendar, Fantastical, BusyCal, Google Calendar) with Cloud Calendars’ iPhone Lock Screen Live Activity and store sync.',
    lede: 'Before installing a calendar app for wrist glanceability, separate three completely different Apple surfaces: a dedicated watchOS app, a watch-face complication, and an iPhone Lock Screen Live Activity. Cloud Calendars builds Home Screen widgets and a Lock Screen Live Activity countdown for iPhone and iPad (`iOS / iPadOS 18.0+`)—it does not ship a dedicated Apple Watch app or watchOS complication. However, because Cloud Calendars reads iCloud/EventKit calendars and mirrors connected Google and Microsoft calendars into the iPhone calendar store, you can pair Cloud Calendars on your phone with Apple’s built-in Watch Calendar complication on your wrist—or choose Fantastical, Google Calendar (`watchOS 11+`), or BusyCal if you want a third-party watch client. Arte Soft develops Cloud Calendars and publishes this comparison.',
    comparison: {
      heading: 'Apple Watch Complications vs iPhone Live Activity Matrix',
      caption: 'Comparing wrist watchOS support, complications, task windows, and iPhone Lock Screen countdowns',
      columns: ['Glanceable Surface', 'Cloud Calendars', 'Apple Calendar (watchOS)', 'Google Calendar (watchOS 11+)', 'Fantastical / BusyCal'],
      rows: [
        {
          cells: [
            'Dedicated Apple Watch app',
            'No — iPhone & iPad app only',
            'Yes — pre-installed on every Apple Watch',
            'Yes — official watchOS 11+ companion app',
            'Yes — native watchOS apps for both Fantastical & BusyCal',
          ],
        },
        {
          cells: [
            'Watch-face complications & Smart Stack',
            'None from Cloud Calendars (use Apple Watch Calendar for mirrored iOS calendars)',
            'Circular, Corner, Rectangular, Modular & Smart Stack widgets',
            'Next event / task complication & Smart Stack card',
            'Configurable Calendar Set complications (Premium in Fantastical)',
          ],
        },
        {
          cells: [
            'iPhone Lock Screen Live Activity countdown',
            'Yes — live countdown on iPhone Lock Screen & Dynamic Island (Free)',
            'No persistent Live Activity countdown bar',
            'No iPhone Live Activity countdown',
            'Supported in Fantastical; standard alerts in BusyCal',
          ],
        },
        {
          cells: [
            'Future horizon visible on Apple Watch',
            'Depends on paired Watch app reading iOS store',
            'Current month & upcoming weeks synced from iPhone',
            'Strictly 7 days ahead (per Google’s watchOS help)',
            'Configurable multi-week horizon',
          ],
        },
        {
          cells: [
            'Create new events directly on wrist',
            'Not applicable (create on iPhone/iPad or via Siri)',
            'Yes — Watch Calendar UI or Siri voice',
            'No — Google requires iPhone or Web to create events/tasks',
            'Yes — dictation/scribble on wrist',
          ],
        },
        {
          cells: [
            'Tasks on Apple Watch',
            'Events only (no task checklists)',
            'Separate Apple Reminders Watch app',
            'Shows dated Google Tasks inside 7-day window',
            'Reminders/Tasks in Watch list',
          ],
        },
        {
          cells: [
            'Phone-off LTE Watch sync',
            'Not applicable',
            'Native iCloud sync over Wi-Fi/LTE',
            'Syncs via paired account',
            'Fantastical FAQ requires paired iPhone powered on & online',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'How Cloud Calendars Events Can Still Appear on Apple Watch’s Built-in Complication',
        body: [
          'Not shipping a custom watchOS binary does not mean events you manage in Cloud Calendars vanish from your wrist. Apple’s built-in Watch Calendar app mirrors calendars present in your paired iPhone’s system calendar store (`Watch app on iPhone > My Watch > Calendar`).',
          'iCloud and CalDAV events edited in Cloud Calendars update that system store directly, and Cloud Calendars’ direct Google and Microsoft connections create mirrored calendars in the iPhone calendar store (depending on available calendar sources). Always verify a test appointment in Apple Calendar on your iPhone and in `My Watch > Calendar` settings rather than assuming every display selects the same calendars automatically.',
        ],
        table: {
          heading: 'Account Sync, Wrist Visibility & Platform Support',
          caption: 'How events flow from iCloud, Google, and Microsoft onto Apple Watch vs iPhone Lock Screen',
          columns: ['Calendar Source', 'In Cloud Calendars (iPhone)', 'On Built-in Apple Watch Calendar', 'Dedicated Third-Party Watch App'],
          rows: [
            {
              cells: [
                'Apple iCloud Calendar',
                'Full read/write via EventKit (Free)',
                'Automatic via Apple Account & Watch Mirror My iPhone',
                'Fantastical, BusyCal & Readdle',
              ],
            },
            {
              cells: [
                'Google Calendar',
                'Direct Google OAuth (mirrors into iOS store) or iOS Settings (Free)',
                'Visible when mirrored/present in selected iPhone system calendars',
                'Official Google Calendar Watch app (7-day window)',
              ],
            },
            {
              cells: [
                'Microsoft 365 / Exchange',
                'Direct Microsoft OAuth (Premium) or iOS Exchange store',
                'Visible if Exchange/mirrored calendar is in selected iPhone store',
                'Microsoft Outlook Watch app or Fantastical',
              ],
            },
            {
              cells: [
                'Weather beside schedule',
                'Apple WeatherKit inside Day/Week grids & Home Screen widgets',
                'Pair Apple Calendar complication + Apple Weather complication on one watch face',
                'Fantastical Watch includes weather in Premium',
              ],
            },
            {
              cells: [
                'Wrist notification mirrors',
                'iOS notifications from Cloud Calendars can mirror to Apple Watch unless muted',
                'Native haptic Watch Calendar alerts',
                'App-specific Watch notifications',
              ],
            },
            {
              cells: [
                'Cost',
                '$0 Free ($4.99/yr ad-free Advanced)',
                '$0 built into watchOS',
                '$0 Google/Outlook; $14.99 BusyCal; ~$57/yr Fantastical',
              ],
            },
          ],
        },
      },
      {
        heading: 'Pricing and Pairing Strategy: Best Watch Face + Best iPhone Grid',
        body: [
          'Modular and Infograph watch faces let you combine complications from different publishers on a single dial. For most Apple Watch wearers, putting Apple’s native `Your Schedule` rectangular complication in the center and Apple’s `Temperature / Rain` circular complication in the corner costs $0, refreshes reliably with watchOS system priority, and stays in sync with iCloud and mirrored calendars edited in Cloud Calendars on your iPhone.',
          'Choose a paid third-party Watch calendar app only when you specifically need custom filtered Calendar Sets on a complication (Fantastical) or dated Google Tasks on your wrist (Google Calendar `watchOS 11+`, free).',
        ],
        table: {
          heading: 'Pricing & Best Choice by Wrist + Phone Scenario',
          caption: 'Matching Apple Watch and iPhone Lock Screen habits to the right combination',
          columns: ['User Scenario', 'Recommended Watch App', 'Recommended iPhone App', 'Total Cost'],
          rows: [
            {
              cells: [
                'Reliable Modular watch-face schedule + rich multi-column weather grid on iPhone',
                'Apple Watch Calendar + Apple Weather complications ($0)',
                'Cloud Calendars ($0 Free or $4.99/yr ad-free)',
                '$0 – $4.99 / year',
              ],
            },
            {
              cells: [
                'Seeing dated Google Tasks + next 7 days of Google events on wrist',
                'Official Google Calendar Watch app (`watchOS 11+`, $0)',
                'Cloud Calendars (for iCloud + Google + Year + Weather) or Google app',
                '$0',
              ],
            },
            {
              cells: [
                'No Apple Watch — checking countdowns on iPhone Lock Screen / StandBy',
                'None needed',
                'Cloud Calendars Live Activity + Date/Weather widgets ($0 Free)',
                '$0',
              ],
            },
            {
              cells: [
                'Switching Watch complication sets automatically by Focus / GPS',
                'Fantastical Apple Watch app',
                'Fantastical iOS (~$56.99/yr)',
                '~$56.99 / year',
              ],
            },
            {
              cells: [
                'Corporate Intune MAM blocks unmanaged iOS store; need work meetings on wrist',
                'Microsoft Outlook Apple Watch app ($0)',
                'Outlook Mobile (Work) + Cloud Calendars (Personal)',
                '$0',
              ],
            },
            {
              cells: [
                'Third-party Watch app with one-time purchase instead of subscription',
                'BusyCal Apple Watch companion',
                'BusyCal iOS ($14.99 one-time)',
                '$14.99 one-time',
              ],
            },
          ],
        },
      },
      {
        heading: 'Troubleshooting Missing Events on Apple Watch Before Changing Accounts',
        body: [
          'When an appointment appears on your iPhone but is missing from your watch face, check three layers in order before deleting or duplicating anything: (1) confirm the event appears in Apple Calendar on the paired iPhone; (2) open the `Watch` app on iPhone -> `My Watch > Calendar > Custom / Mirror my iPhone` to confirm that specific calendar is checked; and (3) tap into the Watch Calendar app itself, since compact complications hide simultaneous overlapping events or tomorrow’s items.',
          'Test with one disposable future test appointment in a writable calendar rather than dragging real client invitations between accounts.',
        ],
      },
      {
        heading: 'Avoiding Double Haptic Taps on Your Wrist',
        body: [
          'By default, watchOS mirrors notifications from newly installed iPhone apps. If both Apple Calendar and Cloud Calendars have notifications turned on, your wrist will buzz twice ten minutes before every call.',
          'Open the `Watch` app on iPhone -> `Notifications` and keep wrist alerts enabled for only one primary calendar app.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Use Cloud Calendars on iPhone and iPad for Day/Week/Month/Year grids, Multi-calendar columns, WeatherKit forecasts, and Lock Screen Live Activities.',
      'On Apple Watch, use Apple’s built-in Calendar complication (or Google Calendar on watchOS 11+ for Google Tasks) paired with an Apple Weather complication.',
      'Verify wrist calendar selection in the iPhone Watch app under My Watch > Calendar.',
      'Test visibility with one harmless future test event before altering real meetings.',
      'Mute duplicate Watch notification mirroring for whichever secondary calendar app you do not want buzzing your wrist.',
    ],
    faq: [
      {
        q: 'Does Cloud Calendars have an Apple Watch app or watch-face complication?',
        a: 'No. Cloud Calendars runs on iPhone and iPad (`iOS / iPadOS 18.0+`) with Home Screen widgets and an iPhone Lock Screen Live Activity countdown rather than a dedicated watchOS app.',
      },
      {
        q: 'Will events I add in Cloud Calendars show up on Apple’s built-in Apple Watch Calendar?',
        a: 'Events saved to iCloud, system calendars, or mirrored Google/Microsoft calendars in the iPhone calendar store can appear in Apple’s Watch Calendar app when those calendars are enabled under My Watch > Calendar. Check a test event on both phone and watch to confirm.',
      },
      {
        q: 'Why does the Google Calendar Apple Watch app stop showing events next month?',
        a: 'Google’s official Apple Watch app (`watchOS 11+`) intentionally displays only a rolling 7-day upcoming schedule window and requires your iPhone or web browser to create new items.',
      },
    ],
    sourcesHeading: 'Official watchOS and Live Activity documentation',
    sources: [
      { label: 'Apple Support: Check and update your calendar on Apple Watch', url: 'https://support.apple.com/guide/watch/calendar-apd1b51754cc/watchos' },
      { label: 'Google Calendar Help: Use Google Calendar on Apple Watch (7-day window & tasks)', url: 'https://support.google.com/calendar/answer/16404789' },
      { label: 'Flexibits: Fantastical Apple Watch setup and sync FAQ', url: 'https://flexibits.com/fantastical-watch/faq' },
      { label: 'Cloud Calendars on the App Store', url: 'https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319' },
    ],
    relatedComparisons: [
      { slug: 'best-iphone-calendar-widgets-home-and-lock-screen', label: 'Best iPhone Calendar Widgets: Home & Lock Screen' },
      { slug: 'cloud-calendars-vs-apple-calendar', label: 'Cloud Calendars vs Apple Calendar' },
      { slug: 'cloud-calendars-vs-fantastical', label: 'Cloud Calendars vs Fantastical' },
    ],
    seeAlso: [
      'calendar-on-apple-watch',
      'a-countdown-to-your-next-meeting',
      'lock-screen-without-unlocking',
      'calendar-notifications-missing-silent-or-duplicated',
    ],
  },

  'fantastical-alternatives-cheaper-iphone-mac': {
    updated: '2026-11-04',
    seoTitle: 'Best Cheaper Fantastical Alternatives for iPhone & Mac',
    title: 'Best Cheaper Fantastical Alternatives for iPhone & Mac',
    short: 'Cheaper Fantastical Alternatives',
    description:
      'Looking for a lower-cost alternative to Flexibits Premium (~$57/yr)? Compare Cloud Calendars ($0 / $4.99 yr ad-free), Apple Calendar ($0), Notion Calendar ($0), BusyCal, and Calendar 366.',
    lede: 'When Flexibits moved Fantastical’s multi-account Calendar Sets, full weather forecasts, conference join buttons, and Openings behind Flexibits Premium (`~$56.99/year` individual or `~$89.99/year` family), thousands of iPhone and Mac users started looking for lower-cost replacements. If your daily workflow lives on iPhone and iPad with Google Calendar, iCloud, widgets, and hourly weather, Cloud Calendars covers the core job for `$0` in Free or `$4.99/year` ad-free—saving over `$50` every year. If you also need native macOS apps, one-time licenses, or natural-language typing, Apple Calendar (`$0`), Notion Calendar (`$0`), BusyCal, and Calendar 366 II round out the top value alternatives. Arte Soft develops Cloud Calendars and publishes this comparison.',
    comparison: {
      heading: 'Fantastical Price & Feature Alternatives Matrix',
      caption: 'Comparing Flexibits Premium (~$57/yr) against 5 lower-cost iPhone, iPad, and Mac alternatives',
      columns: ['Capability / Price', 'Fantastical Premium', 'Cloud Calendars (iOS)', 'Apple Calendar (iOS 18 + Mac)', 'Notion Calendar', 'BusyCal / Calendar 366'],
      rows: [
        {
          cells: [
            'Annual / One-time cost (US ref)',
            '~$56.99/yr ($6.99/mo); limited free viewer',
            '$0 Free; $4.99/yr ad-free; $49.99/yr w/ M365',
            '$0 free forever, zero ads',
            '$0 free forever, zero ads',
            'BusyCal $14.99 iOS + ~$49.99 Mac (one-time); Cal 366 ~$9.99 iOS / ~$14.99 Mac',
          ],
        },
        {
          cells: [
            'Built-in multi-day weather forecast',
            'AccuWeather (locked to Premium after 3 days)',
            'Full 10-day + hourly Apple WeatherKit in $0 Free',
            'None on iPhone or Mac',
            'None',
            'Included in BusyCal; none in Calendar 366',
          ],
        },
        {
          cells: [
            'Google + iCloud unified sync',
            'Multi-set sync requires Premium',
            'Included in $0 Free (+ Google Meet links)',
            'Included for $0 via System Settings',
            'Google native + iCloud via app-specific password ($0)',
            'Included in one-time purchase',
          ],
        },
        {
          cells: [
            'Side-by-side per-calendar Day columns',
            'No — single merged timeline',
            'Yes — Multi-calendar Day view in $0 Free',
            'No — single merged timeline',
            'No — single merged timeline',
            'No — merged timeline',
          ],
        },
        {
          cells: [
            'Natural-language sentence parser',
            'Best-in-class parser across 6 languages',
            'No — visual grid draft + tap-forecast-hour',
            'Siri voice / Type-to-Siri only',
            'Quick command bar (`Cmd+K`), limited NLP',
            'Yes — strong NLP in both BusyCal & Calendar 366',
          ],
        },
        {
          cells: [
            'Native macOS menu-bar dropdown',
            'Flagship Mac menu-bar mini calendar',
            'iPhone & iPad only (pair w/ free Itsycal on Mac)',
            'None built in (pair w/ free Itsycal on Mac)',
            'Mac menu-bar meeting countdown + join button',
            'Calendar 366 II & BusyCal both include Mac menu-bar apps',
          ],
        },
        {
          cells: [
            'Built-in Calendly-style booking links',
            'Openings & Polls included in Premium',
            'Single-event/calendar sharing (no slot picker)',
            'None',
            'Built-in availability sharing links ($0)',
            'None',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'Audit Which Fantastical Features You Actually Use Before Switching',
        body: [
          'Most subscribers renewing Flexibits Premium at $57/year only touch 20% of its feature sheet. Look back at your past thirty days: did you send Fantastical Openings booking links, switch Focus-triggered Calendar Sets on an Apple Watch, or join Webex calls from a Windows PC? If yes, Fantastical’s bundle legitimately earns its price—replacing a standalone Calendly seat alone saves $120/year.',
          'If your real habit is checking Google + iCloud on your iPhone, glancing at Home Screen widgets, dragging meetings around a Week view, and checking whether Saturday’s game will get rained out, you are paying $52/year for enterprise extras you never open.',
        ],
        table: {
          heading: 'Account Sync, Protocol & Platform Coverage Across Value Alternatives',
          caption: 'Verifying device and account compatibility before canceling Flexibits Premium',
          columns: ['Requirement', 'Cloud Calendars', 'Apple Calendar', 'Notion Calendar', 'BusyCal / Calendar 366'],
          rows: [
            {
              cells: [
                'iPhone & iPad support',
                'Native iOS / iPadOS 18.0+',
                'Native iOS / iPadOS',
                'iOS (iPhone-centric layout)',
                'Native iOS & iPadOS universal apps',
              ],
            },
            {
              cells: [
                'macOS support',
                'No Mac app',
                'Native macOS',
                'Native macOS & Windows',
                'Native macOS (separate one-time license)',
              ],
            },
            {
              cells: [
                'Microsoft 365 / Exchange + Teams',
                'Direct OAuth ($49.99/yr) or iOS Exchange ($0)',
                'macOS/iOS Exchange ($0)',
                'Preview Outlook support',
                'Exchange & CalDAV supported',
              ],
            },
            {
              cells: [
                'Tasks & Apple Reminders',
                'Events & alerts only',
                'Native iOS 18 / macOS Sequoia Reminders',
                'Notion databases (no Apple Reminders)',
                'Native Apple Reminders support',
              ],
            },
            {
              cells: [
                '3-Year Cumulative Cost (iOS + Mac)',
                '$0 Free or $14.97 (3 yrs Advanced + free Apple Mac)',
                '$0 over 3 years',
                '$0 over 3 years',
                '~$25 Cal 366 (iOS+Mac) or ~$65 BusyCal (iOS+Mac) vs ~$171 Fantastical',
              ],
            },
            {
              cells: [
                'Migration effort from Fantastical',
                'Zero data loss — events stay in iCloud/Google/M365',
                'Zero data loss — already in system store',
                'Sign in with Google (~2 minutes)',
                'Zero data loss — reads EventKit / CalDAV',
              ],
            },
          ],
        },
      },
      {
        heading: 'Three Proven Ways to Replace Fantastical for Under $15',
        body: [
          'Because Fantastical never owns your underlying calendar events—your data lives in iCloud, Google, or Exchange—canceling Flexibits Premium does not delete a single appointment. Only Fantastical-specific cloud extras (like Flexibits Calendar Sets, Openings links, and AccuWeather overlays) stop working when your billing cycle ends.',
          'Use the scenario table below to match the exact feature you loved most in Fantastical to its most affordable replacement.',
        ],
        table: {
          heading: 'Pricing & Best Replacement by Former Fantastical Habit',
          caption: 'Pick the exact replacement stack for what you actually use in Fantastical',
          columns: ['What You Loved Most in Fantastical', 'Best Cheaper Replacement', 'New Cost', '3-Year Savings vs ~$171'],
          rows: [
            {
              cells: [
                'iPhone/iPad weather in calendar + Google + iCloud + Live Activity',
                'Cloud Calendars (Free or Advanced ad-free)',
                '$0 or $4.99/yr',
                '$156 – $171 saved',
              ],
            },
            {
              cells: [
                'Mac menu-bar mini calendar + NLP quick entry (one-time buy)',
                'Calendar 366 II (Mac + iOS) or free Itsycal (Mac)',
                '$0 (Itsycal) or ~$25 once',
                '~$146 – $171 saved',
              ],
            },
            {
              cells: [
                'Power-user Calendar Sets / Smart Filters + Weather + Reminders',
                'BusyCal iOS ($14.99) + optional BusyCal Mac (~$49.99)',
                '$14.99 – $65 once',
                '~$106 – $156 saved',
              ],
            },
            {
              cells: [
                'Google Workspace + availability links + desktop time zones',
                'Notion Calendar (Mac/Web) + Cloud Calendars (iPhone)',
                '$0 – $4.99/yr',
                '$156 – $171 saved',
              ],
            },
            {
              cells: [
                'Zero third-party apps + iOS 18 Reminders + Apple Watch',
                'Apple Calendar across iPhone, iPad, Mac & Watch',
                '$0',
                '$171 saved',
              ],
            },
            {
              cells: [
                'Heavy Openings booking links + Todoist sync + Windows + Mac + Watch',
                'Keep Fantastical Premium (genuinely worth it here)',
                '~$56.99/yr',
                'Replaces separate Calendly fee',
              ],
            },
          ],
        },
      },
      {
        heading: 'What Happens When You Cancel Flexibits Premium',
        body: [
          'If you subscribed via the Apple App Store, open `Settings > [Your Name] > Subscriptions > Fantastical` to cancel auto-renewal; if you subscribed directly on `flexibits.com`, manage billing in your Flexibits account portal. Before your cycle ends, replace any active `fantastical.app` Openings URLs in your email signature so clients don’t hit an expired booking page.',
          'Every event stored on iCloud, Google Calendar, or Exchange remains untouched on its provider server.',
        ],
      },
      {
        heading: 'The $4.99/Year Sweet Spot: Cloud Calendars Advanced + Free Mac Tools',
        body: [
          'For Apple users who spend 80% of personal life planning on iPhone and iPad, combining Cloud Calendars Advanced ($4.99/year ad-free) with built-in macOS Apple Calendar and the free open-source Mac menu-bar utility Itsycal covers multi-account Google + iCloud views, Apple WeatherKit hourly forecasts, Month title chips, Live Activities, and a Mac menu-bar calendar for less than the price of a single month of Fantastical.',
        ],
      },
    ],
    claims: {},
    practical: [
      'List the exact 2–3 Fantastical features you used this month (for example: weather, Google+iCloud views, Mac menu bar, or NLP typing).',
      'Install Cloud Calendars on iPhone/iPad for $0 to test Google OAuth, iCloud EventKit, Multi-calendar columns, and Apple WeatherKit side by side before your Fantastical renewal date.',
      'Update any email signatures or website buttons that link to Fantastical Openings before canceling Flexibits Premium.',
      'Cancel your trial or renewal in iOS Settings > Apple Account > Subscriptions (or flexibits.com if billed on the web) at least 24 hours before renewal.',
    ],
    faq: [
      {
        q: 'Will I lose my calendar events if I cancel Fantastical and switch to Cloud Calendars?',
        a: 'No. Your appointments live in iCloud, Google Calendar, Microsoft 365, or CalDAV—not inside Fantastical. Connecting those same accounts in Cloud Calendars displays your full schedule immediately.',
      },
      {
        q: 'How much cheaper is Cloud Calendars than Fantastical?',
        a: 'Cloud Calendars Free is $0 (including Google sync, iCloud sync, all 5 views + Multi-calendar columns, widgets, and Apple WeatherKit), and Advanced removes ads for $4.99/year—roughly 91% less than Flexibits Premium (~$56.99/year). Premium with Microsoft Calendar + Teams is $49.99/year.',
      },
      {
        q: 'What is the best free Mac menu-bar replacement if I use Cloud Calendars on my iPhone?',
        a: 'Pair macOS Apple Calendar ($0) with Itsycal ($0 open-source Mac menu-bar calendar) or Notion Calendar ($0), while using Cloud Calendars on your iPhone and iPad.',
      },
    ],
    sourcesHeading: 'Official pricing and subscription management links',
    sources: [
      { label: 'Flexibits: Fantastical & Flexibits Premium pricing', url: 'https://flexibits.com/pricing' },
      { label: 'Apple Support: If you want to cancel a subscription from Apple', url: 'https://support.apple.com/en-us/118428' },
      { label: 'BusyMac: BusyCal iOS & Mac licensing', url: 'https://www.busymac.com/busycal/' },
      { label: 'Cloud Calendars on the App Store', url: 'https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319' },
    ],
    relatedComparisons: [
      { slug: 'cloud-calendars-vs-fantastical', label: 'Cloud Calendars vs Fantastical' },
      { slug: 'best-ipad-and-mac-calendar-app-comparison', label: 'iPad & Mac Calendar Apps Compared' },
      { slug: 'cloud-calendars-vs-busycal-ios-mac', label: 'Cloud Calendars vs BusyCal' },
    ],
    seeAlso: [
      'what-fantastical-costs-and-what-this-does',
      'fantastical-readdle-calendar366-iphone-comparison',
      'what-you-get-without-paying-anything',
      'what-a-subscription-actually-buys',
    ],
  },

  'privacy-first-direct-sync-vs-cloud-relay-calendar-apps': {
    updated: '2026-11-04',
    seoTitle: 'Direct Sync vs Cloud-Relay Calendar Privacy on iOS',
    title: 'Direct Sync vs Cloud-Relay Calendar Privacy on iOS',
    short: 'Direct Sync vs Cloud-Relay Privacy',
    description:
      'Understand where your schedule actually lives: compare account-free on-device calendars and direct EventKit/OAuth sync (Cloud Calendars, Apple Calendar) against cloud-relay servers and E2EE apps.',
    lede: 'Two calendar apps can look identical on your iPhone screen while handling your private schedule in completely different ways behind the scenes. Direct-sync apps (like Apple Calendar, BusyCal, and Cloud Calendars for local/EventKit/OAuth calendars) communicate straight between your iPhone and Apple, Google, or Microsoft—whereas cloud-relay apps ask you to create a vendor account that stores credentials or mirrors event metadata on an intermediary backend server to power push notifications, booking links, or cross-platform sets. Understanding all four iOS calendar storage models lets you minimize how many companies hold copies of where you sleep, travel, and meet. Arte Soft develops Cloud Calendars and publishes this comparison.',
    comparison: {
      heading: '4 iOS Calendar Data-Flow & Privacy Architectures Compared',
      caption: 'Comparing Local On-Device, Direct EventKit/OAuth, Intermediary Cloud-Relay, and Zero-Knowledge E2EE',
      columns: ['Privacy Dimension', '1. On-Device Local (Cloud Calendars Local)', '2. Direct EventKit / OAuth (Cloud Calendars / Apple)', '3. Cloud-Relay Account Apps (Flexibits / TimeTree / OneCal)', '4. Zero-Knowledge E2EE (Proton / Tuta)'],
      rows: [
        {
          cells: [
            'Where event titles & locations sit at rest',
            'Exclusively on your iPhone/iPad flash storage',
            'On your chosen provider (Apple, Google, Microsoft) + local iOS cache',
            'On provider AND/OR mirrored on intermediary app vendor’s cloud servers',
            'Encrypted ciphertext on Proton/Tuta servers + local app cache',
          ],
        },
        {
          cells: [
            'Requires creating a vendor account just to open the app?',
            'No — zero registration required',
            'No vendor login needed for iCloud/local; direct Google/Microsoft OAuth',
            'Yes — mandatory vendor account for sync sets, sharing, or cloud features',
            'Yes — mandatory Proton/Tuta cryptographic account',
          ],
        },
        {
          cells: [
            'Requires handing an Apple ID app-specific password to a server?',
            'Never',
            'Never — uses native iOS EventKit permission on device',
            'Often required when syncing iCloud to non-Apple desktop/web relays',
            'No (does not connect to iCloud CalDAV)',
          ],
        },
        {
          cells: [
            'Number of companies in the trust chain',
            '1 (Apple hardware/OS)',
            '1–2 (Apple OS + your chosen cloud provider)',
            '2–3+ (Apple OS + cloud provider + intermediary relay vendor)',
            '2 (Apple OS + E2EE provider holding ciphertext)',
          ],
        },
        {
          cells: [
            'Works with corporate security policies banning intermediary relays?',
            'Yes (offline local)',
            'High compatibility via iOS EventKit or direct OAuth',
            'Frequently flagged by corporate infosec reviews if credentials are proxied',
            'Isolated from corporate Exchange/Workspace',
          ],
        },
        {
          cells: [
            'Multi-provider interoperability (iCloud + Google + M365)',
            'Can combine local calendars alongside cloud ones in grid',
            'Full two-way standard interoperability',
            'High interoperability (at the cost of an extra cloud hop)',
            'Low — isolated silo (read-only ICS imports only)',
          ],
        },
        {
          cells: [
            'Weather location privacy',
            'Optional GPS or manual city search via Apple WeatherKit',
            'Apple WeatherKit (Cloud Calendars) or none (Apple Calendar)',
            'Varies by third-party weather SDK & analytics',
            'No weather SDKs',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'How Cloud Calendars Separates Local/Direct Sync From Optional Cloud Sharing',
        body: [
          'Transparency matters more than marketing slogans in privacy architecture. In Cloud Calendars, three distinct modes operate only when you opt into them: (1) **Local calendars** run on your device with no account at all; (2) **iCloud, CalDAV, Google, and Microsoft** connect via Apple’s on-device EventKit store and official Google/Microsoft OAuth tokens; and (3) **Cloud Calendars’ own cross-user event/calendar sharing** uses a verified email sign-in only when you explicitly share a Cloud Calendars calendar or event link with another person.',
          'Furthermore, Free tier users see advertising (supported via `app-ads.txt`), whereas upgrading to Advanced (`$0.49/month` or `$4.99/year`) removes ads completely across the entire app.',
        ],
        table: {
          heading: 'Account Sync, Credential Handling & Ad-Tech Comparison on iOS',
          caption: 'Exact credential paths, vendor account rules, and ad models across iOS calendar apps',
          columns: ['App', 'Vendor Account Required?', 'iCloud Connection Method', 'Advertising in Free Tier?'],
          rows: [
            {
              cells: [
                'Cloud Calendars',
                'No for local, iCloud, Google & M365; email sign-in only for native sharing',
                'On-device iOS EventKit permission (no app password)',
                'Yes in Free ($0); zero ads in Advanced ($4.99/yr) & Premium',
              ],
            },
            {
              cells: [
                'Apple Calendar',
                'Apple Account (optional if using On My iPhone only)',
                'First-party OS iCloud daemon',
                'Zero ads ($0)',
              ],
            },
            {
              cells: [
                'BusyCal iOS',
                'No BusyMac account required',
                'On-device EventKit or direct CalDAV',
                'Zero ads ($14.99 upfront)',
              ],
            },
            {
              cells: [
                'Fantastical',
                'Flexibits account required for Premium, Sets & Openings',
                'EventKit on iOS; app-specific password if synced via Flexibits cloud/Windows',
                'Zero ads (~$56.99/yr subscription)',
              ],
            },
            {
              cells: [
                'Notion Calendar',
                'Google/Notion login required',
                'Apple app-specific password stored to bridge iCloud',
                'Zero ads ($0)',
              ],
            },
            {
              cells: [
                'TimeTree / Cozi',
                'Mandatory vendor account',
                'Read-only import/overlay or proprietary cloud calendar',
                'Ad-supported free tiers; ~$39–$45/yr ad-free',
              ],
            },
          ],
        },
      },
      {
        heading: 'Pricing and Choosing the Least-Privilege Calendar Setup',
        body: [
          'Good security engineering follows the principle of least privilege: never grant a third server a long-lived Apple app-specific password or OAuth write scope when on-device EventKit or scoped local storage already solves the job.',
          'Use the decision matrix below to pick the cleanest trust boundary for your schedule.',
        ],
        table: {
          heading: 'Pricing & Best Choice by Privacy Requirement',
          caption: 'Matching your personal or workplace privacy bar to the right iOS calendar setup',
          columns: ['Privacy Goal', 'Recommended Setup', 'Cost', 'Why It Minimizes Exposure'],
          rows: [
            {
              cells: [
                'Zero cloud servers — events stay strictly on iPhone hardware',
                'Cloud Calendars (Local calendar + Advanced ad-free) or Apple "On My iPhone"',
                '$0 – $4.99/yr',
                'No cloud sync, no OAuth tokens, no ads (with Advanced)',
              ],
            },
            {
              cells: [
                'iCloud + Google unified on iPhone without an intermediary relay server + ad-free',
                'Cloud Calendars Advanced ($4.99/yr) or BusyCal ($14.99 once)',
                '$4.99/yr or $14.99 once',
                'Direct EventKit + Google OAuth; zero ad networks active',
              ],
            },
            {
              cells: [
                'Apple Advanced Data Protection (E2EE iCloud Backup) + zero third-party apps',
                'Built-in Apple Calendar',
                '$0',
                'Smallest software footprint on iOS (note: iCloud Calendar itself uses standard Apple encryption for CalDAV compatibility)',
              ],
            },
            {
              cells: [
                'End-to-end encrypted cloud sync where even the server host cannot read titles',
                'Proton Calendar or Tuta Calendar',
                '$0 basic / ~$40–$120/yr',
                'Client-side public-key encryption before upload',
              ],
            },
            {
              cells: [
                'Self-hosted open-source cloud on your own home NAS or VPS',
                'Nextcloud / Radicale / Baïkal via iOS CalDAV + Cloud Calendars',
                'Self-hosted + $0/$4.99 yr',
                'You control the physical server and TLS logs',
              ],
            },
            {
              cells: [
                'Checking weather without granting continuous background GPS tracking',
                'Cloud Calendars Weather Hub using manual city search instead of GPS',
                '$0 – $4.99/yr',
                'Fetches Apple WeatherKit for a named city without live coordinates',
              ],
            },
          ],
        },
      },
      {
        heading: 'iOS 17 / iOS 18 Calendar Permissions: Write-Only vs Full Access',
        body: [
          'Starting in iOS 17 and continuing in iOS 18, Apple split Calendar privacy permissions into `Add Events Only` (for airline or ticketing apps that just drop one reservation onto your calendar without reading anything) and `Full Access` (required by actual calendar viewers like Cloud Calendars to display your week).',
          'Audit `Settings > Privacy & Security > Calendars` periodically on your iPhone and downgrade shopping, fitness, or social-media apps from `Full Access` to `None` or `Add Events Only`—only dedicated calendar apps need permission to read your life history.',
        ],
      },
      {
        heading: 'Manual City Weather Search for Location-Conscious Users',
        body: [
          'If you keep iPhone Location Services disabled for most apps, you still don’t have to give up in-calendar weather forecasts. Inside Cloud Calendars’ Weather Hub, search and select your city by name instead of granting GPS access—Apple WeatherKit returns hourly and 10-day forecasts for that city without reading your device’s street-level coordinates.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Open iPhone Settings > Privacy & Security > Calendars and revoke Full Access from non-calendar apps (games, social apps, airline apps that only need Add Events Only).',
      'Avoid generating Apple ID app-specific passwords for third-party cloud relays when native iOS EventKit apps like Cloud Calendars can read iCloud directly on device.',
      'If you want zero ad-network requests alongside direct sync, upgrade Cloud Calendars to Advanced ($4.99/year) or use Apple Calendar / BusyCal.',
      'Use manual city search inside Cloud Calendars’ Weather Hub if you prefer not to share device GPS location.',
      'Periodically review connected third-party OAuth tokens at myaccount.google.com/permissions and account.live.com/consent/Manage.',
    ],
    faq: [
      {
        q: 'Do I have to create an account to use Cloud Calendars?',
        a: 'No. You can use local calendars on your iPhone or iPad and view EventKit calendars without creating a Cloud Calendars account. Signing in is only needed when connecting external calendar services or using Cloud Calendars’ cross-user sharing.',
      },
      {
        q: 'Is Apple iCloud Calendar end-to-end encrypted under Advanced Data Protection?',
        a: 'Per Apple’s official iCloud data security documentation, iCloud Calendars and Contacts use standard transport and at-rest encryption rather than Advanced Data Protection end-to-end encryption because they must interoperate with open CalDAV and email scheduling standards. For true E2EE cloud calendars, use Proton or Tuta—or use purely local device calendars.',
      },
      {
        q: 'How do I remove ads completely in Cloud Calendars?',
        a: 'Subscribing to Cloud Calendars Advanced ($0.49/month or $4.99/year) or Premium removes all advertising across the app.',
      },
    ],
    sourcesHeading: 'Official Apple security, OAuth, and privacy references',
    sources: [
      { label: 'Apple Support: iCloud data security overview (Standard vs Advanced Data Protection)', url: 'https://support.apple.com/en-us/102651' },
      { label: 'Apple Support: Control access to calendars on iPhone (Full Access vs Add Events Only)', url: 'https://support.apple.com/guide/iphone/control-access-to-information-in-apps-iph251e92810/ios' },
      { label: 'Cloud Calendars Privacy Policy', url: 'https://www.cloud-calendars.com/privacy-policy/' },
      { label: 'Google Account Help: Manage third-party connections & OAuth permissions', url: 'https://support.google.com/accounts/answer/13533235' },
    ],
    relatedComparisons: [
      { slug: 'cloud-calendars-vs-proton-and-tuta-encrypted-calendars', label: 'Cloud Calendars vs Proton & Tuta Encrypted Calendars' },
      { slug: 'caldav-vs-ics-subscribed-url-vs-oauth-calendar-sync', label: 'CalDAV vs ICS Subscribed URL vs OAuth Sync on iOS' },
      { slug: 'work-exchange-microsoft-365-and-personal-icloud-iphone', label: 'Work Exchange / M365 + Personal iCloud on iPhone' },
    ],
    seeAlso: [
      'what-is-a-cloud-calendar',
      'what-calendar-sync-actually-does',
      'free-google-sync-without-adverts',
      'disconnect-calendar-integration-without-losing-track',
    ],
  },

  'best-calendar-app-for-shift-workers-and-rotating-schedules': {
    updated: '2026-11-04',
    seoTitle: 'Best iPhone Calendar Apps for Shift Workers & Rotas',
    title: 'Best iPhone Calendar Apps for Shift Workers & Rotas',
    short: 'Calendar Apps for Shift Workers',
    description:
      'Compare dedicated shift-pattern generators (Supershift, MyShiftPlanner) with multi-account iPhone calendar viewers (Cloud Calendars, Apple Calendar, BusyCal) for Pitman, DuPont, 24/48, and night shifts.',
    lede: 'Nurses, firefighters, pilots, police officers, and plant operators quickly discover that standard calendar repeat rules ("Every week on Monday") struggle with non-7-day rotations like 4-on-4-off, 24/48, Pitman (2-2-3), or DuPont shifts—yet dedicated shift-rota apps often fail at syncing family iCloud, partner Gmail, and commute weather in one view. The cleanest iPhone setup depends on how your shifts originate: if your employer publishes a live `.ics` or Exchange roster (Kronos/UKG, QGenda, Shiftboard, Deputy), connect it directly to Cloud Calendars alongside family calendars and Apple WeatherKit; if you stamp shifts manually, generate the rotation in a shift app like Supershift and export it to iOS EventKit so Cloud Calendars displays the whole picture. Arte Soft develops Cloud Calendars and publishes this comparison.',
    comparison: {
      heading: 'Shift Worker & Rotating Roster Calendar Matrix on iPhone',
      caption: 'Comparing Cloud Calendars, dedicated shift-pattern generators (Supershift / MyShiftPlanner), and Apple Calendar',
      columns: ['Shift Workflow Capability', 'Cloud Calendars (iOS)', 'Supershift / MyShiftPlanner', 'Apple Calendar (iOS 18)', 'BusyCal iOS'],
      rows: [
        {
          cells: [
            'One-tap shift stamp templates (D / N / Off / 4-on-4-off)',
            'Standard recurrence rules + drag/duplicate; no custom Pitman/DuPont stamp pad',
            'Purpose-built shift stamp buttons & arbitrary N-day rotation loops',
            'Custom every-N-days/weeks repeat rules; no multi-step Pitman wizard',
            'Advanced custom recurrence editor; no nurse/fire shift stamp pad',
          ],
        },
        {
          cells: [
            'Overtime hours, pay & night-differential tracking',
            'No payroll or hours calculator',
            'Built-in shift hours, overtime & earnings reports (Pro)',
            'None',
            'None',
          ],
        },
        {
          cells: [
            'Employer roster feeds (QGenda, UKG, NurseGrid, Shiftboard ICS)',
            'Displays subscribed iOS `.ics` feeds + Google + Microsoft 365',
            'Primarily exports shifts outward rather than unifying family OAuth',
            'Subscribes to `.ics` URLs natively in iOS Settings',
            'Subscribes to `.ics` & CalDAV feeds',
          ],
        },
        {
          cells: [
            'Side-by-side Shift vs Partner vs Kids Day columns',
            'Multi-calendar Day view puts Rota, Partner & Childcare in separate lanes',
            'Focused on shift calendar cells rather than multi-account columns',
            'Single merged column',
            'Merged column',
          ],
        },
        {
          cells: [
            'Readable Month chips + 12-month Year view',
            'Colored Month event chips + full 12-month Year view in Free',
            'Colored shift badge icons in Month/Year grid',
            'Pinch-zoomable Month + Year grid',
            'Configurable Month text cells',
          ],
        },
        {
          cells: [
            'Night-shift commute & sleep weather check',
            'Hourly Apple WeatherKit temp, wind/gusts, snow/rain & UV in Free',
            'No built-in hourly weather station',
            'No built-in weather',
            'Weather icons included',
          ],
        },
        {
          cells: [
            'Sharing shift calendar with spouse (iPhone or Android)',
            'Two-way Shared Google/iCloud + Cloud Calendars Reader/Writer & App Clip',
            'Exports to Apple/Google calendar (often paid Pro feature) or PDF/image',
            'Shared iCloud Calendar (Apple-only two-way)',
            'Uses underlying iCloud/Google sharing',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'How to Handle Pitman (2-2-3), 4-on-4-off, and Overnight 19:00–07:00 Shifts',
        body: [
          'Simple rotations that repeat every fixed number of days—such as **24 hours on / 48 hours off** (every 3 days) or **4 days on / 4 days off** (every 8 days)—can actually be created in any standard calendar using a few "Repeat every 8 days" series (Day 1, Day 2, Day 3, Day 4). Multi-step asymmetric cycles like **Pitman (2-2-3)** repeat every 14 days (2 weeks), while **DuPont** repeats every 28 days (4 weeks).',
          'Overnight shifts (`19:00 Tuesday` to `07:00 Wednesday`) deserve special care: enter actual start and end clock times so the block spans midnight accurately on your hourly timeline and blocks Wednesday morning recovery sleep—rather than saving an all-day `"Night Shift"` banner that leaves Wednesday 08:00 looking wide open for a plumber or school meeting.',
        ],
        table: {
          heading: 'Account Sync, Roster Feeds & Platform Support for Shift Households',
          caption: 'Connecting hospital, airline, emergency, and plant rosters to your iPhone and family',
          columns: ['Roster Source', 'Best Connection Method on iPhone', 'How It Appears in Cloud Calendars'],
          rows: [
            {
              cells: [
                'QGenda, Shiftboard, Deputy, Humanity, Airline Crew ICS',
                'Subscribe via URL in iOS Settings > Calendar Accounts > Add Subscription Calendar',
                'Updates automatically as a read-only color-coded shift calendar (Free)',
              ],
            },
            {
              cells: [
                'Corporate Microsoft 365 / Teams Shifts',
                'Sign in with Microsoft OAuth (Premium) or iOS Exchange account',
                'Appears alongside personal iCloud & family Google calendars',
              ],
            },
            {
              cells: [
                'Supershift / MyShiftPlanner Apple Calendar Export',
                'Enable iOS Calendar Export inside the shift generator -> target a Shared iCloud/Google calendar',
                'Cloud Calendars renders exported shifts beside spouse & kids columns + weather',
              ],
            },
            {
              cells: [
                'Spouse on Android phone',
                'Write/export shifts onto a Shared Google Calendar',
                'Instant two-way visibility on both iPhone (Cloud Calendars) and Android',
              ],
            },
            {
              cells: [
                'Home Screen next-shift & weather check',
                'Add Calendar Events & Calendar & Weather widgets',
                'Timed shifts appear in upcoming event list + Live Activity countdown',
              ],
            },
            {
              cells: [
                'Shift swaps & single-shift handoffs',
                'Drag editable shift or share single event via link/QR/App Clip',
                'Update "This Event Only" on repeating rotations when swapping one Friday',
              ],
            },
          ],
        },
      },
      {
        heading: 'Pricing and Best App Stack by Shift Profession',
        body: [
          'If your hospital, airline, or department already publishes a live `.ics` subscription URL or syncs via Google/Microsoft, you do not need to pay for a shift-stamping app at all—subscribe in iOS Settings and view everything alongside family pickups and commute weather in Cloud Calendars for $0.',
          'If you receive a paper PDF roster once a month and stamp 30 irregular shifts by hand in 60 seconds, pair a specialist shift generator (like Supershift) exporting into a shared Google/iCloud calendar, and use Cloud Calendars for household coordination and weather.',
        ],
        table: {
          heading: 'Pricing & Best Choice by Shift Worker Scenario',
          caption: 'Matching shift roster formats, family sharing, and payroll needs to the right iOS apps',
          columns: ['Shift Scenario', 'Cloud Calendars', 'Dedicated Shift App (Supershift)', 'Best Choice'],
          rows: [
            {
              cells: [
                'Hospital / airline provides live `.ics` URL + need family sync & commute weather',
                'Reads iOS `.ics` + iCloud + Google + WeatherKit in Free ($0)',
                'Redundant manual entry if live `.ics` already exists',
                'Cloud Calendars ($0 Free / $4.99 yr)',
              ],
            },
            {
              cells: [
                'Manual 60-second stamping of irregular paper rotas + overtime pay calculation',
                'No stamp pad or wage calculator',
                'Purpose-built shift stamps & pay reports (~$10–$20/yr Pro)',
                'Supershift (exporting to Cloud Calendars)',
              ],
            },
            {
              cells: [
                'Comparing Nurse Rota + Partner Work + Daycare Handoffs on one screen',
                'Multi-calendar Day columns show all 3 lanes side by side ($0)',
                'Single-user shift focus',
                'Cloud Calendars',
              ],
            },
            {
              cells: [
                '05:30 winter or night-shift drive checking ice, wind gusts & rain beside shift',
                'Built-in Apple WeatherKit hourly temp, wind & rain ($0 Free)',
                'Requires separate weather app',
                'Cloud Calendars',
              ],
            },
            {
              cells: [
                'Fixed 8-day (4-on-4-off) or 14-day (Pitman) cycle without extra subscriptions',
                'Create 4 repeating timed series ("Day 1", "Day 2"...) on Shared Google/iCloud ($0)',
                'Calendar export often requires Pro subscription',
                'Cloud Calendars ($0)',
              ],
            },
            {
              cells: [
                'Microsoft Teams Shifts + personal family iCloud on one iPhone',
                'Premium ($4.99/mo or $49.99/yr) or $0 via iOS Exchange store',
                'Does not connect Microsoft Teams links',
                'Cloud Calendars',
              ],
            },
          ],
        },
      },
      {
        heading: 'Always Block Post-Night-Shift Sleep on Shared Household Calendars',
        body: [
          'The biggest source of friction in shift-working households is the `"invisible recovery day"`: a night nurse finishes at `07:30 Thursday`, and a well-meaning partner books a noisy contractor or pediatric dentist for `11:00 Thursday` because Thursday afternoon looks empty.',
          'Create an explicit `"Sleep — Do Not Book (08:00–15:30)"` event right after overnight shifts on your shared family calendar so everyone—and every Home Screen widget—treats recovery sleep as a real timed commitment.',
        ],
      },
      {
        heading: 'Swapping a Single Shift Without Breaking Future Weeks',
        body: [
          'When you trade next Saturday’s Day Shift with a coworker on a repeating rotation series, dragging or editing that event in Cloud Calendars prompts you to choose which occurrences to change.',
          'Select only that single occurrence (`This Event Only`) and verify the saved date before closing so you never accidentally shift the rest of your 12-month cycle.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Check first if your scheduling portal (QGenda, UKG/Kronos, Shiftboard, Deputy) offers a live `.ics` subscription URL—if so, add it in iOS Settings > Calendar Accounts > Add Subscription Calendar.',
      'Enter shifts with real start and end clock hours (`07:00–19:00` or `19:00–07:00`) rather than all-day banners so widgets, Live Activities, and overnight spans behave accurately.',
      'Add explicit post-night-shift sleep blocks (`08:00–15:30`) on a shared Google or iCloud calendar so family members protect recovery hours.',
      'Open Multi-calendar Day view in Cloud Calendars to coordinate child pickups and handoffs between partner schedules.',
      'Use Cloud Calendars’ Weekly Schedule Builder on the web or repeat rules in the app to map clean recurring blocks.',
    ],
    faq: [
      {
        q: 'Can Cloud Calendars display my QGenda, Kronos, or NurseGrid `.ics` shift feed?',
        a: 'Yes. Subscribe to your work `.ics` URL in iPhone Settings > Apps > Calendar > Calendar Accounts > Add Account > Other > Add Subscription Calendar, grant Cloud Calendars Full Access, and your live shifts appear read-only alongside your personal and family calendars.',
      },
      {
        q: 'Why don’t all-day shift labels show up on the Cloud Calendars Home Screen Events widget?',
        a: 'Cloud Calendars’ medium and large Calendar Events widgets list upcoming timed appointments (`07:00–19:00`) and exclude all-day banners so holidays don’t hide real start times. Enter shifts with start/end hours if you want them in upcoming event widgets and Live Activities.',
      },
      {
        q: 'How can I set up a 4-on-4-off or Pitman schedule without paying for a shift app?',
        a: 'For 4-on-4-off (an 8-day cycle), create four events on consecutive days each set to repeat "Every 8 days" (or for a 14-day Pitman 2-2-3 cycle, create the 7 worked shifts across two weeks each set to repeat "Every 2 weeks").',
      },
    ],
    sourcesHeading: 'Official iOS recurrence and calendar subscription guides',
    sources: [
      { label: 'Apple Support: Create and edit repeating events in Calendar on iPhone', url: 'https://support.apple.com/guide/iphone/create-and-edit-events-in-calendar-iph3d110f84/ios' },
      { label: 'Apple Support: Subscribe to external ICS calendars on iPhone', url: 'https://support.apple.com/guide/iphone/use-multiple-calendars-iph3d1110d4/ios' },
      { label: 'Google Calendar Help: Create repeating events with custom day intervals', url: 'https://support.google.com/calendar/answer/37115' },
      { label: 'Cloud Calendars on the App Store', url: 'https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319' },
    ],
    relatedComparisons: [
      { slug: 'shared-icloud-calendar-vs-shared-google-calendar-families', label: 'Shared iCloud vs Shared Google Calendar for Families' },
      { slug: 'caldav-vs-ics-subscribed-url-vs-oauth-calendar-sync', label: 'CalDAV vs ICS Subscribed URL vs OAuth Sync on iOS' },
      { slug: 'calendar-apps-with-built-in-weather-forecast-iphone', label: 'iPhone Calendar Apps with Built-In Weather Compared' },
    ],
    seeAlso: [
      'shift-work-calendar-iphone-rotating-schedules',
      'weekly-schedule-builder',
      'recurring-events-without-the-mess',
      'family-pickup-calendar-handoff',
    ],
  },

  'all-day-multi-day-banners-and-week-numbers-calendars-ios': {
    updated: '2026-11-04',
    seoTitle: 'All-Day Banners & Week Numbers in iOS Calendars',
    title: 'All-Day Banners & Week Numbers in iOS Calendars',
    short: 'All-Day Banners & Week Numbers on iOS',
    description:
      'Compare how Cloud Calendars, Apple Calendar, Google Calendar, BusyCal, and Fantastical render multi-day trip banners, widget all-day filtering, Monday week starts, and ISO 8601 week numbers.',
    lede: 'Two subtle layout details make or break European, academic, and project-driven schedules on iPhone: how multi-day all-day events (vacations, school breaks, conferences, and OOO banners) span across weeks without drowning out timed calls, and how Monday week-start settings interact with ISO 8601 week numbers (`W01`–`W53`). Cloud Calendars renders clean multi-day banners across its app views while deliberately keeping its Home Screen event widgets focused strictly on upcoming timed appointments—and if inline ISO week-number badges (`CW 45`) are mandatory for your engineering sprints or Nordic school plans, Apple Calendar, BusyCal, and Fantastical expose dedicated toggles. Arte Soft develops Cloud Calendars and publishes this comparison.',
    comparison: {
      heading: 'All-Day Banners, Week Starts & ISO Week Numbers Matrix',
      caption: 'Comparing multi-day banner rendering, widget filtering, Monday start, and ISO week numbers on iOS',
      columns: ['Grid & Header Detail', 'Cloud Calendars', 'Apple Calendar (iOS 18)', 'Google Calendar (iOS)', 'BusyCal / Fantastical'],
      rows: [
        {
          cells: [
            'Multi-day all-day banners in Week & Month views',
            'Continuous horizontal banners pinned above hourly grid / across Month cells',
            'Continuous colored bars in Stacked/Details Month & Multi-day header',
            'Continuous colored horizontal banners across week rows',
            'Continuous colored multi-day banners with customizable row count',
          ],
        },
        {
          cells: [
            'All-day banner behavior in Home Screen event widgets',
            'Excluded from Calendar Events widgets so timed meetings stay visible (view in app)',
            'Displayed at top of Up Next / List widgets',
            'Displayed in Up Next widget',
            'Configurable "Show All-Day Events" toggle per widget',
          ],
        },
        {
          cells: [
            'Inline ISO week numbers (`W1`–`W53`) in grid',
            'No inline week-number column badges (use subscribed Week Number ICS if needed)',
            'Built-in toggle (`Settings > Apps > Calendar > Week Numbers`)',
            'Shown when enabled in Google Calendar settings / Week view',
            'Native week-number badges in Month & Week headers',
          ],
        },
        {
          cells: [
            'First day of week (Monday vs Sunday vs Saturday)',
            'Follows device locale / region calendar settings',
            'Configurable (`Settings > Apps > Calendar > Start Week On`)',
            'Configurable inside Google Calendar app settings',
            'Independent custom "Start Week On" picker',
          ],
        },
        {
          cells: [
            'Alternate lunar / Hebrew / Islamic / Chinese calendars',
            'Standard Gregorian grid (displays subscribed holiday ICS feeds)',
            'Built-in `Alternate Calendars` overlay in iOS Calendar Settings',
            'Built-in Alternate Calendars in Google account settings',
            'Alternate calendar & moon-phase options',
          ],
        },
        {
          cells: [
            'Free vs Busy status on multi-day banners',
            'Preserves provider Free/Busy availability metadata',
            'Configurable `Show As: Free / Busy` per event',
            'Configurable `Free` vs `Busy` (plus `Out of office` type)',
            'Full `Show As: Free / Busy / Tentative` control',
          ],
        },
        {
          cells: [
            '12-month Year overview for spotting school terms & trips',
            'Full 12-month Year view included in Free ($0)',
            '12-month Year grid built in',
            'No 12-month Year screen on iOS',
            'Year view / density heatmap',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'Why ISO 8601 Week Numbers Disagree When Sunday vs Monday Starts Drift',
        body: [
          'Across Sweden, Denmark, Norway, Germany, the Netherlands, and global manufacturing/agile teams, `"Let’s ship in Week 46"` is standard shorthand. Under ISO 8601, weeks ALWAYS begin on **Monday**, and **Week 1** is the week containing the year’s first Thursday (equivalently, January 4). Under North American Sunday-start numbering, January 1 immediately starts Week 1—meaning US and European calendars frequently disagree by an entire week number in years where January 1 falls on Friday, Saturday, or Sunday!',
          'Whenever an iPhone shows a different week number from a colleague’s Outlook desktop, verify both `Settings > General > Language & Region` and `Start Week On = Monday`. If you want week numbers visible inside Cloud Calendars, add a lightweight read-only ISO Week Numbers `.ics` subscription in iOS Settings so Monday banners (`"ISO Week 45"`) appear cleanly without cluttering your timed widgets.',
        ],
        table: {
          heading: 'Account Sync, RFC 5545 All-Day Semantics & Platform Support',
          caption: 'How iCloud, Google, Microsoft, and ICS feeds encode multi-day events and Free/Busy states',
          columns: ['Technical Detail', 'Google Calendar', 'Apple iCloud / CalDAV', 'Microsoft 365 / Outlook'],
          rows: [
            {
              cells: [
                'RFC 5545 exclusive `DTEND` rule (why a 3-day trip ends on Day 4 in raw ICS)',
                'Encodes June 1–3 trip as `DTSTART=20260601`, `DTEND=20260604` (renders June 1–3)',
                'Same standard exclusive `DTEND` date math; UI shows inclusive end date June 3',
                'Maps exclusive end midnight; badly formatted CSV/ICS imports sometimes drop final day',
              ],
            },
            {
              cells: [
                'Default Free vs Busy state for new all-day events',
                'Defaults to `Free` (`TRANSP:TRANSPARENT`) so holidays don’t block meetings!',
                'Often defaults to `Free` on all-day toggle (verify `Show As` if OOO)',
                'Often defaults to `Free` unless switched to `Busy` or `Out of Office`',
              ],
            },
            {
              cells: [
                'Time-zone shifting bug on all-day events',
                'Immune when saved as true All-Day (`VALUE=DATE`)',
                'Immune when saved as true All-Day',
                'Legacy Exchange clients occasionally stored midnight-to-midnight in creator’s zone, spanning 2 days abroad',
              ],
            },
            {
              cells: [
                'Alert default on all-day events',
                'Configurable separately from timed event alerts (e.g., 09:00 day before)',
                'Separate iOS `Default Alert Times > All-Day Events` (09:00)',
                'Often defaults to 18 hours before (06:00 AM the prior day!)',
              ],
            },
            {
              cells: [
                'Visibility in Cloud Calendars App vs Widgets',
                'Shown in Day/Week/Month/Year/List; hidden from timed Events widgets',
                'Shown in Day/Week/Month/Year/List; hidden from timed Events widgets',
                'Shown in Day/Week/Month/Year/List; hidden from timed Events widgets',
              ],
            },
            {
              cells: [
                'Dragging multi-day banners',
                'Editable multi-day events shift cleanly across dates',
                'Editable multi-day events shift cleanly across dates',
                'Editable multi-day events shift cleanly across dates',
              ],
            },
          ],
        },
      },
      {
        heading: 'Pricing and Choosing the Right App for Multi-Day & Sprint Planners',
        body: [
          'If your calendar carries 5+ simultaneous all-day banners every week (company sprints, who-is-on-PTO team calendars, school spirit weeks, and public holidays), apps that dump all-day banners into Home Screen widgets quickly become unusable.',
          'Cloud Calendars’ intentional split—full multi-day banners inside the app’s Day, Week, Month, and Year grids, paired with strictly timed upcoming meetings on Home Screen event widgets—keeps both horizons legible for $0.',
        ],
        table: {
          heading: 'Pricing & Best Choice by Banner & Week-Number Scenario',
          caption: 'Best iOS calendar choice for ISO week numbers, multi-day trips, and clutter-free widgets',
          columns: ['Planning Scenario', 'Cloud Calendars', 'Alternative App', 'Best Choice'],
          rows: [
            {
              cells: [
                'Busy team PTO / holiday banners in app + clean timed-only Home Screen widget',
                'Exact built-in behavior in Free ($0) or $4.99/yr ad-free',
                'Apple/Google widgets get buried under 5 PTO banners',
                'Cloud Calendars',
              ],
            },
            {
              cells: [
                'Native inline ISO 8601 week-number badge (`W45`) in Month margin for $0',
                'Requires ISO Week `.ics` subscription workaround',
                'Apple Calendar (`Settings > Calendar > Week Numbers`, $0)',
                'Apple Calendar',
              ],
            },
            {
              cells: [
                'ISO week numbers + custom font rows + weather in one paid app',
                'No native week-number badge',
                'BusyCal iOS ($14.99 one-time) or Fantastical (~$57/yr)',
                'BusyCal iOS',
              ],
            },
            {
              cells: [
                'Overlaying Chinese, Hebrew, or Islamic lunar dates onto Gregorian Month',
                'Standard Gregorian grid',
                'Apple Calendar (`Alternate Calendars`, $0) or Google Calendar',
                'Apple Calendar',
              ],
            },
            {
              cells: [
                'Visualizing 4-day conferences & family vacations alongside 10-day weather',
                'Multi-day banners + Apple WeatherKit highs/lows in Week view ($0)',
                'Apple & Google lack built-in weather',
                'Cloud Calendars',
              ],
            },
            {
              cells: [
                '12-month macro planning for sabbaticals, semesters & product roadmaps',
                '12-month Year view included in Free ($0)',
                'Google Calendar iOS lacks Year view',
                'Cloud Calendars or Apple Calendar',
              ],
            },
          ],
        },
      },
      {
        heading: 'Watch Out: All-Day Vacations Default to "Free" in Google Calendar!',
        body: [
          'Here is a costly trap that catches thousands of professionals every summer: when you create an all-day event titled `"Vacation in Greece"` on Google Calendar, Google defaults its availability status to **Free** (`Available`) rather than **Busy**—so Calendly, Google Find a Time, and coworkers think you are available all week!',
          'Whenever an all-day banner represents real PTO or travel where you cannot take calls, manually change `Show as` from `Free` to `Busy` (or use Google’s `Out of office` event type) before saving.',
        ],
      },
      {
        heading: 'Stop 06:00 AM Surprise Alarms on All-Day Birthdays',
        body: [
          'Microsoft Outlook and older Exchange accounts famously attach an `18-hour` reminder to new all-day events—waking your iPhone up at `06:00 AM` the day before a coworker’s birthday! Check `iPhone Settings > Apps > Calendar > Default Alert Times > All-Day Events` and verify alerts on shared all-day calendars so midnight boundaries never trigger pre-dawn buzzes.',
        ],
      },
    ],
    claims: {},
    practical: [
      'When creating an all-day PTO or vacation banner, explicitly flip Availability / Show As from Free to Busy so booking tools and coworkers don’t schedule over your trip.',
      'Align Monday week starts and ISO 8601 week calculation in iPhone Settings > General > Language & Region and Settings > Apps > Calendar > Start Week On.',
      'If you use Cloud Calendars and want ISO week labels, subscribe to a read-only ISO 8601 Week Numbers `.ics` calendar in iOS Settings (or toggle Week Numbers in Apple Calendar alongside it).',
      'Remember that Cloud Calendars’ Home Screen Calendar Events widgets show upcoming timed meetings—open the app to inspect all-day banners.',
    ],
    faq: [
      {
        q: 'Why does my iPhone show Week 45 when my European colleague’s calendar says Week 44?',
        a: 'North American Sunday-start numbering counts January 1 as Week 1, whereas European ISO 8601 numbering starts weeks on Monday and counts the week containing January 4 as Week 1. Switch your Region/Week Start to Monday (ISO 8601) so both calendars match.',
      },
      {
        q: 'Why did someone book a meeting during my all-day "Vacation" event?',
        a: 'Google Calendar (and several iOS editors) set new all-day events to "Free" by default so holidays and birthdays don’t block your entire workday. Always change an all-day PTO event’s status to "Busy".',
      },
      {
        q: 'Does Cloud Calendars show multi-day all-day events?',
        a: 'Yes—multi-day and single-day all-day events appear across Cloud Calendars’ in-app views. Only the Home Screen upcoming Calendar Events widgets filter out all-day banners so timed appointments remain visible.',
      },
    ],
    sourcesHeading: 'ISO 8601, RFC 5545, and official iOS calendar settings references',
    sources: [
      { label: 'Apple Support: Turn on Week Numbers and Alternate Calendars on iPhone', url: 'https://support.apple.com/guide/iphone/change-how-you-view-events-iphfd1054569/ios' },
      { label: 'Google Calendar Help: Create an all-day or Out of Office event (Free vs Busy)', url: 'https://support.google.com/calendar/answer/72143' },
      { label: 'IETF RFC 5545 Section 3.6.1: VEVENT All-Day DATE and exclusive DTEND rules', url: 'https://datatracker.ietf.org/doc/html/rfc5545#section-3.6.1' },
      { label: 'Cloud Calendars on the App Store', url: 'https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319' },
    ],
    relatedComparisons: [
      { slug: 'best-iphone-calendar-widgets-home-and-lock-screen', label: 'Best iPhone Calendar Widgets: Home & Lock Screen' },
      { slug: 'month-view-event-titles-vs-dots-iphone-calendars', label: 'iPhone Calendar Month View: Event Titles vs Dots' },
      { slug: 'timezone-travel-calendar-handling-comparison-iphone', label: 'Time Zone & Flight Calendar Handling on iPhone' },
    ],
    seeAlso: [
      'what-an-all-day-event-really-means',
      'calendar-week-numbers-iso-monday-versus-sunday-start-mismatch',
      'iphone-calendar-language-alternate-calendar-settings',
      'the-widget-that-shows-what-is-next',
    ],
  },
};
