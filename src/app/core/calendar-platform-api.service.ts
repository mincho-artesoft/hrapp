import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { detectBrowserTimeZone } from './ios-event-palette';

const API_BASE = 'https://api.cloud-calendars.com';
const SESSION_STORAGE_KEY = 'cc_web_session_v1';

export class CalendarApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string,
    public readonly payload?: any,
  ) {
    super(message);
    this.name = 'CalendarApiError';
  }
}

export interface AuthProvidersInfo {
  googleWebClientId: string | null;
  googleIosClientId: string | null;
  googleOfflineCapable?: boolean;
  microsoftWebClientId: string | null;
  microsoftTenant: string;
  emailOtpEnabled: boolean;
  featuredDemoHandle: string;
}

export interface ConnectedProviderStatus {
  connected: boolean;
  accountEmail: string | null;
  accountName: string | null;
  hasOfflineRefresh: boolean;
  autoPushEvents: boolean;
  lastSyncedAt: string | null;
  lastSyncError: string | null;
}

export interface ConnectedProvidersMap {
  google: ConnectedProviderStatus;
  microsoft: ConnectedProviderStatus;
}

export interface UserProfile {
  principalId: string;
  calId: string;
  email: string | null;
  verifiedEmails: string[];
  displayName: string;
  calendarName: string;
  timeZone: string;
  defaultColor: string;
  firstWeekday: number;
  feedId: string | null;
  feedUrl: string | null;
  webcalUrl: string | null;
  identities: Array<{ provider: string; email?: string | null; linkedAt?: string }>;
  connectedProviders?: ConnectedProvidersMap;
  isAdmin: boolean;
  isHost: boolean;
  bookingEnabled: boolean;
  bookingHandle: string | null;
  bookingShareUrl: string | null;
  guestBookingsCount: number;
}

export interface WebCalendarEventDetails {
  notes?: string;
  timeZone?: string;
  url?: string;
  videoCallURL?: string;
  color?: string;
  availability?: 'busy' | 'free' | 'tentative' | 'unavailable';
  alarms?: Array<{ relativeOffsetSeconds: number }>;
  recurrenceRules?: Array<{
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval?: number;
    endDate?: string;
    occurrenceCount?: number;
  }>;
  organizer?: { name?: string; email?: string };
  attendees?: Array<{ name?: string; email?: string; status?: string }>;
}

export interface WebCalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay?: boolean;
  location?: string | null;
  color?: string;
  status?: 'confirmed' | 'cancelled' | 'tentative';
  sequence?: number;
  updatedAt?: string;
  details?: WebCalendarEventDetails;
  booking?: {
    bookingId: string;
    manageToken?: string;
    meetingTypeId?: string;
    meetingTypeName?: string;
    guestName?: string;
    guestEmail?: string;
    guestTimeZone?: string;
    guestNotes?: string | null;
    status?: string;
    rescheduledCount?: number;
  };
  sourceKind?: 'owned' | 'shared' | 'external';
  externalSource?: string;
  readOnly?: boolean;
}

export interface ExternalBusyState {
  updatedAt: string | null;
  sources: Record<string, { syncedAt: string; count: number; icsUrl?: string }>;
  events: Array<{
    id: string;
    title: string;
    start: string;
    end: string;
    allDay: boolean;
    source: string;
    color: string;
  }>;
}

export interface TimeWindow {
  start: number;
  end: number;
}

export interface MeetingTypeConfig {
  id: string;
  slug: string;
  name: string;
  durationMinutes: number;
  color: string;
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
  locationKind: 'google_meet' | 'microsoft_teams' | 'teams' | 'zoom' | 'phone' | 'in_person' | 'custom';
  locationValue: string;
  description: string;
  active: boolean;
}

export interface BookingScheduleConfig {
  enabled: boolean;
  disabledByAdmin?: boolean;
  handle: string;
  displayName: string;
  headline: string;
  bio: string;
  avatarColor: string;
  timeZone: string;
  slotIntervalMinutes: number;
  minNoticeMinutes: number;
  maxAdvanceDays: number;
  maxBookingsPerDay: number;
  requireEmailVerification: boolean;
  weekly: Record<string, TimeWindow[]>;
  dateOverrides: Record<string, TimeWindow[]>;
  meetingTypes: MeetingTypeConfig[];
  updatedAt?: string;
}

export interface WebCalendarStateResponse {
  calendar: {
    id: string;
    name: string;
    timeZone: string;
    defaultColor: string;
    firstWeekday: number;
    feedUrl?: string | null;
    webcalUrl?: string | null;
  };
  events: WebCalendarEvent[];
  receivedEvents: WebCalendarEvent[];
  externalBusy: ExternalBusyState;
  connectedProviders?: ConnectedProvidersMap;
  bookingConfig: BookingScheduleConfig | null;
}

export interface BookingInviteLink {
  token: string;
  label: string;
  meetingTypeId: string | null;
  expiresAt: string;
  maxUses: number;
  usedCount: number;
  requireEmailConfirmIfUnauthenticated: boolean;
  revoked: boolean;
  state: 'active' | 'expired' | 'exhausted' | 'revoked';
  createdAt: string;
  lastUsedAt: string | null;
  shareUrl: string;
}

export interface PublicBookingPageData {
  handle: string;
  displayName: string;
  headline: string;
  bio: string;
  avatarColor: string;
  timeZone: string;
  slotIntervalMinutes: number;
  maxAdvanceDays: number;
  requireEmailVerification: boolean;
  isDemo: boolean;
  inviteLink?: {
    token: string;
    label: string;
    expiresAt: string;
    maxUses: number;
    usedCount: number;
    remainingUses: number | null;
  } | null;
  meetingTypes: Array<{
    id: string;
    slug: string;
    name: string;
    durationMinutes: number;
    color: string;
    locationKind: string;
    locationValue: string;
    description: string;
  }>;
}

export interface BookingSlot {
  start: string;
  end: string;
}

export interface PublicSlotsResponse {
  handle: string;
  meetingTypeId: string;
  durationMinutes: number;
  hostTimeZone: string;
  slots: BookingSlot[];
}

export interface CreatedBookingResponse {
  bookingId: string;
  isDemo?: boolean;
  manageToken: string | null;
  manageUrl: string | null;
  guestPortalUrl?: string;
  feedUrl: string | null;
  webcalUrl: string | null;
  icsContent: string;
  event: WebCalendarEvent;
  hostName?: string;
  host?: {
    displayName: string;
    handle: string;
    timeZone: string;
  };
}

export interface HostBookingItem {
  eventId: string;
  bookingId: string;
  title: string;
  start: string;
  end: string;
  status: string;
  color: string;
  location: string | null;
  videoCallURL: string | null;
  meetingTypeId: string;
  meetingTypeName: string;
  guestName: string;
  guestEmail: string;
  guestTimeZone: string;
  guestNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ManagedBookingRecord {
  bookingId: string;
  manageToken: string;
  manageUrl?: string;
  eventId?: string;
  title: string;
  start: string;
  end: string;
  status: string;
  color: string;
  location: string | null;
  videoCallURL: string | null;
  hostName: string;
  hostHandle: string;
  hostTimeZone?: string;
  meetingTypeId: string;
  meetingTypeName: string;
  durationMinutes?: number;
  guestName: string;
  guestEmail: string;
  guestTimeZone: string;
  guestNotes?: string | null;
  feedUrl: string | null;
  webcalUrl: string | null;
  icsContent?: string;
}

export interface AdminOverviewResponse {
  kpis: {
    totalHosts: number;
    activeHosts: number;
    suspendedHosts: number;
    totalBookings: number;
    confirmedBookings: number;
    cancelledBookings: number;
    rescheduledBookings: number;
    upcomingNext7Days: number;
  };
  system: {
    emailConfigured: boolean;
    emailGuardTable: string | null;
    feedHost: string;
    googleIosConfigured: boolean;
    googleWebConfigured: boolean;
    googleWebSecretConfigured?: boolean;
    microsoftWebConfigured: boolean;
  };
  settings: {
    googleWebClientId: string;
    googleWebSecretConfigured?: boolean;
    microsoftWebClientId: string;
    microsoftTenant: string;
    featuredDemoHandle: string;
  };
  hosts: Array<{
    calId: string;
    principalId: string;
    handle: string;
    displayName: string;
    email: string | null;
    enabled: boolean;
    disabledByAdmin: boolean;
    meetingTypeCount: number;
    timeZone: string;
    updatedAt: string;
  }>;
  recentBookings: Array<{
    bookingId: string;
    calId: string;
    eventId: string;
    hostHandle: string;
    hostName: string;
    guestName: string;
    guestEmail: string;
    meetingTypeName: string;
    title: string;
    start: string;
    end: string;
    status: string;
    lastChangeKind?: string;
    createdAt: string;
    updatedAt?: string;
  }>;
}

declare global {
  interface Window {
    google?: any;
  }
}

@Injectable({ providedIn: 'root' })
export class CalendarPlatformApiService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly token = signal<string | null>(null);
  readonly profile = signal<UserProfile | null>(null);
  readonly providers = signal<AuthProvidersInfo | null>(null);
  readonly loadingSession = signal<boolean>(false);

  readonly isAuthenticated = computed(() => Boolean(this.token() && this.profile()));
  readonly isSignedInWithAccount = computed(() => {
    const p = this.profile();
    return Boolean(p && (p.verifiedEmails.length > 0 || p.identities.length > 0));
  });

  private initPromise: Promise<void> | null = null;
  private gisScriptPromise: Promise<void> | null = null;

  constructor() {
    if (this.isBrowser) {
      const saved = this.readSavedToken();
      if (saved) {
        this.token.set(saved);
      }
    }
  }

  private readSavedToken(): string | null {
    if (!this.isBrowser) return null;
    try {
      return localStorage.getItem(SESSION_STORAGE_KEY);
    } catch {
      return null;
    }
  }

  private writeSavedToken(tok: string | null): void {
    if (!this.isBrowser) return;
    try {
      if (tok) localStorage.setItem(SESSION_STORAGE_KEY, tok);
      else localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // ignore storage quota / private mode
    }
  }

  async ensureInitialized(): Promise<void> {
    if (!this.isBrowser) return;
    if (this.initPromise) return this.initPromise;
    this.initPromise = (async () => {
      this.loadingSession.set(true);
      try {
        await Promise.all([
          this.loadAuthProviders().catch(() => null),
          this.token() ? this.refreshProfile().catch(() => this.signOut()) : Promise.resolve(),
        ]);
      } finally {
        this.loadingSession.set(false);
      }
    })();
    return this.initPromise;
  }

  signOut(): void {
    this.token.set(null);
    this.profile.set(null);
    this.writeSavedToken(null);
  }

  private async request<T>(
    path: string,
    opts: {
      method?: string;
      body?: unknown;
      auth?: boolean;
      optionalAuth?: boolean;
    } = {},
  ): Promise<T> {
    const headers: Record<string, string> = {};
    if (opts.body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }
    const tok = this.token();
    if ((opts.auth || opts.optionalAuth) && tok) {
      headers['Authorization'] = `Bearer ${tok}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
      method: opts.method ?? 'GET',
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
      cache: 'no-store',
    });

    let data: any = null;
    const text = await res.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }
    }

    if (!res.ok) {
      if (res.status === 401 && opts.auth) {
        this.signOut();
      }
      const message =
        data?.error ||
        data?.message ||
        (res.status === 409 ? 'This time slot is no longer available.' : `Request failed (${res.status})`);
      throw new CalendarApiError(res.status, message, data?.code, data);
    }
    return data as T;
  }

  // ── Auth & Identity ───────────────────────────────────────────────────────

  async loadAuthProviders(): Promise<AuthProvidersInfo> {
    const info = await this.request<AuthProvidersInfo>('/auth/providers');
    this.providers.set(info);
    return info;
  }

  async requestEmailAuthCode(email: string): Promise<{ sent: boolean; expiresInSeconds: number }> {
    return this.request('/auth/email/request-code', {
      method: 'POST',
      body: { email: email.trim().toLowerCase() },
    });
  }

  async verifyEmailAuthCode(opts: {
    email: string;
    code: string;
    name?: string;
    timeZone?: string;
  }): Promise<UserProfile> {
    const res = await this.request<{
      deviceToken: string;
      profile: UserProfile;
    }>('/auth/email/verify-code', {
      method: 'POST',
      optionalAuth: true,
      body: {
        email: opts.email.trim().toLowerCase(),
        code: opts.code.trim(),
        name: opts.name?.trim() || undefined,
        timeZone: opts.timeZone || detectBrowserTimeZone(),
      },
    });
    this.token.set(res.deviceToken);
    this.writeSavedToken(res.deviceToken);
    this.profile.set(res.profile);
    return res.profile;
  }

  /** Instant anonymous CloudCalendars workspace so visitors can create & drag events immediately, then link Google/Microsoft/Email later! */
  async ensureWorkspaceSession(displayName = 'My Cloud Calendar'): Promise<UserProfile> {
    await this.ensureInitialized();
    const existing = this.profile();
    if (existing) return existing;

    const tz = detectBrowserTimeZone();
    const reg = await this.request<{
      calendarId: string;
      deviceToken: string;
      feedId: string;
      feedUrl: string;
    }>('/register', {
      method: 'POST',
      body: { name: displayName, timeZone: tz },
    });
    this.token.set(reg.deviceToken);
    this.writeSavedToken(reg.deviceToken);
    return this.refreshProfile();
  }

  /** Resolves a Google or Microsoft token onto the unified CloudCalendars principal graph (`POST /resolve`). */
  async signInWithProviderToken(
    provider: 'google' | 'microsoft',
    idOrAccessToken: string,
    displayName?: string,
  ): Promise<UserProfile> {
    // Only send Authorization Bearer when linking onto an ALREADY-VERIFIED CloudCalendars account;
    // when signing in from an anonymous/sandbox state, calling `/resolve` without Bearer resolves directly
    // to any existing iOS/Web account for that Google/Microsoft identity without triggering a 409!
    const linkOntoVerifiedAccount = this.isSignedInWithAccount();

    const res = await this.request<{
      calendarId: string;
      deviceToken?: string;
    }>('/resolve', {
      method: 'POST',
      auth: linkOntoVerifiedAccount,
      body: {
        provider,
        token: idOrAccessToken,
        name: displayName || 'Cloud Calendar',
        timeZone: detectBrowserTimeZone(),
      },
    });

    if (res.deviceToken) {
      this.token.set(res.deviceToken);
      this.writeSavedToken(res.deviceToken);
    }
    return this.refreshProfile();
  }

  private loadGoogleGisScript(): Promise<void> {
    if (!this.isBrowser) return Promise.reject(new Error('Browser required'));
    if (window.google?.accounts?.oauth2) return Promise.resolve();
    if (this.gisScriptPromise) return this.gisScriptPromise;

    this.gisScriptPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => {
        this.gisScriptPromise = null;
        reject(new Error('Could not load Google Sign-In SDK.'));
      };
      document.head.appendChild(script);
    });
    return this.gisScriptPromise;
  }

  /**
   * Launches Google OAuth popup using the CloudCalendars Google Cloud Project (`540859420644`).
   * Requests the minimal least-privilege event scope `https://www.googleapis.com/auth/calendar.events.owned`
   * ("See, create, change, and delete events on Google calendars you own") when `includeCalendarReadonly !== false`,
   * or strictly non-sensitive `openid email profile` for account-only sign-in (`/admin/`, `/bookings/`).
   * - When `googleOfflineCapable` is true (`googleWebClientSecret` configured), uses `initCodeClient` (`access_type: 'offline'`)
   *   so the backend stores a permanent `refresh_token` for 24/7 background sync even while the browser is closed!
   * - Otherwise uses `initTokenClient` and stores the live token on the backend for immediate 2-way read+write sync!
   */
  async signInWithGooglePopup(opts: { includeCalendarReadonly?: boolean } = {}): Promise<{
    accessToken: string;
    profile: UserProfile;
  }> {
    const prov = this.providers() ?? (await this.loadAuthProviders());
    if (!prov.googleWebClientId) {
      throw new CalendarApiError(
        400,
        'Google Web OAuth Client ID is not configured yet. Sign in instantly with your Gmail address via 6-digit code below, or configure Google Web Client ID in /admin/.',
        'oauth_not_configured',
      );
    }

    const wantCalendarSync = opts.includeCalendarReadonly !== false;
    await this.loadGoogleGisScript();
    const scopes = [
      'openid',
      'email',
      'profile',
      ...(wantCalendarSync ? ['https://www.googleapis.com/auth/calendar.events.owned'] : []),
    ].join(' ');

    // Path A: Full offline 2-way sync (`initCodeClient` -> `POST /auth/oauth/google-code` -> `refresh_token`)
    if (prov.googleOfflineCapable && wantCalendarSync && window.google.accounts.oauth2.initCodeClient) {
      const code = await new Promise<string>((resolve, reject) => {
        const codeClient = window.google.accounts.oauth2.initCodeClient({
          client_id: prov.googleWebClientId,
          scope: scopes,
          ux_mode: 'popup',
          access_type: 'offline',
          prompt: 'consent',
          callback: (resp: any) => {
            if (resp?.error) {
              reject(new Error(resp.error_description || resp.error || 'Google authorization cancelled.'));
              return;
            }
            if (!resp?.code) {
              reject(new Error('No authorization code returned by Google.'));
              return;
            }
            resolve(resp.code);
          },
          error_callback: (err: any) => {
            reject(new Error(err?.message || 'Google sign-in popup was closed.'));
          },
        });
        codeClient.requestCode();
      });

      const codeRes = await this.request<{
        deviceToken: string;
        profile: UserProfile;
      }>('/auth/oauth/google-code', {
        method: 'POST',
        auth: this.isSignedInWithAccount(),
        body: {
          code,
          clientId: prov.googleWebClientId,
          redirectUri: 'postmessage',
          timeZone: detectBrowserTimeZone(),
        },
      });
      if (codeRes.deviceToken) {
        this.token.set(codeRes.deviceToken);
        this.writeSavedToken(codeRes.deviceToken);
      }
      const profile = codeRes.profile ?? (await this.refreshProfile());
      this.profile.set(profile);
      return { accessToken: 'offline_code_exchanged', profile };
    }

    // Path B: Direct GIS TokenClient (`access_token` verified & stored server-side for 2-way read+write)
    const accessToken = await new Promise<string>((resolve, reject) => {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: prov.googleWebClientId,
        scope: scopes,
        callback: (resp: any) => {
          if (resp?.error) {
            reject(new Error(resp.error_description || resp.error || 'Google authorization cancelled.'));
            return;
          }
          if (!resp?.access_token) {
            reject(new Error('No access token returned by Google.'));
            return;
          }
          resolve(resp.access_token);
        },
        error_callback: (err: any) => {
          reject(new Error(err?.message || 'Google sign-in popup was closed.'));
        },
      });
      client.requestAccessToken({ prompt: wantCalendarSync ? 'consent' : '' });
    });

    let profile = this.profile();
    try {
      profile = await this.signInWithProviderToken('google', accessToken);
    } catch (err) {
      // If user is already signed in (e.g. with Microsoft) and connects a Google account that already has
      // its own standalone principal, keep current session and still link 2-way Google Calendar sync below!
      if (!(err instanceof CalendarApiError && err.status === 409 && this.isSignedInWithAccount())) {
        throw err;
      }
    }
    if (wantCalendarSync) {
      await this.syncExternalProvider({
        provider: 'google',
        accessToken,
        clientId: prov.googleWebClientId,
      });
      await this.refreshProfile().catch(() => null);
    }
    return { accessToken, profile: (this.profile() ?? profile)! };
  }

  /**
   * Launches Microsoft Identity Platform v2.0 OAuth 2.0 PKCE popup flow using the approved
   * CloudCalendars Microsoft Entra App (`5b1a5159-948f-4b5b-ac6a-009df927c665`).
   * Requests `Calendars.ReadWrite offline_access User.Read` so both `access_token` and `refresh_token`
   * are stored server-side for 24/7 2-way Outlook Calendar sync!
   */
  async signInWithMicrosoftPopup(opts: { includeCalendarReadonly?: boolean } = {}): Promise<{
    accessToken: string;
    idToken: string;
    profile: UserProfile;
  }> {
    if (!this.isBrowser) throw new Error('Browser required');
    const prov = this.providers() ?? (await this.loadAuthProviders());
    if (!prov.microsoftWebClientId) {
      throw new CalendarApiError(
        400,
        'Microsoft Web Application (SPA) Client ID is not configured yet. Sign in instantly with your Outlook / Microsoft email via 6-digit code below, or set Microsoft Client ID in /admin/.',
        'oauth_not_configured',
      );
    }

    const wantCalendarSync = opts.includeCalendarReadonly !== false;
    const tenant = prov.microsoftTenant || 'common';
    const redirectUri = `${window.location.origin}/calendar/`;
    const verifierBytes = new Uint8Array(32);
    crypto.getRandomValues(verifierBytes);
    const codeVerifier = this.base64UrlEncode(verifierBytes);
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier));
    const codeChallenge = this.base64UrlEncode(new Uint8Array(digest));
    const stateBytes = new Uint8Array(16);
    crypto.getRandomValues(stateBytes);
    const state = `ms_${this.base64UrlEncode(stateBytes)}`;

    const scopes = [
      'openid',
      'profile',
      'email',
      'User.Read',
      ...(wantCalendarSync ? ['Calendars.ReadWrite', 'offline_access'] : []),
    ].join(' ');

    const authUrl = new URL(`https://login.microsoftonline.com/${encodeURIComponent(tenant)}/oauth2/v2.0/authorize`);
    authUrl.searchParams.set('client_id', prov.microsoftWebClientId);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_mode', 'query');
    authUrl.searchParams.set('scope', scopes);
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('code_challenge', codeChallenge);
    authUrl.searchParams.set('code_challenge_method', 'S256');

    const code = await this.openOAuthCodePopup(authUrl.toString(), state);

    const tokenRes = await fetch(
      `https://login.microsoftonline.com/${encodeURIComponent(tenant)}/oauth2/v2.0/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: prov.microsoftWebClientId,
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
          code_verifier: codeVerifier,
          scope: scopes,
        }),
      },
    );
    const tokenJson: any = await tokenRes.json();
    if (!tokenRes.ok || !tokenJson?.access_token) {
      throw new Error(tokenJson?.error_description || 'Microsoft token exchange failed.');
    }

    // Backend `verifyMicrosoftToken` validates the Graph `access_token` against `GET /v1.0/me`
    let profile = this.profile();
    try {
      profile = await this.signInWithProviderToken('microsoft', tokenJson.access_token);
    } catch (err) {
      // If user is already signed in (e.g. with Google) and connects a Microsoft account that already has
      // its own standalone principal, keep current session and still link 2-way Outlook Calendar sync below!
      if (!(err instanceof CalendarApiError && err.status === 409 && this.isSignedInWithAccount())) {
        throw err;
      }
    }
    if (wantCalendarSync) {
      await this.syncExternalProvider({
        provider: 'microsoft',
        accessToken: tokenJson.access_token,
        refreshToken: tokenJson.refresh_token || undefined,
        expiresIn: tokenJson.expires_in,
        clientId: prov.microsoftWebClientId,
        tenant,
      });
      await this.refreshProfile().catch(() => null);
    }
    return {
      accessToken: tokenJson.access_token,
      idToken: tokenJson.id_token || '',
      profile: (this.profile() ?? profile)!,
    };
  }

  private base64UrlEncode(bytes: Uint8Array): string {
    let str = '';
    for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i]);
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }

  private openOAuthCodePopup(url: string, expectedState: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const w = 520;
      const h = 660;
      const left = window.screenX + Math.max(0, (window.outerWidth - w) / 2);
      const top = window.screenY + Math.max(0, (window.outerHeight - h) / 2);
      const popup = window.open(
        url,
        'cc_oauth_popup',
        `width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=yes`,
      );
      if (!popup) {
        reject(new Error('Popup blocked by browser. Please allow popups for cloud-calendars.com.'));
        return;
      }

      let settled = false;
      const cleanup = () => {
        window.clearInterval(timer);
        window.removeEventListener('message', onMsg);
      };

      const finish = (code: string | null, err: string | null, errDesc: string | null, st: string | null) => {
        if (settled) return;
        settled = true;
        cleanup();
        try {
          popup.close();
        } catch {
          // ignore
        }
        if (err) {
          reject(new Error(errDesc || err));
        } else if (st !== expectedState) {
          reject(new Error('OAuth state mismatch. Please try again.'));
        } else if (code) {
          resolve(code);
        } else {
          reject(new Error('Authorization did not return a code.'));
        }
      };

      const onMsg = (ev: MessageEvent) => {
        if (ev.origin !== window.location.origin) return;
        const d = ev.data;
        if (d && d.type === 'cc_ms_oauth_callback') {
          finish(d.code || null, d.error || null, d.errorDescription || null, d.state || null);
        }
      };
      window.addEventListener('message', onMsg);

      const timer = window.setInterval(() => {
        try {
          if (popup.closed) {
            if (!settled) {
              settled = true;
              cleanup();
              reject(new Error('Sign-in window was closed before completing.'));
            }
            return;
          }
          if (popup.location.origin === window.location.origin) {
            const params = new URLSearchParams(popup.location.search);
            const code = params.get('code');
            const err = params.get('error');
            const st = params.get('state');
            if (code || err) {
              finish(code, err, params.get('error_description'), st);
            }
          }
        } catch {
          // Cross-origin while on provider login page — keep waiting
        }
      }, 250);
    });
  }

  async refreshProfile(): Promise<UserProfile> {
    const p = await this.request<UserProfile>('/me/profile', { auth: true });
    this.profile.set(p);
    return p;
  }

  async updateProfile(patch: {
    displayName?: string;
    calendarName?: string;
    timeZone?: string;
    defaultColor?: string;
    firstWeekday?: number;
  }): Promise<UserProfile> {
    const p = await this.request<UserProfile>('/me/profile', {
      method: 'PUT',
      auth: true,
      body: patch,
    });
    this.profile.set(p);
    return p;
  }

  // ── Web Calendar Workspace ────────────────────────────────────────────────

  async getCalendarState(opts: { sync?: boolean } = {}): Promise<WebCalendarStateResponse> {
    const suffix = opts.sync ? '?sync=1' : '';
    return this.request<WebCalendarStateResponse>(`/web-calendar/state${suffix}`, { auth: true });
  }

  async upsertCalendarEvent(
    eventId: string,
    payload: {
      title?: string;
      start: string;
      end: string;
      allDay?: boolean;
      color?: string;
      location?: string | null;
      notes?: string;
      timeZone?: string;
      videoCallURL?: string | null;
      url?: string | null;
      availability?: 'busy' | 'free' | 'tentative' | 'unavailable';
      alarms?: Array<{ relativeOffsetSeconds: number }>;
      recurrenceRules?: Array<{
        frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
        interval?: number;
        endDate?: string;
        occurrenceCount?: number;
      }>;
      attendees?: Array<{ name?: string; email?: string; status?: string }>;
      notifyGuest?: boolean;
      reason?: string;
    },
  ): Promise<{ event: WebCalendarEvent; notifiedGuest?: boolean }> {
    return this.request(`/web-calendar/events/${encodeURIComponent(eventId)}`, {
      method: 'PUT',
      auth: true,
      body: payload,
    });
  }

  async deleteCalendarEvent(
    eventId: string,
    opts: { notifyGuest?: boolean; reason?: string } = {},
  ): Promise<{ deleted: boolean; sequence: number }> {
    const qs = new URLSearchParams();
    if (opts.notifyGuest === false) qs.set('notifyGuest', '0');
    if (opts.reason) qs.set('reason', opts.reason);
    const suffix = qs.toString() ? `?${qs.toString()}` : '';
    return this.request(`/web-calendar/events/${encodeURIComponent(eventId)}${suffix}`, {
      method: 'DELETE',
      auth: true,
    });
  }

  async syncExternalProvider(payload: {
    provider: 'google' | 'microsoft' | 'ics';
    accessToken?: string;
    refreshToken?: string;
    expiresIn?: number;
    clientId?: string;
    tenant?: string;
    icsUrl?: string;
    disconnect?: boolean;
  }): Promise<ExternalBusyState & { connectedProviders?: ConnectedProvidersMap }> {
    return this.request<ExternalBusyState & { connectedProviders?: ConnectedProvidersMap }>(
      '/web-calendar/sync-provider',
      {
        method: 'POST',
        auth: true,
        body: payload,
      },
    );
  }

  // ── Host Booking Configuration & Queue ────────────────────────────────────

  async checkHandle(handle: string): Promise<{ handle: string; available: boolean; reason?: string }> {
    return this.request(`/booking/check-handle?h=${encodeURIComponent(handle)}`, { auth: true });
  }

  async getBookingConfig(): Promise<{ config: BookingScheduleConfig; shareUrl: string }> {
    return this.request('/booking/config', { auth: true });
  }

  async saveBookingConfig(config: Partial<BookingScheduleConfig>): Promise<{
    config: BookingScheduleConfig;
    shareUrl: string;
  }> {
    const res = await this.request<{ config: BookingScheduleConfig; shareUrl: string }>(
      '/booking/config',
      {
        method: 'PUT',
        auth: true,
        body: config,
      },
    );
    await this.refreshProfile().catch(() => null);
    return res;
  }

  async getHostBookings(): Promise<{ bookings: HostBookingItem[] }> {
    return this.request('/booking/host-bookings', { auth: true });
  }

  async rescheduleHostBooking(
    eventId: string,
    payload: { start: string; end?: string; reason?: string; notifyGuest?: boolean },
  ): Promise<{ event: WebCalendarEvent; notifiedGuest?: boolean }> {
    return this.request(`/booking/host-bookings/${encodeURIComponent(eventId)}/reschedule`, {
      method: 'POST',
      auth: true,
      body: payload,
    });
  }

  async cancelHostBooking(
    eventId: string,
    payload: { reason?: string; notifyGuest?: boolean } = {},
  ): Promise<{ deleted: boolean }> {
    return this.request(`/booking/host-bookings/${encodeURIComponent(eventId)}/cancel`, {
      method: 'POST',
      auth: true,
      body: payload,
    });
  }

  async getBookingInviteLinks(): Promise<{ links: BookingInviteLink[] }> {
    return this.request('/booking/invite-links', { auth: true });
  }

  async createBookingInviteLink(payload: {
    label?: string;
    expiresInHours?: number;
    expiresAt?: string;
    maxUses?: number;
    meetingTypeId?: string | null;
    requireEmailConfirmIfUnauthenticated?: boolean;
  }): Promise<{ link: BookingInviteLink }> {
    return this.request('/booking/invite-links', {
      method: 'POST',
      auth: true,
      body: payload,
    });
  }

  async revokeBookingInviteLink(token: string): Promise<{ link: BookingInviteLink }> {
    return this.request(`/booking/invite-links/${encodeURIComponent(token)}`, {
      method: 'DELETE',
      auth: true,
    });
  }

  // ── Public Booking Surface ────────────────────────────────────────────────

  async getPublicBookingPage(handle: string): Promise<PublicBookingPageData> {
    return this.request<PublicBookingPageData>(`/book/${encodeURIComponent(handle)}`);
  }

  async getPublicBookingSlots(
    handle: string,
    opts: { type?: string; from?: string; to?: string; excludeEventId?: string } = {},
  ): Promise<PublicSlotsResponse> {
    const qs = new URLSearchParams();
    if (opts.type) qs.set('type', opts.type);
    if (opts.from) qs.set('from', opts.from);
    if (opts.to) qs.set('to', opts.to);
    if (opts.excludeEventId) qs.set('excludeEventId', opts.excludeEventId);
    const suffix = qs.toString() ? `?${qs.toString()}` : '';
    return this.request<PublicSlotsResponse>(`/book/${encodeURIComponent(handle)}/slots${suffix}`);
  }

  async requestBookingVerificationCode(handle: string, email: string): Promise<{ sent: boolean }> {
    return this.request(`/book/${encodeURIComponent(handle)}/request-code`, {
      method: 'POST',
      body: { email: email.trim().toLowerCase() },
    });
  }

  async createPublicBooking(
    handle: string,
    payload: {
      typeId: string;
      start: string;
      name: string;
      email: string;
      timeZone: string;
      notes?: string;
      verificationCode?: string;
    },
  ): Promise<CreatedBookingResponse> {
    return this.request<CreatedBookingResponse>(`/book/${encodeURIComponent(handle)}`, {
      method: 'POST',
      optionalAuth: true,
      body: payload,
    });
  }

  // ── Guest Self-Service & Portal ───────────────────────────────────────────

  async getManagedBooking(token: string): Promise<{ booking: ManagedBookingRecord }> {
    return this.request(`/manage/${encodeURIComponent(token)}`);
  }

  async rescheduleManagedBooking(
    token: string,
    payload: { start: string; reason?: string },
  ): Promise<{ booking: ManagedBookingRecord }> {
    return this.request(`/manage/${encodeURIComponent(token)}/reschedule`, {
      method: 'POST',
      body: payload,
    });
  }

  async cancelManagedBooking(
    token: string,
    payload: { reason?: string } = {},
  ): Promise<{ booking: ManagedBookingRecord }> {
    return this.request(`/manage/${encodeURIComponent(token)}/cancel`, {
      method: 'POST',
      body: payload,
    });
  }

  async syncManagedBookingToMyCalendar(token: string): Promise<{
    synced: boolean;
    linkedToCloudCalendar: boolean;
    syncedProviders: string[];
  }> {
    return this.request(`/manage/${encodeURIComponent(token)}/sync-to-my-calendar`, {
      method: 'POST',
      auth: true,
    });
  }

  buildGoogleCalendarAddUrl(ev: {
    title: string;
    start: string;
    end: string;
    location?: string | null;
    notes?: string | null;
    videoCallURL?: string | null;
  }): string {
    const fmt = (iso: string) =>
      new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
    const url = new URL('https://calendar.google.com/calendar/render');
    url.searchParams.set('action', 'TEMPLATE');
    url.searchParams.set('text', ev.title);
    url.searchParams.set('dates', `${fmt(ev.start)}/${fmt(ev.end)}`);
    if (ev.location) url.searchParams.set('location', ev.location);
    const details = [ev.notes || '', ev.videoCallURL ? `Join: ${ev.videoCallURL}` : '']
      .filter(Boolean)
      .join('\n\n');
    if (details) url.searchParams.set('details', details);
    return url.toString();
  }

  buildOutlookCalendarAddUrl(ev: {
    title: string;
    start: string;
    end: string;
    location?: string | null;
    notes?: string | null;
    videoCallURL?: string | null;
  }): string {
    const url = new URL('https://outlook.live.com/calendar/0/deeplink/compose');
    url.searchParams.set('path', '/calendar/action/compose');
    url.searchParams.set('rru', 'addevent');
    url.searchParams.set('subject', ev.title);
    url.searchParams.set('startdt', new Date(ev.start).toISOString());
    url.searchParams.set('enddt', new Date(ev.end).toISOString());
    if (ev.location) url.searchParams.set('location', ev.location);
    const body = [ev.notes || '', ev.videoCallURL ? `Join: ${ev.videoCallURL}` : '']
      .filter(Boolean)
      .join('\n\n');
    if (body) url.searchParams.set('body', body);
    return url.toString();
  }

  async getGuestBookings(): Promise<{ emails: string[]; bookings: ManagedBookingRecord[] }> {
    return this.request('/guest/bookings', { auth: true });
  }

  // ── Platform Admin Console ────────────────────────────────────────────────

  async getAdminOverview(): Promise<AdminOverviewResponse> {
    return this.request('/admin/overview', { auth: true });
  }

  async moderateHost(
    calId: string,
    disabledByAdmin: boolean,
  ): Promise<{ calId: string; disabledByAdmin: boolean }> {
    return this.request(`/admin/hosts/${encodeURIComponent(calId)}`, {
      method: 'PATCH',
      auth: true,
      body: { disabledByAdmin },
    });
  }

  async updateAdminSettings(settings: {
    googleWebClientId?: string;
    googleWebClientSecret?: string;
    microsoftWebClientId?: string;
    microsoftTenant?: string;
    featuredDemoHandle?: string;
  }): Promise<{ settings: AdminOverviewResponse['settings'] }> {
    const res = await this.request<{ settings: AdminOverviewResponse['settings'] }>(
      '/admin/settings',
      {
        method: 'PUT',
        auth: true,
        body: settings,
      },
    );
    await this.loadAuthProviders().catch(() => null);
    return res;
  }
}
