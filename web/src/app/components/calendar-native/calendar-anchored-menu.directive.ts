import {AfterViewInit, Directive, ElementRef, HostListener, OnDestroy, inject, input, output} from '@angular/core';

type CalendarMenuAnchor = HTMLElement | {x: number; y: number};

/** The browser's top layer keeps menus above sheets and out of scrolling containers. */
@Directive({selector: '[ccAnchoredMenu]', standalone: true, host: {class: 'cc-anchored-menu', style: 'position: fixed; inset: auto; margin: 0'}})
export class CalendarAnchoredMenuDirective implements AfterViewInit, OnDestroy {
  readonly anchor = input.required<CalendarMenuAnchor>({alias: 'ccAnchoredMenu'});
  readonly above = input(false);
  readonly dismissMenu = output<void>();
  private readonly menu = inject<ElementRef<HTMLDialogElement>>(ElementRef).nativeElement;
  private observer?: ResizeObserver;
  private pressedBackdrop = false;
  private previousFocus: HTMLElement | null = null;

  ngAfterViewInit() {
    if (typeof window === 'undefined') return;
    this.previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    this.menu.showModal();
    this.position();
    this.observer = new ResizeObserver(this.position);
    this.observer.observe(this.menu);
    window.visualViewport?.addEventListener('resize', this.position);
    const initial = this.menu.querySelector<HTMLElement>('[aria-checked="true"]')
      ?? this.menu.querySelector<HTMLElement>('[role^="menuitem"]');
    initial?.focus({preventScroll: true});
  }

  private position = () => {
    const anchor = this.anchor();
    const isControl = anchor instanceof HTMLElement;
    const rect = isControl ? anchor.getBoundingClientRect()
      : {top: anchor.y, bottom: anchor.y, left: anchor.x, right: anchor.x};
    const {top, bottom} = rect;
    const rtl = getComputedStyle(this.menu).direction === 'rtl';
    const viewport = window.visualViewport;
    const leftEdge = (viewport?.offsetLeft ?? 0) + 8;
    const topEdge = (viewport?.offsetTop ?? 0) + 8;
    const rightEdge = leftEdge + (viewport?.width ?? window.innerWidth) - 16;
    const bottomEdge = topEdge + (viewport?.height ?? window.innerHeight) - 16;
    const {width, height} = this.menu.getBoundingClientRect();
    const above = top - height - 8;
    const below = bottom + 6;
    const useAbove = this.above() ? above >= topEdge || below + height > bottomEdge : below + height > bottomEdge;
    const left = isControl ? (rtl ? rect.left : rect.right - width)
      : this.above() ? rect.left - width / 2 : (rtl ? rect.left - width : rect.left);
    this.menu.style.left = Math.max(leftEdge, Math.min(left, rightEdge - width)) + 'px';
    this.menu.style.top = Math.max(topEdge, Math.min(useAbove ? above : below, bottomEdge - height)) + 'px';
  };

  @HostListener('cancel', ['$event'])
  cancel(event: Event) {
    event.preventDefault();
    this.dismissMenu.emit();
  }

  private onBackdrop(event: MouseEvent) {
    if (event.target !== this.menu) return false;
    const box = this.menu.getBoundingClientRect();
    return event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
  }

  @HostListener('pointerdown', ['$event'])
  pointerDown(event: PointerEvent) { this.pressedBackdrop = this.onBackdrop(event); }

  @HostListener('click', ['$event'])
  outside(event: MouseEvent) {
    if (this.pressedBackdrop && this.onBackdrop(event)) this.dismissMenu.emit();
    this.pressedBackdrop = false;
  }

  @HostListener('keydown', ['$event'])
  keyDown(event: KeyboardEvent) {
    if (event.defaultPrevented) return;
    if (event.key === 'Escape' || event.key === 'Tab') {
      event.stopPropagation();
      if (event.key === 'Escape') event.preventDefault();
      this.dismissMenu.emit();
      this.previousFocus?.focus({preventScroll: true});
      return;
    }
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const items = [...this.menu.querySelectorAll<HTMLElement>('[role^="menuitem"]')].filter(el => el.getClientRects().length);
    if (!items.length) return;
    event.preventDefault();
    const index = items.indexOf(document.activeElement as HTMLElement);
    const previous = event.key === 'ArrowUp' || event.key === 'ArrowLeft';
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (index + (previous ? -1 : 1) + items.length) % items.length;
    items[next].focus();
  }

  ngOnDestroy() {
    if (this.menu.open) this.menu.close();
    this.observer?.disconnect();
    if (typeof window !== 'undefined') window.visualViewport?.removeEventListener('resize', this.position);
  }
}
