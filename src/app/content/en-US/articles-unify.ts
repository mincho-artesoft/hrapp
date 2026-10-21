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
    title: 'Keeping work and personal separate without keeping them apart',
    short: 'Work and personal, one app',
    description:
      'The boundary most people want is visual, not structural. How to get it without losing the ability to see your whole week.',
    lede: 'People keep two calendar apps to keep work out of their evenings. It is a reasonable instinct solved the wrong way.',
    commonBelief: 'That separation requires separate apps.',
    sections: [
      {
        heading: 'What the boundary is for',
        body: [
          'The point is not to be unable to see work. It is to not be ambushed by it — to look at Saturday without a wall of meetings, and to look at Tuesday and see everything.',
          'Two apps deliver that badly: they hide work when you need the overview and surface it when you do not, because the split is by app rather than by moment.',
        ],
      },
      {
        heading: 'Doing it by visibility instead',
        body: [
          'Colour by account and you can read the week at a glance. Toggle a calendar off and the evening is yours without the work events ceasing to exist.',
          'The overview survives, which is the thing two apps take away.',
        ],
      },
      {
        heading: 'Where the paid tier helps',
        body: [
          'Managing events across accounts — moving something from work to personal, or the reverse — sits in the paid tier. Viewing everything together does not.',
          'If all you want is to see it all in one place, that is free.',
        ],
      },
    ],
    claims: {
      accounts: 'Accounts in one view',
      advancedMonthly: 'Monthly cost of cross-account management, in dollars',
    },
    practical: [
      'Colour by account, not by topic.',
      'Toggle work calendars off at the weekend rather than closing the app.',
      'Keep one calendar as the one you write to by default, so nothing lands in the wrong place.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view'],
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
    title: 'When two calendars disagree about the same event',
    short: 'When calendars disagree',
    description:
      'Conflicts are rarer than people think and stranger than they expect. What causes them and how to resolve one without losing anything.',
    lede: 'Two devices, one event, two different times. It is unsettling precisely because a calendar is supposed to be the thing you can trust.',
    commonBelief: 'That a conflict means something is broken.',
    sections: [
      {
        heading: 'Usually it is a race, not a fault',
        body: [
          'Both edits were valid; they simply happened before either device heard about the other. The server keeps the one that arrived last, which may not be the one you meant.',
          'This needs no repair. It needs you to decide which version is right and say so once.',
        ],
      },
      {
        heading: 'The duplicate that is not a conflict',
        body: [
          'Far more common than a genuine conflict is the same event arriving twice by two routes — subscribed once directly and once through another account. Nothing is in conflict; you are simply seeing one event twice.',
          'The fix is to stop one of the routes rather than to delete an event, which would remove both copies.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Decide which version is correct and set it once, from one device.',
      'For duplicates, find the second route before deleting anything.',
      'If a change refuses to stick, check whether the calendar is read-only for you.',
    ],
    seeAlso: ['what-calendar-sync-actually-does'],
  },
};
