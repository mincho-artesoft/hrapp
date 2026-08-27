import { Injectable, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { APP_STORE_URL } from './app-facts';
import { DEFAULT_LOCALE, Locale, localePath, storeUrl } from './locales';

/**
 * Which language the page currently being shown is in.
 *
 * The article and hub components read their locale from `route.data`, which
 * works because they sit inside the router outlet. The header and footer do
 * not: they are part of the app shell, outside the outlet, and so had no way
 * to know. The consequence was quiet and real — a reader on the Japanese
 * article saw a header button pointing at the American App Store, priced in
 * dollars, while the button at the foot of the same article correctly pointed
 * at the Japanese one.
 *
 * So the shell asks the router instead. On every navigation this walks to the
 * deepest activated route and takes the locale it declares.
 */
@Injectable({ providedIn: 'root' })
export class ActiveLocaleService {
  private readonly router = inject(Router);
  private readonly root = inject(ActivatedRoute);
  private readonly current = signal<Locale>(DEFAULT_LOCALE);

  readonly locale = this.current.asReadonly();

  /** The App Store link for this reader's storefront, not the American one. */
  readonly storeHref = computed(() => storeUrl(this.current(), APP_STORE_URL));

  constructor() {
    this.read();
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => this.read());
  }

  /** A path in the current language, for shell links like the home logo. */
  path(path: string): string {
    return localePath(this.current(), path);
  }

  private read(): void {
    let route = this.root;
    while (route.firstChild) route = route.firstChild;
    this.current.set((route.snapshot.data['locale'] as Locale | undefined) ?? DEFAULT_LOCALE);
  }
}
