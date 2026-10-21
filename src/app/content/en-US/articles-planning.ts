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
  "updated": "2026-10-21",
  "title": "Recurring calendar events: change one date or the series safely",
  "short": "Recurring events",
  "description": "Check ownership and edit scope before changing a recurring calendar event. Handle one-off changes, future schedules and exceptions without deleting the series.",
  "lede": "Before changing a repeating appointment, decide exactly which dates should change. Then verify that the editor offers that scope. This guide is published by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "Every calendar editor asks whether a change applies to one occurrence or the whole series.",
  "sections": [
    {
      "heading": "Describe the change before opening the editor",
      "body": [
        "“Move next Tuesday’s lesson by one hour” is a one-occurrence change. “Starting next month, lessons are on Thursdays” changes a future schedule. “Correct the room for every meeting” may have a broader scope. These are different requests even when they start from the same event details screen.",
        "Note the selected occurrence’s date and the surrounding dates that should remain unchanged. A short before-and-after list makes it easier to check the saved result. Do not use a real series to discover what an unfamiliar Save button does."
      ]
    },
    {
      "heading": "Check the calendar and your authority to edit",
      "body": [
        "Find the calendar that owns the event and whether you are the organizer, an editor or a guest. Seeing a shared series does not by itself grant permission to change its schedule. Google documents guest modification as a permission the organizer can grant; viewing an invitation and managing it are different capabilities.",
        "In Cloud Calendars, check that the destination calendar permits editing. An attendee’s ability to see a meeting does not mean they can change the organizer’s invitation. If you cannot make the intended change, ask the organizer rather than creating a competing invitation."
      ]
    },
    {
      "heading": "Check the scope before saving in Cloud Calendars",
      "body": [
        "The Cloud Calendars editor includes repeat patterns and an End Repeat setting. Those controls define a schedule; they are not the same as choosing which occurrences an edit affects. Changing an existing repeating event can affect future occurrences. Do not use a change to the repeat rule as a substitute for a one-date exception.",
        "Before saving a one-date exception, look for an explicit choice that limits the change to that occurrence. If your editor does not offer that scope, use the original event in its owning provider’s supported editor. Then check the affected date and surrounding dates in both places. Local calendars and connected providers need not handle series edits identically."
      ]
    },
    {
      "heading": "Use a supported scope, then check representative dates",
      "body": [
        "Google Calendar’s computer instructions say to edit the recurring event, save and choose which events in the series receive the update. Read the actual choices shown for that event rather than assuming every provider uses identical labels or supports identical changes.",
        "Apple’s Mac Calendar guide separately documents repeat frequency, custom patterns and when repetition stops. Those are Apple Calendar controls. Whichever supported editor you use, inspect the changed date, an earlier date that should remain unchanged and the next ordinary occurrence. For an invitation, also check the organizer’s saved event rather than treating a personal display change as confirmation that everyone’s meeting moved."
      ]
    },
    {
      "heading": "Preserve exceptions and choose end dates deliberately",
      "body": [
        "A moved appointment or a skipped week is a reason to inspect an existing series before changing its rule. Record important exceptions first and check them afterward. It is not accurate to promise that every series edit preserves exceptions, or to claim that every edit automatically erases them: the result depends on the operation and provider.",
        "Use a known final date for a course or temporary rota when that matches the real schedule. An ongoing birthday or continuing meeting may reasonably have no planned end. Do not force an arbitrary cutoff onto every repeat, and do not delete and recreate a series merely because it contains several exceptions."
      ]
    },
    {
      "heading": "If the result is unexpected, preserve the evidence",
      "body": [
        "Compare the owning provider with Cloud Calendars on the exact affected date. Check the calendar name, selected occurrence, repeat pattern and any end condition you can inspect. Similar titles or a separately copied appointment can look like a recurrence problem; establish which record you are viewing first.",
        "If the provider is correct but the app differs, report the app and iOS versions, calendar type, intended scope and dates affected. If the provider also changed more dates than intended, contact the organizer or provider support before making further broad edits. Avoid removing accounts, cancelling invitations or deleting a series as diagnostic steps."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Write down which occurrence dates should change and which should stay the same.",
    "Confirm the owning calendar and organizer or editing permission.",
    "For a one-off exception, use an editor that explicitly offers that scope.",
    "Check an earlier date, the changed date and the next ordinary occurrence.",
    "Keep existing exceptions and the original invitation while diagnosing a mismatch."
  ],
  "faq": [
    {
      "q": "Does every recurring-event edit ask about scope?",
      "a": "No. Do not assume Cloud Calendars will ask you to choose the scope. Verify the options before saving; use a supported provider editor for a single-date exception if that choice is absent."
    },
    {
      "q": "Should every recurring event have an end date?",
      "a": "Use an end date when the real schedule has one. Continuing commitments do not need an invented deadline simply to make the calendar tidier."
    },
    {
      "q": "Will changing the series erase its exceptions?",
      "a": "There is no universal answer across providers and edit operations. Record important exceptions and inspect them after the change; do not assume either guaranteed preservation or automatic loss."
    }
  ],
  "sourcesHeading": "Official recurrence and editing-permission guidance",
  "sources": [
    {
      "label": "Google: Create and change a recurring event on a computer",
      "url": "https://support.google.com/calendar/answer/37115?co=GENIE.Platform%3DDesktop&hl=en"
    },
    {
      "label": "Apple: Set up all-day, multiday or repeating events on Mac",
      "url": "https://support.apple.com/guide/calendar/set-up-all-day-multiday-or-repeating-events-icl1018/mac"
    },
    {
      "label": "Google: Collaborate in Calendar and allow guests to modify events",
      "url": "https://support.google.com/a/users/answer/13293412?hl=en"
    }
  ],
  "seeAlso": [
    "when-two-calendars-disagree",
    "time-zones-and-the-flight-you-booked"
  ]
},

  'time-zones-and-the-flight-you-booked': {
  "updated": "2026-10-21",
  "title": "Calendar time zones: check the event before you travel",
  "short": "Time zones and travel",
  "description": "Separate an event’s time zone from the calendar’s display zone. Check flights, destination appointments and recurring calls without shifting the wrong time.",
  "lede": "A different clock time after a flight does not necessarily mean the appointment moved. First establish which place the event belongs to and which time zone the app is displaying. This guide is published by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "Changing the calendar’s displayed time zone is the same as changing the appointment itself.",
  "sections": [
    {
      "heading": "Start with the appointment, then the display",
      "body": [
        "A meeting booked for a particular moment can be shown with different clock times in different places. A dentist appointment at 09:00 in the destination city has a different intention from a personal reminder to stretch at 09:00 wherever you happen to be. Write down which meaning you need before adjusting anything.",
        "Compare the booking or organizer’s confirmation with the event date, start time and named time zone. Then check the time zone used to display the calendar. Do not drag the event to a new hour just because its displayed hour changed after travelling: that could change the appointment rather than its presentation."
      ]
    },
    {
      "heading": "Use provider controls when you need an explicit zone",
      "body": [
        "Apple documents a Time Zone field while creating or editing an event in Apple Calendar on iPhone. Its separate Time Zone Override setting changes the zone shown in Apple Calendar. These are Apple Calendar instructions, not a promise that the same settings control Cloud Calendars.",
        "In Google Calendar on a computer, the event editor’s Time zone control lets you select a zone. Google also documents separate start and end zones for an event. Those are Google’s controls. Use the account that owns the event and confirm that you have permission to edit it before changing its zone."
      ]
    },
    {
      "heading": "Check the saved event in Cloud Calendars",
      "body": [
        "An existing event can carry a saved time zone into the Cloud Calendars editor. If an event does not supply one, the editor can use the current device zone. Before creating a destination appointment, check the device zone and the intended local date and hour. Reopen the saved result and compare it with the booking.",
        "For separate departure and arrival zones, use an editor that explicitly supports them. Do not assume ordinary start and end time fields offer independent zones. If your Cloud Calendars editor does not expose the zone control you need, use the owning provider’s supported editor, then reopen the event in Cloud Calendars and compare both endpoints."
      ]
    },
    {
      "heading": "A flight and a destination appointment need different checks",
      "body": [
        "For a flight, keep the airline’s departure date, departure airport time, arrival date and arrival airport time together. A next-day arrival matters as much as the hour. Where an editor supports separate endpoint zones, match each endpoint to the corresponding airport. Otherwise, use a provider editor that supports the required representation; do not assume two ordinary time fields independently infer two places.",
        "For a destination appointment, confirm the city’s local date and time with the booking. Record that city in the event details if it helps you check later. A location name in notes is a useful reminder, but it is not proof that the event’s actual time-zone field was set. Reopen the saved result before relying on it."
      ]
    },
    {
      "heading": "Recurring calls and all-day labels deserve their own review",
      "body": [
        "For a regular international call, agree which city’s local hour should stay fixed. Check an occurrence near each participant’s seasonal clock change as well as the next occurrence. A comparison on one date is not evidence that the clock-time difference remains identical all year.",
        "An all-day trip label can help organize an itinerary, but it is not a substitute for timed departures, appointments or check-in deadlines. Inspect its dates after it passes between providers. Avoid a blanket promise that every imported all-day event will display identically in every calendar."
      ]
    },
    {
      "heading": "If the clocks still disagree",
      "body": [
        "Compare the same event in the owning provider and Cloud Calendars, noting the calendar, event date, zone and displayed time in each. Check that you have not opened a similarly titled copy. If the provider is correct but another display differs, report the comparison before rewriting the appointment.",
        "Include app and iOS versions, the relevant zones and whether the event repeats. Keep booking references and attendee details out of public reports. There is no need to remove an account or recreate a real invitation to establish which display differs."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Record the intended local date, hour and city from the booking.",
    "Distinguish the saved event zone from the display zone.",
    "Use the owning provider’s zone controls where needed; do not assume matching Cloud controls exist.",
    "Check both flight endpoints and a later recurring occurrence.",
    "Reopen the saved event and compare before changing its time again."
  ],
  "faq": [
    {
      "q": "Does Apple Calendar Time Zone Override change Cloud Calendars?",
      "a": "Apple documents that setting for the display in Apple Calendar. This guide does not establish that Cloud Calendars follows it."
    },
    {
      "q": "Can I enter different departure and arrival zones in Cloud Calendars?",
      "a": "Do not assume the ordinary start and end fields offer separate time-zone choices. If your Cloud Calendars editor lacks them, Google Calendar on a computer documents separate start and end zones; use a supported provider editor."
    },
    {
      "q": "Should I move a meeting back to its old hour after travelling?",
      "a": "First check its intended moment and the display zone. A different local hour may be the correct presentation of the same appointment."
    }
  ],
  "sourcesHeading": "Official event and display time-zone guidance",
  "sources": [
    {
      "label": "Apple: Schedule or display events in a different time zone on iPhone",
      "url": "https://support.apple.com/guide/iphone/schedule-display-events-a-time-zone-iph69525c028/ios"
    },
    {
      "label": "Google: Use Google Calendar in different time zones",
      "url": "https://support.google.com/calendar/answer/37064?hl=en"
    }
  ],
  "seeAlso": [
    "recurring-events-without-the-mess",
    "weather-where-the-event-is"
  ]
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
