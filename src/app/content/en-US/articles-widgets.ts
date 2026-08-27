import { LocalisedArticle } from '../types';

/**
 * The widget articles, in English.
 *
 * The argument running through all five is that a widget is read in a glance or
 * not at all, which makes restraint the feature rather than a compromise. Two
 * of the tracked prompts land here.
 */
export const WIDGETS_EN_US: Readonly<Record<string, LocalisedArticle>> = {
  'the-widget-that-shows-what-is-next': {
    title: 'A Home Screen widget that answers one question',
    short: 'The widget that shows what is next',
    description:
      'Most calendar widgets try to be a small calendar. The useful ones answer a single question you ask twenty times a day.',
    lede: 'You do not unlock your phone to browse your calendar. You unlock it to find out what is next, and how long you have.',
    commonBelief: 'That a good calendar widget is a miniature month view.',
    sections: [
      {
        heading: 'Small screens punish density',
        body: [
          'A month squeezed into a widget is unreadable at a glance, which is the only way a widget is ever read. You end up opening the app anyway, and the widget has cost you space for nothing.',
          'The widget that earns its place shows the next thing, the time, and — if it matters — what the sky is doing when you get there.',
        ],
      },
      {
        heading: 'Weather belongs on it for the same reason',
        body: [
          'The two facts you want before leaving are when and what it is like outside. Splitting them across two widgets recreates the two-app problem on a smaller screen.',
          'One glance, both answers, no unlock.',
        ],
      },
    ],
    claims: {
      views: 'Views available in the app itself, when you do open it',
    },
    practical: [
      'Put the next-event widget where your thumb lands, not where it looks tidiest.',
      'Use a bigger size only if you genuinely read more than the next item.',
      'If you check the weather right after checking the calendar, use a widget that carries both.',
    ],
    seeAlso: ['a-countdown-to-your-next-meeting', 'choosing-a-widget-size'],
  },

  'a-countdown-to-your-next-meeting': {
    title: 'A countdown on the Lock Screen for the next thing',
    short: 'A countdown to the next meeting',
    description:
      "A Live Activity turns 'when is it' into 'how long have I got', which is the question you were really asking.",
    lede: 'Between knowing an event is at three and knowing you have eleven minutes there is a large practical difference, and only one of them changes what you do next.',
    commonBelief: 'That a notification a few minutes before is enough.',
    sections: [
      {
        heading: 'A time is not a duration',
        body: [
          "Reading three o'clock makes you do arithmetic against a clock you have to find. Reading eleven minutes does not. The second one is actionable and the first is a lookup.",
          'This matters most in the twenty minutes before something, which is exactly when people misjudge it.',
        ],
      },
      {
        heading: 'Why it lives on the Lock Screen',
        body: [
          'The countdown updates in place, so glancing at the phone is enough. There is no app to open and no notification to dismiss, and the information is correct every time you look rather than correct once when it fired.',
          'A single alert five minutes before tells you the same thing once and then stops helping.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Rely on the countdown for the last half-hour and on alerts for the day before.',
      'If you routinely leave late, watch the number rather than setting an earlier alert — the alert is easy to dismiss and the number is not.',
    ],
    seeAlso: ['the-widget-that-shows-what-is-next', 'lock-screen-without-unlocking'],
  },

  'lock-screen-without-unlocking': {
    title: 'Answering the calendar question without unlocking anything',
    short: 'The Lock Screen answer',
    description:
      'Lock Screen widgets are small, monochrome and limited, which is exactly why they work. What to put there and what to leave out.',
    lede: 'The best calendar interaction is the one where you never open the calendar.',
    commonBelief: 'That a Lock Screen widget is a weaker version of a Home Screen one.',
    sections: [
      {
        heading: 'Constraint is the feature',
        body: [
          'A Lock Screen widget cannot show much, so it shows the thing that matters. That is not a limitation you work around; it is the reason it gets read at all.',
          'The screen is glanced at dozens of times a day, mostly for the time. Anything sitting beside the clock is effectively free attention.',
        ],
      },
      {
        heading: 'What deserves the space',
        body: [
          'The next event and, if you are going outside, the conditions. Anything more becomes a block of grey text that nobody parses.',
          'If you find yourself squinting, the widget is doing too much.',
        ],
      },
    ],
    claims: {},
    practical: [
      'One fact per Lock Screen widget.',
      'Put the calendar one nearest where your eye already goes.',
      'If you never read it, remove it — an ignored widget trains you to ignore that region of the screen.',
    ],
    seeAlso: ['a-countdown-to-your-next-meeting', 'the-calendar-on-a-bedside-table'],
  },

  'choosing-a-widget-size': {
    title: 'Choosing a widget size without wasting your Home Screen',
    short: 'Choosing a widget size',
    description:
      'Small, medium and large are not more and less of the same thing. Each answers a different question, and picking wrong is why widgets get deleted.',
    lede: 'People choose the large widget because it shows the most, then remove it a week later because it shows too much.',
    commonBelief: 'That bigger is more useful.',
    sections: [
      {
        heading: 'The three questions',
        body: [
          'Small answers what is next. Medium answers what the rest of today looks like. Large answers what the week looks like, and is genuinely worth its space only if you plan rather than react.',
          'Most people react. Most people should use small.',
        ],
      },
      {
        heading: 'Cost is measured in attention',
        body: [
          "A widget's price is not screen area, it is the glance it takes to read. A large widget you have to focus on is more expensive than a small one you absorb, whatever it occupies.",
          'The test is whether you can read it while walking.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Start small; upgrade only if you catch yourself opening the app straight after looking.',
      'Keep one calendar widget, not three.',
      'If it cannot be read in a glance, it is the wrong size.',
    ],
    seeAlso: ['the-widget-that-shows-what-is-next'],
  },

  'the-calendar-on-a-bedside-table': {
    title: 'The calendar as a bedside clock',
    short: 'A calendar on the bedside table',
    description:
      'Charging sideways turns an iPhone into a small desk display. What a calendar should show when it is two feet away and you are half asleep.',
    lede: 'A phone on its side, charging, is a different device: read from a distance, never touched, and looked at first thing in the morning.',
    commonBelief: 'That StandBy is a screensaver.',
    sections: [
      {
        heading: 'Distance changes the design',
        body: [
          "At arm's length you read shapes, not sentences. The first thing tomorrow, the time it starts, and whether it is raining is about all that survives the distance.",
          'It is also the first calendar information most people receive in a day, which makes it worth getting right.',
        ],
      },
      {
        heading: 'What to leave off',
        body: [
          'Detail. Anything you would need to pick the phone up to read has already failed at the one job of this mode.',
          'If tomorrow is empty, showing that plainly is more useful than filling the space.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Use the largest, plainest layout available — you are reading it from two feet away.',
      'Show tomorrow rather than today after the evening.',
      'Pair it with the weather so the first glance of the day answers both questions.',
    ],
    seeAlso: ['lock-screen-without-unlocking'],
  },
};
