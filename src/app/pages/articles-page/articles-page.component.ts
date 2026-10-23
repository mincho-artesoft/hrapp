import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ARTICLE_FAMILIES, ARTICLE_PAGE_SIZE, topicPath } from '../../content/article-topics';
import { ARTICLE_FACTS } from '../../content/article-facts';
import { LIVE_LOCALES } from '../../content/article-index';
import { ArticleChrome, ArticleLocale, Family } from '../../content/types';
import { DEFAULT_LOCALE, Locale, linkPath, localePath } from '../../core/locales';
import { MoreAppsComponent } from '../../components/more-apps/more-apps.component';
import { SeoService } from '../../core/seo.service';
import { isArticleLocaleIndexable } from '../../core/article-indexing';

interface Card {
  readonly slug: string;
  readonly path: string;
  readonly title: string;
  readonly description: string;
}

interface Group {
  readonly family: Family;
  readonly heading: string;
  readonly cards: Card[];
  readonly topicPath?: string;
  readonly total: number;
}

/** The index of everything written in one language, grouped by theme. */
@Component({
  selector: 'cc-articles-page',
  standalone: true,
  imports: [MoreAppsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="hub">
      <h1>{{ heading }}</h1>
      @if (isTopic) { <a href="/articles/">{{ chrome.allArticles }}</a> }
      @if (!isTopic && locale.code === 'en-US') {
        <nav aria-label="Article topics">
          @for (group of groups; track group.family) { <a [href]="topicAnchor(group.family)">{{ group.heading }}</a> }
        </nav>
      }
      @for (group of groups; track group.family) {
        <section [id]="'topic-' + group.family">
          <h2>{{ group.heading }}</h2>
          <ul>
            @for (card of group.cards; track card.slug) {
              <li>
                <a [href]="card.path">{{ card.title }}</a>
                <p>{{ card.description }}</p>
              </li>
            }
          </ul>
          @if (group.topicPath) { <p><a [href]="group.topicPath">Browse all {{ group.total }} {{ group.heading.toLowerCase() }} guides</a></p> }
        </section>
      }
      @if (pages.length > 1) {
        <nav aria-label="Article pages">
          @for (page of pages; track page.number) {
            <a [href]="page.path" [attr.aria-current]="page.number === currentPage ? 'page' : null">{{ page.number }}</a>
          }
        </nav>
      }
      <cc-more-apps [inline]="true" />
    </div>
  `,
  styles: [
    `
      .hub {
        max-width: 52rem;
        margin: 0 auto;
        padding: calc(72px + clamp(32px, 6vw, 72px)) 20px 80px;
        display: grid;
        gap: clamp(28px, 4vw, 44px);
      }

      nav { display: flex; flex-wrap: wrap; gap: 1rem; }
      nav a[aria-current="page"] { font-weight: 700; text-decoration-thickness: 3px; }
      section { scroll-margin-top: 6rem; }
      ul {
        margin: 0;
        padding: 0;
        list-style: none;
        display: grid;
        gap: 18px;
      }

      li p {
        margin: 4px 0 0;
        opacity: 0.75;
      }
    `,
  ],
})
export class ArticlesPageComponent {
  readonly locale: Locale;
  readonly chrome: ArticleChrome;
  readonly groups: Group[] = [];
  readonly isTopic: boolean;
  readonly currentPage: number;
  readonly heading: string;
  readonly pages: { number: number; path: string }[] = [];

  topicAnchor(family: Family): string {
    return `${localePath(this.locale, '/articles')}/#topic-${family}`;
  }

  constructor() {
    const route = inject(ActivatedRoute).snapshot;
    this.locale = (route.data['locale'] as Locale | undefined) ?? DEFAULT_LOCALE;

    const content = route.data['articleContent'] as ArticleLocale;
    if (!content) throw new Error('Article hub content was not resolved');
    this.chrome = content.chrome;
    this.isTopic = route.data['topicHub'] === true;
    this.currentPage = Number(route.paramMap.get('page') ?? 1);
    const requestedFamily = route.paramMap.get('family') as Family;
    if (this.isTopic && (!ARTICLE_FAMILIES.includes(requestedFamily) || !Number.isInteger(this.currentPage) || this.currentPage < 1)) {
      throw new Error('Invalid article topic page');
    }

    const headings: Record<Family, string> = {
      weather: this.chrome.familyWeather,
      unify: this.chrome.familyUnify,
      widgets: this.chrome.familyWidgets,
      sharing: this.chrome.familySharing,
      planning: this.chrome.familyPlanning,
      compare: this.chrome.familyCompare,
    };

    // Grouped in the order the families are declared, so the hub reads the same
    // way in every language rather than following each translation's alphabet.
    const order = this.isTopic ? [requestedFamily] : ARTICLE_FAMILIES;
    for (const family of order) {
      const cards = Object.entries(content.articles)
        .filter(([slug]) => ARTICLE_FACTS[slug]?.family === family)
        .map(([slug, article]) => ({
          slug,
          path: linkPath(this.locale, `/articles/${slug}`),
          title: article.short,
          description: article.description,
        }));
      if (!cards.length) continue;
      const total = cards.length;
      if (this.isTopic) {
        const count = Math.ceil(total / ARTICLE_PAGE_SIZE);
        if (this.currentPage > count) throw new Error('Article topic page does not exist');
        this.pages.push(...Array.from({ length: count }, (_, index) => ({ number: index + 1, path: topicPath(family, index + 1) + '/' })));
        this.groups.push({ family, heading: headings[family], cards: cards.slice((this.currentPage - 1) * ARTICLE_PAGE_SIZE, this.currentPage * ARTICLE_PAGE_SIZE), total });
      } else {
        const split = this.locale.code === 'en-US' && total > ARTICLE_PAGE_SIZE;
        this.groups.push({ family, heading: headings[family], cards: split ? cards.slice(0, 6) : cards, total, topicPath: this.locale.code === 'en-US' ? topicPath(family) + '/' : undefined });
      }
    }

    this.heading = this.isTopic ? `${headings[requestedFamily]} guides — page ${this.currentPage}` : this.chrome.allArticles;
    const path = this.isTopic ? topicPath(requestedFamily, this.currentPage) : localePath(this.locale, '/articles');
    inject(SeoService).apply({
      title: this.isTopic ? `${this.heading} | Cloud Calendars` : this.chrome.hubTitle,
      description: this.chrome.hubDescription,
      path,
      locale: this.locale,
      robots: isArticleLocaleIndexable(this.locale) ? 'index,follow' : 'noindex,follow',
      // Only approved, indexable article hubs belong to the search alternate set.
      alternates: this.isTopic ? [] : LIVE_LOCALES.filter(isArticleLocaleIndexable).map((other) => ({
        hreflang: other.hreflang,
        path: localePath(other, '/articles'),
      })),
    });
  }
}
