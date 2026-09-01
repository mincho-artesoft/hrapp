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

        let store = CalendarViewModel.shared.eventStore
        for invite in invites {
            if let event = store.event(withIdentifier: invite.localEventIdentifier) {
                EventShareIdentity.removeLegacyMarker(from: event, store: store)
            }
        }

        var changed = 0
        for invite in invites where await refresh(invite) {
            changed += 1
        }
        return changed
    }

    /// Returns true when the local copy was actually altered.
    private static func refresh(_ original: SharedInviteTracker.Invite) async -> Bool {
        // Revocation freezes the recipient's copy. It remains in their chosen
        // calendar until they delete it locally, but no longer talks to S3.
        guard original.isRevoked != true else { return false }

        var invite = original
        var accessChanged = false

        if invite.receiptRecorded != true {
            do {
                if let session = CalendarFeedSession.existing {
                    try await CloudCalendarsAPI.rememberReceivedInvite(
                        eventId: invite.eventID,
                        feedId: invite.feedID,
                        localEventIdentifier: invite.localEventIdentifier,
                        anonymousRecipientId: SharedInviteTracker.anonymousRecipientID,
                        session: session
                    )
                } else {
                    try await CloudCalendarsAPI.rememberAnonymousReceivedInvite(
                        eventId: invite.eventID,
                        feedId: invite.feedID,
                        anonymousRecipientId: SharedInviteTracker.anonymousRecipientID
                    )
                }
                invite.receiptRecorded = true
                SharedInviteTracker.update(invite)
            } catch {
                print("Invite receipt could not be recorded for \(invite.eventID) - \(error.localizedDescription)")
            }
        }

        if let session = CalendarFeedSession.existing {
            do {
                let access = try await CloudCalendarsAPI.receivedInviteAccess(
                    eventId: invite.eventID,
                    session: session
                )
                if invite.effectiveAccess != access {
                    invite.access = access
                    SharedInviteTracker.update(invite)
                    accessChanged = true
                }
            } catch CloudCalendarsAPI.Failure.http(let code, _) where code == 404 {
                return markRevokedInvite(invite)
            } catch CloudCalendarsAPI.Failure.http(let code, _) where code == 403 {
                if invite.effectiveAccess != .reader {
                    invite.access = .reader
                    SharedInviteTracker.update(invite)
                    accessChanged = true
                }
            } catch {
                print("Invite access refresh failed for \(invite.eventID) - \(error.localizedDescription)")
            }
        } else {
            do {
                _ = try await CloudCalendarsAPI.anonymousReceivedInviteAccess(
                    eventId: invite.eventID,
                    feedId: invite.feedID,
                    anonymousRecipientId: SharedInviteTracker.anonymousRecipientID
                )
            } catch CloudCalendarsAPI.Failure.http(let code, _)
                where code == 403 || code == 404 {
                return markRevokedInvite(invite)
            } catch {
                print("Anonymous invite access refresh failed for \(invite.eventID) - \(error.localizedDescription)")
            }

            if invite.effectiveAccess != .reader {
                // Writer is an account permission. A signed-out device can still
                // receive and follow the event, but must fall back to Reader.
                invite.access = .reader
                SharedInviteTracker.update(invite)
                accessChanged = true
            }
        }

        if accessChanged {
            NotificationCenter.default.post(name: .sharedEventsTrackingChanged, object: nil)
            NotificationCenter.default.post(name: .sharedEventImported, object: nil)
        }

        do {
            let remote = try await fetchRemote(invite)

            // At an unchanged server revision, a Writer's local difference is
            // a new edit. Push it before the normal pull step can restore the
            // old S3 value. A newer server revision always wins first.
            if invite.effectiveAccess == .writer,
               remote.sequence == invite.lastSequence,
               let session = CalendarFeedSession.existing,
               let event = CalendarViewModel.shared.eventStore
                .event(withIdentifier: invite.localEventIdentifier),
               let current = SharedOutgoingEventTracker.snapshot(for: event),
               let baseline = invite.lastSyncedSnapshot,
               current != baseline {
                let upload = SharedEventUpload(
                    id: invite.eventID,
                    title: current.title,
                    start: current.start,
                    end: current.end,
                    isAllDay: current.isAllDay,
                    location: current.location,
                    url: current.url.flatMap(URL.init(string:)),
                    details: current.details ?? SharedEventDetails(event: event),
                    localEventIdentifier: nil,
                    organizerName: nil,
                    organizerEmail: nil
                )
                do {
                    try await CloudCalendarsAPI.upsertEvent(
                        upload,
                        session: session,
                        receivedFeedId: invite.feedID
                    )
                    invite.lastSequence = remote.sequence + 1
                    invite.lastSyncedSnapshot = current
                    SharedInviteTracker.update(invite)

                    if let latest = try? await fetchRemote(invite),
                       latest.sequence >= invite.lastSequence {
                        _ = apply(latest, to: invite)
                        return true
                    }
                    NotificationCenter.default.post(name: .sharedEventsTrackingChanged, object: nil)
                    return true
                } catch CloudCalendarsAPI.Failure.http(let code, _) where code == 403 {
                    invite.access = .reader
                    SharedInviteTracker.update(invite)
                    _ = apply(remote, to: invite)
                    return true
                }
            }

            return apply(remote, to: invite) || accessChanged
        } catch CloudCalendarsAPI.Failure.http(let code, _) where code == 404 {
            return markRevokedInvite(invite) || accessChanged
        } catch {
            print("Invite refresh failed for \(invite.eventID) - \(error.localizedDescription)")
            return accessChanged
        }
    }

    private static func markRevokedInvite(_ invite: SharedInviteTracker.Invite) -> Bool {
        guard invite.isRevoked != true else { return false }
        var updated = invite
        updated.isRevoked = true
        updated.access = .reader
        SharedInviteTracker.update(updated)
        NotificationCenter.default.post(name: .sharedEventsTrackingChanged, object: nil)
        NotificationCenter.default.post(name: .sharedEventImported, object: nil)
        return true
    }

    private static func fetchRemote(_ invite: SharedInviteTracker.Invite) async throws -> ICSEvent {
        guard var components = URLComponents(
            string: "https://\(feedHost)/f/\(invite.feedID).ics"
        ) else { throw URLError(.badURL) }

        // Every foreground poll must see the latest S3 object. The query value
        // also avoids an intermediary CDN returning its cached previous body.
        components.queryItems = [
            URLQueryItem(name: "refresh", value: UUID().uuidString)
        ]
        guard let url = components.url else { throw URLError(.badURL) }
        var request = URLRequest(url: url, cachePolicy: .reloadIgnoringLocalCacheData)
        request.setValue("no-cache", forHTTPHeaderField: "Cache-Control")

        let (data, response) = try await URLSession.shared.data(for: request)
        if let http = response as? HTTPURLResponse, http.statusCode == 404 {
            throw CloudCalendarsAPI.Failure.http(404, "Shared feed was revoked")
        }
        guard let text = String(data: data, encoding: .utf8),
              let remote = ICSEvent.first(withUID: invite.eventID, in: text)
        else { throw CloudCalendarsAPI.Failure.malformedResponse }
        return remote
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
        EventShareIdentity.removeLegacyMarker(from: event, store: store)

        // A poll with the same server revision must not write the same values
        // back to EventKit. EKEventViewController observes every EventKit save,
        // so those redundant writes make an already-open details screen flash.
        // A Reader edit made from another calendar app still differs from this
        // baseline and is restored from S3 below; Writer edits are uploaded by
        // refresh(_:) before this method is reached.
        if remote.sequence == invite.lastSequence,
           let baseline = invite.lastSyncedSnapshot,
           SharedOutgoingEventTracker.snapshot(for: event) == baseline,
           invite.isCancelled == remote.isCancelled {
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

        let providerManagedURL = ["gcal", "mscal"].contains(
            event.url?.scheme?.lowercased() ?? ""
        )
        if !providerManagedURL, event.url != remote.url {
            event.url = remote.url
            eventChanged = true
        }

        if let details = remote.details,
           !details.matchesWritableFields(of: event) {
            details.applyWritableFields(to: event)
            eventChanged = true
        }

        let trackingChanged = updated != invite
        guard eventChanged || trackingChanged else { return false }

        do {
            if eventChanged {
                let span: EKSpan = event.hasRecurrenceRules ? .futureEvents : .thisEvent
                try store.save(event, span: span, commit: true)
                updated.localEventIdentifier = event.eventIdentifier
            }

            // EventKit may normalize alarms, time zones, structured locations,
            // or identifiers while saving. Persist its canonical post-save
            // state so the next 20-second poll does not mistake normalization
            // for a local edit and save the event again.
            let persistedEvent = store.event(withIdentifier: updated.localEventIdentifier)
            updated.lastSyncedSnapshot = persistedEvent
                .flatMap(SharedOutgoingEventTracker.snapshot(for:))
                ?? SharedOutgoingEventTracker.snapshot(for: event)
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
/// events survive an app reinstall, while UserDefaults does not. Opaque local
/// identifiers are kept in private account metadata, with event fields as a
/// fallback when EventKit changes an identifier during a full calendar sync.
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
                    localEventIdentifier: invite.localEventIdentifier,
                    anonymousRecipientId: SharedInviteTracker.anonymousRecipientID,
                    session: session
                )
            }

            let state = try await CloudCalendarsAPI.sharedState(session: session)
            let store = CalendarViewModel.shared.eventStore

            for remote in state.outgoing {
                let local = findEvent(
                    remote,
                    preferredIdentifier: outgoingIdentifier(for: remote.id, in: store)
                        ?? remote.localEventIdentifier,
                    store: store
                )
                SharedOutgoingEventTracker.restore(
                    remote,
                    localEventIdentifier: local?.eventIdentifier
                )
            }

            for remote in state.received {
                let preferred = SharedInviteTracker.invite(eventID: remote.id)?.localEventIdentifier
                let local = findEvent(
                    remote,
                    preferredIdentifier: preferred ?? remote.localEventIdentifier,
                    store: store
                ) ?? createReceivedEvent(remote, store: store)

                if let identifier = local?.eventIdentifier {
                    SharedInviteTracker.restore(remote, localEventIdentifier: identifier)
                    try? await CloudCalendarsAPI.rememberReceivedInvite(
                        eventId: remote.id,
                        feedId: remote.feedId,
                        localEventIdentifier: identifier,
                        anonymousRecipientId: SharedInviteTracker.anonymousRecipientID,
                        session: session
                    )
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
        preferredIdentifier: String?,
        store: EKEventStore
    ) -> EKEvent? {
        if let preferredIdentifier,
           let preferred = store.event(withIdentifier: preferredIdentifier) {
            EventShareIdentity.removeLegacyMarker(from: preferred, store: store)
            return preferred
        }
        guard let start = remote.startDate, let end = remote.endDate else { return nil }

        let predicate = store.predicateForEvents(
            withStart: start.addingTimeInterval(-24 * 60 * 60),
            end: end.addingTimeInterval(24 * 60 * 60),
            calendars: nil
        )
        let candidates = store.events(matching: predicate)

        let matched = candidates.first { event in
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
        if let matched {
            EventShareIdentity.removeLegacyMarker(from: matched, store: store)
        }
        return matched
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
        event.url = remote.url.flatMap(URL.init(string:))
        remote.details?.applyWritableFields(to: event)
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
    var url: URL?
    var details: SharedEventDetails?
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
                case "URL":       event.url = URL(string: value)
                case "X-CLOUD-CALENDARS-METADATA":
                    if let data = Data(base64Encoded: value) {
                        event.details = try? JSONDecoder().decode(SharedEventDetails.self, from: data)
                    }
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
