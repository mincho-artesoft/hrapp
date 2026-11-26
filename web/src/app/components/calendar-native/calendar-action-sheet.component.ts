import { afterNextRender, ChangeDetectionStrategy, Component, ElementRef, input, OnDestroy, output, viewChild } from '@angular/core';
import { CalendarNativeTextPipe } from '../../core/calendar-localization';

@Component({
  selector: 'cc-calendar-action-sheet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CalendarNativeTextPipe],
  styleUrl: './calendar-action-sheet.component.scss',
  template: `
    <dialog #sheet class="action-sheet" [attr.aria-label]="heading() | nativeText"
      [attr.aria-describedby]="message() ? descriptionId : null"
      (cancel)="cancel($event)" (keydown.escape)="$event.stopPropagation()"
      (click)="$event.target === sheet && dismiss()">
      <div class="action-sheet__body">
        <header [class.title-only]="!message()">
          <h2 tabindex="-1" autofocus>{{ heading() | nativeText }}</h2>
          @if (message()) { <p [id]="descriptionId">{{ message() | nativeText }}</p> }
        </header>
        <button type="button" [class.destructive]="destructive()" [disabled]="busy()" (click)="primary.emit()">{{ primaryLabel() | nativeText }}</button>
        @if (secondaryLabel()) {
          <button type="button" [disabled]="busy()" (click)="secondary.emit()">{{ secondaryLabel() | nativeText }}</button>
        }
        <button type="button" class="action-sheet__cancel" [disabled]="busy()" (click)="dismiss()">{{ cancelLabel() | nativeText }}</button>
      </div>
    </dialog>`,
})
export class CalendarActionSheetComponent implements OnDestroy {
  readonly heading = input.required<string>();
  readonly message = input('');
  readonly primaryLabel = input.required<string>();
  readonly secondaryLabel = input('');
  readonly cancelLabel = input('Cancel');
  readonly destructive = input(false);
  readonly busy = input(false);
  readonly anchor = input<HTMLElement>();
  readonly primary = output<void>();
  readonly secondary = output<void>();
  readonly dismissed = output<void>();
  private static nextId = 0;
  protected readonly descriptionId = 'calendar-action-description-' + CalendarActionSheetComponent.nextId++;
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('sheet');
  private observer?: ResizeObserver;

  constructor() {
    afterNextRender(() => {
      const sheet = this.dialog().nativeElement;
      sheet.showModal();
      const anchor = this.anchor();
      if (!anchor) return;
      this.place();
      this.observer = new ResizeObserver(this.place);
      this.observer.observe(sheet);
      this.observer.observe(anchor);
      window.addEventListener('resize', this.place);
      window.addEventListener('scroll', this.place, true);
      window.visualViewport?.addEventListener('resize', this.place);
    });
  }

  private readonly place = () => {
    const sheet = this.dialog().nativeElement, anchor = this.anchor();
    if (!anchor?.isConnected) return;
    const rect = anchor.getBoundingClientRect(), box = sheet.getBoundingClientRect();
    const viewport = window.visualViewport;
    const left = (viewport?.offsetLeft ?? 0) + 8, top = (viewport?.offsetTop ?? 0) + 8;
    const right = left + (viewport?.width ?? innerWidth) - 16, bottom = top + (viewport?.height ?? innerHeight) - 16;
    if (rect.bottom < top || rect.top > bottom || rect.right < left || rect.left > right) {
      sheet.removeAttribute('data-side');
      return;
    }
    const middle = (rect.left + rect.right) / 2;
    const x = Math.max(left, Math.min(middle - box.width / 2, right - box.width));
    const above = rect.top - top >= box.height + 12 || (bottom - rect.bottom < box.height + 12 && rect.top - top > bottom - rect.bottom);
    const y = above ? rect.top - box.height - 12 : rect.bottom + 12;
    sheet.style.setProperty('--sheet-x', x + 'px');
    sheet.style.setProperty('--sheet-y', Math.max(top, Math.min(y, bottom - box.height)) + 'px');
    sheet.style.setProperty('--tip-x', Math.max(28, Math.min(middle - x, box.width - 28)) + 'px');
    sheet.dataset['side'] = above ? 'above' : 'below';
  };

  protected cancel(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.dismiss();
  }
  protected dismiss() {
    if (this.busy()) return;
    this.dialog().nativeElement.close();
    this.anchor()?.focus({preventScroll: true});
    this.dismissed.emit();
  }
  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
      window.removeEventListener('resize', this.place);
      window.removeEventListener('scroll', this.place, true);
      window.visualViewport?.removeEventListener('resize', this.place);
    }
    const dialog = this.dialog().nativeElement;
    if (dialog.open) dialog.close();
  }
}
