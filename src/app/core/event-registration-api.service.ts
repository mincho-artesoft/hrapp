import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// Public fixed-date event invitations, independent of the retired scheduling portal.
export interface PublicEvent {
  handle: string;
  title: string;
  start: string;
  end: string;
  location: string | null;
  description: string | null;
  displayName: string;
  timeZone: string;
  capacity: number | null;
  spotsLeft: number | null;
  closed: boolean;
  cancelled: boolean;
}

export interface EventRegistrant {
  name: string;
  email: string;
  registeredAt: string;
}

/** What the registrant's manage page shows, resolved from their token. */
export interface RegistrationView {
  name: string;
  email: string;
  cancelled: boolean;
  displayName: string;
  timeZone: string;
  event: { title: string; start: string; end: string; location: string | null };
}

export interface EventRegisterResult {
  registered: boolean;
  already?: boolean;
  event: { title: string; start: string; end: string; location: string | null };
  invitee: { feedUrl: string; webcal: string };
  manage: { token: string; url: string };
}

const API = 'https://api.cloud-calendars.com';

@Injectable({ providedIn: 'root' })
export class EventRegistrationApiService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** Public: the event behind a shared link. */
  async publicEvent(handle: string): Promise<PublicEvent> {
    return this.get<PublicEvent>(`/e/${encodeURIComponent(handle)}`);
  }

  /** Public: register for an event with just a name and e-mail. */
  async registerForEvent(handle: string, payload: { name: string; email: string }): Promise<EventRegisterResult> {
    const res = await fetch(`${API}/e/${encodeURIComponent(handle)}/register`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new EventRegistrationError(res.status, body.error ?? 'Registration failed');
    }
    return res.json();
  }

  /** Public: resolve a registrant's token to their spot. */
  async registration(token: string): Promise<RegistrationView> {
    return this.get<RegistrationView>(`/registration/${encodeURIComponent(token)}`);
  }

  /** Public: cancel your own registration. */
  async cancelRegistration(token: string): Promise<void> {
    await this.post(`/registration/${encodeURIComponent(token)}/cancel`, {});
  }

  private async get<T>(path: string, token?: string): Promise<T> {
    if (!this.isBrowser) throw new EventRegistrationError(0, 'not available during prerender');
    const res = await fetch(`${API}${path}`, {
      headers: token ? { authorization: `Bearer ${token}` } : undefined,
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new EventRegistrationError(res.status, body.error ?? `Request failed (${res.status})`);
    }
    return res.json();
  }

  private async post<T>(
    path: string,
    body: unknown,
    token?: string,
    method: 'POST' | 'PUT' = 'POST',
  ): Promise<T> {
    if (!this.isBrowser) throw new EventRegistrationError(0, 'not available during prerender');
    const headers: Record<string, string> = { 'content-type': 'application/json' };
    if (token) headers['authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API}${path}`, { method, headers, body: JSON.stringify(body) });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new EventRegistrationError(res.status, err.error ?? `Request failed (${res.status})`);
    }
    return res.json();
  }
}

export class EventRegistrationError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'EventRegistrationError';
  }
}
