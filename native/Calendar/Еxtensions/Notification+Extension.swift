import Foundation

extension Notification.Name {
    static let cloudAccountChanged = Notification.Name("cloudAccountChanged")
    static let calendarsSelectionChanged = Notification.Name("calendarsSelectionChanged")
    static let notificationDraggableMenuViewSub = Notification.Name("notificationDraggableMenuViewSub")
    static let weatherForecastUpdated = Notification.Name("weatherForecastUpdated")
    static let openEventNotificationDay = Notification.Name("openEventNotificationDay")
    static let openWeatherNotification = Notification.Name("openWeatherNotification")
    static let sharedEventImported = Notification.Name("sharedEventImported")
    static let sharedEventsTrackingChanged = Notification.Name("sharedEventsTrackingChanged")
    static let sharedEventRecipientsChanged = Notification.Name("sharedEventRecipientsChanged")
    static let openPendingEventInvitations = Notification.Name("openPendingEventInvitations")

}

enum PendingEventInvitationNavigation {
    private static let openRequestKey = "pendingEventInvitations.openRequested"

    static var hasOpenRequest: Bool {
        UserDefaults.standard.bool(forKey: openRequestKey)
    }

    static func requestOpen() {
        UserDefaults.standard.set(true, forKey: openRequestKey)
        NotificationCenter.default.post(name: .openPendingEventInvitations, object: nil)
    }

    @discardableResult
    static func consumeOpenRequest() -> Bool {
        guard hasOpenRequest else { return false }
        UserDefaults.standard.removeObject(forKey: openRequestKey)
        return true
    }
}
