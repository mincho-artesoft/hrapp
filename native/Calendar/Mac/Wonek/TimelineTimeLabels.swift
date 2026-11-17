// Ported from Wonek CalendarKit/TimelineTimeLabels.swift. HRApp data adapters are in MacCalendarAdapters.swift.
#if os(macOS)
import Foundation

/// Time-gutter rules shared by the UIKit and AppKit timelines.
enum TimelineTimeLabels {
    static func showsHour(_ hour: Int, near current: Date?, calendar: Calendar = .current) -> Bool {
        guard let current else { return true }
        let minute = calendar.component(.hour, from: current) * 60 + calendar.component(.minute, from: current)
        return abs(hour * 60 - minute) >= 15
    }

    /// iPad shows a small `.10` / `.20` marker, not another full blue hour label.
    static func selectedMinute(at date: Date, calendar: Calendar = .current) -> Int? {
        let minute = calendar.component(.minute, from: date)
        let rounded = ((minute + 5) / 10) * 10
        return minute != 0 && rounded < 60 ? rounded : nil
    }

    static func minuteText(_ minute: Int, locale: Locale) -> String {
        let formatter = NumberFormatter()
        formatter.locale = locale
        formatter.numberStyle = .decimal
        formatter.minimumIntegerDigits = 2
        formatter.maximumFractionDigits = 0
        formatter.usesGroupingSeparator = false
        return "." + (formatter.string(from: NSNumber(value: minute)) ?? String(minute))
    }
}

#endif
