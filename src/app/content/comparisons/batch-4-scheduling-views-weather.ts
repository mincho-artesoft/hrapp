import type { LocalisedArticle } from '../types';

export const COMPARISONS_BATCH_4: Readonly<Record<string, LocalisedArticle>> = {
  'calendar-conflict-detection-vs-calendly-booking-links': {
    updated: '2026-11-12',
    seoTitle: 'Cloud Calendars Booking & Conflict Views vs Calendly',
    title: 'Calendar Conflict Views & Web Booking vs Calendly Links',
    short: 'Conflict Views & Web Booking vs Calendly',
    description:
      'Compare Cloud Calendars Web Booking & multi-column iPhone conflict views with Calendly, Google Appointment Schedules, and Fantastical Openings.',
    lede: 'Modern scheduling needs two surfaces working together: a self-serve public booking page where external clients pick an open slot, and a multi-calendar timeline where you inspect your own iCloud, Google, and Microsoft 365 schedules side by side. Cloud Calendars combines both—offering free browser-based `@handle` booking links (`/calendar/` and `/book/`) synced with Google Calendar and Microsoft Outlook alongside multi-column conflict inspection, hourly Apple WeatherKit forecasts, and single-event App Clip sharing on iPhone and iPad.',
    comparison: {
      heading: 'Feature-by-Feature Comparison Matrix: Unified Calendar + Booking vs Standalone Links',
      caption: 'Cloud Calendars vs Calendly, Google Appointment Schedules, and Fantastical Openings',
      columns: ['Scheduling Capability', 'Cloud Calendars (Web + iOS)', 'Calendly / SavvyCal', 'Google Appointment Schedules', 'Fantastical Openings'],
      rows: [
        {
          cells: [
            'Primary scheduling role',
            'Web Calendar & public `@handle` booking links + multi-account iOS conflict viewer',
            'Public self-serve web booking links, routing forms & round-robin',
            'Web booking pages built directly into Google Calendar',
            'Personal booking links bundled inside Flexibits Premium',
          ],
        },
        {
          cells: [
            'External guest picks an open slot on web?',
            'Yes — free public `/book/?u=handle` & expiring invite links',
            'Yes — core product workflow',
            'Yes — guests book via browser without a Google account',
            'Yes — guests book or vote on polls in browser',
          ],
        },
        {
          cells: [
            'Side-by-side multi-calendar Day columns on iPhone',
            'Yes — one column per selected calendar (iCloud, Google, M365)',
            'No full day-planner grid (companion mobile app manages links)',
            'Configured on desktop web; mobile Google app is single-column',
            'Single merged timeline (no per-calendar side-by-side columns)',
          ],
        },
        {
          cells: [
            'Multi-account conflict check coverage',
            'Google + Microsoft OAuth on Web Booking; iCloud, CalDAV, Google & M365 on iOS',
            'Up to 1 calendar on Free; up to 6 connected calendars on Paid',
            'Checks selected secondary Google calendars (not native iCloud Push)',
            'Checks calendars connected to your Flexibits account',
          ],
        },
        {
          cells: [
            'Sharing one finalized event card',
            'Link, QR code, email & iPhone App Clip preview',
            'Automated confirmation email + ICS invite after booking',
            'Automated Google Calendar invite + email confirmation',
            'Automated calendar invite after slot selection',
          ],
        },
        {
          cells: [
            'Weather check before outdoor / in-person meetings',
            'Built-in Apple WeatherKit hourly & 10-day forecast beside hours',
            'No weather context',
            'No weather context',
            'AccuWeather included in Flexibits Premium',
          ],
        },
        {
          cells: [
            'Social friction with peers, VIPs & family',
            'Zero "book time on my link" formality — propose times humanly',
            'Can feel transactional when sent to friends, execs, or family',
            'Best for office hours, consultations & external clients',
            'Polls help soften group scheduling',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'Why Booking Links Double-Book When iCloud Is Left Out',
        body: [
          'The most common failure with Calendly Free (which checks only 1 calendar connection) and Google Appointment Schedules (which checks only Google-hosted calendars unless bridged) happens when your personal dentist visits or school pickups live in Apple iCloud. External guests see Tuesday at 15:00 as wide open on your work Google or Outlook link because your iPhone’s iCloud calendar was never connected to the booking engine.',
          'Even if you use a paid booking tool for inbound sales or recruiting calls, checking Cloud Calendars’ Multi-calendar Day view on iPhone lets you verify every selected iCloud, Google, and Microsoft calendar side by side—reminding you that a filtered view only reflects the calendars currently checked.',
        ],
        table: {
          heading: 'Account Sync, Protocol & Platform Support Across Tools',
          caption: 'Which calendar providers each tool can check for conflicts or display',
          columns: ['Provider / Dimension', 'Cloud Calendars', 'Calendly', 'Google Appointment Schedules'],
          rows: [
            {
              cells: [
                'Google Calendar & Meet',
                'Direct Google OAuth + Meet links in Free ($0)',
                'Google OAuth + auto-generated Meet links',
                'Native Google Workspace / personal Gmail integration',
              ],
            },
            {
              cells: [
                'Microsoft 365 / Outlook & Teams',
                'Microsoft OAuth + Teams (Premium) or iOS Exchange store',
                'Microsoft 365 / Outlook.com OAuth + Teams links',
                'Cannot check Exchange directly without syncing into Google',
              ],
            },
            {
              cells: [
                'Apple iCloud Calendar',
                'Native iOS EventKit read/write (no app password needed)',
                'Discontinued new iCloud connections for many tiers / legacy CalDAV limits',
                'Cannot read native iCloud Push directly (ICS lag if subscribed)',
              ],
            },
            {
              cells: [
                'Buffer times & travel blocks',
                'Configurable pre/post buffers on Web Meeting Types + drag/resize in timeline',
                'Automated pre/post-meeting buffer rules on Event Types',
                'Configurable buffer time & max bookings per day (Workspace)',
              ],
            },
            {
              cells: [
                'Supported Platforms',
                'Web Browser (`/calendar/`, `/book/`) + iPhone & iPad (iOS / iPadOS 18.0+)',
                'Web, iOS/Android companion apps & browser extensions',
                'Configured on Desktop Web; booked from any browser',
              ],
            },
            {
              cells: [
                'Stripe / PayPal paid consultations',
                'Not a checkout tool',
                'Built-in Stripe & PayPal payment collection on paid tiers',
                'Stripe payment integration on eligible Google Workspace tiers',
              ],
            },
          ],
        },
      },
      {
        heading: 'Pricing and Pairing Strategy: Use Both Where Each Belongs',
        body: [
          'You rarely replace Calendly with a calendar viewer, or replace a daily iPhone calendar app with Calendly. Inbound prospects, podcast guests, and students appreciate self-serve booking links; close colleagues, board members, and family members prefer a direct human message ("Does Thursday at 10:00 or 14:30 work?") followed by a clean invite.',
          'Cloud Calendars costs $0 in Free (or $4.99/year ad-free) to manage your daily iPhone and iPad timeline alongside whichever web booking link your business uses.',
        ],
        table: {
          heading: 'Pricing & Best Choice by Scheduling Scenario',
          caption: 'Matching outbound and inbound scheduling scenarios to the right tool and cost',
          columns: ['Scheduling Scenario', 'Cloud Calendars', 'Booking Link Tool', 'Best Choice'],
          rows: [
            {
              cells: [
                'Inbound sales demos, coaching calls, or student office hours',
                'Free public `@handle` & one-time booking links (`/calendar/`) with Google & Microsoft sync',
                'Calendly ($0 for 1 event type / $10+ mo) or Google Appointment Schedules',
                'Cloud Calendars Web Booking (1-on-1) or Calendly (team round-robin)',
              ],
            },
            {
              cells: [
                'Checking Work M365 + Personal Gmail + Family iCloud before replying to an email',
                'Multi-calendar Day columns on iPhone ($0 Free / $49.99 yr w/ M365 OAuth)',
                'Booking dashboard does not show a full daily agenda with iCloud + weather',
                'Cloud Calendars',
              ],
            },
            {
              cells: [
                'Sending a confirmed dinner, meetup, or game card to an iPhone friend',
                'Single-event link, QR & iPhone App Clip preview ($0 Free)',
                'Requires creating a 1-off booking link just to share one event',
                'Cloud Calendars',
              ],
            },
            {
              cells: [
                'Picking a rain-free afternoon for an outdoor site visit or shoot',
                'Hourly WeatherKit forecast beside hours + tap-hour event draft',
                'Booking links offer slots blindly during thunderstorms',
                'Cloud Calendars',
              ],
            },
            {
              cells: [
                'Group poll where 6 external people vote on 4 candidate times',
                'Not a group polling tool',
                'Calendly Meeting Polls, Doodle, or Fantastical Polls',
                'Meeting Poll tool',
              ],
            },
            {
              cells: [
                'All-in-one Web/iOS calendar app + personal booking link',
                'Free Web Calendar + Booking Studio (`/calendar/`) + iOS app ($0 Free / $4.99 yr ad-free)',
                'Fantastical (~$57/yr) includes Openings',
                'Cloud Calendars (lowest cost) or Fantastical (macOS desktop)',
              ],
            },
          ],
        },
      },
      {
        heading: 'Why Filtered Views Cannot Guarantee a Slot Is Free',
        body: [
          'Before telling a client "I am wide open Friday morning," verify which calendars are checked in your Cloud Calendars filter drawer. Hiding a spouse’s calendar or a secondary Gmail account cleans up visual clutter during focus blocks,-but an unchecked calendar cannot warn you about a conflict.',
          'Make a habit of enabling "All Work + Personal" calendars in Multi-calendar view whenever you propose external meeting times.',
        ],
      },
      {
        heading: 'Single-Event Sharing vs Whole-Calendar Sharing',
        body: [
          'When you only need someone to show up at the right place and time once, sharing an entire calendar is over-permissive and sending a booking link is backwards. Cloud Calendars lets you share just that single appointment via link, QR code, or email so the recipient sees only that event.',
          'On iPhone, recipients can preview the shared event immediately in an App Clip card and install the full app if they decide to save it into Cloud Calendars.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Use Calendly or Google Appointment Schedules when external guests initiate bookings on your public schedule.',
      'Check all relevant iCloud, Google, and Microsoft calendars in Cloud Calendars’ Multi-calendar Day view before proposing manual times.',
      'Confirm that personal blockers (like school runs stored in iCloud) are also reflected as Busy blocks on whichever calendar your booking link reads.',
      'Check the Apple WeatherKit hourly forecast in Day or Week view before offering outdoor lunch, walking-meeting, or site-visit times.',
      'Share confirmed one-off events via Cloud Calendars link, QR, or standard attendee invite rather than exposing your whole calendar.',
    ],
    faq: [
      {
        q: 'Does Cloud Calendars include a Calendly-style public booking link?',
        a: 'Yes. Cloud Calendars Web Studio (/calendar/) includes free public @handle booking pages (/book/?u=handle), custom meeting types with buffer times, one-time or expiring invite links, guest reschedule/cancel links, and Google Calendar + Microsoft Outlook busy-check and event write-back.',
      },
      {
        q: 'Do appointments booked through Calendly appear automatically in Cloud Calendars?',
        a: 'Yes. As soon as Calendly or Google Appointment Schedules writes a booked meeting onto your connected Google Calendar, Microsoft 365 calendar, or iOS calendar, it syncs straight into Cloud Calendars.',
      },
      {
        q: 'Why did Google Appointment Schedules let someone book over my personal event?',
        a: 'Google Appointment Schedules only blocks times from calendars checked under its "Calendars checked for availability" setting—and it cannot directly read native iCloud calendars unless those times are also blocked on Google.',
      },
    ],
    sourcesHeading: 'Official booking and availability check documentation',
    sources: [
      { label: 'Google Calendar Help: Learn about appointment schedules', url: 'https://support.google.com/calendar/answer/10729749' },
      { label: 'Calendly Help: Connecting your calendar to Calendly', url: 'https://help.calendly.com/hc/en-us/articles/14074797893143-Calendly-with-Google-Calendar' },
      { label: 'Flexibits: Fantastical Openings documentation', url: 'https://flexibits.com/fantastical/openings' },
      { label: 'Cloud Calendars on the App Store', url: 'https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319' },
    ],
    relatedComparisons: [
      { slug: 'merge-icloud-google-outlook-exchange-calendars-iphone', label: 'Merge iCloud, Google & Outlook Calendars on iPhone' },
      { slug: 'cloud-calendars-vs-fantastical', label: 'Cloud Calendars vs Fantastical' },
      { slug: 'cloud-calendars-vs-google-calendar-iphone', label: 'Cloud Calendars vs Google Calendar on iPhone' },
    ],
    seeAlso: [
      'booking-link-or-shared-calendar',
      'google-appointment-schedule-which-calendars-block-booking-slots',
      'sharing-one-event-not-your-calendar',
      'inviting-people-who-do-not-have-the-app',
    ],
  },

  'timezone-travel-calendar-handling-comparison-iphone': {
    updated: '2026-11-04',
    seoTitle: 'Time Zone & Flight Calendar Handling on iPhone',
    title: 'Time Zone & Flight Calendar Handling on iPhone',
    short: 'Time Zone & Travel Calendar Handling',
    description:
      'Compare how Cloud Calendars, Apple Calendar, Google Calendar, Outlook, and Notion Calendar handle Time Zone Override, floating times, flights, and destination weather on iPhone.',
    lede: 'Nothing ruins the first morning of a business trip faster than an 09:00 client breakfast silently shifting to 15:00 when your iPhone touches down and updates its cellular time zone. Calendar apps handle travel well only when you understand three rules: anchoring flights to separate departure and arrival IANA time zones, distinguishing fixed-zone meetings from "floating" all-day banners, and checking whether iOS Time Zone Override is locking your display. Cloud Calendars pairs standard multi-provider time-zone sync across iCloud, Google, and Microsoft with a city-searchable Apple WeatherKit hub so you can check destination forecasts days before departure. Arte Soft develops Cloud Calendars and publishes this comparison.',
    comparison: {
      heading: 'Time Zone & Travel Handling Comparison Matrix',
      caption: 'Comparing time-zone controls, flight imports, and destination weather across iPhone calendar apps',
      columns: ['Travel Capability', 'Cloud Calendars (iOS)', 'Apple Calendar (iOS)', 'Google Calendar (iOS)', 'Notion Calendar / Fantastical'],
      rows: [
        {
          cells: [
            'Automatic adaptation on landing',
            'Follows iOS device time zone & shifts UTC/zoned events accurately',
            'Follows iOS device time zone unless Time Zone Override is active',
            'Prompts or auto-updates display time zone when traveling',
            'Auto-updates or pins multiple time-zone columns (Notion/Fantastical)',
          ],
        },
        {
          cells: [
            'Destination city weather lookup before flying',
            'Built-in Apple WeatherKit city search (hourly & up-to-10-day forecast)',
            'Requires opening separate Apple Weather app',
            'No built-in weather forecast on iOS',
            'Fantastical Premium (location weather); none in Notion Calendar',
          ],
        },
        {
          cells: [
            'Automated flight & hotel email parsing',
            'Displays Gmail/Outlook auto-imported flights once synced to calendar',
            'Siri Suggestions from Apple Mail & Messages',
            'Automatic Events from Gmail (flights, trains, hotels)',
            'Displays provider-imported travel events',
          ],
        },
        {
          cells: [
            'Side-by-side multi-time-zone hour ruler',
            'Single local/selected time axis; Multi-calendar columns separate accounts',
            'Single time axis (Time Zone Override locks whole view to one city)',
            'Secondary time zone column on Desktop Web only (not iPhone)',
            'Multiple named time-zone columns on desktop & mobile (Notion Calendar)',
          ],
        },
        {
          cells: [
            'Floating time zone events (RFC 5545 local wall time)',
            'Preserves provider time-zone / all-day semantics from EventKit & OAuth',
            'Supports "Floating" time zone on iCloud/CalDAV events',
            'All timed Google events carry an explicit IANA zone (no floating timed events)',
            'Supported on iCloud/CalDAV in Fantastical; explicit zones in Notion',
          ],
        },
        {
          cells: [
            'Lock Screen countdown at the airport',
            'Live Activity countdown to next timed event (flight / transfer)',
            'Up Next widget & Siri travel-time alerts',
            'Standard push notification alerts',
            'Fantastical Live Activity / Up Next widgets',
          ],
        },
        {
          cells: [
            'Offline cabin access in Airplane Mode',
            'Reads cached iOS store & local events offline',
            'Full offline EventKit cache in Airplane Mode',
            'Recent synced window cached offline',
            'Cached events viewable offline',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'How iCloud, Google, and Microsoft Store Event Time Zones Differently',
        body: [
          'Underneath every calendar app, providers represent time zones with subtle differences that surface mid-flight. Google Calendar stores timed appointments with an explicit IANA zone (`America/New_York`, `Europe/London`) and allows separate start and end time zones on flights—so a 7-hour flight leaving JFK at 19:00 EST and landing at LHR at 07:00 GMT draws an accurate 7-hour block rather than a negative or 12-hour block.',
          'Apple iCloud (CalDAV) supports explicit IANA zones plus a special `Floating` setting: a 07:00 "Morning Run" marked Floating stays at 07:00 wall-clock time whether you wake up in Chicago, Tokyo, or Lisbon. All-day events (`VALUE=DATE` in RFC 5545) are timeless date strings, though poorly written third-party ICS exporters sometimes encode them as `00:00 UTC` to `24:00 UTC`, causing hotel check-in banners to spill across two days when viewed in the Americas.',
        ],
        table: {
          heading: 'Account Sync, Protocol & Travel Metadata Support',
          caption: 'How time zones, flights, and offline caches behave across calendar backends',
          columns: ['Provider / Protocol', 'Start vs End Time Zone', 'Floating Timed Events', 'All-Day Travel Banners'],
          rows: [
            {
              cells: [
                'Google Calendar (OAuth)',
                'Supports distinct departure & arrival IANA zones per event',
                'Not supported — every timed event resolves to UTC/IANA',
                'Stored as timeless YYYY-MM-DD dates (clean across zones)',
              ],
            },
            {
              cells: [
                'Apple iCloud / CalDAV (EventKit)',
                'Supports per-event IANA time zone selection',
                'Supported — stays at fixed wall-clock hour everywhere',
                'Timeless date banners across Day/Week/Month',
              ],
            },
            {
              cells: [
                'Microsoft 365 / Exchange',
                'Supports separate start & end time zones for flights',
                'Always anchored to Windows/IANA time zone metadata',
                'Stored with midnight boundaries mapped to event zone',
              ],
            },
            {
              cells: [
                'TripIt / Airline ICS Subscriptions',
                'Usually emits UTC (`Z`) or local airport `TZID` timestamps',
                'Rarely used in airline feeds',
                'Occasionally shifts if publisher exports midnight UTC instead of `VALUE=DATE`',
              ],
            },
            {
              cells: [
                'Cloud Calendars WeatherKit Hub',
                'Search any global city independent of current GPS location',
                'Shows local hours for the searched city’s forecast',
                'Up to 10 returned daily highs/lows, rain, wind & UV',
              ],
            },
            {
              cells: [
                'Airplane Mode Offline Behavior',
                'Cached local/EventKit events remain readable at 35,000 ft',
                'Edits queue until connectivity resumes',
                'Live WeatherKit updates require data connection',
              ],
            },
          ],
        },
      },
      {
        heading: 'Pricing and Best App Choice for Frequent Travelers',
        body: [
          'Frequent flyers and remote distributed teams face two distinct problems: (1) scheduling calls across San Francisco, London, and Singapore from a desk, where dual/triple time-zone rulers shine, and (2) navigating on-the-ground itineraries, flights, family handoffs, and destination weather from an iPhone.',
          'Notion Calendar ($0) is hard to beat on Mac/Windows when you want three permanent time-zone columns beside your grid. On iPhone and iPad, Cloud Calendars ($0 Free or $4.99/year ad-free) combines your work, personal, and TripIt calendars with instant destination city forecasts via Apple WeatherKit.',
        ],
        table: {
          heading: 'Pricing & Best Choice by Travel & Remote Work Scenario',
          caption: 'Picking the best calendar setup for flights, cross-border teams, and trip weather',
          columns: ['Travel / Remote Scenario', 'Cloud Calendars', 'Alternative App', 'Best Choice'],
          rows: [
            {
              cells: [
                'Packing & planning outdoor itinerary with destination city weather',
                'Search destination city in WeatherKit hub ($0 Free)',
                'Must cross-reference calendar dates with separate Weather app',
                'Cloud Calendars',
              ],
            },
            {
              cells: [
                'Desktop grid showing NYC, London & Tokyo hour columns side by side',
                'Single time axis on iPhone/iPad',
                'Notion Calendar ($0) or Outlook/Google Web multi-zone columns',
                'Notion Calendar (Desktop)',
              ],
            },
            {
              cells: [
                'Unifying Gmail auto-flights + work M365 + family iCloud while traveling',
                'All 3 in Multi-calendar columns ($0 w/ iOS Exchange or $49.99/yr Premium)',
                'Google app misses native M365 OAuth; Outlook mixes work email',
                'Cloud Calendars',
              ],
            },
            {
              cells: [
                'Locking iPhone calendar to home office time while abroad',
                'Check iOS Settings > Apps > Calendar > Time Zone Override',
                'Apple Calendar native Time Zone Override toggle ($0)',
                'Apple Calendar / iOS Settings',
              ],
            },
            {
              cells: [
                'Daily habit (meditation / medication) at 08:00 local wall time anywhere',
                'Displays iCloud Floating events via EventKit',
                'Create Floating-zone event in Apple Calendar or BusyCal',
                'iCloud Floating + Cloud Calendars',
              ],
            },
            {
              cells: [
                'Glancing at gate departure countdown on iPhone Lock Screen',
                'Live Activity countdown to next timed event ($0 Free)',
                'Flighty (dedicated flight tracker) or Fantastical (~$57/yr)',
                'Cloud Calendars + Airline/Flighty app',
              ],
            },
          ],
        },
      },
      {
        heading: 'How to Avoid the Classic Dinner-Reservation Time-Zone Mistake',
        body: [
          'Suppose you sit on your sofa in New York (`UTC-5`) booking a 20:00 dinner in Rome (`UTC+1`) for next month. If you leave the event’s time zone set to your current location (New York) and type `20:00`, your calendar records `01:00 UTC`—which will jump to `02:00 AM` the next morning as soon as your plane lands in Italy!',
          'Always set the event’s explicit time zone to the destination city (`Rome` / `Europe/Rome`) at the moment you create an overseas hotel check-in, train, or dinner reservation.',
        ],
      },
      {
        heading: 'Checking Destination Weather Before You Pack',
        body: [
          'Instead of flipping back and forth between your travel dates and a separate weather app, open the Weather Hub inside Cloud Calendars and search your destination city.',
          'You can inspect hourly temperatures, feels-like wind chill, precipitation bands, and UV index for up to ten returned Apple WeatherKit forecast days, then switch straight back to Week view to move walking tours away from rainy afternoons.',
        ],
      },
    ],
    claims: {},
    practical: [
      'When booking a restaurant, tour, or train in another time zone before your trip, set the event’s explicit time zone to the destination city immediately.',
      'Before flying, check iPhone Settings > Apps > Calendar > Time Zone Override so you know whether your calendar will shift to local airport time or stay pinned to home.',
      'Subscribe to TripIt or airline `.ics` feeds in iOS Calendar Accounts rather than importing static `.ics` files, so gate or schedule updates flow automatically.',
      'Search your destination city in Cloud Calendars’ Weather Hub inside the 10-day window before departure to align outdoor plans with dry hours.',
    ],
    faq: [
      {
        q: 'Why did all my iPhone calendar events shift by several hours when I landed?',
        a: 'Your iPhone updated its local time zone from cellular/GPS towers, and timed calendar events anchored to home-office hours automatically converted to your new local wall-clock time so you still join remote calls at the right instant.',
      },
      {
        q: 'How do I keep a restaurant reservation at 19:30 local destination time when creating it from home?',
        a: 'Select the destination city’s time zone (for example, `Europe/Paris` or `Asia/Tokyo`) in the event’s time-zone field when saving it, rather than leaving it in your home time zone.',
      },
      {
        q: 'Can I check weather for another city inside Cloud Calendars before I travel there?',
        a: 'Yes. Cloud Calendars’ Weather Hub lets you search for any city worldwide to inspect Apple WeatherKit hourly and up-to-10-day forecasts alongside your planning.',
      },
    ],
    sourcesHeading: 'Official time-zone and travel calendar documentation',
    sources: [
      { label: 'Apple Support: Use Calendar in different time zones on iPhone (Time Zone Override)', url: 'https://support.apple.com/guide/iphone/use-multiple-calendars-iph3d1110d4/ios' },
      { label: 'Google Calendar Help: Use Google Calendar in different time zones', url: 'https://support.google.com/calendar/answer/37064' },
      { label: 'Microsoft Support: Add, remove, or change time zones in Outlook', url: 'https://support.microsoft.com/en-us/office/add-remove-or-change-time-zones-5ab3e10e-5a6c-46af-ab48-156fedf70c04' },
      { label: 'Cloud Calendars on the App Store', url: 'https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319' },
    ],
    relatedComparisons: [
      { slug: 'calendar-apps-with-built-in-weather-forecast-iphone', label: 'iPhone Calendar Apps with Built-In Weather Compared' },
      { slug: 'cloud-calendars-vs-notion-calendar-cron', label: 'Cloud Calendars vs Notion Calendar (Cron)' },
      { slug: 'all-day-multi-day-banners-and-week-numbers-calendars-ios', label: 'All-Day Banners & Week Numbers in iOS Calendars' },
    ],
    seeAlso: [
      'time-zones-and-the-flight-you-booked',
      'display-multiple-time-zone-columns-google-calendar-outlook',
      'weather-where-the-event-is',
      'outlook-events-from-email-flights-hotels',
    ],
  },

  'best-iphone-calendar-widgets-home-and-lock-screen': {
    updated: '2026-11-04',
    seoTitle: 'Best iPhone Calendar Widgets: Home & Lock Screen',
    title: 'Best iPhone Calendar Widgets: Home & Lock Screen',
    short: 'Best iPhone Calendar Widgets Compared',
    description:
      'Compare Home Screen widgets, Lock Screen widgets, StandBy displays, and Live Activity countdowns across Cloud Calendars, Apple Calendar, Fantastical, Google Calendar, and Widgetsmith.',
    lede: 'A great iPhone calendar widget answers two questions in half a second without unlocking or opening an app: "What is my next real timed appointment?" and "What is the weather outside when I leave for it?" Cloud Calendars includes small and medium date-and-weather Home Screen widgets, medium and large timed-event list widgets (intentionally filtering out multi-day all-day banner clutter), and a Lock Screen Live Activity countdown in its $0 Free plan—while Apple Calendar, Fantastical, and Widgetsmith cover Lock Screen accessory slots, full Month grids, and custom typography. Arte Soft develops Cloud Calendars and publishes this comparison.',
    comparison: {
      heading: 'iPhone Calendar Widget & Lock Screen Matrix',
      caption: 'Comparing Home Screen widgets, Lock Screen Live Activities, weather, and cost on iOS 18+',
      columns: ['Widget Capability', 'Cloud Calendars', 'Apple Calendar (iOS 18)', 'Fantastical', 'Google Calendar / Widgetsmith'],
      rows: [
        {
          cells: [
            'Combined Date + Live Weather widget',
            'Yes — Small & Medium Calendar & Weather Home Screen layouts (Free)',
            'No — requires separate Calendar + Apple Weather widgets',
            'Yes — customizable date/agenda + weather (Flexibits Premium)',
            'No in Google Calendar; paid weather tier in Widgetsmith',
          ],
        },
        {
          cells: [
            'Upcoming timed-events list widgets',
            'Medium & Large Calendar Events layouts showing future timed events',
            'Small, Medium & Large Up Next / List widgets (includes Reminders)',
            'Small, Medium & Large Event + Task list widgets',
            'Google Up Next (Small/Medium); Widgetsmith agenda layouts',
          ],
        },
        {
          cells: [
            'How all-day banners behave in event widgets',
            'Filtered out of event-list widgets so timed meetings stay visible (view all-day in app)',
            'Shown at top of Up Next / List widgets',
            'Configurable toggle per widget instance',
            'Shown in Google Up Next header',
          ],
        },
        {
          cells: [
            'Lock Screen Live Activity / Dynamic Island countdown',
            'Yes — dedicated Live Activity countdown on supported iPhones (Free)',
            'Standard notification banners (no persistent countdown bar)',
            'Live Activity support for upcoming meetings & join buttons',
            'None in Google Calendar iOS',
          ],
        },
        {
          cells: [
            'Mini Month-grid Home Screen widget',
            'Focused on Date+Weather & Timed Event lists (Month grid inside app)',
            'Built-in Small/Large Month calendar grid widgets',
            'Small/Medium/Large Month grid + event list combo widgets',
            'Google Month widget; custom aesthetic grids in Widgetsmith',
          ],
        },
        {
          cells: [
            'Multi-account widget sources (iCloud + Google + M365)',
            'Reflects connected iCloud, Google (Free) & Microsoft (Premium) events',
            'Reflects all enabled iOS Calendar Accounts',
            'Reflects Calendar Sets (Premium required for full set)',
            'Google app shows Google + optional local iOS store',
          ],
        },
        {
          cells: [
            'Widget unlock cost',
            '$0 Free (all 3 Home Screen sizes + Live Activity included)',
            '$0 built into iOS',
            'Basic widgets free; advanced layouts/weather ~$57/yr',
            '$0 Google; ~$19.99/yr Widgetsmith Premium (weather/themes)',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'Why Filtering Out All-Day Banners Makes Event Widgets Useful Again',
        body: [
          'If you subscribe to a company holiday calendar, track a 5-day conference, or share a family calendar with "School Spirit Week" and three birthdays, standard iOS Up Next widgets often fill all four visible lines with all-day banners—pushing your actual 10:30 client call completely off the bottom of the widget.',
          'Cloud Calendars’ medium and large `Calendar Events` widgets deliberately list upcoming timed appointments so you always see the next clock-bound commitment, while keeping all-day and multi-day entries neatly visible inside the app’s Day, Week, Month, and List views.',
        ],
        table: {
          heading: 'Widget Refresh, Sync & Platform Behavior on iOS',
          caption: 'Understanding iOS WidgetKit refresh budgets, Live Activities, and StandBy mode',
          columns: ['System Behavior', 'Cloud Calendars', 'Apple Calendar', 'Fantastical'],
          rows: [
            {
              cells: [
                'iOS WidgetKit timeline refresh',
                'Updates periodically per iOS budget; open app after sudden edits to force sync',
                'First-party system priority refresh on local EventKit edits',
                'Subject to standard third-party iOS WidgetKit refresh intervals',
              ],
            },
            {
              cells: [
                'Lock Screen presence',
                'Live Activity countdown bar on Lock Screen & Dynamic Island',
                'Circular, rectangular & inline Lock Screen WidgetKit accessories',
                'Lock Screen accessories + Live Activities',
              ],
            },
            {
              cells: [
                'iPhone StandBy Mode (nightstand charging)',
                'Small date+weather widget fits 2-column StandBy stacks cleanly',
                'Native StandBy calendar & Up Next smart stacks',
                'StandBy compatible small widgets',
              ],
            },
            {
              cells: [
                'iPadOS Home Screen & Today View',
                'Small, medium & large widgets supported on iPadOS 18+',
                'Small, medium, large & extra-large iPad widgets',
                'Full iPadOS widget suite including XL layouts',
              ],
            },
            {
              cells: [
                'Weather source on widget',
                'Apple WeatherKit (temperature + sky condition)',
                'Not included on Calendar widget',
                'AccuWeather (paid tier)',
              ],
            },
            {
              cells: [
                'iOS 18 Tinted / Dark Mode icons',
                'Compatible with iOS 18+ Home Screen placement',
                'Native light, dark & tinted system rendering',
                'Light, dark & custom theme options',
              ],
            },
          ],
        },
      },
      {
        heading: 'Pricing and Choosing the Right Widget Combination',
        body: [
          'Because iOS lets you place widgets from multiple apps on the same Home Screen or Smart Stack, you never have to pay $57/year just for one missing layout. For example, many iPhone users place Cloud Calendars’ `Calendar & Weather` or `Calendar Events Large` widget on page one of their Home Screen while keeping an Apple Calendar rectangular accessory above the Lock Screen clock.',
          'Every widget size and the Live Activity countdown in Cloud Calendars are unlocked in the $0 Free plan.',
        ],
        table: {
          heading: 'Pricing & Best Choice by Glanceable iPhone Workflow',
          caption: 'Best iPhone widget choice by screen space, aesthetics, and budget',
          columns: ['Glanceable Goal', 'Cloud Calendars', 'Alternative App', 'Best Choice'],
          rows: [
            {
              cells: [
                'Saving Home Screen space by combining Date + Weather in 1 small/medium tile',
                'Calendar & Weather widget included in Free ($0)',
                'Apple requires 2 separate widgets; Widgetsmith charges ~$20/yr for weather',
                'Cloud Calendars',
              ],
            },
            {
              cells: [
                'Seeing next 4–6 timed meetings without all-day holiday clutter',
                'Calendar Events Medium / Large widgets ($0 Free)',
                'Standard widgets often bury timed events under multi-day banners',
                'Cloud Calendars',
              ],
            },
            {
              cells: [
                'Live countdown to your next meeting on Lock Screen / Dynamic Island',
                'Built-in Live Activity countdown ($0 Free)',
                'Apple Calendar lacks Live Activity countdown',
                'Cloud Calendars',
              ],
            },
            {
              cells: [
                'Checking off iOS 18 Reminders directly from a Home Screen widget',
                'Shows calendar events only',
                'Apple Calendar + Apple Reminders interactive widgets ($0)',
                'Apple Calendar / Reminders',
              ],
            },
            {
              cells: [
                'Full 31-day mini Month grid permanently on Home Screen',
                'Month grid lives inside the app',
                'Apple Calendar ($0) or Fantastical Month widget',
                'Apple Calendar',
              ],
            },
            {
              cells: [
                'Custom pastel fonts, photo backgrounds & aesthetic Home Screen themes',
                'Clean high-legibility native design',
                'Widgetsmith ($0 / ~$19.99 yr)',
                'Widgetsmith',
              ],
            },
          ],
        },
      },
      {
        heading: 'Why Third-Party iOS Widgets Sometimes Take a Few Minutes to Update',
        body: [
          'Apple’s WidgetKit framework does not let third-party apps run live code continuously on your Home Screen; instead, iOS allocates each widget a daily refresh budget to protect battery life. Similarly, Lock Screen Live Activities update asynchronously and can take a moment after a remote server edit.',
          'Whenever a meeting moves at the last minute on a coworker’s laptop, tap the widget once to open Cloud Calendars—opening the app refreshes synchronization immediately and updates your widget timeline.',
        ],
      },
      {
        heading: 'Building a Zero-Clutter Smart Stack on iPhone',
        body: [
          'If you hate giving up two rows of app icons, stack two medium widgets in a single 4x2 Smart Stack: put `Cloud Calendars — Calendar & Weather` on top for mornings and `Cloud Calendars — Calendar Events` one swipe underneath for workdays.',
          'Enable Live Activity for busy back-to-back afternoons so you can glance at remaining minutes on your Lock Screen without touching the phone.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Open Cloud Calendars once and sign into your calendars before adding widgets so iOS registers your initial timeline.',
      'Touch and hold an empty area of your iPhone Home Screen, tap Edit > Add Widget, and select Cloud Calendars.',
      'Choose Small or Medium Calendar & Weather for date + Apple WeatherKit conditions, or Medium / Large Calendar Events for upcoming timed meetings.',
      'Enable Live Activity inside Cloud Calendars on supported iPhones to place a live countdown on your Lock Screen.',
      'Remember that Calendar Events widgets show timed appointments—tap into the app whenever you want to inspect all-day banners.',
    ],
    faq: [
      {
        q: 'Why isn’t my all-day birthday or holiday showing on the Cloud Calendars Events widget?',
        a: 'By design, Cloud Calendars’ medium and large Calendar Events widgets display upcoming timed appointments so multi-day banners never push real meetings off-screen. Open the app to see all-day entries in Day, Week, Month, or List view.',
      },
      {
        q: 'Are Cloud Calendars widgets and Live Activities free?',
        a: 'Yes. All three widget sizes (small, medium, and large) and the Lock Screen Live Activity countdown are included in the $0 Free plan.',
      },
      {
        q: 'Why didn’t my widget update the instant someone moved a Google Calendar invite?',
        a: 'iOS throttles background widget and Live Activity refreshes to save battery. Tap the widget to open Cloud Calendars whenever you want an immediate sync check after a schedule change.',
      },
    ],
    sourcesHeading: 'Official iOS WidgetKit and Live Activity guides',
    sources: [
      { label: 'Apple Support: Add, edit, and remove widgets on iPhone', url: 'https://support.apple.com/en-us/118610' },
      { label: 'Apple Support: Use StandBy to view information at a distance on iPhone', url: 'https://support.apple.com/guide/iphone/use-standby-iph878d77632/ios' },
      { label: 'Apple Developer: Keeping a widget up to date (WidgetKit refresh budgets)', url: 'https://developer.apple.com/documentation/widgetkit/keeping-a-widget-up-to-date' },
      { label: 'Cloud Calendars on the App Store', url: 'https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319' },
    ],
    relatedComparisons: [
      { slug: 'apple-watch-calendar-complications-comparison', label: 'Apple Watch Complications vs iPhone Live Activity' },
      { slug: 'all-day-multi-day-banners-and-week-numbers-calendars-ios', label: 'All-Day Banners & Week Numbers in iOS Calendars' },
      { slug: 'calendar-apps-with-built-in-weather-forecast-iphone', label: 'iPhone Calendar Apps with Built-In Weather Compared' },
    ],
    seeAlso: [
      'the-widget-that-shows-what-is-next',
      'a-countdown-to-your-next-meeting',
      'lock-screen-without-unlocking',
      'choosing-a-widget-size',
    ],
  },

  'month-view-event-titles-vs-dots-iphone-calendars': {
    updated: '2026-11-04',
    seoTitle: 'iPhone Calendar Month View: Event Titles vs Dots',
    title: 'iPhone Calendar Month View: Event Titles vs Dots',
    short: 'Month View Event Titles vs Dots',
    description:
      'Tired of meaningless gray dots in monthly views? Compare readable Month-cell event title chips, +N overflow counts, and zoom modes across Cloud Calendars, Apple Calendar iOS 18, Google, and BusyCal.',
    lede: 'For more than a decade on iOS, Apple Calendar’s Month view showed uniform gray dots under every date—making a day with one dentist appointment look identical to a day with six executive reviews until you tapped each cell individually. In iOS 18+, Apple finally added pinch-to-zoom Details mode, joining apps like Cloud Calendars, Google Calendar, and BusyCal that render actual colored event title chips directly inside every monthly square. Cloud Calendars goes further on iPhone and iPad by pairing colored single-line Month chips and `+N` overflow indicators with direct drag-to-move rescheduling and a 12-month Year view. Arte Soft develops Cloud Calendars and publishes this comparison.',
    comparison: {
      heading: 'iPhone Month View Readability Matrix: Event Titles vs Dots',
      caption: 'Comparing monthly cell rendering, overflow handling, drag-and-drop, and weather across iOS calendars',
      columns: ['Month View Detail', 'Cloud Calendars', 'Apple Calendar (iOS 18+)', 'Google Calendar (iOS)', 'BusyCal / Fantastical'],
      rows: [
        {
          cells: [
            'Default Month cell display',
            'Colored single-line event title chips inside every date cell',
            'Pinch-zoomable: Compact (dots), Stacked (colored bars), or Details (tiny text)',
            'Colored event title chips inside full-screen monthly grid',
            'Readable multi-line/single-line cells (BusyCal); dots/list split or full-screen iPad (Fantastical)',
          ],
        },
        {
          cells: [
            'Overflow indicator on packed days',
            'Explicit `+N` overflow count badge; tap day to inspect full list',
            'Truncates vertically depending on pinch zoom level',
            'Shows `+N` count when cell height fills up',
            'Configurable font size & row count in BusyCal',
          ],
        },
        {
          cells: [
            'Drag-and-drop event to another date in Month view',
            'Supported — drag editable events across days & review recurrence options',
            'Supported via long-press drag in iOS 18',
            'Primarily day/week drag; Month tap opens day detail',
            'Supported in BusyCal & Fantastical',
          ],
        },
        {
          cells: [
            'Multi-day trip & conference banners',
            'Continuous horizontal banner spanning start-to-end dates',
            'Continuous colored bar in Stacked & Details modes',
            'Continuous colored bar across week rows',
            'Continuous colored banners across dates',
          ],
        },
        {
          cells: [
            'Split Month + Agenda list on one screen',
            'Tap any date cell to inspect day appointments; dedicated List & Day views',
            'List button toggles half-screen Month + Agenda drawer below',
            'Tap date opens popup card; Schedule view scrolls continuously',
            'Fantastical’s signature DayTicker / half-month + list layout',
          ],
        },
        {
          cells: [
            '12-month Year view one tap away',
            'Full 12-month Year overview included in Free',
            'Pinch out / back button to 12-month Year grid',
            'No 12-month Year overview screen',
            'Year view / activity heatmap available',
          ],
        },
        {
          cells: [
            'iPad big-screen Month layout',
            'Spacious landscape & portrait iPad Month grid with readable chips',
            'Full-screen native iPadOS Month grid',
            'Tablet Month grid',
            'Full-screen iPad Month grid with weather/tasks',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'Why Physics Limits What Any 6-inch Phone Screen Can Show in 7 Columns',
        body: [
          'Dividing a portrait iPhone screen (`~390 pt` logical width) into 7 day columns leaves roughly `52 pt` of horizontal width per day—enough for 6 to 9 characters of legible text per chip (`"Dentist"`, `"NYC Trip"`, `"Q4 Sync"`). Any app promising complete 6-word meeting titles across 7 portrait columns either shrinks text below readable point sizes or forces horizontal scrolling.',
          'The secret to making Month view effortless on iPhone is pairing color-coded calendar chips with front-loaded titles: name events `" pediatrician — Leo"` -> `"Leo Dr"` or `"Flight BA178"` rather than `"Confirmation for upcoming appointment with..."`, and always open the day before assuming a `+2` cell has an open afternoon.',
        ],
        table: {
          heading: 'Account Sync, Color Coding & Platform Support for Month Planners',
          caption: 'How calendar colors, accounts, and landscape modes behave across Month-chip apps',
          columns: ['Planning Dimension', 'Cloud Calendars', 'Apple Calendar (iOS 18)', 'Google Calendar (iOS)'],
          rows: [
            {
              cells: [
                'Per-calendar color chips (iCloud + Google + M365)',
                'Preserves distinct calendar colors across iCloud, Google & Microsoft',
                'Preserves iCloud, Exchange & CalDAV calendar colors',
                'Supports Google Calendar palette + per-event color overrides',
              ],
            },
            {
              cells: [
                'Landscape Month / Week expansion on iPhone',
                'Both portrait & wide landscape Week/Month readability',
                'Landscape rotates into Multi-day Week grid on iPhone',
                'Supports landscape orientation',
              ],
            },
            {
              cells: [
                'Weather context when zooming from Month to Week/Day',
                'Switch straight into Week (daily high/low) or Day (hourly WeatherKit)',
                'No built-in weather when zooming into a day',
                'No built-in weather on iOS',
              ],
            },
            {
              cells: [
                'Google Calendar + iCloud unified in Month view',
                'Direct Google OAuth + native EventKit iCloud in Free ($0)',
                'Via iOS Settings > Calendar Accounts (Fetch for Gmail)',
                'Google native + optional local iOS calendar read',
              ],
            },
            {
              cells: [
                'Supported Devices',
                'iPhone & iPad (iOS / iPadOS 18.0+)',
                'iPhone, iPad, Mac, Watch & Vision Pro',
                'iPhone, iPad, Android & Web',
              ],
            },
            {
              cells: [
                'Cost for readable Month title chips',
                '$0 Free (or $4.99/yr ad-free Advanced)',
                '$0 built into iOS 18+',
                '$0 Free',
              ],
            },
          ],
        },
      },
      {
        heading: 'Pricing and Best App Choice for Visual Monthly Planners',
        body: [
          'If you haven’t opened Apple Calendar since iOS 16 or iOS 17, try two-finger pinching outward on its Month view in iOS 18—Apple’s new Details zoom finally replaces gray dots with tiny event labels for free. Where Apple Calendar still stops short is combining that monthly overview with a portrait 7-day Week grid, side-by-side account columns, and built-in weather.',
          'Cloud Calendars gives visual thinkers all five zoom levels—Day, portrait/landscape Week, chip-based Month, 12-month Year, and Multi-calendar columns—in its $0 Free plan.',
        ],
        table: {
          heading: 'Pricing & Best Choice by Monthly Planning Style',
          caption: 'Matching visual Month-grid preferences to the strongest iPhone and iPad app',
          columns: ['Visual Planning Preference', 'Cloud Calendars', 'Alternative App', 'Best Choice'],
          rows: [
            {
              cells: [
                'Colored Month title chips + portrait Week + WeatherKit for $0',
                'All included in Free ($0) or $4.99/yr ad-free',
                'Apple lacks weather; Google lacks Year view & weather',
                'Cloud Calendars',
              ],
            },
            {
              cells: [
                'Half-screen Month calendar on top + scrolling agenda list below',
                'Full-screen Month grid (tap day to inspect)',
                'Apple Calendar List toggle ($0) or Fantastical (~$57/yr)',
                'Apple Calendar or Fantastical',
              ],
            },
            {
              cells: [
                'Shrinking Month font down to 6–8pt to squeeze 7 rows per cell',
                'Clean fixed-legibility single-line chips + `+N` badge',
                'BusyCal iOS ($14.99 one-time) offers granular font/row sliders',
                'BusyCal iOS',
              ],
            },
            {
              cells: [
                'Spacious iPad Month planner on a desk stand or kitchen counter',
                'Native iPad Month, Week, Year & Multi-column views ($0 / $4.99 yr)',
                'Google iPad app lacks 12-month Year & WeatherKit',
                'Cloud Calendars on iPad',
              ],
            },
            {
              cells: [
                'Dragging tentative trips & shifts across Month dates',
                'Drag editable events across days with recurrence prompt ($0)',
                'Supported in Apple Calendar iOS 18 & BusyCal',
                'Cloud Calendars or Apple Calendar',
              ],
            },
            {
              cells: [
                'Color-coding individual events differently inside one Google calendar',
                'Uses calendar-level color coding',
                'Google Calendar App ($0) supports 11 per-event Flamingo/Sage colors',
                'Google Calendar App',
              ],
            },
          ],
        },
      },
      {
        heading: 'How to Fix Apple Calendar If Yours Still Shows Gray Dots on iOS 18',
        body: [
          'Many iPhone owners update to iOS 18 and assume Apple Calendar still only shows dots because Compact mode remains active if the Split List drawer is toggled on. Tap the List icon at the top right to turn off the bottom list pane, then spread two fingers vertically on the monthly grid to switch from Compact (dots) to Stacked (bars) or Details (event text).',
          'If you prefer crisp colored chips out of the box without pinch-zoom modes—plus weather when you tap into the week—switch to Cloud Calendars.',
        ],
      },
      {
        heading: 'Never Declare a Day Free From Month View Alone',
        body: [
          'A Month cell can only show the first few appointments before summarizing the rest as `+2` or `+4`, and any calendar unchecked in your filter drawer is hidden completely.',
          'Treat Month view as a radar screen for spotting busy weeks, travel blocks, and open weekends—then tap the specific date to inspect Day or Multi-calendar columns before committing to a time.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Put the most important word first in event titles (`"Dentist"`, `"LAX->JFK"`, `"Sam Soccer"`) so the first 7–10 characters read clearly inside narrow Month columns.',
      'Assign high-contrast colors to Work, Personal, Family, and Travel calendars so your eyes decode Month chips even before reading text.',
      'Tap any date cell showing a `+N` overflow badge in Cloud Calendars to inspect every hidden afternoon event before scheduling.',
      'Rotate your iPhone to landscape or open Cloud Calendars on iPad when reviewing dense 30-day schedules.',
    ],
    faq: [
      {
        q: 'Does Cloud Calendars show actual event names in Month view on iPhone instead of dots?',
        a: 'Yes. Cloud Calendars displays colored single-line event title chips inside Month view date cells, with a `+N` count when more events exist on that day.',
      },
      {
        q: 'Can Apple Calendar show event titles in Month view now?',
        a: 'Yes, starting in iOS 18. Turn off the split List toggle in Month view and pinch outward with two fingers to switch from Compact dots to Details text.',
      },
      {
        q: 'Can I drag an event from one date to another in Cloud Calendars?',
        a: 'Yes. Editable events can be dragged to another time or day, and repeating events prompt you to choose which occurrences to update.',
      },
    ],
    sourcesHeading: 'Official iOS Month view and layout references',
    sources: [
      { label: 'Apple Support: Change how you view events in Calendar on iPhone (iOS 18 Month zoom)', url: 'https://support.apple.com/guide/iphone/change-how-you-view-events-iphfd1054569/ios' },
      { label: 'Google Calendar Help: Change your calendar view on iPhone & iPad', url: 'https://support.google.com/calendar/answer/6110847' },
      { label: 'Cloud Calendars on the App Store', url: 'https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319' },
    ],
    relatedComparisons: [
      { slug: 'cloud-calendars-vs-apple-calendar', label: 'Cloud Calendars vs Apple Calendar' },
      { slug: 'cloud-calendars-vs-acalendar-and-digical-switchers', label: 'aCalendar & DigiCal Alternatives on iPhone' },
      { slug: 'best-ipad-and-mac-calendar-app-comparison', label: 'iPad & Mac Calendar Apps Compared' },
    ],
    seeAlso: [
      'month-view-on-a-bigger-screen',
      'a-week-view-that-fits-a-week',
      'the-year-in-one-screen',
      'drag-an-event-to-move-it',
    ],
  },

  'calendar-apps-with-built-in-weather-forecast-iphone': {
    updated: '2026-11-04',
    seoTitle: 'iPhone Calendar Apps with Built-In Weather Compared',
    title: 'iPhone Calendar Apps with Built-In Weather Compared',
    short: 'iPhone Calendars with Built-In Weather',
    description:
      'Compare iPhone calendar apps with integrated weather forecasts—Cloud Calendars (Apple WeatherKit), Fantastical (AccuWeather), Timepage, BusyCal, and Calendar 366—by hourly detail and cost.',
    lede: 'Most iPhone calendar apps either omit weather completely (Apple Calendar and Google Calendar on iOS) or show only a tiny daily sun icon locked behind a $40–$57/year subscription. Cloud Calendars embeds a full Apple WeatherKit station directly into its $0 Free plan—placing hourly temperatures and icons beside every timeline hour in Day view, daily highs and lows atop Week columns, a 10-day searchable city Weather Hub (feels-like, precipitation, wind & gusts, UV index, humidity, and pressure), and one-tap event drafting straight from any forecast hour. Arte Soft develops Cloud Calendars and publishes this comparison.',
    comparison: {
      heading: 'iPhone Weather-Enabled Calendar Apps Matrix',
      caption: 'Comparing weather data source, hourly granularity, metrics, and price across iOS calendar apps',
      columns: ['Weather Capability', 'Cloud Calendars', 'Fantastical', 'Moleskine Timepage', 'BusyCal iOS'],
      rows: [
        {
          cells: [
            'Underlying weather provider',
            'Apple WeatherKit',
            'AccuWeather',
            'Apple WeatherKit',
            'Built-in weather service (OpenWeather / WeatherKit)',
          ],
        },
        {
          cells: [
            'Hourly forecast beside timeline hours',
            'Yes — temperature & sky icon beside hours in Day grid',
            'Detailed hourly popup on tap (Premium)',
            'Hourly temperature, wind & rain curve inside day detail',
            'Daily icons in headers; hourly detail in weather popover',
          ],
        },
        {
          cells: [
            'Dedicated multi-metric Weather Hub',
            'Feels-like, precipitation, UV index, wind & gusts, humidity & pressure',
            'MinuteCast / hourly summary popover per date or event location',
            'Editorial daily/hourly narrative weather card',
            'Compact daily high/low, wind & precipitation summary',
          ],
        },
        {
          cells: [
            'Daily forecast horizon',
            'Up to 10 returned Apple WeatherKit days',
            'Up to 10–15 days (AccuWeather tier)',
            'Up to ~7–10 days',
            'Up to 10 days + moon phases',
          ],
        },
        {
          cells: [
            'Tap a forecast hour to start an event draft',
            'Yes — tap an available forecast hour, then review time & calendar',
            'Standard timeline tap (weather inspected separately)',
            'No direct tap-forecast-to-draft workflow',
            'Standard timeline tap',
          ],
        },
        {
          cells: [
            'Search another city’s weather inside app',
            'Yes — global city search inside the Weather Hub',
            'Per-event location weather lookup (Premium)',
            'Location-based forecast setting',
            'Configurable weather location in settings',
          ],
        },
        {
          cells: [
            'Price to unlock weather on iPhone',
            '$0 Free (or $4.99/yr ad-free Advanced)',
            '~$56.99/yr Flexibits Premium (3-day teaser in free)',
            '$14.99/yr Timepage Membership (no free tier)',
            '$14.99 one-time iOS purchase',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'Why Apple Calendar and Google Calendar Still Lack Weather on iPhone',
        body: [
          'People often remember seeing tiny weather icons inside Google Calendar many years ago (a retired desktop "Labs" widget) or inside desktop Outlook on Windows, then wonder where the toggle went on iPhone. Neither Apple Calendar on iOS 18 nor the official Google Calendar iPhone app includes hourly or 10-day weather forecasts inside the calendar grid—forcing outdoor workers, runners, parents, and event planners to flip constantly between two apps.',
          'Bringing Apple WeatherKit directly into the Day and Week grid turns weather from an afterthought into an active scheduling constraint: you spot the 16:00 rain band and 28 km/h gusts before sending the tennis or site-walk invite, not an hour before kickoff.',
        ],
        table: {
          heading: 'Account Sync, Widgets & Platform Support Across Weather Calendars',
          caption: 'Comparing multi-account sync and Home Screen weather widgets alongside forecast features',
          columns: ['Dimension', 'Cloud Calendars', 'Fantastical', 'Timepage', 'BusyCal iOS'],
          rows: [
            {
              cells: [
                'Google, iCloud & Microsoft 365 sync',
                'iCloud + Google (Free); Microsoft + Teams (Premium $49.99/yr)',
                'All 3 (full multi-set sync in Premium ~$57/yr)',
                'Reads iOS Calendar Accounts ($14.99/yr)',
                'iCloud, Google, Exchange & CalDAV ($14.99 one-time)',
              ],
            },
            {
              cells: [
                'Date + Weather Home Screen widgets',
                'Small & Medium Calendar & Weather widgets ($0 Free)',
                'Date/Agenda + Weather widgets (Premium)',
                'Minimalist weather & agenda widgets',
                'Agenda & Month widgets with optional weather icons',
              ],
            },
            {
              cells: [
                'Per-event address weather vs selected place',
                'Forecasts reflect your current or selected city in Weather Hub',
                'Premium resolves weather for individual event location addresses',
                'Selected / current location forecast',
                'Configured primary weather location',
              ],
            },
            {
              cells: [
                'Wind gusts & UV index visibility',
                'Explicit wind/gusts & UV index cards inside Weather Hub',
                'Summary conditions & precipitation chance',
                'Wind speed, humidity & rain probability',
                'Temperature, condition icon & rain chance',
              ],
            },
            {
              cells: [
                'Supported Platforms',
                'iPhone & iPad (iOS / iPadOS 18.0+)',
                'iPhone, iPad, Mac, Watch, Vision Pro & Windows',
                'iPhone, iPad & Apple Watch',
                'iPhone, iPad & Watch (Mac sold separately)',
              ],
            },
            {
              cells: [
                'ICS calendar feed vs real live WeatherKit API',
                'Live Apple WeatherKit API (updates dynamically)',
                'Live AccuWeather API',
                'Live Apple WeatherKit API',
                'Live weather API',
              ],
            },
          ],
        },
      },
      {
        heading: 'Why Live WeatherKit Beats Free "Weather ICS URL" Subscriptions',
        body: [
          'A common workaround for Apple Calendar and Google Calendar is subscribing to a free third-party `webcal://` weather `.ics` URL. Those feeds clutter every single day with fake all-day events like `"☀️ 72°/54°"`, lag 12 to 24 hours behind fast-moving storms because of ICS polling delays, offer zero hourly wind or rain timing, and pollute search results and widgets.',
          'Native API integration like Cloud Calendars’ Apple WeatherKit connection keeps meteorological data cleanly separated from actual calendar events while updating dynamically.',
        ],
        table: {
          heading: 'Pricing & Best Choice by Weather-Sensitive Workflow',
          caption: 'Best iPhone weather-calendar app by profession, sport, and budget',
          columns: ['Weather-Sensitive Scenario', 'Cloud Calendars', 'Alternative App', 'Best Choice'],
          rows: [
            {
              cells: [
                'Runners, cyclists, dog walkers & parents checking hourly rain + wind gusts for $0',
                'Apple WeatherKit hourly temp, wind/gusts, UV & rain in Free ($0)',
                'Fantastical (~$57/yr) or switching between 2 apps',
                'Cloud Calendars',
              ],
            },
            {
              cells: [
                'Photographers, contractors & coaches tapping a dry forecast hour to book a slot',
                'Tap forecast hour -> start event draft -> review & save ($0 / $4.99 yr)',
                'Manual cross-checking in other apps',
                'Cloud Calendars',
              ],
            },
            {
              cells: [
                'Executive flying to 3 cities in 1 day wanting automatic per-event-address weather',
                'Manual city search in Weather Hub',
                'Fantastical Premium (~$57/yr) resolves per-event street locations',
                'Fantastical Premium',
              ],
            },
            {
              cells: [
                'Moon phases + one-time upfront payment with zero subscriptions',
                'Free w/ ads or $4.99/yr ad-free',
                'BusyCal iOS ($14.99 one-time)',
                'BusyCal iOS',
              ],
            },
            {
              cells: [
                'Poetic Moleskine notebook aesthetic with rain notifications',
                'Classic structured Day/Week/Month/Year grids',
                'Moleskine Timepage ($14.99/yr)',
                'Moleskine Timepage',
              ],
            },
            {
              cells: [
                'Checking historical weather 6 months ago or forecasts 30 days out',
                'Up to 10 returned future WeatherKit days (physics limit of synoptic forecasts)',
                'No reliable hourly forecast exists 30 days ahead; check climate normals',
                '10-day WeatherKit + backup rain plan',
              ],
            },
          ],
        },
      },
      {
        heading: 'Understanding the 10-Day Forecast Horizon and Selected Place',
        body: [
          'Atmospheric physics limits actionable daily weather models to roughly 7 to 10 days; beyond day 10, skill drops toward historical seasonal averages. Cloud Calendars displays up to ten returned days from Apple WeatherKit so every number shown in your Week and Weather Hub views reflects real model guidance rather than speculative 45-day filler.',
          'Always verify the city name shown in the Weather Hub when scheduling an event in another town—your grid displays weather for your current or selected place.',
        ],
      },
      {
        heading: 'Turning a Clear Sky Window Into an Event Draft in One Tap',
        body: [
          'Inside Cloud Calendars’ Weather Hub, spotting a calm, sunny two-hour window between morning showers and evening wind gusts doesn’t require memorizing the clock and switching tabs.',
          'Tap an available forecast hour directly to start an event draft pre-aligned to that hour, then verify the date, duration, and target calendar before saving.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Grant Location permission (or search your city manually in the Weather Hub) so Cloud Calendars fetches accurate Apple WeatherKit forecasts.',
      'Open Day view to see hourly temperatures and weather icons right beside your appointments, or Week view for daily highs and lows.',
      'Open the Weather Hub before outdoor workouts, shoots, or kids’ games to check wind gusts, UV index, and precipitation timing—not just the daily icon.',
      'Tap an available dry forecast hour in the Weather Hub to start an event draft immediately, then confirm the target calendar.',
      'Remove old read-only weather `.ics` subscriptions from iOS Settings once you switch to native WeatherKit views.',
    ],
    faq: [
      {
        q: 'Where does Cloud Calendars get its weather forecast data?',
        a: 'The iPhone and iPad app uses Apple WeatherKit for your current or selected place, displaying hourly conditions and up to ten returned daily forecast days. (Note: the interactive demo on cloud-calendars.com uses Open-Meteo.)',
      },
      {
        q: 'Do I have to pay a subscription to see weather inside Cloud Calendars?',
        a: 'No. Both in-grid hourly/daily forecasts and the full Weather Hub—plus small and medium Calendar & Weather Home Screen widgets—are included in the $0 Free plan.',
      },
      {
        q: 'Why don’t dates three weeks from next Tuesday show weather icons yet?',
        a: 'Apple WeatherKit returns up to ten days of daily forecast data. Dates beyond the available forecast window acquire weather icons automatically as they move within the 10-day horizon.',
      },
    ],
    sourcesHeading: 'Official Apple WeatherKit and calendar weather references',
    sources: [
      { label: 'Apple Developer: Apple WeatherKit overview and data attribution', url: 'https://developer.apple.com/weatherkit/' },
      { label: 'Flexibits: Fantastical Weather features', url: 'https://flexibits.com/fantastical' },
      { label: 'Moleskine Studio: Timepage Weather documentation', url: 'https://moleskinestudio.com/support/timepage/' },
      { label: 'Cloud Calendars on the App Store', url: 'https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319' },
    ],
    relatedComparisons: [
      { slug: 'cloud-calendars-vs-fantastical', label: 'Cloud Calendars vs Fantastical' },
      { slug: 'cloud-calendars-vs-timepage-moleskine', label: 'Cloud Calendars vs Moleskine Timepage' },
      { slug: 'best-iphone-calendar-widgets-home-and-lock-screen', label: 'Best iPhone Calendar Widgets: Home & Lock Screen' },
    ],
    seeAlso: [
      'weather-inside-your-calendar',
      'forecast-beside-every-event',
      'a-fourteen-day-view-of-the-weather',
      'wind-the-forecast-nobody-reads',
    ],
  },

  'natural-language-event-entry-calendar-apps-compared': {
    updated: '2026-11-04',
    seoTitle: 'Natural-Language Event Entry Calendar Apps on iOS',
    title: 'Natural-Language Event Entry Calendar Apps on iOS',
    short: 'Natural-Language Entry vs Visual Drafting',
    description:
      'Compare sentence-parsing calendar entry (Fantastical, BusyCal, Calendars by Readdle, Siri) against visual timeline drag, resize, and forecast-hour drafting in Cloud Calendars.',
    lede: 'Natural-language event entry lets you type `"Lunch with Maya Friday 12:30–1:30 at Blue Bottle /Personal alert 15m"` into one text bar and watch the app populate date, time, location, calendar, and alarm automatically. Fantastical, BusyCal, and Calendars by Readdle lead iOS in live text parsing, while Apple Siri handles voice capture across any EventKit calendar for free. Cloud Calendars does not parse natural-language sentences—instead, it optimizes visual timeline creation: tapping an open slot or an Apple WeatherKit forecast hour, dragging and resizing blocks directly on the grid, and confirming explicit fields so silent parser misreads never drop a meeting onto the wrong Tuesday. Arte Soft develops Cloud Calendars and publishes this comparison.',
    comparison: {
      heading: 'Event Creation Speed & Accuracy Matrix on iPhone',
      caption: 'Comparing natural-language sentence parsers, Siri voice capture, and visual grid drafting on iOS',
      columns: ['Event Entry Capability', 'Cloud Calendars', 'Fantastical', 'Calendars by Readdle / BusyCal', 'Apple Siri + Apple Calendar'],
      rows: [
        {
          cells: [
            'Live natural-language sentence parser',
            'No — uses explicit structured fields + visual timeline drafting',
            'Industry-leading parser (dates, recurrence, zones, `/calendar`, invitees, alerts)',
            'Strong parser in Readdle & BusyCal (`Lunch tomorrow at 1pm`)',
            'Voice/Type-to-Siri natural language; basic title suggestions in Apple Calendar',
          ],
        },
        {
          cells: [
            'Visual tap-on-grid & drag-to-resize creation',
            'Tap timeline slot, drag across hours/days & resize duration directly',
            'Supported in Day/Week timelines',
            'Supported in Day/Week timelines',
            'Long-press on Day timeline in Apple Calendar',
          ],
        },
        {
          cells: [
            'Tap a weather forecast hour to start draft',
            'Yes — tap an available WeatherKit hour to pre-fill draft start time',
            'No direct forecast-hour-to-draft gesture',
            'No direct forecast-hour-to-draft gesture',
            'Not available',
          ],
        },
        {
          cells: [
            'Slash `/calendar` routing while typing',
            'Explicit visual calendar chip picker on draft sheet',
            'Type `/Work` or `/Family` inline to route calendar',
            'Supported in BusyCal & Readdle quick entry',
            'Say `"Add to my Family calendar..."` via Siri',
          ],
        },
        {
          cells: [
            'Works with Siri voice events automatically?',
            'Yes — Siri writes to iCloud/EventKit, appearing immediately in Cloud Calendars',
            'Yes — plus dedicated Fantastical Siri Shortcuts',
            'Yes — via shared iOS EventKit store',
            'Native first-party Siri integration',
          ],
        },
        {
          cells: [
            'Risk of silent parser misinterpretation',
            'Minimal — you inspect explicit date, time & calendar before saving',
            'Low (live visual animation previews parsed tokens)',
            'Occasional ambiguity on `"next Friday"` vs `"this Friday"` or numbers in titles',
            'Medium if spoken quickly without reading confirmation card',
          ],
        },
        {
          cells: [
            'Multi-language parser coverage',
            'Structured UI works identically in 30+ app languages',
            'English, French, German, Italian, Japanese & Spanish',
            'Primarily English & major European languages',
            'Supports dozens of Apple Siri system languages',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'When Sentence Parsing Saves Time—and When Visual Grids Win',
        body: [
          'Sentence parsing shines when you already know the exact time in your head (`"Dentist Nov 18 at 14:00"`) and your calendar isn’t crowded: typing 22 characters is faster than scrolling four months ahead and spinning date wheels.',
          'Visual grid drafting wins whenever you do NOT know the time yet because you first have to see your existing Tuesday commitments, your partner’s column, and whether it will be pouring rain at 16:00. In Cloud Calendars, you look at the week, see the open dry gap at 14:00 between two meetings, and tap right into that space.',
        ],
        table: {
          heading: 'Account Sync, Conferencing & Platform Support During Event Creation',
          caption: 'What metadata you can attach while creating an event across iOS calendar apps',
          columns: ['Creation Metadata', 'Cloud Calendars', 'Fantastical', 'BusyCal iOS'],
          rows: [
            {
              cells: [
                'Google Meet link attachment',
                'Included on Google events in Free ($0)',
                'Included (full multi-account in Premium)',
                'Supported via Google Calendar sync',
              ],
            },
            {
              cells: [
                'Microsoft Teams link attachment',
                'Included via Sign in with Microsoft in Premium ($49.99/yr)',
                'Included in Flexibits Premium (~$57/yr)',
                'Supported on Exchange/M365 accounts',
              ],
            },
            {
              cells: [
                'Recurring rules (weekly, monthly, custom)',
                'Structured repeat picker + edit single/future occurrences prompt',
                'Type `"every 2nd Tuesday"` or use repeat picker',
                'Natural language or deep custom recurrence editor',
              ],
            },
            {
              cells: [
                'Event alerts & second alerts',
                'Configurable event reminder alerts',
                'Parsed (`alert 30m`) or default per-calendar alerts',
                'Multiple custom alarms & travel-time alerts',
              ],
            },
            {
              cells: [
                'Supported Platforms',
                'iPhone & iPad (iOS / iPadOS 18.0+)',
                'iPhone, iPad, Mac, Watch, Vision Pro & Windows',
                'iPhone, iPad & Watch ($14.99); Mac separate',
              ],
            },
            {
              cells: [
                'Free Siri Hands-Free Trick',
                'Hold Side Button -> dictate to Siri -> view/drag in Cloud Calendars',
                'Native Siri + Shortcuts support',
                'Native Siri + Shortcuts support',
              ],
            },
          ],
        },
      },
      {
        heading: 'Pricing and the Free Siri + Cloud Calendars Combo Most People Miss',
        body: [
          'Many iPhone users assume they have to pay $20 to $57/year for a third-party app just to dictate `"Schedule haircut Thursday at 4pm"` while walking to the car. Because iOS Type-to-Siri (double-tap the bottom bar on iOS 18+ with Apple Intelligence, or hold the Side button for voice Siri) writes directly to your default iOS calendar, any appointment you speak or type to Siri appears inside Cloud Calendars a second later—for $0.',
          'If you specifically love keyboard slash-syntax (`"Call Alex tomorrow 9am /Work"`), BusyCal ($14.99 one-time), Calendars by Readdle (~$19.99/yr), and Fantastical (~$57/yr) are the dedicated parser apps.',
        ],
        table: {
          heading: 'Pricing & Best Choice by Event-Entry Style',
          caption: 'Best iOS calendar choice depending on how you capture and schedule events',
          columns: ['Capture Style', 'Cloud Calendars', 'Parser App Alternative', 'Best Choice'],
          rows: [
            {
              cells: [
                'Visual thinker who scans gaps, columns & weather before picking an hour',
                'Multi-column + WeatherKit tap-hour draft ($0 Free / $4.99 yr ad-free)',
                'Parser bar hides grid context until typed',
                'Cloud Calendars',
              ],
            },
            {
              cells: [
                'Hands-free voice or Type-to-Siri capture + rich visual week grid for $0',
                'Pair built-in iOS Siri ($0) + Cloud Calendars ($0 Free)',
                'Fantastical (~$57/yr)',
                'Siri + Cloud Calendars',
              ],
            },
            {
              cells: [
                'Keyboard power user typing `"every 3rd Thu 2pm EST /Work"` on Mac + iPhone',
                'No natural-language parser; iOS/iPadOS only',
                'Fantastical (~$57/yr across Mac, iOS & Windows)',
                'Fantastical',
              ],
            },
            {
              cells: [
                'Natural-language typing on iPhone with a strict one-time payment',
                'Structured editor only',
                'BusyCal iOS ($14.99 one-time)',
                'BusyCal iOS',
              ],
            },
            {
              cells: [
                'Scheduling in Bulgarian, Polish, Turkish, Arabic, or Nordic languages',
                'Explicit localized UI works cleanly in 30+ languages without parser quirks',
                'NLP parsers only understand ~6 major languages reliably',
                'Cloud Calendars',
              ],
            },
            {
              cells: [
                'Dragging & resizing existing meetings when a day runs 30 min late',
                'Direct drag-to-move & resize included in Free ($0)',
                'Supported across major apps',
                'Cloud Calendars',
              ],
            },
          ],
        },
      },
      {
        heading: 'Three Classic Traps Where Natural-Language Parsers Guess Wrong',
        body: [
          'Even the smartest NLP parser runs into genuine English ambiguity: (1) typing `"next Friday"` on a Wednesday means 2 days away to half the population and 9 days away to the other half; (2) titles containing numbers like `"Flight 745"` or `"Room 302"` can hijack the start time to `07:45` or `03:02`; and (3) forgetting `/Work` silently routes a client call onto your shared family calendar.',
          'Whenever you use Siri or a sentence parser, read the parsed date, AM/PM, and calendar color before tapping Add.',
        ],
      },
      {
        heading: 'Drag, Resize, and Recurrence Review in Cloud Calendars',
        body: [
          'Real-world weeks involve at least as much rescheduling as creating from scratch. In Cloud Calendars, you can drag editable events to a new hour or day and stretch or shorten their bottom edge directly in the timeline.',
          'When you move a repeating appointment, Cloud Calendars asks which occurrences to update so you never accidentally shift an entire year of weekly standups when only this Thursday moved.',
        ],
      },
    ],
    claims: {},
    practical: [
      'For fast hands-free capture on iPhone, invoke Siri (or Type to Siri on iOS 18+) to drop the event into your default iCloud calendar, then refine or drag it inside Cloud Calendars.',
      'When finding an open slot visually, open Week or Multi-calendar Day view in Cloud Calendars and tap directly on the target hour.',
      'For outdoor plans, open the Weather Hub and tap an available forecast hour to pre-populate an event draft.',
      'Always double-check three fields before saving any draft: AM vs PM, date, and target calendar color.',
    ],
    faq: [
      {
        q: 'Does Cloud Calendars parse natural-language sentences like "Coffee tomorrow at 3pm"?',
        a: 'No. Cloud Calendars uses structured event fields, direct timeline slot tapping, drag-and-resize editing, and tap-an-hour drafting from the Apple WeatherKit forecast hub rather than sentence parsing.',
      },
      {
        q: 'Can I still create events by voice using Siri if I use Cloud Calendars?',
        a: 'Yes. Siri writes events directly into your iPhone’s iCloud or system calendar store, and Cloud Calendars displays them immediately via EventKit.',
      },
      {
        q: 'Which iOS calendar apps have built-in natural-language text parsing?',
        a: 'Fantastical, BusyCal, Calendars by Readdle, and Calendar 366 all include live natural-language text parsers on iPhone and iPad.',
      },
    ],
    sourcesHeading: 'Official Siri and calendar quick-entry documentation',
    sources: [
      { label: 'Apple Support: Use Siri on iPhone to schedule events', url: 'https://support.apple.com/guide/iphone/create-and-edit-events-in-calendar-iph3d110f84/ios' },
      { label: 'Flexibits: Fantastical natural-language parsing guide', url: 'https://flexibits.com/fantastical' },
      { label: 'BusyMac: BusyCal natural-language entry syntax', url: 'https://www.busymac.com/busycal/' },
      { label: 'Cloud Calendars on the App Store', url: 'https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319' },
    ],
    relatedComparisons: [
      { slug: 'cloud-calendars-vs-fantastical', label: 'Cloud Calendars vs Fantastical' },
      { slug: 'cloud-calendars-vs-calendars-by-readdle', label: 'Cloud Calendars vs Calendars by Readdle' },
      { slug: 'cloud-calendars-vs-busycal-ios-mac', label: 'Cloud Calendars vs BusyCal' },
    ],
    seeAlso: [
      'natural-language-calendar-events-iphone',
      'drag-an-event-to-move-it',
      'event-saved-to-wrong-calendar',
      'forecast-beside-every-event',
    ],
  },
};
