import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CalendarPlatformApiService } from './calendar-platform-api.service';
import { bookingTimelineEvents } from './booking-timeline';
import { Appointment, BookingCalendar, BookingTimelineMove, BookingWorkspace } from './booking-workspace';

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
    expect(events(schedule, workspace.pendingMoves())[0].start).toBe(move.start);
    await expectAsync(saving).toBeRejectedWithError('Time slots overlap.');
    expect(events(schedule, workspace.pendingMoves())[0].start).toBe(slot.start);
  });

  it('holds the original reservation and shows the proposed time at the drop location', () => {
    const request = {...slot, id: 'reservation', slotId: slot.id, status: 'accepted' as const,
      hostName: 'Host', guestName: 'Guest', calendarId: schedule.id, calendarTitle: schedule.title};
    const reserved = {...schedule, requests: [request]};
    const rows = events(reserved, [{...move, requestId: request.id}]);
    expect(rows.map(row => [row.id, row.start])).toEqual([
      ['request-reservation', slot.start], ['proposal-reservation', move.start],
    ]);
    expect(events(reserved, []).map(row => row.start)).toEqual([slot.start]);
  });
});

describe('in-app booking change notices', () => {
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
    expect(workspace.appointmentsForReview().map(r => r.id)).toEqual(['changed', 'booking', 'past']);
    token.set(null);
    TestBed.flushEffects();
    expect(workspace.pendingChanges()).toEqual([]);
  });
});
