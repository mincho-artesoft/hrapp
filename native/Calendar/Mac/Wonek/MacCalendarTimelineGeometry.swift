// Ported from Wonek Main/MacCalendarTimelineGeometry.swift. HRApp data adapters are in MacCalendarAdapters.swift.
#if os(macOS)
#if os(macOS)
import Foundation

/// Wall-clock geometry, independent of EventKit and safe to exercise without
/// creating, changing or deleting any of the user's calendar events.
enum MacCalendarTimelineGeometry {
    static func monthGrid(containing date: Date, calendar: Calendar) -> [Date] {
        guard let month = calendar.date(from: calendar.dateComponents([.year, .month], from: date)) else { return [] }
        let offset = (calendar.component(.weekday, from: month) - calendar.firstWeekday + 7) % 7
        guard let first = calendar.date(byAdding: .day, value: -offset, to: month) else { return [] }
        // Both original iPad month and year mini-month views use six weeks.
        return (0..<42).compactMap { calendar.date(byAdding: .day, value: $0, to: first) }
    }

    static func offset(of date: Date, on day: Date, calendar: Calendar,
                       hourHeight: CGFloat, margin: CGFloat) -> CGFloat {
        let start = calendar.startOfDay(for: day)
        if date <= start { return margin }
        guard let end = calendar.date(byAdding: .day, value: 1, to: start) else { return margin }
        if date >= end { return margin + hourHeight * 24 }
        let parts = calendar.dateComponents([.hour, .minute, .second], from: date)
        let hours = Double(parts.hour ?? 0) + Double(parts.minute ?? 0) / 60 + Double(parts.second ?? 0) / 3600
        return margin + CGFloat(hours) * hourHeight
    }

    struct DaySegment {
        let day: Date
        let start: Date
        let end: Date
        let isFirst: Bool
        let isLast: Bool
        var isSingleDay: Bool { isFirst && isLast }
    }

    static func segments(start: Date, end: Date, calendar: Calendar,
                         within interval: DateInterval? = nil) -> [DaySegment] {
        guard end > start else { return [] }
        let first = calendar.startOfDay(for: start)
        // EventKit's end is exclusive, so an event ending at midnight must not
        // acquire an empty row on the following day.
        let last = calendar.startOfDay(for: end.addingTimeInterval(-0.001))
        var day = interval.map { max(first, calendar.startOfDay(for: $0.start)) } ?? first
        let limit = interval.map { min(end, $0.end) } ?? end
        var result: [DaySegment] = []
        while day < limit, let next = calendar.date(byAdding: .day, value: 1, to: day), next > day {
            result.append(.init(day: day, start: max(start, day), end: min(end, next),
                isFirst: day == first, isLast: day == last))
            day = next
        }
        return result
    }
}
#endif

#endif
