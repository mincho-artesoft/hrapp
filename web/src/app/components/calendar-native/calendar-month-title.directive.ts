import { Directive, ElementRef, afterRenderEffect, inject, input } from "@angular/core";

/** The native month capsule shrinks its single line to 45% before truncating it. */
@Directive({ selector: "[ccMonthTitle]", standalone: true })
export class CalendarMonthTitleDirective {
  readonly title = input.required<string>({ alias: "ccMonthTitle" });
  readonly locked = input(false);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    afterRenderEffect(onCleanup => {
      if (!this.title()) return;
      const locked = this.locked();
      const label = this.element.nativeElement;
      const pill = label.parentElement;
      const column = pill?.parentElement;
      if (!column || !pill) return;

      const style = getComputedStyle(pill);
      const fullSize = parseFloat(style.fontSize);
      const range = document.createRange();
      range.selectNodeContents(label);
      label.style.fontSize = fullSize + "px";
      const fullWidth = range.getBoundingClientRect().width;
      const fit = () => {
        const iconWidth = locked ? (pill.querySelector("cc-symbol")?.getBoundingClientRect().width ?? 0) + parseFloat(style.columnGap) : 0;
        const available = column.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - iconWidth;
        const minimum = fullSize * 0.45;
        const size = Math.max(minimum, Math.min(fullSize, fullSize * available / (fullWidth || 1)));
        label.style.fontSize = size + "px";
        // System fonts can change their glyph proportions at smaller point sizes.
        if (size > minimum && size < fullSize) {
          const width = range.getBoundingClientRect().width;
          if (width > available) label.style.fontSize = Math.max(minimum, size * (available - .5) / width) + "px";
        }
      };
      fit();
      const observer = new ResizeObserver(fit);
      observer.observe(column);
      onCleanup(() => observer.disconnect());
    });
  }
}
