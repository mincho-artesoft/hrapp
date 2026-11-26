#if os(iOS)
import Foundation
import UIKit

@MainActor
final class AppLocalAccountCalendarStorage: AccountLocalCalendarStorage {
    static let shared = AppLocalAccountCalendarStorage()
    private var store: AppLocalCalendarStore { .shared }
    func accountLocalDocuments(matching localID: String?) throws -> [DeviceCalendarDocument] {
        try store.ownedCalendars.filter {
            (localID == nil || $0.id == localID) && !$0.isPersonalCloud && !$0.isRevoked
        }.map { calendar in
            var document = DeviceCalendarDocument(id: calendar.id, deviceId: DeviceCalendarReplica.deviceID, deviceName: UIDevice.current.name,
                title: calendar.title, source: "Local Calendars", color: calendar.colorHex, allowsChanges: true,
                events: try store.events.filter { $0.calendarID == calendar.id }.map(NativeCalendarSyncService.snapshot))
            document.sharingCalendarID = calendar.remoteCalendarID
            return document
        }
    }
    func applyAccountLocalDocument(_ document: DeviceCalendarDocument, localID: String?) throws -> String {
        let id = localID ?? AccountLocalCalendarSync.importedPrefix + document.id
        var calendar = store.calendar(id: id) ?? AppLocalCalendarRecord(id: id, title: document.title, colorHex: document.color)
        calendar.title = document.title; calendar.colorHex = document.color
        calendar.remoteCalendarID = document.sharingCalendarID
        if store.calendar(id: id) != calendar { store.upsertCalendar(calendar) }
        let previous = store.events.filter { $0.calendarID == id }
        let retainedIDs = Set(document.events.map(\.id))
        for event in previous where !retainedIDs.contains(event.shareID) { try store.deleteTransferredEvent(id: event.id) }
        for item in document.events {
            if try previous.first(where: { $0.shareID == item.id }).map({ try AccountLocalCalendarSync.normalizedEvent(NativeCalendarSyncService.snapshot($0)) }) == AccountLocalCalendarSync.normalizedEvent(item) { continue }
            var event = previous.first { $0.shareID == item.id } ?? AppLocalEventRecord(calendarID: id, title: item.title, startDate: item.startDate, endDate: item.endDate, remoteEventID: item.id)
            event.title = item.title; event.startDate = item.startDate; event.endDate = item.endDate
            event.isAllDay = item.allDay; event.location = item.location ?? ""; event.urlString = item.url ?? ""
            event.providerReadOnly = item.readOnly
            event.isCancelled = item.status == "cancelled"
            event.applySharedDetails(try MacEventShareSnapshot.details(item))
            try store.saveTransferredEvent(event)
        }
        CalendarViewModel.shared.selectedCalendarIDs.insert(id)
        return id
    }
    func removeAccountLocalDocument(localID: String) throws { store.removeCalendar(id: localID) }
}

#endif
