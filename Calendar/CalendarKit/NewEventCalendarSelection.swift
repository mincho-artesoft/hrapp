import Foundation

/// Keep the preview and the editor on the same writable destination. Input
/// order is intentional: preserve EventKit's order from the original picker,
/// then include app-owned calendars, without sorting by possibly equal titles.
enum NewEventCalendarSelection {
    static func resolve<C>(
        calendars: [C], selectedIDs: Set<String>, preferredID: String? = nil,
        defaultID: String?, id: KeyPath<C, String>, writable: KeyPath<C, Bool>
    ) -> C? {
        let writableCalendars = calendars.filter { $0[keyPath: writable] }
        if let preferredID {
            // A specific column must never silently save into another one.
            return writableCalendars.first { $0[keyPath: id] == preferredID }
        }
        return writableCalendars.first { selectedIDs.contains($0[keyPath: id]) }
            ?? writableCalendars.first { $0[keyPath: id] == defaultID }
            ?? writableCalendars.first
    }
}
