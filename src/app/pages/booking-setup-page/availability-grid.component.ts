import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  input,
  model,
  signal,
} from '@angular/core';

/** One opening: JS weekday 0–6 (Sun–Sat), start/end minutes from local midnight. */
export interface AvailabilityWindow {
  day: number;
  start: number;
  end: number;
}

interface Placed {
  ref: AvailabilityWindow;
  top: number;
  height: number;
  label: string;
}

const ROW_H = 44; // px per hour
const SNAP = 30; // minutes
const MIN_LEN = 30; // shortest window

/**
 * A week-at-a-glance availability editor, drawn like the app's MultiDayView:
 * seven day columns over an hour grid, openings as draggable blocks. The owner
 * drags on an empty column to add hours and taps × to remove them — the same
 * gesture language as laying an event on a calendar, rather than a list of
 * time fields. Emits the flat {day,start,end} rules the booking API already
 * speaks, so nothing downstream changes.
 */
@Component({
  selector: 'app-availability-grid',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './availability-grid.component.html',
  styleUrl: './availability-grid.component.scss',
})
export class AvailabilityGridComponent {
  /** Two-way: the openings, in the API's own shape. */
  readonly windows = model<AvailabilityWindow[]>([]);
  /** Weekday names, Monday-first, localized by the caller. */
  readonly dayLabels = input<string[]>([]);
  readonly hint = input<string>('');

  protected readonly ROW_H = ROW_H;
  /** Columns in Monday-first reading order, carrying the API's 0–6 day number. */
  protected readonly order = [1, 2, 3, 4, 5, 6, 0];

  /** The provisional block being dragged, if any. */
  private readonly draft = signal<AvailabilityWindow | null>(null);
  private activeCol: HTMLElement | null = null;
  private downY = 0;
  private moved = false;

  /** Hour range shown: a sensible default, widened to hold any existing window. */
  protected readonly range = computed(() => {
    let min = 8 * 60;
    let max = 20 * 60;
    for (const w of this.windows()) {
      min = Math.min(min, w.start);
      max = Math.max(max, w.end);
    }
    const d = this.draft();
    if (d) {
      min = Math.min(min, d.start);
      max = Math.max(max, d.end);
    }
    const startH = Math.max(0, Math.floor(min / 60) - 1);
    const endH = Math.min(24, Math.ceil(max / 60) + 1);
    return { startH, endH, hours: Array.from({ length: endH - startH + 1 }, (_, i) => startH + i) };
  });

  protected readonly gridHeight = computed(() => {
    const { startH, endH } = this.range();
    return (endH - startH) * ROW_H;
  });

  protected placed(day: number): Placed[] {
    const startMin = this.range().startH * 60;
    const out: Placed[] = [];
    for (const w of this.windows()) {
      if (w.day !== day) continue;
      out.push({
        ref: w,
        top: ((w.start - startMin) / 60) * ROW_H,
        height: Math.max(18, ((w.end - w.start) / 60) * ROW_H),
        label: `${this.hhmm(w.start)} – ${this.hhmm(w.end)}`,
      });
    }
    const d = this.draft();
    if (d && d.day === day) {
      const s = Math.min(d.start, d.end);
      const e = Math.max(d.start, d.end);
      out.push({
        ref: d,
        top: ((s - startMin) / 60) * ROW_H,
        height: Math.max(6, ((e - s) / 60) * ROW_H),
        label: `${this.hhmm(s)} – ${this.hhmm(e)}`,
      });
    }
    return out;
  }

  protected isDraft(p: Placed): boolean {
    return p.ref === this.draft();
  }

  // --- drag to create ---
  protected onDown(ev: PointerEvent, day: number): void {
    // Ignore drags that begin on a remove button.
    if ((ev.target as HTMLElement).closest('.avg__x')) return;
    const col = ev.currentTarget as HTMLElement;
    this.activeCol = col;
    this.downY = ev.clientY;
    this.moved = false;
    const minute = this.minuteAt(ev.clientY, col);
    this.draft.set({ day, start: minute, end: minute + SNAP });
    try {
      col.setPointerCapture(ev.pointerId);
    } catch {
      /* capture is a nicety; dragging still works without it */
    }
    ev.preventDefault();
  }

  protected onMove(ev: PointerEvent): void {
    const d = this.draft();
    if (!d || !this.activeCol) return;
    if (Math.abs(ev.clientY - this.downY) > 4) this.moved = true;
    this.draft.set({ ...d, end: this.minuteAt(ev.clientY, this.activeCol) });
  }

  protected onUp(): void {
    const d = this.draft();
    this.draft.set(null);
    this.activeCol = null;
    if (!d) return;

    let start = Math.min(d.start, d.end);
    let end = Math.max(d.start, d.end);
    // A tap (no real drag) drops a default one-hour opening.
    if (!this.moved || end - start < MIN_LEN) end = start + 60;
    end = Math.min(end, 24 * 60);
    this.commit({ day: d.day, start, end });
  }

  protected remove(w: AvailabilityWindow): void {
    this.windows.set(this.windows().filter((x) => x !== w));
  }

  /** Adds a window, merging it with any it overlaps on the same day. */
  private commit(w: AvailabilityWindow): void {
    const sameDay = this.windows().filter((x) => x.day === w.day);
    const others = this.windows().filter((x) => x.day !== w.day);
    let start = w.start;
    let end = w.end;
    const disjoint: AvailabilityWindow[] = [];
    for (const x of sameDay) {
      if (x.end < start || x.start > end) {
        disjoint.push(x);
      } else {
        start = Math.min(start, x.start);
        end = Math.max(end, x.end);
      }
    }
    const merged = [...others, ...disjoint, { day: w.day, start, end }];
    merged.sort((a, b) => a.day - b.day || a.start - b.start);
    this.windows.set(merged);
  }

  private minuteAt(clientY: number, col: HTMLElement): number {
    const rect = col.getBoundingClientRect();
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
    const raw = this.range().startH * 60 + (y / ROW_H) * 60;
    return Math.max(0, Math.min(24 * 60, Math.round(raw / SNAP) * SNAP));
  }

  protected hhmm(min: number): string {
    return `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
  }
  protected hourLabel(h: number): string {
    return `${String(h).padStart(2, '0')}:00`;
  }
}
