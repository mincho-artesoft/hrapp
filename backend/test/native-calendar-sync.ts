import assert from 'node:assert/strict';
import { NativeCalendarStore } from '../src/booking/native-calendar-store';
class MemoryStore {
  data = new Map<string, { value: any; etag: string }>();
  async listKeys(p: string) { return [...this.data.keys()].filter(k => k.startsWith(p)); }
  async getJSON(k: string) { return structuredClone(this.data.get(k)?.value ?? null); }
  async getJSONWithETag(k: string) { return structuredClone(this.data.get(k) ?? null); }
  async putJSONIfAbsent(k: string, v: any) { if (this.data.has(k)) return false; this.data.set(k, { value: structuredClone(v), etag: '1' }); return true; }
  async putJSONIfMatch(k: string, v: any, etag: string) { if (this.data.get(k)?.etag !== etag) return false; this.data.set(k, { value: structuredClone(v), etag: String(Number(etag) + 1) }); return true; }
}
async function main() {
  const store = new MemoryStore(), api = new NativeCalendarStore(store as any);
  const owner = { principalId: 'alice' }, stranger = { principalId: 'bob' };
  const event = { id: 'event_one', title: 'From phone', start: '2026-11-17T10:00:00Z', end: '2026-11-17T11:00:00Z', allDay: false, details: { notes: 'preserve', attachments: [{ data: 'keep' }] } };
  const calendar = { id: 'work', deviceId: 'phone', title: 'Work', source: 'iCloud', color: '#FF0000', allowsChanges: true, events: [event], expectedRevision: 0 };
  assert.equal((await api.sync(owner, calendar)).status, 200);
  assert.equal((await api.list(owner)).length, 1);
  assert.equal((await api.list(stranger)).length, 0);
  assert.equal((await api.mutate(stranger, 'native.work.event_one', { title: 'unauthorized' })).status, 404);
  assert.equal((await api.sync(owner, { ...calendar, deviceId: 'another', expectedRevision: 1 })).status, 403);
  assert.equal((await api.mutate(owner, 'native.work.event_one', { title: 'From web' })).status, 200);
  assert.equal((await api.sync(owner, { ...calendar, expectedRevision: 1 })).status, 409);
  const read = await api.sync(owner, { id: 'work', deviceId: 'phone', readOnly: true });
  assert.equal(read.body.calendar.events[0].title, 'From web');
  assert.deepEqual(read.body.calendar.events[0].details.attachments, [{ data: 'keep' }]);
  assert.equal((await api.mutate(owner, 'new_event', { calendarId: 'work', title: 'New', start: event.start, end: event.end, allDay: false })).status, 201);
  assert.equal((await api.sync(owner, { ...calendar, id: 'holidays', allowsChanges: false })).status, 200);
  assert.equal((await api.mutate(owner, 'native.holidays.event_one', { title: 'Not permitted' })).status, 403);
  assert.equal((await api.mutate(owner, 'native.holidays.event_one', {}, true)).status, 403);
  assert.equal((await api.sync(owner, { ...calendar, id: '../bad' })).status, 400);
  assert.equal((await api.sync(owner, { ...calendar, id: 'duplicates', events: [event, event] })).status, 400);
  await Promise.all(['a', 'b'].map(id => api.mutate(owner, `event_${id}`, { calendarId: 'work', title: id, start: event.start, end: event.end, allDay: false })));
  assert.equal((await api.list(owner)).find(c => c.id === 'work').events.length, 4);
  assert.equal((await api.mutate(owner, 'native.work.new_event', {}, true)).status, 200);
  const before = (await api.list(owner)).find(c => c.id === 'work');
  const archived = await api.sync(owner, { ...before, available: false, expectedRevision: before.revision });
  assert.equal(archived.status, 200);
  assert.equal(archived.body.calendar.events.length, before.events.length);
  assert.equal((await api.mutate(owner, 'native.work.event_one', { title: 'Unavailable' })).status, 403);
  const restored = await api.sync(owner, { ...archived.body.calendar, available: true, expectedRevision: archived.body.calendar.revision });
  assert.equal(restored.status, 200);
  const changed = { ...restored.body.calendar, events: restored.body.calendar.events.map((e: any) => e.id === 'event_one' ? { ...e, title: 'Changed on device' } : e), expectedRevision: restored.body.calendar.revision };
  assert.equal((await api.sync(owner, changed)).status, 200);
  assert.equal((await api.mutate(owner, 'native.work.event_one', { title: 'Stale edit', expectedUpdatedAt: '2000-01-01T00:00:00Z' })).status, 409);
  assert.equal((await api.mutate(owner, 'native.work.event_one.extra', { title: 'Invalid' })).status, 400);
  console.log('PASS: native calendars, isolation, read-only access, CAS conflicts, metadata preservation, concurrent edits and deletion');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
