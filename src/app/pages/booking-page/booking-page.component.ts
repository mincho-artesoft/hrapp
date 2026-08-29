import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { SeoService } from '../../core/seo.service';
import { DEFAULT_LOCALE, Locale, LOCALES, localePath } from '../../core/locales';
import { APP_DEVELOPER, APP_STORE_URL, SITE_URL } from '../../core/app-facts';
import {
  BookingApiService,
  BookingConfirmation,
  BookingError,
  MeetingType,
  PublicBooking,
  Slot,
} from '../../core/booking-api.service';
import { bookingCopyFor } from '../../content/booking/registry';
import { bookingManageCopyFor } from '../../content/booking/manage-registry';

interface DayColumn {
  date: Date; // local midnight
  key: string; // yyyy-mm-dd local
  weekdayShort: string;
  dayNum: string;
  monthShort: string;
  count: number;
  isToday: boolean;
}

interface PlacedSlot {
  slot: Slot;
  label: string; // local time, e.g. "09:00"
  top: number;
  height: number;
}

const ROW_H = 60; // px per hour
const HORIZON_DAYS = 30;

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './booking-page.component.html',
  styleUrl: './booking-page.component.scss',
})
export class BookingPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly api = inject(BookingApiService);
  private readonly doc = inject(DOCUMENT);

  protected locale: Locale = DEFAULT_LOCALE;
  protected copy = bookingCopyFor(DEFAULT_LOCALE.code);
  protected manageLinkLabel = bookingManageCopyFor(DEFAULT_LOCALE.code).manageLinkLabel;
  /** Where the landing's owner CTA points: the web setup form, in this language. */
  protected setupHref = localePath(DEFAULT_LOCALE, '/book/setup');

  protected readonly mode = signal<'landing' | 'loading' | 'booking' | 'confirmed' | 'error'>('landing');
  protected readonly errorMsg = signal<string | null>(null);

  protected readonly booking = signal<PublicBooking | null>(null);
  protected readonly selectedType = signal<MeetingType | null>(null);
  protected readonly slots = signal<Slot[]>([]);
  protected readonly selectedDayKey = signal<string | null>(null);
  protected readonly selectedSlot = signal<Slot | null>(null);
  protected readonly confirmation = signal<BookingConfirmation | null>(null);
  protected readonly submitting = signal(false);

  protected readonly form = { name: '', email: '', notes: '' };
  protected readonly viewerTz =
    typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC';

  /** Slots grouped into day columns for the date strip. */
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
        monthShort: this.fmt(d, { month: 'short' }),
        count: byDay.get(key) ?? 0,
        isToday: i === 0,
      });
    }
    return out;
  });

  /** The chosen day's slots, positioned on the timeline. */
  protected readonly placed = computed<PlacedSlot[]>(() => {
    const key = this.selectedDayKey();
    const type = this.selectedType();
    if (!key || !type) return [];
    const dur = type.durationMinutes;
    const daySlots = this.slots().filter((s) => this.localKey(new Date(s.start)) === key);
    const min = this.timeline().min;
    return daySlots.map((slot) => {
      const start = new Date(slot.start);
      const mins = start.getHours() * 60 + start.getMinutes() - min * 60;
      return {
        slot,
        label: this.fmt(start, { hour: '2-digit', minute: '2-digit' }),
        top: (mins / 60) * ROW_H,
        height: Math.max(28, (dur / 60) * ROW_H - 4),
      };
    });
  });

  /** Hour range covering the chosen day's slots (with a little padding). */
  protected readonly timeline = computed<{ min: number; max: number; hours: number[] }>(() => {
    const key = this.selectedDayKey();
    const daySlots = key ? this.slots().filter((s) => this.localKey(new Date(s.start)) === key) : [];
    if (daySlots.length === 0) return { min: 9, max: 18, hours: this.range(9, 18) };
    let min = 24;
    let max = 0;
    for (const s of daySlots) {
      const st = new Date(s.start);
      const en = new Date(s.end);
      min = Math.min(min, st.getHours());
      max = Math.max(max, en.getHours() + (en.getMinutes() > 0 ? 1 : 0));
    }
    min = Math.max(0, min - 1);
    max = Math.min(24, max + 1);
    return { min, max, hours: this.range(min, max) };
  });

  protected readonly selectedDayLabel = computed(() => {
    const key = this.selectedDayKey();
    const day = this.days().find((d) => d.key === key);
    return day ? this.fmt(day.date, { weekday: 'long', month: 'long', day: 'numeric' }) : '';
  });

  ngOnInit(): void {
    this.locale = (this.route.snapshot.data['locale'] as Locale) ?? DEFAULT_LOCALE;
    this.copy = bookingCopyFor(this.locale.code);
    this.manageLinkLabel = bookingManageCopyFor(this.locale.code).manageLinkLabel;
    this.setupHref = localePath(this.locale, '/book/setup');

    this.seo.apply({
      title: this.copy.seoTitle,
      description: this.copy.seoDescription,
      path: localePath(this.locale, '/book'),
      locale: this.locale,
      alternates: LOCALES.map((l) => ({ hreflang: l.hreflang, path: localePath(l, '/book') })),
    });

    this.injectJsonLd();

    const handle = this.route.snapshot.queryParamMap.get('c');
    if (handle) void this.load(handle);
    else this.mode.set('landing');
  }

  /**
   * Structured data for the booking tool, matched to the visible landing copy.
   *
   * Injected rather than templated for the same reason the FAQ's is: a
   * <script type="application/ld+json"> written into an Angular template is
   * escaped as text, not parsed. This runs during prerender too — DOCUMENT is
   * provided on the server — so the markup ships in the static HTML a crawler
   * reads without running any JavaScript. The description is the same sentence
   * the page shows, so the two can never drift apart.
   */
  private injectJsonLd(): void {
    const id = 'booking-jsonld';
    this.doc.getElementById(id)?.remove();

    const url = `${SITE_URL}${localePath(this.locale, '/book')}/`;
    const script = this.doc.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: this.copy.seoTitle,
      description: this.copy.landingLead,
      url,
      inLanguage: this.locale.hreflang,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      provider: { '@type': 'Organization', name: APP_DEVELOPER, url: `${SITE_URL}/` },
      isRelatedTo: {
        '@type': 'MobileApplication',
        name: 'Cloud Calendars',
        operatingSystem: 'iOS',
        url: APP_STORE_URL,
      },
    });
    this.doc.head.appendChild(script);
  }

  private async load(handle: string): Promise<void> {
    this.mode.set('loading');
    try {
      const b = await this.api.publicBooking(handle);
      this.booking.set(b);
      const type = b.meetingTypes[0] ?? null;
      this.selectedType.set(type);
      if (type) await this.loadSlots(handle, type);
      this.mode.set('booking');
    } catch (e) {
      this.errorMsg.set(e instanceof BookingError ? e.message : this.copy.genericError);
      this.mode.set('error');
    }
  }

  private async loadSlots(handle: string, type: MeetingType): Promise<void> {
    const from = this.localKey(new Date());
    const to = this.localKey(new Date(Date.now() + HORIZON_DAYS * 86400_000));
    const slots = await this.api.slots(handle, type.id, from, to);
    this.slots.set(slots);
    const firstDay = this.days().find((d) => d.count > 0);
    this.selectedDayKey.set(firstDay?.key ?? this.days()[0]?.key ?? null);
    this.selectedSlot.set(null);
  }

  protected async chooseType(type: MeetingType): Promise<void> {
    this.selectedType.set(type);
    const b = this.booking();
    if (b) await this.loadSlots(b.handle, type);
  }

  protected chooseDay(key: string): void {
    this.selectedDayKey.set(key);
    this.selectedSlot.set(null);
  }

  protected chooseSlot(slot: Slot): void {
    this.selectedSlot.set(slot);
  }

  protected clearSlot(): void {
    this.selectedSlot.set(null);
  }

  protected async submit(): Promise<void> {
    const b = this.booking();
    const type = this.selectedType();
    const slot = this.selectedSlot();
    if (!b || !type || !slot || !this.form.name.trim() || !this.form.email.trim()) return;
    this.submitting.set(true);
    this.errorMsg.set(null);
    try {
      const conf = await this.api.book(b.handle, {
        type: type.id,
        start: slot.start,
        name: this.form.name.trim(),
        email: this.form.email.trim(),
        notes: this.form.notes.trim() || undefined,
      });
      this.confirmation.set(conf);
      this.mode.set('confirmed');
    } catch (e) {
      if (e instanceof BookingError && e.status === 409) {
        // Someone took it first. Refresh the slots and let them pick again.
        this.errorMsg.set(this.copy.slotTaken);
        this.selectedSlot.set(null);
        if (type) await this.loadSlots(b.handle, type);
      } else {
        this.errorMsg.set(e instanceof BookingError ? e.message : this.copy.genericError);
      }
    } finally {
      this.submitting.set(false);
    }
  }

  /** Hour-gutter label, localised — "9 AM" / "9時" / "٩ ص" / "09" by locale. */
  protected hourLabel(h: number): string {
    return this.fmt(new Date(2000, 0, 1, h), { hour: 'numeric' });
  }

  protected slotRange(slot: Slot): string {
    const s = this.fmt(new Date(slot.start), { hour: '2-digit', minute: '2-digit' });
    const e = this.fmt(new Date(slot.end), { hour: '2-digit', minute: '2-digit' });
    return `${s} – ${e}`;
  }

  protected initials(name: string): string {
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0])
      .join('')
      .toUpperCase();
  }

  // --- small helpers ---
  private range(a: number, b: number): number[] {
    return Array.from({ length: b - a + 1 }, (_, i) => a + i);
  }
  private localKey(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  private fmt(d: Date, opts: Intl.DateTimeFormatOptions): string {
    return new Intl.DateTimeFormat(this.locale.code, opts).format(d);
  }
}
