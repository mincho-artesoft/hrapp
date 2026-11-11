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
  computeIosEventStyle,
  detectBrowserTimeZone,
  downloadIcsFile,
} from '../../core/ios-event-palette';

@Component({
  selector: 'app-booking-manage-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './booking-manage-page.component.html',
  styleUrl: './booking-manage-page.component.scss',
})
export class BookingManagePageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  readonly api = inject(CalendarPlatformApiService);

  protected locale: Locale = DEFAULT_LOCALE;
  private token = '';

  readonly state = signal<'loading' | 'ready' | 'notfound'>('loading');
  readonly booking = signal<ManagedBookingRecord | null>(null);
  readonly mode = signal<'view' | 'reschedule' | 'cancel'>('view');
  readonly slots = signal<BookingSlot[]>([]);
  readonly chosenSlot = signal('');
  readonly reason = signal('');
  readonly busy = signal(false);
  readonly feedback = signal<string | null>(null);

  readonly guestPortalHref = computed(() => linkPath(this.locale, '/bookings'));
  readonly homeHref = computed(() => linkPath(this.locale, '/'));

  async ngOnInit(): Promise<void> {
    this.locale = (this.route.snapshot.data['locale'] as Locale) ?? DEFAULT_LOCALE;
    this.seo.apply({
      title: 'Manage Booking — Cloud Calendars',
      description: 'Reschedule, cancel, or export your booked appointment.',
      path: localePath(this.locale, '/booking/manage'),
      locale: this.locale,
      noindex: true,
      alternates: LOCALES.map((l) => ({
        hreflang: l.hreflang,
        path: localePath(l, '/booking/manage'),
      })),
    });

    if (!this.isBrowser) return;
    this.token = (this.route.snapshot.queryParamMap.get('t') || '').trim();
    if (!this.token) {
      this.state.set('notfound');
      return;
    }
    await this.load();
  }

  private async load(): Promise<void> {
    this.state.set('loading');
    try {
      const res = await this.api.getManagedBooking(this.token);
      this.booking.set(res.booking);
      this.state.set('ready');
    } catch {
      this.state.set('notfound');
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
    const d = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(b.start));
    const tf = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return `${d} · ${tf.format(new Date(b.start))} – ${tf.format(new Date(b.end))} (${tz})`;
  }

  formatSlot(s: BookingSlot, tz: string): string {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: tz || detectBrowserTimeZone(),
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date(s.start));
  }

  async startReschedule(): Promise<void> {
    const b = this.booking();
    if (!b) return;
    this.mode.set('reschedule');
    this.feedback.set(null);
    this.busy.set(true);
    try {
      const res = await this.api.getPublicBookingSlots(b.hostHandle, {
        type: b.meetingTypeId,
        excludeEventId: b.eventId,
      });
      this.slots.set((res.slots ?? []).slice(0, 40));
      if (res.slots?.length) this.chosenSlot.set(res.slots[0].start);
    } finally {
      this.busy.set(false);
    }
  }

  async submitReschedule(): Promise<void> {
    if (!this.chosenSlot()) return;
    this.busy.set(true);
    this.feedback.set(null);
    try {
      const res = await this.api.rescheduleManagedBooking(this.token, {
        start: this.chosenSlot(),
        reason: this.reason().trim() || undefined,
      });
      this.booking.set(res.booking);
      this.mode.set('view');
      this.feedback.set('Your meeting has been moved and an updated .ics invite was emailed.');
    } catch (e) {
      this.feedback.set(e instanceof Error ? e.message : 'Could not reschedule.');
    } finally {
      this.busy.set(false);
    }
  }

  async submitCancel(): Promise<void> {
    this.busy.set(true);
    this.feedback.set(null);
    try {
      const res = await this.api.cancelManagedBooking(this.token, {
        reason: this.reason().trim() || undefined,
      });
      this.booking.set(res.booking);
      this.mode.set('view');
      this.feedback.set('This booking has been cancelled and both calendars were updated.');
    } catch (e) {
      this.feedback.set(e instanceof Error ? e.message : 'Could not cancel booking.');
    } finally {
      this.busy.set(false);
    }
  }

  downloadIcs(): void {
    const b = this.booking();
    if (b?.icsContent) downloadIcsFile(b.title || 'booking', b.icsContent);
  }

  googleUrl(): string {
    const b = this.booking();
    if (!b) return '#';
    return buildGoogleCalendarUrl({
      title: b.title,
      start: b.start,
      end: b.end,
      location: b.videoCallURL || b.location || undefined,
    });
  }

  outlookUrl(): string {
    const b = this.booking();
    if (!b) return '#';
    return buildOutlookCalendarUrl({
      title: b.title,
      start: b.start,
      end: b.end,
      location: b.videoCallURL || b.location || undefined,
    });
  }
}
