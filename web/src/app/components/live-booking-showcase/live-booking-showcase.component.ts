import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ActiveLocaleService } from '../../core/active-locale.service';
import { linkPath } from '../../core/locales';
import {
  BookingSlot,
  CalendarPlatformApiService,
  CreatedBookingResponse,
} from '../../core/calendar-platform-api.service';
import {
  COMMON_TIMEZONES,
  IOS_EVENT_COLORS,
  computeIosEventStyle,
  detectBrowserTimeZone,
  downloadIcsFile,
} from '../../core/ios-event-palette';

interface PreviewCalEvent {
  id: string;
  title: string;
  dayIdx: number; // 0, 1, 2
  startMin: number; // minutes from 08:00 (0..600 -> 08:00..18:00)
  durationMin: number;
  color: string;
  tag?: string;
}

const MINI_HOUR_PX = 46;
const BASE_START_HOUR = 8;
const VISIBLE_HOURS = 9; // 08:00 .. 17:00

@Component({
  selector: 'app-live-booking-showcase',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './live-booking-showcase.component.html',
  styleUrl: './live-booking-showcase.component.scss',
})
export class LiveBookingShowcaseComponent implements OnInit {
  @ViewChild('miniCols') miniColsRef?: ElementRef<HTMLElement>;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly active = inject(ActiveLocaleService);
  private readonly api = inject(CalendarPlatformApiService);

  readonly timezones = COMMON_TIMEZONES;
  readonly colors = IOS_EVENT_COLORS;
  readonly miniHours = Array.from({ length: VISIBLE_HOURS }, (_, i) => BASE_START_HOUR + i);
  readonly miniHourPx = MINI_HOUR_PX;

  // Locale-aware trailing-slash routes (validated by tools/postbuild.mjs)
  readonly calendarStudioHref = computed(() => linkPath(this.active.locale(), '/calendar'));
  readonly publishHoursHref = computed(
    () => `${linkPath(this.active.locale(), '/calendar')}?tab=availability`,
  );
  readonly signInHref = computed(
    () => `${linkPath(this.active.locale(), '/calendar')}?signin=1`,
  );
  readonly guestPortalHref = computed(() => linkPath(this.active.locale(), '/bookings'));
  readonly fullBookDemoHref = computed(
    () => `${linkPath(this.active.locale(), '/book')}?u=demo`,
  );

  // ── Left Card: Live Homepage Booking Form ─────────────────────────────────
  readonly demoTypes = [
    { id: 'mt_15', name: '15m Intro Call', duration: 15, color: '#38E0F0' },
    { id: 'mt_30', name: '30m Product Sync', duration: 30, color: '#0A84FF' },
    { id: 'mt_60', name: '60m Deep Dive', duration: 60, color: '#BF5AF2' },
  ];
  readonly selectedTypeId = signal('mt_30');
  readonly guestTz = signal(detectBrowserTimeZone());
  readonly liveSlots = signal<BookingSlot[]>([]);
  readonly loadingSlots = signal(false);
  readonly pickedSlot = signal<BookingSlot | null>(null);
  readonly guestName = signal('');
  readonly guestEmail = signal('');
  readonly guestNotes = signal('');
  readonly bookingBusy = signal(false);
  readonly bookingError = signal<string | null>(null);
  readonly bookedResult = signal<CreatedBookingResponse | null>(null);

  // ── Right Card: Interactive Mini Drag & Drop Calendar ─────────────────────
  readonly miniDays = ['TODAY', 'TOMORROW', 'THU'];
  readonly miniEvents = signal<PreviewCalEvent[]>([
    {
      id: 'p1',
      title: 'Design System Sync',
      dayIdx: 0,
      startMin: 60, // 09:00
      durationMin: 60,
      color: '#0A84FF',
      tag: 'Google Meet',
    },
    {
      id: 'p2',
      title: 'Booked: Elena Petrova',
      dayIdx: 1,
      startMin: 150, // 10:30
      durationMin: 50,
      color: '#30D158',
      tag: 'BOOKED',
    },
    {
      id: 'p3',
      title: 'iOS CloudCalendars Roadmap',
      dayIdx: 2,
      startMin: 240, // 12:00
      durationMin: 70,
      color: '#BF5AF2',
      tag: 'Teams',
    },
    {
      id: 'p4',
      title: 'Client Onboarding',
      dayIdx: 0,
      startMin: 310, // 13:10
      durationMin: 50,
      color: '#FF9F0A',
    },
  ]);

  readonly quickTitle = signal('');
  readonly quickColor = signal('#38E0F0');
  readonly dragHint = signal('Drag any event across hours & days — or pull the circular handles to resize');

  private activeMiniDrag: {
    pointerId: number;
    mode: 'move' | 'resize-start' | 'resize-end';
    eventId: string;
    startX: number;
    startY: number;
    origDay: number;
    origStart: number;
    origDur: number;
    colW: number;
  } | null = null;
  readonly draggingId = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    if (!this.isBrowser) return;
    await this.loadHomepageSlots();
  }

  async pickDemoType(id: string): Promise<void> {
    this.selectedTypeId.set(id);
    this.pickedSlot.set(null);
    this.bookedResult.set(null);
    await this.loadHomepageSlots();
  }

  async loadHomepageSlots(): Promise<void> {
    this.loadingSlots.set(true);
    try {
      const res = await this.api.getPublicBookingSlots('demo', {
        type: this.selectedTypeId(),
      });
      const upcoming = (res.slots ?? []).slice(0, 8);
      this.liveSlots.set(upcoming);
      if (upcoming.length && !this.pickedSlot()) {
        this.pickedSlot.set(upcoming[0]);
      }
    } catch {
      // Fallback local demo slots if network unreachable
      const base = new Date();
      base.setMinutes(0, 0, 0);
      const fallback = Array.from({ length: 6 }, (_, i) => {
        const s = new Date(base.getTime() + (i + 2) * 3_600_000);
        const e = new Date(s.getTime() + 30 * 60_000);
        return { start: s.toISOString(), end: e.toISOString() };
      });
      this.liveSlots.set(fallback);
      this.pickedSlot.set(fallback[0]);
    } finally {
      this.loadingSlots.set(false);
    }
  }

  formatSlotChip(slot: BookingSlot): string {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: this.guestTz(),
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(new Date(slot.start));
    } catch {
      return slot.start.slice(11, 16);
    }
  }

  async submitQuickBooking(): Promise<void> {
    this.bookingError.set(null);
    const slot = this.pickedSlot();
    const name = this.guestName().trim();
    const email = this.guestEmail().trim().toLowerCase();
    if (!slot) {
      this.bookingError.set('Please select an available time slot.');
      return;
    }
    if (!name || !email.includes('@')) {
      this.bookingError.set('Enter your name and email to receive the .ics calendar invite.');
      return;
    }

    this.bookingBusy.set(true);
    try {
      const res = await this.api.createPublicBooking('demo', {
        typeId: this.selectedTypeId(),
        start: slot.start,
        name,
        email,
        timeZone: this.guestTz(),
        notes: this.guestNotes().trim() || undefined,
      });
      this.bookedResult.set(res);

      // Also drop the newly booked appointment onto the interactive mini calendar preview!
      const chosenType = this.demoTypes.find((t) => t.id === this.selectedTypeId());
      this.miniEvents.update((list) => [
        ...list,
        {
          id: `bk_${Date.now()}`,
          title: `Booked: ${name}`,
          dayIdx: 1,
          startMin: 220,
          durationMin: chosenType?.duration ?? 30,
          color: chosenType?.color ?? '#30D158',
          tag: 'NEW BOOKING',
        },
      ]);
    } catch (e) {
      this.bookingError.set(e instanceof Error ? e.message : 'Could not complete demo booking.');
    } finally {
      this.bookingBusy.set(false);
    }
  }

  downloadDemoIcs(): void {
    const r = this.bookedResult();
    if (r?.icsContent) {
      downloadIcsFile(r.event.title || 'cloud-calendars-demo', r.icsContent);
    }
  }

  resetDemoForm(): void {
    this.bookedResult.set(null);
    this.guestNotes.set('');
  }

  // ── Mini Drag & Drop Handlers ─────────────────────────────────────────────

  eventsForCol(colIdx: number): PreviewCalEvent[] {
    return this.miniEvents().filter((e) => e.dayIdx === colIdx);
  }

  miniCardStyle(ev: PreviewCalEvent) {
    const isDrag = this.draggingId() === ev.id;
    const st = computeIosEventStyle(ev.color, 'dark');
    return {
      top: `${(ev.startMin / 60) * MINI_HOUR_PX}px`,
      height: `${Math.max(24, (ev.durationMin / 60) * MINI_HOUR_PX - 2)}px`,
      background: isDrag ? st.fillDragging : st.fill,
      borderColor: st.borderColor,
      color: st.titleColor,
      '--ev-accent': st.accentBar,
      '--ev-detail': st.detailColor,
    };
  }

  formatMiniSpan(ev: PreviewCalEvent): string {
    const fmt = (offsetMin: number) => {
      const total = BASE_START_HOUR * 60 + offsetMin;
      const h = Math.floor(total / 60);
      const m = total % 60;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };
    return `${fmt(ev.startMin)} – ${fmt(ev.startMin + ev.durationMin)}`;
  }

  onMiniPointerDown(
    pe: PointerEvent,
    item: PreviewCalEvent,
    mode: 'move' | 'resize-start' | 'resize-end',
  ): void {
    if (pe.button !== 0) return;
    pe.stopPropagation();
    pe.preventDefault();

    const colsEl = this.miniColsRef?.nativeElement;
    const colW = colsEl ? colsEl.getBoundingClientRect().width / 3 : 140;
    (pe.currentTarget as HTMLElement)?.setPointerCapture?.(pe.pointerId);

    this.activeMiniDrag = {
      pointerId: pe.pointerId,
      mode,
      eventId: item.id,
      startX: pe.clientX,
      startY: pe.clientY,
      origDay: item.dayIdx,
      origStart: item.startMin,
      origDur: item.durationMin,
      colW,
    };
    this.draggingId.set(item.id);
  }

  @HostListener('window:pointermove', ['$event'])
  onMiniPointerMove(pe: PointerEvent): void {
    const d = this.activeMiniDrag;
    if (!d || pe.pointerId !== d.pointerId) return;

    const dx = pe.clientX - d.startX;
    const dy = pe.clientY - d.startY;
    const snappedMin = Math.round(((dy / MINI_HOUR_PX) * 60) / 10) * 10;
    const maxTotalMin = VISIBLE_HOURS * 60;

    this.miniEvents.update((list) =>
      list.map((ev) => {
        if (ev.id !== d.eventId) return ev;
        if (d.mode === 'move') {
          const dayShift = Math.round(dx / Math.max(60, d.colW));
          const nextDay = Math.max(0, Math.min(2, d.origDay + dayShift));
          const nextStart = Math.max(0, Math.min(maxTotalMin - d.origDur, d.origStart + snappedMin));
          const updated = { ...ev, dayIdx: nextDay, startMin: nextStart };
          this.dragHint.set(
            `${this.miniDays[nextDay]} · ${this.formatMiniSpan(updated)} (10m magnetic snap)`,
          );
          return updated;
        }
        if (d.mode === 'resize-end') {
          const nextDur = Math.max(20, Math.min(maxTotalMin - d.origStart, d.origDur + snappedMin));
          const updated = { ...ev, durationMin: nextDur };
          this.dragHint.set(`Duration: ${nextDur} min · ${this.formatMiniSpan(updated)}`);
          return updated;
        }
        const nextStart = Math.max(0, Math.min(d.origStart + d.origDur - 20, d.origStart + snappedMin));
        const nextDur = d.origStart + d.origDur - nextStart;
        const updated = { ...ev, startMin: nextStart, durationMin: nextDur };
        this.dragHint.set(`Updated start · ${this.formatMiniSpan(updated)}`);
        return updated;
      }),
    );
  }

  @HostListener('window:pointerup', ['$event'])
  onMiniPointerUp(pe: PointerEvent): void {
    if (this.activeMiniDrag && pe.pointerId === this.activeMiniDrag.pointerId) {
      this.activeMiniDrag = null;
      this.draggingId.set(null);
    }
  }

  addQuickPreviewEvent(): void {
    const title = this.quickTitle().trim() || 'New Cloud Event';
    this.miniEvents.update((list) => [
      ...list,
      {
        id: `q_${Date.now()}`,
        title,
        dayIdx: 0,
        startMin: 180,
        durationMin: 50,
        color: this.quickColor(),
      },
    ]);
    this.quickTitle.set('');
    this.dragHint.set(`Added "${title}" — drag it anywhere on the timeline!`);
  }
}
