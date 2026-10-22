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
  "updated": "2026-10-22",
  "title": "Calendar with weather on iPhone and iPad: check a plan in context",
  "short": "Use calendar and weather together",
  "description": "Use calendar and weather together on iPhone and iPad. Check the selected place, available forecast hours and event details before saving a plan.",
  "lede": "A calendar tells you when a commitment is scheduled. Weather helps answer a different question: what conditions are forecast for the place and period you need. Use the two together while keeping their locations and dates explicit. This guide is published by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "Weather shown beside a calendar automatically describes every appointment’s address, every hour and every future date.",
  "sections": [
    {
      "heading": "Choose a real planning question",
      "body": [
        "Start with a particular appointment, such as an afternoon visit to a park. Identify what could change: its time, venue, preparation or the decision to use an alternative. You do not need to rearrange the whole calendar just because the day’s symbol shows rain.",
        "Write down the activity’s actual start and end, including setup if relevant. A calendar overview helps find possible dates, while the forecast check concerns a particular place and interval. Keep those two jobs distinct when comparing options."
      ]
    },
    {
      "heading": "Confirm the weather place before reading the values",
      "body": [
        "Cloud Calendars offers weather for the current or selected place. Check the displayed location rather than assuming an event’s address silently changes the forecast. An appointment in another city needs a comparison with that city’s weather.",
        "For example, a visitor may be planning a museum arrival while the phone is still at home. Read the forecast location and the appointment’s local time before comparing them. Nearby-looking values are not proof that the schedule and weather use the same place."
      ]
    },
    {
      "heading": "Check hourly and daily coverage separately",
      "body": [
        "Use a daily entry for orientation and the available hourly entries for a question about part of a day. A booking from two until five needs more than a glance at one symbol. Check whether the relevant hours are actually present.",
        "In the current app source, the daily list takes up to ten returned WeatherKit days. That is separate from calendar navigation and from the hours currently supplied. A future appointment does not extend weather coverage. If its period is absent, arrange a later weather review."
      ]
    },
    {
      "heading": "Read what the weather value means",
      "body": [
        "Apple documents WeatherKit data such as temperature, precipitation, wind and UV, with some products available only in selected regions. Read the values available for your chosen place rather than expecting every weather product everywhere.",
        "The Met Office’s guidance illustrates why forecast period and variable definitions matter: some values refer to a moment and others to a period. Use the relevant provider’s labels. Rain probability, amount and duration are different questions, and no single number decides every outdoor activity."
      ]
    },
    {
      "heading": "Review a draft created from a weather hour",
      "body": [
        "Where the app offers creating an event from an hour, it opens a draft. The current source uses the weather location’s time zone, proposes a one-hour duration and selects the default new-event calendar. Inspect each value before saving.",
        "Confirm the title, destination calendar, start, end and intended location. A forecast selection does not grant permission to edit a shared calendar, notify a venue or reserve a room. Check the saved event and obtain any agreement the plan needs."
      ]
    },
    {
      "heading": "Keep the website demonstration separate",
      "body": [
        "The website’s interactive weather demonstration uses Open-Meteo. The app uses Apple WeatherKit. A web demonstration is useful for exploring the presentation, but its place, data and available dates can differ from the app.",
        "For a real decision, open the app and compare the intended appointment with its available forecast. If you change a shared plan, confirm the organiser, recurrence scope and participants. Keep an agreed alternative when the activity depends on conditions."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identify the appointment and the decision weather could change.",
    "Confirm the weather location and the appointment’s local date and time.",
    "Inspect available hourly coverage separately from the daily summary.",
    "Read probability, amount and other relevant values using their labels.",
    "Review all event-draft details and the destination calendar before saving.",
    "Recheck at the decision time and confirm shared changes directly."
  ],
  "faq": [
    {
      "q": "Does weather beside my calendar follow each event address?",
      "a": "Do not assume that. Confirm the displayed weather location and compare it with the venue; proximity on screen does not establish the match."
    },
    {
      "q": "Does the app use the website’s weather provider?",
      "a": "No. The app uses Apple WeatherKit; the website demonstration uses Open-Meteo separately."
    },
    {
      "q": "Does choosing a forecast hour save an appointment automatically?",
      "a": "It starts a draft where that action is offered. Check its date, time zone, duration, calendar and location, then save the intended event."
    }
  ],
  "seeAlso": [
    "weather-calendar-history-versus-forecast-iphone",
    "forecast-beside-every-event",
    "a-fourteen-day-view-of-the-weather",
    "weather-where-the-event-is",
    "planning-outdoors-without-being-rained-on"
  ],
  "sourcesHeading": "Official sources and further reading",
  "sources": [
    {
      "label": "Apple: WeatherKit forecast information and regional availability",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Met Office: forecast place, periods and weather values",
      "url": "https://weather.metoffice.gov.uk/guides/what-does-this-forecast-mean"
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
  "updated": "2026-10-22",
  "title": "How far ahead can I see weather in Cloud Calendars?",
  "short": "Check the forecast dates actually available",
  "description": "Check the forecast dates available in Cloud Calendars. Separate daily and hourly coverage, future appointments and the website’s weather demonstration.",
  "lede": "A long-range calendar and a long-range weather forecast are different things. You can book a meeting before its forecast exists. Read the available dates in the app rather than inferring weather coverage from the month you can open. This guide is published by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "Every future date in a calendar has a forecast, and the website’s fourteen-day demonstration is the app’s forecast range.",
  "sections": [
    {
      "heading": "Read the dates in the weather display",
      "body": [
        "Open weather for the intended place and identify the dates actually listed. Do not decide availability from the calendar’s month or year navigation. Missing forecast information means you still need a later check; it does not mean a clear day.",
        "If you are organising a gathering several weeks ahead, save the agreed date and record the weather decision separately. Venue availability, invitations and an eventual forecast are different inputs to that plan."
      ]
    },
    {
      "heading": "Understand the app’s daily list",
      "body": [
        "The app uses Apple WeatherKit. Its current daily-list implementation keeps up to ten days returned by the service. Read the actual first and last dates for the selected place rather than assuming every view or request has a full ten-day set.",
        "This limit describes the displayed daily list, not a promise that all weather variables have equal confidence or that every appointment within those dates has a complete forecast. Use the level of detail needed for the decision."
      ]
    },
    {
      "heading": "Check hourly availability for timed activities",
      "body": [
        "A daily summary does not establish the exact conditions throughout an appointment. Open the relevant day and compare the available hours covering arrival, the activity and departure. If part of the period is missing, leave it unresolved.",
        "For an evening event, make sure the selected place and local date still match the schedule. A late arrival after midnight belongs to another date. Check actual timestamps instead of treating the end of the daily list as the end of every hourly series."
      ]
    },
    {
      "heading": "Distinguish the website’s demonstration",
      "body": [
        "The current website requests fourteen forecast days from Open-Meteo for its weather demonstration. Open-Meteo documents configurable ranges; this website request is a separate implementation from the iOS app.",
        "Do not use the web result to claim that the app supplies fourteen WeatherKit days. If the two displays differ, first compare the place, time and provider. A different forecast range does not mean the calendar lost an appointment."
      ]
    },
    {
      "heading": "Plan a review when the forecast is not yet available",
      "body": [
        "Keep the booking’s real date and arrange a review that still leaves time for a venue decision or a message to participants. For example, an outdoor celebration may need an indoor option agreed before the next forecast check.",
        "Choose the review around the activity’s actual constraints. This guide does not assign an accuracy percentage or universal go-or-cancel threshold to a numbered forecast day. Check current information when it can change an actionable decision."
      ]
    },
    {
      "heading": "Check event details after choosing a time",
      "body": [
        "If an available forecast hour helps you choose a time, review the resulting event draft. Confirm the local date, start, end, destination calendar and location. Forecast navigation does not replace calendar permissions or an organiser’s agreement.",
        "After an authorised change, reopen the event and check the intended occurrence or series. Confirm important changes with participants separately. Weather data becoming available is not the same as a changed invitation being received."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Select the place relevant to the appointment.",
    "Read the first and last dates shown in the app’s daily list.",
    "Check the needed hourly interval separately, including midnight boundaries.",
    "Keep website Open-Meteo coverage separate from app WeatherKit coverage.",
    "Arrange a later review for plans beyond the available forecast.",
    "Verify the saved event and confirm shared changes with participants."
  ],
  "faq": [
    {
      "q": "Does Cloud Calendars offer a fourteen-day app forecast?",
      "a": "The current app daily list uses up to ten returned WeatherKit days. The website separately requests fourteen Open-Meteo days. Check the dates actually available in the app."
    },
    {
      "q": "Why can I create an event after the last weather date?",
      "a": "Calendar storage and weather availability are separate. Keep the appointment and review the forecast nearer the date."
    },
    {
      "q": "Does a daily entry guarantee weather for every hour of my event?",
      "a": "No. Check the hours actually supplied for that place and period. Do not infer complete hourly coverage from the daily list."
    }
  ],
  "seeAlso": [
    "weather-inside-your-calendar",
    "forecast-beside-every-event",
    "what-a-forecast-can-and-cannot-tell-you",
    "planning-outdoors-without-being-rained-on"
  ],
  "sourcesHeading": "Official sources and further reading",
  "sources": [
    {
      "label": "Apple: WeatherKit forecast information and regional availability",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Open-Meteo: forecast parameters and available ranges",
      "url": "https://open-meteo.com/en/docs"
    }
  ]
},

  'planning-outdoors-without-being-rained-on': {
  "updated": "2026-10-22",
  "title": "Plan an outdoor event with a forecast and a fallback",
  "short": "Choose an outdoor plan and a workable alternative",
  "description": "Plan an outdoor event by checking the venue, forecast hours and an agreed fallback. Review calendar details before changing a shared appointment.",
  "lede": "Weather can help compare possible times for an outdoor activity, but it cannot promise a dry result. Start with the activity’s requirements and the decisions you can still change, then use the relevant forecast to inform those decisions. This guide is published by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "Checking more often or moving an activity slightly guarantees that it will avoid bad weather.",
  "sections": [
    {
      "heading": "Define the activity before choosing a weather number",
      "body": [
        "Identify the venue, the people involved and what the activity needs. A garden lunch, a school sports session and a booked outdoor performance have different practical constraints. Avoid applying one generic rain percentage to all of them.",
        "Write down who can make a change and the latest useful decision time. A venue’s deadline or a helper’s availability may limit your options before the weather does. These planning examples do not supply technical safety limits for any activity."
      ]
    },
    {
      "heading": "Match place, local date and the full interval",
      "body": [
        "Check the selected weather location against the actual venue. Include arrival and preparation where relevant, then inspect the available hours across the activity. One daily icon cannot describe every moment in a long booking.",
        "If the event is beyond the forecast dates, keep the agreed date and set a later review. If you are travelling, compare the venue’s local time with the appointment. Do not silently replace the booking with a forecast for your current location."
      ]
    },
    {
      "heading": "Compare real alternatives without inventing dry windows",
      "body": [
        "Compare candidate periods using the relevant weather fields and their labels. The Met Office’s forecast guide distinguishes probability from other weather values and explains that fields can describe different periods. Read the corresponding definitions for the source you are using.",
        "Leaving an hour later may or may not improve conditions. Treat a more suitable-looking period as information for the plan, not a guarantee. Do not infer an uncovered hour or a route-wide observation from a value for one place."
      ]
    },
    {
      "heading": "Agree a fallback people can actually use",
      "body": [
        "An alternative should solve the activity’s real problem: a permitted indoor venue, an agreed postponement or a different arrangement that participants can reach. Check access, cost and availability through the appropriate organiser or venue.",
        "For example, moving a picnic indoors can fail if nobody has confirmed the room. Record the alternative clearly and decide who will communicate the final choice. A note in one person’s private calendar is not a shared agreement."
      ]
    },
    {
      "heading": "Save and change the intended event",
      "body": [
        "Before creating or editing, confirm the destination calendar, start, end and location. An event draft started from a weather hour still needs review. Its proposed duration may not match setup, travel or the full activity.",
        "For a shared or repeating appointment, check organiser responsibilities, editing rights and recurrence scope. After an authorised change, reopen the saved event. A local change is not proof that the venue or every participant accepted it."
      ]
    },
    {
      "heading": "Recheck when a decision can still make a difference",
      "body": [
        "Choose a review time that leaves room to act under the booking’s conditions. Compare the latest relevant forecast and applicable official or venue guidance. Forecast information is an input, not permission to ignore an activity’s requirements.",
        "Communicate the final plan and confirm important handoffs directly. If a later update changes the decision, identify which event and occurrence to amend. Repeatedly refreshing without a workable alternative does not remove uncertainty."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identify the activity’s venue, requirements and decision owner.",
    "Check the selected weather place and the full local-time interval.",
    "Compare only forecast dates and hours that are actually available.",
    "Agree a feasible alternative and a decision deadline.",
    "Review calendar destination, event details and recurrence scope before saving.",
    "Recheck at the agreed time and confirm the final plan with participants."
  ],
  "faq": [
    {
      "q": "Can moving my event by an hour guarantee dry weather?",
      "a": "No. Compare the available periods and keep an alternative suited to the activity. A forecast is not a promise of the result."
    },
    {
      "q": "What if the forecast does not reach the event date?",
      "a": "Keep the agreed appointment and schedule a later weather review. Missing information is not a clear-weather prediction."
    },
    {
      "q": "Can I move a shared event when another time looks better?",
      "a": "Confirm the organiser’s agreement, editing rights and participants first. Check the recurrence scope and the saved result, then communicate the change."
    }
  ],
  "seeAlso": [
    "forecast-beside-every-event",
    "reading-a-chance-of-rain",
    "what-a-forecast-can-and-cannot-tell-you",
    "the-commute-and-the-sky"
  ],
  "sourcesHeading": "Official sources and further reading",
  "sources": [
    {
      "label": "Apple: WeatherKit forecast information and regional availability",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Met Office: forecast place, periods and weather values",
      "url": "https://weather.metoffice.gov.uk/guides/what-does-this-forecast-mean"
    }
  ]
},

  'what-a-forecast-can-and-cannot-tell-you': {
  "title": "How reliable is a weather forecast for a calendar event?",
  "short": "Read forecast uncertainty before changing a plan",
  "description": "Check forecast place, period and uncertainty before changing an event. Separate rain probability, decisions and available weather in Cloud Calendars.",
  "lede": "A forecast helps you make a decision about an event; it does not guarantee the conditions at every moment. Start with the venue and time, then decide what information could change the plan. This guide is published by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "A weather icon promises the exact conditions throughout an appointment, and a changed forecast means the earlier probability was meaningless.",
  "sections": [
    {
      "heading": "Identify the forecast before judging it",
      "body": [
        "A useful check starts with the place, date and period being forecast. The same icon beside a daily summary and an hourly entry does not describe the same interval. Read the accompanying values and the provider’s definitions rather than treating the picture as a minute-by-minute promise.",
        "For an outdoor appointment, write down the venue and the hours that matter: arrival, the activity and departure may need different checks. A forecast for your current location does not answer a question about a venue elsewhere."
      ]
    },
    {
      "heading": "Understand why an estimate can change",
      "body": [
        "The Met Office explains that forecasts start from an estimated state of the atmosphere. Small differences in that starting estimate can grow. Its ensemble systems explore possible outcomes with multiple runs; greater disagreement signals greater uncertainty.",
        "This explains why confidence matters, but does not mean every value in Cloud Calendars is an ensemble mean or that the app displays individual model runs. An icon alone does not reveal the complete uncertainty behind a forecast."
      ]
    },
    {
      "heading": "Keep probability, amount and timing separate",
      "body": [
        "A rain probability concerns a defined event over a defined place and period. It is not, by itself, a statement about the share of your appointment that will be wet. Check the forecast product’s definitions and read amount, wind or other relevant fields separately when available.",
        "If a forecast changes from rain around midday to rain later, compare the same location and intervals before calling the two versions contradictory. Save the observation time if you need to discuss the change with a venue or another organiser; do not silently move a shared booking."
      ]
    },
    {
      "heading": "Choose the decision for the activity",
      "body": [
        "The Met Office’s decision-making guidance relates probability thresholds to the particular application. A percentage that prompts one action is not a universal cancellation rule.",
        "For a casual picnic, a nearby indoor alternative may be practical. A booked performance may instead require a venue decision and a notification deadline. Agree who can change the plan, what information they need and when others will hear. These are planning examples, not weather safety thresholds."
      ]
    },
    {
      "heading": "Use Cloud Calendars for the schedule and available weather",
      "body": [
        "Check that you are looking at the intended day and weather location. Read the forecast only for periods actually supplied; a calendar appointment can exist beyond the available forecast horizon. Missing weather is not a forecast of clear conditions.",
        "If you create an event from a weather hour, review its start, end, destination calendar and location before saving. In the current source this flow proposes a one-hour event and the default new-event calendar. Those draft values are conveniences, not a reservation or a complete travel plan."
      ]
    },
    {
      "heading": "Recheck with a purpose and communicate the result",
      "body": [
        "Choose a review time that still leaves room to act under your booking’s conditions. At that point, compare the latest relevant forecast with the plan and any applicable official or venue guidance. Repeated refreshing without an available decision does not create certainty.",
        "If the plan changes, edit the correct event or recurrence scope and check the saved result. Confirm important changes directly with the people involved. A calendar alert, a changed forecast and a message received by a participant are three different outcomes."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Check the venue, date, time zone and the forecast period.",
    "Read probability separately from amount, timing and other available weather fields.",
    "Use the provider’s definitions; do not infer confidence from an icon alone.",
    "Agree the fallback, decision owner and deadline for your actual activity.",
    "Review the event’s calendar, start, end and location before saving a change.",
    "Recheck at the agreed time and confirm important changes with participants."
  ],
  "faq": [
    {
      "q": "Does a rain percentage tell me how long my event will be wet?",
      "a": "No. Read what event, place and period the provider defines. A percentage alone does not supply the duration, amount or the conditions at every moment."
    },
    {
      "q": "Does Cloud Calendars show all ensemble model runs?",
      "a": "This guide does not claim an ensemble comparison interface. Use the weather values actually available for the selected place and period; do not infer hidden model confidence from an icon."
    },
    {
      "q": "Can I use weather for every future calendar appointment?",
      "a": "A calendar can hold dates beyond the available forecast horizon. Check whether the relevant period has weather data and arrange a later review when it does not."
    }
  ],
  "seeAlso": [
    "reading-a-chance-of-rain",
    "a-fourteen-day-view-of-the-weather",
    "weather-where-the-event-is",
    "the-commute-and-the-sky"
  ],
  "sources": [
    {
      "label": "Met Office: What is an ensemble forecast?",
      "url": "https://www.metoffice.gov.uk/research/weather/ensemble-forecasting/what-is-an-ensemble-forecast"
    },
    {
      "label": "Met Office: Using ensemble forecasts in decision-making",
      "url": "https://www.metoffice.gov.uk/research/weather/ensemble-forecasting/decision-making"
    }
  ],
  "updated": "2026-10-22"
},

  'reading-a-chance-of-rain': {
  "title": "Chance of rain or rainfall amount? Read 0.3 inches in context",
  "short": "Reading a chance of rain",
  "description": "Separate rain probability, accumulation and hourly rate. Understand 0.3 inches of rain, compare your event’s hours and avoid a universal cancellation threshold.",
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
      "heading": "Is 0.3 inches of rain a lot? First ask over how long",
      "body": [
        "An amount of 0.3 inches is 7.62 millimetres. That depth does not say when the rain falls. If distributed evenly over twenty-four hours, its arithmetic average is about 0.0125 inches per hour; if it falls in one hour, the average rate is 0.3 inches per hour. Those are illustrative calculations, not predictions of a steady rate.",
        "The National Weather Service’s Rain Rate Visualizer presents hourly-rate examples and explains how its sample rates were calculated from ten-minute accumulation windows. It illustrates why a rate must keep its time unit. A daily total alone cannot tell you the heaviest short burst or whether your appointment’s two hours are dry.",
        "For “how much rain is a lot in a day?”, there is no single number that decides every activity or location. Compare the hourly timing, expected amount and relevant local guidance. Keep a covered alternative where practical. Treat official warnings separately from a personal comfort threshold; a small daily total is not a universal assurance about conditions."
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
    },
    {
      "q": "Is 0.3 inches of rain the same as a 30% chance of rain?",
      "a": "No. The first is an amount, equal to 7.62 millimetres; the second is a probability for a stated place and period. Neither specifies the other."
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
    },
    {
      "label": "National Weather Service: hourly rain-rate examples and calculation windows",
      "url": "https://www.weather.gov/lox/rainrate"
    }
  ],
  "seeAlso": [
    "what-a-forecast-can-and-cannot-tell-you",
    "weather-where-the-event-is",
    "planning-outdoors-without-being-rained-on"
  ],
  "updated": "2026-10-23"
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
  "updated": "2026-10-22",
  "title": "Plan travel around calendar events: route time, weather and arrival",
  "short": "Plan the journey as well as the meeting",
  "description": "Compare journey times, forecast places and arrival requirements before a calendar event. Keep departure blocks, alerts and the meeting’s real start distinct.",
  "lede": "A meeting time and the time you need to leave are different parts of the plan. Check the journey you actually intend to make instead of assuming that the day’s weather icon or a familiar travel duration covers it. This guide is published by Arte Soft, the developer of Cloud Calendars.",
  "commonBelief": "Moving departure by twenty minutes usually avoids the rain, and a saved meeting already accounts for the whole journey.",
  "sections": [
    {
      "heading": "Keep departure, arrival and the event start distinct",
      "body": [
        "Write down the actual venue and the time you need to be there. An appointment starting at 09:00 may require arrival earlier for access or preparation. Keep the meeting at its agreed time rather than moving it earlier to represent your departure.",
        "For example, an organiser may ask you to arrive before a workshop opens. Record the real arrival requirement and estimate the journey separately. If you add a departure entry, label it clearly and choose who needs to see it; it is not a second workshop invitation."
      ]
    },
    {
      "heading": "Estimate the route for the intended time",
      "body": [
        "Use a navigation or transport service appropriate to the route and travel mode. Apple Maps documents future driving estimates through its Leave at or Arrive by choices and notes that the estimate can change with predicted traffic. Those are Maps controls, not proof that every calendar calculates the same journey.",
        "Check the start and destination rather than assuming your current location or a similarly named venue is correct. Include the real access, walking or preparation requirements that matter to your arrangement. A route estimate is not a guarantee of arrival at a particular minute."
      ]
    },
    {
      "heading": "Compare forecast locations and periods",
      "body": [
        "Inspect the forecast place and the hours covering departure, arrival and a relevant return journey. A destination forecast is not a measurement at every point along a route, and weather near home can differ from conditions where the event takes place.",
        "The Met Office explains that some forecast fields describe an instant while precipitation chance and gusts describe a period. Use the definitions of the provider you are viewing. A change between two displayed hours does not identify an exact rain-free twenty-minute interval."
      ]
    },
    {
      "heading": "Use available alternatives without inventing a weather rule",
      "body": [
        "If the appointment allows a different departure or a remote alternative, compare the practical choices and confirm one with the organiser. Do not change a booked arrival or another person’s meeting solely because one forecast number looks smaller.",
        "Check relevant local warnings and transport or venue information when conditions may affect the journey. The calendar does not certify route conditions. This guide does not supply a universal rain, wind or visibility threshold for deciding whether to travel."
      ]
    },
    {
      "heading": "Inspect the saved calendar and any departure reminder",
      "body": [
        "In Cloud Calendars, check the event’s destination calendar, exact date and time zone before saving. If creating an event from a forecast hour, inspect the resulting draft: the chosen weather hour is not automatically your travel time, a suitable duration or confirmation of the venue.",
        "If your installed editor offers Travel Time or a departure reminder, review that control separately from the ordinary event alert. Check the saved settings and notification permission rather than assuming a location or time block guarantees a delivered warning. A personal departure entry need not be shared with everyone attending the meeting."
      ]
    },
    {
      "heading": "Recheck before leaving and communicate a changed arrangement",
      "body": [
        "Review current route and weather information before the journey, particularly if you planned it earlier in the week. An appointment may be within the calendar’s range but outside the forecast data available when you first created it.",
        "If the arrival arrangement changes, tell the relevant person and get the confirmation you need. Updating your personal departure block does not notify every participant or change their invitation. Keep the original event clear while recording a new agreed start or location."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identify the actual venue and required arrival time.",
    "Check a route estimate for the intended date, time and travel mode.",
    "Compare relevant forecast places and available hours.",
    "Consult current transport, venue and official warning information where relevant.",
    "Verify calendar destination, local time, duration and any reminder separately.",
    "Recheck before departure and confirm changes with the organiser."
  ],
  "faq": [
    {
      "q": "Will leaving twenty minutes later avoid a shower?",
      "a": "There is no general guarantee. Forecast fields describe particular places and periods; compare current information and the constraints of the journey."
    },
    {
      "q": "Should the calendar meeting start at my departure time?",
      "a": "Keep the meeting’s real start. Use a clearly labelled personal departure block or an available reminder control when that helps your plan."
    },
    {
      "q": "Does weather for the destination describe the whole route?",
      "a": "No. Check the relevant locations and current transport information. One selected-place forecast is not route-wide observation."
    }
  ],
  "sourcesHeading": "Official guidance and further reading",
  "sources": [
    {
      "label": "Apple: future departure or arrival estimates in Maps",
      "url": "https://support.apple.com/guide/iphone/get-driving-directions-ipha84a94043/ios"
    },
    {
      "label": "Met Office: forecast times, precipitation and gust periods",
      "url": "https://weather.metoffice.gov.uk/guides/what-does-this-forecast-mean"
    }
  ],
  "seeAlso": [
    "weather-where-the-event-is",
    "reading-a-chance-of-rain",
    "calendar-notifications-missing-silent-or-duplicated",
    "planning-a-week-in-ten-minutes"
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
