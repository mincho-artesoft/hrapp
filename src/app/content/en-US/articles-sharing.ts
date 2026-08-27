import { LocalisedArticle } from '../types';

/**
 * The sharing articles, in English.
 *
 * Written from the API rather than from the pitch. The interesting claim here
 * is one the marketing does not make: the person you share with does not need
 * this app, because a subscription feed is read by Apple Calendar, Google
 * Calendar and Outlook alike. Saying so plainly is worth more than pretending
 * the App Clip is required.
 */
export const SHARING_EN_US: Readonly<Record<string, LocalisedArticle>> = {
  'sharing-one-event-not-your-calendar': {
    title: 'Sharing one event without handing over your calendar',
    short: 'Sharing one event',
    description:
      'How sending a single event works, what the person on the other end actually receives, and why they do not need to install anything to see it.',
    lede: 'Calendar sharing usually means all or nothing: either somebody has access to your calendar or they do not. Sending one dinner should not require either.',
    commonBelief:
      'That sharing an event means giving somebody a window into everything else in your week.',
    sections: [
      {
        heading: 'What actually gets sent',
        body: [
          'Creating an event offers to share it. What travels is a link — by mail, by message, by whatever you have installed — and behind that link is a calendar feed containing that event and nothing else.',
          'Not a screenshot, not a copy that goes stale. When the time moves, the feed moves with it, and the person you sent it to sees the change without you sending anything again.',
        ],
      },
      {
        heading: 'They do not need this app',
        body: [
          'The link is an ordinary calendar subscription. Apple Calendar reads it, Google Calendar reads it, Outlook reads it. Someone on Android with a Gmail account can subscribe and see your event; nothing about that requires an iPhone.',
          'There is an App Clip in the message for people who do want the app — it opens without an install and shows the event straight away. That is a doorway, not a toll gate, and the distinction matters if you are sending an invitation to somebody you cannot ask to install software.',
        ],
      },
      {
        heading: 'What it is not',
        body: [
          'It is not instant. The feed asks calendar apps to check back every hour, and that is a request rather than a rule — clients refresh on their own schedule, and some are lazier than others. For a dinner next week that is invisible. For a change made twenty minutes before, send a message as well.',
          'It is not secret, either. The link contains twenty-two random characters, which nobody will guess, but anyone holding it can read the feed. Treat it the way you would treat a document link: fine to send, worth revoking when it has done its job.',
          'And it is read-only for now. The person you share with sees the event. They cannot edit it, and they cannot write back into your calendar.',
        ],
      },
    ],
    claims: {
      refreshHint: 'Hours between refresh requests the feed makes of the reader',
      linkLength: 'Random characters in the link, which is what makes it unguessable',
      sharePrice: 'What sharing costs',
    },
    practical: [
      'Share from the event itself, right after creating it — the offer appears there.',
      'Send the link however you normally reach that person; the format does not care.',
      'If you change the time close to the event, message them too rather than trusting the hourly refresh.',
      'Revoke the link when the event has passed, the same way you would unshare a document.',
    ],
    seeAlso: ['a-calendar-that-is-yours-to-share', 'inviting-people-who-do-not-have-the-app'],
  },

  'inviting-people-who-do-not-have-the-app': {
    title: 'Inviting people who will never install your calendar app',
    short: 'Inviting people without the app',
    description:
      'Most invitations fail because they ask for an install first. What a subscription link does instead, and how it behaves on Android, on desktop and in Outlook.',
    lede: 'The fastest way to lose an invitation is to make accepting it a software decision. Most people will not install an app to find out when dinner is.',
    commonBelief:
      'That sharing from a calendar app only works properly between two people using that same app.',
    sections: [
      {
        heading: 'A subscription is a standard, not a product',
        body: [
          'The link you send is an ICS feed, which is the format calendars have used to talk to each other for two decades. That is why it does not matter what the other person uses.',
          'Apple Calendar subscribes to it. Google Calendar subscribes to it. Outlook subscribes to it. A colleague on a Windows laptop and a friend on a Pixel see the same event you do, from the same URL, without either of them choosing a side.',
        ],
      },
      {
        heading: 'What the App Clip is for',
        body: [
          'The message also carries an App Clip. On an iPhone that opens the event immediately, with no install and no App Store trip, and offers the full app afterwards if the person wants it.',
          'It exists to make the good case fast, not to make the other case impossible. Ignore it entirely and the link still works.',
        ],
      },
    ],
    claims: {
      linkLength: 'Random characters in the link',
      sharePrice: 'What it costs to send one',
    },
    practical: [
      'Send the link rather than a screenshot; a screenshot cannot update when the plan does.',
      'Tell the recipient it is a subscription, not an invite — some calendar apps put subscriptions in a different place from invitations.',
      'For a one-off, subscribing is overkill: many clients will let them import the single event and be done.',
    ],
    seeAlso: ['sharing-one-event-not-your-calendar'],
  },

  'a-calendar-that-is-yours-to-share': {
    title: 'A calendar of your own that other people can follow',
    short: 'A calendar you can share',
    description:
      'Sharing one event is useful. Sharing a small calendar that keeps updating is what people actually want for a club, a team or a family.',
    lede: 'Sending five events one at a time is worse than sending none. What people want is a thing they can follow once.',
    commonBelief: 'That sharing a calendar means giving people access to your personal one.',
    sections: [
      {
        heading: 'A separate calendar, not your own',
        body: [
          'The calendar you share is not the one holding your dentist appointment. It is created for the purpose, tied to one of your existing accounts, and it holds only what you put in it.',
          'Because it is tied to an account, it syncs to your other devices like any other calendar — you are not maintaining an island.',
        ],
      },
      {
        heading: 'They subscribe once',
        body: [
          'The people you share with subscribe to a link. Everything you add afterwards appears for them without another message, and everything you move moves for them too.',
          'This is what makes it worth doing for a fixture list or a rehearsal schedule, where the changes are the whole point.',
        ],
      },
      {
        heading: 'What it does not do yet',
        body: [
          'It is read-only. Followers see what you publish; they cannot add to it or edit it. For a team calendar that is usually right, and for a shared household one it is a real limitation worth knowing before you start.',
          'The feed asks to be refreshed hourly, so treat it as a schedule people follow rather than a chat they watch.',
        ],
      },
    ],
    claims: {
      refreshHint: 'Hours between refresh requests',
      sharePrice: 'What it costs',
    },
    practical: [
      'Make a calendar for the purpose rather than sharing an existing one.',
      'Tie it to the account you actually keep, so it reaches your other devices.',
      'Tell people it is a subscription — some apps file those separately from invitations.',
      'For urgent changes, message people as well as moving the event.',
    ],
    seeAlso: ['sharing-one-event-not-your-calendar', 'inviting-people-who-do-not-have-the-app'],
  },

  'who-can-see-what-in-google-calendar': {
    title: 'Who can see what, when you share a Google calendar',
    short: 'Google sharing permissions',
    description:
      "Google's sharing levels are easy to set and easy to misunderstand. What each one really exposes, in plain terms.",
    lede: 'Most accidental oversharing is not a mistake in judgement. It is somebody picking a permission level that sounded modest and was not.',
    commonBelief: "That 'see only free/busy' and 'see all event details' differ by a small amount.",
    sections: [
      {
        heading: 'The levels are further apart than they read',
        body: [
          'Free/busy shows blocks of time with no titles. All details shows titles, locations, notes and guests — which for most calendars is a substantial amount about your life.',
          'Make changes lets somebody edit. Manage sharing lets them hand your calendar to other people, which is the one that surprises people later.',
        ],
      },
      {
        heading: 'Choosing without thinking about it every time',
        body: [
          'For colleagues who need to schedule around you, free/busy is almost always the correct answer and almost never the one chosen.',
          'Reserve full details for calendars created to be shared rather than for the one you live in.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Monthly cost of managing these permissions in-app, in dollars',
    },
    practical: [
      'Default to free/busy for anyone who only needs to book time with you.',
      "Reserve 'make changes' for people who genuinely schedule on your behalf.",
      'Review who has access twice a year; sharing accumulates and nothing prompts you.',
    ],
    seeAlso: ['a-calendar-that-is-yours-to-share'],
  },

  'keeping-track-of-who-replied': {
    title: 'Knowing who is actually coming',
    short: 'Keeping track of who replied',
    description:
      'Invitations produce replies, and replies pile up somewhere you are not looking. Where attendee status lives and what to do about silence.',
    lede: 'The question before any gathering is not what time it is. It is how many people are actually coming.',
    commonBelief: 'That sending an invitation is the same as knowing the answer.',
    sections: [
      {
        heading: 'Replies are data, not messages',
        body: [
          'Accept and decline are recorded against the event rather than delivered as a conversation. That is why the count is reliable and the mailbox is not.',
          'Reading the event rather than your inbox is the difference between a number and a memory.',
        ],
      },
      {
        heading: 'Silence is the common case',
        body: [
          'Most people never reply. A third of a guest list not responding is normal, and treating no answer as no is usually wrong.',
          'Chase once, close to the date, and plan for the middle rather than for either extreme.',
        ],
      },
    ],
    claims: {
      premiumMonthly: 'Monthly cost of the tier attendee management sits in, in dollars',
    },
    practical: [
      'Read the guest list on the event, not the replies in your mail.',
      'Chase once, two days out, not repeatedly.',
      'Plan for the responders plus roughly half the silent ones.',
    ],
    seeAlso: ['inviting-people-who-do-not-have-the-app'],
  },

  'meeting-links-that-make-themselves': {
    title: 'Meeting links that appear without you fetching them',
    short: 'Meeting links that make themselves',
    description:
      'Creating a call link in another tab and pasting it into an event is a small ritual repeated hundreds of times a year. It can simply not happen.',
    lede: 'The link is never the interesting part of a meeting, and yet it reliably takes the most steps.',
    commonBelief: 'That generating a call link is a two-second job not worth automating.',
    sections: [
      {
        heading: 'Small friction, large multiple',
        body: [
          'Two minutes of switching apps, generating, copying and pasting, several times a week, is hours a year spent on the least valuable part of scheduling.',
          'It is also where the mistakes live: the stale link, the wrong meeting, the one nobody could join.',
        ],
      },
      {
        heading: 'What generates what',
        body: [
          'Google Meet links can be created automatically on the paid tier, on events in a Google calendar. Microsoft Teams links come with the top tier, alongside Outlook and Exchange sync.',
          'Both attach to the event itself, so whoever opens the invitation has the link, and moving the event does not orphan it.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Monthly cost of automatic Meet links, in dollars',
      premiumMonthly: 'Monthly cost of the tier with Teams links, in dollars',
    },
    practical: [
      'Let the event create the link rather than pasting one in.',
      'If you paste a link, paste it into the event and not into the description of a message.',
      'Check the link survived when you move a recurring meeting.',
    ],
    seeAlso: ['exchange-calendars-on-an-iphone', 'keeping-track-of-who-replied'],
  },
};
