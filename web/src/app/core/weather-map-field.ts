// WeatherKit returns wind from a bearing in km/h and temperatures in °C.
export type MapLayer = 'wind' | 'temperature';
export type MapLocation = { latitude: number; longitude: number };
export type MapViewport = { x: number; y: number; width: number; height: number };
export type MapGrid = MapLocation & { latRadius: number; lonRadius: number; side: number };
export type MapHour = { forecastStart: string; windSpeed: number; windDirection: number; temperature: number };
export type MapReading = { east: number; north: number; temperature: number };
export type MapField = { grid: MapGrid; dates: number[]; frames: MapReading[][] };

export const clamp = (n: number, low: number, high: number) => Math.min(high, Math.max(low, n));
export const wrap = (lon: number) => ((((lon + 180) % 360) + 360) % 360) - 180;
export const worldX = (lon: number) => lon / 360 + 0.5;
export const worldY = (lat: number) =>
  0.5 - Math.asinh(Math.tan((clamp(lat, -85.051129, 85.051129) * Math.PI) / 180)) / (2 * Math.PI);
export const latitudeAt = (y: number) => (Math.atan(Math.sinh(Math.PI * (1 - 2 * y))) * 180) / Math.PI;

const mercatorLimit = latitudeAt(0);
export function forecastGrid(viewport: MapViewport, side: 3 | 7): MapGrid {
  const north = latitudeAt(clamp(viewport.y, 0, 1));
  const south = latitudeAt(clamp(viewport.y + viewport.height, 0, 1));
  const radius = (span: number, max: number) =>
    Math.min(max, 2 ** (Math.ceil(Math.log2(Math.max(0.125, span * 0.65)) * 2) / 2));
  const latRadius = radius(north - south, mercatorLimit);
  const lonRadius = radius(viewport.width * 360, 180);
  const snap = (value: number, step: number) => (Math.round(value / (step / 3)) * step) / 3;
  return {
    latitude: clamp(snap((north + south) / 2, latRadius), -mercatorLimit + latRadius, mercatorLimit - latRadius),
    longitude: lonRadius === 180 ? 0 : wrap(snap((viewport.x + viewport.width / 2) * 360 - 180, lonRadius)),
    latRadius,
    lonRadius,
    side,
  };
}

// Test the whole longitude interval, including viewports that cross the date line.
export function gridCoversViewport(grid: MapGrid, viewport: MapViewport): boolean {
  const longitude = (viewport.x + viewport.width / 2) * 360 - 180;
  const epsilon = 1e-9;
  return (grid.lonRadius === 180 ||
      Math.abs(wrap(longitude - grid.longitude)) + viewport.width * 180 <= grid.lonRadius + epsilon)
    && latitudeAt(clamp(viewport.y, 0, 1)) <= grid.latitude + grid.latRadius + epsilon
    && latitudeAt(clamp(viewport.y + viewport.height, 0, 1)) >= grid.latitude - grid.latRadius - epsilon;
}

export function gridCoordinates(grid: MapGrid): MapLocation[] {
  return Array.from({ length: grid.side ** 2 }, (_, i) => ({
    latitude: grid.latitude + (1 - (2 * Math.floor(i / grid.side)) / (grid.side - 1)) * grid.latRadius,
    longitude: wrap(grid.longitude + ((2 * (i % grid.side)) / (grid.side - 1) - 1) * grid.lonRadius),
  }));
}

export function makeMapField(grid: MapGrid, points: MapHour[][], now = Date.now()): MapField {
  if (!points.length || points.length !== grid.side ** 2) throw Error('Incomplete map forecast');
  const start = Math.floor(now / 3_600_000) * 3_600_000;
  const series = points.map(
    (hours) =>
      new Map(
        hours
          .filter((h) => [h.windSpeed, h.windDirection, h.temperature].every(Number.isFinite))
          .map((h) => {
            const angle = (h.windDirection * Math.PI) / 180;
            return [
              Date.parse(h.forecastStart),
              {
                east: (-h.windSpeed * Math.sin(angle)) / 3.6,
                north: (-h.windSpeed * Math.cos(angle)) / 3.6,
                temperature: h.temperature,
              },
            ] as const;
          })
      )
  );
  const dates = [...series[0].keys()]
    .filter((t) => t >= start - 4 * 3_600_000 && t <= start + 12 * 3_600_000 && series.every((s) => s.has(t)))
    .sort((a, b) => a - b);
  if (!dates.length) throw Error('Incomplete map forecast');
  return { grid, dates, frames: dates.map((t) => series.map((point) => point.get(t)!)) };
}

const mix = (a: number, b: number, f: number) => a + (b - a) * f;
function blend(a: MapReading, b: MapReading, f: number): MapReading {
  return {
    east: mix(a.east, b.east, f),
    north: mix(a.north, b.north, f),
    temperature: mix(a.temperature, b.temperature, f),
  };
}
export function mapFrame(field: MapField, position: number) {
  const p = clamp(position, 0, field.dates.length - 1),
    i = Math.floor(p);
  return i === p ? field.frames[i] : field.frames[i].map((a, cell) => blend(a, field.frames[i + 1][cell], p - i));
}
export function mapReading(grid: MapGrid, frame: MapReading[], lat: number, lon: number): MapReading | undefined {
  const last = grid.side - 1;
  const x = ((wrap(lon - grid.longitude) / grid.lonRadius + 1) * last) / 2;
  const y = ((1 - (lat - grid.latitude) / grid.latRadius) * last) / 2;
  if (x < 0 || x > last || y < 0 || y > last) return;
  const col = Math.min(last - 1, Math.floor(x)),
    row = Math.min(last - 1, Math.floor(y));
  const i = row * grid.side + col;
  return blend(
    blend(frame[i], frame[i + 1], x - col),
    blend(frame[i + grid.side], frame[i + grid.side + 1], x - col),
    y - row
  );
}

// RGB stops from WindMapPalette. Wind stops are km/h, temperatures are °C.
const windStops = [
  [0, 8, 97, 171],
  [25, 10, 148, 186],
  [50, 41, 179, 133],
  [80, 212, 204, 59],
  [120, 242, 92, 61],
  [160, 168, 64, 179],
];
const temperatureStops = [
  [-40, 64, 10, 112],
  [-20, 20, 56, 194],
  [-10, 31, 110, 209],
  [0, 41, 145, 184],
  [10, 46, 145, 163],
  [13, 54, 148, 156],
  [16, 84, 156, 110],
  [20, 189, 161, 15],
  [24, 219, 135, 5],
  [30, 240, 74, 10],
  [40, 179, 20, 26],
  [55, 107, 8, 28],
];
export function mapColor(value: number, layer: MapLayer): number[] {
  const stops = layer === 'wind' ? windStops : temperatureStops;
  const high = stops.findIndex((s) => value <= s[0]);
  if (high <= 0) return stops[high < 0 ? stops.length - 1 : 0].slice(1);
  const a = stops[high - 1],
    b = stops[high],
    f = (value - a[0]) / (b[0] - a[0]);
  return [1, 2, 3].map((c) => Math.round(mix(a[c], b[c], f)));
}
