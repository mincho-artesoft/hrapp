import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  computed,
  input,
  output,
  signal,
} from "@angular/core";
import {
  CalendarNativeDatePipe,
  CalendarNativeTextPipe,
} from "../../core/calendar-localization";

function offsetDay(date: Date, offset: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + offset);
}

@Component({
  selector: "cc-week-strip",
  standalone: true,
  imports: [CalendarNativeDatePipe, CalendarNativeTextPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <div
    class="week-carousel"
    role="group"
    [attr.aria-label]="'Choose day' | nativeText"
    (pointerdown)="begin($event)"
    (pointermove)="move($event)"
    (pointerup)="finish($event)"
    (pointercancel)="reset()"
    (lostpointercapture)="lostCapture($event)"
    (wheel)="wheel($event)"
    (keydown)="key($event)"
  >
    <div
      class="track"
      [style.transform]="transform()"
      [class.settling]="settling()"
    >
      @for (day of days(); track day.getTime(); let i = $index) {
        <button
          type="button"
          class="week-day"
          [disabled]="!canSelect(day)"
          [attr.tabindex]="i >= 7 && i < 14 ? 0 : -1"
          [attr.aria-hidden]="i < 7 || i >= 14 ? true : null"
          [attr.aria-label]="day | nativeDate: 'fullDate'"
          [attr.aria-pressed]="same(day, selected())"
          [class.selected]="same(day, selected())"
          [class.today]="same(day, today())"
          (click)="select(day)"
        >
          <small>{{ day | nativeDate: "EEEEE" }}</small
          ><span>{{ day.getDate() }}</span>
        </button>
      }
    </div>
  </div>`,
  styles: [
    `
      :host {
        display: block;
        flex: none;
      }
      .week-carousel {
        position: relative;
        height: 70px;
        overflow: hidden;
        user-select: none;
        touch-action: pan-y;
      }
      .track {
        display: flex;
        height: 100%;
        width: 300%;
        position: absolute;
        inset-block: 0;
        left: -100%;
        will-change: transform;
      }
      :host-context(.ios-layout) {
        --week-today: #ff3b30;
      }
      :host-context(.ios-layout:not(.studio--light)) {
        --week-today: #ff453a;
      }
      .track.settling {
        transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
      }
      @media (prefers-reduced-motion: reduce) {
        .track.settling {
          transition: none;
        }
      }
      .week-day {
        flex: 1 0 0;
        min-width: 0;
        position: relative;
        padding: 0;
        background: transparent;
        border: 0;
        color: var(--cal-text);
        font: inherit;
        cursor: pointer;
      }
      .week-day small,
      .week-day span {
        display: grid;
        place-items: center;
        position: absolute;
        inset-inline: 0;
        margin: auto;
      }
      .week-day small {
        top: 0;
        height: 50%;
        font-size: 12px;
        font-weight: 400;
        text-transform: uppercase;
        color: var(--cal-muted);
      }
      .week-day span {
        top: calc(50% - 2px);
        width: 35px;
        height: 35px;
        border-radius: 50%;
        font-size: 18px;
        font-weight: 600;
      }
      .week-day.selected small {
        color: var(--cal-text);
      }
      .week-day.today small,
      .week-day.today span {
        color: var(--week-today, #ff596b);
      }
      .week-day.selected span {
        background: var(--cal-blue);
        color: white;
      }
      .week-day.selected.today span {
        background: var(--week-today, #ff596b);
      }
      .week-day:disabled {
        opacity: .4;
        pointer-events: none;
      }
    `,
  ],
})
export class CalendarWeekStripComponent implements OnDestroy {
  selected = input.required<Date>();
  today = input.required<Date>();
  firstWeekday = input(0);
  availableDays = input<readonly Date[]>();
  choose = output<Date>();
  days = computed(() => {
    const date = this.selected(),
      first = (date.getDay() - this.firstWeekday() + 7) % 7;
    return Array.from({ length: 21 }, (_, i) => offsetDay(date, i - 7 - first));
  });
  same(a: Date, b: Date) {
    return a.toDateString() === b.toDateString();
  }
  canSelect(day: Date) {
    return this.availableDays()?.some(date => this.same(date, day)) ?? true;
  }
  private destination(offset: number): Date {
    const selected = this.selected();
    const target = offsetDay(selected, offset);
    if (this.canSelect(target)) return target;
    if (Math.abs(offset) !== 7) return selected;
    // A forecast can end in the middle of the destination week.
    const first = offsetDay(target, -((target.getDay() - this.firstWeekday() + 7) % 7));
    const next = offsetDay(first, 7);
    const offered = this.availableDays()?.filter(day => day >= first && day < next) ?? [];
    if (!offered.length) return selected;
    return offered.reduce((nearest, day) =>
      Math.abs(day.getTime() - target.getTime()) < Math.abs(nearest.getTime() - target.getTime()) ? day : nearest
    );
  }
  offset = signal(0);
  settling = signal(false);
  transform = computed(() => "translateX(" + this.offset() + "px)");
  private pointer?: { id: number; x: number };
  private timer?: ReturnType<typeof setTimeout>;
  private suppressClick = false;

  begin(e: PointerEvent) {
    if (!e.isPrimary || e.button !== 0) return;
    this.reset();
    this.suppressClick = false;
    this.pointer = { id: e.pointerId, x: e.clientX };
  }
  move(e: PointerEvent) {
    if (this.pointer?.id !== e.pointerId) return;
    const strip = e.currentTarget as HTMLElement,
      delta = e.clientX - this.pointer.x;
    if (!this.suppressClick && Math.abs(delta) <= 4) return;
    this.suppressClick = true;
    if (!strip.hasPointerCapture(e.pointerId))
      strip.setPointerCapture(e.pointerId);
    this.offset.set(
      Math.max(-strip.clientWidth, Math.min(strip.clientWidth, delta)),
    );
  }
  finish(e: PointerEvent) {
    if (this.pointer?.id !== e.pointerId) return;
    this.move(e);
    this.pointer = undefined;
    if (this.suppressClick) this.settle(e.currentTarget as HTMLElement);
  }
  lostCapture(e: PointerEvent) {
    if (this.pointer && e.target === e.currentTarget) this.reset();
  }
  wheel(e: WheelEvent) {
    if (
      this.settling() ||
      this.pointer ||
      Math.abs(e.deltaX) <= Math.abs(e.deltaY)
    )
      return;
    e.preventDefault();
    const strip = e.currentTarget as HTMLElement;
    const scale =
      e.deltaMode === 1 ? 12 : e.deltaMode === 2 ? strip.clientWidth : 1;
    clearTimeout(this.timer);
    this.offset.set(
      Math.max(
        -strip.clientWidth,
        Math.min(strip.clientWidth, this.offset() - e.deltaX * scale),
      ),
    );
    this.timer = setTimeout(() => this.settle(strip), 160);
  }
  private settle(strip: HTMLElement) {
    const distance = this.offset(),
      width = strip.clientWidth;
    const direction =
      Math.abs(distance) > Math.min(50, width * 0.15) ? Math.sign(distance) : 0;
    const rtl = getComputedStyle(strip).direction === "rtl";
    const date = this.destination(direction * (rtl ? 7 : -7));
    const changed = !this.same(date, this.selected());
    this.settling.set(true);
    this.offset.set(changed ? direction * width : 0);
    this.timer = setTimeout(
      () => {
        if (changed) this.choose.emit(date);
        this.reset();
      },
      matchMedia("(prefers-reduced-motion:reduce)").matches ? 0 : 220,
    );
  }
  select(day: Date) {
    if (!this.suppressClick && !this.settling() && this.canSelect(day)) this.choose.emit(day);
    this.suppressClick = false;
  }
  key(e: KeyboardEvent) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    this.reset();
    const strip = e.currentTarget as HTMLElement;
    const direction =
      (e.key === "ArrowLeft" ? -1 : 1) *
      (getComputedStyle(strip).direction === "rtl" ? -1 : 1);
    this.choose.emit(
      this.destination(direction * (e.altKey ? 7 : 1)),
    );
    requestAnimationFrame(() =>
      strip
        .querySelector<HTMLElement>(".selected")
        ?.focus({ preventScroll: true }),
    );
  }
  reset() {
    clearTimeout(this.timer);
    this.pointer = undefined;
    this.settling.set(false);
    this.offset.set(0);
  }
  ngOnDestroy() {
    clearTimeout(this.timer);
  }
}
