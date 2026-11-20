import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { EmailService } from '../src/email/email.service';
import { canonicalInvitationURL } from '../src/email/invitation-url';

// Diagnostic only: SES is intercepted. With --live, unauthenticated QR/feed
// reads are allowed, plus one invitation request for the exact existing QA
// event and the two explicitly signed-in simulator accounts.
const debugAPI = 'https://63yo3ore3c.execute-api.us-east-1.amazonaws.com';
const productionAPI = 'https://api.cloud-calendars.com';
const output = process.argv[2];
assert.ok(output, 'Supply an output directory');
fs.mkdirSync(output, { recursive: true });
const sampleQuery = new URLSearchParams({ e: 'qa-event', c: 'qa-feed', title: 'Local QA',
  start: '1788944400', end: '1788949800', timeZone: 'Europe/Sofia', color: '#AF52DE' });
const sample = `${productionAPI}/event-invites/open?${sampleQuery}`;
const legacy = new URL('https://appclip.apple.com/id');
legacy.search = sampleQuery.toString();
legacy.searchParams.set('p', 'Deksan.CalendarASD.Clip');

async function inspectTemplate(label: string, api: string, eventURL: string, calendar = false) {
  process.env.API_URL = api;
  const service = new EmailService();
  let html = '';
  let attachments: any[] = [];
  (service as any).sendEmail = async (_to: string, _subject: string, value: string, options: any) => {
    html = value; attachments = options?.attachments ?? [];
  };
  if (calendar) {
    await service.sendSharedCalendarInvitation({ email: 'qa@example.com', access: 'reader',
      calendar: { title: 'QA Local Calendar', color: '#AF52DE' }, ownerId: 'qa-owner', calendarId: 'd'.repeat(64) });
  } else {
    await service.sendSharedEventInvitation({ ownerCalId: 'test-owner-calendar', email: 'qa@example.com', access: 'reader',
      event: { title: 'QA Local Event', start: '2026-09-09T12:00:00Z', end: '2026-09-09T13:30:00Z' },
      eventUrl: eventURL, timeZone: 'Europe/Sofia', senderEmail: 'qa-owner@example.com', eventColor: '#AF52DE' });
  }
  const match = html.match(/<img src="([^"]+)"[^>]+alt="QR code to open (?:the event|the calendar)"/);
  assert.ok(match, `${label}: missing QR img element`);
  const imageURL = new URL(match[1].replace(/&amp;/g, '&'));
  const target = calendar ? `${api}/icloud-calendar-invites/open?o=qa-owner&c=${'d'.repeat(64)}`
    : canonicalInvitationURL(eventURL, api, true)!.toString();
  const png = attachments.find(a => `cid:${a.ContentId}` === imageURL.toString())?.RawContent;
  const result = { label, generatedPNG: Boolean(png), targetLength: target.length,
    targetHost: new URL(target).host, assetHost: imageURL.host,
    isRemoteImage: imageURL.protocol === 'https:', perMessageCacheKey: imageURL.searchParams.has('v') };
  fs.writeFileSync(path.join(output, `${label}.html`), png ? html.replace('cid:invitation-qr', 'data:image/png;base64,' + Buffer.from(png).toString('base64')) : html);
  if (png) fs.writeFileSync(path.join(output, `${label}-qr.png`), png);
  return result;
}

async function fetchEvidence(url: string, init?: RequestInit) {
  const response = await fetch(url, { ...init, signal: AbortSignal.timeout(20000) });
  const bytes = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get('content-type') ?? '';
  return { status: response.status, contentType, byteLength: bytes.length,
    validPNG: bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
    isCalendarFeed: bytes.toString('utf8').includes('BEGIN:VCALENDAR'),
    error: response.ok ? undefined : bytes.toString('utf8').slice(0, 300) };
}

async function main() {
  const long = new URL(sample);
  long.searchParams.set('title', 'اجتماع'.repeat(20));
  long.searchParams.set('location', 'عنوان'.repeat(32));
  // Each field stays within the app's limit (120 title, 160 location,
  // 1024 eventURL). Combined percent-encoding can still exceed 2048.
  long.searchParams.set('eventURL', 'https://example.com/meeting/' + 'x'.repeat(400));
  const templates = [];
  templates.push(await inspectTemplate('production-event-server-link', productionAPI, sample));
  templates.push(await inspectTemplate('production-event-legacy-appclip', productionAPI, legacy.toString()));
  templates.push(await inspectTemplate('production-event-long-arabic', productionAPI, long.toString()));
  templates.push(await inspectTemplate('production-calendar', productionAPI, '', true));
  templates.push(await inspectTemplate('debug-event-current-link', debugAPI, sample.replace(productionAPI, debugAPI)));
  templates.push(await inspectTemplate('debug-event-legacy-appclip', debugAPI, legacy.toString()));
  templates.push(await inspectTemplate('debug-calendar', debugAPI, '', true));
  const report: any = { templates, sendsIntercepted: true };

  if (process.argv[3] === '--live') {
    const senderData = process.argv[4];
    const receiverData = process.argv[5];
    assert.ok(senderData && receiverData, 'Supply the exact simulator data containers');
    const readSession = (root: string) => JSON.parse(fs.readFileSync(path.join(root,
      'Library/Application Support/CloudCalendars/feed-session-debug.json'), 'utf8'));
    const sender = readSession(senderData);
    const receiver = readSession(receiverData);
    const manifest = JSON.parse(fs.readFileSync(path.join(senderData, 'Documents/LocalSharingE2E/manifest.json'), 'utf8'));
    assert.equal(manifest.run, '20260909-run1');
    assert.equal(manifest.recipient.toLowerCase(), receiver.email.toLowerCase());
    assert.notEqual(sender.email.toLowerCase(), receiver.email.toLowerCase());
    const original = new URL(manifest.eventURL);
    const current = new URL('/event-invites/open', debugAPI);
    current.search = original.search;
    current.searchParams.delete('p');
    assert.equal(current.searchParams.get('e'), manifest.eventID);
    const qr = (target: string) => {
      const url = new URL('/email-assets/shared-event-qr', debugAPI);
      url.searchParams.set('url', target);
      return url.toString();
    };
    const calendar = new URL('/icloud-calendar-invites/open', debugAPI);
    calendar.searchParams.set('o', manifest.ownerID);
    calendar.searchParams.set('c', manifest.calendarID);
    report.live = {
      legacyEventQR: await fetchEvidence(qr(original.toString())),
      currentEventQR: await fetchEvidence(qr(current.toString())),
      calendarQR: await fetchEvidence(qr(calendar.toString())),
      debugFeed: await fetchEvidence(`${debugAPI}/f/${original.searchParams.get('c')}.ics`),
      legacyProductionFeed: await fetchEvidence(`https://cal.cloud-calendars.com/f/${original.searchParams.get('c')}.ics`),
      currentUIEventInvitation: await fetchEvidence(`${debugAPI}/events/${manifest.eventID}/invitations`, {
        method: 'POST', headers: { Authorization: `Bearer ${sender.deviceToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventUrl: current.toString(), invitations: [{ email: manifest.recipient, access: 'reader' }] }),
      }),
    };
  }
  fs.writeFileSync(path.join(output, 'qr-and-feed-diagnostics.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
