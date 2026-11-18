import {Component,ChangeDetectionStrategy,input,output,computed} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CalendarNativeTextPipe} from '../../core/calendar-localization';
import {CalendarSymbolComponent} from './calendar-symbol.component';
import {CalendarChoiceComponent} from './calendar-choice.component';
import type {CalendarRepeatRule} from '../../core/calendar-platform-api.service';
@Component({selector:'cc-repeat',standalone:true,imports:[FormsModule,CalendarNativeTextPipe,CalendarSymbolComponent,CalendarChoiceComponent],changeDetection:ChangeDetectionStrategy.OnPush,
 template:`<div class="group"><div class="row"><span>{{'Frequency'|nativeText}}</span><cc-choice label="Frequency" [value]="rule().frequency" [options]="frequencies" (valueChange)="frequency($event)"/></div><label class="row"><span>{{'Every'|nativeText}}</span><input type="number" min="1" max="999" [ngModel]="rule().interval||1" (ngModelChange)="patch({interval:clamp($event)})"/><span class="unit">{{unit()|nativeText}}</span></label></div>
 @if(rule().frequency==='weekly'){<div class="group">@for(day of weekdays;track day.value){<button class="row" (click)="toggleWeekday(day.value)"><span>{{day.label|nativeText}}</span>@if(selectedWeekdays().includes(day.value)){<cc-symbol name="checkmark"/>}</button>}</div>}
 @if(rule().frequency==='monthly'){<div class="group"><button class="row" (click)="ordinal(false)"><span>{{'Each'|nativeText}}</span>@if(!usesOrdinal()){<cc-symbol name="checkmark"/>}</button><button class="row" (click)="ordinal(true)"><span>{{'On the…'|nativeText}}</span>@if(usesOrdinal()){<cc-symbol name="checkmark"/>}</button>@if(!usesOrdinal()){<div class="grid days">@for(day of monthDays;track day){<button [class.selected]="selectedMonthDays().includes(day)" (click)="toggleMonthDay(day)">{{day}}</button>}</div>}</div>}
 @if(rule().frequency==='yearly'){<div class="group grid months">@for(month of months;track month.value){<button [class.selected]="selectedMonths().includes(month.value)" (click)="toggleMonth(month.value)">{{month.label}}</button>}</div><div class="group"><label class="row"><span>{{'Days of Week'|nativeText}}</span><input class="switch" type="checkbox" [checked]="usesOrdinal()" (change)="ordinal($any($event.target).checked)"/></label></div>}
 @if((rule().frequency==='monthly'||rule().frequency==='yearly')&&usesOrdinal()){<div class="group row ordinal"><cc-choice label="Ordinal" [value]="''+(rule().setPositions?.[0]||1)" [options]="ordinals" (valueChange)="patch({setPositions:[+$event]})"/><cc-choice label="Day" [value]="ordinalDay()" [options]="ordinalDays" (valueChange)="setOrdinalDay($event)"/></div>}
 <p class="summary">{{summary()}}</p>`,
 styles:[`:host{display:block}.group{background:var(--cal-panel);border-radius:16px;padding:0 16px;margin-bottom:24px}.row{display:flex;align-items:center;width:100%;gap:12px;min-height:46px;background:none;border:0;color:var(--cal-text);font:17px var(--font-body);padding:10px 0;text-align:left}.row+.row{border-top:1px solid var(--cal-line)}.row>span:first-child{flex:1}.row input[type=number]{width:60px;text-align:right;background:transparent;border:0;color:var(--cal-blue);font:inherit;outline:none}.unit{color:var(--cal-muted)}cc-symbol{width:19px;height:19px;color:var(--cal-blue)}button{cursor:pointer}.grid{display:grid;gap:4px;padding:12px}.days{grid-template-columns:repeat(7,1fr)}.months{grid-template-columns:repeat(4,1fr)}.grid button{background:none;color:var(--cal-text);border:0;border-radius:8px;font:17px var(--font-body);min-height:40px}.grid button.selected{background:var(--cal-blue);color:white}.ordinal{justify-content:center;gap:24px;padding:16px}.summary{font-size:13px;color:var(--cal-muted);padding:0 16px;line-height:1.5}.switch{appearance:none;width:51px;height:31px;background:#78788055;border-radius:99px;position:relative;cursor:pointer}.switch:checked{background:var(--cal-blue)}.switch:after{content:'';position:absolute;width:27px;height:27px;left:2px;top:2px;border-radius:50%;background:white;transition:transform .18s}.switch:checked:after{transform:translateX(20px)}`]})
export class CalendarRepeatComponent{
 rule=input.required<CalendarRepeatRule>();start=input.required<string>();ruleChange=output<CalendarRepeatRule>();
 frequencies=[{value:'daily',label:'Daily'},{value:'weekly',label:'Weekly'},{value:'monthly',label:'Monthly'},{value:'yearly',label:'Yearly'}];
 weekdays=Array.from({length:7},(_,i)=>({value:i+1,label:new Date(2026,10,1+i).toLocaleString(undefined,{weekday:'long'})}));
 monthDays=Array.from({length:31},(_,i)=>i+1);months=Array.from({length:12},(_,i)=>({value:i+1,label:new Date(2026,i,1).toLocaleString(undefined,{month:'short'})}));
 ordinals=[{value:'1',label:'First'},{value:'2',label:'Second'},{value:'3',label:'Third'},{value:'4',label:'Fourth'},{value:'5',label:'Fifth'},{value:'-1',label:'Last'}];
 ordinalDays=[...this.weekdays.map(d=>({value:''+d.value,label:d.label})),{value:'8',label:'Day'},{value:'9',label:'Weekday'},{value:'10',label:'Weekend day'}];
 selectedWeekdays=computed(()=>this.rule().daysOfTheWeek?.map(d=>d.weekday)??[new Date(this.start()+'T12:00').getDay()+1]);
 selectedMonthDays=computed(()=>this.rule().daysOfTheMonth??[new Date(this.start()+'T12:00').getDate()]);
 selectedMonths=computed(()=>this.rule().monthsOfTheYear??[new Date(this.start()+'T12:00').getMonth()+1]);
 usesOrdinal=computed(()=>!!this.rule().daysOfTheWeek?.length);
 unit=computed(()=>({daily:'days',weekly:'weeks',monthly:'months',yearly:'years'})[this.rule().frequency]);
 summary=computed(()=>`Every ${this.rule().interval||1} ${this.unit()}.`);
 clamp(n:number){return Math.min(999,Math.max(1,Math.floor(n)||1));}
 patch(values:Partial<CalendarRepeatRule>){this.ruleChange.emit({...this.rule(),...values});}
 frequency(value:string){this.ruleChange.emit({frequency:value as CalendarRepeatRule['frequency'],interval:this.rule().interval||1,endDate:this.rule().endDate});}
 toggle(values:number[],value:number){const next=values.includes(value)?values.filter(v=>v!==value):[...values,value];return next.length?next.sort((a,b)=>a-b):values;}
 toggleWeekday(value:number){this.patch({daysOfTheWeek:this.toggle(this.selectedWeekdays(),value).map(weekday=>({weekday}))});}
 toggleMonthDay(value:number){this.patch({daysOfTheMonth:this.toggle(this.selectedMonthDays(),value)});}
 toggleMonth(value:number){this.patch({monthsOfTheYear:this.toggle(this.selectedMonths(),value)});}
 ordinal(enabled:boolean){this.patch({daysOfTheWeek:enabled?[{weekday:new Date(this.start()+'T12:00').getDay()+1}]:undefined,setPositions:enabled?[1]:undefined,daysOfTheMonth:undefined});}
 ordinalDay(){const days=this.rule().daysOfTheWeek?.map(d=>d.weekday)??[1];return days.length===7?'8':days.length===5?'9':days.length===2&&days.includes(1)&&days.includes(7)?'10':''+days[0];}
 setOrdinalDay(value:string){const n=+value;this.patch({daysOfTheWeek:(n===8?[1,2,3,4,5,6,7]:n===9?[2,3,4,5,6]:n===10?[1,7]:[n]).map(weekday=>({weekday})),setPositions:this.rule().setPositions??[1]});}
}
