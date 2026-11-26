import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, inject, input, model, output, viewChild } from '@angular/core';
import { CalendarNativeTextPipe } from '../../core/calendar-localization';

@Component({
  selector: 'cc-calendar-removal',
  imports: [CalendarNativeTextPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (confirming()) {
      <div class="confirmation" role="group" [attr.aria-label]="prompt() | nativeText">
        <p>{{ prompt() | nativeText }}</p>
        <div class="actions">
          <button #cancel type="button" [disabled]="busy()" (click)="setConfirmation(false)">{{ 'Cancel' | nativeText }}</button>
          <button type="button" class="danger" [disabled]="busy()" (click)="confirmed.emit()">{{ confirmLabel() | nativeText }}</button>
        </div>
      </div>
    } @else {
      <button #trigger type="button" class="remove-calendar" [disabled]="busy()" (click)="setConfirmation(true)">{{ label() | nativeText }}</button>
    }
  `,
  styles: `
    :host { display: block; margin-bottom: 28px; }
    button { border: 0; font: inherit; min-height: 44px; cursor: pointer; }
    button:focus-visible { outline: 2px solid var(--cal-blue); outline-offset: -2px; }
    button:disabled { opacity: .45; cursor: default; }
    .remove-calendar, .confirmation { border-radius: var(--calendar-section-radius); background: var(--cal-panel); }
    .remove-calendar {
      display: block; width: 100%; padding: 0 16px; text-align: center;
      color: #ff453a; font-size: 17px; overflow-wrap: anywhere;
    }
    .confirmation { padding: 16px; }
    .confirmation p { margin: 0 0 12px; }
    .actions { display: flex; gap: 12px; }
    .actions button {
      flex: 1; padding: 10px 18px; border-radius: 24px; font-weight: 600;
      color: var(--cal-blue); background: color-mix(in srgb, var(--cal-blue) 14%, transparent);
    }
    .actions .danger { color: #ff453a; background: #ff3b301a; }
  `,
})
export class CalendarRemovalComponent {
  readonly label = input('Delete Calendar');
  readonly prompt = input.required<string>();
  readonly confirmLabel = input('Delete');
  readonly busy = input(false);
  readonly confirming = model(false);
  readonly confirmed = output<void>();
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly trigger = viewChild<ElementRef<HTMLButtonElement>>('trigger');
  private readonly cancel = viewChild<ElementRef<HTMLButtonElement>>('cancel');

  setConfirmation(value: boolean) {
    this.confirming.set(value);
    this.changeDetector.detectChanges();
    (value ? this.cancel() : this.trigger())?.nativeElement.focus();
  }
}
