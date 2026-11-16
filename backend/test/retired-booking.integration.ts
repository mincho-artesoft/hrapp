import 'reflect-metadata';
import assert from 'node:assert/strict';
import { createApp } from '../src/bootstrap';

// Real application routing. Requests below never authenticate or access storage.
const retired: [string, string][] = [
  ['GET', '/book/test'], ['GET', '/book/test/slots'], ['POST', '/book/test'],
  ['GET', '/booking'], ['PUT', '/booking'], ['PUT', '/booking/busy'],
  ['GET', '/booking/events'], ['POST', '/booking/events/test/cancel'],
  ['POST', '/booking/events/test/reschedule'], ['GET', '/manage/test'],
  ['POST', '/manage/test/cancel'], ['POST', '/manage/test/reschedule'],
  ['POST', '/pair/start'], ['GET', '/pair/status'], ['POST', '/pair/approve'],
  ['POST', '/billing/checkout'], ['POST', '/billing/webhook'],
  ['POST', '/me/login'], ['GET', '/me/bookings'],
];

async function main() {
  const app = await createApp();
  await app.listen(0, '127.0.0.1');
  try {
    const base = await app.getUrl();
    for (const [method, path] of retired) {
      const response = await fetch(base + path, {method});
      assert.equal(response.status, 404, `${method} ${path} must be retired`);
    }
    for (const path of ['/me', '/event-invitations/pending', '/icloud-calendars-shared-with-me', '/shared-events']) {
      assert.equal((await fetch(base + path)).status, 401, `${path} must remain protected`);
    }
    console.log(`PASS ${retired.length} retired routes return 404; 4 account/sharing routes remain protected`);
  } finally { await app.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
