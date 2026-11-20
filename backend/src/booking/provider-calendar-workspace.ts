import {createHash} from 'node:crypto';
import {providerDate,providerInstant,providerRecurrence} from './provider-recurrence';
/** Native calendar operations, isolated from the legacy busy-time/booking API. */
export type CalendarProvider = 'google' | 'microsoft';
export class ProviderCalendarError extends Error {
  constructor(readonly status: number, message: string) { super(message); }
}
const encode = encodeURIComponent;
const key = (value: string) => Buffer.from(value).toString('base64url');
const hex = (value: unknown) => /^#[0-9a-f]{6}$/i.test(String(value)) ? String(value) : '#0A84FF';
export class ProviderCalendarWorkspace {
  constructor(private provider: CalendarProvider, private token: string, private transport: typeof fetch = fetch) {}
  private get base() { return this.provider === 'google' ? 'https://www.googleapis.com/calendar/v3/' : 'https://graph.microsoft.com/v1.0/me/'; }
  private async request(path: string, method = 'GET', body?: unknown, etag?: string): Promise<any> {
    // Paths are constructed here; never forward a caller-supplied URL or credential.
    const response = await this.transport(this.base + path, { method, headers: {
      Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json',
      ...(this.provider === 'microsoft' ? {Prefer: 'outlook.timezone="UTC", outlook.body-content-type="text"'} : {}),
      ...(etag ? {'If-Match': etag} : {}),
    }, body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(12000) });
    if (!response.ok) {
      const message = response.status === 401 ? 'Reconnect this calendar account to continue.'
        : response.status === 403 ? 'This account does not have permission for this calendar action. Reconnect it if calendar permissions have changed.'
        : response.status === 404 ? 'The calendar or event no longer exists. Refresh your calendars.'
        : response.status === 412 || response.status === 409 ? 'This item changed on another device. Refresh before saving.'
        : response.status === 429 ? 'The calendar provider is busy. Try again shortly.' : `Calendar provider could not complete the request (${response.status}).`;
      throw new ProviderCalendarError(response.status === 412 ? 409 : response.status, message);
    }
    return method === 'DELETE' || response.status === 204 ? {} : response.json();
  }
  private async pages(path: string, field: 'items'|'value'): Promise<any[]> {
    const values: any[] = [];let next: string|null = path;
    for (let page=0; next && page<100; page++) {
      const response = await this.request(next);values.push(...(response[field]??[]));
      if (values.length>10000) throw new ProviderCalendarError(413,'Choose a smaller calendar date range.');
      if (this.provider === 'google') {
        const url = new URL(path,this.base);if(response.nextPageToken)url.searchParams.set('pageToken',response.nextPageToken);
        next = response.nextPageToken ? url.href.slice(this.base.length) : null;
      } else {
        const link = response['@odata.nextLink'];
        if(link && !String(link).startsWith(this.base)) throw new ProviderCalendarError(502,'Invalid calendar provider pagination.');
        next=link ? String(link).slice(this.base.length) : null;
      }
    }
    if(next)throw new ProviderCalendarError(413,'Choose a smaller calendar date range.');
    return values;
  }
  private mapCalendar(c: any) {
    const google = this.provider==='google';
    const role=google?c.accessRole:c.canShare?'owner':c.canEdit?'writer':'reader';
    return {id:`provider.${this.provider}.${key(c.id)}`,provider:this.provider,remoteID:c.id,
      title:google?(c.summaryOverride||c.summary):c.name,source:google?'Google calendars':'Microsoft calendars',deviceName:'',
      timeZone:c.timeZone,color:hex(google?c.backgroundColor:c.hexColor),allowsChanges:role==='owner'||role==='writer',
      access:role==='owner'?'owner':role==='writer'?'writer':'reader',providerOwner:role==='owner',
      isRemovable:google?!c.primary:!c.isDefaultCalendar && (c.isRemovable ?? role==='owner'),
      ownerEmail:google?undefined:c.owner?.address,primary:!!(c.primary||c.isDefaultCalendar),etag:c.etag||c['@odata.etag']};
  }
  private iso(value: any,allDay=false,zone='UTC') {
    if(value?.date||allDay)return providerInstant(String(value.date||value.dateTime).slice(0,10),zone);
    const raw=String(value?.dateTime||'');
    // Graph is explicitly requested in UTC; Google timestamps carry their own offset.
    return new Date(/[zZ]|[+-]\d\d:\d\d$/.test(raw)?raw:raw+'Z').toISOString();
  }
  private mapEvent(e: any,c: any,displayZone:string) {
    const google = this.provider === 'google';
    const allDay = google ? !!e.start?.date : !!e.isAllDay;
    let zone = allDay ? (c.timeZone || displayZone) : (e.start?.timeZone || 'UTC');
    if (!google && e.originalStartTimeZone) {
      try { zone = new Intl.DateTimeFormat('en', {timeZone:e.originalStartTimeZone}).resolvedOptions().timeZone; }
      catch { /* Graph can return a Windows-only time zone. */ }
    }
    const ownsMeeting = google ? e.organizer?.self === true : e.isOrganizer === true;
    const alarms=google?(e.reminders?.overrides??[]).filter((a:any)=>a.method==='popup').map((a:any)=>({relativeOffsetSeconds:-a.minutes*60})):(e.isReminderOn?[{relativeOffsetSeconds:-e.reminderMinutesBeforeStart*60}]:[]);
    return {id:`provider.${this.provider}.${key(c.remoteID)}.${key(e.id)}`,provider:this.provider,remoteID:e.id,providerCalendarID:c.remoteID,
      providerSeriesID:google?e.recurringEventId:e.seriesMasterId,providerEtag:e.etag||e['@odata.etag'],calendarId:c.id,calendarTitle:c.title,title:(google?e.summary:e.subject)||'New Event',
      start:this.iso(e.start,allDay,zone),end:this.iso(e.end,allDay,zone),allDay,
      location:google?e.location:e.location?.displayName,color:c.color,readOnly:!c.allowsChanges || (!!e.attendees?.length && !ownsMeeting) || e.locked === true || e.status === 'cancelled' || e.isCancelled === true,
      status:google?e.status:e.isCancelled?'cancelled':'confirmed',updatedAt:google?e.updated:e.lastModifiedDateTime,
      sourceKind:'external',details:{
        providerPrivacy:e[google?'visibility':'sensitivity'] ?? (google?'default':'normal'),
        ...(google ? {providerDefaultReminders:e.reminders?.useDefault ?? !e.reminders?.overrides,
          providerOtherReminders:(e.reminders?.overrides ?? []).filter((item:any)=>item.method !== 'popup')} : {providerShowAs:e.showAs || 'busy'}),
        notes:google?e.description:e.body?.content,timeZone:zone,
        videoCallURL:google?e.hangoutLink:e.onlineMeeting?.joinUrl,url:google?e.source?.url:e.webLink,
        availability:google?(e.transparency==='transparent'?'free':'busy'):({free:'free',tentative:'tentative',oof:'unavailable'} as Record<string,string>)[e.showAs]??'busy',alarms,
        organizer:google?e.organizer:{email:e.organizer?.emailAddress?.address,name:e.organizer?.emailAddress?.name},
        attendees:(e.attendees??[]).map((a:any)=>google?{email:a.email,name:a.displayName,status:a.responseStatus}:{email:a.emailAddress?.address,name:a.emailAddress?.name,status:a.status?.response})}};
  }
  async state(start: string,end: string,zone='UTC') {
    try{new Intl.DateTimeFormat('en',{timeZone:zone}).format();}catch{throw new ProviderCalendarError(400,'Choose a valid time zone.');}
    if(!Number.isFinite(Date.parse(start))||!Number.isFinite(Date.parse(end))||Date.parse(end)<=Date.parse(start)||Date.parse(end)-Date.parse(start)>3*366*86400000)throw new ProviderCalendarError(400,'Choose a valid calendar date range.');
    const calendars=(await this.pages(this.provider==='google'?'users/me/calendarList?maxResults=250':'calendars?$top=100','google'===this.provider?'items':'value')).filter(c=>!c.deleted && (this.provider!=='google'||c.accessRole!=='freeBusyReader')).map(c=>this.mapCalendar(c));
    const events:any[]=[];
    // Limit concurrent requests to avoid provider throttling for many calendars.
    for(let i=0;i<calendars.length;i+=4)await Promise.all(calendars.slice(i,i+4).map(async c=>{
      const query=new URLSearchParams(this.provider==='google'?{timeMin:start,timeMax:end,singleEvents:'true',showDeleted:'false',maxResults:'2500'}:{startDateTime:start,endDateTime:end,$top:'1000'});
      const path=`${this.provider==='google'?'calendars/':'calendars/'}${encode(c.remoteID)}/${this.provider==='google'?'events':'calendarView'}?${query}`;
      const items=await this.pages(path,this.provider==='google'?'items':'value');
      events.push(...items.filter(e=>e.start&&e.end).map(e=>this.mapEvent(e,c,zone)));
    }));
    return {calendars,events};
  }
  async perform(input:any) {
    const action=String(input?.action||''),id=String(input?.calendarID||'');
    if(action==='state')return this.state(input.start,input.end,input.timeZone||'UTC');
    if(action!=='create-calendar'&&(!id||id.length>2048))throw new ProviderCalendarError(400,'Choose a calendar.');
    const calendarPath=`calendars/${encode(id)}`,google=this.provider==='google';
    const title=String(input.title||'').trim().slice(0,200);
    if(action==='create-calendar') {
      if(!title)throw new ProviderCalendarError(400,'Enter a calendar name.');
      const c=await this.request('calendars','POST',google?{summary:title}:{name:title});
      const entry = google
        ? await this.request(`users/me/calendarList/${encode(c.id)}?colorRgbFormat=true`, input.color ? 'PATCH' : 'GET',
            input.color ? {backgroundColor:hex(input.color),foregroundColor:'#ffffff'} : undefined)
        : c;
      return {created:true, calendar:this.mapCalendar(entry)};
    }
    if(action==='update-calendar') {
      let entry = title ? await this.request(calendarPath,'PATCH',google?{summary:title}:{name:title},input.etag) : null;
      if (google) entry = await this.request(`users/me/calendarList/${encode(id)}?colorRgbFormat=true`,input.color?'PATCH':'GET',
        input.color ? {backgroundColor:hex(input.color),foregroundColor:'#ffffff'} : undefined);
      else if (!entry?.id) entry = await this.request(calendarPath);
      return {updated:true, calendar:this.mapCalendar(entry)};
    }
    if(action==='delete-calendar'||action==='unsubscribe-calendar'){
      const entryPath=google?`users/me/calendarList/${encode(id)}`:calendarPath;
      const entry=this.mapCalendar(await this.request(entryPath));
      if(!entry.isRemovable || entry.primary || entry.providerOwner !== (action==='delete-calendar'))
        throw new ProviderCalendarError(403,'This calendar cannot be removed with that action.');
      if(input.etag && entry.etag && input.etag!==entry.etag)
        throw new ProviderCalendarError(409,'This calendar changed. Refresh before removing it.');
      const deletingGoogleCalendar=google && action==='delete-calendar';
      const etag=deletingGoogleCalendar?(await this.request(calendarPath)).etag:entry.etag;
      await this.request(deletingGoogleCalendar?calendarPath:entryPath,'DELETE',undefined,etag);
      return {deleted:true};
    }
    if(action==='list-access'&&google){const items=await this.pages(calendarPath+'/acl?maxResults=250','items');return {people:items.map(p=>({id:p.id,email:p.scope?.value||p.scope?.type,access:p.role,isOriginalOwner:p.role==='owner'}))};}
    if(action==='save-access'&&google){
      const email=String(input.email||'').trim();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!['reader','writer','owner'].includes(input.access))throw new ProviderCalendarError(400,'Choose an email address and access role.');
      const path=calendarPath+'/acl'+(input.personID?'/'+encode(String(input.personID)):'');
      return this.request(path,input.personID?'PATCH':'POST',{scope:{type:'user',value:email},role:input.access});
    }
    if(action==='delete-access'&&google&&input.personID){await this.request(calendarPath+'/acl/'+encode(String(input.personID)),'DELETE');return {deleted:true};}
    if(action==='save-event'||action==='delete-event') {
      const eventID=input.eventID?String(input.eventID):'';if(eventID.length>2048)throw new ProviderCalendarError(400,'Invalid event.');
      const path=calendarPath+'/events'+(eventID?'/'+encode(eventID):'');
      if(action==='delete-event'){if(!eventID)throw new ProviderCalendarError(400,'Choose an event.');await this.request(path,'DELETE',undefined,input.etag);return {deleted:true};}
      const e=input.event??{},payload:any={};
      const clientRequestID=String(input.clientRequestID||'').trim();
      if(clientRequestID.length>256)throw new ProviderCalendarError(400,'Invalid event request.');
      if(!eventID&&clientRequestID)payload[google?'id':'transactionId']=google?createHash('sha256').update(clientRequestID).digest('hex'):clientRequestID;
      if(e.title!==undefined)payload[google?'summary':'subject']=String(e.title).slice(0,1000);
      if(e.start!==undefined||e.end!==undefined){if(!Number.isFinite(Date.parse(e.start))||!Number.isFinite(Date.parse(e.end))||Date.parse(e.end)<=Date.parse(e.start))throw new ProviderCalendarError(400,'Choose valid event dates.');
        const timeZone = e.timeZone || 'UTC';
        for (const field of ['start','end']) {
          const day = providerDate(e[field], timeZone);
          if (google) payload[field] = e.allDay ? {date:day} : {dateTime:e[field],timeZone};
          else {
            const clock = e.allDay ? '00:00:00' : new Intl.DateTimeFormat('en-GB', {timeZone, hour:'2-digit',
              minute:'2-digit', second:'2-digit', fractionalSecondDigits:3, hourCycle:'h23'}).format(new Date(e[field]));
            payload[field] = {dateTime:day+'T'+clock, timeZone};
          }
        }
        if(!google)payload.isAllDay=!!e.allDay;
      }
      if(e.location!==undefined)payload.location=google?String(e.location||''):{displayName:String(e.location||'')};
      if(e.notes!==undefined)payload[google?'description':'body']=google?String(e.notes):{contentType:'text',content:String(e.notes)};
      if(e.availability!==undefined)payload[google?'transparency':'showAs']=google?(e.availability==='free'?'transparent':'opaque'):({free:'free',tentative:'tentative',unavailable:'oof'} as Record<string,string>)[e.availability]??'busy';
      if(e.providerPrivacy!==undefined){
        const choices=google?['default','public','private']:['normal','personal','private','confidential'];
        if(!choices.includes(e.providerPrivacy))throw new ProviderCalendarError(400,'Choose a valid event privacy setting.');
        payload[google?'visibility':'sensitivity']=e.providerPrivacy;
      }
      if(!google && e.providerShowAs!==undefined) {
        if(!['busy','free','tentative','oof','workingElsewhere','unknown'].includes(e.providerShowAs))throw new ProviderCalendarError(400,'Choose a valid availability.');
        payload.showAs=e.providerShowAs;
      }
      if(e.alarms!==undefined || (google && (e.providerDefaultReminders !== undefined || e.providerOtherReminders !== undefined))) {
        const minutes = (e.alarms ?? []).map((alarm:any) => {
          const seconds = alarm.absoluteDate ? (Date.parse(alarm.absoluteDate) - Date.parse(e.start)) / 1000 :
            alarm.relativeOffsetSeconds ?? alarm.relativeOffset;
          if (!Number.isFinite(seconds)) throw new ProviderCalendarError(400,'Choose a valid reminder time.');
          return Math.max(0,Math.round(-seconds / 60));
        });
        if (google) {
          const other = (e.providerOtherReminders ?? []).filter((item:any)=>item.method === 'email' && Number.isInteger(item.minutes) && item.minutes >= 0 && item.minutes <= 40320);
          payload.reminders = e.providerDefaultReminders ? {useDefault:true} : {useDefault:false,
            overrides:[...other, ...minutes.map((value:number)=>({method:'popup',minutes:Math.min(40320,value)}))].slice(0,5)};
        }
        else {payload.isReminderOn = minutes.length > 0; payload.reminderMinutesBeforeStart = minutes[0] ?? 0;}
      }
      if(!eventID&&e.recurrenceRules?.length){try{payload.recurrence=providerRecurrence(e.recurrenceRules,google,e.start,e.timeZone||'UTC');}catch(error){throw new ProviderCalendarError(400,(error as Error).message);}}
      // Like the native provider adapter, patch existing occurrences without overwriting the series or attendees.
      if (eventID && !Object.keys(payload).length) return {eventID};
      let result:any;
      try {result=await this.request(path,eventID?'PATCH':'POST',payload,input.etag);}
      catch(error){
        // A retry after a dropped create response must not create a second event.
        if(google&&!eventID&&payload.id&&error instanceof ProviderCalendarError&&error.status===409){
          result=await this.request(path+'/'+encode(payload.id));
        } else throw error;
      }
      const calendar = {id:`provider.${this.provider}.${key(id)}`,remoteID:id,allowsChanges:true,timeZone:input.calendarTimeZone};
      return {saved:true,eventID:result.id,event:result.start && result.end ? this.mapEvent(result,calendar,e.timeZone || 'UTC') : undefined};
    }
    throw new ProviderCalendarError(400,'Unsupported calendar action.');
  }
}
