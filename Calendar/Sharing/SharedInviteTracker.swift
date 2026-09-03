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
        /// `nil` keeps records written by older builds decodable. A revoked
        /// invitation stays in EventKit, but is frozen and drawn struck through.
        var isRevoked: Bool? = nil
        var lastSequence: Int = 0
        /// Optional keeps invitations written by older app builds decodable.
        var access: CloudCalendarsAPI.EventAccess? = nil
        var lastSyncedSnapshot: SharedOutgoingEventTracker.Snapshot? = nil
        var receiptRecorded: Bool? = nil

        var effectiveAccess: CloudCalendarsAPI.EventAccess { access ?? .reader }
        /// Owner cancellation and revoked recipient access both leave a frozen
        /// local copy that is drawn struck through.
        var shouldAppearStruckThrough: Bool { isCancelled || isRevoked == true }
    }

    private static let storageKey = "sharedInvites.tracked"
    private static let anonymousRecipientKey = "sharedInvites.anonymousRecipientID"

    static var anonymousRecipientID: String {
        if let value = UserDefaults.standard.string(forKey: anonymousRecipientKey),
           !value.isEmpty {
            return value
        }
        let value = UUID().uuidString
        UserDefaults.standard.set(value, forKey: anonymousRecipientKey)
        return value
    }

    static func record(payload: SharedEventImportPayload, localEventIdentifier: String?) {
        guard let eventID = payload.eventID,
              let feedID = payload.feedID,
              let localEventIdentifier
        else { return }

        var all = tracked()
        let previous = all[eventID]
        let localSnapshot = CalendarViewModel.shared.eventStore
            .event(withIdentifier: localEventIdentifier)
            .flatMap(SharedOutgoingEventTracker.snapshot(for:))
        all[eventID] = Invite(
            eventID: eventID,
            feedID: feedID,
            localEventIdentifier: localEventIdentifier,
            isCancelled: previous?.isCancelled ?? false,
            isRevoked: false,
            lastSequence: previous?.lastSequence ?? 0,
            access: previous?.access ?? .reader,
            lastSyncedSnapshot: previous?.lastSyncedSnapshot ?? localSnapshot,
            receiptRecorded: previous?.receiptRecorded
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
        let removed = all.removeValue(forKey: eventID)
        save(all)
        if let removed {
            Task {
                if let session = CalendarFeedSession.existing {
                    try? await CloudCalendarsAPI.forgetReceivedInvite(
                        eventId: eventID,
                        session: session
                    )
                }
                try? await CloudCalendarsAPI.forgetAnonymousReceivedInvite(
                    eventId: eventID,
                    feedId: removed.feedID,
                    anonymousRecipientId: anonymousRecipientID
                )
            }
        }
    }

    static func restore(
        _ remote: CloudCalendarsAPI.RemoteSharedEvent,
        localEventIdentifier: String
    ) {
        var all = tracked()
        let previous = all[remote.id]
        all[remote.id] = Invite(
            eventID: remote.id,
            feedID: remote.feedId,
            localEventIdentifier: localEventIdentifier,
            isCancelled: remote.isCancelled,
            isRevoked: false,
            lastSequence: remote.sequence ?? 0,
            access: remote.access ?? previous?.access ?? .reader,
            lastSyncedSnapshot: previous?.lastSyncedSnapshot,
            receiptRecorded: true
        )
        save(all)
    }

    static func invite(eventID: String) -> Invite? {
        tracked()[eventID]
    }

    /// Imported invitations are writable EventKit copies, but inside this app
    /// the organiser's S3 feed remains their source of truth. Keeping this
    /// decision here gives every editor, drag gesture, and share action the
    /// same answer.
    static func isReadOnly(_ event: EKEvent) -> Bool {
        if let calendarIdentifier = event.calendar?.calendarIdentifier,
           SharedICloudCalendarLocalStore.isShared(
                localCalendarIdentifier: calendarIdentifier
           ) {
            return !SharedICloudCalendarLocalStore.canEditEvents(
                localCalendarIdentifier: calendarIdentifier
            )
        }
        guard let identifier = event.eventIdentifier else { return false }
        guard let invite = invite(localEventIdentifier: identifier) else { return false }
        return invite.isRevoked == true || invite.effectiveAccess == .reader
    }

    static func isReadOnly(_ descriptor: EventDescriptor) -> Bool {
        guard let event = (descriptor as? EKMultiDayWrapper)?.realEvent else { return false }
        return isReadOnly(event)
    }

    /// Reader access on a calendar share is stricter than a standalone event
    /// invitation: the event belongs to the shared calendar, so recipients
    /// must not be offered a local per-event delete action.
    static func isInReadOnlySharedCalendar(_ event: EKEvent) -> Bool {
        guard let calendarIdentifier = event.calendar?.calendarIdentifier,
              SharedICloudCalendarLocalStore.isShared(
                localCalendarIdentifier: calendarIdentifier
              )
        else { return false }
        return !SharedICloudCalendarLocalStore.canEditEvents(
            localCalendarIdentifier: calendarIdentifier
        )
    }

    static func isInReadOnlySharedCalendar(_ descriptor: EventDescriptor) -> Bool {
        guard let event = (descriptor as? EKMultiDayWrapper)?.realEvent else { return false }
        return isInReadOnlySharedCalendar(event)
    }

    /// Locally-created events remain shareable by their creator. A received
    /// event may be forwarded only when the first sharer explicitly delegated
    /// Owner access to this signed-in recipient.
    static func canShare(_ event: EKEvent) -> Bool {
        if let calendarIdentifier = event.calendar?.calendarIdentifier,
           SharedICloudCalendarLocalStore.isShared(
                localCalendarIdentifier: calendarIdentifier
           ) {
            return SharedICloudCalendarLocalStore.canManageSharing(
                localCalendarIdentifier: calendarIdentifier
            )
        }
        guard let identifier = event.eventIdentifier,
              let invite = invite(localEventIdentifier: identifier)
        else { return true }
        return invite.isRevoked != true && invite.effectiveAccess == .owner
    }

    static func canShare(_ descriptor: EventDescriptor) -> Bool {
        guard let event = (descriptor as? EKMultiDayWrapper)?.realEvent else { return true }
        return canShare(event)
    }

    static func invite(localEventIdentifier: String) -> Invite? {
        tracked().values.first { $0.localEventIdentifier == localEventIdentifier }
    }

    static func isReceived(_ event: EKEvent) -> Bool {
        guard let identifier = event.eventIdentifier else { return false }
        return invite(localEventIdentifier: identifier) != nil
    }

    static func isReceived(_ descriptor: EventDescriptor) -> Bool {
        guard let event = (descriptor as? EKMultiDayWrapper)?.realEvent else { return false }
        return isReceived(event)
    }

    static func demoteAllToReader() {
        var all = tracked()
        var changed = false
        for eventID in Array(all.keys) {
            guard all[eventID]?.effectiveAccess != .reader else { continue }
            all[eventID]?.access = .reader
            changed = true
        }
        guard changed else { return }
        save(all)
        NotificationCenter.default.post(name: .sharedEventsTrackingChanged, object: nil)
        NotificationCenter.default.post(name: .sharedEventImported, object: nil)
    }

    static func markReceiptRecorded(eventID: String) {
        var all = tracked()
        guard var invite = all[eventID], invite.receiptRecorded != true else { return }
        invite.receiptRecorded = true
        all[eventID] = invite
        save(all)
    }

    /// Called after the recipient deliberately removes their local copy. The
    /// feed must be forgotten too, otherwise a future refresh could recreate
    /// something the person explicitly removed.
    static func forget(localEventIdentifier: String) {
        guard let invite = invite(localEventIdentifier: localEventIdentifier) else { return }
        forget(eventID: invite.eventID)
        NotificationCenter.default.post(name: .sharedEventsTrackingChanged, object: nil)
    }

    /// Called after EventKit has deleted one local copy. Reader and Writer
    /// removals stop only that recipient's tracking. A delegated Owner keeps
    /// the record just long enough for the refresher to cancel the canonical
    /// S3 event, which also reaches the first sharer and every other recipient.
    static func localEventWasDeleted(localEventIdentifier: String) {
        guard let invite = invite(localEventIdentifier: localEventIdentifier) else {
            // A missing locally-created shared event is translated into a
            // server cancellation by SharedOutgoingEventTracker.
            SharedEventSyncManager.eventStoreDidChange()
            return
        }

        if invite.isRevoked != true, invite.effectiveAccess == .owner {
            Task { await SharedInviteRefresher.refreshAll() }
        } else {
            forget(eventID: invite.eventID)
        }
        NotificationCenter.default.post(name: .sharedEventsTrackingChanged, object: nil)
        NotificationCenter.default.post(name: .sharedEventImported, object: nil)
    }

    static func deletionAffectsEveryone(_ event: EKEvent) -> Bool {
        guard let identifier = event.eventIdentifier else { return false }
        if let invite = invite(localEventIdentifier: identifier) {
            return invite.isRevoked != true && invite.effectiveAccess == .owner
        }
        return SharedOutgoingEventTracker.sentEvent(localEventIdentifier: identifier) != nil
    }

    static func deletionAffectsEveryone(_ descriptor: EventDescriptor) -> Bool {
        guard let event = (descriptor as? EKMultiDayWrapper)?.realEvent else { return false }
        return deletionAffectsEveryone(event)
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

    /// An owner-cancelled or access-revoked event remains visible so the
    /// recipient can understand what happened instead of seeing an unexplained
    /// empty slot.
    static func shouldAppearStruckThrough(localEventIdentifier: String) -> Bool {
        tracked().values.contains {
            $0.localEventIdentifier == localEventIdentifier && $0.shouldAppearStruckThrough
        }
    }

    static func shouldAppearStruckThrough(_ event: EKEvent) -> Bool {
        if let calendarIdentifier = event.calendar?.calendarIdentifier,
           SharedICloudCalendarLocalStore.isRevoked(
                localCalendarIdentifier: calendarIdentifier
           ) {
            return true
        }
        guard let identifier = event.eventIdentifier else { return false }
        if shouldAppearStruckThrough(localEventIdentifier: identifier) {
            return true
        }

        // The first sharer's EventKit copy is tracked by the outgoing index,
        // not by `Invite`. A delegated Owner cancellation updates that index
        // and prefixes the title with “Cancelled:”, so include the same state
        // in the visual strike-through decision as for recipient copies.
        return SharedOutgoingEventTracker
            .sentEvent(localEventIdentifier: identifier)?
            .isCancelled == true
    }

    static func shouldAppearStruckThrough(_ descriptor: EventDescriptor) -> Bool {
        if let wrapper = descriptor as? EKMultiDayWrapper {
            return shouldAppearStruckThrough(wrapper.realEvent)
        }
        return false
    }

    private static func save(_ all: [String: Invite]) {
        guard let data = try? JSONEncoder().encode(all) else { return }
        UserDefaults.standard.set(data, forKey: storageKey)
    }
}
