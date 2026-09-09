#if DEBUG
import CryptoKit
import EventKit
import Foundation
import UIKit

/// Authenticated, simulator-only sharing matrix. All writes address newly
/// created QA resources, not the user's seeded or synced provider calendars.
@MainActor
enum SharingMatrixE2ETest {
    struct Item: Codable {
        var kind: String
        var access: CloudCalendarsAPI.EventAccess
        var calendarID: String
        var localCalendarID: String
        var localEventID: String
        var eventID: String
        var url: String
        var label: String
    }
    struct Manifest: Codable {
        var ownerID: String
        var recipient = "aleksandarsvinarov@gmail.com"
        var items: [Item] = []
        var sent: [String] = []
        var destination: String?
    }
    static let directory = URL.documentsDirectory.appendingPathComponent("SharingMatrixE2E")
    static var manifestURL: URL { directory.appendingPathComponent("manifest.json") }
    static var checks: [String: Bool] = [:]
    static var errors: [String] = []
    static var store: AppLocalCalendarStore { .shared }
    static var ek: EKEventStore { CalendarViewModel.shared.eventStore }
    static var start: Date { Calendar.current.startOfDay(for: Date()).addingTimeInterval(10 * 3600) }
    static func check(_ name: String, _ value: Bool) { checks[name] = value }
    static func require(_ value: Bool, _ message: String) throws {
        if !value { throw NSError(domain: "SharingMatrix", code: 1, userInfo: [NSLocalizedDescriptionKey: message]) }
    }
    static func save(_ manifest: Manifest) throws { try JSONEncoder().encode(manifest).write(to: manifestURL, options: .atomic) }
    static func load() throws -> Manifest { try JSONDecoder().decode(Manifest.self, from: Data(contentsOf: manifestURL)) }
    static func hash(_ value: String) -> String { SHA256.hash(data: Data(value.utf8)).map { String(format: "%02x", $0) }.joined() }
    static func nativeEvents(_ calendar: EKCalendar) -> [EKEvent] {
        ek.events(matching: ek.predicateForEvents(withStart: start.addingTimeInterval(-86400),
            end: start.addingTimeInterval(7 * 86400), calendars: [calendar]))
    }
    static func denied(_ name: String, _ operation: () async throws -> Void) async {
        do { try await operation(); check(name, false) }
        catch CloudCalendarsAPI.Failure.http(let code, _) { check(name, code == 403) }
        catch { errors.append(name + ": " + error.localizedDescription); check(name, false) }
    }
    static func run(action: String) async -> String {
        do {
            try require(CloudCalendarsAPI.baseURL.host == "63yo3ore3c.execute-api.us-east-1.amazonaws.com", "Debug only")
            let device = ProcessInfo.processInfo.environment["SIMULATOR_UDID"] ?? ""
            try require(["1A67A8FA-A72D-4244-9C1C-551D1C473FD4", "786598BD-4158-4A5B-851F-8E04FDE3BC98"].contains(device), "Wrong simulator")
            try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
            let session = try await CalendarFeedSession.current()
            let isReceiver = action == "matrix-receiver"
            try require(session.email?.lowercased() == (isReceiver ? "aleksandarsvinarov@gmail.com" : "sashko125@gmail.com"), "Wrong test account")
            switch action {
            case "matrix-seed": try await seed(session)
            case "matrix-send": try await send(session)
            case "matrix-receiver": try await receiver(session)
            case "matrix-owner": try await owner(session)
            case "matrix-repair": try await repairQA(session)
            default: try require(false, "Unknown action")
            }
        } catch { errors.append(error.localizedDescription); check("Completed without error", false) }
        let status = !checks.isEmpty && checks.values.allSatisfy { $0 } && errors.isEmpty ? "PASS" : "FAIL"
        let report: [String: Any] = ["status": status, "action": action, "checks": checks, "errors": errors,
            "scope": "Real Debug API and app services; EventKit uses independent device-local source, not iCloud provider sync"]
        if let data = try? JSONSerialization.data(withJSONObject: report, options: [.prettyPrinted, .sortedKeys]) {
            try? data.write(to: directory.appendingPathComponent(action + ".json"), options: .atomic)
        }
        return status + ": " + action + "\n" + checks.sorted { $0.key < $1.key }.map { "\($0.value ? "✓" : "✗") \($0.key)" }.joined(separator: "\n") + errors.joined(separator: "\n")
    }
    static func seed(_ session: CloudCalendarsAPI.Session) async throws {
        try require(!FileManager.default.fileExists(atPath: manifestURL.path), "Matrix already exists; do not duplicate")
        var manifest = Manifest(ownerID: try await CloudCalendarsAPI.sharedState(session: session).ownerId)
        try save(manifest)
        for kind in ["app_local", "eventkit"] {
            for role: CloudCalendarsAPI.EventAccess in [.reader, .writer, .owner] {
                let label = "QA Sep09 \(kind == "app_local" ? "Local" : "EventKit") \(role.rawValue.capitalized)"
                let localID: String
                let localEventID: String
                let calendarID: String
                let url: URL
                if kind == "app_local" {
                    let calendar = store.createCalendar(title: label, color: .systemPurple)
                    localID = calendar.id; calendarID = calendar.shareID
                    let individual = AppLocalEventRecord(calendarID: localID, title: label + " — Event invitation",
                        startDate: start, endDate: start.addingTimeInterval(5400), location: "София / دبي",
                        notes: "QA matrix notes", timeZoneIdentifier: "Europe/Sofia", alarms: [.init(relativeOffset: -900)])
                    store.saveEvent(individual); localEventID = individual.id
                    store.saveEvent(.init(calendarID: localID, title: label + " — اجتماع 51h",
                        startDate: start.addingTimeInterval(7200), endDate: start.addingTimeInterval(53 * 3600), notes: "Calendar notes"))
                    store.saveEvent(.init(calendarID: localID, title: label + " — All day",
                        startDate: Calendar.current.startOfDay(for: Date()).addingTimeInterval(86400),
                        endDate: Calendar.current.startOfDay(for: Date()).addingTimeInterval(2 * 86400), isAllDay: true))
                    let descriptor = AppLocalEventDescriptor(eventID: individual.id, partialStart: individual.startDate, partialEnd: individual.endDate)
                    guard let shared = await EventAppClipSharing.shareableURL(for: descriptor) else { throw CloudCalendarsAPI.Failure.malformedResponse }
                    url = shared
                    SharedOutgoingEventTracker.record(url: shared, localEventIdentifier: individual.id)
                    let repeated = await EventAppClipSharing.shareableURL(for: descriptor)
                    check(label + " repeat event share keeps feed", repeated.flatMap(SharedEventImportPayload.init(url:))?.feedID == SharedEventImportPayload(url: url)?.feedID)
                } else {
                    let calendar = EKCalendar(for: .event, eventStore: ek)
                    calendar.title = label; calendar.cgColor = UIColor.systemBlue.cgColor
                    calendar.source = ek.sources.first { $0.sourceType == .local }
                    try require(calendar.source != nil, "No independent EventKit source")
                    try ek.saveCalendar(calendar, commit: true)
                    localID = calendar.calendarIdentifier; calendarID = hash(localID)
                    let individual = EKEvent(eventStore: ek)
                    individual.calendar = calendar; individual.title = label + " — Event invitation"
                    individual.startDate = start; individual.endDate = start.addingTimeInterval(5400)
                    individual.location = "София / دبي"; individual.notes = "QA matrix notes"
                    individual.timeZone = TimeZone(identifier: "Europe/Sofia"); individual.addAlarm(EKAlarm(relativeOffset: -900))
                    try ek.save(individual, span: .thisEvent, commit: true); localEventID = individual.eventIdentifier
                    let long = EKEvent(eventStore: ek); long.calendar = calendar; long.title = label + " — اجتماع 51h"
                    long.startDate = start.addingTimeInterval(7200); long.endDate = start.addingTimeInterval(53 * 3600)
                    try ek.save(long, span: .thisEvent, commit: true)
                    let allDay = EKEvent(eventStore: ek); allDay.calendar = calendar; allDay.title = label + " — All day"
                    allDay.startDate = Calendar.current.startOfDay(for: Date()).addingTimeInterval(86400)
                    allDay.endDate = allDay.startDate.addingTimeInterval(86400); allDay.isAllDay = true
                    try ek.save(allDay, span: .thisEvent, commit: true)
                    guard let shared = await EventAppClipSharing.shareableURL(for: individual) else { throw CloudCalendarsAPI.Failure.malformedResponse }
                    url = shared; SharedOutgoingEventTracker.record(url: shared, localEventIdentifier: localEventID)
                    let repeated = await EventAppClipSharing.shareableURL(for: individual)
                    check(label + " repeat event share keeps feed", repeated.flatMap(SharedEventImportPayload.init(url:))?.feedID == SharedEventImportPayload(url: url)?.feedID)
                }
                let payload = SharedEventImportPayload(url: url)!
                manifest.items.append(Item(kind: kind, access: role, calendarID: calendarID, localCalendarID: localID,
                    localEventID: localEventID, eventID: payload.eventID!, url: url.absoluteString, label: label))
                try save(manifest)
                _ = try await CloudCalendarsAPI.saveICloudCalendarSharing(calendarId: calendarID, title: label,
                    color: kind == "app_local" ? "#AF52DE" : "#007AFF", timeZone: "Europe/Sofia", calendarKind: kind,
                    recipients: [(email: manifest.recipient, access: role)], session: session)
                if kind == "app_local" { _ = store.registerForSharing(id: localID); _ = await AppLocalCalendarSyncService.syncAll() }
                else { SharedICloudCalendarLocalStore.registerOwnedCalendar(shareID: calendarID, localCalendarIdentifier: localID)
                    _ = await SharedICloudCalendarLocalStore.syncOwnedCalendars(in: ek) }
                let remote = try await CloudCalendarsAPI.iCloudCalendarSharing(calendarId: calendarID, session: session)
                check(label + " three events uploaded with correct kind", remote.events?.count == 3 && remote.calendarKind == kind)
            }
        }
    }
    static func send(_ session: CloudCalendarsAPI.Session) async throws {
        var manifest = try load()
        try require(manifest.items.count == 6, "Incomplete seed")
        for item in manifest.items {
            for kind in ["event", "calendar"] {
                let key = item.calendarID + ":" + kind
                if manifest.sent.contains(key) { continue }
                if kind == "event" {
                    let url = EventShareEndpoint.serverInvitationURL(from: URL(string: item.url)!)!
                    _ = try await CloudCalendarsAPI.inviteEventRecipients(eventId: item.eventID, eventURL: url,
                        invitations: [.init(email: manifest.recipient, access: item.access)], session: session)
                } else {
                    _ = try await CloudCalendarsAPI.inviteICloudCalendarRecipients(calendarId: item.calendarID, emails: [manifest.recipient], session: session)
                }
                manifest.sent.append(key); try save(manifest)
                check(item.label + " " + kind + " invitation requested", true)
            }
        }
        check("Twelve distinct invitation requests recorded", manifest.sent.count == 12)
    }
    static func receiver(_ session: CloudCalendarsAPI.Session) async throws {
        var manifest = try load()
        let firstAcceptance = manifest.destination == nil
        if manifest.destination == nil {
            let calendar = EKCalendar(for: .event, eventStore: ek); calendar.title = "QA Sep09 Individual imports"
            calendar.source = ek.sources.first { $0.sourceType == .local }
            try require(calendar.source != nil, "Independent import source required")
            try ek.saveCalendar(calendar, commit: true); manifest.destination = calendar.calendarIdentifier; try save(manifest)
        }
        let pending = try await CloudCalendarsAPI.pendingEventInvitations(session: session)
        if firstAcceptance {
            check("All six event invitations are pending and parseable", manifest.items.allSatisfy { item in pending.contains { $0.eventId == item.eventID && $0.importPayload != nil } })
        } else {
            check("All six accepted event identities survive restart", manifest.items.allSatisfy { SharedInviteTracker.tracked()[$0.eventID] != nil })
        }
        for item in manifest.items {
            do { try await receive(item, manifest: manifest, session: session) }
            catch { errors.append(item.label + ": " + error.localizedDescription) }
        }
    }
    static func receive(_ item: Item, manifest: Manifest, session: CloudCalendarsAPI.Session) async throws {
        let label = item.label
        let payload = SharedEventImportPayload(url: URL(string: item.url)!)!
        let previousLocalID = SharedInviteTracker.invite(eventID: item.eventID)?.localEventIdentifier
        var compact = URLComponents(url: EventShareEndpoint.serverInvitationURL(from: URL(string: item.url)!)!, resolvingAgainstBaseURL: false)!
        compact.queryItems = compact.queryItems?.filter { ["e", "c", "timeZone", "color"].contains($0.name) }
        let resolved = await SharedEventImportPayload.resolve(url: compact.url!)
        check(label + " compact QR resolves full event", resolved?.title.hasPrefix(label) == true && resolved?.location == payload.location && resolved?.eventID == item.eventID)
        let result = await SharedEventImporter.add(payload, toCalendarWithIdentifier: manifest.destination)
        if case .added = result { check(label + " individual imported", true) }
        else if case .alreadyExists = result { check(label + " individual imported", true) }
        else { check(label + " individual imported", false) }
        let repeatResult = await SharedEventImporter.add(payload, toCalendarWithIdentifier: manifest.destination)
        if case .alreadyExists = repeatResult { check(label + " duplicate import avoided", true) } else { check(label + " duplicate import avoided", false) }
        guard let invite = SharedInviteTracker.tracked()[item.eventID], let event = ek.event(withIdentifier: invite.localEventIdentifier) else { throw CloudCalendarsAPI.Failure.malformedResponse }
        if let previousLocalID {
            check(label + " repeat acceptance preserves local identity", invite.localEventIdentifier == previousLocalID)
        }
        check(label + " event role enforced", invite.effectiveAccess == item.access)
        check(label + " complete event notes and alarm", event.notes?.hasPrefix("QA matrix notes") == true && event.alarms?.contains { $0.relativeOffset == -900 } == true)
        if item.access == .reader {
            await denied(label + " Reader event edit denied by server") {
                try await CloudCalendarsAPI.upsertEvent(SharedEventUpload(id: item.eventID, title: "Forbidden QA edit", start: event.startDate, end: event.endDate,
                    isAllDay: event.isAllDay, location: event.location, url: event.url, details: SharedEventDetails(event: event),
                    localEventIdentifier: nil, organizerName: nil, organizerEmail: nil), session: session, receivedFeedId: payload.feedID)
            }
        } else {
            event.title = label + " — Recipient edit"
            event.notes = "QA matrix notes — edit \(Date().timeIntervalSince1970)"
            try ek.save(event, span: .thisEvent, commit: true)
            _ = await SharedInviteRefresher.refreshAll()
            let state = try await CloudCalendarsAPI.sharedState(session: session)
            check(label + " recipient event edit uploads", state.received.contains { $0.id == item.eventID && $0.title == label + " — Recipient edit" })
            let repeatAfterEdit = await SharedEventImporter.add(payload, toCalendarWithIdentifier: manifest.destination)
            if case .alreadyExists = repeatAfterEdit {
                check(label + " stale invitation after edit does not duplicate", SharedInviteTracker.invite(eventID: item.eventID)?.localEventIdentifier == invite.localEventIdentifier)
            } else { check(label + " stale invitation after edit does not duplicate", false) }
            let persisted = ek.event(withIdentifier: invite.localEventIdentifier)
            check(label + " alarm survives edit and stale invitation", persisted?.alarms?.contains { $0.relativeOffset == -900 } == true)
        }
        if item.access == .owner {
            _ = try await CloudCalendarsAPI.eventRecipients(eventId: item.eventID, session: session)
            let forwarded = await EventAppClipSharing.shareableURL(for: event)
            check(label + " delegated Owner can reshare canonical event", forwarded.flatMap(SharedEventImportPayload.init(url:))?.feedID == payload.feedID)
        } else {
            await denied(label + " non-Owner cannot manage event recipients") { _ = try await CloudCalendarsAPI.eventRecipients(eventId: item.eventID, session: session) }
        }
        let remote = try await CloudCalendarsAPI.acceptICloudCalendarInvitation(ownerId: manifest.ownerID, calendarId: item.calendarID, session: session)
        check(label + " calendar acceptance preserves kind and role", remote.calendarKind == item.kind && remote.access == item.access)
        if item.kind == "app_local" { _ = store.applyRemoteCalendar(remote); _ = await AppLocalCalendarSyncService.syncAll() }
        else { _ = try SharedICloudCalendarLocalStore.reconcile(remote, in: ek); _ = await SharedICloudCalendarLocalStore.refreshAll() }
        if item.kind == "app_local" {
            let calendar = store.receivedCalendars.first { $0.remoteCalendarID == item.calendarID }
            check(label + " local calendar UI edit/share permissions", calendar?.canEditEvents == (item.access != .reader)
                && calendar?.canManageSharing == (item.access == .owner))
        } else if let calendar = SharedICloudCalendarLocalStore.localCalendar(for: remote, in: ek) {
            check(label + " native calendar UI edit/share permissions",
                SharedICloudCalendarLocalStore.canEditEvents(localCalendarIdentifier: calendar.calendarIdentifier) == (item.access != .reader)
                    && SharedICloudCalendarLocalStore.canManageSharing(localCalendarIdentifier: calendar.calendarIdentifier) == (item.access == .owner))
        }
        // Acceptance returns metadata; event snapshots arrive through the
        // subsequent production refresh, not in the acceptance response.
        let refreshed = try await CloudCalendarsAPI.iCloudCalendarsSharedWithMe(session: session).first { $0.calendarId == item.calendarID }
        check(label + " calendar all-day and 51h data", refreshed?.events?.contains { $0.allDay } == true && refreshed?.events?.contains { $0.endDate?.timeIntervalSince($0.startDate ?? .distantPast) == 51 * 3600 } == true)
        check(label + " absent and empty attachments are not an edit",
            SharedEventDetails(notes: nil, timeZone: "UTC", attachments: nil)
                == SharedEventDetails(notes: nil, timeZone: "UTC", attachments: []))
        if item.access == .reader {
            await denied(label + " Reader calendar event edit denied by server") {
                _ = try await CloudCalendarsAPI.saveICloudCalendarEvents(calendarId: item.calendarID, ownerId: manifest.ownerID,
                    events: remote.events ?? [], windowStart: start, windowEnd: start.addingTimeInterval(7 * 86400), expectedUpdatedAt: remote.eventsUpdatedAt, session: session)
            }
        } else if item.kind == "app_local" {
            guard let calendar = store.receivedCalendars.first(where: { $0.remoteCalendarID == item.calendarID }),
                  var long = store.events.first(where: { $0.calendarID == calendar.id && $0.title.contains("51h") })
            else { throw NSError(domain: "SharingMatrix", code: 2, userInfo: [NSLocalizedDescriptionKey: "Local 51h event missing after acceptance"]) }
            long.title = label + " — Recipient calendar edit 51h"; store.saveEvent(long)
            _ = await AppLocalCalendarSyncService.syncAll()
        } else {
            guard let calendar = SharedICloudCalendarLocalStore.localCalendar(for: remote, in: ek),
                  let long = nativeEvents(calendar).first(where: { $0.title.contains("51h") })
            else { throw NSError(domain: "SharingMatrix", code: 3, userInfo: [NSLocalizedDescriptionKey: "EventKit 51h event missing after acceptance"]) }
            long.title = label + " — Recipient calendar edit 51h"; try ek.save(long, span: .thisEvent, commit: true)
            _ = await SharedICloudCalendarLocalStore.refreshAll()
        }
        if item.access != .owner {
            await denied(label + " non-Owner cannot manage calendar sharing") { _ = try await CloudCalendarsAPI.iCloudCalendarSharing(calendarId: item.calendarID, ownerId: manifest.ownerID, session: session) }
        } else {
            let sharing = try await CloudCalendarsAPI.iCloudCalendarSharing(calendarId: item.calendarID, ownerId: manifest.ownerID, session: session)
            _ = try await CloudCalendarsAPI.saveICloudCalendarSharing(calendarId: item.calendarID, ownerId: manifest.ownerID,
                title: label + " — Owner metadata", color: sharing.color, timeZone: sharing.timeZone, calendarKind: item.kind,
                recipients: sharing.recipients.map { (email: $0.email, access: $0.access) }, expectedUpdatedAt: sharing.updatedAt, session: session)
            check(label + " delegated Owner manages calendar metadata", true)
        }
    }
    static func owner(_ session: CloudCalendarsAPI.Session) async throws {
        let manifest = try load()
        _ = await AppLocalCalendarSyncService.syncAll()
        _ = await SharedICloudCalendarLocalStore.syncOwnedCalendars(in: ek)
        _ = await SharedOutgoingEventTracker.syncAll(in: ek)
        _ = await SharedOutgoingEventTracker.pullRemoteChanges(in: ek)
        for item in manifest.items {
            let remote = try await CloudCalendarsAPI.iCloudCalendarSharing(calendarId: item.calendarID, session: session)
            let title = item.label + " — Recipient calendar edit 51h"
            if item.access != .reader {
                check(item.label + " creator does not overwrite calendar edit", remote.events?.contains { $0.title == title } == true)
                let localTitle: Bool
                if item.kind == "app_local" { localTitle = store.events.contains { $0.calendarID == item.localCalendarID && $0.title == title } }
                else { localTitle = ek.calendar(withIdentifier: item.localCalendarID).map { nativeEvents($0).contains { $0.title == title } } ?? false }
                check(item.label + " calendar edit reaches creator device", localTitle)
                let state = try await CloudCalendarsAPI.sharedState(session: session)
                check(item.label + " event edit reaches creator", state.outgoing.contains { $0.id == item.eventID && $0.title == item.label + " — Recipient edit" })
                let individualTitle = item.kind == "app_local" ? store.event(id: item.localEventID)?.title
                    : ek.event(withIdentifier: item.localEventID)?.title
                check(item.label + " individual edit reaches creator device", individualTitle == item.label + " — Recipient edit")
            }
            if item.access == .owner {
                check(item.label + " delegated metadata preserved", remote.title == item.label + " — Owner metadata")
            }
        }
    }
    /// Recover only empty QA matrix calendars from the still-intact creator
    /// copy after exercising the old repeated-acceptance defect. No reseed,
    /// new IDs, other calendars or invitation resends are involved.
    static func repairQA(_ session: CloudCalendarsAPI.Session) async throws {
        let manifest = try load()
        for item in manifest.items where item.kind == "app_local" {
            let remote = try await CloudCalendarsAPI.iCloudCalendarSharing(calendarId: item.calendarID, session: session)
            guard remote.events?.isEmpty == true else { continue }
            let source = store.events.filter { $0.calendarID == item.localCalendarID }
            try require(source.count == 3 && source.allSatisfy { $0.title.hasPrefix(item.label) }, "QA recovery identity mismatch")
            let events = source.map { event in
                CloudCalendarsAPI.SharedICloudCalendarEvent(id: event.shareID, title: event.title,
                    start: ISO8601DateFormatter().string(from: event.startDate), end: ISO8601DateFormatter().string(from: event.endDate),
                    allDay: event.isAllDay, location: event.location, url: event.urlString.isEmpty ? nil : event.urlString,
                    details: SharedOutgoingEventTracker.snapshot(for: event)?.details)
            }
            _ = try await CloudCalendarsAPI.saveICloudCalendarEvents(calendarId: item.calendarID, events: events,
                windowStart: start.addingTimeInterval(-86400), windowEnd: start.addingTimeInterval(7 * 86400),
                expectedUpdatedAt: remote.eventsUpdatedAt, session: session)
            check(item.label + " recovered three QA events with original IDs", true)
        }
        check("Scoped QA recovery completed", true)
    }
}
#endif
