import { calendarDateFormatter } from '../../core/calendar-format-preferences';
import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal, output, signal } from '@angular/core';
import { CalendarLocalization, CalendarNativeTextPipe } from '../../core/calendar-localization';
import { instant, wallDate } from '../../core/calendar-recurrence';
import { lunarFraction, lunarIllumination, moonPhaseInfo, nextLunarEvent } from '../../core/weather-moon';
import { Snapshot } from '../../core/weather.service';
import { CalendarSymbolComponent } from './calendar-symbol.component';

const dayMs = 86400000;
const rulerSpacing = 72;

// A date in the city's calendar is represented as a UTC day for calendar arithmetic.
// Only the lunar calculation needs the corresponding instant at the city's midnight.
function monthStart(day: number, offset = 0) {
  const date = new Date(day);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + offset, 1);
}

@Component({
  selector: 'cc-moon-detail',
  standalone: true,
  imports: [CalendarSymbolComponent, CalendarNativeTextPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar-moon-detail.component.html',
  styleUrl: './calendar-moon-detail.component.scss',
})
export class CalendarMoonDetailComponent {
  readonly snapshot = input.required<Snapshot>();
  readonly now = input.required<Date>();
  readonly firstWeekday = input.required<number>();
  readonly clock = input.required<(value: string | null | undefined) => string>();
  readonly dismiss = output<void>();
  private readonly local = inject(CalendarLocalization);
  private readonly zone = computed(() => {
    const zone = this.snapshot().place.timezone;
    return zone && zone !== 'auto' ? zone : Intl.DateTimeFormat().resolvedOptions().timeZone;
  });
  readonly today = computed(() => Math.floor(wallDate(this.now(), this.zone()).getTime() / dayMs) * dayMs);
  readonly selected = linkedSignal(() => this.today());
  readonly month = linkedSignal(() => monthStart(this.selected()));
  private readonly forecasts = computed(() =>
    new Map(this.snapshot().skyDays?.map(row => [Date.parse(row.date), row]))
  );
  private readonly formats = computed(() => {
    const locale = this.local.formattingLocale();
    const date = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, {timeZone: 'UTC', ...options});
    return {
      full: calendarDateFormatter(locale, this.local.datePreference(), {weekday:'long', timeZone:'UTC'}), month: date({month: 'long', year: 'numeric'}),
      short: date({weekday: 'short', day: 'numeric'}), weekday: date({weekday: 'narrow'}),
      day: date({day: 'numeric'}),
      event: calendarDateFormatter(locale, this.local.datePreference(), {weekday:'long', timeZone:this.zone(), includeYear:false}),
      percent: new Intl.NumberFormat(locale, {style: 'percent', maximumFractionDigits: 0}),
    };
  });
  readonly title = computed(() => {
    const locale = this.local.formattingLocale();
    const title = this.local.text('MOON PHASE').toLocaleLowerCase(locale);
    return title.charAt(0).toLocaleUpperCase(locale) + title.slice(1);
  });
  private midnight(day: number) {
    const date = instant(new Date(day), this.zone()) ?? instant(new Date(day + 3600000), this.zone());
    return date?.getTime() ?? day;
  }
  private phase(day: number) {
    const provided = this.forecasts().get(day)?.moonPhase;
    return moonPhaseInfo(provided ?? lunarFraction(this.midnight(day)))!;
  }
  readonly summary = computed(() => {
    const day = this.selected(), midnight = this.midnight(day);
    const row = this.forecasts().get(day), formats = this.formats();
    return {
      phase: this.phase(day), date: formats.full(day),
      illumination: formats.percent.format(lunarIllumination(midnight)),
      rise: this.clock()(row?.moonrise), set: this.clock()(row?.moonset),
      events: ([0, 0.5] as const).map(fraction => ({
        phase: moonPhaseInfo(fraction)!, date: formats.event(nextLunarEvent(midnight, fraction)),
      })),
    };
  });
  readonly weekdayHeaders = computed(() =>
    Array.from({length: 7}, (_, i) => this.formats().weekday.format(Date.UTC(2023, 0, 1 + (i + this.firstWeekday()) % 7)))
  );
  readonly monthCells = computed(() => {
    const month = this.month(), next = monthStart(month, 1);
    const leading = (new Date(month).getUTCDay() - this.firstWeekday() + 7) % 7;
    const count = Math.ceil((leading + (next - month) / dayMs) / 7) * 7;
    return Array.from({length: count}, (_, i) => {
      const day = month + (i - leading) * dayMs;
      return {
        day, number: this.formats().day.format(day), date: this.formats().full(day),
        phase: day >= month && day < next ? this.phase(day) : null,
        observed: this.forecasts().get(day)?.moonPhase != null,
      };
    });
  });
  readonly forecastRows = computed(() => this.snapshot().daily.slice(0, 10).map((row, i) => {
    const day = Date.parse(row.iso), sky = this.forecasts().get(day);
    return {day, title: i === 0 ? this.local.text('Today') : this.dayLabel(day),
      phase: this.phase(day), rise: this.clock()(sky?.moonrise), set: this.clock()(sky?.moonset)};
  }));
  private dayLabel(day: number) {
    return day === this.today() ? this.local.text('Today') : this.formats().short.format(day);
  }
  monthTitle(offset = 0) { return this.formats().month.format(monthStart(this.month(), offset)); }
  moveMonth(offset: number) { this.month.update(month => monthStart(month, offset)); }
  select(day: number) {
    this.selected.set(day);
    this.month.set(monthStart(day));
  }

  readonly remainder = signal(0);
  readonly ticks = computed(() => Array.from({length: 9}, (_, i) => {
    const offset = i - 4, day = this.selected() + offset * dayMs;
    return {offset, today: day === this.today(), label: this.dayLabel(day), x: offset * rulerSpacing};
  }));
  private drag?: {id: number; x: number; day: number; direction: number};
  private swipe?: {id: number; x: number; y: number; direction: number};
  private direction(element: HTMLElement) { return getComputedStyle(element).direction === 'rtl' ? -1 : 1; }
  startRuler(event: PointerEvent) {
    if (!event.isPrimary || event.button !== 0) return;
    const el = event.currentTarget as HTMLElement;
    el.setPointerCapture(event.pointerId);
    this.drag = {id: event.pointerId, x: event.clientX, day: this.selected(), direction: this.direction(el)};
  }
  moveRuler(event: PointerEvent) {
    const drag = this.drag;
    if (drag?.id !== event.pointerId) return;
    const dx = event.clientX - drag.x, days = Math.round(-dx * drag.direction / rulerSpacing);
    this.select(drag.day + days * dayMs);
    this.remainder.set(dx + days * drag.direction * rulerSpacing);
  }
  endRuler(event: PointerEvent) {
    if (this.drag?.id !== event.pointerId) return;
    this.drag = undefined;
    this.remainder.set(0);
  }
  rulerKey(event: KeyboardEvent) {
    const direction = this.direction(event.currentTarget as HTMLElement);
    const delta = {ArrowLeft: -direction, ArrowRight: direction, ArrowDown: -1, ArrowUp: 1}[event.key];
    if (delta == null) return;
    event.preventDefault();
    this.select(this.selected() + delta * dayMs);
  }

  startMonth(event: PointerEvent) {
    if (!event.isPrimary || event.button !== 0) return;
    this.swipe = {id: event.pointerId, x: event.clientX, y: event.clientY, direction: this.direction(event.currentTarget as HTMLElement)};
  }
  moveMonthPointer(event: PointerEvent) {
    const swipe = this.swipe;
    if (swipe?.id !== event.pointerId) return;
    const dx = Math.abs(event.clientX - swipe.x);
    if (dx > 30 && dx > Math.abs(event.clientY - swipe.y)) (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }
  endMonth(event: PointerEvent) {
    const swipe = this.swipe;
    this.swipe = undefined;
    if (event.type !== 'pointerup' || swipe?.id !== event.pointerId) return;
    const dx = event.clientX - swipe.x;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(event.clientY - swipe.y)) this.moveMonth(-Math.sign(dx) * swipe.direction);
  }
}
