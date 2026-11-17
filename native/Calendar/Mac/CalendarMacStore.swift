import SwiftUI
import EventKit
import AppKit
import Security

struct MacCalendarItem: Identifiable, Equatable {
    static func == (lhs: Self, rhs: Self) -> Bool {
        lhs.id == rhs.id && lhs.title == rhs.title && lhs.source == rhs.source && lhs.color == rhs.color && lhs.writable == rhs.writable
    }
    let id: String
    let title: String
    let source: String
    let color: Color
    let writable: Bool
    let native: EKCalendar?
}

@MainActor
final class CalendarMacStore: ObservableObject, ProviderCalendarStorage {
    var providerDocuments: [DeviceCalendarDocument] { local }
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
    lazy var ownedSharing = MacCalendarOwnedSharing(backend: self, directory: file.deletingLastPathComponent())
    private let allowsAccountConnections: Bool
    private let file: URL
    private var interactionActive = false
    private var reloadPending = false
    func setTimelineInteractionActive(_ active: Bool) {
        interactionActive = active
        if !active && reloadPending { reloadPending = false; reload() }
    }
    private var syncRequested = false
    private var eventKitRefresh: Task<Void, Never>?
    var receivedEventUnavailable = Set<String>()
    var receivedEventAccess: [String: CloudCalendarsAPI.EventAccess] = [:]
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
        if let authenticated = CalendarFeedSession.existing {
            accountEmail = authenticated.email ?? ""
            MacEventSharing.restoreReceivedPermissions(backend: self, session: authenticated)
        } else {
            clearLegacySession()
        }
        registerReceivedAccountScopes()
        observers.append(NotificationCenter.default.addObserver(forName: .cloudAccountChanged, object: nil, queue: .main) { [weak self] _ in
            Task { @MainActor in
                guard let self else { return }
                self.clearLegacySession()
                self.accountEmail = CalendarFeedSession.existing?.email ?? ""
                self.receivedEventAccess = [:]
                self.receivedEventUnavailable = []
                if let session = CalendarFeedSession.existing {
                    MacEventSharing.restoreReceivedPermissions(backend: self, session: session)
                }
                self.interactionActive = false
                self.reload()
                await self.sync()
            }
        })
        observers.append(NotificationCenter.default.addObserver(forName: .EKEventStoreChanged, object: eventStore, queue: .main) { [weak self] _ in Task { @MainActor in self?.scheduleEventKitReload() } })
        reload()
    }
    func requestAccess() async {
        do { _ = try await eventStore.requestFullAccessToEvents(); reload(); await sync() }
        catch { self.error = error.localizedDescription }
    }
    private func scheduleEventKitReload() {
        eventKitRefresh?.cancel()
        eventKitRefresh = Task { @MainActor [weak self] in
            try? await Task.sleep(for: .milliseconds(200))
            guard !Task.isCancelled else { return }
            self?.reload()
        }
    }
    var visibleLocalCalendars: [DeviceCalendarDocument] {
        local.filter { !$0.isReceivedSharedCalendar || ReceivedSharingVisibility.isVisible(
            $0.id, kind: "calendar", requiresAccount: true) }
    }
    private func registerReceivedAccountScopes() {
        for (id, binding) in (try? loadSharedBindings()) ?? [:] {
            ReceivedSharingVisibility.register([id], kind: "calendar", accountID: binding.accountID)
        }
        MacEventSharing.registerReceivedAccountScopes()
    }
    func reload() {
        guard !interactionActive else { reloadPending = true; return }
        let previous = Set(calendars.map(\.id))
        let native = EKEventStore.authorizationStatus(for: .event) == .fullAccess ? eventStore.calendars(for: .event) : []
        let nextCalendars = native.map { c in MacCalendarItem(id: c.calendarIdentifier, title: c.title, source: c.source.title,
            color: Color(cgColor: c.cgColor ?? NSColor.systemBlue.cgColor), writable: c.allowsContentModifications, native: c) }
            + visibleLocalCalendars.filter(\.available).map { MacCalendarItem(id: $0.id, title: $0.title, source: $0.source, color: Color(hex: $0.displayColorHex), writable: $0.canEditEvents, native: nil) }
        var nextNative: [String: EKEvent] = [:], nextEventCalendars: [String: String] = [:]
        var nextEvents: [DeviceCalendarEvent] = []
        for calendar in native {
            for event in adapter.events(in: calendar) {
                let item = adapter.snapshot(event)
                guard ReceivedSharingVisibility.isVisible(item.id, kind: "event") else { continue }
                nextNative[item.id] = event; nextEventCalendars[item.id] = calendar.calendarIdentifier; nextEvents.append(item)
            }
        }
        for calendar in visibleLocalCalendars where calendar.available {
            for event in calendar.events where ReceivedSharingVisibility.isVisible(event.id, kind: "event") { nextEventCalendars[event.id] = calendar.id; nextEvents.append(event) }
        }
        nativeEvents = nextNative; eventCalendars = nextEventCalendars
        let nextSelection = selection.union(Set(nextCalendars.map(\.id)).subtracting(previous))
        if selection != nextSelection { selection = nextSelection }
        if calendars != nextCalendars { calendars = nextCalendars }
        nextEvents.sort { $0.id < $1.id }
        if events != nextEvents { events = nextEvents }
    }
    func event(matchingLocalIdentifier identifier: String) -> DeviceCalendarEvent? {
        if let event = events.first(where: { $0.id == identifier }) { return event }
        guard let id = nativeEvents.first(where: { $0.value.eventIdentifier == identifier || $0.value.calendarItemIdentifier == identifier })?.key else { return nil }
        return events.first { $0.id == id }
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
    func save(_ item: DeviceCalendarEvent, calendarID: String, scheduleSync: Bool = true) throws {
        guard let calendar = calendars.first(where: { $0.id == calendarID }), calendar.writable else { return }
        if let native = calendar.native {
            try adapter.apply([item], calendar: native, original: nativeEvents[item.id].map { [$0] } ?? [], base: [])
        } else if let index = local.firstIndex(where: { $0.id == calendarID }) {
            local[index].events.removeAll { $0.id == item.id }; local[index].events.append(item); try persistThrowing()
        }
        reload(); if scheduleSync { Task { await sync() } }
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
        guard documents != local else { return }
        try JSONEncoder().encode(documents).write(to: file, options: .atomic)
        local = documents; reload()
    }
    private func persistThrowing() throws { try JSONEncoder().encode(local).write(to: file, options: .atomic) }
    private func persist() { do { try persistThrowing() } catch { self.error = error.localizedDescription } }
    func sync() async {
        guard allowsAccountConnections else { return }
        guard !syncing else { syncRequested = true; return }
        syncing = true
        defer { syncing = false }
        repeat {
            syncRequested = false
            await syncPass()
        } while syncRequested && !Task.isCancelled
    }
    private func syncPass() async {
        await providers.sync()
        guard let authenticated = cloudSession else { syncError = nil; return }
        var failure: String?
        let token = authenticated.deviceToken, account = authenticated.calendarId
        do { try await refreshSharedCalendars(); reload() }
        catch { failure = failure ?? error.localizedDescription }
        do { try await ownedSharing.syncAll(session: authenticated) }
        catch { failure = failure ?? error.localizedDescription }
        do { try await MacEventSharing.sync(backend: self, session: authenticated) }
        catch { failure = failure ?? error.localizedDescription }
        do {
            try await AccountLocalCalendarSync.sync(storage: self)
            for calendar in local where !calendar.isReceivedSharedCalendar {
                if let id = calendar.sharingCalendarID, try ownedSharing.shareID(localID: calendar.id) == nil {
                    try await ownedSharing.registerAndSync(localID: calendar.id, shareID: id)
                }
            }
        } catch { failure = failure ?? error.localizedDescription }
        let replica = DeviceCalendarReplica(baseURL: Self.endpoint, token: token, accountID: account)
        let receivedIDs = Set(local.filter(\.isReceivedSharedCalendar).map(\.id))
        let accountIDs = Set(local.filter { !$0.isReceivedSharedCalendar && !$0.id.hasPrefix("provider-") }.map(\.id))
        for calendar in calendars where !receivedIDs.contains(calendar.id) && !accountIDs.contains(calendar.id) {
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
                        let latest = self.adapter.events(in: native)
                        let preserved = DeviceCalendarReplica.merge(base: items, local: result, remote: latest.map(self.adapter.snapshot))
                        try self.adapter.apply(preserved, calendar: native, original: latest, base: replica.baseline(id)?.events ?? [])
                    } else if let index = self.local.firstIndex(where: { $0.id == calendar.id }) {
                        let preserved = DeviceCalendarReplica.merge(base: items, local: result, remote: self.local[index].events)
                        if self.local[index].events != preserved {
                            self.local[index].events = preserved; try self.persistThrowing()
                        }
                    }
                }
            } catch { failure = failure ?? error.localizedDescription }
        }
        if EKEventStore.authorizationStatus(for: .event) == .fullAccess {
            do { try await replica.hideMissingCalendars(keeping: Set(calendars.filter { !receivedIDs.contains($0.id) }.map { DeviceCalendarReplica.calendarID($0.id) })) }
            catch { failure = failure ?? error.localizedDescription }
        }
        do { try await replica.hideCalendars(Set(receivedIDs.union(accountIDs).map(DeviceCalendarReplica.calendarID))) }
        catch { failure = failure ?? error.localizedDescription }
        // Background sync must not interrupt the user with a modal every poll.
        // Keep failures visible in Calendar/Account and clear them after recovery.
        syncError = cloudSession?.calendarId == account ? failure : nil
        reload()
    }
    func installSharedCalendar(_ remote: CloudCalendarsAPI.SharedICloudCalendar) throws {
        guard let session = cloudSession else { return }
        var bindings = try loadSharedBindings()
        let id = bindings.first(where: { $0.value.accountID == session.calendarId
            && $0.value.ownerID == remote.ownerId && $0.value.calendarID == remote.calendarId })?.key
            ?? "shared-" + DeviceCalendarReplica.hash(session.calendarId + ":" + remote.ownerId + ":" + remote.calendarId)
        let existing = local.first { $0.id == id }
        let previous = bindings[id]?.baseline ?? []
        let snapshot = try remote.events.map { values in
            MacCalendarSharingMerge.restoringLocalIDs(try values.map { try $0.macDeviceEvent() }, matching: previous + (existing?.events ?? []))
        }
        let items: [DeviceCalendarEvent]
        if let snapshot {
            items = remote.access == .reader ? snapshot : try MacCalendarSharingMerge.reconcile(
                base: previous, local: existing?.events ?? snapshot, remote: snapshot)
        } else {
            // Acceptance returns metadata only. Keep both the events and their
            // merge baseline so an offline edit is not mistaken for a deletion.
            items = existing?.events ?? []
        }
        bindings[id] = MacSharedCalendarBinding(accountID: session.calendarId, ownerID: remote.ownerId,
            calendarID: remote.calendarId, baseline: snapshot ?? previous)
        var documents = local
        let value = DeviceCalendarDocument(id: id, deviceId: DeviceCalendarReplica.deviceID, deviceName: Host.current().localizedName ?? "Mac",
            title: remote.title, source: "Shared with me", color: remote.color, allowsChanges: remote.access != .reader,
            available: !remote.isRevoked, events: items,
            sharing: .init(ownerID: remote.ownerId, calendarID: remote.calendarId, ownerEmail: remote.ownerEmail,
                access: remote.access.rawValue, calendarKind: remote.calendarKind,
                localColorOverride: existing?.sharing?.localColorOverride))
        if let index = documents.firstIndex(where: { $0.id == id }) { documents[index] = value } else { documents.append(value) }
        ReceivedSharingVisibility.register([id], kind: "calendar", accountID: session.calendarId)
        try saveSharedBindings(bindings)
        try replaceLocalCalendars(documents)
    }

    func saveReceivedCalendar(id: String, title: String, localColor: NSColor?) async throws {
        guard let session = cloudSession, let binding = try loadSharedBindings()[id],
              binding.accountID == session.calendarId,
              let current = local.first(where: { $0.id == id }) else { throw CalendarFeedSession.SessionError.signInRequired }
        if current.canManageSharing, title != current.title {
            let remote = try await CloudCalendarsAPI.iCloudCalendarSharing(calendarId: binding.calendarID,
                ownerId: binding.ownerID, session: session)
            _ = try await CloudCalendarsAPI.saveICloudCalendarSharing(calendarId: binding.calendarID, ownerId: binding.ownerID,
                title: title, color: remote.color, timeZone: remote.timeZone, calendarKind: remote.calendarKind ?? "eventkit",
                recipients: remote.recipients.map { ($0.email, $0.access) }, expectedUpdatedAt: remote.updatedAt, session: session)
        }
        guard cloudSession?.calendarId == session.calendarId,
              let index = local.firstIndex(where: { $0.id == id }) else { throw CancellationError() }
        if current.canManageSharing { local[index].title = title }
        local[index].sharing?.localColorOverride = localColor?.hex
        try persistThrowing(); reload()
    }

    func leaveReceivedCalendar(id: String) async throws {
        guard let session = cloudSession, let binding = try loadSharedBindings()[id],
              binding.accountID == session.calendarId else { throw CalendarFeedSession.SessionError.signInRequired }
        try await CloudCalendarsAPI.leaveICloudCalendar(ownerId: binding.ownerID, calendarId: binding.calendarID, session: session)
        guard cloudSession?.calendarId == session.calendarId else { throw CancellationError() }
        var bindings = try loadSharedBindings(); bindings.removeValue(forKey: id)
        try saveSharedBindings(bindings)
        local.removeAll { $0.id == id }; try persistThrowing(); reload()
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
        let remoteCalendars = try await CloudCalendarsAPI.iCloudCalendarsSharedWithMe(session: session)
        guard cloudSession?.calendarId == session.calendarId else { throw CancellationError() }
        // Acceptance on another device must resolve to the same local received
        // calendar here, without creating anything in the Mac's Apple accounts.
        for remote in remoteCalendars where !remote.isRevoked {
            let existingBindings = try loadSharedBindings()
            if !existingBindings.contains(where: { entry in entry.value.accountID == session.calendarId
                && entry.value.ownerID == remote.ownerId && entry.value.calendarID == remote.calendarId
                && local.contains(where: { $0.id == entry.key }) }) {
                try installSharedCalendar(remote)
            }
        }
        let snapshotBindings = try loadSharedBindings()
        for (id, binding) in snapshotBindings where binding.accountID == session.calendarId {
            guard let before = local.first(where: { $0.id == id }),
                  try loadSharedBindings()[id] != nil else { continue }
            guard let remote = remoteCalendars.first(where: { $0.ownerId == binding.ownerID && $0.calendarId == binding.calendarID }), !remote.isRevoked else {
                if let index = local.firstIndex(where: { $0.id == id }) {
                    local[index].available = false; local[index].allowsChanges = false
                    try persistThrowing()
                }
                continue
            }
            // A missing snapshot is not an empty calendar.
            let remoteEvents = try MacCalendarSharingMerge.restoringLocalIDs(
                remote.events?.map { try $0.macDeviceEvent() } ?? binding.baseline, matching: binding.baseline + before.events)
                .map(MacCalendarSharingMerge.wireSnapshot).sorted { $0.id < $1.id }
            let merged = remote.access == .reader ? remoteEvents : try MacCalendarSharingMerge.reconcile(
                base: binding.baseline, local: before.events, remote: remoteEvents)
            if remote.access != .reader && merged != remoteEvents {
                _ = try await CloudCalendarsAPI.saveICloudCalendarEvents(calendarId: binding.calendarID, ownerId: binding.ownerID,
                    events: try merged.map { try $0.macSharedCalendarEvent() },
                    windowStart: remote.windowStartDate ?? .distantPast, windowEnd: remote.windowEndDate ?? .distantFuture,
                    expectedUpdatedAt: remote.eventsUpdatedAt, session: session)
            }
            guard cloudSession?.calendarId == session.calendarId else { throw CancellationError() }
            var currentBindings = try loadSharedBindings()
            guard currentBindings[id] != nil, let index = local.firstIndex(where: { $0.id == id }) else { continue }
            local[index].events = remote.access == .reader ? merged : try MacCalendarSharingMerge.preservingInFlightEdits(
                beforeUpload: before.events, uploaded: merged, current: local[index].events)
            if local[index].title == before.title { local[index].title = remote.title }
            local[index].color = remote.color
            local[index].allowsChanges = remote.access != .reader; local[index].available = true
            local[index].sharing = .init(ownerID: remote.ownerId, calendarID: remote.calendarId, ownerEmail: remote.ownerEmail,
                access: remote.access.rawValue, calendarKind: remote.calendarKind, localColorOverride: local[index].sharing?.localColorOverride)
            currentBindings[id]?.baseline = merged
            try persistThrowing(); try saveSharedBindings(currentBindings)
        }
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
        let metadata = try MacEventShareSnapshot.details(self)
        return .init(id: MacEventShareSnapshot.calendarEventID(id), title: title, start: start, end: end, allDay: allDay, location: location, url: url, details: metadata)
    }
}
