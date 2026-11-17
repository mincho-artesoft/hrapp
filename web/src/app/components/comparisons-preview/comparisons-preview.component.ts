import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { COMPARISON_CARDS, ComparisonCardMeta } from '../../content/comparisons';
import { ActiveLocaleService } from '../../core/active-locale.service';
import { RevealDirective } from '../../core/reveal.directive';

@Component({
  selector: 'app-comparisons-preview',
  standalone: true,
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isEnglish()) {
      <section id="compare" class="section cmp-preview" aria-labelledby="cmp-preview-title">
        <div class="shell">
          <header class="cmp-preview__head" appReveal>
            <div class="cmp-preview__copy">
              <p class="eyebrow">Side-by-Side Matrices</p>
              <h2 id="cmp-preview-title" class="section-title">How Cloud Calendars Compares</h2>
              <p class="section-lead">
                Inspect side-by-side feature, sync protocol, weather, widget, and pricing tables comparing
                Cloud Calendars with Apple Calendar, Google Calendar, Fantastical, Outlook, BusyCal, Notion Calendar,
                and 24 more iOS calendar setups.
              </p>
            </div>

            <a class="btn btn--ghost cmp-preview__cta" href="/compare/">
              <span>All 30 Comparisons</span>
              <span aria-hidden="true">→</span>
            </a>
          </header>

          <div class="cmp-preview__grid">
            @for (card of featured; track card.slug; let i = $index) {
              <a
                class="card cmp-preview__card"
                [href]="'/compare/' + card.slug + '/'"
                appReveal="zoom"
                [revealDelay]="i * 45"
              >
                <div class="cmp-preview__top">
                  <span class="cmp-preview__badge" [attr.data-group]="card.group">{{ card.badge }}</span>
                  <span class="cmp-preview__icon" aria-hidden="true">↗</span>
                </div>
                <h3 class="cmp-preview__title">{{ card.short }}</h3>
                <p class="cmp-preview__desc">{{ card.verdict }}</p>
              </a>
            }
          </div>

          <nav class="cmp-preview__directory" aria-label="More calendar comparisons" appReveal [revealDelay]="140">
            <p class="cmp-preview__dir-label">Explore all remaining comparison matrices:</p>
            <div class="cmp-preview__pills">
              @for (card of moreCards; track card.slug) {
                <a class="chip cmp-preview__pill" [href]="'/compare/' + card.slug + '/'">
                  {{ card.short }}
                </a>
              }
            </div>
          </nav>

          <div class="cmp-preview__foot" appReveal [revealDelay]="180">
            <a class="btn btn--primary" href="/compare/">
              <span>Open the Full 30-Page Comparisons Hub</span>
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

      .cmp-preview__head {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-end;
        justify-content: space-between;
        gap: 1.5rem 2.5rem;
        margin-bottom: clamp(2rem, 4vw, 2.8rem);
      }

      .cmp-preview__copy {
        max-width: 46rem;
      }

      .cmp-preview__grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: clamp(0.95rem, 1.8vw, 1.3rem);
      }

      @media (max-width: 960px) {
        .cmp-preview__grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 620px) {
        .cmp-preview__grid {
          grid-template-columns: 1fr;
        }
      }

      .cmp-preview__card {
        display: flex;
        flex-direction: column;
        gap: 0.7rem;
        padding: clamp(1.25rem, 2.2vw, 1.7rem);
        text-decoration: none;
        transition:
          transform 0.35s var(--ease-out),
          border-color 0.35s var(--ease-out),
          box-shadow 0.35s var(--ease-out);
      }

      .cmp-preview__card:hover {
        border-color: var(--aurora-2);
        box-shadow: var(--shadow-mid);
      }

      .cmp-preview__top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.7rem;
      }

      .cmp-preview__badge {
        padding: 0.26rem 0.66rem;
        border-radius: var(--r-pill);
        font-size: 0.68rem;
        font-weight: 600;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: var(--aurora-2);
        background: var(--aurora-1-soft);
        border: 1px solid var(--nav-active-border);
      }
      .cmp-preview__badge[data-group='sync'] {
        color: #c5d6ff;
        background: rgba(77, 124, 255, 0.14);
        border-color: rgba(77, 124, 255, 0.3);
      }
      .cmp-preview__badge[data-group='views'] {
        color: #b4f5d3;
        background: rgba(82, 227, 155, 0.12);
        border-color: rgba(82, 227, 155, 0.28);
      }
      .cmp-preview__badge[data-group='devices'] {
        color: #dfc2ff;
        background: rgba(165, 102, 255, 0.14);
        border-color: rgba(165, 102, 255, 0.3);
      }

      :host-context([data-theme='light']) .cmp-preview__badge {
        color: #0369a1;
        background: rgba(2, 132, 199, 0.1);
        border-color: rgba(2, 132, 199, 0.25);
      }
      :host-context([data-theme='light']) .cmp-preview__badge[data-group='sync'] {
        color: #1d4ed8;
        background: rgba(37, 99, 235, 0.1);
        border-color: rgba(37, 99, 235, 0.25);
      }
      :host-context([data-theme='light']) .cmp-preview__badge[data-group='views'] {
        color: #047857;
        background: rgba(16, 185, 129, 0.12);
        border-color: rgba(16, 185, 129, 0.28);
      }
      :host-context([data-theme='light']) .cmp-preview__badge[data-group='devices'] {
        color: #6d28d9;
        background: rgba(124, 58, 237, 0.1);
        border-color: rgba(124, 58, 237, 0.26);
      }

      .cmp-preview__icon {
        font-family: var(--font-mono);
        font-size: 0.9rem;
        color: var(--ink-4);
      }

      .cmp-preview__title {
        margin: 0;
        font-family: var(--font-display);
        font-size: 1.08rem;
        font-weight: 600;
        line-height: 1.28;
        letter-spacing: -0.02em;
        color: var(--ink);
      }

      .cmp-preview__card:hover .cmp-preview__title {
        color: var(--accent-link);
      }

      .cmp-preview__desc {
        margin: 0;
        font-size: 0.89rem;
        line-height: 1.56;
        color: var(--ink-3);
      }

      .cmp-preview__directory {
        margin-top: clamp(1.6rem, 3vw, 2.2rem);
        padding: clamp(1.1rem, 2.2vw, 1.45rem);
        border-radius: var(--r-md);
        border: 1px solid var(--hair);
        background: var(--control-bg);
      }

      .cmp-preview__dir-label {
        margin: 0 0 0.85rem;
        font-family: var(--font-mono);
        font-size: 0.76rem;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: var(--ink-3);
      }

      .cmp-preview__pills {
        display: flex;
        flex-wrap: wrap;
        gap: 0.55rem;
      }

      .cmp-preview__pill {
        font-size: 0.82rem;
        transition: border-color 0.25s, background 0.25s, color 0.25s;
      }

      .cmp-preview__pill:hover {
        color: var(--ink);
        border-color: var(--aurora-2);
        background: var(--aurora-1-soft);
      }

      .cmp-preview__foot {
        margin-top: clamp(1.6rem, 3vw, 2.2rem);
        display: flex;
        justify-content: center;
      }
    `,
  ],
})
export class ComparisonsPreviewComponent {
  private readonly active = inject(ActiveLocaleService);
  readonly isEnglish = computed(() => this.active.locale().code === 'en-US');
  readonly featured: readonly ComparisonCardMeta[] = COMPARISON_CARDS.filter(
    (card) => card.featuredOnHome,
  );
  readonly moreCards: readonly ComparisonCardMeta[] = COMPARISON_CARDS.filter(
    (card) => !card.featuredOnHome,
  );
}
