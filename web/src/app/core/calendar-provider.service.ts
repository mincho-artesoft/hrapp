import {Injectable,inject,signal} from '@angular/core';
import {CalendarPlatformApiService,DeviceCalendar,WebCalendarEvent} from './calendar-platform-api.service';
type Provider = 'google' | 'microsoft';
const providers: Provider[] = ['google', 'microsoft'];

@Injectable({providedIn:'root'})
export class CalendarProviderService {
 private api = inject(CalendarPlatformApiService);
 readonly calendars = signal<DeviceCalendar[]>([]);
 readonly events = signal<WebCalendarEvent[]>([]);
 readonly error = signal('');
 readonly loaded = signal<Set<string>>(new Set());
 private requests = new Map<Provider, Promise<void>>();
 private updated = new Map<Provider, number>();
 private errors = new Map<Provider, string>();
 private token: string | null = null;

 clear() {
   this.requests.clear();
   this.updated.clear();
   this.errors.clear();
   this.calendars.set([]);
   this.events.set([]);
   this.loaded.set(new Set());
   this.error.set('');
 }

 async refresh(force = false) {
   const token = this.api.token();
   if (this.token !== token) {
     this.clear();
     this.token = token;
   }
   if (!token) return;
   await Promise.all(providers.map(provider => this.refreshProvider(provider, force)));
 }

 private refreshProvider(provider: Provider, force: boolean): Promise<void> {
   if (!this.api.profile()?.connectedProviders?.[provider]?.connected) {
     this.requests.delete(provider);
     this.updated.delete(provider);
     if (this.loaded().has(provider)) {
       this.calendars.update(items => items.filter(c => c.provider !== provider));
       this.events.update(items => items.filter(e => e.provider !== provider));
       this.loaded.update(current => { const next = new Set(current); next.delete(provider); return next; });
     }
     if (this.errors.delete(provider)) this.error.set([...this.errors.values()].join(' '));
     return Promise.resolve();
   }
   const pending = this.requests.get(provider);
   if (pending) return pending;
   if (!force && Date.now() - (this.updated.get(provider) ?? 0) < 60000) return Promise.resolve();
   const now = new Date();
   const start = new Date(now.getFullYear() - 1, now.getMonth(), 1).toISOString();
   const end = new Date(now.getFullYear() + 2, now.getMonth(), 1).toISOString();
   const token = this.api.token();
   const current = () => this.requests.get(provider) === task && token === this.api.token();
   const task: Promise<void> = this.perform<{calendars: DeviceCalendar[]; events: WebCalendarEvent[]}>(provider, {
     action: 'state', start, end, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
   }).then(state => {
     if (!current()) return;
     this.calendars.update(items => [...items.filter(c => c.provider !== provider), ...state.calendars]);
     this.events.update(items => [...items.filter(e => e.provider !== provider), ...state.events]);
     this.loaded.update(items => new Set([...items, provider]));
     this.errors.delete(provider);
     this.updated.set(provider, Date.now());
   }).catch(error => {
     if (current()) this.errors.set(provider, error instanceof Error ? error.message : 'Could not refresh calendar.');
   }).finally(() => {
     if (!current()) return;
     this.requests.delete(provider);
     this.error.set([...this.errors.values()].join(' '));
   });
   this.requests.set(provider, task);
   return task;
 }

 // Discard snapshots started before the write. An interrupted initial load
 // still needs its other events, so replace that request in the background.
 private afterWrite(provider: Provider, needsSnapshot = false) {
   const interrupted = this.requests.delete(provider);
   if (needsSnapshot || interrupted || !this.loaded().has(provider)) return this.refreshProvider(provider, true);
   return Promise.resolve();
 }

 perform<T=any>(provider: Provider, body: unknown): Promise<T> { return this.api.providerCalendarRequest<T>(provider, body); }

 async saveCalendar(provider: Provider, calendar: DeviceCalendar | null, title: string, color: string) {
   const token = this.api.token();
   const result = await this.perform<{calendar?: DeviceCalendar}>(provider, {
     action: calendar ? 'update-calendar' : 'create-calendar', calendarID: calendar?.remoteID,
     title: !calendar || calendar.providerOwner && title !== calendar.title ? title : undefined, color, etag: calendar?.etag,
   });
   if (token !== this.api.token()) return;
   const saved = result.calendar;
   if (!saved) { await this.afterWrite(provider, true); return; }
   this.calendars.update(items => calendar ? items.map(c => c.id === saved.id ? saved : c) : [...items.filter(c => c.id !== saved.id), saved]);
   this.events.update(items => items.map(e => e.calendarId === saved.id ? {...e, calendarTitle:saved.title, color:saved.color} : e));
   void this.afterWrite(provider);
 }

 async deleteCalendar(calendar: DeviceCalendar) {
   const provider = calendar.provider!, token = this.api.token();
   await this.perform(provider, {action:calendar.providerOwner?'delete-calendar':'unsubscribe-calendar', calendarID:calendar.remoteID, etag:calendar.etag});
   if (token !== this.api.token()) return;
   this.calendars.update(items => items.filter(c => c.id !== calendar.id));
   this.events.update(items => items.filter(e => e.calendarId !== calendar.id));
   void this.afterWrite(provider);
 }
 async saveEvent(calendar:DeviceCalendar,event:WebCalendarEvent|undefined,values:any,clientRequestID?:string):Promise<WebCalendarEvent>{
  const patch = {...values};
  if (event) {
    // A full editor form also contains untouched display values. Sending them can replace
    // a provider's inherited reminders or rewrite the body of a formatted invitation.
    if (values.title === event.title) delete patch.title;
    if ((values.location || '') === (event.location || '')) delete patch.location;
    if ((values.notes || '') === (event.details?.notes || '')) delete patch.notes;
    for (const key of ['providerPrivacy','providerShowAs','providerDefaultReminders'] as const) {
      if (values[key] === event.details?.[key]) delete patch[key];
    }
    if (JSON.stringify(values.providerOtherReminders ?? []) === JSON.stringify(event.details?.providerOtherReminders ?? [])) delete patch.providerOtherReminders;
    if (values.availability === event.details?.availability) delete patch.availability;
    if (JSON.stringify(values.alarms) === JSON.stringify(event.details?.alarms)) delete patch.alarms;
    if (values.start && values.end && Date.parse(values.start) === Date.parse(event.start) &&
        Date.parse(values.end) === Date.parse(event.end) && !!values.allDay === !!event.allDay &&
        values.timeZone === event.details?.timeZone) {
      delete patch.start;
      delete patch.end;
    }
  }
  if (calendar.provider === 'google' && (patch.alarms !== undefined || patch.providerDefaultReminders !== undefined || patch.providerOtherReminders !== undefined)) {
    patch.providerOtherReminders = values.providerOtherReminders ?? event?.details?.providerOtherReminders ?? [];
    patch.providerDefaultReminders = values.providerDefaultReminders ?? event?.details?.providerDefaultReminders ?? false;
    if (!patch.providerDefaultReminders) patch.alarms ??= event?.details?.alarms ?? [];
  }
  const token = this.api.token(), provider = calendar.provider!;
  const result = await this.perform<{eventID: string; event?: WebCalendarEvent}>(provider, {
    action:'save-event', calendarID:calendar.remoteID, eventID:event?.remoteID, etag:event?.providerEtag, event:patch, clientRequestID,
    calendarTimeZone:calendar.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  if (token !== this.api.token()) throw new Error('The calendar account changed.');
  const saved = result.event && {...result.event, calendarTitle:calendar.title, color:calendar.color};
  if (saved && (event || !patch.recurrenceRules?.length)) {
    this.events.update(items => [...items.filter(e => e.id !== saved.id), saved]);
    void this.afterWrite(provider);
    return saved;
  }
  // Recurring creates return the series master. The calendar displays its expanded occurrences.
  await this.afterWrite(provider, true);
  if (token !== this.api.token()) throw new Error('The calendar account changed.');
  const sameCalendar = this.events().filter(item => item.provider === calendar.provider && item.providerCalendarID === calendar.remoteID);
  const stored = sameCalendar.find(item => item.remoteID === result.eventID)
    ?? sameCalendar.find(item => item.providerSeriesID === result.eventID)
    ?? (result.event && {...result.event, calendarTitle:calendar.title, color:calendar.color});
  if(!stored)throw new Error('Saved to the provider. Refresh this calendar to view the event.');return stored;
 }
 async deleteEvent(event: WebCalendarEvent) {
   const provider = event.provider!, token = this.api.token();
   await this.perform(provider, {action:'delete-event', calendarID:event.providerCalendarID, eventID:event.remoteID, etag:event.providerEtag});
   if (token !== this.api.token()) return;
   this.events.update(items => items.filter(e => e.id !== event.id && !(e.calendarId === event.calendarId && e.providerSeriesID === event.remoteID)));
   void this.afterWrite(provider);
 }
}
