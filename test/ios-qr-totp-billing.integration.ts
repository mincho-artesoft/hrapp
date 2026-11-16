import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { CalendarService } from '../src/calendar/calendar.service';
import { CoreService } from '../src/core/core.service';
import { WebPlatformService } from '../src/booking/web-platform.service';
import { keys } from '../src/store/keys';
import { computeTotpCode } from '../src/util/totp';

type JsonValue = Record<string, any>;

class MemoryStore {
  readonly keys = keys;
  private readonly objects = new Map<string, { value: JsonValue; revision: number }>();
  private readonly feeds = new Map<string, string>();

  async getJSON(key: string): Promise<any> {
    const stored = this.objects.get(key);
    return stored ? structuredClone(stored.value) : null;
  }

  async getText(key: string): Promise<string | null> {
    return this.feeds.get(key) ?? null;
  }

  async getJSONWithETag(key: string): Promise<{ value: any; etag: string } | null> {
    const stored = this.objects.get(key);
    return stored
      ? { value: structuredClone(stored.value), etag: String(stored.revision) }
      : null;
  }

  async putJSON(key: string, value: any): Promise<void> {
    const revision = (this.objects.get(key)?.revision ?? 0) + 1;
    this.objects.set(key, { value: structuredClone(value), revision });
  }

  async putJSONIfAbsent(key: string, value: any): Promise<boolean> {
    if (this.objects.has(key)) return false;
    this.objects.set(key, { value: structuredClone(value), revision: 1 });
    return true;
  }

  async putJSONIfMatch(key: string, value: any, etag: string): Promise<boolean> {
    const stored = this.objects.get(key);
    if (!stored || String(stored.revision) !== etag) return false;
    this.objects.set(key, {
      value: structuredClone(value),
      revision: stored.revision + 1,
    });
    return true;
  }

  async listKeys(prefix: string): Promise<string[]> {
    return [...this.objects.keys()].filter((key) => key.startsWith(prefix)).sort();
  }

  async del(key: string): Promise<void> {
    this.objects.delete(key);
    this.feeds.delete(key);
  }

  async putFeed(key: string, value: string): Promise<void> {
    this.feeds.set(key, value);
  }
}

class FakeEmailService {
  readonly codes: Array<{ email: string; code: string }> = [];
  async sendVerificationCodeEmail(v: any): Promise<void> {
    this.codes.push({ email: v.email, code: v.code });
  }
  async sendBookingInviteeNotification(): Promise<void> {}
  async sendSharedEventInvitation(): Promise<void> {}
  async sendSharedCalendarInvitation(): Promise<void> {}
  sharedEventIconPng(): Buffer { return Buffer.from('icon'); }
  async sharedEventQRCodePng(): Promise<Buffer> { return Buffer.from('qr'); }
}

function expectStatus(actual: { status: number; body: any }, expected: number, label: string): any {
  assert.equal(
    actual.status,
    expected,
    `${label}: expected HTTP ${expected}, got ${actual.status}: ${JSON.stringify(actual.body)}`,
  );
  return actual.body;
}

function signStripeWebhook(payloadObj: any, secret: string): { rawBody: string; sig: string } {
  const rawBody = JSON.stringify(payloadObj);
  const ts = Math.floor(Date.now() / 1000);
  const digest = createHmac('sha256', secret).update(`${ts}.${rawBody}`, 'utf8').digest('hex');
  return { rawBody, sig: `t=${ts},v1=${digest}` };
}

async function main() {
  process.env.STRIPE_SECRET_KEY = 'sk_test_mock_cloud_calendars';
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_cloud_calendars_secret';

  const store = new MemoryStore();
  const core = new CoreService(store as any);
  const email = new FakeEmailService();
  const calendarService = new CalendarService(store as any, core, email as any, { enqueue: async () => {} } as any);
  const webSvc = new WebPlatformService(store as any, core, email as any, calendarService);

  // 1. Web-only user signs in via Email OTP -> NOT entitled to Web Studio mutations yet!
  expectStatus(await webSvc.requestEmailAuthCode({ email: 'webonly@example.com' }), 200, 'request otp');
  const otpCode = email.codes[0]!.code;
  const webLogin = expectStatus(
    await webSvc.verifyEmailAuthCode('', {
      email: 'webonly@example.com',
      code: otpCode,
      name: 'Web User',
      timeZone: 'Europe/Sofia',
    }),
    201,
    'verify email otp',
  );
  assert.equal(webLogin.profile.webAccess.entitled, false, 'new web-only user must not be entitled');
  assert.equal(webLogin.profile.webAccess.pricing.monthlyUsd, 1.99);
  assert.equal(webLogin.profile.webAccess.pricing.yearlyUsd, 19.99);

  const webPrincipal = { principalId: webLogin.ownerId, calId: webLogin.calendarId };

  // Unentitled Web Studio mutations return HTTP 402 subscription_required
  const blockedEvent = expectStatus(
    await webSvc.upsertWebCalendarEvent(webPrincipal, 'evt_test_1', {
      title: 'Blocked Event',
      start: '2026-12-01T10:00:00.000Z',
      end: '2026-12-01T11:00:00.000Z',
    }),
    402,
    'unentitled event create blocked',
  );
  assert.equal(blockedEvent.code, 'subscription_required');

  const blockedBooking = expectStatus(
    await webSvc.saveBookingConfig(webPrincipal, { handle: 'webonly-host' }),
    402,
    'unentitled booking config blocked',
  );
  assert.equal(blockedBooking.code, 'subscription_required');

  // 2. Stripe Webhook activates $1.99/mo Web Studio subscription (and ignores other apps on shared Stripe account)
  const ignoredEvent = signStripeWebhook(
    {
      id: 'evt_other_app',
      type: 'checkout.session.completed',
      livemode: false,
      created: Math.floor(Date.now() / 1000),
      data: {
        object: {
          id: 'cs_other',
          payment_status: 'paid',
          status: 'complete',
          metadata: { app: 'artebook', userId: 'someone' },
        },
      },
    },
    process.env.STRIPE_WEBHOOK_SECRET!,
  );
  const ignoredRes = expectStatus(
    await webSvc.handleStripeWebhook(ignoredEvent.rawBody, ignoredEvent.sig),
    200,
    'shared stripe account other-app webhook ignored',
  );
  assert.equal(ignoredRes.ignored, true);

  const subCompleted = signStripeWebhook(
    {
      id: 'evt_cc_1',
      type: 'checkout.session.completed',
      livemode: false,
      created: Math.floor(Date.now() / 1000),
      data: {
        object: {
          id: 'cs_test_cc_1',
          customer: 'cus_test_webonly',
          subscription: 'sub_test_webonly',
          payment_status: 'paid',
          status: 'complete',
          metadata: {
            app: 'cloud_calendars',
            principalId: webPrincipal.principalId,
            calId: webPrincipal.calId,
            plan: 'monthly',
          },
        },
      },
    },
    process.env.STRIPE_WEBHOOK_SECRET!,
  );
  expectStatus(
    await webSvc.handleStripeWebhook(subCompleted.rawBody, subCompleted.sig),
    200,
    'stripe checkout webhook',
  );

  // Now webPrincipal IS entitled via stripe_monthly!
  const allowedAfterStripe = expectStatus(
    await webSvc.upsertWebCalendarEvent(webPrincipal, 'evt_test_1', {
      title: 'Subscribed Event',
      start: '2026-12-01T10:00:00.000Z',
      end: '2026-12-01T11:00:00.000Z',
    }),
    201,
    'subscribed user can create event',
  );
  assert.equal(allowedAfterStripe.event.title, 'Subscribed Event');

  // If subscription is later cancelled, access reverts to unentitled (unless iOS unlocked)
  const subDeleted = signStripeWebhook(
    {
      id: 'evt_cc_2',
      type: 'customer.subscription.deleted',
      livemode: false,
      created: Math.floor(Date.now() / 1000) + 10,
      data: {
        object: {
          id: 'sub_test_webonly',
          customer: 'cus_test_webonly',
          status: 'canceled',
          metadata: {
            app: 'cloud_calendars',
            principalId: webPrincipal.principalId,
            plan: 'monthly',
          },
        },
      },
    },
    process.env.STRIPE_WEBHOOK_SECRET!,
  );
  expectStatus(await webSvc.handleStripeWebhook(subDeleted.rawBody, subDeleted.sig), 200, 'stripe sub deleted');
  const afterCancelProfile = expectStatus(await webSvc.getProfile(webPrincipal), 200, 'profile after cancel');
  assert.equal(afterCancelProfile.webAccess.entitled, false);

  // 3. iOS App User: QR Code Scan -> Instant Web Login + Permanent Free Unlock + TOTP 6-digit Authenticator
  expectStatus(await webSvc.requestEmailAuthCode({ email: 'iosuser@example.com' }), 200, 'ios user seed');
  const iosSeedOtp = email.codes[1]!.code;
  const iosSeed = expectStatus(
    await webSvc.verifyEmailAuthCode('', {
      email: 'iosuser@example.com',
      code: iosSeedOtp,
      name: 'iOS User',
    }),
    201,
    'seed ios user account',
  );
  const iosPrincipal = { principalId: iosSeed.ownerId, calId: iosSeed.calendarId };

  // Browser starts QR login challenge
  const qrStart = expectStatus(await webSvc.startIosQrChallenge(''), 200, 'start qr');
  assert.ok(qrStart.qrUrl.includes(`/app-auth/?c=${qrStart.challengeId}`));

  // Poll while pending
  const pendingPoll = expectStatus(
    await webSvc.pollIosQrChallenge({ challengeId: qrStart.challengeId, pollToken: qrStart.pollToken }),
    200,
    'poll pending',
  );
  assert.equal(pendingPoll.status, 'pending');

  // iOS app inspects & approves QR challenge
  const qrInfo = expectStatus(
    await webSvc.getIosQrChallengeInfo(iosPrincipal, qrStart.challengeId),
    200,
    'ios qr info',
  );
  assert.equal(qrInfo.status, 'pending');
  assert.equal(qrInfo.iosEmail, 'iosuser@example.com');

  const qrApprove = expectStatus(
    await webSvc.approveIosQrChallenge(iosPrincipal, { challengeId: qrStart.challengeId }),
    200,
    'ios qr approve',
  );
  assert.equal(qrApprove.approved, true);
  assert.equal(qrApprove.iosUnlocked, true);
  assert.ok(qrApprove.totpSecret.length >= 32, '32-char Base32 TOTP secret returned');

  // Browser polls and gets instant logged-in session + permanent ios_app unlock!
  const approvedPoll = expectStatus(
    await webSvc.pollIosQrChallenge({ challengeId: qrStart.challengeId, pollToken: qrStart.pollToken }),
    200,
    'poll approved',
  );
  assert.equal(approvedPoll.status, 'approved');
  assert.ok(approvedPoll.deviceToken);
  assert.equal(approvedPoll.profile.webAccess.entitled, true);
  assert.equal(approvedPoll.profile.webAccess.accessSource, 'ios_app');
  assert.equal(approvedPoll.profile.webAccess.iosUnlocked, true);

  // Second poll on same challenge cannot replay the token
  const replayPoll = expectStatus(
    await webSvc.pollIosQrChallenge({ challengeId: qrStart.challengeId, pollToken: qrStart.pollToken }),
    200,
    'replay poll consumed',
  );
  assert.equal(replayPoll.status, 'expired');

  // iOS-unlocked user creates events & saves booking config for FREE forever!
  expectStatus(
    await webSvc.upsertWebCalendarEvent(iosPrincipal, 'evt_ios_free_1', {
      title: 'Free Forever via iOS',
      start: '2026-12-02T14:00:00.000Z',
      end: '2026-12-02T15:00:00.000Z',
    }),
    201,
    'ios-unlocked user creates event for free',
  );

  // 4. Backup 6-digit TOTP Web Authenticator Login (RFC 6238) + Replay Guard
  const liveTotp = computeTotpCode(qrApprove.totpSecret);
  assert.match(liveTotp.code, /^\d{6}$/);

  // Wrong code fails
  expectStatus(
    await webSvc.verifyTotpLogin('', { email: 'iosuser@example.com', code: '000000' }),
    401,
    'wrong totp rejected',
  );

  // Live 6-digit TOTP code logs in immediately!
  const totpLogin = expectStatus(
    await webSvc.verifyTotpLogin('', { email: 'iosuser@example.com', code: liveTotp.code }),
    200,
    'valid totp login',
  );
  assert.equal(totpLogin.provider, 'ios_totp');
  assert.equal(totpLogin.profile.webAccess.entitled, true);

  // Replaying the exact same 30s TOTP code is blocked!
  expectStatus(
    await webSvc.verifyTotpLogin('', { email: 'iosuser@example.com', code: liveTotp.code }),
    401,
    'totp replay within same 30s window rejected',
  );

  // 5. Two-Way Personal Cloud Calendar Sync (`POST /ios/personal-calendar/sync`)
  // Pulls Web Studio event (`evt_ios_free_1`) down to iPhone AND pushes new iPhone event up to Web Studio!
  const iosSync1 = expectStatus(
    await webSvc.syncIosPersonalCalendar(iosPrincipal, {
      calendarMeta: { name: 'Cloud Calendars Personal', color: '#0A84FF', timeZone: 'Europe/Sofia' },
      upserts: [
        {
          id: 'evt_from_iphone_1',
          title: 'Created on iPhone Personal Cloud Calendar',
          start: '2026-12-03T09:00:00.000Z',
          end: '2026-12-03T10:30:00.000Z',
          allDay: false,
          location: 'Sofia Tech Park',
          details: {
            notes: 'Synced two-way with Web Studio',
            timeZone: 'Europe/Sofia',
            travelTime: 900,
          },
        },
      ],
      deletions: [],
    }),
    200,
    'ios personal calendar two-way sync',
  );
  assert.equal(iosSync1.appliedUpserts, 1);
  assert.equal(iosSync1.calendar.name, 'Cloud Calendars Personal');
  assert.equal(iosSync1.events.length, 2, 'Both Web Studio event and iPhone event returned');
  assert.ok(iosSync1.events.some((e: any) => e.id === 'evt_ios_free_1'));
  assert.ok(iosSync1.events.some((e: any) => e.id === 'evt_from_iphone_1' && e.details?.travelTime === 900));

  // Verify Web Studio immediately sees the iPhone event in GET /web/calendar/state!
  const webStateAfterIosSync = expectStatus(
    await webSvc.getWebCalendarState(iosPrincipal, {}),
    200,
    'web studio sees iPhone event',
  );
  assert.equal(webStateAfterIosSync.events.length, 2);
  assert.ok(webStateAfterIosSync.events.some((e: any) => e.id === 'evt_from_iphone_1'));

  // Deleting an event on iPhone removes it from Web Studio too!
  const iosSyncDelete = expectStatus(
    await webSvc.syncIosPersonalCalendar(iosPrincipal, {
      upserts: [],
      deletions: ['evt_ios_free_1'],
    }),
    200,
    'ios personal calendar delete sync',
  );
  assert.equal(iosSyncDelete.appliedDeletions, 1);
  assert.equal(iosSyncDelete.events.length, 1);
  assert.equal(iosSyncDelete.events[0].id, 'evt_from_iphone_1');

  console.log('ALL iOS QR, TOTP, Two-Way Personal Cloud Sync & Stripe Billing integration assertions PASSED!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
