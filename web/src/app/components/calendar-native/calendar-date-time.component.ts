import { calendarHourCycle } from '../../core/calendar-format-preferences';
import {Component,ChangeDetectionStrategy,computed,input,model,output,ElementRef,inject,OnDestroy} from '@angular/core';
import {CalendarNativeTextPipe,CalendarNativeDatePipe,CalendarLocalization} from '../../core/calendar-localization';
import {CalendarDateGridComponent} from './calendar-date-grid.component';

/** Same inline calendar and time wheels used by CalendarDateTimePickerRow. */
@Component({selector:'cc-date-time',standalone:true,imports:[CalendarNativeTextPipe,CalendarNativeDatePipe,CalendarDateGridComponent],changeDetection:ChangeDetectionStrategy.OnPush,
 template:`<div class="date-row">
   <span>{{label()|nativeText}}</span>
   @if(showsDate()){
   <button type="button" [class.active]="expanded()==='date'" [attr.aria-expanded]="expanded()==='date'" (click)="toggle('date')">
     @if(otherDate()){<span aria-hidden="true" class="measure">{{otherDate()|nativeDate:'shortDate'}}</span>}
     <span>{{date()|nativeDate:'shortDate'}}</span>
   </button>
   }
   @if(showsTime()){
     <button type="button" [attr.aria-label]="showsDate() ? null : (label() | nativeText) + ' · ' + timeLabel(time())" [class.active]="expanded()==='time'" [attr.aria-expanded]="expanded()==='time'" (click)="toggle('time')">
       @if(otherTime()){<span aria-hidden="true" class="measure">{{timeLabel(otherTime())}}</span>}
       <span>{{timeLabel(time())}}</span>
     </button>
   }
 </div>
 @if(expanded()==='date'){
 <div class="date-calendar"><cc-date-grid [start]="date()" [minimum]="minimum()" [firstWeekday]="firstWeekday()" (choose)="dateChange.emit($event)" /></div>
 }
 @if(expanded()==='time'){
 <div class="time-wheels" role="group" [attr.aria-label]="label() | nativeText">
 @for(part of wheelParts();track part){
 <div class="wheel" role="listbox" tabindex="0" [attr.aria-label]="(part==='hour'?'Hour':part==='minute'?'Minute':'AM/PM') | nativeText" (scroll)="wheelScroll($event,part)" (keydown)="wheelKey($event,part)">
 @for(value of wheelValues(part);track value){<button type="button" role="option" tabindex="-1" [attr.aria-selected]="value===selectedValue(part)" [class.selected]="value===selectedValue(part)" (click)="chooseWheel($event,part,value)">{{wheelLabel(part,value)}}</button>}
 </div>}
 </div>
 }`,
 styles:[`:host{display:block;width:100%;}.date-row{display:flex;gap:6px;align-items:center;min-height:44px;font-size:17px;}.date-row>span{flex:1}.date-row>button{display:inline-grid;place-items:center;white-space:nowrap;background:var(--picker-fill,rgba(118,118,128,.24));color:var(--cal-text);border:0;border-radius:999px;min-height:34px;padding:6px 12px;font:inherit;cursor:pointer}.date-row>button>span{grid-area:1/1}.measure{visibility:hidden}.date-row>button.active{color:var(--cal-blue)}.date-calendar{padding:8px 0 16px;border-top:1px solid var(--cal-line)}.time-wheels{position:relative;isolation:isolate;max-width:420px;margin-inline:auto;height:180px;display:flex;align-items:center;justify-content:center;gap:12px;border-top:1px solid var(--cal-line);margin-bottom:12px}.time-wheels:before{content:"";pointer-events:none;position:absolute;inset-inline:0;top:50%;height:32px;transform:translateY(-50%);border-radius:999px;background:var(--picker-fill,rgba(118,118,128,.24));z-index:-1}.wheel{box-sizing:border-box;position:relative;height:160px;overflow:auto;scroll-snap-type:y mandatory;scrollbar-width:none;width:90px;padding:62px 0;overscroll-behavior:contain;}.wheel button{display:block;width:100%;height:36px;scroll-snap-align:center;color:var(--cal-muted);font:22px var(--font-body);background:none;border:0;cursor:pointer;border-radius:8px}.wheel button.selected{color:var(--cal-text)}@media(max-width:420px){.date-row{font-size:17px}.date-row>button{padding:7px;}.date-grid>button{width:32px;height:32px;}}`]
})
export class CalendarDateTimeComponent implements OnDestroy {
 private localization=inject(CalendarLocalization);
 private scrollTimers=new Map<string,ReturnType<typeof setTimeout>>();
 private openTimer?:ReturnType<typeof setTimeout>;
 otherDate = input('');
 otherTime = input('');
 timeFormat=input('system');
 twelveHour=computed(()=>calendarHourCycle(this.timeFormat()) === 'h12');
 wheelParts=computed(():Array<'hour'|'minute'|'period'>=>this.twelveHour()?['hour','minute','period']:['hour','minute']);
 private readonly twoDigits = computed(() => new Intl.NumberFormat(this.localization.formattingLocale(), {minimumIntegerDigits:2, useGrouping:false}));
 private readonly periods = computed(() => {
   const clock = new Intl.DateTimeFormat(this.localization.formattingLocale(), {hour:'numeric', hourCycle:'h12', timeZone:'UTC'});
   return [0,12].map(hour => clock.formatToParts(Date.UTC(2000,0,1,hour)).find(part => part.type==='dayPeriod')?.value);
 });
 wheelLabel(part:'hour'|'minute'|'period', value:string) {
   if (part==='period') return this.periods()[value==='PM'?1:0] ?? value;
   const format = part==='minute' || !this.twelveHour() ? this.twoDigits() : this.localization.integer();
   return format.format(Number(value));
 }
 wheelValues(part:'hour'|'minute'|'period'):string[]{return part==='period'?['AM','PM']:part==='minute'?this.minutes:this.twelveHour()?Array.from({length:12},(_,i)=>String(i+1)):this.hours;}
 selectedValue(part:'hour'|'minute'|'period'):string{const hour=Number(this.time().slice(0,2));return part==='minute'?this.time().slice(3,5):part==='period'?(hour<12?'AM':'PM'):this.twelveHour()?String(hour%12||12):this.time().slice(0,2);}
 private setWheel(part:'hour'|'minute'|'period',value:string){let hour=Number(this.time().slice(0,2));let minute=this.time().slice(3,5);if(part==='minute')minute=value;else if(part==='period')hour=hour%12+(value==='PM'?12:0);else hour=this.twelveHour()?Number(value)%12+(hour>=12?12:0):Number(value);const next=String(hour).padStart(2,'0')+':'+minute;if(next!==this.time())this.timeChange.emit(next);}
 wheelScroll(event:Event,part:'hour'|'minute'|'period'){const wheel=event.currentTarget as HTMLElement;clearTimeout(this.scrollTimers.get(part));this.scrollTimers.set(part,setTimeout(()=>{if(this.expanded()!=='time')return;const values=this.wheelValues(part);this.setWheel(part,values[Math.min(values.length-1,Math.max(0,Math.round(wheel.scrollTop/36)))]);},140));}
 chooseWheel(event:Event,part:'hour'|'minute'|'period',value:string){this.setWheel(part,value);const wheel=(event.currentTarget as HTMLElement).parentElement;wheel?.scrollTo({top:this.wheelValues(part).indexOf(value)*36,behavior:'smooth'});}
 wheelKey(event:KeyboardEvent,part:'hour'|'minute'|'period'){if(!['ArrowDown','ArrowUp','Home','End'].includes(event.key))return;event.preventDefault();const values=this.wheelValues(part),index=values.indexOf(this.selectedValue(part));const next=event.key==='Home'?0:event.key==='End'?values.length-1:Math.max(0,Math.min(values.length-1,index+(event.key==='ArrowDown'?1:-1)));this.setWheel(part,values[next]);(event.currentTarget as HTMLElement).scrollTo({top:next*36,behavior:'smooth'});}
 ngOnDestroy(){clearTimeout(this.openTimer);this.scrollTimers.forEach(clearTimeout);}

 private host:ElementRef<HTMLElement>=inject(ElementRef);
 label=input('Date');date=input.required<string>();time=input('09:00');showsDate=input(true);showsTime=input(true);minimum=input('');firstWeekday=input(0);
 dateChange=output<string>();timeChange=output<string>();
 focus = model<string | null>(null);
 fieldKey = input<string>();
 private focusKey = computed(() => this.fieldKey() ?? this.label());
 expanded = computed(() => {
   if (this.showsDate() && this.focus() === this.focusKey() + '-date') return 'date';
   if (this.showsTime() && this.focus() === this.focusKey() + '-time') return 'time';
   return null;
 });
 hours=Array.from({length:24},(_,i)=>(''+i).padStart(2,'0'));minutes=Array.from({length:60},(_,i)=>(''+i).padStart(2,'0'));
 timeLabel(time: string){return new Date('2000-01-01T'+time).toLocaleTimeString(this.localization.formattingLocale(),{hour:'numeric',minute:'2-digit',hourCycle:calendarHourCycle(this.timeFormat())});}
 toggle(kind:'date'|'time'){this.focus.set(this.expanded()===kind?null:this.focusKey()+'-'+kind);if(kind==='time'&&this.expanded()==='time')this.openTimer=setTimeout(()=>this.host.nativeElement.querySelectorAll<HTMLElement>('.wheel').forEach((wheel,i)=>{const part=this.wheelParts()[i];wheel.scrollTop=this.wheelValues(part).indexOf(this.selectedValue(part))*36;}));}
}
