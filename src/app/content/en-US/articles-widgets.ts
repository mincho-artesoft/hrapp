import { LocalisedArticle } from '../types';

/**
 * The widget articles, in English.
 *
 * The argument running through all five is that a widget is read in a glance or
 * not at all, which makes restraint the feature rather than a compromise. Two
 * of the tracked prompts land here.
 */
export const WIDGETS_EN_US: Readonly<Record<string, LocalisedArticle>> = {
  "calendar-on-apple-watch": {
  "updated": "2026-10-23",
  "title": "Calendar and Google Tasks on Apple Watch: check app support and missing items",
  "short": "Calendar events on Apple Watch",
  "description": "Check calendar events and Google Tasks on Apple Watch. Compare the watch app, complications, seven-day coverage and phone calendar selection before changing data.",
  "lede": "A meeting visible on your iPhone is a starting point, not proof that every watch app or watch-face display receives it. Identify the calendar, the app and the surface before changing a connection. This guide is published by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "An iPhone calendar widget means the same app and every displayed event are automatically available on Apple Watch.",
  "sections": [
    {
      "heading": "Identify the app and the display first",
      "body": [
        "A watch app, a watch-face complication, a notification and a Live Activity are different ways to present information. Start with the name of the app you are opening and the display that seems wrong. A Home Screen widget on your iPhone is not evidence that its publisher also supplies a dedicated watch app or a particular complication.",
        "Write down one appointment’s title, date, time and owning calendar. Compare that same record rather than two events with similar names. If an event is absent everywhere, use the missing-calendar guide below; changing a watch face cannot recover an appointment that the source itself no longer contains."
      ]
    },
    {
      "heading": "For Apple Calendar, check the paired iPhone and selected calendars",
      "body": [
        "When using Apple’s Calendar app on the watch, first look for the appointment in Apple Calendar on the paired iPhone. Visibility only inside another calendar app does not establish the same system-calendar source. Note the account and calendar, including whether the item is local or belongs to a provider.",
        "Apple’s current watch guide places calendar settings in the Watch app on iPhone: My Watch, Apps, then Calendar. Use the available settings to review which calendars appear. On the watch, open Calendar and inspect the event itself, not just the date or a compact preview. Controls can differ with the installed software version."
      ]
    },
    {
      "heading": "For a companion app, check its own installation and selection",
      "body": [
        "Fantastical documents a separate Apple Watch app. Its help describes installing that companion through Apple’s Watch app and completing initial setup with Fantastical on iPhone. Those are Fantastical instructions, not an installation procedure for Cloud Calendars.",
        "The same publisher documents a Calendar Set for its watch app and calendar choices for configurable complications. An event visible in the watch app but absent from a complication therefore calls for a display-selection check, not an assumption that the event was deleted. Check the settings offered by that specific app and complication."
      ]
    },
    {
      "heading": "Google Tasks on Apple Watch through Google Calendar",
      "body": [
        "Google’s official help documents events and tasks in the Google Calendar watch app on watchOS 11 or later. It describes the schedule view, notifications, Smart Stack and a next-event-or-task complication. This is a documented Google Calendar route; it does not establish that every phone task app has its own watch client.",
        "The same help limits the watch view to seven days ahead and says new events and tasks cannot be created on the watch. Use the phone or web for creation. A task due beyond that window can be missing from the watch without being lost from Google Tasks.",
        "For visibility, compare the Google Account on the watch with calendars selected in Google Calendar on the iPhone. Check a known dated task inside the watch app before examining a complication. Syncing Google Tasks with Apple Reminders through another phone tool is a separate workflow, not a prerequisite established by Google’s watch instructions."
      ]
    },
    {
      "heading": "Separate being away from the phone from receiving fresh changes",
      "body": [
        "A watch showing an appointment while you are away from your iPhone does not prove that later edits will arrive with the phone powered off. Flexibits’ watch FAQ says its synchronization requires the iPhone to remain powered on and connected to the internet, even when the watch uses a remote connection. Treat this as that publisher’s requirement, not a rule for every watch app.",
        "For a rehearsal moved from 18:00 to 18:30, compare the same date at the source, on the phone and inside the chosen watch app. Then check the watch-face display separately. Record where the old time remains and confirm the change with the organiser. A changing countdown or familiar title is not proof of the latest saved start time."
      ]
    },
    {
      "heading": "Keep the Cloud Calendars connection distinct from watch support",
      "body": [
        "Cloud Calendars provides calendar views, weather and Home Screen widgets on iPhone and iPad. Its iPhone Live Activity is a separate feature. This guide does not provide a Cloud Calendars watch-app installation procedure. Check the current product listing and installed device’s available features before choosing an app specifically for a watch requirement.",
        "Cloud Calendars’ direct Google and Microsoft connections create mirrored calendars in the iPhone calendar store, with the destination depending on available calendar sources. An app connection alone does not establish Apple Watch visibility, but neither does it prove the event can never appear there. Compare the actual event in Apple Calendar and the selected watch app before adding another connection or copying the meeting."
      ]
    },
    {
      "heading": "Test one harmless event before changing real plans",
      "body": [
        "If you need a clear comparison, create a disposable future test appointment in a writable calendar you control. Record its destination explicitly, find it on the phone and then check the chosen watch app. Change only that test appointment’s title or time and compare the same record again.",
        "Do not delete a provider account, erase calendar data or move a real meeting as the first test. If the problem persists, report the calendar source, failing display, expected time and app/device versions with private details removed. Manage a subscription through its billing account; buying a plan does not grant calendar permission or establish a missing companion app."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identify the watch app and whether the problem concerns its event view, a complication or another display.",
    "Confirm the same event, date and owning calendar on the paired iPhone.",
    "For Apple Calendar, review calendar selection in the Watch app; for another app, inspect its documented companion settings.",
    "Compare the watch app and watch-face display separately after an important change.",
    "Test only a disposable event in a writable calendar and record which direction or display differs.",
    "Check current device, account and purchase requirements before choosing an app for watch use."
  ],
  "faq": [
    {
      "q": "Does an iPhone Home Screen widget prove there is an Apple Watch app?",
      "a": "No. A widget, a dedicated watch app and a watch-face complication are separate capabilities. Check the publisher’s current listing and the features available on your device."
    },
    {
      "q": "Why is an event visible on the watch but missing from its complication?",
      "a": "Compare the watch app and complication settings separately. For example, Fantastical documents calendar choices for configurable complications; do not treat every display as an identical view of the full calendar."
    },
    {
      "q": "Does using a watch away from the phone mean the phone can be switched off?",
      "a": "Do not assume that. Connectivity requirements depend on the app and operation. Flexibits’ watch FAQ requires its paired iPhone to remain powered on and online for synchronization."
    },
    {
      "q": "Should I copy the meeting to another calendar to make it appear?",
      "a": "First identify its owning calendar and compare the source, phone and chosen watch display. Copying or moving a real invitation can create a second record or change its destination instead of fixing visibility."
    },
    {
      "q": "Can I see Google Tasks on Apple Watch?",
      "a": "Google documents tasks in its Google Calendar watch app, with a seven-day future window. Its help says creating new tasks requires the phone or web. Check current watchOS and account requirements."
    }
  ],
  "sourcesHeading": "Apple and publisher setup instructions",
  "sources": [
    {
      "label": "Apple: check events and choose calendars on Apple Watch",
      "url": "https://support.apple.com/en-kg/guide/watch/apd1b51754cc/watchos"
    },
    {
      "label": "Flexibits: Fantastical Apple Watch setup, views and complications",
      "url": "https://flexibits.com/fantastical-ios/help/apple-watch"
    },
    {
      "label": "Flexibits: watch synchronization and account requirements",
      "url": "https://flexibits.com/fantastical-watch/faq"
    },
    {
      "label": "Google: Calendar and tasks on Apple Watch, limits and visibility",
      "url": "https://support.google.com/calendar/answer/16404789?hl=en-RW"
    }
  ],
  "seeAlso": [
    "the-widget-that-shows-what-is-next",
    "a-countdown-to-your-next-meeting",
    "what-calendar-sync-actually-does",
    "google-calendars-that-never-reach-your-iphone"
  ]
},

  'the-widget-that-shows-what-is-next': {
  "updated": "2026-10-22",
  "title": "Calendar widgets on iPhone and iPad: show upcoming events",
  "short": "Upcoming events on the Home Screen",
  "description": "Set up upcoming-event widgets on iPhone or iPad. Check selected calendars, visible rows and missing appointments before relying on the Home Screen.",
  "lede": "For a useful next-event view, choose a widget that actually lists events. A date-and-weather tile answers a different question. This guide is published by Arte Soft, the developer of Cloud Calendars.",
  "sections": [
    {
      "heading": "Choose the event layout first",
      "body": [
        "In the Cloud Calendars widget gallery, Calendar Events is the medium event-list layout. Calendar Events Large provides more room for upcoming appointments. Calendar & Weather is a separate date-and-weather layout; its small size does not promise a next-event row. Names may appear translated on your device.",
        "On iPhone, hold an empty Home Screen area, choose Edit and Add Widget, then find Cloud Calendars and select the desired layout. Compare the preview before adding it. Apple’s widget instructions cover this system gallery; it is separate from the calendar views inside the app."
      ]
    },
    {
      "heading": "Add and check the widget on iPad",
      "body": [
        "On iPad, use Apple’s Home Screen widget gallery: hold the background, open Edit, then Add Widget. Search for Cloud Calendars, inspect the offered styles and sizes, add the layout you need, position it and finish with Done. Follow the controls shown by your iPadOS version; a preview is not confirmation that your calendar data has loaded.",
        "Choose Calendar Events or Calendar Events Large when you need appointments. Compare the styles offered by the installed app; a date-and-weather tile answers a different question from an event list.",
        "Open Cloud Calendars on that iPad and find a known future timed appointment in a selected calendar. A correct view on your iPhone does not confirm the iPad’s accounts, access or loaded data. Compare the title, date and start time, then continue with the eligibility and update checks below if the widget differs."
      ]
    },
    {
      "heading": "Check what counts as upcoming",
      "body": [
        "The event display uses selected calendars and future timed appointments. All-day entries and appointments whose start time has already passed are excluded from this upcoming feed. A birthday or an ongoing meeting can therefore be visible in the app without appearing here.",
        "For example, if your only entry today is an all-day travel label, a blank upcoming list does not mean the travel label was lost. Open the app to inspect the complete day. Likewise, the next timed event may be tomorrow or later; read its date rather than assuming every row is today."
      ]
    },
    {
      "heading": "Separate a missing event from a list that has run out of rows",
      "body": [
        "A widget shows a limited set of upcoming appointments. If earlier events fill its rows, a later appointment can be absent even though it is present in the app and eligible for the upcoming list. A larger event layout can show more rows; it still is not the complete calendar.",
        "Start with the nearest future timed appointment in a selected calendar. If it appears but a later one does not, open the app to inspect the rest of the schedule. If the nearest eligible event is also missing, continue with calendar selection, access and update checks. Do not move or delete appointments just to make a later entry appear."
      ]
    },
    {
      "heading": "Make the app your first comparison",
      "body": [
        "Open Cloud Calendars and find one specific future timed appointment. Confirm its owning calendar is selected and that the app has the calendar access it needs. Compare the title, date and start time with the widget. If the event is missing in the app as well, investigate the account or sync first.",
        "Use a harmless test appointment in a calendar you own if you need a clear example. Give it a future start and a recognizable title. Avoid changing a real invitation or removing accounts simply to test the Home Screen."
      ]
    },
    {
      "heading": "Allow for updates without assuming a fixed deadline",
      "body": [
        "Widgets display saved information and do not run continuously like an open app. Apple controls their update scheduling. Opening the app and checking the event gives you a fresh point of comparison, but it does not establish an exact number of seconds before the widget must change.",
        "If the app stays correct while the widget remains wrong, note the layout, selected calendar, event time and app/iOS versions. An empty list, an old appointment and an incorrect time are different observations; report which one you see."
      ]
    },
    {
      "heading": "Read the weather as a separate summary",
      "body": [
        "The weather beside the date is not a forecast attached to each appointment’s venue and start time. Before an outdoor event, open the weather view and check the intended place and hour. A current-condition icon cannot establish what conditions will be at a later meeting.",
        "Keep this widget for quick orientation. Use the full calendar for all-day commitments, event details and decisions that need the entire schedule."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Choose Calendar Events or Calendar Events Large for an event list.",
    "Verify a future timed appointment in a selected calendar.",
    "Compare its date and time in the app before troubleshooting the widget.",
    "Record persistent differences instead of deleting calendar data."
  ],
  "faq": [
    {
      "q": "Why is my birthday missing?",
      "a": "The upcoming feed excludes all-day events. Check the full calendar for birthdays and other date-only entries."
    },
    {
      "q": "Does the small widget show the next meeting?",
      "a": "The small Calendar & Weather layout shows date and weather. Choose an event-list layout for appointments."
    },
    {
      "q": "Does no upcoming event mean I am free today?",
      "a": "No. All-day entries, ongoing events, unselected calendars and stale information can change that conclusion."
    }
  ],
  "sourcesHeading": "Sources and Apple instructions",
  "sources": [
    {
      "label": "Apple: Add and edit widgets on iPhone",
      "url": "https://support.apple.com/118610"
    },
    {
      "label": "Apple: Keeping a widget up to date",
      "url": "https://developer.apple.com/documentation/widgetkit/keeping-a-widget-up-to-date"
    },
    {
      "label": "Apple: Add, edit, and remove widgets on iPad",
      "url": "https://support.apple.com/guide/ipad/add-edit-and-remove-widgets-ipadb0de8630/ipados"
    }
  ],
  "seeAlso": [
    "choosing-a-widget-size",
    "a-countdown-to-your-next-meeting",
    "calendar-on-apple-watch"
  ]
},

  'a-countdown-to-your-next-meeting': {
  "updated": "2026-10-21",
  "title": "Use a calendar Live Activity countdown without replacing alerts",
  "short": "A countdown to your next meeting",
  "description": "Use Cloud Calendars Live Activity for a future meeting, check stale event details and keep alerts separate from the countdown on your Lock Screen.",
  "lede": "A countdown helps you judge the remaining time before a meeting. Its usefulness still depends on the activity holding the correct appointment and start time. This guide is published by Arte Soft, the developer of Cloud Calendars.",
  "sections": [
    {
      "heading": "Start from a known future appointment",
      "body": [
        "First open the appointment in Cloud Calendars and confirm its date, start time and selected calendar. The countdown follows future timed events; it is not a timer for all-day entries or a measure of how much time remains in a meeting already underway.",
        "Use the app’s Live control to start the activity when available; the control becomes Stop while it is running. If the control is unavailable, check whether Live Activities are allowed for the app in iPhone settings. Availability and labels can vary with device and iOS version."
      ]
    },
    {
      "heading": "Understand the two display surfaces",
      "body": [
        "The activity can present the upcoming event on the Lock Screen. On iPhones with Dynamic Island, it also has a compact or expanded presentation there. Apple’s Dynamic Island guidance explains how to expand an activity for more detail; that hardware feature is not present on every iPhone.",
        "A Home Screen widget and a Live Activity are separate displays. Adding an event widget does not itself establish that a Live Activity is running, and enabling notification sounds does not start one either."
      ]
    },
    {
      "heading": "Check the event, not only the moving number",
      "body": [
        "Time passing can change a countdown without a fresh calendar update. If the organizer moves a meeting, a countdown based on the previous start time is still counting toward the wrong appointment. Inspect the title, date and displayed update information as well as the remaining time.",
        "After an important change, reopen the app and compare the saved appointment with the activity. If they disagree, use the appointment’s confirmed details while investigating. Do not assume that a visible or changing countdown proves the latest provider change arrived."
      ]
    },
    {
      "heading": "Keep a reminder for when you are not looking",
      "body": [
        "A visual countdown is useful only when you look at it. Keep an appropriate event alert for a meeting you need to attend, and check notification permission separately. Do not replace a needed reminder merely because a Live Activity is visible.",
        "For an appointment away from your desk, also allow travel or preparation time. The countdown is to the event start, not an independently verified instruction for when to leave. Check the actual location and your own preparation needs."
      ]
    },
    {
      "heading": "When the activity is missing or outdated",
      "body": [
        "Check the app’s current event first, then whether the activity is running and permitted. Background updates depend on iOS conditions; the activity is not a promise of continuous network synchronization or an unlimited view of future appointments.",
        "Use one ordinary future test event to compare before and after a time change. Record the expected start, the displayed start and whether reopening the app changes the result. Keep real meetings intact and include device, app and iOS versions when reporting the issue."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Confirm the future appointment and selected calendar.",
    "Start Live when available and check the displayed event.",
    "After a reschedule, compare the appointment and activity again.",
    "Keep event alerts enabled independently when you need them."
  ],
  "faq": [
    {
      "q": "Is the countdown always current?",
      "a": "No. A countdown can keep measuring toward a previously saved start time. Verify important reschedules in the app."
    },
    {
      "q": "Why is an all-day event not counted down?",
      "a": "The activity selects future timed appointments rather than all-day entries."
    },
    {
      "q": "Does every iPhone show Dynamic Island?",
      "a": "No. The Lock Screen activity and Dynamic Island are distinct surfaces; Dynamic Island requires a supported model."
    }
  ],
  "sourcesHeading": "Sources and Apple instructions",
  "sources": [
    {
      "label": "Apple: Access features and Live Activities from the Lock Screen",
      "url": "https://support.apple.com/guide/iphone/access-features-from-the-lock-screen-iphcd5c65ccf/ios"
    },
    {
      "label": "Apple: View Live Activities in the Dynamic Island",
      "url": "https://support.apple.com/guide/iphone/view-live-activities-in-the-dynamic-island-iph28f50d10d/ios"
    }
  ],
  "seeAlso": [
    "calendar-notifications-missing-silent-or-duplicated",
    "lock-screen-without-unlocking",
    "calendar-on-apple-watch"
  ]
},

  'lock-screen-without-unlocking': {
  "updated": "2026-10-23",
  "title": "Calendar information on the Lock Screen: choose the right feature",
  "short": "Calendar on the Lock Screen",
  "description": "Distinguish Live Activity from Lock Screen widgets and notification previews. Check availability, privacy and freshness before relying on a calendar glance.",
  "lede": "An event on the locked phone may be a Live Activity, a notification or a widget. Identifying which one you are looking at makes both setup and troubleshooting easier. This guide is published by Arte Soft, the developer of Cloud Calendars.",
  "sections": [
    {
      "heading": "A Live Activity is not a Lock Screen widget",
      "body": [
        "Cloud Calendars provides a Live Activity for upcoming timed appointments. Its Home Screen widgets are separate layouts. Do not assume that a small Home Screen widget can be added beside the Lock Screen clock: Cloud Calendars does not currently offer those accessory widget layouts.",
        "Apple’s Lock Screen widget picker shows the widgets available for that surface. If Cloud Calendars is absent there, repeatedly changing the Home Screen widget size will not add a missing Lock Screen layout. Use the Live Activity feature where it is available instead."
      ]
    },
    {
      "heading": "A notification is a third kind of information",
      "body": [
        "A notification reports an alert that was delivered. A Live Activity presents an ongoing display, while a widget occupies a configured position. A notification remaining on the screen is not proof that its event has not since changed.",
        "If your problem is no sound, follow the notification guide rather than changing widget placement. If the activity itself is missing, check whether it is started and permitted. If an event is wrong everywhere, begin with its owning calendar and account."
      ]
    },
    {
      "heading": "Decide what should be visible while locked",
      "body": [
        "Event titles can reveal more than a time: a client name, medical appointment or private meeting may be readable by someone near the phone. Review the actual locked display in the setting where you use it, rather than assuming that information is hidden because the device is locked.",
        "Apple documents app Live Activity controls in Settings under Apps when that app exposes them. Notification preview settings are a separate control. Choose the display you are comfortable with and verify the result; changing one surface’s preference does not prove the others hide the same details."
      ]
    },
    {
      "heading": "Check freshness before acting",
      "body": [
        "For a glance before leaving, compare the event title and time with what you expect. If a meeting was recently rescheduled or cancelled, open the calendar to confirm it. The ability to see something without unlocking does not guarantee it contains the latest update.",
        "All-day events and already-started meetings are not the same as the future timed event followed by the activity. If you need an overview of the entire day, including those entries, use the full app rather than interpreting an empty activity as a clear schedule."
      ]
    },
    {
      "heading": "Make a small, repeatable check",
      "body": [
        "Use a future appointment with a non-sensitive test title. Start the activity, lock the phone and inspect which details appear. Then compare the same event after changing its time in the owning calendar and allowing the app to receive the update.",
        "Keep the test separate from real invitations. If the result differs from your expectations, note whether the problem is appearance, privacy, content or alert delivery. That distinction gives support a useful starting point without deleting any account or event history."
      ]
    },
    {
      "heading": "For a Hijri or Hebrew date, check the widget itself",
      "body": [
        "An alternate date shown inside a calendar app does not establish that every widget uses that calendar. Choose a widget whose publisher explicitly supports the date and screen surface you want. Apple’s widget guide separates Home Screen placement from the Lock Screen picker.",
        "For example, Hebrew Calendar’s publisher documents Hebrew-date Home and Lock Screen widgets. The App Store description for Widget: Prayer, Adhkar & Hijri lists Hijri dates and Lock Screen widgets. These are attributed capability examples, not accuracy tests or features promised by Cloud Calendars. Inspect the actual widget options and the date method before relying on a religious or holiday date.",
        "To add an available Lock Screen widget, use Apple’s documented Customise and Add Widgets controls, then choose the installed app’s offered layout. If that layout is absent, a setting in another calendar app will not create it. Cloud Calendars’ Live Activity remains a separate feature."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identify whether you see a Live Activity, notification or widget.",
    "Use Cloud Calendars Live Activity for its supported Lock Screen display.",
    "Review visible titles while the phone is locked.",
    "Check recent calendar changes in the app before acting."
  ],
  "faq": [
    {
      "q": "Why is Cloud Calendars missing beside the Lock Screen clock?",
      "a": "Its Home Screen layouts are not accessory Lock Screen widgets. The app’s Lock Screen event display uses a Live Activity."
    },
    {
      "q": "Does hiding notification previews hide a Live Activity?",
      "a": "Treat those as separate controls and inspect the result on your device. Do not assume a notification preference controls every surface."
    },
    {
      "q": "Can an empty activity prove the day is free?",
      "a": "No. It follows future timed events and does not represent the complete calendar."
    },
    {
      "q": "Why does an alternate date appear in Calendar but not in my widget?",
      "a": "The app view and widget layout are separate surfaces. Check that the chosen widget explicitly supports that date format and screen location; do not assume another app’s display setting changes every widget."
    }
  ],
  "sourcesHeading": "Sources and Apple instructions",
  "sources": [
    {
      "label": "Apple: Access features and Live Activities from the Lock Screen",
      "url": "https://support.apple.com/guide/iphone/access-features-from-the-lock-screen-iphcd5c65ccf/ios"
    },
    {
      "label": "Apple: Add and edit widgets on iPhone",
      "url": "https://support.apple.com/118610"
    },
    {
      "label": "Apple: Home and Lock Screen widget controls",
      "url": "https://support.apple.com/en-gb/118610"
    },
    {
      "label": "Hebrew Calendar: publisher-documented date widgets",
      "url": "https://lib.hebcal.co.il/features/widgets.html"
    },
    {
      "label": "Widget: Prayer, Adhkar & Hijri: developer description",
      "url": "https://apps.apple.com/ca/app/widget-prayer-adhkar-hijri/id6820719175"
    }
  ],
  "seeAlso": [
    "a-countdown-to-your-next-meeting",
    "calendar-notifications-missing-silent-or-duplicated"
  ]
},

  'choosing-a-widget-size': {
  "updated": "2026-10-21",
  "title": "Choose a Cloud Calendars widget by its layout, not just its size",
  "short": "Choose a widget layout",
  "description": "Compare date-and-weather widgets with medium and large event lists. Choose readable content without assuming that a large widget is a complete week view.",
  "lede": "Two widgets of the same size can answer different questions. Start with the information you need, then choose the layout that presents it clearly. This guide is published by Arte Soft, the developer of Cloud Calendars.",
  "sections": [
    {
      "heading": "Date and weather have their own layouts",
      "body": [
        "Calendar & Weather is available in small and medium sizes. The small layout emphasizes today’s date and current weather. The medium version adds weather information including moon phase and wind. Neither size should be chosen on the assumption that it is an event agenda.",
        "If your recurring question is simply the date and current conditions, that may be enough. If you need appointment titles, choose one of the event layouts instead of expecting the small tile to gain a next-event row."
      ]
    },
    {
      "heading": "Medium and large event widgets are lists",
      "body": [
        "Calendar Events is the medium layout with upcoming appointments beside date and weather. Calendar Events Large gives the list more room and can show up to eleven upcoming events, with the actual visible count depending on available space.",
        "The large layout is not a seven-day grid. Eleven appointments could belong to one busy day or span several quiet days. Read the event dates; do not use the size of the widget as a statement about its time range."
      ]
    },
    {
      "heading": "Preview with the titles you actually use",
      "body": [
        "A short sample appointment in the gallery does not tell you how your longest meeting title will fit. After adding a layout, compare a few real, non-sensitive examples: a long title, an early start and appointments on different dates.",
        "Check it at your usual viewing distance while stationary. If you need to bring the phone closer to distinguish dates or titles, try a different layout or use the full app. A denser view is only useful if it preserves the distinction you need to make."
      ]
    },
    {
      "heading": "Do not confuse missing rows with lack of space",
      "body": [
        "Changing to the large widget will not make an all-day entry or an already-started appointment eligible for the future-event feed. It also does not restore an unselected calendar or solve a provider sync problem.",
        "If the same appointment is absent from both event layouts, inspect it in the app first. Verify the start time, all-day status and calendar selection. If it is present but the title is difficult to read, that is a layout problem; solve that separately from missing data."
      ]
    },
    {
      "heading": "Keep the layout that reduces a real lookup",
      "body": [
        "Try one event layout for a normal day. Notice whether you open the app because you need more detail, because the row is unreadable or because you want the complete schedule. Those are different reasons, and only some are solved by a larger widget.",
        "Use the full calendar for week planning and all-day commitments. You can remove a Home Screen widget without deleting the underlying appointments. Apple’s widget guide explains how to add, rearrange and remove the display."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Choose date/weather or an event list first.",
    "Compare medium and large event layouts using actual appointment titles.",
    "Read dates rather than assuming a fixed day or week range.",
    "Investigate eligibility and calendar selection before changing sizes."
  ],
  "faq": [
    {
      "q": "Is the large widget a week view?",
      "a": "No. It is an upcoming-event list, so its visible dates depend on your appointments."
    },
    {
      "q": "Why do two medium widgets look different?",
      "a": "Calendar & Weather and Calendar Events are distinct layouts with different content."
    },
    {
      "q": "Will a larger widget include all-day events?",
      "a": "No. The upcoming-event feed excludes all-day entries regardless of display size."
    }
  ],
  "sourcesHeading": "Sources and Apple instructions",
  "sources": [
    {
      "label": "Apple: Add and edit widgets on iPhone",
      "url": "https://support.apple.com/118610"
    }
  ],
  "seeAlso": [
    "the-widget-that-shows-what-is-next"
  ]
},

  'the-calendar-on-a-bedside-table': {
  "updated": "2026-10-21",
  "title": "Use iPhone StandBy without mistaking a glance for tomorrow’s plan",
  "short": "Calendar information in StandBy",
  "description": "Set up iPhone StandBy, check the widgets your device offers and separate a bedside date display from a complete tomorrow agenda or a guaranteed alarm.",
  "lede": "A bedside display can answer a quick question, but its usefulness depends on what is actually on screen. StandBy does not turn every calendar widget into a tomorrow agenda. This guide is published by Arte Soft, the developer of Cloud Calendars.",
  "sections": [
    {
      "heading": "Start with Apple’s StandBy setup",
      "body": [
        "Apple describes StandBy as a charging display for clocks, photos, widgets and Live Activities. Turn it on in iPhone Settings, connect the phone to power and place it stationary on its side. Use the system’s offered views and widgets to choose what appears.",
        "Display persistence depends on the iPhone model and settings. Check what your own phone does when the room is dark rather than assuming the screen will remain visible all night. Apple’s StandBy guide explains its display and night-mode options."
      ]
    },
    {
      "heading": "Inspect the available Cloud Calendars content",
      "body": [
        "Cloud Calendars has date-and-weather widgets, event-list widgets and a Live Activity. Those are different presentations, and a Home Screen layout’s existence does not guarantee that the same layout is offered in StandBy. Check the picker and the result on your installed version.",
        "The small Calendar & Weather layout shows date and weather, not a list of tomorrow’s appointments. Do not interpret a date tile as a next-morning schedule. This guide does not promise a special StandBy agenda or an automatic switch to tomorrow in the evening."
      ]
    },
    {
      "heading": "Make tomorrow’s plan in the calendar first",
      "body": [
        "Before relying on a bedside glance, open tomorrow in the app. Check the first timed commitment, any all-day entries and the time you need for preparation. An upcoming-event display omits all-day and already-started events, so it is not a complete checklist for the day.",
        "For an appointment outdoors or away from home, confirm the relevant place and forecast time in the weather view. Current conditions on a date tile do not establish tomorrow morning’s weather or the conditions at a different venue."
      ]
    },
    {
      "heading": "Keep the bedside view readable and discreet",
      "body": [
        "Look at the display from the place where you will actually read it. A useful view should let you distinguish the date and time without picking up the phone. If the available event presentation is too dense at that distance, use a simpler clock or date view and check details in the app.",
        "Also consider who else can see the screen. A calendar title can reveal private information even when it fits neatly. Choose content appropriate for a shared room and inspect the actual display after it enters StandBy."
      ]
    },
    {
      "heading": "Keep wake-up and meeting reminders separate",
      "body": [
        "A displayed appointment or countdown is not an alarm. Set the wake-up alarm you need and retain appropriate event reminders independently. A screen that turns off, a dismissed activity or information awaiting an update should not be your only cue.",
        "If the displayed event looks wrong, compare it with the app and owning calendar before changing the appointment. Record whether the problem is an unavailable layout, sleeping display or outdated event. Those observations lead to different fixes; deleting calendar data is not a useful first test."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Set up StandBy using Apple’s instructions for your device.",
    "Inspect which layouts are actually available.",
    "Review tomorrow’s full schedule in the app before bed.",
    "Choose readable, appropriately private content and keep alarms separate."
  ],
  "faq": [
    {
      "q": "Does Cloud Calendars automatically show tomorrow after evening?",
      "a": "Do not assume that behavior. Check tomorrow in the app; the date/weather tile and upcoming-event list are not a dedicated tomorrow agenda."
    },
    {
      "q": "Can I use the large Home Screen list in StandBy?",
      "a": "Check the StandBy picker on your device. Home Screen size support does not by itself establish an identical StandBy layout."
    },
    {
      "q": "Does a bedside countdown replace my alarm?",
      "a": "No. Keep a separate wake-up alarm and any event reminders you need."
    }
  ],
  "sourcesHeading": "Sources and Apple instructions",
  "sources": [
    {
      "label": "Apple: Use StandBy while iPhone is charging",
      "url": "https://support.apple.com/guide/iphone/use-standby-iph878d77632/ios"
    }
  ],
  "seeAlso": [
    "choosing-a-widget-size",
    "a-countdown-to-your-next-meeting"
  ]
},
};
