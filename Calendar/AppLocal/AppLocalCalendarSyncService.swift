import Foundation

/// Synchronizes calendars that are owned by Cloud Calendars itself. These
/// records deliberately never pass through EventKit, so Apple Calendar and
/// other calendar apps cannot discover them.
@MainActor
enum AppLocalCalendarSyncService {
    private struct Baseline: Equatable {
        var title: String
        var color: String
        var events: [CloudCalendarsAPI.SharedICloudCalendarEvent]
        var metadataUpdatedAt: String?
        var eventsUpdatedAt: String?
    }

    private static var baselines: [String: Baseline] = [:]
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
        let existing = try? await CloudCalendarsAPI.iCloudCalendarSharing(
            calendarId: calendarID,
            session: session
        )
        let recipients = existing?.recipients.map { (email: $0.email, access: $0.access) } ?? []
        let metadataDiffers = existing == nil
            || existing?.title != calendar.title
            || existing?.color.uppercased() != calendar.colorHex.uppercased()
            || existing?.timeZone != calendar.timeZoneIdentifier
            || existing?.calendarKind != "app_local"

        let sharing: CloudCalendarsAPI.ICloudCalendarSharing
        if metadataDiffers {
            sharing = try await CloudCalendarsAPI.saveICloudCalendarSharing(
                calendarId: calendarID,
                title: calendar.title,
                color: calendar.colorHex,
                timeZone: calendar.timeZoneIdentifier,
                calendarKind: "app_local",
                recipients: recipients,
                expectedUpdatedAt: existing?.updatedAt,
                session: session
            )
        } else {
            sharing = existing!
        }

        let localEvents = portableEvents(store.events.filter { $0.calendarID == calendar.id })
        let remoteEvents = normalized(sharing.events ?? [])
        if localEvents != remoteEvents {
            let window = syncWindow(for: store.events.filter { $0.calendarID == calendar.id })
            _ = try await CloudCalendarsAPI.saveICloudCalendarEvents(
                calendarId: calendarID,
                events: localEvents,
                windowStart: window.start,
                windowEnd: window.end,
                expectedUpdatedAt: sharing.eventsUpdatedAt,
                session: session
            )
        }
        return metadataDiffers || localEvents != remoteEvents
    }

    @discardableResult
    private static func syncReceived(
        _ remote: CloudCalendarsAPI.SharedICloudCalendar,
        store: AppLocalCalendarStore,
        session: CloudCalendarsAPI.Session
    ) async throws -> Bool {
        let key = AppLocalCalendarStore.remoteKey(
            ownerID: remote.ownerId,
            calendarID: remote.calendarId
        )
        let remoteBaseline = baseline(remote)
        guard let previous = baselines[key] else {
            let changed = store.applyRemoteCalendar(remote)
            baselines[key] = remoteBaseline
            return changed
        }

        let local = store.receivedCalendars.first {
            $0.remoteOwnerID == remote.ownerId && $0.remoteCalendarID == remote.calendarId
        }
        let localEvents = local.map { calendar in
            portableEvents(store.events.filter { $0.calendarID == calendar.id })
        } ?? []
        let localTitle = local?.title ?? remote.title
        let localColor = local?.colorHex.uppercased() ?? remote.color.uppercased()
        let localEventsChanged = local != nil && localEvents != previous.events
        let localMetadataChanged = local != nil
            && (localTitle != previous.title || localColor != previous.color)
        let remoteEventsChanged = remoteBaseline.events != previous.events
        let remoteMetadataChanged = remoteBaseline.title != previous.title
            || remoteBaseline.color != previous.color

        // Upload only when the local copy changed from the exact revision that
        // was last applied and the server did not also advance. On a conflict,
        // the latest canonical server revision wins.
        if !remote.isRevoked,
           (remote.access == .writer || remote.access == .owner),
           localEventsChanged,
           !remoteEventsChanged,
           let local {
            let window = syncWindow(for: store.events.filter { $0.calendarID == local.id })
            _ = try await CloudCalendarsAPI.saveICloudCalendarEvents(
                calendarId: remote.calendarId,
                ownerId: remote.ownerId,
                events: localEvents,
                windowStart: window.start,
                windowEnd: window.end,
                expectedUpdatedAt: remote.eventsUpdatedAt,
                session: session
            )
            baselines[key] = Baseline(
                title: remoteBaseline.title,
                color: remoteBaseline.color,
                events: localEvents,
                metadataUpdatedAt: remoteBaseline.metadataUpdatedAt,
                eventsUpdatedAt: nil
            )
            return true
        }

        if !remote.isRevoked,
           remote.access == .owner,
           localMetadataChanged,
           !remoteMetadataChanged {
            let sharing = try await CloudCalendarsAPI.iCloudCalendarSharing(
                calendarId: remote.calendarId,
                ownerId: remote.ownerId,
                session: session
            )
            _ = try await CloudCalendarsAPI.saveICloudCalendarSharing(
                calendarId: remote.calendarId,
                ownerId: remote.ownerId,
                title: localTitle,
                color: localColor,
                timeZone: remote.timeZone,
                calendarKind: "app_local",
                recipients: sharing.recipients.map { (email: $0.email, access: $0.access) },
                expectedUpdatedAt: remote.updatedAt,
                session: session
            )
            baselines[key] = Baseline(
                title: localTitle,
                color: localColor,
                events: remoteBaseline.events,
                metadataUpdatedAt: nil,
                eventsUpdatedAt: remoteBaseline.eventsUpdatedAt
            )
            return true
        }

        let changed = store.applyRemoteCalendar(remote)
        baselines[key] = remoteBaseline
        return changed
    }

    private static func baseline(
        _ remote: CloudCalendarsAPI.SharedICloudCalendar
    ) -> Baseline {
        Baseline(
            title: remote.title,
            color: remote.color.uppercased(),
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
