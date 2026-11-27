import { CalendarActionSheetComponent } from './calendar-action-sheet.component';
import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { CalendarNativeTextPipe } from '../../core/calendar-localization';

@Component({
  selector: 'cc-calendar-removal',
  imports: [CalendarNativeTextPipe, CalendarActionSheetComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button #trigger type="button" class="remove-calendar" [disabled]="busy()" (click)="confirming.set(true)">{{ label() | nativeText }}</button>
    @if (confirming()) {
      <cc-calendar-action-sheet [anchor]="trigger" [heading]="prompt()" [message]="detail()" [cancelLabel]="cancelLabel()" [primaryLabel]="confirmLabel()" [destructive]="true" [busy]="busy()"
        (primary)="confirmed.emit(); confirming.set(false)" (dismissed)="confirming.set(false)" />
    }
  `,
  styles: `
    :host { display: block; margin-bottom: 28px; }
    button { border: 0; font: inherit; min-height: 44px; cursor: pointer; }
    button:focus-visible { outline: 2px solid var(--cal-blue); outline-offset: -2px; }
    button:disabled { opacity: .45; cursor: default; }
    .remove-calendar { border-radius: var(--calendar-section-radius); background: var(--cal-panel); }
    .remove-calendar {
      display: block; width: 100%; padding: 0 16px; text-align: center;
      color: #ff453a; font-size: 17px; overflow-wrap: anywhere;
    }
  `,
})
export class CalendarRemovalComponent {
  readonly label = input('Delete Calendar');
  readonly prompt = input.required<string>();
  readonly confirmLabel = input('Delete');
  readonly cancelLabel = input('Cancel');
  readonly detail = input('');
  readonly busy = input(false);
  readonly confirming = model(false);
  readonly confirmed = output<void>();
}
