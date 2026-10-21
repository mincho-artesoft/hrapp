import { LocalisedArticle } from '../types';

/**
 * The Google-shaped questions.
 *
 * These five sit beside who-can-see-what-in-google-calendar, which earns a
 * click for roughly one impression in nine — the best rate on the site by an
 * order of magnitude, because it answers a question somebody typed rather than
 * describing a product. Each of these is the same shape: a specific thing
 * Google does that surprises people, answered plainly, with the app mentioned
 * where it genuinely changes the answer and nowhere else.
 */
export const GOOGLE_EN_US: Readonly<Record<string, LocalisedArticle>> = {
  'why-a-shared-calendar-does-not-appear': {
    "updated": "2026-10-21",
    "title": "A calendar was shared with you and it is not there",
    "short": "Shared calendar not appearing",
    "description": "Find a missing shared Google calendar: check the invited account, group access, calendar visibility and the type of link you received.",
    "lede": "This guide is written by Arte Soft, the developer of Cloud Calendars. Start by separating an access problem from a calendar that is simply hidden.",
    "commonBelief": "That accepting a shared calendar puts it on your phone.",
    "sections": [
      {
        "heading": "Check the account and the group",
        "body": [
          "Compare the invitation’s recipient with the Google account signed in on your phone and in your browser. Open the calendar link in the invitation with the intended account. Google supports sharing with people and Google Groups. If access comes through a group, ask its manager to confirm your membership and ask the calendar owner to check that the correct group has access. A forwarded email alone does not establish that permission."
        ]
      },
      {
        "heading": "Hidden, missing or restricted?",
        "body": [
          "In Google Calendar on iPhone or iPad, open the menu and look for the calendar. If it is listed but unchecked, select it. If it is absent, ask the owner to verify access; requesting access is not the same as receiving it. Work or school policies may restrict sharing. Compare the same account in Google Calendar on the web. If it works there but not in another app, check that app’s connected account and calendar selection. Read-only access does not allow editing."
        ]
      },
      {
        "heading": "Identify the link before waiting",
        "body": [
          "An emailed sharing invitation also contains a link, so a link is not automatically an ICS subscription. Ask the sender whether it grants access to a Google calendar or publishes a read-only feed. Google says a new calendar subscription requires a computer browser; opening a calendar already shared by email is a separate action. A feed’s updates depend on the receiving service’s refresh behavior. There is no universal arrival time; confirm urgent changes with the organiser."
        ]
      }
    ],
    "claims": {},
    "faq": [
      {
        "q": "Can a Google Group receive calendar access?",
        "a": "Yes. Check the group selected by the owner, your membership and any organisation restrictions. Do not assume a forwarded group email grants access."
      },
      {
        "q": "Should I delete and reconnect the account?",
        "a": "First check identity, permissions and visibility, then compare the web calendar. Reconnecting cannot grant missing permission and should not be the first diagnostic step."
      }
    ],
    "practical": [
      "Confirm the invited account and any group membership.",
      "Select the calendar if it is listed but hidden.",
      "Ask the owner to verify access before changing connections."
    ],
    "sourcesHeading": "Sources and further reading",
    "sources": [
      {
        "label": "Google: Check the account and the group",
        "url": "https://support.google.com/calendar/answer/37082?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: Hidden, missing or restricted?",
        "url": "https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: Identify the link before waiting",
        "url": "https://support.google.com/calendar/answer/37648?hl=en"
      }
    ],
    "seeAlso": [
      "who-can-see-what-in-google-calendar",
      "google-calendars-that-never-reach-your-iphone"
    ]
  },

  'the-secret-address-of-a-google-calendar': {
    title: 'What the secret address of a Google calendar really gives away',
    short: 'The secret iCal address',
    description:
      'Google offers a private address that shows your whole calendar to whoever holds it. What it exposes, and why it cannot be taken back quietly.',
    lede: 'Buried in the settings of every Google calendar is a link that shows everything on it. No sign-in, no permission, no record of who opened it.',
    commonBelief: 'That a private address is private because it is hard to find.',
    sections: [
      {
        heading: 'A link is a password that cannot be changed for one person',
        body: [
          'The secret address carries full details — titles, times, locations, notes. Anyone holding the link sees them, and there is no list of who does.',
          'Its only protection is the random part of the address. That is genuine protection against guessing, and none at all against forwarding, a shared screen, or a document that outlives the job.',
        ],
      },
      {
        heading: 'Resetting it breaks it for everybody',
        body: [
          'You can reset the address, which makes the old one dead. It also makes it dead for every colleague, every dashboard and every script quietly relying on it, with no warning to any of them.',
          'That is the argument for never handing out the address of a calendar you live in. Publish a calendar made for the purpose, and the reset costs you nothing.',
        ],
      },
    ],
    claims: {
      linkLength: 'Random characters protecting a share link of our own',
      sharePrice: 'What sharing an event from the app costs',
    },
    faq: [
      {
        q: 'What can someone do with the secret address of my Google calendar?',
        a: 'See everything on it — titles, times, locations and notes — without signing in or being granted permission, and without leaving any record that they looked.',
      },
      {
        q: 'Can I take a secret calendar address back?',
        a: 'Only by resetting it, which kills the old address for everyone at once: colleagues, dashboards and any script quietly relying on it, none of whom are warned.',
      },
      {
        q: 'Is it safe to email the secret address to a colleague?',
        a: 'Treat it as public from the moment it leaves your hands. Its only protection is being hard to guess, and forwarding defeats that completely.',
      },
    ],
    practical: [
      'Treat the secret address as public the moment it leaves your hands.',
      'Never publish the address of the calendar you actually use.',
      'Reset it when somebody leaves, and tell the people it will break.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'taking-back-a-calendar-you-shared'],
  },

  'what-guests-can-do-to-your-event': {
    title: 'What your guests can do to an event once invited',
    short: 'Guest permissions on an event',
    description:
      'Three tick boxes decide whether a guest can move your meeting, invite strangers, or read the whole list. They are on by default more often than people expect.',
    lede: 'Inviting somebody hands them more than a place to be. On a normal Google event, a guest can usually see who else was asked, and frequently can add to the list.',
    commonBelief: 'That a guest can only accept or decline.',
    sections: [
      {
        heading: 'The three boxes',
        body: [
          'Modify event lets a guest change the time, the place and the title for everyone. It is rarely wanted and easily left on.',
          'Invite others lets a guest add people you have never met. See guest list shows everybody who was asked and how they replied — fine for a team, awkward for a client, wrong for anything resembling a group of separate customers.',
        ],
      },
      {
        heading: 'Where this quietly goes wrong',
        body: [
          'One event, many individual recipients, guest list visible: everybody now has everybody else. Clearing that one box is the difference between a meeting and a leaked address book.',
          'The settings live on the event, not on the account, so they reset to your defaults every time and have to be thought about on the events that matter rather than once.',
        ],
      },
    ],
    claims: {
      sharePrice: 'What sending a single event from the app costs',
    },
    faq: [
      {
        q: 'Can guests see each other on a Google Calendar invitation?',
        a: 'By default, usually yes. “See guest list” shows everybody invited and how they replied — fine inside a team, awkward with a client, and wrong when the guests are separate customers.',
      },
      {
        q: 'Can a guest change the time of my meeting?',
        a: 'If “modify event” is ticked, yes, and the change applies to everybody. It is rarely wanted and easily left on.',
      },
      {
        q: 'How do I stop guests from inviting other people?',
        a: 'Turn off “invite others” on the event itself. These settings belong to the event rather than the account, so they return to your defaults every time you create one.',
      },
    ],
    practical: [
      'Turn off see guest list for anything sent to people who do not know each other.',
      'Leave modify event off unless somebody genuinely schedules for you.',
      'Check the boxes on the event, not in your settings, because that is where they live.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'why-a-shared-calendar-does-not-appear'],
  },

  'google-calendars-that-never-reach-your-iphone': {
    title: 'Why some Google calendars never reach your iPhone',
    short: 'Google calendars missing on iPhone',
    description:
      'One Google account, several calendars, and only one of them on the phone. The sync list that decides it, and what to do instead.',
    lede: 'Your Google account holds eight calendars. Your iPhone shows two. Nothing is broken: something you have never seen made that choice on your behalf.',
    commonBelief: 'That adding a Google account to iPhone adds the calendars in it.',
    sections: [
      {
        heading: 'A list you were never shown',
        body: [
          'Google keeps a per-device list of which calendars are allowed to sync, and secondary calendars — the shared ones, the subscribed ones, the ones somebody made for a project — are frequently outside it.',
          'The list is not in iOS settings. It lives on a Google page of its own, which is why looking in the obvious place finds nothing wrong and nothing changes.',
        ],
      },
      {
        heading: 'The other route',
        body: [
          'An app that talks to Google directly does not use that list, so it shows every calendar the account actually holds, including the ones the phone quietly dropped.',
          'That also brings the accounts together. One view holding personal, work and shared calendars is the point; whether the phone would have synced each of them stops being a question you have to answer.',
        ],
      },
    ],
    claims: {
      accounts: 'Account types one view can hold',
      price: 'What the Google side costs',
    },
    faq: [
      {
        q: 'Why do only some of my Google calendars show up on iPhone?',
        a: 'Google keeps a per-device list of which calendars are allowed to sync, and secondary calendars — shared ones, subscribed ones, ones made for a project — are frequently outside it.',
      },
      {
        q: 'Where is the Google Calendar sync setting for iPhone?',
        a: 'Not in iOS settings. It lives on a Google page of its own, which is why looking in the obvious place finds nothing wrong and changes nothing.',
      },
      {
        q: 'How do I see every Google calendar on my iPhone?',
        a: 'Read them through an app that queries Google directly instead of through the device sync list. It shows every calendar the account actually holds, including the ones the phone dropped.',
      },
    ],
    practical: [
      'Check the Google sync list before assuming the account is broken.',
      'Expect subscribed and shared calendars to be excluded rather than included.',
      'If you keep more than a couple of calendars, read them through something that queries Google directly.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'icloud-google-and-outlook-in-one-view'],
  },

  'taking-back-a-calendar-you-shared': {
  "title": "Stop sharing a calendar: remove access and check the remaining routes",
  "short": "Review and remove shared access",
  "description": "Stop calendar sharing without confusing people, groups, public access and feed links. Check what changed and understand why saved copies may remain.",
  "lede": "Ending a collaboration starts with identifying how access was granted. Removing a person, disabling publication and resetting a feed address are different actions. This guide is published by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "Removing one recipient instantly recalls every calendar copy and closes every other route to the schedule.",
  "sections": [
    {
      "heading": "Identify the calendar and the sharing route",
      "body": [
        "Confirm the owning account, calendar and intended audience before changing access. A Google calendar shared with a named colleague is a different relationship from a public calendar, a group grant or a subscription address. Cloud Calendars also has its own event and calendar sharing relationships.",
        "For example, a club secretary may receive editing rights through a named invitation while members follow a published schedule. Removing the secretary’s named grant does not describe what should happen to the members’ subscriptions. Make a list of the arrangements you actually created."
      ]
    },
    {
      "heading": "Remove the intended Google grant",
      "body": [
        "Google documents separate controls for named people or groups, organisation-wide sharing and public availability. On a computer, open the intended calendar’s sharing settings and change the relevant entry or broader setting. Check the signed-in account and calendar name first.",
        "A person may still have another access route, such as a group or broader publication. Review the whole arrangement instead of repeating removal of one email address. Work or school policies may limit the available controls; use the owner or administrator’s approved process when necessary."
      ]
    },
    {
      "heading": "Treat a secret calendar address separately",
      "body": [
        "Google says its secret iCal address is for your own use in another calendar application and should not be given to other people. If it was disclosed, Google documents resetting it to invalidate the old address. That is a different action from removing a named person.",
        "Before changing a subscription address you use yourself, identify the calendar clients or tools that depend on it so you can reconnect the intended ones afterward. Do not paste the secret URL into a public support post or send it as evidence that you found the correct calendar. Refer to the calendar name and the type of connection instead."
      ]
    },
    {
      "heading": "Distinguish Cloud Calendars recipients from feed links",
      "body": [
        "In Cloud Calendars, event or calendar recipient access and an issued subscription feed are distinct mechanisms. Review the actual event or calendar sharing relationship and the relevant link before choosing an action. Removing an identified recipient is not a blanket promise that every previously distributed URL or independent copy has been recalled.",
        "If a co-organizer only needs to stop editing, consider the intended role and remaining audience instead of deleting the shared schedule. If the whole collaboration is ending, establish who owns the calendar and who should retain it. Leaving a received calendar and deleting a calendar you own are different decisions."
      ]
    },
    {
      "heading": "Verify the result without promising immediate disappearance",
      "body": [
        "Check that the intended change is saved in the owning system. If an authorised colleague can help, confirm the relevant viewing or editing result from their own account without sharing passwords. Distinguish an access denial from an old event still visible in a cached or imported copy.",
        "Do not promise a universal refresh interval or that no notification will be sent. For a group handover, communicate which schedule should be used from now on. A visible old record does not by itself identify whether the person retains live access, has another grant or kept a standalone copy."
      ]
    },
    {
      "heading": "Handle previous copies as a separate follow-up",
      "body": [
        "Previously exported files, screenshots, messages and independently saved appointments may remain after access changes. Decide which copies matter for the handover and discuss their handling with the people involved. Changing a calendar permission cannot establish what every recipient has already saved.",
        "Keep necessary source records while reviewing the outcome. Do not move sensitive meetings into another shared calendar simply to make the old one look empty, or cancel real invitations as an access test. Record the calendar, route and change you made so later troubleshooting has a clear starting point."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identify the owning account, calendar and sharing route.",
    "Review named people, groups and broader publication separately.",
    "Use the appropriate Google or Cloud Calendars sharing controls.",
    "Handle a disclosed secret feed address as a separate reset decision.",
    "Verify the saved access result without sharing credentials.",
    "Plan for previous exports or copies separately from live access."
  ],
  "faq": [
    {
      "q": "Does removing one person disable a public calendar or their group access?",
      "a": "Do not assume so. Review each actual route. Google documents named recipients, groups and broader publication as separate settings."
    },
    {
      "q": "Will the calendar disappear immediately and silently?",
      "a": "There is no universal promise here about disappearance, notification or refresh timing. Confirm the saved access change and distinguish live access from cached or imported information."
    },
    {
      "q": "Does Advanced buy the ability to remove Google calendar access?",
      "a": "Advanced removes ads in Cloud Calendars. Google sharing controls depend on ownership, permissions and organisation rules, rather than that app plan."
    }
  ],
  "sourcesHeading": "Provider access and subscription guidance",
  "sources": [
    {
      "label": "Google: sharing controls and stopping access",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Google: account synchronization and secret iCal addresses",
      "url": "https://support.google.com/calendar/answer/37648?hl=en"
    }
  ],
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "the-secret-address-of-a-google-calendar",
    "a-calendar-that-is-yours-to-share"
  ],
  "updated": "2026-10-21"
},
};
