import { LocalisedArticle } from '../types';

/**
 * The cost and comparison articles, in English.
 *
 * Written to be trusted rather than to convert, including the paragraph that
 * tells a certain reader to buy the more expensive competitor instead. A
 * comparison page that never concedes anything is one an answer engine has no
 * reason to quote, and one a reader has no reason to believe.
 */
export const COMPARE_EN_US: Readonly<Record<string, LocalisedArticle>> = {
  'free-google-sync-without-adverts': {
    title: 'Free Google Calendar sync, and what the adverts pay for',
    short: 'Free sync, and the adverts',
    description:
      'What the free tier really includes, where the adverts appear, and what removing them costs. Stated plainly, because most apps do not.',
    lede: 'Free calendar apps are usually free because something else is being sold. It is worth knowing which thing, before you commit your week to one.',
    commonBelief: 'That a free tier is a trial, and the real app is behind a paywall.',
    sections: [
      {
        heading: 'What free actually covers',
        body: [
          'Every view, iCloud sync, Google sync, the whole weather hub and in-calendar forecasts, widgets, Meet links on events, and drag-and-drop editing. Not a trial of those things — those things.',
          "If your calendars are Apple's and Google's, which is most people's, the free tier is the app.",
        ],
      },
      {
        heading: 'What the adverts do and what removing them costs',
        body: [
          'The free tier carries advertising. Removing it is the cheapest paid tier, and removing adverts is genuinely most of what that tier is for.',
          'Stating that plainly seems better than the usual arrangement, where the ad-free tier is bundled with features you did not ask for so the price looks like it buys more.',
        ],
      },
    ],
    claims: {
      price: 'Cost of the free tier',
      advancedMonthly: 'Monthly cost of removing adverts, in dollars',
    },
    practical: [
      'Start free; the sync you need is probably already there.',
      'Pay to remove adverts if they bother you, not because you expect the app to change.',
      'Only consider the top tier if your work calendar is Microsoft.',
    ],
    seeAlso: ['what-you-get-without-paying-anything', 'what-a-subscription-actually-buys'],
  },

  'what-fantastical-costs-and-what-this-does': {
    title: 'If you are looking at Fantastical and wincing at the price',
    short: 'A cheaper alternative',
    description:
      'An honest comparison: what the expensive calendar apps give you, what this one does instead, and who should still buy the expensive one.',
    lede: 'Fantastical is a good app with a subscription priced for people who live in their calendar. Not everybody does, and the gap between those two groups is large.',
    commonBelief: 'That the cheaper option is the same thing with fewer features.',
    sections: [
      {
        heading: 'What you are actually paying for at the top end',
        body: [
          'Deep natural-language entry, proposals, extensive templating, a mature Mac application. If you schedule for a living, those are worth real money and this is not an argument against them.',
          'Most people are not scheduling for a living. They have three accounts, a week to organise, and something outdoors on Saturday.',
        ],
      },
      {
        heading: 'What this does instead',
        body: [
          'Puts every account in one view, puts the forecast inside that view, and charges a fraction of the price to remove the adverts. The weather integration is the part the expensive apps mostly do not have.',
          'That is a different proposition rather than a cheaper copy of the same one, and it suits a different person.',
        ],
      },
      {
        heading: 'Who should still buy the other one',
        body: [
          'If you need a first-class Mac app, or you schedule dozens of meetings a week and natural-language entry is muscle memory, buy the one built for that.',
          'Choosing the cheaper thing when you needed the expensive one is a false economy, and pretending otherwise would be a bad way to earn a subscription.',
        ],
      },
    ],
    claims: {
      advancedYearly: 'Yearly cost of the ad-free tier, in dollars',
      premiumYearly: 'Yearly cost of the top tier, in dollars',
    },
    practical: [
      'Try the free tier first — it includes the weather features, which are the differentiator.',
      'If you live on a Mac all day, weigh that seriously before switching.',
      'Compare yearly against yearly; monthly pricing flatters nobody.',
    ],
    seeAlso: ['what-a-subscription-actually-buys', 'free-google-sync-without-adverts'],
  },

  'what-you-get-without-paying-anything': {
    title: 'What you get without paying anything',
    short: 'What free includes',
    description:
      'A straight list of the free tier, with no asterisks, so you can decide whether the paid tiers are relevant to you at all.',
    lede: 'Most free tiers are shaped to be uncomfortable. This one is shaped to be the app, with adverts.',
    commonBelief: 'That the free tier will run out and force a decision.',
    sections: [
      {
        heading: 'The list',
        body: [
          'Day, week, month, year and list views. iCloud sync. Google sync. The full weather hub and forecasts inside the calendar. Home Screen widgets. Google Meet links on events. Dragging, dropping and resizing.',
          'No event limits, no calendar limits, no trial clock.',
        ],
      },
      {
        heading: 'What is genuinely not included',
        body: [
          'Microsoft accounts. Managing events across accounts. Automatic meeting links. And no adverts, which is the tier most people actually consider.',
          'If none of those describe you, there is nothing here you need to buy.',
        ],
      },
    ],
    claims: {
      price: 'Cost',
      views: 'Views included',
      accounts: 'Account types, of which two are free',
    },
    practical: [
      'Add your accounts and use it for a fortnight before considering a tier.',
      'If the adverts do not bother you, they do not bother you — there is no second reason to upgrade.',
      'Microsoft at work is the one thing that genuinely requires the top tier.',
    ],
    seeAlso: ['free-google-sync-without-adverts', 'what-a-subscription-actually-buys'],
  },

  'what-a-subscription-actually-buys': {
    title: 'What a subscription actually buys, tier by tier',
    short: 'What a subscription buys',
    description:
      'Two paid tiers, what separates them, and how to tell which one — if either — is yours. Yearly and monthly prices side by side.',
    lede: 'Two tiers is enough to be confusing if nobody says plainly what divides them. What divides them is Microsoft.',
    commonBelief: 'That the higher tier is the same features with more of them.',
    sections: [
      {
        heading: 'The first tier removes adverts',
        body: [
          'It also adds managing events across your iCloud and Google calendars, Google sharing permissions, automatic Meet links and quicker weather refreshes. But the reason people buy it is the adverts.',
          'At this price it is roughly a coffee a year, and it is the tier that suits most people who want to pay anything at all.',
        ],
      },
      {
        heading: 'The second tier is for Microsoft',
        body: [
          'Outlook and Exchange sync, Teams links, cross-account management including work, attendee management. It costs an order of magnitude more because the connection does.',
          'If your work calendar is not Microsoft, this tier has nothing in it for you and you should not buy it.',
        ],
      },
      {
        heading: 'Yearly against monthly',
        body: [
          'Both tiers are cheaper taken yearly. The saving is modest rather than dramatic, so take yearly if you already know, and monthly if you are still deciding.',
          'Neither is a trap — cancelling leaves you on the free tier with your calendars intact, because the events were never ours to hold.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'First tier, monthly, in dollars',
      advancedYearly: 'First tier, yearly, in dollars',
      premiumMonthly: 'Second tier, monthly, in dollars',
      premiumYearly: 'Second tier, yearly, in dollars',
    },
    practical: [
      'Buy the first tier to remove adverts, not to unlock the calendar.',
      'Buy the second only if Microsoft is where your work lives.',
      'Take yearly once you are sure; the saving is real but small.',
    ],
    seeAlso: ['what-you-get-without-paying-anything', 'what-fantastical-costs-and-what-this-does'],
  },
};
