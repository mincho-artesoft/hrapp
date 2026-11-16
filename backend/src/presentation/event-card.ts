/** Equivalent to iOS EventTimelineColors, for email and invitation previews. */
export function eventPalette(value: unknown) {
  const color = /^#[0-9a-f]{6}$/i.test(String(value)) ? String(value).toUpperCase() : '#0A84FF';
  const rgb = [1, 3, 5].map(i => parseInt(color.slice(i, i + 2), 16));
  const hex = (values: number[]) => '#' + values.map(n => Math.round(n).toString(16).padStart(2, '0')).join('').toUpperCase();
  return {
    color,
    title: hex(rgb.map(n => n * .58)),
    detail: hex(rgb.map(n => n * .82)),
    light: hex(rgb.map(n => n * .15 + 255 * .85)),
    dark: hex(rgb.map(n => n * .33)),
  };
}

export function eventIcon(kind: 'calendar' | 'clock' | 'location') {
  const path = kind === 'clock'
    ? '<circle cx="12" cy="12" r="9"/><path d="M12 5v7h5"/>'
    : kind === 'location'
      ? '<path d="m3 10 18-7-7 18-3-8-8-3Z"/>'
      : '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6m10-6v6M3 10h18"/>';
  return `<svg class="event-symbol" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
}

export const EVENT_CARD_CSS = `
  .preview-card { position:relative; display:flex; flex-direction:column; gap:2px; width:100%; padding:5px 7px 5px 12px; border-radius:5px; overflow:hidden; background:color-mix(in srgb,var(--event-color,#0A84FF) 15%,transparent); color:color-mix(in srgb,var(--event-color,#0A84FF) 82%,black); }
  .preview-card::before { content:""; position:absolute; inset-block:5px; inset-inline-start:5px; width:3px; border-radius:999px; background:var(--event-color,#0A84FF); }
  .event-title { margin:0; font-size:16px; line-height:20px; font-weight:600; overflow-wrap:anywhere; color:color-mix(in srgb,var(--event-color,#0A84FF) 58%,black); }
  .preview-row { display:flex; align-items:baseline; gap:4px; font-size:14px; line-height:19px; font-weight:400; white-space:pre-line; }
  .preview-row > span { min-width:0; overflow-wrap:anywhere; }
  .event-symbol { flex:none; vertical-align:-2px; }
  [dir="rtl"] .preview-card { padding-inline:12px 7px; }
  .event-cancelled .event-title { text-decoration:line-through; }
  @media (prefers-color-scheme:dark) {
    .preview-card { background:color-mix(in srgb,var(--event-color,#0A84FF) 33%,black); }
    .event-title { color:var(--event-color,#0A84FF); }
  }
`;
