import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  computed,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';

import { ActiveLocaleService } from '../../core/active-locale.service';
import { CalendarLocalization, calendarLanguageDirection, siteForCalendarLanguage } from '../../core/calendar-localization';
import { LOCALES } from '../../core/locales';

/**
 * Switch the page to another language.
 *
 * Built on <details> rather than a signal and a click handler. Every page on
 * this site is prerendered and readable without JavaScript; a switcher that
 * needs JavaScript would have been the one control that did not work, and it
 * is the control a reader in the wrong language needs most. <details> also
 * keeps keyboard navigation and language links available in the served HTML.
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
  private readonly workspace = inject(CalendarLocalization);
  private readonly router = inject(Router);

  readonly current = computed(() => this.active.calendarSection() ? this.workspace.locale() : this.active.locale().hreflang);
  readonly label = computed(() => this.active.copy().nav.language);
  private readonly calendarOptions = computed(() => this.workspace.languages.map(({value}) => ({
    code: value, label: new Intl.DisplayNames([value], {type: 'language'}).of(value) ?? value,
    dir: calendarLanguageDirection(value), site: siteForCalendarLanguage(value),
  })));
  readonly options = computed(() => {
    const section = this.active.calendarSection();
    if (section) return this.calendarOptions().map(option => ({
      ...option, href: this.active.calendarHref(section, option.site, option.code),
    }));
    return LOCALES.map(locale => ({
      code: locale.hreflang, label: locale.label, dir: locale.dir, href: this.active.equivalentPath(locale),
    }));
  });

  select(event: MouseEvent, href: string) {
    if (!this.active.calendarSection() || event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const panel = this.panel?.nativeElement;
    if (panel) {
      panel.open = false;
      panel.querySelector('summary')?.focus();
    }
    void this.router.navigateByUrl(Location.stripTrailingSlash(href));
  }

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
