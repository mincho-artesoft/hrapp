import assert from 'node:assert/strict';
import { storageReadRevisions } from '../src/store/store.service';
import { WebStateResponses } from '../src/booking/web-state-responses';

async function test() {
  const cache = new WebStateResponses();
  const alice = {principalId: 'alice', calId: 'a'}, bob = {principalId: 'bob', calId: 'b'};
  let reads = 0, httpStatus = 200, etag = '';
  const res = {
    type() { return this; }, vary() { return this; },
    set(key: string, value: string) { if (key === 'ETag') etag = value; return this; },
    status(code: number) { httpStatus = code; return this; },
  };
  const get = (owner: typeof alice, tag?: string, query = {sync: '0'}) =>
    cache.reply(owner, query, tag, res as any, async () => ({
      status: 200, body: {owner: owner.principalId, sequence: ++reads},
    }));
  storageReadRevisions.set(alice, 'first');
  storageReadRevisions.set(bob, 'first');
  const original = await get(alice), oldTag = etag;
  assert.equal(await get(alice), original);
  assert.equal(await get(alice, oldTag), undefined);
  assert.equal(httpStatus, 304);
  assert.equal(reads, 1);
  assert.equal(JSON.parse((await get(bob, oldTag))!).owner, 'bob');
  storageReadRevisions.set(alice, 'second');
  assert.equal(JSON.parse((await get(alice, oldTag))!).sequence, 3);
  // Forced provider refreshes and unversioned stores always perform the read.
  await get(alice, undefined, {sync: '1'});
  await get({...alice});
  assert.equal(reads, 5);
  console.log('PASS full reads, per-account revision invalidation, conditional and forced reads');
}
test().catch(e => {console.error(e); process.exitCode = 1;});
