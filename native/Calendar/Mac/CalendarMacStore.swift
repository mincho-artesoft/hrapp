import SwiftUI
import EventKit
import AppKit
import Security

struct MacCalendarItem: Identifiable {
    let id: String
    let title: String
    let source: String
    let color: Color
    let writable: Bool
    let native: EKCalendar?
}

@MainActor
final class CalendarMacStore: ObservableObject {
    let eventStore = EKEventStore()
    @Published var calendars: [MacCalendarItem] = []
    @Published var events: [DeviceCalendarEvent] = []
    @Published var selection = Set<String>()
    @Published var error: String?
    @Published private(set) var syncError: String?
    @Published var syncing = false
    @Published var accountEmail = ""
    @Published var local: [DeviceCalendarDocument] = []
    private var eventCalendars: [String: String] = [:]
    private var nativeEvents: [String: EKEvent] = [:]
    private var session: [String: String] = [:]
    lazy var providers = MacCalendarProviderStore(backend: self, directory: file.deletingLastPathComponent())
    private let allowsAccountConnections: Bool
    private let file: URL
    private var observers: [NSObjectProtocol] = []
    var adapter: DeviceEventKitAdapter { DeviceEventKitAdapter(store: eventStore) }
    var signedIn: Bool { cloudSession != nil }
    var writable: [MacCalendarItem] { calendars.filter(\.writable) }
    static let endpoint = CloudCalendarsAPI.baseURL
    #if DEBUG
    private static let accountStorageHost = "63yo3ore3c.execute-api.us-east-1.amazonaws.com"
    #else
    private static let accountStorageHost = "api.cloud-calendars.com"
    #endif
    init(directory storageDirectory: URL? = nil, loadsAccount: Bool = true) {
        allowsAccountConnections = loadsAccount
        let directory = storageDirectory ?? FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0].appendingPathComponent("CloudCalendarsMac")
        try? FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
        file = directory.appendingPathComponent("calendars.json")
        if let data = try? Data(contentsOf: file), let docs = try? JSONDecoder().decode([DeviceCalendarDocument].self, from: data) { local = docs }
        let keyQuery: [String: Any] = [kSecClass as String: kSecClassGenericPassword, kSecAttrService as String: "CloudCalendarsMac.session.\(Self.accountStorageHost)", kSecReturnData as String: true]
        var result: CFTypeRef?
        if loadsAccount, SecItemCopyMatching(keyQuery as CFDictionary, &result) == errSecSuccess, let data = result as? Data {
            session = (try? JSONDecoder().decode([String: String].self, from: data)) ?? [:]
            accountEmail = session["email"] ?? ""
        }
        if let authenticated = CalendarFeedSession.existing { accountEmail = authenticated.email ?? "" }
        observers.append(NotificationCenter.default.addObserver(forName: .cloudAccountChanged, object: nil, queue: .main) { [weak self] _ in
            Task { @MainActor in
                guard let self else { return }
                self.clearLegacySession()
                self.accountEmail = CalendarFeedSession.existing?.email ?? ""
                self.reload()
                await self.sync()
            }
        })
        observers.append(NotificationCenter.default.addObserver(forName: .EKEventStoreChanged, object: eventStore, queue: .main) { [weak self] _ in Task { @MainActor in self?.reload() } })
        reload()
    }
    func requestAccess() async {
        do { _ = try await eventStore.requestFullAccessToEvents(); reload(); await sync() }
        catch { self.error = error.localizedDescription }
    }
    func reload() {
        let previous = Set(calendars.map(\.id))
        let native = EKEventStore.authorizationStatus(for: .event) == .fullAccess ? eventStore.calendars(for: .event) : []
        calendars = native.map { c in MacCalendarItem(id: c.calendarIdentifier, title: c.title, source: c.source.title,
            color: Color(cgColor: c.cgColor ?? NSColor.systemBlue.cgColor), writable: c.allowsContentModifications, native: c) }
        calendars += local.filter(\.available).map { MacCalendarItem(id: $0.id, title: $0.title, source: "Local Calendars", color: Color(hex: $0.color), writable: true, native: nil) }
        selection.formUnion(Set(calendars.map(\.id)).subtracting(previous))
        nativeEvents = [:]; eventCalendars = [:]; events = []
        for calendar in native {
            for event in adapter.events(in: calendar) {
                let item = adapter.snapshot(event)
                nativeEvents[item.id] = event; eventCalendars[item.id] = calendar.calendarIdentifier; events.append(item)
            }
        }
        for calendar in local {
            for event in calendar.events { eventCalendars[event.id] = calendar.id; events.append(event) }
        }
    }
    func calendar(for event: DeviceCalendarEvent) -> MacCalendarItem? { calendars.first { $0.id == eventCalendars[event.id] } }
    func visibleEvents(on date: Date) -> [DeviceCalendarEvent] {
        let start = Calendar.current.startOfDay(for: date), end = Calendar.current.date(byAdding: .day, value: 1, to: start)!
        return events.filter { selection.contains(eventCalendars[$0.id] ?? "") && $0.startDate < end && $0.endDate > start }.sorted { $0.start < $1.start }
    }
    func createCalendar(title: String) {
        guard !title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { return }
        local.append(DeviceCalendarDocument(id: UUID().uuidString.lowercased(), deviceId: DeviceCalendarReplica.deviceID, deviceName: Host.current().localizedName ?? "Mac", title: title, source: "Local Calendars", color: "#2168DE", allowsChanges: true, events: []))
        persist(); reload(); Task { await sync() }
    }
    func save(_ item: DeviceCalendarEvent, calendarID: String) throws {
        guard let calendar = calendars.first(where: { $0.id == calendarID }), calendar.writable else { return }
        if let native = calendar.native {
            try adapter.apply([item], calendar: native, original: nativeEvents[item.id].map { [$0] } ?? [], base: [])
        } else if let index = local.firstIndex(where: { $0.id == calendarID }) {
            local[index].events.removeAll { $0.id == item.id }; local[index].events.append(item); try persistThrowing()
        }
        reload(); Task { await sync() }
    }
    func delete(_ item: DeviceCalendarEvent) throws {
        if let native = nativeEvents[item.id] { try eventStore.remove(native, span: .thisEvent, commit: true) }
        else { for i in local.indices { local[i].events.removeAll { $0.id == item.id } }; try persistThrowing() }
        reload(); Task { await sync() }
    }
    func replaceLocalCalendars(_ documents: [DeviceCalendarDocument]) throws {
        try JSONEncoder().encode(documents).write(to: file, options: .atomic)
        local = documents
        reload()
        Task { await sync() }
    }
    func applyProviderDocuments(_ documents: [DeviceCalendarDocument]) throws {
        try JSONEncoder().encode(documents).write(to: file, options: .atomic)
        local = documents; reload()
    }
    private func persistThrowing() throws { try JSONEncoder().encode(local).write(to: file, options: .atomic) }
    private func persist() { do { try persistThrowing() } catch { self.error = error.localizedDescription } }
    func sync() async {
        guard allowsAccountConnections, !syncing else { return }
        syncing = true; defer { syncing = false }
        await providers.sync()
        guard let authenticated = cloudSession else { syncError = nil; return }
        var failure: String?
        let token = authenticated.deviceToken, account = authenticated.calendarId
        do { if !(try loadSharedBindings()).isEmpty { try await refreshSharedCalendars(); reload() } }
        catch { failure = failure ?? error.localizedDescription }
        do { try await MacEventSharing.sync(backend: self, session: authenticated) }
        catch { failure = failure ?? error.localizedDescription }
        let replica = DeviceCalendarReplica(baseURL: Self.endpoint, token: token, accountID: account)
        for calendar in calendars where calendar.source != "Shared with me" {
            do {
                var items = events.filter { eventCalendars[$0.id] == calendar.id }
                let id = DeviceCalendarReplica.calendarID(calendar.id)
                if calendar.native != nil {
                    let start = Calendar.current.date(byAdding: .year, value: -1, to: Date())!
                    let end = Calendar.current.date(byAdding: .year, value: 2, to: Date())!
                    items += (replica.baseline(id)?.events ?? []).filter { $0.endDate < start || $0.startDate > end }
                }
                let doc = DeviceCalendarDocument(id: id, deviceId: DeviceCalendarReplica.deviceID, deviceName: Host.current().localizedName ?? "Mac", title: calendar.title,
                    source: calendar.source, color: NSColor(calendar.color).hex, allowsChanges: calendar.writable, events: items)
                try await replica.sync(doc) { result in
                    guard self.cloudSession?.calendarId == account else { throw CancellationError() }
                    if let native = calendar.native {
                        try self.adapter.apply(result, calendar: native, original: items.compactMap { self.nativeEvents[$0.id] }, base: replica.baseline(id)?.events ?? [])
                    } else if let index = self.local.firstIndex(where: { $0.id == calendar.id }) {
                        self.local[index].events = result; try self.persistThrowing()
                    }
                }
            } catch { failure = failure ?? error.localizedDescription }
        }
        if EKEventStore.authorizationStatus(for: .event) == .fullAccess {
            do { try await replica.hideMissingCalendars(keeping: Set(calendars.map { DeviceCalendarReplica.calendarID($0.id) })) }
            catch { failure = failure ?? error.localizedDescription }
        }
        // Background sync must not interrupt the user with a modal every poll.
        // Keep failures visible in Calendar/Account and clear them after recovery.
        syncError = cloudSession?.calendarId == account ? failure : nil
        reload()
    }
    func installSharedCalendar(_ remote: CloudCalendarsAPI.SharedICloudCalendar) throws {
        guard let session = cloudSession else { return }
        let id = "shared-" + DeviceCalendarReplica.hash(session.calendarId + ":" + remote.ownerId + ":" + remote.calendarId)
        var bindings = try loadSharedBindings()
        bindings[id] = MacSharedCalendarBinding(accountID: session.calendarId, ownerID: remote.ownerId, calendarID: remote.calendarId,
            baseline: try (remote.events ?? []).map { try $0.macDeviceEvent() })
        try saveSharedBindings(bindings)
        var documents = local
        let value = DeviceCalendarDocument(id: id, deviceId: DeviceCalendarReplica.deviceID, deviceName: Host.current().localizedName ?? "Mac",
            title: remote.title, source: "Shared with me", color: remote.color, allowsChanges: remote.access != .reader,
            available: !remote.isRevoked, events: bindings[id]!.baseline)
        if let index = documents.firstIndex(where: { $0.id == id }) { documents[index] = value } else { documents.append(value) }
        try replaceLocalCalendars(documents)
    }

    private struct MacSharedCalendarBinding: Codable {
        let accountID: String
        let ownerID: String
        let calendarID: String
        var baseline: [DeviceCalendarEvent]
    }
    private var sharingFile: URL { file.deletingLastPathComponent().appendingPathComponent("shared-calendars.json") }
    private func loadSharedBindings() throws -> [String: MacSharedCalendarBinding] {
        guard FileManager.default.fileExists(atPath: sharingFile.path) else { return [:] }
        return try JSONDecoder().decode([String: MacSharedCalendarBinding].self, from: Data(contentsOf: sharingFile))
    }
    private func saveSharedBindings(_ value: [String: MacSharedCalendarBinding]) throws {
        try JSONEncoder().encode(value).write(to: sharingFile, options: .atomic)
    }
    private func refreshSharedCalendars() async throws {
        guard let session = cloudSession else { return }
        var bindings = try loadSharedBindings()
        let remoteCalendars = try await CloudCalendarsAPI.iCloudCalendarsSharedWithMe(session: session)
        for (id, binding) in bindings where binding.accountID == session.calendarId {
            guard let index = local.firstIndex(where: { $0.id == id }) else { continue }
            guard let remote = remoteCalendars.first(where: { $0.ownerId == binding.ownerID && $0.calendarId == binding.calendarID }), !remote.isRevoked else {
                local[index].available = false; local[index].allowsChanges = false; continue
            }
            let remoteEvents = try (remote.events ?? []).map { try $0.macDeviceEvent() }
            let merged = remote.access == .reader ? remoteEvents : DeviceCalendarReplica.merge(base: binding.baseline, local: local[index].events, remote: remoteEvents)
            if remote.access != .reader && merged.map(\.content) != remoteEvents.map(\.content) {
                _ = try await CloudCalendarsAPI.saveICloudCalendarEvents(calendarId: binding.calendarID, ownerId: binding.ownerID,
                    events: try merged.map { try $0.macSharedCalendarEvent() },
                    windowStart: remote.windowStartDate ?? .distantPast, windowEnd: remote.windowEndDate ?? .distantFuture,
                    expectedUpdatedAt: remote.eventsUpdatedAt, session: session)
            }
            guard self.cloudSession?.calendarId == session.calendarId else { throw CancellationError() }
            local[index].events = merged; local[index].title = remote.title; local[index].color = remote.color
            local[index].allowsChanges = remote.access != .reader; local[index].available = true
            bindings[id]?.baseline = merged
        }
        try persistThrowing(); try saveSharedBindings(bindings)
    }

    var cloudSession: CloudCalendarsAPI.Session? {
        if let authenticated = CalendarFeedSession.existing { return authenticated }
        guard let token = session["deviceToken"], let id = session["calendarId"] else { return nil }
        return .init(calendarId: id, deviceToken: token, feedId: session["feedId"] ?? "", feedUrl: session["feedUrl"] ?? "", email: accountEmail)
    }

    func authenticate(email: String, code: String?) async throws {
        let path = code == nil ? "auth/email/request-code" : "auth/email/verify-code"
        var request = URLRequest(url: Self.endpoint.appendingPathComponent(path)); request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONEncoder().encode(["email": email, "code": code ?? ""])
        let (data, response) = try await URLSession.shared.data(for: request)
        guard let response = response as? HTTPURLResponse, (200..<300).contains(response.statusCode) else { throw DeviceCalendarReplica.SyncError.server((response as? HTTPURLResponse)?.statusCode ?? 0) }
        if code != nil {
            let result = try JSONDecoder().decode([String: CalendarJSON].self, from: data)
            guard let token = result["deviceToken"]?.string, let id = result["calendarId"]?.string else { throw DeviceCalendarReplica.SyncError.server(401) }
            session = ["deviceToken": token, "calendarId": id, "email": email, "feedId": result["feedId"]?.string ?? "", "feedUrl": result["feedUrl"]?.string ?? ""]; accountEmail = email
            let query: [String: Any] = [kSecClass as String: kSecClassGenericPassword, kSecAttrService as String: "CloudCalendarsMac.session.\(Self.accountStorageHost)"]
            SecItemDelete(query as CFDictionary)
            var add = query; add[kSecValueData as String] = try JSONEncoder().encode(session)
            guard SecItemAdd(add as CFDictionary, nil) == errSecSuccess else { throw DeviceCalendarReplica.SyncError.server(500) }
            await sync()
        }
    }
    private func clearLegacySession() {
        session = [:]; accountEmail = ""
        SecItemDelete([kSecClass as String: kSecClassGenericPassword, kSecAttrService as String: "CloudCalendarsMac.session.\(Self.accountStorageHost)"] as CFDictionary)
    }
}

extension Color {
    init(hex: String) {
        let value = UInt32(hex.trimmingCharacters(in: CharacterSet(charactersIn: "#")), radix: 16) ?? 0x2168de
        self.init(.sRGB, red: Double(value >> 16 & 255) / 255, green: Double(value >> 8 & 255) / 255, blue: Double(value & 255) / 255)
    }
}
extension NSColor {
    var hex: String { let c = usingColorSpace(.sRGB) ?? .systemBlue; return String(format: "#%02X%02X%02X", Int(c.redComponent * 255), Int(c.greenComponent * 255), Int(c.blueComponent * 255)) }
}

extension CloudCalendarsAPI.SharedICloudCalendarEvent {
    func macDeviceEvent() throws -> DeviceCalendarEvent {
        DeviceCalendarEvent(id: id, title: title, start: start, end: end, allDay: allDay, location: location, url: url,
            details: try details.map { try CalendarJSON.object(encoding: $0) })
    }
}
extension DeviceCalendarEvent {
    func macSharedCalendarEvent() throws -> CloudCalendarsAPI.SharedICloudCalendarEvent {
        let metadata = try details.map { try JSONDecoder().decode(SharedEventDetails.self, from: JSONEncoder().encode($0)) }
        return .init(id: id, title: title, start: start, end: end, allDay: allDay, location: location, url: url, details: metadata)
    }
}
