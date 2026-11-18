import { CalendarForecastService } from '../../core/calendar-forecast.service';
import { CalendarLocalization, CalendarNativeTextPipe } from "../../core/calendar-localization";
import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  output,
  signal,
  OnInit,
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
  SkyDay,
} from "../../core/weather.service";
import {
  CalendarChoiceComponent,
  CalendarChoice,
} from "./calendar-choice.component";
import { CalendarSymbolComponent } from "./calendar-symbol.component";

import { CalendarWindMapComponent } from './calendar-wind-map.component';

@Component({
  selector: "cc-weather",
  standalone: true,
  imports: [
    CalendarNativeTextPipe,
    CommonModule,
    FormsModule,
    CalendarSymbolComponent,
    CalendarChoiceComponent,
    CalendarWindMapComponent,
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
  readonly isDesktop = input(true);
  readonly viewChange = output<string>();
  readonly openMenu = output<void>();
  readonly createEvent = output<{date:string;timeZone:string}>();

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
  private draggingRegion: number | null = null;
  private generation = 0;
  private searchGeneration = 0;

  readonly metricNames: Record<string, string> = {
    temp: "Feels Like",
    precip: "Precipitation",
    uv: "UV Index",
    wind: "Wind",
    humidity: "Humidity",
    visibility: "Visibility",
    pressure: "Pressure",
  };
  readonly metricIcons: Record<string, string> = {
    temp: "thermometer.medium",
    precip: "drop.fill",
    uv: "sun.max.fill",
    wind: "wind",
    humidity: "humidity.fill",
    visibility: "eye.fill",
    pressure: "gauge.with.dots.needle.33percent",
  };
  readonly detailOpen = signal(false);
  readonly detailMetric = signal("temp");
  readonly detailDate = signal("");
  readonly feelsLike = signal(false);
  readonly selectedHour = signal<number | null>(null);
  readonly skyDetail = signal<"solar" | "moon" | null>(null);
  readonly metricChoices = [
    { value: "temp", label: "Conditions", symbol: "cloud.sun" },
    { value: "uv", label: "UV Index", symbol: "sun.max" },
    { value: "wind", label: "Wind", symbol: "wind" },
    { value: "precip", label: "Precipitation", symbol: "drop.fill" },
    { value: "humidity", label: "Humidity", symbol: "humidity.fill" },
    { value: "visibility", label: "Visibility", symbol: "eye.fill" },
    {
      value: "pressure",
      label: "Pressure",
      symbol: "gauge.with.dots.needle.33percent",
    },
  ];
  readonly detailHours = computed(() =>
    (this.weather()?.forecastHours ?? []).filter((h) =>
      h.iso.startsWith(this.detailDate()),
    ),
  );
  readonly detailValues = computed(() =>
    this.detailHours().map((h) => this.hourValue(h)),
  );
  readonly detailGraph = computed(() => {
    const values = this.detailValues();
    if (!values.length) return "";
    const minimum = Math.min(...values),
      span = Math.max(...values) - minimum || 1;
    return values
      .map(
        (v, i) =>
          `${(i * 100) / Math.max(1, values.length - 1)},${90 - ((v - minimum) / span) * 75}`,
      )
      .join(" ");
  });
  readonly currentHour = computed(() => this.forecastHours()[0]);
  readonly displayMetrics = computed(() => {
    const s = this.weather();
    if (!s) return [];
    const hours = s.forecastHours ?? [], current = this.currentHour();
    const visibility: MetricSample = {
      id: "visibility",
      value: current ? current.visibility.toFixed(1) : "—",
      unit: s.visibilityUnit ?? "km",
      caption: "Distance visible near the surface.",
      series: hours.slice(0, 12).map((h) => Math.min(1, h.visibility / 50)),
    };
    return [
      "temp",
      "uv",
      "wind",
      "precip",
      "visibility",
      "humidity",
      "pressure",
    ]
      .map((id) =>
        id === "visibility" ? visibility : s.metrics.find((m) => m.id === id)!,
      )
      .filter(Boolean);
  });

  windDirection(degrees: number): string {
    return ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'][Math.round(degrees / 22.5) % 16];
  }
  uvCategory(uv: number) {
    return uv < 3 ? 'Low' : uv < 6 ? 'Moderate' : uv < 8 ? 'High' : uv < 11 ? 'Very High' : 'Extreme';
  }

  selectedHourLabel(): string {
    const idx = this.selectedHour();
    const hours = this.detailHours();
    if (idx === null || idx < 0 || idx >= hours.length) return "";
    return hours[idx].iso.slice(11, 16);
  }

  localNow(zone: string) {
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
        .format(new Date())
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

  solarPosition(sky: SkyDay, zone: string): { x: number; y: number; isUpcomingSunrise: boolean } {
    const nowIso = this.localNow(zone);
    const toMin = (iso: string | null | undefined) => {
      if (!iso || iso.length < 16) return null;
      const [hh, mm] = iso.slice(11, 16).split(":").map(Number);
      return Number.isFinite(hh) && Number.isFinite(mm) ? hh * 60 + mm : null;
    };
    const nowMin = toMin(nowIso) ?? 720;
    const riseMin = toMin(sky.sunrise) ?? 420;
    const setMin = toMin(sky.sunset) ?? 1080;
    const progress =
      setMin > riseMin
        ? Math.min(1, Math.max(0, (nowMin - riseMin) / (setMin - riseMin)))
        : 0.5;
    // Semi-circular arc from (30, 68) through (150, 14) to (270, 68)
    const angle = Math.PI * (1 - progress);
    const x = 150 + 115 * Math.cos(angle);
    const y = 68 - 54 * Math.sin(angle);
    return {
      x,
      y,
      isUpcomingSunrise: nowMin < riseMin || nowMin >= setMin,
    };
  }

  openDetail(id = "temp", date?: string) {
    this.detailMetric.set(id);
    this.detailDate.set(date ?? this.weather()?.daily[0]?.iso ?? "");
    this.feelsLike.set(false);
    this.selectedHour.set(null);
    this.detailOpen.set(true);
  }
  hourValue(h: ForecastHour) {
    return (
      {
        temp: this.feelsLike() ? h.feelsLike : h.temperature,
        uv: h.uv,
        wind: h.wind,
        precip: h.precipitationChance,
        humidity: h.humidity,
        visibility: h.visibility,
        pressure: h.pressure,
      } as Record<string, number>
    )[this.detailMetric()];
  }
  detailUnit() {
    return (
      (
        {
          temp: "°",
          uv: "",
          wind: this.weather()?.windUnit,
          precip: "%",
          humidity: "%",
          visibility: this.weather()?.visibilityUnit,
          pressure: "hPa",
        } as Record<string, string>
      )[this.detailMetric()] ?? ""
    );
  }
  detailValue() {
    const values = this.detailValues(),
      index = this.selectedHour();
    if (!values.length) return "—";
    return (
      (index === null ? Math.max(...values) : values[index]).toFixed(
        this.detailMetric() === "visibility" ? 1 : 0,
      ) + this.detailUnit()
    );
  }
  beginChartInspection(event: PointerEvent) {
    if (event.button !== 0 || !event.isPrimary) return;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    this.inspectChart(event);
  }
  inspectChart(event: PointerEvent) {
    const chart = event.currentTarget as HTMLElement;
    if (!event.isPrimary || !chart.hasPointerCapture(event.pointerId) || !this.detailHours().length) return;
    const rect = chart.getBoundingClientRect();
    this.selectedHour.set(
      Math.min(
        this.detailHours().length - 1,
        Math.max(
          0,
          Math.round(
            ((event.clientX - rect.left) / rect.width) *
              (this.detailHours().length - 1),
          ),
        ),
      ),
    );
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
      hour12: preference === '12' ? true : preference === '24' ? false : undefined};
    const locale = this.localization.locale();
    return {hours: new Intl.DateTimeFormat(locale, options),
      minutes: new Intl.DateTimeFormat(locale, {...options, minute: '2-digit'})};
  });

  clock(value: string | null | undefined, hoursOnly = false) {
    if (!value) return '—';
    // The service returns local clock values for the forecast city.
    const time = Date.parse(value + 'Z');
    if (!Number.isFinite(time)) return '—';
    const clocks = this.weatherClocks();
    return (hoursOnly ? clocks.hours : clocks.minutes).format(time);
  }
  moonPhase(value: number | null | undefined) {
    if (value == null) return "—";
    return [
      "New Moon",
      "Waxing Crescent",
      "First Quarter",
      "Waxing Gibbous",
      "Full Moon",
      "Waning Gibbous",
      "Last Quarter",
      "Waning Crescent",
    ][Math.round(value * 8) % 8];
  }
  moonArtwork(value: number | null | undefined) {
    if (value == null) return "";
    const names = [
      "new",
      "waxing_crescent",
      "first_quarter",
      "waxing_gibbous",
      "full",
      "waning_gibbous",
      "third_quarter",
      "waning_crescent",
    ];
    return (
      "/icons/calendar-native/artwork/phase_" +
      names[Math.round(value * 8) % 8] +
      ".png"
    );
  }
  moonSymbol(value: number | null | undefined) {
    if (value == null) return "moon";
    return (
      "moonphase." +
      [
        "new.moon",
        "waxing.crescent",
        "first.quarter",
        "waxing.gibbous",
        "full.moon",
        "waning.gibbous",
        "last.quarter",
        "waning.crescent",
      ][Math.round(value * 8) % 8]
    );
  }
  ngOnInit() {
    if (!this.isBrowser || typeof localStorage === "undefined") return;
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
  contextRegion(place: Place, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    const w = typeof window !== "undefined" ? window.innerWidth : 800;
    const h = typeof window !== "undefined" ? window.innerHeight : 600;
    this.regionContext.set({
      place,
      x: Math.min(event.clientX, w - 240),
      y: Math.min(event.clientY, h - 70),
    });
  }
  @HostListener("document:click") closeContext() {
    this.regionContext.set(null);
    this.modePicker.set(false);
  }
  @HostListener("document:keydown.escape") closeDetails() {
    this.closeContext();
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
