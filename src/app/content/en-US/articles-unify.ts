import { LocalisedArticle } from '../types';

/**
 * The multi-account articles, in English.
 *
 * Two of the tracked prompts are about merging calendars, and both are written
 * as complaints rather than feature requests — "I am tired of switching between
 * three apps" is a person describing a symptom. These answer the complaint
 * first and mention the tiers second, which is the order the reader is in.
 */
export const UNIFY_EN_US: Readonly<Record<string, LocalisedArticle>> = {
  'icloud-google-and-outlook-in-one-view': {
    title: 'iCloud, Google and Outlook in one view',
    short: 'Three accounts, one view',
    description:
      "Most people's life is split across a personal Apple calendar, a Google account and a work Exchange one. Here is what putting them in a single grid actually changes.",
    lede: 'The problem is rarely that any one calendar is bad. It is that you have three of them and only one week.',
    commonBelief:
      'That keeping work and personal calendars in separate apps is a boundary rather than a bug.',
    sections: [
      {
        heading: 'The double-booking is structural',
        body: [
          'If your commitments live in three places, no single place can tell you whether you are free. You are the merge step, and you run it from memory, usually while somebody is waiting for an answer.',
          'This is why the classic failure is not forgetting an event; it is agreeing to something that collides with an event you could not see.',
        ],
      },
      {
        heading: 'What one grid gives you',
        body: [
          'Every account on the same week, colour-coded by origin, editable in place. You stop asking which app has the answer, because the question stops having a plural.',
          'The separation people actually want is visual, not structural. Seeing work in one colour and family in another gives you the boundary without giving up the overview.',
        ],
      },
      {
        heading: 'Where the tiers sit',
        body: [
          'iCloud and Google both sync on the free tier. Microsoft accounts — Outlook and Exchange — sit in the paid tier, because that connection carries a running cost that the others do not.',
          'If your work calendar is Google, you will never need to pay for sync at all.',
        ],
      },
    ],
    claims: {
      accounts: 'Account types that can share one view',
      premiumMonthly: 'Monthly cost of adding Microsoft, in dollars',
    },
    practical: [
      'Add the personal account first, then the one that causes the collisions.',
      'Colour by account rather than by category — origin is what you need at a glance.',
      'Keep writing to whichever calendar the other people involved already read.',
    ],
    seeAlso: ['three-calendar-apps-is-two-too-many', 'exchange-calendars-on-an-iphone'],
  },

  'three-calendar-apps-is-two-too-many': {
    title: 'Three calendar apps is two too many',
    short: 'Three apps is two too many',
    description:
      'Switching between calendar apps is not a workflow, it is a tax. What it costs and what replacing it looks like.',
    lede: 'Nobody chose to keep three calendar apps. It happened one account at a time, and each addition seemed reasonable.',
    commonBelief:
      'That switching apps is a minor inconvenience rather than the source of the actual problem.',
    sections: [
      {
        heading: 'The cost is not the tapping',
        body: [
          'Two seconds of switching is nothing. The cost is that you answer scheduling questions from partial information, because checking all three every time is more effort than the question seems to deserve.',
          "So you answer from the one you have open, and correct later. The correction is the expensive part, and it lands on somebody else's calendar too.",
        ],
      },
      {
        heading: 'What actually has to be true',
        body: [
          'One place has to be able to say yes or no about your time. That is the whole requirement, and it is not met by any arrangement where the answer lives in more than one app.',
          'Everything else — which app, which colours, which views — is preference. This one is structural.',
        ],
      },
    ],
    claims: {
      accounts: 'Account types one view can hold',
    },
    practical: [
      'Pick the app that can hold all your accounts, not the one you like most on its own.',
      'Migrate by adding accounts, not by moving events; the events stay where they are.',
      'Delete the other apps once the view is complete, or you will keep checking them.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view', 'what-calendar-sync-actually-does'],
  },

  'what-calendar-sync-actually-does': {
    updated: '2026-10-21',
    "title": "Calendar sync on iPhone: accounts, subscriptions and missing events",
    "short": "Calendar sync explained",
    "description": "Understand calendar sync, read-only subscriptions and local events. Trace one event between iPhone and iPad before changing accounts or deleting duplicates.",
    "lede": "A missing appointment can mean the wrong account, a hidden calendar, an old imported copy or a connection problem. First identify where the event belongs. This guide is written by Arte Soft, the developer of Cloud Calendars.",
    "commonBelief": "Seeing the same events in two apps means those apps have merged their calendars, and every event must be stored online.",
    "sections": [
        {
            "heading": "Start with the calendar that owns the event",
            "body": [
                "An account, a calendar and a calendar app are different things. Your Google account can contain several calendars; an app can display several accounts. Showing them in one week does not move all their events into one shared calendar.",
                "Open an event and inspect its calendar name and account. A work appointment can belong to a work Google calendar while a family appointment belongs to iCloud. A local calendar can instead belong to the device. The correct next step depends on this destination, not on which app you used to create the event."
            ]
        },
        {
            "heading": "Four connections that can look similar",
            "body": [
                "A provider account connects to calendars held by a service such as iCloud, Google or Microsoft. Whether you can change a particular calendar depends on your permission. Having connected an account does not make a calendar shared with you editable.",
                "A subscribed calendar feed is a continuing, normally read-only view published by someone else. Apple describes external subscription calendars as read-only. A sports schedule or holiday feed is a useful example: follow the published schedule rather than expecting your edits to change its source.",
                "Importing a calendar file creates a copy rather than a continuing relationship with the original file. Ask whether the operation says import or subscribe before relying on future updates. A URL ending in .ics alone is not enough to determine what the app will do with it.",
                "An app account is a separate identity used for that app’s services. It is not proof that your provider calendars are connected. Cloud Calendars also supports local calendars on the device; provider connections and sharing have their own sign-in requirements."
            ]
        },
        {
            "heading": "Run a small two-device sync check",
            "body": [
                "Use a harmless new test event with a distinctive name, such as Calendar connection check. Choose the intended writable calendar explicitly. On the second device, confirm the same provider account and calendar are selected, then look for that exact event.",
                "Change only the test event’s title on the second device and check the first again. This separates seeing an existing copy from successfully writing back. Record which direction fails and whether the provider’s own calendar shows the change. Do not use a real invitation or an important recurring meeting for this check.",
                "The result is diagnostic, not a speed benchmark. Network access, account permissions, refresh behavior and organisation policies can affect it. No fixed number of seconds proves that every calendar connection is healthy."
            ]
        },
        {
            "heading": "Separate hidden, absent and read-only calendars",
            "body": [
                "A calendar listed but unchecked is hidden. A calendar absent from the account list needs a different check: verify the signed-in identity, that access was granted to that identity, and whether the account connection includes that calendar.",
                "Google’s iPhone help explains how to show or hide subscribed calendars and how to open a calendar shared by email. It separately says that subscribing to a new calendar requires a computer browser. These are distinct operations; do not assume every missing-calendar problem needs a desktop or that accepting an email fixes every connection.",
                "An event that appears but cannot be edited may be working correctly under read-only permissions. Request the appropriate access from the owner if editing is necessary. Repeatedly reconnecting an account will not grant permissions that its owner has not given."
            ]
        },
        {
            "heading": "Investigate duplicates without deleting the source",
            "body": [
                "Two similar events may be two records, or one source calendar displayed through two routes. Inspect both entries: compare calendar, account, organiser, start time and recurrence before deciding which explanation fits.",
                "Temporarily hide one calendar to see which copy disappears. Hiding changes visibility; deleting an event can change the underlying calendar for other devices and participants. Do not delete an account, cancel a meeting or erase local data as a first troubleshooting step.",
                "If you imported the same file more than once, preserve a backup and identify the imported destination before cleaning anything. A recurring series needs particular care because changing one occurrence and changing the whole series have different consequences."
            ]
        },
        {
            "heading": "Where Cloud Calendars fits",
            "body": [
                "Cloud Calendars brings calendar views and weather together on iPhone and iPad. The Base plan includes Google Calendar sync, multiple views, weather and Home Screen widgets. Advanced removes ads; Premium adds Microsoft Calendar and Teams support. Check current local subscription prices before purchasing.",
                "Use the app to see your selected calendars together while keeping their ownership clear. This is not a promise to bypass workplace restrictions or turn every read-only feed into an editable calendar. Local calendars, provider calendars and shared content should be checked according to their actual connection."
            ]
        }
    ],
    "claims": {},
    "practical": [
        "Inspect the missing event’s calendar and owning account before changing any connection.",
        "Check whether the calendar is listed but hidden, absent, read-only, or an imported copy.",
        "Select the same account and calendar on both devices.",
        "Create and rename one disposable test event in both directions; check the provider’s own view when available.",
        "For duplicates, hide one source temporarily and compare ownership before deleting anything.",
        "If you need help, report the affected calendar type and failing direction without sending private event details or secret calendar URLs."
    ],
    "faq": [
        {
            "q": "Does combining Google and iCloud calendars move my events?",
            "a": "Displaying both calendars together does not itself move events. Check the destination calendar when creating or moving an event; that calendar determines ownership and access."
        },
        {
            "q": "Why can I see a subscribed calendar but not edit it?",
            "a": "An external calendar subscription is normally read-only. Its owner publishes the schedule. Editing requires a writable calendar and the appropriate permission, not just a subscription link."
        },
        {
            "q": "Will a local calendar appear on my other iPhone automatically?",
            "a": "Do not assume that it will. Local storage is different from a connected provider account. Verify the calendar’s connection and use a disposable test event before relying on another device."
        },
        {
            "q": "Should I delete and add my account again?",
            "a": "First check identity, calendar selection, permissions and the provider’s own view. Reconnection may be relevant later, but deleting local data or an account can complicate diagnosis and should not be the first step."
        }
    ],
    "sourcesHeading": "Sources and further reading",
    "sources": [
        {
            "label": "Apple: Set up multiple calendars on iPhone",
            "url": "https://support.apple.com/guide/iphone/use-multiple-calendars-iph3d1110d4/ios"
        },
        {
            "label": "Google: Subscribe to someone else’s calendar — iPhone and iPad",
            "url": "https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform%3DiOS"
        }
    ],
    "seeAlso": [
        "when-two-calendars-disagree",
        "icloud-google-and-outlook-in-one-view",
        "why-a-shared-calendar-does-not-appear"
    ]
},

  'work-and-personal-without-two-apps': {
  "updated": "2026-10-21",
  "title": "Work and personal calendars in one app: keep ownership separate",
  "short": "Work and personal, one app",
  "description": "See work and personal calendars together without merging ownership. Check permissions, event destinations and Cloud Calendars plans before connecting accounts.",
  "lede": "An overview can help you spot clashes without moving family appointments into a work account. Keep the calendars separate underneath, and choose which ones to display together. This guide is written by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "Putting work and personal calendars in one app also combines their sharing permissions.",
  "sections": [
    {
      "heading": "An overview is different from shared access",
      "body": [
        "A calendar app can display selected calendars together while each keeps its own account and permissions. Apple’s multiple-calendar guide describes choosing calendars to display, assigning colours and selecting a default calendar. Those display choices are not a transfer of event ownership.",
        "Before connecting a work account, check your organisation’s requirements. Google documents that administrators can restrict calendar sharing. A convenient personal overview does not give you permission to publish work details or bypass account restrictions."
      ]
    },
    {
      "heading": "Use colour and visibility for the overview",
      "body": [
        "Give work and personal calendars distinct colours, then check a busy day with both visible. When you want a narrower view, hide a calendar rather than deleting its events. Apple’s duplicate-calendar guide explains how to show and hide calendars with checkboxes.",
        "Hiding is a display choice. It is not a change to who can access the calendar, and you should check notification settings separately if the goal is a quiet evening. Keep an approved work app available if your organisation requires it."
      ]
    },
    {
      "heading": "Check the destination before saving",
      "body": [
        "A default calendar is a useful starting point, not a guarantee that every appointment belongs there. For a personal appointment, check the selected calendar before saving. For a work meeting, use the work calendar and the organisation’s invitation process.",
        "Do not move or copy an invitation simply to make it appear in your overview. Microsoft distinguishes events you created from meetings organised by someone else: changing your own displayed copy is not a reliable way to update the organiser or attendees. Keep the original invitation and ask the organiser about a time change."
      ]
    },
    {
      "heading": "What the Cloud Calendars plans add",
      "body": [
        "Cloud Calendars supports calendar views on iPhone and iPad. Its Base plan includes Google Calendar sync and the multi-calendar view. Advanced adds ad removal; Premium adds Microsoft Calendar and Teams support. Current local prices are shown in the app and App Store.",
        "Advanced is not a paid permission to manage every account. A subscription does not make a read-only calendar writable or override workplace policy. Local calendars can be used without an account; provider connections and sharing have their own sign-in requirements."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Check whether your workplace permits the account connection.",
    "Choose distinct colours and display the calendars you need for an overview.",
    "Verify the destination calendar when creating a new event.",
    "Hide a calendar temporarily to narrow the view; do not delete events to tidy it.",
    "Review sharing permissions and notifications separately from calendar visibility."
  ],
  "faq": [
    {
      "q": "Will my employer see my personal events just because both calendars are in one app?",
      "a": "Displaying calendars together does not itself grant calendar-sharing permission. Check which account owns each event, its sharing settings and any employer device-management rules. Do not save a private appointment to a work calendar by accident."
    },
    {
      "q": "Do I need Advanced to see Google and personal calendars together?",
      "a": "Google Calendar sync and the multi-calendar view are Base features. Advanced removes ads. Microsoft Calendar support is part of Premium; account permissions still apply."
    }
  ],
  "sourcesHeading": "Sources and further reading",
  "sources": [
    {
      "label": "Apple: Set up multiple calendars on iPhone",
      "url": "https://support.apple.com/guide/iphone/use-multiple-calendars-iph3d1110d4/ios"
    },
    {
      "label": "Apple: If you have duplicate events on your iCloud Calendar",
      "url": "https://support.apple.com/en-us/102180"
    },
    {
      "label": "Google: Choose what others can do with your calendar",
      "url": "https://support.google.com/calendar/answer/15716974?hl=en"
    },
    {
      "label": "Microsoft: Change an appointment, meeting, or event in Outlook",
      "url": "https://support.microsoft.com/en-us/outlook/calendar/change-an-appointment-meeting-or-event-in-outlook"
    }
  ],
  "seeAlso": [
    "what-calendar-sync-actually-does",
    "when-two-calendars-disagree"
  ]
},

  'exchange-calendars-on-an-iphone': {
    title: 'Getting an Exchange work calendar onto your iPhone properly',
    short: 'Exchange on an iPhone',
    description:
      'Work calendars that live in Microsoft behave differently from Google and iCloud ones. What to expect, and what it costs.',
    lede: "Microsoft calendars are the ones most likely to be someone else's rules rather than yours, and that changes what a calendar app can do with them.",
    commonBelief: 'That an Exchange calendar is just another account to add.',
    sections: [
      {
        heading: 'Your employer is a participant',
        body: [
          'Exchange and Outlook calendars come with policy. What you can see, whether you can share, whether an external app may connect at all — these are decided by an administrator, not by you or by the app.',
          'When a connection is refused it is usually policy rather than a fault, and no amount of retrying changes it.',
        ],
      },
      {
        heading: 'What it costs and why',
        body: [
          'Microsoft sync sits in the top tier. That is not arbitrary: the connection carries a running cost per account that iCloud and Google do not.',
          'Yearly works out cheaper than monthly if you already know this is how your work calendar lives.',
        ],
      },
    ],
    claims: {
      premiumMonthly: 'Monthly cost, in dollars',
      premiumYearly: 'Yearly cost, in dollars',
    },
    practical: [
      'Check with whoever runs your mail before assuming a connection problem is the app.',
      'If policy blocks external apps, a published read-only link is sometimes allowed where full sync is not.',
      'Add work last, once the personal accounts are behaving.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view', 'what-calendar-sync-actually-does'],
  },

  'when-two-calendars-disagree': {
  "updated": "2026-10-21",
  "title": "When calendar events disagree: check ownership before editing",
  "short": "When calendars disagree",
  "description": "Different times or duplicate events? Check the owning calendar, time zone and provider view, then hide one source before making changes or deleting anything.",
  "lede": "If an appointment shows two different times, pause before changing either copy. First establish whether you are looking at the same event, two separate records or one event displayed differently. This guide is written by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "Every calendar service resolves competing edits by keeping whichever change arrived last.",
  "sections": [
    {
      "heading": "Record the difference before trying to fix it",
      "body": [
        "Open both entries and compare the account, calendar name, organiser, date, time zone and recurrence. A matching title alone does not establish that two entries are the same record. Note which device or app shows each version without sharing private event details.",
        "Check the provider’s own calendar view when available, using the same account. For iCloud, Apple recommends checking service status, account consistency and device date and time. Refresh through the relevant app’s supported controls before deciding a saved change has been lost."
      ]
    },
    {
      "heading": "There is no universal conflict rule",
      "body": [
        "Concurrent edits, old local data, permissions and provider-specific behaviour can lead to different symptoms. Do not assume the newest-looking copy is authoritative or that one more edit will repair the connection.",
        "Microsoft’s support article about an Outlook Desktop conflict describes a case where the conflict was local and the server copy was unaffected. It documents a specific issue and fix, not a rule for Google, iCloud or Cloud Calendars. Follow guidance for your actual provider and client version rather than applying its repair steps everywhere."
      ]
    },
    {
      "heading": "Hide first when two entries look duplicated",
      "body": [
        "Temporarily hide one calendar and observe which entry disappears. Apple documents calendar checkboxes for this purpose. Restore visibility afterward so you do not mistake a hidden appointment for missing data.",
        "Two entries may be independent records, imported copies or the same source shown through different connections. Deleting one does not always delete both; deleting a source event can nevertheless affect other devices or people. Establish ownership and preserve needed information before any cleanup. Avoid cancelling a meeting, removing an account or clearing local storage as an initial diagnostic step."
      ]
    },
    {
      "heading": "Confirm who is allowed to change the event",
      "body": [
        "Google distinguishes viewing permission from editing permission; some editing permissions exclude private events, and work administrators can restrict settings. Being able to see an appointment does not prove you can correct it.",
        "For an Outlook meeting organised by someone else, Microsoft warns that moving your copy does not notify the organiser and can leave your calendar showing the wrong time. Ask the organiser to confirm the intended schedule. For a recurring meeting, identify whether the discrepancy concerns one occurrence or the series."
      ]
    },
    {
      "heading": "Make a controlled correction only after diagnosis",
      "body": [
        "If you own the event or have the required permission, confirm the intended details, make one correction from one client, then check the provider view and other device. If it fails again, stop repeating edits and report the affected client, account type and error to the provider or administrator.",
        "For a separate connection check, use a disposable event in a calendar you own rather than experimenting on an important invitation. This is a suggested diagnostic workflow, not a runtime test performed by us or a promise about how quickly changes will arrive."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Compare account, calendar, organiser, time zone and recurrence for both entries.",
    "Check the same account in the provider’s own view when available.",
    "Temporarily hide one calendar to trace duplicates; restore it after checking.",
    "Confirm ownership and edit permissions before changing an invitation.",
    "Make one authorised correction and verify it; seek provider-specific help if the disagreement returns."
  ],
  "faq": [
    {
      "q": "Should I delete the duplicate event?",
      "a": "First determine whether the entries are independent records or two views of the same source. Hide a calendar temporarily to trace them. Deletion can affect the underlying calendar and other participants; it is not a safe first diagnostic step."
    },
    {
      "q": "Does the last edit always win?",
      "a": "Do not rely on that rule across providers and clients. Check the owning calendar, permissions and the provider’s current troubleshooting guidance. A client-local conflict can differ from the event held by the service."
    },
    {
      "q": "Can Cloud Calendars force a work meeting to accept my change?",
      "a": "A calendar app cannot grant the organiser’s authority or override account permissions. Check the original invitation and contact the organiser or administrator when needed."
    }
  ],
  "sourcesHeading": "Sources and further reading",
  "sources": [
    {
      "label": "Apple: If you have duplicate events on your iCloud Calendar",
      "url": "https://support.apple.com/en-us/102180"
    },
    {
      "label": "Apple: If your iCloud calendars won’t sync",
      "url": "https://support.apple.com/en-us/102543"
    },
    {
      "label": "Google: Choose what others can do with your calendar",
      "url": "https://support.google.com/calendar/answer/15716974?hl=en"
    },
    {
      "label": "Microsoft: Change an appointment, meeting, or event in Outlook",
      "url": "https://support.microsoft.com/en-us/outlook/calendar/change-an-appointment-meeting-or-event-in-outlook"
    },
    {
      "label": "Microsoft: Outlook shows conflict errors when updating or cancelling meetings",
      "url": "https://support.microsoft.com/en-us/support/known-issues/outlook-shows-conflict-errors-when-updating-or-cancelling-meetings"
    }
  ],
  "seeAlso": [
    "what-calendar-sync-actually-does",
    "work-and-personal-without-two-apps"
  ]
},
};
