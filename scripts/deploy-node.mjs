#!/usr/bin/env node
/**
 * Pure-Node S3 + CloudFront publisher mirroring scripts/deploy.sh (for Apple Silicon
 * hosts where /usr/local/bin/aws is x86_64 without Rosetta).
 *
 * Preserves the exact 4-pass Cache-Control & Content-Type rules of scripts/deploy.sh:
 *   1. *.js, *.css, media/*                       -> public,max-age=31536000,immutable
 *   2. non-HTML static files                      -> public,max-age=86400
 *   3. *.html                                     -> no-cache,no-store,must-revalidate (text/html; charset=utf-8)
 *   4. .well-known/apple-app-site-association     -> max-age=3600 (application/json)
 * Then creates a CloudFront /* invalidation, waits for completion, submits IndexNow,
 * and runs check-associated-domain.mjs + ai-visibility/live-check.mjs.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import AWS from 'aws-sdk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const ENV_FILE = process.env.ENV_FILE || path.join(ROOT_DIR, '.env');

function loadEnv(filePath) {
  const out = {};
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const k = trimmed.slice(0, eq).trim();
    const v = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '');
    if (k) out[k] = v;
  }
  return out;
}

const env = { ...loadEnv(ENV_FILE), ...process.env };
const BUCKET = env.NG_DEPLOY_AWS_BUCKET;
const REGION = env.NG_DEPLOY_AWS_REGION || 'us-east-1';
const SITE_DOMAIN = env.SITE_DOMAIN || BUCKET;
const DIST_DIR = path.join(ROOT_DIR, 'dist', 'arte-calendar', 'browser');
let DISTRIBUTION_ID = env.CLOUDFRONT_DISTRIBUTION_ID || '';

const USE_AWS_PROFILE = env.USE_AWS_PROFILE === '1';

if (!BUCKET || (!USE_AWS_PROFILE && (!env.NG_DEPLOY_AWS_ACCESS_KEY_ID || !env.NG_DEPLOY_AWS_SECRET_ACCESS_KEY))) {
  console.error('Missing NG_DEPLOY_AWS_BUCKET or AWS credentials');
  process.exit(1);
}
if (!fs.existsSync(path.join(DIST_DIR, 'index.html'))) {
  console.error(`Missing build output at ${DIST_DIR}/index.html`);
  process.exit(1);
}

const creds = USE_AWS_PROFILE
  ? new AWS.SharedIniFileCredentials({ profile: env.AWS_PROFILE || 'default' })
  : new AWS.Credentials({
      accessKeyId: env.NG_DEPLOY_AWS_ACCESS_KEY_ID,
      secretAccessKey: env.NG_DEPLOY_AWS_SECRET_ACCESS_KEY,
    });

const s3 = new AWS.S3({ region: REGION, credentials: creds, maxRetries: 4 });
const cloudfront = new AWS.CloudFront({ region: 'us-east-1', credentials: creds, maxRetries: 4 });

const MIME_BY_EXT = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

function classifyFile(relKey) {
  if (relKey === '.well-known/apple-app-site-association' || relKey === 'apple-app-site-association') {
    return {
      pass: 4,
      cacheControl: 'max-age=3600',
      contentType: 'application/json',
    };
  }
  const ext = path.extname(relKey).toLowerCase();
  if (ext === '.html' || ext === '.xml' || ext === '.txt') {
    return {
      pass: 3,
      cacheControl: 'public, max-age=3600',
      contentType: MIME_BY_EXT[ext] || 'text/html; charset=utf-8',
    };
  }
  if (ext === '.js' || ext === '.css' || relKey.startsWith('media/')) {
    return {
      pass: 1,
      cacheControl: 'public,max-age=31536000,immutable',
      contentType: MIME_BY_EXT[ext] || 'application/octet-stream',
    };
  }
  return {
    pass: 2,
    cacheControl: 'public,max-age=86400',
    contentType: MIME_BY_EXT[ext] || 'application/octet-stream',
  };
}

async function listExistingEtags() {
  const map = new Map();
  let ContinuationToken = undefined;
  do {
    const res = await s3
      .listObjectsV2({ Bucket: BUCKET, ContinuationToken })
      .promise();
    for (const obj of res.Contents || []) {
      if (obj.Key && obj.ETag) {
        map.set(obj.Key, obj.ETag.replace(/"/g, ''));
      }
    }
    ContinuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (ContinuationToken);
  return map;
}

async function uploadBatch(items, concurrency = 24) {
  let idx = 0;
  let uploaded = 0;
  async function worker() {
    while (idx < items.length) {
      const item = items[idx++];
      await s3
        .putObject({
          Bucket: BUCKET,
          Key: item.key,
          Body: item.body,
          CacheControl: item.cacheControl,
          ContentType: item.contentType,
        })
        .promise();
      uploaded++;
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length || 1) }, () => worker()));
  return uploaded;
}

const allFiles = walk(DIST_DIR);
console.log(`▸ Preparing ${allFiles.length} built files from ${DIST_DIR} → s3://${BUCKET}`);
const existingEtags = await listExistingEtags();

const passes = { 1: [], 2: [], 3: [], 4: [] };
let skippedUnchanged = 0;
const forceUpload = process.argv.includes('--force');

for (const file of allFiles) {
  const key = path.relative(DIST_DIR, file).split(path.sep).join('/');
  const body = fs.readFileSync(file);
  const meta = classifyFile(key);
  const md5 = crypto.createHash('md5').update(body).digest('hex');

  if (!forceUpload && existingEtags.get(key) === md5) {
    skippedUnchanged++;
    continue;
  }
  passes[meta.pass].push({ key, body, ...meta });
}

console.log(`▸ MD5 diff: ${skippedUnchanged} unchanged files skipped; uploading changed files only:`);
console.log(`▸ 1/4 fingerprinted bundles (${passes[1].length} new/changed)`);
await uploadBatch(passes[1]);

console.log(`▸ 2/4 static files (${passes[2].length} new/changed)`);
await uploadBatch(passes[2]);

console.log(`▸ 3/4 prerendered HTML/XML/TXT (${passes[3].length} new/changed → public, max-age=3600)`);
await uploadBatch(passes[3]);

console.log(`▸ 4/4 apple-app-site-association (${passes[4].length} files → application/json)`);
await uploadBatch(passes[4]);

if (!DISTRIBUTION_ID) {
  const list = await cloudfront.listDistributions().promise();
  for (const dist of list.DistributionList?.Items || []) {
    const aliases = dist.Aliases?.Items || [];
    if (aliases.includes(SITE_DOMAIN) || aliases.includes(`www.${SITE_DOMAIN.replace(/^www\./, '')}`)) {
      DISTRIBUTION_ID = dist.Id;
      break;
    }
  }
}

if (!DISTRIBUTION_ID) {
  console.error('✗ Could not determine CLOUDFRONT_DISTRIBUTION_ID');
  process.exit(1);
}

console.log(`▸ Invalidating CloudFront ${DISTRIBUTION_ID} (/*)…`);
const inv = await cloudfront
  .createInvalidation({
    DistributionId: DISTRIBUTION_ID,
    InvalidationBatch: {
      CallerReference: `deploy-${Date.now()}`,
      Paths: { Quantity: 1, Items: ['/*'] },
    },
  })
  .promise();
const invId = inv.Invalidation?.Id;
console.log(`▸ Invalidation ${invId} created; waiting for completion…`);

while (true) {
  const statusRes = await cloudfront
    .getInvalidation({ DistributionId: DISTRIBUTION_ID, Id: invId })
    .promise();
  if (statusRes.Invalidation?.Status === 'Completed') break;
  await new Promise((r) => setTimeout(r, 4000));
}
console.log('▸ CloudFront invalidation completed.');

for (const [cmd, args] of [
  [process.execPath, [path.join(ROOT_DIR, 'ai-visibility/indexnow.mjs'), `https://${SITE_DOMAIN}`, `--sitemap-file=${path.join(DIST_DIR, 'sitemap.xml')}`]],
  [process.execPath, [path.join(ROOT_DIR, 'scripts/check-associated-domain.mjs'), `https://${SITE_DOMAIN}`]],
  [process.execPath, [path.join(ROOT_DIR, 'ai-visibility/live-check.mjs'), `https://${SITE_DOMAIN}`]],
]) {
  const res = spawnSync(cmd, args, { cwd: ROOT_DIR, stdio: 'inherit' });
  if (res.status !== 0) {
    console.warn(`! Post-deploy check exited with ${res.status}: ${args[0]}`);
  }
}

console.log(`▸ LIVE DEPLOY COMPLETE: https://${SITE_DOMAIN}`);
