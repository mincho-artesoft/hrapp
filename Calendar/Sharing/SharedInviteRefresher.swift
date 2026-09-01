import EventKit
import Foundation

/// Re-reads the feeds behind imported invites and applies what changed.
///
/// This is what closes the loop for someone who added an invite inside the app
/// rather than subscribing in the system Calendar: without it their copy would
/// keep whatever time it had the day they added it.
@MainActor
enum SharedInviteRefresher {
    private static let feedHost = "cal.cloud-calendars.com"

    @discardableResult
    static func refreshAll() async -> Int {
        let invites = SharedInviteTracker.tracked().values
        guard !invites.isEmpty else { return 0 }

        var changed = 0
        for invite in invites where await refresh(invite) {
            changed += 1
        }
        return changed
    }

    /// Returns true when the local copy was actually altered.
    private static func refresh(_ invite: SharedInviteTracker.Invite) async -> Bool {
        guard var components = URLComponents(
            string: "https://\(feedHost)/f/\(invite.feedID).ics"
        ) else { return false }

        // Every foreground poll must see the latest S3 object. The query value
        // also avoids an intermediary CDN returning its cached previous body.
        components.queryItems = [
            URLQueryItem(name: "refresh", value: String(Int(Date().timeIntervalSince1970)))
        ]
        guard let url = components.url else { return false }
        var request = URLRequest(url: url, cachePolicy: .reloadIgnoringLocalCacheData)
        request.setValue("no-cache", forHTTPHeaderField: "Cache-Control")

        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            if let http = response as? HTTPURLResponse, http.statusCode == 404 {
                // The sender revoked this feed. The event stays where it is -
                // silently deleting somebody's calendar entry would be worse
                // than leaving a copy that no longer updates.
                SharedInviteTracker.forget(eventID: invite.eventID)
                return false
            }
            guard let text = String(data: data, encoding: .utf8),
                  let remote = ICSEvent.first(withUID: invite.eventID, in: text)
            else { return false }

            return apply(remote, to: invite)
        } catch {
            print("Invite refresh failed for \(invite.eventID) - \(error.localizedDescription)")
            return false
        }
    }

    private static func apply(_ remote: ICSEvent, to invite: SharedInviteTracker.Invite) -> Bool {
        // Older server revisions must never overwrite a newer one. An equal
        // revision is intentionally still compared with EventKit: recipients
        // can edit this writable local copy from another calendar app, and the
        // organiser's S3 version must win again on the next refresh.
        guard remote.sequence >= invite.lastSequence else { return false }

        let store = CalendarViewModel.shared.eventStore
        guard let event = store.event(withIdentifier: invite.localEventIdentifier) else {
            // The person deleted it themselves; stop tracking rather than
            // resurrecting an event they threw away.
            SharedInviteTracker.forget(eventID: invite.eventID)
            return false
        }

        var updated = invite
        updated.lastSequence = remote.sequence
        updated.isCancelled = remote.isCancelled
        var eventChanged = false

        if remote.isCancelled {
            // EKEvent.status is read-only, so the cancellation is carried in
            // the title. Without it the event would look untouched in every
            // other calendar app the person uses.
            let marker = NSLocalizedString(
                "Cancelled",
                comment: "Prefix on an invitation the organiser called off"
            )
            let remoteTitle = remote.summary?.trimmingCharacters(in: .whitespacesAndNewlines)
            let baseTitle = (remoteTitle?.isEmpty == false ? remoteTitle : nil)
                ?? (event.title ?? "").replacingOccurrences(of: "\(marker): ", with: "")
            let expectedTitle = "\(marker): \(baseTitle)"
            if event.title != expectedTitle {
                event.title = expectedTitle
                eventChanged = true
            }
        } else {
            if let summary = remote.summary,
               !summary.isEmpty,
               event.title != summary {
                event.title = summary
                eventChanged = true
            }
        }

        if let start = remote.start,
           abs(event.startDate.timeIntervalSince(start)) >= 0.5 {
            event.startDate = start
            eventChanged = true
        }
        if let end = remote.end {
            let safeEnd = max(end, event.startDate)
            if abs(event.endDate.timeIntervalSince(safeEnd)) >= 0.5 {
                event.endDate = safeEnd
                eventChanged = true
            }
        }
        if let isAllDay = remote.isAllDay,
           event.isAllDay != isAllDay {
            event.isAllDay = isAllDay
            eventChanged = true
        }

        let remoteLocation = normalized(remote.location)
        if normalized(event.location) != remoteLocation {
            event.location = remoteLocation.isEmpty ? nil : remoteLocation
            eventChanged = true
        }

        let trackingChanged = updated != invite
        guard eventChanged || trackingChanged else { return false }

        do {
            if eventChanged {
                try store.save(event, span: .thisEvent, commit: true)
            }
            SharedInviteTracker.update(updated)
            EventNotificationManager.shared.rescheduleUpcomingEventNotifications()
            NotificationCenter.default.post(name: .sharedEventImported, object: nil)
            return true
        } catch {
            print("Invite update could not be saved - \(error.localizedDescription)")
            return false
        }
    }

    private static func normalized(_ value: String?) -> String {
        value?.trimmingCharacters(in: .whitespacesAndNewlines) ?? ""
    }
}

/// Rebuilds the local tracker indexes from the authenticated account. EventKit
/// events survive an app reinstall, while UserDefaults does not; marker URLs
/// make the original copies identifiable even when their title/time changed
/// before the last server upload.
@MainActor
enum SharedEventRecovery {
    private static var restoredAccountKey: String?

    static func restoreFromServer(force: Bool = true) async {
        guard let session = CalendarFeedSession.existing else { return }
        let accountKey = session.ownerId ?? session.calendarId
        guard force || restoredAccountKey != accountKey else { return }
        guard hasCalendarAccess else { return }

        do {
            // One-time migration for invites accepted before account-backed
            // recovery existed.
            for invite in SharedInviteTracker.tracked().values {
                try? await CloudCalendarsAPI.rememberReceivedInvite(
                    eventId: invite.eventID,
                    feedId: invite.feedID,
                    session: session
                )
            }

            let state = try await CloudCalendarsAPI.sharedState(session: session)
            let store = CalendarViewModel.shared.eventStore

            for remote in state.outgoing {
                let local = findEvent(
                    remote,
                    markerHost: "shared-event",
                    preferredIdentifier: outgoingIdentifier(for: remote.id, in: store),
                    store: store
                )
                SharedOutgoingEventTracker.restore(
                    remote,
                    localEventIdentifier: local?.eventIdentifier
                )
                if let local {
                    EventShareIdentity.embedOwnerID(remote.id, in: local, store: store)
                }
            }

            for remote in state.received {
                let preferred = SharedInviteTracker.invite(eventID: remote.id)?.localEventIdentifier
                let local = findEvent(
                    remote,
                    markerHost: "received-event",
                    preferredIdentifier: preferred,
                    store: store
                ) ?? createReceivedEvent(remote, store: store)

                if let identifier = local?.eventIdentifier {
                    SharedInviteTracker.restore(remote, localEventIdentifier: identifier)
                }
            }

            restoredAccountKey = accountKey
            NotificationCenter.default.post(name: .sharedEventsTrackingChanged, object: nil)
            NotificationCenter.default.post(name: .sharedEventImported, object: nil)
        } catch {
            print("Shared-event account recovery failed - \(error.localizedDescription)")
        }
    }

    private static var hasCalendarAccess: Bool {
        EKEventStore.authorizationStatus(for: .event) == .fullAccess
    }

    private static func outgoingIdentifier(
        for eventID: String,
        in store: EKEventStore
    ) -> String? {
        if let identifier = SharedOutgoingEventTracker.sentEvents(in: store)
            .first(where: { $0.eventID == eventID })?
            .localEventIdentifier {
            return identifier
        }
        return EventShareIdentity.knownShareIDsByEvent
            .first(where: { $0.value == eventID })?
            .key
    }

    private static func findEvent(
        _ remote: CloudCalendarsAPI.RemoteSharedEvent,
        markerHost: String,
        preferredIdentifier: String?,
        store: EKEventStore
    ) -> EKEvent? {
        if let preferredIdentifier,
           let preferred = store.event(withIdentifier: preferredIdentifier) {
            return preferred
        }
        guard let start = remote.startDate, let end = remote.endDate else { return nil }

        let predicate = store.predicateForEvents(
            withStart: start.addingTimeInterval(-24 * 60 * 60),
            end: end.addingTimeInterval(24 * 60 * 60),
            calendars: nil
        )
        let candidates = store.events(matching: predicate)

        if let marked = candidates.first(where: {
            EventShareIdentity.embeddedShareID(in: $0, host: markerHost) == remote.id
        }) {
            return marked
        }

        return candidates.first { event in
            let title = (event.title ?? "")
                .replacingOccurrences(
                    of: "\(NSLocalizedString("Cancelled", comment: "")): ",
                    with: ""
                )
            return title == remote.title
                && abs(event.startDate.timeIntervalSince(start)) < 1
                && abs(event.endDate.timeIntervalSince(end)) < 1
                && event.isAllDay == remote.allDay
                && normalized(event.location) == normalized(remote.location)
        }
    }

    private static func createReceivedEvent(
        _ remote: CloudCalendarsAPI.RemoteSharedEvent,
        store: EKEventStore
    ) -> EKEvent? {
        guard let start = remote.startDate,
              let end = remote.endDate,
              let destination = [
                SharedInviteCalendar.destination(in: store),
                store.defaultCalendarForNewEvents,
                CalendarViewModel.shared.pickFirstWritableSelectedCalendar(),
                store.calendars(for: .event).first(where: \.allowsContentModifications)
              ].compactMap({ $0 }).first(where: \.allowsContentModifications)
        else { return nil }

        let event = EKEvent(eventStore: store)
        let cancelledPrefix = NSLocalizedString("Cancelled", comment: "")
        event.title = remote.isCancelled
            ? "\(cancelledPrefix): \(remote.title)"
            : remote.title
        event.startDate = start
        event.endDate = max(start, end)
        event.isAllDay = remote.allDay
        event.location = remote.location
        event.url = EventShareIdentity.receivedMarkerURL(eventID: remote.id)
        event.calendar = destination

        do {
            try store.save(event, span: .thisEvent, commit: true)
            return event
        } catch {
            print("Recovered invite could not be written to EventKit - \(error.localizedDescription)")
            return nil
        }
    }

    private static func normalized(_ value: String?) -> String {
        value?.trimmingCharacters(in: .whitespacesAndNewlines) ?? ""
    }
}

/// The handful of iCalendar fields an invite needs. Deliberately not a general
/// parser: it reads feeds this app produced, whose shape is known.
struct ICSEvent {
    var uid: String
    var summary: String?
    var location: String?
    var start: Date?
    var end: Date?
    var isAllDay: Bool?
    var sequence: Int = 0
    var isCancelled: Bool = false

    static func first(withUID uid: String, in text: String) -> ICSEvent? {
        // The UID the server writes is the event id plus its own domain.
        let target = uid.contains("@") ? uid : "\(uid)@cloud-calendars.com"

        for block in unfolded(text).split(separator: "BEGIN:VEVENT").dropFirst() {
            var event = ICSEvent(uid: "")
            for line in block.split(whereSeparator: \.isNewline) {
                guard let separator = line.firstIndex(where: { $0 == ":" }) else { continue }
                let name = String(line[line.startIndex..<separator])
                let value = String(line[line.index(after: separator)...])
                let key = name.split(separator: ";").first.map(String.init) ?? name

                switch key {
                case "UID":       event.uid = value
                case "SUMMARY":   event.summary = unescaped(value)
                case "LOCATION":  event.location = unescaped(value)
                case "DTSTART":
                    event.start = date(from: value, parameters: name)
                    event.isAllDay = name.contains("VALUE=DATE")
                case "DTEND":     event.end = date(from: value, parameters: name)
                case "SEQUENCE":  event.sequence = Int(value) ?? 0
                case "STATUS":    event.isCancelled = value.uppercased() == "CANCELLED"
                default:          break
                }
            }
            if event.uid == target { return event }
        }
        return nil
    }

    /// RFC 5545 splits long lines and continues them with a leading space, so
    /// a folded SUMMARY would otherwise be read as a truncated one.
    private static func unfolded(_ text: String) -> String {
        text.replacingOccurrences(of: "\r\n ", with: "")
            .replacingOccurrences(of: "\n ", with: "")
            .replacingOccurrences(of: "\r\n", with: "\n")
    }

    private static func unescaped(_ value: String) -> String {
        value.replacingOccurrences(of: "\\n", with: "\n")
            .replacingOccurrences(of: "\\,", with: ",")
            .replacingOccurrences(of: "\\;", with: ";")
            .replacingOccurrences(of: "\\\\", with: "\\")
    }

    private static func date(from value: String, parameters: String) -> Date? {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "en_US_POSIX")

        if parameters.contains("VALUE=DATE") {
            formatter.dateFormat = "yyyyMMdd"
            formatter.timeZone = .current           // all-day: local midnight
            return formatter.date(from: value)
        }

        formatter.dateFormat = value.hasSuffix("Z") ? "yyyyMMdd'T'HHmmss'Z'" : "yyyyMMdd'T'HHmmss"
        formatter.timeZone = value.hasSuffix("Z") ? TimeZone(identifier: "UTC") : .current
        return formatter.date(from: value)
    }
}
