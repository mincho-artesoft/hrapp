import EventKit
import UIKit

// Real production AppLocalCalendarStore, isolated test-app sandbox. Remote
// responses use service doubles; this is not an authenticated end-to-end test.
extension LocalStoreTestApp {
    func runSharingStoreTests() -> [String: Any] {
        var passed: [String] = []
        var failed: [String] = []
        func check(_ condition: Bool, _ name: String) {
            if condition { passed.append(name) } else { failed.append(name) }
        }
        let store = AppLocalCalendarStore.shared
        let owned = store.createCalendar(title: "Local sharing test", color: .purple)
        let sameName = store.createCalendar(title: owned.title, color: .orange)
        check(owned.canManageSharing && owned.canEditEvents, "Local creator can share and edit")
        let registered = store.registerForSharing(id: owned.id)!
        check(registered.shareID.count == 64 && registered.shareID != owned.id,
              "Calendar sharing uses a fingerprint, not the raw local ID")
        check(store.registerForSharing(id: owned.id)?.shareID == registered.shareID,
              "Repeated sharing registration keeps the same identity")
        check(sameName.shareID != registered.shareID, "Same calendar names do not collide")

        let date = Date(timeIntervalSince1970: 1_789_000_000)
        let localEvent = AppLocalEventRecord(calendarID: owned.id, title: "اجتماع محلي / Local event",
            startDate: date, endDate: date.addingTimeInterval(51 * 3600),
            location: "София / دبي", notes: "Notes & <test>",
            urlString: "https://example.com/event", videoCallURL: "https://example.com/call",
            timeZoneIdentifier: "Europe/Sofia", alarms: [.init(relativeOffset: -900)],
            travelTime: 600, recurrenceRules: [.init(rule: EKRecurrenceRule(
                recurrenceWith: .weekly, interval: 1, end: nil))],
            attachments: [.init(fileName: "test.txt", contentType: "text/plain", dataBase64: "dGVzdA==")])
        store.saveEvent(localEvent)
        check(localEvent.shareID.count == 64 && localEvent.shareID != localEvent.id,
              "Event sharing uses a stable fingerprint")
        var renamed = localEvent
        renamed.title = "Changed title"
        check(renamed.shareID == localEvent.shareID, "Renaming does not change an event's share identity")

        let details = CloudCalendarsAPI.Details(notes: localEvent.notes,
            videoCallURL: localEvent.videoCallURL, timeZone: localEvent.timeZoneIdentifier,
            alarms: [.init(relativeOffset: -900)], travelTime: localEvent.travelTime,
            recurrenceRules: localEvent.recurrenceRules, structuredLocation: nil,
            attachments: localEvent.attachments?.map(\.sharedValue))
        let remoteEvent = CloudCalendarsAPI.RemoteEvent(id: localEvent.shareID, title: localEvent.title,
            startDate: localEvent.startDate, endDate: localEvent.endDate, allDay: false,
            location: localEvent.location, url: localEvent.urlString, details: details)
        var remote = CloudCalendarsAPI.SharedICloudCalendar(calendarKind: "app_local", ownerId: "test-owner",
            calendarId: registered.shareID, id: "test-owner:" + registered.shareID,
            title: owned.title, color: "#AF52DE", timeZone: "Europe/Sofia",
            updatedAt: "2026-09-09T09:00:00.000Z", ownerEmail: "owner@example.com", access: .reader,
            revokedAt: nil, revokedReason: nil, events: [remoteEvent],
            eventsUpdatedAt: "2026-09-09T09:00:00.000Z", isRevoked: false)
        check(store.applyRemoteCalendar(remote), "Received local calendar is imported")
        let received = store.receivedCalendars.first { $0.remoteCalendarID == registered.shareID }!
        let imported = store.events.first { $0.calendarID == received.id }!
        check(received.id != owned.id && received.origin == .received,
              "Received calendar does not replace a same-name local calendar")
        check(CalendarViewModel.shared.selectedCalendarIDs.contains(received.id),
              "Received calendar becomes visible in the selected calendars")
        check(!received.canEditEvents && !received.canManageSharing, "Reader cannot edit or manage sharing")
        check(imported.shareID == localEvent.shareID, "Import preserves the original shared event identity")
        check(imported.title == localEvent.title && imported.location == localEvent.location,
              "Arabic and Bulgarian event text survive import")
        check(imported.startDate == localEvent.startDate && imported.endDate == localEvent.endDate,
              "Import preserves the full 51-hour interval")
        check(imported.notes == localEvent.notes && imported.urlString == localEvent.urlString
              && imported.videoCallURL == localEvent.videoCallURL
              && imported.timeZoneIdentifier == localEvent.timeZoneIdentifier,
              "Notes, URL, video link and time zone survive import")
        check(imported.alarms.map(\.relativeOffset) == localEvent.alarms.map(\.relativeOffset)
              && imported.attachments == localEvent.attachments
              && imported.recurrenceRules == localEvent.recurrenceRules
              && imported.travelTime == localEvent.travelTime,
              "Alarms, attachments, recurrence and travel time survive import")
        let repeatedChange = store.applyRemoteCalendar(remote)
        check(!repeatedChange, "An identical remote revision does not trigger a false update")
        var metadataOnly = remote
        metadataOnly.events = nil
        _ = store.applyRemoteCalendar(metadataOnly)
        check(store.events.filter { $0.calendarID == received.id }.map(\.id) == [imported.id],
              "Repeated metadata-only acceptance preserves existing local events")
        var edited = remoteEvent
        edited.title = "Writer edit"
        var other = remoteEvent
        other.id = "independent-event"
        let base = [remoteEvent]
        check(AppLocalCalendarMerge.events(base: base, local: base, remote: [edited]) == [edited],
              "Stale creator snapshot preserves a Writer edit")
        check(AppLocalCalendarMerge.events(base: base, local: [remoteEvent, other], remote: [edited]).count == 2,
              "Independent creator addition survives a remote Writer edit")
        var conflict = remoteEvent
        conflict.title = "Conflicting creator edit"
        check(AppLocalCalendarMerge.events(base: base, local: [conflict], remote: [edited]) == [edited],
              "Same-event conflict uses the canonical remote version")
        check(AppLocalCalendarMerge.events(base: base, local: [], remote: base).isEmpty,
              "Local deletion is uploaded when the remote event is unchanged")
        check(AppLocalCalendarMerge.events(base: base, local: base, remote: []).isEmpty,
              "Remote deletion does not get resurrected by the creator")
        var ownedRemote = remote
        ownedRemote.events = [edited]
        ownedRemote.access = .owner
        check(store.applyRemoteCalendar(ownedRemote, ownedCalendarID: owned.id), "Writer snapshot applies to original local calendar")
        check(store.event(id: localEvent.id)?.title == edited.title && store.calendar(id: owned.id)?.origin == .owned,
              "Applying Writer changes preserves original event ID and calendar ownership")
        check(store.events.filter { $0.calendarID == received.id }.count == 1
              && store.events.first { $0.calendarID == received.id }?.id == imported.id,
              "Repeated import does not duplicate the event")
        var noAlarms = remote
        noAlarms.events?[0].details?.alarms = []
        _ = store.applyRemoteCalendar(noAlarms)
        check(!store.applyRemoteCalendar(noAlarms),
              "Identical revision without alarms is correctly treated as unchanged")

        store.setLocalColorOverride(.red, calendarID: received.id)
        remote.title = "Renamed shared calendar"
        remote.color = "#34C759"
        remote.updatedAt = "2026-09-09T09:01:00.000Z"
        _ = store.applyRemoteCalendar(remote)
        check(store.calendar(id: received.id)?.title == remote.title
              && store.calendar(id: received.id)?.colorHex == remote.color,
              "Owner metadata changes reach the local copy")
        check(store.calendar(id: received.id)?.localColorOverrideHex == AppLocalCalendarStore.colorHex(.red),
              "Local color override survives remote updates")

        remote.access = .writer
        _ = store.applyRemoteCalendar(remote)
        check(store.calendar(id: received.id)?.canEditEvents == true
              && store.calendar(id: received.id)?.canManageSharing == false,
              "Writer can edit events but cannot manage sharing")
        remote.access = .owner
        _ = store.applyRemoteCalendar(remote)
        check(store.calendar(id: received.id)?.canManageSharing == true
              && store.calendar(id: received.id)?.isOriginalCreator == false,
              "Delegated owner can manage sharing without becoming the creator")

        var allDay = remoteEvent
        allDay.id = "all-day"
        allDay.title = "All-day local share"
        allDay.allDay = true
        allDay.details = nil
        remote.events = [allDay]
        _ = store.applyRemoteCalendar(remote)
        check(store.events.filter { $0.calendarID == received.id }.count == 1
              && store.events.first { $0.calendarID == received.id }?.isAllDay == true,
              "Event deletion and replacement with an all-day event reconcile correctly")

        var nativeRemote = remote
        nativeRemote.calendarKind = "eventkit"
        nativeRemote.id = "must-not-import"
        let count = store.calendars.count
        check(!store.applyRemoteCalendar(nativeRemote) && store.calendars.count == count,
              "EventKit calendars do not leak into the app-local store")

        remote.isRevoked = true
        remote.revokedAt = "2026-09-09T09:02:00.000Z"
        remote.revokedReason = "access_removed"
        _ = store.applyRemoteCalendar(remote)
        check(store.calendar(id: received.id)?.canEditEvents == false
              && store.calendar(id: received.id)?.canManageSharing == false
              && store.events.first { $0.calendarID == received.id }?.isCancelled == true,
              "Revocation disables editing and marks received events cancelled")
        store.removeRemoteCalendarsNotPresent(in: [])
        check(store.calendar(id: received.id) == nil
              && !store.events.contains { $0.calendarID == received.id }
              && !CalendarViewModel.shared.selectedCalendarIDs.contains(received.id),
              "Leaving removes the received calendar, events and selection")
        check(store.calendar(id: owned.id) != nil && store.event(id: localEvent.id) != nil,
              "Removing received data preserves the creator's local data")

        return ["status": failed.isEmpty ? "PASS" : "FAIL", "checks": passed.count + failed.count,
                "passed": passed, "failures": failed,
                "scope": "Production local store; isolated sandbox; stubbed network models"]
    }
}
