import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { CalendarLocalization, CalendarNativeTextPipe } from '../../core/calendar-localization';
import type { CalendarRepeatRule } from '../../core/calendar-platform-api.service';
import { CalendarChoiceComponent } from './calendar-choice.component';
import { CalendarRepeatWheelComponent } from './calendar-repeat-wheel.component';
import { CalendarSymbolComponent } from './calendar-symbol.component';

@Component({
  selector: 'cc-repeat',
  standalone: true,
  imports: [CalendarNativeTextPipe, CalendarSymbolComponent, CalendarChoiceComponent, CalendarRepeatWheelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar-repeat.component.html',
  styleUrl: './calendar-repeat.component.scss',
})
export class CalendarRepeatComponent {
  readonly singleMonthDay = input(false);
  readonly firstWeekday = input(0);
  readonly rule = input.required<CalendarRepeatRule>();
  readonly start = input.required<string>();
  readonly ruleChange = output<CalendarRepeatRule>();
  readonly expanded = signal(false);
  private readonly localization = inject(CalendarLocalization);
  private readonly locale = this.localization.formattingLocale;
  private readonly startDate = computed(() => new Date(this.start() + 'T12:00'));
  readonly frequencies = ['Daily', 'Weekly', 'Monthly', 'Yearly'].map(label => ({label, value: label.toLowerCase()}));
  readonly weekdays = computed(() => this.dateOptions('weekday', 'long'));
  readonly orderedWeekdays = computed(() => [...this.weekdays().slice(this.firstWeekday()), ...this.weekdays().slice(0, this.firstWeekday())]);
  readonly months = computed(() => this.dateOptions('month', 'short'));
  private readonly longMonths = computed(() => this.dateOptions('month', 'long'));
  private readonly numbers = computed(() => new Intl.NumberFormat(this.locale(), {useGrouping: false}));
  readonly monthDays = Array.from({length: 31}, (_, index) => index + 1);
  readonly intervals = computed(() => Array.from({length: 999}, (_, i) => ({value: i + 1, label: this.number(i + 1)})));
  readonly interval = computed(() => this.rule().interval || 1);
  private readonly formatter = computed(() => new Intl.NumberFormat(this.locale(), {
    style: 'unit', unitDisplay: 'long', unit: {daily: 'day', weekly: 'week', monthly: 'month', yearly: 'year'}[this.rule().frequency],
  }));
  readonly unit = computed(() => this.formatter().formatToParts(this.interval()).find(part => part.type === 'unit')?.value ?? '');
  readonly intervalLabel = computed(() => this.interval() === 1 ? this.capitalize(this.unit()) : this.formatter().format(this.interval()));
  readonly selectedWeekdays = computed(() => this.rule().daysOfTheWeek?.map(d => d.weekday) ?? [this.startDate().getDay() + 1]);
  readonly selectedMonthDays = computed(() => this.rule().daysOfTheMonth ?? [this.startDate().getDate()]);
  readonly selectedMonths = computed(() => this.rule().monthsOfTheYear ?? [this.startDate().getMonth() + 1]);
  readonly usesOrdinal = computed(() => !!this.rule().daysOfTheWeek?.length);
  readonly ordinals = computed(() => [1, 2, 3, 4, 5, -1, -2].map(value => ({value, label: this.capitalize(this.ordinalName(value))})));
  readonly position = computed(() => this.rule().setPositions?.[0] || this.rule().daysOfTheWeek?.[0]?.weekNumber || 1);
  readonly ordinalDays = computed(() => [...this.weekdays(), ...['Day', 'Weekday', 'Weekend day'].map((key,i) => ({value: 8 + i, label: this.localization.text(key)}))]);
  readonly ordinalDay = computed(() => {
    const days = this.selectedWeekdays();
    if (days.length === 7) return 8;
    if (days.length === 5 && days.every(d => d >= 2 && d <= 6)) return 9;
    if (days.length === 2 && days.includes(1) && days.includes(7)) return 10;
    return days[0];
  });

  private dateOptions(unit: 'weekday' | 'month', width: 'short' | 'long') {
    const format = new Intl.DateTimeFormat(this.locale(), {[unit]: width});
    return Array.from({length: unit === 'weekday' ? 7 : 12}, (_, i) => ({
      value: i + 1, label: format.format(unit === 'weekday' ? new Date(2023, 0, 1 + i) : new Date(2023, i, 1)),
    }));
  }
  number(value: number) { return this.numbers().format(value); }
  private capitalize(text: string) { return text.slice(0, 1).toLocaleUpperCase(this.locale()) + text.slice(1); }
  private translation(key: string, fallback = key) {
    const lookup = 'repeat.' + key;
    const value = this.localization.text(lookup);
    return value === lookup ? fallback : value;
  }
  private ordinalName(value: number) {
    if (value < 0) return this.translation(value === -2 ? 'next to last' : 'last');
    const category = new Intl.PluralRules('en', {type: 'ordinal'}).select(value);
    const suffix = {one: 'st', two: 'nd', few: 'rd'}[category as 'one'|'two'|'few'] ?? 'th';
    return this.translation('ordinal.' + value, this.number(value) + suffix);
  }
  private list(values: string[]) { return new Intl.ListFormat(this.locale()).format(values); }
  private sentence(single: string, multiple: string, ...args: string[]) {
    const n = this.interval();
    let template = this.translation(single);
    if (n > 1) {
      const key = multiple === 'Event will occur every %ld years on the %@ %@ %@.' ? 'every n years on a specific day of months' : multiple;
      template = this.translation(key + '#' + new Intl.PluralRules(this.locale()).select(n), this.translation(key + '#other', multiple));
      args.unshift(this.number(n));
    }
    let index = 0;
    return template.replace(/%(?:(\d+)\$)?(?:ld|@)/g, (_, position) => args[position ? Number(position) - 1 : index++] ?? '');
  }
  readonly summary = computed(() => {
    const start = this.startDate(), frequency = this.rule().frequency;
    if (frequency === 'daily') return this.sentence('Event will occur every day.', 'Event will occur every %ld days.');
    if (frequency === 'weekly') {
      const days = this.orderedWeekdays().filter(day => this.selectedWeekdays().includes(day.value));
      if (this.interval() === 1 && days.length === 7) return this.translation('Event will occur every day.');
      if (this.interval() === 1 && days.length === 5 && days.every(d => d.value >= 2 && d.value <= 6)) return this.translation('Event will occur every weekday.');
      if (!days.length || (days.length === 1 && days[0].value === start.getDay() + 1))
        return this.sentence('Event will occur every week.', 'Event will occur every %ld weeks.');
      return this.sentence('Event will occur every week on %@.', 'Event will occur every %ld weeks on %@.', this.list(days.map(d => d.label)));
    }
    const day = this.ordinalDay();
    const dayName = day <= 7 ? this.weekdays()[day - 1]?.label : this.translation(['day','weekday','weekend day'][day - 8]);
    if (frequency === 'monthly') {
      if (this.usesOrdinal()) return this.sentence('Event will occur every month on the %@ %@.', 'Event will occur every %ld months on the %@ %@.', this.ordinalName(this.position()), dayName);
      const days = [...this.selectedMonthDays()].filter(d => d >= 1 && d <= 31).sort((a,b) => a-b);
      if (!days.length || (days.length === 1 && days[0] === start.getDate())) return this.sentence('Event will occur every month.', 'Event will occur every %ld months.');
      const ordinals = this.translation('1: ordinal | 0: cardinal', '1') === '1';
      return this.sentence('Event will occur every month on the %@.', 'Event will occur every %ld months on the %@.', this.list(days.map(d => ordinals ? this.ordinalName(d) : this.number(d))));
    }
    const months = this.longMonths().filter(m => this.selectedMonths().includes(m.value));
    if (this.usesOrdinal()) {
      const [first, ...rest] = months.length ? months : [this.longMonths()[start.getMonth()]];
      const english = new Intl.DateTimeFormat('en', {month:'long'}).format(new Date(2023, first.value-1, 1));
      const mark = '{first-month}';
      const [prefix, tail] = this.list([mark, ...rest.map(m => m.label)]).split(mark);
      const qualified = prefix + this.translation('of ' + english + '%@').replace(/%(?:1\$)?@/, tail);
      return this.sentence('Event will occur every year on the %@ %@ %@.', 'Event will occur every %ld years on the %@ %@ %@.', this.ordinalName(this.position()), dayName, qualified);
    }
    if (!months.length || (months.length === 1 && months[0].value === start.getMonth() + 1)) return this.sentence('Event will occur every year.', 'Event will occur every %ld years.');
    return this.sentence('Event will occur every year in %@.', 'Event will occur every %ld years in %@.', this.list(months.map(m => m.label)));
  });

  patch(values: Partial<CalendarRepeatRule>) { this.ruleChange.emit({...this.rule(), ...values}); }
  frequency(value: string) {
    if (value === this.rule().frequency) return;
    const {interval, endDate, occurrenceCount} = this.rule();
    this.ruleChange.emit({frequency: value as CalendarRepeatRule['frequency'], interval, endDate, occurrenceCount});
  }
  private toggle(values: number[], value: number) {
    const next = values.includes(value) ? values.filter(v => v !== value) : [...values, value];
    return next.length ? next.sort((a,b) => a-b) : values;
  }
  toggleWeekday(value: number) { this.patch({daysOfTheWeek: this.toggle(this.selectedWeekdays(), value).map(weekday => ({weekday}))}); }
  toggleMonthDay(value: number) { this.patch({daysOfTheMonth: this.singleMonthDay() ? [value] : this.toggle(this.selectedMonthDays(), value)}); }
  toggleMonth(value: number) { this.patch({monthsOfTheYear: this.singleMonthDay() ? [value] : this.toggle(this.selectedMonths(), value)}); }
  ordinal(enabled: boolean) {
    if (this.usesOrdinal() === enabled) return;
    this.patch({daysOfTheWeek: enabled ? [{weekday:this.startDate().getDay()+1}] : undefined, setPositions: enabled ? [1] : undefined, daysOfTheMonth: undefined});
  }
  setOrdinal(position: number, day: number) {
    const days = day === 8 ? [1,2,3,4,5,6,7] : day === 9 ? [2,3,4,5,6] : day === 10 ? [1,7] : [day];
    this.patch({daysOfTheWeek: days.map(weekday => ({weekday})), setPositions: [position]});
  }
}
