import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, computed, inject } from '@angular/core';

import { MoreAppsComponent } from '../../components/more-apps/more-apps.component';
import {
  COMPARISON_CARDS,
  COMPARISON_GROUP_META,
  ComparisonCardMeta,
  ComparisonGroup,
} from '../../content/comparisons';
import { ActiveLocaleService } from '../../core/active-locale.service';
import { APP_DEVELOPER, APP_NAME, APP_STORE_URL, SITE_URL } from '../../core/app-facts';
import { DEFAULT_LOCALE, storeUrl } from '../../core/locales';
import { SeoService, absolute } from '../../core/seo.service';
import { storeCta } from '../../core/store-cta';

interface ComparisonCluster {
  readonly id: ComparisonGroup;
  readonly heading: string;
  readonly subtitle: string;
  readonly cards: readonly ComparisonCardMeta[];
}

const GROUP_ORDER: readonly ComparisonGroup[] = ['apps', 'sync', 'views', 'devices'];

@Component({
  selector: 'cc-compare-page',
  standalone: true,
  imports: [MoreAppsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="cmp-hub">
      <header class="cmp-hub__head">
        <p class="cmp-hub__crumbs">
          <a class="cmp-hub__back" href="/">← Cloud Calendars Home</a>
          <a class="cmp-hub__back cmp-hub__back--alt" href="/articles/">All Guides →</a>
        </p>
        <p class="eyebrow">30 Side-by-Side Comparisons · 90+ Matrices</p>
        <h1>iPhone &amp; iPad Calendar App, Sync &amp; Workflow Comparisons</h1>
        <p class="cmp-hub__lead">
          Cloud Calendars is an iPhone and iPad calendar app (iOS / iPadOS 18.0+) by Arte Soft that combines
          Apple iCloud, Google Calendar (Free), Microsoft Outlook / 365 (Premium or via iOS Exchange), CalDAV,
          and subscribed ICS feeds with side-by-side multi-calendar columns, Apple WeatherKit hourly and
          up-to-10-day forecasts, Home Screen widgets, and Lock Screen Live Activities. Use the 30 matrices below
          to compare exact features, trade-offs, sync protocols, privacy models, and pricing—including where
          Apple Calendar, Google Calendar, Outlook Mobile, Fantastical, BusyCal, Notion Calendar, or Proton win.
        </p>
      </header>

      <nav class="cmp-hub__topics" aria-label="Comparison categories">
        @for (cluster of clusters; track cluster.id) {
          <a class="chip cmp-hub__topic" [href]="'/compare/#group-' + cluster.id">
            <span class="cmp-hub__dot" [attr.data-group]="cluster.id" aria-hidden="true"></span>
            <span>{{ cluster.heading }}</span>
            <span class="cmp-hub__count">{{ cluster.cards.length }}</span>
          </a>
        }
      </nav>

      <section class="cmp-hub__matrix" aria-labelledby="hub-matrix-heading">
        <h2 id="hub-matrix-heading">At-a-Glance Category Matrix: Cloud Calendars vs Alternatives</h2>
        <div class="cmp-hub__table-scroll" tabindex="0" aria-label="At-a-Glance Category Matrix">
          <table>
            <caption>Cloud Calendars tiers (Free, Advanced, Premium) compared against major calendar app families</caption>
            <thead>
              <tr>
                <th scope="col">Dimension</th>
                <th scope="col">Cloud Calendars Free ($0)</th>
                <th scope="col">Advanced ($4.99/yr) &amp; Premium ($49.99/yr)</th>
                <th scope="col">Built-In OS Apps (Apple / Google / Outlook)</th>
                <th scope="col">Paid Pro Suites (Fantastical / BusyCal / Readdle)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Supported platforms</td>
                <td>iPhone &amp; iPad (iOS / iPadOS 18.0+)</td>
                <td>iPhone &amp; iPad (iOS / iPadOS 18.0+)</td>
                <td>iOS, macOS, watchOS, Android &amp; Web (varies by app)</td>
                <td>iOS, iPadOS, macOS &amp; watchOS (+ Windows on Fantastical)</td>
              </tr>
              <tr>
                <td>Accounts &amp; protocols</td>
                <td>iCloud, CalDAV, ICS feeds, Local &amp; Google OAuth (+ Meet)</td>
                <td>Advanced: removes ads · Premium: adds Microsoft OAuth (+ Teams)</td>
                <td>Free native sync; Outlook adds corporate Intune MAM &amp; Room Finder</td>
                <td>Multi-account sets, custom CalDAV &amp; conferencing</td>
              </tr>
              <tr>
                <td>Views &amp; layout</td>
                <td>Day, Week, Month chips, 12-mo Year, List &amp; Multi-calendar columns</td>
                <td>Same 5 views + Multi-calendar side-by-side columns, zero ads</td>
                <td>Single merged column on iPhone; Google lacks 12-month Year view</td>
                <td>Merged timelines, Calendar Sets, split Month+List &amp; heatmaps</td>
              </tr>
              <tr>
                <td>Built-in weather</td>
                <td>Apple WeatherKit hourly grid + up-to-10-day Weather Hub</td>
                <td>Included with zero ads + tap forecast hour to start draft</td>
                <td>No built-in hourly weather station on iPhone</td>
                <td>Included in BusyCal ($14.99) &amp; Fantastical (~$57/yr)</td>
              </tr>
              <tr>
                <td>Tasks &amp; NLP parsing</td>
                <td>Event alerts only; visual grid tap, drag &amp; resize</td>
                <td>Event alerts only; visual grid tap, drag &amp; resize</td>
                <td>iOS 18 Apple Reminders (Apple) &amp; Google Tasks (Google)</td>
                <td>Natural-language sentence parsing &amp; task checklists</td>
              </tr>
              <tr>
                <td>Widgets &amp; Lock Screen</td>
                <td>3 Home Screen sizes (Date+Weather, Timed Events) &amp; Live Activity</td>
                <td>All widgets &amp; Live Activity included</td>
                <td>Home/Lock Screen widgets &amp; native Apple Watch complications</td>
                <td>Customizable Home/Lock Screen widgets &amp; Watch apps</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      @for (cluster of clusters; track cluster.id) {
        <section class="cmp-hub__group" [id]="'group-' + cluster.id">
          <div class="cmp-hub__group-head">
            <div>
              <h2>{{ cluster.heading }}</h2>
              <p class="cmp-hub__group-sub">{{ cluster.subtitle }}</p>
            </div>
            <span class="cmp-hub__badge-count">{{ cluster.cards.length }} comparisons</span>
          </div>

          <ul class="cmp-hub__grid">
            @for (card of cluster.cards; track card.slug) {
              <li class="card cmp-hub__card">
                <div class="cmp-hub__card-top">
                  <span class="cmp-hub__pill" [attr.data-group]="card.group">{{ card.badge }}</span>
                  <span class="cmp-hub__arrow" aria-hidden="true">↗</span>
                </div>
                <a class="cmp-hub__card-link" [href]="'/compare/' + card.slug + '/'">
                  {{ card.title }}
                </a>
                <p class="cmp-hub__card-desc">{{ card.description }}</p>
                <p class="cmp-hub__verdict"><strong>Quick verdict:</strong> {{ card.verdict }}</p>
              </li>
            }
          </ul>
        </section>
      }

      <section class="cmp-hub__guides" aria-labelledby="more-compare-guides">
        <h2 id="more-compare-guides">Related Pricing &amp; Workflow Guides</h2>
        <ul class="cmp-hub__links">
          <li><a href="/articles/what-fantastical-costs-and-what-this-does/">Fantastical vs Cloud Calendars: pricing, accounts, and weather</a></li>
          <li><a href="/articles/fantastical-readdle-calendar366-iphone-comparison/">Fantastical, Calendars by Readdle, Calendar 366, and Cloud Calendars</a></li>
          <li><a href="/articles/cozi-timetree-family-calendar-iphone-android/">Cozi, TimeTree, and shared family calendars on iPhone and Android</a></li>
          <li><a href="/articles/onecal-alternative-iphone-calendar-view-or-sync/">OneCal and unified calendar views on iPhone</a></li>
          <li><a href="/articles/free-google-sync-without-adverts/">Google Calendar sync on iPhone: free access and ad-free options</a></li>
          <li><a href="/articles/what-you-get-without-paying-anything/">Cloud Calendars Free plan: included views, sync, and widgets</a></li>
        </ul>
      </section>

      <footer class="cmp-hub__foot">
        <p>Download Cloud Calendars free on iPhone and iPad, or inspect every guide in our library.</p>
        <div class="cmp-hub__actions">
          <a class="btn btn--primary" [href]="store()" target="_blank" rel="noopener">{{ storeLabel }}</a>
          <a class="btn btn--ghost" href="/articles/">Browse all guides →</a>
        </div>
      </footer>

      <cc-more-apps [inline]="true" />
    </article>
  `,
  styles: [
    `
      .cmp-hub {
        max-width: 72rem;
        margin: 0 auto;
        padding: calc(var(--header-h) + clamp(36px, 6vw, 76px)) 20px 88px;
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: clamp(32px, 5vw, 52px);
        overflow-wrap: anywhere;
      }

      .cmp-hub__head {
        display: grid;
        gap: 0.9rem;
        padding-bottom: clamp(1.5rem, 3vw, 2.25rem);
        border-bottom: 1px solid var(--hair);
      }

      .cmp-hub__crumbs {
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        gap: 0.6rem;
      }

      .cmp-hub__back {
        display: inline-flex;
        align-items: center;
        padding: 0.4rem 0.9rem;
        border-radius: var(--r-pill);
        font-size: 0.84rem;
        font-weight: 500;
        color: var(--aurora-2);
        border: 1px solid rgba(56, 224, 240, 0.28);
        background: rgba(56, 224, 240, 0.08);
        transition: background 0.25s, border-color 0.25s;
      }

      .cmp-hub__back:hover {
        background: rgba(56, 224, 240, 0.16);
        border-color: rgba(56, 224, 240, 0.48);
      }

      .cmp-hub__head h1 {
        font-size: clamp(2rem, 4.6vw, 3.35rem);
        line-height: 1.08;
        letter-spacing: -0.035em;
      }

      .cmp-hub__lead {
        font-size: clamp(1rem, 1.8vw, 1.16rem);
        line-height: 1.66;
        color: var(--ink-2);
        max-width: 68ch;
      }

      .cmp-hub__topics {
        display: flex;
        flex-wrap: wrap;
        gap: 0.65rem;
      }

      .cmp-hub__dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--aurora-2);
        box-shadow: 0 0 8px rgba(56, 224, 240, 0.7);
      }
      .cmp-hub__dot[data-group='sync'] { background: var(--aurora-1); }
      .cmp-hub__dot[data-group='views'] { background: #52e39b; }
      .cmp-hub__dot[data-group='devices'] { background: var(--aurora-3); }

      .cmp-hub__count {
        font-family: var(--font-mono);
        font-size: 0.72rem;
        color: var(--ink-3);
        padding: 0.08rem 0.44rem;
        border-radius: var(--r-pill);
        background: rgba(255, 255, 255, 0.06);
      }

      .cmp-hub__matrix h2,
      .cmp-hub__guides h2 {
        font-size: clamp(1.35rem, 2.4vw, 1.75rem);
        letter-spacing: -0.028em;
        margin-bottom: 0.9rem;
      }

      .cmp-hub__table-scroll {
        overflow-x: auto;
        border: 1px solid var(--hair-strong);
        border-radius: var(--r-md);
        background: rgba(8, 13, 30, 0.55);
      }

      .cmp-hub__matrix table {
        width: 100%;
        border-collapse: collapse;
        min-width: 48rem;
      }

      .cmp-hub__matrix caption {
        caption-side: top;
        text-align: start;
        padding: 0.72rem 1rem;
        font-size: 0.82rem;
        color: var(--ink-3);
        border-bottom: 1px solid var(--hair);
        background: rgba(255, 255, 255, 0.025);
      }

      .cmp-hub__matrix th,
      .cmp-hub__matrix td {
        text-align: start;
        vertical-align: top;
        padding: 0.85rem 0.95rem;
        border-bottom: 1px solid var(--hair);
        line-height: 1.56;
        font-size: 0.92rem;
      }

      .cmp-hub__matrix tr:last-child td {
        border-bottom: 0;
      }

      .cmp-hub__matrix th {
        font-family: var(--font-display);
        font-size: 0.84rem;
        font-weight: 600;
        color: var(--ink);
        background: rgba(255, 255, 255, 0.06);
      }

      .cmp-hub__group {
        scroll-margin-top: calc(var(--header-h) + 1.5rem);
        display: grid;
        gap: 1.25rem;
      }

      .cmp-hub__group-head {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-end;
        justify-content: space-between;
        gap: 0.75rem 1.5rem;
      }

      .cmp-hub__group-head h2 {
        font-size: clamp(1.38rem, 2.5vw, 1.9rem);
        letter-spacing: -0.03em;
        margin: 0 0 0.35rem;
      }

      .cmp-hub__group-sub {
        margin: 0;
        color: var(--ink-3);
        max-width: 62ch;
        line-height: 1.55;
        font-size: 0.95rem;
      }

      .cmp-hub__badge-count {
        font-family: var(--font-mono);
        font-size: 0.75rem;
        color: var(--aurora-2);
        padding: 0.22rem 0.65rem;
        border-radius: var(--r-pill);
        background: rgba(56, 224, 240, 0.1);
        border: 1px solid rgba(56, 224, 240, 0.24);
      }

      .cmp-hub__grid {
        margin: 0;
        padding: 0;
        list-style: none;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
      }

      @media (max-width: 760px) {
        .cmp-hub__grid {
          grid-template-columns: 1fr;
        }
      }

      .cmp-hub__card {
        position: relative;
        padding: clamp(1.2rem, 2.2vw, 1.55rem);
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        transition: border-color 0.3s var(--ease-out), box-shadow 0.3s var(--ease-out);
      }

      .cmp-hub__card:hover {
        border-color: rgba(56, 224, 240, 0.36);
        box-shadow: var(--shadow-mid), 0 0 48px -22px rgba(56, 224, 240, 0.55);
      }

      .cmp-hub__card-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.65rem;
      }

      .cmp-hub__pill {
        padding: 0.24rem 0.64rem;
        border-radius: var(--r-pill);
        font-family: var(--font-mono);
        font-size: 0.66rem;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: #a9e8ff;
        background: rgba(56, 224, 240, 0.1);
        border: 1px solid rgba(56, 224, 240, 0.24);
      }
      .cmp-hub__pill[data-group='sync'] {
        color: #c5d6ff;
        background: rgba(77, 124, 255, 0.14);
        border-color: rgba(77, 124, 255, 0.3);
      }
      .cmp-hub__pill[data-group='views'] {
        color: #b4f5d3;
        background: rgba(82, 227, 155, 0.12);
        border-color: rgba(82, 227, 155, 0.28);
      }
      .cmp-hub__pill[data-group='devices'] {
        color: #dfc2ff;
        background: rgba(165, 102, 255, 0.14);
        border-color: rgba(165, 102, 255, 0.3);
      }

      .cmp-hub__arrow {
        font-family: var(--font-mono);
        font-size: 0.88rem;
        color: var(--ink-4);
      }

      .cmp-hub__card-link {
        font-family: var(--font-display);
        font-weight: 600;
        font-size: 1.08rem;
        line-height: 1.3;
        letter-spacing: -0.02em;
        color: var(--ink);
        text-decoration: none;
      }

      .cmp-hub__card-link::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
      }

      .cmp-hub__card:hover .cmp-hub__card-link {
        color: #9beeff;
      }

      .cmp-hub__card-desc {
        margin: 0;
        font-size: 0.9rem;
        line-height: 1.56;
        color: var(--ink-3);
      }

      .cmp-hub__verdict {
        margin: 0.15rem 0 0;
        padding-top: 0.6rem;
        border-top: 1px solid var(--hair);
        font-size: 0.85rem;
        line-height: 1.52;
        color: var(--ink-2);
      }

      .cmp-hub__verdict strong {
        color: #9beeff;
      }

      .cmp-hub__links {
        padding-inline-start: 1.25rem;
        display: grid;
        gap: 0.6rem;
      }

      .cmp-hub__links a {
        color: #9beeff;
        text-decoration: underline;
        text-decoration-color: rgba(56, 224, 240, 0.35);
        text-underline-offset: 3px;
      }

      .cmp-hub__foot {
        padding: clamp(1.3rem, 3vw, 1.9rem);
        border-radius: var(--r-md);
        border: 1px solid var(--hair-strong);
        background: linear-gradient(155deg, rgba(56, 224, 240, 0.08), rgba(77, 124, 255, 0.05));
        display: grid;
        gap: 1rem;
      }

      .cmp-hub__foot p {
        margin: 0;
        color: var(--ink-2);
      }

      .cmp-hub__actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
      }
    `,
  ],
})
export class ComparePageComponent implements OnDestroy {
  private readonly doc = inject(DOCUMENT);
  private readonly active = inject(ActiveLocaleService);
  readonly clusters: readonly ComparisonCluster[];
  readonly store = computed(() =>
    storeUrl(DEFAULT_LOCALE, APP_STORE_URL, this.active.tagged('compare')),
  );
  readonly storeLabel = storeCta(DEFAULT_LOCALE.code);

  constructor() {
    this.clusters = GROUP_ORDER.map((id) => ({
      id,
      heading: COMPARISON_GROUP_META[id].heading,
      subtitle: COMPARISON_GROUP_META[id].subtitle,
      cards: COMPARISON_CARDS.filter((card) => card.group === id),
    }));

    const hubTitle = 'iPhone Calendar App & Sync Comparisons | Cloud Calendars';
    const hubDescription =
      'Compare Cloud Calendars on iPhone and iPad with Apple Calendar, Google Calendar, Fantastical, Outlook, BusyCal, Notion, CalDAV vs ICS vs OAuth, weather, and widgets.';

    inject(SeoService).apply({
      title: hubTitle,
      description: hubDescription,
      path: '/compare',
      locale: DEFAULT_LOCALE,
      robots: 'index,follow',
      alternates: [],
    });

    this.describeHub(hubTitle, hubDescription);
  }

  private describeHub(title: string, description: string): void {
    const url = absolute('/compare');
    const publisher = { '@type': 'Organization', name: APP_DEVELOPER, url: SITE_URL };

    this.doc.getElementById('compare-hub-jsonld')?.remove();
    const collection = this.doc.createElement('script');
    collection.id = 'compare-hub-jsonld';
    collection.type = 'application/ld+json';
    collection.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: title,
      description,
      url,
      inLanguage: DEFAULT_LOCALE.hreflang,
      publisher,
      isPartOf: { '@type': 'WebSite', name: APP_NAME, url: SITE_URL },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: COMPARISON_CARDS.length,
        itemListElement: COMPARISON_CARDS.map((card, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: card.title,
          url: absolute(`/compare/${card.slug}`),
        })),
      },
    });
    this.doc.head.appendChild(collection);

    this.doc.getElementById('compare-breadcrumb-jsonld')?.remove();
    const crumbs = this.doc.createElement('script');
    crumbs.id = 'compare-breadcrumb-jsonld';
    crumbs.type = 'application/ld+json';
    crumbs.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: APP_NAME, item: absolute('/') },
        { '@type': 'ListItem', position: 2, name: 'Comparisons', item: url },
      ],
    });
    this.doc.head.appendChild(crumbs);
  }

  ngOnDestroy(): void {
    this.doc.getElementById('compare-hub-jsonld')?.remove();
    this.doc.getElementById('compare-breadcrumb-jsonld')?.remove();
  }
}
