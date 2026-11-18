import { isDeepStrictEqual } from 'node:util';
import { createHash } from 'node:crypto';
import { StoreService } from '../store/store.service';
import { ApiResult, result } from '../common/api-result';

const webBirthdaysID = 'system:birthdays';

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

  async list(principal: any): Promise<any[]> {
    const keys = await this.store.listKeys(this.prefix(principal));
    return (await Promise.all(keys.map(key => this.store.getJSON(key)))).filter(Boolean);
  }

  /** One provider calendar can have a replica on each device. Keep their storage
   * and merge baselines intact, but present the newest snapshot only once. */
  webCalendars(calendars: any[], removed: ReadonlySet<string> = new Set()): any[] {
    const seen = new Map<string, any>();
    const birthdays: any[] = [];
    for (const calendar of calendars.filter(c => c.available !== false)) {
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
    if (body.readOnly === true) return result(200, { calendar: stored?.value ?? null });
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
    const events = body.events.map((event: any) => {
      const old = oldEvents.get(event.id);
      return { ...event, updatedAt: old && isDeepStrictEqual(content(old), content(event)) ? old.updatedAt ?? now : now };
    });
    const calendar = {
      id: body.id, deviceId: stored?.value.deviceId ?? body.deviceId, deviceName: String(stored?.value.deviceName ?? body.deviceName ?? '').slice(0, 100),
      ...(body.accountLocal === true ? { accountLocal: true,
        sharingCalendarID: typeof body.sharingCalendarID === 'string' && /^[0-9a-f]{64}$/i.test(body.sharingCalendarID) ? body.sharingCalendarID : undefined } : {}),
      title: body.title.trim().slice(0, 200), source: String(body.source ?? 'Local Calendars').slice(0, 200),
      eventKitKind: ['birthdays', 'regular'].includes(body.eventKitKind) ? body.eventKitKind : stored?.value.eventKitKind,
      providerMirrorID: typeof body.providerMirrorID === 'string' && /^[0-9a-f]{64}$/i.test(body.providerMirrorID)
        ? body.providerMirrorID : stored?.value.providerMirrorID,
      color: /^#[0-9a-f]{6}$/i.test(body.color) ? body.color : '#0A84FF',
      allowsChanges: body.allowsChanges === true, available: body.available !== false,
      events, revision: (stored?.value.revision ?? 0) + 1, updatedAt: new Date().toISOString(),
    };
    const saved = stored
      ? await this.store.putJSONIfMatch(key, calendar, stored.etag)
      : await this.store.putJSONIfAbsent(key, calendar);
    return saved ? result(200, { calendar }) : result(409, { error: 'Calendar changed. Please retry.' });
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

  async mutate(principal: any, compositeID: string, body: any, deleting = false): Promise<ApiResult> {
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
      const previous = calendar.events.find((event: any) => event.id === eventID);
      if (!calendar.allowsChanges || calendar.available === false || previous?.readOnly) return result(403, { error: 'This calendar or event is read-only.' });
      if (deleting && !previous) return result(404, { error: 'Event not found.' });
      if (body?.expectedUpdatedAt && previous?.updatedAt !== body.expectedUpdatedAt) return result(409, { error: 'This event changed. Refresh before editing.' });
      if (!deleting && !previous && calendar.events.length >= 10000) return result(400, { error: 'This calendar has reached the event limit.' });
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
        for (const field of ['notes', 'timeZone', 'availability', 'videoCallURL', 'travelTime', 'attachments', 'structuredLocation', 'alarms', 'recurrenceRules']) {
          if (body[field] !== undefined) event.details[field] = body[field];
        }
        if (typeof event.details.availability === 'string') event.details.availability = ({ busy: 0, free: 1, tentative: 2, unavailable: 3 } as any)[event.details.availability] ?? 0;
        if (body.alarms) event.details.alarms = body.alarms.map((a: any) => ({ relativeOffset: a.relativeOffsetSeconds ?? a.relativeOffset }));
        if (body.recurrenceRules) event.details.recurrenceRules = body.recurrenceRules.map((r: any) => ({
          ...r, frequency: typeof r.frequency === 'string' ? ['daily', 'weekly', 'monthly', 'yearly'].indexOf(r.frequency) : r.frequency,
        }));
        event.updatedAt = new Date().toISOString();
      }
      const next = { ...calendar, revision: calendar.revision + 1, updatedAt: new Date().toISOString(),
        events: calendar.events.filter((item: any) => item.id !== eventID) };
      if (!deleting) next.events.push(event);
      if (await this.store.putJSONIfMatch(key, next, stored.etag)) {
        return deleting ? result(200, { deleted: true, sequence: next.revision })
          : result(previous ? 200 : 201, { event: this.eventForWeb(next, event) });
      }
    }
    return result(409, { error: 'Calendar changed. Please retry.' });
  }
}
