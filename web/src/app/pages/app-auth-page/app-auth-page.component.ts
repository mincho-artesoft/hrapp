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
import { ActivatedRoute } from '@angular/router';
import { APP_STORE_URL } from '../../core/app-facts';
import { DEFAULT_LOCALE, Locale, linkPath, localePath } from '../../core/locales';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-auth-handoff-page',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="handoff-wrap shell">
      <div class="handoff-card">
        <span class="handoff-badge">CLOUD CALENDARS iOS × WEB</span>
        <h1>Sign in &amp; unlock Web Studio for free</h1>
        <p class="handoff-sub">
          Approve your browser sign-in in the <strong>Cloud Calendars</strong> iPhone or iPad app to
          unlock the full Web Calendar, Event &amp; Booking Studio for free forever — plus your
          built-in 6-digit Web Authenticator code.
        </p>

        @if (deepLinkUrl(); as deepLink) {
          <a class="handoff-btn handoff-btn--primary" [href]="deepLink">
            Open in Cloud Calendars App →
          </a>
        }

        <a
          class="handoff-btn handoff-btn--store"
          [href]="appStoreUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download Free on the App Store
        </a>

        <p class="handoff-note">
          Once installed, tap <strong>Open in Cloud Calendars App</strong> above (or rescan the QR
          code on your computer screen) and tap <strong>Approve Sign-In</strong>.
        </p>

        <a class="handoff-back" [href]="calendarHref()">← Back to Web Calendar</a>
      </div>
    </section>
  `,
  styles: [
    `
      .handoff-wrap {
        min-height: calc(100vh - 160px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 3rem 1.25rem;
      }
      .handoff-card {
        max-width: 480px;
        width: 100%;
        padding: 2.2rem;
        border-radius: 26px;
        background: linear-gradient(165deg, rgba(19, 26, 54, 0.94), rgba(9, 13, 28, 0.97));
        border: 1px solid rgba(255, 255, 255, 0.14);
        box-shadow: 0 28px 80px -24px rgba(0, 0, 0, 0.85);
        text-align: center;
      }
      .handoff-badge {
        display: inline-block;
        padding: 0.3rem 0.78rem;
        border-radius: 999px;
        font-family: var(--font-mono);
        font-size: 0.68rem;
        letter-spacing: 0.13em;
        color: #8ef3ff;
        background: rgba(56, 224, 240, 0.12);
        border: 1px solid rgba(56, 224, 240, 0.28);
        margin-bottom: 1rem;
      }
      h1 {
        font-size: clamp(1.45rem, 3vw, 1.85rem);
        line-height: 1.18;
        margin: 0 0 0.75rem;
      }
      .handoff-sub {
        font-size: 0.94rem;
        line-height: 1.58;
        color: rgba(230, 236, 255, 0.78);
        margin: 0 0 1.5rem;
      }
      .handoff-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: 0.9rem 1.2rem;
        border-radius: 14px;
        font-weight: 700;
        font-size: 0.95rem;
        text-decoration: none;
        margin-bottom: 0.75rem;
        transition: transform 0.18s ease, opacity 0.18s ease;
      }
      .handoff-btn:hover {
        transform: translateY(-1px);
      }
      .handoff-btn--primary {
        background: linear-gradient(135deg, #0a84ff, #38e0f0);
        color: #041024;
      }
      .handoff-btn--store {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.18);
        color: #ffffff;
      }
      .handoff-note {
        font-size: 0.82rem;
        line-height: 1.5;
        color: rgba(230, 236, 255, 0.62);
        margin: 0.8rem 0 1.25rem;
      }
      .handoff-back {
        font-size: 0.84rem;
        color: #8ef3ff;
        text-decoration: underline;
        text-underline-offset: 3px;
      }
    `,
  ],
})
export class AppAuthPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly appStoreUrl = APP_STORE_URL;
  protected locale: Locale = DEFAULT_LOCALE;
  readonly challengeId = signal<string>('');

  readonly deepLinkUrl = computed(() => {
    const id = this.challengeId();
    return id ? `cloudcalendars://app-auth?c=${encodeURIComponent(id)}` : null;
  });

  readonly calendarHref = computed(() => linkPath(this.locale, '/calendar'));

  ngOnInit(): void {
    this.locale = (this.route.snapshot.data['locale'] as Locale) ?? DEFAULT_LOCALE;
    this.seo.apply({
      title: 'Sign in with Cloud Calendars iOS',
      description: 'Approve your Cloud Calendars Web sign-in from the Cloud Calendars iOS app.',
      path: localePath(this.locale, '/app-auth'),
      locale: this.locale,
      robots: 'noindex,follow',
    });

    if (!this.isBrowser) return;
    const c = (this.route.snapshot.queryParamMap.get('c') || '').trim();
    if (/^[A-Za-z0-9_-]{12,64}$/.test(c)) {
      this.challengeId.set(c);
      // Attempt automatic handoff to custom URL scheme if opened inside mobile Safari
      setTimeout(() => {
        window.location.href = `cloudcalendars://app-auth?c=${encodeURIComponent(c)}`;
      }, 250);
    }
  }
}
