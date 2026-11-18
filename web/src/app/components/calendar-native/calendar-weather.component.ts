import { CalendarNativeTextPipe } from "../../core/calendar-localization";
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

@Component({
  selector: "cc-weather",
  standalone: true,
  imports: [
    CalendarNativeTextPipe,
    CommonModule,
    FormsModule,
    CalendarSymbolComponent,
    CalendarChoiceComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./calendar-weather.component.html",
  styleUrl: "./calendar-weather.component.scss",
})
export class CalendarWeatherComponent implements OnInit {
  readonly Math = Math;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly service = inject(WeatherService);
  readonly modes = input<CalendarChoice[]>([]);
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
  readonly displayMetrics = computed(() => {
    const s = this.weather();
    if (!s) return [];
    const hours = s.forecastHours ?? [],
      current =
        hours.find(
          (h) => h.iso >= this.localNow(s.place.timezone).slice(0, 13),
        ) ?? hours[0];
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

  forecastHours() {
    const s = this.weather();
    return (s?.forecastHours ?? [])
      .filter(
        (h) => h.iso >= this.localNow(s?.place.timezone ?? "UTC").slice(0, 13),
      )
      .slice(0, 24);
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
  inspectChart(event: PointerEvent) {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
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
  clock(value: string | null | undefined) {
    return value?.slice(11, 16) ?? "—";
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
  private units(): "metric" | "imperial" {
    if (this.isBrowser && typeof localStorage !== "undefined") {
      try {
        const prefs = JSON.parse(
          localStorage.getItem("cc.mac.preferences") || "{}",
        );
        if (["metric", "imperial"].includes(prefs.units)) return prefs.units;
      } catch {}
    }
    const lang =
      typeof navigator !== "undefined" ? navigator.language : "en-GB";
    return /-US$/.test(lang) ? "imperial" : "metric";
  }
  ngOnInit() {
    if (!this.isBrowser || typeof localStorage === "undefined") return;
    try {
      const places = JSON.parse(
        localStorage.getItem("cc.mac.regions") || "[]",
      ) as Place[];
      this.saved.set(places);
      if (places.length)
        void this.select(
          places.find(
            (p) =>
              String(p.id) === localStorage.getItem("cc.mac.selectedRegion"),
          ) ?? places[0],
        );
      else this.regions.set(true);
    } catch {
      this.regions.set(true);
    }
  }
  beginSearch() {
    this.modePicker.set(false);
    this.searchOpen.set(true);
  }
  closeSearch() {
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
  async select(place: Place) {
    const generation = ++this.generation;
    this.loading.set(true);
    this.error.set("");
    try {
      const snapshot = await this.service.load(place, this.units());
      if (generation !== this.generation) return;
      this.weather.set(snapshot);
      if (this.isBrowser && typeof localStorage !== "undefined") {
        localStorage.setItem("cc.mac.selectedRegion", String(place.id));
      }
      this.snapshots.update((p) => ({ ...p, [place.id]: snapshot }));
      if (!this.saved().some((p) => p.id === place.id)) {
        this.saved.update((p) => [...p, place]);
        this.persist();
      }
      this.regions.set(false);
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
        const s = await this.service.load(p, this.units());
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
        this.regions.set(true);
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
  graph(series: number[]) {
    return series
      .map(
        (v, i) =>
          `${(i * 100) / Math.max(1, series.length - 1)},${90 - v * 80}`,
      )
      .join(" ");
  }
}
