#!/usr/bin/env node

const input = process.argv[2];
if (!input) {
  console.error('usage: live-check.mjs <base-url>');
  process.exit(2);
}

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

const failures = [];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function get(url, label) {
  let response;
  try {
    response = await fetch(url, {
      redirect: 'follow',
      headers: { 'user-agent': 'Cloud-Calendars-Live-Check/1.0' },
      signal: AbortSignal.timeout(20_000),
    });
  } catch (error) {
    throw new Error(`${label} request failed: ${error.message}`);
  }
  return { response, body: await response.text() };
}

// Keep validation from opening hundreds of connections at once. Collect all
// worker results before reporting a failure so no request batch runs unseen.
async function getMany(urls, concurrency = 6) {
  const results = new Array(urls.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, urls.length) }, async () => {
    while (next < urls.length) {
      const index = next++;
      try { results[index] = await get(urls[index], urls[index]); }
      catch (error) { results[index] = { error }; }
    }
  }));
  const failed = results.find(result => result.error);
  if (failed) throw failed.error;
  return results;
}

function contentType(response) {
  return (response.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
}

function decodeXml(value) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(Number.parseInt(n, 16)))
    .replace(/&#([0-9]+);/g, (_, n) => String.fromCodePoint(Number.parseInt(n, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function parseSitemap(xml) {
  // Check the comments before discarding them. Stripping them first is what let
  // an unparseable sitemap pass this check for weeks: XML forbids "--" inside a
  // comment, the generator's header prose contained one, and the only construct
  // that made the file invalid was the first thing thrown away here.
  for (const [, body] of xml.matchAll(/<!--([\s\S]*?)-->/g)) {
    assert(!body.includes('--'), 'sitemap.xml has "--" inside a comment, which XML forbids');
  }

  const clean = xml
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\?[\s\S]*?\?>/g, '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');

  const stack = [];
  const tag = /<([^>]+)>/g;
  let match;
  let cursor = 0;

  while ((match = tag.exec(clean))) {
    assert(!clean.slice(cursor, match.index).includes('<'), 'sitemap.xml contains malformed markup');
    cursor = tag.lastIndex;

    const raw = match[1].trim();
    if (!raw || raw.startsWith('!')) continue;
    if (raw.startsWith('/')) {
      const name = raw.slice(1).trim().split(/\s/, 1)[0];
      assert(stack.pop() === name, `sitemap.xml has a mismatched </${name}> tag`);
      continue;
    }
    if (raw.endsWith('/')) continue;

    const name = raw.split(/\s/, 1)[0];
    assert(/^[A-Za-z_][\w:.-]*$/.test(name), `sitemap.xml has an invalid <${name}> tag`);
    stack.push(name);
  }

  assert(!clean.slice(cursor).includes('<'), 'sitemap.xml contains an unclosed tag');
  assert(stack.length === 0, `sitemap.xml has an unclosed <${stack.at(-1)}> tag`);
  assert(/<urlset(?:\s|>)/i.test(clean), 'sitemap.xml has no <urlset> root');

  const urls = [...clean.matchAll(/<loc\b[^>]*>([\s\S]*?)<\/loc>/gi)]
    .map(match => decodeXml(match[1].trim()));
  assert(urls.length > 0, 'sitemap.xml contains no <loc> URLs');
  for (const url of urls) new URL(url);
  return urls;
}

function urlsIn(text) {
  const urls = new Set();
  for (const match of text.matchAll(/https?:\/\/[^\s<>()\]]+/g)) {
    const candidate = match[0].replace(/[.,;:!?]+$/, '');
    try {
      urls.add(new URL(candidate).href);
    } catch {
      throw new Error(`llms.txt contains an invalid URL: ${candidate}`);
    }
  }
  return [...urls];
}

function jsonLdTypes(html) {
  const types = new Set();
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (!/\btype\s*=\s*(['"])application\/ld\+json\1/i.test(match[1])) continue;

    let data;
    try {
      data = JSON.parse(match[2]);
    } catch (error) {
      throw new Error(`invalid JSON-LD: ${error.message}`);
    }

    const visit = value => {
      if (Array.isArray(value)) {
        value.forEach(visit);
      } else if (value && typeof value === 'object') {
        const found = value['@type'];
        if (Array.isArray(found)) found.forEach(type => types.add(type));
        else if (typeof found === 'string') types.add(found);
        Object.values(value).forEach(visit);
      }
    };
    visit(data);
  }
  return types;
}

async function check(label, operation) {
  try {
    const detail = await operation();
    console.log(`✓ ${label}: ${detail}`);
  } catch (error) {
    failures.push(`${label}: ${error.message}`);
    console.error(`✗ ${label}: ${error.message}`);
  }
}

await check('/robots.txt', async () => {
  const { response, body } = await get(new URL('robots.txt', base), '/robots.txt');
  assert(response.status === 200, `expected 200, got ${response.status}`);
  assert(contentType(response) === 'text/plain', `expected text/plain, got ${contentType(response) || 'no content-type'}`);
  assert(/^Sitemap:\s*https?:\/\/\S+$/im.test(body), 'missing Sitemap: line');
  return '200 text/plain, Sitemap line present';
});

await check('/sitemap.xml', async () => {
  const { response, body } = await get(new URL('sitemap.xml', base), '/sitemap.xml');
  assert(response.status === 200, `expected 200, got ${response.status}`);
  assert(/^(application|text)\/(?:[\w.+-]*\+)?xml$/.test(contentType(response)),
    `expected an XML content-type, got ${contentType(response) || 'none'}`);

  const urls = parseSitemap(body);
  assert(urls.some(url => new URL(url).pathname === '/how-cloud-calendars-rescued-my-schedule-and-sanity.html'),
    'article URL is missing');

  const results = await getMany(urls);
  results.forEach(({ response: item }, index) => {
    assert(item.status === 200, `${urls[index]} returned ${item.status}`);
  });
  return `200 ${contentType(response)}, valid XML, ${urls.length}/${urls.length} URLs returned 200 (article included)`;
});

await check('/llms.txt', async () => {
  const { response, body } = await get(new URL('llms.txt', base), '/llms.txt');
  assert(response.status === 200, `expected 200, got ${response.status}`);
  assert(contentType(response) === 'text/plain', `expected text/plain, got ${contentType(response) || 'no content-type'}`);

  const urls = urlsIn(body);
  assert(urls.length > 0, 'contains no URLs');
  const results = await getMany(urls);
  results.forEach(({ response: item }, index) => {
    assert(item.status === 200, `${urls[index]} returned ${item.status}`);
  });
  return `200 text/plain, ${urls.length}/${urls.length} referenced URLs resolved`;
});

await check('/', async () => {
  const { response, body } = await get(base, '/');
  assert(response.status === 200, `expected 200, got ${response.status}`);
  const types = jsonLdTypes(body);
  assert(types.has('SoftwareApplication'), 'SoftwareApplication JSON-LD is missing');
  assert(types.has('FAQPage'), 'FAQPage JSON-LD is missing');
  return '200, valid SoftwareApplication and FAQPage JSON-LD';
});

if (failures.length) {
  console.error(`\nLIVE CHECK FAILED — ${failures.length} check(s) failed`);
  process.exit(1);
}

console.log(`\nLIVE CHECK PASSED — ${base.href}`);
