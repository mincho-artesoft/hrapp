/** WeatherKit reports UTC instants and metric measurements regardless of display units. */
interface Reading {
  conditionCode: string;
  daylight: boolean;
  cloudCover: number;
  temperature: number;
  temperatureApparent: number;
  temperatureDewPoint: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windGust: number;
  windDirection: number;
  uvIndex: number;
  visibility: number;
}
interface WeatherHour extends Reading {
  precipitationType?: string;
  snowfallAmount?: number;
  forecastStart: string;
  precipitationAmount: number;
  precipitationChance: number;
}
interface WeatherDay {
  precipitationType?: string;
  snowfallAmount?: number;
  forecastStart: string;
  temperatureMax: number;
  temperatureMin: number;
  maxUvIndex: number;
  windSpeedMax: number;
  precipitationAmount: number;
  precipitationChance: number;
  conditionCode: string;
  sunrise?: string;
  sunset?: string;
  moonrise?: string;
  moonset?: string;
  moonPhase?: string;
}
export interface CalendarWeatherAlert {
  id: string;
  description: string;
  severity: string;
  source: string;
  detailsUrl: string;
}
export interface AppleForecast {
  currentWeather: Reading & {asOf: string};
  forecastDaily: {days: WeatherDay[]};
  forecastHourly: {hours: WeatherHour[]};
  weatherAlerts?: {alerts?: CalendarWeatherAlert[]};
}

const conditions: Record<string, number> = {
  Clear: 0, Hot: 0, Frigid: 0, MostlyClear: 1, PartlyCloudy: 2, MostlyCloudy: 3, Cloudy: 3,
  Breezy: 1, Windy: 1, Haze: 45, Foggy: 45, Smoky: 45, BlowingDust: 45,
  Drizzle: 53, FreezingDrizzle: 56, Rain: 63, HeavyRain: 65, FreezingRain: 67, SunShowers: 80,
  Flurries: 71, SunFlurries: 85, Snow: 73, HeavySnow: 75, Blizzard: 75, BlowingSnow: 75,
  Sleet: 66, WintryMix: 77, Hail: 77, IsolatedThunderstorms: 95, ScatteredThunderstorms: 95,
  StrongStorms: 99, Thunderstorms: 95, Hurricane: 99, TropicalStorm: 95,
};
const phases = ['new', 'waxingCrescent', 'firstQuarter', 'waxingGibbous', 'full', 'waningGibbous', 'thirdQuarter', 'waningCrescent'];

/** Keep distinct Apple conditions that collapse to the same numeric weather code. */
export function appleConditionSymbol(condition: string, daylight: boolean, fallback: string): string {
  switch (condition) {
    case 'Breezy': case 'Windy': return 'wind';
    case 'BlowingSnow': case 'Blizzard': return 'wind.snow';
    case 'Smoky': return 'smoke';
    case 'Haze': case 'BlowingDust': return daylight ? 'sun.haze' : 'cloud.fog';
    case 'Hot': return 'thermometer.sun';
    case 'Frigid': return 'thermometer.snowflake';
    case 'Hurricane': return 'hurricane';
    case 'TropicalStorm': return 'tropicalstorm';
    case 'Hail': return 'cloud.hail';
    case 'SunShowers': return daylight ? 'cloud.sun.rain' : 'cloud.moon.rain';
    case 'IsolatedThunderstorms': case 'ScatteredThunderstorms':
      return daylight ? 'cloud.sun.bolt' : 'cloud.moon.bolt';
    default: return fallback;
  }
}

export function calendarForecastSeries(data: AppleForecast, timezone: string, imperial: boolean) {
  const clock = new Intl.DateTimeFormat('sv-SE', {timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23'});
  const local = (iso: string) => clock.format(new Date(iso)).replace(' ', 'T');
  const optionalTime = (iso?: string) => iso ? local(iso) : null;
  const temperature = (v: number) => imperial ? v * 9 / 5 + 32 : v;
  const speed = (v: number) => imperial ? v / 1.609344 : v;
  const code = (v: string) => conditions[v] ?? 3;
  const c = data.currentWeather;
  const hours = data.forecastHourly.hours;
  const days = data.forecastDaily.days;
  return {
    current: {time: local(c.asOf), weather_code: code(c.conditionCode), is_day: Number(c.daylight), cloud_cover: c.cloudCover * 100,
      temperature_2m: temperature(c.temperature), apparent_temperature: temperature(c.temperatureApparent),
      relative_humidity_2m: c.humidity * 100, wind_speed_10m: speed(c.windSpeed), wind_direction_10m: c.windDirection,
      pressure_msl: c.pressure, uv_index: c.uvIndex, wind_gusts_10m: speed(c.windGust),
      visibility: c.visibility, dew_point_2m: temperature(c.temperatureDewPoint)},
    hourly: {
      time: hours.map(h => local(h.forecastStart)), weather_code: hours.map(h => code(h.conditionCode)), is_day: hours.map(h => Number(h.daylight)),
      temperature_2m: hours.map(h => temperature(h.temperature)), apparent_temperature: hours.map(h => temperature(h.temperatureApparent)),
      dew_point_2m: hours.map(h => temperature(h.temperatureDewPoint)), relative_humidity_2m: hours.map(h => h.humidity * 100),
      precipitation: hours.map(h => h.precipitationAmount), precipitation_probability: hours.map(h => Math.round(h.precipitationChance * 100)),
      wind_speed_10m: hours.map(h => speed(h.windSpeed)), wind_gusts_10m: hours.map(h => speed(h.windGust)),
      wind_direction_10m: hours.map(h => h.windDirection), visibility: hours.map(h => h.visibility),
      pressure_msl: hours.map(h => h.pressure), uv_index: hours.map(h => h.uvIndex),
    },
    daily: {
      time: days.map(d => local(d.forecastStart).slice(0, 10)), weather_code: days.map(d => code(d.conditionCode)),
      temperature_2m_min: days.map(d => temperature(d.temperatureMin)), temperature_2m_max: days.map(d => temperature(d.temperatureMax)),
      precipitation_sum: days.map(d => d.precipitationAmount), precipitation_probability_max: days.map(d => Math.round(d.precipitationChance * 100)),
      wind_speed_10m_max: days.map(d => speed(d.windSpeedMax)), uv_index_max: days.map(d => d.maxUvIndex),
      sunrise: days.map(d => optionalTime(d.sunrise)), sunset: days.map(d => optionalTime(d.sunset)),
      moonrise: days.map(d => optionalTime(d.moonrise)), moonset: days.map(d => optionalTime(d.moonset)),
      moon_phase: days.map(d => { const index = phases.indexOf(d.moonPhase ?? ''); return index < 0 ? null : index / 8; }),
    },
  };
}
