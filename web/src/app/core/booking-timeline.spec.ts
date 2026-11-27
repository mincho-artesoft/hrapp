import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CalendarPlatformApiService } from './calendar-platform-api.service';
import { bookingTimelineEvents } from './booking-timeline';
import { Appointment, BookingCalendar, BookingTimelineMove, BookingWorkspace, isBookingHistory } from './booking-workspace';

describe('booking timeline drops', () => {
  const interval = (hour: number) => ({
    start: new Date(Date.UTC(2099, 0, 1, hour)).toISOString(),
    end: new Date(Date.UTC(2099, 0, 1, hour + 1)).toISOString(),
  });
  const slot = {id: 'lesson', title: 'Lesson', ...interval(9)};
  const schedule: BookingCalendar = {id: 'studio', title: 'Studio', revision: 1, slots: [slot], requests: []};
  const move: BookingTimelineMove = {calendarId: schedule.id, revision: 1, slotId: slot.id, ...interval(13)};
  const events = (calendar: BookingCalendar, moves: BookingTimelineMove[]) =>
    bookingTimelineEvents(calendar, new Date('2099-01-01'), new Date('2099-01-02'), label => label, moves);

  it('keeps the new time through a stale refresh and a failed follow-up read', async () => {
    let server = schedule;
    let offline = false;
    let acknowledge!: (receipt: {revision: number}) => void;
    const write = new Promise(resolve => { acknowledge = resolve; });
    const api = {token: signal('test'), nativeCalendarRequest: async (_: string, method: string) => {
      if (method === 'PUT') return write;
      if (offline) throw new Error('Offline');
      return {calendars: [server], appointments: []};
    }};
    TestBed.configureTestingModule({providers: [BookingWorkspace, {provide: CalendarPlatformApiService, useValue: api}]});
    const workspace = TestBed.inject(BookingWorkspace);
    TestBed.flushEffects();
    await workspace.refresh();
    const displayed = () => events(workspace.data().calendars[0], workspace.pendingMoves()).map(event => event.start);
    const saving = workspace.moveOccurrence(move);
    expect(displayed()).toEqual([move.start]);
    await workspace.refresh();
    expect(displayed()).toEqual([move.start]);
    offline = true;
    acknowledge({revision: 2});
    await saving;
    await workspace.refresh();
    expect(displayed()).toEqual([move.start]);
    offline = false;
    server = {...schedule, revision: 2, slots: [{...slot, ...interval(13)}]};
    await workspace.refresh();
    expect(workspace.pendingMoves()).toEqual([]);
    expect(displayed()).toEqual([move.start]);
  });

  it('keeps a native exclusion when its timestamp omits fractional seconds', () => {
    const series = {...slot, rule: {frequency: 0, interval: 1}, excludedStarts: [slot.start.replace('.000Z', 'Z')]};
    const moved = {...slot, id: 'detached', ...interval(13)};
    expect(events({...schedule, slots: [series, moved]}, []).map(e => e.start)).toEqual([moved.start]);
  });

  it('restores the saved time when the server rejects the drop', async () => {
    const api = {token: signal('test'), nativeCalendarRequest: async (_: string, method: string) => {
      if (method === 'PUT') throw new Error('Time slots overlap.');
      return {calendars: [schedule], appointments: []};
    }};
    TestBed.configureTestingModule({providers: [BookingWorkspace, {provide: CalendarPlatformApiService, useValue: api}]});
    const workspace = TestBed.inject(BookingWorkspace);
    TestBed.flushEffects();
    await workspace.refresh();
    const saving = workspace.moveOccurrence(move);
    const displayed = () => events(workspace.data().calendars[0], workspace.pendingMoves())[0];
    expect(displayed().start).toBe(move.start);
    expect(displayed().readOnly).toBeFalse();
    await expectAsync(saving).toBeRejectedWithError('Time slots overlap.');
    expect(displayed().start).toBe(slot.start);
  });

  it('keeps a detached free occurrence editable and orders writes before an editor save', async () => {
    const series = {...slot, rule: {frequency: 0, interval: 1, occurrenceCount: 3}};
    const calendar = {...schedule, slots: [series]};
    type Update = {revision: number; detachedId?: string};
    const writes: {path: string; body: Update}[] = [];
    let acknowledge!: (value: {revision: number}) => void;
    const firstWrite = new Promise(resolve => { acknowledge = resolve; });
    const api = {token: signal('test'), nativeCalendarRequest: async (path: string, method: string, body: Update) => {
      if (method === 'GET') return {calendars: [calendar], appointments: []};
      writes.push({path, body});
      return writes.length === 1 ? firstWrite : {revision: body.revision + 1};
    }};
    TestBed.configureTestingModule({providers: [BookingWorkspace, {provide: CalendarPlatformApiService, useValue: api}]});
    const workspace = TestBed.inject(BookingWorkspace);
    TestBed.flushEffects();
    await workspace.refresh();
    const first = workspace.moveOccurrence(move);
    const id = writes[0].body.detachedId;
    if (!id) throw new Error('Missing detached occurrence ID');
    const preview = () => events(workspace.data().calendars[0], workspace.pendingMoves());
    expect(preview().map(r => [r.id, r.start, r.readOnly])).toEqual([['slot-' + id, move.start, false]]);
    const second = workspace.moveOccurrence({...move, slotId: id, revision: 2, ...interval(15)});
    const editor = workspace.request('/studio/occurrences/' + id, 'PUT', {revision: 3, title: 'Updated'});
    await workspace.refresh();
    expect(preview()[0].start).toBe(interval(15).start);
    expect(writes.length).toBe(1);
    acknowledge({revision: 2});
    await Promise.all([first, second, editor]);
    expect(writes.map(w => w.body.revision)).toEqual([1, 2, 3]);
    expect(writes[1].path).toBe('/booking-calendars/studio/occurrences/' + id);
    expect(preview()[0].start).toBe(interval(15).start);
  });

  it('restores the first saved move when a subsequent move overlaps another slot', async () => {
    let acknowledge!: (receipt: {revision: number}) => void;
    const firstWrite = new Promise(resolve => { acknowledge = resolve; });
    const api = {token: signal('test'), nativeCalendarRequest: async (_: string, method: string, body?: {revision: number}) => {
      if (method === 'GET') return {calendars: [schedule], appointments: []};
      if (body?.revision === 1) return firstWrite;
      throw new Error('Time slots overlap.');
    }};
    TestBed.configureTestingModule({providers: [BookingWorkspace, {provide: CalendarPlatformApiService, useValue: api}]});
    const workspace = TestBed.inject(BookingWorkspace);
    TestBed.flushEffects();
    await workspace.refresh();
    const first = workspace.moveOccurrence(move);
    const second = workspace.moveOccurrence({...move, ...interval(15), revision: 2});
    const displayed = () => events(workspace.data().calendars[0], workspace.pendingMoves())[0];
    expect(displayed().start).toBe(interval(15).start);
    acknowledge({revision: 2});
    await first;
    await expectAsync(second).toBeRejectedWithError('Time slots overlap.');
    await workspace.refresh();
    expect(displayed().start).toBe(move.start);
    expect(displayed().readOnly).toBeFalse();
  });

  it('renders one reservation at the proposed time while holding both intervals', () => {
    const request = {...slot, id: 'reservation', slotId: slot.id, status: 'accepted' as const,
      hostName: 'Host', guestName: 'Guest', calendarId: schedule.id, calendarTitle: schedule.title};
    const reserved = {...schedule, requests: [request]};
    const rows = events(reserved, [{...move, requestId: request.id}]);
    expect(rows.map(row => [row.id, row.start])).toEqual([
      ['request-reservation', move.start],
    ]);
    const persisted = {...reserved, requests: [{...request, proposal: {...slot, ...move}}]};
    expect(events(persisted, []).map(e => [e.id, e.start, e.readOnly])).toEqual([['request-reservation', move.start, true]]);
    expect(events(persisted, [{...move, requestId: request.id}]).length).toBe(1);
    expect(events(reserved, []).map(row => row.start)).toEqual([slot.start]);
  });
});

describe('in-app booking change notices', () => {
  it('moves ended or declined reservations to history using the effective end of a proposed time', () => {
    const end = new Date(Date.now() - 60_000).toISOString();
    const later = new Date(Date.now() + 3_600_000).toISOString();
    const r: Appointment = {id:'request', slotId:'slot', start:end, end, calendarId:'studio', calendarTitle:'Studio',
      guestName:'Guest', hostName:'Host', status:'accepted'};
    expect(isBookingHistory(r)).toBeTrue();
    expect(isBookingHistory({...r, end:later})).toBeFalse();
    expect(isBookingHistory({...r, proposal:{id:'change',start:end,end:later}})).toBeFalse();
    expect(isBookingHistory({...r, status:'declined',end:later})).toBeTrue();
    expect(isBookingHistory({...r, cancelledByGuest:true,end:later})).toBeTrue();
  });

  it('surfaces outstanding guest proposals first and clears them on sign-out', async () => {
    const token = signal<string | null>('guest');
    const slot = {id: 'slot', start: '2099-01-01T09:00:00Z', end: '2099-01-01T10:00:00Z'};
    const booking: Appointment = {...slot, id: 'booking', slotId: slot.id, status: 'accepted', hostName: 'Host',
      guestName: 'Guest', calendarId: 'studio', calendarTitle: 'Studio'};
    const changed = {...booking, id: 'changed', proposal: {...slot, id: 'proposal'}};
    const past = {...changed, id: 'past', status: 'past' as const};
    const owned = {id: 'owned', title: 'Owned', revision: 1, slots: [], requests: [{...changed, id: 'outgoing'}]};
    const api = {token, nativeCalendarRequest: async () => ({calendars: [owned], appointments: [booking, past, changed]})};
    TestBed.configureTestingModule({providers: [BookingWorkspace, {provide: CalendarPlatformApiService, useValue: api}]});
    const workspace = TestBed.inject(BookingWorkspace);
    TestBed.flushEffects();
    await workspace.refresh();
    expect(workspace.pendingChanges().map(r => r.id)).toEqual(['changed']);
    expect(workspace.upcoming().map(r => r.id)).toEqual(['changed', 'booking']);
    expect(workspace.history().map(r => r.id)).toEqual(['past']);
    token.set(null);
    TestBed.flushEffects();
    expect(workspace.pendingChanges()).toEqual([]);
  });
});
