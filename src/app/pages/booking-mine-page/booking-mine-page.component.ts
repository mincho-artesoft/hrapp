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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { SeoService } from '../../core/seo.service';
import { DEFAULT_LOCALE, Locale, localePath } from '../../core/locales';
import { BookingApiService, BookingError, MyBooking } from '../../core/booking-api.service';
import { bookingMineCopyFor } from '../../content/booking/mine-registry';

@Component({
  selector: 'app-booking-mine-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './booking-mine-page.component.html',
  styleUrl: './booking-mine-page.component.scss',
})
export class BookingMinePageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  private readonly api = inject(BookingApiService);

  protected locale: Locale = DEFAULT_LOCALE;
  protected copy = bookingMineCopyFor(DEFAULT_LOCALE.code);

  protected readonly mode = signal<'signin' | 'sent' | 'loading' | 'list' | 'error'>('signin');
  protected readonly errorMsg = signal<string | null>(null);
  protected readonly submitting = signal(false);
  protected readonly email = signal('');
  protected readonly signedInEmail = signal('');
  protected readonly bookings = signal<MyBooking[]>([]);

  private session = '';

  protected readonly upcoming = computed(() =>
    this.bookings()
      .filter((b) => b.status !== 'cancelled' && new Date(b.end).getTime() >= Date.now())
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()),
  );
  protected readonly past = computed(() =>
    this.bookings()
      .filter((b) => b.status === 'cancelled' || new Date(b.end).getTime() < Date.now())
      .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()),
  );

  ngOnInit(): void {
    this.locale = (this.route.snapshot.data['locale'] as Locale) ?? DEFAULT_LOCALE;
    this.copy = bookingMineCopyFor(this.locale.code);
    this.seo.apply({
      title: this.copy.seoTitle,
      description: this.copy.seoDescription,
      path: localePath(this.locale, '/bookings'),
      locale: this.locale,
      noindex: true,
    });

    this.session = this.route.snapshot.queryParamMap.get('s') ?? '';
    if (this.session) void this.load();
    else this.mode.set('signin');
  }

  private async load(): Promise<void> {
    this.mode.set('loading');
    try {
      const res = await this.api.myBookings(this.session);
      this.signedInEmail.set(res.email);
      this.bookings.set(res.bookings);
      this.mode.set('list');
    } catch (e) {
      if (e instanceof BookingError && e.status === 401) {
        this.errorMsg.set(this.copy.expired);
      } else {
        this.errorMsg.set(this.copy.genericError);
      }
      this.mode.set('error');
    }
  }

  protected async sendLink(): Promise<void> {
    const email = this.email().trim();
    if (!email.includes('@')) return;
    this.submitting.set(true);
    this.errorMsg.set(null);
    try {
      await this.api.login(email);
      this.mode.set('sent');
    } catch {
      this.errorMsg.set(this.copy.genericError);
    } finally {
      this.submitting.set(false);
    }
  }

  protected signOut(): void {
    this.bookings.set([]);
    this.signedInEmail.set('');
    this.mode.set('signin');
    void this.router.navigate([], { queryParams: {} });
  }

  protected when(b: MyBooking): string {
    const d = this.fmt(new Date(b.start), {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const e = this.fmt(new Date(b.end), { hour: '2-digit', minute: '2-digit' });
    return `${d} – ${e}`;
  }

  private fmt(d: Date, opts: Intl.DateTimeFormatOptions): string {
    return new Intl.DateTimeFormat(this.locale.code, opts).format(d);
  }
}
