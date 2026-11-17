import Foundation
import UIKit

/// Adapts the existing iOS local-calendar editor/timeline to the same provider
/// sync engine as Mac. No EventKit calendar or event is saved by this adapter.
@MainActor
final class AppLocalProviderCalendarStore: ProviderCalendarStorage {
    static let shared = AppLocalProviderCalendarStore()
    private let store = AppLocalCalendarStore.shared
    lazy var engine = ProviderCalendarSyncEngine(storage: self, directory: store.fileURL.deletingLastPathComponent(),
        identifierPrefix: "app-local:provider-", deviceName: UIDevice.current.name)
    private var activeAccounts = Set<String>()
    private var pendingAccounts = Set<String>()

    static func accountID(provider: String, identity: String) -> String {
        DeviceCalendarReplica.hash(provider + ":" + identity.lowercased())
    }
    func calendars(accountID: String) -> [AppLocalCalendarRecord] {
        let ids = engine.calendarIDs(for: accountID)
        return store.calendars.filter { ids.contains($0.id) && !$0.isRevoked }
    }
    func sync(_ account: ProviderCalendarSyncEngine.Account, legacy: [String: [ProviderCalendarSyncEngine.LegacyEvent]] = [:]) async throws {
        guard activeAccounts.insert(account.id).inserted else { pendingAccounts.insert(account.id); return }
        defer { activeAccounts.remove(account.id) }
        repeat {
            pendingAccounts.remove(account.id)
            try await engine.sync(account, legacy: legacy)
        } while pendingAccounts.contains(account.id) && !Task.isCancelled
    }
    func disconnect(_ id: String) throws { try engine.disconnect(id) }

    var providerDocuments: [DeviceCalendarDocument] {
        store.calendars.filter(\.isProvider).map { calendar in
            DeviceCalendarDocument(id: calendar.id, deviceId: DeviceCalendarReplica.deviceID, deviceName: UIDevice.current.name,
                title: calendar.title, source: calendar.providerSource ?? "", color: calendar.colorHex,
                allowsChanges: calendar.canEditEvents, available: !calendar.isRevoked,
                events: store.events.filter { $0.calendarID == calendar.id }.map(Self.snapshot))
        }
    }
    static func snapshot(_ record: AppLocalEventRecord) -> DeviceCalendarEvent {
        var value = record.providerSnapshot ?? DeviceCalendarEvent(id: record.id, title: record.title,
            start: DeviceCalendarEvent.iso(record.startDate), end: DeviceCalendarEvent.iso(record.endDate), allDay: record.isAllDay)
        value.id = record.id; value.title = record.title; value.start = DeviceCalendarEvent.iso(record.startDate)
        value.end = DeviceCalendarEvent.iso(record.endDate); value.allDay = record.isAllDay
        value.location = record.location.isEmpty ? nil : record.location; value.url = record.urlString.isEmpty ? nil : record.urlString
        var details = value.details ?? [:]
        details["notes"] = .string(record.notes); details["timeZone"] = .string(record.timeZoneIdentifier)
        if !record.alarms.isEmpty || details["alarms"] != nil {
            details["alarms"] = try? JSONDecoder().decode(CalendarJSON.self, from: JSONEncoder().encode(record.alarms.map { SharedEventAlarm(relativeOffset: $0.relativeOffset) }))
        }
        if let rules = record.recurrenceRules, !rules.isEmpty || details["recurrenceRules"] != nil {
            details["recurrenceRules"] = try? JSONDecoder().decode(CalendarJSON.self, from: JSONEncoder().encode(rules))
        }
        value.details = details; value.readOnly = record.providerReadOnly
        return value
    }
    func applyProviderDocuments(_ documents: [DeviceCalendarDocument]) throws {
        var calendars = store.calendars.filter { !$0.isProvider }
        var events = store.events.filter { store.calendar(id: $0.calendarID)?.isProvider != true }
        for document in documents {
            var calendar = store.calendar(id: document.id) ?? AppLocalCalendarRecord(id: document.id, title: document.title, colorHex: document.color)
            calendar.title = document.title; calendar.colorHex = document.color; calendar.providerSource = document.source
            calendar.access = document.allowsChanges ? .writer : .reader
            calendar.revokedAt = document.available ? nil : (calendar.revokedAt ?? Date())
            calendars.append(calendar)
            for item in document.events {
                var event = store.event(id: item.id) ?? AppLocalEventRecord(id: item.id, calendarID: document.id,
                    title: item.title, startDate: item.startDate, endDate: item.endDate)
                event.title = item.title; event.startDate = item.startDate; event.endDate = item.endDate; event.isAllDay = item.allDay
                event.location = item.location ?? ""; event.urlString = item.url ?? ""; event.notes = item.details?["notes"]?.string ?? ""
                event.timeZoneIdentifier = item.details?["timeZone"]?.string ?? TimeZone.current.identifier
                event.videoCallURL = item.details?["videoCallURL"]?.string
                let alarms: [SharedEventAlarm] = item.decodedDetail("alarms") ?? []
                let offsets = alarms.compactMap(\.relativeOffset)
                if event.alarms.map(\.relativeOffset) != offsets { event.alarms = offsets.map { AppLocalEventAlarm(relativeOffset: $0) } }
                event.recurrenceRules = item.macRecurrenceRules
                event.providerReadOnly = item.readOnly; event.providerSnapshot = item
                events.append(event)
            }
        }
        try store.replaceProviderSnapshot(calendars: calendars, events: events)
    }
}
