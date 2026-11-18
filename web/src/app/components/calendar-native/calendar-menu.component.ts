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
  inject,
  input,
  output,
  signal,
} from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { CalendarSymbolComponent } from "./calendar-symbol.component";
import { CalendarChoiceComponent } from "./calendar-choice.component";
import {
  CalendarNativeService,
  PendingInvitation,
  SharedCalendar,
  SharedEvent,
  SharingPerson,
} from "../../core/calendar-native.service";
import {
  CalendarPlatformApiService,
  DeviceCalendar,
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

@Component({
  selector: "cc-calendar-menu",
  standalone: true,
  imports: [
    CalendarNativeTextPipe,
    CalendarNativeDatePipe,
    CommonModule,
    FormsModule,
    CalendarSymbolComponent,
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

  async openProviderAccess(calendar: DeviceCalendar) {
    this.providerCalendar = calendar;
    this.panel.set("provider-sharing");
    await this.run(async () => {
      const r = await this.providerWorkspace.perform(calendar.provider!, {
        action: "list-access",
        calendarID: calendar.remoteID,
      });
      this.providerAccess.set(r.people);
    });
  }
  saveProviderPerson(person: { id?: string; email: string; access: string }) {
    void this.run(async () => {
      await this.providerWorkspace.perform(this.providerCalendar!.provider!, {
        action: "save-access",
        calendarID: this.providerCalendar!.remoteID,
        personID: person.id,
        email: person.email,
        access: person.access,
      });
      await this.openProviderAccess(this.providerCalendar!);
    });
  }
  deleteProviderPerson(person: { id?: string }) {
    void this.run(async () => {
      await this.providerWorkspace.perform(this.providerCalendar!.provider!, {
        action: "delete-access",
        calendarID: this.providerCalendar!.remoteID,
        personID: person.id,
      });
      this.providerAccess.update((list) => list.filter((p) => p !== person));
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
  readonly connect = output<"google" | "microsoft">();
  readonly disconnect = output<"google" | "microsoft">();
  readonly settingsChanged = output<void>();
  readonly openEvent = output<SharedEvent>();
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
    const groups = new Map<string, SharedEvent[]>();
    for (const e of this.currentEvents()) {
      const day = e.start.slice(0, 10);
      groups.set(day, [...(groups.get(day) ?? []), e]);
    }
    return [...groups]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, events]) => ({
        date,
        events: events.sort((a, b) => a.start.localeCompare(b.start)),
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
    if (this.isBrowser) {
      void this.sharing.refresh();
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
    this.panel.set("");
    this.error.set("");
    this.stopCamera();
  }
  saveCalendar() {
    void this.run(async () => {
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
          await this.sharing.refresh();
        }
      } else
        await this.sharing.saveCalendar(
          this.calendar,
          this.calendarTitle,
          this.calendarColor,
        );
      this.changed.emit();
      this.closePanel();
    });
  }
  deleteCalendar() {
    void this.run(async () => {
      if (!this.calendar) return;
      if (this.calendar.provider)
        await this.providerWorkspace.deleteCalendar(this.calendar);
      else await this.sharing.removeCalendar(this.calendar);
      this.changed.emit();
      this.closePanel();
    });
  }
  shareCalendar(calendar: DeviceCalendar) {
    this.panel.set("calendar-sharing");
    this.sharedCalendar = null;
    this.people = [];
    this.removedPeople = [];
    void this.run(async () => {
      this.sharedCalendar = await this.sharing.calendarSharing(calendar);
      this.people = (this.sharedCalendar.recipients ?? []).map((p) => ({
        ...p,
      }));
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
    void this.run(async () => {
      if (this.sharedCalendar)
        await this.sharing.saveCalendarSharing(
          this.sharedCalendar,
          this.people,
          this.removedPeople,
        );
      else if (this.sharedEvent)
        await this.sharing.request(
          `/events/${encodeURIComponent(this.sharedEvent.id)}/recipients`,
          "PUT",
          {
            updates: this.people
              .filter((p) => p.id && !p.isOriginalOwner)
              .map((p) => ({ id: p.id, access: p.access })),
            removedIds: this.removedPeople,
          },
        );
      await this.sharing.refresh();
      this.closePanel();
    });
  }
  recipients(event: SharedEvent) {
    if (event.access && event.access !== "owner") return;
    this.sharedEvent = event;
    this.sharedCalendar = null;
    this.people = [];
    this.removedPeople = [];
    this.panel.set("recipients");
    void this.run(async () => {
      const r = await this.sharing.request<{ recipients: SharingPerson[] }>(
        `/events/${encodeURIComponent(event.id)}/recipients`,
      );
      this.people = r.recipients.map((p) => ({
        ...p,
        email: p.email ?? p.emails?.[0] ?? "Anonymous recipient",
      }));
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
      await this.sharing.refresh();
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
    this.stopCamera();
  }
}
