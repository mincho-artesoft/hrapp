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
        let invites = SharedInviteTracker.tracked().values.filter { !$0.isCancelled }
        guard !invites.isEmpty else { return 0 }

        var changed = 0
        for invite in invites where await refresh(invite) {
            changed += 1
        }
        return changed
    }

    /// Returns true when the local copy was actually altered.
    private static func refresh(_ invite: SharedInviteTracker.Invite) async -> Bool {
        guard let url = URL(string: "https://\(feedHost)/f/\(invite.feedID).ics") else { return false }

        do {
            let (data, response) = try await URLSession.shared.data(from: url)
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
        // SEQUENCE only ever goes up, so an equal or lower one means we have
        // already applied this revision and can skip the EventKit write.
        guard remote.sequence > invite.lastSequence else { return false }

        let store = CalendarViewModel.shared.eventStore
        guard let event = store.event(withIdentifier: invite.localEventIdentifier) else {
            // The person deleted it themselves; stop tracking rather than
            // resurrecting an event they threw away.
            SharedInviteTracker.forget(eventID: invite.eventID)
            return false
        }

        var updated = invite
        updated.lastSequence = remote.sequence

        if remote.isCancelled {
            // EKEvent.status is read-only, so the cancellation is carried in
            // the title. Without it the event would look untouched in every
            // other calendar app the person uses.
            let marker = NSLocalizedString(
                "Cancelled",
                comment: "Prefix on an invitation the organiser called off"
            )
            let title = event.title ?? ""
            if !title.hasPrefix("\(marker):") {
                event.title = "\(marker): \(title)"
            }
            updated.isCancelled = true
        } else {
            if let start = remote.start { event.startDate = start }
            if let end = remote.end { event.endDate = max(end, event.startDate) }
            if let summary = remote.summary, !summary.isEmpty { event.title = summary }
            event.location = remote.location
        }

        do {
            try store.save(event, span: .thisEvent, commit: true)
            SharedInviteTracker.update(updated)
            EventNotificationManager.shared.rescheduleUpcomingEventNotifications()
            NotificationCenter.default.post(name: .sharedEventImported, object: nil)
            return true
        } catch {
            print("Invite update could not be saved - \(error.localizedDescription)")
            return false
        }
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
                case "DTSTART":   event.start = date(from: value, parameters: name)
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
