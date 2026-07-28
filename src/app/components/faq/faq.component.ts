import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
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

  readonly items: Qa[] = [
    {
      q: 'Do I need an account to use Cloud Calendars?',
      a:
        'No. The app reads the calendars already on your iPhone through Apple’s own ' +
        'EventKit, so iCloud works the moment you grant permission. You only sign in ' +
        'to Google or Microsoft if you want those calendars in there too.',
    },
    {
      q: 'Is Google Calendar sync really free?',
      a:
        'Yes. Google sync, every calendar view, the complete weather hub, all the Home ' +
        'Screen widgets and Google Meet links are in the free tier. Advanced removes ads ' +
        'and adds cross-calendar management; Premium adds Microsoft.',
    },
    {
      q: 'Where does the weather data come from?',
      a:
        'Forecasts are fetched for your current or chosen location and cover hourly and ' +
        'ten-day outlooks, feels-like temperature, precipitation, UV, wind and gusts, ' +
        'humidity and dew point, visibility, pressure, sunrise and sunset, and moon phase.',
    },
    {
      q: 'Can I change an event by dragging it?',
      a:
        'That is the main way to edit. Drag an event to another time or another day, or ' +
        'pull its top or bottom edge to change the duration. Changes sync straight back ' +
        'to the source calendar.',
    },
    {
      q: 'What do the widgets show?',
      a:
        'Three sizes. Small gives the date with the current condition and temperature. ' +
        'Medium adds conditions, moon phase and wind direction. Large puts your next few ' +
        'events beside the forecast. A Live Activity counts down to your next event.',
    },
    {
      q: 'Which devices are supported?',
      a:
        'iPhone and iPad running iOS 18 or later. The app is about 30 MB.',
    },
    {
      q: 'How do I cancel a subscription?',
      a:
        'Subscriptions are handled by Apple, so you cancel in your App Store account ' +
        'settings. Do it at least 24 hours before the period ends and you will not be ' +
        'charged again.',
    },
  ];

  toggle(i: number): void {
    this.open.update((cur) => (cur === i ? -1 : i));
  }
}
