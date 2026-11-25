import SwiftUI

// Display occurrences only. Both the slots and the reservations belong to this host calendar.
struct BookingTimelineEntry: Identifiable {
    let id: String
    let title: String
    let status: String
    let start: Date
    let end: Date

    static func entries(in schedule: HostedBookingCalendar, from lower: Date, to upper: Date) -> [Self] {
        let bookings = schedule.requests.filter { $0.status != "declined" }
        let occupied = Set(bookings.map(\.slotId))
        let reservations = bookings.compactMap { booking -> Self? in
            let start = BookingInterval.date(booking.start), end = BookingInterval.date(booking.end)
            guard start < upper, end > lower, end > start else { return nil }
            let title = [booking.title, booking.guestName].compactMap { $0 }.filter { !$0.isEmpty }.joined(separator: " · ")
            return Self(id: "request-" + booking.id, title: title, status: booking.status.capitalized, start: start, end: end)
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
                result.append(Self(id: "slot-" + id, title: slot.title ?? "", status: "Available time", start: start, end: end))
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
    @Environment(\.calendar) private var calendar
    @Environment(\.layoutDirection) private var layoutDirection
    @State private var anchor = Date.now

    private let hourHeight: CGFloat = 52
    private let gutter: CGFloat = 56

    var body: some View {
        GeometryReader { geometry in
            let count = max(2, min(8, Int((geometry.size.width - gutter) / 100)))
            let first = calendar.startOfDay(for: anchor)
            let days = (0..<count).map { shifted(first, $0) }
            let entries = BookingTimelineEntry.entries(in: schedule, from: first, to: shifted(first, count))
            VStack(spacing: 0) {
                Text(verbatim: schedule.title).font(.headline)
                    .frame(maxWidth: .infinity, alignment: .leading).padding(.horizontal).padding(.top, 8)
                HStack {
                    DatePicker("Date", selection: $anchor, displayedComponents: .date).labelsHidden()
                    Spacer()
                    Button("Today") { anchor = .now }
                    Button { anchor = shifted(first, -count) } label: {
                        Label("Back", systemImage: "chevron.backward").frame(minWidth: 40, minHeight: 44).contentShape(Rectangle())
                    }.buttonStyle(.plain)
                    Button { anchor = shifted(first, count) } label: {
                        Label("Next", systemImage: "chevron.forward").frame(minWidth: 40, minHeight: 44).contentShape(Rectangle())
                    }.buttonStyle(.plain)
                }
                .labelStyle(.iconOnly).padding(.horizontal).frame(minHeight: 48)
                HStack(spacing: 0) {
                    Color.clear.frame(width: gutter)
                    ForEach(days, id: \.self) { day in
                        Text(day, format: .dateTime.weekday(.abbreviated).day().month(.abbreviated))
                            .font(.caption.weight(.semibold)).foregroundStyle(calendar.isDateInToday(day) ? Color.appBlue : .primary)
                            .frame(maxWidth: .infinity).multilineTextAlignment(.center)
                    }
                }.frame(minHeight: 36)
                Divider()
                ScrollViewReader { proxy in
                    ScrollView {
                        HStack(alignment: .top, spacing: 0) {
                            VStack(alignment: .trailing, spacing: 0) {
                                ForEach(0..<24, id: \.self) { hour in
                                    // A fixed reference day gives the ruler all 24 labels even on a clock-change day.
                                    Text(Date(timeIntervalSince1970: Double(hour) * 3600),
                                         format: Date.FormatStyle(timeZone: TimeZone(secondsFromGMT: 0)!).hour().minute())
                                        .font(.caption2).foregroundStyle(.secondary).monospacedDigit()
                                        .padding(.trailing, 4).frame(width: gutter, height: hourHeight, alignment: .topTrailing)
                                        .id(hour)
                                }
                            }
                            ForEach(days, id: \.self) { day in
                                dayColumn(day, entries: entries, width: (geometry.size.width - gutter) / CGFloat(count))
                            }
                        }
                    }
                    .onChange(of: first, initial: true) { _, _ in
                        let hour = entries.first.map { calendar.component(.hour, from: max(first, $0.start)) } ?? 9
                        proxy.scrollTo(max(0, hour - 1), anchor: .top)
                    }
                }
            }
            .background(CalendarPalette.background)
        }
    }

    private func shifted(_ date: Date, _ days: Int) -> Date {
        calendar.date(byAdding: .day, value: days, to: date) ?? date
    }

    private func minute(_ instant: Date) -> CGFloat {
        CGFloat(calendar.component(.hour, from: instant) * 60 + calendar.component(.minute, from: instant))
    }

    private func dayColumn(_ day: Date, entries: [BookingTimelineEntry], width: CGFloat) -> some View {
        let next = shifted(day, 1)
        let visible = entries.filter { $0.start < next && $0.end > day }
        let items = visible.map { EventDetailTimelineLayout.Item(id: $0.id, title: $0.title, calendarTitle: schedule.title,
                                                                 start: max(day, $0.start), end: min(next, $0.end)) }
        let positions = EventDetailTimelineLayout(width: width, minimumHeaderDuration: 900).place(items)
        let byID = Dictionary(uniqueKeysWithValues: visible.map { ($0.id, $0) })
        return ZStack(alignment: .topLeading) {
            VStack(spacing: 0) {
                ForEach(0..<24, id: \.self) { _ in
                    Divider().frame(height: hourHeight, alignment: .top)
                }
            }
            ForEach(positions, id: \.id) { placement in
                if let entry = byID[placement.id] {
                    let top = entry.start <= day ? 0 : minute(entry.start)
                    let bottom = entry.end >= next ? 1440 : minute(entry.end)
                    let height = min((1440 - top) * hourHeight / 60, max(18, (bottom - top) * hourHeight / 60 - 1))
                    VStack(alignment: .leading, spacing: 1) {
                        if !entry.title.isEmpty { Text(verbatim: entry.title).bold().lineLimit(2) }
                        Text(LocalizedStringKey(entry.status)).lineLimit(1)
                        Text("\(entry.start, style: .time) – \(entry.end, style: .time)").lineLimit(1)
                    }
                    .font(.caption2).padding(3)
                    .frame(width: max(1, placement.width - 2), height: height, alignment: .topLeading)
                    .clipped().background(color.opacity(0.18), in: RoundedRectangle(cornerRadius: 4))
                    .overlay(alignment: .leading) { Capsule().fill(color).frame(width: 2) }
                    .accessibilityElement(children: .combine)
                    .offset(x: (layoutDirection == .rightToLeft ? -1 : 1) * placement.leading, y: top * hourHeight / 60)
                }
            }
        }
        .frame(width: width, height: 24 * hourHeight, alignment: .topLeading)
        .overlay(alignment: .leading) { Divider() }
        .clipped()
    }
}
