import Foundation

/// Titles are not identities. Every surface (including hit testing) needs the
/// same total order even when two providers use the same calendar name.
enum CalendarColumnOrder {
    static func precedes(title: String, id: String, otherTitle: String, otherID: String) -> Bool {
        title == otherTitle ? id < otherID : title < otherTitle
    }
}
