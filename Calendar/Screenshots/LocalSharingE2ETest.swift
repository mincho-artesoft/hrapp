#if DEBUG
import EventKit
import SwiftUI

/// Explicit simulator-only test runner. It calls the same production sharing,
/// import and sync services as the UI, with real signed-in Debug sessions.
/// No credential is accepted in the environment or included in its report.
@MainActor
enum LocalSharingE2ETest {
    static var requested: Bool {
        #if targetEnvironment(simulator)
        return ProcessInfo.processInfo.environment["LOCAL_SHARING_E2E_ACTION"] != nil
        #else
        return false
        #endif
    }
    struct Manifest: Codable {
        var run: String
        var ownerID: String
        var recipient: String
        var calendarID: String
        var localCalendarID: String
        var localEventIDs: [String]
        var eventID: String
        var eventURL: String
        var nativeImportCalendarID: String?
    }
    private static var checks: [String: Bool] = [:]
    private static var details: [String: String] = [:]
    private static var directory: URL { URL.documentsDirectory.appendingPathComponent("LocalSharingE2E") }
    private static var manifestURL: URL { directory.appendingPathComponent("manifest.json") }
    private static func require(_ condition: Bool, _ message: String) throws {
        guard condition else { throw NSError(domain: "LocalSharingE2E", code: 1,
            userInfo: [NSLocalizedDescriptionKey: message]) }
    }
    private static func record(_ name: String, _ condition: Bool) { checks[name] = condition }
    private static func save(_ manifest: Manifest) throws {
        try JSONEncoder().encode(manifest).write(to: manifestURL, options: .atomic)
    }
    private static func load() throws -> Manifest {
        try JSONDecoder().decode(Manifest.self, from: Data(contentsOf: manifestURL))
    }
    private static func isAdded(_ result: SharedEventImporter.Result) -> Bool {
        if case .added = result { return true }; return false
    }
    private static func isExisting(_ result: SharedEventImporter.Result) -> Bool {
        if case .alreadyExists = result { return true }; return false
    }

    static func run() async -> String {
        let env = ProcessInfo.processInfo.environment
        let action = env["LOCAL_SHARING_E2E_ACTION"] ?? "missing"
        do {
            try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
            try require(["seed", "accept", "owner-update", "receiver-check", "writer-role",
                "writer-update", "owner-check-writer", "revoke", "receiver-check-revoked"].contains(action), "Unknown test action")
            try require(["1A67A8FA-A72D-4244-9C1C-551D1C473FD4", "786598BD-4158-4A5B-851F-8E04FDE3BC98"]
                .contains(env["SIMULATOR_UDID"] ?? ""), "Not an authorized test simulator")
            try require(CloudCalendarsAPI.baseURL.host == "63yo3ore3c.execute-api.us-east-1.amazonaws.com",
                        "Tests must use the Debug backend")
            let session = try await CalendarFeedSession.current()
            if action == "seed" {
                try await seed(session: session)
            } else {
                var manifest = try load()
                let account = try await CloudCalendarsAPI.sharedState(session: session)
                let ownerAction = ["owner-update", "writer-role", "owner-check-writer", "revoke"].contains(action)
                try require(ownerAction ? account.ownerId == manifest.ownerID
                    : session.email?.lowercased() == manifest.recipient.lowercased(), "Wrong account for test action")
                if ownerAction {
                    let calendar = AppLocalCalendarStore.shared.calendar(id: manifest.localCalendarID)
                    try require(calendar?.title.hasPrefix("QA Local Sharing ") == true
                        && calendar?.shareID == manifest.calendarID, "Test calendar identity mismatch")
                }
                switch action {
                case "accept": try await accept(&manifest, session: session)
                case "owner-update": try await ownerUpdate(manifest, session: session)
                case "receiver-check": try await receiverCheck(manifest, session: session)
                case "writer-role": try await changeRole(manifest, access: .writer, session: session)
                case "writer-update": try await writerUpdate(manifest, session: session)
                case "owner-check-writer": try await ownerCheckWriter(manifest, session: session)
                case "revoke": try await changeRole(manifest, access: nil, session: session)
                case "receiver-check-revoked":
                    _ = await AppLocalCalendarSyncService.syncAll()
                    let received = AppLocalCalendarStore.shared.receivedCalendars.first { $0.remoteCalendarID == manifest.calendarID }
                    record("Revoked local calendar cannot be edited", received?.isRevoked == true && received?.canEditEvents == false)
                default: break
                }
            }
        } catch {
            checks["Action completed without error"] = false
            details["error"] = error.localizedDescription
        }
        let status = checks.values.allSatisfy { $0 } ? "PASS" : "FAIL"
        let report: [String: Any] = ["status": status, "action": action, "checks": checks,
            "details": details, "scope": "Real Debug API and production app services; no synthetic sessions"]
        if let data = try? JSONSerialization.data(withJSONObject: report, options: [.prettyPrinted, .sortedKeys]) {
            try? data.write(to: directory.appendingPathComponent("result-\(action).json"), options: .atomic)
        }
        return "\(status): \(action)\n" + checks.sorted { $0.key < $1.key }
            .map { "\($0.value ? "✓" : "✗") \($0.key)" }.joined(separator: "\n")
    }

    private static func seed(session: CloudCalendarsAPI.Session) async throws {
        let env = ProcessInfo.processInfo.environment
        let run = env["LOCAL_SHARING_E2E_RUN"] ?? ""
        let recipient = env["LOCAL_SHARING_E2E_RECIPIENT"] ?? ""
        try require(!run.isEmpty && !recipient.isEmpty && recipient != session.email, "Run ID and a different recipient are required")
        try require(!FileManager.default.fileExists(atPath: manifestURL.path), "Test manifest already exists; do not create duplicate test data")
        let account = try await CloudCalendarsAPI.sharedState(session: session)
        let store = AppLocalCalendarStore.shared
        let cal = store.createCalendar(title: "QA Local Sharing " + run, color: .systemPurple)
        let start = Calendar.current.startOfDay(for: Date()).addingTimeInterval(12 * 3600)
        let event = AppLocalEventRecord(calendarID: cal.id, title: "QA Local Sharing — Event " + run,
            startDate: start, endDate: start.addingTimeInterval(5400), location: "Test location / София",
            notes: "QA local event notes", urlString: "https://example.com/qa-local",
            videoCallURL: "https://example.com/qa-call", timeZoneIdentifier: "Europe/Sofia",
            alarms: [.init(relativeOffset: -900)], travelTime: 600,
            attachments: [.init(fileName: "qa.txt", contentType: "text/plain", dataBase64: "UUEgdGVzdA==")])
        let long = AppLocalEventRecord(calendarID: cal.id, title: "QA Local Sharing — اجتماع 51h",
            startDate: start.addingTimeInterval(7200), endDate: start.addingTimeInterval(53 * 3600),
            location: "دبي", notes: "QA 51-hour calendar event", timeZoneIdentifier: "Asia/Dubai",
            alarms: [.init(relativeOffset: -1800)])
        let tomorrow = Calendar.current.startOfDay(for: Date()).addingTimeInterval(24 * 3600)
        let allDay = AppLocalEventRecord(calendarID: cal.id, title: "QA Local Sharing — All day",
            startDate: tomorrow, endDate: tomorrow.addingTimeInterval(24 * 3600), isAllDay: true)
        for value in [event, long, allDay] { store.saveEvent(value) }
        var manifest = Manifest(run: run, ownerID: account.ownerId, recipient: recipient,
            calendarID: cal.shareID, localCalendarID: cal.id, localEventIDs: [event.id, long.id, allDay.id],
            eventID: event.shareID, eventURL: "")
        try save(manifest)
        let descriptor = AppLocalEventDescriptor(eventID: event.id, partialStart: event.startDate, partialEnd: event.endDate)
        guard let url = await EventAppClipSharing.shareableURL(for: descriptor),
              let payload = SharedEventImportPayload(url: url), payload.isSyncable else {
            throw NSError(domain: "LocalSharingE2E", code: 2, userInfo: [NSLocalizedDescriptionKey: "Local event share link was not syncable"])
        }
        manifest.eventURL = url.absoluteString
        try save(manifest)
        SharedOutgoingEventTracker.record(url: url, localEventIdentifier: event.id)
        record("Local event produces a real scoped share link", payload.eventID == event.shareID)
        let repeatedURL = await EventAppClipSharing.shareableURL(for: descriptor)
        record("Sharing again reuses the feed", repeatedURL.flatMap(SharedEventImportPayload.init(url:))?.feedID == payload.feedID)
        _ = try await CloudCalendarsAPI.inviteEventRecipients(eventId: event.shareID, eventURL: url,
            invitations: [.init(email: recipient, access: .reader)], session: session)
        record("Individual local event email invitation sent", true)
        _ = try await CloudCalendarsAPI.saveICloudCalendarSharing(calendarId: cal.shareID,
            title: cal.title, color: cal.colorHex, timeZone: cal.timeZoneIdentifier, calendarKind: "app_local",
            recipients: [(email: recipient, access: .reader)], session: session)
        _ = store.registerForSharing(id: cal.id)
        _ = await AppLocalCalendarSyncService.syncAll()
        _ = try await CloudCalendarsAPI.inviteICloudCalendarRecipients(calendarId: cal.shareID,
            emails: [recipient], session: session)
        let remote = try await CloudCalendarsAPI.iCloudCalendarSharing(calendarId: cal.shareID, session: session)
        record("Local calendar stays app_local on the server", remote.calendarKind == "app_local")
        record("All three local events uploaded", remote.events?.count == 3)
        record("Calendar email invitation sent", true)
        details["calendar"] = cal.title
    }

    private static func accept(_ manifest: inout Manifest, session: CloudCalendarsAPI.Session) async throws {
        let pendingEvents = try await CloudCalendarsAPI.pendingEventInvitations(session: session)
        let pendingCalendars = try await CloudCalendarsAPI.pendingICloudCalendarInvitations(session: session)
        record("Event invitation appears in receiver pending list", pendingEvents.contains { $0.eventId == manifest.eventID })
        record("Calendar invitation appears in receiver pending list", pendingCalendars.contains { $0.calendarId == manifest.calendarID })
        guard let url = URL(string: manifest.eventURL), let payload = SharedEventImportPayload(url: url) else { throw CloudCalendarsAPI.Failure.malformedResponse }
        let eventStore = CalendarViewModel.shared.eventStore
        try require(EKEventStore.authorizationStatus(for: .event) == .fullAccess, "Calendar access is required for the receiver import")
        let destination = EKCalendar(for: .event, eventStore: eventStore)
        destination.title = "QA Local Sharing Imports " + manifest.run
        destination.source = eventStore.sources.first { $0.sourceType == .local }
        try require(destination.source != nil, "No independent local EventKit source")
        try eventStore.saveCalendar(destination, commit: true)
        manifest.nativeImportCalendarID = destination.calendarIdentifier
        try save(manifest)
        let result = await SharedEventImporter.add(payload, toCalendarWithIdentifier: destination.calendarIdentifier)
        record("Single local event imports via production importer", isAdded(result))
        let repeated = await SharedEventImporter.add(payload, toCalendarWithIdentifier: destination.calendarIdentifier)
        record("Accepting the event twice does not duplicate it", isExisting(repeated))
        let imported = eventStore.events(matching: eventStore.predicateForEvents(withStart: payload.start,
            end: payload.end, calendars: [destination])).first
        record("Imported event has notes and alarm from the feed", imported?.notes == "QA local event notes"
            && imported?.alarms?.contains { $0.relativeOffset == -900 } == true)
        record("Imported event preserves full time interval", imported?.startDate == payload.start && imported?.endDate == payload.end)
        let accepted = try await CloudCalendarsAPI.acceptICloudCalendarInvitation(ownerId: manifest.ownerID,
            calendarId: manifest.calendarID, session: session)
        record("Calendar acceptance returns app_local", accepted.calendarKind == "app_local")
        _ = AppLocalCalendarStore.shared.applyRemoteCalendar(accepted)
        _ = await AppLocalCalendarSyncService.syncAll()
        let cal = AppLocalCalendarStore.shared.receivedCalendars.first { $0.remoteCalendarID == manifest.calendarID }
        let events = AppLocalCalendarStore.shared.events.filter { $0.calendarID == cal?.id }
        record("Received local calendar contains all three events", events.count == 3)
        record("Received local calendar enforces Reader access", cal?.canEditEvents == false && cal?.canManageSharing == false)
        record("Arabic 51-hour event preserved", events.contains { $0.title.contains("اجتماع") && $0.endDate.timeIntervalSince($0.startDate) == 51 * 3600 })
        record("All-day event preserved", events.contains { $0.isAllDay })
        record("Shared local calendar is not duplicated in Apple Calendar", !eventStore.calendars(for: .event).contains { $0.title == cal?.title })
        let remainingEvents = try await CloudCalendarsAPI.pendingEventInvitations(session: session)
        let remainingCalendars = try await CloudCalendarsAPI.pendingICloudCalendarInvitations(session: session)
        record("Accepted invitations leave both pending lists", !remainingEvents.contains { $0.eventId == manifest.eventID }
            && !remainingCalendars.contains { $0.calendarId == manifest.calendarID })
    }

    private static func ownerUpdate(_ manifest: Manifest, session: CloudCalendarsAPI.Session) async throws {
        let store = AppLocalCalendarStore.shared
        guard var event = store.event(id: manifest.localEventIDs[0]) else { throw CloudCalendarsAPI.Failure.malformedResponse }
        event.title = "QA Local Sharing — Owner updated " + manifest.run
        event.notes = "QA updated notes"
        event.startDate = event.startDate.addingTimeInterval(1800)
        event.endDate = event.endDate.addingTimeInterval(1800)
        store.saveEvent(event)
        _ = await SharedOutgoingEventTracker.syncAll(in: CalendarViewModel.shared.eventStore)
        _ = await AppLocalCalendarSyncService.syncAll()
        let state = try await CloudCalendarsAPI.sharedState(session: session)
        record("Owner changes uploaded for individual event", state.outgoing.first { $0.id == manifest.eventID }?.title == event.title)
        let cal = try await CloudCalendarsAPI.iCloudCalendarSharing(calendarId: manifest.calendarID, session: session)
        record("Owner changes uploaded in calendar share", cal.events?.first { $0.id == manifest.eventID }?.title == event.title)
    }

    private static func receiverCheck(_ manifest: Manifest, session: CloudCalendarsAPI.Session) async throws {
        _ = await SharedInviteRefresher.refreshAll()
        _ = await AppLocalCalendarSyncService.syncAll()
        let expectedTitle = "QA Local Sharing — Owner updated " + manifest.run
        let received = AppLocalCalendarStore.shared.receivedCalendars.first { $0.remoteCalendarID == manifest.calendarID }
        let event = AppLocalCalendarStore.shared.events.first { $0.calendarID == received?.id && $0.remoteEventID == manifest.eventID }
        record("Owner edit reaches received local calendar", event?.title == expectedTitle && event?.notes == "QA updated notes")
        let eventStore = CalendarViewModel.shared.eventStore
        let nativeCal = manifest.nativeImportCalendarID.flatMap(eventStore.calendar(withIdentifier:))
        let now = Date()
        let native = nativeCal.map { eventStore.events(matching: eventStore.predicateForEvents(withStart: now.addingTimeInterval(-86400), end: now.addingTimeInterval(7 * 86400), calendars: [$0])) } ?? []
        record("Owner edit reaches individually imported event", native.count == 1 && native.first?.title == expectedTitle && native.first?.notes == "QA updated notes")
    }

    private static func changeRole(_ manifest: Manifest, access: CloudCalendarsAPI.EventAccess?, session: CloudCalendarsAPI.Session) async throws {
        let cal = try await CloudCalendarsAPI.iCloudCalendarSharing(calendarId: manifest.calendarID, session: session)
        let changed = try await CloudCalendarsAPI.saveICloudCalendarSharing(calendarId: manifest.calendarID,
            title: cal.title, color: cal.color, timeZone: cal.timeZone, calendarKind: "app_local",
            recipients: access.map { [(email: manifest.recipient, access: $0)] } ?? [],
            removedRecipientEmails: access == nil ? [manifest.recipient] : [], expectedUpdatedAt: cal.updatedAt, session: session)
        record(access == nil ? "Test calendar access revoked" : "Test recipient promoted to Writer",
            access == nil ? !changed.recipients.contains { $0.email == manifest.recipient }
                : changed.recipients.contains { $0.email == manifest.recipient && $0.access == access })
    }

    private static func writerUpdate(_ manifest: Manifest, session: CloudCalendarsAPI.Session) async throws {
        _ = await AppLocalCalendarSyncService.syncAll()
        let store = AppLocalCalendarStore.shared
        let received = store.receivedCalendars.first { $0.remoteCalendarID == manifest.calendarID }
        record("Writer role reaches receiver", received?.canEditEvents == true && received?.canManageSharing == false)
        guard var event = store.events.first(where: { $0.calendarID == received?.id && $0.title.contains("51h") }) else { throw CloudCalendarsAPI.Failure.malformedResponse }
        event.title = "QA Local Sharing — Writer updated 51h"
        store.saveEvent(event)
        _ = await AppLocalCalendarSyncService.syncAll()
        let remote = try await CloudCalendarsAPI.iCloudCalendarsSharedWithMe(session: session)
        record("Writer edit uploads to canonical calendar", remote.first { $0.calendarId == manifest.calendarID }?.events?.contains { $0.title == event.title } == true)
    }

    private static func ownerCheckWriter(_ manifest: Manifest, session: CloudCalendarsAPI.Session) async throws {
        let before = try await CloudCalendarsAPI.iCloudCalendarSharing(calendarId: manifest.calendarID, session: session)
        record("Server has writer change before owner sync", before.events?.contains { $0.title == "QA Local Sharing — Writer updated 51h" } == true)
        _ = await AppLocalCalendarSyncService.syncAll()
        let local = AppLocalCalendarStore.shared.event(id: manifest.localEventIDs[1])
        let after = try await CloudCalendarsAPI.iCloudCalendarSharing(calendarId: manifest.calendarID, session: session)
        record("Writer change reaches original local owner", local?.title == "QA Local Sharing — Writer updated 51h")
        record("Owner sync does not overwrite writer change", after.events?.contains { $0.title == "QA Local Sharing — Writer updated 51h" } == true)
        details["ownerLocalTitle"] = local?.title
    }
}

struct LocalSharingE2ETestView: View {
    @State private var result = "Running explicit Debug sharing test…"
    var body: some View {
        ScrollView { Text(result).frame(maxWidth: .infinity, alignment: .leading).padding() }
            .task { result = await LocalSharingE2ETest.run() }
    }
}
#endif
