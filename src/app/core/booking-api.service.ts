import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Client for the CloudCalendars booking API (api.cloud-calendars.com).
 *
 * The site is prerendered and has no server, so these calls happen in the
 * browser only — a booking page is inherently live (slots fill in real time)
 * and cannot be baked at build time. `fetch` is used rather than HttpClient to
 * match the one existing network call in the app and avoid wiring a provider.
 */
export interface MeetingType {
  id: string;
  name: string;
  durationMinutes: number;
  description: string | null;
  location: string | null;
  color: string | null;
}

export interface PublicBooking {
  handle: string;
  displayName: string;
  timeZone: string;
  meetingTypes: MeetingType[];
  bookingUrl: string;
}

export interface Slot {
  start: string; // ISO UTC
  end: string;
}

export interface BookingConfirmation {
  confirmed: boolean;
  event: { id: string; title: string; start: string; end: string; location: string | null };
  invitee: { feedUrl: string; webcal: string };
  /** The invitee's key to move or cancel this booking later, and the page for it. */
  manage?: { token: string; url: string };
}

/** What the invitee's manage page shows, resolved from their token. */
export interface ManageBooking {
  handle: string;
  name: string;
  email: string;
  cancelled: boolean;
  displayName: string;
  timeZone: string;
  event: { title: string; start: string; end: string; location: string | null };
  type: {
    id: string;
    name: string;
    durationMinutes: number;
    description: string | null;
    location: string | null;
  } | null;
}

/** One weekly opening: `day` 0–6 (Sun–Sat), `start`/`end` minutes from local midnight. */
export interface AvailabilityRule {
  day: number;
  start: number;
  end: number;
}

/** What an owner sends when defining their booking page. */
export interface BookingConfigInput {
  displayName: string;
  timeZone: string;
  meetingTypes: {
    id?: string;
    name: string;
    durationMinutes: number;
    description?: string | null;
    location?: string | null;
  }[];
  availability: AvailabilityRule[];
  slotIntervalMinutes: number;
  minNoticeHours: number;
  maxAdvanceDays: number;
}

export interface BookingConfig extends BookingConfigInput {
  handle: string;
  enabled: boolean;
  meetingTypes: (BookingConfigInput['meetingTypes'][number] & { id: string })[];
}

export interface RegisterResult {
  calendarId: string;
  deviceToken: string;
  feedId: string;
  feedUrl: string;
}

export interface SavedBooking {
  config: BookingConfig;
  bookingUrl: string;
}

const API = 'https://api.cloud-calendars.com';

@Injectable({ providedIn: 'root' })
export class BookingApiService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  async publicBooking(handle: string): Promise<PublicBooking> {
    return this.get<PublicBooking>(`/book/${encodeURIComponent(handle)}`);
  }

  async slots(handle: string, type: string, from: string, to: string): Promise<Slot[]> {
    const q = new URLSearchParams({ type, from, to }).toString();
    const res = await this.get<{ slots: Slot[] }>(`/book/${encodeURIComponent(handle)}/slots?${q}`);
    return res.slots ?? [];
  }

  async book(
    handle: string,
    payload: { type: string; start: string; name: string; email: string; notes?: string },
  ): Promise<BookingConfirmation> {
    const res = await fetch(`${API}/book/${encodeURIComponent(handle)}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new BookingError(res.status, body.error ?? 'Booking failed');
    }
    return res.json();
  }

  // ── invitee self-management (reschedule / cancel) ─────────────────────────

  /** Resolve a manage token to the booking it controls. */
  async manage(token: string): Promise<ManageBooking> {
    return this.get<ManageBooking>(`/manage/${encodeURIComponent(token)}`);
  }

  /** Move the booking to a new start time. */
  async reschedule(token: string, start: string): Promise<void> {
    await this.post(`/manage/${encodeURIComponent(token)}/reschedule`, { start });
  }

  /** Cancel the booking. */
  async cancelBooking(token: string): Promise<void> {
    await this.post(`/manage/${encodeURIComponent(token)}/cancel`, {});
  }

  // ── owner setup ───────────────────────────────────────────────────────────

  /**
   * Create a fresh Cloud Calendars calendar for a new owner and return its
   * device token. The booking page writes confirmed meetings onto this
   * calendar, and the owner subscribes to its feed from their own calendar app,
   * so a booking page needs no link to an existing iCloud/Google account.
   */
  async register(name: string, timeZone: string): Promise<RegisterResult> {
    return this.post<RegisterResult>('/register', { name, timeZone });
  }

  /** Owner-gated: define (or update) the booking page. `token` is the device token. */
  async saveBooking(token: string, config: BookingConfigInput): Promise<SavedBooking> {
    return this.post<SavedBooking>('/booking', config, token, 'PUT');
  }

  /** Owner-gated: load the current booking config for editing. */
  async myBooking(token: string): Promise<SavedBooking> {
    return this.get<SavedBooking>('/booking', token);
  }

  private async get<T>(path: string, token?: string): Promise<T> {
    if (!this.isBrowser) throw new BookingError(0, 'not available during prerender');
    const res = await fetch(`${API}${path}`, {
      headers: token ? { authorization: `Bearer ${token}` } : undefined,
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new BookingError(res.status, body.error ?? `Request failed (${res.status})`);
    }
    return res.json();
  }

  private async post<T>(
    path: string,
    body: unknown,
    token?: string,
    method: 'POST' | 'PUT' = 'POST',
  ): Promise<T> {
    if (!this.isBrowser) throw new BookingError(0, 'not available during prerender');
    const headers: Record<string, string> = { 'content-type': 'application/json' };
    if (token) headers['authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API}${path}`, { method, headers, body: JSON.stringify(body) });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new BookingError(res.status, err.error ?? `Request failed (${res.status})`);
    }
    return res.json();
  }
}

export class BookingError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'BookingError';
  }
}
