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
  mailConfigured(): boolean {
    return true;
  }
  async sendVerificationCodeEmail(input: any): Promise<void> {
    this.codes.push(input);
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

  const moved = await svc.upsertWebCalendarEvent(hostPrincipal, 'ev_test_1', {
    start: `${nextMonday}T09:15:00.000Z`, end: `${nextMonday}T10:15:00.000Z`,
  });
  assert.equal(moved.status, 200);
  assert.equal(moved.body.event.details.travelTime, 600);
  assert.equal((await svc.deleteWebCalendarEvent(hostPrincipal, 'ev_test_1')).status, 200);

  await svc.requestEmailAuthCode({ email: 'elena@example.com' });
  const guestLoginCode = email.codes[email.codes.length - 1].code;
  const guestSession = await svc.verifyEmailAuthCode('', {
    email: 'elena@example.com',
    code: guestLoginCode,
  });
  const guestPrincipal = await core.resolveToken(guestSession.body.deviceToken);

  // Non-admin gets 403 on Admin Console, Admin gets 200
  const deniedAdmin = await svc.getAdminOverview(guestPrincipal);
  assert.equal(deniedAdmin.status, 403);

  const okAdmin = await svc.getAdminOverview(hostPrincipal);
  assert.equal(okAdmin.status, 200);
  console.log('PASS web authentication, event edits, ICS feed and admin access');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
