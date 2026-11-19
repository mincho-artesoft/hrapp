import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  input,
  output,
  viewChild,
} from "@angular/core";
import { CalendarNativeTextPipe } from "../../core/calendar-localization";
import { CalendarSymbolComponent } from "./calendar-symbol.component";

@Component({
  selector: "cc-calendar-search",
  standalone: true,
  imports: [CalendarNativeTextPipe, CalendarSymbolComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<label>
    <input
      #field
      type="text"
      enterkeyhint="search"
      autocomplete="off"
      spellcheck="false"
      [value]="value()"
      [placeholder]="placeholder() | nativeText"
      [attr.aria-label]="placeholder() | nativeText"
      (input)="changed.emit(field.value)"
      (keydown.enter)="field.blur()"
      (keydown.escape)="$event.stopPropagation(); closed.emit()"
    />
    <button
      type="button"
      [attr.aria-label]="'Close search' | nativeText"
      (click)="closed.emit()"
    >
      <cc-symbol name="xmark" [pointSize]="13" />
    </button>
  </label>`,
  styles: [
    `
      :host {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        flex: none;
        height: 52px;
        width: 100%;
        padding-inline: 16px;
      }
      label {
        position: relative;
        display: flex;
        width: 100%;
        background: var(--search-fill, var(--cal-panel));
        border-radius: 10px;
      }
      input {
        box-sizing: border-box;
        width: 100%;
        height: 36px;
        border: 0;
        outline: 0;
        border-radius: inherit;
        padding: 8px 12px;
        padding-inline-end: 36px;
        font: 400 17px var(--font-body);
        color: var(--search-text, var(--cal-text));
        background: transparent;
      }
      input::placeholder,
      button {
        color: var(--search-muted, var(--cal-muted));
      }
      button {
        position: absolute;
        inset-inline-end: 2px;
        top: 50%;
        transform: translateY(-50%);
        width: 32px;
        height: 32px;
        padding: 0;
        background: transparent;
        border: 0;
        display: grid;
        place-items: center;
        cursor: pointer;
      }
    `,
  ],
})
export class CalendarSearchFieldComponent {
  readonly placeholder = input("Search events...");
  readonly value = input.required<string>();
  readonly changed = output<string>();
  readonly closed = output<void>();
  private readonly field =
    viewChild.required<ElementRef<HTMLInputElement>>("field");
  constructor() {
    afterNextRender(() =>
      this.field().nativeElement.focus({ preventScroll: true }),
    );
  }
}
