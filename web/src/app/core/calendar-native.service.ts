import { Injectable, computed, inject, signal } from "@angular/core";
import { webEventDetails, nativeEventDetails, withWebEventDetails } from "./calendar-native-model";
import {
  CalendarPlatformApiService,
  DeviceCalendar,
  WebCalendarEvent,
} from "./calendar-platform-api.service";

export type CalendarAccess = "reader" | "writer" | "owner";
export interface SharingPerson {
  id?: string;
  userId?: string;
  email: string;
  emails?: string[];
  access: CalendarAccess;
  isOriginalOwner?: boolean;
  isPending?: boolean;
  isAnonymous?: boolean;
  identities?: { provider: string; email?: string }[];
}
export interface SharedCalendar extends DeviceCalendar {
  ownerId: string;
  calendarId?: string;
  currentAccess?: CalendarAccess;
  recipients?: SharingPerson[];
  events?: WebCalendarEvent[];
  eventsUpdatedAt?: string;
  windowStart?: string;
  windowEnd?: string;
  isRevoked?: boolean;
  revokedReason?: string;
  replicaID?: string;
}
export interface SharedEvent extends WebCalendarEvent {
  localEventIdentifier?: string;
  replicaIdentifiers?: string[];
  placementCalendarId?: string;
  feedId: string;
  access?: CalendarAccess;
  recipientsUpdatedAt?: string;
}
// A share keeps its own identity when its local copy moves, or is shared again.
function indexSharedCopies(shares: SharedEvent[]) {
  const byId = new Map(shares.map(share => [share.id, share]));
  const byAlias = new Map<string, SharedEvent>();
  for (const share of shares) {
    for (const alias of [share.localEventIdentifier, ...(share.replicaIdentifiers ?? [])]) {
      if (!alias) continue;
      const key = (share.placementCalendarId ?? "") + "/" + alias;
      const previous = byAlias.get(key);
      if (!previous || (previous.status === "cancelled" && share.status !== "cancelled")) byAlias.set(key, share);
    }
  }
  return (event: WebCalendarEvent): SharedEvent | undefined => {
    const exact = byId.get(event.sharingEventId ?? event.id);
    if (exact) return exact;
    const prefix = `native.${event.calendarId}.`;
    const local = event.id.startsWith(prefix) ? event.id.slice(prefix.length) : event.id;
    for (const alias of [event.id, local, event.remoteID]) {
      if (!alias) continue;
      const copy = byAlias.get((event.calendarId ?? "") + "/" + alias) ?? byAlias.get("/" + alias);
      if (copy) return copy;
    }
    return undefined;
  };
}

export interface PendingInvitation {
  previousId?: string;
  eventUrl?: string;
  location?: string;
  id: string;
  eventId?: string;
  feedId?: string;
  calendarId?: string;
  ownerId?: string;
  calendarKind?: string;
  title: string;
  start?: string;
  end?: string;
  allDay?: boolean;
  senderEmail?: string;
  senderName?: string;
  ownerEmail?: string;
  color?: string;
  access: CalendarAccess;
}
export function isWebCalendar(calendar: {
  accountLocal?: boolean;
  ownerId?: string;
  source?: string;
  calendarKind?: string;
  providerMirrorID?: string;
}): boolean {
  const source = (calendar.source ?? "").trim();
  // Older device replicas identify provider accounts only by their source label.
  const deviceOnlyLocal = !calendar.accountLocal && !calendar.ownerId && /^(local calendars?|локални календари)$/i.test(source);
  return !deviceOnlyLocal && !calendar.providerMirrorID &&
    !/^(google|microsoft)\s*·/i.test(source) &&
    !["icloud", "eventkit", "subscription", "subscribed"].includes(calendar.calendarKind?.toLowerCase() ?? "") &&
    !/^(subscribed( calendars)?|абонирани календари|абонаментни календари)$/i.test(source) &&
    !/icloud/i.test(source);
}

@Injectable({ providedIn: "root" })
export class CalendarNativeService {
  readonly api = inject(CalendarPlatformApiService);
  readonly outgoing = signal<SharedEvent[]>([]);
  readonly received = signal<SharedEvent[]>([]);
  private readonly eventInvites = signal<PendingInvitation[]>([]);
  private readonly calendarInvites = signal<PendingInvitation[]>([]);
  readonly invitations = computed(() => [...this.calendarInvites(), ...this.eventInvites()]);
  private readonly loadedSections = new Set<string>();
  readonly pendingSections = signal<ReadonlySet<string>>(new Set());
  readonly sharedCalendars = signal<SharedCalendar[]>([]);
  readonly sectionErrors = signal<Record<string, string>>({});
  readonly recipientsChanged = signal<{ id: string } | null>(null);
  readonly colorOverrides = signal<Record<string, string>>({});
  private colorsKey() {
    return "cc.mac.calendarColors." + (this.api.profile()?.principalId ?? "");
  }
  setCalendarColor(id: string, color: string) {
    this.colorOverrides.update((c) => ({ ...c, [id]: color }));
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(
        this.colorsKey(),
        JSON.stringify(this.colorOverrides()),
      );
    }
  }
  resetCalendarColor(id: string) {
    this.colorOverrides.update((c) => {
      const next = { ...c };
      delete next[id];
      return next;
    });
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(
        this.colorsKey(),
        JSON.stringify(this.colorOverrides()),
      );
    }
  }
  private generation = 0;
  private sessionToken: string | null = null;
  private inFlight?: Promise<void>;
  readonly roles = [
    { value: "reader", label: "Reader" },
    { value: "writer", label: "Writer" },
    { value: "owner", label: "Owner" },
  ];
  request<T>(path: string, method = "GET", body?: unknown) {
    return this.api.nativeCalendarRequest<T>(path, method, body);
  }
  clear() {
    ++this.generation;
    this.inFlight = undefined;
    this.outgoing.set([]);
    this.received.set([]);
    this.eventInvites.set([]);
    this.calendarInvites.set([]);
    this.loadedSections.clear();
    this.pendingSections.set(new Set());
    this.sharedCalendars.set([]);
    this.sectionErrors.set({});
    this.recipientsChanged.set(null);
  }
  refresh({ background = false } = {}): Promise<void> {
    if (this.sessionToken !== this.api.token()) {
      this.clear();
      this.sessionToken = this.api.token();
      try {
        this.colorOverrides.set(
          typeof localStorage !== "undefined"
            ? JSON.parse(localStorage.getItem(this.colorsKey()) || "{}")
            : {},
        );
      } catch {
        this.colorOverrides.set({});
      }
    }
    if (this.inFlight) return this.inFlight;
    const generation = this.generation,
      token = this.api.token();
    if (!token) {
      this.clear();
      return Promise.resolve();
    }
    if (!background) this.sectionErrors.set({});
    const current = () =>
      generation === this.generation && this.api.token() === token;
    this.pendingSections.set(new Set(["shared", "eventInvites", "calendarInvites"].filter(section => !this.loadedSections.has(section))));
    const track = (section: string, task: Promise<void>) => task.then(() => {
      if (!current()) return;
      this.loadedSections.add(section);
      if (this.sectionErrors()[section]) this.sectionErrors.update(errors => ({ ...errors, [section]: "" }));
    }).catch(error => {
      if (current()) this.sectionErrors.update(errors => ({
        ...errors, [section]: error instanceof Error ? error.message : "Could not refresh sharing.",
      }));
    }).finally(() => {
      if (current()) this.pendingSections.update(sections => {
        const remaining = new Set(sections);
        remaining.delete(section);
        return remaining;
      });
    });
    const tasks = [
      track("shared", this.request<{ outgoing: SharedEvent[]; received: SharedEvent[] }>(
        "/shared-state",
      ).then(async s => {
        const normalize = async (event: SharedEvent) => {
          const local = event.localEventIdentifier;
          if (!local) return { ...withWebEventDetails(event), replicaIdentifiers: [] };
          const keys = [local, local + ":"];
          const start = Date.parse(event.start);
          if (Number.isFinite(start)) keys.push(local + ":" + new Date(start).toISOString().replace(/\.000Z$/, "Z"));
          const replicaIdentifiers = [local, ...await Promise.all(keys.map(key => this.sharingID(key)))];
          return { ...withWebEventDetails(event), replicaIdentifiers };
        };
        const [sent, received] = await Promise.all([
          Promise.all((s.outgoing ?? []).map(normalize)), Promise.all((s.received ?? []).map(normalize)),
        ]);
        if (current()) {
          this.outgoing.set(sent);
          this.received.set(received);
        }
      })),
      track("eventInvites", this.request<{ invitations: PendingInvitation[] }>(
        "/event-invitations/pending",
      ).then(result => {
        if (current()) this.eventInvites.set(result.invitations ?? []);
      })),
      track("calendarInvites", this.request<{ invitations: PendingInvitation[] }>(
        "/icloud-calendar-invitations/pending",
      ).then(result => {
        if (current()) this.calendarInvites.set((result.invitations ?? []).filter(i => i.calendarKind === "app_local"));
      })),
      track("calendars", this.request<{ calendars: SharedCalendar[] }>(
        "/icloud-calendars-shared-with-me",
      ).then((s) => {
        if (current())
          this.sharedCalendars.set(
            (s.calendars ?? [])
              .filter((c) => c.calendarKind === "app_local" && c.revokedReason !== "owner_deleted")
              .map((c) => ({
                ...c,
                access: c.currentAccess ?? c.access,
                events: (c.events ?? []).map((e) => ({
                  ...e,
                  details: webEventDetails(e.details),
                })),
              })),
          );
      })),
    ];
    const work = Promise.all(tasks).then(() => {
      if (current()) this.inFlight = undefined;
    });
    this.inFlight = work;
    return work;
  }
  refreshAfterChange() {
    ++this.generation;
    this.inFlight = undefined;
    void this.refresh({ background: true });
  }
  async inviteEventRecipients(id: string, eventUrl: string, invitations: { email: string; access: string }[]) {
    await this.request(`/events/${encodeURIComponent(id)}/invitations`, "POST", { eventUrl, invitations });
    this.recipientsChanged.set({ id });
  }
  async respond(invitation: PendingInvitation, accept: boolean) {
    if (invitation.calendarId) {
      await this.request(
        accept
          ? "/icloud-calendar-invites/accept"
          : `/icloud-calendar-invitations/pending/${encodeURIComponent(invitation.calendarId)}/decline`,
        "POST",
        { ownerId: invitation.ownerId, calendarId: invitation.calendarId },
      );
    } else {
      await this.request(
        accept
          ? "/received-invites"
          : `/event-invitations/pending/${encodeURIComponent(invitation.eventId!)}/decline`,
        "POST",
        { eventId: invitation.eventId, feedId: invitation.feedId },
      );
    }
    this.refreshAfterChange();
  }
  private async readAccountCalendar(id: string) {
    const result = await this.request<{calendar: any}>("/ios/calendars/sync", "POST", {
      id, deviceId: "web", readOnly: true,
    });
    return result.calendar;
  }

  async saveCalendar(
    calendar: DeviceCalendar | null,
    title: string,
    color: string,
  ) {
    const stored = calendar ? await this.readAccountCalendar(calendar.id) : null;
    if (calendar && !stored)
      throw new Error("This calendar is managed by its provider.");
    const id = stored?.id ?? crypto.randomUUID();
    return this.request<{calendar: DeviceCalendar}>("/ios/calendars/sync", "POST", {
      ...stored,
      id,
      deviceId: stored?.deviceId ?? "web",
      deviceName: stored?.deviceName ?? "Web Calendar",
      accountLocal: true,
      title: title.trim(),
      color,
      source: "Local Calendars",
      allowsChanges: true,
      available: true,
      expectedRevision: stored?.revision ?? 0,
      events: stored?.events ?? [],
    });
  }
  async removeCalendar(calendar: DeviceCalendar) {
    if (calendar.ownerId)
      return this.request(
        `/icloud-calendars/${encodeURIComponent((calendar as SharedCalendar).calendarId ?? calendar.id)}/access?ownerId=${encodeURIComponent(calendar.ownerId)}`,
        "DELETE",
      );
    if (!calendar.accountLocal)
      return this.api.removeDeviceCalendarFromWeb(calendar.id);
    const stored = await this.readAccountCalendar(calendar.id);
    if (!stored) throw new Error("This calendar is managed by its provider.");
    return this.request("/ios/calendars/sync", "POST", {
      ...stored,
      available: false,
      expectedRevision: stored.revision,
    });
  }
  async calendarSharing(calendar: DeviceCalendar): Promise<SharedCalendar> {
    const id =
      calendar.sharingCalendarID ??
      (calendar.ownerId
        ? ((calendar as SharedCalendar).calendarId ?? calendar.id)
        : await this.sharingID(calendar.id));
    try {
      const remote = (
        await this.request<{ calendar: SharedCalendar }>(
          `/icloud-calendars/${id}/sharing${calendar.ownerId ? "?ownerId=" + encodeURIComponent(calendar.ownerId) : ""}`,
        )
      ).calendar;
      return {
        ...calendar,
        ...remote,
        title: remote.title || calendar.title,
        color: remote.title ? remote.color : calendar.color,
        replicaID: calendar.accountLocal ? calendar.id : undefined,
      };
    } catch (e: any) {
      if (e.status !== 404) throw e;
      return {
        ...calendar,
        id,
        ownerId: this.api.profile()?.principalId ?? "",
        recipients: [],
        calendarKind: "app_local",
        replicaID: calendar.accountLocal ? calendar.id : undefined,
      };
    }
  }
  async saveCalendarSharing(
    calendar: SharedCalendar,
    recipients: SharingPerson[],
    removed: string[],
  ) {
    const response = await this.request<{ calendar: SharedCalendar }>(
      `/icloud-calendars/${encodeURIComponent(calendar.id)}/sharing`,
      "PUT",
      {
        title: calendar.title,
        color: calendar.color,
        timeZone: this.api.profile()?.timeZone ?? "UTC",
        calendarKind: "app_local",
        ownerId: calendar.ownerId,
        expectedUpdatedAt: calendar.updatedAt,
        recipients: recipients.map((p) => ({
          email: p.email,
          access: p.access,
        })),
        preserveUnmentionedRecipients: true,
        removedRecipientEmails: removed,
      },
    );
    if (calendar.replicaID) {
      const stored = await this.readAccountCalendar(calendar.replicaID);
      if (stored) {
        const events = await Promise.all(
          stored.events.map(async (e: any) => ({
            ...e,
            id: /^[a-f0-9]{64}$/i.test(e.id)
              ? e.id
              : await this.sharingID(e.id),
          })),
        );
        const starts = events.map((e) => Date.parse(e.start)),
          ends = events.map((e) => Date.parse(e.end));
        await this.request(`/icloud-calendars/${calendar.id}/events`, "PUT", {
          ownerId: calendar.ownerId,
          expectedUpdatedAt: calendar.eventsUpdatedAt,
          events,
          windowStart: new Date(
            Math.min(Date.now(), ...starts) - 86400000,
          ).toISOString(),
          windowEnd: new Date(
            Math.max(Date.now(), ...ends) + 86400000,
          ).toISOString(),
        });
        await this.request("/ios/calendars/sync", "POST", {
          ...stored,
          sharingCalendarID: calendar.id,
          expectedRevision: stored.revision,
        });
      }
    }
    return response;
  }
  private readonly outgoingIndex = computed(() => indexSharedCopies(this.outgoing()));
  private readonly receivedIndex = computed(() => indexSharedCopies(this.received()));
  outgoingForEvent(event: WebCalendarEvent): SharedEvent | undefined { return this.outgoingIndex()(event); }
  receivedForEvent(event: WebCalendarEvent): SharedEvent | undefined { return this.receivedIndex()(event); }

  async prepareEvent(
    event: WebCalendarEvent,
  ): Promise<{ id: string; url: string }> {
    const received = this.received().find((e) => e.id === event.id);
    if (received && received.access !== "owner")
      throw new Error("Owner access is required to share this event.");
    const localID = event.id.startsWith("native.")
      ? event.id.split(".")[2]
      : event.id;
    const existing = this.outgoingForEvent(event);
    const id =
      existing?.id ??
      (/^(native|sharedcal)\./.test(event.id)
        ? "web_" + (await this.sharingID(event.id))
        : event.id);
    if (!received && !existing?.feedId)
      await this.request(`/events/${id}`, "PUT", {
        title: event.title,
        start: event.start,
        end: event.end,
        allDay: event.allDay,
        location: event.location,
        url: event.url,
        details: nativeEventDetails(event.details),
        localEventIdentifier: localID,
      });
    const feed =
      received?.feedId ??
      existing?.feedId ??
      (
        await this.request<{ feedId: string }>("/grants", "POST", {
          role: "viewer",
          eventId: id,
          feedName: event.title,
        })
      ).feedId;
    const base = this.api.apiBaseURL;
    const url = new URL(base + "/event-invites/open");
    url.searchParams.set("e", id);
    url.searchParams.set("c", feed);
    url.searchParams.set("title", event.title);
    void this.refresh({ background: true });
    return { id, url: url.href };
  }

  async updateSharedEvent(
    event: WebCalendarEvent,
    patch: Partial<WebCalendarEvent>,
    details?: WebCalendarEvent["details"],
  ): Promise<WebCalendarEvent> {
    const token = this.api.token();
    const received = this.received().find((e) => e.id === event.id);
    const feedId = event.receivedFeedId ?? received?.feedId;
    if (feedId && (event.receivedAccess ?? received?.access) === "reader")
      throw new Error("Reader access cannot edit this event.");
    const next = { ...event, ...patch, id: event.id, details: details ?? event.details };
    const saved = await this.request<{ event: WebCalendarEvent }>(`/events/${encodeURIComponent(event.id)}`, "PUT", {
      title: next.title,
      start: next.start,
      end: next.end,
      allDay: next.allDay,
      location: next.location,
      url: next.url,
      details: nativeEventDetails(next.details),
      expectedSequence: event.sequence,
      expectedUpdatedAt: event.updatedAt,
      ...(feedId ? { feedId } : {}),
    });
    const updated = { ...next, ...withWebEventDetails(saved.event), receivedFeedId: feedId, receivedAccess: event.receivedAccess ?? received?.access };
    if (token === this.api.token()) {
      const replace = (items: SharedEvent[]) => items.map(item => item.id === event.id ? { ...item, ...updated } : item);
      this.received.update(replace);
      this.outgoing.update(replace);
      this.refreshAfterChange();
    }
    return updated;
  }
  async updateCalendarEvent(
    event: WebCalendarEvent,
    patch: Partial<WebCalendarEvent>,
    details?: WebCalendarEvent["details"],
    deleting = false,
  ): Promise<WebCalendarEvent> {
    const token = this.api.token();
    const calendar = this.sharedCalendars().find(
      (c) => c.id === event.calendarId,
    );
    if (!calendar || calendar.access === "reader" || calendar.isRevoked)
      throw new Error("This calendar is read-only.");
    const id = event.id.split(".").at(-1)!;
    if (event.sharedCalendarRevision && event.sharedCalendarRevision !== calendar.eventsUpdatedAt) {
      throw new Error("This calendar changed on another device. Reopen the event before saving.");
    }
    const next = { ...event, ...patch, id, details: details ?? event.details };
    const events = (calendar.events ?? []).filter((e) => e.id !== id);
    if (!deleting) events.push(next);
    const result = await this.request<{ updatedAt: string }>(
      `/icloud-calendars/${calendar.calendarId}/events`,
      "PUT",
      {
        ownerId: calendar.ownerId,
        expectedUpdatedAt: calendar.eventsUpdatedAt,
        events: events.map((e) => ({
          ...e,
          details: nativeEventDetails(e.details),
        })),
        windowStart: calendar.windowStart,
        windowEnd: calendar.windowEnd,
      },
    );
    if (token === this.api.token()) {
      this.sharedCalendars.update(calendars => calendars.map(item => item.id === calendar.id
        ? { ...item, events, eventsUpdatedAt: result.updatedAt } : item));
      this.refreshAfterChange();
    }
    return { ...next, id: event.id, sharedCalendarRevision: result.updatedAt };
  }
  async syncOwnedCalendar(calendarID: string, changedEventId: string) {
    const stored = await this.readAccountCalendar(calendarID);
    if (!stored?.sharingCalendarID) return;
    const { calendar } = await this.request<{ calendar: SharedCalendar }>(
      `/icloud-calendars/${stored.sharingCalendarID}/sharing`,
    );
    const localID = changedEventId.split(".").at(-1)!;
    const sharedID = /^[a-f0-9]{64}$/i.test(localID) ? localID : await this.sharingID(localID);
    const changed = stored.events.find((event: WebCalendarEvent) => event.id === localID);
    // The sharing snapshot can already contain other devices' newer events.
    // Replace only the event affected by this edit or deletion.
    const events = (calendar.events ?? []).filter(event => event.id !== sharedID);
    if (changed) events.push({ ...changed, id: sharedID });
    await this.request(
      `/icloud-calendars/${stored.sharingCalendarID}/events`,
      "PUT",
      {
        events,
        expectedUpdatedAt: calendar.eventsUpdatedAt,
        windowStart: new Date(
          Math.min(Date.now(), ...events.map((e) => Date.parse(e.start))) -
            86400000,
        ).toISOString(),
        windowEnd: new Date(
          Math.max(Date.now(), ...events.map((e) => Date.parse(e.end))) +
            86400000,
        ).toISOString(),
      },
    );
  }
  async sharingID(id: string) {
    const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(id),
    );
    return [...new Uint8Array(digest)]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
}
