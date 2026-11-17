import 'reflect-metadata';
import assert from 'node:assert/strict';
import { DurablePushQueue } from '../src/push/durable-push-queue';
import { EmailRelayController } from '../src/email/email-relay.controller';
import { apiEndpoint, canonicalInvitationURL } from '../src/email/invitation-url';

class MemoryStore {
  objects = new Map<string, { value: any; etag: string }>();
  async listKeys(prefix: string) { return [...this.objects.keys()].filter(k => k.startsWith(prefix)); }
  async getJSONWithETag(key: string) { return structuredClone(this.objects.get(key) ?? null); }
  async putJSONIfAbsent(key: string, value: any) {
    if (this.objects.has(key)) return false;
    this.objects.set(key, { value: structuredClone(value), etag: '1' }); return true;
  }
  async putJSONIfMatch(key: string, value: any, etag: string) {
    if (this.objects.get(key)?.etag !== etag) return false;
    this.objects.set(key, { value: structuredClone(value), etag: String(Number(etag) + 1) }); return true;
  }
  async del(key: string) { this.objects.delete(key); }
}
async function main() {
  const api = 'https://storage.wonek.com/cloud-calendars-debug';
  const invitation = '/event-invites/open?e=event1&c=feed1&title=Test';
  assert.equal(canonicalInvitationURL(api + invitation, api)?.pathname,
    '/cloud-calendars-debug/event-invites/open');
  assert.equal(canonicalInvitationURL('https://63yo3ore3c.execute-api.us-east-1.amazonaws.com' + invitation, api)?.pathname,
    '/cloud-calendars-debug/event-invites/open', 'legacy invitations survive the API move');
  assert.equal(canonicalInvitationURL(api + invitation, 'https://api.cloud-calendars.com'), null);
  assert.equal(canonicalInvitationURL('https://storage.wonek.com/unrelated' + invitation, api), null);
  assert.equal(canonicalInvitationURL('https://attacker.test' + invitation, api), null);
  assert.equal(apiEndpoint('/email-assets/shared-event-qr', api).href, api + '/email-assets/shared-event-qr');
  const store = new MemoryStore();
  let now = 1_000, sent = 0, fail = true;
  const dispatch = async () => { if (fail) throw new Error('offline'); sent++; };
  const first = new DurablePushQueue(store as any, dispatch, () => now);
  await first.enqueue({ id: '10000000-0000-0000-0000-000000000001' });
  await first.drain();
  assert.equal(store.objects.size, 1);
  fail = false;
  const restarted = new DurablePushQueue(store as any, dispatch, () => now);
  await restarted.drain();
  assert.equal(sent, 0, 'backoff survives restart');
  now += 15_000;
  await Promise.all([first.drain(), restarted.drain()]);
  assert.equal(sent, 1, 'only one worker owns a job');
  assert.equal(store.objects.size, 0);
  // A run of jobs waiting for retry must not starve later ready jobs.
  for (let i = 0; i < 100; i++) {
    store.objects.set(`push/queue/deferred-${i}.json`, { value: { nextAttempt: now + 60_000 }, etag: '1' });
  }
  await restarted.enqueue({ id: '10000000-0000-0000-0000-000000000002' });
  await restarted.drain();
  assert.equal(sent, 2);

  process.env.EMAIL_RELAY_TOKEN = 'relay-test-secret-that-is-at-least-32-characters';
  let delivery: any[];
  const email = new EmailRelayController({ deliverThroughSES: async (...args: any[]) => { delivery = args; } } as any);
  const body = { to: 'qa@example.test', subject: 'Test', html: '<p>Test</p>',
    attachments: [{ FileName: 'test.png', RawContent: Buffer.from('attachment').toString('base64') }] };
  await assert.rejects(email.deliver('', body), (e: any) => e.status === 401);
  await assert.rejects(email.deliver('Bearer wrong', body), (e: any) => e.status === 401);
  const auth = `Bearer ${process.env.EMAIL_RELAY_TOKEN}`;
  await assert.rejects(email.deliver(auth, { ...body, replyTo: 'x\r\nBcc: other' }), (e: any) => e.status === 400);
  assert.deepEqual(await email.deliver(auth, body), { delivered: true });
  assert.equal(delivery[3].attachments[0].RawContent.toString(), 'attachment');
  delete process.env.EMAIL_RELAY_TOKEN;
  console.log('PASS: prefixed and legacy invitation URLs; durable queue restart, retries, concurrent workers; authenticated SES relay and attachments (no email sent)');
}
void main().catch(error => { console.error(error); process.exitCode = 1; });
