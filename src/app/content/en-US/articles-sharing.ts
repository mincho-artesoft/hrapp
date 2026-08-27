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
};
