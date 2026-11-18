import assert from 'node:assert/strict';
import test from 'node:test';
import { stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const origin = 'https://www.cloud-calendars.com';
const debug = 'https://storage.wonek.com/cloud-calendars-debug';
const dist = new URL('../../dist/arte-calendar/browser/', import.meta.url);

async function serveSite(route, url) {
  if (url.pathname.startsWith('/media/')) return route.fulfill({status: 404, body: ''});
  let file = fileURLToPath(new URL('.' + url.pathname, dist));
  const entry = await stat(file).catch(() => null);
  if (!entry) return route.fulfill({status: 404, body: ''});
  if (entry.isDirectory()) file = file.replace(/\/$/, '') + '/index.html';
  return route.fulfill({path: file});
}

test('Apple sign-in opens the existing Debug workspace even when profile loading needs a retry', async () => {
  const browser = await chromium.launch(process.env.CHROME_CHANNEL ? {channel: process.env.CHROME_CHANNEL} : {});
  try {
    const page = await browser.newPage({viewport: {width: 1200, height: 850}});
    let profileRequests = 0, calendarRequests = 0;
    await page.route('**/*', async route => {
      const request = route.request(), url = new URL(request.url());
      if (url.origin === origin) {
        return serveSite(route, url);
      }
      if (!request.url().startsWith(debug + '/')) return route.abort();
      const path = url.pathname.slice(new URL(debug).pathname.length);
      if (path === '/auth/providers') return route.fulfill({json: {appleWebClientId: 'calendar-test-client'}});
      if (path === '/resolve') {
        assert.equal(request.postDataJSON().provider, 'apple');
        assert.equal(request.headers().authorization, undefined);
        return route.fulfill({json: {deviceToken: 'test-debug-session', calendarId: 'account-calendar'}});
      }
      if (path === '/me/profile') {
        assert.equal(request.headers().authorization, 'Bearer test-debug-session');
        if (++profileRequests === 1) return route.fulfill({status: 503, json: {error: 'Temporary error'}});
        return route.fulfill({json: {principalId: 'existing-account', calendarId: 'account-calendar',
          email: 'calendar@example.invalid', verifiedEmails: ['calendar@example.invalid'], identities: [{provider:'apple'}]}});
      }
      if (path === '/web-calendar/state') {
        calendarRequests++;
        assert.equal(request.headers().authorization, 'Bearer test-debug-session');
        const start = new Date(Date.now() + 3600000), end = new Date(+start + 3600000);
        return route.fulfill({json: {calendar: {id: 'account-calendar'}, calendars: [
          {id: 'existing-local', title: 'Local calendar', source: 'Local Calendars', allowsChanges: true}],
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
    assert.equal(await dialog.getByRole('button', {name: 'Connect', exact: true}).count(), 2);
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
      await dialog.getByRole('button', {name: 'Close', exact: true}).click();
      await signOut.click({trial: true});
      const accountBounds = await account.boundingBox();
      const bounds = await signOut.boundingBox();
      assert.ok(bounds && bounds.x >= 0 && bounds.x + bounds.width <= width);
      assert.ok(accountBounds && accountBounds.x >= 0 && accountBounds.x + accountBounds.width <= bounds.x);
    }
    await signOut.click();
    const signIn = page.getByRole('button', {name: 'Sign in with Apple', exact: true});
    await signIn.waitFor();
    assert.equal(await signOut.count(), 0);
    assert.equal(await account.count(), 0);
    assert.equal(await page.locator('.cal-shell').count(), 0);
    assert.equal(await page.evaluate(() => localStorage.getItem('cc_web_session_v1_debug')), null);
    await page.reload({waitUntil: 'domcontentloaded'});
    await signIn.waitFor();
    assert.equal(await signOut.count(), 0);
    assert.equal(profileRequests, 2);
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
      if (!url.href.startsWith(debug + '/')) return route.abort();
      const path = url.pathname.slice(new URL(debug).pathname.length);
      if (path === '/me/profile') return route.fulfill({json: {principalId: 'test', identities: [{provider:'apple'}],
        verifiedEmails: ['calendar@example.invalid'], connectedProviders: statuses()}});
      if (path === '/web-calendar/state') return route.fulfill({json: {calendar: {}, calendars: [
        {id: 'local', source: 'Local Calendars', title: 'My local calendar', allowsChanges:true},
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
      localStorage.setItem('cc_web_session_v1_debug', 'isolated-test-session');
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
    assert.equal(await menu.getByText(/Subscribed Calendars|mobile@example.invalid|Mobile (Google|Microsoft) copy/).count(), 0);
    for (const provider of ['google','microsoft']) {
      const group = menu.locator('details').filter({hasText: provider + '@example.invalid'});
      await group.getByText(provider + ' web calendar', {exact:true}).waitFor();
      await group.getByRole('button', {name: 'Sign out', exact: true}).click();
      await group.getByRole('button', {name: 'Sign out', exact: true}).click();
      await menu.getByRole('button', {name: new RegExp('^sign in with ' + provider + '$','i')}).waitFor();
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
