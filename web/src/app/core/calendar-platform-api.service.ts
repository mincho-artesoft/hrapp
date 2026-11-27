import { DestroyRef, Injectable, InjectionToken, isDevMode, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { nativeEventDetails, withWebEventDetails } from './calendar-native-model';
import calendarSession from './calendar-session.json';
import { SITE_URL } from './app-facts';
import { detectBrowserTimeZone } from './ios-event-palette';

declare global {
  interface Window {
    takeCalendarOpeningResponse?: (url: string, token: string) => Promise<Response | null> | undefined;
  }
}

export const CALENDAR_API_BASE = new InjectionToken<string>('Calendar API base URL', {
  providedIn: 'root',
  factory: () => calendarSession.apiBase,
});
const SESSION_STORAGE_KEY = calendarSession.storageKey;

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
  appleWebClientId?: string | null;
  emailOtpEnabled: boolean;
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

export interface WebStudioAccess {
  entitled: boolean;
  accessSource: 'admin' | 'ios_app' | 'stripe_monthly' | 'stripe_yearly' | 'none';
  iosUnlocked: boolean;
  iosUnlockedAt: string | null;
  totpEnabled: boolean;
  plan: 'ios_free' | 'monthly' | 'yearly' | 'admin' | 'none';
  subscriptionStatus: string | null;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string | null;
  hasBillingPortal: boolean;
  pricing: {
    monthlyUsd: number;
    yearlyUsd: number;
  };
}

export interface IosQrChallengeStartResponse {
  challengeId: string;
  pollToken: string;
  qrUrl: string;
  appDeepLink: string;
  expiresAt: string;
  expiresInSeconds: number;
}

export interface IosQrPollResponse {
  status: 'pending' | 'expired' | 'approved';
  expiresAt?: string;
  calendarId?: string;
  deviceToken?: string;
  email?: string | null;
  ownerId?: string;
  profile?: UserProfile;
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
  webAccess?: WebStudioAccess;
}

export interface CalendarRepeatRule {
  frequency: 'daily'|'weekly'|'monthly'|'yearly'; interval?:number; endDate?:string; occurrenceCount?:number;
  daysOfTheWeek?:Array<{weekday:number;weekNumber?:number}>; daysOfTheMonth?:number[];
  monthsOfTheYear?:number[]; weeksOfTheYear?:number[]; daysOfTheYear?:number[]; setPositions?:number[];
}
export interface CalendarAlarm {
  absoluteDate?: string | null;
  relativeOffsetSeconds?: number | null;
}
export interface WebCalendarEventDetails {
  providerPrivacy?: string;
  providerShowAs?: string;
  providerDefaultReminders?: boolean;
  providerOtherReminders?: Array<{method: string; minutes: number}>;
  structuredLocation?: { title: string; latitude?: number | null; longitude?: number | null; radius: number } | null;
  notes?: string;
  timeZone?: string;
  url?: string;
  videoCallURL?: string;
  travelTime?:number;
  attachments?:Array<{id:string;fileName:string;contentType?:string;dataBase64:string}>;
  color?: string;
  availability?: 'busy' | 'free' | 'tentative' | 'unavailable';
  alarms?: CalendarAlarm[];
  recurrenceRules?: CalendarRepeatRule[];
  excludedStarts?: string[];
  organizer?: { name?: string; email?: string };
  attendees?: Array<{ name?: string; email?: string; status?: string }>;
}

export interface DeviceCalendar {
  id: string; title: string; source: string; color: string;
  eventKitKind?: "birthdays" | "regular";
  providerMirrorID?: string;
  provider?:'google'|'microsoft';remoteID?:string;providerOwner?:boolean;etag?:string;primary?:boolean;isRemovable?:boolean;
  deviceName: string; allowsChanges: boolean; updatedAt?: string; timeZone?: string;
  accountLocal?: boolean; sharingCalendarID?: string; ownerId?: string; ownerEmail?: string;
  access?: 'reader' | 'writer' | 'owner'; calendarKind?: string; available?: boolean;
}

export interface WebCalendarEvent {
  provider?:'google'|'microsoft';remoteID?:string;providerCalendarID?:string;providerSeriesID?:string;providerEtag?:string;
  calendarId?: string;
  calendarTitle?: string;
  sharingEventId?: string;
  id: string;
  title: string;
  start: string;
  end: string;
  allDay?: boolean;
  url?: string | null;
  location?: string | null;
  color?: string;
  status?: 'confirmed' | 'cancelled' | 'tentative';
  sequence?: number;
  updatedAt?: string;
  details?: WebCalendarEventDetails;
  sourceKind?: 'owned' | 'shared' | 'external';
  externalSource?: string;
  readOnly?: boolean;
  sharedCalendarRevision?: string;
  receivedFeedId?: string;
  receivedAccess?: 'reader' | 'writer' | 'owner';
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

export interface WebCalendarStateResponse {
  calendars?: DeviceCalendar[];
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
  webAccess?: WebStudioAccess;
}

export interface AdminOverviewResponse {
  system: {
    emailConfigured: boolean;
    emailGuardTable: string | null;
    feedHost: string;
    googleIosConfigured: boolean;
    googleWebConfigured: boolean;
    googleWebSecretConfigured?: boolean;
    microsoftWebConfigured: boolean;
    appleWebConfigured?: boolean;
  };
  settings: {
    googleWebClientId: string;
    googleWebSecretConfigured?: boolean;
    microsoftWebClientId: string;
    microsoftTenant: string;
    appleWebClientId?: string;
  };

}

declare global {
  interface Window {
    google?: any;
    AppleID?: any;
  }
}

@Injectable({ providedIn: 'root' })
export class CalendarPlatformApiService {
  readonly apiBaseURL = inject(CALENDAR_API_BASE);
  // Older development builds saved Debug credentials under the public site's key.
  private readonly sessionKey = isDevMode() ? SESSION_STORAGE_KEY + '_production' : SESSION_STORAGE_KEY;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly token = signal<string | null>(null);
  readonly profile = signal<UserProfile | null>(null);
  readonly providers = signal<AuthProvidersInfo | null>(null);
  readonly loadingSession = signal<boolean>(false);
  readonly loadingProfile = signal(false);

  readonly isAuthenticated = computed(() => Boolean(this.token() && this.profile()));
  readonly isSignedInWithAccount = computed(() => {
    const p = this.profile();
    return Boolean(p && (p.verifiedEmails.length > 0 || p.identities.length > 0));
  });

  private sessionGeneration = 0;
  // Keep one immutable response in this tab only. A 304 reuses the exact body
  // whose ETag was sent, even if another request finishes in the meantime.
  private lastCalendarState?: {token: string; etag: string; json: string};
  private initPromise: Promise<void> | null = null;
  private gisScriptPromise: Promise<void> | null = null;
  private appleScriptPromise: Promise<void> | null = null;

  constructor() {
    if (this.isBrowser) {
      const synchronizeSession = (event: StorageEvent) => {
        if (event.storageArea !== localStorage || (event.key !== null && event.key !== this.sessionKey)) return;
        const saved = this.readSavedToken();
        if (saved === this.token()) return;
        delete window.takeCalendarOpeningResponse;
        this.lastCalendarState = undefined;
        this.sessionGeneration++;
        this.profile.set(null);
        this.token.set(saved);
        if (saved) void this.refreshProfile().catch(() => {});
      };
      window.addEventListener('storage', synchronizeSession);
      inject(DestroyRef).onDestroy(() => window.removeEventListener('storage', synchronizeSession));
      const saved = this.readSavedToken();
      if (saved) {
        this.token.set(saved);
      }
    }
  }

  private readSavedToken(): string | null {
    if (!this.isBrowser) return null;
    try {
      return localStorage.getItem(this.sessionKey);
    } catch {
      return null;
    }
  }

  private writeSavedToken(tok: string | null): void {
    if (!this.isBrowser) return;
    try {
      if (tok) localStorage.setItem(this.sessionKey, tok);
      else localStorage.removeItem(this.sessionKey);
    } catch {
      // ignore storage quota / private mode
    }
  }

  async ensureInitialized(): Promise<void> {
    if (!this.isBrowser) return;
    if (this.initPromise) return this.initPromise;
    if (this.providers() && (!this.token() || this.profile())) return;
    this.loadingSession.set(true);
    this.initPromise = Promise.all([
      this.providers() ? Promise.resolve() : this.loadAuthProviders().catch(() => null),
      this.token() && !this.profile() ? this.refreshProfile().catch(() => null) : Promise.resolve(),
    ]).then(() => {});
    try {
      await this.initPromise;
    } finally {
      this.loadingSession.set(false);
      this.initPromise = null;
    }
  }

  private verifySession(generation: number): void {
    if (generation !== this.sessionGeneration) throw new Error('Sign-in session changed.');
  }

  async signOutBrowser(): Promise<void> {
    const token = this.token();
    this.signOut();
    if (!token) return;
    const response = await fetch(this.apiBaseURL + '/auth/web-session', {
      method: 'DELETE', headers: {Authorization: 'Bearer ' + token},
      cache: 'no-store', keepalive: true, signal: AbortSignal.timeout(10000)
    });
    if (!response.ok && response.status !== 401) throw new Error('Could not confirm sign-out with the server.');
  }

  signOut(): void {
    if (this.isBrowser) delete window.takeCalendarOpeningResponse;
    this.lastCalendarState = undefined;
    this.sessionGeneration++;
    this.loadingProfile.set(false);
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
      revalidateCalendarState?: boolean;
    } = {},
  ): Promise<T> {
    const headers: Record<string, string> = {};
    if (opts.body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }
    const generation = this.sessionGeneration;
    const tok = this.token();
    if ((opts.auth || opts.optionalAuth) && tok) {
      headers['Authorization'] = `Bearer ${tok}`;
    }

    const previous = opts.revalidateCalendarState && tok && this.lastCalendarState?.token === tok
      ? this.lastCalendarState : undefined;
    if (previous) headers['If-None-Match'] = previous.etag;

    const url = this.apiBaseURL + path;
    const opening = this.isBrowser && tok && opts.auth && !opts.method && !previous
      ? window.takeCalendarOpeningResponse?.(url, tok) : undefined;
    const res = (opening && await opening) ?? await fetch(url, {
      method: opts.method ?? 'GET',
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
      cache: 'no-store',
      signal: AbortSignal.timeout(30_000),
    });

    if (res.status === 304 && previous) {
      this.verifySession(generation);
      return JSON.parse(previous.json) as T;
    }
    let data: any = null;
    const text = await res.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }
    }

    this.verifySession(generation);
    if (!res.ok) {
      if (res.status === 401 && opts.auth && this.token() === tok) {
        this.signOut();
      }
      const message =
        data?.error ||
        data?.message ||
        (res.status === 409 ? 'This time slot is no longer available.' : `Request failed (${res.status})`);
      throw new CalendarApiError(res.status, message, data?.code, data);
    }
    if (opts.revalidateCalendarState && tok && tok === this.token()) {
      const etag = res.headers.get('etag');
      this.lastCalendarState = etag && text.length <= 2 * 1024 * 1024 ? {token: tok, etag, json: text} : undefined;
    }
    return data as T;
  }

  // ── Auth & Identity ───────────────────────────────────────────────────────

  async loadAuthProviders(): Promise<AuthProvidersInfo> {
    const info = await this.request<AuthProvidersInfo>('/auth/providers');
    this.providers.set(info);
    if (info.appleWebClientId && this.isBrowser && window.location.origin === SITE_URL) {
      // Have the SDK ready before the click so Safari retains user activation.
      void this.loadAppleAuthScript().catch(() => {});
    }
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

  /** Resolves a Google, Apple, or Microsoft token onto the unified CloudCalendars principal graph (`POST /resolve`). */
  async signInWithProviderToken(
    provider: 'google' | 'microsoft' | 'apple',
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

  private loadAppleAuthScript(): Promise<void> {
    if (!this.isBrowser) return Promise.reject(new Error('Browser required'));
    if (window.AppleID?.auth) return Promise.resolve();
    if (this.appleScriptPromise) return this.appleScriptPromise;

    this.appleScriptPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => {
        this.appleScriptPromise = null;
        reject(new Error('Could not load Apple Sign-In SDK.'));
      };
      document.head.appendChild(script);
    });
    return this.appleScriptPromise;
  }

  /**
   * Launches official Sign in with Apple JS popup (`usePopup: true`) for pure account authentication.
   * Verifies the RS256 `id_token` on `/resolve` (`provider: 'apple'`) so the user enters the exact same
   * Cloud Calendars principal as on iPhone / iPad / Mac.
   */
  async signInWithApplePopup(): Promise<{
    idToken: string;
    profile: UserProfile;
  }> {
    const generation = this.sessionGeneration;
    if (!this.isBrowser) throw new Error('Browser required');
    const prov = this.providers() ?? (await this.loadAuthProviders());
    const clientId = (prov.appleWebClientId || '').trim();
    if (!clientId) {
      throw new CalendarApiError(
        400,
        'Apple Web Services ID is not configured yet. Scan the QR code with the Cloud Calendars app, enter your Apple / iCloud email below for a 6-digit code, or set Apple Web Services ID in /admin/.',
        'oauth_not_configured',
      );
    }

    if (window.location.origin !== SITE_URL) {
      throw new CalendarApiError(400, 'Apple sign-in is available on www.cloud-calendars.com.', 'apple_registered_domain');
    }
    if (!window.AppleID?.auth) await this.loadAppleAuthScript();
    const stateBytes = new Uint8Array(16);
    crypto.getRandomValues(stateBytes);
    const state = `ap_${this.base64UrlEncode(stateBytes)}`;
    const nonce = this.base64UrlEncode(crypto.getRandomValues(new Uint8Array(32)));
    const redirectURI = `${SITE_URL}/calendar/`;

    window.AppleID.auth.init({
      clientId,
      scope: 'name email',
      redirectURI,
      state,
      nonce,
      usePopup: true,
    });

    let resp: any;
    try {
      resp = await window.AppleID.auth.signIn();
    } catch (err: any) {
      const code = err?.error || '';
      if (code === 'popup_closed_by_user' || code === 'user_cancelled_authorize') {
        throw new Error('Apple sign-in popup was closed.');
      }
      throw new Error(err?.message || code || 'Apple sign-in failed.');
    }

    const idToken = resp?.authorization?.id_token;
    if (!idToken) {
      throw new Error('No identity token returned by Apple.');
    }

    const payload = idToken.split('.')[1];
    if (resp.authorization.state !== state || !payload ||
        JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))).nonce !== nonce) {
      throw new Error('Apple sign-in response does not match this request. Please try again.');
    }

    const fullName = [resp?.user?.name?.firstName, resp?.user?.name?.lastName]
      .map((s) => String(s ?? '').trim())
      .filter(Boolean)
      .join(' ');

    this.verifySession(generation);
    const profile = await this.signInWithProviderToken(
      'apple',
      idToken,
      fullName || undefined,
    );
    return { idToken, profile };
  }

  /**
   * Launches Google OAuth popup using the CloudCalendars Google Cloud Project (`540859420644`).
   * Account sign-in requests openid, email and profile. Connecting Google Calendar additionally
   * requests https://www.googleapis.com/auth/calendar for calendar, event and sharing operations.
   * - When `googleOfflineCapable` is true (`googleWebClientSecret` configured), uses `initCodeClient` (`access_type: 'offline'`)
   *   so the backend stores a permanent `refresh_token` for 24/7 background sync even while the browser is closed!
   * - Otherwise uses `initTokenClient` and stores the live token on the backend for immediate 2-way read+write sync!
   */
  async signInWithGooglePopup(opts: { includeCalendarReadonly?: boolean } = {}): Promise<{
    accessToken: string;
    profile: UserProfile;
  }> {
    const generation = this.sessionGeneration;
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
      ...(wantCalendarSync ? ['https://www.googleapis.com/auth/calendar'] : []),
    ].join(' ');

    // Path A: Full offline 2-way sync (`initCodeClient` -> `POST /auth/oauth/google-code` -> `refresh_token`)
    if (prov.googleOfflineCapable && wantCalendarSync && window.google.accounts.oauth2.initCodeClient) {
      const code = await new Promise<string>((resolve, reject) => {
        const codeClient = window.google.accounts.oauth2.initCodeClient({
          client_id: prov.googleWebClientId,
          scope: scopes,
          include_granted_scopes: false,
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

      this.verifySession(generation);
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
        include_granted_scopes: false,
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

    this.verifySession(generation);
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
    const generation = this.sessionGeneration;
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
    this.verifySession(generation);
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
    const token = this.token();
    this.loadingProfile.set(true);
    try {
      const p = await this.request<UserProfile>('/me/profile', { auth: true });
      if (this.token() !== token) throw new Error('Sign-in session changed.');
      this.profile.set(p);
      return p;
    } finally {
      if (this.token() === token) this.loadingProfile.set(false);
    }
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

  /** Uses the same authenticated endpoints as the native app. Never accepts an external URL. */
  nativeCalendarRequest<T>(path: string, method = 'GET', body?: unknown): Promise<T> {
    if (!/^\/(?:booking-calendars|events|grants|shared-state|received-invites|event-invitations|icloud-calendars|icloud-calendar|ios\/calendars|identities|auth\/ios-qr|billing\/plans)(?:[/?-]|$)/.test(path)) {
      return Promise.reject(new Error('Unsupported calendar operation.'));
    }
    return this.request<T>(path, { method, body, auth: true });
  }

  getCalendarForecast(parameters: URLSearchParams) {
    return this.request<import('./weatherkit-forecast').AppleForecast>('/web-calendar/weather?' + parameters, {auth: true});
  }

  removeDeviceCalendarFromWeb(id: string) {
    return this.request<{removed: boolean}>(`/web-calendar/device-calendars/${encodeURIComponent(id)}`, {method: 'DELETE', auth: true});
  }

  providerCalendarRequest<T>(provider: 'google' | 'microsoft', body: unknown): Promise<T> {
    return this.request<T>(`/web-calendar/providers/${provider}`, {method: 'POST', body, auth: true});
  }

  async getCalendarState(opts: { sync?: boolean } = {}): Promise<WebCalendarStateResponse> {
    const suffix = opts.sync === undefined ? '' : opts.sync ? '?sync=1' : '?sync=0';
    const state = await this.request<WebCalendarStateResponse>(`/web-calendar/state${suffix}`, { auth: true, revalidateCalendarState: true });
    return { ...state, events: (state.events ?? []).map(withWebEventDetails), receivedEvents: (state.receivedEvents ?? []).map(withWebEventDetails) };
  }

  async upsertCalendarEvent(
    eventId: string,
    payload: {
      calendarId?: string;
      expectedUpdatedAt?: string;
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
      alarms?: CalendarAlarm[];
      recurrenceRules?: Array<{
        frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
        interval?: number;
        endDate?: string;
        occurrenceCount?: number;
      }>;
      attendees?: Array<{ name?: string; email?: string; status?: string }>;
      reason?: string;
    },
  ): Promise<{ event: WebCalendarEvent; sharingCalendarID?: string | null }> {
    const result = await this.request<{ event: WebCalendarEvent; sharingCalendarID?: string | null }>(`/web-calendar/events/${encodeURIComponent(eventId)}`, {
      method: 'PUT',
      auth: true,
      body: nativeEventDetails(payload),
    });
    return { ...result, event: withWebEventDetails(result.event) };
  }

  async deleteCalendarEvent(
    eventId: string,
  ): Promise<{ deleted: boolean; sequence: number; sharingCalendarID?: string | null }> {
    return this.request(`/web-calendar/events/${encodeURIComponent(eventId)}`, {
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

  // ── Platform Admin Console ────────────────────────────────────────────────

  async getAdminOverview(): Promise<AdminOverviewResponse> {
    return this.request('/admin/overview', { auth: true });
  }

  async updateAdminSettings(settings: {
    googleWebClientId?: string;
    googleWebClientSecret?: string;
    microsoftWebClientId?: string;
    microsoftTenant?: string;
    appleWebClientId?: string;
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

  // ── iOS QR Login, 6-Digit Authenticator & Stripe Web Billing ─────────────

  async startIosQrChallenge(linkCurrentAccount = false): Promise<IosQrChallengeStartResponse> {
    return this.request<IosQrChallengeStartResponse>('/auth/ios-qr/start', {
      method: 'POST',
      auth: linkCurrentAccount && Boolean(this.token()),
      body: {},
    });
  }

  async pollIosQrChallenge(
    challengeId: string,
    pollToken: string,
  ): Promise<IosQrPollResponse> {
    const res = await this.request<IosQrPollResponse>('/auth/ios-qr/poll', {
      method: 'POST',
      body: { challengeId, pollToken },
    });
    if (res.status === 'approved' && res.deviceToken) {
      this.token.set(res.deviceToken);
      this.writeSavedToken(res.deviceToken);
      if (res.profile) {
        this.profile.set(res.profile);
      } else {
        await this.refreshProfile().catch(() => null);
      }
    }
    return res;
  }

  async verifyTotpLogin(payload: { email: string; code: string }): Promise<UserProfile> {
    const res = await this.request<{
      deviceToken: string;
      profile: UserProfile;
    }>('/auth/totp/verify', {
      method: 'POST',
      auth: this.isSignedInWithAccount(),
      body: {
        email: payload.email.trim().toLowerCase(),
        code: payload.code.trim().replace(/\s+/g, ''),
      },
    });
    if (res.deviceToken) {
      this.token.set(res.deviceToken);
      this.writeSavedToken(res.deviceToken);
    }
    const profile = res.profile ?? (await this.refreshProfile());
    this.profile.set(profile);
    return profile;
  }

  async createBillingCheckout(
    plan: 'monthly' | 'yearly',
    returnUrl?: string,
  ): Promise<{ sessionId: string; url: string; checkoutUrl: string }> {
    return this.request('/billing/checkout', {
      method: 'POST',
      auth: true,
      body: {
        plan,
        returnUrl: returnUrl || (this.isBrowser ? window.location.href : undefined),
      },
    });
  }

  async reconcileBillingCheckout(
    sessionId: string,
  ): Promise<{ reconciled: boolean; profile?: UserProfile }> {
    const res = await this.request<{ reconciled: boolean; profile?: UserProfile }>(
      '/billing/reconcile',
      {
        method: 'POST',
        auth: true,
        body: { sessionId },
      },
    );
    if (res.profile) {
      this.profile.set(res.profile);
    } else if (res.reconciled) {
      await this.refreshProfile().catch(() => null);
    }
    return res;
  }

  async createBillingPortal(returnUrl?: string): Promise<{ url: string; portalUrl: string }> {
    return this.request('/billing/portal', {
      method: 'POST',
      auth: true,
      body: {
        returnUrl: returnUrl || (this.isBrowser ? window.location.href : undefined),
      },
    });
  }
}
