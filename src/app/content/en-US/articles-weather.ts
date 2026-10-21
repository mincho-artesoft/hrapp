import { LocalisedArticle } from '../types';

/**
 * The weather articles, in English.
 *
 * These answer the queries the visibility report says the app is absent from,
 * so they are written to be worth citing rather than to rank: a named
 * assumption, a straight answer, and the limits said out loud. An answer engine
 * quoting the paragraph about what a fourteen-day forecast cannot tell you is
 * worth more than one that never quotes us at all.
 */
export const WEATHER_EN_US: Readonly<Record<string, LocalisedArticle>> = {
  'weather-inside-your-calendar': {
  "title": "A calendar with the weather already in it",
  "short": "Weather inside your calendar",
  "description": "Use hourly and daily weather alongside iPhone and iPad calendars. Check the selected place, forecast dates and appointment time before planning.",
  "lede": "Almost everyone plans a day across two apps. The calendar says where you have to be; the weather app says what it will be like when you get there. Holding both in your head is the part nobody notices they are doing, until a Saturday gets rained on. This guide is published by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "That a calendar is for commitments and a weather app is for weather, and keeping them separate is simply how phones work.",
  "sections": [
    {
      "heading": "Keep the schedule and forecast in context",
      "body": [
        "For an outdoor appointment, first identify its place and time. Viewing weather alongside the calendar can make that comparison easier, but only when the weather refers to the intended location and date.",
        "For example, a meeting in another city calls for that city’s forecast. The weather near your phone may answer a different question, even though both displays sit beside the same schedule."
      ]
    },
    {
      "heading": "Match the forecast to the plan",
      "body": [
        "Use the available hourly and daily forecasts for the selected location alongside your schedule. Check that the dates and hours you need are actually present; a daily summary does not establish hourly coverage for every event.",
        "Calendar navigation reaches beyond weather data. A month or year view does not promise conditions for every date displayed. If your plan lies outside the available forecast, keep the calendar entry and check the weather closer to its date."
      ]
    },
    {
      "heading": "What the app’s forecast range means",
      "body": [
        "The app uses Apple WeatherKit and shows up to ten returned days in its daily list. Check the dates and hours currently available for the selected place; a calendar view can extend beyond them.",
        "The website uses a separate Open-Meteo demonstration. Its forecast range does not describe the range available in the app."
      ]
    }
  ],
  "claims": {
    "price": "Cost of the weather features, in pounds, dollars or euros"
  },
  "practical": [
    "Confirm the selected location and the forecast date.",
    "Compare the available hours with the hours of your plan.",
    "If the event is beyond the available forecast, check again nearer the date."
  ],
  "seeAlso": [
    "forecast-beside-every-event",
    "a-fourteen-day-view-of-the-weather"
  ],
  "updated": "2026-10-21",
  "sources": [
    {
      "label": "Apple: Get started with WeatherKit",
      "url": "https://developer.apple.com/weatherkit/"
    }
  ],
  "sourcesHeading": "Sources and further reading",
  "faq": [
    {
      "q": "Does the calendar provide weather for every future appointment?",
      "a": "No. Forecast dates are limited even when the calendar can hold much later appointments. Check the dates available for your chosen place."
    },
    {
      "q": "Which weather provider does the app use?",
      "a": "Cloud Calendars uses Apple WeatherKit. The website demonstration uses Open-Meteo separately."
    },
    {
      "q": "Can I create a plan from a forecast hour?",
      "a": "The app can start an event draft from an available hour. Check the time and destination calendar before saving."
    }
  ]
},

  'forecast-beside-every-event': {
  "title": "Compare an appointment with the hourly weather forecast",
  "short": "Weather for appointment hours",
  "description": "Match your appointment to the selected place, date and available forecast hours. Check the event draft before saving a weather-based plan.",
  "lede": "To compare weather with an appointment, match three things: the selected place, the forecast date and the hours your plan occupies. A nearby weather icon is not proof that all three match. This guide is published by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "That a daily weather icon on a calendar is the same feature as a forecast attached to an event.",
  "sections": [
    {
      "heading": "Start with place and date",
      "body": [
        "Open the forecast for the intended location and compare its date with the calendar entry. Calendar weather can reflect the selected weather place, so check that it is appropriate for the appointment rather than assuming the event address controls it.",
        "An appointment next month can exist before weather data for that date is available. Keep the appointment and return to the forecast nearer its date; a missing weather entry is not a clear-weather prediction."
      ]
    },
    {
      "heading": "Use hourly detail for an hourly question",
      "body": [
        "A daily summary and an hourly forecast answer different questions. If the appointment lasts from two until five, inspect the available hours covering that interval rather than treating one daily icon as the full picture.",
        "If only part of the interval is available, leave the rest unresolved. The app does not promise complete hourly weather for every event you can create, and this guide does not promise that opening any event always presents its entire weather window."
      ]
    },
    {
      "heading": "Separate chance, amount and timing",
      "body": [
        "Read the label on the value you are checking. A precipitation probability is not rainfall amount or duration. Likewise, an hourly value and a daily summary cover different periods; compare like periods when weighing two possible times.",
        "Choose a fallback appropriate to your plan instead of treating a single percentage as a universal go-or-cancel rule. Weather information can change, so revisit it when a decision needs to be made."
      ]
    },
    {
      "heading": "Review before saving a weather-based appointment",
      "body": [
        "The app can start an event draft from a forecast hour. Review the draft’s date, start, end and destination calendar before saving. Forecast selection does not replace a check that you are creating the right commitment.",
        "If calendar access or the destination calendar prevents saving, resolve that permission separately from weather access. Finding a forecast does not grant editing rights to a shared calendar."
      ]
    },
    {
      "heading": "Use the full forecast when the summary is not enough",
      "body": [
        "For an activity outdoors, inspect the variables relevant to that activity and the location you actually chose. A current-weather widget or homepage demo is not a substitute for checking the app’s available forecast hours.",
        "If you notice a discrepancy, compare the place and timestamp first. Different providers, selected places and forecast periods can produce different displays without proving that the calendar event changed."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Confirm location and event date.",
    "Check the available hours across the activity.",
    "Read probability and amount as different values.",
    "Review the event draft before saving."
  ],
  "seeAlso": [
    "weather-inside-your-calendar",
    "planning-outdoors-without-being-rained-on"
  ],
  "updated": "2026-10-21",
  "faq": [
    {
      "q": "Does every event have a complete forecast?",
      "a": "No. Coverage depends on the selected place and available dates and hours."
    },
    {
      "q": "Is the weather icon specific to the event address?",
      "a": "Do not infer that from proximity to the event. Confirm the weather location separately."
    },
    {
      "q": "Does tapping an hour save a new appointment?",
      "a": "It starts an event draft where available. Review its date, time and calendar before saving."
    }
  ],
  "sourcesHeading": "Weather sources and location settings",
  "sources": [
    {
      "label": "Apple: WeatherKit forecasts and regional availability",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Apple: Privacy and Location Services",
      "url": "https://support.apple.com/en-us/102515"
    }
  ]
},

  'a-fourteen-day-view-of-the-weather': {
  "title": "How far ahead does the available forecast reach?",
  "short": "The available forecast range",
  "description": "Check the dates a forecast actually covers. Calendar navigation, daily forecasts and hourly detail are different ranges in Cloud Calendars.",
  "lede": "You can create an appointment far beyond the dates covered by weather data. That does not make the forecast reach the appointment. Check the available dates before using weather to choose a time. This guide is published by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "Every future date visible in a calendar has a matching weather forecast.",
  "sections": [
    {
      "heading": "Separate the calendar range from the forecast range",
      "body": [
        "A calendar can hold a plan for next month without weather for that date. Look at the forecast dates themselves rather than the month open in the calendar. A missing weather entry is unavailable information, not a prediction of clear conditions."
      ]
    },
    {
      "heading": "The forecast available in the app",
      "body": [
        "The app uses Apple WeatherKit and displays up to ten returned days in its daily list. Check the actual dates and hourly detail for your chosen place rather than assuming every request provides the full range.",
        "The website demonstration uses Open-Meteo and requests a different forecast range. It is separate from the app, so use the app’s own available dates when planning."
      ]
    },
    {
      "heading": "Check the detail you actually need",
      "body": [
        "Confirm the selected place, date and hours. Daily and hourly displays need not expose identical ranges. Do not assume a daily forecast contains every hour of a long event.",
        "For a plan beyond the available dates, choose a tentative date based on your calendar and revisit the forecast later. Forecast information can change; this article does not assign a universal confidence threshold to a particular day."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Read the first and last dates actually available.",
    "Check hourly coverage separately from the daily list.",
    "Keep future plans provisional when weather information is not available."
  ],
  "seeAlso": [
    "weather-inside-your-calendar",
    "what-a-forecast-can-and-cannot-tell-you"
  ],
  "updated": "2026-10-21",
  "sourcesHeading": "Sources and further reading",
  "sources": [
    {
      "label": "Apple: Get started with WeatherKit",
      "url": "https://developer.apple.com/weatherkit/"
    }
  ],
  "faq": [
    {
      "q": "Does opening next month extend the forecast?",
      "a": "No. Calendar navigation and available weather dates are separate."
    },
    {
      "q": "Why are hourly and daily views different?",
      "a": "They summarize different periods. Check which actual hours and dates are available rather than inferring coverage from one view."
    },
    {
      "q": "Is the website’s forecast range the app’s range?",
      "a": "No. The website uses a separate Open-Meteo demonstration. Check available dates in the app itself."
    }
  ]
},

  'planning-outdoors-without-being-rained-on': {
  "title": "Planning outdoor things without getting rained on",
  "short": "Planning outdoors",
  "description": "A practical method for scheduling anything that happens outside, using the calendar you already keep rather than a separate weather routine.",
  "lede": "If your hobbies happen outdoors you have probably built a private ritual: check the weather, squint at the week, guess. The guessing is the part that can go. This guide is published by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "That avoiding bad weather means checking the forecast more often.",
  "sections": [
    {
      "heading": "Start with the place and the decision",
      "body": [
        "Choose the weather location that matches the activity, then check whether the relevant date and hours are available. Decide what you need to know: whether to choose a different time, keep a fallback or postpone the decision.",
        "Rechecking does not change the weather, but updated information can matter. There is no single checking schedule suitable for every outdoor plan."
      ]
    },
    {
      "heading": "Compare available times without promising the outcome",
      "body": [
        "Compare the relevant hourly information for each candidate period. A daily icon is a summary, not a guarantee of conditions throughout the day.",
        "Moving an activity by an hour may or may not help. Do not infer a dry interval that the forecast does not show, and do not apply a universal percentage threshold to every activity."
      ]
    },
    {
      "heading": "Make a fallback before changing invitations",
      "body": [
        "If the activity depends on suitable conditions, keep a realistic alternative and decide when you will review the latest information. Check local official guidance where relevant.",
        "For a shared appointment, confirm the organizer and editing rights before moving it. A better-looking forecast does not itself authorize a change to everyone’s schedule."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Confirm the forecast location and the dates and hours available.",
    "Compare candidate times using the weather factors relevant to your activity.",
    "Keep an alternative plan and check again before the decision matters.",
    "Consult relevant local official guidance when conditions could make the activity unsafe."
  ],
  "seeAlso": [
    "forecast-beside-every-event",
    "a-fourteen-day-view-of-the-weather"
  ],
  "updated": "2026-10-21",
  "faq": [
    {
      "q": "Does moving the event guarantee dry weather?",
      "a": "No. Compare the available forecast periods and keep a realistic alternative."
    },
    {
      "q": "Should I check only the daily icon?",
      "a": "For an activity at a specific time, inspect the available hours across its duration and confirm the location."
    },
    {
      "q": "Can I move a shared event just because another time looks better?",
      "a": "Confirm organizer responsibilities, editing rights and participants before changing their schedule."
    }
  ],
  "sources": [
    {
      "label": "Apple: WeatherKit forecast data and regional availability",
      "url": "https://developer.apple.com/weatherkit/"
    }
  ]
},

  'what-a-forecast-can-and-cannot-tell-you': {
  "title": "What a forecast can and cannot tell you",
  "short": "What a forecast can tell you",
  "description": "Forecasts are probabilistic, and reading them as promises is why they feel unreliable. A short guide to what the numbers actually mean.",
  "lede": "Weather forecasts are not wrong nearly as often as they feel wrong. Most of the gap is a mismatch between what they say and what people hear.",
  "commonBelief": "That a forecast is a statement about what will happen.",
  "sections": [
    {
      "heading": "It is a distribution, not a plan",
      "body": [
        "A forecast is the output of many model runs that disagree with each other. What you are shown is roughly where they cluster. When they cluster tightly, the forecast is confident; when they scatter, it is not — and the icon looks the same either way.",
        "This is why two forecasts that were both 'right' can feel different: one had no real competition, the other was a coin toss that landed."
      ]
    },
    {
      "heading": "Where it is strong",
      "body": [
        "Temperature is reliable further out than precipitation. Whether tomorrow is warm is a much easier question than whether it rains at four, and the difference is not small.",
        "Timing of a front is usually better than intensity. You can often trust that rain arrives in the afternoon while not trusting how much falls."
      ]
    },
    {
      "heading": "Where it is weak",
      "body": [
        "Anything convective — summer thunderstorms, sharp showers — is guesswork about placement. The model may be certain that storms happen in the region and unable to say whether one crosses your park.",
        "Mountains, coasts and cities all bend the local picture in ways a grid forecast smooths away."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Trust temperature further out than rain.",
    "Treat a chance of showers as a chance, not a schedule.",
    "For convective weather, check again on the morning; nothing earlier will settle it.",
    "If a plan cannot survive being wrong, build the fallback rather than refreshing the forecast."
  ],
  "seeAlso": [
    "reading-a-chance-of-rain",
    "a-fourteen-day-view-of-the-weather"
  ],
  "updated": "2026-10-21"
},

  'reading-a-chance-of-rain': {
  "title": "What a forty per cent chance of rain actually means",
  "short": "Reading a chance of rain",
  "description": "The single most misread number in any forecast, explained — and what to do with it when you are deciding whether to move an event.",
  "lede": "Almost nobody reads probability of precipitation the way it is meant. The number is not how much rain, and it is not how long.",
  "commonBelief": "That forty per cent means light rain, or rain for part of the day.",
  "sections": [
    {
      "heading": "What the number is",
      "body": [
        "It is the probability that measurable rain falls at a given point in the forecast area during the period. Forty per cent means: in four out of ten runs of this situation, the spot you are standing on gets wet.",
        "It says nothing about how hard, and nothing about for how long. A forty per cent day can be a five-minute shower or an afternoon of it."
      ]
    },
    {
      "heading": "Why it feels wrong so often",
      "body": [
        "Because people grade it as a yes or a no. Stay dry on a forty per cent day and the forecast 'was wrong'; get soaked and it 'was right'. Neither is true — the number was a bet, and bets lose six times in ten.",
        "Over a season a well-calibrated forty per cent rains about forty per cent of the time, which is exactly the point and is invisible from any single day."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Read it as odds, not as intensity.",
    "Under about thirty per cent, plan normally and carry a contingency.",
    "Above about sixty, plan for rain and be pleasantly surprised.",
    "Between the two, look at the hours rather than the day — that is where the answer usually is."
  ],
  "seeAlso": [
    "what-a-forecast-can-and-cannot-tell-you"
  ]
},

  'weather-where-the-event-is': {
  "title": "The weather where the event is, not where you are",
  "short": "Weather at the location",
  "description": "Choose weather for a meeting destination, check its local dates and hours, and distinguish selected-place forecasts from device-location alerts.",
  "lede": "Before using weather to plan an appointment away from home, select the destination in the weather view and check the place name. An address saved in an event is not enough to establish which forecast you are viewing. This guide is published by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "That one local forecast covers everything in your day.",
  "sections": [
    {
      "heading": "Choose the destination deliberately",
      "body": [
        "Cloud Calendars lets you use your current location or choose a searched or saved place for weather. For a meeting in another city, select that city and verify the displayed name before comparing forecast hours.",
        "Do not assume that adding a location to an event automatically switches every calendar weather display to that venue. Keep the event location accurate, then separately confirm the place used by the forecast."
      ]
    },
    {
      "heading": "Use search when you do not need current-location weather",
      "body": [
        "A searched place provides a way to inspect destination weather without treating your phone’s current position as the destination. Compare similarly named search results and verify the city or region before selecting one.",
        "For current-location weather, review Cloud Calendars in Settings, Privacy & Security, Location Services. If permission is denied or restricted, the current-location route may be unavailable. A location permission is separate from permission to read calendars or deliver notifications."
      ]
    },
    {
      "heading": "Match the forecast date and local time",
      "body": [
        "Check the forecast’s selected place, date and hours against the appointment. This matters particularly when travelling across time zones: the destination’s afternoon and your current afternoon may be different moments.",
        "For a long activity, examine the available hours across its duration. If some hours are missing, treat them as unavailable information rather than filling the gap with the nearest icon. A saved calendar appointment can extend beyond the forecast."
      ]
    },
    {
      "heading": "Keep destination forecasts and weather alerts separate",
      "body": [
        "Viewing a saved destination does not mean weather notifications follow that destination. Cloud Calendars’ weather-alert checks use the device’s recorded GPS location, with the app preference and iOS notification permission applying separately.",
        "Apple notes that severe weather alerts are available only in selected regions. Check relevant local official information for your destination; the absence of a notification is not confirmation that conditions are suitable for your activity."
      ]
    },
    {
      "heading": "If the place or forecast looks wrong",
      "body": [
        "First distinguish a wrong place from missing weather data. Re-select the intended city and compare its displayed name, date and available hours. If loading fails, check the connection and try later without changing your appointment or deleting an account.",
        "For support, record the chosen city, approximate forecast date, app and iOS versions and whether you selected current or searched weather. Keep private event titles and precise personal locations out of a public report."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Select the destination in the weather view.",
    "Verify place, date and local forecast hours.",
    "Review Location Services only when using current location.",
    "Check weather notifications separately from the selected forecast."
  ],
  "seeAlso": [
    "forecast-beside-every-event",
    "time-zones-and-the-flight-you-booked"
  ],
  "updated": "2026-10-21",
  "faq": [
    {
      "q": "Does entering an event address automatically select its forecast?",
      "a": "Do not assume so. Confirm the selected place in the weather view separately."
    },
    {
      "q": "Must I use GPS to view another city?",
      "a": "You can search for a place and inspect its weather. Current-location weather uses location access separately."
    },
    {
      "q": "Will alerts follow my saved destination?",
      "a": "The weather-alert checks use recorded device GPS location. Selecting a destination forecast does not establish destination alert coverage."
    }
  ],
  "sourcesHeading": "Weather sources and location settings",
  "sources": [
    {
      "label": "Apple: WeatherKit forecasts and regional availability",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Apple: Privacy and Location Services",
      "url": "https://support.apple.com/en-us/102515"
    }
  ]
},

  'the-commute-and-the-sky': {
  "title": "The two half-hours of your day that the weather actually ruins",
  "short": "The commute and the sky",
  "description": "Most weather disruption is not the day, it is the two commutes. A small habit that catches nearly all of it.",
  "lede": "Ask people when weather last inconvenienced them and they will mostly describe a journey, not an afternoon.",
  "commonBelief": "That a wet day is a wet day, and there is nothing to be done about it.",
  "sections": [
    {
      "heading": "The exposure is narrow",
      "body": [
        "For most people the genuinely weather-exposed part of a working day is two short journeys. Everything between them happens indoors.",
        "That makes the problem far smaller than it feels, and far more tractable: you are not trying to predict a day, only two half-hours."
      ]
    },
    {
      "heading": "Which changes what you check",
      "body": [
        "The useful question is not whether it rains today but whether it rains at eight and at six. Those are two specific hours, and hourly detail answers them well inside the range where forecasts are strong.",
        "Shifting a departure by twenty minutes is often the entire fix, and it is only visible if you looked at the hours."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Check the two commute hours rather than the day.",
    "Twenty minutes earlier or later is usually enough to miss a shower.",
    "If both ends look wet, that is the day to take the bag rather than the bike."
  ],
  "seeAlso": [
    "forecast-beside-every-event"
  ]
},

  'daylight-as-a-planning-constraint': {
  "title": "Daylight is a constraint, and calendars usually ignore it",
  "short": "Daylight and planning",
  "description": "Sunset moves by minutes a day and by hours across a season. For anything outdoors it binds harder than the weather does.",
  "lede": "Weather is uncertain. Daylight is not, and yet most plans are made as though only the first one existed.",
  "commonBelief": "That the light will hold because it held last week.",
  "sections": [
    {
      "heading": "The number moves faster than intuition",
      "body": [
        "Around the equinoxes sunset shifts by two to three minutes a day at mid-latitudes. Over a fortnight that is half an hour, which is the difference between finishing in light and finishing by phone torch.",
        "In late autumn the change is sharpest exactly when people are still scheduling as though it were September."
      ]
    },
    {
      "heading": "Use it as a hard edge",
      "body": [
        "Unlike rain, sunset is certain. It is the one planning input that never surprises you, and it deserves to be treated as a wall rather than a suggestion.",
        "Work backwards from it: a two-hour activity that must finish in daylight has a latest start, and that start moves every week."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Work backwards from sunset for anything outdoors, not forwards from the free slot.",
    "Re-check the latest safe start every couple of weeks in spring and autumn.",
    "In the fortnight after the clocks change, assume your instincts are an hour wrong."
  ],
  "seeAlso": [
    "planning-outdoors-without-being-rained-on"
  ]
},

  'wind-the-forecast-nobody-reads': {
  "title": "Wind is the forecast nobody reads and half of them needed",
  "short": "Wind, the ignored forecast",
  "description": "Cycling, sailing, paddling, drone flying, gardening, anything with a gazebo. For a lot of plans wind decides the day and rain does not.",
  "lede": "People check rain out of habit. For a surprising number of activities, wind is the number that actually determines whether the thing happens.",
  "commonBelief": "That wind is a detail and rain is the headline.",
  "sections": [
    {
      "heading": "Where wind is the binding constraint",
      "body": [
        "A dry day at thirty knots cancels more plans than a damp one at five. Cyclists, sailors, paddlers, anyone putting up a marquee, anyone flying anything — for all of them the rain line is secondary.",
        "It is also the number people are worst at estimating from a window, because a sheltered street tells you very little about an exposed route."
      ]
    },
    {
      "heading": "Direction matters as much as speed",
      "body": [
        "The same speed is a different day depending on where it comes from. An offshore wind flattens water and pushes you out; onshore does the opposite. A headwind out is a tailwind home, which changes how far you plan to go.",
        "Gust figures matter more than averages for anything with a sail or a canopy: the average holds the tent up, the gust takes it away."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "For wind-sensitive plans, check speed and direction, not just the icon.",
    "Read the gusts, not the mean, for anything that can be lifted.",
    "Plan the outbound leg into the wind so the tired leg is the easy one."
  ],
  "seeAlso": [
    "planning-outdoors-without-being-rained-on",
    "weather-where-the-event-is"
  ]
},
};
