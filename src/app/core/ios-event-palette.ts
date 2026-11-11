import qrcode from 'qrcode-generator';

export interface IosColorPreset {
  readonly hex: string;
  readonly label: string;
}

/** Canonical 8-swatch palette from CloudCalendars iOS (`EventTimelineColors.swift`). */
export const IOS_EVENT_COLORS: readonly IosColorPreset[] = [
  { hex: '#0A84FF', label: 'iOS Blue' },
  { hex: '#30D158', label: 'Mint Green' },
  { hex: '#BF5AF2', label: 'Vivid Purple' },
  { hex: '#FF9F0A', label: 'Warm Amber' },
  { hex: '#FF453A', label: 'Coral Red' },
  { hex: '#38E0F0', label: 'Aurora Cyan' },
  { hex: '#FFD60A', label: 'Sun Yellow' },
  { hex: '#A2845E', label: 'Sandstone' },
];

export interface IosEventVisualStyle {
  readonly hex: string;
  readonly fill: string;
  readonly fillDragging: string;
  readonly accentBar: string;
  readonly titleColor: string;
  readonly detailColor: string;
  readonly borderColor: string;
}

function parseHexRgb(hex?: string | null): [number, number, number, string] {
  const clean = (hex || '').trim();
  const match = /^#?([0-9a-fA-F]{6})$/.exec(clean);
  if (!match) {
    return [10, 132, 255, '#0A84FF'];
  }
  const h = match[1].toUpperCase();
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
    `#${h}`,
  ];
}

/**
 * Exact algorithmic port of `EventTimelineColors.swift`:
 * - Dark mode uses an opaque darkened card fill (`0.33 * RGB`) so grid lines never bleed through,
 *   full-saturation event color for title text, and `0.82 * RGB` for time/location details.
 * - Light mode uses `rgba(R,G,B,0.15)` fill with darkened `0.52 * RGB` title text.
 */
export function computeIosEventStyle(
  hex?: string | null,
  surface: 'dark' | 'light' = 'dark',
): IosEventVisualStyle {
  const [r, g, b, normalized] = parseHexRgb(hex);

  if (surface === 'light') {
    const tr = Math.round(r * 0.48);
    const tg = Math.round(g * 0.48);
    const tb = Math.round(b * 0.48);
    const dr = Math.round(r * 0.62);
    const dg = Math.round(g * 0.62);
    const db = Math.round(b * 0.62);
    return {
      hex: normalized,
      fill: `rgba(${r}, ${g}, ${b}, 0.15)`,
      fillDragging: `rgba(${r}, ${g}, ${b}, 0.28)`,
      accentBar: normalized,
      titleColor: `rgb(${tr}, ${tg}, ${tb})`,
      detailColor: `rgb(${dr}, ${dg}, ${db})`,
      borderColor: `rgba(${r}, ${g}, ${b}, 0.28)`,
    };
  }

  // Dark mode: blend 33% color onto deep surface (#090C18) so even yellow/cyan stay crisp & opaque
  const baseR = 9;
  const baseG = 12;
  const baseB = 24;
  const fr = Math.round(baseR * 0.67 + r * 0.33);
  const fg = Math.round(baseG * 0.67 + g * 0.33);
  const fb = Math.round(baseB * 0.67 + b * 0.33);

  const dr = Math.round(baseR * 0.54 + r * 0.46);
  const dg = Math.round(baseG * 0.54 + g * 0.46);
  const db = Math.round(baseB * 0.54 + b * 0.46);

  // Boost luminance slightly for very dark custom colors so text stays legible
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  const boost = lum < 95 ? 1.45 : 1;
  const tr = Math.min(255, Math.round(r * boost + (lum < 95 ? 45 : 0)));
  const tg = Math.min(255, Math.round(g * boost + (lum < 95 ? 45 : 0)));
  const tb = Math.min(255, Math.round(b * boost + (lum < 95 ? 45 : 0)));

  const subR = Math.min(255, Math.round(tr * 0.84 + 28));
  const subG = Math.min(255, Math.round(tg * 0.84 + 30));
  const subB = Math.min(255, Math.round(tb * 0.84 + 36));

  return {
    hex: normalized,
    fill: `rgb(${fr}, ${fg}, ${fb})`,
    fillDragging: `rgb(${dr}, ${dg}, ${db})`,
    accentBar: normalized,
    titleColor: `rgb(${tr}, ${tg}, ${tb})`,
    detailColor: `rgba(${subR}, ${subG}, ${subB}, 0.88)`,
    borderColor: `rgba(${r}, ${g}, ${b}, 0.38)`,
  };
}

export interface TimedBlockInput<T = unknown> {
  readonly id: string;
  readonly startMinutes: number;
  readonly endMinutes: number;
  readonly data: T;
}

export interface PositionedTimedBlock<T = unknown> extends TimedBlockInput<T> {
  readonly colIndex: number;
  readonly colCount: number;
  readonly leftPct: number;
  readonly widthPct: number;
}

/**
 * Places overlapping day events into side-by-side columns cleanly
 * (matching `TimelineCanvasView` overlap clusters).
 */
export function layoutTimedBlocks<T>(items: readonly TimedBlockInput<T>[]): PositionedTimedBlock<T>[] {
  if (!items.length) return [];
  const sorted = [...items].sort((a, b) => {
    if (a.startMinutes !== b.startMinutes) return a.startMinutes - b.startMinutes;
    return (b.endMinutes - b.startMinutes) - (a.endMinutes - a.startMinutes);
  });

  const out: PositionedTimedBlock<T>[] = [];
  let cluster: TimedBlockInput<T>[] = [];
  let clusterMaxEnd = -1;

  const flushCluster = () => {
    if (!cluster.length) return;
    const colEnds: number[] = [];
    const assigned: { item: TimedBlockInput<T>; col: number }[] = [];

    for (const item of cluster) {
      const effectiveEnd = Math.max(item.startMinutes + 15, item.endMinutes);
      let placedCol = -1;
      for (let c = 0; c < colEnds.length; c++) {
        if (colEnds[c] <= item.startMinutes) {
          placedCol = c;
          colEnds[c] = effectiveEnd;
          break;
        }
      }
      if (placedCol === -1) {
        placedCol = colEnds.length;
        colEnds.push(effectiveEnd);
      }
      assigned.push({ item, col: placedCol });
    }

    const totalCols = Math.max(1, colEnds.length);
    const widthPct = 100 / totalCols;
    for (const { item, col } of assigned) {
      out.push({
        ...item,
        colIndex: col,
        colCount: totalCols,
        leftPct: col * widthPct,
        widthPct: totalCols > 1 ? widthPct - 0.8 : 100,
      });
    }
    cluster = [];
    clusterMaxEnd = -1;
  };

  for (const item of sorted) {
    const effectiveEnd = Math.max(item.startMinutes + 15, item.endMinutes);
    if (cluster.length > 0 && item.startMinutes >= clusterMaxEnd) {
      flushCluster();
    }
    cluster.push(item);
    if (effectiveEnd > clusterMaxEnd) clusterMaxEnd = effectiveEnd;
  }
  flushCluster();

  return out;
}

function toUtcCompact(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T` +
    `${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

export function buildGoogleCalendarUrl(opts: {
  title: string;
  start: string;
  end: string;
  description?: string;
  location?: string;
}): string {
  const u = new URL('https://calendar.google.com/calendar/render');
  u.searchParams.set('action', 'TEMPLATE');
  u.searchParams.set('text', opts.title);
  u.searchParams.set('dates', `${toUtcCompact(opts.start)}/${toUtcCompact(opts.end)}`);
  if (opts.description) u.searchParams.set('details', opts.description);
  if (opts.location) u.searchParams.set('location', opts.location);
  return u.toString();
}

export function buildOutlookCalendarUrl(opts: {
  title: string;
  start: string;
  end: string;
  description?: string;
  location?: string;
}): string {
  const u = new URL('https://outlook.live.com/calendar/0/deeplink/compose');
  u.searchParams.set('path', '/calendar/action/compose');
  u.searchParams.set('rru', 'addevent');
  u.searchParams.set('subject', opts.title);
  u.searchParams.set('startdt', new Date(opts.start).toISOString());
  u.searchParams.set('enddt', new Date(opts.end).toISOString());
  if (opts.description) u.searchParams.set('body', opts.description);
  if (opts.location) u.searchParams.set('location', opts.location);
  return u.toString();
}

export function buildSingleEventIcs(opts: {
  uid: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  location?: string;
  url?: string;
  color?: string;
}): string {
  const esc = (v: string) =>
    v.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Arte Soft//Cloud Calendars Web//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${opts.uid}`,
    `DTSTAMP:${toUtcCompact(new Date().toISOString())}`,
    `DTSTART:${toUtcCompact(opts.start)}`,
    `DTEND:${toUtcCompact(opts.end)}`,
    `SUMMARY:${esc(opts.title)}`,
  ];
  if (opts.location) lines.push(`LOCATION:${esc(opts.location)}`);
  if (opts.description) lines.push(`DESCRIPTION:${esc(opts.description)}`);
  if (opts.url) lines.push(`URL:${opts.url}`);
  lines.push('END:VEVENT', 'END:VCALENDAR', '');
  return lines.join('\r\n');
}

export function downloadIcsFile(filename: string, icsText: string): void {
  if (typeof document === 'undefined') return;
  const blob = new Blob([icsText], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.ics') ? filename : `${filename}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function generateQrSvgDataUrl(value: string): string {
  if (!value) return '';
  try {
    const qr = qrcode(0, 'M');
    qr.addData(value);
    qr.make();
    const svg = qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  } catch {
    return '';
  }
}

export const COMMON_TIMEZONES: readonly string[] = [
  'Europe/Sofia',
  'Europe/London',
  'Europe/Berlin',
  'Europe/Paris',
  'Europe/Madrid',
  'Europe/Rome',
  'Europe/Amsterdam',
  'Europe/Zurich',
  'Europe/Athens',
  'Europe/Bucharest',
  'Europe/Warsaw',
  'Europe/Istanbul',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Toronto',
  'America/Sao_Paulo',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Asia/Seoul',
  'Australia/Sydney',
  'UTC',
];

export function detectBrowserTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}
