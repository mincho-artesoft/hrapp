import { AfterViewChecked, ChangeDetectionStrategy, Component, ElementRef, input, output, viewChild } from '@angular/core';

export interface RepeatOption { value: number; label: string; }

@Component({
  selector: 'cc-repeat-wheel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div #list class="wheel" role="listbox" tabindex="0" [attr.aria-label]="label()"
      [attr.aria-activedescendant]="id() + '-' + selected()"
      (scroll)="onScroll(list)" (keydown)="onKey($event, list)">
      @for (option of options(); track option.value) {
        <button type="button" role="option" tabindex="-1" [id]="id() + '-' + option.value"
          [attr.aria-selected]="option.value === selected()" (click)="choose($index, list)">{{option.label}}</button>
      }
    </div>`,
  styles: [`
    :host { display: block; flex: 1; min-width: 0; }
    .wheel { height: 216px; box-sizing: border-box; overflow-y: auto; padding: 90px 0;
      overscroll-behavior: contain; scroll-snap-type: y mandatory; scrollbar-width: none;
      mask-image: linear-gradient(transparent, black 30%, black 70%, transparent); }
    .wheel::-webkit-scrollbar { display: none; }
    button { display: block; width: 100%; height: 36px; padding: 0 3px; border: 0; background: transparent;
      font: 22px var(--font-body); color: var(--cal-muted); cursor: pointer; scroll-snap-align: center; }
    button[aria-selected=true] { color: var(--cal-text); }
    .wheel:focus-visible { outline: 2px solid var(--cal-blue); outline-offset: -2px; }
  `],
})
export class CalendarRepeatWheelComponent implements AfterViewChecked {
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly options = input.required<RepeatOption[]>();
  readonly selected = input.required<number>();
  readonly selectedChange = output<number>();
  private readonly list = viewChild.required<ElementRef<HTMLElement>>('list');
  private previous?: number;
  private readonly rowHeight = 36;

  ngAfterViewChecked() {
    const value = this.selected();
    if (this.previous === value) return;
    this.previous = value;
    const index = this.options().findIndex(option => option.value === value);
    const list = this.list().nativeElement;
    if (index >= 0 && Math.round(list.scrollTop / this.rowHeight) !== index)
      list.scrollTop = index * this.rowHeight;
  }

  onScroll(list: HTMLElement) {
    const option = this.options()[Math.round(list.scrollTop / this.rowHeight)];
    if (option && option.value !== this.selected()) this.selectedChange.emit(option.value);
  }

  choose(index: number, list: HTMLElement) {
    const option = this.options()[index];
    if (!option) return;
    list.scrollTop = index * this.rowHeight;
    if (option.value !== this.selected()) this.selectedChange.emit(option.value);
  }

  onKey(event: KeyboardEvent, list: HTMLElement) {
    const index = this.options().findIndex(option => option.value === this.selected());
    const last = this.options().length - 1;
    const positions: Record<string, number> = { ArrowDown: index + 1, ArrowUp: index - 1,
      PageDown: index + 5, PageUp: index - 5, Home: 0, End: last };
    if (!(event.key in positions)) return;
    event.preventDefault();
    this.choose(Math.max(0, Math.min(last, positions[event.key])), list);
  }
}
