import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import extents from "./calendar-symbol-extents.json";

// [AppKit image extent at 17 pt, visible ink extent in the 96 px PNG].
// The exporter fits each AppKit image into 80 px before centering it.
const symbolExtents: Readonly<Record<string, readonly number[]>> = extents;

/** The app's exported symbols, not a second web icon set. */
@Component({
  selector: "cc-symbol",
  standalone: true,
  host: {
    "[class.directional]": "directional()",
    "[style.--symbol-default-size.em]": "canvasScale()",
    "[style.--symbol-canvas.px]": "canvasSize()",
  },
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
        width: var(--symbol-canvas, var(--symbol-default-size));
        height: var(--symbol-canvas, var(--symbol-default-size));
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        vertical-align: middle;
      }
      :host(.directional):dir(rtl) span { transform: scaleX(-1); }
      img {width:100%;height:100%;object-fit:contain;}
      span {
        width: var(--symbol-canvas, 100%);
        height: var(--symbol-canvas, 100%);
        flex: none;
        pointer-events: none;
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
  readonly directional = computed(() => ["chevron.forward", "chevron.backward"].includes(this.name()));
  readonly pointSize = input<number>();
  readonly fitSize = input<number>();
  readonly multicolor = input(false);
  readonly canvasScale = computed(() => {
    const extent = symbolExtents[this.name()]?.[0];
    return extent && !this.multicolor() ? extent / 17 * 96 / 80 : 1.35;
  });
  readonly canvasSize = computed(() => {
    const fit = this.fitSize();
    const ink = symbolExtents[this.name()]?.[1];
    if (fit !== undefined && ink && !this.multicolor()) return fit * 96 / ink;
    const points = this.pointSize();
    return points === undefined ? null : points * this.canvasScale();
  });
}
