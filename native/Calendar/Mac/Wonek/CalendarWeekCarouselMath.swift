// Ported from Wonek Main/CalendarWeekCarouselMath.swift. HRApp data adapters are in MacCalendarAdapters.swift.
#if os(macOS)
import Foundation

enum CalendarWeekCarouselMath {
    static func weekStart(containing date: Date, calendar: Calendar) -> Date {
        let day = calendar.startOfDay(for: date)
        let offset = (calendar.component(.weekday, from: day) - calendar.firstWeekday + 7) % 7
        return self.date(from: day, offset: -offset, calendar: calendar)
    }

    static func date(from selected: Date, offset: Int, calendar: Calendar) -> Date {
        calendar.date(byAdding: .day, value: offset, to: calendar.startOfDay(for: selected)) ?? selected
    }
    static func pageOffset(translation: CGFloat, projected: CGFloat, width: CGFloat, rightToLeft: Bool = false) -> Int {
        guard width > 0 else { return 0 }
        let distance = abs(projected) > abs(translation) ? projected : translation
        guard abs(distance) > min(50, width * 0.15) else { return 0 }
        return (distance < 0 ? 7 : -7) * (rightToLeft ? -1 : 1)
    }

    static func visualDay(_ index: Int, rightToLeft: Bool) -> Int {
        rightToLeft ? 6 - index : index
    }
}

#endif
