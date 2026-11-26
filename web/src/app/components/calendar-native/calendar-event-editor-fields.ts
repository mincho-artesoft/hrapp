import { CalendarActionSheetComponent } from './calendar-action-sheet.component';
import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarNativeTextPipe } from '../../core/calendar-localization';
import { CalendarChoiceComponent } from './calendar-choice.component';
import { CalendarDateTimeComponent } from './calendar-date-time.component';
import { CalendarSymbolComponent } from './calendar-symbol.component';

@Component({
  selector: 'cc-event-title-location', standalone: true,
  imports: [FormsModule, CalendarNativeTextPipe, CalendarSymbolComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {class: 'native-form-group'},
  styleUrl: './calendar-event-editor-fields.scss',
  template: `
    <label class="native-form-row">
      <input [attr.aria-label]="'Title' | nativeText" [placeholder]="'Title' | nativeText"
        [attr.maxlength]="maxLength()" [ngModel]="title()" (ngModelChange)="title.set($event)" />
    </label>
    <div class="native-form-row location-row-wrap">
      <button type="button" class="location-row" (click)="editLocation.emit()">
        <span [class.placeholder]="!location()">{{ location() || ((allowsVideo() ? 'Location or Video Call' : 'Location') | nativeText) }}</span>
      </button>
      @if (location()) {
        <button type="button" class="clear-location" [attr.aria-label]="'Clear' | nativeText" (click)="clearLocation.emit()">
          <cc-symbol name="xmark.circle.fill" />
        </button>
      }
    </div>`,
})
export class CalendarEventTitleLocationComponent {
  readonly title = model.required<string>();
  readonly location = input.required<string>();
  readonly allowsVideo = input(false);
  readonly maxLength = input<number|null>(null);
  readonly editLocation = output<void>();
  readonly clearLocation = output<void>();
}

export const eventRepeatChoices = [
  {value: 'none', label: 'Never'}, {value: 'daily', label: 'Every Day'},
  {value: 'weekly', label: 'Every Week'}, {value: 'monthly', label: 'Every Month'},
  {value: 'yearly', label: 'Every Year'}, {value: 'fortnightly', label: 'Every 2 Weeks'},
  {value: 'custom', label: 'Custom…'},
];

@Component({
  selector: 'cc-event-repeat-fields', standalone: true,
  imports: [CalendarChoiceComponent, CalendarDateTimeComponent, CalendarNativeTextPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {class: 'native-form-group'},
  styleUrl: './calendar-event-editor-fields.scss',
  template: `
    <div class="native-form-row">
      <span>{{ 'Repeat' | nativeText }}</span>
      <cc-choice label="Repeat" [value]="choice()" [options]="repeatChoices" (valueChange)="repeatChange.emit($event)" />
    </div>
    @if (choice() !== 'none') {
      <div class="native-form-row">
        <span>{{ 'End Repeat' | nativeText }}</span>
        <cc-choice label="End Repeat" [value]="endChoice()" [options]="endChoices" (valueChange)="endChange.emit($event)" />
      </div>
      @if (endChoice() === 'date') {
        <cc-date-time label="End Date" [firstWeekday]="firstWeekday()" [(focus)]="focus"
          [date]="until() || start()" [minimum]="start()" [showsTime]="false" (dateChange)="untilChange.emit($event)" />
      }
    }`,
})
export class CalendarEventRepeatFieldsComponent {
  readonly choice = input.required<string>();
  readonly endChoice = input.required<string>();
  readonly start = input.required<string>();
  readonly until = input('');
  readonly firstWeekday = input(0);
  readonly focus = model<string|null>(null);
  readonly repeatChoices = eventRepeatChoices;
  readonly endChoices = [{value: 'never', label: 'Never'}, {value: 'date', label: 'On Date'}];
  readonly repeatChange = output<string>();
  readonly endChange = output<string>();
  readonly untilChange = output<string>();
}

@Component({
  selector: 'cc-event-removal', standalone: true, imports: [CalendarNativeTextPipe, CalendarActionSheetComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button #trigger type="button" class="native-pill danger full" [disabled]="busy()" (click)="confirming.set(true)">{{ label() | nativeText }}</button>
    @if (confirming()) {
      <cc-calendar-action-sheet [anchor]="trigger" [heading]="prompt()" [primaryLabel]="confirmLabel() || label()" [destructive]="true" [busy]="busy()"
        (primary)="confirmed.emit(); confirming.set(false)" (dismissed)="confirming.set(false)" />
    }`,
  styles: `
    :host { display: block; }
    .native-pill { display: inline-flex; align-items: center; justify-content: center; border: 0; border-radius: 24px;
      min-height: 40px; padding: 8px 16px; font: inherit; font-size: 17px; color: var(--cal-blue); background: #2168de22; cursor: pointer; }
    .native-pill.danger { color: #ff453a; background: #ff3b3017; }
    .native-pill.full { width: 100%; margin: 8px 0; }
    .native-pill:disabled { opacity: .45; cursor: default; }
  `,
})
export class CalendarEventRemovalComponent {
  readonly label = input.required<string>();
  readonly prompt = input.required<string>();
  readonly busy = input(false);
  readonly confirming = model(false);
  readonly confirmed = output<void>();
  readonly confirmLabel = input('');
}
