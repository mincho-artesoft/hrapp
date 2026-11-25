import SwiftUI
import EventKit

// Display occurrences only. Both the slots and the reservations belong to this host calendar.
struct BookingTimelineEntry: Identifiable, Equatable {
    let id: String
    let title: String
    let status: String
    let location: String?
    let start: Date
    let end: Date

    static func entries(in schedule: HostedBookingCalendar, from lower: Date, to upper: Date) -> [Self] {
        let bookings = schedule.requests.filter { $0.status != "declined" }
        let occupied = Set(bookings.map(\.slotId))
        let reservations = bookings.compactMap { booking -> Self? in
            let start = BookingInterval.date(booking.start), end = BookingInterval.date(booking.end)
            guard start < upper, end > lower, end > start else { return nil }
            let title = [booking.title, booking.guestName].compactMap { $0 }.filter { !$0.isEmpty }.joined(separator: " · ")
            return Self(id: "request-" + booking.id, title: title, status: booking.status.capitalized, location: booking.location, start: start, end: end)
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
            for start in starts {
                let end = start.addingTimeInterval(duration)
                guard start >= seed, end > lower else { continue }
                let id = start == seed ? slot.id : "\(slot.id)@\(Int64((start.timeIntervalSince1970 * 1000).rounded()))"
                guard !occupied.contains(id), !reservations.contains(where: { $0.start < end && $0.end > start }) else { continue }
                result.append(Self(id: "slot-" + id, title: slot.title ?? "", status: "Available time", location: slot.location, start: start, end: end))
            }
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
    let color: Color
    let onBack: () -> Void
    @Environment(\.calendar) private var calendar
    @Environment(\.locale) private var locale
    @State private var start = Calendar.current.startOfDay(for: .now)
    @State private var end = Calendar.current.date(byAdding: .day, value: 7, to: Calendar.current.startOfDay(for: .now))!
    @State private var events: [EKEvent] = []
    #if os(macOS)
    @EnvironmentObject private var store: MacTabletCalendarStore
    @State private var pickingRange = false
    #endif

    private struct Projection: Equatable {
        let title: String
        let color: Color
        let locale: Locale
        let entries: [BookingTimelineEntry]
    }

    var body: some View {
        let upper = calendar.date(byAdding: .day, value: 1, to: calendar.startOfDay(for: end)) ?? end
        let projection = Projection(title: schedule.title, color: color, locale: locale,
            entries: BookingTimelineEntry.entries(in: schedule, from: calendar.startOfDay(for: start), to: upper))
        timeline
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .onChange(of: projection, initial: true) { _, value in
                // These unsaved objects only supply the existing event-card renderers with their display model.
                #if os(macOS)
                let displayStore = store.eventStore
                #else
                let displayStore = CalendarViewModel.shared.eventStore
                #endif
                let displayCalendar = EKCalendar(for: .event, eventStore: displayStore)
                displayCalendar.title = value.title
                #if os(macOS)
                displayCalendar.cgColor = NSColor(value.color).cgColor
                #else
                displayCalendar.cgColor = UIColor(value.color).cgColor
                #endif
                events = value.entries.map { entry in
                    let event = EKEvent(eventStore: displayStore)
                    event.calendar = displayCalendar
                    event.startDate = entry.start
                    event.endDate = entry.end
                    event.location = entry.location
                    event.title = [entry.title, NSLocalizedString(entry.status, comment: "")].filter { !$0.isEmpty }.joined(separator: " · ")
                    return event
                }
            }
    }

    @ViewBuilder private var timeline: some View {
        #if os(macOS)
        let dayCount = max(1, (calendar.dateComponents([.day], from: start, to: end).day ?? 0) + 1)
        let formatter = MacCalendarFormatting.dateFormatter()
        let rangeTitle = formatter.string(from: start) + " - " + formatter.string(from: end)
        VStack(spacing: 0) {
            CalendarScreenHeader(currentView: 3, rangeTitle: rangeTitle, rangeIsSelected: pickingRange,
                scopedTitle: schedule.title, onBack: onBack, onRange: { pickingRange.toggle() },
                onSearch: nil, onViewChange: { _ in })
            Divider()
            MacTabletMultiDayView(store: store, startDate: Binding(get: { start }, set: { day in
                start = day
                end = day
            }), dayCount: dayCount, selectedTab: .constant(3), editorTarget: .constant(nil), scopedEvents: events)
        }
        .overlay(alignment: .topLeading) {
            if pickingRange {
                Color.clear.contentShape(Rectangle()).onTapGesture { pickingRange = false }
                MacCalendarDateRangePicker(start: start, end: end, onDismiss: { pickingRange = false }) { first, last in
                    start = first
                    end = last
                }.padding(.top, CalendarHeaderLayout.height).padding(.leading, 16)
            }
        }
        #else
        BookingPinnedTimeline(title: schedule.title, start: $start, end: $end, events: events, onBack: onBack)
        #endif
    }
}

#if os(iOS)
private struct BookingPinnedTimeline: UIViewRepresentable {
    let title: String
    @Binding var start: Date
    @Binding var end: Date
    let events: [EKEvent]
    let onBack: () -> Void

    func makeUIView(context: Context) -> TwoWayPinnedMultiDayContainerView {
        let view = TwoWayPinnedMultiDayContainerView()
        view.weekView.isUserInteractionEnabled = false
        view.allDayView.isUserInteractionEnabled = false
        view.onRangeChange = { start = $0; end = $1 }
        view.onDayLabelTap = { start = $0; end = $0 }
        return view
    }

    func updateUIView(_ view: TwoWayPinnedMultiDayContainerView, context: Context) {
        let calendar = Calendar.current
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
