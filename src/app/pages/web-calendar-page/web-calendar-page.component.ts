import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { SeoService } from '../../core/seo.service';
import { DEFAULT_LOCALE, LOCALES, Locale, linkPath, localePath } from '../../core/locales';
import {
  BookingInviteLink,
  BookingScheduleConfig,
  CalendarPlatformApiService,
  ExternalBusyState,
  HostBookingItem,
  MeetingTypeConfig,
  TimeWindow,
  WebCalendarEvent,
} from '../../core/calendar-platform-api.service';
import {
  COMMON_TIMEZONES,
  IOS_EVENT_COLORS,
  PositionedTimedBlock,
  computeIosEventStyle,
  detectBrowserTimeZone,
  downloadIcsFile,
  buildSingleEventIcs,
  generateQrSvgDataUrl,
  layoutTimedBlocks,
} from '../../core/ios-event-palette';
import { PlatformAuthCardComponent } from '../../components/platform-auth-card/platform-auth-card.component';

type StudioTab = 'calendar' | 'availability' | 'incoming';
type CalendarViewMode = 'day' | 'workweek' | 'week' | 'month' | 'agenda';

interface DragSession {
  mode: 'move' | 'resize-start' | 'resize-end' | 'create';
  pointerId: number;
  eventId?: string;
  originStartMs: number;
  originEndMs: number;
  originDayIdx: number;
  startClientX: number;
  startClientY: number;
  dayColWidth: number;
  previewDayIdx: number;
  previewStartMin: number;
  previewEndMin: number;
  hasMoved: boolean;
}

interface EventDraft {
  id: string;
  isNew: boolean;
  title: string;
  color: string;
  allDay: boolean;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  timeZone: string;
  availability: 'busy' | 'free' | 'tentative';
  location: string;
  videoCallURL: string;
  notes: string;
  recurrence: 'none' | 'daily' | 'weekly' | 'monthly';
  reminderMin: number; // -1 for none
  isBookedMeeting: boolean;
  guestName?: string;
  guestEmail?: string;
}

const HOUR_PX = 56;
const SNAP_MINUTES = 10;

@Component({
  selector: 'app-web-calendar-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PlatformAuthCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './web-calendar-page.component.html',
  styleUrl: './web-calendar-page.component.scss',
})
export class WebCalendarPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('timelineScroll') timelineScrollRef?: ElementRef<HTMLElement>;
  @ViewChild('daysColumnsEl') daysColumnsRef?: ElementRef<HTMLElement>;

  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  readonly api = inject(CalendarPlatformApiService);

  readonly colors = IOS_EVENT_COLORS;
  readonly timezones = COMMON_TIMEZONES;
  readonly hours = Array.from({ length: 24 }, (_, i) => i);
  readonly hourPx = HOUR_PX;

  protected locale: Locale = DEFAULT_LOCALE;

  // Workspace UI signals
  readonly activeTab = signal<StudioTab>('calendar');
  readonly viewMode = signal<CalendarViewMode>('week');
  readonly surfaceTheme = signal<'dark' | 'light'>('dark');
  readonly showAuthModal = signal(false);
  readonly loadingWorkspace = signal(false);
  readonly toast = signal<{
    message: string;
    undoEventId?: string;
    undoStart?: string;
    undoEnd?: string;
  } | null>(null);
  private toastTimer: any = null;
  private clockTimer: any = null;
  private liveSyncTimer: any = null;
  private liveSyncInFlight = false;
  private lastLiveSyncAt = 0;
  private readonly onVisibilityOrFocus = () => {
    if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
      const elapsed = Date.now() - this.lastLiveSyncAt;
      if (elapsed >= 10_000) {
        this.pollLiveCalendarUpdates(elapsed >= 45_000).catch(() => null);
      }
    }
  };

  // Calendar Data
  readonly anchorDate = signal<Date>(this.startOfLocalDay(new Date()));
  readonly nowTick = signal<Date>(new Date());
  readonly ownedEvents = signal<WebCalendarEvent[]>([]);
  readonly sharedEvents = signal<WebCalendarEvent[]>([]);
  readonly externalBusy = signal<ExternalBusyState>({ updatedAt: null, sources: {}, events: [] });
  readonly calendarTimeZone = signal<string>(detectBrowserTimeZone());

  // Pointer Drag State
  readonly drag = signal<DragSession | null>(null);
  readonly monthDragEventId = signal<string | null>(null);
  readonly monthDropTargetKey = signal<string | null>(null);

  // Event Modal Editor
  readonly editorDraft = signal<EventDraft | null>(null);
  readonly savingEvent = signal(false);

  // External ICS input
  readonly icsFeedInput = signal('');
  readonly syncingExternal = signal<string | null>(null);
  readonly syncFeedback = signal<string | null>(null);

  // Availability & Booking Config State
  readonly bookingConfig = signal<BookingScheduleConfig>(this.createDefaultConfig());
  readonly handleStatus = signal<'idle' | 'checking' | 'available' | 'taken'>('idle');
  readonly handleReason = signal<string | null>(null);
  readonly savingConfig = signal(false);
  readonly configSavedMsg = signal<string | null>(null);
  readonly newOverrideDate = signal('');
  readonly newOverrideClosed = signal(false);
  readonly newOverrideStart = signal('10:00');
  readonly newOverrideEnd = signal('15:00');

  // Expiring Public Invite Links State
  readonly inviteLinks = signal<BookingInviteLink[]>([]);
  readonly inviteLabel = signal('Client Booking Invite');
  readonly inviteExpiresHours = signal<number>(168);
  readonly inviteMaxUses = signal<number>(1);
  readonly inviteMeetingTypeId = signal<string>('');
  readonly creatingInvite = signal(false);

  // Incoming Host Bookings State
  readonly hostBookings = signal<HostBookingItem[]>([]);
  readonly incomingFilter = signal<'upcoming' | 'past' | 'cancelled'>('upcoming');
  readonly rescheduleModalItem = signal<HostBookingItem | null>(null);
  readonly rescheduleNewDate = signal('');
  readonly rescheduleNewTime = signal('10:00');
  readonly rescheduleNote = signal('');

  // Navigation Links (trailing-slash compliant for postbuild)
  readonly homeHref = computed(() => linkPath(this.locale, '/'));
  readonly guestPortalHref = computed(() => linkPath(this.locale, '/bookings'));
  readonly adminHref = computed(() => linkPath(this.locale, '/admin'));

  readonly publicShareUrl = computed(() => {
    const h = this.bookingConfig().handle || 'demo';
    return `https://www.cloud-calendars.com/book/?u=${encodeURIComponent(h)}`;
  });
  readonly publicPreviewHref = computed(() => {
    const h = this.bookingConfig().handle || 'demo';
    return `${linkPath(this.locale, '/book')}?u=${encodeURIComponent(h)}`;
  });
  readonly shareQrDataUrl = computed(() => generateQrSvgDataUrl(this.publicShareUrl()));
  readonly embedSnippet = computed(
    () =>
      `<iframe src="${this.publicShareUrl()}&embed=1" width="100%" height="720" frameborder="0" style="border-radius:16px;border:1px solid rgba(128,128,128,0.2);"></iframe>`,
  );

  // Unified display events across owned + shared + external busy
  readonly allDisplayEvents = computed<WebCalendarEvent[]>(() => {
    const owned = this.ownedEvents()
      .filter((e) => e.status !== 'cancelled')
      .map((e) => ({ ...e, sourceKind: 'owned' as const, readOnly: false }));
    const shared = this.sharedEvents()
      .filter((e) => e.status !== 'cancelled')
      .map((e) => ({ ...e, sourceKind: 'shared' as const, readOnly: true }));
    const ext = (this.externalBusy().events ?? []).map((b) => ({
      id: b.id,
      title: b.title,
      start: b.start,
      end: b.end,
      allDay: b.allDay,
      color: b.color || '#64748B',
      sourceKind: 'external' as const,
      externalSource: b.source,
      readOnly: true,
    }));
    return [...owned, ...shared, ...ext];
  });

  // Visible columns for Day / Workweek / Week
  readonly visibleDays = computed<Date[]>(() => {
    const anchor = this.anchorDate();
    const mode = this.viewMode();
    if (mode === 'day') return [anchor];
    const monday = this.startOfWeekMonday(anchor);
    const count = mode === 'workweek' ? 5 : 7;
    return Array.from({ length: count }, (_, i) => this.addDays(monday, i));
  });

  readonly headerRangeLabel = computed(() => {
    const anchor = this.anchorDate();
    const mode = this.viewMode();
    if (mode === 'month') {
      return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(anchor);
    }
    if (mode === 'day') {
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(anchor);
    }
    const days = this.visibleDays();
    const first = days[0];
    const last = days[days.length - 1];
    const m1 = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(first);
    if (first.getMonth() === last.getMonth() && first.getFullYear() === last.getFullYear()) {
      return `${m1} – ${last.getDate()}, ${last.getFullYear()}`;
    }
    const m2 = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(last);
    return `${m1} – ${m2}`;
  });

  // Mini month 42 cells for sidebar
  readonly miniMonthDays = computed(() => {
    const anchor = this.anchorDate();
    const firstOfMonth = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
    const gridStart = this.startOfWeekMonday(firstOfMonth);
    const todayKey = this.dayKey(this.nowTick());
    const anchorKey = this.dayKey(anchor);
    const events = this.allDisplayEvents();

    return Array.from({ length: 42 }, (_, idx) => {
      const date = this.addDays(gridStart, idx);
      const key = this.dayKey(date);
      const dayStartMs = date.getTime();
      const dayEndMs = dayStartMs + 86_400_000;
      const dots: string[] = [];
      for (const ev of events) {
        const s = Date.parse(ev.start);
        const e = Date.parse(ev.end);
        if (e > dayStartMs && s < dayEndMs) {
          dots.push(ev.color || '#0A84FF');
          if (dots.length >= 3) break;
        }
      }
      return {
        date,
        key,
        dayNum: date.getDate(),
        inMonth: date.getMonth() === anchor.getMonth(),
        isToday: key === todayKey,
        isSelected: key === anchorKey,
        dots,
      };
    });
  });

  // Month view 42 cells with events
  readonly monthGridCells = computed(() => {
    const anchor = this.anchorDate();
    const firstOfMonth = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
    const gridStart = this.startOfWeekMonday(firstOfMonth);
    const todayKey = this.dayKey(this.nowTick());
    const events = this.allDisplayEvents();

    return Array.from({ length: 42 }, (_, idx) => {
      const date = this.addDays(gridStart, idx);
      const key = this.dayKey(date);
      const dayStartMs = date.getTime();
      const dayEndMs = dayStartMs + 86_400_000;
      const cellEvents = events
        .filter((ev) => {
          const s = Date.parse(ev.start);
          const e = Date.parse(ev.end);
          return e > dayStartMs && s < dayEndMs;
        })
        .sort((a, b) => Date.parse(a.start) - Date.parse(b.start));

      return {
        date,
        key,
        dayNum: date.getDate(),
        inMonth: date.getMonth() === anchor.getMonth(),
        isToday: key === todayKey,
        events: cellEvents.slice(0, 4),
        moreCount: Math.max(0, cellEvents.length - 4),
      };
    });
  });

  // Up Next event in sidebar
  readonly upNextEvent = computed(() => {
    const nowMs = this.nowTick().getTime();
    return (
      this.allDisplayEvents()
        .filter((e) => !e.allDay && Date.parse(e.end) > nowMs)
        .sort((a, b) => Date.parse(a.start) - Date.parse(b.start))[0] ?? null
    );
  });

  // Agenda grouped days
  readonly agendaGroups = computed(() => {
    const startMs = this.anchorDate().getTime();
    const endMs = startMs + 30 * 86_400_000;
    const relevant = this.allDisplayEvents()
      .filter((e) => Date.parse(e.end) > startMs && Date.parse(e.start) < endMs)
      .sort((a, b) => Date.parse(a.start) - Date.parse(b.start));

    const map = new Map<string, { date: Date; label: string; events: WebCalendarEvent[] }>();
    for (const ev of relevant) {
      const d = this.startOfLocalDay(new Date(ev.start));
      const k = this.dayKey(d);
      if (!map.has(k)) {
        map.set(k, {
          date: d,
          label: new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          }).format(d),
          events: [],
        });
      }
      map.get(k)!.events.push(ev);
    }
    return [...map.values()];
  });

  // Filtered incoming bookings
  readonly filteredHostBookings = computed(() => {
    const filter = this.incomingFilter();
    const nowMs = Date.now();
    return this.hostBookings().filter((b) => {
      if (filter === 'cancelled') return b.status === 'cancelled';
      if (b.status === 'cancelled') return false;
      const endMs = Date.parse(b.end);
      return filter === 'upcoming' ? endMs >= nowMs : endMs < nowMs;
    });
  });

  readonly currentTimeTopPx = computed(() => {
    const now = this.nowTick();
    return ((now.getHours() * 60 + now.getMinutes()) / 60) * HOUR_PX;
  });

  readonly currentTimeLabel = computed(() => {
    const now = this.nowTick();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });

  readonly weekdayRows = [
    { key: '1', label: 'Monday', short: 'Mon' },
    { key: '2', label: 'Tuesday', short: 'Tue' },
    { key: '3', label: 'Wednesday', short: 'Wed' },
    { key: '4', label: 'Thursday', short: 'Thu' },
    { key: '5', label: 'Friday', short: 'Fri' },
    { key: '6', label: 'Saturday', short: 'Sat' },
    { key: '0', label: 'Sunday', short: 'Sun' },
  ];

  async ngOnInit(): Promise<void> {
    this.locale = (this.route.snapshot.data['locale'] as Locale) ?? DEFAULT_LOCALE;
    this.seo.apply({
      title: 'Web Calendar & Booking Studio — Cloud Calendars',
      description:
        'Interactive drag-and-drop web calendar and online appointment scheduling synced with Cloud Calendars, Google, and Microsoft.',
      path: localePath(this.locale, '/calendar'),
      locale: this.locale,
      noindex: true,
      alternates: LOCALES.map((l) => ({ hreflang: l.hreflang, path: localePath(l, '/calendar') })),
    });

    if (!this.isBrowser) return;

    const qp = this.route.snapshot.queryParamMap;
    // If this window is the Microsoft OAuth PKCE popup landing back on `/calendar/?code=...&state=ms_...`,
    // relay the result immediately to `window.opener` and skip workspace/anonymous session creation!
    const oauthState = qp.get('state') || '';
    if (oauthState.startsWith('ms_') && (qp.has('code') || qp.has('error'))) {
      try {
        window.opener?.postMessage(
          {
            type: 'cc_ms_oauth_callback',
            code: qp.get('code'),
            error: qp.get('error'),
            errorDescription: qp.get('error_description'),
            state: oauthState,
          },
          window.location.origin,
        );
        window.close();
      } catch {
        // Parent polling fallback will close the popup
      }
      return;
    }

    const tabParam = qp.get('tab');
    if (tabParam === 'availability' || tabParam === 'incoming' || tabParam === 'calendar') {
      this.activeTab.set(tabParam);
    }
    if (qp.get('signin') === '1') {
      this.showAuthModal.set(true);
    }

    // Tick current red time line every 30s
    this.clockTimer = setInterval(() => this.nowTick.set(new Date()), 30_000);

    await this.bootstrapSession();

    // Lightweight visibility-aware live sync while user is viewing the site (20s active interval, 0 requests when hidden)
    document.addEventListener('visibilitychange', this.onVisibilityOrFocus);
    window.addEventListener('focus', this.onVisibilityOrFocus);
    this.liveSyncTimer = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        this.pollLiveCalendarUpdates(false).catch(() => null);
      }
    }, 20_000);
  }

  ngOnDestroy(): void {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    if (this.clockTimer) clearInterval(this.clockTimer);
    if (this.liveSyncTimer) clearInterval(this.liveSyncTimer);
    if (this.isBrowser && typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.onVisibilityOrFocus);
      window.removeEventListener('focus', this.onVisibilityOrFocus);
    }
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    setTimeout(() => this.scrollToWorkingHours(), 120);
  }

  private scrollToWorkingHours(): void {
    const el = this.timelineScrollRef?.nativeElement;
    if (el) {
      el.scrollTop = Math.max(0, 8 * HOUR_PX - 24);
    }
  }

  private async bootstrapSession(): Promise<void> {
    this.loadingWorkspace.set(true);
    try {
      await this.api.ensureWorkspaceSession('My Cloud Calendar');
      await this.reloadAllWorkspaceData();
    } catch {
      // Seed rich local preview events if offline
    } finally {
      this.loadingWorkspace.set(false);
    }
  }

  async onAuthSignedIn(): Promise<void> {
    this.showAuthModal.set(false);
    await this.reloadAllWorkspaceData();
    this.showToast('Signed in & synced with your CloudCalendars account.');
  }

  async signOut(): Promise<void> {
    this.api.signOut();
    await this.bootstrapSession();
    this.showToast('Signed out.');
  }

  async reloadAllWorkspaceData(): Promise<void> {
    const [state, cfgWrap, hostBk, invWrap] = await Promise.all([
      this.api.getCalendarState(),
      this.api.getBookingConfig().catch(() => null),
      this.api.getHostBookings().catch(() => ({ bookings: [] })),
      this.api.getBookingInviteLinks().catch(() => ({ links: [] })),
    ]);

    this.ownedEvents.set(state.events ?? []);
    this.sharedEvents.set(state.receivedEvents ?? []);
    this.externalBusy.set(state.externalBusy ?? { updatedAt: null, sources: {}, events: [] });
    if (state.calendar?.timeZone) {
      this.calendarTimeZone.set(state.calendar.timeZone);
    }
    const existingIcs = state.externalBusy?.sources?.['ics']?.icsUrl;
    if (existingIcs) {
      this.icsFeedInput.set(existingIcs);
    }
    if (cfgWrap?.config) {
      this.bookingConfig.set(cfgWrap.config);
    } else if (state.bookingConfig) {
      this.bookingConfig.set(state.bookingConfig);
    }
    this.hostBookings.set(hostBk.bookings ?? []);
    this.inviteLinks.set(invWrap.links ?? []);
    this.lastLiveSyncAt = Date.now();
  }

  /**
   * Silent, zero-flicker background sync while the browser tab is active (`visibilityState === 'visible'`).
   * Skips during active drag/save operations and never overwrites Tab 2 unsaved availability form edits.
   */
  private async pollLiveCalendarUpdates(forceProviderSync = false): Promise<void> {
    if (
      this.liveSyncInFlight ||
      this.loadingWorkspace() ||
      Boolean(this.drag()) ||
      this.savingEvent() ||
      this.savingConfig() ||
      !this.api.isAuthenticated()
    ) {
      return;
    }
    this.liveSyncInFlight = true;
    try {
      const prevBookingIds = new Set(
        this.hostBookings()
          .filter((b) => b.status !== 'cancelled')
          .map((b) => b.bookingId),
      );

      const [state, hostBk, invWrap] = await Promise.all([
        this.api.getCalendarState({ sync: forceProviderSync }),
        this.api.getHostBookings().catch(() => ({ bookings: this.hostBookings() })),
        this.activeTab() === 'availability'
          ? this.api.getBookingInviteLinks().catch(() => ({ links: this.inviteLinks() }))
          : Promise.resolve({ links: this.inviteLinks() }),
      ]);

      // Re-check drag/save guard before applying signal updates
      if (this.drag() || this.savingEvent()) return;

      this.ownedEvents.set(state.events ?? []);
      this.sharedEvents.set(state.receivedEvents ?? []);
      this.externalBusy.set(state.externalBusy ?? { updatedAt: null, sources: {}, events: [] });

      const nextBookings = hostBk.bookings ?? [];
      this.hostBookings.set(nextBookings);
      this.inviteLinks.set(invWrap.links ?? []);
      this.lastLiveSyncAt = Date.now();

      const newArrival = nextBookings.find(
        (b) => b.status !== 'cancelled' && !prevBookingIds.has(b.bookingId),
      );
      if (newArrival) {
        this.showToast(`🔔 New booking arrived: "${newArrival.title}"`);
      }
    } catch {
      // Ignore transient network blips during silent poll
    } finally {
      this.liveSyncInFlight = false;
    }
  }

  // ── Visual Helpers (Exact iOS `EventTimelineColors.swift` math) ──────────

  cardStyle(hex?: string | null, isDragging = false) {
    const st = computeIosEventStyle(hex, this.surfaceTheme());
    return {
      background: isDragging ? st.fillDragging : st.fill,
      borderColor: st.borderColor,
      color: st.titleColor,
      '--ev-accent': st.accentBar,
      '--ev-detail': st.detailColor,
    };
  }

  isTodayDay(d: Date): boolean {
    return this.dayKey(d) === this.dayKey(this.nowTick());
  }

  formatDayHeaderWeek(d: Date): { dow: string; num: number } {
    return {
      dow: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(d).toUpperCase(),
      num: d.getDate(),
    };
  }

  formatHourLabel(h: number): string {
    if (h === 0) return '00:00';
    return `${String(h).padStart(2, '0')}:00`;
  }

  formatMinutesHm(totalMinutes: number): string {
    const clamped = Math.max(0, Math.min(1440, Math.round(totalMinutes)));
    const hh = Math.floor(clamped / 60) % 24;
    const mm = clamped % 60;
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  }

  formatEventTimeSpan(ev: WebCalendarEvent): string {
    if (ev.allDay) return 'All-day';
    const f = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return `${f.format(new Date(ev.start))} – ${f.format(new Date(ev.end))}`;
  }

  formatFullDateTime(iso: string): string {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date(iso));
  }

  allDayEventsForDay(day: Date): WebCalendarEvent[] {
    const startMs = day.getTime();
    const endMs = startMs + 86_400_000;
    return this.allDisplayEvents().filter((ev) => {
      const s = Date.parse(ev.start);
      const e = Date.parse(ev.end);
      const spanHours = (e - s) / 3_600_000;
      return (ev.allDay || spanHours >= 23.9) && e > startMs && s < endMs;
    });
  }

  timedBlocksForDay(day: Date, dayIdx: number): PositionedTimedBlock<WebCalendarEvent>[] {
    const dayStartMs = day.getTime();
    const dayEndMs = dayStartMs + 86_400_000;
    const activeDrag = this.drag();

    const inputs = this.allDisplayEvents()
      .filter((ev) => {
        // If this event is currently being dragged to another day, hide it from its old day column
        if (
          activeDrag &&
          activeDrag.eventId === ev.id &&
          activeDrag.hasMoved &&
          activeDrag.previewDayIdx !== dayIdx
        ) {
          return false;
        }
        const s = Date.parse(ev.start);
        const e = Date.parse(ev.end);
        const spanHours = (e - s) / 3_600_000;
        if (ev.allDay || spanHours >= 23.9) return false;
        return e > dayStartMs && s < dayEndMs;
      })
      .map((ev) => {
        const s = Math.max(dayStartMs, Date.parse(ev.start));
        const e = Math.min(dayEndMs, Date.parse(ev.end));
        let startMinutes = (s - dayStartMs) / 60_000;
        let endMinutes = Math.max(startMinutes + 15, (e - dayStartMs) / 60_000);

        if (activeDrag && activeDrag.eventId === ev.id && activeDrag.hasMoved && activeDrag.previewDayIdx === dayIdx) {
          startMinutes = activeDrag.previewStartMin;
          endMinutes = activeDrag.previewEndMin;
        }
        return {
          id: ev.id,
          startMinutes,
          endMinutes,
          data: ev,
        };
      });

    // Also include an event dragged FROM a different day INTO this dayIdx!
    if (
      activeDrag &&
      activeDrag.eventId &&
      activeDrag.hasMoved &&
      activeDrag.previewDayIdx === dayIdx &&
      activeDrag.originDayIdx !== dayIdx
    ) {
      const movedEv = this.ownedEvents().find((x) => x.id === activeDrag.eventId);
      if (movedEv) {
        inputs.push({
          id: movedEv.id,
          startMinutes: activeDrag.previewStartMin,
          endMinutes: activeDrag.previewEndMin,
          data: movedEv,
        });
      }
    }

    return layoutTimedBlocks(inputs);
  }

  blockPositionStyle(b: PositionedTimedBlock<WebCalendarEvent>, isDragging: boolean) {
    const topPx = (b.startMinutes / 60) * HOUR_PX;
    const heightPx = Math.max(22, ((b.endMinutes - b.startMinutes) / 60) * HOUR_PX - 2);
    return {
      top: `${topPx}px`,
      height: `${heightPx}px`,
      left: `calc(${b.leftPct}% + 2px)`,
      width: `calc(${b.widthPct}% - 4px)`,
      ...this.cardStyle(b.data.color, isDragging),
    };
  }

  // ── 60fps Pointer-Captured Drag, Resize & Slot Creation Engine ───────────

  onEventPointerDown(ev: PointerEvent, item: WebCalendarEvent, dayIdx: number): void {
    if (ev.button !== 0 || item.readOnly) return;
    ev.stopPropagation();

    const dayStartMs = this.visibleDays()[dayIdx].getTime();
    const sMs = Date.parse(item.start);
    const eMs = Date.parse(item.end);
    const startMin = Math.max(0, Math.round((sMs - dayStartMs) / 60_000));
    const durationMin = Math.max(15, Math.round((eMs - sMs) / 60_000));

    const colsEl = this.daysColumnsRef?.nativeElement;
    const colW = colsEl ? colsEl.getBoundingClientRect().width / this.visibleDays().length : 180;

    (ev.currentTarget as HTMLElement)?.setPointerCapture?.(ev.pointerId);

    this.drag.set({
      mode: 'move',
      pointerId: ev.pointerId,
      eventId: item.id,
      originStartMs: sMs,
      originEndMs: eMs,
      originDayIdx: dayIdx,
      startClientX: ev.clientX,
      startClientY: ev.clientY,
      dayColWidth: colW,
      previewDayIdx: dayIdx,
      previewStartMin: startMin,
      previewEndMin: startMin + durationMin,
      hasMoved: false,
    });
  }

  onResizeHandlePointerDown(
    ev: PointerEvent,
    edge: 'resize-start' | 'resize-end',
    item: WebCalendarEvent,
    dayIdx: number,
  ): void {
    if (ev.button !== 0 || item.readOnly) return;
    ev.stopPropagation();
    ev.preventDefault();

    const dayStartMs = this.visibleDays()[dayIdx].getTime();
    const sMs = Date.parse(item.start);
    const eMs = Date.parse(item.end);
    const startMin = Math.max(0, Math.round((sMs - dayStartMs) / 60_000));
    const endMin = Math.min(1440, Math.max(startMin + 15, Math.round((eMs - dayStartMs) / 60_000)));

    (ev.currentTarget as HTMLElement)?.setPointerCapture?.(ev.pointerId);

    this.drag.set({
      mode: edge,
      pointerId: ev.pointerId,
      eventId: item.id,
      originStartMs: sMs,
      originEndMs: eMs,
      originDayIdx: dayIdx,
      startClientX: ev.clientX,
      startClientY: ev.clientY,
      dayColWidth: 180,
      previewDayIdx: dayIdx,
      previewStartMin: startMin,
      previewEndMin: endMin,
      hasMoved: true,
    });
  }

  onDayColumnPointerDown(ev: PointerEvent, dayIdx: number): void {
    if (ev.button !== 0) return;
    const target = ev.target as HTMLElement;
    if (target.closest('.ev-block')) return;

    const colEl = ev.currentTarget as HTMLElement;
    const rect = colEl.getBoundingClientRect();
    const offsetY = Math.max(0, Math.min(rect.height, ev.clientY - rect.top));
    const rawMin = (offsetY / HOUR_PX) * 60;
    const snappedStart = Math.max(
      0,
      Math.min(1410, Math.floor(rawMin / 15) * 15),
    );

    colEl.setPointerCapture?.(ev.pointerId);

    this.drag.set({
      mode: 'create',
      pointerId: ev.pointerId,
      originStartMs: 0,
      originEndMs: 0,
      originDayIdx: dayIdx,
      startClientX: ev.clientX,
      startClientY: ev.clientY,
      dayColWidth: rect.width,
      previewDayIdx: dayIdx,
      previewStartMin: snappedStart,
      previewEndMin: Math.min(1440, snappedStart + 60),
      hasMoved: false,
    });
  }

  @HostListener('window:pointermove', ['$event'])
  onGlobalPointerMove(ev: PointerEvent): void {
    const cur = this.drag();
    if (!cur || ev.pointerId !== cur.pointerId) return;

    const dx = ev.clientX - cur.startClientX;
    const dy = ev.clientY - cur.startClientY;
    const movedEnough = cur.hasMoved || Math.hypot(dx, dy) > 5;
    if (!movedEnough) return;

    const deltaMinRaw = (dy / HOUR_PX) * 60;
    const snappedDelta = Math.round(deltaMinRaw / SNAP_MINUTES) * SNAP_MINUTES;

    if (cur.mode === 'move') {
      const duration = cur.previewEndMin - cur.previewStartMin;
      const dayShift = Math.round(dx / Math.max(60, cur.dayColWidth));
      const nextDayIdx = Math.max(
        0,
        Math.min(this.visibleDays().length - 1, cur.originDayIdx + dayShift),
      );
      const origDayStartMs = this.visibleDays()[cur.originDayIdx].getTime();
      const baseStartMin = Math.round((cur.originStartMs - origDayStartMs) / 60_000);
      const nextStart = Math.max(0, Math.min(1440 - duration, baseStartMin + snappedDelta));
      this.drag.set({
        ...cur,
        hasMoved: true,
        previewDayIdx: nextDayIdx,
        previewStartMin: nextStart,
        previewEndMin: nextStart + duration,
      });
    } else if (cur.mode === 'resize-end') {
      const origDayStartMs = this.visibleDays()[cur.originDayIdx].getTime();
      const baseEndMin = Math.round((cur.originEndMs - origDayStartMs) / 60_000);
      const nextEnd = Math.max(cur.previewStartMin + 15, Math.min(1440, baseEndMin + snappedDelta));
      this.drag.set({
        ...cur,
        hasMoved: true,
        previewEndMin: nextEnd,
      });
    } else if (cur.mode === 'resize-start') {
      const origDayStartMs = this.visibleDays()[cur.originDayIdx].getTime();
      const baseStartMin = Math.round((cur.originStartMs - origDayStartMs) / 60_000);
      const nextStart = Math.max(0, Math.min(cur.previewEndMin - 15, baseStartMin + snappedDelta));
      this.drag.set({
        ...cur,
        hasMoved: true,
        previewStartMin: nextStart,
      });
    } else if (cur.mode === 'create') {
      const anchorMin = cur.previewStartMin;
      const draggedEnd = Math.max(anchorMin + 30, Math.min(1440, anchorMin + 30 + snappedDelta));
      this.drag.set({
        ...cur,
        hasMoved: true,
        previewEndMin: draggedEnd,
      });
    }
  }

  @HostListener('window:pointerup', ['$event'])
  async onGlobalPointerUp(ev: PointerEvent): Promise<void> {
    const cur = this.drag();
    if (!cur || ev.pointerId !== cur.pointerId) return;
    this.drag.set(null);

    if (cur.mode === 'create') {
      const day = this.visibleDays()[cur.previewDayIdx];
      const startMs = day.getTime() + cur.previewStartMin * 60_000;
      const endMs = day.getTime() + (cur.hasMoved ? cur.previewEndMin : Math.min(1440, cur.previewStartMin + 60)) * 60_000;
      this.openNewEventModal(new Date(startMs), new Date(endMs), false);
      return;
    }

    const targetEvent = this.ownedEvents().find((x) => x.id === cur.eventId);
    if (!targetEvent) return;

    if (!cur.hasMoved) {
      // Simple click -> open rich event inspector/editor
      this.openEditEventModal(targetEvent);
      return;
    }

    const targetDay = this.visibleDays()[cur.previewDayIdx];
    const newStartIso = new Date(targetDay.getTime() + cur.previewStartMin * 60_000).toISOString();
    const newEndIso = new Date(targetDay.getTime() + cur.previewEndMin * 60_000).toISOString();

    if (newStartIso === targetEvent.start && newEndIso === targetEvent.end) {
      return;
    }

    await this.commitDraggedEventChange(targetEvent, newStartIso, newEndIso);
  }

  // Month View Drag & Drop between date cells!
  onMonthPillDragStart(ev: DragEvent, item: WebCalendarEvent): void {
    if (item.readOnly) {
      ev.preventDefault();
      return;
    }
    this.monthDragEventId.set(item.id);
    ev.dataTransfer?.setData('text/plain', item.id);
  }

  onMonthCellDragOver(ev: DragEvent, cellKey: string): void {
    if (!this.monthDragEventId()) return;
    ev.preventDefault();
    this.monthDropTargetKey.set(cellKey);
  }

  async onMonthCellDrop(ev: DragEvent, targetDate: Date): Promise<void> {
    ev.preventDefault();
    const evId = this.monthDragEventId();
    this.monthDragEventId.set(null);
    this.monthDropTargetKey.set(null);
    if (!evId) return;

    const item = this.ownedEvents().find((x) => x.id === evId);
    if (!item) return;

    const oldStart = new Date(item.start);
    const durationMs = Math.max(900_000, Date.parse(item.end) - oldStart.getTime());
    const nextStart = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate(),
      oldStart.getHours(),
      oldStart.getMinutes(),
      0,
      0,
    );
    const nextEnd = new Date(nextStart.getTime() + durationMs);
    await this.commitDraggedEventChange(item, nextStart.toISOString(), nextEnd.toISOString());
  }

  private async commitDraggedEventChange(
    original: WebCalendarEvent,
    newStartIso: string,
    newEndIso: string,
  ): Promise<void> {
    const prevStart = original.start;
    const prevEnd = original.end;

    // Optimistic UI update for zero-jitter snap
    this.ownedEvents.update((list) =>
      list.map((e) => (e.id === original.id ? { ...e, start: newStartIso, end: newEndIso } : e)),
    );

    try {
      const res = await this.api.upsertCalendarEvent(original.id, {
        start: newStartIso,
        end: newEndIso,
        notifyGuest: true,
      });
      this.ownedEvents.update((list) =>
        list.map((e) => (e.id === original.id ? res.event : e)),
      );
      if (original.booking?.bookingId) {
        this.api.getHostBookings().then((r) => this.hostBookings.set(r.bookings)).catch(() => null);
      }
      const timeText = this.formatFullDateTime(newStartIso);
      const suffix = res.notifiedGuest ? ' · Guest notified by email' : '';
      this.showToast(`Moved "${original.title}" to ${timeText}${suffix}`, {
        undoEventId: original.id,
        undoStart: prevStart,
        undoEnd: prevEnd,
      });
    } catch (e) {
      // Revert optimistic move on conflict
      this.ownedEvents.update((list) =>
        list.map((ev) => (ev.id === original.id ? { ...ev, start: prevStart, end: prevEnd } : ev)),
      );
      this.showToast(e instanceof Error ? e.message : 'Could not move event to that time.');
    }
  }

  async undoLastMove(): Promise<void> {
    const t = this.toast();
    if (!t?.undoEventId || !t.undoStart || !t.undoEnd) return;
    const item = this.ownedEvents().find((x) => x.id === t.undoEventId);
    this.toast.set(null);
    if (!item) return;
    await this.commitDraggedEventChange(item, t.undoStart, t.undoEnd);
    this.showToast(`Restored "${item.title}" to its original slot.`);
  }

  // ── Navigation & Modal Editors ────────────────────────────────────────────

  stepPeriod(dir: -1 | 1): void {
    const cur = this.anchorDate();
    const mode = this.viewMode();
    if (mode === 'day') this.anchorDate.set(this.addDays(cur, dir));
    else if (mode === 'month') {
      this.anchorDate.set(new Date(cur.getFullYear(), cur.getMonth() + dir, 1));
    } else {
      this.anchorDate.set(this.addDays(cur, dir * 7));
    }
  }

  jumpToday(): void {
    this.anchorDate.set(this.startOfLocalDay(new Date()));
  }

  selectMiniDay(d: Date): void {
    this.anchorDate.set(this.startOfLocalDay(d));
  }

  openNewEventDefault(): void {
    const base = new Date(this.anchorDate());
    const now = new Date();
    base.setHours(Math.min(22, now.getHours() + 1), 0, 0, 0);
    const end = new Date(base.getTime() + 60 * 60_000);
    this.openNewEventModal(base, end, false);
  }

  openNewEventModal(start: Date, end: Date, allDay: boolean): void {
    const id = `ev_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
    this.editorDraft.set({
      id,
      isNew: true,
      title: '',
      color: this.api.profile()?.defaultColor || '#0A84FF',
      allDay,
      startDate: this.toInputDate(start),
      startTime: this.toInputTime(start),
      endDate: this.toInputDate(end),
      endTime: this.toInputTime(end),
      timeZone: this.calendarTimeZone(),
      availability: 'busy',
      location: '',
      videoCallURL: '',
      notes: '',
      recurrence: 'none',
      reminderMin: 15,
      isBookedMeeting: false,
    });
  }

  openEditEventModal(ev: WebCalendarEvent): void {
    if (ev.readOnly) {
      this.showToast(`Read-only synced event (${ev.externalSource || 'shared calendar'}).`);
      return;
    }
    const s = new Date(ev.start);
    const e = new Date(ev.end);
    const rec = ev.details?.recurrenceRules?.[0]?.frequency ?? 'none';
    const alarmSec = ev.details?.alarms?.[0]?.relativeOffsetSeconds;
    const reminderMin = typeof alarmSec === 'number' ? Math.round(Math.abs(alarmSec) / 60) : -1;

    this.editorDraft.set({
      id: ev.id,
      isNew: false,
      title: ev.title,
      color: ev.color || ev.details?.color || '#0A84FF',
      allDay: Boolean(ev.allDay),
      startDate: this.toInputDate(s),
      startTime: this.toInputTime(s),
      endDate: this.toInputDate(e),
      endTime: this.toInputTime(e),
      timeZone: ev.details?.timeZone || this.calendarTimeZone(),
      availability:
        (ev.details?.availability as 'busy' | 'free' | 'tentative') || 'busy',
      location: ev.location || '',
      videoCallURL: ev.details?.videoCallURL || '',
      notes: ev.details?.notes || '',
      recurrence: rec as any,
      reminderMin,
      isBookedMeeting: Boolean(ev.booking?.bookingId),
      guestName: ev.booking?.guestName,
      guestEmail: ev.booking?.guestEmail,
    });
  }

  closeEditor(): void {
    this.editorDraft.set(null);
  }

  async saveDraftEvent(): Promise<void> {
    const d = this.editorDraft();
    if (!d) return;
    const title = d.title.trim() || 'New Event';

    let startIso: string;
    let endIso: string;
    if (d.allDay) {
      const s = new Date(`${d.startDate}T00:00:00`);
      const e = new Date(`${d.endDate || d.startDate}T23:59:00`);
      startIso = s.toISOString();
      endIso = e > s ? e.toISOString() : new Date(s.getTime() + 86_400_000).toISOString();
    } else {
      const s = new Date(`${d.startDate}T${d.startTime || '09:00'}:00`);
      const e = new Date(`${d.endDate || d.startDate}T${d.endTime || '10:00'}:00`);
      startIso = s.toISOString();
      endIso = e > s ? e.toISOString() : new Date(s.getTime() + 30 * 60_000).toISOString();
    }

    this.savingEvent.set(true);
    try {
      const res = await this.api.upsertCalendarEvent(d.id, {
        title,
        start: startIso,
        end: endIso,
        allDay: d.allDay,
        color: d.color,
        location: d.location.trim() || null,
        videoCallURL: d.videoCallURL.trim() || null,
        notes: d.notes.trim(),
        timeZone: d.timeZone,
        availability: d.availability,
        alarms: d.reminderMin >= 0 ? [{ relativeOffsetSeconds: -d.reminderMin * 60 }] : [],
        recurrenceRules:
          d.recurrence !== 'none' ? [{ frequency: d.recurrence, interval: 1 }] : [],
        notifyGuest: true,
      });

      this.ownedEvents.update((list) => {
        const exists = list.some((x) => x.id === res.event.id);
        return exists ? list.map((x) => (x.id === res.event.id ? res.event : x)) : [...list, res.event];
      });
      this.editorDraft.set(null);
      this.showToast(d.isNew ? `Created "${title}".` : `Saved "${title}".`);
    } catch (e) {
      this.showToast(e instanceof Error ? e.message : 'Could not save event.');
    } finally {
      this.savingEvent.set(false);
    }
  }

  async deleteDraftEvent(): Promise<void> {
    const d = this.editorDraft();
    if (!d || d.isNew) {
      this.editorDraft.set(null);
      return;
    }
    this.savingEvent.set(true);
    try {
      await this.api.deleteCalendarEvent(d.id, { notifyGuest: true });
      this.ownedEvents.update((list) => list.filter((x) => x.id !== d.id));
      if (d.isBookedMeeting) {
        this.api.getHostBookings().then((r) => this.hostBookings.set(r.bookings)).catch(() => null);
      }
      this.editorDraft.set(null);
      this.showToast(
        d.isBookedMeeting
          ? 'Booking cancelled & guest notified by email.'
          : 'Event deleted.',
      );
    } catch (e) {
      this.showToast(e instanceof Error ? e.message : 'Could not delete event.');
    } finally {
      this.savingEvent.set(false);
    }
  }

  exportDraftIcs(): void {
    const d = this.editorDraft();
    if (!d) return;
    const s = new Date(`${d.startDate}T${d.startTime || '09:00'}:00`).toISOString();
    const e = new Date(`${d.endDate || d.startDate}T${d.endTime || '10:00'}:00`).toISOString();
    const ics = buildSingleEventIcs({
      uid: `${d.id}@cloud-calendars.com`,
      title: d.title || 'Event',
      start: s,
      end: e,
      location: d.location,
      description: d.notes,
      url: d.videoCallURL || undefined,
    });
    downloadIcsFile(d.title || 'cloud-calendar-event', ics);
  }

  // ── External Busy Calendar Sync ───────────────────────────────────────────

  async syncGoogleBusy(): Promise<void> {
    this.syncingExternal.set('google');
    this.syncFeedback.set(null);
    try {
      await this.api.signInWithGooglePopup({ includeCalendarReadonly: true });
      await this.reloadAllWorkspaceData();
      this.syncFeedback.set('Google Calendar 2-way sync active!');
    } catch (e) {
      this.syncFeedback.set(
        e instanceof Error
          ? e.message
          : 'Paste your Google Calendar Secret .ics URL below for instant sync.',
      );
    } finally {
      this.syncingExternal.set(null);
    }
  }

  async syncMicrosoftBusy(): Promise<void> {
    this.syncingExternal.set('microsoft');
    this.syncFeedback.set(null);
    try {
      await this.api.signInWithMicrosoftPopup({ includeCalendarReadonly: true });
      await this.reloadAllWorkspaceData();
      this.syncFeedback.set('Microsoft Outlook 2-way sync active!');
    } catch (e) {
      this.syncFeedback.set(
        e instanceof Error
          ? e.message
          : 'Paste your Outlook .ics feed URL below for instant sync.',
      );
    } finally {
      this.syncingExternal.set(null);
    }
  }

  async syncIcsUrl(): Promise<void> {
    const url = this.icsFeedInput().trim();
    if (!url) return;
    this.syncingExternal.set('ics');
    this.syncFeedback.set(null);
    try {
      const nextBusy = await this.api.syncExternalProvider({ provider: 'ics', icsUrl: url });
      this.externalBusy.set(nextBusy);
      const count = nextBusy.sources?.['ics']?.count ?? 0;
      this.syncFeedback.set(`Synced ${count} busy events from .ics feed.`);
    } catch (e) {
      this.syncFeedback.set(e instanceof Error ? e.message : 'Could not sync .ics URL.');
    } finally {
      this.syncingExternal.set(null);
    }
  }

  async disconnectExternal(provider: 'google' | 'microsoft' | 'ics'): Promise<void> {
    const nextBusy = await this.api.syncExternalProvider({ provider, disconnect: true });
    this.externalBusy.set(nextBusy);
    await this.api.refreshProfile().catch(() => null);
    this.showToast(`Disconnected ${provider} calendar sync.`);
  }

  copyText(text: string, label = 'Link copied to clipboard!'): void {
    if (!this.isBrowser) return;
    navigator.clipboard?.writeText(text);
    this.showToast(label);
  }

  // ── Tab 2: Host Availability & Meeting Types Builder ─────────────────────

  updateCfgField<K extends keyof BookingScheduleConfig>(
    key: K,
    value: BookingScheduleConfig[K],
  ): void {
    this.bookingConfig.update((c) => ({ ...c, [key]: value }));
  }

  async onHandleBlur(): Promise<void> {
    const h = this.bookingConfig().handle.trim().toLowerCase();
    if (h.length < 3) return;
    this.handleStatus.set('checking');
    this.handleReason.set(null);
    try {
      const res = await this.api.checkHandle(h);
      this.bookingConfig.update((c) => ({ ...c, handle: res.handle || h }));
      this.handleStatus.set(res.available ? 'available' : 'taken');
      this.handleReason.set(res.reason || null);
    } catch {
      this.handleStatus.set('idle');
    }
  }

  windowsForDay(dayKey: string): TimeWindow[] {
    return this.bookingConfig().weekly?.[dayKey] ?? [];
  }

  toggleWeekday(dayKey: string): void {
    const cur = this.windowsForDay(dayKey);
    const next = cur.length > 0 ? [] : [{ start: 540, end: 1020 }];
    this.bookingConfig.update((c) => ({
      ...c,
      weekly: { ...c.weekly, [dayKey]: next },
    }));
  }

  addWeekdayWindow(dayKey: string): void {
    const cur = this.windowsForDay(dayKey);
    const lastEnd = cur.length ? cur[cur.length - 1].end : 480;
    const start = Math.min(1320, lastEnd + 60);
    const end = Math.min(1440, start + 180);
    this.bookingConfig.update((c) => ({
      ...c,
      weekly: { ...c.weekly, [dayKey]: [...cur, { start, end }] },
    }));
  }

  removeWeekdayWindow(dayKey: string, idx: number): void {
    const cur = this.windowsForDay(dayKey).filter((_, i) => i !== idx);
    this.bookingConfig.update((c) => ({
      ...c,
      weekly: { ...c.weekly, [dayKey]: cur },
    }));
  }

  updateWindowTime(dayKey: string, idx: number, field: 'start' | 'end', hhmm: string): void {
    const mins = this.parseHmToMinutes(hhmm);
    const cur = this.windowsForDay(dayKey).map((w, i) =>
      i === idx ? { ...w, [field]: mins } : w,
    );
    this.bookingConfig.update((c) => ({
      ...c,
      weekly: { ...c.weekly, [dayKey]: cur },
    }));
  }

  copyMondayToWeekdays(): void {
    const mon = this.windowsForDay('1').map((w) => ({ ...w }));
    this.bookingConfig.update((c) => ({
      ...c,
      weekly: {
        ...c.weekly,
        '2': mon.map((w) => ({ ...w })),
        '3': mon.map((w) => ({ ...w })),
        '4': mon.map((w) => ({ ...w })),
        '5': mon.map((w) => ({ ...w })),
      },
    }));
    this.showToast('Copied Monday hours to Tuesday – Friday.');
  }

  overrideEntries(): Array<{ date: string; windows: TimeWindow[] }> {
    const ov = this.bookingConfig().dateOverrides ?? {};
    return Object.keys(ov)
      .sort()
      .map((date) => ({ date, windows: ov[date] }));
  }

  addDateOverride(): void {
    const dt = this.newOverrideDate().trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dt)) return;
    const prevForDate = this.bookingConfig().dateOverrides?.[dt] ?? [];
    const nextWindows: TimeWindow[] = this.newOverrideClosed()
      ? []
      : [
          ...prevForDate,
          {
            start: this.parseHmToMinutes(this.newOverrideStart()),
            end: this.parseHmToMinutes(this.newOverrideEnd()),
          },
        ]
          .filter((w) => w.end > w.start)
          .sort((a, b) => a.start - b.start);
    this.bookingConfig.update((c) => ({
      ...c,
      dateOverrides: { ...(c.dateOverrides ?? {}), [dt]: nextWindows },
    }));
  }

  formatWindowsSummary(wins: TimeWindow[]): string {
    if (!wins.length) return 'Closed';
    return wins.map((w) => `${this.formatMinutesHm(w.start)}–${this.formatMinutesHm(w.end)}`).join(', ');
  }

  removeDateOverride(dt: string): void {
    this.bookingConfig.update((c) => {
      const next = { ...(c.dateOverrides ?? {}) };
      delete next[dt];
      return { ...c, dateOverrides: next };
    });
  }

  addMeetingType(): void {
    const id = `mt_${Math.random().toString(36).slice(2, 8)}`;
    const nextType: MeetingTypeConfig = {
      id,
      slug: `session-${this.bookingConfig().meetingTypes.length + 1}`,
      name: '45m Strategy Session',
      durationMinutes: 45,
      color: '#BF5AF2',
      bufferBeforeMinutes: 5,
      bufferAfterMinutes: 5,
      locationKind: 'google_meet',
      locationValue: '',
      description: 'Focused 1-on-1 strategy & architecture call.',
      active: true,
    };
    this.bookingConfig.update((c) => ({
      ...c,
      meetingTypes: [...c.meetingTypes, nextType],
    }));
  }

  removeMeetingType(id: string): void {
    if (this.bookingConfig().meetingTypes.length <= 1) {
      this.showToast('At least one meeting type is required.');
      return;
    }
    this.bookingConfig.update((c) => ({
      ...c,
      meetingTypes: c.meetingTypes.filter((m) => m.id !== id),
    }));
  }

  updateMeetingType<K extends keyof MeetingTypeConfig>(
    id: string,
    field: K,
    value: MeetingTypeConfig[K],
  ): void {
    this.bookingConfig.update((c) => ({
      ...c,
      meetingTypes: c.meetingTypes.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    }));
  }

  async saveAvailabilityConfig(): Promise<void> {
    this.savingConfig.set(true);
    this.configSavedMsg.set(null);
    try {
      const res = await this.api.saveBookingConfig(this.bookingConfig());
      this.bookingConfig.set(res.config);
      this.configSavedMsg.set(`Published live at ${res.shareUrl}`);
      this.showToast('Booking page & availability saved!');
    } catch (e) {
      this.showToast(e instanceof Error ? e.message : 'Could not save booking page.');
    } finally {
      this.savingConfig.set(false);
    }
  }

  async generateExpiringInviteLink(): Promise<void> {
    this.creatingInvite.set(true);
    try {
      const res = await this.api.createBookingInviteLink({
        label: this.inviteLabel().trim() || 'Booking Invite',
        expiresInHours: Number(this.inviteExpiresHours()) || 168,
        maxUses: Number(this.inviteMaxUses()),
        meetingTypeId: this.inviteMeetingTypeId() || null,
        requireEmailConfirmIfUnauthenticated: true,
      });
      this.inviteLinks.update((list) => [res.link, ...list.filter((x) => x.token !== res.link.token)]);
      if (this.isBrowser) {
        navigator.clipboard?.writeText(res.link.shareUrl);
      }
      this.showToast('Expiring invite link generated & copied to clipboard!');
    } catch (e) {
      this.showToast(e instanceof Error ? e.message : 'Could not generate invite link.');
    } finally {
      this.creatingInvite.set(false);
    }
  }

  async revokeInviteLink(token: string): Promise<void> {
    try {
      const res = await this.api.revokeBookingInviteLink(token);
      this.inviteLinks.update((list) =>
        list.map((x) => (x.token === token ? res.link : x)),
      );
      this.showToast('Expiring invite link deactivated.');
    } catch (e) {
      this.showToast(e instanceof Error ? e.message : 'Could not deactivate link.');
    }
  }

  invitePreviewHref(token: string): string {
    return `${linkPath(this.locale, '/book')}?i=${encodeURIComponent(token)}`;
  }

  // ── Tab 3: Incoming Guest Bookings Actions ────────────────────────────────

  openHostReschedule(b: HostBookingItem): void {
    const d = new Date(b.start);
    this.rescheduleModalItem.set(b);
    this.rescheduleNewDate.set(this.toInputDate(d));
    this.rescheduleNewTime.set(this.toInputTime(d));
    this.rescheduleNote.set('');
  }

  async confirmHostReschedule(): Promise<void> {
    const item = this.rescheduleModalItem();
    if (!item) return;
    const durationMs = Math.max(900_000, Date.parse(item.end) - Date.parse(item.start));
    const nextStart = new Date(`${this.rescheduleNewDate()}T${this.rescheduleNewTime()}:00`);
    const nextEnd = new Date(nextStart.getTime() + durationMs);

    try {
      await this.api.rescheduleHostBooking(item.eventId, {
        start: nextStart.toISOString(),
        end: nextEnd.toISOString(),
        reason: this.rescheduleNote().trim() || undefined,
        notifyGuest: true,
      });
      this.rescheduleModalItem.set(null);
      await this.reloadAllWorkspaceData();
      this.showToast('Booking moved & guest notified by email.');
    } catch (e) {
      this.showToast(e instanceof Error ? e.message : 'Could not reschedule booking.');
    }
  }

  async cancelIncomingBooking(b: HostBookingItem): Promise<void> {
    try {
      await this.api.cancelHostBooking(b.eventId, { notifyGuest: true });
      await this.reloadAllWorkspaceData();
      this.showToast(`Cancelled meeting with ${b.guestName}.`);
    } catch (e) {
      this.showToast(e instanceof Error ? e.message : 'Could not cancel booking.');
    }
  }

  jumpToBookingOnCalendar(b: HostBookingItem): void {
    this.anchorDate.set(this.startOfLocalDay(new Date(b.start)));
    this.activeTab.set('calendar');
  }

  // ── Date & Toast Utilities ────────────────────────────────────────────────

  private showToast(
    message: string,
    undo?: { undoEventId: string; undoStart: string; undoEnd: string },
  ): void {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toast.set({ message, ...undo });
    this.toastTimer = setTimeout(() => this.toast.set(null), 6500);
  }

  private startOfLocalDay(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
  }

  private startOfWeekMonday(d: Date): Date {
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    return this.addDays(this.startOfLocalDay(d), diff);
  }

  private addDays(d: Date, days: number): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + days, 0, 0, 0, 0);
  }

  private dayKey(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private toInputDate(d: Date): string {
    return this.dayKey(d);
  }

  private toInputTime(d: Date): string {
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  private parseHmToMinutes(hhmm: string): number {
    const [h, m] = (hhmm || '09:00').split(':').map((x) => parseInt(x, 10) || 0);
    return Math.max(0, Math.min(1440, h * 60 + m));
  }

  private createDefaultConfig(): BookingScheduleConfig {
    return {
      enabled: true,
      handle: 'my-schedule',
      displayName: 'My Cloud Calendar',
      headline: 'Book a time that works for both of us',
      bio: 'Pick a slot below — you will receive an instant calendar invite (.ics) & video call link.',
      avatarColor: '#0A84FF',
      timeZone: detectBrowserTimeZone(),
      slotIntervalMinutes: 15,
      minNoticeMinutes: 60,
      maxAdvanceDays: 60,
      maxBookingsPerDay: 0,
      requireEmailVerification: false,
      weekly: {
        '0': [],
        '1': [{ start: 540, end: 1020 }],
        '2': [{ start: 540, end: 1020 }],
        '3': [{ start: 540, end: 1020 }],
        '4': [{ start: 540, end: 1020 }],
        '5': [{ start: 540, end: 1020 }],
        '6': [],
      },
      dateOverrides: {},
      meetingTypes: [
        {
          id: 'mt_15',
          slug: 'intro-15',
          name: '15m Quick Intro',
          durationMinutes: 15,
          color: '#38E0F0',
          bufferBeforeMinutes: 0,
          bufferAfterMinutes: 5,
          locationKind: 'google_meet',
          locationValue: '',
          description: 'Fast introductory call.',
          active: true,
        },
        {
          id: 'mt_30',
          slug: 'sync-30',
          name: '30m Collaboration Sync',
          durationMinutes: 30,
          color: '#0A84FF',
          bufferBeforeMinutes: 5,
          bufferAfterMinutes: 5,
          locationKind: 'google_meet',
          locationValue: '',
          description: 'Standard 1-on-1 product or client meeting.',
          active: true,
        },
      ],
    };
  }
}
