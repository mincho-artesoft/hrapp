import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  computed,
  inject,
} from '@angular/core';

import { ActiveLocaleService } from '../../core/active-locale.service';
import { LOCALES } from '../../core/locales';

/**
 * Switch the page to another language.
 *
 * Built on <details> rather than a signal and a click handler. Every page on
 * this site is prerendered and readable without JavaScript; a switcher that
 * needs JavaScript would have been the one control that did not work, and it
 * is the control a reader in the wrong language needs most. <details> also
 * brings keyboard behaviour and the twenty-nine links into the served HTML for
 * free.
 *
 * The switcher stays on the same page rather than dropping the reader on the
 * home page. Where a page does not exist in the chosen language -- most
 * articles are English only -- it falls back to that language's article hub,
 * which exists in all of them.
 */
@Component({
  selector: 'app-language-switcher',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss',
})
export class LanguageSwitcherComponent {
  @ViewChild('panel') private panel?: ElementRef<HTMLDetailsElement>;

  private readonly active = inject(ActiveLocaleService);

  readonly current = this.active.locale;
  readonly label = computed(() => this.active.copy().nav.language);
  /** Each language paired with where this page lives in it. */
  readonly options = computed(() =>
    LOCALES.map((locale) => ({ locale, href: this.active.equivalentPath(locale) })),
  );

  @HostListener('document:click', ['$event'])
  onOutside(event: MouseEvent): void {
    const el = this.panel?.nativeElement;
    if (!el?.open) return;
    if (!(event.target as HTMLElement)?.closest('app-language-switcher')) el.open = false;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    const el = this.panel?.nativeElement;
    if (el?.open) el.open = false;
  }
}
