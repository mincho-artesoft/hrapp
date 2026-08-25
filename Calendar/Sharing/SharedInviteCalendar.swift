import EventKit
import UIKit
import Foundation

/// The calendar that invites from other people land in.
///
/// Invites go to a calendar of their own rather than into whichever calendar
/// happens to be the default, so that somebody else's event never quietly
/// mixes in with your own - and so the whole lot can be hidden or deleted in
/// one move if you stop wanting them.
@MainActor
enum SharedInviteCalendar {
    /// Remembered destination. Empty means the dedicated calendar, created on
    /// first use; anything else is a calendar the user picked instead.
    static let destinationKey = "sharedInvites.destinationCalendarIdentifier"

    private static let createdIdentifierKey = "sharedInvites.dedicatedCalendarIdentifier"

    static var title: String {
        NSLocalizedString("Invites", comment: "Name of the calendar that shared invitations are added to")
    }

    /// The calendar invites should be written to, creating the dedicated one if
    /// that is what the setting asks for and it does not exist yet.
    ///
    /// Returns nil only when EventKit offers nowhere writable at all, which the
    /// caller surfaces rather than silently dropping the invite.
    static func destination(in store: EKEventStore) -> EKCalendar? {
        let defaults = UserDefaults.standard
        let chosen = defaults.string(forKey: destinationKey) ?? ""

        if !chosen.isEmpty,
           let calendar = store.calendar(withIdentifier: chosen),
           calendar.allowsContentModifications {
            return calendar
        }

        return dedicated(in: store) ?? anyWritable(in: store)
    }

    /// The app's own invites calendar, made on demand.
    static func dedicated(in store: EKEventStore) -> EKCalendar? {
        let defaults = UserDefaults.standard

        // A calendar the user deleted in Settings leaves a stale identifier
        // behind, so a miss here means "make a new one", not "give up".
        if let identifier = defaults.string(forKey: createdIdentifierKey),
           let existing = store.calendar(withIdentifier: identifier),
           existing.allowsContentModifications {
            return existing
        }

        // Reuse a calendar of the same name before adding a second one - the
        // app may have been reinstalled, leaving the old calendar in place.
        if let match = store.calendars(for: .event).first(where: {
            $0.title == title && $0.allowsContentModifications
        }) {
            defaults.set(match.calendarIdentifier, forKey: createdIdentifierKey)
            return match
        }

        guard let source = writableSource(in: store) else { return nil }

        let calendar = EKCalendar(for: .event, eventStore: store)
        calendar.title = title
        calendar.source = source
        calendar.cgColor = UIColor.systemIndigo.cgColor

        do {
            try store.saveCalendar(calendar, commit: true)
            defaults.set(calendar.calendarIdentifier, forKey: createdIdentifierKey)
            return calendar
        } catch {
            print("Invites calendar could not be created - \(error.localizedDescription)")
            return nil
        }
    }

    /// Prefers a source that stays on the device. An invites calendar synced to
    /// iCloud would appear on the person's other devices too, which is a change
    /// to their account that importing one invite should not make for them.
    #if DEBUG
    /// Forgets the dedicated calendar so the next call builds a fresh one.
    /// Screenshot captures need it named in the language being shot, not in
    /// whichever language happened to run first on that simulator.
    static func forgetDedicatedForCapture() {
        UserDefaults.standard.removeObject(forKey: createdIdentifierKey)
    }
    #endif

    private static func writableSource(in store: EKEventStore) -> EKSource? {
        if let local = store.sources.first(where: { $0.sourceType == .local }) {
            return local
        }
        // Some accounts have no local source at all; fall back to wherever new
        // events already go.
        return store.defaultCalendarForNewEvents?.source
            ?? store.sources.first(where: { $0.sourceType == .calDAV })
    }

    private static func anyWritable(in store: EKEventStore) -> EKCalendar? {
        store.defaultCalendarForNewEvents
            ?? store.calendars(for: .event).first(where: \.allowsContentModifications)
    }
}
