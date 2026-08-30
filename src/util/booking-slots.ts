// Calendly-style slot computation on top of a calendar.
//
// Availability is expressed in the owner's IANA timezone as minutes from local
// midnight, so a working day stays put across DST rather than sliding an hour.
// The Lambda runtime ships full ICU, so the conversion is done with Intl —
// no timezone library, and correct at the DST boundaries a naive offset misses.

/** Offset of `tz` from UTC, in minutes, at the instant `date`. */
export function offsetOf(tz: string, date: Date): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const p: any = Object.fromEntries(dtf.formatToParts(date).map((x) => [x.type, x.value]));
  const asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second);
  return (asUTC - date.getTime()) / 60000;
}

/** The UTC instant for a wall-clock time (minutes from midnight) on y-m-d in tz. */
export function zonedTimeToUtc(y: number, m: number, d: number, minutes: number, tz: string): Date {
  const hh = Math.floor(minutes / 60);
  const mm = minutes % 60;
  let utc = Date.UTC(y, m - 1, d, hh, mm);
  const off1 = offsetOf(tz, new Date(utc));
  utc -= off1 * 60000;
  // One correction handles the DST edge where the guessed offset was wrong.
  const off2 = offsetOf(tz, new Date(utc));
  if (off2 !== off1) utc += (off1 - off2) * 60000;
  return new Date(utc);
}

/** Local calendar fields (year/month/day/weekday) of `date` in tz. */
export function zonedParts(tz: string, date: Date): { year: number; month: number; day: number; weekday: number } {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, weekday: 'short',
    year: 'numeric', month: '2-digit', day: '2-digit',
  });
  const p: any = Object.fromEntries(dtf.formatToParts(date).map((x) => [x.type, x.value]));
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday);
  return { year: +p.year, month: +p.month, day: +p.day, weekday };
}

/** Deterministic, S3-safe key for one bookable slot. */
export function slotKey(typeId: string, startISO: string): string {
  return `${typeId}_${startISO.replace(/[:.]/g, '')}`;
}

const DAY_MS = 86400_000;
const overlaps = (aS: number, aE: number, bS: number, bE: number) => aS < bE && bS < aE;

/**
 * Free slots for one meeting type between two dates (inclusive), in UTC.
 *
 * A slot is offered only if it sits inside a working window, is far enough in
 * the future (`minNoticeHours`) and near enough (`maxAdvanceDays`), does not
 * overlap a busy event, and has not already been booked. `bookedKeys` is the
 * set of slot keys already claimed — checked here so a claimed slot never even
 * appears, separate from the atomic claim that settles a genuine race.
 */
export function computeSlots(
  config: any,
  meetingType: any,
  busyIntervals: [number, number][],
  bookedKeys: Set<string>,
  opts: any = {},
): { start: string; end: string }[] {
  const tz = config.timeZone || 'UTC';
  const duration = meetingType.durationMinutes;
  const interval = config.slotIntervalMinutes || 30;
  const buffer = config.bufferMinutes || 0;
  const now = opts.now ?? new Date();
  const earliest = now.getTime() + (config.minNoticeHours ?? 0) * 3600_000;
  const latest = now.getTime() + (config.maxAdvanceDays ?? 60) * DAY_MS;

  const byDay = new Map<number, any[]>();
  for (const rule of config.availability ?? []) {
    if (!byDay.has(rule.day)) byDay.set(rule.day, []);
    byDay.get(rule.day).push(rule);
  }

  const days: { year: number; month: number; day: number; weekday: number }[] = [];
  const from = new Date(`${opts.from}T00:00:00Z`);
  const to = new Date(`${opts.to}T00:00:00Z`);
  for (let t = from.getTime(); t <= to.getTime(); t += DAY_MS) {
    days.push(zonedParts(tz, new Date(t + 12 * 3600_000))); // noon avoids DST edges
  }

  const out: { start: string; end: string }[] = [];
  const seen = new Set<string>();
  for (const { year, month, day, weekday } of days) {
    for (const rule of byDay.get(weekday) ?? []) {
      for (let m = rule.start; m + duration <= rule.end; m += interval) {
        const start = zonedTimeToUtc(year, month, day, m, tz);
        const startMs = start.getTime();
        const key = start.toISOString();
        if (seen.has(key)) continue;
        if (startMs < earliest || startMs > latest) continue;
        const endMs = startMs + duration * 60000;
        const busy = busyIntervals.some(([bS, bE]) =>
          overlaps(startMs - buffer * 60000, endMs + buffer * 60000, bS, bE));
        if (busy) continue;
        if (bookedKeys.has(slotKey(meetingType.id, key))) continue;
        seen.add(key);
        out.push({ start: key, end: new Date(endMs).toISOString() });
      }
    }
  }
  out.sort((a, b) => (new Date(a.start) as any) - (new Date(b.start) as any));
  return out;
}
