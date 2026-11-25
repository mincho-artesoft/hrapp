import {Component, input, output} from '@angular/core';
import {CalendarNativeTextPipe} from '../../core/calendar-localization';
import {CalendarSymbolComponent} from './calendar-symbol.component';

export const calendarColors = [
    { label: "Red", hex: "#FF453A" },
    { label: "Orange", hex: "#FF9F0A" },
    { label: "Yellow", hex: "#FFD60A" },
    { label: "Green", hex: "#30D158" },
    { label: "Blue", hex: "#0A84FF" },
    { label: "Purple", hex: "#BF5AF2" },
    { label: "Brown", hex: "#996633" },
  ];

export function calendarColorName(hex: string) {
  return calendarColors.find(color => color.hex === hex.toUpperCase())?.label ?? 'Custom';
}

@Component({
  selector: 'cc-calendar-color-options',
  standalone: true,
  imports: [CalendarNativeTextPipe, CalendarSymbolComponent],
  template: `
    @for (color of colors; track color.hex) {
      <button type="button" [attr.aria-pressed]="selected(color.hex)" (click)="picked.emit(color.hex)">
        <i [style.background]="color.hex"></i><span>{{color.label | nativeText}}</span>
        @if (selected(color.hex)) { <cc-symbol name="checkmark" /> }
      </button>
    }
    <label><i [style.background]="value()"></i><span>{{'Custom...' | nativeText}}</span>
      @if (!usesDefault() && colorName(value()) === 'Custom') { <cc-symbol name="checkmark" /> }
      <input type="color" [attr.aria-label]="'Custom...' | nativeText" [value]="value()" (input)="picked.emit(custom.value.toUpperCase())" #custom>
    </label>`,
  styles: [`
    :host {display:block;}
    button,label {box-sizing:border-box;display:flex;width:100%;min-height:50px;padding:8px 16px;align-items:center;gap:12px;
      background:transparent;color:var(--cal-text);border:0;font:inherit;text-align:start;cursor:pointer;}
    button + button,label {border-top:1px solid var(--cal-line);}
    span {flex:1;}
    i {width:20px;height:20px;flex:none;border-radius:50%;}
    cc-symbol {width:16px;color:var(--cal-blue);}
    label {position:relative;}
    input {position:absolute;inset:0;opacity:0;width:100%;height:100%;cursor:pointer;}
    label:focus-within {outline:2px solid var(--cal-blue);outline-offset:-2px;}
  `]
})
export class CalendarColorOptionsComponent {
  readonly value = input.required<string>();
  readonly usesDefault = input(false);
  readonly picked = output<string>();
  readonly colors = calendarColors;
  readonly colorName = calendarColorName;
  selected(hex: string) { return !this.usesDefault() && this.value().toUpperCase() === hex; }
}
