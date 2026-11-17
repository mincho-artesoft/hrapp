import Foundation

@main enum MacCalendarSharingMergeTests {
    @MainActor static func main() throws {
        let original = DeviceCalendarEvent(id: "a", title: "Original", start: "2026-11-17T10:00:00Z", end: "2026-11-17T11:00:00Z", allDay: false)
        var remote = original
        remote.title = "Recipient edit"
        let updated = try MacCalendarSharingMerge.reconcile(base: [original], local: [original], remote: [remote])
        precondition(updated.first?.title == "Recipient edit")
        let deleted = try MacCalendarSharingMerge.reconcile(base: [original], local: [], remote: [original])
        precondition(deleted.isEmpty)
        var inFlight = original
        inFlight.title = "Newest edit on this Mac"
        let retained = try MacCalendarSharingMerge.preservingInFlightEdits(beforeUpload: [original], uploaded: [remote], current: [inFlight])
        precondition(retained.first?.title == inFlight.title, "A completed request must not overwrite a newer local edit")
        let removedDuringUpload = try MacCalendarSharingMerge.preservingInFlightEdits(beforeUpload: [original], uploaded: [remote], current: [])
        precondition(removedDuringUpload.isEmpty, "An in-flight upload must not resurrect a locally deleted event")
        var wire = original
        wire.start = "2026-11-17T10:00:00.000Z"
        wire.details = try CalendarJSON.object(encoding: MacEventShareSnapshot.details(original))
        let normalized = try MacCalendarSharingMerge.reconcile(base: [wire], local: [], remote: [original])
        precondition(normalized.isEmpty, "Wire formatting differences must not undo a deletion")
        var localFlag = original
        localFlag.readOnly = false
        let stable = try MacCalendarSharingMerge.reconcile(base: [original], local: [localFlag], remote: [original])
        let wireOriginal = try MacCalendarSharingMerge.wireSnapshot(original)
        precondition(stable == [wireOriginal], "Device-only access flags must not cause perpetual uploads")
        var dragged = original
        dragged.start = "2026-11-17T14:00:00Z"; dragged.end = "2026-11-17T15:00:00Z"
        var resized = dragged; resized.end = "2026-11-17T16:30:00Z"
        let resizeDuringUpload = try MacCalendarSharingMerge.preservingInFlightEdits(beforeUpload: [dragged], uploaded: [original], current: [resized])
        precondition(resizeDuringUpload.first?.end == resized.end, "A completed drag upload must not undo a later resize")
        let nextPass = try MacCalendarSharingMerge.reconcile(base: [original], local: resizeDuringUpload, remote: [original])
        precondition(nextPass.first?.start == dragged.start && nextPass.first?.end == resized.end,
                     "The next sync must upload the retained drag/resize")
        var sharedWire = original
        sharedWire.id = MacEventShareSnapshot.calendarEventID(original.id)
        precondition(sharedWire.id.count == 64 && sharedWire.id.allSatisfy(\.isHexDigit))
        precondition(MacEventShareSnapshot.calendarEventID(sharedWire.id) == sharedWire.id)
        let restored = MacCalendarSharingMerge.restoringLocalIDs([sharedWire], matching: [original])
        precondition(restored.first?.id == original.id, "Calendar round-trip must retain the editable local event ID")
        let changedWire = MacCalendarSharingMerge.restoringLocalIDs([sharedWire], matching: [])
        precondition(changedWire.first?.id == sharedWire.id, "A new recipient must keep the canonical ID")
        print("PASS: calendar sharing edits, deletions, wire normalization and in-flight changes")
    }
}
