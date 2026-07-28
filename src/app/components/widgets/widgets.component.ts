import { ChangeDetectionStrategy, Component } from '@angular/core';

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
@Component({
  selector: 'app-widgets',
  standalone: true,
  imports: [
    RevealDirective,
    RevealStaggerDirective,
    TiltDirective,
    InViewVideoDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './widgets.component.html',
  styleUrl: './widgets.component.scss',
})
export class WidgetsComponent {
  readonly points = [
    {
      icon: 'stack',
      title: 'Three widget sizes',
      body: 'Small for the date and temperature, medium for conditions, moon phase and wind, large for the day’s agenda alongside the forecast.',
    },
    {
      icon: 'bolt',
      title: 'Live Activity on the Lock Screen',
      body: 'Your next event counts down in the Dynamic Island and on the Lock Screen, so you never have to open anything to know how long you have.',
    },
    {
      icon: 'bell',
      title: 'Notifications that arrive in time',
      body: 'Event reminders that respect travel time and tell you what the weather is doing when you get there.',
    },
  ];
}
