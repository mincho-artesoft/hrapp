import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { ActiveLocaleService } from '../../core/active-locale.service';
import { RevealDirective } from '../../core/reveal.directive';

interface Qa {
  q: string;
  a: string;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
})
export class FaqComponent implements OnInit {
  /** Index of the open row, or -1 for none. */
  readonly open = signal(0);

  private readonly active = inject(ActiveLocaleService);
  readonly copy = computed(() => this.active.copy().faq);
  readonly items = computed<readonly Qa[]>(() => this.copy().items);
  /** The lead wraps a link. Split here so the template can place it without
   *  introducing whitespace either side of the anchor. */
  readonly leadBefore = computed(() => this.copy().lead.split('{link}')[0]);
  readonly leadAfter = computed(() => this.copy().lead.split('{link}')[1] ?? '');
  /**
   * The legal pages exist in English only, and every language links to them.
   *
   * Deliberate rather than unfinished: one authoritative privacy policy is
   * easier to keep true than twenty-nine, and a translated legal text that
   * drifts from the original is worse than an untranslated one.
   *
   * This was previously built from `active.path('/')`, which returns '/ja'
   * rather than '/ja/', so the result was '/japrivacy-policy/' -- a 404 on
   * every one of the twenty-eight translated home pages, shipped live.
   */
  readonly privacyHref = '/privacy-policy/';

  toggle(i: number): void {
    this.open.update((cur) => (cur === i ? -1 : i));
  }

  private readonly doc = inject(DOCUMENT);

  /**
   * Emit the FAQPage markup from the same object the section renders.
   *
   * Google requires the marked-up answer to match the visible one. While this
   * lived as a static block in index.html the two were separate copies of the
   * same sentences, and the moment the FAQ was translated they stopped
   * agreeing -- twenty-nine pages of English markup over translated prose.
   *
   * Injected rather than templated because a <script type="application/ld+json">
   * inside an Angular template is escaped as text rather than parsed.
   */
  ngOnInit(): void {
    const id = 'faq-jsonld';
    this.doc.getElementById(id)?.remove();

    const script = this.doc.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: this.active.locale().hreflang,
      mainEntity: this.items().map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    });
    this.doc.head.appendChild(script);
  }
}
