import { calendarHourCycle } from '../../core/calendar-format-preferences';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NgStyle } from '@angular/common';
import type { WebCalendarEvent } from '../../core/calendar-platform-api.service';
import { CalendarLocalization } from '../../core/calendar-localization';
import { nativeTimelineLayout } from '../../core/calendar-timeline-layout';
import { computeIosEventStyle } from '../../core/ios-event-palette';
import { wallDate } from '../../core/calendar-recurrence';
import { CalendarSymbolComponent } from './calendar-symbol.component';

const hour = 3_600_000;
const hourHeight = 40;

@Component({
  selector: 'cc-detail-timeline',
  standalone: true,
  imports: [NgStyle, CalendarSymbolComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="preview" [style.height.px]="hours() * hourHeight" aria-label="Event timeline">
      @for (hour of labels(); track $index) {
        <div class="hour" [style.top.px]="hour.top"><span>{{hour.text}}</span><i></i></div>
      }
      <div class="events">
        @for (block of blocks(); track block.id) {
          <div class="event" [class.selected]="block.id === selected().id"
               [ngStyle]="style(block.data, block.depth)" [style.left.%]="block.leftPct" [style.width.%]="block.widthPct"
               [style.top.px]="Math.max(0, block.startMinutes) * hourHeight / 60"
               [style.height.px]="Math.max(16, (Math.min(hours() * 60, block.endMinutes) - Math.max(0, block.startMinutes)) * hourHeight / 60 - 2)"
               [style.z-index]="block.depth * 2 + (block.id === selected().id ? 1 : 0)">
            <div class="content" [style.max-height.px]="Math.max(0, (block.contentEndMinutes - Math.max(0, block.startMinutes)) * hourHeight / 60 - 2)">
              @if (block.startMinutes >= 0 || block.id === selected().id) {
                <strong [class.cancelled]="block.data.status === 'cancelled'">@if (block.data.readOnly) {<cc-symbol name="lock.fill" /> }{{block.data.title}} @if (block.data.details?.recurrenceRules?.length) {<cc-symbol name="repeat" />}</strong>
                @if (block.data.location) {
                  <span><cc-symbol name="location" /> {{block.data.location}}</span>
                }
                @if (!block.data.allDay) {
                  <span><cc-symbol name="clock" /> {{clock(block.data.start)}} – {{clock(block.data.end)}}</span>
                }
              }
            </div>
          </div>
        }
      </div>
    </div>`,
  styles: [`
    :host {display:block; padding:16px 0}
    .preview {position:relative; overflow:hidden}
    .hour {position:absolute; inset-inline:0; display:flex; gap:8px; height:40px}
    .hour > span {width:58px; text-align:end; white-space:nowrap; font-size:11px; color:var(--cal-muted); transform:translateY(-7px); flex-shrink:0}
    .hour i {flex:1; border-top:.5px solid var(--cal-line)}
    .events {position:absolute; inset:0 26px 0 70px}
    .event {position:absolute; overflow:hidden; border-radius:5px; padding-block:3px; padding-inline:12px 8px;
      background:var(--event-bg); color:var(--event-text); font-size:10px; text-align:start}
    .event:before {content:''; position:absolute; inset-inline-start:5px; top:5px; bottom:5px; width:3px;
      border-radius:99px; background:var(--event-accent)}
    .selected {padding-inline-start:8px}
    .selected:before {display:none}
    .content {overflow:hidden; line-height:1.2}
    .content strong, .content span {display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:2; overflow:hidden}
    strong.cancelled {text-decoration:line-through}
    strong {font-weight:600; color:var(--event-title)}
    cc-symbol {width:9px; height:9px; vertical-align:baseline}
  `],
})
export class CalendarDetailTimelineComponent {
  readonly selected = input.required<WebCalendarEvent>();
  readonly events = input<WebCalendarEvent[]>([]);
  readonly dark = input(true);
  readonly timeZone = input.required<string>();
  readonly timeFormat = input('system');
  private readonly localization = inject(CalendarLocalization);
  readonly Math = Math;
  readonly hourHeight = hourHeight;

  readonly hours = computed(() => {
    const event = this.selected();
    return !event.allDay && Date.parse(event.end) - Date.parse(event.start) < hour ? 3 : 4;
  });
  readonly origin = computed(() => {
    const start = Date.parse(this.selected().start);
    if (this.selected().allDay) return start;
    const anchor = new Date(start + hour / 2);
    const local = wallDate(anchor, this.timeZone());
    return anchor.getTime() - (local.getUTCMinutes() * 60 + local.getUTCSeconds()) * 1000
      - anchor.getMilliseconds() - 1.5 * hour;
  });
  readonly labels = computed(() => {
    const origin = this.origin();
    const first = origin - wallDate(new Date(origin), this.timeZone()).getUTCMinutes() * 60_000;
    return Array.from({length: this.hours() + 1}, (_, i) => {
      const tick = first + i * hour;
      return {text: this.clock(tick), top: (tick - origin) / hour * hourHeight};
    });
  });
  readonly blocks = computed(() => {
    const selected = this.selected();
    const unique = new Map([...this.events(), selected]
      .filter(event => !event.allDay || event.id === selected.id).map(event => [event.id, event]));
    return nativeTimelineLayout(Array.from(unique.values(), data => ({
      id: data.id, data,
      startMinutes: data.allDay ? 7.5 : (Date.parse(data.start) - this.origin()) / 60_000,
      endMinutes: data.allDay ? 58.5 : (Date.parse(data.end) - this.origin()) / 60_000,
    })), {start: 0, end: this.hours() * 60, minimumDuration: 27, minimumHeaderDuration: 27});
  });
  private readonly formatter = computed(() => new Intl.DateTimeFormat(this.localization.formattingLocale(), {
    timeZone: this.timeZone(), hour: 'numeric', minute: '2-digit',
    hourCycle: calendarHourCycle(this.timeFormat()),
  }));
  clock(value: string | number) { return this.formatter().format(new Date(value)); }
  style(event: WebCalendarEvent, depth: number) {
    const color = event.color || '#0A84FF';
    const style = computeIosEventStyle(color, this.dark() ? 'dark' : 'light', depth);
    const selected = event.id === this.selected().id;
    return {
      '--event-bg': selected ? style.selectedFill : style.fill,
      '--event-text': selected ? 'white' : style.detailColor,
      '--event-title': selected ? 'white' : style.titleColor,
      '--event-accent': color,
    };
  }
}
