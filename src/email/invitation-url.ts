/** Normalize only our invitation routes. QR payloads refer to canonical data,
 * not an arbitrarily long, percent-encoded copy of the event. */
export function canonicalInvitationURL(value: unknown, apiURL: string, compact = false): URL | null {
  const raw = String(value ?? '');
  if (!raw || raw.length > 8192) return null;
  try {
    const input = new URL(raw);
    const api = new URL(apiURL);
    const legacy = input.origin === 'https://appclip.apple.com'
      && input.pathname === '/id' && input.searchParams.get('p') === 'Deksan.CalendarASD.Clip';
    const path = legacy ? '/event-invites/open' : input.pathname;
    if (input.username || input.password || input.protocol !== 'https:'
      || (!legacy && input.origin !== api.origin)
      || !['/event-invites/open', '/icloud-calendar-invites/open'].includes(path)) return null;
    const output = new URL(path, api);
    for (const key of path === '/event-invites/open' ? ['e', 'c'] : ['o', 'c']) {
      const id = input.searchParams.get(key) ?? '';
      if (!/^[A-Za-z0-9_-]{1,128}$/.test(id)) return null;
      output.searchParams.set(key, id);
    }
    if (path === '/event-invites/open') {
      if (!compact) {
        for (const key of ['title', 'start', 'end', 'allDay', 'location', 'eventURL']) {
          const value = input.searchParams.get(key);
          if (value !== null) output.searchParams.set(key, value);
        }
      }
      const timeZone = input.searchParams.get('timeZone');
      if (timeZone && timeZone.length <= 128) output.searchParams.set('timeZone', timeZone);
      const color = input.searchParams.get('color');
      if (color && /^#[0-9a-f]{6}$/i.test(color)) output.searchParams.set('color', color);
    }
    return output;
  } catch { return null; }
}
