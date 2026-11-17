import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ARTICLE_FAMILIES, ARTICLE_PAGE_SIZE, topicPath } from '../../content/article-topics';
import { ARTICLE_FACTS } from '../../content/article-facts';
import { LIVE_LOCALES } from '../../content/article-index';
import { ArticleChrome, ArticleLocale, Family } from '../../content/types';
import { ActiveLocaleService } from '../../core/active-locale.service';
import { APP_STORE_URL } from '../../core/app-facts';
import { DEFAULT_LOCALE, Locale, linkPath, localePath, storeUrl } from '../../core/locales';
import { storeCta } from '../../core/store-cta';
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
      <header class="hub__head">
        @if (isTopic) {
          <p class="hub__crumbs">
            <a class="hub__back" href="/articles/">← {{ chrome.allArticles }}</a>
          </p>
        }
        <h1>{{ heading }}</h1>
        <p class="hub__lead">{{ chrome.hubDescription }}</p>
        <div class="art__top-cta">
          <a class="btn btn--primary" [href]="store()" target="_blank" rel="noopener">{{ storeLabel }}</a>
        </div>
      </header>

      @if (!isTopic && locale.code === 'en-US') {
        <section class="card hub__compare-banner" aria-labelledby="hub-compare-cta">
          <div class="hub__compare-copy">
            <p class="eyebrow">30 Multi-Table Matrices</p>
            <h2 id="hub-compare-cta">Side-by-Side Calendar App &amp; Sync Comparisons</h2>
            <p>
              Compare Cloud Calendars against Apple Calendar, Google Calendar, Fantastical, Outlook Mobile,
              BusyCal, Notion Calendar, CalDAV vs ICS vs OAuth, weather forecasts, and widgets across 90+ structured tables.
            </p>
          </div>
          <a class="btn btn--primary" href="/compare/">
            <span>Explore All 30 Comparisons</span>
            <span aria-hidden="true">→</span>
          </a>
        </section>
      }

      @if (!isTopic && groups.length > 1) {
        <nav class="hub__topics" aria-label="Article topics">
          @for (group of groups; track group.family) {
            <a class="chip hub__topic" [href]="topicAnchor(group.family)">
              <span class="hub__topic-dot" [attr.data-family]="group.family" aria-hidden="true"></span>
              <span>{{ group.heading }}</span>
              <span class="hub__topic-count">{{ group.total }}</span>
            </a>
          }
        </nav>
      }

      @for (group of groups; track group.family) {
        <section class="hub__group" [id]="'topic-' + group.family">
          <div class="hub__group-head">
            <h2>{{ group.heading }}</h2>
            <span class="hub__group-count">{{ group.total }}</span>
          </div>
          <ul class="hub__grid">
            @for (card of group.cards; track card.slug) {
              <li class="card hub__card">
                <a class="hub__card-link" [href]="card.path">
                  <span class="hub__card-title">{{ card.title }}</span>
                  <span class="hub__card-arrow" aria-hidden="true">↗</span>
                </a>
                <p class="hub__card-desc">{{ card.description }}</p>
              </li>
            }
          </ul>
          @if (group.topicPath) {
            <p class="hub__more">
              <a class="btn btn--ghost hub__more-btn" [href]="group.topicPath">
                <span>Browse all {{ group.total }} {{ group.heading.toLowerCase() }} guides</span>
                <span aria-hidden="true">→</span>
              </a>
            </p>
          }
        </section>
      }

      @if (pages.length > 1) {
        <nav class="hub__pages" aria-label="Article pages">
          @for (page of pages; track page.number) {
            <a
              class="hub__page"
              [href]="page.path"
              [attr.aria-current]="page.number === currentPage ? 'page' : null"
            >{{ page.number }}</a>
          }
        </nav>
      }
      <aside class="cta cta--inline">
        <p>{{ chrome.ctaLine }}</p>
        <a class="btn btn--primary" [href]="store()" target="_blank" rel="noopener">{{ storeLabel }}</a>
      </aside>
      <cc-more-apps [inline]="true" />
    </div>
  `,
  styles: [
    `
      .hub {
        max-width: 68rem;
        margin: 0 auto;
        padding: calc(var(--header-h) + clamp(36px, 6vw, 76px)) 20px 88px;
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        overflow-wrap: anywhere;
        gap: clamp(32px, 5vw, 52px);
      }

      .hub__head {
        display: grid;
        gap: 0.85rem;
        padding-bottom: clamp(1.5rem, 3vw, 2.25rem);
        border-bottom: 1px solid var(--hair);
      }

      .hub__crumbs {
        margin: 0;
      }

      .hub__back {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        padding: 0.42rem 0.9rem;
        border-radius: var(--r-pill);
        font-size: 0.84rem;
        font-weight: 600;
        color: var(--aurora-2);
        border: 1px solid var(--nav-active-border);
        background: var(--aurora-1-soft);
        transition: background 0.2s, border-color 0.2s;
      }
      .hub__back:hover {
        background: rgba(33, 104, 222, 0.24);
        border-color: var(--aurora-2);
      }

      .hub__head h1 {
        font-size: clamp(2.1rem, 5vw, 3.5rem);
        letter-spacing: -0.035em;
      }

      .hub__lead {
        font-size: var(--t-lead);
        color: var(--ink-3);
        max-width: 58ch;
        line-height: 1.62;
      }

      .art__top-cta {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.75rem;
        margin-top: 0.25rem;
      }

      .cta--inline {
        padding: clamp(1.25rem, 2.8vw, 1.65rem);
        border: 1px solid var(--hair);
        border-radius: var(--r-lg);
        background: var(--surface);
        display: grid;
        gap: 0.85rem;
        justify-items: start;
      }

      .cta--inline p {
        margin: 0;
        color: var(--ink-2);
      }

      .hub__topics {
        display: flex;
        flex-wrap: wrap;
        gap: 0.65rem;
      }

      .hub__compare-banner {
        padding: clamp(1.3rem, 2.8vw, 1.85rem);
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 1.25rem 2rem;
        border-color: var(--nav-active-border);
        background: var(--surface);
      }

      .hub__compare-copy {
        max-width: 44rem;
      }

      .hub__compare-copy h2 {
        font-size: clamp(1.25rem, 2.3vw, 1.65rem);
        letter-spacing: -0.028em;
        margin: 0.25rem 0 0.45rem;
      }

      .hub__compare-copy p:last-child {
        margin: 0;
        color: var(--ink-2);
        line-height: 1.58;
        font-size: 0.94rem;
      }

      .hub__topic {
        transition:
          border-color 0.3s var(--ease-out),
          background 0.3s var(--ease-out),
          color 0.3s var(--ease-out),
          transform 0.3s var(--ease-out);
      }
      .hub__topic:hover {
        color: var(--ink);
        border-color: var(--aurora-2);
        background: var(--aurora-1-soft);
      }

      .hub__topic-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--aurora-2);
      }
      .hub__topic-dot[data-family='unify'] { background: var(--aurora-1); }
      .hub__topic-dot[data-family='widgets'] { background: var(--aurora-3); }
      .hub__topic-dot[data-family='sharing'] { background: var(--aurora-4); }
      .hub__topic-dot[data-family='planning'] { background: var(--aurora-5); }
      .hub__topic-dot[data-family='compare'] { background: #30d158; }

      .hub__topic-count {
        font-family: var(--font-mono);
        font-size: 0.7rem;
        color: var(--ink-3);
        padding: 0.08rem 0.42rem;
        border-radius: var(--r-pill);
        background: var(--control-bg-hover);
      }

      .hub__group {
        scroll-margin-top: calc(var(--header-h) + 1.5rem);
        display: grid;
        gap: 1.25rem;
      }

      .hub__group-head {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .hub__group-head h2 {
        font-size: clamp(1.35rem, 2.5vw, 1.85rem);
        letter-spacing: -0.03em;
      }

      .hub__group-count {
        font-family: var(--font-mono);
        font-size: 0.74rem;
        color: var(--aurora-2);
        padding: 0.18rem 0.58rem;
        border-radius: var(--r-pill);
        background: var(--aurora-1-soft);
        border: 1px solid var(--nav-active-border);
      }

      .hub__grid {
        margin: 0;
        padding: 0;
        list-style: none;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
      }

      @media (max-width: 720px) {
        .hub__grid {
          grid-template-columns: 1fr;
        }
      }

      .hub__card {
        position: relative;
        padding: clamp(1.2rem, 2.2vw, 1.55rem);
        display: flex;
        flex-direction: column;
        gap: 0.55rem;
        transition:
          transform 0.35s var(--ease-out),
          border-color 0.35s var(--ease-out),
          box-shadow 0.35s var(--ease-out);
      }

      .hub__card:hover {
        border-color: var(--aurora-2);
        box-shadow: var(--shadow-mid);
      }

      .hub__card-link {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 0.75rem;
        font-family: var(--font-display);
        font-weight: 600;
        font-size: 1.05rem;
        line-height: 1.32;
        letter-spacing: -0.02em;
        color: var(--ink);
        transition: color 0.25s var(--ease-out);
      }

      .hub__card-link::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
      }

      .hub__card:hover .hub__card-link {
        color: var(--accent-link);
      }

      .hub__card-arrow {
        flex: 0 0 auto;
        font-family: var(--font-mono);
        font-size: 0.88rem;
        color: var(--ink-4);
        transition: transform 0.3s var(--ease-out), color 0.3s var(--ease-out);
      }

      .hub__card:hover .hub__card-arrow {
        color: var(--aurora-2);
        transform: translate(2px, -2px);
      }

      .hub__card-desc {
        margin: 0;
        font-size: 0.9rem;
        line-height: 1.58;
        color: var(--ink-3);
      }

      .hub__more {
        margin: 0.25rem 0 0;
      }

      .hub__more-btn {
        max-width: 100%;
        white-space: normal;
        font-size: 0.88rem;
        padding: 0.72rem 1.3rem;
      }

      .hub__pages {
        display: flex;
        flex-wrap: wrap;
        gap: 0.55rem;
        padding-top: 0.5rem;
      }

      .hub__page {
        display: inline-grid;
        place-items: center;
        min-width: 2.5rem;
        height: 2.5rem;
        padding: 0 0.75rem;
        border-radius: 12px;
        font-family: var(--font-mono);
        font-size: 0.86rem;
        color: var(--ink-2);
        border: 1px solid var(--hair-strong);
        background: var(--control-bg);
        transition: border-color 0.25s, background 0.25s, color 0.25s;
      }

      .hub__page:hover {
        border-color: var(--aurora-2);
        background: var(--aurora-1-soft);
        color: var(--ink);
      }

      .hub__page[aria-current="page"] {
        font-weight: 600;
        color: #ffffff;
        background: var(--aurora-1);
        border-color: var(--aurora-1);
      }

      :host-context([data-theme='light']) .hub__page[aria-current="page"] {
        color: #ffffff;
        background: var(--aurora-1);
        border-color: var(--aurora-1);
        box-shadow: 0 6px 16px -4px rgba(37, 99, 235, 0.4);
      }
    `,
  ],
})
export class ArticlesPageComponent {
  private readonly active = inject(ActiveLocaleService);
  readonly locale: Locale;
  readonly chrome: ArticleChrome;
  readonly groups: Group[] = [];
  readonly isTopic: boolean;
  readonly currentPage: number;
  readonly heading: string;
  readonly pages: { number: number; path: string }[] = [];
  readonly store = computed(() =>
    storeUrl(this.locale, APP_STORE_URL, this.active.tagged('articles')),
  );
  readonly storeLabel: string;

  topicAnchor(family: Family): string {
    return `${linkPath(this.locale, '/articles')}#topic-${family}`;
  }

  constructor() {
    const route = inject(ActivatedRoute).snapshot;
    this.locale = (route.data['locale'] as Locale | undefined) ?? DEFAULT_LOCALE;
    this.storeLabel = storeCta(this.locale.code);

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
    const googleIndexable = isArticleLocaleIndexable(this.locale);
    inject(SeoService).apply({
      title: this.isTopic ? `${this.heading} | Cloud Calendars` : this.chrome.hubTitle,
      description: this.chrome.hubDescription,
      path,
      locale: this.locale,
      robots: 'index,follow',
      googlebot: googleIndexable ? undefined : 'noindex,follow',
      // Only approved, indexable article hubs belong to the search alternate set.
      alternates: this.isTopic || !googleIndexable ? [] : LIVE_LOCALES.filter(isArticleLocaleIndexable).map((other) => ({
        hreflang: other.hreflang,
        path: localePath(other, '/articles'),
      })),
    });
  }
}
