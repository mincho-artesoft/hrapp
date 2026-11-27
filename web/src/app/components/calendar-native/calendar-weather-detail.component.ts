import { ChangeDetectionStrategy, Component, computed, input, inject, signal } from '@angular/core';
import { CalendarLocalization, CalendarNativeTextPipe } from '../../core/calendar-localization';
import { finite, mean, weatherChart, WeatherMetric } from '../../core/weather-detail-chart';
import { Snapshot, ForecastHour } from '../../core/weather.service';
import { CalendarSymbolComponent } from './calendar-symbol.component';
import { CalendarWeatherChartComponent } from './calendar-weather-chart.component';

const beaufort = [
  'Calm',
  'Light air',
  'Light breeze',
  'Gentle breeze',
  'Moderate breeze',
  'Fresh breeze',
  'Strong breeze',
  'High wind',
  'Gale',
  'Strong gale',
  'Storm',
  'Violent storm',
  'Hurricane-force',
];
const kmRanges = [
  '< 2',
  '2 – 5',
  '6 – 11',
  '12 – 19',
  '20 – 28',
  '29 – 38',
  '39 – 49',
  '50 – 61',
  '62 – 74',
  '75 – 88',
  '89 – 102',
  '103 – 117',
  '≥ 118',
];
const mileRanges = [
  '< 1',
  '1 – 3',
  '4 – 7',
  '8 – 12',
  '13 – 17',
  '18 – 24',
  '25 – 30',
  '31 – 38',
  '39 – 46',
  '47 – 54',
  '55 – 63',
  '64 – 72',
  '≥ 73',
];
const directionKeys = [
  'N',
  'NNE',
  'NE',
  'ENE',
  'E',
  'ESE',
  'SE',
  'SSE',
  'S',
  'SSW',
  'SW',
  'WSW',
  'W',
  'WNW',
  'NW',
  'NNW',
];
const aboutSections: Partial<Record<WeatherMetric, [string, string][]>> = {
  temp: [
    [
      'About Feels Like Temperature',
      'Feels Like conveys how warm or cold it feels and can be different from the actual temperature. The Feels Like temperature is affected by humidity, sunlight and wind.',
    ],
  ],
  wind: [
    [
      'About Wind Speed and Gusts',
      'The wind speed is calculated using the average over a short period of time. Gusts are short bursts of wind above this average. A gust typically lasts under 20 seconds.',
    ],
    [
      'About the Beaufort Scale',
      'The Beaufort wind scale expresses how forceful or strong the wind is at a given speed. The Beaufort scale may make it easier to understand how windy it will feel or how much effect the wind could have. Each value on the scale corresponds to a wind speed range.',
    ],
  ],
  precip: [
    [
      'About Precipitation Intensity',
      'Intensity is calculated based on how much rain or snow falls per hour and is meant to indicate how heavy the rain or snow will feel. It is also used with other precipitation types such as sleet and wintry mix. A downpour or heavy snowstorm can have a "heavy" intensity, while an average rainfall or lighter drizzle can have a "moderate" or "light" intensity.',
    ],
  ],
  pressure: [
    [
      'About Pressure',
      'Significant, rapid changes in pressure are used to predict changes in the weather. For example, a drop in pressure can mean that rain or snow is on the way, and rising pressure can mean that weather will improve. Pressure is also called barometric pressure or atmospheric pressure.',
    ],
  ],
  humidity: [
    [
      'About Relative Humidity',
      'Relative humidity, commonly known just as humidity, is the amount of moisture in the air compared with what the air can hold. The air can hold more moisture at higher temperatures. A relative humidity near 100% means there may be dew or fog.',
    ],
    [
      'About Dew Point',
      'The dew point is what the temperature would need to fall to for dew to form. It can be a useful way to tell how humid the air feels — the higher the dew point, the more humid it feels. A dew point that matches the current temperature means the relative humidity is 100%, and there may be dew or fog.',
    ],
  ],
  visibility: [
    [
      'About Visibility',
      'Visibility tells you how far away you can clearly see objects like buildings and hills. It is a measure of the transparency of the air and does not take into account the amount of sunlight or the presence of obstructions. Visibility at or above %@ is considered clear.',
    ],
  ],
};

@Component({
  selector: 'cc-weather-detail-body',
  standalone: true,
  imports: [CalendarWeatherChartComponent, CalendarSymbolComponent, CalendarNativeTextPipe],
  templateUrl: './calendar-weather-detail.component.html',
  styleUrl: './calendar-weather-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarWeatherDetailComponent {
  readonly snapshot = input.required<Snapshot>();
  readonly date = input.required<string>();
  readonly metric = input.required<WeatherMetric>();
  readonly now = input.required<number>();
  readonly name = input.required<string>();
  private readonly local = inject(CalendarLocalization);
  readonly apparent = signal(false);
  readonly day = computed(() => this.snapshot().daily.find((d) => d.iso === this.date()));
  readonly today = computed(() => this.date() === this.snapshot().daily[0]?.iso);
  readonly imperial = computed(() => this.snapshot().windUnit === 'mph');
  readonly data = computed(() => weatherChart(this.snapshot(), this.date(), this.metric(), this.apparent()));
  readonly explanations = computed(() => aboutSections[this.metric()] ?? []);
  readonly beaufort = computed(() =>
    beaufort.map((name, i) => ({ name, i, range: (this.imperial() ? mileRanges : kmRanges)[i] }))
  );
  readonly weekday = computed(() =>
    new Intl.DateTimeFormat(this.local.formattingLocale(), { timeZone: 'UTC', weekday: 'long' }).format(
      new Date(this.date() + 'T12:00:00Z')
    )
  );
  readonly rainUnit = computed(() => (this.imperial() ? 'in' : 'mm'));
  private readonly dailyHours = computed(
    () => this.snapshot().forecastHours?.filter((h) => h.iso.startsWith(this.date() + 'T')) ?? []
  );
  format(template: string, ...args: (number | string | null | undefined)[]) {
    let index = 0;
    return this.local.text(template).replace(/%%|%(?:(\d+)\$)?(?:\.(\d+)f|[d@])/g, (match, pos, decimals) => {
      if (match === '%%') return '%';
      const v = args[pos ? Number(pos) - 1 : index++];
      return typeof v === 'number' ? this.num(v, Number(decimals ?? 0)) : (v ?? '—');
    });
  }
  num(n: unknown, digits = 0) {
    return finite(n)
      ? new Intl.NumberFormat(this.local.formattingLocale(), {
          minimumFractionDigits: digits,
          maximumFractionDigits: digits,
        }).format(n)
      : '—';
  }
  direction(bearing: number | null) {
    if (!finite(bearing)) return '—';
    const d = directionKeys[Math.round((bearing + 360) / 22.5) % 16],
      key = 'cardinal.' + d;
    const result = this.local.text(key);
    return result === key ? d : result;
  }
  uvBand(n: number) {
    return n < 3 ? 'Low' : n < 6 ? 'Moderate' : n < 8 ? 'High' : n < 11 ? 'Very High' : 'Extreme';
  }
  readonly temperatures = computed(() => {
    const d = this.day(),
      c = this.data(),
      s = this.snapshot();
    return {
      max: this.apparent() ? this.num(c?.max) : (d?.max ?? '—'),
      min: this.apparent() ? this.num(c?.min) : (d?.min ?? '—'),
      current: this.num(this.apparent() ? s.conditions.feelsLike : s.conditions.temperature),
    };
  });
  readonly heading = computed(() => {
    const c = this.data(),
      s = this.snapshot(),
      d = this.day();
    if (!c || !d) return null;
    switch (this.metric()) {
      case 'temp':
        return null;
      case 'uv': {
        const peak = finite(Number(d.uvMax)) ? Number(d.uvMax) : c.max;
        return { title: this.format("Today's %@ %d", this.local.text(this.uvBand(peak)), peak), caption: '' };
      }
      case 'wind': {
        const gusts = c.selected.map((h) => h.gust).filter(finite);
        const title = this.today()
          ? this.format('Wind Speed %d', s.conditions.wind) +
            ' ' +
            c.unit +
            ' ' +
            this.direction(s.conditions.direction)
          : this.format('Wind Speed %d-%d', c.min, c.max) + ' ' + c.unit;
        return {
          title,
          caption:
            this.format('Gusts up to %d', this.today() ? s.conditions.gust : gusts.length ? Math.max(...gusts) : null) +
            ' ' +
            c.unit,
        };
      }
      case 'precip': {
        const snow = c.extra.reduce((sum, p) => sum + p.value, 0),
          rain = c.values.reduce((sum, v) => sum + v, 0);
        return {
          title:
            snow > 0
              ? this.format('Rain: %.1f%@, Snow: %.1f%@', rain, c.unit, snow, c.unit)
              : rain > 0
                ? this.format('Rain: %.1f%@', rain, c.unit)
                : this.format('Precipitation: 0%@', c.unit),
          caption: this.format('Hourly bars for rain & snow (%@).', c.unit),
        };
      }
      case 'humidity':
        return {
          title: this.today()
            ? this.format('Humidity %d%%', s.conditions.humidity)
            : this.format('Humidity Avg %d%%', c.avg),
          caption: this.format("Today's min %d%% – max %d%%", c.min, c.max),
        };
      case 'visibility':
        return {
          title: this.today()
            ? this.format('Visibility %d %@', s.conditions.visibility, c.unit)
            : this.local.text('Visibility'),
          caption: this.format('min %d – max %d %@', c.min, c.max, c.unit),
        };
      case 'pressure': {
        const precision = this.imperial() ? 2 : 0;
        return {
          title: this.today()
            ? this.format(
                'Pressure %@ %@',
                this.num(
                  finite(s.conditions.pressure) ? s.conditions.pressure * (this.imperial() ? 0.02953 : 1) : null,
                  precision
                ),
                c.unit
              )
            : this.format('Pressure Average %@ %@', this.num(c.avg, precision), c.unit),
          caption: this.format('Daily range: %@–%@ %@', this.num(c.min, precision), this.num(c.max, precision), c.unit),
        };
      }
    }
  });
  readonly summary = computed(() => {
    const c = this.data(),
      d = this.day(),
      s = this.snapshot();
    if (!c || !d) return '';
    const weekday = this.weekday(),
      hours = this.dailyHours(),
      windUnit = s.windUnit;
    switch (this.metric()) {
      case 'temp': {
        const temps = hours.map((h) => h.feelsLike).filter(finite),
          winds = hours.filter((h) => finite(h.direction) && finite(h.wind));
        const from = winds.length
          ? (Math.atan2(
              winds.reduce((n, h) => n + Math.sin((h.direction * Math.PI) / 180) * h.wind, 0),
              winds.reduce((n, h) => n + Math.cos((h.direction * Math.PI) / 180) * h.wind, 0)
            ) *
              180) /
            Math.PI
          : null;
        if (this.today())
          return this.format(
            "%d° now with %@ conditions. There is a precipitation chance of %@. Wind from %@ with gusts up to %d %@. Today's temperature ranges from %d° to %d° and feels like %d°. %@, and %@.",
            s.conditions.temperature,
            this.local.text(s.condition),
            this.num(d.precip) + '%',
            this.direction(s.conditions.direction),
            s.conditions.gust,
            windUnit,
            Number(d.min),
            Number(d.max),
            s.conditions.feelsLike,
            this.format('UV index up to %d', Number(d.uvMax)),
            this.format('Humidity around %d%%', s.conditions.humidity)
          );
        return this.format(
          "%@'s low is %d° and the high is %d°. The temperature will feel like %d° to %d°. Wind from %@ is expected. %@",
          weekday,
          Number(d.min),
          Number(d.max),
          Math.min(...temps),
          Math.max(...temps),
          this.direction(from),
          this.format("%@'s chance: %d%%", weekday, d.precip)
        );
      }
      case 'uv': {
        const higher = hours.filter((h) => h.uv >= 3);
        if (!higher.length) return this.local.text('No moderate or higher UV levels are expected for this day.');
        const time = (h: ForecastHour) =>
          new Intl.DateTimeFormat(this.local.formattingLocale(), {
            hour: 'numeric', hourCycle: this.local.shortTime().resolvedOptions().hourCycle,
            timeZone: h.instant ? s.place.timezone : 'UTC',
          }).format(new Date(h.instant ?? h.iso + 'Z'));
        return this.format(
          'Sun protection recommended. UV levels range from %@ to %@, reached between %@ and %@.',
          this.local.text(this.uvBand(Math.min(...higher.map((h) => h.uv)))),
          this.local.text(this.uvBand(c.max)),
          time(higher[0]),
          time(higher[higher.length - 1])
        );
      }
      case 'wind': {
        const gusts = hours.map((h) => h.gust).filter(finite);
        return this.today()
          ? this.format(
              'Wind is currently %1$d %2$@ from the %3$@. Today, wind speeds are %4$d to %5$d %2$@, with gusts up to %6$d %2$@.',
              s.conditions.wind,
              windUnit,
              this.direction(s.conditions.direction),
              c.min,
              c.max,
              Math.max(...gusts)
            )
          : this.format(
              'Wind speeds range from %1$d to %2$d %3$@, with gusts up to %4$d %3$@.',
              c.min,
              c.max,
              windUnit,
              Math.max(...gusts)
            );
      }
      case 'precip':
        return this.format(
          'On %@, the total precipitation will be %.1f%@.',
          weekday,
          d.precipitationAmount,
          this.rainUnit()
        );
      case 'humidity': {
        const dew = hours.map((h) => h.dewPoint).filter(finite);
        const span = dew.length
          ? this.format(
              this.today() ? 'The dew point is %d° to %d°.' : 'The dew point will be %d° to %d°.',
              Math.min(...dew),
              Math.max(...dew)
            )
          : '';
        return this.today()
          ? this.format('Today, the average humidity is %d%%. %@', mean(c.values), span)
          : this.format('On %@, the average humidity will be %d%%.\n%@', weekday, mean(c.values), span);
      }
      case 'visibility': {
        const clarity = (v: number) =>
          this.local.text(
            v * (this.imperial() ? 1.609344 : 1) < 1
              ? 'Foggy'
              : v * (this.imperial() ? 1.609344 : 1) < 10
                ? 'Hazy'
                : 'Clear'
          );
        return this.today()
          ? this.format('Today, the visibility will be %@, at %d to %d %@.', clarity(c.avg), c.min, c.max, c.unit)
          : this.format(
              'On %@, the lowest visibility will be %@ at %d %@, and the highest will be %@ at %d %@.',
              weekday,
              clarity(c.min),
              c.min,
              c.unit,
              clarity(c.max),
              c.max,
              c.unit
            );
      }
      case 'pressure': {
        const digits = this.imperial() ? 2 : 0;
        return this.format(
          'On %@, the average pressure will be %@ %@, and the lowest pressure will be %@ %@.',
          weekday,
          this.num(c.avg, digits),
          c.unit,
          this.num(c.min, digits),
          c.unit
        );
      }
    }
  });
  readonly totals = computed(() => {
    type Row = { name: string; value: number; unit: string };
    const groups: { label: string; rows: Row[] }[] = [];
    const unit = this.rainUnit();
    const group = (label: string, liquid: number, snowMm: number | undefined, type?: string) => {
      const rows: Row[] = [];
      if (finite(snowMm) && snowMm > 0)
        rows.push({ name: 'Snow', value: snowMm / (this.imperial() ? 25.4 : 10), unit: this.imperial() ? 'in' : 'cm' });
      if (type !== 'snow' || !rows.length)
        rows.push({ name: liquid > 0 && type === 'rain' ? 'Rain' : 'Precipitation', value: liquid, unit });
      groups.push({ label, rows });
    };
    if (this.today()) {
      const start = Math.floor(this.now() / 3_600_000) * 3_600_000;
      for (const [label, offset] of [
        ['LAST 24 HOURS', -24],
        ['NEXT 24 HOURS', 0],
      ] as const) {
        const begin = start + offset * 3_600_000,
          end = begin + 24 * 3_600_000;
        const hours =
          this.snapshot().forecastHours?.filter(
            (h) => h.instant && Date.parse(h.instant) >= begin && Date.parse(h.instant) < end && finite(h.precipitation)
          ) ?? [];
        if (hours.length !== 24) continue;
        const wet = hours.filter((h) => h.precipitation > 0);
        const type =
          wet.length && wet.every((h) => h.precipitationType === wet[0].precipitationType)
            ? wet[0].precipitationType
            : undefined;
        group(
          label,
          hours.reduce((sum, h) => sum + h.precipitation, 0) / (this.imperial() ? 25.4 : 1),
          hours.every((h) => finite(h.snowfall)) ? hours.reduce((sum, h) => sum + h.snowfall!, 0) : undefined,
          type
        );
      }
    }
    const day = this.day();
    if (day && finite(day.precipitationAmount) && (!this.today() || !groups.length))
      group('Total', day.precipitationAmount, day.snowfallMm, day.precipitationType);
    return groups;
  });
}
