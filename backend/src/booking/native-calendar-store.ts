import { nextRevisionTimestamp } from '../util/revision';
import { isDeepStrictEqual } from 'node:util';
import { createHash } from 'node:crypto';
import { StoreService } from '../store/store.service';
import { occurrenceByID, Slot, splitBookingSeries } from './booking-schedule';
import { ApiResult, result } from '../common/api-result';

const webBirthdaysID = 'system:birthdays';
const inventoryReadBatchSize = 4;

function isAppleBirthdays(calendar: any): boolean {
  if (calendar.allowsChanges !== false || calendar.accountLocal || calendar.providerMirrorID) return false;
  if (calendar.eventKitKind) return calendar.eventKitKind === 'birthdays';
  // Older clients only sent the EventKit source, a localized title and contact URLs.
  if (!/^(Other|Други)$/iu.test(calendar.source)) return false;
  if (calendar.events?.length) {
    return calendar.events.every((e: any) => e.allDay && /^addressbook:\/\//i.test(e.url ?? ''));
  }
  return /^(Birthdays|Рождени дни)$/iu.test(calendar.title);
}

function birthdayCalendar(copies: any[]) {
  const ordered = copies.slice().sort((a, b) =>
    String(b.updatedAt ?? '').localeCompare(String(a.updatedAt ?? '')) || a.id.localeCompare(b.id));
  const events = new Map<string, any>();
  const formatters = new Map<string, Intl.DateTimeFormat>();
  for (const calendar of ordered) {
    const counts = new Map<string, number>();
    for (const event of calendar.events ?? []) {
      let day = event.start.slice(0, 10);
      const zone = event.details?.timeZone;
      if (zone) {
        try {
          let formatter = formatters.get(zone);
          if (!formatter) {
            formatter = new Intl.DateTimeFormat('en-CA', {timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit'});
            formatters.set(zone, formatter);
          }
          day = formatter.format(new Date(event.start));
        } catch { /* Older clients can send an unknown time zone. */ }
      }
      // Contact identifiers are device-local. Keep the maximum multiplicity per
      // device so two contacts with the same name and birthday are preserved.
      const key = JSON.stringify([event.title.trim().normalize('NFC'), day]);
      const index = counts.get(key) ?? 0;
      counts.set(key, index + 1);
      const id = createHash('sha256').update(key + ':' + index).digest('hex');
      if (!events.has(id)) events.set(id, {...event, id, readOnly: true});
    }
  }
  return {...ordered[0], id: webBirthdaysID, deviceName: '', eventKitKind: 'birthdays', events: [...events.values()]};
}

/** Account-scoped replicas of actual device calendars. No synthetic calendar is created. */
export class NativeCalendarStore {
  constructor(private readonly store: StoreService) {}
  private prefix(principal: any) { return `principal/${principal.principalId}/native-calendars/`; }
  private key(principal: any, id: string) { return `${this.prefix(principal)}${id}.json`; }
  private removedPrefix(principal: any) { return `principal/${principal.principalId}/web-calendar-removed/`; }
  private validID(id: unknown): id is string { return typeof id === 'string' && /^[a-zA-Z0-9_-]{1,128}$/.test(id); }

  private async readCalendar(key: string, listedETag?: string) {
    // Earlier clients archived the whole last snapshot when deleting an account calendar.
    const calendar = await this.store.getJSON(key, listedETag);
    if (!calendar?.accountLocal || calendar.available !== false || !calendar.events?.length) return calendar;
    const row = await this.store.getJSONWithETag(key);
    if (!row?.value.accountLocal || row.value.available !== false || !row.value.events?.length) return row?.value;
    const cleared = {...row.value, deletedEventIds: row.value.events.map((e: any) => e.id), events: []};
    if (await this.store.putJSONIfMatch(key, cleared, row.etag)) return cleared;
    return this.readCalendar(key);
  }

  async list(principal: any, scope: 'all' | 'account' = 'all'): Promise<any[]> {
    const versions = new Map<string, string>();
    const keys = await this.store.listKeys(this.prefix(principal), versions, scope);
    const rows = new Array<any>(keys.length);
    let next = 0;
    // Keep the storage concurrency limit while slower documents are in flight.
    // On failure stop taking work and drain active reads before a caller retries.
    let stopped = false;
    const readNext = async () => {
      while (!stopped && next < keys.length) {
        const index = next++, key = keys[index];
        try {
          rows[index] = await this.readCalendar(key, versions.get(key));
        } catch (error) {
          stopped = true;
          throw error;
        }
      }
    };
    const workers = await Promise.allSettled(Array.from({length: Math.min(keys.length, inventoryReadBatchSize)}, readNext));
    for (const worker of workers) if (worker.status === 'rejected') throw worker.reason;
    const calendars = rows.filter(Boolean);
    // A client that lost its binding used to hash its imported local ID again.
    // Confirm an exact copy before remembering the relationship. Keep the
    // complete snapshot so independent edits on an older client can recover it.
    const byID = new Map(calendars.map(calendar => [calendar.id, calendar]));
    for (const original of calendars) {
      if (!original.accountLocal || original.available === false) continue;
      const copyID = createHash('sha256').update('app-local:account:' + original.id).digest('hex');
      const copy = byID.get(copyID);
      if (!copy?.accountLocal || copy.available === false || copy.duplicateOf ||
          copy.title !== original.title || copy.color !== original.color || copy.sharingCalendarID !== original.sharingCalendarID ||
          copy.allowsChanges !== original.allowsChanges || copy.events.length !== original.events.length) continue;
      const events = new Map(original.events.map(({updatedAt, ...event}) => [event.id, event]));
      if (!copy.events.every(({updatedAt, ...event}) => isDeepStrictEqual(event, events.get(event.id)))) continue;
      const key = this.key(principal, copyID);
      const current = await this.store.getJSONWithETag(key);
      if (!current || current.value.revision !== copy.revision) continue;
      if (await this.store.putJSONIfMatch(key, {...current.value, duplicateOf: original.id}, current.etag)) copy.duplicateOf = original.id;
    }
    return calendars;
  }

  /** One provider calendar can have a replica on each device. Keep their storage
   * and merge baselines intact, but present the newest snapshot only once. */
  webCalendars(calendars: any[], removed: ReadonlySet<string> = new Set()): any[] {
    const seen = new Map<string, any>();
    const birthdays: any[] = [];
    for (const calendar of calendars.filter(c => c.available !== false && !c.duplicateOf)) {
      if (isAppleBirthdays(calendar)) {
        birthdays.push(calendar);
        continue;
      }
      if (removed.has(calendar.id)) continue;
      const identity = calendar.providerMirrorID ? `provider:${calendar.providerMirrorID}` : `calendar:${calendar.id}`;
      const previous = seen.get(identity);
      if (!previous || String(calendar.updatedAt ?? '') > String(previous.updatedAt ?? '')) seen.set(identity, calendar);
    }
    if (birthdays.length && !removed.has(webBirthdaysID)) seen.set(webBirthdaysID, birthdayCalendar(birthdays));
    return [...seen.values()];
  }

  async listForWeb(principal: any): Promise<any[]> {
    const prefix = this.removedPrefix(principal);
    const [calendars, removed] = await Promise.all([this.list(principal), this.store.listKeys(prefix)]);
    return this.webCalendars(calendars, new Set(removed.map(key => key.slice(prefix.length, -5))));
  }

  async reconcileDeletion(principal: any, calendar: any, cleanup: () => Promise<void>) {
    const key = this.key(principal, calendar.id);
    const stored = await this.store.getJSONWithETag(key);
    if (!stored?.value.accountLocal || stored.value.available !== false || stored.value.deletionReconciled) return;
    await cleanup();
    await this.store.putJSONIfMatch(key, {...stored.value, deletionReconciled: true}, stored.etag);
  }

  async removeFromWeb(principal: any, id: string): Promise<ApiResult> {
    if (id !== webBirthdaysID) {
      if (!this.validID(id)) return result(400, {error: 'Invalid calendar.'});
      const calendar = await this.store.getJSON(this.key(principal, id));
      if (!calendar) return result(404, {error: 'Calendar not found.'});
      if (calendar.accountLocal) return result(400, {error: 'Use the account calendar action.'});
      if (isAppleBirthdays(calendar)) id = webBirthdaysID;
    }
    await this.store.putJSONIfAbsent(this.removedPrefix(principal) + id + '.json', {removed: true});
    return result(200, {removed: true});
  }

  async sync(principal: any, body: any): Promise<ApiResult> {
    if (!this.validID(body?.id) || !this.validID(body?.deviceId)) return result(400, { error: 'Invalid calendar identity.' });
    const key = this.key(principal, body.id);
    const stored = await this.store.getJSONWithETag(key);
    if (stored && stored.value.deviceId !== body.deviceId && stored.value.accountLocal !== true) return result(403, { error: 'Calendar belongs to another device.' });
    if (stored && (body.accountLocal === true) !== (stored.value.accountLocal === true) && body.readOnly !== true) return result(403, { error: 'Calendar scope cannot be changed.' });
    if (body.readOnly === true) return result(200, { calendar: stored?.value.accountLocal && stored.value.available === false
      ? await this.readCalendar(key) : stored?.value ?? null });
    if (stored?.value.duplicateOf && body.available === false) return result(409, {error: 'Use the original calendar.'});
    if (stored?.value.accountLocal && stored.value.available === false) {
      if (body.available === false) return result(200, {calendar: await this.readCalendar(key)});
      return result(409, {error: 'This account calendar was deleted.'});
    }
    if (!Number.isInteger(body.expectedRevision) || body.expectedRevision !== (stored?.value.revision ?? 0)) {
      return result(409, { error: 'Calendar changed. Refresh and merge before retrying.' });
    }
    if (!Array.isArray(body.events) || body.events.length > 10000 || typeof body.title !== 'string' || !body.title.trim()) {
      return result(400, { error: 'A calendar name and at most 10000 events are required.' });
    }
    const ids = new Set<string>();
    for (const event of body.events) {
      if (!this.validID(event?.id) || ids.has(event.id) || typeof event.title !== 'string'
          || !Number.isFinite(Date.parse(event.start)) || !Number.isFinite(Date.parse(event.end))
          || Date.parse(event.end) < Date.parse(event.start)) return result(400, { error: 'Invalid or duplicate event.' });
      ids.add(event.id);
    }
    const now = new Date().toISOString();
    const oldEvents = new Map<string, any>((stored?.value.events ?? []).map((event: any) => [event.id, event]));
    const content = ({ updatedAt, ...event }: any) => event;
    const events = body.events.map(({ placementId: _clientPlacement, ...fields }: any) => {
      const old = oldEvents.get(fields.id);
      // Placement is assigned by the shared-event endpoint. Native clients only round-trip event fields.
      const event = old?.placementId ? {...fields, placementId: old.placementId, readOnly: old.readOnly} : fields;
      return { ...event, updatedAt: old && isDeepStrictEqual(content(old), content(event)) ? old.updatedAt ?? now : nextRevisionTimestamp(old?.updatedAt, Date.parse(now)) };
    });
    const calendar = {
      id: body.id, deviceId: stored?.value.deviceId ?? body.deviceId, deviceName: String(stored?.value.deviceName ?? body.deviceName ?? '').slice(0, 100),
      ...(body.accountLocal === true ? { accountLocal: true,
        sharingCalendarID: typeof body.sharingCalendarID === 'string' && /^[0-9a-f]{64}$/i.test(body.sharingCalendarID) ? body.sharingCalendarID : stored?.value.sharingCalendarID } : {}),
      title: body.title.trim().slice(0, 200), source: String(body.source ?? 'Local Calendars').slice(0, 200),
      eventKitKind: ['birthdays', 'regular'].includes(body.eventKitKind) ? body.eventKitKind : stored?.value.eventKitKind,
      providerMirrorID: typeof body.providerMirrorID === 'string' && /^[0-9a-f]{64}$/i.test(body.providerMirrorID)
        ? body.providerMirrorID : stored?.value.providerMirrorID,
      color: /^#[0-9a-f]{6}$/i.test(body.color) ? body.color : '#0A84FF',
      allowsChanges: body.allowsChanges === true, available: body.available !== false,
      ...(body.accountLocal && body.available === false
        ? {deletedEventIds: [...oldEvents.keys()], events: []} : {events}),
      revision: (stored?.value.revision ?? 0) + 1, updatedAt: new Date().toISOString(),
    };
    if (stored?.value.duplicateOf && calendar.title === stored.value.title && calendar.color === stored.value.color &&
        calendar.sharingCalendarID === stored.value.sharingCalendarID && calendar.allowsChanges === stored.value.allowsChanges &&
        events.length === oldEvents.size && events.every(event => event.updatedAt === oldEvents.get(event.id)?.updatedAt)) {
      return result(200, {calendar: stored.value});
    }
    const saved = stored
      ? await this.store.putJSONIfMatch(key, calendar, stored.etag)
      : await this.store.putJSONIfAbsent(key, calendar);
    return saved ? result(200, { calendar }) : result(409, { error: 'Calendar changed. Please retry.' });
  }

  async setSharedCopy(principal: any, calendarId: string, eventId: string, event: any | null, previous: any): Promise<void> {
    const key = this.key(principal, calendarId);
    for (let attempt = 0; attempt < 6; attempt++) {
      const row = await this.store.getJSONWithETag(key);
      if (!row || row.value.available === false) {
        if (!event) return;
        throw new Error('Calendar was removed.');
      }
      if (!row.value.allowsChanges) throw new Error('Calendar is read-only.');
      const current = row.value.events.find((e: any) => e.id === eventId);
      if (event && current?.placementId === event.placementId) return;
      if (!event && !current) return;
      if (event ? !!current : current.updatedAt !== previous?.updatedAt) throw new Error('Calendar event changed. Refresh and retry.');
      const now = new Date().toISOString();
      const events = row.value.events.filter((e: any) => e.id !== eventId);
      if (event) events.push({...event, id: eventId, updatedAt: now});
      if (await this.store.putJSONIfMatch(key, {...row.value, events, updatedAt: now, revision: row.value.revision + 1}, row.etag)) return;
    }
    throw new Error('Calendar changed. Refresh and retry.');
  }

  async removeDeletedShare(principalId: string, calendarId: string, eventId: string, placementId: string) {
    const key = this.key({principalId}, calendarId);
    for (let attempt = 0; attempt < 6; attempt++) {
      const row = await this.store.getJSONWithETag(key);
      if (!row || !row.value.events?.some((e: any) => e.id === eventId && e.placementId === placementId)) return;
      const events = row.value.events.filter((e: any) => e.id !== eventId);
      if (await this.store.putJSONIfMatch(key, {...row.value, events, updatedAt: new Date().toISOString(), revision: row.value.revision + 1}, row.etag)) return;
    }
    throw new Error('Shared copy changed while removing a deleted event.');
  }

  eventForWeb(calendar: any, event: any): any {
    const details = { ...event.details };
    if (typeof details.availability === 'number') details.availability = ['busy', 'free', 'tentative', 'unavailable'][details.availability] ?? 'busy';
    if (Array.isArray(details.alarms)) details.alarms = details.alarms.map((alarm: any) => ({
      ...alarm, relativeOffsetSeconds: alarm.relativeOffsetSeconds ?? alarm.relativeOffset,
    }));
    if (Array.isArray(details.recurrenceRules)) details.recurrenceRules = details.recurrenceRules.map((rule: any) => ({
      ...rule, frequency: typeof rule.frequency === 'number' ? ['daily', 'weekly', 'monthly', 'yearly'][rule.frequency] : rule.frequency,
    }));
    return { ...event, details, id: `native.${calendar.id}.${event.id}`, calendarId: calendar.id,
      color: calendar.color, calendarTitle: calendar.title,
      readOnly: !calendar.allowsChanges || event.readOnly === true || calendar.available === false };
  }

  private planOccurrenceMove(previous: any, move: any) {
    const rules = previous?.details?.recurrenceRules;
    if (!Array.isArray(rules) || !rules.length || !['this','future'].includes(move.scope) || typeof move.allDay !== 'boolean') return;
    const stamps = [move.originalStart, move.start, move.end];
    if (!stamps.every(value => typeof value === 'string' && Number.isFinite(Date.parse(value))) || Date.parse(move.start) >= Date.parse(move.end)) return;
    const [original, start, end] = stamps.map(value => new Date(value).toISOString());
    const seed = new Date(previous.start).toISOString(), excluded: string[] = (previous.details.excludedStarts ?? []).map((v:string) => new Date(v).toISOString());
    const id = original === seed ? previous.id : previous.id + '@' + Date.parse(original);
    const series: Slot[] = rules.map(rule => ({id:previous.id, start:seed, end:new Date(previous.end).toISOString(),
      timeZone:previous.details.timeZone || 'UTC', excludedStarts:excluded,
      rule:{...Object.fromEntries(Object.entries(rule).filter(([,v]) => v != null)), frequency:rule.frequency, interval:rule.interval ?? 1}}));
    if (!series.some(s => occurrenceByID([s],id))) return;
    const stamp = nextRevisionTimestamp(previous.updatedAt);
    const seriesID = /^[0-9a-f]{64}$/i.test(previous.id) ? previous.id : createHash('sha256').update(previous.id).digest('hex');
    const occurrenceID = createHash('sha256').update('occurrence:' + seriesID + ':' + Date.parse(original)).digest('hex');
    const moved = {...previous, id:occurrenceID, start, end, allDay:move.allDay,
      updatedAt:stamp, details:{...previous.details,recurrenceRules:[]}};
    delete moved.placementId;
    delete moved.details.excludedStarts;
    const retained = {...previous, updatedAt:stamp, details:{...previous.details}};
    if (move.scope === 'this') {
      retained.details.excludedStarts = [...new Set([...excluded,original])].sort();
      return [retained,moved];
    }
    const splits = series.filter(s => !s.rule.endDate || Date.parse(s.rule.endDate) >= Date.parse(original))
      .map(s => splitBookingSeries(s,original,start,end,moved.id));
    moved.details.recurrenceRules = splits.flatMap(s => s.future.rule ? [s.future.rule] : []);
    const shifted = [...new Set(splits.flatMap(s => s.future.excludedStarts ?? []))].sort();
    if (shifted.length) moved.details.excludedStarts = shifted;
    if (original === seed) return [{...moved,id:previous.id, ...(previous.placementId ? {placementId:previous.placementId} : {})}];
    retained.details.recurrenceRules = rules.map(rule => rule.endDate && Date.parse(rule.endDate) < Date.parse(original) ? rule :
      {...rule, occurrenceCount:null, endDate:new Date(Date.parse(original)-1000).toISOString()});
    retained.details.excludedStarts = excluded.filter(date => date < original);
    return [retained,moved];
  }

  async mutate(principal: any, compositeID: string, body: any, deleting = false, accountLocalOnly = false): Promise<ApiResult> {
    const parts = compositeID.split('.');
    const calendarID = parts[0] === 'native' ? parts[1] : body?.calendarId;
    const eventID = parts[0] === 'native' ? parts[2] : compositeID;
    if ((parts[0] === 'native' && parts.length !== 3) || !this.validID(calendarID) || !this.validID(eventID)) return result(400, { error: 'Choose a calendar.' });
    if (body?.calendarId && body.calendarId !== calendarID) return result(400, { error: 'Moving between calendars is not supported here.' });
    const key = this.key(principal, calendarID);
    for (let attempt = 0; attempt < 5; attempt++) {
      const stored = await this.store.getJSONWithETag(key);
      if (!stored) return result(404, { error: 'Calendar not found.' });
      const calendar = stored.value;
      if (calendar.duplicateOf) return result(409, {error: 'Refresh to edit the original calendar.'});
      if (accountLocalOnly && !calendar.accountLocal) return result(403, {error: 'Choose an account calendar.'});
      const previous = calendar.events.find((event: any) => event.id === eventID);
      if (!calendar.allowsChanges || calendar.available === false || previous?.readOnly) return result(403, { error: 'This calendar or event is read-only.' });
      if (deleting && !previous) return result(404, { error: 'Event not found.' });
      if (body?.expectedUpdatedAt && previous?.updatedAt !== body.expectedUpdatedAt) return result(409, { error: 'This event changed. Refresh before editing.' });
      if (!deleting && !previous && calendar.events.length >= 10000) return result(400, { error: 'This calendar has reached the event limit.' });
      if (body?.occurrenceMove && !deleting) {
        if (!accountLocalOnly || !calendar.accountLocal || !previous) return result(400,{error:'Choose a local recurring event.'});
        let changed: any[];
        try { changed = this.planOccurrenceMove(previous,body.occurrenceMove); } catch { /* Unsupported or stale recurrence. */ }
        if (!changed) return result(409,{error:'This occurrence changed. Refresh before editing.'});
        if (changed.some(item => item.id !== eventID && calendar.events.some(e => e.id === item.id))) {
          return result(409,{error:'This occurrence was already moved. Refresh before editing.'});
        }
        if (calendar.events.length + changed.length - 1 > 10000) return result(400,{error:'This calendar has reached the event limit.'});
        const next = {...calendar, revision:calendar.revision+1, updatedAt:new Date().toISOString(),
          events:[...calendar.events.filter((e:any) => e.id !== eventID), ...changed]};
        if (await this.store.putJSONIfMatch(key,next,stored.etag)) return result(200,{
          changedEvents:changed.map(e => this.eventForWeb(next,e)), sharingCalendarID:calendar.sharingCalendarID ?? null});
        continue;
      }
      const event = { ...previous, id: eventID };
      if (!deleting) {
        for (const field of ['title', 'start', 'end', 'allDay', 'location', 'url']) {
          if (body[field] !== undefined) event[field] = body[field];
        }
        if (typeof event.title !== 'string' || !event.title.trim() || !Number.isFinite(Date.parse(event.start))
            || !Number.isFinite(Date.parse(event.end)) || Date.parse(event.end) <= Date.parse(event.start)) {
          return result(400, { error: 'A title and valid event dates are required.' });
        }
        event.title = event.title.trim().slice(0, 1000);
        event.details = { availability: 0, alarms: [], recurrenceRules: [], attendees: [], ...previous?.details };
        if (body.url !== undefined && (accountLocalOnly || 'url' in event.details)) event.details.url = body.url;
        for (const field of ['notes', 'timeZone', 'availability', 'providerPrivacy', 'providerShowAs', 'providerDefaultReminders', 'providerOtherReminders', 'videoCallURL', 'travelTime', 'attachments', 'structuredLocation', 'alarms', 'recurrenceRules']) {
          if (body[field] !== undefined) event.details[field] = body[field];
        }
        if (typeof event.details.availability === 'string') event.details.availability = ({ busy: 0, free: 1, tentative: 2, unavailable: 3 } as any)[event.details.availability] ?? 0;
        if (Array.isArray(body.alarms)) event.details.alarms = body.alarms.map(({relativeOffsetSeconds, ...alarm}: any) => ({
          ...alarm, relativeOffset: alarm.absoluteDate ? null : relativeOffsetSeconds ?? alarm.relativeOffset,
        }));
        if (body.recurrenceRules) event.details.recurrenceRules = body.recurrenceRules.map((r: any) => ({
          ...r, frequency: typeof r.frequency === 'string' ? ['daily', 'weekly', 'monthly', 'yearly'].indexOf(r.frequency) : r.frequency,
        }));
        event.updatedAt = nextRevisionTimestamp(previous?.updatedAt);
      }
      const next = { ...calendar, revision: calendar.revision + 1, updatedAt: new Date().toISOString(),
        events: calendar.events.filter((item: any) => item.id !== eventID) };
      if (!deleting) next.events.push(event);
      if (await this.store.putJSONIfMatch(key, next, stored.etag)) {
        const sharingCalendarID = calendar.sharingCalendarID ?? null;
        return deleting ? result(200, { deleted: true, sequence: next.revision, sharingCalendarID })
          : result(previous ? 200 : 201, { event: this.eventForWeb(next, event), sharingCalendarID });
      }
    }
    return result(409, { error: 'Calendar changed. Please retry.' });
  }
}
