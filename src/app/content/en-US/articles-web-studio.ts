import type { LocalisedArticle } from '../types';

/**
 * Step-by-step Web Studio & iOS companion guides:
 * 1. QR Code Sign-In & 6-Digit iOS TOTP Authenticator (RFC 6238)
 * 2. Two-Way Personal Cloud Calendar Sync Between iPhone & Web Studio
 * 3. Public Booking Pages (/book/), Buffers, Daily Caps & Single-Use Invite Links
 * 4. Shareable Event RSVP Pages (/event/) with QR Codes & Live Scoped ICS Feeds
 */
export const WEB_STUDIO_EN_US: Readonly<Record<string, LocalisedArticle>> = {
  'qr-code-sign-in-and-ios-totp-authenticator-guide': {
    updated: '2026-11-13',
    seoTitle: 'QR Code Sign-In & 6-Digit iOS Authenticator Guide',
    title: 'How to Sign In to Cloud Calendars Web Studio with QR Scan & Your 6-Digit iOS Code',
    short: 'QR Sign-In & 6-Digit iOS Authenticator',
    description:
      'Step-by-step guide to pairing Cloud Calendars Web Studio with the iPhone or iPad app via QR code and RFC 6238 6-digit TOTP codes to unlock Web Studio for $0.',
    lede: 'Cloud Calendars Web Studio (/calendar/) lets you sign in from any desktop browser without typing a password on a shared keyboard or paying a separate web fee when you already use the iPhone or iPad app. Scanning the browser QR code once links your personal Cloud Calendar identity, unlocks full Web Studio access for $0 forever, and stores an offline RFC 6238 6-digit authenticator secret inside your iOS Keychain for future logins.',
    commonBelief:
      'Signing in to a desktop calendar workspace requires either reusing a browser password, waiting for email magic links, or buying a separate desktop SaaS seat.',
    sections: [
      {
        heading: 'How QR Challenge Pairing and iOS Universal Links Work Together',
        body: [
          'When you open https://www.cloud-calendars.com/calendar/ on Mac, Windows, or Linux and view the Sign in with iOS App card, Web Studio requests a short-lived cryptographic QR session token (/auth/ios-qr/start) that expires automatically after five minutes if unused. The browser renders a scannable QR code pointing to an HTTPS Universal Link (/app-auth/?c=...) verified against Apple’s Associated Domains specification.',
          'Pointing the built-in iPhone or iPad Camera app—or opening Cloud Calendars > Sharing > Web Sign-In & Authenticator—opens the native approval sheet directly inside Cloud Calendars. Neither the QR payload nor the URL query string ever exposes your account credentials; your phone authenticates over TLS using its existing Cloud Calendar bearer session and confirms the browser challenge only when you tap Approve Sign-In.',
        ],
        table: {
          heading: 'Web Studio Access Paths Compared',
          caption: 'Choose QR pairing with the free iOS app or standalone browser sign-in',
          columns: ['Sign-In Path', 'Cost', 'How You Authenticate Next Time', 'Two-Way iPhone Sync'],
          rows: [
            {
              cells: [
                'Cloud Calendars iOS App (QR Scan + 6-Digit Code)',
                '$0 Free Forever',
                'Scan QR or type the 30-second 6-digit code shown in the iOS app',
                'Automatic two-way Personal Cloud Calendar sync',
              ],
            },
            {
              cells: [
                'Standalone Web Account (Google, Microsoft, or Email)',
                '$1.99/mo or $19.99/yr after free view preview',
                'OAuth or email session in your desktop browser',
                'Can link the iOS app later at any time to switch to $0',
              ],
            },
          ],
        },
      },
      {
        heading: 'Step-by-Step: Pair Your Browser via QR Code in Under 15 Seconds',
        body: [
          '1. On your computer, open https://www.cloud-calendars.com/calendar/ and select Sign in with Cloud Calendars iOS to display the live QR challenge.',
          '2. On your iPhone or iPad running Cloud Calendars, either point the standard iOS Camera at the screen and tap the Cloud Calendars banner, or open Cloud Calendars, tap the calendar icon to open Calendars, tap Web Studio & Authenticator, and tap Scan Web QR Code.',
          '3. Review the pairing prompt on your phone and tap Approve Sign-In. Within two seconds, your desktop browser receives its session token, loads your personal Cloud Calendar events, and activates your iOS-linked $0 Web Studio entitlement.',
        ],
      },
      {
        heading: 'Using the Built-In 6-Digit Authenticator Code (RFC 6238 TOTP)',
        body: [
          'The moment you approve your first QR sign-in, the server provisions a 160-bit Base32 shared secret encrypted at rest with AES-256-GCM and delivers it over TLS to your iPhone, where Cloud Calendars saves it inside the hardware-backed iOS Keychain. From that point forward, your phone computes a standard 6-digit Time-Based One-Time Password (RFC 6238, HMAC-SHA1, 30-second step) completely offline—even in Airplane Mode.',
          'Whenever you open Web Studio on a laptop whose webcam is covered or on an iPad browser where scanning the same screen is inconvenient, choose Enter 6-Digit Code on the web sign-in dialog, enter your account handle or email plus the current 6-digit number from Cloud Calendars > Web Studio & Authenticator, and sign right in. Server verification accepts a ±1 step tolerance (±30 seconds) to absorb minor clock drift while rejecting replayed or brute-forced codes.',
        ],
      },
      {
        heading: 'What Happens If You Already Signed In on the Web With Email or Google First',
        body: [
          'If you started in a desktop browser with Google, Microsoft, or email before installing the iOS app, open Settings or Account inside Web Studio while signed in and generate a Link iOS App QR code. Scanning that QR code from Cloud Calendars on iPhone binds your existing web calendar ID to your iOS installation so you keep every event, booking type, and RSVP link while unlocking the $0 iOS-linked entitlement.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Install Cloud Calendars on iPhone or iPad from the App Store before opening Web Studio on your computer.',
      'Open https://www.cloud-calendars.com/calendar/ and display the Sign in with iOS QR code.',
      'Scan with the iPhone Camera (Universal Link) or inside Calendars > Web Studio & Authenticator > Scan Web QR Code.',
      'Tap Approve Sign-In on your phone to unlock Web Studio for $0 and store your Keychain authenticator secret.',
      'For future camera-free logins, open Web Studio & Authenticator on iPhone and enter the 30-second 6-digit code in your browser.',
    ],
    faq: [
      {
        q: 'Does the 6-digit authenticator code work when my iPhone has no cellular or Wi-Fi signal?',
        a: 'Yes. After your first QR pairing stores the shared secret in iOS Keychain, the 6-digit code is computed locally from device time using RFC 6238 TOTP every 30 seconds, so your phone needs no internet connection to generate codes while your computer signs in.',
      },
      {
        q: 'Do I have to pay $1.99/month for Web Studio if I use the Cloud Calendars iOS app?',
        a: 'No. Pairing with the Cloud Calendars iPhone or iPad app via QR code or your 6-digit authenticator code unlocks Web Studio editing, public /book/ scheduling links, and /event/ RSVP pages for $0. The $1.99/month ($19.99/year) plan is only for standalone web users who do not use the iOS app.',
      },
      {
        q: 'What if a QR code sits on my monitor and expires before I scan it?',
        a: 'Each QR challenge expires after five minutes and can only be redeemed once. Click Refresh QR in Web Studio to generate a fresh challenge code and scan again.',
      },
    ],
    sourcesHeading: 'Authentication standards and platform documentation',
    sources: [
      {
        label: 'IETF RFC 6238: TOTP Time-Based One-Time Password Algorithm',
        url: 'https://www.rfc-editor.org/rfc/rfc6238',
      },
      {
        label: 'Apple Developer: Supporting Associated Domains & Universal Links',
        url: 'https://developer.apple.com/documentation/xcode/supporting-associated-domains',
      },
      {
        label: 'Cloud Calendars Web Studio',
        url: 'https://www.cloud-calendars.com/calendar/',
      },
    ],
    relatedComparisons: [
      { slug: 'cloud-calendars-vs-calendly', label: 'Cloud Calendars vs Calendly' },
      { slug: 'cloud-calendars-vs-savvycal', label: 'Cloud Calendars vs SavvyCal' },
      { slug: 'cloud-calendars-vs-doodle', label: 'Cloud Calendars vs Doodle' },
    ],
    seeAlso: [
      'two-way-personal-cloud-calendar-sync-iphone-web',
      'create-public-booking-page-buffers-and-one-time-links',
      'what-you-get-without-paying-anything',
    ],
    articleLinks: [
      {
        slug: 'two-way-personal-cloud-calendar-sync-iphone-web',
        label: 'How two-way Personal Cloud Calendar sync works on iPhone and Web',
      },
      {
        slug: 'host-event-rsvp-page-with-qr-code-and-live-ics-feed',
        label: 'Publish an Event RSVP page with QR code and live .ics feed',
      },
    ],
  },

  'two-way-personal-cloud-calendar-sync-iphone-web': {
    updated: '2026-11-13',
    seoTitle: 'Two-Way Personal Cloud Calendar Sync: iPhone & Web',
    title: 'Two-Way Personal Cloud Calendar Sync Between iPhone, iPad & Web Studio Explained',
    short: 'Two-Way iPhone & Web Cloud Sync',
    description:
      'Learn how your personal Cloud Calendars calendar syncs events, guest RSVPs, and /book/ appointments two ways between iPhone/iPad and Web Studio without duplicates.',
    lede: 'When you sign in to Cloud Calendars on iPhone or pair Web Studio via QR code, your account includes a dedicated personal Cloud Calendars calendar alongside any iCloud, Google Calendar, or Microsoft Outlook calendars you view on your device. Every event created in that personal Cloud Calendars calendar on your phone appears automatically in Web Studio (/calendar/), and every Web event, guest RSVP (/event/), or client booking (/book/) syncs down to your iPhone with native local notifications.',
    commonBelief:
      'Using both a browser calendar studio and an iPhone calendar app either requires exporting static .ics files or creates duplicate copies of shared events.',
    sections: [
      {
        heading: 'How the Personal Cloud Calendars Layer Differs From iOS EventKit and OAuth Accounts',
        body: [
          'On iPhone and iPad, Cloud Calendars reads iCloud and Exchange calendars on-device through Apple EventKit and connects directly to Google Calendar and Microsoft Outlook via OAuth. Your personal Cloud Calendars calendar (marked with an iCloud-style cloud badge and labeled Web & Events Sync inside the Calendars sheet) is backed directly by your canonical Cloud Calendars store.',
          'Because Web Studio (/calendar/), public booking pages (/book/), and shareable RSVP pages (/event/) read and write that exact same canonical event collection, you do not need to configure CalDAV server URLs, app-specific passwords, or manual .ics imports to keep your browser workspace and your phone aligned.',
        ],
        table: {
          heading: 'What Syncs in Each Direction',
          caption: 'Real-time two-way behavior between Cloud Calendars on iOS and Web Studio',
          columns: ['Action', 'Where You Make the Change', 'Result on the Other Side'],
          rows: [
            {
              cells: [
                'Create, drag-move, edit, or delete an event in Cloud Calendars',
                'iPhone or iPad app',
                'Pushes within ~1 second to Web Studio, updates your live .ics feed, and locks matching /book/ slots',
              ],
            },
            {
              cells: [
                'Create or reschedule an event in Web Studio (/calendar/)',
                'Desktop or mobile browser',
                'Syncs down to your iPhone/iPad Personal Cloud Calendar and schedules local iOS alerts',
              ],
            },
            {
              cells: [
                'Guest books a 1-on-1 slot on your /book/ page',
                'Public guest browser',
                'Creates the confirmed meeting on Web Studio, mirrors connected Google/Outlook, and appears on iPhone',
              ],
            },
            {
              cells: [
                'Attendee submits Going / Maybe / Declined on /event/',
                'Public RSVP link or App Clip',
                'Updates attendee counts and status on both Web Studio and your iPhone event card',
              ],
            },
          ],
        },
      },
      {
        heading: 'Three-Way Merge Conflict Resolution When You Edit Offline on iPhone',
        body: [
          'Phones frequently enter subways, elevators, or flights while changes happen on the web—such as a client booking a Tuesday afternoon slot while your iPhone is offline. Rather than overwriting the entire calendar with whichever device connected last, Cloud Calendars maintains a per-account sync baseline on iOS and executes a field-aware three-way merge against the server state.',
          'Events added on your phone while offline upload cleanly alongside new web bookings made during the same window. If the exact same event was edited in both places before reconnecting, deterministic timestamp resolution preserves the newer revision without silently dropping unrelated appointments.',
        ],
      },
      {
        heading: 'How Duplicate Suppression Protects Shared iCloud and Google Events',
        body: [
          'Cloud Calendars also lets you generate a single-event share link or QR invite from an existing iCloud or Google Calendar event on your phone. Internally, the iOS sync engine tracks outgoing EventKit share identifiers so an event that already lives in your iCloud or Google calendar is never duplicated inside your personal Cloud Calendars list on the same iPhone.',
          'Meanwhile, pull-to-refresh inside the Calendars sheet, foreground app resume, a 20-second active sync cadence, and a 700-millisecond save debounce keep edits flowing smoothly without draining battery.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Open Cloud Calendars on iPhone, tap the calendar icon, and verify that your Cloud Calendars (Web & Events Sync) calendar is checked.',
      'Pair your desktop browser at https://www.cloud-calendars.com/calendar/ using Scan Web QR Code so both devices share the same account.',
      'Save personal Web Studio events, hosted RSVPs, and client bookings into your Cloud Calendars calendar so they appear automatically on both Web and iOS.',
      'Pull down inside the iOS Calendars sheet anytime you want an immediate manual refresh after editing on another computer.',
    ],
    faq: [
      {
        q: 'Can I delete the personal Cloud Calendars calendar on my iPhone?',
        a: 'No—to prevent accidental loss of your Web Studio events, bookings, and RSVPs, the personal Cloud Calendars calendar cannot be permanently deleted from the local calendar editor. You can toggle its visibility checkmark on or off at any time in the Calendars sheet, or sign out in Web Studio & Authenticator to remove its cached copy from the device.',
      },
      {
        q: 'Do events synced from Web Studio trigger native iPhone alerts and widgets?',
        a: 'Yes. Every timed event synced down into your personal Cloud Calendars calendar schedules native iOS local notifications according to its alert offsets and appears in Cloud Calendars Home Screen widgets, Lock Screen widgets, and hourly WeatherKit Day/Week views.',
      },
      {
        q: 'Does Personal Cloud Calendar sync upload my private iCloud calendars to the web?',
        a: 'No. Your iOS EventKit iCloud calendars remain strictly on-device via Apple EventKit unless you explicitly share a specific event. Only events placed in your personal Cloud Calendars calendar (plus Google or Microsoft accounts you explicitly connect in Web Studio) appear on the web.',
      },
    ],
    sourcesHeading: 'Calendar data standards and product references',
    sources: [
      {
        label: 'IETF RFC 5545: Internet Calendaring and Scheduling Core Object Specification (iCalendar)',
        url: 'https://www.rfc-editor.org/rfc/rfc5545',
      },
      {
        label: 'Cloud Calendars on the App Store',
        url: 'https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319',
      },
      {
        label: 'Cloud Calendars Web Studio',
        url: 'https://www.cloud-calendars.com/calendar/',
      },
    ],
    relatedComparisons: [
      { slug: 'merge-icloud-google-outlook-exchange-calendars-iphone', label: 'Merge iCloud, Google & Outlook on iPhone' },
      { slug: 'privacy-first-direct-sync-vs-cloud-relay-calendar-apps', label: 'Direct Sync vs Cloud-Relay Privacy' },
      { slug: 'caldav-vs-ics-subscribed-url-vs-oauth-calendar-sync', label: 'CalDAV vs ICS URL vs OAuth Sync' },
    ],
    seeAlso: [
      'qr-code-sign-in-and-ios-totp-authenticator-guide',
      'what-calendar-sync-actually-does',
      'icloud-google-and-outlook-in-one-view',
    ],
    articleLinks: [
      {
        slug: 'qr-code-sign-in-and-ios-totp-authenticator-guide',
        label: 'Pair Web Studio with QR code and 6-digit iOS Authenticator',
      },
      {
        slug: 'create-public-booking-page-buffers-and-one-time-links',
        label: 'Set up public /book/ scheduling links with buffers and daily limits',
      },
      {
        slug: 'calendar-notifications-missing-silent-or-duplicated',
        label: 'Troubleshoot missing or duplicated calendar notifications',
      },
    ],
  },

  'create-public-booking-page-buffers-and-one-time-links': {
    updated: '2026-11-13',
    seoTitle: 'Create a Public Booking Page with Buffers & One-Time Links',
    title: 'How to Set Up a Public Booking Page (/book/) with Google + Outlook Checks, Buffers & Single-Use Links',
    short: 'Set Up Public /book/ Scheduling Links',
    description:
      'Configure your @handle booking page in Cloud Calendars Web Studio with working hours, before/after buffers, minimum notice, daily caps, and one-time invite links.',
    lede: 'Publishing a booking link should not leave your afternoon packed back-to-back or let an old invite URL stay open months later. In Cloud Calendars Web Studio (/calendar/), you claim a clean @handle, define multiple meeting durations with independent buffer rules and daily caps, check busy blocks across your Personal Cloud Calendar plus connected Google Calendar and Microsoft Outlook accounts simultaneously, and issue single-use links when one invitation should book exactly one meeting.',
    commonBelief:
      'Offering multiple event types, cross-checking both Google and Outlook calendars, and sending single-use scheduling links requires a $10–$20/month scheduling subscription.',
    sections: [
      {
        heading: '1. Claim Your Public @handle and Connect Busy-Check Calendars',
        body: [
          'Open https://www.cloud-calendars.com/calendar/, sign in via QR code from the Cloud Calendars iOS app ($0) or with your Web Studio account, and open the Booking tab. Claim a readable handle (for example, /book/alex-studio) and verify your host display name and primary IANA time zone (such as America/New_York or Europe/London). Guests automatically see available slots converted into their own local browser time zone while your working hours stay anchored to yours.',
          'Next, connect any external Google Calendar or Microsoft 365 / Outlook accounts whose busy appointments must block availability. During slot calculation, the booking engine unions busy intervals from your Personal Cloud Calendar, connected Google calendars, connected Microsoft calendars, and atomic slot locks so two visitors clicking at the same second can never double-book the same window.',
        ],
      },
      {
        heading: '2. Configure Meeting Durations, Prep Buffers, Minimum Notice & Daily Caps',
        body: [
          'Instead of squeezing every conversation into a single 30-minute template, create distinct booking types—for example, a 15-minute Intro Call, a 45-minute Client Review, and a 60-minute Deep Dive—each with its own slug (/book/@handle/intro-15) and guardrail parameters.',
        ],
        table: {
          heading: 'Booking Guardrail Settings & Worked Slot Example',
          caption: 'How each scheduling rule protects focus time on a 09:00–17:00 workday',
          columns: ['Rule', 'What It Controls', 'Worked Example Impact'],
          rows: [
            {
              cells: [
                'Duration (minutes)',
                'Length of the booked appointment itself',
                '45-minute Client Review occupies 10:00–10:45 on guest & host calendars',
              ],
            },
            {
              cells: [
                'Before & After Buffer',
                'Padding reserved before start and after end',
                '10 min before + 15 min after blocks 09:50–11:00 against adjacent bookings',
              ],
            },
            {
              cells: [
                'Minimum Notice',
                'Lead time required before the earliest bookable slot',
                '4 hours minimum notice at 09:15 hides all morning slots before 13:15 today',
              ],
            },
            {
              cells: [
                'Daily Booking Cap',
                'Maximum bookings accepted per day for that type',
                'Cap of 3 automatically closes remaining slots on Thursday once 3 are booked',
              ],
            },
          ],
        },
      },
      {
        heading: '3. Reusable Booking Links vs Single-Use (One-Time) Invite Tokens',
        body: [
          'A permanent link like /book/alex-studio/intro-15 works well in an email signature or portfolio site, whereas executive introductions, candidate interviews, and VIP consultations shouldn’t allow unlimited repeat bookings months later. In Web Studio, click Create Single-Use Link on any booking type to mint a tokenized URL that automatically expires the instant the invitee confirms their slot.',
          'Every confirmed booking sends an iCalendar-compatible confirmation with self-service Reschedule and Cancel tokens. If the guest reschedules or cancels, your Personal Cloud Calendar on iPhone, Web Studio timeline, and mirrored Google/Outlook calendars update automatically without manual email back-and-forth.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Sign in at https://www.cloud-calendars.com/calendar/ (free via iOS QR scan or $1.99/mo standalone web) and open Booking.',
      'Set your @handle, weekly working hours, and host time zone.',
      'Connect Google Calendar and/or Microsoft Outlook under Connected Accounts so all work and personal conflicts block slots.',
      'Add before/after buffers, minimum notice hours, and a daily cap to each meeting type before sharing the URL.',
      'Generate a Single-Use Link whenever you want an invitation URL to close automatically after one booking.',
    ],
    faq: [
      {
        q: 'Do guests need to install Cloud Calendars or create an account to book a time?',
        a: 'No. Guests open your /book/@handle link in any mobile or desktop browser, pick an available time in their local time zone, enter their name, email, and optional note, and receive an instant calendar confirmation with zero ads or signup walls.',
      },
      {
        q: 'What happens if two people try to book the exact same 2:00 PM slot simultaneously?',
        a: 'Cloud Calendars acquires an atomic server-side slot lock when confirming a booking. The first request wins and writes the appointment; the second visitor immediately sees a prompt to pick another open time instead of creating a double-booking.',
      },
      {
        q: 'How quickly does a new booking show up on my iPhone?',
        a: 'Immediately—confirmed bookings are written straight into your canonical Personal Cloud Calendar (plus any connected Google or Outlook calendar) and sync down to Cloud Calendars on iPhone and iPad with local alerts.',
      },
    ],
    sourcesHeading: 'Scheduling standards and reference links',
    sources: [
      {
        label: 'IETF RFC 5545 §3.6.1: iCalendar VEVENT Component Specification',
        url: 'https://www.rfc-editor.org/rfc/rfc5545#section-3.6.1',
      },
      {
        label: 'Cloud Calendars Web Studio & Booking',
        url: 'https://www.cloud-calendars.com/calendar/',
      },
    ],
    relatedComparisons: [
      { slug: 'cloud-calendars-vs-calendly', label: 'Cloud Calendars vs Calendly' },
      { slug: 'cloud-calendars-vs-cal-com', label: 'Cloud Calendars vs Cal.com' },
      { slug: 'cloud-calendars-vs-acuity-scheduling', label: 'Cloud Calendars vs Acuity Scheduling' },
      { slug: 'cloud-calendars-vs-google-appointment-schedules', label: 'Cloud Calendars vs Google Schedules' },
    ],
    seeAlso: [
      'booking-link-or-shared-calendar',
      'qr-code-sign-in-and-ios-totp-authenticator-guide',
      'two-way-personal-cloud-calendar-sync-iphone-web',
    ],
    articleLinks: [
      {
        slug: 'booking-link-or-shared-calendar',
        label: 'Decide between a booking link and a shared calendar',
      },
      {
        slug: 'host-event-rsvp-page-with-qr-code-and-live-ics-feed',
        label: 'Need a fixed-date group invite instead? Publish an Event RSVP page',
      },
    ],
  },

  'host-event-rsvp-page-with-qr-code-and-live-ics-feed': {
    updated: '2026-11-13',
    seoTitle: 'Host an Event RSVP Page with QR Code & Live ICS Feed',
    title: 'How to Publish a Shareable Event RSVP Page (/event/) with QR Invites & Live ICS Updates',
    short: 'Event RSVP Pages, QR Codes & Live ICS',
    description:
      'Share a single event via URL or printable QR code, collect Going/Maybe/Declined RSVPs from any device without app signup, and keep guest calendars updated via live ICS.',
    lede: 'Sharing one workshop, dinner, club practice, or meetup should neither expose your entire calendar nor leave attendees staring at an outdated address when the venue changes. Cloud Calendars lets you publish a clean Event RSVP page (/event/) from either the iPhone/iPad app or Web Studio (/calendar/), complete with a scannable QR code, App Clip & mobile browser RSVP buttons (Going, Maybe, Declined), and a scoped live .ics subscription feed that updates only that event.',
    commonBelief:
      'Sending a static .ics attachment or messaging-chat screenshot is enough to keep guests updated when an event’s start time or venue changes.',
    sections: [
      {
        heading: 'Static .ics File Download vs Scoped Live Event Subscription',
        body: [
          'When a guest downloads a traditional one-off .ics file attachment, their calendar imports a disconnected snapshot: if you move the kickoff from 18:00 to 19:00 tomorrow, static downloads never hear about the change unless you email a revised RFC 5546 SEQUENCE update to every address.',
          'Every shared event in Cloud Calendars generates both a universal RSVP web page (/event/{shareId}) and a scoped single-event calendar feed containing only that VEVENT’s UID and current revision. Guests who add or subscribe to the live event stay isolated from the rest of your private schedule while receiving time, note, or location updates automatically.',
        ],
        table: {
          heading: 'Event Sharing Methods Compared',
          caption: 'How guests receive your invite and what happens when you move the time or venue',
          columns: ['Method', 'Exposes Other Calendar Events?', 'Guest Needs an Account?', 'Updates When Time Changes?'],
          rows: [
            {
              cells: [
                'Cloud Calendars /event/ RSVP Page + Scoped Live Feed',
                'No — strictly scoped to that single event',
                'No — works in any browser or iOS App Clip',
                'Yes — revised time/venue propagates to live subscribers & RSVP page',
              ],
            },
            {
              cells: [
                'Static .ics File Attachment in Chat or Email',
                'No',
                'No',
                'No — imported copy stays frozen at the old time unless re-imported',
              ],
            },
            {
              cells: [
                'Sharing a Full iCloud or Google Calendar',
                'Yes — reveals every event or busy block on that calendar',
                'Usually requires Apple ID or Google sign-in',
                'Yes, for everyone with full calendar access',
              ],
            },
          ],
        },
      },
      {
        heading: 'Publishing an Event RSVP Link & QR Code From Web Studio or iPhone',
        body: [
          'In Web Studio (/calendar/), create or click any event on your Personal Cloud Calendar and choose Share Event / RSVP Link. You immediately get a public /event/ URL plus a high-contrast QR code ready to paste onto slides, flyers, classroom boards, or group chats (WhatsApp, iMessage, Telegram, Slack).',
          'On iPhone or iPad, open any event inside Cloud Calendars and tap Share Event to generate the exact same QR code and RSVP link—plus hourly Apple WeatherKit temperature, wind, UV, and rain-probability context so you can check outdoor conditions before locking in a park, patio, or field time.',
        ],
      },
      {
        heading: 'Tracking Going, Maybe & Declined RSVPs Across Web and iOS',
        body: [
          'Visitors who scan your QR code or tap the /event/ link see the event title, localized date and time, map location, organizer notes, and one-tap Going, Maybe, or Declined response buttons—no app store install or account password required. On iPhone, Apple’s lightweight App Clip experience or mobile Safari handles the response in seconds.',
          'Every guest response syncs right back to your event’s attendee list in both Web Studio and your personal Cloud Calendars calendar on iPhone, giving you an accurate headcount in real time.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Create the event in Cloud Calendars Web Studio (/calendar/) or on your iPhone/iPad.',
      'Check the built-in Apple WeatherKit forecast on iPhone if the gathering is outdoors or weather-sensitive.',
      'Open the event and select Share Event / RSVP Page to generate your public /event/ URL and printable QR code.',
      'Post the link in your group chat or display the QR code on a poster or slide deck so guests can RSVP without creating an account.',
      'Edit the event directly in Web Studio or on iPhone if the room or start time shifts—the /event/ page and live feed update automatically.',
    ],
    faq: [
      {
        q: 'Can Android, Windows, and Mac users RSVP on a Cloud Calendars /event/ link?',
        a: 'Yes. Every /event/ URL renders a clean, ad-free responsive web page in Chrome, Safari, Edge, and Firefox on Android, Windows, macOS, and iOS, with universal Add to Calendar options for Google Calendar, Outlook, and Apple Calendar.',
      },
      {
        q: 'Can people who open my /event/ link see the rest of my personal calendar?',
        a: 'Never. Both the /event/ RSVP page and its scoped .ics feed expose strictly the single shared event—none of your other appointments, booking types, or private notes are accessible.',
      },
      {
        q: 'Is hosting /event/ RSVP pages included for $0 with the iOS app?',
        a: 'Yes. Pairing Web Studio with the Cloud Calendars iPhone or iPad app via QR code unlocks unlimited event editing, /event/ RSVP pages, QR codes, and /book/ scheduling links for $0.',
      },
    ],
    sourcesHeading: 'Calendar scheduling standards and references',
    sources: [
      {
        label: 'IETF RFC 5546: iCalendar Transport-Independent Interoperability Protocol (iTIP)',
        url: 'https://www.rfc-editor.org/rfc/rfc5546',
      },
      {
        label: 'Cloud Calendars Web Studio',
        url: 'https://www.cloud-calendars.com/calendar/',
      },
      {
        label: 'Cloud Calendars on the App Store',
        url: 'https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319',
      },
    ],
    relatedComparisons: [
      { slug: 'cloud-calendars-vs-luma-and-partiful', label: 'Cloud Calendars vs Luma & Partiful' },
      { slug: 'cloud-calendars-vs-doodle', label: 'Cloud Calendars vs Doodle' },
    ],
    seeAlso: [
      'sharing-one-event-not-your-calendar',
      'inviting-people-who-do-not-have-the-app',
      'keeping-track-of-who-replied',
      'planning-outdoors-without-being-rained-on',
    ],
    articleLinks: [
      {
        slug: 'sharing-one-event-not-your-calendar',
        label: 'Why sharing a single event beats exposing an entire calendar',
      },
      {
        slug: 'two-way-personal-cloud-calendar-sync-iphone-web',
        label: 'How guest RSVPs sync two-way between Web Studio and iPhone',
      },
    ],
  },
};
