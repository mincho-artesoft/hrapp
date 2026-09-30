import Foundation

@main enum TravelReminderPolicyTests {
    static func main() throws {
        try TravelRecurrenceTests.run()
        let now = Date(timeIntervalSince1970: 1_800_000_000)
        let meeting = now.addingTimeInterval(7200)
        let arrival = meeting.addingTimeInterval(-TravelReminderPolicy.arrivalBuffer)
        let nearbyDeparture = arrival.addingTimeInterval(-20 * 60)
        let distantDeparture = arrival.addingTimeInterval(-50 * 60)
        let nearbyAlert = TravelReminderPolicy.notificationDate(start: meeting, departure: nearbyDeparture, now: now)!
        let distantAlert = TravelReminderPolicy.notificationDate(start: meeting, departure: distantDeparture, now: now)!
        precondition(nearbyAlert == meeting.addingTimeInterval(-35 * 60))
        precondition(distantAlert == nearbyAlert.addingTimeInterval(-30 * 60), "Moving farther away must advance the alert")
        precondition(TravelReminderPolicy.notificationDate(start: meeting, departure: now.addingTimeInterval(-100), now: now) == now.addingTimeInterval(1), "Late recalculations should notify immediately")
        precondition(TravelReminderPolicy.notificationDate(start: now, departure: now, now: now) == nil, "No reminder for an event that has started")
        precondition(TravelReminderPolicy.notificationDate(start: meeting, departure: Date(timeIntervalSince1970: .infinity), now: now) == nil)
        precondition(TravelReminderPolicy.acceptsLocation(timestamp: now, accuracy: 50, now: now))
        precondition(!TravelReminderPolicy.acceptsLocation(timestamp: now.addingTimeInterval(-600), accuracy: 50, now: now), "Delayed visits cannot act as current location")
        precondition(!TravelReminderPolicy.acceptsLocation(timestamp: now, accuracy: -1, now: now))
        precondition(!TravelReminderPolicy.acceptsLocation(timestamp: now, accuracy: 5000, now: now))
        let stored = TravelReminderSchedule(signature: "event-destination", fireDate: distantAlert, eventStart: meeting)
        let restored = try JSONDecoder().decode(TravelReminderSchedule.self, from: JSONEncoder().encode(stored))
        precondition(!restored.wasDelivered(signature: "event-destination", now: now))
        precondition(restored.wasDelivered(signature: "event-destination", now: distantAlert), "Relaunch/movement must not repeat a delivered reminder")
        precondition(!restored.wasDelivered(signature: "new-destination", now: distantAlert), "A changed destination can require a new reminder")
        // Absolute instants must remain correct across a DST boundary.
        let iso = ISO8601DateFormatter()
        let dstStart = iso.date(from: "2026-10-25T03:30:00+02:00")!
        let dstDeparture = dstStart.addingTimeInterval(-3600)
        precondition(TravelReminderPolicy.notificationDate(start: dstStart, departure: dstDeparture, now: dstStart.addingTimeInterval(-7200)) == dstStart.addingTimeInterval(-3900))
        print("PASS: 13 travel timing, movement, stale-location, DST and relaunch checks")
    }
}
