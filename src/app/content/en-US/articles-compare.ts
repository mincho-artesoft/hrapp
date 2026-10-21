import { LocalisedArticle } from '../types';

/** Developer-authored plan and workflow guides; publisher sources are not independent runtime tests. */
export const COMPARE_EN_US: Readonly<Record<string, LocalisedArticle>> = {
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
    "updated": "2026-10-21",
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
      }
    ],
    "seeAlso": [
      "what-you-get-without-paying-anything",
      "free-google-sync-without-adverts",
      "what-fantastical-costs-and-what-this-does"
    ]
  }
};
