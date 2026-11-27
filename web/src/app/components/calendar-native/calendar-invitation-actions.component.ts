import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CalendarNativeTextPipe } from '../../core/calendar-localization';

@Component({
  selector: 'cc-invitation-actions',
  standalone: true,
  imports: [CalendarNativeTextPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" class="decline" [disabled]="disabled()" (click)="decline.emit()">
      <span>{{ 'Decline' | nativeText }}</span>
    </button>
    <button type="button" class="accept" [disabled]="disabled()" (click)="accept.emit()">
      <span>{{ 'Accept' | nativeText }}</span>
    </button>`,
  styleUrl: './calendar-invitation-buttons.scss',
  styles: `
    :host { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; width: 100%; }
  `,
})
export class CalendarInvitationActionsComponent {
  readonly disabled = input(false);
  readonly decline = output<void>();
  readonly accept = output<void>();
}
