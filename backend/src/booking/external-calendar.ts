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
