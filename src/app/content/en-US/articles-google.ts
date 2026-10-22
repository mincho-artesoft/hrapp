import { LocalisedArticle } from '../types';

/**
 * The Google-shaped questions.
 *
 * These five sit beside who-can-see-what-in-google-calendar, which earns a
 * click for roughly one impression in nine — the best rate on the site by an
 * order of magnitude, because it answers a question somebody typed rather than
 * describing a product. Each of these is the same shape: a specific thing
 * Google does that surprises people, answered plainly, with the app mentioned
 * where it genuinely changes the answer and nowhere else.
 */
export const GOOGLE_EN_US: Readonly<Record<string, LocalisedArticle>> = {
  'why-a-shared-calendar-does-not-appear': {
    "updated": "2026-10-21",
    "title": "A calendar was shared with you and it is not there",
    "short": "Shared calendar not appearing",
    "description": "Find a missing shared Google calendar: check the invited account, group access, calendar visibility and the type of link you received.",
    "lede": "This guide is written by Arte Soft, the developer of Cloud Calendars. Start by separating an access problem from a calendar that is simply hidden.",
    "commonBelief": "That accepting a shared calendar puts it on your phone.",
    "sections": [
      {
        "heading": "Check the account and the group",
        "body": [
          "Compare the invitation’s recipient with the Google account signed in on your phone and in your browser. Open the calendar link in the invitation with the intended account. Google supports sharing with people and Google Groups. If access comes through a group, ask its manager to confirm your membership and ask the calendar owner to check that the correct group has access. A forwarded email alone does not establish that permission."
        ]
      },
      {
        "heading": "Hidden, missing or restricted?",
        "body": [
          "In Google Calendar on iPhone or iPad, open the menu and look for the calendar. If it is listed but unchecked, select it. If it is absent, ask the owner to verify access; requesting access is not the same as receiving it. Work or school policies may restrict sharing. Compare the same account in Google Calendar on the web. If it works there but not in another app, check that app’s connected account and calendar selection. Read-only access does not allow editing."
        ]
      },
      {
        "heading": "Identify the link before waiting",
        "body": [
          "An emailed sharing invitation also contains a link, so a link is not automatically an ICS subscription. Ask the sender whether it grants access to a Google calendar or publishes a read-only feed. Google says a new calendar subscription requires a computer browser; opening a calendar already shared by email is a separate action. A feed’s updates depend on the receiving service’s refresh behavior. There is no universal arrival time; confirm urgent changes with the organiser."
        ]
      }
    ],
    "claims": {},
    "faq": [
      {
        "q": "Can a Google Group receive calendar access?",
        "a": "Yes. Check the group selected by the owner, your membership and any organisation restrictions. Do not assume a forwarded group email grants access."
      },
      {
        "q": "Should I delete and reconnect the account?",
        "a": "First check identity, permissions and visibility, then compare the web calendar. Reconnecting cannot grant missing permission and should not be the first diagnostic step."
      }
    ],
    "practical": [
      "Confirm the invited account and any group membership.",
      "Select the calendar if it is listed but hidden.",
      "Ask the owner to verify access before changing connections."
    ],
    "sourcesHeading": "Sources and further reading",
    "sources": [
      {
        "label": "Google: Check the account and the group",
        "url": "https://support.google.com/calendar/answer/37082?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: Hidden, missing or restricted?",
        "url": "https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: Identify the link before waiting",
        "url": "https://support.google.com/calendar/answer/37648?hl=en"
      }
    ],
    "seeAlso": [
      "who-can-see-what-in-google-calendar",
      "google-calendars-that-never-reach-your-iphone"
    ]
  },

  'the-secret-address-of-a-google-calendar': {
  "title": "Google’s secret iCal address: subscribe without confusing it with sharing",
  "short": "The secret iCal address",
  "description": "Understand Google’s secret iCal address, account connections and shared feeds. Handle an exposed address without promising instant updates or erased copies.",
  "lede": "A calendar address, an account connection and an invitation do different jobs. Identify which one you have before using it to bring a schedule into another application. This guide is published by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "A secret calendar address is a personal invitation that can be withdrawn from just one recipient.",
  "sections": [
    {
      "heading": "Choose the connection for the job",
      "body": [
        "Google distinguishes signing in to another calendar application from viewing through a secret iCal address. The account route can support editing; the address provides a view-only subscription. Google describes the secret address as being for your own use and advises against sharing it with other people.",
        "For example, displaying your own work schedule in another compatible calendar is different from giving a colleague ongoing access. Start with the outcome: viewing your schedule, collaborating with a named person, or distributing an audience-facing timetable. Do not choose a URL merely because it is easy to paste."
      ]
    },
    {
      "heading": "Find the correct calendar, not just the correct account",
      "body": [
        "On a computer, Google’s instructions place “Secret address in iCal format” under the chosen calendar’s “Integrate calendar” settings. Check the calendar name first. Work or school administrators may restrict this option; an absent address is not a reason to publish the calendar instead.",
        "Keep the address out of screenshots, public support posts and shared notes. When requesting help, describe the account type, calendar name and connection method without supplying the URL. A support conversation normally needs to identify the route before it needs any event content."
      ]
    },
    {
      "heading": "Check what the receiving application actually added",
      "body": [
        "A subscription follows a feed; an imported file creates a separate copy. Read the receiving application’s instructions and confirm which action you are taking. If you simply open a downloaded calendar file, do not assume the resulting appointments will follow later changes.",
        "Check which app actually opens the link and which account its subscription setup shows. In Apple Calendar, Apple’s instructions select iCloud in Account and use the same Apple Account on the devices intended to show that subscription. After saving, look for the named calendar in the receiving app’s calendar list and select it for viewing. An opened link alone does not confirm that a subscription was saved or that Cloud Calendars can display it.",
        "Use an ordinary, non-sensitive event you already recognise to compare the calendar name, date and displayed details. Avoid creating a second subscription to diagnose the first: two visible copies can make a delayed update look like a conflicting appointment. Hide one calendar temporarily when identifying the source."
      ]
    },
    {
      "heading": "Keep Google and Cloud Calendars links separate",
      "body": [
        "Cloud Calendars has its own event and calendar sharing flows, including subscription feeds. Those are not Google secret addresses. Establish whether the sender shared one event, a calendar, or an account-based invitation before choosing how to open it. A Google secret iCal address belongs in a compatible app’s external-subscription flow; it is not a Cloud Calendars invitation link.",
        "A Cloud Calendars recipient can have a Reader, Writer or Owner role. A feed address alone should not be treated as proof of editing rights. Likewise, receiving a Google viewing address does not make you the owner of its calendar. Ask the sender which system should be used for changes."
      ]
    },
    {
      "heading": "Allow for the receiving calendar’s refresh behavior",
      "body": [
        "A subscription is not a promise of immediate delivery. Cloud Calendars feeds include a suggested refresh interval, but the receiving application decides when it retrieves and displays updates. An old time on one device does not by itself prove that the organiser failed to save the change.",
        "For a same-day meeting, compare with the organiser’s current schedule and confirm important changes directly. Record which calendar still shows the old information and when you checked it. Do not repeatedly import the event or delete the source calendar to force a feed to catch up."
      ]
    },
    {
      "heading": "Respond to exposure without promising a recall",
      "body": [
        "Google documents resetting a disclosed secret address, which invalidates the old address and creates a replacement. Identify your own applications that use it so you can update their subscriptions afterward. Resetting an address is a different action from removing a named collaborator.",
        "Previously saved appointments, exports or screenshots are a separate matter. A changed link cannot demonstrate that every earlier copy has disappeared. If you distributed information to the wrong audience, consider the actual material and recipients rather than treating a successful reset as proof of complete removal."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identify whether you have an account connection, invitation, subscription or file.",
    "Check the owning calendar before copying an address.",
    "Keep a Google secret address for your own compatible applications.",
    "Verify which app and account received the calendar, and that it subscribed rather than imported. Check the named calendar and a known event before adding anything again.",
    "Confirm urgent changes with the organiser instead of relying on refresh timing.",
    "If a secret address was exposed, follow Google’s reset guidance and update intended connections."
  ],
  "faq": [
    {
      "q": "Can I give the secret address to a colleague?",
      "a": "Google advises keeping it for your own applications. Use the calendar’s sharing controls when another person needs access, choosing the intended permission."
    },
    {
      "q": "Will a subscription let me edit the original?",
      "a": "A Google secret iCal address is a viewing route. Editing needs a suitable account connection and permission; Cloud Calendars sharing roles are a separate arrangement."
    },
    {
      "q": "Does resetting the address erase old appointments everywhere?",
      "a": "It invalidates the old Google address. It does not establish that independently saved files, appointments or screenshots have been removed."
    }
  ],
  "sourcesHeading": "Provider guidance and further reading",
  "sources": [
    {
      "label": "Google: account connections and secret iCal addresses",
      "url": "https://support.google.com/calendar/answer/37648?hl=en"
    },
    {
      "label": "Google: sharing a calendar",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft: importing versus subscribing and update timing",
      "url": "https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web"
    },
    {
      "label": "Apple: add calendar subscriptions in iCloud",
      "url": "https://support.apple.com/en-gb/102301"
    },
    {
      "label": "Apple: multiple calendars, subscriptions and display selection on iPhone",
      "url": "https://support.apple.com/guide/iphone/use-multiple-calendars-iph3d1110d4/ios"
    }
  ],
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "taking-back-a-calendar-you-shared",
    "sharing-one-event-not-your-calendar"
  ],
  "updated": "2026-10-22"
},

  'what-guests-can-do-to-your-event': {
  "title": "Google Calendar guest permissions: editing, invitations and the guest list",
  "short": "Guest permissions on an event",
  "description": "Check Google event guest permissions and defaults. Separate invitation rights from calendar access and Cloud Calendars Reader, Writer and Owner roles.",
  "lede": "A guest’s ability to reply does not describe everything they can do. Review the event’s permissions before using one invitation for a team, clients or a public gathering. This guide is published by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "Invited guests can only accept or decline, and every application exposes the same permission controls.",
  "sections": [
    {
      "heading": "Begin with the organiser and the original event",
      "body": [
        "Open the intended event in Google Calendar using the organising account, or an account authorised to manage it. Check its calendar, date and organiser before changing permissions. A separately imported appointment is not a reliable place to control the original invitation.",
        "For a team meeting, write down the intended arrangement: who may reschedule it, who may bring others, and whether participants should see one another. These are separate decisions. A guest who needs to attend does not necessarily need to manage the meeting."
      ]
    },
    {
      "heading": "Decide whether guests should modify the meeting",
      "body": [
        "Google documents a “Modify event” option under “Guests can” in its computer event editor. This is a broad collaboration permission, not merely a way to suggest a new time. Google explains that it enables event management including editing fields, viewing guests and booking rooms.",
        "For example, a trusted co-organiser arranging a workshop may need that flexibility. A customer attending an appointment may not. Choose based on the responsibility you are giving the guest, and verify the saved event rather than relying on how a different meeting was configured."
      ]
    },
    {
      "heading": "Review invitations and guest visibility separately",
      "body": [
        "Google’s event model distinguishes permission to invite others from permission to see other guests. Review both alongside editing access. Turning off one capability does not mean you have checked the other, and a displayed default is not evidence of the settings on an existing event.",
        "For a gathering of unrelated clients, consider whether one shared invitation is appropriate at all. Information already included in an email, description or forwarded message is outside the narrow question of the current guest-list control. Do not put confidential participant details in a description and expect a hidden list to conceal them."
      ]
    },
    {
      "heading": "Check defaults as well as important individual events",
      "body": [
        "Google also documents “Default guest permissions” in its Event settings, including a default for modification. The controls are therefore not exclusively an event-by-event matter. Review your defaults when your usual scheduling pattern changes, then check significant existing invitations individually.",
        "For a recurring meeting, confirm which occurrence or series you are editing before saving. Do not assume that changing a preference has rewritten older invitations. When testing an arrangement with a colleague, use an agreed, non-sensitive example instead of moving or cancelling a real customer meeting."
      ]
    },
    {
      "heading": "Keep Cloud Calendars roles distinct",
      "body": [
        "Cloud Calendars has a separate sharing arrangement with Reader, Writer and Owner roles. Reader provides viewing and syncing; Writer permits editing; Owner also manages sharing and access with the invited identity. These roles should not be presented as switches for Google’s three guest permissions.",
        "When a Google-specific permission matters, inspect the original event in Google Calendar. Seeing an attendee in Cloud Calendars does not establish that every Google guest setting can be changed there. Keep the owning service and the recipient’s identity clear when diagnosing a missing control or an unsuccessful edit."
      ]
    },
    {
      "heading": "Verify the saved outcome and communicate responsibility",
      "body": [
        "After saving, reopen the original event and check the intended settings. Where appropriate, ask an authorised colleague to confirm what their own account can do. Do not exchange passwords or send private guest details as a shortcut for checking access.",
        "Keep attendance separate from permissions. A person’s ability to edit, an imported copy, and a recorded acceptance are different facts. In Cloud Calendars, a sharing receipt is not an RSVP. For an important meeting, ask for the attendance response you need and make clear who is responsible for schedule changes."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identify the organising account and original event.",
    "Decide who should manage the meeting, invite others and see guests.",
    "Inspect the Google event’s actual guest permissions.",
    "Review Google defaults without assuming they change existing events.",
    "Treat Cloud Calendars sharing roles as a separate permission system.",
    "Reopen the saved event and confirm attendance separately."
  ],
  "faq": [
    {
      "q": "Can a guest change my meeting time?",
      "a": "Google supports granting modification permission. Check the actual event and the guest’s access; do not infer it from the fact that they received an invitation."
    },
    {
      "q": "Are all guest permissions configured only on each event?",
      "a": "No. Google documents default guest permissions as well. Check defaults for future scheduling and inspect important existing events themselves."
    },
    {
      "q": "Does hiding the guest list remove information already sent?",
      "a": "It does not demonstrate that earlier emails, descriptions, screenshots or independent copies were removed. Review what was actually distributed separately."
    }
  ],
  "sourcesHeading": "Provider guidance and further reading",
  "sources": [
    {
      "label": "Google: event collaboration and default guest permissions",
      "url": "https://support.google.com/a/users/answer/13293412?hl=en"
    },
    {
      "label": "Google: event guest permission fields",
      "url": "https://developers.google.com/workspace/calendar/api/v3/reference/events"
    }
  ],
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "sharing-one-event-not-your-calendar",
    "keeping-track-of-who-replied"
  ],
  "updated": "2026-10-21"
},

  'google-calendars-that-never-reach-your-iphone': {
  "title": "A Google calendar is missing on iPhone: check the connection and selection",
  "short": "Google calendars missing on iPhone",
  "description": "Find a missing Google calendar by checking account access, calendar visibility and the connection used by Apple Calendar or Cloud Calendars.",
  "lede": "When one Google calendar appears and another does not, first establish where the missing schedule is available. Account access, calendar selection and event availability are different checks. This guide is published by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "Every missing Google calendar has one hidden sync-list cause, and connecting directly guarantees that everything appears.",
  "sections": [
    {
      "heading": "Confirm that the calendar exists for this account",
      "body": [
        "Open Google Calendar on the web with the same account you intend to use on your phone. Look for the calendar itself, not just a familiar event title. Two accounts may have similarly named calendars, and an invitation addressed to your work email does not establish access for your personal account.",
        "If the calendar is absent there too, start with the owner or the sharing invitation. For a group-based arrangement, confirm membership and the group receiving permission. Do not delete the phone account while the underlying access question is still unresolved."
      ]
    },
    {
      "heading": "Distinguish a hidden calendar from an absent one",
      "body": [
        "In the Google Calendar app, Google documents using the menu to select calendars for display. A listed but unchecked calendar is a visibility problem. A calendar missing from the list needs a different investigation, such as the invited identity, approval or connection.",
        "An emailed calendar-sharing invitation and a subscription address are also different routes. Google describes adding a new subscription through a computer browser separately from opening a calendar already shared by email. Keep the original invitation available, but do not forward private links into public troubleshooting posts."
      ]
    },
    {
      "heading": "Identify how this iPhone application receives Google data",
      "body": [
        "Apple Calendar can connect through the Google account configured on the device. Google’s instructions include enabling Calendars for that account. Follow the current provider instructions for your iOS version; changing the settings of a separate application is not the same as changing this device account.",
        "Cloud Calendars also offers a direct Google sign-in path. Establish which account and route you are actually using before adding another connection. If the same schedule arrives by both a device calendar and a direct connection, compare the calendar identities before concluding that an event was duplicated at Google."
      ]
    },
    {
      "heading": "Check Cloud Calendars selection without assuming complete coverage",
      "body": [
        "In Cloud Calendars, review the calendars associated with the intended Google account and select the ones you want to use. Its Google synchronization checks calendar selection. A successful sign-in alone does not establish that every calendar has been selected or that every requested update completed.",
        "A direct connection is another way to receive Google data, not a promise that every accessible calendar appears. If a calendar is present on Google’s website but absent from Cloud Calendars, record the account, calendar name and connection method for support. Keep using the original provider for urgent scheduling while the discrepancy is investigated."
      ]
    },
    {
      "heading": "Separate a missing calendar from missing dates",
      "body": [
        "If the calendar is listed but a particular appointment is missing, compare that exact date in Google Calendar. Check whether the item belongs to the calendar you selected, and whether you are looking at the same occurrence of a recurring meeting. A similar title in another calendar is not the same source record.",
        "Do not assume that an application has downloaded all historical or distant future events. Cloud Calendars’ Google synchronization uses a bounded date request. An empty historical search therefore does not prove that the event was deleted from Google; verify the original provider before changing or recreating anything."
      ]
    },
    {
      "heading": "Escalate with a useful comparison, not a reset",
      "body": [
        "Write down the app, account type, calendar name, example date and where the schedule is visible. Include an error message if one appears, with private information removed. This separates permission, selection and synchronization issues far better than saying that the entire account is broken.",
        "For time-sensitive plans, confirm the current event with the organiser. Avoid deleting accounts, importing repeated copies or moving events between calendars as initial tests. Once the connection issue is understood, verify the result against the same example before changing any additional settings."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Compare the intended account and calendar in Google Calendar on the web.",
    "Check whether the calendar is absent or merely unselected.",
    "Identify device Google sync, direct app connection or subscription.",
    "Review the calendars selected for the intended account in Cloud Calendars.",
    "Compare one exact event date at the original provider.",
    "Report the discrepancy without sharing private addresses or resetting accounts."
  ],
  "faq": [
    {
      "q": "Will direct Google sign-in show every calendar?",
      "a": "Do not assume complete coverage. The account, calendar list, selection and successful synchronization all matter. Compare a missing calendar with Google Calendar on the web."
    },
    {
      "q": "Should I delete the account and add it again?",
      "a": "First check identity, access, visibility and the connection route. Reconnecting cannot supply a permission the owner has not granted."
    },
    {
      "q": "Does a missing old event mean it was deleted?",
      "a": "No. Check its original Google calendar and date. An application’s available date range or search behavior may differ from the provider’s stored history."
    }
  ],
  "sourcesHeading": "Provider guidance and further reading",
  "sources": [
    {
      "label": "Google: adding Google events to Apple Calendar",
      "url": "https://support.google.com/calendar/answer/99358?hl=en&co=GENIE.Platform%3DiOS"
    },
    {
      "label": "Google: subscriptions and calendar visibility",
      "url": "https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform%3DiOS"
    },
    {
      "label": "Google: calendar-list behavior",
      "url": "https://developers.google.com/workspace/calendar/api/v3/reference/calendarList/list"
    }
  ],
  "seeAlso": [
    "why-a-shared-calendar-does-not-appear",
    "icloud-google-and-outlook-in-one-view",
    "what-calendar-sync-actually-does"
  ],
  "updated": "2026-10-21"
},

  'taking-back-a-calendar-you-shared': {
  "title": "Stop sharing a calendar: remove access and check the remaining routes",
  "short": "Review and remove shared access",
  "description": "Stop calendar sharing without confusing people, groups, public access and feed links. Check what changed and understand why saved copies may remain.",
  "lede": "Ending a collaboration starts with identifying how access was granted. Removing a person, disabling publication and resetting a feed address are different actions. This guide is published by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "Removing one recipient instantly recalls every calendar copy and closes every other route to the schedule.",
  "sections": [
    {
      "heading": "Identify the calendar and the sharing route",
      "body": [
        "Confirm the owning account, calendar and intended audience before changing access. A Google calendar shared with a named colleague is a different relationship from a public calendar, a group grant or a subscription address. Cloud Calendars also has its own event and calendar sharing relationships.",
        "For example, a club secretary may receive editing rights through a named invitation while members follow a published schedule. Removing the secretary’s named grant does not describe what should happen to the members’ subscriptions. Make a list of the arrangements you actually created."
      ]
    },
    {
      "heading": "Remove the intended Google grant",
      "body": [
        "Google documents separate controls for named people or groups, organisation-wide sharing and public availability. On a computer, open the intended calendar’s sharing settings and change the relevant entry or broader setting. Check the signed-in account and calendar name first.",
        "A person may still have another access route, such as a group or broader publication. Review the whole arrangement instead of repeating removal of one email address. Work or school policies may limit the available controls; use the owner or administrator’s approved process when necessary."
      ]
    },
    {
      "heading": "Treat a secret calendar address separately",
      "body": [
        "Google says its secret iCal address is for your own use in another calendar application and should not be given to other people. If it was disclosed, Google documents resetting it to invalidate the old address. That is a different action from removing a named person.",
        "Before changing a subscription address you use yourself, identify the calendar clients or tools that depend on it so you can reconnect the intended ones afterward. Do not paste the secret URL into a public support post or send it as evidence that you found the correct calendar. Refer to the calendar name and the type of connection instead."
      ]
    },
    {
      "heading": "Distinguish Cloud Calendars recipients from feed links",
      "body": [
        "In Cloud Calendars, event or calendar recipient access and an issued subscription feed are distinct mechanisms. Review the actual event or calendar sharing relationship and the relevant link before choosing an action. Removing an identified recipient is not a blanket promise that every previously distributed URL or independent copy has been recalled.",
        "If a co-organizer only needs to stop editing, consider the intended role and remaining audience instead of deleting the shared schedule. If the whole collaboration is ending, establish who owns the calendar and who should retain it. Leaving a received calendar and deleting a calendar you own are different decisions."
      ]
    },
    {
      "heading": "Verify the result without promising immediate disappearance",
      "body": [
        "Check that the intended change is saved in the owning system. If an authorised colleague can help, confirm the relevant viewing or editing result from their own account without sharing passwords. Distinguish an access denial from an old event still visible in a cached or imported copy.",
        "Do not promise a universal refresh interval or that no notification will be sent. For a group handover, communicate which schedule should be used from now on. A visible old record does not by itself identify whether the person retains live access, has another grant or kept a standalone copy."
      ]
    },
    {
      "heading": "Handle previous copies as a separate follow-up",
      "body": [
        "Previously exported files, screenshots, messages and independently saved appointments may remain after access changes. Decide which copies matter for the handover and discuss their handling with the people involved. Changing a calendar permission cannot establish what every recipient has already saved.",
        "Keep necessary source records while reviewing the outcome. Do not move sensitive meetings into another shared calendar simply to make the old one look empty, or cancel real invitations as an access test. Record the calendar, route and change you made so later troubleshooting has a clear starting point."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identify the owning account, calendar and sharing route.",
    "Review named people, groups and broader publication separately.",
    "Use the appropriate Google or Cloud Calendars sharing controls.",
    "Handle a disclosed secret feed address as a separate reset decision.",
    "Verify the saved access result without sharing credentials.",
    "Plan for previous exports or copies separately from live access."
  ],
  "faq": [
    {
      "q": "Does removing one person disable a public calendar or their group access?",
      "a": "Do not assume so. Review each actual route. Google documents named recipients, groups and broader publication as separate settings."
    },
    {
      "q": "Will the calendar disappear immediately and silently?",
      "a": "There is no universal promise here about disappearance, notification or refresh timing. Confirm the saved access change and distinguish live access from cached or imported information."
    },
    {
      "q": "Does Advanced buy the ability to remove Google calendar access?",
      "a": "Advanced removes ads in Cloud Calendars. Google sharing controls depend on ownership, permissions and organisation rules, rather than that app plan."
    }
  ],
  "sourcesHeading": "Provider access and subscription guidance",
  "sources": [
    {
      "label": "Google: sharing controls and stopping access",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Google: account synchronization and secret iCal addresses",
      "url": "https://support.google.com/calendar/answer/37648?hl=en"
    }
  ],
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "the-secret-address-of-a-google-calendar",
    "a-calendar-that-is-yours-to-share"
  ],
  "updated": "2026-10-21"
},
};
