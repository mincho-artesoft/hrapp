#if DEBUG
import EventKit
import Foundation
import UIKit
import UserNotifications
import WeatherKit

/// Real iOS notification delivery, using production scheduling/builders.
/// Invitations/weather are labelled fixtures, not APNs or live WeatherKit.
@MainActor
enum NotificationDeliveryE2ETest {
    /// Opt-in diagnostics on the user-authorized physical device. Never allow
    /// calendar seeding, local notification fixtures, cleanup or sharing edits.
    static var physicalPushAuditRequested: Bool {
        #if targetEnvironment(simulator)
        return false
        #else
        let env = ProcessInfo.processInfo.environment
        return env["CLOUD_CALENDARS_DEVICE_PUSH_AUDIT"] == "1"
            && ["notifications-push-register", "notifications-push-observe"]
                .contains(env["LOCAL_SHARING_E2E_ACTION"] ?? "")
        #endif
    }
    struct State: Codable {
        var selected: Set<String>
        var eventFlag: Bool?
        var invitationFlag: Bool?
        var weatherFlag: Bool?
        var native: [String] = []
        var local: [String] = []
        var notificationIDs: [String] = []
        var reminderIDs: [String] = []
        var checks: [String: Bool] = [:]
    }
    static let directory = URL.documentsDirectory.appendingPathComponent("NotificationDeliveryE2E")
    static let prefix = "QA Notifications"
    static var stateURL: URL { directory.appendingPathComponent("state.json") }
    static var vm: CalendarViewModel { .shared }
    static var ek: EKEventStore { vm.eventStore }
    static var localStore: AppLocalCalendarStore { .shared }
    static var group: UserDefaults { UserDefaults(suiteName: "group.ARTE-SOFT.sandBOX")! }
    static func save(_ state: State) throws { try JSONEncoder().encode(state).write(to: stateURL, options: .atomic) }
    static func load() throws -> State { try JSONDecoder().decode(State.self, from: Data(contentsOf: stateURL)) }
    static func require(_ value: Bool, _ message: String) throws {
        if !value { throw NSError(domain: "NotificationQA", code: 1, userInfo: [NSLocalizedDescriptionKey: message]) }
    }
    static func run(action: String) async -> String {
        var report: [String: Any] = ["action": action,
            "scope": "Actual iOS local delivery; production reminder scheduler and invitation/weather builders. Synthetic invitation/weather fixtures; no APNs or real weather warning."]
        do {
            let device = ProcessInfo.processInfo.environment["SIMULATOR_UDID"] ?? ""
            let approvedSimulator = ["1A67A8FA-A72D-4244-9C1C-551D1C473FD4", "786598BD-4158-4A5B-851F-8E04FDE3BC98", "6CC8E36B-735C-440C-9AAA-47069C0C310E"].contains(device)
            let physicalAudit = physicalPushAuditRequested
                && ["notifications-push-register", "notifications-push-observe"].contains(action)
            try require(approvedSimulator || physicalAudit, "Only approved simulators or explicit physical-device push diagnostics")
            report["physicalDevice"] = physicalAudit
            try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
            let center = UNUserNotificationCenter.current()
            let settings = await center.notificationSettings()
            report["authorization"] = settings.authorizationStatus.rawValue
            report["alertSetting"] = settings.alertSetting.rawValue
            report["soundSetting"] = settings.soundSetting.rawValue
            report["locale"] = Locale.current.identifier
            report["pendingAtEntry"] = await center.pendingNotificationRequests().map { ["id": $0.identifier, "title": $0.content.title] }
            report["deliveredQAAtEntry"] = await center.deliveredNotifications().filter {
                $0.request.content.title.hasPrefix(prefix) || $0.request.content.body.hasPrefix("QA TEST")
            }.map { ["id": $0.request.identifier, "title": $0.request.content.title, "body": $0.request.content.body] }
            if action == "notifications-push-register" {
                report["scope"] = "Real APNs device registration and authenticated backend binding; no synthetic notifications"
                InvitationPushRegistration.shared.start()
                for _ in 0..<40 {
                    if InvitationPushRegistration.shared.remoteInvitationsEnabled { break }
                    try await Task.sleep(for: .milliseconds(500))
                }
                await InvitationPushRegistration.shared.synchronize()
                report["push"] = InvitationPushRegistration.shared.auditStatus
                report["status"] = InvitationPushRegistration.shared.remoteInvitationsEnabled ? "PASS" : "NOT_READY"
            } else if action == "notifications-push-observe" {
                report["scope"] = "Read actual delivered server pushes; does not schedule or inject notifications"
                report["deliveredPushes"] = await center.deliveredNotifications().filter {
                    $0.request.content.userInfo["cloudCalendarsPush"] as? Bool == true
                }.map { notification -> [String: Any] in
                    let content = notification.request.content
                    return ["id": notification.request.identifier, "title": content.title, "body": content.body,
                        "isRemotePush": notification.request.trigger is UNPushNotificationTrigger,
                        "eventInvitationID": content.userInfo["pendingEventInvitationID"] as? String ?? "",
                        "calendarInvitationID": content.userInfo["pendingCalendarInvitationID"] as? String ?? ""]
                }
                report["status"] = "OBSERVED"
            } else if action == "notifications-prepare" {
                try require(!FileManager.default.fileExists(atPath: stateURL.path), "A test already exists; observe/cleanup before preparing again")
                if settings.authorizationStatus == .notDetermined {
                    _ = try await center.requestAuthorization(options: [.alert, .sound, .badge])
                }
                let permission = await center.notificationSettings().authorizationStatus
                try require(permission == .authorized || permission == .provisional, "Notifications not authorized; do not change denied permission automatically")
                let state = try await prepare()
                report["checks"] = state.checks
                report["scheduledReminderCount"] = state.reminderIDs.count
                report["eventManagerAuthorization"] = EventNotificationManager.shared.authorizationStatus.rawValue
                report["eventManagerEnabled"] = EventNotificationManager.shared.eventNotificationsEnabled
                report["status"] = state.checks.values.allSatisfy { $0 } ? "PASS" : "FAIL"
            } else if action == "notifications-observe" {
                var state = try load()
                let delivered = await center.deliveredNotifications()
                let ours = delivered.filter { state.notificationIDs.contains($0.request.identifier) }
                let ids = Set(ours.map { $0.request.identifier })
                for id in state.notificationIDs { state.checks["delivered " + id] = ids.contains(id) }
                state.checks["Each expected notification delivered once"] = ours.count == state.notificationIDs.count
                try save(state)
                report["checks"] = state.checks
                report["delivered"] = ours.map { ["id": $0.request.identifier, "title": $0.request.content.title, "body": $0.request.content.body] }
                report["expectedCount"] = state.notificationIDs.count
                report["status"] = state.checks.values.allSatisfy { $0 } ? "PASS" : "FAIL"
            } else if action == "notifications-cleanup" {
                try await cleanup()
                report["status"] = "PASS"
            } else { try require(false, "Unknown notification action") }
        } catch {
            report["status"] = "FAIL"; report["error"] = error.localizedDescription
        }
        if let data = try? JSONSerialization.data(withJSONObject: report, options: [.prettyPrinted, .sortedKeys]) {
            try? data.write(to: directory.appendingPathComponent(action + ".json"), options: .atomic)
            return String(data: data, encoding: .utf8) ?? "Report unavailable"
        }
        return "Report unavailable"
    }
    static func prepare() async throws -> State {
        let defaults = UserDefaults.standard
        var state = State(selected: vm.selectedCalendarIDs,
            eventFlag: defaults.object(forKey: "EventNotificationsEnabled") as? Bool,
            invitationFlag: group.object(forKey: "InvitationNotificationsEnabled") as? Bool,
            weatherFlag: defaults.object(forKey: "WeatherAlertNotificationsEnabled") as? Bool)
        try save(state)
        let center = UNUserNotificationCenter.current()
        let manager = EventNotificationManager.shared
        manager.configure()
        manager.setEventNotificationsEnabled(true)
        PendingEventInvitationManager.shared.setInvitationNotificationsEnabled(true)
        defaults.set(true, forKey: "WeatherAlertNotificationsEnabled")
        try require(EKEventStore.authorizationStatus(for: .event) == .fullAccess, "Calendar permission required")
        let fire = Date().addingTimeInterval(45)
        let start = fire.addingTimeInterval(1800)
        let midnight = Calendar.current.startOfDay(for: Date())
        for hidden in [false, true] {
            let calendar = EKCalendar(for: .event, eventStore: ek)
            calendar.title = prefix + (hidden ? " Hidden Native" : " Native")
            calendar.source = ek.sources.first { $0.sourceType == .local }
            try require(calendar.source != nil, "Independent EventKit source required")
            try ek.saveCalendar(calendar, commit: true)
            state.native.append(calendar.calendarIdentifier); try save(state)
            let appCalendar = localStore.createCalendar(title: prefix + (hidden ? " Hidden Local" : " Local"), color: .systemPurple)
            state.local.append(appCalendar.id); try save(state)
            for (index, kind) in ["Timed", "All-day", "51h", "Two alarms"].enumerated() {
                let eventStart = kind == "All-day" ? midnight : start
                let eventEnd = kind == "All-day" ? midnight.addingTimeInterval(86400) : eventStart.addingTimeInterval(kind == "51h" ? 51 * 3600 : 3600)
                let offset = fire.addingTimeInterval(Double(index)).timeIntervalSince(eventStart)
                let offsets = kind == "Two alarms" ? [offset, offset + 2] : [offset]
                let event = EKEvent(eventStore: ek)
                event.calendar = calendar
                event.title = prefix + " Native " + kind + (hidden ? " HIDDEN" : "")
                event.startDate = eventStart; event.endDate = eventEnd; event.isAllDay = kind == "All-day"
                event.alarms = offsets.map(EKAlarm.init(relativeOffset:))
                try ek.save(event, span: .thisEvent, commit: true)
                localStore.saveEvent(.init(calendarID: appCalendar.id,
                    title: prefix + " Local " + kind + (hidden ? " HIDDEN" : ""), startDate: eventStart, endDate: eventEnd,
                    isAllDay: kind == "All-day", alarms: offsets.map { .init(relativeOffset: $0) }))
            }
            if !hidden {
                let absolute = EKEvent(eventStore: ek); absolute.calendar = calendar
                absolute.title = prefix + " Absolute alarm"; absolute.startDate = start; absolute.endDate = start.addingTimeInterval(3600)
                absolute.alarms = [EKAlarm(absoluteDate: fire.addingTimeInterval(6))]
                try ek.save(absolute, span: .thisEvent, commit: true)
                var cancelled = AppLocalEventRecord(calendarID: appCalendar.id, title: prefix + " CANCELLED", startDate: start,
                    endDate: start.addingTimeInterval(3600), alarms: [.init(relativeOffset: fire.timeIntervalSince(start))])
                cancelled.isCancelled = true; localStore.saveEvent(cancelled)
                localStore.saveEvent(.init(calendarID: appCalendar.id, title: prefix + " PAST ALARM", startDate: start,
                    endDate: start.addingTimeInterval(3600), alarms: [.init(relativeOffset: Date().addingTimeInterval(-60).timeIntervalSince(start))]))
            }
        }
        vm.reloadCalendars()
        vm.selectedCalendarIDs = [state.native[0], state.local[0]]
        manager.rescheduleUpcomingEventNotifications()
        try await Task.sleep(for: .seconds(2))
        // Multiple EventKit change callbacks can briefly leave the queue empty
        // between cancel/reschedule. Await the completed queue, not that gap.
        var reminders: [UNNotificationRequest] = []
        for _ in 0..<40 {
            reminders = await center.pendingNotificationRequests().filter { $0.identifier.hasPrefix("calendar.event.alarm.") }
            if reminders.count == 11 { break }
            try await Task.sleep(for: .milliseconds(250))
        }
        state.reminderIDs = reminders.map(\.identifier)
        state.checks["11 alarms from selected native and local calendars"] = reminders.count == 11
        state.checks["Deselected cancelled and past alarms excluded"] = !reminders.contains { ["HIDDEN", "CANCELLED", "PAST ALARM"].contains(where: $0.content.title.contains) }
        state.checks["Every reminder routes to an event and calendar"] = reminders.allSatisfy { $0.content.userInfo["eventIdentifier"] != nil && $0.content.userInfo["calendarIdentifier"] != nil }
        state.notificationIDs = state.reminderIDs
        try save(state)
        let token = UUID().uuidString
        var events: [CloudCalendarsAPI.PendingEventInvitation] = []
        var calendars: [CloudCalendarsAPI.PendingICloudCalendarInvitation] = []
        for kind in ["Local", "EventKit"] {
            for access: CloudCalendarsAPI.EventAccess in [.reader, .writer, .owner] {
                let id = "qa-notifications-\(token)-\(kind)-\(access.rawValue)"
                let title = "\(prefix) \(kind) \(access.rawValue) / دعوة"
                events.append(.init(id: id, eventId: id, feedId: id, title: title,
                    start: start.ISO8601Format(), end: start.addingTimeInterval(3600).ISO8601Format(), allDay: false,
                    location: "Sofia", access: access, invitedAt: nil, senderName: "QA TEST", senderEmail: nil,
                    eventUrl: "https://example.com/qa", color: "#0088FF"))
                calendars.append(.init(id: id, ownerId: "qa", ownerEmail: nil, calendarId: id, title: title,
                    color: "#0088FF", timeZone: "Europe/Sofia", calendarKind: kind == "Local" ? "app_local" : "eventkit",
                    access: access, invitedAt: nil, senderEmail: "QA TEST"))
                state.notificationIDs += ["shared.event.invitation." + id, "shared.calendar.invitation." + id]
            }
        }
        await PendingEventInvitationManager.shared.testNotificationDelivery(events: events, calendars: calendars)
        var weather: [WeatherAlert] = []
        for severity in ["minor", "moderate", "severe", "extreme", "unknown"] {
            let now = Date().timeIntervalSinceReferenceDate
            let json: [String: Any] = ["id": UUID().uuidString, "detailsURL": "https://example.com/qa-weather",
                "source": "QA TEST \(token)", "summary": "QA TEST \(severity) — No real weather alert", "description": "QA TEST",
                "region": "QA", "severity": severity, "importance": "normal", "date": now, "issuedDate": now,
                "expirationDate": now + 3600, "metadata": ["date": now, "expirationDate": now + 3600, "latitude": 42.7, "longitude": 23.3]]
            weather.append(try JSONDecoder().decode(WeatherAlert.self, from: JSONSerialization.data(withJSONObject: json)))
        }
        await WeatherAlertNotificationManager.shared.testNotificationDelivery(weather)
        try await Task.sleep(for: .seconds(2))
        let delivered = await center.deliveredNotifications()
        let weatherNotifications = delivered.filter { $0.request.content.body.hasPrefix("QA TEST") && $0.request.content.userInfo["weatherAlertGPS"] as? Bool == true }
        state.notificationIDs += weatherNotifications.map { $0.request.identifier }
        state.checks["Five weather severities delivered without duplicate"] = weatherNotifications.count == 5
        state.checks["Twelve invitation variants delivered"] = delivered.filter { state.notificationIDs.contains($0.request.identifier) && $0.request.identifier.contains(token) }.count == 12
        try save(state)
        return state
    }
    static func cleanup() async throws {
        let state = try load()
        let center = UNUserNotificationCenter.current()
        let calendarIDs = Set(state.native + state.local)
        let pending = await center.pendingNotificationRequests()
        let delivered = await center.deliveredNotifications()
        let reminderIDs = (pending + delivered.map(\.request)).filter {
            calendarIDs.contains($0.content.userInfo["calendarIdentifier"] as? String ?? "")
        }.map(\.identifier)
        center.removePendingNotificationRequests(withIdentifiers: state.notificationIDs + reminderIDs)
        center.removeDeliveredNotifications(withIdentifiers: state.notificationIDs + reminderIDs)
        for id in state.native {
            if let calendar = ek.calendar(withIdentifier: id) {
                try require(calendar.title.hasPrefix(prefix), "Cleanup target is not a QA calendar")
                try ek.removeCalendar(calendar, commit: true)
            }
        }
        for id in state.local {
            if let calendar = localStore.calendar(id: id) {
                try require(calendar.title.hasPrefix(prefix), "Cleanup target is not a QA calendar")
                localStore.removeCalendar(id: id)
            }
        }
        vm.reloadCalendars(); vm.selectedCalendarIDs = state.selected
        EventNotificationManager.shared.setEventNotificationsEnabled(state.eventFlag ?? true)
        PendingEventInvitationManager.shared.setInvitationNotificationsEnabled(state.invitationFlag ?? true)
        for (key, value, defaults) in [("EventNotificationsEnabled", state.eventFlag, UserDefaults.standard),
            ("InvitationNotificationsEnabled", state.invitationFlag, group), ("WeatherAlertNotificationsEnabled", state.weatherFlag, UserDefaults.standard)] {
            if let value { defaults.set(value, forKey: key) } else { defaults.removeObject(forKey: key) }
        }
        try FileManager.default.moveItem(at: stateURL, to: directory.appendingPathComponent("state-cleaned-\(UUID().uuidString).json"))
    }
}
#endif
