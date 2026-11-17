// Ported from Wonek Main/MacCalendarRangeSelection.swift. HRApp data adapters are in MacCalendarAdapters.swift.
#if os(macOS)
import Foundation

/// The original iPad range picker's two-click / drag selection rules.
/// Civil days, rather than 86,400-second offsets, keep DST ranges correct.
struct MacCalendarRangeSelection {
    var start: Date?
    var end: Date?

    mutating func select(_ date: Date, calendar: Calendar) {
        let day = calendar.startOfDay(for: date)
        if start == nil || end != nil {
            start = day
            end = nil
        } else if let start, day > start {
            end = day
        } else {
            start = day
        }
    }

    mutating func beginDrag(_ date: Date, calendar: Calendar) {
        start = calendar.startOfDay(for: date)
        end = nil
    }

    mutating func drag(to date: Date, calendar: Calendar) {
        let day = calendar.startOfDay(for: date)
        if let start, day > start { end = day }
        else { start = day }
    }

    func dayCount(calendar: Calendar) -> Int? {
        guard let start, let end, end >= start else { return nil }
        return (calendar.dateComponents([.day], from: calendar.startOfDay(for: start),
            to: calendar.startOfDay(for: end)).day ?? 0) + 1
    }
}

#endif
