#if os(macOS)
import Foundation

@MainActor
enum MacCalendarLaunch {
    static func makeStore() -> MacTabletCalendarStore {
        #if DEBUG
        // Only the separately signed, disposable QA app can enter this path.
        // The shipping bundle cannot seed calendars or read QA documents.
        if Bundle.main.bundleIdentifier == "Deksan.CalendarASD.MacInteractionQA" {
            let directory = FileManager.default.temporaryDirectory.appendingPathComponent("HRApp-Mac-InteractionQA-" + UUID().uuidString)
            let backend = CalendarMacStore(directory: directory, loadsAccount: false)
            let calendar = Calendar.current
            let start = calendar.date(bySettingHour: calendar.component(.hour, from: Date()), minute: 0, second: 0, of: Date())!
            let event = DeviceCalendarEvent(id: "interaction-qa", title: "Interaction QA", start: DeviceCalendarEvent.iso(start), end: DeviceCalendarEvent.iso(start.addingTimeInterval(3600)), allDay: false)
            backend.local = [DeviceCalendarDocument(id: "qa-calendar", deviceId: "qa", deviceName: "QA", title: "Interaction QA", source: "Local Calendars", color: "#30B64B", allowsChanges: true, events: [event])]
            backend.reload()
            return MacTabletCalendarStore(local: MacAppLocalCalendarBridge(backend: backend), includesSystemCalendars: false)
        }
        #endif
        return MacTabletCalendarStore()
    }
}
#endif
