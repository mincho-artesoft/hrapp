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
  "updated": "2026-10-22",
  "title": "Week calendar on iPhone: compare hours without overlooking commitments",
  "short": "Read a week calendar clearly",
  "description": "Read a week calendar on iPhone: check dates, selected calendars, all-day events and exact hours before fitting another appointment into an apparent gap.",
  "lede": "A week grid helps compare when commitments begin and end. Start with the dates and calendars it represents, then use the details when a small block or shortened title leaves a question unanswered. This guide is published by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "Every visible gap is available time, and every commitment appears as a timed block.",
  "sections": [
    {
      "heading": "Check which week and calendars you are reading",
      "body": [
        "Read the date range and day labels before placing an appointment. A selected range is not necessarily the week you had in mind. Check that the work, family or other calendars relevant to this decision are selected, rather than assuming every connected calendar is currently visible.",
        "For example, a personal view may hide a work calendar to reduce clutter. The clear afternoon it shows does not establish that the work schedule is empty. Bring the relevant calendars into view before offering the slot, and confirm the account behind an unfamiliar colour."
      ]
    },
    {
      "heading": "Use blocks to compare time, then open the details",
      "body": [
        "Compare start, end and overlap on the hour grid. A narrow event can be hard to read, so open it to check the full title, location and calendar. Do not infer a precise duration from the apparent size of a small block alone.",
        "If two appointments overlap, first establish whether they are separate commitments or two displays of the same record. Similar titles and matching times do not prove duplication. Temporarily hide one calendar to identify the source instead of deleting an invitation to clear the grid."
      ]
    },
    {
      "heading": "Read all-day events separately from the hourly gaps",
      "body": [
        "Cloud Calendars separates all-day events from timed events in its multi-day display. Inspect that area as well as the hour columns. A holiday, trip or all-day commitment can matter even when the timed grid looks empty.",
        "An all-day label does not by itself tell you which hours you can offer to someone else. Open the event and understand its actual meaning. For travel over several days, check the start and end dates rather than assuming a single visible label describes every affected day."
      ]
    },
    {
      "heading": "Include the parts of the plan that are not yet appointments",
      "body": [
        "A calendar can only display the information available to it. A journey, preparation or recovery period may need its own agreed block if it affects a booking. Seeing space between two saved meetings does not establish that you can travel between their locations in that interval.",
        "For a workshop after an existing appointment, write down the real travel and setup requirements before choosing a start. This is a planning method, not a claim that Cloud Calendars automatically calculates travel buffers or reserves time in colleagues’ scheduling systems."
      ]
    },
    {
      "heading": "Switch to a closer view before a consequential edit",
      "body": [
        "If the selected range needs more space than the viewport, Cloud Calendars can scroll the day columns rather than squeeze them all into view. Check the day labels as you scroll. Open the day or the event details when a particular commitment needs closer inspection.",
        "Before dragging or resizing an event, check its calendar, intended local time and repeat scope. After saving a permitted change, reopen it and verify the result. A successful-looking gesture does not prove that the owning service and every participant have accepted the new arrangement."
      ]
    },
    {
      "heading": "Keep view controls and weather coverage in context",
      "body": [
        "Apple Calendar and Teamup document their own week-view controls. Teamup also distinguishes browser configuration from mobile views. Those instructions do not establish the same controls inside Cloud Calendars; choose the view from the app you are actually using.",
        "A week of appointments is not a guarantee of complete weather information for every day or place. For an outdoor slot, check the selected forecast location and available date and hours separately. Then communicate the final arrangement through the agreed channel."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Check the date range and selected calendars.",
    "Read exact start and end times when a block is unclear.",
    "Inspect all-day commitments as well as timed events.",
    "Account for real travel and preparation before offering a gap.",
    "Confirm editing permission, local time and recurrence scope.",
    "Reopen the saved event and confirm important changes directly."
  ],
  "faq": [
    {
      "q": "Does a blank part of the week mean everyone is free?",
      "a": "No. It reflects the calendars and information currently displayed. Check hidden commitments and confirm availability with the people involved."
    },
    {
      "q": "Why can a week look empty despite an all-day commitment?",
      "a": "All-day events are displayed separately from timed blocks. Inspect that area and open the event before offering the time."
    },
    {
      "q": "Should I drag an event whose title I cannot read?",
      "a": "Open its details first. Confirm its identity, calendar, time and intended edit scope before changing it."
    }
  ],
  "sourcesHeading": "Official view descriptions for comparison",
  "sources": [
    {
      "label": "Apple: month, multiple-day and list views in Apple Calendar",
      "url": "https://support.apple.com/en-ca/guide/iphone/iphfd1054569/ios"
    },
    {
      "label": "Teamup: view choices and browser versus mobile settings",
      "url": "https://calendar.teamup.com/kb/how-to-use-calendar-views/"
    }
  ],
  "seeAlso": [
  "month-view-on-a-bigger-screen",
  "a-list-for-people-who-dislike-grids",
  "drag-an-event-to-move-it",
  "calendar-event-or-room-reservation"
]
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
  "updated": "2026-10-22",
  "title": "A weekly calendar review: commitments, time blocks and shared responsibilities",
  "short": "Review the week before adding more",
  "description": "A practical weekly calendar review: check selected calendars, fixed commitments, travel and shared responsibilities before saving realistic time blocks.",
  "lede": "Use a short review to identify what is already fixed and what still needs a decision. The routine below is a suggested workflow, not a promise that every week can be organised in ten minutes. This guide is published by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "Adding enough time blocks automatically makes a realistic plan and tells everyone what they are responsible for.",
  "sections": [
    {
      "heading": "Start with the right dates and calendars",
      "body": [
        "Open the intended week and select the calendars relevant to the plan. Read the date range, not just the weekday labels. A personal view with work hidden can make an unavailable afternoon look clear; a combined view does not automatically share those commitments with anyone else.",
        "Choose one ordinary appointment from each important calendar and check that it appears on the expected date. If a source is missing or stale, resolve that comparison before building the week around an apparent gap. Do not remove an account or duplicate a meeting just to make the overview look complete."
      ]
    },
    {
      "heading": "Separate fixed commitments from proposed blocks",
      "body": [
        "Keep an agreed lesson, client appointment or booked journey at its real time. A block for writing, preparation or errands is a proposal you control; it is not the same as an invitation someone else has accepted. Label a provisional block clearly when another decision is still needed.",
        "For example, a report due on Friday may need preparation earlier in the week. Estimate the work from the actual task and choose a block that fits around existing commitments. There is no universal rule that exactly three discretionary items will fit everyone’s week."
      ]
    },
    {
      "heading": "Include the transitions that use the gaps",
      "body": [
        "Check location and actual start and end times. Travel, setup and a handoff can consume a gap between two appointments even when the hour grid shows empty space. Use a suitable route estimate for the intended time, and keep uncertainty or venue requirements in the plan.",
        "For an afternoon workshop, distinguish the public start from arrival and preparation. If separate entries help, label them so a helper does not confuse a departure block with the workshop itself. This planning convention is not a claim that a personal block automatically reserves time in every connected provider’s availability system."
      ]
    },
    {
      "heading": "Agree responsibilities, not just attendance",
      "body": [
        "A family activity on the calendar may still lack a person responsible for collection. Agree who will act, when and where; record the decision in the intended shared calendar and obtain a direct confirmation. A name in an event title is not an automatic assignment.",
        "Choose the audience deliberately. A private work calendar is not a family handoff channel, and a widely shared schedule may not be suitable for sensitive notes. Check the actual destination and permissions before relying on the entry being visible to someone else."
      ]
    },
    {
      "heading": "Check weather-dependent plans against available information",
      "body": [
        "For an outdoor commitment, inspect the forecast’s selected place, date and hours. An appointment can exist beyond the available forecast range. A blank value is unavailable information, not evidence of dry weather, and a lower rain probability does not by itself describe rain amount or duration.",
        "Choose an appropriate alternative with the people or venue involved and record when the decision will be confirmed. Do not promise that selecting a different hour will avoid a shower or that saving a fallback makes the app relocate the event automatically."
      ]
    },
    {
      "heading": "Save the right destination and review the result",
      "body": [
        "Before saving a new block, check its calendar, date, time zone, duration and any alert. For a repeating commitment, read the intended edit scope instead of rewriting a series to represent one exception. Apple’s multiple-calendar guide describes destination changes in Apple Calendar; use the controls in the app and provider you are actually using.",
        "Reopen the entries you changed, check an important later occurrence and confirm shared changes through the agreed channel. End the review with a short list of unresolved decisions and who will confirm them. A tidy calendar is a useful reference, not proof that the work, travel or handoff has happened."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Confirm the week and selected calendars.",
    "Identify agreed commitments and label provisional blocks.",
    "Include real travel, setup and handoff requirements.",
    "Agree the responsible person and confirm shared access.",
    "Check available weather information and an appropriate alternative.",
    "Verify saved destinations, alerts and repeat scope, then confirm changes."
  ],
  "faq": [
    {
      "q": "Must the review take exactly ten minutes?",
      "a": "No. Use a short review as a starting habit. The needed time depends on missing information and the decisions involved."
    },
    {
      "q": "Does a time block reserve my availability everywhere?",
      "a": "Do not assume that. Check the owning provider and the calendars used for scheduling; a personal combined view is not automatic availability copying."
    },
    {
      "q": "Does adding someone’s name assign the task?",
      "a": "No. This workflow records an agreement. Confirm the responsibility and the person’s access separately."
    }
  ],
  "sourcesHeading": "Official guidance and further reading",
  "sources": [
    {
      "label": "Apple: selecting calendars and moving an event to another calendar",
      "url": "https://support.apple.com/guide/iphone/use-multiple-calendars-iph3d1110d4/ios"
    },
    {
      "label": "Met Office: forecast place, period and precipitation definitions",
      "url": "https://weather.metoffice.gov.uk/guides/what-does-this-forecast-mean"
    }
  ],
  "seeAlso": [
    "a-week-view-that-fits-a-week",
    "family-pickup-calendar-handoff",
    "recurring-events-without-the-mess",
    "reading-a-chance-of-rain"
  ]
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
  "updated": "2026-10-22",
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
      "heading": "When only an imported or subscribed calendar is wrong",
      "body": [
        "Identify the route before changing the appointment: an imported file is a snapshot, while a subscription follows a published source. Compare the same occurrence in the owning calendar and the recipient, including its date, event zone and display zone. Check a date near a seasonal clock change if the event repeats. Keep the original unchanged while establishing where the difference appears.",
        "If the owner’s calendar is correct but one recipient is wrong, record that bounded comparison for support. A feed-format interpretation problem is one possibility, but not every shifted time has that cause. Review access and calendar-data handling before trying a feed-processing service. It is not a replacement for an authorized account connection, and moving the original event can change the real appointment for everyone."
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
    },
    {
      "q": "Should I move the original event if an ICS subscription shows the wrong hour?",
      "a": "First compare that occurrence at its source and recipient, with both event and display zones. Establish whether the issue belongs to the appointment or only to the receiving display. Do not change the real meeting just to compensate for one calendar."
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
    },
    {
      "label": "Google: imported events do not stay in sync",
      "url": "https://support.google.com/calendar/answer/37118?hl=en"
    },
    {
      "label": "Microsoft: published ICS, imports and subscriptions",
      "url": "https://support.microsoft.com/en-us/outlook/share-your-calendar-in-outlook-on-the-web"
    }
  ],
  "seeAlso": [
    "recurring-events-without-the-mess",
    "weather-where-the-event-is",
    "calendar-export-ics-pdf-and-backup"
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
  "updated": "2026-10-22",
  "title": "Calendar list view on iPhone: read the agenda and check what is missing",
  "short": "Use a calendar agenda list",
  "description": "Use calendar list view for upcoming appointments. Check day headings, times, selected calendars and loaded dates; switch to a grid to inspect overlaps.",
  "lede": "An agenda list is useful when the immediate question is what happens next. Read its day headings and times before treating neighbouring rows as a complete picture of your availability. This guide is published by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "Consecutive rows are consecutive free slots, and the list is an unlimited archive of every event.",
  "sections": [
    {
      "heading": "Start with the day heading, not just the next row",
      "body": [
        "Cloud Calendars groups the events in its list by day and orders each group by start time. Read the date heading as well as the time. Two adjacent rows can belong to different days, and an unfamiliar older date is not necessarily a duplicate of today’s meeting.",
        "For a morning appointment followed by an evening reservation, the list is a convenient reading order. It does not show the space between them to scale. Open the details if you need the end time, address or calendar before deciding what fits in between. If a record does not open from the list, locate it in another calendar view rather than creating another copy."
      ]
    },
    {
      "heading": "Switch to an hour grid when overlap is the question",
      "body": [
        "A list can put two overlapping meetings one after the other because it is sorted by start time. That order does not mean the first has finished when the second begins. Compare both start and end times or use a day or week grid to see the overlap.",
        "For example, a 10:00 appointment ending at 11:30 and an 11:00 call remain a conflict even if their rows are tidy. Do not shorten the first event merely to improve the display; confirm the real arrangement before editing either commitment."
      ]
    },
    {
      "heading": "Check the date range before calling an event missing",
      "body": [
        "The Cloud Calendars list loads more events as you move towards its date edges. That is different from a guarantee that every old or future appointment has already been retrieved. Account sync and what the list has loaded are separate checks.",
        "If you need a particular appointment, note its account, calendar and approximate date. Compare that date with the provider’s own view and use the search guidance rather than repeatedly scrolling without a target. Do not delete and reconnect the account just because an old row is absent."
      ]
    },
    {
      "heading": "Inspect long and all-day events in their details",
      "body": [
        "The list groups records by their start date. An event spanning several days needs its start and end checked explicitly; do not infer that each affected date must have a separate row. The absence of a repeated label is not evidence that a trip or other commitment has ended.",
        "Likewise, an all-day event and an event at midnight are different records. Open the appointment to inspect its type and intended dates. When travelling, verify the local date and time rather than treating the row position as a time-zone conversion."
      ]
    },
    {
      "heading": "Separate calendar records from reminders and actions",
      "body": [
        "Use an agenda to read appointments, then confirm what action they require. A calendar entry called “Call supplier” is not proof that the call happened. Attending a meeting, receiving an invitation and completing work are distinct facts.",
        "If a row is missing, check calendar selection and the original record. If its notification was absent, use the notification checks instead. A visible agenda row does not establish that a reminder was enabled or that a participant received an update."
      ]
    },
    {
      "heading": "Choose the view for the task rather than importing another app’s controls",
      "body": [
        "Apple Calendar describes both day-based and upcoming-event lists. Teamup documents its own grouping, range and browser/mobile differences. These are useful comparison questions, not evidence that Cloud Calendars exposes the same menus or export options.",
        "Use list view for reading the sequence, day or week for comparing hours, and month for comparing dates. Before changing a real shared or repeating appointment, open its details and establish the edit scope. Keep the owning calendar clear when asking someone else to confirm the arrangement."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Read the day heading and exact time for each row.",
    "Open details for duration, calendar and location.",
    "Use day or week view to inspect overlapping hours.",
    "Check the account and relevant loaded dates for a missing record.",
    "Inspect the start and end of all-day or multi-day events.",
    "Treat notification delivery and completion as separate checks."
  ],
  "faq": [
    {
      "q": "Do consecutive agenda rows prove the events do not overlap?",
      "a": "No. Start-time sorting is not a duration chart. Compare both events’ start and end times or use an hour grid."
    },
    {
      "q": "Does scrolling the list search all my history?",
      "a": "Do not assume unlimited loaded or synchronized history. Establish the account and date, compare the provider and use the search guide."
    },
    {
      "q": "Must a multi-day event appear as a row on every day?",
      "a": "Do not assume that. The list groups by the record’s start date; open the event to check its full interval."
    }
  ],
  "sourcesHeading": "Official view descriptions for comparison",
  "sources": [
    {
      "label": "Apple: month, multiple-day and list views in Apple Calendar",
      "url": "https://support.apple.com/en-ca/guide/iphone/iphfd1054569/ios"
    },
    {
      "label": "Teamup: view choices and browser versus mobile settings",
      "url": "https://calendar.teamup.com/kb/how-to-use-calendar-views/"
    }
  ],
  "seeAlso": [
    "a-week-view-that-fits-a-week",
    "find-old-calendar-events-by-account-date-and-title",
    "calendar-notifications-missing-silent-or-duplicated"
  ]
},

  'the-year-in-one-screen': {
  "updated": "2026-10-22",
  "title": "Year calendar on iPhone and iPad: inspect dates beyond the overview",
  "short": "Read a year calendar accurately",
  "description": "Use year view to compare months and dates. Understand colour markers, selected calendars and multi-day events before treating an unmarked period as free.",
  "lede": "A year overview helps you locate dates across months. It does not replace the event details needed to confirm a trip, deadline or available period. This guide is published by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "A colour marker counts appointments, and an unmarked date proves that nothing is scheduled.",
  "sections": [
    {
      "heading": "Choose the year and check the calendar selection",
      "body": [
        "Read the displayed year before comparing a deadline with a holiday. Cloud Calendars has year navigation and month tiles; check that you are looking at the intended year and the calendars that matter to the decision.",
        "For example, a course organiser can locate the first and final teaching dates before opening those months in detail. Keep the actual dates written down. A visual distance across month tiles is not an exact count of sessions or working days."
      ]
    },
    {
      "heading": "Read colour markers as an overview, not a count",
      "body": [
        "Cloud Calendars’ year cells use distinct event colours as markers. Several events with the same colour can therefore share a marker. Do not translate the number of dots into the number of appointments or occupied hours.",
        "Colour is a cue to open the date, not an explanation of the commitment. Two calendars can also use a similar colour. Confirm the calendar name and the event’s title before deciding whether a marker represents work, family or a copied record."
      ]
    },
    {
      "heading": "Open the month and then the relevant event",
      "body": [
        "Tap the month to move from the overview towards its dates. Read any extra-event count in month view and open the day or event when a title or interval is unclear. The year tiles are not a full appointment list.",
        "On iPad, the number of month columns changes with the space available; on a phone you may need to scroll. Do not assume that every month is visible at once, or that a smaller window changes the underlying event dates."
      ]
    },
    {
      "heading": "Inspect the full interval for trips and other multi-day events",
      "body": [
        "A trip beginning in one month and ending in the next needs both dates checked. The year overview groups event information by its start date, so it should not be read as a continuous availability chart for the entire trip.",
        "Open the original event and compare its start, end and all-day status. If you need separate setup or return commitments, record the real plan deliberately. Do not extend or duplicate the original appointment merely to make more dates show coloured markers."
      ]
    },
    {
      "heading": "Keep repeating schedules and exact intervals separate",
      "body": [
        "A recurring meeting can have exceptions, an end condition or a clock change between two months. Inspect representative occurrences before assuming that a year-long pattern is unchanged. Use an editor with the intended scope when correcting a single date.",
        "For an exact interval between deadlines, use the dates themselves rather than estimating by the tile layout. State whether you mean calendar days, weeks, working days or sessions; the overview does not automatically make those different counts equivalent."
      ]
    },
    {
      "heading": "Confirm availability beyond the personal overview",
      "body": [
        "A year view reflects the information available from selected calendars. An unmarked stretch is not proof that a colleague can attend, that a venue is open or that an account contains no events outside its synchronized range.",
        "Teamup documents a different year-view configuration in its browser product. Its resource-planning options are not implied Cloud Calendars features. Once you have chosen candidate dates, inspect the actual appointments and confirm the arrangement with the people involved."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Confirm the year and selected calendars.",
    "Treat colour markers as cues rather than event counts.",
    "Open the relevant month, day and event for details.",
    "Check both ends of multi-day commitments.",
    "Inspect repeat exceptions and use actual dates for exact intervals.",
    "Confirm candidate dates with participants and the relevant source calendar."
  ],
  "faq": [
    {
      "q": "Does one dot mean one event?",
      "a": "No. The year overview uses distinct event colours. Several same-colour events can share a marker."
    },
    {
      "q": "Does the entire year always fit on one screen?",
      "a": "No. Available width and layout affect the number of columns, and scrolling may be needed. Open a month for readable event details."
    },
    {
      "q": "Does an unmarked date prove I am available?",
      "a": "No. Check selected calendars, data availability and events spanning dates, then confirm the intended arrangement."
    }
  ],
  "sourcesHeading": "Official view descriptions for comparison",
  "sources": [
    {
      "label": "Apple: month, multiple-day and list views in Apple Calendar",
      "url": "https://support.apple.com/en-ca/guide/iphone/iphfd1054569/ios"
    },
    {
      "label": "Teamup: view choices and browser versus mobile settings",
      "url": "https://calendar.teamup.com/kb/how-to-use-calendar-views/"
    }
  ],
  "seeAlso": [
    "month-view-on-a-bigger-screen",
    "recurring-events-without-the-mess",
    "time-zones-and-the-flight-you-booked"
  ]
},
};
