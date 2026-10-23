import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  inject,
  signal,
} from '@angular/core';

import { ScrollService } from '../../core/scroll.service';
import { ActiveLocaleService } from '../../core/active-locale.service';
import { linkPath } from '../../core/locales';
import { storeCta } from '../../core/store-cta';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';

interface NavItem {
  label: string;
  href: string;
  key: string;
  isRoute?: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LanguageSwitcherComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly scroll = inject(ScrollService);

  private readonly active = inject(ActiveLocaleService);

  /** Follows the language of the page being read, not the site default. */
  readonly appStoreUrl = this.active.storeHref;
  readonly homePath = computed(() => {
    const home = this.active.path('/');
    return home.endsWith('/') ? home : `${home}/`;
  });
  readonly isScrolled = this.scroll.isScrolled;
  readonly progress = this.scroll.progress;
  readonly menuOpen = signal(false);

  readonly copy = this.active.copy;
  readonly storeCta = computed(() => storeCta(this.active.locale().code));
  readonly isArticlesRoute = computed(() => this.active.currentPath().includes('/articles/'));

  /** Labels come from the active language; the fragments never change. */
  readonly nav = computed<NavItem[]>(() => {
    const n = this.copy().nav;
    const base = this.homePath();
    const articlesHref = linkPath(this.active.locale(), '/articles');
    return [
      { label: n.tour, href: `${base}#showcase`, key: 'showcase' },
      { label: n.widgets, href: `${base}#widgets`, key: 'widgets' },
      { label: n.weather, href: `${base}#weather`, key: 'weather' },
      { label: n.features, href: `${base}#features`, key: 'features' },
      { label: n.pricing, href: `${base}#pricing`, key: 'pricing' },
      { label: n.articles, href: articlesHref, key: 'articles', isRoute: true },
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
