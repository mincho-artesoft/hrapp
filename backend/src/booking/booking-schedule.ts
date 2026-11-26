import { BadRequestException } from '@nestjs/common';
import { RRule } from 'rrule';
import { providerRecurrence } from './provider-recurrence';

export type BookingRule = {
  frequency: number; interval: number; endDate?: string; occurrenceCount?: number;
  daysOfTheWeek?: {weekday: number; weekNumber: number}[]; daysOfTheMonth?: number[];
  monthsOfTheYear?: number[]; weeksOfTheYear?: number[]; daysOfTheYear?: number[]; setPositions?: number[];
};
export type BookingPlace = {
  location?: string;
  structuredLocation?: {title: string; latitude?: number; longitude?: number; radius: number};
};
export type Slot = BookingPlace & { title?: string; id: string; start: string; end: string; rule?: BookingRule; timeZone?: string; excludedStarts?: string[] };
export type Occurrence = Omit<Slot, 'rule' | 'timeZone' | 'excludedStarts'>;
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

export function scheduleFields(input: any, old?: Slot): Pick<Slot,'rule'|'timeZone'> {
  if (input.rule === undefined) return old?.rule ? {rule:old.rule,timeZone:old.timeZone} : {};
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
    return {rule,timeZone:zone};
  } catch { throw new BadRequestException({error:'Invalid repeat pattern or time zone.'}); }
}

// An omitted field is a legacy client retaining the previous address. An empty
// address explicitly clears both the display text and its map coordinates.
export function bookingPlace(input: BookingPlace, previous?: BookingPlace): BookingPlace {
  const location = input.location === undefined ? previous?.location : input.location;
  if (location == null || location === '') return {};
  if (typeof location !== 'string' || location.length > 2048) throw new BadRequestException({error:'Invalid location.'});
  if (!location.trim()) return {};
  const point = input.structuredLocation === undefined && (input.location === undefined || input.location === previous?.location)
    ? previous?.structuredLocation : input.structuredLocation;
  if (!point) return {location:location.trim()};
  const {latitude, longitude, radius = 0, title} = point;
  if (typeof title !== 'string' || title.length > 2048 || !Number.isFinite(radius) || radius < 0 ||
      ((latitude != null || longitude != null) && (!Number.isFinite(latitude) || Math.abs(latitude)>90 ||
        !Number.isFinite(longitude) || Math.abs(longitude)>180))) throw new BadRequestException({error:'Invalid map location.'});
  return {location:location.trim(), structuredLocation:{title:title.trim(),radius,...(latitude == null ? {} : {latitude,longitude})}};
}

function slotOccurrence(slot: Slot, id: string, start: string, end: string): Occurrence {
  return {id, start, end, ...(slot.title ? {title:slot.title} : {}), ...bookingPlace(slot)};
}

function recurrence(slot: Slot, from: number) {
  const zone = slot.timeZone, rule = slot.rule;
  const [line] = providerRecurrence([rule],true,slot.start,zone);
  const options = RRule.parseString(line);
  let anchor = wall(Date.parse(slot.start), zone);
  // Unbounded daily/weekly rules can start in an equivalent later cycle.
  // Keep counted rules anchored to the first occurrence for their total count.
  if (!options.count && (rule.frequency === 0 || rule.frequency === 1)) {
    const step = (rule.frequency === 0 ? 1 : 7) * rule.interval * day;
    const elapsed = wall(from, zone) - anchor;
    if (elapsed > step) anchor += (Math.floor(elapsed / step) - 1) * step;
  }
  return new RRule({...options, dtstart:new Date(anchor),
    until: rule.endDate ? new Date(wall(Date.parse(rule.endDate),zone)) : null},true);
}

// Persist the series once. Each occurrence has a stable identity across devices and pages.
export function occurrences(slot: Slot, from: number, to: number): Occurrence[] {
  const start = Date.parse(slot.start), duration = Date.parse(slot.end)-start;
  const result: Occurrence[] = [];
  if (start >= from && start < to && !slot.excludedStarts?.includes(slot.start)) result.push(slotOccurrence(slot,slot.id,slot.start,slot.end));
  if (!slot.rule || start >= to || (slot.rule.endDate && Date.parse(slot.rule.endDate)<from)) return result;
  const dates = recurrence(slot,from).between(new Date(wall(from,slot.timeZone)-day),new Date(wall(to,slot.timeZone)+day),true);
  for (const date of dates) {
    const t = instant(date.getTime(),slot.timeZone);
    if (Number.isFinite(t) && t>start && t>=from && t<to && !slot.excludedStarts?.includes(new Date(t).toISOString())) {
      result.push(slotOccurrence(slot,slot.id+'@'+t,new Date(t).toISOString(),new Date(t+duration).toISOString()));
    }
  }
  return result;
}

export function occurrenceByID(slots: Slot[], id: string): Occurrence | undefined {
  if (typeof id !== 'string') return;
  const [series, timestamp] = id.split('@');
  const slot = slots.find(s=>s.id===series);
  if (!slot) return;
  if (id === series) return slot.excludedStarts?.includes(slot.start) ? undefined : slotOccurrence(slot,id,slot.start,slot.end);
  const t = Number(timestamp);
  if (!slot.rule || !Number.isSafeInteger(t) || Math.abs(t)>253402300799999) return;
  return occurrences(slot,t,t+1).find(s=>s.id === id);
}
export function overlaps(a: Omit<Occurrence,'id'>, b: Omit<Occurrence,'id'>) {
  return a.start < b.end && b.start < a.end;
}

export function nextOccurrenceStart(slot: Slot, from: number): number | undefined {
  const seed = Date.parse(slot.start);
  if (seed >= from && !slot.excludedStarts?.includes(slot.start)) return seed;
  if (!slot.rule || (slot.rule.endDate && Date.parse(slot.rule.endDate) < from)) return;
  from = Math.max(seed, from);
  const schedule = recurrence(slot, from);
  let candidate = schedule.after(new Date(wall(from, slot.timeZone)), true);
  while (candidate) {
    const time = instant(candidate.getTime(), slot.timeZone);
    if (Number.isFinite(time) && time >= from && !slot.excludedStarts?.includes(new Date(time).toISOString())) return time;
    candidate = schedule.after(candidate);
  }
}
