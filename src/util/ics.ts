// RFC 5545 generation.
//
// The two things naive .ics writers get wrong are folding and escaping, and
// both fail silently: the calendar imports, the event just comes out mangled.
// So they live here, tested, rather than inline at each call site.

/** Fold to 75 octets per RFC 5545 §3.1, without splitting a UTF-8 sequence. */
function fold(line: string): string {
  const bytes = Buffer.from(line, 'utf8');
  if (bytes.length <= 75) return line;

  const out: string[] = [];
  let start = 0;
  let limit = 75;

  while (start < bytes.length) {
    let end = Math.min(start + limit, bytes.length);
    // Never cut mid-character: continuation bytes are 10xxxxxx.
    while (end > start && end < bytes.length && (bytes[end] & 0xc0) === 0x80) end--;
    out.push(bytes.subarray(start, end).toString('utf8'));
    start = end;
    limit = 74; // continuation lines carry a leading space
  }

  return out.join('\r\n ');
}

/** Escape a TEXT value per RFC 5545 §3.3.11. Colons are *not* escaped. */
function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n|\r|\n/g, '\\n');
}

/**
 * Quote a parameter value if it carries a character that would otherwise end
 * it. Parameters use quoting, not backslash escaping - applying esc() here
 * produces a literal backslash in the output.
 */
function param(value: unknown): string {
  const v = String(value ?? '').replace(/"/g, '');
  return /[;:,]/.test(v) ? `"${v}"` : v;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** UTC timestamp: 20260826T140000Z */
export function utcStamp(date: string | number | Date): string {
  const d = new Date(date);
  return (
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    'Z'
  );
}

/** Date-only value for all-day events: 20260826 */
export function dateStamp(date: string | number | Date): string {
  const d = new Date(date);
  return d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate());
}

/**
 * Roles that see nothing but the fact that the time is taken.
 * The filtering happens here, at generation time, so a leaked feed URL leaks
 * only what that role was ever allowed to see.
 */
const OPAQUE_ROLES = new Set(['busy']);

export function eventToVEVENT(event: any, { role, busyLabel = 'Busy' }: { role?: string; busyLabel?: string }): string[] {
  const opaque = OPAQUE_ROLES.has(role);
  const lines = ['BEGIN:VEVENT'];

  lines.push(`UID:${event.id}@cloud-calendars.com`);
  lines.push(`SEQUENCE:${event.sequence ?? 0}`);
  lines.push(`DTSTAMP:${utcStamp(event.updatedAt ?? Date.now())}`);

  if (event.allDay) {
    lines.push(`DTSTART;VALUE=DATE:${dateStamp(event.start)}`);
    lines.push(`DTEND;VALUE=DATE:${dateStamp(event.end)}`);
  } else {
    lines.push(`DTSTART:${utcStamp(event.start)}`);
    lines.push(`DTEND:${utcStamp(event.end)}`);
  }

  lines.push(`SUMMARY:${esc(opaque ? busyLabel : event.title)}`);

  if (!opaque) {
    if (event.location) lines.push(`LOCATION:${esc(event.location)}`);
    if (event.description) lines.push(`DESCRIPTION:${esc(event.description)}`);
    if (event.organizerEmail) {
      const cn = event.organizerName ? `;CN=${param(event.organizerName)}` : '';
      lines.push(`ORGANIZER${cn}:mailto:${event.organizerEmail}`);
    }
  }

  // A cancelled event is kept in the feed rather than dropped, so subscribers
  // that refresh after the cancellation actually see it go away. Dropping it
  // silently leaves a stale entry on every device that already fetched it.
  lines.push(`STATUS:${event.status === 'cancelled' ? 'CANCELLED' : 'CONFIRMED'}`);

  lines.push('END:VEVENT');
  return lines;
}

export function buildFeed({ name, timeZone = 'UTC', events, role, busyLabel }: {
  name: string; timeZone?: string; events: any[]; role?: string; busyLabel?: string;
}): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Cloud Calendars//Feed//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${esc(name)}`,
    `X-WR-TIMEZONE:${timeZone}`,
    'REFRESH-INTERVAL;VALUE=DURATION:PT1H',
    'X-PUBLISHED-TTL:PT1H',
  ];

  for (const event of events) {
    lines.push(...eventToVEVENT(event, { role, busyLabel }));
  }

  lines.push('END:VCALENDAR');
  return lines.map(fold).join('\r\n') + '\r\n';
}
