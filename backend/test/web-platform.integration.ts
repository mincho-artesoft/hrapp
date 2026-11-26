import { randomUUID } from 'node:crypto';
import { BookingCalendarsController } from '../src/booking/booking-calendars.controller';
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
  const bookings = new BookingCalendarsController(store as any);
  const host = {principal: hostPrincipal}, guest = {principal: guestPrincipal};
  // A pre-directory calendar remains discoverable until its owner chooses link-only access.
  const legacy = randomUUID(), legacyKey = 'booking-calendars/' + legacy + '.json';
  const legacyDoc = {id:legacy, title:'Studio', color:'#BF5AF2', hostName:'owner@example.invalid', owner:hostPrincipal.principalId,
    slots:[], requests:[], revision:1};
  await store.putJSON(legacyKey, legacyDoc);
  const listed = (await bookings.directory(guest)).calendars.find(c => c.id === legacy);
  assert.deepEqual(listed, {id:legacy, title:'Studio', hostName:'Cloud Calendars user', isOwner:false,
    appointmentType:'General appointment', customType:''});
  assert.ok(!(await bookings.directory(host)).calendars.some(c => c.id === legacy));
  assert.equal((await bookings.availability(host, legacy)).isOwner,true);
  await assert.rejects(bookings.save(guest, legacy,{...legacyDoc, listed:false}));
  await bookings.save(host, legacy,{...legacyDoc, listed:false});
  await bookings.save(host, legacy,{title:'Studio', revision:2, slots:[]});
  assert.ok(!(await bookings.directory(guest)).calendars.some(c => c.id === legacy));
  assert.equal((await bookings.availability(guest, legacy)).isOwner,false);
  await bookings.save(host, legacy,{title:'Studio', revision:3, slots:[], listed:true});
  assert.ok((await bookings.directory(guest)).calendars.some(c => c.id === legacy));
  await bookings.remove(host,legacy,'4');
  assert.ok(!(await bookings.directory(guest)).calendars.some(c => c.id === legacy));
  // Owned and unlisted calendars must not consume a place on either results page.
  const directoryStore = new MemoryStore();
  const directoryAPI = new BookingCalendarsController(directoryStore as any);
  const visible: string[] = [];
  for (let i = 0; i < 70; i++) {
    const id = '00000000-0000-4000-8000-' + String(i).padStart(12, '0');
    const listed = i % 2 === 0;
    const owner = i === 0 || i === 62 || i === 69 ? guestPrincipal.principalId : hostPrincipal.principalId;
    await directoryStore.putJSON('booking-calendars/' + id + '.json', {...legacyDoc, id, listed, owner});
    if (listed && owner !== guestPrincipal.principalId) visible.push(id);
  }
  const firstPage = await directoryAPI.directory(guest);
  const secondPage = await directoryAPI.directory(guest, firstPage.next);
  assert.equal(firstPage.next, visible[31]);
  assert.equal(secondPage.next, null);
  assert.deepEqual([...firstPage.calendars, ...secondPage.calendars].map(c => c.id), visible);
  await assert.rejects(directoryAPI.directory(guest,'invalid'));
  const calendarId = randomUUID();
  const future = Date.now() + 86400000;
  const interval = (offset: number) => ({id: randomUUID(), start: new Date(future + offset).toISOString(), end: new Date(future + offset + 60000).toISOString()});
  // The same weekly wall time in Sofia moves one UTC hour when DST starts.
  const weeklyCal = randomUUID(), series = randomUUID();
  const repeatGuest = {principal:{principalId:randomUUID()}};
  const weekly = { id:series,start:'2030-03-24T07:00:00Z',end:'2030-03-24T08:00:00Z',
    timeZone:'Europe/Sofia', rule:{frequency:'weekly', interval:1, occurrenceCount:4} };
  const repeatNow = Date.now;
  try {
    Date.now = () => Date.parse('2030-03-20T00:00:00Z');
    const venue = {location:'Sofia Studio',structuredLocation:{title:'Studio',latitude:42.7,longitude:23.3,radius:0}};
    await bookings.save(host,weeklyCal,{title:'Lessons',appointmentType:'Other',customType:'Ceramics',...venue,slots:[],revision:0});
    const emptyOffer = await bookings.availability(guest, weeklyCal);
    assert.equal(emptyOffer.slots.length,0);
    assert.ok(!('color' in emptyOffer));
    assert.ok(!('location' in emptyOffer));
    assert.ok(!('structuredLocation' in (await bookings.workspace(host)).calendars[0]));
    await bookings.save(host,weeklyCal,{title:'Lessons',color:'#bf5af2',slots:[{...weekly,...venue,color:'#000000'}],revision:1});
    let offer = await bookings.availability(guest, weeklyCal);
    assert.equal(offer.customType,'Ceramics');
    assert.equal(offer.slots.length,4);
    assert.ok(!('color' in offer));
    assert.ok(!('color' in await store.getJSON('booking-calendars/'+weeklyCal+'.json')));
    assert.ok(!('color' in offer.slots[0]));
    assert.equal(offer.slots[1].start,'2030-03-31T06:00:00.000Z');
    assert.deepEqual(offer.slots[1].structuredLocation, venue.structuredLocation);
    const second = offer.slots[1], request = randomUUID();
    await bookings.book(repeatGuest,weeklyCal,request,{slotId:second.id});
    assert.equal((await bookings.workspace(repeatGuest)).appointments[0].location, 'Sofia Studio');
    offer = await bookings.availability(guest, weeklyCal);
    assert.equal(offer.slots.length,3);
    assert.ok(offer.slots.some(s=>s.id===series));
    await assert.rejects(bookings.save(host,weeklyCal,{title:'Lessons',slots:[{...weekly,rule:null}],revision:3}));
    // A legacy client omits purpose and recurrence while editing a title.
    await bookings.save(host,weeklyCal,{title:'Lesson',slots:[{id:series,start:weekly.start,end:weekly.end}],revision:3});
    assert.equal((await bookings.availability(guest, weeklyCal)).customType,'Ceramics');
    assert.equal((await bookings.workspace(repeatGuest)).appointments[0].status,'pending');
    await bookings.save(host,weeklyCal,{title:'Lesson',color:'#123456',slots:[weekly],revision:4});
    assert.ok(!('color' in (await bookings.workspace(repeatGuest)).appointments[0]));
    const weeklyWorkspace = (await bookings.workspace(host)).calendars.find(c => c.id === weeklyCal)!;
    assert.ok(!('color' in weeklyWorkspace));
    assert.ok(!('color' in weeklyWorkspace.requests[0]));
    await bookings.decide(host,weeklyCal,request,{status:'declined'});
    await bookings.remove(host,weeklyCal,'6');
    const laterCal = randomUUID();
    const annual = {...weekly, rule:{frequency:'yearly',interval:1}, start:'2032-01-15T08:00:00Z',end:'2032-01-15T09:00:00Z'};
    await bookings.save(host,laterCal,{title:'Annual',revision:0,slots:[annual]});
    const first = await bookings.availability(guest, laterCal);
    assert.equal(first.slots.length,1);
    assert.equal(first.nextFrom,'2033-01-15T08:00:00.000Z');
    const next = await bookings.availability(guest, laterCal,first.nextFrom);
    assert.equal(next.slots[0].start,first.nextFrom);
    const ownVenue = {location:'Room B',structuredLocation:{title:'Room B',latitude:42.1,longitude:23.1,radius:0}};
    await bookings.save(host,laterCal,{title:'Annual',revision:1,...venue,slots:[{...annual,...ownVenue,title:'Review'}]});
    const venuePage = await bookings.availability(guest, laterCal,first.nextFrom);
    assert.equal(venuePage.slots[0].location,'Room B');
    assert.equal(venuePage.slots[0].title,'Review');
    assert.deepEqual(venuePage.slots[0].structuredLocation,ownVenue.structuredLocation);
    await assert.rejects(bookings.save(host,laterCal,{title:'Annual',revision:2,slots:[{...annual,...ownVenue,
      structuredLocation:{...ownVenue.structuredLocation,latitude:180}}]}));
    await bookings.save(host,laterCal,{title:'Updated',revision:2,slots:[annual]});
    assert.equal((await bookings.availability(guest, laterCal)).slots[0].title,'Review');
    await bookings.save(host,laterCal,{title:'Updated',revision:3,slots:[{...annual,location:'',structuredLocation:null}]});
    // Older documents may still contain a calendar address. Addressless slots must stay addressless.
    const key = 'booking-calendars/'+laterCal+'.json';
    await store.putJSON(key,{...await store.getJSON(key),...venue});
    const cleared = (await bookings.availability(guest, laterCal)).slots[0];
    assert.equal(cleared.location,undefined);
    assert.equal(cleared.structuredLocation,undefined);
    assert.ok(!('location' in (await bookings.workspace(host)).calendars[0]));
    const bookingID = randomUUID();
    await bookings.book(repeatGuest,laterCal,bookingID,{slotId:cleared.id});
    const receipt = (await bookings.workspace(repeatGuest)).appointments.find(a=>a.id===bookingID)!;
    assert.equal(receipt.location,undefined);
    assert.equal(receipt.structuredLocation,undefined);
    await bookings.decide(host,laterCal,bookingID,{status:'declined'});
    await bookings.remove(host,laterCal,'6');
  } finally { Date.now = repeatNow; }
  const slots = [interval(0), interval(60000)];
  const draft = {title: 'Availability', revision: 0, slots};
  assert.deepEqual(await bookings.workspace(guest), {calendars: [], appointments: []});
  await assert.rejects(bookings.save(host, calendarId, {...draft, slots:[slots[0], interval(100)]}));
  await bookings.save(host, calendarId, draft);
  assert.equal((await bookings.workspace(host)).calendars.length, 1);
  await assert.rejects(bookings.save(guest, calendarId, {...draft, revision:1}));
  await assert.rejects(bookings.save(host, calendarId, draft));
  await assert.rejects(bookings.book(host, calendarId, randomUUID(), {slotId: slots[0].id}));
  const r1 = randomUUID(), r2 = randomUUID();
  const races = await Promise.allSettled([r1,r2].map(id => bookings.book(guest, calendarId, id, {slotId:slots[0].id})));
  assert.equal(races.filter(r => r.status === 'fulfilled').length, 1);
  const winner = races[0].status === 'fulfilled' ? r1 : r2;
  await bookings.book(guest, calendarId, winner, {slotId:slots[0].id});
  assert.equal((await bookings.workspace(guest)).appointments[0].status, 'pending');
  assert.equal((await bookings.workspace(guest)).calendars.length, 0);
  assert.equal((await bookings.availability(guest, calendarId)).slots.length, 1);
  await assert.rejects(bookings.decide(guest, calendarId, winner, {status:'accepted'}));
  await assert.rejects(bookings.save(host, calendarId, {...draft, revision:2, slots:[]}));
  await bookings.decide(host, calendarId, winner, {status:'declined'});
  assert.equal((await bookings.availability(guest, calendarId)).slots.length, 2);
  const repeat = randomUUID();
  await bookings.book(guest,calendarId,repeat,{slotId:slots[0].id});
  await bookings.decide(host,calendarId,repeat,{status:'accepted'});
  assert.deepEqual((await bookings.workspace(guest)).appointments.map(r=>r.status), ['declined','accepted']);
  await assert.rejects(bookings.remove(host,calendarId,'5'));
  const originalNow = Date.now;
  try {
    Date.now = () => future + 86400000;
    assert.deepEqual((await bookings.workspace(guest)).appointments.map(r=>r.status), ['declined','past']);
    await bookings.remove(host,calendarId,'5');
  } finally { Date.now = originalNow; }
  assert.equal((await bookings.workspace(host)).calendars.length, 0);
  await assert.rejects(bookings.availability(guest, calendarId));


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
