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
  }
};
