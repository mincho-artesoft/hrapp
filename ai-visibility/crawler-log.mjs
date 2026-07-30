#!/usr/bin/env node
/**
 * crawler-log.mjs — is anything actually fetching llms.txt?
 *
 *   node crawler-log.mjs <dir-of-s3-or-cloudfront-logs> [--days 30]
 *
 * WHY THIS IS THE ONLY HONEST MEASUREMENT
 *
 * No AI provider has committed to reading llms.txt, and there is no submission
 * form, no dashboard and no confirmation anywhere. So the question "did that
 * file do anything" has exactly one answerable form: did an AI crawler request
 * it, how often, and did it come back.
 *
 * Everything else on the subject is vendor blog speculation. This is a log
 * grep, and a log grep cannot be optimistic.
 *
 * Answers four things:
 *   1. which AI crawlers visit at all, and how often
 *   2. whether llms.txt is ever requested, by whom, and with what status
 *   3. whether robots.txt and sitemap.xml are being read
 *   4. which content pages the crawlers actually fetch
 *
 * If after a month no crawler has requested llms.txt, that is the finding, and
 * it should be reported rather than quietly dropped. A hedge that demonstrably
 * does nothing is worth knowing about.
 */

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const DIR = process.argv[2];
const DAYS = Number((process.argv.find(a => a.startsWith('--days=')) || '--days=30').split('=')[1]);
if (!DIR) {
  console.error('usage: crawler-log.mjs <log-dir> [--days=30]');
  process.exit(2);
}

/**
 * User agents worth counting. Grouped by what a hit actually means, because
 * "a bot visited" and "the bot that answers questions visited" are different
 * facts and conflating them is how people talk themselves into believing this
 * is working.
 */
const AGENTS = [
  // Fetches a page because a user asked a question RIGHT NOW. The one that
  // matters — it means you were in the answer.
  { re: /OAI-SearchBot/i,      name: 'OAI-SearchBot',   kind: 'answering a live query' },
  { re: /ChatGPT-User/i,       name: 'ChatGPT-User',    kind: 'answering a live query' },
  { re: /Claude-User/i,        name: 'Claude-User',     kind: 'answering a live query' },
  { re: /PerplexityBot|Perplexity-User/i, name: 'Perplexity', kind: 'answering a live query' },

  // Builds a search index that a model later draws on. Second best.
  { re: /ClaudeBot/i,          name: 'ClaudeBot',       kind: 'indexing' },
  { re: /Google-Extended/i,    name: 'Google-Extended', kind: 'indexing' },
  { re: /bingbot/i,            name: 'bingbot',         kind: 'indexing' },
  { re: /Googlebot/i,          name: 'Googlebot',       kind: 'indexing' },

  // Collects data for future model TRAINING. A hit here changes nothing this
  // year and possibly nothing ever. Counted separately so it cannot flatter
  // the numbers.
  { re: /GPTBot/i,             name: 'GPTBot',          kind: 'training corpus' },
  { re: /CCBot/i,              name: 'CCBot',           kind: 'training corpus' },
  { re: /anthropic-ai/i,       name: 'anthropic-ai',    kind: 'training corpus' },
];

const WATCH = ['/llms.txt', '/robots.txt', '/sitemap.xml'];

function* lines(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (!fs.statSync(p).isFile()) continue;
    let buf = fs.readFileSync(p);
    if (f.endsWith('.gz')) { try { buf = zlib.gunzipSync(buf); } catch { continue; } }
    for (const l of buf.toString('utf8').split('\n')) if (l && !l.startsWith('#')) yield l;
  }
}

const cutoff = new Date(Date.now() - DAYS * 864e5).toISOString().slice(0, 10);
const byAgent = new Map();
const llmsHits = [];
const pages = new Map();
let total = 0, matched = 0;

for (const line of lines(DIR)) {
  total++;
  // S3 and CloudFront formats differ; rather than parse either strictly, pull
  // the date, the path and the agent by shape. A log line that does not yield
  // all three is skipped and counted, not guessed at.
  const date = (line.match(/\b(\d{4}-\d{2}-\d{2})\b/) || [])[1];
  const uri = (line.match(/\s(\/[^\s"]*)/) || [])[1];
  const status = (line.match(/\s([2345]\d\d)\s/) || [])[1];
  if (!date || !uri || date < cutoff) continue;

  const agent = AGENTS.find(a => a.re.test(line));
  if (!agent) continue;
  matched++;

  const rec = byAgent.get(agent.name) || { kind: agent.kind, hits: 0, paths: new Map(), last: '' };
  rec.hits++;
  rec.last = date > rec.last ? date : rec.last;
  rec.paths.set(uri, (rec.paths.get(uri) || 0) + 1);
  byAgent.set(agent.name, rec);

  if (WATCH.includes(uri)) llmsHits.push({ date, agent: agent.name, uri, status });
  if (!uri.match(/\.(js|css|png|jpe?g|webp|ico|woff2?|mp4|webm)$/i)) {
    pages.set(uri, (pages.get(uri) || 0) + 1);
  }
}

const pad = (s, n) => String(s).padEnd(n);
console.log(`\n${total} log lines, ${matched} from a tracked crawler, last ${DAYS} days\n`);

if (!byAgent.size) {
  console.log('No AI crawler has visited in this window at all.');
  console.log('That is a finding, not an error. Report it.\n');
} else {
  console.log(pad('crawler', 18) + pad('what a hit means', 24) + pad('hits', 7) + 'last seen');
  console.log('-'.repeat(66));
  const order = { 'answering a live query': 0, indexing: 1, 'training corpus': 2 };
  for (const [n, r] of [...byAgent].sort((a, b) => order[a[1].kind] - order[b[1].kind] || b[1].hits - a[1].hits))
    console.log(pad(n, 18) + pad(r.kind, 24) + pad(r.hits, 7) + r.last);
}

console.log(`\n--- the question llms.txt exists to answer ---`);
const llms = llmsHits.filter(h => h.uri === '/llms.txt');
if (!llms.length) {
  console.log('  /llms.txt: NEVER REQUESTED by any tracked crawler in this window.');
  console.log('  Leave the file in place — it costs nothing — but do not count it');
  console.log('  as a channel, and do not spend more time on it.');
} else {
  console.log(`  /llms.txt: ${llms.length} request(s)`);
  for (const h of llms.slice(-10)) console.log(`    ${h.date}  ${pad(h.agent, 18)} ${h.status}`);
}
for (const w of ['/robots.txt', '/sitemap.xml']) {
  const n = llmsHits.filter(h => h.uri === w).length;
  console.log(`  ${w}: ${n} request(s)`);
}

const top = [...pages].sort((a, b) => b[1] - a[1]).slice(0, 12);
if (top.length) {
  console.log(`\n--- pages the crawlers actually fetch ---`);
  for (const [p, n] of top) console.log(`  ${pad(n, 6)} ${p}`);
}
console.log();
