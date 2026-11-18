import 'reflect-metadata';
import assert from 'node:assert/strict';
import { createApp } from '../src/bootstrap';
import { CoreService } from '../src/core/core.service';
import { WebPlatformService } from '../src/booking/web-platform.service';
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
    const baseURL = await app.getUrl();
    const url = `${baseURL}/ios/calendars/sync`;
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
    const accountURL = `${baseURL}/ios/calendars/account`;
    assert.equal((await fetch(accountURL)).status, 401);
    const inventory = await fetch(accountURL, { headers: { Authorization: 'Bearer route-test' } });
    assert.equal(inventory.status, 200);
    assert.deepEqual(await inventory.json(), { ownerID: 'route-test', calendars: [{ id: 'account', accountLocal: true }] });
    const web=app.get(WebPlatformService);
    const removedKeys: string[] = [];
    store.putJSONIfAbsent = async key => { removedKeys.push(key); return true; };
    const removeURL = (id: string) => `${baseURL}/web-calendar/device-calendars/${id}`;
    assert.equal((await fetch(removeURL('native'), {method: 'DELETE'})).status, 401);
    const remove = (id: string) => fetch(removeURL(id), {method: 'DELETE', headers: {Authorization: 'Bearer route-test'}});
    assert.equal((await remove('account')).status, 400);
    assert.equal((await remove('native')).status, 200);
    assert.deepEqual(removedKeys, ['principal/route-test/web-calendar-removed/native.json']);
    web.providerCalendarWorkspace=async (principal,provider,body)=>{assert.equal(principal.principalId,'route-test');assert.equal(provider,'google');assert.equal(body.action,'state');return {status:200,body:{calendars:[],events:[]}};};
    const providerURL=`${await app.getUrl()}/web-calendar/providers/google`;
    const providerRequest=(token?:string)=>fetch(providerURL,{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify({action:'state'})});
    assert.equal((await providerRequest()).status,401);assert.equal((await providerRequest('invalid')).status,401);
    assert.equal((await providerRequest('route-test')).status,200);
    console.log('PASS: provider workspace uses the existing bearer guard and account identity');
    console.log('PASS: account-local authenticated inventory excludes device-native calendars');
    console.log('PASS: native calendar HTTP route, authentication and read-only lookup');
  } finally {
    await app.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
