/** Normalize only our invitation routes. Compact QR payloads retain the small
 * preview required by older scanners; long optional content comes from the feed. */
export function apiEndpoint(path: string, apiURL: string): URL {
  return new URL(path.replace(/^\/+/, ''), apiURL.replace(/\/+$/, '') + '/');
}

export function canonicalInvitationURL(value: unknown, apiURL: string, compact = false): URL | null {
  const raw = String(value ?? '');
  if (!raw || raw.length > 8192) return null;
  try {
    const input = new URL(raw);
    const api = new URL(apiURL);
    const debugBases = ['https://63yo3ore3c.execute-api.us-east-1.amazonaws.com',
      'https://storage.wonek.com/cloud-calendars-debug'];
    const bases = debugBases.includes(apiURL.replace(/\/+$/, '')) ? debugBases : [apiURL];
    const legacy = input.origin === 'https://appclip.apple.com'
      && input.pathname === '/id' && input.searchParams.get('p') === 'Deksan.CalendarASD.Clip';
    const routes = ['/event-invites/open', '/icloud-calendar-invites/open'];
    const path = legacy ? routes[0] : routes.find(route => bases.some(base => {
      const expected = apiEndpoint(route, base);
      return input.origin === expected.origin && input.pathname === expected.pathname;
    }));
    if (input.username || input.password || input.protocol !== 'https:'
      || !path) return null;
    const output = apiEndpoint(path, api.href);
    for (const key of path === '/event-invites/open' ? ['e', 'c'] : ['o', 'c']) {
      const id = input.searchParams.get(key) ?? '';
      if (!/^[A-Za-z0-9_-]{1,128}$/.test(id)) return null;
      output.searchParams.set(key, id);
    }
    if (path === '/event-invites/open') {
      for (const key of compact ? ['title', 'start', 'end', 'allDay']
        : ['title', 'start', 'end', 'allDay', 'location', 'eventURL']) {
        const value = input.searchParams.get(key);
        if (value !== null) output.searchParams.set(key, value);
      }
      const timeZone = input.searchParams.get('timeZone');
      if (timeZone && timeZone.length <= 128) output.searchParams.set('timeZone', timeZone);
      const color = input.searchParams.get('color');
      if (color && /^#[0-9a-f]{6}$/i.test(color)) output.searchParams.set('color', color);
    }
    return output;
  } catch { return null; }
}

/** Use canonical data, including for new clients sending only e/c. The same
 * URL works in the 1.7.0 parser and in clients that resolve links server-side. */
export function eventInvitationURLWithPreview(url: URL, event: any): URL | null {
  const start = Date.parse(event?.start);
  const end = Date.parse(event?.end);
  const title = Array.from(String(event?.title ?? '').trim()).slice(0, 120).join('');
  if (!title || !Number.isFinite(start) || !Number.isFinite(end) || end < start) return null;
  const preview = new URL(url);
  preview.searchParams.set('title', title);
  preview.searchParams.set('start', String(start / 1000));
  preview.searchParams.set('end', String(end / 1000));
  preview.searchParams.set('allDay', event.allDay ? '1' : '0');
  if (!preview.searchParams.has('timeZone') && event.details?.timeZone) {
    preview.searchParams.set('timeZone', String(event.details.timeZone).slice(0, 128));
  }
  if (event.location) preview.searchParams.set('location', Array.from(String(event.location)).slice(0, 160).join(''));
  else preview.searchParams.delete('location');
  if (event.url) preview.searchParams.set('eventURL', String(event.url).slice(0, 1024));
  else preview.searchParams.delete('eventURL');
  return preview;
}
