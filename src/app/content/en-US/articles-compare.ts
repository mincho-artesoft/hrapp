import { LocalisedArticle } from '../types';

/** Developer-authored plan and workflow guides; publisher sources are not independent runtime tests. */
export const COMPARE_EN_US: Readonly<Record<string, LocalisedArticle>> = {
  "onecal-alternative-iphone-calendar-view-or-sync": {
  "updated": "2026-10-23",
  "title": "Cloud Calendars or OneCal? Choose a combined view or calendar sync",
  "short": "Cloud Calendars and OneCal by workflow",
  "description": "Compare OneCal and Cloud Calendars by views, copied events, mobile controls and plans.",
  "lede": "Choose by the result you need: reviewing several schedules together, editing an original event or copying busy time into another account. Cloud Calendars provides iPhone and iPad planning views; OneCal documents a unified view and separate Calendar Sync rules. This comparison is published by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "Two products that show Google, iCloud and Outlook calendars necessarily keep availability, event edits and copies in sync in the same way.",
  "sections": [
    {
      "heading": "Choose between an overview and a change in another account",
      "body": [
        "If your aim is to see a personal appointment beside a work meeting, you need a combined view. If your work calendar must also contain a busy block for the personal appointment, you need a defined source-to-destination workflow. The first result does not establish the second.",
        "Cloud Calendars brings selected calendars into an iPhone and iPad planning view. OneCal documents a Unified Calendar View separately from Calendar Sync; its publisher says you can use that view without configuring sync rules. Decide which outcome matters before connecting accounts or comparing subscription names."
      ]
    },
    {
      "heading": "Understand what a copied event can change",
      "body": [
        "OneCal’s Calendar Sync documentation describes one-way and multi-way rules that create clone events. Its separate coverage guide says edits to a clone are not propagated back to the original. Identify the original and its owning calendar before treating a copied appointment as the place to reschedule a meeting.",
        "Cloud Calendars provider connections can also create mirrored calendars in the iOS store. A combined display does not prove that records were merged or that an edit reached the provider. For a calendar you own and may edit, check a disposable event without guests at the provider as well as in the app."
      ]
    },
    {
      "heading": "Check the controls on the device you will actually use",
      "body": [
        "OneCal’s current mobile guide describes creating and editing calendar events, recurrence choices, RSVP and joining meetings. It separately says that creating, editing, pausing or deleting Calendar Sync configurations happens in the web app; mobile shows those configurations. Booking-link setup is also described as a web task.",
        "Cloud Calendars is an iPhone and iPad app with day, week, month, year and list views. Try the needed edit in your installed view, read any recurrence choice and confirm the saved event. Do not assume another product’s mobile menu, booking workflow or automation controls exist in it."
      ]
    },
    {
      "heading": "Verify coverage instead of assuming unlimited history",
      "body": [
        "OneCal’s current coverage guide lists a future sync window of up to a year for Google and iCloud and up to three months for Outlook. It also distinguishes future recurring series from standalone historical events. These are publisher-documented limits, not a test of your particular account or a claim about every feature in its calendar view.",
        "Cloud Calendars also needs a check of the account route, selected calendars and relevant dates. If old meetings are essential, compare an identified event in the provider and the app. A calendar app is not automatically a complete backup or a guarantee that every past record has been retrieved."
      ]
    },
    {
      "heading": "Compare plan requirements and the billing route",
      "body": [
        "Cloud Calendars includes Google Calendar sync in Base; Advanced removes ads and Premium adds Microsoft Calendar and Teams support. Verify account permissions separately from the plan. Check the current local price and billing period before purchase rather than using a fixed international price comparison.",
        "OneCal’s web plan guide describes per-member plans and a fourteen-day trial, including clone removal when the trial expires. Its mobile billing guide describes store-managed purchases and constraints on adding team members. Check which features need an ongoing plan and where the purchase is managed; a free download alone does not answer those questions."
      ]
    },
    {
      "heading": "Test your actual planning workflow before switching",
      "body": [
        "If weather, widgets or a Live Activity are important, include them in the trial on the device you use. Cloud Calendars offers those planning surfaces, with weather limited to available dates and the selected place. The OneCal pages reviewed here do not establish feature parity for those surfaces; check its current product rather than inferring absence from a guide.",
        "Keep the original apps and connection details until you have checked the required outcome. Record whether you verified visibility, original-event editing, copied busy time or a reminder; they are different results. Before disconnecting a service, review what happens to existing copies and avoid experimenting on a live invitation or a real customer meeting."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Write down whether you need a combined view or events copied into another account.",
    "Identify originals, copies and the account that owns each important event.",
    "Check the required controls on your actual phone, tablet or web workflow.",
    "Compare one ordinary week and any historical dates you rely on.",
    "Check current plan requirements, local price and the purchase provider.",
    "Verify a disposable event and review copy-removal rules before switching."
  ],
  "faq": [
    {
      "q": "Is a combined calendar view the same as synchronising busy time?",
      "a": "No. A combined view lets you compare commitments. Creating an entry in another account requires a separate supported workflow; OneCal documents Calendar Sync rules separately from its Unified Calendar View."
    },
    {
      "q": "Can I change a OneCal clone to reschedule the original meeting?",
      "a": "Its coverage guide says clone edits are not propagated to the original. Identify the original event and follow its calendar’s editing and organiser permissions."
    },
    {
      "q": "Which app is cheaper for my setup?",
      "a": "That depends on the features, accounts, billing route and local price you need. Cloud Calendars includes Google sync in Base and Microsoft support in Premium. Review OneCal’s current plan and mobile billing terms for your intended workflow; this guide does not claim a universal price winner."
    }
  ],
  "sourcesHeading": "OneCal’s official workflow and plan documentation",
  "sources": [
    {
      "label": "OneCal: mobile features and web-only configuration tasks",
      "url": "https://docs.onecal.io/docs/mobile-apps"
    },
    {
      "label": "OneCal: Calendar Sync and source-to-target rules",
      "url": "https://docs.onecal.io/docs/calendar-sync/calendar-sync-intro"
    },
    {
      "label": "OneCal: sync windows and edits to clone events",
      "url": "https://docs.onecal.io/docs/calendar-sync/what-does-onecal-sync"
    },
    {
      "label": "OneCal: plans, trial and expiry behaviour",
      "url": "https://docs.onecal.io/docs/billing/plans-and-free-trial"
    },
    {
      "label": "OneCal: App Store and Google Play subscriptions",
      "url": "https://docs.onecal.io/docs/billing/mobile-subscriptions"
    }
  ],
  "seeAlso": [
    "what-calendar-sync-actually-does",
    "three-calendar-apps-is-two-too-many",
    "free-google-sync-without-adverts",
    "disconnect-calendar-integration-without-losing-track",
    "what-fantastical-costs-and-what-this-does"
  ],
  "comparison": {
    "heading": "Compare the workflow before the subscription",
    "columns": [
      "Question",
      "Cloud Calendars",
      "OneCal documentation"
    ],
    "rows": [
      {
        "cells": [
          "Where do I review my schedule?",
          "iPhone and iPad, with day, week, month, year and list views.",
          "Unified Calendar View is separate from configuring Calendar Sync."
        ]
      },
      {
        "cells": [
          "Do I need busy blocks copied between accounts?",
          "Do not infer that from the combined view; provider connections can mirror calendars locally.",
          "Calendar Sync creates clone events using one-way or multi-way rules."
        ]
      },
      {
        "cells": [
          "Where do I change sync rules?",
          "Use the controls documented for the app’s account connection.",
          "The reviewed mobile guide assigns sync-configuration changes to the web app."
        ]
      },
      {
        "cells": [
          "Which Cloud Calendars plan do I need?",
          "Base includes Google Calendar sync; Advanced removes ads; Premium adds Microsoft Calendar and Teams.",
          "Check the current OneCal plan and billing route for the required workflow."
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-left",
    "hook"
  ],
  "galleryCaption": "Cloud Calendars’ real calendar screens show the planning view. The comparison distinguishes that view from a service’s server-side clone rules.",
  "actionHeading": "Choose the outcome you want to verify",
  "actionText": "For an iPhone or iPad overview with weather and widgets, try Cloud Calendars with a harmless test event. If your requirement is copied busy time in another account, assess a service that explicitly documents that operation.",
  "articleLinks": [
    {
      "slug": "icloud-google-and-outlook-in-one-view",
      "label": "Set up a combined calendar view"
    },
    {
      "slug": "fantastical-readdle-calendar366-iphone-comparison",
      "label": "Compare other iPhone calendar options"
    },
    {
      "slug": "the-widget-that-shows-what-is-next",
      "label": "Choose your Home Screen display"
    }
  ]
},

  "free-google-sync-without-adverts": {
    "updated": "2026-10-21",
    "claims": {},
    "title": "Free Google Calendar sync on iPhone: what is included and where ads fit",
    "short": "Free Google sync and ads",
    "description": "Check what Cloud Calendars includes free, what Advanced removes and when Microsoft support needs Premium. Separate calendar access from subscription benefits.",
    "lede": "Cloud Calendars is developed by Arte Soft, which also publishes this guide. Google Calendar sync is included in the free Base plan. The free app can display advertising; Advanced removes it. A subscription and permission to edit someone else’s calendar are separate things.",
    "commonBelief": "A free calendar connection is only a trial, or buying an ad-free plan automatically grants more permission to shared calendars.",
    "sections": [
      {
        "heading": "Start with the connection you actually need",
        "body": [
          "Base includes Google Calendar sync, Google Meet support, calendar views, weather and Home Screen widgets. You still need to connect the intended Google account and select the calendars you want to see. A calendar shared read-only remains read-only regardless of the app plan.",
          "Local calendars can be used on the device without creating an app account. Connecting a provider and using sharing services may require sign-in. Do not confuse permission to read iPhone calendars with having connected every Google calendar you own."
        ]
      },
      {
        "heading": "What paying changes",
        "body": [
          "Advanced contains the Base features and removes ads. It is not an extra charge to unlock Google sharing permissions, priority weather updates or cross-account editing: those should not be advertised as separate Advanced benefits.",
          "Premium includes Advanced and adds Microsoft Calendar and Microsoft Teams support. If your organisation limits third-party connections, a purchase cannot override those rules. Verify the connection you need before relying on it for work."
        ]
      },
      {
        "heading": "Test one ordinary week before deciding",
        "body": [
          "Select a small set of real calendars, check that the correct events appear and create a disposable event in a writable calendar. Confirm its destination rather than assuming that seeing two accounts means their events have merged.",
          "Decide separately whether ads interrupt your use and whether Microsoft support is necessary. There is no need to buy a higher plan just because another user needs a different provider. Prices and billing periods are shown locally before purchase."
        ]
      },
      {
        "heading": "Manage the purchase through the right Apple Account",
        "body": [
          "For a subscription billed by Apple, use Settings, your name, then Subscriptions to inspect the plan and cancellation options. Check the Apple Account on the receipt if the purchase is missing. Signing into a calendar provider is not the same as signing into the Apple Account that owns the subscription.",
          "Removing the app is not the way to manage renewal. Before changing accounts or cleaning local data, make sure you know which calendars are local and which are stored with a provider."
        ]
      }
    ],
    "practical": [
      "Connect the intended Google account and check selected calendars.",
      "Confirm edit permission with one disposable event in the right destination.",
      "Use Base to assess the views, weather and widgets you need.",
      "Choose Advanced for ad removal; choose Premium when Microsoft Calendar or Teams support is required.",
      "Check local price, billing period and the Apple Account used for purchase."
    ],
    "faq": [
      {
        "q": "Do I need Advanced for Google Calendar sync?",
        "a": "No. Google Calendar sync is included in Base. Advanced removes ads; Premium adds Microsoft Calendar and Teams support."
      },
      {
        "q": "Will paying let me edit a calendar shared read-only?",
        "a": "No. Editing permission is controlled by the calendar owner and provider. An app subscription does not grant permission to someone else’s calendar."
      }
    ],
    "sourcesHeading": "Sources and purchase help",
    "sources": [
      {
        "label": "Apple: Cancel a subscription",
        "url": "https://support.apple.com/en-us/118428"
      }
    ],
    "seeAlso": [
      "what-you-get-without-paying-anything",
      "what-a-subscription-actually-buys",
      "what-calendar-sync-actually-does"
    ]
  },
  "what-fantastical-costs-and-what-this-does": {
    "updated": "2026-10-21",
    "claims": {},
    "title": "Cloud Calendars or Fantastical? Compare your calendar workflow on iPhone",
    "short": "Cloud Calendars and Fantastical",
    "description": "Compare accounts, devices, event entry, weather and subscriptions with practical checks. Choose by your workflow rather than an unsupported ranking.",
    "lede": "Cloud Calendars is developed by Arte Soft, which also publishes this guide. The useful comparison is whether each app can handle your accounts, devices and everyday changes. This is a developer-written selection guide, not an independent performance test or a claim that one app is best for everyone.",
    "commonBelief": "Two apps that display Google and iCloud calendars are interchangeable, so price alone should decide.",
    "sections": [
      {
        "heading": "Begin with your devices and providers",
        "body": [
          "Write down the devices where you actually create and change events, not just where you glance at them. Cloud Calendars is an iPhone and iPad app. Fantastical’s publisher lists mobile and desktop versions and support for multiple calendar providers. Confirm the specific platform and provider on its current product page rather than assuming all features are identical everywhere.",
          "For either app, check one account that matters to you and a shared calendar with the permission you need. A supported provider name does not guarantee that an employer will permit the connection."
        ]
      },
      {
        "heading": "Try event entry with the details you usually miss",
        "body": [
          "Fantastical advertises natural-language event creation. If that is important to you, try a sentence with a location, time and recurrence, then inspect the saved event. The meaningful result is the correct event, not how quickly a demo sentence appears.",
          "In Cloud Calendars, evaluate the available calendar views and event editing against your normal workflow. Use a disposable event and verify the destination calendar, duration and any time zone before inviting other people. This guide does not claim equivalent natural-language parsing or a measured speed advantage."
        ]
      },
      {
        "heading": "Compare weather at the time and place you need",
        "body": [
          "Cloud Calendars combines calendar views and weather. Check whether the forecast shown is for the relevant location and available date range. Decide whether you need an hourly view, a day summary or only a quick glance from a Home Screen widget.",
          "Do not choose on the claim that competing calendar apps have no weather features. Check the exact current plan and platform in each app. An icon beside a date is also not proof of a reliable forecast for every event location or every date in a month."
        ]
      },
      {
        "heading": "Keep visibility separate from sharing",
        "body": [
          "Seeing two calendars in one app does not share them with each other. Test whether you can see the intended calendars together while keeping work and personal destinations distinct. For a shared calendar, confirm who owns it and whether your access allows edits.",
          "Do not move a real meeting between providers simply to test an interface. Use a harmless test event and check both the source and destination. Invitations, organisers and recurring series can need separate handling."
        ]
      },
      {
        "heading": "Compare the total plan you would actually buy",
        "body": [
          "In Cloud Calendars, Base includes Google sync, views, weather and widgets; Advanced removes ads; Premium adds Microsoft Calendar and Teams support. Consult the current local prices and billing period in the app or App Store.",
          "Use Fantastical’s current pricing page for its own plan details. Compare the same billing period, number of users and required features. This guide does not publish a fixed price gap or assume that a promotional price will remain available."
        ]
      },
      {
        "heading": "Use a small decision record",
        "body": [
          "For each app, record account access, shared-calendar permission, supported devices, event-entry result, weather needs and total cost. Mark an item untested when you have not checked it. A missing requirement matters more than winning a long list of features you do not use.",
          "Keep the existing calendar arrangement until the replacement passes your actual tasks. Switching the viewer and migrating the underlying calendars are different projects; you may only need the first."
        ]
      }
    ],
    "practical": [
      "List required devices, provider accounts and shared-calendar permissions.",
      "Create one disposable event with the details you normally use.",
      "Check it from the provider or a second authorised device.",
      "Evaluate views, widget information and available weather for your schedule.",
      "Compare the current local plan that includes your required features.",
      "Choose from the recorded results, keeping untested requirements explicit."
    ],
    "faq": [
      {
        "q": "Is this an independent benchmark?",
        "a": "No. Arte Soft develops Cloud Calendars. This is a task-based guide with publisher documentation and proposed user checks, not measured accuracy, speed or reliability results."
      },
      {
        "q": "Does Cloud Calendars replace a desktop calendar app?",
        "a": "Cloud Calendars is built for iPhone and iPad. If desktop event editing is essential, include it as a separate requirement and verify the desktop client you plan to use."
      },
      {
        "q": "Should I move all my events when changing calendar apps?",
        "a": "Not necessarily. Displaying an existing provider calendar in another app is different from migrating its events. Verify account support before copying or moving data."
      }
    ],
    "sourcesHeading": "Publisher information to verify before choosing",
    "sources": [
      {
        "label": "Flexibits: Fantastical platforms, providers and event entry",
        "url": "https://flexibits.com/fantastical"
      },
      {
        "label": "Cloud Calendars on the App Store",
        "url": "https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319"
      }
    ],
    "seeAlso": [
    "fantastical-readdle-calendar366-iphone-comparison",
      "icloud-google-and-outlook-in-one-view",
      "what-calendar-sync-actually-does",
      "what-a-subscription-actually-buys"
    ]
  },
  "what-you-get-without-paying-anything": {
    "updated": "2026-10-21",
    "claims": {},
    "title": "What Cloud Calendars includes free on iPhone and iPad",
    "short": "What the free plan includes",
    "description": "Review the free Base features, optional ad removal and paid Microsoft support. Check account requirements and calendar permissions before choosing a plan.",
    "lede": "Cloud Calendars is developed by Arte Soft, which also publishes this guide. Base includes Google Calendar sync, calendar views, weather and Home Screen widgets. The app is free to download with advertising and optional subscriptions. Here is how to check whether Base covers your needs.",
    "commonBelief": "Every useful calendar action is behind a subscription, or free download means that every provider connection is free.",
    "sections": [
      {
        "heading": "Included in Base",
        "body": [
          "Use Day, Week, Month, Year and List views, Google Calendar sync, weather and Home Screen widgets. Google Meet support is also a Base feature. iCloud and local-calendar options are separate from a paid Microsoft connection.",
          "A feature being included does not remove operating-system permissions, provider sign-in, connection requirements or the owner’s sharing restrictions. Check those requirements with the calendars you use."
        ]
      },
      {
        "heading": "What the optional subscriptions add",
        "body": [
          "Advanced removes ads while retaining Base features. Premium adds Microsoft Calendar and Microsoft Teams support to the Advanced plan. Do not treat Google sharing, cross-calendar management or faster weather updates as separate Advanced-only features.",
          "Choose on the connection and experience you need. Check the actual local price and billing period before accepting a subscription; a price quoted for another storefront may differ."
        ]
      },
      {
        "heading": "Start locally or connect an account",
        "body": [
          "Local calendars let you start on the device without an app account. That does not mean every feature is anonymous or that every local event will appear on another device. Provider connections and sharing services may require sign-in.",
          "If the main goal is one view of work and personal commitments, connect the appropriate sources and select them. Confirm which calendar receives a new event. A combined display does not merge ownership or make read-only calendars editable."
        ]
      },
      {
        "heading": "Check useful tasks rather than only the feature list",
        "body": [
          "Try finding tomorrow’s events, changing a disposable appointment and locating the same appointment in its owning calendar. Inspect the Home Screen widget information you need and the available forecast for a real planning date.",
          "If one task fails, identify whether the cause is the plan, permission, selected calendar or provider connection. Buying a subscription is not a general repair for missing access."
        ]
      }
    ],
    "practical": [
      "Start with a local calendar or connect the provider you intend to use.",
      "Select a small set of calendars and inspect a test event’s destination.",
      "Try the views, weather and widget information you need.",
      "Use Advanced if you want ads removed.",
      "Check Premium if you need Microsoft Calendar or Teams support."
    ],
    "faq": [
      {
        "q": "Is Google Calendar sync included free?",
        "a": "Yes. It is a Base feature, together with calendar views, weather, widgets and Google Meet support."
      },
      {
        "q": "Does the free download include Microsoft Calendar support?",
        "a": "Microsoft Calendar and Microsoft Teams support are Premium features. Check connection requirements and current local pricing before subscribing."
      },
      {
        "q": "Can I use the app without an account?",
        "a": "You can start with local calendars on the device. Provider connections and sharing may require sign-in; those requirements are different from the app being free to download."
      }
    ],
    "sourcesHeading": "Current app and purchase information",
    "sources": [
      {
        "label": "Cloud Calendars on the App Store",
        "url": "https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319"
      }
    ],
    "seeAlso": [
      "free-google-sync-without-adverts",
      "what-a-subscription-actually-buys",
      "what-calendar-sync-actually-does"
    ]
  },
  "what-a-subscription-actually-buys": {
  "updated": "2026-10-22",
  "claims": {},
  "title": "Cloud Calendars subscriptions: Base, Advanced and Premium explained",
  "short": "Choose a Cloud Calendars plan",
  "description": "Base includes Google sync, views, weather and widgets. Advanced removes ads; Premium adds Microsoft and Teams. Check billing and access before buying.",
  "lede": "Cloud Calendars is developed by Arte Soft, which also publishes this guide. Choose Advanced for ad removal, or Premium for Microsoft Calendar and Teams support as well. Keep plan benefits separate from provider permission and from the Apple Account that pays for the subscription.",
  "commonBelief": "Advanced unlocks Google sharing or priority weather, and buying Premium bypasses restrictions on a work calendar.",
  "sections": [
    {
      "heading": "Base: the free starting point",
      "body": [
        "Base includes Google Calendar sync, Google Meet support, multiple calendar views, weather and Home Screen widgets. The free app can display ads. Local calendars provide a way to start on the device; provider connections and sharing have their own requirements.",
        "If your existing calendars already meet your needs in Base, the presence of a paid plan is not a reason by itself to change. Assess the actual calendar workflow before choosing."
      ]
    },
    {
      "heading": "Advanced: Base with ads removed",
      "body": [
        "Advanced includes the Base features and removes ads. It should not be presented as a paid unlock for cross-calendar management, Google sharing permissions, automatic Meet generation or priority weather refresh.",
        "Ad removal changes the app experience. It does not give your account edit access to someone else’s read-only calendar, and it does not solve an organisation’s connection policy."
      ]
    },
    {
      "heading": "Premium: Microsoft Calendar and Teams support",
      "body": [
        "Premium includes Advanced and adds Microsoft Calendar and Microsoft Teams support. A work or school organisation may restrict external apps, accounts or meeting creation. Confirm your intended connection and permissions instead of assuming every Exchange configuration is supported.",
        "Creating a meeting link also depends on the provider and event context. Do not interpret the feature as a guarantee that every event on every calendar receives a conference link automatically."
      ]
    },
    {
      "heading": "Read the local purchase screen",
      "body": [
        "Check the plan, local price, billing period and renewal terms before accepting. Compare a monthly option against the relevant yearly option rather than multiplying a promotional figure from another country. A current purchase screen is more useful than an evergreen article with a fixed currency amount.",
        "The Apple Account used for billing is separate from Google, Microsoft and any app-sharing identity. Keep the receipt and check which Apple Account owns the subscription if it is not listed where expected."
      ]
    },
    {
      "heading": "Cancel renewal without confusing it with data deletion",
      "body": [
        "Apple’s iPhone cancellation path is Settings, your name, Subscriptions, then the relevant subscription. Read the displayed status and expiry information. Deleting the app, deleting an event or disconnecting a provider is not a substitute for managing renewal.",
        "Before changing a plan or removing local data, check what you will still be able to access and which calendar owns important events. This guide does not promise that every connection or paid feature remains available after expiry. It also does not recommend deleting calendars to resolve billing questions."
      ]
    }
  ],
  "practical": [
    "Identify whether you need ad removal, Microsoft support, or neither.",
    "Verify calendar ownership and provider access separately from the plan.",
    "Read the current local purchase screen and billing period.",
    "Keep the Apple receipt and note the billing account.",
    "Manage renewal in Apple subscription settings; treat calendar-data changes as a separate action."
  ],
  "faq": [
    {
      "q": "What does Advanced add?",
      "a": "Advanced removes ads and includes the Base features. Google Calendar sync, views, weather, widgets and Google Meet support are already included in Base."
    },
    {
      "q": "What does Premium add?",
      "a": "Premium includes Advanced and adds Microsoft Calendar and Microsoft Teams support, subject to the provider account and organisation’s permissions."
    },
    {
      "q": "Does deleting Cloud Calendars cancel my subscription?",
      "a": "Manage an Apple-billed subscription through Apple’s subscription settings. Removing an app or disconnecting a calendar provider is a separate action."
    },
    {
      "q": "Does sharing a purchase with my family also share my calendars?",
      "a": "Check the purchase and calendar separately. Apple Family Sharing supports eligible purchases and subscriptions; check the specific product’s current eligibility rather than assuming every purchase qualifies. Calendar access still uses the relevant invitation, shared link or provider permission. For a Cloud Calendars shared calendar, have the recipient use the intended signed-in identity, accept the calendar and check their resulting access. A shared purchase does not confirm that a relative can read or edit your calendar."
    }
  ],
  "sourcesHeading": "Purchase and cancellation information",
  "sources": [
    {
      "label": "Apple: Cancel a subscription",
      "url": "https://support.apple.com/en-us/118428"
    },
    {
      "label": "Cloud Calendars on the App Store",
      "url": "https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319"
    },
    {
      "label": "Apple: content and purchase eligibility for Family Sharing",
      "url": "https://support.apple.com/en-ie/111114"
    }
  ],
  "seeAlso": [
    "what-you-get-without-paying-anything",
    "free-google-sync-without-adverts",
    "what-fantastical-costs-and-what-this-does",
    "a-calendar-that-is-yours-to-share"
  ]
}
};
