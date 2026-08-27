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
    title: 'A calendar with the weather already in it',
    short: 'Weather inside your calendar',
    description:
      'Why checking two apps to plan one day is a design failure, and what a calendar looks like when the forecast is part of it rather than beside it.',
    lede: 'Almost everyone plans a day across two apps. The calendar says where you have to be; the weather app says what it will be like when you get there. Holding both in your head is the part nobody notices they are doing, until a Saturday gets rained on.',
    commonBelief:
      'That a calendar is for commitments and a weather app is for weather, and keeping them separate is simply how phones work.',
    sections: [
      {
        heading: 'The cost of two apps is not two taps',
        body: [
          'The tax is not the switching. It is that the two apps disagree about what matters. Your calendar knows Saturday has a two-hour block at eleven; your weather app knows it will rain from ten until one. Neither of them knows that those two facts, together, mean you should move the block.',
          'You are the integration layer. That works until you are busy, which is exactly when plans are worth protecting.',
        ],
      },
      {
        heading: 'What changes when the forecast is in the grid',
        body: [
          'Put the forecast behind the events and the conflict answers itself. A wet morning and a dry afternoon are visible in the same glance as the meeting you were going to schedule, and the decision takes no thought at all.',
          'This is not a widget bolted to the side. Each day in the week and month views carries its own conditions, and each event carries the forecast for the hours it actually occupies — not the daily summary, which averages away the only part you needed.',
        ],
      },
      {
        heading: 'The honest limit',
        body: [
          'A forecast fourteen days out is a shape, not a promise. It is genuinely useful for choosing between a Tuesday and a Thursday, and close to useless for deciding whether to bring a coat a fortnight from now.',
          'The app shows the full horizon because choosing a date is a real job. It does not dress up day twelve as though it were tomorrow.',
        ],
      },
    ],
    claims: {
      forecastDays: 'Days of forecast, in the calendar and beside each event',
      views: 'Views that carry weather: Day, Week, Month, Year and List',
      price: 'Cost of the weather features, in pounds, dollars or euros',
    },
    practical: [
      'Open the week view and look at the band behind the days before you schedule anything outdoors.',
      'Tap an event to see the forecast for its hours rather than for its day.',
      'When something is weather-dependent, schedule it against the fourteen-day view first and refine it two days out.',
      'Treat anything past about day seven as a shape, not a plan.',
    ],
    seeAlso: ['forecast-beside-every-event', 'a-fourteen-day-view-of-the-weather'],
  },

  'forecast-beside-every-event': {
    title: 'The forecast beside every event, not just the day',
    short: 'Forecast beside every event',
    description:
      'A daily summary averages away the hours you care about. What per-event weather looks like, and why the difference matters for anything scheduled outdoors.',
    lede: 'Most calendars that mention weather show one icon per day. That icon is an average, and an average of a wet morning and a dry afternoon is a drizzle that never happens.',
    commonBelief:
      'That a daily weather icon on a calendar is the same feature as a forecast attached to an event.',
    sections: [
      {
        heading: 'What a daily icon hides',
        body: [
          "Take a day that rains hard until eleven and stays clear afterwards. The daily summary picks something in the middle and shows a cloud. You look at your two o'clock, see the cloud, and move a walk that never needed moving.",
          'The error runs both ways. A day that is fine except for a violent hour at six shows as fine, and the one event that mattered is the one that gets caught.',
        ],
      },
      {
        heading: 'Attaching the forecast to the hours',
        body: [
          'An event occupies specific hours. The forecast for those hours is a different number from the forecast for its day, and it is the only one that answers the question you are actually asking.',
          'Open an event and the conditions shown are the ones for its window. A three-hour block gets the three hours, not the twenty-four.',
        ],
      },
    ],
    claims: {
      forecastDays: 'Days ahead an event can carry a forecast',
    },
    practical: [
      'Check the event, not the day, whenever the plan depends on the weather.',
      'For anything longer than a couple of hours, look at how the conditions move across the block rather than at a single figure.',
      'Move the event before you cancel it — an hour either way is often the whole difference.',
    ],
    seeAlso: ['weather-inside-your-calendar', 'planning-outdoors-without-being-rained-on'],
  },

  'a-fourteen-day-view-of-the-weather': {
    title: 'Fourteen days of forecast, and what each half of it is good for',
    short: 'A fourteen-day view',
    description:
      'The far end of a long forecast is not a prediction. It is still the most useful thing you have when picking a date, and here is how to read it.',
    lede: "People ask for a ten-day forecast and then complain that day ten was wrong. Both halves of that are fair. A long forecast answers a different question from tomorrow's, and it answers it well.",
    commonBelief:
      'That a fourteen-day forecast is a fourteen-day promise, and being wrong on day twelve makes the whole thing useless.',
    sections: [
      {
        heading: 'What the first week is for',
        body: [
          'Inside about seven days a forecast is specific enough to act on. It will tell you which afternoon is dry, roughly when rain arrives, and whether it is worth moving something by an hour.',
          'This is the range where cancelling, moving and packing decisions belong.',
        ],
      },
      {
        heading: 'What the second week is for',
        body: [
          'Past a week the detail goes but the shape remains. You are no longer being told whether it will rain at three; you are being told that one end of next week looks settled and the other does not.',
          'That is exactly what you need when choosing between two candidate dates, which is the most common weather decision anybody actually makes.',
        ],
      },
      {
        heading: 'Reading it without being fooled',
        body: [
          'Watch how the far days change between checks. A day that keeps its shape across three days of updates is telling you something. A day that swings between sun and storms is telling you it does not know yet, which is also information.',
          'The app shows the whole horizon rather than truncating it, and does not present day twelve with more confidence than it has earned.',
        ],
      },
    ],
    claims: {
      forecastDays: 'Days the forecast covers',
    },
    practical: [
      'Use the second week to choose a date, not to decide what to wear.',
      'Re-check a weather-dependent plan about two days out, when the detail arrives.',
      "If the far end keeps changing between checks, treat it as unsettled rather than as whatever today's version says.",
    ],
    seeAlso: ['weather-inside-your-calendar', 'what-a-forecast-can-and-cannot-tell-you'],
  },

  'planning-outdoors-without-being-rained-on': {
    title: 'Planning outdoor things without getting rained on',
    short: 'Planning outdoors',
    description:
      'A practical method for scheduling anything that happens outside, using the calendar you already keep rather than a separate weather routine.',
    lede: 'If your hobbies happen outdoors you have probably built a private ritual: check the weather, squint at the week, guess. The guessing is the part that can go.',
    commonBelief: 'That avoiding bad weather means checking the forecast more often.',
    sections: [
      {
        heading: 'Checking more is not the answer',
        body: [
          'Opening a weather app five times does not improve the forecast; it improves your anxiety. What changes outcomes is looking at the forecast at the moment you are choosing a time, which is a different moment entirely.',
          'That moment happens in the calendar. If the weather is not there, you are making the decision without it and correcting later.',
        ],
      },
      {
        heading: 'Choose the slot against the week',
        body: [
          'Look at the week with the conditions behind it and the choice usually makes itself. Two candidate afternoons, one dry — there is nothing to deliberate about.',
          'The habit worth building is small: before you place anything outdoors, look at the band, not at a separate app.',
        ],
      },
      {
        heading: 'Then check the hours, not the day',
        body: [
          'Once the event exists, its own forecast is the one that matters. A day can be wet and your two hours dry, and the daily summary will never tell you that.',
          'Move before you cancel. An hour in either direction rescues more plans than any amount of re-checking.',
        ],
      },
    ],
    claims: {
      forecastDays: 'Days ahead you can place a plan against',
    },
    practical: [
      'Place outdoor events from the week view, with conditions visible.',
      "Two days out, check the event's own hours rather than its day.",
      'Shift by an hour before abandoning the plan.',
      'For anything more than a week away, pick the day and accept you will refine it later.',
    ],
    seeAlso: ['forecast-beside-every-event', 'a-fourteen-day-view-of-the-weather'],
  },

  'what-a-forecast-can-and-cannot-tell-you': {
    title: 'What a forecast can and cannot tell you',
    short: 'What a forecast can tell you',
    description:
      'Forecasts are probabilistic, and reading them as promises is why they feel unreliable. A short guide to what the numbers actually mean.',
    lede: 'Weather forecasts are not wrong nearly as often as they feel wrong. Most of the gap is a mismatch between what they say and what people hear.',
    commonBelief: 'That a forecast is a statement about what will happen.',
    sections: [
      {
        heading: 'It is a distribution, not a plan',
        body: [
          'A forecast is the output of many model runs that disagree with each other. What you are shown is roughly where they cluster. When they cluster tightly, the forecast is confident; when they scatter, it is not — and the icon looks the same either way.',
          "This is why two forecasts that were both 'right' can feel different: one had no real competition, the other was a coin toss that landed.",
        ],
      },
      {
        heading: 'Where it is strong',
        body: [
          'Temperature is reliable further out than precipitation. Whether tomorrow is warm is a much easier question than whether it rains at four, and the difference is not small.',
          'Timing of a front is usually better than intensity. You can often trust that rain arrives in the afternoon while not trusting how much falls.',
        ],
      },
      {
        heading: 'Where it is weak',
        body: [
          'Anything convective — summer thunderstorms, sharp showers — is guesswork about placement. The model may be certain that storms happen in the region and unable to say whether one crosses your park.',
          'Mountains, coasts and cities all bend the local picture in ways a grid forecast smooths away.',
        ],
      },
    ],
    claims: {
      forecastDays: 'Days shown, though confidence falls long before the last one',
    },
    practical: [
      'Trust temperature further out than rain.',
      'Treat a chance of showers as a chance, not a schedule.',
      'For convective weather, check again on the morning; nothing earlier will settle it.',
      'If a plan cannot survive being wrong, build the fallback rather than refreshing the forecast.',
    ],
    seeAlso: ['reading-a-chance-of-rain', 'a-fourteen-day-view-of-the-weather'],
  },

  'reading-a-chance-of-rain': {
    title: 'What a forty per cent chance of rain actually means',
    short: 'Reading a chance of rain',
    description:
      'The single most misread number in any forecast, explained — and what to do with it when you are deciding whether to move an event.',
    lede: 'Almost nobody reads probability of precipitation the way it is meant. The number is not how much rain, and it is not how long.',
    commonBelief: 'That forty per cent means light rain, or rain for part of the day.',
    sections: [
      {
        heading: 'What the number is',
        body: [
          'It is the probability that measurable rain falls at a given point in the forecast area during the period. Forty per cent means: in four out of ten runs of this situation, the spot you are standing on gets wet.',
          'It says nothing about how hard, and nothing about for how long. A forty per cent day can be a five-minute shower or an afternoon of it.',
        ],
      },
      {
        heading: 'Why it feels wrong so often',
        body: [
          "Because people grade it as a yes or a no. Stay dry on a forty per cent day and the forecast 'was wrong'; get soaked and it 'was right'. Neither is true — the number was a bet, and bets lose six times in ten.",
          'Over a season a well-calibrated forty per cent rains about forty per cent of the time, which is exactly the point and is invisible from any single day.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Read it as odds, not as intensity.',
      'Under about thirty per cent, plan normally and carry a contingency.',
      'Above about sixty, plan for rain and be pleasantly surprised.',
      'Between the two, look at the hours rather than the day — that is where the answer usually is.',
    ],
    seeAlso: ['what-a-forecast-can-and-cannot-tell-you'],
  },

  'weather-where-the-event-is': {
    title: 'The weather where the event is, not where you are',
    short: 'Weather at the location',
    description:
      'Your phone knows where you are. Your event knows where it is going to be. For anything more than a few miles away, those are different forecasts.',
    lede: 'A forecast pinned to your current location is the right answer for right now and the wrong answer for a match forty miles away.',
    commonBelief: 'That one local forecast covers everything in your day.',
    sections: [
      {
        heading: 'Distance changes the answer faster than people expect',
        body: [
          'Rain bands are not uniform. Twenty miles inland can be dry while the coast is not; a valley and the ridge above it disagree routinely. For a commute this is noise. For a fixture, a hike or a site visit it is the whole question.',
          'The event carries a place. Using it is simply using information you already gave the calendar.',
        ],
      },
      {
        heading: 'What this fixes in practice',
        body: [
          'The classic failure is packing for home weather and arriving somewhere else. It is not a forecasting error at all — the forecast was right about the wrong place.',
          'When an event has a location, its conditions should follow the location rather than the phone.',
        ],
      },
    ],
    claims: {
      forecastDays: 'Days ahead a located event can be checked',
    },
    practical: [
      'Put a real location on events that happen somewhere else.',
      'For travel days, check the destination rather than the origin.',
      'If the location is vague, the forecast is vague too — a postcode beats a place name.',
    ],
    seeAlso: ['forecast-beside-every-event', 'time-zones-and-the-flight-you-booked'],
  },

  'the-commute-and-the-sky': {
    title: 'The two half-hours of your day that the weather actually ruins',
    short: 'The commute and the sky',
    description:
      'Most weather disruption is not the day, it is the two commutes. A small habit that catches nearly all of it.',
    lede: 'Ask people when weather last inconvenienced them and they will mostly describe a journey, not an afternoon.',
    commonBelief: 'That a wet day is a wet day, and there is nothing to be done about it.',
    sections: [
      {
        heading: 'The exposure is narrow',
        body: [
          'For most people the genuinely weather-exposed part of a working day is two short journeys. Everything between them happens indoors.',
          'That makes the problem far smaller than it feels, and far more tractable: you are not trying to predict a day, only two half-hours.',
        ],
      },
      {
        heading: 'Which changes what you check',
        body: [
          'The useful question is not whether it rains today but whether it rains at eight and at six. Those are two specific hours, and hourly detail answers them well inside the range where forecasts are strong.',
          'Shifting a departure by twenty minutes is often the entire fix, and it is only visible if you looked at the hours.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Check the two commute hours rather than the day.',
      'Twenty minutes earlier or later is usually enough to miss a shower.',
      'If both ends look wet, that is the day to take the bag rather than the bike.',
    ],
    seeAlso: ['forecast-beside-every-event'],
  },

  'daylight-as-a-planning-constraint': {
    title: 'Daylight is a constraint, and calendars usually ignore it',
    short: 'Daylight and planning',
    description:
      'Sunset moves by minutes a day and by hours across a season. For anything outdoors it binds harder than the weather does.',
    lede: 'Weather is uncertain. Daylight is not, and yet most plans are made as though only the first one existed.',
    commonBelief: 'That the light will hold because it held last week.',
    sections: [
      {
        heading: 'The number moves faster than intuition',
        body: [
          'Around the equinoxes sunset shifts by two to three minutes a day at mid-latitudes. Over a fortnight that is half an hour, which is the difference between finishing in light and finishing by phone torch.',
          'In late autumn the change is sharpest exactly when people are still scheduling as though it were September.',
        ],
      },
      {
        heading: 'Use it as a hard edge',
        body: [
          'Unlike rain, sunset is certain. It is the one planning input that never surprises you, and it deserves to be treated as a wall rather than a suggestion.',
          'Work backwards from it: a two-hour activity that must finish in daylight has a latest start, and that start moves every week.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Work backwards from sunset for anything outdoors, not forwards from the free slot.',
      'Re-check the latest safe start every couple of weeks in spring and autumn.',
      'In the fortnight after the clocks change, assume your instincts are an hour wrong.',
    ],
    seeAlso: ['planning-outdoors-without-being-rained-on'],
  },

  'wind-the-forecast-nobody-reads': {
    title: 'Wind is the forecast nobody reads and half of them needed',
    short: 'Wind, the ignored forecast',
    description:
      'Cycling, sailing, paddling, drone flying, gardening, anything with a gazebo. For a lot of plans wind decides the day and rain does not.',
    lede: 'People check rain out of habit. For a surprising number of activities, wind is the number that actually determines whether the thing happens.',
    commonBelief: 'That wind is a detail and rain is the headline.',
    sections: [
      {
        heading: 'Where wind is the binding constraint',
        body: [
          'A dry day at thirty knots cancels more plans than a damp one at five. Cyclists, sailors, paddlers, anyone putting up a marquee, anyone flying anything — for all of them the rain line is secondary.',
          'It is also the number people are worst at estimating from a window, because a sheltered street tells you very little about an exposed route.',
        ],
      },
      {
        heading: 'Direction matters as much as speed',
        body: [
          'The same speed is a different day depending on where it comes from. An offshore wind flattens water and pushes you out; onshore does the opposite. A headwind out is a tailwind home, which changes how far you plan to go.',
          'Gust figures matter more than averages for anything with a sail or a canopy: the average holds the tent up, the gust takes it away.',
        ],
      },
    ],
    claims: {},
    practical: [
      'For wind-sensitive plans, check speed and direction, not just the icon.',
      'Read the gusts, not the mean, for anything that can be lifted.',
      'Plan the outbound leg into the wind so the tired leg is the easy one.',
    ],
    seeAlso: ['planning-outdoors-without-being-rained-on', 'weather-where-the-event-is'],
  },
};
