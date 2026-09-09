import 'reflect-metadata';
import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { EmailService } from '../src/email/email.service';
import { CalendarService, eventInvitationPage } from '../src/calendar/calendar.service';
import { eventIcon, eventPalette } from '../src/presentation/event-card';
import { MeController } from '../src/me/me.controller';
import { MeService } from '../src/me/me.service';
import { CoreService } from '../src/core/core.service';
import { keys } from '../src/store/keys';
import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import QRCode from 'qrcode';

const out = process.argv[2];
assert(out, 'Provide a local output directory');
mkdirSync(out, { recursive: true });

// No AWS clients or delivery: sendEmail is intercepted before every public call.
process.env.EMAIL_FROM = '';
const email: any = new EmailService();
const eventURL = 'https://api.cloud-calendars.com/event-invites/open?e=visual-fixture&c=visual-fixture';
const logo = 'data:image/png;base64,' + readFileSync(join(__dirname,
  '../../hrapp/CalendarAppClip/Assets.xcassets/AppClipHeaderIcon.imageset/AppClipHeaderIcon.png')).toString('base64');
let currentName = '';
const saved: string[] = [];
function save(name: string, html: string) {
  html = html.replace(/https:\/\/www\.cloud-calendars\.com\/icons\/icon-192\.png/g, logo);
  // Offline artifact: prohibit any remote requests, forms or scripts.
  html = html.replace('<head>', '<head><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; img-src data:; style-src \'unsafe-inline\'">');
  writeFileSync(join(out, name + '.html'), html);
  saved.push(name);
}
email.sendEmail = async (_to: string, _subject: string, html: string) => save(currentName, html);
email.sharedEventIconURL = (kind: string, color: string) =>
  'data:image/png;base64,' + email.invitationIconPng(kind, color).toString('base64');

async function main() {
  const qr = await QRCode.toDataURL(eventURL);
  email.sharedEventQRCodeURL = () => qr;
  const event = { title: 'Product Launch Planning', start: new Date(1788953400000).toISOString(),
    end: new Date(1788958800000).toISOString(), location: 'Apple Park Visitor Center, Cupertino' };
  currentName = 'email-event-invitation';
  await email.sendSharedEventInvitation({ email: 'guest@example.com', access: 'writer', event, eventUrl: eventURL,
    timeZone: 'Europe/Sofia', senderName: 'Alex', senderEmail: 'alex@example.com', eventColor: '#0A84FF' });
  email.sendEmail = async (_to: string, _subject: string, html: string) => save(currentName, html);
  for (const kind of ['registered', 'moved', 'cancelled']) {
    currentName = `email-registration-${kind}`;
    await email.notifyRegistration(kind, { event, email: 'guest@example.com', webcal: 'webcal://example.com/fixture.ics',
      manageToken: 'visual-fixture', timeZone: 'Europe/Sofia' });
  }
  for (const cancelled of [false, true]) {
    save('shared-link' + (cancelled ? '-cancelled' : ''), eventInvitationPage({ title: event.title,
      date: 'Wednesday, September 9, 2026', time: '2:30 PM – 4:00 PM', location: event.location,
      color: '#0A84FF', fullAppURL: 'cloudcalendars://shared-event', sender: 'Alex', cancelled }));
  }
  const calendarId = 'a'.repeat(64);
  const memoryStore = {keys, getJSON:async (key:string) => key === keys.icloudCalendarSharing('fixture',calendarId)
    ? {title:'Work Calendar',color:'#0A84FF',ownerEmail:'alex@example.com'} : null};
  const calendarService = new CalendarService(memoryStore as any, {} as any, email);
  const calendarLanding = (await calendarService.iCloudCalendarInvitationLanding({o:'fixture',c:calendarId})).html;
  assert(!calendarLanding.includes('▦'), 'Calendar invitation must not use a grid text glyph');
  assert.equal(calendarLanding.split(eventIcon('calendar')).length - 1, 2,
    'Calendar invitation label and calendar name both use the calendar icon');
  save('shared-calendar-link', calendarLanding);
  save('shared-link-unavailable', (await calendarService.iCloudCalendarInvitationLanding({})).html);
  const evil = eventInvitationPage({title:'<script>alert(1)</script>',date:'Today',time:null,location:'<img src=x>',
    color:'red; background:url(https://example.com)',fullAppURL:'cloudcalendars://shared-event',sender:'Test',cancelled:false});
  assert(!evil.includes('<script>')); assert(evil.includes('&lt;script&gt;')); assert(evil.includes('--event-color:#0A84FF'));
  assert.deepEqual(eventPalette('#0A84FF'), {color:'#0A84FF',title:'#064D94',detail:'#086CD1',light:'#DAEDFF',dark:'#032C54'});
  assert(!('session' in keys)); assert(!('inviteeIndex' in keys)); assert(!('inviteeBooking' in keys));
  assert(!('sendLoginLink' in email));
  assert(!('notifyBooking' in email));
  assert(!('booking' in keys));
  assert(!('bookingHandle' in keys));
  assert(!('booked' in keys));
  // Actual HTTP route regression with an in-memory service; no cloud access.
  @Module({controllers:[MeController], providers:[{provide:MeService,useValue:{whoAmI:()=>({status:200,body:{entitled:true}})}},
    {provide:CoreService,useValue:{resolveToken:async()=>null}}]}) class TestModule {}
  const app = await NestFactory.create(TestModule, {logger:false});
  await app.listen(0, '127.0.0.1');
  try {
    const base = await app.getUrl();
    assert.equal((await fetch(base+'/me/login',{method:'POST',headers:{'content-type':'application/json'},body:'{"email":"test@example.com"}'})).status,404);
    assert.equal((await fetch(base+'/me/bookings?s=old-token')).status,404);
    assert.equal((await fetch(base+'/me')).status,401, 'Existing account endpoint remains protected');
  } finally { await app.close(); }
  writeFileSync(join(out,'manifest.json'), JSON.stringify(saved,null,2));
  console.log(`PASS ${saved.length} offline templates; palette/HTML escaping; retired routes 404; /me authorization preserved`);
}
main().catch(error=>{console.error(error);process.exitCode=1;});
