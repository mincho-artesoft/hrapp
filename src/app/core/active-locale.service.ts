import { Injectable, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { homeCopyFor } from '../content/home/registry';
import { CONTENT } from '../content/registry';
import { APP_STORE_URL } from './app-facts';
import { DEFAULT_LOCALE, Locale, localePath, storeUrl } from './locales';

/** The site is served from an S3 website endpoint; see the note in seo.service. */
function withSlash(path: string): string {
  return path.endsWith('/') ? path : `${path}/`;
}

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
  /**
   * The path being rendered.
   *
   * Held as a signal rather than read from `router.url` inside the template
   * method that needs it. Reading mutable router state during rendering meant
   * an OnPush component evaluated it once, at bootstrap, when the URL was still
   * '/' -- so on the English pages every language link pointed at that
   * language's home page instead of the page the reader was on.
   */
  private readonly url = signal('/');

  readonly locale = this.current.asReadonly();

  /** The App Store link for this reader's storefront, not the American one. */
  readonly storeHref = computed(() => storeUrl(this.current(), APP_STORE_URL));

  /** Home-page copy in the language of the page being read. */
  readonly copy = computed(() => homeCopyFor(this.current().code));

  constructor() {
    this.read();
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => this.read());
  }

  /** A path in the current language, for shell links like the home logo. */
  path(path: string): string {
    return localePath(this.current(), path);
  }

  /**
   * Where the page currently being read lives in another language.
   *
   * Most articles are English only, so an exact equivalent frequently does not
   * exist. Rather than offering a link that 404s, or one that silently lands
   * the reader back in English, the fallback is that language's article hub --
   * which exists in all twenty-nine. Landing somewhere real in the language you
   * asked for beats landing exactly where you were in a language you did not.
   */
  equivalentPath(target: Locale): string {
    const url = this.url();
    const match = url.match(/\/articles\/([^/]+)$/);

    if (match) {
      const slug = match[1];
      const has = CONTENT[target.code as keyof typeof CONTENT]?.articles?.[slug];
      return withSlash(localePath(target, has ? `/articles/${slug}` : '/articles'));
    }
    if (url.endsWith('/articles')) return withSlash(localePath(target, '/articles'));

    // The home page, and anything else that is not language-specific.
    return withSlash(localePath(target, '/'));
  }

  private read(): void {
    let route = this.root;
    while (route.firstChild) route = route.firstChild;
    this.current.set((route.snapshot.data['locale'] as Locale | undefined) ?? DEFAULT_LOCALE);
    this.url.set(this.router.url.split('#')[0].split('?')[0].replace(/\/+$/, ''));
  }
}
