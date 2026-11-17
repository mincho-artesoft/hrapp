import Foundation

@main
struct DeviceCalendarMergeTests {
    @MainActor static func main() throws {
        assert(DeviceCalendarReplica.storageHost(for: URL(string: "https://storage.wonek.com/cloud-calendars-debug")!)
            == DeviceCalendarReplica.storageHost(for: URL(string: "https://63yo3ore3c.execute-api.us-east-1.amazonaws.com")!))
        assert(DeviceCalendarReplica.storageHost(for: URL(string: "https://api.cloud-calendars.com")!) == "api.cloud-calendars.com")
        let event = DeviceCalendarEvent(id: "one", title: "Original", start: "2026-11-17T09:00:00Z", end: "2026-11-17T10:00:00Z", allDay: false)
        var phone = event; phone.title = "Phone edit"
        var web = event; web.title = "Web edit"
        var second = event; second.id = "two"
        // Changes to different events survive; a conflict on one event uses the remote version.
        assert(DeviceCalendarReplica.merge(base: [event], local: [phone, second], remote: [event]) == [phone, second])
        assert(DeviceCalendarReplica.merge(base: [event], local: [phone], remote: [web]) == [web])
        assert(DeviceCalendarReplica.merge(base: [event], local: [event], remote: []).isEmpty)
        assert(DeviceCalendarReplica.merge(base: [event], local: [], remote: [event]).isEmpty)
        assert(DeviceCalendarReplica.merge(base: [], local: [phone], remote: [second]) == [phone, second])
        var stamped = event; stamped.updatedAt = "2026-11-17T08:00:00Z"
        assert(DeviceCalendarReplica.merge(base: [stamped], local: [phone], remote: [event]) == [phone])
        // Supplementary fields round-trip without being stripped by the client.
        var detailed = event
        detailed.details = ["attachments": .array([.object(["dataBase64": .string("YQ==")])]), "futureField": .bool(true)]
        let decoded = try JSONDecoder().decode(DeviceCalendarEvent.self, from: JSONEncoder().encode(detailed))
        assert(decoded == detailed)
        let legacyData = Data(##"{"id":"shared-example","deviceId":"mac","deviceName":"Mac","title":"Calendar","source":"Local Calendars","color":"#0088FF","allowsChanges":true,"available":true,"events":[],"revision":0}"##.utf8)
        var received = try JSONDecoder().decode(DeviceCalendarDocument.self, from: legacyData)
        assert(received.sharing == nil && received.isReceivedSharedCalendar,
               "Legacy received calendars must be excluded from personal replication, even with a normalized source label")
        received.sharing = .init(ownerID: "owner", calendarID: "calendar", ownerEmail: "owner@example.com",
            access: "owner", calendarKind: "eventkit", localColorOverride: "#FF0000")
        let restored = try JSONDecoder().decode(DeviceCalendarDocument.self, from: JSONEncoder().encode(received))
        assert(restored == received, "Received roles, canonical identity and device color survive a restart")
        var own = received; own.id = "local-calendar"; own.sharing = nil
        assert(!own.isReceivedSharedCalendar, "Owned local calendars remain eligible for web sync")
        precondition(DeviceCalendarEvent.date("2026-11-17T09:00:00.000Z") == event.startDate)
        precondition(DeviceCalendarEvent.date("2026-11-17T11:00:00+02:00") == event.startDate)
        precondition(DeviceCalendarEvent.date("not a date") == nil)
        let expected = event.startDate
        let started = Date()
        DispatchQueue.concurrentPerform(iterations: 10000) { _ in
            precondition(DeviceCalendarEvent.date(event.start) == expected)
            precondition(DeviceCalendarEvent.iso(expected) == event.start)
        }
        print("10,000 concurrent cached date round-trips:", Date().timeIntervalSince(started), "seconds")
        print("PASS: independent edits, conflicts, deletions, new calendars, timestamps and metadata")
    }
}
