import { DestroyRef, computed, effect, inject, Injectable, signal, untracked } from '@angular/core';
import { CalendarPlatformApiService, CalendarRepeatRule, WebCalendarEventDetails } from './calendar-platform-api.service';

export interface BookingPurpose { appointmentType?:string; customType?:string }
export interface BookingVenue { location?: string; structuredLocation?: WebCalendarEventDetails['structuredLocation'] }
export interface BookingSlot extends BookingVenue {
  title?:string; excludedStarts?:string[];
  id: string; start: string; end: string; timeZone?:string;
  rule?: Omit<CalendarRepeatRule,'frequency'> & {frequency:number};
}
export interface Appointment extends BookingSlot, BookingPurpose {
  proposal?: BookingSlot; calendarId: string; slotId: string; hostName: string; guestName: string; calendarTitle: string;
  status: 'pending' | 'accepted' | 'declined' | 'past';
}
export interface BookingCalendar extends BookingPurpose { id: string; title: string; listed?: boolean; revision: number; slots: BookingSlot[]; requests: Appointment[] }
export interface BookingTimelineMove {
  calendarId: string;
  revision: number;
  slotId: string;
  requestId?: string;
  start: string;
  end: string;
}
export interface BookingListing extends BookingPurpose { id: string; title: string; hostName: string; isOwner: boolean }
export interface Availability extends BookingListing { nextFrom?: string; slots: BookingSlot[] }
interface Workspace { calendars: BookingCalendar[]; appointments: Appointment[] }
export const bookingID = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/;

@Injectable()
export class BookingWorkspace {
  readonly api = inject(CalendarPlatformApiService);
  private readonly confirmed = signal<Workspace>({ calendars: [], appointments: [] });
  private readonly freePreviews = signal<Record<string, BookingCalendar>>({});
  private readonly freeWrites = new Map<string, Promise<void>>();
  readonly data = computed(() => {
    const confirmed = this.confirmed(), previews = this.freePreviews();
    return {...confirmed, calendars: confirmed.calendars.map(calendar => previews[calendar.id] ?? calendar)};
  });
  readonly pendingChanges = computed(() => this.data().appointments.filter(r =>
    r.proposal && r.calendarId && (r.status === 'accepted' || r.status === 'pending')));
  readonly appointmentsForReview = computed(() => {
    const pending = new Set(this.pendingChanges());
    return [...pending, ...this.data().appointments.filter(r => !pending.has(r))];
  });
  readonly error = signal('');
  readonly loaded = signal(false);
  readonly pendingMoves = signal<BookingTimelineMove[]>([]);
  private generation = 0;
  constructor() {
    effect(onCleanup => {
      const token = this.api.token();
      untracked(() => {
        ++this.generation;
        this.freeWrites.clear();
        this.freePreviews.set({});
        this.pendingMoves.set([]);
        this.confirmed.set({calendars: [], appointments: []});
        this.loaded.set(false);
        this.error.set('');
        if (!token) return;
        void this.refresh();
        if (typeof document === 'undefined') return;
        const refreshVisible = () => {
          if (document.visibilityState === 'visible') void this.refresh();
        };
        const timer = setInterval(refreshVisible, 30_000);
        document.addEventListener('visibilitychange', refreshVisible);
        onCleanup(() => {
          clearInterval(timer);
          document.removeEventListener('visibilitychange', refreshVisible);
        });
      });
    });
    inject(DestroyRef).onDestroy(() => ++this.generation);
  }
  async refresh() {
    if (!this.api.token()) return;
    const sequence = ++this.generation, token = this.api.token();
    try {
      const value = await this.request<Workspace>('');
      if (sequence === this.generation && token === this.api.token()) {
        this.confirmed.update(previous => ({...value, calendars: value.calendars.map(calendar => {
          const local = previous.calendars.find(c => c.id === calendar.id);
          return local && local.revision > calendar.revision ? local : calendar;
        })}));
        this.pendingMoves.update(moves => moves.filter(move =>
          this.data().calendars.some(calendar => calendar.id === move.calendarId && calendar.revision === move.revision)));
        this.loaded.set(true);
        this.error.set('');
      }
    } catch (e) {
      if (sequence === this.generation && token === this.api.token()) this.error.set((e as Error).message);
    }
  }
  async moveOccurrence(move: BookingTimelineMove) {
    if (!move.requestId) return this.moveFreeSlot(move);
    if (this.pendingMoves().some(other => other.calendarId === move.calendarId && other.slotId === move.slotId)) return;
    const token = this.api.token();
    this.pendingMoves.update(moves => [...moves, move]);
    const discard = () => this.pendingMoves.update(moves => moves.filter(other => other !== move));
    try {
      const receipt = await this.request<{revision: number}>('/' + move.calendarId + '/occurrences/' + encodeURIComponent(move.slotId),
        'PUT', {revision: move.revision, start: move.start, end: move.end});
      if (receipt.revision === move.revision) discard();
    } catch (error) {
      discard();
      throw error;
    } finally {
      if (token === this.api.token()) void this.refresh();
    }
  }
  private async moveFreeSlot(move: BookingTimelineMove) {
    const calendar = this.data().calendars.find(c => c.id === move.calendarId);
    const [baseId, occurrenceMillis] = move.slotId.split('@');
    const base = calendar?.slots.find(slot => slot.id === baseId);
    const conflict = 'This calendar changed. Refresh and try again.';
    if (!calendar || calendar.revision !== move.revision || !base) throw new Error(conflict);
    const detachedId = base.rule ? crypto.randomUUID() : undefined;
    const slot = {...base, id: detachedId ?? base.id, start: move.start, end: move.end, rule: undefined, excludedStarts: undefined};
    const slots = calendar.slots.filter(s => s.id !== base.id);
    if (detachedId) {
      const originalStart = occurrenceMillis ? new Date(Number(occurrenceMillis)).toISOString() : base.start;
      slots.push({...base, excludedStarts: [...(base.excludedStarts ?? []), originalStart]});
    }
    slots.push(slot);
    slots.sort((a, b) => a.start.localeCompare(b.start));
    const next = {...calendar, slots, revision: calendar.revision + 1};
    const token = this.api.token();
    this.freePreviews.update(previews => ({...previews, [calendar.id]: next}));
    // Each gesture is already visible. Persist in calendar revision order, including gestures on other slots.
    const previous = this.freeWrites.get(calendar.id);
    const write = (async () => {
      if (previous) await previous;
      if (token !== this.api.token()) throw new Error(conflict);
      const receipt = await this.api.nativeCalendarRequest<{revision: number}>('/booking-calendars/' + calendar.id +
        '/occurrences/' + encodeURIComponent(move.slotId), 'PUT',
        {revision: move.revision, start: move.start, end: move.end, freeOnly: true, detachedId});
      if (receipt.revision !== next.revision || token !== this.api.token()) throw new Error(conflict);
      this.confirmed.update(data => ({...data, calendars: data.calendars.map(c =>
        c.id === calendar.id && c.revision < next.revision ? next : c)}));
    })();
    this.freeWrites.set(calendar.id, write);
    try {
      await write;
    } catch (error) {
      if (this.freeWrites.get(calendar.id) === write) throw error;
    } finally {
      if (this.freeWrites.get(calendar.id) === write) {
        this.freeWrites.delete(calendar.id);
        this.freePreviews.update(({[calendar.id]: done, ...remaining}) => remaining);
        void this.refresh();
      }
    }
  }
  async request<T>(suffix: string, method = 'GET', body?: unknown) {
    if (method !== 'GET') {
      const token = this.api.token(), queued = this.freeWrites.get(suffix.split('/')[1]);
      if (queued) await queued;
      if (token !== this.api.token()) throw new Error('Sign in to continue.');
    }
    return this.api.nativeCalendarRequest<T>('/booking-calendars' + suffix, method, body);
  }
  link(id: string) {
    const url = new URL('/calendar/bookings/', 'https://www.cloud-calendars.com');
    url.searchParams.set('bookingCalendar', id);
    url.searchParams.set('bookingServer', 'production');
    return url;
  }
}
