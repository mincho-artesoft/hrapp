import { appleConditionSymbol, calendarForecastSeries, type AppleForecast, type CalendarWeatherAlert } from './weatherkit-forecast';
import { Injectable } from '@angular/core';

/**
 * Live weather, from Open-Meteo.
 *
 * Two endpoints, both public and both keyless:
 *
 * - `geocoding-api.open-meteo.com/v1/search` — city lookup, fuzzy from three
 *   characters, returns coordinates, country and IANA timezone.
 * - `api.open-meteo.com/v1/forecast` — current conditions plus an hourly
 *   series, in whichever units we ask for.
 *
 * No key, so nothing secret ends up in the bundle and no proxy is needed. The
 * trade is the licence: **Open-Meteo's free tier is for non-commercial use.**
 * A marketing site for a paid app is arguably commercial, so if this stays it
 * is worth either taking a subscription — which swaps the host for
 * `customer-api.open-meteo.com` and adds `&apikey=` — or moving to a provider
 * whose free tier covers commercial use. `BASE` and `GEO` below are the only
 * two lines that would change; everything past them is provider-shaped
 * already.
 *
 * Attribution is required either way (CC-BY 4.0) and lives in the footer.
 */

export interface Place {
  id: number;
  name: string;
  /** State / region, where the API has one. */
  admin1?: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface HourSample {
  /** Label for the strip: "Now", "4 PM", "16:00". */
  label: string;
  temp: string;
  icon: 'sun' | 'cloud' | 'rain' | 'moon';
  /** Native SF Symbol, retaining the actual weather condition. */
  symbol?: string;
}

export interface ForecastHour {
  iso:string; instant?:string; temperature:number; feelsLike:number; precipitation:number; precipitationChance:number;
  uv:number; wind:number; gust:number; direction:number; humidity:number; visibility:number; pressure:number;
  icon:HourSample['icon']; symbol?:string;
}
export interface SkyDay { date:string; sunrise:string|null; sunset:string|null; moonrise:string|null; moonset:string|null; moonPhase:number|null; }
export interface MetricSample {
  id: string;
  value: string;
  unit: string;
  caption: string;
  /** Normalised 0..1, twelve samples. */
  series: number[];
}

export interface DaySample {
  iso: string;
  instant?: string;
  /** "Today", "Sat". */
  day: string;
  /** "2 Aug". */
  date: string;
  icon: HourSample['icon'];
  symbol?: string;
  condition: string;
  max: string;
  min: string;
  /** Chance of precipitation, 0..100. */
  precip: number;
  windMax: string;
  uvMax: string;
  weekend: boolean;
  /**
   * Where this day's high-to-low range sits inside the fortnight's whole
   * span, 0..1 — so the range bars line up into a temperature profile you can
   * read down the column, rather than fourteen unrelated bars.
   */
  barStart: number;
  barWidth: number;
}

export interface Snapshot {
  source?: 'Apple Weather';
  alerts?: CalendarWeatherAlert[];
  currentWeatherCode?: number;
  isDaylight?: boolean;
  cloudCover?: number;
  precipitationToday?: number; dewPoint?: number;
  forecastHours?:ForecastHour[]; skyDays?:SkyDay[]; visibilityUnit?:string;
  place: Place;
  temp: string;
  condition: string;
  high: string;
  low: string;
  hourly: HourSample[];
  daily: DaySample[];
  metrics: MetricSample[];
  windUnit: string;
  /** When the reading was taken, for the "as of" line. */
  observedAt: string;
}

const GEO = 'https://geocoding-api.open-meteo.com/v1/search';
const BASE = 'https://api.open-meteo.com/v1/forecast';

/** How long a reading is reused before going back to the network. */
const TTL_MS = 10 * 60 * 1000;

export const DEFAULT_PLACE: Place = {
  id: 5391959,
  name: 'San Francisco',
  admin1: 'California',
  country: 'United States',
  countryCode: 'US',
  latitude: 37.7749,
  longitude: -122.4194,
  timezone: 'America/Los_Angeles',
};

/**
 * WMO 4677 weather codes, collapsed onto the four glyphs the section draws.
 * Deliberately lossy: "light drizzle" and "heavy freezing rain" are both a
 * raincloud here, because the tile is 22 pixels tall.
 */
function describe(code: number): { text: string; wet: boolean; cloudy: boolean } {
  if (code === 0) return { text: 'Clear', wet: false, cloudy: false };
  if (code === 1) return { text: 'Mainly clear', wet: false, cloudy: false };
  if (code === 2) return { text: 'Partly cloudy', wet: false, cloudy: true };
  if (code === 3) return { text: 'Overcast', wet: false, cloudy: true };
  if (code === 45 || code === 48) return { text: 'Fog', wet: false, cloudy: true };
  if (code >= 51 && code <= 57) return { text: 'Drizzle', wet: true, cloudy: true };
  if (code >= 61 && code <= 67) return { text: 'Rain', wet: true, cloudy: true };
  if (code >= 71 && code <= 77) return { text: 'Snow', wet: true, cloudy: true };
  if (code >= 80 && code <= 82) return { text: 'Rain showers', wet: true, cloudy: true };
  if (code === 85 || code === 86) return { text: 'Snow showers', wet: true, cloudy: true };
  if (code >= 95) return { text: 'Thunderstorm', wet: true, cloudy: true };
  return { text: 'Cloudy', wet: false, cloudy: true };
}

function glyph(code: number, isDay: boolean): HourSample['icon'] {
  const d = describe(code);
  if (d.wet) return 'rain';
  if (d.cloudy) return 'cloud';
  return isDay ? 'sun' : 'moon';
}

/** Same SF Symbols as WeatherKit's conditions in the native app. */
export function nativeWeatherSymbol(code:number,isDay:boolean):string {
  if(code===0||code===1)return isDay?'sun.max':'moon.stars';
  if(code===2)return isDay?'cloud.sun':'cloud.moon';
  if(code===3)return 'cloud';
  if(code===45||code===48)return 'cloud.fog';
  if(code===56||code===57||code===66||code===67)return 'cloud.sleet';
  if(code>=51&&code<=55)return 'cloud.drizzle';
  if(code===65||code===82)return 'cloud.heavyrain';
  if((code>=71&&code<=77)||code===85||code===86)return 'cloud.snow';
  if(code>=95)return 'cloud.bolt.rain';
  if(code>=61&&code<=81)return isDay?'cloud.rain':'cloud.moon.rain';
  return 'cloud';
}

/** Sixteen-point compass, spelled out the way the App Store listing does. */
function compass(deg: number): string {
  const points = [
    'north', 'north-north-east', 'north-east', 'east-north-east',
    'east', 'east-south-east', 'south-east', 'south-south-east',
    'south', 'south-south-west', 'south-west', 'west-south-west',
    'west', 'west-north-west', 'north-west', 'north-north-west',
  ];
  return points[Math.round((((deg % 360) + 360) % 360) / 22.5) % 16];
}

/**
 * Scale a series into 0..1 for the sparkline.
 *
 * `floor`/`ceil` pin the scale where the quantity has a meaningful absolute
 * range — a precipitation chart has to show a dry day as flat, not as noise
 * stretched to fill the box. Everything else is scaled to its own span, with a
 * guard so a genuinely flat series lands mid-height instead of dividing by
 * zero.
 */
function normalise(values: number[], floor?: number, ceil?: number): number[] {
  const clean = values.map((v) => (Number.isFinite(v) ? v : 0));
  const lo = floor ?? Math.min(...clean);
  const hi = ceil ?? Math.max(...clean);
  const span = hi - lo;
  if (span < 1e-6) return clean.map(() => 0.5);
  return clean.map((v) => Math.max(0, Math.min(1, (v - lo) / span)));
}

function round(n: number | undefined, dp = 0): string {
  if (n == null || !Number.isFinite(n)) return '—';
  return dp ? n.toFixed(dp) : String(Math.round(n));
}

interface Cached {
  at: number;
  snapshot: Snapshot;
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly cache = new Map<string, Cached>();
  private searchAbort?: AbortController;

  /**
   * City search. Two characters match exactly, three or more fuzzily — which
   * is the API's own rule, not ours, so short queries are simply not sent.
   */
  async search(query: string): Promise<Place[]> {
    const q = query.trim();
    if (q.length < 2) return [];

    // Only the newest keystroke matters; abandon whatever is still in flight.
    this.searchAbort?.abort();
    const ctrl = new AbortController();
    this.searchAbort = ctrl;

    const url = `${GEO}?name=${encodeURIComponent(q)}&count=6&language=en&format=json`;
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`Search failed (${res.status})`);

    const json = (await res.json()) as { results?: Record<string, unknown>[] };
    return (json.results ?? []).map((r) => ({
      id: Number(r['id']),
      name: String(r['name']),
      admin1: r['admin1'] ? String(r['admin1']) : undefined,
      country: String(r['country'] ?? ''),
      countryCode: String(r['country_code'] ?? ''),
      latitude: Number(r['latitude']),
      longitude: Number(r['longitude']),
      timezone: String(r['timezone'] ?? 'auto'),
    }));
  }

  async load(place: Place, units?: 'metric'|'imperial'): Promise<Snapshot> {
    const key = `${place.latitude.toFixed(3)},${place.longitude.toFixed(3)},${units??"auto"}`;
    const hit = this.cache.get(key);
    if (hit && Date.now() - hit.at < TTL_MS) return hit.snapshot;

    // Fahrenheit, miles per hour and inches for the United States; metric
    // everywhere else. Guessing from the searched country rather than from the
    // visitor's browser, because the number sits next to a place name — "72°"
    // under "Berlin" is wrong however the reader's own phone is set.
    const imperial = units ? units === 'imperial' : place.countryCode === 'US';

    const params = new URLSearchParams({
      latitude: String(place.latitude),
      longitude: String(place.longitude),
      current: 'temperature_2m,apparent_temperature,relative_humidity_2m,is_day,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,pressure_msl',
      hourly: 'temperature_2m,apparent_temperature,dew_point_2m,precipitation_probability,precipitation,relative_humidity_2m,wind_speed_10m,wind_gusts_10m,wind_direction_10m,visibility,pressure_msl,uv_index,weather_code,is_day',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max,sunrise,sunset,moonrise,moonset,moon_phase',
      timezone: place.timezone || 'auto',
      // Fourteen, for the long-range view. It also means the hourly series
      // always extends well past a twelve-hour window whatever time it is.
      forecast_days: '14',
      temperature_unit: imperial ? 'fahrenheit' : 'celsius',
      wind_speed_unit: imperial ? 'mph' : 'kmh',
    });

    const res = await fetch(`${BASE}?${params}`,{signal:AbortSignal.timeout(20000)});
    if (!res.ok) throw new Error(`Forecast failed (${res.status})`);
    const json = await res.json();

    const snapshot = this.shape(place, json, imperial);
    this.cache.set(key, { at: Date.now(), snapshot });
    return snapshot;
  }

  async loadCalendar(place: Place, units: 'metric' | 'imperial', language: string,
    fetchForecast: (parameters: URLSearchParams) => Promise<AppleForecast>): Promise<Snapshot> {
    const timezone = place.timezone && place.timezone !== 'auto' ? place.timezone : Intl.DateTimeFormat().resolvedOptions().timeZone;
    const key = ['apple', place.latitude.toFixed(3), place.longitude.toFixed(3), timezone, units, language, place.countryCode].join(',');
    const hit = this.cache.get(key);
    if (hit && Date.now() - hit.at < TTL_MS) return {...hit.snapshot, place};
    const params = new URLSearchParams({latitude: String(place.latitude), longitude: String(place.longitude),
      timezone, language, country: place.countryCode || ''});
    const data = await fetchForecast(params);
    if (!data?.forecastHourly?.hours?.length || !data?.forecastDaily?.days?.length || !data.currentWeather)
      throw new Error('Forecast unavailable.');
    const imperial = units === 'imperial';
    const snapshot = this.shape({...place, timezone}, calendarForecastSeries(data, timezone, imperial), imperial);
    snapshot.forecastHours?.forEach((hour, i) => {
      const reading = data.forecastHourly.hours[i];
      hour.instant = reading.forecastStart;
      hour.symbol = appleConditionSymbol(reading.conditionCode, reading.daylight, hour.symbol!);
    });
    snapshot.daily.forEach((day, i) => {
      const reading = data.forecastDaily.days[i];
      day.instant = reading.forecastStart;
      day.symbol = appleConditionSymbol(reading.conditionCode, true, day.symbol!);
    });
    snapshot.source = 'Apple Weather';
    snapshot.condition = data.currentWeather.conditionCode.replace(/([a-z])([A-Z])/g, '$1 $2');
    snapshot.alerts = (data.weatherAlerts?.alerts ?? []).filter(a => /^https:\/\/weatherkit\.apple\.com\//.test(a.detailsUrl));
    this.cache.set(key, {at: Date.now(), snapshot});
    return snapshot;
  }

  // ---------------------------------------------------------------- shaping

  private shape(place: Place, json: any, imperial: boolean): Snapshot {
    const cur = json.current ?? {};
    const h = json.hourly ?? {};
    const times: string[] = h.time ?? [];

    // The hourly series starts at midnight local, so find where "now" is
    // rather than assuming index 0 — otherwise every chart in the afternoon
    // would be showing the morning.
    const nowIso = String(cur.time ?? '').slice(0, 13);
    const nowAt = times.findIndex((t) => t.slice(0, 13) === nowIso);
    // Two days are requested precisely so a twelve-hour window always fits,
    // whatever time it is. This clamp is the belt to that pair of braces —
    // and if it ever does bite, the first cell must stop claiming to be now.
    const start = Math.max(0, Math.min(nowAt < 0 ? 0 : nowAt, times.length - 12));
    const startsNow = start === nowAt;

    const slice = <T>(arr: T[] | undefined, n: number): T[] =>
      (arr ?? []).slice(start, start + n);

    const twelve = (name: string) => slice<number>(h[name], 12);

    const windUnit = imperial ? 'mph' : 'km/h';
    const cond = describe(Number(cur.weather_code));

    // -------------------------------------------------------------- hourly
    const hourCodes = slice<number>(h.weather_code, 8);
    const hourDay = slice<number>(h.is_day, 8);
    const hourTemp = slice<number>(h.temperature_2m, 8);
    const hourly: HourSample[] = slice<string>(times, 8).map((t, i) => ({
      label: i === 0 && startsNow ? 'Now' : this.hourLabel(t, imperial),
      temp: `${round(hourTemp[i])}°`,
      icon: glyph(Number(hourCodes[i]), Number(hourDay[i]) === 1),
      symbol: nativeWeatherSymbol(Number(hourCodes[i]), Number(hourDay[i]) === 1),
    }));

    // ------------------------------------------------------------- metrics
    const feels = twelve('apparent_temperature');
    const actual = twelve('temperature_2m');
    const precip = twelve('precipitation_probability');
    const uv = twelve('uv_index');
    const wind = twelve('wind_speed_10m');
    const humid = twelve('relative_humidity_2m');
    const press = twelve('pressure_msl');

    const metrics: MetricSample[] = [
      {
        id: 'temp',
        value: round(cur.apparent_temperature),
        unit: '°',
        caption: this.feelsCaption(cur.apparent_temperature, cur.temperature_2m),
        series: normalise(feels),
      },
      {
        id: 'precip',
        value: round(Math.max(0, ...precip)),
        unit: '%',
        caption: this.precipCaption(precip, times, imperial, start),
        series: normalise(precip, 0, 100),
      },
      {
        id: 'uv',
        value: round(Math.max(0, ...uv)),
        unit: '',
        caption: this.uvCaption(uv, times, imperial, start),
        series: normalise(uv, 0, Math.max(3, Math.max(...uv))),
      },
      {
        id: 'wind',
        value: round(cur.wind_speed_10m),
        unit: windUnit,
        caption: `From the ${compass(Number(cur.wind_direction_10m))}, peaking at ${round(
          Math.max(...wind),
        )} ${windUnit}.`,
        series: normalise(wind),
      },
      {
        id: 'humidity',
        value: round(cur.relative_humidity_2m),
        unit: '%',
        caption: this.humidityCaption(Number(cur.relative_humidity_2m)),
        series: normalise(humid),
      },
      {
        id: 'pressure',
        value: round(cur.pressure_msl),
        unit: 'hPa',
        caption: this.pressureCaption(press),
        series: normalise(press),
      },
    ];

    const d = json.daily ?? {};

    return {
      place,
      visibilityUnit:imperial?'mi':'km',
      forecastHours:times.map((iso,i)=>({iso,temperature:h.temperature_2m?.[i],feelsLike:h.apparent_temperature?.[i],precipitation:h.precipitation?.[i],precipitationChance:h.precipitation_probability?.[i],uv:h.uv_index?.[i],wind:h.wind_speed_10m?.[i],gust:h.wind_gusts_10m?.[i],direction:h.wind_direction_10m?.[i],humidity:h.relative_humidity_2m?.[i],visibility:h.visibility?.[i]/(imperial?1609.344:1000),pressure:h.pressure_msl?.[i],icon:glyph(Number(h.weather_code?.[i]),h.is_day?.[i]===1),symbol:nativeWeatherSymbol(Number(h.weather_code?.[i]),h.is_day?.[i]===1)})),
      skyDays:(d.time??[]).map((date:string,i:number)=>({date,sunrise:d.sunrise?.[i]??null,sunset:d.sunset?.[i]??null,moonrise:d.moonrise?.[i]??null,moonset:d.moonset?.[i]??null,moonPhase:d.moon_phase?.[i]??null})),
      currentWeatherCode: cur.weather_code ?? undefined,
      isDaylight: cur.is_day == null ? undefined : cur.is_day === 1,
      cloudCover: cur.cloud_cover == null ? undefined : Math.max(0, Math.min(1, cur.cloud_cover / 100)),
      precipitationToday: d.precipitation_sum?.[0] == null ? undefined : d.precipitation_sum[0] / (imperial ? 25.4 : 1),
      dewPoint: h.dew_point_2m?.[start],
      temp: round(cur.temperature_2m),
      condition: cond.text,
      high: round(d.temperature_2m_max?.[0]),
      low: round(d.temperature_2m_min?.[0]),
      hourly,
      daily: this.days(d, windUnit),
      metrics,
      windUnit,
      observedAt: this.hourLabel(String(cur.time ?? ''), imperial),
    };
  }

  /** The fortnight, as rows with a shared temperature scale. */
  private days(d: any, windUnit: string): DaySample[] {
    const times: string[] = d.time ?? [];
    if (!times.length) return [];

    const maxes: number[] = d.temperature_2m_max ?? [];
    const mins: number[] = d.temperature_2m_min ?? [];

    const lo = Math.min(...mins.filter(Number.isFinite));
    const hi = Math.max(...maxes.filter(Number.isFinite));
    const span = hi - lo || 1;

    return times.map((iso, i) => {
      // Weekday from the date parts through Date.UTC, never from parsing the
      // string in local time: the visitor may be a day away from the city
      // they are looking at, and a forecast row labelled with the wrong day
      // is worse than one with no label.
      const [y, m, dd] = iso.split('-').map(Number);
      const dow = new Date(Date.UTC(y, m - 1, dd)).getUTCDay();
      const code = Number(d.weather_code?.[i]);
      const dayMax = Number(maxes[i]);
      const dayMin = Number(mins[i]);

      return {
        iso,
        day: i === 0 ? 'Today' : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dow],
        date: `${dd} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1]}`,
        // Daily rows are always a daytime summary, so never the moon.
        icon: glyph(code, true),
        symbol: nativeWeatherSymbol(code, true),
        condition: describe(code).text,
        max: round(dayMax),
        min: round(dayMin),
        precip: Math.round(Number(d.precipitation_probability_max?.[i]) || 0),
        windMax: `${round(d.wind_speed_10m_max?.[i])} ${windUnit}`,
        uvMax: round(d.uv_index_max?.[i]),
        weekend: dow === 0 || dow === 6,
        barStart: Number.isFinite(dayMin) ? (dayMin - lo) / span : 0,
        barWidth: Number.isFinite(dayMax - dayMin) ? Math.max(0.04, (dayMax - dayMin) / span) : 0.04,
      };
    });
  }

  // --------------------------------------------------------------- captions
  //
  // Written from the numbers, never fixed prose. The tiles used to carry
  // hand-written lines like "the wind is doing it", which read well and would
  // become a lie the moment the data behind them was real.

  private feelsCaption(feels: number, actual: number): string {
    if (!Number.isFinite(feels) || !Number.isFinite(actual)) return 'Apparent temperature.';
    const delta = Math.round(feels - actual);
    if (delta === 0) return 'Right about what the thermometer says.';
    const size = Math.abs(delta) === 1 ? 'A degree' : `${Math.abs(delta)} degrees`;
    return delta < 0
      ? `${size} below actual — wind and humidity are doing it.`
      : `${size} above actual — humidity is doing it.`;
  }

  private precipCaption(
    probs: number[],
    times: string[],
    imperial: boolean,
    start: number,
  ): string {
    const peak = Math.max(0, ...probs);
    if (peak < 15) return 'Nothing worth carrying an umbrella for.';

    const wet = probs
      .map((p, i) => ({ p, i }))
      .filter((x) => x.p >= Math.max(30, peak * 0.7));
    if (!wet.length) return `Peaking at ${Math.round(peak)}% chance.`;

    const from = this.hourLabel(times[start + wet[0].i], imperial);
    const to = this.hourLabel(times[start + wet[wet.length - 1].i + 1] ?? '', imperial);
    return wet.length === 1
      ? `Most likely around ${from}.`
      : `Most likely between ${from} and ${to}.`;
  }

  private uvCaption(uv: number[], times: string[], imperial: boolean, start: number): string {
    const peak = Math.max(0, ...uv);
    if (peak < 3) return 'Low all afternoon — nothing to plan around.';
    const at = uv.indexOf(peak);
    const when = this.hourLabel(times[start + at] ?? '', imperial);
    const band = peak >= 8 ? 'Very high' : peak >= 6 ? 'High' : 'Moderate';
    return `${band}, peaking around ${when}. Cover up.`;
  }

  private humidityCaption(rh: number): string {
    if (!Number.isFinite(rh)) return 'Relative humidity.';
    if (rh < 30) return 'Dry enough to feel it.';
    if (rh < 60) return 'Comfortable.';
    if (rh < 80) return 'Noticeably damp.';
    return 'Heavy — it will feel warmer than it is.';
  }

  private pressureCaption(series: number[]): string {
    if (series.length < 2) return 'Mean sea-level pressure.';
    const delta = series[series.length - 1] - series[0];
    if (Math.abs(delta) < 1) return 'Steady — the pattern is not moving.';
    return delta > 0
      ? 'Rising — conditions settling down.'
      : 'Falling — weather on the way in.';
  }

  /** "4 PM" in the United States, "16:00" everywhere else. */
  private hourLabel(iso: string, imperial: boolean): string {
    const hh = Number(iso.slice(11, 13));
    if (!Number.isFinite(hh)) return '';
    if (!imperial) return `${String(hh).padStart(2, '0')}:00`;
    if (hh === 0) return '12 AM';
    if (hh === 12) return '12 PM';
    return hh < 12 ? `${hh} AM` : `${hh - 12} PM`;
  }
}
