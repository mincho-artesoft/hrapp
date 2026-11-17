import { NativeCalendarStore } from './native-calendar-store';
import { Injectable } from '@nestjs/common';
import { createHash, randomInt, timingSafeEqual } from 'node:crypto';
import { StoreService } from '../store/store.service';
import { CoreService } from '../core/core.service';
import { EmailService } from '../email/email.service';
import { CalendarService } from '../calendar/calendar.service';
import { ApiResult, result } from '../common/api-result';
import { randomId } from '../util/ids';
import { buildFeed } from '../util/ics';
import { verifyGoogleIdToken, verifyMicrosoftToken } from '../util/verify';
import {
  buildOtpAuthUri,
  generateTotpSecret,
  verifyTotpCode,
} from '../util/totp';
import {
  StripeRestError,
  isStripeLiveKey,
  loadLocalStripeCatalog,
  stripeRequest,
  verifyStripeWebhookEvent,
} from '../util/stripe-rest';
import {
  OAuthConnectionsDoc,
  exchangeGoogleAuthCode,
  pullGoogleCalendarBusyEvents,
  pullMicrosoftCalendarBusyEvents,
  pushDeleteGoogleCalendarEvent,
  pushDeleteMicrosoftCalendarEvent,
  pushUpsertGoogleCalendarEvent,
  pushUpsertMicrosoftCalendarEvent,
  refreshGoogleAccessToken,
  refreshMicrosoftAccessToken,
  sanitizeConnectionsDoc,
} from './provider-sync.helper';
import {
  BookingScheduleConfig,
  BusyInterval,
  MeetingTypeConfig,
  TimeWindow,
  computeAvailableSlots,
  expandEventBusyIntervals,
  fiveMinuteBucketKeys,
  isValidTimeZone,
  localPartsInZone,
  parseExternalIcsEvents,
} from './slot-engine';

const DEFAULT_ADMIN_EMAILS = [
  'mincho.milev@gmail.com',
  'office@arte-soft.com',
  'support@arte-soft.com',
  'bookings@cloud-calendars.com',
];

const RESERVED_HANDLES = new Set([
  'admin', 'api', 'app', 'app-auth', 'articles', 'auth', 'billing', 'book', 'booking', 'bookings',
  'calendar', 'compare', 'demo', 'event', 'events', 'feed', 'feeds', 'guest',
  'help', 'home', 'login', 'manage', 'me', 'oauth', 'pricing', 'privacy',
  'privacy-policy', 'register', 'resolve', 'root', 'schedule', 'settings',
  'shared', 'signin', 'signup', 'studio', 'support', 'system', 'terms',
  'terms-of-service', 'tools', 'web', 'www',
]);

function normalizeEmail(value: unknown): string | null {
  const s = String(value ?? '').trim().toLowerCase();
  if (!s || s.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return null;
  return s;
}

function normalizeHandle(value: unknown): string | null {
  const s = String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
  if (s.length < 3 || s.length > 40) return null;
  if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(s)) return null;
  return s;
}

function validHexColor(value: unknown, fallback = '#0A84FF'): string {
  const s = String(value ?? '').trim();
  return /^#[0-9A-Fa-f]{6}$/.test(s) ? s.toUpperCase() : fallback;
}

function hashOtp(email: string, code: string): string {
  return createHash('sha256').update(`cc-otp:${email}:${code}`).digest('hex');
}

function safePublicHttpsUrl(value: unknown): URL | null {
  let raw = String(value ?? '').trim();
  if (!raw || raw.length > 1024) return null;
  if (raw.startsWith('webcal://')) raw = 'https://' + raw.slice('webcal://'.length);
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:') return null;
  const host = url.hostname.toLowerCase();
  if (
    host === 'localhost' ||
    host.endsWith('.local') ||
    host.endsWith('.internal') ||
    host.includes(':') ||
    /^(127\.|10\.|192\.168\.|169\.254\.|0\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host)
  ) {
    return null;
  }
  return url;
}

@Injectable()
export class WebPlatformService {
  private readonly SITE_URL = process.env.SITE_URL ?? 'https://www.cloud-calendars.com';
  private readonly GOOGLE_IOS_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? '';
  // Reuses the already-approved CloudCalendars Microsoft Entra App (`Calendars.ReadWrite offline_access User.Read`)
  private readonly MICROSOFT_DEFAULT_CLIENT_ID =
    process.env.MICROSOFT_WEB_CLIENT_ID ?? '5b1a5159-948f-4b5b-ac6a-009df927c665';

  constructor(
    private readonly store: StoreService,
    private readonly core: CoreService,
    private readonly email: EmailService,
    private readonly calendarService: CalendarService,
  ) {}

  private get nativeCalendars() { return new NativeCalendarStore(this.store); }

  async syncNativeCalendar(principal: any, body: any): Promise<ApiResult> {
    return this.nativeCalendars.sync(principal, body);
  }

  private get keys() {
    return this.store.keys;
  }

  private adminEmailSet(): Set<string> {
    const raw = process.env.ADMIN_EMAILS
      ? process.env.ADMIN_EMAILS.split(',')
      : DEFAULT_ADMIN_EMAILS;
    return new Set(raw.map((e) => e.trim().toLowerCase()).filter(Boolean));
  }

  private verifiedEmailsForPrincipal(principalDoc: any): string[] {
    const out = new Set<string>();
    const identities = principalDoc?.identities ?? {};
    for (const entry of Object.values(identities) as any[]) {
      const em = normalizeEmail(entry?.email);
      if (em) out.add(em);
    }
    const direct = normalizeEmail(principalDoc?.email);
    if (direct) out.add(direct);
    return [...out];
  }

  private isAdminPrincipal(principalDoc: any): boolean {
    const admins = this.adminEmailSet();
    return this.verifiedEmailsForPrincipal(principalDoc).some((em) => admins.has(em));
  }

  public computeWebAccess(principalDoc: any) {
    const isAdmin = this.isAdminPrincipal(principalDoc);
    const iosUnlocked = Boolean(principalDoc?.iosUnlocked || principalDoc?.iosUnlockedAt);
    const billing = principalDoc?.billing ?? null;
    const subStatus = billing?.status ? String(billing.status) : null;
    const stripeActive = Boolean(subStatus && ['active', 'trialing'].includes(subStatus));

    const entitled = isAdmin || iosUnlocked || stripeActive;
    const accessSource: 'admin' | 'ios_app' | 'stripe_monthly' | 'stripe_yearly' | 'none' = isAdmin
      ? 'admin'
      : iosUnlocked
        ? 'ios_app'
        : stripeActive
          ? billing?.plan === 'yearly'
            ? 'stripe_yearly'
            : 'stripe_monthly'
          : 'none';

    const plan: 'ios_free' | 'monthly' | 'yearly' | 'admin' | 'none' = isAdmin
      ? 'admin'
      : iosUnlocked
        ? 'ios_free'
        : stripeActive
          ? billing?.plan === 'yearly'
            ? 'yearly'
            : 'monthly'
          : 'none';

    return {
      entitled,
      accessSource,
      iosUnlocked,
      iosUnlockedAt: principalDoc?.iosUnlockedAt ?? null,
      totpEnabled: Boolean(principalDoc?.totpSecret),
      plan,
      subscriptionStatus: subStatus,
      cancelAtPeriodEnd: Boolean(billing?.cancelAtPeriodEnd),
      currentPeriodEnd: billing?.currentPeriodEnd ?? null,
      hasBillingPortal: Boolean(billing?.stripeCustomerId),
      pricing: {
        monthlyUsd: 1.99,
        yearlyUsd: 19.99,
      },
    };
  }

  private unentitledStudioResult(principalDoc: any): ApiResult {
    return result(402, {
      code: 'subscription_required',
      error:
        'Unlock Cloud Calendars Web Studio for free forever by signing in with the Cloud Calendars iOS app, or subscribe on the web ($1.99/month or $19.99/year).',
      webAccess: this.computeWebAccess(principalDoc),
    });
  }

  // ── 1. Auth Providers, Email OTP & Enriched Profile ──────────────────────

  async getAuthProviders(): Promise<ApiResult> {
    const settings = (await this.store.getJSON(this.keys.adminSettings())) ?? {};
    const googleWebClientId = String(
      settings.googleWebClientId ?? process.env.GOOGLE_WEB_CLIENT_ID ?? '',
    ).trim();
    const googleWebClientSecret = String(
      settings.googleWebClientSecret ?? process.env.GOOGLE_WEB_CLIENT_SECRET ?? '',
    ).trim();
    const microsoftWebClientId = String(
      settings.microsoftWebClientId || this.MICROSOFT_DEFAULT_CLIENT_ID || '',
    ).trim();
    const microsoftTenant = String(
      settings.microsoftTenant ?? process.env.MICROSOFT_TENANT ?? 'common',
    ).trim() || 'common';

    return result(200, {
      googleWebClientId: googleWebClientId || null,
      googleIosClientId: this.GOOGLE_IOS_CLIENT_ID || null,
      googleOfflineCapable: Boolean(googleWebClientId && googleWebClientSecret),
      microsoftWebClientId: microsoftWebClientId || null,
      microsoftTenant,
      emailOtpEnabled: true,
      featuredDemoHandle: settings.featuredDemoHandle || 'demo',
    });
  }

  /**
   * Exchanges a Google OAuth2 authorization code (`initCodeClient`) for `access_token` + `refresh_token`,
   * resolves the unified CloudCalendars principal/calendar (`POST /resolve` parity), stores 2-way sync
   * credentials in `oauth-connections.json`, and performs an initial Google Calendar busy pull!
   */
  async signInWithGoogleAuthCode(authHeader: string, body: any): Promise<ApiResult> {
    const code = String(body?.code ?? '').trim();
    if (!code) {
      return result(400, { error: 'Authorization code is required.' });
    }
    const settings = (await this.store.getJSON(this.keys.adminSettings())) ?? {};
    const clientId = String(
      body?.clientId ?? settings.googleWebClientId ?? process.env.GOOGLE_WEB_CLIENT_ID ?? '',
    ).trim();
    const clientSecret = String(
      settings.googleWebClientSecret ?? process.env.GOOGLE_WEB_CLIENT_SECRET ?? '',
    ).trim();
    if (!clientId) {
      return result(400, { error: 'Google Web Client ID is not configured.' });
    }

    let exchanged: { accessToken: string; refreshToken: string | null; idToken: string | null; expiresIn: number };
    try {
      exchanged = await exchangeGoogleAuthCode({
        code,
        clientId,
        clientSecret: clientSecret || null,
        redirectUri: typeof body?.redirectUri === 'string' ? body.redirectUri : 'postmessage',
      });
    } catch (err: any) {
      return result(401, { error: err?.message || 'Google authorization code exchange failed.' });
    }

    const resolveRes = await this.calendarService.resolve(authHeader, {
      provider: 'google',
      token: exchanged.idToken || exchanged.accessToken,
      name: body?.name || 'Cloud Calendar',
      timeZone: body?.timeZone || 'UTC',
    });
    if (resolveRes.status >= 400) {
      return resolveRes;
    }

    const resolvedBody: any = resolveRes.body;
    const calId = resolvedBody.calendarId;
    const principalId = resolvedBody.ownerId;

    await this.saveProviderConnectionTokens(calId, 'google', {
      accessToken: exchanged.accessToken,
      refreshToken: exchanged.refreshToken,
      expiresIn: exchanged.expiresIn,
      clientId,
      accountEmail: resolvedBody.email ?? null,
      autoPushEvents: body?.autoPushEvents !== false,
    });

    await this.refreshConnectedBusyEventsIfNeeded(calId, { force: true }).catch(() => {});
    const profileRes = await this.getProfile({ principalId, calId });

    return result(resolveRes.status, {
      ...resolvedBody,
      profile: profileRes.body,
    });
  }

  async requestEmailAuthCode(body: any): Promise<ApiResult> {
    const email = normalizeEmail(body?.email);
    if (!email) {
      return result(400, { error: 'Please enter a valid email address.' });
    }
    const emailHash = this.core.emailHash(email);
    const existingOtp = await this.store.getJSON(this.keys.authOtp(emailHash));
    if (existingOtp?.sentAt && Date.now() - Number(existingOtp.sentAt) < 25_000) {
      return result(429, { error: 'Please wait 25 seconds before requesting another code.' });
    }

    const code = String(randomInt(100_000, 1_000_000));
    const now = Date.now();
    await this.store.putJSON(this.keys.authOtp(emailHash), {
      codeHash: hashOtp(email, code),
      sentAt: now,
      expiresAt: now + 10 * 60_000,
      attempts: 0,
    });

    await this.email.sendVerificationCodeEmail({
      email,
      code,
      purpose: 'login',
    });

    return result(200, {
      sent: true,
      email,
      expiresInSeconds: 600,
    });
  }

  async verifyEmailAuthCode(authHeader: string, body: any): Promise<ApiResult> {
    const email = normalizeEmail(body?.email);
    const code = String(body?.code ?? '').trim().replace(/\s+/g, '');
    if (!email || !/^\d{6}$/.test(code)) {
      return result(400, { error: 'Email and 6-digit verification code are required.' });
    }

    const emailHash = this.core.emailHash(email);
    const otpKey = this.keys.authOtp(emailHash);
    const otp = await this.store.getJSON(otpKey);
    if (!otp || Number(otp.expiresAt) < Date.now()) {
      return result(401, { error: 'This code has expired. Please request a new one.' });
    }
    if (Number(otp.attempts ?? 0) >= 5) {
      await this.store.del(otpKey);
      return result(401, { error: 'Too many incorrect attempts. Please request a new code.' });
    }
    if (otp.codeHash !== hashOtp(email, code)) {
      await this.store.putJSON(otpKey, { ...otp, attempts: Number(otp.attempts ?? 0) + 1 });
      return result(401, { error: 'Invalid verification code.' });
    }
    await this.store.del(otpKey);

    // Resolve or link onto the exact same accountEmail -> principalId -> calId graph as /resolve!
    const rawToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    const caller = rawToken ? await this.core.resolveToken(rawToken) : null;
    const emailIndexKey = this.keys.accountEmail(emailHash);
    const emailOwner = await this.store.getJSON(emailIndexKey);

    if (caller && emailOwner && emailOwner.principalId !== caller.principalId) {
      return result(409, { error: 'This email is already linked to another Cloud Calendars account.' });
    }

    const existingPrincipal = emailOwner?.principalId
      ? await this.store.getJSON(this.keys.principal(String(emailOwner.principalId)))
      : null;

    const principalId = caller?.principalId ?? existingPrincipal?.id ?? randomId(16);
    let calId = caller?.calId ?? existingPrincipal?.calId;
    let ownerFeedId: string | undefined;

    const requestedName = typeof body?.name === 'string' ? body.name.trim().slice(0, 120) : '';
    const requestedTz = isValidTimeZone(body?.timeZone) ? body.timeZone : 'UTC';

    if (!calId) {
      const created = await this.core.createCalendar(principalId, {
        name: requestedName ? `${requestedName}’s Calendar` : 'Cloud Calendars',
        timeZone: requestedTz,
      });
      calId = created.calId;
      ownerFeedId = created.ownerFeedId;
    } else {
      const acl = await this.store.getJSON(this.keys.acl(calId));
      ownerFeedId = Object.keys(acl?.feeds ?? {}).find((f) => acl.feeds[f].role === 'owner');
    }

    const identityId = `email:${emailHash}`;
    const principalDoc = (await this.store.getJSON(this.keys.principal(principalId))) ?? {
      id: principalId,
      calId,
      createdAt: new Date().toISOString(),
    };
    principalDoc.email = principalDoc.email || email;
    if (requestedName && !principalDoc.displayName) {
      principalDoc.displayName = requestedName;
    }
    principalDoc.identities = {
      ...(principalDoc.identities ?? {}),
      email: { id: identityId, email },
    };

    await Promise.all([
      this.store.putJSON(this.keys.principal(principalId), principalDoc),
      this.store.putJSON(emailIndexKey, { principalId }),
      this.store.putJSON(this.keys.identity('email', emailHash), {
        principalId,
        calId,
        provider: 'email',
        email,
      }),
    ]);

    const deviceToken = await this.core.issueToken(principalId, calId, {
      provider: 'email',
      id: identityId,
    });

    const profileRes = await this.getProfile({ principalId, calId });
    return result(existingPrincipal || caller ? 200 : 201, {
      calendarId: calId,
      deviceToken,
      feedId: ownerFeedId ?? null,
      feedUrl: ownerFeedId ? this.core.feedUrl(ownerFeedId) : null,
      email,
      provider: 'email',
      ownerId: principalId,
      created: !(existingPrincipal || caller),
      profile: profileRes.body,
    });
  }

  async getProfile(principal: any): Promise<ApiResult> {
    const { principalId, calId } = principal;
    const [principalDoc, meta, acl, bookingCfg, connDoc] = await Promise.all([
      this.store.getJSON(this.keys.principal(principalId)),
      this.store.getJSON(this.keys.meta(calId)),
      this.store.getJSON(this.keys.acl(calId)),
      this.store.getJSON(this.keys.bookingConfig(calId)),
      this.store.getJSON(this.keys.oauthConnections(calId)),
    ]);

    const emails = this.verifiedEmailsForPrincipal(principalDoc);
    const primaryEmail = emails[0] ?? null;
    const ownerFeedId = Object.keys(acl?.feeds ?? {}).find((f) => acl.feeds[f].role === 'owner') ?? null;
    const feedUrl = ownerFeedId ? this.core.feedUrl(ownerFeedId) : null;

    let guestBookingsCount = 0;
    if (emails.length) {
      const lists = await Promise.all(
        emails.map((em) => this.store.listKeys(this.keys.guestBookingsPrefix(this.core.emailHash(em)))),
      );
      guestBookingsCount = new Set(lists.flat()).size;
    }

    const identities = Object.entries(principalDoc?.identities ?? {}).map(([provider, val]: [string, any]) => ({
      provider,
      email: val?.email ?? null,
    }));

    return result(200, {
      principalId,
      calId,
      email: primaryEmail,
      verifiedEmails: emails,
      displayName: principalDoc?.displayName ?? bookingCfg?.displayName ?? meta?.name ?? 'Calendar User',
      calendarName: meta?.name ?? 'Cloud Calendars',
      timeZone: meta?.timeZone ?? bookingCfg?.timeZone ?? 'UTC',
      defaultColor: validHexColor(meta?.defaultColor, '#0A84FF'),
      firstWeekday: Number.isInteger(meta?.firstWeekday) ? meta.firstWeekday : 1,
      feedId: ownerFeedId,
      feedUrl,
      webcalUrl: feedUrl ? feedUrl.replace(/^https?:\/\//, 'webcal://') : null,
      identities,
      connectedProviders: sanitizeConnectionsDoc(connDoc),
      isAdmin: this.isAdminPrincipal(principalDoc),
      isHost: Boolean(bookingCfg?.handle),
      bookingEnabled: Boolean(bookingCfg?.enabled && !bookingCfg?.disabledByAdmin),
      bookingHandle: bookingCfg?.handle ?? null,
      bookingShareUrl: bookingCfg?.handle ? `${this.SITE_URL}/book/?u=${encodeURIComponent(bookingCfg.handle)}` : null,
      guestBookingsCount,
      webAccess: this.computeWebAccess(principalDoc),
    });
  }

  async updateProfile(principal: any, body: any): Promise<ApiResult> {
    const { principalId, calId } = principal;
    const [principalDoc, meta] = await Promise.all([
      this.store.getJSON(this.keys.principal(principalId)),
      this.store.getJSON(this.keys.meta(calId)),
    ]);

    const nextPrincipal = {
      ...(principalDoc ?? { id: principalId, calId, createdAt: new Date().toISOString() }),
    };
    if (typeof body?.displayName === 'string' && body.displayName.trim()) {
      nextPrincipal.displayName = body.displayName.trim().slice(0, 120);
    }

    const nextMeta = { ...(meta ?? { id: calId, ownerId: principalId, createdAt: new Date().toISOString() }) };
    if (typeof body?.calendarName === 'string' && body.calendarName.trim()) {
      nextMeta.name = body.calendarName.trim().slice(0, 120);
    }
    if (isValidTimeZone(body?.timeZone)) {
      nextMeta.timeZone = body.timeZone;
    }
    if (body?.defaultColor !== undefined) {
      nextMeta.defaultColor = validHexColor(body.defaultColor, nextMeta.defaultColor ?? '#0A84FF');
    }
    if (body?.firstWeekday !== undefined && [0, 1, 6].includes(Number(body.firstWeekday))) {
      nextMeta.firstWeekday = Number(body.firstWeekday);
    }
    nextMeta.lastWriteAt = new Date().toISOString();

    await Promise.all([
      this.store.putJSON(this.keys.principal(principalId), nextPrincipal),
      this.store.putJSON(this.keys.meta(calId), nextMeta),
    ]);
    await this.core.regenerate(calId);
    return this.getProfile(principal);
  }

  // ── 2. Web Calendar Workspace (100% CloudCalendars Event Wire Format) ─────

  async getWebCalendarState(principal: any, query: any): Promise<ApiResult> {
    const { principalId, calId } = principal;
    // Automatically refresh connected Google / Microsoft busy events if stale (> 60s, or forced via ?sync=1)
    await this.refreshConnectedBusyEventsIfNeeded(calId, {
      force: query?.sync === '1',
    }).catch(() => {});

    const [principalDoc, meta, eventKeys, receivedKeys, busyDoc, bookingCfg, connDoc] = await Promise.all([
      this.store.getJSON(this.keys.principal(principalId)),
      this.store.getJSON(this.keys.meta(calId)),
      this.store.listKeys(this.keys.events(calId)),
      this.store.listKeys(this.keys.receivedInvites(principalId)),
      this.store.getJSON(this.keys.bookingBusy(calId)),
      this.store.getJSON(this.keys.bookingConfig(calId)),
      this.store.getJSON(this.keys.oauthConnections(calId)),
    ]);

    const fromMs = query?.from && Number.isFinite(Date.parse(query.from)) ? Date.parse(query.from) : null;
    const toMs = query?.to && Number.isFinite(Date.parse(query.to)) ? Date.parse(query.to) : null;

    const rawEvents = (await Promise.all(eventKeys.map((k) => this.store.getJSON(k)))).filter(Boolean);
    const events = rawEvents
      .filter((ev) => {
        if (ev.status === 'cancelled' && query?.includeCancelled !== '1') return false;
        if (fromMs != null && toMs != null && !ev.details?.recurrenceRules?.length) {
          const s = Date.parse(ev.start);
          const e = Date.parse(ev.end);
          if (Number.isFinite(s) && Number.isFinite(e) && (e < fromMs || s > toMs)) return false;
        }
        return true;
      })
      .map((ev) => ({
        ...ev,
        color: validHexColor(ev.color ?? ev.details?.color, meta?.defaultColor ?? '#0A84FF'),
      }))
      .sort((a, b) => Date.parse(a.start) - Date.parse(b.start));

    // Also include shared events accepted by this principal (`receivedInvites`)
    const receivedRefs = (await Promise.all(receivedKeys.map((k) => this.store.getJSON(k)))).filter(Boolean);
    const receivedEvents = (
      await Promise.all(
        receivedRefs.map(async (ref) => {
          if (!ref?.ownerCalId || !ref?.eventId) return null;
          const ev = await this.store.getJSON(this.keys.event(ref.ownerCalId, ref.eventId));
          if (!ev || ev.status === 'cancelled') return null;
          return {
            ...ev,
            color: validHexColor(ev.color ?? ev.details?.color, '#BF5AF2'),
            isReceivedShared: true,
            receivedFeedId: ref.feedId,
            receivedAccess: ref.access ?? 'reader',
          };
        }),
      )
    ).filter(Boolean);

    const deviceCalendars = await this.nativeCalendars.list(principal);
    const activeCalendars = deviceCalendars.filter(c => c.available !== false);
    const nativeEvents = activeCalendars.flatMap(c => c.events.map((e: any) => this.nativeCalendars.eventForWeb(c, e)));

    return result(200, {
      calendars: activeCalendars.map(({ events, ...calendar }) => calendar),
      calendar: {
        id: calId,
        name: meta?.name ?? 'Cloud Calendars',
        timeZone: meta?.timeZone ?? 'UTC',
        defaultColor: validHexColor(meta?.defaultColor, '#0A84FF'),
        firstWeekday: Number.isInteger(meta?.firstWeekday) ? meta.firstWeekday : 1,
      },
      events: [...events, ...nativeEvents],
      receivedEvents,
      externalBusy: {
        updatedAt: busyDoc?.updatedAt ?? null,
        sources: busyDoc?.sources ?? {},
        events: Array.isArray(busyDoc?.events) ? busyDoc.events : [],
      },
      connectedProviders: sanitizeConnectionsDoc(connDoc),
      bookingConfig: bookingCfg ?? null,
      webAccess: this.computeWebAccess(principalDoc),
    });
  }

  /**
   * Creates or updates a CloudCalendars event from the Web Calendar (including 60fps
   * drag-and-drop move, edge resize, all-day conversion, and full editor saves).
   * If the event is a booked appointment, atomically updates slot locks and notifies the guest!
   */
  async upsertWebCalendarEvent(
    principal: any,
    eventId: string,
    body: any,
    opts?: { skipEntitlementCheck?: boolean },
  ): Promise<ApiResult> {
    if (eventId.startsWith('native.') || body?.calendarId) {
      const doc = await this.store.getJSON(this.keys.principal(principal.principalId));
      if (!opts?.skipEntitlementCheck && !this.computeWebAccess(doc).entitled) return this.unentitledStudioResult(doc);
      return this.nativeCalendars.mutate(principal, eventId, body);
    }
    const { principalId, calId } = principal;
    if (!eventId || !/^[A-Za-z0-9_-]{3,128}$/.test(eventId)) {
      return result(400, { error: 'Invalid event id.' });
    }
    const startMs = Date.parse(String(body?.start ?? ''));
    const endMs = Date.parse(String(body?.end ?? ''));
    if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs <= startMs) {
      return result(400, { error: 'Valid start and end ISO timestamps (end > start) are required.' });
    }

    const [principalDoc, meta] = await Promise.all([
      this.store.getJSON(this.keys.principal(principalId)),
      this.store.getJSON(this.keys.meta(calId)),
    ]);
    if (!opts?.skipEntitlementCheck && !this.computeWebAccess(principalDoc).entitled) {
      return this.unentitledStudioResult(principalDoc);
    }
    const ownerEmail = this.verifiedEmailsForPrincipal(principalDoc)[0] ?? null;
    const ownerName = principalDoc?.displayName ?? meta?.name ?? 'Cloud Calendars';

    const existingWithEtag = await this.store.getJSONWithETag(this.keys.event(calId, eventId));
    const existing = existingWithEtag?.value ?? null;
    if (existing?.status === 'cancelled') {
      return result(409, { error: 'Cancelled events cannot be edited.' });
    }

    const isBooking = Boolean(existing?.booking?.bookingId);
    const oldStartMs = existing ? Date.parse(existing.start) : null;
    const oldEndMs = existing ? Date.parse(existing.end) : null;
    const timeChanged = existing != null && (oldStartMs !== startMs || oldEndMs !== endMs);

    // If dragging/moving a booked meeting, atomically lock the new 5-minute buckets first!
    let newlyLockedBuckets: string[] = [];
    if (isBooking && timeChanged) {
      const lockRes = await this.claimSlotBucketsForEvent(calId, eventId, startMs, endMs);
      if (!lockRes.ok) {
        return result(409, { error: 'That time overlaps another booked meeting on your schedule.' });
      }
      newlyLockedBuckets = lockRes.newlyCreated;
    }

    const color = validHexColor(
      body?.color ?? body?.details?.color ?? existing?.color ?? existing?.details?.color,
      meta?.defaultColor ?? '#0A84FF',
    );
    const videoCallURL = body?.videoCallURL !== undefined
      ? (body.videoCallURL ? String(body.videoCallURL).trim().slice(0, 1024) : null)
      : (body?.details?.videoCallURL !== undefined
        ? (body.details.videoCallURL ? String(body.details.videoCallURL).trim().slice(0, 1024) : null)
        : (existing?.details?.videoCallURL ?? null));

    const notes = body?.notes !== undefined
      ? (body.notes != null ? String(body.notes).slice(0, 20000) : null)
      : (body?.description !== undefined
        ? (body.description != null ? String(body.description).slice(0, 20000) : null)
        : (existing?.details?.notes ?? existing?.description ?? null));

    const tz = isValidTimeZone(body?.timeZone ?? body?.details?.timeZone)
      ? (body.timeZone ?? body.details.timeZone)
      : (existing?.details?.timeZone ?? meta?.timeZone ?? 'UTC');

    const attendees = Array.isArray(body?.attendees ?? body?.details?.attendees)
      ? (body.attendees ?? body.details.attendees).slice(0, 100).map((a: any) => ({
          name: a?.name ? String(a.name).slice(0, 200) : null,
          email: normalizeEmail(a?.email),
          role: Number.isInteger(a?.role) ? a.role : 1,
          type: Number.isInteger(a?.type) ? a.type : 1,
          status: Number.isInteger(a?.status) ? a.status : 1,
          isCurrentUser: Boolean(a?.isCurrentUser),
        })).filter((a: any) => a.email)
      : (existing?.details?.attendees ?? []);

    const alarms = Array.isArray(body?.alarms ?? body?.details?.alarms)
      ? (body.alarms ?? body.details.alarms).slice(0, 8).map((al: any) => ({
          relativeOffset: typeof al?.relativeOffset === 'number' ? al.relativeOffset : -900,
          absoluteDate: null,
        }))
      : (existing?.details?.alarms ?? [{ relativeOffset: -900, absoluteDate: null }]);

    const recurrenceRules = Array.isArray(body?.recurrenceRules ?? body?.details?.recurrenceRules)
      ? (body.recurrenceRules ?? body.details.recurrenceRules)
      : (existing?.details?.recurrenceRules ?? []);

    const nowIso = new Date().toISOString();
    const startIso = new Date(startMs).toISOString();
    const endIso = new Date(endMs).toISOString();

    const details = {
      ...(existing?.details ?? {}),
      notes,
      timeZone: tz,
      color,
      availability: typeof body?.availability === 'number'
        ? body.availability
        : (existing?.details?.availability ?? 0),
      alarms,
      recurrenceRules,
      structuredLocation:
        body?.structuredLocation !== undefined
          ? body.structuredLocation
          : body?.details?.structuredLocation !== undefined
            ? body.details.structuredLocation
            : (existing?.details?.structuredLocation ?? null),
      videoCallURL,
      travelTime:
        body?.travelTime !== undefined
          ? body.travelTime
          : body?.details?.travelTime !== undefined
            ? body.details.travelTime
            : (existing?.details?.travelTime ?? null),
      attachments:
        Array.isArray(body?.attachments)
          ? body.attachments.slice(0, 12)
          : Array.isArray(body?.details?.attachments)
            ? body.details.attachments.slice(0, 12)
            : (existing?.details?.attachments ?? []),
      organizer: existing?.details?.organizer ?? (ownerEmail ? {
        name: ownerName,
        email: ownerEmail,
        role: 3,
        type: 1,
        status: 2,
        isCurrentUser: true,
      } : null),
      attendees,
    };

    const nextEvent: any = {
      ...(existing ?? {}),
      id: eventId,
      sequence: existing ? Number(existing.sequence ?? 0) + 1 : 0,
      title: String(body?.title ?? existing?.title ?? 'Untitled Event').trim().slice(0, 300) || 'Untitled Event',
      start: startIso,
      end: endIso,
      allDay: Boolean(body?.allDay ?? existing?.allDay ?? false),
      location: body?.location !== undefined
        ? (body.location ? String(body.location).trim().slice(0, 1024) : null)
        : (existing?.location ?? null),
      url: body?.url !== undefined
        ? (body.url ? String(body.url).trim().slice(0, 1024) : null)
        : (existing?.url ?? null),
      color,
      description: notes,
      details,
      organizerName: existing?.organizerName ?? ownerName,
      organizerEmail: existing?.organizerEmail ?? ownerEmail,
      status: 'confirmed',
      ownerId: existing?.ownerId ?? principalId,
      createdBy: existing?.createdBy ?? principalId,
      updatedAt: nowIso,
    };

    if (isBooking && existing?.booking) {
      nextEvent.booking = {
        ...existing.booking,
        rescheduledCount: timeChanged
          ? Number(existing.booking.rescheduledCount ?? 0) + 1
          : Number(existing.booking.rescheduledCount ?? 0),
        updatedAt: nowIso,
      };
    }

    await this.store.putJSON(this.keys.event(calId, eventId), nextEvent);

    // 2-Way Sync: push newly created or dragged/edited event to connected Google / Microsoft calendars!
    await this.mirrorEventToConnectedProviders(calId, nextEvent, 'upsert').catch(() => {});
    if (isBooking && timeChanged) {
      await this.mirrorBookingToGuestCalendars(nextEvent, 'upsert').catch(() => {});
    }

    if (isBooking && timeChanged && oldStartMs != null && oldEndMs != null) {
      await this.releaseNonOverlappingBuckets(calId, eventId, oldStartMs, oldEndMs, startMs, endMs);
      await this.syncBookingIndexesAfterChange(calId, nextEvent, 'rescheduled');
    }

    await this.core.regenerate(calId, eventId);

    // Notify guest automatically when host drags/moves a booked meeting (unless silent=true)
    if (isBooking && timeChanged && body?.notifyGuest !== false && existing?.booking?.guestEmail) {
      const b = nextEvent.booking;
      const feedUrl = b.feedId ? this.core.feedUrl(b.feedId) : null;
      const singleIcs = buildFeed({
        name: nextEvent.title,
        timeZone: b.guestTimeZone || tz,
        role: 'viewer',
        events: [nextEvent],
      });
      await this.email.sendBookingInviteeNotification({
        kind: 'rescheduled',
        event: nextEvent,
        hostName: ownerName,
        hostEmail: ownerEmail,
        guestName: b.guestName || 'Guest',
        guestEmail: b.guestEmail,
        timeZone: b.guestTimeZone || tz,
        webcalUrl: feedUrl ? feedUrl.replace(/^https?:\/\//, 'webcal://') : null,
        icsContent: singleIcs,
        manageUrl: `${this.SITE_URL}/booking/manage/?t=${encodeURIComponent(b.manageToken)}`,
        guestPortalUrl: `${this.SITE_URL}/bookings/`,
        videoCallURL: nextEvent.details?.videoCallURL ?? null,
        reason: typeof body?.reason === 'string' ? body.reason.slice(0, 500) : null,
      });
    }

    return result(existing ? 200 : 201, {
      event: nextEvent,
      notifiedGuest: Boolean(isBooking && timeChanged && body?.notifyGuest !== false),
    });
  }

  async deleteWebCalendarEvent(
    principal: any,
    eventId: string,
    query: any,
    opts?: { skipEntitlementCheck?: boolean },
  ): Promise<ApiResult> {
    if (eventId.startsWith('native.')) {
      const doc = await this.store.getJSON(this.keys.principal(principal.principalId));
      if (!opts?.skipEntitlementCheck && !this.computeWebAccess(doc).entitled) return this.unentitledStudioResult(doc);
      return this.nativeCalendars.mutate(principal, eventId, {}, true);
    }
    const { principalId, calId } = principal;
    if (!opts?.skipEntitlementCheck) {
      const principalDocCheck = await this.store.getJSON(this.keys.principal(principalId));
      if (!this.computeWebAccess(principalDocCheck).entitled) {
        return this.unentitledStudioResult(principalDocCheck);
      }
    }
    const existing = await this.store.getJSON(this.keys.event(calId, eventId));
    if (!existing) return result(404, { error: 'Event not found.' });
    if (existing.status === 'cancelled') {
      return result(200, { deleted: true, sequence: existing.sequence ?? 0 });
    }

    const nowIso = new Date().toISOString();
    const cancelledEvent = {
      ...existing,
      status: 'cancelled',
      sequence: Number(existing.sequence ?? 0) + 1,
      updatedAt: nowIso,
      ...(existing.booking
        ? { booking: { ...existing.booking, status: 'cancelled', updatedAt: nowIso } }
        : {}),
    };
    await this.store.putJSON(this.keys.event(calId, eventId), cancelledEvent);

    // 2-Way Sync: remove cancelled event from connected Google / Microsoft calendars!
    await this.mirrorEventToConnectedProviders(calId, cancelledEvent, 'cancel').catch(() => {});
    if (existing.booking?.bookingId) {
      await this.mirrorBookingToGuestCalendars(cancelledEvent, 'cancel').catch(() => {});
    }

    if (existing.booking?.bookingId) {
      const sMs = Date.parse(existing.start);
      const eMs = Date.parse(existing.end);
      if (Number.isFinite(sMs) && Number.isFinite(eMs)) {
        await this.releaseSlotBucketsForEvent(calId, eventId, sMs, eMs);
      }
      await this.syncBookingIndexesAfterChange(calId, cancelledEvent, 'cancelled');

      if (query?.notifyGuest !== '0' && existing.booking.guestEmail) {
        const [principalDoc, meta] = await Promise.all([
          this.store.getJSON(this.keys.principal(principalId)),
          this.store.getJSON(this.keys.meta(calId)),
        ]);
        const ownerEmail = this.verifiedEmailsForPrincipal(principalDoc)[0] ?? null;
        const ownerName = principalDoc?.displayName ?? meta?.name ?? 'Cloud Calendars';
        const singleIcs = buildFeed({
          name: cancelledEvent.title,
          timeZone: existing.booking.guestTimeZone || 'UTC',
          role: 'viewer',
          events: [cancelledEvent],
        });
        await this.email.sendBookingInviteeNotification({
          kind: 'cancelled',
          event: cancelledEvent,
          hostName: ownerName,
          hostEmail: ownerEmail,
          guestName: existing.booking.guestName || 'Guest',
          guestEmail: existing.booking.guestEmail,
          timeZone: existing.booking.guestTimeZone || 'UTC',
          icsContent: singleIcs,
          manageUrl: `${this.SITE_URL}/booking/manage/?t=${encodeURIComponent(existing.booking.manageToken)}`,
          guestPortalUrl: `${this.SITE_URL}/bookings/`,
          reason: typeof query?.reason === 'string' ? query.reason.slice(0, 500) : null,
        });
      }
    }

    await this.core.regenerate(calId, eventId);
    return result(200, { deleted: true, sequence: cancelledEvent.sequence });
  }

  /**
   * Two-way delta & snapshot sync for the personal `Cloud Calendars` (`cal/{calId}/events/`)
   * workspace inside the native iOS app.
   * Applies local iOS upserts, deletions, and calendar metadata updates, then returns
   * the authoritative active events list so Web Studio, RSVP pages (`/event`),
   * guest bookings (`/book`), and the iPhone personal Cloud Calendar stay 1:1 in sync.
   */
  async syncIosPersonalCalendar(principal: any, body: any): Promise<ApiResult> {
    const { calId } = principal;
    if (body?.calendarMeta && typeof body.calendarMeta === 'object') {
      const meta = (await this.store.getJSON(this.keys.meta(calId))) ?? { id: calId };
      let metaChanged = false;
      if (typeof body.calendarMeta.name === 'string' && body.calendarMeta.name.trim()) {
        const trimmed = body.calendarMeta.name.trim().slice(0, 120);
        if (trimmed !== meta.name) {
          meta.name = trimmed;
          metaChanged = true;
        }
      }
      if (body.calendarMeta.color !== undefined) {
        const nextColor = validHexColor(body.calendarMeta.color, meta.defaultColor ?? '#0A84FF');
        if (nextColor !== meta.defaultColor) {
          meta.defaultColor = nextColor;
          metaChanged = true;
        }
      }
      if (isValidTimeZone(body.calendarMeta.timeZone) && body.calendarMeta.timeZone !== meta.timeZone) {
        meta.timeZone = body.calendarMeta.timeZone;
        metaChanged = true;
      }
      if (metaChanged) {
        meta.lastWriteAt = new Date().toISOString();
        await this.store.putJSON(this.keys.meta(calId), meta);
        await this.core.regenerate(calId);
      }
    }

    const upserts = Array.isArray(body?.upserts) ? body.upserts.slice(0, 250) : [];
    const deletions = Array.isArray(body?.deletions) ? body.deletions.slice(0, 250) : [];
    let appliedUpserts = 0;
    let appliedDeletions = 0;
    const conflicts: Array<{ id: string; status: number; error: string }> = [];

    for (const rawEv of upserts) {
      const evId = String(rawEv?.id ?? '').trim();
      if (!evId) continue;
      const sMs = Date.parse(String(rawEv?.start ?? ''));
      let eMs = Date.parse(String(rawEv?.end ?? ''));
      if (Number.isFinite(sMs) && (!Number.isFinite(eMs) || eMs <= sMs)) {
        eMs = sMs + (rawEv?.allDay ? 86_400_000 : 1_800_000);
      }
      const normalizedPayload = {
        ...rawEv,
        start: Number.isFinite(sMs) ? new Date(sMs).toISOString() : rawEv?.start,
        end: Number.isFinite(eMs) ? new Date(eMs).toISOString() : rawEv?.end,
      };
      const res = await this.upsertWebCalendarEvent(principal, evId, normalizedPayload, {
        skipEntitlementCheck: true,
      });
      if (res.status >= 200 && res.status < 300) {
        appliedUpserts += 1;
      } else {
        conflicts.push({
          id: evId,
          status: res.status,
          error: String(res.body?.error ?? 'Sync conflict'),
        });
      }
    }

    for (const rawId of deletions) {
      const evId = String(rawId ?? '').trim();
      if (!evId) continue;
      const res = await this.deleteWebCalendarEvent(
        principal,
        evId,
        {},
        { skipEntitlementCheck: true },
      );
      if (res.status === 200 || res.status === 404) {
        appliedDeletions += 1;
      } else {
        conflicts.push({
          id: evId,
          status: res.status,
          error: String(res.body?.error ?? 'Delete conflict'),
        });
      }
    }

    const [meta, eventKeys] = await Promise.all([
      this.store.getJSON(this.keys.meta(calId)),
      this.store.listKeys(this.keys.events(calId)),
    ]);

    const defaultColor = validHexColor(meta?.defaultColor, '#0A84FF');
    const rawEvents = (await Promise.all(eventKeys.map((k) => this.store.getJSON(k)))).filter(Boolean);
    const events = rawEvents
      .filter((ev) => ev.status !== 'cancelled')
      .map((ev) => ({
        ...ev,
        color: validHexColor(ev.color ?? ev.details?.color, defaultColor),
      }))
      .sort((a, b) => Date.parse(a.start) - Date.parse(b.start));

    return result(200, {
      calendar: {
        id: calId,
        name: meta?.name ?? 'Cloud Calendars',
        color: defaultColor,
        timeZone: meta?.timeZone ?? 'UTC',
        updatedAt: meta?.lastWriteAt ?? null,
      },
      events,
      appliedUpserts,
      appliedDeletions,
      conflicts,
      syncedAt: new Date().toISOString(),
    });
  }

  /**
   * Connects or resyncs an external calendar provider (`google`, `microsoft`, or `ics`).
   * For Google & Microsoft, persists `accessToken` + optional `refreshToken` in `oauth-connections.json`
   * so 2-way read (free/busy conflict detection) + 2-way write (booking create / drag-drop / cancel) work automatically!
   */
  async syncExternalProvider(principal: any, body: any): Promise<ApiResult> {
    const { principalId, calId } = principal;
    const provider = String(body?.provider ?? '').toLowerCase();
    if (body?.disconnect !== true) {
      const principalDoc = await this.store.getJSON(this.keys.principal(principalId));
      if (!this.computeWebAccess(principalDoc).entitled) {
        return this.unentitledStudioResult(principalDoc);
      }
    }
    const now = Date.now();
    const rangeStartMs = now - 7 * 86_400_000;
    const rangeEndMs = now + 90 * 86_400_000;

    const currentBusy = (await this.store.getJSON(this.keys.bookingBusy(calId))) ?? {
      updatedAt: null,
      sources: {},
      events: [],
    };
    const otherEvents = (Array.isArray(currentBusy.events) ? currentBusy.events : [])
      .filter((ev: any) => ev.source !== provider);

    if (body?.disconnect === true) {
      if (provider === 'google' || provider === 'microsoft') {
        await this.disconnectProviderConnection(calId, provider);
      }
      const nextSources = { ...(currentBusy.sources ?? {}) };
      delete nextSources[provider];
      const nextDoc = {
        updatedAt: new Date().toISOString(),
        sources: nextSources,
        events: otherEvents,
      };
      await this.store.putJSON(this.keys.bookingBusy(calId), nextDoc);
      const connDoc = await this.store.getJSON(this.keys.oauthConnections(calId));
      return result(200, { ...nextDoc, connectedProviders: sanitizeConnectionsDoc(connDoc) });
    }

    let imported: Array<{ id: string; title: string; start: string; end: string; allDay: boolean; source: string; color: string }> = [];

    if (provider === 'google' || provider === 'microsoft') {
      const providedAccess = String(body?.accessToken ?? '').trim();
      if (providedAccess) {
        let verifiedEmail: string | null = null;
        let verifiedName: string | null = null;
        try {
          if (provider === 'google') {
            const id = await verifyGoogleIdToken(providedAccess, null);
            verifiedEmail = id.email ?? null;
            verifiedName = id.name ?? null;
          } else {
            const id = await verifyMicrosoftToken(providedAccess);
            verifiedEmail = id.email ?? null;
            verifiedName = id.name ?? null;
          }
        } catch {
          // Proceed to calendar call which will validate token directly
        }
        await this.saveProviderConnectionTokens(calId, provider, {
          accessToken: providedAccess,
          refreshToken: typeof body?.refreshToken === 'string' && body.refreshToken.trim() ? body.refreshToken.trim() : undefined,
          expiresIn: Number(body?.expiresIn) > 0 ? Number(body.expiresIn) : 3500,
          clientId: typeof body?.clientId === 'string' ? body.clientId : undefined,
          tenant: typeof body?.tenant === 'string' ? body.tenant : undefined,
          accountEmail: verifiedEmail,
          accountName: verifiedName,
          autoPushEvents: body?.autoPushEvents !== false,
        });
      }

      try {
        await this.refreshConnectedBusyEventsIfNeeded(calId, { force: true, onlyProvider: provider });
      } catch (err: any) {
        return result(401, { error: err?.message || `${provider} calendar sync failed.` });
      }

      const [updatedBusy, connDoc] = await Promise.all([
        this.store.getJSON(this.keys.bookingBusy(calId)),
        this.store.getJSON(this.keys.oauthConnections(calId)),
      ]);
      return result(200, {
        ...(updatedBusy ?? currentBusy),
        connectedProviders: sanitizeConnectionsDoc(connDoc),
      });
    } else if (provider === 'ics') {
      const safeUrl = safePublicHttpsUrl(body?.icsUrl);
      if (!safeUrl) {
        return result(400, { error: 'Please enter a valid public https:// or webcal:// .ics calendar URL.' });
      }
      let text: string;
      try {
        const res = await fetch(safeUrl, {
          redirect: 'error',
          headers: { Accept: 'text/calendar, text/plain, */*' },
          signal: AbortSignal.timeout(8_000),
        });
        if (!res.ok) return result(400, { error: `Calendar feed returned HTTP ${res.status}.` });
        text = (await res.text()).slice(0, 1_500_000);
      } catch {
        return result(400, { error: 'Could not fetch that .ics feed URL (check that it does not redirect and is publicly reachable).' });
      }
      const parsed = parseExternalIcsEvents(text, rangeStartMs, rangeEndMs);
      imported = parsed.map((ev) => ({
        ...ev,
        source: 'ics',
        color: '#FF9F0A',
      }));
    } else {
      return result(400, { error: "provider must be 'google', 'microsoft', or 'ics'." });
    }

    const nowIso = new Date().toISOString();
    const nextDoc = {
      updatedAt: nowIso,
      sources: {
        ...(currentBusy.sources ?? {}),
        [provider]: {
          syncedAt: nowIso,
          count: imported.length,
          ...(provider === 'ics' ? { icsUrl: String(body.icsUrl).trim().slice(0, 512) } : {}),
        },
      },
      events: [...otherEvents, ...imported].slice(0, 1000),
    };
    await this.store.putJSON(this.keys.bookingBusy(calId), nextDoc);
    return result(200, nextDoc);
  }

  // ── 3. Host Scheduling Configuration & Incoming Bookings ─────────────────

  private defaultBookingConfig(displayName: string, timeZone: string): BookingScheduleConfig {
    return {
      enabled: false,
      disabledByAdmin: false,
      handle: '',
      displayName: displayName || 'Cloud Calendars Host',
      headline: 'Book a time on my calendar',
      bio: 'Pick any open slot below — times automatically adapt to your local timezone.',
      avatarColor: '#0A84FF',
      timeZone: isValidTimeZone(timeZone) ? timeZone : 'UTC',
      slotIntervalMinutes: 15,
      minNoticeMinutes: 60,
      maxAdvanceDays: 60,
      maxBookingsPerDay: 0,
      requireEmailVerification: false,
      weekly: {
        '0': [],
        '1': [{ start: 540, end: 1020 }],
        '2': [{ start: 540, end: 1020 }],
        '3': [{ start: 540, end: 1020 }],
        '4': [{ start: 540, end: 1020 }],
        '5': [{ start: 540, end: 960 }],
        '6': [],
      },
      dateOverrides: {},
      meetingTypes: [
        {
          id: 'mt_15',
          slug: 'quick-15',
          name: '15 Min Quick Intro',
          durationMinutes: 15,
          color: '#38E0F0',
          bufferBeforeMinutes: 0,
          bufferAfterMinutes: 5,
          locationKind: 'google_meet',
          locationValue: 'Google Meet (link shared on confirmation)',
          description: 'Fast introductory check-in or quick question.',
          active: true,
        },
        {
          id: 'mt_30',
          slug: 'meeting-30',
          name: '30 Min Consultation',
          durationMinutes: 30,
          color: '#0A84FF',
          bufferBeforeMinutes: 5,
          bufferAfterMinutes: 5,
          locationKind: 'google_meet',
          locationValue: 'Google Meet / Video Call',
          description: 'Focused 1-on-1 discussion with screen sharing.',
          active: true,
        },
        {
          id: 'mt_60',
          slug: 'deep-dive-60',
          name: '60 Min Strategy Session',
          durationMinutes: 60,
          color: '#BF5AF2',
          bufferBeforeMinutes: 10,
          bufferAfterMinutes: 10,
          locationKind: 'microsoft_teams',
          locationValue: 'Microsoft Teams / Video Call',
          description: 'In-depth working session or full review.',
          active: true,
        },
      ],
    };
  }

  async checkHandleAvailability(principal: any, rawHandle: unknown): Promise<ApiResult> {
    const handle = normalizeHandle(rawHandle);
    if (!handle) {
      return result(200, {
        available: false,
        handle: null,
        reason: 'Use 3–40 lowercase letters, numbers, or hyphens.',
      });
    }
    if (RESERVED_HANDLES.has(handle)) {
      return result(200, {
        available: false,
        handle,
        reason: 'This handle is reserved by Cloud Calendars.',
      });
    }
    const existing = await this.store.getJSON(this.keys.bookingHandle(handle));
    const ownedByCaller = existing && existing.calId === principal?.calId;
    return result(200, {
      available: !existing || ownedByCaller,
      handle,
      ownedByCaller: Boolean(ownedByCaller),
    });
  }

  async getBookingConfig(principal: any): Promise<ApiResult> {
    const { principalId, calId } = principal;
    const [existing, principalDoc, meta] = await Promise.all([
      this.store.getJSON(this.keys.bookingConfig(calId)),
      this.store.getJSON(this.keys.principal(principalId)),
      this.store.getJSON(this.keys.meta(calId)),
    ]);
    const fallback = this.defaultBookingConfig(
      principalDoc?.displayName ?? meta?.name ?? 'Calendar Host',
      meta?.timeZone ?? 'UTC',
    );
    const config: BookingScheduleConfig = existing ? { ...fallback, ...existing } : fallback;
    return result(200, {
      config,
      shareUrl: config.handle ? `${this.SITE_URL}/book/?u=${encodeURIComponent(config.handle)}` : null,
    });
  }

  async saveBookingConfig(principal: any, body: any): Promise<ApiResult> {
    const { principalId, calId } = principal;
    const [current, principalDoc, meta] = await Promise.all([
      this.store.getJSON(this.keys.bookingConfig(calId)),
      this.store.getJSON(this.keys.principal(principalId)),
      this.store.getJSON(this.keys.meta(calId)),
    ]);
    if (!this.computeWebAccess(principalDoc).entitled) {
      return this.unentitledStudioResult(principalDoc);
    }

    const fallback = this.defaultBookingConfig(
      principalDoc?.displayName ?? meta?.name ?? 'Calendar Host',
      meta?.timeZone ?? 'UTC',
    );

    const requestedHandle = normalizeHandle(body?.handle ?? current?.handle);
    if (!requestedHandle) {
      return result(400, { error: 'Please choose a valid public handle (3–40 letters, numbers, or hyphens).' });
    }
    if (RESERVED_HANDLES.has(requestedHandle)) {
      return result(409, { error: 'That handle is reserved. Please pick another handle.' });
    }

    // Claim handle atomically if changed or new
    if (requestedHandle !== current?.handle) {
      const handleKey = this.keys.bookingHandle(requestedHandle);
      const existingOwner = await this.store.getJSON(handleKey);
      if (existingOwner && existingOwner.calId !== calId) {
        return result(409, { error: `Handle "${requestedHandle}" is already taken.` });
      }
      if (!existingOwner) {
        const won = await this.store.putJSONIfAbsent(handleKey, {
          calId,
          principalId,
          createdAt: new Date().toISOString(),
        });
        if (!won) {
          const recheck = await this.store.getJSON(handleKey);
          if (recheck?.calId !== calId) {
            return result(409, { error: `Handle "${requestedHandle}" was just claimed.` });
          }
        }
      }
      if (current?.handle && current.handle !== requestedHandle) {
        const oldRef = await this.store.getJSON(this.keys.bookingHandle(current.handle));
        if (oldRef?.calId === calId) {
          await this.store.del(this.keys.bookingHandle(current.handle));
        }
      }
    }

    const sanitizeWindows = (arr: any): TimeWindow[] => {
      if (!Array.isArray(arr)) return [];
      return arr
        .slice(0, 6)
        .map((w: any) => ({
          start: Math.max(0, Math.min(1440, Math.round(Number(w?.start) || 0))),
          end: Math.max(0, Math.min(1440, Math.round(Number(w?.end) || 0))),
        }))
        .filter((w) => w.end > w.start)
        .sort((a, b) => a.start - b.start);
    };

    const weekly: Record<string, TimeWindow[]> = {};
    for (let d = 0; d <= 6; d += 1) {
      weekly[String(d)] = body?.weekly && Object.prototype.hasOwnProperty.call(body.weekly, String(d))
        ? sanitizeWindows(body.weekly[String(d)])
        : (current?.weekly?.[String(d)] ?? fallback.weekly[String(d)]);
    }

    const dateOverrides: Record<string, TimeWindow[]> = {};
    const rawOverrides = body?.dateOverrides ?? current?.dateOverrides ?? {};
    if (rawOverrides && typeof rawOverrides === 'object') {
      for (const [dateKey, wins] of Object.entries(rawOverrides).slice(0, 90)) {
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
          dateOverrides[dateKey] = sanitizeWindows(wins);
        }
      }
    }

    const rawTypes = Array.isArray(body?.meetingTypes)
      ? body.meetingTypes
      : (current?.meetingTypes ?? fallback.meetingTypes);
    const meetingTypes: MeetingTypeConfig[] = rawTypes.slice(0, 16).map((t: any, idx: number) => {
      const name = String(t?.name ?? `Meeting ${idx + 1}`).trim().slice(0, 100) || `Meeting ${idx + 1}`;
      const id = String(t?.id ?? `mt_${randomId(8)}`).replace(/[^A-Za-z0-9_-]/g, '').slice(0, 48) || `mt_${idx + 1}`;
      const slug = normalizeHandle(t?.slug ?? name) ?? `type-${idx + 1}`;
      const locKinds = ['google_meet', 'microsoft_teams', 'zoom', 'phone', 'in_person', 'custom'] as const;
      const rawKind = t?.locationKind === 'teams' ? 'microsoft_teams' : t?.locationKind;
      const locationKind = locKinds.includes(rawKind) ? rawKind : 'google_meet';
      return {
        id,
        slug,
        name,
        durationMinutes: Math.max(5, Math.min(480, Math.round(Number(t?.durationMinutes) || 30))),
        color: validHexColor(t?.color, '#0A84FF'),
        bufferBeforeMinutes: Math.max(0, Math.min(180, Math.round(Number(t?.bufferBeforeMinutes) || 0))),
        bufferAfterMinutes: Math.max(0, Math.min(180, Math.round(Number(t?.bufferAfterMinutes) || 0))),
        locationKind,
        locationValue: String(t?.locationValue ?? '').trim().slice(0, 500),
        description: String(t?.description ?? '').trim().slice(0, 1000),
        active: t?.active !== false,
      };
    });

    if (!meetingTypes.length) {
      return result(400, { error: 'At least one meeting type is required.' });
    }

    const nowIso = new Date().toISOString();
    const nextConfig: BookingScheduleConfig = {
      enabled: body?.enabled !== undefined ? Boolean(body.enabled) : Boolean(current?.enabled ?? true),
      disabledByAdmin: Boolean(current?.disabledByAdmin ?? false),
      handle: requestedHandle,
      displayName: String(body?.displayName ?? current?.displayName ?? fallback.displayName).trim().slice(0, 120) || 'Host',
      headline: String(body?.headline ?? current?.headline ?? fallback.headline).trim().slice(0, 200),
      bio: String(body?.bio ?? current?.bio ?? fallback.bio).trim().slice(0, 1000),
      avatarColor: validHexColor(body?.avatarColor ?? current?.avatarColor, '#0A84FF'),
      timeZone: isValidTimeZone(body?.timeZone) ? body.timeZone : (current?.timeZone ?? fallback.timeZone),
      slotIntervalMinutes: [10, 15, 20, 30, 60].includes(Number(body?.slotIntervalMinutes))
        ? Number(body.slotIntervalMinutes)
        : (current?.slotIntervalMinutes ?? 15),
      minNoticeMinutes: Math.max(0, Math.min(10080, Math.round(Number(body?.minNoticeMinutes ?? current?.minNoticeMinutes ?? 60)))),
      maxAdvanceDays: Math.max(1, Math.min(365, Math.round(Number(body?.maxAdvanceDays ?? current?.maxAdvanceDays ?? 60)))),
      maxBookingsPerDay: Math.max(0, Math.min(100, Math.round(Number(body?.maxBookingsPerDay ?? current?.maxBookingsPerDay ?? 0)))),
      requireEmailVerification: body?.requireEmailVerification !== undefined
        ? Boolean(body.requireEmailVerification)
        : Boolean(current?.requireEmailVerification ?? false),
      weekly,
      dateOverrides,
      meetingTypes,
      updatedAt: nowIso,
    };

    const emails = this.verifiedEmailsForPrincipal(principalDoc);
    await Promise.all([
      this.store.putJSON(this.keys.bookingConfig(calId), nextConfig),
      this.store.putJSON(this.keys.hostBookingSummary(calId), {
        calId,
        principalId,
        handle: nextConfig.handle,
        displayName: nextConfig.displayName,
        email: emails[0] ?? null,
        enabled: nextConfig.enabled,
        disabledByAdmin: Boolean(nextConfig.disabledByAdmin),
        meetingTypeCount: nextConfig.meetingTypes.filter((m) => m.active).length,
        timeZone: nextConfig.timeZone,
        updatedAt: nowIso,
      }),
    ]);

    return result(200, {
      config: nextConfig,
      shareUrl: `${this.SITE_URL}/book/?u=${encodeURIComponent(nextConfig.handle)}`,
    });
  }

  async listHostBookings(principal: any): Promise<ApiResult> {
    const { calId } = principal;
    const eventKeys = await this.store.listKeys(this.keys.events(calId));
    const events = (await Promise.all(eventKeys.map((k) => this.store.getJSON(k)))).filter(Boolean);
    const bookings = events
      .filter((ev) => ev.booking?.bookingId)
      .map((ev) => ({
        eventId: ev.id,
        bookingId: ev.booking.bookingId,
        title: ev.title,
        start: ev.start,
        end: ev.end,
        status: ev.status,
        color: validHexColor(ev.color ?? ev.details?.color, '#0A84FF'),
        location: ev.location ?? null,
        videoCallURL: ev.details?.videoCallURL ?? null,
        meetingTypeId: ev.booking.meetingTypeId,
        meetingTypeName: ev.booking.meetingTypeName,
        guestName: ev.booking.guestName,
        guestEmail: ev.booking.guestEmail,
        guestTimeZone: ev.booking.guestTimeZone,
        guestNotes: ev.booking.guestNotes ?? null,
        createdAt: ev.booking.createdAt ?? ev.updatedAt,
        updatedAt: ev.updatedAt,
      }))
      .sort((a, b) => Date.parse(a.start) - Date.parse(b.start));

    return result(200, { bookings });
  }

  async hostRescheduleBooking(principal: any, eventId: string, body: any): Promise<ApiResult> {
    const { calId } = principal;
    const existing = await this.store.getJSON(this.keys.event(calId, eventId));
    if (!existing || !existing.booking?.bookingId) {
      return result(404, { error: 'Booking not found.' });
    }
    const startMs = Date.parse(String(body?.start ?? ''));
    const oldDurationMs = Math.max(900_000, Date.parse(existing.end) - Date.parse(existing.start));
    const endMs = body?.end && Number.isFinite(Date.parse(body.end))
      ? Date.parse(body.end)
      : startMs + oldDurationMs;
    if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs <= startMs) {
      return result(400, { error: 'Valid new start timestamp is required.' });
    }

    return this.upsertWebCalendarEvent(principal, eventId, {
      start: new Date(startMs).toISOString(),
      end: new Date(endMs).toISOString(),
      reason: body?.reason,
      notifyGuest: body?.notifyGuest !== false,
    });
  }

  async hostCancelBooking(principal: any, eventId: string, body: any): Promise<ApiResult> {
    return this.deleteWebCalendarEvent(principal, eventId, {
      reason: body?.reason ?? '',
      notifyGuest: body?.notifyGuest === false ? '0' : '1',
    });
  }

  // ── 3B. Expiring Public Booking Invite Links (`inv_<token>`) ─────────────

  private decorateInviteLink(rec: any) {
    const now = Date.now();
    const expMs = Date.parse(String(rec?.expiresAt ?? ''));
    const expired = Number.isFinite(expMs) && now > expMs;
    const exhausted = Number(rec?.maxUses ?? 0) > 0 && Number(rec?.usedCount ?? 0) >= Number(rec.maxUses);
    const state: 'active' | 'expired' | 'exhausted' | 'revoked' = rec?.revoked
      ? 'revoked'
      : expired
        ? 'expired'
        : exhausted
          ? 'exhausted'
          : 'active';
    return {
      token: rec.token,
      label: rec.label || 'Expiring Booking Invite',
      meetingTypeId: rec.meetingTypeId ?? null,
      expiresAt: rec.expiresAt,
      maxUses: Number(rec.maxUses ?? 0),
      usedCount: Number(rec.usedCount ?? 0),
      requireEmailConfirmIfUnauthenticated: rec.requireEmailConfirmIfUnauthenticated !== false,
      revoked: Boolean(rec.revoked),
      state,
      createdAt: rec.createdAt,
      lastUsedAt: rec.lastUsedAt ?? null,
      shareUrl: `${this.SITE_URL}/book/?i=${encodeURIComponent(rec.token)}`,
    };
  }

  async listBookingInviteLinks(principal: any): Promise<ApiResult> {
    const { calId } = principal;
    const keys = await this.store.listKeys(this.keys.hostBookingInvitesPrefix(calId));
    const docs = (await Promise.all(keys.map((k) => this.store.getJSON(k)))).filter(Boolean);
    const links = docs
      .map((d) => this.decorateInviteLink(d))
      .sort((a, b) => String(b.createdAt ?? '').localeCompare(String(a.createdAt ?? '')));
    return result(200, { links });
  }

  async createBookingInviteLink(principal: any, body: any): Promise<ApiResult> {
    const { principalId, calId } = principal;
    const [existingCfg, principalDoc, meta] = await Promise.all([
      this.store.getJSON(this.keys.bookingConfig(calId)),
      this.store.getJSON(this.keys.principal(principalId)),
      this.store.getJSON(this.keys.meta(calId)),
    ]);
    if (!this.computeWebAccess(principalDoc).entitled) {
      return this.unentitledStudioResult(principalDoc);
    }

    if (!existingCfg) {
      const seedCfg = this.defaultBookingConfig(
        principalDoc?.displayName ?? meta?.name ?? 'Calendar Host',
        meta?.timeZone ?? 'UTC',
      );
      await this.store.putJSON(this.keys.bookingConfig(calId), seedCfg);
    }

    const rawHours = Number(body?.expiresInHours);
    const clampedHours = Number.isFinite(rawHours) && rawHours > 0
      ? Math.min(24 * 365, Math.max(1, rawHours))
      : 168; // default 7 days
    const customExpMs = body?.expiresAt ? Date.parse(String(body.expiresAt)) : NaN;
    const expiresAtMs = Number.isFinite(customExpMs) && customExpMs > Date.now() + 60_000
      ? customExpMs
      : Date.now() + clampedHours * 3600_000;

    const maxUses = Math.max(0, Math.min(1000, Math.floor(Number(body?.maxUses ?? 1) || 0)));
    const label = String(body?.label ?? '').trim().slice(0, 120) || 'Booking Invite';
    const meetingTypeId =
      typeof body?.meetingTypeId === 'string' && body.meetingTypeId.trim()
        ? body.meetingTypeId.trim().slice(0, 48)
        : null;

    const token = `inv_${randomId(22)}`;
    const nowIso = new Date().toISOString();
    const record = {
      token,
      calId,
      principalId,
      label,
      meetingTypeId,
      expiresAt: new Date(expiresAtMs).toISOString(),
      maxUses,
      usedCount: 0,
      requireEmailConfirmIfUnauthenticated: body?.requireEmailConfirmIfUnauthenticated !== false,
      revoked: false,
      createdAt: nowIso,
      lastUsedAt: null,
    };

    await Promise.all([
      this.store.putJSON(this.keys.bookingInvite(token), record),
      this.store.putJSON(this.keys.hostBookingInvite(calId, token), record),
    ]);

    return result(201, { link: this.decorateInviteLink(record) });
  }

  async revokeBookingInviteLink(principal: any, rawToken: string): Promise<ApiResult> {
    const { calId } = principal;
    const token = String(rawToken ?? '').trim();
    if (!/^inv_[A-Za-z0-9_-]{10,64}$/.test(token)) {
      return result(400, { error: 'Invalid invite token.' });
    }
    const existing = await this.store.getJSON(this.keys.hostBookingInvite(calId, token));
    if (!existing || existing.calId !== calId) {
      return result(404, { error: 'Invite link not found.' });
    }
    const next = { ...existing, revoked: true, revokedAt: new Date().toISOString() };
    await Promise.all([
      this.store.putJSON(this.keys.bookingInvite(token), next),
      this.store.putJSON(this.keys.hostBookingInvite(calId, token), next),
    ]);
    return result(200, { link: this.decorateInviteLink(next) });
  }

  // ── 4. Public Booking Page, Live Slot Engine & Verification ──────────────

  private demoConfig(): BookingScheduleConfig {
    const cfg = this.defaultBookingConfig('Cloud Calendars Studio', 'Europe/Sofia');
    cfg.enabled = true;
    cfg.handle = 'demo';
    cfg.headline = 'Interactive Live Booking Demo · Cloud Calendars';
    cfg.bio = 'Try picking a meeting type, timezone, and slot — experience how guests book on your Cloud Calendars page and receive instant .ics & calendar sync.';
    return cfg;
  }

  private publicHostPayload(cfg: BookingScheduleConfig) {
    return {
      handle: cfg.handle,
      displayName: cfg.displayName,
      headline: cfg.headline,
      bio: cfg.bio,
      avatarColor: cfg.avatarColor,
      timeZone: cfg.timeZone,
      slotIntervalMinutes: cfg.slotIntervalMinutes,
      maxAdvanceDays: cfg.maxAdvanceDays,
      requireEmailVerification: Boolean(cfg.requireEmailVerification),
      isDemo: cfg.handle === 'demo',
      meetingTypes: cfg.meetingTypes
        .filter((m) => m.active)
        .map((m) => ({
          id: m.id,
          slug: m.slug,
          name: m.name,
          durationMinutes: m.durationMinutes,
          color: m.color,
          locationKind: m.locationKind,
          locationValue: m.locationValue,
          description: m.description,
        })),
    };
  }

  private async loadActiveHostByHandle(rawHandle: unknown): Promise<{
    ok: boolean;
    isDemo?: boolean;
    calId?: string | null;
    principalId?: string | null;
    config?: BookingScheduleConfig;
    inviteLink?: any | null;
    res?: ApiResult;
  }> {
    const rawTrimmed = String(rawHandle ?? '').trim();
    // Support Expiring Invite Links (`inv_<token>`) seamlessly across all `/book/:handle` endpoints!
    if (/^inv_[A-Za-z0-9_-]{10,64}$/.test(rawTrimmed)) {
      const link = await this.store.getJSON(this.keys.bookingInvite(rawTrimmed));
      if (!link?.calId) {
        return {
          ok: false,
          res: result(404, { code: 'invite_not_found', error: 'This booking invite link was not found.' }),
        };
      }
      if (link.revoked) {
        return {
          ok: false,
          res: result(410, {
            code: 'invite_expired',
            reason: 'revoked',
            error: 'This booking invite link has been deactivated by the calendar owner.',
          }),
        };
      }
      const expMs = Date.parse(String(link.expiresAt ?? ''));
      if (Number.isFinite(expMs) && Date.now() > expMs) {
        return {
          ok: false,
          res: result(410, {
            code: 'invite_expired',
            reason: 'expired',
            expiresAt: link.expiresAt,
            error: 'This booking invite link has expired.',
          }),
        };
      }
      const maxUses = Number(link.maxUses ?? 0);
      const usedCount = Number(link.usedCount ?? 0);
      if (maxUses > 0 && usedCount >= maxUses) {
        return {
          ok: false,
          res: result(410, {
            code: 'invite_expired',
            reason: 'exhausted',
            error: 'This booking invite link has already been used.',
          }),
        };
      }

      const [storedCfg, principalDoc, meta] = await Promise.all([
        this.store.getJSON(this.keys.bookingConfig(link.calId)),
        this.store.getJSON(this.keys.principal(link.principalId)),
        this.store.getJSON(this.keys.meta(link.calId)),
      ]);
      const fallback = this.defaultBookingConfig(
        principalDoc?.displayName ?? meta?.name ?? 'Calendar Host',
        meta?.timeZone ?? 'UTC',
      );
      const baseCfg: BookingScheduleConfig = storedCfg ? { ...fallback, ...storedCfg } : fallback;
      if (baseCfg.disabledByAdmin) {
        return { ok: false, res: result(404, { error: 'This booking page is currently unavailable.' }) };
      }

      const filteredTypes = link.meetingTypeId
        ? baseCfg.meetingTypes.filter((m) => m.active && m.id === link.meetingTypeId)
        : baseCfg.meetingTypes.filter((m) => m.active);
      const effectiveCfg: BookingScheduleConfig = {
        ...baseCfg,
        enabled: true,
        handle: baseCfg.handle || rawTrimmed,
        requireEmailVerification: link.requireEmailConfirmIfUnauthenticated !== false,
        meetingTypes: filteredTypes.length ? filteredTypes : baseCfg.meetingTypes,
      };
      return {
        ok: true,
        isDemo: false,
        calId: link.calId,
        principalId: link.principalId,
        config: effectiveCfg,
        inviteLink: link,
      };
    }

    const cleaned = rawTrimmed.toLowerCase();
    if (cleaned === 'demo') {
      return { ok: true, isDemo: true, calId: null, principalId: null, config: this.demoConfig() };
    }
    const handle = normalizeHandle(cleaned);
    if (!handle) {
      return { ok: false, res: result(404, { error: 'Booking page not found.' }) };
    }
    const ref = await this.store.getJSON(this.keys.bookingHandle(handle));
    if (!ref?.calId) {
      return { ok: false, res: result(404, { error: 'Booking page not found.' }) };
    }
    const cfg: BookingScheduleConfig | null = await this.store.getJSON(this.keys.bookingConfig(ref.calId));
    if (!cfg || !cfg.enabled || cfg.disabledByAdmin) {
      return { ok: false, res: result(404, { error: 'This booking page is currently unavailable.' }) };
    }
    return { ok: true, isDemo: false, calId: ref.calId, principalId: ref.principalId, config: cfg, inviteLink: null };
  }

  async getPublicBookingPage(rawHandle: string): Promise<ApiResult> {
    const resolved = await this.loadActiveHostByHandle(rawHandle);
    if (!resolved.ok) return resolved.res!;
    const payload: any = this.publicHostPayload(resolved.config!);
    if (resolved.inviteLink) {
      const link = resolved.inviteLink;
      const maxUses = Number(link.maxUses ?? 0);
      const usedCount = Number(link.usedCount ?? 0);
      payload.handle = link.token;
      payload.inviteLink = {
        token: link.token,
        label: link.label || 'Booking Invite',
        expiresAt: link.expiresAt,
        maxUses,
        usedCount,
        remainingUses: maxUses > 0 ? Math.max(0, maxUses - usedCount) : null,
      };
    }
    return result(200, payload);
  }

  private async loadHostBusyAndDayCounts(
    calId: string,
    hostTz: string,
    rangeStartMs: number,
    rangeEndMs: number,
    excludeEventId?: string | null,
  ): Promise<{ busyIntervals: BusyInterval[]; bookedCountByHostDay: Record<string, number> }> {
    // Keep external Google / Microsoft busy blocks fresh before computing open booking slots!
    await this.refreshConnectedBusyEventsIfNeeded(calId).catch(() => {});

    const [eventKeys, busyDoc] = await Promise.all([
      this.store.listKeys(this.keys.events(calId)),
      this.store.getJSON(this.keys.bookingBusy(calId)),
    ]);
    const events = (await Promise.all(eventKeys.map((k) => this.store.getJSON(k)))).filter(Boolean);
    const busyIntervals: BusyInterval[] = [];
    const bookedCountByHostDay: Record<string, number> = {};

    for (const ev of events) {
      if (excludeEventId && ev.id === excludeEventId) continue;
      if (ev.status === 'cancelled') continue;
      busyIntervals.push(...expandEventBusyIntervals(ev, rangeStartMs, rangeEndMs));
      if (ev.booking?.bookingId) {
        const s = Date.parse(ev.start);
        if (Number.isFinite(s)) {
          const dayKey = localPartsInZone(s, hostTz).dateStr;
          bookedCountByHostDay[dayKey] = (bookedCountByHostDay[dayKey] ?? 0) + 1;
        }
      }
    }

    for (const ext of busyDoc?.events ?? []) {
      const s = Date.parse(ext.start);
      const e = Date.parse(ext.end);
      if (Number.isFinite(s) && Number.isFinite(e) && e > s && e > rangeStartMs && s < rangeEndMs) {
        busyIntervals.push({ startMs: s, endMs: e });
      }
    }

    return { busyIntervals, bookedCountByHostDay };
  }

  async getPublicBookingSlots(rawHandle: string, query: any): Promise<ApiResult> {
    const resolved = await this.loadActiveHostByHandle(rawHandle);
    if (!resolved.ok) return resolved.res!;
    const config = resolved.config!;
    const calId = resolved.calId ?? null;
    const isDemo = Boolean(resolved.isDemo);

    const activeTypes = config.meetingTypes.filter((m) => m.active);
    const typeQuery = String(query?.type ?? '').trim();
    const meetingType = activeTypes.find((m) => m.id === typeQuery || m.slug === typeQuery) ?? activeTypes[0];
    if (!meetingType) {
      return result(404, { error: 'No active meeting types available.' });
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    const defaultToStr = new Date(Date.now() + 21 * 86_400_000).toISOString().slice(0, 10);
    const fromDate = /^\d{4}-\d{2}-\d{2}$/.test(String(query?.from ?? '')) ? String(query.from) : todayStr;
    const toDate = /^\d{4}-\d{2}-\d{2}$/.test(String(query?.to ?? '')) ? String(query.to) : defaultToStr;

    const rangeStartMs = Date.parse(`${fromDate}T00:00:00Z`) - 2 * 86_400_000;
    const rangeEndMs = Date.parse(`${toDate}T23:59:59Z`) + 2 * 86_400_000;

    let busyIntervals: BusyInterval[] = [];
    let bookedCountByHostDay: Record<string, number> = {};
    if (!isDemo && calId) {
      ({ busyIntervals, bookedCountByHostDay } = await this.loadHostBusyAndDayCounts(
        calId,
        config.timeZone,
        rangeStartMs,
        rangeEndMs,
        typeof query?.excludeEventId === 'string' ? query.excludeEventId : null,
      ));
    }

    const slots = computeAvailableSlots({
      config,
      meetingType,
      fromDate,
      toDate,
      busyIntervals,
      bookedCountByHostDay,
    });

    return result(200, {
      handle: config.handle,
      meetingTypeId: meetingType.id,
      durationMinutes: meetingType.durationMinutes,
      hostTimeZone: config.timeZone,
      slots: slots.map((s) => ({ start: s.start, end: s.end })),
    });
  }

  async requestBookingVerificationCode(rawHandle: string, body: any): Promise<ApiResult> {
    const resolved = await this.loadActiveHostByHandle(rawHandle);
    if (!resolved.ok) return resolved.res!;
    const hostCfg = resolved.config!;

    const email = normalizeEmail(body?.email);
    if (!email) return result(400, { error: 'Please enter a valid email address.' });

    const emailHash = this.core.emailHash(email);
    const otpKey = this.keys.bookingOtp(hostCfg.handle, emailHash);
    const existing = await this.store.getJSON(otpKey);
    if (existing?.sentAt && Date.now() - Number(existing.sentAt) < 25_000) {
      return result(429, { error: 'Please wait 25 seconds before requesting another code.' });
    }

    const code = String(randomInt(100_000, 1_000_000));
    const now = Date.now();
    await this.store.putJSON(otpKey, {
      codeHash: hashOtp(email, code),
      sentAt: now,
      expiresAt: now + 10 * 60_000,
      attempts: 0,
    });

    await this.email.sendVerificationCodeEmail({
      email,
      code,
      purpose: 'booking',
      hostName: hostCfg.displayName,
    });

    return result(200, { sent: true, expiresInSeconds: 600 });
  }

  async createPublicBooking(authHeader: string, rawHandle: string, body: any): Promise<ApiResult> {
    const resolved = await this.loadActiveHostByHandle(rawHandle);
    if (!resolved.ok) return resolved.res!;
    const config = resolved.config!;
    const calId = resolved.calId ?? null;
    const principalId = resolved.principalId ?? null;
    const isDemo = Boolean(resolved.isDemo);

    const guestName = String(body?.name ?? '').trim().slice(0, 120);
    const guestEmail = normalizeEmail(body?.email);
    if (!guestName || !guestEmail) {
      return result(400, { error: 'Your name and a valid email address are required.' });
    }

    const activeTypes = config.meetingTypes.filter((m) => m.active);
    const typeQuery = String(body?.typeId ?? body?.type ?? '').trim();
    const meetingType = activeTypes.find((m) => m.id === typeQuery || m.slug === typeQuery) ?? activeTypes[0];
    if (!meetingType) return result(404, { error: 'Meeting type is no longer available.' });

    const startMs = Date.parse(String(body?.start ?? ''));
    if (!Number.isFinite(startMs)) {
      return result(400, { error: 'Please select a valid start time.' });
    }
    const endMs = startMs + meetingType.durationMinutes * 60_000;
    const guestTimeZone = isValidTimeZone(body?.timeZone) ? body.timeZone : config.timeZone;
    const guestNotes = body?.notes ? String(body.notes).trim().slice(0, 2000) : null;

    // Interactive Demo Mode: returns instant realistic preview + downloadable .ics without writing to real calendars
    if (isDemo || !calId || !principalId) {
      const demoEvent = {
        id: `demo_${randomId(10)}`,
        sequence: 0,
        title: `${meetingType.name} — ${guestName} & ${config.displayName}`,
        start: new Date(startMs).toISOString(),
        end: new Date(endMs).toISOString(),
        allDay: false,
        location: meetingType.locationValue || 'Google Meet',
        color: meetingType.color,
        status: 'confirmed',
        details: {
          notes: guestNotes,
          timeZone: guestTimeZone,
          color: meetingType.color,
          availability: 0,
          alarms: [{ relativeOffset: -900, absoluteDate: null }],
        },
      };
      const ics = buildFeed({
        name: demoEvent.title,
        timeZone: guestTimeZone,
        role: 'viewer',
        events: [demoEvent],
      });
      return result(201, {
        isDemo: true,
        bookingId: demoEvent.id,
        event: demoEvent,
        hostName: config.displayName,
        host: {
          displayName: config.displayName,
          handle: config.handle,
          timeZone: config.timeZone,
        },
        guestPortalUrl: `${this.SITE_URL}/bookings/`,
        feedUrl: null,
        webcalUrl: null,
        icsContent: ics,
        manageToken: null,
        manageUrl: null,
      });
    }

    // Check email verification if host enabled `requireEmailVerification`
    if (config.requireEmailVerification) {
      let alreadyVerifiedViaSession = false;
      const rawBearer = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
      if (rawBearer) {
        const caller = await this.core.resolveToken(rawBearer);
        if (caller?.principalId) {
          const callerDoc = await this.store.getJSON(this.keys.principal(caller.principalId));
          if (this.verifiedEmailsForPrincipal(callerDoc).includes(guestEmail)) {
            alreadyVerifiedViaSession = true;
          }
        }
      }

      if (!alreadyVerifiedViaSession) {
        const code = String(body?.verificationCode ?? '').trim();
        if (!/^\d{6}$/.test(code)) {
          return result(401, {
            code: 'verification_required',
            error: 'Please enter the 6-digit verification code sent to your email.',
          });
        }
        const otpKey = this.keys.bookingOtp(config.handle, this.core.emailHash(guestEmail));
        const otp = await this.store.getJSON(otpKey);
        if (!otp || Number(otp.expiresAt) < Date.now()) {
          return result(401, { code: 'verification_expired', error: 'Verification code expired. Request a new code.' });
        }
        if (otp.codeHash !== hashOtp(guestEmail, code)) {
          return result(401, { code: 'verification_invalid', error: 'Incorrect verification code.' });
        }
        await this.store.del(otpKey);
      }
    }

    // Re-verify slot is genuinely available in the host's live schedule
    const slotDay = new Date(startMs).toISOString().slice(0, 10);
    const { busyIntervals, bookedCountByHostDay } = await this.loadHostBusyAndDayCounts(
      calId,
      config.timeZone,
      startMs - 86_400_000,
      endMs + 86_400_000,
    );
    const validSlots = computeAvailableSlots({
      config,
      meetingType,
      fromDate: slotDay,
      toDate: slotDay,
      busyIntervals,
      bookedCountByHostDay,
    });
    if (!validSlots.some((s) => Date.parse(s.start) === startMs)) {
      return result(409, { error: 'That time slot is no longer available. Please pick another time.' });
    }

    const eventId = `bk_${randomId(14)}`;
    const bookingId = `b_${randomId(14)}`;
    const manageToken = randomId(28);
    const inviteeFeedId = randomId(22);

    // Atomically lock 5-minute buckets covering [startMs, endMs)
    const lockRes = await this.claimSlotBucketsForEvent(calId, eventId, startMs, endMs);
    if (!lockRes.ok) {
      return result(409, { error: 'Someone else just booked that slot. Please choose another time.' });
    }

    // If booked through an Expiring Invite Link, atomically record usage (and enforce `maxUses`!)
    if (resolved.inviteLink?.token) {
      const freshLink = await this.store.getJSON(this.keys.bookingInvite(resolved.inviteLink.token));
      const maxUses = Number(freshLink?.maxUses ?? 0);
      const usedCount = Number(freshLink?.usedCount ?? 0);
      if (!freshLink || freshLink.revoked || (maxUses > 0 && usedCount >= maxUses)) {
        await this.releaseSlotBucketsForEvent(calId, eventId, startMs, endMs).catch(() => {});
        return result(410, {
          code: 'invite_expired',
          error: 'This booking invite link has just been used or expired.',
        });
      }
      const nextLink = {
        ...freshLink,
        usedCount: usedCount + 1,
        lastUsedAt: new Date().toISOString(),
      };
      await Promise.all([
        this.store.putJSON(this.keys.bookingInvite(freshLink.token), nextLink),
        this.store.putJSON(this.keys.hostBookingInvite(calId, freshLink.token), nextLink),
      ]);
    }

    const [hostPrincipalDoc, meta] = await Promise.all([
      this.store.getJSON(this.keys.principal(principalId)),
      this.store.getJSON(this.keys.meta(calId)),
    ]);
    const hostEmail = this.verifiedEmailsForPrincipal(hostPrincipalDoc)[0] ?? null;
    const hostName = config.displayName || hostPrincipalDoc?.displayName || meta?.name || 'Host';

    const locationLabel = meetingType.locationValue || {
      google_meet: 'Google Meet',
      microsoft_teams: 'Microsoft Teams',
      zoom: 'Zoom Video Call',
      phone: 'Phone Call',
      in_person: 'In Person',
      custom: 'Online Meeting',
    }[meetingType.locationKind];
    const videoCallURL = /^https?:\/\//i.test(meetingType.locationValue) ? meetingType.locationValue : null;

    const nowIso = new Date().toISOString();
    const eventDoc = {
      id: eventId,
      sequence: 0,
      title: `${meetingType.name}: ${guestName} & ${hostName}`,
      start: new Date(startMs).toISOString(),
      end: new Date(endMs).toISOString(),
      allDay: false,
      location: locationLabel,
      url: null,
      color: meetingType.color,
      description: guestNotes,
      organizerName: hostName,
      organizerEmail: hostEmail,
      status: 'confirmed',
      ownerId: principalId,
      createdBy: 'booking',
      updatedAt: nowIso,
      details: {
        notes: guestNotes
          ? `Booked via Cloud Calendars (${meetingType.name})\nGuest: ${guestName} <${guestEmail}>\n\nNotes:\n${guestNotes}`
          : `Booked via Cloud Calendars (${meetingType.name})\nGuest: ${guestName} <${guestEmail}>`,
        timeZone: config.timeZone,
        color: meetingType.color,
        availability: 0,
        alarms: [{ relativeOffset: -900, absoluteDate: null }],
        recurrenceRules: [],
        structuredLocation: null,
        videoCallURL,
        travelTime: null,
        attachments: [],
        organizer: hostEmail ? {
          name: hostName,
          email: hostEmail,
          role: 3,
          type: 1,
          status: 2,
          isCurrentUser: true,
        } : null,
        attendees: [
          {
            name: guestName,
            email: guestEmail,
            role: 1,
            type: 1,
            status: 2,
            isCurrentUser: false,
          },
        ],
      },
      booking: {
        bookingId,
        manageToken,
        feedId: inviteeFeedId,
        hostHandle: config.handle,
        hostName,
        meetingTypeId: meetingType.id,
        meetingTypeName: meetingType.name,
        durationMinutes: meetingType.durationMinutes,
        guestName,
        guestEmail,
        guestTimeZone,
        guestNotes,
        status: 'confirmed',
        rescheduledCount: 0,
        createdAt: nowIso,
        updatedAt: nowIso,
      },
    };

    // Add scoped per-event feed in acl.json using optimistic CAS so concurrent bookings never clobber acl.json!
    await this.addScopedFeedToAclCas(calId, inviteeFeedId, {
      role: 'viewer',
      label: `booking:${bookingId}`,
      feedName: eventDoc.title,
      scope: { eventId },
      createdAt: nowIso,
    });

    const guestEmailHash = this.core.emailHash(guestEmail);
    const manageUrl = `${this.SITE_URL}/booking/manage/?t=${encodeURIComponent(manageToken)}`;
    const feedUrl = this.core.feedUrl(inviteeFeedId);
    const webcalUrl = feedUrl.replace(/^https?:\/\//, 'webcal://');

    const indexRecord = {
      bookingId,
      manageToken,
      calId,
      eventId,
      feedId: inviteeFeedId,
      hostHandle: config.handle,
      hostName,
      hostEmail,
      meetingTypeId: meetingType.id,
      meetingTypeName: meetingType.name,
      durationMinutes: meetingType.durationMinutes,
      color: meetingType.color,
      title: eventDoc.title,
      location: locationLabel,
      videoCallURL,
      start: eventDoc.start,
      end: eventDoc.end,
      guestName,
      guestEmail,
      guestTimeZone,
      guestNotes,
      status: 'confirmed',
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    // 2-Way Sync BEFORE sending emails: push booked appointment to Host's connected Google / Microsoft calendars!
    // If Google Meet or Microsoft Teams auto-creates a live conference URL, attach it onto `eventDoc` & `indexRecord`!
    const hostMirror = await this.mirrorEventToConnectedProviders(calId, eventDoc, 'upsert', {
      generateGoogleMeet: meetingType.locationKind === 'google_meet',
      generateTeamsMeeting: meetingType.locationKind === 'microsoft_teams',
    }).catch(() => ({ autoVideoUrl: null as string | null, syncedProviders: [] as string[] }));

    const finalVideoCallURL = hostMirror.autoVideoUrl || videoCallURL;
    if (finalVideoCallURL && !eventDoc.details.videoCallURL) {
      eventDoc.details.videoCallURL = finalVideoCallURL;
      if (!/^https?:\/\//i.test(eventDoc.location || '')) {
        eventDoc.location = `${locationLabel} (${finalVideoCallURL})`;
      }
      indexRecord.videoCallURL = finalVideoCallURL;
      indexRecord.location = eventDoc.location;
    }

    // Also link & sync directly to the Guest's own CloudCalendars + Google/Microsoft calendars if the Guest has an account!
    await this.autoLinkAndMirrorBookingToGuest(authHeader, guestEmail, calId, eventDoc, inviteeFeedId).catch(() => {});

    await Promise.all([
      this.store.putJSON(this.keys.event(calId, eventId), eventDoc),
      this.store.putJSON(this.keys.feedIndex(inviteeFeedId), { calId, role: 'viewer', eventId }),
      this.store.putJSON(this.keys.manage(manageToken), indexRecord),
      this.store.putJSON(this.keys.guestBooking(guestEmailHash, bookingId), indexRecord),
      this.store.putJSON(this.keys.allBookingRecord(bookingId), indexRecord),
    ]);

    await this.core.regenerate(calId, eventId);

    const singleIcs = buildFeed({
      name: eventDoc.title,
      timeZone: guestTimeZone,
      role: 'viewer',
      events: [eventDoc],
    });

    await Promise.all([
      this.email.sendBookingInviteeNotification({
        kind: 'confirmed',
        event: eventDoc,
        hostName,
        hostEmail,
        guestName,
        guestEmail,
        timeZone: guestTimeZone,
        webcalUrl,
        icsContent: singleIcs,
        manageUrl,
        guestPortalUrl: `${this.SITE_URL}/bookings/`,
        videoCallURL: finalVideoCallURL,
      }),
      hostEmail
        ? this.email.sendBookingHostNotification({
            kind: 'confirmed',
            event: eventDoc,
            hostEmail,
            guestName,
            guestEmail,
            guestNotes,
            timeZone: config.timeZone,
            studioUrl: `${this.SITE_URL}/calendar/`,
          })
        : Promise.resolve(),
    ]);

    return result(201, {
      isDemo: false,
      bookingId,
      manageToken,
      manageUrl,
      guestPortalUrl: `${this.SITE_URL}/bookings/`,
      feedUrl,
      webcalUrl,
      icsContent: singleIcs,
      hostName,
      host: {
        displayName: hostName,
        handle: config.handle,
        timeZone: config.timeZone,
      },
      event: eventDoc,
    });
  }

  // ── 5. Guest Self-Service (Token Manage + Authenticated Guest Portal) ─────

  async getManageBooking(token: string): Promise<ApiResult> {
    if (!token || !/^[A-Za-z0-9_-]{12,64}$/.test(token)) {
      return result(404, { error: 'Booking link not found.' });
    }
    const rec = await this.store.getJSON(this.keys.manage(token));
    if (!rec?.calId || !rec?.eventId) {
      return result(404, { error: 'Booking link not found.' });
    }
    const [ev, cfg] = await Promise.all([
      this.store.getJSON(this.keys.event(rec.calId, rec.eventId)),
      this.store.getJSON(this.keys.bookingConfig(rec.calId)),
    ]);
    if (!ev) return result(404, { error: 'Booking no longer exists.' });

    const feedUrl = rec.feedId ? this.core.feedUrl(rec.feedId) : null;
    const singleIcs = buildFeed({
      name: ev.title,
      timeZone: rec.guestTimeZone || 'UTC',
      role: 'viewer',
      events: [ev],
    });

    return result(200, {
      booking: {
        bookingId: rec.bookingId,
        manageToken: token,
        eventId: ev.id,
        title: ev.title,
        start: ev.start,
        end: ev.end,
        status: ev.status,
        color: validHexColor(ev.color ?? ev.details?.color, '#0A84FF'),
        location: ev.location ?? null,
        videoCallURL: ev.details?.videoCallURL ?? null,
        hostName: cfg?.displayName ?? rec.hostName,
        hostHandle: cfg?.handle ?? rec.hostHandle,
        hostTimeZone: cfg?.timeZone ?? 'UTC',
        meetingTypeId: rec.meetingTypeId,
        meetingTypeName: rec.meetingTypeName,
        durationMinutes: rec.durationMinutes ?? Math.round((Date.parse(ev.end) - Date.parse(ev.start)) / 60_000),
        guestName: rec.guestName,
        guestEmail: rec.guestEmail,
        guestTimeZone: rec.guestTimeZone ?? 'UTC',
        guestNotes: rec.guestNotes ?? null,
        feedUrl,
        webcalUrl: feedUrl ? feedUrl.replace(/^https?:\/\//, 'webcal://') : null,
        icsContent: singleIcs,
      },
    });
  }

  async guestRescheduleByToken(token: string, body: any): Promise<ApiResult> {
    if (!token || !/^[A-Za-z0-9_-]{12,64}$/.test(token)) {
      return result(404, { error: 'Booking link not found.' });
    }
    const rec = await this.store.getJSON(this.keys.manage(token));
    if (!rec?.calId || !rec?.eventId) return result(404, { error: 'Booking not found.' });

    const [existing, cfg, meta] = await Promise.all([
      this.store.getJSON(this.keys.event(rec.calId, rec.eventId)),
      this.store.getJSON(this.keys.bookingConfig(rec.calId)),
      this.store.getJSON(this.keys.meta(rec.calId)),
    ]);
    if (!existing || existing.status === 'cancelled') {
      return result(409, { error: 'Cancelled bookings cannot be rescheduled.' });
    }
    if (!cfg || !cfg.enabled || cfg.disabledByAdmin) {
      return result(409, { error: 'This host is not currently accepting reschedules.' });
    }

    const meetingType = cfg.meetingTypes.find((m: MeetingTypeConfig) => m.id === rec.meetingTypeId)
      ?? cfg.meetingTypes[0];
    if (!meetingType) return result(409, { error: 'Meeting type is unavailable.' });

    const newStartMs = Date.parse(String(body?.start ?? ''));
    if (!Number.isFinite(newStartMs)) return result(400, { error: 'Valid new start time is required.' });
    const newEndMs = newStartMs + meetingType.durationMinutes * 60_000;

    // Verify new slot is genuinely free in host's schedule (excluding this event's current slot!)
    const slotDay = new Date(newStartMs).toISOString().slice(0, 10);
    const { busyIntervals, bookedCountByHostDay } = await this.loadHostBusyAndDayCounts(
      rec.calId,
      cfg.timeZone,
      newStartMs - 86_400_000,
      newEndMs + 86_400_000,
      existing.id,
    );
    const validSlots = computeAvailableSlots({
      config: cfg,
      meetingType,
      fromDate: slotDay,
      toDate: slotDay,
      busyIntervals,
      bookedCountByHostDay,
    });
    if (!validSlots.some((s) => Date.parse(s.start) === newStartMs)) {
      return result(409, { error: 'That slot is no longer open. Please pick another time.' });
    }

    const oldStartMs = Date.parse(existing.start);
    const oldEndMs = Date.parse(existing.end);
    const lockRes = await this.claimSlotBucketsForEvent(rec.calId, existing.id, newStartMs, newEndMs);
    if (!lockRes.ok) {
      return result(409, { error: 'That slot was just claimed by another guest.' });
    }

    const nowIso = new Date().toISOString();
    const updatedEvent = {
      ...existing,
      sequence: Number(existing.sequence ?? 0) + 1,
      start: new Date(newStartMs).toISOString(),
      end: new Date(newEndMs).toISOString(),
      updatedAt: nowIso,
      booking: {
        ...existing.booking,
        rescheduledCount: Number(existing.booking?.rescheduledCount ?? 0) + 1,
        updatedAt: nowIso,
      },
    };

    await this.store.putJSON(this.keys.event(rec.calId, existing.id), updatedEvent);
    await this.mirrorEventToConnectedProviders(rec.calId, updatedEvent, 'upsert').catch(() => {});
    await this.mirrorBookingToGuestCalendars(updatedEvent, 'upsert').catch(() => {});
    if (Number.isFinite(oldStartMs) && Number.isFinite(oldEndMs)) {
      await this.releaseNonOverlappingBuckets(rec.calId, existing.id, oldStartMs, oldEndMs, newStartMs, newEndMs);
    }
    await this.syncBookingIndexesAfterChange(rec.calId, updatedEvent, 'rescheduled');
    await this.core.regenerate(rec.calId, existing.id);

    const reason = typeof body?.reason === 'string' ? body.reason.trim().slice(0, 500) : null;
    const feedUrl = rec.feedId ? this.core.feedUrl(rec.feedId) : null;
    const singleIcs = buildFeed({
      name: updatedEvent.title,
      timeZone: rec.guestTimeZone || 'UTC',
      role: 'viewer',
      events: [updatedEvent],
    });

    await Promise.all([
      this.email.sendBookingInviteeNotification({
        kind: 'rescheduled',
        event: updatedEvent,
        hostName: cfg.displayName || meta?.name || 'Host',
        hostEmail: rec.hostEmail ?? null,
        guestName: rec.guestName,
        guestEmail: rec.guestEmail,
        timeZone: rec.guestTimeZone || 'UTC',
        webcalUrl: feedUrl ? feedUrl.replace(/^https?:\/\//, 'webcal://') : null,
        icsContent: singleIcs,
        manageUrl: `${this.SITE_URL}/booking/manage/?t=${encodeURIComponent(token)}`,
        guestPortalUrl: `${this.SITE_URL}/bookings/`,
        videoCallURL: updatedEvent.details?.videoCallURL ?? null,
        reason,
      }),
      rec.hostEmail
        ? this.email.sendBookingHostNotification({
            kind: 'rescheduled',
            event: updatedEvent,
            hostEmail: rec.hostEmail,
            guestName: rec.guestName,
            guestEmail: rec.guestEmail,
            timeZone: cfg.timeZone,
            studioUrl: `${this.SITE_URL}/calendar/`,
            reason,
          })
        : Promise.resolve(),
    ]);

    return this.getManageBooking(token);
  }

  async guestCancelByToken(token: string, body: any): Promise<ApiResult> {
    if (!token || !/^[A-Za-z0-9_-]{12,64}$/.test(token)) {
      return result(404, { error: 'Booking link not found.' });
    }
    const rec = await this.store.getJSON(this.keys.manage(token));
    if (!rec?.calId || !rec?.eventId) return result(404, { error: 'Booking not found.' });

    const [existing, cfg] = await Promise.all([
      this.store.getJSON(this.keys.event(rec.calId, rec.eventId)),
      this.store.getJSON(this.keys.bookingConfig(rec.calId)),
    ]);
    if (!existing) return result(404, { error: 'Booking not found.' });
    if (existing.status === 'cancelled') {
      return this.getManageBooking(token);
    }

    const nowIso = new Date().toISOString();
    const cancelledEvent = {
      ...existing,
      status: 'cancelled',
      sequence: Number(existing.sequence ?? 0) + 1,
      updatedAt: nowIso,
      booking: {
        ...(existing.booking ?? {}),
        status: 'cancelled',
        updatedAt: nowIso,
      },
    };
    await this.store.putJSON(this.keys.event(rec.calId, existing.id), cancelledEvent);
    await this.mirrorEventToConnectedProviders(rec.calId, cancelledEvent, 'cancel').catch(() => {});
    await this.mirrorBookingToGuestCalendars(cancelledEvent, 'cancel').catch(() => {});

    const sMs = Date.parse(existing.start);
    const eMs = Date.parse(existing.end);
    if (Number.isFinite(sMs) && Number.isFinite(eMs)) {
      await this.releaseSlotBucketsForEvent(rec.calId, existing.id, sMs, eMs);
    }
    await this.syncBookingIndexesAfterChange(rec.calId, cancelledEvent, 'cancelled');
    await this.core.regenerate(rec.calId, existing.id);

    const reason = typeof body?.reason === 'string' ? body.reason.trim().slice(0, 500) : null;
    const singleIcs = buildFeed({
      name: cancelledEvent.title,
      timeZone: rec.guestTimeZone || 'UTC',
      role: 'viewer',
      events: [cancelledEvent],
    });

    await Promise.all([
      this.email.sendBookingInviteeNotification({
        kind: 'cancelled',
        event: cancelledEvent,
        hostName: cfg?.displayName ?? rec.hostName ?? 'Host',
        hostEmail: rec.hostEmail ?? null,
        guestName: rec.guestName,
        guestEmail: rec.guestEmail,
        timeZone: rec.guestTimeZone || 'UTC',
        icsContent: singleIcs,
        manageUrl: `${this.SITE_URL}/booking/manage/?t=${encodeURIComponent(token)}`,
        guestPortalUrl: `${this.SITE_URL}/bookings/`,
        reason,
      }),
      rec.hostEmail
        ? this.email.sendBookingHostNotification({
            kind: 'cancelled',
            event: cancelledEvent,
            hostEmail: rec.hostEmail,
            guestName: rec.guestName,
            guestEmail: rec.guestEmail,
            timeZone: cfg?.timeZone ?? 'UTC',
            studioUrl: `${this.SITE_URL}/calendar/`,
            reason,
          })
        : Promise.resolve(),
    ]);

    return this.getManageBooking(token);
  }

  /** Dedicated Guest Portal: lists every booking made across any host by this user's verified emails! */
  async listAuthenticatedGuestBookings(principal: any): Promise<ApiResult> {
    const principalDoc = await this.store.getJSON(this.keys.principal(principal.principalId));
    const emails = this.verifiedEmailsForPrincipal(principalDoc);
    if (!emails.length) {
      return result(200, { emails: [], bookings: [] });
    }

    const keyGroups = await Promise.all(
      emails.map((em) => this.store.listKeys(this.keys.guestBookingsPrefix(this.core.emailHash(em)))),
    );
    const allKeys = [...new Set(keyGroups.flat())];
    const records = (await Promise.all(allKeys.map((k) => this.store.getJSON(k)))).filter(Boolean);

    // Hydrate against live event status if present so moves/cancellations are always up to date
    const bookings = (
      await Promise.all(
        records.map(async (rec) => {
          const liveEvent = rec.calId && rec.eventId
            ? await this.store.getJSON(this.keys.event(rec.calId, rec.eventId))
            : null;
          const status = liveEvent?.status ?? rec.status ?? 'confirmed';
          const start = liveEvent?.start ?? rec.start;
          const end = liveEvent?.end ?? rec.end;
          const feedUrl = rec.feedId ? this.core.feedUrl(rec.feedId) : null;
          return {
            bookingId: rec.bookingId,
            manageToken: rec.manageToken,
            manageUrl: `${this.SITE_URL}/booking/manage/?t=${encodeURIComponent(rec.manageToken)}`,
            title: liveEvent?.title ?? rec.title,
            start,
            end,
            status,
            color: validHexColor(liveEvent?.color ?? rec.color, '#0A84FF'),
            location: liveEvent?.location ?? rec.location ?? null,
            videoCallURL: liveEvent?.details?.videoCallURL ?? rec.videoCallURL ?? null,
            hostName: rec.hostName,
            hostHandle: rec.hostHandle,
            meetingTypeId: rec.meetingTypeId,
            meetingTypeName: rec.meetingTypeName,
            guestName: rec.guestName,
            guestEmail: rec.guestEmail,
            guestTimeZone: rec.guestTimeZone ?? 'UTC',
            feedUrl,
            webcalUrl: feedUrl ? feedUrl.replace(/^https?:\/\//, 'webcal://') : null,
          };
        }),
      )
    ).sort((a, b) => Date.parse(a.start) - Date.parse(b.start));

    return result(200, { emails, bookings });
  }

  // ── 6. Platform Admin Console (Admin-Only) ───────────────────────────────

  private async assertAdmin(principal: any): Promise<ApiResult | null> {
    const principalDoc = await this.store.getJSON(this.keys.principal(principal.principalId));
    if (!this.isAdminPrincipal(principalDoc)) {
      return result(403, { error: 'Admin access is restricted to authorized platform administrators.' });
    }
    return null;
  }

  async getAdminOverview(principal: any): Promise<ApiResult> {
    const denied = await this.assertAdmin(principal);
    if (denied) return denied;

    const [hostKeys, bookingKeys, settings] = await Promise.all([
      this.store.listKeys(this.keys.hostBookingsPrefix()),
      this.store.listKeys(this.keys.allBookingsPrefix()),
      this.store.getJSON(this.keys.adminSettings()),
    ]);

    const [hostsRaw, bookingsRaw] = await Promise.all([
      Promise.all(hostKeys.slice(0, 300).map((k) => this.store.getJSON(k))),
      Promise.all(bookingKeys.slice(0, 500).map((k) => this.store.getJSON(k))),
    ]);

    const hosts = hostsRaw
      .filter(Boolean)
      .sort((a, b) => String(b.updatedAt ?? '').localeCompare(String(a.updatedAt ?? '')));
    const bookings = bookingsRaw
      .filter(Boolean)
      .sort((a, b) => String(b.createdAt ?? '').localeCompare(String(a.createdAt ?? '')));

    const now = Date.now();
    const next7d = now + 7 * 86_400_000;
    const confirmed = bookings.filter((b) => b.status !== 'cancelled');
    const cancelled = bookings.filter((b) => b.status === 'cancelled');
    const rescheduled = bookings.filter((b) => b.lastChangeKind === 'rescheduled');
    const upcoming7d = confirmed.filter((b) => {
      const s = Date.parse(b.start);
      return Number.isFinite(s) && s >= now && s <= next7d;
    });

    return result(200, {
      kpis: {
        totalHosts: hosts.length,
        activeHosts: hosts.filter((h) => h.enabled && !h.disabledByAdmin).length,
        suspendedHosts: hosts.filter((h) => h.disabledByAdmin).length,
        totalBookings: bookings.length,
        confirmedBookings: confirmed.length,
        cancelledBookings: cancelled.length,
        rescheduledBookings: rescheduled.length,
        upcomingNext7Days: upcoming7d.length,
      },
      system: {
        emailConfigured: this.email.mailConfigured(),
        emailGuardTable: process.env.EMAIL_GUARD_TABLE ?? null,
        feedHost: this.core.FEED_HOST,
        googleIosConfigured: Boolean(this.GOOGLE_IOS_CLIENT_ID),
        googleWebConfigured: Boolean(settings?.googleWebClientId || process.env.GOOGLE_WEB_CLIENT_ID),
        googleWebSecretConfigured: Boolean(settings?.googleWebClientSecret || process.env.GOOGLE_WEB_CLIENT_SECRET),
        microsoftWebConfigured: Boolean(settings?.microsoftWebClientId || this.MICROSOFT_DEFAULT_CLIENT_ID),
      },
      settings: {
        googleWebClientId: settings?.googleWebClientId ?? process.env.GOOGLE_WEB_CLIENT_ID ?? '',
        googleWebSecretConfigured: Boolean(settings?.googleWebClientSecret || process.env.GOOGLE_WEB_CLIENT_SECRET),
        microsoftWebClientId: settings?.microsoftWebClientId || this.MICROSOFT_DEFAULT_CLIENT_ID || '',
        microsoftTenant: settings?.microsoftTenant ?? process.env.MICROSOFT_TENANT ?? 'common',
        featuredDemoHandle: settings?.featuredDemoHandle ?? 'demo',
      },
      hosts,
      recentBookings: bookings.slice(0, 100),
    });
  }

  async moderateHost(principal: any, targetCalId: string, body: any): Promise<ApiResult> {
    const denied = await this.assertAdmin(principal);
    if (denied) return denied;

    const [cfg, summary] = await Promise.all([
      this.store.getJSON(this.keys.bookingConfig(targetCalId)),
      this.store.getJSON(this.keys.hostBookingSummary(targetCalId)),
    ]);
    if (!cfg && !summary) return result(404, { error: 'Host schedule not found.' });

    const disabledByAdmin = Boolean(body?.disabledByAdmin);
    const nowIso = new Date().toISOString();
    if (cfg) {
      await this.store.putJSON(this.keys.bookingConfig(targetCalId), {
        ...cfg,
        disabledByAdmin,
        updatedAt: nowIso,
      });
    }
    if (summary) {
      await this.store.putJSON(this.keys.hostBookingSummary(targetCalId), {
        ...summary,
        disabledByAdmin,
        updatedAt: nowIso,
      });
    }
    return result(200, { calId: targetCalId, disabledByAdmin });
  }

  async updateAdminSettings(principal: any, body: any): Promise<ApiResult> {
    const denied = await this.assertAdmin(principal);
    if (denied) return denied;

    const existing = (await this.store.getJSON(this.keys.adminSettings())) ?? {};
    const next = {
      ...existing,
      googleWebClientId: body?.googleWebClientId !== undefined
        ? String(body.googleWebClientId ?? '').trim().slice(0, 200)
        : (existing.googleWebClientId ?? ''),
      googleWebClientSecret: body?.googleWebClientSecret !== undefined && String(body.googleWebClientSecret).trim() !== ''
        ? (String(body.googleWebClientSecret).trim() === '__CLEAR__' ? '' : String(body.googleWebClientSecret).trim().slice(0, 200))
        : (existing.googleWebClientSecret ?? ''),
      microsoftWebClientId: body?.microsoftWebClientId !== undefined
        ? (String(body.microsoftWebClientId ?? '').trim().slice(0, 200) || this.MICROSOFT_DEFAULT_CLIENT_ID)
        : (existing.microsoftWebClientId || this.MICROSOFT_DEFAULT_CLIENT_ID),
      microsoftTenant: body?.microsoftTenant !== undefined
        ? (String(body.microsoftTenant ?? 'common').trim().slice(0, 120) || 'common')
        : (existing.microsoftTenant ?? 'common'),
      featuredDemoHandle: body?.featuredDemoHandle !== undefined
        ? (String(body.featuredDemoHandle ?? 'demo').trim().toLowerCase().slice(0, 40) || 'demo')
        : (existing.featuredDemoHandle ?? 'demo'),
      updatedAt: new Date().toISOString(),
    };
    await this.store.putJSON(this.keys.adminSettings(), next);
    const { googleWebClientSecret: _secret, ...publicSettings } = next;
    return result(200, {
      settings: {
        ...publicSettings,
        googleWebSecretConfigured: Boolean(next.googleWebClientSecret || process.env.GOOGLE_WEB_CLIENT_SECRET),
      },
    });
  }

  // ── 7. Atomic Concurrency & Index Sync Helpers ───────────────────────────

  private async claimSlotBucketsForEvent(
    calId: string,
    eventId: string,
    startMs: number,
    endMs: number,
  ): Promise<{ ok: boolean; newlyCreated: string[] }> {
    const buckets = fiveMinuteBucketKeys(startMs, endMs);
    const newlyCreated: string[] = [];
    const payload = {
      eventId,
      start: new Date(startMs).toISOString(),
      end: new Date(endMs).toISOString(),
      claimedAt: new Date().toISOString(),
    };

    for (const bucket of buckets) {
      const key = this.keys.bookedBucket(calId, bucket);
      const created = await this.store.putJSONIfAbsent(key, payload);
      if (created) {
        newlyCreated.push(key);
        continue;
      }
      // Check if already owned by the SAME eventId (overlapping self-reschedule!)
      const existingOwner = await this.store.getJSON(key);
      if (existingOwner?.eventId === eventId) {
        continue;
      }
      // Conflict with another booking -> roll back only the buckets we created in this call!
      await Promise.all(newlyCreated.map((k) => this.store.del(k).catch(() => {})));
      return { ok: false, newlyCreated: [] };
    }
    return { ok: true, newlyCreated };
  }

  private async releaseSlotBucketsForEvent(
    calId: string,
    eventId: string,
    startMs: number,
    endMs: number,
  ): Promise<void> {
    const buckets = fiveMinuteBucketKeys(startMs, endMs);
    await Promise.all(
      buckets.map(async (bucket) => {
        const key = this.keys.bookedBucket(calId, bucket);
        const owner = await this.store.getJSON(key);
        if (!owner || owner.eventId === eventId) {
          await this.store.del(key);
        }
      }),
    );
  }

  private async releaseNonOverlappingBuckets(
    calId: string,
    eventId: string,
    oldStartMs: number,
    oldEndMs: number,
    newStartMs: number,
    newEndMs: number,
  ): Promise<void> {
    const newSet = new Set(fiveMinuteBucketKeys(newStartMs, newEndMs));
    const toRelease = fiveMinuteBucketKeys(oldStartMs, oldEndMs).filter((b) => !newSet.has(b));
    await Promise.all(
      toRelease.map(async (bucket) => {
        const key = this.keys.bookedBucket(calId, bucket);
        const owner = await this.store.getJSON(key);
        if (!owner || owner.eventId === eventId) {
          await this.store.del(key);
        }
      }),
    );
  }

  private async addScopedFeedToAclCas(calId: string, feedId: string, grant: any): Promise<void> {
    const key = this.keys.acl(calId);
    for (let attempt = 0; attempt < 6; attempt += 1) {
      const snap = await this.store.getJSONWithETag(key);
      if (!snap) return;
      const nextAcl = {
        ...snap.value,
        feeds: {
          ...(snap.value.feeds ?? {}),
          [feedId]: grant,
        },
      };
      const ok = await this.store.putJSONIfMatch(key, nextAcl, snap.etag);
      if (ok) return;
    }
    throw new Error('Could not update calendar ACL after concurrent retries');
  }

  private async syncBookingIndexesAfterChange(
    calId: string,
    eventDoc: any,
    changeKind: 'rescheduled' | 'cancelled',
  ): Promise<void> {
    const b = eventDoc?.booking;
    if (!b?.bookingId || !b?.manageToken) return;
    const nowIso = new Date().toISOString();
    const guestEmailHash = b.guestEmail ? this.core.emailHash(b.guestEmail) : null;

    const patch = (rec: any) => ({
      ...(rec ?? {}),
      calId,
      eventId: eventDoc.id,
      bookingId: b.bookingId,
      manageToken: b.manageToken,
      title: eventDoc.title,
      start: eventDoc.start,
      end: eventDoc.end,
      status: eventDoc.status,
      lastChangeKind: changeKind,
      updatedAt: nowIso,
    });

    const manageExisting = await this.store.getJSON(this.keys.manage(b.manageToken));
    const allExisting = await this.store.getJSON(this.keys.allBookingRecord(b.bookingId));
    const guestExisting = guestEmailHash
      ? await this.store.getJSON(this.keys.guestBooking(guestEmailHash, b.bookingId))
      : null;

    await Promise.all([
      manageExisting ? this.store.putJSON(this.keys.manage(b.manageToken), patch(manageExisting)) : Promise.resolve(),
      allExisting ? this.store.putJSON(this.keys.allBookingRecord(b.bookingId), patch(allExisting)) : Promise.resolve(),
      guestEmailHash && guestExisting
        ? this.store.putJSON(this.keys.guestBooking(guestEmailHash, b.bookingId), patch(guestExisting))
        : Promise.resolve(),
    ]);
  }

  // ── 8. Bi-Directional (2-Way) Google & Microsoft Calendar Sync Engine ────

  /**
   * 1-Click Guest Action: links an existing booking (`manage/:token`) to the authenticated
   * Guest's CloudCalendars calendar AND mirrors it directly to their connected Google / Microsoft calendars!
   */
  async syncManageBookingToMyCalendar(principal: any, token: string): Promise<ApiResult> {
    if (!token || !/^[A-Za-z0-9_-]{12,64}$/.test(token)) {
      return result(404, { error: 'Booking link not found.' });
    }
    const rec = await this.store.getJSON(this.keys.manage(token));
    if (!rec?.calId || !rec?.eventId) {
      return result(404, { error: 'Booking not found.' });
    }
    const eventDoc = await this.store.getJSON(this.keys.event(rec.calId, rec.eventId));
    if (!eventDoc || eventDoc.status === 'cancelled') {
      return result(409, { error: 'Booking is no longer active.' });
    }

    if (principal.calId !== rec.calId) {
      await this.store.putJSON(this.keys.receivedInvite(principal.principalId, eventDoc.id), {
        ownerCalId: rec.calId,
        eventId: eventDoc.id,
        feedId: rec.feedId,
        access: 'reader',
        acceptedAt: new Date().toISOString(),
      });
    }

    const mirrorRes = await this.mirrorEventToConnectedProviders(principal.calId, eventDoc, 'upsert', {
      forGuestCalendar: true,
    });
    if (principal.calId !== rec.calId) {
      eventDoc.booking = {
        ...(eventDoc.booking ?? {}),
        guestPrincipalId: principal.principalId,
        guestCalId: principal.calId,
        guestExternalSync: eventDoc.externalSyncGuest?.[principal.calId] ?? null,
      };
      await this.store.putJSON(this.keys.event(rec.calId, rec.eventId), eventDoc);
    }

    return result(200, {
      synced: true,
      linkedToCloudCalendar: true,
      syncedProviders: mirrorRes.syncedProviders,
    });
  }

  private async saveProviderConnectionTokens(
    calId: string,
    provider: 'google' | 'microsoft',
    input: {
      accessToken: string;
      refreshToken?: string | null;
      expiresIn?: number;
      clientId?: string;
      tenant?: string;
      accountEmail?: string | null;
      accountName?: string | null;
      autoPushEvents?: boolean;
    },
  ): Promise<void> {
    const existing: OAuthConnectionsDoc =
      (await this.store.getJSON(this.keys.oauthConnections(calId))) ?? {};
    const prev = existing[provider];
    const nowIso = new Date().toISOString();
    const ttlSeconds = Number(input.expiresIn) > 60 ? Number(input.expiresIn) : 3500;

    existing[provider] = {
      provider,
      connected: true,
      accountEmail: input.accountEmail ?? prev?.accountEmail ?? null,
      accountName: input.accountName ?? prev?.accountName ?? null,
      accessToken: input.accessToken,
      // Keep previously stored refresh_token if Google/Microsoft omits it on incremental consent!
      refreshToken: input.refreshToken ? input.refreshToken : (prev?.refreshToken ?? null),
      expiresAt: Date.now() + ttlSeconds * 1000,
      clientId: input.clientId ?? prev?.clientId ?? null,
      tenant: input.tenant ?? prev?.tenant ?? 'common',
      autoPushEvents: input.autoPushEvents !== undefined ? input.autoPushEvents : (prev?.autoPushEvents ?? true),
      connectedAt: prev?.connectedAt ?? nowIso,
      updatedAt: nowIso,
      lastSyncedAt: prev?.lastSyncedAt ?? null,
      lastSyncError: null,
    };
    existing.updatedAt = nowIso;
    await this.store.putJSON(this.keys.oauthConnections(calId), existing);
  }

  private async disconnectProviderConnection(
    calId: string,
    provider: 'google' | 'microsoft',
  ): Promise<void> {
    const existing: OAuthConnectionsDoc | null = await this.store.getJSON(
      this.keys.oauthConnections(calId),
    );
    if (!existing || !existing[provider]) return;
    delete existing[provider];
    existing.updatedAt = new Date().toISOString();
    await this.store.putJSON(this.keys.oauthConnections(calId), existing);
  }

  private async getValidProviderAccessToken(
    calId: string,
    provider: 'google' | 'microsoft',
  ): Promise<string | null> {
    const doc: OAuthConnectionsDoc | null = await this.store.getJSON(
      this.keys.oauthConnections(calId),
    );
    const conn = doc?.[provider];
    if (!conn?.connected) return null;

    // Still fresh for at least 90 seconds -> return directly!
    if (conn.accessToken && Number(conn.expiresAt) > Date.now() + 90_000) {
      return conn.accessToken;
    }

    if (!conn.refreshToken) {
      return null;
    }

    const settings = (await this.store.getJSON(this.keys.adminSettings())) ?? {};
    try {
      if (provider === 'google') {
        const webClientId = String(
          settings.googleWebClientId ?? process.env.GOOGLE_WEB_CLIENT_ID ?? '',
        ).trim();
        const webClientSecret = String(
          settings.googleWebClientSecret ?? process.env.GOOGLE_WEB_CLIENT_SECRET ?? '',
        ).trim();
        const clientId = conn.clientId || webClientId || this.GOOGLE_IOS_CLIENT_ID;
        if (!clientId) return null;
        // Include clientSecret only when refreshing with the Web Client ID (native iOS client refreshes without secret)
        const useSecret = clientId === webClientId ? webClientSecret || null : null;
        const refreshed = await refreshGoogleAccessToken({
          refreshToken: conn.refreshToken,
          clientId,
          clientSecret: useSecret,
        });
        conn.accessToken = refreshed.accessToken;
        conn.expiresAt = Date.now() + refreshed.expiresIn * 1000;
        conn.updatedAt = new Date().toISOString();
        conn.lastSyncError = null;
      } else {
        const msClientId =
          conn.clientId ||
          String(settings.microsoftWebClientId || this.MICROSOFT_DEFAULT_CLIENT_ID).trim();
        if (!msClientId) return null;
        const refreshed = await refreshMicrosoftAccessToken({
          refreshToken: conn.refreshToken,
          clientId: msClientId,
          tenant: conn.tenant || settings.microsoftTenant || 'common',
          siteOrigin: this.SITE_URL,
        });
        conn.accessToken = refreshed.accessToken;
        if (refreshed.refreshToken) conn.refreshToken = refreshed.refreshToken;
        conn.expiresAt = Date.now() + refreshed.expiresIn * 1000;
        conn.updatedAt = new Date().toISOString();
        conn.lastSyncError = null;
      }
      await this.store.putJSON(this.keys.oauthConnections(calId), doc);
      return conn.accessToken;
    } catch (err: any) {
      conn.lastSyncError = String(err?.message || 'Token refresh failed').slice(0, 200);
      await this.store.putJSON(this.keys.oauthConnections(calId), doc).catch(() => {});
      return null;
    }
  }

  /**
   * Automatically refreshes external busy events from connected Google & Microsoft accounts
   * when `force` is set or when `booking-busy.json` is older than 3 minutes (`180_000 ms`).
   */
  private async refreshConnectedBusyEventsIfNeeded(
    calId: string,
    opts: { force?: boolean; onlyProvider?: 'google' | 'microsoft' } = {},
  ): Promise<void> {
    const connDoc: OAuthConnectionsDoc | null = await this.store.getJSON(
      this.keys.oauthConnections(calId),
    );
    if (!connDoc?.google?.connected && !connDoc?.microsoft?.connected) return;

    const currentBusy = (await this.store.getJSON(this.keys.bookingBusy(calId))) ?? {
      updatedAt: null,
      sources: {},
      events: [],
    };
    if (!opts.force && currentBusy.updatedAt) {
      const ageMs = Date.now() - Date.parse(currentBusy.updatedAt);
      if (Number.isFinite(ageMs) && ageMs < 60_000) return;
    }

    const providersToSync: Array<'google' | 'microsoft'> = opts.onlyProvider
      ? [opts.onlyProvider]
      : (['google', 'microsoft'] as const).filter((p) => Boolean(connDoc?.[p]?.connected));
    if (!providersToSync.length) return;

    // Collect mirrored IDs from CloudCalendars events so we never duplicate our own events back as External Busy!
    const eventKeys = await this.store.listKeys(this.keys.events(calId));
    const localEvents = (await Promise.all(eventKeys.map((k) => this.store.getJSON(k)))).filter(Boolean);
    const mirroredGoogleIds = new Set<string>();
    const mirroredMicrosoftIds = new Set<string>();
    for (const ev of localEvents) {
      if (ev?.externalSync?.google?.eventId) mirroredGoogleIds.add(String(ev.externalSync.google.eventId));
      if (ev?.externalSync?.microsoft?.eventId) mirroredMicrosoftIds.add(String(ev.externalSync.microsoft.eventId));
    }

    const now = Date.now();
    const rangeStartMs = now - 7 * 86_400_000;
    const rangeEndMs = now + 90 * 86_400_000;

    let nextEvents: any[] = Array.isArray(currentBusy.events) ? [...currentBusy.events] : [];
    const nextSources: Record<string, any> = { ...(currentBusy.sources ?? {}) };
    let changed = false;

    for (const provider of providersToSync) {
      const accessToken = await this.getValidProviderAccessToken(calId, provider);
      if (!accessToken) {
        if (opts.onlyProvider === provider) {
          throw new Error(`${provider} session expired — please reconnect ${provider} Calendar.`);
        }
        continue;
      }

      try {
        const pulled =
          provider === 'google'
            ? await pullGoogleCalendarBusyEvents({
                accessToken,
                rangeStartMs,
                rangeEndMs,
                mirroredGoogleIds,
              })
            : await pullMicrosoftCalendarBusyEvents({
                accessToken,
                rangeStartMs,
                rangeEndMs,
                mirroredMicrosoftIds,
              });

        const nowIso = new Date().toISOString();
        nextEvents = [
          ...nextEvents.filter((e: any) => e.source !== provider),
          ...pulled,
        ];
        nextSources[provider] = {
          syncedAt: nowIso,
          count: pulled.length,
        };
        if (connDoc[provider]) {
          connDoc[provider]!.lastSyncedAt = nowIso;
          connDoc[provider]!.lastSyncError = null;
        }
        changed = true;
      } catch (err: any) {
        if (connDoc[provider]) {
          connDoc[provider]!.lastSyncError = String(err?.message || 'Sync error').slice(0, 200);
        }
        if (opts.onlyProvider === provider) throw err;
      }
    }

    if (changed) {
      const nowIso = new Date().toISOString();
      await Promise.all([
        this.store.putJSON(this.keys.bookingBusy(calId), {
          updatedAt: nowIso,
          sources: nextSources,
          events: nextEvents.slice(0, 1000),
        }),
        this.store.putJSON(this.keys.oauthConnections(calId), connDoc),
      ]);
    }
  }

  /**
   * Pushes a CloudCalendars event (`upsert` or `cancel`) to connected Google & Microsoft calendars on `calId`.
   * Mutates `eventDoc.externalSync` (or `eventDoc.externalSyncGuest[calId]`) and persists it cleanly!
   */
  private async mirrorEventToConnectedProviders(
    calId: string,
    eventDoc: any,
    mode: 'upsert' | 'cancel',
    opts: {
      generateGoogleMeet?: boolean;
      generateTeamsMeeting?: boolean;
      forGuestCalendar?: boolean;
    } = {},
  ): Promise<{ autoVideoUrl: string | null; syncedProviders: string[] }> {
    const connDoc: OAuthConnectionsDoc | null = await this.store.getJSON(
      this.keys.oauthConnections(calId),
    );
    if (!connDoc?.google?.connected && !connDoc?.microsoft?.connected) {
      return { autoVideoUrl: null, syncedProviders: [] };
    }

    const syncSlot = opts.forGuestCalendar
      ? (eventDoc.externalSyncGuest?.[calId] ?? {})
      : (eventDoc.externalSync ?? {});

    let autoVideoUrl: string | null = null;
    const syncedProviders: string[] = [];
    let touched = false;

    // 1. Google Calendar v3
    if (connDoc.google?.connected && connDoc.google.autoPushEvents !== false) {
      const gTok = await this.getValidProviderAccessToken(calId, 'google');
      if (gTok) {
        try {
          if (mode === 'cancel') {
            if (syncSlot.google?.eventId) {
              await pushDeleteGoogleCalendarEvent({
                accessToken: gTok,
                googleEventId: syncSlot.google.eventId,
                sendUpdates: opts.forGuestCalendar ? 'none' : 'all',
              });
              syncSlot.google = { ...syncSlot.google, cancelledAt: new Date().toISOString() };
              touched = true;
              syncedProviders.push('google');
            }
          } else {
            const evForPush = opts.forGuestCalendar
              ? { ...eventDoc, details: { ...(eventDoc.details ?? {}), attendees: [] } }
              : eventDoc;
            const gRes = await pushUpsertGoogleCalendarEvent({
              accessToken: gTok,
              eventDoc: evForPush,
              existingGoogleEventId: syncSlot.google?.eventId ?? null,
              generateGoogleMeet: !opts.forGuestCalendar && opts.generateGoogleMeet,
              sendUpdates: opts.forGuestCalendar ? 'none' : 'all',
            });
            syncSlot.google = {
              eventId: gRes.googleEventId,
              htmlLink: gRes.htmlLink,
              meetUrl: gRes.meetUrl,
              syncedAt: new Date().toISOString(),
            };
            if (gRes.meetUrl && !autoVideoUrl) autoVideoUrl = gRes.meetUrl;
            touched = true;
            syncedProviders.push('google');
          }
        } catch {
          // Non-fatal: CloudCalendars canonical event & .ics feed always succeed even if external quota/token blips
        }
      }
    }

    // 2. Microsoft Outlook / Graph
    if (connDoc.microsoft?.connected && connDoc.microsoft.autoPushEvents !== false) {
      const msTok = await this.getValidProviderAccessToken(calId, 'microsoft');
      if (msTok) {
        try {
          if (mode === 'cancel') {
            if (syncSlot.microsoft?.eventId) {
              await pushDeleteMicrosoftCalendarEvent({
                accessToken: msTok,
                microsoftEventId: syncSlot.microsoft.eventId,
              });
              syncSlot.microsoft = { ...syncSlot.microsoft, cancelledAt: new Date().toISOString() };
              touched = true;
              syncedProviders.push('microsoft');
            }
          } else {
            const msRes = await pushUpsertMicrosoftCalendarEvent({
              accessToken: msTok,
              eventDoc,
              existingMicrosoftEventId: syncSlot.microsoft?.eventId ?? null,
              generateTeamsMeeting: !opts.forGuestCalendar && opts.generateTeamsMeeting,
              includeAttendees: !opts.forGuestCalendar,
            });
            syncSlot.microsoft = {
              eventId: msRes.microsoftEventId,
              webLink: msRes.webLink,
              teamsUrl: msRes.teamsUrl,
              syncedAt: new Date().toISOString(),
            };
            if (msRes.teamsUrl && !autoVideoUrl) autoVideoUrl = msRes.teamsUrl;
            touched = true;
            syncedProviders.push('microsoft');
          }
        } catch {
          // Non-fatal
        }
      }
    }

    if (touched) {
      if (opts.forGuestCalendar) {
        eventDoc.externalSyncGuest = {
          ...(eventDoc.externalSyncGuest ?? {}),
          [calId]: syncSlot,
        };
      } else {
        eventDoc.externalSync = syncSlot;
        await this.store.putJSON(this.keys.event(calId, eventDoc.id), eventDoc).catch(() => {});
      }
    }

    return { autoVideoUrl, syncedProviders };
  }

  /**
   * Automatically links a newly booked meeting directly onto the Guest's own CloudCalendars account
   * (resolved via session Bearer token OR verified `accountEmail` index) AND mirrors it to the Guest's
   * connected Google / Microsoft calendars!
   */
  private async autoLinkAndMirrorBookingToGuest(
    authHeader: string,
    guestEmail: string,
    hostCalId: string,
    eventDoc: any,
    inviteeFeedId: string,
  ): Promise<void> {
    let guestPrincipalId: string | null = null;
    let guestCalId: string | null = null;

    const rawBearer = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    if (rawBearer) {
      const caller = await this.core.resolveToken(rawBearer);
      if (caller?.principalId && caller?.calId) {
        guestPrincipalId = caller.principalId;
        guestCalId = caller.calId;
      }
    }

    if (!guestPrincipalId) {
      const emailOwner = await this.store.getJSON(
        this.keys.accountEmail(this.core.emailHash(guestEmail)),
      );
      if (emailOwner?.principalId) {
        const pDoc = await this.store.getJSON(this.keys.principal(String(emailOwner.principalId)));
        if (pDoc?.calId) {
          guestPrincipalId = String(emailOwner.principalId);
          guestCalId = String(pDoc.calId);
        }
      }
    }

    if (!guestPrincipalId || !guestCalId || guestCalId === hostCalId) return;

    // 1. Link directly into Guest's CloudCalendars `receivedInvites` so it renders natively on `/calendar/` & iOS!
    await this.store.putJSON(this.keys.receivedInvite(guestPrincipalId, eventDoc.id), {
      ownerCalId: hostCalId,
      eventId: eventDoc.id,
      feedId: inviteeFeedId,
      access: 'reader',
      acceptedAt: new Date().toISOString(),
    });

    eventDoc.booking = {
      ...(eventDoc.booking ?? {}),
      guestPrincipalId,
      guestCalId,
    };

    // 2. Mirror into Guest's connected Google / Microsoft calendar if Host didn't already invite via that same provider
    await this.mirrorEventToConnectedProviders(guestCalId, eventDoc, 'upsert', {
      forGuestCalendar: true,
    });
  }

  private async mirrorBookingToGuestCalendars(
    eventDoc: any,
    mode: 'upsert' | 'cancel',
  ): Promise<void> {
    const guestCalId = eventDoc?.booking?.guestCalId;
    if (!guestCalId) return;
    await this.mirrorEventToConnectedProviders(guestCalId, eventDoc, mode, {
      forGuestCalendar: true,
    });
  }

  // ── 7. iOS QR Login, TOTP Web Authenticator & Stripe Web Subscriptions ───

  private hashSecretToken(value: string): string {
    return createHash('sha256').update(`cc-secret:${value}`).digest('hex');
  }

  async startIosQrChallenge(authHeader: string): Promise<ApiResult> {
    const rawBearer = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    const caller = rawBearer ? await this.core.resolveToken(rawBearer) : null;

    let webEmail: string | null = null;
    if (caller?.principalId) {
      const webDoc = await this.store.getJSON(this.keys.principal(caller.principalId));
      webEmail = this.verifiedEmailsForPrincipal(webDoc)[0] ?? null;
    }

    const challengeId = randomId(20);
    const pollToken = randomId(24);
    const now = Date.now();
    const expiresAt = now + 5 * 60_000;

    await this.store.putJSON(this.keys.iosQrChallenge(challengeId), {
      id: challengeId,
      pollTokenHash: this.hashSecretToken(pollToken),
      status: 'pending',
      createdAt: now,
      expiresAt,
      webPrincipalId: caller?.principalId ?? null,
      webCalId: caller?.calId ?? null,
      webEmail,
    });

    const encodedId = encodeURIComponent(challengeId);
    return result(200, {
      challengeId,
      pollToken,
      qrUrl: `${this.SITE_URL}/app-auth/?c=${encodedId}`,
      appDeepLink: `cloudcalendars://app-auth?c=${encodedId}`,
      expiresAt: new Date(expiresAt).toISOString(),
      expiresInSeconds: 300,
    });
  }

  async getIosQrChallengeInfo(iosPrincipal: any, rawChallengeId: string): Promise<ApiResult> {
    const challengeId = String(rawChallengeId ?? '').trim();
    if (!/^[A-Za-z0-9_-]{12,64}$/.test(challengeId)) {
      return result(400, { error: 'Invalid QR login challenge.' });
    }

    const [challenge, iosDoc, meta] = await Promise.all([
      this.store.getJSON(this.keys.iosQrChallenge(challengeId)),
      this.store.getJSON(this.keys.principal(iosPrincipal.principalId)),
      this.store.getJSON(this.keys.meta(iosPrincipal.calId)),
    ]);

    if (!challenge) {
      return result(404, { code: 'qr_not_found', error: 'This QR code has expired or was already used.' });
    }

    const expired = Date.now() > Number(challenge.expiresAt ?? 0);
    const status = expired && challenge.status === 'pending' ? 'expired' : challenge.status;
    const iosEmails = this.verifiedEmailsForPrincipal(iosDoc);

    return result(200, {
      challengeId,
      status,
      expiresAt: new Date(Number(challenge.expiresAt ?? Date.now())).toISOString(),
      webEmail: challenge.webEmail ?? null,
      iosEmail: iosEmails[0] ?? null,
      iosDisplayName: iosDoc?.displayName ?? meta?.name ?? 'Cloud Calendars',
      alreadyUnlocked: Boolean(iosDoc?.iosUnlocked || iosDoc?.iosUnlockedAt),
    });
  }

  async approveIosQrChallenge(iosPrincipal: any, body: any): Promise<ApiResult> {
    const challengeId = String(body?.challengeId ?? body?.c ?? '').trim();
    if (!/^[A-Za-z0-9_-]{12,64}$/.test(challengeId)) {
      return result(400, { error: 'Invalid QR login challenge.' });
    }

    const challengeKey = this.keys.iosQrChallenge(challengeId);
    const challenge = await this.store.getJSON(challengeKey);
    if (!challenge) {
      return result(404, { code: 'qr_not_found', error: 'This QR code has expired or was already used.' });
    }
    if (challenge.status !== 'pending' || Date.now() > Number(challenge.expiresAt ?? 0)) {
      return result(410, { code: 'qr_expired', error: 'This QR code has expired. Scan the refreshed QR code on your computer.' });
    }

    const nowIso = new Date().toISOString();
    const { principalId: iosPrincipalId, calId: iosCalId } = iosPrincipal;
    const [existingIosDoc, iosMeta] = await Promise.all([
      this.store.getJSON(this.keys.principal(iosPrincipalId)),
      this.store.getJSON(this.keys.meta(iosCalId)),
    ]);

    const iosDoc: any = {
      ...(existingIosDoc ?? { id: iosPrincipalId, calId: iosCalId, createdAt: nowIso }),
    };
    iosDoc.iosUnlocked = true;
    iosDoc.iosUnlockedAt = iosDoc.iosUnlockedAt ?? nowIso;
    iosDoc.totpSecret = iosDoc.totpSecret || generateTotpSecret();
    iosDoc.totpConfiguredAt = iosDoc.totpConfiguredAt ?? nowIso;

    const iosEmails = this.verifiedEmailsForPrincipal(iosDoc);
    const primaryIosEmail = iosEmails[0] ?? null;

    const writes: Promise<any>[] = [
      this.store.putJSON(this.keys.principal(iosPrincipalId), iosDoc),
      ...iosEmails.map((em) =>
        this.store.putJSON(this.keys.accountEmail(this.core.emailHash(em)), {
          principalId: iosPrincipalId,
        }),
      ),
    ];

    let targetPrincipalId = iosPrincipalId;
    let targetCalId = iosCalId;
    let targetEmail = primaryIosEmail;

    if (
      challenge.webPrincipalId &&
      challenge.webCalId &&
      challenge.webPrincipalId !== iosPrincipalId
    ) {
      const webDoc = await this.store.getJSON(this.keys.principal(challenge.webPrincipalId));
      const webEmails = this.verifiedEmailsForPrincipal(webDoc);
      if (webDoc && webEmails.length > 0) {
        const updatedWebDoc = {
          ...webDoc,
          iosUnlocked: true,
          iosUnlockedAt: webDoc.iosUnlockedAt ?? nowIso,
          iosPairedPrincipalId: iosPrincipalId,
          totpSecret: webDoc.totpSecret || iosDoc.totpSecret,
          totpConfiguredAt: webDoc.totpConfiguredAt ?? nowIso,
        };
        writes.push(this.store.putJSON(this.keys.principal(challenge.webPrincipalId), updatedWebDoc));
        targetPrincipalId = challenge.webPrincipalId;
        targetCalId = challenge.webCalId;
        targetEmail = webEmails[0] ?? primaryIosEmail;
      }
    }

    const acl = await this.store.getJSON(this.keys.acl(targetCalId));
    const ownerFeedId =
      Object.keys(acl?.feeds ?? {}).find((f) => acl.feeds[f].role === 'owner') ?? null;

    const deviceToken = await this.core.issueToken(targetPrincipalId, targetCalId, {
      provider: 'ios_qr',
      id: `ios_qr:${iosPrincipalId}`,
    });

    writes.push(
      this.store.putJSON(challengeKey, {
        ...challenge,
        status: 'approved',
        approvedAt: nowIso,
        approvedByPrincipalId: iosPrincipalId,
        approvedSession: {
          calendarId: targetCalId,
          deviceToken,
          feedId: ownerFeedId,
          feedUrl: ownerFeedId ? this.core.feedUrl(ownerFeedId) : null,
          email: targetEmail,
          provider: 'ios_qr',
          ownerId: targetPrincipalId,
        },
      }),
    );

    await Promise.all(writes);

    const displayName = iosDoc?.displayName ?? iosMeta?.name ?? 'Cloud Calendars';
    return result(200, {
      approved: true,
      email: primaryIosEmail ?? targetEmail,
      verifiedEmails: iosEmails,
      displayName,
      totpSecret: iosDoc.totpSecret,
      otpauthUrl: (primaryIosEmail ?? targetEmail)
        ? buildOtpAuthUri({
            email: (primaryIosEmail ?? targetEmail)!,
            secret: iosDoc.totpSecret,
          })
        : null,
      periodSeconds: 30,
      digits: 6,
      iosUnlocked: true,
    });
  }

  async pollIosQrChallenge(body: any): Promise<ApiResult> {
    const challengeId = String(body?.challengeId ?? '').trim();
    const pollToken = String(body?.pollToken ?? '').trim();
    if (!/^[A-Za-z0-9_-]{12,64}$/.test(challengeId) || !pollToken) {
      return result(400, { error: 'challengeId and pollToken are required.' });
    }

    const challengeKey = this.keys.iosQrChallenge(challengeId);
    const challenge = await this.store.getJSON(challengeKey);
    if (!challenge) {
      return result(200, { status: 'expired' });
    }

    const expectedBuf = Buffer.from(String(challenge.pollTokenHash ?? ''), 'utf8');
    const actualBuf = Buffer.from(this.hashSecretToken(pollToken), 'utf8');
    if (expectedBuf.length !== actualBuf.length || !timingSafeEqual(expectedBuf, actualBuf)) {
      return result(403, { error: 'Invalid pollToken.' });
    }

    if (challenge.status === 'pending') {
      if (Date.now() > Number(challenge.expiresAt ?? 0)) {
        await this.store.del(challengeKey).catch(() => {});
        return result(200, { status: 'expired' });
      }
      return result(200, {
        status: 'pending',
        expiresAt: new Date(Number(challenge.expiresAt)).toISOString(),
      });
    }

    if (challenge.status === 'approved' && challenge.approvedSession) {
      const sessionPayload = challenge.approvedSession;
      // Consume immediately so the minted session token cannot be replayed
      await this.store.del(challengeKey);
      const profileRes = await this.getProfile({
        principalId: sessionPayload.ownerId,
        calId: sessionPayload.calendarId,
      });
      return result(200, {
        status: 'approved',
        ...sessionPayload,
        profile: profileRes.body,
      });
    }

    return result(200, { status: 'expired' });
  }

  async setupIosAuthenticator(iosPrincipal: any): Promise<ApiResult> {
    const { principalId, calId } = iosPrincipal;
    const nowIso = new Date().toISOString();
    const [existingDoc, meta] = await Promise.all([
      this.store.getJSON(this.keys.principal(principalId)),
      this.store.getJSON(this.keys.meta(calId)),
    ]);

    const doc: any = {
      ...(existingDoc ?? { id: principalId, calId, createdAt: nowIso }),
    };
    doc.iosUnlocked = true;
    doc.iosUnlockedAt = doc.iosUnlockedAt ?? nowIso;
    doc.totpSecret = doc.totpSecret || generateTotpSecret();
    doc.totpConfiguredAt = doc.totpConfiguredAt ?? nowIso;

    const emails = this.verifiedEmailsForPrincipal(doc);
    const primaryEmail = emails[0] ?? null;

    await Promise.all([
      this.store.putJSON(this.keys.principal(principalId), doc),
      ...emails.map((em) =>
        this.store.putJSON(this.keys.accountEmail(this.core.emailHash(em)), { principalId }),
      ),
    ]);

    return result(200, {
      email: primaryEmail,
      verifiedEmails: emails,
      displayName: doc?.displayName ?? meta?.name ?? 'Cloud Calendars',
      totpSecret: doc.totpSecret,
      otpauthUrl: primaryEmail
        ? buildOtpAuthUri({ email: primaryEmail, secret: doc.totpSecret })
        : null,
      periodSeconds: 30,
      digits: 6,
      iosUnlocked: true,
    });
  }

  async verifyTotpLogin(authHeader: string, body: any): Promise<ApiResult> {
    const email = normalizeEmail(body?.email);
    const code = String(body?.code ?? '').replace(/\s+/g, '');
    if (!email || !/^\d{6}$/.test(code)) {
      return result(400, { error: 'Please enter your email and 6-digit Authenticator code.' });
    }

    const emailHash = this.core.emailHash(email);
    const attemptsKey = this.keys.totpAttempts(emailHash);
    const attemptsDoc = await this.store.getJSON(attemptsKey);
    const now = Date.now();
    if (
      attemptsDoc &&
      Number(attemptsDoc.windowExpiresAt ?? 0) > now &&
      Number(attemptsDoc.count ?? 0) >= 6
    ) {
      return result(429, {
        error: 'Too many failed code attempts. Please wait a few minutes and try again.',
      });
    }

    const emailOwner = await this.store.getJSON(this.keys.accountEmail(emailHash));
    if (!emailOwner?.principalId) {
      await this.recordFailedTotpAttempt(attemptsKey, attemptsDoc, now);
      return result(401, {
        code: 'totp_not_configured',
        error:
          'No Cloud Calendars iOS Authenticator is linked to this email yet. Scan the QR code with the Cloud Calendars iOS app first.',
      });
    }

    const principalId = String(emailOwner.principalId);
    const principalDoc = await this.store.getJSON(this.keys.principal(principalId));
    if (!principalDoc?.totpSecret || !principalDoc?.calId) {
      await this.recordFailedTotpAttempt(attemptsKey, attemptsDoc, now);
      return result(401, {
        code: 'totp_not_configured',
        error:
          'Open Cloud Calendars on your iPhone → Cloud Account → Web Authenticator to activate your 6-digit code.',
      });
    }

    const check = verifyTotpCode(principalDoc.totpSecret, code, {
      nowMs: now,
      window: 1,
      lastAcceptedStep:
        typeof principalDoc.lastTotpStep === 'number' ? principalDoc.lastTotpStep : null,
    });

    if (!check.valid) {
      await this.recordFailedTotpAttempt(attemptsKey, attemptsDoc, now);
      return result(401, {
        error: 'Invalid or already-used 6-digit Authenticator code. Check the live code in your iOS app.',
      });
    }

    const nowIso = new Date(now).toISOString();
    const updatedDoc = {
      ...principalDoc,
      iosUnlocked: true,
      iosUnlockedAt: principalDoc.iosUnlockedAt ?? nowIso,
      lastTotpStep: check.matchedStep,
      lastTotpLoginAt: nowIso,
    };

    const calId = String(principalDoc.calId);
    const acl = await this.store.getJSON(this.keys.acl(calId));
    const ownerFeedId =
      Object.keys(acl?.feeds ?? {}).find((f) => acl.feeds[f].role === 'owner') ?? null;

    await Promise.all([
      this.store.putJSON(this.keys.principal(principalId), updatedDoc),
      this.store.del(attemptsKey).catch(() => {}),
    ]);

    const deviceToken = await this.core.issueToken(principalId, calId, {
      provider: 'ios_totp',
      id: `ios_totp:${emailHash}`,
    });

    const profileRes = await this.getProfile({ principalId, calId });
    return result(200, {
      calendarId: calId,
      deviceToken,
      feedId: ownerFeedId,
      feedUrl: ownerFeedId ? this.core.feedUrl(ownerFeedId) : null,
      email,
      provider: 'ios_totp',
      ownerId: principalId,
      profile: profileRes.body,
    });
  }

  private async recordFailedTotpAttempt(
    attemptsKey: string,
    existing: any,
    now: number,
  ): Promise<void> {
    const expired = !existing || Number(existing.windowExpiresAt ?? 0) <= now;
    const count = expired ? 1 : Number(existing.count ?? 0) + 1;
    const windowExpiresAt = expired ? now + 5 * 60_000 : Number(existing.windowExpiresAt);
    await this.store.putJSON(attemptsKey, { count, windowExpiresAt });
  }

  // ── Stripe Web Subscriptions ($1.99/mo & $19.99/yr) ───────────────────────

  private stripeConfig() {
    const secretKey = String(process.env.STRIPE_SECRET_KEY ?? '').trim();
    const webhookSecret = String(process.env.STRIPE_WEBHOOK_SECRET ?? '').trim();
    const catalog = secretKey ? loadLocalStripeCatalog(secretKey) : null;
    const monthlyPriceId = String(
      process.env.STRIPE_PRICE_MONTHLY_ID ?? catalog?.plans?.monthly?.priceId ?? '',
    ).trim();
    const yearlyPriceId = String(
      process.env.STRIPE_PRICE_YEARLY_ID ?? catalog?.plans?.yearly?.priceId ?? '',
    ).trim();
    const portalConfigurationId = String(
      process.env.STRIPE_PORTAL_CONFIGURATION_ID ?? catalog?.portalConfigurationId ?? '',
    ).trim();
    return {
      secretKey,
      webhookSecret,
      monthlyPriceId,
      yearlyPriceId,
      portalConfigurationId,
      configured: Boolean(secretKey),
    };
  }

  private safeReturnUrl(candidate: unknown): string {
    const fallback = `${this.SITE_URL}/calendar/`;
    const raw = String(candidate ?? '').trim();
    if (!raw) return fallback;
    try {
      const parsed = new URL(raw, this.SITE_URL);
      const allowedHost = new URL(this.SITE_URL).hostname;
      if (parsed.hostname === allowedHost || parsed.hostname === 'localhost') {
        parsed.searchParams.delete('billing');
        parsed.searchParams.delete('session_id');
        return parsed.toString();
      }
    } catch {
      // fall through
    }
    return fallback;
  }

  async getBillingPlans(): Promise<ApiResult> {
    const cfg = this.stripeConfig();
    return result(200, {
      configured: cfg.configured,
      iosFreeForever: true,
      plans: {
        monthly: {
          id: 'monthly',
          name: 'Cloud Calendars Web Studio — Monthly',
          priceUsd: 1.99,
          unitAmountCents: 199,
          interval: 'month',
        },
        yearly: {
          id: 'yearly',
          name: 'Cloud Calendars Web Studio — Yearly',
          priceUsd: 19.99,
          unitAmountCents: 1999,
          interval: 'year',
          savingsLabel: 'Save 16%',
        },
      },
    });
  }

  async createBillingCheckoutSession(principal: any, body: any): Promise<ApiResult> {
    const cfg = this.stripeConfig();
    if (!cfg.secretKey) {
      return result(503, {
        code: 'billing_not_configured',
        error: 'Web billing is being configured. You can unlock Web Studio for free right now with the Cloud Calendars iOS app.',
      });
    }

    const plan: 'monthly' | 'yearly' = body?.plan === 'yearly' ? 'yearly' : 'monthly';
    const { principalId, calId } = principal;
    const principalDoc = await this.store.getJSON(this.keys.principal(principalId));
    const access = this.computeWebAccess(principalDoc);

    if (access.iosUnlocked) {
      return result(409, {
        code: 'already_unlocked_ios',
        error: 'Your account is already unlocked for free forever via the Cloud Calendars iOS app!',
      });
    }
    if (access.entitled && ['stripe_monthly', 'stripe_yearly'].includes(access.accessSource)) {
      return result(409, {
        code: 'already_subscribed',
        error: 'You already have an active Web Studio subscription. Use Manage Billing to switch plans.',
      });
    }

    const emails = this.verifiedEmailsForPrincipal(principalDoc);
    const primaryEmail = emails[0] ?? null;
    if (!primaryEmail) {
      return result(400, {
        code: 'email_required',
        error: 'Please sign in with Google, Microsoft, or a verified email address before subscribing.',
      });
    }

    const returnBase = this.safeReturnUrl(body?.returnUrl);
    const successUrlObj = new URL(returnBase);
    successUrlObj.searchParams.set('billing', 'success');
    const successUrl = `${successUrlObj.toString()}${successUrlObj.toString().includes('?') ? '&' : '?'}session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrlObj = new URL(returnBase);
    cancelUrlObj.searchParams.set('billing', 'cancelled');

    const metadata = {
      app: 'cloud_calendars',
      principalId,
      calId,
      plan,
    };

    const configuredPriceId = plan === 'yearly' ? cfg.yearlyPriceId : cfg.monthlyPriceId;
    const lineItem = configuredPriceId
      ? { price: configuredPriceId, quantity: 1 }
      : {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: plan === 'yearly' ? 1999 : 199,
            recurring: { interval: plan === 'yearly' ? 'year' : 'month' },
            product_data: {
              name:
                plan === 'yearly'
                  ? 'Cloud Calendars Web Studio (Yearly)'
                  : 'Cloud Calendars Web Studio (Monthly)',
              description:
                'Full Web Calendar, Event & Appointment Scheduling Studio at cloud-calendars.com',
              metadata: { app: 'cloud_calendars', plan },
            },
          },
        };

    const existingCustomerId = principalDoc?.billing?.stripeCustomerId ?? null;

    try {
      const session = await stripeRequest<any>({
        secretKey: cfg.secretKey,
        method: 'POST',
        path: '/checkout/sessions',
        form: {
          mode: 'subscription',
          ...(existingCustomerId
            ? {
                customer: existingCustomerId,
                customer_update: { address: 'auto', name: 'auto' },
              }
            : { customer_email: primaryEmail }),
          line_items: [lineItem],
          allow_promotion_codes: true,
          billing_address_collection: 'auto',
          client_reference_id: principalId,
          metadata,
          subscription_data: { metadata },
          success_url: successUrl,
          cancel_url: cancelUrlObj.toString(),
        },
      });

      await this.store.putJSON(this.keys.stripeCheckout(session.id), {
        sessionId: session.id,
        principalId,
        calId,
        plan,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });

      return result(200, {
        sessionId: session.id,
        url: session.url,
        checkoutUrl: session.url,
        plan,
      });
    } catch (err: any) {
      const status = err instanceof StripeRestError && err.status >= 400 && err.status < 500 ? 400 : 502;
      return result(status, {
        error: err?.message || 'Could not start Stripe Checkout session.',
      });
    }
  }

  async reconcileBillingCheckoutSession(principal: any, body: any): Promise<ApiResult> {
    const cfg = this.stripeConfig();
    if (!cfg.secretKey) {
      return result(503, { error: 'Stripe billing is not configured.' });
    }
    const sessionId = String(body?.sessionId ?? '').trim();
    if (!sessionId.startsWith('cs_')) {
      return result(400, { error: 'Valid Stripe Checkout sessionId is required.' });
    }

    try {
      const session = await stripeRequest<any>({
        secretKey: cfg.secretKey,
        method: 'GET',
        path: `/checkout/sessions/${encodeURIComponent(sessionId)}`,
        form: { expand: ['subscription'] },
      });

      if (
        session?.metadata?.app !== 'cloud_calendars' ||
        session?.metadata?.principalId !== principal.principalId
      ) {
        return result(403, { error: 'This checkout session belongs to another account.' });
      }

      if (session.payment_status !== 'paid' && session.status !== 'complete') {
        return result(200, {
          reconciled: false,
          status: session.status,
          paymentStatus: session.payment_status,
        });
      }

      await this.activateSubscriptionFromCheckout(session);
      const profileRes = await this.getProfile(principal);
      return result(200, {
        reconciled: true,
        profile: profileRes.body,
      });
    } catch (err: any) {
      return result(502, {
        error: err?.message || 'Could not reconcile Stripe Checkout session.',
      });
    }
  }

  async createBillingPortalSession(principal: any, body: any): Promise<ApiResult> {
    const cfg = this.stripeConfig();
    if (!cfg.secretKey) {
      return result(503, { error: 'Stripe billing is not configured.' });
    }

    const principalDoc = await this.store.getJSON(this.keys.principal(principal.principalId));
    const customerId = principalDoc?.billing?.stripeCustomerId;
    if (!customerId) {
      return result(409, { error: 'No Stripe subscription customer found on this account.' });
    }

    try {
      const session = await stripeRequest<any>({
        secretKey: cfg.secretKey,
        method: 'POST',
        path: '/billing_portal/sessions',
        form: {
          customer: customerId,
          ...(cfg.portalConfigurationId ? { configuration: cfg.portalConfigurationId } : {}),
          return_url: this.safeReturnUrl(body?.returnUrl),
        },
      });
      return result(200, { url: session.url, portalUrl: session.url });
    } catch (err: any) {
      return result(502, {
        error: err?.message || 'Could not open Stripe Billing Portal.',
      });
    }
  }

  async handleStripeWebhook(rawBody: Buffer | string, signatureHeader: string): Promise<ApiResult> {
    const cfg = this.stripeConfig();
    if (!cfg.secretKey || !cfg.webhookSecret) {
      return result(503, { error: 'Stripe webhook is not configured.' });
    }

    let event: any;
    try {
      event = verifyStripeWebhookEvent({
        rawBody,
        signatureHeader,
        webhookSecret: cfg.webhookSecret,
      });
    } catch (err: any) {
      return result(400, { error: err?.message || 'Invalid Stripe webhook signature.' });
    }

    if (typeof event?.livemode === 'boolean' && event.livemode !== isStripeLiveKey(cfg.secretKey)) {
      return result(400, { error: 'Stripe webhook mode mismatch.' });
    }

    const type = String(event?.type ?? '');
    const obj = event?.data?.object ?? {};

    if (type === 'checkout.session.completed' || type === 'checkout.session.async_payment_succeeded') {
      if (obj?.metadata?.app !== 'cloud_calendars') {
        return result(200, { received: true, ignored: true });
      }
      if (obj.payment_status === 'paid' || obj.status === 'complete') {
        await this.activateSubscriptionFromCheckout(obj);
      }
      return result(200, { received: true, type });
    }

    if (
      type === 'customer.subscription.created' ||
      type === 'customer.subscription.updated' ||
      type === 'customer.subscription.deleted'
    ) {
      const customerId = typeof obj.customer === 'string' ? obj.customer : obj.customer?.id;
      const appMeta = obj?.metadata?.app;
      const customerIndex = customerId
        ? await this.store.getJSON(this.keys.stripeCustomer(customerId))
        : null;

      if (appMeta && appMeta !== 'cloud_calendars') {
        return result(200, { received: true, ignored: true });
      }
      const principalId = obj?.metadata?.principalId ?? customerIndex?.principalId;
      if (!principalId) {
        return result(200, { received: true, ignored: true });
      }

      const principalDoc = await this.store.getJSON(this.keys.principal(principalId));
      if (!principalDoc) {
        return result(200, { received: true, ignored: true });
      }

      const lastEventCreated = Number(principalDoc?.billing?.lastEventCreated ?? 0);
      if (Number(event.created ?? 0) < lastEventCreated) {
        return result(200, { received: true, stale: true });
      }

      const interval = obj?.items?.data?.[0]?.price?.recurring?.interval;
      const plan: 'monthly' | 'yearly' =
        obj?.metadata?.plan === 'yearly' || interval === 'year'
          ? 'yearly'
          : principalDoc?.billing?.plan === 'yearly' && !interval
            ? 'yearly'
            : 'monthly';

      const status = type === 'customer.subscription.deleted' ? 'canceled' : String(obj.status ?? 'active');
      const periodEndSec = Number(
        obj.current_period_end ?? obj?.items?.data?.[0]?.current_period_end ?? 0,
      );

      const updatedDoc = {
        ...principalDoc,
        billing: {
          ...(principalDoc.billing ?? {}),
          stripeCustomerId: customerId ?? principalDoc.billing?.stripeCustomerId ?? null,
          stripeSubscriptionId: obj.id ?? principalDoc.billing?.stripeSubscriptionId ?? null,
          plan,
          status,
          cancelAtPeriodEnd: Boolean(obj.cancel_at_period_end),
          currentPeriodEnd:
            periodEndSec > 0
              ? new Date(periodEndSec * 1000).toISOString()
              : (principalDoc.billing?.currentPeriodEnd ?? null),
          lastEventCreated: Number(event.created ?? 0),
          updatedAt: new Date().toISOString(),
        },
      };

      await Promise.all([
        this.store.putJSON(this.keys.principal(principalId), updatedDoc),
        customerId
          ? this.store.putJSON(this.keys.stripeCustomer(customerId), {
              principalId,
              calId: principalDoc.calId,
            })
          : Promise.resolve(),
      ]);
      return result(200, { received: true, type });
    }

    if (type === 'invoice.payment_failed') {
      const customerId = typeof obj.customer === 'string' ? obj.customer : obj.customer?.id;
      const customerIndex = customerId
        ? await this.store.getJSON(this.keys.stripeCustomer(customerId))
        : null;
      if (!customerIndex?.principalId) {
        return result(200, { received: true, ignored: true });
      }
      const principalDoc = await this.store.getJSON(this.keys.principal(customerIndex.principalId));
      if (principalDoc?.billing) {
        await this.store.putJSON(this.keys.principal(customerIndex.principalId), {
          ...principalDoc,
          billing: {
            ...principalDoc.billing,
            status: 'past_due',
            updatedAt: new Date().toISOString(),
          },
        });
      }
      return result(200, { received: true, type });
    }

    return result(200, { received: true, ignored: true });
  }

  private async activateSubscriptionFromCheckout(session: any): Promise<void> {
    const principalId = String(session?.metadata?.principalId ?? session?.client_reference_id ?? '').trim();
    if (!principalId) return;

    const principalDoc = await this.store.getJSON(this.keys.principal(principalId));
    if (!principalDoc) return;

    const customerId =
      typeof session.customer === 'string'
        ? session.customer
        : (session.customer?.id ?? principalDoc?.billing?.stripeCustomerId ?? null);
    const subObj = typeof session.subscription === 'object' ? session.subscription : null;
    const subscriptionId =
      typeof session.subscription === 'string'
        ? session.subscription
        : (subObj?.id ?? principalDoc?.billing?.stripeSubscriptionId ?? null);

    const plan: 'monthly' | 'yearly' =
      session?.metadata?.plan === 'yearly' ? 'yearly' : 'monthly';
    const periodEndSec = Number(
      subObj?.current_period_end ?? subObj?.items?.data?.[0]?.current_period_end ?? 0,
    );
    const nowIso = new Date().toISOString();

    const updatedDoc = {
      ...principalDoc,
      billing: {
        ...(principalDoc.billing ?? {}),
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        plan,
        status: subObj?.status ? String(subObj.status) : 'active',
        cancelAtPeriodEnd: Boolean(subObj?.cancel_at_period_end),
        currentPeriodEnd:
          periodEndSec > 0
            ? new Date(periodEndSec * 1000).toISOString()
            : (principalDoc?.billing?.currentPeriodEnd ?? null),
        updatedAt: nowIso,
      },
    };

    await Promise.all([
      this.store.putJSON(this.keys.principal(principalId), updatedDoc),
      this.store.putJSON(this.keys.stripeCheckout(session.id), {
        sessionId: session.id,
        principalId,
        calId: principalDoc.calId,
        plan,
        status: 'completed',
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        completedAt: nowIso,
      }),
      customerId
        ? this.store.putJSON(this.keys.stripeCustomer(customerId), {
            principalId,
            calId: principalDoc.calId,
          })
        : Promise.resolve(),
    ]);
  }
}
