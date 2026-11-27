import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, input, OnInit, output, signal, untracked } from '@angular/core';
import { Appointment, Availability, BookingSlot, BookingWorkspace, guestBookingSlots, isBusySlot } from '../../core/booking-workspace';
import { bookingStatus } from '../../core/booking-status';
import { CalendarLocalization, CalendarNativeTextPipe } from '../../core/calendar-localization';
import { calendarDateFormatter } from '../../core/calendar-format-preferences';
import { wallDate } from '../../core/calendar-recurrence';
import { nativeTimelineLayout } from '../../core/calendar-timeline-layout';
import { CalendarProgressComponent } from './calendar-progress.component';
import { CalendarRangePickerComponent } from './calendar-range-picker.component';
import { bookingRange, CalendarGuestBookingActionComponent } from './calendar-guest-booking-action.component';

interface GridSlot extends BookingSlot { appointment?: Appointment }

function midnight(date: Date, offset = 0) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + offset);
}
function localDay(date: Date) {
  return [date.getFullYear(), String(date.getMonth()+1).padStart(2,'0'), String(date.getDate()).padStart(2,'0')].join('-');
}
function dayForSlot(slot: BookingSlot, date: Date) {
  return slot.allDay && slot.timeZone ? wallDate(date,slot.timeZone).toISOString().slice(0,10) : localDay(date);
}
function minutes(date: Date) { return date.getHours()*60 + date.getMinutes(); }

@Component({
  selector: 'cc-guest-booking-grid',
  standalone: true, imports: [CalendarNativeTextPipe, CalendarProgressComponent, CalendarGuestBookingActionComponent, CalendarRangePickerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar-guest-booking-grid.component.html', styleUrl: './calendar-guest-booking-grid.component.scss',
})
export class CalendarGuestBookingGridComponent implements OnInit {
  readonly offer = input<Availability>();
  readonly appointments = input<readonly Appointment[]>();
  readonly inspect = output<Appointment>();
  readonly title = computed(() => this.offer()?.title ?? this.locale.text('My bookings'));
  readonly revision = input(0);
  readonly saving = input(false);
  readonly firstWeekday = input(0);
  readonly chosenCount = signal<number|null>(null);
  readonly reserve = output<BookingSlot>();
  private readonly store = inject(BookingWorkspace);
  readonly locale = inject(CalendarLocalization);
  readonly first = signal('');
  readonly today = localDay(new Date());
  private readonly defaultCount = signal(7);
  readonly count = computed(()=>this.chosenCount() ?? this.defaultCount());
  readonly last = computed(()=>this.first()?localDay(midnight(new Date(this.first()+'T00:00:00'),this.count()-1)):'');
  readonly page = signal<Availability|null>(null);
  readonly error = signal('');
  readonly attempt = signal(0);
  tile?: HTMLButtonElement;
  readonly selected = signal<BookingSlot|null>(null);
  readonly busy = isBusySlot;
  readonly dayFormat = computed(() => calendarDateFormatter(this.locale.formattingLocale(), this.locale.datePreference(), {weekday:'short', includeYear:false}));
  private readonly slots = computed<GridSlot[]>(() => {
    const appointments = this.appointments();
    if (appointments) return appointments.map(appointment => ({...(appointment.proposal ?? appointment), id:appointment.id, appointment}));
    const page = this.page();
    return page ? guestBookingSlots(page) : [];
  });
  readonly columns = computed(() => {
    if (!this.first()) return [];
    const first = new Date(this.first()+'T00:00:00');
    const slots = this.slots();
    return Array.from({length:this.count()}, (_,i) => {
      const day = midnight(first,i), next = midnight(first,i+1), key = localDay(day);
      const allDay = slots.filter(s => s.allDay && dayForSlot(s,new Date(s.start)) <= key &&
        dayForSlot(s,new Date(Date.parse(s.end)-1)) >= key);
      const blocks = nativeTimelineLayout(slots.filter(s => !s.allDay && Date.parse(s.start) < +next && Date.parse(s.end) > +day)
        .map(slot => {
          const start = new Date(Math.max(+day,Date.parse(slot.start))), end = new Date(Math.min(+next,Date.parse(slot.end)));
          const a = minutes(start), b = +end === +next ? 1440 : minutes(end);
          return {id:slot.id, data:slot, startMinutes:a, endMinutes:b > a ? b : Math.min(1440,a+(+end-+start)/60000)};
        }),{minimumDuration:10});
      return {key,day,allDay,blocks};
    });
  });
  readonly hasAllDay = computed(() => this.columns().some(c => c.allDay.length));
  readonly hours = computed(() => {
    const blocks = this.columns().flatMap(c=>c.blocks);
    const start = blocks.reduce((min,b)=>Math.min(min,Math.floor(b.startMinutes/60)),8);
    const end = blocks.reduce((max,b)=>Math.max(max,Math.ceil(b.endMinutes/60)),18);
    return Array.from({length:end-start},(_,i)=>start+i);
  });

  constructor() {
    if (typeof window !== 'undefined') {
      const compact = window.matchMedia('(max-width: 600px)');
      const resize = () => this.defaultCount.set(compact.matches ? 3 : 7);
      resize(); compact.addEventListener('change',resize);
      inject(DestroyRef).onDestroy(()=>compact.removeEventListener('change',resize));
    }
    effect(onCleanup => {
      const offer = this.offer();
      if (!offer) return;
      const id = offer.id, day = this.first(), count = this.count(), token = this.store.api.token();
      this.revision(); this.attempt();
      this.page.set(null); this.selected.set(null); this.error.set('');
      if (!day || !token) return;
      let current = true, timer: ReturnType<typeof setTimeout> | undefined;
      onCleanup(()=>{current=false; clearTimeout(timer);});
      const start = new Date(day+'T00:00:00');
      const params = new URLSearchParams({from:midnight(start,-1).toISOString(),to:midnight(start,count+1).toISOString()});
      const update = async () => {
        try {
          if (document.visibilityState === 'hidden' && this.page()) return;
          const result = await this.store.request<Availability>('/'+id+'?'+params);
          if (!current || token!==this.store.api.token()) return;
          this.page.set(result); this.error.set('');
          const choice = this.selected();
          if (choice) this.selected.set(guestBookingSlots(result).find(s=>s.id===choice.id && s.myBookingId===choice.myBookingId && s.start===choice.start && s.end===choice.end) ?? null);
        } catch (e) {
          if (current) { this.page.set(null); this.selected.set(null); this.error.set((e as Error).message); }
        } finally {
          if (current) timer=setTimeout(update,30_000);
        }
      };
      untracked(()=>void update());
    });
  }
  ngOnInit() {
    const offer = this.offer();
    const first = offer && guestBookingSlots(offer)[0];
    this.setDay(first ? dayForSlot(first,new Date(first.start)) : this.today);
  }
  setDay(day: string) { if (/^\d{4}-\d{2}-\d{2}$/.test(day)) this.first.set(day < this.today ? this.today : day); }
  changeRange(range:{start:string;end:string}) {
    const count=Math.round((Date.parse(range.end)-Date.parse(range.start))/86400000)+1;
    this.chosenCount.set(Math.max(1,Math.min(31,count)));
    this.first.set(range.start);
  }
  disabled(s:GridSlot) {
    return this.saving() || (!s.appointment && (this.offer()?.isOwner || (this.busy(s) && !s.myBookingId)));
  }
  color(s:GridSlot) { return s.appointment ? bookingStatus[s.appointment.status].color : null; }
  name(s:GridSlot) {
    const r = s.appointment;
    if (r) {
      const label = r.cancelledByGuest ? 'Cancelled' : r.proposal && (r.status === 'accepted' || r.status === 'pending') ? 'Proposed change' : bookingStatus[r.status].label;
      return [r.calendarTitle, r.title, this.locale.text(label)].filter(Boolean).join(' · ');
    }
    return s.myBookingId ? this.locale.text('My booking') : this.busy(s) ? this.locale.text('Busy') : s.title || this.locale.text('Available time'); }
  time(s:BookingSlot) {
    const fmt=this.locale.shortTime();
    return s.allDay ? this.locale.text('All-day') : fmt.format(new Date(s.start))+' – '+fmt.format(new Date(s.end));
  }
  hour(n:number) { return this.locale.shortTime().format(new Date(2000,0,1,n)); }
  detail(s:BookingSlot) {
    return [this.title(), s.title, bookingRange(s,this.locale), s.location].filter(Boolean).join(' · ');
  }
  select(s:GridSlot, event:MouseEvent) {
    if (this.disabled(s)) return;
    if (s.appointment) { this.inspect.emit(s.appointment); return; }
    this.tile = event.currentTarget as HTMLButtonElement;
    this.selected.set(s);
  }
}
