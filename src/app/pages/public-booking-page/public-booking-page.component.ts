import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
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
  BookingSlot,
  CalendarApiError,
  CalendarPlatformApiService,
  CreatedBookingResponse,
  PublicBookingPageData,
} from '../../core/calendar-platform-api.service';
import {
  COMMON_TIMEZONES,
  buildGoogleCalendarUrl,
  buildOutlookCalendarUrl,
  computeIosEventStyle,
  detectBrowserTimeZone,
  downloadIcsFile,
  generateQrSvgDataUrl,
} from '../../core/ios-event-palette';

type BookStep = 'loading' | 'pick' | 'details' | 'verify' | 'confirmed' | 'expired' | 'notfound';

@Component({
  selector: 'app-public-booking-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './public-booking-page.component.html',
  styleUrl: './public-booking-page.component.scss',
})
export class PublicBookingPageComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  readonly api = inject(CalendarPlatformApiService);

  private slotPollTimer: any = null;
  private readonly onVisibilityChange = () => {
    if (
      typeof document !== 'undefined' &&
      document.visibilityState === 'visible' &&
      this.step() === 'pick' &&
      !this.loadingSlots()
    ) {
      this.fetchSlotsForMonth(true).catch(() => null);
    }
  };

  protected locale: Locale = DEFAULT_LOCALE;
  readonly timezones = COMMON_TIMEZONES;

  readonly step = signal<BookStep>('loading');
  readonly isEmbed = signal(false);
  readonly host = signal<PublicBookingPageData | null>(null);
  readonly selectedTypeId = signal<string>('');
  readonly guestTimeZone = signal<string>(detectBrowserTimeZone());
  readonly monthCursor = signal<Date>(this.firstOfMonth(new Date()));
  readonly selectedDayKey = signal<string>('');
  readonly slots = signal<BookingSlot[]>([]);
  readonly loadingSlots = signal(false);
  readonly selectedSlot = signal<BookingSlot | null>(null);

  // Guest Form
  readonly guestName = signal('');
  readonly guestEmail = signal('');
  readonly guestNotes = signal('');
  readonly otpCode = signal('');
  readonly submitting = signal(false);
  readonly errorMsg = signal<string | null>(null);
  readonly expiredMessage = signal<string | null>(null);
  readonly signingInGuest = signal<'google' | 'microsoft' | null>(null);
  readonly created = signal<CreatedBookingResponse | null>(null);
  readonly autoSyncFeedback = signal<string | null>(null);
  readonly syncingToMyCal = signal(false);

  private handle = 'demo';

  readonly studioHref = computed(() => `${linkPath(this.locale, '/calendar')}?tab=availability`);
  readonly guestPortalHref = computed(() => linkPath(this.locale, '/bookings'));

  readonly selectedType = computed(() => {
    const h = this.host();
    if (!h) return null;
    return h.meetingTypes.find((m) => m.id === this.selectedTypeId()) ?? h.meetingTypes[0] ?? null;
  });

  // Group available slots by YYYY-MM-DD in the GUEST'S selected timezone!
  readonly slotsByGuestDay = computed(() => {
    const tz = this.guestTimeZone();
    const map = new Map<string, BookingSlot[]>();
    for (const s of this.slots()) {
      const key = this.dateKeyInZone(s.start, tz);
      const arr = map.get(key) ?? [];
      arr.push(s);
      map.set(key, arr);
    }
    return map;
  });

  readonly selectedDaySlots = computed(() => {
    return this.slotsByGuestDay().get(this.selectedDayKey()) ?? [];
  });

  readonly calendarCells = computed(() => {
    const first = this.monthCursor();
    const day = first.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const gridStart = new Date(first.getFullYear(), first.getMonth(), 1 + diff);
    const openMap = this.slotsByGuestDay();
    const selKey = this.selectedDayKey();
    const todayKey = this.dateKeyInZone(new Date().toISOString(), this.guestTimeZone());

    return Array.from({ length: 42 }, (_, idx) => {
      const d = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + idx);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const num = String(d.getDate()).padStart(2, '0');
      const key = `${y}-${m}-${num}`;
      const count = openMap.get(key)?.length ?? 0;
      return {
        date: d,
        key,
        dayNum: d.getDate(),
        inMonth: d.getMonth() === first.getMonth(),
        isToday: key === todayKey,
        isSelected: key === selKey,
        openCount: count,
      };
    });
  });

  readonly confirmedQr = computed(() => {
    const c = this.created();
    return c?.manageUrl ? generateQrSvgDataUrl(c.manageUrl) : '';
  });

  async ngOnInit(): Promise<void> {
    this.locale = (this.route.snapshot.data['locale'] as Locale) ?? DEFAULT_LOCALE;
    this.seo.apply({
      title: 'Book a Meeting — Cloud Calendars',
      description: 'Choose an open time slot and add the meeting straight to your calendar.',
      path: localePath(this.locale, '/book'),
      locale: this.locale,
      noindex: true,
      alternates: LOCALES.map((l) => ({ hreflang: l.hreflang, path: localePath(l, '/book') })),
    });

    if (!this.isBrowser) return;

    const qp = this.route.snapshot.queryParamMap;
    const rawInvite = (qp.get('i') || '').trim();
    this.handle = rawInvite ? rawInvite : (qp.get('u') || 'demo').trim().toLowerCase();
    this.isEmbed.set(qp.get('embed') === '1');
    const requestedType = qp.get('type') || '';

    await this.api.ensureInitialized();
    const prof = this.api.profile();
    if (prof?.displayName && prof.displayName !== 'My Cloud Calendar') {
      this.guestName.set(prof.displayName);
    }
    if (prof?.email) {
      this.guestEmail.set(prof.email);
    }

    await this.loadHost(requestedType);

    // Lightweight 30s live slot refresh while guest is viewing the calendar picker
    document.addEventListener('visibilitychange', this.onVisibilityChange);
    this.slotPollTimer = setInterval(() => {
      if (
        typeof document !== 'undefined' &&
        document.visibilityState === 'visible' &&
        this.step() === 'pick' &&
        !this.loadingSlots()
      ) {
        this.fetchSlotsForMonth(true).catch(() => null);
      }
    }, 30_000);
  }

  ngOnDestroy(): void {
    if (this.slotPollTimer) clearInterval(this.slotPollTimer);
    if (this.isBrowser && typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.onVisibilityChange);
    }
  }

  private async loadHost(requestedType: string): Promise<void> {
    this.step.set('loading');
    try {
      const data = await this.api.getPublicBookingPage(this.handle);
      this.host.set(data);
      const match =
        data.meetingTypes.find((m) => m.id === requestedType || m.slug === requestedType) ??
        data.meetingTypes[0];
      if (match) {
        this.selectedTypeId.set(match.id);
      }
      this.step.set('pick');
      if (data.displayName) {
        this.seo.apply({
          title: `Book with ${data.displayName} — Cloud Calendars`,
          description: data.headline || 'Pick an available time slot.',
          path: localePath(this.locale, '/book'),
          locale: this.locale,
          noindex: true,
        });
      }
      await this.fetchSlotsForMonth();
    } catch (err) {
      if (err instanceof CalendarApiError && (err.status === 410 || err.code === 'invite_expired')) {
        this.expiredMessage.set(
          err.message || 'This booking invite link has expired or has already been used.',
        );
        this.step.set('expired');
      } else {
        this.step.set('notfound');
      }
    }
  }

  async selectMeetingType(typeId: string): Promise<void> {
    this.selectedTypeId.set(typeId);
    this.selectedSlot.set(null);
    await this.fetchSlotsForMonth();
  }

  async changeMonth(dir: -1 | 1): Promise<void> {
    const c = this.monthCursor();
    this.monthCursor.set(new Date(c.getFullYear(), c.getMonth() + dir, 1));
    await this.fetchSlotsForMonth();
  }

  async fetchSlotsForMonth(silent = false): Promise<void> {
    const h = this.host();
    if (!h) return;
    const first = this.monthCursor();
    const last = new Date(first.getFullYear(), first.getMonth() + 1, 7);
    const fromStr = this.isoDay(new Date(Math.max(Date.now() - 86_400_000, first.getTime())));
    const toStr = this.isoDay(last);

    if (!silent) this.loadingSlots.set(true);
    try {
      const res = await this.api.getPublicBookingSlots(h.handle, {
        type: this.selectedTypeId(),
        from: fromStr,
        to: toStr,
      });
      this.slots.set(res.slots ?? []);
      // Auto-select the first available day if current day has none
      const map = this.slotsByGuestDay();
      if (!map.has(this.selectedDayKey())) {
        const firstOpenKey = [...map.keys()].sort()[0] ?? '';
        this.selectedDayKey.set(firstOpenKey);
      }
    } finally {
      if (!silent) this.loadingSlots.set(false);
    }
  }

  pickSlot(slot: BookingSlot): void {
    this.selectedSlot.set(slot);
    this.errorMsg.set(null);
    const prof = this.api.profile();
    if (prof?.displayName && prof.displayName !== 'My Cloud Calendar' && !this.guestName().trim()) {
      this.guestName.set(prof.displayName);
    }
    if (prof?.email && !this.guestEmail().trim()) {
      this.guestEmail.set(prof.email);
    }
    this.step.set('details');
  }

  async signInGuestWithProvider(provider: 'google' | 'microsoft'): Promise<void> {
    this.signingInGuest.set(provider);
    this.errorMsg.set(null);
    try {
      if (provider === 'google') {
        await this.api.signInWithGooglePopup({ includeCalendarReadonly: true });
      } else {
        await this.api.signInWithMicrosoftPopup({ includeCalendarReadonly: true });
      }
      const prof = this.api.profile();
      if (prof?.displayName && prof.displayName !== 'My Cloud Calendar' && !this.guestName().trim()) {
        this.guestName.set(prof.displayName);
      }
      if (prof?.email) {
        this.guestEmail.set(prof.email);
      }
    } catch (e) {
      this.errorMsg.set(e instanceof Error ? e.message : 'Calendar sign-in cancelled.');
    } finally {
      this.signingInGuest.set(null);
    }
  }

  async submitGuestDetails(): Promise<void> {
    this.errorMsg.set(null);
    const slot = this.selectedSlot();
    const h = this.host();
    const mt = this.selectedType();
    if (!slot || !h || !mt) return;

    const name = this.guestName().trim();
    const email = this.guestEmail().trim().toLowerCase();
    if (!name || !email.includes('@')) {
      this.errorMsg.set('Please enter your name and a valid email address.');
      return;
    }

    this.submitting.set(true);
    try {
      const res = await this.api.createPublicBooking(h.handle, {
        typeId: mt.id,
        start: slot.start,
        name,
        email,
        timeZone: this.guestTimeZone(),
        notes: this.guestNotes().trim() || undefined,
        verificationCode: this.otpCode().trim() || undefined,
      });
      this.created.set(res);
      if (this.api.isSignedInWithAccount()) {
        this.autoSyncFeedback.set(
          '✓ Automatically added to your connected calendar & CloudCalendars!',
        );
      }
      this.step.set('confirmed');
    } catch (e) {
      if (e instanceof CalendarApiError && e.code === 'verification_required') {
        await this.api.requestBookingVerificationCode(h.handle, email);
        this.step.set('verify');
      } else if (e instanceof CalendarApiError && (e.status === 410 || e.code === 'invite_expired')) {
        this.expiredMessage.set(e.message || 'This booking invite link has expired.');
        this.step.set('expired');
      } else {
        this.errorMsg.set(e instanceof Error ? e.message : 'Could not complete booking.');
        if (e instanceof CalendarApiError && e.status === 409) {
          this.step.set('pick');
          await this.fetchSlotsForMonth();
        }
      }
    } finally {
      this.submitting.set(false);
    }
  }

  async resendVerification(): Promise<void> {
    const h = this.host();
    if (!h) return;
    this.submitting.set(true);
    try {
      await this.api.requestBookingVerificationCode(h.handle, this.guestEmail());
    } finally {
      this.submitting.set(false);
    }
  }

  // ── Export & Formatting Helpers ───────────────────────────────────────────

  cardStyle(hex?: string | null) {
    const st = computeIosEventStyle(hex, 'dark');
    return {
      background: st.fill,
      borderColor: st.borderColor,
      color: st.titleColor,
      '--ev-accent': st.accentBar,
      '--ev-detail': st.detailColor,
    };
  }

  formatSlotTime(iso: string): string {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: this.guestTimeZone(),
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date(iso));
  }

  formatSlotDateTimeRange(slot: BookingSlot): string {
    const tz = this.guestTimeZone();
    const d = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(slot.start));
    return `${d} · ${this.formatSlotTime(slot.start)} – ${this.formatSlotTime(slot.end)} (${tz})`;
  }

  downloadCreatedIcs(): void {
    const c = this.created();
    if (!c) return;
    downloadIcsFile(c.event.title || 'booking', c.icsContent);
  }

  googleCalHref(): string {
    const c = this.created();
    if (!c) return '#';
    return buildGoogleCalendarUrl({
      title: c.event.title,
      start: c.event.start,
      end: c.event.end,
      location: c.event.details?.videoCallURL || c.event.location || undefined,
      description: c.manageUrl ? `Manage or reschedule: ${c.manageUrl}` : undefined,
    });
  }

  outlookCalHref(): string {
    const c = this.created();
    if (!c) return '#';
    return buildOutlookCalendarUrl({
      title: c.event.title,
      start: c.event.start,
      end: c.event.end,
      location: c.event.details?.videoCallURL || c.event.location || undefined,
      description: c.manageUrl ? `Manage or reschedule: ${c.manageUrl}` : undefined,
    });
  }

  manageRouteHref(): string {
    const tok = this.created()?.manageToken;
    return tok
      ? `${linkPath(this.locale, '/booking/manage')}?t=${encodeURIComponent(tok)}`
      : this.guestPortalHref();
  }

  async syncCreatedToProvider(provider: 'google' | 'microsoft'): Promise<void> {
    const tok = this.created()?.manageToken;
    if (!tok) return;
    this.syncingToMyCal.set(true);
    this.autoSyncFeedback.set(null);
    try {
      if (provider === 'google') {
        await this.api.signInWithGooglePopup({ includeCalendarReadonly: true });
      } else {
        await this.api.signInWithMicrosoftPopup({ includeCalendarReadonly: true });
      }
      const res = await this.api.syncManagedBookingToMyCalendar(tok);
      const label = provider === 'google' ? 'Google Calendar' : 'Microsoft Outlook';
      this.autoSyncFeedback.set(
        res.syncedProviders.length
          ? `✓ Linked directly to your CloudCalendars & ${label} (auto-updates if rescheduled)!`
          : `✓ Linked directly to your CloudCalendars calendar!`,
      );
    } catch (e) {
      this.autoSyncFeedback.set(e instanceof Error ? e.message : 'Calendar sync cancelled.');
    } finally {
      this.syncingToMyCal.set(false);
    }
  }

  private firstOfMonth(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), 1);
  }

  private isoDay(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  private dateKeyInZone(iso: string, tz: string): string {
    try {
      const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: tz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).formatToParts(new Date(iso));
      const y = parts.find((p) => p.type === 'year')?.value ?? '2026';
      const m = parts.find((p) => p.type === 'month')?.value ?? '01';
      const d = parts.find((p) => p.type === 'day')?.value ?? '01';
      return `${y}-${m}-${d}`;
    } catch {
      return iso.slice(0, 10);
    }
  }
}
