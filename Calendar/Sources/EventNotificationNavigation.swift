import Foundation

enum EventNotificationNavigation {
    static let eventStartDateKey = "PendingEventNotificationStartDate"
    static let eventIdentifierKey = "PendingEventNotificationIdentifier"

    static func savePending(eventStartDate: TimeInterval?, eventIdentifier: String?) {
        if let eventStartDate {
            UserDefaults.standard.set(eventStartDate, forKey: eventStartDateKey)
        }

        if let eventIdentifier {
            UserDefaults.standard.set(eventIdentifier, forKey: eventIdentifierKey)
        }

        UserDefaults.standard.set(1, forKey: "selectedTabRoot")
    }

    static func consumePending() -> (eventStartDate: TimeInterval?, eventIdentifier: String?)? {
        let defaults = UserDefaults.standard
        let hasStartDate = defaults.object(forKey: eventStartDateKey) != nil
        let hasIdentifier = defaults.object(forKey: eventIdentifierKey) != nil

        guard hasStartDate || hasIdentifier else { return nil }

        let eventStartDate = hasStartDate ? defaults.double(forKey: eventStartDateKey) : nil
        let eventIdentifier = defaults.string(forKey: eventIdentifierKey)

        defaults.removeObject(forKey: eventStartDateKey)
        defaults.removeObject(forKey: eventIdentifierKey)

        return (eventStartDate, eventIdentifier)
    }
}
