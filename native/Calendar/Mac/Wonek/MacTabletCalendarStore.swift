// Ported from Wonek Main/MacTabletCalendarView.swift. HRApp data adapters are in MacCalendarAdapters.swift.
#if os(macOS)
import SwiftUI
import AppKit
import EventKit
import Combine
@MainActor
final class MacTabletCalendarStore: ObservableObject {
    @Published private(set) var authorizationStatus = EKEventStore.authorizationStatus(for: .event)
    @Published private(set) var events: [EKEvent] = []
    @Published private(set) var calendars: [EKCalendar] = []
    @Published private(set) var visibleCalendarIDs: Set<String> = [] {
        didSet { if !isReloading && oldValue != visibleCalendarIDs { refreshWidgetSnapshot() } }
    }
    @Published private(set) var multiCalendarIDs: Set<String> = []
    @Published var isRequestingAccess = false
    @Published var errorMessage: String?
    @Published var selectedSidebarEvent: CalendarSidebarEvent?

    let eventStore: EKEventStore
    let local: MacAppLocalCalendarBridge
    let includesSystemCalendars: Bool
    private var calendar: Calendar { MacCalendarFormatting.calendar }
    private var eventsByDay: [Date: [EKEvent]] = [:]
    private var dayIndexRange: (interval: DateInterval, timeZoneID: String)?
    private var isReloading = false
    private var didInitializeVisibility = false
    private var backendObserver: AnyCancellable?
    private var interactionActive = false
    private var reloadPending = false
    func setInteractionActive(_ active: Bool) {
        interactionActive = active
        backend.setTimelineInteractionActive(active)
        if !active && reloadPending { reloadPending = false; reload() }
    }
    var backend: CalendarMacStore { local.store.backend }

    init(local: MacAppLocalCalendarBridge = .shared, includesSystemCalendars: Bool = true) {
        self.local = local
        self.eventStore = local.eventStore
        self.includesSystemCalendars = includesSystemCalendars
        // Publish the current local/EventKit snapshot before the first frame.
        // Activation can still request permission, but reopening must not flash
        // an empty Up next row and then push the month card down.
        reload()
        backendObserver = backend.$events.combineLatest(backend.$calendars, backend.$receivedEventUnavailable, backend.$cancelledOutgoingEventIDs).dropFirst().debounce(for: .milliseconds(50), scheduler: RunLoop.main).sink { [weak self] _ in self?.reload() }
    }


    var hasFullAccess: Bool {
        authorizationStatus == .fullAccess
    }

    var writableCalendars: [EKCalendar] {
        calendars.filter { canEdit($0) }
    }

    func canEdit(_ calendar: EKCalendar?) -> Bool { local.canEdit(calendar) }
    func canEdit(_ event: EKEvent?) -> Bool {
        guard let event else { return false }
        let id = local.record(for: event)?.id ?? backend.adapter.identity(event)
        return !isCancelled(event) && backend.receivedEventAccess[id] != .reader && canEdit(event.calendar) && !event.hasAttendees && local.record(for: event)?.readOnly != true
    }
    func canShare(_ event: EKEvent) -> Bool {
        let id = local.record(for: event)?.id ?? backend.adapter.identity(event)
        if isCancelled(event) { return false }
        if let access = backend.receivedEventAccess[id] { return access == .owner }
        if let calendar = local.record(for: event.calendar) { return calendar.canManageSharing }
        return canEdit(event)
    }
    func isCancelled(_ event: EKEvent) -> Bool {
        let id = local.record(for: event)?.id ?? backend.adapter.identity(event)
        return event.status == .canceled || local.record(for: event)?.status == "cancelled"
            || backend.receivedEventUnavailable.contains(id) || backend.cancelledOutgoingEventIDs.contains(id)
    }
    func sidebarEvent(_ event: EKEvent) -> CalendarSidebarEvent {
        CalendarSidebarEvent(event: event, isCancelled: isCancelled(event))
    }
    func canManage(_ calendar: EKCalendar) -> Bool {
        if let record = local.record(for: calendar) { return record.canManageSharing }
        return calendar.allowsContentModifications
    }

    var defaultWritableCalendar: EKCalendar? {
        let preferred = hasFullAccess ? eventStore.defaultCalendarForNewEvents?.calendarIdentifier : nil
        return writableCalendars.first(where: { $0.calendarIdentifier == preferred }) ?? writableCalendars.first
    }

    var multiCalendars: [EKCalendar] {
        calendars.filter { $0.type != .birthday && $0.type != .subscription }
    }

    func toggleMultiCalendar(_ calendar: EKCalendar) {
        let id = calendar.calendarIdentifier
        if !multiCalendarIDs.insert(id).inserted { multiCalendarIDs.remove(id) }
    }

    func activate() async {
        authorizationStatus = EKEventStore.authorizationStatus(for: .event)
        if authorizationStatus == .notDetermined {
            isRequestingAccess = true
            defer { isRequestingAccess = false }
            do {
                _ = try await eventStore.requestFullAccessToEvents()
            } catch {
                errorMessage = error.localizedDescription
            }
            authorizationStatus = EKEventStore.authorizationStatus(for: .event)
        }
        reload()
    }

    func reload() {
        guard !interactionActive else { reloadPending = true; return }
        isReloading = true
        defer { isReloading = false }
        local.prepareSnapshot()
        authorizationStatus = EKEventStore.authorizationStatus(for: .event)
        let systemCalendars = (hasFullAccess && includesSystemCalendars ? eventStore.calendars(for: .event) : []).sorted {
            if $0.source.title == $1.source.title {
                return $0.title.localizedStandardCompare($1.title) == .orderedAscending
            }
            return $0.source.title.localizedStandardCompare($1.source.title) == .orderedAscending
        }

        let previousIDs = Set(calendars.map(\.calendarIdentifier))
        calendars = systemCalendars + (local.store.ownedCalendars + local.store.receivedCalendars).map(local.calendar)

        if !didInitializeVisibility {
            visibleCalendarIDs = Set(calendars.map(\.calendarIdentifier))
            multiCalendarIDs = Set(multiCalendars.map(\.calendarIdentifier))
            didInitializeVisibility = true
        } else {
            let ids = Set(calendars.map(\.calendarIdentifier))
            visibleCalendarIDs.formIntersection(ids)
            visibleCalendarIDs.formUnion(ids.subtracting(previousIDs))
            multiCalendarIDs.formIntersection(ids)
            multiCalendarIDs.formUnion(ids.subtracting(previousIDs))
        }

        let calendar = self.calendar
        let today = calendar.startOfDay(for: Date())
        let start = calendar.date(byAdding: .year, value: -1, to: today) ?? today
        let end = calendar.date(byAdding: .year, value: 3, to: today) ?? today
        let predicate = eventStore.predicateForEvents(withStart: start, end: end, calendars: systemCalendars)
        let nativeEvents = systemCalendars.isEmpty ? [] : eventStore.events(matching: predicate).filter {
            ReceivedSharingVisibility.isVisible(backend.adapter.identity($0), kind: "event")
        }
        let localEvents = local.store.events(from: start, to: end,
            selectedCalendarIDs: Set(local.store.calendars.map(\.id)))
        events = (nativeEvents + localEvents.compactMap(local.event)).sorted {
            if $0.startDate == $1.startDate {
                return $0.title.localizedStandardCompare($1.title) == .orderedAscending
            }
            return $0.startDate < $1.startDate
        }
        dayIndexRange = (DateInterval(start: start, end: end), calendar.timeZone.identifier)
        eventsByDay.removeAll(keepingCapacity: true)
        for event in events {
            var day = max(start, calendar.startOfDay(for: event.startDate))
            repeat {
                guard day < end, event.endDate > day || (event.isAllDay && event.startDate == day && event.endDate == day) else { break }
                eventsByDay[day, default: []].append(event)
                guard let next = calendar.date(byAdding: .day, value: 1, to: day), next > day else { break }
                day = next
            } while day < event.endDate
        }
        refreshWidgetSnapshot()
        if let selected = selectedSidebarEvent?.nativeEvent {
            if local.isLocal(selected) {
                selectedSidebarEvent = events.first { $0 === selected }.map(sidebarEvent)
            } else {
                selectedSidebarEvent = ReceivedSharingVisibility.isVisible(backend.adapter.identity(selected), kind: "event")
                    && selected.refresh() ? sidebarEvent(selected) : nil
            }
        }
    }

    private func refreshWidgetSnapshot() {
        guard includesSystemCalendars else { return } // Isolated interaction QA must not replace real widget data.
        CalendarWidgetStore.saveUpcomingEventsSnapshot(events: filteredEvents())
    }

    func events(on date: Date, calendarID: String? = nil, requiresVisibility: Bool = true) -> [EKEvent] {
        let calendar = self.calendar
        let dayStart = calendar.startOfDay(for: date)
        let dayEnd = calendar.date(byAdding: .day, value: 1, to: dayStart) ?? dayStart
        let candidates: [EKEvent]
        if let range = dayIndexRange, range.timeZoneID == calendar.timeZone.identifier,
           dayStart >= range.interval.start, dayEnd <= range.interval.end {
            candidates = eventsByDay[dayStart] ?? []
        } else {
            candidates = events
        }
        return candidates.filter { event in
            (!requiresVisibility || visibleCalendarIDs.contains(event.calendar.calendarIdentifier))
                && (calendarID == nil || event.calendar.calendarIdentifier == calendarID)
                && event.startDate < dayEnd
                && (event.endDate > dayStart || (event.isAllDay && event.startDate == dayStart && event.endDate == dayStart))
        }
    }

    func showCalendarContaining(_ event: EKEvent) {
        visibleCalendarIDs.insert(event.calendar.calendarIdentifier)
    }

    func focusCalendar(_ identifier: String) { visibleCalendarIDs = [identifier] }

    func filteredEvents(matching query: String = "") -> [EKEvent] {
        let visible = events.filter {
            visibleCalendarIDs.contains($0.calendar.calendarIdentifier)
        }
        let cleaned = query.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !cleaned.isEmpty else { return visible }
        return visible.filter { event in
            event.title.localizedCaseInsensitiveContains(cleaned)
                || (event.location?.localizedCaseInsensitiveContains(cleaned) ?? false)
                || (event.notes?.localizedCaseInsensitiveContains(cleaned) ?? false)
                || event.calendar.title.localizedCaseInsensitiveContains(cleaned)
        }
    }

    func sidebarEvents(in month: Date) -> [EKEvent] {
        let visible = filteredEvents()
        guard hasFullAccess else { return visible }
        let days = CalendarSidebarLayout.monthDays(containing: month, calendar: calendar)
        guard let start = days.first, let last = days.last,
              let end = calendar.date(byAdding: .day, value: 1, to: last) else { return visible }
        let today = calendar.startOfDay(for: Date())
        let loadedStart = calendar.date(byAdding: .year, value: -1, to: today) ?? today
        let loadedEnd = calendar.date(byAdding: .year, value: 3, to: today) ?? today
        guard start < loadedStart || end > loadedEnd else { return visible }
        let selected = calendars.filter { !local.isLocal($0) && visibleCalendarIDs.contains($0.calendarIdentifier) }
        guard !selected.isEmpty else { return visible }
        let extra = eventStore.events(matching: eventStore.predicateForEvents(withStart: start, end: end, calendars: selected))
        var seen = Set<String>()
        return (visible + extra).filter { seen.insert(CalendarSidebarEvent.identity(for: $0)).inserted }
    }

    func toggleCalendar(_ calendar: EKCalendar) {
        let id = calendar.calendarIdentifier
        if visibleCalendarIDs.contains(id) {
            visibleCalendarIDs.remove(id)
        } else {
            visibleCalendarIDs.insert(id)
        }
        objectWillChange.send()
    }

    func selectAll(_ selected: Bool) {
        visibleCalendarIDs = selected ? Set(calendars.map(\.calendarIdentifier)) : []
    }

    @discardableResult
    func save(
        existingEvent: EKEvent?,
        title: String,
        startDate: Date,
        endDate: Date,
        isAllDay: Bool,
        location: String,
        notes: String,
        urlString: String,
        alertOffsets: [TimeInterval?],
        repeatFrequency: EKRecurrenceFrequency?,
        repeatInterval: Int,
        recurrenceEnd: Date?,
        replacesAlerts: Bool,
        replacesRecurrence: Bool,
        structuredLocation: EKStructuredLocation?,
        calendarIdentifier: String,
        supplement: EventKitEventSupplement? = nil,
        recurrencePattern: CalendarRecurrencePattern? = nil,
        providerOptions: CalendarProviderEventOptions? = nil
    ) throws -> EKEvent {
        if let existingEvent, !canEdit(existingEvent) {
            throw MacTabletCalendarError.readOnlyEvent
        }
        guard let selectedCalendar = calendars.first(where: { $0.calendarIdentifier == calendarIdentifier }),
              canEdit(selectedCalendar) else {
            throw MacTabletCalendarError.noWritableCalendar
        }
        let crossesProvider = existingEvent.map { local.isLocal($0) != local.isLocal(selectedCalendar) } ?? false
        let event = existingEvent.map { local.isLocal($0) || crossesProvider ? local.copy($0) : $0 }
            ?? EKEvent(eventStore: eventStore)
        event.title = title.trimmingCharacters(in: .whitespacesAndNewlines)
        event.applyCalendarSchedule(start: startDate, end: max(endDate, startDate.addingTimeInterval(60)),
            allDay: isAllDay, timeZone: event.timeZone ?? .current)
        event.location = location.trimmingCharacters(in: .whitespacesAndNewlines)
        event.structuredLocation = structuredLocation
        event.notes = notes.trimmingCharacters(in: .whitespacesAndNewlines)
        let cleanedURL = urlString.trimmingCharacters(in: .whitespacesAndNewlines)
        event.url = cleanedURL.isEmpty ? nil : URL(string: cleanedURL)
        if existingEvent == nil || replacesAlerts {
            // Keep any additional provider alarms that the two-alert editor
            // does not expose, rather than silently deleting them.
            let extraAlarms = Array((event.alarms ?? []).dropFirst(2))
            event.alarms = alertOffsets.compactMap { $0.map(EKAlarm.init(relativeOffset:)) } + extraAlarms
        }
        if existingEvent == nil || replacesRecurrence {
            let originalRule = event.recurrenceRules?.first
            event.recurrenceRules = repeatFrequency.map { frequency in
                let pattern = recurrencePattern ?? CalendarRecurrencePattern(rule: originalRule,
                    start: startDate, calendar: MacCalendarFormatting.calendar)
                return [pattern.rule(frequency: frequency, interval: repeatInterval, end: recurrenceEnd)]
            }
        }

        event.calendar = selectedCalendar
        do {
            let saved = try local.persist(event, replacing: existingEvent,
                span: existingEvent != nil && event.hasRecurrenceRules ? .futureEvents : .thisEvent,
                supplement: supplement, providerOptions: providerOptions)
            reload()
            return saved
        } catch {
            // A rejected save must not leave a mutated in-memory EventKit row
            // visible as though it had been persisted successfully.
            if let existingEvent, !local.isLocal(existingEvent) { _ = existingEvent.refresh() }
            reload()
            throw error
        }
    }

    /// A drop changes only the schedule/destination, preserving all other event metadata.
    func reschedule(_ event: EKEvent, interval: DateInterval, isAllDay: Bool,
                    calendarID: String, span: EKSpan) throws {
        guard canEdit(event) else { throw MacTabletCalendarError.readOnlyEvent }
        guard let destination = writableCalendars.first(where: { $0.calendarIdentifier == calendarID }) else { throw MacTabletCalendarError.noWritableCalendar }
        if let source = local.record(for: event.calendar), let series = local.record(for: event),
           CalendarEditorProvider(id: source.id, source: source.source) == nil, !series.macRecurrenceRules.isEmpty {
            let plan = try AppLocalRecurrence.reschedule(series, occurrence: event.startDate, interval: interval,
                allDay: isAllDay, span: span, newID: DeviceCalendarReplica.hash(UUID().uuidString))
            var documents = local.store.calendars
            guard let index = documents.firstIndex(where: { $0.id == source.id }) else { throw MacTabletCalendarError.noWritableCalendar }
            documents[index].events.removeAll { $0.id == series.id }
            if let retained = plan.retained { documents[index].events.append(retained) }
            if let target = local.record(for: destination), let i = documents.firstIndex(where: { $0.id == target.id }) {
                documents[i].events.append(plan.moved)
                try local.store.backend.replaceLocalCalendars(documents)
            } else {
                let supplement = local.supplement(for: event)
                let draft = local.copy(event)
                draft.applyCalendarSchedule(start: interval.start, end: interval.end, allDay: isAllDay, timeZone: draft.timeZone)
                draft.calendar = destination
                draft.recurrenceRules = plan.moved.macRecurrenceRules.compactMap { $0.makeRule() }
                try eventStore.save(draft, span: .thisEvent, commit: true)
                do { try local.store.backend.replaceLocalCalendars(documents) }
                catch { try eventStore.remove(draft, span: .futureEvents, commit: true); throw error }
                if let data = supplement {
                    EventKitEventSupplementStore.update(travelTime: data.travelTime, attachments: data.attachments, videoCallURL: data.videoCallURL, for: draft)
                }
            }
            reload()
            return
        }
        if local.isLocal(event) || local.isLocal(destination) {
            let draft = local.copy(event)
            draft.applyCalendarSchedule(start: interval.start, end: interval.end, allDay: isAllDay, timeZone: draft.timeZone)
            draft.calendar = destination
            try local.persist(draft, replacing: event, span: span)
            reload()
            return
        }
        let supplement = EventKitEventSupplementStore.supplement(for: event)
        let originalStart: Date = event.startDate
        let originalEnd = event.calendarRangeEnd
        let originalZone = event.timeZone
        let originalAllDay = event.isAllDay
        let originalCalendar = event.calendar
        event.applyCalendarSchedule(start: interval.start, end: interval.end, allDay: isAllDay, timeZone: originalZone)
        event.calendar = destination
        do {
            try eventStore.save(event, span: span, commit: true)
        } catch {
            event.applyCalendarSchedule(start: originalStart, end: originalEnd, allDay: originalAllDay, timeZone: originalZone)
            event.calendar = originalCalendar
            _ = event.refresh()
            reload()
            throw error
        }
        if let supplement {
            EventKitEventSupplementStore.update(travelTime: supplement.travelTime,
                attachments: supplement.attachments, videoCallURL: supplement.videoCallURL, for: event)
        }
        reload()
    }

    func delete(_ event: EKEvent, span: EKSpan = .thisEvent) throws {
        try local.delete(event, span: span)
        reload()
    }

    @discardableResult
    func duplicate(_ event: EKEvent) throws -> EKEvent {
        guard canEdit(event) else {
            throw MacTabletCalendarError.readOnlyEvent
        }

        let copy = EKEvent(eventStore: eventStore)
        copy.title = event.title
        copy.applyCalendarSchedule(start: event.startDate, end: event.calendarRangeEnd, allDay: event.isAllDay, timeZone: event.timeZone)
        copy.location = event.location
        copy.structuredLocation = event.structuredLocation
        copy.notes = event.notes
        copy.url = event.url
        copy.availability = event.availability
        copy.calendar = event.calendar
        copy.recurrenceRules = event.recurrenceRules
        copy.alarms = event.alarms?.compactMap { alarm in
            if let absoluteDate = alarm.absoluteDate {
                return EKAlarm(absoluteDate: absoluteDate)
            }
            return EKAlarm(relativeOffset: alarm.relativeOffset)
        }

        if local.isLocal(event) {
            let saved = try local.persist(copy, replacing: nil, span: .thisEvent, supplement: local.supplement(for: event))
            reload()
            return saved
        }
        try eventStore.save(copy, span: .thisEvent, commit: true)
        if let supplement = EventKitEventSupplementStore.supplement(for: event) {
            EventKitEventSupplementStore.update(travelTime: supplement.travelTime,
                attachments: supplement.attachments, videoCallURL: supplement.videoCallURL, for: copy)
        }
        reload()
        return copy
    }

    func deleteCalendar(_ calendar: EKCalendar) async throws {
        if let record = local.record(for: calendar) {
            if record.origin == .received { try await backend.leaveReceivedCalendar(id: record.id) }
            else {
                try local.store.removeCalendar(id: record.id)
                try backend.ownedSharing.recordDeletion(localID: record.id)
            }
            reload()
            return
        }
        guard calendar.allowsContentModifications, !calendar.isSubscribed else { throw MacTabletCalendarError.readOnlyEvent }
        let id = calendar.calendarIdentifier
        try eventStore.removeCalendar(calendar, commit: true)
        try backend.ownedSharing.recordDeletion(localID: id)
        visibleCalendarIDs.remove(id)
        multiCalendarIDs.remove(id)
        reload()
        Task { await backend.sync() }
    }

    func saveCalendar(_ existing: EKCalendar?, title: String, color: NSColor,
                      destination: MacCalendarEditorTarget.Destination,
                      usesCreatorDefault: Bool = false) async throws {
        let trimmed = title.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }
        if let existing, let record = local.record(for: existing) {
            if record.origin == .received {
                try await backend.saveReceivedCalendar(id: record.id, title: trimmed, localColor: usesCreatorDefault ? nil : color)
            } else { try local.store.updateCalendar(id: record.id, title: trimmed, color: color) }
            reload()
            return
        }
        if existing == nil && destination == .local {
            _ = try local.store.createCalendar(title: trimmed, color: color)
            reload()
            return
        }
        if let existing, !existing.allowsContentModifications { throw MacTabletCalendarError.readOnlyEvent }
        let calendarToSave = existing ?? EKCalendar(for: .event, eventStore: eventStore)
        if existing == nil {
            // Never silently put an iCloud calendar in a different account.
            let source = eventStore.sources.first {
                $0.title.localizedCaseInsensitiveContains("iCloud")
            }
            guard let source else { throw MacTabletCalendarError.missingAccount("iCloud") }
            calendarToSave.source = source
        }
        let oldTitle = calendarToSave.title
        let oldColor = calendarToSave.cgColor
        calendarToSave.title = trimmed
        calendarToSave.cgColor = color.cgColor
        do {
            try eventStore.saveCalendar(calendarToSave, commit: true)
            reload()
            visibleCalendarIDs.insert(calendarToSave.calendarIdentifier)
        } catch {
            calendarToSave.title = oldTitle
            calendarToSave.cgColor = oldColor
            throw error
        }
    }

    func color(for eventCalendar: EKCalendar?) -> Color {
        guard let cgColor = eventCalendar?.cgColor,
              let nsColor = NSColor(cgColor: cgColor) else { return .blue }
        return Color(nsColor: nsColor)
    }
}

enum MacTabletCalendarError: LocalizedError {
    case noWritableCalendar
    case readOnlyEvent
    case missingAccount(String)

    var errorDescription: String? {
        switch self {
        case .noWritableCalendar:
            NSLocalizedString("There is no writable calendar available.", comment: "")
        case .readOnlyEvent:
            NSLocalizedString("This event belongs to a read-only calendar.", comment: "")
        case .missingAccount(let name):
            String.localizedStringWithFormat(NSLocalizedString("The %@ calendar account is not available on this Mac. Add the account in System Settings and try again.", comment: ""), NSLocalizedString(name, comment: ""))
        }
    }
}


#endif
