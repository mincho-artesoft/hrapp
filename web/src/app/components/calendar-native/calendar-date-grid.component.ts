import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  viewChild,
  afterRenderEffect,
  computed,
  inject,
  input,
  output,
  signal,
} from "@angular/core";
import {
  CalendarLocalization,
  CalendarNativeDatePipe,
} from "../../core/calendar-localization";
import { CalendarSymbolComponent } from "./calendar-symbol.component";

const rowHeight = 36;

@Component({
  selector: "cc-date-wheel",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div
    #wheel
    class="wheel"
    role="spinbutton"
    tabindex="0"
    [attr.aria-label]="label()"
    [attr.aria-valuemin]="min()"
    [attr.aria-valuemax]="max()"
    [attr.aria-valuenow]="value()"
    [attr.aria-valuetext]="name(value())"
    (scroll)="scrolled(wheel)"
    (keydown)="key($event, wheel)"
  >
    <div [style.height.px]="(first() - min()) * 36"></div>
    @for (n of rows(); track n) {
      <button
        type="button"
        tabindex="-1"
        [class.selected]="n === value()"
        (click)="go(wheel, n)"
      >
        {{ name(n) }}
      </button>
    }
    <div [style.height.px]="(max() - rows()[rows().length - 1]) * 36"></div>
  </div>`,
  styles: [
    `
      :host {
        display: block;
        min-width: 0;
      }
      .wheel {
        height: 180px;
        padding-block: 72px;
        box-sizing: border-box;
        overflow-y: auto;
        overscroll-behavior: contain;
        scrollbar-width: none;
        scroll-snap-type: y proximity;
      }
      .wheel button {
        display: block;
        width: 100%;
        height: 36px;
        padding: 0;
        border: 0;
        background: none;
        color: var(--cal-muted);
        font: 400 20px var(--font-body);
        scroll-snap-align: center;
        cursor: pointer;
      }
      .wheel button.selected {
        color: var(--cal-text);
      }
    `,
  ],
})
export class CalendarDateWheel {
  label = input.required<string>();
  min = input.required<number>();
  max = input.required<number>();
  value = input.required<number>();
  names = input<string[]>([]);
  changeValue = output<number>();
  private locale = inject(CalendarLocalization);
  private readonly wheel = viewChild.required<ElementRef<HTMLElement>>("wheel");
  first = computed(() => Math.max(this.min(), this.value() - 6));
  rows = computed(() =>
    Array.from(
      { length: Math.min(this.max(), this.value() + 6) - this.first() + 1 },
      (_, i) => this.first() + i,
    ),
  );
  constructor() {
    afterRenderEffect(() => {
      const element = this.wheel().nativeElement,
        selectedIndex = this.value() - this.min();
      if (Math.round(element.scrollTop / rowHeight) !== selectedIndex)
        element.scrollTop = selectedIndex * rowHeight;
    });
  }
  name(n: number) {
    return (
      this.names()[n - this.min()] ??
      n.toLocaleString(this.locale.locale(), { useGrouping: false })
    );
  }
  scrolled(el: HTMLElement) {
    const n = Math.min(
      this.max(),
      Math.max(this.min(), this.min() + Math.round(el.scrollTop / rowHeight)),
    );
    if (n !== this.value()) this.changeValue.emit(n);
  }
  go(el: HTMLElement, n: number) {
    el.scrollTop = (n - this.min()) * rowHeight;
    this.changeValue.emit(n);
  }
  key(e: KeyboardEvent, el: HTMLElement) {
    const delta = { ArrowUp: -1, ArrowDown: 1, PageUp: -5, PageDown: 5 }[e.key];
    if (delta === undefined && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    this.go(
      el,
      e.key === "Home"
        ? this.min()
        : e.key === "End"
          ? this.max()
          : Math.min(this.max(), Math.max(this.min(), this.value() + delta!)),
    );
  }
}

function monthDate(year: number, month: number, day = 1) {
  const date = new Date(2000, 0, 1, 12);
  date.setFullYear(year, month, day);
  return date;
}
function dateKey(date: Date) {
  return [
    String(date.getFullYear()).padStart(4, "0"),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

@Component({
  selector: "cc-date-grid",
  standalone: true,
  imports: [CalendarNativeDatePipe, CalendarSymbolComponent, CalendarDateWheel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./calendar-date-grid.component.html",
  styleUrl: "./calendar-date-grid.component.scss",
})
export class CalendarDateGridComponent {
  readonly start = input.required<string>();
  readonly end = input("");
  readonly minimum = input("");
  readonly firstWeekday = input(0);
  readonly range = input(false);
  readonly choose = output<string>();
  readonly chooseRange = output<{ start: string; end: string }>();
  readonly wheels = signal(false);
  private readonly page = signal<Date | null>(null);
  readonly month = computed(
    () => this.page() ?? new Date(this.start() + "T12:00:00"),
  );
  private readonly locale = inject(CalendarLocalization);
  readonly weekdays = computed(() =>
    Array.from({ length: 7 }, (_, i) =>
      monthDate(2026, 10, 1 + this.firstWeekday() + i),
    ),
  );
  readonly monthNames = computed(() =>
    Array.from({ length: 12 }, (_, i) =>
      monthDate(2020, i).toLocaleString(this.locale.locale(), {
        month: "long",
      }),
    ),
  );
  readonly today = dateKey(new Date());
  readonly days = computed(() => {
    const m = this.month(),
      first = monthDate(m.getFullYear(), m.getMonth());
    const blanks = (first.getDay() - this.firstWeekday() + 7) % 7,
      count = monthDate(m.getFullYear(), m.getMonth() + 1, 0).getDate();
    return Array.from({ length: blanks + count }, (_, i) =>
      i < blanks
        ? null
        : dateKey(monthDate(m.getFullYear(), m.getMonth(), 1 + i - blanks)),
    );
  });
  readonly pending = signal("");
  readonly sweep = signal<{ from: string; to: string } | null>(null);
  readonly from = computed(
    () => this.sweep()?.from || this.pending() || this.start(),
  );
  readonly to = computed(
    () => this.sweep()?.to || (this.pending() ? "" : this.end()),
  );
  private pointer?: { id: number; day: string };
  private ignoreClick = false;
  readonly yearMin = computed(() => (this.range() ? 1970 : 1));
  readonly yearMax = computed(() => (this.range() ? 3000 : 9999));
  setMonth(year: number, month: number) {
    const next = monthDate(year, month);
    if (
      next.getFullYear() >= this.yearMin() &&
      next.getFullYear() <= this.yearMax()
    )
      this.page.set(next);
  }
  step(delta: number) {
    const m = this.month();
    this.setMonth(m.getFullYear(), m.getMonth() + delta);
  }
  select(day: string) {
    if (this.ignoreClick) {
      this.ignoreClick = false;
      return;
    }
    if (!this.range()) {
      this.choose.emit(day);
      return;
    }
    const start = this.pending();
    if (start && day > start) {
      this.pending.set("");
      this.chooseRange.emit({ start, end: day });
    } else this.pending.set(day);
  }
  begin(e: PointerEvent) {
    this.ignoreClick = false;
    if (!this.range() || !e.isPrimary || e.button !== 0) return;
    const day = (e.target as Element).closest<HTMLElement>("[data-day]")
      ?.dataset["day"];
    if (day) this.pointer = { id: e.pointerId, day };
  }
  move(e: PointerEvent) {
    if (this.pointer?.id !== e.pointerId) return;
    const grid = e.currentTarget as HTMLElement;
    const cell = grid.ownerDocument
      .elementFromPoint(e.clientX, e.clientY)
      ?.closest<HTMLElement>("[data-day]");
    const day = cell?.dataset["day"],
      origin = this.pointer.day;
    if (
      !cell ||
      !day ||
      !grid.contains(cell) ||
      (!this.sweep() && day === origin)
    )
      return;
    if (!grid.hasPointerCapture(e.pointerId))
      grid.setPointerCapture(e.pointerId);
    this.sweep.set({
      from: origin < day ? origin : day,
      to: origin < day ? day : origin,
    });
  }
  finish(e: PointerEvent) {
    if (this.pointer?.id !== e.pointerId) return;
    this.move(e);
    const sweep = this.sweep();
    this.cancel();
    if (sweep && sweep.from !== sweep.to) {
      this.ignoreClick = true;
      this.pending.set("");
      this.chooseRange.emit({ start: sweep.from, end: sweep.to });
    }
  }
  cancel() {
    this.pointer = undefined;
    this.sweep.set(null);
  }
}
