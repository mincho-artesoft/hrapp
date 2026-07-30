#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');
const input = process.argv[2] || 'https://www.cloud-calendars.com';

let base;
try {
  base = new URL(input);
  base.pathname = '/';
  base.search = '';
  base.hash = '';
} catch {
  console.error(`invalid base URL: ${input}`);
  process.exit(2);
}

const keyFiles = fs.readdirSync(publicDir).filter(name => /^[a-f0-9-]{8,128}\.txt$/i.test(name));
if (keyFiles.length !== 1) {
  console.error(`expected exactly one IndexNow key file in public/, found ${keyFiles.length}`);
  process.exit(1);
}

const keyFile = keyFiles[0];
const key = keyFile.slice(0, -4);
if (fs.readFileSync(path.join(publicDir, keyFile), 'utf8').trim() !== key) {
  console.error(`${keyFile} must contain its filename without .txt`);
  process.exit(1);
}

const sitemapUrl = new URL('sitemap.xml', base);
const sitemap = await fetch(sitemapUrl, {
  headers: { 'user-agent': 'Cloud-Calendars-IndexNow/1.0' },
  signal: AbortSignal.timeout(20_000),
});
if (sitemap.status !== 200) {
  console.error(`cannot submit IndexNow: ${sitemapUrl} returned ${sitemap.status}`);
  process.exit(1);
}

const xml = await sitemap.text();
const urlList = [...xml.matchAll(/<loc\b[^>]*>([\s\S]*?)<\/loc>/gi)].map(match =>
  match[1].trim().replace(/&amp;/g, '&'),
);
if (!urlList.length) {
  console.error('cannot submit IndexNow: sitemap contains no <loc> URLs');
  process.exit(1);
}

for (const url of urlList) {
  const parsed = new URL(url);
  if (parsed.hostname !== base.hostname) {
    console.error(`cannot submit a URL for another host: ${url}`);
    process.exit(1);
  }
}

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'user-agent': 'Cloud-Calendars-IndexNow/1.0',
  },
  body: JSON.stringify({
    host: base.hostname,
    key,
    keyLocation: new URL(keyFile, base).href,
    urlList,
  }),
  signal: AbortSignal.timeout(30_000),
});
const body = (await response.text()).trim();

if (![200, 202].includes(response.status)) {
  console.error(`IndexNow: HTTP ${response.status}${body ? ` — ${body.slice(0, 300)}` : ''}`);
  process.exit(1);
}

const meaning = response.status === 200 ? 'submitted' : 'accepted; key validation pending';
console.log(`IndexNow: HTTP ${response.status} — ${meaning} ${urlList.length} sitemap URLs for ${base.hostname}`);
