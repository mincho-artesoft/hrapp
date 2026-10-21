import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ARTICLE_FACTS } from '../../content/article-facts';
import { LIVE_LOCALES } from '../../content/article-index';
import { ArticleChrome, ArticleLocale, Family } from '../../content/types';
import { DEFAULT_LOCALE, Locale, linkPath, localePath } from '../../core/locales';
import { MoreAppsComponent } from '../../components/more-apps/more-apps.component';
import { SeoService } from '../../core/seo.service';

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
}

/** The index of everything written in one language, grouped by theme. */
@Component({
  selector: 'cc-articles-page',
  standalone: true,
  imports: [MoreAppsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="hub">
      <h1>{{ chrome.allArticles }}</h1>
      @for (group of groups; track group.family) {
        <section>
          <h2>{{ group.heading }}</h2>
          <ul>
            @for (card of group.cards; track card.slug) {
              <li>
                <a [href]="card.path">{{ card.title }}</a>
                <p>{{ card.description }}</p>
              </li>
            }
          </ul>
        </section>
      }
      <cc-more-apps [inline]="true" />
    </div>
  `,
  styles: [
    `
      .hub {
        max-width: 52rem;
        margin: 0 auto;
        padding: clamp(32px, 6vw, 72px) 20px 80px;
        display: grid;
        gap: clamp(28px, 4vw, 44px);
      }

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

  constructor() {
    const route = inject(ActivatedRoute).snapshot;
    this.locale = (route.data['locale'] as Locale | undefined) ?? DEFAULT_LOCALE;

    const content = route.data['articleContent'] as ArticleLocale;
    if (!content) throw new Error('Article hub content was not resolved');
    this.chrome = content.chrome;

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
    const order: Family[] = ['weather', 'unify', 'widgets', 'sharing', 'planning', 'compare'];
    for (const family of order) {
      const cards = Object.entries(content.articles)
        .filter(([slug]) => ARTICLE_FACTS[slug]?.family === family)
        .map(([slug, article]) => ({
          slug,
          path: linkPath(this.locale, `/articles/${slug}`),
          title: article.short,
          description: article.description,
        }));
      if (cards.length) this.groups.push({ family, heading: headings[family], cards });
    }

    inject(SeoService).apply({
      title: this.chrome.hubTitle,
      description: this.chrome.hubDescription,
      path: localePath(this.locale, '/articles'),
      locale: this.locale,
      // The hub exists in every published language, so its alternate set is
      // simply the published languages. Without this, twenty-nine near-identical
      // pages faced a search engine with nothing saying they were translations.
      alternates: LIVE_LOCALES.map((other) => ({
        hreflang: other.hreflang,
        path: localePath(other, '/articles'),
      })),
    });
  }
}
