/** Structural publication gate, not a claim of search quality or indexing eligibility. */
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
const cache = new Map();
function load(file) {
  if (cache.has(file)) return cache.get(file);
  const result = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  const module = { exports: {} }; cache.set(file, module.exports);
  new Function('require', 'exports', 'module', result.outputText)(name => {
    if (!name.startsWith('.')) throw new Error('Unexpected module: ' + name);
    return load(path.resolve(path.dirname(file), name) + '.ts');
  }, module.exports, module);
  return module.exports;
}
const content = load(path.resolve('src/app/content/article-locales/en-US.ts')).ARTICLE_LOCALE.articles;
const facts = load(path.resolve('src/app/content/article-facts.ts')).ARTICLE_FACTS;
const manifestPath = process.argv.find(arg => arg.endsWith('.json')) ?? 'research/content-scale-20261023/editorial-manifest.json';
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const baseline = new Set(manifest.baselineSlugs ?? []);
const records = new Map();
const errors = [], warnings = [];
const normalized = value => value.toLowerCase().normalize('NFKC').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const prose = article => [article.lede, ...(article.sections ?? []).flatMap(section => [section.heading, ...section.body]), ...(article.practical ?? []), ...(article.faq ?? []).flatMap(faq => [faq.q, faq.a])].filter(Boolean).join(' ');
const unique = (value, key, slug, seen) => {
  const normal = normalized(value ?? '');
  if (!normal) errors.push({ slug, issue: `Missing ${key}` });
  else if (seen.has(normal)) errors.push({ slug, issue: `Duplicate ${key}`, other: seen.get(normal) });
  else seen.set(normal, slug);
};
const keywords = new Map(), intents = new Map(), titles = new Map(), bodies = new Map();
for (const record of manifest.articles ?? []) {
  if (records.has(record.slug)) errors.push({ slug: record.slug, issue: 'Duplicate manifest record' });
  records.set(record.slug, record);
  if (!['candidate', 'draft', 'reviewed', 'approved'].includes(record.review?.status)) errors.push({ slug: record.slug, issue: 'Unknown editorial status' });
  unique(record.primaryKeyword, 'primaryKeyword', record.slug, keywords);
  unique(record.intentKey, 'intentKey', record.slug, intents);
}
const grams = [];
for (const [slug, article] of Object.entries(content)) {
  unique(article.title, 'title', slug, titles);
  unique(prose(article), 'article body', slug, bodies);
  if (!facts[slug]) errors.push({ slug, issue: 'Missing route facts' });
  const links = [...(article.seeAlso ?? []), ...(article.articleLinks ?? []).map(link => link.slug)];
  for (const target of links) if (!(target in content) || target === slug) errors.push({ slug, issue: 'Broken or self related link', target });
  const record = records.get(slug);
  if (!baseline.has(slug)) {
    if (!record) errors.push({ slug, issue: 'New article has no editorial record' });
    else {
      for (const field of ['readerOutcome', 'distinctValue']) if (!record[field]?.trim()) errors.push({ slug, issue: `Missing ${field}` });
      if (record.review?.status !== 'approved' || !record.review?.reviewer || !/^\d{4}-\d{2}-\d{2}/.test(record.review?.checkedAt ?? '')) errors.push({ slug, issue: 'Editorial approval is missing' });
      if (!record.evidence?.length || record.evidence.some(item => !/^https:\/\//.test(item.url ?? '') || !item.note?.trim() || item.type !== 'primary' || !/^\d{4}-\d{2}-\d{2}/.test(item.verifiedAt ?? ''))) errors.push({ slug, issue: 'Verified primary evidence needs URL, supporting note, type primary and verifiedAt date' });
      const visibleSources = new Set((article.sources ?? []).map(source => source.url));
      if (record.evidence?.some(item => !visibleSources.has(item.url))) errors.push({ slug, issue: 'Evidence must be visible in article sources' });
      if (!links.length) errors.push({ slug, issue: 'New article has no contextual related link' });
      if (!article.sections?.length || !article.practical?.length) errors.push({ slug, issue: 'New article lacks substantive sections or actionable guidance' });
      for (const source of article.sources ?? []) if (!/^https:\/\//.test(source.url)) errors.push({ slug, issue: 'Invalid source URL', url: source.url });
    }
  }
  const tokens = normalized(prose(article)).split(' ');
  const shingles = new Set(tokens.slice(0, -4).map((_, index) => tokens.slice(index, index + 5).join(' ')));
  grams.push({ slug, shingles });
}
for (let index = 0; index < grams.length; index++) {
  const left = grams[index];
  for (let other = index + 1; other < grams.length; other++) {
    const right = grams[other];
    if (baseline.has(left.slug) && baseline.has(right.slug)) continue;
    const smaller = left.shingles.size <= right.shingles.size ? left : right;
    const larger = smaller === left ? right : left;
    let common = 0;
    for (const gram of smaller.shingles) if (larger.shingles.has(gram)) common++;
    const overlap = common / Math.max(1, smaller.shingles.size);
    if (overlap >= 0.65) {
      const issue = { slug: left.slug, other: right.slug, issue: 'High shared wording: requires intent and originality review', sharedFiveWordPhrases: Math.round(overlap * 100) + '%' };
      warnings.push(issue);
      for (const candidate of [left.slug, right.slug].filter(slug => !baseline.has(slug))) {
        if (!records.get(candidate)?.overlapReview?.trim()) errors.push({ ...issue, slug: candidate, issue: 'High overlap without written editorial resolution' });
      }
    }
  }
}
for (const slug of records.keys()) if (!(slug in content)) warnings.push({ slug, issue: 'Planned record not yet published' });
const result = { generatedAt: new Date().toISOString(), englishArticles: Object.keys(content).length, baselineArticles: baseline.size, newArticles: Object.keys(content).filter(slug => !baseline.has(slug)).length, checks: 'Structural editorial safeguards; similarity is a review signal, not proof of originality, ranking or quality. No word-count threshold.', errors, warnings };
console.log(JSON.stringify(result, null, 2));
if (errors.length) process.exitCode = 1;
