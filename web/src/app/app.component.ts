import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  computed,
  inject,
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AppStoreBridgeComponent } from './components/app-store-bridge/app-store-bridge.component';
import { ScrollService } from './core/scroll.service';
import { ActiveLocaleService } from './core/active-locale.service';
import { APP_STORE_URL } from './core/app-facts';
import { storeUrl } from './core/locales';
import { isBrowser } from './core/motion';

declare global {
  interface Window {
    gtag?: (
      command: string,
      name: string,
      params?: Record<string, string | number | boolean>,
    ) => void;
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, AppStoreBridgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class AppComponent {
  private readonly active = inject(ActiveLocaleService);
  private readonly router = inject(Router);
  private readonly browser = isBrowser();
  readonly mainHref = computed(() => `${this.active.currentPath()}#main`);
  /** Instantiated here so the single rAF loop starts with the app. */
  private readonly scroll = inject(ScrollService);

  constructor() {
    afterNextRender(() => {
      this.tagStoreAnchors();
    });
    if (this.browser) {
      this.router.events
        .pipe(filter((e) => e instanceof NavigationEnd))
        .subscribe(() => setTimeout(() => this.tagStoreAnchors(), 0));
    }
  }

  onDocumentClick(event: MouseEvent): void {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const anchor = target.closest('a[href*="id6744690319"]') as HTMLAnchorElement | null;
    if (!anchor) return;

    const { campaign, storefront } = this.applyAnchorAttribution(anchor);
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'store_click', {
        campaign,
        storefront,
        host: window.location.hostname,
      });
    }
  }

  private tagStoreAnchors(): void {
    if (typeof document === 'undefined') return;
    const anchors = document.querySelectorAll<HTMLAnchorElement>('a[href*="id6744690319"]');
    anchors.forEach((anchor) => {
      this.applyAnchorAttribution(anchor);
    });
  }

  private applyAnchorAttribution(anchor: HTMLAnchorElement): {
    campaign: string;
    storefront: string;
  } {
    const locale = this.active.locale();
    const campaign = this.active.tagged(this.active.pageCampaign());
    const rawHref = anchor.getAttribute('href') || APP_STORE_URL;
    const taggedHref = storeUrl(locale, rawHref, campaign);
    if (anchor.getAttribute('href') !== taggedHref) {
      anchor.setAttribute('href', taggedHref);
    }
    return { campaign, storefront: locale.storefront };
  }
}
