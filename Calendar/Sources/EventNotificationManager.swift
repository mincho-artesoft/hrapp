import EventKit
import Foundation
import UIKit
import UserNotifications

@MainActor
final class EventNotificationManager: NSObject, ObservableObject {
    static let shared = EventNotificationManager()

    private struct StoredEventNotification: Codable {
        let identifier: String
        let title: String
        let body: String
        let fireDate: Date
        let eventIdentifier: String
        let calendarIdentifier: String

        var request: UNNotificationRequest {
            let content = UNMutableNotificationContent()
            content.title = title
            content.body = body
            content.sound = .default
            content.userInfo = [
                "eventIdentifier": eventIdentifier,
                "calendarIdentifier": calendarIdentifier
            ]

            let components = Calendar.current.dateComponents(
                [.year, .month, .day, .hour, .minute, .second],
                from: fireDate
            )
            let trigger = UNCalendarNotificationTrigger(dateMatching: components, repeats: false)
            return UNNotificationRequest(identifier: identifier, content: content, trigger: trigger)
        }
    }

    @Published private(set) var authorizationStatus: UNAuthorizationStatus = .notDetermined
    @Published private(set) var eventNotificationsEnabled: Bool

    private static let eventNotificationsEnabledKey = "EventNotificationsEnabled"
    private static let storedEventNotificationsKey = "StoredEventNotifications"
    private let notificationPrefix = "calendar.event.alarm."
    private let maxScheduledNotifications = 64

    private override init() {
        if UserDefaults.standard.object(forKey: Self.eventNotificationsEnabledKey) == nil {
            self.eventNotificationsEnabled = true
        } else {
            self.eventNotificationsEnabled = UserDefaults.standard.bool(forKey: Self.eventNotificationsEnabledKey)
        }

        super.init()
    }

    var notificationsAllowed: Bool {
        switch authorizationStatus {
        case .authorized, .provisional, .ephemeral:
            return true
        case .denied, .notDetermined:
            return false
        @unknown default:
            return false
        }
    }

    var canAskForPermission: Bool {
        authorizationStatus == .notDetermined
    }

    func configure() {
        UNUserNotificationCenter.current().delegate = UIApplication.shared.delegate as? UNUserNotificationCenterDelegate
        refreshAuthorizationStatus()
    }

    func requestAuthorizationOnLaunch() {
        UNUserNotificationCenter.current().getNotificationSettings { [weak self] settings in
            let status = settings.authorizationStatus

            Task { @MainActor in
                guard let self else { return }
                self.authorizationStatus = status

                if status == .notDetermined {
                    self.requestAuthorization()
                } else {
                    self.rescheduleUpcomingEventNotifications()
                }
            }
        }
    }

    func setEventNotificationsEnabled(_ enabled: Bool) {
        eventNotificationsEnabled = enabled
        UserDefaults.standard.set(enabled, forKey: Self.eventNotificationsEnabledKey)

        if enabled {
            if canAskForPermission {
                requestAuthorization()
            } else {
                rescheduleUpcomingEventNotifications()
            }
        } else {
            rescheduleUpcomingEventNotifications()
        }
    }

    func requestAuthorizationFromSettingsSection() {
        if !eventNotificationsEnabled {
            setEventNotificationsEnabled(true)
            return
        }

        if canAskForPermission {
            requestAuthorization()
        } else {
            openAppSettings()
        }
    }

    func refreshAuthorizationStatus() {
        UNUserNotificationCenter.current().getNotificationSettings { [weak self] settings in
            let status = settings.authorizationStatus

            Task { @MainActor in
                self?.authorizationStatus = status
                self?.rescheduleUpcomingEventNotifications()
            }
        }
    }

    func openAppSettings() {
        guard let url = URL(string: UIApplication.openSettingsURLString) else { return }
        UIApplication.shared.open(url)
    }

    func rescheduleUpcomingEventNotifications() {
        rebuildStoredUpcomingEventNotifications()

        let prefix = notificationPrefix

        UNUserNotificationCenter.current().getPendingNotificationRequests { [weak self] requests in
            let identifiers = requests
                .map(\.identifier)
                .filter { $0.hasPrefix(prefix) }

            UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: identifiers)

            Task { @MainActor in
                self?.scheduleVisibleEventNotificationsIfNeeded()
            }
        }
    }

    func cancelEventNotifications() {
        let prefix = notificationPrefix

        UNUserNotificationCenter.current().getPendingNotificationRequests { requests in
            let identifiers = requests
                .map(\.identifier)
                .filter { $0.hasPrefix(prefix) }

            UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: identifiers)
        }
    }

    private func requestAuthorization() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { [weak self] granted, error in
            if let error {
                print("Notification authorization error:", error.localizedDescription)
            }

            Task { @MainActor in
                guard let self else { return }
                self.refreshAuthorizationStatus()
                self.rescheduleUpcomingEventNotifications()
            }
        }
    }

    private func rebuildStoredUpcomingEventNotifications() {
        let notifications = makeUpcomingStoredEventNotifications()

        if let data = try? JSONEncoder().encode(notifications) {
            UserDefaults.standard.set(data, forKey: Self.storedEventNotificationsKey)
        }
    }

    private func scheduleVisibleEventNotificationsIfNeeded() {
        guard eventNotificationsEnabled, notificationsAllowed else { return }

        let requests = storedEventNotificationRequests()
        guard !requests.isEmpty else { return }

        for request in requests {
            UNUserNotificationCenter.current().add(request) { error in
                if let error {
                    print("Local event notification scheduling error:", error.localizedDescription)
                }
            }
        }
    }

    private func storedEventNotificationRequests() -> [UNNotificationRequest] {
        guard
            let data = UserDefaults.standard.data(forKey: Self.storedEventNotificationsKey),
            let stored = try? JSONDecoder().decode([StoredEventNotification].self, from: data)
        else {
            return []
        }

        let now = Date()
        return stored
            .filter { $0.fireDate > now }
            .prefix(maxScheduledNotifications)
            .map(\.request)
    }

    private func makeUpcomingStoredEventNotifications() -> [StoredEventNotification] {
        let viewModel = CalendarViewModel.shared
        guard viewModel.isCalendarAccessGranted() else { return [] }

        if viewModel.allCalendars.isEmpty {
            viewModel.reloadCalendars()
        }

        let now = Date()
        guard let end = Calendar.current.date(byAdding: .year, value: 1, to: now) else { return [] }

        let allowedCalendars = viewModel.allCalendars.filter {
            viewModel.selectedCalendarIDs.contains($0.calendarIdentifier)
        }

        let predicate = viewModel.eventStore.predicateForEvents(
            withStart: now,
            end: end,
            calendars: allowedCalendars.isEmpty ? nil : allowedCalendars
        )

        let events = viewModel.eventStore.events(matching: predicate)
        let scheduled = events.flatMap { storedNotifications(for: $0, now: now) }

        return scheduled
            .sorted { $0.fireDate < $1.fireDate }
            .prefix(maxScheduledNotifications)
            .map { $0 }
    }

    private func storedNotifications(for event: EKEvent, now: Date) -> [StoredEventNotification] {
        guard let alarms = event.alarms, !alarms.isEmpty else { return [] }

        let eventIdentifier = event.eventIdentifier ?? event.calendarItemIdentifier
        let title = event.title?.isEmpty == false
            ? event.title!
            : NSLocalizedString("Untitled", comment: "Fallback event title")

        return alarms.enumerated().compactMap { index, alarm in
            guard let fireDate = fireDate(for: alarm, event: event), fireDate > now else {
                return nil
            }

            let identifier = "\(notificationPrefix)\(eventIdentifier).\(Int(fireDate.timeIntervalSince1970)).\(index)"

            return StoredEventNotification(
                identifier: identifier,
                title: title,
                body: notificationBody(for: event),
                fireDate: fireDate,
                eventIdentifier: eventIdentifier,
                calendarIdentifier: event.calendar.calendarIdentifier
            )
        }
    }

    private func fireDate(for alarm: EKAlarm, event: EKEvent) -> Date? {
        if let absoluteDate = alarm.absoluteDate {
            return absoluteDate
        }

        return event.startDate.addingTimeInterval(alarm.relativeOffset)
    }

    private func notificationBody(for event: EKEvent) -> String {
        if event.isAllDay {
            return NSLocalizedString("All-day event", comment: "All-day event notification body")
        }

        let formatter = DateFormatter()
        formatter.dateStyle = .none
        formatter.timeStyle = .short

        if let endDate = event.endDate {
            return "\(formatter.string(from: event.startDate)) - \(formatter.string(from: endDate))"
        }

        return formatter.string(from: event.startDate)
    }
}
