import Foundation

/// A fresh identity lets selecting the same day scroll back to it again.
struct CalendarListScrollRequest: Equatable {
    let id = UUID()
    let date: Date
}

struct CalendarListScrollUpdate: Equatable {
    let request: CalendarListScrollRequest?
    let days: [Date]
}

/// Shared, testable layout/date rules for the desktop and landscape tablet rail.
enum CalendarSidebarLayout {
    /// Calendar colors, not event counts: repeated events with the same color
    /// contribute one dot. Use calendar-day bounds (including DST) and an
    /// exclusive end, so midnight-ending events do not mark the following day.
    static func eventColors<Event, Color: Hashable>(
        on day: Date, calendar: Calendar, events: [Event],
        start: (Event) -> Date, end: (Event) -> Date, color: (Event) -> Color
    ) -> [Color] {
        let dayStart = calendar.startOfDay(for: day)
        guard let dayEnd = calendar.date(byAdding: .day, value: 1, to: dayStart) else { return [] }
        var seen = Set<Color>()
        return events.compactMap { event in
            guard start(event) < dayEnd, end(event) > dayStart,
                  end(event) > start(event) else { return nil }
            let value = color(event)
            return seen.insert(value).inserted ? value : nil
        }
    }

    /// Ongoing timed events remain eligible; holidays and other all-day events
    /// must never displace the next appointment.
    static func isUpcoming(isAllDay: Bool, end: Date, now: Date) -> Bool {
        !isAllDay && end > now
    }

    static func isVisible(isMac: Bool, isTablet: Bool, windowSize: CGSize) -> Bool {
        isMac || (isTablet && windowSize.width > windowSize.height)
    }

    static func viewportSize(contentSize: CGSize, horizontalInsets: CGFloat, verticalInsets: CGFloat) -> CGSize {
        CGSize(width: contentSize.width + horizontalInsets, height: contentSize.height + verticalInsets)
    }

    static func width(availableWidth: CGFloat) -> CGFloat {
        min(360, max(280, availableWidth * 0.28))
    }

    static func monthDays(containing date: Date, calendar: Calendar) -> [Date] {
        guard let month = calendar.dateInterval(of: .month, for: date)?.start else { return [] }
        let leading = (calendar.component(.weekday, from: month) - calendar.firstWeekday + 7) % 7
        guard let first = calendar.date(byAdding: .day, value: -leading, to: month) else { return [] }
        return (0..<42).compactMap { calendar.date(byAdding: .day, value: $0, to: first) }
    }

    static func movedRange(start: Date, end: Date, to day: Date, calendar: Calendar) -> (Date, Date) {
        let count = max(0, calendar.dateComponents([.day], from: calendar.startOfDay(for: start),
            to: calendar.startOfDay(for: end)).day ?? 0)
        let newStart = calendar.startOfDay(for: day)
        return (newStart, calendar.date(byAdding: .day, value: count, to: newStart) ?? newStart)
    }

    static func listDays(eventDays: [Date], selectedDate: Date?, calendar: Calendar) -> [Date] {
        var days = Set(eventDays.map { calendar.startOfDay(for: $0) })
        // Keep an exact scroll anchor even when this day has no visible events.
        if let selectedDate { days.insert(calendar.startOfDay(for: selectedDate)) }
        return days.sorted()
    }

    static func listScrollTarget(days: [Date], selectedDate: Date?, today: Date = Date(), calendar: Calendar) -> Date? {
        if let selectedDate { return calendar.startOfDay(for: selectedDate) }
        let start = calendar.startOfDay(for: today)
        return days.first(where: { $0 >= start }) ?? days.last
    }
}
