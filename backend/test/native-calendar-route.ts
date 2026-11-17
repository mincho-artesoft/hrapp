import 'reflect-metadata';
import assert from 'node:assert/strict';
import { createApp } from '../src/bootstrap';
import { CoreService } from '../src/core/core.service';
import { StoreService } from '../src/store/store.service';

// Exercise the actual Nest route and bearer guard, without remote storage.
async function main() {
  const app = await createApp();
  const core = app.get(CoreService);
  const store = app.get(StoreService);
  core.resolveToken = async token => token === 'route-test' ? { principalId: 'route-test' } as any : null;
  store.getJSONWithETag = async () => null;
  store.getJSON = async key => ({ id: key.endsWith('account.json') ? 'account' : 'native', accountLocal: key.endsWith('account.json') });
  store.listKeys = async prefix => {
    assert.equal(prefix, 'principal/route-test/native-calendars/');
    return [prefix + 'account.json', prefix + 'native.json'];
  };
  try {
    await app.listen(0, '127.0.0.1');
    const url = `${await app.getUrl()}/ios/calendars/sync`;
    const request = (token?: string) => fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ id: 'calendar', deviceId: 'device', readOnly: true }),
    });
    assert.equal((await request()).status, 401);
    assert.equal((await request('invalid')).status, 401);
    const response = await request('route-test');
    assert.equal(response.status, 200);
    assert.equal((await response.json() as any).calendar, null);
    const accountURL = `${await app.getUrl()}/ios/calendars/account`;
    assert.equal((await fetch(accountURL)).status, 401);
    const inventory = await fetch(accountURL, { headers: { Authorization: 'Bearer route-test' } });
    assert.equal(inventory.status, 200);
    assert.deepEqual(await inventory.json(), { ownerID: 'route-test', calendars: [{ id: 'account', accountLocal: true }] });
    console.log('PASS: account-local authenticated inventory excludes device-native calendars');
    console.log('PASS: native calendar HTTP route, authentication and read-only lookup');
  } finally {
    await app.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
