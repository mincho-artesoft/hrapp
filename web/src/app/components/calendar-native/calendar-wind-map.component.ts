import { calendarDateFormatter } from '../../core/calendar-format-preferences';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { CalendarLocalization, CalendarNativeTextPipe } from '../../core/calendar-localization';
import { CalendarPlatformApiService } from '../../core/calendar-platform-api.service';
import { CalendarForecastService } from '../../core/calendar-forecast.service';
import { Place, Snapshot } from '../../core/weather.service';
import {
  MapField,
  MapHour,
  MapLayer,
  MapViewport,
  clamp,
  forecastGrid,
  gridCoordinates,
  makeMapField,
  mapColor,
  mapFrame,
  mapReading,
  wrap,
} from '../../core/weather-map-field';
import { CalendarWeatherMapSurfaceComponent } from './calendar-weather-map-surface.component';
import { CalendarSymbolComponent } from './calendar-symbol.component';
import { A11yModule } from '@angular/cdk/a11y';

const hourMs = 3_600_000;
const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
type Panel = 'layers' | 'locations' | 'info';

@Component({
  selector: 'cc-wind-map',
  standalone: true,
  imports: [A11yModule, CalendarSymbolComponent, CalendarNativeTextPipe, CalendarWeatherMapSurfaceComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar-wind-map.component.html',
  styleUrl: './calendar-wind-map.component.scss',
})
export class CalendarWindMapComponent implements OnDestroy {
  readonly Math = Math;
  readonly layers = ['temperature', 'wind'] as const;
  readonly snapshot = input.required<Snapshot>();
  readonly saved = input<Place[]>([]);
  readonly imperial = computed(() => this.snapshot().windUnit === 'mph');
  readonly selection = signal<Place | null>(null);
  readonly place = computed(() => this.selection() ?? this.snapshot().place);
  readonly expanded = signal(false);
  readonly layer = signal<MapLayer>('wind');
  readonly panel = signal<Panel | null>(null);
  readonly markerExpanded = signal(true);
  readonly timelineVisible = signal(true);
  readonly position = signal(4);
  readonly playing = signal(false);
  readonly loading = signal(false);
  readonly error = signal(false);
  readonly field = signal<MapField | null>(null);
  readonly viewport = signal<MapViewport | undefined>(undefined);
  readonly surface = viewChild<CalendarWeatherMapSurfaceComponent>('surface');
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('mapDialog');
  private readonly local = inject(CalendarLocalization);
  private readonly api = inject(CalendarPlatformApiService);
  private readonly weather = inject(CalendarForecastService);
  private readonly retryCount = signal(0);
  private readonly conditions = signal<Record<number, Snapshot>>({});
  private readonly cache = new Map<string, { expires: number; data: Promise<MapHour[]> }>();
  private readonly locationCache = signal<Place | null>(null);
  private playback?: ReturnType<typeof setInterval>;
  private readonly grid = computed(
    () => {
      const full = this.expanded(),
        v = this.viewport();
      return v ? forecastGrid(v, full ? 7 : 3) : null;
    },
    {
      equal: (a, b) =>
        a?.side === b?.side &&
        a?.latitude === b?.latitude &&
        a?.longitude === b?.longitude &&
        a?.latRadius === b?.latRadius &&
        a?.lonRadius === b?.lonRadius,
    }
  );

  readonly dates = computed(() => this.field()?.dates ?? []);
  readonly places = computed(() => {
    const current = this.locationCache();
    const entries = [this.snapshot().place, ...(current ? [current] : []), ...this.saved()];
    return entries.filter(
      (p, i) =>
        entries.findIndex(
          (other) =>
            Math.abs(p.latitude - other.latitude) < 0.01 && Math.abs(wrap(p.longitude - other.longitude)) < 0.01
        ) === i
    );
  });
  readonly legendValues = computed(() => (this.layer() === 'wind' ? [120, 80, 40, 0] : [55, 30, 20, 10, 0, -20, -40]));
  readonly legendColors = computed(
    () =>
      'linear-gradient(to bottom,' +
      this.legendValues()
        .map((v) => 'rgb(' + mapColor(v, this.layer()).join(',') + ')')
        .join(',') +
      ')'
  );
  readonly unit = computed(() =>
    this.layer() === 'wind' ? (this.imperial() ? 'mph' : 'km/h') : this.imperial() ? '°F' : '°C'
  );
  readonly nowIndex = computed(() => {
    const dates = this.dates();
    return dates.length ? clamp((Date.now() - dates[0]) / hourMs, 0, dates.length - 1) : 0;
  });
  readonly nowHour = computed(() =>
    this.dates().findIndex((t) => Math.floor(t / hourMs) === Math.floor(Date.now() / hourMs))
  );
  readonly displayTime = computed(() => {
    const dates = this.dates();
    return dates.length ? dates[0] + this.position() * hourMs : Date.now();
  });
  readonly dateLabel = computed(() =>
    calendarDateFormatter(this.local.formattingLocale(), this.local.datePreference(), {weekday:'long', timeZone:this.place().timezone})(this.displayTime())
  );
  readonly ticks = computed(() =>
    this.dates()
      .map((time, i) => ({ i, time }))
      .filter((t) => t.i >= 2 && t.i % 2 === 0 && t.i < this.dates().length - 1)
  );
  readonly focusData = computed(() => {
    const p = this.place();
    return p.id === this.snapshot().place.id ? this.snapshot() : this.conditions()[p.id];
  });
  readonly marker = computed(() => {
    const data = this.focusData(),
      field = this.field(),
      p = this.place(),
      position = this.layer() === 'wind' ? this.position() : this.nowIndex();
    const grid = field ? mapReading(field.grid, mapFrame(field, position), p.latitude, p.longitude) : undefined;
    const at = this.displayTime(),
      hour = data?.forecastHours?.find(
        (h) => h.instant && Math.floor(Date.parse(h.instant) / hourMs) === Math.floor(at / hourMs)
      );
    const current = this.layer() === 'temperature' || !this.expanded() || Math.abs(at - Date.now()) < 30 * 60_000;
    const point = current ? data?.conditions : hour;
    const wind = point?.wind ?? (grid ? Math.hypot(grid.east, grid.north) * (this.imperial() ? 2.236936 : 3.6) : null);
    const bearing = point?.direction ?? (grid ? (Math.atan2(-grid.east, -grid.north) * 180) / Math.PI : null);
    const temp = point?.temperature ?? (grid ? this.temperature(grid.temperature) : null);
    const low = Number(data?.low),
      high = Number(data?.high);
    const inCelsius = (value: number) => (this.imperial() ? (value - 32) / 1.8 : value);
    const color = (value: number) => 'rgb(' + mapColor(inCelsius(value), 'temperature').join(',') + ')';
    const range =
      Number.isFinite(low) && Number.isFinite(high) && temp != null
        ? {
            low: this.number(low) + '°',
            high: this.number(high) + '°',
            lowColor: color(low),
            highColor: color(high),
            currentColor: color(temp),
            angle: 153 + 234 * (high > low ? clamp((temp - low) / (high - low), 0, 1) : 0.5),
          }
        : null;
    return { value: this.number(this.layer() === 'wind' ? wind : temp), direction: this.direction(bearing), range };
  });
  constructor() {
    effect(() => {
      const p = this.snapshot().place;
      if (p.id === 0) this.locationCache.set(p);
    });
    effect((cleanup) => {
      const grid = this.grid();
      this.retryCount();
      if (!grid) return;
      let active = true;
      this.loading.set(true);
      this.error.set(false);
      const timer = setTimeout(
        async () => {
          try {
            const coordinates = gridCoordinates(grid),
              points: MapHour[][] = new Array(coordinates.length);
            let i = 0;
            const worker = async () => {
              while (active && i < coordinates.length) {
                const n = i++,
                  p = coordinates[n];
                points[n] = await this.pointForecast(p.latitude, p.longitude);
              }
            };
            await Promise.all(Array.from({ length: 3 }, worker));
            if (!active) return;
            const field = makeMapField(grid, points),
              previous = this.field();
            const time = this.position();
            this.field.set(field);
            const start = previous?.dates[0];
            this.position.set(
              start ? clamp(time + (start - field.dates[0]) / hourMs, 0, field.dates.length - 1) : this.nowIndex()
            );
            this.loading.set(false);
          } catch {
            if (active) {
              active = false;
              this.error.set(true);
              this.loading.set(false);
            }
          }
        },
        untracked(() => this.expanded()) ? 550 : 0
      );
      cleanup(() => {
        active = false;
        clearTimeout(timer);
      });
    });
    effect((cleanup) => {
      const p = this.place(),
        locations = this.panel() === 'locations' ? this.places() : [p];
      const main = this.snapshot(),
        units = this.imperial() ? 'imperial' : 'metric',
        locale = this.local.locale();
      let active = true;
      void (async () => {
        for (const row of locations) {
          if (!active) break;
          if (row.id === main.place.id || untracked(() => this.conditions()[row.id]?.windUnit) === main.windUnit)
            continue;
          try {
            const s = await this.weather.load(row, units, locale);
            if (active) this.conditions.update((values) => ({ ...values, [row.id]: s }));
          } catch {
            /* A place with unavailable conditions can still be selected. */
          }
        }
      })();
      cleanup(() => {
        active = false;
      });
    });
  }
  private pointForecast(lat: number, lon: number) {
    const key = lat.toFixed(2) + ',' + lon.toFixed(2),
      now = Date.now(),
      cached = this.cache.get(key);
    if (cached && cached.expires > now) return cached.data;
    const params = new URLSearchParams({
      latitude: lat.toFixed(2),
      longitude: lon.toFixed(2),
      language: 'en',
      timezone: 'UTC',
      view: 'map',
    });
    const data = this.api.getCalendarForecast(params).then((r) => r.forecastHourly.hours);
    const entry = { expires: Math.min(now + 30 * 60_000, (Math.floor(now / hourMs) + 1) * hourMs), data };
    this.cache.set(key, entry);
    if (this.cache.size > 240) this.cache.delete(this.cache.keys().next().value!);
    void data.catch(() => {
      if (this.cache.get(key) === entry) this.cache.delete(key);
    });
    return data;
  }
  direction(degrees: number | null | undefined) {
    if (degrees == null) return '';
    const d = directions[Math.round((degrees + 360) / 22.5) % 16],
      k = 'cardinal.' + d,
      translated = this.local.text(k);
    return translated === k ? d : translated;
  }
  number(value: number | null | undefined) {
    return value == null
      ? '—'
      : new Intl.NumberFormat(this.local.formattingLocale(), { maximumFractionDigits: 0 }).format(value);
  }
  temperature(c: number) {
    return this.imperial() ? c * 1.8 + 32 : c;
  }
  legendValue(value: number) {
    return this.number(
      this.layer() === 'wind' ? (this.imperial() ? value / 1.609344 : value) : this.temperature(value)
    );
  }
  hourLabel(time: number) {
    return new Intl.DateTimeFormat(this.local.formattingLocale(), {
      hour: 'numeric', hourCycle: this.local.shortTime().resolvedOptions().hourCycle,
      timeZone: this.place().timezone,
    }).format(time);
  }
  conditionsFor(p: Place) {
    return p.id === this.snapshot().place.id ? this.snapshot() : this.conditions()[p.id];
  }
  open(event?: Event) {
    if (event?.composedPath().some((node) => node instanceof Element && node.matches('a,button,[role="link"]'))) return;
    this.panel.set(null);
    this.markerExpanded.set(true);
    this.timelineVisible.set(true);
    this.position.set(this.nowIndex());
    this.viewport.set(undefined);
    this.expanded.set(true);
    this.dialog().nativeElement.showModal();
    // Use an already granted browser location, as native does with its last known fix.
    if (!this.locationCache() && navigator.permissions && navigator.geolocation) {
      void navigator.permissions
        .query({ name: 'geolocation' })
        .then((permission) => {
          if (permission.state !== 'granted' || !this.expanded()) return;
          navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
              this.locationCache.set({
                id: 0,
                name: 'My Location',
                country: '',
                countryCode: '',
                latitude: coords.latitude,
                longitude: coords.longitude,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              });
            },
            () => {},
            { maximumAge: 600_000, timeout: 5000 }
          );
        })
        .catch(() => {});
    }
  }
  close() {
    this.dialog().nativeElement.close();
  }
  resetView() {
    this.stop();
    this.expanded.set(false);
    this.selection.set(null);
    this.layer.set('wind');
    this.viewport.set(undefined);
    this.panel.set(null);
    this.position.set(this.nowIndex());
  }
  togglePanel(panel: Panel) {
    this.stop();
    this.panel.update((value) => (value === panel ? null : panel));
  }
  selectPlace(p: Place) {
    this.selection.set(p);
    this.surface()?.recenter();
    this.panel.set(null);
    this.markerExpanded.set(true);
    this.timelineVisible.set(true);
  }
  recenter() {
    this.selectPlace(this.locationCache() ?? this.snapshot().place);
  }
  mapTap() {
    if (this.panel()) {
      this.panel.set(null);
      return;
    }
    if (this.markerExpanded()) this.markerExpanded.set(false);
    else this.timelineVisible.update((v) => !v);
  }
  setLayer(layer: MapLayer) {
    this.stop();
    this.layer.set(layer);
    this.panel.set(null);
    this.position.set(this.nowIndex());
    this.markerExpanded.set(true);
  }
  setPosition(n: number) {
    this.stop();
    this.position.set(n);
  }
  retry() {
    this.retryCount.update((n) => n + 1);
  }
  togglePlay() {
    if (this.playing()) {
      this.stop();
      return;
    }
    const last = this.dates().length - 1;
    if (last < 1) return;
    const start = this.position(),
      since = performance.now();
    this.playing.set(true);
    this.playback = setInterval(
      () => this.position.set((start + ((performance.now() - since) * last) / 8000) % last),
      100
    );
  }
  stop() {
    clearInterval(this.playback);
    this.playing.set(false);
  }
  cancel(e: Event) {
    if (this.panel()) {
      e.preventDefault();
      this.panel.set(null);
    }
  }
  ngOnDestroy() {
    this.stop();
  }
}
