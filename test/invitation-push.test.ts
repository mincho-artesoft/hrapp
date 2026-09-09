import 'reflect-metadata';
import assert from 'node:assert/strict';
import { generateKeyPairSync, randomUUID, verify } from 'node:crypto';
import { PushService } from '../src/push/push.service';
import { APNsService } from '../src/push/apns.service';
import { keys } from '../src/store/keys';
import { hashKey } from '../src/util/ids';

class MemoryStore {
  readonly keys = keys;
  objects = new Map<string, any>();
  revisions = new Map<string, number>();
  async getJSON(key: string) { return structuredClone(this.objects.get(key) ?? null); }
  async getJSONWithETag(key: string) {
    const value = await this.getJSON(key);
    return value ? { value, etag: String(this.revisions.get(key)) } : null;
  }
  async putJSON(key: string, value: any) { this.objects.set(key, structuredClone(value)); this.revisions.set(key, (this.revisions.get(key) ?? 0) + 1); }
  async putJSONIfAbsent(key: string, value: any) { if (this.objects.has(key)) return false; await this.putJSON(key, value); return true; }
  async putJSONIfMatch(key: string, value: any, etag: string) { if (String(this.revisions.get(key)) !== etag) return false; await this.putJSON(key, value); return true; }
  async listKeys(prefix: string) { return [...this.objects.keys()].filter((k) => k.startsWith(prefix)); }
  async del(key: string) { this.objects.delete(key); }
}

async function run() {
  process.env.PUSH_QUEUE_URL = 'https://sqs.us-east-1.amazonaws.com/123456789012/test';
  process.env.APNS_ALLOWED_ENVIRONMENTS = 'sandbox';
  const store = new MemoryStore();
  const sent: any[] = [];
  let apnsStatus = { status: 200, reason: undefined as string | undefined };
  const apns = { configured: true, async send(device: any, payload: any, collapse: string) {
    sent.push({ device, payload, collapse }); return apnsStatus;
  } };
  const service = new PushService(store as any, apns as any);
  const queued: any[] = [];
  (service as any).sqs.send = async (command: any) => { queued.push(JSON.parse(command.input.MessageBody)); };
  const principal = { principalId: 'receiver' };
  const other = { principalId: 'other' };
  const email = 'recipient@example.com';
  await store.putJSON(keys.principal('receiver'), { identities: { google: { email } } });
  await store.putJSON(keys.principal('other'), { identities: { apple: { email: 'other@example.com' } } });
  await store.putJSON(keys.accountEmail(hashKey(email)), { principalId: 'receiver' });
  const id = randomUUID();
  let registration = { secret: 'a'.repeat(64), token: 'b'.repeat(64), environment: 'sandbox', enabled: true, revision: 1 };
  assert.equal((await service.register({ principalId: 'anonymous' }, id, registration)).status, 403);
  assert.equal((await service.register(principal, '../../bad', registration)).status, 400);
  assert.equal((await service.register(principal, id, { ...registration, environment: 'production' })).status, 400);
  assert.equal((await service.register(principal, id, registration)).body.remoteInvitations, true);
  assert.equal((await service.register(principal, id, registration)).status, 409);
  assert.equal((await service.register(other, id, { ...registration, secret: 'c'.repeat(64), revision: 2 })).status, 403);
  console.log('PASS registration: verified account, validation, environment isolation, capability, stale revisions');

  const recipient = { invitedEmail: email, emails: [email], access: 'reader' };
  const event = { title: 'Original title دبي', end: new Date(Date.now() + 86400_000).toISOString(), recipients: [recipient] };
  await store.putJSON(keys.event('sender-cal', 'event'), event);
  await store.putJSON(keys.pendingEventInvitation(hashKey(email), 'sender-cal', 'event'), { senderName: 'Sender' });
  await service.enqueue('event', email, 'sender-cal', 'event');
  assert.equal(queued.length, 1);
  assert.equal(queued[0].email, undefined);
  for (const access of ['reader', 'writer', 'owner']) {
    await store.putJSON(keys.event('sender-cal', 'event'), { ...event, recipients: [{ ...recipient, access }] });
    const job = { ...queued[0], id: randomUUID() };
    await service.dispatch(job);
    const alert = sent.at(-1).payload;
    assert.equal(alert.pendingEventInvitationID, hashKey('sender-cal:event'));
    assert.equal(alert.aps.alert['title-loc-key'], 'New event invitation');
    assert.deepEqual(alert.aps.alert['loc-args'], ['Sender', 'Original title دبي']);
    assert.equal(alert.aps.sound, 'default');
    const before = sent.length;
    await service.dispatch(job);
    assert.equal(sent.length, before, 'queue replay must not resend to successful devices');
  }
  console.log('PASS event invitations: all three rights, routing ID, original content, localized alert, retry deduplication');
  for (const access of ['reader', 'writer', 'owner']) {
    for (const end of [new Date(0).toISOString(), new Date().toISOString()]) {
      await store.putJSON(keys.event('sender-cal', 'event'), { ...event, end, recipients: [{ ...recipient, access }] });
      const before = sent.length;
      const job = { ...queued[0], id: randomUUID() };
      await service.dispatch(job);
      assert.equal(sent.length, before + 1, 'a fresh invitation must notify even when the event has ended');
      assert.equal(sent.at(-1).payload.pendingEventInvitationID, hashKey('sender-cal:event'));
      await service.dispatch(job);
      assert.equal(sent.length, before + 1, 'past-event invitations still deduplicate queue retries');
    }
  }
  console.log('PASS past event invitations: all rights, historical and just-ended dates, retry deduplication');
  const beforeSkips = sent.length;
  await store.putJSON(keys.event('sender-cal', 'event'), { ...event, status: 'cancelled' });
  await service.dispatch({ ...queued[0], id: randomUUID() });
  await store.putJSON(keys.event('sender-cal', 'event'), { ...event, recipients: [] });
  await service.dispatch({ ...queued[0], id: randomUUID() });
  await store.putJSON(keys.event('sender-cal', 'event'), { ...event, recipients: [{ ...recipient, userId: 'receiver' }] });
  await service.dispatch({ ...queued[0], id: randomUUID() });
  await store.putJSON(keys.event('sender-cal', 'event'), { ...event, end: 'invalid date' });
  await service.dispatch({ ...queued[0], id: randomUUID() });
  await store.putJSON(keys.event('sender-cal', 'event'), event);
  await service.dispatch({ ...queued[0], id: randomUUID(), createdAt: Date.now() - 2 * 86400_000 });
  await store.del(keys.pendingEventInvitation(hashKey(email), 'sender-cal', 'event'));
  await service.dispatch({ ...queued[0], id: randomUUID() });
  assert.equal(sent.length, beforeSkips);
  console.log('PASS stale invitations: no cancelled, removed, accepted, invalid-date or missing-index alerts; old queue jobs still expire');

  await store.putJSON(keys.principal('owner'), { identities: { google: { email: 'sender@example.com' } } });
  for (const calendarKind of ['app_local', 'eventkit']) {
    for (const access of ['reader', 'writer', 'owner']) {
      await store.putJSON(keys.icloudCalendarSharing('owner', 'calendar'), {
        title: 'Calendar', calendarKind, recipients: [{ email, access, isPending: true }],
      });
      await store.putJSON(keys.pendingICloudCalendarInvitation(hashKey(email), 'owner', 'calendar'), { isPending: true });
      await service.enqueue('calendar', email, 'owner', 'calendar');
      await service.dispatch(queued.at(-1));
      assert.equal(sent.at(-1).payload.pendingCalendarInvitationID, hashKey('owner:calendar'));
      assert.equal(sent.at(-1).payload.aps.alert['title-loc-key'], 'New calendar invitation');
    }
  }
  console.log('PASS local/native calendar invitations: all three rights, same routing as Pending invitations');

  const calendarJob = { ...queued.at(-1), id: randomUUID() };
  apnsStatus = { status: 503, reason: 'ServiceUnavailable' };
  await assert.rejects(() => service.dispatch(calendarJob));
  apnsStatus = { status: 200, reason: undefined };
  await service.dispatch(calendarJob);
  apnsStatus = { status: 410, reason: 'Unregistered' };
  await service.dispatch({ ...calendarJob, id: randomUUID() });
  assert.equal((await store.getJSON(`push/devices/${id}.json`)).enabled, false);
  console.log('PASS transient failures retry; invalid APNs tokens are disabled');

  registration = { ...registration, revision: 2 };
  await service.register(principal, id, registration);
  apnsStatus = { status: 200, reason: undefined };
  const beforeDisabled = sent.length;
  await service.register(principal, id, { ...registration, revision: 3, enabled: false });
  await service.dispatch({ ...calendarJob, id: randomUUID() });
  assert.equal(sent.length, beforeDisabled);
  await service.register(other, id, { ...registration, revision: 4 });
  // Simulate an old principal index surviving an interrupted cleanup.
  await store.putJSON(`principal/receiver/push-devices/${id}.json`, { installationId: id });
  await service.dispatch({ ...calendarJob, id: randomUUID() });
  assert.equal(sent.length, beforeDisabled, 'old account must not send to reassigned installation');
  console.log('PASS disabled notifications, sign-out tombstones and account-switch privacy');

  // One account on a phone and tablet: registration, delivery, retries and
  // sign-out are independent per installation, never a single account token.
  const multiStore = new MemoryStore();
  const deliveredIDs: string[] = [];
  const multiService = new PushService(multiStore as any, {
    configured: true,
    async send(device: any) { deliveredIDs.push(device.installationId); return { status: 200 }; },
  } as any);
  await multiStore.putJSON(keys.principal('receiver'), { identities: { google: { email } } });
  await multiStore.putJSON(keys.accountEmail(hashKey(email)), { principalId: 'receiver' });
  await multiStore.putJSON(keys.event('sender-cal', 'event'), event);
  await multiStore.putJSON(keys.pendingEventInvitation(hashKey(email), 'sender-cal', 'event'), { senderName: 'Sender' });
  const phone = randomUUID(), tablet = randomUUID();
  const phoneRegistration = { secret: '1'.repeat(64), token: '2'.repeat(64), environment: 'sandbox', enabled: true, revision: 1 };
  const tabletRegistration = { secret: '3'.repeat(64), token: '4'.repeat(64), environment: 'sandbox', enabled: true, revision: 1 };
  assert.equal((await multiService.register(principal, phone, phoneRegistration)).status, 200);
  assert.equal((await multiService.register(principal, tablet, tabletRegistration)).status, 200);
  assert.equal((await multiStore.listKeys('principal/receiver/push-devices/')).length, 2);
  assert.equal((await multiStore.getJSON(`push/devices/${phone}.json`)).token, phoneRegistration.token);
  const bothJob = { ...queued[0], id: randomUUID() };
  await multiService.dispatch(bothJob);
  assert.deepEqual(deliveredIDs.slice().sort(), [phone, tablet].sort());
  await multiService.dispatch(bothJob);
  assert.equal(deliveredIDs.length, 2, 'retry is deduplicated separately on both devices');
  await multiService.register(principal, phone, { ...phoneRegistration, enabled: false, revision: 2 });
  await multiService.dispatch({ ...bothJob, id: randomUUID() });
  assert.deepEqual(deliveredIDs.slice(2), [tablet], 'phone sign-out must leave tablet notifications enabled');
  await multiService.register(principal, phone, { ...phoneRegistration, token: '5'.repeat(64), revision: 3 });
  assert.equal((await multiStore.getJSON(`push/devices/${tablet}.json`)).token, tabletRegistration.token);
  await multiService.dispatch({ ...bothJob, id: randomUUID() });
  assert.deepEqual(deliveredIDs.slice(3).sort(), [phone, tablet].sort());
  console.log('PASS multi-device account: separate S3 records, fan-out, per-device deduplication, independent sign-out and token refresh');

  const transport = new APNsService();
  const key = generateKeyPairSync('ec', { namedCurve: 'prime256v1' });
  process.env.APNS_KEY_ID = 'TEST123456';
  process.env.APNS_TEAM_ID = 'TEAM123456';
  process.env.APNS_PRIVATE_KEY = String(key.privateKey.export({ format: 'pem', type: 'pkcs8' }));
  const jwt = await (transport as any).authorization();
  const [header, claims, signature] = jwt.split('.');
  assert.equal(JSON.parse(Buffer.from(header, 'base64url').toString()).alg, 'ES256');
  assert.equal(JSON.parse(Buffer.from(claims, 'base64url').toString()).iss, 'TEAM123456');
  assert.equal(verify('sha256', Buffer.from(`${header}.${claims}`), { key: key.publicKey, dsaEncoding: 'ieee-p1363' }, Buffer.from(signature, 'base64url')), true);
  assert.equal(await (transport as any).authorization(), jwt);
  console.log('PASS APNs provider JWT: P-256 signature, issuer/key ID, safe cache');
}
run().catch((error) => { console.error(error); process.exitCode = 1; });
