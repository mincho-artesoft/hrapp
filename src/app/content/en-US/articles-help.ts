import { LocalisedArticle } from '../types';

export const HELP_EN_US: Readonly<Record<string, LocalisedArticle>> = {
  "calendar-notifications-missing-silent-or-duplicated": {
    "updated": "2026-10-21",
    "title": "Calendar notifications on iPhone: missing, silent or duplicated?",
    "short": "Troubleshoot calendar notifications",
    "description": "Separate event alerts, Cloud Calendars settings and iPhone delivery controls. Diagnose absent, silent or duplicate reminders without deleting calendar data.",
    "lede": "Start with what actually happened: was the event missing, was its notification absent, did it appear without sound, or did two apps alert you? Each points to a different check. This guide is published by Arte Soft, the developer of Cloud Calendars.",
    "commonBelief": "If an event appears in the calendar, every alert and notification permission must already be configured.",
    "sections": [
      {
        "heading": "First choose the right branch",
        "body": [
          "If the event itself is absent, check its owning account and selected calendar before changing sound settings. An alert cannot establish whether the correct event has reached the app. Use the calendar-sync guide for that separate problem.",
          "If the event is visible but no notification appears, check the saved alert and both notification controls below. If a notification appears silently, concentrate on iPhone delivery and sound settings. If you receive more than one, identify each sending app and each configured alert before removing anything."
        ]
      },
      {
        "heading": "No notification: inspect the event and app controls",
        "body": [
          "Open the event and inspect its alert time. The Cloud Calendars event editor has Alert and, when applicable, Second Alert controls, including None and choices before the event. A second alert can be intentional. Check the saved event again after an edit, especially when a provider or shared-calendar permission limits what you can change.",
          "In Cloud Calendars settings, look for Event Notifications. The settings also separate invitation and weather notifications; enabling one is not proof that ordinary event reminders are enabled. Check both the app’s Event Notifications preference and iOS notification permission.",
          "Calendar selection also matters: the current scheduling path uses alarms from selected calendars. Check that the relevant calendar is selected. Do not assume hiding a calendar changes only its appearance in this app, and do not delete events to stop reminders."
        ]
      },
      {
        "heading": "A silent or delayed alert: check iPhone delivery",
        "body": [
          "In the iPhone Settings app, open Notifications and choose Cloud Calendars. Review Allow Notifications, the available alert locations and sound controls. Check whether Scheduled Summary or an active Focus is changing delivery. These are Apple’s system settings, not the Alert menu inside an event. Labels can vary with iOS version.",
          "A banner seen without sound is a different observation from no notification anywhere. Note whether it appeared on the Lock Screen or in Notification Center, whether the phone was in use, and which Focus was active. Change one relevant setting at a time so the next result tells you something. A Live Activity countdown is another surface; seeing it does not prove an audible reminder will arrive."
        ]
      },
      {
        "heading": "Two alerts: identify the senders before changing the event",
        "body": [
          "Read the app name on each notification. Apple Calendar, Google Calendar and Cloud Calendars can be separate notification sources even when they display related events. Two notifications are not enough evidence that two event records exist. Also compare the alert times: a reminder the day before and another near the start may match the saved alert choices.",
          "Google’s notification guide explains that its settings are personal to the account and that event-specific choices can differ from calendar defaults. Its instructions apply to Google Calendar, not to Cloud Calendars settings. Inspect the relevant sender rather than assuming one app’s switch controls every other app.",
          "Choose which app you want to notify you, then adjust only the relevant reminder or notification preference. If two actual event records remain, compare their calendars and ownership using the duplicate-event guide. Do not cancel a real meeting just to silence an extra alert."
        ]
      },
      {
        "heading": "Use one disposable event to narrow the problem",
        "body": [
          "Create a clearly named test appointment in a writable calendar you own. Set its start far enough ahead that the chosen alert time is still in the future. Confirm the calendar is selected, the saved alert is present, and both notification controls are enabled. Record the expected alert time and which app should send it.",
          "Observe whether a notification appears and whether it makes sound; those are separate results. Repeat only after changing one suspected setting. Use an ordinary test event without attendees, not an important meeting or a recurring series. Keep the result with your app and iOS versions so you can compare later."
        ]
      },
      {
        "heading": "If the result is still inconsistent",
        "body": [
          "The app schedules a limited set of upcoming alarms; do not rely on an unlimited queue of distant reminders. Check the controls in your installed version and keep a record of inconsistent delivery. Report the app and iOS versions, calendar type, saved alert offset, expected time and observed result.",
          "Keep private event titles, attendee addresses and calendar subscription links out of a public report. Reinstalling, clearing local storage or removing accounts is not the first diagnostic step. Preserve the event and account arrangement while support investigates."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Classify the failure: missing event, absent notification, silent delivery or duplicate alerts.",
      "Check the saved alert and selected calendar.",
      "Check Cloud Calendars Event Notifications separately from iPhone notification permission.",
      "For duplicates, compare sending apps and configured alert times.",
      "Use one disposable future event and record the result without changing real invitations."
    ],
    "faq": [
      {
        "q": "Does turning on weather notifications enable event reminders?",
        "a": "No. The app settings separate event, invitation and weather notifications. Check Event Notifications and iOS permission for ordinary event alarms."
      },
      {
        "q": "Should I delete one event when two alerts arrive?",
        "a": "First identify the sending apps and alert times. Multiple notifications can come from separate apps or multiple alerts on one event. Deletion is not a safe way to diagnose that."
      },
      {
        "q": "Does an alert setting guarantee delivery?",
        "a": "No. It is one part of the chain. App preferences, system permission and delivery settings also matter, so check the result on your device."
      }
    ],
    "sourcesHeading": "Sources and notification settings",
    "sources": [
      {
        "label": "Apple: Change notification settings on iPhone",
        "url": "https://support.apple.com/guide/iphone/change-notification-settings-iph7c3d96bab/ios"
      },
      {
        "label": "Google: Change Google Calendar notifications on iPhone and iPad",
        "url": "https://support.google.com/calendar/answer/37242?hl=en&co=GENIE.Platform%3DiOS"
      }
    ],
    "seeAlso": [
      "what-calendar-sync-actually-does",
      "when-two-calendars-disagree"
    ]
  },
  "find-old-calendar-events-by-account-date-and-title": {
    "updated": "2026-10-21",
    "title": "Find an old calendar event: check the account, dates and search fields",
    "short": "Find past calendar events",
    "description": "A blank search is not proof an event was deleted. Check calendar ownership, date coverage and searchable fields before looking in the provider’s own archive.",
    "lede": "When you remember a meeting but cannot find it, separate three questions: which account held it, which dates the current view covers, and which fields the search matches. This guide is published by Arte Soft, the developer of Cloud Calendars.",
    "commonBelief": "Every search box in a calendar app searches every field of every event ever stored by the provider.",
    "sections": [
      {
        "heading": "Write down the smallest useful clue",
        "body": [
          "Start with an approximate month or year, a distinctive word from the title, and the account you probably used. Keep those clues separate. A colleague’s name may have been an attendee rather than part of the title; a street address may have lived only in the location field.",
          "Try a short title fragment before a long phrase. A negative result does not tell you whether the record is absent, outside the loaded dates or in a field that is not searched."
        ]
      },
      {
        "heading": "Check ownership and calendar selection",
        "body": [
          "Look for the account and calendar that originally owned the event. A work Google calendar, a personal iCloud calendar and a local calendar on the device are different destinations, even if one app displayed them together. Confirm you still have access to the expected account and that its calendar is selected.",
          "Do not create a new copy just because the search is empty. If you can locate the event by browsing its approximate date, inspect its title, calendar and organiser. That gives you evidence to compare with the search result without changing the record."
        ]
      },
      {
        "heading": "Check the dates and fields used by Cloud Calendars search",
        "body": [
          "Cloud Calendars searches the titles of loaded events without requiring the same letter case. Use a distinctive title word. Do not expect a location, attendee address or note to match merely because it appears elsewhere in an event.",
          "The current search view loads events for the current calendar year from selected calendars. A meeting from a previous year can therefore be absent from this search while still existing with the provider. Check the date range before interpreting an empty result.",
          "Browsing to an older date and searching an older year are different actions. For historical search, use the provider’s own tools where available and verify the same account. Check the controls in your installed app version rather than assuming the search covers every year."
        ]
      },
      {
        "heading": "Use provider tools for their documented fields and dates",
        "body": [
          "In Google Calendar on a computer, the search options let you narrow by calendar, event information, people, location and date range. Google recommends a date-limited advanced search when older events do not appear and documents a limit of 200 search results. Divide a broad search into smaller date ranges instead of assuming the first result set is complete.",
          "Those are Google Calendar web controls, not a description of Cloud Calendars. Likewise, Apple’s Calendar guide says its iPhone search can match titles, invitees, locations and notes. That describes Apple Calendar’s own search. Using Apple’s EventKit in another app does not automatically give that app the same search interface or matching rules."
        ]
      },
      {
        "heading": "Interpret where the event does and does not appear",
        "body": [
          "Found in the provider, absent in Cloud Calendars: check account identity, selected calendar, date coverage and the title being searched. Preserve the provider record. The next question is what the app has loaded or matched, not whether the appointment needs recreating.",
          "Found by browsing, absent from search: compare the actual title with the query and note the date. This is useful evidence of a search-scope or matching issue. Do not alter an old meeting title solely to make a diagnostic test pass.",
          "Absent from the provider too: confirm the account, calendar access and date range before investigating retention or deletion with that provider. For a local calendar, a provider website is not an independent copy unless you established a separate connection. Do not assume a cloud archive exists for every local event."
        ]
      },
      {
        "heading": "Keep a useful search record without exposing the event",
        "body": [
          "For support, record the app version, calendar provider or local-storage type, approximate event year and whether the event appears in the provider or by date browsing. Say whether the query was a title word, a location or an attendee. This is more useful than simply reporting that search is broken.",
          "Avoid sending private notes, invitation links or secret calendar-feed URLs. Keep accounts and local data intact; clearing storage or importing an old file again can add uncertainty."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Identify the likely owning account and approximate date.",
      "Check that the calendar is selected and accessible.",
      "Try a distinctive word from the event title.",
      "Treat current-year app search separately from provider archive search.",
      "Use Google Calendar web date filters or Apple Calendar’s documented fields when relevant.",
      "Record where the event appears before changing any data."
    ],
    "faq": [
      {
        "q": "Does an empty result mean my old event was deleted?",
        "a": "No. The wrong account, an unselected calendar, a date outside the loaded range or a field that is not searched can all explain an empty result. Check the provider and the event’s approximate date."
      },
      {
        "q": "Can I search Cloud Calendars by an attendee’s email or a note?",
        "a": "The current search path matches event-title text. For attendee, note or location queries, use the appropriate provider’s documented search tools for those fields."
      },
      {
        "q": "Will browsing to last year make the search cover last year?",
        "a": "Do not rely on that. The current search view loads the current year when it opens. Use a provider’s date-range search for historical records rather than assuming an unlimited history search in the app."
      }
    ],
    "sourcesHeading": "Sources and provider search help",
    "sources": [
      {
        "label": "Google: Search on Google Calendar — computer",
        "url": "https://support.google.com/calendar/answer/37176?hl=en&co=GENIE.Platform%3DDesktop"
      },
      {
        "label": "Apple: Search for events in Calendar on iPhone",
        "url": "https://support.apple.com/guide/iphone/search-for-events-iph2c9ef44ad/ios"
      }
    ],
    "seeAlso": [
      "what-calendar-sync-actually-does",
      "a-list-for-people-who-dislike-grids",
      "when-two-calendars-disagree"
    ]
  },
  "calendar-export-ics-pdf-and-backup": {
    "updated": "2026-10-21",
    "title": "Exporting a calendar: ICS files, PDFs and subscriptions",
    "short": "Calendar export and backup",
    "description": "Need a calendar file from your iPhone account? Choose ICS, PDF or a subscription, then use the right Google, Mac or Outlook workflow.",
    "lede": "A calendar on your iPhone can be a view of several accounts. Getting a useful copy starts with identifying the source and deciding whether you need event data, a readable schedule or continuing updates.",
    "sections": [
      {
        "heading": "Choose the result before choosing a format",
        "body": [
          "Exporting a calendar can mean several different jobs. If you want another calendar app to read event records, choose a supported structured format such as ICS. If someone needs a readable schedule, choose a PDF or printed page. If they should receive later changes, investigate a subscription or permission-based sharing instead.",
          "A PDF records the layout you saved; it is not an event import file. A downloaded ICS file holds calendar data at the time you obtained it. An ICS subscription uses an address that a calendar client checks again. The extension alone does not tell you whether the recipient imported a snapshot or subscribed to updates.",
          "For example, a weekend itinerary sent as a PDF is easy to read. A colleague moving appointments to another account needs event data. A club member following next month’s changing fixtures needs an updating source. Decide which of these outcomes you need before sending anything."
        ]
      },
      {
        "heading": "Start with the account that holds the events",
        "body": [
          "On your iPhone, identify the calendar and account containing the events you need. A combined view may contain several accounts, shared calendars and subscriptions. Seeing all of them together does not mean there is one source calendar to export.",
          "For Google Calendar, use a computer: Google does not offer export from its Calendar app. In the web calendar, open Settings, then Import & export, then Export. The downloaded ZIP contains individual ICS files. For one calendar, open its Settings and sharing and choose Export calendar. Google requires permission to manage changes and sharing; an organization can also restrict export.",
          "For a calendar available in Calendar on your Mac, select its name in the sidebar and use File > Export > Export to save an ICS file. This is a Mac workflow, not a hidden iPhone export command. Check that you selected the intended calendar before saving."
        ]
      },
      {
        "heading": "When you need a PDF schedule",
        "body": [
          "In Calendar on Mac, use File > Print and choose the layout, date range and calendars to include. In the macOS print dialog, use the PDF menu and Save as PDF. Open the result before sending it: a small grid may omit or truncate details that matter to the recipient.",
          "Include a clear date range and the relevant time zone in the message accompanying the document. Review private appointments, notes and locations before sharing. Later edits to your calendar will not rewrite a PDF already sent; label a revised copy clearly so recipients know which schedule to follow."
        ]
      },
      {
        "heading": "Subscription and publishing are different from backup",
        "body": [
          "Microsoft documents the distinction explicitly for Outlook on the web: downloading and importing a published ICS file creates a copy without later updates; subscribing to the ICS address follows changes. Refresh timing depends on the recipient’s provider, and the published calendar is read-only.",
          "Where available, Outlook’s Settings > Shared calendars > Publish a calendar lets you choose a calendar and detail level. Publishing exposes it for viewing or subscription, so use this for an intended audience rather than as a private backup technique. A saved link still depends on the source remaining available."
        ]
      },
      {
        "heading": "What Cloud Calendars sharing provides",
        "body": [
          "We develop Cloud Calendars. Its event-sharing flow offers App Clip, email and QR delivery paths for invitation links. Those links serve a different purpose from downloading your entire calendar as a file. A link may lead into an invitation or subscription workflow; it is not itself a portable archive of every calendar you see.",
          "This guide does not offer a Cloud Calendars whole-calendar ICS, CSV or PDF export procedure. Use the documented provider or Mac routes above for those tasks. For sending a particular event, follow our event-sharing guide; for a continuing shared schedule, first decide who should have access and whether they need updates or editing rights."
        ]
      },
      {
        "heading": "Check a copy before relying on it",
        "body": [
          "Keep the original calendar while checking an export. Record its account, calendar name and export date. If you test an import, use a separate destination calendar where supported, then compare an ordinary appointment, an all-day event and a recurring series with a changed occurrence.",
          "Calendar transfer is not a promise to preserve every meeting feature. Google says imported events omit guests and conference data, and CSV recurrence can become separate one-time events. Check invitations, meeting links and recurrence explicitly before treating a migration as complete.",
          "Apple also offers File > Export > Calendar Archive on Mac, producing an ICBU archive. This is a different operation from exporting one ICS file. Apple warns that importing an archive replaces current calendar information and data; do not use an archive restore as a casual test import."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Identify the account and calendar you need, then choose a snapshot, printable schedule or updating subscription.",
      "Use the documented export route and keep the original while checking the result.",
      "Review the destination, sensitive details and representative events before sending or relying on the copy."
    ],
    "faq": [
      {
        "q": "Can I export Google Calendar directly from its iPhone app?",
        "a": "No. Google’s documented export workflow requires a computer. Exporting a calendar also requires the appropriate sharing-management permission."
      },
      {
        "q": "Does subscribing to an ICS address give me a backup?",
        "a": "A subscription follows a source that can change or become unavailable. Save an independent export if you need a dated copy, and verify what that file preserves."
      },
      {
        "q": "Should I choose ICS or PDF?",
        "a": "Choose ICS for event data that a compatible calendar can import. Choose PDF for a readable schedule. A PDF does not provide calendar updates or reconstruct editable events through the documented import workflows."
      }
    ],
    "sourcesHeading": "Official instructions and format limitations",
    "sources": [
      {
        "label": "Google: export calendar events",
        "url": "https://support.google.com/calendar/answer/37111?hl=en"
      },
      {
        "label": "Google: import events and transfer limitations",
        "url": "https://support.google.com/calendar/answer/37118?hl=en"
      },
      {
        "label": "Apple: export ICS files and calendar archives on Mac",
        "url": "https://support.apple.com/guide/calendar/import-or-export-calendars-icl1023/mac"
      },
      {
        "label": "Apple: save a document as PDF on Mac",
        "url": "https://support.apple.com/en-gb/guide/mac-help/mchlp1531/mac"
      },
      {
        "label": "Microsoft: publishing, importing and subscribing in Outlook",
        "url": "https://support.microsoft.com/en-us/outlook/share-your-calendar-in-outlook-on-the-web"
      }
    ],
    "seeAlso": [
      "sharing-one-event-not-your-calendar",
      "inviting-people-who-do-not-have-the-app",
      "the-secret-address-of-a-google-calendar"
    ]
  },
  "event-saved-to-wrong-calendar": {
    "updated": "2026-10-21",
    "title": "Event saved to the wrong calendar?",
    "short": "Event saved to the wrong calendar?",
    "description": "Check the event destination, Cloud Calendars selection and Apple defaults before moving appointments or changing account settings.",
    "lede": "This guide is published by Arte Soft, the developer of Cloud Calendars. An appointment can appear in the correct week while belonging to the wrong account. Read its Calendar value, then identify the account or local calendar behind that name before changing sync settings.",
    "sections": [
      {
        "heading": "Identify the record, not just its color",
        "body": [
          "Two accounts can both contain a calendar called Personal. A title or color alone may not settle which received the event. If a family appointment is stored in your work calendar, hiding work from your overview does not move it or change its access. If the event is already in the intended calendar but disappears when that calendar is hidden, investigate display selection instead."
        ]
      },
      {
        "heading": "Choose the destination before saving a new event",
        "body": [
          "In the Cloud Calendars creation editor, open Calendar and choose the intended writable destination. Its picker can display an account or source alongside the calendar title; check that information when names are similar. Connecting an account does not make every calendar in it editable.",
          "The initial choice can depend on where creation started and which writable calendars are selected. A specific calendar column can supply the destination. Otherwise, the selection policy prefers an available selected writable calendar before falling back to the system default and then another writable calendar. Do not assume the iPhone default always wins.",
          "Create a harmless test appointment through your usual creation path, then reopen it and check the saved calendar. Repeat this check when you change selected calendars or begin from a different view, before relying on that path for a private event."
        ]
      },
      {
        "heading": "What Apple Calendar’s default changes",
        "body": [
          "Apple documents Settings > Apps > Calendar > Default Calendar for choosing where Apple Calendar places new events. These are Apple Calendar instructions; they are not a universal default for every calendar app.",
          "Changing a default does not relocate existing records. After adjusting it, test the same creation path that produced the mistake. If Cloud Calendars still chooses another destination, inspect its Calendar field and selected calendars rather than repeatedly changing the Apple setting. A new-event default and an existing event’s destination are separate decisions."
        ]
      },
      {
        "heading": "If the intended calendar is unavailable",
        "body": [
          "The Cloud Calendars creation picker filters out destinations that cannot accept edits. An existing read-only event can still display its current calendar so you can identify it. A missing writable destination and a hidden calendar in your overview therefore need different checks.",
          "Confirm the account is connected and that the calendar owner granted the necessary access. Apple describes external calendar subscriptions as read-only. Do not remove an account or create competing copies merely to make a destination selectable. If you only need to see a schedule, restoring its visibility may solve the problem."
        ]
      },
      {
        "heading": "Treat an existing destination change as an action",
        "body": [
          "For an ordinary appointment you own, first record the intended destination and check whether it repeats or has guests. In Cloud Calendars, choosing another Calendar in an existing event’s detail view can save the move immediately. Do not treat that selection as a preview that you can dismiss without consequence.",
          "Apple Calendar documents moving an event through its Calendar field. Google Calendar on iPhone requires the event organizer to have edit access to the destination; its documented recurring-event move also moves future instances and cannot move only one instance. These provider-specific rules do not guarantee identical behavior for every Cloud transfer.",
          "For an invitation organized by somebody else, ask the organizer about ownership or delivery. Moving your displayed copy is not proof that their meeting changed. For recurring or cross-account events, use a supported provider workflow when you need a scope or capability that the app does not clearly offer."
        ]
      },
      {
        "heading": "Check the result before cleanup",
        "body": [
          "Reopen the event and compare calendar, date, time, recurrence and important details. For connected accounts, inspect the intended provider’s own view where available. Verify guests and conferencing separately; a move is not a guarantee that every meeting feature is preserved.",
          "Keep the original information until the result is clear. If two entries appear, identify their accounts before deleting either. A default-calendar diagnosis does not require cancelling invitations, clearing local storage or recreating a recurring series."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Identify the event’s saved calendar and account, not just its title or color.",
      "Choose the intended writable Calendar explicitly before creating a new appointment.",
      "Treat changing Calendar on an existing event as a possible immediate save.",
      "Reopen the saved event and verify recurrence, guests and conferencing before cleanup."
    ],
    "faq": [
      {
        "q": "Why can Cloud Calendars differ from the iPhone default?",
        "a": "Creation context and selected writable calendars can take priority over the system fallback. Check Calendar in the editor."
      },
      {
        "q": "Will changing the default move existing appointments?",
        "a": "No. Review existing destinations separately; the default concerns new events."
      },
      {
        "q": "Can I preview another Calendar on an existing event without saving?",
        "a": "Do not assume so. Selecting another Calendar in an existing Cloud Calendars detail view can save immediately. Decide on the intended change before choosing it."
      }
    ],
    "sourcesHeading": "Official guidance",
    "sources": [
      {
        "label": "Apple: multiple calendars, visibility and moving events",
        "url": "https://support.apple.com/guide/iphone/use-multiple-calendars-iph3d1110d4/ios"
      },
      {
        "label": "Apple: default calendar settings",
        "url": "https://support.apple.com/en-my/guide/iphone/iphc37be2016/27/ios/27"
      },
      {
        "label": "Google: moving events on iPhone and iPad",
        "url": "https://support.google.com/calendar/answer/78739?co=GENIE.Platform%3DiOS&hl=en"
      }
    ],
    "seeAlso": [
      "work-and-personal-without-two-apps",
      "what-calendar-sync-actually-does",
      "recurring-events-without-the-mess"
    ]
  },
  "family-pickup-calendar-handoff": {
    "updated": "2026-10-21",
    "title": "A family pickup plan with a clear handoff",
    "short": "A family pickup plan with a clear handoff",
    "description": "A worked family pickup plan: agree the driver, check shared access, record the meeting point and confirm one-off changes.",
    "lede": "This guide is published by Arte Soft, the developer of Cloud Calendars. A lesson on the calendar says where someone needs to be. It may not say who is taking them home. A useful handoff plan records that decision explicitly.",
    "sections": [
      {
        "heading": "Separate the activity from the responsibility",
        "body": [
          "Imagine a Tuesday swimming lesson from 16:30 to 17:15. Maya handles drop-off and Leo handles collection. An event called Swimming leaves the driver, entrance and departure time unclear. Keep the lesson at its real time. Record the agreed responsibility in its title or notes, or create a separate timed pickup commitment when that is clearer.",
          "This is a suggested planning convention. It does not depend on an automatic assignment feature, and putting a name in a title does not itself notify or assign that person."
        ]
      },
      {
        "heading": "Check access before relying on the plan",
        "body": [
          "Agree which calendar holds the family schedule and who maintains it. A combined personal overview does not automatically give another adult access to every calendar you can see. Check the actual shared destination and the permission the provider grants.",
          "When creating the handoff in Cloud Calendars, inspect Calendar explicitly. A pickup accidentally saved to a private or work calendar can look correct on your phone while remaining absent for the driver. Use a harmless test record to confirm both adults can open the intended shared calendar.",
          "Keep unrelated private appointments and sensitive access information out of a broadly shared schedule. Share the details needed for the handoff with the people who need them."
        ]
      },
      {
        "heading": "Write a handoff someone else can follow",
        "body": [
          "In this example, use a clear collection entry such as “Swimming pickup — Leo” at 17:15. Record “pool reception, east entrance” and the real address when venues have similar names. Agree where to wait if the lesson runs late.",
          "Keep collection time separate from departure time. Leo may need to leave at 16:55, but that does not mean the lesson finishes earlier. He can choose a personal reminder or departure commitment appropriate to his journey. One adult’s alert configuration is not proof another will receive a useful notification.",
          "Ask Leo to confirm the driving responsibility through your normal conversation. Receiving an event or accepting attendance may not mean agreeing to collect someone. The calendar should record an arrangement you have actually made."
        ]
      },
      {
        "heading": "Change one Tuesday without changing the whole term",
        "body": [
          "Suppose Leo cannot collect on 3 November and Maya agrees to do it. State the exact date and responsibility first. Then update that pickup using an editor that clearly supports the required occurrence scope.",
          "For a repeating pickup, check the changed date and the following Tuesday afterward. Do not rewrite the repeat rule to represent one swap. If the editor lacks a single-occurrence option, use the owning provider’s supported editor; do not assume every Save action asks which dates should change.",
          "The driver change does not necessarily change the lesson itself. Preserve the school or club’s original invitation. If its schedule is a read-only subscription, use a separate writable handoff entry instead of expecting to edit the published lesson."
        ]
      },
      {
        "heading": "Confirm urgent changes directly",
        "body": [
          "A different entrance or a delayed driver shortly before collection is an urgent communication task. Update the calendar where needed, then contact the responsible adult through the agreed channel and get a reply. A saved edit is not a read receipt.",
          "If the change is not confirmed, follow the family’s agreed backup arrangement and the venue’s collection rules. Do not infer arrival from a calendar status. This workflow makes no claim that Cloud Calendars provides chat, live location, attendance tracking or automatic task reassignment."
        ]
      },
      {
        "heading": "Review the handoffs, not just the activities",
        "body": [
          "During the weekly review, check the named adult, collection time, meeting point and exceptions. Agree who will update the record and how changes will be confirmed. Adding more unassigned reminders does not resolve an undecided responsibility.",
          "For a course with a known finish date, check the last actual lesson before carrying a pickup into another term. A clear household routine works alongside permissions and provider rules; it does not replace them."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Agree who is responsible for the pickup separately from attendance at the activity.",
      "Save the handoff in a calendar both intended adults can access.",
      "Record the actual collection time and meeting point, then confirm the driving responsibility directly.",
      "For a one-off swap, check the occurrence scope and the following week after saving.",
      "Confirm urgent changes through your agreed communication channel."
    ],
    "faq": [
      {
        "q": "Do both adults need editing access?",
        "a": "Only if both must update the shared schedule. Otherwise agree who maintains it and how changes are requested; check the actual provider permissions."
      },
      {
        "q": "Does accepting an invitation confirm pickup?",
        "a": "Confirm the responsibility explicitly. Attendance and driving are different commitments."
      },
      {
        "q": "Does adding a name automatically assign the driver?",
        "a": "This guide uses an agreed naming convention, not automatic assignment. Get a direct confirmation from the responsible adult and record the arrangement."
      }
    ],
    "sourcesHeading": "Official guidance",
    "sources": [
      {
        "label": "Apple: multiple calendars, visibility and moving events",
        "url": "https://support.apple.com/guide/iphone/use-multiple-calendars-iph3d1110d4/ios"
      },
      {
        "label": "Google: moving events on iPhone and iPad",
        "url": "https://support.google.com/calendar/answer/78739?co=GENIE.Platform%3DiOS&hl=en"
      }
    ],
    "seeAlso": [
      "planning-a-week-in-ten-minutes",
      "a-calendar-that-is-yours-to-share",
      "recurring-events-without-the-mess"
    ]
  }
};
