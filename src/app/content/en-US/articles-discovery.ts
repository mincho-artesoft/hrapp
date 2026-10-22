import type { LocalisedArticle } from '../types';

/** Practical intent gaps identified in observed Google results; competitor features are attributed. */
export const DISCOVERY_EN_US: Readonly<Record<string, LocalisedArticle>> = {
  "shift-work-calendar-iphone-rotating-schedules": {
    "updated": "2026-10-22",
    "title": "Shift work calendar on iPhone: plan a rotating schedule without losing changes",
    "short": "Rotating shifts on iPhone",
    "description": "Choose a shift planner or calendar view, anchor a repeating rota, handle overnight shifts and check exported changes alongside personal appointments.",
    "lede": "A rotating work pattern rarely fits neatly into a Monday-to-Friday calendar. The useful setup keeps the employer’s latest rota authoritative while letting you see work beside appointments and family plans. This guide is published by Arte Soft, the developer of Cloud Calendars.",
    "sections": [
      {
        "heading": "Choose a shift planner or a calendar overview",
        "body": [
          "A specialist rota app answers “which shift am I working?” A combined calendar answers “what else have I committed to that day?” You may need both. Supershift documents rotation entry, while MyShiftPlanner publishes setup guides for several shift patterns. Choose a specialist if generating a long repeating rota is the main task.",
          "Cloud Calendars provides day, week, month, year and list views for selected calendars on iPhone and iPad. It can help you review work alongside personal plans. This guide does not present it as an employer rostering system, payroll calculator or automatic rotation generator."
        ]
      },
      {
        "heading": "Anchor the cycle to a known date",
        "body": [
          "Consider an illustrative eight-day cycle: two day shifts, two night shifts and four days off. If the first day shift starts on Monday 2 November 2026, the next cycle begins on Tuesday 10 November. Repeating that first shift every Monday would move the pattern away from the intended cycle.",
          "Write the cycle in order and match its first date against the published rota. Check the next two cycles, including weekends. A rota template is a starting pattern; leave, swaps and employer changes still need to be reflected. Do not extrapolate an unconfirmed pattern and treat it as an assigned shift."
        ]
      },
      {
        "heading": "Give overnight work an explicit end date",
        "body": [
          "For a night shift starting at 20:00 on Thursday and ending at 08:00 on Friday, enter both dates. An all-day marker loses the working hours, and an end time entered on the wrong date can produce the wrong duration. Review the event in both day and week views.",
          "Use a neutral title such as “Night shift” if a family member only needs to know availability. Keep workplace addresses, colleague details and confidential notes out of a shared calendar unless they are necessary and appropriate to share. Add commuting or recovery time as separate personal planning blocks where useful."
        ]
      },
      {
        "heading": "Distinguish display, export and a subscribed feed",
        "body": [
          "Supershift’s external-calendar guide says operating-system calendar accounts can be selected for display or export. It also warns that enabling export on several devices can create duplicates. Follow the source app’s instructions and choose one export device for that workflow.",
          "Before connecting your main work schedule, use a disposable example in a separate calendar. Change its time in the source and inspect the destination. Record whether a later edit updates an existing entry, adds a second one or needs another export. A one-time file import should not be assumed to behave like an ongoing subscription."
        ]
      },
      {
        "heading": "Make changes visible to the people who depend on them",
        "body": [
          "After a swap, check the original rota first, then the personal calendar and any shared availability. A screenshot sent last week will not update itself. Agree who maintains the family-facing calendar and how an urgent change is confirmed.",
          "For a practical weekly review, compare the next shift, the next overnight finish and the next personal appointment. Check alert settings in the app that is responsible for the reminder. Keep the employer’s published schedule accessible; a personal calendar is a planning aid, not confirmation that a shift change was approved."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Choose whether you need rotation generation, a combined overview or both.",
      "Anchor the cycle to a confirmed date and check two complete cycles.",
      "Check the following-day end date of every overnight shift.",
      "Test one source edit before relying on an export or feed.",
      "Review swaps and shared availability against the employer’s current rota."
    ],
    "faq": [
      {
        "q": "Can I repeat a rotating shift every week?",
        "a": "Only if the real pattern repeats weekly. An eight-day cycle moves across weekdays. Use a suitable rotation tool or explicitly verified entries rather than a weekly shortcut."
      },
      {
        "q": "Does viewing shifts in another calendar update the original rota?",
        "a": "Visibility alone does not establish editing or synchronisation. Check the connection type and verify a disposable change at both ends."
      },
      {
        "q": "Is Cloud Calendars a shift-management system?",
        "a": "It is an iPhone and iPad calendar app for planning with selected calendars. For generating specialist shift patterns or administering a workforce, evaluate a dedicated rota tool."
      }
    ],
    "sourcesHeading": "Official product documentation",
    "sources": [
      {
        "label": "Supershift: rotations, external calendars and duplicate exports",
        "url": "https://www.supershift.app/help.html"
      },
      {
        "label": "MyShiftPlanner: shift-pattern guides and worker/manager tools",
        "url": "https://myshiftplanner.com/"
      },
      {
        "label": "Apple: creating and editing event dates and times",
        "url": "https://support.apple.com/guide/iphone/create-and-edit-events-iph3d110f84/ios"
      }
    ],
    "seeAlso": [
      "recurring-events-without-the-mess",
      "icloud-google-and-outlook-in-one-view",
      "calendar-export-ics-pdf-and-backup"
    ]
  },
  "booking-link-or-shared-calendar": {
    "updated": "2026-10-22",
    "title": "Booking link, event invitation or shared calendar: which should you send?",
    "short": "Booking versus calendar sharing",
    "description": "Let someone choose a time, invite them to an existing meeting or share an ongoing schedule. Compare booking links with invitations and calendar access.",
    "lede": "“Send me your calendar” can mean three different things: offer a choice of appointment times, invite someone to a meeting already arranged, or give continuing access to a schedule. Choosing the right link avoids both extra messages and unnecessary disclosure. Arte Soft, the developer of Cloud Calendars, publishes this guide.",
    "sections": [
      {
        "heading": "Use a booking page when the time is still undecided",
        "body": [
          "Suppose a client needs a thirty-minute call next week and should choose from your available slots. A booking service is designed for that decision. Set the meeting duration, availability and any required gap between calls before sharing its link. Review the actual slots as a visitor before sending it to a client.",
          "Calendly documents links to an individual event type or to a landing page containing active event types. Those destinations serve different purposes: a specific consultation should not accidentally lead to every service you offer. Check the current plan for the controls you need rather than assuming all scheduling features are included."
        ]
      },
      {
        "heading": "Use an invitation when the meeting is already arranged",
        "body": [
          "If you have agreed Tuesday at 14:00, create the event with the right time zone and participants, then send an invitation through the calendar’s supported workflow. The recipient is responding to a proposed event; they are not selecting a free slot from your week.",
          "A meeting URL is another separate item. A video-call link explains where to join, while a calendar invitation carries scheduling details. Sending only a call link may leave the recipient without an appointment or a reminder. Check the saved event and the participant response before assuming the arrangement is complete."
        ]
      },
      {
        "heading": "Share a calendar for continuing coordination",
        "body": [
          "A household coordinating pickups needs an ongoing schedule rather than a new booking page for each pickup. Decide whether the other person needs to view details, edit events or simply know that a time is occupied. Give the least access that accomplishes the task.",
          "Cloud Calendars brings selected schedules into an iPhone and iPad planning view and supports calendar-sharing workflows. That does not make a shared-calendar URL an appointment-booking page. Use the sharing controls for the relevant calendar and a dedicated booking workflow when visitors need to choose a slot."
        ]
      },
      {
        "heading": "Inspect what a public booking link reveals",
        "body": [
          "Google’s appointment-schedule documentation says its booking page is public and that people with its link can see the booking page, profile photo and account name. Hiding a calendar in your own list does not make that page private. Open the shared destination as a visitor and review the identity and service information it displays.",
          "Avoid placing a private calendar-feed address in a public profile as a substitute for a booking link. Those links have different jobs and access implications. Share the intended booking-page URL, not an editing link or an account-management page copied from your own browser."
        ]
      },
      {
        "heading": "Check the result through the complete appointment lifecycle",
        "body": [
          "Try an example with a colleague: choose a slot, verify the time zone shown to each person, inspect the confirmation and then test the documented cancellation or rescheduling route. Remove the test appointment afterwards through the normal organiser controls.",
          "For your own setup, keep a short checklist: which calendars affect availability, where a booked event is saved, who receives a confirmation and how a change is communicated. Reading several calendars together does not establish that a booking service checks all of them. Confirm those settings in the service doing the booking."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Choose between slot selection, an existing-event invitation and ongoing calendar access.",
      "Share the specific destination intended for that task.",
      "Review the visitor view and any public identity details.",
      "Test time zones, confirmation and rescheduling with a harmless appointment.",
      "Check which connected calendars actually affect booking availability."
    ],
    "faq": [
      {
        "q": "Is a shared calendar a booking link?",
        "a": "No. Calendar access lets someone view or manage a schedule under the permissions you grant. A booking page offers appointment choices through its own availability rules."
      },
      {
        "q": "Can I just send the video-call URL?",
        "a": "That may explain how to join, but it does not by itself establish a saved calendar event, acceptance or reminder. Include the appropriate invitation for an arranged meeting."
      },
      {
        "q": "Does connecting a calendar automatically protect every busy time?",
        "a": "Do not assume so. Check the booking service’s availability settings and test a conflicting appointment in each relevant calendar."
      }
    ],
    "sourcesHeading": "Official product documentation",
    "sources": [
      {
        "label": "Google Calendar: appointment links and public booking-page information",
        "url": "https://support.google.com/calendar/answer/10733297?hl=en"
      },
      {
        "label": "Calendly: individual event-type links and landing pages",
        "url": "https://calendly.com/help/how-to-share-your-scheduling-link"
      },
      {
        "label": "Apple: event details, invitees and video links",
        "url": "https://support.apple.com/guide/iphone/create-and-edit-events-iph3d110f84/ios"
      }
    ],
    "seeAlso": [
      "sharing-one-event-not-your-calendar",
      "a-calendar-that-is-yours-to-share",
      "meeting-links-that-make-themselves"
    ]
  },
  "natural-language-calendar-events-iphone": {
    "updated": "2026-10-22",
    "title": "Natural-language calendar events on iPhone: enter quickly, check before saving",
    "short": "Natural-language event entry",
    "description": "Compare typed sentences, dictation, templates and manual calendar entry on iPhone. Check dates, duration, guests and destination before saving an event.",
    "lede": "Typing “dentist next Friday at 3” can be faster than opening several fields, but the useful result is a correctly saved appointment. Natural-language parsing, dictation and copying an event are different shortcuts. This guide is published by Arte Soft, the developer of Cloud Calendars.",
    "sections": [
      {
        "heading": "Check what the input method actually does",
        "body": [
          "Natural-language entry converts a sentence into structured event details. Dictation first turns speech into text; the field receiving that text still determines whether a date becomes an event time or remains part of a title. A template starts from previously chosen details instead of interpreting a new sentence.",
          "Fantastical’s iOS guide explicitly documents natural-language entry for events and tasks. It also describes choosing a calendar using a slash followed by its name. These are Fantastical-specific instructions, not commands that every iPhone calendar app understands. Check the help for the app in which you are entering the event."
        ]
      },
      {
        "heading": "Use an explicit example to test the preview",
        "body": [
          "Try a harmless example: “Equipment check on 6 November 2026 from 15:00 to 15:40.” Before saving, inspect the date, start, end, title and destination calendar. The example uses an explicit date and end time so you can see what the parser actually extracted.",
          "Next test the shorthand you normally use, such as “next Friday” or “3–4”. Compare the preview with your intended date and AM/PM choice. If the interpretation differs, edit the structured fields. A quick-entry feature saves time only when you can notice and correct an ambiguous interpretation."
        ]
      },
      {
        "heading": "Review participants and recurrence separately",
        "body": [
          "Names in a sentence may be part of a title or may trigger a contact suggestion. Before saving a real meeting, inspect the attendee field and the chosen address. Do not use an important customer invitation as your first parser test.",
          "For recurring appointments, check both the interval and the end condition. “Every other Tuesday” is different from twice a month, and a title containing the word “weekly” does not prove that recurrence was configured. Preview several dates in the calendar after saving a private test event."
        ]
      },
      {
        "heading": "Choose a template or copy for a familiar appointment",
        "body": [
          "If most details stay the same, a template may be more convenient than rewriting a sentence. Fantastical documents creating a template from an existing item and reviewing its details before adding a new event. Keep the changed date, location and participants in the review rather than assuming a template is safe unchanged.",
          "Apple’s Calendar guide documents copying an event and pasting it at another date, where a new-event screen lets you review the copied details. That is a separate workflow from editing the original meeting. Confirm whether you are creating a new appointment or changing an existing one before notifying anyone."
        ]
      },
      {
        "heading": "Keep manual entry available",
        "body": [
          "Cloud Calendars offers event editing alongside day, week, month, year and list planning views. Use the explicit event fields for the date, time and calendar you intend. This article does not promise Fantastical’s sentence parser or template commands in Cloud Calendars.",
          "For a practical comparison, enter the same private appointment using the methods available in each app. Compare the saved result, the corrections needed and how easily you can check it. A faster typing experience is useful; reliable calendar selection and an obvious confirmation screen matter just as much."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Identify whether the feature parses a sentence, dictates text or copies saved details.",
      "Test with a private event using an explicit date and start/end time.",
      "Inspect the destination calendar, participants and recurrence.",
      "Check the saved appointment in the calendar view.",
      "Use structured fields when shorthand is ambiguous."
    ],
    "faq": [
      {
        "q": "Does dictating a sentence automatically schedule it?",
        "a": "Not necessarily. Dictation enters text; the app and field receiving it determine whether event details are parsed. Check the structured event preview before saving."
      },
      {
        "q": "Can I use Fantastical’s slash-calendar syntax in every app?",
        "a": "No. Its help documents that syntax for Fantastical. Another app may use different controls or require explicit field selection."
      },
      {
        "q": "Is copying an event the same as rescheduling it?",
        "a": "No. A copy can create a new appointment while the original remains. Review the operation and the saved calendar before changing an existing commitment."
      }
    ],
    "sourcesHeading": "Official product documentation",
    "sources": [
      {
        "label": "Fantastical: natural-language entry, calendar selection and templates",
        "url": "https://flexibits.com/fantastical-ios/help/adding-events-and-tasks"
      },
      {
        "label": "Apple: create, copy and edit calendar events on iPhone",
        "url": "https://support.apple.com/guide/iphone/create-and-edit-events-iph3d110f84/ios"
      }
    ],
    "seeAlso": [
      "event-saved-to-wrong-calendar",
      "recurring-events-without-the-mess",
      "drag-an-event-to-move-it"
    ]
  },
  "cozi-timetree-family-calendar-iphone-android": {
    "updated": "2026-10-22",
    "title": "Cozi or TimeTree for an iPhone and Android family? Check sharing and updates",
    "short": "Cozi and TimeTree for mixed-device families",
    "description": "Compare Cozi and TimeTree for family calendars across iPhone and Android. Check external feeds, imported events, permissions and urgent changes.",
    "lede": "For a family using both iPhone and Android, the first requirement is a shared schedule everyone can actually use. The second is knowing which changes reach the other people. Cozi and TimeTree offer different routes for existing calendars. Arte Soft, the developer of Cloud Calendars, publishes this comparison using the linked product documentation.",
    "sections": [
      {
        "heading": "Choose the household workflow first",
        "body": [
          "Cozi describes a family organizer available on iPhone, Android and the web, combining a shared calendar with lists and meal planning. TimeTree describes separate shared calendars for groups such as family, school and hobbies. Decide whether you want one household organizer or several group schedules before comparing visual styles.",
          "For a practical trial, choose a fictional pickup and let two adults add and edit it from their own devices. Check where each person sees the latest time and who is responsible. Colour coding and visibility help with planning; neither alone proves that somebody has accepted a last-minute responsibility."
        ]
      },
      {
        "heading": "Understand Cozi’s external-calendar feeds",
        "body": [
          "Cozi’s integration guide describes read-only feeds both into and out of Cozi. An appointment originating elsewhere should be edited at its source. Seeing it inside Cozi does not establish that editing it there will change the original account.",
          "The guide also distinguishes when the source publishes an update from when the receiving calendar checks for it. Do not rely on a subscribed copy as an immediate notification channel. For today’s pickup change, confirm the new arrangement directly as well as updating the authoritative calendar."
        ]
      },
      {
        "heading": "Choose the right TimeTree method",
        "body": [
          "TimeTree’s external-calendar help separates displaying a device calendar on Home Calendar from importing it into a shared calendar. Its comparison says display updates automatically but is not shared with others; an import can be shared but does not automatically update.",
          "The same help page says TimeTree events are not automatically reflected in external calendars. Before using an import for a changing school timetable, establish who will maintain the shared copy. Do not assume a successful first import means later changes will keep arriving."
        ]
      },
      {
        "heading": "Keep the shared schedule separate from private detail",
        "body": [
          "Create a small family-facing schedule with only the information needed for coordination. “Unavailable until 18:00” may be sufficient instead of a full work-meeting title. Confirm the members of a shared calendar and the access of a person newly invited to it.",
          "For a school schedule, use the provider-approved sharing route and avoid publishing private feed addresses in a public group or profile. If a work account has restrictions, follow those restrictions rather than exporting its contents merely to make a family app more convenient."
        ]
      },
      {
        "heading": "Decide where Cloud Calendars fits",
        "body": [
          "Cloud Calendars is an iPhone and iPad planning app with selected calendars, multiple views, weather and widgets. It is not an Android calendar client. If everyone must edit inside the same app on iPhone and Android, evaluate a product that supports both devices.",
          "An iPhone user may instead keep an existing shared provider calendar and review it beside personal commitments in Cloud Calendars. Check membership, provider permissions and the actual change path. This is different from promising the same native app experience on every household device."
        ]
      },
      {
        "heading": "Test a change before moving the household",
        "body": [
          "Run one addition, one time change and one cancellation using harmless example events. On each phone, inspect the intended calendar rather than a similarly named copy. Keep a note of where edits must be made and how urgent changes are confirmed.",
          "Review current local plan requirements for the views, notifications and other features your family needs. A free download does not imply every feature is included. Keep the previous schedule available until everyone can find and update the new one."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Confirm that every participant’s device is supported.",
      "Choose one authoritative shared schedule.",
      "Distinguish a live display, read-only feed and imported copy.",
      "Test an edit and cancellation from both phones.",
      "Agree who owns each pickup and how an urgent handoff is acknowledged."
    ],
    "faq": [
      {
        "q": "Does importing an external calendar into TimeTree keep it updated?",
        "a": "TimeTree’s current help says shared-calendar imports do not auto-update. It describes a separate Home Calendar display method that updates but is not shared with others."
      },
      {
        "q": "Can I edit a Google event through a Cozi read-only feed?",
        "a": "The documented feed is read-only. Make the change in the originating calendar and allow for the receiving calendar’s refresh behaviour."
      },
      {
        "q": "Can everyone use Cloud Calendars on Android?",
        "a": "Cloud Calendars is for iPhone and iPad. For a household requiring one native app on both iPhone and Android, compare cross-platform alternatives such as Cozi and TimeTree."
      }
    ],
    "sourcesHeading": "Official sources checked for this comparison",
    "sources": [
      {
        "label": "Cozi: supported devices and family organizer features",
        "url": "https://www.cozi.com/"
      },
      {
        "label": "Cozi: read-only connections and refresh behaviour",
        "url": "https://www.cozi.com/using-cozi-with-other-calendars/"
      },
      {
        "label": "TimeTree: shared calendars for separate groups",
        "url": "https://timetreeapp.com/intl/en"
      },
      {
        "label": "TimeTree: external-calendar display versus shared import",
        "url": "https://support.timetreeapp.com/hc/en-us/articles/360000629341-How-to-Use-Other-Calendars-such-as-Google-Calendar"
      }
    ],
    "seeAlso": [
      "family-pickup-calendar-handoff",
      "a-calendar-that-is-yours-to-share",
      "what-calendar-sync-actually-does"
    ]
  },
  "iphone-calendar-tasks-reminders-versus-event-alerts": {
    "updated": "2026-10-22",
    "title": "Tasks and reminders in an iPhone calendar: choose the right kind of item",
    "short": "Tasks, reminders and event alerts",
    "description": "See tasks beside appointments without confusing due dates, work time and alerts. Compare Apple Calendar and Readdle task integration on iPhone.",
    "lede": "A meeting at 11:00, a task due on Friday and an alert thirty minutes before a meeting describe different things. A useful combined calendar preserves those differences while helping you decide what to do next. This guide is published by Arte Soft, the developer of Cloud Calendars.",
    "sections": [
      {
        "heading": "Separate an appointment, an action and an alert",
        "body": [
          "Use an event for a commitment occupying an agreed period, such as a call from 11:00 to 11:30. Use a task for an action you need to finish, such as sending the revised document. An event alert is a notification about the appointment; dismissing it does not mean the document was sent.",
          "A task’s due time is also different from the time needed to do it. If a document is due at 17:00 and needs forty minutes of work, a 17:00 marker does not reserve those forty minutes. Plan a suitable work block earlier and keep the task’s completion state in its task system."
        ]
      },
      {
        "heading": "Use Apple Calendar with scheduled Apple Reminders",
        "body": [
          "Apple documents showing, creating, editing and completing reminders inside its Calendar app. To show them, open Calendar, tap Calendars and select Scheduled Reminders. All-day reminders appear in the all-day area; reminders with a time appear at that time.",
          "These instructions belong to Apple Calendar and Apple Reminders. They do not establish that every third-party calendar displays the same tasks simply because it has access to calendar events. Check task support and permissions separately from ordinary event access."
        ]
      },
      {
        "heading": "Check the chosen task system in Calendars by Readdle",
        "body": [
          "Readdle documents tasks through iOS Reminders or Google Tasks. Its setup guide directs iPhone users to Settings, Task Options and the selected task source. Confirm which list you are using before moving tasks between devices or expecting a completed item to disappear elsewhere.",
          "Its task guide describes marking items complete and placing tasks on a timeline, including duration adjustments in iPhone Day view. These are documented task features of Calendars by Readdle. Check its current plan and installed version for the exact workflow; do not infer task compatibility from Google Calendar event syncing alone."
        ]
      },
      {
        "heading": "Test completion as well as visibility",
        "body": [
          "Create a disposable task in the system you actually use, give it a due date and inspect it in the calendar. Mark it complete, then inspect the original task list. This distinguishes a functioning task connection from a copied event with a similar title.",
          "Repeat with an undated task if those are important to your workflow. A calendar showing scheduled tasks may not provide the same view of an entire backlog. Before deleting anything, establish whether you are removing a work block, deleting a task or merely hiding a list."
        ]
      },
      {
        "heading": "Use a calendar block without pretending it is a task integration",
        "body": [
          "Cloud Calendars lets you plan with calendar events in day, week, month, year and list views. You can reserve a period for work as an ordinary event and keep the associated task in your existing task app. This article does not promise a task-completion connection to Apple Reminders or Google Tasks in Cloud Calendars.",
          "Choose the simpler setup that satisfies your need. If checking off tasks inside the calendar is essential, test an app with documented task support. If you mainly need to compare available hours with appointments, an event-based planning view may be enough."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Write down whether you need an event, a task or a notification.",
      "Identify the task account and list that own completion status.",
      "Show scheduled tasks using the documented controls for that app.",
      "Check one harmless completion in both the calendar and original task list.",
      "Reserve work time before the due date when the task needs a substantial block."
    ],
    "faq": [
      {
        "q": "Does a reminder alert mean the task is complete?",
        "a": "No. An alert attracts attention; task completion is a separate state. Dismissing an event notification is not the same as checking off a task."
      },
      {
        "q": "Does syncing Google Calendar prove Google Tasks works too?",
        "a": "No. Events and tasks are different data. Check the app’s documented task source and verify one task in its original list."
      },
      {
        "q": "Why can I see a due date but still have no time to do the work?",
        "a": "A due date says when the result is needed. Reserve enough work time before that deadline instead of treating a deadline marker as an allocated work session."
      }
    ],
    "sourcesHeading": "Official sources checked for this comparison",
    "sources": [
      {
        "label": "Apple: use scheduled Reminders inside Calendar",
        "url": "https://support.apple.com/en-ie/guide/iphone/iph14f1d32a5/27/ios/27"
      },
      {
        "label": "Readdle: task completion and timeline features",
        "url": "https://support.readdle.com/calendars/calendars-premium/tasks-in-calendars"
      },
      {
        "label": "Readdle: choose iOS Reminders or Google Tasks",
        "url": "https://support.readdle.com/calendars/synchronization/how-to-sync-tasks-with-ios-reminders-or-google-tasks"
      }
    ],
    "seeAlso": [
      "planning-a-week-in-ten-minutes",
      "calendar-notifications-missing-silent-or-duplicated",
      "natural-language-calendar-events-iphone"
    ]
  },
  "automatic-time-blocking-versus-manual-calendar": {
    "updated": "2026-10-22",
    "title": "Automatic time blocking or manual calendar planning? Compare the controls",
    "short": "Automatic versus manual time blocking",
    "description": "Compare FlowSavvy, Motion and Morgen with manual calendar blocks. Check task duration, busy time, working hours and rescheduling before relying on automation.",
    "lede": "Time blocking means reserving time for work. Automatic scheduling adds a separate decision: software chooses where tasks fit and may move them when the day changes. Choose how much control to delegate before comparing an AI planner with a calendar app. Arte Soft, the developer of Cloud Calendars, publishes this guide.",
    "sections": [
      {
        "heading": "Start with what is fixed and what can move",
        "body": [
          "A client call at an agreed time is a commitment. Preparing its slides is work that might fit into several earlier periods. Keep the call fixed and decide how the preparation may move. Dragging an ordinary calendar block yourself is manual planning; asking a service to select a new slot is automation.",
          "For an illustrative day, suppose you have seventy-five minutes of preparation and two free forty-minute periods before the call. A single uninterrupted block cannot fit, but a task that may be split could. Decide whether splitting is acceptable before evaluating a scheduler’s proposed result."
        ]
      },
      {
        "heading": "FlowSavvy: choose the hours available to each kind of task",
        "body": [
          "FlowSavvy’s scheduling-hours guide describes profiles that constrain when tasks may be placed, with date overrides for exceptions. It distinguishes the free plan’s single profile from the additional profiles in Pro. Check the current plan if work and personal tasks need different windows.",
          "Its guide also explains that a busy all-day event can block a whole day from scheduling. Inspect busy/free status rather than relying only on how a coloured block looks. A holiday that appears visually but is not treated as unavailable may produce a different plan than you intended."
        ]
      },
      {
        "heading": "Motion: understand deadline and rescheduling behaviour",
        "body": [
          "Motion documents placing tasks according to availability, duration, deadlines and priorities, then adjusting them when meetings change. It also describes splitting work into chunks when configured. Use realistic durations and inspect the changed plan after adding a new commitment.",
          "A particularly important rule is its hard-deadline behaviour: the documentation says work may be placed outside normal scheduling hours to meet that deadline. Review that outcome explicitly. A scheduled block is a proposed allocation of time, not a guarantee that the work will be completed or that extra working hours are acceptable."
        ]
      },
      {
        "heading": "Morgen: preview a suggested plan before accepting it",
        "body": [
          "Morgen describes an AI Planner that recommends task placements using Frames, allows adjustments and asks you to confirm the plan. It also lists task integrations such as Notion, ClickUp, Linear and Todoist. Check the current integration and device workflow that matches your actual task source.",
          "This preview-and-confirm approach is a different interaction from assuming every task should move without review. During a trial, inspect what changes automatically and what waits for your confirmation. Decide which approach you can comfortably maintain on a busy day."
        ]
      },
      {
        "heading": "Cloud Calendars: keep manual planning explicit",
        "body": [
          "Cloud Calendars offers calendar views and event editing on iPhone and iPad. Use ordinary events to reserve focus periods around commitments and move those periods when your plan changes. It is not presented here as an automatic task scheduler.",
          "Manual planning can suit a short list where the reason for each placement is easy to remember. Automation may be worth evaluating when many flexible tasks must fit around changing meetings. Compare the result and maintenance effort, rather than choosing solely because a product uses an AI label."
        ]
      },
      {
        "heading": "Test overload instead of only testing a perfect day",
        "body": [
          "Try three harmless examples: a task that fits, a conflicting meeting added later and more work than the remaining day can hold. Check the warning, unscheduled work, changed blocks and any work pushed beyond your preferred hours. Do not test by sending invitations to real participants.",
          "Keep the original task list and calendar until the result is clear. Check which calendars influence availability, where generated blocks are saved and how to stop or undo the workflow using the service’s controls. Those details determine whether the setup is useful when plans change."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Separate fixed commitments from work that may move.",
      "Estimate task duration and whether splitting is acceptable.",
      "Set working hours, exceptions and the calendars used for availability.",
      "Test a conflict and a day with insufficient capacity.",
      "Review the changed plan and how to pause or reverse the workflow."
    ],
    "faq": [
      {
        "q": "Does time blocking require AI?",
        "a": "No. You can reserve time with ordinary calendar events and move it manually. Automatic scheduling is an additional feature that selects or adjusts task placements."
      },
      {
        "q": "Can an automatic scheduler guarantee my work will be finished?",
        "a": "No. It can allocate time using the information supplied. Actual completion still depends on available capacity, realistic estimates and doing the work."
      },
      {
        "q": "Why might work appear outside normal hours?",
        "a": "Check the service’s rules and task settings. Motion’s documentation specifically describes hard-deadline tasks being scheduled outside normal hours when needed to meet the deadline."
      }
    ],
    "sourcesHeading": "Official sources checked for this comparison",
    "sources": [
      {
        "label": "FlowSavvy: scheduling profiles, overrides and busy days",
        "url": "https://help.flowsavvy.app/en/articles/6970339-scheduling-hours"
      },
      {
        "label": "Motion: automatic scheduling, chunking and deadline rules",
        "url": "https://www.usemotion.com/help/time-management/auto-scheduling"
      },
      {
        "label": "Morgen: AI Planner previews, adjustments and task integrations",
        "url": "https://www.morgen.so/"
      }
    ],
    "seeAlso": [
      "planning-a-week-in-ten-minutes",
      "iphone-calendar-tasks-reminders-versus-event-alerts",
      "drag-an-event-to-move-it"
    ]
  },
  "what-is-a-cloud-calendar": {
    "updated": "2026-10-22",
    "title": "What is a cloud calendar? Accounts, apps and shared schedules explained",
    "short": "What a cloud calendar means",
    "description": "Understand cloud calendars, calendar apps and shared access. Compare Google, iCloud and Outlook accounts, local copies and the Cloud Calendars app.",
    "lede": "A cloud calendar stores a schedule with an online service so authorised devices and people can work with it. The service, the calendar inside it and the app used to view it are different parts of the setup. Arte Soft, the developer of the Cloud Calendars iPhone and iPad app, publishes this explanation.",
    "sections": [
      {
        "heading": "Separate the account, calendar and app",
        "body": [
          "The account identifies you to a service such as Google, iCloud or Outlook.com. Within an account you may have more than one calendar, such as personal appointments and a shared household schedule. A calendar app provides the interface for viewing and editing the calendars it supports.",
          "For example, a family appointment may belong to a Google calendar while an iPhone app displays it beside an iCloud appointment. Seeing both together does not mean the records moved to one account. Check the calendar selected in the event editor when you need to know where a new appointment will be saved."
        ]
      },
      {
        "heading": "Understand what the online service adds",
        "body": [
          "Apple describes iCloud Calendar as keeping calendars in the cloud and available across configured devices, with sharing for other iCloud users. Google’s getting-started guide describes using Google Calendar through a Google Account. These are examples of calendar services rather than just visual layouts.",
          "An online account can provide a common source for supported devices, but it does not make every connection identical. A full account connection, a read-only subscription and an imported file have different update behaviour. Establish which route you used before expecting an edit to reach another device."
        ]
      },
      {
        "heading": "A cloud calendar is not automatically public",
        "body": [
          "Storing a calendar online does not itself say who may see or edit it. Microsoft’s Outlook.com sharing guide distinguishes view and edit permissions and also describes publishing a calendar. Review the intended audience and access level in the service that owns the schedule.",
          "Use a household calendar for household commitments and keep private work details out of it unless sharing them is appropriate and permitted. A convenient combined view on your own phone is different from giving another person continuing access. Verify access from the recipient’s account when that distinction matters."
        ]
      },
      {
        "heading": "Cloud storage and offline access are separate questions",
        "body": [
          "A calendar app may keep previously loaded events available locally. That does not prove that every historical appointment, attachment or new change is available without internet. Before a trip, check the dates and details you will need while still connected.",
          "Use a harmless appointment to test the actual app and account offline. If editing is allowed, confirm the result at the online source after reconnecting. Keep a separate record of essential travel details; do not sign out or remove a calendar account merely to simulate a lost connection."
        ]
      },
      {
        "heading": "Where the Cloud Calendars app fits",
        "body": [
          "Cloud Calendars is the name of our iPhone and iPad planning app. It offers selected-calendar views, weather, widgets and calendar connections. Its name should not be read as a claim that every calendar service has the same features, or that installing it changes who owns an existing Google or iCloud calendar.",
          "Choose the service for the accounts, sharing and organisational requirements you need. Then choose an app for the planning experience on your devices. If your aim is to compare several schedules at once, check supported connections and plan requirements rather than assuming you must migrate every appointment."
        ]
      },
      {
        "heading": "Confirm one appointment before migrating a schedule",
        "body": [
          "Create a private test appointment in a calendar you own. Check its account, date, time and title at the provider, then inspect it on the second device. If the connection allows editing, change the test and check the original source again. This verifies the result you actually need rather than only a successful sign-in.",
          "Keep originals until the required dates and changes have been checked. A synchronised calendar is also not automatically a separate backup: deleting an original may be reflected elsewhere. Review the provider’s recovery and export options before moving or deleting a real schedule."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Identify the account that owns each calendar.",
      "Check the destination calendar before saving an event.",
      "Distinguish account sync, a feed subscription and a file import.",
      "Review sharing permissions separately from your combined view.",
      "Verify one harmless appointment on both devices before switching."
    ],
    "faq": [
      {
        "q": "Is iCloud Calendar the same thing as the Cloud Calendars app?",
        "a": "No. iCloud Calendar is Apple’s calendar service. Cloud Calendars is an iPhone and iPad app developed by Arte Soft that can help you plan with selected calendars."
      },
      {
        "q": "Does cloud calendar mean everyone can see it?",
        "a": "No. Access depends on sharing and publishing settings. Review who is invited, what they may see and whether they can edit."
      },
      {
        "q": "Can one app show several cloud calendars?",
        "a": "An app that supports the relevant accounts or calendar connections can provide a combined view. That does not by itself merge ownership, copy availability between accounts or grant new sharing permissions."
      }
    ],
    "sourcesHeading": "Provider documentation",
    "sources": [
      {
        "label": "Apple: iCloud Calendar across devices and sharing",
        "url": "https://support.apple.com/en-ie/guide/icloud/mm15eb200ab4/icloud"
      },
      {
        "label": "Google: getting started with Google Calendar",
        "url": "https://support.google.com/calendar/answer/2465776?hl=en"
      },
      {
        "label": "Microsoft: Outlook.com calendar access and publishing",
        "url": "https://support.microsoft.com/en-us/outlook/share-your-calendar-in-outlook-com"
      }
    ],
    "seeAlso": [
      "icloud-google-and-outlook-in-one-view",
      "what-calendar-sync-actually-does",
      "a-calendar-that-is-yours-to-share"
    ]
  }
};
