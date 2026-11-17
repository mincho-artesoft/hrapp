#if DEBUG
import EventKit
import SwiftUI

/// Explicit on-device diagnostic runner. It uses the signed-in account and
/// production stores/services. Only resources carrying this run's QA prefix
/// may be mutated. It is inert on normal launches and absent from Release.
@MainActor
enum PhysicalSharingAudit {
    static var requested: Bool { ProcessInfo.processInfo.arguments.contains("--physical-sharing-audit") }
    static let directory = URL.documentsDirectory.appendingPathComponent("PhysicalSharingAudit")
    #if os(macOS)
    static let backend = CalendarMacStore()
    static let bridge = MacAppLocalCalendarBridge(backend: backend)
    static var ek: EKEventStore { backend.eventStore }
    #else
    static var ek: EKEventStore { CalendarViewModel.shared.eventStore }
    #endif
    static func require(_ condition: Bool, _ message: String) throws {
        if !condition { throw NSError(domain: "PhysicalSharingAudit", code: 1, userInfo: [NSLocalizedDescriptionKey: message]) }
    }
    static func object<T: Encodable>(_ value: T) throws -> Any {
        try JSONSerialization.jsonObject(with: JSONEncoder().encode(value))
    }
    static func string(_ request: [String: Any], _ key: String) throws -> String {
        guard let value = request[key] as? String, !value.isEmpty else { throw NSError(domain: "PhysicalSharingAudit", code: 2, userInfo: [NSLocalizedDescriptionKey: "Missing \(key)"]) }
        return value
    }
    static func loop(update: @escaping (String) -> Void) async {
        try? FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
        #if !os(macOS)
        SharedEventSyncManager.stop()
        CalendarViewModel.shared.stopGoogleCalendarSync()
        CalendarViewModel.shared.stopMicrosoftCalendarSync()
        #endif
        while !Task.isCancelled {
            do {
                let requestURL = directory.appendingPathComponent("request.json")
                if let data = try? Data(contentsOf: requestURL), let request = try JSONSerialization.jsonObject(with: data) as? [String: Any] {
                    let id = try string(request, "id")
                    try require(id.allSatisfy { $0.isLetter || $0.isNumber || $0 == "-" }, "Invalid request id")
                    let resultURL = directory.appendingPathComponent(id + ".json")
                    if !FileManager.default.fileExists(atPath: resultURL.path) {
                        var result: [String: Any] = ["id": id]
                        do { result["result"] = try await perform(request); result["status"] = "ok" }
                        catch { result["status"] = "error"; result["error"] = error.localizedDescription }
                        try JSONSerialization.data(withJSONObject: result, options: [.prettyPrinted, .sortedKeys]).write(to: resultURL, options: .atomic)
                        update("\(id): \(result["status"] ?? "")")
                    }
                }
            } catch { update(error.localizedDescription) }
            try? await Task.sleep(for: .milliseconds(300))
        }
    }
    static func eventJSON(_ e: CloudCalendarsAPI.RemoteSharedEvent) throws -> [String: Any] {
        ["id": e.id, "title": e.title, "start": e.start, "end": e.end, "allDay": e.allDay, "details": try e.details.map(object) ?? NSNull(), "status": e.status ?? "", "access": e.access?.rawValue ?? "owner", "localID": e.localEventIdentifier ?? "", "feedID": e.feedId, "sequence": e.sequence ?? 0]
    }
    static func sync() async throws {
        #if os(macOS)
        await backend.sync()
        #else
        _ = await AppLocalCalendarSyncService.syncAll()
        _ = await SharedOutgoingEventTracker.syncAll(in: ek)
        _ = await SharedOutgoingEventTracker.pullRemoteChanges(in: ek)
        _ = await SharedInviteRefresher.refreshAll()
        try await AccountLocalCalendarSync.sync(storage: AppLocalAccountCalendarStorage.shared)
        #endif
    }
    static func snapshot(_ prefix: String) throws -> [String: Any] {
        #if os(macOS)
        backend.reload()
        let calendars = backend.local.filter { $0.title.hasPrefix(prefix) }
        var result: [String: Any] = ["calendars": try object(calendars), "eventAccess": backend.receivedEventAccess.mapValues(\.rawValue), "unavailableEvents": Array(backend.receivedEventUnavailable), "syncError": backend.syncError ?? ""]
        #else
        let calendars = AppLocalCalendarStore.shared.calendars.filter { $0.title.hasPrefix(prefix) }
        let ids = Set(calendars.map(\.id))
        let invites = SharedInviteTracker.tracked().values.filter { ek.event(withIdentifier: $0.localEventIdentifier)?.title.contains(prefix) == true }
        var result: [String: Any] = ["calendars": try object(calendars),
            "events": try object(AppLocalCalendarStore.shared.events.filter { ids.contains($0.calendarID) }),
            "trackedInvites": invites.map { invite in ["id": invite.eventID, "localID": invite.localEventIdentifier, "cancelled": invite.isCancelled, "revoked": invite.isRevoked == true, "access": invite.effectiveAccess.rawValue, "readOnly": ek.event(withIdentifier: invite.localEventIdentifier).map(SharedInviteTracker.isReadOnly) ?? true] as [String: Any] }]
        #endif
        let start = Calendar.current.date(byAdding: .day, value: -3, to: Date())!
        let end = Calendar.current.date(byAdding: .day, value: 30, to: Date())!
        result["nativeQAEvents"] = ek.events(matching: ek.predicateForEvents(withStart: start, end: end, calendars: nil))
            .filter { ($0.title ?? "").contains(prefix) }.map { ["id": $0.eventIdentifier ?? "", "title": $0.title ?? "", "calendarID": $0.calendar.calendarIdentifier, "start": DeviceCalendarEvent.iso($0.startDate), "end": DeviceCalendarEvent.iso($0.endDate)] }
        result["nativeCalendarIDs"] = ek.calendars(for: .event).map(\.calendarIdentifier).sorted()
        return result
    }
    static func perform(_ r: [String: Any]) async throws -> [String: Any] {
        try require(CloudCalendarsAPI.baseURL.absoluteString == "https://storage.wonek.com/cloud-calendars-debug", "Debug backend required")
        guard let session = CalendarFeedSession.existing else { throw CalendarFeedSession.SessionError.signInRequired }
        try require(session.email?.lowercased() == (try string(r, "email")).lowercased(), "Unexpected signed-in account")
        let prefix = try string(r, "prefix")
        try require(prefix.hasPrefix("QA-PHYSICAL-20261117-"), "Invalid QA namespace")
        let action = try string(r, "action")
        if action == "inspect" || action == "sync" {
            if action == "sync" { try await sync() }
            var result = try snapshot(prefix)
            let state = try await CloudCalendarsAPI.sharedState(session: session)
            result["email"] = session.email; result["ownerID"] = state.ownerId
            result["outgoing"] = try state.outgoing.filter { $0.title.contains(prefix) }.map(eventJSON)
            result["received"] = try state.received.filter { $0.title.contains(prefix) }.map(eventJSON)
            result["pendingEvents"] = try await CloudCalendarsAPI.pendingEventInvitations(session: session).filter { $0.title.contains(prefix) }.map { ["id": $0.eventId, "title": $0.title, "access": $0.access.rawValue, "feedID": $0.feedId] }
            result["pendingCalendars"] = try await CloudCalendarsAPI.pendingICloudCalendarInvitations(session: session).filter { $0.title.contains(prefix) }.map { ["id": $0.calendarId, "title": $0.title, "access": $0.access.rawValue, "ownerID": $0.ownerId] }
            return result
        }
        #if !os(macOS)
        if action == "race-calendar" {
            let store = AppLocalCalendarStore.shared
            let localID = try string(r, "localID")
            guard let calendar = store.calendar(id: localID), calendar.title.hasPrefix(prefix),
                  var event = store.events.first(where: { $0.calendarID == localID }) else { throw CloudCalendarsAPI.Failure.malformedResponse }
            let eventID = event.id
            event.title = prefix + " upload in progress"
            store.saveEvent(event)
            var fired = false
            AppLocalCalendarSyncService.auditBeforeEventUpload = { uploadingID in
                guard uploadingID == localID, !fired, var latest = store.event(id: eventID) else { return }
                fired = true
                latest.title = prefix + " edited during upload"
                latest.endDate += 900
                store.saveEvent(latest)
            }
            defer { AppLocalCalendarSyncService.auditBeforeEventUpload = nil }
            _ = await AppLocalCalendarSyncService.syncAll()
            return ["fired": fired, "snapshot": try snapshot(prefix)]
        }
        #endif
        if action == "rename-personal-calendar" || action == "remove-personal-calendar" {
            let id = try string(r, "localID")
            #if os(macOS)
            guard var doc = backend.local.first(where: { $0.id == id && $0.title.hasPrefix(prefix) && !$0.isReceivedSharedCalendar }) else { throw CloudCalendarsAPI.Failure.malformedResponse }
            if action == "remove-personal-calendar" { try backend.removeAccountLocalDocument(localID: id) }
            else {
                let title = try string(r, "title"); try require(title.hasPrefix(prefix), "QA title required")
                doc.title = title
                try backend.applyProviderDocuments(backend.local.map { $0.id == id ? doc : $0 })
            }
            #else
            guard var doc = AppLocalCalendarStore.shared.calendar(id: id), doc.title.hasPrefix(prefix), doc.origin == .owned else { throw CloudCalendarsAPI.Failure.malformedResponse }
            if action == "remove-personal-calendar" { AppLocalCalendarStore.shared.removeCalendar(id: id) }
            else {
                let title = try string(r, "title"); try require(title.hasPrefix(prefix), "QA title required")
                doc.title = title; AppLocalCalendarStore.shared.upsertCalendar(doc)
            }
            #endif
            return try snapshot(prefix)
        }
        if action == "cleanup-local" {
            try AccountLocalCalendarSync.discardAuditBindings(prefix: prefix)
            let state = try await CloudCalendarsAPI.sharedState(session: session)
            let qaIDs = Set((state.outgoing + state.received).filter { $0.title.hasPrefix(prefix) }.map(\.id))
            #if os(macOS)
            try MacEventSharing.discardAuditRecords(prefix: prefix, eventIDs: qaIDs, session: session)
            try backend.applyProviderDocuments(backend.local.filter { !$0.title.hasPrefix(prefix) })
            #else
            for (id, invite) in SharedInviteTracker.tracked() {
                if qaIDs.contains(id) || ek.event(withIdentifier: invite.localEventIdentifier)?.title.contains(prefix) == true {
                    SharedInviteTracker.forget(eventID: id)
                }
            }
            let defaults = UserDefaults(suiteName: "group.ARTE-SOFT.sandBOX") ?? .standard
            if let data = defaults.data(forKey: "eventShare.sentEvents.v1"),
               let records = try? JSONDecoder().decode([String: SharedOutgoingEventTracker.SentEvent].self, from: data) {
                defaults.set(try JSONEncoder().encode(records.filter { !$0.value.title.hasPrefix(prefix) }), forKey: "eventShare.sentEvents.v1")
            }
            for calendar in AppLocalCalendarStore.shared.calendars where calendar.title.hasPrefix(prefix) {
                AppLocalCalendarStore.shared.removeCalendar(id: calendar.id)
            }
            #endif
            let from = Calendar.current.date(byAdding: .day, value: -3, to: Date())!
            let to = Calendar.current.date(byAdding: .day, value: 30, to: Date())!
            for event in ek.events(matching: ek.predicateForEvents(withStart: from, end: to, calendars: nil)) where event.title.contains(prefix) && event.calendar.allowsContentModifications {
                try ek.remove(event, span: .thisEvent, commit: true)
            }
            return try snapshot(prefix)
        }
        if action == "create-calendar" || action == "create-personal-calendar" {
            let title = prefix + " " + (try string(r, "label"))
            let role = CloudCalendarsAPI.EventAccess(rawValue: r["role"] as? String ?? "owner")!
            let recipient = r["recipient"] as? String ?? session.email ?? ""
            let start = Calendar.current.startOfDay(for: Date()).addingTimeInterval(86400 + 10 * 3600)
            let localID: String, remoteID: String
            #if os(macOS)
            let id = UUID().uuidString.lowercased()
            var events: [DeviceCalendarEvent] = []
            for index in 0..<3 {
                let eventStart = index == 1 ? Calendar.current.startOfDay(for: start).addingTimeInterval(86400) : start.addingTimeInterval(Double(index) * 7200)
                let duration: TimeInterval = index == 1 ? 86400 : (index == 2 ? 183600 : 5400)
                let details: [String: CalendarJSON] = ["notes": .string("QA notes"), "timeZone": .string("Europe/Sofia"), "alarms": .array([.object(["relativeOffset": .number(-900)])])]
                events.append(DeviceCalendarEvent(id: UUID().uuidString.lowercased(), title: title + " item\(index)", start: DeviceCalendarEvent.iso(eventStart), end: DeviceCalendarEvent.iso(eventStart.addingTimeInterval(duration)), allDay: index == 1, location: "QA София", details: details))
            }
            let doc = DeviceCalendarDocument(id: id, deviceId: DeviceCalendarReplica.deviceID, deviceName: "Mac", title: title, source: "Local Calendars", color: "#AF52DE", allowsChanges: true, events: events)
            try backend.applyProviderDocuments(backend.local + [doc]); localID = id; remoteID = DeviceCalendarReplica.hash(id)
            #else
            let store = AppLocalCalendarStore.shared
            let calendar = store.createCalendar(title: title, color: .systemPurple)
            localID = calendar.id; remoteID = calendar.shareID
            for index in 0..<3 {
                store.saveEvent(.init(calendarID: localID, title: title + " item\(index)", startDate: index == 1 ? Calendar.current.startOfDay(for: start).addingTimeInterval(86400) : start.addingTimeInterval(Double(index) * 7200), endDate: index == 1 ? Calendar.current.startOfDay(for: start).addingTimeInterval(172800) : start.addingTimeInterval(Double(index) * 7200 + (index == 2 ? 51 * 3600 : 5400)), isAllDay: index == 1, location: "QA София", notes: "QA notes", timeZoneIdentifier: "Europe/Sofia", alarms: [.init(relativeOffset: -900)]))
            }
            #endif
            if action == "create-personal-calendar" { return ["localID": localID, "snapshot": try snapshot(prefix)] }
            let remote = try await CloudCalendarsAPI.saveICloudCalendarSharing(calendarId: remoteID, title: title, color: "#AF52DE", timeZone: "Europe/Sofia", calendarKind: "app_local", recipients: [(email: recipient, access: role)], session: session)
            #if os(macOS)
            try await backend.ownedSharing.registerAndSync(localID: localID, shareID: remoteID)
            #else
            _ = store.registerForSharing(id: localID)
            _ = await AppLocalCalendarSyncService.syncAll()
            #endif
            _ = try await CloudCalendarsAPI.inviteICloudCalendarRecipients(calendarId: remoteID, emails: [recipient], session: session)
            return ["localID": localID, "calendarID": remoteID, "ownerID": remote.ownerId ?? "", "snapshot": try snapshot(prefix)]
        }
        if action == "accept-calendar" || action == "decline-calendar" || action == "leave-calendar" {
            let cid = try string(r, "calendarID"), owner = try string(r, "ownerID")
            let pending = try await CloudCalendarsAPI.pendingICloudCalendarInvitations(session: session)
            let received = try await CloudCalendarsAPI.iCloudCalendarsSharedWithMe(session: session)
            try require(pending.contains { $0.calendarId == cid && $0.title.hasPrefix(prefix) } || received.contains { $0.calendarId == cid && $0.title.hasPrefix(prefix) }, "Not a QA invitation")
            if action == "decline-calendar" {
                try await CloudCalendarsAPI.declinePendingICloudCalendarInvitation(ownerId: owner, calendarId: cid, session: session)
            } else if action == "leave-calendar" {
                try await CloudCalendarsAPI.leaveICloudCalendar(ownerId: owner, calendarId: cid, session: session)
            } else {
                let remote = try await CloudCalendarsAPI.acceptICloudCalendarInvitation(ownerId: owner, calendarId: cid, session: session)
                #if os(macOS)
                try backend.installSharedCalendar(remote)
                #else
                _ = AppLocalCalendarStore.shared.applyRemoteCalendar(remote)
                #endif
            }
            try await sync(); return try snapshot(prefix)
        }
        if action == "edit-local" || action == "delete-local-event" || action == "add-local-event" {
            let localID = try string(r, "localID")
            #if os(macOS)
            guard let calendar = backend.local.first(where: { $0.id == localID && $0.title.hasPrefix(prefix) }) else { throw CloudCalendarsAPI.Failure.malformedResponse }
            var event = calendar.events.first { $0.id == (r["eventID"] as? String) } ?? calendar.events[0]
            if action == "add-local-event" { event.id = UUID().uuidString.lowercased(); event.title = prefix + " added" }
            if let title = r["title"] as? String { try require(title.hasPrefix(prefix), "QA title required"); event.title = title }
            if let minutes = r["shiftMinutes"] as? Double { event.start = DeviceCalendarEvent.iso(event.startDate.addingTimeInterval(minutes * 60)); event.end = DeviceCalendarEvent.iso(event.endDate.addingTimeInterval(minutes * 60)) }
            if let minutes = r["resizeMinutes"] as? Double { event.end = DeviceCalendarEvent.iso(event.endDate.addingTimeInterval(minutes * 60)) }
            if action == "delete-local-event" { if calendar.canEditEvents { try backend.delete(event) } }
            else { try backend.save(event, calendarID: localID, scheduleSync: false) }
            #else
            let store = AppLocalCalendarStore.shared
            guard let calendar = store.calendar(id: localID), calendar.title.hasPrefix(prefix), var event = store.events.first(where: { $0.calendarID == localID && (r["eventID"] == nil || $0.id == r["eventID"] as? String) }) else { throw CloudCalendarsAPI.Failure.malformedResponse }
            if action == "add-local-event" { event.id = "app-local-event:" + UUID().uuidString.lowercased(); event.remoteEventID = nil; event.title = prefix + " added" }
            if let title = r["title"] as? String { try require(title.hasPrefix(prefix), "QA title required"); event.title = title }
            if let minutes = r["shiftMinutes"] as? Double { event.startDate += minutes * 60; event.endDate += minutes * 60 }
            if let minutes = r["resizeMinutes"] as? Double { event.endDate += minutes * 60 }
            if action == "delete-local-event" { store.deleteEvent(id: event.id) } else { store.saveEvent(event) }
            #endif
            if r["sync"] as? Bool == true { try await sync() }
            return try snapshot(prefix)
        }
        if action == "calendar-access" || action == "calendar-role" || action == "delete-calendar" || action == "calendar-metadata" || action == "resend-calendar" {
            let cid = try string(r, "calendarID"), owner = r["ownerID"] as? String
            let remote = try await CloudCalendarsAPI.iCloudCalendarSharing(calendarId: cid, ownerId: owner, session: session)
            try require(remote.title.hasPrefix(prefix), "Not a QA calendar")
            if action == "calendar-role" || action == "calendar-metadata" {
                let recipients = action == "calendar-role" ? (r["role"] as? String).flatMap(CloudCalendarsAPI.EventAccess.init(rawValue:)).map { [(email: r["recipient"] as! String, access: $0)] } ?? [] : remote.recipients.map { (email: $0.email, access: $0.access) }
                let title = r["title"] as? String ?? remote.title
                try require(title.hasPrefix(prefix), "QA title required")
                _ = try await CloudCalendarsAPI.saveICloudCalendarSharing(calendarId: cid, ownerId: owner, title: title, color: remote.color, timeZone: remote.timeZone, calendarKind: remote.calendarKind ?? "app_local", recipients: recipients, removedRecipientEmails: (action == "calendar-role" && r["role"] == nil) ? Set([try string(r, "recipient")]) : [], expectedUpdatedAt: remote.updatedAt, session: session)
            } else if action == "delete-calendar" { try await CloudCalendarsAPI.deleteICloudCalendarSharing(calendarId: cid, session: session) }
            else if action == "resend-calendar" { _ = try await CloudCalendarsAPI.inviteICloudCalendarRecipients(calendarId: cid, emails: [try string(r, "recipient")], session: session) }
            return ["calendar": try object(remote)]
        }
        if action == "calendar-write-probe" {
            let cid = try string(r, "calendarID"), owner = try string(r, "ownerID")
            guard let remote = try await CloudCalendarsAPI.iCloudCalendarsSharedWithMe(session: session).first(where: { $0.calendarId == cid && $0.title.hasPrefix(prefix) }) else { throw CloudCalendarsAPI.Failure.malformedResponse }
            let revision = r["revision"] as? String ?? remote.eventsUpdatedAt
            _ = try await CloudCalendarsAPI.saveICloudCalendarEvents(calendarId: cid, ownerId: owner, events: remote.events ?? [], windowStart: remote.windowStartDate ?? Date(), windowEnd: remote.windowEndDate ?? Date().addingTimeInterval(86400), expectedUpdatedAt: revision, session: session)
            return ["accepted": true]
        }
        if action == "create-event" {
            let title = prefix + " " + (try string(r, "label"))
            let role = CloudCalendarsAPI.EventAccess(rawValue: try string(r, "role"))!
            let start = Calendar.current.startOfDay(for: Date()).addingTimeInterval(2 * 86400 + 10 * 3600)
            let localID: String, localCalendarID: String, eventID: String, feedID: String, link: URL
            #if os(macOS)
            let docID = UUID().uuidString.lowercased()
            let event = DeviceCalendarEvent(id: UUID().uuidString.lowercased(), title: title, start: DeviceCalendarEvent.iso(start), end: DeviceCalendarEvent.iso(start.addingTimeInterval(5400)), allDay: false, location: "QA София", details: ["notes": .string("QA event notes"), "timeZone": .string("Europe/Sofia"), "alarms": .array([.object(["relativeOffset": .number(-900)])])])
            let doc = DeviceCalendarDocument(id: docID, deviceId: DeviceCalendarReplica.deviceID, deviceName: "Mac", title: title + " storage", source: "Local Calendars", color: "#AF52DE", allowsChanges: true, events: [event])
            try backend.applyProviderDocuments(backend.local + [doc])
            let record = try await MacEventSharing.prepare(event, calendarID: docID, native: false, session: session)
            localID = event.id; localCalendarID = docID; eventID = record.remoteID; feedID = record.feedID
            var u = URLComponents(url: CloudCalendarsAPI.baseURL.appendingPathComponent("event-invites/open"), resolvingAgainstBaseURL: false)!
            u.queryItems = [.init(name: "e", value: eventID), .init(name: "c", value: feedID), .init(name: "title", value: title), .init(name: "start", value: String(start.timeIntervalSince1970)), .init(name: "end", value: String(start.addingTimeInterval(5400).timeIntervalSince1970)), .init(name: "allDay", value: "0"), .init(name: "timeZone", value: "Europe/Sofia")]
            link = u.url!
            #else
            let calendar = AppLocalCalendarStore.shared.createCalendar(title: title + " storage", color: .systemPurple)
            let event = AppLocalEventRecord(calendarID: calendar.id, title: title, startDate: start, endDate: start.addingTimeInterval(5400), location: "QA София", notes: "QA event notes", timeZoneIdentifier: "Europe/Sofia", alarms: [.init(relativeOffset: -900)])
            AppLocalCalendarStore.shared.saveEvent(event)
            let descriptor = AppLocalEventDescriptor(eventID: event.id, partialStart: event.startDate, partialEnd: event.endDate)
            guard let url = await EventAppClipSharing.shareableURL(for: descriptor), let payload = SharedEventImportPayload(url: url), let id = payload.eventID, let feed = payload.feedID, let serverURL = EventShareEndpoint.serverInvitationURL(from: url) else { throw CloudCalendarsAPI.Failure.malformedResponse }
            SharedOutgoingEventTracker.record(url: url, localEventIdentifier: event.id)
            localID = event.id; localCalendarID = calendar.id; eventID = id; feedID = feed; link = serverURL
            #endif
            _ = try await CloudCalendarsAPI.inviteEventRecipients(eventId: eventID, eventURL: link, invitations: [.init(email: try string(r, "recipient"), access: role)], session: session)
            return ["localID": localID, "localCalendarID": localCalendarID, "eventID": eventID, "feedID": feedID, "url": link.absoluteString]
        }
        if action == "accept-event" || action == "decline-event" {
            let eventID = try string(r, "eventID"), feedID = try string(r, "feedID")
            let sourceURL = URL(string: try string(r, "url"))!
            #if os(macOS)
            let resolved = SharedEventImportPayload(url: sourceURL)
            #else
            let resolved = await SharedEventImportPayload.resolve(url: sourceURL)
            #endif
            guard let payload = resolved, payload.title.hasPrefix(prefix), payload.eventID == eventID else { throw CloudCalendarsAPI.Failure.malformedResponse }
            if action == "decline-event" {
                try await CloudCalendarsAPI.declinePendingEventInvitation(eventId: eventID, feedId: feedID, session: session)
                return ["declined": true]
            }
            let localID: String
            #if os(macOS)
            let destination: DeviceCalendarDocument
            if let existing = backend.local.first(where: { $0.title == prefix + " imports" }) { destination = existing }
            else {
                destination = DeviceCalendarDocument(id: UUID().uuidString.lowercased(), deviceId: DeviceCalendarReplica.deviceID, deviceName: "Mac", title: prefix + " imports", source: "Local Calendars", color: "#AF52DE", allowsChanges: true, events: [])
                try backend.applyProviderDocuments(backend.local + [destination])
            }
            let target = bridge.calendar(destination)
            localID = try await MacEventSharing.accept(payload, target: target, bridge: bridge, session: session)
            #else
            _ = await SharedEventImporter.add(payload, toCalendarWithIdentifier: ek.defaultCalendarForNewEvents?.calendarIdentifier)
            guard let invite = SharedInviteTracker.invite(eventID: eventID) else { throw CloudCalendarsAPI.Failure.malformedResponse }
            localID = invite.localEventIdentifier
            #endif
            try await sync()
            return ["localID": localID, "snapshot": try snapshot(prefix)]
        }
        if action == "event-access" || action == "event-write-probe" || action == "event-role" || action == "cancel-event" || action == "edit-imported-event" {
            let id = try string(r, "eventID")
            let state = try await CloudCalendarsAPI.sharedState(session: session)
            guard let remote = (state.outgoing + state.received).first(where: { $0.id == id && $0.title.hasPrefix(prefix) }) else { throw CloudCalendarsAPI.Failure.malformedResponse }
            if action == "event-access" { return ["recipients": try object(try await CloudCalendarsAPI.eventRecipients(eventId: id, session: session))] }
            if action == "event-role" {
                let recipients = try await CloudCalendarsAPI.eventRecipients(eventId: id, session: session)
                let email = try string(r, "recipient")
                guard let person = recipients.first(where: { $0.emails.contains(email) }) else { throw CloudCalendarsAPI.Failure.malformedResponse }
                if let role = (r["role"] as? String).flatMap(CloudCalendarsAPI.EventAccess.init(rawValue:)) { _ = try await CloudCalendarsAPI.updateEventRecipientAccess(eventId: id, recipientId: person.id, access: role, session: session) }
                else { _ = try await CloudCalendarsAPI.saveEventRecipientChanges(eventId: id, accessByRecipientID: [:], removedRecipientIDs: [person.id], session: session) }
            } else if action == "cancel-event" { try await CloudCalendarsAPI.cancelEvent(id: id, session: session) }
            else if action == "event-write-probe" {
                try await CloudCalendarsAPI.upsertEvent(.init(id: id, title: remote.title, start: remote.startDate!, end: remote.endDate!, isAllDay: remote.allDay, location: remote.location, url: remote.url.flatMap(URL.init(string:)), details: remote.details ?? SharedEventDetails(notes: nil, timeZone: "Europe/Sofia"), localEventIdentifier: nil, organizerName: nil, organizerEmail: nil), session: session, receivedFeedId: remote.feedId)
            } else {
                let identifier = try string(r, "localID")
                #if os(macOS)
                guard var current = backend.event(matchingLocalIdentifier: identifier), current.title.hasPrefix(prefix), let calendar = backend.calendar(for: current) else { throw CloudCalendarsAPI.Failure.malformedResponse }
                if let title = r["title"] as? String { try require(title.hasPrefix(prefix), "QA title required"); current.title = title }
                if let minutes = r["shiftMinutes"] as? Double { current.start = DeviceCalendarEvent.iso(current.startDate.addingTimeInterval(minutes * 60)); current.end = DeviceCalendarEvent.iso(current.endDate.addingTimeInterval(minutes * 60)) }
                if let minutes = r["resizeMinutes"] as? Double { current.end = DeviceCalendarEvent.iso(current.endDate.addingTimeInterval(minutes * 60)) }
                try backend.save(current, calendarID: calendar.id, scheduleSync: false)
                #else
                guard let current = ek.event(withIdentifier: identifier), current.title.hasPrefix(prefix) else { throw CloudCalendarsAPI.Failure.malformedResponse }
                if let title = r["title"] as? String { try require(title.hasPrefix(prefix), "QA title required"); current.title = title }
                if let minutes = r["shiftMinutes"] as? Double { current.startDate += minutes * 60; current.endDate += minutes * 60 }
                if let minutes = r["resizeMinutes"] as? Double { current.endDate += minutes * 60 }
                try ek.save(current, span: .thisEvent, commit: true)
                #endif
                if r["sync"] as? Bool == true { try await sync() }
            }
            return ["event": try eventJSON(remote), "snapshot": try snapshot(prefix)]
        }
        throw NSError(domain: "PhysicalSharingAudit", code: 3, userInfo: [NSLocalizedDescriptionKey: "Unknown action \(action)"])
    }
}

struct PhysicalSharingAuditView: View {
    @State private var status = "Physical-device sharing audit ready"
    var body: some View { Text(status).padding(32).task { await PhysicalSharingAudit.loop { status = $0 } } }
}
#endif
