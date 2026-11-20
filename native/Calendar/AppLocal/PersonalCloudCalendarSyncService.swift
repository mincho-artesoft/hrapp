import Foundation

/// Synchronizes the signed-in user's canonical personal `Cloud Calendars`
/// workspace (`cal/{calId}/events/` on the backend) two-way with the iPhone app.
///
/// Any event created in this calendar on iPhone appears immediately in Web Studio,
/// and any Web Studio event, RSVP (`/event/...`), or guest booking (`/book/...`)
/// appears automatically on the iPhone with local reminders scheduled.
@MainActor
enum PersonalCloudCalendarSyncService {
    private struct Baseline: Codable, Equatable {
        var title: String
        var color: String
        var timeZone: String
        var events: [CloudCalendarsAPI.SharedICloudCalendarEvent]
        var updatedAt: String?
    }

    private static var isSyncing = false
    private static var needsAnotherPass = false

    private static func baselineKey(for calendarId: String) -> String {
        let host = DeviceCalendarReplica.storageHost(for: CloudCalendarsAPI.baseURL)
        return "personalCloud.syncBaseline.v1.\(host).\(calendarId)"
    }

    private static func loadBaseline(for calendarId: String) -> Baseline? {
        guard let data = UserDefaults.standard.data(forKey: baselineKey(for: calendarId)) else {
            return nil
        }
        return try? JSONDecoder().decode(Baseline.self, from: data)
    }

    private static func saveBaseline(_ baseline: Baseline, for calendarId: String) {
        if let data = try? JSONEncoder().encode(baseline) {
            UserDefaults.standard.set(data, forKey: baselineKey(for: calendarId))
        }
    }

    @discardableResult
    static func syncNow() async -> Bool {
        let store = AppLocalCalendarStore.shared
        guard let session = CalendarFeedSession.existing else {
            store.removePersonalCloudCalendars(except: nil)
            return false
        }

        store.removePersonalCloudCalendars(except: session.calendarId)

        guard !isSyncing else {
            needsAnotherPass = true
            return false
        }
        isSyncing = true
        defer {
            isSyncing = false
            if needsAnotherPass {
                needsAnotherPass = false
                Task { @MainActor in _ = await syncNow() }
            }
        }

        let calId = session.calendarId
        let localCalendarID = AppLocalCalendarRecord.personalCloudCalendarID(for: calId)

        do {
            let initialResponse = try await CloudCalendarsAPI.syncPersonalCloudCalendar(
                upserts: [],
                deletions: [],
                calendarMeta: nil,
                session: session
            )

            let excludedShareIDs = eventKitTrackedShareIDs(excludingLocalCalendarID: localCalendarID)
            let remoteEvents = normalized(
                initialResponse.events.filter { !excludedShareIDs.contains($0.id) }
            )

            let previous = loadBaseline(for: calId)
            let localCalendar = store.calendar(id: localCalendarID)
            let localEvents = localCalendar.map { cal in
                portableEvents(store.events.filter { $0.calendarID == cal.id })
            } ?? []

            let mergedEvents: [CloudCalendarsAPI.SharedICloudCalendarEvent]
            if let previous {
                mergedEvents = AppLocalCalendarMerge.events(
                    base: previous.events,
                    local: localEvents,
                    remote: remoteEvents
                )
            } else {
                // First sync on this device: union any local events with remote events
                mergedEvents = AppLocalCalendarMerge.events(
                    base: [],
                    local: localEvents,
                    remote: remoteEvents
                )
            }

            let remoteTitle = initialResponse.calendar.name.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
                ? NSLocalizedString("Cloud Calendars", comment: "Personal Cloud Calendars synced calendar title")
                : initialResponse.calendar.name
            let remoteColor = initialResponse.calendar.color.uppercased()
            let remoteTimeZone = initialResponse.calendar.timeZone

            var mergedTitle = remoteTitle
            var mergedColor = remoteColor
            var mergedTimeZone = remoteTimeZone
            if let localCalendar, let previous {
                if remoteTitle == previous.title && !localCalendar.title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                    mergedTitle = localCalendar.title
                }
                if remoteColor == previous.color {
                    mergedColor = localCalendar.colorHex.uppercased()
                }
                if remoteTimeZone == previous.timeZone {
                    mergedTimeZone = localCalendar.timeZoneIdentifier
                }
            }

            let remoteByID = Dictionary(
                remoteEvents.map { ($0.id, $0) },
                uniquingKeysWith: { _, last in last }
            )
            let mergedByID = Dictionary(
                mergedEvents.map { ($0.id, $0) },
                uniquingKeysWith: { _, last in last }
            )

            let upserts = mergedEvents.filter { remoteByID[$0.id] != $0 }
            let deletions = remoteEvents.map(\.id).filter { mergedByID[$0] == nil }
            let metaChanged = mergedTitle != remoteTitle
                || mergedColor != remoteColor
                || mergedTimeZone != remoteTimeZone

            let finalResponse: CloudCalendarsAPI.PersonalCloudCalendarSyncResponse
            if !upserts.isEmpty || !deletions.isEmpty || metaChanged {
                finalResponse = try await CloudCalendarsAPI.syncPersonalCloudCalendar(
                    upserts: upserts,
                    deletions: deletions,
                    calendarMeta: metaChanged
                        ? (name: mergedTitle, color: mergedColor, timeZone: mergedTimeZone)
                        : nil,
                    session: session
                )
            } else {
                finalResponse = initialResponse
            }

            let authoritativeEvents = normalized(
                finalResponse.events.filter { !excludedShareIDs.contains($0.id) }
            )
            let finalTitle = finalResponse.calendar.name.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
                ? NSLocalizedString("Cloud Calendars", comment: "Personal Cloud Calendars synced calendar title")
                : finalResponse.calendar.name
            let finalColor = finalResponse.calendar.color.uppercased()
            let finalTimeZone = finalResponse.calendar.timeZone

            let changed = store.applyPersonalCloudSnapshot(
                remoteCalendarID: calId,
                title: finalTitle,
                colorHex: finalColor,
                timeZone: finalTimeZone,
                updatedAt: finalResponse.calendar.updatedAt,
                remoteItems: authoritativeEvents
            )

            saveBaseline(
                Baseline(
                    title: finalTitle,
                    color: finalColor,
                    timeZone: finalTimeZone,
                    events: authoritativeEvents,
                    updatedAt: finalResponse.calendar.updatedAt
                ),
                for: calId
            )
            return changed || !upserts.isEmpty || !deletions.isEmpty || metaChanged
        } catch {
            print("Personal Cloud Calendar sync failed: \(error.localizedDescription)")
            return false
        }
    }

    /// Excludes share IDs that are already backed by an EventKit event or a
    /// different owned local calendar on this device so shared events never duplicate.
    private static func eventKitTrackedShareIDs(excludingLocalCalendarID: String) -> Set<String> {
        let store = AppLocalCalendarStore.shared
        let sent = SharedOutgoingEventTracker.sentEvents(in: CalendarViewModel.shared.eventStore)
        var excluded = Set<String>()
        for item in sent {
            guard let localID = item.localEventIdentifier, !localID.isEmpty else { continue }
            if let localEvent = store.event(id: localID) {
                if localEvent.calendarID != excludingLocalCalendarID {
                    excluded.insert(item.eventID)
                }
            } else if CalendarViewModel.shared.eventStore.event(withIdentifier: localID) != nil {
                excluded.insert(item.eventID)
            }
        }
        return excluded
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
                details: event.portableDetails
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
}
