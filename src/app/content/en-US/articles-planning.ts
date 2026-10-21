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
  "title": "Drag a calendar event to reschedule: check time, duration and scope",
  "short": "Drag to reschedule",
  "description": "Move a calendar event without confusing its start, duration, calendar or repeat scope. Check editing rights and verify the saved change.",
  "lede": "A block moved on a screen is only the start of a reschedule. The useful result is the right event, at the right time, in the right calendar, with the intended repeat scope. This guide is published by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "Dragging an appointment always saves exactly the intended change and updates every participant immediately.",
  "sections": [
    {
      "heading": "Identify the event and calendar before moving it",
      "body": [
        "Open the appointment details and check its date, start and end times, calendar and owning account. Two similar blocks may be separate events or two displays of the same schedule. Moving the wrong copy does not solve a clash in the original calendar.",
        "For example, a personal planning block and an organiser’s invitation may both say Project review. Decide which one you are responsible for changing. If you only need a reminder to prepare, keep that separate from the meeting arranged by someone else."
      ]
    },
    {
      "heading": "Move the block when the start time should change",
      "body": [
        "Cloud Calendars provides timeline drag and resize interactions. Moving a timed event and changing one of its edges are different operations: a move changes its placement, while a resize changes the interval. Use a day or multi-day timeline where the intended date and hour are clear.",
        "Suppose a one-hour appointment moves from 15:00–16:00 to 16:00–17:00. Check both times afterward. An event stretched to 15:00–17:00 has become longer instead of moving later. For an exact booking minute, open its details and inspect the time fields rather than judging the block’s height."
      ]
    },
    {
      "heading": "Choose the series scope deliberately",
      "body": [
        "A repeating appointment is not just a row of unrelated blocks. Before changing Tuesday’s meeting, decide whether this Tuesday alone changes or whether the arrangement changes from then onward. Do not drag repeatedly until the display looks right without checking the scope.",
        "When a scope chooser is offered, read its options before confirming. Reopen the changed occurrence and a later one to check the result. If the available editor cannot express the intended exception, use the owning provider’s supported editor rather than assuming every timeline handles a series identically."
      ]
    },
    {
      "heading": "Respect the destination and editing permission",
      "body": [
        "An appointment being visible does not establish that you may edit it. A subscribed calendar may be read-only; a received event may permit viewing but not changes. Cloud Calendars distinguishes read-only shared invitations, and a provider may also reject an update that appeared possible locally.",
        "Keep the calendar unchanged when you only mean to change the time. In a view with multiple calendar columns, crossing to another calendar is a different decision: it can change the account or people who can see the event. Check the Calendar value after the operation, especially when similarly coloured calendars are adjacent."
      ]
    },
    {
      "heading": "Reopen and compare the saved result",
      "body": [
        "After moving or resizing, reopen the event and compare the date, start, end, calendar and repeat behavior with the intended arrangement. Check for a save or synchronization error. A block returning to its old position needs investigation, not repeated dragging of a customer meeting.",
        "For a connected account, compare the original provider when a change matters or appears inconsistent. If the provider still shows the old time, record the example date and connection route for support. A successful local save and another person’s device displaying the update are separate observations."
      ]
    },
    {
      "heading": "Tell participants about important changes",
      "body": [
        "Confirm an urgent new time through your usual communication channel. A calendar edit does not prove the invitation was delivered, read or accepted, and people may be offline. Ask for the confirmation you actually need.",
        "Apple Calendar and Google Calendar also document their own drag-to-move workflows. Follow the instructions for the application you are using; their controls and save steps do not define Cloud Calendars behavior. Use the event details when a gesture is unavailable or an exact value needs checking."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Check the original event, calendar and account.",
    "Decide whether to move the start or resize the duration.",
    "Perform one change, then inspect both start and end.",
    "Choose a repeat scope only when it matches your intention.",
    "Reopen the event and verify calendar, time and any provider update.",
    "Confirm urgent schedule changes directly with participants."
  ],
  "faq": [
    {
      "q": "Does dragging change the duration too?",
      "a": "Moving and resizing are different operations. Check both start and end after the gesture; use the time fields when the exact result matters."
    },
    {
      "q": "Can I drag an event on a read-only calendar?",
      "a": "Visibility does not grant editing permission. Check the calendar and sharing role. Make the change at the supported source or ask its owner when you cannot edit it."
    },
    {
      "q": "Will the whole repeating series move?",
      "a": "Check the available scope and the saved result. Do not infer the series behavior from one block moving; inspect the changed occurrence and a later one."
    }
  ],
  "sourcesHeading": "Official instructions for other calendar applications",
  "sources": [
    {
      "label": "Apple: creating and editing events in Calendar on iPhone",
      "url": "https://support.apple.com/en-my/guide/iphone/iph3d110f84/ios"
    },
    {
      "label": "Google: editing and moving events on iPhone and iPad",
      "url": "https://support.google.com/calendar/answer/72143/?co=GENIE.Platform%3DiOS&hl=en"
    }
  ],
  "seeAlso": [
    "recurring-events-without-the-mess",
    "event-saved-to-wrong-calendar",
    "when-two-calendars-disagree"
  ],
  "updated": "2026-10-21"
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
  "updated": "2026-10-22",
  "title": "Month calendar on iPad and iPhone: see the dates, then check the details",
  "short": "Use month view without missing details",
  "description": "Compare dates in month view on iPad or iPhone. Check hidden events, selected calendars and exact times before moving shared or recurring appointments.",
  "lede": "Month view answers where commitments fall across dates. It is less suited to proving that a particular hour is free. Use the overview to choose a date, then inspect the day and the event before committing. This guide is published by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "A larger month grid displays every detail, and an apparently empty date proves that everyone is available.",
  "sections": [
    {
      "heading": "Decide whether you need dates or exact hours",
      "body": [
        "Use the month to compare a project deadline, a trip and a family appointment across several weeks. When the question becomes whether two appointments overlap at 14:30, switch to a day or week view and inspect their exact start and end. A month cell does not provide the same time scale as an hourly grid.",
        "For example, an organiser choosing a date for a workshop can first avoid a travel week. The next check is the proposed day: existing commitments, preparation, travel and the required finish. A clear-looking cell is a candidate to investigate, not a confirmed booking or a statement of other people’s availability."
      ]
    },
    {
      "heading": "Read the overflow instead of counting only visible titles",
      "body": [
        "Cloud Calendars’ current month cell shows a limited set of event chips and an additional-count label when more events belong to the date. Titles are kept to a line, so they can shorten. Open the day or the individual event when the full title or remaining commitments matter.",
        "A bigger iPad display can make the overview easier to read, but do not assume that more physical space removes every display limit. A narrow app window or larger text can change what fits. Keep the same check on iPhone: inspect the underlying day before treating the visible chips as the complete schedule."
      ]
    },
    {
      "heading": "Check the month, selected calendars and adjacent dates",
      "body": [
        "Read the displayed month and year before choosing a date. A month grid can include dates from an adjacent month to complete its rows. In Cloud Calendars, use the month navigation and inspect the selected date rather than relying on the position of a square alone.",
        "Check which calendars are selected. Hiding work events may help you read a family plan, but it also removes those commitments from that particular overview. If you are diagnosing a duplicate, temporarily hide one source and compare; do not delete an appointment merely to make the month less crowded."
      ]
    },
    {
      "heading": "Open an event before changing a shared arrangement",
      "body": [
        "Confirm the title, owner or calendar, local time and duration in the event details. A colour is useful for scanning, but it is not a substitute for knowing the account or whether you may edit the event. A visible invitation is different from an appointment you organise yourself.",
        "Cloud Calendars has a month drag-and-drop path for moving events to another date. Before using it on a real commitment, establish the intended date and recurrence scope. After a permitted change, reopen the event and check the result; a local gesture is not proof that a provider or every participant has accepted the new arrangement."
      ]
    },
    {
      "heading": "Treat repeating events and time zones as separate checks",
      "body": [
        "If only this week’s lesson moves, do not accidentally change its future pattern. Read the available repeat-scope choice and inspect both the changed occurrence and a later one afterwards. The month view makes repeated dates easy to compare, but the edit scope determines what the change means.",
        "For travel or a meeting across time zones, inspect the event’s local date and time explicitly. Moving an event to a different day is not an automatic conversion of the intended meeting time. Check daylight-saving transitions when relevant, and confirm the agreed time with the people involved."
      ]
    },
    {
      "heading": "Use the larger view without confusing it with other products",
      "body": [
        "Apple Calendar offers its own month display choices, while Teamup documents different browser and mobile view sets. Those controls belong to their respective products. Do not look for Teamup’s browser configuration or Apple Calendar’s view menu inside Cloud Calendars just because the layouts have the same name.",
        "A month of appointments also is not a month of weather forecasts. For an outdoor plan, check the intended place, date and available forecast hours separately. Save the final appointment to the intended calendar and confirm any changed arrangement directly with participants."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Use month view to shortlist dates, then inspect exact hours in day or week view.",
    "Open days with an additional-count label or shortened titles.",
    "Check month, year and selected calendars before assuming a date is clear.",
    "Confirm the event’s calendar, time, duration and edit permission.",
    "Read recurrence scope and verify the saved occurrence after a move.",
    "Check weather availability separately and confirm changes with participants."
  ],
  "faq": [
    {
      "q": "Does iPad month view display every appointment in full?",
      "a": "Do not assume that. Cloud Calendars limits the event chips in a month cell and uses an additional-count label. Open the day and event to inspect the full schedule."
    },
    {
      "q": "Does an empty day mean I am free?",
      "a": "First check the selected calendars, the date and whether relevant account data is present. The overview only represents the information currently available and displayed."
    },
    {
      "q": "Does moving a recurring event change only that date?",
      "a": "Read the edit-scope choice rather than assuming. After saving, inspect the changed occurrence and a later one, then confirm the intended arrangement."
    }
  ],
  "sourcesHeading": "Compare the official view descriptions",
  "sources": [
    {
      "label": "Apple: month, multiple-day and list views in Apple Calendar",
      "url": "https://support.apple.com/en-ca/guide/iphone/iphfd1054569/ios"
    },
    {
      "label": "Teamup: calendar views and browser versus app configuration",
      "url": "https://calendar.teamup.com/kb/how-to-use-calendar-views/"
    }
  ],
  "seeAlso": [
    "a-week-view-that-fits-a-week",
    "drag-an-event-to-move-it",
    "recurring-events-without-the-mess",
    "time-zones-and-the-flight-you-booked"
  ]
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
  "updated": "2026-10-21",
  "title": "All-day calendar events: dates, availability and missing widget entries",
  "short": "Understand all-day events",
  "description": "Choose dates or timed appointments, check free/busy separately and verify multi-day ranges. Find all-day entries that do not appear in an upcoming widget.",
  "lede": "An all-day label, a busy day and an appointment at a particular hour are different ideas. Decide which you need before changing the event. This guide is published by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "An all-day entry always leaves you free, appears in every upcoming list and behaves identically across calendar providers.",
  "sections": [
    {
      "heading": "Choose a date label or a timed commitment",
      "body": [
        "A birthday, public holiday or trip label can belong to a date without requiring an arrival hour. A dentist visit or a conference session needs an actual start and end time. Choose the representation that lets someone understand the commitment without guessing.",
        "For a trip from Friday through Sunday, an all-day span can label the itinerary. Keep a Friday flight, Saturday booking and Sunday check-out as timed commitments when their hours matter. The trip label should not replace the bookings it summarizes. A deadline at 17:00 also needs its hour; an all-day label alone does not communicate that cutoff."
      ]
    },
    {
      "heading": "Check both dates in Cloud Calendars",
      "body": [
        "In the event editor, use All-day for a date-based entry. Starts and Ends then use date choices rather than clock times. Read the first and last intended dates before saving, and reopen the result across those days. The current editor treats the selected ending day as included in the span.",
        "For a one-day birthday, check that it appears on the intended date without an unwanted extra day. For a three-day trip, check all three dates. If you change an existing repeating entry, follow the recurrence guide before saving: choosing All-day does not establish whether an edit affects one occurrence or future occurrences."
      ]
    },
    {
      "heading": "Check availability independently",
      "body": [
        "Do not decide whether a day is free just by seeing an all-day banner. Google Calendar documents whether an event blocks time as a separate setting from its dates. Calendar permissions and the recipient's view can also limit the details people see. An all-day entry is not a universal instruction to accept or reject meetings.",
        "If you need a day blocked for leave, check the owning provider's availability or out-of-office controls and the saved result. If you only want a birthday label, check that it does not block time unintentionally. This guide does not promise that Cloud Calendars exposes every provider's availability control or prevents scheduling conflicts. Use a supported provider editor when you need an option absent from the app."
      ]
    },
    {
      "heading": "A missing widget row is not a missing event",
      "body": [
        "Cloud Calendars' upcoming-event widgets and Live Activity follow future timed appointments. They exclude all-day entries. A birthday may therefore be present in the full calendar but absent from the next-event display. Making the widget larger does not change that eligibility rule.",
        "Open the date in the app and check that the calendar is selected. If the entry is present there, distinguish an expected widget omission from lost calendar data. Do not convert a birthday into an artificial timed meeting merely to make a widget show it; decide first whether the event itself should really have an hour."
      ]
    },
    {
      "heading": "Inspect transfers and travel dates",
      "body": [
        "Date-based events can use different storage conventions from timed appointments. Google documents date fields for all-day entries and a separate end boundary in its event format. A raw export's ending date is not necessarily the last date a calendar displays. Use the displayed result to check a transfer rather than editing a file solely because its end date looks one day later.",
        "After an import or an important time-zone change, compare the intended first and last dates in the owning calendar and the app. Do not assume every provider, imported file and installed version handles the boundaries identically. Keep the source while checking; moving the event to compensate for an unfamiliar display can introduce another error."
      ]
    },
    {
      "heading": "Keep alerts and planning separate",
      "body": [
        "A label across the top of a day is useful context, but it is not a reminder that has been delivered. If you need to act before a birthday, deadline or trip, inspect the saved alert and the app and system notification settings. The event's visible date alone does not guarantee an audible reminder.",
        "For a problem report, note the intended date range, whether All-day is enabled, the owning calendar and where the entry differs: full app, provider, widget or activity. Use a non-sensitive example when possible. Preserve the original entry while diagnosing the difference."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Choose a date label for context and a timed entry for a commitment with an hour.",
    "Check the first and last included dates after saving.",
    "Verify free/busy separately in the owning provider when needed.",
    "Look in the full calendar for all-day entries omitted from upcoming displays.",
    "Check reminders and imported date boundaries without deleting the source."
  ],
  "faq": [
    {
      "q": "Does an all-day event mean I am available?",
      "a": "No. Check the owning calendar's availability settings separately; an all-day banner does not establish free/busy for every provider."
    },
    {
      "q": "Why is my all-day trip absent from the next-event widget?",
      "a": "That feed follows future timed appointments and excludes all-day entries. Check the trip in the full calendar."
    },
    {
      "q": "Should I subtract a day from an export's end date?",
      "a": "Do not change it just from the raw field. Some formats use an exclusive end boundary. Check the imported displayed range while retaining the original."
    }
  ],
  "sourcesHeading": "Official event-format and calendar guidance",
  "sources": [
    {
      "label": "Apple: All-day and multiday events in Calendar on Mac",
      "url": "https://support.apple.com/guide/calendar/set-up-all-day-multiday-or-repeating-events-icl1018/mac"
    },
    {
      "label": "Google: Timed and all-day event concepts",
      "url": "https://developers.google.com/workspace/calendar/api/concepts/events-calendars"
    },
    {
      "label": "Google: Event boundaries and availability fields",
      "url": "https://developers.google.com/workspace/calendar/api/v3/reference/events"
    }
  ],
  "seeAlso": [
    "time-zones-and-the-flight-you-booked",
    "recurring-events-without-the-mess",
    "the-widget-that-shows-what-is-next",
    "calendar-notifications-missing-silent-or-duplicated"
  ]
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
