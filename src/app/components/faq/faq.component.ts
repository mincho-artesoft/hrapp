import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
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
export class FaqComponent {
  /** Index of the open row, or -1 for none. */
  readonly open = signal(0);

  private readonly active = inject(ActiveLocaleService);
  readonly copy = computed(() => this.active.copy().faq);
  readonly items = computed<readonly Qa[]>(() => this.copy().items);
  /** The lead wraps a link. Split here so the template can place it without
   *  introducing whitespace either side of the anchor. */
  readonly leadBefore = computed(() => this.copy().lead.split('{link}')[0]);
  readonly leadAfter = computed(() => this.copy().lead.split('{link}')[1] ?? '');
  readonly privacyHref = computed(() =>
    `${this.active.path('/')}privacy-policy/`.replace('//privacy', '/privacy'),
  );

  toggle(i: number): void {
    this.open.update((cur) => (cur === i ? -1 : i));
  }
}
