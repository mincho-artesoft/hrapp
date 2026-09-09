// Remove only retired scheduling HTML, including setup, linking and management.
// Back up every exact target first. Never prune unrelated site objects.
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
const backup = process.argv[2];
if (!backup || !backup.startsWith('/')) throw new Error('Provide an absolute backup directory');
const bucket = 'www.arte-calendar.com';
const aws = (...args) => execFileSync('aws', args, {encoding:'utf8'});
const keys = JSON.parse(aws('s3api','list-objects-v2','--bucket',bucket,'--query','Contents[].Key','--output','json'))
  .filter(key => /^(?:[a-z]{2}(?:-[a-z]+)?\/)?(?:book|booking|bookings|pair)(?:\/[^/]+)*\/index\.html$/.test(key));
mkdirSync(backup,{recursive:true});
writeFileSync(join(backup,'manifest.json'), JSON.stringify({bucket,keys},null,2));
// Back up every target before deleting the first object.
for (const key of keys) {
  const target = resolve(backup,key);
  if (!target.startsWith(resolve(backup)+'/')) throw new Error('Invalid backup target');
  mkdirSync(dirname(target),{recursive:true});
  aws('s3','cp',`s3://${bucket}/${key}`,target,'--only-show-errors');
}
for (const key of keys) aws('s3api','delete-object','--bucket',bucket,'--key',key);
console.log(`Removed ${keys.length} retired HTML pages; recoverable copies: ${backup}`);
