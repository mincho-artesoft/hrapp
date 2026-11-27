import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { CalendarLocalization, CalendarNativeTextPipe } from '../../core/calendar-localization';
import { Snapshot } from '../../core/weather.service';
import { bounds, ChartMetric, finite, hourlyValue, mean, weatherChart } from '../../core/weather-detail-chart';
import { CalendarSymbolComponent } from './calendar-symbol.component';

@Component({
  selector: 'cc-weather-chart',
  standalone: true,
  imports: [CalendarNativeTextPipe, CalendarSymbolComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar-weather-chart.component.html',
  styleUrl: './calendar-weather-chart.component.scss',
})
export class CalendarWeatherChartComponent {
  readonly snapshot = input.required<Snapshot>();
  readonly date = input.required<string>();
  readonly metric = input.required<ChartMetric>();
  readonly apparent = input(false);
  readonly name = input.required<string>();
  readonly now = input.required<number>();
  readonly chart = computed(() => weatherChart(this.snapshot(), this.date(), this.metric(), this.apparent()));
  private readonly local = inject(CalendarLocalization);
  readonly colorId = computed(() => 'weather-detail-gradient-' + this.metric());
  readonly target = signal<number | null>(null);
  readonly nowX = computed(() => {
    const c = this.chart();
    if (!c || !finite(c.start)) return null;
    const x = (100 * (this.now() - c.start)) / (c.duration * 3_600_000);
    return x >= 0 && x <= 100 ? x : null;
  });
  readonly topRow = computed(() => {
    const c = this.chart(),
      metric = this.metric();
    if (!c || metric === 'chance' || metric === 'precip') return [];
    const stride = metric === 'temp' || metric === 'wind' || metric === 'uv' ? 2 : 4;
    return Array.from({ length: 24 / stride }, (_, i) => {
      const slice = c.selected.filter((h) => Math.floor(Number(h.iso.slice(11, 13)) / stride) === i);
      const h = slice[0];
      if (!h) return null;
      const vals = slice
        .map((hour) => hourlyValue(hour, metric, this.apparent(), this.snapshot().windUnit === 'mph'))
        .filter(finite);
      return {
        symbol: metric === 'temp' ? (h.symbol ?? 'cloud') : metric === 'wind' ? 'arrow.down' : '',
        rotation: metric === 'wind' ? h.direction : 0,
        text: vals.length ? this.format(mean(vals)) + (metric === 'humidity' ? '%' : '') : '',
      };
    });
  });
  constructor() {
    effect(() => {
      this.date();
      this.metric();
      this.apparent();
      this.target.set(null);
    });
  }
  readonly reading = computed(() => {
    const c = this.chart(),
      target = this.target();
    if (!c || target === null) return null;
    const bars = this.metric() === 'precip';
    const x = bars ? Math.floor(target / c.columnWidth) * c.columnWidth : target;
    const a = c.points.filter((p) => p.x <= x + 0.00001).at(-1),
      b = c.points.find((p) => p.x >= x - 0.00001);
    if (!a || (!bars && (!b || b.x - a.x > 1.5 * c.columnWidth))) return null;
    if (bars && x - a.x >= c.columnWidth - 0.00001) return null;
    const t = b && b.x !== a.x ? (x - a.x) / (b.x - a.x) : 0;
    const value = b && !bars ? a.value + t * (b.value - a.value) : a.value;
    const x2 = bars ? a.x + c.columnWidth / 2 : x;
    const extraAt = (at: number) => c.extra.find((p) => p.x === at)?.value;
    const first = extraAt(a.x),
      last = b ? extraAt(b.x) : first;
    const second = finite(first) ? first + (finite(last) ? t * (last - first) : 0) : null;
    const start = Date.parse(a.hour.instant ?? a.hour.iso + 'Z');
    const instant = start + (bars ? 0 : ((x - a.x) / 100) * c.duration * 3_600_000);
    const time = new Intl.DateTimeFormat(this.local.formattingLocale(), {
      hour: 'numeric', hourCycle: this.local.shortTime().resolvedOptions().hourCycle,
      minute: '2-digit',
      timeZone: a.hour.instant ? this.snapshot().place.timezone : 'UTC',
    }).format(instant);
    return { x: x2, y: c.y(value), value, second, time };
  });
  readonly uvBands = [
    { value: 2, label: 'Low' },
    { value: 4, label: 'Moderate' },
    { value: 6, label: 'High' },
    { value: 8, label: 'Very High' },
    { value: 11, label: 'Extreme' },
  ];
  format(n: number, axis = false) {
    const kind = this.metric(),
      imperial = this.snapshot().windUnit === 'mph';
    const precision =
      kind === 'pressure' && imperial
        ? 2
        : kind === 'precip' && imperial
          ? 2
          : (kind === 'visibility' && !axis) || kind === 'precip'
            ? 1
            : 0;
    return new Intl.NumberFormat(this.local.formattingLocale(), { maximumFractionDigits: precision }).format(n);
  }
  axisValue(value: number) {
    const m = this.metric();
    return this.format(value, true) + (m === 'temp' ? '°' : m === 'humidity' || m === 'chance' ? '%' : '');
  }
  down(e: PointerEvent) {
    if (!e.isPrimary || e.button !== 0) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    this.move(e);
  }
  move(e: PointerEvent) {
    const el = e.currentTarget as HTMLElement;
    if (!el.hasPointerCapture(e.pointerId)) return;
    const r = el.getBoundingClientRect();
    this.target.set(bounds((100 * (e.clientX - r.left)) / r.width, 0, this.metric() === 'precip' ? 99.999 : 100));
  }
  key(e: KeyboardEvent) {
    const c = this.chart();
    if (!c) return;
    const x = this.target() ?? c.points[0].x;
    if (e.key === 'Home') this.target.set(c.points[0].x);
    else if (e.key === 'End') this.target.set(c.points.at(-1)!.x);
    else if (e.key === 'ArrowRight') this.target.set(c.points.find((p) => p.x > x + 0.01)?.x ?? x);
    else if (e.key === 'ArrowLeft') this.target.set(c.points.filter((p) => p.x < x - 0.01).at(-1)?.x ?? x);
    else return;
    e.preventDefault();
  }
}
