// Explicit, real Debug API -> SQS -> APNs audit. Creates two isolated API-only
// QA resources and sends two invitation emails/pushes to the existing Receiver.
// Does not inject notifications, export credentials, or alter seeded calendars.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID, createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const api = 'https://63yo3ore3c.execute-api.us-east-1.amazonaws.com';
const sender = '1A67A8FA-A72D-4244-9C1C-551D1C473FD4';
const receiver = '786598BD-4158-4A5B-851F-8E04FDE3BC98';
const bundle = 'Deksan.CalendarASD';
const hash = value => createHash('sha256').update(value).digest('hex');
function readSession(id) {
  const root = execFileSync('xcrun', ['simctl', 'get_app_container', id, bundle, 'data'], { encoding: 'utf8' }).trim();
  return JSON.parse(fs.readFileSync(path.join(root, 'Library/Application Support/CloudCalendars/feed-session-debug.json'), 'utf8'));
}

async function main() {
  const [mode, reportFile] = process.argv.slice(2);
  assert.ok(['--send-two-qa-invitations', '--resume'].includes(mode));
  assert.ok(reportFile && (mode === '--resume' || !fs.existsSync(reportFile)), 'Use a new report path; do not resend an existing run');
  const owner = readSession(sender);
  const recipient = readSession(receiver);
  assert.equal(owner.email, 'sashko125@gmail.com');
  assert.equal(recipient.email, 'aleksandarsvinarov@gmail.com');
  const call = async (session, route, method = 'GET', body) => {
    const response = await fetch(api + route, {
      method, headers: { Authorization: 'Bearer ' + session.deviceToken, 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`${method} ${route} returned ${response.status}`);
    return response.json();
  };
  const run = randomUUID();
  const eventId = hash('qa-push-event:' + run);
  const calendarId = hash('qa-push-calendar:' + run);
  const report = mode === '--resume' ? JSON.parse(fs.readFileSync(reportFile, 'utf8')) : {
    scope: 'Real Debug API-created QA invitations, SQS and APNs; no local/native source UI coverage and no synthetic push',
    run, createdAt: new Date().toISOString(), eventId, calendarId,
    eventTitle: 'QA APNs — Event ' + run.slice(0, 8),
    calendarTitle: 'QA APNs — Calendar ' + run.slice(0, 8),
    receiverTerminated: false, eventInvitationSent: false, calendarInvitationSent: false,
  };
  const save = () => fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  assert.equal(report.eventId, hash('qa-push-event:' + report.run));
  assert.equal(report.calendarId, hash('qa-push-calendar:' + report.run));
  assert.equal(report.eventTitle, 'QA APNs — Event ' + report.run.slice(0, 8));
  assert.equal(report.calendarTitle, 'QA APNs — Calendar ' + report.run.slice(0, 8));
  save();
  assert.ok(!report.eventInvitationSent && !report.calendarInvitationSent, 'Never resend an invitation already requested');
  // Stop before any invitation exists. The observation harness is launched only
  // later, after the delivery window, to inspect UNPushNotificationTrigger.
  if (!report.receiverTerminated) execFileSync('xcrun', ['simctl', 'terminate', receiver, bundle]);
  report.receiverTerminated = true; save();
  const start = new Date(Date.now() + 2 * 3600_000).toISOString();
  const end = new Date(Date.now() + 3 * 3600_000).toISOString();
  const activeEventID = report.eventId;
  const activeCalendarID = report.calendarId;
  await call(owner, '/events/' + activeEventID, 'PUT', {
    title: report.eventTitle, start, end, allDay: false, location: 'Sofia',
    details: { notes: 'Real server push QA; API-only fixture', timeZone: 'Europe/Sofia' },
  });
  const grant = await call(owner, '/grants', 'POST', { role: 'viewer', eventId: activeEventID, label: report.eventTitle });
  assert.ok(grant.feedId);
  const eventURL = new URL('/event-invites/open', api);
  eventURL.searchParams.set('e', activeEventID);
  eventURL.searchParams.set('c', grant.feedId);
  eventURL.searchParams.set('timeZone', 'Europe/Sofia');
  eventURL.searchParams.set('color', '#AF52DE');
  await call(owner, `/events/${activeEventID}/invitations`, 'POST', {
    eventUrl: eventURL.toString(), invitations: [{ email: recipient.email, access: 'reader' }],
  });
  report.eventInvitationSent = true; save();
  await call(owner, `/icloud-calendars/${activeCalendarID}/sharing`, 'PUT', {
    title: report.calendarTitle, color: '#007AFF', timeZone: 'Europe/Sofia', calendarKind: 'app_local',
    recipients: [{ email: recipient.email, access: 'reader' }], preserveUnmentionedRecipients: true,
  });
  await call(owner, `/icloud-calendars/${activeCalendarID}/invitations`, 'POST', { emails: [recipient.email] });
  report.calendarInvitationSent = true; save();
  const eventPending = await call(recipient, '/event-invitations/pending');
  const calendarPending = await call(recipient, '/icloud-calendar-invitations/pending');
  report.eventPending = eventPending.invitations.some(item => item.eventId === activeEventID);
  report.calendarPending = calendarPending.invitations.some(item => item.calendarId === activeCalendarID);
  assert.ok(report.eventPending && report.calendarPending);
  report.apiResult = 'PASS'; save();
  console.log(JSON.stringify(report, null, 2));
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
