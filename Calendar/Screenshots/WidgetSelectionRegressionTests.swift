#if DEBUG
import ActivityKit
import EventKit
import Foundation
import UIKit

/// Uses unsaved records only. No permission requests, cloud calls or seed writes.
@MainActor
enum WidgetSelectionRegressionTests {
    static func run() {
        let now = Date()
        let store = EKEventStore()
        let nativeCalendar = EKCalendar(for: .event, eventStore: store)
        nativeCalendar.title = "Work"
        nativeCalendar.cgColor = UIColor.systemBlue.cgColor
        let native = EKEvent(eventStore: store)
        native.title = "Native next event"
        native.calendar = nativeCalendar
        native.startDate = now.addingTimeInterval(7200)
        native.endDate = now.addingTimeInterval(10800)
        let localCalendar = AppLocalCalendarRecord(id: "app-local:widget-test", title: "Work", colorHex: "#FF9500")
        let local = AppLocalEventRecord(id: "app-local-event:widget-test", calendarID: localCalendar.id,
            title: "Local next event", startDate: now.addingTimeInterval(3600),
            endDate: now.addingTimeInterval(5400), location: "Local meeting room")
        var cancelled = local
        cancelled.id += "-cancelled"
        cancelled.isCancelled = true
        var allDay = local
        allDay.id += "-all-day"
        allDay.isAllDay = true
        var past = local
        past.id += "-past"
        past.startDate = now.addingTimeInterval(-7200)
        past.endDate = now.addingTimeInterval(-3600)
        var revokedCalendar = localCalendar
        revokedCalendar.id += "-revoked"
        revokedCalendar.revokedAt = now
        var revoked = local
        revoked.id += "-revoked"
        revoked.calendarID = revokedCalendar.id
        var later = local
        later.id += "-later"
        later.startDate = now.addingTimeInterval(14400)
        later.endDate = now.addingTimeInterval(18000)
        let localValues = [later, allDay, past, revoked, cancelled, local]
        let allIDs: Set<String> = [nativeCalendar.calendarIdentifier, localCalendar.id, revokedCalendar.id]
        var checks = 0
        func check(_ result: @autoclosure () -> Bool, _ message: String) {
            precondition(result(), message)
            checks += 1
        }
        func feed(_ ids: Set<String>, nativeEvents: [EKEvent] = [native], limit: Int = 25) -> [CalendarWidgetStore.UpcomingEventSnapshot] {
            CalendarWidgetStore.combineUpcomingEventSnapshots(nativeEvents: nativeEvents,
                localEvents: localValues, localCalendars: [localCalendar, revokedCalendar],
                selectedCalendarIDs: ids, now: now, limit: limit)
        }
        let combined = feed(allIDs)
        check(combined.map(\.title) == [local.title, native.title!, later.title], "Mixed source order/filtering")
        check(combined.first?.location == local.location, "Local event metadata")
        check(combined.first?.colorRed == 1, "Local calendar color")
        check(feed([localCalendar.id]).map(\.id) == [local.id, later.id], "Local-only selection")
        check(feed([nativeCalendar.calendarIdentifier]).map(\.title) == [native.title!], "Native-only selection")
        check(feed([]).isEmpty, "Explicit empty selection must not fall back to all")
        check(feed(["missing-id"]).isEmpty, "Missing calendar IDs")
        check(feed(allIDs, nativeEvents: []).map(\.id) == [local.id, later.id], "Local events survive absent/denied native source")
        check(feed(allIDs, limit: 1).map(\.id) == [local.id], "Limit applies after merging sources")
        check(feed(allIDs, limit: 0).isEmpty, "Zero limit")
        check(feed(allIDs, limit: -1).isEmpty, "Invalid limit is safe")
        check(feed([revokedCalendar.id]).isEmpty, "Revoked calendar excluded")
        check(nativeCalendar.title == localCalendar.title && combined.count == 3, "Same names do not merge calendar identity")
        let state = CalendarLiveActivityManager.makeContentState(from: combined)
        check(state.events.map(\.id) == combined.map(\.id), "Live Activity receives the same mixed-source feed")
        let localState = CalendarLiveActivityManager.makeContentState(from: feed([localCalendar.id]))
        check(localState.events.map(\.id) == [local.id, later.id], "Local-only Live Activity")
        check(CalendarLiveActivityManager.makeContentState(from: []).events.isEmpty, "Deselection clears Live Activity")
        let encoded = try! JSONEncoder().encode(state)
        check(encoded.count < 4096, "Activity content budget for ordinary events")
        let report: [String: Any] = ["status": "PASS", "checks": checks,
            "nativeAndLocalSameTitle": true, "localOnlyWithoutNativeAccess": true,
            "selectionAndLiveActivityParity": true]
        try! FileManager.default.createDirectory(at: EventSurfaceSnapshotSupport.directory, withIntermediateDirectories: true)
        try! JSONSerialization.data(withJSONObject: report, options: [.prettyPrinted, .sortedKeys])
            .write(to: EventSurfaceSnapshotSupport.directory.appendingPathComponent("widget-selection-tests.json"))
    }
}
#endif
