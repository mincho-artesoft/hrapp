import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const output = join(here, '../../dist/calendar-guide-routes');
mkdirSync(dirname(output), { recursive: true });
const stage = mkdtempSync(output + '-');
const internal = '/site-files';
const files = join(stage, internal);
const redirects = [];
let headers = readFileSync(join(here, '_headers'), 'utf8');

try {
  execFileSync(process.execPath, [join(here, 'build.mjs'), files], {
    env: { ...process.env, CC_FULL_BUILD: '1' },
    stdio: 'inherit',
  });

  for (const entry of readdirSync(files, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const path = join(entry.parentPath, entry.name).slice(files.length);
    if (entry.name === 'index.html') {
      const page = path.slice(0, -'index.html'.length);
      redirects.push(`${page} ${internal}${page} 200`, `${page.slice(0, -1)} ${page} 301`);
    } else {
      redirects.push(`${path} ${internal}${path} 200`);
      if (path.endsWith('.ics')) {
        for (const prefix of ['', internal]) {
          headers += `\n${prefix}${path}\n  Content-Type: text/calendar; charset=utf-8\n  Content-Disposition: attachment; filename="${basename(path)}"\n`;
        }
      }
    }
  }

  // Preserve the existing portal forwarding for paths outside this static publication.
  for (const prefix of ['/tools/', '/articles/24-48-firefighter-shift-calendar-ics-download/']) {
    redirects.push(`${prefix}* https://cloud-calendars.arte-soft.com${prefix}:splat 302`);
  }
  writeFileSync(join(stage, '_redirects'), redirects.join('\n') + '\n');
  writeFileSync(join(stage, '_headers'), headers);
  rmSync(output, { recursive: true, force: true });
  renameSync(stage, output);
} finally {
  rmSync(stage, { recursive: true, force: true });
}
