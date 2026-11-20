#if os(macOS)
import Foundation

extension CalendarMacStore: AccountLocalCalendarStorage {
    func accountLocalDocuments() throws -> [DeviceCalendarDocument] {
        try local.filter { !$0.isReceivedSharedCalendar && !$0.id.hasPrefix("provider-") && $0.available }.map { document in
            var value = document
            value.events = try document.events.map(MacCalendarSharingMerge.wireSnapshot)
            // Read-only received event copies remain read-only on every device.
            for index in value.events.indices {
                value.events[index].readOnly = document.events[index].readOnly
                value.events[index].status = document.events[index].status
            }
            value.sharingCalendarID = try ownedSharing.shareID(localID: document.id) ?? document.sharingCalendarID
            return value
        }
    }
    func applyAccountLocalDocument(_ document: DeviceCalendarDocument, localID: String?) throws -> String {
        let id = localID ?? "app-local:account:" + document.id
        let existing = local.first { $0.id == id }
        var value = document
        value.id = id; value.source = "Local Calendars"; value.accountLocal = nil
        value.events = MacCalendarSharingMerge.restoringLocalIDs(document.events, matching: existing?.events ?? [])
        var documents = local
        if let index = documents.firstIndex(where: { $0.id == id }) { documents[index] = value }
        else { documents.append(value); selection.insert(id) }
        try applyProviderDocuments(documents)
        return id
    }
    func removeAccountLocalDocument(localID: String) throws {
        try applyProviderDocuments(local.filter { $0.id != localID })
        selection.remove(localID)
    }
}
#endif
