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
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import qrcode from 'qrcode-generator';

import { SeoService } from '../../core/seo.service';
import { DEFAULT_LOCALE, Locale, LOCALES, localePath } from '../../core/locales';
import { BookingApiService } from '../../core/booking-api.service';
import { bookingLinkCopyFor } from '../../content/booking/link-registry';

const TOKEN_KEY = 'cc_booking_token';
const FEED_KEY = 'cc_booking_feed';
const PAIR_ORIGIN = 'https://www.cloud-calendars.com';

type Phase = 'loading' | 'waiting' | 'approved' | 'expired' | 'error';

@Component({
  selector: 'app-booking-link-page',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './booking-link-page.component.html',
  styleUrl: './booking-link-page.component.scss',
})
export class BookingLinkPageComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly api = inject(BookingApiService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected locale: Locale = DEFAULT_LOCALE;
  protected copy = bookingLinkCopyFor(DEFAULT_LOCALE.code);

  protected readonly phase = signal<Phase>('loading');
  protected readonly qr = signal<SafeHtml | null>(null);
  /** The universal link the QR encodes; also the same-device "open app" target. */
  protected readonly pairUrl = signal<string>('');

  private code = '';
  private secret = '';
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private expiryTimer: ReturnType<typeof setTimeout> | null = null;

  protected readonly isRtl = computed(() => this.locale.dir === 'rtl');

  async ngOnInit(): Promise<void> {
    this.locale = (this.route.snapshot.data['locale'] as Locale) ?? DEFAULT_LOCALE;
    this.copy = bookingLinkCopyFor(this.locale.code);

    this.seo.apply({
      title: this.copy.seoTitle,
      description: this.copy.seoDescription,
      path: localePath(this.locale, '/book/link'),
      locale: this.locale,
      noindex: true, // a tool behind an owner action, not a page to rank
      alternates: LOCALES.map((l) => ({ hreflang: l.hreflang, path: localePath(l, '/book/link') })),
    });

    if (this.isBrowser) await this.begin();
  }

  ngOnDestroy(): void {
    this.stopTimers();
  }

  /** Start (or restart) a pairing: fetch a code, draw the QR, poll for approval. */
  protected async begin(): Promise<void> {
    this.stopTimers();
    this.phase.set('loading');
    this.qr.set(null);
    try {
      const { code, secret, expiresInSeconds } = await this.api.pairStart();
      this.code = code;
      this.secret = secret;
      const url = `${PAIR_ORIGIN}/pair?code=${encodeURIComponent(code)}`;
      this.pairUrl.set(url);
      this.qr.set(this.makeQr(url));
      this.phase.set('waiting');

      this.pollTimer = setInterval(() => void this.poll(), 2500);
      // A little past the server's TTL, give up locally so the UI doesn't poll forever.
      this.expiryTimer = setTimeout(() => {
        if (this.phase() === 'waiting') {
          this.stopTimers();
          this.phase.set('expired');
        }
      }, (expiresInSeconds + 5) * 1000);
    } catch {
      this.phase.set('error');
    }
  }

  private async poll(): Promise<void> {
    try {
      const res = await this.api.pairStatus(this.code, this.secret);
      if (res.status === 'approved' && res.webToken) {
        this.stopTimers();
        this.storeToken(res.webToken);
        this.phase.set('approved');
        // A full navigation so the setup page re-initialises and loads the
        // owner's real booking page with the freshly paired token.
        setTimeout(() => this.goToSetup(), 900);
      } else if (res.status === 'expired') {
        this.stopTimers();
        this.phase.set('expired');
      }
      // 'pending' / 'claimed' — keep waiting.
    } catch {
      /* transient network error mid-poll: let the next tick retry */
    }
  }

  private makeQr(url: string): SafeHtml {
    const qr = qrcode(0, 'M');
    qr.addData(url);
    qr.make();
    const svg = qr.createSvgTag({ cellSize: 6, margin: 2, scalable: true });
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  private storeToken(token: string): void {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      // The paired owner already has the app for their feed; clear any stale
      // standalone-setup feed so the setup page doesn't show the wrong webcal.
      localStorage.removeItem(FEED_KEY);
    } catch {
      /* private mode — the redirect below still carries no token, but rare */
    }
  }

  protected setupPath(): string {
    return localePath(this.locale, '/book/setup') + '/';
  }

  private goToSetup(): void {
    if (this.isBrowser) window.location.assign(this.setupPath());
  }

  private stopTimers(): void {
    if (this.pollTimer) clearInterval(this.pollTimer);
    if (this.expiryTimer) clearTimeout(this.expiryTimer);
    this.pollTimer = null;
    this.expiryTimer = null;
  }
}
