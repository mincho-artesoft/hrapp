import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { SITE_URL } from './app-facts';

export interface SeoInput {
  title: string;
  description: string;
  /** Route path, e.g. '/privacy-policy'. Used for the canonical URL. */
  path: string;
  image?: string;
  noindex?: boolean;
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

    this.setCanonical(url);
  }

  private set(name: string, content: string): void {
    this.meta.updateTag({ name, content });
  }

  private setProperty(property: string, content: string): void {
    this.meta.updateTag({ property, content }, `property='${property}'`);
  }

  private setCanonical(url: string): void {
    if (typeof document === 'undefined') return;
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = url;
  }
}
