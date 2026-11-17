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
import { ThemeService } from '../../core/theme.service';
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
  private readonly themeService = inject(ThemeService);
  private readonly active = inject(ActiveLocaleService);

  readonly theme = this.themeService.theme;

  toggleTheme(): void {
    this.themeService.toggle();
  }

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
  readonly isCompareRoute = computed(() => this.active.currentPath().startsWith('/compare/'));
  readonly isCalendarRoute = computed(() => this.active.currentPath().includes('/calendar'));

  /** Labels come from the active language; the fragments never change. */
  readonly nav = computed<NavItem[]>(() => {
    const n = this.copy().nav;
    const base = this.homePath();
    const locale = this.active.locale();
    const articlesHref = linkPath(locale, '/articles');
    const calendarHref = linkPath(locale, '/calendar');
    const items: NavItem[] = [
      { label: 'Web Calendar', href: calendarHref, key: 'calendar', isRoute: true },
      { label: n.widgets, href: `${base}#widgets`, key: 'widgets' },
      { label: n.features, href: `${base}#features`, key: 'features' },
      { label: n.pricing, href: `${base}#pricing`, key: 'pricing' },
    ];
    if (locale.code === 'en-US') {
      items.push({ label: 'Compare', href: '/compare/', key: 'compare', isRoute: true });
    }
    items.push({ label: n.articles, href: articlesHref, key: 'articles', isRoute: true });
    return items;
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
