import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { SeoService } from '../../core/seo.service';
import { DEFAULT_LOCALE, Locale, LOCALES, localePath } from '../../core/locales';
import {
  BookingApiService,
  BookingConfig,
  BookingConfigInput,
  BookingError,
  OwnerBooking,
  SavedBooking,
} from '../../core/booking-api.service';
import { bookingSetupCopyFor } from '../../content/booking/setup-registry';
import { ownerManageCopyFor } from '../../content/booking/owner-manage-registry';
import { bookingLinkCopyFor } from '../../content/booking/link-registry';
import {
  AvailabilityGridComponent,
  AvailabilityWindow,
} from './availability-grid.component';

interface TypeRow {
  name: string;
  durationMinutes: number;
  location: string;
  description: string;
}

const TOKEN_KEY = 'cc_booking_token';
const FEED_KEY = 'cc_booking_feed';

@Component({
  selector: 'app-booking-setup-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AvailabilityGridComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './booking-setup-page.component.html',
  styleUrl: './booking-setup-page.component.scss',
})
export class BookingSetupPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly api = inject(BookingApiService);

  protected locale: Locale = DEFAULT_LOCALE;
  protected copy = bookingSetupCopyFor(DEFAULT_LOCALE.code);
  protected manageCopy = ownerManageCopyFor(DEFAULT_LOCALE.code);
  /** The "already have the app? link this browser" entry to the pairing screen. */
  protected linkEntry = bookingLinkCopyFor(DEFAULT_LOCALE.code).entryLink;
  protected linkHref = '/book/link/';

  protected readonly mode = signal<'form' | 'saving' | 'done'>('form');
  protected readonly errorMsg = signal<string | null>(null);
  protected readonly result = signal<SavedBooking | null>(null);
  protected readonly editing = signal(false);
  protected readonly copiedLink = signal(false);

  // ── incoming bookings the owner can decline or move ──────────────────────
  /** The saved config, kept for its handle and meeting types (for reschedules). */
  private readonly savedConfig = signal<BookingConfig | null>(null);
  protected readonly bookings = signal<OwnerBooking[]>([]);
  protected readonly bookingsLoading = signal(false);
  protected readonly manageError = signal<string | null>(null);
  /** The event id whose reschedule picker is open, if any. */
  protected readonly reschedulingId = signal<string | null>(null);
  protected readonly rescheduleLoading = signal(false);
  protected readonly rescheduleGroups = signal<
    { label: string; slots: { start: string; time: string }[] }[]
  >([]);
  protected readonly busyId = signal<string | null>(null);

  /** Only confirmed meetings still in the future, soonest first. */
  protected readonly upcoming = computed(() => {
    const now = Date.now();
    return this.bookings()
      .filter((b) => b.status !== 'cancelled' && new Date(b.end).getTime() >= now)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  });

  /** The owner's saved feed, for the "add to my calendar" step. */
  private feedUrl = '';

  protected readonly durations = [15, 30, 45, 60, 90];
  protected readonly intervals = [15, 20, 30, 60];

  protected readonly form = {
    displayName: '',
    timeZone:
      typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC',
    slotIntervalMinutes: 30,
    minNoticeHours: 12,
    maxAdvanceDays: 30,
  };

  protected types: TypeRow[] = [{ name: '', durationMinutes: 30, location: '', description: '' }];

  /** The owner's weekly openings, edited on the visual grid. */
  protected readonly availability = signal<AvailabilityWindow[]>([]);
  /** Weekday names, Monday-first, for the grid header. */
  protected readonly dayLabels = computed(() => [1, 2, 3, 4, 5, 6, 0].map((d) => this.weekday(d)));

  /** The IANA zones the browser knows, for the picker (with a safe fallback). */
  protected readonly zones = computed<string[]>(() => {
    const supported = (Intl as unknown as { supportedValuesOf?: (k: string) => string[] })
      .supportedValuesOf;
    const list = supported ? supported('timeZone') : [];
    if (list.length && !list.includes(this.form.timeZone)) list.unshift(this.form.timeZone);
    return list.length ? list : [this.form.timeZone];
  });

  protected get shareUrl(): string {
    return this.result()?.bookingUrl ?? '';
  }
  protected get webcalUrl(): string {
    return this.feedUrl.replace(/^https?:\/\//, 'webcal://');
  }

  async ngOnInit(): Promise<void> {
    this.locale = (this.route.snapshot.data['locale'] as Locale) ?? DEFAULT_LOCALE;
    this.copy = bookingSetupCopyFor(this.locale.code);
    this.manageCopy = ownerManageCopyFor(this.locale.code);
    this.linkEntry = bookingLinkCopyFor(this.locale.code).entryLink;
    this.linkHref = localePath(this.locale, '/book/link') + '/';

    this.seo.apply({
      title: this.copy.seoTitle,
      description: this.copy.seoDescription,
      path: localePath(this.locale, '/book/setup'),
      locale: this.locale,
      noindex: true, // a form behind a CTA, not a page to rank
      alternates: LOCALES.map((l) => ({ hreflang: l.hreflang, path: localePath(l, '/book/setup') })),
    });

    this.availability.set(this.defaultWindows());

    // A returning owner carries their token in this browser; load it to edit.
    const token = this.readToken();
    if (token) await this.loadExisting(token);
  }

  /** A sensible starting week: Monday–Friday, 9 to 5. */
  private defaultWindows(): AvailabilityWindow[] {
    return [1, 2, 3, 4, 5].map((day) => ({ day, start: 9 * 60, end: 17 * 60 }));
  }

  private async loadExisting(token: string): Promise<void> {
    try {
      const saved = await this.api.myBooking(token);
      this.editing.set(true);
      this.savedConfig.set(saved.config);
      this.feedUrl = localStorage.getItem(FEED_KEY) ?? '';
      void this.loadBookings();
      const c = saved.config;
      this.form.displayName = c.displayName;
      this.form.timeZone = c.timeZone;
      this.form.slotIntervalMinutes = c.slotIntervalMinutes;
      this.form.minNoticeHours = c.minNoticeHours;
      this.form.maxAdvanceDays = c.maxAdvanceDays;
      this.types = c.meetingTypes.map((t) => ({
        name: t.name,
        durationMinutes: t.durationMinutes,
        location: t.location ?? '',
        description: t.description ?? '',
      }));
      this.availability.set(c.availability.map((r) => ({ day: r.day, start: r.start, end: r.end })));
    } catch (e) {
      // A 404 means "signed in but no booking page yet" — e.g. an owner who just
      // paired this browser to their app account. Keep the token so saving writes
      // to THEIR calendar (a fresh empty form, not editing). Only a genuine auth
      // failure (401) should drop the token and fall back to a brand-new page.
      if (e instanceof BookingError && e.status === 401) this.clearToken();
    }
  }

  protected addType(): void {
    this.types = [...this.types, { name: '', durationMinutes: 30, location: '', description: '' }];
  }
  protected removeType(i: number): void {
    this.types = this.types.filter((_, idx) => idx !== i);
  }

  protected async submit(): Promise<void> {
    this.errorMsg.set(null);

    if (!this.form.displayName.trim()) return this.errorMsg.set(this.copy.errNeedName);
    const types = this.types
      .filter((t) => t.name.trim() && t.durationMinutes > 0)
      .map((t) => ({
        name: t.name.trim(),
        durationMinutes: t.durationMinutes,
        location: t.location.trim() || null,
        description: t.description.trim() || null,
      }));
    if (types.length === 0) return this.errorMsg.set(this.copy.errNeedType);

    const availability = this.availability().filter((w) => w.end > w.start);
    if (availability.length === 0) return this.errorMsg.set(this.copy.errNeedAvailability);

    const config: BookingConfigInput = {
      displayName: this.form.displayName.trim(),
      timeZone: this.form.timeZone,
      meetingTypes: types,
      availability,
      slotIntervalMinutes: this.form.slotIntervalMinutes,
      minNoticeHours: this.form.minNoticeHours,
      maxAdvanceDays: this.form.maxAdvanceDays,
    };

    this.mode.set('saving');
    try {
      let token = this.readToken();
      if (!token) {
        const reg = await this.api.register(config.displayName, config.timeZone);
        token = reg.deviceToken;
        this.feedUrl = reg.feedUrl;
        this.writeToken(token, reg.feedUrl);
      }
      const saved = await this.api.saveBooking(token, config);
      this.savedConfig.set(saved.config);
      this.result.set(saved);
      this.mode.set('done');
    } catch (e) {
      this.errorMsg.set(e instanceof BookingError ? e.message : this.copy.errGeneric);
      this.mode.set('form');
    }
  }

  protected async copyLink(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.shareUrl);
      this.copiedLink.set(true);
      setTimeout(() => this.copiedLink.set(false), 1800);
    } catch {
      /* clipboard blocked — the link is visible to select by hand */
    }
  }

  protected editAgain(): void {
    this.mode.set('form');
    this.editing.set(true);
    void this.loadBookings();
  }

  // ── incoming-booking management ──────────────────────────────────────────

  /** Pull the owner's bookings for the list. Quiet on failure — the rest of the
   *  page (editing availability) must still work if this call hiccups. */
  private async loadBookings(): Promise<void> {
    const token = this.readToken();
    if (!token) return;
    this.bookingsLoading.set(true);
    this.manageError.set(null);
    try {
      this.bookings.set(await this.api.ownerBookings(token));
    } catch {
      /* leave the list as it was; the manage panel simply shows what it has */
    } finally {
      this.bookingsLoading.set(false);
    }
  }

  /** Decline (cancel) a booking. The guest is notified by the API. */
  protected async decline(ev: OwnerBooking): Promise<void> {
    const token = this.readToken();
    if (!token) return;
    if (typeof confirm === 'function' && !confirm(this.manageCopy.declineConfirm)) return;
    this.manageError.set(null);
    this.busyId.set(ev.id);
    try {
      await this.api.ownerCancel(token, ev.id);
      this.closeReschedule();
      await this.loadBookings();
    } catch {
      this.manageError.set(this.manageCopy.error);
    } finally {
      this.busyId.set(null);
    }
  }

  /** Open (or close) the new-time picker for one booking, loading its options. */
  protected async toggleReschedule(ev: OwnerBooking): Promise<void> {
    if (this.reschedulingId() === ev.id) return this.closeReschedule();
    const token = this.readToken();
    const config = this.savedConfig();
    if (!token || !config) return;

    this.reschedulingId.set(ev.id);
    this.rescheduleGroups.set([]);
    this.rescheduleLoading.set(true);
    this.manageError.set(null);
    try {
      // Match the booking to the meeting type of the same length so the offered
      // slots have the right duration; fall back to the first type.
      const durationMin = Math.round(
        (new Date(ev.end).getTime() - new Date(ev.start).getTime()) / 60000,
      );
      const type =
        config.meetingTypes.find((t) => t.durationMinutes === durationMin) ??
        config.meetingTypes[0];
      const from = new Date().toISOString().slice(0, 10);
      const to = new Date(Date.now() + 14 * 86400_000).toISOString().slice(0, 10);
      const slots = await this.api.slots(config.handle, type.id, from, to);
      this.rescheduleGroups.set(this.groupByDay(slots.map((s) => s.start), config.timeZone));
    } catch {
      this.manageError.set(this.manageCopy.error);
    } finally {
      this.rescheduleLoading.set(false);
    }
  }

  /** Commit a move to the chosen start time. */
  protected async pickNewTime(ev: OwnerBooking, start: string): Promise<void> {
    const token = this.readToken();
    if (!token) return;
    this.manageError.set(null);
    this.busyId.set(ev.id);
    try {
      await this.api.ownerReschedule(token, ev.id, start);
      this.closeReschedule();
      await this.loadBookings();
    } catch {
      this.manageError.set(this.manageCopy.error);
    } finally {
      this.busyId.set(null);
    }
  }

  protected closeReschedule(): void {
    this.reschedulingId.set(null);
    this.rescheduleGroups.set([]);
  }

  /** A booking's time, in the owner's own zone, for the list row. */
  protected whenLabel(iso: string): string {
    const tz = this.savedConfig()?.timeZone || this.form.timeZone;
    try {
      return new Intl.DateTimeFormat(this.locale.code, {
        timeZone: tz, weekday: 'short', month: 'short', day: 'numeric',
        hour: 'numeric', minute: '2-digit',
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  }

  /** Fold a flat list of slot start times into day groups for the picker. */
  private groupByDay(starts: string[], tz: string): { label: string; slots: { start: string; time: string }[] }[] {
    const dayFmt = new Intl.DateTimeFormat(this.locale.code, {
      timeZone: tz, weekday: 'short', month: 'short', day: 'numeric',
    });
    const timeFmt = new Intl.DateTimeFormat(this.locale.code, {
      timeZone: tz, hour: 'numeric', minute: '2-digit',
    });
    const groups: { label: string; slots: { start: string; time: string }[] }[] = [];
    let current: { label: string; slots: { start: string; time: string }[] } | null = null;
    for (const start of starts) {
      const d = new Date(start);
      const label = dayFmt.format(d);
      if (!current || current.label !== label) {
        current = { label, slots: [] };
        groups.push(current);
      }
      current.slots.push({ start, time: timeFmt.format(d) });
    }
    return groups;
  }

  // --- storage & time helpers ---
  private readToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }
  private writeToken(token: string, feed: string): void {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(FEED_KEY, feed);
    } catch {
      /* private mode — the page still works this session */
    }
  }
  private clearToken(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(FEED_KEY);
    } catch {
      /* ignore */
    }
  }
  private weekday(day: number): string {
    // A known Sunday (2024-01-07) plus the day index gives each weekday name.
    return new Intl.DateTimeFormat(this.locale.code, { weekday: 'long' }).format(
      new Date(2024, 0, 7 + day),
    );
  }
}
