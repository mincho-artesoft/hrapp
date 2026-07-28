import { ChangeDetectionStrategy, Component } from '@angular/core';

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
  /** Sources shown orbiting in the "one place" tile. */
  readonly sources = [
    { id: 'icloud', name: 'iCloud', note: 'Two-way' },
    { id: 'google', name: 'Google', note: 'Two-way' },
    { id: 'microsoft', name: 'Microsoft', note: 'Premium' },
  ];

  readonly smallTiles = [
    {
      id: 'links',
      title: 'Meeting links, generated for you',
      body:
        'Create an event on a Google calendar and a Meet link is attached. Create one ' +
        'on Microsoft and you get a Teams link. Nobody has to paste anything.',
      badge: 'Meet · Teams',
    },
    {
      id: 'forecast',
      title: 'Turn a forecast into a plan',
      body:
        'Tap any hour in the weather hub and a new event opens, already set to that ' +
        'time. Find the dry window, then book it.',
      badge: 'One tap',
    },
    {
      id: 'privacy',
      title: 'Your calendar stays yours',
      body:
        'Events are read through Apple, Google and Microsoft’s own APIs and rendered ' +
        'on device. Nothing is sold, and there is no account to create.',
      badge: 'No account',
    },
  ];
}
