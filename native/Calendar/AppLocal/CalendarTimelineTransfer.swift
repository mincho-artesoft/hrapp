import EventKit
import Foundation

/// A cross-provider drop is a move, not a change to EKEvent.calendar. Save the
/// destination first, then remove the source; roll back on a removal failure.
@MainActor
enum CalendarTimelineTransfer {
    static func unavailable() -> NSError {
        NSError(domain: "CalendarTimelineTransfer", code: 1, userInfo: [
            NSLocalizedDescriptionKey: NSLocalizedString("The selected calendar cannot be edited.", comment: "")
        ])
    }

    static func move(
        local descriptor: AppLocalEventDescriptor, to destination: EKCalendar,
        eventStore: EKEventStore, isResize: Bool
    ) throws {
        let store = AppLocalCalendarStore.shared
        guard let record = store.event(id: descriptor.eventID), !descriptor.isReadOnly,
              destination.allowsContentModifications else { throw unavailable() }
        let event = EKEvent(eventStore: eventStore)
        event.calendar = destination
        event.title = record.title
        event.startDate = descriptor.dateInterval.start
        event.endDate = record.isAllDay && descriptor.isAllDay && !isResize
            ? event.startDate.addingTimeInterval(record.endDate.timeIntervalSince(record.startDate))
            : descriptor.dateInterval.end
        event.isAllDay = descriptor.isAllDay
        event.timeZone = TimeZone(identifier: record.timeZoneIdentifier)
        event.location = record.location
        event.structuredLocation = record.structuredLocation?.makeLocation(title: record.location)
        event.notes = record.notes
        event.url = URL(string: record.urlString)
        event.alarms = record.alarms.map { EKAlarm(relativeOffset: $0.relativeOffset) }
        event.recurrenceRules = record.recurrenceRules?.compactMap { $0.makeRule() }
        try eventStore.save(event, span: .thisEvent, commit: true)
        EventKitEventSupplementStore.update(
            travelTime: record.travelTime, attachments: record.attachments ?? [],
            videoCallURL: record.videoCallURL, for: event)
        let savedSupplement = EventKitEventSupplementStore.supplement(for: event)
        guard savedSupplement?.attachments == (record.attachments ?? []),
              savedSupplement?.travelTime == record.travelTime,
              savedSupplement?.videoCallURL == record.videoCallURL else {
            try eventStore.remove(event, span: .futureEvents, commit: true)
            EventKitEventSupplementStore.remove(for: event)
            throw unavailable()
        }
        do {
            try store.deleteTransferredEvent(id: record.id)
        } catch {
            try eventStore.remove(event, span: .futureEvents, commit: true)
            EventKitEventSupplementStore.remove(for: event)
            throw error
        }
        descriptor.pendingCalendarID = nil
    }

    static func move(
        system descriptor: EKMultiDayWrapper, to destination: AppLocalCalendarRecord,
        eventStore: EKEventStore, span: EKSpan
    ) throws {
        let source = descriptor.realEvent
        // EventKit invitees and geofenced alarms cannot be represented by the
        // local model. Refuse those moves rather than silently discard them.
        guard !SharedInviteTracker.isReadOnly(source), destination.canEditEvents,
              !source.hasAttendees,
              (source.alarms ?? []).allSatisfy({ $0.structuredLocation == nil }) else { throw unavailable() }
        let supplement = EventKitEventSupplementStore.supplement(for: source)
        let record = AppLocalEventRecord(
            calendarID: destination.id, title: source.title ?? "",
            startDate: descriptor.dateInterval.start, endDate: descriptor.dateInterval.end,
            isAllDay: descriptor.isAllDay, location: source.location ?? "", notes: source.notes ?? "",
            urlString: source.url?.absoluteString ?? "", videoCallURL: supplement?.videoCallURL,
            timeZoneIdentifier: source.timeZone?.identifier ?? TimeZone.current.identifier,
            alarms: (source.alarms ?? []).map { alarm in
                AppLocalEventAlarm(relativeOffset: alarm.absoluteDate.map {
                    $0.timeIntervalSince(source.startDate)
                } ?? alarm.relativeOffset)
            },
            createdAt: source.creationDate ?? Date(), travelTime: supplement?.travelTime,
            recurrenceRules: span == .futureEvents
                ? source.recurrenceRules?.map(SharedEventRecurrenceRule.init(rule:)) : nil,
            structuredLocation: source.structuredLocation.map(SharedEventLocation.init(location:)),
            attachments: supplement?.attachments)
        let store = AppLocalCalendarStore.shared
        let identifier = source.eventIdentifier
        try store.saveTransferredEvent(record)
        do {
            try eventStore.remove(source, span: span, commit: true)
        } catch {
            try store.deleteTransferredEvent(id: record.id)
            throw error
        }
        // Removing one occurrence must not remove the remaining series' metadata.
        if !source.hasRecurrenceRules || span == .futureEvents {
            EventKitEventSupplementStore.remove(for: source)
            if let identifier { SharedInviteTracker.localEventWasDeleted(localEventIdentifier: identifier) }
        }
        descriptor.pendingCalendarID = nil
    }
}
