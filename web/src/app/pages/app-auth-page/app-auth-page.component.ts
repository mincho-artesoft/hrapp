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
          unlock the full Web Calendar &amp; Event Studio for free forever — plus your
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
        max-width: 460px;
        width: 100%;
        padding: 2rem;
        border-radius: 22px;
        background: var(--surface, #1c1c1e);
        border: 1px solid var(--hair, #2c2c2e);
        box-shadow: var(--shadow-mid);
        text-align: center;
      }
      .handoff-badge {
        display: inline-block;
        padding: 0.28rem 0.72rem;
        border-radius: 999px;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.04em;
        color: var(--aurora-2);
        background: var(--aurora-1-soft);
        margin-bottom: 0.9rem;
      }
      h1 {
        font-size: clamp(1.4rem, 2.8vw, 1.75rem);
        line-height: 1.18;
        margin: 0 0 0.65rem;
      }
      .handoff-sub {
        font-size: 0.94rem;
        line-height: 1.55;
        color: var(--ink-3);
        margin: 0 0 1.4rem;
      }
      .handoff-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        min-height: 48px;
        padding: 0.82rem 1.2rem;
        border-radius: 14px;
        font-weight: 600;
        font-size: 0.95rem;
        text-decoration: none;
        margin-bottom: 0.65rem;
        transition: background-color 0.18s ease, opacity 0.18s ease;
      }
      .handoff-btn--primary {
        background: var(--aurora-1, #2168de);
        color: #ffffff;
      }
      .handoff-btn--primary:hover {
        background: #2b74eb;
      }
      .handoff-btn--store {
        background: var(--surface-2, #2c2c2e);
        border: 1px solid var(--hair-strong, #38383a);
        color: var(--ink);
      }
      .handoff-note {
        font-size: 0.82rem;
        line-height: 1.5;
        color: var(--ink-3);
        margin: 0.75rem 0 1.15rem;
      }
      .handoff-back {
        font-size: 0.84rem;
        color: var(--accent-link);
        text-decoration: underline;
        text-underline-offset: 3px;
      }
      :host-context([data-theme='light']) {
        .handoff-card {
          background: #ffffff;
          border-color: rgba(15, 23, 42, 0.12);
          box-shadow: var(--shadow-mid);
        }
        .handoff-badge {
          color: #0369a1;
          background: rgba(2, 132, 199, 0.1);
          border-color: rgba(2, 132, 199, 0.26);
        }
        .handoff-sub { color: var(--ink-2); }
        .handoff-note { color: var(--ink-3); }
        .handoff-btn--primary { color: #ffffff; background: linear-gradient(135deg, #2563eb, #0284c7); }
        .handoff-btn--store {
          background: #f1f5f9;
          border-color: rgba(15, 23, 42, 0.15);
          color: #0f172a;
        }
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
