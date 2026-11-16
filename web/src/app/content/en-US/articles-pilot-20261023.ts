import type { LocalisedArticle } from '../types';
export const PILOT_EN_US: Readonly<Record<string, LocalisedArticle>> = {
  "mac-calendar-siri-suggestions-confirm-ignore": {
    "updated": "2026-10-23",
    "title": "A booking appeared in Siri Suggestions on Mac: confirm it or ignore it",
    "short": "Review suggested calendar events",
    "description": "Review Siri’s suggested booking in Mac Calendar before adding it to a real calendar. Ignore one suggestion without disabling and deleting all unconfirmed ones.",
    "lede": "A flight or restaurant booking found in Mail can appear as a suggested event before you confirm it into another calendar. Check its source and details before creating a duplicate. Ignoring one suggestion is a narrower action than disabling the Siri Suggestions calendar.",
    "sections": [
      {
        "heading": "Find the suggestion and the actual booking",
        "body": [
          "Apple says recognized details from known providers can appear in the Siri Suggestions calendar, in the Other section of Mac Calendar’s list. Examples include flights, restaurant reservations and car rentals. A suggested entry is not evidence that you intentionally created a separate event in your personal calendar.",
          "For a fictional dinner booking, compare the confirmation message with the suggestion’s date, time and venue. Also check whether you already saved an appointment manually. Keep the confirmation available while deciding which calendar record should represent the plan."
        ]
      },
      {
        "heading": "Confirm into the intended calendar",
        "body": [
          "Apple documents opening the suggestion at its proposed date or finding it in the Calendar notifications list. In the Info window, Add to Calendar uses the default calendar. The calendar menu in the upper-right corner lets you choose another destination; the notifications list also offers a destination choice by holding Add to Calendar.",
          "Choose the actual personal or shared destination you intend. A suggestion for a private booking should not be added to a broadly shared schedule merely because that schedule is currently the default. Reopen the saved event to check its destination and details."
        ]
      },
      {
        "heading": "Ignore one suggestion or disable the feature deliberately",
        "body": [
          "To remove a suggested event, Apple documents Ignore. Use that narrow operation when this specific suggestion is unwanted. It does not establish that the underlying booking was cancelled or that its email was removed.",
          "To turn the feature off on the Mac, Apple documents System Settings > Siri > Siri Suggestions & Privacy, then Calendar and Show Siri Suggestions in application. Importantly, turning it off deletes unconfirmed suggestions and hides the Siri Suggestions calendar. Do not treat that as a harmless visibility-only experiment when you still want to review pending suggestions."
        ]
      },
      {
        "heading": "Check for duplicate records without deleting a reservation",
        "body": [
          "For the dinner example, mark each item as a source confirmation, an unconfirmed suggestion or an owned calendar event. If a duplicate-looking entry remains, identify its calendar before removing anything. A reservation email and a calendar record are different objects.",
          "This is Apple’s Mac workflow, not a claim that Cloud Calendars parses Mail or displays a Siri Suggestions inbox. Use the owning app’s controls and preserve the actual booking while correcting the planning view."
        ]
      }
    ],
    "comparison": {
      "heading": "Fictional dinner-booking record check",
      "columns": [
        "Item",
        "What it represents",
        "Appropriate next decision"
      ],
      "rows": [
        {
          "cells": [
            "Confirmation message",
            "Provider’s booking details",
            "Use it to verify date and venue"
          ]
        },
        {
          "cells": [
            "Siri Suggestions entry",
            "Unconfirmed suggested event",
            "Add to intended calendar or Ignore"
          ]
        },
        {
          "cells": [
            "Owned calendar appointment",
            "Your saved planning record",
            "Check destination and duplicate identity"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Compare the source confirmation and any manually saved event.",
      "Locate the Siri Suggestions entry.",
      "Add it to the intended calendar or Ignore that suggestion.",
      "Understand the deletion of unconfirmed suggestions before disabling the feature."
    ],
    "faq": [
      {
        "q": "Does Ignore cancel my restaurant booking?",
        "a": "The documented action removes a calendar suggestion. Confirm reservation changes through the booking provider."
      },
      {
        "q": "Does turning off Siri Suggestions only hide its calendar?",
        "a": "Apple says it also deletes unconfirmed suggestions. Review anything you still need first."
      }
    ],
    "sourcesHeading": "Apple documentation checked for this workflow",
    "sources": [
      {
        "label": "Apple: review and remove Siri event suggestions on Mac",
        "url": "https://support.apple.com/guide/calendar/use-siri-suggestions-iclc121e66ee/mac"
      }
    ],
    "articleLinks": [
      {
        "slug": "natural-language-calendar-events-iphone",
        "label": "Distinguish suggestions from parsing and copying"
      },
      {
        "slug": "event-saved-to-wrong-calendar",
        "label": "Verify the chosen destination"
      },
      {
        "slug": "when-two-calendars-disagree",
        "label": "Identify separate records before cleanup"
      }
    ],
    "seeAlso": [
      "natural-language-calendar-events-iphone",
      "event-saved-to-wrong-calendar",
      "when-two-calendars-disagree"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here.",
    "galleryAfterContent": true
  },
  "mac-calendar-subscription-icloud-on-my-mac": {
    "updated": "2026-10-23",
    "title": "A calendar subscription is only on your Mac: check its Location",
    "short": "Choose where a subscription lives",
    "description": "Choose iCloud or On My Mac for a Calendar subscription. Check device availability separately from feed refresh and editing rights.",
    "lede": "A subscription saved On My Mac is a local subscription setup, not an instruction to put it on your other devices. Apple’s subscription Location menu determines whether the setup belongs to iCloud or the computer. Check that choice before subscribing again on every screen.",
    "sections": [
      {
        "heading": "Describe the device requirement",
        "body": [
          "Imagine a fictional school publishes a read-only term schedule. You want it on a Mac and another device configured for the same iCloud account. That is a subscription-location task. It is not a request to make the school’s events editable or to copy them into your personal calendar.",
          "Check the existing subscription’s name and source before adding another. A similarly named import, a manually added phone subscription and an iCloud subscription can be separate arrangements. Record what is already present so the comparison does not create an extra display route."
        ]
      },
      {
        "heading": "Choose Location during subscription setup",
        "body": [
          "In Calendar on Mac, Apple documents File > New Calendar Subscription. Enter the published calendar address, click Subscribe, then choose a name and color. In Location, iCloud makes the calendar available on computers and devices set up with iCloud; On My Mac saves it on the computer.",
          "Review the other controls separately: Remove checkboxes concern attachments or alerts, Auto-refresh concerns updates, and Ignore alerts concerns notifications. None of those replaces Location. Click OK to complete the documented setup."
        ]
      },
      {
        "heading": "Inspect an existing setup before rebuilding it",
        "body": [
          "Apple says you can later select the subscription and use Edit > Get Info to change its settings. Inspect the offered Location and the intended iCloud account before deciding whether anything must be recreated. If a needed account is unavailable, resolve that account setup rather than distributing private credentials.",
          "Check the other device using the intended Apple Account and iCloud Calendar arrangement. Confirm a distinctive school event in the full calendar and the actual calendar list. A Mac screenshot alone does not establish that the other device received the subscription setup."
        ]
      },
      {
        "heading": "Verify without turning a feed into a migration",
        "body": [
          "For the fictional school schedule, record subscription location, source name, the expected event and each device’s observation. If one device remains missing, investigate that device’s account and selection rather than importing the term’s events as a workaround.",
          "The publisher still controls subscribed events; Apple says subscribers cannot edit the subscription calendar. This guide concerns Apple’s setup and does not promise that Cloud Calendars displays every subscription on every version. Compare device availability, feed updates and editing permission as three separate outcomes."
        ]
      }
    ],
    "comparison": {
      "heading": "Three independent subscription questions",
      "columns": [
        "Question",
        "Relevant control or owner",
        "Evidence to check"
      ],
      "rows": [
        {
          "cells": [
            "Which devices should have the setup?",
            "Location:iCloud or On My Mac",
            "Same account and subscription on target device"
          ]
        },
        {
          "cells": [
            "How does the feed get checked?",
            "Auto-refresh",
            "Known changed source event"
          ]
        },
        {
          "cells": [
            "Who can change the school events?",
            "Publisher",
            "Subscription remains read-only"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Find the existing subscription before adding another.",
      "Inspect Location in the Mac subscription settings.",
      "Choose iCloud when that matches the intended iCloud devices.",
      "Verify one distinctive event on each device without importing duplicates."
    ],
    "faq": [
      {
        "q": "Does On My Mac mean the subscription is in iCloud?",
        "a": "No. Apple describes it as saved on the computer. iCloud is the separate Location choice."
      },
      {
        "q": "Does moving the subscription setup to iCloud make its events editable?",
        "a": "No. The subscribed events remain controlled by their publisher."
      }
    ],
    "sourcesHeading": "Apple documentation checked for this workflow",
    "sources": [
      {
        "label": "Apple: subscribe to calendars and choose subscription location",
        "url": "https://support.apple.com/guide/calendar/share-calendars-icl32362/mac"
      }
    ],
    "articleLinks": [
      {
        "slug": "what-calendar-sync-actually-does",
        "label": "Distinguish local and provider sources"
      },
      {
        "slug": "caldav-calendar-on-iphone",
        "label": "Check device calendars on an iPhone"
      },
      {
        "slug": "calendar-export-ics-pdf-and-backup",
        "label": "Avoid mistaking a feed for an import"
      }
    ],
    "seeAlso": [
      "what-calendar-sync-actually-does",
      "caldav-calendar-on-iphone",
      "calendar-export-ics-pdf-and-backup"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here.",
    "galleryAfterContent": true
  },
  "google-calendar-keyboard-shortcuts-workflow": {
    "updated": "2026-10-23",
    "title": "A Google Calendar keyboard workflow: navigate, create, verify and return",
    "short": "A Google Calendar keyboard workflow",
    "description": "Use documented Google Calendar keyboard shortcuts for a checked desktop workflow, without confusing focus, saving and destructive actions.",
    "lede": "A useful keyboard routine ends with the intended saved event, not just fewer keystrokes. Enable Google Calendar’s desktop shortcuts, practice with a disposable appointment and check where focus is before using a single-letter command. Keep editing and deletion out of an unverified navigation sequence.",
    "sections": [
      {
        "heading": "Enable shortcuts before testing a routine",
        "body": [
          "On a computer, open Google Calendar settings, select “Enable keyboard shortcuts” and click Save at the bottom of the page. After enabling it, type a question mark (?) to open Google’s in-app reference. Use that reference for the current interface rather than assuming a remembered key works in every browser context.",
          "For a fictional equipment check, write the intended date, start/end times and destination calendar first. Those are acceptance criteria for the routine. Faster navigation cannot establish that the calendar, participant or recurrence fields are correct."
        ]
      },
      {
        "heading": "Use a small, reversible command set",
        "body": [
          "Google documents g for a specific date, w or 2 for week view, c to create an event, and Escape to return from details to the grid. Its event-save command is Command-S on Mac or Control-S on Windows from event details. Use the reference rather than guessing a key while a text field or another page has focus.",
          "Start with navigation and a sample title. In a typed field, a character may be input rather than the command you intended. Pause whenever the visible result differs from the expected view. Do not compensate by typing a longer series of remembered keys into an unknown focus state."
        ]
      },
      {
        "heading": "Run the equipment-check rehearsal",
        "body": [
          "Navigate to the agreed date, open a new event, and enter the harmless equipment-check details. Inspect the actual fields before saving: month/day, time, calendar, title and absence of unintended guests. Reopen the record and compare it with the written criteria.",
          "Record any point where you needed a pointer or a different control. That is a practical routine to improve, not a failed speed benchmark. The workflow is a suggestion for your own rehearsal; no keyboard performance or accessibility test was conducted for this article."
        ]
      },
      {
        "heading": "Keep destructive shortcuts outside the first rehearsal",
        "body": [
          "Google’s reference also includes delete and undo actions. Learn their scope only after verifying which event is selected and what a confirmation means, especially for a recurring meeting. Do not use a real shared invitation as a shortcut experiment.",
          "When confident, extend one step at a time and retain the saved-event check. Natural-language parsing, dictation and keyboard navigation are different tools. These Google commands are not a shortcut contract for Cloud Calendars, another application or a mobile browser."
        ]
      }
    ],
    "comparison": {
      "heading": "The rehearsal’s acceptance criteria",
      "columns": [
        "Stage",
        "Expected observation",
        "Stop when"
      ],
      "rows": [
        {
          "cells": [
            "Navigate",
            "Correct named date and view",
            "The visible date differs"
          ]
        },
        {
          "cells": [
            "Create",
            "New harmless event with intended fields",
            "Unexpected guests or destination appear"
          ]
        },
        {
          "cells": [
            "Save and reopen",
            "Record matches the written brief",
            "Only a page transition is confirmed"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Enable shortcuts and open Google’s current in-app reference.",
      "Write a disposable event’s intended fields.",
      "Practice a short navigation/create/save routine with visible checks.",
      "Reopen the result before adding more commands or using important events."
    ],
    "faq": [
      {
        "q": "Is pressing the save shortcut proof the event is correct?",
        "a": "No. Reopen the record and compare its actual fields with the intended appointment."
      },
      {
        "q": "Are the same keys valid in every calendar app?",
        "a": "No. This guide uses Google Calendar’s documented computer reference. Check the application and focus you actually have."
      }
    ],
    "sourcesHeading": "Official Google documentation checked",
    "sources": [
      {
        "label": "Google Calendar Help: Use keyboard shortcuts in Google Calendar",
        "url": "https://support.google.com/calendar/answer/37034?hl=en"
      }
    ],
    "articleLinks": [
      {
        "slug": "natural-language-calendar-events-iphone",
        "label": "Distinguish parsing from keyboard entry"
      },
      {
        "slug": "event-saved-to-wrong-calendar",
        "label": "Verify the destination calendar"
      },
      {
        "slug": "recurring-events-without-the-mess",
        "label": "Check edit scope before changing a series"
      }
    ],
    "seeAlso": [
      "natural-language-calendar-events-iphone",
      "event-saved-to-wrong-calendar",
      "recurring-events-without-the-mess"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "mac-calendar-subscription-auto-refresh": {
    "updated": "2026-10-23",
    "title": "A subscribed calendar is stale on Mac: check Auto-refresh before importing again",
    "short": "Refresh a subscribed calendar",
    "description": "Check a Mac calendar subscription’s Auto-refresh setting and source before adding duplicate imports. Separate subscription refresh from account Push.",
    "lede": "A club fixture can be correct at its source while your Mac still shows yesterday’s venue. First establish that you subscribed to the right source, then inspect that subscription’s refresh setting. Importing the same file again is a different operation.",
    "sections": [
      {
        "heading": "Identify the subscribed calendar, not a similar imported copy",
        "body": [
          "In Calendar on Mac, identify the calendar name and its subscription indicator. Apple distinguishes subscriptions from calendars you publish or share. A fixture displayed in an imported calendar is not proof that the Mac has an updating subscription to its original source.",
          "For a fictional club, compare one fixture whose venue changed from North Hall to South Hall. Record its date, the current venue at the authorized source and the venue on the Mac. Keep the original calendar while checking; do not create a second schedule just to trigger another download."
        ]
      },
      {
        "heading": "Use the refresh control for that route",
        "body": [
          "Apple documents View > Refresh Calendars for a manual refresh. To choose an automatic cadence for a subscription, Control-click its name, choose Get Info, then use Auto-refresh. Select the option appropriate to how you follow that schedule.",
          "The Accounts panel has a separate Refresh Calendars menu for shared calendars in an account, with Push when supported. That is not the same setting as a subscription’s Auto-refresh menu. Configure the route you actually use rather than changing an unrelated account."
        ]
      },
      {
        "heading": "Compare a known change after the check",
        "body": [
          "Revisit the same fictional fixture after refreshing. If the source itself still says North Hall, the Mac cannot infer that the club meant South Hall. Ask the publisher to correct its schedule. If the source is updated but the subscribed copy differs, retain both observations and the time checked.",
          "Apple says a warning symbol can indicate inability to connect; check connectivity and whether the calendar was moved or deleted. Get Info also identifies its web address. Keep private subscription addresses out of public support posts."
        ]
      },
      {
        "heading": "Keep the update chain and urgent communication separate",
        "body": [
          "Choosing a refresh option does not promise every receiving service updates instantly. A publisher, intermediary feed and receiving client can be separate stages. For a near-term venue change, confirm with the club through the agreed channel while investigating the subscription.",
          "These are Mac Calendar controls, not Cloud Calendars refresh settings. A useful personal overview does not certify the freshness of each upstream feed. If the next task is an iPhone display problem, first confirm the same source and connection there."
        ]
      }
    ],
    "comparison": {
      "heading": "Trace the fictional fixture",
      "columns": [
        "Observation",
        "Narrow next check",
        "Avoid"
      ],
      "rows": [
        {
          "cells": [
            "Source still shows old venue",
            "Ask publisher about its saved record",
            "Repeatedly refreshing the receiver"
          ]
        },
        {
          "cells": [
            "Source changed; subscribed Mac entry old",
            "Get Info > Auto-refresh; manual refresh; connection",
            "Importing another copy"
          ]
        },
        {
          "cells": [
            "Account-backed shared calendar old",
            "Account Refresh Calendars setting",
            "Treating it as the same subscription menu"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Identify the subscription and one known changed fixture.",
      "Use View > Refresh Calendars and inspect its Auto-refresh menu.",
      "Check the source and warning state before changing connections.",
      "Record the same event after the check; confirm urgent changes directly."
    ],
    "faq": [
      {
        "q": "Does importing the ICS again refresh a subscription?",
        "a": "No. Import and subscription are different operations. Identify the existing route first."
      },
      {
        "q": "Is account Push the subscription refresh switch?",
        "a": "No. Apple documents account refresh and subscription Auto-refresh separately."
      }
    ],
    "sourcesHeading": "Apple documentation checked for this workflow",
    "sources": [
      {
        "label": "Apple: refresh calendars on Mac",
        "url": "https://support.apple.com/guide/calendar/refresh-calendars-icl1024/mac"
      },
      {
        "label": "Apple: subscribe to calendars and choose subscription location",
        "url": "https://support.apple.com/guide/calendar/share-calendars-icl32362/mac"
      }
    ],
    "articleLinks": [
      {
        "slug": "what-calendar-sync-actually-does",
        "label": "Identify the actual connection"
      },
      {
        "slug": "calendar-export-ics-pdf-and-backup",
        "label": "Separate imports from subscriptions"
      },
      {
        "slug": "when-two-calendars-disagree",
        "label": "Compare the same source event"
      }
    ],
    "seeAlso": [
      "what-calendar-sync-actually-does",
      "calendar-export-ics-pdf-and-backup",
      "when-two-calendars-disagree"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here.",
    "galleryAfterContent": true
  },
  "outlook-subscribe-or-import-ics-calendar": {
    "updated": "2026-10-23",
    "title": "Add an internet calendar to Outlook: subscribe for updates or import a snapshot",
    "short": "Subscribe or import in Outlook",
    "description": "Add a school, sports or team calendar to Outlook.com or Outlook on the web. Choose subscribe or import, and expect updates to take hours, sometimes over a day.",
    "lede": "A link to a school or club calendar can be added to Outlook in two ways, and only one keeps up with changes. Even that one is not instant. Arte Soft, the developer of Cloud Calendars, explains what Microsoft documents for Outlook.com and Outlook on the web.",
    "commonBelief": "A subscribed calendar updates as soon as the publisher changes it.",
    "sections": [
      {
        "heading": "Snapshot or connection",
        "body": [
          "Microsoft explains that importing an .ics file gives you a snapshot of the events at the time of import; your calendar doesn’t refresh them even if the owner updates the calendar. It suggests import for things that won’t change, like tide tables or moon phases.",
          "Subscribing connects the online calendar to yours, and Outlook updates it when the owner changes events. Microsoft suggests subscribing for things that change, like a school calendar."
        ]
      },
      {
        "heading": "How long updates take",
        "body": [
          "Microsoft gives different figures for the two web clients. For Outlook.com (personal accounts), it says updates should happen approximately every 3 hours but can take more than 24 hours. For Outlook on the web (work or school), it says approximately every 6 hours, and also more than 24 hours at times.",
          "Treat these as Microsoft’s typical figures, not deadlines. For a same-day change, check the publisher’s site or ask the organiser."
        ]
      },
      {
        "heading": "Steps",
        "body": [
          "In Calendar, choose Add calendar. To subscribe, choose Subscribe from web, enter the URL and select Import (Outlook.com) or Import and Save (Outlook on the web). To import, choose Upload from file, pick the .ics file, choose which calendar it goes into, and select Import; Microsoft’s work/school instructions also show Save.",
          "Microsoft suggests that if subscribing fails, you can import instead — accepting that you lose updates. Its instructions for classic Outlook on the web also mention removing an empty internet calendar and re-adding its URL with https rather than http. That is a legacy web-client troubleshooting note, not a desktop Outlook command; use the publisher’s valid HTTPS feed address rather than inventing an address."
        ]
      },
      {
        "heading": "Worked example: a school term calendar",
        "body": [
          "A fictional parent receives two things from a school: a link ending in .ics for the term calendar, and a one-off .ics file for sports day. They add the link with Subscribe from web so term changes arrive, and upload the sports-day file into their own Family calendar.",
          "When the school moves an inset day on a Monday morning, the parent’s Outlook still shows the old date at lunchtime. Such a delay is consistent with Microsoft’s figures; they check the school website and adjust plans. The imported sports-day entry does not follow subsequent changes from the school.",
          "Check: the subscribed calendar appears as its own calendar in the list; the imported event sits inside Family."
        ]
      }
    ],
    "comparison": {
      "heading": "Subscribe or import",
      "columns": [
        "",
        "Subscribe from web",
        "Upload from file (import)"
      ],
      "rows": [
        {
          "cells": [
            "Gets later changes",
            "Yes",
            "No"
          ]
        },
        {
          "cells": [
            "Typical refresh (Microsoft)",
            "Outlook.com ~3 h; Outlook on the web ~6 h; can exceed 24 h",
            "Never"
          ]
        },
        {
          "cells": [
            "Where events go",
            "A separate subscribed calendar",
            "A calendar you choose"
          ]
        },
        {
          "cells": [
            "Best for",
            "Calendars that change",
            "Fixed dates"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Use Subscribe from web for a link to a changing calendar.",
      "Use Upload from file for a fixed set of dates.",
      "Expect hours, sometimes more than a day, before changes appear.",
      "If a subscription is empty, verify the publisher’s current feed address and whether HTTPS is supported before changing or reconnecting it.",
      "Confirm urgent changes at the source."
    ],
    "faq": [
      {
        "q": "My subscribed calendar is a day behind. Is it broken?",
        "a": "Not necessarily. Microsoft says updates can take more than 24 hours."
      },
      {
        "q": "I imported a calendar and nothing updates.",
        "a": "That is how import works: Microsoft calls it a snapshot. If you need later updates, subscribe to the publisher’s current feed and verify it first. Only then identify and deliberately remove any unwanted imported copies; do not delete unrelated events from the destination calendar."
      }
    ],
    "sourcesHeading": "Microsoft Support pages used",
    "sources": [
      {
        "label": "Microsoft: import or subscribe to a calendar in Outlook.com or Outlook on the web",
        "url": "https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web"
      },
      {
        "label": "Microsoft: share your calendar in Outlook on the web (opening internet calendars)",
        "url": "https://support.microsoft.com/en-us/outlook/share-your-calendar-in-outlook-on-the-web"
      }
    ],
    "seeAlso": [
      "the-secret-address-of-a-google-calendar",
      "calendar-export-ics-pdf-and-backup",
      "what-calendar-sync-actually-does"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "mac-calendar-holidays-different-region": {
    "updated": "2026-10-23",
    "title": "Add another country’s holidays on Mac without duplicating your own events",
    "short": "Show another region’s holidays",
    "description": "Add a different-region Holidays calendar in Mac Calendar. Separate regional display, read-only holidays and your own booked time off.",
    "lede": "Your Mac’s default holiday calendar follows its region, but a trip or international team may need another region’s dates too. Add the relevant Holidays subscription instead of entering each holiday as a personal meeting. Then keep the reference dates separate from your own leave arrangements.",
    "sections": [
      {
        "heading": "Identify which regional reference is missing",
        "body": [
          "A fictional team works across two countries and wants to see a colleague’s public holiday dates before proposing calls. Record which region is needed and which calendars are already visible. A familiar holiday title appearing twice can come from two subscriptions rather than two personal appointments.",
          "Apple says the standard Holidays calendar is based on the computer’s region. Turning off its General setting hides that regional calendar; it does not mean every additional holiday subscription has been removed. Check the calendar list before adding another copy."
        ]
      },
      {
        "heading": "Add the different-region calendar",
        "body": [
          "In Calendar on Mac, choose File > New Holiday Calendar. Use the Region menu to select the desired country or region, then click Add. Choose the calendar name, location, alert and refresh settings, then click OK. Check the new calendar in the list and inspect a known holiday date in that region.",
          "To show or hide the built-in regional Holidays calendar, Apple documents Calendar > Settings > General > Show Holidays calendar. Keep this display choice separate from deleting a personal event that happens to have a similar name."
        ]
      },
      {
        "heading": "Treat the holidays as provider-controlled information",
        "body": [
          "Apple identifies Holidays as a subscription calendar. Its provider controls the events, so you cannot add or remove holidays directly in that feed. If you need a personal day off or a company-specific closure, create the appropriate owned record through the approved workflow instead of trying to rewrite the subscription.",
          "A public holiday reference is not proof that a colleague is unavailable, that a business is closed or that your own leave was approved. For the fictional team, ask the relevant person about the actual working arrangement before treating the reference date as a confirmed meeting conflict."
        ]
      },
      {
        "heading": "Verify a useful overview",
        "body": [
          "Compare one known holiday, the region in the new calendar’s name or information and your intended personal commitments. If a date appears twice, identify both calendar sources before hiding one. Do not delete a work or family appointment just to make the grid cleaner.",
          "This page describes Apple Calendar on Mac, not Cloud Calendars holiday subscriptions or employment rules. Use the appropriate calendar and provider when you need a personal booking or an organization’s actual closure schedule."
        ]
      }
    ],
    "comparison": {
      "heading": "Holiday reference versus personal commitment",
      "columns": [
        "Record",
        "Who controls it",
        "What it establishes"
      ],
      "rows": [
        {
          "cells": [
            "Mac’s regional Holidays feed",
            "Holiday provider and region choice",
            "Reference holiday dates"
          ]
        },
        {
          "cells": [
            "Additional region’s Holidays feed",
            "Holiday provider",
            "A second regional reference"
          ]
        },
        {
          "cells": [
            "Your approved leave entry",
            "Your owning calendar and workplace process",
            "The actual personal arrangement, when properly confirmed"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Check existing holiday subscriptions and the desired region.",
      "Use File > New Holiday Calendar and select that region.",
      "Inspect a known date and the calendar source.",
      "Record personal leave separately when needed; verify actual availability with the relevant person."
    ],
    "faq": [
      {
        "q": "Can I delete one holiday from the subscription?",
        "a": "Apple describes the Holidays feed as provider-controlled and read-only. Use an owned calendar for your own distinct commitments."
      },
      {
        "q": "Does hiding Show Holidays calendar hide every region I added?",
        "a": "Apple says that preference only hides the Holidays calendar for the computer’s region. Inspect other subscriptions separately."
      }
    ],
    "sourcesHeading": "Apple documentation checked for this workflow",
    "sources": [
      {
        "label": "Apple: holiday calendars for different regions on Mac",
        "url": "https://support.apple.com/guide/calendar/show-holidays-and-birthdays-iclead4e0ec3/mac"
      }
    ],
    "articleLinks": [
      {
        "slug": "what-an-all-day-event-really-means",
        "label": "Separate date labels from availability"
      },
      {
        "slug": "iphone-calendar-language-alternate-calendar-settings",
        "label": "Distinguish regional dates from display settings"
      },
      {
        "slug": "work-and-personal-without-two-apps",
        "label": "Keep reference and personal calendars distinct"
      }
    ],
    "seeAlso": [
      "what-an-all-day-event-really-means",
      "iphone-calendar-language-alternate-calendar-settings",
      "work-and-personal-without-two-apps"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here.",
    "galleryAfterContent": true
  },
  "google-calendar-holidays-by-country-and-religion": {
    "updated": "2026-11-12",
    "seoTitle": "How to Add Country & Religious Holidays in Google Calendar",
    "title": "Add Multiple Country & Religious Holiday Calendars in Google Calendar",
    "short": "Holidays in Google Calendar",
    "description": "Add public holidays for multiple countries or religious observances in Google Calendar, filter out optional observances, and hide individual days cleanly.",
    "lede": "In Google Calendar on a computer or mobile app, open Browse calendars of interest → Regional holidays (or Religious holidays) to display public holidays from multiple countries side by side, choose Public holidays only to cut clutter, and copy or hide individual dates since Google’s read-only feeds cannot be edited directly.",
    "commonBelief": "The holidays in my calendar are my days off.",
    "sections": [
      {
        "heading": "Add the right sources",
        "body": [
          "Under Regional holidays, click Browse all and tick the countries or regions you need. For religious holidays, use the Global religious holidays list and tick or untick each. For a regional calendar, Google lets you show Public holidays or Other observances.",
          "Google says holidays and national observances come from a third-party company that specialises in this data. Treat them as reference, not as an employer’s leave policy."
        ]
      },
      {
        "heading": "What you cannot change",
        "body": [
          "Google states you can’t edit the details of individual holidays, and that one colour applies to all holiday events; you can’t recolour them individually.",
          "You can hide one: select the holiday, click Trash and then Hide this holiday. To remove all holidays from view, uncheck Holidays under Other calendars."
        ]
      },
      {
        "heading": "Holidays are not your leave",
        "body": [
          "A public holiday is a date in a country, not proof that you or a colleague are off. If you take the day, put your own all-day event or an out-of-office entry on your calendar so other people can see it in their scheduling tools."
        ]
      },
      {
        "heading": "Worked example: a two-country household",
        "body": [
          "A fictional couple lives in Ireland; one partner works for a German company. They add Ireland and Germany under Regional holidays, set Germany to Public holidays only to keep the grid readable, and add one religious calendar they observe.",
          "A German regional holiday that does not apply to the partner’s state still appears, so they use Hide this holiday on it. On the days the partner actually takes off, they add their own all-day event “Off — German holiday” to their personal calendar.",
          "Check: open the month and confirm each remaining holiday applies to someone in the household."
        ]
      }
    ],
    "comparison": {
      "heading": "Holiday controls",
      "columns": [
        "Want to",
        "Do this",
        "Note"
      ],
      "rows": [
        {
          "cells": [
            "Add a country",
            "Regional holidays → Browse all → tick",
            "Third-party data"
          ]
        },
        {
          "cells": [
            "Reduce clutter",
            "Choose Public holidays instead of Other observances",
            "Per regional calendar"
          ]
        },
        {
          "cells": [
            "Add a religion’s holidays",
            "Global religious holidays → tick",
            "—"
          ]
        },
        {
          "cells": [
            "Remove one day",
            "Holiday → Trash → Hide this holiday",
            "Cannot edit details"
          ]
        },
        {
          "cells": [
            "Hide all",
            "Uncheck Holidays under Other calendars",
            "One colour for all holidays"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Add each relevant country under Regional holidays.",
      "Limit busy regions to Public holidays.",
      "Add religious holidays from the global list as needed.",
      "Hide individual holidays that don’t apply.",
      "Record actual days off as your own events."
    ],
    "faq": [
      {
        "q": "A holiday date is wrong. Can I edit it?",
        "a": "No. Google says you can’t edit individual holidays. Hide it and add your own event if needed."
      },
      {
        "q": "Can I colour Christmas differently from other holidays?",
        "a": "Google says one colour applies to all holiday events."
      }
    ],
    "sourcesHeading": "Google Calendar Help page used",
    "sources": [
      {
        "label": "Google: add or remove holidays on your calendar",
        "url": "https://support.google.com/calendar/answer/13748345?hl=en"
      }
    ],
    "seeAlso": [
      "iphone-calendar-language-alternate-calendar-settings",
      "what-an-all-day-event-really-means",
      "the-year-in-one-screen"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "alternating-a-b-week-school-timetable-calendar-vacation-exceptions": {
    "updated": "2026-10-23",
    "title": "Alternating A/B week timetable: decide what a holiday skips",
    "short": "Week A / Week B Timetable & Holidays",
    "description": "Plan an every-two-weeks timetable around a one-week break. Compare a fixed calendar cadence with a paused teaching cycle and verify the first weeks after it.",
    "lede": "A two-week recurrence keeps counting calendar weeks even when a class is removed. If a school pauses its A/B rotation during a holiday, deleting the holiday’s lessons alone will not create the intended post-break timetable. Confirm the school’s published schedule first.",
    "commonBelief": "",
    "sections": [
      {
        "heading": "Two recurrence patterns, one policy question",
        "body": [
          "RFC 5545 can express weekly recurrence with INTERVAL=2. Outlook’s guide explicitly gives an every-other-Monday example. Google documents choosing the repeat frequency and ending date. The particular school decides whether a holiday consumes a rotation week; the calendar standard does not.",
          "For this fictional Monday-only class example, A starts November 2, 2026 and B starts November 9. Both repeat every two weeks. November 23–27 is a chosen one-week break, and the example’s second teaching block ends December 18. This is not a real school holiday calendar."
        ]
      },
      {
        "heading": "Fixed calendar cadence: remove the break, keep the phase",
        "body": [
          "With no re-anchoring, A would occur November 2, 16 and 30, then December 14; B would occur November 9 and 23, then December 7. Removing B on November 23 leaves November 30 as A.",
          "RFC EXDATE removes matching recurrence instances; it does not restart the two-week interval. A provider’s single-occurrence deletion can implement an exception without literally exposing an ICS file, so verify the resulting dates in the source account."
        ]
      },
      {
        "heading": "Paused teaching cycle: bound and restart deliberately",
        "body": [
          "If the school instead requires November 30 to be B, bound the pre-break series to the final teaching date before the break, then create post-break B on November 30 and A on December 7, each repeating every two weeks through December 18. Inspect for duplicates from any old unbounded series.",
          "Use the editor’s supported ending-date control. If generating raw ICS, UNTIL has value-type and UTC requirements depending on DTSTART; do not write a placeholder such as UNTIL=Nov 20. The COUNT/UNTIL guide explains those requirements.",
          "For classes on several weekdays, create the actual weekday/time records, not a single Monday class and an assumption that the rest appear. Use the published timetable to verify each one."
        ]
      },
      {
        "heading": "Verify the first two teaching weeks after every break",
        "body": [
          "In the fictional example, fixed cadence produces A on November 30 and B on December 7. A paused cycle produces B on November 30 and A on December 7. That pair of dates is a more reliable check than a vague label such as odd week.",
          "An even two-week break preserves the phase difference under these two explicitly defined models; an odd one-week break changes it. Partial-week closures, day rotations and school-specific resets need their own published rules."
        ]
      }
    ],
    "comparison": {
      "heading": "Monday-only worked timetable, November–December 2026",
      "columns": [
        "Monday",
        "Unchanged two-week phase",
        "Fixed cadence after removing break",
        "Paused cycle"
      ],
      "rows": [
        {
          "cells": [
            "Nov 2",
            "A",
            "A",
            "A"
          ]
        },
        {
          "cells": [
            "Nov 9",
            "B",
            "B",
            "B"
          ]
        },
        {
          "cells": [
            "Nov 16",
            "A",
            "A",
            "A"
          ]
        },
        {
          "cells": [
            "Nov 23",
            "B",
            "Break: remove occurrence",
            "Break: pre-break series ended"
          ]
        },
        {
          "cells": [
            "Nov 30",
            "A",
            "A",
            "B: fresh post-break series"
          ]
        },
        {
          "cells": [
            "Dec 7",
            "B",
            "B",
            "A: fresh post-break series"
          ]
        },
        {
          "cells": [
            "Dec 14",
            "A",
            "A",
            "B"
          ]
        },
        {
          "cells": [
            "Dec 21",
            "Outside teaching block",
            "No class in this example",
            "No class in this example"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Read the school’s actual first post-break timetable.",
      "Choose the intended cadence before creating series.",
      "Bound old series before re-anchoring to avoid duplicates.",
      "Verify the first two post-break teaching weeks."
    ],
    "faq": [
      {
        "q": "Why does deleting the break not swap A and B?",
        "a": "An excluded occurrence does not reset the recurrence interval. Restart at the intended post-break anchor if that is what the school publishes."
      },
      {
        "q": "Can every school use the same two-week rule?",
        "a": "No. A day rotation, partial-week closure or school-specific reset can follow a different policy. Use its official timetable."
      }
    ],
    "sourcesHeading": "Primary specifications and official documentation",
    "sources": [
      {
        "label": "RFC 5545: weekly interval and UNTIL types",
        "url": "https://www.rfc-editor.org/rfc/rfc5545.html#section-3.3.10"
      },
      {
        "label": "RFC 5545: EXDATE",
        "url": "https://www.rfc-editor.org/rfc/rfc5545.html#section-3.8.5.1"
      },
      {
        "label": "Google: recurring events",
        "url": "https://support.google.com/calendar/answer/37115?hl=en"
      },
      {
        "label": "Microsoft: every-other-Monday recurrence",
        "url": "https://support.microsoft.com/en-gb/outlook/get-started-with-the-outlook-calendar"
      },
      {
        "label": "Supporting primary documentation",
        "url": "https://www.rfc-editor.org/rfc/rfc5545"
      }
    ],
    "articleLinks": [
      {
        "slug": "recurring-events-without-the-mess",
        "label": "Recurring events without the mess"
      },
      {
        "slug": "rrule-count-until-excluded-occurrences",
        "label": "Rrule count until excluded occurrences"
      },
      {
        "slug": "icalendar-exdate-recurrence-id-moved-instance",
        "label": "Icalendar exdate recurrence id moved instance"
      }
    ],
    "seeAlso": [
      "recurring-events-without-the-mess",
      "rrule-count-until-excluded-occurrences",
      "icalendar-exdate-recurrence-id-moved-instance"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "icloud-private-calendar-pending-invitations": {
    "updated": "2026-10-23",
    "title": "An iCloud private calendar invitation is still pending: verify, resend, then check access",
    "short": "Pending private invitations",
    "description": "Resolve an iCloud private-calendar invitation by checking account eligibility, participant status and the intended recipient before resending.",
    "lede": "A calendar-sharing invitation is not complete just because the owner sent an email. For a private iCloud calendar, distinguish an unanswered invitation from a joined participant who cannot find the schedule on another device. Resolve the acceptance state before changing synchronization settings.",
    "sections": [
      {
        "heading": "Record the intended relationship",
        "body": [
          "Use a small fictional example: Alex owns a rehearsal calendar, Pat should read it, and Sam should edit it. Write the intended recipient identity and privilege for each person. Keep this acceptance checklist separate from the rehearsal’s event-attendance list.",
          "Apple’s private-sharing documentation requires the recipient to have an Apple Account and use iCloud. Only the owner shares the private calendar. A person without the required setup needs an appropriate alternative arrangement, not repeated copies of an invitation they cannot use."
        ]
      },
      {
        "heading": "Read the owner’s participant state",
        "body": [
          "In the calendar’s information on iCloud.com, inspect the participant status. Apple distinguishes joined, declined and unanswered invitations. For an unanswered private-calendar invitation, its documented resend action is Invite Again beside that participant.",
          "Before resending, confirm the intended address with the person through your usual trusted channel. Do not add several guessed aliases with editing rights. Resending asks for a response; it does not prove a mailbox problem or force the person to join."
        ]
      },
      {
        "heading": "Complete acceptance on the recipient’s side",
        "body": [
          "Apple documents joining through the Calendar inbox on iCloud.com, using a tablet or computer. Open the relevant notification and choose Join Calendar. After acceptance, verify the actual calendar name and intended access rather than only looking for a familiar event title.",
          "For the example, ask Pat to locate a disposable rehearsal entry without attempting an edit. Ask Sam, if authorized and willing, to change one harmless sample field. Record the owner-side result. These are suggested checks for your own arrangement, not tests performed for this article."
        ]
      },
      {
        "heading": "Branch correctly after the person joins",
        "body": [
          "If the owner now sees a joined participant and the calendar is present on iCloud.com but missing on another device, investigate that device’s Apple Account, iCloud Calendar setting and calendar visibility. Do not restart the invitation workflow automatically.",
          "If the person declined, ask whether access is still wanted before resending. If the wrong identity was invited, have the owner correct the intended relationship. A working public link, a meeting RSVP and a private calendar membership are separate kinds of access."
        ]
      }
    ],
    "comparison": {
      "heading": "The rehearsal acceptance ledger",
      "columns": [
        "Person",
        "Intended relationship",
        "Next check"
      ],
      "rows": [
        {
          "cells": [
            "Pat",
            "Read the private calendar",
            "Joined status and sample entry visibility"
          ]
        },
        {
          "cells": [
            "Sam",
            "Edit the private calendar",
            "Joined status and agreed sample change"
          ]
        },
        {
          "cells": [
            "Any meeting guest",
            "Attend one rehearsal",
            "Event RSVP, outside this membership checklist"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Confirm the owner, intended recipient identity and privilege.",
      "Check whether the person joined, declined or has not replied.",
      "Resend only after validating the intended recipient.",
      "After joining, separate membership from a device visibility problem."
    ],
    "faq": [
      {
        "q": "Is joining a calendar the same as accepting its meetings?",
        "a": "No. Calendar membership and an event RSVP answer different questions. Record each where it belongs."
      },
      {
        "q": "Should I make the calendar public to fix a pending private invitation?",
        "a": "That broadens the distribution model. First verify eligibility, recipient identity and acceptance; change the sharing model only when its audience is actually appropriate."
      }
    ],
    "sourcesHeading": "Apple documentation checked for this guide",
    "sources": [
      {
        "label": "Apple: private and public calendar sharing on iCloud.com",
        "url": "https://support.apple.com/guide/icloud/share-a-calendar-mm6b1a9479/icloud"
      },
      {
        "label": "Apple: accept a shared calendar invitation",
        "url": "https://support.apple.com/guide/icloud/accept-a-shared-calendar-invitation-mm6b1a88ad/icloud"
      }
    ],
    "articleLinks": [
      {
        "slug": "why-a-shared-calendar-does-not-appear",
        "label": "Diagnose a missing shared source"
      },
      {
        "slug": "a-calendar-that-is-yours-to-share",
        "label": "Choose appropriate collaboration roles"
      },
      {
        "slug": "keeping-track-of-who-replied",
        "label": "Keep membership separate from attendance"
      }
    ],
    "seeAlso": [
      "why-a-shared-calendar-does-not-appear",
      "a-calendar-that-is-yours-to-share",
      "keeping-track-of-who-replied"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here.",
    "galleryAfterContent": true
  },
  "iphone-calendar-add-remove-event-attachments": {
    "updated": "2026-10-23",
    "title": "Attach the right file to an iPhone Calendar event, then check the saved version",
    "short": "Add or remove an event attachment",
    "description": "Add and remove event attachments in Apple Calendar on iPhone. Verify the file version and intended invitees without confusing it with a new invitation.",
    "lede": "An agenda’s filename can look right while its contents are an old draft. Before attaching it to an iPhone Calendar event, confirm both the event and the actual file. Apple’s native editor can locate an attachment through Files; save and reopen the result to verify what you added.",
    "sections": [
      {
        "heading": "Prepare the document and the event",
        "body": [
          "A fictional workshop has an updated PDF agenda and an older draft with a similar filename. Open the intended file first and check its contents. Then identify the actual workshop event, date, calendar and invitees. A similarly named personal copy is not necessarily the organizer’s shared event.",
          "Apple describes event attachments as a way to share files with invitees. Review the intended audience and document content before attaching. This guide does not promise that every calendar account supports identical attachment behavior or that a confidential file becomes safe because it is inside a calendar event."
        ]
      },
      {
        "heading": "Choose the file in Apple Calendar on iPhone",
        "body": [
          "Open the event in Apple Calendar, tap Edit, then Add attachment. Apple documents locating the file by search, folders or Browse for other locations such as iCloud Drive. Select the intended file and tap Done to save the event.",
          "Reopen the saved event and inspect the attachment. For the workshop example, compare its visible name and contents with the approved agenda, not just the fact that an attachment row exists. A new attendee or a different event time should be checked in the event’s own fields separately."
        ]
      },
      {
        "heading": "Remove the wrong attachment without removing the meeting",
        "body": [
          "Apple’s removal route is to open the event, tap Edit, swipe left over the attachment, then tap Remove. Check the resulting saved event through the editor’s normal completion controls. Removing an attachment is a narrower action than deleting the appointment.",
          "If you are replacing a draft, verify that the intended current file remains and the unwanted attachment no longer appears on the source event. Previously downloaded copies are a separate matter; the documentation does not establish that removing an event attachment recalls every copy already saved by a recipient."
        ]
      },
      {
        "heading": "Verify the recipient experience where the document matters",
        "body": [
          "For an agreed harmless example, ask an intended invitee to check whether they can locate and open the attached document through their normal calendar setup. Record the actual service and result if it differs. Do not solve an access problem by publishing the entire calendar.",
          "These are Apple Calendar on iPhone steps, not Cloud Calendars file-attachment controls or Google Drive permission instructions. If the Add attachment choice is unavailable for the actual event, use the owning service’s supported guidance rather than assuming every account exposes the same control."
        ]
      }
    ],
    "comparison": {
      "heading": "Workshop attachment check",
      "columns": [
        "Check",
        "Illustrative intended result",
        "What it does not establish"
      ],
      "rows": [
        {
          "cells": [
            "Event identity",
            "Correct workshop and organizer",
            "Correct file contents"
          ]
        },
        {
          "cells": [
            "File contents",
            "Approved current agenda",
            "Every recipient can open it"
          ]
        },
        {
          "cells": [
            "Saved attachment",
            "Intended file appears after reopening",
            "Old downloads have been recalled"
          ]
        },
        {
          "cells": [
            "Recipient check",
            "Agreed invitee opens the intended file",
            "A new guest was invited automatically"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Open and verify the intended document before attaching it.",
      "Confirm the actual event and audience.",
      "Use Edit > Add attachment, choose the file, save and reopen.",
      "Remove an unwanted attachment through its own control and verify the result."
    ],
    "faq": [
      {
        "q": "Do I need to delete the event to replace its attachment?",
        "a": "Apple documents a separate attachment removal action. Preserve the meeting while correcting its document."
      },
      {
        "q": "Does this describe Google Drive sharing?",
        "a": "No. It describes Apple Calendar’s iPhone attachment flow. Check the actual owning service and recipient route separately."
      }
    ],
    "sourcesHeading": "Apple documentation checked for this workflow",
    "sources": [
      {
        "label": "Apple: add and remove event attachments on iPhone",
        "url": "https://support.apple.com/guide/iphone/create-and-edit-events-in-calendar-iph3d110f84/ios"
      }
    ],
    "articleLinks": [
      {
        "slug": "what-guests-can-do-to-your-event",
        "label": "Separate event permissions from document access"
      },
      {
        "slug": "sharing-one-event-not-your-calendar",
        "label": "Check the intended event audience"
      },
      {
        "slug": "event-saved-to-wrong-calendar",
        "label": "Identify the actual event destination"
      }
    ],
    "seeAlso": [
      "what-guests-can-do-to-your-event",
      "sharing-one-event-not-your-calendar",
      "event-saved-to-wrong-calendar"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here.",
    "galleryAfterContent": true
  },
  "backward-planning-project-deadlines-across-weekends-and-holidays": {
    "updated": "2026-10-23",
    "title": "Plan backward across weekends and days off: a counted example",
    "short": "Backward Planning Across Weekends",
    "description": "Count a project backward from a dated deadline. State whether the final day counts, skip the chosen days off and verify every stage before creating work blocks.",
    "lede": "Before subtracting business days, define which days can be worked and whether the deadline date itself counts. A calendar cannot infer your organisation’s holidays or how a contract counts days. This is an illustrative planning method, not a legal deadline calculator.",
    "commonBelief": "",
    "sections": [
      {
        "heading": "Choose the counting convention first",
        "body": [
          "For this example, working days are Monday–Friday except November 11, 2026, which this fictional team has explicitly chosen as a day off. Do not assume that date is a holiday for every reader. The deadline is Friday November 20 at 17:00 and includes a full final workday.",
          "If the cut-off were Friday at 09:00, Friday would not supply a full working day before it. Agree that convention before placing the first work block. For formal filing or contractual deadlines, use the governing rule rather than this generic example."
        ]
      },
      {
        "heading": "Count dates one by one when exclusions exist",
        "body": [
          "Starting at the chosen final eligible day, count it, step backward one date, skip every weekend or listed day off, and repeat until the required count is reached. This handles consecutive holidays and any newly crossed weekend without a fragile add-one-calendar-day shortcut.",
          "Without holidays, subtracting five prior weekdays from a weekday lands seven calendar days earlier. That is a different operation from counting five working dates inclusively ending on the deadline. Label your count so those conventions do not get mixed."
        ]
      },
      {
        "heading": "Worked example: fifteen working dates in four stages",
        "body": [
          "Count November 20 as working date 15. Final QA uses November 19–20 (two dates). Stakeholder review uses November 12, 13, 16, 17 and 18 (five dates). Production uses November 3, 4, 5, 6, 9 and 10 (six dates). Scope uses October 30 and November 2 (two dates).",
          "That is 2 + 5 + 6 + 2 = 15 working dates. October 30 through November 20 inclusive spans 22 calendar dates: 15 working dates, six weekend dates and the chosen November 11 day off. The elapsed midnight-to-midnight difference is 21 days; inclusive dates and elapsed duration are not the same count."
        ]
      },
      {
        "heading": "Put the plan into a calendar, then check capacity",
        "body": [
          "Create the agreed deadline and the stage boundaries. Reserve actual work intervals on the eligible dates; counting a day as available is not proof that eight hours are free. Check meetings, partial days and who is responsible for each handoff.",
          "Google and Outlook document recurring-event controls, including choosing where a series ends. An RFC weekday pattern selects weekdays but does not import your holiday policy. Review every occurrence around the days off.",
          "If you delete one recurring occurrence, that removes a date rather than automatically shifting all later work. The source service may represent an exception differently internally; do not claim every GUI deletion literally writes an EXDATE file."
        ]
      }
    ],
    "comparison": {
      "heading": "Inclusive work dates, ending November 20, 2026",
      "columns": [
        "Stage",
        "Chosen working dates",
        "Count"
      ],
      "rows": [
        {
          "cells": [
            "Scope",
            "Oct 30; Nov 2",
            "2"
          ]
        },
        {
          "cells": [
            "Production",
            "Nov 3, 4, 5, 6, 9, 10",
            "6"
          ]
        },
        {
          "cells": [
            "Review",
            "Nov 12, 13, 16, 17, 18",
            "5"
          ]
        },
        {
          "cells": [
            "QA",
            "Nov 19, 20",
            "2"
          ]
        },
        {
          "cells": [
            "Excluded inside the span",
            "Oct 31; Nov 1, 7, 8, 14, 15 weekends; Nov 11 chosen day off",
            "7 calendar dates"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Define workdays, days off and the cut-off hour.",
      "State inclusive counting or prior-day subtraction.",
      "Walk dates backward and skip every ineligible date.",
      "Check real capacity before saving execution blocks."
    ],
    "faq": [
      {
        "q": "Can I add one calendar day per holiday to a weekday formula?",
        "a": "That shortcut can cross another weekend or another excluded day. Walk the eligible dates again instead."
      },
      {
        "q": "Does a Monday–Friday recurrence exclude public holidays?",
        "a": "No. You need an explicitly confirmed holiday list and exceptions or separately bounded work blocks."
      }
    ],
    "sourcesHeading": "Primary specifications and official documentation",
    "sources": [
      {
        "label": "RFC 5545: recurrence rules",
        "url": "https://www.rfc-editor.org/rfc/rfc5545.html#section-3.3.10"
      },
      {
        "label": "Google: recurring events and edit scope",
        "url": "https://support.google.com/calendar/answer/37115?hl=en"
      },
      {
        "label": "Microsoft: weekday and recurrence controls",
        "url": "https://support.microsoft.com/en-gb/outlook/get-started-with-the-outlook-calendar"
      },
      {
        "label": "Supporting primary documentation",
        "url": "https://www.rfc-editor.org/rfc/rfc5545"
      }
    ],
    "articleLinks": [
      {
        "slug": "planning-a-week-in-ten-minutes",
        "label": "Planning a Week in Ten Minutes"
      },
      {
        "slug": "month-view-on-a-bigger-screen",
        "label": "Month View on a Bigger Screen"
      },
      {
        "slug": "the-year-in-one-screen",
        "label": "The Year in One Screen"
      }
    ],
    "seeAlso": [
      "planning-a-week-in-ten-minutes",
      "month-view-on-a-bigger-screen",
      "the-year-in-one-screen"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "calendar-travel-time-versus-separate-buffer-event-blocks": {
    "updated": "2026-10-23",
    "title": "Calendar travel time or separate buffers? Check both journeys",
    "short": "Travel Time vs Buffer Event Blocks",
    "description": "Separate a travel reminder, booking-page buffer and Busy calendar block. Plan an outbound and return journey without promising universal availability blocking.",
    "lede": "A 14:00–15:00 visit with thirty minutes of travel each way occupies 13:30–15:30 in your personal plan. The shared meeting, a travel reminder and the availability used by a booking page are separate things. Check each rather than assuming one field covers both journeys.",
    "commonBelief": "",
    "sections": [
      {
        "heading": "What the documented controls actually say",
        "body": [
          "Apple’s Mac event guide documents a Travel Time menu and warns that its value does not update automatically after a location change. That alone does not establish how a Google or Exchange availability service interprets the field, or prove a return trip has been reserved. Inspect the saved event and return window explicitly.",
          "Google’s appointment-schedule guide describes Buffer time as adding time between appointments. This is a booking-schedule control, not evidence that the same time becomes a separate Busy event for every internal scheduling tool."
        ]
      },
      {
        "heading": "A worked three-block plan",
        "body": [
          "For the illustrative 14:00–15:00 visit, place personal outbound travel at 13:30–14:00 and return travel at 15:00–15:30. Meeting 60 minutes + outbound 30 + return 30 = 120 minutes total. These durations are assumptions for the plan, not navigation estimates.",
          "Keep the invitation at the actual agreed 14:00–15:00 time. Separate personal buffers avoid telling guests that the meeting itself starts at 13:30. If time or venue changes, review both travel blocks and any native Travel Time value."
        ]
      },
      {
        "heading": "Busy indicates availability; it is not an enforcement guarantee",
        "body": [
          "RFC 5545 describes VEVENT and its TRANSP setting: opaque events can be considered in busy-time searches; transparent events do not block them. The standard does not guarantee that every provider reads every calendar, imports every field, or rejects conflicting invitations.",
          "Save buffers in a calendar that your intended scheduling or booking flow actually checks. For Google appointment schedules, the availability-checking calendar choices also matter. Test a neutral block from the booking page or with a consenting colleague rather than declaring all clients protected."
        ]
      },
      {
        "heading": "Check details and visibility separately",
        "body": [
          "Use a neutral travel-block title if route details are unnecessary. Inspect both item visibility and calendar sharing; an ICS CLASS value alone is not a universal access-control guarantee.",
          "Keep this availability check separate from route/weather planning. The existing journey-planning guide addresses estimates and conditions; this guide focuses on which record a booking flow sees."
        ]
      }
    ],
    "comparison": {
      "heading": "Illustrative 14:00–15:00 visit",
      "columns": [
        "Record",
        "Time",
        "What to verify"
      ],
      "rows": [
        {
          "cells": [
            "Outbound personal block",
            "13:30–14:00",
            "Saved Busy state and calendar included by availability tool"
          ]
        },
        {
          "cells": [
            "Shared meeting",
            "14:00–15:00",
            "Actual agreed guest start/end"
          ]
        },
        {
          "cells": [
            "Return personal block",
            "15:00–15:30",
            "Return window visible to the intended availability check"
          ]
        },
        {
          "cells": [
            "Booking-page buffer",
            "Configured in appointment schedule",
            "Spacing on that booking page; do not infer a separate global Busy event"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Keep the shared meeting at the agreed time.",
      "Plan outbound and return intervals explicitly.",
      "Check saved calendar, availability and sharing.",
      "Test the actual booking flow after an edit."
    ],
    "faq": [
      {
        "q": "Does a travel-time menu prove the return trip is blocked everywhere?",
        "a": "No. Inspect the return period and the exact calendar/availability service. Add and verify a separate personal block when needed."
      },
      {
        "q": "Does Busy stop someone sending me a conflicting invitation?",
        "a": "It can inform availability checks; it is not a universal invitation-rejection rule."
      }
    ],
    "sourcesHeading": "Primary specifications and official documentation",
    "sources": [
      {
        "label": "Apple: Travel Time and location-change caveat",
        "url": "https://support.apple.com/guide/calendar/add-modify-or-delete-events-icalwr13-events/mac"
      },
      {
        "label": "Google: appointment schedule buffers",
        "url": "https://support.google.com/calendar/answer/10729749?hl=en"
      },
      {
        "label": "Google: booking availability calendar selection",
        "url": "https://support.google.com/calendar/answer/16287054?hl=en"
      },
      {
        "label": "RFC 5545: time transparency",
        "url": "https://www.rfc-editor.org/rfc/rfc5545.html#section-3.8.2.7"
      },
      {
        "label": "Supporting primary documentation",
        "url": "https://www.rfc-editor.org/rfc/rfc5545"
      }
    ],
    "articleLinks": [
      {
        "slug": "the-commute-and-the-sky",
        "label": "Plan the actual journey and check conditions"
      },
      {
        "slug": "booking-link-or-shared-calendar",
        "label": "Booking link or shared calendar"
      },
      {
        "slug": "recurring-events-without-the-mess",
        "label": "Recurring event edit scope"
      }
    ],
    "seeAlso": [
      "the-commute-and-the-sky",
      "booking-link-or-shared-calendar",
      "recurring-events-without-the-mess"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "calendar-week-numbers-iso-monday-versus-sunday-start-mismatch": {
    "updated": "2026-11-12",
    "seoTitle": "Why Calendar Week Numbers Disagree (ISO vs US Week 1 Rules)",
    "title": "Why Calendar Week Numbers Disagree: ISO Monday vs Sunday Start Fixed",
    "short": "Why Calendar Week Numbers Disagree",
    "description": "Why does one calendar say Week 1 while another says Week 52 or 53? Compare ISO 8601 (first 4-day week) vs US January 1 rules in Outlook, Google & Apple.",
    "lede": "When two calendars show different week numbers for the exact same date, check two separate settings: which day starts the week (Monday vs Sunday) and which rule defines Week 1 (ISO 8601’s first 4-day week / first Thursday vs the week containing January 1). Aligning both settings fixes the mismatch across Apple Calendar, Outlook, and Google Calendar.",
    "commonBelief": "",
    "sections": [
      {
        "heading": "Separate two settings before comparing numbers",
        "body": [
          "ISO weeks start Monday, and week 1 contains January 4. RFC 5545 section 3.3.10 defines BYWEEKNO using a first-week rule of at least four days, with WKST identifying the start of the week. A Sunday WKST is not, by itself, a command to make the week containing January 1 be week 1.",
          "For comparison, this article defines a different illustrative convention: Sunday-start weeks, with the week containing January 1 counted as week 1. These are explicit calculation assumptions, not a claim that every US calendar or Outlook installation uses them."
        ]
      },
      {
        "heading": "Use dates that expose both differences",
        "body": [
          "January 4, 2026 is a Sunday. It is the last day of ISO 2026-W01, but the first day of week 2 in the illustrative Sunday/January-1 convention. On Monday January 5, both label the date week 2.",
          "January 1, 2027 is a Friday in ISO 2026-W53. Monday January 4 is ISO 2027-W01, but week 2 under the Sunday/January-1 convention. At the year boundary, compare the week-year as well as the number; subtracting 53 from 1 does not describe a useful one-week offset."
        ]
      },
      {
        "heading": "Use an explicit lookup instead of an all-year slogan",
        "body": [
          "The table lists individual dates. It deliberately avoids claiming that the two numbers differ by exactly one on every day of 2027: Sundays and week-year rollover require their own check.",
          "ISO 2026 has 53 weeks: week 53 runs December 28, 2026–January 3, 2027. ISO 2027 week 1 starts January 4. The calculated boundaries explain the labels without moving any events."
        ]
      },
      {
        "heading": "Inspect app controls without assuming they share a week-year policy",
        "body": [
          "Apple’s iPhone guide separates Week Numbers from Start Week On. The former displays labels and the latter changes the first displayed weekday. That source does not establish that changing the first column selects every alternative week-numbering algorithm.",
          "Check the help for your installed calendar and version for a first-week-of-year option. The cited sources do not establish a universal Outlook menu path for that setting.",
          "When arranging a meeting, write the date as well as a week label, for example Monday January 4, 2027 (ISO 2027-W01). Do not reschedule an appointment to make two screen badges agree."
        ]
      }
    ],
    "comparison": {
      "heading": "Worked dates under two explicitly defined rules",
      "columns": [
        "Date",
        "ISO Monday / first four days",
        "Sunday / week containing Jan 1"
      ],
      "rows": [
        {
          "cells": [
            "2026-01-01",
            "2026-W01",
            "2026 week 1"
          ]
        },
        {
          "cells": [
            "2026-01-04 (Sunday)",
            "2026-W01",
            "2026 week 2"
          ]
        },
        {
          "cells": [
            "2026-01-05 (Monday)",
            "2026-W02",
            "2026 week 2"
          ]
        },
        {
          "cells": [
            "2027-01-01",
            "2026-W53",
            "2027 week 1"
          ]
        },
        {
          "cells": [
            "2027-01-03 (Sunday)",
            "2026-W53",
            "2027 week 2"
          ]
        },
        {
          "cells": [
            "2027-01-04 (Monday)",
            "2027-W01",
            "2027 week 2"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Compare the same exact calendar date.",
      "Record the first weekday and the week-1 rule separately.",
      "Check the week-year near December and January.",
      "Put an explicit date in shared plans."
    ],
    "faq": [
      {
        "q": "Does a Sunday-first grid always mean January 1 is in week 1?",
        "a": "No. First weekday and first-week rule are different decisions. Identify both."
      },
      {
        "q": "Should I move an event if its week number differs?",
        "a": "Compare its actual saved date and time first. A different display convention is not evidence that the appointment moved."
      }
    ],
    "sourcesHeading": "Primary specifications and official documentation",
    "sources": [
      {
        "label": "RFC 5545: BYWEEKNO and WKST",
        "url": "https://www.rfc-editor.org/rfc/rfc5545.html#section-3.3.10"
      },
      {
        "label": "Apple: Week Numbers and Start Week On",
        "url": "https://support.apple.com/guide/iphone/iphc37be2016/ios"
      },
      {
        "label": "Supporting primary documentation",
        "url": "https://www.rfc-editor.org/rfc/rfc5545"
      }
    ],
    "articleLinks": [
      {
        "slug": "iphone-calendar-language-alternate-calendar-settings",
        "label": "Calendar Language and Week Numbers on iPhone and iPad"
      },
      {
        "slug": "a-week-view-that-fits-a-week",
        "label": "A Week View That Fits a Week"
      },
      {
        "slug": "the-year-in-one-screen",
        "label": "The Year in One Screen"
      }
    ],
    "seeAlso": [
      "iphone-calendar-language-alternate-calendar-settings",
      "a-week-view-that-fits-a-week",
      "the-year-in-one-screen"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "google-appointment-cancel-booked-slot": {
    "updated": "2026-11-12",
    "seoTitle": "How to Cancel a Booked Google Calendar Appointment Slot",
    "title": "Cancel a Booked Google Calendar Appointment Slot (& Reopen the Time)",
    "short": "Cancel a booked appointment",
    "description": "How hosts and guests cancel a booked Google Calendar appointment schedule slot so the time reopens automatically—plus the forwarded-invite caveat.",
    "lede": "When a host deletes a booked appointment from Google Calendar (or the guest clicks Cancel appointment in their confirmation email), Google notifies both sides and automatically reopens that time slot on the booking page—provided no remaining guest or room keeps blocking the calendar.",
    "commonBelief": "Only I can cancel appointments people book with me.",
    "sections": [
      {
        "heading": "As the host",
        "body": [
          "Open the booked appointment in Google Calendar on a computer, click Cancel appointment, then on the booking page that opens click Cancel your appointment. Google says a cancellation email is sent to the person who booked and the cancelled time appears available again on your booking page.",
          "If the time must not be offered again, use a supported availability change. With Check calendars for availability enabled, a Busy hold on a calendar selected for conflict checks can protect the entire appointment interval. Adjusted availability is another documented date-specific control. Do not assume a hold on an unchecked calendar or a zero-duration entry protects the slot;verify the booking page."
        ]
      },
      {
        "heading": "As the guest",
        "body": [
          "Google says that to cancel a third-party calendar appointment, use the link in the confirmation email or decline the calendar invitation. The fetched page does not describe rescheduling, so this guide does not either."
        ]
      },
      {
        "heading": "Forwarded confirmations can cancel",
        "body": [
          "Google states that if you or the person who booked forwards the appointment confirmation email, the recipient can cancel the booked appointment. Do not forward confirmations to people who should not control the booking; send the time and place in a new message instead."
        ]
      },
      {
        "heading": "Two settings that change what reopens",
        "body": [
          "Google’s edit page notes that each slot on a booking page can be booked only once, and that if you turn off Check calendars for availability, all appointment blocks show as open. Leave the check on if cancelled slots should respect your other commitments.",
          "Google’s edit page does not say what happens to existing bookings when you change a schedule’s hours or duration. Contact booked guests directly rather than assuming they are moved."
        ]
      },
      {
        "heading": "Worked example: a consultant’s cancelled Friday",
        "body": [
          "In this fictional example, the consultant must cancel a 30-minute Friday booking at 10:00 and keep 10:00–10:30 unavailable. They confirm that availability checking is enabled and the primary calendar is selected, then add a Busy hold covering that full interval before cancelling through the booking workflow. They check that the client receives the supported cancellation notice and send appropriate alternative times separately.",
          "Earlier, the client had forwarded the confirmation to a colleague. The consultant reminds the client that, per Google, anyone with that email could cancel.",
          "Check: open the booking page as a visitor and confirm 10:00 Friday is not offered."
        ]
      }
    ],
    "comparison": {
      "heading": "Cancellation routes",
      "columns": [
        "Who",
        "How",
        "Result (per Google)"
      ],
      "rows": [
        {
          "cells": [
            "Host",
            "Event → Cancel appointment → Cancel your appointment",
            "Guest emailed and time released from the cancelled booking;other availability rules still apply"
          ]
        },
        {
          "cells": [
            "Guest",
            "Link in confirmation email, or decline invitation",
            "Booking cancelled"
          ]
        },
        {
          "cells": [
            "Anyone with a forwarded confirmation",
            "Link in the forwarded email",
            "Can cancel the booking"
          ]
        },
        {
          "cells": [
            "Host who wants no rebooking",
            "Use a full-duration Busy hold on a reviewed calendar with checks enabled, or supported adjusted availability",
            "Verify visitor-side output;other settings and refresh can affect what appears"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Block the time first if it should not be rebooked.",
      "Cancel through Cancel appointment, not by deleting the event.",
      "Send the guest a personal note with alternatives.",
      "Don’t forward confirmation emails.",
      "Check the public booking page afterwards."
    ],
    "faq": [
      {
        "q": "Does cancelling reopen the time?",
        "a": "Google says cancelled appointment time returns to the booking page’s available inventory. It can still be unavailable because of enabled conflict checks, adjusted availability, notice limits or other schedule rules. Check the actual visitor page rather than assume every cancelled time is bookable."
      },
      {
        "q": "Can someone other than the guest cancel?",
        "a": "Google says anyone who receives a forwarded confirmation email can cancel the booking."
      }
    ],
    "sourcesHeading": "Google Calendar Help pages used",
    "sources": [
      {
        "label": "Google: cancel appointments on your calendar",
        "url": "https://support.google.com/calendar/answer/10737245?hl=en"
      },
      {
        "label": "Google: edit your appointment schedule",
        "url": "https://support.google.com/calendar/answer/10730791?hl=en"
      },
      {
        "label": "Google: selected-calendar Busy conflict checks",
        "url": "https://support.google.com/calendar/answer/16287054?hl=en"
      },
      {
        "label": "Google: adjusted availability and scheduling windows",
        "url": "https://support.google.com/calendar/answer/11423292?hl=en"
      }
    ],
    "seeAlso": [
      "booking-link-or-shared-calendar",
      "keeping-track-of-who-replied",
      "what-an-all-day-event-really-means"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "google-calendar-change-event-owner-before-handover": {
    "updated": "2026-11-12",
    "seoTitle": "How to Change Event Owner in Google Calendar (Steps & Limits)",
    "title": "How to Change Event Owner in Google Calendar (Single & Recurring)",
    "short": "Hand a meeting to a new owner",
    "description": "Transfer a single or recurring Google Calendar meeting to a new owner: exact desktop steps, the 60-day acceptance rule, 200-guest limit, and Google Meet.",
    "lede": "To transfer a Google Calendar meeting on a computer, open the event → Options (⋮) → Change owner, enter the new owner, and send the invite—they have 60 days to accept via email while you remain organizer until they click the link. Before handing off recurring series or recorded Google Meet calls, check the 200-guest transfer cap and Meet host rules below.",
    "commonBelief": "Sending a colleague “Change owner” hands the meeting over immediately.",
    "sections": [
      {
        "heading": "What a transfer does and does not do",
        "body": [
          "Google’s steps are: select an event you own, open Options, choose Change owner, enter the new owner and a message. The new owner receives an email with a link. Google states they have 60 days to accept and that you remain the owner until then.",
          "Google says events with more than 200 guests cannot be transferred to another owner or calendar. Its same-organisation requirement is stated under whole-calendar ownership transfer, not the separate event Change owner procedure. For an individual event, inspect the actual Change owner options and your organisation’s policy; this guide does not promise that every proposed recipient is eligible. Moving an event between calendars and changing its owner are separate operations."
        ]
      },
      {
        "heading": "The Google Meet consequence",
        "body": [
          "Google’s Meet documentation says that when an event is created on or transferred to someone else’s primary calendar, that person becomes the calendar event organiser, and the meeting’s features depend on the video-conferencing policies that apply to them. Its example: if the new organiser’s edition or admin settings do not allow recording, they will not be able to record the meeting.",
          "If an event is instead put on a non-primary calendar, Google says the organiser does not change, so Meet features stay the same — and if you then leave the organisation before the meeting, the link stops working. Parking meetings on a team calendar is therefore not a safe substitute for a real owner transfer when you are leaving."
        ]
      },
      {
        "heading": "Worked example: a handover list",
        "body": [
          "A fictional programme coordinator moving teams on 30 November organises three items: a weekly partner check-in, a one-off quarterly review with a Meet link that is usually recorded, and an all-hands briefing with 240 guests.",
          "The coordinator checks the actual Change owner options for the check-in and review and confirms the intended recipient before sending. Before the review’s transfer, they ask whether the successor’s account supports Meet recording. The 240-guest all-hands exceeds Google’s documented transfer limit, so they coordinate a supported replacement owned by the successor and inform attendees how the original will be retired. A recurring meeting needs deliberate future-occurrence scope and preservation of useful history; do not delete an entire historical series as a handoff shortcut.",
          "For illustration, the coordinator starts a week before leaving and follows up on pending requests. That is a planning example, not a required or sufficient lead time. Completion depends on the recipient actually accepting; afterwards, inspect the saved event’s organiser and required Meet features before closing the old account."
        ]
      },
      {
        "heading": "Checks after acceptance",
        "body": [
          "Open the event as the new owner and confirm the organiser, guest list, time zone and Meet link. Ask the new owner to start the Meet call briefly before the first real session if recording or other host features matter. For a recurring meeting, look at several future occurrences, not only the next one, before assuming the whole series moved.",
          "If the transfer has not been accepted when you leave, you are still the owner. Do not let the 60-day window run out silently: chase the recipient or plan a replacement event with the attendees informed."
        ]
      },
      {
        "heading": "What this page does not cover",
        "body": [
          "Transferring ownership of a whole secondary calendar is a different decision with its own consequences and is handled in a separate guide. Cloud Calendars can display Google events but does not perform Google’s ownership transfer; use Google Calendar for that step."
        ]
      }
    ],
    "comparison": {
      "heading": "Handover options compared",
      "columns": [
        "Action",
        "Organiser changes?",
        "Meet features after",
        "Risk if you leave"
      ],
      "rows": [
        {
          "cells": [
            "Change owner, accepted, to colleague’s primary calendar",
            "Yes",
            "Follow the new organiser’s policies",
            "Verify saved organiser, access and required Meet features; acceptance alone is not a guarantee of every host capability"
          ]
        },
        {
          "cells": [
            "Change owner sent, not yet accepted",
            "You remain the owner until acceptance; the recipient has a 60-day acceptance window",
            "Unchanged",
            "High; meeting still depends on you"
          ]
        },
        {
          "cells": [
            "Move to a non-primary calendar",
            "No",
            "Unchanged",
            "Google says the Meet link stops working if you leave the organisation"
          ]
        },
        {
          "cells": [
            "Event with more than 200 guests",
            "Cannot be transferred",
            "—",
            "Coordinate an appropriate successor-owned replacement and supported cancellation scope; preserve relevant history"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "List every event you organise that will outlive your role.",
      "Check the proposed recipient in the event’s actual Change owner workflow and ask whether the successor’s account supports the Meet features you rely on.",
      "Send Change owner with a message well before your last day.",
      "For events over 200 guests, coordinate a successor-owned replacement and clearly communicate the appropriate retirement or cancellation scope for the original.",
      "Chase acceptances; you remain owner until each is accepted.",
      "After acceptance, check the organiser, several recurring occurrences and the Meet link."
    ],
    "faq": [
      {
        "q": "Is the meeting transferred as soon as I click Change owner?",
        "a": "No. Google says the new owner gets an email link, has 60 days to accept, and you stay owner until then."
      },
      {
        "q": "Can I transfer a meeting to someone at a client company?",
        "a": "Do not infer the answer from the whole-calendar ownership rule. Google states a same-organisation requirement under calendar transfer, while documenting Change owner separately for events. Check the event’s available controls and organisation policy; neither universal eligibility nor universal rejection across domains is established here."
      },
      {
        "q": "Will recording still work after the transfer?",
        "a": "Only if the new organiser’s edition and admin settings allow it. Google says Meet features follow the policies of the calendar event organiser."
      }
    ],
    "sourcesHeading": "Google Help pages used",
    "sources": [
      {
        "label": "Google: transfer calendars or events in Google Calendar",
        "url": "https://support.google.com/calendar/answer/78739?hl=en"
      },
      {
        "label": "Google Meet: how settings apply to events created on or transferred to other calendars",
        "url": "https://support.google.com/meet/answer/10003792?hl=en"
      }
    ],
    "seeAlso": [
      "event-saved-to-wrong-calendar",
      "what-guests-can-do-to-your-event",
      "meeting-links-that-make-themselves",
      "recurring-events-without-the-mess"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here.",
    "galleryAfterContent": true
  },
  "mac-calendar-travel-time-after-location-change": {
    "updated": "2026-10-23",
    "title": "Changed a meeting’s location on Mac? Recheck Travel Time as well",
    "short": "Recheck travel time after a move",
    "description": "Apple Calendar on Mac does not automatically update Travel Time when a location changes. Check the address, saved allowance and departure alert separately.",
    "lede": "A new venue does not guarantee an updated travel allowance in Calendar on Mac. Apple explicitly says Travel Time does not update automatically when you change locations. Reopen both fields before relying on a departure plan.",
    "sections": [
      {
        "heading": "Keep three scheduling facts separate",
        "body": [
          "For a fictional workshop, the start remains 14:00, the venue changes from a nearby office to a farther site, and the saved travel allowance is still 20 minutes. The event time, destination and journey allowance are three different facts. A correct new address alone does not prove the old allowance is useful.",
          "Confirm whether the workshop also requires early arrival. Do not move its shared start time earlier to represent your personal departure. Write the intended venue, arrival requirement and selected travel allowance before editing."
        ]
      },
      {
        "heading": "Reopen the native Mac event fields",
        "body": [
          "In Calendar on Mac, double-click the event. Apple documents selecting a location from the matching results after entering an address or business. It also permits keeping entered location text verbatim when no result is selected. Check that the stored destination is the one you intend, rather than relying on a similar venue name.",
          "Inspect the separate Travel Time menu and select an appropriate option. Apple’s explicit warning is that changing locations does not automatically update travel time. Use your navigation or transport source for a current route assessment rather than assuming the previous allowance was recalculated."
        ]
      },
      {
        "heading": "Check the alert, not just the block on screen",
        "body": [
          "Apple’s Mac notification guide offers Time to Leave as an alert when a location is present. It also has a Calendar > Settings > Alerts Time to Leave preference. That signal is different from a plain fixed reminder such as 30 minutes before the start.",
          "For the workshop, reopen the saved alert choice and the destination after changing the venue. If you also keep a separate departure entry, check that it does not still point to the old site. No universal route accuracy or on-time arrival guarantee follows from any alert label."
        ]
      },
      {
        "heading": "Verify the shared and personal outcomes",
        "body": [
          "The organizer needs the correct workshop venue in the actual invitation. You need a realistic personal route plan and departure reminder. Confirm a consequential venue change directly with affected people as well as through the calendar update.",
          "This page describes Mac Calendar controls. Cloud Calendars’ weather and event location features do not establish the same Travel Time behavior or controls. Use the existing travel/weather guide for the broader journey check, and keep the owning provider authoritative for the meeting."
        ]
      }
    ],
    "comparison": {
      "heading": "Fictional 14:00 workshop moved to another site",
      "columns": [
        "Field",
        "Question after the move",
        "Evidence to inspect"
      ],
      "rows": [
        {
          "cells": [
            "Event start",
            "Is 14:00 still the agreed start?",
            "Organizer’s current invitation"
          ]
        },
        {
          "cells": [
            "Location",
            "Is the intended site saved?",
            "Address or selected venue in event"
          ]
        },
        {
          "cells": [
            "Travel Time",
            "Does the old allowance still fit?",
            "Separate Travel Time menu and route assessment"
          ]
        },
        {
          "cells": [
            "Departure alert",
            "Which signal is configured?",
            "Saved Alert and native Calendar preference"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Confirm the meeting’s actual start and new venue.",
      "Reopen Travel Time rather than assuming it updated.",
      "Review any Time to Leave or fixed alert separately.",
      "Verify the saved invitation and communicate important venue changes."
    ],
    "faq": [
      {
        "q": "Does changing location recalculate saved Mac Travel Time automatically?",
        "a": "Apple’s guide says it does not. Recheck the Travel Time field after the move."
      },
      {
        "q": "Is Time to Leave identical to a 30 minute alert?",
        "a": "No. A fixed offset and the native Time to Leave option are separate choices; inspect the actual saved alert."
      }
    ],
    "sourcesHeading": "Apple documentation checked for this workflow",
    "sources": [
      {
        "label": "Apple: location, travel time and event details on Mac",
        "url": "https://support.apple.com/guide/calendar/add-modify-or-delete-events-icalwr13-events/mac"
      },
      {
        "label": "Apple: manage notifications from Calendar on Mac",
        "url": "https://support.apple.com/guide/calendar/manage-notifications-icl624fd1912/mac"
      }
    ],
    "articleLinks": [
      {
        "slug": "the-commute-and-the-sky",
        "label": "Review the whole route and arrival plan"
      },
      {
        "slug": "weather-where-the-event-is",
        "label": "Check the intended forecast place"
      },
      {
        "slug": "calendar-notifications-missing-silent-or-duplicated",
        "label": "Verify reminder delivery separately"
      }
    ],
    "seeAlso": [
      "the-commute-and-the-sky",
      "weather-where-the-event-is",
      "calendar-notifications-missing-silent-or-duplicated"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here.",
    "galleryAfterContent": true
  },
  "mac-calendar-check-invitee-availability": {
    "updated": "2026-10-23",
    "title": "Check invitee availability in Mac Calendar—and why the button may be missing",
    "short": "Check availability before sending",
    "description": "Add the intended recipients and use Check Availability in Mac Calendar when the service supports it. A free slot is not an accepted invitation.",
    "lede": "Mac Calendar can show free/busy information for supported calendar services, but typing a name is not enough to establish that the right person was added. Confirm the recipients first, then use the availability controls when the event’s service provides them.",
    "sections": [
      {
        "heading": "Complete the intended recipient entries",
        "body": [
          "For a fictional three-person review, write the intended identities and proposed duration before sending. In the Mac event, use Add Invitees and enter each name or email address. Apple says Calendar looks for matches in Contacts, Mail and connected calendar servers.",
          "Apple also warns that pressing Return before a match is found or before an email is complete does not add the invitee. Inspect the actual recipients shown in the event. A typed fragment still in a field is not proof that a colleague is included."
        ]
      },
      {
        "heading": "Use Check Availability only where supported",
        "body": [
          "Apple says Check Availability appears below the invitees when the event is on a service that tracks availability, such as CalDAV. Click it to open the Availability window and review free/busy time. A missing button does not by itself show that the colleague declined or that the account lost every calendar record.",
          "In that window you can move the event block, inspect another day using the arrows, or choose Next Available Time to look for a time when all invitees are available. Keep the intended duration and date context in view rather than treating the first convenient-looking blank as a confirmed booking."
        ]
      },
      {
        "heading": "Send the proposal and check the actual reply",
        "body": [
          "After choosing the intended time and verifying the event details, use Send. Availability information helps with the proposal; it is not the guest’s Yes or an undertaking to attend. Check the organizer’s invitation and actual response separately.",
          "For the review example, record the invited people, candidate interval, available information and eventual replies. If the service does not supply the availability control, ask the people for suitable times through the normal coordination channel instead of moving a real meeting as a test."
        ]
      },
      {
        "heading": "Keep provider access separate from the calendar view",
        "body": [
          "A combined personal overview does not mean every underlying provider shares free/busy information with every other account. Identify the calendar service that owns this invitation and the actual people resolved by its entry fields.",
          "This guide describes Apple Calendar on Mac. It does not claim Cloud Calendars has the same Availability window, supports every server’s free/busy lookup or guarantees no conflicts. Use the actual provider and confirm consequential arrangements with the guests."
        ]
      }
    ],
    "comparison": {
      "heading": "Three-person review readiness check",
      "columns": [
        "Stage",
        "Evidence to collect",
        "Not yet established"
      ],
      "rows": [
        {
          "cells": [
            "Recipient entry",
            "All three intended people appear as invitees",
            "Their availability"
          ]
        },
        {
          "cells": [
            "Availability search",
            "Supported service and candidate interval",
            "Attendance acceptance"
          ]
        },
        {
          "cells": [
            "Sent invitation",
            "Saved original event and chosen time",
            "Every guest has replied"
          ]
        },
        {
          "cells": [
            "Replies received",
            "Actual guest responses",
            "No later schedule change"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Verify each intended recipient is actually added.",
      "Use Check Availability if the owning service offers it.",
      "Compare the candidate interval and duration before Send.",
      "Track actual responses separately from the availability view."
    ],
    "faq": [
      {
        "q": "Why is Check Availability missing?",
        "a": "Apple ties it to the event’s calendar service tracking availability. Identify that service before treating the missing control as a general account failure."
      },
      {
        "q": "Does Next Available Time mean everyone accepted?",
        "a": "No. It is an availability aid before sending; attendance requires the appropriate guest response."
      }
    ],
    "sourcesHeading": "Apple documentation checked for this workflow",
    "sources": [
      {
        "label": "Apple: invite people and check availability on Mac",
        "url": "https://support.apple.com/guide/calendar/send-and-receive-invitations-to-events-icl1016/mac"
      }
    ],
    "articleLinks": [
      {
        "slug": "keeping-track-of-who-replied",
        "label": "Verify actual attendance replies"
      },
      {
        "slug": "calendar-event-or-room-reservation",
        "label": "Check resource confirmation separately"
      },
      {
        "slug": "icloud-google-and-outlook-in-one-view",
        "label": "Do not confuse a combined view with provider access"
      }
    ],
    "seeAlso": [
      "keeping-track-of-who-replied",
      "calendar-event-or-room-reservation",
      "icloud-google-and-outlook-in-one-view"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here.",
    "galleryAfterContent": true
  },
  "icloud-calendar-invitation-sender-email": {
    "updated": "2026-10-23",
    "title": "Choose the email address that sends your iCloud event invitations",
    "short": "Invitation sender identity",
    "description": "Choose an available iCloud invitation sender address and verify it with a harmless event before sending important invitations.",
    "lede": "An event can be saved to the correct calendar yet reach guests from an unexpected email address. In Calendar on iCloud.com, the invitation-sender choice is a separate identity setting. Check it before a club, household or professional invitation leaves an address that recipients do not recognize.",
    "sections": [
      {
        "heading": "Separate sender identity from event destination",
        "body": [
          "Write down two decisions: which calendar should own the appointment, and which email identity should send the invitation. Giving a calendar a recognizable name or changing its color is not a substitute for checking the outgoing identity.",
          "Consider a fictional coordinator, Morgan, who has a personal address and a club address associated with the Apple Account used for scheduling. The intended result is a test meeting in the correct calendar, sent from an available club identity, with responses checked independently. This example does not establish that any arbitrary address can be added to the menu."
        ]
      },
      {
        "heading": "Choose from the addresses Apple actually offers",
        "body": [
          "Apple’s web instructions use a tablet or computer. In Calendar on iCloud.com, open Actions, Settings, then Account. Choose an available address in the invitation-sender menu. Apple explains that the menu is absent when only one email is configured; eligible additional identities can include aliases, custom-domain addresses or another service’s address associated with the Apple Account.",
          "If the intended choice is missing, stop at the identity question. Consult Apple’s linked account and mail-address setup instructions. Do not type someone else’s address into an event description and assume that changes the sender, and do not send a real invitation just to experiment."
        ]
      },
      {
        "heading": "Verify with one cooperative recipient",
        "body": [
          "Ask a trusted person to expect a disposable event with no confidential information. Note its title, destination calendar and chosen sending address. Send it once, then ask the recipient which address the invitation identifies and whether the correct appointment details are present.",
          "Keep the observed sender, recipient and response state as separate fields. A successful email delivery says nothing by itself about whether the recipient accepted. If the identity is unexpected, pause further distribution and review the selected account rather than repeatedly editing a real meeting."
        ]
      },
      {
        "heading": "Use a clear identity handoff record",
        "body": [
          "For the fictional club, keep a short note: calendar owner, intended sending identity, responsible inbox monitor, test recipient and date checked. That helps a replacement coordinator discover how invitations were configured without borrowing a password or changing ownership casually.",
          "This guide describes Apple’s invitation identity. It does not change Cloud Calendars accounts, Google organizers, or the address used by every application. Use the owning service’s controls for the event you are actually sending."
        ]
      }
    ],
    "comparison": {
      "heading": "A sender verification record",
      "columns": [
        "Field",
        "Illustrative intended value",
        "Evidence to collect"
      ],
      "rows": [
        {
          "cells": [
            "Calendar destination",
            "Club rehearsals",
            "Reopened saved event"
          ]
        },
        {
          "cells": [
            "Sending identity",
            "Available club address",
            "Recipient’s invitation details"
          ]
        },
        {
          "cells": [
            "Attendance response",
            "Not assumed",
            "Recorded guest reply"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Identify the Apple Account and calendar that should own the event.",
      "Choose an address offered by the iCloud web invitation-sender menu.",
      "Use an agreed, non-sensitive test event.",
      "Check sender identity and guest response as separate observations."
    ],
    "faq": [
      {
        "q": "Why is there no sender-address menu?",
        "a": "Apple says the menu is absent when only one email is configured. Review Apple’s identity setup guidance rather than assuming the event editor is broken."
      },
      {
        "q": "Does changing the sender move existing events?",
        "a": "Treat identity selection and an event’s owning calendar as separate decisions. Verify existing appointments individually before changing their destination."
      }
    ],
    "sourcesHeading": "Apple documentation checked for this guide",
    "sources": [
      {
        "label": "Apple: invite people to an event and choose the sender email",
        "url": "https://support.apple.com/guide/icloud/invite-people-to-an-event-mm6b1a805a/icloud"
      }
    ],
    "articleLinks": [
      {
        "slug": "event-saved-to-wrong-calendar",
        "label": "Check the event’s owning calendar"
      },
      {
        "slug": "sharing-one-event-not-your-calendar",
        "label": "Choose the correct invitation route"
      },
      {
        "slug": "keeping-track-of-who-replied",
        "label": "Check guest responses"
      }
    ],
    "seeAlso": [
      "event-saved-to-wrong-calendar",
      "sharing-one-event-not-your-calendar",
      "keeping-track-of-who-replied"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here.",
    "galleryAfterContent": true
  },
  "outlook-calendar-color-categories": {
    "updated": "2026-10-23",
    "title": "Colour-code your Outlook calendar with categories",
    "short": "Outlook colour categories",
    "description": "Use Outlook colour categories to tag calendar items in new Outlook, classic Outlook or the web. Categories are personal: attendees don’t see yours.",
    "lede": "Categories let you colour individual Outlook items by project, client or type, independently of which calendar they’re on. They are your labels, not the organiser’s. Arte Soft, the developer of Cloud Calendars, explains.",
    "commonBelief": "If I colour a meeting red, everyone in the meeting sees it red.",
    "sections": [
      {
        "heading": "Assign a category",
        "body": [
          "New Outlook and Outlook on the web: right-click the event and choose Categorize, or open it and choose Categorize on the Event tab, then pick a category. Repeat to add more than one. Use Manage categories or All Categories for more options.",
          "Classic Outlook: right-click the item and point to Categorize, or use Categorize in the Tags group of an open item. All Categories lets you create new ones."
        ]
      },
      {
        "heading": "Categories are personal",
        "body": [
          "Microsoft says a category applied to a meeting you received does not affect the other person’s Outlook view; the selection applies to the item in your own calendar. The same category list can be used for other Outlook item types such as mail, contacts and tasks. This is a personal organization tool, not a sharing or access-control setting.",
          "Categories also differ from calendar colours, which colour a whole calendar. Use calendar colours to tell accounts apart and categories to tag individual items."
        ]
      },
      {
        "heading": "Worked example: a consultant with three clients",
        "body": [
          "A fictional consultant creates three categories, Client A (blue), Client B (green) and Admin (grey), and applies them to meetings in their work calendar. A meeting with both clients gets two categories.",
          "When Client A’s project manager sends an invitation, the consultant tags it blue on their own calendar; the project manager’s calendar is unaffected.",
          "Check: in week view, inspect the items tagged for each client before agreeing more work. For a meeting with two categories, count its duration only once if calculating total occupied time; do not assume an item’s displayed color represents every assigned category."
        ]
      }
    ],
    "comparison": {
      "heading": "Categories vs calendar colour",
      "columns": [
        "",
        "Category",
        "Calendar colour"
      ],
      "rows": [
        {
          "cells": [
            "Applies to",
            "Individual items (several per item)",
            "A whole calendar"
          ]
        },
        {
          "cells": [
            "Seen by attendees",
            "A category you apply to a received meeting does not change the sender’s Outlook view",
            "Not applicable"
          ]
        },
        {
          "cells": [
            "Also used for",
            "Mail, contacts, tasks",
            "—"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Create a small set of categories for your main projects or types.",
      "Apply them with Categorize; add more than one where needed.",
      "Use calendar colours to separate accounts, categories to tag items.",
      "Don’t rely on categories to signal anything to attendees."
    ],
    "faq": [
      {
        "q": "Will attendees see my categories?",
        "a": "Microsoft says a category you apply to a received meeting does not affect the other person’s Outlook view. Use explicit communication, not a personal category, to signal something to attendees."
      },
      {
        "q": "Can one meeting have two categories?",
        "a": "Yes. Microsoft says you can assign more than one."
      }
    ],
    "sourcesHeading": "Microsoft Support page used",
    "sources": [
      {
        "label": "Microsoft: assign a color category to a calendar event in Outlook",
        "url": "https://support.microsoft.com/en-us/outlook/calendar/assign-a-color-category-to-a-calendar-event-in-outlook"
      },
      {
        "label": "Supporting primary documentation",
        "url": "https://support.microsoft.com/en-US/Outlook/calendar/assign-a-color-category-to-a-calendar-event-in-outlook"
      }
    ],
    "seeAlso": [
      "change-calendar-color-iphone",
      "planning-a-week-in-ten-minutes",
      "a-week-view-that-fits-a-week"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "icloud-delete-calendar-every-device": {
    "updated": "2026-10-23",
    "title": "Delete an iCloud calendar or just stop seeing it? Check the scope first",
    "short": "Delete an iCloud calendar deliberately",
    "description": "An iCloud calendar deletion removes its events across iCloud-enabled devices. Decide whether you need deletion, hidden display or ended sharing instead.",
    "lede": "Deleting a calendar on iCloud.com is not a way to remove clutter from one screen. Apple says its events are deleted too, and the calendar is removed from devices with iCloud Calendar enabled. Establish the intended scope before choosing Delete Calendar.",
    "sections": [
      {
        "heading": "Write the desired result before the operation",
        "body": [
          "A fictional organizer has finished a volunteer project. The calendar still holds its history, and the organizer only wants it out of the daily view. That is different from intentionally deleting the project’s calendar records or ending another person’s access.",
          "Write one precise outcome:hide from my current view, stop collaborating, or delete the owned calendar and its events. Do not choose deletion merely because its menu is easier to find. A received subscription or someone else’s shared calendar also has a different relationship from a calendar you own."
        ]
      },
      {
        "heading": "Understand the documented deletion scope",
        "body": [
          "Apple’s iCloud guide states that deleting a calendar deletes all associated events. It also removes that calendar from every device with Calendars enabled in iCloud settings. The iCloud calendar list must retain at least one calendar, so deleting every calendar is not supported.",
          "Before an intentional deletion, identify the calendar name, owner and source and review representative current and historical entries. If you need a retained copy, assess and verify an appropriate export separately. Do not assume another synced phone is an independent backup that will retain the deleted calendar."
        ]
      },
      {
        "heading": "Use the appropriate owner control",
        "body": [
          "On a tablet or computer, sign in to Calendar on iCloud.com with the intended Apple Account. In the sidebar, tap the calendar on a tablet or hover over it on a Mac. Apple’s documented route is Actions > Delete Calendar. Read the actual confirmation and scope before proceeding.",
          "If the real goal is ending collaboration while retaining the records, Apple has separate Stop Sharing or Public Calendar controls. Use those with the appropriate ownership instead. This guide is explanatory; it does not perform a deletion or claim every service uses the same menu."
        ]
      },
      {
        "heading": "If a deletion was accidental, avoid compounding it",
        "body": [
          "Apple links an archived-calendar restore route for accidental deletion. That is a broader recovery decision with sharing and current-schedule consequences, not a guaranteed single-record undo. Use the dedicated recovery guide before selecting a version.",
          "For the volunteer-project example, keep a private note of the source, calendar and action taken. Do not reimport an old file repeatedly or change another account just because the calendar vanished from multiple screens. That cross-device disappearance may be the expected scope of the original deletion."
        ]
      }
    ],
    "comparison": {
      "heading": "Choose the intended scope",
      "columns": [
        "Goal",
        "Operation to investigate",
        "Key distinction"
      ],
      "rows": [
        {
          "cells": [
            "Reduce visual clutter",
            "Relevant calendar display selection",
            "Not destruction of the owned records"
          ]
        },
        {
          "cells": [
            "End someone’s access",
            "Owner’s sharing controls",
            "Not deletion of the calendar history"
          ]
        },
        {
          "cells": [
            "Remove the calendar and its events",
            "iCloud Delete Calendar",
            "Affects iCloud-enabled devices"
          ]
        },
        {
          "cells": [
            "Recover an accidental deletion",
            "Archive recovery review",
            "Broader than a one-screen display change"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Name the intended outcome and actual calendar owner.",
      "Review the calendar’s events and any verified copy you need.",
      "Use the narrowest matching display, sharing or deletion control.",
      "If deletion was accidental, assess the provider’s recovery scope before further changes."
    ],
    "faq": [
      {
        "q": "Will another iCloud-connected device keep the calendar?",
        "a": "Do not treat it as an independent backup. Apple says deletion affects devices with iCloud Calendar enabled."
      },
      {
        "q": "Can I delete every iCloud calendar?",
        "a": "Apple says the list must always contain at least one calendar."
      }
    ],
    "sourcesHeading": "Apple documentation checked for this workflow",
    "sources": [
      {
        "label": "Apple: delete a calendar on iCloud.com",
        "url": "https://support.apple.com/guide/icloud/delete-a-calendar-mmfbbb36ac/icloud"
      },
      {
        "label": "Apple: stop sharing instead of deleting an iCloud calendar",
        "url": "https://support.apple.com/guide/icloud/stop-sharing-a-calendar-mm6b1a8f9f/icloud"
      }
    ],
    "articleLinks": [
      {
        "slug": "disconnect-calendar-integration-without-losing-track",
        "label": "Separate disconnection from record deletion"
      },
      {
        "slug": "taking-back-a-calendar-you-shared",
        "label": "End access without assuming copies disappear"
      },
      {
        "slug": "recover-deleted-calendar-events-iphone",
        "label": "Review iCloud recovery consequences"
      }
    ],
    "seeAlso": [
      "disconnect-calendar-integration-without-losing-track",
      "taking-back-a-calendar-you-shared",
      "recover-deleted-calendar-events-iphone"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here.",
    "galleryAfterContent": true
  },
  "display-multiple-time-zone-columns-google-calendar-outlook": {
    "updated": "2026-10-23",
    "title": "Show additional time zones in Google Calendar and Outlook",
    "short": "Display 2 or 3 Time Zones on Grid",
    "description": "Add parallel time-zone rulers in Google Calendar and Outlook. Check classic Outlook version limits, labels and the view without changing event times.",
    "lede": "Extra time-zone rulers let you read one meeting slot in several cities without editing the meeting. Google documents a primary, secondary and tertiary zone. Outlook controls differ by version; do not apply the classic Outlook limit to every Outlook client.",
    "commonBelief": "",
    "sections": [
      {
        "heading": "Google Calendar: additional rulers or the world clock",
        "body": [
          "On a computer, open Settings, then General and Time zone. Google documents Show additional time zones, a Secondary time zone and an optional Tertiary time zone. Return to an hourly calendar view and inspect the parallel labels.",
          "For other cities, General > World clock offers Show world clock and Add time zone. This is a sidebar clock, a different display from an extra calendar ruler."
        ]
      },
      {
        "heading": "Outlook: identify the client before following its menus",
        "body": [
          "In new Outlook and Outlook on the web, Microsoft documents Settings > Calendar > View, then Add time zone. Choose the city under Other time zones, optionally give it a label, enable Show in calendar and save. Move up and Move down reorder the additional zones. The cited page does not establish a maximum of three for these clients; its web instructions explicitly discuss three or more.",
          "For classic Outlook, use File > Options > Calendar > Time zones. Microsoft says the latest Outlook for Microsoft 365 supports up to three zones; other classic versions, including Outlook 2019 LTSC and Outlook 2016, support two. Use the second/third-zone checkboxes actually available in that version.",
          "Microsoft says the second zone is visible in day or week view. If a label disappears in another view, return to Day or Week before changing event data."
        ]
      },
      {
        "heading": "Worked winter check: three offices, one instant",
        "body": [
          "For this author-calculated example, use January 15, 2026 and 08:00 in Los Angeles. That is 16:00 UTC, 11:00 in New York and 16:00 in London. All three labels describe one instant.",
          "With illustrative working hours of 08:00–18:00 in each city, the shared interval is 08:00–10:00 Los Angeles, 11:00–13:00 New York and 16:00–18:00 London: two hours. This is a calculation for the stated date and hours, not a measurement of anyone’s availability."
        ]
      },
      {
        "heading": "Verify a ruler without moving a meeting",
        "body": [
          "Record one harmless event’s date and start, add the display columns, and compare that same event. Adding a secondary display label is different from changing the event’s own time zone.",
          "Changing the primary display zone can move where events appear on your grid; verify the saved event instant rather than assuming a different visible hour means the meeting was rescheduled."
        ]
      }
    ],
    "comparison": {
      "heading": "January 15, 2026: one row read in three cities",
      "columns": [
        "Los Angeles",
        "New York",
        "London",
        "UTC"
      ],
      "rows": [
        {
          "cells": [
            "06:00",
            "09:00",
            "14:00",
            "14:00Z"
          ]
        },
        {
          "cells": [
            "08:00–10:00",
            "11:00–13:00",
            "16:00–18:00",
            "16:00–18:00Z"
          ]
        },
        {
          "cells": [
            "14:00",
            "17:00",
            "22:00",
            "22:00Z"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Identify the Outlook client and version.",
      "Use named city zones and short, meaningful labels.",
      "Return to an hourly Day or Week view to inspect additional rulers.",
      "Compare a known event before editing any meeting."
    ],
    "faq": [
      {
        "q": "Does new Outlook have the same three-zone limit as classic Outlook?",
        "a": "The cited Microsoft page gives a three-zone limit for the latest classic Outlook for Microsoft 365, not a universal cap for new Outlook or web. Use the controls in your current client."
      },
      {
        "q": "Does adding a second ruler change a saved meeting?",
        "a": "It adds another way to read the same instant. Changing an event’s own time zone is a separate edit."
      }
    ],
    "sourcesHeading": "Primary specifications and official documentation",
    "sources": [
      {
        "label": "Google: additional time zones and world clock",
        "url": "https://support.google.com/calendar/answer/37064?hl=en"
      },
      {
        "label": "Microsoft: version-specific time-zone controls",
        "url": "https://support.microsoft.com/en-us/outlook/getstarted/manage-time-zone-settings-in-outlook"
      }
    ],
    "articleLinks": [
      {
        "slug": "a-week-view-that-fits-a-week",
        "label": "A Week View That Fits a Week"
      },
      {
        "slug": "time-zones-and-the-flight-you-booked",
        "label": "Time Zones and the Flight You Booked"
      },
      {
        "slug": "when-two-calendars-disagree",
        "label": "When Two Calendars Disagree"
      },
      {
        "slug": "non-integer-30-and-45-minute-utc-offset-calendar-scheduling",
        "label": "half hour 45 minute time zone offset calendar"
      }
    ],
    "seeAlso": [
      "a-week-view-that-fits-a-week",
      "time-zones-and-the-flight-you-booked",
      "when-two-calendars-disagree"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "google-calendar-public-embed-on-website": {
    "updated": "2026-10-23",
    "title": "Embed a Google Calendar on your website: public details or free/busy only",
    "short": "Embed a calendar on a website",
    "description": "Put a Google Calendar on a website: make the right calendar public, choose full details or free/busy only, and allow up to four hours for changes.",
    "lede": "A calendar embedded on a website still follows Google’s sharing rules. To let everyone view it without an individual sharing grant, make it public deliberately. An embed does not turn a private calendar into a public one. Arte Soft, the developer of Cloud Calendars, publishes this guide.",
    "commonBelief": "Embedding a calendar only shows it on my website.",
    "sections": [
      {
        "heading": "Choose the audience before the embed",
        "body": [
          "Google says an embedded calendar is visible only to people with whom it is shared. Public sharing is needed for an everyone-access audience;it is not a technical prerequisite for every restricted embed. A viewer of a restricted embed still needs appropriate calendar access, and embedding does not bypass sign-in or browser restrictions. For anonymous public visitors, use a dedicated public calendar rather than broaden a private one accidentally.",
          "Google lists what public allows: people can find your public calendar on a website, and if that website is searchable, find it in search results; they can also sync it with other applications and subscribe to it in Google Calendar. Treat everything on a public calendar as published."
        ]
      },
      {
        "heading": "Choose details or free/busy",
        "body": [
          "When making a calendar public, Google offers See only free/busy (hide details) if you don’t want people to read event details. A clinic-style “we are booked on these afternoons” page needs free/busy; a club fixtures page needs details.",
          "Use a dedicated calendar for anything you embed. A new secondary calendar that only ever holds public items is far safer than making your primary calendar public and hoping each event is marked appropriately."
        ]
      },
      {
        "heading": "Get and customise the embed code",
        "body": [
          "In Settings, click the calendar, then Integrate calendar, and under Embed code click Customize. Google asks for width and height of at least 500 each. If you turn off navigation buttons, Google notes visitors can only use keyboard shortcuts to move around the calendar. Visitors can click Add to Google Calendar at the bottom left to subscribe.",
          "Google also offers a shareable link and a public iCal address. They expose the same public calendar, so choose the format your audience needs rather than publishing all three."
        ]
      },
      {
        "heading": "Worked example: a community choir",
        "body": [
          "A fictional choir secretary wants concerts visible to anonymous website visitors, while a partner venue only needs rehearsal busy times. They create Choir concerts as a dedicated public calendar with suitable event details and embed that calendar. They keep Choir rehearsals restricted and use named free/busy sharing for the venue. Publishing its free/busy calendar would make that information available to anyone, not only the venue.",
          "The secretary’s primary calendar, which holds personal appointments, is never made public. After saving, they open the website in a private browser window and confirm only concerts appear.",
          "When a concert moves, the secretary checks the saved source event and the actual embedded view without assuming a documented event-refresh deadline. Google’s up-to-four-hour tip is under stopping public sharing;it is not a promise that every concert edit or embed error resolves within that interval."
        ]
      },
      {
        "heading": "Undo and restrictions",
        "body": [
          "To stop public access, open Settings and sharing and uncheck Make available to public. Google says this access change usually takes minutes but may take up to four hours. Check an appropriate visitor’s view;the change does not recall screenshots, independent copies or information already read.",
          "Google notes sharing settings can only be edited from a computer, not the mobile app, and that a Google Workspace administrator may restrict sharing. If the public option is missing on a work account, ask the administrator rather than copying events into a personal calendar."
        ]
      }
    ],
    "comparison": {
      "heading": "Pick the publishing setup",
      "columns": [
        "Goal",
        "Calendar",
        "Public setting",
        "Share via"
      ],
      "rows": [
        {
          "cells": [
            "Public events list on a website",
            "Dedicated secondary calendar",
            "Public, full details",
            "Embed code"
          ]
        },
        {
          "cells": [
            "Show when booked to the general public",
            "Dedicated calendar",
            "Public with See only free/busy",
            "Embed or public link;anyone may see the published busy pattern"
          ]
        },
        {
          "cells": [
            "Let people follow in their own calendar app",
            "Same public calendar",
            "As above",
            "Public iCal address"
          ]
        },
        {
          "cells": [
            "Share with specific people only",
            "Dedicated or appropriate existing calendar",
            "Keep restricted and grant named access",
            "Named sharing;an embed remains access-controlled"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Create a dedicated calendar for anything you will publish.",
      "For an anonymous public audience, enable public sharing with the intended detail level. For a restricted audience, use appropriate named sharing instead.",
      "Copy the embed code from Integrate calendar and set width and height of at least 500.",
      "Check the page as a logged-out visitor.",
      "When stopping public sharing, note Google’s documented possible access-change delay and verify the visitor result;do not use that timing as an event-edit refresh guarantee."
    ],
    "faq": [
      {
        "q": "Can I embed a calendar without making it public?",
        "a": "Yes, an embed can remain restricted to people with appropriate access. Google says public sharing is needed to make it visible to everyone. Do not make a private calendar public just to bypass an embed-access problem."
      },
      {
        "q": "Can people find my public calendar in search?",
        "a": "Google says that if the website showing it is searchable, people can find your calendar in search results."
      },
      {
        "q": "I made it public but the website still shows an error.",
        "a": "Check the intended audience, the saved calendar sharing and the calendar chosen in the embed. The source’s up-to-four-hour note concerns stopping public sharing, not every error after publication or event edit."
      }
    ],
    "sourcesHeading": "Google Calendar Help pages used",
    "sources": [
      {
        "label": "Google: create and manage a public Google calendar",
        "url": "https://support.google.com/calendar/answer/37083?hl=en"
      },
      {
        "label": "Google: add a calendar to your website",
        "url": "https://support.google.com/calendar/answer/41207?hl=en"
      }
    ],
    "seeAlso": [
      "the-secret-address-of-a-google-calendar",
      "who-can-see-what-in-google-calendar",
      "booking-link-or-shared-calendar",
      "taking-back-a-calendar-you-shared"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "outlook-end-recurring-meeting-early-keep-history": {
    "updated": "2026-11-12",
    "seoTitle": "How to End a Recurring Outlook Meeting & Keep Past History",
    "title": "End a Recurring Meeting in Outlook Early Without Deleting Past Dates",
    "short": "End an Outlook series early",
    "description": "Do not click Cancel Series—it deletes past meetings too. Change the recurrence end date in Outlook instead so historical occurrences stay on every calendar.",
    "lede": "Clicking Cancel Series on an Outlook recurring meeting deletes every past occurrence along with future ones from attendees’ calendars. To stop future sessions while preserving your meeting history and notes, open the series, edit the recurrence pattern’s End by date to the final completed date, and send the update.",
    "commonBelief": "Cancel Series is the right way to stop a weekly meeting.",
    "sections": [
      {
        "heading": "Why an end date beats cancelling",
        "body": [
          "Microsoft’s organisational best practice says that although you can cancel a recurring meeting, a better option is to change the end date for the series, because it lets you and the attendees keep a record of meetings that occurred; if you cancel altogether, that history is lost. Its delete guidance says the same: edit the series to change the end date and preserve all past meetings.",
          "Only the organizer can send an update or cancellation to all attendees."
        ]
      },
      {
        "heading": "What you still lose",
        "body": [
          "Microsoft warns that ending a series early loses the exceptions associated with it — the individual occurrences you changed, such as a moved week or a different room. Its classic Outlook steps add that agenda, notes and attachments added to previous instances are deleted when you confirm.",
          "If any past occurrence holds notes or files you need, save them elsewhere first. Microsoft separately recommends keeping attachments in OneDrive or SharePoint rather than in recurring meetings, because each exception carries its own copy."
        ]
      },
      {
        "heading": "Steps by client",
        "body": [
          "Classic Outlook (Microsoft lists Outlook for Microsoft 365, 2024 and 2021): open any occurrence, choose The entire series, select Recurrence, and under Range of recurrence choose End by with a date before the next meeting. Confirm, type a message for attendees and select Send Update.",
          "New Outlook for Windows: Microsoft’s page directs you to Edit series and change the end date to before the next meeting, then Send. Microsoft’s pages do not give equivalent steps for the web, Mac or mobile; use the series editor in that client and confirm the end date before sending."
        ]
      },
      {
        "heading": "If you’re an attendee",
        "body": [
          "Microsoft warns that if you are not the organizer and delete the series from your calendar, past occurrences are removed too. To remove only future meetings while retaining the past, its documented attendee route is to delete the future occurrences individually. If the organizer sends a cancellation, Microsoft’s best practice is to use Remove from Calendar on the cancellation in your inbox rather than deleting items from the calendar directly."
        ]
      },
      {
        "heading": "Worked example: retiring a weekly stand-up",
        "body": [
          "A fictional team lead organises a Monday stand-up that started in January 2026; the team is reorganising on 1 December 2026. Three past occurrences were moved to Tuesdays and one had a slide deck attached.",
          "The lead first saves the slide deck and any other needed occurrence notes elsewhere. Then, in classic Outlook, they open the series, set End by to 30 November 2026 and send the update with “Last stand-up is Monday 30 November; new team meetings will follow.”",
          "Result to expect, per Microsoft: past occurrences remain as a record; the three moved Tuesday exceptions and anything attached to individual occurrences may be lost. Attendees process the update; nobody deletes the series from their own calendars."
        ]
      }
    ],
    "comparison": {
      "heading": "Ways to stop a series",
      "columns": [
        "Action",
        "Who",
        "Past occurrences",
        "Changed occurrences and their notes/files"
      ],
      "rows": [
        {
          "cells": [
            "Change end date, Send Update",
            "Organizer",
            "Kept (Microsoft’s recommended route)",
            "Lost"
          ]
        },
        {
          "cells": [
            "Cancel Series",
            "Organizer",
            "Lost",
            "Lost"
          ]
        },
        {
          "cells": [
            "Delete series from own calendar",
            "Attendee",
            "Removed from that attendee’s calendar",
            "—"
          ]
        },
        {
          "cells": [
            "Remove from Calendar on the organizer’s cancellation",
            "Attendee",
            "Per the organizer’s cancellation",
            "—"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Save notes and attachments from past occurrences you still need.",
      "As organizer, change the series end date rather than cancelling the series.",
      "Send the update with a short explanation.",
      "As attendee, process cancellations with Remove from Calendar; don’t delete the series yourself.",
      "For new series, set an end date from the start, as Microsoft recommends."
    ],
    "faq": [
      {
        "q": "Will changing the end date delete meetings that already happened?",
        "a": "Microsoft says it keeps a record of past meetings, unlike cancelling. Changed occurrences (exceptions) and items attached to earlier instances may be lost."
      },
      {
        "q": "Can an attendee end the series?",
        "a": "No. Only the organizer can send updates or cancellations to all attendees."
      }
    ],
    "sourcesHeading": "Microsoft Support pages used",
    "sources": [
      {
        "label": "Microsoft: cancel all future meetings in a series",
        "url": "https://support.microsoft.com/en-us/Outlook/cancel-all-future-meetings-in-a-series"
      },
      {
        "label": "Microsoft: cancel a recurring meeting series in Outlook",
        "url": "https://support.microsoft.com/en-gb/office/cancel-a-recurring-meeting-series-in-outlook-6111a4d4-70d9-4205-8e3f-1a937863813e"
      },
      {
        "label": "Microsoft: delete an appointment or a meeting",
        "url": "https://support.microsoft.com/en-US/Outlook/delete-an-appointment-or-a-meeting"
      },
      {
        "label": "Microsoft: best practices for organisations using the Outlook calendar",
        "url": "https://support.microsoft.com/en-us/outlook/best-practices-for-organizations-when-using-the-outlook-calendar"
      }
    ],
    "seeAlso": [
      "recurring-events-without-the-mess",
      "recover-deleted-calendar-events-iphone",
      "keeping-track-of-who-replied"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "outlook-events-from-email-flights-hotels": {
    "updated": "2026-10-23",
    "title": "Flights and hotels added to Outlook from email: control what appears",
    "short": "Outlook events from email",
    "description": "Control which Outlook booking-email summaries appear on the calendar, check account limits and preserve the separate privacy setting.",
    "lede": "Outlook can extract supported bookings from email and add them to the calendar. Display choices are available by event type; the private-event checkbox is a separate setting. Arte Soft, the developer of Cloud Calendars, explains the account limits and what to check before sharing.",
    "commonBelief": "Every booking email becomes a calendar event.",
    "sections": [
      {
        "heading": "What gets added",
        "body": [
          "Microsoft lists flight, hotel and rental car reservations and package deliveries from supported senders. The same page says bills, dining, event and service reservations stopped being supported from mid-August 2020, even though some older instructions lower on the page still mention them. Do not promise those discontinued types. Past events and unsupported providers are not added."
        ]
      },
      {
        "heading": "Which accounts",
        "body": [
          "Microsoft’s page applies to Outlook 2024, Outlook 2021 and Outlook.com and refers to Microsoft accounts (Outlook.com or Microsoft 365). It says the feature isn’t available for Office 365 operated by 21Vianet, Office 365 Germany or government plans, and lists the regions where it is available."
        ]
      },
      {
        "heading": "Change it per type",
        "body": [
          "In Outlook on the web or Outlook.com, open Settings > Calendar > Events from email. For each supported type choose Don’t show event summaries in email or on my calendar, Only show event summaries in email, or Show event summaries in email and on my calendar. Separately, the Mark events as private so only I can see them checkbox controls whether these created events are marked private; it is checked by default.",
          "Microsoft says these settings are changed through Outlook on the web or Outlook.com, not Outlook for Windows. If the feature was turned off, turning it back on does not create events or summaries for past messages. Its classic-web notes also say package-delivery information is not added automatically for Microsoft 365 business or other commercial accounts."
        ]
      },
      {
        "heading": "Worked example: shared calendar, private trips",
        "body": [
          "A fictional traveller shares their calendar with a partner and wants flights visible but hotel bookings out of the calendar. In Outlook.com they open Events from email, keep flights on Show event summaries in email and on my calendar, set hotels to Only show event summaries in email, and leave flight entries private.",
          "Microsoft’s sharing guidance says most people you share with see the time of a private item but not its details. It also describes an exception for a delegate granted access to private events. The traveller checks the actual audience and sharing permissions with the partner rather than assuming private is an absolute secrecy guarantee.",
          "Check: after the next booking email, confirm what the partner can see before relying on it."
        ]
      }
    ],
    "comparison": {
      "heading": "Per-type choices",
      "columns": [
        "Choice",
        "In email",
        "On calendar"
      ],
      "rows": [
        {
          "cells": [
            "Don’t show event summaries in email or on my calendar",
            "No",
            "No"
          ]
        },
        {
          "cells": [
            "Only show event summaries in email",
            "Yes",
            "No"
          ]
        },
        {
          "cells": [
            "Show event summaries in email and on my calendar",
            "Yes",
            "Yes (private by default)"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Open Calendar settings → Events from email in Outlook.com or Outlook on the web.",
      "Choose a display option for each reservation type.",
      "Keep entries private unless others need details.",
      "Confirm what calendar viewers see with a real booking."
    ],
    "faq": [
      {
        "q": "Why doesn’t my restaurant booking appear?",
        "a": "Microsoft says dining reservations were discontinued in mid-August 2020."
      },
      {
        "q": "Can my shared-calendar viewers see flight details?",
        "a": "These events are private by default. Microsoft says most shared viewers see only their times, but delegates granted access to private events are an exception. Check your actual sharing permissions before relying on this."
      }
    ],
    "sourcesHeading": "Microsoft Support page used",
    "sources": [
      {
        "label": "Microsoft: automatically add events from your email to your calendar",
        "url": "https://support.microsoft.com/en-us/outlook/automatically-add-events-from-your-email-to-your-calendar"
      },
      {
        "label": "Microsoft: share your calendar (private items)",
        "url": "https://support.microsoft.com/en-us/outlook/share-your-calendar-in-outlook-on-the-web"
      },
      {
        "label": "Supporting primary documentation",
        "url": "https://support.microsoft.com/en-US/Outlook/automatically-add-events-from-your-email-to-your-calendar"
      }
    ],
    "seeAlso": [
      "time-zones-and-the-flight-you-booked",
      "who-can-see-what-in-google-calendar",
      "event-saved-to-wrong-calendar"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "google-calendar-events-from-gmail-visibility": {
    "updated": "2026-10-23",
    "title": "Flights and reservations from Gmail in Google Calendar: who can see them",
    "short": "Events from Gmail",
    "description": "See why Gmail adds flights and bookings to Google Calendar, who can view them on a shared calendar, and how to change their privacy or turn them off.",
    "lede": "Booking confirmations can turn into calendar events without you creating anything. They follow their own visibility setting, separate from your ordinary events, which matters the moment your calendar is shared. Arte Soft, the developer of Cloud Calendars, explains the controls.",
    "commonBelief": "Events Gmail adds are just like events I create, so my calendar’s sharing applies to them the same way.",
    "sections": [
      {
        "heading": "What Gmail adds and when",
        "body": [
          "Google lists flight, train and bus reservations; hotel and restaurant reservations; and events with registration confirmations or tickets, including movies, shows and medical events. It requires Smart features in Google Workspace to be on.",
          "Google says events from Gmail are off by default in the European Economic Area, Japan, Switzerland and the UK, and do not work for government accounts, accounts with data-location restrictions or Google accounts without Gmail. Notifications follow your default Calendar notification settings."
        ]
      },
      {
        "heading": "Who can see them",
        "body": [
          "Google states that by default only you can find events from Gmail, even if you share your calendar. You can change this under Settings, Google Workspace smart features, Show events from Gmail, Privacy of email events, choosing Calendar default, Private or Only me, and then whether to apply it to new events or all events.",
          "Google’s Gmail-specific help describes Calendar default as showing name and time to calendar viewers, and Private as including people allowed to edit. The generic calendar-permission documentation describes more detailed viewer/editor levels. These sources do not give a fully explicit matrix for every combination. Do not infer exactly what a particular free/busy viewer or restricted editor receives without checking a harmless example from that account.",
          "Only me is different from Private. Private can still expose an event to permitted editors, while the Gmail help describes Only me as user-only. Anyone using your signed-in Google account on a device can still see its events;the setting is not a way to hide information from someone with access to that same account. A single Gmail-derived event also has documented Default visibility, Public and Private choices;review their actual audience before changing one."
        ]
      },
      {
        "heading": "Worked example: travel the partner should see, an appointment they shouldn’t",
        "body": [
          "A fictional user shares a calendar with a partner at See event details and a manager at free/busy. A train reservation and a sensitive appointment are added from Gmail. The user checks that the global Gmail setting remains Only me instead of assuming either recipient can or cannot see a later widened setting.",
          "Before sharing travel through Calendar, the user inspects the documented per-event visibility options and verifies a harmless record with the intended recipient. They do not widen all future Gmail events merely to share one train journey. If the audience cannot be established confidently, they send the necessary travel details directly through an appropriate channel and leave sensitive bookings user-only.",
          "Changing a global setting can apply to new events or all events, so read that choice explicitly. Verify the earlier sensitive appointment separately after any change. This example does not claim the free/busy manager sees a particular title, or that Private is equivalent to Only me."
        ]
      },
      {
        "heading": "Turn it off or remove one event",
        "body": [
          "To stop the feature, untick Show events from Gmail and confirm OK. To remove a single item, open the event and choose Delete event. Deleting it does not cancel the reservation; that is handled with the company that sent the email."
        ]
      }
    ],
    "comparison": {
      "heading": "Gmail privacy labels and the checks they require",
      "columns": [
        "Setting",
        "Google’s documented description",
        "Check before using"
      ],
      "rows": [
        {
          "cells": [
            "Only me",
            "Only the user of this Google account",
            "Check device/account access;this does not hide events from someone signed into the same account"
          ]
        },
        {
          "cells": [
            "Private",
            "Includes the user and people with permitted calendar editing access",
            "Not equivalent to user-only;verify the exact permission context"
          ]
        },
        {
          "cells": [
            "Calendar default",
            "Gmail help describes name/time visibility to calendar viewers",
            "The full interaction with all viewer roles is not explicit;test a harmless recipient view before widening"
          ]
        },
        {
          "cells": [
            "Public for one event",
            "Visible through a publicly shared calendar",
            "Review the actual public audience and sensitive event fields"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Check whether Show events from Gmail is on.",
      "Review who has access to your calendar.",
      "Pick Only me, Private or Calendar default under Privacy of email events, choosing new or all events.",
      "Do not treat Private as Only me. Keep sensitive bookings under the intended user-only setting and verify old events after any global change.",
      "Delete an event you don’t want; cancel the booking with its provider separately."
    ],
    "faq": [
      {
        "q": "Can people I share my calendar with see my flights?",
        "a": "Not by default. Google says events from Gmail are visible only to you unless you change Privacy of email events."
      },
      {
        "q": "Why don’t reservations appear for me in the UK?",
        "a": "Google says events from Gmail are off by default in the EEA, Japan, Switzerland and the UK, and require Smart features to be on."
      },
      {
        "q": "Does deleting the event cancel my booking?",
        "a": "No. It removes the calendar entry only."
      }
    ],
    "sourcesHeading": "Google Calendar Help pages used",
    "sources": [
      {
        "label": "Google: manage your events from Gmail",
        "url": "https://support.google.com/calendar/answer/6084018?hl=en"
      },
      {
        "label": "Google: manage the visibility of events from Gmail",
        "url": "https://support.google.com/calendar/answer/15454771?hl=en"
      },
      {
        "label": "Google: current calendar permission definitions",
        "url": "https://support.google.com/calendar/answer/15716974?hl=en"
      }
    ],
    "seeAlso": [
      "who-can-see-what-in-google-calendar",
      "time-zones-and-the-flight-you-booked",
      "event-saved-to-wrong-calendar"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here.",
    "articleLinks": [
      {
        "slug": "outlook-events-from-email-flights-hotels",
        "label": "Outlook events from email"
      }
    ]
  },
  "outlook-forward-meeting-and-allow-forwarding": {
    "updated": "2026-11-12",
    "seoTitle": "Does Forwarding an Outlook Invite Notify the Organizer?",
    "title": "Forwarding Outlook Meeting Invites: Organizer Alerts & How to Block It",
    "short": "Outlook meeting forwarding",
    "description": "Yes—forwarding an Outlook meeting invite sends a forward notification to the organizer. Learn what attendees see and how to turn off Allow Forwarding.",
    "lede": "When an attendee forwards an Outlook meeting invite on Microsoft 365 or Exchange, Outlook adds the recipient to the meeting and sends a Meeting Forward Notification to the organizer (without alerting every other guest). Organizers who want a fixed guest list can uncheck Allow Forwarding in Response Options before sending.",
    "commonBelief": "Turning off Allow forwarding makes a meeting invitation impossible to pass on.",
    "sections": [
      {
        "heading": "What forwarding does",
        "body": [
          "Microsoft describes forwarding as the way to invite someone to a meeting you did not organise. The recipient’s request appears to come from the meeting organiser, and the organiser receives a notification that you forwarded it. Microsoft specifies that classic Outlook sends this meeting forward notification when the recipient was not originally invited.",
          "For a recurring meeting, Microsoft lets you forward just this one occurrence or the entire series. If you are the organiser, Microsoft’s advice is not to forward your own meeting but to add the person as an attendee and send an update."
        ]
      },
      {
        "heading": "Turning forwarding off",
        "body": [
          "As organiser, open Response Options while creating or editing the meeting and clear Allow forwarding. Microsoft says forwarding is allowed by default. Attendees then do not get the forward option. Microsoft limits the organiser’s feature to mailboxes hosted in Microsoft 365 or Exchange Server 2019; check mailbox eligibility as well as the client.",
          "Microsoft lists support for Microsoft 365 users of Outlook for Windows (version 1808 or later on Current Channel, 1902 or later on Semi-Annual Enterprise Channel), Outlook for Mac 16.20 or later, and Outlook on the web for Microsoft 365 and Exchange 2019. It says iOS and Android are not yet supported for this setting."
        ]
      },
      {
        "heading": "What still gets through",
        "body": [
          "Microsoft is explicit that even with forwarding prevented, attendees can still reply or reply all to the invitation with an email message, and copy the meeting message or event. When an attendee uses an older client against an older Exchange version or a third-party service, the forward is handled by servers that do not support the feature, so it cannot be prevented.",
          "Treat Allow forwarding as a guard against casual additions, not as access control. Keep sensitive material out of the invitation body and share documents with named people through their own permissions.",
          "An older attendee client is not enough to establish a bypass. Microsoft says Exchange Online, Exchange 2016 and Exchange 2019 can reject a forwarding attempt even if an older client displays the command. Receiving and enforcing a restriction on mobile is also different from offering the organiser’s setting there."
        ]
      },
      {
        "heading": "Worked example: a recruitment panel",
        "body": [
          "A fictional hiring manager organises a 60-minute panel with three interviewers and does not want the slot passed around. They create the meeting in Outlook on the web, open Response options and clear Allow forwarding, and keep the candidate’s CV out of the invitation, sharing it with the three interviewers separately.",
          "A fourth colleague later needs to join. One interviewer asks the manager instead of forwarding, and the manager adds the colleague as an attendee and sends an update. That keeps the attendee list in the organiser’s hands and avoids relying on forward notifications.",
          "Check: open the meeting and confirm the attendee list matches the people you invited; compare with any forward notifications you received."
        ]
      },
      {
        "heading": "Two special cases",
        "body": [
          "Delegates: Microsoft’s best practice notes that Outlook delegates do not receive meeting forward notifications. If an assistant manages your meetings, check the attendee list rather than expecting a notice.",
          "Shared calendars: Microsoft documented a known issue in which Allow forwarding was missing from Response Options for a meeting on a shared calendar in Outlook for Microsoft 365 versions earlier than Version 2008 Build 13127.20296, fixed in that build; the workaround was to ensure Download Shared folder is checked for the shared mailbox.",
          "If you only want to tell someone about a meeting without inviting them, Microsoft describes dragging the meeting to the Mail icon in classic Outlook to send its details by email; that email does not add the recipient to the meeting."
        ]
      }
    ],
    "comparison": {
      "heading": "Forwarding controls and their limits",
      "columns": [
        "Action",
        "Who it affects",
        "Organiser told?",
        "Limit"
      ],
      "rows": [
        {
          "cells": [
            "Attendee forwards (forwarding allowed)",
            "Adds the recipient as an invitee",
            "Yes, a meeting forward notification in classic Outlook",
            "Delegates do not receive these notifications"
          ]
        },
        {
          "cells": [
            "Organiser clears Allow forwarding",
            "Attendees lose the forward option",
            "—",
            "Replies, copies and older or third-party systems can bypass it"
          ]
        },
        {
          "cells": [
            "Organiser adds attendee and sends update",
            "Adds the person under the organiser’s control",
            "Organiser does it",
            "Recommended instead of forwarding your own meeting"
          ]
        },
        {
          "cells": [
            "Send meeting details by email",
            "Informs without inviting",
            "No",
            "The recipient is not added to the meeting"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "For sensitive meetings, clear Allow forwarding in Response Options before sending.",
      "Keep confidential material out of the invitation body.",
      "Ask attendees to request additions instead of forwarding; add people yourself and send an update.",
      "If a delegate manages your calendar, review the attendee list periodically.",
      "Use an information email, not a forward, to tell someone about a meeting without inviting them."
    ],
    "faq": [
      {
        "q": "If I forward an Outlook meeting invite, does it notify every attendee?",
        "a": "Microsoft documents that forwarding sends a meeting forward notification to the meeting organiser rather than all attendees, while the new recipient receives the invitation."
      },
      {
        "q": "Will I know if someone forwards my meeting?",
        "a": "Microsoft says the organiser receives a meeting forward notification, which classic Outlook sends when the recipient was not originally invited. Delegates do not receive these notifications."
      },
      {
        "q": "Does turning off Allow forwarding stop all sharing of the invite?",
        "a": "No. Microsoft says attendees can still reply with an email or copy the meeting, and forwards through older or third-party systems cannot be prevented."
      },
      {
        "q": "Can I prevent forwarding from the Outlook mobile app?",
        "a": "Microsoft lists iOS and Android as not yet supported for this setting. Use Outlook on the web or the desktop app."
      }
    ],
    "sourcesHeading": "Microsoft Support pages used",
    "sources": [
      {
        "label": "Microsoft: forward a meeting in Outlook",
        "url": "https://support.microsoft.com/en-us/outlook/calendar/forward-a-meeting-in-outlook"
      },
      {
        "label": "Microsoft: prevent forwarding of a meeting",
        "url": "https://support.microsoft.com/en-US/Outlook/prevent-forwarding-of-a-meeting"
      },
      {
        "label": "Microsoft known issue: Allow Forwarding missing for a shared calendar",
        "url": "https://support.microsoft.com/en-us/Support/known-issues/allow-forwarding-option-is-missing-from-response-options-for-a-shared-calendar"
      },
      {
        "label": "Microsoft: best practices for organisations using the Outlook calendar",
        "url": "https://support.microsoft.com/en-us/outlook/best-practices-for-organizations-when-using-the-outlook-calendar"
      },
      {
        "label": "Microsoft: get started with the Outlook calendar",
        "url": "https://support.microsoft.com/en-gb/outlook/get-started-with-the-outlook-calendar"
      }
    ],
    "seeAlso": [
      "what-guests-can-do-to-your-event",
      "keeping-track-of-who-replied",
      "sharing-one-event-not-your-calendar"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here.",
    "galleryAfterContent": true
  },
  "google-calendar-gemini-suggested-meeting-times": {
    "updated": "2026-10-23",
    "title": "Gemini suggested meeting times in Google Calendar: check eligibility and review the result",
    "short": "Gemini suggested meeting times in Google Calendar",
    "description": "Use Google’s eligible desktop suggested-times feature, diagnose unsupported cases and verify the proposed meeting before saving a change.",
    "lede": "Gemini can suggest meeting times in an eligible Google Calendar desktop workflow. A missing suggestion does not necessarily mean a broken account, and a selected suggestion is not proof that every human or room requirement has been settled. Check eligibility first, then review the intended event.",
    "sections": [
      {
        "heading": "Separate a meeting proposal from task automation",
        "body": [
          "This feature helps select a meeting time. It is not a promise to schedule an entire task list, move every conflicting appointment or finish a project. Record the people, duration and date window you actually need before requesting suggestions.",
          "Google requires an eligible Workspace plan and documents this workflow on a computer. Its exclusions include the mobile Calendar apps, events longer than eight hours, too many attendees and a viewed date range in the past. The source does not supply a universal attendee threshold; do not invent one."
        ]
      },
      {
        "heading": "Request suggestions in the actual event",
        "body": [
          "On a computer, create the intended event, add its guests and click Suggested times. Select a proposal or use More suggestions. If you directly edit on the grid, Filter and view can toggle rooms and filter guests by required or optional status. Review the actual saved guest and room fields after choosing.",
          "When rescheduling, open the intended event’s editor rather than creating a competing invitation. Google also describes a possible alternatives banner when several guests decline; the word possible matters. Do not repeatedly recreate an event to force a banner to appear."
        ]
      },
      {
        "heading": "Evaluate a fictional suggestion",
        "body": [
          "A fictional coordinator needs a forty-five-minute design review with two required guests, one optional observer and a particular room. Write those requirements before opening suggestions. If a proposed time is convenient for the required guests but the room is unconfirmed, keep the room decision unresolved.",
          "Compare the suggestion with the event date, duration, time zone, required participants and the resource status through the approved room workflow. A suggested slot and a resource acceptance are different evidence. The table is a review rubric for your own event, not a measured evaluation of Gemini’s accuracy."
        ]
      },
      {
        "heading": "Save and communicate the intended change",
        "body": [
          "After choosing a time, inspect the final event fields and use the organizer’s normal save/update flow. Check the owning calendar and communicate a consequential change to affected people. A person’s previous response to the old time need not settle their attendance at the new time.",
          "If suggestions are absent, record the platform, account eligibility, event length, viewed date window and participant situation before escalating. Use manual supported availability checks when appropriate, rather than broadening calendar access merely to make an AI control appear."
        ]
      }
    ],
    "comparison": {
      "heading": "Fictional design-review acceptance checks",
      "columns": [
        "Requirement",
        "Evidence to inspect",
        "Do not substitute"
      ],
      "rows": [
        {
          "cells": [
            "Required guests",
            "Intended guest list and availability",
            "Only the optional observer’s convenience"
          ]
        },
        {
          "cells": [
            "Meeting interval",
            "Saved date, duration and time zone",
            "A remembered suggestion label"
          ]
        },
        {
          "cells": [
            "Room",
            "Resource response for the new interval",
            "A typed location or suggested slot"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Write the meeting’s actual participant, interval and resource requirements.",
      "Check eligible desktop account and documented exclusions.",
      "Request suggestions inside the intended event.",
      "Verify and save the chosen result through the normal organizer flow."
    ],
    "faq": [
      {
        "q": "Why are suggestions absent in the mobile app?",
        "a": "Google lists its Android, iPhone and iPad Calendar apps among the unsupported cases for this documented feature."
      },
      {
        "q": "Does a suggested time confirm my room reservation?",
        "a": "No. Verify the resource response separately using the owning provider’s supported booking workflow."
      }
    ],
    "sourcesHeading": "Official Google documentation checked",
    "sources": [
      {
        "label": "Google Calendar Help: Let Gemini in Google Calendar find times to meet",
        "url": "https://support.google.com/calendar/answer/16690875?hl=en"
      }
    ],
    "articleLinks": [
      {
        "slug": "automatic-time-blocking-versus-manual-calendar",
        "label": "Distinguish meeting suggestions from task automation"
      },
      {
        "slug": "calendar-event-or-room-reservation",
        "label": "Verify room acceptance"
      },
      {
        "slug": "keeping-track-of-who-replied",
        "label": "Confirm attendance after a schedule change"
      }
    ],
    "seeAlso": [
      "automatic-time-blocking-versus-manual-calendar",
      "calendar-event-or-room-reservation",
      "keeping-track-of-who-replied"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "mac-calendar-caldav-delegation-allow-write": {
    "updated": "2026-10-23",
    "title": "Give a colleague CalDAV calendar-account access in Mac Calendar",
    "short": "CalDAV account delegation on Mac",
    "description": "Configure CalDAV delegation in Mac Calendar for a colleague on the same service. Distinguish account access, Allow Write and one-calendar sharing.",
    "lede": "Connecting a CalDAV account to your Mac does not give a colleague access to it. Apple documents a separate Delegation workflow for people using the same calendar service. Decide whether they need account-level viewing or writing before changing that relationship.",
    "sections": [
      {
        "heading": "Choose account delegation or one-calendar sharing",
        "body": [
          "A fictional coordinator manages several calendars on a company CalDAV service. A substitute needs to maintain the coordinator’s schedule during an absence. Account delegation is a broader task than subscribing to one public timetable or sharing one calendar with a reader.",
          "Apple’s Mac guide distinguishes individual-calendar sharing from giving another person access to the calendar account. Its delegation procedure requires people using the same CalDAV or Exchange service. This page follows the CalDAV path; it is not a promise that arbitrary Google, iCloud and external accounts share one universal delegation setting."
        ]
      },
      {
        "heading": "Use the owning account’s Delegation controls",
        "body": [
          "In Calendar on Mac, choose Calendar > Settings > Accounts and select the intended calendar account. Click Delegation, then Edit and the add button. Enter the colleague’s name and select the matching person offered by that service.",
          "For CalDAV, Apple identifies Allow Write as the checkbox permitting edits to your calendars. Decide deliberately whether that authority is needed. Viewing, changing an event and managing who else can use a service are different responsibilities; do not substitute a shared password for the supported relationship."
        ]
      },
      {
        "heading": "Have the recipient inspect the access they received",
        "body": [
          "Apple separately documents Calendar > Settings > Accounts > Delegation for viewing accounts available to you. A CalDAV account appears in Accounts I can access. Have the substitute check the intended account rather than treating an email or familiar event title as proof. Select Show to display the delegated account’s calendars in the main Calendar window.",
          "For the fictional handover, use an agreed harmless appointment to distinguish reading from an authorized small edit. Check the owner-side saved record. These are suggested verification steps, not an account test performed for this article."
        ]
      },
      {
        "heading": "Keep a bounded handover record",
        "body": [
          "Record the service, account owner, substitute identity, whether writing was intended and the agreed review date. Use the service’s supported controls and administrator guidance for later changes; this article does not invent an account-removal or revocation button not established by the linked documentation.",
          "Cloud Calendars sharing roles and a CalDAV account added through iPhone settings are separate mechanisms. This Mac-native delegation does not prove the substitute can use every app or bypass workplace policy. Verify the exact service and access route needed for the job."
        ]
      }
    ],
    "comparison": {
      "heading": "Fictional substitute-coordinator handover",
      "columns": [
        "Need",
        "Relationship to investigate",
        "Verification"
      ],
      "rows": [
        {
          "cells": [
            "Follow one public schedule",
            "Read-only subscription",
            "Published timetable appears"
          ]
        },
        {
          "cells": [
            "Collaborate on one calendar",
            "Individual-calendar sharing",
            "Intended calendar and role"
          ]
        },
        {
          "cells": [
            "Maintain an account on the same CalDAV service",
            "Delegation with appropriate Allow Write choice",
            "Accounts I can access and harmless authorized edit"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Identify the account owner and the same-service colleague.",
      "Decide whether account delegation is broader than the task requires.",
      "Use Accounts > Delegation > Edit and inspect Allow Write.",
      "Have the recipient check the intended account and permitted action."
    ],
    "faq": [
      {
        "q": "Is adding a CalDAV account on my own phone delegation?",
        "a": "No. Connecting your device and granting another person access are different operations."
      },
      {
        "q": "Does Allow Write merely let someone read the calendar?",
        "a": "Apple identifies it as the CalDAV option that lets that person edit your calendars. Choose it only when writing is intended."
      }
    ],
    "sourcesHeading": "Apple documentation checked for this workflow",
    "sources": [
      {
        "label": "Apple: subscribe to calendars and choose subscription location",
        "url": "https://support.apple.com/guide/calendar/share-calendars-icl32362/mac"
      },
      {
        "label": "Apple: manage calendar accounts you can access",
        "url": "https://support.apple.com/guide/calendar/manage-shared-calendars-icl27527/mac"
      }
    ],
    "articleLinks": [
      {
        "slug": "caldav-calendar-on-iphone",
        "label": "Connect a device without confusing delegation"
      },
      {
        "slug": "a-calendar-that-is-yours-to-share",
        "label": "Choose the correct collaboration relationship"
      },
      {
        "slug": "who-can-see-what-in-google-calendar",
        "label": "Keep provider-specific permissions distinct"
      }
    ],
    "seeAlso": [
      "caldav-calendar-on-iphone",
      "a-calendar-that-is-yours-to-share",
      "who-can-see-what-in-google-calendar"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here.",
    "galleryAfterContent": true
  },
  "google-calendar-alternate-calendar-moon-sports": {
    "updated": "2026-10-23",
    "title": "Google alternate dates, Moon phases or sports: choose the right calendar source",
    "short": "Google alternate dates, Moon phases or sports",
    "description": "Choose Google’s alternate date display or an added Moon/sports calendar, then verify the schedule without moving existing appointments.",
    "lede": "An alternate date label and an additional calendar source do different jobs. In Google Calendar, lunar or solar date displays, Moon phases and sports schedules use different controls. Identify which result you want before adding sources or changing the date of an existing appointment.",
    "sections": [
      {
        "heading": "Name the desired change to the view",
        "body": [
          "A fictional household wants to read an alternate date alongside its usual dates and follow one team’s fixtures. Those are two separate requirements. Changing how a day is labelled is not the same as subscribing to a list of events.",
          "Write a small view inventory: ordinary appointments, alternate date labels, Moon-phase entries if wanted, and the chosen team schedule. Do not put a new date system into an event title simply to reproduce a display setting, or move an existing appointment because its secondary label looks unfamiliar."
        ]
      },
      {
        "heading": "Use the matching Google control",
        "body": [
          "On a computer, Google documents Settings > View options > Alternate calendars for the lunar or solar display; choose None to remove it. For separate event sources, use Settings > Add calendar > Browse calendars of interest. There, select “Phases of the Moon” or open a sports category and select the intended team.",
          "Choose one change at a time and return to the calendar. Inspect the selected source name and a known date. Adding a sports category does not establish that every league or team you need is available; use the actual offered list and an official fixture source to check the intended team."
        ]
      },
      {
        "heading": "Reconcile a sample week",
        "body": [
          "For the household, choose one existing appointment with an unambiguous written date. After enabling the alternate date display, verify that appointment still belongs to the same day. Then select the team calendar and inspect one fixture’s team identity, date and time.",
          "Record whether the new information is a label or an event from a selected source. If the view is crowded, remove or deselect the intended optional item rather than deleting the household’s appointment. The table is an organizing worksheet, not a claim that every source follows the same update timing."
        ]
      },
      {
        "heading": "Keep date display separate from forecasts and commitments",
        "body": [
          "A Moon-phase entry describes the source’s calendar information; it does not turn a calendar into a local weather forecast. A sports fixture is not a personal attendance commitment or a reservation. Add your own travel or attendance planning only after confirming the actual arrangement.",
          "Apple Calendar and Cloud Calendars can expose different display controls and sources. The linked language/alternate-calendar guide explains why a device setting should not be assumed to govern every app. Use this page for Google’s specific source-selection task."
        ]
      }
    ],
    "comparison": {
      "heading": "The fictional household’s view inventory",
      "columns": [
        "Need",
        "Type of change",
        "Verification"
      ],
      "rows": [
        {
          "cells": [
            "Read another date system",
            "Alternate date display",
            "Same appointment remains on its intended day"
          ]
        },
        {
          "cells": [
            "See Moon phases",
            "Added calendar information",
            "Correct selected source"
          ]
        },
        {
          "cells": [
            "Follow one team",
            "Sports schedule source",
            "Actual team, fixture date and time"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Separate a secondary date label from an additional event source.",
      "Use the documented Google control for that type.",
      "Add one source at a time and inspect a known appointment.",
      "Confirm fixtures independently before making attendance or travel commitments."
    ],
    "faq": [
      {
        "q": "Does an alternate calendar move my existing appointment?",
        "a": "Treat the setting as a display choice and verify the unchanged saved date. Rescheduling is a separate event-editing operation."
      },
      {
        "q": "Is a Moon-phase calendar a weather forecast?",
        "a": "No. Keep astronomical calendar information and a location-specific forecast as different sources and planning questions."
      }
    ],
    "sourcesHeading": "Official Google documentation checked",
    "sources": [
      {
        "label": "Google Calendar Help: Add or remove alternate calendars",
        "url": "https://support.google.com/calendar/answer/13748650?hl=en"
      }
    ],
    "articleLinks": [
      {
        "slug": "iphone-calendar-language-alternate-calendar-settings",
        "label": "Separate labels, language and saved event dates"
      },
      {
        "slug": "time-zones-and-the-flight-you-booked",
        "label": "Verify event times when following distant fixtures"
      },
      {
        "slug": "weather-calendar-history-versus-forecast-iphone",
        "label": "Distinguish calendar information from a forecast"
      }
    ],
    "seeAlso": [
      "iphone-calendar-language-alternate-calendar-settings",
      "time-zones-and-the-flight-you-booked",
      "weather-calendar-history-versus-forecast-iphone"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "google-appointment-email-verification": {
    "updated": "2026-10-23",
    "title": "Google appointment email verification: what guests must do and what it proves",
    "short": "Google appointment email verification",
    "description": "Enable eligible Google booking email verification and check the signed-in and guest journeys without treating a PIN as identity proof.",
    "lede": "Google appointment email verification checks access to an email inbox during booking. The journey differs for someone already signed into a Google Account. Check those two paths before telling every customer to wait for a PIN or assuming that one verification step establishes a person’s identity.",
    "sections": [
      {
        "heading": "Decide what problem this control addresses",
        "body": [
          "A fictional workshop organizer wants fewer unwanted bookings. Write the limited goal as confirm access to the supplied inbox, not prove the customer’s legal identity or guarantee attendance. Keep payment, appointment availability and cancellation decisions outside this verification check.",
          "Google requires an eligible Workspace subscription and says verification is initially off. Before advertising the step to guests, inspect the relevant schedule and account. Do not treat a missing control as evidence that every Google booking page offers the same plan features."
        ]
      },
      {
        "heading": "Enable the schedule’s booking-form option",
        "body": [
          "On a computer, create or edit the intended appointment schedule. Under Booking form, check “Require email verification” and click Save. Unchecking that same box disables it for that schedule. Inspect the actual schedule rather than changing another service with a similar name.",
          "Write a short customer instruction appropriate to the actual form. If you are checking it with a colleague, agree a harmless booking and remove it through the documented cancellation route afterwards. Do not collect the colleague’s sign-in password or verification code to perform the check for them."
        ]
      },
      {
        "heading": "Compare the two guest journeys",
        "body": [
          "For a guest without a Google sign-in, Google describes entering an email address, obtaining a PIN from that inbox, entering it on the booking page and submitting. A signed-in Google user receives prefilled booking details and is not asked to submit a PIN.",
          "For the fictional organizer, record the two journeys separately: visitor state, displayed email, whether a PIN was requested, and whether the intended booking completed. The absence of a PIN for a signed-in visitor is not enough to diagnose a broken setting. These are suggested observations, not results measured for this article."
        ]
      },
      {
        "heading": "Keep booking confirmation separate",
        "body": [
          "Once the form is submitted, check the actual appointment confirmation and intended time. Inbox access is not proof that the person will attend, that a payment cleared, or that all private details should be shared with them.",
          "If a guest cannot finish, ask which step stopped: email entry, inbox delivery, code entry or confirmation. Request only the information needed to locate the failure. They should enter any code themselves; a support conversation does not need a copy of it."
        ]
      }
    ],
    "comparison": {
      "heading": "Verification-path worksheet",
      "columns": [
        "Visitor state",
        "Documented verification behavior",
        "Record separately"
      ],
      "rows": [
        {
          "cells": [
            "Signed into a Google Account",
            "Prefilled details; no PIN submission requested",
            "Intended email and completed appointment"
          ]
        },
        {
          "cells": [
            "Guest without Google sign-in",
            "Inbox PIN entered on booking page",
            "Form step reached and confirmation"
          ]
        },
        {
          "cells": [
            "Organizer reviewing the outcome",
            "Checks saved booking",
            "Attendance or payment, if relevant"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Check account eligibility and the intended appointment schedule.",
      "Save the booking-form verification choice.",
      "Compare signed-in and guest paths without exchanging credentials.",
      "Check the booking confirmation independently of inbox access."
    ],
    "faq": [
      {
        "q": "Why did a guest not receive a PIN?",
        "a": "A signed-in Google user is not asked to submit a PIN in the documented flow. Establish the visitor’s sign-in state before diagnosing delivery."
      },
      {
        "q": "Does the PIN guarantee the customer will attend?",
        "a": "No. Treat inbox access, appointment confirmation and later attendance as separate observations."
      }
    ],
    "sourcesHeading": "Official Google documentation checked",
    "sources": [
      {
        "label": "Google Calendar Help: Verify emails for appointments",
        "url": "https://support.google.com/calendar/answer/11902347?hl=en"
      }
    ],
    "articleLinks": [
      {
        "slug": "booking-link-or-shared-calendar",
        "label": "Check that the URL is a booking page"
      },
      {
        "slug": "keeping-track-of-who-replied",
        "label": "Keep confirmation separate from attendance"
      },
      {
        "slug": "sharing-one-event-not-your-calendar",
        "label": "Use an invitation for an already arranged event"
      }
    ],
    "seeAlso": [
      "booking-link-or-shared-calendar",
      "keeping-track-of-who-replied",
      "sharing-one-event-not-your-calendar"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "google-appointment-schedule-which-calendars-block-booking-slots": {
    "updated": "2026-10-23",
    "title": "Google appointment schedule: which calendars and events block a booking slot",
    "short": "Why a booking slot is open or hidden",
    "description": "Diagnose why a Google appointment schedule shows or hides a slot: conflict calendars, Busy vs Free events, RSVPs, all-day events and date exceptions.",
    "lede": "A booking page is only as trustworthy as its availability settings and the calendars it checks. An unexpected open or missing slot can have several causes. This diagnostic concerns Google appointment schedules; Arte Soft develops Cloud Calendars and does not run Google’s booking pages.",
    "commonBelief": "A booking page automatically avoids everything I can see in my calendar view.",
    "sections": [
      {
        "heading": "What Google says blocks a slot",
        "body": [
          "First confirm that “Check calendars for availability” is enabled on the appointment schedule. Google says that when availability checks are off, other Busy events do not protect those time blocks, even if you accepted the event. A booked appointment slot still cannot be booked twice. After checking that switch, inspect which calendars are selected for conflict checks.",
          "Google states that appointment times during events set to Busy do not appear on the booking page, and that no times appear on a day with an all-day event set to Busy. It also says that an event you have RSVPed Yes or Maybe to, or any busy event in a calendar reviewed for conflicts, does not appear as open.",
          "The calendars reviewed are, in Google’s words, your primary calendar and any calendars you own, manage or are subscribed to — but only those you select. Open the schedule, choose Edit appointment schedule, then Calendars, and tick the calendars to check for conflicts. Google notes that checking secondary calendars requires an eligible Google Workspace or Google One plan, and that a schedule created on a shared calendar may not let you select other calendars."
        ]
      },
      {
        "heading": "Where Google’s pages disagree: tentative and Maybe",
        "body": [
          "One Google page says Yes and Maybe responses block time. Another says unaccepted or tentative Google Calendar events do not block appointment availability. These may describe different states, but the wording overlaps. Do not rely on a Maybe response to protect a slot. If the time matters, put a Busy event on a checked calendar or use adjusted availability."
        ]
      },
      {
        "heading": "Date exceptions and booking rules",
        "body": [
          "For holidays and unusual days, use adjusted availability rather than rewriting the weekly pattern. Google lets you choose specific dates where you are more or less available, and Unavailable all day for a date you cannot take bookings. Adjustments can also cover dates outside a recurring schedule with start and end dates.",
          "Other settings hide slots for reasons unrelated to conflicts. Google applies a 4-hour minimum notice by default, and you can set a maximum number of bookings per day and buffer time between appointments. A slot that looks free on your calendar may still be hidden because of one of these rules."
        ]
      },
      {
        "heading": "Worked example: a tutor’s Tuesday",
        "body": [
          "In this fictional example, a tutor offers 30-minute sessions from 15:00 to 18:00 on their primary calendar. Assume availability checks are enabled, no extra buffer or daily limit has been reached, and no other holds apply. They also own a Family calendar and subscribe to a School term dates calendar, but only the primary calendar is selected for conflict checks.",
          "On Tuesday a Family event “Pick-up” 16:00–16:30 is marked Busy, but the 16:00 slot still appears, because Family is not checked. A primary-calendar event “Lunch with Sam” at 15:00 marked Free also leaves 15:00 open. A team meeting at 17:00 accepted with Maybe may or may not block 17:00, given the conflicting Google wording. And at 13:00 the same day, nothing before 17:00 can be booked because of the default 4-hour notice.",
          "Check the master availability switch, then select Family under Calendars if the plan permits checking secondary calendars. Change the lunch to Busy only if it should genuinely protect that time. Use an explicit Busy hold or adjusted availability for 17:00 instead of relying on the unresolved Maybe wording, and decide whether the four-hour notice suits the service. Reload the booking page as a visitor after each change and compare the actual slots."
        ]
      },
      {
        "heading": "Verify the fix from the visitor’s side",
        "body": [
          "Your own calendar view is not the test. Open the booking page link as a visitor, check the specific day and time, and compare with a list of what you expect to see. Repeat after each change; changing several settings at once makes it hard to tell which one mattered.",
          "If a client has already booked a slot that should have been blocked, the booking exists independently of your corrected settings. Contact them and use Google’s cancellation or rescheduling route for that appointment rather than deleting the event silently."
        ]
      }
    ],
    "comparison": {
      "heading": "Slot diagnosis",
      "columns": [
        "What you see",
        "Likely cause (per Google)",
        "Check or fix"
      ],
      "rows": [
        {
          "cells": [
            "Slots open over Busy events despite the intended calendar selection",
            "Check calendars for availability may be off",
            "Verify the master switch before changing calendar selection or events"
          ]
        },
        {
          "cells": [
            "Slot open over a busy personal event",
            "Event’s calendar not selected for conflicts, or plan does not allow secondary calendars",
            "Edit appointment schedule → Calendars; check plan eligibility"
          ]
        },
        {
          "cells": [
            "Slot open over an event in a checked calendar",
            "Event is marked Free",
            "Set the event to Busy"
          ]
        },
        {
          "cells": [
            "Whole day missing",
            "An all-day Busy event, or Unavailable all day in adjusted availability",
            "Make the all-day event Free if it should not block; review adjusted availability"
          ]
        },
        {
          "cells": [
            "Near-term slots missing",
            "Minimum notice (4 hours by default)",
            "Adjust the scheduling window"
          ]
        },
        {
          "cells": [
            "Later slots missing on a busy day",
            "Maximum bookings per day reached, or buffer time",
            "Review booked appointment settings"
          ]
        },
        {
          "cells": [
            "Cannot choose other calendars",
            "Schedule was created on a shared calendar",
            "Check schedule ownership and plan eligibility. If a replacement schedule is needed, verify its conflict checks before retiring the existing page or affecting bookings."
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "List the calendars that hold commitments you must protect.",
      "Confirm Check calendars for availability is on, then select the calendars to check; verify eligibility for secondary calendars.",
      "Mark events that should block as Busy, including all-day ones; do not rely on Maybe responses.",
      "Use adjusted availability for holidays instead of editing the weekly pattern.",
      "Reload the booking page as a visitor after each change and compare with your expected slots."
    ],
    "faq": [
      {
        "q": "Does my booking page check every calendar I can see?",
        "a": "No. First enable Check calendars for availability, then select eligible calendars for conflicts. The primary and calendars you own, manage or subscribe to can be considered; secondary-calendar checks require an eligible plan. Viewing a calendar in your own grid is not enough."
      },
      {
        "q": "Why can a client book during my Free-marked lunch?",
        "a": "A Free-marked personal event is not a Busy hold. Check that availability checking is enabled, the correct calendar is reviewed, and the event’s Busy/Free state matches your intention. For Maybe or tentative responses, Google’s two cited help pages differ; verify visitor-side output rather than relying on that response alone."
      },
      {
        "q": "How do I close the page for a bank holiday without changing every week?",
        "a": "Use adjusted availability for that date and choose Unavailable all day."
      }
    ],
    "sourcesHeading": "Google Calendar Help pages used",
    "sources": [
      {
        "label": "Google: check your availability across calendars",
        "url": "https://support.google.com/calendar/answer/16287054?hl=en"
      },
      {
        "label": "Google: update your availability for appointments",
        "url": "https://support.google.com/calendar/answer/11423292?hl=en"
      },
      {
        "label": "Google: create an appointment schedule",
        "url": "https://support.google.com/calendar/answer/10729749?hl=en"
      }
    ],
    "seeAlso": [
      "booking-link-or-shared-calendar",
      "what-an-all-day-event-really-means",
      "work-and-personal-without-two-apps"
    ],
    "articleLinks": [
      {
        "slug": "booking-link-or-shared-calendar",
        "label": "Decide whether a booking page is the right tool"
      }
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here.",
    "galleryAfterContent": true
  },
  "google-calendar-birthdays-from-contacts": {
    "updated": "2026-10-23",
    "title": "Google Calendar birthdays: check the contact, manual entry and account behind a date",
    "short": "Find the source of a Google birthday",
    "description": "Distinguish Contacts-linked and manual Google birthdays. Check mobile edits, multiple accounts and hiding before changing contact data.",
    "lede": "A birthday on Google Calendar can be manually created or linked to Google Contacts. Find the source and Google account before changing a date or removing a duplicate-looking row. Hiding the Birthdays calendar and turning off contact sync have different effects. Arte Soft develops Cloud Calendars.",
    "commonBelief": "If a birthday is wrong, I should edit or delete the calendar event.",
    "sections": [
      {
        "heading": "Find the source before choosing an edit",
        "body": [
          "Google explicitly distinguishes manually created birthdays from birthdays imported from Contacts. For a Contacts-linked birthday, you can edit the birthday in Google Contacts or the Android Contacts app. Google also documents editing linked birthdays in the Google Calendar app on Android, iPhone and iPad;those edits also apply to Google Contacts. Do not assume Calendar is always a display-only destination.",
          "Deleting a birthday from Calendar does not change the stored birthday in Contacts. Editing a linked birthday and deleting its Calendar entry are therefore different operations. Compare the actual contact and account before deciding which result you need."
        ]
      },
      {
        "heading": "Hide or recolour without losing anything",
        "body": [
          "To hide all birthdays, hover over Birthdays in the calendar list and uncheck the box. To change their colour, hover over Birthdays, open Options and pick a colour. Both are display choices; the contact data stays as it is."
        ]
      },
      {
        "heading": "The setting that removes more than birthdays",
        "body": [
          "Turning off Sync from Contacts is more than hiding the list. Google warns that it removes synced Calendar events, including birthdays, important dates and changes made to them. Contact information remains in Contacts. Do not toggle it merely to see whether duplicate-looking rows disappear.",
          "For multiple Google accounts, Google documents Settings > Birthdays > Sync from Contacts, with a checkbox beside each account. Inspect which accounts contribute birthdays before changing anything. If you only want a temporary uncluttered view, unchecking the Birthdays calendar hides both manual and imported birthdays without using those account-sync removal controls."
        ]
      },
      {
        "heading": "Worked example: a wrong date and a duplicate",
        "body": [
          "In this fictional example, a person’s contact birthday is 4March, but the user confirms the correct date is 3April. They first identify the Google account holding that contact. They can correct the linked birthday in Google Contacts, or use the supported mobile Calendar edit and check the resulting contact. Simply deleting the Calendar entry would not correct the source birthday.",
          "If two rows remain on 3April, the user checks which selected accounts supply Contacts birthdays and whether they had also created a manual birthday. Two contact records are only one possibility, not a diagnosis. They preserve both calendars and contacts while identifying the sources;they do not merge or delete contacts merely because two rows look alike.",
          "For a useful before-and-after record, note the selected Google accounts, the intended birthday and whether it is manual or Contacts-linked. Check both Calendar and the relevant contact after a supported linked edit. If choosing to remove an account’s synced Calendar entries, review the documented consequences first rather than assume the change is a reversible visual filter."
        ]
      }
    ],
    "comparison": {
      "heading": "What each action does",
      "columns": [
        "Action",
        "Where",
        "Effect"
      ],
      "rows": [
        {
          "cells": [
            "Correct a Contacts-linked birthday",
            "Google Contacts or supported mobile Google Calendar linked edit",
            "A Calendar linked edit also changes the contact;verify the intended account"
          ]
        },
        {
          "cells": [
            "Remove only the Calendar birthday entry",
            "Calendar delete",
            "Does not change birthday data in Google Contacts"
          ]
        },
        {
          "cells": [
            "Hide all birthday rows",
            "Uncheck Birthdays in Calendar list",
            "Hides manual and imported birthday rows"
          ]
        },
        {
          "cells": [
            "Change birthday colour",
            "Birthdays > Options",
            "Display choice"
          ]
        },
        {
          "cells": [
            "Stop one account’s imported entries",
            "Settings > Birthdays > Sync from Contacts",
            "Removes that account’s synced Calendar entries;contact information remains"
          ]
        },
        {
          "cells": [
            "Investigate duplicate-looking rows",
            "Compare selected accounts and known manual/contact sources",
            "Do not infer duplicate contacts or merge them as a test"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Identify whether the birthday is manual or Contacts-linked and which Google account owns its source.",
      "For a linked date correction, use Google Contacts or the supported mobile Calendar edit, then verify the contact.",
      "Inspect selected accounts and known manual entries before diagnosing duplicate-looking birthdays.",
      "Use the Birthdays list checkbox for temporary hiding;do not use Sync from Contacts as a harmless visual test.",
      "Keep source records while verifying any change;do not merge contacts only to remove duplicate-looking calendar rows."
    ],
    "faq": [
      {
        "q": "I deleted a birthday from Calendar. Is it gone from my contact?",
        "a": "No. Google says deleting a birthday from Calendar does not affect what is stored in Google Contacts."
      },
      {
        "q": "How do I stop seeing birthdays without losing them?",
        "a": "Uncheck the Birthdays calendar in the list to hide its manual and imported entries. Turning off Sync from Contacts instead removes synced Calendar entries and their changes;the underlying contact information remains in Contacts."
      },
      {
        "q": "Can I fix a linked birthday directly in the Google Calendar app?",
        "a": "Google documents this on Android, iPhone and iPad:editing a Contacts-linked birthday in Calendar also changes Google Contacts. Identify the intended account first."
      }
    ],
    "sourcesHeading": "Google Calendar Help page used",
    "sources": [
      {
        "label": "Google: manage birthdays on your calendar",
        "url": "https://support.google.com/calendar/answer/13748346?hl=en"
      }
    ],
    "seeAlso": [
      "what-an-all-day-event-really-means",
      "change-calendar-color-iphone",
      "calendar-notifications-missing-silent-or-duplicated"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here.",
    "articleLinks": [
      {
        "slug": "outlook-birthday-calendar-from-contacts",
        "label": "Outlook birthdays"
      }
    ]
  },
  "google-calendar-find-a-time-blank-is-not-free": {
    "updated": "2026-10-23",
    "title": "Google Calendar Find a time: a blank column does not mean the guest is free",
    "short": "Reading Find a time correctly",
    "description": "Before booking into a gap in Google Calendar’s Find a time, check calendar sharing, private Free events and the 50-guest limit. A blank can mean no access.",
    "lede": "Find a time lays guests’ calendars side by side so you can spot a common gap. The trap is that it can only draw what each guest has shared with you. This guide gives a short diagnostic for deciding whether a gap is real before you send the invitation.",
    "commonBelief": "If Find a time shows nothing for a guest at 15:00, they are free at 15:00.",
    "sections": [
      {
        "heading": "How Find a time works, per Google",
        "body": [
          "On a computer, choose Create, then Event, add guests and open Find a time. Google documents availability comparison for up to 50 guests; beyond that, only 50 schedules are shown. Filter and view lets you choose No guests, Required guests or All guests and show or hide rooms.",
          "The key condition is Google’s own: these guests must have shared their calendars with you. If a person does not share their calendar with you, Google says you can send them a request to share it. Rooms are added with Add rooms or Add room booking.",
          "A separate workflow puts subscribed calendars in dedicated columns in the main calendar grid: Settings > View options > View calendars side by side in Day View, then use Day view. That persistent subscribed-calendar setting is not a Find a time control."
        ]
      },
      {
        "heading": "Four reasons a gap may not be free",
        "body": [
          "No access. A guest who has not shared a calendar with you has nothing to draw. Their column can look empty without telling you anything about their day.",
          "Private details and Free time. The event’s privacy, availability and your permission affect what is visible. Google explicitly documents hidden Private, Free items for the restricted-editor permission. A blank column does not reveal whether an unseen private appointment exists, and that role-specific display rule should not be projected onto every viewer.",
          "Not on a shared calendar. You see only what the guest shared. Commitments they keep on other calendars, or in another account, are outside the view.",
          "Over 50 guests. Beyond 50, Google shows only 50 schedules. A large invitation’s comparison is necessarily partial; use the Required guests filter to focus on people whose attendance decides the time."
        ]
      },
      {
        "heading": "Worked example: five guests plus the organiser",
        "body": [
          "A fictional organiser needs one hour on Thursday with four colleagues and an external consultant. Find a time shows three colleagues busy 10:00–12:00 and free 14:00–15:00. The fourth colleague’s column is empty all day. The consultant, outside the organisation, also shows nothing.",
          "The organiser does not treat 14:00 as agreed. They check whether the fourth colleague shares their calendar; they do not, so the organiser requests access or simply asks. The consultant’s availability is unknown, so the organiser sends two candidate times by message before inviting. Once both reply, the organiser books 14:00 and adds a room through Add room booking.",
          "Result check: after sending, open the event and watch the responses. A Yes from each required guest, not the empty column, confirms the slot."
        ]
      },
      {
        "heading": "Make your own calendar readable to schedulers",
        "body": [
          "If colleagues keep booking over you, the fix is on your side. Share your calendar with at least free/busy access with the people who schedule you, and mark private appointments Busy rather than Free so they show as blocks without details. Workspace users can also set working hours and a working location, which Google says people with free/busy access can see.",
          "Check your own sharing in your calendar’s settings and, if you are on a work or school account, remember that an administrator may limit the sharing options available."
        ]
      }
    ],
    "comparison": {
      "heading": "Diagnosing an empty column",
      "columns": [
        "Check",
        "If yes",
        "Next step"
      ],
      "rows": [
        {
          "cells": [
            "Has this guest shared a calendar with you?",
            "Gaps are at least partly meaningful",
            "Continue to the next checks"
          ]
        },
        {
          "cells": [
            "No sharing at all",
            "The column carries no information",
            "Request access or ask the guest directly"
          ]
        },
        {
          "cells": [
            "Could privacy, availability or your permission hide useful information?",
            "An apparently empty view may be incomplete",
            "Check the sharing context or ask the guest; do not infer a particular hidden event"
          ]
        },
        {
          "cells": [
            "More than 50 guests on the event?",
            "Only 50 schedules are shown",
            "Filter to Required guests"
          ]
        },
        {
          "cells": [
            "Is the guest external?",
            "Their identity alone does not establish whether anything is shared",
            "Check the actual sharing relationship or agree candidate times directly"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Add guests, then open Find a time and switch to Required guests.",
      "For each empty column, check whether that person shares a calendar with you.",
      "Request access or ask directly when a column is blank.",
      "Treat the invitation responses, not the gap, as confirmation.",
      "Share at least free/busy and mark private appointments Busy so others can schedule around you."
    ],
    "faq": [
      {
        "q": "Why does one colleague always look free in Find a time?",
        "a": "Missing calendar sharing is one possible explanation; a blank view does not establish it. Google’s comparison depends on the calendars shared with you and the available permission. Check the relationship or ask the colleague directly."
      },
      {
        "q": "Can Find a time see private appointments?",
        "a": "It shows what the calendar permission and event visibility allow. Busy time can be visible without private details. Google’s explicit hidden Private, Free rule concerns the restricted-editor role; do not assume a blank column proves the guest is free or that a private appointment exists."
      },
      {
        "q": "Is there a guest limit?",
        "a": "Google compares availability for up to 50 guests; beyond that only 50 schedules are shown."
      }
    ],
    "sourcesHeading": "Google Calendar Help pages used",
    "sources": [
      {
        "label": "Google: find times to meet in Google Calendar",
        "url": "https://support.google.com/calendar/answer/6294878?hl=en"
      },
      {
        "label": "Google: choose what others can do with your calendar",
        "url": "https://support.google.com/calendar/answer/15716974?hl=en"
      },
      {
        "label": "Google: change event and task visibility",
        "url": "https://support.google.com/calendar/answer/34580?hl=en"
      },
      {
        "label": "Google: set your working location",
        "url": "https://support.google.com/calendar/answer/18616218?hl=en&co=GENIE.Platform%3DDesktop"
      }
    ],
    "seeAlso": [
      "who-can-see-what-in-google-calendar",
      "keeping-track-of-who-replied",
      "calendar-event-or-room-reservation",
      "booking-link-or-shared-calendar"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here.",
    "galleryAfterContent": true
  },
  "google-calendar-meeting-notes-not-updating": {
    "updated": "2026-10-23",
    "title": "Google Calendar meeting notes not updating? The document is not a live event mirror",
    "short": "Meeting notes and event changes",
    "description": "Check why Google meeting notes retain an old time or guest list. Separate document content, event attachments and Drive access before correcting them.",
    "lede": "A Google Doc created as meeting notes can keep an old attendee list after the event changes. Google documents that meeting-note content and Calendar event details do not update one another. Check both records before inviting someone or correcting the schedule.",
    "sections": [
      {
        "heading": "Identify three separate things",
        "body": [
          "The Calendar event owns its time and guest list. A meeting-notes document contains text that can be pre-populated with event details. The attachment connects the event to the document. That connection does not make the two records a continuously synchronized pair.",
          "Google’s attachment guide gives explicit examples: changing the document’s attendee list does not invite new people; changing its title does not rename the Calendar event; and changing the event does not update the details already placed in the notes. A useful agenda can therefore contain outdated metadata without the event itself being wrong."
        ]
      },
      {
        "heading": "Work through a rescheduled meeting",
        "body": [
          "Imagine a fictional workshop first scheduled for 10:00 with Alex and Morgan. Its organizer creates meeting notes, then moves the Calendar event to 11:00 and adds Sam. The organizer should inspect the event at 11:00 and its actual guest list, then separately update the document’s copied time and participant text where necessary.",
          "Adding “Sam” to a document is not an invitation. Conversely, inviting Sam does not prove Sam can open the attached file. Check the actual event invitation and the document’s Drive sharing from Sam’s intended account. The comparison table separates these actions so one successful edit is not mistaken for all three."
        ]
      },
      {
        "heading": "Create or attach notes through the supported route",
        "body": [
          "Google documents creating meeting notes from Calendar on a computer. For a new event, the Create meeting notes action in the description/attachment area makes a pre-populated document and attaches it when saved. Existing events need permission to modify the event; Google also notes that another already-attached meeting-notes document can prevent creating a second one through that action.",
          "In Google Docs, an @ meeting-notes insertion can add event details to the document. Google distinguishes the organizer’s Share & attach route from a non-organizer’s Share route: the latter shares the document without attaching it to the event. A document mentioning the meeting is therefore not proof that every guest can find it from Calendar."
        ]
      },
      {
        "heading": "Review file sharing without widening the calendar",
        "body": [
          "Calendar attachments are stored in Google Drive. Google offers different sharing choices when saving an event with guests who lack access, including sharing with event guests or saving without sharing. In the latter case, a guest can see the file title yet be unable to open it.",
          "Choose the intended file audience and access level deliberately. Do not make the whole calendar public to fix a Drive permission issue. File names can themselves be visible to people with event-detail access, so use an appropriate title even when the document body is restricted."
        ]
      },
      {
        "heading": "Use the owning service for the repair",
        "body": [
          "This page describes Google Calendar and Google Docs behavior, not a new Cloud Calendars meeting-notes editor. Correct the real schedule and invitations in Calendar, document text in Docs, and file permissions in Drive. An iPhone calendar view is not evidence that those three settings match.",
          "For a repeatable check, record the event’s current time and guests, the document’s copied details, whether the document is attached, and whether the intended guest can open it. Use a harmless example with a consenting colleague; no firsthand app test is claimed here."
        ]
      }
    ],
    "comparison": {
      "heading": "Illustrative workshop changed from 10:00 to 11:00",
      "columns": [
        "Desired change",
        "Where to change it",
        "What that does not establish"
      ],
      "rows": [
        {
          "cells": [
            "Move workshop to 11:00",
            "Calendar event",
            "Notes text has changed"
          ]
        },
        {
          "cells": [
            "Add Sam as an attendee",
            "Calendar guest list",
            "Sam can open the Drive file"
          ]
        },
        {
          "cells": [
            "Correct copied time and attendee text",
            "Meeting-notes document",
            "A new invitation was sent"
          ]
        },
        {
          "cells": [
            "Allow Sam to read the notes",
            "Drive sharing for the file",
            "Sam was added to the Calendar event"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Check the authoritative event time and guest list in Calendar.",
      "Compare copied details in the meeting-notes document.",
      "Verify that the intended document is actually attached.",
      "Check Drive access using the intended recipient identity.",
      "Correct each record separately rather than treating the document as a live mirror."
    ],
    "faq": [
      {
        "q": "Will adding someone to the notes invite them?",
        "a": "No. Google says updating the document attendee list does not automatically invite people to the Calendar event."
      },
      {
        "q": "Why can a guest see the document title but not open it?",
        "a": "Calendar event visibility and Drive file access are separate. Ask the file owner to check the document’s sharing for that recipient."
      },
      {
        "q": "Does creating meeting notes in Docs always attach them to the event?",
        "a": "No. Google distinguishes organizer Share & attach from non-organizer Share; the latter does not attach the document to the event."
      }
    ],
    "sourcesHeading": "Primary documentation used for this guide",
    "sources": [
      {
        "label": "Google: attachments, meeting notes and unsynchronized event details",
        "url": "https://support.google.com/calendar/answer/6192039?hl=en"
      }
    ],
    "articleLinks": [
      {
        "slug": "what-guests-can-do-to-your-event",
        "label": "Separate guest permissions from file access"
      },
      {
        "slug": "keeping-track-of-who-replied",
        "label": "Check the actual attendance response"
      },
      {
        "slug": "sharing-one-event-not-your-calendar",
        "label": "Choose the intended event-sharing route"
      }
    ],
    "seeAlso": [
      "what-guests-can-do-to-your-event",
      "keeping-track-of-who-replied",
      "sharing-one-event-not-your-calendar"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "google-calendar-android-app-not-syncing": {
    "updated": "2026-11-12",
    "seoTitle": "Google Calendar Not Syncing on Android? 6 Safe Fixes",
    "title": "Fix Google Calendar Not Syncing on Android (Without Losing Events)",
    "short": "Android Calendar not syncing",
    "description": "Solve Google Calendar sync issues on Android in a safe order: check hidden calendar toggles, system account sync, storage space, and the 1-year sync window.",
    "lede": "Before clearing app storage—which permanently wipes any unsynced phone edits—check the four safe causes of missing events in the Google Calendar Android app: unchecked calendar boxes in the side menu, disabled Google Account Calendar sync, low device storage, and Google’s ~1-year mobile sync window.",
    "commonBelief": "Reinstalling or clearing the app is the first fix to try.",
    "sections": [
      {
        "heading": "First, find out if anything is unsynced",
        "body": [
          "Compare the same account in Google Calendar on a computer and note any event present only on the phone. Google’s explicit data-loss warning is under Clear your Calendar app data:that action can erase unsynced event information absent from the web calendar. It is not a statement that merely checking connectivity or visibility deletes events. Preserve unsynced details before considering storage clearing, which Google reserves for when other steps fail."
        ]
      },
      {
        "heading": "Safe checks",
        "body": [
          "Connection: confirm data or Wi-Fi is on and airplane mode is off. App: update Google Calendar from the app store. Visibility: in the app’s calendar list, make sure the box beside the calendar is checked. Account: Google notes an event added to a calendar not associated with your Google account might not show up in the app.",
          "Then use Menu, Refresh to force a sync."
        ]
      },
      {
        "heading": "Sync switches",
        "body": [
          "In Android’s account settings, check that Calendar account sync is enabled. Inside Google Calendar, the separate Sync switch is documented for calendars the user created, not the primary calendar, which normally appears as Events. Do not assume every primary or received calendar has an identical per-calendar switch. Check the setting only where the actual calendar supports it."
        ]
      },
      {
        "heading": "Storage and history",
        "body": [
          "Google says that when your device runs out of storage, the Calendar app stops syncing. Free space before anything else drastic.",
          "Google also says the app only syncs past events up to one year. An event from two years ago that is missing on the phone but present on the web is expected, not a fault."
        ]
      },
      {
        "heading": "Worked example: one missing appointment",
        "body": [
          "A fictional user created Car service on Thursday at 08:30 in Home maintenance, a secondary Google calendar they created and shared with a partner. The event is absent from the web calendar, so they preserve its details before considering any destructive operation.",
          "They check connectivity, the account, the selected calendar and account-level Calendar sync. For this created secondary calendar, they also find its Sync setting off. They enable it, refresh and allow time for the event to appear, as Google warns synchronization can take time. A possible successful result is the same appointment appearing on the web and then for the partner;it is verified rather than promised immediately.",
          "Check: the partner confirms the entry. No data was cleared."
        ]
      }
    ],
    "comparison": {
      "heading": "Checks in order",
      "columns": [
        "Step",
        "Risk",
        "If it fixes it"
      ],
      "rows": [
        {
          "cells": [
            "Compare with the web; note unsynced events",
            "Non-deletion check;does not clear app storage",
            "You know what to protect"
          ]
        },
        {
          "cells": [
            "Connection, app update",
            "Non-deletion check;does not clear app storage",
            "Refresh"
          ]
        },
        {
          "cells": [
            "Calendar checked; right account",
            "Non-deletion check;does not clear app storage",
            "Event appears"
          ]
        },
        {
          "cells": [
            "Android account sync;per-calendar Sync where offered for a created calendar",
            "Non-deletion check;does not clear app storage",
            "Refresh"
          ]
        },
        {
          "cells": [
            "Free storage",
            "Review storage carefully;do not erase unsynced Calendar data",
            "Sync resumes"
          ]
        },
        {
          "cells": [
            "Last resort:Clear Calendar app storage/data",
            "Unsynced events lost",
            "Only after copying them"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Compare the phone with Google Calendar on a computer and copy unsynced events.",
      "Check connection and update the app.",
      "Tick the calendar and confirm it belongs to your Google account.",
      "Enable Android account Calendar sync and, for a calendar you created, its per-calendar Sync control if available;the primary calendar does not have that same switch.",
      "Free storage, then Refresh.",
      "Expect past events older than a year not to sync."
    ],
    "faq": [
      {
        "q": "Why are old events missing on my phone?",
        "a": "Google says the Calendar app only syncs past events up to one year."
      },
      {
        "q": "Will clearing app data fix it?",
        "a": "Google reserves clearing Calendar app data for after other fixes fail and warns it can lose unsynced information absent from the web calendar. First use the non-deletion checks and preserve any unsynced details. Checking a visibility box is not the same operation as clearing app storage."
      }
    ],
    "sourcesHeading": "Google Calendar Help page used",
    "sources": [
      {
        "label": "Google: fix sync problems with the Google Calendar app",
        "url": "https://support.google.com/calendar/answer/6261951?hl=en"
      }
    ],
    "seeAlso": [
      "google-calendars-that-never-reach-your-iphone",
      "what-calendar-sync-actually-does",
      "when-two-calendars-disagree"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "google-calendar-offline-desktop-limits": {
    "updated": "2026-10-23",
    "title": "Google Calendar offline on a computer: prepare the view and know what cannot change",
    "short": "Google Calendar offline on a computer",
    "description": "Prepare Google Calendar offline in Chrome, wait for readiness and distinguish cached viewing from event editing, guest email and tasks.",
    "lede": "Google Calendar’s documented offline desktop workflow is for reading a prepared calendar in Chrome. It does not provide the same editing behavior as every mobile app. Prepare and verify the browser while connected, then keep unavailable actions out of the plan.",
    "sections": [
      {
        "heading": "Choose the information you must carry",
        "body": [
          "For a fictional trip, list tomorrow’s departure appointment, the hotel check-in time and the next day’s meeting. Identify the owning calendars and open the relevant details while online. An event existing at the provider is not proof it has reached this browser.",
          "Google documents offline viewing of the previous four weeks and future events in day, week or month views. Historical research outside that period is a different requirement. If a specific document or meeting attachment matters, check its own availability separately; a visible calendar title does not prove linked files are offline."
        ]
      },
      {
        "heading": "Enable and wait for the browser’s readiness state",
        "body": [
          "In Google Calendar on a computer, use Settings > General > Offline > Turn on offline calendar, then click Reload now. A Sync status appears while data is prepared; wait until it shows “Ready for offline.” When disconnected, the status shows “Offline.” Do not close the computer immediately after enabling the setting and assume preparation finished.",
          "Record the calendar identity and when preparation was checked. This is a desktop Chrome workflow. Do not transfer its limits to Google’s installed iPhone app or assume that an unrelated third-party application shares the browser’s cached data."
        ]
      },
      {
        "heading": "Perform a non-destructive offline check",
        "body": [
          "At a convenient time, disconnect the computer from the network without signing out, removing accounts or clearing browser data. Open the same calendar and inspect the listed trip entries. Record which details are visible and the offline status shown.",
          "Google says the desktop offline workflow cannot create or edit events, email guests or access tasks. If the fictional meeting needs a last-minute change, record the intended decision somewhere appropriate and complete the actual organizer update after reconnecting. Do not mistake an unsent note for a revised invitation."
        ]
      },
      {
        "heading": "Restore connectivity before making shared changes",
        "body": [
          "Once online, compare the meeting in its owning calendar before editing or contacting participants. If another organizer changed it during the outage, reconcile the current source rather than following an older visible copy.",
          "Google warns that clearing cached images and files removes offline calendar support, requiring setup again. Recheck preparation after browser cleanup. A successful offline viewing rehearsal is useful evidence for that device and date, not a promise that every account, file or future browser state will work indefinitely."
        ]
      }
    ],
    "comparison": {
      "heading": "A fictional trip’s offline checklist",
      "columns": [
        "Needed item",
        "Prepared check",
        "Separate limitation"
      ],
      "rows": [
        {
          "cells": [
            "Tomorrow’s appointment",
            "Visible after readiness and disconnection",
            "No desktop offline rescheduling"
          ]
        },
        {
          "cells": [
            "An old trip outside four weeks",
            "Use an appropriate separate reference",
            "Not assumed in the cached history"
          ]
        },
        {
          "cells": [
            "Meeting change to guests",
            "Complete when connected",
            "No offline guest email in this workflow"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "List the exact dates and details needed.",
      "Enable desktop offline in Chrome and wait for readiness.",
      "Check the same entries disconnected without changing accounts.",
      "Reconnect before organizer updates and recheck after clearing browser cache."
    ],
    "faq": [
      {
        "q": "Can I edit an event offline in the desktop workflow?",
        "a": "Google says no. Its documented browser offline view also excludes emailing guests and accessing tasks."
      },
      {
        "q": "Will clearing the browser cache affect this?",
        "a": "Google says cached images/files cleanup removes offline support. Prepare it again before relying on the browser without a connection."
      }
    ],
    "sourcesHeading": "Official Google documentation checked",
    "sources": [
      {
        "label": "Google Calendar Help: Use Google Calendar offline",
        "url": "https://support.google.com/calendar/answer/1340696?hl=en"
      }
    ],
    "articleLinks": [
      {
        "slug": "what-calendar-sync-actually-does",
        "label": "Compare account and app connection behavior"
      },
      {
        "slug": "calendar-export-ics-pdf-and-backup",
        "label": "Prepare a readable dated reference when appropriate"
      },
      {
        "slug": "time-zones-and-the-flight-you-booked",
        "label": "Check the trip’s event and display zones"
      }
    ],
    "seeAlso": [
      "what-calendar-sync-actually-does",
      "calendar-export-ics-pdf-and-backup",
      "time-zones-and-the-flight-you-booked"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "google-calendar-ownership-transfer-pending-acceptance": {
    "updated": "2026-10-23",
    "title": "Google Calendar ownership transfer: finish the handoff before an account closes",
    "short": "Finish a Google calendar handoff",
    "description": "Check eligibility, pending acceptance and remaining access in a Google Calendar ownership handoff. A transfer email is not a completed transfer.",
    "lede": "A team calendar is not safely handed over just because its owner sent an email. Google keeps the current owner responsible until the recipient accepts the transfer. Use a short handoff record to distinguish a pending request from completed ownership.",
    "sections": [
      {
        "heading": "Check whether the calendar can be handed over",
        "body": [
          "Google’s transfer guide says a primary calendar cannot be transferred; ownership transfer applies to secondary calendars. Only the current owner can initiate it. For work or school accounts, the new owner must be in the same organization. If those conditions do not hold, do not treat export/import as a transfer of the existing calendar.",
          "Identify the calendar itself rather than an individual event. Google documents separate commands for changing an event’s owner, moving an event to another calendar you own and copying an event. Those operations do not amount to transferring the calendar’s ownership."
        ]
      },
      {
        "heading": "Send the transfer from the existing owner",
        "body": [
          "On a computer, open Google Calendar using the owner’s account. Under My calendars, open the intended calendar’s Options, then Settings and sharing. In Shared with, use the intended person’s permission menu and choose Transfer ownership, then confirm. Check the exact recipient identity before sending.",
          "If the person is not available in that sharing arrangement, establish the appropriate calendar sharing first using Google’s supported controls. Do not add a public audience or share account credentials to bypass a missing ownership control. Organization policy can require administrator help."
        ]
      },
      {
        "heading": "Use acceptance as the handoff milestone",
        "body": [
          "Google sends the proposed owner an email link and allows 60 days for acceptance. Until acceptance, the existing person remains the owner. The team should record both “request sent” and “accepted and verified”; these are separate milestones.",
          "For example, a fictional coordinator plans to close an old project account on 30 November. Sending a request on 20 November does not make account deletion safe. The team first needs the intended colleague to accept and the saved calendar settings to show the resulting ownership. Google warns that deleting an account also deletes calendars it still owns."
        ]
      },
      {
        "heading": "Review the former owner’s remaining access",
        "body": [
          "After acceptance, Google says the former owner automatically becomes a person with “Make changes and manage sharing” permission. Ownership transfer therefore does not automatically remove that person’s access. Review any access that should change through the appropriate sharing controls after the successful handoff.",
          "Inspect the calendar’s intended audience, a harmless existing event and who should administer later access. Do not edit a live customer meeting just to prove the new owner can make changes. Keep the acceptance and calendar identity in the team’s handoff record."
        ]
      },
      {
        "heading": "Keep the handoff separate from Cloud Calendars sharing",
        "body": [
          "This procedure concerns ownership inside Google Calendar. It is not a Cloud Calendars Reader, Writer or Owner-role transfer, and seeing the calendar in an iPhone app does not certify the Google ownership status.",
          "If only one event is being transferred, follow Google’s event-specific route instead. Google notes limits for events with more than 200 guests and points out that transferring events with Meet links can affect conferencing policies. Resolve those event-specific requirements before changing ownership, rather than assuming every meeting follows the calendar handoff."
        ]
      }
    ],
    "comparison": {
      "heading": "Illustrative team handoff record",
      "columns": [
        "State",
        "Who owns the calendar",
        "Required check"
      ],
      "rows": [
        {
          "cells": [
            "Request sent",
            "Existing owner",
            "Recipient identity and intended calendar"
          ]
        },
        {
          "cells": [
            "Recipient has not accepted",
            "Existing owner",
            "Keep source account available; follow up"
          ]
        },
        {
          "cells": [
            "Acceptance completed",
            "New owner",
            "Inspect saved ownership and intended access"
          ]
        },
        {
          "cells": [
            "Former owner still listed",
            "Former owner retains a sharing-management role by default",
            "Review access separately if it should end"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Identify a secondary calendar and its current owner.",
      "Confirm the new owner is eligible and uses the intended identity.",
      "Send the request through Google Calendar on a computer.",
      "Record acceptance before closing the old account.",
      "Review former-owner access separately after completion."
    ],
    "faq": [
      {
        "q": "Can I transfer my primary Google calendar?",
        "a": "Google says no. Its ownership-transfer process is for secondary calendars."
      },
      {
        "q": "Does the former owner automatically lose access?",
        "a": "No. Google says the former owner becomes a sharing-management editor after acceptance. Review access separately."
      },
      {
        "q": "Is an export/import a completed ownership handoff?",
        "a": "No. It creates copied event data; it does not transfer ownership of the original calendar."
      }
    ],
    "sourcesHeading": "Primary documentation used for this guide",
    "sources": [
      {
        "label": "Google: transfer calendar or event ownership",
        "url": "https://support.google.com/calendar/answer/78739?hl=en"
      }
    ],
    "articleLinks": [
      {
        "slug": "calendar-export-ics-pdf-and-backup",
        "label": "Distinguish a copy from a transfer"
      },
      {
        "slug": "who-can-see-what-in-google-calendar",
        "label": "Review permissions after the handoff"
      },
      {
        "slug": "disconnect-calendar-integration-without-losing-track",
        "label": "Separate access removal from existing copies"
      }
    ],
    "seeAlso": [
      "calendar-export-ics-pdf-and-backup",
      "who-can-see-what-in-google-calendar",
      "disconnect-calendar-integration-without-losing-track"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "google-calendar-event-visibility-private-public-default": {
    "updated": "2026-11-12",
    "seoTitle": "Google Calendar Private vs Public vs Default Visibility",
    "title": "Google Calendar Private vs Public vs Default Visibility: What Others See",
    "short": "Private, public and default events",
    "description": "What do colleagues actually see when you mark a Google Calendar event Private, Public, or Default? Exact breakdown across all calendar sharing permissions.",
    "lede": "Marking a Google Calendar event Private hides its title, guests, and description from colleagues who have \"See all event details\" access (showing only \"Busy\"), but anyone granted \"Make changes to events\" or higher can still read full Private event details. Compare Private, Default, and Public across every calendar permission level before saving sensitive appointments.",
    "commonBelief": "Private hides an event from everyone, and Public only matters on a public calendar.",
    "sections": [
      {
        "heading": "Two settings decide what someone sees",
        "body": [
          "Calendar sharing sets a person’s baseline: Google’s levels are “See only free/busy (hide details)”, “See event details”, “Make changes (see private events as free/busy)”, “Make changes and see event details” and “Make changes and manage sharing”. Event visibility then adjusts that baseline for one event: Default visibility, Public or Private.",
          "Default visibility follows the calendar’s sharing settings, so it changes nothing. The other two override the baseline in opposite directions, which is where surprises happen."
        ]
      },
      {
        "heading": "Public widens access for that one event",
        "body": [
          "Google defines Public as: anyone who has access to view your calendar can see all the details of this event, even if your overall calendar is restricted to free/busy. A colleague who normally sees only grey busy blocks will see the title, place and description of that one event.",
          "This is useful for, say, an office-hours slot you want everyone with access to read. It is a poor choice for anything you would not show to every person and group on your sharing list, including organisation-wide or public sharing if you have it."
        ]
      },
      {
        "heading": "Private narrows access, but not for everyone",
        "body": [
          "Google says Private hides all details from everyone except you and people with “Make changes and see event details” or higher. So a co-manager with that level still reads your private events in full. Someone with “Make changes (see private events as free/busy)” does not.",
          "Google explicitly describes an additional distinction for the “Make changes (see private events as free/busy)” permission: a private item marked Busy appears as a busy block, while a private item marked Free is hidden from that recipient’s calendar grid. Do not generalise that exact display rule to every other permission level without checking the recipient’s view. Private controls details; Busy or Free separately describes availability.",
          "An invitation and a calendar-sharing grant are separate routes. Private does not recall information already sent in an invitation. Google warns that some details can remain visible when guests or rooms are involved, including the event’s start, end and creator. Check the actual audience rather than treating Private as a confidentiality guarantee."
        ]
      },
      {
        "heading": "Worked example: one appointment, four viewers",
        "body": [
          "A fictional manager adds “Contract renewal — Northwind, Room 4” on Thursday at 14:00 and marks it Private and Busy. Their calendar is shared four ways: a team Google Group with free/busy only, a peer with See event details, an assistant with Make changes (see private events as free/busy), and a deputy with Make changes and see event details.",
          "The group, the peer and the restricted editor each see a busy block at 14:00 without the private title; the deputy can read the details. For the restricted editor specifically, Google says changing that private event to Free hides it from their grid. Do not assume all other viewers have the same Free display. If this otherwise non-private event were marked Public, everyone with calendar-view access could read its details.",
          "Recovery check: if a Public event was a mistake, set it back to Default visibility and save, then remember that anyone who already looked may have read it. Changing visibility affects what is shown from now on; it does not recall what was seen."
        ]
      },
      {
        "heading": "Change and verify one event",
        "body": [
          "Open the event, choose edit, find the visibility control (shown as Default visibility until changed), pick Default visibility, Public or Private, and save. For tasks, Google says only tasks with a start and end time can have their visibility changed; tasks without times are always private.",
          "To verify without exposing real data, ask a colleague who holds a known permission level to look at a harmless test event you mark Private and Busy, then Public. Do not share your account credentials to “see what they see”. On a work or school account, Google notes your administrator can limit sharing or turn off permission settings, so the levels you see may be fewer.",
          "Recurring events have an important limit: Google documents one visibility setting for the whole series. Trying to change one occurrence or a subset applies the visibility change to the entire series. Use a harmless non-recurring event for the recipient-side test above."
        ]
      }
    ],
    "comparison": {
      "heading": "What each viewer sees for one event (from Google’s definitions)",
      "columns": [
        "Viewer’s calendar permission",
        "Default visibility",
        "Public",
        "Private, marked Busy"
      ],
      "rows": [
        {
          "cells": [
            "See only free/busy",
            "Busy/free only",
            "All details",
            "Busy block, no details"
          ]
        },
        {
          "cells": [
            "See event details",
            "All details",
            "All details",
            "Busy block, no details"
          ]
        },
        {
          "cells": [
            "Make changes (see private events as free/busy)",
            "All details, can edit",
            "All details, can edit",
            "Busy block, no details"
          ]
        },
        {
          "cells": [
            "Make changes and see event details",
            "All details, can edit",
            "All details, can edit",
            "All details"
          ]
        },
        {
          "cells": [
            "Make changes and manage sharing",
            "Full control",
            "Full control",
            "All details"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "List who has each permission level on the calendar before relying on Private.",
      "Check Busy or Free separately when the time must count as unavailable; Private alone is not an availability setting. Verify the intended recipient’s view.",
      "Use Public only for events every person with any access may read.",
      "Review invitation and room audiences as well as calendar sharing; Private does not erase information already distributed.",
      "Test with a harmless event and a colleague who holds a known permission level."
    ],
    "faq": [
      {
        "q": "My assistant can edit my calendar. Can they read my private events?",
        "a": "It depends on the exact level. Google’s “Make changes (see private events as free/busy)” shows private events as free/busy only; “Make changes and see event details” and “Make changes and manage sharing” show them in full."
      },
      {
        "q": "Why did a colleague with busy-only access see my event title?",
        "a": "The event was probably marked Public. Google says Public reveals the event’s details to anyone who can view your calendar, even when the calendar is restricted to free/busy."
      },
      {
        "q": "Why can people book over my private appointment?",
        "a": "Check the event’s Busy or Free setting separately from its privacy. Google explicitly says a Private, Free item is hidden from a recipient with “Make changes (see private events as free/busy)” access. Verify other recipients’ actual views rather than inferring the same result for every permission level."
      }
    ],
    "sourcesHeading": "Google Calendar Help pages used",
    "sources": [
      {
        "label": "Google: change event and task visibility",
        "url": "https://support.google.com/calendar/answer/34580?hl=en"
      },
      {
        "label": "Google: choose what others can do with your calendar",
        "url": "https://support.google.com/calendar/answer/15716974?hl=en"
      }
    ],
    "seeAlso": [
      "who-can-see-what-in-google-calendar",
      "can-others-see-google-calendar-tasks",
      "a-calendar-that-is-yours-to-share",
      "taking-back-a-calendar-you-shared"
    ],
    "articleLinks": [
      {
        "slug": "who-can-see-what-in-google-calendar",
        "label": "Choose the calendar-level permission first"
      }
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here.",
    "galleryAfterContent": true
  },
  "google-calendar-time-insights-counted-meetings": {
    "updated": "2026-10-23",
    "title": "Google Calendar Time Insights: reconcile the meetings that actually count",
    "short": "Google Calendar Time Insights",
    "description": "Check Google Time Insights eligibility, counted meetings and overlapping time before treating the dashboard as a record of your whole working week.",
    "lede": "Time Insights is a calendar-derived meeting view, not a measurement of everything you worked on. If its total differs from the hours you counted manually, first check qualifying events, the displayed range and overlaps. A larger number of calendar blocks does not necessarily mean more counted meeting time.",
    "sections": [
      {
        "heading": "Check eligibility, calendar and date range",
        "body": [
          "Google documents Time Insights for supported work or school accounts on a computer, subject to administrator availability. It belongs to the primary calendar; the owner and people with the relevant sharing-management permission can access it. Confirm those boundaries before treating an absent option as missing data.",
          "Write the range you intend to analyze. Google says changing the calendar view changes the displayed date range. Its Time in meetings average uses the previous three weeks in Day, Week, Schedule or five-day view, and the previous three months in Month view. Do not compare either average with a hand-summed single day without first identifying what each number describes."
        ]
      },
      {
        "heading": "Apply the qualifying-event rules",
        "body": [
          "Google’s documented counted meetings require a Yes response, at least one other guest, Busy status and a duration below eight hours. A private solo preparation block is therefore a different kind of time from a qualifying meeting.",
          "Use the dashboard’s highlighted graph sections to locate the underlying meetings, then record the reason for an omission. Keep missing calendar access, an unaccepted invitation and a non-qualifying solo item as different cases. The dashboard is not evidence that an uncounted activity never happened."
        ]
      },
      {
        "heading": "Reconcile a fictional morning",
        "body": [
          "Imagine an accepted Busy meeting with one colleague from 09:00 to 10:00 and another accepted Busy group meeting from 09:30 to 10:30. The displayed appointments add up to two event-hours, but their combined occupied interval is ninety minutes. Google says overlapping meeting time is not counted twice for the same period.",
          "Add a solo preparation block at 11:00 and a meeting still awaiting your response. Those are useful planning items but should not simply be added to the qualifying-meeting total. The example is arithmetic based on the documented rules, not a captured Time Insights result; inspect your own highlighted meetings to reconcile the real range."
        ]
      },
      {
        "heading": "Use the result for a planning decision",
        "body": [
          "Keep a review note with range, qualifying events, overlapping intervals and unanswered invitations. If you want to reduce meeting load, identify one concrete scheduling decision rather than calling the total a productivity score.",
          "Time Insights has additional breakdowns and people-related displays with their own conditions. Read the official definitions before interpreting them. Cloud Calendars can help review appointments, but this article does not claim it reproduces Google’s analytics or has access to every qualifying meeting."
        ]
      }
    ],
    "comparison": {
      "heading": "Fictional reconciliation examples",
      "columns": [
        "Calendar item",
        "Question to inspect",
        "Interpretation"
      ],
      "rows": [
        {
          "cells": [
            "09:00–10:00 and 09:30–10:30 meetings",
            "Both qualify?",
            "90 occupied minutes rather than 120 additive event-minutes"
          ]
        },
        {
          "cells": [
            "Solo preparation block",
            "Any other guest?",
            "Not automatically qualifying meeting time"
          ]
        },
        {
          "cells": [
            "Unanswered invitation",
            "Yes response present?",
            "Keep it separate from accepted meetings"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Confirm an eligible primary calendar and the intended date range.",
      "Check qualifying-event conditions before summing blocks.",
      "Inspect the highlighted underlying meetings.",
      "Reconcile overlapping intervals and keep the result separate from actual work measurement."
    ],
    "faq": [
      {
        "q": "Does an uncounted task mean I did no work?",
        "a": "No. Calendar meeting criteria do not measure all activity or task completion."
      },
      {
        "q": "Should overlapping meetings be added as separate hours?",
        "a": "Google says meeting time counts once for a period. Inspect the occupied interval instead of adding every event duration."
      }
    ],
    "sourcesHeading": "Official Google documentation checked",
    "sources": [
      {
        "label": "Google Calendar Help: View how you spend time in meetings",
        "url": "https://support.google.com/calendar/answer/10738043?hl=en"
      }
    ],
    "articleLinks": [
      {
        "slug": "planning-a-week-in-ten-minutes",
        "label": "Review the week’s commitments"
      },
      {
        "slug": "automatic-time-blocking-versus-manual-calendar",
        "label": "Separate task allocation from meetings"
      },
      {
        "slug": "who-can-see-what-in-google-calendar",
        "label": "Check the sharing authority behind the view"
      }
    ],
    "seeAlso": [
      "planning-a-week-in-ten-minutes",
      "automatic-time-blocking-versus-manual-calendar",
      "who-can-see-what-in-google-calendar"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "google-calendar-working-hours-location-out-of-office-focus-time": {
    "updated": "2026-11-12",
    "seoTitle": "Google Calendar Working Hours vs Out of Office & Focus Time",
    "title": "Google Calendar Working Hours, Location, Out of Office & Focus Time",
    "short": "Working hours, location, OOO or focus time",
    "description": "Which Google Calendar status auto-declines invites? Compare Working Hours, Working Location, Out of Office, and Focus Time in Google Workspace.",
    "lede": "Out of Google Calendar’s four availability features, only Out of Office and Focus Time can automatically decline meeting invitations—Working Hours warns colleagues when they pick an after-hours slot, while Working Location simply displays whether you are at the office, home, or elsewhere.",
    "commonBelief": "Working location and out of office are two names for the same “I’m not at my desk” setting.",
    "sections": [
      {
        "heading": "Four signals, four different questions",
        "body": [
          "Working hours answer “when do I normally work?”. Working location answers “where am I working today?”. An out-of-office event answers “am I unavailable?”. Focus time answers “am I working but should not be interrupted?”. Treat them as separate answers rather than escalating levels of the same setting.",
          "The distinction matters because of side effects. Google describes an out-of-office event as declining meetings while you are away, with optional decline settings and a message. Focus time has an “Automatically decline meetings” option. Working hours and working location are informational: Google documents them as showing people your availability and location, not as declining anything."
        ]
      },
      {
        "heading": "Set the weekly pattern first: working hours",
        "body": [
          "On a computer, Google’s path is Settings, then under General, Working hours, then Enable working hours, choosing the days and times you work. To add more than one period in a day, such as a split shift or an overnight shift, use Add. Google requires each period’s start time to be before its end time and only supports working hours as a recurring weekly schedule.",
          "Google says that if you travel, set a working location or change time zone, your working hours adjust to local time. For a one-off change such as an appointment, Google’s own advice is to edit your regular hours and then revert them; there is no separate one-day working-hours exception. On Android, Google directs you to calendar.google.com in a computer browser to set them. If the option is absent, Google says your administrator may not have turned it on."
        ]
      },
      {
        "heading": "Say where, not whether: working location",
        "body": [
          "Working location needs working hours switched on first and an eligible edition; Google lists Business Standard, Business Plus, Enterprise Starter, Enterprise Standard, Enterprise Plus, Education Fundamentals, Education Standard, Education Plus and Nonprofits. Set a default per weekday under Settings, Working hours & location, choosing Home, Office or another location.",
          "For one day, use the location chip at the top of the calendar and Edit working location. For part of a day, click an empty slot and choose Working location at the top of the new entry, then set the times. A working location is not the address of a meeting: it describes where you are, while each event keeps its own location field.",
          "Google states that people with free/busy access to your calendar can see your availability and working location. Before choosing a precise address over “Home” or “Office”, consider who already has that level of access."
        ]
      },
      {
        "heading": "Decline on purpose: out of office and focus time",
        "body": [
          "Create an out-of-office event with Create, then Out of office, and pick the dates. For a partial day, deselect All day. It can repeat, and Google marks the decline settings and message as optional changes. Google also says your status can be shown to people who email you, provided they have access to your calendar and the out-of-office event lasts the whole day or runs past your regular working hours.",
          "Focus time is created from Day or Week view on a specific start and end time, then Focus time at the top of the event. Google says it declines new and existing meetings by default, and lets you limit that to only new meeting invitations. The first time you use it, Do not disturb for Chat is turned on; Google allows Chat muting only when the organisation enables Chat and the focus block is under 24 hours. Google lists Business Standard and Plus, Enterprise Standard and Plus, Education and Nonprofits editions for focus time.",
          "“New and existing meetings” is the setting with consequences for other people: meetings you had already accepted inside the block can be declined. If you only want to protect empty time, choose new invitations only."
        ]
      },
      {
        "heading": "Worked example: one illustrative week",
        "body": [
          "A fictional support lead works Monday to Thursday, 08:00–12:00 and 13:00–16:30, and takes Friday off. They set working hours with two periods on each of those days and leave Friday unticked. Their default location is Office; on Tuesday they add a part-day working location of Home until 12:00 and Office afterwards.",
          "On Wednesday 09:00–11:00 they need uninterrupted time but have already accepted a 10:00 customer call. They create focus time and choose “Only new meeting invitations” so the accepted call survives. Friday gets an all-day out-of-office event with a short decline message naming a colleague to contact.",
          "Check: open Wednesday and confirm the 10:00 call still shows as accepted; open Friday and confirm the out-of-office entry spans the whole day. If a meeting was declined that you meant to keep, open it, change your response and tell the organiser, because the decline was already sent."
        ]
      },
      {
        "heading": "Where Cloud Calendars fits",
        "body": [
          "These four controls live in Google Calendar for Workspace accounts. Set and edit them there. This guide does not describe a Cloud Calendars control for creating them, and a calendar overview on your phone is not a substitute for checking how Google recorded your status."
        ]
      }
    ],
    "comparison": {
      "heading": "Which signal to use",
      "columns": [
        "Signal",
        "Answers",
        "Can decline meetings?",
        "Who can see it (per Google)",
        "Set up"
      ],
      "rows": [
        {
          "cells": [
            "Working hours",
            "When you normally work",
            "No",
            "Used to show people your availability",
            "Settings → Working hours; weekly pattern only, split periods via Add"
          ]
        },
        {
          "cells": [
            "Working location",
            "Where you work today or part of a day",
            "No",
            "People with free/busy access or more",
            "Requires working hours on; eligible editions only"
          ]
        },
        {
          "cells": [
            "Out of office",
            "You are unavailable",
            "Yes, with optional decline settings and message",
            "Calendar viewers; Gmail senders who have calendar access",
            "Create → Out of office; partial days by deselecting All day"
          ]
        },
        {
          "cells": [
            "Focus time",
            "Working, do not interrupt",
            "Yes: new and existing by default, or new only",
            "Calendar viewers per event visibility",
            "Day or Week view, timed block; eligible editions only"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Turn on working hours first; add a second period for split days.",
      "Set a default working location per weekday, then override single days or part days with the location chip or a Working location entry.",
      "Use out of office when you are unavailable, and write a decline message that names an alternative contact.",
      "Use focus time when you are working but protecting time; choose “Only new meeting invitations” if accepted meetings in that block must stay.",
      "After saving, reopen affected days and check that no meeting you need was declined; if one was, change your response and tell the organiser."
    ],
    "faq": [
      {
        "q": "Does setting my working location to Home decline in-person meetings?",
        "a": "No. Google documents working location as information about where you work, visible to people with free/busy access or more. It does not decline invitations; use out of office or focus time when you need declines."
      },
      {
        "q": "Can I set different working hours just for next Tuesday?",
        "a": "Google only supports working hours as a weekly recurring schedule and suggests editing your regular hours and reverting them afterwards. A part-day working location or an out-of-office block may describe a one-off change better."
      },
      {
        "q": "Why can’t I find working location or focus time?",
        "a": "Both are limited to particular Google Workspace editions, and working location also requires working hours to be on. Google says an administrator may not have enabled the feature. A personal Google account will not show them."
      },
      {
        "q": "Will focus time decline a meeting I already accepted?",
        "a": "By default Google says focus time declines new and existing meetings. Choose “Only new meeting invitations” before saving if you want existing acceptances to stand."
      }
    ],
    "sourcesHeading": "Google Calendar Help pages used",
    "sources": [
      {
        "label": "Google: set your working hours and out-of-office events (computer)",
        "url": "https://support.google.com/calendar/answer/7638168?hl=en&co=GENIE.Platform%3DDesktop"
      },
      {
        "label": "Google: set your working location (computer)",
        "url": "https://support.google.com/calendar/answer/18616218?hl=en&co=GENIE.Platform%3DDesktop"
      },
      {
        "label": "Google: use focus time in Google Calendar",
        "url": "https://support.google.com/calendar/answer/11190973?hl=en"
      }
    ],
    "seeAlso": [
      "work-and-personal-without-two-apps",
      "who-can-see-what-in-google-calendar",
      "keeping-track-of-who-replied",
      "planning-a-week-in-ten-minutes"
    ],
    "articleLinks": [
      {
        "slug": "work-and-personal-without-two-apps",
        "label": "Keep work and personal calendars separate in one view"
      }
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here.",
    "galleryAfterContent": true
  },
  "google-family-calendar-membership": {
    "updated": "2026-10-23",
    "title": "Google family calendar: who gets it, who can edit, what happens when someone leaves",
    "short": "Google family calendar",
    "description": "How Google’s automatic Family calendar works: who can edit and share it, what leaving the family group does, and the cleanup after deleting a family group.",
    "lede": "Creating a family group on Google quietly creates a shared calendar called Family. Everyone in the group gets broad rights over it, and leaving the group ends access. Arte Soft, the developer of Cloud Calendars, explains what Google documents.",
    "commonBelief": "Deleting the family group deletes the family calendar.",
    "sections": [
      {
        "heading": "Who gets it and what they can do",
        "body": [
          "Google says that when you create a family on Google, a calendar called Family is created automatically, and anyone who joins the family or has access to the calendar can find it in Google Calendar on any signed-in device.",
          "Google lists that members can make changes to events and manage how the family calendar is shared. In other words, every member can invite outsiders or change its sharing, not just the person who set it up."
        ]
      },
      {
        "heading": "Ownership",
        "body": [
          "Google says the family manager is the default owner and can transfer ownership. Only the owner can delete the family calendar."
        ]
      },
      {
        "heading": "Leaving and deleting",
        "body": [
          "If someone leaves the family group, Google says they lose access to the family calendar. If the family manager deletes the group, Google says the family calendar and related events must be deleted manually; they are not removed with the group.",
          "Google says anyone with Make changes and manage sharing permission receives an email when a user under 13 shares the family calendar, makes it public or changes member permissions. That audience is permission-based;do not assume it is exactly the guardians or that every guardian necessarily receives the notice."
        ]
      },
      {
        "heading": "Worked example: an older child moves out",
        "body": [
          "A fictional family of four uses Family for school runs and holidays. The eldest leaves the family group and loses that membership-based access. If the family wants to provide selected continuing access, they inspect the named sharing grant deliberately. Google warns non-family members can edit by default, so a parent should choose and verify the intended view-only permission, not assume that sending another invitation is automatically read-only. An agreement that only parents change sharing is a household rule;it does not technically remove other members’ existing capabilities.",
          "If the family group is later deleted, the calendar and events are not automatically deleted according to Google. The owner then inspects the remaining ownership and recipients before deciding whether to retain or delete it. Group deletion is not proof the remaining calendar has exactly the audience the family wants.",
          "Check: after each change, the departing member confirms what they can still see."
        ]
      }
    ],
    "comparison": {
      "heading": "Family calendar events",
      "columns": [
        "Event",
        "Effect (per Google)",
        "Do next"
      ],
      "rows": [
        {
          "cells": [
            "Family group created",
            "Family calendar created automatically",
            "Agree how it will be used"
          ]
        },
        {
          "cells": [
            "Member joins",
            "Can find it, edit events and manage sharing",
            "Agree who manages sharing"
          ]
        },
        {
          "cells": [
            "Member leaves",
            "Loses access",
            "If providing a new named grant, inspect and choose its permission;do not assume read-only"
          ]
        },
        {
          "cells": [
            "Group deleted",
            "Calendar and events remain until deleted manually",
            "Owner inspects remaining ownership/audience before deciding to retain or delete"
          ]
        },
        {
          "cells": [
            "Under-13 shares or makes it public",
            "Permission holders with Make changes and manage sharing are emailed",
            "Review actual recipients and changes;guardian status alone is not the email rule"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Know that every member can edit and manage sharing.",
      "Agree who changes sharing.",
      "If sharing again with a former member, inspect the named grant and its permission;non-family sharing defaults can permit editing.",
      "After deleting a family group, inspect the remaining calendar’s owner and audience before retaining or deleting it.",
      "Transfer ownership if the family manager steps back."
    ],
    "faq": [
      {
        "q": "Can every family member share the calendar with others?",
        "a": "Google lists managing how the family calendar is shared among what members can do."
      },
      {
        "q": "Does deleting the family group delete the calendar?",
        "a": "No. Google says the calendar and related events must be deleted manually."
      }
    ],
    "sourcesHeading": "Google Calendar Help page used",
    "sources": [
      {
        "label": "Google: the family calendar",
        "url": "https://support.google.com/calendar/answer/7157782?hl=en"
      }
    ],
    "seeAlso": [
      "family-pickup-calendar-handoff",
      "cozi-timetree-family-calendar-iphone-android",
      "a-calendar-that-is-yours-to-share",
      "taking-back-a-calendar-you-shared"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "non-integer-30-and-45-minute-utc-offset-calendar-scheduling": {
    "updated": "2026-10-23",
    "title": "Half-hour and quarter-hour time zones: calculate a meeting that fits",
    "short": ":30 and :45 UTC Offset Scheduling",
    "description": "Check dated meeting conversions for India, Nepal, Newfoundland and Adelaide. Calculate overlap from local working hours instead of assuming whole-hour offsets.",
    "lede": "An hour line in London need not be an hour line in India or Nepal. Use the date and named city zone, then check the whole meeting against each person’s working hours. Fractional offsets and seasonal changes both matter.",
    "commonBelief": "",
    "sections": [
      {
        "heading": "Use a city and date, not an offset remembered from another season",
        "body": [
          "IANA maintains civil time-zone rules. The calculations here use Python zoneinfo with the installed 2026e-rearguard database and named zones. They are worked examples, not live availability checks; future rule changes can change results.",
          "RFC 5545 section 3.3.14 permits minute components in UTC offsets. That does not mean a DATE-TIME can be written with an arbitrary numeric offset: section 3.3.5 distinguishes UTC, floating time and a local time with TZID. Use those valid forms when inspecting an ICS file."
        ]
      },
      {
        "heading": "A meeting can start inside working hours and end outside them",
        "body": [
          "On January 15, 2026, 12:00–13:00 London is 17:30–18:30 Kolkata. If the Kolkata workday ends at 18:00, half the meeting lies outside it. Moving the London slot to 11:30–12:30 produces 17:00–18:00 in Kolkata.",
          "Google’s working-hours help documents the feature for work or school accounts and notes that an administrator may not enable it. Configuring those hours helps collaborators schedule; the arithmetic alone does not guarantee that every client displays a warning or rejects an invitation."
        ]
      },
      {
        "heading": "Find the intersection, not just the converted start",
        "body": [
          "For each city, convert both ends of an assumed 09:00–18:00 workday to the same reference zone. The overlap starts at the later start and ends at the earlier end. If the end is no later than the start, there is no positive overlap.",
          "The table applies that calculation to London and each city separately on January 15 and July 15, 2026. These are pairwise windows; they are not one window shared by all five cities."
        ]
      },
      {
        "heading": "Check the minute boundary before sending",
        "body": [
          "India and Nepal differ by 15 minutes: 10:00 Kolkata is 10:15 Kathmandu on these dates. A whole-hour London start maps to :30 in Kolkata and :45 in Kathmandu. To reach an exact hour in Kathmandu, use :15 in London on these dates.",
          "Inspect the saved start and end with the recipient’s city zone. Do not assume your calendar offers a specific 15-minute grid control; enter exact times in its supported editor if needed."
        ]
      }
    ],
    "comparison": {
      "heading": "Pairwise 09:00–18:00 working hours, calculated for two dates",
      "columns": [
        "City",
        "Jan 15: London 09:00 locally",
        "Jan 15: London overlap",
        "Jul 15: London 09:00 locally",
        "Jul 15: London overlap"
      ],
      "rows": [
        {
          "cells": [
            "Kolkata",
            "14:30",
            "09:00–12:30 London (3.5 h)",
            "13:30",
            "09:00–13:30 London (4.5 h)"
          ]
        },
        {
          "cells": [
            "Kathmandu",
            "14:45",
            "09:00–12:15 London (3.25 h)",
            "13:45",
            "09:00–13:15 London (4.25 h)"
          ]
        },
        {
          "cells": [
            "St John’s",
            "05:30",
            "12:30–18:00 London (5.5 h)",
            "05:30",
            "12:30–18:00 London (5.5 h)"
          ]
        },
        {
          "cells": [
            "Adelaide",
            "19:30",
            "No 09:00–18:00 overlap",
            "17:30",
            "09:00–09:30 London (0.5 h)"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Use an exact date and named city zone.",
      "Convert the full start–end interval.",
      "Intersect the two local workdays.",
      "Confirm a suitable slot with the recipient; a calculated overlap is not a booking."
    ],
    "faq": [
      {
        "q": "What is the London–Adelaide overlap for 09:00–18:00 workdays?",
        "a": "On January 15, 2026 there is none. On July 15 there is half an hour, 09:00–09:30 London / 17:30–18:00 Adelaide. Different hours or dates require a fresh calculation."
      },
      {
        "q": "Do fractional zones always shift every meeting by 30 minutes?",
        "a": "No. Compare both zones on the date. India and Nepal differ by 15 minutes; two half-hour-offset zones can differ by a whole number of hours."
      }
    ],
    "sourcesHeading": "Primary specifications and official documentation",
    "sources": [
      {
        "label": "IANA: Time Zone Database",
        "url": "https://www.iana.org/time-zones"
      },
      {
        "label": "RFC 5545: UTC-OFFSET",
        "url": "https://www.rfc-editor.org/rfc/rfc5545.html#section-3.3.14"
      },
      {
        "label": "RFC 5545: DATE-TIME forms",
        "url": "https://www.rfc-editor.org/rfc/rfc5545.html#section-3.3.5"
      },
      {
        "label": "Google: time zones",
        "url": "https://support.google.com/calendar/answer/37064?hl=en"
      },
      {
        "label": "Google: work or school working hours",
        "url": "https://support.google.com/calendar/answer/7638168?hl=en&co=GENIE.Platform%3DDesktop"
      },
      {
        "label": "Supporting primary documentation",
        "url": "https://www.rfc-editor.org/rfc/rfc5545"
      }
    ],
    "articleLinks": [
      {
        "slug": "a-week-view-that-fits-a-week",
        "label": "A Week View That Fits a Week"
      },
      {
        "slug": "when-two-calendars-disagree",
        "label": "When Two Calendars Disagree"
      },
      {
        "slug": "time-zones-and-the-flight-you-booked",
        "label": "Time Zones and the Flight You Booked"
      }
    ],
    "seeAlso": [
      "a-week-view-that-fits-a-week",
      "when-two-calendars-disagree",
      "time-zones-and-the-flight-you-booked"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "google-calendar-hide-unsubscribe-or-delete": {
    "updated": "2026-10-23",
    "title": "Hide, unsubscribe or delete a Google calendar: pick the one you can undo",
    "short": "Hide, unsubscribe or delete",
    "description": "Clear a Google calendar out of your list safely. Compare unchecking, Hide from list, Unsubscribe and Delete, and see which ones affect other people.",
    "lede": "Google gives you four ways to make a calendar go away, and they range from a click you can reverse in a second to a deletion that removes the calendar for everyone it was shared with. Start by asking whether you own it. Arte Soft, the developer of Cloud Calendars, wrote this guide; the controls are in Google Calendar on a computer.",
    "commonBelief": "Removing a calendar from my list only affects me.",
    "sections": [
      {
        "heading": "The four actions, from mildest to strongest",
        "body": [
          "Uncheck the box beside a calendar’s name. Its events stop showing in your view; tick it again and they return. Google’s print guidance describes the same convention: a calendar without a check mark is hidden.",
          "Hide from list removes the calendar from the My calendars or Other calendars sidebar without deleting the calendar. To bring it back, Google gives an explicit route: open Settings, find the calendar in the left column and click Preview. This restores a hidden-list entry; it is not the same as regaining access after unsubscribing.",
          "Unsubscribe. For a calendar someone else owns, open Settings, select the calendar, choose Remove calendar, then Unsubscribe. Google warns you won’t be able to find it again unless the owner, or someone with “Make changes and manage sharing”, shares it with you again.",
          "Delete. Only the owner can permanently delete a secondary calendar: Settings, the calendar, Remove calendar, Delete, then Delete permanently. Google states that if the calendar is shared with other people or groups, it is removed for everyone."
        ]
      },
      {
        "heading": "Your primary calendar is different",
        "body": [
          "Google says you cannot delete your primary calendar, but you can delete all of its events from its settings page. That is a bulk deletion of real appointments, including meetings you organise. It is rarely the right fix for a cluttered view; hiding other calendars or cleaning up specific events is.",
          "Do not clear a primary calendar to troubleshoot an unwanted view. If a genuine planned deletion is necessary, retain an independent dated copy and review invitations and affected users first. An export is not proof that every sharing, guest or invitation state can be restored; the export guide explains those limits."
        ]
      },
      {
        "heading": "Worked example: a parent tidying up after a school year",
        "body": [
          "A fictional parent sees five calendars: their primary calendar, “Under-11 s football” which they created and share with eight families, “School term dates” subscribed from the school, a colleague’s calendar shared for a project that ended, and a holidays calendar.",
          "Football season is over but the other families still look up last season’s results there, so the parent uses Hide from list rather than Delete. The school calendar will matter again in September: they simply uncheck it. The colleague’s project calendar is no longer needed: they Unsubscribe, accepting that getting it back requires the colleague to re-share. Nothing is deleted.",
          "If they had chosen Delete on the football calendar, all eight families would have lost it too."
        ]
      },
      {
        "heading": "Before you press Delete",
        "body": [
          "Check the owner and sharing list in the calendar’s settings. If others use it, tell them first or transfer ownership instead. Google labels the final step Delete permanently; this guide does not rely on any recovery route for a deleted calendar.",
          "If you only want a calendar out of a phone or a third-party app such as Cloud Calendars, change the selection there instead. Deleting at Google to tidy one app removes it everywhere."
        ]
      }
    ],
    "comparison": {
      "heading": "Which action to use",
      "columns": [
        "Action",
        "Who can",
        "Affects others?",
        "How to reverse"
      ],
      "rows": [
        {
          "cells": [
            "Uncheck",
            "Anyone",
            "No",
            "Tick the box again"
          ]
        },
        {
          "cells": [
            "Hide from list",
            "Anyone",
            "No",
            "Settings > choose the hidden calendar in the left column > Preview"
          ]
        },
        {
          "cells": [
            "Unsubscribe",
            "Non-owners",
            "No",
            "Owner or someone with Make changes and manage sharing must provide access again;previous editing rights are not automatically established"
          ]
        },
        {
          "cells": [
            "Delete (secondary calendar)",
            "Owner only",
            "Yes: removed for everyone it is shared with",
            "Not relied on; treat as permanent"
          ]
        },
        {
          "cells": [
            "Delete all events (primary)",
            "Owner",
            "Yes: meetings you organise are affected",
            "Treat as destructive;an export is not a complete undo of invitations and sharing"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Check whether you own the calendar and who it is shared with.",
      "To declutter, uncheck or use Hide from list.",
      "Unsubscribe only when you no longer need access;restoration needs the owner or someone with Make changes and manage sharing. Keep secret calendar addresses private.",
      "Delete a shared secondary calendar only after telling its users or transferring it.",
      "Do not clear a primary calendar to fix a view;planned deletion needs an independent copy and separate review of affected events and people."
    ],
    "faq": [
      {
        "q": "Can I delete a calendar someone shared with me?",
        "a": "No. Only the owner can delete it. You can unsubscribe, hide it from your list or uncheck it."
      },
      {
        "q": "I unsubscribed by mistake. How do I get it back?",
        "a": "Google says you can only find it again if the owner, or someone with “Make changes and manage sharing”, shares it with you again."
      },
      {
        "q": "Why can’t I delete my main calendar?",
        "a": "Google does not allow deleting the primary calendar. You can delete its events, but that removes real appointments."
      }
    ],
    "sourcesHeading": "Google Calendar Help pages used",
    "sources": [
      {
        "label": "Google: delete or unsubscribe from a calendar",
        "url": "https://support.google.com/calendar/answer/37188?hl=en"
      },
      {
        "label": "Google: print your calendar (hidden-calendar checkbox)",
        "url": "https://support.google.com/calendar/answer/41067?hl=en"
      }
    ],
    "seeAlso": [
      "unwanted-calendar-events-iphone",
      "disconnect-calendar-integration-without-losing-track",
      "taking-back-a-calendar-you-shared",
      "calendar-export-ics-pdf-and-backup"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "icloud-shared-calendar-update-emails": {
    "updated": "2026-10-23",
    "title": "iCloud shared calendar update emails: choose the right inbox and signal",
    "short": "Shared-calendar update emails",
    "description": "Control iCloud shared-calendar update emails, check the destination address and keep change messages separate from event reminders.",
    "lede": "An email about a changed shared calendar answers a different question from a reminder that an appointment is about to start. Set up the change signal for the person who actually needs to act, then confirm which inbox receives it. This guide concerns Apple’s iCloud web calendar, not a notification switch in Cloud Calendars.",
    "sections": [
      {
        "heading": "Define the message you need",
        "body": [
          "A rehearsal coordinator may need to know when a co-organizer changes the venue. That is a change-monitoring task. A musician who needs a reminder before rehearsal has an event-alert task. Write the intended trigger first: someone changes the shared schedule, a guest replies, or the start time approaches. Do not turn every notification control on just because the words look similar.",
          "For a fictional club, Dana owns the Fixtures calendar and Lee participates in it. Dana uses a club address for invitations, while Lee was invited at a personal address. Record the calendar, your role, intended inbox and desired trigger before adjusting settings. These are illustrative people, not accounts used in a test."
        ]
      },
      {
        "heading": "Configure the shared-calendar update email",
        "body": [
          "Apple documents the web control in Calendar on iCloud.com, using a tablet or computer. Open the sidebar’s Actions menu, choose Settings, and use the Events pane’s shared-calendar update email option. Save the change. This setting concerns email about updates; it does not establish an audible notification on a phone.",
          "Apple describes different address routing for an owner and an invited participant. Compare the routing in the table with the address you actually monitor. If the chosen inbox is old or unsuitable, resolve that identity question rather than asking another participant to publish the entire calendar."
        ]
      },
      {
        "heading": "Use a low-risk change to check the arrangement",
        "body": [
          "With the other participant’s agreement, choose a clearly labelled sample appointment without confidential notes or guests. Write down its original time or location, the single field to change, and who should receive the update. Let an authorized editor make that change. Keep the owning calendar available so you can check the saved record separately from any message.",
          "Afterwards record three observations: whether the change exists in the source, whether an update message arrived, and which address received it. An absent email is not proof that the edit failed. Conversely, a message is not confirmation that everyone has read it. For a consequential venue change, contact the affected people directly rather than relying on a background signal."
        ]
      },
      {
        "heading": "Reduce noise without removing access",
        "body": [
          "If update mail becomes excessive, revisit the email preference. Do not remove the participant or delete the shared calendar merely to quiet an inbox. Keep a short decision record: which signal remains enabled, who is responsible for reviewing changes, and which separate reminders individuals still require.",
          "In Cloud Calendars, troubleshoot its own event alerts using the linked notification guide. Apple’s web preference and an app’s reminder settings have different owners. Avoid claiming that changing one controls every application displaying the same appointments."
        ]
      }
    ],
    "comparison": {
      "heading": "A routing worksheet for the fictional club",
      "columns": [
        "Person and role",
        "Address to check",
        "Separate check"
      ],
      "rows": [
        {
          "cells": [
            "Dana, calendar owner",
            "The address configured for sending invitations",
            "Is this inbox monitored for club changes?"
          ]
        },
        {
          "cells": [
            "Lee, invited participant",
            "The address used for the calendar invitation",
            "Was the intended address invited?"
          ]
        },
        {
          "cells": [
            "Any attendee awaiting a reminder",
            "The relevant app/device reminder configuration",
            "Does the saved event have the intended alert?"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Name the desired trigger before changing any setting.",
      "Record whether you own the shared calendar or participate in it.",
      "Enable or disable the iCloud web update-email preference and save.",
      "Check one agreed sample edit at the source and in the intended inbox."
    ],
    "faq": [
      {
        "q": "Will this make my iPhone play an event reminder?",
        "a": "Do not assume so. An update email and a timed event alert are different signals; verify the relevant app and device notification settings separately."
      },
      {
        "q": "Should I remove the shared calendar to stop update mail?",
        "a": "Use the applicable notification preference first. Removing access changes collaboration, which is broader than controlling email."
      }
    ],
    "sourcesHeading": "Apple documentation checked for this guide",
    "sources": [
      {
        "label": "Apple: receive updates to calendars on iCloud.com",
        "url": "https://support.apple.com/guide/icloud/receive-emails-updates-shared-calendars-mm8074582205/icloud"
      }
    ],
    "articleLinks": [
      {
        "slug": "calendar-notifications-missing-silent-or-duplicated",
        "label": "Diagnose event reminders separately"
      },
      {
        "slug": "a-calendar-that-is-yours-to-share",
        "label": "Check the sharing arrangement"
      },
      {
        "slug": "keeping-track-of-who-replied",
        "label": "Separate replies from attendance"
      }
    ],
    "seeAlso": [
      "calendar-notifications-missing-silent-or-duplicated",
      "a-calendar-that-is-yours-to-share",
      "keeping-track-of-who-replied"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here.",
    "galleryAfterContent": true
  },
  "iphone-calendar-add-only-full-access": {
    "updated": "2026-10-23",
    "title": "iPhone calendar access: why an app can add events but cannot show your schedule",
    "short": "Calendar permission levels",
    "description": "Distinguish write-only calendar permission from full access on iPhone, review the system grant and test reading separately from adding an event.",
    "lede": "Being able to add an appointment does not prove that an iPhone app may read the rest of your calendar. Apple distinguishes write-only and full event-store access. Diagnose the permission needed by the task before removing accounts or reimporting schedules.",
    "sections": [
      {
        "heading": "Describe the action that fails",
        "body": [
          "Write a small task statement: add a new booking, show existing appointments, or change an existing event. These actions do not all require the same event-store access. A successful add followed by an empty schedule is a different observation from a failed account sign-in.",
          "For a fictional app called Schedule Example, imagine that saving a new lesson works while an existing meeting does not appear. That behavior is only a diagnostic scenario. It is not a claim that we tested a named app or that permission is the cause of every empty view."
        ]
      },
      {
        "heading": "Use Apple’s access-level distinction",
        "body": [
          "On iOS 17 and later, Apple documents write-only access as permission to create events without reading existing calendar data, including events created by that app. Full access allows reading and modifying event data. Apple also offers a system event editor that can let a person save an event without granting the presenting app general event-store access.",
          "Consequently, neither a Save button nor a successful calendar insertion proves general reading permission. Use the table to connect a desired action with the authorization question. This explains system access, not the role someone granted you on a shared Google, iCloud or Cloud Calendars schedule."
        ]
      },
      {
        "heading": "Review the grant in iPhone settings",
        "body": [
          "Apple’s user guide documents Settings > Privacy & Security, then the relevant information category such as Calendars. Inspect the entry for the particular app that requested access. Read the choices shown on your installed iOS version and grant only what fits the workflow you actually want.",
          "Changing calendar permission is a privacy decision. If you do not want an app reading the schedule, retain the limited arrangement and use a supported alternative for viewing. Do not borrow another person’s account or broaden provider sharing as a workaround for an app-level permission."
        ]
      },
      {
        "heading": "Check permission, source and display separately",
        "body": [
          "After an intentional permission change, reopen the app and use a harmless event in a calendar you own. Record two results: can the app save a new event through its supported route, and can it display a known existing appointment? Confirm the expected calendar is selected as a separate check.",
          "If full access is allowed but the appointment remains absent, continue with the owning account, calendar selection and date-loading checks. Direct provider connections can have their own authorization paths, so this system permission is not a universal explanation. Preserve records and ask support to examine the specific app behavior rather than clearing calendar data."
        ]
      }
    ],
    "comparison": {
      "heading": "Questions for the fictional app",
      "columns": [
        "Observed action",
        "What it establishes",
        "What it does not establish"
      ],
      "rows": [
        {
          "cells": [
            "A new event was saved",
            "That creation route succeeded",
            "Permission to read the whole schedule"
          ]
        },
        {
          "cells": [
            "Existing events are displayed",
            "That viewing route returned records",
            "Edit rights to every shared calendar"
          ]
        },
        {
          "cells": [
            "System calendar access is enabled",
            "A device-level grant is present",
            "Correct provider identity, selected calendar or loaded date range"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Name whether the failing task is create, read or change.",
      "Review the app’s calendar permission in Privacy & Security.",
      "Make any broader grant deliberately, based on the task.",
      "Check one new event and one existing record before investigating other layers."
    ],
    "faq": [
      {
        "q": "Can write-only access read events the app created itself?",
        "a": "Apple says write-only event-store access does not allow reading even those events. Saving and later fetching are separate capabilities."
      },
      {
        "q": "Does full calendar access make every shared calendar editable?",
        "a": "No. Device authorization and the owning service’s sharing permissions are different checks. Verify the destination calendar’s actual rights."
      }
    ],
    "sourcesHeading": "Apple documentation checked for this guide",
    "sources": [
      {
        "label": "Apple Developer: calendar access levels and event-store permissions",
        "url": "https://developer.apple.com/documentation/eventkit/accessing-the-event-store"
      },
      {
        "label": "Apple: review app access to information on iPhone",
        "url": "https://support.apple.com/guide/iphone/control-access-to-information-in-apps-iph251e92810/ios"
      }
    ],
    "articleLinks": [
      {
        "slug": "what-calendar-sync-actually-does",
        "label": "Check the remaining connection layers"
      },
      {
        "slug": "event-saved-to-wrong-calendar",
        "label": "Verify the event destination"
      },
      {
        "slug": "who-can-see-what-in-google-calendar",
        "label": "Separate system grants from provider sharing"
      }
    ],
    "seeAlso": [
      "what-calendar-sync-actually-does",
      "event-saved-to-wrong-calendar",
      "who-can-see-what-in-google-calendar"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here.",
    "galleryAfterContent": true
  },
  "outlook-show-declined-meetings-on-calendar": {
    "updated": "2026-11-12",
    "seoTitle": "How to Show Declined Meetings on Outlook Calendar",
    "title": "How to Show Declined Meetings in Outlook (New, Web & Classic)",
    "short": "Declined meetings in Outlook",
    "description": "Keep declined invitations visible on your calendar in new Outlook and Outlook on the web, or find and re-accept a declined invite from Deleted Items in classic.",
    "lede": "In new Outlook and Outlook on the web (with a Microsoft 365 work or school account), you can keep declined invitations visible on your grid via Settings → Calendar → Events and invitations → Save declined events. In classic desktop Outlook, declined invites move to Deleted Items instead—here is how to view or re-accept them in both clients.",
    "commonBelief": "Once I decline a meeting it is gone unless the organiser re-sends it.",
    "sections": [
      {
        "heading": "Who can use the setting",
        "body": [
          "Microsoft says showing declined meetings is available only for Microsoft 365 work or school accounts. Personal Microsoft accounts (outlook.com, hotmail.com, live.com, msn.com) and IMAP or POP accounts from other providers are not supported."
        ]
      },
      {
        "heading": "New Outlook for Windows",
        "body": [
          "In Calendar, on the View tab, select Calendar Settings. Go to Calendar, Events and invitations, and under Save declined events turn on Show declined events on your calendar, then Save.",
          "Microsoft says declined events then appear on your calendar but your time shows as free. To hide them temporarily, use View, Filter, Hide declined events.",
          "Microsoft says declined events can appear across Outlook clients, Teams and third-party calendar apps when you decline through new Outlook, Outlook for Mac, Outlook on the web, mobile Outlook or Teams. Declining through classic Outlook does not preserve the declined event across those services. The documented promise is prospective: “From now on” after the setting is enabled. Do not rely on it to reconstruct earlier declines."
        ]
      },
      {
        "heading": "Classic Outlook",
        "body": [
          "Microsoft states there is no way to show a declined meeting on your calendar in classic Outlook; only accepted or tentative meetings appear. When you decline, the meeting isn’t saved to your calendar and the request moves to Deleted Items.",
          "To change your mind, open Deleted Items (Microsoft notes you may need View, Folder Pane, Normal to see the folder list), double-click the original request and choose Accept or Tentative. If Deleted Items has been emptied, ask the organiser to send the invitation again."
        ]
      },
      {
        "heading": "Worked example: a declined review that comes back",
        "body": [
          "A fictional designer on a work account declines Thursday’s design review in classic Outlook because of a clash. On Wednesday the clash is cancelled. They open Deleted Items, find the review request, and choose Accept.",
          "Later the designer switches to new Outlook, turns on Show declined events, and declines another meeting there. It stays on the grid with their time shown as free, so they can still see what they are missing.",
          "Check: after accepting from Deleted Items, confirm the review appears on Thursday and that its time shows as you expect."
        ]
      }
    ],
    "comparison": {
      "heading": "Declined meetings by client (per Microsoft)",
      "columns": [
        "Client",
        "Show declined on calendar?",
        "Change your mind"
      ],
      "rows": [
        {
          "cells": [
            "New Outlook, work/school account",
            "Yes: Show declined events on your calendar; time shows as free",
            "Respond again from the event (steps not detailed on this page)"
          ]
        },
        {
          "cells": [
            "Classic Outlook",
            "No",
            "Deleted Items → original request → Accept or Tentative"
          ]
        },
        {
          "cells": [
            "Personal or IMAP/POP account",
            "Not supported",
            "Use the response options available for that account; the retention setting is not supported"
          ]
        },
        {
          "cells": [
            "Deleted Items already emptied (classic)",
            "—",
            "Ask the organiser to resend"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Confirm you have a work or school account.",
      "In new Outlook, turn on Show declined events on your calendar.",
      "Use Hide declined events when the grid gets busy.",
      "In classic Outlook, accept from Deleted Items if you change your mind.",
      "If the request is gone, ask the organiser to resend."
    ],
    "faq": [
      {
        "q": "Will a declined meeting block my time?",
        "a": "No. Microsoft says declined events shown in new Outlook display your time as free."
      },
      {
        "q": "Can classic Outlook show declined meetings?",
        "a": "Microsoft says there is no way to do this in classic Outlook."
      }
    ],
    "sourcesHeading": "Microsoft Support page used",
    "sources": [
      {
        "label": "Microsoft: show a declined meeting on my calendar in Outlook",
        "url": "https://support.microsoft.com/en-us/outlook/calendar/show-a-declined-meeting-on-my-calendar-in-outlook"
      },
      {
        "label": "Supporting primary documentation",
        "url": "https://support.microsoft.com/en-us/office/show-a-declined-meeting-on-my-calendar-in-outlook-24e81b9b-3906-4c02-8b63-f97b02161763"
      }
    ],
    "seeAlso": [
      "keeping-track-of-who-replied",
      "exchange-calendars-on-an-iphone",
      "find-old-calendar-events-by-account-date-and-title"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "outlook-shorten-meetings-automatically": {
    "updated": "2026-10-23",
    "title": "Make Outlook meetings end early or start late automatically",
    "short": "Shorten Outlook meetings",
    "description": "Turn on Outlook’s shorten-duration setting to end events early or start them late, set separate minutes for short and long events, and check existing meetings.",
    "lede": "Back-to-back meetings leave no time to move between rooms or calls. Outlook can trim the events you create by a few minutes. The setting is per account, and Microsoft doesn’t say it rewrites what is already on your calendar. Arte Soft, the developer of Cloud Calendars, explains.",
    "commonBelief": "Turning this on shortens every meeting already in my calendar, including ones other people organise.",
    "sections": [
      {
        "heading": "Where to find it",
        "body": [
          "New Outlook for Windows and Outlook on the web: Settings, Calendar, Events and invitations, tick Shorten duration for all events, choose the available timing option and minutes for events under one hour and for events of one hour or longer, and Save. Microsoft’s page also includes a note recommending the latest Monthly Enterprise Channel build of Outlook Desktop.",
          "Classic Outlook: File, Options, Calendar, Calendar options, tick Shorten appointments and meetings, choose End early or Start late, set the minutes for each length, and select OK.",
          "Microsoft lists Outlook for Microsoft 365, 2024, 2021, 2019, new Outlook for Windows and Outlook on the web for Exchange Server 2019 as covered."
        ]
      },
      {
        "heading": "What it affects",
        "body": [
          "Microsoft says that once set, the setting is honoured across Outlook for Windows, Mac, the web, iOS and Android, and that it is per email account: with several accounts you set each one.",
          "Microsoft’s page does not say whether it changes events already on your calendar, applies to meetings you are invited to, or changes what attendees see. Don’t assume it does. Check an existing meeting after turning it on, and create a test event to see the new default."
        ]
      },
      {
        "heading": "Worked example: building travel time",
        "body": [
          "A fictional manager walks between two buildings and wants five minutes after short meetings and ten after longer ones. Using an account and client that offer the setting, they choose End early and set 5 minutes for events under an hour and 10 for an hour or longer. They save the setting.",
          "They then create a 30-minute one-to-one at 14:00 and check that it ends at 14:25, and a 60-minute review from 15:00 that ends at 15:50. They also open an existing 16:00 meeting a colleague organised, to see whether it changed, rather than assuming either way.",
          "Check: open one existing and one new event to see which changed."
        ]
      }
    ],
    "comparison": {
      "heading": "Shorten settings by client",
      "columns": [
        "Client",
        "Location",
        "Options"
      ],
      "rows": [
        {
          "cells": [
            "New Outlook / Outlook on the web",
            "Settings → Calendar → Events and invitations",
            "Shorten duration for all events; minutes for <1 h and ≥1 h"
          ]
        },
        {
          "cells": [
            "Classic Outlook",
            "File → Options → Calendar → Calendar options",
            "Shorten appointments and meetings; End early or Start late; minutes for <1 h and ≥1 h"
          ]
        },
        {
          "cells": [
            "Mac, iOS, Android",
            "Set elsewhere",
            "Microsoft says the setting is honoured"
          ]
        },
        {
          "cells": [
            "Several accounts",
            "Each account",
            "Set separately"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Pick end early or start late and the minutes for short and long events.",
      "Set it in each email account you use.",
      "Create a test event to confirm the new default.",
      "Check an existing meeting rather than assuming it changed."
    ],
    "faq": [
      {
        "q": "Will this shorten meetings other people send me?",
        "a": "Microsoft’s page does not say. Check an invited meeting after turning it on."
      },
      {
        "q": "I have a work and a personal account. Do I set it twice?",
        "a": "Yes. Microsoft says the setting is per email account."
      }
    ],
    "sourcesHeading": "Microsoft Support page used",
    "sources": [
      {
        "label": "Microsoft: make all your events shorter automatically",
        "url": "https://support.microsoft.com/en-us/outlook/make-all-your-events-shorter-automatically"
      },
      {
        "label": "Supporting primary documentation",
        "url": "https://support.microsoft.com/en-us/office/make-all-your-events-shorter-automatically-8fa0fdcb-5eee-4e12-9452-8d59ee33f70a"
      }
    ],
    "seeAlso": [
      "planning-a-week-in-ten-minutes",
      "the-commute-and-the-sky",
      "a-week-view-that-fits-a-week"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "outlook-calendar-delegate-or-editor-permission": {
    "updated": "2026-10-23",
    "title": "Microsoft 365 calendar: give an assistant Can edit or Delegate access?",
    "short": "Outlook delegate or editor",
    "description": "Choose editor or delegate access for a Microsoft 365 work calendar. Check request routing, private-item settings and client differences.",
    "lede": "This guide concerns Microsoft 365 or Exchange work-or-school calendars, mainly in new Outlook and Outlook on the web. Can edit and Delegate do different jobs, and invitation routing has separate consequences. Personal Outlook.com sharing and classic folder permissions are distinct cases. Arte Soft develops Cloud Calendars.",
    "commonBelief": "Edit access and delegate access are the same thing with different names.",
    "sections": [
      {
        "heading": "The difference in one sentence each",
        "body": [
          "Microsoft says Can edit lets the person view and make changes to your calendar. Delegate lets them edit your calendar items and, in addition, schedule and respond to meetings on your behalf.",
          "So the question is not how much you trust the person but which job they do. A colleague maintaining a team rota needs Can edit. An assistant who accepts, declines and sends invitations for you needs Delegate. Microsoft states that you cannot give editor or delegate access to people outside your organisation, and that delegate access requires a work or school account in Microsoft 365 or Exchange Online."
        ]
      },
      {
        "heading": "Delegate options that change your inbox",
        "body": [
          "Under Send invitations and responses to, Microsoft lists three choices. Delegate only sends requests and responses to delegates. Delegate and send me a copy sends both a copy, but the owner’s copy is a normal email without Accept/Decline controls there; the owner can still respond by opening the calendar item. Both my delegate and me gives both people actionable invitations. Agree who processes each request to avoid conflicting actions.",
          "Microsoft also offers “Let delegate view private events”. Without it, most people you share with see only the time of items marked Private, not the subject, location or other details. A separate option lets a delegate manage categories, so colour-coding is not automatically part of delegate access."
        ]
      },
      {
        "heading": "Classic delegate levels in Exchange",
        "body": [
          "Microsoft’s delegate overview describes three per-folder levels. Reviewer can read items. Author can read and create items and change or delete items they created. Editor can do everything an Author can and also change and delete items you created.",
          "Author is a sensible middle ground for someone who adds holds to your calendar but should not touch meetings you set up. Editor is needed when they must rework your existing entries.",
          "Do not treat the classic Private flag as a universal security boundary. Microsoft’s classic Outlook instructions explicitly warn against relying on it to prevent access when folder-read permissions such as Reviewer are granted. The classic checkbox is called Delegate can see my private items and can affect several Exchange folders; that is not the same scope as the new Outlook/web calendar checkbox."
        ]
      },
      {
        "heading": "Setups Microsoft advises against",
        "body": [
          "Microsoft’s organisational best practice recommends granting Editor to only one delegate and avoiding many delegates with Reviewer or Contributor permissions; it says its testing used a maximum of four delegates. It also states that setting a security group as a delegate is not supported — add individual people instead.",
          "Two editing delegates processing the same requests can leave meetings in conflicting states. If you need cover during absences, name one primary delegate and agree when the backup acts."
        ]
      },
      {
        "heading": "Worked example: a director and two helpers",
        "body": [
          "A fictional director has an executive assistant who runs their diary and a project coordinator who adds review sessions. The assistant gets Delegate, with requests sent to the delegate with a copy to the director, and “Let delegate view private events” ticked because they need to work around private appointments. The coordinator gets Can edit only.",
          "The director keeps a few entries Private. The coordinator sees those as time only; the assistant sees their details. Nobody else is a delegate, and the director does not add the whole admin team as a security-group delegate.",
          "For a harmless test, ask a consenting colleague to send an invitation to the director. The assistant first accepts the calendar-sharing invitation. Then check the director’s normal-email copy and the assistant’s actionable request according to the selected routing option, rather than expecting identical buttons in both inboxes."
        ]
      },
      {
        "heading": "Cloud Calendars and delegated calendars",
        "body": [
          "Cloud Calendars’ Microsoft connection is part of its Premium plan, but general Microsoft capabilities do not guarantee that every delegated or shared-mailbox calendar appears in a third-party app. Grant and test delegation in Outlook itself."
        ]
      }
    ],
    "comparison": {
      "heading": "Which access fits the job",
      "columns": [
        "Job",
        "Grant",
        "Private items",
        "Receives your meeting requests"
      ],
      "rows": [
        {
          "cells": [
            "Reads your schedule to plan around you",
            "Can view all details (or less)",
            "Time only",
            "No"
          ]
        },
        {
          "cells": [
            "Maintains entries on your calendar",
            "Can edit",
            "Time only",
            "No"
          ]
        },
        {
          "cells": [
            "Accepts, declines and sends meetings for you",
            "Delegate",
            "New Outlook/web: check Let delegate view private events; classic folder permissions need separate review",
            "Yes, per the routing option you choose"
          ]
        },
        {
          "cells": [
            "Person outside the work/school organisation",
            "Neither Can edit nor Delegate is available",
            "—",
            "—"
          ]
        },
        {
          "cells": [
            "A whole team via a security group",
            "Not supported as a delegate",
            "—",
            "Add individuals instead"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Decide whether the helper edits your calendar or also handles your meetings.",
      "Grant Can edit for maintenance; grant Delegate only for meeting handling.",
      "Choose meeting-request routing on purpose, keeping a copy for yourself if you still want to see invitations.",
      "Tick “Let delegate view private events” only if they need private details.",
      "Keep to one Editor delegate; never use a security group as a delegate.",
      "Test with a harmless invitation and confirm where it arrives."
    ],
    "faq": [
      {
        "q": "Can my delegate see my private appointments?",
        "a": "New Outlook and Outlook on the web document a Let delegate view private events option for this calendar-sharing flow. Classic folder permissions have different scope, and Microsoft warns not to rely on Private alone to prevent access where folder-read permissions exist. Check the actual client, grant and checkbox rather than treating an unticked box as a universal confidentiality guarantee."
      },
      {
        "q": "Can I make an external virtual assistant my delegate?",
        "a": "For the Microsoft 365/Exchange work-or-school flow covered here, Microsoft limits editor and delegate grants to people in the organisation. Personal Outlook.com has a different view/edit sharing model; do not apply this work-account rule universally."
      },
      {
        "q": "How many delegates should I have?",
        "a": "Microsoft recommends only one delegate with Editor permissions and avoiding large numbers of delegates; its testing used up to four."
      }
    ],
    "sourcesHeading": "Microsoft Support pages used",
    "sources": [
      {
        "label": "Microsoft: share and access a calendar with edit or delegate permissions",
        "url": "https://support.microsoft.com/en-us/outlook/sharing/share-and-access-a-calendar-with-edit-or-delegate-permissions-in-outlook"
      },
      {
        "label": "Microsoft: about delegates and permission levels",
        "url": "https://support.microsoft.com/en-gb/outlook/sharing/about-delegates-allow-someone-to-manage-your-mail-and-calendar-in-outlook"
      },
      {
        "label": "Microsoft: best practices for organisations using the Outlook calendar",
        "url": "https://support.microsoft.com/en-us/outlook/best-practices-for-organizations-when-using-the-outlook-calendar"
      }
    ],
    "seeAlso": [
      "a-calendar-that-is-yours-to-share",
      "exchange-calendars-on-an-iphone",
      "who-can-see-what-in-google-calendar"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here.",
    "galleryAfterContent": true
  },
  "outlook-group-calendar-versus-shared-calendar": {
    "updated": "2026-10-23",
    "title": "Microsoft 365 group calendar or a shared calendar: who can cancel, who gets invited",
    "short": "Group calendar vs shared calendar",
    "description": "Choose a Microsoft 365 group calendar or a shared personal calendar for a team: who can edit or cancel events, and who actually gets invited.",
    "lede": "A team schedule in Outlook can live on a Microsoft 365 group calendar or on one person’s calendar shared with the team. They behave differently in two ways that matter in practice: who can cancel an event, and whether members are invited at all. Arte Soft, the developer of Cloud Calendars, compares them.",
    "commonBelief": "Putting an event on the group calendar invites everyone in the group.",
    "sections": [
      {
        "heading": "Group calendar: shared ownership",
        "body": [
          "Microsoft says each Microsoft 365 group has a shared calendar where every member can schedule, edit and see upcoming events. It also says that when an event is created on the group calendar, anyone in the group can cancel it — unlike an event on your own calendar, where you are in charge of editing or cancelling.",
          "That suits a rota or shared deadlines list maintained by everyone. It does not suit a client meeting whose time only the organiser should control."
        ]
      },
      {
        "heading": "Inspect invitations: the default differs by client",
        "body": [
          "In new Outlook, Outlook on the web and Outlook.com, Microsoft says creating a group-calendar event does not invite every member by default. Add the group to attendees when an invitation is intended; new Outlook also offers Invite members. The creator is automatically added as an attendee and receives the group event on their personal calendar in these documented flows.",
          "Classic Outlook is different: Microsoft says the group alias is already in Required attendees when you create the group meeting. Remove the group if you do not intend invitations to its members. Whichever client you use, inspect the actual attendee list before sending rather than relying on one universal default."
        ]
      },
      {
        "heading": "Shared personal calendar: one owner",
        "body": [
          "The alternative is a calendar you own and share with the team at a chosen level: Can view when I’m busy, Can view titles and locations, Can view all details, Can edit or Delegate (the last two only inside your organisation). You decide who can change it, and can remove access later.",
          "Do not try to give a whole team delegate rights through a security group: Microsoft’s best practice says setting a security group as a delegate is not supported."
        ]
      },
      {
        "heading": "Worked example: an events team",
        "body": [
          "A fictional events team of six has two needs. First, a shared list of venue deadlines and staff on-site days, which any member updates. Second, client walkthroughs that the team lead schedules and that should not be moved by others.",
          "Deadlines and on-site days go on the group calendar. Before saving, the creator makes sure the group is not in the attendee list when no invitations are intended; in classic Outlook that can require removing the pre-populated group alias. Client walkthroughs go on the lead’s own calendar with the client and relevant staff invited. The team gets Can view titles and locations on that calendar, not editing or delegation rights.",
          "Check: a member opens the group calendar and confirms they can edit a deadline; another member confirms they can see the walkthrough title but cannot move it."
        ]
      }
    ],
    "comparison": {
      "heading": "Choose where the event lives",
      "columns": [
        "Question",
        "Group calendar",
        "Shared personal calendar"
      ],
      "rows": [
        {
          "cells": [
            "Who can edit or cancel events?",
            "Anyone in the group",
            "The owner and appropriately authorised editors or delegates; meeting actions still need the applicable organising or delegation rights"
          ]
        },
        {
          "cells": [
            "Are members invited?",
            "New/web: add the group or use Invite members. Classic: group alias is pre-populated; remove it if invitations are not intended.",
            "Only the attendees you add"
          ]
        },
        {
          "cells": [
            "Who controls access?",
            "Group membership",
            "You, per person"
          ]
        },
        {
          "cells": [
            "Best for",
            "Rotas, deadlines, shared logistics",
            "Meetings one person must control"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Put shared, low-stakes items on the group calendar.",
      "Keep meetings whose time must not change on an owned calendar.",
      "For group events, inspect attendees before saving: add the group when invitations are needed; in classic Outlook remove its pre-populated alias when they are not.",
      "Share your owned calendar at the lowest useful level instead of making everyone a delegate.",
      "Test that a member can or cannot change an event as intended."
    ],
    "faq": [
      {
        "q": "Why didn’t members get an invitation for a group calendar event?",
        "a": "In new Outlook, Outlook on the web and Outlook.com, Microsoft says the whole group is not invited by default; add it as an attendee. In classic Outlook the group alias is pre-populated in Required, so check whether it was removed. Inspect the actual attendee list and client rather than assuming one shared default."
      },
      {
        "q": "A colleague cancelled an event I put on the group calendar. Is that allowed?",
        "a": "Yes. Microsoft states anyone in the group can cancel an event created on the group calendar."
      },
      {
        "q": "Can I make a security group my delegate instead?",
        "a": "Microsoft says setting a security group as a delegate is not supported; add individual people."
      }
    ],
    "sourcesHeading": "Microsoft Support pages used",
    "sources": [
      {
        "label": "Microsoft: use a group calendar in Outlook",
        "url": "https://support.microsoft.com/en-us/outlook/people/use-a-group-calendar-in-outlook-to-schedule-and-edit-events"
      },
      {
        "label": "Microsoft: share your calendar in Outlook on the web",
        "url": "https://support.microsoft.com/en-us/outlook/share-your-calendar-in-outlook-on-the-web"
      },
      {
        "label": "Microsoft: best practices for organisations using the Outlook calendar",
        "url": "https://support.microsoft.com/en-us/outlook/best-practices-for-organizations-when-using-the-outlook-calendar"
      }
    ],
    "seeAlso": [
      "a-calendar-that-is-yours-to-share",
      "family-pickup-calendar-handoff",
      "keeping-track-of-who-replied",
      "exchange-calendars-on-an-iphone"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here.",
    "galleryAfterContent": true
  },
  "mac-calendar-ignore-alerts-one-calendar": {
    "updated": "2026-10-23",
    "title": "Mute one calendar on Mac without deleting its appointments",
    "short": "Ignore alerts for one calendar",
    "description": "Use Calendar on Mac’s Ignore alerts option for one calendar. Keep event visibility, system notifications and shared-calendar access separate.",
    "lede": "If one reference calendar is noisy but your own appointments still need reminders, turning off every Calendar notification is broader than the task. Apple provides Ignore alerts for an individual calendar. Identify the source first, then change the narrow setting.",
    "sections": [
      {
        "heading": "Identify the noisy calendar and the sending app",
        "body": [
          "A fictional family keeps a personal appointment calendar and a club reference feed. The club feed supplies too many reminders, but the family still wants to see its fixtures. The intended change is “keep the fixtures, stop that calendar’s alerts on this Mac,” not “remove the club’s access” or “silence all appointments.”",
          "Check the app name on an unwanted notification and the calendar owning its event. Another app can send its own notification for related data. A Mac Calendar preference does not establish that every phone or app using the same schedule is quiet."
        ]
      },
      {
        "heading": "Use the per-calendar control",
        "body": [
          "In Calendar on Mac, show the calendar list if necessary with View > Show Calendar List. Control-click the relevant calendar’s name, choose Get Info, select Ignore alerts, then click OK. Reopen the setting to verify the intended calendar was changed.",
          "To restore that calendar’s alerts, use the same route and deselect Ignore alerts. Apple documents this as a per-calendar notification control. It does not delete the calendar’s appointments or cancel a meeting for its guests."
        ]
      },
      {
        "heading": "Keep broader switches separate",
        "body": [
          "Calendar > Settings > Alerts includes other signals, such as Time to Leave and shared-calendar or invitation messages. System Settings > Notifications > Calendar controls application-level permission and notification behavior. These controls answer different questions from ignoring one calendar’s event alerts.",
          "If the goal is to retain personal appointment reminders, leave the broader arrangement alone while checking the reference calendar. If the noise is actually a shared-calendar change message rather than an event alert, follow that message’s relevant preference instead of assuming Ignore alerts is the universal switch."
        ]
      },
      {
        "heading": "Check the intended outcome without changing a live meeting",
        "body": [
          "For the family example, keep a record of the changed calendar and preference. Observe a suitable harmless future example where supported, and separately confirm an ordinary personal reminder still follows its intended configuration.",
          "Cloud Calendars has its own notification settings. This page describes the native Mac app. Do not delete a real appointment or leave a shared calendar just to diagnose extra notifications; preserve the schedule and narrow the sender and signal first."
        ]
      }
    ],
    "comparison": {
      "heading": "Choose the smallest matching action",
      "columns": [
        "Desired result",
        "Control to inspect",
        "What it is different from"
      ],
      "rows": [
        {
          "cells": [
            "Quiet one calendar in Mac Calendar",
            "Get Info > Ignore alerts",
            "Hiding or deleting its events"
          ]
        },
        {
          "cells": [
            "Quiet the entire Mac application",
            "System Settings > Notifications > Calendar",
            "One calendar’s preference"
          ]
        },
        {
          "cells": [
            "Quiet a shared-calendar message",
            "Relevant Calendar message preference",
            "An event’s timed alert"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Identify the sending app and owning calendar.",
      "Use Get Info > Ignore alerts for the intended calendar.",
      "Verify the saved preference without deleting events.",
      "Check broader notification controls only if the desired result is broader."
    ],
    "faq": [
      {
        "q": "Do I need to unsubscribe to stop one calendar’s alerts?",
        "a": "Not when the intended task is covered by its Ignore alerts control. Unsubscribing changes the calendar arrangement itself."
      },
      {
        "q": "Will this silence Cloud Calendars on my phone?",
        "a": "This guide does not establish that. Inspect the phone app’s own settings and sender separately."
      }
    ],
    "sourcesHeading": "Apple documentation checked for this workflow",
    "sources": [
      {
        "label": "Apple: manage notifications from Calendar on Mac",
        "url": "https://support.apple.com/guide/calendar/manage-notifications-icl624fd1912/mac"
      }
    ],
    "articleLinks": [
      {
        "slug": "calendar-notifications-missing-silent-or-duplicated",
        "label": "Identify notification senders"
      },
      {
        "slug": "what-calendar-sync-actually-does",
        "label": "Keep hiding and deletion separate"
      },
      {
        "slug": "a-calendar-that-is-yours-to-share",
        "label": "Preserve intended collaboration"
      }
    ],
    "seeAlso": [
      "calendar-notifications-missing-silent-or-duplicated",
      "what-calendar-sync-actually-does",
      "a-calendar-that-is-yours-to-share"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here.",
    "galleryAfterContent": true
  },
  "outlook-teams-meeting-button-missing": {
    "updated": "2026-11-04",
    "title": "Teams Meeting Option Missing in Outlook? New vs Classic Fix",
    "short": "Teams option missing in Outlook",
    "description": "Restore a missing Microsoft Teams meeting toggle in Outlook: restart order for native new Outlook, COM add-in steps for classic Outlook, and delegate fix.",
    "lede": "The fix for a missing Teams button depends entirely on which Outlook you use. Classic Outlook relies on a COM add-in; new Outlook for Windows has Teams built in and doesn’t support that add-in at all. Arte Soft, the developer of Cloud Calendars, set out Microsoft’s checks.",
    "commonBelief": "Reinstalling Teams always brings the button back.",
    "sections": [
      {
        "heading": "New Outlook for Windows",
        "body": [
          "Microsoft says new Outlook doesn’t support the Teams COM add-in and instead has a native Teams meeting capability. Its help for a missing option lists two requirements: be signed in to both Outlook and Teams with the same work or school account, and use the new Teams client. The fix it gives is to close Outlook and Teams, restart Teams, then restart Outlook."
        ]
      },
      {
        "heading": "Classic Outlook: is the add-in enabled?",
        "body": [
          "Microsoft’s troubleshooting starts with File, Options, Add-ins. Look for Microsoft Teams Meeting Add-in for Microsoft Office under Active Application Add-ins. If it is under Disabled Application Add-ins, choose Manage, COM Add-ins, Go, tick it, select OK and restart Outlook.",
          "Microsoft also lists prerequisites: the Teams desktop client must be installed (the add-in can’t be installed with only Teams on the web), Outlook 2016 or later, and current Outlook updates."
        ]
      },
      {
        "heading": "When it’s an administrator job",
        "body": [
          "Microsoft’s further steps — re-registering the add-in loader, checking registry load behaviour and trusted add-in policies, and reinstalling the add-in after a move from classic to new Teams — are written for administrators and involve PowerShell and the registry. Hand them over rather than attempting them on a managed work PC."
        ]
      },
      {
        "heading": "Delegate meetings without join details",
        "body": [
          "In its classic Outlook add-in troubleshooting, Microsoft documents a specific case: when a delegate schedules a Teams meeting on a manager’s calendar and the manager’s mailbox is hidden from the global address list, the meeting URL, ID, passcode and dial-in numbers aren’t added. For that diagnosed case, an administrator unhides the mailbox; the delegate then restarts Outlook and creates a new meeting request. A missing link alone does not establish this cause."
        ]
      },
      {
        "heading": "Worked example: two colleagues, two fixes",
        "body": [
          "A fictional colleague on classic Outlook finds no Teams button after an update. File, Options, Add-ins shows the Teams add-in under Disabled; they enable it through COM Add-ins and restart, then check whether the button has returned.",
          "Another colleague on new Outlook has the same symptom. Their Teams is signed in with a personal account. They sign Teams in with the same work account as Outlook, restart Teams then Outlook, and check the event window for the Teams meeting toggle. If it is still absent, they report the client versions and account type to IT.",
          "Check: create a draft meeting, add the Teams link, and confirm the join details appear in the body before inviting anyone."
        ]
      }
    ],
    "comparison": {
      "heading": "Diagnose by client",
      "columns": [
        "Client",
        "Teams integration",
        "First checks",
        "Escalate if"
      ],
      "rows": [
        {
          "cells": [
            "New Outlook for Windows",
            "Built in; COM add-in not supported",
            "Same work/school account in Outlook and Teams; new Teams; restart Teams then Outlook",
            "Still missing"
          ]
        },
        {
          "cells": [
            "Classic Outlook",
            "Teams Meeting COM add-in",
            "Add-in active or disabled; Teams desktop installed; Outlook 2016+ and updated",
            "Re-registration, registry or policy steps"
          ]
        },
        {
          "cells": [
            "Delegate on manager’s calendar",
            "Classic Outlook add-in case documented by Microsoft",
            "Join details present?",
            "Manager’s mailbox hidden from GAL"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Identify new or classic Outlook.",
      "New Outlook: same work account in Outlook and new Teams; restart Teams then Outlook.",
      "Classic: re-enable the add-in under COM Add-ins and restart.",
      "Confirm the Teams desktop client is installed for classic Outlook.",
      "Send registry, PowerShell and GAL issues to your administrator."
    ],
    "faq": [
      {
        "q": "Can I install the Teams add-in in new Outlook?",
        "a": "No. Microsoft says new Outlook doesn’t support the Teams COM add-in; it has Teams built in."
      },
      {
        "q": "My delegate’s Teams meetings have no link. Why?",
        "a": "One documented cause in classic Outlook is a manager’s mailbox hidden from the global address list. Ask IT to diagnose that case; if it applies, Microsoft directs an administrator to unhide the mailbox, then have the delegate restart Outlook and create a new request. Other missing-link cases need their own checks."
      }
    ],
    "sourcesHeading": "Microsoft pages used",
    "sources": [
      {
        "label": "Microsoft Learn: fix Teams Meeting add-in problems in classic Outlook",
        "url": "https://learn.microsoft.com/en-us/troubleshoot/microsoftteams/meetings/resolve-teams-meeting-add-in-issues"
      },
      {
        "label": "Microsoft: Teams meeting add-in missing in new Outlook",
        "url": "https://support.microsoft.com/office/teams-meeting-add-in-missing-in-new-outlook-2ba1d660-29d9-4bdb-b651-c62d9d790865"
      }
    ],
    "seeAlso": [
      "meeting-links-that-make-themselves",
      "exchange-calendars-on-an-iphone",
      "inviting-people-who-do-not-have-the-app"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "icloud-calendar-hide-past-events": {
    "updated": "2026-10-23",
    "title": "Old iCloud events disappeared? Check the web hide-past-events setting",
    "short": "Hidden past iCloud events",
    "description": "Check iCloud’s hide-past-events preference before restoring calendars. Distinguish an invisible old appointment from a deleted record.",
    "lede": "If older appointments disappear from Calendar on iCloud.com while recent dates remain, check the web display preference before choosing a recovery archive. Apple offers an option to hide past events after a chosen number of days. Hiding changes the view; it is not a reason to restore the whole calendar.",
    "sections": [
      {
        "heading": "Identify a date boundary rather than a missing title",
        "body": [
          "Start with two known appointments in the same calendar: one recent and one older. Record their actual dates and the signed-in Apple Account. If only the older item is absent, inspect a setting that can affect a period of history before assuming an event was deleted.",
          "For example, a fictional coordinator can see this week’s session but not a workshop several months ago. The useful clue is the age difference, not that both titles contain Workshop. Do not create another copy of the older appointment while you are still determining why it is absent."
        ]
      },
      {
        "heading": "Inspect the Apple web preference",
        "body": [
          "Apple documents this on a tablet or computer in Calendar on iCloud.com: open Actions, Settings, then Events. Inspect the option that hides events a chosen number of days after they have passed. Apple says clearing the option shows hidden events again.",
          "Make one narrow change and revisit the older date. Do not edit the appointment’s date to force it into the visible window. The preference is a display control in Apple’s web calendar; it does not describe the search range or loading behavior of Cloud Calendars."
        ]
      },
      {
        "heading": "Work through the three possible outcomes",
        "body": [
          "Use the table to keep observations separate. If the appointment reappears after disabling the preference, inspect its original fields and leave the date intact. Record the preference you changed so you can decide whether to keep a shorter visual history or display all available entries.",
          "If the record remains absent, verify the owning calendar, account and approximate date. Search the appropriate service using the available clues. A negative search still does not prove deletion: you may be looking at another calendar, lack access, or be using a restricted range. Use the historical-search guide before moving to recovery."
        ]
      },
      {
        "heading": "Avoid a restore for a display-only problem",
        "body": [
          "A fictional handoff note can read: expected archive workshop, owning calendar Club, approximate month March, hiding preference enabled, result after disabling preference recorded. That is more actionable than calendar lost everything. Keep private titles and invitation links out of public support posts.",
          "Only investigate a deletion workflow after identifying a missing source record. An iCloud archive restore is broader than showing hidden dates, and can affect current schedules and sharing. Preserve the existing account arrangement while you diagnose the display."
        ]
      }
    ],
    "comparison": {
      "heading": "What the next observation means",
      "columns": [
        "Observation",
        "Next narrow action",
        "Avoid"
      ],
      "rows": [
        {
          "cells": [
            "Old event returns after disabling hiding",
            "Verify its original date and calendar",
            "Creating a duplicate"
          ]
        },
        {
          "cells": [
            "Old event remains absent, account uncertain",
            "Establish the owning identity and calendar",
            "Restoring a different account"
          ]
        },
        {
          "cells": [
            "Source record is confirmed deleted",
            "Review the provider’s recovery scope",
            "Using display settings as recovery"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Identify one older and one recent event in the same source calendar.",
      "Inspect the iCloud web history-hiding preference.",
      "Disable it if you want to check hidden dates, then revisit the older date.",
      "Move to source/search or recovery diagnosis only if the observation warrants it."
    ],
    "faq": [
      {
        "q": "Does hiding an old event delete it?",
        "a": "The documented hiding option is reversible. Do not confuse it with deleting an owned event or declining an invitation."
      },
      {
        "q": "Does this explain every old event missing in Cloud Calendars?",
        "a": "No. Cloud Calendars has its own date-loading and search behavior. Check the owning source and the app’s relevant date range independently."
      }
    ],
    "sourcesHeading": "Apple documentation checked for this guide",
    "sources": [
      {
        "label": "Apple: delete or hide an event on iCloud.com",
        "url": "https://support.apple.com/guide/icloud/delete-or-hide-an-event-mmfbbb4470/icloud"
      }
    ],
    "articleLinks": [
      {
        "slug": "find-old-calendar-events-by-account-date-and-title",
        "label": "Search by source, field and date"
      },
      {
        "slug": "recover-deleted-calendar-events-iphone",
        "label": "Review actual deletion recovery"
      },
      {
        "slug": "what-calendar-sync-actually-does",
        "label": "Identify a display or source problem"
      }
    ],
    "seeAlso": [
      "find-old-calendar-events-by-account-date-and-title",
      "recover-deleted-calendar-events-iphone",
      "what-calendar-sync-actually-does"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here.",
    "galleryAfterContent": true
  },
  "on-call-standby-calendar-versus-confirmed-shift": {
    "updated": "2026-10-23",
    "title": "On-call calendar: separate coverage from confirmed work",
    "short": "On-call calendar",
    "description": "Keep an on-call coverage window, regular work and call-outs distinct; choose busy status from the real duty constraints.",
    "lede": "An on-call window answers who is responsible for coverage. A confirmed work block answers when an activity is planned. Keep those records distinct, and do not assume standby should always appear free.",
    "sections": [
      {
        "heading": "Record the handover as an exact interval",
        "body": [
          "For an illustrative week, coverage begins Monday 2 November 2026 at 08:00 and ends Monday 9 November at 08:00 in America/New_York. There is no clock change inside this interval, so it spans 168 elapsed hours. A Monday-through-Sunday all-day banner does not express the same endpoints.",
          "An all-day label can provide context, but preserve the exact handover times in a timed reference or clearly visible notes. Use a title identifying the coverage role, and keep any contact or escalation details within the appropriate sharing audience."
        ]
      },
      {
        "heading": "Choose availability from the actual constraints",
        "body": [
          "Do not mark all on-call time free as a blanket rule. If the duty prevents accepting another commitment, busy may be the appropriate status. If some bookings are acceptable, decide with the responsible team which time is genuinely available and verify the behavior in the actual booking workflow.",
          "RFC 5545 TRANSP distinguishes whether an event contributes to busy-time searches. It does not classify paid work, guarantee a provider’s booking integration or prove that a person is available. A secondary calendar is not automatically excluded from every availability calculation."
        ]
      },
      {
        "heading": "Avoid double-counting coverage and activity",
        "body": [
          "Suppose the week contains 40 hours of regular planned work and seven hours of call-outs outside those regular blocks. The coverage envelope is still 168 hours. The non-overlapping regular-plus-call-out total is 47 hours, leaving 121 hours outside those activity blocks but still inside coverage.",
          "That remainder is not unrestricted leisure and does not establish paid standby. If a call-out overlaps regular work, calculate the union of occupied intervals rather than adding both durations. Review actual callbacks separately from planned ones and preserve the original coverage reference."
        ]
      }
    ],
    "comparison": {
      "heading": "Worked example to check against your calendar",
      "columns": [
        "Layer",
        "Illustrative quantity",
        "Meaning"
      ],
      "rows": [
        {
          "cells": [
            "Coverage envelope",
            "168 hours",
            "Responsibility window"
          ]
        },
        {
          "cells": [
            "Regular work",
            "40 hours",
            "Planned activity"
          ]
        },
        {
          "cells": [
            "Non-overlapping call-outs",
            "7 hours",
            "Additional activity"
          ]
        },
        {
          "cells": [
            "Remainder inside coverage",
            "121 hours",
            "Not automatically available or unpaid"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Record exact start and end handovers.",
      "Keep coverage and confirmed activity as distinct records.",
      "Choose busy status from duty constraints, not a universal standby rule.",
      "Test what an intended viewer or booking tool sees."
    ],
    "faq": [
      {
        "q": "Should standby always be marked free?",
        "a": "No. That depends on the duty and which commitments are allowed."
      },
      {
        "q": "Can I add all three durations together?",
        "a": "No. The coverage window contains the activity blocks; adding them double-counts time."
      }
    ],
    "sourcesHeading": "Sources and verification",
    "sources": [
      {
        "label": "RFC 5545: transparency and busy-time searches",
        "url": "https://www.rfc-editor.org/rfc/rfc5545.html#section-3.8.2.7"
      },
      {
        "label": "RFC 5545: event endpoints",
        "url": "https://www.rfc-editor.org/rfc/rfc5545.html#section-3.6.1"
      }
    ],
    "articleLinks": [
      {
        "slug": "booking-link-or-shared-calendar",
        "label": "Booking Link or Shared Calendar"
      },
      {
        "slug": "shift-work-calendar-iphone-rotating-schedules",
        "label": "Shift Work Calendar on iPhone: Rotating Schedules and Family Sharing"
      },
      {
        "slug": "what-an-all-day-event-really-means",
        "label": "What an All-Day Event Really Means"
      }
    ],
    "seeAlso": [
      "booking-link-or-shared-calendar",
      "shift-work-calendar-iphone-rotating-schedules",
      "what-an-all-day-event-really-means"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "outlook-appointment-meeting-event-convert-and-update": {
    "updated": "2026-11-12",
    "seoTitle": "Outlook Appointment vs Meeting vs All-Day Event (Convert Safely)",
    "title": "Outlook Appointment vs Meeting vs Event: Differences & Safe Updates",
    "short": "Appointment, meeting or event",
    "description": "Understand the exact difference between an Outlook appointment, meeting, and all-day event, how to convert one into another, and who receives update emails.",
    "lede": "In Outlook, an appointment is just for your own calendar, adding attendees turns it into a meeting that sends email invitations, and checking All day creates a banner event that defaults to Free instead of Busy. Know how each conversion affects availability and when Outlook emails every guest versus only added or removed attendees.",
    "commonBelief": "Changing any calendar entry automatically tells the people involved.",
    "sections": [
      {
        "heading": "The three types",
        "body": [
          "Microsoft describes appointments as blocks of time you can mark free, busy, tentative, out of office or working elsewhere; events as like appointments but lasting at least one full day by default; and meetings as appointments or events with other attendees.",
          "In classic Outlook, Microsoft says new all-day events show as free by default, while meetings and appointments show as busy."
        ]
      },
      {
        "heading": "Converting in classic Outlook",
        "body": [
          "Event to appointment: open it and untick All day event; Microsoft says Show As then changes to Busy. Appointment to meeting: add attendees. Save & Close for an appointment, Send Update for a meeting.",
          "For a meeting you created, Microsoft says you must send an update to save changes."
        ]
      },
      {
        "heading": "Updating: everyone or only the changed people",
        "body": [
          "If you only add or remove attendees, new Outlook offers, after Send, to send the update only to added or removed attendees; others keep the event without an email. Classic Outlook lets you send to all attendees or just the added ones when adding people and making no other change.",
          "For recurring items, new Outlook offers Edit the one event in the series, Edit series or Edit this and all following events. Classic Outlook asks Just this one or The entire series and notes limits: you cannot move an occurrence past an earlier or later one, and removing an attendee from one occurrence leaves them invited to the others."
        ]
      },
      {
        "heading": "What you can’t change",
        "body": [
          "Microsoft says you can’t change the details of meetings others invited you to; moving one only moves your copy and leaves the organizer uninformed.",
          "Show As is personal. Microsoft says the organizer sets the initial availability for attendees, but status changes made later apply only to each person’s own calendar, and updates to the meeting won’t override an attendee’s status."
        ]
      },
      {
        "heading": "Worked example: a training day grows",
        "body": [
          "A fictional trainer using classic Outlook adds an all-day event “Course prep” on Wednesday; it shows as free. When the plan firms up to 09:00–13:00, they untick All day event; it becomes an appointment and shows as Busy.",
          "They then add two co-trainers, turning it into a meeting, and send. A week later, now editing that meeting in new Outlook, they add a third co-trainer without other changes and choose to send the update only to the added attendee, so the first two aren’t emailed again.",
          "Check: the third co-trainer has the invitation; the others still have the meeting unchanged."
        ]
      }
    ],
    "comparison": {
      "heading": "Change and its effect (classic Outlook unless noted)",
      "columns": [
        "Change",
        "Result",
        "Who is notified"
      ],
      "rows": [
        {
          "cells": [
            "Untick All day event on a personal event with no attendees",
            "Event becomes appointment; Show As becomes Busy",
            "No one"
          ]
        },
        {
          "cells": [
            "Add attendees to an appointment",
            "Becomes a meeting",
            "Attendees, when you send"
          ]
        },
        {
          "cells": [
            "Add people only to a meeting",
            "Meeting updated",
            "All or only added (classic); added/removed only option (new Outlook)"
          ]
        },
        {
          "cells": [
            "Move an invited meeting on your calendar",
            "Your copy only",
            "Organizer not notified"
          ]
        },
        {
          "cells": [
            "Change Show As after sending",
            "Your calendar only",
            "Attendees unaffected"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Decide whether the entry needs attendees; if yes, it’s a meeting.",
      "Untick All day event to turn an event into a timed, busy appointment.",
      "When only adding attendees, use the limited-recipient update option if offered. New Outlook also documents this option for attendee removals; classic Outlook’s cited instructions cover added attendees only.",
      "Choose the occurrence scope deliberately for recurring items.",
      "Never move a meeting you were invited to; contact the organizer."
    ],
    "faq": [
      {
        "q": "Why does my all-day event show me as free?",
        "a": "In classic Outlook, Microsoft says new all-day events show as free by default. Change Show As if it should block time."
      },
      {
        "q": "Can I avoid re-emailing everyone when I add one person?",
        "a": "Yes. New Outlook offers sending only to added or removed attendees; classic Outlook offers sending to just the added attendees."
      }
    ],
    "sourcesHeading": "Microsoft Support pages used",
    "sources": [
      {
        "label": "Microsoft: change an appointment, meeting or event in Outlook",
        "url": "https://support.microsoft.com/en-us/outlook/calendar/change-an-appointment-meeting-or-event-in-outlook"
      },
      {
        "label": "Microsoft: get started with the Outlook calendar",
        "url": "https://support.microsoft.com/en-gb/outlook/get-started-with-the-outlook-calendar"
      },
      {
        "label": "Microsoft: manage your availability in your Outlook calendar",
        "url": "https://support.microsoft.com/en-us/office/manage-your-availability-in-your-outlook-calendar-fbbf6d5c-bdb8-4018-a2e0-2e2f60642117"
      }
    ],
    "seeAlso": [
      "what-an-all-day-event-really-means",
      "recurring-events-without-the-mess",
      "drag-an-event-to-move-it"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "outlook-birthday-calendar-from-contacts": {
    "updated": "2026-11-12",
    "seoTitle": "Outlook Birthday Calendar: Turn On, Edit Dates or Remove",
    "title": "Outlook Birthday Calendar: How to Turn On, Fix Dates, or Turn Off",
    "short": "Outlook birthdays",
    "description": "Enable or disable the Outlook birthday calendar, fix wrong birthday dates at their Contact source, and delete duplicate entries in new & classic Outlook.",
    "lede": "Outlook generates its Birthday calendar automatically from birthday fields saved in your Contacts, which can take up to 24 hours to refresh after turning it on. Here is how to toggle the birthday calendar on or off, correct a wrong date without breaking the contact record, and hide unwanted reminders in new and classic Outlook.",
    "commonBelief": "Deleting the birthday calendar deletes the birthdays from my contacts.",
    "sections": [
      {
        "heading": "New Outlook, Outlook.com and Outlook on the web",
        "body": [
          "Turn it on: Calendar, Add calendar, Birthdays, confirm the account and tick Turn on the birthday calendar. Microsoft says events are created for birthdays already in your contacts, and it might take a few hours for them to appear.",
          "Add or change a birthday in People: open the contact, Edit, add the birthday under Others, Save. Microsoft also offers New birthday from the birthday calendar, which opens a contact form. Microsoft notes a delay before a new birthday shows in the calendar.",
          "Hide it by unticking Birthdays under My calendars."
        ]
      },
      {
        "heading": "Classic Outlook",
        "body": [
          "In classic Outlook, open People, edit a contact, then use Contact > Show > Details and enter the Birthday or Anniversary date. Microsoft says these are all-day annually recurring events and reminders are added by default. A separate Birthdays calendar enabled in new Outlook can also appear under My Calendars when you switch back to classic Outlook.",
          "If a Birthdays calendar is listed, hide it by unticking its checkbox, or right-click its name and choose Delete Calendar. Microsoft states that deleting that calendar does not delete contacts or their saved birthdays. Check the selected calendar name before deleting."
        ]
      },
      {
        "heading": "Worked example: a wrong date",
        "body": [
          "A fictional user sees a colleague’s birthday on the wrong day in new Outlook. They open People, find the contact, choose Edit, correct the birthday under Others and save, then check the calendar again later, allowing for Microsoft’s documented delay.",
          "Later they want birthdays off their work calendar view but kept in contacts. They untick Birthdays rather than deleting anything.",
          "Check: the contact still holds the corrected birthday; the calendar shows it on the right date once synced."
        ]
      }
    ],
    "comparison": {
      "heading": "Birthday actions",
      "columns": [
        "Want to",
        "New Outlook / web",
        "Classic Outlook"
      ],
      "rows": [
        {
          "cells": [
            "Turn on",
            "Add calendar → Birthdays → Turn on the birthday calendar",
            "Contact dates create recurring events; a Birthdays calendar enabled in new Outlook can appear here"
          ]
        },
        {
          "cells": [
            "Add or fix a date",
            "People → contact → Edit → Others; or New birthday",
            "Contact → Birthday or Anniversary box"
          ]
        },
        {
          "cells": [
            "Hide",
            "Untick Birthdays under My calendars",
            "Untick Birthdays"
          ]
        },
        {
          "cells": [
            "Remove the calendar",
            "—",
            "Delete Calendar; contacts and saved birthdays kept"
          ]
        },
        {
          "cells": [
            "Expect a delay",
            "Few hours after turning on; some delay after edits",
            "—"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Turn on the birthday calendar in new Outlook or the web; allow a few hours.",
      "Fix dates in the contact, not by creating a separate event.",
      "Hide birthdays by unticking the calendar.",
      "In classic Outlook, deleting the calendar keeps contacts and birthdays."
    ],
    "faq": [
      {
        "q": "I turned on birthdays and nothing appeared.",
        "a": "Microsoft says it might take a few hours for birthdays from your contacts to be added."
      },
      {
        "q": "Will deleting the birthday calendar remove birthdays from contacts?",
        "a": "No. Microsoft says contacts and their saved birthdays are kept."
      }
    ],
    "sourcesHeading": "Microsoft Support page used",
    "sources": [
      {
        "label": "Microsoft: add a birthday calendar and reminder in Outlook",
        "url": "https://support.microsoft.com/en-gb/outlook/calendar/add-a-birthday-calendar-and-reminder-in-outlook"
      },
      {
        "label": "Supporting primary documentation",
        "url": "https://support.microsoft.com/en-us/outlook/calendar/add-a-birthday-calendar-and-reminder-in-outlook"
      }
    ],
    "seeAlso": [
      "what-an-all-day-event-really-means",
      "calendar-notifications-missing-silent-or-duplicated",
      "change-calendar-color-iphone"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "outlook-calendar-sharing-levels-busy-titles-details": {
    "updated": "2026-11-12",
    "seoTitle": "Outlook Calendar Sharing Permissions: Busy vs Titles vs Details",
    "title": "Outlook Calendar Sharing Levels Compared: Busy, Titles & Full Details",
    "short": "Outlook sharing levels",
    "description": "Compare all 5 Outlook calendar sharing levels—Can view when I’m busy, Can view titles and locations, Can view all details, Can edit, and Delegate.",
    "lede": "Microsoft 365 Outlook offers five calendar permission tiers: \"Can view when I’m busy\" reveals only time blocks, \"Can view titles and locations\" hides notes and attendees, \"Can view all details\" exposes subjects and descriptions (except Private items), while \"Can edit\" and \"Delegate\" grant write and invite powers.",
    "commonBelief": "Removing a colleague from my sharing list means they can no longer see anything on my calendar.",
    "sections": [
      {
        "heading": "The levels, in Microsoft’s words",
        "body": [
          "Microsoft lists: Can view when I’m busy (availability without details such as location), Can view titles and locations (availability plus titles and locations), Can view all details, Can edit, and Delegate. Can edit and Delegate are only available when sharing with people in your organisation.",
          "Microsoft also says calendar items marked Private are protected: most people you share with see only the time of a private item, not its title or location, while delegates can be allowed to see details."
        ]
      },
      {
        "heading": "Worked example: one entry, three viewers",
        "body": [
          "A fictional account manager has a non-private entry, “Pricing review — Contoso — Room 3B, 14:00–15:00”. A colleague with Can view when I’m busy sees the busy interval. Can view titles and locations reveals the title and room but not the appointment’s other fields. Can view all details reveals the calendar event’s available details; it does not establish permission to open a separately protected linked document or file.",
          "If the manager marks the entry Private, all three see only that 14:00–15:00 is taken. Choose the lowest level that lets each person do their job: scheduling around you needs only the first."
        ]
      },
      {
        "heading": "The My organization default",
        "body": [
          "Outlook may list a “My organization” entry in sharing. Microsoft describes it as the default level colleagues get, for example when they use the Scheduling Assistant. When you remove a named person, Microsoft says that if My organization is set to anything other than None, that person’s view updates to the default level rather than disappearing.",
          "So a colleague you remove from Can view all details may still see titles and locations if that is your organisation default. Check the My organization row after every removal."
        ]
      },
      {
        "heading": "Change, remove and confirm",
        "body": [
          "In Outlook on the web, right-click the calendar name, choose Sharing and permissions, then select a new level or remove the person. Microsoft notes that calendar sharing may be unavailable for your account or limited to your organisation, depending on organisation settings.",
          "Microsoft’s newer sharing model displays simplified permission levels. Intermediate levels can still be configured by an administrator using mailbox-folder permission commands and appear as Custom. Client interfaces may allow an attempted action that the service then rejects; the service evaluates the underlying rights. Ask the administrator what the effective grant allows rather than treating every Custom level as unsupported."
        ]
      },
      {
        "heading": "How recipients receive your calendar",
        "body": [
          "In the newer Exchange Online model, a copy of the shared calendar is held in the recipient’s mailbox. Instant syncing is supported for specified configurations, including users within the same Microsoft 365 tenant, and supported Outlook, REST and Exchange ActiveSync applications. It is not universal for cross-tenant sharing. Microsoft says EWS does not support instant syncing; that is not a statement that EWS cannot access calendars at all. After an automatic upgrade, the copy includes the previous year and future events, including recurring series with relevant instances.",
          "Microsoft also warns that some Exchange ActiveSync apps let a read-only recipient try to create or respond to a meeting on your calendar; the change saves locally and is then rejected by the server. A recipient who “edited” your calendar on a phone may simply be seeing a rejected local change."
        ]
      }
    ],
    "comparison": {
      "heading": "What each level reveals",
      "columns": [
        "Level",
        "Busy times",
        "Title and location",
        "Notes and other details",
        "Can change items",
        "Outside organisation?"
      ],
      "rows": [
        {
          "cells": [
            "Can view when I’m busy",
            "Yes",
            "No",
            "No",
            "No",
            "Yes, if allowed by the organisation"
          ]
        },
        {
          "cells": [
            "Can view titles and locations",
            "Yes",
            "Yes",
            "No",
            "No",
            "Yes, if allowed by the organisation"
          ]
        },
        {
          "cells": [
            "Can view all details",
            "Yes",
            "Yes",
            "Yes",
            "No",
            "Yes, if allowed by the organisation"
          ]
        },
        {
          "cells": [
            "Can edit",
            "Yes",
            "Yes",
            "Yes",
            "Yes",
            "No"
          ]
        },
        {
          "cells": [
            "Delegate",
            "Yes",
            "Yes",
            "Yes, plus private items if allowed",
            "Yes, and handles meetings",
            "No"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Decide what each colleague needs: availability, titles and places, or full details.",
      "Grant the lowest level that does that job.",
      "Mark sensitive entries Private; most viewers then see only the time.",
      "After removing anyone, check the My organization default.",
      "If a grant appears as Custom, ask the administrator what the actual permission permits; clients and the service may handle attempted actions differently."
    ],
    "faq": [
      {
        "q": "Can “Can view when I’m busy” reveal where I am?",
        "a": "Microsoft describes it as showing availability without details such as location. Titles and locations require the next level."
      },
      {
        "q": "I removed someone but they still see my appointment titles. Why?",
        "a": "Microsoft says removed people fall back to the My organization default if it is set above None. Lower or remove that default."
      },
      {
        "q": "A colleague with view access says they moved my meeting on their phone.",
        "a": "Microsoft notes that some ActiveSync apps let read-only recipients make local changes that the server then rejects. Check your calendar in Outlook."
      }
    ],
    "sourcesHeading": "Microsoft Support pages used",
    "sources": [
      {
        "label": "Microsoft: share your calendar in Outlook on the web",
        "url": "https://support.microsoft.com/en-us/outlook/share-your-calendar-in-outlook-on-the-web"
      },
      {
        "label": "Microsoft: calendar sharing in Microsoft 365",
        "url": "https://support.microsoft.com/en-us/outlook/calendar-sharing-in-microsoft-365"
      },
      {
        "label": "Microsoft: best practices for organisations using the Outlook calendar",
        "url": "https://support.microsoft.com/en-us/outlook/best-practices-for-organizations-when-using-the-outlook-calendar"
      }
    ],
    "seeAlso": [
      "who-can-see-what-in-google-calendar",
      "taking-back-a-calendar-you-shared",
      "a-calendar-that-is-yours-to-share",
      "exchange-calendars-on-an-iphone"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here.",
    "galleryAfterContent": true
  },
  "google-calendar-response-emails-outlook-rsvp": {
    "updated": "2026-10-23",
    "title": "Outlook RSVP missing in Google Calendar? Check the event’s response-email switch",
    "short": "Outlook RSVP missing in Google Calendar? Check the event’s response-email switch",
    "description": "Check Google’s per-event guest-response email choice before assuming missing Outlook RSVPs mean guests ignored the meeting.",
    "lede": "Turning off response emails for a Google Calendar event can affect more than inbox noise. Google’s current help says this event-level choice also stops third-party RSVP statuses, including Outlook replies. Inspect that setting before treating an unknown response as proof that a guest did not reply.",
    "sections": [
      {
        "heading": "Identify the exact meeting and response source",
        "body": [
          "Open the organizer’s original event on a computer and confirm the calendar, date and intended guest address. A copied appointment or a forwarded message may not describe the invitation you are trying to reconcile.",
          "For a fictional workshop, one guest uses Google Calendar and another uses Outlook. The organizer reduced response emails before sending the invitation. Record each guest’s service and observed response state separately; do not assume a single blank row has the same explanation for both people."
        ]
      },
      {
        "heading": "Distinguish event-level and calendar-wide controls",
        "body": [
          "In Google Calendar on a computer, create or edit the actual event, inspect “Get an email when guests respond,” then click Save after any intended change. Google says this checkbox applies to one event or its recurring series. It is separate from Settings for my calendars > the calendar > Other notifications > Event responses. Do not infer the event checkbox’s state merely from that calendar-wide preference or a phone sound setting.",
          "The official help explicitly says disabling this event-level option stops response mail, third-party RSVP statuses and automatic replies. It says Google Calendar guests’ statuses can still be inspected, while guests using services such as Outlook cannot be checked that way with the option off."
        ]
      },
      {
        "heading": "Use a response evidence ledger",
        "body": [
          "For the workshop, keep columns for guest identity, service, response communicated directly, and status currently observed on the organizer’s event. If the Outlook participant confirms acceptance by another channel, record that as direct confirmation rather than inventing a calendar status.",
          "If you intentionally change the event’s response-email choice, save it and use a cooperative non-sensitive test or the provider’s current support route to check future behavior. The source does not promise that turning the switch back on reconstructs every historical reply, so do not state that as the expected repair."
        ]
      },
      {
        "heading": "Keep attendance and access out of the diagnosis",
        "body": [
          "A guest may be able to read the event yet have an unknown response; another may have replied earlier to a time that has since changed. Ask for the attendance decision that matters now instead of treating successful access or a quiet inbox as a headcount.",
          "This is a Google event response setting. It is not a Cloud Calendars share acceptance, a Microsoft delegate permission or a general ban on Outlook invitations. Preserve the event and identity evidence while diagnosing the specific route."
        ]
      }
    ],
    "comparison": {
      "heading": "The fictional workshop’s response ledger",
      "columns": [
        "Guest service",
        "Observation with event emails off",
        "Responsible interpretation"
      ],
      "rows": [
        {
          "cells": [
            "Google Calendar",
            "Status may still be inspected in the guest list",
            "Check the original organizer event"
          ]
        },
        {
          "cells": [
            "Outlook or another third-party calendar",
            "Google documents missing RSVP status in this case",
            "Unknown status is not proof of no reply"
          ]
        },
        {
          "cells": [
            "Direct message confirmation",
            "A separate human response",
            "Record its date without fabricating a calendar status"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Identify the organizer’s original event and invited address.",
      "Inspect the event-level response-email checkbox.",
      "Record Google and third-party guest observations separately.",
      "Confirm important attendance directly and avoid promising historical reply backfill."
    ],
    "faq": [
      {
        "q": "Is the per-event checkbox the same as global response-email settings?",
        "a": "Google says they are separate. Inspect the choice on the actual event or series."
      },
      {
        "q": "Will re-enabling it recover all earlier Outlook replies?",
        "a": "The cited help does not establish historical backfill. Verify current behavior and confirm important attendance with the guest."
      }
    ],
    "sourcesHeading": "Official Google documentation checked",
    "sources": [
      {
        "label": "Google Calendar Help: Track responses to your event",
        "url": "https://support.google.com/calendar/answer/16713792?hl=en"
      }
    ],
    "articleLinks": [
      {
        "slug": "keeping-track-of-who-replied",
        "label": "Keep attendance evidence separate"
      },
      {
        "slug": "calendar-notifications-missing-silent-or-duplicated",
        "label": "Diagnose timed reminders on the phone"
      },
      {
        "slug": "what-guests-can-do-to-your-event",
        "label": "Distinguish reply tracking from guest permissions"
      }
    ],
    "seeAlso": [
      "keeping-track-of-who-replied",
      "calendar-notifications-missing-silent-or-duplicated",
      "what-guests-can-do-to-your-event"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "outlook-show-as-free-busy-tentative-working-elsewhere": {
    "updated": "2026-11-12",
    "seoTitle": "Outlook \"Working Elsewhere\" vs Free, Busy & Tentative",
    "title": "Outlook Show As: Working Elsewhere, Tentative, Free & Busy Explained",
    "short": "Outlook Show As statuses",
    "description": "See exactly what colleagues view when you set an Outlook event to Working Elsewhere, Tentative, Free, Busy, or Out of Office in Scheduling Assistant.",
    "lede": "In Outlook, Show As controls how your time blocks appear to colleagues in Scheduling Assistant: Busy and Out of Office block booking slots, while Free, Tentative, and Working Elsewhere signal different availability levels. Choose the status that matches whether others should still invite you during that window.",
    "commonBelief": "Out of office and Working elsewhere both just mean “not at my desk”.",
    "sections": [
      {
        "heading": "The five statuses",
        "body": [
          "Microsoft says appointments can be marked free, busy, tentative, out of the office or working elsewhere. Its developer reference defines them plainly: Free means available; Tentative means a tentative appointment is scheduled; Busy means busy; Out of office means out of the office; Working elsewhere means working in a location away from the office.",
          "Microsoft states this choice affects the free/busy time others see when they try to schedule a meeting with you. It also says that, by default, when you add an item or accept an invitation in classic Outlook, the item is marked Busy."
        ]
      },
      {
        "heading": "Change the status of one item",
        "body": [
          "In classic Outlook or new Outlook for Windows, right-click the item on your calendar, choose Show As, then the status. Do this for entries that should not block bookings, such as a reminder to submit expenses, which would otherwise default to Busy.",
          "Read the status name and pattern in your actual client rather than relying on a universal colour. Microsoft’s Scheduling Assistant guidance illustrates busy and tentative with blue patterns, while its new Outlook availability page says Busy, Tentative and Working elsewhere colours adjust to the chosen calendar colour. A different palette is not itself evidence of a different availability state.",
          "In new Outlook, changing an item’s availability after the initial invitation changes your calendar only. Microsoft says the organiser cannot rewrite every participant’s availability after that first invitation; attendees can customise their own. Verify the owner’s actual free/busy result rather than expecting your Show As edit to change everyone."
        ]
      },
      {
        "heading": "For whole periods away: automatic replies",
        "body": [
          "For Outlook.com and Outlook on the web, Microsoft’s automatic replies settings include three calendar options alongside the reply message: “Block my calendar for this period”, “Automatically decline new invitations for events that occur during this period”, and “Decline and cancel my meetings during this period”. You can limit replies to a time period, and choose whether replies go outside your organisation.",
          "The third option affects other people’s calendars, not just yours. Read the confirmation and consider telling attendees of meetings you organise before using it."
        ]
      },
      {
        "heading": "Worked example: one illustrative week",
        "body": [
          "A fictional consultant marks Monday’s client workshop Busy. Tuesday they add a Working elsewhere label for a day at a partner’s site. That communicates a location category; it does not enforce room-booking rules or establish whether another booking system treats it as unavailable. Wednesday’s optional vendor demo is Tentative. A Thursday lunchtime personal reminder is Free because it should not protect a meeting slot.",
          "For leave from the start of Friday through the end of the following Monday, including the weekend, the consultant chooses an explicit automatic-reply time interval. They select Block my calendar for this period and Automatically decline new invitations. They leave Decline and cancel my meetings unticked because a recurring team meeting they organise should continue without them.",
          "Check the saved status names and patterns in the actual Outlook client and compare the intended calendar’s availability using an agreed test. Do not require a particular blue colour or infer room restrictions from Working elsewhere."
        ]
      }
    ],
    "comparison": {
      "heading": "Pick the status",
      "columns": [
        "Situation",
        "Status or setting",
        "Effect for schedulers"
      ],
      "rows": [
        {
          "cells": [
            "Committed meeting or focused work",
            "Busy",
            "Shown as busy"
          ]
        },
        {
          "cells": [
            "Unconfirmed or optional",
            "Tentative",
            "Shown as tentative; the pattern and colour depend on the client and selected calendar colour"
          ]
        },
        {
          "cells": [
            "Personal reminder that should not block",
            "Free",
            "Time shows as available"
          ]
        },
        {
          "cells": [
            "Working, but away from your usual office",
            "Working elsewhere",
            "Not out, but not in the usual location"
          ]
        },
        {
          "cells": [
            "Away from work",
            "Out of office",
            "Unavailable"
          ]
        },
        {
          "cells": [
            "Several days away with declines",
            "Automatic replies with calendar options",
            "Blocks time and can decline new invitations"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Review items that defaulted to Busy and change reminders to Free.",
      "Use Working elsewhere to communicate working away; check actual room and booking arrangements separately.",
      "Use Tentative for meetings you may attend.",
      "For leave, use automatic replies with “Block my calendar” and “Automatically decline new invitations”.",
      "Only use “Decline and cancel my meetings” after considering the attendees of meetings you organise.",
      "Check the status and free/busy result in the actual client, remembering that your later Show As change does not rewrite every attendee’s calendar."
    ],
    "faq": [
      {
        "q": "Why does everything I accept show as Busy?",
        "a": "Microsoft says that, by default in classic Outlook, items you add or invitations you accept are marked Busy. Change individual items with Show As."
      },
      {
        "q": "What does Tentative mean on an Outlook calendar?",
        "a": "Microsoft defines Tentative as showing that a tentative appointment is scheduled for that slot rather than confirmed Free or Busy time."
      },
      {
        "q": "What is the difference between Working elsewhere and Out of office?",
        "a": "Microsoft defines Working elsewhere as working away from the office and Out of office as out of the office. Use the first when you are still working."
      },
      {
        "q": "Will automatic replies cancel my meetings?",
        "a": "Only if you choose “Decline and cancel my meetings during this period”. Blocking your calendar and declining new invitations are separate options."
      }
    ],
    "sourcesHeading": "Microsoft pages used",
    "sources": [
      {
        "label": "Microsoft: manage your availability in your Outlook calendar",
        "url": "https://support.microsoft.com/en-us/office/manage-your-availability-in-your-outlook-calendar-fbbf6d5c-bdb8-4018-a2e0-2e2f60642117"
      },
      {
        "label": "Microsoft Learn: OlBusyStatus definitions",
        "url": "https://learn.microsoft.com/en-us/office/vba/api/Outlook.OlBusyStatus"
      },
      {
        "label": "Microsoft: get started with the Outlook calendar",
        "url": "https://support.microsoft.com/en-gb/outlook/get-started-with-the-outlook-calendar"
      },
      {
        "label": "Microsoft: automatic replies in Outlook.com and Outlook on the web",
        "url": "https://support.microsoft.com/en-US/Outlook/send-automatic-out-of-office-replies-from-outlook-com-or-outlook-on-the-web"
      },
      {
        "label": "Microsoft: Scheduling Assistant and Room Finder",
        "url": "https://support.microsoft.com/en-us/outlook/use-the-scheduling-assistant-and-room-finder-for-meetings-in-outlook"
      }
    ],
    "seeAlso": [
      "what-an-all-day-event-really-means",
      "exchange-calendars-on-an-iphone",
      "work-and-personal-without-two-apps"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here.",
    "galleryAfterContent": true
  },
  "outlook-work-hours-and-location": {
    "updated": "2026-11-04",
    "title": "Set Working Hours & Office/Remote Location in Outlook",
    "short": "Outlook work hours and location",
    "description": "Configure recurring daily working hours and office or remote locations in new Outlook or Outlook on the web, and see how classic Outlook displays them.",
    "lede": "Outlook’s work hours and location setting tells colleagues which days you are in the office and when you work. It can only be set in some clients and shows up approximately in others. Arte Soft, the developer of Cloud Calendars, explains what Microsoft documents.",
    "commonBelief": "I can set this anywhere I use Outlook, and everyone sees exactly my hours.",
    "sections": [
      {
        "heading": "Who can set it, and where",
        "body": [
          "Microsoft says recurring work-hours setup is for work or school accounts with a qualifying Microsoft 365 subscription. Its documented recurring-plan setup is in new Outlook for Windows or Outlook on the web; classic Outlook can display work hours and location. The page separately documents changing today’s location from Teams, so that daily override should not be confused with configuring the full recurring plan. Microsoft also notes that the feature is not yet available for classic Outlook for Windows with GCC High."
        ]
      },
      {
        "heading": "Set your weekly plan",
        "body": [
          "Go to Settings, Calendar, Work hours and location. Tick the days you work, choose hours and a location for each (remote, office, or a specific building if your organisation has set up a building directory), optionally tick Share office location details, and Save. Microsoft also offers a no-location choice if you prefer not to share.",
          "For one-off changes in the documented Outlook calendar workflow, open Work plan, adjust the relevant days or location and select Set. Microsoft says you can clear a location by deselecting it. For a Teams daily override, use the profile-picture menu: Microsoft says that location applies for the remainder of the working day and is reflected in Outlook and Teams. Availability of controls depends on the client and organisation."
        ]
      },
      {
        "heading": "Who sees it",
        "body": [
          "Microsoft says others see which days you work remotely or in the office. Your work location appears in the Scheduling Assistant and on your profile card next to your availability, and the daily location card shows who else is going in."
        ]
      },
      {
        "heading": "How classic Outlook approximates it",
        "body": [
          "Microsoft says the legacy experience supports only one start and end time for the whole week, so it approximates: with 08:00–17:00 on some days and 10:00–19:00 on others, legacy shows 08:00–19:00. Colleagues on classic clients may therefore see a wider working window than your real hours. Microsoft adds that a change to the legacy working-hours time zone updates the modern one."
        ]
      },
      {
        "heading": "Worked example: a hybrid week",
        "body": [
          "A fictional consultant works Monday and Wednesday in Building 2 from 08:00 to 17:00, and Tuesday and Thursday remotely from 10:00 to 19:00; Friday off. In Outlook on the web they set each day and Save.",
          "A colleague in classic Outlook sees their hours as 08:00–19:00 every working day, per Microsoft’s approximation, so the consultant adds a note in team chat that remote days start at 10:00. When the consultant goes in on one Thursday, they change just that day through Work plan.",
          "Check: open a test meeting in the Scheduling Assistant and confirm your location shows for each day."
        ]
      }
    ],
    "comparison": {
      "heading": "Where you can set and see it (per Microsoft)",
      "columns": [
        "Client",
        "Set work hours and location",
        "View"
      ],
      "rows": [
        {
          "cells": [
            "New Outlook for Windows",
            "Yes (work/school, qualifying subscription)",
            "Yes"
          ]
        },
        {
          "cells": [
            "Outlook on the web",
            "Yes",
            "Yes"
          ]
        },
        {
          "cells": [
            "Classic Outlook for Windows",
            "No",
            "Yes, hours approximated to one weekly range"
          ]
        },
        {
          "cells": [
            "Teams",
            "Full recurring-plan setup not established here",
            "Today’s location can be changed from profile menu"
          ]
        },
        {
          "cells": [
            "Outlook for Mac / mobile",
            "Not documented as the recurring-plan setup route on this page",
            "Check the current client; source has rollout qualifications"
          ]
        },
        {
          "cells": [
            "Personal Outlook.com account",
            "No",
            "—"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Use new Outlook or Outlook on the web with a work or school account.",
      "Set hours and location for each working day; Save.",
      "Use Work plan for one-off changes.",
      "Choose no location if you don’t want to share it.",
      "Tell classic-Outlook colleagues if your hours vary by day."
    ],
    "faq": [
      {
        "q": "Why can’t I find Work hours and location in classic Outlook?",
        "a": "Microsoft says you must set it in new Outlook or Outlook on the web; classic Outlook can only view it."
      },
      {
        "q": "Why do colleagues see longer hours than I set?",
        "a": "Microsoft says classic clients show a single weekly range spanning your earliest start and latest end."
      }
    ],
    "sourcesHeading": "Microsoft Support page used",
    "sources": [
      {
        "label": "Microsoft: set your work hours and location in Outlook",
        "url": "https://support.microsoft.com/en-gb/office/learn-more-about-work-hours-in-outlook-af2fddf9-249e-4710-9c95-5911edfd76f6"
      }
    ],
    "seeAlso": [
      "work-and-personal-without-two-apps",
      "exchange-calendars-on-an-iphone",
      "planning-a-week-in-ten-minutes"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "overnight-shift-crossing-midnight-calendar-end-date": {
    "updated": "2026-10-23",
    "title": "Overnight shift calendar: put the end on the next date",
    "short": "Overnight shift calendar",
    "description": "Enter a night shift that crosses midnight with the correct start date, next-day end and a checkable interval instead of an all-day label.",
    "lede": "An overnight shift is one timed interval across two dates. If you start Monday evening and finish Tuesday morning, both dates belong in the event details. A roster’s label is not a substitute for those endpoints.",
    "sections": [
      {
        "heading": "Write the two endpoints before creating the event",
        "body": [
          "Suppose the approved shift is Monday 2 November 2026, 19:00, to Tuesday 3 November, 07:00, in America/New_York. This particular interval is 12 elapsed hours. Using 07:00 on Monday as the end would place the endpoint before the start.",
          "Give the event a label that makes its convention clear, such as Monday night: 19:00–Tuesday 07:00. A workplace might call it Tuesday’s shift; keep that reference in the title or notes while preserving the actual start date."
        ]
      },
      {
        "heading": "Check details rather than the month-grid shape",
        "body": [
          "A calendar can draw a cross-midnight event differently in month, week or agenda views. Open the saved event and verify its dates, times and zone. A short bar or a split visual segment does not by itself prove the stored interval is wrong.",
          "An all-day event is a date-based item, not an exact night-shift block. A label covering Monday and Tuesday can provide context, but it cannot replace a 19:00–07:00 timed record when someone needs to know which hours are occupied."
        ]
      },
      {
        "heading": "Repeat the start pattern and audit transitions",
        "body": [
          "In iCalendar, DTSTART identifies a recurring series’ first start; any BYDAY selection refers to occurrence starts. A Sunday-night start therefore belongs to Sunday even when most of its hours fall on Monday. The standard allows DTEND or DURATION; DTEND is not mandatory for every timed event.",
          "For repeated shifts, inspect the first occurrence after midnight and the next daylight-saving weekend. The same displayed start and end hours can represent seven, eight, nine or other elapsed lengths depending on the actual interval and zone rules. Use the approved endpoints rather than silently compensating an hour."
        ]
      }
    ],
    "comparison": {
      "heading": "Worked example to check against your calendar",
      "columns": [
        "Record",
        "Start",
        "End"
      ],
      "rows": [
        {
          "cells": [
            "Correct timed shift",
            "2 November 2026, 19:00",
            "3 November 2026, 07:00"
          ]
        },
        {
          "cells": [
            "Incorrect same-date endpoint",
            "2 November, 19:00",
            "2 November, 07:00"
          ]
        },
        {
          "cells": [
            "All-day context label",
            "Date-based",
            "Does not express exact working hours"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Write both dates, both times and the location’s time zone.",
      "Save a single occurrence before repeating it.",
      "Reopen it in event details and verify the following-date end.",
      "Check one cross-midnight repeat and any clock-change occurrence."
    ],
    "faq": [
      {
        "q": "Should the event be split into two?",
        "a": "One continuous interval can cross midnight. Split it only when the underlying schedule actually has separate periods or your workflow requires separate records."
      },
      {
        "q": "Does an off day mean no shift appears on that date?",
        "a": "Not always: the previous night’s event can end that morning."
      }
    ],
    "sourcesHeading": "Sources and verification",
    "sources": [
      {
        "label": "RFC 5545: event start and end",
        "url": "https://www.rfc-editor.org/rfc/rfc5545.html#section-3.6.1"
      },
      {
        "label": "Google Calendar: event time zones",
        "url": "https://support.google.com/calendar/answer/37064?hl=en"
      }
    ],
    "articleLinks": [
      {
        "slug": "shift-work-calendar-iphone-rotating-schedules",
        "label": "Shift Work Calendar on iPhone: Rotating Schedules and Family Sharing"
      },
      {
        "slug": "what-an-all-day-event-really-means",
        "label": "What an All-Day Event Really Means"
      },
      {
        "slug": "a-week-view-that-fits-a-week",
        "label": "A Week View That Fits a Week"
      }
    ],
    "seeAlso": [
      "shift-work-calendar-iphone-rotating-schedules",
      "what-an-all-day-event-really-means",
      "a-week-view-that-fits-a-week"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "google-appointment-payments-stripe-refunds": {
    "updated": "2026-10-23",
    "title": "Paid Google appointments: separate booking cancellation from a Stripe refund",
    "short": "Paid Google appointments",
    "description": "Set up an eligible paid Google booking workflow and keep cancellation, Stripe refunds and payment requirements separate.",
    "lede": "A cancelled appointment is not automatically a refunded payment. If you use Google Calendar’s eligible paid appointment schedules, trace the booking and the Stripe payment as separate records. That distinction matters both when introducing a paid service and when a customer later cancels.",
    "sections": [
      {
        "heading": "Check the feature and the responsible accounts",
        "body": [
          "Google describes paid appointments as an eligible Workspace premium feature, controlled by an administrator in managed organizations. Stripe must be connected. A missing payment option is therefore an eligibility or account question before it is a booking-form fault.",
          "For a fictional tutoring service, write down who owns the Google schedule, who manages the connected Stripe account and who handles customer questions. This responsibility record does not require storing card details. Check the actual account’s current availability rather than assuming that a calendar app subscription enables Google payments."
        ]
      },
      {
        "heading": "Configure a deliberate paid offering",
        "body": [
          "Google’s computer workflow connects Stripe under Settings, General, Appointment schedules. In the intended schedule, its payment-and-cancellation section lets you require payment, enter an amount and currency, and add a cancellation policy before saving. Review the public booking form as well as the owner’s editor.",
          "Use a clearly identified service rather than copying an unrelated appointment. Before sharing, check duration, displayed service name, price/currency and the policy wording you intend customers to see. The checklist is operational; it does not prescribe a legally sufficient policy or recommend a price."
        ]
      },
      {
        "heading": "Keep a cancellation and refund ledger",
        "body": [
          "Suppose the fictional service receives a cancellation for a Tuesday lesson. Record the appointment identifier, cancellation date, payment reference and person handling the request. A calendar cancellation can settle the scheduling record while the money question is still unresolved.",
          "Google says refunds are handled in Stripe and are not processed automatically when either side cancels. An organizer uses the Stripe dashboard; a customer reviews the organizer’s policy and contacts them. Mark the refund field pending until the responsible person checks the actual payment record, rather than inferring it from an empty calendar slot."
        ]
      },
      {
        "heading": "Treat disconnecting payments as a broader change",
        "body": [
          "Google warns that disconnecting Stripe removes payment requirements from all appointment schedules. Before doing that, inventory the schedules that currently depend on payment and decide what should replace that arrangement. Do not disconnect merely to repair one customer’s cancellation.",
          "After any intended change, inspect the booking page and retain the relevant payment references privately. This workflow belongs to Google and Stripe. It does not establish paid booking, refund or payment-card controls inside Cloud Calendars."
        ]
      }
    ],
    "comparison": {
      "heading": "A fictional paid-lesson status sheet",
      "columns": [
        "Record",
        "Question to settle",
        "Completion evidence"
      ],
      "rows": [
        {
          "cells": [
            "Appointment",
            "Was the booking cancelled?",
            "Organizer’s saved calendar state"
          ]
        },
        {
          "cells": [
            "Payment",
            "Was money actually returned?",
            "Stripe refund record, where applicable"
          ]
        },
        {
          "cells": [
            "Future bookings",
            "Is payment still required?",
            "Current intended schedule configuration"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Confirm Google eligibility, administrator allowance and Stripe ownership.",
      "Review the intended schedule’s payment requirement and public form.",
      "Track appointment cancellation separately from the payment reference.",
      "Verify a refund in the payment system rather than assuming cancellation caused it."
    ],
    "faq": [
      {
        "q": "Does cancelling a Google appointment refund the customer?",
        "a": "Google says the refund is not automatic. Follow the organizer’s stated process and check the Stripe payment record."
      },
      {
        "q": "Can disconnecting Stripe fix only one paid schedule?",
        "a": "Google warns that disconnecting removes payment requirements from all appointment schedules. Review the full affected set first."
      }
    ],
    "sourcesHeading": "Official Google documentation checked",
    "sources": [
      {
        "label": "Google Calendar Help: Require payments for appointments",
        "url": "https://support.google.com/calendar/answer/13762729?hl=en"
      }
    ],
    "articleLinks": [
      {
        "slug": "booking-link-or-shared-calendar",
        "label": "Choose a booking workflow rather than a shared calendar"
      },
      {
        "slug": "keeping-track-of-who-replied",
        "label": "Distinguish replies from completed arrangements"
      },
      {
        "slug": "calendar-event-or-room-reservation",
        "label": "Confirm any separate resource reservation"
      }
    ],
    "seeAlso": [
      "booking-link-or-shared-calendar",
      "keeping-track-of-who-replied",
      "calendar-event-or-room-reservation"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "non-dst-time-zone-arizona-hawaii-recurring-calendar": {
    "updated": "2026-10-23",
    "title": "Phoenix and Hawaii meeting times: use the right city zone",
    "short": "Phoenix and Hawaii meeting times",
    "description": "Compare Phoenix and Honolulu meetings with seasonal New York, Denver and Los Angeles times using dated 2026 examples.",
    "lede": "Phoenix and Honolulu do not follow the same seasonal clock changes as New York or Denver under the current rules. A city-based time zone helps preserve the intended local meeting hour; a familiar regional abbreviation can conceal the difference.",
    "sections": [
      {
        "heading": "Choose the location, not a shorthand",
        "body": [
          "The US Naval Observatory says Hawaii and most of Arizona observe standard time only. That is not a statement that every Arizona location follows Phoenix. Confirm the actual meeting location, then select its supported geographic zone.",
          "For the Phoenix examples use America/Phoenix, not America/Denver. Both have UTC−07:00 in January 2026, but Denver changes to UTC−06:00 in July while Phoenix stays at UTC−07:00. Honolulu uses Pacific/Honolulu and stays UTC−10:00 throughout these examples."
        ]
      },
      {
        "heading": "Compare winter and summer occurrences",
        "body": [
          "A recurring 09:00 Phoenix meeting appears at 11:00 New York on 14 January 2026 and 12:00 there on 15 July. It is 06:00 Honolulu on both dates. Los Angeles matches Phoenix’s displayed hour in July, but is one hour earlier in January.",
          "Those are calculations for the specified dates using current time-zone data. They do not mean an offset can never change in the future, or that all cities switch clocks on the US dates. Preserve the named zone and check the actual occurrence year."
        ]
      },
      {
        "heading": "Audit the event, then its display",
        "body": [
          "Google documents separate calendar and event time-zone settings. A viewer changing their display zone does not necessarily change the saved event’s anchor. Open the event details, check its geographic zone, and compare a January and July occurrence before changing any times.",
          "If the event is owned by someone else, provide the exact date and expected local time for the meeting location. Avoid editing your copy as if it were the source schedule. For travel, also check whether your device uses an automatic local display zone or a fixed override."
        ]
      }
    ],
    "comparison": {
      "heading": "Worked example to check against your calendar",
      "columns": [
        "09:00 Phoenix on",
        "New York",
        "Denver",
        "Los Angeles",
        "Honolulu"
      ],
      "rows": [
        {
          "cells": [
            "14 January 2026",
            "11:00",
            "09:00",
            "08:00",
            "06:00"
          ]
        },
        {
          "cells": [
            "15 July 2026",
            "12:00",
            "10:00",
            "09:00",
            "06:00"
          ]
        },
        {
          "cells": [
            "4 November 2026",
            "11:00",
            "09:00",
            "08:00",
            "06:00"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Confirm the actual location, including any regional exception.",
      "Inspect the event’s named zone.",
      "Compare a winter and summer occurrence.",
      "Ask the organizer before altering a shared series."
    ],
    "faq": [
      {
        "q": "Is Mountain Time enough information?",
        "a": "Not always. Phoenix and Denver have different summer behavior; select the actual supported location."
      },
      {
        "q": "Does Hawaii shift when New York changes clocks?",
        "a": "Not in the current rules used by these 2026 examples. Their relative time difference therefore changes."
      }
    ],
    "sourcesHeading": "Sources and verification",
    "sources": [
      {
        "label": "US Naval Observatory: Hawaii and most Arizona exemptions",
        "url": "https://aa.usno.navy.mil/faq/daylight_time"
      },
      {
        "label": "Google Calendar: calendar versus event zones",
        "url": "https://support.google.com/calendar/answer/37064?hl=en"
      },
      {
        "label": "IANA: geographic time-zone data",
        "url": "https://www.iana.org/time-zones"
      }
    ],
    "articleLinks": [
      {
        "slug": "time-zones-and-the-flight-you-booked",
        "label": "Time Zones and the Flight You Booked"
      },
      {
        "slug": "when-two-calendars-disagree",
        "label": "When Two Calendars Disagree"
      },
      {
        "slug": "recurring-events-without-the-mess",
        "label": "Recurring Events Without the Mess"
      }
    ],
    "seeAlso": [
      "time-zones-and-the-flight-you-booked",
      "when-two-calendars-disagree",
      "recurring-events-without-the-mess"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "google-calendar-print-date-range": {
    "updated": "2026-10-23",
    "title": "Print a Google Calendar: choose the range, the calendars and the details",
    "short": "Print Google Calendar",
    "description": "Print or save a Google Calendar as PDF: set the date range with the view, hide calendars you don’t want, and choose whether descriptions are included.",
    "lede": "Google Calendar prints what you are looking at, so the view and the ticked calendars decide what ends up on paper. A quick check before printing avoids handing out private appointments. Arte Soft, the developer of Cloud Calendars, wrote this guide.",
    "commonBelief": "Printing gives a fixed monthly layout of everything in my account.",
    "sections": [
      {
        "heading": "Set the range and calendars",
        "body": [
          "On a computer, pick a view at the top right: Day, Week, Month, Schedule or 4 days. That sets the range. In the left list, untick calendars you don’t want; Google says a calendar without a check mark is hidden."
        ]
      },
      {
        "heading": "Open print preview",
        "body": [
          "Click Settings menu > Print to inspect the preview. Google documents font, orientation, weekends and colour options. For the specific Print descriptions and Print your response controls, its instructions first switch the view to Schedule, then open Print. Do not assume those detail controls appear in every grid view. Event locations or rooms may also appear when space permits.",
          "Leave descriptions off for anything handed to others; notes often hold phone numbers, links or private context.",
          "Changing font size can improve readability, but Google says it does not change the number of days on the page. Choose the view and period separately, then inspect the actual preview rather than infer a new date range from larger text."
        ]
      },
      {
        "heading": "Worked example: a fridge calendar for a family",
        "body": [
          "A fictional parent prints next month’s family schedule. They choose Month view, tick only Family and School term dates, and untick their work calendar and Birthdays. In preview they pick Landscape, a larger font, and leave Print descriptions off.",
          "For a babysitter who needs pickup notes, the parent switches to Schedule, opens Print and chooses Print descriptions only after reviewing the notes. They verify the intended dates in that preview rather than assume a Week grid has the same controls. The printed details are restricted to what the babysitter actually needs.",
          "Check: read the preview for any private title before clicking Print."
        ]
      },
      {
        "heading": "After printing",
        "body": [
          "A printout does not update. Date it, and reprint after changes. Re-tick the calendars you hid so your normal view returns."
        ]
      }
    ],
    "comparison": {
      "heading": "Print checklist",
      "columns": [
        "Setting",
        "Where",
        "Tip"
      ],
      "rows": [
        {
          "cells": [
            "Date range",
            "View: Day, Week, Month, Schedule, 4 days",
            "Navigate to the period first"
          ]
        },
        {
          "cells": [
            "Calendars",
            "Left list check marks",
            "Untick work and personal calendars"
          ]
        },
        {
          "cells": [
            "Layout",
            "Preview: font size, orientation, weekends",
            "Landscape for Month"
          ]
        },
        {
          "cells": [
            "Details",
            "Schedule view > Print > Print descriptions / Print your response",
            "Off for wide audiences"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Choose the view and navigate to the dates.",
      "Untick calendars that shouldn’t appear.",
      "Open Settings menu → Print.",
      "Set supported layout options;for descriptions and response details, use the documented Schedule-view print workflow.",
      "Decide on descriptions; review the preview.",
      "Re-tick hidden calendars afterwards."
    ],
    "faq": [
      {
        "q": "How do I print just one calendar?",
        "a": "Untick the others in the left list; Google says calendars without a check mark are hidden."
      },
      {
        "q": "Can I leave out weekends?",
        "a": "Yes. Deselect Show weekends in print preview."
      }
    ],
    "sourcesHeading": "Google Calendar Help page used",
    "sources": [
      {
        "label": "Google: print your calendar",
        "url": "https://support.google.com/calendar/answer/41067?hl=en"
      }
    ],
    "seeAlso": [
      "calendar-export-ics-pdf-and-backup",
      "month-view-on-a-bigger-screen",
      "family-pickup-calendar-handoff"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "outlook-print-calendar-styles": {
    "updated": "2026-11-12",
    "seoTitle": "How to Print an Outlook Calendar Without Cut-Off Titles",
    "title": "How to Print an Outlook Calendar (Full Event Titles & PDF Styles)",
    "short": "Print an Outlook calendar",
    "description": "Stop Outlook from cutting off meeting titles when printing or saving to PDF: choose Weekly Agenda Style in classic Outlook or Detailed view in new Outlook.",
    "lede": "If printed Outlook calendars chop off long meeting titles, switch the layout before printing or exporting to PDF: use Weekly Agenda Style or Tri-fold Style in classic desktop Outlook, or select the Detailed / Agenda print view in new Outlook, Outlook on the web, and Mac.",
    "commonBelief": "Any Outlook print style shows full meeting titles and details.",
    "sections": [
      {
        "heading": "New Outlook for Windows",
        "body": [
          "In Calendar, on the Home tab, select Print. Choose the calendar, a View such as Work week or Month, the time range, whether to include a mini month, and whether to include a detailed agenda. Select Print, choose the printer, and Print again. Choose Microsoft Print to PDF to save a PDF."
        ]
      },
      {
        "heading": "Classic Outlook",
        "body": [
          "Select File, Print, then a style under Settings. Microsoft’s text documents examples including Weekly Agenda, Monthly and Calendar Details styles. For full titles choose Weekly Agenda Style; for full details Microsoft recommends Weekly Agenda Style or Calendar Details Style. Use Print Options for the date range and to choose a calendar.",
          "To avoid printing private items’ details, tick Hide Details of private appointments. Microsoft notes you can print appointments from only one calendar at a time."
        ]
      },
      {
        "heading": "Outlook for Mac",
        "body": [
          "Choose the calendar and select File, Print. Choose the calendar, a layout such as Work week or Month, and the time range, then Print."
        ]
      },
      {
        "heading": "Worked example: a board-meeting week",
        "body": [
          "A fictional executive assistant needs a printed week of the director’s schedule for a board pack. In classic Outlook they choose Weekly Agenda Style for full meeting titles, set the range to the board week, and tick Hide Details of private appointments. They inspect the preview to confirm private information is not exposed before sharing the printout.",
          "A colleague on new Outlook needs the same and chooses Work week with detailed agenda, then checks the preview for private items before printing, because the hide-private option is documented only for classic Outlook.",
          "Check: read every page of the preview before it leaves the office."
        ]
      }
    ],
    "comparison": {
      "heading": "Print options by client",
      "columns": [
        "Need",
        "New Outlook",
        "Classic Outlook",
        "Mac"
      ],
      "rows": [
        {
          "cells": [
            "Full titles",
            "Detailed agenda (check preview)",
            "Weekly Agenda Style",
            "Check preview"
          ]
        },
        {
          "cells": [
            "Full details",
            "Detailed agenda",
            "Weekly Agenda or Calendar Details Style",
            "Not documented"
          ]
        },
        {
          "cells": [
            "Hide private details",
            "Not documented; check preview",
            "Hide Details of private appointments",
            "Not documented"
          ]
        },
        {
          "cells": [
            "More than one calendar",
            "Select the intended calendar; combined printing not established by this source",
            "One calendar at a time",
            "Select the intended calendar; combined printing not established by this source"
          ]
        },
        {
          "cells": [
            "PDF",
            "Microsoft Print to PDF",
            "Microsoft Print to PDF",
            "—"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Identify your Outlook client.",
      "Choose the calendar and range first.",
      "Pick Weekly Agenda (classic) or detailed agenda (new) for full titles.",
      "Hide private details in classic Outlook; otherwise check the preview.",
      "Save as PDF with Microsoft Print to PDF if needed."
    ],
    "faq": [
      {
        "q": "Why are meeting titles cut off?",
        "a": "In classic Outlook, Microsoft recommends Weekly Agenda Style to print full titles."
      },
      {
        "q": "Can I print two calendars together in classic Outlook?",
        "a": "Microsoft says you can print appointments from only one calendar at a time."
      }
    ],
    "sourcesHeading": "Microsoft Support pages used",
    "sources": [
      {
        "label": "Microsoft: print a calendar in Outlook (new, classic, Mac)",
        "url": "https://support.microsoft.com/en-au/office/print-a-calendar-048370ac-c799-4127-b50a-0f42c70f0100"
      },
      {
        "label": "Microsoft: print a calendar showing appointments and meetings (classic styles)",
        "url": "https://support.microsoft.com/topic/ad03c408-1607-4a24-8b35-2c9f46930760"
      }
    ],
    "seeAlso": [
      "calendar-export-ics-pdf-and-backup",
      "a-week-view-that-fits-a-week",
      "month-view-on-a-bigger-screen"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "outlook-propose-new-meeting-time": {
    "updated": "2026-11-12",
    "seoTitle": "How to Propose a New Time in Outlook (& Why It Is Missing)",
    "title": "How to Propose a New Meeting Time in Outlook (New & Classic)",
    "short": "Propose a new time in Outlook",
    "description": "Suggest an alternate meeting time in new or classic Outlook, see how organizers approve proposals, and learn why Propose New Time is grayed out or missing.",
    "lede": "In Outlook, attendees can click Tentative or Decline → Propose New Time to check everyone’s free/busy grid and send a time suggestion exclusively to the organizer. If Propose New Time is missing or disabled, the meeting is usually recurring, an all-day event, or the organizer unchecked Allow new time proposals.",
    "commonBelief": "If I can’t make a meeting, I can always use Propose New Time.",
    "sections": [
      {
        "heading": "Three reasons the option may not be there",
        "body": [
          "Microsoft documents that you can’t propose a new time for a recurring meeting. It also says the organizer can send a meeting request that restricts proposals; in that case Propose New Time isn’t available. And the feature is only for work or school accounts: Microsoft lists personal Microsoft accounts (outlook.com, hotmail.com, live.com, msn.com) and IMAP or POP accounts from other providers as not supported.",
          "So check those three before assuming your Outlook is broken. If any applies, reply to the organizer by message instead of moving your copy of the meeting; Microsoft warns that moving a meeting you were invited to leaves the organizer uninformed and your calendar at the wrong time."
        ]
      },
      {
        "heading": "As an attendee in new Outlook for Windows",
        "body": [
          "Open the invitation, choose Propose new time, then pick I might attend or No, I won’t attend. Select the alternative slot, choose Done, add a message if useful, and select Send. Your choice of tentative or decline is sent along with the suggestion."
        ]
      },
      {
        "heading": "As an attendee in classic Outlook for Windows",
        "body": [
          "Choose Propose New Time, then Tentative and Propose New Time or Decline and Propose New Time. Pick the new time and select Propose Time. Microsoft says this opens a meeting response and adds “New Time Proposed” to the subject; select Send.",
          "Microsoft’s page documents only these two Windows clients for proposing. For Outlook on the web, Mac or mobile, look for the equivalent control in that client, and if it is not there, message the organizer."
        ]
      },
      {
        "heading": "As the organizer: accept or reject",
        "body": [
          "In classic Outlook, open the proposal and choose Accept Proposal or View All Proposals. To accept, select Accept Proposal and then Send Update, which moves the meeting for everyone. To reject, Microsoft’s instruction is Delete. The page does not document the organizer flow for new Outlook, so check that client’s own options before relying on it.",
          "Accepting one person’s suggestion can make the time worse for others. Before Send Update, check the other attendees’ availability for the proposed slot."
        ]
      },
      {
        "heading": "Worked example: one clash, two clients",
        "body": [
          "A fictional analyst on a work account in new Outlook is invited to a one-off review at 14:00 Thursday that clashes with training. They open the invitation, choose Propose new time, select I might attend, pick 10:00 Friday and add “Training until 15:00 Thursday”.",
          "The organizer, using classic Outlook, opens the proposal, chooses View All Proposals to see whether anyone else suggested a time, checks the other two attendees are free at 10:00 Friday, then selects Accept Proposal and Send Update.",
          "Check: the analyst’s calendar now shows the review at 10:00 Friday from the organizer’s update. If the review had been a weekly series, the analyst would have messaged the organizer instead."
        ]
      }
    ],
    "comparison": {
      "heading": "Can you propose a new time?",
      "columns": [
        "Situation",
        "Proposal available?",
        "What to do instead"
      ],
      "rows": [
        {
          "cells": [
            "One-off meeting, work or school account, proposals allowed",
            "Yes",
            "—"
          ]
        },
        {
          "cells": [
            "Recurring meeting",
            "No (Microsoft)",
            "Message the organizer"
          ]
        },
        {
          "cells": [
            "Organizer restricted proposals",
            "No",
            "Message the organizer"
          ]
        },
        {
          "cells": [
            "Outlook.com, Hotmail, Live, MSN, IMAP or POP account",
            "Not supported",
            "Reply with your availability"
          ]
        },
        {
          "cells": [
            "Client other than new or classic Outlook for Windows",
            "Not documented on Microsoft’s page",
            "Check the client; otherwise message"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Check the meeting is one-off and your account is work or school.",
      "Use Propose new time with a tentative or decline response and a short reason.",
      "Don’t move your copy of an invited meeting.",
      "As organizer, review all proposals and other attendees’ availability before accepting.",
      "Accept with Accept Proposal then Send Update (classic Outlook)."
    ],
    "faq": [
      {
        "q": "Why can’t I propose a new time for our weekly meeting?",
        "a": "Microsoft says proposals aren’t available for recurring meetings. Contact the organizer."
      },
      {
        "q": "Does proposing a time move the meeting?",
        "a": "No. The organizer must accept the proposal and send an update."
      },
      {
        "q": "I use an Outlook.com address. Why is the option missing?",
        "a": "Microsoft lists personal Microsoft accounts and IMAP/POP accounts as not supported for this feature."
      }
    ],
    "sourcesHeading": "Microsoft Support page used",
    "sources": [
      {
        "label": "Microsoft: propose a new meeting time in Outlook",
        "url": "https://support.microsoft.com/en-us/outlook/calendar/propose-a-new-meeting-time-in-outlook"
      },
      {
        "label": "Microsoft: change an appointment, meeting or event in Outlook",
        "url": "https://support.microsoft.com/en-us/outlook/calendar/change-an-appointment-meeting-or-event-in-outlook"
      }
    ],
    "seeAlso": [
      "keeping-track-of-who-replied",
      "what-guests-can-do-to-your-event",
      "exchange-calendars-on-an-iphone"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "icloud-public-calendar-publish-stop": {
    "updated": "2026-10-23",
    "title": "Publish an iCloud calendar as a public feed, then retire it deliberately",
    "short": "Publish and retire a public calendar",
    "description": "Plan an iCloud public calendar’s audience, inspect its contents and verify the owner’s publication switch when the feed should stop.",
    "lede": "A public calendar link is suitable for a schedule intended for broad viewing, such as a club fixture list. It is a poor shortcut for fixing private collaboration. Before publishing, decide what the whole schedule may reveal and who will maintain or retire the feed.",
    "sections": [
      {
        "heading": "Create a publication brief before a link",
        "body": [
          "For a fictional sports club, write: audience is members and visitors, owner is the fixtures coordinator, content is public match times and venues, and private contact details belong elsewhere. Review several dates, including old and future entries, instead of approving the calendar from its name.",
          "Use a dedicated schedule whose contents fit that brief. A personal calendar with a few public fixtures mixed in needs a content decision before it needs a link. The worksheet below is a publication checklist, not a claim that the service automatically redacts descriptions."
        ]
      },
      {
        "heading": "Use the owner’s public-calendar control",
        "body": [
          "Apple documents public sharing in Calendar on iCloud.com from a tablet or computer. The owner opens the calendar information, enables Public Calendar, and distributes the provided link. Apple says recipients do not need to be iCloud users to view this public arrangement; it is not an invitation to edit.",
          "Keep one recorded publication owner and a list of places where the link was distributed. For the club, that might include its website and an email bulletin. Do not publish the raw link in a support report when the audience or content is still under review."
        ]
      },
      {
        "heading": "Check the intended reading result",
        "body": [
          "Ask an intended recipient to use their normal calendar setup and inspect one clearly identifiable sample fixture. Compare title, date, time zone and venue with the source. Record what is observed without promising a universal refresh delay across receiving services.",
          "If the recipient imported a one-time file rather than subscribing to an updating source, later changes can be a different task. Keep the export-versus-subscription guide handy. A screenshot of a fixture proves only what that view displayed at that moment."
        ]
      },
      {
        "heading": "Retire publication without deleting the club’s records",
        "body": [
          "When publication should end, Apple documents turning off Public Calendar in the owner’s calendar information and saving. Do not delete the entire club calendar merely to stop distribution. Update the website or bulletin locations you recorded so people know where to obtain the intended replacement schedule.",
          "Check the owner’s saved setting first. Previously saved files, screenshots and independent copies are a separate follow-up; switching publication off is not evidence that those copies disappeared. Tell members which schedule to use now and handle private collaboration separately from public publication."
        ]
      }
    ],
    "comparison": {
      "heading": "The fictional club’s publication checklist",
      "columns": [
        "Checkpoint",
        "Record before publication",
        "Record at retirement"
      ],
      "rows": [
        {
          "cells": [
            "Content",
            "Only public fixture information",
            "Source records retained by the owner"
          ]
        },
        {
          "cells": [
            "Distribution",
            "Website and bulletin locations",
            "Outdated links or instructions corrected"
          ]
        },
        {
          "cells": [
            "Ownership",
            "Named coordinator",
            "Who maintains any replacement"
          ]
        },
        {
          "cells": [
            "Recipient check",
            "Sample fixture and viewing route",
            "Current publication setting confirmed"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Approve the entire intended calendar audience and content.",
      "Have the owner enable public sharing and record distribution locations.",
      "Compare a sample fixture at the source and intended recipient view.",
      "When retiring the feed, turn off publication and communicate the replacement."
    ],
    "faq": [
      {
        "q": "Can public-calendar viewers edit the schedule?",
        "a": "Apple distinguishes public viewing from private editing collaboration. Do not distribute a public link as a substitute for an intended editor relationship."
      },
      {
        "q": "Will ending publication erase every old copy?",
        "a": "Do not assume that. Keep source access, saved copies and recipient refresh as separate observations."
      }
    ],
    "sourcesHeading": "Apple documentation checked for this guide",
    "sources": [
      {
        "label": "Apple: private and public calendar sharing on iCloud.com",
        "url": "https://support.apple.com/guide/icloud/share-a-calendar-mm6b1a9479/icloud"
      },
      {
        "label": "Apple: stop sharing a calendar on iCloud.com",
        "url": "https://support.apple.com/guide/icloud/stop-sharing-a-calendar-mm6b1a8f9f/icloud"
      }
    ],
    "articleLinks": [
      {
        "slug": "a-calendar-that-is-yours-to-share",
        "label": "Choose a private collaboration model"
      },
      {
        "slug": "calendar-export-ics-pdf-and-backup",
        "label": "Distinguish import from subscription"
      },
      {
        "slug": "taking-back-a-calendar-you-shared",
        "label": "Review remaining access routes"
      }
    ],
    "seeAlso": [
      "a-calendar-that-is-yours-to-share",
      "calendar-export-ics-pdf-and-backup",
      "taking-back-a-calendar-you-shared"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here.",
    "galleryAfterContent": true
  },
  "outlook-scheduling-assistant-read-colleague-availability": {
    "updated": "2026-10-23",
    "title": "Reading a colleague’s availability in Outlook’s Scheduling Assistant",
    "short": "Read the Scheduling Assistant",
    "description": "What Outlook’s Scheduling Assistant and a directory-opened calendar actually show about colleagues, why colours differ by client, and when to ask IT.",
    "lede": "The Scheduling Assistant shows when people look busy, but the detail you see comes from their sharing defaults and their own Show As choices. Reading it well avoids double-booking and false alarms. Arte Soft, the developer of Cloud Calendars, explains.",
    "commonBelief": "The Scheduling Assistant shows everything on a colleague’s calendar.",
    "sections": [
      {
        "heading": "What the grid is based on",
        "body": [
          "Microsoft says the Scheduling Assistant and Room Finder are available with Microsoft 365 or Exchange accounts. Add attendees and open Scheduling Assistant to see a row per person. Its documented desktop workflow also offers AutoPick to search for times under selected criteria; menus and automatic suggestions vary by client, so do not assume that exact command exists everywhere.",
          "The visible detail depends on calendar permissions and organisational sharing settings. Microsoft’s classic Outlook on the web guidance describes My organization as the default detail level for people in the organisation or federated organisations in Scheduling Assistant. It also says that opening an unshared colleague’s calendar from the directory uses that default. Those are legacy web instructions; use the current sharing controls available to your account rather than expecting the same label in every client."
        ]
      },
      {
        "heading": "Busy is a choice, not a fact",
        "body": [
          "What looks busy depends on Show As. Microsoft says the organizer sets the initial availability for attendees, and each person can change the status on their own calendar afterwards; later changes apply only to their calendar.",
          "So a colleague’s reminder marked Busy blocks the grid, while a real commitment marked Free doesn’t. When it matters, ask."
        ]
      },
      {
        "heading": "Colours depend on the client",
        "body": [
          "Microsoft’s Scheduling Assistant page describes busy in dark blue, tentative as a light blue hashed block, and outside working hours in light grey. For new Outlook for Windows, Microsoft says the Busy, Tentative and Working Elsewhere patterns adjust to your selected calendar colour. Read the pattern and legend in your own client rather than relying on a colour.",
          "If colleagues have set work hours and location, Microsoft says their location appears in the Scheduling Assistant too."
        ]
      },
      {
        "heading": "When to ask IT",
        "body": [
          "Microsoft documents a classic Outlook/Exchange Online case in which “We’re checking everyone’s calendars” can result from missing FreeBusySupport registry entries after Office installation or reinstallation. That cause must be verified; the error alone does not prove it. The documented repair options are reinstalling Office or restoring the missing entries, with registry backup precautions. Ask IT to diagnose it. Other availability gaps can involve permissions or organisational sharing settings."
        ]
      },
      {
        "heading": "Worked example: picking a slot for four",
        "body": [
          "A fictional project lead invites three colleagues and opens the Scheduling Assistant. One row shows 14:00–15:00 busy, another tentative, the third free all afternoon, and AutoPick suggests 15:30.",
          "Before sending, they open the third colleague’s calendar from the directory and see only busy blocks, consistent with a My organization default of availability only. They send the 15:30 invitation and treat replies, not the grid, as the confirmation.",
          "Check: watch responses; if someone declines, return to the grid."
        ]
      }
    ],
    "comparison": {
      "heading": "What a free-looking slot can mean",
      "columns": [
        "Situation",
        "What you see",
        "Next step"
      ],
      "rows": [
        {
          "cells": [
            "Colleague genuinely free",
            "Free",
            "Invite"
          ]
        },
        {
          "cells": [
            "Commitment marked Free",
            "Free",
            "Ask or confirm through replies; a commitment may not be represented"
          ]
        },
        {
          "cells": [
            "Reminder marked Busy",
            "Busy",
            "Ask if the slot is negotiable"
          ]
        },
        {
          "cells": [
            "Low My organization default",
            "Busy blocks without detail",
            "Ask the colleague, or request sharing"
          ]
        },
        {
          "cells": [
            "“We’re checking everyone’s calendars” in classic Outlook",
            "No availability",
            "Ask IT (Microsoft’s registry fix)"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Add attendees and open Scheduling Assistant. In the documented desktop workflow, try AutoPick if available.",
      "Read patterns and the legend in your own client.",
      "Remember busy and free reflect people’s Show As choices.",
      "Use directory-opened calendars knowing they show the My organization level.",
      "Treat responses as confirmation; escalate classic-Outlook errors to IT."
    ],
    "faq": [
      {
        "q": "Why do I see only busy blocks for a colleague?",
        "a": "Availability-only permission is one possible reason. Microsoft’s classic web guidance describes a My organization default that can provide busy blocks without details. Check the owner’s sharing settings and your organisation’s policy; an empty or unavailable grid can require different checks."
      },
      {
        "q": "Why are the colours different from my colleague’s screen?",
        "a": "Microsoft says new Outlook adjusts the availability patterns to your selected calendar colour."
      }
    ],
    "sourcesHeading": "Microsoft pages used",
    "sources": [
      {
        "label": "Microsoft: Scheduling Assistant and Room Finder",
        "url": "https://support.microsoft.com/en-us/outlook/use-the-scheduling-assistant-and-room-finder-for-meetings-in-outlook"
      },
      {
        "label": "Microsoft: share your calendar in Outlook on the web (My organization default)",
        "url": "https://support.microsoft.com/en-us/outlook/share-your-calendar-in-outlook-on-the-web"
      },
      {
        "label": "Microsoft: manage your availability in your Outlook calendar",
        "url": "https://support.microsoft.com/en-us/office/manage-your-availability-in-your-outlook-calendar-fbbf6d5c-bdb8-4018-a2e0-2e2f60642117"
      },
      {
        "label": "Microsoft: set your work hours and location in Outlook",
        "url": "https://support.microsoft.com/en-gb/office/learn-more-about-work-hours-in-outlook-af2fddf9-249e-4710-9c95-5911edfd76f6"
      },
      {
        "label": "Microsoft Learn: ‘We’re checking everyone’s calendars’ error",
        "url": "https://learn.microsoft.com/en-us/troubleshoot/outlook/calendaring/cannot-view-free-busy-information"
      }
    ],
    "seeAlso": [
      "booking-link-or-shared-calendar",
      "keeping-track-of-who-replied",
      "calendar-event-or-room-reservation"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "outlook-recover-deleted-calendar-items": {
    "updated": "2026-11-12",
    "seoTitle": "How to Recover Deleted Outlook Calendar Events (2 Steps)",
    "title": "How to Recover Deleted Calendar Events in Outlook (New & Classic)",
    "short": "Recover deleted Outlook events",
    "description": "Restore accidentally deleted Outlook meetings and appointments from Deleted Items or Exchange Recoverable Items—exact steps for new and classic Outlook.",
    "lede": "Deleted Outlook calendar appointments go to Deleted Items first, and if emptied from there, can often still be restored from Exchange’s server-side Recoverable Items folder. Follow the exact path below for either new Outlook (or Outlook on the web) or classic desktop Outlook.",
    "commonBelief": "Once Deleted Items is emptied, a calendar event is gone for good.",
    "sections": [
      {
        "heading": "Step 1: Deleted Items",
        "body": [
          "New Outlook: switch to Mail, select Deleted Items, select the event and choose Restore on the Home tab. Microsoft says the item is restored to your calendar.",
          "Classic Outlook: select Deleted Items (or Trash), select the calendar item, then Home, Move, Other folder, choose Calendar and OK."
        ]
      },
      {
        "heading": "Step 2: recover from the server",
        "body": [
          "If it isn’t in Deleted Items, Microsoft directs you to recover deleted items from the server. New Outlook: select Deleted Items, then Recover items deleted from this folder at the top of the list, tick the item and choose Restore. Classic Outlook: select Deleted Items, then Home, Recover Deleted Items from Server, select the items, choose Restore Selected Items and OK.",
          "For new Outlook, Microsoft explicitly says recovered calendar items go to Calendar. For classic Outlook, the short server-recovery page does not specify the destination for each item type: inspect Calendar and Deleted Items after recovery, and use the Calendar-item move procedure above if it is in Deleted Items. These short pages do not establish a universal retention window or account eligibility. If the server option is missing or the item is absent, ask your administrator or consult your account’s current recovery guidance."
        ]
      },
      {
        "heading": "Meetings are different from appointments",
        "body": [
          "Restoring a record is not evidence that everyone’s meeting response or cancellation state has been reversed. The recovery pages do not document automatic re-invitation. If you cancelled a meeting you organized, confirm the current arrangement with attendees before sending anything else; agree whether a fresh invitation is needed and make clear which record to use."
        ]
      },
      {
        "heading": "Worked example: a personal appointment and a team meeting",
        "body": [
          "A fictional user on a work account deletes a personal appointment by mistake and empties Deleted Items. In new Outlook they open Deleted Items, choose Recover items deleted from this folder, find the appointment, tick it and Restore. It reappears on the calendar.",
          "The same day they had cancelled a team meeting they organized. After recovering their copy, they contact attendees to confirm the cancellation had been received and agree whether a fresh invitation is needed. If they send one, they clearly identify it as the replacement and avoid leaving two apparently active meeting records.",
          "Check: open the restored items on the calendar and confirm date, time and attendees."
        ]
      }
    ],
    "comparison": {
      "heading": "Where to look",
      "columns": [
        "Situation",
        "New Outlook",
        "Classic Outlook"
      ],
      "rows": [
        {
          "cells": [
            "Item in Deleted Items",
            "Deleted Items → select → Restore",
            "Deleted Items → Move → Other folder → Calendar"
          ]
        },
        {
          "cells": [
            "Deleted Items emptied",
            "Recover items deleted from this folder → Restore",
            "Recover Deleted Items from Server → Restore Selected Items"
          ]
        },
        {
          "cells": [
            "Not listed on the server",
            "Ask your administrator",
            "Ask your administrator"
          ]
        },
        {
          "cells": [
            "Restored meeting you cancelled",
            "Notification not documented; contact attendees",
            "Notification not documented; contact attendees"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Look in Deleted Items first.",
      "If emptied, use the server recovery option for your client.",
      "Confirm the restored item on your calendar.",
      "For a meeting you cancelled, confirm the arrangement with attendees before deciding whether to send a replacement.",
      "Ask your administrator if recovery options are missing."
    ],
    "faq": [
      {
        "q": "Where do deleted Outlook calendar events go first?",
        "a": "Microsoft says deleted appointments go to your Mail Deleted Items folder first, and if removed from there may still appear under Recover items deleted from this folder."
      },
      {
        "q": "How long can I recover deleted calendar items?",
        "a": "The Microsoft pages used here don’t state a time limit. Ask your administrator."
      },
      {
        "q": "Does restoring a cancelled meeting re-invite attendees?",
        "a": "These recovery pages do not establish automatic re-invitation. Confirm the current arrangement with attendees and send a replacement only if needed."
      }
    ],
    "sourcesHeading": "Microsoft Support pages used",
    "sources": [
      {
        "label": "Microsoft: recover deleted calendar items",
        "url": "https://support.microsoft.com/en-au/office/recover-deleted-calendar-items-7ea77612-660b-4781-963d-8c08a8dfce6d"
      },
      {
        "label": "Microsoft: recover deleted items from the server",
        "url": "https://support.microsoft.com/en-au/office/recover-deleted-items-from-the-server-9e070d4e-d03a-46af-a9b2-8288f625279c"
      }
    ],
    "seeAlso": [
      "recover-deleted-calendar-events-iphone",
      "find-old-calendar-events-by-account-date-and-title",
      "calendar-export-ics-pdf-and-backup"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "monthly-recurring-last-weekday-byday-minus-1-versus-fixed-date": {
    "updated": "2026-10-23",
    "title": "Last weekday of the month or the 31st? Check the recurrence rule",
    "short": "Last Weekday of Month vs Fixed 31st",
    "description": "Compare the 31st, last calendar day, last Friday and final Monday–Friday date. See the 2026 results and why weekday rules do not exclude public holidays.",
    "lede": "The 31st, the last calendar day and the last Monday–Friday date are different recurrence requests. An RFC 5545 rule targeting day 31 skips months without it. A weekday-only rule excludes weekends, but does not know your public holidays.",
    "commonBelief": "",
    "sections": [
      {
        "heading": "Invalid dates are skipped, not rolled back",
        "body": [
          "RFC 5545 section 3.3.10 says recurrence instances with invalid dates are ignored and not counted. FREQ=MONTHLY;BYMONTHDAY=31 therefore produces seven dates in a full 2026 year: January, March, May, July, August, October and December 31.",
          "Do not confuse that rule with BYMONTHDAY=-1, which selects the final date of every month. If expressing an all-day start in an ICS file, use DTSTART;VALUE=DATE:20260131 rather than an eight-digit value with the default DATE-TIME type."
        ]
      },
      {
        "heading": "Four patterns answer four different questions",
        "body": [
          "FREQ=MONTHLY;BYMONTHDAY=31 selects the 31st where it exists. FREQ=MONTHLY;BYMONTHDAY=-1 selects the last calendar date. FREQ=MONTHLY;BYDAY=-1FR selects the last Friday.",
          "FREQ=MONTHLY;BYDAY=MO,TU,WE,TH,FR;BYSETPOS=-1 selects the final Monday–Friday date from that month’s weekday set. It does not exclude a public holiday or a personal day off. Do not present it as a universal last business-day rule."
        ]
      },
      {
        "heading": "Read the calculated 2026 dates before choosing",
        "body": [
          "The table is calculated from Gregorian month lengths and weekdays. Four 2026 month ends fall on weekends: January 31, February 28, May 31 and October 31. The final Monday–Friday date moves back in those months.",
          "In March, the last Friday is March 27, but the final Monday–Friday date is Tuesday March 31. That difference matters when the requirement is truly the final weekday rather than a Friday meeting."
        ]
      },
      {
        "heading": "Check the editor and save a disposable example",
        "body": [
          "Apple’s Mac guide documents Custom repeat, Frequency and an On the pattern, including the last weekday of a month. Microsoft’s cited guide documents monthly specific-day and ordinal-weekday examples. Google’s guide documents choosing a repeat frequency and end, without listing every raw RRULE its editor or importer preserves.",
          "Use the options actually present in the app, then inspect the next several saved dates. A standard’s ability to express a rule is not proof that every app exposes, imports or preserves it unchanged. Use a disposable calendar before relying on a complex imported rule."
        ]
      }
    ],
    "comparison": {
      "heading": "Verified 2026 Monthly Resolution Table: BYMONTHDAY=31 vs BYMONTHDAY=-1 vs BYDAY=-1FR vs Last Mon–Fri Date (BYSETPOS=-1)",
      "columns": [
        "2026 Month (Length)",
        "BYMONTHDAY=31 (Fixed 31st)",
        "BYMONTHDAY=-1 (Last Calendar Day)",
        "BYDAY=-1FR (Last Friday)",
        "BYDAY=MO..FR;BYSETPOS=-1 (Last Mon–Fri Date)"
      ],
      "rows": [
        {
          "cells": [
            "January 2026 (31d)",
            "Sat Jan 31",
            "Sat Jan 31 (Weekend)",
            "Fri Jan 30",
            "Fri Jan 30 (Steps back from Sat 31)"
          ]
        },
        {
          "cells": [
            "February 2026 (28d)",
            "SKIPPED (No Feb 31)",
            "Sat Feb 28 (Weekend)",
            "Fri Feb 27",
            "Fri Feb 27 (Steps back from Sat 28)"
          ]
        },
        {
          "cells": [
            "March 2026 (31d)",
            "Tue Mar 31",
            "Tue Mar 31",
            "Fri Mar 27",
            "Tue Mar 31"
          ]
        },
        {
          "cells": [
            "April 2026 (30d)",
            "SKIPPED (No Apr 31)",
            "Thu Apr 30",
            "Fri Apr 24",
            "Thu Apr 30"
          ]
        },
        {
          "cells": [
            "May 2026 (31d)",
            "Sun May 31",
            "Sun May 31 (Weekend)",
            "Fri May 29",
            "Fri May 29 (Steps back from Sun 31)"
          ]
        },
        {
          "cells": [
            "June 2026 (30d)",
            "SKIPPED (No Jun 31)",
            "Tue Jun 30",
            "Fri Jun 26",
            "Tue Jun 30"
          ]
        },
        {
          "cells": [
            "July & August 2026 (31d)",
            "Fri Jul 31 & Mon Aug 31",
            "Fri Jul 31 & Mon Aug 31",
            "Fri Jul 31 & Fri Aug 28",
            "Fri Jul 31 & Mon Aug 31"
          ]
        },
        {
          "cells": [
            "September 2026 (30d)",
            "SKIPPED (No Sep 31)",
            "Wed Sep 30",
            "Fri Sep 25",
            "Wed Sep 30"
          ]
        },
        {
          "cells": [
            "October 2026 (31d)",
            "Sat Oct 31",
            "Sat Oct 31 (Weekend)",
            "Fri Oct 30",
            "Fri Oct 30 (Steps back from Sat 31)"
          ]
        },
        {
          "cells": [
            "November & December 2026 (30d / 31d)",
            "Nov: SKIPPED | Dec: Thu Dec 31",
            "Mon Nov 30 & Thu Dec 31",
            "Fri Nov 27 & Fri Dec 25",
            "Mon Nov 30 & Thu Dec 31"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Write whether the requirement means last date, last Friday or last Monday–Friday date.",
      "Check a short month and a weekend month end.",
      "Apply a separately confirmed holiday policy if needed.",
      "Verify saved occurrences in the source account and recipient app."
    ],
    "faq": [
      {
        "q": "Does the final weekday rule avoid holidays?",
        "a": "No. MO,TU,WE,TH,FR excludes Saturdays and Sundays only. A holiday on a weekday still matches unless handled separately."
      },
      {
        "q": "Why is a monthly-on-31 rule missing in April?",
        "a": "April has no 31st. RFC 5545 ignores that invalid recurrence date rather than moving it to April 30."
      }
    ],
    "sourcesHeading": "Primary specifications and official documentation",
    "sources": [
      {
        "label": "RFC 5545: monthly recurrence and invalid dates",
        "url": "https://www.rfc-editor.org/rfc/rfc5545.html#section-3.3.10"
      },
      {
        "label": "RFC 5545: DTSTART value types",
        "url": "https://www.rfc-editor.org/rfc/rfc5545.html#section-3.8.2.4"
      },
      {
        "label": "Apple: custom monthly repetition",
        "url": "https://support.apple.com/guide/calendar/icl1018/mac"
      },
      {
        "label": "Microsoft: monthly recurrence examples",
        "url": "https://support.microsoft.com/en-gb/outlook/get-started-with-the-outlook-calendar"
      },
      {
        "label": "Google: recurring events",
        "url": "https://support.google.com/calendar/answer/37115?hl=en"
      },
      {
        "label": "Supporting primary documentation",
        "url": "https://www.rfc-editor.org/rfc/rfc5545"
      }
    ],
    "articleLinks": [
      {
        "slug": "recurring-events-without-the-mess",
        "label": "Recurring Events Without the Mess"
      },
      {
        "slug": "month-view-on-a-bigger-screen",
        "label": "Month View on a Bigger Screen"
      },
      {
        "slug": "calendar-export-ics-pdf-and-backup",
        "label": "Calendar Export: ICS, PDF, and Backup"
      }
    ],
    "seeAlso": [
      "recurring-events-without-the-mess",
      "month-view-on-a-bigger-screen",
      "calendar-export-ics-pdf-and-backup"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "google-tasks-repeating-task-complete-delete": {
    "updated": "2026-10-23",
    "title": "Repeating tasks in Google Tasks and Calendar: complete, skip or stop them",
    "short": "Repeating Google tasks",
    "description": "Create a repeating Google task, see what completing one does, delete a single occurrence in Calendar, and avoid the limits that can’t be undone.",
    "lede": "A repeating task behaves differently from a repeating event: finishing one produces the next, and some changes cannot be reversed. Know the limits before you build a routine on it. This guide is published by Arte Soft, the developer of Cloud Calendars, from Google’s Android documentation.",
    "commonBelief": "I can stop a repeating task and turn repeat back on later.",
    "sections": [
      {
        "heading": "Create the repeat",
        "body": [
          "In Google Tasks, tap Add date/time, then Repeat, and choose day, week, month or year under Repeats every. In Google Calendar, tap Does not repeat below the date and choose a preset or Custom."
        ]
      },
      {
        "heading": "Completing one occurrence",
        "body": [
          "Google says that when you complete it, the task is crossed out and the next instance appears in your task list on the date specified. The page does not say whether completing early or late moves the next date, so check the next occurrence after completing one.",
          "Google also says only a limited number of future recurring tasks appear on the Calendar grid at once;new ones become visible as time passes. A partial future list alone does not establish that the series has stopped."
        ]
      },
      {
        "heading": "Deleting one, some or all",
        "body": [
          "In Google Calendar you can delete This task, This and following tasks or All tasks. In Google Tasks, Google’s option is Delete all. Google states that to delete a single task from a repeating series, you must use Google Calendar."
        ]
      },
      {
        "heading": "Limits to know first",
        "body": [
          "Google lists: shared tasks and subtasks can’t repeat; recurring tasks can’t be moved to other task lists; and if you stop a series repeating, you can’t set it to repeat again.",
          "So choose the list before adding repeat, and do not switch off repeat as a temporary pause."
        ]
      },
      {
        "heading": "Worked example: a fortnightly bin rota",
        "body": [
          "A fictional household creates “Put recycling out” in their personal Tasks list, repeating every 2 weeks on Tuesday. One Tuesday is a holiday with no collection: they open Google Calendar and delete This task, leaving the series intact.",
          "Later they want to share the recurring responsibility with others. Google says shared tasks cannot repeat and a recurring task cannot move to another list. They keep the personal task and coordinate the household separately, for example with an appropriately shared calendar event. This is not a claim that every Tasks client has a general shared-list control.",
          "Check: the following collection date still shows the task."
        ]
      }
    ],
    "comparison": {
      "heading": "Repeating task actions",
      "columns": [
        "Want to",
        "Where",
        "Reversible?"
      ],
      "rows": [
        {
          "cells": [
            "Finish this one",
            "Mark complete",
            "Next instance appears on its date"
          ]
        },
        {
          "cells": [
            "Skip one occurrence",
            "Google Calendar → This task",
            "Series continues"
          ]
        },
        {
          "cells": [
            "End from a date",
            "Google Calendar → This and following tasks",
            "Treat as permanent"
          ]
        },
        {
          "cells": [
            "Stop repeating",
            "The task’s repeat setting",
            "No: Google says it can’t repeat again"
          ]
        },
        {
          "cells": [
            "Move to another list",
            "—",
            "Not allowed for recurring tasks"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Choose the right list before setting repeat.",
      "Complete occurrences normally; the next one appears on its date.",
      "Skip one occurrence by deleting This task in Google Calendar.",
      "Don’t stop repeating as a pause; it can’t be re-enabled.",
      "Use a calendar event for shared routines."
    ],
    "faq": [
      {
        "q": "Can a shared task repeat?",
        "a": "No. Google says shared tasks and subtasks can’t be set to repeat."
      },
      {
        "q": "How do I delete just one occurrence?",
        "a": "Google says you must use Google Calendar and choose This task."
      }
    ],
    "sourcesHeading": "Google Help page used",
    "sources": [
      {
        "label": "Google: manage repeating tasks in Google Tasks and Google Calendar (Android)",
        "url": "https://support.google.com/calendar/answer/12132599?hl=en"
      }
    ],
    "seeAlso": [
      "can-others-see-google-calendar-tasks",
      "recurring-events-without-the-mess",
      "iphone-calendar-tasks-reminders-versus-event-alerts"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "outlook-schedule-meeting-on-behalf-of-someone": {
    "updated": "2026-10-23",
    "title": "Schedule a meeting on someone else’s Outlook calendar: save, send and check",
    "short": "Scheduling on behalf of someone",
    "description": "As an Outlook delegate, save a meeting to the owner’s calendar, know what attendees see, and avoid the one choice Microsoft says cannot be changed later.",
    "lede": "When you organise meetings for a manager, the meeting has to land on their calendar, not yours. In Outlook on the web that hinges on one field, and Microsoft says it cannot be changed once the invitation is sent. This guide walks through the delegate’s side of the job.",
    "commonBelief": "If I can see my manager’s calendar, any meeting I create will be theirs.",
    "sections": [
      {
        "heading": "Before you start: permission and the calendar list",
        "body": [
          "Microsoft says you can only edit someone else’s calendar after they give you permission by sharing it. Accept their sharing invitation to add their calendar to your list. When you create an event, Outlook on the web only offers calendars that are in your list and for which you hold editor or delegate permission.",
          "If the owner’s calendar is missing from the list, the fix is on the permission side, not in your event form. Ask them to check what they granted; the owner’s decision between Can edit and Delegate is covered in a separate guide."
        ]
      },
      {
        "heading": "Create the meeting on the right calendar",
        "body": [
          "Choose New event, then set the Save to calendar field to the owner’s calendar before adding attendees or sending. Microsoft states that once a meeting invitation has been sent, you cannot change the calendar on which it was scheduled.",
          "That makes the practical recovery for a mis-filed meeting blunt: cancel it from the calendar where it was saved, then create it again on the correct calendar and tell the attendees why they received a cancellation and a new invitation. That fictional correction concerns a one-off meeting. For a recurring series, review the supported future-occurrence scope and preserve useful historical records before cancelling or replacing it."
        ]
      },
      {
        "heading": "What attendees see and where replies go",
        "body": [
          "Microsoft says the invitation will show that it is from you on the calendar owner’s behalf. If you need messages to appear as sent directly by the owner, that is Send As permission, which Microsoft says only your organisation’s administrator can set.",
          "If you are a delegate, Microsoft says meeting requests and updates are sent to you and appear in your inbox like any other request. Microsoft’s best practice is to process each one properly by accepting or declining it, and to use Remove from Calendar for cancellations, rather than deleting messages."
        ]
      },
      {
        "heading": "Worked example: a board pre-read session",
        "body": [
          "A fictional assistant schedules a 45-minute pre-read for their director with three board members. In Outlook on the web they choose New event, set Save to calendar to the director’s calendar, add the attendees and a Teams link, and send.",
          "The board members see an invitation from the assistant on behalf of the director. Their acceptances arrive in the assistant’s inbox, and the assistant opens each response rather than deleting it unread.",
          "Mistake scenario: had the assistant left Save to calendar on their own calendar, the director would not be the organiser. The correction is to cancel that meeting and recreate it on the director’s calendar, with a short note to the board members."
        ]
      },
      {
        "heading": "Verify before the day",
        "body": [
          "Open the owner’s calendar and confirm the meeting appears there with the right time zone and attendees. Check that responses are arriving where you expect. If the owner also processes the same requests, agree who acts on them to avoid conflicting replies.",
          "Cloud Calendars, made by Arte Soft, can show Microsoft calendars on its Premium plan, but it does not provide Outlook’s Save to calendar or Send As controls. Schedule delegated meetings in Outlook."
        ]
      }
    ],
    "comparison": {
      "heading": "Delegate scheduling checklist",
      "columns": [
        "Step",
        "What to check",
        "If wrong"
      ],
      "rows": [
        {
          "cells": [
            "Owner’s calendar in your list",
            "Accepted sharing invitation; editor or delegate permission",
            "Ask the owner to share with the right permission"
          ]
        },
        {
          "cells": [
            "Save to calendar",
            "Set to the owner’s calendar before sending",
            "After sending it cannot be changed: cancel and recreate"
          ]
        },
        {
          "cells": [
            "Sender identity",
            "Appears as you on behalf of the owner",
            "Send As requires the administrator"
          ]
        },
        {
          "cells": [
            "Responses",
            "Arrive in your inbox as delegate",
            "Ask the owner to review delegate routing"
          ]
        },
        {
          "cells": [
            "Cancellations",
            "Use Remove from Calendar",
            "Deleted messages can leave stale entries"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Accept the owner’s sharing invitation so their calendar is in your list.",
      "Choose New event and set Save to calendar to the owner’s calendar first.",
      "Send, then confirm the meeting is on the owner’s calendar.",
      "Process responses and cancellations properly rather than deleting them.",
      "Ask the administrator if the owner genuinely needs Send As."
    ],
    "faq": [
      {
        "q": "I sent the meeting from my own calendar by mistake. Can I move it?",
        "a": "Microsoft says you cannot change the calendar once the invitation has been sent. Cancel it and recreate it on the owner’s calendar."
      },
      {
        "q": "Why does the invitation say “on behalf of”?",
        "a": "That is how Microsoft shows a meeting sent by a delegate. Sending as the owner without that label needs Send As, which only an administrator can grant."
      },
      {
        "q": "Why can’t I select my manager’s calendar in Save to calendar?",
        "a": "Microsoft only lists calendars that are in your calendar list and for which you have editor or delegate permission."
      }
    ],
    "sourcesHeading": "Microsoft Support pages used",
    "sources": [
      {
        "label": "Microsoft: manage someone else’s calendar in Outlook on the web",
        "url": "https://support.microsoft.com/en-us/outlook/manage-someone-else-s-calendar-in-outlook-on-the-web"
      },
      {
        "label": "Microsoft: about delegates and Send As",
        "url": "https://support.microsoft.com/en-gb/outlook/sharing/about-delegates-allow-someone-to-manage-your-mail-and-calendar-in-outlook"
      },
      {
        "label": "Microsoft: best practices for organisations using the Outlook calendar",
        "url": "https://support.microsoft.com/en-us/outlook/best-practices-for-organizations-when-using-the-outlook-calendar"
      }
    ],
    "seeAlso": [
      "what-guests-can-do-to-your-event",
      "keeping-track-of-who-replied",
      "exchange-calendars-on-an-iphone"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here.",
    "galleryAfterContent": true
  },
  "google-booking-page-link-button-embed": {
    "updated": "2026-10-23",
    "title": "Share a Google booking page: link, popup button or inline embed",
    "short": "Share a Google booking page",
    "description": "Choose a Google booking-page link or website embed, check whether it shows one service or all services, and review the public identity.",
    "lede": "A direct booking link, a website button and an inline booking page can lead visitors into the same scheduling service through different presentations. Choose the destination first: one specific service or all booking pages on the primary calendar. Then inspect what a public visitor will see.",
    "sections": [
      {
        "heading": "Start from the visitor’s next decision",
        "body": [
          "For a fictional repair business, a product page should offer only its setup consultation, while a general contact page may list all services. Record page location, intended service scope and button wording before copying code. A button labelled Book a setup call should not unexpectedly expose unrelated offerings.",
          "Google says a booking page is public and its profile photo and account name are visible to anyone with the link. Hiding the calendar from your own list does not make that page private. Review the public identity before adding the URL to an email signature or website."
        ]
      },
      {
        "heading": "Choose the supported delivery format",
        "body": [
          "On a computer, Google documents hovering over the intended page under Booking pages, then choosing Options > Sharing options > Website embed. Choose All booking pages or A single booking page, then Button with popup or Inline booking page. Copy code, click Done and paste the generated code into the website’s HTML.",
          "Use a direct link where the channel does not support embedded code. For a website, decide whether visitors should open a popup or see the form within the page. The source describes button text/color choices and inline width/height adjustments, but it does not establish that every host permits every script or embed."
        ]
      },
      {
        "heading": "Review a small publishing checklist",
        "body": [
          "For the repair example, compare the specific-service destination with the all-services destination before publication. Inspect the displayed business identity, service description, currently offered slots and the page’s behavior on the website layout you actually use.",
          "Use one cooperative colleague to follow the visitor route. Ask them to report where they arrived rather than saying the button works because it changed color. If you agree a test booking, check its confirmation and remove it through the normal supported route. Do not use a customer’s real appointment as a layout experiment."
        ]
      },
      {
        "heading": "Maintain the distribution map",
        "body": [
          "Keep a private list of published locations: product page, contact page, signature and campaign message. If the intended service or booking destination changes, revisit those locations instead of assuming every previously copied URL has been updated.",
          "This is Google’s booking-page publication workflow. It differs from embedding a public calendar grid, sending an agreed meeting invitation, or sharing an editable calendar. Cloud Calendars views do not by themselves create these booking-page controls."
        ]
      }
    ],
    "comparison": {
      "heading": "A fictional repair business’s distribution map",
      "columns": [
        "Location",
        "Intended destination",
        "Visitor check"
      ],
      "rows": [
        {
          "cells": [
            "Setup product page",
            "One setup consultation",
            "No unrelated service choices"
          ]
        },
        {
          "cells": [
            "General contact page",
            "All intended booking pages",
            "Expected service list and identity"
          ]
        },
        {
          "cells": [
            "Email message",
            "Direct booking link",
            "Correct destination without embedded code"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Choose one service or the intended all-services page.",
      "Review the public account identity.",
      "Use a link or the supported website embed option.",
      "Check the real visitor destination and record every published location."
    ],
    "faq": [
      {
        "q": "Does hiding my calendar hide the booking page?",
        "a": "Google explicitly says calendar-list visibility does not control the booking page’s public visibility."
      },
      {
        "q": "Is embedding a calendar the same as embedding a booking page?",
        "a": "No. One displays schedule information; the other asks a visitor to choose an appointment. Use the code and destination for the intended task."
      }
    ],
    "sourcesHeading": "Official Google documentation checked",
    "sources": [
      {
        "label": "Google Calendar Help: Share your appointment schedule",
        "url": "https://support.google.com/calendar/answer/10733297?hl=en"
      }
    ],
    "articleLinks": [
      {
        "slug": "booking-link-or-shared-calendar",
        "label": "Choose the type of sharing URL"
      },
      {
        "slug": "the-secret-address-of-a-google-calendar",
        "label": "Keep a private calendar feed out of public links"
      },
      {
        "slug": "sharing-one-event-not-your-calendar",
        "label": "Send an invitation when the time is already agreed"
      }
    ],
    "seeAlso": [
      "booking-link-or-shared-calendar",
      "the-secret-address-of-a-google-calendar",
      "sharing-one-event-not-your-calendar"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "outlook-share-calendar-outside-organization": {
    "updated": "2026-10-23",
    "title": "Share a Microsoft 365 calendar with someone outside your organisation",
    "short": "Outlook sharing with externals",
    "description": "Find out whether your admin, your sharing choice or the partner’s calendar service limits external Outlook calendar sharing, and what the partner receives.",
    "lede": "Sharing a work calendar with a contractor or client involves three parties: your tenant’s administrator, you, and whatever calendar service the recipient uses. Each can limit the result. Arte Soft, the developer of Cloud Calendars, wrote this guide to help you find which one is limiting yours.",
    "commonBelief": "If I can share my calendar with a colleague, I can share it the same way with anyone.",
    "sections": [
      {
        "heading": "Layer one: what the administrator allows",
        "body": [
          "Microsoft’s admin documentation places external calendar sharing under Microsoft 365 admin center, Settings, Org Settings, Services, Calendar. An administrator can let users share with people outside the organisation who have Office 365 or Exchange, and, only after that, allow anyone to access calendars with an email invitation.",
          "For those anonymous recipients, the administrator chooses the maximum detail: free/busy with time only; free/busy with time, subject and location; or all calendar appointment information. Sharing with an on-premises Exchange organisation needs a federation relationship configured by the Exchange administrator."
        ]
      },
      {
        "heading": "Layer two: what you choose",
        "body": [
          "Once the administrator enables it, Microsoft says users decide whether to share, how much and when to stop. In Outlook on the web you choose a level for the external address. Can edit and Delegate are only available for people in your organisation, and Microsoft separately states you cannot give editor or delegate access to people outside it.",
          "Microsoft notes that sharing can be unavailable or limited by organisation settings. A missing option is a reason to check the account, policy and intended recipient route with IT; it is not proof of one disabled switch or a broken mailbox."
        ]
      },
      {
        "heading": "Layer three: what the recipient’s service does",
        "body": [
          "Outside the organisation does not always mean an ICS subscription. Microsoft distinguishes Microsoft 365-to-Microsoft 365 sharing between tenants with external sharing enabled: a full shared calendar is created and syncs periodically, approximately every three hours in the documented configuration. If external sharing is disabled, that other-tenant Microsoft 365 recipient falls into the ICS route instead.",
          "Microsoft 365 sharing to Outlook.com or to a third-party service such as Gmail uses an ICS route. The recipient’s service decides when to refresh it. Microsoft gives Outlook.com at approximately three hours and Gmail at a possible 24–48 hours as service examples, not a universal maximum or delivery deadline. Confirm urgent changes directly. Publishing an HTML or ICS link is a separate read-only route and must not be used to bypass an organisation’s restrictions."
        ]
      },
      {
        "heading": "Worked example: a freelance designer",
        "body": [
          "A fictional marketing lead wants a freelance designer with a personal email address to see when the team’s review slots are free. The lead tries to choose Can edit; it is not offered, because the designer is external. They choose Can view when I’m busy instead.",
          "If the external share option is unavailable, the lead asks IT to check the account, external-sharing policy and intended recipient route. If the designer sees stale information, they first identify the actual calendar service and whether the share uses a cross-tenant calendar or an ICS subscription, then compare the source and confirm the important time by message. No fixed refresh deadline is assumed.",
          "Result check: the designer sees busy blocks without titles, as intended; nothing editable has been granted."
        ]
      }
    ],
    "comparison": {
      "heading": "Which layer is blocking you",
      "columns": [
        "Symptom",
        "Most likely layer",
        "Who can fix it"
      ],
      "rows": [
        {
          "cells": [
            "No way to share with an external address at all",
            "Account eligibility, organisation policy or intended recipient route needs checking",
            "Microsoft 365 administrator"
          ]
        },
        {
          "cells": [
            "Detail level capped below what you choose",
            "Administrator: anonymous access detail limit",
            "Microsoft 365 administrator"
          ]
        },
        {
          "cells": [
            "Can edit or Delegate not offered",
            "Microsoft rule for external recipients",
            "No one; use a view level"
          ]
        },
        {
          "cells": [
            "Partner sees stale times",
            "Sharing route and recipient-controlled refresh; documented timing examples are not guarantees",
            "Identify the route, compare the source and confirm urgent changes directly"
          ]
        },
        {
          "cells": [
            "Partner on another company’s on-premises Exchange",
            "Federation not configured",
            "Exchange administrators on both sides"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Decide the least detail the external person needs, usually busy times only.",
      "Share from Outlook on the web with a view level; Can edit and Delegate are internal only.",
      "If the option is missing or capped, ask your Microsoft 365 administrator which setting applies.",
      "Warn the recipient that their calendar service controls refresh timing.",
      "Confirm urgent changes by message rather than relying on the subscription."
    ],
    "faq": [
      {
        "q": "Can a client edit my Outlook calendar?",
        "a": "The Microsoft 365 work-or-school sharing flow covered here does not offer editor or delegate grants outside the organisation. Do not generalise that restriction to every personal Outlook.com sharing arrangement."
      },
      {
        "q": "Why does my contractor see changes so late?",
        "a": "First identify the recipient’s service and sharing route. Cross-tenant Microsoft 365 and ICS subscriptions have different behavior; the recipient’s service chooses ICS refresh timing. Microsoft’s three-hour and Gmail 24–48-hour examples are not a guaranteed maximum."
      },
      {
        "q": "The share option for external people is missing. Is my account broken?",
        "a": "Not necessarily. Ask the administrator to inspect account eligibility, external-sharing policy and the intended recipient path. An absent option does not establish which condition failed."
      }
    ],
    "sourcesHeading": "Microsoft pages used",
    "sources": [
      {
        "label": "Microsoft Learn: share Microsoft 365 calendars with users outside your organisation (admin)",
        "url": "https://learn.microsoft.com/en-us/microsoft-365/admin/manage/share-calendars-with-external-users"
      },
      {
        "label": "Microsoft: share your calendar in Outlook on the web",
        "url": "https://support.microsoft.com/en-us/outlook/share-your-calendar-in-outlook-on-the-web"
      },
      {
        "label": "Microsoft: calendar sharing in Microsoft 365",
        "url": "https://support.microsoft.com/en-us/outlook/calendar-sharing-in-microsoft-365"
      }
    ],
    "seeAlso": [
      "exchange-calendars-on-an-iphone",
      "the-secret-address-of-a-google-calendar",
      "taking-back-a-calendar-you-shared",
      "what-calendar-sync-actually-does"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here.",
    "galleryAfterContent": true
  },
  "outlook-shared-mailbox-calendar": {
    "updated": "2026-10-23",
    "title": "Shared mailbox calendar in Outlook: who can use it and its limits",
    "short": "Shared mailbox calendar",
    "description": "Use a Microsoft 365 shared mailbox calendar for a reception or support team: membership, the 25-user limit, no external users, and steps per Outlook client.",
    "lede": "A shared mailbox gives a team one address and one calendar without anyone signing in as that mailbox. It suits a front desk or support rota, but Microsoft sets limits that push larger or mixed teams elsewhere. Arte Soft, the developer of Cloud Calendars, explains.",
    "commonBelief": "A shared mailbox is just an account the team shares a password for.",
    "sections": [
      {
        "heading": "What it is and who can use it",
        "body": [
          "Microsoft describes shared mailboxes for addresses like information, support or reception. An administrator creates one and adds members. Members need their own licensed Exchange Online mailbox. For basic use the shared mailbox can hold up to 50 GB without a separate licence, but archiving, litigation hold and some advanced security or compliance features can require additional licensing.",
          "Microsoft says a shared mailbox isn’t for direct sign-in; its account should have sign-in blocked. Only people inside your organisation can use it; Microsoft suggests a Microsoft 365 group if outside people need access."
        ]
      },
      {
        "heading": "Limits to check first",
        "body": [
          "Microsoft says a shared mailbox supports a maximum of 25 users; too many simultaneous users may see connection failures or duplicated messages. Microsoft recommends a Microsoft 365 group if more users are needed. Its deletion warning is about email messages: you cannot prevent members from deleting those messages. It separately documents that members can create, view and manage shared-calendar appointments. Microsoft also documents limitations on encryption of mail sent from a shared mailbox."
        ]
      },
      {
        "heading": "Using the calendar, by client",
        "body": [
          "New Outlook and classic Outlook: after the administrator adds you, restart Outlook; Microsoft says the shared calendar is added to your Calendars list automatically. Choose it in calendar view. Any member can create, view and manage appointments.",
          "Outlook on the web: add the shared mailbox with Add shared folder or mailbox, then use its calendar. Microsoft notes that to get new-message notifications you open the mailbox in a separate browser window. Microsoft also documents Outlook for iOS and Android access."
        ]
      },
      {
        "heading": "Worked example: an office front desk",
        "body": [
          "A fictional office of 12 receptionists wants one visitor calendar. An administrator creates “Reception”, adds the 12 as members and leaves sign-in blocked. Each receptionist restarts Outlook and finds the Reception calendar listed.",
          "A contractor at another company asks for access. Shared mailboxes can’t include external people, so the office instead sends the contractor specific invitations.",
          "Check: one receptionist adds a test visitor slot and another confirms they can see and edit it; then the test is deleted."
        ]
      }
    ],
    "comparison": {
      "heading": "Is a shared mailbox the right fit?",
      "columns": [
        "Requirement",
        "Shared mailbox (per Microsoft)"
      ],
      "rows": [
        {
          "cells": [
            "One team address and calendar",
            "Yes"
          ]
        },
        {
          "cells": [
            "Members inside the organisation only",
            "Yes"
          ]
        },
        {
          "cells": [
            "More than 25 users",
            "No — Microsoft suggests a Microsoft 365 group"
          ]
        },
        {
          "cells": [
            "External members",
            "No — Microsoft suggests a group"
          ]
        },
        {
          "cells": [
            "Prevent members deleting shared-mailbox email messages",
            "No"
          ]
        },
        {
          "cells": [
            "Sign in directly as the mailbox",
            "Not intended; block sign-in"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Ask an administrator to create the mailbox and add members.",
      "Keep sign-in to the shared account blocked.",
      "Stay within 25 users and internal members.",
      "Restart Outlook to see the calendar; in the web, add the shared mailbox.",
      "Test an entry from two members’ accounts."
    ],
    "faq": [
      {
        "q": "Can someone outside our company use the shared calendar?",
        "a": "No. Microsoft says only people inside your organisation can use a shared mailbox."
      },
      {
        "q": "How many people can share one?",
        "a": "Microsoft says a maximum of 25 users."
      }
    ],
    "sourcesHeading": "Microsoft pages used",
    "sources": [
      {
        "label": "Microsoft: open and use a shared mailbox in Outlook",
        "url": "https://support.microsoft.com/en-us/office/open-and-use-a-shared-mailbox-in-outlook-98b5a90d-4e38-415d-a030-f09a4cd28207"
      },
      {
        "label": "Microsoft Learn: about shared mailboxes",
        "url": "https://learn.microsoft.com/en-us/microsoft-365/admin/email/about-shared-mailboxes"
      }
    ],
    "seeAlso": [
      "a-calendar-that-is-yours-to-share",
      "exchange-calendars-on-an-iphone",
      "why-a-shared-calendar-does-not-appear"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "google-calendar-android-personal-work-profile": {
    "updated": "2026-10-23",
    "title": "Show personal calendars in an Android Work Profile without confusing it with sharing",
    "short": "Show personal calendars in an Android Work Profile without confusing it with sharing",
    "description": "Use Google’s approved Android Work Profile personal-calendar view and distinguish local cross-profile display from direct sharing to a work account.",
    "lede": "On Android with a work- or school-managed Work Profile, seeing personal events in the work Google Calendar app need not mean the personal calendar was directly shared with the work account. Google documents an administrator-approved cross-profile view. Identify that route before changing calendar permissions or assuming coworkers see the same combined schedule.",
    "sections": [
      {
        "heading": "Check the managed-device boundary",
        "body": [
          "This procedure applies to Google Calendar on Android with a work or school-managed Work Profile. The administrator must allow the feature. If the option is absent, confirm eligibility with the administrator rather than deleting the profile or moving personal events into a work calendar.",
          "For a fictional employee, write the actual goal: see a household pickup next to work meetings on this device. That differs from making household details available in the work calendar on every computer. Keep the desired audience and desired viewing surface explicit."
        ]
      },
      {
        "heading": "Use the documented personal-calendar connection",
        "body": [
          "In the Android Google Calendar app, use Menu > Settings > Personal calendars > Turn on in Settings. Turn on Connect these apps, then tap Allow. Google says the work and personal calendars remain separately stored and personal account details are not shared with the work account through this feature.",
          "Inspect the control in the managed Calendar app you actually opened. Directly sharing the personal calendar with the work account is another route with different consequences. Do not use it merely because the cross-profile option needs administrator approval."
        ]
      },
      {
        "heading": "Trace a fictional duplicate",
        "body": [
          "Suppose the household pickup appears twice in the employee’s work view. One route may be the personal-calendar connection, while another is an earlier direct share to the work identity. Write both routes in the table before choosing a correction.",
          "Google describes a Connected area under Personal calendars for removing duplicate personal-event representation. Inspect the actual arrangement there; do not delete the original pickup just because two visible entries have the same title. Record which route you intended to keep and compare the source after any change."
        ]
      },
      {
        "heading": "Confirm the audience separately from the overview",
        "body": [
          "Google says coworkers and administrators cannot find the personal calendars through this route unless those calendars were shared directly with the work account. That is a description of this calendar feature, not a blanket audit of every device-management capability or every earlier share.",
          "For a real privacy check, inventory direct calendar grants separately and use a harmless sample item. Cloud Calendars on iPhone does not inherit Android Work Profile controls. Follow the actual platform and account route rather than copying these menu paths to another app."
        ]
      }
    ],
    "comparison": {
      "heading": "The fictional pickup’s route inventory",
      "columns": [
        "Route",
        "Purpose",
        "Separate check"
      ],
      "rows": [
        {
          "cells": [
            "Work Profile personal-calendar view",
            "Combined view on the managed Android app",
            "Administrator allowance and connected setting"
          ]
        },
        {
          "cells": [
            "Direct share to work identity",
            "Provider permission to the personal calendar",
            "Recipient rights and broader surfaces"
          ]
        },
        {
          "cells": [
            "Two visible pickup entries",
            "Possible overlapping routes",
            "Identify representation before deleting records"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Confirm an Android Work Profile and administrator support.",
      "Choose whether you need a device view or a direct calendar share.",
      "Use the documented personal-calendar connection if appropriate.",
      "Trace duplicate routes without deleting the original personal event."
    ],
    "faq": [
      {
        "q": "Does this automatically share personal calendar details with coworkers?",
        "a": "Google says the cross-profile personal-calendar view does not do that unless you separately shared those calendars with the work account."
      },
      {
        "q": "Should I use these steps in an iPhone calendar app?",
        "a": "No. They concern Google Calendar’s Android Work Profile workflow and its managed-device eligibility."
      }
    ],
    "sourcesHeading": "Official Google documentation checked",
    "sources": [
      {
        "label": "Google Calendar Help: Show personal & work calendars in Google Calendar",
        "url": "https://support.google.com/calendar/answer/15620294?hl=en"
      }
    ],
    "articleLinks": [
      {
        "slug": "work-and-personal-without-two-apps",
        "label": "Keep ownership separate in a combined view"
      },
      {
        "slug": "who-can-see-what-in-google-calendar",
        "label": "Audit direct calendar sharing"
      },
      {
        "slug": "when-two-calendars-disagree",
        "label": "Identify duplicate representations safely"
      }
    ],
    "seeAlso": [
      "work-and-personal-without-two-apps",
      "who-can-see-what-in-google-calendar",
      "when-two-calendars-disagree"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "split-shift-two-work-periods-calendar-blocking": {
    "updated": "2026-10-23",
    "title": "Split-shift calendar: keep two work periods and the gap separate",
    "short": "Split-shift calendar",
    "description": "Plan a split shift as two timed blocks, distinguish occupied hours from the overall span and keep optional travel buffers explicit.",
    "lede": "A split shift has two separate scheduled periods. Representing the whole span as one event can hide a genuine gap; representing only the two work blocks can hide travel commitments. Keep each kind of time explicit.",
    "sections": [
      {
        "heading": "Calculate the intervals before choosing busy status",
        "body": [
          "Take a hypothetical roster on 2 November 2026: 06:00–10:00 and 15:30–19:30 in one unchanged time zone. The two periods total eight planned hours. The overall first-start-to-last-end span is 13.5 hours, and the gap between periods is 5.5 hours.",
          "Those numbers describe calendar intervals only. They do not establish compensation, breaks required by law or time actually worked. Likewise, an app’s export or report may use different fields; do not assume it calculates payroll from visible event bars."
        ]
      },
      {
        "heading": "Create two records with a shared identifier",
        "body": [
          "Use titles such as Roster 42: morning and Roster 42: afternoon, so a future change can be matched to the same approved shift. Give each record its exact start and end. If your editor offers free/busy controls, choose them according to your real scheduling constraints and verify what a colleague or booking tool actually sees.",
          "When the two periods change independently, edit the affected record rather than expanding one continuous event across the gap. If a repeated shift has an exception, check both halves on that date so an old afternoon block is not left behind."
        ]
      },
      {
        "heading": "Add only real buffer commitments",
        "body": [
          "Suppose you separately plan travel from 10:00–10:30 and 15:00–15:30. Those buffers occupy one hour of the 5.5-hour gap, leaving a 4.5-hour interval from 10:30 to 15:00. That is a calculation for this example, not a recommendation that the remaining time is suitable for a particular activity.",
          "A decorative all-day roster label can help identification, but keep it separate from the timed blocks. Before sharing, compare the day’s occupied intervals with the actual roster and avoid exposing unnecessary workplace details."
        ]
      }
    ],
    "comparison": {
      "heading": "Worked example to check against your calendar",
      "columns": [
        "Quantity",
        "Calculation",
        "Result"
      ],
      "rows": [
        {
          "cells": [
            "Two scheduled periods",
            "4 + 4",
            "8 hours"
          ]
        },
        {
          "cells": [
            "Overall span",
            "06:00 to 19:30",
            "13.5 hours"
          ]
        },
        {
          "cells": [
            "Middle gap",
            "10:00 to 15:30",
            "5.5 hours"
          ]
        },
        {
          "cells": [
            "Gap after the example buffers",
            "10:30 to 15:00",
            "4.5 hours"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Create two exact timed records, not one full-span block.",
      "Use a common roster reference in both titles.",
      "Record travel or other commitments separately if they apply.",
      "Inspect both halves after a change and check actual free/busy output."
    ],
    "faq": [
      {
        "q": "Is the middle gap automatically free?",
        "a": "No. Travel or other commitments may occupy it, and availability depends on your actual constraints."
      },
      {
        "q": "Does eight scheduled hours mean eight paid hours?",
        "a": "No. The calendar example measures planned intervals, not payroll or legal entitlements."
      }
    ],
    "sourcesHeading": "Sources and verification",
    "sources": [
      {
        "label": "RFC 5545: event intervals",
        "url": "https://www.rfc-editor.org/rfc/rfc5545.html#section-3.6.1"
      },
      {
        "label": "RFC 5545: time transparency",
        "url": "https://www.rfc-editor.org/rfc/rfc5545.html#section-3.8.2.7"
      }
    ],
    "articleLinks": [
      {
        "slug": "planning-a-week-in-ten-minutes",
        "label": "Planning a Week in Ten Minutes"
      },
      {
        "slug": "a-week-view-that-fits-a-week",
        "label": "A Week View That Fits a Week"
      },
      {
        "slug": "shift-work-calendar-iphone-rotating-schedules",
        "label": "Shift Work Calendar on iPhone: Rotating Schedules and Family Sharing"
      }
    ],
    "seeAlso": [
      "planning-a-week-in-ten-minutes",
      "a-week-view-that-fits-a-week",
      "shift-work-calendar-iphone-rotating-schedules"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "southern-hemisphere-reverse-dst-two-hour-meeting-shift": {
    "updated": "2026-10-23",
    "title": "Sydney–New York recurring meetings: plan the two-hour seasonal swing",
    "short": "Sydney–New York recurring meetings",
    "description": "Compare Sydney and New York meetings across 2026 seasons, then choose an explicit anchor or an agreed seasonal compromise.",
    "lede": "Sydney and New York observe daylight saving in opposite seasons. Their difference is 14 hours in July 2026 and 16 hours in December. A recurring meeting that is convenient in one season can move by two local hours in the other.",
    "sections": [
      {
        "heading": "Check both hemispheres’ transition calendars",
        "body": [
          "NSW government guidance says daylight saving begins on the first Sunday in October and ends on the first Sunday in April. The US uses the second Sunday in March and first Sunday in November. These independent changes create shoulder periods as well as the summer and winter extremes.",
          "The worked cases use Australia/Sydney and America/New_York, not every city in Australia or the Southern Hemisphere. Other regions can have different dates or no daylight saving. Check the actual cities and occurrence date rather than applying a hemisphere-wide two-hour rule."
        ]
      },
      {
        "heading": "Choose an anchor before choosing exceptions",
        "body": [
          "A series anchored at 17:00 New York appears at 07:00 the next day in Sydney on 6 July 2026. Keep that same New York hour on 7 December and it appears at 09:00 the next day in Sydney. Neither city’s display is broken; their offset has changed.",
          "If both groups agree to share the seasonal adjustment, one possible arrangement is 17:00 New York in July and 16:00 in December. Those examples give Sydney 07:00 and 08:00 respectively: each side changes its local hour by one. This is a negotiation example, not a claim that those times suit every team."
        ]
      },
      {
        "heading": "Audit the shoulder occurrences separately",
        "body": [
          "A two-season agreement does not automatically settle every week between the transitions. Inspect the occurrences around March, April, October and November in both cities. Decide the change date explicitly and retain the organizer’s single source of truth.",
          "If your calendar supports scoped series edits, verify which occurrences change before saving. Google documents event time-zone controls, but the calendar’s display zone is separate from the event’s anchor. After any agreed adjustment, check the first changed occurrence and one ordinary week after it."
        ]
      }
    ],
    "comparison": {
      "heading": "Worked example to check against your calendar",
      "columns": [
        "Example anchor",
        "Sydney display",
        "Purpose"
      ],
      "rows": [
        {
          "cells": [
            "6 July 2026, 17:00 New York",
            "7 July, 07:00",
            "July baseline"
          ]
        },
        {
          "cells": [
            "7 December 2026, 17:00 New York",
            "8 December, 09:00",
            "Unchanged New York hour"
          ]
        },
        {
          "cells": [
            "7 December 2026, 16:00 New York",
            "8 December, 08:00",
            "Illustrative shared seasonal adjustment"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Use the two actual city zones.",
      "Compare July, December and each transition shoulder.",
      "Agree whether one city stays fixed or both adjust.",
      "Verify dates and edit scope before updating invitations."
    ],
    "faq": [
      {
        "q": "Does every Southern Hemisphere meeting shift by two hours?",
        "a": "No. This comparison depends on these two cities and their current rules."
      },
      {
        "q": "Can both cities retain the same local hour all year?",
        "a": "Not when their relative offset changes. Someone must accept a changed hour or an agreed exception."
      }
    ],
    "sourcesHeading": "Sources and verification",
    "sources": [
      {
        "label": "NSW Government: daylight-saving rule",
        "url": "https://dcj.nsw.gov.au/about-us/daylight-saving.html"
      },
      {
        "label": "US Naval Observatory: US daylight-saving rule",
        "url": "https://aa.usno.navy.mil/faq/daylight_time"
      },
      {
        "label": "Google Calendar: event versus display zone",
        "url": "https://support.google.com/calendar/answer/37064?hl=en"
      }
    ],
    "articleLinks": [
      {
        "slug": "time-zones-and-the-flight-you-booked",
        "label": "Time Zones and the Flight You Booked"
      },
      {
        "slug": "when-two-calendars-disagree",
        "label": "When Two Calendars Disagree"
      },
      {
        "slug": "a-week-view-that-fits-a-week",
        "label": "A Week View That Fits a Week"
      }
    ],
    "seeAlso": [
      "time-zones-and-the-flight-you-booked",
      "when-two-calendars-disagree",
      "a-week-view-that-fits-a-week"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "google-calendar-task-deadline-versus-scheduled-time-block": {
    "updated": "2026-10-23",
    "title": "Google task deadline or work block? Reserve the time before it is due",
    "short": "Task Deadline vs Scheduled Work Block",
    "description": "Separate a Google task deadline from start and end times. Plan three work blocks, check Busy availability and verify what the booking tool actually reads.",
    "lede": "A deadline tells you when work is due; it does not estimate or reserve the time needed to finish it. Google Calendar separately documents a task’s deadline, planned start and time spent. Use that distinction to plan the work, then verify availability in the calendar or booking tool that matters.",
    "commonBelief": "",
    "sections": [
      {
        "heading": "Google’s deadline is a date, not an hourly reservation",
        "body": [
          "Google’s task settings guide says Deadline is the date you expect to complete the task and appears in the All day section. Its deadline notification is at 09:00 local time on that date. Record an exact contractual cut-off in the description or a separate timed deadline event if needed; an all-day date marker is not an encoded 17:00 cut-off.",
          "Start date and time lets you specify the start and how much time you plan to spend. Advanced settings offers Free or Busy; Do not disturb and Automatically decline meetings are work/school options. The same guide says recurring tasks cannot have an end time."
        ]
      },
      {
        "heading": "Do not confuse a Google task with an ICS promise",
        "body": [
          "RFC 5545 describes VTODO, including optional DTSTART and DUE, separately from VEVENT. Its TRANSP property applies to VEVENT. These standard component definitions do not prove how Google exports its current timed tasks or how a third-party booking system treats them.",
          "Google documents Busy timed tasks within its own interface. If another system reads calendar events rather than Tasks, test the specific connection. A Busy event is information for availability; it does not universally prevent a person from inviting you or guarantee that every connected service checks that calendar."
        ]
      },
      {
        "heading": "Worked plan: 270 minutes before Friday’s cut-off",
        "body": [
          "Assume a report is due Friday November 13, 2026 at 17:00 and needs 270 minutes of work. Schedule three 90-minute sessions: Tuesday November 10, 09:30–11:00; Wednesday November 11, 14:00–15:30; and Thursday November 12, 09:00–10:30. These are illustrative available times, not dates checked against a real person’s meetings or local holidays.",
          "The three blocks total 4.5 hours. Thursday 10:30 to Friday 17:00 is 30.5 hours. Keep the Friday task deadline date, record the 17:00 requirement explicitly, and check the source calendar for conflicts before committing the blocks."
        ]
      },
      {
        "heading": "Choose the execution item and verify its effect",
        "body": [
          "For a one-off task in Google Calendar, inspect its start/end and Advanced settings availability. For repeated work requiring a duration, consider a recurring event instead of assuming a repeating task supports an end time.",
          "Google Focus time is a separate feature for eligible work/school accounts. The official guide requires Day or Week view and specific start/end times, and documents meeting-decline settings. A normal Busy event is not automatically the same as Focus time with decline enabled.",
          "Check a neutral work block from the actual scheduling or booking flow. Confirm that the relevant calendar is included, the time is treated as unavailable, and details have the intended visibility."
        ]
      }
    ],
    "comparison": {
      "heading": "Three sessions in the illustrative report plan",
      "columns": [
        "Item",
        "Time or date",
        "Purpose"
      ],
      "rows": [
        {
          "cells": [
            "Task deadline",
            "Friday Nov 13, 2026; record 17:00 cut-off explicitly",
            "Track completion date"
          ]
        },
        {
          "cells": [
            "Draft",
            "Tuesday Nov 10, 09:30–11:00",
            "90 minutes"
          ]
        },
        {
          "cells": [
            "Tables",
            "Wednesday Nov 11, 14:00–15:30",
            "90 minutes"
          ]
        },
        {
          "cells": [
            "Review",
            "Thursday Nov 12, 09:00–10:30",
            "90 minutes; 30.5 hours before cut-off"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Estimate effort independently of the due date.",
      "Inspect task start/end and Free/Busy.",
      "Check plan and account eligibility for automatic decline.",
      "Test the actual availability consumer."
    ],
    "faq": [
      {
        "q": "Why did a deadline notify me at 09:00?",
        "a": "Google documents a 09:00 local-time notification on the deadline date. Add an earlier planned work session if you need to start sooner."
      },
      {
        "q": "Does marking an event Busy reject all meeting invitations?",
        "a": "No universal rejection follows from Busy. Automatic decline is a separate supported setting; verify the specific account and feature."
      }
    ],
    "sourcesHeading": "Primary specifications and official documentation",
    "sources": [
      {
        "label": "Google: task deadline, timed tasks and notifications",
        "url": "https://support.google.com/calendar/answer/9901136?hl=en"
      },
      {
        "label": "Google: Focus time eligibility and decline controls",
        "url": "https://support.google.com/calendar/answer/11190973?hl=en"
      },
      {
        "label": "RFC 5545: VTODO",
        "url": "https://www.rfc-editor.org/rfc/rfc5545.html#section-3.6.2"
      },
      {
        "label": "RFC 5545: TRANSP",
        "url": "https://www.rfc-editor.org/rfc/rfc5545.html#section-3.8.2.7"
      },
      {
        "label": "Supporting primary documentation",
        "url": "https://www.rfc-editor.org/rfc/rfc5545"
      }
    ],
    "articleLinks": [
      {
        "slug": "iphone-calendar-tasks-reminders-versus-event-alerts",
        "label": "Tasks and Reminders in an iPhone Calendar"
      },
      {
        "slug": "can-others-see-google-calendar-tasks",
        "label": "Can Others See Your Google Calendar Tasks?"
      },
      {
        "slug": "automatic-time-blocking-versus-manual-calendar",
        "label": "Automatic Time Blocking or Manual Calendar Planning?"
      }
    ],
    "seeAlso": [
      "iphone-calendar-tasks-reminders-versus-event-alerts",
      "can-others-see-google-calendar-tasks",
      "automatic-time-blocking-versus-manual-calendar"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "iana-tzdb-government-time-zone-rule-change-calendar": {
    "updated": "2026-10-23",
    "title": "Time-zone rule changes: diagnose a calendar before moving events",
    "short": "Time-zone rule changes",
    "description": "Collect dated evidence after a government time-zone change, distinguish stale rules from changed event data and avoid bulk one-hour repairs.",
    "lede": "When a government changes its time-zone rules, two calendars can show different local hours without anyone editing the meeting. Diagnose the affected date, location and saved event before moving a series. A blind one-hour correction can create a second error.",
    "sections": [
      {
        "heading": "Separate the rule source from software delivery",
        "body": [
          "IANA maintains a technical database reflecting changes made by political bodies to offsets, boundaries and daylight-saving rules. Its documentation says users generally receive that data through software and operating-system vendors. Governments decide the rules; IANA is not the legal authority for every location.",
          "Google warns that events created before it knew about a regional time-zone change can be wrong. This is a provider-specific warning, not proof that every calendar stores events as fixed UTC instants or that all vendors ship updates simultaneously."
        ]
      },
      {
        "heading": "Make a comparison ledger",
        "body": [
          "For one affected event, record its title or private reference, organizer, exact occurrence date, intended local hour, named location zone and any visible UTC endpoint. Compare the same occurrence in the provider’s web calendar and an updated device, using the same display zone.",
          "As a hypothetical calculation, 14:00 UTC displays as 09:00 at UTC−05:00 and 08:00 at UTC−06:00. That explains a changed display only if the UTC instant stayed fixed. A wall-clock-zoned event re-evaluated under new rules can behave differently; do not infer storage behavior from the label alone."
        ]
      },
      {
        "heading": "Escalate with evidence before repairing",
        "body": [
          "Check the relevant government announcement and the provider’s current guidance for the actual effective date. Install ordinary supported software updates where available, then compare again. A system version is useful evidence but not by itself proof of the provider’s server-side time-zone data version.",
          "Send the organizer or provider the ledger and the expected local time. If a correction is agreed, change only the appropriate scope and inspect a later occurrence. Avoid substituting a nearby country’s zone, bulk resaving all future events, or manually incrementing SEQUENCE as a generic repair. Those actions can alter valid meetings or invitations."
        ]
      }
    ],
    "comparison": {
      "heading": "Worked example to check against your calendar",
      "columns": [
        "Hypothetical record",
        "Interpretation",
        "What it does not prove"
      ],
      "rows": [
        {
          "cells": [
            "Same 14:00 UTC; offset −05:00 → −06:00",
            "Display changes 09:00 → 08:00",
            "That the event was edited"
          ]
        },
        {
          "cells": [
            "Same local 09:00; UTC instant changes",
            "Rules may have been reapplied",
            "That every provider behaves this way"
          ]
        },
        {
          "cells": [
            "Different zones selected by viewers",
            "Display comparison is not controlled",
            "A server-side rule error"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Record the exact affected occurrence and named zone.",
      "Compare equivalent displays in web and device clients.",
      "Check government and provider guidance for the effective date.",
      "Ask the organizer before any scoped repair; preserve the original evidence."
    ],
    "faq": [
      {
        "q": "Should I shift the whole series by one hour?",
        "a": "Not before identifying the cause and intended anchor. A later rules update can make that workaround wrong."
      },
      {
        "q": "Does choosing a neighboring country’s zone solve it?",
        "a": "It can encode the wrong future rules. Use the actual supported location and seek provider guidance."
      }
    ],
    "sourcesHeading": "Sources and verification",
    "sources": [
      {
        "label": "IANA: time-zone database and vendor delivery",
        "url": "https://www.iana.org/time-zones"
      },
      {
        "label": "Google Calendar: daylight-saving and regional rule changes",
        "url": "https://support.google.com/calendar/answer/37064?hl=en"
      },
      {
        "label": "RFC 5545: time-zone components",
        "url": "https://www.rfc-editor.org/rfc/rfc5545.html#section-3.6.5"
      }
    ],
    "articleLinks": [
      {
        "slug": "when-two-calendars-disagree",
        "label": "When Two Calendars Disagree"
      },
      {
        "slug": "time-zones-and-the-flight-you-booked",
        "label": "Time Zones and the Flight You Booked"
      },
      {
        "slug": "what-calendar-sync-actually-does",
        "label": "What Calendar Sync Actually Does"
      }
    ],
    "seeAlso": [
      "when-two-calendars-disagree",
      "time-zones-and-the-flight-you-booked",
      "what-calendar-sync-actually-does"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "google-calendar-email-notifications-filter": {
    "updated": "2026-11-12",
    "seoTitle": "Stop Google Calendar Email Spam: Settings & Gmail Filters",
    "title": "How to Stop or Auto-Filter Google Calendar Notification Emails in Gmail",
    "short": "Google Calendar email noise",
    "description": "Turn off unwanted Google Calendar RSVP and change emails per calendar, or auto-archive invite responses in Gmail without missing real messages.",
    "lede": "You can silence noisy Google Calendar RSVP, new-event, and cancellation emails in two layers: first turn off unnecessary notification categories inside each calendar’s Other notifications settings, then create a targeted Gmail filter for the remaining automated headers so responses skip your inbox.",
    "commonBelief": "The only way to stop Calendar emails is to turn off all notifications.",
    "sections": [
      {
        "heading": "Step 1: choose categories per calendar",
        "body": [
          "On a computer, open Settings and, under Settings for my calendars, click the calendar. Under Other notifications, set each category, such as Changed events or Event responses, to Email or None. Event and all-day event notifications are separate: there you choose a notification or an email for reminders.",
          "Because these are per calendar, a shared team calendar can stay quiet while your primary calendar still emails you about responses.",
          "Google says notification settings are personal to your account. Changing your emails for a team calendar does not change every teammate’s reminders or inbox settings."
        ]
      },
      {
        "heading": "Step 2: filter what you keep",
        "body": [
          "Google documents a Gmail search using header:X-Google-Calendar-Notification: followed by a token, then Create filter to label or archive. Tokens include eventCreated, eventCancelled, timeOrRecurrenceUpdated, roomAdded, locationUpdated, titleUpdated, rsvpAccepted, rsvpDeclined and rsvpTentative.",
          "For example, header:X-Google-Calendar-Notification:rsvpAccepted catches acceptances so you can label and skip the inbox, while cancellations and time changes still land in front of you."
        ]
      },
      {
        "heading": "If you don’t use Gmail",
        "body": [
          "Google says people who don’t use Calendar receive emails when someone creates, updates or deletes an event they’re invited to. For those inboxes, such as Outlook, Google suggests a rule for emails that include noreply-calendar-sync@google.com, and notes that invitation emails show correct recurring-event information only up to 30 days in the past."
        ]
      },
      {
        "heading": "Worked example: an organiser of many meetings",
        "body": [
          "A fictional team lead organises 15 recurring meetings and receives dozens of acceptance emails a week. On their primary calendar they keep Changed events, cancellations and Event responses set to Email, so that every message carries a header Gmail can sort, and add two Gmail filters: rsvpAccepted to a label “RSVP-yes” with skip inbox, and rsvpTentative to the same label.",
          "Declines (rsvpDeclined) are left in the inbox because they may require a reschedule. Time and location changes stay visible.",
          "Check: for a week, compare the label with the meeting’s guest list to make sure no decline was archived."
        ]
      }
    ],
    "comparison": {
      "heading": "What to keep in the inbox",
      "columns": [
        "Email type",
        "Gmail token",
        "Suggested handling"
      ],
      "rows": [
        {
          "cells": [
            "New invitation sent",
            "eventCreated",
            "Inbox"
          ]
        },
        {
          "cells": [
            "Event cancelled",
            "eventCancelled",
            "Inbox"
          ]
        },
        {
          "cells": [
            "Time or recurrence changed",
            "timeOrRecurrenceUpdated",
            "Inbox"
          ]
        },
        {
          "cells": [
            "Location or title changed / room added",
            "locationUpdated, titleUpdated, roomAdded",
            "Keep in the inbox or another deliberately reviewed location;the worked example keeps these visible"
          ]
        },
        {
          "cells": [
            "Guest accepted / maybe",
            "rsvpAccepted, rsvpTentative",
            "Label, skip inbox"
          ]
        },
        {
          "cells": [
            "Guest declined",
            "rsvpDeclined",
            "Inbox"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Open each calendar’s Other notifications and set unneeded categories to None.",
      "Keep reminder notifications separate from change emails.",
      "Create Gmail filters with header:X-Google-Calendar-Notification: tokens.",
      "Keep declines, cancellations and time changes in the inbox.",
      "Outside Gmail, filter on noreply-calendar-sync@google.com."
    ],
    "faq": [
      {
        "q": "Will turning off Event responses emails hide who declined?",
        "a": "It stops the emails for that calendar; responses remain on the event. Check guest lists for important meetings."
      },
      {
        "q": "Can I filter only acceptances?",
        "a": "Yes. Google documents the rsvpAccepted token for header:X-Google-Calendar-Notification: searches."
      }
    ],
    "sourcesHeading": "Google Help pages used",
    "sources": [
      {
        "label": "Google: filter and organise Calendar notifications in Gmail",
        "url": "https://support.google.com/calendar/answer/17366804?hl=en"
      },
      {
        "label": "Google: change Google Calendar notifications (computer)",
        "url": "https://support.google.com/calendar/answer/37242?hl=en&co=GENIE.Platform%3DDesktop"
      },
      {
        "label": "Google: manage Google Calendar invites in other calendar services",
        "url": "https://support.google.com/calendar/answer/15077640?hl=en"
      }
    ],
    "seeAlso": [
      "calendar-notifications-missing-silent-or-duplicated",
      "keeping-track-of-who-replied",
      "what-guests-can-do-to-your-event"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "outlook-create-meeting-from-email": {
    "updated": "2026-10-23",
    "title": "Turn an Outlook email thread into a meeting request",
    "short": "Meeting from an email",
    "description": "Create an Outlook meeting from an email: review required and optional attendees, quoted text, attachments and protected-message limitations before sending.",
    "lede": "When an email thread ends with “let’s meet”, Outlook can start the meeting request for you, with the thread’s people already invited. It only works for some accounts and messages. Arte Soft, the developer of Cloud Calendars, explains what Microsoft documents.",
    "commonBelief": "Any email in any Outlook account can be turned into a meeting.",
    "sections": [
      {
        "heading": "Steps",
        "body": [
          "New Outlook: select the message and, on the Home tab, select Meeting; or open the message and use Meeting on the Message tab. Enter the date, times and location, adjust attendees and send.",
          "Classic Outlook: select the message and choose Meeting on the Home tab, or open it and choose Reply with Meeting on the Message tab. Microsoft’s other page also lists Ctrl+Alt+R, and the More (…) menu if the button isn’t visible."
        ]
      },
      {
        "heading": "Who gets invited and what carries over",
        "body": [
          "Microsoft says people on the original To line become Required attendees and people on Cc become Optional. Its other page says each person in the thread is listed as an invitee by default. Review the list before sending.",
          "Microsoft says the header and body of the original message are included in the meeting body. Its pages don’t say that the email’s attachments are carried over; add any files you need explicitly."
        ]
      },
      {
        "heading": "When it won’t work",
        "body": [
          "Microsoft says Reply with Meeting is available with Business Exchange accounts. Its protected-message guidance needs a client distinction: classic Outlook’s Reply with Meeting can fail for mail encrypted with a sensitivity label or Information Rights Management (IRM). A later note directs users of protected messages to Meeting under Home > Respond in new Outlook or Outlook on the web. Do not treat the classic restriction as a universal ban across all clients. If your permitted workflow still does not work, create a new meeting using only content you are authorized to share."
        ]
      },
      {
        "heading": "Worked example: a supplier thread",
        "body": [
          "A fictional buyer on a work account has a thread with a supplier (To) and a finance colleague (Cc). They select the last message, choose Meeting, and see the supplier as Required and the colleague as Optional, with the thread quoted in the body.",
          "Before sending, they check the complete attendee list, remove internal pricing remarks from the quoted body, inspect whether the needed quote file is present and attach it if missing. They set Tuesday 10:00, verify the time and location, then send.",
          "Check before Send: recipients, quoted thread, any files, date and time. After sending, confirm the calendar contains the intended meeting; do not rely on a post-send inspection to prevent disclosure."
        ]
      }
    ],
    "comparison": {
      "heading": "Email to meeting at a glance",
      "columns": [
        "Question",
        "Per Microsoft"
      ],
      "rows": [
        {
          "cells": [
            "Clients",
            "New Outlook and classic Outlook (Home → Meeting; classic also Reply with Meeting)"
          ]
        },
        {
          "cells": [
            "Account",
            "Business Exchange accounts"
          ]
        },
        {
          "cells": [
            "Attendees",
            "To → Required; Cc → Optional"
          ]
        },
        {
          "cells": [
            "Message text",
            "Header and body included"
          ]
        },
        {
          "cells": [
            "Attachments",
            "Not stated; attach again if needed"
          ]
        },
        {
          "cells": [
            "Encrypted / IRM mail",
            "Classic Reply with Meeting has a restriction; Microsoft directs protected-message users to Meeting in new Outlook or Outlook on the web"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Select the last message in the thread.",
      "Choose Meeting (or Reply with Meeting in classic Outlook).",
      "Review Required and Optional attendees.",
      "Before sending, trim the quoted text and verify any needed attachments.",
      "Check recipients, content and scheduling details before Send; then verify the saved meeting."
    ],
    "faq": [
      {
        "q": "Why is the Meeting button missing?",
        "a": "Microsoft says Reply with Meeting needs a Business Exchange account. In classic Outlook, check the More (…) menu and select an actual message, not a conversation header. For protected mail, Microsoft distinguishes classic Reply with Meeting from the Meeting command in new Outlook or Outlook on the web."
      },
      {
        "q": "Are attachments included?",
        "a": "Microsoft says the header and body are included but does not establish attachment carryover in these instructions. Inspect the draft and attach a needed file only if it is absent."
      }
    ],
    "sourcesHeading": "Microsoft Support pages used",
    "sources": [
      {
        "label": "Microsoft: respond to an email message with a meeting request in Outlook",
        "url": "https://support.microsoft.com/en-us/outlook/respond-to-an-email-message-with-a-meeting-request-in-outlook"
      },
      {
        "label": "Microsoft: create a meeting from an email message in Outlook",
        "url": "https://support.microsoft.com/en-gb/office/create-a-meeting-from-an-email-message-in-outlook-ef65f361-cee9-41fb-8cb6-e00300b765d3"
      },
      {
        "label": "Supporting primary documentation",
        "url": "https://support.microsoft.com/en-us/office/respond-to-an-email-message-with-a-meeting-request-in-outlook-b04e0d58-b221-4ffd-9981-26ceb2bef0ae"
      }
    ],
    "seeAlso": [
      "inviting-people-who-do-not-have-the-app",
      "keeping-track-of-who-replied",
      "meeting-links-that-make-themselves"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "google-calendar-report-assigned-task-spam": {
    "updated": "2026-10-23",
    "title": "Unwanted assigned Google task? Identify the shared source before reporting it",
    "short": "Unwanted assigned Google task? Identify the shared source before reporting it",
    "description": "Report a confirmed unwanted assigned Google task and understand the difference between removing it from your list and unassigning it in the shared source.",
    "lede": "An unwanted assigned task is not the same record as a calendar invitation or a subscribed event. Google provides a reporting action for assigned tasks from shared surfaces such as a space or document. Identify that source before removing anything from a legitimate project.",
    "sections": [
      {
        "heading": "Decide whether the item is an assigned task",
        "body": [
          "Inspect the item type and the shared surface it came from. A normal event with an unfamiliar title calls for invitation or subscription diagnosis instead. A task assigned by a known colleague may be a mistaken assignment requiring a conversation rather than a spam report.",
          "For a fictional project, a legitimate equipment checklist and an unexpected assigned promotional task both appear in a person’s task view. Record the source and reason for concern without following suspicious links. Do not delete the whole project space or every task to resolve the one unwanted item."
        ]
      },
      {
        "heading": "Understand the reporting consequence",
        "body": [
          "Google says reporting an assigned task as spam removes it from the personal list and removes the assignment to that person in the shared space. That is a source relationship change, not simply hiding a calendar row.",
          "Before confirming, establish that the selected task is the intended unwanted assignment. Keep project responsibility separate: if a valid task belongs to someone else, use the team’s ordinary reassignment process rather than misclassifying it as spam just to tidy your own view."
        ]
      },
      {
        "heading": "Use the documented Google reporting route",
        "body": [
          "On a computer, open the assigned task in the Calendar grid, then choose Options > Report as spam and confirm Report as spam. Alternatively, open Tasks in the right side panel of a supported Google surface, open the task and use its menu to report and confirm. Use the actual assigned task; a Cloud Calendars event editor is not this reporting control.",
          "After the action, inspect your task list and, where you legitimately have access, the shared source. Record the observed removal or assignment state. Do not claim the action deleted every copy, removed the source document or blocked all future assignments; those broader effects are not established by the cited procedure."
        ]
      },
      {
        "heading": "Keep a narrow follow-up record",
        "body": [
          "For the fictional example, the equipment task remains a real responsibility while the promotional assignment is the subject of the report. A useful note names the item type, shared source, action and date, without reproducing private document contents or suspicious URLs.",
          "If the item returns or the action is unavailable, report the exact source/interface issue through the service’s support or approved organization route. Keep event spam, task reporting and project membership as separate decisions rather than clearing calendar accounts."
        ]
      }
    ],
    "comparison": {
      "heading": "The fictional project’s item check",
      "columns": [
        "Item",
        "Question before action",
        "Appropriate branch"
      ],
      "rows": [
        {
          "cells": [
            "Known equipment task",
            "Was it assigned to the wrong teammate?",
            "Ordinary responsibility correction"
          ]
        },
        {
          "cells": [
            "Unexpected assigned promotion",
            "Is this the confirmed unwanted assigned task?",
            "Google’s assigned-task report route"
          ]
        },
        {
          "cells": [
            "Unfamiliar event invitation",
            "Is it actually an event rather than a task?",
            "Calendar invitation/source diagnosis"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Identify a task and the shared surface supplying it.",
      "Separate a legitimate mistaken assignment from confirmed unwanted content.",
      "Use Google’s task reporting menu and confirmation for the intended item.",
      "Check personal-list and shared-assignment observations without assuming broader deletion."
    ],
    "faq": [
      {
        "q": "Is this the same as reporting a calendar invitation?",
        "a": "No. The cited workflow concerns assigned tasks. First identify which kind of record you are looking at."
      },
      {
        "q": "Does the report erase the entire shared document or space?",
        "a": "That is not the documented effect. Google specifies removal from the personal list and removal of the assignment to the reporting person."
      }
    ],
    "sourcesHeading": "Official Google documentation checked",
    "sources": [
      {
        "label": "Google Calendar Help: Report assigned tasks as spam",
        "url": "https://support.google.com/calendar/answer/13012543?hl=en"
      }
    ],
    "articleLinks": [
      {
        "slug": "unwanted-calendar-events-iphone",
        "label": "Use event-spam diagnosis for actual invitations"
      },
      {
        "slug": "iphone-calendar-tasks-reminders-versus-event-alerts",
        "label": "Identify tasks versus events and reminders"
      },
      {
        "slug": "can-others-see-google-calendar-tasks",
        "label": "Review task visibility separately"
      }
    ],
    "seeAlso": [
      "unwanted-calendar-events-iphone",
      "iphone-calendar-tasks-reminders-versus-event-alerts",
      "can-others-see-google-calendar-tasks"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "mac-calendar-custom-alert-email-open-file": {
    "updated": "2026-10-23",
    "title": "Use a custom Mac Calendar alert to open a file or send yourself email",
    "short": "Choose a custom alert action",
    "description": "Choose Message with sound, Email or Open file in Mac Calendar’s custom alert. Check timing, calendar support and recipient before relying on it.",
    "lede": "A reminder can do more than show a banner in Calendar on Mac. Apple documents custom actions for a message with sound, an email or opening a file. Choose the action for the preparation task you need, then verify its saved details rather than treating it as a phone automation.",
    "sections": [
      {
        "heading": "Choose an action that matches the task",
        "body": [
          "For a fictional presentation, the speaker wants a local outline ready before the start. Open file is a different goal from an audible reminder or an email to an inbox. Write the desired action, target file or address and intended time before choosing Custom.",
          "Keep the meeting itself at its agreed time. An earlier preparation alert is not a reason to move the event or send the guests another invitation. Use a harmless sample appointment when learning the custom controls."
        ]
      },
      {
        "heading": "Configure the native Mac alert",
        "body": [
          "In Calendar on Mac, double-click the event and click its time to reach the Alert menu. Choose Custom, then the supported action. Apple describes Message with sound, Email and Open file. Review the displayed timing and the additional action-specific choices before saving the event.",
          "The documentation also permits adding another alert through the plus control beside the Alert menu. Exchange events are limited to one alert in Apple’s guide, so do not assume every connected account offers an identical multi-alert arrangement."
        ]
      },
      {
        "heading": "Review the target separately from delivery",
        "body": [
          "For the outline example, confirm the selected file is the current non-sensitive version and can be opened through the intended local setup. For email, inspect the actual target offered by the control rather than assuming the message goes to the event’s invitees. An email reminder is not the same as inviting a new attendee.",
          "The article does not establish behavior while the Mac is unavailable, guarantee execution after sleep, or promise another device runs the action. Keep an appropriate backup for a consequential preparation deadline and verify the real configuration on your own Mac."
        ]
      },
      {
        "heading": "Use the right troubleshooting branch",
        "body": [
          "If the event time is wrong, correct the event at its source. If the custom action points to an old file or unintended address, inspect that action. If the action is a notification that appears silently, examine native Calendar and macOS notification controls separately.",
          "These are native Mac capabilities, not Cloud Calendars custom automation features. Preserve the real event while checking a disposable example without guests."
        ]
      }
    ],
    "comparison": {
      "heading": "Presentation preparation choices",
      "columns": [
        "Need",
        "Custom action to investigate",
        "Verify independently"
      ],
      "rows": [
        {
          "cells": [
            "Visible and audible prompt",
            "Message with sound",
            "Alert time and Mac notification arrangement"
          ]
        },
        {
          "cells": [
            "Inbox reminder",
            "Email",
            "Actual selected recipient and observed delivery"
          ]
        },
        {
          "cells": [
            "Open a preparation document",
            "Open file",
            "Correct file and observed action on the Mac"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Define the action, time and target.",
      "Use the event’s Alert > Custom control in Mac Calendar.",
      "Check account-specific limits before adding another alert.",
      "Observe a harmless example before relying on the action for an important event."
    ],
    "faq": [
      {
        "q": "Does an Email alert invite the meeting guests?",
        "a": "It is a custom reminder action. Inspect its actual target; do not equate it with sending an invitation."
      },
      {
        "q": "Can every Exchange event have several Mac alerts?",
        "a": "Apple’s guide says Exchange events can have only one alert."
      }
    ],
    "sourcesHeading": "Apple documentation checked for this workflow",
    "sources": [
      {
        "label": "Apple: manage notifications from Calendar on Mac",
        "url": "https://support.apple.com/guide/calendar/manage-notifications-icl624fd1912/mac"
      }
    ],
    "articleLinks": [
      {
        "slug": "calendar-notifications-missing-silent-or-duplicated",
        "label": "Separate alert setup from delivery"
      },
      {
        "slug": "keeping-track-of-who-replied",
        "label": "Do not mistake a reminder for an invitation"
      },
      {
        "slug": "drag-an-event-to-move-it",
        "label": "Keep preparation time separate from meeting edits"
      }
    ],
    "seeAlso": [
      "calendar-notifications-missing-silent-or-duplicated",
      "keeping-track-of-who-replied",
      "drag-an-event-to-move-it"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here.",
    "galleryAfterContent": true
  },
  "us-uk-dst-mismatch-weeks-recurring-meeting-calendar": {
    "updated": "2026-10-23",
    "title": "US–UK DST mismatch: check each recurring meeting date",
    "short": "US–UK DST mismatch",
    "description": "Check New York–London meetings during the unequal 2026 and 2027 daylight-saving transitions instead of assuming four weeks every year.",
    "lede": "New York and London change their clocks on different dates. A meeting anchored at 09:00 New York usually appears at 14:00 London, but appears at 13:00 during the mismatch intervals. The number of affected weeks changes by year.",
    "sections": [
      {
        "heading": "Use the actual year’s transition dates",
        "body": [
          "US Naval Observatory guidance describes the US changes on the second Sunday in March and first Sunday in November. GOV.UK lists the UK dates: 29 March and 25 October in 2026; 28 March and 31 October in 2027.",
          "For a 09:00 New York occurrence, the spring mismatch dates are 8–28 March 2026 and 14–27 March 2027, inclusive. The autumn dates are 25–31 October 2026 and 31 October–6 November 2027. A weekly meeting is affected only if it actually occurs within those ranges."
        ]
      },
      {
        "heading": "Decide which wall clock is anchored",
        "body": [
          "Inspect the event’s own time zone, not just the organizer’s location or your calendar grid. An explicitly New York-zoned series can hold 09:00 there while London’s display changes. A UTC-anchored series follows a different rule. Do not infer the anchor from the person who sent the invitation.",
          "Google’s computer help documents an event Time zone control. For other providers, inspect their event details and documentation rather than assume the same path. If both offices want unchanged local hours, no single instant can preserve both hours while the offset changes; agree which occurrence needs an exception."
        ]
      },
      {
        "heading": "Check before changing the series",
        "body": [
          "Open an ordinary occurrence and one inside each mismatch interval, then compare both cities and the calendar date. Send the organizer the specific date, zone and expected local time rather than a vague one-hour correction request.",
          "If you own the event and make an agreed exception, verify its edit scope and the next ordinary occurrence. Do not shift the whole series to fix one week. The examples use current rules and a time after each transition; recheck future policy changes."
        ]
      }
    ],
    "comparison": {
      "heading": "Worked example to check against your calendar",
      "columns": [
        "Year",
        "09:00 New York displays 13:00 London",
        "Mismatch duration at that hour"
      ],
      "rows": [
        {
          "cells": [
            "2026 spring",
            "8–28 March",
            "21 days"
          ]
        },
        {
          "cells": [
            "2026 autumn",
            "25–31 October",
            "7 days"
          ]
        },
        {
          "cells": [
            "2027 spring",
            "14–27 March",
            "14 days"
          ]
        },
        {
          "cells": [
            "2027 autumn",
            "31 October–6 November",
            "7 days"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Identify the event’s zone and the year.",
      "Open one ordinary and one affected occurrence in both cities.",
      "Agree which city’s wall clock takes priority.",
      "Check the scope of any exception and the following occurrence."
    ],
    "faq": [
      {
        "q": "Are there always four mismatch weeks?",
        "a": "No. These ranges total four weeks in 2026 and three weeks in 2027."
      },
      {
        "q": "Will setting the organizer’s calendar to London fix it?",
        "a": "A display setting is not the event’s recurrence anchor. Inspect the actual event time zone."
      }
    ],
    "sourcesHeading": "Sources and verification",
    "sources": [
      {
        "label": "US Naval Observatory: US daylight-saving rules",
        "url": "https://aa.usno.navy.mil/faq/daylight_time"
      },
      {
        "label": "GOV.UK: 2026 and 2027 clock-change dates",
        "url": "https://www.gov.uk/when-do-the-clocks-change"
      },
      {
        "label": "Google Calendar: event time zones",
        "url": "https://support.google.com/calendar/answer/37064?hl=en"
      }
    ],
    "articleLinks": [
      {
        "slug": "when-two-calendars-disagree",
        "label": "When Two Calendars Disagree"
      },
      {
        "slug": "time-zones-and-the-flight-you-booked",
        "label": "Time Zones and the Flight You Booked"
      },
      {
        "slug": "recurring-events-without-the-mess",
        "label": "Recurring Events Without the Mess"
      }
    ],
    "seeAlso": [
      "when-two-calendars-disagree",
      "time-zones-and-the-flight-you-booked",
      "recurring-events-without-the-mess"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "outlook-split-view-overlay-calendars": {
    "updated": "2026-11-12",
    "seoTitle": "Outlook Split View vs Overlay: View Calendars Side by Side",
    "title": "Outlook Split View vs Overlay: Compare Calendars Side by Side or Merged",
    "short": "Outlook split view and overlay",
    "description": "Switch between side-by-side Split View columns and single-grid Overlay mode in new Outlook, Outlook on the web, and classic desktop Outlook.",
    "lede": "Outlook gives you two ways to view multiple calendars without copying events between them: Split View places each person or team calendar in its own side-by-side column, while Overlay stacks color-coded calendars onto one shared time grid. Here is where the toggle lives in new Outlook, web, and classic Outlook.",
    "commonBelief": "An overlay merges calendars, so moving an item moves it in all of them.",
    "sections": [
      {
        "heading": "New Outlook and Outlook on the web",
        "body": [
          "Select the extra calendars in your calendar list. In the Arrange group, select Split view to show them side by side. Deselect Split view to see them in one grid; Microsoft says the events appear overlaid on the default calendar in their assigned colours."
        ]
      },
      {
        "heading": "Classic Outlook",
        "body": [
          "Tick another calendar in the Navigation Pane and it opens next to the current one. On that calendar’s tab, select View in Overlay Mode to stack it on the first (usually your default). To unstack, select View in Side-by-Side Mode on its tab. To remove it from view, clear its check box or select Close on its tab. You can also right-click a calendar and choose Open in New Window."
        ]
      },
      {
        "heading": "Which layout for which question",
        "body": [
          "Side by side helps answer “whose visible event is this?” because each calendar has its own column. Overlay helps spot overlaps in one grid, but colour and the opened item identify the owning calendar. Neither layout supplies calendar access you do not already have, and an empty-looking area alone is not confirmation that a person is free.",
          "Showing calendars together doesn’t change ownership: each item still belongs to its own calendar and its own permissions."
        ]
      },
      {
        "heading": "Worked example: a team lead’s Tuesday",
        "body": [
          "A fictional team lead opens their own calendar and two colleagues’ shared calendars in new Outlook with Split view on. Both colleagues have no visible event between 15:00 and 16:00, but the lead’s own column contains an appointment at 15:30. They switch Split view off and see that appointment in the combined grid; opening it confirms it belongs to their own calendar.",
          "Check: open the 15:30 item to confirm which calendar it belongs to before booking."
        ]
      }
    ],
    "comparison": {
      "heading": "Controls by client",
      "columns": [
        "Action",
        "New Outlook / web",
        "Classic Outlook"
      ],
      "rows": [
        {
          "cells": [
            "Add a calendar to the view",
            "Select it in the calendar list",
            "Tick it in the Navigation Pane"
          ]
        },
        {
          "cells": [
            "Side by side",
            "Arrange → Split view on",
            "Default when ticking another calendar"
          ]
        },
        {
          "cells": [
            "Overlay",
            "Arrange → Split view off",
            "View in Overlay Mode on the calendar tab"
          ]
        },
        {
          "cells": [
            "Back to side by side",
            "Split view on",
            "View in Side-by-Side Mode"
          ]
        },
        {
          "cells": [
            "Remove from view",
            "Deselect it",
            "Clear check box or Close"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Select the calendars to compare.",
      "Use split or side-by-side view to see who is busy.",
      "Use overlay to spot any clash; open items before acting.",
      "Remove extra calendars from view when done."
    ],
    "faq": [
      {
        "q": "How do I overlay calendars in new Outlook?",
        "a": "Select the calendars and turn Split view off in the Arrange group."
      },
      {
        "q": "Does overlay mode combine the calendars?",
        "a": "No. It only displays them together; each item stays in its own calendar."
      }
    ],
    "sourcesHeading": "Microsoft Support page used",
    "sources": [
      {
        "label": "Microsoft: view multiple calendars at the same time in Outlook",
        "url": "https://support.microsoft.com/en-us/outlook/calendar/view-multiple-calendars-at-the-same-time-in-outlook"
      }
    ],
    "seeAlso": [
      "icloud-google-and-outlook-in-one-view",
      "a-week-view-that-fits-a-week",
      "when-two-calendars-disagree"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "google-keep-reminders-moved-to-tasks": {
    "updated": "2026-10-23",
    "title": "Where Google Keep reminders went: finding them in Google Tasks",
    "short": "Keep reminders in Tasks",
    "description": "Google moved Keep reminders to Google Tasks. Find them, spot what changed (location reminders, long titles, old reminders) and check the migration limits.",
    "lede": "Google announced that Keep reminders would move to Tasks in the second half of 2025. Its help page still uses that dated future-tense wording, so it does not prove that every account has completed migration. Use the documented markers and behavior below to check your actual reminders. Arte Soft develops Cloud Calendars.",
    "commonBelief": "Keep reminders were deleted.",
    "sections": [
      {
        "heading": "Check the account rather than assume the rollout state",
        "body": [
          "Google’s page describes new Keep reminders being saved as Tasks and existing reminders moving with their data. It names the second half of 2025 as the migration period but still phrases that announcement in future tense. Treat the behaviors below as Google’s documented migration design, not a fresh measurement that every current account has finished it.",
          "Look in your calendar grid in Google Calendar and in your task list. Google says the task details show “From Keep”."
        ]
      },
      {
        "heading": "What changed",
        "body": [
          "Location-based reminders: Google says you can no longer create or receive them; existing location data can be reviewed in the task description. If you relied on “remind me when I get to the shop”, you now need a time instead.",
          "Long titles are shortened. Repeating reminders are capped: Google says the maximum interval for repeating tasks in Calendar is 1,000 days, weeks, months or years, and longer intervals are adjusted down. Dates beyond the year 3000 are adjusted to 2900.",
          "Notification and title changes deserve their own check. Google says reminder notifications no longer come from Keep;install Calendar or Tasks on the mobile device and allow its notifications. To rename the reminder, use Tasks or Calendar:changing only the Keep note’s title does not update the reminder title. The From Keep link can return you to the original note."
        ]
      },
      {
        "heading": "Reminders that may not be where you expect",
        "body": [
          "Google gives a 100,000-task limit and says that if the number of Keep reminders exceeds that limit, the oldest reminders do not migrate. Non-repeating reminders older than a year go to Old Google Keep Reminders. For work or school accounts, the Tasks service must be enabled;Google also excludes reminders for suspended Workspace licenses. Check the actual account and ask the administrator rather than infer a migration result from a missing row."
        ]
      },
      {
        "heading": "Worked example: a checklist after migration",
        "body": [
          "For an illustration conditional on migration, a user compares three Keep reminders:an old one-off passport reminder, a plant reminder every 3 days and a former post-office location reminder. They first look for From Keep and compare the original notes, without assuming the dated rollout notice proves what happened in their account.",
          "The documented outcomes would put the non-repeating reminder older than a year in Old Google Keep Reminders, retain an ordinary three-day interval within the stated limit, and keep former location data in the task description without a location trigger. The user can add a time if a scheduled reminder fits the real need. They also check Calendar or Tasks notification permission and avoid renaming only the Keep note when the reminder title needs changing.",
          "Check: open each Keep note and confirm the reminder is shown there and in Tasks."
        ]
      }
    ],
    "comparison": {
      "heading": "Migration outcomes",
      "columns": [
        "Keep reminder",
        "After migration (per Google)",
        "Action"
      ],
      "rows": [
        {
          "cells": [
            "Timed, recent",
            "Task with same data, From Keep",
            "None"
          ]
        },
        {
          "cells": [
            "Repeating",
            "Repeating task; interval capped at 1,000 units",
            "Check very long intervals"
          ]
        },
        {
          "cells": [
            "Location-based",
            "No location trigger; location in description",
            "Add a date and time"
          ]
        },
        {
          "cells": [
            "Non-repeating, over a year old",
            "“Old Google Keep Reminders” list",
            "Review or delete"
          ]
        },
        {
          "cells": [
            "Workspace with Tasks off",
            "Not migrated",
            "Ask the administrator"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Check the actual account for From Keep markers rather than treating the old announcement date as proof of migration.",
      "Open Google Tasks and the Calendar grid and look for “From Keep”.",
      "Check the “Old Google Keep Reminders” list.",
      "Give former location reminders a date and time.",
      "Check repeating reminders with very long intervals.",
      "On a work account, ask the administrator if nothing migrated.",
      "For missing notifications, check Calendar or Tasks installation and notification permission;for a reminder title change, edit it in Tasks or Calendar, not only the Keep note."
    ],
    "faq": [
      {
        "q": "Can I still set a location reminder in Keep?",
        "a": "Google says you can no longer create or get location-based reminders."
      },
      {
        "q": "I can’t find an old reminder.",
        "a": "Check the “Old Google Keep Reminders” list, where Google says non-repeating reminders older than a year go."
      }
    ],
    "sourcesHeading": "Google Help page used",
    "sources": [
      {
        "label": "Google: learn about Google Keep reminders in Google Tasks",
        "url": "https://support.google.com/calendar/answer/16540694?hl=en"
      }
    ],
    "seeAlso": [
      "sync-google-tasks-apple-reminders-iphone",
      "can-others-see-google-calendar-tasks",
      "iphone-calendar-tasks-reminders-versus-event-alerts"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "outlook-change-meeting-organizer-or-copy-meeting": {
    "updated": "2026-10-23",
    "title": "You can’t change an Outlook meeting’s organizer: hand it over instead",
    "short": "Change an Outlook organizer",
    "description": "Outlook can’t reassign a meeting organizer, and recent classic builds block copying meetings. Hand over a series safely and reuse meeting details another way.",
    "lede": "When the person who set up a recurring meeting leaves or changes role, the meeting stays theirs. Outlook has no switch to change that, and copying the meeting is no longer the workaround it once was. Arte Soft, the developer of Cloud Calendars, sets out Microsoft’s supported route.",
    "commonBelief": "An admin or a delegate can change who organised a meeting.",
    "sections": [
      {
        "heading": "What Microsoft says",
        "body": [
          "Microsoft’s organisational best practice states plainly that Outlook does not provide a way to change a meeting organizer. For a recurring meeting, end it by setting an earlier end date and sending the update to all attendees; then the new organizer creates a new recurring meeting.",
          "This is the same end-date technique Microsoft recommends for stopping a series, so past occurrences remain as a record while changed occurrences are lost."
        ]
      },
      {
        "heading": "Why copying isn’t the answer",
        "body": [
          "Microsoft says copied meetings lose their link to the original by design, and that from classic Outlook Version 2311 copying meetings is blocked with the message “Copying meetings is not supported.” Microsoft documents a per-user registry value to re-enable copying but says its support team will not troubleshoot issues with copied meetings. Treat that as an administrator decision, not a fix.",
          "To reuse useful text, have the new organizer create a fresh meeting and copy the agenda and intended location. Configure conferencing on that new meeting and check its join details before sending; pasting the old Teams arrangements is not proof that the successor owns the new conference."
        ]
      },
      {
        "heading": "Delegates are a different question",
        "body": [
          "If the departing person was a delegate rather than the organizer, the meeting does not need to move. Microsoft recommends changing the outgoing Editor delegate to Reviewer or none, then granting Editor to the replacement, and keeping only one Editor delegate."
        ]
      },
      {
        "heading": "Worked example: a programme meeting changes hands",
        "body": [
          "A fictional programme manager organises a fortnightly steering group and is moving roles at the end of March. Their successor will run it from April.",
          "The outgoing manager saves the shared action log to SharePoint, opens the series, sets an end date of 31 March and sends “Series ends here; Sam will send the new invitation.” The successor creates a new fortnightly meeting starting in April, with an end date, the same attendees and a link to the action log, and sends it.",
          "Check: attendees see the old series stop after March and the new one start in April, organised by the successor. Nobody copied the old meeting."
        ]
      }
    ],
    "comparison": {
      "heading": "Handover options",
      "columns": [
        "Option",
        "Supported?",
        "Notes"
      ],
      "rows": [
        {
          "cells": [
            "Change organizer on the meeting",
            "No (Microsoft)",
            "—"
          ]
        },
        {
          "cells": [
            "End old series, successor creates new one",
            "Yes (Microsoft’s route)",
            "Past occurrences kept; exceptions lost"
          ]
        },
        {
          "cells": [
            "Copy the meeting",
            "Blocked from classic Version 2311",
            "Registry re-enable is unsupported for troubleshooting"
          ]
        },
        {
          "cells": [
            "Swap delegates",
            "Yes",
            "Only if the person was a delegate, not the organizer"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Confirm who is the organizer and who is only a delegate.",
      "Save shared files from the meeting to OneDrive or SharePoint.",
      "End the old series with an earlier end date and an explanation.",
      "Have the successor create a new series with an end date.",
      "Don’t copy meetings; recreate them."
    ],
    "faq": [
      {
        "q": "Can IT change the organizer for us?",
        "a": "Microsoft’s best-practice page says Outlook does not provide a way to change a meeting organizer. It recommends ending and recreating the series."
      },
      {
        "q": "Why does Outlook say copying meetings isn’t supported?",
        "a": "Microsoft blocked copying meetings from classic Outlook Version 2311 because copied meetings produce unexpected results."
      }
    ],
    "sourcesHeading": "Microsoft Support pages used",
    "sources": [
      {
        "label": "Microsoft: best practices for organisations using the Outlook calendar",
        "url": "https://support.microsoft.com/en-us/outlook/best-practices-for-organizations-when-using-the-outlook-calendar"
      },
      {
        "label": "Microsoft: Outlook blocks copying meetings",
        "url": "https://support.microsoft.com/en-us/Support/known-issues/outlook-blocks-copying-meetings-with-copying-meetings-is-not-supported"
      }
    ],
    "seeAlso": [
      "recurring-events-without-the-mess",
      "event-saved-to-wrong-calendar",
      "exchange-calendars-on-an-iphone"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "firefighter-24-48-kelly-day-calendar-pattern": {
    "updated": "2026-10-23",
    "title": "24/48 firefighter calendar: add a Kelly day without shifting the roster",
    "short": "24/48 firefighter calendar",
    "description": "Model a 24-on/48-off roster and a Kelly-day exception while preserving the base cycle and checking exact handover dates.",
    "lede": "A 24-on/48-off roster repeats every three days, so its starts move through the week. A Kelly day removes an assigned tour according to the employer’s pattern; it should not accidentally shift every later start.",
    "sections": [
      {
        "heading": "Confirm which tour is removed",
        "body": [
          "South Burlington Fire’s recruitment page describes a 24-hour-on, 48-hour-off schedule with a Kelly day every seventh shift. That is a documented example, not a rule for every fire department. Obtain your platoon’s anchor date and Kelly-day phase from the approved roster.",
          "For an illustrative schedule with day 1 on Sunday 1 November 2026 at 07:00, starts fall on days 1, 4, 7, 10, 13, 16 and 19. The next start is day 22. Consecutive starts advance three weekdays; the weekday pattern returns after 21 days."
        ]
      },
      {
        "heading": "Keep the underlying three-day series",
        "body": [
          "A recurrence model for the base starts is FREQ=DAILY;INTERVAL=3. A Kelly exception should exclude the assigned tour while leaving the later starts unchanged. RFC 5545 defines EXDATE as one way to exclude an occurrence, but a provider may represent an edited or cancelled instance differently.",
          "In this example, remove day 19, the seventh scheduled tour, only after confirming that is the correct phase. Day 16 ends at 07:00 on day 17, and the next actual start remains day 22 at 07:00. In this no-clock-change interval, the gap is 120 elapsed hours. It is not a new six-day repeating base schedule."
        ]
      },
      {
        "heading": "Inspect the exception scope",
        "body": [
          "Google’s recurring-event documentation says to choose which events an edit applies to, but it does not promise a particular export representation. Confirm the selected occurrence is removed and inspect the next two retained tours. If the app cannot express the exception reliably, keep a checked finite roster instead.",
          "A 24-hour wall-clock handover interval can have a different elapsed length across a daylight-saving change. Check those weekends separately. Calendar intervals do not establish paid hours, staffing rules or leave entitlements."
        ]
      }
    ],
    "comparison": {
      "heading": "Worked example to check against your calendar",
      "columns": [
        "Start position",
        "Illustrative date",
        "Result"
      ],
      "rows": [
        {
          "cells": [
            "Day 16",
            "16 November, 07:00",
            "Tour ends 17 November, 07:00"
          ]
        },
        {
          "cells": [
            "Day 19",
            "19 November, 07:00",
            "Kelly exception in this illustration"
          ]
        },
        {
          "cells": [
            "Day 22",
            "22 November, 07:00",
            "Original base start retained"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Check the platoon anchor, handover time and Kelly phase.",
      "Build the three-day starts over a finite sample.",
      "Remove only the approved occurrence and retain its roster reference.",
      "Check the next two tours and daylight-saving endpoints."
    ],
    "faq": [
      {
        "q": "Should I use weekly weekday checkboxes?",
        "a": "A three-day interval does not stay on the same weekdays, so a weekly selection alone does not model the base cycle."
      },
      {
        "q": "Will deleting one occurrence always create an EXDATE?",
        "a": "No. That is a standard representation, not a guarantee about a provider’s internal storage or export."
      }
    ],
    "sourcesHeading": "Sources and verification",
    "sources": [
      {
        "label": "South Burlington Fire: 24/48 and every-seventh-shift Kelly day",
        "url": "https://www.southburlingtonvt.gov/170/Careers"
      },
      {
        "label": "RFC 5545: recurrence exclusions",
        "url": "https://www.rfc-editor.org/rfc/rfc5545.html#section-3.8.5.1"
      },
      {
        "label": "Google Calendar: edit a recurring event",
        "url": "https://support.google.com/calendar/answer/37115?hl=en"
      }
    ],
    "articleLinks": [
      {
        "slug": "shift-work-calendar-iphone-rotating-schedules",
        "label": "Shift Work Calendar on iPhone: Rotating Schedules and Family Sharing"
      },
      {
        "slug": "recurring-events-without-the-mess",
        "label": "Recurring Events Without the Mess"
      },
      {
        "slug": "the-year-in-one-screen",
        "label": "The Year in One Screen"
      }
    ],
    "seeAlso": [
      "shift-work-calendar-iphone-rotating-schedules",
      "recurring-events-without-the-mess",
      "the-year-in-one-screen"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "dupont-28-day-rotating-shift-calendar-cycle": {
    "updated": "2026-10-23",
    "title": "DuPont 28-day shift calendar: map the cycle before repeating it",
    "short": "DuPont 28-day shift calendar",
    "description": "Audit an illustrative 28-day DuPont roster, including next-day night endpoints, 72-hour gaps and safe recurrence boundaries.",
    "lede": "A DuPont calendar needs an exact roster, not just a repeat-every-four-weeks label. Map all 28 start-date positions and their day or night times first. A schedule name alone does not establish the order of shifts at your workplace.",
    "sections": [
      {
        "heading": "Separate documented practice from the example",
        "body": [
          "Henderson County EMS documents a modified DuPont schedule with seven day shifts, seven night shifts and seven consecutive days off in a 28-day cycle. That source does not specify every workplace’s exact ordering. The sequence here is an illustrative roster: 4 nights, 3 off, 3 days, 1 off, 3 nights, 3 off, 4 days, 7 off.",
          "Starting 7 November 2026, use 07:00–19:00 for days and 19:00–07:00 next day for nights, in America/New_York. All dates in this example are after the autumn clock change, so these illustrative shifts each last 12 elapsed hours."
        ]
      },
      {
        "heading": "Measure gaps from the previous end",
        "body": [
          "The first night block starts 7–10 November and ends 11 November at 07:00. The next day block starts 14 November at 07:00: a 72-hour gap. The second night block starts 18–20 November and ends 21 November at 07:00. The following day block starts 24 November at 07:00: another 72-hour gap.",
          "These are elapsed gaps between endpoints, not a recommendation about recovery or an employer’s rules. Fourteen 12-hour intervals total 168 planned hours. A day label marked off can still contain the end of the preceding night shift."
        ]
      },
      {
        "heading": "Choose an entry method you can verify",
        "body": [
          "An iCalendar model can represent each of the fourteen work-start positions as its own daily rule with INTERVAL=28. This avoids assuming an editor exposes a complex four-week weekday selector. It is a model, not evidence of any particular app’s import support.",
          "If your roster editor has a rotation feature, preview the actual dates before exporting. Compare the last night of a block, the following day block and the boundary into the next cycle. Keep a finite review horizon and recheck employer changes rather than extending an unverified pattern indefinitely."
        ]
      }
    ],
    "comparison": {
      "heading": "Worked example to check against your calendar",
      "columns": [
        "Cycle positions",
        "Illustrative November 2026 starts",
        "Type"
      ],
      "rows": [
        {
          "cells": [
            "1–4",
            "7–10",
            "Night"
          ]
        },
        {
          "cells": [
            "5–7",
            "11–13",
            "Off start-dates"
          ]
        },
        {
          "cells": [
            "8–10",
            "14–16",
            "Day"
          ]
        },
        {
          "cells": [
            "11",
            "17",
            "Off"
          ]
        },
        {
          "cells": [
            "12–14",
            "18–20",
            "Night"
          ]
        },
        {
          "cells": [
            "15–17",
            "21–23",
            "Off start-dates"
          ]
        },
        {
          "cells": [
            "18–21",
            "24–27",
            "Day"
          ]
        },
        {
          "cells": [
            "22–28",
            "28 November–4 December",
            "Off"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Obtain the employer-approved 28-day sequence and start date.",
      "Assign an explicit start time and following-date end to every night.",
      "Count seven day starts and seven night starts in the sample cycle.",
      "Audit the next cycle and any clock-change weekend before sharing."
    ],
    "faq": [
      {
        "q": "Does every DuPont roster use this exact order?",
        "a": "No. The employer source describes a modified schedule; your approved roster determines the order and phase."
      },
      {
        "q": "Can I group all matching weekdays into a four-week rule?",
        "a": "Only if the generated dates exactly match the cycle. Separate 28-day start-position rules are a clearer reference model when weekday grouping is uncertain."
      }
    ],
    "sourcesHeading": "Sources and verification",
    "sources": [
      {
        "label": "Henderson County EMS: modified DuPont schedule",
        "url": "https://www.hendersoncountync.gov/ems/page/working-hcems"
      },
      {
        "label": "RFC 5545: recurrence",
        "url": "https://www.rfc-editor.org/rfc/rfc5545.html#section-3.3.10"
      },
      {
        "label": "Google Calendar: recurring-event controls and limits",
        "url": "https://support.google.com/calendar/answer/37115?hl=en"
      }
    ],
    "articleLinks": [
      {
        "slug": "shift-work-calendar-iphone-rotating-schedules",
        "label": "Shift Work Calendar on iPhone: Rotating Schedules and Family Sharing"
      },
      {
        "slug": "month-view-on-a-bigger-screen",
        "label": "Month View on a Bigger Screen"
      },
      {
        "slug": "the-year-in-one-screen",
        "label": "The Year in One Screen"
      }
    ],
    "seeAlso": [
      "shift-work-calendar-iphone-rotating-schedules",
      "month-view-on-a-bigger-screen",
      "the-year-in-one-screen"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "icalendar-exdate-recurrence-id-moved-instance": {
    "updated": "2026-10-23",
    "title": "EXDATE or RECURRENCE-ID: skip one meeting or move it to another day",
    "short": "Skip or move a recurring instance",
    "description": "Compare an ICS exclusion with a moved recurrence override. Keep the original occurrence identity when one meeting changes date.",
    "lede": "Skipping a weekly meeting and moving that same meeting are different operations. EXDATE removes a generated start; a recurrence override can retain the instance’s identity while giving it a different start. The distinction matters when diagnosing a missing or doubled appointment.",
    "sections": [
      {
        "heading": "Start with a three-date schedule",
        "body": [
          "Imagine a fictional weekly series starting at 09:00Z on 2 November 2026 with COUNT=3. Its ordinary starts are 2, 9 and 16 November. If the 9 November meeting is cancelled with no replacement, an exclusion of that original start leaves 2 and 16 November.",
          "RFC 5545 section 3.8.5.1 defines EXDATE as a set of exceptions removed from the recurrence set. Its values must use the matching value type. Excluding an occurrence is not itself a new start time for that occurrence."
        ]
      },
      {
        "heading": "Retain original identity when an instance moves",
        "body": [
          "Suppose instead that the 9 November meeting moves to Tuesday 10 November at 14:00Z. Section 3.8.4.4 defines RECURRENCE-ID using the original scheduled DTSTART of that instance. The override therefore refers to RECURRENCE-ID:20261109T090000Z even though its new DTSTART is 20261110T140000Z.",
          "The override belongs to the same series UID. Using 10 November as the recurrence identifier would describe a different identity, not simply document the new time. The field identifies which original occurrence is being changed; the new DTSTART describes where it goes."
        ]
      },
      {
        "heading": "Do not confuse a matching date list with matching identity",
        "body": [
          "Adding a separate event on 10 November and excluding 9 November can make a screen show the same dates. That does not establish that the separate event retains the original recurrence relationship, invitation state or later update behavior. Identify which operation your provider actually performed.",
          "RFC 5545 also supports RDATE as an additional inclusion date. A union of dates and an override of an identified instance answer different structural questions, even when the resulting grid initially looks similar. A screenshot alone cannot prove how a series exception is represented."
        ]
      },
      {
        "heading": "Check the source and neighboring dates",
        "body": [
          "For the fictional move, verify 2 November stays at 09:00Z, 9 November no longer shows the ordinary meeting, 10 November shows the replacement at 14:00Z and 16 November remains unchanged. Record the owning calendar and organizer as well as the visible dates.",
          "This is an interchange diagnostic, not a claim that Cloud Calendars exposes raw EXDATE, RDATE or RECURRENCE-ID editing. Use the original provider’s supported single-instance change when necessary. Do not rewrite a real file or recreate the series just to investigate one unfamiliar field."
        ]
      }
    ],
    "comparison": {
      "heading": "Two different outcomes from the same original series",
      "columns": [
        "Intended outcome",
        "Relevant original identity",
        "Expected visible starts"
      ],
      "rows": [
        {
          "cells": [
            "Skip 9 November",
            "EXDATE:20261109T090000Z",
            "2 and 16 November at 09:00Z"
          ]
        },
        {
          "cells": [
            "Move 9 November to 10 November",
            "RECURRENCE-ID:20261109T090000Z; new DTSTART:20261110T140000Z",
            "2 November 09:00Z; 10 November 14:00Z; 16 November 09:00Z"
          ]
        },
        {
          "cells": [
            "Create an unrelated extra event",
            "A separate event identity",
            "May look similar; series relationship not established"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Write the original scheduled start before changing one occurrence.",
      "Decide whether it is being skipped, moved or replaced by an unrelated event.",
      "For a move, distinguish the old recurrence identity from the new start.",
      "Check the changed date and neighboring occurrences at the owning source."
    ],
    "faq": [
      {
        "q": "Why does RECURRENCE-ID show the old date after a move?",
        "a": "That is its purpose: it identifies the original occurrence being changed. The new DTSTART supplies the moved time."
      },
      {
        "q": "Does EXDATE itself specify the replacement time?",
        "a": "No. It excludes starts. A replacement requires an appropriate additional representation or supported provider operation."
      }
    ],
    "sourcesHeading": "Primary documentation used for this guide",
    "sources": [
      {
        "label": "RFC5545 §3.8.4.4: recurrence identity of a moved instance",
        "url": "https://www.rfc-editor.org/rfc/rfc5545.html#section-3.8.4.4"
      },
      {
        "label": "RFC5545 §3.8.5.1: exception dates",
        "url": "https://www.rfc-editor.org/rfc/rfc5545.html#section-3.8.5.1"
      },
      {
        "label": "RFC5545 §3.8.5.2: additional recurrence dates",
        "url": "https://www.rfc-editor.org/rfc/rfc5545.html#section-3.8.5.2"
      }
    ],
    "articleLinks": [
      {
        "slug": "recurring-events-without-the-mess",
        "label": "Choose the supported one-occurrence edit"
      },
      {
        "slug": "drag-an-event-to-move-it",
        "label": "Distinguish a move from a series change"
      },
      {
        "slug": "calendar-export-ics-pdf-and-backup",
        "label": "Check a recurrence exception after export"
      }
    ],
    "seeAlso": [
      "recurring-events-without-the-mess",
      "drag-an-event-to-move-it",
      "calendar-export-ics-pdf-and-backup"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "icalendar-floating-time-utc-tzid": {
    "updated": "2026-10-23",
    "title": "iCalendar floating time, UTC and TZID: which time does the file mean?",
    "short": "Floating time or a fixed instant",
    "description": "Compare floating DATE-TIME, UTC Z and TZID values in an ICS file. Avoid changing a real meeting when the display zone changes.",
    "lede": "A bare 09:00 in an ICS timestamp does not always mean a meeting fixed to one instant. Identify whether the file uses floating time, UTC or a named time zone before deciding that another calendar moved the appointment.",
    "sections": [
      {
        "heading": "Recognize the three representations",
        "body": [
          "RFC 5545 section 3.3.5 defines three DATE-TIME forms. A value without Z and without a TZID parameter is floating. A trailing Z means UTC. A local value with a TZID parameter refers to a time-zone definition. A VTIMEZONE component elsewhere in the file does not make a bare floating value zone-specific.",
          "For example, DTSTART:20261102T090000 is floating. DTSTART:20261102T090000Z identifies 09:00 UTC. DTSTART;TZID=Europe/Paris:20261102T090000 uses a named zone; a complete interoperable calendar object must provide the necessary time-zone information. These are property illustrations, not three equivalent full import files."
        ]
      },
      {
        "heading": "Decide whether the clock hour or the instant should stay fixed",
        "body": [
          "Consider two fictional people using fixed offsets UTC+02:00 and UTC+09:00. A floating 09:00 is intended to remain 09:00 in each person’s applicable local zone, so they would act at different actual instants. A 09:00Z meeting appears at 11:00 and 18:00 respectively. The table uses fixed offsets for arithmetic, not a claim about any city’s seasonal rules.",
          "A local stretching reminder might reasonably follow the clock hour wherever the person is. A video meeting normally needs one shared instant. Ask the organizer which intention applies. Merely adding Z to a floating timestamp changes its meaning; it is not cosmetic cleanup."
        ]
      },
      {
        "heading": "Do not paste an ISO offset into an iCalendar DATE-TIME",
        "body": [
          "The RFC does not permit a numeric UTC offset as part of this DATE-TIME value. A value such as 20261102T090000+0200 is not the iCalendar DATE-TIME form, even though similar offset notation is familiar elsewhere. Use a valid UTC value or a time-zone reference generated by the supported calendar system.",
          "For named-zone recurring events, inspect occurrences around clock changes as well as the first date. A fixed offset used for this example is not a substitute for a named zone’s changing rules. This guide does not supply a complete VTIMEZONE generator."
        ]
      },
      {
        "heading": "Trace an apparent shift without rescheduling everyone",
        "body": [
          "Compare the organizer’s confirmation, the original timestamp form and the receiving display zone. If the original represents one instant, a changed local display hour can be correct. Moving the event to restore the old visible hour can then change the actual meeting.",
          "Cloud Calendars is a calendar application, not the authority that redefines RFC timestamps. This guide does not claim that its editor exposes raw TZID or floating-time controls. Make a necessary representation correction at the owning provider using supported controls, preserve the original and verify the result."
        ]
      }
    ],
    "comparison": {
      "heading": "Illustrative result for two fixed-offset readers",
      "columns": [
        "Property form",
        "Reader at UTC+02:00",
        "Reader at UTC+09:00"
      ],
      "rows": [
        {
          "cells": [
            "20261102T090000, no TZID",
            "09:00 local",
            "09:00 local"
          ]
        },
        {
          "cells": [
            "20261102T090000Z",
            "11:00 local",
            "18:00 local"
          ]
        },
        {
          "cells": [
            "TZID=… with local value",
            "Depends on referenced zone",
            "Same instant, converted for this reader"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Inspect Z and the TZID parameter before comparing visible hours.",
      "Write down whether the appointment means one shared instant or a local clock routine.",
      "Check the display zone separately from the stored event.",
      "Use the owning provider to correct a genuine mismatch; do not manually append offsets."
    ],
    "faq": [
      {
        "q": "Does VTIMEZONE make every timestamp in a file local to that zone?",
        "a": "No. A DATE-TIME without Z or TZID is floating regardless of other VTIMEZONE components."
      },
      {
        "q": "Can two recipients see the same floating time but attend at different moments?",
        "a": "Yes. Floating time can follow each recipient’s local clock. That is why it is usually unsuitable for a shared meeting instant."
      }
    ],
    "sourcesHeading": "Primary documentation used for this guide",
    "sources": [
      {
        "label": "RFC 5545 §3.3.5: DATE-TIME forms and floating time",
        "url": "https://www.rfc-editor.org/rfc/rfc5545.html#section-3.3.5"
      }
    ],
    "articleLinks": [
      {
        "slug": "time-zones-and-the-flight-you-booked",
        "label": "Check event and display zones"
      },
      {
        "slug": "when-two-calendars-disagree",
        "label": "Trace a disagreement to its source"
      },
      {
        "slug": "calendar-export-ics-pdf-and-backup",
        "label": "Check what an exported file preserves"
      }
    ],
    "seeAlso": [
      "time-zones-and-the-flight-you-booked",
      "when-two-calendars-disagree",
      "calendar-export-ics-pdf-and-backup"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "icalendar-duration-p1d-pt24h-dst": {
    "updated": "2026-10-23",
    "title": "iCalendar P1D versus PT24H: why a day can end at a different hour",
    "short": "One day or exactly 24 hours?",
    "description": "Compare nominal days with elapsed hours in ICS DURATION across a clock change. Decide whether a deadline follows local time or a fixed interval.",
    "lede": "An event lasting one calendar day is not always an event lasting exactly 24 hours. When a time zone changes its clock, DURATION:P1D and DURATION:PT24H can lead to different local ending hours.",
    "sections": [
      {
        "heading": "Choose the duration that matches the real commitment",
        "body": [
          "RFC 5545 section 3.3.6 distinguishes nominal durations expressed in weeks or days from accurate durations expressed in hours, minutes and seconds. A day’s exact elapsed length depends on its calendar position, including a daylight-saving transition. The specification adds larger components first when evaluating a mixed duration.",
          "Use a nominal day when the intended end follows the local calendar-day position. Use an exact hour interval when the agreement really means that elapsed time. A timed appointment’s duration is different again from an all-day DATE label; do not change an event to all-day merely to hide a one-hour discrepancy."
        ]
      },
      {
        "heading": "Calculate a forward clock change",
        "body": [
          "Use a fictional zone that advances from UTC+01:00 to UTC+02:00 during the night between Day 1 and Day 2. Start at 12:00 on Day 1, which is 11:00Z. Adding one nominal day reaches 12:00 on Day 2, now 10:00Z: 23 elapsed hours later.",
          "Adding PT24H instead reaches 11:00Z on Day 2, which is 13:00 in the new offset. Both calculations are internally consistent; they answer different questions. These are explicit assumed offsets, not current rules for a named city or an observed app result."
        ]
      },
      {
        "heading": "Check a backward change too",
        "body": [
          "Now assume a fictional zone changes from UTC+02:00 to UTC+01:00 during that night. Starting at 12:00 on Day 1 means 10:00Z. One nominal day reaches 12:00 on Day 2, or 11:00Z: 25 elapsed hours. Exactly 24 hours reaches 10:00Z on Day 2, or 11:00 local.",
          "The difference is caused by the specified clock transition, not a rule that every P1D lasts 23 or 25 hours. On an ordinary day without a relevant offset change, the two examples can coincide. Real named-zone data and the exact start date are needed for a real calculation."
        ]
      },
      {
        "heading": "Keep an explicit end separate from a duration",
        "body": [
          "For a VEVENT, the RFC permits DURATION as an alternative to DTEND and prohibits specifying both in the same event. An explicit DTEND supplies the ending value; DURATION describes how to obtain the end from the start. DATE-based starts have additional restrictions: their duration uses day or week form.",
          "This guide does not claim that Cloud Calendars offers raw DURATION syntax or chooses one representation for every provider. Inspect the original event and the supported provider editor. For an important overnight commitment, confirm the intended local endpoint and elapsed interval before making a correction."
        ]
      }
    ],
    "comparison": {
      "heading": "Illustrative noon-to-noon calculation with assumed offset changes",
      "columns": [
        "Clock behavior overnight",
        "P1D result",
        "PT24H result"
      ],
      "rows": [
        {
          "cells": [
            "UTC+01:00→UTC+02:00",
            "Day 2 at 12:00 local; 23 elapsed hours",
            "Day 2 at 13:00 local; 24 elapsed hours"
          ]
        },
        {
          "cells": [
            "UTC+02:00→UTC+01:00",
            "Day 2 at 12:00 local; 25 elapsed hours",
            "Day 2 at 11:00 local; 24 elapsed hours"
          ]
        },
        {
          "cells": [
            "No relevant offset change",
            "Next local day at 12:00; 24 hours",
            "Next local day at 12:00; 24 hours"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Write the intended local ending time and whether elapsed hours are contractual.",
      "Check the actual named zone and transition date.",
      "Inspect whether the record uses DURATION or DTEND.",
      "Compare both endpoints in the owning provider before shifting the event."
    ],
    "faq": [
      {
        "q": "Does P1D always mean 86400 seconds?",
        "a": "No. The RFC treats days as nominal durations whose exact length depends on calendar position and relevant clock changes."
      },
      {
        "q": "May a VEVENT contain both DTEND and DURATION?",
        "a": "No. They are alternative ways of specifying its end under RFC 5545."
      }
    ],
    "sourcesHeading": "Primary specification checked for this guide",
    "sources": [
      {
        "label": "RFC 5545 §3.3.6: duration semantics and clock discontinuities",
        "url": "https://www.rfc-editor.org/rfc/rfc5545.html#section-3.3.6"
      },
      {
        "label": "RFC 5545 §3.8.2.5: DURATION property",
        "url": "https://www.rfc-editor.org/rfc/rfc5545.html#section-3.8.2.5"
      },
      {
        "label": "RFC 5545 §3.6.1: VEVENT endpoint constraints",
        "url": "https://www.rfc-editor.org/rfc/rfc5545.html#section-3.6.1"
      }
    ],
    "articleLinks": [
      {
        "slug": "time-zones-and-the-flight-you-booked",
        "label": "Separate event timing from display zones"
      },
      {
        "slug": "what-an-all-day-event-really-means",
        "label": "Choose an all-day label or timed commitment"
      },
      {
        "slug": "when-two-calendars-disagree",
        "label": "Compare the intended endpoints"
      }
    ],
    "seeAlso": [
      "time-zones-and-the-flight-you-booked",
      "what-an-all-day-event-really-means",
      "when-two-calendars-disagree"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here.",
    "galleryAfterContent": true
  },
  "icalendar-valarm-relative-absolute-trigger": {
    "updated": "2026-11-12",
    "seoTitle": "iCalendar VALARM TRIGGER: Relative (-PT15M) vs Absolute UTC",
    "title": "iCalendar (ICS) VALARM TRIGGER Explained: Relative vs Fixed UTC Alarms",
    "short": "Read an alarm trigger",
    "description": "Decode TRIGGER:-PT15M, RELATED=END, and VALUE=DATE-TIME in ICS files—and see why an absolute UTC alarm stays stuck at the old hour when a meeting moves.",
    "lede": "In an iCalendar (.ics) VALARM block, a duration trigger like TRIGGER:-PT15M fires 15 minutes before DTSTART (or relative to DTEND when RELATED=END is set) and shifts automatically if the event moves, whereas TRIGGER;VALUE=DATE-TIME:20261115T094500Z locks the reminder to a fixed UTC timestamp.",
    "sections": [
      {
        "heading": "Find the reference point",
        "body": [
          "RFC 5545 section 3.8.6.3 defines TRIGGER inside VALARM. Its default value type is DURATION, measured relative to the associated event’s start unless RELATED specifies otherwise. A negative duration is before that point; a positive duration is after it.",
          "For a fictional event from 10:00Z to 11:00Z, TRIGGER:-PT15M means 09:45Z. TRIGGER;RELATED=END:-PT15M means 10:45Z, while TRIGGER;RELATED=END:PT5M means 11:05Z. A displayed offset is incomplete until you know whether it is relative to START or END."
        ]
      },
      {
        "heading": "Distinguish a fixed absolute trigger",
        "body": [
          "TRIGGER;VALUE=DATE-TIME:20261102T094500Z specifies an absolute UTC instant. RELATED is not valid on that absolute form. If the meeting is moved from 10:00Z to 11:00Z, the absolute value still describes 09:45Z; a relative fifteen-minute-before-start rule would instead calculate 10:45Z from the new start.",
          "The table shows calculated semantics, not a guarantee that an editor leaves absolute alarms unchanged during a reschedule. A provider may rewrite the alarm, so reopen the saved record before concluding what happened. On a recurring event, an absolute trigger describes that specified instant, with any explicit alarm repeats; it is not automatically a new alarm at that clock time for every occurrence."
        ]
      },
      {
        "heading": "Check that the necessary event fields exist",
        "body": [
          "A start-relative trigger requires DTSTART in its parent. An end-relative VEVENT alarm requires DTEND or the combination of DTSTART and DURATION. A raw END offset without a defined event end is not enough information to calculate a valid target.",
          "DATE-only events use a midnight reference in the user’s configured zone under the RFC, with a UTC fallback when none is found. A generic “before this all-day event” therefore needs more care than assuming an ordinary daytime appointment. Use the provider’s supported all-day alert controls for the result you actually need."
        ]
      },
      {
        "heading": "Separate the calculated trigger from notification delivery",
        "body": [
          "VALARM also needs an ACTION; display alarms require their display text. A trigger property is not a whole alarm or proof that an operating system delivered it. Application support, permissions and notification delivery still need checking separately.",
          "This guide does not promise that Cloud Calendars imports every alarm action or exposes raw START, END and absolute choices. Compare its saved alert settings and the owning provider, then use the notification troubleshooting guide if the calculation is correct but delivery fails."
        ]
      }
    ],
    "comparison": {
      "heading": "Illustrative event moved from 10:00–11:00Z to 11:00–12:00Z",
      "columns": [
        "Trigger meaning",
        "Before move",
        "Calculated after move if trigger unchanged"
      ],
      "rows": [
        {
          "cells": [
            "START minus 15 minutes",
            "09:45Z",
            "10:45Z"
          ]
        },
        {
          "cells": [
            "END minus 15 minutes",
            "10:45Z",
            "11:45Z"
          ]
        },
        {
          "cells": [
            "END plus 5 minutes",
            "11:05Z",
            "12:05Z"
          ]
        },
        {
          "cells": [
            "Absolute 09:45Z on the specified date",
            "09:45Z",
            "09:45Z"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Identify the parent event’s start and end.",
      "Read VALUE and RELATED before interpreting the offset.",
      "Calculate the target time with the saved values.",
      "Check ACTION and app support separately from notification permission and delivery."
    ],
    "faq": [
      {
        "q": "Is TRIGGER:-PT15M relative to the end?",
        "a": "No. The default reference is the start. RELATED=END explicitly selects the end."
      },
      {
        "q": "Does an absolute alarm automatically repeat with a weekly event?",
        "a": "No. The RFC describes the specified absolute instant and any explicit alarm repeats, not an automatically recalculated weekly offset."
      }
    ],
    "sourcesHeading": "Primary specification checked for this guide",
    "sources": [
      {
        "label": "RFC 5545 §3.8.6.3: TRIGGER reference and value type",
        "url": "https://www.rfc-editor.org/rfc/rfc5545.html#section-3.8.6.3"
      },
      {
        "label": "RFC 5545 §3.6.6: VALARM action and structural requirements",
        "url": "https://www.rfc-editor.org/rfc/rfc5545.html#section-3.6.6"
      }
    ],
    "articleLinks": [
      {
        "slug": "calendar-notifications-missing-silent-or-duplicated",
        "label": "Diagnose notification delivery separately"
      },
      {
        "slug": "drag-an-event-to-move-it",
        "label": "Verify the saved event after a move"
      },
      {
        "slug": "what-an-all-day-event-really-means",
        "label": "Check date-based event behavior"
      }
    ],
    "seeAlso": [
      "calendar-notifications-missing-silent-or-duplicated",
      "drag-an-event-to-move-it",
      "what-an-all-day-event-really-means"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here.",
    "galleryAfterContent": true
  },
  "ics-method-cancel-versus-delete-event": {
    "updated": "2026-10-23",
    "title": "ICS METHOD:CANCEL is not the same as deleting your calendar copy",
    "short": "Cancel a meeting or remove a copy",
    "description": "Understand iTIP cancellation identity, recurring-instance scope and organizer authority before treating a deleted calendar entry as a cancelled meeting.",
    "lede": "Removing a meeting from your own screen does not establish that the organizer cancelled it for everyone. In iCalendar scheduling, an organizer’s cancellation is a message about an identified event and a defined audience.",
    "sections": [
      {
        "heading": "Separate personal removal from organizer cancellation",
        "body": [
          "RFC 5546 section 3.2.5 describes METHOD:CANCEL as a cancellation notice sent by the organizer to affected attendees. Deleting a locally imported copy is a different operation. An attendee who no longer plans to attend should use the provider’s appropriate response or removal controls rather than impersonating the organizer.",
          "For an important cancellation, check the original organizer and the current event in the owning service. A missing row in one application may reflect hiding, removal or an outdated connection. It is not by itself evidence that the meeting no longer exists for its guests."
        ]
      },
      {
        "heading": "Keep the original identity and specify the scope",
        "body": [
          "The cancellation’s UID must match the original request. Under the RFC, cancelling the entire recurring series omits RECURRENCE-ID, while cancelling one instance includes its occurrence identity. That distinction is more precise than the event title or the date a recipient happens to read the email.",
          "Imagine a fictional weekly meeting whose original 16 November occurrence has moved to 17 November. An instance cancellation still identifies the original 16 November occurrence through RECURRENCE-ID. Do not substitute its new start just because that is the date currently displayed."
        ]
      },
      {
        "heading": "Inspect the fields without building an unauthorized message",
        "body": [
          "An iTIP cancellation uses METHOD:CANCEL at the calendar-object level and the corresponding event properties inside VEVENT. The RFC requires identity, organizer, timestamp and revision information; it also specifies incrementing SEQUENCE when an event is cancelled. STATUS:CANCELLED is used when the entire event is cancelled, but not merely when selected attendees are uninvited.",
          "These are diagnostic distinctions, not a complete message-generation recipe. A file containing the right field names does not prove authority. The RFC’s security discussion requires attention to sender authentication and unauthorized organizer changes. Use the supported organizer interface to send a real cancellation."
        ]
      },
      {
        "heading": "Verify the recipient result through the right route",
        "body": [
          "For a harmless agreed test, record one ordinary invitation and one recurring occurrence before cancelling through the organizing provider. Ask the intended test attendee to inspect that exact event. Keep delivery, acceptance of the update and the resulting calendar display as separate observations.",
          "Cloud Calendars sharing receipts, provider invitations and imported files are different mechanisms. This guide does not claim that a Cloud Calendars delete control sends every provider’s cancellation message. When the required organizer or occurrence controls are absent, use the owning provider and verify the remaining dates."
        ]
      }
    ],
    "comparison": {
      "heading": "Cancellation scope to identify before acting",
      "columns": [
        "Intended outcome",
        "Identity information",
        "Who should act"
      ],
      "rows": [
        {
          "cells": [
            "Remove my independent imported copy",
            "Destination record and calendar",
            "The person managing that copy"
          ]
        },
        {
          "cells": [
            "Cancel one recurring instance",
            "Original UID plus original occurrence RECURRENCE-ID",
            "Organizer through a supported interface"
          ]
        },
        {
          "cells": [
            "Cancel the entire series",
            "Original UID; no instance RECURRENCE-ID",
            "Organizer through a supported interface"
          ]
        },
        {
          "cells": [
            "Stop one person attending",
            "Affected attendee and provider workflow",
            "Organizer; this is not automatically whole-event cancellation"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Establish whether you are the organizer, attendee or owner of an independent copy.",
      "Name the exact occurrence or whole-series scope.",
      "Use the owning provider’s supported cancellation workflow.",
      "Verify the intended recipient and unaffected occurrences without deleting the original as a test."
    ],
    "faq": [
      {
        "q": "Does deleting my ICS import notify everyone?",
        "a": "An independent import is not an organizer cancellation channel. Use the original provider’s documented meeting controls for a real cancellation."
      },
      {
        "q": "Does a moved occurrence use its new start as RECURRENCE-ID?",
        "a": "No. The recurrence identifier refers to the original scheduled occurrence, even when its current start has changed."
      }
    ],
    "sourcesHeading": "Primary documentation used for this guide",
    "sources": [
      {
        "label": "RFC 5546 §3.2.5: CANCEL for VEVENT",
        "url": "https://www.rfc-editor.org/rfc/rfc5546.html#section-3.2.5"
      },
      {
        "label": "RFC 5546 §6: scheduling security considerations",
        "url": "https://www.rfc-editor.org/rfc/rfc5546.html#section-6"
      },
      {
        "label": "RFC 5545 §3.8.4.4: original occurrence identity",
        "url": "https://www.rfc-editor.org/rfc/rfc5545.html#section-3.8.4.4"
      }
    ],
    "articleLinks": [
      {
        "slug": "recurring-events-without-the-mess",
        "label": "Choose one occurrence or series scope"
      },
      {
        "slug": "keeping-track-of-who-replied",
        "label": "Keep attendance separate from sharing"
      },
      {
        "slug": "calendar-export-ics-pdf-and-backup",
        "label": "Identify an independent imported copy"
      }
    ],
    "seeAlso": [
      "recurring-events-without-the-mess",
      "keeping-track-of-who-replied",
      "calendar-export-ics-pdf-and-backup"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "icalendar-transp-class-busy-private": {
    "updated": "2026-10-23",
    "title": "ICS TRANSP versus CLASS: private and busy are different settings",
    "short": "Private does not mean free",
    "description": "Read ICS transparency separately from access classification. A PRIVATE entry may block availability; TRANSPARENT does not hide its details.",
    "lede": "A private appointment can still block your availability. A transparent event can still contain readable details. In iCalendar, TRANSP answers a busy-time question; CLASS records an access-classification intention. They are not interchangeable privacy switches.",
    "sections": [
      {
        "heading": "Use TRANSP to interpret busy-time searches",
        "body": [
          "RFC 5545 section 3.8.2.7 defines OPAQUE as consuming time for busy-time searches and TRANSPARENT as not consuming it. OPAQUE is the default when the property is omitted. This does not say that a transparent event is removed from an ordinary calendar view.",
          "An illustrative birthday label may be transparent while a one-hour appointment is opaque. Choose according to the intended availability, not the event’s color or whether its title sounds personal. An all-day DATE representation is another separate characteristic."
        ]
      },
      {
        "heading": "Treat CLASS as an intention, not encryption",
        "body": [
          "Section 3.8.1.3 defines PUBLIC, PRIVATE and CONFIDENTIAL classifications. It expressly says classification alone cannot enforce access in a receiving system. Authentication, authorization, roles and other security mechanisms also matter.",
          "The RFC’s default PUBLIC classification is not an instruction that uploads a local event to the public internet. Conversely, adding CLASS:PRIVATE to a plaintext file does not encrypt or erase the title, notes and location already contained in it. Review the real destination and access rules before distributing an export."
        ]
      },
      {
        "heading": "Compare the four combinations",
        "body": [
          "For a fictional 11:00–12:00 appointment, CLASS:PRIVATE with TRANSP:OPAQUE describes a private-classified event that consumes time in a busy search. CLASS:PRIVATE with TRANSP:TRANSPARENT expresses private classification without blocking that search.",
          "A PUBLIC/OPAQUE event can expose intended public information while occupying time; a PUBLIC/TRANSPARENT one can be informational. These are format-level meanings. They do not establish exactly what a named colleague can see in Google, Microsoft, iCloud or an exported file."
        ]
      },
      {
        "heading": "Check availability and the audience separately",
        "body": [
          "At the owning provider, inspect the event’s actual availability and its calendar/recipient access. Use a harmless sample if an authorized colleague needs to confirm the result. Ask two separate questions: does this time appear occupied, and which details are visible?",
          "This article does not claim Cloud Calendars offers raw CLASS or TRANSP editing or overrides provider permissions. Use the provider’s supported privacy and availability controls where necessary. Changing a busy-time flag is not an appropriate repair for unintended disclosure."
        ]
      }
    ],
    "comparison": {
      "heading": "Illustrative combinations in an exchanged VEVENT",
      "columns": [
        "CLASS and TRANSP",
        "Busy-time meaning",
        "Privacy limitation"
      ],
      "rows": [
        {
          "cells": [
            "PRIVATE + OPAQUE",
            "Consumes time",
            "Classification alone does not enforce access"
          ]
        },
        {
          "cells": [
            "PRIVATE + TRANSPARENT",
            "Does not consume time",
            "Not hidden or encrypted merely by these values"
          ]
        },
        {
          "cells": [
            "PUBLIC + OPAQUE",
            "Consumes time",
            "Actual distribution depends on the system"
          ]
        },
        {
          "cells": [
            "PUBLIC + TRANSPARENT",
            "Does not consume time",
            "Informational does not mean restricted"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Read TRANSP separately from CLASS.",
      "Check the owning provider’s availability setting.",
      "Review real calendar access and the export audience.",
      "Verify occupied time and visible details as separate outcomes."
    ],
    "faq": [
      {
        "q": "Does TRANSPARENT hide the event?",
        "a": "It makes the event transparent to busy-time searches. It is not a general instruction to conceal its details."
      },
      {
        "q": "Is CLASS:PRIVATE safe to email publicly?",
        "a": "No. Classification is not encryption or an enforceable access rule for every receiver. Inspect the actual file contents and intended audience."
      }
    ],
    "sourcesHeading": "Primary specification checked for this guide",
    "sources": [
      {
        "label": "RFC 5545 §3.8.2.7: time transparency and default OPAQUE",
        "url": "https://www.rfc-editor.org/rfc/rfc5545.html#section-3.8.2.7"
      },
      {
        "label": "RFC 5545 §3.8.1.3: classification and enforcement limits",
        "url": "https://www.rfc-editor.org/rfc/rfc5545.html#section-3.8.1.3"
      }
    ],
    "articleLinks": [
      {
        "slug": "who-can-see-what-in-google-calendar",
        "label": "Check actual provider permissions"
      },
      {
        "slug": "what-an-all-day-event-really-means",
        "label": "Separate all-day dates from availability"
      },
      {
        "slug": "calendar-export-ics-pdf-and-backup",
        "label": "Review exported information before sharing"
      }
    ],
    "seeAlso": [
      "who-can-see-what-in-google-calendar",
      "what-an-all-day-event-really-means",
      "calendar-export-ics-pdf-and-backup"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here.",
    "galleryAfterContent": true
  },
  "icalendar-uid-sequence-event-updates": {
    "updated": "2026-10-23",
    "title": "ICS UID and SEQUENCE: why a changed title is still the same meeting",
    "short": "Match an ICS event update",
    "description": "Use UID, SEQUENCE and recurrence identity to investigate an ICS update. Distinguish a revision from a new event or a repeated file import.",
    "lede": "A meeting renamed from “Planning” to “Launch planning” can remain the same event. Its title is not the interchange identifier. When an update creates a second entry, compare the event identity and delivery route before deleting either copy.",
    "sections": [
      {
        "heading": "Start with UID, not the title",
        "body": [
          "RFC 5545 section 3.8.4.7 defines UID as a persistent, globally unique identifier. Calendar systems use it to correlate scheduling requests with later replies, modifications and cancellation requests. Two different meetings may share a title, while one meeting may change its title and time.",
          "A UID that resembles an email address is still an identifier; it does not by itself establish the organizer’s email address or grant permission. Preserve the complete value while investigating a harmless sample. Do not replace it with a newly generated value merely because a meeting was edited."
        ]
      },
      {
        "heading": "Read the revision number in context",
        "body": [
          "SEQUENCE describes the component’s revision sequence. Section 3.8.7.4 says it begins at zero and the organizer’s calendar system increments it for significant revisions. It is not an attendance count, a timestamp or an instruction requesting an RSVP.",
          "Imagine a fictional event with UID:planning-demo@example.invalid. The original is SEQUENCE:0 at 10:00Z. A revised invitation has the same UID, SEQUENCE:1 and a new 11:00Z start. That is an illustrative revision relationship. It is not a promise that every file-import command recognizes or replaces the first entry."
        ]
      },
      {
        "heading": "Distinguish delivery from identity",
        "body": [
          "An account connection or scheduling message and a user importing a downloaded file are different paths. Google explicitly says imported events do not stay in sync between accounts. A matching UID does not turn a one-time import into a live subscription or guarantee how every application resolves repeated imports.",
          "For a duplicate report, record whether the second entry arrived through an invitation email, an account sync, a subscription or another import. Compare both owning calendars as well as UID and the revision information you can inspect. Similar text on two calendars is not enough to prove the records are the same."
        ]
      },
      {
        "heading": "Handle recurring events and suspicious updates carefully",
        "body": [
          "A recurring series uses UID for the set, with RECURRENCE-ID identifying a particular instance. Comparing only the UID can mistake a legitimate exception for a duplicate. The occurrence identifier refers to the original scheduled start, even when that occurrence has been moved.",
          "This diagnostic guide does not claim Cloud Calendars exposes raw UID or SEQUENCE fields. Use the original provider or an authorized support export if needed. Do not accept a calendar file as an authorized update solely because its text contains a familiar UID: sender identity and scheduling authorization also matter."
        ]
      }
    ],
    "comparison": {
      "heading": "Illustrative identity comparison",
      "columns": [
        "Observation",
        "Likely interpretation to investigate",
        "Next check"
      ],
      "rows": [
        {
          "cells": [
            "Same title, different UID",
            "Separate identities, possibly a copy",
            "Owning calendars and creation route"
          ]
        },
        {
          "cells": [
            "Same UID, higher SEQUENCE",
            "A later revision may be involved",
            "Organizer and supported update route"
          ]
        },
        {
          "cells": [
            "Same UID, different RECURRENCE-ID",
            "Different instances in one series",
            "Original occurrence dates"
          ]
        },
        {
          "cells": [
            "Same file imported twice",
            "Repeated snapshot operation",
            "Destination import behavior; not live sync"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Keep both records while identifying their owning calendars.",
      "Compare UID rather than relying on titles alone.",
      "For a recurring series, include RECURRENCE-ID in the comparison.",
      "Check revision and delivery route with the organizer or provider before removing a copy."
    ],
    "faq": [
      {
        "q": "Does a higher SEQUENCE request an RSVP?",
        "a": "No. The RFC distinguishes revision numbering from the RSVP parameter on an attendee."
      },
      {
        "q": "Will importing another file with the same UID always replace the old event?",
        "a": "No universal import behavior is promised. A scheduling identity does not make a snapshot import an updating connection."
      }
    ],
    "sourcesHeading": "Primary documentation used for this guide",
    "sources": [
      {
        "label": "RFC 5545 §3.8.4.7: persistent UID",
        "url": "https://www.rfc-editor.org/rfc/rfc5545.html#section-3.8.4.7"
      },
      {
        "label": "RFC 5545 §3.8.7.4: revision SEQUENCE",
        "url": "https://www.rfc-editor.org/rfc/rfc5545.html#section-3.8.7.4"
      },
      {
        "label": "Google: importing is not continuing synchronization",
        "url": "https://support.google.com/calendar/answer/37118?hl=en"
      },
      {
        "label": "RFC 5545 §3.8.4.4: original recurrence-instance identity",
        "url": "https://www.rfc-editor.org/rfc/rfc5545.html#section-3.8.4.4"
      }
    ],
    "articleLinks": [
      {
        "slug": "when-two-calendars-disagree",
        "label": "Compare the owning records"
      },
      {
        "slug": "what-calendar-sync-actually-does",
        "label": "Identify the update route"
      },
      {
        "slug": "recurring-events-without-the-mess",
        "label": "Check the intended occurrence scope"
      }
    ],
    "seeAlso": [
      "when-two-calendars-disagree",
      "what-calendar-sync-actually-does",
      "recurring-events-without-the-mess"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "pitman-2-2-3-shift-schedule-calendar-setup": {
    "updated": "2026-10-23",
    "title": "Pitman 2-2-3 shift calendar: verify the 14-day pattern",
    "short": "Pitman 2-2-3 shift calendar",
    "description": "Build and audit a Pitman 14-day roster with two biweekly patterns, a dated example and checks for night-shift end dates.",
    "lede": "A Pitman roster is not a single weekly pattern. Start with an approved 14-day roster, identify the two alternating weeks, and check the next cycle before relying on a repeating calendar. The example below uses fixed day shifts; it does not prescribe an employer’s roster.",
    "sections": [
      {
        "heading": "Start with a real cycle, not its nickname",
        "body": [
          "Nantucket’s police working-hours FAQ describes four teams following two shifts, two rest days, three shifts, then two rest days, two shifts and three rest days. Other employers can use different anchors or day/night rotations. Copy your actual first work date and handover times before entering anything.",
          "For a cycle starting Monday 2 November 2026, the first week has shifts on Monday, Tuesday, Friday, Saturday and Sunday. The second has Wednesday and Thursday. These are three work blocks of two, three and two starts, separated by rest blocks."
        ]
      },
      {
        "heading": "Model the repeating starts",
        "body": [
          "An iCalendar model can use two weekly rules with INTERVAL=2 and an explicit WKST=MO. The first starts 2 November and uses BYDAY=MO,TU,FR,SA,SU; the second starts 11 November and uses BYDAY=WE,TH. These are rule fragments, not a complete import file.",
          "The calendar’s visual Sunday/Monday preference does not by itself establish the WKST value of an exported rule. If your editor offers the needed custom repeat controls, preview the resulting dates. If it does not, use individually checked dates or a roster tool rather than assume a hidden control exists. Google documents a 730-occurrence limit per repeating event."
        ]
      },
      {
        "heading": "Audit before extending or sharing",
        "body": [
          "With illustrative 07:00–19:00 shifts, seven starts give 84 planned hours per 14 days. Confirm the same seven start positions in the following cycle. For 19:00–07:00 nights, put the end on the following date; an off start-date does not mean the whole calendar date is free.",
          "Use a separate, clearly named work calendar when your provider supports one. Keep employer changes and one-off cover visible rather than silently altering the base cycle. This is a planning example, not a payroll or rest entitlement calculation."
        ]
      }
    ],
    "comparison": {
      "heading": "Worked example to check against your calendar",
      "columns": [
        "Week",
        "Start dates in November 2026",
        "Planned hours at 12 per shift"
      ],
      "rows": [
        {
          "cells": [
            "1",
            "2, 3, 6, 7, 8",
            "60"
          ]
        },
        {
          "cells": [
            "2",
            "11, 12",
            "24"
          ]
        },
        {
          "cells": [
            "Next cycle begins",
            "16",
            "84 across each complete two-week cycle"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Confirm the cycle anchor and whether days and nights rotate.",
      "Enter a bounded trial covering two complete cycles.",
      "Compare every generated start and next-day night endpoint with the roster.",
      "Only extend or share once exceptions and dates match."
    ],
    "faq": [
      {
        "q": "Does changing the calendar grid to Monday fix the recurrence?",
        "a": "Not necessarily. Visual layout and recurrence week grouping are different settings; verify the generated dates."
      },
      {
        "q": "Can a single every-three-days rule replace this pattern?",
        "a": "No. The gaps between work blocks vary; a fixed three-day interval generates different starts."
      }
    ],
    "sourcesHeading": "Sources and verification",
    "sources": [
      {
        "label": "Nantucket Police: working-hours FAQ",
        "url": "https://www.nantucket-ma.gov/m/faq?cat=154"
      },
      {
        "label": "RFC 5545: recurrence rules and week start",
        "url": "https://www.rfc-editor.org/rfc/rfc5545.html#section-3.3.10"
      },
      {
        "label": "Google Calendar: create a recurring event",
        "url": "https://support.google.com/calendar/answer/37115?hl=en"
      }
    ],
    "articleLinks": [
      {
        "slug": "shift-work-calendar-iphone-rotating-schedules",
        "label": "Shift Work Calendar on iPhone: Rotating Schedules and Family Sharing"
      },
      {
        "slug": "recurring-events-without-the-mess",
        "label": "Recurring Events Without the Mess"
      },
      {
        "slug": "a-week-view-that-fits-a-week",
        "label": "A Week View That Fits a Week"
      }
    ],
    "seeAlso": [
      "shift-work-calendar-iphone-rotating-schedules",
      "recurring-events-without-the-mess",
      "a-week-view-that-fits-a-week"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "rrule-count-until-excluded-occurrences": {
    "updated": "2026-10-23",
    "title": "RRULE COUNT or UNTIL: end a recurring schedule without an extra session",
    "short": "COUNT, UNTIL and skipped dates",
    "description": "Calculate a recurring ICS schedule with COUNT, inclusive UNTIL and EXDATE. See why skipping a date does not add a replacement session.",
    "lede": "“Four generated Mondays” and “four sessions after a skipped holiday” are different schedules. COUNT bounds the recurrence rule; an exclusion can still remove one of those occurrences. Work out the final dates before changing a course or rota.",
    "sections": [
      {
        "heading": "Choose the boundary that matches the real agreement",
        "body": [
          "RFC 5545 section 3.3.10 defines COUNT as an occurrence limit and UNTIL as an inclusive date or date-time boundary. DTSTART counts as the first occurrence. COUNT and UNTIL must not both appear in the same recurrence rule.",
          "For a fictional weekly course starting at 09:00 UTC on Monday 2 November 2026, RRULE:FREQ=WEEKLY;COUNT=4 generates 2, 9, 16 and 23 November. COUNT=4 does not mean four additional weeks after the first lesson."
        ]
      },
      {
        "heading": "Calculate an inclusive UNTIL",
        "body": [
          "With DTSTART:20261102T090000Z, the alternative rule RRULE:FREQ=WEEKLY;UNTIL=20261123T090000Z includes the occurrence at the boundary, so the same four Mondays result. An UNTIL one second before that final start would exclude 23 November. The end of a meeting’s duration does not determine whether its start is generated by the rule.",
          "Match the required value type and time basis. A DATE start uses a DATE boundary; a UTC or time-zone-referenced DATE-TIME start requires a UTC UNTIL under the RFC. This page uses UTC to keep the arithmetic explicit. It does not claim every calendar editor lets users type raw rule strings."
        ]
      },
      {
        "heading": "Apply exclusions after generating the dates",
        "body": [
          "Now add EXDATE:20261109T090000Z to the COUNT=4 example. The final visible starts are 2, 16 and 23 November: three sessions. Section 3.8.5.1 says exclusion dates take precedence over the rule’s included starts. The rule does not automatically grow a fifth generated Monday to compensate.",
          "If the actual agreement requires four attended dates while skipping 9 November, choose a schedule whose final set is 2, 16, 23 and 30 November. For this simple weekly example, COUNT=5 plus that exclusion produces those dates. A provider may expose a different supported control or representation; inspect the final dates rather than assuming a label means attended sessions."
        ]
      },
      {
        "heading": "Verify the tail as well as the first week",
        "body": [
          "Write down the first occurrence, the skipped date, the intended last occurrence and the following week. Check each after a supported edit in the owning provider. A correct next appointment does not prove the series ends correctly.",
          "Cloud Calendars can display a schedule, but this technical example does not promise raw RRULE or EXDATE editing in its interface. For a change the app does not expose, use the provider’s documented recurrence controls. Preserve existing exceptions before making a series-wide change."
        ]
      }
    ],
    "comparison": {
      "heading": "Worked weekly course starting 2 November 2026 at 09:00Z",
      "columns": [
        "Rule and exception",
        "Final November starts",
        "Number of sessions"
      ],
      "rows": [
        {
          "cells": [
            "COUNT=4, no exception",
            "2, 9, 16, 23",
            "4"
          ]
        },
        {
          "cells": [
            "UNTIL=20261123T090000Z",
            "2, 9, 16, 23",
            "4"
          ]
        },
        {
          "cells": [
            "COUNT=4; EXDATE for 9 November",
            "2, 16, 23",
            "3"
          ]
        },
        {
          "cells": [
            "COUNT=5; EXDATE for 9 November",
            "2, 16, 23, 30",
            "4"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Decide whether the agreement limits generated occurrences or a final date.",
      "Count DTSTART as the first occurrence.",
      "Apply exclusions and count the remaining dates.",
      "Inspect the last intended occurrence and following week using the owning provider."
    ],
    "faq": [
      {
        "q": "Can I use COUNT and UNTIL together?",
        "a": "Not in the same RRULE under RFC 5545. Choose a valid rule and verify the actual generated set."
      },
      {
        "q": "Does a skipped holiday automatically add another session?",
        "a": "No. An EXDATE removes an included occurrence; it does not automatically extend a COUNT-limited rule."
      }
    ],
    "sourcesHeading": "Primary documentation used for this guide",
    "sources": [
      {
        "label": "RFC 5545 §3.3.10: COUNT and inclusive UNTIL",
        "url": "https://www.rfc-editor.org/rfc/rfc5545.html#section-3.3.10"
      },
      {
        "label": "RFC 5545 §3.8.5.1: exclusion precedence",
        "url": "https://www.rfc-editor.org/rfc/rfc5545.html#section-3.8.5.1"
      }
    ],
    "articleLinks": [
      {
        "slug": "recurring-events-without-the-mess",
        "label": "Check safe recurrence editing scope"
      },
      {
        "slug": "shift-work-calendar-iphone-rotating-schedules",
        "label": "Distinguish recurring patterns from a rota"
      },
      {
        "slug": "when-two-calendars-disagree",
        "label": "Compare the saved source schedule"
      }
    ],
    "seeAlso": [
      "recurring-events-without-the-mess",
      "shift-work-calendar-iphone-rotating-schedules",
      "when-two-calendars-disagree"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "ics-all-day-dtend-exclusive-end-date": {
    "updated": "2026-10-23",
    "title": "Why an ICS all-day event ends one date after its last visible day",
    "short": "ICS all-day end dates",
    "description": "Read an all-day ICS date range correctly: DTEND is exclusive. Check one-day and multiday examples before changing an imported event.",
    "lede": "An all-day ICS event ending at 20261105 can correctly describe a trip whose last day is 4 November. The ending date is a boundary, not necessarily a day to display. This guide explains how to inspect that boundary without moving the real trip.",
    "sections": [
      {
        "heading": "Use calendar dates, not midnight timestamps",
        "body": [
          "RFC 5545 section 3.6.1 defines DTSTART as included and DTEND as excluded for a VEVENT. When the start uses the DATE value type, an explicit end must also use DATE. A record beginning DTSTART;VALUE=DATE:20261102 and ending DTEND;VALUE=DATE:20261105 covers 2, 3 and 4 November. It stops before 5 November begins.",
          "A value such as DTSTART:20261102T000000Z describes a timed instant in UTC. It is not interchangeable with DTSTART;VALUE=DATE:20261102. Converting one representation into the other can introduce a time-zone question that the original date-only label did not have."
        ]
      },
      {
        "heading": "Work through the boundary before editing",
        "body": [
          "Imagine a fictional three-day exhibition from Monday 2 November through Wednesday 4 November 2026. Write those three included dates first. The corresponding excluded end boundary is Thursday 5 November. A file showing that later boundary is therefore consistent with the brief, not proof of an extra day.",
          "For a one-day entry on 2 November, an explicit DATE end is 3 November. The RFC also defines a one-day duration when a DATE start has neither DTEND nor DURATION. Do not add a second visible date merely because the end property is absent."
        ]
      },
      {
        "heading": "Compare the export with the displayed result",
        "body": [
          "Keep the original file and compare the first and final included dates in a separate disposable destination calendar where the provider supports imports. Check the next date too. The expected result for the exhibition is a label on 2–4 November and no label on 5 November.",
          "If a destination actually displays the extra date, record its name, import route and the exact DATE fields. Do not subtract one day from every export as a general repair. An incorrect start, a timed representation or an importing application’s interpretation can require a different fix."
        ]
      },
      {
        "heading": "Keep format semantics separate from Cloud Calendars controls",
        "body": [
          "This page explains the iCalendar interchange format. It does not provide a raw ICS editor in Cloud Calendars or claim identical import behavior across providers. Use the owning service’s supported import and editing tools, then inspect the resulting dates in the calendar view.",
          "The existing all-day planning guide covers the app’s date selection, availability and widget eligibility. This technical check answers the narrower question of what a DATE-valued DTEND in an exchanged file means. A displayed date range and a free/busy decision remain separate checks."
        ]
      }
    ],
    "comparison": {
      "heading": "Illustrative DATE boundaries",
      "columns": [
        "Intended visible dates",
        "DTSTART value",
        "Exclusive DTEND value"
      ],
      "rows": [
        {
          "cells": [
            "2 November only",
            "20261102",
            "20261103"
          ]
        },
        {
          "cells": [
            "2–4 November",
            "20261102",
            "20261105"
          ]
        },
        {
          "cells": [
            "30 November–2 December",
            "20261130",
            "20261203"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "List the intended included dates.",
      "Confirm that the fields use VALUE=DATE rather than timed values.",
      "Treat DTEND as the first excluded date.",
      "Compare the displayed start, final included day and following day without deleting the original."
    ],
    "faq": [
      {
        "q": "Should I remove a day from the ICS end date?",
        "a": "Not just because the raw date looks later. An exclusive boundary is correct when the destination displays the intended included dates."
      },
      {
        "q": "Is an all-day entry the same as a midnight appointment?",
        "a": "No. A DATE value and a DATE-TIME value have different meanings. Retain the representation that matches the actual commitment."
      }
    ],
    "sourcesHeading": "Primary documentation used for this guide",
    "sources": [
      {
        "label": "RFC 5545 §3.6.1: VEVENT inclusive start and non-inclusive end",
        "url": "https://www.rfc-editor.org/rfc/rfc5545.html#section-3.6.1"
      }
    ],
    "articleLinks": [
      {
        "slug": "what-an-all-day-event-really-means",
        "label": "Check all-day dates and availability"
      },
      {
        "slug": "calendar-export-ics-pdf-and-backup",
        "label": "Choose the right export or import route"
      },
      {
        "slug": "time-zones-and-the-flight-you-booked",
        "label": "Separate event time zones from display zones"
      }
    ],
    "seeAlso": [
      "what-an-all-day-event-really-means",
      "calendar-export-ics-pdf-and-backup",
      "time-zones-and-the-flight-you-booked"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  },
  "google-calendar-add-ons-conferencing-permissions": {
    "updated": "2026-10-23",
    "title": "Google Calendar add-ons: install the intended integration and check its meeting account",
    "short": "Google Calendar add-ons",
    "description": "Install an approved Google Calendar add-on, select its conferencing provider for a sample event and verify the intended integration account.",
    "lede": "Installing an add-on and creating a usable meeting are separate checkpoints. First establish whether the Google account may install the integration; then select the intended conferencing provider in the event and verify which service account is signing in. A Marketplace installation alone does not confirm the meeting’s joining details.",
    "sections": [
      {
        "heading": "Write the integration brief",
        "body": [
          "For a fictional project group, list the meeting service required, the calendar that owns the event and the person allowed to approve the integration. If a workplace controls installation, ask for its approved route rather than using a personal calendar to bypass the restriction.",
          "Google points to Workspace Marketplace for Calendar add-ons and says missing installation options can require administrator help. Keep the integration’s purpose distinct from account-wide calendar sharing. An app being available in a marketplace is not this article’s security endorsement."
        ]
      },
      {
        "heading": "Install and choose the conferencing route",
        "body": [
          "Google’s computer instructions open Get add-ons from Calendar settings or its side panel. After the approved installation, the event’s conferencing dropdown can select the add-on instead of Google Meet, followed by the provider’s account sign-in steps.",
          "Check the account shown by that provider before continuing. The Google calendar owner and conferencing-service identity can be different decisions. For a sample event, record both explicitly instead of assuming the most recently signed-in personal account is the intended host."
        ]
      },
      {
        "heading": "Verify a harmless sample meeting",
        "body": [
          "Create a clearly labelled test appointment with no private agenda and only cooperative participants where needed. Inspect the saved date, owning calendar and generated joining information. Ask the intended participant to check the correct link using their own account and normal access conditions.",
          "If the integration fails, record which stage failed: installation, sign-in, event conference creation or participant access. Google directs add-on problems to its developer through Marketplace. A missing join result is not by itself a reason to reconnect every calendar account."
        ]
      },
      {
        "heading": "Uninstall deliberately and review dependent meetings",
        "body": [
          "Google documents uninstalling through Marketplace and notes that some managed installations require an administrator. Before removal, list which future meetings depend on the integration and agree how those meetings should be maintained.",
          "Do not assume uninstalling rewrites existing invitations, cancels a provider subscription or erases earlier content. Review those questions in the relevant service. Cloud Calendars’ own Google Meet and Teams options are separate from installing a Google Marketplace add-on in the web calendar."
        ]
      }
    ],
    "comparison": {
      "heading": "A fictional integration check record",
      "columns": [
        "Checkpoint",
        "Identity or result to record",
        "Owner of the next action"
      ],
      "rows": [
        {
          "cells": [
            "Installation",
            "Approved add-on and Google account",
            "User or administrator"
          ]
        },
        {
          "cells": [
            "Conference creation",
            "Intended provider host account",
            "Organizer/integration provider"
          ]
        },
        {
          "cells": [
            "Guest joining",
            "Saved link and permitted participant route",
            "Organizer and cooperative recipient"
          ]
        }
      ]
    },
    "claims": {},
    "practical": [
      "Confirm the required provider and approved installation route.",
      "Install the intended add-on in the correct Google account.",
      "Select it in a disposable event and inspect the provider identity.",
      "Record the failing stage or planned removal before changing broader access."
    ],
    "faq": [
      {
        "q": "Why can’t I install or remove the add-on?",
        "a": "Google says work or school administrators can control these actions. Use the organization’s approved route."
      },
      {
        "q": "Does installation prove participants can join?",
        "a": "No. Verify the saved meeting details and the intended recipient’s access separately."
      }
    ],
    "sourcesHeading": "Official Google documentation checked",
    "sources": [
      {
        "label": "Google Calendar Help: Find and install Calendar add-ons",
        "url": "https://support.google.com/calendar/answer/9117864?hl=en"
      }
    ],
    "articleLinks": [
      {
        "slug": "meeting-links-that-make-themselves",
        "label": "Check generated meeting links separately"
      },
      {
        "slug": "disconnect-calendar-integration-without-losing-track",
        "label": "Plan integration removal and retained records"
      },
      {
        "slug": "what-guests-can-do-to-your-event",
        "label": "Keep guest rights distinct from integration access"
      }
    ],
    "seeAlso": [
      "meeting-links-that-make-themselves",
      "disconnect-calendar-integration-without-losing-track",
      "what-guests-can-do-to-your-event"
    ],
    "galleryKinds": [
      "week-left",
      "week-right"
    ],
    "galleryAfterContent": true,
    "galleryCaption": "Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here."
  }
};
