#if os(macOS)
import EventKit
import UserNotifications
import AppKit

@MainActor
final class MacCalendarReminderScheduler {
    static let shared = MacCalendarReminderScheduler()
    private var task: Task<Void, Never>?
    private weak var lastStore: MacTabletCalendarStore?
    private let prefix = "calendar.event.alarm."

    func preferencesDidChange() {
        task?.cancel()
        guard UserDefaults.standard.bool(forKey: "EventNotificationsEnabled") else { return }
        // Loading an existing snapshot does not request calendar permission.
        let store = lastStore ?? MacTabletCalendarStore()
        store.reload()
        refresh(store: store)
    }

    func refresh(store: MacTabletCalendarStore, requestPermission: Bool = false) {
        task?.cancel()
        lastStore = store
        // Snapshot on the main actor; never carry mutable EventKit objects
        // across an async notification-center callback.
        let now = Date()
        var requests: [(Date, UNNotificationRequest)] = []
        let enabled = (
            UserDefaults.standard.bool(forKey: "EventNotificationsEnabled"))
        if enabled {
            for event in store.filteredEvents() where event.status != .canceled {
                let record = store.local.record(for: event)
                let eventID = record?.id ?? event.eventIdentifier ?? event.calendarItemIdentifier
                for (index, alarm) in (event.alarms ?? []).enumerated() {
                    let fire = alarm.absoluteDate ?? event.startDate.addingTimeInterval(alarm.relativeOffset)
                    guard fire > now else { continue }
                    let content = UNMutableNotificationContent()
                    content.title = event.title?.isEmpty == false ? event.title : NSLocalizedString("Untitled", comment: "")
                    content.body = event.isAllDay ? NSLocalizedString("All-day event", comment: "")
                        : "\(MacCalendarFormatting.time(event.startDate)) - \(MacCalendarFormatting.time(event.endDate))"
                    content.sound = .default
                    content.userInfo = ["eventIdentifier": eventID,
                        "calendarIdentifier": event.calendar.calendarIdentifier,
                        "eventStartDate": event.startDate.timeIntervalSince1970]
                    let trigger = UNCalendarNotificationTrigger(dateMatching: Calendar.current.dateComponents(
                        [.year, .month, .day, .hour, .minute, .second], from: fire), repeats: false)
                    requests.append((fire, UNNotificationRequest(
                        identifier: "\(prefix)\(eventID).\(Int(fire.timeIntervalSince1970)).\(index)",
                        content: content, trigger: trigger)))
                }
            }
        }
        let upcoming = requests.sorted { $0.0 < $1.0 }.prefix(64).map(\.1)
        task = Task {
            let center = UNUserNotificationCenter.current()
            let settings = await center.notificationSettings()
            if requestPermission && enabled && settings.authorizationStatus == .notDetermined {
                _ = try? await center.requestAuthorization(options: [.alert, .sound, .badge])
            }
            guard !Task.isCancelled else { return }
            let pending = await center.pendingNotificationRequests()
            guard !Task.isCancelled else { return }
            let desired = Set(upcoming.map(\.identifier))
            center.removePendingNotificationRequests(withIdentifiers: pending.map(\.identifier)
                .filter { $0.hasPrefix(prefix) && !desired.contains($0) })
            for request in upcoming {
                guard !Task.isCancelled, UserDefaults.standard.bool(forKey: "EventNotificationsEnabled") else { return }
                do { try await center.add(request) }
                catch { print("Calendar reminder scheduling failed: \(error.localizedDescription)") }
                if Task.isCancelled || !UserDefaults.standard.bool(forKey: "EventNotificationsEnabled") {
                    center.removePendingNotificationRequests(withIdentifiers: [request.identifier])
                    return
                }
            }
        }
    }
}
#endif
