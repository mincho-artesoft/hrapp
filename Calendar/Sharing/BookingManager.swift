import EventKit
import Foundation

/// Owns the app side of "make one of my calendars bookable".
///
/// The owner picks a real calendar as the source. From then on this keeps the
/// public booking page honest in both directions: it pushes that calendar's busy
/// blocks up (so the page never offers a time the owner is already committed in
/// Apple/Google/Microsoft), and it mirrors confirmed bookings back down into the
/// same calendar (so a meeting someone books shows up in the owner's normal
/// calendar app, and syncs on to Google/Exchange like any other event).
@MainActor
enum BookingManager {
    private static let store = EKEventStore()
    private static let defaults = UserDefaults.standard

    private static let sourceKey = "BookingSourceCalendarID"
    private static let mirrorMapKey = "BookingMirrorMap"        // [bookingId: ekEventIdentifier]
    private static let lastSyncKey = "BookingLastSyncAt"

    // MARK: - Source calendar

    static var sourceCalendarID: String? {
        get { defaults.string(forKey: sourceKey) }
        set { defaults.set(newValue, forKey: sourceKey) }
    }

    static var sourceCalendar: EKCalendar? {
        guard let id = sourceCalendarID else { return nil }
        return store.calendar(withIdentifier: id)
    }

    /// Calendars the app may write a booking into.
    static var writableCalendars: [EKCalendar] {
        store.calendars(for: .event).filter { $0.allowsContentModifications }
    }

    // MARK: - Saving the page

    /// Saves the config to the server, remembers the source calendar, then does a
    /// first busy push so the page is accurate the moment it goes live.
    @discardableResult
    static func save(
        displayName: String,
        timeZone: TimeZone,
        contactEmail: String?,
        sourceCalendarID: String,
        meetingTypes: [CloudCalendarsAPI.MeetingType],
        availability: [CloudCalendarsAPI.AvailabilityRule]
    ) async throws -> CloudCalendarsAPI.SavedBooking {
        let session = try await CalendarFeedSession.current()
        let config = CloudCalendarsAPI.BookingConfig(
            handle: nil,
            enabled: true,
            displayName: displayName,
            timeZone: timeZone.identifier,
            contactEmail: contactEmail,
            sourceCalendarId: sourceCalendarID,
            meetingTypes: meetingTypes,
            availability: availability,
            slotIntervalMinutes: 30,
            minNoticeHours: 12,
            maxAdvanceDays: 60
        )
        let saved = try await CloudCalendarsAPI.saveBooking(config, session: session)
        self.sourceCalendarID = sourceCalendarID
        await pushBusy(maxAdvanceDays: saved.config.maxAdvanceDays)
        return saved
    }

    /// The existing config, if the owner has set booking up before.
    static func existing() async -> CloudCalendarsAPI.SavedBooking? {
        guard let session = CalendarFeedSession.existing else { return nil }
        return try? await CloudCalendarsAPI.getBooking(session: session)
    }

    // MARK: - Busy push

    /// Reads the source calendar's events over the bookable horizon and sends them
    /// up as busy blocks. Cheap and idempotent — safe to call on a schedule.
    static func pushBusy(maxAdvanceDays: Int = 60) async {
        guard let cal = sourceCalendar,
              let session = CalendarFeedSession.existing else { return }

        let now = Date()
        let end = Calendar.current.date(byAdding: .day, value: max(1, maxAdvanceDays), to: now) ?? now
        let predicate = store.predicateForEvents(withStart: now, end: end, calendars: [cal])
        let blocks = store.events(matching: predicate)
            .filter { !$0.isAllDay && $0.availability != .free }
            .map { (start: $0.startDate!, end: $0.endDate!) }

        try? await CloudCalendarsAPI.setBusy(
            blocks: blocks,
            sourceCalendarId: sourceCalendarID,
            session: session
        )
    }

    // MARK: - Mirroring bookings into the real calendar

    /// Pulls confirmed bookings and writes new ones into the source calendar,
    /// updates moved ones, and removes cancelled ones. Keeps a map so a booking
    /// is mirrored exactly once.
    static func syncBookings() async {
        guard let cal = sourceCalendar,
              let session = CalendarFeedSession.existing else { return }

        let since = defaults.object(forKey: lastSyncKey) as? Date
        let events: [CloudCalendarsAPI.BookingEvent]
        do {
            events = try await CloudCalendarsAPI.listBookingEvents(since: since, session: session)
        } catch {
            return
        }

        var map = mirrorMap()
        for ev in events {
            if ev.status == "cancelled" {
                if let ekID = map[ev.id], let existing = store.event(withIdentifier: ekID) {
                    try? store.remove(existing, span: .thisEvent, commit: false)
                }
                map[ev.id] = nil
                continue
            }

            let ekEvent: EKEvent
            if let ekID = map[ev.id], let existing = store.event(withIdentifier: ekID) {
                ekEvent = existing
            } else {
                ekEvent = EKEvent(eventStore: store)
                ekEvent.calendar = cal
            }
            ekEvent.title = ev.title
            ekEvent.startDate = ev.start
            ekEvent.endDate = ev.end
            ekEvent.location = ev.location
            ekEvent.notes = [ev.organizerName, ev.organizerEmail]
                .compactMap { $0 }
                .joined(separator: " · ")
            do {
                try store.save(ekEvent, span: .thisEvent, commit: false)
                map[ev.id] = ekEvent.eventIdentifier
            } catch {
                // Skip this one; the next sync will try again.
            }
        }

        try? store.commit()
        setMirrorMap(map)
        defaults.set(Date(), forKey: lastSyncKey)
    }

    /// A full refresh: push busy up and pull bookings down. Call on app-active.
    static func refresh() async {
        guard sourceCalendarID != nil, CalendarFeedSession.existing != nil else { return }
        await pushBusy()
        await syncBookings()
    }

    // MARK: - Mirror map storage

    private static func mirrorMap() -> [String: String] {
        guard let data = defaults.data(forKey: mirrorMapKey),
              let map = try? JSONDecoder().decode([String: String].self, from: data)
        else { return [:] }
        return map
    }
    private static func setMirrorMap(_ map: [String: String]) {
        if let data = try? JSONEncoder().encode(map) {
            defaults.set(data, forKey: mirrorMapKey)
        }
    }
}
