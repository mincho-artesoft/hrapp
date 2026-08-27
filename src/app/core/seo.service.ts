import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { SITE_URL } from './app-facts';
import { Locale } from './locales';

export interface SeoInput {
  title: string;
  description: string;
  /** Route path, e.g. '/privacy-policy'. Used for the canonical URL. */
  path: string;
  image?: string;
  noindex?: boolean;
  /** The language this page is written in. Sets <html lang> and og:locale. */
  locale?: Locale;
  /**
   * The same page in other languages.
   *
   * Search engines read hreflang as a claim each page makes about the whole
   * group, and discard a group whose members disagree about who belongs to it.
   * So every page in a set has to list every member, itself included — which is
   * why the caller passes the full list rather than "the others".
   */
  alternates?: readonly { hreflang: string; path: string }[];
}

/**
 * Per-route title, description, canonical URL and social cards.
 *
 * This is a single-page app, so without this every route would inherit the
 * index.html metadata and share previews would all look identical.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  /**
   * Injected rather than taken from the global scope.
   *
   * There is no global `document` under platform-server; Angular provides one
   * through this token. A `typeof document === 'undefined'` guard therefore
   * returns early during prerendering, and everything it protects silently
   * does not happen — which is how every article shipped with the home page's
   * canonical URL and no hreflang at all, while looking correct in a browser.
   */
  private readonly doc = inject(DOCUMENT);

  apply(input: SeoInput): void {
    const url = `${SITE_URL}${input.path === '/' ? '' : input.path}`;
    const image = input.image ?? `${SITE_URL}/assets/images/app-screenshots/single-day-view.png`;

    this.title.setTitle(input.title);

    this.set('description', input.description);
    this.set('robots', input.noindex ? 'noindex,nofollow' : 'index,follow');

    this.setProperty('og:title', input.title);
    this.setProperty('og:description', input.description);
    this.setProperty('og:url', url);
    this.setProperty('og:image', image);
    this.setProperty('og:type', 'website');
    this.setProperty('og:site_name', 'Cloud Calendars');

    this.set('twitter:card', 'summary_large_image');
    this.set('twitter:title', input.title);
    this.set('twitter:description', input.description);
    this.set('twitter:image', image);

    if (input.locale) {
      this.setProperty('og:locale', input.locale.code.replace('-', '_'));
      this.doc.documentElement.setAttribute('lang', input.locale.hreflang);
      this.doc.documentElement.setAttribute('dir', input.locale.dir);
    }

    this.setCanonical(url);
    this.setAlternates(input.alternates ?? []);
  }

  /**
   * Rewrites the whole hreflang set on every navigation.
   *
   * Stale links are worse than missing ones: a set left over from the previous
   * article points search engines at translations of a different page, and
   * they will believe it.
   */
  private setAlternates(items: readonly { hreflang: string; path: string }[]): void {
    for (const stale of Array.from(
      this.doc.querySelectorAll<HTMLLinkElement>('link[rel="alternate"][hreflang]'),
    )) {
      stale.remove();
    }
    if (items.length < 2) return;

    for (const item of items) {
      const link = this.doc.createElement('link');
      link.rel = 'alternate';
      link.hreflang = item.hreflang;
      link.href = `${SITE_URL}${item.path === '/' ? '' : item.path}`;
      this.doc.head.appendChild(link);
    }
  }

  private set(name: string, content: string): void {
    this.meta.updateTag({ name, content });
  }

  private setProperty(property: string, content: string): void {
    this.meta.updateTag({ property, content }, `property='${property}'`);
  }

  private setCanonical(url: string): void {
    let link = this.doc.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.rel = 'canonical';
      this.doc.head.appendChild(link);
    }
    link.href = url;
  }
}
