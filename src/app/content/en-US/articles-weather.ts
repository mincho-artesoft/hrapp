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
};
