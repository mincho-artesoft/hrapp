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
  BookingConfigInput,
  BookingError,
  SavedBooking,
} from '../../core/booking-api.service';
import { bookingSetupCopyFor } from '../../content/booking/setup-registry';
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

  protected readonly mode = signal<'form' | 'saving' | 'done'>('form');
  protected readonly errorMsg = signal<string | null>(null);
  protected readonly result = signal<SavedBooking | null>(null);
  protected readonly editing = signal(false);
  protected readonly copiedLink = signal(false);

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
      this.feedUrl = localStorage.getItem(FEED_KEY) ?? '';
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
    } catch {
      // A stale or revoked token: fall back to a fresh form rather than trap them.
      this.clearToken();
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
