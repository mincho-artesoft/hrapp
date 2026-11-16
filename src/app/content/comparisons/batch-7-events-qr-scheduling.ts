import type { LocalisedArticle } from '../types';

export const COMPARISONS_BATCH_7: Readonly<Record<string, LocalisedArticle>> = {
  'cloud-calendars-vs-doodle': {
    updated: '2026-11-13',
    seoTitle: 'Cloud Calendars vs Doodle: Ad-Free Booking & Event RSVPs',
    title: 'Cloud Calendars vs Doodle: Clean Guest Booking, Event RSVPs & Two-Way iOS Sync',
    short: 'Cloud Calendars vs Doodle',
    description:
      'Compare Cloud Calendars and Doodle across ad-free guest booking pages, shareable Event RSVP links, QR sign-in, Google & Outlook conflict checks, and iPhone views.',
    lede: 'Doodle pioneered multi-person date polls, while its 1-on-1 Booking Page and free polling views place display ads in front of external guests unless the organizer upgrades to Doodle Pro. Cloud Calendars combines clean, ad-free guest Booking pages (/book/) and fixed-date Event RSVP pages (/event/) with a full Web Calendar Studio (/calendar/) and a native iPhone/iPad app that unlocks Web Studio for $0 forever via QR sign-in.',
    comparison: {
      heading: 'Head-to-Head Comparison: Cloud Calendars vs Doodle',
      caption: 'Guest experience, booking pages, event RSVPs, daily calendar views, and pricing compared',
      columns: ['Dimension', 'Cloud Calendars (Web + iOS)', 'Doodle (Free Tier)', 'Doodle Pro / Team'],
      rows: [
        {
          cells: [
            'Guest-facing ads on public booking & RSVP pages',
            'Zero ads for guests — clean distraction-free /book/ and /event/ pages',
            'Displays banner/programmatic ads to invitees',
            'Ad-free for invitees (~$6.95–$14.95/user/month)',
          ],
        },
        {
          cells: [
            'Web Studio pricing & iOS unlock',
            '$0 Free Forever with Cloud Calendars iOS app (QR / 6-digit code) or $1.99/mo ($19.99/yr) web-only',
            '$0 limited tier (1 Booking Page, ad-supported)',
            'Paid per-seat subscription',
          ],
        },
        {
          cells: [
            'Multi-person date voting polls ("Which day works?")',
            'Focused on fixed-date Event RSVPs (/event/) and 1-on-1 slot booking (/book/)',
            'Core strength — group time-voting matrix',
            'Unlimited group polls + deadlines & reminders',
          ],
        },
        {
          cells: [
            'Two-way personal Cloud Calendar on iPhone & iPad',
            'Yes — Web events, RSVPs & bookings sync automatically to iPhone with local alerts',
            'No full daily iOS calendar grid with WeatherKit',
            'Requires external Google, Outlook, or Apple Calendar app',
          ],
        },
        {
          cells: [
            'Google Calendar & Microsoft Outlook busy checks',
            'Direct OAuth busy-time conflict check + event write-back',
            '1 connected calendar',
            'Multiple connected calendars + Zoom/Teams links',
          ],
        },
        {
          cells: [
            'QR code invitations & live .ics feed updates',
            'Instant QR codes + live scoped .ics feeds when times or rooms change',
            'Web poll links; static confirmation invites',
            'Custom branding + calendar invite dispatch',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'When You Need Clean Client Booking or Fixed-Date Event RSVPs Without Guest Ads',
        body: [
          'Sending an ad-heavy scheduling page to a prospective client, job candidate, or workshop attendee undermines trust before the meeting even starts. In Cloud Calendars, every public /book/ scheduling page and /event/ RSVP page is completely free of third-party advertising.',
          'Hosts who install the Cloud Calendars app on iPhone or iPad scan the Web Studio QR code once to unlock the entire browser workspace for $0 forever (with a rotating 6-digit Authenticator code stored in iOS Keychain for future logins), or subscribe on the web alone for $1.99/month ($19.99/year). Every confirmed booking or RSVP automatically syncs two-way into your personal Cloud Calendars calendar on iPhone.',
        ],
      },
      {
        heading: 'When Doodle Still Wins',
        body: [
          'If eight committee members across four organizations need to vote on twelve candidate dates before you pick a single winner, Doodle’s classic multi-participant voting grid is purpose-built for consensus polling.',
          'Once the winning time is chosen, however, Cloud Calendars excels at publishing the final Event RSVP page with a scannable QR code, live-updating .ics calendar feed, and hourly Apple WeatherKit forecasts on iPhone.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Use Doodle when a group must vote across several candidate dates before a meeting time exists.',
      'Use Cloud Calendars (/calendar/) when you want ad-free 1-on-1 booking links (/book/) or fixed-date Event RSVP pages (/event/) with QR invites.',
      'Scan the Web Studio QR code from the Cloud Calendars iOS app to unlock Web Studio for $0 forever and sync bookings straight to your iPhone.',
      'Connect both Google Calendar and Microsoft Outlook in Web Studio so external bookings never collide with existing meetings.',
    ],
    faq: [
      {
        q: 'Do my clients or guests see ads when booking on Cloud Calendars?',
        a: 'Never. Public /book/ and /event/ pages in Cloud Calendars contain zero advertisements and require no app download or account signup for guests.',
      },
      {
        q: 'Does Cloud Calendars include group date-voting polls like Doodle?',
        a: 'Cloud Calendars focuses on 1-on-1 availability booking (/book/) and fixed-date shareable Event RSVP pages (/event/) rather than multi-date voting matrices.',
      },
      {
        q: 'How do Doodle bookings or Cloud Calendars bookings appear on my iPhone?',
        a: 'Cloud Calendars syncs every Web Studio event, RSVP, and guest booking directly into your personal Cloud Calendars calendar on iPhone and iPad—and also mirrors connected Google and Outlook calendars.',
      },
    ],
    sourcesHeading: 'Official product and pricing references',
    sources: [
      { label: 'Doodle Pricing & Plans', url: 'https://doodle.com/en/pricing/' },
      { label: 'Cloud Calendars Web Studio', url: 'https://www.cloud-calendars.com/calendar/' },
      { label: 'Cloud Calendars on the App Store', url: 'https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319' },
    ],
    relatedComparisons: [
      { slug: 'cloud-calendars-vs-calendly', label: 'Cloud Calendars vs Calendly' },
      { slug: 'cloud-calendars-vs-luma-and-partiful', label: 'Cloud Calendars vs Luma & Partiful' },
      { slug: 'cloud-calendars-vs-savvycal', label: 'Cloud Calendars vs SavvyCal' },
    ],
    seeAlso: [
      'booking-link-or-shared-calendar',
      'qr-code-sign-in-and-ios-totp-authenticator-guide',
      'host-event-rsvp-page-with-qr-code-and-live-ics-feed',
    ],
  },

  'cloud-calendars-vs-acuity-scheduling': {
    updated: '2026-11-13',
    seoTitle: 'Cloud Calendars vs Acuity Scheduling: Booking & Calendar',
    title: 'Cloud Calendars vs Acuity Scheduling: Fast Calendar + Booking vs Intake Suites',
    short: 'Cloud Calendars vs Acuity',
    description:
      'Compare Cloud Calendars and Squarespace Acuity Scheduling across setup speed, pricing ($0 with iOS / $1.99 mo vs $16–$20+ mo), intake forms, and iOS calendar views.',
    lede: 'Acuity Scheduling (by Squarespace) is built for salons, clinics, and studios that sell prepaid appointment packages, gift certificates, and HIPAA/custom intake questionnaires. Cloud Calendars is built for professionals, consultants, and teams who want a fast drag-and-drop Web & iOS Calendar with clean booking links, one-time tokens, Google + Outlook sync, and zero $20/month SaaS bloat.',
    comparison: {
      heading: 'Comparison Matrix: Cloud Calendars vs Acuity Scheduling',
      caption: 'Pricing, daily calendar workflow, client booking, and commerce features compared',
      columns: ['Feature', 'Cloud Calendars (Web + iOS)', 'Acuity Emerging (~$16–$20/mo)', 'Acuity Growing / Powerhouse'],
      rows: [
        {
          cells: [
            'Monthly / annual cost',
            '$0 Free Forever with iOS app (QR sign-in) or $1.99/mo ($19.99/yr) web-only',
            '~$16–$20/month (no permanent free plan)',
            '~$27–$61/month across multiple staff calendars',
          ],
        },
        {
          cells: [
            'Full daily Day / Week / Month / Year calendar app',
            'Yes — interactive browser grid + native iPhone/iPad app with WeatherKit & widgets',
            'Appointment admin list/grid focused on client bookings',
            'Multi-staff appointment ledger',
          ],
        },
        {
          cells: [
            'Two-way personal Cloud Calendar + Google & Outlook sync',
            'Native two-way iPhone sync + Google & Microsoft OAuth conflict checks',
            'Syncs with Google, Outlook, Exchange & iCloud',
            'Multi-location & multi-staff calendar sync',
          ],
        },
        {
          cells: [
            'One-time & expiring private booking links + QR codes',
            'Included out of the box',
            'Public/unlisted appointment type links',
            'Public/unlisted links + embedded widgets',
          ],
        },
        {
          cells: [
            'Prepaid packages, gift certificates, coupons & custom intake forms',
            'Lightweight notes & guest details (not a retail POS)',
            'Client intake forms + Stripe/Square/PayPal checkout',
            'Subscriptions, gift certificates, SMS reminders & HIPAA (Powerhouse)',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'Right-Sizing Your Scheduling Stack',
        body: [
          'If you run a massage clinic, photography studio, or tutoring center that charges deposits via Square, sells 10-pack session bundles, and collects multi-page client intake forms, Acuity Scheduling justifies its $192–$700+ annual price tag.',
          'If you are a founder, consultant, designer, recruiter, or independent specialist who simply wants an uncluttered @handle booking page, 15/30/60-minute meeting types with buffer padding, single-use VIP links, and a unified calendar across browser, iPhone, and iPad, Cloud Calendars delivers the entire workflow for $0 with the iOS app (or $19.99/year web-only).',
        ],
      },
      {
        heading: 'Instant Two-Way Sync With Your iPhone',
        body: [
          'Every appointment booked through your Cloud Calendars /book/ link is written directly to your personal Cloud Calendars workspace (`cal/{calId}/events/`), mirrored to connected Google or Outlook calendars, and synced automatically onto your iPhone with native local alerts—and dragging a booked appointment to a new slot notifies the guest automatically.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Choose Acuity Scheduling if you require client credit-card deposits, session packages, gift cards, or HIPAA-eligible intake forms.',
      'Choose Cloud Calendars (/calendar/) if you want fast 1-on-1 booking links, buffer times, QR codes, and a daily Web + iOS calendar without a $16–$20/mo bill.',
      'Pair Web Studio with the Cloud Calendars iOS app via QR scan to unlock Web Studio free forever and receive automatic iPhone calendar sync.',
    ],
    faq: [
      {
        q: 'Does Acuity Scheduling have a free plan?',
        a: 'Acuity offers a short free trial rather than a permanent free tier, whereas Cloud Calendars Web Studio is $0 forever when paired with the free Cloud Calendars iOS app (or $1.99/month standalone on Web).',
      },
      {
        q: 'What happens if I reschedule a booked meeting on my iPhone or in Web Studio?',
        a: 'When you move or cancel a booked appointment in Cloud Calendars, the 5-minute slot locks update atomically, connected Google/Outlook calendars update, and the guest receives an updated confirmation with a self-service manage link.',
      },
    ],
    sourcesHeading: 'Official pricing and documentation',
    sources: [
      { label: 'Acuity Scheduling Pricing & Plans', url: 'https://acuityscheduling.com/pricing' },
      { label: 'Cloud Calendars Web Studio', url: 'https://www.cloud-calendars.com/calendar/' },
      { label: 'Cloud Calendars on the App Store', url: 'https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319' },
    ],
    relatedComparisons: [
      { slug: 'cloud-calendars-vs-calendly', label: 'Cloud Calendars vs Calendly' },
      { slug: 'cloud-calendars-vs-cal-com', label: 'Cloud Calendars vs Cal.com' },
      { slug: 'cloud-calendars-vs-savvycal', label: 'Cloud Calendars vs SavvyCal' },
    ],
    seeAlso: [
      'create-public-booking-page-buffers-and-one-time-links',
      'two-way-personal-cloud-calendar-sync-iphone-web',
      'booking-link-or-shared-calendar',
    ],
  },

  'cloud-calendars-vs-savvycal': {
    updated: '2026-11-13',
    seoTitle: 'Cloud Calendars vs SavvyCal: Scheduling & Calendar App',
    title: 'Cloud Calendars vs SavvyCal: Visual Calendar + Free iOS Unlock vs Overlay Links',
    short: 'Cloud Calendars vs SavvyCal',
    description:
      'Compare Cloud Calendars and SavvyCal across recipient calendar overlays, single-use links, Web + iPhone calendar views, WeatherKit, and pricing.',
    lede: 'SavvyCal is admired by founders and executives for letting invitees overlay their own calendar on top of a booking grid, starting around $12/user/month for active scheduling links. Cloud Calendars gives you a complete drag-and-drop Web Calendar, multi-duration booking pages, single-use links, Event RSVP pages, and a native iPhone/iPad calendar app—for $0 forever when linked via iOS QR sign-in or $1.99/month standalone on Web.',
    comparison: {
      heading: 'Feature Comparison: Cloud Calendars vs SavvyCal',
      caption: 'Comparing scheduling UX, daily calendar planning, mobile widgets, and subscription cost',
      columns: ['Dimension', 'Cloud Calendars (Web + iOS)', 'SavvyCal Free Plan', 'SavvyCal Basic / Premium ($12–$20/mo)'],
      rows: [
        {
          cells: [
            'Live public booking links & Web Studio cost',
            '$0 Free Forever with iOS QR sign-in, or $1.99/mo ($19.99/yr) web-only',
            'Explore/preview mode only — active booking links require a paid plan',
            '$12–$20/user/month',
          ],
        },
        {
          cells: [
            'Full daily Web + iPhone/iPad calendar app included',
            'Yes — Day, Week, Month, Year & Multi-column iOS views + WeatherKit & widgets',
            'No — scheduling link tool only',
            'No — requires separate daily calendar client',
          ],
        },
        {
          cells: [
            'Recipient calendar overlay & ranked availability',
            'Fast timezone-aware slot picker + instant .ics & Google/Outlook checks',
            'Preview only',
            'Signature feature — guests overlay their calendar & hosts rank preferred slots',
          ],
        },
        {
          cells: [
            'Single-use & expiring invite links',
            'Included ($0 with iOS app)',
            'Not active on Free',
            'Included on paid tiers',
          ],
        },
        {
          cells: [
            'Passwordless QR login & 6-digit iOS Authenticator',
            'Built into Cloud Calendars iOS (Keychain RFC 6238 TOTP)',
            'Standard web auth',
            'Standard web auth',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'Why Pay $144–$240/Year Just to Send Clean Single-Use Booking Links?',
        body: [
          'Many solo founders and consultants sign up for SavvyCal primarily because they want polite, single-use scheduling links and simultaneous Google + Microsoft Outlook conflict checks—not realizing SavvyCal’s free plan does not let guests actually book live links.',
          'Cloud Calendars includes multiple meeting durations, pre/post buffers, Google + Outlook OAuth conflict checks, single-use or expiring invite tokens, and QR codes—unlocked permanently for $0 when you approve browser sign-in from the Cloud Calendars iOS app, or $19.99/year on the web.',
        ],
      },
      {
        heading: 'Where SavvyCal’s Paid Tier Shines',
        body: [
          'If your top priority is letting busy external executives click "Overlay my Google/Outlook calendar" directly on your booking link or ranking morning slots ahead of afternoon slots without hiding afternoon availability completely, SavvyCal’s $12–$20/month UX is thoughtfully engineered for that specific interaction.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Pick Cloud Calendars if you want live booking links, single-use tokens, Event RSVP pages, and a full Web + iOS calendar for $0 (with the iOS app) or $1.99/mo.',
      'Pick SavvyCal Basic/Premium if guest-side OAuth calendar overlay and ranked slot preferences are worth $144+/year for your workflow.',
      'Use the built-in 6-digit Authenticator inside Cloud Calendars on iPhone to sign in on any desktop browser without passwords or magic-link email delays.',
    ],
    faq: [
      {
        q: 'Can I send live booking links for free with Cloud Calendars?',
        a: 'Yes. Install the free Cloud Calendars app on iPhone or iPad, scan the QR code on cloud-calendars.com/calendar/, and tap Approve Sign-In to unlock Web Studio and live booking links for $0 forever.',
      },
      {
        q: 'How does the 6-digit Authenticator in Cloud Calendars work?',
        a: 'Once you link your Cloud Calendars iOS account, the app stores an RFC 6238 secret in iOS Keychain and displays a rotating 6-digit code every 30 seconds—even offline—so you can sign into Web Studio on any computer with your email and 6-digit code.',
      },
    ],
    sourcesHeading: 'Official pricing and product documentation',
    sources: [
      { label: 'SavvyCal Pricing & Features', url: 'https://savvycal.com/pricing' },
      { label: 'Cloud Calendars Web Studio', url: 'https://www.cloud-calendars.com/calendar/' },
      { label: 'Cloud Calendars on the App Store', url: 'https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319' },
    ],
    relatedComparisons: [
      { slug: 'cloud-calendars-vs-calendly', label: 'Cloud Calendars vs Calendly' },
      { slug: 'cloud-calendars-vs-cal-com', label: 'Cloud Calendars vs Cal.com' },
      { slug: 'cloud-calendars-vs-doodle', label: 'Cloud Calendars vs Doodle' },
    ],
    seeAlso: [
      'qr-code-sign-in-and-ios-totp-authenticator-guide',
      'create-public-booking-page-buffers-and-one-time-links',
      'two-way-personal-cloud-calendar-sync-iphone-web',
    ],
  },

  'cloud-calendars-vs-luma-and-partiful': {
    updated: '2026-11-13',
    seoTitle: 'Cloud Calendars vs Luma & Partiful: Event RSVPs & QR Invites',
    title: 'Cloud Calendars vs Luma & Partiful: Calendar-Native Event RSVPs & Live .ics Sync',
    short: 'Cloud Calendars vs Luma & Partiful',
    description:
      'Compare Cloud Calendars shareable Event RSVP pages (/event/) and QR invites with Luma and Partiful across live .ics calendar feeds, WeatherKit forecasts, and privacy.',
    lede: 'Partiful and Luma excel at social party blasts, SMS walls, and ticketed community directories—but guests frequently complain about public attendee lists, SMS marketing prompts, or missing room/time changes on their actual calendar. Cloud Calendars treats every shared event (/event/) as a first-class calendar object with a scannable QR code, browser RSVP without app downloads, and a live scoped .ics feed that keeps Apple, Google, and Outlook calendars updated automatically.',
    comparison: {
      heading: 'Comparison Matrix: Cloud Calendars vs Luma vs Partiful',
      caption: 'Event RSVP pages, live calendar updates, guest privacy, weather forecasts, and daily utility',
      columns: ['Feature', 'Cloud Calendars (/event/ + iOS)', 'Luma (lu.ma)', 'Partiful'],
      rows: [
        {
          cells: [
            'Primary focus',
            'Calendar-first Event RSVP pages, QR invites, 1-on-1 booking & full daily calendar',
            'Community events, newsletters, ticketing & check-in',
            'Casual social parties, animated themes & SMS blasts',
          ],
        },
        {
          cells: [
            'Guest RSVP without downloading an app or creating a profile',
            'Yes — instant web RSVP + self-service manage link + live .ics feed',
            'Web RSVP supported (encourages Luma profile)',
            'Phone-number / profile-centric RSVP flow',
          ],
        },
        {
          cells: [
            'Live-updating scoped .ics feed when host changes time or venue',
            'Yes — subscribed calendar feeds & iOS app copies update automatically',
            'Sends update emails / calendar invites',
            'Relies primarily on SMS / app notifications',
          ],
        },
        {
          cells: [
            'Outdoor event weather forecast & Home Screen widgets',
            'Hourly & 10-day Apple WeatherKit forecast right inside the iOS calendar',
            'None',
            'None',
          ],
        },
        {
          cells: [
            'Paid ticket checkout, promo codes & community newsletters',
            'Not a ticketing marketplace — $0 commission, focused on clean RSVPs & schedules',
            'Core strength (Stripe ticket sales, approval queues, blasts)',
            'Chip-in links & social photo rolls',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'Events That Actually Stay Accurate on Everyone’s Calendar',
        body: [
          'Social invite pages look festive until the meetup moves 30 minutes later or switches to a rain-backup café—leaving half your guests staring at an outdated static calendar entry or hunting through text threads.',
          'When you share an event from Cloud Calendars (via Web Studio or the iPhone/iPad app), each registrant gets a clean /event/ page, a private /event/manage/ link to update their RSVP, and a scoped calendar feed (`cal.cloud-calendars.com/f/...ics`) or instant iOS sync so any time, location, or note update propagates cleanly.',
        ],
      },
      {
        heading: 'When to Pick Luma or Partiful Instead',
        body: [
          'Choose Luma when you are selling paid conference tickets, gating entry with manual host approval queues, or building an email subscriber list for recurring tech meetups. Choose Partiful when animated party flyers, SMS group banter, and post-party photo sharing are the main event.',
          'Choose Cloud Calendars when you want clean, private, ad-free Event RSVPs alongside your everyday work and family calendar, QR codes for printed posters or slides, and hourly WeatherKit forecasts before an outdoor gathering.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Create an event in Cloud Calendars (on iPhone or in Web Studio) and share its public /event/ link or printable QR code.',
      'Let guests RSVP in any browser without forcing them to create a social profile or hand over a phone number.',
      'Update the event time or location once in Cloud Calendars—subscribed .ics feeds and connected Cloud Calendars apps reflect the change automatically.',
      'Check Apple WeatherKit hourly rain, wind, and temperature directly beside your outdoor event on iPhone and iPad.',
    ],
    faq: [
      {
        q: 'Do guests need the Cloud Calendars iPhone app to RSVP to an event?',
        a: 'No. Anyone on Android, Windows, Mac, or iPhone can open the /event/ link or scan the QR code in any web browser, submit their RSVP, and add the live calendar feed with zero app install.',
      },
      {
        q: 'Does Cloud Calendars expose my guest list or send marketing texts to attendees?',
        a: 'No. Cloud Calendars sends only transactional event confirmations/updates and never uses attendee emails for marketing or public social directories.',
      },
    ],
    sourcesHeading: 'Official platform documentation',
    sources: [
      { label: 'Luma Pricing & Event Platform Overview', url: 'https://lu.ma/pricing' },
      { label: 'Partiful Help & Platform Overview', url: 'https://partiful.com' },
      { label: 'Cloud Calendars Web Studio', url: 'https://www.cloud-calendars.com/calendar/' },
      { label: 'Cloud Calendars on the App Store', url: 'https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319' },
    ],
    relatedComparisons: [
      { slug: 'cloud-calendars-vs-doodle', label: 'Cloud Calendars vs Doodle' },
      { slug: 'cloud-calendars-vs-calendly', label: 'Cloud Calendars vs Calendly' },
      { slug: 'calendar-apps-with-built-in-weather-forecast-iphone', label: 'Calendar Apps With Built-In Weather' },
    ],
    seeAlso: [
      'host-event-rsvp-page-with-qr-code-and-live-ics-feed',
      'inviting-people-who-do-not-have-the-app',
      'planning-outdoors-without-being-rained-on',
    ],
  },
};
