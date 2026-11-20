import {CalendarSearchFieldComponent} from './calendar-search-field.component';
import { CalendarProviderService } from "../../core/calendar-provider.service";
import {
  CalendarNativeTextPipe,
  CalendarNativeDatePipe,
  CalendarLocalization,
} from "../../core/calendar-localization";
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  computed,
  effect,
  untracked,
  inject,
  input,
  output,
  signal,
} from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { CalendarProgressComponent } from "./calendar-progress.component";
import { CalendarSymbolComponent } from "./calendar-symbol.component";
import { CalendarChoiceComponent } from "./calendar-choice.component";
import {
  CalendarNativeService,
  PendingInvitation,
  SharedCalendar,
  SharedEvent,
  SharingPerson,
  CalendarAccess,
} from "../../core/calendar-native.service";
import {
  CalendarPlatformApiService,
  CalendarApiError,
  DeviceCalendar,
  WebCalendarEvent,
} from "../../core/calendar-platform-api.service";
import { ThemeService } from "../../core/theme.service";
import catalog from "./native-app-catalog.json";

type Section =
  | "Calendar"
  | "MultiCalendar"
  | "Subscriptions"
  | "Sharing"
  | "Settings"
  | "Apps";
type Panel =
  | ""
  | "scan"
  | "calendar"
  | "color"
  | "calendar-sharing"
  | "recipients"
  | "provider-sharing";

const accessCacheLifetimeMs = 30_000;

interface AccessSnapshot {
  people: SharingPerson[];
  calendar?: SharedCalendar;
}

@Component({
  selector: "cc-calendar-menu",
  standalone: true,
  imports: [
    CalendarSearchFieldComponent,
    CalendarNativeTextPipe,
    CalendarNativeDatePipe,
    CommonModule,
    FormsModule,
    CalendarSymbolComponent,
    CalendarProgressComponent,
    CalendarChoiceComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./calendar-menu.component.html",
  styleUrl: "./calendar-menu.component.scss",
})
export class CalendarMenuComponent implements OnInit, OnDestroy {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly localization = inject(CalendarLocalization);
  readonly api = inject(CalendarPlatformApiService);
  readonly providerWorkspace = inject(CalendarProviderService);

  addProviderPerson() {
    this.providerAccess.update((list) => [
      ...list,
      { email: "", access: "reader" },
    ]);
  }
  removeProviderDraftPerson(person: unknown) {
    return (p: unknown) => p !== person;
  }
  calendarProvider: "google" | "microsoft" | null = null;
  providerAccess = signal<
    Array<{
      id?: string;
      email: string;
      access: string;
      isOriginalOwner?: boolean;
    }>
  >([]);
  providerCalendar: DeviceCalendar | null = null;
  readonly confirmingDisconnect = signal<"google" | "microsoft" | null>(null);
  readonly subscriptionNotice = signal("");

  openProviderAccess(calendar: DeviceCalendar) {
    this.providerCalendar = calendar;
    this.providerAccess.set([]);
    this.panel.set("provider-sharing");
    void this.readAccess(["provider", calendar.provider, calendar.remoteID,
      this.connectedProviderEmail(calendar.provider!), calendar.etag], () =>
      this.providerWorkspace.perform<AccessSnapshot>(calendar.provider!, {
        action: "list-access", calendarID: calendar.remoteID,
      }));
  }
  saveProviderPerson(person: { id?: string; email: string; access: string }) {
    const calendar = this.providerCalendar!;
    void this.run(async () => {
      await this.providerWorkspace.perform(calendar.provider!, {
        action: "save-access", calendarID: calendar.remoteID, personID: person.id,
        email: person.email, access: person.access,
      });
      this.accessReads.delete(this.accessKey);
      this.openProviderAccess(calendar);
    });
  }
  deleteProviderPerson(person: { id?: string }) {
    const calendar = this.providerCalendar!;
    void this.run(async () => {
      await this.providerWorkspace.perform(calendar.provider!, {
        action: "delete-access", calendarID: calendar.remoteID, personID: person.id,
      });
      this.accessReads.delete(this.accessKey);
      this.providerAccess.update(list => list.filter(p => p !== person));
    });
  }
  addProviderCalendar(provider: "google" | "microsoft") {
    this.openCalendar(null);
    this.calendarProvider = provider;
  }

  readonly sharing = inject(CalendarNativeService);
  readonly theme = inject(ThemeService);
  readonly calendars = input<DeviceCalendar[]>([]);
  readonly hiddenIDs = input<Set<string>>(new Set());
  readonly multiIDs = input<Set<string>>(new Set());
  readonly toggleCalendar = output<string>();
  readonly toggleMulti = output<string>();
  readonly changed = output<void>();
  readonly localCalendarChanged = output<{id: string; calendar?: DeviceCalendar}>();
  readonly connect = output<"google" | "microsoft">();
  readonly disconnect = output<"google" | "microsoft">();
  readonly settingsChanged = output<void>();
  readonly openEvent = output<SharedEvent>();
  readonly sharedListEvent = input.required<(event: SharedEvent) => WebCalendarEvent>();
  readonly accessEventTarget = input.required<(event: SharedEvent) => WebCalendarEvent | undefined>();
  readonly eventActionOpen = input(false);
  readonly iosLayout = input(false);
  readonly editEvent = output<WebCalendarEvent>();
  readonly shareEvent = output<WebCalendarEvent>();
  readonly section = signal<Section>("Calendar");
  readonly sections: Section[] = [
    "Calendar",
    "MultiCalendar",
    "Subscriptions",
    "Sharing",
    "Settings",
    "Apps",
  ];
  readonly panel = signal<Panel>("");
  readonly destination = signal<"pending" | "sent" | "received" | "">("");
  readonly search = signal("");
  readonly destinationSearchOpen = signal(false);
  readonly busy = signal(false);
  readonly error = signal("");
  readonly colors = [
    { label: "Red", hex: "#FF453A" },
    { label: "Orange", hex: "#FF9F0A" },
    { label: "Yellow", hex: "#FFD60A" },
    { label: "Green", hex: "#30D158" },
    { label: "Blue", hex: "#0A84FF" },
    { label: "Purple", hex: "#BF5AF2" },
    { label: "Brown", hex: "#996633" },
  ];
  readonly apps = catalog;

  readonly allManagedCalendars = computed(() => [
    ...this.calendars(),
    ...this.sharing.sharedCalendars().map((c) => ({
      ...c,
      source: "Shared with me",
      color: this.sharing.colorOverrides()[c.id] ?? c.color,
      access: c.currentAccess ?? c.access,
      allowsChanges: (c.currentAccess ?? c.access) !== "reader" && !c.isRevoked,
      available: !c.isRevoked,
    })),
  ]);

  readonly groups = computed(() => {
    const nonProvider = this.allManagedCalendars().filter((c) => !c.provider);
    const sources = [
      ...new Set([
        "Local Calendars",
        "Shared with me",
        "Other",
        ...nonProvider.map((c) => c.source),
      ]),
    ];
    return sources.map((source) => ({
      source,
      calendars: nonProvider.filter((c) => c.source === source),
    }));
  });

  providerCalendars(provider: "google" | "microsoft"): DeviceCalendar[] {
    return this.calendars().filter((c) => c.provider === provider);
  }

  isProviderConnected(provider: "google" | "microsoft"): boolean {
    return !!this.api.profile()?.connectedProviders?.[provider]?.connected;
  }

  connectedProviderEmail(provider: "google" | "microsoft"): string {
    return this.api.profile()?.connectedProviders?.[provider]?.accountEmail ?? "";
  }

  readonly multiCalendars = computed(() =>
    [...this.allManagedCalendars()].sort((a, b) =>
      a.title.localeCompare(b.title),
    ),
  );
  readonly currentEvents = computed(() =>
    (this.destination() === "sent"
      ? this.sharing.outgoing()
      : this.sharing.received()
    ).filter(
      (e) =>
        !this.search() ||
        `${e.title} ${e.location ?? ""}`
          .toLowerCase()
          .includes(this.search().toLowerCase()),
    ),
  );
  readonly eventGroups = computed(() => {
    const groups = new Map<number, SharedEvent[]>();
    for (const event of this.currentEvents()) {
      const day = new Date(event.start);
      if (!Number.isFinite(day.getTime())) continue;
      day.setHours(0, 0, 0, 0);
      const entries = groups.get(+day);
      if (entries) entries.push(event);
      else groups.set(+day, [event]);
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const locale = this.localization.formattingLocale();
    const dateLocales: Record<string, string> = {dmy: "en-GB", mdy: "en-US", ymd: "sv-SE"};
    const preference = dateLocales[this.prefs()["date"]];
    const weekday = new Intl.DateTimeFormat(locale, {weekday: "long"});
    const dateLabel = (year: boolean) => new Intl.DateTimeFormat(preference || locale, {
      day: preference ? "2-digit" : "numeric", month: preference ? "2-digit" : "numeric",
      year: year ? "numeric" : undefined,
    });
    const withYear = dateLabel(true), withoutYear = dateLabel(false);
    return [...groups].sort(([a], [b]) => a - b).map(([date, events]) => ({
      date, today: date === +today,
      label: weekday.format(date) + ", " + (new Date(date).getFullYear() === today.getFullYear() ? withoutYear : withYear).format(date),
      events: events.sort((a, b) => Date.parse(a.start) - Date.parse(b.start) || Date.parse(a.end) - Date.parse(b.end)),
    }));
  });
  readonly planFeatures: Record<string, string[]> = {
    Base: [
      "Single-day calendar view",
      "Multi-day calendar view",
      "Monthly calendar view",
      "Yearly overview",
      "List view for events",
      "Weather view",
      "Multi-calendar view",
      "Sync with Google Calendar",
      "Sync meets from Google Meet",
    ],
    Advanced: ["All Base Plan features", "Ads Free"],
    Premium: [
      "All Advanced Plan features",
      "Sync with Microsoft Calendar",
      "Sync meets from Microsoft Teams",
    ],
  };
  readonly category = signal("Advanced");
  readonly duration = signal("yearly");
  showVisualOnlySubscriptionNotice() {
    this.subscriptionNotice.set(
      "Subscriptions and purchases are visual-only in this web preview.",
    );
  }
  selectedPlanPrice(): string {
    if (this.category() === "Premium") {
      return this.duration() === "yearly" ? "$49.99" : "$4.99";
    }
    return this.duration() === "yearly" ? "$4.99" : "$0.49";
  }

  readonly prefs = signal<Record<string, string>>({
    theme: "system",
    language: "system",
    units: "system",
    date: "system",
    time: "system",
    firstWeekday: "0",
    eventNotifications: "false",
    weatherNotifications: "false",
  });
  readonly settings = [
    {
      key: "theme",
      label: "Theme",
      icon: "circle.lefthalf.filled",
      options: [
        { value: "system", label: "System" },
        { value: "light", label: "Light" },
        { value: "dark", label: "Dark" },
      ],
    },
    {
      key: "language",
      label: "Language",
      icon: "globe",
      options: [
        { value: "system", label: "System" },
        ...this.localization.languages.map((l) => ({
          value: l.value,
          label:
            new Intl.DisplayNames([l.value], { type: "language" }).of(
              l.value,
            ) ?? l.value,
        })),
      ],
    },
    {
      key: "units",
      label: "Measurement Units",
      icon: "ruler",
      options: [
        { value: "system", label: "System" },
        { value: "metric", label: "Metric" },
        { value: "imperial", label: "Imperial" },
      ],
    },
    {
      key: "date",
      label: "Date Format",
      icon: "calendar",
      options: [
        { value: "system", label: "System" },
        { value: "dmy", label: "31/12/26" },
        { value: "mdy", label: "12/31/26" },
        { value: "ymd", label: "2026-12-31" },
      ],
    },
    {
      key: "time",
      label: "Time Format",
      icon: "clock",
      options: [
        { value: "system", label: "System" },
        { value: "12", label: "1:45 PM" },
        { value: "24", label: "13:45" },
      ],
    },
    {
      key: "firstWeekday",
      label: "First Day of Week",
      icon: "calendar.day.timeline.left",
      options: [
        { value: "0", label: "Sunday" },
        { value: "1", label: "Monday" },
        { value: "6", label: "Saturday" },
      ],
    },
  ];
  calendar: DeviceCalendar | null = null;
  get calendarRemoval() {
    const cal = this.calendar;
    if (!cal) return null;
    if (cal.ownerId) return {label: "Remove from My Calendars", prompt: "Remove this shared calendar from your calendars?", confirm: "Remove"};
    if (cal.provider) {
      if (cal.primary || cal.isRemovable === false) return null;
      if (!cal.providerOwner) {
        if (cal.provider === "microsoft" && !cal.isRemovable) return null;
        return {label: "Remove from My Calendars", prompt: "Remove this calendar from your provider calendar list?", confirm: "Remove"};
      }
    } else if (!cal.accountLocal) {
      return {label: "Remove from Web Calendar", prompt: "Remove this calendar and its events from the website? The calendar stays on your device.", confirm: "Remove"};
    }
    return {label: "Delete Calendar", prompt: "Delete this calendar and its events?", confirm: "Delete"};
  }
  calendarTitle = "";
  calendarColor = "#0A84FF";
  usesCreatorDefault = false;
  confirmDelete = false;
  sharedCalendar: SharedCalendar | null = null;
  people: SharingPerson[] = [];
  removedPeople: string[] = [];
  sharedEvent: SharedEvent | null = null;
  qrInput = "";
  qrMessage = "";
  camera?: MediaStream;
  private scanTimer?: ReturnType<typeof setInterval>;

  ngOnInit() {
    if (this.isBrowser && typeof localStorage !== "undefined") {
      try {
        this.section.set(
          (localStorage.getItem("cc.mac.menuSection") as Section) || "Calendar",
        );
        this.prefs.update((p) => ({
          ...p,
          ...JSON.parse(localStorage.getItem("cc.mac.preferences") || "{}"),
        }));
      } catch {}
    }

  }
  selectSection(s: Section) {
    this.section.set(s);
    this.destination.set("");
    this.destinationSearchOpen.set(false);
    this.subscriptionNotice.set("");
    this.error.set("");
    if (this.isBrowser && typeof localStorage !== "undefined") {
      localStorage.setItem("cc.mac.menuSection", s);
    }
  }
  async run(action: () => Promise<unknown>) {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set("");
    try {
      await action();
    } catch (e) {
      if (["calendar-sharing", "provider-sharing", "recipients"].includes(this.panel()) &&
          e instanceof CalendarApiError && [403, 404, 409].includes(e.status)) {
        this.accessReads.delete(this.accessKey);
        this.people = [];
        this.providerAccess.set([]);
        this.accessFailed.set(true);
      }
      this.error.set(e instanceof Error ? e.message : "Please try again.");
    } finally {
      this.busy.set(false);
    }
  }
  async setPreference(key: string, value: string) {
    if (key === "weatherNotifications") {
      this.error.set("Weather alert delivery is available in the app.");
      return;
    }
    if (key.endsWith("Notifications") && value === "true") {
      if (
        typeof window === "undefined" ||
        !("Notification" in window) ||
        (await Notification.requestPermission()) !== "granted"
      ) {
        this.error.set("Allow notifications in your browser to enable alerts.");
        return;
      }
    }
    this.prefs.update((p) => ({ ...p, [key]: value }));
    if (this.isBrowser && typeof localStorage !== "undefined") {
      localStorage.setItem("cc.mac.preferences", JSON.stringify(this.prefs()));
    }
    if (key === "language") await this.localization.setLanguage(value);
    if (key === "theme" && typeof matchMedia !== "undefined")
      this.theme.setTheme(
        value === "system"
          ? matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : (value as "dark" | "light"),
      );
    this.settingsChanged.emit();
  }
  openCalendar(calendar: DeviceCalendar | null) {
    this.calendar = calendar;
    this.calendarProvider = calendar?.provider ?? null;
    this.calendarTitle = calendar?.title ?? "";
    this.calendarColor = calendar?.color ?? "#0A84FF";
    this.usesCreatorDefault =
      !!calendar?.ownerId && !this.sharing.colorOverrides()[calendar.id];
    this.confirmDelete = false;
    this.error.set("");
    this.panel.set("calendar");
  }
  colorName() {
    if (this.usesCreatorDefault) return "Default from creator";
    return (
      this.colors.find(
        (c) => c.hex.toLowerCase() === this.calendarColor.toLowerCase(),
      )?.label ?? "Custom"
    );
  }
  selectColor(color: string) {
    this.calendarColor = color;
    this.usesCreatorDefault = false;
  }
  creatorColor() {
    return (
      this.sharing.sharedCalendars().find((c) => c.id === this.calendar?.id)
        ?.color ??
      this.calendar?.color ??
      "#0A84FF"
    );
  }
  closePanel() {
    ++this.readGeneration;
    this.accessLoading.set(false);
    this.accessFailed.set(false);
    this.pendingRemoval.set(null);
    this.panel.set("");
    this.error.set("");
    this.stopCamera();
  }
  saveCalendar() {
    void this.run(async () => {
      const token = this.api.token();
      if (this.calendarProvider) {
        await this.providerWorkspace.saveCalendar(
          this.calendarProvider,
          this.calendar,
          this.calendarTitle,
          this.calendarColor,
        );
      } else if (this.calendar && !this.calendar.accountLocal) {
        if (this.usesCreatorDefault)
          this.sharing.resetCalendarColor(this.calendar.id);
        else
          this.sharing.setCalendarColor(this.calendar.id, this.calendarColor);
        if (
          this.calendar.ownerId &&
          this.calendar.access === "owner" &&
          this.calendarTitle.trim() !== this.calendar.title
        ) {
          const remote = await this.sharing.calendarSharing(this.calendar);
          await this.sharing.request(
            `/icloud-calendars/${remote.calendarId ?? remote.id}/sharing`,
            "PUT",
            {
              ownerId: remote.ownerId,
              title: this.calendarTitle.trim(),
              color: remote.color,
              calendarKind: "app_local",
              expectedUpdatedAt: remote.updatedAt,
              recipients: [],
              preserveUnmentionedRecipients: true,
            },
          );
          this.sharing.refreshAfterChange();
          this.changed.emit();
        }
      } else {
        const { calendar } = await this.sharing.saveCalendar(
          this.calendar,
          this.calendarTitle,
          this.calendarColor,
        );
        if (this.api.token() !== token) return;
        this.localCalendarChanged.emit({id: calendar.id, calendar});
      }
      this.closePanel();
    });
  }
  deleteCalendar() {
    void this.run(async () => {
      if (!this.calendar || !this.calendarRemoval) return;
      const calendar = this.calendar, token = this.api.token();
      if (calendar.provider) await this.providerWorkspace.deleteCalendar(calendar);
      else {
        await this.sharing.removeCalendar(calendar);
        if (this.api.token() !== token) return;
        if (calendar.ownerId) this.changed.emit();
        else {
          this.localCalendarChanged.emit({id: calendar.id});
          this.sharing.refreshAfterChange();
        }
      }
      this.closePanel();
    });
  }
  readonly accessLoading = signal(false);
  readonly accessFailed = signal(false);
  readonly pendingRemoval = signal<SharingPerson | null>(null);
  accessCalendar: DeviceCalendar | null = null;
  private accessKey = "";
  private accessSession: string | null = null;
  private readGeneration = 0;
  private accessReads = new Map<string, { expires: number; result: Promise<AccessSnapshot> }>();
  readonly sharingSectionError = computed(() => {
    const errors = this.sharing.sectionErrors();
    if (this.destination() === "pending") return errors["eventInvites"] || errors["calendarInvites"];
    if (this.destination()) return errors["shared"];
    return Object.values(errors).find(Boolean);
  });

  constructor() {
    effect(() => {
      const change = this.sharing.recipientsChanged();
      if (change) untracked(() => {
        this.accessReads.clear();
        if (this.panel() === "recipients" && this.sharedEvent?.id === change.id) this.recipients(this.sharedEvent);
      });
    });
  }

  private async readAccess(parts: unknown[], load: () => Promise<AccessSnapshot>) {
    const generation = ++this.readGeneration;
    const token = this.api.token();
    if (this.accessSession !== token) {
      this.accessReads.clear();
      this.accessSession = token;
    }
    const key = JSON.stringify(parts);
    this.accessKey = key;
    this.error.set("");
    this.accessFailed.set(false);
    this.pendingRemoval.set(null);
    const now = Date.now();
    for (const [id, entry] of this.accessReads) {
      if (entry.expires <= now) this.accessReads.delete(id);
    }
    let entry = this.accessReads.get(key);
    if (!entry) {
      entry = { expires: now + accessCacheLifetimeMs, result: load() };
      this.accessReads.set(key, entry);
    }
    this.accessLoading.set(true);
    const current = () => this.readGeneration === generation && this.api.token() === token;
    try {
      const snapshot = await entry.result;
      if (!current()) return;
      const rows = snapshot.people.map(p => ({ ...p }));
      if (this.panel() === "provider-sharing") this.providerAccess.set(rows);
      else {
        this.people = rows;
        this.sharedCalendar = snapshot.calendar ?? null;
      }
    } catch (error) {
      if (this.accessReads.get(key) === entry) this.accessReads.delete(key);
      if (current()) {
        this.accessFailed.set(true);
        this.error.set(error instanceof Error ? error.message : "Please try again.");
      }
    } finally {
      if (current()) this.accessLoading.set(false);
    }
  }

  retryAccess() {
    this.accessReads.delete(this.accessKey);
    if (this.panel() === "recipients" && this.sharedEvent) this.recipients(this.sharedEvent);
    if (this.panel() === "calendar-sharing" && this.accessCalendar) this.shareCalendar(this.accessCalendar);
    if (this.panel() === "provider-sharing" && this.providerCalendar) this.openProviderAccess(this.providerCalendar);
  }
  shareCalendar(calendar: DeviceCalendar) {
    this.accessCalendar = calendar;
    this.sharedCalendar = null;
    this.sharedEvent = null;
    this.people = [];
    this.removedPeople = [];
    this.panel.set("calendar-sharing");
    void this.readAccess(["calendar", calendar.ownerId, calendar.id, calendar.updatedAt], async () => {
      const shared = await this.sharing.calendarSharing(calendar);
      return { calendar: shared, people: shared.recipients ?? [] };
    });
  }
  addPerson() {
    this.people = [...this.people, { email: "", access: "reader" }];
  }
  removePerson(index: number) {
    const p = this.people[index];
    if (this.sharedCalendar && p.email) this.removedPeople.push(p.email);
    else if (p.id) this.removedPeople.push(p.id);
    this.people = this.people.filter((_, i) => i !== index);
  }
  validPeople() {
    return this.people.every((p) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email));
  }
  savePeople() {
    const calendar = this.sharedCalendar;
    if (!calendar || this.accessLoading() || this.accessFailed()) return;
    void this.run(async () => {
      await this.sharing.saveCalendarSharing(calendar, this.people, this.removedPeople);
      this.accessReads.delete(this.accessKey);
      this.sharing.refreshAfterChange();
      this.closePanel();
    });
  }
  recipients(event: SharedEvent) {
    if (this.destination() !== "sent" && event.access !== "owner") return;
    this.sharedEvent = event;
    this.sharedCalendar = null;
    this.people = [];
    this.panel.set("recipients");
    void this.readAccess(["event", event.id, event.feedId, event.recipientsUpdatedAt], async () => {
      const { recipients } = await this.sharing.request<{ recipients: SharingPerson[] }>(
        `/events/${encodeURIComponent(event.id)}/recipients`);
      return { people: recipients };
    });
  }
  changeRecipient(person: SharingPerson, access?: CalendarAccess) {
    const event = this.sharedEvent;
    if (!event || !person.id || person.isOriginalOwner || (access && (person.isAnonymous || person.access === access))) return;
    this.pendingRemoval.set(null);
    void this.run(async () => {
      const result = await this.sharing.request<{ recipients: SharingPerson[] }>(
        `/events/${encodeURIComponent(event.id)}/recipients`, "PUT", {
          updates: access ? [{ id: person.id, access }] : [], removedIds: access ? [] : [person.id],
        });
      this.accessReads.set(this.accessKey, {
        expires: Date.now() + accessCacheLifetimeMs,
        result: Promise.resolve({ people: result.recipients }),
      });
      this.people = result.recipients;
    });
  }
  recipientEmail(person: SharingPerson) {
    return person.isAnonymous ? this.localization.text("Anonymous recipient") :
      person.emails?.[0] || person.email || person.identities?.find(i => i.email)?.email || this.localization.text("Cloud Calendars user");
  }
  recipientSubtitle(person: SharingPerson) {
    if (person.isAnonymous) return this.localization.text("Not signed in");
    if (person.isOriginalOwner) return this.localization.text("Original creator");
    if (!person.userId) return this.localization.text("Invitation pending");
    return person.identities?.map(i => this.displayRole(i.provider)).join(", ");
  }
  resendRecipient(person: SharingPerson) {
    const event = this.sharedEvent, email = person.emails?.[0] || person.email;
    if (!event?.feedId || !email || person.isAnonymous || person.userId || person.isOriginalOwner) return;
    void this.run(async () => {
      const url = new URL(this.api.apiBaseURL + "/event-invites/open");
      url.search = new URLSearchParams({ e: event.id, c: event.feedId, title: event.title }).toString();
      await this.sharing.inviteEventRecipients(event.id, url.href, [{ email, access: person.access }]);
    });
  }
  respond(item: PendingInvitation, accept: boolean) {
    void this.run(async () => {
      await this.sharing.respond(item, accept);
      this.changed.emit();
    });
  }
  displayRole(value?: string) {
    return value ? value.charAt(0).toUpperCase() + value.slice(1) : "";
  }
  readonly challenge = signal<{
    challengeId: string;
    webEmail?: string;
    iosEmail?: string;
  } | null>(null);
  approveBrowser() {
    void this.run(async () => {
      const challenge = this.challenge();
      if (!challenge) return;
      await this.sharing.request("/auth/ios-qr/approve", "POST", {
        challengeId: challenge.challengeId,
      });
      this.challenge.set(null);
      this.qrMessage = "Browser sign-in approved.";
      this.qrInput = "";
    });
  }
  openImport() {
    this.challenge.set(null);
    this.qrInput = "";
    this.qrMessage = "";
    this.panel.set("scan");
  }
  async importLink(value: string) {
    await this.run(async () => {
      let url: URL;
      try {
        url = new URL(value);
      } catch {
        throw new Error("Choose a Cloud Calendars QR code.");
      }
      if (
        !["https:", "cloudcalendars:"].includes(url.protocol) ||
        (url.protocol === "https:" &&
          ![
            "cloud-calendars.com",
            "www.cloud-calendars.com",
            "api.cloud-calendars.com",
            "storage.wonek.com",
          ].includes(url.hostname))
      )
        throw new Error("This is not a Cloud Calendars invitation.");
      if (
        url.pathname.split("/").includes("app-auth") ||
        url.hostname === "app-auth"
      ) {
        const challengeId =
          url.searchParams.get("c") ??
          url.searchParams.get("challenge") ??
          url.searchParams.get("challengeId");
        if (!challengeId || !/^[A-Za-z0-9_-]{12,64}$/.test(challengeId))
          throw new Error("Invalid sign-in code.");
        const info = await this.sharing.request<any>(
          "/auth/ios-qr/info?c=" + encodeURIComponent(challengeId),
        );
        this.challenge.set({ ...info, challengeId });
        return;
      }
      const ownerId = url.searchParams.get("o"),
        calendarId = url.searchParams.get("c");
      if (ownerId && calendarId) {
        const response = await this.sharing.request<{
          calendar: SharedCalendar;
        }>(
          `/icloud-calendars/${encodeURIComponent(calendarId)}/sharing?ownerId=${encodeURIComponent(ownerId)}`,
        );
        if (response.calendar.calendarKind !== "app_local")
          throw new Error("iCloud calendars are available in the app.");
        await this.sharing.request("/icloud-calendar-invites/accept", "POST", {
          ownerId,
          calendarId,
        });
      } else {
        const eventId =
            url.searchParams.get("e") ?? url.searchParams.get("eventId"),
          feedId =
            url.searchParams.get("c") ??
            url.searchParams.get("f") ??
            url.searchParams.get("feedId");
        if (!eventId || !feedId)
          throw new Error("This QR code does not contain an event invitation.");
        await this.sharing.request("/received-invites", "POST", {
          eventId,
          feedId,
        });
      }
      this.sharing.refreshAfterChange();
      this.changed.emit();
      this.closePanel();
    });
  }
  private async decodeQR(
    image: CanvasImageSource,
    width: number,
    height: number,
  ) {
    const canvas = document.createElement("canvas");
    const scale = Math.min(1, 1200 / Math.max(width, height));
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) throw new Error("Could not read the image.");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
    const { default: decode } = await import("jsqr");
    return decode(pixels.data, pixels.width, pixels.height)?.data;
  }
  async scanImage(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    await this.run(async () => {
      const image = await createImageBitmap(file);
      try {
        const code = await this.decodeQR(image, image.width, image.height);
        if (!code) throw new Error("No QR code found.");
        this.qrInput = code;
        this.qrMessage = "QR code found. Review the invitation, then open it.";
      } finally {
        image.close();
      }
    });
  }
  async startCamera(video: HTMLVideoElement) {
    await this.run(async () => {
      this.stopCamera();
      this.camera = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      video.srcObject = this.camera;
      await video.play();
      let decoding = false;
      this.scanTimer = setInterval(async () => {
        if (decoding || !video.videoWidth) return;
        decoding = true;
        try {
          const code = await this.decodeQR(
            video,
            video.videoWidth,
            video.videoHeight,
          );
          if (code) {
            this.qrInput = code;
            this.qrMessage = "QR code found.";
            this.stopCamera();
          }
        } catch {
        } finally {
          decoding = false;
        }
      }, 500);
    });
  }
  stopCamera() {
    this.camera?.getTracks().forEach((t) => t.stop());
    this.camera = undefined;
    if (this.scanTimer) clearInterval(this.scanTimer);
  }
  ngOnDestroy() {
    ++this.readGeneration;
    this.accessReads.clear();
    this.stopCamera();
  }
}
