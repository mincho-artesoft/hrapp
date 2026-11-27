import { BadRequestException } from '@nestjs/common';
import { BookingDailyPattern, bookingMinutes, civilDayStart, dailyBookingRule } from './booking-daily-pattern';
import { RRule } from 'rrule';
import { providerRecurrence } from './provider-recurrence';

export type BookingRule = {
  frequency: number; interval: number; endDate?: string; occurrenceCount?: number;
  daysOfTheWeek?: {weekday: number; weekNumber: number}[]; daysOfTheMonth?: number[];
  monthsOfTheYear?: number[]; weeksOfTheYear?: number[]; daysOfTheYear?: number[]; setPositions?: number[];
};
export type BookingPlace = {
  location?: string;
  videoCallURL?: string;
  structuredLocation?: {title: string; latitude?: number; longitude?: number; radius: number};
};
export type Slot = BookingPlace & { title?: string; id: string; start: string; end: string; rule?: BookingRule; timeZone?: string; excludedStarts?: string[]; hoursOfDay?: number[]; dailyPattern?: BookingDailyPattern; allDay?: boolean };
export type Occurrence = Omit<Slot, 'rule' | 'excludedStarts' | 'hoursOfDay' | 'dailyPattern'>;
export const day = 86400000;
const formatters = new Map<string, Intl.DateTimeFormat>();
function formatter(zone: string) {
  let result = formatters.get(zone);
  if (!result) {
    result = new Intl.DateTimeFormat('en-CA', {timeZone: zone, year:'numeric', month:'2-digit', day:'2-digit',
      hour:'2-digit', minute:'2-digit', second:'2-digit', hourCycle:'h23'});
    if (formatters.size >= 256) formatters.clear();
    formatters.set(zone,result);
  }
  return result;
}
function wall(instant: number, zone: string) {
  const parts = formatter(zone).formatToParts(instant);
  const value = (key: string) => Number(parts.find(p=>p.type===key)!.value);
  return Date.UTC(value('year'), value('month')-1, value('day'), value('hour'), value('minute'), value('second'), new Date(instant).getUTCMilliseconds());
}
function instant(local: number, zone: string) {
  let time = local;
  for (let i=0; i<4; i++) {
    const delta = local - wall(time,zone);
    if (!delta) return time;
    time += delta;
  }
  return NaN; // A nonexistent local time during the spring clock change.
}

function dayStart(local: number, zone: string) {
  return civilDayStart(local, t => instant(t,zone), t => wall(t,zone));
}
function recurrenceInstant(slot: Slot, local: number) {
  return slot.allDay ? dayStart(local,slot.timeZone) : instant(local,slot.timeZone);
}
function slotMinutes(slot: Slot) {
  return bookingMinutes(slot.dailyPattern, (Date.parse(slot.end) - Date.parse(slot.start)) / 60000);
}
function includesSeed(slot: Slot) {
  if (!slot.dailyPattern) return true;
  const seed = Date.parse(slot.start), date = new Date(wall(seed,slot.timeZone));
  return recurrence(slot,seed).between(date,date,true).length > 0;
}
export function bookingDayFields(input: any, previous?: Slot): Pick<Slot,'allDay'|'timeZone'> {
  if (input.allDay !== undefined && typeof input.allDay !== 'boolean') throw new BadRequestException({error:'Invalid all-day time slot.'});
  if (!(input.allDay ?? previous?.allDay)) return {};
  const zone = input.timeZone ?? previous?.timeZone;
  try {
    if (typeof zone !== 'string' || !zone || [input.start,input.end].some(date => dayStart(wall(Date.parse(date),zone),zone) !== Date.parse(date))) throw Error();
    return {allDay:true,timeZone:zone};
  } catch { throw new BadRequestException({error:'Invalid all-day dates or time zone.'}); }
}
function occurrenceEnd(slot: Slot, start: number) {
  const first = Date.parse(slot.start), end = Date.parse(slot.end);
  if (!slot.allDay) return start + end - first;
  const dayNumber = (value: number) => Math.floor(wall(value,slot.timeZone)/day);
  return dayStart((dayNumber(start) + dayNumber(end) - dayNumber(first))*day,slot.timeZone);
}

export function scheduleFields(input: any, old?: Slot): Pick<Slot,'rule'|'timeZone'|'hoursOfDay'|'dailyPattern'> {
  if (input.rule === undefined) return old?.rule ? {rule:old.rule,timeZone:old.timeZone,hoursOfDay:old.hoursOfDay,dailyPattern:old.dailyPattern} : {};
  if (input.rule === null) return {};
  const r = input.rule, zone = input.timeZone;
  try {
    if (typeof zone !== 'string' || !zone.length || zone.length > 100) throw Error();
    formatter(zone);
    const freq = typeof r.frequency==='number' ? r.frequency : ['daily','weekly','monthly','yearly'].indexOf(r.frequency);
    const rule: BookingRule = {frequency:freq,interval:r.interval ?? 1};
    if (!Number.isInteger(freq) || freq < 0 || freq > 3) throw Error();
    if (r.daysOfTheWeek?.length) {
      if (r.daysOfTheWeek.length > 7) throw Error();
      rule.daysOfTheWeek = r.daysOfTheWeek.map((d:any)=>({weekday:d.weekday,weekNumber:d.weekNumber ?? 0}));
    }
    for (const key of ['monthsOfTheYear','daysOfTheMonth','weeksOfTheYear','daysOfTheYear','setPositions'] as const) {
      if (r[key]?.length) rule[key] = r[key];
    }
    if (r.endDate) {
      if (Date.parse(r.endDate) < Date.parse(input.start)) throw Error();
      rule.endDate = new Date(r.endDate).toISOString();
    }
    if (r.occurrenceCount != null) rule.occurrenceCount = r.occurrenceCount;
    providerRecurrence([rule],true,input.start,zone);
    // Older clients send the date rule when updating unrelated calendar fields.
    const hours = input.hoursOfDay === undefined ? old?.hoursOfDay : input.hoursOfDay;
    const pattern = input.dailyPattern === undefined ? old?.dailyPattern : input.dailyPattern;
    if ((input.allDay ?? old?.allDay) && (pattern || hours)) throw Error();
    if (pattern != null) {
      if (hours || !bookingMinutes(pattern,(Date.parse(input.end)-Date.parse(input.start))/60000).length) throw Error();
      const seedMinute = Math.floor(wall(Date.parse(input.start),zone)/60000) % 1440;
      if (seedMinute < pattern.first || seedMinute > pattern.last || (seedMinute-pattern.first)%pattern.step) throw Error();
      return {rule,timeZone:zone,dailyPattern:{first:pattern.first,last:pattern.last,step:pattern.step,
        breaks:pattern.breaks.map(({start,end})=>({start,end}))}};
    }
    if (hours != null) {
      const step = Array.isArray(hours) && hours.length >= 2 ? hours[1] - hours[0] : 0;
      if (!Array.isArray(hours) || hours.length > 24 || step <= 0 ||
          !hours.every((h, i) => Number.isInteger(h) && h >= 0 && h < 24 && h === hours[0] + i * step) ||
          !hours.includes(new Date(wall(Date.parse(input.start),zone)).getUTCHours()) ||
          Date.parse(input.end) - Date.parse(input.start) > step * 3600000) throw Error();
      recurrence({id:input.id,start:input.start,end:input.end,rule,timeZone:zone,hoursOfDay:hours},Date.parse(input.start));
      return {rule,timeZone:zone,hoursOfDay:hours};
    }
    return {rule,timeZone:zone};
  } catch { throw new BadRequestException({error:'Invalid repeat pattern or time zone.'}); }
}

// Older clients omit fields they don't edit. An explicit empty value clears that field.
export function bookingPlace(input: BookingPlace, previous?: BookingPlace): BookingPlace {
  const rawLink = input.videoCallURL === undefined ? previous?.videoCallURL : input.videoCallURL;
  const result: BookingPlace = {};
  if (rawLink != null && rawLink !== '') {
    if (typeof rawLink !== 'string' || rawLink.length > 2048) throw new BadRequestException({error:'Invalid video call link.'});
    const link = rawLink.trim();
    if (link) {
      let url: URL;
      try { url = new URL(link); } catch { throw new BadRequestException({error:'Invalid video call link.'}); }
      if (!/^https?:\/\//i.test(link) || !url.hostname || url.username || url.password || /\s/.test(link))
        throw new BadRequestException({error:'Invalid video call link.'});
      result.videoCallURL = link;
    }
  }
  const location = input.location === undefined ? previous?.location : input.location;
  if (location == null || location === '') return result;
  if (typeof location !== 'string' || location.length > 2048) throw new BadRequestException({error:'Invalid location.'});
  if (!location.trim()) return result;
  result.location = location.trim();
  const point = input.structuredLocation === undefined && (input.location === undefined || input.location === previous?.location)
    ? previous?.structuredLocation : input.structuredLocation;
  if (!point) return result;
  const {latitude, longitude, radius = 0, title} = point;
  if (typeof title !== 'string' || title.length > 2048 || !Number.isFinite(radius) || radius < 0 ||
      ((latitude != null || longitude != null) && (!Number.isFinite(latitude) || Math.abs(latitude)>90 ||
        !Number.isFinite(longitude) || Math.abs(longitude)>180))) throw new BadRequestException({error:'Invalid map location.'});
  result.structuredLocation = {title:title.trim(),radius,...(latitude == null ? {} : {latitude,longitude})};
  return result;
}

function slotOccurrence(slot: Slot, id: string, start: string, end: string): Occurrence {
  return {id, start, end, ...(slot.allDay && {allDay:true,timeZone:slot.timeZone}), ...(slot.title ? {title:slot.title} : {}), ...bookingPlace(slot)};
}

function recurrence(slot: Slot, from: number) {
  const zone = slot.timeZone, rule = slot.rule;
  const [line] = providerRecurrence([rule],true,slot.start,zone);
  const options = RRule.parseString(line);
  if (slot.hoursOfDay) {
    options.byhour = slot.hoursOfDay;
    // A positional rule selects a date (e.g. the last weekday), then all its hours.
    const positions = rule.setPositions;
    if (positions?.length) {
      const width = slot.hoursOfDay.length;
      options.bysetpos = positions.flatMap(p => slot.hoursOfDay.map((_, i) => p > 0 ? (p-1)*width + i+1 : p*width + i));
    }
  }
  let anchor = wall(Date.parse(slot.start), zone);
  if (slot.allDay) anchor = Math.floor(anchor/day)*day;
  // Unbounded daily/weekly rules can start in an equivalent later cycle.
  // Keep counted rules anchored to the first occurrence for their total count.
  if (!options.count && (rule.frequency === 0 || rule.frequency === 1)) {
    const step = (rule.frequency === 0 ? 1 : 7) * rule.interval * day;
    const elapsed = wall(from, zone) - anchor;
    if (elapsed > step) anchor += (Math.floor(elapsed / step) - 1) * step;
  }
  if (slot.dailyPattern) {
    const dates = new RRule({...options, dtstart:new Date(Math.floor(anchor/day)*day), count:null, until:null},true);
    return dailyBookingRule(dates,slotMinutes(slot),wall(Date.parse(slot.start),zone),
      rule.endDate ? wall(Date.parse(rule.endDate),zone) : undefined,rule.occurrenceCount);
  }
  return new RRule({...options, dtstart:new Date(anchor),
    until: rule.endDate ? new Date(wall(Date.parse(rule.endDate),zone)) : null},true);
}

// Persist the series once. Each occurrence has a stable identity across devices and pages.
export function occurrences(slot: Slot, from: number, to: number): Occurrence[] {
  const start = Date.parse(slot.start);
  const result: Occurrence[] = [];
  if (start >= from && start < to && includesSeed(slot) && !slot.excludedStarts?.includes(slot.start)) result.push(slotOccurrence(slot,slot.id,slot.start,slot.end));
  if (!slot.rule || start >= to || (slot.rule.endDate && Date.parse(slot.rule.endDate)<from)) return result;
  const dates = recurrence(slot,from).between(new Date(wall(from,slot.timeZone)-day),new Date(wall(to,slot.timeZone)+day),true);
  const wallSeed = slot.hoursOfDay || slot.dailyPattern ? wall(start,slot.timeZone) : undefined;
  for (const date of dates) {
    if (date.getTime() === wallSeed) continue;
    const t = recurrenceInstant(slot,date.getTime());
    if (Number.isFinite(t) && t>start && t>=from && t<to && !slot.excludedStarts?.includes(new Date(t).toISOString())) {
      result.push(slotOccurrence(slot,slot.id+'@'+t,new Date(t).toISOString(),new Date(occurrenceEnd(slot,t)).toISOString()));
    }
  }
  return result;
}

export function occurrenceByID(slots: Slot[], id: string): Occurrence | undefined {
  if (typeof id !== 'string') return;
  const [series, timestamp] = id.split('@');
  const slot = slots.find(s=>s.id===series);
  if (!slot) return;
  if (id === series) return !includesSeed(slot) || slot.excludedStarts?.includes(slot.start) ? undefined : slotOccurrence(slot,id,slot.start,slot.end);
  const t = Number(timestamp);
  if (!slot.rule || !Number.isSafeInteger(t) || Math.abs(t)>253402300799999) return;
  return occurrences(slot,t,t+1).find(s=>s.id === id);
}
export function overlaps(a: Omit<Occurrence,'id'>, b: Omit<Occurrence,'id'>) {
  return a.start < b.end && b.start < a.end;
}

export function nextOccurrenceStart(slot: Slot, from: number): number | undefined {
  const seed = Date.parse(slot.start);
  if (seed >= from && includesSeed(slot) && !slot.excludedStarts?.includes(slot.start)) return seed;
  if (!slot.rule || (slot.rule.endDate && Date.parse(slot.rule.endDate) < from)) return;
  from = Math.max(seed, from);
  // When clocks turn back, a later instant can have an earlier local time.
  if ((slot.hoursOfDay || slot.dailyPattern) && wall(from+day,slot.timeZone) - wall(from-day,slot.timeZone) < 2*day) {
    const nearby = occurrences(slot,from,from+day)[0];
    if (nearby) return Date.parse(nearby.start);
  }
  const schedule = recurrence(slot, from);
  const local = wall(from, slot.timeZone);
  let candidate = schedule.after(new Date(slot.allDay ? Math.floor(local/day)*day : local), true);
  while (candidate) {
    const time = recurrenceInstant(slot,candidate.getTime());
    if (Number.isFinite(time) && time >= from && !slot.excludedStarts?.includes(new Date(time).toISOString())) return time;
    candidate = schedule.after(candidate);
  }
}

export function bookingSeriesBefore(series: Slot, pivot: string): Slot | undefined {
  if (pivot === series.start) return undefined;
  return {...series, rule:{...series.rule, occurrenceCount:undefined, endDate:new Date(Date.parse(pivot) - 1).toISOString()},
    excludedStarts:series.excludedStarts?.filter(start => start < pivot)};
}

// Split at a real occurrence in the series time zone. Existing exceptions must
// follow their occurrence even when a monthly rule skips different months.
export function splitBookingSeries(series: Slot, pivot: string, start: string, end: string, futureID: string, allDay = !!series.allDay) {
  const zone = series.timeZone, first = Date.parse(series.start), cut = Date.parse(pivot);
  const wallStart = (time: number, floating: boolean) => {
    const local = wall(time,zone);
    return floating ? Math.floor(local/day)*day : local;
  };
  const oldWall = wallStart(cut,!!series.allDay), newWall = wallStart(Date.parse(start),allDay), delta = newWall - oldWall;
  const shift = (time: number) => instant(wall(time, zone) + delta, zone);
  const originalRule = recurrence(series, first);
  const rule = {...series.rule};
  if (rule.occurrenceCount && cut > first) {
    const consumed = originalRule.between(new Date(wallStart(first,!!series.allDay)), new Date(oldWall - 1), true).length;
    rule.occurrenceCount -= consumed;
  }
  if (rule.endDate) {
    const until = Date.parse(rule.endDate), moved = shift(until);
    rule.endDate = new Date(Number.isFinite(moved) ? moved : until + Date.parse(start) - cut).toISOString();
  }
  const dayShift = Math.floor(newWall / day) - Math.floor(oldWall / day);
  if (rule.frequency <= 1 && dayShift && rule.daysOfTheWeek) {
    rule.daysOfTheWeek = rule.daysOfTheWeek.map(d => ({...d, weekday: ((d.weekday - 1 + dayShift) % 7 + 7) % 7 + 1}));
  }

  const future: Slot = {...series, id:futureID, start, end, allDay, rule, excludedStarts:[]};
  if (series.dailyPattern) {
    const shift = ((newWall % day) - (oldWall % day)) / 60000;
    const p = series.dailyPattern;
    future.dailyPattern = {...p,first:p.first+shift,last:p.last+shift,
      breaks:p.breaks.map(b=>({start:b.start+shift,end:b.end+shift}))};
    if (!slotMinutes(future).length || !includesSeed(future)) throw new BadRequestException({error:'Invalid daily schedule.'});
  }
  if (series.hoursOfDay) {
    const hourShift = new Date(newWall).getUTCHours() - new Date(oldWall).getUTCHours();
    future.hoursOfDay = series.hoursOfDay.map(hour => hour + hourShift);
    if (future.hoursOfDay[0] < 0 || future.hoursOfDay[future.hoursOfDay.length-1] > 23)
      throw new BadRequestException({error:'The daily schedule must fit within one day.'});
    if (Date.parse(end)-Date.parse(start) > (future.hoursOfDay[1]-future.hoursOfDay[0])*3600000)
      throw new BadRequestException({error:'Time slots overlap.'});
  }
  if (rule.occurrenceCount) {
    // DTSTART is always a displayed slot, even when a custom RRULE excludes its weekday.
    const oldIncludesPivot = originalRule.after(new Date(oldWall), true)?.getTime() === oldWall;
    const newIncludesSeed = recurrence(future, Date.parse(start)).after(new Date(newWall), true)?.getTime() === newWall;
    rule.occurrenceCount += Number(newIncludesSeed) - Number(oldIncludesPivot);
    if (!rule.occurrenceCount) { delete future.rule; delete future.hoursOfDay; delete future.dailyPattern; }
  }
  const past = bookingSeriesBefore(series, pivot);
  const raw = {...future, excludedStarts:[]};
  function corresponding(time: string): Occurrence | undefined {
    if (time === pivot) return slotOccurrence(raw, raw.id, start, end);
    if (!raw.rule) return;
    const timeMs = Date.parse(time), guess = shift(timeMs);
    // A time-only change normally keeps the same dates. Reanchoring on a different
    // day can change which months are skipped, so map those exceptions by position.
    if (dayShift === 0 && Number.isFinite(guess)) {
      const direct = occurrenceByID([raw], raw.id + '@' + guess);
      if (direct) return direct;
    }
    const index = originalRule.between(new Date(oldWall + 1), new Date(wall(timeMs, zone)), true).length;
    if (!index) return;
    const nextRule = recurrence(raw, Date.parse(start));
    let following = 0, target: Date | undefined;
    nextRule.all(date => {
      if (date.getTime() > newWall && ++following === index) { target = date; return false; }
      return true;
    });
    if (!target) return;
    const t = recurrenceInstant(raw,target.getTime());
    if (Number.isFinite(t)) return slotOccurrence(raw, raw.id + '@' + t, new Date(t).toISOString(),
      new Date(occurrenceEnd(raw,t)).toISOString());
  }
  for (const exception of series.excludedStarts ?? []) {
    if (exception < pivot) continue;
    const moved = corresponding(exception);
    if (moved) future.excludedStarts.push(moved.start);
  }
  return {past, future, corresponding};
}
