// Minutes since local midnight. Keep the working grid and its breaks together so
// changing or removing a break can restore the original appointment times.
export interface BookingBreak { start: number; end: number }
export interface BookingDailyPattern {
  first: number;
  last: number;
  step: number;
  breaks: BookingBreak[];
}
export function bookingMinutes(pattern: BookingDailyPattern, duration: number): number[] {
  if (![pattern.first, pattern.last, pattern.step].every(Number.isInteger) || pattern.first < 0 ||
      pattern.last > 1439 || pattern.first > pattern.last || pattern.step < 1 || pattern.step > 1440 ||
      !(duration > 0 && duration <= pattern.step) || !Array.isArray(pattern.breaks) ||
      pattern.breaks.some(b => !b || !Number.isInteger(b.start) || !Number.isInteger(b.end) ||
        b.start < 0 || b.end > 1440 || b.end <= b.start)) return [];
  const minutes: number[] = [];
  for (let time = pattern.first; time <= pattern.last; time += pattern.step) {
    if (time + duration <= 1440 && !pattern.breaks.some(b => time < b.end && b.start < time + duration)) minutes.push(time);
  }
  return minutes;
}

// Some zones advance the clock at midnight. A calendar day begins at its first
// real instant, even when its first displayed time is 01:00.
export function civilDayStart(local: number, resolve: (value: number) => number, wall: (value: number) => number): number {
  const day = 86400000;
  const midnight = Math.floor(local/day)*day;
  const candidate = resolve(midnight);
  if (Number.isFinite(candidate) && wall(candidate - 1) < midnight) return candidate;
  let low = midnight - 2*day, high = midnight + 2*day;
  while (high - low > 1) {
    const middle = Math.floor((low + high)/2);
    if (wall(middle) < midnight) low = middle;
    else high = middle;
  }
  return high;
}

interface Dates {
  between(from: Date, to: Date, inclusive?: boolean): Date[];
  after(from: Date, inclusive?: boolean): Date | null;
  all(visit: (date: Date, index: number) => boolean): Date[];
}

// RRULE selects dates, then the grid selects appointment starts on each date.
// COUNT applies to individual starts. This also handles positional monthly rules.
export function dailyBookingRule(days: Dates, minutes: number[], seed: number, until?: number, count?: number): Dates {
  const day = 86400000;
  const midnight = (t: number) => Math.floor(t / day) * day;
  const offset = ((seed % 60000) + 60000) % 60000;
  function visitDay(date: Date, visit: (t: number) => boolean) {
    for (const minute of minutes) {
      const t = +date + minute * 60000 + offset;
      if (t < seed) continue;
      if ((until !== undefined && t > until) || !visit(t)) return false;
    }
    return true;
  }
  function all(visit: (date: Date, index: number) => boolean) {
    const result: Date[] = [];
    if (minutes.length) days.all(date => visitDay(date, t => {
      const candidate = new Date(t);
      if (!visit(candidate, result.length)) return false;
      result.push(candidate);
      return !count || result.length < count;
    }));
    return result;
  }
  function between(from: Date, to: Date, inclusive = false) {
    const lower = +from + (inclusive ? 0 : 1), upper = +to - (inclusive ? 0 : 1);
    const result: Date[] = [];
    if (upper < lower || !minutes.length) return result;
    const accept = (time: number) => {
      if (time >= lower && time <= upper) result.push(new Date(time));
      return time <= upper;
    };
    if (count) all(date => accept(+date));
    else for (const date of days.between(new Date(midnight(lower)), new Date(midnight(upper)), true)) {
      if (!visitDay(date, accept)) break;
    }
    return result;
  }
  function after(from: Date, inclusive = false) {
    const lower = +from + (inclusive ? 0 : 1);
    let found: Date | null = null;
    const accept = (time: number) => {
      if (time < lower) return true;
      found = new Date(time);
      return false;
    };
    if (count) all(date => accept(+date));
    else if (minutes.length) {
      let date = days.after(new Date(midnight(Math.max(seed, lower))), true);
      while (date && (until === undefined || +date <= until) && visitDay(date, accept)) date = days.after(date);
    }
    return found;
  }
  return {between, after, all};
}
