import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

const context = vm.createContext({});
vm.runInContext(readFileSync(new URL('../../infrastructure/cloudfront-router.js', import.meta.url), 'utf8'), context);
const canonical = '/.well-known/apple-app-site-association';
const request = (host, uri, method = 'GET', querystring = {}) => ({
  method, uri, querystring, headers: { host: { value: host } }, cookies: {},
});

for (const host of ['www.cloud-calendars.com', 'cloud-calendars.com']) {
  for (const uri of [canonical, canonical + '/', '/apple-app-site-association', '/apple-app-site-association/']) {
    for (const method of ['GET', 'HEAD']) {
      test(`${method} ${host}${uri}: internally serves AASA without redirects`, () => {
        const input = request(host, uri, method, { probe: { value: 'unchanged' } });
        const output = context.handler({ request: input });
        assert.equal(output, input);
        assert.equal(output.uri, canonical);
        assert.equal(output.method, method);
        assert.equal(output.headers.host.value, host);
        assert.deepEqual(output.querystring, { probe: { value: 'unchanged' } });
        assert.equal(output.statusCode, undefined);
        assert.equal(output.headers.location, undefined);
      });
    }
  }
}

for (const uri of ['/', '/privacy/', '/assets/logo.png', '/robots.txt', '/.well-known/security.txt']) {
  test(`www${uri}: unchanged request`, () => {
    const input = request('www.cloud-calendars.com', uri);
    assert.equal(context.handler({ request: input }), input);
    assert.equal(input.uri, uri);
  });
}

for (const [host, uri, target] of [
  ['cloud-calendars.com', '/', 'https://www.cloud-calendars.com/'],
  ['cloud-calendars.com', '/privacy', 'https://www.cloud-calendars.com/privacy/'],
  ['cloud-calendars.com', '/privacy/', 'https://www.cloud-calendars.com/privacy/'],
  ['cloud-calendars.com', '/robots.txt', 'https://www.cloud-calendars.com/robots.txt'],
  ['www.cloud-calendars.com', '/privacy', 'https://www.cloud-calendars.com/privacy/'],
  ['www.cloud-calendars.com', '/.well-known/other', 'https://www.cloud-calendars.com/.well-known/other/'],
  ['www.cloud-calendars.com', '/apple-app-site-association-extra', 'https://www.cloud-calendars.com/apple-app-site-association-extra/'],
]) {
  test(`${host}${uri}: retains normal website redirect and query`, () => {
    const output = context.handler({ request: request(host, uri, 'GET', { lang: { value: 'en' } }) });
    assert.equal(output.statusCode, 301);
    assert.equal(output.headers.location.value, target + '?lang=en');
    assert.equal(output.headers['cache-control'].value, 'public,max-age=31536000');
  });
}
