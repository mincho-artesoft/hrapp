import {Injectable,inject,signal} from '@angular/core';
import {CalendarPlatformApiService,DeviceCalendar,WebCalendarEvent} from './calendar-platform-api.service';
@Injectable({providedIn:'root'})
export class CalendarProviderService{
 private api=inject(CalendarPlatformApiService);
 readonly calendars=signal<DeviceCalendar[]>([]);readonly events=signal<WebCalendarEvent[]>([]);
 readonly error=signal('');readonly loaded=signal<Set<string>>(new Set());private generation=0;private request?:Promise<void>;private forcedRequest?:Promise<void>;private updated=0;private token:string|null=null;
 clear(){this.generation++;this.calendars.set([]);this.events.set([]);this.loaded.set(new Set());this.updated=0;this.request=undefined;this.forcedRequest=undefined;this.error.set('');}
 refresh(force=false):Promise<void>{
  if(this.token!==this.api.token()){this.clear();this.token=this.api.token();}
  if(!this.token)return Promise.resolve();if(this.request){
   if(!force)return this.request;
   if(!this.forcedRequest){const waiting=this.request,generation=this.generation;const queued=waiting.then(()=>{if(generation!==this.generation)return;if(this.request===waiting)this.request=undefined;this.forcedRequest=undefined;return this.refresh(true);});this.forcedRequest=queued;void queued.finally(()=>{if(this.forcedRequest===queued)this.forcedRequest=undefined;});}
   return this.forcedRequest;
  }if(!force&&Date.now()-this.updated<60000)return Promise.resolve();
  const generation=this.generation;
  const task=(async()=>{
   const now=new Date(),start=new Date(now.getFullYear()-1,now.getMonth(),1).toISOString(),end=new Date(now.getFullYear()+2,now.getMonth(),1).toISOString();
   const calendars:DeviceCalendar[]=[],events:WebCalendarEvent[]=[],loaded=new Set<string>(),errors:string[]=[];
   await Promise.all((['google','microsoft'] as const).map(async provider=>{
    if(!this.api.profile()?.connectedProviders?.[provider]?.connected)return;
    try{const state=await this.perform<{calendars:DeviceCalendar[];events:WebCalendarEvent[]}>(provider,{action:'state',start,end,timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone});calendars.push(...state.calendars);events.push(...state.events);loaded.add(provider);}
    catch(e){errors.push(e instanceof Error?e.message:'Could not refresh calendar.');calendars.push(...this.calendars().filter(c=>c.provider===provider));events.push(...this.events().filter(e=>e.provider===provider));if(this.loaded().has(provider))loaded.add(provider);}
   }));
   if(generation!==this.generation||this.token!==this.api.token())return;
   this.calendars.set(calendars);this.events.set(events);this.loaded.set(loaded);this.error.set(errors.join(' '));this.updated=Date.now();
  })();this.request=task;return task.finally(()=>{if(this.request===task)this.request=undefined;});
 }
 perform<T=any>(provider:'google'|'microsoft',body:unknown):Promise<T>{return this.api.providerCalendarRequest<T>(provider,body);}
 async saveCalendar(provider:'google'|'microsoft',calendar:DeviceCalendar|null,title:string,color:string){await this.perform(provider,{action:calendar?'update-calendar':'create-calendar',calendarID:calendar?.remoteID,title:!calendar||calendar.providerOwner&&title!==calendar.title?title:undefined,color,etag:calendar?.etag});await this.refresh(true);}
 async deleteCalendar(calendar:DeviceCalendar){await this.perform(calendar.provider!,{action:calendar.providerOwner?'delete-calendar':'unsubscribe-calendar',calendarID:calendar.remoteID,etag:calendar.etag});await this.refresh(true);}
 async saveEvent(calendar:DeviceCalendar,event:WebCalendarEvent|undefined,values:any,clientRequestID?:string):Promise<WebCalendarEvent>{
  const patch = {...values};
  if (event) {
    // A full editor form also contains untouched display values. Sending them can replace
    // a provider's inherited reminders or rewrite the body of a formatted invitation.
    if (values.title === event.title) delete patch.title;
    if ((values.location || '') === (event.location || '')) delete patch.location;
    if ((values.notes || '') === (event.details?.notes || '')) delete patch.notes;
    for (const key of ['providerPrivacy','providerShowAs','providerDefaultReminders'] as const) {
      if (values[key] === event.details?.[key]) delete patch[key];
    }
    if (JSON.stringify(values.providerOtherReminders ?? []) === JSON.stringify(event.details?.providerOtherReminders ?? [])) delete patch.providerOtherReminders;
    if (values.availability === event.details?.availability) delete patch.availability;
    if (JSON.stringify(values.alarms) === JSON.stringify(event.details?.alarms)) delete patch.alarms;
    if (values.start && values.end && Date.parse(values.start) === Date.parse(event.start) &&
        Date.parse(values.end) === Date.parse(event.end) && !!values.allDay === !!event.allDay &&
        values.timeZone === event.details?.timeZone) {
      delete patch.start;
      delete patch.end;
    }
  }
  if (calendar.provider === 'google' && (patch.alarms !== undefined || patch.providerDefaultReminders !== undefined || patch.providerOtherReminders !== undefined)) {
    patch.providerOtherReminders = values.providerOtherReminders ?? event?.details?.providerOtherReminders ?? [];
    patch.providerDefaultReminders = values.providerDefaultReminders ?? event?.details?.providerDefaultReminders ?? false;
    if (!patch.providerDefaultReminders) patch.alarms ??= event?.details?.alarms ?? [];
  }
  const result=await this.perform<{eventID:string;event?:WebCalendarEvent}>(calendar.provider!,{action:'save-event',calendarID:calendar.remoteID,eventID:event?.remoteID,etag:event?.providerEtag,event:patch,clientRequestID});
  await this.refresh(true);
  const sameCalendar = this.events().filter(item => item.provider === calendar.provider && item.providerCalendarID === calendar.remoteID);
  const stored = sameCalendar.find(item => item.remoteID === result.eventID)
    ?? sameCalendar.find(item => item.providerSeriesID === result.eventID)
    ?? (result.event && {...result.event, calendarTitle:calendar.title, color:calendar.color});
  if(!stored)throw new Error('Saved to the provider. Refresh this calendar to view the event.');return stored;
 }
 async deleteEvent(event:WebCalendarEvent){await this.perform(event.provider!,{action:'delete-event',calendarID:event.providerCalendarID,eventID:event.remoteID,etag:event.providerEtag});await this.refresh(true);}
}
