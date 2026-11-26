import { DestroyRef, effect, inject, Injectable, signal, untracked } from '@angular/core';
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
export interface BookingListing extends BookingPurpose { id: string; title: string; hostName: string; isOwner: boolean }
export interface Availability extends BookingListing { nextFrom?: string; slots: BookingSlot[] }
interface Workspace { calendars: BookingCalendar[]; appointments: Appointment[] }
export const bookingID = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/;

@Injectable()
export class BookingWorkspace {
  readonly api = inject(CalendarPlatformApiService);
  readonly data = signal<Workspace>({ calendars: [], appointments: [] });
  readonly error = signal('');
  readonly loaded = signal(false);
  private generation = 0;
  constructor() {
    effect(() => {
      const token = this.api.token();
      untracked(() => {
        ++this.generation;
        this.data.set({calendars: [], appointments: []});
        this.loaded.set(false);
        this.error.set('');
        if (token) void this.refresh();
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
        this.data.set(value);
        this.loaded.set(true);
        this.error.set('');
      }
    } catch (e) {
      if (sequence === this.generation && token === this.api.token()) this.error.set((e as Error).message);
    }
  }
  request<T>(suffix: string, method = 'GET', body?: unknown) {
    return this.api.nativeCalendarRequest<T>('/booking-calendars' + suffix, method, body);
  }
  link(id: string) {
    const url = new URL('/calendar/bookings/', 'https://www.cloud-calendars.com');
    url.searchParams.set('bookingCalendar', id);
    url.searchParams.set('bookingServer', 'production');
    return url;
  }
}
