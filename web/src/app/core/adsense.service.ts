import { DOCUMENT } from '@angular/common';
import { Injectable, afterNextRender, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { isBrowser } from './motion';

export const ADSENSE_CLIENT_ID = 'ca-pub-3759868960530173';
const ADSENSE_SCRIPT_ID = 'cc-adsense-script';

/**
 * Interactive tool, booking, authentication, admin, and legal routes stay 100% ad-free
 * to protect user workflow UX and comply with Google AdSense publisher-content policies.
 */
const AD_FREE_ROUTE_RE =
  /(^|\/)(calendar|book|bookings|booking|event|admin|app-auth|privacy-policy|terms-of-service|about|contact)(\/|$)/i;

@Injectable({ providedIn: 'root' })
export class AdsenseService {
  private readonly doc = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly browser = isBrowser();
  private scriptLoaded = false;

  constructor() {
    if (!this.browser) return;

    afterNextRender(() => {
      this.syncForUrl(this.router.url || window.location.pathname);
    });

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((ev) => {
        this.syncForUrl(ev.urlAfterRedirects || ev.url);
      });
  }

  isAdEligiblePath(rawUrl: string): boolean {
    const cleanPath = (rawUrl || '/').split(/[?#]/)[0] || '/';
    return !AD_FREE_ROUTE_RE.test(cleanPath);
  }

  private syncForUrl(rawUrl: string): void {
    const eligible = this.isAdEligiblePath(rawUrl);
    this.doc.body?.classList.toggle('cc-no-ads', !eligible);
    if (eligible && !this.scriptLoaded) {
      this.scheduleScriptLoad();
    }
  }

  private scheduleScriptLoad(): void {
    this.scriptLoaded = true;
    const injectTag = () => {
      if (this.doc.getElementById(ADSENSE_SCRIPT_ID)) return;
      const head = this.doc.head;
      if (!head) return;
      const script = this.doc.createElement('script');
      script.id = ADSENSE_SCRIPT_ID;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;
      head.appendChild(script);
    };

    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    };
    if (typeof win.requestIdleCallback === 'function') {
      win.requestIdleCallback(injectTag, { timeout: 2000 });
    } else {
      setTimeout(injectTag, 1200);
    }
  }
}
