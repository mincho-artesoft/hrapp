import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { SeoService } from '../../core/seo.service';
import { DEFAULT_LOCALE, Locale, localePath } from '../../core/locales';
import { BookingApiService, BookingError, ManageBooking, Slot } from '../../core/booking-api.service';
import { bookingManageCopyFor } from '../../content/booking/manage-registry';

interface DayColumn {
  date: Date;
  key: string;
  weekdayShort: string;
  dayNum: string;
  count: number;
  isToday: boolean;
}

const HORIZON_DAYS = 30;

@Component({
  selector: 'app-booking-manage-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './booking-manage-page.component.html',
  styleUrl: './booking-manage-page.component.scss',
})
export class BookingManagePageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly api = inject(BookingApiService);

  protected locale: Locale = DEFAULT_LOCALE;
  protected copy = bookingManageCopyFor(DEFAULT_LOCALE.code);

  protected readonly mode = signal<
    'loading' | 'view' | 'reschedule' | 'confirm' | 'moved' | 'cancel' | 'cancelled' | 'error'
  >('loading');
  protected readonly errorMsg = signal<string | null>(null);
  protected readonly booking = signal<ManageBooking | null>(null);
  protected readonly submitting = signal(false);

  private token = '';
  protected readonly slots = signal<Slot[]>([]);
  protected readonly selectedDayKey = signal<string | null>(null);
  protected readonly selectedSlot = signal<Slot | null>(null);

  protected readonly viewerTz =
    typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC';

  protected readonly days = computed<DayColumn[]>(() => {
    const byDay = new Map<string, number>();
    for (const s of this.slots()) {
      const k = this.localKey(new Date(s.start));
      byDay.set(k, (byDay.get(k) ?? 0) + 1);
    }
    const out: DayColumn[] = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      const key = this.localKey(d);
      out.push({
        date: d,
        key,
        weekdayShort: this.fmt(d, { weekday: 'short' }),
        dayNum: this.fmt(d, { day: 'numeric' }),
        count: byDay.get(key) ?? 0,
        isToday: i === 0,
      });
    }
    return out;
  });

  protected readonly dayTimes = computed<Slot[]>(() => {
    const key = this.selectedDayKey();
    if (!key) return [];
    return this.slots().filter((s) => this.localKey(new Date(s.start)) === key);
  });

  ngOnInit(): void {
    this.locale = (this.route.snapshot.data['locale'] as Locale) ?? DEFAULT_LOCALE;
    this.copy = bookingManageCopyFor(this.locale.code);
    this.seo.apply({
      title: this.copy.seoTitle,
      description: this.copy.seoDescription,
      path: localePath(this.locale, '/booking/manage'),
      locale: this.locale,
      noindex: true,
    });

    this.token = this.route.snapshot.queryParamMap.get('t') ?? '';
    if (!this.token) {
      this.errorMsg.set(this.copy.notFound);
      this.mode.set('error');
      return;
    }
    void this.load();
  }

  private async load(): Promise<void> {
    this.mode.set('loading');
    try {
      const b = await this.api.manage(this.token);
      this.booking.set(b);
      this.mode.set(b.cancelled ? 'cancelled' : 'view');
    } catch (e) {
      this.errorMsg.set(
        e instanceof BookingError && e.status === 404 ? this.copy.notFound : this.copy.genericError,
      );
      this.mode.set('error');
    }
  }

  protected async startReschedule(): Promise<void> {
    const b = this.booking();
    if (!b?.type) return;
    this.mode.set('reschedule');
    const from = this.localKey(new Date());
    const to = this.localKey(new Date(Date.now() + HORIZON_DAYS * 86400_000));
    try {
      const slots = await this.api.slots(b.handle, b.type.id, from, to);
      this.slots.set(slots);
      const firstDay = this.days().find((d) => d.count > 0);
      this.selectedDayKey.set(firstDay?.key ?? this.days()[0]?.key ?? null);
    } catch {
      this.errorMsg.set(this.copy.genericError);
      this.mode.set('error');
    }
  }

  protected chooseDay(key: string): void {
    this.selectedDayKey.set(key);
  }

  protected chooseSlot(slot: Slot): void {
    this.selectedSlot.set(slot);
    this.mode.set('confirm');
  }

  protected backToPick(): void {
    this.selectedSlot.set(null);
    this.mode.set('reschedule');
  }

  protected async confirmMove(): Promise<void> {
    const slot = this.selectedSlot();
    if (!slot) return;
    this.submitting.set(true);
    this.errorMsg.set(null);
    try {
      await this.api.reschedule(this.token, slot.start);
      this.mode.set('moved');
    } catch (e) {
      if (e instanceof BookingError && e.status === 409) {
        this.errorMsg.set(this.copy.slotTaken);
        this.selectedSlot.set(null);
        await this.startReschedule();
      } else {
        this.errorMsg.set(e instanceof BookingError ? e.message : this.copy.genericError);
      }
    } finally {
      this.submitting.set(false);
    }
  }

  protected askCancel(): void {
    this.mode.set('cancel');
  }

  protected backToView(): void {
    this.mode.set('view');
  }

  protected async confirmCancel(): Promise<void> {
    this.submitting.set(true);
    this.errorMsg.set(null);
    try {
      await this.api.cancelBooking(this.token);
      this.mode.set('cancelled');
    } catch (e) {
      this.errorMsg.set(e instanceof BookingError ? e.message : this.copy.genericError);
      this.mode.set('view');
    } finally {
      this.submitting.set(false);
    }
  }

  // --- formatting ---
  protected currentWhen(): string {
    const b = this.booking();
    if (!b) return '';
    return this.range(b.event.start, b.event.end);
  }
  protected slotTime(slot: Slot): string {
    return this.fmt(new Date(slot.start), { hour: '2-digit', minute: '2-digit' });
  }
  protected selectedDayLabel(): string {
    const key = this.selectedDayKey();
    const day = this.days().find((d) => d.key === key);
    return day ? this.fmt(day.date, { weekday: 'long', month: 'long', day: 'numeric' }) : '';
  }
  protected selectedSlotRange(): string {
    const s = this.selectedSlot();
    return s ? this.range(s.start, s.end) : '';
  }

  private range(startISO: string, endISO: string): string {
    const s = this.fmt(new Date(startISO), { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const e = this.fmt(new Date(endISO), { hour: '2-digit', minute: '2-digit' });
    return `${s} – ${e}`;
  }
  private localKey(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  private fmt(d: Date, opts: Intl.DateTimeFormatOptions): string {
    return new Intl.DateTimeFormat(this.locale.code, opts).format(d);
  }
}
