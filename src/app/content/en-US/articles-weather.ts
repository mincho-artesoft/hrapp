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
  "title": "What does a chance of rain mean for a calendar event?",
  "short": "Reading a chance of rain",
  "description": "Read rain probability alongside the forecast period, amount and location. Compare the hours of your event without inventing a universal cancellation threshold.",
  "lede": "An outdoor booking needs a decision about a particular place and time. A percentage alone does not tell you the expected amount of rain, how long it will last or whether your activity can continue. This guide is published by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "A forty per cent chance means rain for forty per cent of the day, or a universal rule about whether to cancel.",
  "sections": [
    {
      "heading": "Identify the place and period first",
      "body": [
        "The U.S. National Weather Service describes precipitation probability for a particular point over a specified period. Its published example uses a measurable-rain threshold and a forecast period; those details belong to that product. Do not silently apply its twelve-hour example to every hourly forecast.",
        "Apple describes WeatherKit’s hourly precipitation chance as a probability during that hour. In Cloud Calendars, compare the selected forecast place and date with the appointment. A percentage for the next available hour is not automatically the forecast for a meeting next Thursday."
      ]
    },
    {
      "heading": "Keep likelihood separate from amount",
      "body": [
        "Probability answers a likelihood question. It is not a rainfall amount or a fraction of the period spent raining. Check an amount and its unit separately when the forecast provides one, and read the time interval attached to that amount.",
        "For example, an organiser choosing between two outdoor slots needs more than two percentages. Available timing and amount information may affect preparation differently. If the required detail is absent, record that gap rather than replacing it with an assumption that a lower percentage means lighter rain."
      ]
    },
    {
      "heading": "Compare the whole appointment, not one icon",
      "body": [
        "For a plan from 14:00 to 16:00, inspect the available forecast intervals covering both hours, along with setup or travel time that actually matters to the arrangement. A daily summary and an individual hour are different views, so a difference between their numbers is not by itself an error.",
        "Do not add the displayed hourly percentages to produce a probability for the whole appointment. Rain in different hours can occur in the same possible outcome, so simple addition can count overlapping outcomes more than once. Keep each number attached to its interval, or use a provider’s broader-period product when that is the question you need answered."
      ]
    },
    {
      "heading": "Use a decision suited to the activity",
      "body": [
        "An indoor reservation with a short walk and an uncovered outdoor display have different consequences if rain occurs. Agree the venue’s conditions, equipment requirements and alternative arrangement before choosing a slot. There is no general thirty-or-sixty-per-cent rule that makes every event appropriate.",
        "A simple planning example is a two-location gathering: keep the intended outdoor slot and an agreed indoor fallback, then record when the organiser will confirm the location. This is a planning convention, not an automatic weather-triggered relocation feature in Cloud Calendars."
      ]
    },
    {
      "heading": "Recheck before a costly change",
      "body": [
        "Forecasts can change as the event approaches. Review the chosen place, date and available update information before changing a booking or telling guests to travel elsewhere. For official warnings or activity-specific decisions, use the relevant weather authority and venue guidance.",
        "The Cloud Calendars app uses Apple WeatherKit, while this website’s interactive weather demo uses Open-Meteo. Different providers, locations or forecast periods can produce different displays. Compare like with like rather than assuming that the website and app must show the same percentage."
      ]
    },
    {
      "heading": "Save and communicate the actual plan",
      "body": [
        "When you create or change the calendar entry, inspect its date, time zone, duration and destination calendar. Weather helps inform the decision; saving an event does not guarantee the forecast, notify every participant successfully or record their agreement to a new venue.",
        "Write a clear confirmation message when the arrangement changes. Keep the fallback and decision time understandable to the people involved, then verify their response through your agreed channel. A blank forecast outside the available range is unavailable information, not a promise of dry weather."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Check the forecast place, date and stated period.",
    "Read probability separately from amount and duration.",
    "Inspect the available intervals across the appointment.",
    "Choose a fallback appropriate to the activity and venue.",
    "Recheck current information before changing a booking.",
    "Verify the calendar entry and confirm changes with participants."
  ],
  "faq": [
    {
      "q": "Does forty per cent mean rain for forty per cent of the time?",
      "a": "No. A precipitation probability is tied to a forecast place and period. It is not a duration or amount; inspect those separately."
    },
    {
      "q": "Can I add hourly percentages to get the chance for my event?",
      "a": "Simple addition is not a valid way to combine those probabilities. Keep each number attached to its interval or consult a forecast product for the broader period."
    },
    {
      "q": "At what percentage should I cancel?",
      "a": "There is no universal percentage for every activity. Use the venue’s conditions, consequences, relevant official guidance and an agreed alternative."
    }
  ],
  "sourcesHeading": "Definitions and provider guidance",
  "sources": [
    {
      "label": "National Weather Service: precipitation probability and forecast periods",
      "url": "https://www.weather.gov/lmk/pops?hl=en-US"
    },
    {
      "label": "Apple WeatherKit: hourly precipitation chance",
      "url": "https://developer.apple.com/documentation/weatherkit/hourweather/precipitationchance"
    }
  ],
  "seeAlso": [
    "what-a-forecast-can-and-cannot-tell-you",
    "weather-where-the-event-is",
    "planning-outdoors-without-being-rained-on"
  ],
  "updated": "2026-10-22"
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
  "title": "Plan around sunset: check daylight, location and the event date",
  "short": "Daylight and planning",
  "description": "Check sunset for the right place and date, distinguish it from twilight, and plan an appropriate margin instead of assuming last week’s light will repeat.",
  "lede": "An empty evening slot does not tell you how much useful natural light a place will have. Start with the actual activity, destination and date, then work back from the conditions it needs. This guide is published by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "The listed sunset is an exact universal cutoff for visibility, and a weekly appointment always has the same daylight.",
  "sections": [
    {
      "heading": "Match the solar information to the destination",
      "body": [
        "Check the place and date attached to a sunrise or sunset value. A time for your current city is not automatically the time at a destination in another time zone. Keep the event’s local date and time clear before comparing it with the weather view.",
        "Cloud Calendars weather supports selected-place information and available solar values returned by WeatherKit. Check the available date and displayed field before relying on it. Missing information should remain missing, rather than being replaced with today’s sunset or an assumption that the whole evening is light."
      ]
    },
    {
      "heading": "Distinguish sunset from twilight",
      "body": [
        "The U.S. Naval Observatory defines sunrise and sunset using the Sun’s position relative to a conventional horizon. Twilight is a separate interval before sunrise or after sunset, with different definitions. The labels therefore should not be used as interchangeable names for one instant.",
        "Calculated solar times are not a measurement of the light available for a particular task. The observatory describes effects from the atmosphere, local horizon and observer position. A time displayed to the minute does not mean every venue will have identical visibility at that minute."
      ]
    },
    {
      "heading": "Work back from the task rather than a universal margin",
      "body": [
        "Decide what needs daylight: setting up an outdoor display, completing the activity, or returning equipment to the venue. Ask the organiser or venue which conditions and finish arrangements apply. Do not use this guide to invent a general latest safe start for every outdoor activity.",
        "For example, a venue may require a display to finish and equipment to be packed away before its agreed cutoff. Put those separate commitments into the plan. Subtract the actual activity and pack-down time from that agreed finish, rather than treating the event’s advertised end as the entire job."
      ]
    },
    {
      "heading": "Check each repeated date",
      "body": [
        "A weekly appointment repeats its scheduling rule, not the amount of daylight. Review relevant dates when the season changes or the event crosses a clock change. Check the local time zone instead of assuming that an unchanged wall-clock time has unchanged lighting.",
        "If only one occurrence needs moving, choose an editor and repeat scope that express that exception. After saving, inspect the changed date and a later occurrence. A routine that remains suitable in one week does not establish that every future occurrence meets the same conditions."
      ]
    },
    {
      "heading": "Keep available forecasts separate from long-term planning",
      "body": [
        "A calendar can hold appointments far beyond the available weather or solar entries in a particular view. For a later date, consult a suitable place-and-date source instead of assuming the app has returned a value for it. Do not copy the nearest available day as though it were the requested one.",
        "NOAA explains that calculated sunrise and sunset depend on assumptions and observed results can vary. Its older solar calculator is no longer actively maintained; this guide cites its explanation of those limitations, not a claim that the calculator certifies an event’s conditions."
      ]
    },
    {
      "heading": "Save the intended arrangement and recheck it",
      "body": [
        "Record the activity’s date, local time, duration and venue accurately. If a separate setup or finish commitment helps the organiser, label it so nobody confuses it with the public start time. Check the destination calendar before saving a shared arrangement.",
        "Before the event, review the actual forecast and venue information as well as the solar time. Communicate a changed start or location directly to the people involved. Neither a sunset entry nor a saved appointment guarantees usable light, suitable weather or that every participant has received an update."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identify the destination, event date and local time zone.",
    "Check whether the value is sunset, sunrise or a twilight field.",
    "Ask the organiser what conditions and finish arrangement apply.",
    "Include the real setup, activity and pack-down periods.",
    "Review repeated dates and any intended single-occurrence change.",
    "Save the correct calendar entry and confirm changes with participants."
  ],
  "faq": [
    {
      "q": "Is sunset the exact moment an activity must stop?",
      "a": "Sunset is a defined solar event, not a universal task-specific visibility rule. Use the venue’s requirements and actual conditions for the arrangement."
    },
    {
      "q": "Can I reuse today’s sunset for an event next month?",
      "a": "No. Check the intended place and date. A calendar appointment can extend beyond the values available in a weather view."
    },
    {
      "q": "Does a recurring evening event keep the same daylight?",
      "a": "No. Recheck the relevant dates, season and local clock settings; the repeat rule does not preserve lighting conditions."
    }
  ],
  "sourcesHeading": "Definitions and provider guidance",
  "sources": [
    {
      "label": "U.S. Naval Observatory: rise, set and twilight definitions",
      "url": "https://aa.usno.navy.mil/faq/RST_defs"
    },
    {
      "label": "NOAA: solar calculation assumptions and limitations",
      "url": "https://gml.noaa.gov/grad/solcalc/calcdetails.html"
    }
  ],
  "seeAlso": [
    "weather-where-the-event-is",
    "recurring-events-without-the-mess",
    "planning-outdoors-without-being-rained-on"
  ],
  "updated": "2026-10-22"
},

  'wind-the-forecast-nobody-reads': {
  "title": "Wind forecast for outdoor plans: speed, gusts, direction and time",
  "short": "Wind and outdoor plans",
  "description": "Read wind speed, gusts, units and timing before an outdoor plan. Match the forecast place and period without treating an icon as a safety decision.",
  "lede": "A dry-looking forecast can leave an important planning question unanswered. An exposed venue, temporary display or outdoor class may need wind information as well as a rain icon. This guide is published by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "A low rain chance means an outdoor plan is suitable, and one wind number applies everywhere along the route.",
  "sections": [
    {
      "heading": "Read the value and its unit",
      "body": [
        "Start with the selected place, forecast date and units. A number labelled kilometres per hour cannot be compared directly with the same number in knots or miles per hour. Keep the displayed unit with any value you record or share.",
        "The Met Office distinguishes its average wind-speed field from the gust field. Read the definitions supplied by the provider you are using rather than assuming every app averages observations over the same interval. In Cloud Calendars, inspect the relevant available forecast hours instead of substituting the current weather for a later appointment."
      ]
    },
    {
      "heading": "Look at gusts as a separate field",
      "body": [
        "Gusts describe stronger, short-lived peaks rather than the same thing as a typical or average wind value. A separate gust field can therefore change the picture even when the main speed number looks modest. Check which period the provider associates with it.",
        "If a value is missing or unavailable, do not treat that as proof that there will be no gusts. For a venue with operating limits, use the required forecast and the venue or equipment guidance. This guide does not supply a universal wind limit for structures, aircraft or water activities."
      ]
    },
    {
      "heading": "Interpret direction using the provider’s convention",
      "body": [
        "The Met Office explains that its compass letters identify where the wind comes from, while its arrow illustrates the direction of travel. Do not assume an arrow in another product uses the same convention without checking its legend.",
        "A selected-city forecast is not a measurement at every point of a route or venue. When location matters, compare the actual venue and the information required for it. A sheltered observation near your home does not establish conditions at an exposed destination."
      ]
    },
    {
      "heading": "Check the period covering the commitment",
      "body": [
        "Consider the whole period you are arranging, including setup and pack-down when relevant. A forecast at the event’s start does not describe every later hour. Record the selected date and time alongside the wind value so a screenshot or note remains understandable.",
        "Suppose a venue offers a morning and an afternoon slot for an outdoor display. Compare the available intervals for each slot and ask the venue which conditions matter to its decision. The calendar can record the chosen arrangement; it does not certify either slot as suitable."
      ]
    },
    {
      "heading": "Keep forecasts and warnings distinct",
      "body": [
        "A general wind forecast and an official warning answer different questions. Check relevant local warnings and the organiser’s requirements when weather could affect the arrangement. Do not infer the absence of a warning from a single number on a calendar screen.",
        "Cloud Calendars’ selected-place weather and device-location weather alerts are separate paths. Selecting a destination forecast does not establish that every alert will arrive for that destination. Use the responsible authority’s information directly when it matters to the plan."
      ]
    },
    {
      "heading": "Record the fallback and confirm changes",
      "body": [
        "Choose who will make the final decision and when they will communicate it. A useful calendar note can state the venue, the intended slot and the agreed alternative without turning a forecast value into a guaranteed outcome.",
        "Before rescheduling, check the event’s calendar, local time and duration, then tell the participants what changed. Do not rely on the calendar entry to communicate a last-minute venue decision on its own. Revisit the current forecast rather than leaving an old copied number as the only planning reference."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Check place, date, time interval and wind units.",
    "Read the speed and gust fields separately.",
    "Confirm how the provider represents direction.",
    "Compare the available hours across the whole commitment.",
    "Check venue requirements and relevant official information.",
    "Record the fallback and confirm any schedule change directly."
  ],
  "faq": [
    {
      "q": "Are wind speed and gusts interchangeable?",
      "a": "No. Read their separate definitions and periods in the forecast product. A missing gust value is not evidence that gusts cannot occur."
    },
    {
      "q": "Does selecting a destination guarantee weather alerts for it?",
      "a": "No. In Cloud Calendars the selected forecast and device-location alert paths are distinct. Check the relevant local authority’s information separately."
    },
    {
      "q": "What wind speed is safe for my activity?",
      "a": "This calendar guide does not set activity or equipment limits. Use the organiser, venue, equipment requirements and relevant official guidance."
    }
  ],
  "sourcesHeading": "Definitions and provider guidance",
  "sources": [
    {
      "label": "Met Office: forecast wind speed, direction and gust definitions",
      "url": "https://weather.metoffice.gov.uk/guides/what-does-this-forecast-mean"
    },
    {
      "label": "Apple WeatherKit: weather conditions, wind data and availability",
      "url": "https://developer.apple.com/documentation/weatherkit"
    }
  ],
  "seeAlso": [
    "weather-where-the-event-is",
    "reading-a-chance-of-rain",
    "planning-outdoors-without-being-rained-on"
  ],
  "updated": "2026-10-22"
},
};
