import { CalendarActionSheetComponent } from './calendar-action-sheet.component';
import { bookingRange, CalendarGuestBookingActionComponent } from './calendar-guest-booking-action.component';
import {bookingMinutes, type BookingBreak, type BookingDailyPattern} from '../../../../../backend/src/booking/booking-daily-pattern';
import { CalendarGuestBookingGridComponent } from './calendar-guest-booking-grid.component';
import { CalendarSectionPickerComponent } from './calendar-section-picker.component';
import { CalendarRemovalComponent } from './calendar-removal.component';
import { CalendarInvitationActionsComponent } from './calendar-invitation-actions.component';
import {NgTemplateOutlet} from '@angular/common';
import {CalendarChoiceComponent} from './calendar-choice.component';
import {CalendarProgressComponent} from './calendar-progress.component';
import { bookingParticipantName, bookingStatus, slotReservation, slotStatus } from '../../core/booking-status';
import {CalendarLocationEditorComponent, LocationDraft, finishLocation} from './calendar-location-editor.component';
import {CalendarDateTimeComponent} from './calendar-date-time.component';
import {CalendarSymbolComponent} from './calendar-symbol.component';
import catalog from '../../../../../native/Calendar/BookingTypes.json';
import { CalendarRepeatComponent } from './calendar-repeat.component';
import { CalendarEventTitleLocationComponent, CalendarEventRepeatFieldsComponent, CalendarEventRemovalComponent, eventRepeatChoices } from './calendar-event-editor-fields';
import { CalendarRepeatRule, WebCalendarEvent } from '../../core/calendar-platform-api.service';
import { calendarDayStart, instant, wallDate } from '../../core/calendar-recurrence';
import { ChangeDetectorRef, Component, computed, ElementRef, inject, input, output, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CalendarNativeTextPipe, CalendarLocalization } from '../../core/calendar-localization';
import { BookingWorkspace, BookingPurpose, BookingCalendar, BookingListing, BookingSlot, Availability, Appointment, isBookingHistory, bookingID, guestBookingSlots, isBusySlot } from '../../core/booking-workspace';

function clockMinutes(value:string) {
  return /^\d{2}:\d{2}$/.test(value) ? Number(value.slice(0,2))*60 + Number(value.slice(3,5)) : NaN;
}
function clockText(value:number) {
  return [Math.floor(value/60),value%60].map(n=>String(n).padStart(2,'0')).join(':');
}
interface InputSlot extends LocationDraft {allDay:boolean; breaks:BookingBreak[]; gap:number; closeMinute:number; firstMinute:number;hourStep:number; firstHour:number; lastHour:number; id:string; title:string; date:string; start:string; end:string; endDate:string; choice:string; rule?:CalendarRepeatRule; zone:string; original?:BookingSlot}
const frequencies = ['daily','weekly','monthly','yearly'] as const;
type BookingPanel = 'edit'|'slot'|'lookup'|'offer'|'share'|'appointment';
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
  const hours = s.hoursOfDay ?? [];
  const pattern=s.dailyPattern, duration=(Date.parse(s.end)-Date.parse(s.start))/60000;
  const justToday = (hours.length > 1 || !!pattern) && rule?.frequency === 'daily' && rule.endDate &&
    localTime(new Date(rule.endDate),zone).slice(0,10) === start.slice(0,10);
  return {id:s.id,original:s,rule:justToday ? undefined : rule,choice:justToday ? 'none' : repeatChoice(rule),zone,
    allDay:!!s.allDay, breaks:pattern?.breaks.map(b=>({...b})) ?? [], gap:pattern ? pattern.step-duration : 0,
    closeMinute:pattern ? pattern.last+duration : 18*60, firstMinute:pattern?.first ?? clockMinutes(start.slice(11)),
    firstHour:hours[0] ?? Number(start.slice(11,13)), lastHour:hours.at(-1) ?? 17,
    hourStep:pattern ? -1 : hours.length > 1 ? hours[1] - hours[0] : 0,date:start.slice(0,10),start:start.slice(11),end:end.slice(11),endDate:s.allDay ? localTime(new Date(Date.parse(s.end)-1),zone).slice(0,10) : end.slice(0,10),
    title:s.title ?? '',location:s.location ?? '',structuredLocation:s.structuredLocation,videoCallURL:s.videoCallURL ?? ''};
}

interface BookingDecisionPrompt {
  request: Appointment;
  status: 'accepted' | 'declined';
  calendar: BookingCalendar | null;
  session: string;
  onError?: (message: string) => void;
}

@Component({
  selector:'cc-bookings', standalone:true, imports:[CalendarActionSheetComponent, CalendarGuestBookingActionComponent, NgTemplateOutlet, CalendarGuestBookingGridComponent, CalendarSectionPickerComponent, CalendarInvitationActionsComponent, CalendarChoiceComponent, CalendarRemovalComponent, CalendarProgressComponent, FormsModule, CalendarNativeTextPipe, CalendarRepeatComponent, CalendarEventTitleLocationComponent, CalendarEventRepeatFieldsComponent, CalendarEventRemovalComponent, CalendarDateTimeComponent, CalendarLocationEditorComponent, CalendarSymbolComponent],
  templateUrl:'./bookings.component.html', styleUrl:'./bookings.component.scss',
})
export class BookingsComponent implements OnInit, OnDestroy {
  readonly store = inject(BookingWorkspace);
  readonly mode = input.required<string>();
  readonly timelineCalendar = input<BookingCalendar|null>(null);
  readonly firstWeekday = input(0);
  readonly desktop = input(false);
  readonly dateFocus = signal<string|null>(null);
  readonly query = input('');
  readonly locale = inject(CalendarLocalization);
  private readonly route = inject(ActivatedRoute);
  private readonly changeDetector = inject(ChangeDetectorRef);
  readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('sheet');
  private readonly timesSheet = viewChild<ElementRef<HTMLDialogElement>>('timesSheet');
  readonly panel = signal<BookingPanel>('lookup');
  readonly timelineRequested = output<string>();
  readonly message = signal('');
  readonly decisionPrompt = signal<BookingDecisionPrompt|null>(null);
  readonly busy = signal(false);
  readonly offerMode = signal<'list'|'grid'>('list');
  readonly myMode = signal<'list'|'grid'|'history'>('list');
  readonly inspectedId = signal('');
  readonly inspected = computed(() => this.store.data().appointments.find(r => r.id === this.inspectedId()));
  readonly myAppointments = computed(() => this.store.data().appointments.filter(r => this.matchesAppointment(r)));
  readonly listedAppointments = computed(() => {
    const rows = this.myMode() === 'history' ? this.store.history() : this.store.upcoming();
    return rows.filter(r => this.matchesAppointment(r));
  });
  readonly isHistory = isBookingHistory;
  private matchesAppointment(r: Appointment) {
    return this.matches(r.calendarTitle, r.title ?? '', r.hostName, this.statusLabel(r), this.locale.text(this.statusLabel(r)));
  }
  inspect(r: Appointment) { this.inspectedId.set(r.id); this.show('appointment'); }
  readonly offerModes = [{value:'list',label:'List'}, {value:'grid',label:'MultiDay'}] as const;
  readonly myModes = [...this.offerModes, {value:'history',label:'History'}] as const;
  readonly offerRevision = signal(0);
  readonly isBusySlot = isBusySlot;
  readonly displaySlots = computed(() => { const page=this.offer(); return page ? guestBookingSlots(page) : []; });
  readonly offer = signal<Availability|null>(null);
  private readonly directory = signal<BookingListing[]>([]);
  readonly directoryLoading = signal(false);
  readonly directoryError = signal('');
  readonly search = signal('');
  readonly category = signal('');
  readonly filterType = signal('');
  readonly categories = [{value: '', label: 'All categories'}, ...catalog.map(group => ({value: group.title, label: group.title}))];
  private directoryVersion = 0;
  listed = true;
  readonly status = bookingStatus;
  readonly slotStatus = slotStatus;
  readonly pendingTimelineRequests = computed(() => this.timelineCalendar()?.requests.filter(r => this.needsHostResponse(r)) ?? []);
  needsHostResponse(request: Appointment) {
    return request.status === 'pending' && !request.proposal && Date.parse(request.end) > Date.now();
  }
  canCancel(r:Appointment) {
    return (r.status==='pending'||r.status==='accepted') && Math.max(Date.parse(r.start), Date.parse(r.proposal?.start ?? r.start)) > Date.now();
  }
  cancelFromList(r:Appointment) {
    if (!this.canCancel(r)) return;
    return this.perform(async()=>{
      try { await this.store.request('/'+r.calendarId+'/requests/'+r.id+'/cancel','PUT'); }
      finally { await this.store.refresh(); }
    });
  }
  movingRequest(calendar: BookingCalendar, request: Appointment) {
    return this.store.pendingMoves().some(move => move.calendarId === calendar.id && move.revision === calendar.revision && move.requestId === request.id);
  }
  pendingRequestForEvent(event: WebCalendarEvent) {
    const calendar = this.timelineCalendar();
    if (!calendar || event.calendarId !== calendar.id || event.readOnly || !event.id.startsWith('request-')) return;
    return this.pendingTimelineRequests().find(r => 'request-' + r.id === event.id && !this.movingRequest(calendar, r));
  }
  participantName(name:string) { return bookingParticipantName(name, key => this.locale.text(key)); }
  statusLabel(appointment: Appointment) { return appointment.cancelledByGuest ? 'Cancelled' : this.status[appointment.status].label; }
  statusColor(appointment: Appointment) { return this.status[appointment.status].color; }

  confirmingRemoval = false;
  editing: BookingCalendar|null = null;
  draftID = '';
  title = '';
  slot?: InputSlot;
  occurrence = false;
  reservation?: Appointment;
  locationDraft?: LocationDraft;
  customRepeat = false;
  endOnDate = false;
  address = '';
  type = '';
  customType = '';
  choosingType = false;
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
      return (!allowedTypes || allowedTypes.includes(type)) && (!this.filterType() || type === this.filterType()) &&
        (!query || matchingTypes.has(type) || [item.title,item.hostName,type,item.customType ?? ''].some(value => fold(value).includes(query)));
    }).sort((a,b) => a.title.localeCompare(b.title, this.locale.locale()));
  });
  get filteredTypes() {
    const query=this.typeSearch.trim().toLocaleLowerCase();
    const category = this.panel() === 'lookup' ? this.category() : '';
    const groups = category ? this.catalog.filter(group => group.title === category) : this.catalog;
    if (!query) return groups;
    return groups.map(group=>({...group, types:group.types.filter(type=>
      [type,group.title,this.typeLabel(type),this.locale.text(group.title)].some(text=>text.toLocaleLowerCase().includes(query)))
    })).filter(group=>group.types.length);
  }
  get selectedType() { return this.panel() === 'lookup' ? this.filterType() : this.type; }
  selectType(value: string) {
    if (this.panel() === 'lookup') this.filterType.set(value);
    else this.type = value;
    this.choosingType = false;
  }
  setCategory(value: string) {
    if (value === this.category()) return;
    this.category.set(value);
    this.filterType.set('');
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
    const label = eventRepeatChoices.find(o=>o.value===choice)?.label ?? '';
    if (slot.dailyPattern) return [this.locale.text(label),this.locale.text('Custom schedule')].filter(Boolean).join(' · ');
    if (!slot.hoursOfDay?.length) return this.locale.text(label);
    const draft = inputSlot(slot);
    const times = this.lastHourOptions(draft);
    const first = this.locale.shortTime().format(new Date(2000,0,1,draft.firstHour,Number(draft.start.slice(3,5))));
    return [draft.choice === 'none' ? '' : this.locale.text(label), this.hourSteps()[draft.hourStep].label,
      first + ' – ' + times.at(-1)?.label].filter(Boolean).join(' · ');
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
      const page=await this.store.request<Availability>('/'+previous.id+'?includeBusy=true&from='+encodeURIComponent(previous.nextFrom!));
      const oldBusy = previous.busy ?? [], seen = new Set(oldBusy.map(s=>s.id));
      this.offer.set({...page,slots:[...previous.slots,...page.slots],busy:[...oldBusy,...(page.busy ?? []).filter(s=>!seen.has(s.id))]});
    });
  }
  private operation = 0;

  ngOnInit() {
    const id = this.route.snapshot.queryParamMap.get('bookingCalendar')?.toLowerCase();
    if (id && bookingID.test(id)) {
      queueMicrotask(async () => {
        this.show('lookup');
        await this.preview(id);
        if (this.panel() === 'lookup' && this.dialog().nativeElement.open) {
          void this.loadDirectory();
        }
      });
    }
  }
  ngOnDestroy() {++this.operation; ++this.directoryVersion;}
  matches(...values:string[]) {return values.join(' ').toLocaleLowerCase().includes(this.query().trim().toLocaleLowerCase());}

  range(slot: BookingSlot) {
    return bookingRange(slot, this.locale);
  }
  slotDetail(title:string, slot:BookingSlot) { return [title,slot.title,this.range(slot),slot.location].filter(Boolean).join(' · '); }
  openTimes() { this.message.set(''); this.timesSheet()?.nativeElement.showModal(); }
  get hasOpenSheet() { return this.dialog().nativeElement.open || !!this.timesSheet()?.nativeElement.open; }
  openLookup() {
    this.offer.set(null); this.search.set(''); this.category.set(''); this.filterType.set('');
    this.show('lookup'); void this.loadDirectory();
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
  sheetClosed() { ++this.directoryVersion; this.offerMode.set('list'); }
  show(panel:BookingPanel) {
    this.locationDraft=undefined;this.customRepeat=false;this.choosingType=false;this.dateFocus.set(null);
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
    this.show('edit');
  }
  openSlot(calendar:BookingCalendar, existing?:BookingSlot, occurrence=false, seed?:BookingSlot, reservation?:Appointment) {
    this.reservation=reservation ?? (existing && slotReservation(calendar, existing));
    this.occurrence=occurrence || !!this.reservation;
    this.confirmingRemoval = false;
    this.editing=calendar;
    const tomorrow=new Date();
    tomorrow.setDate(tomorrow.getDate()+1);tomorrow.setHours(9,0,0,0);
    const last=calendar.slots.at(-1);
    const start=last ? Math.max(+tomorrow,Date.parse(last.end)) : +tomorrow;
    this.slot=inputSlot(existing ?? seed ?? {id:crypto.randomUUID(),start:new Date(start).toISOString(),end:new Date(start+3600000).toISOString()});
    if (!existing) this.slot.original=undefined;
    this.endOnDate=!!this.slot.rule?.endDate;
    this.show('slot');
  }
  openTimelineSlot(calendar:BookingCalendar, event:{id:string; start:string; end:string}) {
    const [kind, ...rest] = event.id.split('-'), id = rest.join('-');
    const request = kind === 'slot' ? undefined : calendar.requests.find(r => r.id === id);
    const slotId = request?.slotId ?? id;
    const base = calendar.slots.find(s => s.id === slotId.split('@')[0]);
    if (!base && !request) return;
    if (base && !base.rule && !request) { this.openSlot(calendar, base); return; }
    const source = request?.proposal ?? request ?? base;
    this.openSlot(calendar, {...source,id:slotId,start:event.start,end:event.end,timeZone:source?.timeZone ?? base?.timeZone,rule:undefined,hoursOfDay:undefined,dailyPattern:undefined},true,undefined,request);
  }
  requestDecision(request: Appointment, status: BookingDecisionPrompt['status'], calendar: BookingCalendar | null, onError?: (message: string) => void) {
    const session = this.store.api.token();
    if (!session || this.busy() || this.decisionPrompt()) return;
    this.decisionPrompt.set({request, status, calendar, session, onError});
  }
  decisionDetails({request, calendar}: BookingDecisionPrompt) {
    const proposal = request.proposal;
    const details = calendar ? [calendar.title, this.participantName(request.guestName)] : [request.calendarTitle];
    details.push(this.range(request));
    if (proposal) details.push(this.locale.text('Proposed change'), this.range(proposal));
    return details.join(' · ');
  }
  async confirmDecision(choice: BookingDecisionPrompt) {
    if (this.decisionPrompt() !== choice) return;
    this.decisionPrompt.set(null);
    if (this.busy() || this.store.api.token() !== choice.session) return;
    const {request, status, calendar} = choice;
    await this.perform(async () => {
      if (calendar) {
        const current = this.store.data().calendars.find(c => c.id === calendar.id);
        const latest = current?.requests.find(r => r.id === request.id);
        if (!current || !latest || !this.needsHostResponse(latest) || this.movingRequest(current,latest)) return;
      } else {
        const current = this.store.data().appointments.find(r => r.calendarId === request.calendarId && r.id === request.id);
        if (!request.proposal || current?.proposal?.id !== request.proposal.id) return;
      }
      const path = '/' + request.calendarId + '/requests/' + request.id;
      try {
        if (calendar) await this.store.request(path+'/decision','PUT',{status});
        else await this.store.request(path+'/change-response','PUT',{status,proposalId:request.proposal!.id});
      } finally { await this.store.refresh(); }
    });
    if (this.message() && choice.session === this.store.api.token()) choice.onError?.(this.message());
  }
  changeStart(s:InputSlot,date:string,time:string) {
    const before=Date.parse(s.date+'T'+s.start+'Z');
    const after=Date.parse(date+'T'+time+'Z');
    const end=Date.parse(s.endDate+'T'+s.end+'Z');
    const moved=new Date(end+after-before).toISOString();
    const hourChanged=s.start.slice(0,2)!==time.slice(0,2);
    s.date=date;s.start=time;s.endDate=moved.slice(0,10);s.end=moved.slice(11,16);
    if (s.hourStep===-1) s.firstMinute=clockMinutes(time);
    else if (hourChanged) this.setHourStep(s,s.hourStep);
    if(s.rule?.endDate && this.until(s)<date) this.setUntil(s,date);
  }
  readonly hourSteps = computed(() => {
    const format = new Intl.NumberFormat(this.locale.locale(), {style:'unit',unit:'hour',unitDisplay:'long'});
    return [...Array.from({length:24}, (_, step) => ({value:String(step),label:step ? format.format(step) : 'Never'})), {value:'-1',label:'Custom schedule'}];
  });
  lastHourOptions(s:InputSlot) {
    if (!s.hourStep) return [];
    const format = new Intl.DateTimeFormat(this.locale.formattingLocale(),
      {hour:'numeric',minute:'2-digit',hourCycle:this.locale.shortTime().resolvedOptions().hourCycle,timeZone:'UTC'});
    const options = [];
    for (let hour=s.firstHour+s.hourStep; hour<24; hour+=s.hourStep) {
      if (hour>=Number(s.start.slice(0,2))) options.push({value:String(hour),
        label:format.format(Date.UTC(2000,0,1,hour,Number(s.start.slice(3,5))))});
    }
    return options;
  }
  setHourStep(s:InputSlot, step:number) {
    if (step===-1 && s.hourStep!==-1) {
      const duration=this.duration(s), first=clockMinutes(s.start);
      s.gap=s.hourStep ? Math.max(0,s.hourStep*60-duration) : 0;
      s.firstMinute=s.hourStep ? s.firstHour*60+first%60 : first;
      s.closeMinute=Math.min(1440,s.hourStep ? s.lastHour*60+first%60+duration : Math.max(1080,first+duration));
    }
    s.hourStep=step;
    if (step===-1) return;
    s.firstHour=Number(s.start.slice(0,2));
    if (!step) return;
    const last = Math.min(23,Math.max(s.lastHour,s.firstHour+step));
    s.lastHour = s.firstHour + Math.floor((last-s.firstHour)/step)*step;
  }
  readonly clockText = clockText;
  readonly clockMinutes = clockMinutes;
  duration(s:InputSlot) {
    const bounds=this.intervalFor(s);
    return bounds ? (+bounds.end-+bounds.start)/60000 : 0;
  }
  setDuration(s:InputSlot,minutes:number) {
    if (!Number.isInteger(minutes) || minutes<1 || minutes>1440) return;
    const end=new Date(Date.parse(s.date+'T'+s.start+'Z')+minutes*60000).toISOString();
    s.endDate=end.slice(0,10); s.end=end.slice(11,16);
  }
  addBreak(s:InputSlot) {
    this.setHourStep(s,-1);
    const start=Math.min(23*60,s.breaks.at(-1)?.end ?? 720);
    s.breaks.push({start,end:Math.min(1440,start+60)});
  }
  setAllDay(s:InputSlot,checked:boolean) {
    this.dateFocus.set(null);
    if (!checked && s.start===s.end) { s.start='09:00'; s.end='10:00'; }
    if (checked && !s.allDay && s.end==='00:00' && s.endDate>s.date)
      s.endDate=new Date(Date.parse(s.endDate+'T00:00Z')-86400000).toISOString().slice(0,10);
    s.allDay=checked;
  }
  private pattern(s:InputSlot):BookingDailyPattern {
    const duration=this.duration(s);
    return {first:s.firstMinute,last:s.closeMinute-duration,step:duration+s.gap,breaks:s.breaks};
  }
  validDailyHours(s:InputSlot) {
    if (s.allDay) return !!this.intervalFor(s);
    if (s.hourStep===-1) return Number.isInteger(s.gap) && s.gap>=0 && bookingMinutes(this.pattern(s),this.duration(s)).length>0;
    if (!s.hourStep) return true;
    const interval = this.intervalFor(s);
    return s.lastHour>=s.firstHour+s.hourStep && s.lastHour<24 && !!interval &&
      +interval.end-+interval.start<=s.hourStep*3600000;
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
    if(this.choosingType || this.customRepeat || this.locationDraft){event.preventDefault();this.back();}
  }
  back() {
    if (this.locationDraft) { finishLocation(this.locationDraft);this.locationDraft=undefined; }
    else if (this.customRepeat) this.customRepeat=false;
    else if (this.choosingType) this.choosingType=false;
    else this.dialog().nativeElement.close();
  }
  get sheetTitle() {
    if(this.locationDraft) return 'Location';
    if(this.customRepeat) return 'Custom';
    if(this.choosingType) return 'Appointment type';
    switch(this.panel()) {
      case 'edit':return 'Booking calendar';
      case 'slot':if(this.reservation) return this.reservation.proposal ? 'Proposed change' : 'Booking'; return this.slot?.original ? 'Available time' : 'Add time slot';
      case 'share':return 'Share';
      case 'appointment':return 'My booking';
      case 'lookup':
      case 'offer':return 'Open booking calendar';
    }
  }
  locked(id:string) {if (this.occurrence) return !!this.reservation?.proposal || this.reservation?.status==='past'; if (this.slot?.original?.hoursOfDay || this.slot?.original?.dailyPattern) return false; return !!this.editing?.requests.some(r=>(r.slotId===id || r.slotId.startsWith(id+'@')) && (r.status==='pending'||r.status==='accepted'));}
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
      const values={title:this.title,listed:this.listed,appointmentType:this.type,customType:this.type==='Other'?this.customType.trim():'',
        slots:old?.slots ?? []};
      await this.store.request('/'+id,'PUT',{...values,revision:old?.revision ?? 0});
      this.dialog().nativeElement.close();
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
    if (slot.allDay) {
      const exclusive=new Date(slot.endDate+'T00:00Z');
      if (!Number.isFinite(+exclusive)) return null;
      exclusive.setUTCDate(exclusive.getUTCDate()+1);
      const start=calendarDayStart(new Date(slot.date+'T00:00Z'),slot.zone), end=calendarDayStart(exclusive,slot.zone);
      return start && end && end>start ? {start,end} : null;
    }
    const start = resolve(slot.date, slot.start, slot.original?.start);
    const end = resolve(slot.endDate, slot.end, slot.original?.end);
    return start && end && end > start ? {start, end} : null;
  }
  saveSlot(remove=false) {
    const calendar=this.editing, s=this.slot;
    if (!calendar || !s || this.locked(s.id)) return;
    if (remove && (!s.original || !this.confirmingRemoval)) return;
    return this.perform(async()=>{
      const venue = {location:s.location.trim(), structuredLocation:s.structuredLocation ?? null, videoCallURL:s.videoCallURL?.trim() || null};
      if (this.occurrence) {
        const bounds=this.intervalFor(s);
        if (!bounds && !remove) throw Error(this.locale.text('End time must be after start time.'));
        await this.store.request('/'+calendar.id+'/occurrences/'+encodeURIComponent(s.id),'PUT',remove
          ? {revision:calendar.revision,remove:true}
          : {revision:calendar.revision,start:bounds!.start.toISOString(),end:bounds!.end.toISOString(),
             allDay:s.allDay,timeZone:s.zone,title:s.title.trim(),...venue});
        this.dialog().nativeElement.close();
        await this.store.refresh();
        return;
      }
      const slots:unknown[]=calendar.slots.filter(slot=>slot.id!==s.id);
      if (!remove) {
        const bounds = this.intervalFor(s);
        if (!bounds) throw Error(this.locale.text('End time must be after start time.'));
        const {start, end} = bounds;
        if (!this.validDailyHours(s)) throw Error(this.locale.text('Choose an interval that fits at least two non-overlapping slots in the day.'));
        const dailyPattern=!s.allDay && s.hourStep===-1 ? this.pattern(s) : null;
        const hoursOfDay = !s.allDay && s.hourStep>0 ? Array.from({length:1+(s.lastHour-s.firstHour)/s.hourStep}, (_,i)=>s.firstHour+i*s.hourStep) : null;
        const rule = s.rule ? {...s.rule,frequency:frequencies.indexOf(s.rule.frequency)} : hoursOfDay || dailyPattern ?
          {frequency:0,interval:1,endDate:instant(new Date(s.date+'T23:59:59.999Z'),s.zone)!.toISOString()} : null;
        slots.push({id:s.id,title:s.title.trim(),...venue, hoursOfDay, dailyPattern, allDay:s.allDay, rule,
          start:start.toISOString(),end:end.toISOString(),timeZone:s.zone});
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
  updateSearch(value:string, submitted = false) {
    if (this.busy()) return;
    this.search.set(value);
    this.message.set('');
    const text = value.trim();
    if (!/^https?:\/\//i.test(text)) return;
    const url = URL.canParse(text) ? new URL(text) : null;
    const id = url?.searchParams.get('bookingCalendar')?.toLowerCase();
    if (url?.protocol !== 'https:' || !['www.cloud-calendars.com','cloud-calendars.com'].includes(url.hostname) || !id || !bookingID.test(id)) {
      if (submitted) this.message.set(this.locale.text('Enter a booking calendar link.'));
      return;
    }
    void this.perform(async () => {
      await this.openOffer(id);
      this.search.set('');
    });
  }
  async openOffer(id:string) {
    this.offer.set(await this.store.request<Availability>('/'+id+'?includeBusy=true'));
    this.offerMode.set('list');
    this.show('offer');
  }
  preview(id:string) { return this.perform(() => this.openOffer(id)); }
  book(slot:BookingSlot) {
    const calendar = this.offer();
    if (!calendar || calendar.isOwner || (isBusySlot(slot) && !slot.myBookingId)) return;
    return this.perform(async()=>{
      try {
        const path='/'+calendar.id+'/requests/';
        if (slot.myBookingId) {
          await this.store.request(path+slot.myBookingId+'/cancel','PUT');
          this.message.set(this.locale.text('Cancelled')+' · '+this.range(slot));
        } else {
          await this.store.request(path+crypto.randomUUID(),'PUT',{slotId:slot.id});
          this.message.set(this.locale.text('Pending')+' · '+this.range(slot));
        }
      } finally {
        this.offerRevision.update(n=>n+1);
        void this.store.refresh();
        if (this.dialog().nativeElement.open) {
          const page=await this.store.request<Availability>('/'+calendar.id+'?includeBusy=true');
          if (this.offer()?.id===calendar.id) this.offer.set(page);
        }
      }
    });
  }

}
