import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MoreAppsComponent } from '../../components/more-apps/more-apps.component';
import { ShotRailComponent } from '../../components/shot-rail/shot-rail.component';
import { ARTICLE_FACTS } from '../../content/article-facts';
import { CONTENT, contentFor, localesWith } from '../../content/registry';
import { ArticleChrome, ClaimRow, LocalisedArticle } from '../../content/types';
import { APP_DEVELOPER, APP_NAME, APP_STORE_URL, SITE_URL } from '../../core/app-facts';
import { DEFAULT_LOCALE, Locale, linkPath, localePath, storeUrl } from '../../core/locales';
import { storeCta } from '../../core/store-cta';
import { SeoService, absolute } from '../../core/seo.service';

interface SeeAlsoLink {
  readonly path: string;
  readonly label: string;
}

/**
 * One article.
 *
 * The numbers in the table are joined to their wording by id at render, so the
 * translation supplies the sentence and article-facts.ts supplies the figure.
 * A translator can rewrite every word on this page and cannot change what it
 * claims.
 */
@Component({
  selector: 'cc-article-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ShotRailComponent, MoreAppsComponent],
  templateUrl: './article-page.component.html',
  styleUrl: './article-page.component.scss',
})
export class ArticlePageComponent implements OnDestroy {
  private readonly doc = inject(DOCUMENT);
  readonly locale: Locale;
  readonly chrome: ArticleChrome;
  readonly article: LocalisedArticle | undefined;
  readonly claims: ClaimRow[] = [];
  readonly seeAlso: SeeAlsoLink[] = [];
  readonly updated: string = '';
  readonly store: string;
  readonly storeLabel: string;

  constructor() {
    const route = inject(ActivatedRoute).snapshot;
    const slug = route.paramMap.get('slug') ?? '';

    this.locale = (route.data['locale'] as Locale | undefined) ?? DEFAULT_LOCALE;
    const content = contentFor(this.locale.code);
    this.chrome = content.chrome;
    this.article = content.articles[slug];
    this.store = storeUrl(this.locale, APP_STORE_URL);
    this.storeLabel = storeCta(this.locale.code);

    const facts = ARTICLE_FACTS[slug];
    if (!this.article || !facts) return;

    this.updated = this.article.updated ?? facts.updated;

    // Numbers from facts, words from the translation, joined by id — so a row
    // cannot end up carrying the wrong figure however the wording is edited.
    this.claims = facts.claims
      .filter((fact) => fact.id in this.article!.claims)
      .map((fact) => ({ label: this.article!.claims[fact.id], value: fact.value }));

    this.seeAlso = (this.article.seeAlso ?? [])
      .filter((other) => other in content.articles)
      .map((other) => ({
        path: linkPath(this.locale, `/articles/${other}`),
        label: content.articles[other].short,
      }));

    const path = `/articles/${slug}`;
    inject(SeoService).apply({
      title: this.article.title,
      description: this.article.description,
      path: localePath(this.locale, path),
      locale: this.locale,
      alternates: localesWith(slug).map((other) => ({
        hreflang: other.hreflang,
        path: localePath(other, path),
      })),
    });

    this.describeAsArticle(slug, this.updated);
  }

  localised(path: string): string {
    return linkPath(this.locale, path);
  }

  /**
   * Say that this page is an article.
   *
   * Until now every one of them carried the app's SoftwareApplication block
   * from index.html and nothing else, so a reader that parses rather than
   * reads -- a search engine, an assistant answering a question -- learned that
   * Cloud Calendars exists and never learned that this page answers anything.
   * The sibling site has carried Article markup on its guides all along; this
   * is the same, built from the same objects the page renders.
   *
   * Only dateModified is emitted. The facts record when an article was last
   * checked and not when it first appeared, and a publication date invented to
   * fill a required field is exactly the kind of claim this codebase keeps out
   * of the prose.
   *
   * Injected rather than templated because a <script type="application/ld+json">
   * inside an Angular template is escaped as text rather than parsed.
   */
  private describeAsArticle(slug: string, updated: string): void {
    const doc = inject(DOCUMENT);
    const id = 'article-jsonld';
    doc.getElementById(id)?.remove();

    // The same function the canonical uses, so the two cannot drift: this site
    // is served from an S3 website endpoint that answers the slashless form with
    // a redirect, and an @id pointing at a redirect describes a different page.
    const url = absolute(localePath(this.locale, `/articles/${slug}`));
    const publisher = { '@type': 'Organization', name: APP_DEVELOPER, url: SITE_URL };
    const script = doc.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: this.article!.title,
      description: this.article!.description,
      inLanguage: this.locale.hreflang,
      dateModified: updated,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      author: publisher,
      publisher,
      isPartOf: { '@type': 'WebSite', name: APP_NAME, url: SITE_URL },
      about: { '@type': 'SoftwareApplication', name: APP_NAME, applicationCategory: 'ProductivityApplication', operatingSystem: 'iOS', url: APP_STORE_URL },
    });
    doc.head.appendChild(script);

    // FAQPage only where the page actually shows questions. Google's own rule
    // is that the marked-up answer must be the visible one, and the article
    // renders these above; an article without a written FAQ emits nothing
    // rather than a manufactured one.
    const faqId = 'article-faq-jsonld';
    doc.getElementById(faqId)?.remove();
    const faq = this.article!.faq ?? [];
    if (!faq.length) return;

    const faqScript = doc.createElement('script');
    faqScript.id = faqId;
    faqScript.type = 'application/ld+json';
    faqScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: this.locale.hreflang,
      mainEntity: faq.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    });
    doc.head.appendChild(faqScript);
  }

  ngOnDestroy(): void {
    this.doc.getElementById('article-jsonld')?.remove();
    this.doc.getElementById('article-faq-jsonld')?.remove();
  }

}
