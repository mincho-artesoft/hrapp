import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";

// AppKit symbol image bounds at 17 pt. The export fits the longest side in
// 80 pixels on a 96-pixel canvas (tools/export-calendar-symbols.swift).
const nativeExtent: Record<string, number> = {
  plus: 18, magnifyingglass: 21, gearshape: 22, "calendar.day.timeline.leading": 26,
  "distribute.horizontal.left": 27, calendar: 21, "12.lane": 20, "list.bullet": 22,
  "align.vertical.top": 24, "cloud.sun": 26, xmark: 18, checkmark: 19,
  "chevron.left": 18, pencil: 18, "square.and.arrow.up": 24, trash: 22,
};

/** The app's exported symbols, not a second web icon set. */
@Component({
  selector: "cc-symbol",
  standalone: true,
  host: { "[style.width.px]": "canvasSize()", "[style.height.px]": "canvasSize()" },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@if(multicolor()){<img aria-hidden="true" [src]="'/icons/calendar-native/weather/'+name()+'.png'" alt=""/>}@else{<span
    aria-hidden="true"
    [style.mask-image]="'url(/icons/calendar-native/' + name() + '.png)'"
    [style.-webkit-mask-image]="
      'url(/icons/calendar-native/' + name() + '.png)'
    "
  ></span>}`,
  styles: [
    `
      :host {
        display: inline-flex;
        width: 1.35em;
        height: 1.35em;
        flex-shrink: 0;
        vertical-align: middle;
      }
      img {width:100%;height:100%;object-fit:contain;}
      span {
        width: 100%;
        height: 100%;
        background: currentColor;
        mask-size: contain;
        mask-repeat: no-repeat;
        mask-position: center;
      }
    `,
  ],
})
export class CalendarSymbolComponent {
  readonly name = input.required<string>();
  readonly pointSize = input<number>();
  readonly canvasSize = computed(() => {
    const points = this.pointSize();
    return points === undefined ? null : points * (nativeExtent[this.name()] ?? 17) / 17 * 96 / 80;
  });
  readonly multicolor = input(false);
}
