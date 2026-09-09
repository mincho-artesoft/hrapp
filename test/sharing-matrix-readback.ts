import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

async function main() {
  const root = execFileSync('xcrun', ['simctl', 'get_app_container', '1A67A8FA-A72D-4244-9C1C-551D1C473FD4', 'Deksan.CalendarASD', 'data'], { encoding: 'utf8' }).trim();
  const session = JSON.parse(fs.readFileSync(path.join(root, 'Library/Application Support/CloudCalendars/feed-session-debug.json'), 'utf8'));
  assert.equal(session.email, 'sashko125@gmail.com');
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'Documents/SharingMatrixE2E/manifest.json'), 'utf8'));
  const api = 'https://63yo3ore3c.execute-api.us-east-1.amazonaws.com';
  const get = async (route: string) => {
    const response = await fetch(api + route, { headers: { Authorization: 'Bearer ' + session.deviceToken } });
    assert.ok(response.ok); return response.json() as any;
  };
  let state = await get('/shared-state');
  if (process.argv[3] === '--restore-seeded-alarm') {
    // Only known QA fixtures damaged in the earlier failed runs. Preserve
    // all live event content and ACLs; do not resend an invitation.
    for (const item of manifest.items) {
    assert.ok(/^QA Sep09 (Local|EventKit) (Reader|Writer|Owner)$/.test(item.label));
    const event = state.outgoing.find((e: any) => e.id === item.eventID);
    assert.ok(event?.title.startsWith(item.label));
    if (event.details.alarms.length !== 0) continue;
    assert.notEqual(item.access, 'reader', 'Reader fixtures must not have been changed');
    const response = await fetch(`${api}/events/${item.eventID}`, { method: 'PUT',
      headers: { Authorization: 'Bearer ' + session.deviceToken, 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: event.title, start: event.start, end: event.end, allDay: event.allDay,
        location: event.location, url: event.url, localEventIdentifier: item.localEventID,
        details: { ...event.details, alarms: [{ relativeOffset: -900 }] } }) });
    assert.equal(response.status, 200);
    console.log(`Restored only the original -900s alarm on ${item.label}; no invitations resent`);
    }
    state = await get('/shared-state');
  }
  const results = [];
  for (const item of manifest.items) {
    assert.ok(item.label.startsWith('QA Sep09 '));
    const sharing = await get(`/icloud-calendars/${item.calendarID}/sharing`);
    const url = new URL(item.url);
    const landing = new URL('/event-invites/open', api); landing.search = url.search;
    landing.searchParams.delete('p');
    const response = await fetch(landing); const html = await response.text();
    const event = state.outgoing.find((e: any) => e.id === item.eventID);
    results.push({ label: item.label, individual: { title: event?.title, location: event?.location, details: event?.details, sequence: event?.sequence },
      calendar: sharing.calendar.events.map((e: any) => ({ title: e.title, allDay: e.allDay,
        start: e.start, end: e.end, hours: (Date.parse(e.end) - Date.parse(e.start)) / 3600000 })),
      landingStatus: response.status, sourceLocation: url.searchParams.get('location'),
      landingPreservesOriginalLocation: html.includes('София / دبي') });
  }
  fs.writeFileSync(process.argv[2], JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
}
main().catch(e => { console.error(e.message); process.exitCode = 1; });
