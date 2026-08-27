import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ChangeDetectorRef,
  computed,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
  signal,
} from '@angular/core';

import { DeviceFrameComponent } from '../device-frame/device-frame.component';
import { RevealDirective, RevealStaggerDirective } from '../../core/reveal.directive';
import { TiltDirective } from '../../core/tilt.directive';
import { isBrowser } from '../../core/motion';
import { ActiveLocaleService } from '../../core/active-locale.service';
import {
  DaySample,
  DEFAULT_PLACE,
  Place,
  Snapshot,
  WeatherService,
} from '../../core/weather.service';

export type WeatherView = 'hourly' | 'daily' | 'weekend';

/** Where the last searched city is remembered between visits. */
const STORED_PLACE = 'cc.weather.place';

interface Metric {
  id: string;
  label: string;
  value: string;
  unit: string;
  caption: string;
  accent: string;
  /** Normalised 0..1 samples, rendered as a sparkline. */
  series: number[];
  kind: 'line' | 'bars';
}

/** Turn 0..1 samples into a smooth SVG path across a 100×34 box. */
function toPath(series: number[], smooth = true): string {
  const w = 100;
  const h = 34;
  const pts = series.map((v, i) => ({
    x: (i / (series.length - 1)) * w,
    y: h - v * (h - 4) - 2,
  }));

  if (!smooth) {
    return pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ');
  }

  // Catmull-Rom → cubic bezier, which keeps the curve through every sample.
  let d = `M${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

/**
 * The weather hub section.
 *
 * These are **live readings** from Open-Meteo — see `core/weather.service.ts`,
 * including the note about that API's non-commercial licence. Any city can be
 * searched; the choice is remembered.
 *
 * The arrays below are no longer the content, they are the fallback. If the
 * request fails — offline, rate-limited, blocked by a network — the section
 * renders these instead and says so rather than showing an empty shell, and
 * they are also what is on screen for the moment before the first response
 * lands. They stay hand-written for that reason, and their captions stay
 * generic prose; every live caption is generated from the numbers it sits
 * under, because a fixed line like "the wind is doing it" becomes a lie the
 * moment the data behind it is real.
 *
 * Nothing is requested until the section scrolls into view, so a visitor who
 * bounces at the hero never makes the call.
 *
 * The sparklines are SVG paths generated from whichever series is in play:
 * each draws itself on as it scrolls into view, then a highlight travels along
 * the curve continuously.
 */
@Component({
  selector: 'app-weather-hub',
  standalone: true,
  imports: [DeviceFrameComponent, RevealDirective, RevealStaggerDirective, TiltDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './weather-hub.component.html',
  styleUrl: './weather-hub.component.scss',
})
export class WeatherHubComponent implements AfterViewInit, OnDestroy {
  private readonly localeCopy = inject(ActiveLocaleService);
  readonly copy = computed(() => this.localeCopy.copy().weather);
  readonly liveFrom = computed(() =>
    this.copy().liveFrom.replace('{t}', this.snapshot()?.observedAt ?? ''),
  );

  @ViewChild('root', { static: true }) private rootRef!: ElementRef<HTMLElement>;

  private readonly weather = inject(WeatherService);
  private readonly cdr = inject(ChangeDetectorRef);
  /** Captured here because a field initialiser is an injection context;
   *  method bodies are not. */
  private readonly browser = isBrowser();
  private observer?: IntersectionObserver;
  private searchTimer?: ReturnType<typeof setTimeout>;

  readonly place = signal<Place>(DEFAULT_PLACE);
  readonly snapshot = signal<Snapshot | null>(null);
  readonly loading = signal(false);
  /** Set when the network let us down and the fallback is on screen. */
  readonly offline = signal(false);

  readonly query = signal('');
  readonly results = signal<Place[]>([]);
  readonly searching = signal(false);
  readonly open = signal(false);

  readonly view = signal<WeatherView>('hourly');
  readonly views: { id: WeatherView; label: string }[] = [
    { id: 'hourly', label: 'Hourly' },
    { id: 'daily', label: '14 days' },
    { id: 'weekend', label: 'Weekend' },
  ];

  private readonly fallback: Metric[] = [
    {
      id: 'temp',
      label: 'Feels like',
      value: '66',
      unit: '°',
      caption: this.copy().readings.feelsLike,
      accent: '#ff9f45',
      series: [0.32, 0.28, 0.3, 0.44, 0.62, 0.78, 0.9, 0.84, 0.7, 0.52, 0.4, 0.34],
      kind: 'line',
    },
    {
      id: 'precip',
      label: 'Precipitation',
      value: '38',
      unit: '%',
      caption: this.copy().readings.precipitation,
      accent: '#4fa8ff',
      series: [0.05, 0.05, 0.1, 0.08, 0.15, 0.42, 0.78, 0.92, 0.6, 0.25, 0.1, 0.05],
      kind: 'bars',
    },
    {
      id: 'uv',
      label: 'UV index',
      value: '6',
      unit: '',
      caption: this.copy().readings.uv,
      accent: '#ffd166',
      series: [0, 0.04, 0.18, 0.42, 0.7, 0.92, 1, 0.86, 0.6, 0.32, 0.1, 0],
      kind: 'line',
    },
    {
      id: 'wind',
      label: 'Wind',
      value: '9',
      unit: 'mph',
      caption: this.copy().readings.wind,
      accent: '#5ce1e6',
      series: [0.3, 0.34, 0.3, 0.38, 0.46, 0.5, 0.62, 0.82, 0.74, 0.58, 0.44, 0.36],
      kind: 'line',
    },
    {
      id: 'humidity',
      label: 'Humidity',
      value: '64',
      unit: '%',
      caption: this.copy().readings.humidity,
      accent: '#8ab4ff',
      series: [0.78, 0.8, 0.76, 0.68, 0.58, 0.5, 0.46, 0.5, 0.6, 0.7, 0.76, 0.8],
      kind: 'line',
    },
    {
      id: 'pressure',
      label: 'Pressure',
      value: '1014',
      unit: 'hPa',
      caption: this.copy().readings.pressure,
      accent: '#c39cff',
      series: [0.34, 0.36, 0.4, 0.44, 0.5, 0.56, 0.6, 0.66, 0.72, 0.78, 0.82, 0.86],
      kind: 'line',
    },
  ];

  /**
   * The tiles as rendered: the fallback's label, accent and chart kind — which
   * are design, not data — merged with whichever numbers are current.
   */
  get metrics(): Metric[] {
    const live = this.snapshot()?.metrics;
    if (!live) return this.fallback;
    return this.fallback.map((f) => {
      const m = live.find((l) => l.id === f.id);
      return m ? { ...f, value: m.value, unit: m.unit, caption: m.caption, series: m.series } : f;
    });
  }

  get hourly(): { h: string; t: string; icon: string }[] {
    const live = this.snapshot()?.hourly;
    return live ? live.map((s) => ({ h: s.label, t: s.temp, icon: s.icon })) : this.fallbackHourly;
  }

  get daily(): DaySample[] {
    return this.snapshot()?.daily ?? this.fallbackDaily;
  }

  /**
   * The next Saturday and Sunday.
   *
   * Searched for rather than assumed at a fixed offset, because "the weekend"
   * moves through the fortnight as the week does — and on a Saturday it means
   * today and tomorrow, not seven days away.
   */
  get weekend(): DaySample[] {
    const all = this.daily;
    const sat = all.findIndex((d) => d.weekend);
    if (sat < 0) return all.slice(0, 2);
    return all.slice(sat, sat + 2).filter((d) => d.weekend);
  }

  get placeLine(): string {
    const p = this.snapshot()?.place ?? this.place();
    return p.admin1 && p.admin1 !== p.name ? `${p.name}, ${p.admin1}` : p.name;
  }

  get conditionLine(): string {
    const s = this.snapshot();
    if (!s) return 'Partly cloudy · H 71° L 55°';
    return `${s.condition} · H ${s.high}° L ${s.low}°`;
  }

  get nowTemp(): string {
    return this.snapshot()?.temp ?? '68';
  }

  // ------------------------------------------------------------- lifecycle

  ngAfterViewInit(): void {
    if (!this.browser) return;

    const stored = this.restore();
    if (stored) this.place.set(stored);

    // Nothing is fetched until the section is actually approaching the
    // viewport: a visitor who reads the hero and leaves should not cost
    // anybody an API call.
    this.observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        this.observer?.disconnect();
        this.observer = undefined;
        void this.fetch(this.place());
      },
      { rootMargin: '400px 0px' },
    );
    this.observer.observe(this.rootRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    clearTimeout(this.searchTimer);
  }

  // ---------------------------------------------------------------- search

  onQuery(value: string): void {
    this.query.set(value);
    clearTimeout(this.searchTimer);

    if (value.trim().length < 2) {
      this.results.set([]);
      this.open.set(false);
      return;
    }

    // A keystroke is not a search. Wait for a pause, so typing "Amsterdam"
    // costs one request rather than nine.
    this.searching.set(true);
    this.searchTimer = setTimeout(() => void this.runSearch(value), 260);
  }

  choose(p: Place): void {
    this.place.set(p);
    this.query.set('');
    this.results.set([]);
    this.open.set(false);
    this.remember(p);
    void this.fetch(p);
  }

  closeResults(): void {
    this.open.set(false);
  }

  private async runSearch(value: string): Promise<void> {
    try {
      const found = await this.weather.search(value);
      this.apply(() => {
        this.results.set(found);
        this.open.set(true);
      });
    } catch (err) {
      // An abort is the expected outcome of typing, not a failure.
      if ((err as Error)?.name !== 'AbortError') this.apply(() => this.results.set([]));
    } finally {
      this.apply(() => this.searching.set(false));
    }
  }

  private async fetch(p: Place): Promise<void> {
    this.apply(() => this.loading.set(true));
    try {
      const snap = await this.weather.load(p);
      this.apply(() => {
        this.snapshot.set(snap);
        this.offline.set(false);
      });
    } catch {
      this.apply(() => {
        this.snapshot.set(null);
        this.offline.set(true);
      });
    } finally {
      this.apply(() => this.loading.set(false));
    }
  }

  /**
   * Apply state and make sure the view actually redraws.
   *
   * This component's async work reaches Angular through neither of the paths
   * zone.js can see. `IntersectionObserver` is not patched, so the callback
   * that starts the fetch is already outside the zone; and the app compiles to
   * ES2022, so `async`/`await` is native, and native promise jobs do not run
   * through zone.js's patched `Promise` either. The result is that every
   * signal here updates correctly and nothing re-renders — the panel sits on
   * its fallback looking exactly as though the request had failed, until some
   * unrelated click ticks and the real data appears at once.
   *
   * `NgZone.run` is not enough on its own (re-entering a zone we are arguably
   * already in schedules nothing), so this asks for the render directly.
   * `detectChanges` rather than `markForCheck`: the latter only sets a flag
   * and still waits for a tick that is not coming.
   */
  private apply(fn: () => void): void {
    fn();
    this.cdr.detectChanges();
  }

  // ------------------------------------------------------------ persistence

  private restore(): Place | null {
    try {
      const raw = localStorage.getItem(STORED_PLACE);
      if (!raw) return null;
      const p = JSON.parse(raw) as Place;
      return Number.isFinite(p?.latitude) && Number.isFinite(p?.longitude) ? p : null;
    } catch {
      // Private mode, disabled storage, corrupt value — none of it is worth
      // failing the section over.
      return null;
    }
  }

  private remember(p: Place): void {
    try {
      localStorage.setItem(STORED_PLACE, JSON.stringify(p));
    } catch {
      /* not important enough to handle */
    }
  }

  // ------------------------------------------------------------- geometry

  areaPath(m: Metric): string {
    return `${toPath(m.series)} L100 34 L0 34 Z`;
  }

  linePath(m: Metric): string {
    return toPath(m.series);
  }

  /** Bar geometry for the histogram-style tiles. */
  bars(m: Metric): { x: number; y: number; w: number; h: number }[] {
    const gap = 1.4;
    const w = (100 - gap * (m.series.length - 1)) / m.series.length;
    return m.series.map((v, i) => {
      const h = Math.max(1.5, v * 30);
      return { x: i * (w + gap), y: 32 - h, w, h };
    });
  }

  /**
   * A fortnight of sample days, so the 14-day and weekend views have
   * something to draw before the first response and if the request fails.
   * Generated rather than typed out, since fourteen hand-written rows would
   * be fourteen more things to keep plausible.
   */
  private readonly fallbackDaily: DaySample[] = Array.from({ length: 14 }, (_, i) => {
    const day = new Date(Date.UTC(2026, 6, 28 + i));
    const dow = day.getUTCDay();
    const max = 68 + ((i * 5) % 9);
    const min = 54 + ((i * 3) % 6);
    return {
      iso: day.toISOString().slice(0, 10),
      day: i === 0 ? 'Today' : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dow],
      date: `${day.getUTCDate()} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][day.getUTCMonth()]}`,
      icon: (i % 4 === 3 ? 'rain' : i % 3 === 1 ? 'cloud' : 'sun') as DaySample['icon'],
      condition: i % 4 === 3 ? 'Rain' : i % 3 === 1 ? 'Partly cloudy' : 'Clear',
      max: String(max),
      min: String(min),
      precip: i % 4 === 3 ? 55 : 8,
      windMax: '12 mph',
      uvMax: '6',
      weekend: dow === 0 || dow === 6,
      barStart: (min - 54) / 23,
      barWidth: (max - min) / 23,
    };
  });

  /** Shown until the first response lands, and if the request fails. */
  private readonly fallbackHourly = [
    { h: 'Now', t: '68°', icon: 'sun' },
    { h: '4 PM', t: '68°', icon: 'sun' },
    { h: '5 PM', t: '67°', icon: 'cloud' },
    { h: '6 PM', t: '65°', icon: 'cloud' },
    { h: '7 PM', t: '63°', icon: 'rain' },
    { h: '8 PM', t: '61°', icon: 'rain' },
    { h: '9 PM', t: '59°', icon: 'cloud' },
    { h: '10 PM', t: '57°', icon: 'moon' },
  ];
}
