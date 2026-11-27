import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, input, model, output, signal } from '@angular/core';
import { CalendarLocalization, CalendarNativeTextPipe } from '../../core/calendar-localization';
import { CalendarDateGridComponent } from './calendar-date-grid.component';

@Component({
  selector:'cc-range-picker', imports:[CalendarDateGridComponent,CalendarNativeTextPipe],
  changeDetection:ChangeDetectionStrategy.OnPush,
  template:`
    <button type="button" class="range-pill" [attr.aria-label]="'Choose date range' | nativeText" [attr.aria-expanded]="open()"
      (click)="toggle($event)">{{short(start())}} - {{short(end())}}</button>
    @if(open()) {
      <div class="range-popover" [style.left.px]="offset()" (click)="$event.stopPropagation()">
        <cc-date-grid [range]="true" [start]="start()" [end]="end()" [firstWeekday]="firstWeekday()" (chooseRange)="chooseRange.emit($event)" />
      </div>
    }`,
  styles:`
    :host {display:inline-block;position:relative;min-width:0;max-width:100%}
    .range-pill {width:var(--range-width,auto);min-height:var(--range-height,0);border:0;background:color-mix(in srgb,var(--cal-muted) 9%,transparent);color:var(--cal-text);border-radius:8px;
      padding:7px 16px;font:inherit;font-size:17px;font-weight:600;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer}
    .range-popover {position:absolute;top:calc(100% + 6px);z-index:80;width:min(350px,calc(100vw - 32px));
      background:var(--cal-bg);border-radius:12px;box-shadow:0 3px 14px #0004;overflow:auto;max-height:min(360px,65dvh)}
  `
})
export class CalendarRangePickerComponent {
  readonly start=input.required<string>(); readonly end=input.required<string>(); readonly firstWeekday=input(0);
  readonly open=model(false); readonly chooseRange=output<{start:string;end:string}>();
  readonly offset=signal(0);
  private readonly element=inject(ElementRef<HTMLElement>);
  private readonly locale=inject(CalendarLocalization);
  short(day:string) {return this.locale.shortDate()(new Date(day+'T12:00:00'));}
  toggle(event:MouseEvent) {
    event.stopPropagation();
    const el=this.element.nativeElement, rect=el.getBoundingClientRect(), width=Math.min(350,window.innerWidth-32);
    const anchor=getComputedStyle(el).direction==='rtl'?rect.right-width:rect.left;
    this.offset.set(Math.max(8,Math.min(window.innerWidth-width-8,anchor))-rect.left);
    this.open.update(open=>!open);
  }
  @HostListener('document:click',['$event']) outside(e:MouseEvent) {
    if(this.open()&&!this.element.nativeElement.contains(e.target as Node)) this.open.set(false);
  }
  @HostListener('document:keydown.escape',['$event']) escape(e:Event) {
    if(this.open()) { e.preventDefault(); this.open.set(false); }
  }
}
