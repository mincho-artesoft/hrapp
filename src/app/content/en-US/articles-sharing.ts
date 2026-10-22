import { LocalisedArticle } from '../types';

/** Source-backed sharing guides: app access, previews, provider invitations and feeds are distinct flows. */
export const SHARING_EN_US: Readonly<Record<string, LocalisedArticle>> = {
  "calendar-event-or-room-reservation": {
  "updated": "2026-10-22",
  "title": "Calendar event or room reservation? Check what is confirmed",
  "short": "Confirm a room reservation",
  "description": "A room name is not a reservation. Check Google Calendar or Outlook resource responses, recurring dates and changes before relying on a meeting room.",
  "lede": "A meeting can appear in your calendar while its room is unavailable or has declined. Check the resource booking separately from the appointment and its location label. Arte Soft, the developer of Cloud Calendars, publishes this guide; it does not establish a room-booking workflow inside Cloud Calendars.",
  "commonBelief": "Saving an event with a room name, or seeing an empty time slot, confirms that the room is reserved.",
  "sections": [
    {
      "heading": "Identify the resource, not just its address",
      "body": [
        "A location tells people where you intend to meet. A bookable room or projector also has an owner and a reservation process. Ask which room directory or booking system your organization uses before treating a typed name as a request. A personal calendar entry cannot establish another person’s approval.",
        "Write down the intended date, start, end and exact room identity. For example, a workshop may need an earlier setup period as well as its advertised start. Confirm that requirement with the room owner; adding a preparation block to your calendar alone does not reserve the space."
      ]
    },
    {
      "heading": "Use the Google Calendar room workflow for the right account",
      "body": [
        "Google documents its organizational Rooms workflow for work or school accounts. In the computer event editor, use Add rooms or Add room booking, choose the intended resource and save. A personal Gmail account follows a different shared-space arrangement; do not assume it has your employer’s room directory.",
        "Then inspect the room’s response for that event. Google says a room can decline at booking or later. Its notification behavior also differs for secondary calendars, so the absence of a decline email is not proof of acceptance. Check the actual room status rather than only the event title."
      ]
    },
    {
      "heading": "Treat an Outlook room as a resource recipient",
      "body": [
        "Microsoft documents Room Finder and Scheduling Assistant for supported Microsoft 365 or Exchange accounts. The organization configures the room directory. In its documented workflow, selecting a room adds it as a meeting recipient, and the organizer sends the meeting request. The Outlook mobile instructions use Browse conference rooms; menus differ by platform.",
        "Microsoft’s resource-mailbox guidance distinguishes availability from processing a request; booking can be automatic or managed by the organization. Confirm the outcome through the approved resource workflow. An editable location field, a free-looking slot or a successfully saved personal event is not that confirmation."
      ]
    },
    {
      "heading": "Recheck the resource after moving a meeting",
      "body": [
        "A room that worked at the original time may be occupied at the new one. Google explicitly says changing the event time releases the booked room and attempts to rebook it; that attempt can fail. Before telling participants the revised location is settled, inspect the resource status for the new date and time.",
        "For a recurring workshop, inspect the relevant occurrences rather than assuming one acceptance settles the entire course. Booking windows, conflicts and permissions can limit what is confirmed. If one week needs another room, record the specific occurrence and use the provider’s supported editing scope; keep the organizer and participants informed."
      ]
    },
    {
      "heading": "Use Cloud Calendars for the planning information it exposes",
      "body": [
        "Cloud Calendars provides event location entry and a combined calendar view. Those features help you organize the appointment, but this guide does not establish a resource picker or reservation-confirmation controls in the app. Use the owning provider or room manager’s approved workflow when that confirmation is required.",
        "Do not use a Cloud Calendars subscription tier, a conferencing link or a visible gap as evidence that you have room-booking permission. After a provider change, compare the intended appointment in the app and the source calendar. That comparison checks the displayed plan; retain the separate resource confirmation."
      ]
    },
    {
      "heading": "Cancel or replace the resource deliberately",
      "body": [
        "Microsoft documents removing the room or equipment from the meeting as the way to release that reservation. Follow the organizer’s supported provider workflow and check which occurrence or series is affected. Deleting a personal copy or erasing a location label is not a substitute for confirming that the actual resource request was cancelled. Complete any update or cancellation step the provider requires; an unsaved edit is not a cancelled reservation.",
        "If the room declines or the result is unclear, contact the organizer or resource manager with the relevant date and room identity. Agree a confirmed alternative before sending a final location. Share only the information needed for that request, and keep private calendar links and unrelated appointments out of public support posts."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identify the exact room or equipment and its approved booking system.",
    "Confirm the account and permission needed to request it.",
    "Use the provider’s resource workflow rather than only typing a location.",
    "Inspect the resource response for the intended date or recurring occurrence.",
    "Recheck after changing the time, duration or room.",
    "Release or replace the resource through the organizer’s supported workflow."
  ],
  "faq": [
    {
      "q": "Does adding a room name to an event reserve it?",
      "a": "No. A location label describes the plan. Use the room owner’s supported booking process and check its response for the required time."
    },
    {
      "q": "Does Cloud Calendars confirm meeting room reservations?",
      "a": "This guide establishes event location entry, not a room-selection and reservation-confirmation workflow inside Cloud Calendars. Check the owning provider or resource manager when you need that confirmation."
    },
    {
      "q": "Is a room still reserved after I change the meeting time?",
      "a": "Do not assume that. Google documents releasing and attempting to rebook the room after a time change. Check the result through your provider, including the affected recurring dates, before relying on the new arrangement."
    }
  ],
  "sourcesHeading": "Official room and resource booking guidance",
  "sources": [
    {
      "label": "Google: add or remove a room for a work or school event",
      "url": "https://support.google.com/calendar/answer/143753?hl=en"
    },
    {
      "label": "Google: declined rooms, notifications and changes",
      "url": "https://support.google.com/calendar/answer/16107253?hl=en"
    },
    {
      "label": "Microsoft: Scheduling Assistant and Room Finder across platforms",
      "url": "https://support.microsoft.com/en-us/outlook/use-the-scheduling-assistant-and-room-finder-for-meetings-in-outlook"
    },
    {
      "label": "Microsoft: room and equipment availability, booking and cancellation",
      "url": "https://learn.microsoft.com/en-us/microsoft-365/admin/manage/room-equipment-mailboxes-faq?view=o365-worldwide"
    }
  ],
  "seeAlso": [
    "recurring-events-without-the-mess",
    "a-week-view-that-fits-a-week",
    "what-calendar-sync-actually-does",
    "meeting-links-that-make-themselves",
    "time-zones-and-the-flight-you-booked"
  ]
},

  'sharing-one-event-not-your-calendar': {
  "updated": "2026-10-21",
  "title": "Share one calendar event: choose the link and access you mean",
  "short": "Sharing one event",
  "description": "Share one event without sharing a whole calendar. Understand Reader, Writer and Owner access, preview links, updates and the limits of revocation.",
  "lede": "Sharing dinner details, inviting a co-organizer to edit and collecting attendance answers are different tasks. Start with the one you need, then choose the sharing route. This guide is written by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "Every event link is a read-only calendar subscription that updates immediately and records a reply.",
  "sections": [
    {
      "heading": "Start with one event and inspect its details",
      "body": [
        "A single-event share is scoped to that event rather than the sender’s entire calendar. Before sending it, review the title, time zone, location, notes and any meeting URL. Information useful to one guest may not belong in a link you intend to circulate widely.",
        "For example, sharing a dinner event does not require sharing the calendar containing your medical appointments. However, the dinner’s own location and links still travel with the event. Check the event itself rather than relying on the privacy of the calendar around it."
      ]
    },
    {
      "heading": "Choose a preview, an email invitation or a QR route",
      "body": [
        "Cloud Calendars offers distinct sharing routes. Its App Clip presents an event preview; the full app is needed to add the event through that experience. Email and QR invitations use a web landing page that offers to open Cloud Calendars. Do not describe all these links as interchangeable subscription URLs.",
        "The sender signs in for the app’s synchronized sharing flow. A link or QR code can be forwarded, so send it only where its contents are appropriate. A QR code is a way to convey a link, not proof of who opened it."
      ]
    },
    {
      "heading": "Assign only the access the recipient needs",
      "body": [
        "Email invitations let you choose Reader, Writer or Owner. Reader can view and sync; Writer can edit; Owner can also share and manage access. These are consequential choices, not three names for viewing the same invitation. Use Reader when someone only needs the schedule.",
        "Choose Writer for a co-organizer who should change the event. Choose Owner only when that person should also manage other people’s access. The recipient needs the appropriate signed-in identity to receive elevated access. An anonymous recipient is not an identified co-owner."
      ]
    },
    {
      "heading": "Understand how the recipient adds it",
      "body": [
        "In the full app, adding a shared event needs calendar permission and a writable destination calendar. The recipient should check that destination before saving. A received copy can then be associated with the shared event for later updates.",
        "This differs from importing an ordinary ICS file into another calendar. An import is a copy, while a subscription periodically checks a feed. If you are sending an ICS feed rather than an app invitation, explain that route explicitly and confirm the recipient’s calendar supports it."
      ]
    },
    {
      "heading": "Verify changes before relying on them",
      "body": [
        "A synchronized share can carry later edits or cancellation, but the recipient’s device needs an opportunity to receive them. A feed refresh hint is not a delivery deadline. An offline device, an unrefreshed subscription or a standalone imported copy can still show older information.",
        "If dinner moves shortly before the start, update the event and contact the guests directly. Ask them to confirm the new time. Sending an update and receiving an attendance answer are separate steps."
      ]
    },
    {
      "heading": "Manage access without promising to erase copies",
      "body": [
        "Review the event’s recipient access and remove permissions that are no longer needed. Removing a recipient and revoking a feed link are distinct operations; neither should be described as remotely erasing screenshots, messages or every calendar copy.",
        "If a link has circulated beyond its intended audience, identify which link or access grant is involved. Confirm the affected route after changing access. For future events, keep private details out of broadly distributed links rather than relying on later revocation to recover them."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Review the event details and decide whether you need viewing, editing or attendance replies.",
    "Choose the intended sharing route and sign in when required.",
    "Use Reader for viewers; grant Writer or Owner only for the corresponding responsibility.",
    "Ask the recipient to check the event time and destination calendar when adding it.",
    "For urgent changes, update the event and send a direct message.",
    "Review recipient permissions and link access separately when sharing ends."
  ],
  "faq": [
    {
      "q": "Does sharing one event expose my whole calendar?",
      "a": "The synchronized single-event route is scoped to the event. It still exposes the shared event’s own details through the chosen route. Review those details and avoid sending a whole-calendar invitation when you intend to send only one event."
    },
    {
      "q": "Can the recipient change the event?",
      "a": "Yes, if they have the appropriate Writer or Owner access and use the supported signed-in flow. Reader access is for viewing and syncing. An ordinary ICS subscription is not the same editing mechanism."
    },
    {
      "q": "Does removing someone undo everything they have already received?",
      "a": "No such guarantee should be assumed. Access changes affect the supported sharing relationship, but previously saved copies, screenshots and messages may remain. A shared feed URL also needs separate consideration."
    }
  ],
  "sourcesHeading": "References for recipient options",
  "sources": [
    {
      "label": "Apple: overview of App Clips",
      "url": "https://developer.apple.com/help/app-store-connect/offer-app-clip-experiences/overview-of-app-clips/"
    },
    {
      "label": "Google: importing events and its limitations",
      "url": "https://support.google.com/calendar/answer/37118?co=GENIE.Platform%3DDesktop&hl=en"
    },
    {
      "label": "Microsoft: importing versus subscribing to a calendar",
      "url": "https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web"
    }
  ],
  "seeAlso": [
    "inviting-people-who-do-not-have-the-app",
    "a-calendar-that-is-yours-to-share",
    "keeping-track-of-who-replied"
  ]
},

  'inviting-people-who-do-not-have-the-app': {
  "updated": "2026-10-21",
  "title": "Sharing an event with someone who does not have Cloud Calendars",
  "short": "Sharing without the app",
  "description": "Understand event previews, App Clips, full-app imports and ICS subscriptions before sending an invitation to someone who does not use Cloud Calendars.",
  "lede": "Someone may only need to read the time and place, while another person needs an updating calendar entry or editing access. Those needs lead to different recipient experiences. This guide is written by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "Any invitation link can instantly add an updating event on every phone without an app, account or permission.",
  "sections": [
    {
      "heading": "Ask what the recipient needs to do",
      "body": [
        "A preview, a saved calendar entry, a subscription and permission to edit are different results. Tell the recipient what you are sending and what you expect them to do. A short explanation is more useful than promising that every calendar will handle the same link identically.",
        "For a friend checking a venue, a preview may be enough. For a co-organizer changing the time, a preview is insufficient. For a guest whose attendance matters, ask for an explicit reply rather than assuming that opening the link confirms attendance."
      ]
    },
    {
      "heading": "Know what the App Clip actually offers",
      "body": [
        "On a supported iPhone, an App Clip can provide a small experience without downloading the full app. Cloud Calendars uses its event App Clip as a preview. Its action points to downloading Cloud Calendars to add the event to a calendar.",
        "That distinction matters when choosing your wording: “preview the event” is accurate; “add it with no installation” is not a promise this flow supports. Availability also depends on the device and how the link is opened, so do not promise an immediate App Clip launch on every platform."
      ]
    },
    {
      "heading": "Explain email and QR links separately",
      "body": [
        "Cloud Calendars email and QR event invitations open a web preview route with an option to open the full app. They are not simply another way of invoking the App Clip. A calendar invitation has its own preview and opens the app to add the shared calendar.",
        "If someone cannot continue, first identify what opened: a browser preview, the App Clip or the full app. Then check what action they want to complete. Repeatedly sending the same link will not change a device’s available app or permissions."
      ]
    },
    {
      "heading": "Adding an event has additional requirements",
      "body": [
        "The full-app event import needs calendar access and an available writable calendar. The recipient chooses where the copy belongs. Some event reception can be recorded anonymously; that does not grant the identified Writer or Owner role assigned to an email address.",
        "For an email invitation with editing access, use the intended account identity. Whole-calendar acceptance requires a signed-in account with a verified email identity. Do not apply the single-event preview’s low-friction behavior to every sharing operation."
      ]
    },
    {
      "heading": "Use the right instructions for ICS",
      "body": [
        "A genuine ICS file or calendar feed is different from a Cloud Calendars invitation page. Outlook distinguishes importing a file from subscribing to a URL: importing creates a copy; subscribing can receive later updates on the client’s schedule. Do not paste an arbitrary invitation page into a subscription field and expect it to behave as a feed.",
        "Google also documents limitations for imported events, including lack of continued synchronization and omitted guest or conference data. If the recipient chooses a provider import route, check the time, location and call link afterward. Do not promise that all invitation features survive the conversion."
      ]
    },
    {
      "heading": "Choose a practical fallback",
      "body": [
        "If the recipient only needs the details, include the date, time zone, place and an explicit way to reply in your message. If they need a normal provider meeting invitation, use the organizer’s approved calendar invitation workflow. Keep that distinct from sharing an app preview.",
        "For later changes, update the source and notify the person through a channel they use. A recipient who chose a standalone copy may need to update it manually. Check the outcome with one person before circulating a schedule to a larger group."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Ask whether the recipient needs a preview, a saved event, updates or editing access.",
    "Name the route you are sending instead of calling every URL a subscription.",
    "Explain that the Cloud Calendars App Clip previews and the full app adds the event.",
    "For elevated email access, check the intended sign-in identity.",
    "If using ICS, distinguish a one-time import from a supported feed subscription.",
    "Include a direct reply method and communicate urgent changes separately."
  ],
  "faq": [
    {
      "q": "Can someone without Cloud Calendars see the event?",
      "a": "A supported App Clip or web invitation preview can show details without the full app. That does not mean the preview adds the event, grants editing access or works identically on every device."
    },
    {
      "q": "Is every Cloud Calendars link an ICS subscription?",
      "a": "No. App Clip links, email or QR landing pages, app deep links and ICS feed URLs serve different purposes. Use a feed only where a calendar application asks for a subscription URL."
    },
    {
      "q": "Can I promise that an imported file will stay updated?",
      "a": "No. A file import is a copy. A subscription can refresh, but its timing depends on the receiving client. Check which action the recipient actually completed."
    }
  ],
  "sourcesHeading": "Recipient platform references",
  "sources": [
    {
      "label": "Apple: overview of App Clips",
      "url": "https://developer.apple.com/help/app-store-connect/offer-app-clip-experiences/overview-of-app-clips/"
    },
    {
      "label": "Google: importing events and its limitations",
      "url": "https://support.google.com/calendar/answer/37118?co=GENIE.Platform%3DDesktop&hl=en"
    },
    {
      "label": "Microsoft: importing versus subscribing to a calendar",
      "url": "https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web"
    }
  ],
  "seeAlso": [
    "sharing-one-event-not-your-calendar",
    "a-calendar-that-is-yours-to-share"
  ]
},

  'a-calendar-that-is-yours-to-share': {
  "updated": "2026-10-21",
  "title": "Share a calendar with the right people and permissions",
  "short": "A calendar you can share",
  "description": "Choose a separate calendar, distinguish app sharing from provider sharing, and assign Reader, Writer or Owner access without promising instant updates.",
  "lede": "A rehearsal schedule or household calendar needs a clear owner and a clear audience. Decide who should read it, who should change events and who should manage access before inviting anyone. This guide is written by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "Sharing a calendar always creates a read-only subscription tied to an existing provider account.",
  "sections": [
    {
      "heading": "Choose a calendar with a clear purpose",
      "body": [
        "A separate calendar makes the intended audience easier to understand. Put rehearsals in the rehearsal calendar and keep unrelated appointments elsewhere. Before sharing an existing calendar, inspect its events and the details inside them rather than relying only on its name.",
        "For example, a club secretary may manage fixtures while members only read them. A household may instead need two people to edit. Neither arrangement requires sharing every calendar visible in the organizer’s app."
      ]
    },
    {
      "heading": "Identify which sharing system you are using",
      "body": [
        "Cloud Calendars supports its own shared-calendar relationships, including app-local calendars and supported calendars accessed through the iPhone calendar system. It also has a separate Google calendar sharing route. These should not be described as one universal subscription mechanism.",
        "An app-local calendar is not automatically a calendar in a Google or iCloud account. Conversely, a provider calendar’s sharing rules belong to that provider. Check the actual calendar and sharing screen before deciding what another person will receive or where it will appear."
      ]
    },
    {
      "heading": "Give viewers and editors different roles",
      "body": [
        "For Cloud Calendars sharing, Reader can view, Writer can edit events, and Owner can also share the calendar and manage access. Give club members Reader access if they only need fixtures. Give a co-organizer Writer access if they should adjust the schedule.",
        "Owner is broader than editing. Assign it when someone should also decide who else can use the calendar. Google uses its own permission levels; do not assume an app sharing role and a Google permission have identical names or effects."
      ]
    },
    {
      "heading": "Help the recipient accept the calendar",
      "body": [
        "A calendar invitation can arrive through email or a shared link or QR route. The preview is not the completed acceptance. In Cloud Calendars, the recipient signs in and adds the calendar to “Shared with me”; the backend requires a verified email identity for this flow.",
        "If a specific email was invited, confirm that the recipient is using the corresponding identity. Someone opening a link with a different account may not receive the role you intended. Check the displayed calendar and access rather than treating successful page loading as successful collaboration."
      ]
    },
    {
      "heading": "Check one change before publishing a whole schedule",
      "body": [
        "Start with a harmless sample event that the group understands is a test. Ask a Reader to confirm visibility and, if needed, ask an authorized Writer to change that sample. Check the result on the owner’s side before relying on the arrangement for important events.",
        "Updates need a working connection and refresh. An app share is not the same as an ICS subscription, and neither justifies a universal instant-update promise. For a late cancellation or a changed venue, update the calendar and contact the affected people directly."
      ]
    },
    {
      "heading": "Review access when the group changes",
      "body": [
        "When a co-organizer leaves, review their role and remove access that is no longer needed. Removing yourself from a received calendar and deleting a calendar you own are different actions. Read the confirmation and identify the owner before proceeding.",
        "Revocation is not a guarantee that old screenshots, exported data or independent copies disappear. Keep a record of the sharing route you used and verify the relevant access after a change. This is especially useful when the same people also receive provider invitations or separate event links."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Choose a calendar dedicated to the group and review its existing contents.",
    "Identify app-local, device-provider or Google sharing before inviting people.",
    "Choose Reader, Writer or Owner according to each person’s responsibility.",
    "Have recipients accept with the intended signed-in identity.",
    "Check a sample event and an authorized sample edit before relying on updates.",
    "Review access when membership changes and distinguish leaving from deleting."
  ],
  "faq": [
    {
      "q": "Can other people edit a shared calendar?",
      "a": "Yes, the app’s Writer and Owner roles support event editing. Reader is the viewing role. Provider calendars have their own permission rules, so inspect the actual sharing route."
    },
    {
      "q": "Must a new shared calendar be tied to my Google or iCloud account?",
      "a": "Do not assume that. Cloud Calendars also has app-local calendars with its own sharing system. Identify where the calendar belongs before expecting it to appear in another provider’s app."
    },
    {
      "q": "Does opening the invitation mean the person has joined?",
      "a": "No. A preview is not acceptance. The app’s whole-calendar flow needs sign-in and acceptance, and the invited identity affects the role granted. Check the resulting shared calendar and recipient access."
    }
  ],
  "sourcesHeading": "Provider permission reference",
  "sources": [
    {
      "label": "Google: calendar sharing permissions",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft: importing versus subscribing to a calendar",
      "url": "https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web"
    }
  ],
  "seeAlso": [
    "sharing-one-event-not-your-calendar",
    "inviting-people-who-do-not-have-the-app",
    "keeping-track-of-who-replied",
    "what-a-subscription-actually-buys"
  ]
},

  'who-can-see-what-in-google-calendar': {
  "title": "Google Calendar sharing permissions: check the access you actually grant",
  "short": "Google Calendar access and privacy",
  "description": "Choose Google Calendar access for availability, details or editing. Check public and group access as well as individual permissions before sharing.",
  "lede": "Before sharing a calendar, decide what the other person needs to do. Scheduling around you, reading event details and maintaining the calendar are different tasks. This guide is published by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "Giving one person a restricted setting guarantees they cannot see details through any other route.",
  "sections": [
    {
      "heading": "Match the access to the task",
      "body": [
        "A colleague arranging a time may need availability without appointment details. A collaborator maintaining a project schedule needs a different arrangement. Decide the task first, then inspect the permission shown in the calendar’s current sharing settings.",
        "Google distinguishes availability, event details and several editing levels. One editing option limits access to private events; another permits event editing and details, while the strongest also permits sharing administration. Do not treat every option containing the word changes as equivalent."
      ]
    },
    {
      "heading": "Inspect calendar-wide access as well as one person",
      "body": [
        "Check whether the calendar is public, available to your organisation, or shared through a group, in addition to named individuals. Google says broader calendar access can override a narrower grant: restricting one person does not undo details already made public.",
        "For example, consider a club schedule published for members. Before placing a personal appointment on it, check the calendar’s audience rather than assuming that the permission beside one friend is the only relevant setting. Keep private appointments in an appropriate destination."
      ]
    },
    {
      "heading": "Use Google’s settings for the exact calendar",
      "body": [
        "In Google Calendar on a computer, find the intended calendar under your calendars, open its menu and go to its sharing settings. Google documents separate areas for people or groups and broader access. Check the calendar name and signed-in account before making a change.",
        "Confirm the recipient’s intended Google identity when inviting them. If they cannot find the calendar, verify that address and the invitation message rather than granting broader access to make it appear. A missing display and insufficient editing permission are different problems."
      ]
    },
    {
      "heading": "Test the intended result without private appointments",
      "body": [
        "Use an ordinary test appointment that contains no private title, notes, location or guest list. Ask the intended recipient to confirm what they can see and, only when editing is required and permitted, what they can change. Do not distribute your account credentials to perform this check.",
        "Record the calendar and granted role, then review the result after changing the setting. This verifies the arrangement you intended; it does not prove that information previously read or copied has disappeared. Avoid testing by publishing a real work schedule."
      ]
    },
    {
      "heading": "Keep work policies and app plans separate",
      "body": [
        "Google states that work or school administrators may restrict sharing controls. When the required setting is unavailable, use the organisation’s approved route. Do not publish work information as a workaround for an account restriction.",
        "Cloud Calendars can display connected calendars, but its plan names do not redefine Google permissions. Advanced removes ads; it is not a payment that grants another person access to every Google event. Check the provider’s sharing arrangement and verify the accepted result instead of relying only on an available local editor."
      ]
    },
    {
      "heading": "Review and remove the access you no longer need",
      "body": [
        "When a project ends, review the actual recipients, groups and any broader publication. Removing one named person is only one part of the check when other access routes exist. Agree who maintains the schedule and how future access changes will be handled.",
        "Google documents removing people or groups and disabling broader sharing separately. Removing access cannot recall an exported file, screenshot or information already copied elsewhere. Treat those as a separate follow-up with the people involved, rather than promising that one switch erases every previous copy."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identify the calendar and the recipient’s intended task.",
    "Inspect individual, group, organisation and public access.",
    "Choose the permission for that task using current Google settings.",
    "Verify the recipient identity before changing access.",
    "Check a harmless test event from the recipient’s side.",
    "Review obsolete access routes without assuming previous copies are recalled."
  ],
  "faq": [
    {
      "q": "Does a restricted individual grant override a public calendar?",
      "a": "No. Google documents that broader calendar permissions take priority when access settings conflict. Review public and organisation settings as well as the person’s entry."
    },
    {
      "q": "Do all editing permissions expose private events in the same way?",
      "a": "No. Google documents an editing option that limits private-event access separately from other editing and sharing-management options. Read the exact current permission before choosing it."
    },
    {
      "q": "Does buying Advanced change Google sharing rights?",
      "a": "No. Advanced removes ads in Cloud Calendars. Provider access depends on the calendar’s permissions and any organisation restrictions."
    }
  ],
  "sourcesHeading": "Current Google permission and sharing guidance",
  "sources": [
    {
      "label": "Google: choose calendar permissions",
      "url": "https://support.google.com/calendar/answer/15716974?hl=en"
    },
    {
      "label": "Google: share a calendar and remove access",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    }
  ],
  "seeAlso": [
    "a-calendar-that-is-yours-to-share",
    "why-a-shared-calendar-does-not-appear",
    "work-and-personal-without-two-apps"
  ],
  "updated": "2026-10-21"
},

  'keeping-track-of-who-replied': {
  "updated": "2026-10-22",
  "title": "Calendar replies: separate attendance from sharing access",
  "short": "Who replied and who has access",
  "description": "Distinguish guest RSVPs from pending invitations, anonymous recipients and shared-calendar acceptance. Confirm attendance without inventing a headcount.",
  "lede": "A person can open a link, add an event or accept calendar access without promising to attend. Decide which answer you need before interpreting a recipient list. This guide is written by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "Everyone recorded as a recipient or accepted share is a confirmed attendee, and silence can be converted into a reliable estimate.",
  "sections": [
    {
      "heading": "Identify the kind of invitation",
      "body": [
        "A provider meeting invitation asks a guest for an attendance response. A Cloud Calendars share gives someone access to event details or a calendar, possibly with editing rights. An ICS subscription follows information. These actions can concern the same meeting without recording the same decision.",
        "For example, a volunteer may accept Writer access to update an event but not attend it. A guest may read the details in a web preview and then reply by message. Neither case should be counted solely from an access-management screen."
      ]
    },
    {
      "heading": "Read sharing recipients as access information",
      "body": [
        "Cloud Calendars recipient information distinguishes pending email invitations, identified recipients, anonymous recipients and access roles. A pending invitation may offer a resend action. Reader, Writer and Owner describe what the recipient can do with shared information.",
        "The sharing system records acceptance or receipt during its add/access flows. That record is useful for understanding the sharing relationship, but it is not a Yes/Maybe/No attendance answer. Anonymous reception also does not identify a named guest for your headcount."
      ]
    },
    {
      "heading": "Check attendance in the organizer’s invitation workflow",
      "body": [
        "For a Google meeting invitation, Google documents explicit Yes, No and Maybe responses. Apple Calendar likewise distinguishes Accept, Maybe and Decline for supported invitations. Use the organizer’s corresponding event and account when checking those replies.",
        "If a reply looks wrong or missing, confirm the invited email and the event version with the person. An imported copy, a forwarded link or an event in another account may not represent the original invitation. Do not assume that every third-party display has the latest response."
      ]
    },
    {
      "heading": "Propose another time without treating it as agreed",
      "body": [
        "If you cannot attend, first identify the original invitation and the account that was invited. Moving a personal copy changes your own planning record; it does not ask the organiser to reschedule. A time proposal is also different from editing the original event with permission. Choose the action that matches your responsibility for the meeting.",
        "In the Google Calendar app on iPhone or iPad, open the invitation, use the additional action beside Maybe and choose Propose a new time. Select the alternative and send the proposal. Google excludes all-day events and events with more than 200 guests from this workflow. In its computer guidance, the organiser reviews a suggested time and saves the event to accept the change; sending a proposal alone does not establish that the meeting moved.",
        "Apple Calendar on iPhone has its own Propose New Time action for received meetings. Apple explains that the calendar server determines whether the organiser receives a counter-proposal or an email suggestion. Follow the application and account you actually use. These Apple and Google controls are not a claim that Cloud Calendars exposes the same proposal actions.",
        "For example, you cannot attend Tuesday at 15:00 and suggest Wednesday at 10:00. Treat Wednesday as proposed until the organiser confirms and the original event reflects the intended arrangement. Recheck the date, time zone and relevant attendance responses. If the proposal control is unavailable, contact the organiser rather than moving a lookalike event or requesting broader editing rights just to suggest a time.",
        "Keep the explanation appropriate for its audience. Google says a note added with an attendance response is visible to all guests; do not put a confidential reason there. Apple describes different visibility for response comments, subject to calendar support. Do not carry one application’s privacy expectation into another, or assume a proposal message and an attendance note have identical visibility."
      ]
    },
    {
      "heading": "Keep unknown attendance unknown",
      "body": [
        "A pending share, no response or an unread message is not a reliable acceptance or refusal. Record the people who explicitly confirmed, those who declined and those whose answer is still unknown. Do not add a fixed fraction of silent recipients to the confirmed total.",
        "For a meal with a booking deadline, state the date by which you need a reply and ask the remaining people directly. The appropriate follow-up depends on the event; there is no universal rule that one reminder two days before is enough."
      ]
    },
    {
      "heading": "Treat meeting links as joining details",
      "body": [
        "A Google Meet or Microsoft Teams URL tells someone where to join, not whether they accepted or will attend. Cloud Calendars lists Google Meet with Base features and Microsoft Teams with Premium, subject to the relevant account and provider flow. A higher plan is not a more reliable attendance count.",
        "Check that the intended link exists on the event and works for the intended audience. File imports and other conversions can lose conference information. If you change the meeting arrangement, tell participants which event and link to use instead of interpreting their old access record as confirmation."
      ]
    },
    {
      "heading": "Close the loop after an important change",
      "body": [
        "When an event moves substantially, update it through its owning calendar or sharing flow. Then tell the people whose attendance matters and ask for renewed confirmation where needed. A previous response to Tuesday is not necessarily an answer to Thursday.",
        "Keep the final attendance list separate from the access list. Removing editing rights does not cancel a guest’s attendance, and declining shared access does not necessarily decline the underlying gathering. Use clear messages so people know which decision you are asking them to make."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identify whether you sent a provider meeting invitation, an app share or a feed.",
    "Use the sharing list to check access and pending invitations, not attendance totals.",
    "Check provider RSVP status on the organizer’s actual event where applicable.",
    "When suggesting another time, use the original provider invitation and distinguish sending a proposal from the organiser accepting and saving it. Check who can see any response note.",
    "Keep unknown replies separate from confirmed and declined guests.",
    "Ask for a direct answer by a deadline appropriate to your event.",
    "After a major change, confirm the new arrangement and joining link with affected guests."
  ],
  "faq": [
    {
      "q": "Does accepted calendar access mean the person is coming?",
      "a": "No. It means a sharing relationship was accepted through that flow. Attendance needs a provider RSVP or an explicit answer from the person."
    },
    {
      "q": "Can I count anonymous recipients as confirmed guests?",
      "a": "No. Anonymous reception is not an identified attendance commitment. It may help describe use of a shared event, but it cannot supply a reliable named guest list."
    },
    {
      "q": "Do I need Premium to know who replied?",
      "a": "Do not equate an app tier with RSVP reliability. Premium adds Microsoft Calendar and Teams features; access receipts and provider attendance responses remain different kinds of information. Check the original invitation and organizer account."
    },
    {
      "q": "Does proposing a new time move the meeting for everyone?",
      "a": "Not by itself. Google describes an organiser review and save step; Apple says server capabilities determine whether the suggestion arrives as a counter-proposal or email. Verify the original event and the organiser’s confirmation rather than treating your suggested time as agreed."
    }
  ],
  "sourcesHeading": "Attendance and import references",
  "sources": [
    {
      "label": "Google: responding to event invitations",
      "url": "https://support.google.com/calendar/answer/37135?hl=en"
    },
    {
      "label": "Apple: reply to Calendar invitations on iPhone",
      "url": "https://support.apple.com/en-ph/guide/iphone/iphc0eddfe3c/ios"
    },
    {
      "label": "Google: importing events and its limitations",
      "url": "https://support.google.com/calendar/answer/37118?co=GENIE.Platform%3DDesktop&hl=en"
    },
    {
      "label": "Google: responding and proposing a time on iPhone and iPad",
      "url": "https://support.google.com/calendar/answer/37135?co=GENIE.Platform%3DiOS&hl=en-MP"
    },
    {
      "label": "Google: organiser review of proposed meeting times",
      "url": "https://support.google.com/a/users/answer/9283119?hl=en"
    },
    {
      "label": "Apple: reply and suggest a meeting time on iPhone",
      "url": "https://support.apple.com/en-gu/guide/iphone/iphc0eddfe3c/ios"
    }
  ],
  "seeAlso": [
    "sharing-one-event-not-your-calendar",
    "inviting-people-who-do-not-have-the-app",
    "meeting-links-that-make-themselves"
  ]
},

  'meeting-links-that-make-themselves': {
  "updated": "2026-10-21",
  "title": "Google Meet and Microsoft Teams links: create, save and check",
  "short": "Meeting links that work",
  "description": "See which calendars can create Meet or Teams links, how the plans differ and what to check when a saved event has no working joining link.",
  "lede": "A call link is useful only when it belongs to the intended meeting and the guests can use it. Cloud Calendars can request provider meeting links, but a request is not a guarantee that a usable link has arrived. This guide is written by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "Every saved event automatically gets a working call link, and Google Meet requires an upgraded app plan.",
  "sections": [
    {
      "heading": "Match the event to the meeting provider",
      "body": [
        "Google Meet creation belongs to a connected Google calendar event; Microsoft Teams creation belongs to a connected Microsoft calendar event. An app-local event or a calendar visible through a different route is not automatically eligible just because you also signed in to that provider.",
        "Start by checking the event’s calendar and account. For a work call, use the calendar and conferencing service your organization permits. Do not move an existing invitation merely to make a different meeting option appear."
      ]
    },
    {
      "heading": "Separate app plans from account capability",
      "body": [
        "Google Calendar and Google Meet are listed with Cloud Calendars Base features. Advanced adds ad removal. Premium adds Microsoft Calendar and Microsoft Teams features. Review the local purchase offer if you need Premium; paying does not grant new rights on a calendar owned by someone else.",
        "Microsoft also requires the calendar to support the intended online meeting provider. An app subscription cannot make every personal or workplace account eligible for Teams meeting creation. Account permissions, organization settings and the saved event remain part of the result."
      ]
    },
    {
      "heading": "Use the available action on an editable event",
      "body": [
        "For eligible events without a detected link, the app can offer “Add to Google Meet” or “Add to Microsoft Teams.” The option depends on the event’s provider connection and editability. If the event already contains a recognized link, the corresponding add action may not appear.",
        "Some provider event-creation paths also request a meeting link while saving. Treat either path as a request to the provider. A local event that has not yet acquired its provider identity is not equivalent to an existing provider meeting that can be updated."
      ]
    },
    {
      "heading": "Check the saved result rather than the button press",
      "body": [
        "Reopen the event after synchronization and look for the actual joining link. Compare it with the same event in Google Calendar or Outlook. Google documents conference creation as potentially pending, successful or failed; saving an event does not by itself prove conference creation has finished.",
        "For example, if tomorrow’s client call has a time and title but no joining URL, do not send “the link is in the invitation” yet. Confirm that the provider event has the meeting information, then check the copy the guests will use."
      ]
    },
    {
      "heading": "Diagnose a missing link without duplicating the meeting",
      "body": [
        "Check the intended account, calendar, edit permission and network first. If the action is absent, the event may be read-only, linked through another route or already contain a recognized meeting link. If a request was made but no link appears, compare the provider event before repeatedly creating replacement events.",
        "Use the provider’s approved workflow if you need to complete the meeting there. Keep one clear event for the participants and communicate the final joining details. Do not assume a new app plan fixes an expired connection, unavailable conferencing service or rejected provider request."
      ]
    },
    {
      "heading": "Recheck after moving, importing or rescheduling",
      "body": [
        "A copied or imported event is not guaranteed to preserve conferencing information. Google explicitly documents that conference data is not included when importing events. After a calendar move or file import, inspect the resulting event instead of assuming the old link followed it correctly.",
        "For a recurring meeting, verify which occurrence or series you are changing and whether the displayed link is the one participants should use. A joining link is also not an RSVP: check attendance separately and tell guests directly about important changes."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identify the owning account and calendar before requesting a meeting link.",
    "Use the appropriate available action on an editable provider event.",
    "Confirm that the saved provider event contains an actual joining URL.",
    "Check the event copy or invitation that participants will receive.",
    "Investigate missing links before creating duplicate meetings.",
    "Recheck the link after imports, calendar moves or important series changes."
  ],
  "faq": [
    {
      "q": "Do I need Advanced to create a Google Meet link?",
      "a": "Google Meet is listed with Base features, alongside Google Calendar. Advanced adds ad removal. Meeting creation still depends on an eligible connected event and a successful provider request."
    },
    {
      "q": "Does Premium guarantee a Teams link for every calendar?",
      "a": "No. Premium adds the app’s Microsoft features, but the Microsoft account and calendar must support the online meeting provider and allow the operation. Check that a usable joining link was returned."
    },
    {
      "q": "Why is the event saved but the link missing?",
      "a": "Event saving and conference creation are not the same outcome. A conference request can still be pending or fail. Check the owning provider event, account and permissions before making a duplicate."
    }
  ],
  "sourcesHeading": "Meeting provider references",
  "sources": [
    {
      "label": "Google: conference creation status on calendar events",
      "url": "https://developers.google.com/workspace/calendar/api/v3/reference/events"
    },
    {
      "label": "Microsoft: online meetings and supported calendar providers",
      "url": "https://learn.microsoft.com/en-us/graph/outlook-calendar-online-meetings"
    },
    {
      "label": "Google: event import limitations",
      "url": "https://support.google.com/calendar/answer/37118?co=GENIE.Platform%3DDesktop&hl=en"
    }
  ],
  "seeAlso": [
  "exchange-calendars-on-an-iphone",
  "keeping-track-of-who-replied",
  "icloud-google-and-outlook-in-one-view",
  "calendar-event-or-room-reservation"
]
},
};
