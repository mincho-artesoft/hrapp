import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MoreAppsComponent } from '../../components/more-apps/more-apps.component';
import { WeeklyScheduleBuilderComponent } from '../../components/weekly-schedule-builder/weekly-schedule-builder.component';
import { ShotRailComponent } from '../../components/shot-rail/shot-rail.component';
import { ARTICLE_FACTS } from '../../content/article-facts';
import { localesWith } from '../../content/article-index';
import { ArticleChrome, ArticleLocale, ClaimRow, LocalisedArticle } from '../../content/types';
import { ActiveLocaleService } from '../../core/active-locale.service';
import { APP_DEVELOPER, APP_NAME, APP_STORE_URL, SITE_URL } from '../../core/app-facts';
import { DEFAULT_LOCALE, Locale, linkPath, localePath, storeUrl } from '../../core/locales';
import { storeCta } from '../../core/store-cta';
import { SeoService, absolute } from '../../core/seo.service';
import { isArticleLocaleIndexable } from '../../core/article-indexing';

interface SeeAlsoLink {
  readonly path: string;
  readonly label: string;
}

const WEB_CTA_LABELS: Readonly<Record<string, readonly [string, string]>> = {
  'en-US': ['Open Web Calendar', 'Create Free Booking Link'],
  bg: ['Отвори уеб календара', 'Безплатен линк за резервации'],
  'de-DE': ['Web-Kalender öffnen', 'Kostenloser Buchungslink'],
  'fr-FR': ['Ouvrir le calendrier web', 'Lien de réservation gratuit'],
  'es-ES': ['Abrir calendario web', 'Enlace de reservas gratis'],
  it: ['Apri calendario web', 'Link di prenotazione gratuito'],
  'pt-BR': ['Abrir calendário web', 'Link de agendamento grátis'],
  ja: ['Webカレンダーを開く', '無料予約リンクを作成'],
  pl: ['Otwórz kalendarz WWW', 'Darmowy link rezerwacji'],
  'nl-NL': ['Webagenda openen', 'Gratis boekingslink'],
  'zh-Hans': ['打开网页版日历', '创建免费预约链接'],
  'zh-Hant': ['開啟網頁版日曆', '建立免費預約連結'],
  ko: ['웹 캘린더 열기', '무료 예약 링크 만들기'],
  ru: ['Открыть веб-календарь', 'Бесплатная ссылка записи'],
  tr: ['Web Takvimini Aç', 'Ücretsiz Randevu Bağlantısı'],
};

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
  imports: [ShotRailComponent, MoreAppsComponent, WeeklyScheduleBuilderComponent],
  templateUrl: './article-page.component.html',
  styleUrl: './article-page.component.scss',
})
export class ArticlePageComponent implements OnDestroy {
  private readonly doc = inject(DOCUMENT);
  private readonly active = inject(ActiveLocaleService);
  private readonly slug: string;
  readonly locale: Locale;
  readonly chrome: ArticleChrome;
  readonly article: LocalisedArticle | undefined;
  readonly isComparison: boolean;
  readonly hubHref: string;
  readonly hubLabel: string;
  readonly claims: ClaimRow[] = [];
  readonly relatedComparisons: SeeAlsoLink[] = [];
  readonly seeAlso: SeeAlsoLink[] = [];
  readonly articleLinks: SeeAlsoLink[] = [];
  readonly updated: string = '';
  readonly store = computed(() =>
    storeUrl(this.locale, APP_STORE_URL, this.active.tagged(this.slug || 'articles')),
  );
  readonly storeLabel: string;
  readonly webCalendarLabel: string;
  readonly showScheduleBuilder: boolean;
  readonly inlineCtaAfter: number = -1;

  constructor() {
    const route = inject(ActivatedRoute).snapshot;
    const slug = route.paramMap.get('slug') ?? '';
    this.slug = slug;
    this.isComparison = route.data['isComparison'] === true;
    this.showScheduleBuilder = !this.isComparison && slug === 'weekly-schedule-builder' && ((route.data['locale'] as Locale | undefined)?.code ?? 'en-US') === 'en-US';

    this.locale = (route.data['locale'] as Locale | undefined) ?? DEFAULT_LOCALE;
    const content = route.data['articleContent'] as ArticleLocale;
    if (!content) throw new Error('Article content was not resolved');
    this.chrome = content.chrome;
    this.article = content.articles[slug];
    this.hubHref = this.isComparison ? '/compare/' : linkPath(this.locale, '/articles');
    this.hubLabel = this.isComparison ? 'All comparisons' : this.chrome.allArticles;
    this.storeLabel = storeCta(this.locale.code);
    const [webCalLbl] = WEB_CTA_LABELS[this.locale.code] ?? WEB_CTA_LABELS['en-US'];
    this.webCalendarLabel = webCalLbl;

    const facts = ARTICLE_FACTS[slug];
    if (!this.article || (!this.isComparison && !facts)) return;

    this.inlineCtaAfter = this.article.sections.length
      ? Math.floor((this.article.sections.length - 1) / 2)
      : -1;

    this.updated = this.article.updated ?? facts?.updated ?? '2026-11-04';

    // Numbers from facts, words from the translation, joined by id — so a row
    // cannot end up carrying the wrong figure however the wording is edited.
    if (facts) {
      this.claims = facts.claims
        .filter((fact) => fact.id in this.article!.claims)
        .map((fact) => ({ label: this.article!.claims[fact.id], value: fact.value }));
    }

    this.relatedComparisons = (this.article.relatedComparisons ?? []).map((item) => ({
      path: `/compare/${item.slug}/`,
      label: item.label,
    }));

    this.seeAlso = (this.article.seeAlso ?? [])
      .filter((other) => other in content.articles)
      .map((other) => ({
        path: linkPath(this.locale, `/articles/${other}`),
        label: content.articles[other].short,
      }));

    this.articleLinks = (this.article.articleLinks ?? [])
      .filter(link => link.slug in content.articles)
      .map(link => ({ path: linkPath(this.locale, `/articles/${link.slug}`), label: link.label }));
    // Reference guides do not need a promotional action block to expose their
    // contextual links. Prefer the authored label and render each target once.
    if (!this.article.actionHeading) {
      this.seeAlso = [...new Map([...this.seeAlso, ...this.articleLinks]
        .map(link => [link.path, link])).values()];
    }

    const path = this.isComparison ? `/compare/${slug}` : `/articles/${slug}`;
    const googleIndexable = this.isComparison || isArticleLocaleIndexable(this.locale);
    inject(SeoService).apply({
      title: this.article.seoTitle ?? this.article.title,
      description: this.article.description,
      path: this.isComparison ? path : localePath(this.locale, path),
      type: 'article',
      locale: this.locale,
      robots: 'index,follow',
      googlebot: googleIndexable ? undefined : 'noindex,follow',
      alternates: this.isComparison || !googleIndexable
        ? []
        : localesWith(slug).filter(isArticleLocaleIndexable).map((other) => ({
            hreflang: other.hreflang,
            path: localePath(other, path),
          })),
    });

    this.describeAsArticle(slug, this.updated);
  }

  localised(path: string): string {
    return linkPath(this.locale, path);
  }

  sourceUrl(url: string): string {
    return url.includes('id6744690319')
      ? storeUrl(this.locale, url, this.active.tagged(this.slug || 'articles'))
      : url;
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
    const url = absolute(this.isComparison ? `/compare/${slug}` : localePath(this.locale, `/articles/${slug}`));
    const isoUpdated = /^\d{4}-\d{2}-\d{2}$/.test(updated) ? `${updated}T00:00:00Z` : updated;
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
      dateModified: isoUpdated,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      author: publisher,
      publisher,
      isPartOf: { '@type': 'WebSite', name: APP_NAME, url: SITE_URL },
      about: {
        '@type': 'SoftwareApplication',
        name: APP_NAME,
        applicationCategory: 'ProductivityApplication',
        operatingSystem: 'Web, iOS, iPadOS, macOS, watchOS',
        url: APP_STORE_URL,
        sameAs: [
          'https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319',
          'https://github.com/minchopm/cloud-calendars-docs',
          'https://www.producthunt.com/products/cloud-calendars-sync-widget',
        ],
      },
    });
    doc.head.appendChild(script);

    const breadcrumbId = 'article-breadcrumb-jsonld';
    doc.getElementById(breadcrumbId)?.remove();
    const breadcrumbScript = doc.createElement('script');
    breadcrumbScript.id = breadcrumbId;
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: APP_NAME, item: absolute(localePath(this.locale, '/')) },
        {
          '@type': 'ListItem',
          position: 2,
          name: this.isComparison ? 'Comparisons' : this.chrome.allArticles,
          item: absolute(this.isComparison ? '/compare' : localePath(this.locale, '/articles')),
        },
        { '@type': 'ListItem', position: 3, name: this.article!.short, item: url },
      ],
    });
    doc.head.appendChild(breadcrumbScript);

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
    this.doc.getElementById('article-breadcrumb-jsonld')?.remove();
    this.doc.getElementById('article-faq-jsonld')?.remove();
  }

}
