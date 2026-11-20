import { calendarHourCycle } from '../../core/calendar-format-preferences';
import { A11yModule } from '@angular/cdk/a11y';
import { CalendarWeekStripComponent } from './calendar-week-strip.component';
import { CalendarWeatherDetailComponent } from './calendar-weather-detail.component';
import { weatherDetailChoices, WeatherMetric } from '../../core/weather-detail-chart';
import { CalendarAnchoredMenuDirective } from './calendar-anchored-menu.directive';
import {CalendarSearchFieldComponent} from './calendar-search-field.component';
import { CalendarForecastService } from '../../core/calendar-forecast.service';
import { CalendarLocalization, CalendarNativeDatePipe, CalendarNativeTextPipe } from "../../core/calendar-localization";
import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  output,
  signal,
  OnInit,
  DestroyRef,
  HostListener,
  computed,
  PLATFORM_ID,
} from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  WeatherService,
  Place,
  Snapshot,
  MetricSample,
  DaySample,
  ForecastHour,
} from "../../core/weather.service";
import {
  CalendarChoiceComponent,
  CalendarChoice,
} from "./calendar-choice.component";
import { CalendarSymbolComponent } from "./calendar-symbol.component";

import { moonPhaseInfo } from '../../core/weather-moon';
import { CalendarMoonDetailComponent } from './calendar-moon-detail.component';
import { CalendarWindMapComponent } from './calendar-wind-map.component';

@Component({
  selector: "cc-weather",
  standalone: true,
  imports: [A11yModule, CalendarWeekStripComponent, CalendarWeatherDetailComponent, CalendarAnchoredMenuDirective,
    CalendarSearchFieldComponent,
    CalendarNativeTextPipe,
    CalendarNativeDatePipe,
    CommonModule,
    FormsModule,
    CalendarSymbolComponent,
    CalendarChoiceComponent,
    CalendarWindMapComponent, CalendarMoonDetailComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./calendar-weather.component.html",
  styleUrl: "./calendar-weather.component.scss",
})
export class CalendarWeatherComponent implements OnInit {
  readonly Math = Math;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly calendarForecast = inject(CalendarForecastService);
  readonly service = inject(WeatherService);
  readonly modes = input<CalendarChoice[]>([]);
  private readonly localization = inject(CalendarLocalization);
  readonly clockPreference = input<string>();
  readonly currentMode = input("weather");
  readonly firstWeekday = input(0);
  readonly isDesktop = input(true);
  readonly viewChange = output<string>();
  readonly openMenu = output<void>();
  readonly createEvent = output<{date:string;instant?:string;timeZone:string}>();

  readonly weather = signal<Snapshot | null>(null);
  readonly saved = signal<Place[]>([]);
  readonly snapshots = signal<Record<number, Snapshot>>({});
  readonly regions = signal(false);
  readonly searchOpen = signal(false);
  readonly modePicker = signal(false);
  readonly results = signal<Place[]>([]);
  readonly query = signal("");
  readonly loading = signal(false);
  readonly error = signal("");
  readonly metric = signal<MetricSample | null>(null);
  readonly day = signal<DaySample | null>(null);
  readonly regionContext = signal<{
    place: Place;
    x: number;
    y: number;
  } | null>(null);
  private regionPress?: {id: number; x: number; y: number; timer: ReturnType<typeof setTimeout>};
  private heldRegion: number | null = null;
  private draggingRegion: number | null = null;
  private generation = 0;
  private searchGeneration = 0;

  readonly detailOpen = signal(false);
  readonly detailMetric = signal<WeatherMetric>('temp');
  readonly detailDate = signal('');
  readonly skyDetail = signal<'solar' | 'moon' | null>(null);
  readonly metricChoices = [...weatherDetailChoices];
  changeMetric(value: string) {
    const choice = this.metricChoices.find(option => option.value === value);
    if (choice) this.detailMetric.set(choice.value);
  }
  readonly activeMetric = computed(() =>
    this.metricChoices.find(choice => choice.value === this.detailMetric()) ?? this.metricChoices[0]);
  // The forecast ISO strings are civil dates in the forecast location. Pass the
  // same civil dates to the calendar strip, which uses the browser's calendar.
  readonly forecastDays = computed(() =>
    (this.weather()?.daily.slice(0, 10) ?? []).map(day => new Date(day.iso + 'T00:00:00'))
  );
  readonly selectedForecastDay = computed(() => new Date(this.detailDate() + 'T00:00:00'));
  selectForecastDay(date: Date) {
    const index = this.forecastDays().findIndex(day => day.getTime() === date.getTime());
    const forecast = this.weather()?.daily[index];
    if (forecast) this.detailDate.set(forecast.iso);
  }
  readonly currentHour = computed(() => this.forecastHours()[0]);
  readonly compassTicks = Array.from({length: 60}, (_, i) => i);
  private readonly destroyRef = inject(DestroyRef);
  readonly solarMinute = signal(new Date());

  readonly solarPoint = computed(() => {
    const s = this.weather(), today = s?.skyDays?.[0];
    if (!s || !today || (!today.sunrise && !today.sunset)) return null;
    const time = Date.parse(this.localNow(s.place.timezone, this.solarMinute()) + 'Z');
    const rise = Date.parse((today.sunrise ?? '') + 'Z');
    const set = Date.parse((today.sunset ?? '') + 'Z');
    const fraction = set > rise ? Math.min(1, Math.max(0, (time - rise) / (set - rise))) : Number(time >= set);
    const angle = Math.PI * fraction;
    return {x: 60 - 60 * Math.cos(angle), y: 60 - 60 * Math.sin(angle)};
  });

  readonly nextMoon = computed(() => {
    const days = this.weather()?.skyDays;
    const today = days?.[0];
    if (!days || today?.moonPhase == null) return null;
    const phase = this.moonPhase(today.moonPhase);
    const next = days.find(d => d.date > today.date && d.moonPhase != null && this.moonPhase(d.moonPhase) !== phase);
    if (!next) return null;
    return {phase: this.moonPhase(next.moonPhase), days: (Date.parse(next.date) - Date.parse(today.date)) / 86400000};
  });

  formatWeatherText(format: string, ...values: (number | string)[]) {
    let index = 0;
    return this.localization.text(format).replace(/%(?:(\d+)\$)?(?:@|d|\.0f)/g, (_, position) => {
      const value = values[position ? Number(position) - 1 : index++];
      return typeof value === 'number' ? this.cardNumber(value, 0) : value;
    });
  }

  cardNumber(value: number | null | undefined, digits = 0) {
    if (value == null || !Number.isFinite(value)) return '—';
    return new Intl.NumberFormat(this.localization.formattingLocale(), {
      minimumFractionDigits: digits, maximumFractionDigits: digits, useGrouping: false,
    }).format(value);
  }

  feelsCaption(actual: number | null, feels: number | null) {
    if (actual == null || feels == null) return '';
    if (Math.abs(feels - actual) < 1.5) return 'Similar to the actual temperature.';
    return feels < actual ? 'Wind is making it feel cooler.' : 'Humidity is making it feel warmer.';
  }

  visibilityCaption(value: number | null) {
    if (value === null) return '—';
    if (value > 20) return 'Perfectly clear view.';
    if (value > 15) return 'Excellent visibility.';
    if (value > 10) return 'Good visibility.';
    if (value > 5) return 'Moderate visibility.';
    return value > 1 ? 'Poor visibility.' : 'Very poor visibility.';
  }

  readonly nextRain = computed(() => {
    const s = this.weather();
    if (!s) return '';
    const day = s.daily.slice(1).find(d => d.precip >= 10 && (d.precipitationAmount ?? 0) > 0);
    if (!day) return this.localization.text('No precipitation expected soon.');
    const days = (Date.parse(day.iso) - Date.parse(s.daily[0].iso)) / 86400000;
    const weekday = new Intl.DateTimeFormat(this.localization.locale(), {weekday:'short', timeZone:'UTC'}).format(new Date(day.iso));
    const when = days === 1 ? this.localization.text('tomorrow') : days <= 7
      ? this.formatWeatherText('on %@', weekday) : this.formatWeatherText('in %d days', days);
    const imperial = s.windUnit === 'mph';
    return this.formatWeatherText('Next expected is %1$.0f %2$@ %3$@.', this.cardNumber(day.precipitationAmount, imperial ? 1 : 0),
      this.localization.text(imperial ? '″' : 'mm'), when);
  });

  pressureValue(hPa: number) {
    return this.weather()?.windUnit === 'mph' ? hPa * 0.02953 : hPa;
  }
  windDirection(degrees: number): string {
    return ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'][Math.round(degrees / 22.5) % 16];
  }
  uvCategory(uv: number) {
    return uv < 3 ? 'Low' : uv < 6 ? 'Moderate' : uv < 8 ? 'High' : uv < 11 ? 'Very High' : 'Extreme';
  }

  localNow(zone: string, date = new Date()) {
    try {
      return new Intl.DateTimeFormat("sv-SE", {
        timeZone: zone || "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      })
        .format(date)
        .replace(" ", "T");
    } catch {
      return new Date().toISOString().slice(0, 16);
    }
  }

  readonly forecastHours = computed(() => {
    const snapshot = this.weather();
    if (!snapshot) return [];
    const start = this.localNow(snapshot.place.timezone).slice(0, 13);
    return (snapshot.forecastHours ?? []).filter(h => h.iso >= start).slice(0, 24);
  });

  readonly hasHourlyPrecipitation = computed(() => this.forecastHours().some(h => h.precipitationChance >= 10));
  readonly hourlyStrip = computed(() => {
    const hours = this.forecastHours();
    const entries: {iso: string; hour?: ForecastHour; solar?: 'Sunrise' | 'Sunset'; now?: boolean}[] =
      hours.map((hour, index) => ({iso: hour.iso, hour, now: index === 0}));
    if (!hours.length) return entries;
    const now = this.localNow(this.weather()!.place.timezone);
    for (const day of this.weather()?.skyDays ?? []) {
      for (const solar of ['Sunrise', 'Sunset'] as const) {
        const iso = solar === 'Sunrise' ? day.sunrise : day.sunset;
        if (iso && iso >= now && iso <= hours[hours.length - 1].iso) entries.push({iso, solar});
      }
    }
    return entries.sort((a, b) => a.iso.localeCompare(b.iso));
  });

  temperatureBand(day: DaySample, imperial: boolean) {
    const mid = (Number(day.min) + Number(day.max)) / 2;
    const celsius = imperial ? (mid - 32) * 5 / 9 : mid;
    return celsius < 0 ? 'freezing' : celsius < 12 ? 'cold' : celsius < 22 ? 'mild' : celsius < 30 ? 'warm' : 'hot';
  }

  todayDotPct(day: DaySample, s: Snapshot): number | null {
    if (day.day !== "Today") return null;
    const cur = Number(s.temp);
    const min = Number(day.min);
    const max = Number(day.max);
    if (!Number.isFinite(cur) || !Number.isFinite(min) || !Number.isFinite(max))
      return null;
    const ratio = max === min ? 0.5 : Math.min(1, Math.max(0, (cur - min) / (max - min)));
    return (day.barStart + day.barWidth * ratio) * 100;
  }

  openDetail(id: WeatherMetric = 'temp', date?: string) {
    this.detailMetric.set(id);
    this.detailDate.set(date ?? this.weather()?.daily[0]?.iso ?? "");
    this.detailOpen.set(true);
  }
  skyDay() {
    return (
      this.weather()?.skyDays?.find((d) => d.date === this.detailDate()) ??
      this.weather()?.skyDays?.[0]
    );
  }
  private readonly weatherClocks = computed(() => {
    const preference = this.clockPreference();
    const options: Intl.DateTimeFormatOptions = {timeZone: 'UTC', hour: 'numeric',
      hourCycle: calendarHourCycle(preference)};
    const locale = this.localization.formattingLocale();
    return {hours: new Intl.DateTimeFormat(locale, options),
      minutes: new Intl.DateTimeFormat(locale, {...options, minute: '2-digit'})};
  });

  readonly clock = (value: string | null | undefined, hoursOnly = false) => {
    if (!value) return '—';
    // The service returns local clock values for the forecast city.
    const time = Date.parse(value + 'Z');
    if (!Number.isFinite(time)) return '—';
    const clocks = this.weatherClocks();
    return (hoursOnly ? clocks.hours : clocks.minutes).format(time);
  };
  moonPhase(value: number | null | undefined) { return moonPhaseInfo(value)?.name ?? '—'; }
  moonArtwork(value: number | null | undefined) { return moonPhaseInfo(value)?.artwork ?? ''; }
  moonSymbol(value: number | null | undefined) { return moonPhaseInfo(value)?.symbol ?? 'moon'; }
  ngOnInit() {
    this.destroyRef.onDestroy(() => this.endRegionPress());
    if (!this.isBrowser || typeof localStorage === "undefined") return;
    const timer = setInterval(() => this.solarMinute.set(new Date()), 60000);
    this.destroyRef.onDestroy(() => clearInterval(timer));
    try {
      const places = JSON.parse(
        localStorage.getItem("cc.mac.regions") || "[]",
      ) as Place[];
      this.saved.set(places.filter(p => p.id !== 0));
      const restored = this.calendarForecast.selectedPlace() ?? this.calendarForecast.restoredPlace(places);
      if (restored) {
        void this.select(restored);
      } else if (navigator.permissions) {
        void navigator.permissions.query({name: 'geolocation'}).then(permission => {
          if (permission.state === 'granted' && !this.weather() && !this.searchOpen() && !this.regions()) this.currentLocation();
        }).catch(() => {});
      }
    } catch { this.saved.set([]); }
  }
  readonly scene = computed(() => {
    const code = this.weather()?.currentWeatherCode;
    if (code == null) return this.currentHour()?.icon ?? 'cloud';
    if (code <= 2) return 'sun';
    if (code === 3) return 'cloud';
    if (code <= 48) return 'fog';
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
    if (code >= 95 || code === 65 || code === 82) return 'storm';
    return 'rain';
  });
  readonly isNight = computed(() => !(this.weather()?.isDaylight ?? !this.currentHour()?.symbol?.includes('moon')));

  readonly skyBodies = computed(() => {
    const snapshot = this.weather();
    const days = snapshot?.skyDays;
    if (!snapshot || !days?.length) return [];
    const now = Date.parse(this.localNow(snapshot.place.timezone) + 'Z');
    const today = days[0], cover = snapshot.cloudCover ?? 0;
    const bodies = [];
    for (const lunar of [false, true]) {
      const rise = lunar ? today.moonrise : today.sunrise;
      const set = lunar ? today.moonset : today.sunset;
      if (!rise || !set) continue;
      let start = Date.parse(rise + 'Z'), end = Date.parse(set + 'Z');
      if (end <= start) {
        if (now < end) start -= 86400000;
        else end = lunar && days[1]?.moonset ? Date.parse(days[1].moonset + 'Z') : end + 86400000;
      }
      if (now < start || now >= end) continue;
      const progress = (now - start) / (end - start);
      const src = lunar ? this.moonArtwork(today.moonPhase) : '/icons/calendar-native/artwork/weather_sun_realistic.png';
      if (src) bodies.push({src, lunar, x: 14 + progress * 72, y: 34 - 25 * Math.sin(Math.PI * progress),
        opacity: lunar ? (this.isNight() ? 1 : .48) * Math.max(.02, 1 - cover * 1.08) : Math.max(.015, 1 - cover * 1.12)});
    }
    return bodies;
  });

  readonly clouds = computed(() => {
    const snapshot = this.weather();
    if (!snapshot) return [];
    const sky = this.scene();
    const cover = snapshot.cloudCover ?? (sky === 'sun' ? .12 : .72);
    if (cover < .18) return [];
    const wind = this.currentHour();
    const dx = Math.sin(((wind?.direction ?? 270) + 180) * Math.PI / 180);
    const kph = (wind?.wind ?? 0) * (snapshot.windUnit === 'mph' ? 1.609 : 1);
    const hash = (index: number, salt: number) => {
      const n = Math.sin(index * 1103515245 + salt * 12345) * 43758.5453123;
      return n - Math.floor(n);
    };
    return Array.from({length: cover >= .75 ? 8 : cover > .45 ? 5 : 4}, (_, i) => {
      const depth = hash(i, 22), shape = hash(i, 25);
      const width = (188 + hash(i, 26) * 58) * (.52 + depth * .38 + shape * .1);
      const speed = Math.max(.5, Math.abs(dx) * (1.2 + Math.min(kph, 150) * .22) * (.32 + depth ** 1.45 * 1.55));
      const storm = hash(i, 23) < (sky === 'storm' ? 1 : sky === 'rain' ? .82 : sky === 'cloud' ? .46 : sky === 'snow' ? .18 : 0);
      return {width, top: 8.5 + depth * 24.5 + (hash(i, 27) - .5) * 10.5, storm,
        opacity: (.32 + depth * .34 + shape * .05) * (this.isNight() ? .76 : 1),
        blur: Math.max(.35, 2.8 - depth * 2.35), frame: (i % 4) * 100/3 + '% ' + Math.floor(i / 4) * 100 + '%',
        // Normalized to a 1000-point viewport, just as the native drift scales with travel distance.
        duration: (1000 + width) / speed, phase: hash(i, 20), reverse: dx < 0};
    });
  });

  beginSearch() {
    this.modePicker.set(false);
    this.searchOpen.set(true);
  }
  closeSearch() {
    this.searchGeneration++;
    this.searchOpen.set(false);
    this.query.set("");
    this.results.set([]);
  }
  async search(value: string) {
    this.query.set(value);
    const generation = ++this.searchGeneration;
    if (!value.trim()) {
      this.results.set([]);
      return;
    }
    try {
      const places = await this.service.search(value);
      if (generation === this.searchGeneration) this.results.set(places);
    } catch (e) {
      if (generation === this.searchGeneration)
        this.error.set(e instanceof Error ? e.message : "Search unavailable.");
    }
  }
  private async forecast(place: Place) {
    let units: string | undefined;
    try { units = JSON.parse(localStorage.getItem('cc.mac.preferences') || '{}').units; } catch {}
    return this.calendarForecast.load(place, units, this.localization.locale());
  }

  async select(place: Place, selection: 'saved' | 'preview' | 'add' = 'saved') {
    const generation = ++this.generation;
    this.loading.set(true);
    this.error.set("");
    try {
      const snapshot = await this.forecast(place);
      if (generation !== this.generation) return;
      this.weather.set(snapshot);
      this.calendarForecast.selectedPlace.set(snapshot.place);
      if (selection !== 'preview' && this.isBrowser && typeof localStorage !== "undefined") {
        localStorage.setItem("cc.mac.selectedRegion", String(place.id));
      }
      this.snapshots.update((p) => ({ ...p, [place.id]: snapshot }));
      if (selection === 'add' && !this.saved().some((p) => p.id === place.id)) {
        this.saved.update((p) => [...p, place]);
        this.persist();
      }
      this.regions.set(selection === 'add');
      this.closeSearch();
    } catch (e) {
      if (generation === this.generation)
        this.error.set(
          e instanceof Error ? e.message : "Forecast unavailable.",
        );
    } finally {
      if (generation === this.generation) this.loading.set(false);
    }
  }
  beginRegionPress(place: Place, input: PointerEvent) {
    this.endRegionPress();
    this.heldRegion = null;
    if (!input.isPrimary || input.button !== 0 || input.pointerType !== 'touch') return;
    const x = input.clientX, y = input.clientY;
    this.regionPress = {id: input.pointerId, x, y, timer: setTimeout(() => {
      this.heldRegion = place.id;
      this.regionContext.set({place, x, y});
    }, 500)};
  }

  moveRegionPress(input: PointerEvent) {
    const press = this.regionPress;
    if (press?.id === input.pointerId && Math.hypot(input.clientX - press.x, input.clientY - press.y) > 8)
      this.endRegionPress();
  }

  endRegionPress() {
    clearTimeout(this.regionPress?.timer);
    this.regionPress = undefined;
  }

  finishRegionTouch(place: Place, event: TouchEvent) {
    // The long press already opened the menu; do not synthesize a tap on it at release.
    if (this.heldRegion === place.id && event.cancelable) event.preventDefault();
  }

  selectRegion(place: Place, input: MouseEvent) {
    if (this.heldRegion === place.id && input.detail !== 0) {
      input.stopPropagation();
      this.heldRegion = null;
      return;
    }
    void this.select(place);
  }

  contextRegion(place: Place, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === 'contextmenu' && (this.regionPress || (event as PointerEvent).pointerType === 'touch')) return;
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const point = event.clientX || event.clientY ? {x: event.clientX, y: event.clientY}
      : {x: rect.right, y: rect.bottom};
    this.regionContext.set({place, ...point});
  }
  @HostListener("document:click") closeModePicker() {
    this.modePicker.set(false);
  }
  @HostListener("document:keydown.escape") closeDetails() {
    if (this.regionContext()) { this.regionContext.set(null); return; }
    this.closeModePicker();
    if (this.searchOpen()) {
      this.closeSearch();
      return;
    }
    this.metric.set(null);
    this.day.set(null);
    this.detailOpen.set(false);
    this.skyDetail.set(null);
  }
  dragRegion(place: Place, event: DragEvent) {
    this.draggingRegion = place.id;
    event.dataTransfer?.setData("text/plain", String(place.id));
  }
  dropRegion(place: Place, event: DragEvent) {
    event.preventDefault();
    const from = this.saved().findIndex((p) => p.id === this.draggingRegion),
      to = this.saved().findIndex((p) => p.id === place.id);
    if (from >= 0 && to >= 0 && from !== to) {
      const values = [...this.saved()];
      values.splice(to, 0, values.splice(from, 1)[0]);
      this.saved.set(values);
      this.persist();
    }
    this.draggingRegion = null;
  }
  currentLocation() {
    if (!this.isBrowser || typeof navigator === "undefined" || !navigator.geolocation) {
      this.error.set("Location access is unavailable in this browser.");
      return;
    }
    this.loading.set(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        void this.select({
          id: 0,
          name: "Current Location",
          country: "",
          countryCode: "",
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
      },
      (e) => {
        this.loading.set(false);
        this.error.set(e.message);
      },
    );
  }
  async showRegions() {
    this.modePicker.set(false);
    this.closeSearch();
    this.regions.set(true);
    await Promise.allSettled(
      this.saved().map(async (p) => {
        const s = await this.forecast(p);
        this.snapshots.update((a) => ({ ...a, [p.id]: s }));
      }),
    );
  }
  remove(place: Place) {
    this.saved.update((p) => p.filter((c) => c.id !== place.id));
    this.persist();
    if (this.weather()?.place.id === place.id) {
      const next = this.saved()[0];
      if (next) void this.select(next);
      else {
        this.weather.set(null);
        this.calendarForecast.selectedPlace.set(null);
        this.regions.set(false);
      }
    }
  }
  persist() {
    if (this.isBrowser && typeof localStorage !== "undefined") {
      localStorage.setItem("cc.mac.regions", JSON.stringify(this.saved()));
    }
  }
  icon(name: string) {
    return (
      (
        {
          sun: "sun.max",
          cloud: "cloud",
          rain: "cloud.rain",
          moon: "moon.stars",
        } as Record<string, string>
      )[name] ?? "cloud.sun.fill"
    );
  }
}
