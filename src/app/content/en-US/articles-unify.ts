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
    title: 'What calendar sync actually does, and why it sometimes looks broken',
    short: 'What sync actually does',
    description:
      'Sync is not copying. Understanding what it really is explains most of the moments where a calendar seems to be lying to you.',
    lede: "A calendar app does not own your events. It shows you somebody else's copy, and the gap between those two facts is where confusion lives.",
    commonBelief: 'That events live in the app you created them in.',
    sections: [
      {
        heading: 'The app is a window',
        body: [
          "Your events live on Apple's servers, or Google's, or your employer's. The app on your phone holds a cache and reconciles it. Delete the app and the events survive; delete them in the app and they are gone everywhere.",
          'This is why the same calendar looks identical on your phone and your laptop: neither is the original.',
        ],
      },
      {
        heading: 'Why changes take a moment',
        body: [
          'A change is written locally first so the interface stays quick, then pushed. If the network is poor, the local copy is ahead of the server for a while — which is correct behaviour that looks like a bug.',
          'Two devices editing during that window is the one genuinely awkward case, and it is rarer than people fear.',
        ],
      },
      {
        heading: 'What you can and cannot fix',
        body: [
          'Missing events are almost always a permission or a selected-calendars problem rather than a sync failure. Check what the account is actually sharing before assuming the connection is broken.',
          'Duplicates usually mean the same calendar arrived twice by different routes — a Google account added directly and again through iCloud, for instance.',
        ],
      },
    ],
    claims: {
      accounts: 'Account types kept in sync',
    },
    practical: [
      'If events are missing, check which calendars the account is publishing before reconnecting anything.',
      'If events are duplicated, look for the same calendar arriving by two routes.',
      'Give a change a moment before deciding it failed, especially on a weak connection.',
    ],
    seeAlso: ['when-two-calendars-disagree', 'icloud-google-and-outlook-in-one-view'],
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
