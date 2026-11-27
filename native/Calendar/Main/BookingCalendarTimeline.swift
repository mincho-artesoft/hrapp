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
    var canDelete: Bool { requestID == nil && !readOnly && !saving }
    let title: String
    let status: BookingEventStatus
    let location: String?
    var videoCallURL: String?
    var allDay = false
    var zone: String?
    let start: Date
    let end: Date

    // All-day events keep the owner's calendar dates when viewed in another time zone.
    func dates(_ interval: DateInterval, displayedIn viewer: Calendar, forSaving: Bool = false) -> DateInterval {
        guard allDay, let timeZone = zone.flatMap(TimeZone.init(identifier:)), timeZone != viewer.timeZone else { return interval }
        var owner = viewer
        owner.timeZone = timeZone
        let from = forSaving ? viewer : owner
        let to = forSaving ? owner : viewer
        func midnight(_ date: Date) -> Date {
            to.date(from: from.dateComponents([.era, .year, .month, .day], from: date)) ?? date
        }
        return DateInterval(start: midnight(interval.start), end: midnight(interval.end))
    }

    static func entries(in schedule: HostedBookingCalendar, from lower: Date, to upper: Date, moves: [BookingTimelineMove] = []) -> [Self] {
        let bookings = schedule.requests.filter { $0.status != "declined" }
        var holds: [DateInterval] = []
        var result: [Self] = []
        for booking in bookings {
            let original = booking.interval
            let slot = booking.proposal ?? original
            let move = booking.proposal == nil ? moves.first { $0.calendarID == schedule.id && $0.revision == schedule.revision && $0.entry.requestID == booking.id } : nil
            let proposed = booking.proposal != nil || move != nil
            let start = move?.interval.start ?? BookingInterval.date(slot.start)
            let end = move?.interval.end ?? BookingInterval.date(slot.end)
            let agreedStart = BookingInterval.date(original.start), agreedEnd = BookingInterval.date(original.end)
            if proposed && agreedEnd > agreedStart { holds.append(DateInterval(start: agreedStart, end: agreedEnd)) }
            guard start < upper, end > lower, end > start else { continue }
            holds.append(DateInterval(start: start, end: end))
            let title = [slot.title, bookingParticipantName(booking.guestName)].compactMap { $0 }.filter { !$0.isEmpty }.joined(separator: " · ")
            result.append(Self(id: "request-" + booking.id, slotID: booking.slotId, requestID: booking.id,
                               readOnly: proposed || booking.status == "past", proposed: proposed, saving: move != nil,
                               title: title, status: proposed ? .pending : booking.eventStatus, location: slot.location,
                               videoCallURL: slot.videoCallURL, allDay: slot.allDay == true, zone: slot.timeZone, start: start, end: end))
        }
        for slot in schedule.slots {
            let seed = BookingInterval.date(slot.start)
            let duration = BookingInterval.date(slot.end).timeIntervalSince(seed)
            guard seed < upper, duration > 0, seed != .distantPast else { continue }
            var local = Calendar(identifier:.gregorian)
            local.timeZone = slot.timeZone.flatMap(TimeZone.init(identifier:)) ?? .current
            let minutes = slot.dailyPattern?.minutes(duration:duration/60) ?? slot.hoursOfDay?.map { $0*60 + local.component(.minute,from:seed) }
            var starts: Set<Date> = slot.dailyPattern == nil ? [seed] : []
            let allDay = slot.allDay == true
            var utc = Calendar(identifier: .gregorian)
            utc.timeZone = .gmt
            func civilDate(_ date: Date) -> Date {
                utc.date(from: local.dateComponents([.year, .month, .day], from: date))!
            }
            let dayCount = allDay ? max(1, Int(civilDate(BookingInterval.date(slot.end)).timeIntervalSince(civilDate(seed)) / 86400)) : 0
            let lowerStart = max(seed, lower.addingTimeInterval(-duration - (dayCount > 0 ? 86400 : 0)))
            if let minutes, let rule = slot.rule {
                starts.formUnion(rule.intradayStarts(seed: seed, minutes: minutes, timeZone: slot.timeZone, in: lowerStart..<upper))
            } else if allDay, let model = slot.rule {
                let until = model.endDate.map { civilDate(BookingInterval.date($0)) }
                if let rule = model.timelineRule(in: "UTC", ending: until) {
                    let last = civilDate(upper).addingTimeInterval(86400)
                    for date in rule.recurrences(of: civilDate(seed), in: civilDate(lowerStart)..<last) {
                        let parts = utc.dateComponents([.year, .month, .day], from: date)
                        if let first = local.date(from: parts) { starts.insert(local.startOfDay(for: first)) }
                    }
                }
            } else if let rule = slot.rule?.timelineRule(in: slot.timeZone) {
                starts.formUnion(rule.recurrences(of: seed, in: lowerStart..<upper))
            }
            let excluded = Set((slot.excludedStarts ?? []).map(BookingInterval.date))
            for start in starts where !excluded.contains(start) {
                let end = allDay ? local.startOfDay(for: local.date(byAdding: .day, value: dayCount, to: start)!) : start.addingTimeInterval(duration)
                guard start >= seed, start < upper, end > lower else { continue }
                let id = start == seed ? slot.id : "\(slot.id)@\(Int64((start.timeIntervalSince1970 * 1000).rounded()))"
                guard !holds.contains(where: { $0.start < end && $0.end > start }) else { continue }
                result.append(Self(id: "slot-" + id, slotID: id, title: slot.title ?? "", status: .unreserved(ending: end), location: slot.location, videoCallURL: slot.videoCallURL, allDay: slot.allDay == true, zone: slot.timeZone, start: start, end: end))
            }
        }
        return result.sorted { ($0.start, $0.id) < ($1.start, $1.id) }
    }
}

private extension SharedEventRecurrenceRule {
    func intradayStarts(seed: Date, minutes: [Int], timeZone: String?, in range: Range<Date>) -> [Date] {
        guard (0...3).contains(frequency), interval > 0, !minutes.isEmpty else { return [] }
        let zone = timeZone.flatMap(TimeZone.init(identifier:)) ?? .current
        // Expand in wall time so a DST gap skips only the missing slot. The server
        // resolves an ambiguous wall time from UTC using the same offset iteration.
        func wall(_ date: Date) -> Date { date.addingTimeInterval(Double(zone.secondsFromGMT(for: date))) }
        func instant(_ local: Date) -> Date? {
            var value = local
            for _ in 0..<4 {
                let delta = local.timeIntervalSince(wall(value))
                if delta == 0 { return value }
                value = value.addingTimeInterval(delta)
            }
            return nil
        }
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = .gmt
        calendar.firstWeekday = 2
        calendar.minimumDaysInFirstWeek = 4
        let anchor = wall(seed), until = endDate.map(BookingInterval.date)
        let component: Calendar.Component = [.day, .weekOfYear, .month, .year][frequency]
        guard var period = calendar.dateInterval(of: component, for: anchor)?.start else { return [] }
        let parts = calendar.dateComponents([.month, .weekday, .day, .hour], from: anchor)
        let withinMinute = anchor.timeIntervalSince(calendar.startOfDay(for: anchor)).truncatingRemainder(dividingBy:60)
        if occurrenceCount == nil {
            let distance = calendar.dateComponents([component], from: period, to: wall(range.lowerBound)).value(for: component) ?? 0
            let skip = max(0, distance / interval - 1) * interval
            period = calendar.date(byAdding: component, value: skip, to: period) ?? period
        }
        let upper = wall(min(range.upperBound, until ?? range.upperBound)).addingTimeInterval(86400)
        var result: [Date] = [], count = 0
        while period < upper {
            guard let span = calendar.dateInterval(of: component, for: period),
                  let next = calendar.date(byAdding: component, value: interval, to: period), next > period else { break }
            var days: [Date] = [], day = span.start
            while day < span.end {
                if AppLocalRecurrence.matches(day, rule: self, original: parts, calendar: calendar) { days.append(day) }
                day = day.addingTimeInterval(86400)
            }
            if let positions = setPositions, !positions.isEmpty {
                days = Set(positions.compactMap { pos in
                    let index = pos > 0 ? pos - 1 : days.count + pos
                    return days.indices.contains(index) ? days[index] : nil
                }).sorted()
            }
            for day in days {
                for minute in minutes {
                    let local = day.addingTimeInterval(Double(minute * 60) + withinMinute)
                    guard local >= anchor else { continue }
                    count += 1
                    if let occurrenceCount, count > occurrenceCount { return result }
                    if let time = local == anchor ? seed : instant(local), range.contains(time),
                       until.map({ time <= $0 }) ?? true { result.append(time) }
                }
            }
            period = next
        }
        return result
    }

    func timelineRule(in zone: String?, ending: Date? = nil) -> Calendar.RecurrenceRule? {
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
        if let endDate { end = .afterDate(ending ?? BookingInterval.date(endDate)) }
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
    let decidingRequests: Set<String>
    let onDecide: (String, BookingDecision) -> Void
    let onBack: () -> Void
    let onAdd: () -> Void
    let onEdit: (BookingTimelineEntry) -> Void
    let onDelete: (BookingTimelineEntry) -> Void
    let onMove: (BookingTimelineEntry, DateInterval) -> Void
    let onCreate: (DateInterval, Bool) -> Void
    @State private var showingAvailability = false
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
        let zone: TimeZone
        let entries: [BookingTimelineEntry]
    }

    var body: some View {
        let upper = calendar.date(byAdding: .day, value: 1, to: calendar.startOfDay(for: end)) ?? end
        let lower = calendar.startOfDay(for: start)
        // Midnight in the booking's zone can fall on either adjacent date for this viewer.
        let candidates = BookingTimelineEntry.entries(in: schedule, from: lower.addingTimeInterval(-2 * 86400),
            to: upper.addingTimeInterval(2 * 86400), moves: moves)
        let projection = Projection(title: schedule.title, locale: locale, zone: calendar.timeZone, entries: candidates.filter { entry in
            let dates = entry.dates(DateInterval(start: entry.start, end: entry.end), displayedIn: calendar)
            return dates.start < upper && dates.end > lower
        })
        timeline
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .appSheet(isPresented: $showingAvailability) { BookingAvailabilitySheet(calendarID: schedule.id) }
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
                    event.isAllDay = entry.allDay
                    let dates = entry.dates(DateInterval(start: entry.start, end: entry.end), displayedIn: calendar)
                    event.startDate = dates.start
                    event.endDate = dates.end
                    event.location = entry.location
                    if let link = entry.videoCallURL {
                        let label = NSLocalizedString("Video Call", comment: "")
                        event.notes = "----( Video Call )----\n[\(label)]\n\(link)\n---===---"
                    }
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
                        headerButton("Back", symbol: "chevron.backward", action: onBack)
                        BookingCalendarHeaderTitle(name: schedule.title)
                    }
                    .padding(.horizontal, CalendarHeaderLayout.horizontalInset)
                    .frame(width: CalendarSidebarLayout.width(availableWidth: geometry.size.width), alignment: .leading)
                    Divider().hidden()
                    MacCalendarRangeButton(title: rangeTitle) { pickingRange.toggle() }
                        .padding(.horizontal, CalendarHeaderLayout.horizontalInset)
                    Spacer(minLength: 0)
                    headerButton("Add time slot", symbol: "plus", action: onAdd)
                    headerButton("Available times", symbol: "list.bullet") { showingAvailability = true }
                        .padding(.trailing, CalendarHeaderLayout.horizontalInset)
                }
                .frame(maxHeight: .infinity)
            }
            .frame(height: CalendarHeaderLayout.height)
            Divider()
            MacTabletMultiDayView(store: store, startDate: Binding(get: { start }, set: { day in
                start = day
                end = day
            }), dayCount: dayCount, selectedTab: .constant(3), editorTarget: .constant(nil), scopedEvents: events,
                scopedActions: .init(destination: creationCalendar, editable: editable, edit: edit, deletable: deletable, delete: delete, response: response, move: move, create: onCreate))
        }
        .macCalendarRangePicker(isPresented: $pickingRange, start: start, end: end) { first, last in
            start = first
            end = last
        }
        #else
        BookingPinnedTimeline(title: schedule.title, start: $start, end: $end, events: events, onBack: onBack, onAdd: onAdd,
                              onAvailability: { showingAvailability = true }, editable: editable, edit: edit, deletable: deletable, delete: delete, response: response, move: move, create: onCreate)
            .ignoresSafeArea(.all, edges: CalendarSafeAreaLayout.ignoredEdges(.all))
        #endif
    }
    #if os(macOS)
    private func headerButton(_ title: LocalizedStringKey, symbol: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Image(systemName: symbol)
                .resizable()
                .scaledToFit()
                .fontWeight(.medium)
                .frame(width: 18, height: 18)
                .frame(width: 44, height: 44)
                .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .foregroundStyle(Color.appBlue)
        .accessibilityLabel(Text(title))
        .help(Text(title))
    }
    #endif

    private func editable(_ event: EKEvent) -> Bool {
        guard let entry = eventEntries[ObjectIdentifier(event)] else { return false }
        return !entry.readOnly && !entry.saving
    }
    private func edit(_ event: EKEvent) {
        if let entry = eventEntries[ObjectIdentifier(event)], !entry.saving { onEdit(entry) }
    }
    private func response(_ event: EKEvent) -> ((BookingDecision) -> Void)? {
        guard let entry = eventEntries[ObjectIdentifier(event)], !entry.saving, !entry.proposed, !entry.readOnly,
              let id = entry.requestID, !decidingRequests.contains(id),
              schedule.requests.contains(where: { $0.id == id && $0.needsHostResponse }) else { return nil }
        return { decision in onDecide(id, decision) }
    }
    private func deletable(_ event: EKEvent) -> Bool {
        eventEntries[ObjectIdentifier(event)]?.canDelete == true
    }
    private func delete(_ event: EKEvent) {
        if let entry = eventEntries[ObjectIdentifier(event)], entry.canDelete { onDelete(entry) }
    }
    private func move(_ event: EKEvent, _ interval: DateInterval, _ allDay: Bool) {
        guard var entry = eventEntries[ObjectIdentifier(event)], editable(event) else { return }
        event.isAllDay = entry.allDay
        let wasAllDay = entry.allDay
        entry.allDay = allDay
        let destination = entry.dates(interval, displayedIn: calendar, forSaving: true)
        guard entry.start != destination.start || entry.end != destination.end || wasAllDay != allDay else { return }
        onMove(entry, destination)
    }

}

#if os(iOS)
private struct BookingPinnedTimeline: UIViewRepresentable {
    final class Coordinator {
        var renderedEvents: [ObjectIdentifier] = []
        var allDaySliceStarts: [ObjectIdentifier: Date] = [:]
        var range: DateInterval?
        var timeZone: TimeZone?
    }
    func makeCoordinator() -> Coordinator { Coordinator() }
    let title: String
    @Binding var start: Date
    @Binding var end: Date
    let events: [EKEvent]
    let onBack: () -> Void
    let onAdd: () -> Void
    let onAvailability: () -> Void

    let editable: (EKEvent) -> Bool
    let edit: (EKEvent) -> Void
    let deletable: (EKEvent) -> Bool
    let delete: (EKEvent) -> Void
    let response: (EKEvent) -> ((BookingDecision) -> Void)?
    let move: (EKEvent, DateInterval, Bool) -> Void
    let create: (DateInterval, Bool) -> Void

    func makeUIView(context: Context) -> TwoWayPinnedMultiDayContainerView {
        let view = TwoWayPinnedMultiDayContainerView()
        let allDayMenu = UIEditMenuInteraction(delegate: view.weekView)
        view.allDayView.addInteraction(allDayMenu)
        view.allDayView.onScopedMenuTap = { [weak week = view.weekView, weak allDayMenu] descriptor, point in
            guard let week, let allDayMenu, week.scopedResponse?(descriptor) != nil else { return false }
            week.presentEventMenu(for: descriptor, using: allDayMenu, at: point)
            return true
        }
        view.onRangeChange = { start = $0; end = $1 }
        view.onDayLabelTap = { start = $0; end = $0 }
        return view
    }

    func updateUIView(_ view: TwoWayPinnedMultiDayContainerView, context: Context) {
        let calendar = Calendar.current
        view.weekView.scopedEditable = { descriptor in (descriptor as? EKMultiDayWrapper).map { editable($0.realEvent) } ?? false }
        view.onEventEdit = { descriptor in if let part = descriptor as? EKMultiDayWrapper { edit(part.realEvent) } }
        view.onEventTap = view.onEventEdit
        view.weekView.scopedResponse = { descriptor in
            guard let part = descriptor as? EKMultiDayWrapper else { return nil }
            return response(part.realEvent)
        }
        view.weekView.scopedDeletable = { descriptor in (descriptor as? EKMultiDayWrapper).map { deletable($0.realEvent) } ?? false }
        view.onEventDeleted = { descriptor in if let part = descriptor as? EKMultiDayWrapper { delete(part.realEvent) } }
        view.allDayView.scopedEditable = view.weekView.scopedEditable
        view.onEventDragEnded = { descriptor, _, _ in
            if let part = descriptor as? EKMultiDayWrapper {
                context.coordinator.range = nil
                var destination = part.dateInterval
                if part.isAllDay, let slice = context.coordinator.allDaySliceStarts[ObjectIdentifier(part)] {
                    let shift = calendar.dateComponents([.day], from: slice, to: destination.start).day ?? 0
                    if let start = calendar.date(byAdding: .day, value: shift, to: part.realEvent.startDate),
                       let end = calendar.date(byAdding: .day, value: shift, to: part.realEvent.endDate) {
                        destination = DateInterval(start: start, end: end)
                    }
                }
                move(part.realEvent, destination, part.isAllDay)
            }
        }
        view.onEventDragResizeEnded = { descriptor, _ in
            if let part = descriptor as? EKMultiDayWrapper {
                context.coordinator.range = nil
                move(part.realEvent, part.dateInterval, part.isAllDay)
            }
        }
        view.onEmptyLongPress = { interval, _ in create(interval,false) }
        view.allDayView.onEmptyLongPress = { date in if let interval = calendar.dateInterval(of:.day,for:date) { create(interval,true) } }
        view.scopedTitle = title
        view.onScopeBack = onBack
        view.onScopeAdd = onAdd
        view.bottomScrollPadding = context.environment.calendarBottomClearance
        view.onScopeAvailability = onAvailability
        view.semanticContentAttribute = context.environment.layoutDirection == .rightToLeft ? .forceRightToLeft : .forceLeftToRight
        Self.render(events: events, start: start, end: end, into: view, cache: context.coordinator)
    }

    static func render(events: [EKEvent], start: Date, end: Date, into view: TwoWayPinnedMultiDayContainerView, cache: Coordinator) {
        let calendar = Calendar.current
        if view.fromDate != start { view.fromDate = start }
        if view.toDate != end { view.toDate = end }
        let upper = calendar.date(byAdding: .day, value: 1, to: calendar.startOfDay(for: end)) ?? end
        let range = DateInterval(start: start, end: upper)
        let identifiers = events.map(ObjectIdentifier.init)
        guard cache.range != range || cache.timeZone != calendar.timeZone || cache.renderedEvents != identifiers else { return }
        cache.range = range
        cache.timeZone = calendar.timeZone
        cache.renderedEvents = identifiers
        cache.allDaySliceStarts.removeAll(keepingCapacity: true)
        let attributes = events.flatMap { event -> [EventLayoutAttributes] in
            var cursor = max(start, event.startDate)
            let last = min(upper, event.endDate)
            var parts: [EventLayoutAttributes] = []
            while cursor < last, let day = calendar.dateInterval(of: .day, for: cursor) {
                let next = min(last, day.end)
                let part = EKMultiDayWrapper(realEvent: event, partialStart: cursor, partialEnd: next)
                if event.isAllDay { cache.allDaySliceStarts[ObjectIdentifier(part)] = day.start }
                parts.append(EventLayoutAttributes(part))
                cursor = next
            }
            return parts
        }
        view.allDayView.allDayLayoutAttributes = attributes.filter { $0.descriptor.isAllDay }
        view.weekView.regularLayoutAttributes = attributes.filter { !$0.descriptor.isAllDay }
        view.setNeedsLayout()
    }
}
#endif

/// Uses the same timed and all-day renderers as the host timeline, with a guest-only tap action.
struct BookingGridItem: Identifiable, Equatable {
    let id: String
    let title: String
    let start: Date
    let end: Date
    let allDay: Bool
    let status: BookingEventStatus
    let selectable: Bool

    init(id: String, title: String, interval: BookingInterval, status: BookingEventStatus, selectable: Bool) {
        self.id = id
        self.title = title
        start = interval.guestDisplayDate(interval.start)
        end = interval.guestDisplayDate(interval.end)
        allDay = interval.allDay == true
        self.status = status
        self.selectable = selectable
    }
}

struct BookingGuestGrid: View {
    let title: String
    let blocks: [BookingGridItem]
    let dates: [Date]
    let changeRange: (Date, Date) -> Void
    let select: (String) -> Void
    #if os(macOS)
    @State private var pickingRange = false
    @EnvironmentObject private var store: MacTabletCalendarStore
    #endif
    @State private var events: [EKEvent] = []
    @State private var selectableIDs: [ObjectIdentifier: String] = [:]

    var body: some View {
        let viewer = Calendar.current
        let upper = dates.last.flatMap { viewer.date(byAdding: .day, value: 1, to: $0) } ?? .distantFuture
        let lower = dates.first ?? .distantPast
        let visible = blocks.filter { $0.start < upper && $0.end > lower }
        let firstTimed = visible.filter { !$0.allDay }.min { $0.start < $1.start }
        let focusHour = firstTimed.map { viewer.component(.hour, from: max($0.start, lower)) }
        Group {
            #if os(macOS)
            let first = dates.first ?? .now, last = dates.last ?? first
            let formatter = MacCalendarFormatting.dateFormatter()
            VStack(spacing: 0) {
                CalendarScreenHeader(currentView: 3, rangeTitle: formatter.string(from: first) + " - " + formatter.string(from: last),
                    rangeIsSelected: pickingRange, scopedTitle: title, onRange: { pickingRange.toggle() },
                    onSearch: nil, onViewChange: { _ in })
                Divider()
                MacTabletTimelineView(store: store, dates: dates, calendars: nil, editorTarget: .constant(nil),
                                  scopedEvents: events, guestAction: action, focusHour: focusHour)
            }
            .macCalendarRangePicker(isPresented: $pickingRange, start: first, end: last, onRangeChange: changeRange)
            #else
            GuestPinnedDays(events: events, dates: dates, title: title, changeRange: changeRange, focusHour: focusHour, select: { action($0)?() })
            #endif
        }
        .onChange(of: visible, initial: true) { _, blocks in
            #if os(macOS)
            let source = store.eventStore
            #else
            let source = CalendarViewModel.shared.eventStore
            #endif
            var calendars: [BookingEventStatus: EKCalendar] = [:]
            var ids: [ObjectIdentifier: String] = [:]
            events = blocks.map { block in
                let event = EKEvent(eventStore: source)
                if calendars[block.status] == nil {
                    let calendar = EKCalendar(for: .event, eventStore: source)
                    calendar.title = title
                    #if os(macOS)
                    calendar.cgColor = NSColor(block.status.color).cgColor
                    #else
                    calendar.cgColor = UIColor(block.status.color).cgColor
                    #endif
                    calendars[block.status] = calendar
                }
                event.calendar = calendars[block.status]
                event.title = block.title
                event.isAllDay = block.allDay
                event.startDate = block.start; event.endDate = block.end
                if block.selectable { ids[ObjectIdentifier(event)] = block.id }
                return event
            }
            selectableIDs = ids
        }
    }

    private func action(_ event: EKEvent) -> (() -> Void)? {
        guard let id = selectableIDs[ObjectIdentifier(event)] else { return nil }
        return { select(id) }
    }
}

#if os(iOS)
private struct GuestPinnedDays: UIViewRepresentable {
    let events: [EKEvent]
    let dates: [Date]
    let title: String
    let changeRange: (Date, Date) -> Void
    let focusHour: Int?
    let select: (EKEvent) -> Void
    func makeCoordinator() -> BookingPinnedTimeline.Coordinator { .init() }
    func makeUIView(context: Context) -> TwoWayPinnedMultiDayContainerView {
        let view = TwoWayPinnedMultiDayContainerView()
        view.scopedTitle = title
        view.focusHour = focusHour
        view.weekView.scopedEditable = { _ in false }
        view.allDayView.scopedEditable = { _ in false }
        return view
    }
    func updateUIView(_ view: TwoWayPinnedMultiDayContainerView, context: Context) {
        guard let first = dates.first, let last = dates.last else { return }
        let tap: (EventDescriptor) -> Void = { descriptor in
            if let part = descriptor as? EKMultiDayWrapper { select(part.realEvent) }
        }
        view.onRangeChange = changeRange
        view.weekView.guestSlotTap = tap
        view.allDayView.onEventTap = tap
        view.semanticContentAttribute = context.environment.layoutDirection == .rightToLeft ? .forceRightToLeft : .forceLeftToRight
        BookingPinnedTimeline.render(events: events, start: first, end: last, into: view, cache: context.coordinator)
    }
}
#endif
