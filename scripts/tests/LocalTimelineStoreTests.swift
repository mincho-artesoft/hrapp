import UIKit
import EventKit

// Service doubles only: the actual on-disk local store and descriptors are
// compiled from production. This app has its own sandbox and no network code.
struct SharedEventRecurrenceRule: Codable, Equatable {
    var frequency: Int; var interval: Int
    init(rule: EKRecurrenceRule) { frequency = rule.frequency.rawValue; interval = rule.interval }
    func makeRule() -> EKRecurrenceRule? {
        EKRecurrenceFrequency(rawValue: frequency).map { EKRecurrenceRule(recurrenceWith: $0, interval: interval, end: nil) }
    }
}
struct SharedEventLocation: Codable, Equatable {
    var title: String
    init(location: EKStructuredLocation) { title = location.title ?? "" }
    func makeLocation(title: String) -> EKStructuredLocation { EKStructuredLocation(title: title) }
}
struct SharedEventDetails {
    var travelTime: Double?; var attachments: [SharedEventAttachment]?; var videoCallURL: String?
}
struct SharedEventAttachment: Codable, Equatable {
    var id: String; var fileName: String; var contentType: String?; var dataBase64: String
}
enum CloudCalendarsAPI {
    enum EventAccess: String, Codable { case owner, writer, reader }
    struct Alarm { var relativeOffset: Double? }
    struct Details {
        var notes: String?; var videoCallURL: String?; var timeZone: String?
        var alarms: [Alarm]?; var travelTime: Double?
        var recurrenceRules: [SharedEventRecurrenceRule]?
        var structuredLocation: SharedEventLocation?; var attachments: [SharedEventAttachment]?
    }
    struct RemoteEvent {
        var id: String; var title: String; var startDate: Date?; var endDate: Date?
        var allDay: Bool; var location: String?; var url: String?; var details: Details?
    }
    struct SharedICloudCalendar {
        var calendarKind: String; var ownerId: String; var calendarId: String
        var id: String; var title: String; var color: String; var timeZone: String
        var updatedAt: String?; var ownerEmail: String?; var access: EventAccess
        var revokedAt: String?; var revokedReason: String?; var events: [RemoteEvent]?
        var eventsUpdatedAt: String?; var isRevoked: Bool
    }
}
@MainActor final class CalendarViewModel {
    static let shared = CalendarViewModel()
    var selectedCalendarIDs = Set<String>()
}
enum EventNotificationManager {
    static let shared = EventNotificationManagerProxy()
}
struct EventNotificationManagerProxy { func rescheduleUpcomingEventNotifications() {} }
enum SharedEventSyncManager { static func eventStoreDidChange() {} }
enum SharedInviteTracker {
    static func isReadOnly(_ event: EKEvent) -> Bool { !event.calendar.allowsContentModifications }
    static func localEventWasDeleted(localEventIdentifier: String) {}
}
final class FailingRemovalStore: EKEventStore {
    override func remove(_ event: EKEvent, span: EKSpan, commit: Bool) throws {
        throw NSError(domain: "InjectedRemovalFailure", code: 1)
    }
}
final class FailingSaveStore: EKEventStore {
    override func save(_ event: EKEvent, span: EKSpan, commit: Bool) throws {
        throw NSError(domain: "InjectedSaveFailure", code: 1)
    }
}

@main final class LocalStoreTestApp: UIResponder, UIApplicationDelegate {
    var window: UIWindow?
    func application(_ app: UIApplication, didFinishLaunchingWithOptions options: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        window = UIWindow(frame: UIScreen.main.bounds)
        window?.rootViewController = UIViewController(); window?.makeKeyAndVisible()
        do {
            let count = try runTests() + runTransferTests()
            try write(["status": "PASS", "checks": count])
        } catch { try? write(["status": "FAIL", "error": error.localizedDescription]) }
        return true
    }
    func runTransferTests() throws -> Int {
        var checks = 0
        func check(_ result: Bool, _ description: String) throws {
            guard result else { throw NSError(domain: "TransferTests", code: 1, userInfo: [NSLocalizedDescriptionKey: description]) }
            checks += 1
        }
        let eventStore = EKEventStore()
        let nativeCalendar = EKCalendar(for: .event, eventStore: eventStore)
        nativeCalendar.title = "HRApp Transfer Regression " + UUID().uuidString
        nativeCalendar.source = eventStore.sources.first { $0.sourceType == .local }
        guard nativeCalendar.source != nil else { throw NSError(domain: "NoIndependentTestSource", code: 1) }
        try eventStore.saveCalendar(nativeCalendar, commit: true)
        defer { try? eventStore.removeCalendar(nativeCalendar, commit: true) }
        let store = AppLocalCalendarStore.shared
        let localCalendar = store.createCalendar(title: "Team", color: .orange)
        let start = Calendar.current.startOfDay(for: Date()).addingTimeInterval(10 * 3600)
        let original = AppLocalEventRecord(calendarID: localCalendar.id, title: "Transfer metadata",
            startDate: start, endDate: start.addingTimeInterval(51 * 3600),
            location: "Sofia", notes: "Preserve notes", urlString: "https://example.com/event",
            videoCallURL: "https://example.com/call", timeZoneIdentifier: "Europe/Sofia",
            alarms: [.init(relativeOffset: -600), .init(relativeOffset: -1800)], travelTime: 900,
            structuredLocation: .init(location: EKStructuredLocation(title: "Sofia")),
            attachments: [.init(fileName: "test.txt", contentType: "text/plain", dataBase64: "dGVzdA==")])
        store.saveEvent(original)
        let local = AppLocalEventDescriptor(eventID: original.id, partialStart: start.addingTimeInterval(1800),
            partialEnd: original.endDate.addingTimeInterval(1800))
        local.pendingCalendarID = nativeCalendar.calendarIdentifier
        do {
            try CalendarTimelineTransfer.move(local: local, to: nativeCalendar, eventStore: FailingSaveStore(), isResize: false)
            throw NSError(domain: "ExpectedSaveFailure", code: 1)
        } catch { try check(store.event(id: original.id) != nil, "Failed destination save deleted source") }
        try CalendarTimelineTransfer.move(local: local, to: nativeCalendar, eventStore: eventStore, isResize: false)
        try check(store.event(id: original.id) == nil, "Local source survived successful move")
        let predicate = eventStore.predicateForEvents(withStart: start, end: original.endDate.addingTimeInterval(7200), calendars: [nativeCalendar])
        let saved = eventStore.events(matching: predicate)
        try check(saved.count == 1, "Move created duplicate or missing native events")
        let native = saved[0]
        try check(native.startDate == local.dateInterval.start && native.endDate == local.dateInterval.end, "Move lost start/duration")
        try check(native.title == original.title && native.notes == original.notes && native.location == original.location, "Move lost text fields")
        try check(Set((native.alarms ?? []).map(\.relativeOffset)) == Set(original.alarms.map(\.relativeOffset)), "Move lost alarms")
        try check(native.timeZone?.identifier == original.timeZoneIdentifier && native.url?.absoluteString == original.urlString, "Move lost zone/URL")
        let extra = EventKitEventSupplementStore.supplement(for: native)
        try check(extra?.attachments == original.attachments && extra?.travelTime == original.travelTime && extra?.videoCallURL == original.videoCallURL, "Move lost supplements")
        let wrapped = EKMultiDayWrapper(realEvent: native)
        wrapped.dateInterval = DateInterval(start: native.startDate.addingTimeInterval(600), end: native.endDate.addingTimeInterval(600))
        let before = store.events.count
        do {
            try CalendarTimelineTransfer.move(system: wrapped, to: localCalendar, eventStore: FailingRemovalStore(), span: .thisEvent)
            throw NSError(domain: "ExpectedRemovalFailure", code: 1)
        } catch { try check(store.events.count == before && eventStore.events(matching: predicate).count == 1, "Failed removal did not roll back destination") }
        try CalendarTimelineTransfer.move(system: wrapped, to: localCalendar, eventStore: eventStore, span: .thisEvent)
        let returned = store.events.first { $0.title == original.title }!
        try check(eventStore.events(matching: predicate).isEmpty, "Native source survived successful return move")
        try check(returned.calendarID == localCalendar.id && returned.startDate == wrapped.dateInterval.start && returned.endDate == wrapped.dateInterval.end, "Return move changed column or dates")
        try check(returned.attachments == original.attachments && returned.videoCallURL == original.videoCallURL && returned.notes == original.notes && returned.travelTime == original.travelTime, "Return move lost metadata")
        return checks
    }
    func write(_ report: [String: Any]) throws {
        let documents = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
        try JSONSerialization.data(withJSONObject: report, options: [.prettyPrinted, .sortedKeys])
            .write(to: documents.appendingPathComponent("result.json"))
    }
    func runTests() throws -> Int {
        var checks = 0
        func check(_ value: Bool, _ message: String) throws {
            guard value else { throw NSError(domain: "LocalTimelineStore", code: 1, userInfo: [NSLocalizedDescriptionKey: message]) }
            checks += 1
        }
        let store = AppLocalCalendarStore.shared
        let source = store.createCalendar(title: "Test source", color: .blue)
        let destination = store.createCalendar(title: "Test destination", color: .red)
        let day = Calendar.current.startOfDay(for: Date())
        func hour(_ value: Double) -> Date { day.addingTimeInterval(value * 3600) }
        let original = AppLocalEventRecord(calendarID: source.id, title: "Test event",
            startDate: hour(-12), endDate: hour(39), location: "Sofia", notes: "Keep metadata",
            alarms: [.init(relativeOffset: -600)],
            attachments: [.init(fileName: "test.txt", contentType: "text/plain", dataBase64: "dGVzdA==")])
        func reset() { store.saveEvent(original) }
        func descriptor() -> AppLocalEventDescriptor {
            AppLocalEventDescriptor(eventID: original.id, partialStart: hour(0), partialEnd: hour(24))
        }
        reset()
        let draft = descriptor()
        let unchanged = store.event(id: original.id)!
        draft.isAllDay = true
        draft.dateInterval = DateInterval(start: hour(24), end: hour(48))
        try check(store.event(id: original.id) == unchanged, "Preview wrote to store before drop / on cancel")

        let moving = descriptor()
        moving.dateInterval = DateInterval(start: hour(-11), end: hour(40))
        moving.commitTimelineChange(isResize: false)
        var saved = store.event(id: original.id)!
        try check(saved.startDate == hour(-11) && saved.endDate == hour(40), "Drag truncated a multi-day local event")
        try check(saved.notes == original.notes && saved.alarms == original.alarms && saved.attachments == original.attachments, "Drag lost metadata")

        for top in [true, false] {
            reset()
            let resize = descriptor()
            resize.dateInterval = DateInterval(start: hour(top ? -13 : -12), end: hour(top ? 39 : 40))
            resize.commitTimelineChange(isResize: true)
            saved = store.event(id: original.id)!
            try check(saved.startDate == resize.dateInterval.start && saved.endDate == resize.dateInterval.end, "Wrong resize edge persisted")
        }
        reset()
        let transfer = descriptor()
        transfer.pendingCalendarID = destination.id
        transfer.dateInterval = DateInterval(start: hour(0), end: hour(51))
        transfer.commitTimelineChange(isResize: false)
        try check(store.event(id: original.id)?.calendarID == destination.id, "Wrong local calendar after drop")

        reset()
        let allDay = descriptor()
        allDay.isAllDay = true
        allDay.dateInterval = DateInterval(start: hour(0), end: hour(24))
        allDay.commitTimelineChange(isResize: false)
        try check(store.event(id: original.id)?.isAllDay == true, "Timed-to-all-day conversion not saved")
        let timed = descriptor()
        timed.isAllDay = false
        timed.dateInterval = DateInterval(start: hour(10), end: hour(11))
        timed.commitTimelineChange(isResize: false)
        saved = store.event(id: original.id)!
        try check(!saved.isAllDay && saved.startDate == hour(10) && saved.endDate == hour(11), "All-day-to-timed conversion used old duration")

        reset()
        let rejected = descriptor()
        rejected.pendingCalendarID = "missing-or-native-calendar"
        let beforeReject = store.event(id: original.id)
        rejected.commitTimelineChange(isResize: false)
        try check(store.event(id: original.id) == beforeReject, "Invalid destination modified original")

        var holiday = original
        holiday.isAllDay = true
        holiday.startDate = hour(0); holiday.endDate = hour(48)
        store.saveEvent(holiday)
        let holidayMove = descriptor()
        holidayMove.isAllDay = true
        holidayMove.dateInterval = DateInterval(start: hour(24), end: hour(48))
        holidayMove.commitTimelineChange(isResize: false)
        try check(store.event(id: original.id)?.endDate == hour(72), "All-day drag lost multiple days")

        let remote = CloudCalendarsAPI.SharedICloudCalendar(calendarKind: "app_local", ownerId: "test-owner",
            calendarId: "read-only", id: "reader", title: "Read only", color: "#0088FF", timeZone: "UTC",
            updatedAt: nil, ownerEmail: nil, access: .reader, revokedAt: nil, revokedReason: nil,
            events: nil, eventsUpdatedAt: nil, isRevoked: false)
        store.applyRemoteCalendar(remote)
        let readerCalendar = store.receivedCalendars.first!
        reset()
        let blockedMove = descriptor()
        blockedMove.pendingCalendarID = readerCalendar.id
        let beforeReaderMove = store.event(id: original.id)
        blockedMove.commitTimelineChange(isResize: false)
        try check(store.event(id: original.id) == beforeReaderMove, "Drop wrote into a read-only calendar")
        var readOnly = original
        readOnly.calendarID = readerCalendar.id
        store.saveEvent(readOnly)
        let readOnlyDescriptor = descriptor()
        readOnlyDescriptor.dateInterval = DateInterval(start: hour(1), end: hour(2))
        let beforeResize = store.event(id: original.id)
        readOnlyDescriptor.commitTimelineChange(isResize: true)
        try check(store.event(id: original.id) == beforeResize, "Read-only source accepted resize")
        return checks
    }
}
