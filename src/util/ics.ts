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

/** URL is a URI value, not RFC 5545 TEXT. Remove line breaks instead of
 * applying TEXT escaping, which would corrupt an otherwise valid URL. */
function safeUri(value: unknown): string {
  return String(value ?? '').replace(/[\r\n]/g, '');
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

function recurrenceLine(rule: any): string | null {
  if (!rule || typeof rule !== 'object') return null;
  const frequencies = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];
  const weekdays = ['', 'SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  const frequency = frequencies[Number(rule.frequency)];
  if (!frequency) return null;

  const values = [`FREQ=${frequency}`, `INTERVAL=${Math.max(1, Number(rule.interval) || 1)}`];
  if (Array.isArray(rule.daysOfTheWeek) && rule.daysOfTheWeek.length) {
    const days = rule.daysOfTheWeek.map((day: any) => {
      const weekday = weekdays[Number(day.weekday)];
      if (!weekday) return null;
      const ordinal = Number(day.weekNumber) || 0;
      return `${ordinal === 0 ? '' : ordinal}${weekday}`;
    }).filter(Boolean);
    if (days.length) values.push(`BYDAY=${days.join(',')}`);
  }
  const lists: Array<[string, unknown]> = [
    ['BYMONTHDAY', rule.daysOfTheMonth],
    ['BYMONTH', rule.monthsOfTheYear],
    ['BYWEEKNO', rule.weeksOfTheYear],
    ['BYYEARDAY', rule.daysOfTheYear],
    ['BYSETPOS', rule.setPositions],
  ];
  for (const [name, list] of lists) {
    if (Array.isArray(list) && list.length) values.push(`${name}=${list.join(',')}`);
  }
  if (rule.endDate && !Number.isNaN(Date.parse(rule.endDate))) {
    values.push(`UNTIL=${utcStamp(rule.endDate)}`);
  } else if (Number(rule.occurrenceCount) > 0) {
    values.push(`COUNT=${Math.trunc(Number(rule.occurrenceCount))}`);
  }
  return `RRULE:${values.join(';')}`;
}

function duration(secondsValue: unknown): string | null {
  const seconds = Number(secondsValue);
  if (!Number.isFinite(seconds)) return null;
  const sign = seconds < 0 ? '-' : '';
  let remaining = Math.abs(Math.round(seconds));
  const days = Math.floor(remaining / 86400);
  remaining %= 86400;
  const hours = Math.floor(remaining / 3600);
  remaining %= 3600;
  const minutes = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const date = days ? `${days}D` : '';
  const time = hours || minutes || secs ? `T${hours ? `${hours}H` : ''}${minutes ? `${minutes}M` : ''}${secs ? `${secs}S` : ''}` : '';
  return `${sign}P${date}${time || 'T0S'}`;
}

function participantLine(participant: any): string | null {
  if (!participant?.email) return null;
  const roles: Record<number, string> = { 1: 'REQ-PARTICIPANT', 2: 'OPT-PARTICIPANT', 3: 'CHAIR', 4: 'NON-PARTICIPANT' };
  const statuses: Record<number, string> = { 1: 'PENDING', 2: 'ACCEPTED', 3: 'DECLINED', 4: 'TENTATIVE', 5: 'DELEGATED', 6: 'COMPLETED', 7: 'IN-PROCESS' };
  const pieces = [
    participant.name ? `CN=${param(participant.name)}` : null,
    roles[Number(participant.role)] ? `ROLE=${roles[Number(participant.role)]}` : null,
    statuses[Number(participant.status)] ? `PARTSTAT=${statuses[Number(participant.status)]}` : null,
  ].filter(Boolean);
  return `ATTENDEE${pieces.length ? `;${pieces.join(';')}` : ''}:mailto:${safeUri(participant.email)}`;
}

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
    const details = event.details ?? null;
    if (event.location) lines.push(`LOCATION:${esc(event.location)}`);
    if (event.url) lines.push(`URL:${safeUri(event.url)}`);
    const notes = details?.notes ?? event.description;
    if (notes) lines.push(`DESCRIPTION:${esc(notes)}`);
    if (details?.availability === 1) lines.push('TRANSP:TRANSPARENT');
    else if (details) lines.push('TRANSP:OPAQUE');
    if (details?.structuredLocation?.latitude != null && details?.structuredLocation?.longitude != null) {
      lines.push(`GEO:${details.structuredLocation.latitude};${details.structuredLocation.longitude}`);
    }
    const recurrence = recurrenceLine(details?.recurrenceRules?.[0]);
    if (recurrence) lines.push(recurrence);

    const organizerEmail = details?.organizer?.email ?? event.organizerEmail;
    const organizerName = details?.organizer?.name ?? event.organizerName;
    if (organizerEmail) {
      const cn = organizerName ? `;CN=${param(organizerName)}` : '';
      lines.push(`ORGANIZER${cn}:mailto:${safeUri(organizerEmail)}`);
    }
    for (const attendee of details?.attendees ?? []) {
      const attendeeLine = participantLine(attendee);
      if (attendeeLine) lines.push(attendeeLine);
    }

    // This private extension carries the exact portable EventKit model. The
    // regular fields above keep the feed useful to other calendar clients;
    // the extension makes app-to-app sync lossless without exposing internal
    // identifiers in the visible EKEvent URL field.
    if (details) {
      const metadata = Buffer.from(JSON.stringify(details), 'utf8').toString('base64');
      lines.push(`X-CLOUD-CALENDARS-METADATA:${metadata}`);
    }
  }

  // A cancelled event is kept in the feed rather than dropped, so subscribers
  // that refresh after the cancellation actually see it go away. Dropping it
  // silently leaves a stale entry on every device that already fetched it.
  lines.push(`STATUS:${event.status === 'cancelled' ? 'CANCELLED' : 'CONFIRMED'}`);

  if (!opaque) {
    for (const alarm of event.details?.alarms ?? []) {
      const trigger = alarm.absoluteDate && !Number.isNaN(Date.parse(alarm.absoluteDate))
        ? `TRIGGER;VALUE=DATE-TIME:${utcStamp(alarm.absoluteDate)}`
        : duration(alarm.relativeOffset) && `TRIGGER:${duration(alarm.relativeOffset)}`;
      if (!trigger) continue;
      lines.push('BEGIN:VALARM');
      lines.push('ACTION:DISPLAY');
      lines.push(trigger);
      lines.push(`DESCRIPTION:${esc(event.title)}`);
      lines.push('END:VALARM');
    }
  }

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
