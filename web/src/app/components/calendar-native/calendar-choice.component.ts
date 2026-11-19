import { CalendarAnchoredMenuDirective } from './calendar-anchored-menu.directive';
import { CalendarNativeTextPipe } from "../../core/calendar-localization";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
  ElementRef,
  inject,
} from "@angular/core";
import { CalendarSymbolComponent } from "./calendar-symbol.component";
export interface CalendarChoice {
  value: string;
  label: string;
  symbol?: string;
}

@Component({
  selector: "cc-choice",
  standalone: true,
  imports: [CalendarAnchoredMenuDirective,CalendarSymbolComponent, CalendarNativeTextPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<button
      type="button"
      #trigger class="choice-value" [class.symbol-choice]="!!triggerSymbol()"
      [attr.aria-label]="label()"
      [disabled]="disabled()"
      aria-haspopup="menu"
      [attr.aria-expanded]="open()"
      (click)="toggle(); $event.stopPropagation()"
      (keydown)="onTriggerKey($event)"
    >
      @if(triggerSymbol()){<cc-symbol class="trigger-icon" [name]="triggerSymbol()!" /><cc-symbol name="chevron.down" />}
      @else { {{ selectedLabel() | nativeText }}<cc-symbol name="chevron.up.chevron.down" /> }
    </button>
    @if (open()) {
      <dialog
        class="choice-menu"
        role="menu"
        [ccAnchoredMenu]="trigger" (dismissMenu)="close()"
        (click)="$event.stopPropagation()"
      >
        @for (option of options(); track option.value) {
          <button
            type="button"
            role="menuitemradio"
            [attr.aria-checked]="value() === option.value"
            (click)="choose(option.value)"
          >
            <cc-symbol
              name="checkmark"
              [style.visibility]="
                value() === option.value ? 'visible' : 'hidden'
              "
            />
            @if (option.symbol) {
              <cc-symbol [name]="option.symbol" />
            }
            <span>{{ option.label | nativeText }}</span>
          </button>
        }
      </dialog>
    }`,
  styles: [
    `
      :host {
        position: relative;
        display: inline-block;
        max-width: 100%;
      }
      .choice-value {
        color: var(--choice-tint, var(--cal-blue, #2168de));
        display: flex;
        align-items: center;
        gap: 7px;
        border: 0;
        background: none;
        font: inherit;
        cursor: pointer;
        padding: 8px 0;
      }
      .choice-value.symbol-choice { background: #1c1c1e; color:white; border-radius:15px; padding:6px; gap:4px; }
      .choice-value.symbol-choice .trigger-icon {width:20px; height:18px;}
      .choice-value:disabled {color:var(--cal-muted);cursor:default;}
      .choice-value:disabled cc-symbol {display:none;}
      .choice-value cc-symbol {
        width: 12px;
        height: 18px;
      }
      .choice-menu {
        position: fixed;
        z-index: 1490;
        width: 260px;
        min-width: 220px;
        max-height: min(400px, 60vh);
        overflow-y: auto;
        max-width: min(360px, 80vw);
        padding: 8px;
        border-radius: 18px;
        border: 1px solid var(--cal-line, #38383a);
        background: var(--cal-panel, #1c1c1e);
        box-shadow: 0 8px 28px #0004;
        backdrop-filter: blur(24px);
      }
      .choice-menu button {
        width: 100%;
        min-height: 44px;
        padding: 10px;
        border: 0;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 12px;
        text-align: left;
        font: inherit;
        color: var(--cal-text);
        background: transparent;
        cursor: pointer;
      }
      .choice-menu button:focus-visible {
        background: var(--cal-panel-2, #2c2c2e);
      }
      .choice-menu cc-symbol {
        width: 17px;
        height: 20px;
      }
      button:focus-visible {
        outline: 2px solid var(--cal-blue, #2168de);
        outline-offset: 2px;
      }
    `,
  ],
})
export class CalendarChoiceComponent {
  readonly triggerSymbol = input<string>();
  readonly options = input.required<CalendarChoice[]>();
  readonly value = input.required<string>();
  readonly label = input("Choose");
  readonly disabled = input(false);
  readonly valueChange = output<string>();
  readonly open = signal(false);
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);
  toggle() {
    if (this.disabled() || typeof window === "undefined") return;
    if (this.open()) {
      this.close();
      return;
    }
    this.open.set(true);
  }
  onTriggerKey(event: KeyboardEvent) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!this.open()) this.toggle();
    }
  }
  choose(value: string) {
    this.valueChange.emit(value);
    this.escape();
  }
  selectedLabel() {
    return (
      this.options().find((o) => o.value === this.value())?.label ??
      this.value()
    );
  }
  close() {
    this.open.set(false);
  }
  private escape() {
    if (this.open()) {
      this.open.set(false);
      this.host.nativeElement
        .querySelector<HTMLButtonElement>(".choice-value")
        ?.focus();
    }
  }
}
