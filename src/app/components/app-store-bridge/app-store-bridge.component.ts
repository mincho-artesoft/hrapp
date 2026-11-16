import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActiveLocaleService } from '../../core/active-locale.service';
import { APP_STORE_URL } from '../../core/app-facts';
import { generateQrSvgDataUrl } from '../../core/ios-event-palette';
import { storeUrl } from '../../core/locales';
import { isBrowser } from '../../core/motion';

const DISMISS_KEY = 'cc_app_bridge_dismissed_v1';

@Component({
  selector: 'cc-app-store-bridge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <!-- Mobile / Tablet Sticky Bottom App Store Bar (works in Chrome, Google App, Social WebViews & Safari) -->
      <aside class="cc-mbar" aria-label="Download Cloud Calendars on the App Store">
        <img
          class="cc-mbar__icon"
          src="/icons/icon-192.png"
          width="40"
          height="40"
          alt=""
          decoding="async"
        />
        <div class="cc-mbar__meta">
          <div class="cc-mbar__title">
            <strong>Cloud Calendars</strong>
            <span class="cc-mbar__stars">iOS · Free</span>
          </div>
          <p class="cc-mbar__sub">iCloud, Google &amp; Outlook + Weather</p>
        </div>
        <a
          class="cc-mbar__cta"
          [href]="mobileStoreHref()"
          target="_blank"
          rel="noopener"
        >
          Open App
        </a>
        <button
          type="button"
          class="cc-mbar__close"
          aria-label="Dismiss App Store banner"
          (click)="dismiss()"
        >
          ×
        </button>
      </aside>

      <!-- Desktop Floating Scan-with-iPhone QR Card -->
      <aside class="cc-dqr" aria-label="Install Cloud Calendars on iPhone or iPad">
        <button
          type="button"
          class="cc-dqr__close"
          aria-label="Dismiss QR download card"
          (click)="dismiss()"
        >
          ×
        </button>
        <a
          class="cc-dqr__qr-wrap"
          [href]="desktopStoreHref()"
          target="_blank"
          rel="noopener"
          aria-label="Open Cloud Calendars on the App Store"
        >
          @if (qrSvgUrl(); as qr) {
            <img [src]="qr" width="68" height="68" alt="QR code to download Cloud Calendars on iPhone" />
          }
        </a>
        <div class="cc-dqr__body">
          <span class="cc-dqr__eyebrow">FREE FOR iPHONE &amp; iPAD</span>
          <strong class="cc-dqr__heading">Scan to Get the App</strong>
          <span class="cc-dqr__desc">Unify Outlook, Google &amp; iCloud + Weather</span>
          <a
            class="cc-dqr__link"
            [href]="desktopStoreHref()"
            target="_blank"
            rel="noopener"
          >
            View in App Store ↗
          </a>
        </div>
      </aside>
    }
  `,
  styles: [`
    .cc-mbar {
      display: none;
    }
    .cc-dqr {
      display: none;
    }

    @media (max-width: 899px) {
      .cc-mbar {
        position: fixed;
        left: 10px;
        right: 10px;
        bottom: max(10px, env(safe-area-inset-bottom));
        z-index: 95;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 9px 10px 9px 11px;
        border-radius: 16px;
        background: rgba(10, 15, 30, 0.94);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(56, 224, 240, 0.28);
        box-shadow: 0 14px 36px rgba(0, 0, 0, 0.52);
        color: #f4f7ff;
      }
      .cc-mbar__icon {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        flex-shrink: 0;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
      }
      .cc-mbar__meta {
        min-width: 0;
        flex: 1;
      }
      .cc-mbar__title {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.88rem;
        line-height: 1.2;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .cc-mbar__stars {
        padding: 1px 6px;
        border-radius: 999px;
        background: rgba(56, 224, 240, 0.16);
        color: #38e0f0;
        font-size: 0.66rem;
        font-weight: 700;
      }
      .cc-mbar__sub {
        margin: 2px 0 0;
        font-size: 0.74rem;
        line-height: 1.25;
        color: rgba(226, 234, 255, 0.76);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .cc-mbar__cta {
        flex-shrink: 0;
        padding: 8px 13px;
        border-radius: 999px;
        background: linear-gradient(135deg, #38e0f0 0%, #3b82f6 100%);
        color: #030712 !important;
        font-weight: 700;
        font-size: 0.8rem;
        text-decoration: none !important;
        white-space: nowrap;
      }
      .cc-mbar__close {
        flex-shrink: 0;
        width: 26px;
        height: 26px;
        border-radius: 999px;
        border: 0;
        background: rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.72);
        font-size: 1rem;
        line-height: 1;
        cursor: pointer;
        display: grid;
        place-items: center;
        padding: 0;
      }
    }

    @media (min-width: 900px) {
      .cc-dqr {
        position: fixed;
        right: 18px;
        bottom: 18px;
        z-index: 88;
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 300px;
        padding: 11px 28px 11px 11px;
        border-radius: 16px;
        background: rgba(10, 15, 30, 0.92);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(56, 224, 240, 0.26);
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.48);
        color: #f4f7ff;
      }
      .cc-dqr__qr-wrap {
        flex-shrink: 0;
        width: 72px;
        height: 72px;
        padding: 3px;
        border-radius: 10px;
        background: #ffffff;
        display: grid;
        place-items: center;
      }
      .cc-dqr__qr-wrap img {
        width: 66px;
        height: 66px;
        display: block;
      }
      .cc-dqr__body {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }
      .cc-dqr__eyebrow {
        font-size: 0.64rem;
        font-weight: 700;
        letter-spacing: 0.07em;
        color: #38e0f0;
      }
      .cc-dqr__heading {
        font-size: 0.88rem;
        line-height: 1.2;
        color: #ffffff;
      }
      .cc-dqr__desc {
        font-size: 0.73rem;
        line-height: 1.3;
        color: rgba(226, 234, 255, 0.74);
      }
      .cc-dqr__link {
        margin-top: 2px;
        font-size: 0.75rem;
        font-weight: 600;
        color: #38e0f0 !important;
        text-decoration: none;
      }
      .cc-dqr__link:hover {
        text-decoration: underline;
      }
      .cc-dqr__close {
        position: absolute;
        top: 6px;
        right: 6px;
        width: 22px;
        height: 22px;
        border-radius: 999px;
        border: 0;
        background: rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.92rem;
        line-height: 1;
        cursor: pointer;
        display: grid;
        place-items: center;
        padding: 0;
      }
    }

    @media print {
      .cc-mbar,
      .cc-dqr {
        display: none !important;
      }
    }
  `],
})
export class AppStoreBridgeComponent {
  private readonly active = inject(ActiveLocaleService);
  private readonly browser = isBrowser();
  private readonly dismissed = signal(this.readInitialDismissed());

  readonly visible = computed(() => {
    if (this.dismissed()) return false;
    const p = this.active.currentPath();
    if (
      /(?:^|\/)(?:calendar|app-auth|book|event)(?:\/|$)/.test(p)
    ) {
      return false;
    }
    return true;
  });

  readonly mobileStoreHref = computed(() =>
    storeUrl(this.active.locale(), APP_STORE_URL, 'cc_mobile_bar'),
  );

  readonly desktopStoreHref = computed(() =>
    storeUrl(this.active.locale(), APP_STORE_URL, 'cc_desktop_qr'),
  );

  readonly qrSvgUrl = computed(() => generateQrSvgDataUrl(this.desktopStoreHref()));

  dismiss(): void {
    this.dismissed.set(true);
    if (this.browser) {
      try {
        sessionStorage.setItem(DISMISS_KEY, '1');
      } catch {
        // ignore storage errors
      }
    }
  }

  private readInitialDismissed(): boolean {
    if (!this.browser) return false;
    try {
      return sessionStorage.getItem(DISMISS_KEY) === '1';
    } catch {
      return false;
    }
  }
}
