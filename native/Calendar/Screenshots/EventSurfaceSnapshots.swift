#if DEBUG
import SwiftUI
import EventKit

struct EventSurfaceSnapshots: View {
    var body: some View {
        Text("Rendering event surface snapshots…").task { render() }
    }

    @MainActor private func render() {
        WidgetSelectionRegressionTests.run()
        let store = EKEventStore() // In-memory fixture only; never request access or save.
        let start = Date(timeIntervalSince1970: 1788953400)
        let event = EKEvent(eventStore: store)
        event.title = "Product Launch Planning"
        event.startDate = start
        event.endDate = start.addingTimeInterval(5400)
        event.location = "Apple Park Visitor Center, Cupertino"
        let calendar = EKCalendar(for: .event, eventStore: store)
        calendar.title = "Work"
        calendar.cgColor = UIColor.systemBlue.cgColor
        event.calendar = calendar
        let descriptor = EKMultiDayWrapper(realEvent: event)
        let url = URL(string: "cloudcalendars://shared-event?title=Product%20Launch%20Planning&start=\(start.timeIntervalSince1970)&end=\(event.endDate.timeIntervalSince1970)&location=Apple%20Park%20Visitor%20Center%2C%20Cupertino&color=%230A84FF&timeZone=Europe%2FSofia")!
        let payload = SharedEventImportPayload(url: url)!
        for theme in [ColorScheme.light, .dark] {
            EventSurfaceSnapshotSupport.save("app-list", theme: theme,
                view: EventRowView(event: descriptor, timeString: { appTimeFormatter().string(from: $0) }).padding(16))
            EventSurfaceSnapshotSupport.save("app-search", theme: theme,
                view: SearchEventRowView(event: descriptor).padding(16))
            EventSurfaceSnapshotSupport.save("app-month", theme: theme,
                view: HStack(spacing: 1) {
                    ForEach(0..<7) { index in
                        DayCellView(day: start.addingTimeInterval(Double(index) * 86400), currentMonth: start,
                            events: index == 1 || index == 4 ? [descriptor] : [], onEventDropped: {_,_ in},
                            onDayTap: {_ in}, onDayLongPress: {_ in}, onEventTap: {_ in})
                    }
                }.frame(height: 115).padding(8))
            EventSurfaceSnapshotSupport.save("app-import", theme: theme,
                view: SharedEventImportView(payload: payload).eventSurfacePreview.padding(22))
            EventSurfaceSnapshotSupport.save("app-sharing", theme: theme,
                view: SharingSheetView().eventSurfaceSharedRow(start: start).padding(16))
            EventSurfaceSnapshotSupport.save("app-pending-invitation", theme: theme,
                view: SharingSheetView().eventSurfacePendingRow(start: start, url: url).padding(16))
            EventSurfaceSnapshotSupport.save("edge-cases", theme: theme, view: VStack(spacing: 10) {
                CalendarEventCard(title: "Thirty-minute planning review", color: .orange, timeText: "10:00 AM – 10:30 AM", isRecurring: true)
                CalendarEventCard(title: "Multi-day conference with a long event title", color: .purple,
                    timeText: "9/9 10:30 AM – 9/11 10:30 AM", location: "Sofia Expo Center")
                CalendarEventCard(title: "Cancelled review", color: .red, timeText: "2:00 PM – 3:00 PM", isCancelled: true)
                CalendarEventCard(title: "All-day workshop", color: .green, timeText: "All-day", isAllDay: true)
                CalendarEventCard(title: "اجتماع التخطيط لإطلاق المنتج", color: .blue,
                    timeText: "١٠:٣٠ ص – ١٢:٠٠ م", location: "مركز الزوار في آبل بارك")
                    .environment(\.layoutDirection, .rightToLeft)
            }.padding(16))
        }
        EventSurfaceSnapshotSupport.finish()
    }
}
#endif
