import assert from 'node:assert/strict';
import {ProviderCalendarWorkspace} from '../src/booking/provider-calendar-workspace';
import {providerRecurrence,providerInstant} from '../src/booking/provider-recurrence';
async function main(){
 const calls:Array<{url:string;init:any}>=[];
 const ok=(value:any,status=200)=>new Response(status===204?null:JSON.stringify(value),{status});
 let reply:any={id:'saved'};
 const transport:typeof fetch=async(url,init)=>{calls.push({url:String(url),init});return ok(reply);};
 const google=new ProviderCalendarWorkspace('google','test-only',transport);
 await google.perform({action:'save-event',calendarID:'a/b@example.com',eventID:'e/f',etag:'version-1',event:{title:'Changed'}});
 assert.ok(calls[0].url.endsWith('/calendars/a%2Fb%40example.com/events/e%2Ff'));
 assert.equal(calls[0].init.method,'PATCH');assert.equal(calls[0].init.headers['If-Match'],'version-1');
 assert.deepEqual(JSON.parse(calls[0].init.body),{summary:'Changed'});
 assert.equal(calls[0].init.headers.Authorization,'Bearer test-only');
 await google.perform({action:'save-event',calendarID:'c',event:{title:'DST day',allDay:true,start:'2026-03-28T22:00:00Z',end:'2026-03-29T21:00:00Z',timeZone:'Europe/Sofia',recurrenceRules:[{frequency:'weekly',interval:2,daysOfTheWeek:[{weekday:1}],occurrenceCount:4}]}});
 const day=JSON.parse(calls[1].init.body);assert.deepEqual(day.start,{date:'2026-03-29'});assert.deepEqual(day.end,{date:'2026-03-30'});assert.equal(day.recurrence[0],'RRULE:FREQ=WEEKLY;INTERVAL=2;BYDAY=SU;COUNT=4');
 assert.equal(providerInstant('2026-03-29','Europe/Sofia'),'2026-03-28T22:00:00.000Z');
 assert.equal(providerInstant('2026-03-30','Europe/Sofia'),'2026-03-29T21:00:00.000Z');
 const graph=new ProviderCalendarWorkspace('microsoft','test-only',transport);
 await graph.perform({action:'save-event',calendarID:'c',event:{allDay:true,start:'2026-03-28T22:00:00Z',end:'2026-03-29T21:00:00Z',timeZone:'Europe/Sofia'}});
 assert.deepEqual(JSON.parse(calls[2].init.body).start,{dateTime:'2026-03-29T00:00:00',timeZone:'Europe/Sofia'});
 assert.equal(providerRecurrence([{frequency:'monthly',interval:1,daysOfTheWeek:[{weekday:6}],setPositions:[-1]}],false,'2026-11-17T10:00:00Z','Europe/Sofia').pattern.index,'last');
 assert.throws(()=>providerRecurrence([{frequency:'yearly',monthsOfTheYear:[1,4]}],false,'2026-11-17T10:00:00Z'));
 await assert.rejects(()=>google.perform({action:'save-event',calendarID:'c',event:{start:'2026-11-17',end:'invalid'}}),/valid event dates/);
 const conflict=new ProviderCalendarWorkspace('google','test-only',async()=>ok({secret:'must not be exposed'},412));
 await assert.rejects(()=>conflict.perform({action:'delete-event',calendarID:'c',eventID:'e'}),(e:any)=>e.status===409&&!e.message.includes('secret'));
 let count=0;const paged=new ProviderCalendarWorkspace('google','test-only',async()=>ok(++count===1?{items:[{id:'one',summary:'One',accessRole:'reader'}],nextPageToken:'next'}:count===2?{items:[]}:{items:[{id:'all-day',start:{date:'2026-03-29'},end:{date:'2026-03-30'},summary:'Day'}]}));
 const state=await paged.perform({action:'state',start:'2026-03-01',end:'2026-04-01',timeZone:'Europe/Sofia'});assert.equal(state.calendars.length,1);assert.equal(state.events[0].start,'2026-03-28T22:00:00.000Z');assert.equal(state.events[0].readOnly,true);
 const evil=new ProviderCalendarWorkspace('microsoft','test-only',async()=>ok({value:[],'@odata.nextLink':'https://attacker.invalid/'}));
 await assert.rejects(()=>evil.perform({action:'state',start:'2026-03-01',end:'2026-04-01'}),/Invalid calendar provider pagination/);
 const duplicateCalls:any[]=[];let first=true;
 const retry=new ProviderCalendarWorkspace('google','test-only',async(url,init)=>{duplicateCalls.push({url:String(url),init});if(first){first=false;return ok({},409);}return ok({id:'already-created'});});
 const retried=await retry.perform({action:'save-event',calendarID:'c',clientRequestID:'stable-draft-id',event:{title:'One event'}});
 const generated=JSON.parse(duplicateCalls[0].init.body).id;
 assert.match(generated,/^[a-f0-9]{64}$/);assert.ok(duplicateCalls[1].url.endsWith('/events/'+generated));assert.equal(retried.eventID,'already-created');
 await graph.perform({action:'save-event',calendarID:'c',clientRequestID:'same-draft-id',event:{title:'One event'}});
 assert.equal(JSON.parse(calls.at(-1)!.init.body).transactionId,'same-draft-id');
 await graph.perform({action:'save-event',calendarID:'c',eventID:'meeting',event:{availability:'tentative',alarms:[{relativeOffsetSeconds:-1800}]}});
 assert.deepEqual(JSON.parse(calls.at(-1)!.init.body),{showAs:'tentative',isReminderOn:true,reminderMinutesBeforeStart:30});
 await graph.perform({action:'save-event',calendarID:'c',eventID:'meeting',event:{providerPrivacy:'confidential',providerShowAs:'workingElsewhere',alarms:[]}});
 assert.deepEqual(JSON.parse(calls.at(-1)!.init.body),{sensitivity:'confidential',showAs:'workingElsewhere',isReminderOn:false,reminderMinutesBeforeStart:0});
 await google.perform({action:'save-event',calendarID:'c',eventID:'meeting',event:{providerPrivacy:'private',providerDefaultReminders:false,
   providerOtherReminders:[{method:'email',minutes:45}],alarms:[{relativeOffsetSeconds:-600}]}});
 assert.deepEqual(JSON.parse(calls.at(-1)!.init.body),{visibility:'private',reminders:{useDefault:false,overrides:[{method:'email',minutes:45},{method:'popup',minutes:10}]}});
 await google.perform({action:'save-event',calendarID:'c',eventID:'meeting',event:{providerDefaultReminders:true}});
 assert.deepEqual(JSON.parse(calls.at(-1)!.init.body),{reminders:{useDefault:true}});
 await assert.rejects(()=>graph.perform({action:'save-event',calendarID:'c',event:{providerPrivacy:'public'}}),/valid/i);
 let graphCalls = 0;
 const received = new ProviderCalendarWorkspace('microsoft','test-only',async()=>ok(++graphCalls === 1 ?
   {value:[{id:'work',name:'Work',canEdit:true}]} : {value:[{id:'meeting',subject:'Cancelled meeting',showAs:'oof',isCancelled:true,
     start:{dateTime:'2026-03-01T11:00:00',timeZone:'UTC'},end:{dateTime:'2026-03-01T12:00:00',timeZone:'UTC'}}]}));
 const outlook = await received.perform({action:'state',start:'2026-03-01',end:'2026-04-01'});
 assert.equal(outlook.events[0].details.availability,'unavailable');
 assert.equal(outlook.events[0].status,'cancelled');
 assert.equal(outlook.events[0].readOnly,true);
 let ownerRequest = 0;
 const own = new ProviderCalendarWorkspace('microsoft','test-only',async()=>ok(++ownerRequest===1?
   {value:[{id:'work',canEdit:true}]}:{value:[{id:'occurrence',seriesMasterId:'series',isOrganizer:true,
     attendees:[{emailAddress:{address:'somebody@example.invalid'}}],sensitivity:'confidential',showAs:'workingElsewhere',
     start:{dateTime:'2026-03-01T11:00:00',timeZone:'UTC'},end:{dateTime:'2026-03-01T12:00:00',timeZone:'UTC'}}]}));
 const ownerMeeting=(await own.perform({action:'state',start:'2026-03-01',end:'2026-04-01'})).events[0];
 assert.equal(ownerMeeting.readOnly,false);assert.equal(ownerMeeting.providerSeriesID,'series');
 assert.equal(ownerMeeting.details.providerPrivacy,'confidential');assert.equal(ownerMeeting.details.providerShowAs,'workingElsewhere');
 const removals: string[]=[];
 let entry:any={id:'public-holidays',accessRole:'reader',etag:'list-version'};
 const transportRemoval:typeof fetch=async(url,init)=>{
   if(init?.method==='DELETE'){removals.push(String(url));return new Response(null,{status:204});}
   return ok(entry);
 };
 const lists=new ProviderCalendarWorkspace('google','test-only',transportRemoval);
 const created = new ProviderCalendarWorkspace('google','test-only',async(_url,init) =>
   ok(init?.method === 'POST' ? {id:'new-calendar',summary:'New'} :
     {id:'new-calendar',summary:'New',accessRole:'owner',backgroundColor:'#123456',etag:'saved'}));
 const {calendar:newCalendar} = await created.perform({action:'create-calendar',title:'New',color:'#123456'});
 assert.equal(newCalendar.remoteID,'new-calendar'); assert.equal(newCalendar.providerOwner,true);
 assert.equal(newCalendar.color,'#123456'); assert.equal(newCalendar.etag,'saved');
 await lists.perform({action:'unsubscribe-calendar',calendarID:entry.id,etag:entry.etag});
 assert.ok(removals[0].endsWith('/users/me/calendarList/public-holidays'));
 await assert.rejects(()=>lists.perform({action:'delete-calendar',calendarID:entry.id}),/cannot be removed/);
 entry={...entry,accessRole:'owner'};
 await lists.perform({action:'delete-calendar',calendarID:entry.id});
 assert.ok(removals[1].endsWith('/v3/calendars/public-holidays'));
 entry.primary=true;
 await assert.rejects(()=>lists.perform({action:'delete-calendar',calendarID:entry.id}),/cannot be removed/);
 entry={id:'shared-office',canEdit:true,canShare:false,isRemovable:true};
 const office=new ProviderCalendarWorkspace('microsoft','test-only',transportRemoval);
 await assert.rejects(()=>office.perform({action:'delete-calendar',calendarID:entry.id}),/cannot be removed/);
 await office.perform({action:'unsubscribe-calendar',calendarID:entry.id});
 entry.isRemovable=false;
 await assert.rejects(()=>office.perform({action:'unsubscribe-calendar',calendarID:entry.id}),/cannot be removed/);
 assert.equal(removals.length,3);
 console.log('Provider calendar contract passed: membership removal, primary protection, updates, recurrence and read-only roles.');
}
void main().catch(e=>{console.error(e);process.exitCode=1;});
