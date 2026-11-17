// Same portable alarm/location/recurrence values used by HRApp iOS.
import EventKit
import Foundation
import CoreLocation
extension DeviceCalendarEvent {
    var macRecurrenceRules: [SharedEventRecurrenceRule] { decodedDetail("recurrenceRules") ?? [] }
    func decodedDetail<T: Decodable>(_ key: String) -> T? {
        guard let value = details?[key], let data = try? JSONEncoder().encode(value) else { return nil }
        return try? JSONDecoder().decode(T.self, from: data)
    }
}
