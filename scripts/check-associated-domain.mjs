import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Do not follow redirects: a final 200 can still conceal an Apple AASA failure.
const base = new URL(process.argv[2] || 'https://www.cloud-calendars.com');
assert.equal(base.protocol, 'https:');
const expected = JSON.parse(readFileSync(new URL('../public/.well-known/apple-app-site-association', import.meta.url), 'utf8'));
for (const path of [
  '/.well-known/apple-app-site-association',
  '/.well-known/apple-app-site-association/',
  '/apple-app-site-association',
  '/apple-app-site-association/',
]) {
  for (const method of ['GET', 'HEAD']) {
    const url = new URL(path, base);
    const response = await fetch(url, { method, redirect: 'manual', signal: AbortSignal.timeout(20000) });
    assert.equal(response.status, 200, `${method} ${url}: expected 200 without redirect, got ${response.status}`);
    assert.equal(response.headers.get('location'), null, `${url}: unexpected Location header`);
    assert.match(response.headers.get('content-type') || '', /^application\/json(?:;|$)/i, `${url}: expected JSON`);
    if (method === 'GET') assert.deepEqual(await response.json(), expected, `${url}: AASA differs from deployed source`);
    console.log(`PASS ${method} ${url}: 200 application/json, no redirect`);
  }
}
