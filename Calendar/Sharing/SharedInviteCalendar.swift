import EventKit
import Foundation

/// Resolves the calendar selected for imported invitations.
///
/// The app never creates a calendar for invitations. If the saved selection is
/// missing or has been deleted, imports fall back to the system's default
/// writable calendar and the import sheet still lets the user choose another.
@MainActor
enum SharedInviteCalendar {
    /// Remembered destination. Empty means the system's default calendar.
    static let destinationKey = "sharedInvites.destinationCalendarIdentifier"

    /// Returns nil only when EventKit offers nowhere writable at all.
    static func destination(in store: EKEventStore) -> EKCalendar? {
        let defaults = UserDefaults.standard
        let chosen = defaults.string(forKey: destinationKey) ?? ""

        if !chosen.isEmpty,
           let calendar = store.calendar(withIdentifier: chosen),
           calendar.allowsContentModifications {
            return calendar
        }

        return anyWritable(in: store)
    }

    private static func anyWritable(in store: EKEventStore) -> EKCalendar? {
        store.defaultCalendarForNewEvents
            ?? store.calendars(for: .event).first(where: \.allowsContentModifications)
    }
}
