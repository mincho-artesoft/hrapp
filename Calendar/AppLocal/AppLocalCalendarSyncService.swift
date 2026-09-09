import Foundation

/// Synchronizes calendars that are owned by Cloud Calendars itself. These
/// records deliberately never pass through EventKit, so Apple Calendar and
/// other calendar apps cannot discover them.
@MainActor
enum AppLocalCalendarSyncService {
    private struct Baseline: Codable, Equatable {
        var title: String
        var color: String
        var timeZone: String
        var events: [CloudCalendarsAPI.SharedICloudCalendarEvent]
        var metadataUpdatedAt: String?
        var eventsUpdatedAt: String?
    }

    // Persist the exact last applied/uploaded revision so a restart cannot
    // mistake an offline edit for stale data. Isolate accounts/environments.
    private static var baselineStorageKey: String {
        "appLocal.syncBaselines.v2.\(CloudCalendarsAPI.baseURL.host ?? "").\(CalendarFeedSession.existing?.email?.lowercased() ?? "anonymous")"
    }
    private static var baselines: [String: Baseline] {
        get {
            guard let data = UserDefaults.standard.data(forKey: baselineStorageKey) else { return [:] }
            return (try? JSONDecoder().decode([String: Baseline].self, from: data)) ?? [:]
        }
        set {
            if let data = try? JSONEncoder().encode(newValue) {
                UserDefaults.standard.set(data, forKey: baselineStorageKey)
            }
        }
    }
    private static var isSyncing = false
    private static var needsAnotherPass = false

    @discardableResult
    static func syncAll() async -> Int {
        guard let session = CalendarFeedSession.existing else { return 0 }
        guard !isSyncing else {
            needsAnotherPass = true
            return 0
        }
        isSyncing = true
        defer {
            isSyncing = false
            if needsAnotherPass {
                needsAnotherPass = false
                Task { @MainActor in _ = await syncAll() }
            }
        }

        let store = AppLocalCalendarStore.shared
        var changes = 0

        for calendar in store.ownedCalendars where calendar.remoteCalendarID != nil {
            do {
                if try await syncOwned(calendar, store: store, session: session) {
                    changes += 1
                }
            } catch {
                print("App-local owned calendar sync failed: \(error.localizedDescription)")
            }
        }

        do {
            let remote = try await CloudCalendarsAPI
                .iCloudCalendarsSharedWithMe(session: session)
                .filter { $0.calendarKind == "app_local" }
            var remoteKeys = Set<String>()
            for calendar in remote {
                remoteKeys.insert(AppLocalCalendarStore.remoteKey(
                    ownerID: calendar.ownerId,
                    calendarID: calendar.calendarId
                ))
                if try await syncReceived(calendar, store: store, session: session) {
                    changes += 1
                }
            }
            store.removeRemoteCalendarsNotPresent(in: remoteKeys)
        } catch {
            print("App-local received calendar sync failed: \(error.localizedDescription)")
        }

        return changes
    }

    @discardableResult
    private static func syncOwned(
        _ calendar: AppLocalCalendarRecord,
        store: AppLocalCalendarStore,
        session: CloudCalendarsAPI.Session
    ) async throws -> Bool {
        let calendarID = calendar.shareID
        var sharing = try await CloudCalendarsAPI.iCloudCalendarSharing(
            calendarId: calendarID,
            session: session
        )
        if sharing.title.isEmpty {
            sharing = try await CloudCalendarsAPI.saveICloudCalendarSharing(
                calendarId: calendarID,
                title: calendar.title,
                color: calendar.colorHex,
                timeZone: calendar.timeZoneIdentifier,
                calendarKind: "app_local",
                recipients: [],
                session: session
            )
        }
        let remote = CloudCalendarsAPI.SharedICloudCalendar(
            id: calendarID, ownerId: sharing.ownerId ?? "", ownerEmail: sharing.ownerEmail,
            calendarId: calendarID, title: sharing.title, color: sharing.color,
            timeZone: sharing.timeZone, calendarKind: "app_local", access: .owner,
            invitedAt: nil, updatedAt: sharing.updatedAt, events: sharing.events,
            eventsUpdatedAt: sharing.eventsUpdatedAt, windowStart: sharing.windowStart,
            windowEnd: sharing.windowEnd, revokedAt: nil, revokedReason: nil)
        return try await syncSnapshot(remote, local: calendar, owned: true, store: store, session: session)
    }

    @discardableResult
    private static func syncReceived(
        _ remote: CloudCalendarsAPI.SharedICloudCalendar,
        store: AppLocalCalendarStore,
        session: CloudCalendarsAPI.Session
    ) async throws -> Bool {
        let local = store.receivedCalendars.first {
            $0.remoteOwnerID == remote.ownerId && $0.remoteCalendarID == remote.calendarId
        }
        return try await syncSnapshot(remote, local: local, owned: false, store: store, session: session)
    }

    private static func syncSnapshot(
        _ remote: CloudCalendarsAPI.SharedICloudCalendar,
        local: AppLocalCalendarRecord?, owned: Bool,
        store: AppLocalCalendarStore, session: CloudCalendarsAPI.Session
    ) async throws -> Bool {
        let key = AppLocalCalendarStore.remoteKey(ownerID: remote.ownerId, calendarID: remote.calendarId)
        let previous = baselines[key]
        let current = baseline(remote)
        let localEvents = local.map { calendar in
            portableEvents(store.events.filter { $0.calendarID == calendar.id })
        } ?? []
        var merged = current
        if !remote.isRevoked, remote.access != .reader, let local {
            if let previous {
                merged.events = AppLocalCalendarMerge.events(base: previous.events, local: localEvents, remote: current.events)
                if remote.access == .owner {
                    if current.title == previous.title { merged.title = local.title }
                    if current.color == previous.color { merged.color = local.colorHex.uppercased() }
                    if current.timeZone == previous.timeZone { merged.timeZone = local.timeZoneIdentifier }
                }
            } else if owned && remote.eventsUpdatedAt == nil {
                // Only a brand-new share can be seeded without a baseline.
                merged.events = localEvents
            }
        }
        let metadataChanged = merged.title != current.title || merged.color != current.color || merged.timeZone != current.timeZone
        if metadataChanged {
            let sharing = try await CloudCalendarsAPI.iCloudCalendarSharing(
                calendarId: remote.calendarId, ownerId: owned ? nil : remote.ownerId, session: session)
            let saved = try await CloudCalendarsAPI.saveICloudCalendarSharing(
                calendarId: remote.calendarId, ownerId: owned ? nil : remote.ownerId,
                title: merged.title, color: merged.color, timeZone: merged.timeZone, calendarKind: "app_local",
                recipients: sharing.recipients.map { (email: $0.email, access: $0.access) },
                expectedUpdatedAt: current.metadataUpdatedAt, session: session)
            merged.metadataUpdatedAt = saved.updatedAt
        }
        if merged.events != current.events, let local {
            let window = syncWindow(for: store.events.filter { $0.calendarID == local.id })
            merged.eventsUpdatedAt = try await CloudCalendarsAPI.saveICloudCalendarEvents(
                calendarId: remote.calendarId,
                ownerId: owned ? nil : remote.ownerId,
                events: merged.events,
                windowStart: window.start,
                windowEnd: window.end,
                expectedUpdatedAt: remote.eventsUpdatedAt,
                session: session
            )
        }
        let resolved = CloudCalendarsAPI.SharedICloudCalendar(
            id: remote.id, ownerId: remote.ownerId, ownerEmail: remote.ownerEmail, calendarId: remote.calendarId,
            title: merged.title, color: merged.color, timeZone: merged.timeZone, calendarKind: "app_local",
            access: remote.access, invitedAt: remote.invitedAt, updatedAt: merged.metadataUpdatedAt,
            events: merged.events, eventsUpdatedAt: merged.eventsUpdatedAt, windowStart: remote.windowStart,
            windowEnd: remote.windowEnd, revokedAt: remote.revokedAt, revokedReason: remote.revokedReason)
        let changed = store.applyRemoteCalendar(resolved, ownedCalendarID: owned ? local?.id : nil)
        baselines[key] = merged
        return changed || merged != current
    }

    private static func baseline(
        _ remote: CloudCalendarsAPI.SharedICloudCalendar
    ) -> Baseline {
        Baseline(
            title: remote.title,
            color: remote.color.uppercased(),
            timeZone: remote.timeZone,
            events: normalized(remote.events ?? []),
            metadataUpdatedAt: remote.updatedAt,
            eventsUpdatedAt: remote.eventsUpdatedAt
        )
    }

    private static func portableEvents(
        _ values: [AppLocalEventRecord]
    ) -> [CloudCalendarsAPI.SharedICloudCalendarEvent] {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return normalized(values.map { event in
            CloudCalendarsAPI.SharedICloudCalendarEvent(
                id: event.shareID,
                title: event.title,
                start: formatter.string(from: event.startDate),
                end: formatter.string(from: event.endDate),
                allDay: event.isAllDay,
                location: event.location.isEmpty ? nil : event.location,
                url: event.urlString.isEmpty ? nil : event.urlString,
                details: SharedEventDetails(
                    notes: event.notes.isEmpty ? nil : event.notes,
                    timeZone: event.timeZoneIdentifier,
                    alarms: event.alarms.map {
                        SharedEventAlarm(relativeOffset: $0.relativeOffset)
                    },
                    recurrenceRules: event.recurrenceRules ?? [],
                    structuredLocation: event.structuredLocation,
                    videoCallURL: event.videoCallURL,
                    travelTime: event.travelTime,
                    attachments: event.attachments?.map(\.sharedValue)
                )
            )
        })
    }

    private static func normalized(
        _ events: [CloudCalendarsAPI.SharedICloudCalendarEvent]
    ) -> [CloudCalendarsAPI.SharedICloudCalendarEvent] {
        events.sorted { lhs, rhs in
            lhs.start == rhs.start ? lhs.id < rhs.id : lhs.start < rhs.start
        }
    }

    private static func syncWindow(for events: [AppLocalEventRecord]) -> (start: Date, end: Date) {
        let calendar = Calendar.current
        let fallbackStart = calendar.date(byAdding: .year, value: -1, to: Date()) ?? Date()
        let fallbackEnd = calendar.date(byAdding: .year, value: 3, to: Date()) ?? Date()
        return (
            events.map(\.startDate).min().map { min($0.addingTimeInterval(-86_400), fallbackStart) }
                ?? fallbackStart,
            events.map(\.endDate).max().map { max($0.addingTimeInterval(86_400), fallbackEnd) }
                ?? fallbackEnd
        )
    }
}
