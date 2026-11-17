import Foundation

@main enum MacEventShareSnapshotTests {
    @MainActor static func main() throws {
        var local = DeviceCalendarEvent(id: "event", title: "Test", start: "2026-11-16T10:00:00Z",
            end: "2026-11-16T11:00:00Z", allDay: false)
        local.details = ["notes": .string(""), "timeZone": .string("Europe/Sofia")]
        let upload = try MacEventShareSnapshot.details(local)
        precondition(upload.alarms.isEmpty && upload.attendees.isEmpty && upload.recurrenceRules.isEmpty)
        precondition(upload.notes == nil)
        var server = local
        server.start = "2026-11-16T10:00:00.000Z"
        server.details = try CalendarJSON.object(encoding: upload)
        server.updatedAt = "2026-11-16T09:00:00Z"
        let sameContent = try MacEventShareSnapshot.canonical(local) == MacEventShareSnapshot.canonical(server)
        precondition(sameContent,
            "Missing fields, empty attachment arrays and timestamps must not trigger a stale upload")
        local.details?["attachments"] = .array([.object(["id": .string("a"), "fileName": .string("a.txt"), "dataBase64": .string("YQ==")])])
        local.details?["travelTime"] = .number(600)
        let rich = try MacEventShareSnapshot.details(local)
        precondition(rich.attachments?.first?.fileName == "a.txt" && rich.travelTime == 600)
        print("PASS: sparse local/EventKit share snapshots, wire normalization and portable attachments")
    }
}
