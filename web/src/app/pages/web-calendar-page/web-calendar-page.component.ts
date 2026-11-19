import { CalendarAnchoredMenuDirective } from '../../components/calendar-native/calendar-anchored-menu.directive';
import {CalendarSearchFieldComponent} from '../../components/calendar-native/calendar-search-field.component';
import { TimelineGesture, TimelineInterval, minuteOnDay, timelineDay, timelinePlacement } from '../../core/calendar-timeline-gesture';
import {CalendarProviderService} from '../../core/calendar-provider.service';
import {CalendarDetailTimelineComponent} from '../../components/calendar-native/calendar-detail-timeline.component';
import {nativeTimelineLayout,NativeTimedBlock} from '../../core/calendar-timeline-layout';
import {CalendarWeekStripComponent} from '../../components/calendar-native/calendar-week-strip.component';
import {CalendarDateGridComponent} from '../../components/calendar-native/calendar-date-grid.component';
import {CalendarDateTimeComponent} from '../../components/calendar-native/calendar-date-time.component';
import {CalendarRepeatComponent} from '../../components/calendar-native/calendar-repeat.component';
import {
  CalendarNativeTextPipe,
  CalendarNativeDatePipe,
  CalendarLocalization,
} from "../../core/calendar-localization";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  viewChild,
  type TemplateRef,
  computed,
  effect,
  untracked,
  inject,
  signal,
} from "@angular/core";
import { CommonModule, DOCUMENT, isPlatformBrowser } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

import { SeoService, absolute } from "../../core/seo.service";
import { ThemeService } from "../../core/theme.service";
import {
  APP_DEVELOPER,
  SITE_URL,
  isIosQrAuthEnabled,
} from "../../core/app-facts";
import {
  DEFAULT_LOCALE,
  LOCALES,
  Locale,
  linkPath,
  localePath,
} from "../../core/locales";
import {
  CALENDAR_API_BASE,
  CALENDAR_DEBUG_API,
  CalendarPlatformApiService,
  ExternalBusyState,
  WebCalendarEvent,
  DeviceCalendar,
  CalendarRepeatRule,
} from "../../core/calendar-platform-api.service";
import {
  IOS_EVENT_COLORS,
  PositionedTimedBlock,
  computeIosEventStyle,
  isLightEventColor,
  detectBrowserTimeZone,
  downloadIcsFile,
  buildSingleEventIcs,
  generateQrSvgDataUrl,
} from "../../core/ios-event-palette";
import {
  calendarOccurrences,
  CalendarOccurrence,
  calendarSeries,
  wallDate,
  instant,
} from "../../core/calendar-recurrence";
import {
  webEventDetails,
  nativeEventDetails,
  canShareEvent,
} from "../../core/calendar-native-model";
import { CalendarWeatherComponent } from "../../components/calendar-native/calendar-weather.component";
import { CalendarSymbolComponent } from "../../components/calendar-native/calendar-symbol.component";
import { CalendarChoiceComponent } from "../../components/calendar-native/calendar-choice.component";
import { CalendarMenuComponent } from "../../components/calendar-native/calendar-menu.component";
import { CalendarAccountComponent } from "../../components/calendar-native/calendar-account.component";
import {
  CalendarNativeService,
  isWebCalendar,
} from "../../core/calendar-native.service";
import { PlatformAuthCardComponent } from "../../components/platform-auth-card/platform-auth-card.component";
import { CalendarAppleMapsService, EventPlaceSuggestion } from "../../core/calendar-apple-maps.service";
import { CalendarLocationMapComponent } from "../../components/calendar-native/calendar-location-map.component";
import { CalendarForecastService } from "../../core/calendar-forecast.service";
import { Snapshot, WeatherService } from "../../core/weather.service";

type CalendarViewMode =
  | "day"
  | "workweek"
  | "week"
  | "month"
  | "agenda"
  | "year"
  | "multi"
  | "weather"
  | "menu";

interface DragSession {
  mode: TimelineGesture;
  event?: WebCalendarEvent;
  original: TimelineInterval;
  pointerId: number;
  originDayIdx: number;
  startClientX: number;
  startClientY: number;
  anchorY: number;
  anchorX: number;
  width: number;
  visualX: number;
  visualY: number;
  color?: string;
  touch: boolean;
  active: boolean;
  valid: boolean;
  previewDayIdx: number;
  preview: TimelineInterval;
}

interface EventDraft {
  calendarId?: string;
  expectedUpdatedAt?: string;
  id: string;
  isNew: boolean;
  title: string;
  color: string;
  allDay: boolean;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  timeZone: string;
  availability: "busy" | "free" | "tentative";
  location: string;
  structuredLocation?: NonNullable<WebCalendarEvent["details"]>["structuredLocation"];
  videoCallURL: string;
  notes: string;
  recurrence: "none" | "daily" | "weekly" | "monthly" | "yearly";
  repeatRule?: CalendarRepeatRule;
  repeatInterval: number;
  repeatEdited?: boolean;
  alertsEdited?: boolean;
  repeatUntil: string;
  secondReminderMin: number;
  travelTime: number;
  url: string;
  attachments: NonNullable<
    NonNullable<WebCalendarEvent["details"]>["attachments"]
  >;
  original?: WebCalendarEvent;
  reminderMin: number; // -1 for none
}

const HOUR_PX = 50;

@Component({
  selector: "app-web-calendar-page",
  providers: [
    { provide: CALENDAR_API_BASE, useValue: CALENDAR_DEBUG_API },
    CalendarPlatformApiService, CalendarNativeService, CalendarProviderService, CalendarForecastService,
  ],
  standalone: true,
  imports: [CalendarAnchoredMenuDirective,
    CalendarSearchFieldComponent,
    CalendarLocationMapComponent,CalendarDetailTimelineComponent,CalendarWeekStripComponent,CalendarDateGridComponent,CalendarDateTimeComponent,CalendarRepeatComponent,CalendarNativeTextPipe,
    CalendarNativeDatePipe,
    CommonModule,
    FormsModule,
    PlatformAuthCardComponent,
    CalendarSymbolComponent,
    CalendarChoiceComponent,
    CalendarMenuComponent,
    CalendarAccountComponent,
    CalendarWeatherComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./web-calendar-page.component.html",
  styleUrl: "./web-calendar-page.component.scss",
})
export class WebCalendarPageComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  readonly headerAction = viewChild<TemplateRef<unknown>>("accountAction");
  readonly accountPanel = viewChild(CalendarAccountComponent);
  @ViewChild("timelineScroll") timelineScrollRef?: ElementRef<HTMLElement>;
  @ViewChild("daysColumnsEl") daysColumnsRef?: ElementRef<HTMLElement>;

  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly zone = inject(NgZone);
  private readonly doc = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  readonly api = inject(CalendarPlatformApiService);

  readonly colors = IOS_EVENT_COLORS;
  private readonly localization = inject(CalendarLocalization);
  readonly hours = Array.from({ length: 25 }, (_, i) => i);
  readonly hourPx = HOUR_PX;

  protected locale: Locale = DEFAULT_LOCALE;

  // Workspace UI signals
  private readonly themeService = inject(ThemeService);
  private readonly weatherService = inject(WeatherService);
  readonly viewMode = signal<CalendarViewMode>("month");
  private readonly forecastSource = inject(CalendarForecastService);
  private readonly forecast = signal<Snapshot | null>(null);
  private readonly forecastRefreshPeriod = computed(() => Math.floor(this.nowTick().getTime() / 600000));
  readonly dailyForecast = computed(() => new Map(this.forecast()?.daily.slice(0, 10).map(d => [d.instant ? this.dayKey(new Date(d.instant)) : d.iso, d])));
  readonly timelineWeather = computed(() => {
    const day = this.anchorDate();
    const today = timelineDay(this.nowTick());
    const snapshot = this.forecast();
    if (!snapshot || !['day', 'multi'].includes(this.viewMode()) || timelineDay(day) < today || timelineDay(day) >= timelineDay(today, 10)) return [];
    const zone = snapshot.place.timezone;
    const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const dayKey = this.dayKey(day);
    const byHour = new Map<number, {hour: number; temperature: number; symbol: string}>();
    for (const h of snapshot.forecastHours ?? []) {
      if (!Number.isFinite(h.temperature) || !h.symbol) continue;
      let hour: number;
      if (!zone || zone === 'auto' || zone === localZone) {
        if (!h.iso.startsWith(dayKey)) continue;
        hour = Number(h.iso.slice(11, 13));
      } else {
        const date = h.instant ? new Date(h.instant) : instant(new Date(h.iso + 'Z'), zone);
        if (!date || this.dayKey(date) !== dayKey) continue;
        hour = date.getHours();
      }
      byHour.set(hour, {hour, temperature: Math.round(h.temperature), symbol: h.symbol});
    }
    return [...byHour.values()];
  });
  dayForecast(date: Date) { return this.dailyForecast().get(this.dayKey(date)); }
  timelineSymbol(name: string, hourly = false) {
    const light = this.surfaceTheme() === 'light';
    const variant = light && hourly && ['moon.stars', 'cloud.moon'].includes(name) ? 'hourly-' : '';
    return '/icons/calendar-native/weather/' + (light ? 'timeline-light/' : '') + variant + name + '.png';
  }

  readonly native = inject(CalendarNativeService);
  readonly providerWorkspace=inject(CalendarProviderService);
  readonly modes = [
    { value: "day", label: "Day", symbol: "calendar.day.timeline.leading" },
    { value: "week", label: "MultiDay", symbol: "distribute.horizontal.left" },
    { value: "month", label: "Month", symbol: "calendar" },
    { value: "year", label: "Year", symbol: "12.lane" },
    { value: "agenda", label: "List", symbol: "list.bullet" },
    { value: "multi", label: "MultiCalendar", symbol: "align.vertical.top" },
    { value: "weather", label: "Weather", symbol: "cloud.sun" },
  ];
  readonly modePicker = signal(false);
  readonly viewport = signal({width:1280,height:800,touch:false});
  readonly isDesktop = computed(
    () => !this.viewport().touch && this.viewport().width >= 768,
  );
  readonly isPhone = computed(() => this.viewport().width < 768);
  readonly showsSidebar = computed(() =>
    this.isDesktop()
      ? this.viewport().width >= 900
      : !this.isPhone() &&
        this.viewport().width > this.viewport().height &&
        this.viewport().width >= 900,
  );
  readonly drawerOpen = signal(false);
  readonly drawerDrag = signal(0);
  readonly drawerHeight = computed(() => {const base=this.drawerOpen()?this.viewport().height*.8-60:26;return Math.max(26,Math.min(this.viewport().height-110,base-this.drawerDrag()));});
  private drawerStart: {y:number;open:boolean}|null = null;
  readonly sidebarMonth = signal(new Date());
  private lastCalendarMode: CalendarViewMode = "month";
  private readonly onWindowResize = () => this.updateViewport();
  updateViewport() {
    if (!this.isBrowser || typeof window === "undefined") return;
    this.viewport.set({
      width: window.innerWidth,
      height: window.innerHeight,
      touch:
        typeof matchMedia !== "undefined" &&
        matchMedia("(pointer:coarse)").matches,
    });
    if (!this.isDesktop() && this.viewMode() === "menu") {
      this.viewMode.set(this.lastCalendarMode);
      this.drawerOpen.set(true);
    }
  }
  toggleMenu() { if (this.isDesktop()) this.setView(this.viewMode()==='menu'?this.lastCalendarMode:'menu'); else this.drawerOpen.update(v=>!v); }
  drawerPointerDown(event:PointerEvent) { this.drawerStart={y:event.clientY,open:this.drawerOpen()}; (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId); }
  drawerPointerMove(event:PointerEvent) { if(this.drawerStart) this.drawerDrag.set(event.clientY-this.drawerStart.y); }
  drawerPointerUp(event:PointerEvent) { if(!this.drawerStart)return;const delta=event.clientY-this.drawerStart.y;this.drawerOpen.set(Math.abs(delta)<12?!this.drawerStart.open:delta<0);this.drawerStart=null;this.drawerDrag.set(0); }
  bottomToday() { this.jumpToday();this.setView('day');this.drawerOpen.set(false); }
  readonly searchOpen = signal(false);
  readonly searchText = signal("");
  readonly selectedEvent = signal<WebCalendarEvent | null>(null);
  readonly inspectorEvent = signal<WebCalendarEvent | null>(null);
  private pendingTimelineTap: string | null = null;
  readonly moreEventActions = signal(false);
  readonly eventContext = signal<{
    event: WebCalendarEvent;
    x: number;
    y: number;
  } | null>(null);
  readonly multiIDs = signal<Set<string>>(new Set());
  readonly multiCalendars = computed(() => {
    const all = this.allCalendars();
    const ids = this.multiIDs();
    if (!ids.size) return all;
    const picked = all.filter((c) => ids.has(c.id));
    return picked.length ? picked : all;
  });
  readonly dayCount = signal(8);
  readonly rangeOpen = signal(false);
  applyRange(range: {start: string; end: string}) {
    const first = new Date(range.start + 'T00:00:00');
    const last = new Date(range.end + 'T00:00:00');
    this.anchorDate.set(first);
    this.dayCount.set(Math.min(31, Math.round((last.getTime() - first.getTime()) / 86400000) + 1));
  }
  readonly canShare = canShareEvent;
  readonly preferences = signal<Record<string, string>>({});
  readonly firstWeekday = signal(0);
  private dateLocale() {
    const language = this.preferences()["language"];
    return language && language !== "system"
      ? language
      : typeof navigator !== "undefined"
        ? navigator.language
        : "en-US";
  }
  private hour12() {
    const value = this.preferences()["time"];
    return value === "12" ? true : value === "24" ? false : undefined;
  }
  timelineDateLabel(date: Date) {
    const pref = this.preferences()["date"];
    const locale = this.dateLocale();
    const order: Record<string,string> = {dmy:"en-GB",mdy:"en-US",ymd:"sv-SE"};
    const formatter = new Intl.DateTimeFormat(order[pref] || locale, {
      day: order[pref] ? "2-digit" : "numeric", month: order[pref] ? "2-digit" : "numeric"
    });
    return date.toLocaleDateString(locale, {weekday:"short"}) + ", " + formatter.format(date);
  }
  formatShortDate(value: string) {
    const format = this.preferences()["date"];
    return new Intl.DateTimeFormat(
      format === "dmy"
        ? "en-GB"
        : format === "mdy"
          ? "en-US"
          : format === "ymd"
            ? "sv-SE"
            : this.dateLocale(),
    ).format(new Date(value));
  }
  readonly dayNames = computed(() =>
    Array.from(
      { length: 7 },
      (_, i) =>
        ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][
          (i + this.firstWeekday()) % 7
        ],
    ),
  );
  readonly searchResults = computed(() =>
    this.allDisplayEvents()
      .filter((e) =>
        e.title.toLocaleLowerCase(this.dateLocale()).includes(this.searchText().trim().toLocaleLowerCase(this.dateLocale())),
      )
      .sort((a, b) => a.start.localeCompare(b.start)),
  );
  readonly yearMonths = computed(() => {
    const events = this.allDisplayEvents();
    const year = this.anchorDate().getFullYear();
    return Array.from({ length: 12 }, (_, month) => {
      const date = new Date(year, month, 1),
        start = this.startOfWeekMonday(date);
      return {
        date,
        days: Array.from({ length: 42 }, (_, i) => {
          const day = this.addDays(start, i);
          const inMonth = day.getMonth() === month;
          const dots: string[] = [];
          if (inMonth) {
            const sMs = day.getTime(),
              eMs = sMs + 86_400_000;
            for (const ev of events) {
              const s = Date.parse(ev.start),
                e = Date.parse(ev.end);
              if (e > sMs && s < eMs) {
                const c = ev.color || "#0A84FF";
                if (!dots.includes(c)) dots.push(c);
                if (dots.length >= 3) break;
              }
            }
          }
          return { day, inMonth, dots };
        }),
      };
    });
  });
  readonly calendarChoices = computed(() =>
    this.writableCalendars().map((c) => ({ value: c.id, label: c.title })),
  );
  readonly repeatChoices = [
    { value: "none", label: "Never" },
    { value: "daily", label: "Every Day" },
    { value: "weekly", label: "Every Week" },
    { value: "monthly", label: "Every Month" },
    { value: "yearly", label: "Every Year" },
    {value:"fortnightly",label:"Every 2 Weeks"},{value:"custom",label:"Custom…"},
  ];
  readonly travelChoices = [
    { value: "0", label: "None" },
    { value: "300", label: "5 minutes" },
    { value: "900", label: "15 minutes" },
    { value: "1800", label: "30 minutes" },
    { value: "3600", label: "1 hour" },
    { value: "5400", label: "1 hour, 30 minutes" },
    { value: "7200", label: "2 hours" },
  ];
  readonly alertChoices = [
    { value: "-1", label: "None" },
    { value: "0", label: "At time of event" },
    { value: "5", label: "5 minutes before" },
    { value: "10", label: "10 minutes before" },
    { value: "15", label: "15 minutes before" },
    { value: "30", label: "30 minutes before" },
    { value: "60", label: "1 hour before" },
    { value: "120", label: "2 hours before" },{ value: "1440", label: "1 day before" },{value:"2880",label:"2 days before"},{value:"10080",label:"1 week before"},
  ];
  readonly shareEvent = signal<WebCalendarEvent | null>(null);
  readonly shareDelivery = signal<"methods" | "qr" | "email">("methods");
  readonly shareLink = signal("");
  readonly shareID = signal("");
  readonly shareBusy = signal(false);
  readonly shareError = signal("");
  readonly invitePeople = signal([{ email: "", access: "reader" }]);
  readonly qrImage = computed(() => generateQrSvgDataUrl(this.shareLink()));
  openShareEvent(event: WebCalendarEvent) {
    this.selectedEvent.set(null);
    this.shareEvent.set(calendarSeries(event));
    this.shareDelivery.set("methods");
    this.shareLink.set("");
    this.shareError.set("");
    this.invitePeople.set([{ email: "", access: "reader" }]);
  }
  async prepareShare(delivery: "qr" | "email" | "link") {
    if (this.shareBusy()) return;
    const event = this.shareEvent();
    if (!event) return;
    this.shareBusy.set(true);
    this.shareError.set("");
    try {
      const shared = await this.native.prepareEvent(event);
      this.shareID.set(shared.id);
      this.shareLink.set(shared.url);
      if (delivery === "link") {
        if (navigator.share)
          await navigator.share({ title: event.title, url: shared.url });
        else this.copyText(shared.url);
      } else this.shareDelivery.set(delivery);
    } catch (e) {
      this.shareError.set(
        e instanceof Error ? e.message : "Could not prepare sharing.",
      );
    } finally {
      this.shareBusy.set(false);
    }
  }
  async sendInvitations() {
    this.shareBusy.set(true);
    this.shareError.set("");
    try {
      await this.native.request(
        `/events/${this.shareID()}/invitations`,
        "POST",
        { eventUrl: this.shareLink(), invitations: this.invitePeople() },
      );
      this.shareEvent.set(null);
      this.showToast("Invitations sent.");
      await this.native.refresh();
    } catch (e) {
      this.shareError.set(
        e instanceof Error ? e.message : "Could not send invitations.",
      );
    } finally {
      this.shareBusy.set(false);
    }
  }
  addInvitePerson() {
    this.invitePeople.update((p) => [...p, { email: "", access: "reader" }]);
  }
  validInvitations() {
    return this.invitePeople().every((p) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email),
    );
  }
  safeLink(value?:string|null){try{const u=new URL(value||'');return ['https:','http:'].includes(u.protocol)?u.href:null;}catch{return null;}}
  eventAlert(event:WebCalendarEvent,index:number){const a=event.details?.alarms?.[index];return a?Math.round(Math.abs(a.relativeOffsetSeconds)/60):-1;}
  recurrenceDescription(event:WebCalendarEvent){const rule=event.details?.recurrenceRules?.[0];if(!rule)return '';const labels={daily:'day',weekly:'week',monthly:'month',yearly:'year'};const n=rule.interval||1;return `Every ${n>1?n+' ':''}${labels[rule.frequency]}${n>1?'s':''}`;}
  async updateDetailAlert(event:WebCalendarEvent,index:number,value:number){const alarms=[this.eventAlert(event,0),this.eventAlert(event,1)];alarms[index]=value;if(index===0&&value<0)alarms[1]=-1;await this.updateDetail(event,{alarms:[...new Set(alarms.filter(m=>m>=0))].map(m=>({relativeOffsetSeconds:-m*60}))});}
  async updateDetail(event: WebCalendarEvent, details: Partial<NonNullable<WebCalendarEvent["details"]>>) {
    if (event.readOnly || this.savingEvent()) return;
    this.savingEvent.set(true);
    try {
      const result = await this.persistEvent(event.id, {
        calendarId: event.calendarId, expectedUpdatedAt: event.updatedAt, ...details,
      }, event);
      await this.applyDetailSave(event, result.event);
    } catch (error) {
      this.handleMutationError(error, "Could not save event.");
    } finally {
      this.savingEvent.set(false);
    }
  }

  private async applyDetailSave(original: WebCalendarEvent, saved: WebCalendarEvent) {
    // The user can dismiss the sheet or select another event during a save.
    this.selectedEvent.update(current => current?.id === original.id ? saved : current);
    this.inspectorEvent.update(current => current?.id === original.id ? saved : current);
    try {
      await this.reloadAllWorkspaceData();
    } catch (error) {
      this.workspaceError.set(error instanceof Error ? error.message : "Could not refresh the calendar.");
    }
  }
  readonly pendingDelete = signal(false);
  readonly detailPendingDelete = signal(false);
  readonly editorPage = signal<"main" | "location" | "recurrence">("main");
  private readonly appleMaps = inject(CalendarAppleMapsService);
  readonly locationResults = signal<EventPlaceSuggestion[]>([]);
  readonly searchingLocation = signal(false);
  private locationSearchSeq = 0;
  private locationTimer?: ReturnType<typeof setTimeout>;

  searchEditorLocation(query: string) {
    this.resetLocationSearch();
    const seq = this.locationSearchSeq;
    const trimmed = query.trim();
    if (trimmed.length < 2) return;
    this.searchingLocation.set(true);
    this.locationTimer = setTimeout(async () => {
      try {
        const places = this.appleMaps.available
          ? await this.appleMaps.suggestions(trimmed, this.isDesktop())
          : (await this.weatherService.search(trimmed)).slice(0, 6).map(place => ({
              title: place.name, subtitle: [place.admin1, place.country].filter(Boolean).join(', '),
              coordinate: {latitude: place.latitude, longitude: place.longitude},
            }));
        if (seq === this.locationSearchSeq) this.locationResults.set(places);
      } catch {
        // The typed address can still be saved if the map service is unavailable.
      } finally {
        if (seq === this.locationSearchSeq) this.searchingLocation.set(false);
      }
    }, 250);
  }

  private resetLocationSearch() {
    ++this.locationSearchSeq;
    clearTimeout(this.locationTimer);
    this.locationResults.set([]);
    this.searchingLocation.set(false);
  }

  openLocationPage(draft: EventDraft) {
    this.editorPage.set('location');
    this.searchEditorLocation(draft.location);
  }

  changeLocation(draft: EventDraft, value: string) {
    draft.location = value;
    draft.structuredLocation = null;
    this.searchEditorLocation(value);
  }

  async pickLocationPlace(place: EventPlaceSuggestion) {
    const draft = this.editorDraft();
    if (!draft) return;
    this.resetLocationSearch();
    const seq = this.locationSearchSeq;
    const title = this.isDesktop() ? place.title : [place.title, place.subtitle].filter(Boolean).join(', ');
    let coordinate = place.coordinate;
    try { coordinate = await this.appleMaps.coordinateFor(place); } catch { /* Keep the selected address. */ }
    if (seq !== this.locationSearchSeq || this.editorDraft() !== draft || this.editorPage() !== 'location') return;
    draft.location = title;
    draft.structuredLocation = {title, latitude: coordinate?.latitude, longitude: coordinate?.longitude, radius: 0};
    draft.videoCallURL = draft.videoCallURL.trim();
    this.editorPage.set('main');
  }

  commitLocationDraft() {
    const d = this.editorDraft();
    if (d) {
      d.location = d.location.trim();
      if (!d.structuredLocation && d.location) d.structuredLocation = {title: d.location, radius: 0};
      d.videoCallURL = d.videoCallURL.trim();
    }
    this.resetLocationSearch();
    this.editorPage.set("main");
  }

  meetingUrlForEvent(event: WebCalendarEvent): string | null {
    const direct = this.safeLink(event.details?.videoCallURL);
    if (direct) return direct;
    const candidates = [event.url ?? event.details?.url, event.details?.notes]
      .filter(Boolean)
      .join("\n");
    if (!candidates) return null;
    const urlMatches = candidates.match(/https?:\/\/[^\s<>")]+/gi) ?? [];
    for (const raw of urlMatches) {
      try {
        const u = new URL(raw);
        const host = u.hostname.toLowerCase();
        if (
          [
            "zoom.us",
            "meet.google.com",
            "teams.microsoft.com",
            "teams.live.com",
            "webex.com",
            "facetime.apple.com",
          ].some((d) => host === d || host.endsWith("." + d))
        ) {
          return u.href;
        }
      } catch {}
    }
    return null;
  }

  async updateEventCalendar(event: WebCalendarEvent, nextCalendarId: string) {
    if (
      event.readOnly ||
      this.savingEvent() ||
      !nextCalendarId ||
      nextCalendarId === event.calendarId
    )
      return;
    this.savingEvent.set(true);
    try {
      const result = await this.persistEvent(event.id, {
        calendarId: nextCalendarId,
        expectedUpdatedAt: event.updatedAt,
      }, event);
      await this.applyDetailSave(event, result.event);
    } catch (error) {
      this.handleMutationError(error, "Could not move event to calendar.");
    } finally {
      this.savingEvent.set(false);
    }
  }

  eventRemovalLabel(event: WebCalendarEvent): string | null {
    if (event.receivedFeedId) return event.receivedAccess === 'owner' ? 'Cancel for Everyone' : 'Remove from My Calendar';
    return event.readOnly ? null : 'Delete';
  }

  private async removeReceivedEvent(event: WebCalendarEvent) {
    const resource = event.receivedAccess === 'owner' ? 'events' : 'received-invites';
    await this.native.request(`/${resource}/${encodeURIComponent(event.id)}`, 'DELETE');
  }

  async deleteEventInstance(event: WebCalendarEvent): Promise<void> {
    const occurrence = event as CalendarOccurrence;
    const masterId = occurrence.occurrenceOf ?? event.id;
    const target: WebCalendarEvent = occurrence.occurrenceOf
      ? {
          ...event,
          id: masterId,
          start: occurrence.masterStart!,
          end: occurrence.masterEnd!,
        }
      : event;
    if (!this.eventRemovalLabel(target) || this.savingEvent()) return;
    this.savingEvent.set(true);
    try {
      if (target.provider) await this.providerWorkspace.deleteEvent(target);
      else if (target.id.startsWith("sharedcal."))
        await this.native.updateCalendarEvent(target, {}, undefined, true);
      else if (target.receivedFeedId)
        await this.removeReceivedEvent(target);
      else {
        await this.api.deleteCalendarEvent(target.id, { notifyGuest: true });
        if (target.calendarId)
          await this.native.syncOwnedCalendar(target.calendarId, target.id);
      }
      await this.reloadAllWorkspaceData();
      this.ownedEvents.update((list) => list.filter((x) => x.id !== target.id));
      this.selectedEvent.set(null);
      this.inspectorEvent.set(null);
      this.detailPendingDelete.set(false);
      this.showToast("Event deleted.");
    } catch (e) {
      this.handleMutationError(e, "Could not delete event.");
    } finally {
      this.savingEvent.set(false);
    }
  }
  nextDate(date: Date) {
    return this.addDays(date, 1);
  }

  setDraftCalendar(draft: EventDraft, id: string) {
    const calendar = this.writableCalendars().find(item => item.id === id);
    if (!calendar) return;
    draft.calendarId = calendar.id;
    draft.color = calendar.color;
  }

  repeatChoice(draft: EventDraft): string {
    const rule = draft.repeatRule;
    if (rule && [rule.daysOfTheWeek, rule.daysOfTheMonth, rule.monthsOfTheYear,
      rule.weeksOfTheYear, rule.daysOfTheYear, rule.setPositions].some(values => values?.length)) return 'custom';
    if (draft.recurrence === 'weekly' && draft.repeatInterval === 2) return 'fortnightly';
    return draft.repeatInterval === 1 ? draft.recurrence : 'custom';
  }

  setRepeatEnd(draft: EventDraft, choice: string) {
    draft.repeatEdited = true;
    if (choice === 'never') {
      draft.repeatUntil = '';
      this.expandedEventDate.set(null);
    } else if (!draft.repeatUntil) {
      const start = new Date(draft.startDate + 'T12:00:00');
      const limit = new Date(start.getFullYear(), start.getMonth() + 2, 0);
      const end = this.isDesktop() ? this.addDays(start, 30) :
        new Date(limit.getFullYear(), limit.getMonth(), Math.min(start.getDate(), limit.getDate()));
      draft.repeatUntil = this.toInputDate(end);
    }
  }

  repeatRule(d:EventDraft):CalendarRepeatRule { return {...d.repeatRule,frequency:d.recurrence==='none'?'daily':d.recurrence,interval:d.repeatInterval}; }
  changeRepeatRule(rule: CalendarRepeatRule) {
    const draft = this.editorDraft();
    if (!draft) return;
    draft.repeatEdited = true;
    draft.repeatRule = rule;
    draft.recurrence = rule.frequency;
    draft.repeatInterval = rule.interval || 1;
  }

  chooseRepeat(value: string) {
    const draft = this.editorDraft();
    if (!draft) return;
    if (value === 'custom') {
      if (draft.recurrence === 'none') {
        draft.recurrence = 'daily';
        draft.repeatEdited = true;
      }
      this.editorPage.set('recurrence');
      return;
    }
    draft.repeatEdited = true;
    draft.repeatInterval = value === 'fortnightly' ? 2 : 1;
    draft.recurrence = (value === 'fortnightly' ? 'weekly' : value) as EventDraft['recurrence'];
    draft.repeatRule = undefined;
    if (value === 'none') {
      draft.repeatUntil = '';
      this.expandedEventDate.set(null);
    }
  }

  setStartPart(key:'startDate'|'startTime',value:string){const d=this.editorDraft();if(!d)return;const before=new Date(d.startDate+'T'+d.startTime),end=new Date(d.endDate+'T'+d.endTime);const duration=Math.max(0,end.getTime()-before.getTime());d[key]=value;const after=new Date(new Date(d.startDate+'T'+d.startTime).getTime()+duration);d.endDate=this.toInputDate(after);d.endTime=this.toInputTime(after);}

  setView(value: string) {
    if (this.monthClickTimer) clearTimeout(this.monthClickTimer);
    this.endMonthDrag();
    this.cancelDrag();
    if(value==='menu'&&!this.isDesktop()){this.drawerOpen.set(true);this.modePicker.set(false);return;}
    if(this.viewMode()!=='menu'&&this.viewMode()!=='weather')this.lastCalendarMode=this.viewMode();
    this.viewMode.set(value as CalendarViewMode);
    this.drawerOpen.set(false);this.searchOpen.set(false);this.searchText.set('');this.rangeOpen.set(false);
    this.modePicker.set(false);
    if (this.isBrowser) localStorage.setItem("cc.mac.view", value);
    if (["day", "week", "multi"].includes(value))
      setTimeout(() => this.scrollToWorkingHours(), 0);
  }
  toggleMulti(id: string) {
    this.multiIDs.update((previous) => {
      const next = new Set(previous);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    if (this.isBrowser && typeof localStorage !== "undefined") {
      localStorage.setItem("cc.mac.multi", JSON.stringify([...this.multiIDs()]));
    }
  }
  readPreferences() {
    if (!this.isBrowser || typeof localStorage === "undefined") return;
    try {
      const prefs = JSON.parse(
        localStorage.getItem("cc.mac.preferences") || "{}",
      );
      this.preferences.set(prefs);
      this.firstWeekday.set(Number(prefs.firstWeekday ?? 0));
    } catch {}
  }
  selectEvent(event: WebCalendarEvent) {
    this.inspectorEvent.set(event);
    if (!this.isDesktop()) this.showEvent(event);
  }
  activateEvent(event: WebCalendarEvent) {
    if (event.readOnly) this.showEvent(event);
    else this.openEditEventModal(event);
  }
  showEvent(event: WebCalendarEvent) {
    const shared = this.native.received().find((e) => e.id === event.id);
    if (shared)
      event = {
        ...event,
        receivedFeedId: shared.feedId,
        receivedAccess: shared.access,
        readOnly: event.readOnly || (shared.access !== "writer" && shared.access !== "owner"),
      };
    this.detailPendingDelete.set(false);
    this.selectedEvent.set(event);
    this.inspectorEvent.set(event);
    this.eventContext.set(null);
  }
  timedEventClick(event: WebCalendarEvent, input: Event) {
    if (this.isDesktop()) {
      if (input instanceof KeyboardEvent || (input instanceof MouseEvent && input.detail === 0)) {
        input.preventDefault();
        this.showEvent(event);
      }
      return;
    }
    if (input instanceof MouseEvent && input.detail !== 0 && this.pendingTimelineTap !== event.id) return;
    this.pendingTimelineTap = null;
    this.openEventActions(event, input);
  }

  contextEvent(event: WebCalendarEvent, input: MouseEvent) {
    input.preventDefault();
    input.stopPropagation();
    // Browsers synthesize contextmenu during a touch hold. The timeline owns that drag.
    if (this.drag()?.touch || this.monthPointer?.touch || (input as PointerEvent).pointerType === 'touch') return;
    this.openEventActions(event, input);
  }

  private openEventActions(event: WebCalendarEvent, input: Event) {
    input.preventDefault();
    input.stopPropagation();
    const rect = (input.currentTarget as HTMLElement).getBoundingClientRect();
    const point = input instanceof MouseEvent && (input.clientX || input.clientY)
      ? {x: input.clientX, y: input.clientY}
      : {x: rect.left + rect.width / 2, y: rect.top + rect.height / 2};
    this.inspectorEvent.set(event);
    this.moreEventActions.set(false);
    this.eventContext.set({event, ...point});
  }
  @HostListener("document:click") closeMenus() {
    this.rangeOpen.set(false);
    this.modePicker.set(false);
  }
  @HostListener("document:keydown.escape") closeOverlays() {
    if (this.rangeOpen()) { this.rangeOpen.set(false); return; }
    this.cancelDrag();
    this.modePicker.set(false);
    this.eventContext.set(null);
    this.selectedEvent.set(null);
    this.closeEditor();
  }

  readonly surfaceTheme = this.themeService.theme;
  readonly isLightColor = isLightEventColor;
  readonly authReady = signal(false);
  readonly iosQrEnabled = signal(isIosQrAuthEnabled());
  readonly loadingWorkspace = signal(false);
  readonly workspaceError = signal("");
  private stateVersion = 0;
  private workspaceSession: string | null = null;

  constructor() {
    effect(onCleanup => {
      if (!this.isBrowser || !this.api.isSignedInWithAccount() || !['day', 'multi', 'week', 'workweek'].includes(this.viewMode())) return;
      const selected = this.forecastSource.selectedPlace();
      const units = this.preferences()['units'];
      const locale = this.localization.locale();
      this.forecastRefreshPeriod();
      let active = true;
      onCleanup(() => { active = false; });
      void (async () => {
        const place = selected ?? await this.forecastSource.timelinePlace();
        if (!active) return;
        const result = place ? await this.forecastSource.load(place, units, locale) : null;
        if (active) this.forecast.set(result);
      })().catch(() => { if (active) this.forecast.set(null); });
    });
    effect(() => {
      const session = this.api.isSignedInWithAccount() ? this.api.token() : null;
      if (!this.isBrowser || this.workspaceSession === session) return;
      this.workspaceSession = session;
      untracked(() => {
        this.clearWorkspace();
        if (session) void this.bootstrapSession();
      });
    });
  }
  private lastSharingRefresh = 0;
  readonly toast = signal<string | null>(null);
  private toastTimer: any = null;
  private clockTimer: any = null;
  private liveSyncTimer: any = null;
  private liveSyncInFlight = false;
  private lastLiveSyncAt = 0;
  private readonly onVisibilityOrFocus = () => {
    if (
      typeof document !== "undefined" &&
      document.visibilityState === "visible"
    ) {
      const elapsed = Date.now() - this.lastLiveSyncAt;
      if (elapsed >= 10_000) {
        this.pollLiveCalendarUpdates(elapsed >= 45_000).catch(() => null);
      }
    }
  };

  // Calendar Data
  readonly anchorDate = signal<Date>(this.startOfLocalDay(new Date()));
  readonly nowTick = signal<Date>(new Date());
  readonly ownedEvents = signal<WebCalendarEvent[]>([]);
  readonly sharedEvents = signal<WebCalendarEvent[]>([]);
  readonly externalBusy = signal<ExternalBusyState>({
    updatedAt: null,
    sources: {},
    events: [],
  });
  readonly calendarTimeZone = signal<string>(detectBrowserTimeZone());
  readonly deviceCalendars = signal<DeviceCalendar[]>([]);
  readonly hiddenCalendarIDs = signal<Set<string>>(new Set());
  readonly destinationCalendarID = signal("");
  readonly showCalendars = signal(true);
  readonly displayCalendars = computed(() =>
    [...this.deviceCalendars(), ...this.providerWorkspace.calendars()].map((c) => ({
      ...c,
      color: this.native.colorOverrides()[c.id] ?? c.color,
    })),
  );
  readonly allCalendars = computed(() => [
    ...this.displayCalendars(),
    ...this.native
      .sharedCalendars()
      .map((c) => ({
        ...c,
        color: this.native.colorOverrides()[c.id] ?? c.color,
        source: "Shared with me",
        allowsChanges: c.access !== "reader" && !c.isRevoked,
      })),
  ]);
  readonly writableCalendars = computed(() =>
    this.allCalendars().filter((c) => c.allowsChanges),
  );
  readonly calendarGroups = computed(() =>
    [...new Set(this.deviceCalendars().map((c) => c.source))].map((source) => ({
      source,
      calendars: this.deviceCalendars().filter((c) => c.source === source),
    })),
  );
  toggleCalendar(id: string): void {
    if (id === "*") {
      this.hiddenCalendarIDs.set(
        this.hiddenCalendarIDs().size
          ? new Set()
          : new Set(this.allCalendars().map((c) => c.id)),
      );
      return;
    }
    this.hiddenCalendarIDs.update((previous) => {
      const next = new Set(previous);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
  chooseDestination(id: string): void {
    this.destinationCalendarID.set(id);
    if (this.isBrowser)
      localStorage.setItem(
        "calendarDestination." + (this.api.profile()?.email ?? ""),
        id,
      );
  }
  private updateCalendars(calendars: DeviceCalendar[]): void {
    calendars = calendars.filter(isWebCalendar);
    this.deviceCalendars.set(calendars);
    const saved =
      this.destinationCalendarID() ||
      (this.isBrowser
        ? localStorage.getItem(
            "calendarDestination." + (this.api.profile()?.email ?? ""),
          )
        : "");
    this.destinationCalendarID.set(
      calendars.find((c) => c.id === saved && c.allowsChanges)?.id ??
        calendars.find((c) => c.allowsChanges)?.id ??
        "",
    );
  }

  // Pointer Drag State
  readonly drag = signal<DragSession | null>(null);
  readonly monthDragEventId = signal<string | null>(null);
  readonly monthDropTargetKey = signal<string | null>(null);

  // Event Modal Editor
  readonly expandedEventDate = signal<string | null>(null);
  readonly editorDraft = signal<EventDraft | null>(null);
  readonly savingEvent = signal(false);

  // External ICS input
  readonly icsFeedInput = signal("");
  readonly syncingExternal = signal<string | null>(null);
  readonly syncFeedback = signal<string | null>(null);

  // Navigation Links (trailing-slash compliant for postbuild)
  readonly homeHref = computed(() => linkPath(this.locale, "/"));
  readonly adminHref = computed(() => linkPath(this.locale, "/admin"));

  // Unified display events across owned + shared + external busy
  private readonly calendarOccurrences = computed<WebCalendarEvent[]>(() => {
    const calendars = new Map(this.displayCalendars().map(c => [c.id, c]));
    const receivedCopies = new Map(this.native.received()
      .filter(e => e.localEventIdentifier)
      .map(e => [e.localEventIdentifier!, e]));
    const sharedById = new Map(this.sharedEvents().map(event => [event.id, event]));
    const copiedShared = new Set<string>();
    const owned = this.ownedEvents()
      .filter(
        (e) =>
          e.status !== "cancelled" &&
          (!e.calendarId ||
            calendars.has(e.calendarId)) &&
          (!e.calendarId || !this.hiddenCalendarIDs().has(e.calendarId)),
      )
      .map((e) => {
        const calendar = e.calendarId ? calendars.get(e.calendarId) : undefined;
        const prefix = `native.${e.calendarId}.`;
        const copy = e.id.startsWith(prefix) ? receivedCopies.get(e.id.slice(prefix.length)) : undefined;
        if (copy) copiedShared.add(copy.id);
        return {
          ...e,
          ...(copy ? {
            ...(sharedById.get(copy.id) ?? copy),
            id: copy.id, calendarId: e.calendarId, receivedFeedId: copy.feedId,
          } : {}),
          color: this.native.colorOverrides()[e.calendarId ?? ""] ?? e.color,
          sourceKind: copy ? "shared" as const : "owned" as const,
          receivedAccess: copy?.access ?? e.receivedAccess,
          readOnly: e.readOnly === true || calendar?.allowsChanges === false || calendar?.available === false ||
            (copy ? (copy.access ?? "reader") === "reader" : e.receivedAccess === "reader"),
        };
      }).filter(e => e.status !== "cancelled");
    const shared = this.sharedEvents()
      .filter((e) => e.status !== "cancelled")
      .map((e) => ({
        ...e,
        sourceKind: "shared" as const,
        readOnly: e.readOnly === true || (e.receivedAccess ?? "reader") === "reader",
      }));
    const connections = this.api.profile()?.connectedProviders;
    const ext = (this.externalBusy().events ?? []).filter(b =>
      !this.providerWorkspace.loaded().has(b.source) &&
      ((b.source !== "google" && b.source !== "microsoft") || connections?.[b.source]?.connected)
    ).map((b) => ({
      id: b.id,
      title: b.title,
      start: b.start,
      end: b.end,
      allDay: b.allDay,
      color: b.color || "#64748B",
      sourceKind: "external" as const,
      externalSource: b.source,
      readOnly: true,
    }));
    const receivedCalendarEvents = this.native
      .sharedCalendars()
      .filter((c) => !this.hiddenCalendarIDs().has(c.id))
      .flatMap((c) =>
        (c.events ?? []).map((e) => ({
          ...e,
          details: webEventDetails(e.details),
          id: `sharedcal.${c.id}.${e.id}`,
          calendarId: c.id,
          calendarTitle: c.title,
          receivedAccess: c.access,
          sharedCalendarRevision: c.eventsUpdatedAt,
          color: this.native.colorOverrides()[c.id] ?? c.color,
          readOnly: e.readOnly === true || (c.access ?? "reader") === "reader" || c.isRevoked === true,
          sourceKind: "shared" as const,
        })),
      );
    const events = [
      ...this.providerWorkspace.events().filter(e=>!this.hiddenCalendarIDs().has(e.calendarId||'')),
      ...owned,
      ...shared.filter((e) => !copiedShared.has(e.id)),
      ...receivedCalendarEvents,
      ...ext.filter(
        (e) =>
          !owned.some(
            (o) =>
              o.title === e.title &&
              o.start === e.start &&
              o.end === e.end &&
              this.deviceCalendars().some(
                (c) =>
                  c.id === o.calendarId &&
                  c.source.toLowerCase().includes(e.externalSource ?? "__none"),
              ),
          ),
      ),
    ];
    const anchor = this.anchorDate(),
      now = this.nowTick();
    const lower = new Date(
        Math.min(
          new Date(anchor.getFullYear(), 0, 1).getTime(),
          now.getTime() - 86400000,
        ),
      ),
      upper = new Date(
        Math.max(
          new Date(anchor.getFullYear() + 1, 0, 1).getTime(),
          now.getTime() + 90 * 86400000,
        ),
      );
    return events.flatMap((event) => calendarOccurrences(event, lower, upper));
  });

  private readonly pendingTimelineEdit = signal<Pick<WebCalendarEvent, "id" | "start" | "end" | "allDay"> | null>(null);
  readonly allDisplayEvents = computed(() => {
    const events = this.calendarOccurrences();
    const pending = this.pendingTimelineEdit();
    return pending ? events.map(event => event.id === pending.id ? { ...event, ...pending } : event) : events;
  });

  // Visible columns for Day / Workweek / Week
  readonly visibleDays = computed<Date[]>(() => {
    const anchor = this.anchorDate();
    const mode = this.viewMode();
    if (mode === "day") return [anchor];
    if (mode === "multi") return this.multiCalendars().map(() => anchor);
    if (mode === "week")
      return Array.from({ length: this.dayCount() }, (_, i) =>
        this.addDays(anchor, i),
      );
    const monday = this.startOfWeekMonday(anchor);
    const count = mode === "workweek" ? 5 : this.dayCount();
    return Array.from({ length: count }, (_, i) => this.addDays(monday, i));
  });

  readonly headerRangeLabel = computed(() => {
    const anchor = this.anchorDate();
    const mode = this.viewMode();
    if (mode === "year") return String(anchor.getFullYear());
    if (mode === "month") {
      return new Intl.DateTimeFormat(this.dateLocale(), {
        month: "long",
        year: "numeric",
      }).format(anchor);
    }
    if (mode === "day" || mode === "multi") {
      return new Intl.DateTimeFormat(this.dateLocale(), {
        weekday: "short",
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(anchor);
    }
    const days = this.visibleDays();
    const first = days[0];
    const last = days[days.length - 1];
    const m1 = new Intl.DateTimeFormat(this.dateLocale(), {
      month: "short",
      day: "numeric",
    }).format(first);
    if (
      first.getMonth() === last.getMonth() &&
      first.getFullYear() === last.getFullYear()
    ) {
      return `${m1} – ${last.getDate()}, ${last.getFullYear()}`;
    }
    const m2 = new Intl.DateTimeFormat(this.dateLocale(), {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(last);
    return `${m1} – ${m2}`;
  });

  // Mini month 42 cells for sidebar
  readonly miniMonthDays = computed(() => {
    const anchor = this.sidebarMonth();
    const firstOfMonth = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
    const gridStart = this.startOfWeekMonday(firstOfMonth);
    const todayKey = this.dayKey(this.nowTick());
    const anchorKey = this.dayKey(this.anchorDate());
    const events = this.allDisplayEvents();

    return Array.from({ length: 42 }, (_, idx) => {
      const date = this.addDays(gridStart, idx);
      const key = this.dayKey(date);
      const dayStartMs = date.getTime();
      const dayEndMs = this.addDays(date, 1).getTime();
      const dots: string[] = [];
      for (const ev of events) {
        const s = Date.parse(ev.start);
        const e = Date.parse(ev.end);
        if (e > s && e > dayStartMs && s < dayEndMs) {
          if (!dots.includes(ev.color || "#0A84FF"))
            dots.push(ev.color || "#0A84FF");
        }
      }
      return {
        date,
        key,
        dayNum: date.getDate(),
        inMonth: date.getMonth() === anchor.getMonth(),
        isToday: key === todayKey,
        isSelected: key === anchorKey,
        dots,
      };
    });
  });

  // Month view 42 cells with events
  readonly monthGridCells = computed(() => {
    const anchor = this.anchorDate();
    const firstOfMonth = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
    const gridStart = this.startOfWeekMonday(firstOfMonth);
    const todayKey = this.dayKey(this.nowTick());
    const events = this.allDisplayEvents();

    return Array.from({ length: 42 }, (_, idx) => {
      const date = this.addDays(gridStart, idx);
      const key = this.dayKey(date);
      const dayStartMs = date.getTime();
      const dayEndMs = dayStartMs + 86_400_000;
      const cellEvents = events
        .filter((ev) => {
          const s = Date.parse(ev.start);
          const e = Date.parse(ev.end);
          return e > dayStartMs && s < dayEndMs;
        })
        .sort((a, b) => Date.parse(a.start) - Date.parse(b.start));

      return {
        date,
        key,
        dayNum: date.getDate(),
        inMonth: date.getMonth() === anchor.getMonth(),
        isToday: key === todayKey,
        events: cellEvents.slice(0, 3),
        moreCount: Math.max(0, cellEvents.length - 3),
      };
    });
  });

  // Up Next event in sidebar
  readonly upNextEvent = computed(() => {
    const nowMs = this.nowTick().getTime();
    return (
      this.allDisplayEvents()
        .filter((e) => !e.allDay && Date.parse(e.end) > nowMs)
        .sort((a, b) => Date.parse(a.start) - Date.parse(b.start))[0] ?? null
    );
  });

  private buildSegmentedListGroups(events: WebCalendarEvent[]) {
    const todayKey = this.dayKey(this.nowTick());
    const now = this.nowTick();
    const minMs = new Date(now.getFullYear() - 1, now.getMonth(), 1).getTime();
    const maxMs = new Date(now.getFullYear() + 3, now.getMonth(), 1).getTime();
    const map = new Map<
      string,
      {
        key: string;
        date: Date;
        isToday: boolean;
        label: string;
        rows: Array<{
          event: WebCalendarEvent;
          allDayLabel: boolean;
          endsOnly: boolean;
          timeTop: string;
          timeBottom: string;
        }>;
      }
    >();

    const sorted = [...events].sort((a, b) => a.start.localeCompare(b.start));
    for (const ev of sorted) {
      const sMs = Date.parse(ev.start);
      const eMs = Date.parse(ev.end);
      if (!Number.isFinite(sMs) || !Number.isFinite(eMs) || eMs < minMs || sMs > maxMs)
        continue;
      const firstDay = this.startOfLocalDay(new Date(Math.max(minMs, sMs)));
      const endInstant = new Date(Math.min(maxMs, Math.max(sMs, eMs - 1)));
      const lastDay = this.startOfLocalDay(endInstant);
      let cursor = firstDay;
      let guard = 0;
      while (cursor.getTime() <= lastDay.getTime() && guard++ < 400) {
        const key = this.dayKey(cursor);
        if (!map.has(key)) {
          map.set(key, {
            key,
            date: cursor,
            isToday: key === todayKey,
            label: new Intl.DateTimeFormat(this.dateLocale(), {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            }).format(cursor),
            rows: [],
          });
        }
        const isFirst = key === this.dayKey(this.startOfLocalDay(new Date(sMs)));
        const isLast = key === this.dayKey(this.startOfLocalDay(new Date(Math.max(sMs, eMs - 1))));
        const isSingleDay = isFirst && isLast;
        const allDayLabel = Boolean(ev.allDay) || (!isFirst && !isLast);
        const endsOnly = !allDayLabel && !isSingleDay && isLast;
        map.get(key)!.rows.push({
          event: ev,
          allDayLabel,
          endsOnly,
          timeTop: allDayLabel
            ? "all-day"
            : endsOnly
              ? "Ends"
              : this.formatEventClock(ev.start),
          timeBottom:
            allDayLabel || (!isSingleDay && isFirst)
              ? ""
              : this.formatEventClock(ev.end),
        });
        cursor = this.addDays(cursor, 1);
      }
    }
    return [...map.values()].sort((a, b) => a.key.localeCompare(b.key));
  }

  // Agenda / List grouped days (MacTabletEventList parity)
  readonly agendaGroups = computed(() =>
    this.buildSegmentedListGroups(this.allDisplayEvents()),
  );
  readonly searchGroups = computed(() =>
    this.buildSegmentedListGroups(this.searchResults()),
  );

  readonly timelineIncludesToday = computed(() => this.visibleDays().some(day => this.isTodayDay(day)));
  readonly currentMinute = computed(() => {
    const now = this.nowTick();
    return now.getHours() * 60 + now.getMinutes();
  });
  readonly currentTimeTopPx = computed(() => this.currentMinute() * HOUR_PX / 60);
  readonly currentTimeLabel = computed(() => this.formatEventClock(this.nowTick().getTime()));
  showsHourLabel(hour: number): boolean {
    return !this.timelineIncludesToday() || Math.abs(hour * 60 - this.currentMinute()) >= 15;
  }

  async ngOnInit(): Promise<void> {
    this.updateViewport();
    if (this.isBrowser) {
      try {
        const saved = localStorage.getItem("cc.mac.view");
        if (
          saved &&
          [...this.modes.map((m) => m.value), "menu"].includes(saved)
        )
          this.viewMode.set(saved as CalendarViewMode);
        this.multiIDs.set(
          new Set(JSON.parse(localStorage.getItem("cc.mac.multi") || "[]")),
        );
      } catch {}
      this.updateViewport();
      this.readPreferences();
    }

    this.locale =
      (this.route.snapshot.data["locale"] as Locale) ?? DEFAULT_LOCALE;
    const calPath = localePath(this.locale, "/calendar");
    const calTitle = "Cloud Calendars Web Studio — Free Online Calendar";
    const calDesc =
      "Free drag-and-drop web calendar synced with Google Calendar, Microsoft Outlook, and Cloud Calendars on iOS.";
    this.seo.apply({
      title: calTitle,
      description: calDesc,
      path: calPath,
      locale: this.locale,
      robots: "index,follow",
      alternates: LOCALES.map((l) => ({
        hreflang: l.hreflang,
        path: localePath(l, "/calendar"),
      })),
    });
    this.doc.getElementById("web-calendar-jsonld")?.remove();
    const ld = this.doc.createElement("script");
    ld.id = "web-calendar-jsonld";
    ld.type = "application/ld+json";
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Cloud Calendars Web Studio",
      url: absolute(calPath),
      inLanguage: this.locale.hreflang,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web, macOS, Windows, iOS, iPadOS, Android",
      description: calDesc,
      author: { "@type": "Organization", name: APP_DEVELOPER, url: SITE_URL },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        name: "Free Web Calendar",
      },
    });
    this.doc.head.appendChild(ld);

    if (!this.isBrowser) return;
    this.iosQrEnabled.set(isIosQrAuthEnabled());

    const qp = this.route.snapshot.queryParamMap;
    // If this window is the Microsoft OAuth PKCE popup landing back on `/calendar/?code=...&state=ms_...`,
    // relay the result immediately to `window.opener` and skip workspace/anonymous session creation!
    const oauthState = qp.get("state") || "";
    if (oauthState.startsWith("ms_") && (qp.has("code") || qp.has("error"))) {
      try {
        window.opener?.postMessage(
          {
            type: "cc_ms_oauth_callback",
            code: qp.get("code"),
            error: qp.get("error"),
            errorDescription: qp.get("error_description"),
            state: oauthState,
          },
          window.location.origin,
        );
        window.close();
      } catch {
        // Parent polling fallback will close the popup
      }
      return;
    }

    // Tick current red time line every 30s
    this.clockTimer = setInterval(() => {
      this.nowTick.set(new Date());
      this.deliverEventAlerts();
    }, 30_000);

    await this.api.ensureInitialized();
    this.authReady.set(true);


    // Lightweight visibility-aware live sync while user is viewing the site (20s active interval, 0 requests when hidden)
    document.addEventListener("visibilitychange", this.onVisibilityOrFocus);
    window.addEventListener("resize", this.onWindowResize);
    this.zone.runOutsideAngular(() => document.addEventListener("pointermove", this.onGlobalPointerMove));
    window.addEventListener("touchmove",this.preventHeldTouchScroll,{passive:false});
    window.addEventListener("focus", this.onVisibilityOrFocus);
    this.liveSyncTimer = setInterval(() => {
      if (
        typeof document !== "undefined" &&
        document.visibilityState === "visible" &&
        this.api.isSignedInWithAccount()
      ) {
        this.pollLiveCalendarUpdates(false).catch(() => null);
      }
    }, 20_000);
  }

  private deliveredAlerts = new Set<string>();
  private deliverEventAlerts() {
    if (
      this.preferences()["eventNotifications"] !== "true" ||
      !this.api.isSignedInWithAccount() ||
      !("Notification" in window) ||
      Notification.permission !== "granted"
    )
      return;
    const now = Date.now();
    for (const event of this.allDisplayEvents()) {
      if (event.status === "cancelled") continue;
      for (const alarm of event.details?.alarms ?? []) {
        const when =
            Date.parse(event.start) +
            alarm.relativeOffsetSeconds * 1000 -
            (event.details?.travelTime ?? 0) * 1000,
          key = event.id + ":" + when;
        if (
          now >= when &&
          now - when < 30000 &&
          !this.deliveredAlerts.has(key)
        ) {
          this.deliveredAlerts.add(key);
          const notification = new Notification(event.title, {
            body:
              this.formatEventTimeSpan(event) +
              (event.location ? " · " + event.location : ""),
            tag: key,
            icon: "/favicon-32x32.png",
          });
          notification.onclick = () => {
            window.focus();
            this.showEvent(event);
            notification.close();
          };
        }
      }
    }
  }
  ngOnDestroy(): void {
    if (this.monthClickTimer) clearTimeout(this.monthClickTimer);
    this.resetLocationSearch();
    this.cancelDrag();
    if (this.isBrowser && typeof window !== "undefined") {
      window.removeEventListener("resize", this.onWindowResize);
      document.removeEventListener("pointermove", this.onGlobalPointerMove);
      window.removeEventListener("touchmove", this.preventHeldTouchScroll);
    }
    this.doc.getElementById("web-calendar-jsonld")?.remove();
    if (this.toastTimer) clearTimeout(this.toastTimer);
    if (this.clockTimer) clearInterval(this.clockTimer);
    if (this.liveSyncTimer) clearInterval(this.liveSyncTimer);
    if (this.isBrowser && typeof document !== "undefined") {
      document.removeEventListener(
        "visibilitychange",
        this.onVisibilityOrFocus,
      );
      window.removeEventListener("focus", this.onVisibilityOrFocus);
    }
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.iosQrEnabled.set(isIosQrAuthEnabled());
    if (this.api.isSignedInWithAccount()) {
      setTimeout(() => this.scrollToWorkingHours(), 120);
    }
  }

  private scrollToWorkingHours(): void {
    const el = this.timelineScrollRef?.nativeElement;
    if (el) {
      el.scrollTop = Math.max(0, (new Date().getHours() - 2) * HOUR_PX);
    }
  }

  async bootstrapSession(): Promise<void> {
    const token = this.api.token();
    if (!token || this.loadingWorkspace()) return;
    this.loadingWorkspace.set(true);
    this.workspaceError.set("");
    try {
      await this.reloadAllWorkspaceData();
      if (this.api.token() === token) setTimeout(() => this.scrollToWorkingHours(), 80);
    } catch (error) {
      if (this.api.token() === token) this.workspaceError.set(error instanceof Error ? error.message : "Could not load your calendars.");
    } finally {
      if (this.api.token() === token) this.loadingWorkspace.set(false);
    }
  }

  async restoreAccount(): Promise<void> {
    await this.api.ensureInitialized();
  }

  private handleMutationError(e: unknown, fallbackMessage: string): void {
    this.showToast(e instanceof Error ? e.message : fallbackMessage);
  }

  async signOut(): Promise<void> {
    try {
      await this.api.signOutBrowser();
      this.showToast("Signed out.");
    } catch {
      this.showToast("Signed out of this browser. Server confirmation was unavailable.");
    }
  }

  private clearWorkspace(): void {
    ++this.stateVersion;
    this.cancelDrag();
    this.pendingTimelineTap = null;
    this.eventContext.set(null);
    this.loadingWorkspace.set(false);
    this.workspaceError.set("");
    this.native.clear();
    this.providerWorkspace.clear();
    this.selectedEvent.set(null);
    this.inspectorEvent.set(null);
    this.shareEvent.set(null);
    this.closeEditor();
    this.deviceCalendars.set([]);
    this.destinationCalendarID.set("");
    this.hiddenCalendarIDs.set(new Set());
    this.ownedEvents.set([]);
    this.sharedEvents.set([]);
    this.externalBusy.set({ updatedAt: null, sources: {}, events: [] });
  }

  async reloadAllWorkspaceData(): Promise<void> {
    const token = this.api.token();
    const version = ++this.stateVersion;
    const state = await this.api.getCalendarState();
    if (token !== this.api.token() || version !== this.stateVersion) return;
    this.lastSharingRefresh = Date.now();
    void this.native.refresh();
    void this.providerWorkspace.refresh(true);

    this.updateCalendars(state.calendars ?? []);
    this.ownedEvents.set(state.events ?? []);
    this.sharedEvents.set(state.receivedEvents ?? []);
    this.externalBusy.set(
      state.externalBusy ?? { updatedAt: null, sources: {}, events: [] },
    );
    if (state.calendar?.timeZone) {
      this.calendarTimeZone.set(state.calendar.timeZone);
    }
    const existingIcs = state.externalBusy?.sources?.["ics"]?.icsUrl;
    if (existingIcs) {
      this.icsFeedInput.set(existingIcs);
    }
    const inspected = this.inspectorEvent();
    if (
      inspected &&
      !this.allDisplayEvents().some((e) => e.id === inspected.id)
    )
      this.inspectorEvent.set(null);
    this.lastLiveSyncAt = Date.now();
  }

  /**
   * Silent, zero-flicker background sync while the browser tab is active (`visibilityState === 'visible'`).
   * Skips during active drag/save operations.
   */
  private async pollLiveCalendarUpdates(
    forceProviderSync = false,
  ): Promise<void> {
    if (
      this.liveSyncInFlight ||
      this.loadingWorkspace() ||
      Boolean(this.drag()) ||
      this.savingEvent() ||
      !this.api.isAuthenticated()
    ) {
      return;
    }
    this.liveSyncInFlight = true;
    try {
      const token = this.api.token(), version = this.stateVersion;
      const state = await this.api.getCalendarState({
        sync: forceProviderSync,
      });
      if (token !== this.api.token() || version !== this.stateVersion) return;
      this.workspaceError.set("");

      // Re-check drag/save guard before applying signal updates
      if (this.drag() || this.savingEvent()) return;

      this.updateCalendars(state.calendars ?? []);
      this.ownedEvents.set(state.events ?? []);
      this.sharedEvents.set(state.receivedEvents ?? []);
      this.externalBusy.set(
        state.externalBusy ?? { updatedAt: null, sources: {}, events: [] },
      );
      if (forceProviderSync || Date.now() - this.lastSharingRefresh >= 60_000) {
        this.lastSharingRefresh = Date.now();
        void this.native.refresh();
      }
      void this.providerWorkspace.refresh(forceProviderSync);
      this.lastLiveSyncAt = Date.now();
    } catch {
      // Ignore transient network blips during silent poll
    } finally {
      this.liveSyncInFlight = false;
    }
  }

  // ── Visual Helpers (Exact iOS `EventTimelineColors.swift` math) ──────────

  cardStyle(hex?: string | null, depth = 0) {
    const st = computeIosEventStyle(hex, this.surfaceTheme(),depth);
    return {
      background: st.fill,
      borderColor: st.borderColor,
      color: st.titleColor,
      "--ev-accent": st.accentBar,
      "--ev-detail": st.detailColor,
    };
  }

  isTodayDay(d: Date): boolean {
    return this.dayKey(d) === this.dayKey(this.nowTick());
  }

  formatHourLabel(h: number): string {
    return this.formatMinutesHm(h * 60);
  }

  private readonly wallClock = computed(() => new Intl.DateTimeFormat(this.dateLocale(), {
    timeZone: "UTC", hour: "numeric", minute: "2-digit", hour12: this.hour12(),
  }));
  private readonly eventClock = computed(() => new Intl.DateTimeFormat(this.dateLocale(), {
    hour: "numeric", minute: "2-digit", hour12: this.hour12(),
  }));
  private readonly intervalClock = computed(() => new Intl.DateTimeFormat(this.dateLocale(), {
    hour: "2-digit", minute: "2-digit", hour12: this.hour12(),
  }));

  formatMinutesHm(totalMinutes: number): string {
    const minute = Math.max(0, Math.min(1440, Math.round(totalMinutes)));
    return this.wallClock().format(Date.UTC(2000, 0, 1, 0, minute));
  }

  formatEventClock(iso: string | number) {
    return this.eventClock().format(new Date(iso));
  }
  timelineVideoLabel(event: WebCalendarEvent): string | undefined {
    const block = event.details?.notes?.split('----( Video Call )----')[1];
    const label = block?.match(/\[([^\]\n]+)\]/)?.[1];
    return label || event.details?.videoCallURL || undefined;
  }

  timelineTimeSpan(event: WebCalendarEvent): string {
    const start = new Date(event.start), end = new Date(event.end);
    if (start.toDateString() === end.toDateString()) return this.formatEventTimeSpan(event);
    const day = new Intl.DateTimeFormat(this.dateLocale(), {
      weekday: this.isDesktop() ? undefined : 'short', month: 'numeric', day: 'numeric',
    });
    return day.format(start) + ' ' + this.formatEventClock(event.start) + ' – '
      + day.format(end) + ' ' + this.formatEventClock(event.end);
  }

  formatEventTimeSpan(ev: WebCalendarEvent): string {
    if (ev.allDay) return this.localization.text("All-day");
    const f = this.intervalClock();
    return `${f.format(new Date(ev.start))} – ${f.format(new Date(ev.end))}`;
  }

  detailDateLines(event: WebCalendarEvent): string[] {
    const timeZone = event.details?.timeZone || this.calendarTimeZone();
    const start = new Date(event.start);
    const end = new Date(Math.max(start.getTime(), Date.parse(event.end) - (event.allDay ? 1 : 0)));
    const date = new Intl.DateTimeFormat(this.dateLocale(), {
      timeZone, weekday: this.isDesktop() ? undefined : 'long', year: 'numeric', month: 'numeric', day: 'numeric',
    });
    const time = new Intl.DateTimeFormat(this.dateLocale(), {
      hour: 'numeric', minute: '2-digit', hour12: this.hour12(), timeZone,
    });
    const startDay = date.format(start);
    const endDay = date.format(end);
    const spansDates = startDay !== endDay;
    if (event.allDay) {
      const dates = spansDates && !this.isDesktop() ? [startDay, endDay] : [startDay];
      return [...dates, this.localization.text('All-day')];
    }
    if (spansDates && !this.isDesktop()) return [startDay, time.format(start), endDay, time.format(end)];
    return [startDay, time.format(start) + ' – ' + time.format(end)];
  }

  formatFullDateTime(iso: string): string {
    return new Intl.DateTimeFormat(this.dateLocale(), {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: this.hour12(),
    }).format(new Date(iso));
  }

  readonly timelineColumns = computed(() => {
    const events = this.allDisplayEvents();
    return this.visibleDays().map((day, index) => {
      const next = timelineDay(day, 1);
      const items = events.filter(event =>
        (this.viewMode() !== 'multi' || event.calendarId === this.multiCalendars()[index]?.id) &&
        Date.parse(event.end) > day.getTime() && Date.parse(event.start) < next.getTime()
      );
      const inputs = items.filter(event => !event.allDay).map(event => ({
        id: event.id, data: event,
        startMinutes: minuteOnDay(Date.parse(event.start), day),
        endMinutes: minuteOnDay(Date.parse(event.end), day),
      }));
      return {
        allDay: items.filter(event => event.allDay),
        timed: nativeTimelineLayout(inputs, {minimumDuration: 22 / HOUR_PX * 60, minimumHeaderDuration: 20 / HOUR_PX * 60, nestedInset: 2}),
      };
    });
  });
  readonly expandedAllDay = signal(false);
  readonly maxAllDay = computed(() => Math.max(0, ...this.timelineColumns().map(c => c.allDay.length)));
  readonly allDayHeight = computed(() => Math.max(36, (this.expandedAllDay() ? this.maxAllDay() : Math.min(3, this.maxAllDay())) * 24 + 8));

  blockPositionStyle(b: NativeTimedBlock<WebCalendarEvent>) {
    return {
      top: (b.startMinutes / 60) * HOUR_PX + 'px',
      height: Math.max(20, (b.endMinutes - b.startMinutes) / 60 * HOUR_PX - 2) + 'px',
      zIndex: b.depth + 1,
      left: 'calc(' + b.leftPct + '% + 2px)', width: 'calc(' + b.widthPct + '% - 4px)',
      ...this.cardStyle(b.data.color, b.depth),
    };
  }

  private holdTimer?: ReturnType<typeof setTimeout>;
  private scrollFrame = 0;
  private pointerFrame = 0;
  private pointer = {x: 0, y: 0};
  private preventHeldTouchScroll = (event: TouchEvent) => {
    if ((this.drag()?.active || this.monthPreview()) && event.cancelable) event.preventDefault();
  };

  startTimelineGesture(ev: PointerEvent, mode: TimelineGesture, index: number, event?: WebCalendarEvent, allDay = false): void {
    if (ev.button !== 0 || !ev.isPrimary || this.savingEvent()) return;
    ev.stopPropagation();
    if (this.drag()?.active) return;
    this.cancelDrag();
    this.pendingTimelineTap = null;
    if (ev.pointerType === 'mouse') ev.preventDefault();
    const columns = this.daysColumnsRef?.nativeElement;
    const day = this.visibleDays()[index];
    if (!columns || !day) return;
    const rect = (ev.currentTarget as HTMLElement).getBoundingClientRect();
    const original = event
      ? {start: Date.parse(event.start), end: Date.parse(event.end), allDay: !!event.allDay}
      : {start: day.getTime(), end: timelineDay(day, 1).getTime(), allDay};
    const resize = mode === 'resize-start' || mode === 'resize-end';
    let anchorY = HOUR_PX / 2;
    if (resize) {
      const block = (ev.currentTarget as HTMLElement).closest('.ev-block')!.getBoundingClientRect();
      anchorY = ev.clientY - (mode === 'resize-start' ? block.top : block.bottom);
    } else if (event && !allDay) anchorY = ev.clientY - rect.top;
    const col = columns.children[index].getBoundingClientRect();
    const writable = this.writableCalendars();
    const destination = this.viewMode() === 'multi' ? this.multiCalendars()[index]
      : writable.find(c => c.id === this.destinationCalendarID()) ?? writable[0];
    if (mode === 'create') this.inspectorEvent.set(null);
    this.pointer = {x: ev.clientX, y: ev.clientY};
    this.drag.set({
      mode, event, original, originDayIdx: index, pointerId: ev.pointerId,
      startClientX: ev.clientX, startClientY: ev.clientY, touch: ev.pointerType === 'touch',
      anchorX: mode === 'create' ? (col.width - 4) / 2 : ev.clientX - col.left - 2,
      width: Math.max(1, col.width - (mode === 'move' ? 6 : 4)), anchorY,
      active: false, valid: false, preview: original, previewDayIdx: index,
      color: event?.color ?? destination?.color, visualX: 0, visualY: 0,
    });
    if (event?.readOnly) return;
    const creationDelay = ev.pointerType === 'touch' && !allDay ? 700 : 450;
    const delay = resize ? 50 : mode === 'create' ? creationDelay : this.inspectorEvent()?.id === event?.id ? 100 : 200;
    this.holdTimer = setTimeout(() => this.activateDrag(), delay);
  }

  private readonly mirroredScroll = new WeakMap<HTMLElement, number>();
  syncTimelineScroll(ev: Event): void {
    const origin = ev.currentTarget as HTMLElement;
    if (this.mirroredScroll.get(origin) === origin.scrollLeft) return;
    this.mirroredScroll.delete(origin);
    const timeline = this.timelineScrollRef?.nativeElement;
    if (!timeline) return;
    const headers = timeline.parentElement!.querySelectorAll<HTMLElement>('.tl-day-headers');
    for (const viewport of [timeline, ...Array.from(headers)]) {
      if (viewport !== origin && Math.abs(viewport.scrollLeft - origin.scrollLeft) > 0.5) {
        viewport.scrollLeft = origin.scrollLeft;
        this.mirroredScroll.set(viewport, viewport.scrollLeft);
      }
    }
  }

  private activateDrag(): void {
    const current = this.drag();
    if (!current || current.event?.readOnly) return;
    if (this.holdTimer) clearTimeout(this.holdTimer);
    const columns = this.daysColumnsRef?.nativeElement;
    if (!columns?.isConnected) { this.cancelDrag(); return; }
    if (current.mode === 'create' && (this.viewMode() === 'multi'
      ? !this.multiCalendars()[current.originDayIdx]?.allowsChanges : !this.writableCalendars().length)) {
      this.cancelDrag();
      this.showToast("Open Menu to allow calendar access or add a writable calendar.");
      return;
    }
    columns.setPointerCapture(current.pointerId);
    if (current.event) this.inspectorEvent.set(current.event);
    this.drag.set({...current, active: true});
    this.updatePlacement();
  }

  private updatePlacement(): void {
    const state = this.drag(), columns = this.daysColumnsRef?.nativeElement;
    const scroll = this.timelineScrollRef?.nativeElement;
    if (!state?.active || !columns || !scroll) return;
    const {x,y} = this.pointer;
    const viewport = scroll.getBoundingClientRect();
    const dates = this.visibleDays();
    const bounds = columns.getBoundingClientRect();
    const first = columns.children[0]?.getBoundingClientRect();
    if (!first?.width) return;
    const rtl = getComputedStyle(columns).direction === 'rtl';
    const rawLeft = x - state.anchorX;
    const left = state.mode === 'create' ? Math.max(bounds.left, Math.min(bounds.right - state.width, rawLeft)) : rawLeft;
    const center = state.mode.startsWith('resize-') ? x : left + state.width / 2;
    const hitIndex = Math.floor((rtl ? first.right - center : center - first.left) / first.width);
    const resizing = state.mode === 'resize-start' || state.mode === 'resize-end';
    const columnIndex = resizing && this.viewMode() === 'multi' ? state.originDayIdx : hitIndex;
    const target = this.doc.elementFromPoint(x,y);
    const allDay = !!target?.closest('.tl-allday-zone');
    const withinView = y >= viewport.top && y < viewport.bottom && x >= viewport.left && x < viewport.right;
    const onGutter = !!target?.closest('.tl-gutter') || !!target?.closest('.calendar-column-head');
    const sameCalendar = this.viewMode() !== 'multi' || !state.event || columnIndex === state.originDayIdx;
    const canCreate = state.mode !== 'create' || this.viewMode() !== 'multi' || this.multiCalendars()[columnIndex]?.allowsChanges;
    const minute = (y - bounds.top - state.anchorY) / HOUR_PX * 60;
    const interval = dates[columnIndex] && !onGutter && (allDay || withinView)
      ? timelinePlacement(state.mode, state.original, dates[state.originDayIdx], dates[columnIndex], minute, allDay) : null;
    if (interval) {
      const column = columns.children[columnIndex].getBoundingClientRect();
      const visualX = resizing ? 0 : left - column.left - 2;
      const edge = state.mode === 'resize-end' ? interval.end : interval.start;
      const snappedY = minuteOnDay(edge, dates[columnIndex]) * HOUR_PX / 60;
      const visualY = allDay || state.mode === 'create' ? 0 : y - bounds.top - state.anchorY - snappedY;
      const color = this.viewMode() === 'multi' ? this.multiCalendars()[columnIndex]?.color : state.color;
      this.drag.set({...state, previewDayIdx: columnIndex, preview: interval, valid: Boolean(sameCalendar && canCreate), visualX, visualY, color});
    } else if (state.valid) this.drag.set({...state, valid: false});
    if ((withinView || allDay) && !this.scrollFrame) {
      const edgeSpeed = (position: number, low: number, high: number) =>
        position < low + 44 ? -Math.min(10, Math.ceil((low + 44 - position) / 4.4)) :
        Math.max(0, Math.min(10, Math.ceil((position - high + 44) / 4.4)));
      const rtl = getComputedStyle(scroll).direction === 'rtl';
      const dx = edgeSpeed(x, viewport.left + (rtl ? 0 : 60), viewport.right - (rtl ? 60 : 0));
      const dy = withinView ? edgeSpeed(y, viewport.top, viewport.bottom) : 0;
      if (dx || dy) this.scrollFrame = requestAnimationFrame(() => {
        this.scrollFrame = 0;
        const beforeX = scroll.scrollLeft, beforeY = scroll.scrollTop;
        scroll.scrollBy(dx, dy);
        if (scroll.scrollLeft !== beforeX || scroll.scrollTop !== beforeY) this.updatePlacement();
      });
    }
  }

  @HostListener('document:keydown.escape')
  @HostListener('window:blur')
  cancelDrag(): void {
    this.cancelMonthPress();
    this.endMonthDrag();
    if (this.holdTimer) clearTimeout(this.holdTimer);
    if (this.pointerFrame) cancelAnimationFrame(this.pointerFrame);
    this.pointerFrame = 0;
    if (this.scrollFrame) cancelAnimationFrame(this.scrollFrame);
    this.scrollFrame = 0;
    const pointerId = this.drag()?.pointerId;
    const columns = this.daysColumnsRef?.nativeElement;
    if (pointerId !== undefined && columns?.hasPointerCapture(pointerId)) columns.releasePointerCapture(pointerId);
    this.drag.set(null);
  }

  @HostListener('document:pointercancel', ['$event'])
  pointerCancelled(ev: PointerEvent): void { if (this.monthPointer?.id===ev.pointerId) this.endMonthDrag(); this.cancelMonthPress(ev); if (this.drag()?.pointerId === ev.pointerId) this.cancelDrag(); }

  private readonly onGlobalPointerMove = (ev: PointerEvent): void => {
    if (this.monthPointer?.id === ev.pointerId) {
      const g=this.monthPointer;
      if (this.monthPreview() || Math.hypot(ev.clientX-g.x,ev.clientY-g.y)>5) {
        if (!this.monthPreview() && g.touch) this.endMonthDrag();
        else this.zone.run(()=>this.moveMonthPreview(ev.clientX,ev.clientY));
      }
      return;
    }
    if (this.monthPress && Math.hypot(ev.clientX - this.monthPress.x, ev.clientY - this.monthPress.y) > 8) this.cancelMonthPress(ev);
    const state = this.drag();
    if (!state || ev.pointerId !== state.pointerId) return;
    this.pointer = {x: ev.clientX, y: ev.clientY};
    if (state.active) {
      if (!this.pointerFrame) this.pointerFrame = requestAnimationFrame(() => {
        this.pointerFrame = 0;
        this.zone.run(() => this.updatePlacement());
      });
    } else if (Math.hypot(ev.clientX - state.startClientX, ev.clientY - state.startClientY) > 8) {
      if (state.touch || state.mode === 'create' || state.event?.readOnly) this.cancelDrag();
      else this.zone.run(() => this.activateDrag());
    }
  }

  @HostListener('document:pointerup', ['$event'])
  async onGlobalPointerUp(ev: PointerEvent): Promise<void> {
    if (this.monthPointer?.id === ev.pointerId) { await this.finishMonthMove(ev); return; }
    this.cancelMonthPress(ev);
    if (this.drag()?.pointerId !== ev.pointerId) return;
    this.pointer = {x: ev.clientX, y: ev.clientY};
    this.updatePlacement();
    const state = this.drag()!;
    this.cancelDrag();
    if (!state.active) {
      if (state.event && state.mode === 'move' && !state.original.allDay && !this.isDesktop()) {
        this.pendingTimelineTap = state.event.id;
      } else if (state.event) this.selectEvent(state.event);
      else this.inspectorEvent.set(null);
      return;
    }
    if (!state.valid) return;
    // Holding selects the event. Its original minutes may be off the ten-minute grid.
    if (state.event && Math.hypot(ev.clientX - state.startClientX, ev.clientY - state.startClientY) < 3) return;
    const {start, end, allDay} = state.preview;
    if (state.event) {
      if (start !== state.original.start || end !== state.original.end || allDay !== state.original.allDay)
        await this.commitDraggedEventChange(state.event, new Date(start).toISOString(), new Date(end).toISOString(), allDay);
    } else this.createTimelineEvent(state.preview, state.previewDayIdx);
  }

  doubleClickSlot(ev: MouseEvent, index: number, allDay = false): void {
    if ((ev.target as Element).closest('.ev-block,.allday-pill')) return;
    const day = this.visibleDays()[index];
    const top = this.daysColumnsRef!.nativeElement.getBoundingClientRect().top;
    const minute = (ev.clientY - top) / HOUR_PX * 60 - 30;
    const placement = timelinePlacement('create', {start: 0, end: 0, allDay}, day, day, minute, allDay);
    if (placement) this.createTimelineEvent(placement, index);
  }

  private createTimelineEvent(interval: TimelineInterval, index: number): void {
    const column = this.viewMode() === 'multi' ? this.multiCalendars()[index] : undefined;
    if (column && !column.allowsChanges) return;
    this.openNewEventModal(new Date(interval.start), new Date(interval.end), interval.allDay, column?.id);
  }

  startsOnDay(event: WebCalendarEvent, day: Date) { return Date.parse(event.start) >= day.getTime(); }
  endsOnDay(event: WebCalendarEvent, day: Date) { return Date.parse(event.end) <= timelineDay(day, 1).getTime(); }

  previewMinute(state: DragSession): number {
    return minuteOnDay(state.mode === 'resize-end' ? state.preview.end : state.preview.start, this.visibleDays()[state.previewDayIdx]);
  }

  previewCoversDay(state: DragSession, day: Date, index: number): boolean {
    return state.active && (this.viewMode() !== 'multi' || state.previewDayIdx === index)
      && state.preview.start < timelineDay(day, 1).getTime() && state.preview.end > day.getTime();
  }

  previewColors(state: DragSession) {
    const accent = state.color || '#0088ff';
    return { color: accent, '--ev-bg': `color-mix(in srgb, ${accent} 30%, transparent)`,
      width: state.mode.startsWith('resize-') ? 'calc(100% - 4px)' : state.width + 'px',
      borderColor: state.valid ? 'transparent' : '#ff453a', '--ev-accent': accent, '--ev-detail': accent };
  }

  ghostStyle(state: DragSession, index: number) {
    const day = this.visibleDays()[index];
    const start = minuteOnDay(state.preview.start, day), end = minuteOnDay(state.preview.end, day);
    let height = Math.max(10, (end - start) / 60 * HOUR_PX - 2);
    let offset = state.mode === 'move' ? state.visualY : 0;
    if (state.mode === 'resize-start' && state.preview.start >= day.getTime()) {
      offset = Math.min(state.visualY, Math.max(0, height - 20));
      height -= offset;
    } else if (state.mode === 'resize-end' && state.preview.end <= timelineDay(day, 1).getTime()) {
      height = Math.max(20, height + state.visualY);
    }
    return {top: start / 60 * HOUR_PX + 'px', height: height + 'px',
      transform: `translate(${state.visualX}px, ${offset}px)`, ...this.previewColors(state)};
  }

  private monthClickTimer?: ReturnType<typeof setTimeout>;
  private monthPress?: { id: number; x: number; y: number; timer: ReturnType<typeof setTimeout> };
  private monthHeld = false;
  private monthPointer?: {item:WebCalendarEvent; source:HTMLElement; id:number; x:number; y:number; touch:boolean; timer?:ReturnType<typeof setTimeout>};
  readonly monthPreview = signal<{item:WebCalendarEvent; left:number; top:number; width:number} | null>(null);
  private suppressMonthClick = false;

  startMonthPress(event: PointerEvent, day: Date) {
    this.cancelMonthPress();
    this.monthHeld = false;
    if (!event.isPrimary || event.button !== 0 || (event.target as Element).closest('button,.month-pill')) return;
    const timer = setTimeout(() => {
      this.monthHeld = true;
      const start = timelineDay(day);
      start.setHours(9);
      this.openNewEventModal(start, new Date(start.getTime() + 3600000), false);
    }, 500);
    this.monthPress = {id: event.pointerId, x: event.clientX, y: event.clientY, timer};
  }

  private cancelMonthPress(event?: PointerEvent) {
    if (!this.monthPress || (event && this.monthPress.id !== event.pointerId)) return;
    clearTimeout(this.monthPress.timer);
    this.monthPress = undefined;
  }


  openMonthDay(ev: MouseEvent, date: Date): void {
    if (this.monthHeld) { this.monthHeld = false; return; }
    if (this.monthClickTimer) clearTimeout(this.monthClickTimer);
    const open = () => { this.selectMiniDay(date); this.setView("day"); };
    if (ev.detail === 0 || !this.isDesktop()) open();
    else if (ev.detail === 1) this.monthClickTimer = setTimeout(open, 350);
  }

  createFromMonth(ev: MouseEvent, date: Date): void {
    if ((ev.target as Element).closest("button,.month-pill")) return;
    if (this.monthClickTimer) clearTimeout(this.monthClickTimer);
    this.openNewEventModal(date, timelineDay(date, 1), true);
  }

  endMonthDrag(): void {
    clearTimeout(this.monthPointer?.timer);
    this.monthPointer = undefined;
    this.monthPreview.set(null);
    this.monthDragEventId.set(null);
    this.monthDropTargetKey.set(null);
  }

  beginMonthMove(e: PointerEvent, item: WebCalendarEvent) {
    if (!e.isPrimary || e.button !== 0) return;
    e.stopPropagation();
    this.endMonthDrag();
    this.suppressMonthClick = false;
    if (item.readOnly || this.savingEvent()) return;
    const source = e.currentTarget as HTMLElement;
    this.monthPointer = {
      item, source, id: e.pointerId, x: e.clientX, y: e.clientY, touch: e.pointerType === 'touch',
      timer: setTimeout(() => this.moveMonthPreview(e.clientX, e.clientY), 300),
    };
  }

  private moveMonthPreview(x:number, y:number) {
    const g=this.monthPointer;
    if (!g || !g.source.isConnected) { this.endMonthDrag(); return; }
    const rect=g.source.getBoundingClientRect();
    if (!g.source.hasPointerCapture(g.id)) g.source.setPointerCapture(g.id);
    const key=this.doc.elementFromPoint(x,y)?.closest<HTMLElement>('[data-month-day]')?.dataset['monthDay'];
    this.monthDropTargetKey.set(key ?? null);
    this.monthDragEventId.set(g.item.id);
    this.suppressMonthClick=true;
    this.monthPreview.set({item:g.item, left:x-(g.x-rect.left), top:y-(g.y-rect.top), width:rect.width});
  }

  monthEventClick(e:MouseEvent, item:WebCalendarEvent) {
    e.stopPropagation();
    if (!this.suppressMonthClick || e.detail===0) this.showEvent(item);
    this.suppressMonthClick=false;
  }

  private async finishMonthMove(e:PointerEvent) {
    const gesture=this.monthPointer;
    if (!gesture || gesture.id !== e.pointerId) return;
    if (this.monthPreview()) this.moveMonthPreview(e.clientX,e.clientY);
    const key=this.monthDropTargetKey();
    this.endMonthDrag();
    if (!key) return;
    const targetDate=new Date(key+'T00:00:00'), item=gesture.item;
    const oldStart = new Date(item.start);
    if (this.dayKey(oldStart) === this.dayKey(targetDate)) return;
    const durationMs = Date.parse(item.end) - oldStart.getTime();
    const nextStart = timelineDay(targetDate);
    nextStart.setHours(oldStart.getHours(), oldStart.getMinutes(), oldStart.getSeconds(), oldStart.getMilliseconds());
    const allDayInterval = item.allDay && timelinePlacement('move',
      {start: +oldStart, end: Date.parse(item.end), allDay: true}, timelineDay(oldStart), targetDate, 0, true);
    const nextEnd = new Date(allDayInterval ? allDayInterval.end : nextStart.getTime() + durationMs);
    await this.commitDraggedEventChange(
      item,
      nextStart.toISOString(),
      nextEnd.toISOString(),
    );
  }

  private async commitDraggedEventChange(
    original: WebCalendarEvent,
    newStartIso: string,
    newEndIso: string,
    allDay = !!original.allDay,
  ): Promise<void> {
    if (this.savingEvent()) return;
    this.savingEvent.set(true);
    this.pendingTimelineEdit.set({ id: original.id, start: newStartIso, end: newEndIso, allDay });

    try {
      const res = await this.persistEvent(original.id, {
        calendarId: original.calendarId,
        expectedUpdatedAt: original.updatedAt,
        start: newStartIso,
        end: newEndIso,
        allDay,
        notifyGuest: true,
      }, original);
      this.ownedEvents.update((list) =>
        list.map((e) => (e.id === res.event.id ? res.event : e)),
      );
    } catch (e) {
      this.pendingTimelineEdit.set(null);
      this.handleMutationError(e, "Could not move event to that time.");
      await this.reloadAllWorkspaceData();
    } finally {
      this.pendingTimelineEdit.set(null);
      this.savingEvent.set(false);
    }
  }

  // ── Navigation & Modal Editors ────────────────────────────────────────────

  activeModeIcon() {
    const targetMode =
      this.viewMode() === "menu" ? this.lastCalendarMode : this.viewMode();
    return (
      this.modes.find((m) => m.value === targetMode)?.symbol ?? "calendar"
    );
  }
  calendarName(id?: string) {
    return (
      this.allCalendars().find((c) => c.id === id)?.title ?? "Cloud Calendars"
    );
  }
  eventsForCalendar(id: string) {
    const start = this.anchorDate().getTime(),
      end = this.addDays(this.anchorDate(), 1).getTime();
    return this.allDisplayEvents()
      .filter(
        (e) =>
          e.calendarId === id &&
          Date.parse(e.start) < end &&
          Date.parse(e.end) > start,
      )
      .sort((a, b) => a.start.localeCompare(b.start));
  }
  duplicateEvent(event: WebCalendarEvent) {
    this.openEditEventModal({ ...event, readOnly: false });
    const d = this.editorDraft();
    if (d)
      this.editorDraft.set({
        ...d,
        id: crypto.randomUUID(),
        isNew: true,
        expectedUpdatedAt: undefined,
        calendarId: this.destinationCalendarID(),
      });
  }
  async copyEvent(event: WebCalendarEvent) {
    await this.copyText(
      `${event.title}\n${this.formatFullDateTime(event.start)} – ${this.formatFullDateTime(event.end)}${event.location ? "\n" + event.location : ""}`,
      "Event copied.",
    );
  }
  stepPeriod(dir: -1 | 1): void {
    const cur = this.anchorDate();
    const mode = this.viewMode();
    if (mode === "year")
      this.anchorDate.set(new Date(cur.getFullYear() + dir, cur.getMonth(), 1));
    else if (mode === "day" || mode === "multi")
      this.anchorDate.set(this.addDays(cur, dir));
    else if (mode === "month") {
      this.anchorDate.set(new Date(cur.getFullYear(), cur.getMonth() + dir, 1));
    } else {
      this.anchorDate.set(
        this.addDays(cur, dir * (mode === "week" ? this.dayCount() : 7)),
      );
    }
  }

  stepMiniMonth(dir: -1 | 1): void {
    const date = this.sidebarMonth();
    this.sidebarMonth.set(new Date(date.getFullYear(), date.getMonth() + dir, 1));
  }

  jumpToday(): void {
    this.anchorDate.set(this.startOfLocalDay(new Date()));
    this.sidebarMonth.set(new Date());
  }

  selectMiniDay(d: Date): void {
    this.anchorDate.set(this.startOfLocalDay(d));

    this.inspectorEvent.set(null);
    if (!["day", "week", "multi", "agenda"].includes(this.viewMode()))
      this.setView("day");
  }

  selectUpNext(ev: WebCalendarEvent): void {
    this.selectMiniDay(new Date(ev.start));
    this.selectEvent(ev);
  }

  openWeatherEvent(value:{date:string;instant?:string;timeZone:string}):void {
    const start = value.instant ? new Date(value.instant) : instant(new Date(value.date + 'Z'), value.timeZone);
    if(!start)return;
    this.openNewEventModal(start,new Date(start.getTime()+3600000),false);
    const draft=this.editorDraft();
    if(draft){const wall=wallDate(start,value.timeZone),end=wallDate(new Date(start.getTime()+3600000),value.timeZone);this.editorDraft.set({...draft,timeZone:value.timeZone,startDate:wall.toISOString().slice(0,10),startTime:wall.toISOString().slice(11,16),endDate:end.toISOString().slice(0,10),endTime:end.toISOString().slice(11,16)});}
  }

  openNewEventDefault(): void {
    const base = new Date(this.anchorDate());
    base.setHours(9, 0, 0, 0);
    this.drawerOpen.set(false);
    const end = new Date(base.getTime() + 60 * 60_000);
    this.openNewEventModal(base, end, false);
  }

  openNewEventModal(start: Date, end: Date, allDay: boolean, calendarId = this.destinationCalendarID()): void {
    if (this.loadingWorkspace()) return;
    const writable = this.writableCalendars();
    const target = writable.find(c => c.id === calendarId)
      ?? writable.find(c => !this.hiddenCalendarIDs().has(c.id)) ?? writable[0];
    if (!target) {
      this.setView("menu");
      this.showToast("Add a local calendar in Menu → Calendar first.");
      return;
    }
    const id = crypto.randomUUID();
    // The timeline and the day header both use device wall time.
    const zone = detectBrowserTimeZone();
    const startWall = wallDate(start, zone).toISOString();
    const endWall = wallDate(new Date(end.getTime() - (allDay ? 1 : 0)), zone).toISOString();
    this.expandedEventDate.set(null);
    this.editorPage.set('main');
    this.editorDraft.set({
      id,
      isNew: true,
      calendarId: target.id,
      title: this.localization.text("New Event"),
      color: target.color,
      allDay,
      startDate: startWall.slice(0, 10),
      startTime: startWall.slice(11, 16),
      endDate: endWall.slice(0, 10),
      endTime: endWall.slice(11, 16),
      timeZone: zone,
      availability: "busy",
      location: "",
      videoCallURL: "",
      notes: "",
      recurrence: "none",
      repeatInterval: 1,
      repeatUntil: "",
      secondReminderMin: -1,
      travelTime: 0,
      url: "",
      attachments: [],
      reminderMin: -1,
    });
  }

  openEditEventModal(ev: WebCalendarEvent): void {
    ev = calendarSeries(ev);
    this.selectedEvent.set(null);
    if (ev.readOnly) {
      this.showEvent(ev);
      return;
    }
    const s = new Date(ev.start);
    const e = new Date(ev.end);
    const rec = ev.details?.recurrenceRules?.[0]?.frequency ?? "none";
    const alarmSec = ev.details?.alarms?.[0]?.relativeOffsetSeconds;
    const reminderMin =
      typeof alarmSec === "number" ? Math.round(Math.abs(alarmSec) / 60) : -1;

    this.expandedEventDate.set(null);
    this.editorPage.set('main');
    const zone=ev.details?.timeZone||this.calendarTimeZone();
    const sw=wallDate(s,zone).toISOString(),ew=wallDate(e,zone).toISOString();
    this.editorDraft.set({
      id: ev.id,
      original: ev,
      isNew: false,
      calendarId: ev.calendarId,
      expectedUpdatedAt: ev.updatedAt,
      title: ev.title,
      color: ev.color || ev.details?.color || "#0A84FF",
      allDay: Boolean(ev.allDay),
      startDate: sw.slice(0,10),
      startTime: sw.slice(11,16),
      endDate: ev.allDay ? wallDate(new Date(e.getTime()-1),zone).toISOString().slice(0,10) : ew.slice(0,10),
      endTime: ew.slice(11,16),
      timeZone: ev.details?.timeZone || this.calendarTimeZone(),
      availability:
        (ev.details?.availability as "busy" | "free" | "tentative") || "busy",
      location: ev.location || "",
      structuredLocation: ev.details?.structuredLocation,
      videoCallURL: ev.details?.videoCallURL || "",
      notes: ev.details?.notes || "",
      recurrence: rec as any,
      repeatRule: ev.details?.recurrenceRules?.[0] ? structuredClone(ev.details.recurrenceRules[0]) : undefined,
      repeatInterval: ev.details?.recurrenceRules?.[0]?.interval ?? 1,
      repeatUntil:
        ev.details?.recurrenceRules?.[0]?.endDate?.slice(0, 10) ?? "",
      secondReminderMin: ev.details?.alarms?.[1]
        ? Math.round(Math.abs(ev.details.alarms[1].relativeOffsetSeconds) / 60)
        : -1,
      travelTime: ev.details?.travelTime ?? 0,
      url: ev.url ?? ev.details?.url ?? "",
      attachments: [...(ev.details?.attachments ?? [])],
      reminderMin,
    });
  }

  closeEditor(): void {
    this.editorPage.set("main");
    this.editorDraft.set(null);
    this.pendingDelete.set(false);
  }

  async saveDraftEvent(): Promise<void> {
    const d = this.editorDraft();
    if (!d || this.savingEvent()) return;
    const title = d.title.trim() || this.localization.text("New Event");

    const wallStart=new Date(`${d.startDate}T${d.allDay?'00:00':d.startTime||'09:00'}:00Z`);
    const wallEnd=new Date(`${d.endDate||d.startDate}T${d.allDay?'00:00':d.endTime||'10:00'}:00Z`);
    if(d.allDay)wallEnd.setUTCDate(wallEnd.getUTCDate()+1);
    const start=instant(wallStart,d.timeZone),end=instant(wallEnd,d.timeZone);
    if(!start||!end){this.showToast('This time does not exist in the event time zone. Choose another time.');return;}
    if(end<=start){this.showToast('The end must be after the start.');return;}
    const startIso=start.toISOString(),endIso=end.toISOString();

    this.savingEvent.set(true);
    try {
      const res = await this.persistEvent(d.id, {
        calendarId: d.calendarId,
        expectedUpdatedAt: d.expectedUpdatedAt,
        title,
        start: startIso,
        end: endIso,
        allDay: d.allDay,
        color: d.color,
        location: d.location.trim() || null,
        structuredLocation: d.structuredLocation ?? null,
        videoCallURL: d.videoCallURL.trim() || null,
        notes: d.notes.trim(),
        timeZone: d.timeZone,
        availability: d.availability,
        url: d.url,
        travelTime: d.travelTime,
        attachments: d.attachments,
        alarms: d.original && !d.alertsEdited ? d.original.details?.alarms : [
          ...new Set(
            [d.reminderMin, d.secondReminderMin].filter((m) => m >= 0),
          ),
        ].map((m) => ({ relativeOffsetSeconds: -m * 60 })),
        recurrenceRules: d.original && !d.repeatEdited ? d.original.details?.recurrenceRules :
          d.recurrence !== "none"
            ? [
                {
                  ...d.repeatRule,
                  frequency: d.recurrence,
                  interval: Math.max(1, d.repeatInterval),
                  endDate: d.repeatUntil
                    ? instant(new Date(d.repeatUntil + "T23:59:59Z"),d.timeZone)?.toISOString()
                    : undefined,
                },
              ]
            : [],
        notifyGuest: true,
      }, d.original);

      if (!res.event.provider && !res.event.id.startsWith("sharedcal.") && !res.event.receivedFeedId)
        this.ownedEvents.update((list) => {
          const exists = list.some((x) => x.id === res.event.id);
          return exists
            ? list.map((x) => (x.id === res.event.id ? res.event : x))
            : [...list, res.event];
        });
      this.editorDraft.set(null);
      this.showToast(d.isNew ? `Created "${title}".` : `Saved "${title}".`);
    } catch (e) {
      this.handleMutationError(e, "Could not save event.");
    } finally {
      this.savingEvent.set(false);
    }
  }

  async addAttachments(event: Event) {
    const draft = this.editorDraft();
    if (!draft) return;
    for (const file of Array.from(
      (event.target as HTMLInputElement).files ?? [],
    )) {
      if (file.size > 5 * 1024 * 1024 || draft.attachments.length >= 5) {
        this.showToast("Choose up to 5 attachments, no larger than 5 MB each.");
        break;
      }
      const data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      draft.attachments.push({
        id: crypto.randomUUID(),
        fileName: file.name,
        contentType: file.type,
        dataBase64: data,
      });
    }
    this.editorDraft.set({ ...draft });
  }
  removeAttachment(index: number) {
    const d = this.editorDraft();
    if (d)
      this.editorDraft.set({
        ...d,
        attachments: d.attachments.filter((_, i) => i !== index),
      });
  }
  downloadAttachment(attachment: {
    fileName: string;
    contentType?: string;
    dataBase64: string;
  }) {
    const bytes = Uint8Array.from(atob(attachment.dataBase64), (c) =>
        c.charCodeAt(0),
      ),
      url = URL.createObjectURL(
        new Blob([bytes], {
          type: attachment.contentType ?? "application/octet-stream",
        }),
      );
    const link = document.createElement("a");
    link.href = url;
    link.download = attachment.fileName;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  private async persistReplicaEvent(
    id: string,
    body: any,
  ): Promise<{ event: WebCalendarEvent; notifiedGuest?: boolean }> {
    const calendarID = id.startsWith("native.")
      ? id.split(".")[1]
      : body.calendarId;
    if (!calendarID) return this.api.upsertCalendarEvent(id, body);
    const { calendars } = await this.native.request<{ calendars: any[] }>(
      "/ios/calendars/account",
    );
    const calendar = calendars.find((c) => c.id === calendarID);
    // Device-owned provider replicas use the existing event mutation endpoint.
    if (!calendar) return this.api.upsertCalendarEvent(id, body);
    if (!calendar.allowsChanges || calendar.available === false)
      throw new Error("This calendar is read-only.");
    const eventID = id.startsWith("native.") ? id.split(".")[2] : await this.native.sharingID(id);
    const previous = calendar.events.find((e: any) => e.id === eventID);
    if (previous?.readOnly) throw new Error("This event is read-only.");
    if (
      body.expectedUpdatedAt &&
      previous?.updatedAt !== body.expectedUpdatedAt
    )
      throw new Error(
        "This event changed on another device. Reopen it to see the latest version.",
      );
    const details = {
      ...webEventDetails(previous?.details),
      ...Object.fromEntries(
        [
          "notes",
          "timeZone",
          "availability",
          "videoCallURL",
          "alarms",
          "recurrenceRules",
          "travelTime",
          "structuredLocation",
          "attachments",
          "url",
        ]
          .filter((k) => body[k] !== undefined)
          .map((k) => [k, body[k]]),
      ),
    };
    const event = {
      ...previous,
      id: eventID,
      details: nativeEventDetails(details),
    };
    for (const key of ["title", "start", "end", "allDay", "location", "url"])
      if (body[key] !== undefined) event[key] = body[key];
    const events = calendar.events.filter((e: any) => e.id !== eventID);
    events.push(event);
    const result = await this.native.request<{ calendar: any }>(
      "/ios/calendars/sync",
      "POST",
      { ...calendar, events, expectedRevision: calendar.revision },
    );
    const stored = result.calendar.events.find((e: any) => e.id === eventID);
    return {
      event: {
        ...stored,
        details: webEventDetails(stored.details),
        id: `native.${calendarID}.${eventID}`,
        calendarId: calendarID,
        readOnly: false,
        color: calendar.color,
      },
    };
  }

  private async persistEvent(
    id: string,
    body: any,
    source?: WebCalendarEvent,
  ): Promise<{ event: WebCalendarEvent; notifiedGuest?: boolean }> {
    ++this.stateVersion;
    let original = source ??
      this.allDisplayEvents().find((e) => e.id === id) ??
      this.editorDraft()?.original;
    const providerCalendar=this.providerWorkspace.calendars().find(c=>c.id===(body.calendarId||original?.calendarId));
    if(providerCalendar && !original?.receivedFeedId)return {event:await this.providerWorkspace.saveEvent(providerCalendar,original,body,id)};
    const occurrence = original as CalendarOccurrence | undefined;
    if (occurrence?.occurrenceOf) {
      id = occurrence.occurrenceOf;
      body = {
        ...body,
        ...(body.start
          ? {
              start: new Date(
                Date.parse(occurrence.masterStart!) +
                  Date.parse(body.start) -
                  Date.parse(occurrence.start),
              ).toISOString(),
            }
          : {}),
        ...(body.end
          ? {
              end: new Date(
                Date.parse(occurrence.masterEnd!) +
                  Date.parse(body.end) -
                  Date.parse(occurrence.end),
              ).toISOString(),
            }
          : {}),
      };
      original = {
        ...occurrence,
        id,
        start: occurrence.masterStart!,
        end: occurrence.masterEnd!,
      };
    }
    const details = original?.details ?? {};
    const nextDetails = {
      ...details,
      ...Object.fromEntries(
        [
          "notes",
          "timeZone",
          "availability",
          "videoCallURL",
          "alarms",
          "recurrenceRules",
          "travelTime",
          "structuredLocation",
          "attachments",
          "url",
        ]
          .filter((k) => body[k] !== undefined)
          .map((k) => [k, body[k]]),
      ),
    };
    const calendar = this.native
      .sharedCalendars()
      .find((c) => c.id === body.calendarId);
    if (calendar) {
      const event = original ?? {
        id: `sharedcal.${calendar.id}.${await this.native.sharingID(id)}`,
        calendarId: calendar.id,
        title: body.title,
        start: body.start,
        end: body.end,
      };
      return {
        event: await this.native.updateCalendarEvent(event, body, nextDetails),
      };
    }
    if (
      original?.receivedFeedId ||
      this.native.received().some((e) => e.id === id)
    ) {
      const event = await this.native.updateSharedEvent(
        original!,
        body,
        nextDetails,
      );
      this.sharedEvents.update((events) =>
        events.map((e) => (e.id === id ? event : e)),
      );
      return { event };
    }
    // The original web endpoint also serves older backends that require the
    // complete interval on every write, including a detail-only edit.
    const payload = !body.calendarId && original
      ? { start: original.start, end: original.end, ...body } : body;
    const response = await this.persistReplicaEvent(id, payload);
    if (response.event.calendarId) {
      try {
        await this.native.syncOwnedCalendar(response.event.calendarId, response.event.id);
      } catch (error) {
        this.ownedEvents.update((events) =>
          events.map((e) => (e.id === response.event.id ? response.event : e)),
        );
        throw new Error(
          "Saved to your calendar, but sharing could not sync. " +
            (error instanceof Error ? error.message : ""),
        );
      }
    }
    const localID = id.split(".").at(-1);
    const outgoing = this.native
      .outgoing()
      .find((e) => e.localEventIdentifier === localID);
    if (outgoing && outgoing.id !== response.event.id)
      await this.native.updateSharedEvent(
        outgoing,
        response.event,
        nextDetails,
      );
    return response;
  }
  async deleteDraftEvent(): Promise<void> {
    const d = this.editorDraft();
    if (!d || d.isNew) {
      this.editorDraft.set(null);
      return;
    }
    this.savingEvent.set(true);
    try {
      if(d.original?.provider)await this.providerWorkspace.deleteEvent(d.original);
      else if (d.id.startsWith("sharedcal.") && d.original)
        await this.native.updateCalendarEvent(d.original, {}, undefined, true);
      else if (d.original?.receivedFeedId)
        await this.removeReceivedEvent(d.original);
      else {
        await this.api.deleteCalendarEvent(d.id, { notifyGuest: true });
        if (d.calendarId) await this.native.syncOwnedCalendar(d.calendarId, d.id);
      }
      await this.reloadAllWorkspaceData();
      this.ownedEvents.update((list) => list.filter((x) => x.id !== d.id));
      this.editorDraft.set(null);
      this.showToast("Event deleted.");
    } catch (e) {
      this.handleMutationError(e, "Could not delete event.");
    } finally {
      this.savingEvent.set(false);
    }
  }

  exportDraftIcs(): void {
    const d = this.editorDraft();
    if (!d) return;
    const s = new Date(
      `${d.startDate}T${d.startTime || "09:00"}:00`,
    ).toISOString();
    const e = new Date(
      `${d.endDate || d.startDate}T${d.endTime || "10:00"}:00`,
    ).toISOString();
    const ics = buildSingleEventIcs({
      uid: `${d.id}@cloud-calendars.com`,
      title: d.title || "Event",
      start: s,
      end: e,
      location: d.location,
      description: d.notes,
      url: d.videoCallURL || undefined,
    });
    downloadIcsFile(d.title || "cloud-calendar-event", ics);
  }

  // ── External Busy Calendar Sync ───────────────────────────────────────────

  async syncGoogleBusy(): Promise<void> {
    this.syncingExternal.set("google");
    this.syncFeedback.set(null);
    try {
      await this.api.signInWithGooglePopup({ includeCalendarReadonly: true });
      await this.providerWorkspace.refresh(true);
      await this.reloadAllWorkspaceData();
      this.syncFeedback.set("Google Calendar connected.");
    } catch (e) {
      this.syncFeedback.set(
        e instanceof Error
          ? e.message
          : "Paste your Google Calendar Secret .ics URL below for instant sync.",
      );
    } finally {
      this.syncingExternal.set(null);
    }
  }

  async syncMicrosoftBusy(): Promise<void> {
    this.syncingExternal.set("microsoft");
    this.syncFeedback.set(null);
    try {
      await this.api.signInWithMicrosoftPopup({
        includeCalendarReadonly: true,
      });
      await this.providerWorkspace.refresh(true);
      await this.reloadAllWorkspaceData();
      this.syncFeedback.set("Microsoft Calendar connected.");
    } catch (e) {
      this.syncFeedback.set(
        e instanceof Error
          ? e.message
          : "Paste your Outlook .ics feed URL below for instant sync.",
      );
    } finally {
      this.syncingExternal.set(null);
    }
  }

  async syncIcsUrl(): Promise<void> {
    const url = this.icsFeedInput().trim();
    if (!url) return;
    this.syncingExternal.set("ics");
    this.syncFeedback.set(null);
    try {
      const nextBusy = await this.api.syncExternalProvider({
        provider: "ics",
        icsUrl: url,
      });
      this.externalBusy.set(nextBusy);
      const count = nextBusy.sources?.["ics"]?.count ?? 0;
      this.syncFeedback.set(`Synced ${count} busy events from .ics feed.`);
    } catch (e) {
      this.syncFeedback.set(
        e instanceof Error ? e.message : "Could not sync .ics URL.",
      );
    } finally {
      this.syncingExternal.set(null);
    }
  }

  async disconnectExternal(
    provider: "google" | "microsoft" | "ics",
  ): Promise<void> {
    if (this.syncingExternal()) return;
    const token = this.api.token();
    this.syncingExternal.set(provider);
    this.syncFeedback.set(null);
    try {
      const result = await this.api.syncExternalProvider({ provider, disconnect: true });
      if (this.api.token() !== token) return;
      this.externalBusy.set(result);
      if (result.connectedProviders) {
        this.api.profile.update(profile => profile && ({ ...profile, connectedProviders: result.connectedProviders }));
      } else {
        await this.api.refreshProfile();
      }
      await this.providerWorkspace.refresh(true);
      await this.reloadAllWorkspaceData();
      this.showToast(`Disconnected ${provider} calendar sync.`);
    } catch (error) {
      if (this.api.token() === token) this.handleMutationError(error, "Could not refresh the calendar connection.");
    } finally {
      this.syncingExternal.set(null);
    }
  }

  copyText(text: string, label = "Link copied to clipboard!"): void {
    if (!this.isBrowser) return;
    this.iosQrEnabled.set(isIosQrAuthEnabled());
    navigator.clipboard?.writeText(text);
    this.showToast(label);
  }

  // ── Date & Toast Utilities ────────────────────────────────────────────────

  private showToast(message: string): void {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toast.set(message);
    this.toastTimer = setTimeout(() => this.toast.set(null), 6500);
  }

  private startOfLocalDay(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
  }

  private startOfWeekMonday(d: Date): Date {
    const day = d.getDay();
    const diff = -((day - this.firstWeekday() + 7) % 7);
    return this.addDays(this.startOfLocalDay(d), diff);
  }

  private addDays(d: Date, days: number): Date {
    return new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate() + days,
      0,
      0,
      0,
      0,
    );
  }

  dayKey(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  private toInputDate(d: Date): string {
    return this.dayKey(d);
  }

  private toInputTime(d: Date): string {
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  }
}
