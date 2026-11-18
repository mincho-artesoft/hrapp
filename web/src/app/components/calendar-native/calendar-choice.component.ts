import { CalendarNativeTextPipe } from "../../core/calendar-localization";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
  HostListener,
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
  imports: [CalendarSymbolComponent, CalendarNativeTextPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<button
      type="button"
      class="choice-value"
      [attr.aria-label]="label()"
      [disabled]="disabled()"
      aria-haspopup="menu"
      [attr.aria-expanded]="open()"
      (click)="toggle(); $event.stopPropagation()"
      (keydown)="onTriggerKey($event)"
    >
      {{ selectedLabel() | nativeText
      }}<cc-symbol name="chevron.up.chevron.down" />
    </button>
    @if (open()) {
      <div
        class="choice-menu"
        role="menu"
        [style.top.px]="position().top"
        [style.left.px]="position().left"
        (keydown)="onMenuKey($event)"
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
      </div>
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
      .choice-menu button:hover,
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
  readonly options = input.required<CalendarChoice[]>();
  readonly value = input.required<string>();
  readonly label = input("Choose");
  readonly disabled = input(false);
  readonly valueChange = output<string>();
  readonly open = signal(false);
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);
  readonly position = signal({ top: 0, left: 0 });
  toggle() {
    if (this.disabled() || typeof window === "undefined") return;
    if (this.open()) {
      this.close();
      return;
    }
    const rect = this.host.nativeElement.getBoundingClientRect();
    const height = Math.min(
      this.options().length * 44 + 16,
      400,
      window.innerHeight * 0.6,
    );
    this.position.set({
      left: Math.max(8, Math.min(rect.right - 260, window.innerWidth - 268)),
      top:
        rect.bottom + height + 8 < window.innerHeight
          ? rect.bottom + 4
          : Math.max(8, rect.top - height - 4),
    });
    this.open.set(true);
  }
  private focusOption(index: number) {
    setTimeout(() => {
      const buttons =
        this.host.nativeElement.querySelectorAll<HTMLButtonElement>(
          "[role=menuitemradio]",
        );
      buttons[(index + buttons.length) % buttons.length]?.focus();
    }, 0);
  }
  onTriggerKey(event: KeyboardEvent) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!this.open()) this.toggle();
      this.focusOption(
        Math.max(
          0,
          this.options().findIndex((o) => o.value === this.value()),
        ),
      );
    }
  }
  onMenuKey(event: KeyboardEvent) {
    const buttons = [
      ...this.host.nativeElement.querySelectorAll<HTMLButtonElement>(
        "[role=menuitemradio]",
      ),
    ];
    const current = buttons.indexOf(
      document.activeElement as HTMLButtonElement,
    );
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      this.focusOption(
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? buttons.length - 1
            : current + (event.key === "ArrowDown" ? 1 : -1),
      );
    }
    if (event.key === "Tab") this.close();
    if (event.key === "Escape") {
      event.stopPropagation();
      this.escape();
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
  @HostListener("document:click") close() {
    this.open.set(false);
  }
  @HostListener("document:keydown.escape") escape() {
    if (this.open()) {
      this.open.set(false);
      this.host.nativeElement
        .querySelector<HTMLButtonElement>(".choice-value")
        ?.focus();
    }
  }
}
