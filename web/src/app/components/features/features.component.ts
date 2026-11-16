import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { ActiveLocaleService } from '../../core/active-locale.service';
import { RevealDirective } from '../../core/reveal.directive';
import { TiltDirective } from '../../core/tilt.directive';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [RevealDirective, TiltDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss',
})
export class FeaturesComponent {
  private readonly active = inject(ActiveLocaleService);
  readonly copy = computed(() => this.active.copy().features);

  /** Sources shown orbiting in the "one place" tile. The names are brands and
   *  stay as they are; only the note beside each one is translated. */
  readonly sources = computed(() => {
    const n = this.copy().sourceNotes;
    return [
      { id: 'icloud', name: 'iCloud', note: n.twoWay },
      { id: 'google', name: 'Google', note: n.twoWay },
      { id: 'microsoft', name: 'Microsoft', note: n.premium },
    ];
  });

  readonly smallTiles = computed(() => this.copy().tiles);
}
