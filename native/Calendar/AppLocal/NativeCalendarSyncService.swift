import Foundation
import EventKit
import UIKit

@MainActor
enum NativeCalendarSyncService {
    private static var syncing = false
    @discardableResult
    static func syncNow() async -> Bool {
        guard !syncing, let session = CalendarFeedSession.existing else { return false }
        syncing = true
        defer { syncing = false }
        let vm = CalendarViewModel.shared, local = AppLocalCalendarStore.shared
        local.retirePersonalCloudCalendars()
        let replica = DeviceCalendarReplica(baseURL: CloudCalendarsAPI.baseURL, token: session.deviceToken, accountID: session.calendarId)
        let adapter = DeviceEventKitAdapter(store: vm.eventStore)
        var succeeded = false
        if EKEventStore.authorizationStatus(for: .event) == .fullAccess {
            for calendar in vm.eventStore.calendars(for: .event) {
                do {
                    let original = adapter.events(in: calendar)
                    let id = DeviceCalendarReplica.calendarID(calendar.calendarIdentifier)
                    var items = original.map(adapter.snapshot)
                    // Keep events outside the device query window; absence there is not a deletion.
                    let now = Date(), c = Calendar.current
                    let start = c.date(byAdding: .year, value: -1, to: now)!, end = c.date(byAdding: .year, value: 2, to: now)!
                    items += (replica.baseline(id)?.events ?? []).filter { $0.endDate < start || $0.startDate > end }
                    let doc = DeviceCalendarDocument(id: id, deviceId: DeviceCalendarReplica.deviceID, deviceName: UIDevice.current.name,
                        title: calendar.title, source: calendar.source.title,
                        color: AppLocalCalendarStore.colorHex(calendar.cgColor.map(UIColor.init(cgColor:)) ?? .systemBlue),
                        allowsChanges: calendar.allowsContentModifications, events: items)
                    try await replica.sync(doc) { result in
                        guard CalendarFeedSession.existing?.calendarId == session.calendarId else { throw CancellationError() }
                        try adapter.apply(result, calendar: calendar, original: original, base: replica.baseline(id)?.events ?? [])
                    }
                    succeeded = true
                } catch { print("Calendar web sync: \(error.localizedDescription)") }
            }
        }
        for calendar in local.calendars where !calendar.isPersonalCloud && !calendar.isRevoked {
            do {
                let originals = local.events.filter { $0.calendarID == calendar.id }
                let items = try originals.map { record -> DeviceCalendarEvent in
                    let details = SharedEventDetails(notes: record.notes, timeZone: record.timeZoneIdentifier,
                        alarms: record.alarms.map { SharedEventAlarm(relativeOffset: $0.relativeOffset) },
                        recurrenceRules: record.recurrenceRules ?? [], structuredLocation: record.structuredLocation,
                        videoCallURL: record.videoCallURL, travelTime: record.travelTime, attachments: record.attachments?.map(\.sharedValue))
                    return DeviceCalendarEvent(id: record.shareID, title: record.title, start: DeviceCalendarEvent.iso(record.startDate), end: DeviceCalendarEvent.iso(record.endDate),
                        allDay: record.isAllDay, location: record.location, url: record.urlString, details: try CalendarJSON.object(encoding: details))
                }
                let id = DeviceCalendarReplica.calendarID(calendar.id)
                let doc = DeviceCalendarDocument(id: id, deviceId: DeviceCalendarReplica.deviceID, deviceName: UIDevice.current.name,
                    title: calendar.title, source: calendar.origin == .received ? NSLocalizedString("Shared with me", comment: "") : NSLocalizedString("Local Calendars", comment: ""),
                    color: calendar.displayColorHex, allowsChanges: calendar.canEditEvents, events: items)
                try await replica.sync(doc) { result in
                    guard CalendarFeedSession.existing?.calendarId == session.calendarId else { throw CancellationError() }
                    guard calendar.canEditEvents else { return }
                    let remoteIDs = Set(result.map(\.id)), baseIDs = Set(replica.baseline(id)?.events.map(\.id) ?? [])
                    for old in originals where baseIDs.contains(old.shareID) && !remoteIDs.contains(old.shareID) { try local.deleteTransferredEvent(id: old.id) }
                    for item in result {
                        if items.first(where: { $0.id == item.id })?.content == item.content { continue }
                        var event = originals.first { $0.shareID == item.id } ?? AppLocalEventRecord(calendarID: calendar.id, title: item.title, startDate: item.startDate, endDate: item.endDate, remoteEventID: item.id)
                        event.title = item.title; event.startDate = item.startDate; event.endDate = item.endDate; event.isAllDay = item.allDay
                        event.location = item.location ?? ""; event.urlString = item.url ?? ""
                        if let details = item.details {
                            let decoded = try JSONDecoder().decode(SharedEventDetails.self, from: JSONEncoder().encode(details))
                            event.notes = decoded.notes ?? ""; event.timeZoneIdentifier = decoded.timeZone ?? calendar.timeZoneIdentifier
                            event.alarms = decoded.alarms.compactMap { $0.relativeOffset.map { AppLocalEventAlarm(relativeOffset: $0) } }
                            event.recurrenceRules = decoded.recurrenceRules; event.videoCallURL = decoded.videoCallURL
                            event.travelTime = decoded.travelTime; event.structuredLocation = decoded.structuredLocation
                            event.attachments = decoded.attachments?.map(AppLocalEventAttachment.init)
                        }
                        try local.saveTransferredEvent(event)
                    }
                }
                succeeded = true
            } catch { print("Local calendar web sync: \(error.localizedDescription)") }
        }
        if EKEventStore.authorizationStatus(for: .event) == .fullAccess {
            let ids = vm.eventStore.calendars(for: .event).map(\.calendarIdentifier)
                + local.calendars.filter { !$0.isPersonalCloud && !$0.isRevoked }.map(\.id)
            do { try await replica.hideMissingCalendars(keeping: Set(ids.map(DeviceCalendarReplica.calendarID))) }
            catch { print("Calendar inventory sync: \(error.localizedDescription)") }
        }
        if succeeded { vm.reloadCalendars(); EventNotificationManager.shared.rescheduleUpcomingEventNotifications() }
        return succeeded
    }
}
