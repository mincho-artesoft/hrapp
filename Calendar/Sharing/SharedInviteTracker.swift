import EventKit
import Foundation

/// Remembers which imported events came from an invite, and where to re-read
/// them from.
///
/// Without this an invite is a snapshot: the copy in your calendar keeps the
/// time it had when you added it, even after the organiser moves or calls off
/// the event. The record is what lets the app find that exact copy again and
/// correct it, rather than adding a second event beside it.
@MainActor
enum SharedInviteTracker {
    struct Invite: Codable, Equatable {
        let eventID: String
        let feedID: String
        var localEventIdentifier: String
        var isCancelled: Bool = false
        var lastSequence: Int = 0
    }

    private static let storageKey = "sharedInvites.tracked"

    static func record(payload: SharedEventImportPayload, localEventIdentifier: String?) {
        guard let eventID = payload.eventID,
              let feedID = payload.feedID,
              let localEventIdentifier
        else { return }

        var all = tracked()
        all[eventID] = Invite(
            eventID: eventID,
            feedID: feedID,
            localEventIdentifier: localEventIdentifier
        )
        save(all)
    }

    static func tracked() -> [String: Invite] {
        guard let data = UserDefaults.standard.data(forKey: storageKey),
              let decoded = try? JSONDecoder().decode([String: Invite].self, from: data)
        else { return [:] }
        return decoded
    }

    static func update(_ invite: Invite) {
        var all = tracked()
        all[invite.eventID] = invite
        save(all)
    }

    static func forget(eventID: String) {
        var all = tracked()
        all.removeValue(forKey: eventID)
        save(all)
    }

    /// Imported invitations are writable EventKit copies, but inside this app
    /// the organiser's S3 feed remains their source of truth. Keeping this
    /// decision here gives every editor, drag gesture, and share action the
    /// same answer.
    static func isReadOnly(_ event: EKEvent) -> Bool {
        guard let identifier = event.eventIdentifier else { return false }
        return invite(localEventIdentifier: identifier) != nil
    }

    static func isReadOnly(_ descriptor: EventDescriptor) -> Bool {
        guard let event = (descriptor as? EKMultiDayWrapper)?.realEvent else { return false }
        return isReadOnly(event)
    }

    static func invite(localEventIdentifier: String) -> Invite? {
        tracked().values.first { $0.localEventIdentifier == localEventIdentifier }
    }

    /// Called after the recipient deliberately removes their local copy. The
    /// feed must be forgotten too, otherwise a future refresh could recreate
    /// something the person explicitly removed.
    static func forget(localEventIdentifier: String) {
        guard let invite = invite(localEventIdentifier: localEventIdentifier) else { return }
        forget(eventID: invite.eventID)
        NotificationCenter.default.post(name: .sharedEventsTrackingChanged, object: nil)
    }

    /// Whether this event was called off by whoever sent it. The app draws such
    /// events struck through rather than removing them - the same thing Apple's
    /// Calendar does, and for the same reason: seeing that a meeting was called
    /// off is more useful than finding a hole where it used to be.
    static func isCancelled(localEventIdentifier: String) -> Bool {
        tracked().values.contains {
            $0.localEventIdentifier == localEventIdentifier && $0.isCancelled
        }
    }

    private static func save(_ all: [String: Invite]) {
        guard let data = try? JSONEncoder().encode(all) else { return }
        UserDefaults.standard.set(data, forKey: storageKey)
    }
}
