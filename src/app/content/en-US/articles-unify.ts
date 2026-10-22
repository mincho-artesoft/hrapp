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
  "updated": "2026-10-22",
  "title": "iCloud, Google and Outlook in one view: accounts, copies and permissions",
  "short": "Three providers, one view",
  "description": "View iCloud, Google and Microsoft calendars together. Check account selection, edit permissions and copies before moving events or relying on availability.",
  "lede": "A family appointment, a client call and a work meeting can overlap even when they belong to different accounts. A combined calendar view helps you spot that collision, but it does not turn the accounts into one shared calendar. This guide is written by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "Putting several calendars in one app automatically keeps their availability, sharing and event copies in agreement.",
  "sections": [
    {
      "heading": "Identify the account and calendar behind each event",
      "body": [
        "Start with one ordinary event from each provider. Note the signed-in email address, calendar name and whether you own the event or received an invitation. Two calendars called “Calendar” can belong to entirely different accounts. A colour helps you scan a week; the account and calendar identify where an edit should go.",
        "For example, a dentist appointment in your personal iCloud calendar and a project meeting in Microsoft can appear together for you. That does not, by itself, make the dentist appointment visible to your colleagues or reserve that time in their scheduling tools.",
        "Choose the outcome before changing a connection. To move event data to another account, use “Choose a calendar export format” below to find a supported transfer route and check representative events before relying on the destination. To compare times, keep the existing calendar owners and display selected sources together. If another account must receive busy time, “Cloud Calendars and OneCal by workflow” explains how availability copying differs from a personal overview."
      ]
    },
    {
      "heading": "Connect through the appropriate route",
      "body": [
        "For iCloud, first enable iCloud Calendar on the iPhone under the intended Apple Account. Apple’s setup guide explains the device settings. Cloud Calendars accesses calendars available through the iPhone’s calendar system and needs calendar access to read them. An account connected on another device is not enough.",
        "Cloud Calendars also has “Sign in with Google” and “Sign in with Microsoft” actions. Check which account you select at sign-in, then open its calendar group and select the calendars you need. Signing in to the right provider with the wrong personal or work identity can produce a perfectly valid but unexpected calendar list."
      ]
    },
    {
      "heading": "Understand the plans without confusing them with permissions",
      "body": [
        "The Base plan includes Google Calendar sync and the calendar views. Advanced adds ad removal to Base. Premium adds Microsoft Calendar and Microsoft Teams features. Review the current local price and billing period before purchasing.",
        "A plan changes which app features are available; it does not grant ownership of somebody else’s calendar. Google distinguishes permission to see events from permission to change them. Employer policies and the permissions attached to a Microsoft calendar still apply. A visible event or an available editor is not proof that the provider will accept an update."
      ]
    },
    {
      "heading": "A combined view can include calendar copies",
      "body": [
        "Google and Microsoft connections use calendar copies in the iPhone calendar system to present and synchronize events. Do not assume that connecting an account leaves no copy outside the original provider. The destination used for those copies can depend on the calendar sources available on the device.",
        "If the same account also reaches the phone through another route, inspect the calendar names and sources before treating repeated appointments as separate events. Temporarily hide one calendar to identify which display it supplies. Do not delete an event or calendar merely to make the screen look tidy: a connected copy can send changes back to its provider."
      ]
    },
    {
      "heading": "Keep choosing the destination when you create an event",
      "body": [
        "Before saving, check the event’s calendar as carefully as its date and time. For a family appointment, choose the calendar the family actually uses; for a work meeting, use the permitted work destination. Seeing both calendars together does not make either one the automatic destination for every new event.",
        "Changing an event’s calendar or dragging it between calendars can be a move, not a harmless second view. Keep invitations and recurring meetings in their established calendar while diagnosing a display problem. If you need a change, first establish who owns the event and which calendar can accept it."
      ]
    },
    {
      "heading": "Verify the overview before relying on it",
      "body": [
        "Compare a recent event in the provider’s own calendar with the corresponding event in Cloud Calendars. Check the date, time zone, title and selected calendar. For an editable calendar you own, a disposable event without guests is a better check than changing a live meeting. Confirm the result at the provider before considering the connection ready.",
        "Do not rely on the combined view to create anonymous busy blocks in another account automatically. If you need colleagues to see you as unavailable without seeing personal details, use an explicitly approved availability arrangement and verify it from their side. A clear personal overview and shared availability are separate tasks."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "List the exact account and calendar for one event from each provider.",
    "Enable the intended iCloud calendars on the device and review calendar access.",
    "Use the appropriate Google or Microsoft sign-in and select the intended calendars.",
    "Compare one recent event with its provider view before changing anything.",
    "Hide a suspected duplicate source temporarily; keep the underlying events intact.",
    "Check the destination calendar on each new event, and separately verify any busy-time sharing you need."
  ],
  "faq": [
    {
      "q": "Will my work colleagues see my personal events because I display both calendars?",
      "a": "Displaying calendars together is not a sharing instruction or an automatic busy-time bridge. Check each calendar’s actual sharing settings. Provider connections can create calendar copies on the device, so a combined view is also not a guarantee that event data exists only at its original provider."
    },
    {
      "q": "Why can I see an event but not successfully edit it?",
      "a": "The calendar may be read-only, the event may belong to another organizer, or the provider may reject the update. Check ownership and permissions in the provider’s calendar. Buying a higher app plan does not change those permissions."
    },
    {
      "q": "Should I connect the same Google account through every available route?",
      "a": "First check how it already appears on the phone. Multiple routes can complicate identifying calendar copies. Choose the route you intend to use, verify its events, and hide an extra display while investigating rather than deleting data or disconnecting accounts as a first step."
    }
  ],
  "sourcesHeading": "Sources and setup references",
  "sources": [
    {
      "label": "Apple: set up iCloud Calendar on your devices",
      "url": "https://support.apple.com/guide/icloud/set-up-calendar-mme4d73a8727/icloud"
    },
    {
      "label": "Google: calendar sharing and permissions",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft: Outlook calendar API and supported mailbox data",
      "url": "https://learn.microsoft.com/en-us/graph/outlook-calendar-concept-overview"
    }
  ],
  "seeAlso": [
    "exchange-calendars-on-an-iphone",
    "what-calendar-sync-actually-does",
    "when-two-calendars-disagree",
    "caldav-calendar-on-iphone",
    "calendar-export-ics-pdf-and-backup",
    "onecal-alternative-iphone-calendar-view-or-sync"
  ]
},

  'three-calendar-apps-is-two-too-many': {
  "title": "Combine calendar apps on iPhone without losing track of events",
  "short": "Replace app switching with a checked overview",
  "description": "Bring calendar accounts into one iPhone overview. Check event destinations, duplicate routes, write-back and notifications before changing your daily workflow.",
  "lede": "A single calendar view can help you compare commitments across accounts. Start by checking what it includes and where changes are saved. This guide is published by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "Replacing several calendar apps means merging all calendars and deleting the old apps immediately.",
  "sections": [
    {
      "heading": "Choose the job you need the overview to do",
      "body": [
        "Write down the calendars that affect a real scheduling decision: your work meetings, personal appointments and a shared household schedule, for example. Identify their accounts and who owns each calendar. Several calendars under one Google account are still separate calendars.",
        "Decide whether you need to see commitments together, edit their originals, or copy availability into another account. These are different jobs. A combined view helps you compare times; it does not by itself make colleagues see a personal appointment in their work scheduling system."
      ]
    },
    {
      "heading": "Check workplace approval before connecting",
      "body": [
        "For a work account, use the connection method your organisation permits. Keep its approved app available when it is required for meeting responses, delegated access or other work tasks. A paid personal calendar app cannot grant missing permissions.",
        "If a connection fails, record which account type and stage failed rather than repeatedly changing passwords or deleting accounts. An access decision, a connection error and a calendar that is merely hidden need different remedies. Ask your administrator when the permitted route is unclear."
      ]
    },
    {
      "heading": "Add accounts without assuming there are no copies",
      "body": [
        "Cloud Calendars can present selected iOS calendars alongside connected Google and Microsoft calendars. Its provider connections use mirrored calendars in the iPhone calendar store. This is different from promising a display-only connection that never stores another representation of an event.",
        "Before adding a second route to the same account, check how it already appears on the phone. A provider calendar available through iOS and through a separate app connection can be confusing to identify by name alone. Inspect the calendar and source instead of assuming similarly named entries are interchangeable."
      ]
    },
    {
      "heading": "Verify one disposable appointment in both directions",
      "body": [
        "Create a harmless test appointment with a distinctive name in the intended writable calendar. Confirm it in the provider’s own view. Change its title there, return to the combined view and check the same record. Then make a small test change from the combined view and confirm it at the provider.",
        "This checks your actual setup; it is not a guaranteed refresh-time test. Use an ordinary appointment you own, without guests or recurrence, so troubleshooting does not send changed invitations to other people. Keep real meetings unchanged until you understand which route is failing."
      ]
    },
    {
      "heading": "Narrow the view before deleting anything",
      "body": [
        "If the overview has duplicates, temporarily hide one calendar and note which entry disappears. Compare account, calendar, organiser and time before deciding whether you have two stored records or two display routes. Repeated names are not enough evidence for deletion. Record the original selection and restore it after comparing. In Cloud Calendars, selection can also affect widgets, notification scheduling and Google synchronization.",
        "Apple documents showing or hiding calendars using the calendar-list checkboxes. Hiding is a useful first display check; deleting a record or account can have wider effects. Preserve the source and any needed backup while you investigate."
      ]
    },
    {
      "heading": "Choose a routine after the checks pass",
      "body": [
        "Keep the combined view as your usual planning screen if it covers the calendars you need. Keep another approved app for a task the overview does not support, such as a workplace-specific invitation workflow. Fewer switches can be useful without making one app responsible for every account function.",
        "Check notifications separately. Seeing an event once does not establish that only one app or device will alert you. Cloud Calendars Base includes Google sync and calendar views; Advanced removes ads, while Premium adds Microsoft Calendar and Teams support. Check local prices and account permissions before subscribing."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "List the calendars and owning accounts needed for your planning overview.",
    "Confirm workplace approval and keep any required work app.",
    "Check existing account routes before adding another provider connection.",
    "Trace one disposable appointment to the provider and back.",
    "Hide a suspected duplicate calendar before considering deletion.",
    "Review alerts independently of the visible calendar view."
  ],
  "faq": [
    {
      "q": "Must I delete the other calendar apps?",
      "a": "No. Keep required apps and preserve your current setup while checking the new overview. Use each app for the tasks you have verified."
    },
    {
      "q": "Will my colleagues see that my personal time is busy?",
      "a": "A combined view on your phone does not establish that another account receives availability. That is a separate sharing or synchronization requirement."
    },
    {
      "q": "Does connecting a provider mean data stays only at the provider?",
      "a": "Do not assume that. Cloud Calendars uses mirrored provider calendars in the iOS calendar store. Check the actual account route and storage context before connecting sensitive calendars."
    }
  ],
  "sourcesHeading": "Official calendar setup and visibility guidance",
  "sources": [
    {
      "label": "Apple: Set up multiple calendars on iPhone",
      "url": "https://support.apple.com/guide/iphone/use-multiple-calendars-iph3d1110d4/ios"
    },
    {
      "label": "Apple: Hide calendars when investigating duplicates",
      "url": "https://support.apple.com/en-us/102180"
    }
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view",
    "what-calendar-sync-actually-does",
    "calendar-notifications-missing-silent-or-duplicated"
  ],
  "updated": "2026-10-22"
},

  'what-calendar-sync-actually-does': {
  "updated": "2026-10-22",
  "title": "Calendar sync on iPhone: accounts, subscriptions and missing events",
  "short": "Calendar sync explained",
  "description": "Understand calendar sync, read-only subscriptions and local events. Trace one event between iPhone and iPad before changing accounts or deleting duplicates.",
  "lede": "A missing appointment can mean the wrong account, a hidden calendar, an old imported copy or a connection problem. First identify where the event belongs. This guide is written by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "Seeing the same events in two apps means those apps have merged their calendars, and every event must be stored online.",
  "sections": [
    {
      "heading": "Start with the calendar that owns the event",
      "body": [
        "An account, a calendar and a calendar app are different things. Your Google account can contain several calendars; an app can display several accounts. Showing them in one week does not move all their events into one shared calendar.",
        "Open an event and inspect its calendar name and account. A work appointment can belong to a work Google calendar while a family appointment belongs to iCloud. A local calendar can instead belong to the device. The correct next step depends on this destination, not on which app you used to create the event."
      ]
    },
    {
      "heading": "Four connections that can look similar",
      "body": [
        "A provider account connects to calendars held by a service such as iCloud, Google or Microsoft. Whether you can change a particular calendar depends on your permission. Having connected an account does not make a calendar shared with you editable.",
        "A subscribed calendar feed is a continuing, normally read-only view published by someone else. Apple describes external subscription calendars as read-only. A sports schedule or holiday feed is a useful example: follow the published schedule rather than expecting your edits to change its source.",
        "Importing a calendar file creates a copy rather than a continuing relationship with the original file. Ask whether the operation says import or subscribe before relying on future updates. A URL ending in .ics alone is not enough to determine what the app will do with it.",
        "An app account is a separate identity used for that app’s services. It is not proof that your provider calendars are connected. Cloud Calendars also supports local calendars on the device; provider connections and sharing have their own sign-in requirements.",
        "Cloud Calendars’ Google and Microsoft connections also create mirrored calendars in the iPhone calendar store. Their storage destination depends on the calendar sources available on the device. Do not assume that an app connection only reads the original provider without creating another representation. Check the calendar source before connecting sensitive accounts."
      ]
    },
    {
      "heading": "Run a small two-device sync check",
      "body": [
        "Use a harmless new test event with a distinctive name, such as Calendar connection check. Choose the intended writable calendar explicitly. On the second device, confirm the same provider account and calendar are selected, then look for that exact event.",
        "Change only the test event’s title on the second device and check the first again. This separates seeing an existing copy from successfully writing back. Record which direction fails and whether the provider’s own calendar shows the change. Do not use a real invitation or an important recurring meeting for this check.",
        "The result is diagnostic, not a speed benchmark. Network access, account permissions, refresh behavior and organisation policies can affect it. No fixed number of seconds proves that every calendar connection is healthy."
      ]
    },
    {
      "heading": "Prepare before using a calendar offline",
      "body": [
        "Before travelling or losing connectivity, identify the app, account and calendar you will use. While online, open the dates and event details you need. For an important itinerary, consider a dated readable copy through the export guide below, and check that you can open that copy on the device. Seeing today’s events does not establish that every past or future appointment is available offline.",
        "Google documents offline event creation, editing and responses in its own iPhone and iPad Calendar app after online setup, sign-in and synchronization. Changes do not reach your computer or other people’s calendars until you are online again, and you cannot email guests while offline. Its mobile-browser guidance differs: creating or editing events requires an internet connection. Do not assume a browser has the same offline capabilities as the installed Google app, or that either description establishes Cloud Calendars’ behaviour.",
        "Check the actual app and calendar with a disposable event you own, without guests or a recurring series. Compare what remains visible without a connection and, if the app permits it, a harmless title change. A locally displayed edit is not proof of a queued update, successful conflict handling or delivery to another account. Do not sign out or remove a connection to simulate being offline.",
        "Once connectivity returns, check a provider-backed event in its owning service and then on the receiving device. For example, changing tomorrow’s meeting time on a phone during a flight does not establish that participants received the change. Verify the provider’s saved result before relying on it, and confirm important arrangements through the appropriate invitation or communication route. A local-only calendar has no provider destination to check; saving there does not establish that another device received the event. Do not assume an immediate background update or repeatedly recreate the event while its status is unclear."
      ]
    },
    {
      "heading": "Separate hidden, absent and read-only calendars",
      "body": [
        "A calendar listed but unchecked is hidden. A calendar absent from the account list needs a different check: verify the signed-in identity, that access was granted to that identity, and whether the account connection includes that calendar.",
        "Google’s iPhone help explains how to show or hide subscribed calendars and how to open a calendar shared by email. It separately says that subscribing to a new calendar requires a computer browser. These are distinct operations; do not assume every missing-calendar problem needs a desktop or that accepting an email fixes every connection.",
        "An event that appears but cannot be edited may be working correctly under read-only permissions. Request the appropriate access from the owner if editing is necessary. Repeatedly reconnecting an account will not grant permissions that its owner has not given."
      ]
    },
    {
      "heading": "Investigate duplicates without deleting the source",
      "body": [
        "Two similar events may be two records, or one source calendar displayed through two routes. Inspect both entries: compare calendar, account, organiser, start time and recurrence before deciding which explanation fits.",
        "Temporarily hide one calendar to see which copy disappears. Hiding changes visibility; deleting an event can change the underlying calendar for other devices and participants. Do not delete an account, cancel a meeting or erase local data as a first troubleshooting step. In Cloud Calendars, record and restore the original selection: it can also affect widgets, notification scheduling and Google synchronization. See “When calendars disagree” below.",
        "If you imported the same file more than once, preserve a backup and identify the imported destination before cleaning anything. A recurring series needs particular care because changing one occurrence and changing the whole series have different consequences."
      ]
    },
    {
      "heading": "Where Cloud Calendars fits",
      "body": [
        "Cloud Calendars brings calendar views and weather together on iPhone and iPad. The Base plan includes Google Calendar sync, multiple views, weather and Home Screen widgets. Advanced removes ads; Premium adds Microsoft Calendar and Teams support. Check current local subscription prices before purchasing.",
        "Use the app to see your selected calendars together while keeping their ownership clear. This is not a promise to bypass workplace restrictions or turn every read-only feed into an editable calendar. Local calendars, provider calendars and shared content should be checked according to their actual connection."
      ]
    },
    {
      "heading": "Combining a view is different from copying availability",
      "body": [
        "A useful personal overview can show work and family commitments together without making either account aware of every commitment. If a colleague checks your work availability, the fact that your phone displays a personal event does not establish that the work system receives a busy block.",
        "A calendar-to-calendar copying service needs a source, destination and explicit rules for what is replicated. Cloud Calendars’ provider mirrors do not establish a general rule that every personal appointment is copied into every work account with its details hidden. Define the result you need and verify it from the recipient’s account before relying on it."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Calendar absent from the list: identify its account or local source before changing a connection. For a provider calendar, confirm the same identity and access. For Google, use “Google calendars missing on iPhone”; for a shared Google calendar, use “Shared calendar not appearing” below.",
    "Calendar listed but unchecked: select it for display, then check a known event. If it remains missing, follow the date or search branch rather than treating visibility as proof that synchronization succeeded.",
    "Specific date missing: compare that date, calendar and recurring occurrence with the provider where available. Check the app’s date coverage before recreating anything; “Google calendars missing on iPhone” explains the Google case.",
    "Title search empty: try a distinctive title word and check the loaded dates. Use “Find past calendar events” below to separate search scope from missing provider data.",
    "Two entries disagree: compare account, calendar, organiser, time zone and recurrence before editing either. Use “When calendars disagree” below to trace copies without deleting the source.",
    "Before going offline, check the needed dates in the actual app and calendar. Use only a disposable owned event without guests for testing. After reconnecting, verify a provider-backed change at its provider; a local-only save does not prove delivery to another device.",
    "If you need help, report the affected calendar type and failing direction without sending private event details or secret calendar URLs."
  ],
  "faq": [
    {
      "q": "Does combining Google and iCloud calendars move my events?",
      "a": "A combined view is not itself a merge of provider accounts. Cloud Calendars’ Google and Microsoft connections use mirrored calendars in the iPhone calendar store; check the actual source and destination rather than assuming no copies are created."
    },
    {
      "q": "Why can I see a subscribed calendar but not edit it?",
      "a": "An external calendar subscription is normally read-only. Its owner publishes the schedule. Editing requires a writable calendar and the appropriate permission, not just a subscription link."
    },
    {
      "q": "Will a local calendar appear on my other iPhone automatically?",
      "a": "Do not assume that it will. Local storage is different from a connected provider account. Verify the calendar’s connection and use a disposable test event before relying on another device."
    },
    {
      "q": "Should I delete and add my account again?",
      "a": "First check identity, calendar selection, permissions and the provider’s own view. Reconnection may be relevant later, but deleting local data or an account can complicate diagnosis and should not be the first step."
    },
    {
      "q": "Does seeing an offline edit mean other people received it?",
      "a": "No. Google’s iPhone app documentation separates offline changes from synchronization after connectivity returns. Its mobile-browser editor requires internet access. For a provider-backed calendar, verify the saved event at the owning provider after reconnecting. A local-only calendar has no provider destination to check, and its local display does not prove delivery to another device."
    }
  ],
  "sourcesHeading": "Sources and further reading",
  "sources": [
    {
      "label": "Apple: Set up multiple calendars on iPhone",
      "url": "https://support.apple.com/guide/iphone/use-multiple-calendars-iph3d1110d4/ios"
    },
    {
      "label": "Google: Subscribe to someone else’s calendar — iPhone and iPad",
      "url": "https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform%3DiOS"
    },
    {
      "label": "Google: offline Calendar use on iPhone and iPad",
      "url": "https://support.google.com/calendar/answer/1340696?co=GENIE.Platform%3DiOS&hl=en"
    },
    {
      "label": "Google: mobile-browser calendar capabilities and limits",
      "url": "https://support.google.com/calendar/answer/65923?hl=en-7"
    }
  ],
  "seeAlso": [
    "google-calendars-that-never-reach-your-iphone",
    "why-a-shared-calendar-does-not-appear",
    "find-old-calendar-events-by-account-date-and-title",
    "when-two-calendars-disagree",
    "icloud-google-and-outlook-in-one-view",
    "disconnect-calendar-integration-without-losing-track",
    "onecal-alternative-iphone-calendar-view-or-sync",
    "calendar-export-ics-pdf-and-backup"
  ]
},

  'work-and-personal-without-two-apps': {
  "updated": "2026-10-22",
  "title": "Work and personal calendars in one app: keep ownership separate",
  "short": "Work and personal, one app",
  "description": "See work and personal calendars together without merging ownership. Check permissions, event destinations and Cloud Calendars plans before connecting accounts.",
  "lede": "An overview can help you spot clashes while keeping event ownership clear. Check both the calendars you display and the account routes used to store their copies. This guide is written by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "Putting work and personal calendars in one app also combines their sharing permissions.",
  "sections": [
    {
      "heading": "An overview is different from shared access",
      "body": [
        "A calendar app can display selected calendars together while each keeps its own account and permissions. Apple’s multiple-calendar guide describes choosing calendars to display, assigning colours and selecting a default calendar. Those display choices are not a transfer of event ownership.",
        "Before connecting a work account, check your organisation’s requirements. Google documents that administrators can restrict calendar sharing. A convenient personal overview does not give you permission to publish work details or bypass account restrictions.",
        "Cloud Calendars’ Google and Microsoft connections use mirrored calendars in the iPhone calendar store. The available calendar sources can affect where these copies are held. A work-account connection therefore needs approval for its actual data flow, not just for the account name shown in the overview."
      ]
    },
    {
      "heading": "Use colour and visibility for the overview",
      "body": [
        "Give work and personal calendars distinct colours, then check a busy day with both visible. When you want a narrower view, hide a calendar rather than deleting its events. Apple’s duplicate-calendar guide explains how to show and hide calendars with checkboxes. Before accepting a new commitment, restore the calendars relevant to that decision and compare the week with all of them visible. An empty filtered view does not establish that the time is free.",
        "Hiding a calendar does not change who has permission to access it. In Cloud Calendars, calendar selection also matters to Google synchronization and notification scheduling, so do not assume that deselecting a calendar affects only the picture on screen. Check important changes at their provider and review notification settings separately if the goal is a quiet evening. Keep an approved work app available if your organisation requires it."
      ]
    },
    {
      "heading": "Check the destination before saving",
      "body": [
        "A default calendar is a useful starting point, not a guarantee that every appointment belongs there. For a personal appointment, check the selected calendar before saving. For a work meeting, use the work calendar and the organisation’s invitation process.",
        "Do not move or copy an invitation simply to make it appear in your overview. Microsoft distinguishes events you created from meetings organised by someone else: changing your own displayed copy is not a reliable way to update the organiser or attendees. Keep the original invitation and ask the organiser about a time change."
      ]
    },
    {
      "heading": "What the Cloud Calendars plans add",
      "body": [
        "Cloud Calendars supports calendar views on iPhone and iPad. Its Base plan includes Google Calendar sync and the multi-calendar view. Advanced adds ad removal; Premium adds Microsoft Calendar and Teams support. Current local prices are shown in the app and App Store.",
        "Advanced is not a paid permission to manage every account. A subscription does not make a read-only calendar writable or override workplace policy. Local calendars can be used without an account; provider connections and sharing have their own sign-in requirements."
      ]
    },
    {
      "heading": "Check a privacy-preserving busy block from the other side",
      "body": [
        "Suppose a personal appointment should stop colleagues booking that time, but they should not learn its title. Seeing it beside work on your phone is only your overview. First establish whether your work account contains any availability entry at all, then check what an intended colleague can see.",
        "If your organisation permits a manual work availability block, review the destination, title, notes, location, attendees and availability before saving. Avoid copying private appointment details into it. This is an approved arrangement you create and verify, not an automatic Cloud Calendars masking feature. Keep later changes consistent without turning the second entry into another invitation."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Check whether your workplace permits the account connection.",
    "Choose distinct colours and display the calendars you need for an overview.",
    "Verify the destination calendar when creating a new event.",
    "Hide a calendar temporarily to narrow the view; do not delete events to tidy it.",
    "Review sharing permissions and notifications separately from calendar visibility."
  ],
  "faq": [
    {
      "q": "Will my employer see my personal events just because both calendars are in one app?",
      "a": "Displaying calendars together does not itself grant calendar-sharing permission. Check which account owns each event, its sharing settings and any employer device-management rules. Do not save a private appointment to a work calendar by accident."
    },
    {
      "q": "Do I need Advanced to see Google and personal calendars together?",
      "a": "Google Calendar sync and the multi-calendar view are Base features. Advanced removes ads. Microsoft Calendar support is part of Premium; account permissions still apply."
    },
    {
      "q": "Does Cloud Calendars automatically replace personal details with a work busy block?",
      "a": "Do not rely on that. Viewing calendars together and creating provider mirrors are different from an explicit privacy-masking rule that copies availability into another account. Verify the arrangement your organisation permits."
    }
  ],
  "sourcesHeading": "Sources and further reading",
  "sources": [
    {
      "label": "Apple: Set up multiple calendars on iPhone",
      "url": "https://support.apple.com/guide/iphone/use-multiple-calendars-iph3d1110d4/ios"
    },
    {
      "label": "Apple: If you have duplicate events on your iCloud Calendar",
      "url": "https://support.apple.com/en-us/102180"
    },
    {
      "label": "Google: Choose what others can do with your calendar",
      "url": "https://support.google.com/calendar/answer/15716974?hl=en"
    },
    {
      "label": "Microsoft: Change an appointment, meeting, or event in Outlook",
      "url": "https://support.microsoft.com/en-us/outlook/calendar/change-an-appointment-meeting-or-event-in-outlook"
    }
  ],
  "seeAlso": [
    "what-calendar-sync-actually-does",
    "when-two-calendars-disagree",
    "who-can-see-what-in-google-calendar",
    "change-calendar-color-iphone"
  ]
},

  'exchange-calendars-on-an-iphone': {
  "updated": "2026-10-22",
  "title": "Microsoft and Exchange calendars on iPhone: check the connection first",
  "short": "Microsoft calendars on iPhone",
  "description": "Check Microsoft account type, employer approval and permissions before connecting a work calendar. See what Cloud Calendars Premium adds.",
  "lede": "“Exchange calendar” can mean different services and different workplace rules. Before changing settings or buying a plan, identify where your mailbox is hosted and which connection your organization permits. This guide is written by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "Any app with Microsoft sign-in must work with every Exchange server and every shared work calendar.",
  "sections": [
    {
      "heading": "Identify the mailbox, not just the Outlook app",
      "body": [
        "Outlook is an app as well as a name used for Microsoft services. Having an account in Outlook does not tell you which server hosts its calendar. Ask whether you have a personal Microsoft account, a Microsoft 365 mailbox in Exchange Online, or an organization’s own Exchange installation.",
        "Cloud Calendars provides Microsoft sign-in and uses Microsoft’s calendar service connection. This is not a universal server-address and password setup for every Exchange installation. Microsoft documents its calendar API separately from generic Exchange configuration; confirm the intended route for your mailbox rather than guessing a server name."
      ]
    },
    {
      "heading": "Separate Apple’s device account from the app connection",
      "body": [
        "A work calendar already available to Apple Calendar through an approved device account is a different route from using “Sign in with Microsoft” inside Cloud Calendars. Calendars exposed by the phone’s calendar system also depend on calendar permission. A successful account setup in Apple’s settings does not prove a separate Microsoft sign-in will be approved.",
        "Before adding another connection, inspect where the existing work calendar appears. If you later see two versions of a meeting, identify their calendar sources and hide one temporarily. Avoid using account removal or event deletion to diagnose which connection produced them. In Cloud Calendars, record the original selection and restore it after comparing. Selection can also affect widgets and notification scheduling; do not assume it is only a display preference."
      ]
    },
    {
      "heading": "Check Premium and organizational approval separately",
      "body": [
        "Premium adds Microsoft Calendar and Microsoft Teams features to Cloud Calendars. Advanced adds ad removal to Base; it does not unlock the app’s Microsoft sign-in. Check the current local purchase price and billing period rather than relying on a price quoted for another region.",
        "A subscription cannot override an employer’s decision about app access. Microsoft allows organizations to control user consent and require administrator approval. If the sign-in page requests approval, give your administrator the app name, the account you intended to use and the exact message. Do not publish the work calendar or switch to a personal account to bypass that decision."
      ]
    },
    {
      "heading": "Diagnose the stage that failed",
      "body": [
        "If sign-in never completes, check the selected identity, the network and the message from Microsoft. An approval message is different from an expired session or a connection failure. There is no basis for assuming that every failed connection is an employer policy problem.",
        "If sign-in succeeds but a calendar is missing, inspect the account group and calendar selection in Cloud Calendars, then compare with the same account in Outlook. If one shared or delegated calendar is absent while your own calendar appears, investigate access to that particular calendar. General Microsoft API capabilities do not guarantee that every shared-mailbox or delegation scenario is available in this app."
      ]
    },
    {
      "heading": "Distinguish a visible copy from a confirmed update",
      "body": [
        "The Microsoft connection uses calendar copies in the iPhone calendar system. Their storage destination can depend on the sources available on the device. For a work account, confirm that this arrangement fits your organization’s requirements before using it for sensitive meetings; do not assume a copy stays only in the original mailbox.",
        "For example, a team calendar may show a meeting but refuse your update because you lack the required access. A successful local edit is not the final check. Compare the event in Outlook using the same account. Test only a disposable event in a calendar you own, without inviting colleagues or changing an established meeting."
      ]
    },
    {
      "heading": "Keep meeting ownership and availability explicit",
      "body": [
        "A meeting organized by a colleague is not yours to relocate or rewrite just because it appears beside your personal plans. Keep the organizer, work calendar and intended participants in mind when making a change. Use the provider’s approved workflow when the required action is unavailable or an update does not reach the server.",
        "Likewise, displaying a personal appointment beside work does not automatically block work availability or conceal its details as a generic busy entry. If that is your goal, ask which availability-sharing method your organization supports and verify the result. A read-only calendar link is not a substitute for editable access, and publishing a link is not a troubleshooting shortcut."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identify the mailbox hosting and ask which connection your organization permits.",
    "Check whether the calendar already reaches the iPhone through a device account.",
    "Review the Premium offer separately from Microsoft consent and calendar permissions.",
    "At Microsoft sign-in, choose the intended identity and retain any error message for support.",
    "After sign-in, select the required calendar and compare a recent event in Outlook.",
    "Confirm an authorized disposable change at the provider; leave existing invitations and recurring meetings intact."
  ],
  "faq": [
    {
      "q": "Does Premium guarantee that my company’s Exchange server will connect?",
      "a": "No. Premium enables the app’s Microsoft features. Mailbox compatibility, the organization’s approval and the permissions on individual calendars are separate requirements. Confirm the connection with your administrator before treating an Exchange installation as supported."
    },
    {
      "q": "Why does Outlook work while another calendar app is refused?",
      "a": "Applications can have different permissions and approval requirements. Outlook working is a useful reference for the account, but it does not establish approval for another application. Use the actual error or approval request to identify what needs attention."
    },
    {
      "q": "Can I use a public calendar link if Microsoft sign-in is blocked?",
      "a": "Do not publish work information to get around a blocked connection. A subscription is normally a read-only view, not equivalent to editable access. Ask the calendar owner or administrator for an approved method; do not assume a published link is permitted."
    }
  ],
  "sourcesHeading": "Sources and provider guidance",
  "sources": [
    {
      "label": "Microsoft: Outlook calendar API and supported mailbox data",
      "url": "https://learn.microsoft.com/en-us/graph/outlook-calendar-concept-overview"
    },
    {
      "label": "Microsoft: user and administrator consent",
      "url": "https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/user-admin-consent-overview"
    },
    {
      "label": "Apple: multiple calendars and read-only subscriptions",
      "url": "https://support.apple.com/en-lamr/guide/iphone/iph3d1110d4/ios"
    }
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view",
    "what-calendar-sync-actually-does",
    "what-a-subscription-actually-buys"
  ]
},

  'when-two-calendars-disagree': {
  "updated": "2026-10-22",
  "title": "When calendar events disagree: check ownership before editing",
  "short": "When calendars disagree",
  "description": "Different times or duplicate events? Check the owning calendar, time zone and provider view, then hide one source before making changes or deleting anything.",
  "lede": "If an appointment shows two different times, pause before changing either copy. First establish whether you are looking at the same event, two separate records or one event displayed differently. This guide is written by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "Every calendar service resolves competing edits by keeping whichever change arrived last.",
  "sections": [
    {
      "heading": "Record the difference before trying to fix it",
      "body": [
        "Open both entries and compare the account, calendar name, organiser, date, time zone and recurrence. A matching title alone does not establish that two entries are the same record. Note which device or app shows each version without sharing private event details.",
        "Check the provider’s own calendar view when available, using the same account. For iCloud, Apple recommends checking service status, account consistency and device date and time. Refresh through the relevant app’s supported controls before deciding a saved change has been lost."
      ]
    },
    {
      "heading": "There is no universal conflict rule",
      "body": [
        "Concurrent edits, old local data, permissions and provider-specific behaviour can lead to different symptoms. Do not assume the newest-looking copy is authoritative or that one more edit will repair the connection.",
        "Microsoft’s support article about an Outlook Desktop conflict describes a case where the conflict was local and the server copy was unaffected. It documents a specific issue and fix, not a rule for Google, iCloud or Cloud Calendars. Follow guidance for your actual provider and client version rather than applying its repair steps everywhere."
      ]
    },
    {
      "heading": "Hide first when two entries look duplicated",
      "body": [
        "Temporarily hide one calendar and observe which entry disappears. Apple documents calendar checkboxes for this purpose. Restore visibility afterward so you do not mistake a hidden appointment for missing data.",
        "In Cloud Calendars, note the original selection before this check. Calendar selection also affects widgets, notification scheduling and Google synchronization. Restore the calendars you need after comparing the entries, then recheck the schedule before relying on availability or alerts. Do not assume every provider connection pauses and resumes in the same way.",
        "Two entries may be independent records, imported copies or the same source shown through different connections. Deleting one does not always delete both; deleting a source event can nevertheless affect other devices or people. Establish ownership and preserve needed information before any cleanup. Avoid cancelling a meeting, removing an account or clearing local storage as an initial diagnostic step."
      ]
    },
    {
      "heading": "Confirm who is allowed to change the event",
      "body": [
        "Google distinguishes viewing permission from editing permission; some editing permissions exclude private events, and work administrators can restrict settings. Being able to see an appointment does not prove you can correct it.",
        "For an Outlook meeting organised by someone else, Microsoft warns that moving your copy does not notify the organiser and can leave your calendar showing the wrong time. Ask the organiser to confirm the intended schedule. For a recurring meeting, identify whether the discrepancy concerns one occurrence or the series."
      ]
    },
    {
      "heading": "Make a controlled correction only after diagnosis",
      "body": [
        "If you own the event or have the required permission, confirm the intended details, make one correction from one client, then check the provider view and other device. If it fails again, stop repeating edits and report the affected client, account type and error to the provider or administrator.",
        "For a separate connection check, use a disposable event in a calendar you own rather than experimenting on an important invitation. This is a suggested diagnostic workflow, not a runtime test performed by us or a promise about how quickly changes will arrive."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Compare account, calendar, organiser, time zone and recurrence for both entries.",
    "Check the same account in the provider’s own view when available.",
    "Temporarily hide one calendar to trace duplicates; restore it after checking.",
    "Confirm ownership and edit permissions before changing an invitation.",
    "Make one authorised correction and verify it; seek provider-specific help if the disagreement returns."
  ],
  "faq": [
    {
      "q": "Should I delete the duplicate event?",
      "a": "First determine whether the entries are independent records or two views of the same source. Hide a calendar temporarily to trace them. Deletion can affect the underlying calendar and other participants; it is not a safe first diagnostic step."
    },
    {
      "q": "Does the last edit always win?",
      "a": "Do not rely on that rule across providers and clients. Check the owning calendar, permissions and the provider’s current troubleshooting guidance. A client-local conflict can differ from the event held by the service."
    },
    {
      "q": "Can Cloud Calendars force a work meeting to accept my change?",
      "a": "A calendar app cannot grant the organiser’s authority or override account permissions. Check the original invitation and contact the organiser or administrator when needed."
    }
  ],
  "sourcesHeading": "Sources and further reading",
  "sources": [
    {
      "label": "Apple: If you have duplicate events on your iCloud Calendar",
      "url": "https://support.apple.com/en-us/102180"
    },
    {
      "label": "Apple: If your iCloud calendars won’t sync",
      "url": "https://support.apple.com/en-us/102543"
    },
    {
      "label": "Google: Choose what others can do with your calendar",
      "url": "https://support.google.com/calendar/answer/15716974?hl=en"
    },
    {
      "label": "Microsoft: Change an appointment, meeting, or event in Outlook",
      "url": "https://support.microsoft.com/en-us/outlook/calendar/change-an-appointment-meeting-or-event-in-outlook"
    },
    {
      "label": "Microsoft: Outlook shows conflict errors when updating or cancelling meetings",
      "url": "https://support.microsoft.com/en-us/support/known-issues/outlook-shows-conflict-errors-when-updating-or-cancelling-meetings"
    }
  ],
  "seeAlso": [
    "what-calendar-sync-actually-does",
    "work-and-personal-without-two-apps",
    "disconnect-calendar-integration-without-losing-track"
  ]
},
};
