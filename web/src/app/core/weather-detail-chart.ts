import type { ForecastHour, Snapshot } from './weather.service';

export const weatherDetailChoices = [
  { value: 'temp', label: 'Conditions', symbol: 'cloud.sun.fill' },
  { value: 'uv', label: 'UV Index', symbol: 'sun.max.fill' },
  { value: 'wind', label: 'Wind', symbol: 'wind' },
  { value: 'precip', label: 'Precipitation', symbol: 'drop.fill' },
  { value: 'humidity', label: 'Humidity', symbol: 'humidity' },
  { value: 'visibility', label: 'Visibility', symbol: 'eye.fill' },
  { value: 'pressure', label: 'Pressure', symbol: 'gauge' },
] as const;
export type WeatherMetric = (typeof weatherDetailChoices)[number]['value'];
export type ChartMetric = WeatherMetric | 'chance';
type PlotPoint = { x: number; y: number; value: number; hour: ForecastHour };
export type ColorStop = { offset: number; color: string };
const hourMs = 3_600_000;
export const finite = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
export const bounds = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
export const mean = (values: number[]) => values.reduce((a, b) => a + b, 0) / values.length;

function chartScale(metric: ChartMetric, values: number[], imperial: boolean) {
  const min = Math.min(...values),
    max = Math.max(...values);
  switch (metric) {
    case 'temp':
      return { low: Math.floor(min / 10) * 10 - 10, high: Math.ceil(max / 10) * 10 + 10, step: 5 };
    case 'uv':
      return { low: 0, high: Math.max(12, Math.ceil(max)), step: 1 };
    case 'chance':
    case 'humidity':
      return { low: 0, high: 100, step: metric === 'chance' ? 25 : 20 };
    case 'wind':
      return { low: 0, high: Math.max(10, Math.ceil(max / 5) * 5 + 3), step: 5 };
    case 'visibility':
      return { low: 0, high: Math.max(imperial ? 30 : 50, Math.ceil(max / 5) * 5), step: 5 };
    case 'pressure': {
      const step = imperial ? 0.1 : 5,
        buffer = imperial ? 0.08 : 3;
      const low = Math.floor(min / step) * step - buffer;
      return { low, high: Math.max(low + step * 3, Math.ceil(max / step) * step + buffer), step };
    }
    case 'precip': {
      const scale = imperial ? 1 / 25.4 : 1;
      return { low: 0, high: Math.max(10, Math.ceil(max / scale) + 2) * scale, step: 2 * scale };
    }
  }
}

export function hourlyValue(h: ForecastHour, metric: ChartMetric, apparent: boolean, imperial: boolean) {
  switch (metric) {
    case 'temp':
      return apparent ? h.feelsLike : h.temperature;
    case 'uv':
      return h.uv;
    case 'wind':
      return h.wind;
    case 'precip':
      return h.precipitation / (imperial ? 25.4 : 1);
    case 'chance':
      return h.precipitationChance;
    case 'humidity':
      return h.humidity;
    case 'visibility':
      return h.visibility;
    case 'pressure':
      return h.pressure * (imperial ? 0.02953 : 1);
  }
}

function palette(metric: ChartMetric, low: number, high: number, imperial: boolean): ColorStop[] {
  if (metric === 'temp') {
    const stops = [
      [-10, '#7336b3'],
      [0, '#293dcc'],
      [12, '#45b5e6'],
      [22, '#54cc52'],
      [25, '#ffe033'],
      [30, '#ff861a'],
      [35, '#e61717'],
    ] as const;
    return stops.map(([c, color]) => ({
      offset: bounds(((imperial ? c * 1.8 + 32 : c) - low) / (high - low), 0, 1),
      color,
    }));
  }
  const colors: Record<Exclude<ChartMetric, 'temp'>, string[]> = {
    uv: ['#34c759', '#ffcc00', '#ff9500', '#ff3b30', '#af52de'],
    wind: ['#0a84ff'],
    precip: ['#0a84ff'],
    chance: ['#0a84ff'],
    humidity: ['#ffcc00', '#0a84ff'],
    visibility: ['#98989d'],
    pressure: ['#0a84ff', '#ff453a'],
  };
  return colors[metric].map((color, i, list) => ({
    offset: metric === 'uv' ? [0, 0.3, 0.58, 0.75, 1][i] : i / Math.max(1, list.length - 1),
    color,
  }));
}

export function weatherChart(snapshot: Snapshot, date: string, metric: ChartMetric, apparent = false) {
  const imperial = snapshot.windUnit === 'mph';
  const dayIndex = snapshot.daily.findIndex((d) => d.iso === date);
  const day = snapshot.daily[dayIndex];
  const hours = snapshot.forecastHours ?? [];
  const selected = hours.filter((h) => h.iso.startsWith(date + 'T'));
  if (!day || !selected.length) return null;
  const tomorrow = new Date(date + 'T12:00:00Z');
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  const nextMidnight = hours.find((h) => h.iso.startsWith(tomorrow.toISOString().slice(0, 10) + 'T00:'));
  const start = Date.parse(day.instant ?? '');
  const end = Date.parse(snapshot.daily[dayIndex + 1]?.instant ?? nextMidnight?.instant ?? '');
  const first = selected[0],
    last = selected[selected.length - 1];
  const elapsed = Date.parse(last.instant ?? '') - Date.parse(first.instant ?? '');
  const duration = Number.isFinite(end - start)
    ? (end - start) / hourMs
    : Number.isFinite(elapsed)
      ? 24 + elapsed / hourMs - (Number(last.iso.slice(11, 13)) - Number(first.iso.slice(11, 13)))
      : 24;
  const fraction = (h: ForecastHour) =>
    h === nextMidnight
      ? 1
      : Number.isFinite(start) && h.instant
        ? (Date.parse(h.instant) - start) / (duration * hourMs)
        : Number(h.iso.slice(11, 13)) / 24;
  const samples = nextMidnight && metric !== 'precip' ? [...selected, nextMidnight] : selected;
  const second = (h: ForecastHour) =>
    metric === 'wind' ? h.gust : metric === 'precip' && finite(h.snowfall) ? h.snowfall / (imperial ? 25.4 : 1) : NaN;
  const primary = (h: ForecastHour) => hourlyValue(h, metric, apparent, imperial);
  const values = selected.map(primary).filter(finite);
  if (!values.length) return null;
  const scaleValues = samples
    .flatMap((h) => [primary(h), second(h), metric === 'temp' ? hourlyValue(h, metric, !apparent, imperial) : NaN])
    .filter(finite);
  const { low, high, step } = chartScale(metric, scaleValues, imperial);
  const y = (n: number) => bounds((100 * (high - n)) / (high - low), 0, 100);
  const series = (read: (h: ForecastHour) => number) =>
    samples.flatMap((hour) => {
      const value = read(hour);
      return finite(value) ? [{ hour, value, x: 100 * fraction(hour), y: y(value) }] : [];
    });
  const points = series(primary),
    extra = series(second);
  const ticks = Array.from({ length: Math.floor((high - low) / step + 0.0001) + 1 }, (_, i) => ({
    value: low + i * step,
    y: y(low + i * step),
  }));
  const axes = [0, 6, 12, 18, 24].map((hour) => {
    const sample = selected.find((h) => Number(h.iso.slice(11, 13)) === hour);
    return { hour, x: sample ? fraction(sample) * 100 : (hour / 24) * 100 };
  });
  const groups = (p: PlotPoint[]) => {
    const parts: PlotPoint[][] = [];
    for (const pt of p) {
      const last = parts.at(-1);
      if (!last || pt.x - last[last.length - 1].x > 150 / duration) parts.push([pt]);
      else last.push(pt);
    }
    return parts.map((part) => {
      const line = part.map((pt, i) => (i ? 'L' : 'M') + pt.x + ' ' + pt.y).join(' ');
      return { line, area: line + ' L' + part[part.length - 1].x + ' 100 L' + part[0].x + ' 100 Z' };
    });
  };
  const extrema = (list: PlotPoint[], highest: boolean) =>
    list.reduce((a, b) => ((highest ? b.value > a.value : b.value < a.value) ? b : a));
  const markers: { point: PlotPoint; label: string; color?: string }[] = [];
  if (metric !== 'precip') {
    markers.push({
      point: extrema(points, true),
      label: metric === 'temp' ? 'H' : metric === 'wind' ? 'Max S' : 'Max',
    });
    if (metric === 'wind' && extra.length)
      markers.push({ point: extrema(extra, true), label: 'Max G', color: '#30d158' });
    else if (metric !== 'wind' && metric !== 'uv' && Math.min(...values) !== Math.max(...values))
      markers.push({ point: extrema(points, false), label: metric === 'temp' ? 'L' : 'Min' });
  }
  const colors = palette(metric, low, high, imperial);
  for (const marker of markers) {
    if (!marker.color) {
      const fraction = 1 - marker.point.y / 100;
      marker.color = colors.reduce((best, stop) =>
        Math.abs(stop.offset - fraction) <= Math.abs(best.offset - fraction) ? stop : best
      ).color;
    }
  }
  const unit =
    metric === 'temp'
      ? '°'
      : metric === 'pressure'
        ? imperial
          ? 'inHg'
          : 'hPa'
        : metric === 'wind'
          ? snapshot.windUnit
          : metric === 'visibility'
            ? (snapshot.visibilityUnit ?? 'km')
            : metric === 'precip'
              ? imperial
                ? 'in'
                : 'mm'
              : metric === 'humidity' || metric === 'chance'
                ? '%'
                : '';
  return {
    points,
    extra,
    paths: groups(points),
    extraPaths: groups(extra),
    ticks,
    axes,
    markers,
    colors,
    unit,
    columnWidth: 100 / duration,
    low,
    high,
    y,
    duration,
    start,
    values,
    selected,
    min: Math.min(...values),
    max: Math.max(...values),
    avg: mean(values),
  };
}
