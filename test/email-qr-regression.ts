import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { EmailService } from '../src/email/email.service';
import { canonicalInvitationURL, eventInvitationURLWithPreview } from '../src/email/invitation-url';

// Intercept the real SES command, not the template method. No mail is sent.
async function main() {
  const output = process.argv[2];
  assert.ok(output, 'Output directory required');
  fs.mkdirSync(output, { recursive: true });
  const report: any[] = [];
  for (const api of ['https://api.cloud-calendars.com', 'https://63yo3ore3c.execute-api.us-east-1.amazonaws.com']) {
    process.env.API_URL = api; process.env.EMAIL_FROM = 'QA <qa@example.com>';
    const service = new EmailService();
    const captured: any[] = [];
    (service as any).ses.send = async (command: any) => { captured.push(command.input); return { MessageId: 'intercepted' }; };
    const url = new URL('/event-invites/open', api);
    url.search = new URLSearchParams({ e: 'qa-event', c: 'qa-feed', title: 'اجتماع'.repeat(20),
      start: '1788951600', end: '1788957000', location: 'عنوان'.repeat(32),
      eventURL: 'https://example.com/' + 'x'.repeat(1000), timeZone: 'Asia/Dubai', color: '#AF52DE' }).toString();
    assert.ok(url.toString().length > 2048);
    const legacy = new URL('https://appclip.apple.com/id'); legacy.search = url.search;
    legacy.searchParams.set('p', 'Deksan.CalendarASD.Clip');
    for (const access of ['reader', 'writer', 'owner']) {
      for (const kind of ['event', 'legacy-event', 'calendar']) {
        const eventUrl = (kind === 'legacy-event' ? legacy : url).toString();
        const event = { title: 'QA اجتماع', start: '2026-09-09T12:00:00Z', end: '2026-09-09T13:30:00Z' };
        if (kind === 'calendar') {
          await service.sendSharedCalendarInvitation({ email: 'qa@example.com', access,
            calendar: { title: 'QA calendar', color: '#AF52DE' }, ownerId: 'qa-owner', calendarId: 'qa-calendar' });
        } else {
          await service.sendSharedEventInvitation({ email: 'qa@example.com', access, eventUrl,
            event, timeZone: 'Asia/Dubai' });
        }
        const command = captured.pop(); assert.ok(command);
        const email = command.Content.Simple;
        const html = email.Body.Html.Data;
        assert.match(html, /src="cid:invitation-qr"/);
        assert.doesNotMatch(html, /shared-event-qr\?url=/);
        const attachment = email.Attachments.find((a: any) => a.ContentId === 'invitation-qr');
        assert.equal(attachment.ContentDisposition, 'INLINE');
        assert.equal(attachment.ContentType, 'image/png');
        const bytes = Buffer.from(attachment.RawContent);
        assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
        const preview = kind === 'calendar' ? null : eventInvitationURLWithPreview(canonicalInvitationURL(eventUrl, api)!, event)!;
        const expected = kind === 'calendar' ? `${api}/icloud-calendar-invites/open?o=qa-owner&c=qa-calendar`
          : canonicalInvitationURL(preview!.toString(), api, true)!.toString();
        assert.ok(email.Body.Text.Data.includes(kind === 'calendar' ? expected
          : preview!.toString()), 'Plain text keeps a usable invitation URL');
        if (kind !== 'calendar') {
          const values = new URL(expected).searchParams;
          assert.equal(values.get('title'), event.title, 'old scanner requires a nonempty title');
          assert.equal(Number(values.get('start')), Date.parse(event.start) / 1000);
          assert.equal(Number(values.get('end')), Date.parse(event.end) / 1000);
          assert.equal(values.get('allDay'), '0');
        }
        assert.ok(bytes.equals((await service.sharedEventQRCodePng(expected))!));
        const label = `${api.includes('execute-api') ? 'debug' : 'production'}-${kind}-${access}`;
        fs.writeFileSync(path.join(output, label + '.png'), bytes);
        fs.writeFileSync(path.join(output, label + '.html'), html.replace('cid:invitation-qr', 'data:image/png;base64,' + bytes.toString('base64')));
        report.push({ label, png: label + '.png', expectedQR: expected, inlinePNG: true });
      }
    }
    for (const bad of ['https://evil.example/event-invites/open?e=a&c=b',
      `${api}/event-invites/open?e=../private&c=b`, `${api}/not-invitation?e=a&c=b`,
      `${api.replace('https:', 'http:')}/event-invites/open?e=a&c=b`,
      `${api.replace('https://', 'https://user:password@')}/event-invites/open?e=a&c=b`]) {
      assert.equal(await service.sharedEventQRCodePng(bad), null);
    }
    for (const [name, title] of [['arabic', 'اجتماع'.repeat(20)], ['emoji', '📅'.repeat(120)], ['plus', 'Coffee + Planning']]) {
      const compact = new URL('/event-invites/open?e=qa-event&c=qa-feed', api);
      const event = { title, start: '2020-01-01T07:45:00Z', end: '2020-01-01T08:00:00Z' };
      const preview = eventInvitationURLWithPreview(compact, event)!;
      const expected = canonicalInvitationURL(preview.toString(), api, true)!.toString();
      assert.equal(new URL(expected).searchParams.get('title'), title);
      const png = await service.sharedEventQRCodePng(expected);
      assert.ok(png, 'long original-language title still renders');
      const label = `${api.includes('execute-api') ? 'debug' : 'production'}-legacy-preview-${name}`;
      fs.writeFileSync(path.join(output, label + '.png'), png);
      report.push({ label, png: label + '.png', expectedQR: expected, inlinePNG: true });
    }
  }
  fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
  console.log(`PASS ${report.length} SES command/inline PNG cases; legacy, long Arabic, all roles, both environments; unsafe URLs rejected`);
}
main().catch(e => { console.error(e); process.exitCode = 1; });
