import Foundation

@MainActor private final class MemoryProviderStorage: ProviderCalendarStorage {
    var providerDocuments: [DeviceCalendarDocument] = []
    func applyProviderDocuments(_ documents: [DeviceCalendarDocument]) throws { providerDocuments = documents }
}
@MainActor private final class ProviderTransport {
    let google: Bool
    var title = "Original"
    var start = "2026-11-17T10:00:00Z"
    var end = "2026-11-17T11:00:00Z"
    var writes = 0
    var duringWrite: (() -> Void)?
    var failWrite = false
    init(google: Bool) { self.google = google }
    func request(_ request: URLRequest) throws -> (Data, URLResponse) {
        let url = request.url!, method = request.httpMethod ?? "GET"
        var response: [String: Any]
        if url.path.hasSuffix("/calendarList") || url.path.hasSuffix("/me/calendars") {
            let calendar: [String: Any] = google ? ["id": "calendar", "summary": "Provider", "accessRole": "owner"]
                : ["id": "calendar", "name": "Provider", "canEdit": true]
            response = [google ? "items" : "value": [calendar]]
        } else {
            if method == "PATCH" {
                writes += 1
                if failWrite { throw URLError(.notConnectedToInternet) }
                let body = try JSONSerialization.jsonObject(with: request.httpBody!) as! [String: Any]
                if let value = body[google ? "summary" : "subject"] as? String { title = value }
                if let value = (body["start"] as? [String: String])?["dateTime"] { start = value.hasSuffix("Z") ? value : value + "Z" }
                if let value = (body["end"] as? [String: String])?["dateTime"] { end = value.hasSuffix("Z") ? value : value + "Z" }
                let callback = duringWrite; duringWrite = nil; callback?()
            }
            let event: [String: Any] = ["id": "event", google ? "summary" : "subject": title,
                "start": ["dateTime": start, "timeZone": "UTC"], "end": ["dateTime": end, "timeZone": "UTC"],
                "etag": "version", "isAllDay": false]
            response = method == "PATCH" ? event : [google ? "items" : "value": [event]]
        }
        return (try JSONSerialization.data(withJSONObject: response), HTTPURLResponse(url: url, statusCode: 200, httpVersion: nil, headerFields: nil)!)
    }
}
@main enum ProviderCalendarSyncTests {
    @MainActor static func main() async throws {
        for google in [true, false] {
            let directory = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString)
            try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
            defer { try? FileManager.default.removeItem(at: directory) }
            let storage = MemoryProviderStorage(), network = ProviderTransport(google: google)
            let account = ProviderCalendarSyncEngine.Account(id: "test-account", provider: google ? "google" : "microsoft", email: "test@example.com", accessToken: "test")
            let engine = ProviderCalendarSyncEngine(storage: storage, directory: directory, identifierPrefix: "app-local:provider-", deviceName: "Test", transport: network.request)
            try await engine.sync(account)
            precondition(storage.providerDocuments.count == 1 && storage.providerDocuments[0].events.count == 1)
            let id = storage.providerDocuments[0].events[0].id
            storage.providerDocuments[0].events[0].start = "2026-11-17T14:00:00Z"
            storage.providerDocuments[0].events[0].end = "2026-11-17T15:00:00Z"
            network.duringWrite = { storage.providerDocuments[0].events[0].end = "2026-11-17T16:30:00Z" }
            try await engine.sync(account)
            precondition(storage.providerDocuments[0].events[0].end == "2026-11-17T16:30:00Z", "Resize during an upload must survive")
            try await engine.sync(account)
            precondition(network.end == "2026-11-17T16:30:00Z" && network.start == "2026-11-17T14:00:00Z")
            let writes = network.writes
            try await engine.sync(account)
            precondition(network.writes == writes, "An unchanged poll must not upload again")
            storage.providerDocuments[0].events[0].details?["travelTime"] = .number(1800)
            try await engine.sync(account)
            precondition(network.writes == writes && storage.providerDocuments[0].events[0].details?["travelTime"] == .number(1800))
            storage.providerDocuments[0].events[0].title = "Offline edit"
            network.failWrite = true
            do { try await engine.sync(account); preconditionFailure("Expected network failure") } catch is URLError {}
            precondition(storage.providerDocuments[0].events[0].title == "Offline edit")
            network.failWrite = false
            let restarted = ProviderCalendarSyncEngine(storage: storage, directory: directory, identifierPrefix: "app-local:provider-", deviceName: "Test", transport: network.request)
            try await restarted.sync(account)
            precondition(network.title == "Offline edit" && storage.providerDocuments[0].events[0].id == id)
            precondition(storage.providerDocuments[0].events[0].details?["travelTime"] == .number(1800), "A provider response must preserve app-owned fields")
            try restarted.disconnect(account.id)
            precondition(!storage.providerDocuments[0].available && storage.providerDocuments[0].events.count == 1)
            try await restarted.sync(account)
            precondition(storage.providerDocuments[0].available && storage.providerDocuments[0].events.count == 1)
            let migrationDirectory = directory.appendingPathComponent("migration")
            try FileManager.default.createDirectory(at: migrationDirectory, withIntermediateDirectories: true)
            let migratedStorage = MemoryProviderStorage()
            let migration = ProviderCalendarSyncEngine(storage: migratedStorage, directory: migrationDirectory,
                identifierPrefix: "app-local:provider-", deviceName: "iOS", transport: network.request)
            let legacy = DeviceCalendarEvent(id: "old-eventkit-id", title: "Edit before migration", start: network.start, end: network.end, allDay: false)
            try await migration.sync(account, legacy: ["calendar": [.init(remoteID: "event", snapshot: legacy)]])
            precondition(migratedStorage.providerDocuments[0].events.count == 1 && network.title == legacy.title,
                         "Migration must retain unsynced changes using the existing provider event ID")
            let afterMigration = network.writes
            try await migration.sync(account)
            precondition(network.writes == afterMigration, "A migrated event must not duplicate or upload repeatedly")
            print("PASS:", account.provider, "local sync, in-flight resize, offline retry, restart, disconnect/reconnect")
        }
    }
}
