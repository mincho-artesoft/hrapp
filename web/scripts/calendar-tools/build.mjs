import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const source = resolve(here, '../../public');
const output = resolve(process.argv[2] || join(here, '../../dist/calendar-tools'));
const domain = 'https://www.cloud-calendars.com';
const guide = 'articles/24-48-firefighter-shift-calendar-ics-download';
const hub = readFileSync(join(source, 'tools/index.html'), 'utf8');
const tools = Array.from(hub.matchAll(/<a href="\/(tools\/[a-z0-9-]+)\/"/g), match => match[1]);
if (new Set(tools).size !== 12 || tools.length !== 12) throw Error('The tool directory must link to all twelve individual tools.');
const guideRoot = join(source, 'tools/guides');
const toolGuides = readdirSync(guideRoot, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => 'tools/guides/' + entry.name)
  .sort();
const pages = ['tools', ...tools, guide, ...toolGuides];
mkdirSync(output, {recursive: true});
for (const page of pages) {
  const file = join(source, page, 'index.html');
  const html = readFileSync(file, 'utf8');
  if (!html.includes('rel="canonical" href="'+domain+'/'+page+'/"') ||
      !html.includes('id6744690319') || !html.includes('<h1>') || /name="robots" content="noindex/i.test(html)) {
    throw Error('Invalid public calendar page '+page);
  }
  mkdirSync(join(output, page), {recursive: true});
  cpSync(file, join(output, page, 'index.html'));
  for (const asset of readdirSync(join(source, page))) {
    if (asset.endsWith('.ics')) cpSync(join(source, page, asset), join(output, page, asset));
  }
}
for (const name of ['calendar-tools.js', 'calendar-tools.css']) {
  cpSync(join(source,'tools',name),join(output,'tools',name));
}
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  pages.map(page => '  <url><loc>'+domain+'/'+page+'/</loc></url>').join('\n')+'\n</urlset>\n';
writeFileSync(join(output, 'sitemap-tools.xml'), sitemap);
writeFileSync(join(output, 'tools/sitemap.xml'), sitemap);
if (!process.env.CC_FULL_BUILD && existsSync(join(here, '_headers'))) cpSync(join(here,'_headers'),join(output,'_headers'));
console.log('Built '+pages.length+' canonical pages and sitemap-tools.xml in '+output);
