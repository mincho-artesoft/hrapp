import { randomUUID } from 'node:crypto';
import { occurrences, splitBookingSeries, Slot } from '../src/booking/booking-schedule';
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
  const notices: unknown[][] = [];
  const bookings = new BookingCalendarsController(store as any, {bookingChange: async (...args: unknown[]) => notices.push(args)} as any);
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
  const directoryAPI = new BookingCalendarsController(directoryStore as any, {} as any);
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
  {
    const api = new BookingCalendarsController(new MemoryStore() as any, {bookingChange: async () => {}} as any);
    const id = randomUUID(), slotId = randomUUID(), request = randomUUID();
    const bounds = {start:'2099-05-01T10:00:00.000Z', end:'2099-05-01T11:00:00.000Z'};
    const slot = {id:slotId, ...bounds, rule:{frequency:0, interval:1, occurrenceCount:2}, timeZone:'UTC'};
    const link = 'https://meet.example.org/rooms/lesson?join=1';
    const save = (revision:number, fields:object) => api.save(host,id,{title:'Online lessons',revision,slots:[{...slot,...fields}]});
    for (const videoCallURL of ['invalid', 'javascript:void(0)', 'https://user:pass@example.org']) {
      await assert.rejects(save(0,{videoCallURL}), (error: any) => error.getStatus() === 400 && error.getResponse().error === 'Invalid video call link.');
    }
    await save(0,{videoCallURL:link});
    await save(1,{location:'Room 2'});
    const offer = await api.availability(guest,id);
    assert.equal(offer.slots.length,2);
    for (const item of offer.slots) {
      assert.equal(item.location,'Room 2');
      assert.ok('hasVideoCall' in item && item.hasVideoCall);
      assert.ok(!('videoCallURL' in item));
    }
    const later = offer.slots[1];
    await api.book(guest,id,request,{slotId:later.id});
    const appointment = async () => (await api.workspace(guest)).appointments[0];
    assert.ok(!('videoCallURL' in await appointment()));
    const owned = (await api.workspace(host)).calendars[0];
    assert.equal(owned.slots[0].videoCallURL,link);
    assert.equal(Reflect.get(owned.requests[0],'videoCallURL'),link);
    await api.decide(host,id,request,{status:'accepted'});
    const readWindow = () => api.availability(guest,id,'2099-05-01T00:00:00Z','2099-05-05T00:00:00Z');
    const bookedWindow = await api.availability(host,id,'2099-05-01T00:00:00Z','2099-05-05T00:00:00Z');
    assert.equal((await readWindow()).busy[0].myBookingId,request);
    assert.deepEqual(bookedWindow.busy?.map(({id,...rest}) => rest),[{start:later.start,end:later.end}]);
    assert.ok(!bookedWindow.slots.some(s => s.id === later.id));
    assert.ok(!JSON.stringify(bookedWindow.busy).includes(request));
    assert.ok(!('busy' in await api.availability(guest,id)));
    await assert.rejects(api.availability(guest,id,bounds.start,'2099-08-01T00:00:00Z'));
    assert.equal(Reflect.get(await appointment(),'videoCallURL'),link);
    await api.editOccurrence(host,id,later.id,{revision:4,start:later.start,end:later.end,videoCallURL:''});
    const changed = await appointment();
    assert.equal(Reflect.get(changed,'videoCallURL'),link);
    assert.ok(changed.proposal && !('videoCallURL' in changed.proposal));
    await api.answerChange(guest,id,request,{proposalId:changed.proposal.id,status:'accepted'});
    assert.ok(!('videoCallURL' in await appointment()));
    assert.equal((await api.workspace(host)).calendars[0].slots.find(s=>s.id===slotId)?.videoCallURL,link);
    await assert.rejects(api.cancelBooking(host,id,request));
    await assert.rejects(api.cancelBooking({principal:{principalId:randomUUID()}},id,request));
    await api.cancelBooking(guest,id,request);
    await api.cancelBooking(guest,id,request);
    assert.equal((await appointment()).status,'declined');
    assert.equal((await appointment()).cancelledByGuest,true);
    assert.deepEqual((await readWindow()).busy,[]);
    assert.ok((await readWindow()).slots.some(s=>s.start===later.start));
    // A new guest may immediately claim the released occurrence. Cancelling one booking
    // of a recurring slot never clears the other guest's holds.
    const other = {principal:{principalId:randomUUID()}}, replacement = randomUUID(), firstRequest = randomUUID();
    const released = (await readWindow()).slots.find(s=>s.start===later.start)!;
    await api.book(other,id,replacement,{slotId:released.id});
    await api.book(guest,id,firstRequest,{slotId:slotId});
    await assert.rejects(api.cancelBooking(guest,id,replacement));
    const mine = (await readWindow()).busy;
    assert.equal(mine.find(s=>s.start===later.start)?.myBookingId,undefined);
    assert.equal(mine.find(s=>s.start===bounds.start)?.myBookingId,firstRequest);
    await api.cancelBooking(guest,id,firstRequest);
    assert.deepEqual((await readWindow()).busy.map(s=>s.start),[later.start]);
  }
  {
    const isolated = new MemoryStore();
    await isolated.putJSON(store.keys.principal(guestPrincipal.principalId), {accountEmail:'elena@example.com'});
    const api = new BookingCalendarsController(isolated as any, {bookingChange: async (...args:unknown[]) => notices.push(args)} as any);
    const id=randomUUID(), series=randomUUID(), request=randomUUID(), other={principal:{principalId:randomUUID()}};
    const start=Date.parse('2099-01-01T10:00:00Z'), hour=3600000, day=24*hour;
    const bounds=(ms:number)=>({start:new Date(ms).toISOString(),end:new Date(ms+hour).toISOString()});
    const seed={id:series,...bounds(start),title:'Lesson',timeZone:'UTC',rule:{frequency:0,interval:1,occurrenceCount:3}};
    await api.save(host,id,{title:'Lessons',revision:0,slots:[seed]});
    const original=(await api.availability(guest,id)).slots;
    const source=original[1];
    await assert.rejects(api.editOccurrence(guest,id,source.id,{revision:1,...bounds(start+day+hour)}));
    await assert.rejects(api.editOccurrence(host,id,source.id,{revision:1,...bounds(start+2*day)}));
    await api.editOccurrence(host,id,source.id,{revision:1,...bounds(start+day+hour),title:'Later lesson'});
    let offer=await api.availability(guest,id);
    assert.deepEqual(offer.slots.map(s=>s.start),[seed.start,bounds(start+day+hour).start,original[2].start]);
    assert.equal(offer.slots[0].id,series);
    const moved=offer.slots[1];
    await assert.rejects(api.book(guest,id,request,{slotId:source.id}));
    await api.book(guest,id,request,{slotId:moved.id});
    await api.decide(host,id,request,{status:'accepted'});
    assert.equal(notices.length,0);
    const proposed=bounds(start+day+3*hour);
    await api.editOccurrence(host,id,moved.id,{revision:4,...proposed,title:'Proposed title',location:'Room 2'});
    const current=async()=>(await api.workspace(guest)).appointments[0];
    const pending=await current();
    assert.equal(pending.start,moved.start);
    assert.equal(pending.proposal.start,proposed.start);
    const visibleBusy = async () => (await api.availability(other,id,seed.start,bounds(start+3*day).end)).busy;
    assert.deepEqual((await visibleBusy()).map(({id,...times})=>times),[
      {start:moved.start,end:moved.end},proposed,
    ]);
    for (const [viewer, expected] of [[host, proposed], [guest, moved]] as const) {
      const page = await api.availability(viewer,id,seed.start,bounds(start+3*day).end);
      assert.deepEqual(page.busy.map(row => row.start),[expected.start]);
      assert.ok(!page.slots.some(slot => slot.start === moved.start || slot.start === proposed.start));
    }
    assert.equal((await api.availability(guest,id,proposed.start,proposed.end)).busy.length,0);
    assert.equal(pending.calendarId,id);
    assert.equal(notices.length,1);
    assert.equal(notices[0][0],'elena@example.com');
    assert.deepEqual((await api.availability(other,id)).slots.map(s=>s.id),[series,original[2].id]);
    await assert.rejects(api.book(other,id,randomUUID(),{slotId:moved.id}));
    await assert.rejects(api.editOccurrence(host,id,series,{revision:5,...bounds(start+day+hour)}));
    await assert.rejects(api.editOccurrence(host,id,moved.id,{revision:5,...bounds(start+3*day)}));
    const answer={proposalId:pending.proposal.id,status:'accepted'};
    await assert.rejects(api.answerChange(host,id,request,answer));
    await assert.rejects(api.answerChange(other,id,request,answer));
    await assert.rejects(api.answerChange(guest,id,request,{...answer,proposalId:randomUUID()}));
    await api.answerChange(guest,id,request,answer);
    await api.answerChange(guest,id,request,answer);
    assert.deepEqual((await visibleBusy()).map(({id,...times})=>times),[proposed]);
    assert.equal((await current()).start,proposed.start);
    assert.equal((await current()).title,'Proposed title');
    assert.equal((await current()).location,'Room 2');
    assert.equal((await current()).status,'accepted');
    await api.editOccurrence(host,id,moved.id,{revision:6,...bounds(start+3*day)});
    const second=(await current()).proposal;
    await api.answerChange(guest,id,request,{proposalId:second.id,status:'declined'});
    assert.equal((await current()).proposal,undefined);
    assert.equal((await current()).status,'declined');
    await api.book(other,id,randomUUID(),{slotId:moved.id});
    // Removing the first occurrence must also advance the public availability cursor.
    await api.editOccurrence(host,id,series,{revision:9,remove:true});
    offer=await api.availability(guest,id);
    assert.deepEqual(offer.slots.map(s=>s.id),[original[2].id]);
    const schedule=(await api.workspace(host)).calendars[0];
    await api.save(host,id,{...schedule,slots:schedule.slots.map(({excludedStarts,...rest})=>rest)});
    assert.deepEqual((await api.availability(guest,id)).slots.map(s=>s.id),[original[2].id]);
    const reused=randomUUID(), oldSlot=randomUUID(), oldRequest=randomUUID();
    await api.save(host,reused,{title:'Reused slot',revision:0,slots:[{id:oldSlot,...bounds(start)}]});
    await api.book(guest,reused,oldRequest,{slotId:oldSlot});
    const now=Date.now;
    try {
      Date.now=()=> start+day;
      await api.save(host,reused,{title:'Reused slot',revision:2,slots:[{id:oldSlot,...bounds(start+2*day)}]});
      await api.editOccurrence(host,reused,oldSlot,{revision:3,...bounds(start+3*day)});
      assert.equal((await api.availability(guest,reused)).slots[0].start,bounds(start+3*day).start);
      assert.equal((await current()).proposal,undefined);
      assert.equal(notices.length,2);
    } finally { Date.now=now; }
  }
  {
    const isolated = new MemoryStore(), sent: string[] = [];
    await isolated.putJSON(store.keys.principal(guestPrincipal.principalId), {accountEmail:'elena@example.com'});
    const api = new BookingCalendarsController(isolated as any, {bookingChange: async (to:string) => sent.push(to)} as any);
    const id = randomUUID(), series = randomUUID(), request = randomUUID();
    const time = (day:number,hour:number) => new Date(Date.UTC(2099,0,day,hour)).toISOString();
    const bounds = (day:number,hour:number) => ({start:time(day,hour),end:time(day,hour+1)});
    await api.save(host,id,{title:'Classes',revision:0,slots:[{id:series,...bounds(1,9),timeZone:'UTC',
      rule:{frequency:0,interval:1,occurrenceCount:6}}]});
    const original = (await api.availability(guest,id)).slots;
    await api.editOccurrence(host,id,original[3].id,{revision:1,...bounds(4,15)});
    await api.book(guest,id,request,{slotId:original[4].id});
    await api.decide(host,id,request,{status:'accepted'});
    const move = {revision:4,freeOnly:true,...bounds(3,12)};
    await assert.rejects(api.moveFuture(guest,id,original[2].id,move));
    await assert.rejects(api.moveFuture(host,id,original[4].id,move));
    const updated = await api.moveFuture(host,id,original[2].id,move);
    assert.equal(updated.revision,5);
    assert.deepEqual((await api.availability(guest,id)).slots.map(s=>s.start),[time(1,9),time(2,9),time(3,12),time(4,15),time(6,12)]);
    const changed = (await api.workspace(guest)).appointments[0];
    assert.equal(changed.start,time(5,9));
    assert.equal(changed.proposal.start,time(5,12));
    assert.deepEqual(sent,['elena@example.com']);
    await assert.rejects(api.moveFuture(host,id,original[2].id,move));
    assert.deepEqual(sent,['elena@example.com']);
    await api.answerChange(guest,id,request,{proposalId:changed.proposal.id,status:'declined'});
    assert.ok((await api.availability(guest,id)).slots.some(s=>s.start===time(5,12)));
  }
  {
    const api = new BookingCalendarsController(new MemoryStore() as any, {} as any);
    const id = randomUUID(), series = randomUUID(), request = randomUUID();
    const slot = {id:series, start:'2099-02-02T09:00:00.000Z', end:'2099-02-02T10:00:00.000Z',
      timeZone:'UTC', hoursOfDay:[9,10,11], rule:{frequency:0,interval:1,occurrenceCount:9}};
    await api.save(host,id,{title:'Availability',revision:0,slots:[slot]});
    const original = (await api.availability(guest,id)).slots;
    const remove = (revision: number) => ({revision,remove:true,freeOnly:true});
    await api.editOccurrence(host,id,original[1].id,remove(1));
    await api.book(guest,id,request,{slotId:original[3].id});
    await assert.rejects(api.moveFuture(guest,id,original[5].id,remove(3)));
    await assert.rejects(api.moveFuture(host,id,original[5].id,remove(2)));
    await assert.rejects(api.moveFuture(host,id,original[2].id,remove(3)));
    await assert.rejects(api.editOccurrence(host,id,original[3].id,remove(3)));
    await api.moveFuture(host,id,original[5].id,remove(3));
    assert.deepEqual((await api.availability(guest,id)).slots.map(s=>s.id),[original[0].id,original[2].id,original[4].id]);
    assert.equal((await api.workspace(guest)).appointments[0].slotId,original[3].id);
    await api.decide(host,id,request,{status:'declined'});
    await api.moveFuture(host,id,series,remove(5));
    assert.equal((await api.workspace(host)).calendars[0].slots.length,0);
  }
  {
    const api = new BookingCalendarsController(new MemoryStore() as any, {} as any);
    const id=randomUUID(), series=randomUUID();
    const dailyPattern={first:540,last:1035,step:55,breaks:[{start:720,end:765},{start:900,end:915}]};
    const slot={id:series,start:'2099-02-02T09:00:00.000Z',end:'2099-02-02T09:45:00.000Z',
      dailyPattern,timeZone:'UTC',rule:{frequency:0,interval:1,occurrenceCount:12}};
    await api.save(host,id,{title:'Office hours',revision:0,slots:[slot]});
    const available=(await api.availability(guest,id)).slots;
    assert.equal(available.length,12);
    assert.deepEqual(available.filter(o=>o.start.startsWith('2099-02-02')).map(o=>o.start.slice(11,16)),
      ['09:00','09:55','10:50','13:35','15:25','16:20','17:15']);
    const blocked=series+'@'+Date.parse('2099-02-02T11:45:00Z');
    await assert.rejects(api.book(guest,id,randomUUID(),{slotId:blocked}));
    await api.book(guest,id,randomUUID(),{slotId:available[1].id});
    const breaks=[...dailyPattern.breaks,{start:565,end:640}];
    await assert.rejects(api.save(host,id,{title:'Office hours',revision:2,slots:[{...slot,dailyPattern:{...dailyPattern,breaks}}]}));
    const firstDayOff={...slot,rule:{frequency:1,interval:1,daysOfTheWeek:[{weekday:2,weekNumber:0}]}};
    const saturdayStart='2099-01-31T09:00:00.000Z';
    const weekdays=occurrences({...firstDayOff,start:saturdayStart,end:'2099-01-31T09:45:00.000Z'},Date.parse(saturdayStart),Date.parse('2099-02-08'));
    assert(weekdays.length>0 && weekdays.every(o=>new Date(o.start).getUTCDay()===1));
    const clipped={...slot,dailyPattern:{...dailyPattern,breaks:[{start:540,end:585}]}};
    assert.equal(occurrences(clipped,Date.parse(slot.start),Date.parse(slot.start)+86400000)[0].start.slice(11,16),'09:55');
    const cut = splitBookingSeries(slot,available[3].start,'2099-02-02T13:45:00Z','2099-02-02T14:30:00Z',randomUUID());
    assert.deepEqual(cut.future.dailyPattern.breaks,[{start:730,end:775},{start:910,end:925}]);
  }
  {
    const api = new BookingCalendarsController(new MemoryStore() as any, {} as any);
    const id=randomUUID(), series=randomUUID(), zone='Europe/Sofia';
    for (const [start, end] of [['2027-03-26T22:00:00.000Z','2027-03-27T22:00:00.000Z'],
        ['2027-10-29T21:00:00.000Z','2027-10-30T21:00:00.000Z']]) {
      const slot={id:series,start,end,timeZone:zone,allDay:true,rule:{frequency:0,interval:1,occurrenceCount:3}};
      const values=occurrences(slot,Date.parse(start),Date.parse(start)+4*86400000);
      assert.equal(values.length,3);
      assert(values.every(o=>o.allDay && o.timeZone===zone));
      assert.equal(values[0].end,values[1].start);
      assert.equal(values[1].end,values[2].start);
      assert.equal((Date.parse(values[1].end)-Date.parse(values[1].start))/3600000, start.includes('-03-') ? 23 : 25);
    }
    const midnightShift = {id:series,allDay:true,timeZone:'America/Santiago',start:'2027-09-02T04:00:00.000Z',
      end:'2027-09-03T04:00:00.000Z',rule:{frequency:0,interval:1,occurrenceCount:6}};
    const chile = occurrences(midnightShift,Date.parse('2027-09-01'),Date.parse('2027-09-09'));
    assert.equal(chile.length,6);
    assert.deepEqual(chile.slice(1,-1).map(day=>day.end),chile.slice(2).map(day=>day.start));
    assert(chile.some(day=>Date.parse(day.end)-Date.parse(day.start)===23*3600000));
    const slot={id:series,start:'2099-02-01T22:00:00Z',end:'2099-02-02T22:00:00Z',timeZone:zone,allDay:true};
    await api.save(host,id,{title:'Day booking',revision:0,slots:[slot]});
    assert.equal((await api.availability(guest,id)).slots[0].allDay,true);
    await api.book(guest,id,randomUUID(),{slotId:series});
    assert.equal((await api.workspace(guest)).appointments[0].allDay,true);
    await assert.rejects(api.save(host,id,{title:'Day booking',revision:2,slots:[{...slot,allDay:false}]}));
    await assert.rejects(api.editOccurrence(host,id,series,{revision:2,start:'2099-02-01T22:15:00Z',end:slot.end,allDay:true}));
  }
  {
    const days = (series: Slot) => occurrences(series,Date.UTC(2026,0,1),Date.UTC(2027,0,1)).map(s=>s.start);
    const iso = (value: string) => new Date(value).toISOString();
    const slot = (start: string, rule: Slot['rule']): Slot => ({id:'series', start:iso(start),
      end:new Date(Date.parse(start)+3600000).toISOString(), timeZone:'America/New_York',rule});
    const weekly = slot('2026-03-01T15:00Z',{frequency:1,interval:1,occurrenceCount:5,daysOfTheWeek:[{weekday:1,weekNumber:0}]});
    const old = days(weekly);
    const moved = splitBookingSeries({...weekly,excludedStarts:[old[3]]},old[1],iso('2026-03-09T15:00Z'),iso('2026-03-09T16:00Z'),'future');
    assert.deepEqual(days(moved.past),[old[0]]);
    assert.deepEqual(days(moved.future),['2026-03-09T15:00Z','2026-03-16T15:00Z','2026-03-30T15:00Z'].map(iso));
    const monthly = slot('2026-01-31T15:00Z',{frequency:2,interval:1,occurrenceCount:4});
    const original = days(monthly);
    const split = splitBookingSeries({...monthly,excludedStarts:[original[2]]},original[1],iso('2026-03-30T14:00Z'),iso('2026-03-30T15:00Z'),'future');
    assert.deepEqual(days(split.future),['2026-03-30T14:00Z','2026-05-30T14:00Z'].map(iso));
    const limited = slot('2026-03-01T15:00Z',{frequency:1,interval:1,endDate:iso('2026-03-22T14:00Z')});
    const later = splitBookingSeries(limited,limited.start,iso('2026-03-01T17:00Z'),iso('2026-03-01T18:00Z'),limited.id);
    assert.equal(later.past,undefined);
    assert.equal(days(later.future).length,days(limited).length);
    assert.equal(days(later.future).slice(-1)[0],iso('2026-03-22T16:00Z'));
  }
  {
    const api = new BookingCalendarsController(new MemoryStore() as any, {bookingChange: async () => {}} as any);
    const id = randomUUID(), seriesId = randomUUID();
    const slot = {id: seriesId, start:'2099-02-02T09:00:00.000Z', end:'2099-02-02T09:30:00.000Z',
      timeZone:'UTC', hoursOfDay:[9,10,11], rule:{frequency:1,interval:1,occurrenceCount:6}};
    await api.save(host,id,{title:'Appointments',revision:0,slots:[slot]});
    const initial = (await api.availability(guest,id)).slots;
    assert.equal(initial.length,6);
    assert.equal(new Set(initial.map(s=>s.id)).size,6);
    await api.book(guest,id,randomUUID(),{slotId:initial[1].id});
    let master = (await api.workspace(host)).calendars[0];
    assert.equal(master.slots.length,1);
    const changed = {...slot,hoursOfDay:[9,10,11,12]};
    await api.save(host,id,{revision:master.revision,title:master.title,slots:[changed]});
    master = (await api.workspace(host)).calendars[0];
    await api.editOccurrence(host,id,initial[2].id,{revision:master.revision,start:'2099-02-02T15:00:00Z',end:'2099-02-02T15:30:00Z'});
    const available = (await api.availability(guest,id)).slots;
    assert.deepEqual(available.map(s=>s.start.slice(11,16)),['09:00','12:00','15:00','09:00','10:00']);
    const saved = (await api.workspace(host)).calendars[0];
    assert.equal(saved.slots.filter(s=>s.rule).length,1);
    assert.equal(saved.requests[0].slotId,initial[1].id);
    await assert.rejects(api.save(host,id,{revision:saved.revision,title:saved.title,slots:[{...changed,hoursOfDay:[9,11]}]}));
  }
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
