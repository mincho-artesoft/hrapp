import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const origin = 'https://www.cloud-calendars.com';
const apiOrigin = 'https://api.cloud-calendars.com';
const dist = new URL('../../dist/arte-calendar/browser/', import.meta.url);

async function serveSite(route, url) {
  if (url.pathname.startsWith('/media/')) return route.fulfill({status: 404, body: ''});
  let file = fileURLToPath(new URL('.' + url.pathname, dist));
  const entry = await stat(file).catch(() => null);
  if (!entry) return route.fulfill({status: 404, body: ''});
  if (entry.isDirectory()) file = file.replace(/\/$/, '') + '/index.html';
  return route.fulfill({path: file});
}

test('Apple sign-in opens the existing calendar workspace even when profile loading needs a retry', async () => {
  const browser = await chromium.launch(process.env.CHROME_CHANNEL ? {channel: process.env.CHROME_CHANNEL} : {});
  try {
    const context = await browser.newContext({viewport: {width: 1200, height: 850}});
    const page = await context.newPage();
    let profileRequests = 0, calendarRequests = 0, signOutRequests = 0;
    await page.context().route('**/*', async route => {
      const request = route.request(), url = new URL(request.url());
      if (url.origin === origin) {
        return serveSite(route, url);
      }
      if (url.origin !== apiOrigin) return route.abort();
      const path = url.pathname;
      if (path === '/auth/providers') return route.fulfill({json: {appleWebClientId: 'calendar-test-client'}});
      if (path === '/identities/apple' && request.method() === 'DELETE') {
        return route.fulfill({status: 409, json: {error: 'Keep the test account connected'}});
      }
      if (path === '/auth/web-session') {
        signOutRequests++;
        assert.equal(request.method(), 'DELETE');
        assert.equal(request.headers().authorization, 'Bearer test-apple-session');
        return route.fulfill({json: {signedOut: true}});
      }
      if (path === '/resolve') {
        assert.equal(request.postDataJSON().provider, 'apple');
        assert.equal(request.headers().authorization, undefined);
        return route.fulfill({json: {deviceToken: 'test-apple-session', calendarId: 'account-calendar'}});
      }
      if (path === '/me/profile') {
        assert.equal(request.headers().authorization, 'Bearer test-apple-session');
        if (++profileRequests === 1) return route.fulfill({status: 503, json: {error: 'Temporary error'}});
        return route.fulfill({json: {principalId: 'existing-account', calendarId: 'account-calendar',
          email: 'calendar@example.invalid', verifiedEmails: ['calendar@example.invalid'], identities: [{provider:'apple'}]}});
      }
      if (path === '/web-calendar/state') {
        calendarRequests++;
        assert.equal(request.headers().authorization, 'Bearer test-apple-session');
        const start = new Date(Date.now() + 3600000), end = new Date(+start + 3600000);
        return route.fulfill({json: {calendar: {id: 'account-calendar'}, calendars: [
          {id: 'existing-local', title: 'Local calendar', source: 'Local Calendars', accountLocal:true, allowsChanges: true}],
          events: [{id: 'native.existing-local.example', calendarId: 'existing-local', title: 'Existing native event', start, end}]}});
      }
      return route.fulfill({json: {}});
    });
    await page.addInitScript(() => {
      let options;
      window.AppleID = {auth: {
        init(config) { options = config; },
        async signIn() {
          const payload = btoa(JSON.stringify({nonce: options.nonce})).replace(/=/g, '');
          return {authorization: {state: options.state, id_token: 'test.' + payload + '.test'}};
        },
      }};
    });
    await page.goto(origin + '/calendar/', {waitUntil: 'domcontentloaded'});
    await page.getByRole('button', {name: 'Sign in with Apple', exact: true}).click();
    await page.getByRole('button', {name: 'Try Again'}).click();
    await page.locator('.up-next', {hasText: 'Existing native event'}).waitFor();
    assert.equal(profileRequests, 2);
    assert.equal(calendarRequests, 1);

    const header = page.locator('app-header');
    const signOut = header.getByRole('button', {name: 'Sign Out', exact: true});
    const account = header.getByRole('button', {name: 'Cloud Calendars account', exact: true});
    const dialog = page.getByRole('dialog', {name: 'Cloud Calendars account', exact: true});
    await account.click();
    await dialog.getByText('Connected', {exact: true}).waitFor();
    for (const name of ['Google Connect', 'Microsoft Connect']) {
      await dialog.getByRole('button', {name, exact: true}).waitFor();
    }
    await page.keyboard.press('Escape');
    await dialog.waitFor({state: 'hidden'});
    assert.equal(await account.evaluate(el => el === document.activeElement), true);
    await page.locator('.desktop-menu').click();
    const menu = page.locator('cc-calendar-menu').first();
    await menu.getByRole('button', {name: 'Sharing', exact: true}).click();
    await menu.getByText('Pending invitations', {exact: true}).waitFor();
    assert.equal(await menu.getByText('Web Sign-In & Authenticator', {exact: true}).count(), 0);
    assert.equal(await menu.getByText('Cloud Calendars account', {exact: true}).count(), 0);
    await signOut.click({trial: true});
    for (const width of [1440, 768, 375, 320]) {
      await page.setViewportSize({width, height: 850});
      await account.click();
      const google = dialog.getByRole('button', {name: 'Google Connect', exact: true});
      const unlink = dialog.getByRole('button', {name: 'Sign Out', exact: true});
      const row = await unlink.boundingBox();
      const connect = await google.boundingBox();
      assert.ok(row && connect && Math.abs(connect.width - row.width) < 1);
      await google.click({position: {x: 4, y: connect.height / 2}});
      await dialog.getByRole('alert').filter({hasText: 'Google Web OAuth Client ID'}).waitFor();
      await unlink.click({position: {x: row.width - 4, y: row.height / 2}});
      await dialog.getByRole('alert').filter({hasText: 'Keep the test account connected'}).waitFor();
      await dialog.getByRole('button', {name: 'Close', exact: true}).click();
      await signOut.click({trial: true});
      const accountBounds = await account.boundingBox();
      const bounds = await signOut.boundingBox();
      assert.ok(bounds && bounds.x >= 0 && bounds.x + bounds.width <= width);
      assert.ok(accountBounds && accountBounds.x >= 0 && accountBounds.x + accountBounds.width <= bounds.x);
    }
    const sibling = await page.context().newPage();
    await sibling.goto(origin + '/calendar/', {waitUntil:'domcontentloaded'});
    const siblingAccount = sibling.getByRole('button', {name:'Cloud Calendars account', exact:true});
    await siblingAccount.click();
    await sibling.getByRole('dialog').getByText('Connected', {exact:true}).waitFor();
    await signOut.click();
    await sibling.getByRole('button', {name:'Sign in with Apple', exact:true}).waitFor();
    assert.equal(await sibling.getByRole('dialog').count(), 0);
    assert.equal(signOutRequests, 1);
    const signIn = page.getByRole('button', {name: 'Sign in with Apple', exact: true});
    await signIn.waitFor();
    assert.equal(await signOut.count(), 0);
    assert.equal(await account.count(), 0);
    assert.equal(await page.locator('.cal-shell').count(), 0);
    assert.equal(await page.evaluate(() => localStorage.getItem('cc_web_session_v1')), null);
    await page.reload({waitUntil: 'domcontentloaded'});
    await signIn.waitFor();
    assert.equal(await signOut.count(), 0);
    assert.equal(profileRequests, 3);
  } finally {
    await browser.close();
  }
});

test('calendar controls stay aligned, and only web provider connections appear in Calendar', async () => {
  const browser = await chromium.launch(process.env.CHROME_CHANNEL ? {channel: process.env.CHROME_CHANNEL} : {});
  try {
    const page = await browser.newPage({viewport: {width: 1440, height: 900}, locale: 'en-US'});
    const connected = {google: true, microsoft: true};
    const statuses = () => Object.fromEntries(Object.entries(connected).map(([name, value]) =>
      [name, {connected: value, accountEmail: value ? name + '@example.invalid' : null}]));
    const disconnects = [];
    await page.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.origin === origin) return serveSite(route, url);
      if (url.origin !== apiOrigin) return route.abort();
      const path = url.pathname;
      if (path === '/me/profile') return route.fulfill({json: {principalId: 'test', identities: [{provider:'apple'}],
        verifiedEmails: ['calendar@example.invalid'], connectedProviders: statuses()}});
      if (path === '/web-calendar/state') return route.fulfill({json: {calendar: {}, calendars: [
        {id: 'local', source: 'Local Calendars', accountLocal:true, title: 'My local calendar', allowsChanges:true},
        {id:'old-device-copy', source:'Local Calendars', title:'Provider device copy'},
        {id: 'subscription', source: 'Subscribed Calendars', title: 'Device subscription'},
        {id: 'legacy-mirror', source: 'Google · mobile@example.invalid', title: 'Mobile Google copy'},
        {id: 'mirror', source: 'Microsoft · mobile@example.invalid', providerMirrorID: 'mirror-key', title: 'Mobile Microsoft copy'},
      ], events: []}});
      if (path.startsWith('/web-calendar/providers/')) {
        const provider = path.split('/').pop();
        return route.fulfill({json: {calendars: [{provider, id: provider + '-web', source: provider,
          title: provider + ' web calendar', allowsChanges: true}], events: []}});
      }
      if (path === '/web-calendar/sync-provider') {
        const {provider, disconnect} = route.request().postDataJSON();
        assert.equal(disconnect, true);
        connected[provider] = false;
        disconnects.push(provider);
        return route.fulfill({json: {events: [], sources: {}, connectedProviders: statuses()}});
      }
      return route.fulfill({json: {}});
    });
    await page.addInitScript(() => {
      localStorage.setItem('cc_web_session_v1', 'isolated-test-session');
      localStorage.setItem('cc.mac.view', 'day');
      localStorage.setItem('cc.mac.preferences', JSON.stringify({time:'12'}));
    });
    await page.goto(origin + '/calendar/', {waitUntil: 'domcontentloaded'});
    const toolbar = page.locator('.cal-toolbar__right');
    await toolbar.getByRole('button', {name: 'Calendar views'}).waitFor();
    const centers = await toolbar.locator('button').evaluateAll(buttons => buttons.map(button => {
      const icon = button.querySelector('cc-symbol').getBoundingClientRect(), rect = button.getBoundingClientRect();
      return {x: rect.x + rect.width / 2, y: rect.y + rect.height / 2,
        iconX: icon.x + icon.width / 2, iconY: icon.y + icon.height / 2};
    }));
    assert.equal(centers.length, 4);
    for (const c of centers) {
      assert.ok(Math.abs(c.iconX - c.x) < 1 && Math.abs(c.iconY - c.y) < 1);
      assert.ok(Math.abs(c.y - centers[0].y) < 1);
    }
    assert.ok(await page.locator('.tl-hour-lbl').evaluateAll(labels => labels.length === 25 &&
      labels.every(el => el.clientHeight <= 15 && el.scrollWidth <= el.clientWidth)));
    assert.match(await page.locator('.tl-now-pill').innerText(), /[AP]M/);

    await toolbar.getByRole('button', {name: 'Menu', exact: true}).click();
    const menu = page.locator('cc-calendar-menu').first();
    await menu.getByText('My local calendar', {exact:true}).waitFor();
    assert.equal(await menu.getByText('Provider device copy', {exact:true}).count(),0);
    assert.equal(await menu.getByText(/Subscribed Calendars|mobile@example.invalid|Mobile (Google|Microsoft) copy/).count(), 0);
    for (const provider of ['google','microsoft']) {
      const group = menu.locator('details').filter({hasText: provider + '@example.invalid'});
      await group.getByText(provider + ' web calendar', {exact:true}).waitFor();
      await group.getByRole('button', {name: 'Sign out', exact: true}).click();
      await menu.getByRole('button', {name: new RegExp('^sign in with ' + provider + '$','i')}).waitFor();
      assert.equal(await menu.locator('cc-calendar-action-sheet').count(), 0);
    }
    assert.deepEqual(disconnects, ['google','microsoft']);
    await page.reload({waitUntil: 'domcontentloaded'});
    await page.locator('.desktop-menu').click();
    await menu.getByRole('button', {name:'Sign in with Google'}).waitFor();
    await menu.getByRole('button', {name:'Sign in with Microsoft'}).waitFor();
    assert.equal(await menu.getByText(/Subscribed Calendars|mobile@example.invalid/).count(), 0);
    assert.equal(await page.locator('app-header').getByRole('button', {name:'Sign Out', exact:true}).count(), 1);
  } finally {
    await browser.close();
  }
});

test('a restored session loads events during profile verification and displays them only after it succeeds', async () => {
  const browser = await chromium.launch(process.env.CHROME_CHANNEL ? {channel: process.env.CHROME_CHANNEL} : {});
  let releaseProfile, releaseBundle;
  const bundle = new Promise(resolve => { releaseBundle = resolve; });
  const verification = new Promise(resolve => { releaseProfile = resolve; });
  try {
    const page = await browser.newPage({viewport: {width: 1200, height: 850}});
    await page.clock.install();
    await page.addInitScript(() => localStorage.setItem('cc_web_session_v1', 'restored-test-session'));
    let stateRequests = 0;
    await page.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.origin === origin) {
        if (/^\/main-[^/]+\.js$/.test(url.pathname)) await bundle;
        return serveSite(route, url);
      }
      if (url.origin !== apiOrigin) return route.abort();
      if (url.pathname === '/me/profile') {
        await verification;
        return route.fulfill({json: {principalId: 'alice', calendarId: 'cal', verifiedEmails: ['alice@example.invalid'], identities: []}});
      }
      if (url.pathname === '/web-calendar/state') {
        assert.equal(route.request().headers().authorization, 'Bearer restored-test-session');
        stateRequests++;
        const tag = 'W/"workspace-one"';
        if (stateRequests > 1) assert.equal(route.request().headers()['if-none-match'], tag);
        if (stateRequests === 2) return route.fulfill({status: 304, headers: {etag: tag}});
        return route.fulfill({headers: {etag: stateRequests === 1 ? tag : 'W/"workspace-two"', 'access-control-expose-headers': 'ETag'}, json: {
          calendar: {id: 'cal'}, calendars: [{id: 'local', title: 'Local calendar', accountLocal: true, allowsChanges: true}],
          events: [{id: 'native.local.example', calendarId: 'local', title: stateRequests === 1 ? 'Restored appointment' : 'Moved appointment',
            start: new Date(Date.now() + 3600000), end: new Date(Date.now() + 7200000)}],
        }});
      }
      return route.fulfill({json: {}});
    });
    const state = page.waitForResponse(response => new URL(response.url()).pathname === '/web-calendar/state');
    const navigation = page.goto(origin + '/calendar/', {waitUntil: 'domcontentloaded'});
    await state; // The real HTML starts the read before Angular's main bundle is allowed to load.
    releaseBundle();
    await navigation;
    assert.equal(await page.locator('.cal-shell').count(), 0);
    releaseProfile();
    await page.locator('.up-next', {hasText: 'Restored appointment'}).waitFor();
    assert.equal(stateRequests, 1);
    const unchanged = page.waitForResponse(r => r.status() === 304 && new URL(r.url()).pathname === '/web-calendar/state');
    await page.clock.fastForward(21000);
    await unchanged;
    await page.locator('.up-next', {hasText: 'Restored appointment'}).waitFor();
    await page.clock.fastForward(21000);
    await page.locator('.up-next', {hasText: 'Moved appointment'}).waitFor();
    assert.equal(stateRequests, 3);
  } finally {
    releaseBundle();
    releaseProfile();
    await browser.close();
  }
});

test('Arabic calendar settings mirror menus and update the visible clock immediately', async () => {
  const browser = await chromium.launch(process.env.CHROME_CHANNEL ? {channel: process.env.CHROME_CHANNEL} : {});
  try {
    const page = await browser.newPage({viewport: {width: 1280, height: 840}, locale: 'en-US'});
    await page.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.origin === origin) return serveSite(route, url);
      if (url.origin !== apiOrigin) return route.abort();
      if (url.pathname === '/me/profile') return route.fulfill({json: {
        principalId: 'fixture', verifiedEmails: ['test@example.invalid'],
        identities: [{provider:'google', email:'test@example.invalid'}],
      }});
      if (url.pathname === '/web-calendar/state') return route.fulfill({json: {calendars: [], events: []}});
      return route.fulfill({json: {}});
    });
    await page.addInitScript(() => {
      localStorage.setItem('cc_web_session_v1', 'isolated-test-session');
      localStorage.setItem('cc.mac.view', 'day');
      localStorage.setItem('cc.mac.preferences', JSON.stringify({time: '24', date:'yearMonthDayDot', firstWeekday:'1'}));
    });
    await page.goto(origin + '/calendar/?lang=ar', {waitUntil: 'domcontentloaded'});
    await page.locator('.studio[dir=rtl] .tl-hour-lbl').first().waitFor();
    const toggleMenu = page.locator('.cal-toolbar__right button.desktop-menu');
    await toggleMenu.click();
    const menu = page.locator('cc-calendar-menu').filter({visible:true}).first();
    const translations = JSON.parse(await readFile(new URL('calendar-locales/ar.json', dist), 'utf8'));
    await menu.getByRole('button', {name:translations['Settings'], exact:true}).click();
    const clock = menu.getByRole('button', {name:translations['Time Format'], exact:true});
    await clock.click();
    const popup = menu.locator('dialog[open]');
    await popup.waitFor();
    const bounds = await popup.boundingBox(), anchor = await clock.boundingBox();
    const expectedLeft = Math.max(8, Math.min(anchor.x, page.viewportSize().width - 8 - bounds.width));
    assert.ok(Math.abs(bounds.x - expectedLeft) < 2);
    await popup.getByRole('menuitemradio').nth(1).click();
    await toggleMenu.click();
    await page.waitForFunction(() => Array.from(document.querySelectorAll('.tl-hour-lbl')).some(el => /[صم]/.test(el.textContent)));
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('cc.mac.preferences')).time), '12');
  } finally {
    await browser.close();
  }
});
