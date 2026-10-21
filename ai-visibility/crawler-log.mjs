#!/usr/bin/env node
/** CloudFront TSV aggregates. Declared user agents are unverified, not citations. */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { pathToFileURL } from 'node:url';

const REQUIRED = ['date', 'time', 'sc-status', 'cs-uri-stem', 'cs(User-Agent)'];
const WATCH = ['/llms.txt', '/llms-full.txt', '/robots.txt', '/sitemap.xml'];
const AGENTS = [
  ['OAI-SearchBot', 'automated search crawler (declared UA)'],
  ['ChatGPT-User', 'user-triggered retrieval (declared UA)'],
  ['GPTBot', 'training crawler (declared UA)'],
  ...['Claude-User', 'ClaudeBot', 'PerplexityBot', 'Perplexity-User', 'bingbot', 'Googlebot', 'CCBot', 'anthropic-ai']
    .map(name => [name, 'other tracked declared UA; purpose not verified']),
].map(([name, kind]) => ({ name, kind, re: new RegExp(`(?:^|[^A-Za-z0-9_-])${name}(?=$|[^A-Za-z0-9_-])`, 'i') }));
const increment = (object, key) => { object[key] = (object[key] || 0) + 1; };
const validDate = value => /^\d{4}-\d{2}-\d{2}$/.test(value)
  && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;

// Never output arbitrary request paths, queries, tokens, hosts, UAs or IPs.
// Public article slugs are deliberately collapsed too: path shape is not proof of safety.
export function safePath(raw) {
  if (!raw.startsWith('/') || /[\r\n\t]/.test(raw)) return '[redacted-other-path]';
  const stem = raw.split(/[?#]/, 1)[0];
  if (WATCH.includes(stem)) return stem;
  if (stem === '/') return '/';
  if (/^\/[a-z]{2}-[A-Z]{2}\/?$/.test(stem)) return '/[locale]/';
  if (/^\/(?:[a-z]{2}-[A-Z]{2}\/)?articles\/?$/.test(stem)) return '/[locale?]/articles/';
  if (/^\/(?:[a-z]{2}-[A-Z]{2}\/)?articles\//.test(stem)) return '/[locale?]/articles/[redacted-slug]';
  return '[redacted-other-path]';
}

export function analyzeLogs(texts, { days = 30, now = new Date() } = {}) {
  if (!Number.isSafeInteger(days) || days < 1 || days > 36500 || !Number.isFinite(now.getTime())) throw new Error('Invalid reporting window');
  const end = now.toISOString().slice(0, 10);
  const start = new Date(Date.parse(end) - (days - 1) * 864e5).toISOString().slice(0, 10);
  const counts = { files: 0, dataRows: 0, parsedRows: 0, unsupportedFormatRows: 0, malformedRows: 0, invalidFieldHeaders: 0, windowRows: 0, olderRows: 0, futureRows: 0, matchedRows: 0, ambiguousDeclaredUARows: 0 };
  let minDate = null, maxDate = null;
  const dates = new Set(), windowDates = new Set(), agents = {}, paths = {};
  const watched = Object.fromEntries(WATCH.map(p => [p, { allRequests: 0, trackedDeclaredUARequests: 0, statuses: {}, trackedStatuses: {} }]));
  for (const text of texts) {
    counts.files++;
    let fields = null;
    for (const line of text.split(/\r?\n/)) {
      if (!line.trim()) continue;
      if (line.startsWith('#Fields:')) {
        const names = line.slice(8).trim().split(/\s+/);
        fields = new Set(names).size === names.length && REQUIRED.every(n => names.includes(n)) ? names : null;
        if (!fields) counts.invalidFieldHeaders++;
        continue;
      }
      if (line.startsWith('#')) continue;
      counts.dataRows++;
      if (!fields) { counts.unsupportedFormatRows++; continue; }
      const values = line.split('\t');
      if (values.length !== fields.length) { counts.malformedRows++; continue; }
      const row = Object.fromEntries(fields.map((f, i) => [f, values[i]]));
      const date = row.date, status = row['sc-status'];
      if (!validDate(date) || !/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(row.time)
          || !/^(?:000|[1-5]\d\d)$/.test(status) || !row['cs-uri-stem'].startsWith('/')) {
        counts.malformedRows++; continue;
      }
      counts.parsedRows++;
      dates.add(date);
      minDate = minDate === null || date < minDate ? date : minDate;
      maxDate = maxDate === null || date > maxDate ? date : maxDate;
      if (date < start) { counts.olderRows++; continue; }
      if (date > end) { counts.futureRows++; continue; }
      counts.windowRows++; windowDates.add(date);
      let ua;
      try { ua = decodeURIComponent(row['cs(User-Agent)']); }
      catch { ua = row['cs(User-Agent)']; }
      const matches = AGENTS.filter(a => a.re.test(ua));
      const category = safePath(row['cs-uri-stem']);
      const watch = watched[category];
      if (watch) { watch.allRequests++; increment(watch.statuses, status); }
      if (matches.length > 1) { counts.ambiguousDeclaredUARows++; continue; }
      if (matches.length !== 1) continue;
      counts.matchedRows++;
      const { name, kind } = matches[0];
      const record = agents[name] ??= { kind, requests: 0, firstDate: date, lastDate: date, statuses: {} };
      record.requests++;
      record.firstDate = date < record.firstDate ? date : record.firstDate;
      record.lastDate = date > record.lastDate ? date : record.lastDate;
      increment(record.statuses, status); increment(paths, category);
      if (watch) { watch.trackedDeclaredUARequests++; increment(watch.trackedStatuses, status); }
    }
  }
  return {
    schemaVersion: 1,
    window: { startDateInclusive: start, endDateInclusive: end, calendarDays: days, timezone: 'UTC' },
    coverage: { availableMinDate: minDate, availableMaxDate: maxDate, availableDistinctDates: dates.size,
      windowDistinctDates: windowDates.size, windowRows: counts.windowRows,
      state: counts.windowRows ? 'sampled-rows-in-window' : counts.parsedRows ? 'no-valid-rows-in-window' : 'no-supported-valid-rows',
      completeness: 'Unknown: date span or observed dates do not establish complete delivery or full-day coverage.' },
    counts, declaredUserAgents: agents, watchedPaths: watched, trackedPathCategories: paths,
    interpretation: [
      'User-agent declarations are spoofable and unverified; no IP or reverse-DNS authentication was performed.',
      'A logged request does not establish successful reading, indexing, use in an answer, or a citation; inspect status counts.',
      'No matching request in sampled logs does not prove no crawling or that a file is useless. Stale, incomplete and unsupported logs limit conclusions.',
      'Google-Extended is not treated as an HTTP user-agent identity.',
    ],
    classificationSource: 'https://developers.openai.com/api/docs/bots',
  };
}

export function parseArgs(args) {
  let dir, days = 30, json = false;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--json') json = true;
    else if (arg === '--days') days = Number(args[++i]);
    else if (arg.startsWith('--days=')) days = Number(arg.slice(7));
    else if (!arg.startsWith('-') && !dir) dir = arg;
    else throw new Error('Unsupported argument');
  }
  if (!dir || !Number.isSafeInteger(days) || days < 1 || days > 36500) throw new Error('Invalid arguments');
  return { dir, days, json };
}

export function main(args) {
  let options;
  try { options = parseArgs(args); }
  catch { console.error('usage: crawler-log.mjs <log-dir> [--days=30 | --days 30] [--json]'); return 2; }
  const texts = []; let unreadableFiles = 0, ignoredEntries = 0;
  try {
    for (const entry of fs.readdirSync(options.dir, { withFileTypes: true })) {
      if (!entry.isFile()) { ignoredEntries++; continue; }
      try {
        let buffer = fs.readFileSync(path.join(options.dir, entry.name));
        if (entry.name.endsWith('.gz')) buffer = zlib.gunzipSync(buffer);
        texts.push(buffer.toString('utf8'));
      } catch { unreadableFiles++; }
    }
  } catch { console.error('Unable to read log directory. No paths or raw error details emitted.'); return 2; }
  const result = analyzeLogs(texts, options);
  result.counts.unreadableFiles = unreadableFiles;
  result.counts.ignoredEntries = ignoredEntries;
  if (options.json) console.log(JSON.stringify(result, null, 2));
  else {
    const c = result.coverage;
    console.log(`UTC window: ${result.window.startDateInclusive} through ${result.window.endDateInclusive} (inclusive)`);
    console.log(`Available valid dates: ${c.availableMinDate ?? 'none'} through ${c.availableMaxDate ?? 'none'}; window rows: ${c.windowRows}; observed window dates: ${c.windowDistinctDates}`);
    console.log(`Coverage: ${c.state}. ${c.completeness}`);
    console.log(`Row counts: ${JSON.stringify(result.counts)}`);
    console.log('Tracked declared user agents (unverified):');
    if (!result.counts.matchedRows) console.log('No matching declarations in the supported sampled rows within this window.');
    for (const [name, r] of Object.entries(result.declaredUserAgents)) console.log(`${name}: ${r.requests} requests; ${r.kind}; statuses ${JSON.stringify(r.statuses)}`);
    for (const [p, r] of Object.entries(result.watchedPaths)) console.log(`${p}: ${r.allRequests} total sampled requests; ${r.trackedDeclaredUARequests} tracked declared-UA requests; tracked statuses ${JSON.stringify(r.trackedStatuses)}`);
    console.log(`Tracked path categories: ${JSON.stringify(result.trackedPathCategories)}`);
    for (const note of result.interpretation) console.log(note);
  }
  return 0;
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) process.exitCode = main(process.argv.slice(2));
