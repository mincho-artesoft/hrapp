import assert from 'node:assert/strict';
import { CoreService } from '../src/core/core.service';
import { CalendarService } from '../src/calendar/calendar.service';
import { WebPlatformService } from '../src/booking/web-platform.service';
import { keys } from '../src/store/keys';

class MemoryStore {
  readonly keys = keys;
  private readonly objects = new Map<string, { value: any; revision: number }>();
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
    return stored ? { value: structuredClone(stored.value), etag: String(stored.revision) } : null;
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
    this.objects.set(key, { value: structuredClone(value), revision: stored.revision + 1 });
    return true;
  }
  async listKeys(prefix: string): Promise<string[]> {
    return [...this.objects.keys()].filter((k) => k.startsWith(prefix)).sort();
  }
  async del(key: string): Promise<void> {
    this.objects.delete(key);
    this.feeds.delete(key);
  }
  async putFeed(key: string, ics: string): Promise<void> {
    this.feeds.set(key, ics);
  }
}

class FakeEmail {
  readonly codes: Array<{ email: string; code: string; purpose: string }> = [];
  readonly guestNotifications: any[] = [];
  readonly hostNotifications: any[] = [];

  mailConfigured(): boolean {
    return true;
  }
  async sendVerificationCodeEmail(input: any): Promise<void> {
    this.codes.push(input);
  }
  async sendBookingInviteeNotification(input: any): Promise<void> {
    this.guestNotifications.push(input);
  }
  async sendBookingHostNotification(input: any): Promise<void> {
    this.hostNotifications.push(input);
  }
}

async function main() {
  const store = new MemoryStore();
  const core = new CoreService(store as any);
  const email = new FakeEmail();
  const calSvc = new CalendarService(store as any, core, email as any);
  const svc = new WebPlatformService(store as any, core, email as any, calSvc);

  // 0. Auth Providers defaults to the approved Microsoft Entra App ID
  const authProv = await svc.getAuthProviders();
  assert.equal(authProv.status, 200);
  assert.equal(authProv.body.microsoftWebClientId, '5b1a5159-948f-4b5b-ac6a-009df927c665');

  // 1. Live Demo Showcase works out of the box
  const demoPage = await svc.getPublicBookingPage('demo');
  assert.equal(demoPage.status, 200);
  assert.equal(demoPage.body.isDemo, true);
  assert.ok(demoPage.body.meetingTypes.length >= 3);

  const demoSlots = await svc.getPublicBookingSlots('demo', {});
  assert.equal(demoSlots.status, 200);
  assert.ok(demoSlots.body.slots.length > 0, 'Demo handle should return live open slots');

  // 2. Host signs in via Email 6-digit OTP (admin email)
  const reqCode = await svc.requestEmailAuthCode({ email: 'office@arte-soft.com' });
  assert.equal(reqCode.status, 200);
  assert.equal(email.codes.length, 1);

  const verifyHost = await svc.verifyEmailAuthCode('', {
    email: 'office@arte-soft.com',
    code: email.codes[0].code,
    name: 'Mincho Milev',
    timeZone: 'Europe/Sofia',
  });
  assert.equal(verifyHost.status, 201);
  const hostToken = verifyHost.body.deviceToken;
  const hostPrincipal = await core.resolveToken(hostToken);
  assert.ok(hostPrincipal?.calId);
  const browserSession = await core.issueToken(hostPrincipal.principalId, hostPrincipal.calId);
  await svc.endWebSession(browserSession);
  assert.equal(await core.resolveToken(browserSession), null);
  assert.deepEqual(await core.resolveToken(hostToken), hostPrincipal);
  assert.equal(verifyHost.body.profile.isAdmin, true);

  // 3. Host creates an event on Web Calendar and checks CloudCalendars wire + ICS compatibility
  const nextMonday = (() => {
    const d = new Date(Date.now() + 4 * 86_400_000);
    while (d.getUTCDay() !== 1) d.setUTCDate(d.getUTCDate() + 1);
    return d.toISOString().slice(0, 10);
  })();
  // Busy event 10:00–11:00 Europe/Sofia -> let's block 09:00–10:00 UTC
  const evCreate = await svc.upsertWebCalendarEvent(hostPrincipal, 'ev_test_1', {
    title: 'Architecture Review',
    start: `${nextMonday}T09:00:00.000Z`,
    end: `${nextMonday}T10:00:00.000Z`,
    color: '#30D158',
    location: 'Sofia HQ',
    videoCallURL: 'https://meet.google.com/abc-defg-hij',
    notes: 'Check EventKit wire payload',
  });
  assert.equal(evCreate.status, 201);
  assert.equal(evCreate.body.event.details.color, '#30D158');
  assert.equal(evCreate.body.event.details.videoCallURL, 'https://meet.google.com/abc-defg-hij');

  const detailEdit = await svc.upsertWebCalendarEvent(hostPrincipal, 'ev_test_1', {
    expectedUpdatedAt: evCreate.body.event.updatedAt,
    alarms: [{relativeOffsetSeconds: -1800}], travelTime: 600,
  });
  assert.equal(detailEdit.status, 200);
  assert.equal(detailEdit.body.event.start, evCreate.body.event.start);
  assert.equal(detailEdit.body.event.end, evCreate.body.event.end);
  assert.equal(detailEdit.body.event.details.alarms[0].relativeOffset, -1800);
  assert.equal(detailEdit.body.event.details.travelTime, 600);
  assert.equal((await svc.upsertWebCalendarEvent(hostPrincipal, 'ev_test_1', {
    expectedUpdatedAt: evCreate.body.event.updatedAt, notes: 'An older open editor',
  })).status, 409);
  assert.equal((await svc.upsertWebCalendarEvent(hostPrincipal, 'ev_test_1', {end: null})).status, 400);
  assert.equal((await svc.upsertWebCalendarEvent(hostPrincipal, 'no_dates', {title: 'No interval'})).status, 400);

  // Verify owner's .ics feed contains X-CLOUD-CALENDARS-METADATA with base64 lossless JSON!
  const ownerIcs = await store.getText(`f/${verifyHost.body.feedId}.ics`);
  assert.ok(ownerIcs && ownerIcs.includes('X-CLOUD-CALENDARS-METADATA:'), 'Owner ICS must carry CloudCalendars metadata');

  // 4. Host configures Booking Page with email verification enabled
  const saveCfg = await svc.saveBookingConfig(hostPrincipal, {
    enabled: true,
    handle: 'mincho-studio',
    displayName: 'Mincho Studio',
    headline: '1-on-1 Product & Engineering Sync',
    timeZone: 'UTC',
    slotIntervalMinutes: 30,
    minNoticeMinutes: 0,
    requireEmailVerification: true,
    weekly: {
      '0': [],
      '1': [{ start: 540, end: 780 }], // Monday 09:00..13:00 UTC
      '2': [{ start: 540, end: 780 }],
      '3': [{ start: 540, end: 780 }],
      '4': [{ start: 540, end: 780 }],
      '5': [{ start: 540, end: 780 }],
      '6': [],
    },
    meetingTypes: [
      {
        id: 'mt_30',
        slug: 'sync-30',
        name: '30m Sync',
        durationMinutes: 30,
        color: '#0A84FF',
        bufferBeforeMinutes: 0,
        bufferAfterMinutes: 0,
        locationKind: 'google_meet',
        locationValue: 'https://meet.google.com/xyz-uvwx-rst',
        description: '30 minute sync',
        active: true,
      },
    ],
  });
  assert.equal(saveCfg.status, 200);

  // 5. Public slots exclude 09:00–10:00 UTC (blocked by Architecture Review!)
  const slotsRes = await svc.getPublicBookingSlots('mincho-studio', {
    type: 'mt_30',
    from: nextMonday,
    to: nextMonday,
  });
  assert.equal(slotsRes.status, 200);
  const slotStarts = slotsRes.body.slots.map((s: any) => s.start);
  assert.ok(!slotStarts.includes(`${nextMonday}T09:00:00.000Z`), 'Busy event must block 09:00');
  assert.ok(!slotStarts.includes(`${nextMonday}T09:30:00.000Z`), 'Busy event must block 09:30');
  assert.ok(slotStarts.includes(`${nextMonday}T10:00:00.000Z`), '10:00 must be open');
  assert.ok(slotStarts.includes(`${nextMonday}T10:30:00.000Z`), '10:30 must be open');

  // 6. Guest books 10:00–10:30 with 6-digit verification, while racing guest gets 409
  const unverifiedAttempt = await svc.createPublicBooking('', 'mincho-studio', {
    typeId: 'mt_30',
    start: `${nextMonday}T10:00:00.000Z`,
    name: 'Elena Petrova',
    email: 'elena@example.com',
    timeZone: 'Europe/Sofia',
  });
  assert.equal(unverifiedAttempt.status, 401);
  assert.equal(unverifiedAttempt.body.code, 'verification_required');

  await svc.requestBookingVerificationCode('mincho-studio', { email: 'elena@example.com' });
  const elenaCode = email.codes[email.codes.length - 1].code;

  const booked = await svc.createPublicBooking('', 'mincho-studio', {
    typeId: 'mt_30',
    start: `${nextMonday}T10:00:00.000Z`,
    name: 'Elena Petrova',
    email: 'elena@example.com',
    timeZone: 'Europe/Sofia',
    notes: 'Excited to chat!',
    verificationCode: elenaCode,
  });
  assert.equal(booked.status, 201);
  assert.ok(booked.body.manageToken);
  assert.equal(booked.body.host.displayName, 'Mincho Studio');
  assert.ok(booked.body.icsContent.includes('X-CLOUD-CALENDARS-METADATA:'));

  // Host drags booked meeting on Web Calendar by +15 minutes (10:00 -> 10:15, self-overlapping!)
  const dragged = await svc.upsertWebCalendarEvent(hostPrincipal, booked.body.event.id, {
    start: `${nextMonday}T10:15:00.000Z`,
    end: `${nextMonday}T10:45:00.000Z`,
  });
  assert.equal(dragged.status, 200);
  assert.equal(dragged.body.notifiedGuest, true);
  assert.equal(dragged.body.event.sequence, 1);

  // Guest signs into Guest Portal & sees the moved booking at 10:15!
  await svc.requestEmailAuthCode({ email: 'elena@example.com' });
  const guestLoginCode = email.codes[email.codes.length - 1].code;
  const guestSession = await svc.verifyEmailAuthCode('', {
    email: 'elena@example.com',
    code: guestLoginCode,
  });
  const guestPrincipal = await core.resolveToken(guestSession.body.deviceToken);

  const guestList = await svc.listAuthenticatedGuestBookings(guestPrincipal);
  assert.equal(guestList.status, 200);
  assert.equal(guestList.body.bookings.length, 1);
  assert.equal(guestList.body.bookings[0].start, `${nextMonday}T10:15:00.000Z`);

  // Non-admin gets 403 on Admin Console, Admin gets 200
  const deniedAdmin = await svc.getAdminOverview(guestPrincipal);
  assert.equal(deniedAdmin.status, 403);

  const okAdmin = await svc.getAdminOverview(hostPrincipal);
  assert.equal(okAdmin.status, 200);
  assert.equal(okAdmin.body.kpis.totalHosts, 1);
  assert.equal(okAdmin.body.kpis.totalBookings, 1);

  // Guest reschedules to 11:00 and then cancels via manage token
  const resched = await svc.guestRescheduleByToken(booked.body.manageToken, {
    start: `${nextMonday}T11:00:00.000Z`,
    reason: 'Running 45m late',
  });
  assert.equal(resched.status, 200);
  assert.equal(resched.body.booking.start, `${nextMonday}T11:00:00.000Z`);

  const cancelled = await svc.guestCancelByToken(booked.body.manageToken, {
    reason: 'Conflict came up',
  });
  assert.equal(cancelled.status, 200);
  assert.equal(cancelled.body.booking.status, 'cancelled');

  // ── Expiring Public Invite Links + Smart Guest Auth vs Email Confirmation ──
  const createdInvite = await svc.createBookingInviteLink(hostPrincipal, {
    label: 'Single-Use VIP Demo',
    expiresInHours: 48,
    maxUses: 1,
  });
  assert.equal(createdInvite.status, 201);
  const invTok = createdInvite.body.link.token;
  assert.ok(invTok.startsWith('inv_'));

  const invPage = await svc.getPublicBookingPage(invTok);
  assert.equal(invPage.status, 200);
  assert.equal(invPage.body.inviteLink.maxUses, 1);

  // Unauthenticated guest MUST verify via email confirmation code
  const unauthTry = await svc.createPublicBooking('', invTok, {
    typeId: 'mt_30',
    start: `${nextMonday}T11:00:00.000Z`,
    name: 'Elena Guest',
    email: 'elena@example.com',
    timeZone: 'Europe/Sofia',
  });
  assert.equal(unauthTry.status, 401);
  assert.equal(unauthTry.body.code, 'verification_required');

  const codesBefore = email.codes.length;
  await svc.requestBookingVerificationCode(invTok, { email: 'elena@example.com' });
  assert.equal(email.codes.length, codesBefore + 1);
  const inviteOtpCode = email.codes[email.codes.length - 1].code;

  const confirmedViaOtp = await svc.createPublicBooking('', invTok, {
    typeId: 'mt_30',
    start: `${nextMonday}T11:00:00.000Z`,
    name: 'Elena Guest',
    email: 'elena@example.com',
    timeZone: 'Europe/Sofia',
    verificationCode: inviteOtpCode,
  });
  assert.equal(confirmedViaOtp.status, 201);

  // Single-use link is now exhausted -> returns 410 invite_expired!
  const exhaustedCheck = await svc.getPublicBookingPage(invTok);
  assert.equal(exhaustedCheck.status, 410);
  assert.equal(exhaustedCheck.body.code, 'invite_expired');

  // Authenticated guest (e.g. signed in with Google/Microsoft/verified session) books in 1 click WITHOUT OTP
  // AND automatically gets the booked event linked directly onto their own CloudCalendars calendar!
  const multiInvite = await svc.createBookingInviteLink(hostPrincipal, {
    label: 'Team 7-Day Link',
    expiresInHours: 168,
    maxUses: 0,
  });
  const invTok2 = multiInvite.body.link.token;
  const guestBearer = `Bearer ${guestSession.body.deviceToken}`;
  const oneClickSignedInBook = await svc.createPublicBooking(guestBearer, invTok2, {
    typeId: 'mt_30',
    start: `${nextMonday}T11:30:00.000Z`,
    name: 'Elena Petrova',
    email: 'elena@example.com',
    timeZone: 'America/New_York',
  });
  assert.equal(oneClickSignedInBook.status, 201);

  const guestCalState = await svc.getWebCalendarState(guestPrincipal, {});
  assert.equal(guestCalState.status, 200);
  assert.ok(
    guestCalState.body.receivedEvents.some((ev: any) => ev.id === oneClickSignedInBook.body.event.id),
    'Booked event should automatically appear on the signed-in guest’s own CloudCalendars calendar!',
  );

  // Revoke invite link -> returns 410
  await svc.revokeBookingInviteLink(hostPrincipal, invTok2);
  const revokedCheck = await svc.getPublicBookingPage(invTok2);
  assert.equal(revokedCheck.status, 410);

  console.log('✓ ALL WEB PLATFORM, DRAG-DROP SYNC, EXPIRING INVITES & ADMIN TESTS PASSED!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
