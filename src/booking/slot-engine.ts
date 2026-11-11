/**
 * DST-safe availability slot calculation, recurring event expansion, and RFC 5545
 * external ICS busy-interval parsing for Cloud Calendars Web Scheduling.
 */

export interface TimeWindow {
  /** Minutes from local midnight, 0..1440 (e.g. 540 = 09:00, 1020 = 17:00). */
  start: number;
  end: number;
}

export interface MeetingTypeConfig {
  id: string;
  slug: string;
  name: string;
  durationMinutes: number;
  color: string;
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
  locationKind: 'google_meet' | 'microsoft_teams' | 'zoom' | 'phone' | 'in_person' | 'custom';
  locationValue: string;
  description: string;
  active: boolean;
}

export interface BookingScheduleConfig {
  enabled: boolean;
  disabledByAdmin?: boolean;
  handle: string;
  displayName: string;
  headline: string;
  bio: string;
  avatarColor: string;
  timeZone: string;
  slotIntervalMinutes: number;
  minNoticeMinutes: number;
  maxAdvanceDays: number;
  maxBookingsPerDay: number;
  requireEmailVerification: boolean;
  /** Keys '0' (Sunday) .. '6' (Saturday). */
  weekly: Record<string, TimeWindow[]>;
  /** Keys 'YYYY-MM-DD' -> custom windows (empty array = day off). */
  dateOverrides: Record<string, TimeWindow[]>;
  meetingTypes: MeetingTypeConfig[];
  updatedAt?: string;
}

export interface BusyInterval {
  startMs: number;
  endMs: number;
}

const VALID_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isValidTimeZone(tz: unknown): tz is string {
  if (typeof tz !== 'string' || !tz.trim() || tz.length > 128) return false;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz }).format(new Date());
    return true;
  } catch {
    return false;
  }
}

/** Formats a UTC timestamp into local wall-clock parts in `timeZone`. */
export function localPartsInZone(epochMs: number, timeZone: string): {
  year: number;
  month: number;
  day: number;
  weekday: number; // 0 = Sun .. 6 = Sat
  hour: number;
  minute: number;
  dateStr: string;
} {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
  const parts = dtf.formatToParts(new Date(epochMs));
  const map: Record<string, string> = {};
  for (const p of parts) {
    if (p.type !== 'literal') map[p.type] = p.value;
  }
  const year = Number(map.year);
  const month = Number(map.month);
  const day = Number(map.day);
  const hour = Number(map.hour) === 24 ? 0 : Number(map.hour);
  const minute = Number(map.minute);
  const wkMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };
  const weekday = wkMap[map.weekday] ?? 0;
  const dateStr = `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return { year, month, day, weekday, hour, minute, dateStr };
}

/**
 * Converts a local wall-clock `(YYYY-MM-DD, minutesFromMidnight)` in `timeZone`
 * into an exact UTC epoch millisecond timestamp. Returns `null` if that wall-clock
 * minute does not exist (e.g. skipped during a DST spring-forward transition).
 */
export function wallClockToUtcMs(
  dateStr: string,
  minutesFromMidnight: number,
  timeZone: string,
): number | null {
  const m = VALID_DATE_RE.exec(dateStr);
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  const targetDaysOffset = Math.floor(minutesFromMidnight / 1440);
  const remMinutes = ((minutesFromMidnight % 1440) + 1440) % 1440;
  const targetHour = Math.floor(remMinutes / 60);
  const targetMinute = remMinutes % 60;

  const baseUtc = Date.UTC(year, month - 1, day + targetDaysOffset, targetHour, targetMinute, 0, 0);
  const targetDateObj = new Date(Date.UTC(year, month - 1, day + targetDaysOffset));
  const expectedDateStr = targetDateObj.toISOString().slice(0, 10);

  // Iterative offset refinement handles all global UTC offsets (-12h .. +14h) and DST edges.
  let guess = baseUtc;
  for (let i = 0; i < 3; i += 1) {
    const actual = localPartsInZone(guess, timeZone);
    const actualAsUtc = Date.UTC(actual.year, actual.month - 1, actual.day, actual.hour, actual.minute, 0, 0);
    const diff = baseUtc - actualAsUtc;
    if (diff === 0) break;
    guess += diff;
  }

  const verified = localPartsInZone(guess, timeZone);
  if (
    verified.dateStr !== expectedDateStr ||
    verified.hour !== targetHour ||
    verified.minute !== targetMinute
  ) {
    // Non-existent local wall time during DST spring-forward gap.
    return null;
  }
  return guess;
}

/** Enumerates YYYY-MM-DD strings inclusively from `fromDate` to `toDate` (bounded to maxDays). */
export function enumerateDateStrings(fromDate: string, toDate: string, maxDays = 62): string[] {
  const m1 = VALID_DATE_RE.exec(fromDate);
  const m2 = VALID_DATE_RE.exec(toDate);
  if (!m1 || !m2) return [];
  const startUtc = Date.UTC(Number(m1[1]), Number(m1[2]) - 1, Number(m1[3]));
  const endUtc = Date.UTC(Number(m2[1]), Number(m2[2]) - 1, Number(m2[3]));
  if (endUtc < startUtc) return [];
  const out: string[] = [];
  for (let t = startUtc; t <= endUtc && out.length < maxDays; t += 86_400_000) {
    out.push(new Date(t).toISOString().slice(0, 10));
  }
  return out;
}

/** Expands a CloudCalendars stored event (including basic RRULEs) into busy intervals in [rangeStartMs, rangeEndMs]. */
export function expandEventBusyIntervals(
  event: any,
  rangeStartMs: number,
  rangeEndMs: number,
): BusyInterval[] {
  if (!event || event.status === 'cancelled') return [];
  // availability === 1 maps to EKEventAvailability.free (TRANSP:TRANSPARENT)
  if (event.details?.availability === 1) return [];

  const startMs = Date.parse(event.start);
  let endMs = Date.parse(event.end);
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs)) return [];
  if (endMs <= startMs) {
    endMs = event.allDay ? startMs + 86_400_000 : startMs + 1_800_000;
  }
  const durationMs = endMs - startMs;

  const rules = Array.isArray(event.details?.recurrenceRules) ? event.details.recurrenceRules : [];
  if (!rules.length) {
    if (endMs > rangeStartMs && startMs < rangeEndMs) {
      return [{ startMs, endMs }];
    }
    return [];
  }

  const rule = rules[0];
  const freq = Number(rule?.frequency); // 0=daily, 1=weekly, 2=monthly, 3=yearly
  const interval = Math.max(1, Number(rule?.interval) || 1);
  const ruleEndMs = rule?.endDate && Number.isFinite(Date.parse(rule.endDate))
    ? Date.parse(rule.endDate)
    : Infinity;
  const maxOccurrences = Number(rule?.occurrenceCount) > 0
    ? Math.min(Number(rule.occurrenceCount), 730)
    : 730;

  const out: BusyInterval[] = [];
  let count = 0;

  if (freq === 0) {
    // Daily
    const stepMs = interval * 86_400_000;
    for (let occ = startMs; occ <= Math.min(rangeEndMs, ruleEndMs) && count < maxOccurrences; occ += stepMs) {
      count += 1;
      if (occ + durationMs > rangeStartMs && occ < rangeEndMs) {
        out.push({ startMs: occ, endMs: occ + durationMs });
      }
    }
  } else if (freq === 1) {
    // Weekly (supports daysOfTheWeek with 1=Sun..7=Sat)
    const allowedDays = Array.isArray(rule.daysOfTheWeek) && rule.daysOfTheWeek.length
      ? new Set(rule.daysOfTheWeek.map((d: any) => (Number(d?.weekday) - 1 + 7) % 7))
      : new Set([new Date(startMs).getUTCDay()]);
    const originMidnight = Date.UTC(
      new Date(startMs).getUTCFullYear(),
      new Date(startMs).getUTCMonth(),
      new Date(startMs).getUTCDate(),
    );
    const timeOfDayMs = startMs - originMidnight;
    for (let dayOffset = 0; dayOffset < 400 && count < maxOccurrences; dayOffset += 1) {
      const dayMidnight = originMidnight + dayOffset * 86_400_000;
      if (dayMidnight > Math.min(rangeEndMs, ruleEndMs)) break;
      const weekIndex = Math.floor(dayOffset / 7);
      if (weekIndex % interval !== 0) continue;
      const dow = new Date(dayMidnight).getUTCDay();
      if (!allowedDays.has(dow)) continue;
      const occ = dayMidnight + timeOfDayMs;
      if (occ < startMs || occ > ruleEndMs) continue;
      count += 1;
      if (occ + durationMs > rangeStartMs && occ < rangeEndMs) {
        out.push({ startMs: occ, endMs: occ + durationMs });
      }
    }
  } else if (freq === 2 || freq === 3) {
    // Monthly / Yearly
    const base = new Date(startMs);
    for (let step = 0; step < 120 && count < maxOccurrences; step += 1) {
      const d = new Date(startMs);
      if (freq === 2) d.setUTCMonth(base.getUTCMonth() + step * interval);
      else d.setUTCFullYear(base.getUTCFullYear() + step * interval);
      const occ = d.getTime();
      if (occ > Math.min(rangeEndMs, ruleEndMs)) break;
      count += 1;
      if (occ + durationMs > rangeStartMs && occ < rangeEndMs) {
        out.push({ startMs: occ, endMs: occ + durationMs });
      }
    }
  } else if (endMs > rangeStartMs && startMs < rangeEndMs) {
    out.push({ startMs, endMs });
  }

  return out;
}

/** Computes available booking slots for `meetingType` across `[fromDate, toDate]` in host's schedule. */
export function computeAvailableSlots({
  config,
  meetingType,
  fromDate,
  toDate,
  busyIntervals,
  bookedCountByHostDay,
  nowMs = Date.now(),
}: {
  config: BookingScheduleConfig;
  meetingType: MeetingTypeConfig;
  fromDate: string;
  toDate: string;
  busyIntervals: BusyInterval[];
  bookedCountByHostDay?: Record<string, number>;
  nowMs?: number;
}): Array<{ start: string; end: string; hostDate: string }> {
  if (!config.enabled || config.disabledByAdmin || !meetingType.active) return [];

  const hostTz = isValidTimeZone(config.timeZone) ? config.timeZone : 'UTC';
  const durationMin = Math.max(5, Math.min(480, Number(meetingType.durationMinutes) || 30));
  const stepMin = Math.max(5, Math.min(240, Number(config.slotIntervalMinutes) || 15));
  const bufBeforeMs = Math.max(0, Number(meetingType.bufferBeforeMinutes) || 0) * 60_000;
  const bufAfterMs = Math.max(0, Number(meetingType.bufferAfterMinutes) || 0) * 60_000;
  const earliestStartMs = nowMs + Math.max(0, Number(config.minNoticeMinutes) || 0) * 60_000;
  const latestStartMs = nowMs + Math.max(1, Math.min(365, Number(config.maxAdvanceDays) || 60)) * 86_400_000;
  const maxPerDay = Number(config.maxBookingsPerDay) > 0 ? Number(config.maxBookingsPerDay) : 0;

  // Pad host dates by ±1 day around requested [fromDate, toDate] so timezone offsets never clip edges.
  const reqDates = enumerateDateStrings(fromDate, toDate, 45);
  if (!reqDates.length) return [];
  const firstParts = VALID_DATE_RE.exec(reqDates[0])!;
  const lastParts = VALID_DATE_RE.exec(reqDates[reqDates.length - 1])!;
  const paddedStart = new Date(Date.UTC(Number(firstParts[1]), Number(firstParts[2]) - 1, Number(firstParts[3]) - 1))
    .toISOString().slice(0, 10);
  const paddedEnd = new Date(Date.UTC(Number(lastParts[1]), Number(lastParts[2]) - 1, Number(lastParts[3]) + 1))
    .toISOString().slice(0, 10);
  const hostDates = enumerateDateStrings(paddedStart, paddedEnd, 50);

  // Sort busy intervals once for fast overlap checks.
  const sortedBusy = busyIntervals
    .filter((b) => Number.isFinite(b.startMs) && Number.isFinite(b.endMs) && b.endMs > b.startMs)
    .sort((a, b) => a.startMs - b.startMs);

  const slots: Array<{ start: string; end: string; hostDate: string }> = [];
  const seenStarts = new Set<number>();

  for (const hostDate of hostDates) {
    if (maxPerDay > 0 && (bookedCountByHostDay?.[hostDate] ?? 0) >= maxPerDay) {
      continue;
    }
    const middayUtc = wallClockToUtcMs(hostDate, 720, hostTz);
    if (middayUtc == null) continue;
    const weekday = localPartsInZone(middayUtc, hostTz).weekday;

    const windows: TimeWindow[] = Object.prototype.hasOwnProperty.call(config.dateOverrides ?? {}, hostDate)
      ? (config.dateOverrides[hostDate] ?? [])
      : (config.weekly?.[String(weekday)] ?? []);

    for (const win of windows) {
      const wStart = Math.max(0, Math.min(1440, Number(win.start) || 0));
      const wEnd = Math.max(0, Math.min(1440, Number(win.end) || 0));
      if (wEnd - wStart < durationMin) continue;

      for (let m = wStart; m + durationMin <= wEnd; m += stepMin) {
        const startMs = wallClockToUtcMs(hostDate, m, hostTz);
        const endMs = startMs != null ? startMs + durationMin * 60_000 : null;
        if (startMs == null || endMs == null) continue;
        if (startMs < earliestStartMs || startMs > latestStartMs) continue;
        if (seenStarts.has(startMs)) continue;

        const guardStart = startMs - bufBeforeMs;
        const guardEnd = endMs + bufAfterMs;
        let conflict = false;
        for (const b of sortedBusy) {
          if (b.startMs >= guardEnd) break;
          if (b.endMs > guardStart && b.startMs < guardEnd) {
            conflict = true;
            break;
          }
        }
        if (!conflict) {
          seenStarts.add(startMs);
          slots.push({
            start: new Date(startMs).toISOString(),
            end: new Date(endMs).toISOString(),
            hostDate,
          });
        }
      }
    }
  }

  return slots.sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
}

/** Deterministic 5-minute atomic S3 lock keys covering `[startMs, endMs)`. */
export function fiveMinuteBucketKeys(startMs: number, endMs: number): string[] {
  const bucketMs = 5 * 60_000;
  const first = Math.floor(startMs / bucketMs);
  const last = Math.max(first, Math.ceil(endMs / bucketMs) - 1);
  const out: string[] = [];
  // Cap to 288 buckets (24 hours) so malformed durations never explode S3 calls.
  for (let b = first; b <= last && out.length < 288; b += 1) {
    out.push(String(b));
  }
  return out;
}

/** Parses an external `.ics` feed text into busy intervals + lightweight display events. */
export function parseExternalIcsEvents(
  icsText: string,
  rangeStartMs: number,
  rangeEndMs: number,
): Array<{ id: string; title: string; start: string; end: string; allDay: boolean }> {
  if (!icsText || typeof icsText !== 'string') return [];
  // Unfold RFC 5545 continuation lines (CRLF or LF followed by space or tab).
  const unfolded = icsText.replace(/\r?\n[ \t]/g, '');
  const lines = unfolded.split(/\r?\n/);

  const out: Array<{ id: string; title: string; start: string; end: string; allDay: boolean }> = [];
  let cur: Record<string, { params: string; value: string }> | null = null;

  const parseIcsDate = (entry?: { params: string; value: string }): { ms: number; allDay: boolean } | null => {
    if (!entry?.value) return null;
    const raw = entry.value.trim();
    if (/^\d{8}$/.test(raw)) {
      const y = Number(raw.slice(0, 4));
      const mo = Number(raw.slice(4, 6));
      const da = Number(raw.slice(6, 8));
      return { ms: Date.UTC(y, mo - 1, da), allDay: true };
    }
    const dtMatch = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z?)$/.exec(raw);
    if (dtMatch) {
      const [, y, mo, da, hh, mm, ss, z] = dtMatch;
      const tzMatch = /TZID=([^;:"]+)/i.exec(entry.params || '');
      if (!z && tzMatch && isValidTimeZone(tzMatch[1])) {
        const wall = wallClockToUtcMs(
          `${y}-${mo}-${da}`,
          Number(hh) * 60 + Number(mm),
          tzMatch[1],
        );
        if (wall != null) return { ms: wall + Number(ss) * 1000, allDay: false };
      }
      return {
        ms: Date.UTC(Number(y), Number(mo) - 1, Number(da), Number(hh), Number(mm), Number(ss)),
        allDay: false,
      };
    }
    const parsed = Date.parse(raw);
    return Number.isFinite(parsed) ? { ms: parsed, allDay: false } : null;
  };

  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      cur = {};
      continue;
    }
    if (line === 'END:VEVENT' && cur) {
      const status = (cur.STATUS?.value || '').toUpperCase();
      const transp = (cur.TRANSP?.value || '').toUpperCase();
      if (status !== 'CANCELLED' && transp !== 'TRANSPARENT') {
        const st = parseIcsDate(cur.DTSTART);
        const en = parseIcsDate(cur.DTEND);
        if (st) {
          const startMs = st.ms;
          const endMs = en && en.ms > startMs
            ? en.ms
            : st.allDay
              ? startMs + 86_400_000
              : startMs + 3_600_000;
          if (endMs > rangeStartMs && startMs < rangeEndMs) {
            out.push({
              id: (cur.UID?.value || `ics_${startMs}`).slice(0, 120),
              title: (cur.SUMMARY?.value || 'Busy').replace(/\\n/g, ' ').replace(/\\([,;\\])/g, '$1').slice(0, 200),
              start: new Date(startMs).toISOString(),
              end: new Date(endMs).toISOString(),
              allDay: st.allDay,
            });
          }
        }
      }
      cur = null;
      continue;
    }
    if (cur) {
      const colonIdx = line.indexOf(':');
      if (colonIdx > 0) {
        const head = line.slice(0, colonIdx);
        const val = line.slice(colonIdx + 1);
        const semiIdx = head.indexOf(';');
        const key = (semiIdx >= 0 ? head.slice(0, semiIdx) : head).toUpperCase();
        const params = semiIdx >= 0 ? head.slice(semiIdx + 1) : '';
        cur[key] = { params, value: val };
      }
    }
  }
  return out;
}
