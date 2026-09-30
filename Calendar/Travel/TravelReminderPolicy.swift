import Foundation

/// Keep timing independent of wall-clock calendars (DST and time-zone changes).
enum TravelReminderPolicy {
    static let arrivalBuffer: TimeInterval = 10 * 60
    static let advanceNotice: TimeInterval = 5 * 60

    static func acceptsLocation(timestamp: Date, accuracy: Double, now: Date) -> Bool {
        accuracy >= 0 && accuracy <= 1000 && abs(timestamp.timeIntervalSince(now)) < 300
    }

    static func notificationDate(start: Date, departure: Date, now: Date, advanceNotice: TimeInterval = advanceNotice) -> Date? {
        guard start > now, departure.timeIntervalSince1970.isFinite else { return nil }
        return max(now.addingTimeInterval(1), departure.addingTimeInterval(-advanceNotice))
    }
}

/// Persists the delivery deadline, so movement/relaunch cannot repeatedly notify
/// for an occurrence whose departure alert has already fired.
struct TravelReminderSchedule: Codable {
    var signature: String
    var fireDate: Date
    var eventStart: Date

    func wasDelivered(signature currentSignature: String, now: Date) -> Bool {
        signature == currentSignature && fireDate <= now
    }
}
