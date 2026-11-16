import type { LocalisedArticle } from '../types';

export const COMPARISONS_BATCH_8: Readonly<Record<string, LocalisedArticle>> = {
  'icloud-calendar-on-windows-pc-and-web-browser': {
    updated: '2026-11-15',
    seoTitle: 'iCloud, Google & Outlook Calendar on Windows PC & Web',
    title: 'How to Use iCloud, Google & Outlook Calendars Together on a Windows PC & iPhone',
    short: 'iCloud + Google + Outlook on Windows & Web',
    description:
      'Compare iCloud.com, iCloud for Windows, New Outlook, and Cloud Calendars Web Studio (with instant iPhone QR sign-in) for viewing and scheduling across Windows and iOS.',
    lede: 'Millions of people carry an iPhone in their pocket while working all day on a Windows 11 laptop or corporate PC. Apple’s iCloud.com browser tab cannot display Google Calendar or Microsoft 365 events, Classic Outlook’s iCloud COM add-in frequently breaks sync, and New Outlook for Windows routes credentials through Microsoft’s cloud. Cloud Calendars bridges iPhone and Windows cleanly: scan a single QR code on https://www.cloud-calendars.com/calendar/ with the Cloud Calendars iOS app to sign in without typing passwords on your PC, sync your Personal Cloud Calendar two-way, connect Google and Microsoft OAuth, and publish ad-free booking links for $0.',
    comparison: {
      heading: 'Windows PC + iPhone Multi-Calendar Options Compared',
      caption: 'Account coverage, login security on shared/work PCs, booking links, and cost',
      columns: [
        'Setup Option',
        'Accounts in One Grid',
        'Windows Login Method',
        'Public Booking & RSVP Links',
        'Price',
      ],
      rows: [
        {
          cells: [
            'Cloud Calendars (Web Studio + iOS App)',
            'Personal Cloud Calendar (2-way iPhone sync) + Google OAuth + Microsoft 365 OAuth + ICS feeds',
            'Scan QR code with iPhone Camera or enter 6-digit iOS Authenticator code (zero Apple ID password typed on PC)',
            'Built-in ad-free /book/ scheduling & /event/ QR RSVPs',
            '$0 Free Forever when paired with iOS app ($1.99/mo web-only)',
          ],
        },
        {
          cells: [
            'iCloud.com in Browser',
            'iCloud calendars only (cannot overlay Google or Microsoft 365)',
            'Full Apple Account password + 2FA SMS/device prompt + browser trust',
            'None',
            '$0',
          ],
        },
        {
          cells: [
            'iCloud for Windows + Classic Outlook',
            'iCloud + Exchange/Outlook + subscribed ICS',
            'Microsoft Store desktop installer + local Outlook MAPI profile',
            'Requires separate Microsoft Bookings license',
            '$0 app + paid M365 desktop license',
          ],
        },
        {
          cells: [
            'New Outlook for Windows',
            'Outlook.com / M365 + Gmail + iCloud (via app-specific password)',
            'Requires generating an Apple ID app-specific password stored in Microsoft Cloud',
            'Basic Bookings with Me (M365 Business)',
            '$0 consumer (shows inbox ads) or M365 paid',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'Why Typing Your Apple ID Into a Work Windows PC Is Painful (and Often Blocked)',
        body: [
          'Corporate Windows laptops commonly block Microsoft Store downloads like iCloud for Windows, clear browser cookies every week, or prohibit storing personal Apple ID credentials on company hardware. Even on a personal PC, logging into iCloud.com only shows your Apple calendars—leaving your Google Workspace and Microsoft 365 meetings in separate browser tabs.',
          'With Cloud Calendars Web Studio (/calendar/), you never enter your Apple Account password in the browser. Open https://www.cloud-calendars.com/calendar/ on Edge, Chrome, or Firefox, point your iPhone Camera at the live QR challenge, and tap Approve Sign-In in Cloud Calendars on iOS. Your browser unlocks Web Studio for $0 forever, syncs your Personal Cloud Calendar two-way with your iPhone, and lets you overlay Google Calendar and Microsoft Outlook in one clean Day, Week, Month, or Agenda workspace.',
        ],
      },
      {
        heading: 'Offline 6-Digit Authenticator Login When Your Webcam or Camera Is Unavailable',
        body: [
          'After your first QR scan, Cloud Calendars stores an encrypted RFC 6238 TOTP secret inside your iPhone Keychain. Whenever you open Web Studio on another Windows desktop or remote workstation, switch the login card to 6-Digit Authenticator and type the rotating 6-digit code from Cloud Calendars → Sharing → Web Sign-In & Authenticator—even if your phone is in Airplane Mode.',
        ],
      },
      {
        heading: 'When Native iCloud.com or Classic Outlook Still Makes Sense',
        body: [
          'If you store 100% of your personal events inside native Apple EventKit iCloud calendars and want direct CalDAV editing of those specific iCloud-hosted lists on Windows without moving events into a cross-platform Cloud Calendar, generate an app-specific password at account.apple.com for a local CalDAV client such as Thunderbird or eM Client, while keeping Cloud Calendars on your iPhone to view iCloud, Google, Outlook, and hourly Apple WeatherKit forecasts side by side.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Install Cloud Calendars on iPhone so iCloud, Google, and Outlook appear in one 5-view mobile grid with hourly WeatherKit.',
      'On your Windows PC, open https://www.cloud-calendars.com/calendar/ and scan the Sign in with iOS QR code with your iPhone Camera.',
      'Connect Google Calendar and Microsoft Outlook via least-privilege OAuth inside Web Studio to check busy times automatically.',
      'Use your Personal Cloud Calendar for cross-device events that must appear instantly on both your Windows browser and iPhone without Apple ID browser logins.',
    ],
    faq: [
      {
        q: 'Do I need to install software on Windows to use Cloud Calendars Web Studio?',
        a: 'No. Web Studio runs in any modern browser (Edge, Chrome, Brave, Firefox) with zero installer or admin rights required—ideal for locked-down corporate Windows laptops.',
      },
      {
        q: 'Does scanning the QR code share my Apple ID password with the browser?',
        a: 'Never. The QR code only contains a 5-minute single-use challenge ID (/app-auth/?c=...). Your iPhone approves the session directly over TLS.',
      },
      {
        q: 'Is Cloud Calendars Web Studio free if I have an iPhone?',
        a: 'Yes. Pairing with the free Cloud Calendars iOS app unlocks Web Studio, /book/ scheduling links, and /event/ QR RSVP pages for $0 forever.',
      },
    ],
    sourcesHeading: 'Official platform references',
    sources: [
      { label: 'Apple Support — Set up iCloud Calendars on Windows', url: 'https://support.apple.com/guide/icloud-windows/set-up-icloud-calendars-and-contacts-icw7e89f6448/icloud' },
      { label: 'Cloud Calendars Web Studio', url: 'https://www.cloud-calendars.com/calendar/' },
      { label: 'Cloud Calendars on the App Store', url: 'https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319' },
    ],
    relatedComparisons: [
      { slug: 'merge-icloud-google-outlook-exchange-calendars-iphone', label: 'Merge iCloud, Google & Outlook on iPhone' },
      { slug: 'work-exchange-microsoft-365-and-personal-icloud-iphone', label: 'Work Microsoft 365 + Personal iCloud on iPhone' },
      { slug: 'caldav-vs-ics-subscribed-url-vs-oauth-calendar-sync', label: 'CalDAV vs ICS vs OAuth Calendar Sync' },
    ],
    seeAlso: [
      'qr-code-sign-in-and-ios-totp-authenticator-guide',
      'two-way-personal-cloud-calendar-sync-iphone-web',
      'icloud-google-and-outlook-in-one-view',
    ],
  },

  'busycal-vs-fantastical-vs-cloud-calendars': {
    updated: '2026-11-15',
    seoTitle: 'BusyCal vs Fantastical vs Cloud Calendars (2026)',
    title: 'BusyCal vs Fantastical vs Cloud Calendars: Pricing, Weather, Sync & Booking Compared',
    short: 'BusyCal vs Fantastical vs Cloud Calendars',
    description:
      'Side-by-side 2026 comparison of BusyCal, Fantastical (Flexibits Premium), and Cloud Calendars across iPhone, iPad, Mac, Web, weather forecasts, booking links, and total 3-year cost.',
    lede: 'Apple power users comparing BusyCal and Fantastical usually weigh BusyCal’s customizable inspector and perpetual Mac license against Fantastical’s natural-language parser and Openings booking links (~$57/year). Cloud Calendars enters as a third architecture: $0 Free multi-account iCloud + Google sync on iPhone and iPad with built-in hourly Apple WeatherKit forecasts, $4.99/year ad-free Advanced, and a full browser Web Calendar + Booking Studio (/calendar/) unlocked for $0 via QR sign-in.',
    comparison: {
      heading: '3-Way Matrix: BusyCal vs Fantastical vs Cloud Calendars',
      caption: 'Pricing model, 3-year total cost, weather integration, booking pages, and platform reach',
      columns: [
        'Feature / Cost',
        'Cloud Calendars',
        'BusyCal',
        'Fantastical (Flexibits)',
      ],
      rows: [
        {
          cells: [
            'Pricing model & 3-year cost',
            '$0 Free (Google + iCloud + Weather + Web QR unlock) · $4.99/yr ad-free ($14.97 / 3 yrs) · $49.99/yr Microsoft M365',
            '~$49.99 Mac license (includes 18 mos updates) + separate paid iOS app',
            '~$56.99/yr Individual (~$170.97 / 3 yrs) or ~$89.99/yr Family',
          ],
        },
        {
          cells: [
            'Built-in weather forecasts on calendar grid',
            'Included in $0 Free tier (hourly + 14-day Apple WeatherKit)',
            '10-day forecast included in paid app',
            '3-day free; 10-day AccuWeather requires ~$57/yr Premium',
          ],
        },
        {
          cells: [
            'Desktop & cross-platform access',
            'Native iPhone & iPad + full Web Studio (/calendar/) on Mac, Windows & Linux ($0 via iOS QR)',
            'Native macOS + iOS (no Windows or Linux client)',
            'Native macOS, iOS, visionOS, Watch + Windows app',
          ],
        },
        {
          cells: [
            'Public booking links & Event RSVP pages',
            'Included ($0 with iOS QR): ad-free /book/ slots, single-use links & /event/ QR RSVPs',
            'No built-in public booking portal',
            'Fantastical Openings & Proposals require Flexibits Premium',
          ],
        },
        {
          cells: [
            'Side-by-side multi-calendar Day columns',
            'Dedicated Multi-Calendar Column view on iPhone & iPad',
            'Customizable Day/Week grids & filter sets (Smart Filters)',
            'Calendar Sets (manual/location switching on Premium)',
          ],
        },
        {
          cells: [
            'Reminders / Tasks & Apple Watch app',
            'Focused on clean timed events, Lock Screen Live Activity & Home Screen widgets',
            'Deep Apple Reminders / CalDAV VTODO support + Watch app',
            'Apple Reminders, Google Tasks, Todoist + Watch complications',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'Choosing Between Perpetual Mac Depth, Subscription Polish, and $0/Low-Cost Utility',
        body: [
          'BusyCal shines if you live on macOS, rely on Smart Filters, travel time, and CalDAV tasks (VTODO), and prefer paying upfront rather than carrying an annual subscription. Its mobile iOS app is dense and configurable, though sold separately from the Mac license and lacking built-in guest booking pages.',
          'Fantastical leads when sentence-style natural-language entry ("Flight to Zurich Friday 7am–9:30am"), Menu Bar quick-join on Mac, and Apple Watch complications justify ~$57 every year. However, locking multi-account Calendar Sets, full weather forecasts, and Openings scheduling links behind that paywall makes it expensive for everyday iPhone + Google + iCloud users.',
          'Cloud Calendars keeps core multi-calendar visibility free: iCloud + Google sync, 5 views (Day, Multi-Column, Week, Month with readable event chips, 12-month Year, List), hourly Apple WeatherKit forecasts, and instant QR unlock for Web Studio (/calendar/) and ad-free /book/ scheduling links—with a $4.99/year option simply to remove mobile ads.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Pick BusyCal if macOS Smart Filters, tags, and CalDAV tasks with a perpetual-style desktop license are your top priority.',
      'Pick Fantastical if you type dozens of natural-language events per week across Mac, Windows, and Apple Watch and don’t mind ~$57/year.',
      'Pick Cloud Calendars if you want iCloud + Google + hourly WeatherKit on iPhone/iPad plus ad-free Web Booking & QR RSVPs on any browser for $0 (or $4.99/year ad-free).',
    ],
    faq: [
      {
        q: 'Which of the three is cheapest over three years if I use Google Calendar and iCloud on iPhone?',
        a: 'Cloud Calendars is $0 on the Free tier (including Google sync, iCloud sync, WeatherKit, and Web Studio via QR) or $14.97 total for three years of ad-free Advanced—compared with ~$60+ for BusyCal Mac+iOS or ~$171 for three years of Fantastical.',
      },
      {
        q: 'Does BusyCal include public scheduling links like Fantastical Openings or Cloud Calendars /book/?',
        a: 'No. BusyCal focuses on local and CalDAV/Exchange calendar management rather than hosted guest booking pages. Both Cloud Calendars (/book/ and /event/) and Fantastical (Openings) provide web scheduling links.',
      },
    ],
    sourcesHeading: 'Official pricing & feature references',
    sources: [
      { label: 'BusyMac — BusyCal Features & Pricing', url: 'https://www.busymac.com/busycal/' },
      { label: 'Flexibits — Fantastical Pricing', url: 'https://flexibits.com/pricing' },
      { label: 'Cloud Calendars on the App Store', url: 'https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319' },
    ],
    relatedComparisons: [
      { slug: 'cloud-calendars-vs-busycal-ios-mac', label: 'Cloud Calendars vs BusyCal' },
      { slug: 'cloud-calendars-vs-fantastical', label: 'Cloud Calendars vs Fantastical' },
      { slug: 'fantastical-alternatives-cheaper-iphone-mac', label: 'Cheaper Fantastical Alternatives' },
    ],
    seeAlso: [
      'fantastical-readdle-calendar366-iphone-comparison',
      'what-fantastical-costs-and-what-this-does',
      'qr-code-sign-in-and-ios-totp-authenticator-guide',
    ],
  },

  'flowsavvy-vs-reclaim-vs-motion-calendar-comparison': {
    updated: '2026-11-15',
    seoTitle: 'FlowSavvy vs Reclaim vs Motion vs Cloud Calendars',
    title: 'FlowSavvy vs Reclaim.ai vs Motion vs Cloud Calendars: Auto-Scheduling vs Calm Control',
    short: 'FlowSavvy vs Reclaim vs Motion',
    description:
      'Compare AI task auto-schedulers (FlowSavvy, Reclaim.ai, Motion) with Cloud Calendars when deciding between algorithmic calendar reshuffling and predictable multi-account views.',
    lede: 'AI time-blocking apps like FlowSavvy, Reclaim.ai, and Motion promise to pack your to-do list automatically into open gaps on your calendar—until one urgent afternoon call triggers a cascade that rearranges your entire week. Here is an honest comparison of how FlowSavvy, Reclaim.ai, and Motion differ on iCloud/Outlook support, pricing, and stability, and why many planners switch to deterministic multi-calendar views in Cloud Calendars.',
    comparison: {
      heading: 'Auto-Schedulers vs Deterministic Multi-Calendar Planning',
      caption: 'Account compatibility, algorithmic reshuffling, booking pages, weather, and monthly cost',
      columns: [
        'Capability',
        'Cloud Calendars',
        'FlowSavvy',
        'Reclaim.ai',
        'Motion',
      ],
      rows: [
        {
          cells: [
            'Core planning philosophy',
            'Deterministic: events stay exactly where you place them across side-by-side columns',
            'Consumer AI auto-time-blocking of tasks around fixed events',
            'Work-focused habit, focus-time & calendar-defending automation',
            'All-in-one AI project manager & aggressive deadline auto-scheduler',
          ],
        },
        {
          cells: [
            'iCloud + Google + Microsoft Outlook support',
            'Native iCloud + Google + Microsoft 365 + Personal Cloud Calendar',
            'Google, Outlook & iCloud sync supported',
            'Google Calendar & Outlook (no direct native iCloud)',
            'Google, Outlook & iCloud (via CalDAV/app password)',
          ],
        },
        {
          cells: [
            'Public booking links (/book/)',
            'Included ($0 with iOS QR): ad-free 1-on-1 booking + /event/ QR RSVPs',
            'No public external booking links',
            'Scheduling Links included (tier limits apply)',
            'Meeting Scheduler included',
          ],
        },
        {
          cells: [
            'Hourly weather beside outdoor blocks',
            'Built-in hourly + 14-day Apple WeatherKit on iPhone & iPad',
            'No weather integration',
            'No weather integration',
            'No weather integration',
          ],
        },
        {
          cells: [
            'Typical individual pricing',
            '$0 Free (or $0.49/mo · $4.99/yr ad-free iOS; $0 Web Studio via QR)',
            '$0 limited free tier · ~$7–$10/mo Pro',
            '$0 Lite (limited) · ~$8–$12+/user/mo',
            '~$19–$34/mo (no permanent free tier)',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'When Algorithmic Auto-Scheduling Helps—and When It Causes "Calendar Whiplash"',
        body: [
          'If you have 35 solo deep-work tasks with flexible deadlines and want software to slice them into 45-minute blocks automatically, FlowSavvy offers the friendliest solo price point (~$7/month with iCloud support), Reclaim.ai excels at defending focus blocks on corporate Google/Outlook calendars, and Motion targets agencies willing to pay ~$19–$34/month for project dependencies.',
          'In practice, many professionals abandon auto-schedulers after a few weeks of "calendar whiplash": every time a real-world meeting runs late or a school pickup shifts, dozens of color-coded task blocks jump to new days, making it hard to remember what is actually committed to another human being versus tentatively penciled in by an algorithm.',
        ],
      },
      {
        heading: 'Deterministic Drag-and-Drop + Clean External Booking in Cloud Calendars',
        body: [
          'Cloud Calendars keeps real commitments trustworthy. View iCloud family calendars, Google Calendar, and Microsoft 365 side by side in Multi-Column Day view on iPhone or iPad, check hourly rain and temperature forecasts before blocking outdoor errands, and use Web Studio (/calendar/) to share ad-free /book/ availability links that check live busy times without rearranging your existing blocks.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Choose FlowSavvy if you specifically want automatic task slicing on a solo budget and also use iCloud.',
      'Choose Reclaim.ai if your company runs on Google Workspace or M365 and you want automatic "Busy" focus-time defense.',
      'Choose Cloud Calendars if you want calm, predictable manual time-blocking across iCloud + Google + Outlook with hourly weather and $0 QR-unlocked Web Booking.',
    ],
    faq: [
      {
        q: 'Does FlowSavvy include booking links like Motion or Cloud Calendars?',
        a: 'FlowSavvy focuses strictly on personal task auto-scheduling rather than external client booking links. Cloud Calendars includes public /book/ scheduling pages and /event/ RSVP pages at $0 when paired with the iOS app.',
      },
      {
        q: 'Why do people switch away from AI auto-scheduling calendars?',
        a: 'When algorithmic task blocks fill every open hour on your calendar, two problems emerge: colleagues see artificial busy walls, and your visual memory of your week breaks whenever the solver recalculates.',
      },
    ],
    sourcesHeading: 'Product documentation & pricing references',
    sources: [
      { label: 'FlowSavvy Features & Pricing', url: 'https://flowsavvy.app/pricing' },
      { label: 'Reclaim.ai Pricing', url: 'https://reclaim.ai/pricing' },
      { label: 'Cloud Calendars Web Studio', url: 'https://www.cloud-calendars.com/calendar/' },
    ],
    relatedComparisons: [
      { slug: 'cloud-calendars-vs-structured-daily-planner', label: 'Cloud Calendars vs Structured' },
      { slug: 'cloud-calendars-vs-todoist-and-ticktick-calendar-views', label: 'Cloud Calendars vs Todoist & TickTick' },
      { slug: 'cloud-calendars-vs-calendly', label: 'Cloud Calendars vs Calendly' },
    ],
    seeAlso: [
      'automatic-time-blocking-versus-manual-calendar',
      'weekly-schedule-builder',
      'planning-a-week-in-ten-minutes',
    ],
  },

  'vimcal-vs-amie-vs-akiflow-calendar-comparison': {
    updated: '2026-11-15',
    seoTitle: 'Vimcal vs Amie vs Akiflow vs Cloud Calendars',
    title: 'Vimcal vs Amie vs Akiflow vs Cloud Calendars: Speed, iCloud Support & Cost Compared',
    short: 'Vimcal vs Amie vs Akiflow',
    description:
      'Compare high-end productivity calendars (Vimcal, Amie, Akiflow) with Cloud Calendars across keyboard speed, iCloud + Microsoft Outlook compatibility, booking links, and annual cost.',
    lede: 'Boutique productivity calendars like Vimcal (~$15/month), Amie, and Akiflow (~$19–$34/month) target founders and executives with keyboard shortcuts, time-zone conversion, and task inboxes—at $180 to $400 per year. Yet many still treat native iCloud or Microsoft Exchange as secondary citizens compared with Gmail. Here is how Vimcal, Amie, Akiflow, and Cloud Calendars stack up across real account support, mobile views, booking pages, and cost.',
    comparison: {
      heading: 'Executive & Power-User Calendar Comparison',
      caption: 'Annual cost, calendar provider coverage, mobile experience, weather, and scheduling links',
      columns: [
        'Dimension',
        'Cloud Calendars',
        'Vimcal',
        'Amie',
        'Akiflow',
      ],
      rows: [
        {
          cells: [
            'Annual cost',
            '$0 Free (with iOS QR Web unlock) · $4.99/yr ad-free iOS · $49.99/yr M365 iOS',
            '~$180/yr ($15/mo billed annually)',
            'Free basic tier · ~$120–$240/yr Pro/AI tiers',
            '~$228–$408/yr ($19–$34/mo)',
          ],
        },
        {
          cells: [
            'Calendar providers supported',
            'iCloud + Google + Microsoft 365/Outlook + Personal Cloud Calendar',
            'Google & Outlook (no native direct iCloud on all clients)',
            'Google & iCloud (Apple ecosystem focus)',
            'Google, Outlook & iCloud (task consolidation focus)',
          ],
        },
        {
          cells: [
            'Shareable booking links & QR Event RSVPs',
            'Ad-free /book/ slots (with single-use links & buffers) + /event/ QR RSVP pages',
            'Fast plain-text availability copy + booking links',
            'Scheduling links included',
            'Booking links & availability sharing',
          ],
        },
        {
          cells: [
            'iPhone & iPad native views + WeatherKit',
            '5 iOS views (incl. Multi-Column & 12-month Year) + hourly Apple WeatherKit + Live Activity',
            'Minimal companion iOS app optimized for quick slot sends',
            'Playful gesture-driven iOS app (tasks + Spotify/notes)',
            'Mobile companion focused on task inbox triage',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'Do You Need a $200+/Year Desktop Wrapper or Clean Cross-Provider Sync?',
        body: [
          'Vimcal earns its following among venture investors and recruiters who live inside desktop keyboard shortcuts and copy-paste multi-time-zone availability twenty times a day. Akiflow is built for operators pulling Slack messages, Notion tickets, and Linear issues into a unified command-bar task inbox, while Amie blends to-dos, AI meeting notes, and design-forward gestures.',
          'If you do not want another $15–$34/month SaaS bill just to see work Outlook/Google meetings next to personal iCloud events and send clean booking links, Cloud Calendars covers the core workflow at a fraction of the price: native iPhone and iPad grids with hourly weather, plus instant QR-paired Web Studio (/calendar/) with ad-free /book/ scheduling links and single-use tokens.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Pick Vimcal if desktop keyboard hotkeys and instant plain-text multi-timezone availability snippets justify ~$180/year.',
      'Pick Akiflow if consolidating Slack, Jira, Asana, and Notion tasks into one command bar is your main bottleneck.',
      'Pick Cloud Calendars when you want iCloud + Google + Outlook clarity on iPhone/iPad, hourly WeatherKit forecasts, and clean Web Booking links for $0–$4.99/year.',
    ],
    faq: [
      {
        q: 'Can Cloud Calendars send one-time booking links so a VIP invitee cannot reuse the URL?',
        a: 'Yes. In Cloud Calendars Web Studio (/calendar/), you can generate single-use or expiring invitation links on any /book/ scheduling page at no extra cost.',
      },
      {
        q: 'Does Vimcal or Cloud Calendars work better on iPad in landscape?',
        a: 'Cloud Calendars provides full native iPadOS landscape Week, Month, Multi-Column, and 12-month Year layouts with WeatherKit forecasts, plus Web Studio in Safari.',
      },
    ],
    sourcesHeading: 'Official product references',
    sources: [
      { label: 'Vimcal Official Site', url: 'https://www.vimcal.com/' },
      { label: 'Akiflow Official Site', url: 'https://akiflow.com/' },
      { label: 'Cloud Calendars Web Studio', url: 'https://www.cloud-calendars.com/calendar/' },
    ],
    relatedComparisons: [
      { slug: 'cloud-calendars-vs-notion-calendar-cron', label: 'Cloud Calendars vs Notion Calendar' },
      { slug: 'cloud-calendars-vs-fantastical', label: 'Cloud Calendars vs Fantastical' },
      { slug: 'cloud-calendars-vs-savvycal', label: 'Cloud Calendars vs SavvyCal' },
    ],
    seeAlso: [
      'create-public-booking-page-buffers-and-one-time-links',
      'time-zones-and-the-flight-you-booked',
      'qr-code-sign-in-and-ios-totp-authenticator-guide',
    ],
  },

  'calendly-vs-cal-com-vs-savvycal-booking-links': {
    updated: '2026-11-15',
    seoTitle: 'Calendly vs Cal.com vs SavvyCal vs Cloud Calendars',
    title: 'Calendly vs Cal.com vs SavvyCal vs Cloud Calendars: Solo & Multi-Calendar Booking Compared',
    short: 'Calendly vs Cal.com vs SavvyCal',
    description:
      'Compare the four most practical booking-link architectures in 2026—Calendly, Cal.com, SavvyCal, and Cloud Calendars—across multi-calendar conflict checks, guest UX, iPhone apps, and price.',
    lede: 'Most solo professionals hit the same wall with scheduling tools: Calendly’s Free plan restricts you to 1 event type and 1 connected calendar (missing conflicts on your second Google or Outlook account unless you pay ~$10–$12/month), SavvyCal has no permanent free plan (~$12+/month), and Cal.com’s richest routing targets developer teams. Here is how Calendly, Cal.com, SavvyCal, and Cloud Calendars compare when you simply want reliable multi-calendar conflict checking, unlimited event types, and a real daily calendar.',
    comparison: {
      heading: '4-Way Scheduling Link & Calendar Comparison',
      caption: 'Free-tier limits, multi-calendar conflict checks, guest UI, mobile calendar, and paid pricing',
      columns: [
        'Feature',
        'Cloud Calendars',
        'Calendly',
        'Cal.com (Cloud)',
        'SavvyCal',
      ],
      rows: [
        {
          cells: [
            'Free tier event types & branding',
            'Multiple /book/ pages + /event/ QR RSVPs ($0 forever when paired with iOS app; zero guest ads)',
            '1 active Event Type only on Free tier + Calendly badge',
            'Generous Individual free tier + Cal.com badge',
            '7-day trial only; ~$12/mo Basic required to send live links',
          ],
        },
        {
          cells: [
            'Conflict check across Google + Outlook simultaneously',
            'Included ($0 via iOS QR or $1.99/mo web-only)',
            'Requires Standard plan (~$10–$12/seat/mo); Free checks 1 calendar connection',
            'Supported on Individual free cloud tier',
            'Supported on paid Basic (~$12/mo)',
          ],
        },
        {
          cells: [
            'Single-use & expiring invite tokens',
            'Built into Web Studio (/calendar/)',
            'Single-use links available',
            'Private / single-use links supported',
            'Single-use & personalized links supported',
          ],
        },
        {
          cells: [
            'Includes a full daily Web + iPhone/iPad Calendar app',
            'Yes — 5-view iOS app (with WeatherKit) + full drag-and-drop Web Calendar',
            'No — scheduling-link layer only',
            'No — scheduling infrastructure only',
            'No — overlay picker only, not a daily calendar app',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'Which Scheduling Tool Fits Which Workflow?',
        body: [
          'Choose Calendly or Cal.com Team when you need Salesforce/HubSpot CRM round-robin routing across a 15-person sales floor or Stripe payment collection at the moment of booking. Choose SavvyCal when letting VIP guests overlay their own calendar onto your availability grid justifies $144/year.',
          'Choose Cloud Calendars when you want your daily calendar and your booking links in one unified place without paying $120–$240/year: check conflicts across Google Calendar, Microsoft Outlook, and your Personal Cloud Calendar simultaneously, share clean /book/ pages (15, 30, 45, or 60 minutes with before/after buffers and daily caps) or fixed-date /event/ QR RSVP pages, and see every confirmed booking immediately on your iPhone.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Use Cloud Calendars (/calendar/) if you want unlimited ad-free /book/ types + Google/Outlook conflict checks + a daily iPhone/Web calendar for $0 (with iOS QR).',
      'Use Cal.com if you want developer webhooks, self-hosted Docker deployment, or custom routing forms.',
      'Use Calendly Standard/Teams if your company already mandates native Salesforce or Marketo lead routing.',
    ],
    faq: [
      {
        q: 'Can Cloud Calendars check both my work Microsoft Outlook and personal Gmail before showing open slots?',
        a: 'Yes. Connect both Google Calendar and Microsoft Outlook in Cloud Calendars Web Studio (/calendar/) so any busy block on either account automatically hides overlapping booking slots.',
      },
      {
        q: 'Do invitees have to create an account to book a slot on Cloud Calendars?',
        a: 'No. Invitees pick a time in their local time zone, enter their name and email (plus optional notes), and receive instant confirmation and .ics calendar details with zero signup or ads.',
      },
    ],
    sourcesHeading: 'Official pricing & documentation',
    sources: [
      { label: 'Calendly Pricing', url: 'https://calendly.com/pricing' },
      { label: 'Cal.com Pricing', url: 'https://cal.com/pricing' },
      { label: 'SavvyCal Pricing', url: 'https://savvycal.com/pricing' },
      { label: 'Cloud Calendars Web Studio', url: 'https://www.cloud-calendars.com/calendar/' },
    ],
    relatedComparisons: [
      { slug: 'cloud-calendars-vs-calendly', label: 'Cloud Calendars vs Calendly' },
      { slug: 'cloud-calendars-vs-cal-com', label: 'Cloud Calendars vs Cal.com' },
      { slug: 'cloud-calendars-vs-savvycal', label: 'Cloud Calendars vs SavvyCal' },
    ],
    seeAlso: [
      'create-public-booking-page-buffers-and-one-time-links',
      'booking-link-or-shared-calendar',
      'host-event-rsvp-page-with-qr-code-and-live-ics-feed',
    ],
  },

  'microsoft-bookings-vs-bookings-with-me-vs-cloud-calendars': {
    updated: '2026-11-15',
    seoTitle: 'Microsoft Bookings vs Bookings with Me vs Cloud Calendars',
    title: 'Microsoft Bookings vs Outlook "Bookings with Me" vs Cloud Calendars: External Scheduling Compared',
    short: 'Microsoft Bookings vs Cloud Calendars',
    description:
      'Understand the difference between shared Microsoft Bookings mailboxes, personal Outlook "Bookings with Me" pages, and Cloud Calendars when you also have personal Google or iCloud calendars.',
    lede: 'Microsoft 365 offers two confusingly named scheduling tools—shared Microsoft Bookings (built for multi-staff service desks and clinics, which creates a brand-new Exchange mailbox in your tenant) and personal "Bookings with Me" inside Outlook on the web. Neither checks your personal Google Calendar or iPhone schedule out of the box, leaving your evenings and personal appointments exposed to double-booking. Here is how both Microsoft tools compare with Cloud Calendars.',
    comparison: {
      heading: 'Microsoft Bookings vs Bookings with Me vs Cloud Calendars',
      caption: 'Exchange mailbox side effects, personal Google/iPhone conflict checks, IT admin blocks, and mobile UX',
      columns: [
        'Dimension',
        'Cloud Calendars (/book/ + iOS)',
        'Microsoft Bookings (Shared)',
        'Outlook "Bookings with Me"',
      ],
      rows: [
        {
          cells: [
            'Checks personal Google Calendar + Personal Cloud Calendar + M365',
            'Yes — combines Microsoft Outlook OAuth, Google OAuth, and 2-way Personal Cloud Calendar',
            'Checks Exchange/M365 staff mailboxes only',
            'Checks your single M365 Exchange mailbox only',
          ],
        },
        {
          cells: [
            'Creates extra Exchange mailboxes or directory clutter?',
            'Zero tenant clutter — runs outside Exchange directory',
            'Yes — creates a new shared Exchange mailbox & Azure AD user per booking page',
            'No — tied to your individual Outlook web profile',
          ],
        },
        {
          cells: [
            'Works on personal Outlook.com / Hotmail accounts?',
            'Yes — works with Microsoft personal, M365 work, Gmail, or standalone email',
            'Requires paid Microsoft 365 Business / Enterprise license',
            'Requires eligible Microsoft 365 Business / Education license (often disabled by IT)',
          ],
        },
        {
          cells: [
            'Single-use invite tokens & QR Event RSVP pages',
            'Both single-use /book/ links and fixed-date /event/ QR RSVP pages included',
            'Multi-staff service catalog & Teams links; no fixed-date QR flyer RSVPs',
            'Public or private link types on M365',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'Why Outlook "Bookings with Me" Double-Books Consultants Who Have Two Lives',
        body: [
          'If you carry a corporate Microsoft 365 account alongside a personal Gmail or iPhone calendar—or if you consult for two separate client tenants—"Bookings with Me" only inspects free/busy blocks inside that one Exchange mailbox. Unless you manually copy every dentist visit, school pickup, and second-client call onto your corporate calendar, external guests will book straight over them.',
          'Cloud Calendars Web Studio (/calendar/) lets you connect Microsoft Outlook and Google Calendar side by side alongside your Personal Cloud Calendar (which syncs two-way with your iPhone). External invitees see one clean /book/ page that respects all of your busy commitments simultaneously without exposing private event titles.',
        ],
      },
      {
        heading: 'When Shared Microsoft Bookings Is Still the Right Choice',
        body: [
          'If an IT helpdesk, university advising office, or clinic needs six staff members pooled behind one departmental calendar with automatic Microsoft Teams meeting creation inside a strict M365 tenant boundary, shared Microsoft Bookings is built for multi-staff dispatch.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Use shared Microsoft Bookings for multi-staff department queues inside a single Microsoft 365 tenant.',
      'Use Outlook "Bookings with Me" if 100% of your life lives inside one M365 work mailbox and your IT admin has enabled external sharing.',
      'Use Cloud Calendars when you need external booking links (/book/) or QR Event RSVPs (/event/) that check both Microsoft Outlook and personal Google/iPhone schedules—or when using a personal Outlook.com address.',
    ],
    faq: [
      {
        q: 'Why is "Bookings with Me" greyed out or missing in my Outlook?',
        a: 'Personal Outlook.com accounts do not include it, and many Microsoft 365 tenant administrators disable EWS/Bookings external sharing via Organization Config or OWA mailbox policies.',
      },
      {
        q: 'Does Cloud Calendars show my private Gmail event titles to Microsoft colleagues?',
        a: 'Never. Public /book/ pages only expose anonymous open time slots after subtracting busy intervals across your connected calendars.',
      },
    ],
    sourcesHeading: 'Official Microsoft & Cloud Calendars documentation',
    sources: [
      { label: 'Microsoft Learn — Microsoft Bookings Overview', url: 'https://learn.microsoft.com/en-us/microsoft-365/bookings/bookings-overview' },
      { label: 'Microsoft Support — Bookings with me in Outlook', url: 'https://support.microsoft.com/en-us/office/bookings-with-me-setup-and-sharing-ad2e28c4-4293-4440-9811-7b39c5d198a3' },
      { label: 'Cloud Calendars Web Studio', url: 'https://www.cloud-calendars.com/calendar/' },
    ],
    relatedComparisons: [
      { slug: 'cloud-calendars-vs-google-appointment-schedules', label: 'Cloud Calendars vs Google Appointment Schedules' },
      { slug: 'cloud-calendars-vs-microsoft-outlook-mobile', label: 'Cloud Calendars vs Outlook Mobile' },
      { slug: 'work-exchange-microsoft-365-and-personal-icloud-iphone', label: 'Work M365 + Personal iCloud on iPhone' },
    ],
    seeAlso: [
      'outlook-show-as-free-busy-tentative-working-elsewhere',
      'create-public-booking-page-buffers-and-one-time-links',
      'exchange-calendars-on-an-iphone',
    ],
  },

  '2-2-3-and-2-2-5-5-co-parenting-custody-calendar-iphone': {
    updated: '2026-11-15',
    seoTitle: '2-2-3 & 2-2-5-5 Co-Parenting Custody Calendar Setup',
    title: 'How to Set Up 2-2-3, 2-2-5-5 & Alternating-Week Co-Parenting Schedules on iPhone & Web',
    short: '2-2-3 & 2-2-5-5 Co-Parenting Calendars',
    description:
      'Exact recurrence math and app comparison for 2-2-3, 2-2-5-5, 3-4-4-3, and week-on/week-off custody schedules across Cloud Calendars, iCloud/Google shared calendars, and court apps.',
    lede: 'A 50/50 co-parenting rotation such as 2-2-3 or 2-2-5-5 sounds complicated until you notice that every common custody pattern is an exact 14-day (2-week) cycle. Instead of entering nights by hand for twelve months—or forcing both parents onto the same phone brand—you can build the entire year in four clean biweekly recurring rules, color-code each parent’s nights alongside work meetings and hourly school-run weather in Cloud Calendars on iPhone, and share live updates across iPhone, Android, and Windows.',
    comparison: {
      heading: '50/50 Custody Schedules & Exact Recurrence Rules',
      caption: 'Every major 50/50 parenting rotation repeats cleanly on a 14-day ("Every 2 weeks") cycle',
      columns: [
        'Schedule Pattern',
        'Parent A Days (14-Day Cycle)',
        'Parent B Days (14-Day Cycle)',
        'Exact Calendar Recurrence Setup',
      ],
      rows: [
        {
          cells: [
            '2-2-5-5 (Fixed weekday anchor — easiest for school routines)',
            'Every Mon–Tue (2 nights) + alternating Fri–Sun (3 nights)',
            'Every Wed–Thu (2 nights) + alternating Fri–Sun (3 nights)',
            '1 weekly rule for Mon–Tue, 1 weekly rule for Wed–Thu, and 2 biweekly ("Every 2 weeks") Fri–Sun weekend blocks',
          ],
        },
        {
          cells: [
            '2-2-3 (Shorter gaps for younger children)',
            'Week 1: Mon–Tue & Fri–Sun · Week 2: Wed–Thu',
            'Week 1: Wed–Thu · Week 2: Mon–Tue & Fri–Sun',
            'Create 4 all-day blocks set to Repeat: Every 2 Weeks (Week 1 Mon–Tue, Week 1 Fri–Sun, Week 2 Wed–Thu, etc.)',
          ],
        },
        {
          cells: [
            '3-4-4-3',
            'Week 1: Sun–Tue (3) · Week 2: Sun–Wed (4)',
            'Week 1: Wed–Sat (4) · Week 2: Thu–Sat (3)',
            '2 biweekly multi-day all-day banners per parent ("Repeat every 2 weeks")',
          ],
        },
        {
          cells: [
            '7/7 Alternating Weeks (Week-on / Week-off)',
            'Week 1: Fri after school → next Fri drop-off',
            'Week 2: Fri after school → next Fri drop-off',
            '1 multi-day banner per parent set to Repeat: Every 2 Weeks + timed Friday handoff alert',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'Shared Google/Cloud Calendar vs Court-Ordered Co-Parenting Suites',
        body: [
          'Dedicated legal co-parenting platforms such as OurFamilyWizard or AppClose (~$0–$150+/year per parent) are designed for high-conflict cases where tamper-evident message logs, expense reimbursement ledgers, and court-admissible exports are mandated by a parenting order. Their downside is daily friction: custody blocks sit trapped in a separate app away from your Microsoft 365 work calendar, personal appointments, and weather forecast.',
          'For cooperative or low-friction scheduling—and even alongside a court app—putting the 14-day rotation on a dedicated shared Google Calendar (works across iPhone + Android) or Personal Cloud Calendar lets you see Parent A nights, Parent B nights, soccer games, and work travel side by side in Cloud Calendars’ Multi-Column Day view and readable Month chips on iPhone.',
        ],
      },
      {
        heading: 'Pro Tip: Separate All-Day Custody Banners From Timed Handoff Alerts',
        body: [
          'Model custody nights as clean multi-day All-Day banners (for example, distinct Emerald for your nights and Amber for co-parent nights) with Show As: Free so they never block work meeting slots, and add separate 15-minute timed events only for Friday 17:00 pickups, school half-days, and holiday swaps where you want Lock Screen alerts and hourly WeatherKit rain checks.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Create a dedicated shared Google Calendar when one parent uses iPhone and the other uses Android or Windows.',
      'Build 2-2-3 or 2-2-5-5 using four "Repeat Every 2 Weeks" all-day banners rather than hundreds of manual single entries.',
      'Mark custody night banners as Free (transparent) so work booking links do not treat entire weeks as unavailable.',
      'Use Cloud Calendars on iPhone to view custody banners, work Outlook/Google meetings, and pickup-hour weather on one screen.',
    ],
    faq: [
      {
        q: 'How do I swap a single weekend in a 2-2-3 calendar without breaking future weeks?',
        a: 'Tap the specific weekend banner, edit or delete "This Event Only" (creating an RFC 5545 RECURRENCE-ID exception), and add the one-off swap—all future biweekly cycles stay untouched.',
      },
      {
        q: 'Which is better if one parent has an iPhone and the other has Samsung/Android?',
        a: 'Use a shared Google Calendar (synced into Cloud Calendars on the iPhone parent’s side) or share a live Cloud Calendars /event/ ICS feed so neither parent hits Apple-only iCloud sharing barriers.',
      },
    ],
    sourcesHeading: 'Technical & sharing references',
    sources: [
      { label: 'IETF RFC 5545 — iCalendar Recurrence Rule (INTERVAL=2)', url: 'https://www.rfc-editor.org/rfc/rfc5545#section-3.3.10' },
      { label: 'Google Calendar Help — Share your calendar with someone', url: 'https://support.google.com/calendar/answer/37082' },
      { label: 'Cloud Calendars on the App Store', url: 'https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319' },
    ],
    relatedComparisons: [
      { slug: 'shared-icloud-calendar-vs-shared-google-calendar-families', label: 'Shared iCloud vs Shared Google Calendar' },
      { slug: 'cloud-calendars-vs-timetree-family-sharing', label: 'Cloud Calendars vs TimeTree' },
      { slug: 'all-day-multi-day-banners-and-week-numbers-calendars-ios', label: 'All-Day Multi-Day Banners on iOS' },
    ],
    seeAlso: [
      'family-pickup-calendar-handoff',
      'recurring-events-without-the-mess',
      'what-an-all-day-event-really-means',
    ],
  },

  '24-48-and-48-96-firefighter-shift-calendar-iphone': {
    updated: '2026-11-15',
    seoTitle: '24/48 & 48/96 Firefighter Shift Calendar on iPhone',
    title: '24/48, 48/96, Kelly & DuPont Shift Calendar Setup on iPhone (Firefighter, EMS & Nursing)',
    short: '24/48 & 48/96 Firefighter Shift Calendars',
    description:
      'Exact cycle lengths (3-day 24/48, 6-day 48/96, 9-day California, 28-day DuPont) and how to overlay A/B/C platoon shifts with family iCloud, Google, and weather on iPhone.',
    lede: 'Firefighters, paramedics, dispatchers, and 12-hour plant or ICU crews rarely work Monday-to-Friday weeks: a 24/48 rotation repeats every 3 days, a 48/96 repeats every 6 days, a 24/48 with a Kelly day shifts on a 9- or 21-day cycle, and a 12-hour DuPont schedule repeats every 28 days. Printable wall PDFs cannot warn your spouse about overtime trades or show hourly storm forecasts before a 07:00 station change. Here is the exact cycle math to put any platoon schedule onto your iPhone and Web calendar.',
    comparison: {
      heading: 'Fire, EMS & 12-Hour Shift Cycles — Exact Repeat Math',
      caption: 'Cycle length in days and how to generate each rotation cleanly in an iCalendar/Google/iOS calendar',
      columns: [
        'Shift Pattern',
        'Total Cycle Length',
        'On / Off Sequence',
        'How to Set Repeat Interval',
      ],
      rows: [
        {
          cells: [
            '24/48 (A / B / C Platoon)',
            '3 days',
            '24 hours ON, 48 hours OFF',
            'Custom Repeat → Frequency: Daily → Every 3 days (1 rule per platoon color)',
          ],
        },
        {
          cells: [
            '48/96 (Two-Tour Platoon)',
            '6 days',
            '48 hours ON (Day 1 + Day 2), 96 hours OFF (Days 3–6)',
            '2 events (Tour Day 1 & Tour Day 2) or 1 two-day banner → Custom Repeat: Daily, Every 6 days',
          ],
        },
        {
          cells: [
            'California / Modified Kelly (on-off-on-off-on-4 off)',
            '9 days',
            '24 on, 24 off, 24 on, 24 off, 24 on, 96 (4 days) off',
            'Create the three 24h shift days in Cycle Week 1 (Days 1, 3, 5) → each set to Repeat Daily, Every 9 days',
          ],
        },
        {
          cells: [
            '12-Hour DuPont Schedule',
            '28 days (4 weeks)',
            '4 nights → 3 off → 3 days → 1 off → 3 nights → 3 off → 4 days → 7 consecutive days off',
            'Build one 28-day template once → set each block to Custom Repeat: Weekly, Every 4 weeks',
          ],
        },
        {
          cells: [
            'Pitman (2-2-3 / Panama 12-Hour)',
            '14 days (2 weeks)',
            '2 on, 2 off, 3 on · 2 off, 2 on, 3 off',
            'Set Day/Night blocks in a 14-day template → Repeat Weekly, Every 2 weeks',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'Standalone Fire Shift Apps vs Unified Family + Weather Calendar on iPhone',
        body: [
          'Dedicated shift generators like FireShift or Supershift make it quick to stamp A/B/C colors onto a month grid, but your partner, childcare schedule, doctor appointments, and station-trade notes usually live in shared iCloud or Google Calendars. Checking two apps leads to scheduling family trips on Day 2 of a 48/96 tour.',
          'By placing your 3-day, 6-day, 9-day, or 28-day shift rules onto a dedicated "Station Shifts" Google or iCloud calendar and opening Cloud Calendars on iPhone, you get readable Month event titles (not tiny dots), a 12-month Year overview for picking vacation/Kelly trades, a shared link for your family, and built-in hourly + 14-day Apple WeatherKit forecasts right beside every shift and outdoor day off.',
        ],
      },
      {
        heading: 'Handling Shift Trades, Overtime, and Kelly Days Cleanly',
        body: [
          'Keep your base platoon rotation on its own color-coded calendar (for example, Red for A-Shift) and record Kelly days, trades ("Working for Miller"), and callback overtime either by editing "This Event Only" on that date or placing overtime on a separate Green "Trades & OT" calendar so you can audit overtime hours at the end of the quarter in List view.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Use Custom Repeat → Daily → Every 3 days (24/48), Every 6 days (48/96), or Every 9 days (California pattern) in Google Calendar, iCloud, or Cloud Calendars.',
      'Share that dedicated "Shifts" calendar read-only with your spouse or family so everyone sees 2026–2027 tours automatically.',
      'Open Year view and Month view in Cloud Calendars on iPhone to plan vacation picks around natural 4-day or 7-day off stretches.',
    ],
    faq: [
      {
        q: 'Can Google Calendar or iPhone Calendar repeat an event every 6 or 9 days?',
        a: 'Yes. Standard iCalendar RRULE (FREQ=DAILY;INTERVAL=6 or INTERVAL=9) is supported natively in iOS Calendar, Google Calendar, and Cloud Calendars without third-party scripts.',
      },
      {
        q: 'How do I share my 24/48 or 48/96 schedule with a spouse on Android while I use an iPhone?',
        a: 'Create the 3-day or 6-day recurring rule inside a shared Google Calendar or Cloud Calendars Web Studio (/calendar/) so both iPhone and Android stay in instant two-way sync.',
      },
    ],
    sourcesHeading: 'Technical & standards references',
    sources: [
      { label: 'IETF RFC 5545 — Daily Interval Recurrence Rules', url: 'https://www.rfc-editor.org/rfc/rfc5545#section-3.3.10' },
      { label: 'Cloud Calendars Web Studio', url: 'https://www.cloud-calendars.com/calendar/' },
      { label: 'Cloud Calendars on the App Store', url: 'https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319' },
    ],
    relatedComparisons: [
      { slug: 'best-calendar-app-for-shift-workers-and-rotating-schedules', label: 'Best Shift Work Calendar Apps on iPhone' },
      { slug: 'month-view-event-titles-vs-dots-iphone-calendars', label: 'Month View Event Titles vs Dots on iPhone' },
      { slug: 'calendar-apps-with-built-in-weather-forecast-iphone', label: 'Calendar Apps with Built-In Weather' },
    ],
    seeAlso: [
      'shift-work-calendar-iphone-rotating-schedules',
      'the-year-in-one-screen',
      'a-fourteen-day-view-of-the-weather',
    ],
  },
};
