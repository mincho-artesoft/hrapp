import assert from 'node:assert/strict';
import { NativeCalendarStore } from '../src/booking/native-calendar-store';
import { createApp } from '../src/bootstrap';
import { StoreService } from '../src/store/store.service';
import { hashKey } from '../src/util/ids';
class MemoryStore {
  data = new Map<string, { value: any; etag: string }>();
  async listKeys(p: string) { return [...this.data.keys()].filter(k => k.startsWith(p)); }
  async getJSON(k: string) { return structuredClone(this.data.get(k)?.value ?? null); }
  async getJSONWithETag(k: string) { return structuredClone(this.data.get(k) ?? null); }
  async putJSONIfAbsent(k: string, v: any) { if (this.data.has(k)) return false; this.data.set(k, { value: structuredClone(v), etag: '1' }); return true; }
  async putJSONIfMatch(k: string, v: any, etag: string) { if (this.data.get(k)?.etag !== etag) return false; this.data.set(k, { value: structuredClone(v), etag: String(Number(etag) + 1) }); return true; }
}
async function testCalendarUploadHTTP() {
  const app = await createApp();
  try {
    const storage = app.get(StoreService);
    const memory = new MemoryStore();
    storage.getJSONWithETag = memory.getJSONWithETag.bind(memory);
    storage.putJSONIfAbsent = memory.putJSONIfAbsent.bind(memory);
    const token = 'calendar-sync-http-fixture';
    await memory.putJSONIfAbsent(storage.keys.token(hashKey(token)), { principalId: 'test-owner', calId: 'test-account' });
    await app.listen(0, '127.0.0.1');
    const endpoint = (await app.getUrl()) + '/ios/calendars/sync';
    const events = Array.from({length: 1200}, (_, i) => ({
      id: 'event-' + i, title: 'Calendar event ' + i, start: '2026-11-26T09:00:00Z', end: '2026-11-26T10:00:00Z', allDay: false,
    }));
    const body = JSON.stringify({ id: 'calendar', deviceId: 'mac', title: 'Local', allowsChanges: true, accountLocal: true, expectedRevision: 0, events });
    assert.ok(Buffer.byteLength(body) > 100 * 1024);
    const headers = { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' };
    const saved = await fetch(endpoint, {method: 'POST', headers, body});
    assert.equal(saved.status, 200);
    const read = await fetch(endpoint, {method: 'POST', headers, body: JSON.stringify({id: 'calendar', deviceId: 'ipad', readOnly: true})});
    assert.equal(read.status, 200);
    const snapshot = await read.json() as {calendar: {events: unknown[]}};
    assert.equal(snapshot.calendar.events.length, events.length);
  } finally {
    await app.close();
  }
}
async function testLargeCalendarInventory() {
  const keys = Array.from({length: 65}, (_, i) => `principal/alice/native-calendars/${i}.json`);
  let activeReads = 0;
  let peakReads = 0;
  let failingKey: string | undefined;
  const storage = {
    async listKeys() { return keys; },
    async getJSON(key: string) {
      activeReads++;
      peakReads = Math.max(peakReads, activeReads);
      try {
        await new Promise<void>(resolve => setImmediate(resolve));
        if (key === failingKey) throw new Error('Storage unavailable');
        return key === keys[2] ? null : {id: key};
      } finally {
        activeReads--;
      }
    },
  };
  const calendars = new NativeCalendarStore(storage as any);
  const owner = {principalId: 'alice'};
  failingKey = keys[17];
  await assert.rejects(calendars.list(owner), /Storage unavailable/);
  failingKey = undefined;
  const inventory = await calendars.list(owner);
  assert.deepEqual(inventory.map(c => c.id), keys.filter(key => key !== keys[2]));
  assert.ok(peakReads <= 4, `Calendar inventory started ${peakReads} simultaneous reads`);
}
async function main() {
  await testCalendarUploadHTTP();
  await testLargeCalendarInventory();
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
  const personal = { ...calendar, id: 'account_local', source: 'Local Calendars', accountLocal: true };
  const created = await api.sync(owner, personal);
  assert.equal(created.status, 200);
  const otherDevice = await api.sync(owner, { ...created.body.calendar, deviceId: 'tablet', expectedRevision: 1,
    events: [{ ...event, title: 'Edited from tablet' }] });
  assert.equal(otherDevice.status, 200);
  assert.equal(otherDevice.body.calendar.deviceId, 'phone');
  assert.equal(otherDevice.body.calendar.events[0].title, 'Edited from tablet');
  assert.equal((await api.sync(owner, { ...personal, deviceId: 'mac', expectedRevision: 1 })).status, 409);
  assert.equal((await api.sync(owner, { ...otherDevice.body.calendar, accountLocal: false, expectedRevision: 2 })).status, 403);
  const isolated = await api.sync(stranger, { id: personal.id, deviceId: 'tablet', readOnly: true });
  assert.equal(isolated.body.calendar, null);
  const removed = await api.sync(owner, { ...otherDevice.body.calendar, deviceId: 'mac', available: false, expectedRevision: 2 });
  assert.equal(removed.status, 200);
  assert.equal(removed.body.calendar.available, false);
  assert.deepEqual(removed.body.calendar.events, []);
  assert.deepEqual(removed.body.calendar.deletedEventIds, [event.id]);
  assert.equal((await api.sync(owner, {...personal, expectedRevision: 3})).status, 409);
  assert.equal((await api.listForWeb(owner)).some(c => c.id === personal.id), false);
  const mirrorID = 'a'.repeat(64);
  const replica = await api.sync(owner, { ...calendar, id: 'provider_phone', source: 'Google · test@example.com', providerMirrorID: mirrorID });
  assert.equal(replica.body.calendar.providerMirrorID, mirrorID);
  const { providerMirrorID: ignored, ...oldClient } = replica.body.calendar;
  const oldUpdate = await api.sync(owner, { ...oldClient, expectedRevision: replica.body.calendar.revision });
  assert.equal(oldUpdate.body.calendar.providerMirrorID, mirrorID, 'Older clients retain the stable identity');
  const web = api.webCalendars([
    { ...replica.body.calendar, updatedAt: '2026-11-17T09:00:00Z' },
    { ...replica.body.calendar, id: 'provider_mac', deviceId: 'mac', updatedAt: '2026-11-17T10:00:00Z', events: [{ ...event, title: 'Latest provider version' }] },
    { ...calendar, id: 'same_name_local' },
    { ...calendar, id: 'same_name_other' },
  ]);
  assert.equal(web.length, 3, 'Only proven provider replicas are deduplicated');
  assert.equal(web[0].events[0].title, 'Latest provider version');

  const birthday = {...event, title: "Sam’s Birthday", allDay: true, url: 'addressbook://phone-contact',
    start: '2026-11-17T22:00:00Z', end: '2026-11-18T22:00:00Z', details: {timeZone: 'Europe/Sofia'}};
  const phone = {...calendar, id: 'birthday_phone', source: 'Other', title: 'Birthdays', allowsChanges: false,
    events: [birthday, {...birthday, id: 'second_sam', url: 'addressbook://another-contact'}]};
  const tablet = {...phone, id: 'birthday_ipad', deviceId: 'ipad', title: 'Рождени дни', eventKitKind: 'birthdays',
    events: [{...birthday, id: 'ipad_event', start: '2026-11-18T08:00:00Z', details: {timeZone: 'America/Los_Angeles'}},
      {...birthday, id: 'ipad_only', title: "Lee’s Birthday"}]};
  const ordinary = {...phone, id: 'custom_subscription', eventKitKind: 'regular', events: []};
  const project = (docs: any[]) => api.webCalendars(docs).find(c => c.eventKitKind === 'birthdays');
  const merged = project([phone, tablet, ordinary]);
  assert.equal(merged.events.length, 3, 'Keep both contacts called Sam and the iPad-only contact');
  assert.deepEqual(merged, project([ordinary, tablet, phone]), 'Display IDs are independent of fetch order');
  assert.equal(api.webCalendars([phone, tablet, ordinary, {...phone, source: 'Google calendars', providerMirrorID: mirrorID}]).length, 3);
  await api.sync(owner, phone);
  await api.sync(owner, tablet);
  const olderTabletWrite = await api.sync(owner, {...tablet, eventKitKind: undefined, expectedRevision: 1});
  assert.equal(olderTabletWrite.body.calendar.eventKitKind, 'birthdays');
  assert.equal((await api.removeFromWeb(stranger, phone.id)).status, 404);
  await api.removeFromWeb(owner, merged.id);
  assert.ok(!(await api.listForWeb(owner)).some(c => c.id === merged.id));
  assert.equal((await api.list(owner)).find(c => c.id === phone.id).events.length, 2);
  const holiday = {...calendar, id: 'old_holiday_copy', source: 'Local Calendars', allowsChanges: false};
  await api.sync(owner, holiday);
  await api.removeFromWeb(owner, holiday.id);
  await api.removeFromWeb(owner, holiday.id);
  await api.sync(owner, {...holiday, expectedRevision: 1});
  assert.ok(!(await api.listForWeb(owner)).some(c => c.id === holiday.id));
  assert.ok((await api.list(owner)).find(c => c.id === holiday.id).available);
  assert.equal((await api.removeFromWeb(owner, personal.id)).status, 400);
  console.log('PASS: account-scoped birthday aggregation, per-device contacts and persistent web removal');
  const extraEdit = await api.mutate(owner, 'native.provider_phone.event_one', { travelTime: 900, attachments: [{ id: 'file', dataBase64: 'dGVzdA==' }] });
  assert.equal(extraEdit.body.event.details.travelTime, 900);
  assert.deepEqual(extraEdit.body.event.details.attachments, [{ id: 'file', dataBase64: 'dGVzdA==' }]);
  const details = {
    notes: 'Line 1\nLine 2', timeZone: 'Europe/Sofia', availability: 2,
    alarms: [{relativeOffset: -1800}, {absoluteDate: '2026-11-17T07:15:45.123Z', relativeOffset: null}],
    recurrenceRules: [{frequency: 2, interval: 2, daysOfTheWeek: [{weekday: 2, weekNumber: 0}], setPositions: [-1], occurrenceCount: 8}],
    structuredLocation: {title: 'Office', latitude: 42.6977, longitude: 23.3219, radius: 25},
    videoCallURL: 'https://example.invalid/meet', travelTime: 900,
    attachments: [{id: 'document', fileName: 'notes.txt', contentType: 'text/plain', dataBase64: 'YQ=='}],
    organizer: {name: 'Organizer', email: 'owner@example.invalid', role: 3, type: 1, status: 2, isCurrentUser: true},
    attendees: [{name: 'Guest', email: 'guest@example.invalid', role: 1, type: 1, status: 1, isCurrentUser: false}],
    futureField: {key: 1},
  };
  const sample = {...event, location: 'Office', url: 'https://example.invalid/event', details};
  const fieldsCalendar = {...personal, id: 'all_fields', events: [sample]};
  assert.equal((await api.sync(owner, fieldsCalendar)).status, 200);
  const projected = api.eventForWeb(fieldsCalendar, sample);
  assert.equal(projected.details.availability, 'tentative');
  assert.equal(projected.details.recurrenceRules[0].frequency, 'monthly');
  assert.equal((await api.mutate(owner, projected.id, {title: 'Renamed', alarms: projected.details.alarms,
    recurrenceRules: projected.details.recurrenceRules, availability: projected.details.availability})).status, 200);
  const readFromMac = async () => (await api.sync(owner, {id: fieldsCalendar.id, deviceId: 'mac', readOnly: true})).body.calendar;
  const afterWeb = await readFromMac();
  const {updatedAt: revision, ...persisted} = afterWeb.events[0];
  assert.deepEqual(persisted, {...sample, title: 'Renamed'});
  assert.equal((await api.mutate(owner, projected.id, {expectedUpdatedAt: revision, attachments: [], alarms: [],
    travelTime: null, videoCallURL: null, structuredLocation: null, location: null, url: null, recurrenceRules: []})).status, 200);
  const cleared = await readFromMac();
  assert.deepEqual(cleared.events[0].details, {...details, alarms: [], attachments: [], recurrenceRules: [],
    travelTime: null, videoCallURL: null, structuredLocation: null});
  assert.equal(cleared.events[0].url, null);
  const cancelled = {...cleared.events[0], allDay: true, status: 'cancelled', readOnly: true,
    start: '2026-03-28T22:00:00Z', end: '2026-03-29T21:00:00Z'};
  assert.equal((await api.sync(owner, {...cleared, deviceId: 'ipad', expectedRevision: cleared.revision, events: [cancelled]})).status, 200);
  const final = await readFromMac();
  assert.equal(final.events[0].status, 'cancelled');
  assert.equal(final.events[0].allDay, true);
  assert.equal(api.eventForWeb(final, final.events[0]).readOnly, true);
  assert.equal((await api.mutate(owner, projected.id, {title: 'read-only'})).status, 403);
  const seed = '2032-03-24T09:00:00.000Z', firstEnd = '2032-03-24T10:00:00.000Z';
  const repeat = {...event, id:'lesson', start:seed, end:firstEnd,
    details:{...event.details,timeZone:'UTC',recurrenceRules:[{frequency:0,interval:2,occurrenceCount:5}]}};
  const local = {...calendar,id:'local-series',accountLocal:true,events:[repeat],expectedRevision:0};
  assert.equal((await api.sync(owner,local)).status,200);
  const copyID = hashKey('app-local:account:' + local.id);
  assert.equal((await api.sync(owner,{...local,id:copyID,deviceId:'ipad'})).status,200);
  const anotherID = 'independent-same-name';
  assert.equal((await api.sync(owner,{...local,id:anotherID})).status,200);
  let visible = await api.listForWeb(owner);
  assert.ok(visible.some(c => c.id === local.id) && visible.some(c => c.id === anotherID));
  assert.ok(!visible.some(c => c.id === copyID));
  const copy = (await api.sync(owner,{id:copyID,deviceId:'ipad',readOnly:true})).body.calendar;
  assert.equal(copy.duplicateOf,local.id);
  assert.equal(copy.events.length,1);
  const change = {scope:'this',originalStart:'2032-03-28T09:00:00Z',start:'2032-03-29T15:00:00Z',end:'2032-03-29T16:30:00Z',allDay:false};
  const id = 'native.local-series.lesson';
  const moved = await api.mutate(owner,id,{occurrenceMove:change},false,true);
  assert.equal(moved.status,200);
  const [master,one] = moved.body.changedEvents;
  assert.equal(master.id,id);
  assert.equal(master.start,seed);
  assert.deepEqual(master.details.excludedStarts,['2032-03-28T09:00:00.000Z']);
  assert.deepEqual(master.details.recurrenceRules,[{frequency:'daily',interval:2,occurrenceCount:5}]);
  assert.notEqual(one.id,id);
  assert.equal(one.id.split('.').at(-1), 'ecd6b4bb580e50e8caa1ffbe74a2b42ee2d3dd419f52247656bf53bb46046a85');
  assert.equal(one.start,new Date(change.start).toISOString());
  assert.deepEqual(one.details.recurrenceRules,[]);
  assert.deepEqual(one.details.attachments,repeat.details.attachments);
  assert.equal((await api.mutate(owner,id,{occurrenceMove:change},false,true)).status,409);
  visible = await api.listForWeb(owner);
  assert.ok(!visible.some(c => c.id === copyID));
  assert.equal((await api.mutate(owner,'native.'+copyID+'.lesson',{title:'stale browser'})).status,409);
  const changedCopy = {...copy, expectedRevision:copy.revision, events:copy.events.map(e => ({...e,title:'Offline edit'}))};
  assert.equal((await api.sync(owner,changedCopy)).status,200);
  assert.ok((await api.listForWeb(owner)).some(c => c.id === copyID && !c.duplicateOf));
  const secondDevice = await api.sync(owner,{id:local.id,deviceId:'another-device',readOnly:true});
  assert.equal(secondDevice.body.calendar.events.length,2);
  assert.deepEqual(secondDevice.body.calendar.events.find(e=>e.id==='lesson').details.excludedStarts,master.details.excludedStarts);
  const moveFuture = {...change,scope:'future',originalStart:'2032-03-30T09:00:00Z',start:'2032-03-30T12:00:00Z',end:'2032-03-30T13:00:00Z'};
  const tail = await api.mutate(owner,id,{occurrenceMove:moveFuture},false,true);
  assert.equal(tail.status,200);
  assert.equal(tail.body.changedEvents[0].start,seed);
  assert.equal(tail.body.changedEvents[1].details.recurrenceRules[0].occurrenceCount,2);
  assert.equal((await api.mutate(owner,one.id,{occurrenceMove:moveFuture},false,true)).status,409);
  console.log('PASS: single local occurrence detaches atomically and survives a second-device read and future split');
  console.log('PASS: native → web → second device field round-trip, explicit clears, cancellation and read-only');
  console.log('PASS: account-local cross-device edits, immutable scope, account isolation, conflict and tombstone');
  console.log('PASS: native calendars, isolation, read-only access, CAS conflicts, metadata preservation, concurrent edits and deletion');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
