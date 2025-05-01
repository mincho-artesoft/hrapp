import EventKit

extension EKCalendar: @retroactive Identifiable {
    public var id: String {
        return self.calendarIdentifier
    }
}
