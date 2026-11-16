import Foundation

enum EventEditorInitialSchedule {
    static func resolve(
        day: Date, exactInterval: DateInterval?, isAllDay: Bool,
        now: Date = Date(), calendar: Calendar = .current
    ) -> DateInterval {
        if let exactInterval { return exactInterval }
        let start: Date
        if calendar.isDate(day, inSameDayAs: now) {
            start = Date(timeIntervalSinceReferenceDate: ceil(now.timeIntervalSinceReferenceDate / 900) * 900)
        } else {
            start = calendar.date(bySettingHour: 9, minute: 0, second: 0, of: day) ?? day
        }
        return DateInterval(start: start, duration: isAllDay ? 86_400 : 3_600)
    }
}
