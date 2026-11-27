import { Body, Controller, Delete, Get, HttpException, Param, Put, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/auth.guard';
import { randomUUID } from 'node:crypto';
import { EmailService } from '../email/email.service';
import { StoreService } from '../store/store.service';

import { bookingDayFields, bookingPlace, bookingSeriesBefore, day, occurrenceByID, occurrences, overlaps, scheduleFields, splitBookingSeries, nextOccurrenceStart, Occurrence, Slot } from './booking-schedule';
type Decision = 'pending' | 'accepted' | 'declined';
type Booking = Slot & { cancelledByGuest?: boolean; proposal?: Occurrence; answeredProposal?: {id:string; decision:Decision};slotId: string; guestId: string; guestName: string; decision: Decision};
type BookCalendar = {
  id: string; title: string; owner: string; hostName: string; revision: number;
  appointmentType?: string; customType?: string; slots: Slot[]; requests: Booking[]; archived?: boolean; listed?: boolean;
};
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
function fail(status: number, error: string): never { throw new HttpException({error}, status); }
function calendarKey(id: string) {
  if (!uuid.test(id)) fail(400, 'Invalid booking calendar.');
  return `booking-calendars/${id}.json`;
}
function index(actor: string) { return `principal/${actor}/booking-calendars/`; }
function calendarDetails(c: BookCalendar) {
  return {appointmentType:c.appointmentType ?? 'General appointment', customType:c.customType ?? ''};
}
function guestSummary(c: BookCalendar, actor: string) {
  // Older calendars can have the account email as their fallback display name.
  const hostName = c.hostName && !c.hostName.includes('@') ? c.hostName : 'Cloud Calendars user';
  return {id:c.id, title:c.title, ...calendarDetails(c), hostName, isOwner:c.owner === actor};
}
function withoutMeetingLink<T extends {videoCallURL?: string}>({videoCallURL, ...fields}: T) {
  return videoCallURL ? {...fields, hasVideoCall:true} : fields;
}
function presentation(c: BookCalendar, r: Booking, now: number, actor: string) {
  const {guestId, decision, answeredProposal, proposal, ...item} = r;
  const showLink = c.owner === actor || decision === 'accepted';
  return {...(showLink ? item : withoutMeetingLink(item)),
    ...(proposal && {proposal:showLink ? proposal : withoutMeetingLink(proposal)}),
    ...calendarDetails(c), calendarId:c.id, calendarTitle: c.title, hostName: c.hostName,
    status: decision !== 'declined' && Date.parse(r.proposal?.end ?? r.end) <= now ? 'past' : decision};
}
function heldTimes(requests: Booking[]) {
  return requests.filter(r => r.decision !== 'declined').flatMap(r => r.proposal ? [r, r.proposal] : [r]);
}

function hostCalendar(c: BookCalendar, now: number) {
  return {id:c.id, title:c.title, ...calendarDetails(c), listed:c.listed ?? true, revision:c.revision,
    slots:c.slots, requests:c.requests.map(r => presentation(c,r,now,c.owner))};
}
function slotOverlaps(slot: Slot, interval: Occurrence) {
  const duration = Date.parse(slot.end) - Date.parse(slot.start);
  if (slot.allDay) return occurrences(slot, Date.parse(interval.start) - duration - day, Date.parse(interval.end)).some(o => overlaps(o,interval));
  const next = nextOccurrenceStart(slot, Date.parse(interval.start) - duration + 1);
  return next !== undefined && next < Date.parse(interval.end);
}

const missing = () => fail(404, 'Booking calendar not found.');
const conflict = () => fail(409, 'This calendar changed. Refresh and try again.');

@Controller('booking-calendars')
@UseGuards(AuthGuard)
export class BookingCalendarsController {
  constructor(private readonly store: StoreService, private readonly email: EmailService) {}

  private async displayName(actor: string) {
    const p = await this.store.getJSON(this.store.keys.principal(actor));
    return String(p?.displayName || p?.accountEmail || 'Cloud Calendars user');
  }

  @Get()
  async workspace(@Req() req: any) {
    const actor = req.principal.principalId, prefix = index(actor), now = Date.now();
    const keys = await this.store.listKeys(prefix);
    const docs = (await Promise.all(keys.map(k => this.store.getJSON(calendarKey(k.slice(prefix.length, -5))))))
      .filter((c): c is BookCalendar => !!c);
    const calendars = docs.filter(c => c.owner === actor && !c.archived)
      .map(c => hostCalendar(c,now)).sort((a,b) => a.title.localeCompare(b.title));
    const appointments = docs.flatMap(c => c.requests.filter(r => r.guestId === actor).map(r => presentation(c,r,now,actor)))
      .sort((a,b) => a.start.localeCompare(b.start));
    return {calendars, appointments};
  }

  @Get('directory')
  async directory(@Req() req: any, @Query('after') after?: string) {
    const actor = req.principal.principalId;
    const prefix = 'booking-calendars/', limit = 32;
    const cursor = after === undefined ? '' : calendarKey(after);
    const keys = (await this.store.listKeys(prefix))
      .filter(key => key > cursor && key.endsWith('.json') && uuid.test(key.slice(prefix.length,-5))).sort();
    const calendars: ReturnType<typeof guestSummary>[] = [];
    for (let offset = 0; offset < keys.length; offset += limit) {
      const batch: BookCalendar[] = await Promise.all(keys.slice(offset, offset + limit).map(key => this.store.getJSON(key)));
      for (const calendar of batch) {
        if (!calendar || calendar.archived || calendar.listed === false || calendar.owner === actor) continue;
        if (calendars.length === limit) return {calendars, next:calendars[limit-1].id};
        calendars.push(guestSummary(calendar, actor));
      }
    }
    return {calendars, next:null};
  }

  @Get(':id')
  async availability(@Req() req: any, @Param('id') id: string, @Query('from') from?: string,
                     @Query('to') to?: string, @Query('includeBusy') includeBusy?: string) {
    const c: BookCalendar = await this.store.getJSON(calendarKey(id));
    if (!c || c.archived) missing();
    const now = Date.now(), start = from ? Date.parse(from) : now + 1;
    const lower = Math.max(now + 1, start);
    if (!Number.isFinite(lower) || lower > Date.UTC(9999,0,1)) fail(400,'Invalid availability date.');
    const bounded = to !== undefined, showBusy = bounded || includeBusy === 'true';
    const end = bounded ? Date.parse(to) : Infinity;
    if (bounded && (!from || !Number.isFinite(end) || end <= start || end - start > 35 * day)) fail(400,'Invalid availability date.');
    const held = heldTimes(c.requests).filter(r => Date.parse(r.end) > now);
    // Both intervals stay protected while the guest decides. Show the host's proposed
    // time and the guest's agreed time as a single appointment in their calendars.
    const mine = new Map<Occurrence,string>(), hidden = new Set<Occurrence>();
    if (showBusy) for (const request of c.requests) {
      if (request.decision === 'declined') continue;
      const proposal = request.proposal;
      if (req.principal.principalId === c.owner && proposal) hidden.add(request);
      if (request.guestId !== req.principal.principalId) continue;
      const shown = proposal && Date.parse(request.end) <= now ? proposal : request;
      if (proposal) hidden.add(shown === request ? proposal : request);
      if (Math.max(Date.parse(request.start), Date.parse(proposal?.start ?? request.start)) > now) mine.set(shown,request.id);
    }
    const visibleBusy = showBusy ? held.filter(interval => !hidden.has(interval)) : [];
    const paged = !bounded && (!!from || c.slots.some(s => s.rule));
    const nextStart = (time: number) => {
      let first = Infinity;
      for (const slot of c.slots) first = Math.min(first, nextOccurrenceStart(slot,time) ?? Infinity);
      for (const interval of visibleBusy) {
        const heldStart = Date.parse(interval.start);
        if (heldStart >= time) first = Math.min(first, heldStart);
      }
      return first;
    };
    const ongoing = visibleBusy.some(r => Date.parse(r.start) < lower && Date.parse(r.end) > lower);
    const first = paged && !ongoing ? nextStart(lower) : lower;
    const upper = bounded ? end : paged ? first + 31 * day : Date.UTC(9999,0,1);
    const slots = first < upper ? c.slots.flatMap(slot => {
      // Include a bookable slot crossing the first midnight of the displayed window.
      const duration = Date.parse(slot.end) - Date.parse(slot.start) + (slot.allDay ? day : 0);
      const searchFrom = bounded ? Math.max(now + 1, first - duration) : first;
      return occurrences(slot,searchFrom,upper).filter(s => Date.parse(s.end) > first && !held.some(r => overlaps(r,s)));
    }).sort((a,b) => a.start.localeCompare(b.start)) : [];
    const busy = new Map<string, Pick<Slot,'id'|'start'|'end'|'allDay'|'timeZone'> & {myBookingId?:string}>();
    if (first < upper) for (const interval of visibleBusy) {
      if (Date.parse(interval.start) >= upper || Date.parse(interval.end) <= first) continue;
      const allDay = !!interval.allDay;
      const key = ['busy', interval.start, interval.end, allDay ? interval.timeZone || 'UTC' : ''].join('/');
      busy.set(key, {id:key, start:interval.start, end:interval.end, ...(allDay && {allDay:true,timeZone:interval.timeZone}),
        ...(mine.has(interval) && {myBookingId:mine.get(interval)})});
    }
    const next = paged && Number.isFinite(upper) ? nextStart(upper) : Infinity;
    return {...guestSummary(c, req.principal.principalId), slots:slots.map(withoutMeetingLink),
      ...(showBusy && {busy:[...busy.values()].sort((a,b) => a.start.localeCompare(b.start))}),
      nextFrom:Number.isFinite(next) ? new Date(next).toISOString() : null};
  }

  @Put(':id')
  async save(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    const actor = req.principal.principalId, key = calendarKey(id);
    const row = await this.store.getJSONWithETag(key);
    const old: BookCalendar | undefined = row?.value;
    if (old && (old.owner !== actor || old.archived)) missing();
    if (body?.revision !== (old?.revision ?? 0)) conflict();
    if (typeof body.title !== 'string' || !body.title.trim() || body.title.trim().length > 200
      || !Array.isArray(body.slots) || body.slots.length > 1000) fail(400,'Enter a name and valid time slots.');
    const appointmentType = body.appointmentType === undefined ? (old?.appointmentType ?? 'General appointment') : body.appointmentType;
    const customType = appointmentType === 'Other' ? (body.customType ?? old?.customType ?? '') : '';
    if (typeof appointmentType !== 'string' || !appointmentType.trim() || appointmentType.length>100 ||
        typeof customType !== 'string' || customType.length>100) fail(400,'Invalid appointment type.');
    const seen = new Set<string>();
    const slots: Slot[] = body.slots.map((s: any) => {
      if (!s || typeof s.id !== 'string' || !uuid.test(s.id) || seen.has(s.id) || typeof s.start !== 'string' || typeof s.end !== 'string'
        || !/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(s.start) || !/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(s.end)
        || !Number.isFinite(Date.parse(s.start)) || !Number.isFinite(Date.parse(s.end)) || Date.parse(s.start) >= Date.parse(s.end)) fail(400,'Invalid time slot.');
      seen.add(s.id);
      const previous = old?.slots.find(slot=>slot.id===s.id);
      const title = s.title === undefined ? previous?.title : s.title;
      if (title != null && (typeof title !== 'string' || title.length > 200)) fail(400,'Invalid slot title.');
      return {...(previous?.excludedStarts && s.rule !== null ? {excludedStarts:previous.excludedStarts} : {}), ...bookingPlace(s,previous), ...(title?.trim() ? {title:title.trim()} : {}), id:s.id, start:new Date(s.start).toISOString(), end:new Date(s.end).toISOString(),...scheduleFields(s,previous),...bookingDayFields(s,previous)};
    }).sort((a: Slot,b: Slot) => a.start.localeCompare(b.start));
    const seeds = slots.filter(s => occurrenceByID([s],s.id));
    if (seeds.some((s,i) => i > 0 && s.start < seeds[i-1].end)) fail(400,'Time slots overlap.');
    if (slots.some(s=>s.rule)) {
      // Validate the opening booking window. The reservation write also checks all
      // active requests, including any overlaps from later pages of two series.
      const from = Math.max(Date.now(),Date.parse(slots[0].start));
      const page = slots.flatMap(s=>occurrences(s,from,from+31*day)).sort((a,b)=>a.start.localeCompare(b.start));
      if (page.some((s,i)=>i>0 && overlaps(page[i-1],s))) fail(400,'Time slots overlap.');
    }
    for (const r of old?.requests ?? []) {
      const protectedSlot = occurrenceByID(slots,r.slotId);
      const expected = r.proposal ?? r;
      if (r.decision !== 'declined' && Date.parse(expected.end) > Date.now()
        && (protectedSlot?.start !== expected.start || protectedSlot?.end !== expected.end || !!protectedSlot?.allDay !== !!expected.allDay)) fail(409,'A requested slot cannot be changed.');
    }
    if (body.listed !== undefined && typeof body.listed !== 'boolean') fail(400,'Invalid search visibility.');
    const doc: BookCalendar = {id, owner:actor, listed:body.listed ?? old?.listed ?? true, title:body.title.trim(), appointmentType:appointmentType.trim(), customType:customType.trim(), slots, revision:(old?.revision ?? 0)+1,
      hostName:old?.hostName ?? await this.displayName(actor), requests:old?.requests ?? []};
    if (!old) await this.store.putJSONIfAbsent(index(actor)+id+'.json', {id});
    const saved = row ? await this.store.putJSONIfMatch(key,doc,row.etag) : await this.store.putJSONIfAbsent(key,doc);
    if (!saved) conflict();
    return {id, revision:doc.revision};
  }

  @Put(':id/future-occurrences/:slotId')
  async moveFuture(@Req() req: any, @Param('id') id: string, @Param('slotId') slotId: string, @Body() body: any) {
    const key = calendarKey(id), row = await this.store.getJSONWithETag(key), c: BookCalendar = row?.value;
    if (!c || c.archived || c.owner !== req.principal.principalId) missing();
    if (body?.revision !== c.revision) conflict();
    const original = occurrenceByID(c.slots, slotId), series = c.slots.find(s => s.id === slotId.split('@')[0]);
    if (!original || !series?.rule) conflict();
    if (body.remove === true) {
      if (c.requests.some(r => r.decision !== 'declined' && r.slotId.split('@')[0] === series.id
        && (r.proposal ?? r).start >= original.start)) fail(409,'A requested slot cannot be changed.');
      const past = bookingSeriesBefore(series, original.start);
      const slots = c.slots.flatMap(slot => slot !== series ? [slot] : past ? [past] : []);
      const updated = {...c, slots, revision:c.revision + 1};
      if (!await this.store.putJSONIfMatch(key, updated, row.etag)) conflict();
      return hostCalendar(updated, Date.now());
    }
    const valid = (v: unknown): v is string => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(v) && Number.isFinite(Date.parse(v));
    if (!valid(body.start) || !valid(body.end) || Date.parse(body.end) <= Date.parse(body.start)) fail(400,'Invalid time slot.');
    const start = new Date(body.start).toISOString(), end = new Date(body.end).toISOString();
    const now = Date.now();
    const dayFields = bookingDayFields({...body,start,end},series);
    if (dayFields.allDay && (series.hoursOfDay || series.dailyPattern)) fail(400,'An intraday schedule cannot contain all-day appointments.');
    if (start === original.start && end === original.end && !!dayFields.allDay === !!original.allDay) return hostCalendar(c,now);
    const {past, future, corresponding} = splitBookingSeries(series,original.start,start,end,original.start === series.start ? series.id : randomUUID(), !!dayFields.allDay);
    const slots = c.slots.filter(s => s !== series);
    if (past) slots.push(past);
    const changed: Booking[] = [];
    const requests = c.requests.map(r => {
      const held = r.proposal ?? r;
      if (r.decision === 'declined' || r.slotId.split('@')[0] !== series.id || held.start < original.start) return r;
      if (r.slotId === slotId && (body.freeOnly === true || r.proposal || Date.parse(r.end) <= now)) conflict();
      const target = corresponding(held.start);
      if (r.proposal || Date.parse(r.end) <= now || !target) {
        // Retain a historical booking or an outstanding proposal as an independent slot.
        const keep: Slot = {id:randomUUID(), start:held.start, end:held.end, title:held.title, allDay:held.allDay, ...bookingPlace(held), timeZone:series.timeZone};
        slots.push(keep);
        if (target) future.excludedStarts.push(target.start);
        return {...r, slotId:keep.id};
      }
      if (target.start === r.start && target.end === r.end && !!target.allDay === !!r.allDay) return {...r,slotId:target.id};
      if (Date.parse(target.start) <= now) fail(409,'Choose a future time for this booking.');
      const updated = {...r,slotId:target.id,proposal:{...target,id:randomUUID()}};
      changed.push(updated);
      return updated;
    });
    if (slots.length >= 1000) fail(400,'Too many time slots.');
    // Match the calendar editor's opening-window check and check every existing
    // one-off slot and guest hold, including those beyond that window.
    const from = Date.parse(start);
    const window = occurrences(future, from, from + 31 * day);
    if (window.some((o,i) => (i > 0 && overlaps(window[i-1],o)) || slots.some(s => slotOverlaps(s,o)))
      || slots.some(s => !s.rule && slotOverlaps(future,s))) fail(409,'Time slots overlap.');
    for (const r of requests.filter(r => r.decision !== 'declined')) {
      const target = r.proposal ?? r;
      const own = occurrenceByID([future],r.slotId);
      // The future occurrence can hold this guest's proposed time. Both their
      // original and proposed times remain protected against other bookings.
      for (const hold of r.proposal ? [r, target] : [r]) {
        const available = own ? {...future,excludedStarts:[...future.excludedStarts,own.start]} : future;
        if (slotOverlaps(available,hold)) fail(409,'Time slots overlap.');
      }
      if (changed.includes(r) && (slots.some(s => slotOverlaps(s,target)) ||
          heldTimes(requests.filter(other => other !== r)).some(other => overlaps(other,target)))) fail(409,'Time slots overlap.');
    }
    slots.push(future);
    slots.sort((a,b) => a.start.localeCompare(b.start));
    const updated = {...c,slots,requests,revision:c.revision + 1};
    if (!await this.store.putJSONIfMatch(key,updated,row.etag)) conflict();
    await Promise.all(changed.map(r => this.notifyChange(c,r,r.proposal,series.timeZone)));
    return hostCalendar(updated,now);
  }

  private async notifyChange(c: BookCalendar, booking: Booking, proposal: Occurrence, zone?: string) {
    const recipient = await this.store.getJSON(this.store.keys.principal(booking.guestId));
    const email = recipient?.accountEmail ?? Object.values(recipient?.identities ?? {}).map((i:any) => i.email).find(Boolean);
    if (email) await this.email.bookingChange(email, c.title, booking, proposal, zone);
  }

  @Put(':id/occurrences/:slotId')
  async editOccurrence(@Req() req: any, @Param('id') id: string, @Param('slotId') slotId: string, @Body() body: any) {
    const key = calendarKey(id), row = await this.store.getJSONWithETag(key);
    const c: BookCalendar = row?.value;
    if (!row || c.archived || c.owner !== req.principal.principalId) missing();
    if (body?.revision !== c.revision) conflict();
    const original = occurrenceByID(c.slots, slotId);
    if (!original) conflict();
    const series = c.slots.find(s => s.id === slotId.split('@')[0])!;
    const booking = c.requests.find(r => r.slotId === slotId && r.decision !== 'declined'
      && (r.proposal ?? r).start === original.start && (r.proposal ?? r).end === original.end);
    if (body.freeOnly === true && booking) conflict();
    if (booking && (body.remove || booking.proposal || Date.parse(booking.end) <= Date.now())) conflict();
    // Detach just this occurrence. The series rule and the identities of its other bookings stay valid.
    const slots = c.slots.filter(s => s.id !== series.id);
    if (series.rule) slots.push({...series, excludedStarts:[...(series.excludedStarts ?? []), original.start]});
    let requests = c.requests;
    let proposal: Occurrence | undefined;
    if (body.remove !== true) {
      const validDate = (value: unknown): value is string => typeof value === 'string'
        && /^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(value) && Number.isFinite(Date.parse(value));
      if (!validDate(body.start) || !validDate(body.end) || Date.parse(body.end) <= Date.parse(body.start)) fail(400,'Invalid time slot.');
      if (booking && Date.parse(body.start) <= Date.now()) fail(400,'Choose a future time for this booking.');
      const title = body.title === undefined ? original.title : body.title;
      if (title != null && (typeof title !== 'string' || title.length > 200)) fail(400,'Invalid slot title.');
      const start = new Date(body.start).toISOString(), end = new Date(body.end).toISOString();
      const detachedId = body.detachedId;
      if (detachedId !== undefined && (!series.rule || typeof detachedId !== 'string' || !uuid.test(detachedId)
        || c.slots.some(s => s.id === detachedId) || c.requests.some(r => r.slotId === detachedId))) conflict();
      const edited: Slot = {id:series.rule ? detachedId ?? randomUUID() : series.id, start, end, timeZone:series.timeZone,
        ...(title?.trim() ? {title:title.trim()} : {}), ...bookingPlace(body, original), ...bookingDayFields({...body,start,end},series)};
      if (start === original.start && end === original.end && edited.title === original.title && !!edited.allDay === !!original.allDay &&
          edited.location === original.location && edited.videoCallURL === original.videoCallURL &&
          JSON.stringify(edited.structuredLocation) === JSON.stringify(original.structuredLocation)) {
        return {id, revision:c.revision};
      }
      if (slots.some(s => slotOverlaps(s,edited)) || heldTimes(c.requests.filter(r => r !== booking)).some(r => overlaps(edited, r))) fail(409, 'Time slots overlap.');
      if (slots.length >= 1000) fail(400, 'Too many time slots.');
      slots.push(edited);
      if (booking) {
        proposal = {...edited, id:randomUUID()};
        requests = c.requests.map(r => r === booking ? {...r, slotId:edited.id, proposal} : r);
      }
    }
    slots.sort((a,b) => a.start.localeCompare(b.start));
    const revision = c.revision+1;
    if (!await this.store.putJSONIfMatch(key,{...c,slots,requests,revision},row.etag)) conflict();
    if (booking && proposal) await this.notifyChange(c,booking,proposal,series.timeZone);
    return {id, revision};
  }

  @Put(':id/requests/:requestId/change-response')
  async answerChange(@Req() req: any, @Param('id') id: string, @Param('requestId') requestId: string, @Body() body: any) {
    const key = calendarKey(id), row = await this.store.getJSONWithETag(key);
    const c: BookCalendar = row?.value;
    const booking = c?.requests.find(r => r.id === requestId && r.guestId === req.principal.principalId);
    if (!row || c.archived || !booking) missing();
    const decision = body?.status;
    if (!['accepted','declined'].includes(decision) || !uuid.test(body?.proposalId)) fail(400,'Invalid booking response.');
    if (booking.answeredProposal?.id === body.proposalId && booking.answeredProposal.decision === decision) return {id:requestId};
    const proposed = booking.proposal;
    if (!proposed || proposed.id !== body.proposalId || (decision === 'accepted' && Date.parse(proposed.start) <= Date.now())) conflict();
    const {proposal, title, location, structuredLocation, videoCallURL, allDay, timeZone, ...previous} = booking;
    const updated: Booking = {...previous, ...proposed, id:booking.id, decision, answeredProposal:{id:proposed.id, decision}};
    const requests = c.requests.map(r => r === booking ? updated : r);
    if (!await this.store.putJSONIfMatch(key,{...c,requests,revision:c.revision+1},row.etag)) conflict();
    return {id:requestId};
  }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string, @Query('revision') revision: string) {
    const key = calendarKey(id), row = await this.store.getJSONWithETag(key);
    const c: BookCalendar = row?.value;
    if (!row || c.owner !== req.principal.principalId) missing();
    if (c.archived) return {id};
    if (c.revision !== Number(revision)) conflict();
    if (heldTimes(c.requests).some(r => Date.parse(r.end) > Date.now())) fail(409,'This calendar has active bookings.');
    if (!await this.store.putJSONIfMatch(key,{...c,archived:true,slots:[],revision:c.revision+1},row.etag)) conflict();
    return {id};
  }

  @Put(':id/requests/:requestId')
  async book(@Req() req: any, @Param('id') id: string, @Param('requestId') requestId: string, @Body() body: any) {
    if (!uuid.test(requestId)) fail(400,'Invalid booking.');
    const actor = req.principal.principalId, key = calendarKey(id);
    const row = await this.store.getJSONWithETag(key), c: BookCalendar = row?.value;
    if (!row || c.archived) missing();
    if (c.owner === actor) fail(400,'Choose a calendar belonging to another person.');
    const previous = c.requests.find(r => r.id === requestId);
    if (previous) {
      if (previous.guestId === actor && previous.slotId === body?.slotId) return {id:requestId};
      conflict();
    }
    const slot = occurrenceByID(c.slots,body?.slotId);
    if (!slot || Date.parse(slot.start) <= Date.now() || heldTimes(c.requests).some(r => overlaps(slot,r))) fail(409,'This time slot is no longer available.');
    const booking: Booking = {...slot,id:requestId,slotId:slot.id,guestId:actor,guestName:await this.displayName(actor),decision:'pending'};
    await this.store.putJSONIfAbsent(index(actor)+id+'.json',{id});
    if (!await this.store.putJSONIfMatch(key,{...c,revision:c.revision+1,requests:[...c.requests,booking]},row.etag)) conflict();
    return {id:requestId};
  }

  @Put(':id/requests/:requestId/cancel')
  async cancelBooking(@Req() req: any, @Param('id') id: string, @Param('requestId') requestId: string) {
    const key = calendarKey(id);
    const row = await this.store.getJSONWithETag(key), c: BookCalendar = row?.value;
    const booking = c?.requests.find(r => r.id === requestId && r.guestId === req.principal.principalId);
    if (!booking || c.archived) missing();
    if (booking.decision === 'declined') return {id:requestId};
    if (Math.max(Date.parse(booking.start),Date.parse(booking.proposal?.start ?? booking.start)) <= Date.now()) conflict();
    const {proposal, ...original} = booking;
    const cancelled: Booking = {...original, decision:'declined', cancelledByGuest:true};
    const requests = c.requests.map(r => r === booking ? cancelled : r);
    if (!await this.store.putJSONIfMatch(key,{...c,requests,revision:c.revision+1},row.etag)) conflict();
    return {id:requestId};
  }

  @Put(':id/requests/:requestId/decision')
  async decide(@Req() req: any, @Param('id') id: string, @Param('requestId') requestId: string, @Body() body: any) {
    const key = calendarKey(id), row = await this.store.getJSONWithETag(key), c: BookCalendar = row?.value;
    if (!row || c.owner !== req.principal.principalId || c.archived) missing();
    const r = c.requests.find(r => r.id === requestId);
    if (!r) fail(404,'Booking not found.');
    if (!['accepted','declined'].includes(body?.status)) fail(400,'Invalid booking decision.');
    if (r.proposal) conflict();
    if (r.decision === body.status) return {id:requestId};
    if (r.decision !== 'pending' || Date.parse(r.end) <= Date.now()) conflict();
    const requests = c.requests.map(item => item.id === requestId ? {...item,decision:body.status} : item);
    if (!await this.store.putJSONIfMatch(key,{...c,revision:c.revision+1,requests},row.etag)) conflict();
    return {id:requestId};
  }
}
