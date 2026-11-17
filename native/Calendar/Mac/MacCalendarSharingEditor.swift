#if os(macOS)
import SwiftUI
import EventKit

/// Present the actual iOS sharing flow, using the Mac store for event synchronization.
struct MacCalendarSharingEditor: View {
    @ObservedObject var store: MacTabletCalendarStore
    let calendar: EKCalendar

    private var localID: String { store.local.record(for: calendar)?.id ?? calendar.calendarIdentifier }
    private var shared: DeviceCalendarSharing? { store.local.record(for: calendar)?.sharing }
    private var shareID: String {
        shared?.calendarID ?? (try? store.backend.ownedSharing.shareID(localID: localID))
            ?? store.local.record(for: calendar)?.sharingCalendarID ?? DeviceCalendarReplica.hash(localID)
    }

    var body: some View {
        ICloudCalendarSharingView(calendarID: shareID, calendarTitle: calendar.title,
            calendarColor: NSColor(store.color(for: calendar)).hex, timeZone: TimeZone.current.identifier,
            localCalendarIdentifier: localID, calendarKind: shared?.calendarKind ?? (store.local.isLocal(calendar) ? "app_local" : "eventkit"),
            originalOwnerID: shared?.ownerID, originalOwnerEmail: shared?.ownerEmail,
            synchronizeCalendar: {
                if shared == nil { try await store.backend.ownedSharing.registerAndSync(localID: localID, shareID: shareID) }
                store.reload()
            })
            .calendarSharingSheetSize()
    }
}
#endif
