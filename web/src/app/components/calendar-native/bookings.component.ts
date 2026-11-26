import { CalendarRemovalComponent } from './calendar-removal.component';
import {NgTemplateOutlet} from '@angular/common';
import {CalendarProgressComponent} from './calendar-progress.component';
import {CalendarColorOptionsComponent} from './calendar-color-options.component';
import {CalendarLocationEditorComponent, LocationDraft, finishLocation} from './calendar-location-editor.component';
import {CalendarDateTimeComponent} from './calendar-date-time.component';
import {CalendarSymbolComponent} from './calendar-symbol.component';
import catalog from '../../../../../native/Calendar/BookingTypes.json';
import { CalendarRepeatComponent } from './calendar-repeat.component';
import { CalendarEventTitleLocationComponent, CalendarEventRepeatFieldsComponent, CalendarEventRemovalComponent, eventRepeatChoices } from './calendar-event-editor-fields';
import { CalendarRepeatRule } from '../../core/calendar-platform-api.service';
import { instant, wallDate } from '../../core/calendar-recurrence';
import { ChangeDetectorRef, Component, computed, ElementRef, inject, input, output, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CalendarNativeTextPipe, CalendarLocalization } from '../../core/calendar-localization';
import { BookingWorkspace, BookingPurpose, BookingCalendar, BookingListing, BookingSlot, Availability, Appointment, bookingID } from '../../core/booking-workspace';

interface InputSlot extends LocationDraft {id:string; title:string; date:string; start:string; end:string; endDate:string; choice:string; rule?:CalendarRepeatRule; zone:string; original?:BookingSlot}
const frequencies = ['daily','weekly','monthly','yearly'] as const;
type BookingPanel = 'edit'|'slot'|'lookup'|'offer'|'share';
function localTime(date:Date, zone:string) {
  return wallDate(date,zone).toISOString().slice(0,16);
}
function repeatChoice(rule?:CalendarRepeatRule) {
  if (!rule) return 'none';
  if (rule.daysOfTheWeek?.length || rule.daysOfTheMonth?.length || rule.monthsOfTheYear?.length ||
      rule.setPositions?.length || rule.daysOfTheYear?.length || rule.weeksOfTheYear?.length) return 'custom';
  if (rule.frequency==='weekly' && rule.interval===2) return 'fortnightly';
  return (rule.interval ?? 1)===1 ? rule.frequency : 'custom';
}
function inputSlot(s:BookingSlot):InputSlot {
  const zone=s.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const start=localTime(new Date(s.start),zone), end=localTime(new Date(s.end),zone);
  const rule=s.rule ? {...s.rule,frequency:frequencies[s.rule.frequency]} : undefined;
  return {id:s.id,original:s,rule,choice:repeatChoice(rule),zone,date:start.slice(0,10),start:start.slice(11),end:end.slice(11),endDate:end.slice(0,10),title:s.title ?? '',location:s.location ?? '',structuredLocation:s.structuredLocation};
}

@Component({
  selector:'cc-bookings', standalone:true, imports:[NgTemplateOutlet, CalendarRemovalComponent, CalendarProgressComponent, CalendarColorOptionsComponent, FormsModule, CalendarNativeTextPipe, CalendarRepeatComponent, CalendarEventTitleLocationComponent, CalendarEventRepeatFieldsComponent, CalendarEventRemovalComponent, CalendarDateTimeComponent, CalendarLocationEditorComponent, CalendarSymbolComponent],
  templateUrl:'./bookings.component.html', styleUrl:'./bookings.component.scss',
})
export class BookingsComponent implements OnInit, OnDestroy {
  readonly store = inject(BookingWorkspace);
  readonly mode = input.required<string>();
  readonly firstWeekday = input(0);
  readonly desktop = input(false);
  readonly dateFocus = signal<string|null>(null);
  readonly query = input('');
  readonly locale = inject(CalendarLocalization);
  private readonly route = inject(ActivatedRoute);
  private readonly changeDetector = inject(ChangeDetectorRef);
  readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('sheet');
  readonly panel = signal<BookingPanel>('lookup');
  readonly timelineRequested = output<string>();
  readonly message = signal('');
  readonly busy = signal(false);
  readonly offer = signal<Availability|null>(null);
  private readonly directory = signal<BookingListing[]>([]);
  readonly directoryLoading = signal(false);
  readonly directoryError = signal('');
  readonly search = signal('');
  readonly category = signal('');
  private directoryVersion = 0;
  fromDirectory = false;
  listed = true;
  readonly status = {pending:'Pending', accepted:'Accepted', declined:'Declined', past:'Past'};
  statusLabel(appointment: Appointment) { return this.status[appointment.status]; }

  confirmingRemoval = false;
  editing: BookingCalendar|null = null;
  draftID = '';
  title = '';
  slot?: InputSlot;
  locationDraft?: LocationDraft;
  customRepeat = false;
  endOnDate = false;
  address = '';
  type = '';
  customType = '';
  choosingType = false;
  choosingColor = false;
  color = '#0A84FF';
  typeSearch = '';
  readonly catalog = catalog;
  readonly results = computed(() => {
    const fold = (value:string) => value.normalize('NFD').replace(/\p{M}/gu,'').toLocaleLowerCase();
    const query = fold(this.search().trim());
    const category = this.category();
    const matchingTypes = new Set<string>();
    const allowedTypes = this.catalog.find(group => group.title === category)?.types;
    for (const group of this.catalog) {
      const groupMatches = [group.title, this.locale.text(group.title)].some(value => fold(value).includes(query));
      for (const type of group.types) {
        if (groupMatches || [type, this.typeLabel(type)].some(value => fold(value).includes(query))) matchingTypes.add(type);
      }
    }
    return this.directory().filter(item => {
      const type = item.appointmentType || 'General appointment';
      return (!allowedTypes || allowedTypes.includes(type)) &&
        (!query || matchingTypes.has(type) || [item.title,item.hostName,type,item.customType ?? ''].some(value => fold(value).includes(query)));
    }).sort((a,b) => a.title.localeCompare(b.title, this.locale.locale()));
  });
  get filteredTypes() {
    const query=this.typeSearch.trim().toLocaleLowerCase();
    if (!query) return this.catalog;
    return this.catalog.map(group=>({...group, types:group.types.filter(type=>
      [type,group.title,this.typeLabel(type),this.locale.text(group.title)].some(text=>text.toLocaleLowerCase().includes(query)))
    })).filter(group=>group.types.length);
  }
  typeLabel(type:string) {
    if (type==='Other') {
      const translated=this.locale.text('Other appointment type');
      if (translated!=='Other appointment type') return translated;
    }
    return this.locale.text(type);
  }
  purpose(c:BookingPurpose) {
    return c.appointmentType==='Other' && c.customType ? c.customType : this.typeLabel(c.appointmentType || 'General appointment');
  }
  repeatName(slot:BookingSlot) {
    const choice=repeatChoice(slot.rule && {...slot.rule,frequency:frequencies[slot.rule.frequency]});
    return eventRepeatChoices.find(o=>o.value===choice)?.label;
  }
  selectRepeat(s:InputSlot,value:string) {
    const endDate=s.rule?.endDate;
    s.choice=value;
    if(value==='none') {s.rule=undefined;return;}
    if(value==='custom' && s.rule) return;
    const frequency=frequencies.find(f=>f===value) ?? (value==='fortnightly'?'weekly':'daily');
    s.rule={frequency,interval:value==='fortnightly'?2:1,...(endDate?{endDate}:{})};
  }
  until(s:InputSlot) {return s.rule?.endDate ? localTime(new Date(s.rule.endDate),s.zone).slice(0,10) : '';}
  setUntil(s:InputSlot,date:string) {
    if(s.rule)s.rule={...s.rule,occurrenceCount:undefined,endDate:date ? instant(new Date(date+'T23:59:59Z'),s.zone)?.toISOString() : undefined};
  }
  async moreTimes() {
    const previous=this.offer();
    if(!previous?.nextFrom)return;
    await this.perform(async()=>{
      const page=await this.store.request<Availability>('/'+previous.id+'?from='+encodeURIComponent(previous.nextFrom!));
      this.offer.set({...page,slots:[...previous.slots,...page.slots]});
    });
  }
  private timer?: ReturnType<typeof setInterval>;
  private operation = 0;

  ngOnInit() {
    const id = this.route.snapshot.queryParamMap.get('bookingCalendar');
    if (id && bookingID.test(id)) {
      this.address = this.store.link(id).href;
      queueMicrotask(() => {this.show('lookup'); void this.lookup();});
    }
    this.timer = setInterval(() => {if (!document.hidden) void this.store.refresh();}, 30000);
    void this.store.refresh();
  }
  ngOnDestroy() {clearInterval(this.timer); ++this.operation; ++this.directoryVersion;}
  matches(...values:string[]) {return values.join(' ').toLocaleLowerCase().includes(this.query().trim().toLocaleLowerCase());}
  private readonly rangeDate = computed(() =>
    new Intl.DateTimeFormat(this.locale.formattingLocale(), {dateStyle: 'medium'}));

  range(slot: BookingSlot) {
    const start = new Date(slot.start);
    const end = new Date(slot.end);
    const date = this.rangeDate();
    const time = this.locale.shortTime();
    const endDate = start.toDateString() === end.toDateString() ? '' : date.format(end) + ', ';
    return date.format(start) + ', ' + time.format(start) + ' – ' + endDate + time.format(end);
  }
  add() {
    if (this.mode()==='availability') this.edit(null);
    else {
      this.address=''; this.offer.set(null); this.search.set(''); this.category.set('');
      this.fromDirectory=true; this.show('lookup'); void this.loadDirectory();
    }
  }
  async loadDirectory() {
    const version = ++this.directoryVersion, token = this.store.api.token();
    this.directory.set([]); this.directoryLoading.set(true); this.directoryError.set('');
    try {
      let after: string|null = null;
      do {
        const page: {calendars:BookingListing[]; next:string|null} = await this.store.request('/directory' + (after ? '?after='+encodeURIComponent(after) : ''));
        if (version !== this.directoryVersion || token !== this.store.api.token()) return;
        this.directory.update(items => [...items,...page.calendars]);
        after = page.next;
      } while (after);
    } catch (error) {
      if (version === this.directoryVersion) this.directoryError.set((error as Error).message);
    } finally {
      if (version === this.directoryVersion) this.directoryLoading.set(false);
    }
  }
  sheetClosed() { ++this.directoryVersion; this.fromDirectory=false; }
  show(panel:BookingPanel) {
    this.locationDraft=undefined;this.customRepeat=false;this.choosingType=false;this.choosingColor=false;this.dateFocus.set(null);
    this.panel.set(panel);this.message.set('');
    this.changeDetector.detectChanges();
    if (!this.dialog().nativeElement.open) this.dialog().nativeElement.showModal();
  }
  edit(calendar:BookingCalendar|null) {
    this.confirmingRemoval = false;
    this.type=calendar ? (calendar.appointmentType || 'General appointment') : '';
    this.customType=calendar?.customType || '';this.choosingType=false;
    this.editing=calendar;this.draftID=calendar?.id ?? crypto.randomUUID();
    this.title=calendar?.title ?? '';
    this.listed=calendar?.listed ?? true;
    this.color=calendar?.color ?? '#0A84FF';
    this.show('edit');
  }
  openSlot(calendar:BookingCalendar, existing?:BookingSlot) {
    this.confirmingRemoval = false;
    this.editing=calendar;
    const tomorrow=new Date();
    tomorrow.setDate(tomorrow.getDate()+1);tomorrow.setHours(9,0,0,0);
    const last=calendar.slots.at(-1);
    const start=last ? Math.max(+tomorrow,Date.parse(last.end)) : +tomorrow;
    this.slot=inputSlot(existing ?? {id:crypto.randomUUID(),start:new Date(start).toISOString(),end:new Date(start+3600000).toISOString()});
    if (!existing) this.slot.original=undefined;
    this.endOnDate=!!this.slot.rule?.endDate;
    this.show('slot');
  }
  changeStart(s:InputSlot,date:string,time:string) {
    const before=Date.parse(s.date+'T'+s.start+'Z');
    const after=Date.parse(date+'T'+time+'Z');
    const end=Date.parse(s.endDate+'T'+s.end+'Z');
    const moved=new Date(end+after-before).toISOString();
    s.date=date;s.start=time;s.endDate=moved.slice(0,10);s.end=moved.slice(11,16);
    if(s.rule?.endDate && this.until(s)<date) this.setUntil(s,date);
  }
  chooseRepeat(s:InputSlot,value:string) {
    this.selectRepeat(s,value);
    this.customRepeat=value==='custom';
    if (value==='none') this.endOnDate=false;
  }
  chooseEnd(s:InputSlot,choice:string) {
    this.endOnDate=choice==='date';
    const next=new Date(s.date+'T12:00:00Z');
    next.setUTCDate(next.getUTCDate()+30);
    this.setUntil(s,this.endOnDate ? this.until(s) || next.toISOString().slice(0,10) : '');
  }
  onCancel(event:Event) {
    if(this.busy()){event.preventDefault();return;}
    if(this.choosingType || this.choosingColor || this.customRepeat || this.locationDraft || (this.fromDirectory && this.panel()==='offer')){event.preventDefault();this.back();}
  }
  back() {
    if (this.locationDraft) { finishLocation(this.locationDraft);this.locationDraft=undefined; }
    else if (this.customRepeat) this.customRepeat=false;
    else if (this.choosingColor) this.choosingColor=false;
    else if (this.choosingType) this.choosingType=false;
    else if (this.fromDirectory && this.panel()==='offer') this.show('lookup');
    else this.dialog().nativeElement.close();
  }
  get sheetTitle() {
    if(this.locationDraft) return 'Location';
    if(this.customRepeat) return 'Custom';
    if(this.choosingColor) return 'Calendar Color';
    if(this.choosingType) return 'Appointment type';
    switch(this.panel()) {
      case 'edit':return 'Booking calendar';
      case 'slot':return this.slot?.original ? 'Available time' : 'Add time slot';
      case 'share':return 'Share';
      case 'lookup':
      case 'offer':return 'Open booking calendar';
    }
  }
  locked(id:string) {return !!this.editing?.requests.some(r=>(r.slotId===id || r.slotId.startsWith(id+'@')) && (r.status==='pending'||r.status==='accepted'));}
  async perform(action:()=>Promise<void>) {
    if(this.busy()) return;
    const sequence=++this.operation;
    this.busy.set(true);this.message.set('');
    try {await action();}
    catch(e) {if(sequence===this.operation)this.message.set((e as Error).message);}
    finally {if(sequence===this.operation)this.busy.set(false);}
  }
  saveCalendar() {
    return this.perform(async()=>{
      const old=this.editing;
      const id=this.draftID;
      const values={title:this.title,color:this.color,listed:this.listed,appointmentType:this.type,customType:this.type==='Other'?this.customType.trim():'',
        slots:old?.slots ?? []};
      const receipt=await this.store.request<{revision:number}>('/'+id,'PUT',{...values,revision:old?.revision ?? 0});
      if (old) this.dialog().nativeElement.close();
      else this.openSlot({id,...values,revision:receipt.revision,requests:[]});
      await this.store.refresh();
    });
  }
  intervalFor(slot: InputSlot) {
    const resolve = (date: string, time: string, original?: string) => {
      if (original && localTime(new Date(original), slot.zone) === date + 'T' + time) {
        return new Date(original);
      }
      const wall = new Date(date + 'T' + time + 'Z');
      return Number.isFinite(wall.getTime()) ? instant(wall, slot.zone) : null;
    };
    const start = resolve(slot.date, slot.start, slot.original?.start);
    const end = resolve(slot.endDate, slot.end, slot.original?.end);
    return start && end && end > start ? {start, end} : null;
  }
  saveSlot(remove=false) {
    const calendar=this.editing, s=this.slot;
    if (!calendar || !s || this.locked(s.id)) return;
    if (remove && (!s.original || !this.confirmingRemoval)) return;
    return this.perform(async()=>{
      const slots:unknown[]=calendar.slots.filter(slot=>slot.id!==s.id);
      if (!remove) {
        const bounds = this.intervalFor(s);
        if (!bounds) throw Error(this.locale.text('End time must be after start time.'));
        const {start, end} = bounds;
        slots.push({id:s.id,title:s.title.trim(),location:s.location.trim(),structuredLocation:s.structuredLocation ?? null,
          start:start.toISOString(),end:end.toISOString(),rule:s.rule ? {...s.rule,frequency:frequencies.indexOf(s.rule.frequency)} : null,timeZone:s.zone});
      }
      await this.store.request('/'+calendar.id,'PUT',{title:calendar.title,slots,revision:calendar.revision});
      this.dialog().nativeElement.close();
      await this.store.refresh();
    });
  }
  remove() {
    const calendar=this.editing;
    if (!calendar || !this.confirmingRemoval || this.busy()) return;
    return this.perform(async()=>{
      await this.store.request('/'+calendar.id+'?revision='+calendar.revision,'DELETE');
      this.dialog().nativeElement.close();await this.store.refresh();
    });
  }
  async share(calendar: BookingCalendar) {
    const url = this.store.link(calendar.id).href;
    if (navigator.share) {
      try {
        await navigator.share({url});
        return;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
      }
    }
    this.address = url;
    this.show('share');
  }
  copyLink() {
    return this.perform(async()=>{await navigator.clipboard.writeText(this.address); this.message.set(this.locale.text('Copied'));});
  }
  lookup() {
    return this.perform(async()=>{
      let url:URL;
      try {url=new URL(this.address);} catch {throw Error(this.locale.text('Enter a booking calendar link.'));}
      const id=url.searchParams.get('bookingCalendar');
      if (!['www.cloud-calendars.com','cloud-calendars.com'].includes(url.hostname) || url.protocol!=='https:' || !id || !bookingID.test(id))
        throw Error(this.locale.text('Enter a booking calendar link.'));
      await this.openOffer(id);
    });
  }
  async openOffer(id:string) {
    this.offer.set(await this.store.request<Availability>('/'+id));
    this.show('offer');
  }
  preview(id:string) { return this.perform(() => this.openOffer(id)); }
  book(slot:BookingSlot) {
    const calendar = this.offer();
    if (!calendar || calendar.isOwner) return;
    return this.perform(async()=>{
      await this.store.request('/'+calendar.id+'/requests/'+crypto.randomUUID(),'PUT',{slotId:slot.id});
      this.dialog().nativeElement.close();await this.store.refresh();
    });
  }
  decide(c:BookingCalendar,r:Appointment,status:'accepted'|'declined') {
    return this.perform(async()=>{
      await this.store.request('/'+c.id+'/requests/'+r.id+'/decision','PUT',{status});
      await this.store.refresh();
    });
  }
}
