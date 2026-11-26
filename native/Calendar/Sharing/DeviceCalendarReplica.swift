import Foundation
import CryptoKit
import EventKit

/// A lossless JSON value keeps fields unknown to this client through sync.
enum CalendarJSON: Codable, Equatable, Sendable {
    case string(String), number(Double), bool(Bool), object([String: CalendarJSON]), array([CalendarJSON]), null
    init(from decoder: Decoder) throws {
        let c = try decoder.singleValueContainer()
        if c.decodeNil() { self = .null }
        else if let v = try? c.decode(Bool.self) { self = .bool(v) }
        else if let v = try? c.decode(Double.self) { self = .number(v) }
        else if let v = try? c.decode(String.self) { self = .string(v) }
        else if let v = try? c.decode([String: CalendarJSON].self) { self = .object(v) }
        else { self = .array(try c.decode([CalendarJSON].self)) }
    }
    func encode(to encoder: Encoder) throws {
        var c = encoder.singleValueContainer()
        switch self {
        case .string(let v): try c.encode(v)
        case .number(let v): try c.encode(v)
        case .bool(let v): try c.encode(v)
        case .object(let v): try c.encode(v)
        case .array(let v): try c.encode(v)
        case .null: try c.encodeNil()
        }
    }
    var string: String? { if case .string(let v) = self { v } else { nil } }
    var number: Double? { if case .number(let v) = self { v } else { nil } }
    static func object<T: Encodable>(encoding value: T) throws -> [String: CalendarJSON] {
        try JSONDecoder().decode([String: CalendarJSON].self, from: JSONEncoder().encode(value))
    }
}

struct DeviceCalendarEvent: Codable, Equatable, Identifiable, Sendable {
    var id: String
    var title: String
    var start: String
    var end: String
    var allDay: Bool
    var location: String?
    var url: String?
    var details: [String: CalendarJSON]?
    var readOnly: Bool?
    var updatedAt: String?
    var status: String?
    var content: Self { var copy = self; copy.updatedAt = nil; return copy }
    var startDate: Date { Self.date(start) ?? .distantPast }
    var endDate: Date { Self.date(end) ?? .distantPast }
    static func date(_ text: String) -> Date? { CalendarDateCodec.shared.date(text) }
    static func iso(_ date: Date) -> String { CalendarDateCodec.shared.string(date) }

}

/// ISO parsing is used while laying out every event. Reuse formatters and parsed
/// values; the lock also makes background sync callers safe.
private final class CalendarDateCodec: @unchecked Sendable {
    static let shared = CalendarDateCodec()
    private let lock = NSLock()
    private let fractional: ISO8601DateFormatter = {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return formatter
    }()
    private let standard = ISO8601DateFormatter()
    private var cache: [String: Date] = [:]
    func date(_ text: String) -> Date? {
        lock.lock(); defer { lock.unlock() }
        if let value = cache[text] { return value }
        guard let value = fractional.date(from: text) ?? standard.date(from: text) else { return nil }
        if cache.count >= 16384 { cache.removeAll(keepingCapacity: true) }
        cache[text] = value
        return value
    }
    func string(_ date: Date) -> String {
        lock.lock(); defer { lock.unlock() }
        let milliseconds = (date.timeIntervalSince1970 * 1000).rounded()
        return milliseconds.truncatingRemainder(dividingBy: 1000) == 0 ? standard.string(from: date) : fractional.string(from: date)
    }
}

struct DeviceCalendarSharing: Codable, Equatable {
    var ownerID: String
    var calendarID: String
    var ownerEmail: String?
    var access: String
    var calendarKind: String?
    var localColorOverride: String?
}

struct DeviceCalendarDocument: Codable, Equatable, Identifiable {
    var id: String
    var deviceId: String
    var deviceName: String
    var title: String
    var source: String
    var color: String
    var allowsChanges: Bool
    var available: Bool = true
    var events: [DeviceCalendarEvent]
    var revision: Int = 0
    var sharing: DeviceCalendarSharing? = nil
    var accountLocal: Bool? = nil
    var sharingCalendarID: String? = nil
    // Stable provider identity across device-specific replicas; never derived from a title.
    var providerMirrorID: String? = nil
    var eventKitKind: String? = nil
    var updatedAt: String?
    var isReceivedSharedCalendar: Bool { sharing != nil || source == "Shared with me" || id.hasPrefix("shared-") }
    func withProviderMirrorID(_ value: String?) -> Self {
        var document = self
        document.providerMirrorID = value
        return document
    }
}

@MainActor
final class DeviceCalendarReplica {
    struct Response: Decodable { var calendar: DeviceCalendarDocument? }
    enum SyncError: LocalizedError {
        case server(Int)
        var errorDescription: String? { if case .server(let status) = self { return "Calendar sync failed (\(status))." }; return nil }
    }
    private nonisolated static let hexDigits = Array("0123456789abcdef".utf8)
    nonisolated static func hash(_ string: String) -> String {
        let digest = SHA256.hash(data: Data(string.utf8))
        var hex: [UInt8] = []
        hex.reserveCapacity(64)
        for byte in digest {
            hex.append(hexDigits[Int(byte >> 4)])
            hex.append(hexDigits[Int(byte & 15)])
        }
        return String(decoding: hex, as: UTF8.self)
    }
    static var deviceID: String {
        if let saved = UserDefaults.standard.string(forKey: "calendarReplica.deviceID") { return saved }
        let id = UUID().uuidString.lowercased(); UserDefaults.standard.set(id, forKey: "calendarReplica.deviceID"); return id
    }
    static func calendarID(_ localID: String) -> String { hash(deviceID + ":" + localID) }
    let baseURL: URL
    let token: String
    let accountID: String
    init(baseURL: URL, token: String, accountID: String) { self.baseURL = baseURL; self.token = token; self.accountID = accountID }
    /// Moving the API does not reset merge baselines or the calendar inventory.
    static func storageHost(for url: URL) -> String {
        if url.host == "storage.wonek.com", url.path == "/cloud-calendars-debug" {
            return "63yo3ore3c.execute-api.us-east-1.amazonaws.com"
        }
        return url.host ?? ""
    }
    private var prefix: String { "calendarReplica.v1.\(Self.storageHost(for: baseURL)).\(accountID)." }
    func baseline(_ id: String) -> DeviceCalendarDocument? {
        UserDefaults.standard.data(forKey: prefix + id).flatMap { try? JSONDecoder().decode(DeviceCalendarDocument.self, from: $0) }
    }
    /// Tombstone a removed calendar without deleting its saved events.
    /// Call only after a complete, authorized calendar inventory.
    func hideMissingCalendars(keeping ids: Set<String>) async throws {
        let known = UserDefaults.standard.stringArray(forKey: prefix + "catalog") ?? []
        try await hideCalendars(Set(known).subtracting(ids))
    }
    /// Retire a known duplicate replica even when Apple Calendar access is unavailable.
    func hideCalendars(_ ids: Set<String>) async throws {
        let known = Set(UserDefaults.standard.stringArray(forKey: prefix + "catalog") ?? [])
        for id in ids.intersection(known) {
            let request: [String: CalendarJSON] = ["id": .string(id), "deviceId": .string(Self.deviceID), "readOnly": .bool(true)]
            guard var remote = try await send(JSONEncoder().encode(request)), remote.available else { continue }
            remote.available = false
            var body = try CalendarJSON.object(encoding: remote)
            body["expectedRevision"] = .number(Double(remote.revision))
            if let result = try await send(JSONEncoder().encode(body)) {
                UserDefaults.standard.set(try JSONEncoder().encode(result), forKey: prefix + id)
            }
        }
    }
    static func merge(base: [DeviceCalendarEvent], local: [DeviceCalendarEvent], remote: [DeviceCalendarEvent]) -> [DeviceCalendarEvent] {
        let b = Dictionary(base.map { ($0.id, $0) }, uniquingKeysWith: { _, last in last })
        let l = Dictionary(local.map { ($0.id, $0) }, uniquingKeysWith: { _, last in last })
        let r = Dictionary(remote.map { ($0.id, $0) }, uniquingKeysWith: { _, last in last })
        return Set(b.keys).union(l.keys).union(r.keys).compactMap { id in
            if r[id]?.content == b[id]?.content { return l[id] }
            guard let original = b[id], let edited = l[id], var merged = r[id],
                  edited.content != original.content, merged.readOnly != true else { return r[id] }
            // Concurrent edits to independent fields coexist. The remote revision
            // wins a conflict on the same field, including the time range as a unit.
            if merged.status == original.status { merged.status = edited.status }
            if merged.readOnly == original.readOnly { merged.readOnly = edited.readOnly }
            if merged.title == original.title { merged.title = edited.title }
            if merged.startDate == original.startDate && merged.endDate == original.endDate && merged.allDay == original.allDay {
                merged.start = edited.start; merged.end = edited.end; merged.allDay = edited.allDay
            }
            if merged.url == original.url { merged.url = edited.url }
            let oldDetails = original.details ?? [:]
            let localDetails = edited.details ?? [:]
            var nextDetails = merged.details ?? [:]
            if merged.location == original.location && nextDetails["structuredLocation"] == oldDetails["structuredLocation"] {
                merged.location = edited.location
                nextDetails["structuredLocation"] = localDetails["structuredLocation"]
            }
            for key in Set(oldDetails.keys).union(localDetails.keys) where key != "structuredLocation"
                && nextDetails[key] == oldDetails[key] && localDetails[key] != oldDetails[key] {
                nextDetails[key] = localDetails[key]
            }
            if !nextDetails.isEmpty || merged.details != nil || edited.details != nil { merged.details = nextDetails }
            return merged
        }.sorted { $0.id < $1.id }
    }
    func send(_ body: Data) async throws -> DeviceCalendarDocument? {
        var request = URLRequest(url: baseURL.appendingPathComponent("ios/calendars/sync"))
        request.httpMethod = "POST"; request.httpBody = body
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.cachePolicy = .reloadIgnoringLocalCacheData
        let (data, response) = try await URLSession.shared.data(for: request)
        let status = (response as? HTTPURLResponse)?.statusCode ?? 0
        guard (200..<300).contains(status) else { throw SyncError.server(status) }
        return try JSONDecoder().decode(Response.self, from: data).calendar
    }
    /// Never advances the baseline until every returned local write succeeded.
    func sync(_ local: DeviceCalendarDocument, apply: ([DeviceCalendarEvent]) throws -> Void) async throws {
        let request: [String: CalendarJSON] = ["id": .string(local.id), "deviceId": .string(local.deviceId), "readOnly": .bool(true)]
        let remote = try await send(JSONEncoder().encode(request))
        let previous = baseline(local.id)
        var merged = local
        merged.events = Self.merge(base: remote == nil ? [] : previous?.events ?? [], local: local.events, remote: remote?.events ?? [])
        // Preserve the server's change token for unchanged events and avoid writes
        // every poll when only ordering differs.
        let remoteEvents = Dictionary((remote?.events ?? []).map { ($0.id, $0) }, uniquingKeysWith: { _, last in last })
        merged.events = merged.events.map { remoteEvents[$0.id]?.content == $0.content ? remoteEvents[$0.id]! : $0 }
        merged.revision = remote?.revision ?? 0
        merged.updatedAt = remote?.updatedAt
        var normalizedRemote = remote
        normalizedRemote?.events.sort { $0.id < $1.id }
        let result: DeviceCalendarDocument
        if merged == normalizedRemote { result = merged }
        else {
            var body = try CalendarJSON.object(encoding: merged)
            body["expectedRevision"] = .number(Double(remote?.revision ?? 0))
            guard let saved = try await send(JSONEncoder().encode(body)) else { return }
            result = saved
        }
        try apply(result.events)
        UserDefaults.standard.set(try JSONEncoder().encode(result), forKey: prefix + local.id)
        var ids = Set(UserDefaults.standard.stringArray(forKey: prefix + "catalog") ?? [])
        ids.insert(local.id)
        UserDefaults.standard.set(Array(ids).sorted(), forKey: prefix + "catalog")
    }
}

/// EventKit occurrences keep their identity even after a web edit moves them.
@MainActor
final class DeviceEventKitAdapter {
    let store: EKEventStore
    init(store: EKEventStore) { self.store = store }
    private static var mappedIDs = UserDefaults.standard.dictionary(forKey: "calendarReplica.eventIdentifiers") as? [String: String] ?? [:]
    private static var replicaIDsByEvent = reverseMapping(mappedIDs)
    private static func reverseMapping(_ map: [String: String]) -> [String: String] {
        Dictionary(map.map { ($0.value, $0.key) }, uniquingKeysWith: { first, _ in first })
    }
    func identity(_ event: EKEvent) -> String {
        let key = (event.eventIdentifier ?? event.calendarItemIdentifier) + ":" + (event.occurrenceDate.map(DeviceCalendarEvent.iso) ?? "")
        return Self.replicaIDsByEvent[key] ?? DeviceCalendarReplica.hash(key)
    }
    func events(in calendar: EKCalendar) -> [EKEvent] {
        let now = Date(), c = Calendar.current
        let start = c.date(byAdding: .year, value: -1, to: now)!, end = c.date(byAdding: .year, value: 2, to: now)!
        return store.events(matching: store.predicateForEvents(withStart: start, end: end, calendars: [calendar]))
    }
    private func supplementaryDetails(_ id: String) -> [String: CalendarJSON] {
        guard let data = UserDefaults.standard.data(forKey: "calendarReplica.details." + id) else { return [:] }
        return (try? JSONDecoder().decode([String: CalendarJSON].self, from: data)) ?? [:]
    }
    func snapshot(_ event: EKEvent) -> DeviceCalendarEvent {
        // EventKit expands series in this bounded window; each occurrence is edited independently.
        let id = identity(event)
        var details = supplementaryDetails(id)
        let observed = SharedEventDetails(event: event)
        if let fields = try? CalendarJSON.object(encoding: observed) {
            details.merge(fields) { _, updated in updated }
        }
        details["notes"] = .string(event.notes ?? "")
        details["timeZone"] = .string(event.timeZone?.identifier ?? TimeZone.current.identifier)
        details["structuredLocation"] = observed.structuredLocation.flatMap { try? .object(CalendarJSON.object(encoding: $0)) }
        details["recurrenceRules"] = .array([])
        if let supplement = EventKitEventSupplementStore.supplement(for: event) {
            details["travelTime"] = supplement.travelTime.map(CalendarJSON.number)
            details["videoCallURL"] = supplement.videoCallURL.map(CalendarJSON.string)
            details["attachments"] = .array(supplement.attachments.compactMap { try? .object(CalendarJSON.object(encoding: $0)) })
        }
        return DeviceCalendarEvent(id: id, title: event.title ?? "", start: DeviceCalendarEvent.iso(event.startDate), end: DeviceCalendarEvent.iso(event.calendarRangeEnd), allDay: event.isAllDay,
            location: event.location, url: event.url?.absoluteString,
            details: details,
            readOnly: !event.calendar.allowsContentModifications || event.hasAttendees || event.status == .canceled,
            status: event.status == .canceled ? "cancelled" : nil)
    }
    func apply(_ items: [DeviceCalendarEvent], calendar: EKCalendar, original: [EKEvent], base: [DeviceCalendarEvent]) throws {
        guard calendar.allowsContentModifications else { return }
        let current = Dictionary(original.map { (identity($0), $0) }, uniquingKeysWith: { _, last in last })
        let byID = Dictionary(items.map { ($0.id, $0) }, uniquingKeysWith: { _, last in last })
        let baseIDs = Set(base.map(\.id))
        for (id, event) in current where baseIDs.contains(id) && byID[id] == nil && !event.hasAttendees {
            try store.remove(event, span: .thisEvent, commit: true)
        }
        for item in items {
            let existing = current[item.id]
            if existing == nil, base.first(where: { $0.id == item.id })?.content == item.content { continue }
            guard item.readOnly != true, existing?.hasAttendees != true else { continue }
            if let existing, snapshot(existing).content == item.content { continue }
            let event = existing ?? EKEvent(eventStore: store)
            event.calendar = calendar; event.title = item.title; event.applyCalendarSchedule(start: item.startDate, end: item.endDate, allDay: item.allDay,
                timeZone: item.details?["timeZone"]?.string.flatMap(TimeZone.init(identifier:)))
            event.location = item.location; event.url = item.url.flatMap(URL.init(string:))
            event.notes = item.details?["notes"]?.string
            if case .array(let alarms) = item.details?["alarms"] {
                event.alarms = try alarms.compactMap { value in
                    try JSONDecoder().decode(SharedEventAlarm.self, from: JSONEncoder().encode(value)).makeAlarm()
                }
            }
            if let raw = item.details?["availability"]?.number, let availability = EKEventAvailability(rawValue: Int(raw)) {
                if availability != .notSupported { event.availability = availability }
            }
            if existing == nil, case .array(let rules) = item.details?["recurrenceRules"] {
                event.recurrenceRules = try rules.compactMap { value in
                    try JSONDecoder().decode(SharedEventRecurrenceRule.self, from: JSONEncoder().encode(value)).makeRule()
                }
            }
            if case .object(let fields) = item.details?["structuredLocation"] {
                let place = try JSONDecoder().decode(SharedEventLocation.self, from: JSONEncoder().encode(fields))
                event.structuredLocation = place.makeLocation(title: item.location)
            }
            try store.save(event, span: .thisEvent, commit: true)
            if let details = item.details {
                if ["travelTime", "attachments", "videoCallURL"].contains(where: { details[$0] != nil }) ||
                    EventKitEventSupplementStore.supplement(for: event) != nil {
                    let attachments = try details["attachments"].flatMap { value -> [AppLocalEventAttachment]? in
                        if case .null = value { return nil }
                        return try JSONDecoder().decode([AppLocalEventAttachment].self, from: JSONEncoder().encode(value))
                    } ?? []
                    EventKitEventSupplementStore.update(travelTime: details["travelTime"]?.number, attachments: attachments,
                        videoCallURL: details["videoCallURL"]?.string, for: event)
                }
                UserDefaults.standard.set(try JSONEncoder().encode(details), forKey: "calendarReplica.details." + item.id)
            }
            let key = (event.eventIdentifier ?? event.calendarItemIdentifier) + ":" + (event.occurrenceDate.map(DeviceCalendarEvent.iso) ?? "")
            if Self.mappedIDs[item.id] != key {
                Self.mappedIDs[item.id] = key
                Self.replicaIDsByEvent = Self.reverseMapping(Self.mappedIDs)
                UserDefaults.standard.set(Self.mappedIDs, forKey: "calendarReplica.eventIdentifiers")
            }
        }
    }
}
