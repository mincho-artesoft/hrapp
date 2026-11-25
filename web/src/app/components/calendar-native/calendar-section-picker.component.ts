import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CalendarNativeTextPipe } from '../../core/calendar-localization';

@Component({
  selector: 'cc-section-picker',
  standalone: true,
  imports: [CalendarNativeTextPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav [attr.aria-label]="label() | nativeText" [style.--columns]="columns()">
      @for (option of options(); track option.value) {
        <button type="button" [attr.aria-pressed]="value() === option.value" [title]="option.label | nativeText"
          (click)="valueChange.emit(option.value)">{{ option.label | nativeText }}</button>
      }
    </nav>
  `,
  styles: `
    :host { display: block; min-width: 0; }
    nav {
      display: grid;
      grid-template-columns: repeat(var(--columns), minmax(0, 1fr));
      padding: 3px;
      border-radius: 21px;
      background: var(--section-fill, var(--cal-panel));
    }
    button {
      min-height: 32px;
      padding: 4px 6px;
      border: 0;
      border-radius: 17px;
      background: transparent;
      color: var(--cal-text);
      font: inherit;
      font-size: clamp(12px, 1.35vw, 15px);
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow-wrap: anywhere;
    }
    button[aria-pressed="true"] {
      background: var(--cal-bg);
      font-weight: 600;
      box-shadow: 0 1px 2px #0001;
    }
    button:focus-visible { outline: 2px solid var(--cal-blue); outline-offset: 1px; }
    :host-context(.ios-layout) nav { background: var(--section-fill, var(--cal-panel-2)); }
    :host-context(.ios-layout) button { font-size: var(--section-mobile-size, 16px); }
  `,
})
export class CalendarSectionPickerComponent<T extends string> {
  readonly label = input.required<string>();
  readonly columns = input(3);
  readonly options = input.required<readonly {value: T; label: string}[]>();
  readonly value = input.required<T>();
  readonly valueChange = output<T>();
}
