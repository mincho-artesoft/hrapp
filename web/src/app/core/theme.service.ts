import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

export type SiteTheme = 'dark' | 'light';

const THEME_STORAGE_KEY = 'cc_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly theme = signal<SiteTheme>(this.readInitialTheme());

  constructor() {
    this.applyDomTheme(this.theme());
  }

  toggle(): void {
    this.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
  }

  setTheme(next: SiteTheme): void {
    this.theme.set(next);
    if (this.isBrowser) {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // Ignore storage restrictions
      }
    }
    this.applyDomTheme(next);
  }

  private readInitialTheme(): SiteTheme {
    if (!this.isBrowser) return 'dark';
    const attr = this.doc.documentElement.getAttribute('data-theme');
    if (attr === 'light' || attr === 'dark') return attr;
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // Ignore storage restrictions
    }
    return 'dark';
  }

  private applyDomTheme(theme: SiteTheme): void {
    const root = this.doc.documentElement;
    if (!root) return;
    root.setAttribute('data-theme', theme);
    if (this.isBrowser) {
      root.style.colorScheme = theme;
      const themeMeta = this.doc.querySelector('meta[name="theme-color"]');
      if (themeMeta) {
        themeMeta.setAttribute('content', theme === 'light' ? '#f2f2f7' : '#000000');
      }
      const schemeMeta = this.doc.querySelector('meta[name="color-scheme"]');
      if (schemeMeta) {
        schemeMeta.setAttribute('content', theme);
      }
    }
  }
}
