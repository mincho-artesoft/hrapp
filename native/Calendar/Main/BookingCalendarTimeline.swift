import SwiftUI
import EventKit

struct BookingTimelineMove: Equatable {
    let calendarID: String
    let revision: Int
    let entry: BookingTimelineEntry
    let interval: DateInterval
}

// Display occurrences only. Both the slots and the reservations belong to this host calendar.
struct BookingTimelineEntry: Identifiable, Equatable {
    let id: String
    let slotID: String
    var requestID: String? = nil
    var readOnly = false
    var proposed = false
    var saving = false
    let title: String
    let status: BookingEventStatus
    let location: String?
    let start: Date
    let end: Date

    static func entries(in schedule: HostedBookingCalendar, from lower: Date, to upper: Date, moves: [BookingTimelineMove] = []) -> [Self] {
        let bookings = schedule.requests.filter { $0.status != "declined" }
        let reservations = bookings.flatMap { booking -> [Self] in
            func entry(_ slot: BookingInterval, proposed: Bool) -> Self? {
                let start = BookingInterval.date(slot.start), end = BookingInterval.date(slot.end)
                guard start < upper, end > lower, end > start else { return nil }
                let title = [slot.title, booking.guestName].compactMap { $0 }.filter { !$0.isEmpty }.joined(separator: " · ")
                return Self(id: (proposed ? "proposal-" : "request-") + booking.id, slotID: booking.slotId,
                    requestID: booking.id, readOnly: booking.proposal != nil || booking.status == "past", proposed: proposed,
                    title: title, status: proposed ? .pending : booking.eventStatus, location: slot.location, start: start, end: end)
            }
            var values: [Self] = []
            if booking.proposal?.start != booking.start || booking.proposal?.end != booking.end,
               let original = entry(booking.interval, proposed: false) { values.append(original) }
            if let proposal = booking.proposal, let next = entry(proposal, proposed: true) { values.append(next) }
            return values
        }
        var result = reservations
        for slot in schedule.slots {
            let seed = BookingInterval.date(slot.start)
            let duration = BookingInterval.date(slot.end).timeIntervalSince(seed)
            guard seed < upper, duration > 0, seed != .distantPast else { continue }
            var starts: Set<Date> = [seed]
            if let rule = slot.rule?.timelineRule(in: slot.timeZone) {
                let lowerStart = max(seed, lower.addingTimeInterval(-duration))
                starts.formUnion(rule.recurrences(of: seed, in: lowerStart..<upper))
            }
            let excluded = Set((slot.excludedStarts ?? []).map(BookingInterval.date))
            for start in starts where !excluded.contains(start) {
                let end = start.addingTimeInterval(duration)
                guard start >= seed, end > lower else { continue }
                let id = start == seed ? slot.id : "\(slot.id)@\(Int64((start.timeIntervalSince1970 * 1000).rounded()))"
                guard !reservations.contains(where: { $0.start < end && $0.end > start }) else { continue }
                result.append(Self(id: "slot-" + id, slotID: id, title: slot.title ?? "", status: .unreserved(ending: end), location: slot.location, start: start, end: end))
            }
        }
        for move in moves where move.calendarID == schedule.id && move.revision == schedule.revision {
            let entry = move.entry
            if let original = result.firstIndex(where: { $0.id == entry.id }) {
                if entry.requestID == nil {
                    result.remove(at: original)
                } else {
                    result[original].saving = true
                }
            }
            let interval = move.interval
            guard interval.start < upper, interval.end > lower else { continue }
            let booked = entry.requestID != nil
            result.append(Self(id: entry.requestID.map { "proposal-" + $0 } ?? entry.id, slotID: entry.slotID,
                requestID: entry.requestID, proposed: booked, saving: true, title: entry.title,
                status: booked ? .pending : .unreserved(ending: interval.end), location: entry.location,
                start: interval.start, end: interval.end))
        }
        return result.sorted { ($0.start, $0.id) < ($1.start, $1.id) }
    }
}

private extension SharedEventRecurrenceRule {
    func timelineRule(in zone: String?) -> Calendar.RecurrenceRule? {
        typealias Rule = Calendar.RecurrenceRule
        let frequencies: [Rule.Frequency] = [.daily, .weekly, .monthly, .yearly]
        guard frequencies.indices.contains(frequency), interval > 0 else { return nil }
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = zone.flatMap(TimeZone.init(identifier:)) ?? .current
        calendar.firstWeekday = 2
        calendar.minimumDaysInFirstWeek = 4
        let weekdays: [Locale.Weekday] = [.sunday, .monday, .tuesday, .wednesday, .thursday, .friday, .saturday]
        let pattern = (daysOfTheWeek ?? []).compactMap { day -> Rule.Weekday? in
            guard (1...7).contains(day.weekday) else { return nil }
            let weekday = weekdays[day.weekday - 1]
            return day.weekNumber == 0 ? .every(weekday) : .nth(day.weekNumber, weekday)
        }
        let end: Rule.End
        if let endDate { end = .afterDate(BookingInterval.date(endDate)) }
        else if let occurrenceCount, occurrenceCount > 0 { end = .afterOccurrences(occurrenceCount) }
        else { end = .never }
        return Rule(calendar: calendar, frequency: frequencies[frequency], interval: interval, end: end,
                    matchingPolicy: .strict, months: (monthsOfTheYear ?? []).map { Rule.Month($0) },
                    daysOfTheYear: daysOfTheYear ?? [], daysOfTheMonth: daysOfTheMonth ?? [],
                    weeks: weeksOfTheYear ?? [], weekdays: pattern, setPositions: setPositions ?? [])
    }
}

struct BookingCalendarTimeline: View {
    let schedule: HostedBookingCalendar
    let moves: [BookingTimelineMove]
    let onBack: () -> Void
    let onEdit: (BookingTimelineEntry) -> Void
    let onMove: (BookingTimelineEntry, DateInterval) -> Void
    let onCreate: (DateInterval) -> Void
    @State private var eventEntries: [ObjectIdentifier: BookingTimelineEntry] = [:]
    @Environment(\.calendar) private var calendar
    @Environment(\.locale) private var locale
    @State private var start = Calendar.current.startOfDay(for: .now)
    @State private var end = Calendar.current.date(byAdding: .day, value: 7, to: Calendar.current.startOfDay(for: .now))!
    @State private var events: [EKEvent] = []
    #if os(macOS)
    @EnvironmentObject private var store: MacTabletCalendarStore
    @State private var pickingRange = false
    @State private var creationCalendar: EKCalendar?
    #endif

    private struct Projection: Equatable {
        let title: String
        let locale: Locale
        let entries: [BookingTimelineEntry]
    }

    var body: some View {
        let upper = calendar.date(byAdding: .day, value: 1, to: calendar.startOfDay(for: end)) ?? end
        let projection = Projection(title: schedule.title, locale: locale,
            entries: BookingTimelineEntry.entries(in: schedule, from: calendar.startOfDay(for: start), to: upper, moves: moves))
        timeline
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .onChange(of: projection, initial: true) { _, value in
                // These unsaved objects only supply the existing event-card renderers with their display model.
                #if os(macOS)
                let displayStore = store.eventStore
                #else
                let displayStore = CalendarViewModel.shared.eventStore
                #endif
                var calendars: [BookingEventStatus: EKCalendar] = [:]
                for status in Set(value.entries.map(\.status)) {
                    let calendar = EKCalendar(for: .event, eventStore: displayStore)
                    calendar.title = value.title
                    #if os(macOS)
                    calendar.cgColor = NSColor(status.color).cgColor
                    #else
                    calendar.cgColor = UIColor(status.color).cgColor
                    #endif
                    calendars[status] = calendar
                }
                var lookup: [ObjectIdentifier: BookingTimelineEntry] = [:]
                events = value.entries.map { entry in
                    let event = EKEvent(eventStore: displayStore)
                    event.calendar = calendars[entry.status]
                    event.startDate = entry.start
                    event.endDate = entry.end
                    event.location = entry.location
                    event.title = [entry.title, NSLocalizedString(entry.proposed ? "Proposed change" : entry.status.label, comment: "")].filter { !$0.isEmpty }.joined(separator: " · ")
                    lookup[ObjectIdentifier(event)] = entry
                    return event
                }
                eventEntries = lookup
                #if os(macOS)
                if creationCalendar == nil {
                    let destination = EKCalendar(for: .event, eventStore: displayStore)
                    destination.cgColor = NSColor(BookingEventStatus.available.color).cgColor
                    creationCalendar = destination
                }
                #endif
            }
    }

    @ViewBuilder private var timeline: some View {
        #if os(macOS)
        let dayCount = max(1, (calendar.dateComponents([.day], from: start, to: end).day ?? 0) + 1)
        let formatter = MacCalendarFormatting.dateFormatter()
        let rangeTitle = formatter.string(from: start) + " - " + formatter.string(from: end)
        VStack(spacing: 0) {
            GeometryReader { geometry in
                HStack(spacing: 0) {
                    HStack(spacing: CalendarHeaderLayout.spacing) {
                        Button(action: onBack) {
                            Image(systemName: "chevron.backward")
                                .frame(width: CalendarHeaderLayout.buttonSize, height: CalendarHeaderLayout.buttonSize)
                                .contentShape(Rectangle())
                        }
                        .buttonStyle(.plain).foregroundStyle(Color.appBlue).accessibilityLabel("Back")
                        Text(verbatim: schedule.title).font(CalendarTypography.headline).lineLimit(1)
                            .accessibilityAddTraits(.isHeader)
                    }
                    .padding(.horizontal, CalendarHeaderLayout.horizontalInset)
                    .frame(width: CalendarSidebarLayout.width(availableWidth: geometry.size.width), alignment: .leading)
                    Divider().hidden()
                    MacCalendarRangeButton(title: rangeTitle) { pickingRange.toggle() }
                        .padding(.horizontal, CalendarHeaderLayout.horizontalInset)
                    Spacer(minLength: 0)
                }
                .frame(maxHeight: .infinity)
            }
            .frame(height: CalendarHeaderLayout.height)
            Divider()
            MacTabletMultiDayView(store: store, startDate: Binding(get: { start }, set: { day in
                start = day
                end = day
            }), dayCount: dayCount, selectedTab: .constant(3), editorTarget: .constant(nil), scopedEvents: events,
                scopedActions: .init(destination: creationCalendar, editable: editable, edit: edit, move: move, create: onCreate))
        }
        .macCalendarRangePicker(isPresented: $pickingRange, start: start, end: end) { first, last in
            start = first
            end = last
        }
        #else
        BookingPinnedTimeline(title: schedule.title, start: $start, end: $end, events: events, onBack: onBack, editable: editable, edit: edit, move: move, create: onCreate)
            .ignoresSafeArea(.all, edges: CalendarSafeAreaLayout.ignoredEdges(.all))
        #endif
    }
    private func editable(_ event: EKEvent) -> Bool {
        guard let entry = eventEntries[ObjectIdentifier(event)] else { return false }
        return !entry.readOnly && !entry.saving
    }
    private func edit(_ event: EKEvent) {
        if let entry = eventEntries[ObjectIdentifier(event)], !entry.saving { onEdit(entry) }
    }
    private func move(_ event: EKEvent, _ interval: DateInterval) {
        if let entry = eventEntries[ObjectIdentifier(event)], editable(event),
           entry.start != interval.start || entry.end != interval.end { onMove(entry, interval) }
    }

}

#if os(iOS)
private struct BookingPinnedTimeline: UIViewRepresentable {
    let title: String
    @Binding var start: Date
    @Binding var end: Date
    let events: [EKEvent]
    let onBack: () -> Void

    let editable: (EKEvent) -> Bool
    let edit: (EKEvent) -> Void
    let move: (EKEvent, DateInterval) -> Void
    let create: (DateInterval) -> Void

    func makeUIView(context: Context) -> TwoWayPinnedMultiDayContainerView {
        let view = TwoWayPinnedMultiDayContainerView()
        view.weekView.onEventConvertToAllDay = nil
        view.allDayView.isUserInteractionEnabled = false
        view.onRangeChange = { start = $0; end = $1 }
        view.onDayLabelTap = { start = $0; end = $0 }
        return view
    }

    func updateUIView(_ view: TwoWayPinnedMultiDayContainerView, context: Context) {
        let calendar = Calendar.current
        view.weekView.scopedEditable = { descriptor in (descriptor as? EKMultiDayWrapper).map { editable($0.realEvent) } ?? false }
        view.onEventEdit = { descriptor in if let part = descriptor as? EKMultiDayWrapper { edit(part.realEvent) } }
        view.onEventTap = view.onEventEdit
        view.onEventDragEnded = { descriptor, _, allDay in
            if !allDay, let part = descriptor as? EKMultiDayWrapper { move(part.realEvent, part.dateInterval) }
        }
        view.onEventDragResizeEnded = { descriptor, _ in
            if let part = descriptor as? EKMultiDayWrapper { move(part.realEvent, part.dateInterval) }
        }
        view.onEmptyLongPress = { interval, _ in create(interval) }
        view.scopedTitle = title
        view.onScopeBack = onBack
        view.semanticContentAttribute = context.environment.layoutDirection == .rightToLeft ? .forceRightToLeft : .forceLeftToRight
        if view.fromDate != start { view.fromDate = start }
        if view.toDate != end { view.toDate = end }
        let upper = calendar.date(byAdding: .day, value: 1, to: calendar.startOfDay(for: end)) ?? end
        view.weekView.regularLayoutAttributes = events.flatMap { event -> [EventLayoutAttributes] in
            var cursor = max(start, event.startDate)
            let last = min(upper, event.endDate)
            var parts: [EventLayoutAttributes] = []
            while cursor < last, let day = calendar.dateInterval(of: .day, for: cursor) {
                let next = min(last, day.end)
                let part = EKMultiDayWrapper(realEvent: event, partialStart: cursor, partialEnd: next)
                parts.append(EventLayoutAttributes(part))
                cursor = next
            }
            return parts
        }
        view.setNeedsLayout()
    }
}
#endif
