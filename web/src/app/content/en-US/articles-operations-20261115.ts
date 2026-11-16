import type { LocalisedArticle } from '../types';

export const OPERATIONS_20261115_EN_US: Readonly<Record<string, LocalisedArticle>> = {
  'outlook-automatic-replies-out-of-office-auto-decline-meetings': {
    updated: '2026-11-15',
    seoTitle: 'Outlook Automatic Replies & Out-of-Office Auto-Decline',
    title:
      'Outlook Automatic Replies vs Out-of-Office Calendar Events: How Auto-Declining New and Existing Meetings Actually Works',
    short: 'Outlook Automatic Replies & Auto-Decline',
    description:
      'Learn the exact difference between Outlook Automatic Replies and an Out-of-Office calendar block, including how New vs Classic Outlook declines meetings.',
    lede:
      'Turning on Automatic Replies in Outlook does not automatically block your calendar or cancel conflicting meetings unless you enable the calendar checkboxes inside the new Outlook or Outlook on the web—whereas Classic Outlook for Windows handles mailbox auto-replies separately from calendar availability.',
    commonBelief:
      'Switching on Automatic Replies (Out of Office) in any Outlook app automatically marks your calendar Out of Office and declines meeting invitations while you are away.',
    comparison: {
      heading: 'Outlook Out-of-Office controls compared across clients',
      caption: 'What each Outlook setting changes on your mailbox, Scheduling Assistant, and existing meetings.',
      columns: ['Control', 'Sends email auto-reply?', 'Marks calendar Out of Office?', 'Auto-declines new invites?', 'Cancels/declines existing meetings?'],
      rows: [
        {
          cells: [
            'New Outlook / Web: Automatic replies (checkboxes off)',
            'Yes (once per sender per window)',
            'No',
            'No',
            'No',
          ],
        },
        {
          cells: [
            'New Outlook / Web: Automatic replies + "Block my calendar"',
            'Yes',
            'Yes (creates an Out of Office block)',
            'Optional checkbox ("Automatically decline new invitations")',
            'Optional checkbox ("Decline and cancel my meetings during this period")',
          ],
        },
        {
          cells: [
            'Classic Outlook (Windows): File → Automatic Replies',
            'Yes (Inside & Outside My Organization tabs)',
            'No — must create a separate calendar item',
            'Only via Inbox Rules, not a simple toggle',
            'No — decline manually on your calendar',
          ],
        },
        {
          cells: [
            'Calendar Event with Show As = Out of Office',
            'No mailbox auto-reply',
            'Yes (purple Out of Office bar in Scheduling Assistant)',
            'No automatic RSVP sent in Classic Outlook',
            'No',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'Why Colleagues Still Book Over Your Vacation When Only Email Auto-Replies Are Enabled',
        body: [
          'Exchange Online stores mailbox Automatic Replies (formerly Out of Office Assistant) and calendar Free/Busy items as two distinct mechanisms. If you turn on File → Automatic Replies in Classic Outlook for Windows—or toggle Automatic replies on Outlook mobile—without creating a calendar block, colleagues checking Scheduling Assistant still see wide-open white slots until after they send an invite and receive your automated email bounce.',
          'In New Outlook for Windows and Outlook on the web (Settings → Accounts → Automatic replies), Microsoft bridged that gap by adding three optional checkboxes beneath the start/end time range: Block my calendar for this period, Automatically decline new invitations for events that occur during this period, and Decline and cancel my meetings during this period.',
        ],
      },
      {
        heading: 'Internal vs External Auto-Reply Rules (and Why Each Sender Only Gets One Reply)',
        body: [
          'Exchange sends an Automatic Reply at most once to each unique sender address during a single Out-of-Office activation window so two auto-responders never trigger an infinite mail loop. If you extend your return date without toggling Automatic Replies off and back on, senders who already received your earlier message will not receive the updated return date.',
          'When enabling replies outside your organization, choose Contacts only if you want clients and vendors in your address book to see your return date without replying to newsletters, automated SaaS receipts, or cold outreach.',
        ],
      },
      {
        heading: 'Blocking External Booking Links Alongside Microsoft 365',
        body: [
          'If external clients book you through a scheduling link such as Cloud Calendars Web Studio (/book/), remember that booking engines inspect your calendar Free/Busy status—not your mailbox email responder. Creating an all-day or timed event marked Busy or Out of Office on your connected Outlook or Google Calendar immediately removes those vacation dates from your public booking slots while also appearing on your iPhone timeline.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Open New Outlook or Outlook on the web → Settings (gear) → Accounts → Automatic replies whenever you want one screen to set both email replies and calendar auto-decline.',
      'Turn on Send automatic replies only during a time period, then check Block my calendar for this period so Scheduling Assistant shows purple Out of Office bars immediately.',
      'Check Automatically decline new invitations—and selectively review existing recurring meetings before checking Decline and cancel my meetings during this period so you do not accidentally cancel a team meeting you organize.',
      'Under Send replies outside your organization, select Send replies only to contacts to avoid auto-replying to mailing lists and spam.',
    ],
    faq: [
      {
        q: 'If I organize a weekly recurring team meeting and check "Decline and cancel my meetings during this period," does it cancel the whole series?',
        a: 'Outlook targets only the occurrences falling inside your scheduled away window, but if your team still plans to meet without you, do not mass-cancel meetings you organize—leave that occurrence active or appoint a co-organizer instead.',
      },
      {
        q: 'Why did someone email me twice during my vacation and only get my Out of Office reply the first time?',
        a: 'By design, Exchange Online sends only one automatic reply per sender per Out-of-Office session to prevent mail loops. Toggling Automatic Replies off and back on resets the sent-history list.',
      },
    ],
    sourcesHeading: 'Official Microsoft Outlook documentation',
    sources: [
      {
        label: 'Microsoft Support — Send automatic out of office replies from Outlook',
        url: 'https://support.microsoft.com/en-us/office/send-automatic-out-of-office-replies-from-outlook-9742f476-5348-4f9f-997f-5e208513bd67',
      },
      {
        label: 'Microsoft Support — Manage your availability in your Outlook calendar',
        url: 'https://support.microsoft.com/en-us/office/manage-your-availability-in-your-outlook-calendar-fbbf6d5c-bdb8-4018-a2e0-2e2f60642117',
      },
    ],
    relatedComparisons: [
      { slug: 'work-exchange-microsoft-365-and-personal-icloud-iphone', label: 'Work Microsoft 365 + Personal iCloud on iPhone' },
      { slug: 'microsoft-bookings-vs-bookings-with-me-vs-cloud-calendars', label: 'Microsoft Bookings vs Cloud Calendars' },
    ],
    seeAlso: [
      'outlook-show-as-free-busy-tentative-working-elsewhere',
      'outlook-scheduling-assistant-read-colleague-availability',
      'create-public-booking-page-buffers-and-one-time-links',
    ],
  },

  'google-calendar-out-of-office-auto-decline-meetings-settings': {
    updated: '2026-11-15',
    seoTitle: 'Google Calendar Out of Office Auto-Decline Guide',
    title:
      'Google Calendar Out of Office Auto-Decline Rules: "New and Existing" vs "Only New Invitations" (Plus Personal Gmail Workarounds)',
    short: 'Google Calendar Out of Office Auto-Decline',
    description:
      'How Google Calendar Out of Office events auto-decline new vs existing meetings, why all-day blocks span midnight to midnight, and what personal Gmail users can do.',
    lede:
      'In Google Workspace accounts, an Out of office calendar entry automatically sends Decline RSVPs with a custom message—but choosing the wrong decline scope or leaving a partial-day trip set to All day can inadvertently decline evening or cross-time-zone meetings you intended to keep.',
    commonBelief:
      'Every Google Calendar account has an Out of office button, and creating an all-day event automatically declines incoming meeting invites.',
    comparison: {
      heading: 'Google Calendar ways to block away time compared',
      caption: 'Availability behavior across paid/school Google Workspace accounts and free @gmail.com accounts.',
      columns: ['Calendar entry type', 'Available on free @gmail.com?', 'Blocks Find a Time & Booking?', 'Auto-declines invites?', 'Default time span'],
      rows: [
        {
          cells: [
            'Out of office (New and existing meetings)',
            'No — Google Workspace only',
            'Yes (Busy)',
            'Yes — declines existing overlaps immediately + future invites',
            'Full 24-hour calendar days unless specific hours are set',
          ],
        },
        {
          cells: [
            'Out of office (Only new meeting invitations)',
            'No — Google Workspace only',
            'Yes (Busy)',
            'Declines newly arriving invites; keeps meetings already on your calendar',
            'Full 24-hour calendar days or custom start/end times',
          ],
        },
        {
          cells: [
            'Standard All-Day Event (Free / Busy toggle)',
            'Yes — all Google accounts',
            'Only if changed from default "Free" to "Busy"!',
            'No — guests see Busy, but invites still await manual RSVP',
            '00:00 to 24:00 in your calendar time zone',
          ],
        },
        {
          cells: [
            'Focus time (with auto-decline)',
            'No — qualifying Workspace editions only',
            'Yes (Busy)',
            'Optional auto-decline for heads-down blocks',
            'Timed block (for example 09:00–11:30)',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'The Critical Difference Between "New and Existing Meetings" and "Only New Invitations"',
        body: [
          'When you create an Out of office entry in Google Calendar on a work or school Google Workspace account, Google prompts you to choose between New and existing meetings and Only new meeting invitations. Selecting New and existing meetings immediately transmits a Declined RSVP—with your custom message—to every overlapping meeting already on your calendar, including 1-on-1s you meant to attend from the airport.',
          'If you have one or two high-priority calls you still plan to join while traveling, either split your Out of office block around those hours or choose Only new meeting invitations and manually decline the specific existing meetings you will miss.',
        ],
      },
      {
        heading: 'Why Personal @gmail.com Users Do Not See "Out of Office" (and the All-Day "Free" Trap)',
        body: [
          'Google restricts the dedicated Out of office and Focus time event types to managed Google Workspace work and school editions. On a standard @gmail.com account, people usually create an all-day event titled "Vacation"—unaware that Google Calendar defaults all-day events to Free (transparent) rather than Busy.',
          'Because an all-day event marked Free does not block availability, external scheduling pages (Google Appointment Schedules, Calendly, or Cloud Calendars /book/ links) will happily let clients book right over your holiday! Always open event details on personal Gmail vacation banners and switch availability from Free to Busy.',
        ],
      },
      {
        heading: 'Cross-Account Busy Blocking Across Gmail, Outlook, and iPhone',
        body: [
          'If you consult across both a personal Gmail calendar and a client Microsoft 365 calendar, setting Out of office on one account does not stop bookings on the other unless your scheduling page checks both providers simultaneously. Connecting both Google Calendar and Microsoft Outlook inside Cloud Calendars Web Studio (/calendar/) ensures a Busy or Out of office block on either account automatically closes those slots on your public /book/ page.',
        ],
      },
    ],
    claims: {},
    practical: [
      'On Google Workspace (desktop web or mobile app), click Create → Out of office and verify exact start and end times rather than leaving a half-day flight set to All day.',
      'Choose Only new meeting invitations if you want to keep one or two existing calls during your trip, or New and existing meetings for a complete disconnect.',
      'On a personal @gmail.com account (where Out of office is unavailable), create a multi-day event and explicitly change the briefcase availability dropdown from Free to Busy.',
      'Turn on Gmail Vacation Responder separately in Gmail Settings if you also want incoming emails to receive an automated away reply.',
    ],
    faq: [
      {
        q: 'Does creating a Google Calendar Out of office event also turn on Gmail automatic email replies?',
        a: 'No. Unlike New Outlook (which combines both on one settings page), Google keeps Calendar Out of office meeting auto-decline separate from Gmail’s Vacation responder.',
      },
      {
        q: 'Why did my all-day "Vacation" event on personal Google Calendar still allow someone to book a call with me?',
        a: 'Google Calendar defaults new all-day events to Free instead of Busy. Edit the all-day event and change Free to Busy so conflict checkers and booking pages block the entire day.',
      },
    ],
    sourcesHeading: 'Official Google Calendar documentation',
    sources: [
      {
        label: 'Google Calendar Help — Indicate when you’re out of the office',
        url: 'https://support.google.com/calendar/answer/7638168',
      },
      {
        label: 'Google Calendar Help — Change your availability status & mute notifications',
        url: 'https://support.google.com/calendar/answer/37161',
      },
    ],
    relatedComparisons: [
      { slug: 'cloud-calendars-vs-google-appointment-schedules', label: 'Cloud Calendars vs Google Appointment Schedules' },
      { slug: 'merge-icloud-google-outlook-exchange-calendars-iphone', label: 'Merge iCloud, Google & Outlook on iPhone' },
    ],
    seeAlso: [
      'google-calendar-working-hours-location-out-of-office-focus-time',
      'what-an-all-day-event-really-means',
      'create-public-booking-page-buffers-and-one-time-links',
    ],
  },

  'outlook-room-finder-book-conference-room-workspace': {
    updated: '2026-11-15',
    seoTitle: 'Outlook Room Finder: Why Rooms Auto-Decline & How to Book',
    title:
      'Outlook Room Finder & Conference Room Mailboxes: How Auto-Accept Works and Why Recurring Series Get Declined',
    short: 'Outlook Room Finder & Recurring Room Declines',
    description:
      'Master Outlook Room Finder for Microsoft 365 conference rooms and workspaces, and fix the 180-day booking window or conflict rules that reject recurring meetings.',
    lede:
      'Every Microsoft 365 conference room is actually an Exchange Online resource mailbox running an automated booking attendant—which is why a single conflicting future date or Exchange’s default 180-day booking horizon can make a room instantly decline your entire weekly meeting series.',
    commonBelief:
      'Typing a conference room name into the plain-text Location box reserves the room, and if a room declines a weekly series it must already be booked every single week.',
    comparison: {
      heading: 'Why an Exchange Online room mailbox declines a meeting invite',
      caption: 'Default Exchange Online CalendarProcessing policies behind automated room rejections.',
      columns: ['Rejection symptom', 'Exchange resource policy behind it', 'Typical default limit', 'Fastest organizer fix'],
      rows: [
        {
          cells: [
            'Weekly "No end date" meeting immediately declined by the room',
            'BookingWindowInDays & EnforceSchedulingHorizon',
            '180 days (approx. 6 months)',
            'Set an explicit recurrence end date within 180 days (e.g., end of quarter)',
          ],
        },
        {
          cells: [
            '12-week series declined even though this Tuesday is free',
            'AllowConflicts ($false) / MaximumConflictInstances',
            '0 conflicts allowed by default',
            'Book the series without the room on the 1 busy week, or pick an alternate room for that single occurrence',
          ],
        },
        {
          cells: [
            'All-day offsite workshop declined by the boardroom',
            'MaximumDurationInMinutes',
            '1,440 minutes (24 hours) — multi-day spans exceed 24h!',
            'Book separate daily timed blocks (e.g., 08:30–17:30 each day) instead of a 3-day banner',
          ],
        },
        {
          cells: [
            'Room accepts for VPs, sends "Tentative / Pending approval" for others',
            'BookInPolicy / RequestInPolicy delegate moderation',
            'Configured on executive boardrooms',
            'Wait for the room delegate’s approval or pick an auto-accept room in Room Finder',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'Plain-Text Location vs Adding an Actual Room Mailbox',
        body: [
          'Typing "3rd Floor Boardroom" manually into an event’s Location field writes a simple text string—it never sends an invitation to the room’s Exchange mailbox, so anyone else can reserve the room right underneath you. Always select the room from the directory dropdown or open Room Finder alongside Scheduling Assistant so the room’s email address appears as a resource attendee and returns an Accepted confirmation email.',
        ],
      },
      {
        heading: 'How to Rescue a Recurring Series Rejected by the 180-Day Booking Window',
        body: [
          'By default, Exchange Online sets BookingWindowInDays to 180 days with EnforceSchedulingHorizon enabled on every new room mailbox. Whenever an organizer creates a weekly team standup with "No end date" (or a 1-year range) and attaches a conference room, the room’s automated Calendar Attendant rejects the entire series within seconds.',
          'Fix it immediately without calling IT: set the recurring meeting’s End by date to 24 weeks (under 180 days) from today, or schedule the people series indefinitely first and book the physical room one quarter at a time.',
        ],
      },
      {
        heading: 'Fixing a Single Busy Week Without Losing the Room for the Other 11 Weeks',
        body: [
          'When a room declines because another team already reserved it on week 7 of a 12-week quarter, check the room’s automated decline email—Exchange lists the exact conflicting date(s) inside the message body. Open Scheduling Assistant, book the 12-week series in that room while excluding or moving just the conflicting date, and attach a backup room to that single occurrence.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Always pick conference rooms from the directory or Room Finder (filter by building, floor, capacity, and AV features) rather than typing a free-text room name.',
      'Wait for the room mailbox’s automated Accepted email—if it returns Declined, read the body of that bounce email to see whether the cause was the 180-day horizon or specific conflicting dates.',
      'Cap room-attached recurring meetings at 3–6 months (under 180 days) so Exchange’s default BookingWindowInDays policy accepts them cleanly.',
      'For multi-day workshops, schedule daily timed blocks (08:30–17:30 repeating for 3 days) instead of a single 72-hour span that trips the 1,440-minute duration cap.',
    ],
    faq: [
      {
        q: 'Why does Room Finder show "No rooms available" even when I know rooms in my office are empty?',
        a: 'In New Outlook and Outlook on the web, Room Finder filters rooms by Microsoft Places / Exchange Room Lists (buildings and cities). Make sure a Building filter is selected—if your IT admin has not grouped room mailboxes into a Room List (`DistributionGroup -RoomList`), rooms only appear when searched by name in the Location bar.',
      },
      {
        q: 'If I move one occurrence of a recurring meeting to a new hour, does the conference room automatically move too?',
        a: 'Yes—when you edit "This event only," Outlook sends an updated request for that single instance to the room mailbox. Watch your inbox to confirm the room replies Accepted for the new hour and does not decline that moved instance due to a conflict.',
      },
    ],
    sourcesHeading: 'Official Microsoft Outlook & Exchange Online documentation',
    sources: [
      {
        label: 'Microsoft Support — Use the Scheduling Assistant and Room Finder for meetings in Outlook',
        url: 'https://support.microsoft.com/en-us/outlook/use-the-scheduling-assistant-and-room-finder-for-meetings-in-outlook',
      },
      {
        label: 'Microsoft Learn — Create and manage room mailboxes in Exchange Online',
        url: 'https://learn.microsoft.com/en-us/exchange/recipients-in-exchange-online/manage-resource-mailboxes',
      },
    ],
    relatedComparisons: [
      { slug: 'cloud-calendars-vs-microsoft-outlook-mobile', label: 'Cloud Calendars vs Microsoft Outlook Mobile' },
      { slug: 'work-exchange-microsoft-365-and-personal-icloud-iphone', label: 'Work Microsoft 365 + Personal iCloud on iPhone' },
    ],
    seeAlso: [
      'calendar-event-or-room-reservation',
      'outlook-scheduling-assistant-read-colleague-availability',
      'outlook-end-recurring-meeting-early-keep-history',
    ],
  },

  'teams-channel-calendar-meeting-invite-all-members-vs-selected': {
    updated: '2026-11-15',
    seoTitle: 'Teams Channel Meetings: Who Gets a Calendar Invite?',
    title:
      'Microsoft Teams Channel Meetings Explained: Why They Email Everybody (or Miss Personal Outlook & iPhone Calendars)',
    short: 'Teams Channel Meetings & Personal Calendars',
    description:
      'Understand who actually receives an Outlook and iPhone calendar invite when you schedule a Microsoft Teams channel meeting versus inviting specific attendees.',
    lede:
      'Adding a Microsoft Teams channel to a meeting posts the join banner in the channel and places the event on the underlying Microsoft 365 Group calendar—but whether all 150 channel members receive personal inbox invites and see the meeting on their iPhone calendars depends on two hidden rules.',
    commonBelief:
      'Scheduling a meeting inside a Microsoft Teams channel automatically puts it on every channel member’s personal Outlook and iPhone calendar without emailing the whole group.',
    comparison: {
      heading: 'How Teams meeting types deliver invites and block personal calendars',
      caption: 'Behavior across standard Teams meetings, public/standard channel meetings, and shared/private channels.',
      columns: ['How you schedule it', 'Posts in channel feed & recordings?', 'Emails every channel member?', 'Lands on personal Outlook & iPhone calendar?'],
      rows: [
        {
          cells: [
            'Standard Teams meeting (no channel, Required attendees listed)',
            'No — private meeting chat only',
            'Only listed attendees',
            'Yes, for every listed attendee',
          ],
        },
        {
          cells: [
            'Channel meeting (no individual Required attendees; Group subscription OFF)',
            'Yes — channel post, shared notes & recording',
            'No personal inbox invite sent!',
            'No — stays on the Group/Channel calendar unless a member manually clicks Add to calendar',
          ],
        },
        {
          cells: [
            'Channel meeting (Group "Send copies to members’ inboxes" ON)',
            'Yes — channel post & recording',
            'Yes — emails every member of the Team!',
            'Yes — lands in every member’s inbox and personal calendar',
          ],
        },
        {
          cells: [
            'Channel meeting + 5 specific Required attendees added',
            'Yes — visible to all channel members to join',
            'Guaranteed personal invite to the 5 named attendees (+ subscribed group members)',
            'Guaranteed on those 5 personal calendars',
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'Why Two Teams in the Same Company Behave Completely Differently',
        body: [
          'Every standard Microsoft Team is backed by a Microsoft 365 Group mailbox. When that Group has Follow in inbox / Send copies of team emails and events to team members’ inboxes enabled (`AutoSubscribeNewMembers` in Exchange Online), scheduling any channel meeting blasts an `.ics` invitation to every member of the Team—even if the Team has 400 people.',
          'Conversely, in larger Teams where IT or the Team owner disabled inbox copies to cut email noise, scheduling a channel meeting with the Required attendees line left blank posts quietly in the Teams channel and on the Channel calendar tab—meaning nobody receives an Outlook invite, and the meeting never syncs to anyone’s iPhone calendar unless they open the channel post and click Add to calendar.',
        ],
      },
      {
        heading: 'How to Invite Only 6 People While Keeping Recording & Notes in the Channel',
        body: [
          'When a project sub-group wants the meeting recording, transcript, and collaborative notes saved automatically inside a Teams channel without requiring 80 bystanders to attend, check whether your Team broadcasts group events first. Add the 6 required speakers explicitly on the Required attendees line so it blocks their personal Outlook and iPhone schedules, and state "[Optional / Open Channel Sync]" in the title if your Team’s group subscription setting emails everyone.',
          'Note that Private channels and Shared channels in Microsoft Teams do not currently have a full Microsoft 365 Group mailbox behind them, so scheduled channel meetings are supported only in Standard channels.',
        ],
      },
      {
        heading: 'Sharing Optional Team Events Without Microsoft 365 Group Clutter',
        body: [
          'For cross-company town halls, community office hours, or client workshops where external participants are not members of your internal Teams tenant, publishing a Cloud Calendars Event RSVP page (/event/) or live `.ics` subscription feed lets anyone scan a QR code or click once to add the session—with automatic time-zone conversion and live rescheduling updates—directly to their iPhone, Google, or Outlook calendar.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Always add must-attend presenters and decision-makers explicitly to Required attendees on a Teams channel meeting so it is guaranteed to block their personal Outlook and iPhone calendars.',
      'Before scheduling in a 100+ person Team, check Outlook → Groups → Group Settings to see whether members are subscribed to receive all group events in their inbox.',
      'Add the Channel calendar tab inside key Teams channels so optional teammates can browse upcoming sessions and click Add to calendar on the ones they want.',
      'Remember that Private and Shared Teams channels do not support scheduled channel meetings—use a Standard channel or a regular attendee-list meeting instead.',
    ],
    faq: [
      {
        q: 'Why didn’t a Teams channel meeting show up on my iPhone calendar?',
        a: 'iPhone calendar apps (including Cloud Calendars, Apple Calendar, and Outlook Mobile) sync your personal Exchange calendar by default—not unsubscribed Microsoft 365 Group calendars. Open the meeting post inside the Teams channel and tap Add to calendar so it copies onto your personal calendar.',
      },
      {
        q: 'Can I add a Teams channel to an existing meeting after I already sent the invite?',
        a: 'No. Microsoft Teams locks the channel field once a meeting is created. To move a private meeting into a channel, cancel the original invite and create a new meeting with the channel selected from the start.',
      },
    ],
    sourcesHeading: 'Official Microsoft Teams & Group calendar documentation',
    sources: [
      {
        label: 'Microsoft Support — Schedule a meeting in a Microsoft Teams channel',
        url: 'https://support.microsoft.com/en-us/office/schedule-a-meeting-in-a-teams-channel-eb571219-517b-49bf-afe1-4fff091efa85',
      },
      {
        label: 'Microsoft Support — Schedule a meeting on a group calendar in Outlook',
        url: 'https://support.microsoft.com/en-us/office/schedule-a-meeting-on-a-group-calendar-in-outlook-09dc661d-3386-4557-bc8b-90a988a58656',
      },
    ],
    relatedComparisons: [
      { slug: 'work-exchange-microsoft-365-and-personal-icloud-iphone', label: 'Work Microsoft 365 + Personal iCloud on iPhone' },
      { slug: 'cloud-calendars-vs-luma-and-partiful', label: 'Cloud Calendars Event RSVPs vs Luma & Partiful' },
    ],
    seeAlso: [
      'outlook-group-calendar-versus-shared-calendar',
      'outlook-teams-meeting-button-missing',
      'host-event-rsvp-page-with-qr-code-and-live-ics-feed',
    ],
  },
};
