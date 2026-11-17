import { isDeepStrictEqual } from 'node:util';
import { StoreService } from '../store/store.service';
import { ApiResult, result } from '../common/api-result';

/** Account-scoped replicas of actual device calendars. No synthetic calendar is created. */
export class NativeCalendarStore {
  constructor(private readonly store: StoreService) {}
  private prefix(principal: any) { return `principal/${principal.principalId}/native-calendars/`; }
  private key(principal: any, id: string) { return `${this.prefix(principal)}${id}.json`; }
  private validID(id: unknown): id is string { return typeof id === 'string' && /^[a-zA-Z0-9_-]{1,128}$/.test(id); }

  async list(principal: any): Promise<any[]> {
    const keys = await this.store.listKeys(this.prefix(principal));
    return (await Promise.all(keys.map(key => this.store.getJSON(key)))).filter(Boolean);
  }

  async sync(principal: any, body: any): Promise<ApiResult> {
    if (!this.validID(body?.id) || !this.validID(body?.deviceId)) return result(400, { error: 'Invalid calendar identity.' });
    const key = this.key(principal, body.id);
    const stored = await this.store.getJSONWithETag(key);
    if (stored && stored.value.deviceId !== body.deviceId) return result(403, { error: 'Calendar belongs to another device.' });
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
      id: body.id, deviceId: body.deviceId, deviceName: String(body.deviceName ?? '').slice(0, 100),
      title: body.title.trim().slice(0, 200), source: String(body.source ?? 'Local Calendars').slice(0, 200),
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
        for (const field of ['notes', 'timeZone', 'availability', 'videoCallURL', 'alarms', 'recurrenceRules']) {
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
