import {
  ChangeDetectionStrategy,
  Component,
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
  CalendarPlatformApiService,
  ManagedBookingRecord,
} from '../../core/calendar-platform-api.service';
import {
  buildGoogleCalendarUrl,
  buildOutlookCalendarUrl,
  buildSingleEventIcs,
  computeIosEventStyle,
  detectBrowserTimeZone,
  downloadIcsFile,
} from '../../core/ios-event-palette';
import { PlatformAuthCardComponent } from '../../components/platform-auth-card/platform-auth-card.component';

@Component({
  selector: 'app-guest-bookings-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PlatformAuthCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './guest-bookings-page.component.html',
  styleUrl: './guest-bookings-page.component.scss',
})
export class GuestBookingsPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  readonly api = inject(CalendarPlatformApiService);

  protected locale: Locale = DEFAULT_LOCALE;

  readonly loading = signal(false);
  readonly filter = signal<'upcoming' | 'past' | 'cancelled'>('upcoming');
  readonly bookings = signal<ManagedBookingRecord[]>([]);
  readonly toast = signal<string | null>(null);

  // Reschedule modal state
  readonly activeBooking = signal<ManagedBookingRecord | null>(null);
  readonly modalMode = signal<'reschedule' | 'cancel' | null>(null);
  readonly liveSlots = signal<BookingSlot[]>([]);
  readonly loadingSlots = signal(false);
  readonly chosenNewStart = signal<string>('');
  readonly actionReason = signal<string>('');
  readonly acting = signal(false);

  readonly hostStudioHref = computed(() => `${linkPath(this.locale, '/calendar')}?tab=availability`);
  readonly calendarHref = computed(() => linkPath(this.locale, '/calendar'));
  readonly adminHref = computed(() => linkPath(this.locale, '/admin'));

  readonly filteredBookings = computed(() => {
    const f = this.filter();
    const now = Date.now();
    return this.bookings().filter((b) => {
      if (f === 'cancelled') return b.status === 'cancelled';
      if (b.status === 'cancelled') return false;
      const endMs = Date.parse(b.end);
      return f === 'upcoming' ? endMs >= now : endMs < now;
    });
  });

  async ngOnInit(): Promise<void> {
    this.locale = (this.route.snapshot.data['locale'] as Locale) ?? DEFAULT_LOCALE;
    this.seo.apply({
      title: 'My Booked Meetings — Cloud Calendars Guest Portal',
      description: 'View, join, reschedule, or cancel appointments you booked on Cloud Calendars.',
      path: localePath(this.locale, '/bookings'),
      locale: this.locale,
      noindex: true,
      alternates: LOCALES.map((l) => ({ hreflang: l.hreflang, path: localePath(l, '/bookings') })),
    });

    if (!this.isBrowser) return;
    await this.api.ensureInitialized();
    if (this.api.isSignedInWithAccount()) {
      await this.loadGuestBookings();
    }
  }

  async onSignedIn(): Promise<void> {
    await this.loadGuestBookings();
  }

  async loadGuestBookings(): Promise<void> {
    this.loading.set(true);
    try {
      const res = await this.api.getGuestBookings();
      this.bookings.set(res.bookings ?? []);
    } finally {
      this.loading.set(false);
    }
  }

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

  formatWhen(b: ManagedBookingRecord): string {
    const tz = b.guestTimeZone || detectBrowserTimeZone();
    const day = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(b.start));
    const tf = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return `${day} · ${tf.format(new Date(b.start))} – ${tf.format(new Date(b.end))} (${tz})`;
  }

  formatSlotLabel(slot: BookingSlot, tz: string): string {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: tz || detectBrowserTimeZone(),
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date(slot.start));
  }

  async openRescheduleModal(b: ManagedBookingRecord): Promise<void> {
    this.activeBooking.set(b);
    this.modalMode.set('reschedule');
    this.chosenNewStart.set('');
    this.actionReason.set('');
    this.loadingSlots.set(true);
    try {
      const res = await this.api.getPublicBookingSlots(b.hostHandle, {
        type: b.meetingTypeId,
      });
      this.liveSlots.set((res.slots ?? []).slice(0, 36));
      if (res.slots?.length) {
        this.chosenNewStart.set(res.slots[0].start);
      }
    } catch {
      this.liveSlots.set([]);
    } finally {
      this.loadingSlots.set(false);
    }
  }

  openCancelModal(b: ManagedBookingRecord): void {
    this.activeBooking.set(b);
    this.modalMode.set('cancel');
    this.actionReason.set('');
  }

  closeModal(): void {
    this.activeBooking.set(null);
    this.modalMode.set(null);
  }

  async confirmReschedule(): Promise<void> {
    const b = this.activeBooking();
    const nextStart = this.chosenNewStart();
    if (!b || !nextStart) return;
    this.acting.set(true);
    try {
      await this.api.rescheduleManagedBooking(b.manageToken, {
        start: nextStart,
        reason: this.actionReason().trim() || undefined,
      });
      this.closeModal();
      await this.loadGuestBookings();
      this.notify('Appointment rescheduled! Confirmation sent to your email.');
    } catch (e) {
      this.notify(e instanceof Error ? e.message : 'Could not reschedule.');
    } finally {
      this.acting.set(false);
    }
  }

  async confirmCancel(): Promise<void> {
    const b = this.activeBooking();
    if (!b) return;
    this.acting.set(true);
    try {
      await this.api.cancelManagedBooking(b.manageToken, {
        reason: this.actionReason().trim() || undefined,
      });
      this.closeModal();
      await this.loadGuestBookings();
      this.notify('Appointment cancelled.');
    } catch (e) {
      this.notify(e instanceof Error ? e.message : 'Could not cancel.');
    } finally {
      this.acting.set(false);
    }
  }

  downloadBookingIcs(b: ManagedBookingRecord): void {
    const ics =
      b.icsContent ||
      buildSingleEventIcs({
        uid: `${b.bookingId}@cloud-calendars.com`,
        title: b.title,
        start: b.start,
        end: b.end,
        location: b.videoCallURL || b.location || undefined,
      });
    downloadIcsFile(b.title || 'meeting', ics);
  }

  googleHref(b: ManagedBookingRecord): string {
    return buildGoogleCalendarUrl({
      title: b.title,
      start: b.start,
      end: b.end,
      location: b.videoCallURL || b.location || undefined,
    });
  }

  outlookHref(b: ManagedBookingRecord): string {
    return buildOutlookCalendarUrl({
      title: b.title,
      start: b.start,
      end: b.end,
      location: b.videoCallURL || b.location || undefined,
    });
  }

  private notify(msg: string): void {
    this.toast.set(msg);
    setTimeout(() => this.toast.set(null), 5000);
  }
}
