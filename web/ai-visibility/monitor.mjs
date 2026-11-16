#!/usr/bin/env node
/**
 * ai-visibility/monitor.mjs — does an AI assistant recommend Cloud Calendars?
 *
 *   node monitor.mjs            run every provider that has a key, append results
 *   node monitor.mjs --report   rebuild report.md and report.html from history
 *   node monitor.mjs --dry      print what would run, call nothing
 *
 * WHY THIS EXISTS
 *
 * You cannot teach a deployed model. Weights are frozen and no provider offers
 * an API to write a fact into one. What you can change is what the model FINDS
 * when it searches, which for commercial-intent questions is most of the time.
 * So the only honest strategy is: change the inputs, then measure the outputs.
 * This measures the outputs.
 *
 * WHAT IT RECORDS, per prompt per provider
 *
 *   mentioned   did the answer name Cloud Calendars at all
 *   rank        its position among all products named, 1-based, null if absent
 *   named       every product the answer recommended, in order
 *   cited       domains the answer cited, when the provider exposes them
 *
 * `rank` is the number that matters. "Mentioned" is binary and flatters you;
 * being named eighth in a list of eight is not a recommendation.
 *
 * KEYS. Every provider is skipped silently when its env var is absent, so this
 * runs with one key or six. None are required to build the report.
 *
 *   OPENAI_API_KEY      gpt, web search enabled
 *   GEMINI_API_KEY      gemini, Google Search grounding
 *   ANTHROPIC_API_KEY   claude, web search tool
 *   DEEPSEEK_API_KEY    deepseek  — no live search, reflects training data
 *   MOONSHOT_API_KEY    kimi      — no live search, reflects training data
 *
 * That last distinction is the useful one. A model without live search tells you
 * what the training corpus absorbed months ago; a model with search tells you
 * what your listings look like today. Watch them diverge.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const CFG = JSON.parse(fs.readFileSync(path.join(DIR, 'prompts.json'), 'utf8'));
const HISTORY = path.join(DIR, 'history.jsonl');
const DISTRIBUTION = path.join(DIR, 'DISTRIBUTION.md');

const args = new Set(process.argv.slice(2));
const DRY = args.has('--dry');
const REPORT_ONLY = args.has('--report');

// ---------------------------------------------------------------- providers

/**
 * Each provider takes a question and returns { text, cited[] }.
 * Add one by adding an entry: nothing else in this file needs to change.
 */
const PROVIDERS = {
  gpt: {
    env: 'OPENAI_API_KEY',
    search: true,
    async ask(q, key) {
      const r = await post('https://api.openai.com/v1/responses', {
        Authorization: `Bearer ${key}`,
      }, {
        model: 'gpt-5',
        input: q,
        tools: [{ type: 'web_search' }],
      });
      const text = JSON.stringify(r);
      return { text: plain(r.output_text ?? text), cited: urlsIn(text) };
    },
  },

  gemini: {
    env: 'GEMINI_API_KEY',
    search: true,
    async ask(q, key) {
      const r = await post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
        {},
        { contents: [{ parts: [{ text: q }] }], tools: [{ google_search: {} }] },
      );
      const text = r?.candidates?.[0]?.content?.parts?.map(p => p.text).join('\n') ?? '';
      return { text, cited: urlsIn(JSON.stringify(r)) };
    },
  },

  claude: {
    env: 'ANTHROPIC_API_KEY',
    search: true,
    async ask(q, key) {
      const r = await post('https://api.anthropic.com/v1/messages', {
        'x-api-key': key, 'anthropic-version': '2023-06-01',
      }, {
        model: 'claude-sonnet-4-5', max_tokens: 1500,
        messages: [{ role: 'user', content: q }],
        tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 4 }],
      });
      const text = (r.content ?? []).filter(c => c.type === 'text').map(c => c.text).join('\n');
      return { text, cited: urlsIn(JSON.stringify(r)) };
    },
  },

  deepseek: {
    env: 'DEEPSEEK_API_KEY',
    search: false,
    async ask(q, key) {
      const r = await post('https://api.deepseek.com/chat/completions', {
        Authorization: `Bearer ${key}`,
      }, { model: 'deepseek-chat', messages: [{ role: 'user', content: q }] });
      return { text: r?.choices?.[0]?.message?.content ?? '', cited: [] };
    },
  },

  kimi: {
    env: 'MOONSHOT_API_KEY',
    search: false,
    async ask(q, key) {
      const r = await post('https://api.moonshot.ai/v1/chat/completions', {
        Authorization: `Bearer ${key}`,
      }, { model: 'kimi-k2-0905-preview', messages: [{ role: 'user', content: q }] });
      return { text: r?.choices?.[0]?.message?.content ?? '', cited: [] };
    },
  },
};

async function post(url, headers, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

const plain = v => (typeof v === 'string' ? v : JSON.stringify(v));

function urlsIn(s) {
  const hosts = new Set();
  for (const m of s.matchAll(/https?:\/\/([a-z0-9.-]+)/gi)) {
    hosts.add(m[1].replace(/^www\./, '').toLowerCase());
  }
  return [...hosts].sort();
}

// ------------------------------------------------------------------ scoring

/**
 * Find every tracked product named in an answer, in the order they appear.
 *
 * Ordering by first occurrence is deliberate. A numbered list is the common
 * shape, and in a numbered list position is the recommendation — so first
 * mention is a fair proxy for rank without having to parse the prose.
 */
export function score(text, cfg = CFG) {
  const lower = text.toLowerCase();
  const hits = [];

  const find = (label, needles) => {
    let at = Infinity;
    for (const n of needles) {
      const i = lower.indexOf(n.toLowerCase());
      if (i !== -1 && i < at) at = i;
    }
    if (at !== Infinity) hits.push({ label, at });
  };

  find(cfg.brand, cfg.aliases);
  for (const c of cfg.competitors) if (c !== cfg.brand) find(c, [c]);

  hits.sort((a, b) => a.at - b.at);
  const named = hits.map(h => h.label);
  const rank = named.indexOf(cfg.brand);
  return { mentioned: rank !== -1, rank: rank === -1 ? null : rank + 1, named };
}

// --------------------------------------------------------------------- run

async function run() {
  const active = Object.entries(PROVIDERS).filter(([, p]) => process.env[p.env]);
  const skipped = Object.entries(PROVIDERS).filter(([, p]) => !process.env[p.env]);

  console.log(`${CFG.prompts.length} prompts x ${active.length} providers = ${CFG.prompts.length * active.length} calls`);
  if (skipped.length) console.log(`skipped (no key): ${skipped.map(([n, p]) => `${n} (${p.env})`).join(', ')}`);
  if (!active.length) {
    console.log('\nNothing to run. Set at least one key, or use --report to rebuild from history.');
    return;
  }
  if (DRY) { console.log('\n--dry: stopping before any network call.'); return; }

  const stamp = new Date().toISOString().slice(0, 10);
  const rows = [];

  for (const [name, prov] of active) {
    for (const p of CFG.prompts) {
      try {
        const { text, cited } = await prov.ask(p.q, process.env[prov.env]);
        const s = score(text);
        rows.push({ date: stamp, provider: name, search: prov.search, prompt: p.id,
                    intent: p.intent, ...s, cited, chars: text.length });
        const flag = s.mentioned ? `#${s.rank} of ${s.named.length}` : 'absent';
        console.log(`  ${name.padEnd(9)} ${p.id.padEnd(17)} ${flag}`);
      } catch (e) {
        rows.push({ date: stamp, provider: name, prompt: p.id, error: String(e).slice(0, 160) });
        console.log(`  ${name.padEnd(9)} ${p.id.padEnd(17)} ERROR ${String(e).slice(0, 80)}`);
      }
    }
  }

  fs.appendFileSync(HISTORY, rows.map(r => JSON.stringify(r)).join('\n') + '\n');
  console.log(`\n${rows.length} rows appended to history.jsonl`);
}

// ------------------------------------------------------------------ report

function report() {
  if (!fs.existsSync(HISTORY)) { console.log('no history.jsonl yet'); return; }
  const rows = fs.readFileSync(HISTORY, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse);
  const dates = [...new Set(rows.map(r => r.date))].sort();
  const provs = [...new Set(rows.map(r => r.provider))].sort();

  const cell = (d, p) => {
    const rs = rows.filter(r => r.date === d && r.provider === p && !r.error);
    if (!rs.length) return null;
    const hit = rs.filter(r => r.mentioned);
    const avg = hit.length ? (hit.reduce((s, r) => s + r.rank, 0) / hit.length) : null;
    return { n: rs.length, hits: hit.length,
             avgRank: avg ? Math.round(avg * 10) / 10 : null };
  };

  let md = `# AI visibility — ${CFG.brand}\n\n`;
  md += `Generated from history.jsonl. ${rows.length} observations across ${dates.length} run(s).\n\n`;
  md += `**Read the rank, not the hit rate.** Being named at all is easy; being named first is\n`;
  md += `the recommendation. A hit rate that climbs while average rank stays at 7 means you\n`;
  md += `have joined the also-ran paragraph at the bottom of the answer.\n\n`;

  let coverage = `| date | ${provs.join(' | ')} |\n|${'---|'.repeat(provs.length + 1)}\n`;
  for (const d of dates) {
    coverage += `| ${d} | ` + provs.map(p => {
      const c = cell(d, p);
      if (!c) return '—';
      if (!c.avgRank) return `absent (${c.n} prompts)`;
      const absent = c.n - c.hits;
      return `avg #${c.avgRank}${absent ? ` (${absent} absent)` : ''}`;
    }).join(' | ') + ` |\n`;
  }
  md += `## Average rank over time\n\n${coverage}`;

  const latest = dates.at(-1);
  md += `\n## Latest run — ${latest}, by prompt\n\n| prompt | intent | ${provs.join(' | ')} |\n|${'---|'.repeat(provs.length + 2)}\n`;
  for (const p of CFG.prompts) {
    md += `| ${p.id} | ${p.intent} | ` + provs.map(pr => {
      const r = rows.find(x => x.date === latest && x.provider === pr && x.prompt === p.id);
      if (!r) return '—';
      if (r.error) return 'err';
      return r.mentioned ? `**#${r.rank}**/${r.named.length}` : `absent (${r.named.length} named)`;
    }).join(' | ') + ` |\n`;
  }

  // Who is taking the slots you want.
  const rivals = {};
  for (const r of rows.filter(x => x.date === latest && x.named)) {
    r.named.forEach((n, i) => {
      if (n === CFG.brand) return;
      rivals[n] = rivals[n] || { seen: 0, sumRank: 0 };
      rivals[n].seen++; rivals[n].sumRank += i + 1;
    });
  }
  const top = Object.entries(rivals).sort((a, b) => b[1].seen - a[1].seen).slice(0, 12);
  md += `\n## Who is holding the slots — ${latest}\n\n| product | answers naming it | avg position |\n|---|---|---|\n`;
  for (const [n, v] of top) md += `| ${n} | ${v.seen} | #${(v.sumRank / v.seen).toFixed(1)} |\n`;

  const domains = {};
  for (const r of rows.filter(x => x.date === latest && x.cited)) for (const d of r.cited) domains[d] = (domains[d] || 0) + 1;
  const topd = Object.entries(domains).sort((a, b) => b[1] - a[1]).slice(0, 20);
  if (topd.length) {
    md += `\n## Most-cited domains — ${latest}\n\nThese are the pages that decide the answer. Getting listed on them is the work.\n\n`;
    md += `| domain | times cited |\n|---|---|\n`;
    for (const [d, n] of topd) md += `| ${d} | ${n} |\n`;
  }

  fs.writeFileSync(path.join(DIR, 'report.md'), md);

  const start = '<!-- ai-visibility-monitor:start -->';
  const end = '<!-- ai-visibility-monitor:end -->';
  const block = `${start}
## Automated visibility trend

Generated from \`history.jsonl\`. Average rank is shown when Cloud Calendars was
named; \`absent\` means it was not named in any measured answer for that run.
Hit-rate percentages are deliberately omitted.

${coverage.trimEnd()}
${end}`;
  const distribution = fs.readFileSync(DISTRIBUTION, 'utf8');
  const pattern = new RegExp(`${start}[\\s\\S]*?${end}`);
  const updated = pattern.test(distribution)
    ? distribution.replace(pattern, block)
    : `${distribution.trimEnd()}\n\n---\n\n${block}\n`;
  fs.writeFileSync(DISTRIBUTION, updated);

  console.log(`report.md written — ${dates.length} run(s), ${provs.length} provider(s)`);
  console.log('DISTRIBUTION.md average-rank table updated');
  return md;
}

if (REPORT_ONLY) report();
else { await run(); report(); }
