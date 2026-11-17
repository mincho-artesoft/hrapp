#if os(macOS)
import SwiftUI
import AppKit
import EventKit
import Combine

// The imported Wonek views consume EventKit values. This bridge adapts HRApp's
// existing local documents without creating calendars in the user's accounts.
struct AppLocalEventAttachment: Codable, Equatable, Identifiable {
    var id: String = UUID().uuidString.lowercased()
    var fileName: String
    var contentType: String?
    var dataBase64: String
}

extension DeviceCalendarDocument {
    enum Origin { case owned, received }
    var origin: Origin { isReceivedSharedCalendar ? .received : .owned }
    var canManageSharing: Bool { available && allowsChanges && (origin == .owned || sharing?.access == "owner") }
    var canEditEvents: Bool { allowsChanges && available }
    var localColorOverrideHex: String? { sharing?.localColorOverride }
    var displayColorHex: String { localColorOverrideHex ?? color }
    var colorHex: String { color }
}

struct CalendarTimelineScrollRequest: Equatable {
    let id = UUID()
    let date: Date
    func offset(hourHeight: CGFloat, viewportHeight: CGFloat, calendar: Calendar = .current) -> CGFloat {
        let components = calendar.dateComponents([.hour, .minute], from: date)
        return max(0, 10 + (CGFloat(components.hour ?? 0) + CGFloat(components.minute ?? 0) / 60) * hourHeight - viewportHeight / 2)
    }
}

@MainActor
final class MacLocalDocuments {
    let backend: CalendarMacStore
    init(backend: CalendarMacStore) { self.backend = backend }
    var calendars: [DeviceCalendarDocument] { backend.local }
    var ownedCalendars: [DeviceCalendarDocument] { calendars.filter { $0.available && $0.origin == .owned } }
    var receivedCalendars: [DeviceCalendarDocument] { calendars.filter { $0.available && $0.origin == .received } }
    func events(from start: Date, to end: Date, selectedCalendarIDs: Set<String>) -> [DeviceCalendarEvent] {
        calendars.filter { $0.available && selectedCalendarIDs.contains($0.id) }.flatMap(\.events).flatMap { AppLocalRecurrence.occurrences(of: $0, from: start, to: end) }
    }
    func createCalendar(title: String, color: NSColor) throws -> DeviceCalendarDocument {
        let record = DeviceCalendarDocument(id: UUID().uuidString.lowercased(), deviceId: DeviceCalendarReplica.deviceID,
            deviceName: Host.current().localizedName ?? "Mac", title: title, source: "Local Calendars", color: color.hex, allowsChanges: true, events: [])
        try backend.replaceLocalCalendars(calendars + [record])
        return record
    }
    func updateCalendar(id: String, title: String, color: NSColor) throws {
        var records = calendars
        guard let index = records.firstIndex(where: { $0.id == id }) else { return }
        records[index].title = title; records[index].color = color.hex
        try backend.replaceLocalCalendars(records)
    }
    func removeCalendar(id: String) throws {
        try backend.replaceLocalCalendars(calendars.filter { $0.id != id })
    }
    static func color(_ hex: String) -> NSColor { NSColor(Color(hex: hex)) }
}

@MainActor
final class MacAppLocalCalendarBridge {
    static let shared = MacAppLocalCalendarBridge(backend: CalendarMacStore())
    let store: MacLocalDocuments
    let eventStore: EKEventStore
    private var calendarsByID: [String: EKCalendar] = [:]
    private var eventsByID: [String: EKEvent] = [:]
    private var eventSnapshots: [String: DeviceCalendarEvent] = [:]
    private var indexedDocuments: [DeviceCalendarDocument] = []
    private var sourcesByEventID: [String: DeviceCalendarDocument] = [:]
    private var recordsByID: [String: DeviceCalendarEvent] = [:]
    private func refreshIndex() {
        guard indexedDocuments != store.calendars else { return }
        indexedDocuments = store.calendars
        sourcesByEventID.removeAll(keepingCapacity: true); recordsByID.removeAll(keepingCapacity: true)
        for document in indexedDocuments {
            for event in document.events { sourcesByEventID[event.id] = document; recordsByID[event.id] = event }
        }
    }
    func prepareSnapshot() { refreshIndex() }
    private var calendarIDs: [String: String] = [:]
    private var eventIDs: [String: String] = [:]
    init(backend: CalendarMacStore) { store = MacLocalDocuments(backend: backend); eventStore = backend.eventStore }
    func record(for calendar: EKCalendar) -> DeviceCalendarDocument? {
        calendarIDs[calendar.calendarIdentifier].flatMap { id in store.calendars.first { $0.id == id } }
    }
    func record(for event: EKEvent) -> DeviceCalendarEvent? {
        guard let id = eventIDs[event.calendarItemIdentifier], let calendar = record(for: event.calendar) else { return nil }
        return calendar.events.first { $0.id == id }
    }
    func isLocal(_ calendar: EKCalendar) -> Bool { calendarIDs[calendar.calendarIdentifier] != nil }
    func isLocal(_ event: EKEvent) -> Bool { eventIDs[event.calendarItemIdentifier] != nil }
    func canEdit(_ calendar: EKCalendar?) -> Bool {
        guard let calendar else { return false }
        return isLocal(calendar) ? record(for: calendar)?.canEditEvents == true : calendar.allowsContentModifications
    }
    func calendar(_ record: DeviceCalendarDocument) -> EKCalendar {
        let value = calendarsByID[record.id] ?? EKCalendar(for: .event, eventStore: eventStore)
        if value.title != record.title { value.title = record.title }
        let color = MacLocalDocuments.color(record.displayColorHex).cgColor
        if value.cgColor != color { value.cgColor = color }
        calendarsByID[record.id] = value; calendarIDs[value.calendarIdentifier] = record.id
        return value
    }
    func event(_ record: DeviceCalendarEvent) -> EKEvent? {
        // prepareSnapshot builds this once for the whole reload, avoiding a scan
        // of all calendars and events for every expanded recurrence.
        if sourcesByEventID[record.id] == nil { refreshIndex() }
        guard let source = sourcesByEventID[record.id] else { return nil }
        let anchor = recordsByID[record.id]
        let displayID = anchor?.startDate == record.startDate ? record.id : record.id + ":" + record.start
        let value = eventsByID[displayID] ?? EKEvent(eventStore: eventStore)
        let destination = calendar(source)
        if eventSnapshots[displayID] == record, value.calendar === destination { return value }
        eventSnapshots[displayID] = record
        value.calendar = destination; value.title = record.title
        value.startDate = record.startDate; value.endDate = record.endDate; value.isAllDay = record.allDay
        value.location = record.location; value.notes = record.details?["notes"]?.string
        value.url = record.url.flatMap(URL.init(string:)); value.timeZone = record.details?["timeZone"]?.string.flatMap(TimeZone.init(identifier:))
        let alarms: [SharedEventAlarm] = record.decodedDetail("alarms") ?? []
        value.alarms = alarms.compactMap { $0.makeAlarm() }
        value.recurrenceRules = record.macRecurrenceRules.compactMap { $0.makeRule() }
        let location: SharedEventLocation? = record.decodedDetail("structuredLocation")
        value.structuredLocation = location?.makeLocation(title: record.location)
        eventsByID[displayID] = value; eventIDs[value.calendarItemIdentifier] = record.id
        return value
    }
    func refreshedEvent(_ value: EKEvent) -> EKEvent? {
        guard let record = record(for: value), let start = value.startDate else { return nil }
        return event(AppLocalRecurrence.occurrences(of: record, from: start, to: start.addingTimeInterval(1)).first ?? record)
    }
    func supplement(for event: EKEvent) -> EventKitEventSupplement? {
        guard let record = record(for: event) else { return EventKitEventSupplementStore.supplement(for: event) }
        let attachments: [AppLocalEventAttachment] = record.details?["attachments"].flatMap { value in
            (try? JSONEncoder().encode(value)).flatMap { try? JSONDecoder().decode([AppLocalEventAttachment].self, from: $0) }
        } ?? []
        return .init(travelTime: record.details?["travelTime"]?.number, attachments: attachments, videoCallURL: record.details?["videoCallURL"]?.string)
    }
    func copy(_ source: EKEvent) -> EKEvent {
        let value = EKEvent(eventStore: eventStore)
        value.calendar = source.calendar; value.title = source.title; value.startDate = source.startDate; value.endDate = source.endDate
        value.isAllDay = source.isAllDay; value.location = source.location; value.structuredLocation = source.structuredLocation
        value.notes = source.notes; value.url = source.url; value.timeZone = source.timeZone; value.alarms = source.alarms
        value.recurrenceRules = source.recurrenceRules; value.availability = source.availability
        return value
    }
    @discardableResult
    func persist(_ draft: EKEvent, replacing original: EKEvent?, span: EKSpan, supplement: EventKitEventSupplement? = nil) throws -> EKEvent {
        guard canEdit(draft.calendar), original == nil || canEdit(original?.calendar) else { throw MacTabletCalendarError.readOnlyEvent }
        let metadata = supplement ?? original.flatMap(self.supplement)
        if let destination = record(for: draft.calendar) {
            let old = original.flatMap { record(for: $0) }
            var item = old ?? DeviceCalendarEvent(id: UUID().uuidString.lowercased(), title: "", start: "", end: "", allDay: false)
            item.title = draft.title ?? ""; item.start = DeviceCalendarEvent.iso(draft.startDate); item.end = DeviceCalendarEvent.iso(draft.endDate)
            item.allDay = draft.isAllDay; item.location = draft.location; item.url = draft.url?.absoluteString
            var details = item.details ?? [:]
            details["availability"] = .number(Double(draft.availability.rawValue))
            details["attendees"] = details["attendees"] ?? .array([])
            details["notes"] = .string(draft.notes ?? ""); details["timeZone"] = .string(draft.timeZone?.identifier ?? TimeZone.current.identifier)
            details["alarms"] = .array(try (draft.alarms ?? []).map { .object(try CalendarJSON.object(encoding: SharedEventAlarm(alarm: $0))) })
            let rules = (old != nil || original == nil || span == .futureEvents) ? draft.recurrenceRules ?? [] : []
            details["recurrenceRules"] = .array(try rules.map { .object(try CalendarJSON.object(encoding: SharedEventRecurrenceRule(rule: $0))) })
            if let location = draft.structuredLocation {
                details["structuredLocation"] = .object(try CalendarJSON.object(encoding: SharedEventLocation(location: location)))
            } else { details.removeValue(forKey: "structuredLocation") }
            if let old, let original, !old.macRecurrenceRules.isEmpty {
                let anchor = old.startDate.addingTimeInterval(draft.startDate.timeIntervalSince(original.startDate))
                item.start = DeviceCalendarEvent.iso(anchor)
                item.end = DeviceCalendarEvent.iso(anchor.addingTimeInterval(draft.endDate.timeIntervalSince(draft.startDate)))
            }
            if let metadata { details.merge(try CalendarJSON.object(encoding: metadata)) { _, new in new } }
            item.details = details
            var documents = store.calendars
            if let original, let source = record(for: original.calendar), let old {
                for index in documents.indices where documents[index].id == source.id { documents[index].events.removeAll { $0.id == old.id } }
            }
            guard let index = documents.firstIndex(where: { $0.id == destination.id }) else { throw MacTabletCalendarError.noWritableCalendar }
            documents[index].events.removeAll { $0.id == item.id }; documents[index].events.append(item)
            try store.backend.replaceLocalCalendars(documents)
            if let original, !isLocal(original) {
                do { try eventStore.remove(original, span: span, commit: true) }
                catch { try store.backend.replaceLocalCalendars(store.calendars.map { document in
                    var copy = document; copy.events.removeAll { $0.id == item.id }; return copy
                }); throw error }
            }
            var display = item
            if old != nil && !item.macRecurrenceRules.isEmpty { display.start = DeviceCalendarEvent.iso(draft.startDate); display.end = DeviceCalendarEvent.iso(draft.endDate) }
            prepareSnapshot()
            return event(display) ?? draft
        }
        try eventStore.save(draft, span: span, commit: true)
        if let metadata { EventKitEventSupplementStore.update(travelTime: metadata.travelTime, attachments: metadata.attachments, videoCallURL: metadata.videoCallURL, for: draft) }
        if let original, isLocal(original) {
            do { try delete(original, span: span) }
            catch { try eventStore.remove(draft, span: .futureEvents, commit: true); EventKitEventSupplementStore.remove(for: draft); throw error }
        }
        store.backend.reload()
        return draft
    }
    func delete(_ event: EKEvent, span: EKSpan) throws {
        guard canEdit(event.calendar) else { throw MacTabletCalendarError.readOnlyEvent }
        if let item = record(for: event), let source = record(for: event.calendar) {
            var documents = store.calendars
            for index in documents.indices where documents[index].id == source.id { documents[index].events.removeAll { $0.id == item.id } }
            try store.backend.replaceLocalCalendars(documents)
        } else { try eventStore.remove(event, span: span, commit: true); store.backend.reload() }
    }
}

#endif
