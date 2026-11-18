import {Component,ChangeDetectionStrategy,computed,input,model,output,signal,ElementRef,inject,OnDestroy} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CalendarNativeTextPipe,CalendarNativeDatePipe,CalendarLocalization} from '../../core/calendar-localization';
import {CalendarSymbolComponent} from './calendar-symbol.component';
import {CalendarChoiceComponent} from './calendar-choice.component';

/** Same inline calendar and time wheels used by CalendarDateTimePickerRow. */
@Component({selector:'cc-date-time',standalone:true,imports:[FormsModule,CalendarNativeTextPipe,CalendarNativeDatePipe,CalendarSymbolComponent,CalendarChoiceComponent],changeDetection:ChangeDetectionStrategy.OnPush,
 template:`<div class="date-row"><span>{{label()|nativeText}}</span><button [class.active]="expanded()==='date'" (click)="toggle('date')">{{date()|nativeDate:'shortDate'}}</button>@if(showsTime()){<button [class.active]="expanded()==='time'" (click)="toggle('time')">{{timeLabel()}}</button>}</div>
 @if(expanded()==='date'){
 <div class="date-calendar"><div class="month-heading"><cc-choice label="Month" [value]="''+month()" [options]="months()" (valueChange)="month.set(+$event)"/><cc-choice label="Year" [value]="''+year()" [options]="years" (valueChange)="year.set(+$event)"/><span></span><button aria-label="Previous month" (click)="step(-1)"><cc-symbol name="chevron.left"/></button><button aria-label="Next month" (click)="step(1)"><cc-symbol name="chevron.right"/></button></div><div class="date-grid">@for(day of weekdays();track $index){<small>{{day|nativeDate:'EEEEE'}}</small>}@for(day of days();track day.key){<button [disabled]="!!minimum()&&day.key<minimum()" [class.outside]="day.date.getMonth()!==month()" [class.selected]="day.key===date()" [class.today]="day.key===today" (click)="dateChange.emit(day.key)">{{day.date.getDate()}}</button>}</div></div>
 }
 @if(expanded()==='time'){
 <div class="time-wheels" role="group" [attr.aria-label]="label()+' time'">
 @for(part of wheelParts();track part){
 <div class="wheel" role="listbox" tabindex="0" [attr.aria-label]="part==='hour'?'Hour':part==='minute'?'Minute':'AM/PM'" (scroll)="wheelScroll($event,part)" (keydown)="wheelKey($event,part)">
 @for(value of wheelValues(part);track value){<button type="button" role="option" tabindex="-1" [attr.aria-selected]="value===selectedValue(part)" [class.selected]="value===selectedValue(part)" (click)="chooseWheel($event,part,value)">{{value}}</button>}
 </div>}
 </div>
 }`,
 styles:[`:host{display:block;width:100%;}.date-row{display:flex;gap:8px;align-items:center;min-height:44px;font-size:17px;}.date-row>span{flex:1}.date-row>button{background:var(--cal-panel-2);color:var(--cal-text);border:0;border-radius:999px;min-height:34px;padding:6px 12px;font:inherit;cursor:pointer}.date-row>button.active{color:var(--cal-blue);background:#2168de22}.date-calendar{padding:12px 0 16px;border-top:1px solid var(--cal-line)}.month-heading{display:flex;align-items:center;gap:6px;margin-bottom:12px;}.month-heading>span{flex:1}.month-heading>button{background:none;color:var(--cal-blue);border:0;padding:8px;cursor:pointer}.month-heading cc-symbol{width:14px;height:14px}.date-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px;}.date-grid>small{text-align:center;color:var(--cal-muted);font-size:13px;padding:4px}.date-grid>button{width:36px;height:36px;justify-self:center;background:none;border:0;border-radius:50%;font:400 19px var(--font-body);color:var(--cal-text);cursor:pointer}.date-grid>button.selected{background:var(--cal-blue);color:white}.date-grid>button.today:not(.selected){color:var(--cal-blue);font-weight:600}.date-grid>button.outside{visibility:hidden}.date-grid>button:disabled{opacity:.3;cursor:default}.time-wheels{height:180px;display:flex;align-items:center;justify-content:center;gap:12px;border-top:1px solid var(--cal-line);margin-bottom:12px}.wheel{box-sizing:border-box;position:relative;height:160px;overflow:auto;scroll-snap-type:y mandatory;scrollbar-width:none;width:90px;padding:62px 0;overscroll-behavior:contain;}.wheel button{display:block;width:100%;height:36px;scroll-snap-align:center;color:var(--cal-muted);font:22px var(--font-body);background:none;border:0;cursor:pointer;border-radius:8px}.wheel button.selected{color:var(--cal-text);background:var(--cal-panel-2)}@media(max-width:420px){.date-row{font-size:17px}.date-row>button{padding:7px;}.date-grid>button{width:32px;height:32px;}}`]
})
export class CalendarDateTimeComponent implements OnDestroy {
 private localization=inject(CalendarLocalization);
 private scrollTimers=new Map<string,ReturnType<typeof setTimeout>>();
 private openTimer?:ReturnType<typeof setTimeout>;
 timeFormat=input('system');
 twelveHour=computed(()=>this.timeFormat()==='12'||(this.timeFormat()==='system'&&!!new Intl.DateTimeFormat(this.localization.locale(),{hour:'numeric'}).resolvedOptions().hour12));
 wheelParts=computed(():Array<'hour'|'minute'|'period'>=>this.twelveHour()?['hour','minute','period']:['hour','minute']);
 wheelValues(part:'hour'|'minute'|'period'):string[]{return part==='period'?['AM','PM']:part==='minute'?this.minutes:this.twelveHour()?Array.from({length:12},(_,i)=>String(i+1)):this.hours;}
 selectedValue(part:'hour'|'minute'|'period'):string{const hour=Number(this.time().slice(0,2));return part==='minute'?this.time().slice(3,5):part==='period'?(hour<12?'AM':'PM'):this.twelveHour()?String(hour%12||12):this.time().slice(0,2);}
 private setWheel(part:'hour'|'minute'|'period',value:string){let hour=Number(this.time().slice(0,2));let minute=this.time().slice(3,5);if(part==='minute')minute=value;else if(part==='period')hour=hour%12+(value==='PM'?12:0);else hour=this.twelveHour()?Number(value)%12+(hour>=12?12:0):Number(value);const next=String(hour).padStart(2,'0')+':'+minute;if(next!==this.time())this.timeChange.emit(next);}
 wheelScroll(event:Event,part:'hour'|'minute'|'period'){const wheel=event.currentTarget as HTMLElement;clearTimeout(this.scrollTimers.get(part));this.scrollTimers.set(part,setTimeout(()=>{if(this.expanded()!=='time')return;const values=this.wheelValues(part);this.setWheel(part,values[Math.min(values.length-1,Math.max(0,Math.round(wheel.scrollTop/36)))]);},140));}
 chooseWheel(event:Event,part:'hour'|'minute'|'period',value:string){this.setWheel(part,value);const wheel=(event.currentTarget as HTMLElement).parentElement;wheel?.scrollTo({top:this.wheelValues(part).indexOf(value)*36,behavior:'smooth'});}
 wheelKey(event:KeyboardEvent,part:'hour'|'minute'|'period'){if(!['ArrowDown','ArrowUp','Home','End'].includes(event.key))return;event.preventDefault();const values=this.wheelValues(part),index=values.indexOf(this.selectedValue(part));const next=event.key==='Home'?0:event.key==='End'?values.length-1:Math.max(0,Math.min(values.length-1,index+(event.key==='ArrowDown'?1:-1)));this.setWheel(part,values[next]);(event.currentTarget as HTMLElement).scrollTo({top:next*36,behavior:'smooth'});}
 ngOnDestroy(){clearTimeout(this.openTimer);this.scrollTimers.forEach(clearTimeout);}

 private host:ElementRef<HTMLElement>=inject(ElementRef);
 label=input('Date');date=input.required<string>();time=input('09:00');showsTime=input(true);minimum=input('');firstWeekday=input(0);
 dateChange=output<string>();timeChange=output<string>();
 focus = model<string | null>(null);
 expanded = computed(() => {
   if (this.focus() === this.label() + '-date') return 'date';
   if (this.showsTime() && this.focus() === this.label() + '-time') return 'time';
   return null;
 });
 month=signal(new Date().getMonth());year=signal(new Date().getFullYear());
 today=new Date().toLocaleDateString('en-CA');
 months=computed(()=>Array.from({length:12},(_,i)=>({value:''+i,label:new Date(2020,i,1).toLocaleString(this.localization.locale(),{month:'long'})})));
 years=Array.from({length:201},(_,i)=>({value:''+(1900+i),label:''+(1900+i)}));
 hours=Array.from({length:24},(_,i)=>(''+i).padStart(2,'0'));minutes=Array.from({length:60},(_,i)=>(''+i).padStart(2,'0'));
 weekdays=computed(()=>Array.from({length:7},(_,i)=>new Date(2026,10,1+i+this.firstWeekday())));
 days=computed(()=>{const start=new Date(this.year(),this.month(),1);start.setDate(1-(start.getDay()-this.firstWeekday()+7)%7);return Array.from({length:42},(_,i)=>{const date=new Date(start);date.setDate(date.getDate()+i);return {date,key:`${date.getFullYear()}-${(''+(date.getMonth()+1)).padStart(2,'0')}-${(''+date.getDate()).padStart(2,'0')}`};});});
 timeLabel(){return new Date('2000-01-01T'+this.time()).toLocaleTimeString(this.localization.locale(),{hour:'numeric',minute:'2-digit',hour12:this.twelveHour()});}
 toggle(kind:'date'|'time'){this.focus.set(this.expanded()===kind?null:this.label()+'-'+kind);if(kind==='date'){const date=new Date(this.date()+'T12:00:00');this.month.set(date.getMonth());this.year.set(date.getFullYear());}if(kind==='time'&&this.expanded()==='time')this.openTimer=setTimeout(()=>this.host.nativeElement.querySelectorAll<HTMLElement>('.wheel').forEach((wheel,i)=>{const part=this.wheelParts()[i];wheel.scrollTop=this.wheelValues(part).indexOf(this.selectedValue(part))*36;}));}
 step(direction:number){const date=new Date(this.year(),this.month()+direction,1);this.year.set(date.getFullYear());this.month.set(date.getMonth());}
}
