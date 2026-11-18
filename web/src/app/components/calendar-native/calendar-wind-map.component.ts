import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, input, OnDestroy, signal, viewChild } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { CalendarNativeTextPipe } from '../../core/calendar-localization';
import { Place } from '../../core/weather.service';
import { CalendarSymbolComponent } from './calendar-symbol.component';

type Coordinate = [number, number];
type Boundary = { points: Coordinate[]; south: number; north: number; west: number; east: number };
type GridPoint = { hourly: { time: number[]; temperature_2m: number[]; wind_speed_10m: number[]; wind_direction_10m: number[] } };
type Center = { lat: number; lon: number; span: number };
const width = 310, height = 286, gridSize = 3;
let boundaries: Promise<Boundary[]> | undefined;

function loadBoundaries(): Promise<Boundary[]> {
  return boundaries ??= fetch('/weather-map/WeatherMapBoundaries.geojson').then(async response => {
    if (!response.ok) throw new Error('Map unavailable');
    const data = await response.json() as { features: { geometry:
      {type: 'Polygon'; coordinates: Coordinate[][]} | {type: 'MultiPolygon'; coordinates: Coordinate[][][]} }[] };
    return data.features.flatMap(({geometry}) => {
      const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
      return polygons.flatMap(polygon => polygon.map(points => {
        const lat = points.map(p => p[1]), lon = points.map(p => p[0]);
        return {points, south: Math.min(...lat), north: Math.max(...lat), west: Math.min(...lon), east: Math.max(...lon)};
      }));
    });
  }).catch(error => { boundaries = undefined; throw error; });
}

function longitude(value: number) { return ((value + 540) % 360) - 180; }
function longitudeSpan(center: Center) { return center.span * width / height / Math.max(.2, Math.cos(center.lat * Math.PI / 180)); }

@Component({
  selector: 'cc-wind-map', standalone: true, imports: [CalendarSymbolComponent, CalendarNativeTextPipe, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar-wind-map.component.html', styleUrl: './calendar-wind-map.component.scss',
})
export class CalendarWindMapComponent implements OnDestroy {
  readonly place = input.required<Place>();
  readonly imperial = input(false);
  readonly expanded = signal(false);
  readonly layer = signal<'wind'|'temperature'>('wind');
  readonly hour = signal(4);
  readonly playing = signal(false);
  readonly loading = signal(false);
  readonly error = signal(false);
  readonly center = signal<Center>({lat: 0, lon: 0, span: 8});
  private readonly polygons = signal<Boundary[]>([]);
  private readonly field = signal<GridPoint[]>([]);
  private readonly retryCount = signal(0);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('mapDialog');
  private playback?: ReturnType<typeof setInterval>;
  private down?: Coordinate;

  constructor() {
    effect(() => {
      const place = this.place();
      this.center.set({lat: place.latitude, lon: place.longitude, span: 8});
      this.hour.set(4);
    });
    effect(onCleanup => {
      const at = this.center(), imperial = this.imperial();
      this.retryCount();
      const controller = new AbortController();
      this.loading.set(true);
      this.error.set(false);
      this.field.set([]);
      const timer = setTimeout(async () => {
        try {
          const lat: string[] = [], lon: string[] = [];
          for (let y = 0; y < gridSize; y++) for (let x = 0; x < gridSize; x++) {
            lat.push(Math.max(-89, Math.min(89, at.lat + (.5 - y / (gridSize - 1)) * at.span)).toFixed(3));
            lon.push(longitude(at.lon + (x / (gridSize - 1) - .5) * longitudeSpan(at)).toFixed(3));
          }
          const params = new URLSearchParams({latitude: lat.join(','), longitude: lon.join(','),
            hourly: 'wind_speed_10m,wind_direction_10m,temperature_2m', past_hours: '4', forecast_hours: '13',
            timeformat: 'unixtime', temperature_unit: imperial ? 'fahrenheit' : 'celsius', wind_speed_unit: imperial ? 'mph' : 'kmh'});
          const [rings, response] = await Promise.all([loadBoundaries(), fetch('https://api.open-meteo.com/v1/forecast?' + params, {signal: controller.signal})]);
          if (!response.ok) throw new Error('Forecast unavailable');
          const points: GridPoint[] = await response.json();
          if (points.length !== gridSize ** 2 || !points.every(p => p.hourly?.time?.length)) throw new Error('Empty field');
          if (!controller.signal.aborted) { this.polygons.set(rings); this.field.set(points); }
        } catch { if (!controller.signal.aborted) this.error.set(true); }
        finally { if (!controller.signal.aborted) this.loading.set(false); }
      }, 100);
      onCleanup(() => { clearTimeout(timer); controller.abort(); });
    });
  }

  readonly outlines = computed(() => {
    const c = this.center(), dx = longitudeSpan(c);
    const paths: string[] = [];
    for (const b of this.polygons()) {
      if (b.south > c.lat + c.span / 2 || b.north < c.lat - c.span / 2) continue;
      for (const shift of [-360, 0, 360]) {
        if (b.west + shift > c.lon + dx / 2 || b.east + shift < c.lon - dx / 2) continue;
        paths.push('M' + b.points.map(([lon, lat]) => ((lon + shift - c.lon) / dx * width + width / 2).toFixed(1)
          + ',' + ((c.lat - lat) / c.span * height + height / 2).toFixed(1)).join('L') + 'Z');
      }
    }
    return paths.join('');
  });
  readonly samples = computed(() => {
    const index = this.layer() === 'temperature' ? 4 : this.hour();
    const field = this.field();
    if (!field.length) return [];
    return Array.from({length: 14 * 12}, (_, i) => {
      const x = (i % 14 + .5) / 14, y = (Math.floor(i / 14) + .5) / 12;
      const gx = x * (gridSize - 1), gy = y * (gridSize - 1);
      const ix = Math.floor(gx), iy = Math.floor(gy);
      let east = 0, north = 0, temperature = 0;
      for (const row of [0, 1]) for (const col of [0, 1]) {
        const weight = (col ? gx - ix : 1 - gx + ix) * (row ? gy - iy : 1 - gy + iy);
        const h = field[(iy + row) * gridSize + ix + col].hourly;
        const direction = h.wind_direction_10m[index] * Math.PI / 180;
        east += weight * h.wind_speed_10m[index] * Math.sin(direction);
        north += weight * h.wind_speed_10m[index] * Math.cos(direction);
        temperature += weight * h.temperature_2m[index];
      }
      const speed = Math.hypot(east, north);
      const celsius = this.imperial() ? (temperature - 32) / 1.8 : temperature;
      const kmh = this.imperial() ? speed * 1.609 : speed;
      const hue = this.layer() === 'wind' ? Math.max(40, 202 - kmh * 2) : Math.max(0, Math.min(260, 170 - celsius * 5));
      return {x: x * width, y: y * height, direction: Math.atan2(east, north) * 180 / Math.PI,
        color: 'hsl(' + hue + ' 72% 36%)', speed};
    });
  });
  readonly marker = computed(() => {
    const c = this.center(), p = this.place();
    return {x: width * (.5 + longitude(p.longitude - c.lon) / longitudeSpan(c)), y: height * (.5 + (c.lat - p.latitude) / c.span)};
  });
  readonly dates = computed(() => this.field()[0]?.hourly.time ?? []);
  readonly timeLabel = computed(() => {
    const time = this.dates()[this.hour()];
    return time ? new Date(time * 1000).toLocaleString(undefined, {weekday:'short',hour:'numeric',minute:'2-digit',timeZone:this.place().timezone || undefined}) : '';
  });
  open() { this.expanded.set(true); this.dialog().nativeElement.showModal(); }
  close() { this.dialog().nativeElement.close(); }
  resetView() {
    this.stop(); this.expanded.set(false); this.layer.set('wind'); this.hour.set(4);
    this.recenter();
  }
  recenter() {
    const p = this.place(), c = this.center();
    if (c.lat !== p.latitude || c.lon !== p.longitude || c.span !== 8) this.center.set({lat:p.latitude, lon:p.longitude, span:8});
  }
  setLayer(layer: 'wind'|'temperature') { this.stop(); this.layer.set(layer); }
  zoom(factor: number) { this.center.update(c => ({...c, span: Math.max(.5, Math.min(40, c.span * factor))})); }
  panStart(event: PointerEvent) {
    if (event.button !== 0 || !event.isPrimary) return;
    (event.currentTarget as Element).setPointerCapture(event.pointerId);
    this.down = [event.clientX, event.clientY];
  }
  panEnd(event: PointerEvent) {
    if (!this.down) return;
    const dx = event.clientX - this.down[0], dy = event.clientY - this.down[1];
    this.down = undefined;
    if (Math.hypot(dx,dy) < 4) return;
    const bounds = (event.currentTarget as Element).getBoundingClientRect();
    const scale = Math.max(bounds.width / width, bounds.height / height);
    this.center.update(c => ({...c, lat: Math.max(-84, Math.min(84, c.lat + dy / (height * scale) * c.span)),
      lon: longitude(c.lon - dx / (width * scale) * longitudeSpan(c))}));
  }
  cancelPan() { this.down = undefined; }
  retry() { this.retryCount.update(n => n + 1); }
  togglePlay() {
    if (this.playing()) { this.stop(); return; }
    this.playing.set(true);
    this.playback = setInterval(() => this.hour.update(h => (h + 1) % Math.max(1, this.dates().length)), 650);
  }
  stop() { clearInterval(this.playback); this.playing.set(false); }
  ngOnDestroy() { this.stop(); }
}
