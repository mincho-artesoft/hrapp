import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { RevealDirective, RevealStaggerDirective } from '../../core/reveal.directive';
import { TiltDirective } from '../../core/tilt.directive';
import { InViewVideoDirective } from '../../core/in-view-video.directive';

/**
 * Home Screen widgets + Live Activity.
 *
 * This used to be a CSS recreation of the Home Screen. It is now the real
 * thing: a Simulator capture on an iPhone 17 Pro showing all three widget
 * sizes and the Live Activity counting down to a dinner reservation. A
 * recreation could always be accused of flattering the product; a recording
 * cannot.
 *
 * The clip only loads once the section scrolls into view — see
 * InViewVideoDirective.
 */
// The copy is per language; the icons are not.
import { ActiveLocaleService } from '../../core/active-locale.service';
import { WIDGETS_SINCE } from '../../core/app-facts';
@Component({
  selector: 'app-widgets',
  standalone: true,
  imports: [RevealDirective, RevealStaggerDirective, TiltDirective, InViewVideoDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './widgets.component.html',
  styleUrl: './widgets.component.scss',
})
export class WidgetsComponent {
  private readonly active = inject(ActiveLocaleService);

  readonly copy = computed(() => this.active.copy().widgets);
  readonly eyebrow = computed(() => this.copy().eyebrow.replace('{v}', WIDGETS_SINCE));

  /** Icons stay in code; the words come from the language. */
  private readonly icons = ['grid', 'lock', 'bell'];
  readonly points = computed(() =>
    this.copy().items.map((item, i) => ({ ...item, icon: this.icons[i] ?? 'grid' })),
  );
}
