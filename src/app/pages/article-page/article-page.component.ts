import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ShotRailComponent } from '../../components/shot-rail/shot-rail.component';
import { ARTICLE_FACTS } from '../../content/article-facts';
import { CONTENT, contentFor, localesWith } from '../../content/registry';
import { ArticleChrome, ClaimRow, LocalisedArticle } from '../../content/types';
import { APP_STORE_URL } from '../../core/app-facts';
import { DEFAULT_LOCALE, Locale, localePath, storeUrl } from '../../core/locales';
import { SeoService } from '../../core/seo.service';

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
  imports: [RouterLink, ShotRailComponent],
  templateUrl: './article-page.component.html',
  styleUrl: './article-page.component.scss',
})
export class ArticlePageComponent {
  readonly locale: Locale;
  readonly chrome: ArticleChrome;
  readonly article: LocalisedArticle | undefined;
  readonly claims: ClaimRow[] = [];
  readonly seeAlso: SeeAlsoLink[] = [];
  readonly updated: string = '';
  readonly store: string;

  constructor() {
    const route = inject(ActivatedRoute).snapshot;
    const slug = route.paramMap.get('slug') ?? '';

    this.locale = (route.data['locale'] as Locale | undefined) ?? DEFAULT_LOCALE;
    const content = contentFor(this.locale.code);
    this.chrome = content.chrome;
    this.article = content.articles[slug];
    this.store = storeUrl(this.locale, APP_STORE_URL);

    const facts = ARTICLE_FACTS[slug];
    if (!this.article || !facts) return;

    this.updated = facts.updated;

    // Numbers from facts, words from the translation, joined by id — so a row
    // cannot end up carrying the wrong figure however the wording is edited.
    this.claims = facts.claims
      .filter((fact) => fact.id in this.article!.claims)
      .map((fact) => ({ label: this.article!.claims[fact.id], value: fact.value }));

    this.seeAlso = (this.article.seeAlso ?? [])
      .filter((other) => other in content.articles)
      .map((other) => ({
        path: localePath(this.locale, `/articles/${other}`),
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
  }

  localised(path: string): string {
    return localePath(this.locale, path);
  }
}
