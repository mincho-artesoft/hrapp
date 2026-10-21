import { LocalisedArticle } from '../types';

/**
 * The planning and editing articles, in English.
 *
 * These are the pages somebody reaches after deciding the app is plausible, so
 * they argue about how a calendar should behave rather than about why this one
 * exists. Two tracked prompts land here: dragging to reschedule, and month view
 * on a tablet.
 */
export const PLANNING_EN_US: Readonly<Record<string, LocalisedArticle>> = {
  'drag-an-event-to-move-it': {
    title: 'Moving an event by dragging it',
    short: 'Drag to reschedule',
    description:
      'Rescheduling should cost one gesture, not a form. Why direct manipulation matters more on a calendar than almost anywhere else.',
    lede: 'Opening an event, tapping a time field, spinning a wheel and saving is four steps to express something you already showed with your finger.',
    commonBelief: 'That editing a time in a form is precise and dragging is approximate.',
    sections: [
      {
        heading: 'The form is not more accurate',
        body: [
          'A drag lands on the grid, and the grid is in the units you actually schedule in. You are not being imprecise; you are working at the resolution the day has.',
          "Where precision genuinely matters — a flight, a booking with a fixed minute — the form is still there. It just stops being the default for the ninety per cent that are 'an hour later'.",
        ],
      },
      {
        heading: 'Moving is more common than creating',
        body: [
          'Most calendar work is rearrangement, not entry. Once you notice that, an app that makes creation elegant and rearrangement laborious has optimised the rarer half.',
          'Dragging and resizing turn a rearrangement into what it feels like in your head: this, but later, and a bit longer.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Drag for anything approximate, open the event for anything exact.',
      'Resize from the edge rather than editing an end time.',
      'In week view, dragging across days moves the date and the time together.',
    ],
    seeAlso: ['a-week-view-that-fits-a-week', 'planning-a-week-in-ten-minutes'],
  },

  'a-week-view-that-fits-a-week': {
    title: 'A week view that actually fits a week',
    short: 'A week that fits',
    description:
      'Seven days on a phone screen is a genuine design problem. What has to give, and what must not.',
    lede: 'The week is the unit people actually live in. It is also the hardest one to fit on a phone without turning it into soup.',
    commonBelief: 'That a week view on a phone is inevitably a compromise you tolerate.',
    sections: [
      {
        heading: 'What must survive the squeeze',
        body: [
          'Two things: where the free space is, and roughly how long each commitment runs. Titles can truncate, colours can carry the origin, but shape and gaps cannot be sacrificed.',
          'Once shape survives, the view answers the question people bring to it — where does this fit — without anything being opened.',
        ],
      },
      {
        heading: 'What can go',
        body: [
          'Full titles, locations, attendee lists. All of it is one tap away and none of it is needed to decide whether Thursday afternoon is free.',
          'A week view crammed with detail is a list with extra steps.',
        ],
      },
    ],
    claims: {
      views: 'Views the app offers, of which the week is one',
    },
    practical: [
      'Use week for placing things and day for working through them.',
      'Colour by account so origin reads without titles.',
      'If you cannot see the gaps, the view is too dense to be doing its job.',
    ],
    seeAlso: ['drag-an-event-to-move-it', 'month-view-on-a-bigger-screen'],
  },

  'month-view-on-a-bigger-screen': {
  "title": "Month view earns its keep on an iPad",
  "short": "Month view on iPad",
  "description": "A month on a phone is a heat map. On a tablet it becomes a working surface, and that changes what it is for.",
  "lede": "The same view can be a glance on one device and a workspace on another. Month is the clearest example.",
  "commonBelief": "That month view is the same feature at every size.",
  "sections": [
    {
      "heading": "Phone month is a density map",
      "body": [
        "On a phone you are reading busyness, not content. Which weeks are heavy, where the clear runs are. That is genuinely useful and it is nearly all you can get.",
        "Expecting to plan from it is what makes people feel the view is useless."
      ]
    },
    {
      "heading": "Tablet month is a planning surface",
      "body": [
        "With room for several events per day and legible titles, month becomes the view you actually arrange a month from — dragging things between weeks, seeing a pattern, spotting the collision three weeks out.",
        "The month view helps you compare commitments across dates. It does not provide a whole month of weather conditions. For weather-dependent plans, check the dates and hours available in the weather view separately."
      ]
    }
  ],
  "claims": {
    "views": "Views available on both devices",
    "minIos": "Minimum iOS and iPadOS version"
  },
  "practical": [
    "Plan the month on the tablet, run the day on the phone.",
    "On a phone, read month for density and switch to week to act.",
    "Landscape on a tablet is where month is worth the most room you can give it."
  ],
  "seeAlso": [
    "a-week-view-that-fits-a-week",
    "the-year-in-one-screen"
  ],
  "updated": "2026-10-21"
},

  'planning-a-week-in-ten-minutes': {
    title: 'Planning a week in ten minutes',
    short: 'Planning a week in ten minutes',
    description:
      'A short, repeatable routine that turns a calendar from a record of what happened into something that shapes what does.',
    lede: 'Most calendars are used as a log. Ten minutes once a week is the difference between recording your time and directing it.',
    commonBelief:
      'That planning requires a system, and systems require maintenance nobody sustains.',
    sections: [
      {
        heading: 'The whole routine',
        body: [
          'Open the week. Look at what is already fixed. Place the two or three things that matter and would otherwise slip. Check anything outdoors against the conditions. Close it.',
          'That is the entire method. Its value is not sophistication; it is that it is short enough to actually happen every week.',
        ],
      },
      {
        heading: 'Why it works',
        body: [
          'Things that are not on a calendar happen only if the week is quiet, and weeks are rarely quiet. Placing a commitment is what converts an intention into a decision that has already been made.',
          'Doing it against the forecast means the outdoor half of the plan survives contact with the weather rather than being renegotiated on the day.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Same slot every week — Sunday evening or Monday morning, it matters less than the repetition.',
      'Place at most three discretionary things. More than that and none of them survive.',
      'Check the band before placing anything outdoors, and pick the drier of two candidate slots.',
    ],
    seeAlso: ['planning-outdoors-without-being-rained-on', 'a-week-view-that-fits-a-week'],
  },

  'recurring-events-without-the-mess': {
    title: 'Recurring events without the mess',
    short: 'Recurring events',
    description:
      'Repeats are the feature most likely to go quietly wrong. The three decisions that cause nearly all of it.',
    lede: 'A recurring event is not one event. It is a rule, plus a growing pile of exceptions, and the pile is where the trouble lives.',
    commonBelief: 'That editing a repeating event edits the repeating event.',
    sections: [
      {
        heading: 'This one, or all of them',
        body: [
          'Every edit to a repeat asks a question people answer without reading: this occurrence, or the series. Choose wrong and you either move one week or rewrite a year.',
          "The damaging direction is choosing 'all' when you meant 'this'. It is also the default in more apps than it should be.",
        ],
      },
      {
        heading: 'Endless repeats accumulate',
        body: [
          'A weekly event with no end date is still generating occurrences long after the thing stopped happening. It clutters every future week and quietly makes the calendar less trustworthy.',
          'Give repeats an end date, even a generous one. A rule that expires is easier to renew than one that never stops.',
        ],
      },
      {
        heading: 'Exceptions do not survive rewrites',
        body: [
          'Move six occurrences individually, then edit the series, and the six exceptions can be flattened back to the rule. The edits vanish and nothing warns you.',
          'If a series needs many exceptions, it has stopped being a series.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Read the this-or-all prompt every time, even when you are sure.',
      'Put an end date on every repeat.',
      'When a series needs more than a few exceptions, end it and start a new one.',
    ],
    seeAlso: ['when-two-calendars-disagree'],
  },

  'time-zones-and-the-flight-you-booked': {
    title: 'Time zones, and the flight that lands before it takes off',
    short: 'Time zones and travel',
    description:
      'Travel is where calendars quietly betray people. What changes when you cross a zone, and how to enter events so they survive it.',
    lede: 'A calendar is honest about time and vague about place, which is fine until the two stop agreeing.',
    commonBelief: 'That entering the local time of the destination is enough.',
    sections: [
      {
        heading: 'Events carry a zone whether you set one or not',
        body: [
          'An event without an explicit zone belongs to whatever zone you were in when you made it. Fly somewhere and it moves, because it was never anchored where you meant.',
          "This is why a nine o'clock meeting arranged at home shows up at six on arrival, and why it is right to do so.",
        ],
      },
      {
        heading: 'Where it bites hardest',
        body: [
          "Flights, because departure and arrival are in different zones. Calls with people elsewhere, because one side's convenient hour is the other's midnight. And anything scheduled while travelling, which inherits a zone you are only passing through.",
          'All-day events are the exception: they belong to the date rather than a moment, and generally do the right thing.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Set the time zone explicitly on flights and on any call with someone abroad.',
      'Enter the departure in the departure zone and the arrival in the arrival zone.',
      'Anything booked while travelling should get an explicit zone, not the one you happen to be standing in.',
      'Use all-day events for dates that are dates rather than moments.',
    ],
    seeAlso: ['weather-where-the-event-is'],
  },

  'what-an-all-day-event-really-means': {
    title: 'What an all-day event really means',
    short: 'All-day events',
    description:
      'All-day is not midnight to midnight. It is a different kind of thing entirely, and treating it as a long event causes the confusion.',
    lede: 'An all-day event is not twenty-four hours long. It is not any number of hours long, which is exactly why it behaves oddly when you expect it to.',
    commonBelief: 'That an all-day event is an event that runs from midnight to midnight.',
    sections: [
      {
        heading: 'It belongs to a date, not a clock',
        body: [
          'A birthday is on the fourteenth everywhere on earth at once. It does not start earlier in Tokyo. All-day events model that: they are attached to a date and carry no time zone at all.',
          'This is why they do not shift when you travel, while everything else does.',
        ],
      },
      {
        heading: 'Where people fight it',
        body: [
          'Using all-day for a conference that really runs nine to five means it cannot collide with anything, so the calendar stops warning you about clashes on that day.',
          'If you want the day blocked, block the hours. If you want the day labelled, all-day is correct.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Use all-day for dates: holidays, birthdays, deadlines, travel days.',
      'Use timed events for anything that can collide with something else.',
      'For multi-day trips, an all-day span plus timed events inside it reads best.',
    ],
    seeAlso: ['time-zones-and-the-flight-you-booked'],
  },

  'a-list-for-people-who-dislike-grids': {
    title: 'A list for people who never got on with grids',
    short: 'A list instead of a grid',
    description:
      'Not everybody reads time spatially. List view is not a lesser calendar; for some people it is the only one that works.',
    lede: 'Grid views assume you think about time as space. Plenty of people do not, and have quietly assumed calendars are not for them.',
    commonBelief: 'That a list is what you use when the grid is too small.',
    sections: [
      {
        heading: 'Two different questions',
        body: [
          'A grid answers where does this fit. A list answers what happens next. Those are both real questions, and people lean heavily towards one of them.',
          'If your day is a sequence rather than a shape, a list is not a downgrade; it is the correct instrument.',
        ],
      },
      {
        heading: 'When a list wins outright',
        body: [
          'Days with few events and long gaps look empty in a grid and read perfectly as a list. So do days you work through in order rather than plan around.',
          'The grid is still there for the week you have to fit something into. Nothing says you must live in one view.',
        ],
      },
    ],
    claims: {
      views: 'Views to choose between',
    },
    practical: [
      'Use list for working through a day, grid for placing things into one.',
      'If you never look at the grid, stop feeling obliged to.',
      'Switch to week only when something needs a home.',
    ],
    seeAlso: ['a-week-view-that-fits-a-week'],
  },

  'the-year-in-one-screen': {
    title: 'The year in one screen, and what it is for',
    short: 'The year at a glance',
    description:
      'Year view looks decorative and is not. It answers questions no other view can, a handful of times a year.',
    lede: 'Nobody uses year view daily, which is why it gets dismissed. It is not a daily view; it is a decision view.',
    commonBelief: 'That year view is a poster rather than a tool.',
    sections: [
      {
        heading: 'The questions only it answers',
        body: [
          'How far away is that, really. How many weeks between these two things. Where are the clear stretches. Which month is already heavy.',
          'Each of those is close to impossible from a week view and immediate from a year.',
        ],
      },
      {
        heading: 'When to open it',
        body: [
          'Booking holidays. Planning anything seasonal. Working out whether a deadline is comfortable or a fantasy. All of these are a few times a year, and all of them are consequential.',
          'It is a view you should be glad exists rather than one you should use often.',
        ],
      },
    ],
    claims: {
      views: 'Views available, of which the year is the widest',
    },
    practical: [
      'Open it when booking time off, not when planning a week.',
      'Use it to count weeks between commitments rather than estimating.',
      'On a tablet it is genuinely readable; on a phone treat it as a density map.',
    ],
    seeAlso: ['month-view-on-a-bigger-screen'],
  },
};
