import { LocalisedArticle } from '../types';

export const HELP_EN_US: Readonly<Record<string, LocalisedArticle>> = {
  "unwanted-calendar-events-iphone": {
  "title": "Unwanted calendar events on iPhone: invitations, subscriptions and spam",
  "short": "Remove unwanted calendar events",
  "description": "Identify unwanted invitations or subscribed calendars on iPhone. Check Apple and Google reporting options and settings for future invitations.",
  "lede": "An unfamiliar event does not tell you how it arrived. Find its calendar and account before deciding whether to report an invitation, unsubscribe from a feed or inspect an ordinary event. This guide is written by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "Deleting whatever appears on screen, hiding its calendar or disconnecting an account will all stop the same unwanted events.",
  "sections": [
    {
      "heading": "Identify what arrived before choosing a removal action",
      "body": [
        "Start with one unwanted entry. Inspect its calendar, account, organiser and whether it repeats, without following links in its description. Open the calendar service or application directly. A meeting invitation, an event supplied by a subscribed calendar and an appointment stored in a calendar you own require different decisions.",
        "Suppose unfamiliar appointments appeared after you opened a calendar link. Check whether a new subscribed calendar supplies them before deleting individual dates. If they instead belong to your usual calendar, inspect the invitation and its source. Timing alone does not prove that the link created a subscription. Do not delete your whole personal or work calendar to test the theory."
      ]
    },
    {
      "heading": "Choose between hiding, unsubscribing and reporting",
      "body": [
        "Use this decision sequence: an unwanted external subscription calls for checking the subscription and its unsubscribe control; an unwanted invitation calls for the owning provider’s reporting options; an ordinary event or imported copy calls for checking ownership and the actual event before making any change. A missing report button does not justify deleting a whole calendar.",
        "Hiding a calendar changes what you see. It does not establish that its subscription or events were removed. Unsubscribing and deleting a calendar are also different actions. Before confirming either, check the named calendar and the confirmation text. If the source remains unclear, keep the account and calendar names for your own diagnosis and consult the provider’s guidance rather than trying broader removal actions."
      ]
    },
    {
      "heading": "Use Apple Calendar controls for the identified Apple route",
      "body": [
        "Apple’s current iPhone instructions apply to iOS 26 or later. In Apple Calendar, an event from an unknown contact may offer Report Junk followed by Delete and Report Junk. Inspect the intended event first. These are Apple Calendar instructions, not controls to look for in Cloud Calendars.",
        "For an identified unwanted subscription, open Calendars in Apple Calendar, then the information button beside that calendar. Check for Unsubscribe and confirm only for the intended subscription. Apple also documents Delete Calendar for calendars that can be deleted; do not treat that as a substitute when you are unsure what you selected. Some calendars cannot be removed and can instead be hidden. Check Apple’s current instructions for your version."
      ]
    },
    {
      "heading": "Check Google reporting eligibility and the recurring series",
      "body": [
        "Google says its spam-reporting feature applies to events sent from Google Calendar, not events created by another provider, app or service. In the Google Calendar app on iPhone or iPad, open the intended event and use More, Report as spam, then Report if the option is available and appropriate.",
        "Reporting removes the event from your calendar. For a recurring event, Google says all events in that series are removed. Check that scope before confirming: this is not a way to remove only one unwanted occurrence of an otherwise legitimate meeting. If the event came from elsewhere, return to its owning service or subscription rather than assuming Google can report every entry displayed in its app."
      ]
    },
    {
      "heading": "Treat future Google invitations as a separate decision",
      "body": [
        "Reporting an existing event and changing automatic invitation addition solve different problems. Google’s iPhone app documents Settings, General, Adding invitations, Add invitations to my calendar, then Only if the sender is known. Known includes contacts, people in your organisation and previous interactions. Google warns that this option may reveal to senders that they are not in your contacts.",
        "Google’s computer settings also offer adding an event only when you respond to the invitation in email. Changes apply to new invitations, and work or school administrators may restrict the options. An invitation email can still arrive when its event is not automatically added. Choose a setting that fits how legitimate appointments reach you; it is not a promise to erase old events or eliminate every unwanted message."
      ]
    },
    {
      "heading": "Use iCloud reporting with the intended Apple Account",
      "body": [
        "For an iCloud invitation, Apple also documents reporting through Calendar on iCloud.com using a tablet or computer. Sign in directly with the intended Apple Account, open the unwanted invitation and select Report Junk. Apple says the event is then deleted from your calendar across devices signed in to that account.",
        "This is an iCloud invitation workflow. It does not establish the behaviour of an imported copy, an external feed or another provider’s event. If you cannot find the invitation there, check its account and calendar instead of assuming the reporting action failed. Do not move an event between accounts simply to make it appear in a reporting screen."
      ]
    },
    {
      "heading": "Verify the result where the information is owned",
      "body": [
        "After an action, check the original provider or the subscription list you changed. Then compare the relevant calendar in your iPhone view. If an entry remains, establish whether it is the same source or another copy before repeating the action. There is no single refresh deadline covering every provider and calendar application.",
        "Keep the fix narrow. A suspicious invitation does not by itself establish that you should disconnect every account or reset a secret calendar feed address. Use the separate disconnection or feed guide when that is the actual problem. The reporting and filtering instructions here belong to Apple and Google; they do not describe a Cloud Calendars anti-spam feature."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Inspect one entry’s calendar, account, organiser and recurrence without opening suspicious links.",
    "Distinguish an invitation, an external subscription and an ordinary or imported event.",
    "For a confirmed unwanted subscription, inspect its unsubscribe control rather than deleting an unrelated calendar.",
    "Before reporting a Google event, check its source and the consequence for the recurring series.",
    "Review future invitation settings separately from removing existing events; check account restrictions.",
    "Verify the result at the owning provider or subscription list, then compare your iPhone view."
  ],
  "faq": [
    {
      "q": "Why do unwanted events remain after I hide their calendar?",
      "a": "Hiding controls the display. It does not demonstrate that you unsubscribed or removed the underlying events. Identify the calendar’s source before choosing a provider reporting or subscription action."
    },
    {
      "q": "Can Google report every suspicious event visible in its calendar app?",
      "a": "No. Google documents reporting for events sent from Google Calendar. Events created by another provider, app or service are outside that reporting feature. Check the original source rather than assuming a missing button is an app fault."
    },
    {
      "q": "Will changing Google invitation settings remove existing spam?",
      "a": "Google says updated invitation settings apply to new invitations. Review existing unwanted events separately. Email may still arrive even when an invitation is not automatically added to the calendar."
    },
    {
      "q": "Should I delete my entire calendar to remove an unwanted subscription?",
      "a": "No. First establish which calendar is the subscription and inspect its unsubscribe option. Do not use deletion of an owned calendar as a shortcut for identifying the source."
    }
  ],
  "sourcesHeading": "Apple and Google guidance",
  "sources": [
    {
      "label": "Apple: remove events, unsubscribe or hide calendars on iPhone",
      "url": "https://support.apple.com/en-au/102444"
    },
    {
      "label": "Google: report inappropriate events on iPhone and iPad",
      "url": "https://support.google.com/calendar/answer/13155911?co=GENIE.Platform%3DiOS&hl=EN"
    },
    {
      "label": "Google: manage new invitations and account restrictions",
      "url": "https://support.google.com/calendar/answer/13159188"
    },
    {
      "label": "Apple: receive, reply to and report invitations on iCloud.com",
      "url": "https://support.apple.com/en-gb/guide/icloud/mm6b1a8534/1.0/icloud/1.0"
    }
  ],
  "seeAlso": [
    "disconnect-calendar-integration-without-losing-track",
    "the-secret-address-of-a-google-calendar",
    "keeping-track-of-who-replied"
  ],
  "updated": "2026-10-22",
  "articleLinks": [
    {
      "slug": "iphone-calendar-add-only-full-access",
      "label": "Calendar permission levels"
    },
    {
      "slug": "google-calendar-report-assigned-task-spam",
      "label": "Unwanted assigned Google task? Identify the shared source before reporting it"
    }
  ]
},

  "change-calendar-color-iphone": {
  "updated": "2026-11-04",
  "title": "How to Change Calendar Colors on iPhone (iCloud & Google)",
  "short": "Calendar colors and event colors",
  "description": "Change calendar colors on iPhone without moving events: compare iCloud, local, Google Calendar, and shared-calendar color settings and per-event colors.",
  "lede": "A color can identify a calendar, override one event or simply reflect an app’s display style. First choose which of those you want to change. This guide is published by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "Changing a calendar’s color changes only one event, appears identically in every app and has the same effect for every person viewing the calendar.",
  "sections": [
    {
      "heading": "Decide whether you mean a calendar or one event",
      "body": [
        "A calendar-wide color helps you recognize a group of appointments. An individual-event color is a separate feature: changing one meeting in a provider’s app does not mean you have changed the calendar’s default. A text-style setting can change the appearance again without moving either record.",
        "For example, a blue household calendar and a green club calendar can make a week easier to scan. Keep their names and owning accounts distinct too. Two blue events can belong to different accounts, and an event’s color does not establish its owner, sharing permissions, availability or invitation response."
      ]
    },
    {
      "heading": "Find the calendar and the control it actually offers",
      "body": [
        "Before changing anything, note the calendar name, owning account and connection route. An iOS calendar, an app-owned calendar and a received Cloud calendar can have different controls. Direct Google and Microsoft connections do not offer the same existing-calendar edit control as editable local or iCloud calendars.",
        "If the expected info or edit control is absent, check the calendar type and the actions available for your role. Do not buy a different plan, create another calendar or move appointments just because a color option is missing. A provider editor may be the appropriate place for that provider’s setting."
      ]
    },
    {
      "heading": "Change an available calendar color in Cloud Calendars",
      "body": [
        "For an editable iOS calendar that offers the info control in the calendar list, open Edit Calendar. Leave Calendar Name unchanged for a color-only edit. Under COLOR, tap the current color, choose a preset or Custom..., return to the editor and choose Done. Cancel leaves that editor without applying this save. Labels and available controls can vary with the calendar type and installed version.",
        "After saving, reopen the calendar list and inspect several appointments from that calendar. Then compare the same source in the relevant provider or system calendar. A successful local appearance change does not by itself prove that a provider accepted the color or that another device will show it immediately."
      ]
    },
    {
      "heading": "Separate a received calendar’s personal color from its creator’s default",
      "body": [
        "A received Cloud calendar may offer Default from creator and Custom on this device. Where those choices appear, the personal override is different from editing the creator’s calendar color. Use the displayed scope when deciding whether to follow the creator’s default or choose a color for this device.",
        "Do not generalize that every color change is private to its viewer. Editing a calendar you own can update its shared metadata, while a received-calendar override has a different purpose. Neither a new color nor a familiar color establishes that access was granted, removed or changed. Check the actual sharing settings for those decisions."
      ]
    },
    {
      "heading": "Use Google’s own controls for Google calendar and event colors",
      "body": [
        "Google documents a calendar-wide color choice on its computer website: beside the intended calendar under My calendars or Other calendars, open Options and choose a color or Add custom color. For an individual event in Google’s iPhone or iPad app, open the event, choose Edit, select a color and save. These are Google controls, not instructions for a matching Cloud Calendars button.",
        "Apple notes that some calendar colors, including Google’s, are set by the server. Cloud’s Google connection reads the provider’s calendar background color during synchronization. A different local mirror color can therefore be replaced. Compare the source before treating a changed-back color as lost events; do not create a duplicate calendar to repair its appearance."
      ]
    },
    {
      "heading": "Allow for different renderings and provider features",
      "body": [
        "Calendar colors and per-event features are not interchangeable between apps. Google event-color overrides, Outlook categories and another app’s colored tags should not be assumed to appear identically in Cloud Calendars. Microsoft calendar colors or categories may differ from the appearance you see here; compare the actual calendar and event details in Outlook.",
        "Other apps can also style event text independently: BusyCal’s iOS settings distinguish plain text, calendar or tag colors and calendar-only colors. This is a BusyCal feature description, not a Cloud tag-control promise. Choose colors whose text and markers you can read in the views and appearance you use, and retain descriptive calendar names rather than relying on hue alone."
      ]
    },
    {
      "heading": "If a color returns, trace the source before changing data",
      "body": [
        "Check where you made the choice, whether you completed that editor’s save and whether it still appears after reopening. Compare the same calendar in Cloud Calendars, the owning provider and any second device separately. Record which appearance differs and whether it changes again after synchronization; these are observations, not a promised refresh-time test.",
        "Keep appointments in their intended calendars while diagnosing appearance. Moving an event can change its destination, account or collaboration context; it is not merely a paint operation. For help, note the app version, calendar type, connection route and the control you used, with a non-sensitive example. Leave passwords and private event details out of screenshots."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identify the calendar and owning account before using its color as a cue.",
    "Choose between a whole-calendar color, an individual-event option and a display style.",
    "Use an available calendar editor, leave its name unchanged and complete Done.",
    "For a received calendar, read the scope of Default from creator or Custom on this device.",
    "Compare Google or Microsoft appearance with the provider without assuming identical color support.",
    "Keep event destinations intact while checking a changed-back color."
  ],
  "faq": [
    {
      "q": "Can I change just one event with the calendar color control?",
      "a": "The calendar color control changes the calendar’s appearance, not a general independent event-color override. A provider’s own event editor may offer a separate option; that does not guarantee the same override will appear in Cloud Calendars."
    },
    {
      "q": "Why is there no color-edit button for my connected calendar?",
      "a": "Available controls depend on the calendar type and your role. Direct Google and Microsoft rows do not expose the same existing-calendar editor as editable local or iCloud calendars. Check the provider’s own settings rather than creating another calendar."
    },
    {
      "q": "Will everyone see the color I choose?",
      "a": "Do not assume so. A received-calendar personal override differs from the creator’s shared default, and different apps can render colors differently. Check the scope shown by the control and compare the relevant view."
    },
    {
      "q": "Should I move an event to another calendar just to recolor it?",
      "a": "No. Moving changes the event’s destination and can affect its account or collaboration context. Identify the available color or display option first, and keep the event in the calendar where it belongs."
    }
  ],
  "sourcesHeading": "Official color controls and display guidance",
  "sources": [
    {
      "label": "Apple: Calendar colors on iPhone and server-controlled accounts",
      "url": "https://support.apple.com/guide/iphone/use-multiple-calendars-iph3d1110d4/27/ios/27"
    },
    {
      "label": "Google: Change a calendar’s color on a computer",
      "url": "https://support.google.com/calendar/answer/37095?hl=en&pp=env"
    },
    {
      "label": "Google: Pick an event color on iPhone and iPad",
      "url": "https://support.google.com/calendar/answer/72143/?co=GENIE.Platform%3DiOS&hl=en"
    },
    {
      "label": "BusyCal: iOS appearance and event text styles",
      "url": "https://www.busymac.com/docs/busycalios/70670-settings/"
    }
  ],
  "seeAlso": [
    "work-and-personal-without-two-apps",
    "event-saved-to-wrong-calendar",
    "when-two-calendars-disagree"
  ],
  "articleLinks": [
    {
      "slug": "outlook-calendar-color-categories",
      "label": "Outlook colour categories"
    }
  ]
},

  "recover-deleted-calendar-events-iphone": {
  "updated": "2026-11-04",
  "title": "How to Recover Deleted Calendar Events on iPhone Safely",
  "short": "Recover a deleted calendar event",
  "description": "Check whether a missing iPhone event is hidden or deleted, then restore it safely via Google Calendar Trash or iCloud.com Data Recovery without surprises.",
  "lede": "A missing appointment does not always need restoring. First establish where it was stored and whether it still exists there. If it was deleted, the recovery method depends on that provider. This guide is published by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "Restoring a calendar always brings back just the missing appointment, with every invitation and sharing arrangement unchanged.",
  "sections": [
    {
      "heading": "First separate a missing display from a deleted record",
      "body": [
        "Identify the account and calendar that held the appointment, then check its approximate date in the provider’s own calendar. Confirm the signed-in identity, especially when work and personal accounts have similar calendar names. If the event is still there, use the missing-calendar or search guide below. Do not restore data merely because one app cannot display or find it.",
        "A shared calendar that you can no longer access is also a different problem from a deleted event. Ask the owner to confirm the calendar and your access before choosing a recovery operation. For a calendar stored only on a device, do not assume that Google or iCloud holds an independent copy. Avoid adding a second account connection or importing an old file while the original location is uncertain."
      ]
    },
    {
      "heading": "For Google, inspect the right calendar’s Trash on a computer",
      "body": [
        "Google documents recovery on a computer: open Google Calendar with the relevant account, then Settings > Trash. Each calendar has its own Trash. Restoring requires at least the calendar permission to make changes to events. Identify the intended record before using its Restore control; Google also provides restoration of selected records.",
        "Google normally keeps trashed events for 30 days, but permanent deletion can remove that opportunity. Its spam checks can also place an invitation there. An empty Trash is not proof that you checked the right calendar or have the required access. Consult Google’s current instructions before acting."
      ]
    },
    {
      "heading": "Check Google recurrence and meeting consequences",
      "body": [
        "Google says instances removed with “This and following events” do not enter Trash and cannot be restored. Other recurring deletions may appear as one grouped row; restoring it can restore multiple deleted instances. Check the scope rather than assuming one row means one date.",
        "When an event creator restores an event, Google says guests must RSVP again. A previously booked room may no longer be available. Compare the restored meeting with its intended participants, dates and resource arrangements before treating it as ready to attend."
      ]
    },
    {
      "heading": "For iCloud, understand calendar replacement before proceeding",
      "body": [
        "Apple’s iCloud recovery restores an earlier calendar version across devices, replacing the existing calendars. It saves the current version first, but recent changes may be lost. This is not Google’s selected-event Trash workflow. Read Apple’s linked instructions and assess the replacement consequences before choosing an archive.",
        "Apple advises making a backup before restoring. Its documented route is iCloud.com > Data Recovery > Restore Calendars, where available versions are dated. Do not select a version solely because it predates the missing appointment: first consider other changes made since then and what you need to preserve."
      ]
    },
    {
      "heading": "Account for iCloud sharing and invitation effects",
      "body": [
        "Apple says calendar sharing settings are erased by restoration. You must share your calendars again or ask their owners to share them again. It also describes cases where invitation and cancellation messages are not sent again. Read those details rather than assuming that restoring the calendar reconstructs everyone’s current understanding.",
        "Before deciding, record which calendars you share, who needs access and which arrangements changed recently. Afterward, check access with the people involved and confirm any uncertain meeting directly. Keep this record private; it is a checklist for rebuilding the intended arrangement, not a reason to redistribute invitation links or everyone’s event details."
      ]
    },
    {
      "heading": "Use the smallest recovery task that matches the evidence",
      "body": [
        "Suppose a club’s Tuesday planning meeting disappears from your phone after you changed next month’s venue. First check the club’s owning account and the Tuesday date. If the meeting remains there, investigate the phone’s view. If it was deleted, establish the provider and the available recovery scope. A dated archive deserves a broader review than a single identified record: the newer venue arrangement also matters.",
        "Write down the intended outcome before acting: recover this appointment, preserve the later venue change and confirm the current participants. Do not turn the exercise into moving the club calendar to another account. After any recovery, compare those specific facts with the organiser rather than assuming that an event with the familiar title means the whole problem is solved."
      ]
    },
    {
      "heading": "Verify the result at the source before relying on your phone",
      "body": [
        "Recheck the owning calendar, the exact date and time, relevant recurring dates, access and meeting arrangements. Then compare the same event on the iPhone. If the source is correct but the app differs, return to connection, selection and date-coverage checks; do not repeat a recovery operation to force the display to change.",
        "For support, keep a non-sensitive record of the provider, calendar type, approximate date, action taken and where the event is now visible. Omit private links, passwords and confidential notes. These are Google and iCloud procedures, not Cloud Calendars Trash or restore controls. They do not establish recovery options for Outlook, another provider, a device-only calendar or Cloud Calendars sharing data; consult the appropriate service rather than applying these steps to it."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Present at the owning provider, missing on the phone: investigate display, selection, connection and search scope before recovery.",
    "Access to a shared calendar has disappeared: confirm identity and permission with its owner before assuming deletion.",
    "Deleted from a Google calendar: review that calendar’s computer-based Trash and the documented access, recurrence and meeting limits.",
    "Deleted from iCloud: assess the earlier-version replacement and sharing consequences before choosing a recovery version.",
    "Stored somewhere else or location uncertain: identify the actual service and its recovery guidance; do not guess from the app displaying it.",
    "After recovery: compare the original scheduling facts at the provider, confirm uncertain arrangements, then check the phone."
  ],
  "faq": [
    {
      "q": "The event still appears on the provider’s website. Should I restore a backup?",
      "a": "Start with the phone’s account, selected calendar, date range and search behaviour. Preserve the existing provider record; a missing display alone does not establish that data needs restoring."
    },
    {
      "q": "Can I follow these steps for a calendar someone shared with me?",
      "a": "First distinguish lost access from deletion and identify who controls the calendar. Use the relevant provider’s permission rules, and involve the owner when needed. Receiving a shared calendar does not by itself establish authority to restore it."
    },
    {
      "q": "Should I import an old ICS file if recovery is unavailable?",
      "a": "Treat that as a separate copy/import decision. Check its date, destination and what it preserves using the export guide below. Do not assume that importing recreates the original meeting or its participants’ arrangements."
    },
    {
      "q": "Does Cloud Calendars offer the recovery controls described here?",
      "a": "The controls in this guide belong to Google Calendar and iCloud.com. No Cloud Calendars recovery procedure is established here. Identify the event’s storage service before deciding which instructions apply."
    }
  ],
  "sourcesHeading": "Official recovery procedures and consequences",
  "sources": [
    {
      "label": "Google: calendar Trash, restoration, recurrence and guest responses",
      "url": "https://support.google.com/calendar/answer/37113?co=GENIE.Platform%3DDesktop&hl=en"
    },
    {
      "label": "Apple: restore iCloud calendars and understand replacement and sharing effects",
      "url": "https://support.apple.com/en-gb/102508"
    }
  ],
  "seeAlso": [
    "find-old-calendar-events-by-account-date-and-title",
    "google-calendars-that-never-reach-your-iphone",
    "calendar-export-ics-pdf-and-backup",
    "why-a-shared-calendar-does-not-appear"
  ],
  "articleLinks": [
    {
      "slug": "outlook-recover-deleted-calendar-items",
      "label": "Recover deleted Outlook events"
    }
  ]
},

  "disconnect-calendar-integration-without-losing-track": {
  "updated": "2026-10-22",
  "title": "Disconnect a calendar integration: access, sync and existing copies",
  "short": "Disconnect a calendar integration carefully",
  "description": "Separate calendar sign-out, provider access and existing copies. Check Cloud Calendars account routes before disconnecting or removing a calendar.",
  "lede": "Stopping a connection and removing its calendar copies are different decisions. Identify the route you use and preserve needed information before choosing a disconnect action. This guide is published by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "Signing out only pauses updates, revokes every related permission and leaves all existing calendar data exactly as it was.",
  "sections": [
    {
      "heading": "Identify the connection you intend to stop",
      "body": [
        "Start with the account and calendar that own the events. A provider account added through iPhone settings, a direct connection in Cloud Calendars, an iCalendar subscription and the app’s sharing identity are separate routes. The same email address does not make their controls interchangeable.",
        "Write down the calendar names and which route displays them, without sharing private event details. Decide whether your aim is to stop future access, leave a shared arrangement or remove a copy. If you are investigating a missing or duplicate event, disconnecting is not the first diagnostic step."
      ]
    },
    {
      "heading": "Check what the app’s sign-out action removes",
      "body": [
        "The implementation reviewed for this guide attempts to disconnect the selected Google calendar profile and remove its mapped calendar copies from the iOS calendar store. Treat this as a removal action, not a pause. A connection error can still occur, so check the provider’s access status separately rather than assuming every permission was revoked.",
        "The Microsoft calendar-profile sign-out path also attempts to remove its mapped calendars and local connection records. Do not assume those copies will remain visible. Calendar-copy storage can depend on the device’s available sources, so check the source and preserve needed information before proceeding."
      ]
    },
    {
      "heading": "Review future access at the provider separately",
      "body": [
        "Google’s linked-app controls distinguish Sign in with Google from access to Google Account data. Review the intended app, account and link type. Removing the relevant data access and stopping a sign-in link answer different questions; an app-level sign-out alone is not proof that every connection is gone.",
        "For a Microsoft work or school account, Microsoft documents My Apps > Manage your application to review permissions. You can revoke permissions you personally granted, but administrator-granted access needs the organisation’s administrator. This is work-or-school guidance, not a universal procedure for personal Microsoft accounts."
      ]
    },
    {
      "heading": "Separate a sharing identity from calendar-provider sync",
      "body": [
        "Cloud Calendars also has an account used for sharing. Its current source treats signing out of that account separately from the calendar-profile connections: it clears the local sharing session and reduces locally tracked shared access to reader status. That is not a declaration that all server data has been deleted.",
        "When multiple sharing identities are linked, disconnecting one retains the account through another identity. With the final identity, the current path signs out locally and leaves the server link for recovery. Do not use signing out as a substitute for a data-deletion request or assume it also disconnects every calendar provider."
      ]
    },
    {
      "heading": "Handle subscriptions and previous copies by their own rules",
      "body": [
        "Apple documents unsubscribing from an external calendar separately from selecting which calendars to display. If the item is a read-only subscription, identify that subscription before using its unsubscribe control. Hiding a calendar, unsubscribing from a feed and deleting an editable calendar are different operations.",
        "Google notes that removing an app’s access may still require a separate request to delete data the developer already holds. Likewise, a previously exported file or another person’s copy is not recalled by a permission switch. Keep privacy or retention follow-up separate from whether new updates are still authorised."
      ]
    },
    {
      "heading": "Confirm the outcome before cleaning up anything else",
      "body": [
        "After an intentional change, check the provider’s connection status and compare the original calendar with the app. Identify what stopped updating, what disappeared locally and what remains elsewhere. Do not delete lookalike events merely because a connection name no longer appears.",
        "If the result is unexpected, stop further cleanup and contact support with the account route, calendar source and the action you used. Do not send passwords, access tokens, private feed URLs or screenshots of sensitive appointments. Explain whether the original provider calendar still has the events so support can distinguish a connection problem from a missing copy."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identify the exact account, calendar and connection route.",
    "Decide whether you want to stop access, leave sharing or remove a copy.",
    "Preserve needed information through a verified export or backup route.",
    "Read what the installed sign-out or disconnect action removes before using it.",
    "Review provider permissions separately; involve an administrator for managed access.",
    "Check the result at the provider and app before any further cleanup."
  ],
  "faq": [
    {
      "q": "Does signing out of a direct Cloud Calendars connection keep its calendar copies?",
      "a": "Do not assume that. The inspected Google and Microsoft calendar-profile paths attempt to remove their mapped calendars from the iOS store. Review the source and preserve needed information before disconnecting."
    },
    {
      "q": "Does removing an app’s Google access delete data it already copied?",
      "a": "Google says you may need to request deletion of data already held by the developer separately. Review future access and retained data as different outcomes."
    },
    {
      "q": "Is signing out of the sharing account the same as deleting it?",
      "a": "No. The current sharing path clears a local session and retains recovery behaviour; it is separate from the calendar-provider sign-out paths and is not proof of server-data deletion."
    }
  ],
  "sourcesHeading": "Official access and subscription guidance",
  "sources": [
    {
      "label": "Google: manage linked apps and different connection types",
      "url": "https://support.google.com/accounts/answer/13533235?hl=en"
    },
    {
      "label": "Google: access and data already held by a linked app",
      "url": "https://support.google.com/accounts/answer/14012355?hl=en"
    },
    {
      "label": "Microsoft: work or school My Apps permissions",
      "url": "https://support.microsoft.com/en-us/accounts-billing/work-school/edit-or-revoke-application-permissions-in-the-my-apps-portal"
    },
    {
      "label": "Apple: calendar selection and subscriptions on iPhone",
      "url": "https://support.apple.com/guide/iphone/use-multiple-calendars-iph3d1110d4/ios"
    }
  ],
  "seeAlso": [
    "what-calendar-sync-actually-does",
    "calendar-export-ics-pdf-and-backup",
    "taking-back-a-calendar-you-shared",
    "the-secret-address-of-a-google-calendar",
    "when-two-calendars-disagree",
    "unwanted-calendar-events-iphone"
  ],
  "articleLinks": [
    {
      "slug": "icloud-delete-calendar-every-device",
      "label": "Delete an iCloud calendar deliberately"
    },
    {
      "slug": "google-calendar-hide-unsubscribe-or-delete",
      "label": "Hide, unsubscribe or delete"
    }
  ]
},

  "caldav-calendar-on-iphone": {
  "updated": "2026-10-22",
  "title": "CalDAV calendar on iPhone: setup, permissions and missing events",
  "short": "CalDAV calendars on iPhone",
  "description": "Add a CalDAV account through iPhone settings, then check calendar access and selection. Separate account sync from read-only feeds and duplicate copies.",
  "lede": "A calendar can be present on its server but missing from an iPhone app. Work through the account, the device calendar system and the app’s selection in that order. This guide is published by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "Any calendar URL is interchangeable with a CalDAV account, and adding it once makes every app able to read and edit it.",
  "sections": [
    {
      "heading": "Identify an account, a subscription or an imported file",
      "body": [
        "Before entering anything, ask the provider which connection it supports on iPhone. A CalDAV account uses server and account information. An iCal subscription follows a calendar feed; opening an exported calendar file can create a separate copy. These routes answer different needs, even when they display appointments with the same titles.",
        "For example, a club administrator who needs to update the shared timetable needs the provider’s permitted editing route. A member who only follows the timetable may have a subscription instead. The member should not keep trying a feed URL as a username or assume that seeing an event grants permission to change it."
      ]
    },
    {
      "heading": "Use the provider’s iPhone instructions and Apple’s account settings",
      "body": [
        "Apple’s current guide places CalDAV setup under Settings > Apps > Calendar > Calendar Accounts > Add Account > Add Other Account > CalDAV account. Enter the server and account information supplied by your provider. Labels can differ on older iOS versions. Use the service-specific account option when the provider’s instructions call for it.",
        "Check the provider’s authentication requirements before entering a password: some services use an app-specific password or another approved setup process. Do not substitute instructions written for a different calendar app or guess a server address from an email domain. For a work account, use the organisation’s approved configuration rather than changing security controls to make a connection succeed."
      ]
    },
    {
      "heading": "Confirm the calendar reaches Apple Calendar first",
      "body": [
        "Open Apple Calendar and inspect its calendar list for the account and the particular calendar. Compare one ordinary appointment with the provider’s own view: title, calendar name, date and local time. A successful account sign-in is only the first observation; it does not identify which calendars and dates have actually reached the device.",
        "If the appointment is already absent there, investigate the account with the provider before repeatedly adding it in another app. Apple describes a Fetch schedule for accounts without Push support. That is not a guarantee that every account or receiving app refreshes immediately. Note where the appointment is visible and the time of your check."
      ]
    },
    {
      "heading": "Check Cloud Calendars access and calendar selection",
      "body": [
        "Cloud Calendars reads device calendars through Apple’s calendar system. In iPhone Settings > Privacy & Security > Calendars, review its access. Full calendar access is needed to read existing events; permission only to add events does not give access to the existing schedule.",
        "Then open the calendar list in Cloud Calendars. Look for the intended calendar, including the Other group, and check that it is selected. A calendar available on the device can still have provider-specific compatibility or sharing limitations. If it appears in Apple Calendar but is absent here, record that difference rather than creating a second account connection."
      ]
    },
    {
      "heading": "Verify writing and the destination separately",
      "body": [
        "An account can contain calendars with different permissions. Visibility is not proof that a provider will accept an edit, and an available local editor is not a permission grant. Keep a received invitation or an established recurring meeting in its original calendar while checking the connection.",
        "If you own a writable calendar and need to test the route, use a clearly named, non-sensitive test appointment. Choose the destination calendar explicitly, save it and check the provider’s own view. Then make one small change and compare again. Do not test by moving a real shared meeting between calendars: that changes the arrangement you are trying to inspect."
      ]
    },
    {
      "heading": "Diagnose duplicates without deleting the source",
      "body": [
        "If the same appointment appears twice, note both calendar names and how each reached the phone. An account connection, a subscribed feed and an earlier import can coexist. Temporarily hide one calendar to identify which display it supplies; hiding is different from deleting an event or removing an account. Record the original selection and restore it after comparing. In Cloud Calendars, selection can also affect widgets, notification scheduling and Google synchronization.",
        "For a support report, describe the provider, iOS version, calendar name, connection route and where the test appointment is visible. Keep passwords, private feed URLs and sensitive event details out of screenshots. This guide covers a device-account workflow; it does not establish direct server-to-server CalDAV synchronisation or automatic availability copying between providers in Cloud Calendars."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identify whether you have a CalDAV account, a feed subscription or an exported file.",
    "Follow the provider’s approved iPhone setup and authentication instructions.",
    "Check the intended calendar and a known appointment in Apple Calendar.",
    "Review Cloud Calendars calendar access and select the intended calendar.",
    "Use a disposable event in a calendar you own to check permitted writing.",
    "Compare connection routes before hiding a duplicate display or asking for support."
  ],
  "faq": [
    {
      "q": "Is a CalDAV account the same as an iCal subscription?",
      "a": "No. Account access and a subscribed calendar feed are different connections. Confirm which route your provider supplies and whether it permits editing."
    },
    {
      "q": "Why can Apple Calendar show an event that Cloud Calendars does not?",
      "a": "Check Cloud Calendars calendar permission and whether the particular calendar is selected. If it remains absent, record the account and calendar involved; visibility in one app is not a guarantee of every app’s behaviour."
    },
    {
      "q": "Does this mean Cloud Calendars directly connects to any CalDAV server?",
      "a": "No. This workflow adds the account through iPhone settings, then checks the device calendars available to the app. Provider compatibility, authentication and edit permissions still need checking."
    }
  ],
  "sourcesHeading": "Official account and permission guidance",
  "sources": [
    {
      "label": "Apple: calendar account settings, CalDAV setup and Fetch",
      "url": "https://support.apple.com/guide/iphone/change-calendar-settings-iphc37be2016/ios"
    },
    {
      "label": "Apple: review access to calendar information",
      "url": "https://support.apple.com/en-ca/guide/iphone/iph251e92810/ios"
    }
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view",
    "what-calendar-sync-actually-does",
    "calendar-export-ics-pdf-and-backup"
  ],
  "articleLinks": [
    {
      "slug": "mac-calendar-subscription-auto-refresh",
      "label": "Refresh a subscribed calendar"
    },
    {
      "slug": "mac-calendar-subscription-icloud-on-my-mac",
      "label": "Choose where a subscription lives"
    },
    {
      "slug": "mac-calendar-caldav-delegation-allow-write",
      "label": "CalDAV account delegation on Mac"
    }
  ]
},
  "calendar-notifications-missing-silent-or-duplicated": {
  "updated": "2026-11-04",
  "title": "iPhone Calendar Alerts Not Working, Silent, or Duplicated?",
  "short": "Troubleshoot calendar notifications",
  "description": "Fix missing, silent, or duplicate calendar notifications on iPhone: check saved event alerts, iOS Notification & Focus settings, and multiple apps.",
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
    "iphone-calendar-tasks-reminders-versus-event-alerts",
    "what-calendar-sync-actually-does",
    "when-two-calendars-disagree"
  ],
  "articleLinks": [
    {
      "slug": "icalendar-valarm-relative-absolute-trigger",
      "label": "Read an alarm trigger"
    },
    {
      "slug": "icloud-shared-calendar-update-emails",
      "label": "Shared-calendar update emails"
    },
    {
      "slug": "mac-calendar-ignore-alerts-one-calendar",
      "label": "Ignore alerts for one calendar"
    },
    {
      "slug": "mac-calendar-custom-alert-email-open-file",
      "label": "Choose a custom alert action"
    },
    {
      "slug": "google-calendar-email-notifications-filter",
      "label": "Google Calendar email noise"
    }
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
    "when-two-calendars-disagree",
    "recover-deleted-calendar-events-iphone"
  ],
  "articleLinks": [
    {
      "slug": "icloud-calendar-hide-past-events",
      "label": "Hidden past iCloud events"
    }
  ]
},
  "calendar-export-ics-pdf-and-backup": {
  "updated": "2026-11-04",
  "title": "Export iPhone Calendar Events to ICS, PDF, or CSV Safely",
  "short": "Choose a calendar export format",
  "description": "Export calendars shown on your iPhone using official Google Calendar, iCloud/Mac Calendar, or Outlook routes: choose ICS data, printable PDF, or CSV rows.",
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
      "heading": "When you need calendar rows in CSV",
      "body": [
        "CSV is useful when the next task is a spreadsheet report rather than adding events to another calendar. BusyCal documents an iOS CSV export: choose calendars in its export settings, then save or share the generated file. Its rows represent individual event occurrences. This is a BusyCal workflow, not a Cloud Calendars export button.",
        "For a monthly activity report, decide which calendars and dates belong in the report before sharing it. Open the resulting spreadsheet and inspect timestamps, repeated appointments, notes and any private details. A table that is convenient to filter is not automatically a complete backup or an updating calendar subscription.",
        "Keep the distinction when moving data: exporting spreadsheet rows, importing editable events and subscribing to future changes are different operations. BusyCal’s iOS export documentation points to its Mac app for ICS import; do not infer that every export control also supplies the reverse import workflow."
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
      "heading": "If a subscribed calendar stops updating",
      "body": [
        "First identify whether you imported a file or subscribed to an address. Google explicitly says imported events do not stay in sync between accounts; Microsoft makes the same distinction for published ICS files. Importing the same file again is not a subscription refresh and can add another set of records.",
        "For an actual subscription, compare a known changed appointment in its owning calendar and the receiving calendar. Check the intended source and whether its publishing or sharing arrangement is still available. Microsoft says ICS refresh frequency depends on the recipient’s provider. If an intermediary processes the feed, its own refresh and the recipient’s refresh are separate stages; do not assume updating one instantly updates the other.",
        "Before giving a calendar address to a conversion service, check whether you may share that feed and what data the service will receive. Do not publish a work calendar to bypass an organization’s access restriction. Keep private feed addresses out of public support posts; a service that does not request your account password can still receive the calendar content you provide."
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
    },
    {
      "heading": "For Google, distinguish a copy from an ownership handoff",
      "body": [
        "An export/import is a data copy, not a transfer of the original Google calendar. If responsibility for an existing secondary calendar must pass to another person, complete Google’s ownership-transfer workflow and verify acceptance before retiring the owning account. The dedicated handoff guide below supplies the state table, access checks and current provider requirements."
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
    },
    {
      "q": "Will converting an ICS feed fix every one-hour difference?",
      "a": "No. First compare the intended date, the event’s time zone, the display zone and the same recurring occurrence at the source and recipient. A format issue is a possibility to investigate, not the explanation for every time difference. Do not shift the original meeting merely to compensate for one display."
    },
    {
      "q": "Google says “Processed zero events.” Should I import again?",
      "a": "First check the calendar selected as the import destination. Google says this message can appear after a second click on Import when the first import already succeeded. Look for the expected events before retrying. The message alone does not prove that events are missing, and it is not a guarantee that repeated imports always avoid duplicates. If the result is still unclear, follow Google’s computer-based import troubleshooting and compare the destination before deleting anything."
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
    },
    {
      "label": "BusyCal: iOS CSV export and event-occurrence rows",
      "url": "https://www.busymac.com/docs/busycalios/export-as-csv/"
    },
    {
      "label": "Google: event and display time zones",
      "url": "https://support.google.com/calendar/answer/37064?hl=en"
    },
    {
      "label": "Google: transfer calendar ownership, move or copy events",
      "url": "https://support.google.com/calendar/answer/78739?hl=en"
    },
    {
      "label": "Google: fix problems importing calendar events",
      "url": "https://support.google.com/calendar/answer/45654?hl=en"
    }
  ],
  "seeAlso": [
    "sharing-one-event-not-your-calendar",
    "inviting-people-who-do-not-have-the-app",
    "the-secret-address-of-a-google-calendar",
    "time-zones-and-the-flight-you-booked",
    "recover-deleted-calendar-events-iphone"
  ],
  "articleLinks": [
    {
      "slug": "google-calendar-ownership-transfer-pending-acceptance",
      "label": "Complete a pending Google ownership handoff"
    },
    {
      "slug": "google-calendar-print-date-range",
      "label": "Print Google Calendar"
    },
    {
      "slug": "outlook-subscribe-or-import-ics-calendar",
      "label": "Subscribe or import in Outlook"
    },
    {
      "slug": "outlook-print-calendar-styles",
      "label": "Print an Outlook calendar"
    }
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
    "recurring-events-without-the-mess",
    "change-calendar-color-iphone"
  ],
  "articleLinks": [
    {
      "slug": "icloud-calendar-invitation-sender-email",
      "label": "Invitation sender identity"
    },
    {
      "slug": "google-calendar-change-event-owner-before-handover",
      "label": "Hand a meeting to a new owner"
    }
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
    "share-assign-reminders-iphone-calendar-difference",
    "cozi-timetree-family-calendar-iphone-android",
    "planning-a-week-in-ten-minutes",
    "a-calendar-that-is-yours-to-share",
    "recurring-events-without-the-mess"
  ],
  "articleLinks": [
    {
      "slug": "google-calendar-birthdays-from-contacts",
      "label": "Find the source of a Google birthday"
    }
  ]
}
};
