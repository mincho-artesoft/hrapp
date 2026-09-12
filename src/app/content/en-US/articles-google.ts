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
    title: 'A calendar was shared with you and it is not there',
    short: 'Shared calendar not appearing',
    description:
      'Somebody shared a calendar, you accepted, and nothing changed. The four ordinary reasons, in the order worth checking.',
    lede: 'The invitation arrived, the link was tapped, and the calendar is still missing. Almost always this is one of four things, and none of them is the sharing being broken.',
    commonBelief: 'That accepting a shared calendar puts it on your phone.',
    sections: [
      {
        heading: 'Accepting adds it to an account, not to a device',
        body: [
          'A share lands in the Google account it was addressed to. If you accepted while signed in as one account and your phone carries another, the calendar is sitting safely somewhere you are not looking.',
          'Even in the right account, a newly added calendar arrives switched off on other devices more often than not. It exists, it is simply not ticked, and an unticked calendar looks exactly like a missing one.',
        ],
      },
      {
        heading: 'The other two reasons',
        body: [
          'Sharing to a mailing list or a group address rarely reaches individuals; the share needs the address that is actually a Google account. And a calendar shared as a link rather than a permission is a subscription, which lands in a different part of the list and refreshes on the publisher schedule rather than instantly.',
          'On iPhone, Google calendars reach the built-in app through a sync list of their own, and secondary calendars sit outside it by default. That is why one account can show its main calendar and silently drop the four that matter.',
        ],
      },
    ],
    claims: {
      refreshHint: 'Hours between refresh requests a subscribed feed makes',
      accounts: 'Account types one view can hold without any of this',
    },
    practical: [
      'Check which account accepted the share before checking anything else.',
      'Open the calendar list on the device and look for it switched off rather than absent.',
      'If it came as a link, expect a delay rather than an instant appearance.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'google-calendars-that-never-reach-your-iphone'],
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
    practical: [
      'Check the Google sync list before assuming the account is broken.',
      'Expect subscribed and shared calendars to be excluded rather than included.',
      'If you keep more than a couple of calendars, read them through something that queries Google directly.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'icloud-google-and-outlook-in-one-view'],
  },

  'taking-back-a-calendar-you-shared': {
    title: 'Taking back a calendar you shared with somebody',
    short: 'Removing shared access',
    description:
      'Removing a person from a calendar stops what happens next. What it does not do is undo what already happened, and the difference matters.',
    lede: 'Ending access is one tap. Deciding whether one tap is enough takes slightly longer, because sharing leaves copies behind.',
    commonBelief: 'That removing somebody removes what they have seen.',
    sections: [
      {
        heading: 'What stops and what stays',
        body: [
          'Remove a person and the calendar disappears from their list, immediately and without a message. Future events never reach them.',
          'What does not come back: invitations they already hold, events they copied to their own calendar, anything exported, and anything they were given a secret address for. Access ends; memory does not.',
        ],
      },
      {
        heading: 'The one that outlasts the removal',
        body: [
          'If somebody was ever given manage sharing, they may have added other people. Removing them leaves those people in place, which is how a calendar ends up shared with somebody nobody remembers inviting.',
          'So read the whole list rather than removing one name, and do it on the way out rather than months later. Nothing prompts you, and sharing only accumulates.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Monthly cost of the tier this is managed in, in dollars',
    },
    practical: [
      'Read the full access list, not just the name you meant to remove.',
      'Reset the secret address if the person ever had it.',
      'Assume copies survive, and move genuinely sensitive events rather than hiding them.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'the-secret-address-of-a-google-calendar'],
  },
};
