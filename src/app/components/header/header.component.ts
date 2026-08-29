import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { ScrollService } from '../../core/scroll.service';
import { ActiveLocaleService } from '../../core/active-locale.service';
import { storeCta } from '../../core/store-cta';
import { bookNav, mineNav } from '../../core/booking-cta';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { APP_STORE_URL } from '../../core/app-facts';

interface NavItem {
  label: string;
  fragment: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, LanguageSwitcherComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly scroll = inject(ScrollService);

  private readonly active = inject(ActiveLocaleService);

  /** Follows the language of the page being read, not the site default. */
  readonly appStoreUrl = this.active.storeHref;
  readonly isScrolled = this.scroll.isScrolled;
  readonly progress = this.scroll.progress;
  readonly menuOpen = signal(false);

  readonly copy = this.active.copy;
  readonly storeCta = computed(() => storeCta(this.active.locale().code));
  /** The article hub in this reader's language. */
  readonly articlesHref = computed(() => this.active.path('/articles') + '/');
  /** The booking page in this reader's language, and its short label. */
  readonly bookingHref = computed(() => this.active.path('/book') + '/');
  readonly bookingLabel = computed(() => bookNav(this.active.locale().code));
  /** Passwordless "my bookings" view. */
  readonly mineHref = computed(() => this.active.path('/bookings') + '/');
  readonly mineLabel = computed(() => mineNav(this.active.locale().code));

  /** Labels come from the active language; the fragments never change. */
  readonly nav = computed<NavItem[]>(() => {
    const n = this.copy().nav;
    return [
      { label: n.tour, fragment: 'showcase' },
      { label: n.widgets, fragment: 'widgets' },
      { label: n.weather, fragment: 'weather' },
      { label: n.features, fragment: 'features' },
      { label: n.pricing, fragment: 'pricing' },
    ];
  });

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
    document.body.style.overflow = this.menuOpen() ? 'hidden' : '';
  }

  closeMenu(): void {
    if (!this.menuOpen()) return;
    this.menuOpen.set(false);
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenu();
  }
}
