import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { CalendarLocalization, CalendarNativeTextPipe } from '../../core/calendar-localization';
import { calendarDateFormatter } from '../../core/calendar-format-preferences';
import type { BookingSlot } from '../../core/booking-workspace';
import { CalendarActionSheetComponent } from './calendar-action-sheet.component';

import { CalendarEventRemovalButtonComponent } from './calendar-event-editor-fields';

export function bookingRange(slot: BookingSlot, locale: CalendarLocalization): string {
  const start = new Date(slot.start), end = new Date(slot.end);
  if (slot.allDay) {
    const date = calendarDateFormatter(locale.formattingLocale(), locale.datePreference(), {timeZone: slot.timeZone});
    const first = date(start), last = date(new Date(+end - 1));
    return (first === last ? first : first + ' – ' + last) + ' · ' + locale.text('All-day');
  }
  const date = locale.shortDate(), time = locale.shortTime();
  const endDate = start.toDateString() === end.toDateString() ? '' : date(end) + ', ';
  return date(start) + ', ' + time.format(start) + ' – ' + endDate + time.format(end);
}

@Component({
  selector: 'cc-guest-booking-action',
  imports: [CalendarActionSheetComponent, CalendarNativeTextPipe, CalendarEventRemovalButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!tile()) {
      @if (cancelling()) {
        <cc-event-removal-button [label]="label()" [busy]="busy()" (pressed)="rowAnchor.set($event)" />
      } @else {
        <button type="button" #trigger class="accept" [disabled]="busy()" (click)="rowAnchor.set(trigger)">
          <span>{{ label() | nativeText }}</span>
        </button>
      }
    }
    @if (tile() || rowAnchor()) {
      <cc-calendar-action-sheet class="explicit-cancel" [heading]="label()" [message]="detail()"
        [primaryLabel]="label()" [destructive]="cancelling()" [cancelLabel]="cancelling() ? 'Keep booking' : 'Cancel'" [busy]="busy()"
        (primary)="finish(true)" (dismissed)="finish(false)" />
    }`,
  styleUrl: './calendar-invitation-buttons.scss',
  host: {'[class.full-row]':'cancelling() && !tile()'},
  styles: ':host { display: inline-block; max-width: 100%; } :host(.full-row) {display:block;width:100%}',
})
export class CalendarGuestBookingActionComponent {
  readonly cancelling = input(false);
  readonly detail = input.required<string>();
  readonly busy = input(false);
  // A timeline tile is already a button. A list row supplies its own trigger here.
  readonly tile = input<HTMLButtonElement>();
  readonly confirmed = output<void>();
  readonly dismissed = output<void>();
  protected readonly rowAnchor = signal<HTMLButtonElement | null>(null);
  protected readonly label = computed(() => this.cancelling() ? 'Cancel booking' : 'Book');

  protected finish(confirmed: boolean) {
    if (this.busy()) return;
    this.rowAnchor.set(null);
    if (confirmed) this.confirmed.emit();
    else this.dismissed.emit();
  }
}
