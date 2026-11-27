import { bookingMinutes, civilDayStart, dailyBookingRule, type BookingDailyPattern } from '../../../../backend/src/booking/booking-daily-pattern';
import { RRule, Weekday } from "rrule";
import type { WebCalendarEvent } from "./calendar-platform-api.service";

// Like AppLocalRecurrence on Mac: expand for display, never persist generated copies.
export type CalendarOccurrence = WebCalendarEvent & {
  occurrenceOf?: string;
  masterStart?: string;
  masterEnd?: string;
};
/** Use the canonical series for sharing/editing; display occurrences are not new events. */
export function calendarSeries(event: CalendarOccurrence): WebCalendarEvent {
  if (!event.occurrenceOf) return event;
  const { occurrenceOf, masterStart, masterEnd, ...values } = event;
  return {
    ...values,
    id: occurrenceOf,
    start: masterStart ?? event.start,
    end: masterEnd ?? event.end,
  };
}

const dayMs = 86400000;
const wallFormatters = new Map<string, Intl.DateTimeFormat>();
function wallFormatter(timeZone: string) {
  const cached = wallFormatters.get(timeZone);
  if (cached) return cached;
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  if (wallFormatters.size >= 64) wallFormatters.clear();
  wallFormatters.set(timeZone, formatter);
  return formatter;
}
export function wallDate(date: Date, timeZone: string): Date {
  const parts = wallFormatter(timeZone).formatToParts(date);
  const n = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return new Date(
    Date.UTC(
      n("year"),
      n("month") - 1,
      n("day"),
      n("hour"),
      n("minute"),
      n("second"),
      date.getUTCMilliseconds(),
    ),
  );
}
export function instant(wall: Date, timeZone: string): Date | null {
  let result = wall.getTime();
  for (let i = 0; i < 4; i++) {
    const difference =
      wall.getTime() - wallDate(new Date(result), timeZone).getTime();
    if (!difference) return new Date(result);
    result += difference;
  }
  return null; // No such wall time during a spring-forward gap.
}
export function calendarDayStart(local: Date, zone: string): Date {
  if (!Number.isFinite(+local)) return new Date(NaN);
  return new Date(civilDayStart(+local, t => instant(new Date(t),zone)?.getTime() ?? NaN,
    t => +wallDate(new Date(t),zone)));
}
export function calendarOccurrences(
  event: WebCalendarEvent,
  lower: Date,
  upper: Date,
  hoursOfDay?: number[],
  pattern?: BookingDailyPattern,
): CalendarOccurrence[] {
  const rules = event.details?.recurrenceRules as any[] | undefined;
  if (!rules?.length) return [event];
  const start = new Date(event.start),
    end = new Date(event.end),
    duration = end.getTime() - start.getTime();
  if (!Number.isFinite(duration) || duration < 0) return [];
  let zone =
    event.details?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  try {
    wallDate(start, zone);
  } catch {
    zone = "UTC";
  }
  const wallStart = wallDate(start, zone),
    wallEnd = wallDate(end, zone),
    dates = new Map<number, Date>([[start.getTime(), start]]);
  const minutes = pattern ? bookingMinutes(pattern, duration / 60000) : undefined;
  if (pattern) dates.clear();
  for (const rule of rules) {
    const frequency =
      typeof rule.frequency === "number"
        ? rule.frequency
        : ["daily", "weekly", "monthly", "yearly"].indexOf(rule.frequency);
    if (frequency < 0 || frequency > 3) continue;
    const weekdays = rule.daysOfTheWeek?.map((d: any) => {
      const weekday = new Weekday((d.weekday + 5) % 7);
      return d.weekNumber ? weekday.nth(d.weekNumber) : weekday;
    });
    try {
      const width = hoursOfDay?.length ?? 1;
      const positions = rule.setPositions?.flatMap((p: number) =>
        Array.from({length: width}, (_, i) => p > 0 ? (p - 1) * width + i + 1 : p * width + i));
      const dateRule = new RRule({
        freq: [RRule.DAILY, RRule.WEEKLY, RRule.MONTHLY, RRule.YEARLY][
          frequency
        ],
        dtstart: (pattern || event.allDay) ? new Date(Math.floor(+wallStart/dayMs)*dayMs) : wallStart,
        interval: Math.max(1, rule.interval || 1),
        count: !pattern && rule.occurrenceCount > 0 ? rule.occurrenceCount : undefined,
        until: rule.endDate
          ? wallDate(new Date(rule.endDate), zone)
          : undefined,
        byweekday: weekdays?.length ? weekdays : undefined,
        bymonthday: rule.daysOfTheMonth?.length
          ? rule.daysOfTheMonth
          : undefined,
        bymonth: rule.monthsOfTheYear?.length
          ? rule.monthsOfTheYear
          : undefined,
        byyearday: rule.daysOfTheYear?.length ? rule.daysOfTheYear : undefined,
        byweekno: rule.weeksOfTheYear?.length ? rule.weeksOfTheYear : undefined,
        bysetpos: positions?.length ? positions : undefined,
        byhour: hoursOfDay,
        wkst: RRule.MO,
      });
      const recurrence = minutes ? dailyBookingRule(dateRule,minutes,+wallStart,
        rule.endDate ? +wallDate(new Date(rule.endDate),zone) : undefined,rule.occurrenceCount) : dateRule;
      const from = wallDate(new Date(lower.getTime() - duration - dayMs), zone),
        to = wallDate(new Date(upper.getTime() + dayMs), zone);
      for (const wall of recurrence.between(
        from,
        to,
        true,
        (_, i) => i < 10000,
      )) {
        const date = event.allDay ? calendarDayStart(wall,zone) :
          (hoursOfDay || pattern) && +wall === +wallStart ? start : instant(wall, zone);
        if (date) dates.set(date.getTime(), date);
      }
    } catch {
      /* An unknown imported recurrence leaves its original event visible. */
    }
  }
  const excluded = new Set(event.details?.excludedStarts?.map(value => Date.parse(value)));
  return [...dates.values()]
    .filter(date => !excluded.has(+date))
    .sort((a, b) => a.getTime() - b.getTime())
    .flatMap((date) => {
      const occurrenceEnd = event.allDay
        ? calendarDayStart(new Date((Math.floor(+wallDate(date,zone)/dayMs) +
            Math.max(1, Math.floor(+wallEnd/dayMs) - Math.floor(+wallStart/dayMs)))*dayMs),zone)
        : new Date(date.getTime() + duration);
      if (!occurrenceEnd || date >= upper || occurrenceEnd <= lower) return [];
      return [
        {
          ...event,
          id:
            date.getTime() === start.getTime()
              ? event.id
              : `${event.id}@${date.getTime()}`,
          occurrenceOf: event.id,
          masterStart: event.start,
          masterEnd: event.end,
          start: date.toISOString(),
          end: occurrenceEnd.toISOString(),
        },
      ];
    });
}
