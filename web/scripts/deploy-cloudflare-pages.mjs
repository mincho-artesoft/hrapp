#!/usr/bin/env node
/**
 * Direct-upload deployer for Cloudflare Pages (`arte-cloud-calendars-main` -> www.cloud-calendars.com).
 *
 * - Computes exact Wrangler BLAKE3 asset hashes (`blake3(base64(bytes) + ext).slice(0, 32)`).
 * - Preserves external R2/S3-backed `/media/panel/*`, `/assets/*`, and `/BingSiteAuth.xml`
 *   hashes already stored in Cloudflare Pages without re-downloading gigabytes locally.
 * - Publishes the freshly built `dist/arte-calendar/browser` bundle, `_headers`, and `_redirects`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist', 'arte-calendar', 'browser');
const PROJECT_NAME = process.env.CF_PAGES_PROJECT || 'arte-cloud-calendars-main';

// ── Pure-JS RFC/Spec BLAKE3 (exact 32-byte digest) ─────────────────────────
const IV = new Uint32Array([
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
  0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
]);
const MSG_PERM = [2, 6, 3, 10, 7, 0, 4, 13, 1, 11, 12, 5, 9, 14, 15, 8];
const CHUNK_START = 1;
const CHUNK_END = 2;
const PARENT = 4;
const ROOT = 8;

function rotr32(x, n) {
  return ((x >>> n) | (x << (32 - n))) >>> 0;
}

function g(s, a, b, c, d, mx, my) {
  s[a] = (s[a] + s[b] + mx) >>> 0;
  s[d] = rotr32(s[d] ^ s[a], 16);
  s[c] = (s[c] + s[d]) >>> 0;
  s[b] = rotr32(s[b] ^ s[c], 12);
  s[a] = (s[a] + s[b] + my) >>> 0;
  s[d] = rotr32(s[d] ^ s[a], 8);
  s[c] = (s[c] + s[d]) >>> 0;
  s[b] = rotr32(s[b] ^ s[c], 7);
}

function compress(cv, blockWords, counter, blockLen, flags) {
  const s = new Uint32Array([
    cv[0], cv[1], cv[2], cv[3],
    cv[4], cv[5], cv[6], cv[7],
    IV[0], IV[1], IV[2], IV[3],
    counter >>> 0, Math.floor(counter / 0x100000000) >>> 0, blockLen >>> 0, flags >>> 0,
  ]);
  let m = new Uint32Array(blockWords);
  for (let r = 0; r < 7; r++) {
    g(s, 0, 4, 8, 12, m[0], m[1]);
    g(s, 1, 5, 9, 13, m[2], m[3]);
    g(s, 2, 6, 10, 14, m[4], m[5]);
    g(s, 3, 7, 11, 15, m[6], m[7]);
    g(s, 0, 5, 10, 15, m[8], m[9]);
    g(s, 1, 6, 11, 12, m[10], m[11]);
    g(s, 2, 7, 8, 13, m[12], m[13]);
    g(s, 3, 4, 9, 14, m[14], m[15]);
    if (r < 6) {
      const next = new Uint32Array(16);
      for (let i = 0; i < 16; i++) next[i] = m[MSG_PERM[i]];
      m = next;
    }
  }
  for (let i = 0; i < 8; i++) {
    s[i] = (s[i] ^ s[i + 8]) >>> 0;
    s[i + 8] = (s[i + 8] ^ cv[i]) >>> 0;
  }
  return s;
}

function wordsFromBytes(bytes, offset, len) {
  const w = new Uint32Array(16);
  for (let i = 0; i < len; i++) {
    w[i >>> 2] |= bytes[offset + i] << ((i & 3) * 8);
  }
  return w;
}

function chunkOutput(bytes, offset, chunkLen, chunkIndex) {
  let cv = new Uint32Array(IV);
  const blocks = Math.max(1, Math.ceil(chunkLen / 64));
  for (let b = 0; b < blocks; b++) {
    const start = b * 64;
    const take = Math.max(0, Math.min(64, chunkLen - start));
    const words = wordsFromBytes(bytes, offset + start, take);
    let flags = 0;
    if (b === 0) flags |= CHUNK_START;
    if (b === blocks - 1) {
      flags |= CHUNK_END;
      return { cv, blockWords: words, counter: chunkIndex, blockLen: take, flags };
    }
    cv = compress(cv, words, chunkIndex, take, flags).subarray(0, 8);
  }
  throw new Error('unreachable');
}

function parentOutput(leftCv, rightCv) {
  const words = new Uint32Array(16);
  words.set(leftCv, 0);
  words.set(rightCv, 8);
  return { cv: new Uint32Array(IV), blockWords: words, counter: 0, blockLen: 64, flags: PARENT };
}

function outputCv(node) {
  return compress(node.cv, node.blockWords, node.counter, node.blockLen, node.flags).subarray(0, 8);
}

export function blake3Hex32(inputUtf8) {
  const bytes = Buffer.isBuffer(inputUtf8) ? inputUtf8 : Buffer.from(inputUtf8, 'utf8');
  const cvStack = [];
  const totalChunks = Math.max(1, Math.ceil(bytes.length / 1024));
  let lastNode = null;

  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    const off = chunkIndex * 1024;
    const len = Math.max(0, Math.min(1024, bytes.length - off));
    const node = chunkOutput(bytes, off, len, chunkIndex);
    if (chunkIndex === totalChunks - 1) {
      lastNode = node;
      break;
    }
    let newCv = outputCv(node);
    let total = chunkIndex + 1;
    while ((total & 1) === 0) {
      newCv = outputCv(parentOutput(cvStack.pop(), newCv));
      total >>>= 1;
    }
    cvStack.push(newCv);
  }

  while (cvStack.length > 0) {
    const rightCv = outputCv(lastNode);
    lastNode = parentOutput(cvStack.pop(), rightCv);
  }

  const rootWords = compress(
    lastNode.cv,
    lastNode.blockWords,
    lastNode.counter,
    lastNode.blockLen,
    lastNode.flags | ROOT,
  );
  const out = Buffer.alloc(16);
  for (let i = 0; i < 4; i++) out.writeUInt32LE(rootWords[i], i * 4);
  return out.toString('hex');
}

export function pagesAssetHash(buf, filePath) {
  const ext = path.extname(filePath).slice(1).toLowerCase();
  return blake3Hex32(buf.toString('base64') + ext);
}

const MIME_BY_EXT = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml',
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

function contentTypeFor(relKey) {
  if (relKey.endsWith('/apple-app-site-association') || relKey === '/apple-app-site-association') {
    return 'application/json';
  }
  const ext = path.extname(relKey).toLowerCase();
  return MIME_BY_EXT[ext] || 'application/octet-stream';
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const out = {};
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq <= 0) continue;
    out[t.slice(0, eq).trim()] = t.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '');
  }
  return out;
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

async function cfJson(url, opts = {}) {
  const res = await fetch(`https://api.cloudflare.com/client/v4${url}`, opts);
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Cloudflare non-JSON (${res.status}) for ${url}: ${text.slice(0, 300)}`);
  }
  if (!res.ok || data.success === false) {
    throw new Error(`Cloudflare error (${res.status}) for ${url}: ${JSON.stringify(data.errors || data)}`);
  }
  return data;
}

async function main() {
  if (process.argv.includes('--self-test')) {
    for (const [f, expected] of [
      ['public/app-ads.txt', '099894dabd27b7975875d263536610a6'],
      ['public/.well-known/apple-app-site-association', 'ce9a1b401fabae5dd5f6e76674f7072c'],
      ['public/.well-known/microsoft-identity-association.json', '29218ae9844e73518ad75a43308f2d1e'],
    ]) {
      const full = path.join(ROOT_DIR, f);
      const got = pagesAssetHash(fs.readFileSync(full), full);
      console.log(`${f}: got=${got} expected=${expected} match=${got === expected}`);
      if (got !== expected) process.exit(1);
    }
    console.log('BLAKE3 self-test passed.');
    return;
  }

  const envFile = process.env.CF_ENV_FILE || '/Users/aleksandarsvinarov/Downloads/Cloudflare-keys/.env';
  const env = { ...loadEnvFile(envFile), ...process.env };
  const accountId = env.CLOUDFLARE_ACCOUNT_ID;
  const pagesToken = env.CLOUDFLARE_R2_PAGES_API_TOKEN || env.CLOUDFLARE_API_TOKEN;
  const zoneToken = env.CLOUDFLARE_API_TOKEN || pagesToken;

  if (!accountId || !pagesToken) {
    throw new Error('Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_R2_PAGES_API_TOKEN');
  }
  if (!fs.existsSync(path.join(DIST_DIR, 'index.html'))) {
    throw new Error(`Missing build output at ${DIST_DIR}/index.html`);
  }

  console.log(`▸ Fetching previous production manifest from ${PROJECT_NAME}…`);
  const proj = await cfJson(`/accounts/${accountId}/pages/projects/${PROJECT_NAME}`, {
    headers: { Authorization: `Bearer ${pagesToken}` },
  });
  const latestId = proj.result?.latest_deployment?.id;
  const preservedManifest = {};
  if (latestId) {
    const dep = await cfJson(`/accounts/${accountId}/pages/projects/${PROJECT_NAME}/deployments/${latestId}`, {
      headers: { Authorization: `Bearer ${pagesToken}` },
    });
    const prevFiles = dep.result?.files || {};
    for (const [k, hash] of Object.entries(prevFiles)) {
      // Preserve external media/assets and Bing verification stored in Cloudflare's asset KV
      if (
        (k.startsWith('/media/') && !k.endsWith('.woff2')) ||
        k.startsWith('/assets/') ||
        k === '/BingSiteAuth.xml' ||
        k === '/cloud calendars.png'
      ) {
        preservedManifest[k] = hash;
      }
    }
  }
  console.log(`▸ Preserved ${Object.keys(preservedManifest).length} existing media/static entries.`);

  console.log(`▸ Hashing built files in ${DIST_DIR}…`);
  const localFiles = walk(DIST_DIR);
  const manifest = { ...preservedManifest };
  const byHash = new Map();

  for (const full of localFiles) {
    const rel = '/' + path.relative(DIST_DIR, full).split(path.sep).join('/');
    if (rel === '/_headers' || rel === '/_redirects') continue;
    const buf = fs.readFileSync(full);
    const hash = pagesAssetHash(buf, rel);
    manifest[rel] = hash;
    if (!byHash.has(hash)) {
      byHash.set(hash, { hash, rel, buf, contentType: contentTypeFor(rel) });
    }
    if (rel === '/.well-known/apple-app-site-association') {
      manifest['/apple-app-site-association'] = hash;
    }
  }

  const allLocalHashes = [...byHash.keys()];
  console.log(`▸ Total manifest paths: ${Object.keys(manifest).length} (${allLocalHashes.length} unique local hashes).`);

  const tokenRes = await cfJson(`/accounts/${accountId}/pages/projects/${PROJECT_NAME}/upload-token`, {
    headers: { Authorization: `Bearer ${pagesToken}` },
  });
  let uploadJwt = tokenRes.result.jwt;

  const missingSet = new Set();
  for (let i = 0; i < allLocalHashes.length; i += 1000) {
    const chunk = allLocalHashes.slice(i, i + 1000);
    const missRes = await cfJson('/pages/assets/check-missing', {
      method: 'POST',
      headers: { Authorization: `Bearer ${uploadJwt}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ hashes: chunk }),
    });
    for (const h of missRes.result || []) missingSet.add(h);
  }

  const missingItems = [...missingSet].map((h) => byHash.get(h)).filter(Boolean);
  console.log(`▸ Uploading ${missingItems.length} new/changed assets (${allLocalHashes.length - missingItems.length} already cached on Cloudflare)…`);

  const MAX_BATCH_BYTES = 25 * 1024 * 1024;
  const MAX_BATCH_COUNT = 40;
  const batches = [];
  let cur = [];
  let curBytes = 0;
  for (const item of missingItems) {
    const b64Len = Math.ceil(item.buf.length / 3) * 4 + 256;
    if (cur.length >= MAX_BATCH_COUNT || (cur.length > 0 && curBytes + b64Len > MAX_BATCH_BYTES)) {
      batches.push(cur);
      cur = [];
      curBytes = 0;
    }
    cur.push(item);
    curBytes += b64Len;
  }
  if (cur.length) batches.push(cur);

  let uploadedCount = 0;
  for (let bi = 0; bi < batches.length; bi++) {
    const batch = batches[bi].map((it) => ({
      key: it.hash,
      value: it.buf.toString('base64'),
      metadata: { contentType: it.contentType },
      base64: true,
    }));
    await cfJson('/pages/assets/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${uploadJwt}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(batch),
    });
    uploadedCount += batch.length;
    if ((bi + 1) % 5 === 0 || bi === batches.length - 1) {
      console.log(`  uploaded ${uploadedCount}/${missingItems.length} assets…`);
    }
  }

  if (allLocalHashes.length > 0) {
    console.log('▸ Registering asset hashes…');
    // Refresh JWT before upsert in case upload took >60s
    const freshToken = await cfJson(`/accounts/${accountId}/pages/projects/${PROJECT_NAME}/upload-token`, {
      headers: { Authorization: `Bearer ${pagesToken}` },
    });
    uploadJwt = freshToken.result.jwt;
    for (let i = 0; i < allLocalHashes.length; i += 1000) {
      const chunk = allLocalHashes.slice(i, i + 1000);
      await cfJson('/pages/assets/upsert-hashes', {
        method: 'POST',
        headers: { Authorization: `Bearer ${uploadJwt}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ hashes: chunk }),
      });
    }
  }

  const headersContent = [
    '/*',
    '  Access-Control-Allow-Origin: *',
    '  Strict-Transport-Security: max-age=31536000',
    '  Referrer-Policy: strict-origin-when-cross-origin',
    '  X-Content-Type-Options: nosniff',
    '  X-Frame-Options: SAMEORIGIN',
    '',
    '/media/*',
    '  Cache-Control: public, max-age=31536000, immutable',
    '',
    '/assets/*',
    '  Cache-Control: public, max-age=31536000, immutable',
    '',
    '/.well-known/apple-app-site-association',
    '  Content-Type: application/json',
    '  Cache-Control: public, max-age=0, must-revalidate',
    '',
    '/apple-app-site-association',
    '  Content-Type: application/json',
    '  Cache-Control: public, max-age=0, must-revalidate',
    '',
  ].join('\n');

  const redirectsContent = [
    '/.well-known/apple-app-site-association/ /.well-known/apple-app-site-association 200',
    '/apple-app-site-association/ /.well-known/apple-app-site-association 200',
    '/invite/debug/event-invites/open https://api.cloud-calendars.com/event-invites/open 302',
    '/invite/debug/icloud-calendar-invites/open https://api.cloud-calendars.com/icloud-calendar-invites/open 302',
    '/invite/event-invites/open https://api.cloud-calendars.com/event-invites/open 302',
    '/invite/icloud-calendar-invites/open https://api.cloud-calendars.com/icloud-calendar-invites/open 302',
    '/event/* /index.csr.html 200',
    '',
  ].join('\n');

  console.log(`▸ Creating production deployment on ${PROJECT_NAME}…`);
  const form = new FormData();
  form.append('manifest', JSON.stringify(manifest));
  form.append('branch', 'main');
  form.append('_headers', new Blob([headersContent], { type: 'text/plain' }), '_headers');
  form.append('_redirects', new Blob([redirectsContent], { type: 'text/plain' }), '_redirects');

  const created = await cfJson(`/accounts/${accountId}/pages/projects/${PROJECT_NAME}/deployments`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${pagesToken}` },
    body: form,
  });

  console.log(`▸ Deployment created: ${created.result?.id} (${created.result?.url})`);

  // Purge Cloudflare Zone edge cache if zone token has cache_purge permission (best-effort)
  try {
    const zones = await cfJson('/zones?name=cloud-calendars.com', {
      headers: { Authorization: `Bearer ${zoneToken}` },
    });
    const zoneId = zones.result?.[0]?.id;
    if (zoneId) {
      await cfJson(`/zones/${zoneId}/purge_cache`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${zoneToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ purge_everything: true }),
      });
      console.log('▸ Cloudflare zone cache purged for cloud-calendars.com.');
    }
  } catch (err) {
    console.log(`  (zone cache purge skipped/not needed: ${err.message})`);
  }

  console.log('▸ LIVE ON https://www.cloud-calendars.com');
}

main().catch((err) => {
  console.error('✗ Deploy failed:', err);
  process.exit(1);
});
