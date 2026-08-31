import EventKit
import Foundation

@MainActor
enum SharedEventImporter {
    enum Result {
        case added
        case alreadyExists
        case permissionDenied
        case noWritableCalendar
        case failed
    }

    static func eventAlreadyExists(_ payload: SharedEventImportPayload) -> Bool {
        guard canReadEvents else { return false }

        let store = CalendarViewModel.shared.eventStore
        let predicate = store.predicateForEvents(
            withStart: payload.start.addingTimeInterval(-2),
            end: payload.end.addingTimeInterval(2),
            calendars: nil
        )

        return store.events(matching: predicate).contains { event in
            event.title?.trimmingCharacters(in: .whitespacesAndNewlines) == payload.title
                && abs(event.startDate.timeIntervalSince(payload.start)) < 1
                && abs(event.endDate.timeIntervalSince(payload.end)) < 1
                && event.isAllDay == payload.isAllDay
                && normalized(event.location) == normalized(payload.location)
        }
    }

    static func add(
        _ payload: SharedEventImportPayload,
        toCalendarWithIdentifier calendarIdentifier: String?
    ) async -> Result {
        guard await requestFullCalendarAccess() else { return .permissionDenied }
        guard !eventAlreadyExists(payload) else { return .alreadyExists }

        let viewModel = CalendarViewModel.shared
        let store = viewModel.eventStore
        viewModel.reloadCalendars()

        let requestedCalendar = calendarIdentifier.flatMap { identifier in
            store.calendar(withIdentifier: identifier)
        }

        // The import sheet normally supplies an explicit choice. If it does
        // not, use the remembered destination or the system default; importing
        // an invitation must never create a calendar behind the user's back.
        let destination = [
            requestedCalendar,
            SharedInviteCalendar.destination(in: store),
            store.defaultCalendarForNewEvents,
            viewModel.pickFirstWritableSelectedCalendar(),
            store.calendars(for: .event).first(where: \.allowsContentModifications)
        ]
        .compactMap { $0 }
        .first(where: \.allowsContentModifications)

        guard let destination else { return .noWritableCalendar }

        let event = EKEvent(eventStore: store)
        event.title = payload.title
        event.startDate = payload.start
        event.endDate = payload.end
        event.isAllDay = payload.isAllDay
        event.location = payload.location
        event.timeZone = payload.timeZone
        event.calendar = destination

        do {
            try store.save(event, span: .thisEvent, commit: true)
            // Remembered so a later change or cancellation from the sender can
            // be applied to this copy rather than added as a second event.
            if payload.isSyncable {
                SharedInviteTracker.record(payload: payload, localEventIdentifier: event.eventIdentifier)
            }
            EventNotificationManager.shared.rescheduleUpcomingEventNotifications()
            NotificationCenter.default.post(name: .sharedEventImported, object: nil)
            return .added
        } catch {
            print("Shared event import failed: \(error.localizedDescription)")
            return .failed
        }
    }

    private static var canReadEvents: Bool {
        let status = EKEventStore.authorizationStatus(for: .event)
        if #available(iOS 17.0, *) {
            return status == .fullAccess
        }
        return status == .authorized
    }

    private static func requestFullCalendarAccess() async -> Bool {
        let store = CalendarViewModel.shared.eventStore
        let status = EKEventStore.authorizationStatus(for: .event)

        if #available(iOS 17.0, *) {
            if status == .fullAccess { return true }
            guard status == .notDetermined || status == .writeOnly else { return false }
            do {
                return try await store.requestFullAccessToEvents()
            } catch {
                return false
            }
        }

        if status == .authorized { return true }
        guard status == .notDetermined else { return false }
        return await withCheckedContinuation { continuation in
            store.requestAccess(to: .event) { granted, _ in
                continuation.resume(returning: granted)
            }
        }
    }

    private static func normalized(_ value: String?) -> String {
        value?.trimmingCharacters(in: .whitespacesAndNewlines) ?? ""
    }
}
