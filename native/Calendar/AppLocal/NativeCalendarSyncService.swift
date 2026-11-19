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
        do { try await AccountLocalCalendarSync.sync(storage: AppLocalAccountCalendarStorage.shared); succeeded = true }
        catch { print("Account local calendar sync: \(error.localizedDescription)") }
        if EKEventStore.authorizationStatus(for: .event) == .fullAccess {
            for calendar in vm.eventStore.calendars(for: .event) where !SharedICloudCalendarLocalStore.allLocalCalendarIdentifiers.contains(calendar.calendarIdentifier) && !vm.hiddenLegacyProviderCalendarIDs.contains(calendar.calendarIdentifier) {
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
                        allowsChanges: calendar.allowsContentModifications, events: items,
                        eventKitKind: calendar.type == .birthday ? "birthdays" : "regular")
                    try await replica.sync(doc) { result in
                        guard CalendarFeedSession.existing?.calendarId == session.calendarId else { throw CancellationError() }
                        let latest = adapter.events(in: calendar)
                        let retained = DeviceCalendarReplica.merge(base: items, local: result, remote: latest.map(adapter.snapshot))
                        try adapter.apply(retained, calendar: calendar, original: latest, base: replica.baseline(id)?.events ?? [])
                    }
                    succeeded = true
                } catch { print("Calendar web sync: \(error.localizedDescription)") }
            }
        }
        for calendar in local.calendars where calendar.origin == .owned && calendar.isProvider && !calendar.isRevoked {
            do {
                let originals = local.events.filter { $0.calendarID == calendar.id }
                let items = try originals.map(snapshot)
                let id = DeviceCalendarReplica.calendarID(calendar.id)
                let source = calendar.providerSource ?? NSLocalizedString("Local Calendars", comment: "")
                let remoteID = AppLocalProviderCalendarStore.shared.engine.remoteCalendarID(for: calendar.id)
                let doc = DeviceCalendarDocument(id: id, deviceId: DeviceCalendarReplica.deviceID, deviceName: UIDevice.current.name,
                    title: calendar.title, source: source,
                    color: calendar.displayColorHex, allowsChanges: calendar.canEditEvents, events: items)
                    .withProviderMirrorID(remoteID.map { DeviceCalendarReplica.hash(source.lowercased() + ":" + $0) })
                try await replica.sync(doc) { result in
                    guard CalendarFeedSession.existing?.calendarId == session.calendarId else { throw CancellationError() }
                    guard calendar.canEditEvents else { return }
                    let latest = local.events.filter { $0.calendarID == calendar.id }
                    let retained = DeviceCalendarReplica.merge(base: items, local: result, remote: try latest.map(snapshot))
                    let remoteIDs = Set(retained.map(\.id)), baseIDs = Set(replica.baseline(id)?.events.map(\.id) ?? [])
                    for old in latest where baseIDs.contains(old.shareID) && !remoteIDs.contains(old.shareID) { try local.deleteTransferredEvent(id: old.id) }
                    for item in retained {
                        if try latest.first(where: { $0.shareID == item.id }).map(snapshot)?.content == item.content { continue }
                        var event = latest.first { $0.shareID == item.id } ?? AppLocalEventRecord(calendarID: calendar.id, title: item.title, startDate: item.startDate, endDate: item.endDate, remoteEventID: item.id)
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
            let ids = vm.eventStore.calendars(for: .event).filter { !SharedICloudCalendarLocalStore.allLocalCalendarIdentifiers.contains($0.calendarIdentifier) && !vm.hiddenLegacyProviderCalendarIDs.contains($0.calendarIdentifier) }.map(\.calendarIdentifier)
                + local.calendars.filter { $0.origin == .owned && !$0.isPersonalCloud && !$0.isRevoked }.map(\.id)
            do { try await replica.hideMissingCalendars(keeping: Set(ids.map(DeviceCalendarReplica.calendarID))) }
            catch { print("Calendar inventory sync: \(error.localizedDescription)") }
        }
        let receivedIDs = SharedICloudCalendarLocalStore.allLocalCalendarIdentifiers.union(local.receivedCalendars.map(\.id))
        do { try await replica.hideCalendars(Set(receivedIDs.union(local.ownedCalendars.map(\.id)).map(DeviceCalendarReplica.calendarID))) }
        catch { print("Received calendar replica retirement: \(error.localizedDescription)") }
        if succeeded { vm.reloadCalendars(); EventNotificationManager.shared.rescheduleUpcomingEventNotifications() }
        return succeeded
    }
    static func snapshot(_ record: AppLocalEventRecord) throws -> DeviceCalendarEvent {
        if record.providerSnapshot != nil || AppLocalCalendarStore.shared.calendar(id: record.calendarID)?.isProvider == true {
            var value = AppLocalProviderCalendarStore.snapshot(record); value.id = record.shareID; return value
        }
        return DeviceCalendarEvent(id: record.shareID, title: record.title, start: DeviceCalendarEvent.iso(record.startDate), end: DeviceCalendarEvent.iso(record.endDate),
            allDay: record.isAllDay, location: record.location, url: record.urlString, details: try CalendarJSON.object(encoding: record.portableDetails), readOnly: record.providerReadOnly)
    }

}
