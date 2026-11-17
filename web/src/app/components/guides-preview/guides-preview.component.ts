import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ARTICLE_FACTS } from '../../content/article-facts';
import { ARTICLE_FAMILIES } from '../../content/article-topics';
import { ArticleLocale, Family } from '../../content/types';
import { ActiveLocaleService } from '../../core/active-locale.service';
import { DEFAULT_LOCALE, Locale, linkPath } from '../../core/locales';
import { RevealDirective } from '../../core/reveal.directive';

interface TopicPill {
  readonly family: Family;
  readonly label: string;
  readonly count: number;
  readonly href: string;
}

interface FeaturedGuideCard {
  readonly slug: string;
  readonly family: Family;
  readonly familyLabel: string;
  readonly title: string;
  readonly description: string;
  readonly href: string;
}

@Component({
  selector: 'app-guides-preview',
  standalone: true,
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (featured().length) {
      <section id="guides" class="section guides" aria-labelledby="guides-title">
        <div class="shell">
          <header class="guides__head" appReveal>
            <div class="guides__head-copy">
              <p class="eyebrow">{{ copy().nav.articles }}</p>
              <h2 id="guides-title" class="section-title">{{ heading() }}</h2>
              @if (description()) {
                <p class="section-lead">{{ description() }}</p>
              }
            </div>

            <a class="btn btn--ghost guides__hub-cta" [href]="hubHref()">
              <span>{{ heading() }} ({{ totalCount() }})</span>
              <span class="guides__arrow" aria-hidden="true">→</span>
            </a>
          </header>

          <nav class="guides__topics" aria-label="Guide categories" appReveal [revealDelay]="80">
            @for (topic of topics(); track topic.family) {
              <a class="chip guides__topic" [href]="topic.href">
                <span class="guides__topic-dot" [attr.data-family]="topic.family" aria-hidden="true"></span>
                <span>{{ topic.label }}</span>
                <span class="guides__topic-count">{{ topic.count }}</span>
              </a>
            }
          </nav>

          <div class="guides__grid">
            @for (card of featured(); track card.slug; let i = $index) {
              <a
                class="card guides__card"
                [href]="card.href"
                appReveal="zoom"
                [revealDelay]="i * 60"
              >
                <div class="guides__card-top">
                  <span class="guides__badge" [attr.data-family]="card.family">{{ card.familyLabel }}</span>
                  <span class="guides__card-icon" aria-hidden="true">↗</span>
                </div>
                <h3 class="guides__card-title">{{ card.title }}</h3>
                <p class="guides__card-desc">{{ card.description }}</p>
              </a>
            }
          </div>

          <div class="guides__foot" appReveal [revealDelay]="180">
            <a class="btn btn--primary" [href]="hubHref()">
              <span>{{ copy().nav.articles }} — {{ heading() }}</span>
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>
    }
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .guides__head {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-end;
        justify-content: space-between;
        gap: 1.5rem 2.5rem;
        margin-bottom: clamp(2rem, 4vw, 3rem);
      }

      .guides__head-copy {
        max-width: 44rem;
      }

      .guides__hub-cta {
        flex: 0 1 auto;
        max-width: 100%;
        white-space: normal;
      }

      .guides__arrow {
        transition: transform 0.35s var(--ease-out);
      }

      .guides__hub-cta:hover .guides__arrow {
        transform: translateX(3px);
      }

      .guides__topics {
        display: flex;
        flex-wrap: wrap;
        gap: 0.65rem;
        margin-bottom: clamp(1.8rem, 3.5vw, 2.6rem);
      }

      .guides__topic {
        transition:
          border-color 0.35s var(--ease-out),
          background 0.35s var(--ease-out),
          transform 0.35s var(--ease-out),
          color 0.35s var(--ease-out);
      }

      .guides__topic:hover {
        color: var(--ink);
        border-color: var(--aurora-2);
        background: var(--aurora-1-soft);
      }

      .guides__topic-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--aurora-2);
      }
      .guides__topic-dot[data-family='unify'] { background: var(--aurora-1); }
      .guides__topic-dot[data-family='widgets'] { background: var(--aurora-3); }
      .guides__topic-dot[data-family='sharing'] { background: var(--aurora-4); }
      .guides__topic-dot[data-family='planning'] { background: var(--aurora-5); }
      .guides__topic-dot[data-family='compare'] { background: #30d158; }

      .guides__topic-count {
        font-family: var(--font-mono);
        font-size: 0.7rem;
        color: var(--ink-3);
        padding: 0.08rem 0.42rem;
        border-radius: var(--r-pill);
        background: var(--control-bg-hover);
      }

      .guides__grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: clamp(0.95rem, 1.8vw, 1.35rem);
      }

      @media (max-width: 960px) {
        .guides__grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 620px) {
        .guides__grid {
          grid-template-columns: 1fr;
        }
      }

      .guides__card {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding: clamp(1.35rem, 2.4vw, 1.85rem);
        text-decoration: none;
        transition:
          transform 0.45s var(--ease-out),
          border-color 0.45s var(--ease-out),
          box-shadow 0.45s var(--ease-out);
      }

      .guides__card:hover {
        border-color: var(--aurora-2);
        box-shadow: var(--shadow-mid);
      }

      .guides__card-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
      }

      .guides__badge {
        padding: 0.28rem 0.68rem;
        border-radius: var(--r-pill);
        font-size: 0.68rem;
        font-weight: 600;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: var(--aurora-2);
        background: var(--aurora-1-soft);
        border: 1px solid var(--nav-active-border);
      }

      .guides__badge[data-family='unify'] {
        color: #c5d6ff;
        background: rgba(77, 124, 255, 0.14);
        border-color: rgba(77, 124, 255, 0.3);
      }
      .guides__badge[data-family='widgets'] {
        color: #dfc2ff;
        background: rgba(165, 102, 255, 0.14);
        border-color: rgba(165, 102, 255, 0.3);
      }
      .guides__badge[data-family='sharing'] {
        color: #ffc8b8;
        background: rgba(255, 122, 89, 0.13);
        border-color: rgba(255, 122, 89, 0.28);
      }
      .guides__badge[data-family='planning'] {
        color: #ffe5a3;
        background: rgba(255, 203, 92, 0.12);
        border-color: rgba(255, 203, 92, 0.28);
      }
      .guides__badge[data-family='compare'] {
        color: #b4f5d3;
        background: rgba(82, 227, 155, 0.12);
        border-color: rgba(82, 227, 155, 0.28);
      }

      :host-context([data-theme='light']) .guides__badge {
        color: #0369a1;
        background: rgba(2, 132, 199, 0.1);
        border-color: rgba(2, 132, 199, 0.25);
      }
      :host-context([data-theme='light']) .guides__badge[data-family='unify'] {
        color: #1d4ed8;
        background: rgba(37, 99, 235, 0.1);
        border-color: rgba(37, 99, 235, 0.25);
      }
      :host-context([data-theme='light']) .guides__badge[data-family='widgets'] {
        color: #6d28d9;
        background: rgba(124, 58, 237, 0.1);
        border-color: rgba(124, 58, 237, 0.25);
      }
      :host-context([data-theme='light']) .guides__badge[data-family='sharing'] {
        color: #b91c1c;
        background: rgba(220, 38, 38, 0.1);
        border-color: rgba(220, 38, 38, 0.25);
      }
      :host-context([data-theme='light']) .guides__badge[data-family='planning'] {
        color: #b45309;
        background: rgba(217, 119, 6, 0.12);
        border-color: rgba(217, 119, 6, 0.28);
      }
      :host-context([data-theme='light']) .guides__badge[data-family='compare'] {
        color: #047857;
        background: rgba(16, 185, 129, 0.12);
        border-color: rgba(16, 185, 129, 0.28);
      }

      .guides__card-icon {
        font-family: var(--font-mono);
        font-size: 0.9rem;
        color: var(--ink-4);
        transition: transform 0.35s var(--ease-out), color 0.35s var(--ease-out);
      }

      .guides__card:hover .guides__card-icon {
        color: var(--aurora-2);
        transform: translate(2px, -2px);
      }

      .guides__card-title {
        font-size: clamp(1.06rem, 1.5vw, 1.24rem);
        line-height: 1.3;
        letter-spacing: -0.025em;
        color: var(--ink);
      }

      .guides__card-desc {
        font-size: 0.9rem;
        line-height: 1.6;
        color: var(--ink-3);
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .guides__foot .btn {
        max-width: 100%;
        white-space: normal;
      }

      .guides__foot {
        margin-top: clamp(2rem, 4vw, 2.75rem);
        display: flex;
        justify-content: center;
      }
    `,
  ],
})
export class GuidesPreviewComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly active = inject(ActiveLocaleService);

  readonly copy = this.active.copy;
  private readonly locale: Locale;
  private readonly content: ArticleLocale | undefined;

  readonly hubHref = computed(() => linkPath(this.active.locale(), '/articles'));
  readonly heading = computed(() => this.content?.chrome.allArticles ?? this.copy().nav.articles);
  readonly description = computed(() => this.content?.chrome.hubDescription ?? '');
  readonly totalCount: () => number;
  readonly topics: () => readonly TopicPill[];
  readonly featured: () => readonly FeaturedGuideCard[];

  constructor() {
    const snap = this.route.snapshot;
    this.locale = (snap.data['locale'] as Locale | undefined) ?? DEFAULT_LOCALE;
    this.content = snap.data['articleContent'] as ArticleLocale | undefined;

    const articles = this.content?.articles ?? {};
    const chrome = this.content?.chrome;
    const headings: Record<Family, string> = {
      weather: chrome?.familyWeather ?? 'Weather',
      unify: chrome?.familyUnify ?? 'Calendars',
      widgets: chrome?.familyWidgets ?? 'Widgets',
      sharing: chrome?.familySharing ?? 'Sharing',
      planning: chrome?.familyPlanning ?? 'Planning',
      compare: chrome?.familyCompare ?? 'Comparisons',
    };

    const baseHub = linkPath(this.locale, '/articles');
    const topicList: TopicPill[] = [];
    const featuredCards: FeaturedGuideCard[] = [];
    let total = 0;

    for (const family of ARTICLE_FAMILIES) {
      const entries = Object.entries(articles).filter(([slug]) => ARTICLE_FACTS[slug]?.family === family);
      if (!entries.length) continue;
      total += entries.length;
      topicList.push({
        family,
        label: headings[family],
        count: entries.length,
        href: `${baseHub}#topic-${family}`,
      });
      const [firstSlug, firstArticle] = entries[0];
      featuredCards.push({
        slug: firstSlug,
        family,
        familyLabel: headings[family],
        title: firstArticle.short,
        description: firstArticle.description,
        href: linkPath(this.locale, `/articles/${firstSlug}`),
      });
    }

    this.totalCount = () => total;
    this.topics = () => topicList;
    this.featured = () => featuredCards;
  }
}
