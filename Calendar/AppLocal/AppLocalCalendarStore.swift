import Combine
import CryptoKit
import Foundation
import UIKit

extension Notification.Name {
    static let appLocalCalendarStoreChanged = Notification.Name("AppLocalCalendarStoreChanged")
}

enum AppLocalCalendarOrigin: String, Codable {
    case owned
    case received
}

struct AppLocalCalendarRecord: Codable, Equatable, Identifiable {
    static let identifierPrefix = "app-local:"

    var id: String
    var title: String
    var colorHex: String
    var timeZoneIdentifier: String
    var createdAt: Date
    var updatedAt: Date
    var origin: AppLocalCalendarOrigin
    var remoteOwnerID: String?
    var remoteOwnerEmail: String?
    var remoteCalendarID: String?
    var access: CloudCalendarsAPI.EventAccess
    var isOriginalCreator: Bool
    var revokedAt: Date?
    var revokedReason: String?
    var localColorOverrideHex: String?

    init(
        id: String = Self.identifierPrefix + UUID().uuidString.lowercased(),
        title: String,
        colorHex: String,
        timeZoneIdentifier: String = TimeZone.current.identifier,
        createdAt: Date = Date(),
        updatedAt: Date = Date(),
        origin: AppLocalCalendarOrigin = .owned,
        remoteOwnerID: String? = nil,
        remoteOwnerEmail: String? = nil,
        remoteCalendarID: String? = nil,
        access: CloudCalendarsAPI.EventAccess = .owner,
        isOriginalCreator: Bool = true,
        revokedAt: Date? = nil,
        revokedReason: String? = nil,
        localColorOverrideHex: String? = nil
    ) {
        self.id = id
        self.title = title
        self.colorHex = colorHex
        self.timeZoneIdentifier = timeZoneIdentifier
        self.createdAt = createdAt
        self.updatedAt = updatedAt
        self.origin = origin
        self.remoteOwnerID = remoteOwnerID
        self.remoteOwnerEmail = remoteOwnerEmail
        self.remoteCalendarID = remoteCalendarID
        self.access = access
        self.isOriginalCreator = isOriginalCreator
        self.revokedAt = revokedAt
        self.revokedReason = revokedReason
        self.localColorOverrideHex = localColorOverrideHex
    }

    var displayColorHex: String { localColorOverrideHex ?? colorHex }
    var isRevoked: Bool { revokedAt != nil }
    var canEditEvents: Bool { !isRevoked && access != .reader }
    var canManageSharing: Bool { !isRevoked && access == .owner }

    /// The backend deliberately receives a one-way fingerprint rather than
    /// the app's raw local identifier.
    var shareID: String {
        if let remoteCalendarID, !remoteCalendarID.isEmpty { return remoteCalendarID }
        return SHA256.hash(data: Data(id.utf8))
            .map { String(format: "%02x", $0) }
            .joined()
    }
}

struct AppLocalEventAlarm: Codable, Equatable, Identifiable {
    var id: UUID = UUID()
    var relativeOffset: TimeInterval
}

struct AppLocalEventAttachment: Codable, Equatable, Identifiable {
    var id: String = UUID().uuidString.lowercased()
    var fileName: String
    var contentType: String?
    var dataBase64: String

    var sharedValue: SharedEventAttachment {
        SharedEventAttachment(
            id: id,
            fileName: fileName,
            contentType: contentType,
            dataBase64: dataBase64
        )
    }

    init(
        id: String = UUID().uuidString.lowercased(),
        fileName: String,
        contentType: String?,
        dataBase64: String
    ) {
        self.id = id
        self.fileName = fileName
        self.contentType = contentType
        self.dataBase64 = dataBase64
    }

    init(_ value: SharedEventAttachment) {
        id = value.id
        fileName = value.fileName
        contentType = value.contentType
        dataBase64 = value.dataBase64
    }
}

struct AppLocalEventRecord: Codable, Equatable, Identifiable {
    var id: String
    var calendarID: String
    var title: String
    var startDate: Date
    var endDate: Date
    var isAllDay: Bool
    var location: String
    var notes: String
    var urlString: String
    var videoCallURL: String?
    var timeZoneIdentifier: String
    var alarms: [AppLocalEventAlarm]
    var createdAt: Date
    var updatedAt: Date
    var remoteEventID: String?
    var isCancelled: Bool
    /// Optional fields keep snapshots from earlier app versions decodable.
    var travelTime: TimeInterval?
    var recurrenceRules: [SharedEventRecurrenceRule]?
    var structuredLocation: SharedEventLocation?
    var attachments: [AppLocalEventAttachment]?

    init(
        id: String = "app-local-event:" + UUID().uuidString.lowercased(),
        calendarID: String,
        title: String,
        startDate: Date,
        endDate: Date,
        isAllDay: Bool = false,
        location: String = "",
        notes: String = "",
        urlString: String = "",
        videoCallURL: String? = nil,
        timeZoneIdentifier: String = TimeZone.current.identifier,
        alarms: [AppLocalEventAlarm] = [],
        createdAt: Date = Date(),
        updatedAt: Date = Date(),
        remoteEventID: String? = nil,
        isCancelled: Bool = false,
        travelTime: TimeInterval? = nil,
        recurrenceRules: [SharedEventRecurrenceRule]? = nil,
        structuredLocation: SharedEventLocation? = nil,
        attachments: [AppLocalEventAttachment]? = nil
    ) {
        self.id = id
        self.calendarID = calendarID
        self.title = title
        self.startDate = startDate
        self.endDate = max(endDate, startDate)
        self.isAllDay = isAllDay
        self.location = location
        self.notes = notes
        self.urlString = urlString
        self.videoCallURL = videoCallURL
        self.timeZoneIdentifier = timeZoneIdentifier
        self.alarms = alarms
        self.createdAt = createdAt
        self.updatedAt = updatedAt
        self.remoteEventID = remoteEventID
        self.isCancelled = isCancelled
        self.travelTime = travelTime
        self.recurrenceRules = recurrenceRules
        self.structuredLocation = structuredLocation
        self.attachments = attachments
    }

    var shareID: String {
        if let remoteEventID, !remoteEventID.isEmpty { return remoteEventID }
        return SHA256.hash(data: Data(id.utf8))
            .map { String(format: "%02x", $0) }
            .joined()
    }
}

@MainActor
final class AppLocalCalendarStore: ObservableObject {
    static let shared = AppLocalCalendarStore()

    @Published private(set) var calendars: [AppLocalCalendarRecord] = []
    @Published private(set) var events: [AppLocalEventRecord] = []

    private struct Snapshot: Codable {
        var schemaVersion: Int
        var calendars: [AppLocalCalendarRecord]
        var events: [AppLocalEventRecord]
    }

    private let fileURL: URL

    private init(fileManager: FileManager = .default) {
        let root = fileManager.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
            .appendingPathComponent("CloudCalendars", isDirectory: true)
        try? fileManager.createDirectory(at: root, withIntermediateDirectories: true)
        fileURL = root.appendingPathComponent("app-local-calendars.json")
        load()
    }

    var ownedCalendars: [AppLocalCalendarRecord] {
        calendars.filter { $0.origin == .owned }
            .sorted { $0.title.localizedStandardCompare($1.title) == .orderedAscending }
    }

    var receivedCalendars: [AppLocalCalendarRecord] {
        calendars.filter { $0.origin == .received }
            .sorted { $0.title.localizedStandardCompare($1.title) == .orderedAscending }
    }

    func calendar(id: String) -> AppLocalCalendarRecord? {
        calendars.first { $0.id == id }
    }

    @discardableResult
    func createCalendar(title: String, color: UIColor) -> AppLocalCalendarRecord {
        let calendar = AppLocalCalendarRecord(
            title: title.trimmingCharacters(in: .whitespacesAndNewlines),
            colorHex: Self.colorHex(color)
        )
        calendars.append(calendar)
        persistAndNotify()
        return calendar
    }

    func upsertCalendar(_ calendar: AppLocalCalendarRecord) {
        var value = calendar
        value.updatedAt = Date()
        if let index = calendars.firstIndex(where: { $0.id == value.id }) {
            calendars[index] = value
        } else {
            calendars.append(value)
        }
        persistAndNotify()
    }

    /// Makes an owned app calendar addressable by the sharing API without
    /// ever exposing the raw on-device identifier to the server.
    @discardableResult
    func registerForSharing(id: String) -> AppLocalCalendarRecord? {
        guard let index = calendars.firstIndex(where: { $0.id == id }) else { return nil }
        if calendars[index].remoteCalendarID == nil {
            calendars[index].remoteCalendarID = calendars[index].shareID
            calendars[index].updatedAt = Date()
            persistAndNotify()
        }
        return calendars[index]
    }

    /// Reconciles an app-owned calendar snapshot. Unlike the EventKit path,
    /// all metadata and events remain inside this store.
    @discardableResult
    func applyRemoteCalendar(_ remote: CloudCalendarsAPI.SharedICloudCalendar, ownedCalendarID: String? = nil) -> Bool {
        guard remote.calendarKind == "app_local" else { return false }
        if let ownedCalendarID {
            guard let owned = calendar(id: ownedCalendarID), owned.origin == .owned,
                  owned.shareID == remote.calendarId else { return false }
        }
        let localID = ownedCalendarID ?? calendars.first(where: {
            $0.origin == .received
                && $0.remoteOwnerID == remote.ownerId
                && $0.remoteCalendarID == remote.calendarId
        })?.id ?? Self.receivedCalendarID(remote)
        let previous = calendar(id: localID)
        let updated = AppLocalCalendarRecord(
            id: localID,
            title: remote.title,
            colorHex: remote.color,
            timeZoneIdentifier: remote.timeZone,
            createdAt: previous?.createdAt ?? Date(),
            updatedAt: Self.date(remote.updatedAt) ?? previous?.updatedAt ?? Date(),
            origin: ownedCalendarID == nil ? .received : .owned,
            remoteOwnerID: remote.ownerId,
            remoteOwnerEmail: remote.ownerEmail,
            remoteCalendarID: remote.calendarId,
            access: remote.access,
            isOriginalCreator: ownedCalendarID != nil,
            revokedAt: Self.date(remote.revokedAt),
            revokedReason: remote.revokedReason,
            localColorOverrideHex: previous?.localColorOverrideHex
        )

        // Acceptance/metadata responses omit events. Omission must never be
        // interpreted as a deletion snapshot (an explicit [] means empty).
        let remoteEvents: [AppLocalEventRecord] = remote.events == nil
            ? events.filter { $0.calendarID == localID }.map { event in
                var preserved = event
                preserved.isCancelled = remote.isRevoked
                return preserved
            }
            : (remote.events ?? []).compactMap { value -> AppLocalEventRecord? in
            guard let start = value.startDate, let end = value.endDate else { return nil }
            let old = events.first { $0.calendarID == localID && $0.shareID == value.id }
            var availableAlarms = old?.alarms ?? []
            let alarms = (value.details?.alarms ?? []).compactMap { alarm -> AppLocalEventAlarm? in
                guard let offset = alarm.relativeOffset else { return nil }
                if let index = availableAlarms.firstIndex(where: { $0.relativeOffset == offset }) {
                    return availableAlarms.remove(at: index)
                }
                return AppLocalEventAlarm(relativeOffset: offset)
            }
            return AppLocalEventRecord(
                id: old?.id ?? Self.receivedEventID(calendarID: localID, remoteEventID: value.id),
                calendarID: localID,
                title: value.title,
                startDate: start,
                endDate: end,
                isAllDay: value.allDay,
                location: value.location ?? "",
                notes: value.details?.notes ?? "",
                urlString: value.url ?? "",
                videoCallURL: value.details?.videoCallURL,
                timeZoneIdentifier: value.details?.timeZone ?? remote.timeZone,
                alarms: alarms,
                createdAt: old?.createdAt ?? Date(),
                updatedAt: Self.date(remote.eventsUpdatedAt) ?? old?.updatedAt ?? Date(),
                remoteEventID: value.id,
                isCancelled: remote.isRevoked,
                travelTime: value.details?.travelTime,
                recurrenceRules: value.details?.recurrenceRules,
                structuredLocation: value.details?.structuredLocation,
                attachments: value.details?.attachments?.map(AppLocalEventAttachment.init)
            )
        }

        let changed = previous != updated
            || events.filter { $0.calendarID == localID }.sorted { $0.id < $1.id }
                != remoteEvents.sorted { $0.id < $1.id }
        guard changed else { return false }
        if let index = calendars.firstIndex(where: { $0.id == localID }) {
            calendars[index] = updated
        } else {
            calendars.append(updated)
            CalendarViewModel.shared.selectedCalendarIDs.insert(localID)
        }
        events.removeAll { $0.calendarID == localID }
        events.append(contentsOf: remoteEvents)
        if changed { persistAndNotify() }
        return changed
    }

    func removeRemoteCalendarsNotPresent(in remoteKeys: Set<String>) {
        let removedIDs = Set(calendars.filter {
            $0.origin == .received
                && !remoteKeys.contains(Self.remoteKey(ownerID: $0.remoteOwnerID, calendarID: $0.remoteCalendarID))
        }.map(\.id))
        guard !removedIDs.isEmpty else { return }
        calendars.removeAll { removedIDs.contains($0.id) }
        events.removeAll { removedIDs.contains($0.calendarID) }
        CalendarViewModel.shared.selectedCalendarIDs.subtract(removedIDs)
        persistAndNotify()
    }

    func updateCalendar(id: String, title: String, color: UIColor) {
        guard let index = calendars.firstIndex(where: { $0.id == id }) else { return }
        calendars[index].title = title.trimmingCharacters(in: .whitespacesAndNewlines)
        calendars[index].colorHex = Self.colorHex(color)
        calendars[index].updatedAt = Date()
        persistAndNotify()
    }

    func setLocalColorOverride(_ color: UIColor?, calendarID: String) {
        guard let index = calendars.firstIndex(where: { $0.id == calendarID }) else { return }
        calendars[index].localColorOverrideHex = color.map(Self.colorHex)
        persistAndNotify()
    }

    func removeCalendar(id: String) {
        calendars.removeAll { $0.id == id }
        events.removeAll { $0.calendarID == id }
        CalendarViewModel.shared.selectedCalendarIDs.remove(id)
        persistAndNotify()
    }

    func events(from start: Date, to end: Date, selectedCalendarIDs: Set<String>) -> [AppLocalEventRecord] {
        events.filter {
            selectedCalendarIDs.contains($0.calendarID)
                && $0.startDate < end
                && $0.endDate > start
        }
    }

    func event(id: String) -> AppLocalEventRecord? {
        events.first { $0.id == id }
    }

    func saveEvent(_ event: AppLocalEventRecord) {
        var value = event
        value.endDate = max(value.endDate, value.startDate)
        value.updatedAt = Date()
        if let index = events.firstIndex(where: { $0.id == value.id }) {
            events[index] = value
        } else {
            events.append(value)
        }
        persistAndNotify()
    }

    func deleteEvent(id: String) {
        events.removeAll { $0.id == id }
        persistAndNotify()
    }

    /// Cross-provider moves must confirm the disk write before deleting their
    /// source. Ordinary in-memory save success is not sufficient for a move.
    func saveTransferredEvent(_ event: AppLocalEventRecord) throws {
        var updated = events.filter { $0.id != event.id }
        updated.append(event)
        try persistTransferredEvents(updated)
    }

    func deleteTransferredEvent(id: String) throws {
        try persistTransferredEvents(events.filter { $0.id != id })
    }

    private func persistTransferredEvents(_ updated: [AppLocalEventRecord]) throws {
        let snapshot = Snapshot(schemaVersion: 1, calendars: calendars, events: updated)
        try JSONEncoder().encode(snapshot).write(to: fileURL, options: .atomic)
        events = updated
        NotificationCenter.default.post(name: .appLocalCalendarStoreChanged, object: nil)
        EventNotificationManager.shared.rescheduleUpcomingEventNotifications()
        SharedEventSyncManager.eventStoreDidChange()
    }

    func moveEvent(id: String, startDate: Date, endDate: Date) {
        guard let index = events.firstIndex(where: { $0.id == id }),
              calendar(id: events[index].calendarID)?.canEditEvents == true else { return }
        events[index].startDate = startDate
        events[index].endDate = max(endDate, startDate)
        events[index].updatedAt = Date()
        persistAndNotify()
    }

    func descriptors(from start: Date, to end: Date, selectedCalendarIDs: Set<String>) -> [EventDescriptor] {
        var result: [EventDescriptor] = []
        let systemCalendar = Calendar.current
        for event in events(from: start, to: end, selectedCalendarIDs: selectedCalendarIDs) {
            let clippedStart = max(event.startDate, start)
            let clippedEnd = min(event.endDate, end)
            guard clippedStart < clippedEnd else { continue }
            var sliceStart = clippedStart
            while sliceStart < clippedEnd {
                let nextDay = systemCalendar.date(
                    byAdding: .day,
                    value: 1,
                    to: systemCalendar.startOfDay(for: sliceStart)
                ) ?? clippedEnd
                let sliceEnd = min(nextDay, clippedEnd)
                result.append(AppLocalEventDescriptor(
                    eventID: event.id,
                    partialStart: sliceStart,
                    partialEnd: sliceEnd
                ))
                sliceStart = sliceEnd
            }
        }
        return result
    }

    private func load() {
        guard let data = try? Data(contentsOf: fileURL),
              let snapshot = try? JSONDecoder().decode(Snapshot.self, from: data)
        else { return }
        calendars = snapshot.calendars
        events = snapshot.events
    }

    private func persistAndNotify() {
        let snapshot = Snapshot(schemaVersion: 1, calendars: calendars, events: events)
        guard let data = try? JSONEncoder().encode(snapshot) else { return }
        do {
            try data.write(to: fileURL, options: .atomic)
        } catch {
            print("Unable to save app-local calendars: \(error.localizedDescription)")
        }
        NotificationCenter.default.post(name: .appLocalCalendarStoreChanged, object: nil)
        EventNotificationManager.shared.rescheduleUpcomingEventNotifications()
        SharedEventSyncManager.eventStoreDidChange()
    }

    nonisolated static func colorHex(_ color: UIColor) -> String {
        var red: CGFloat = 0
        var green: CGFloat = 0
        var blue: CGFloat = 0
        var alpha: CGFloat = 0
        guard color.getRed(&red, green: &green, blue: &blue, alpha: &alpha) else {
            return "#0088FF"
        }
        return String(
            format: "#%02X%02X%02X",
            Int((red * 255).rounded()),
            Int((green * 255).rounded()),
            Int((blue * 255).rounded())
        )
    }

    nonisolated static func color(_ value: String) -> UIColor {
        let raw = value.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        guard raw.count == 6, let rgb = UInt64(raw, radix: 16) else { return .systemBlue }
        return UIColor(
            red: CGFloat((rgb >> 16) & 0xff) / 255,
            green: CGFloat((rgb >> 8) & 0xff) / 255,
            blue: CGFloat(rgb & 0xff) / 255,
            alpha: 1
        )
    }

    nonisolated static func remoteKey(ownerID: String?, calendarID: String?) -> String {
        "\(ownerID ?? ""):\(calendarID ?? "")"
    }

    private nonisolated static func receivedCalendarID(
        _ remote: CloudCalendarsAPI.SharedICloudCalendar
    ) -> String {
        AppLocalCalendarRecord.identifierPrefix + "received:" + remote.id
    }

    private nonisolated static func receivedEventID(
        calendarID: String,
        remoteEventID: String
    ) -> String {
        "app-local-event:received:\(calendarID):\(remoteEventID)"
    }

    private nonisolated static func date(_ value: String?) -> Date? {
        guard let value else { return nil }
        let fractional = ISO8601DateFormatter()
        fractional.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return fractional.date(from: value) ?? ISO8601DateFormatter().date(from: value)
    }
}

final class AppLocalEventDescriptor: EventDescriptor {
    let eventID: String
    var partialStart: Date
    var partialEnd: Date
    weak var editedEvent: EventDescriptor?
    // Gesture previews are drafts, just like EventKit objects. Do not publish
    // store changes halfway through a drag (which rebuilds the active views).
    private var pendingAllDay: Bool?
    var pendingCalendarID: String?

    init(eventID: String, partialStart: Date, partialEnd: Date) {
        self.eventID = eventID
        self.partialStart = partialStart
        self.partialEnd = partialEnd
    }

    private var event: AppLocalEventRecord? {
        let id = eventID
        return MainActor.assumeIsolated { AppLocalCalendarStore.shared.event(id: id) }
    }

    private var calendar: AppLocalCalendarRecord? {
        guard let calendarID = event?.calendarID else { return nil }
        return MainActor.assumeIsolated {
            AppLocalCalendarStore.shared.calendar(id: calendarID)
        }
    }

    var dateInterval: DateInterval {
        get { DateInterval(start: partialStart, end: partialEnd) }
        set { partialStart = newValue.start; partialEnd = newValue.end }
    }

    var isAllDay: Bool {
        get { pendingAllDay ?? event?.isAllDay ?? false }
        set { pendingAllDay = newValue }
    }

    @MainActor
    func commitTimelineChange(isResize: Bool) {
        let store = AppLocalCalendarStore.shared
        guard var value = store.event(id: eventID), !isReadOnly else { return }
        if let destination = pendingCalendarID {
            guard store.calendar(id: destination)?.canEditEvents == true else { return }
            value.calendarID = destination
        }
        let oldDuration = value.endDate.timeIntervalSince(value.startDate)
        let movingAllDay = value.isAllDay && isAllDay && !isResize
        value.startDate = dateInterval.start
        value.endDate = movingAllDay
            ? value.startDate.addingTimeInterval(oldDuration)
            : dateInterval.end
        value.isAllDay = isAllDay
        store.saveEvent(value)
        pendingAllDay = nil
        pendingCalendarID = nil
    }

    var text: String { event?.title ?? "" }
    var attributedText: NSAttributedString?
    var lineBreakMode: NSLineBreakMode?
    var font = UIFont.boldSystemFont(ofSize: 12)
    var color: UIColor {
        AppLocalCalendarStore.color(calendar?.displayColorHex ?? "#0088FF")
    }
    var textColor: UIColor = .label
    var backgroundColor: UIColor { color.withAlphaComponent(0.30) }
    var calendarID: String? { event?.calendarID }
    var location: String { event?.location ?? "" }
    var originalInterval: DateInterval {
        guard let event else { return dateInterval }
        return DateInterval(start: event.startDate, end: event.endDate)
    }
    var notes: String { event?.notes ?? "" }
    var isCancelled: Bool { event?.isCancelled == true || calendar?.isRevoked == true }
    var isReadOnly: Bool { calendar?.canEditEvents != true }

    func makeEditable() -> Self {
        let copy = Self(eventID: eventID, partialStart: partialStart, partialEnd: partialEnd)
        copy.editedEvent = self
        return copy
    }

    func commitEditing() {
        guard let edited = editedEvent as? AppLocalEventDescriptor,
              let old = event else { return }
        let duration = old.endDate.timeIntervalSince(old.startDate)
        let id = eventID
        let newStart = edited.partialStart
        MainActor.assumeIsolated {
            AppLocalCalendarStore.shared.moveEvent(
                id: id,
                startDate: newStart,
                endDate: newStart.addingTimeInterval(duration)
            )
        }
    }
}
