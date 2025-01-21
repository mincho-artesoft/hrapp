import SwiftData
import Foundation

protocol CalendarEvent: AnyObject, Identifiable {
    var id: UUID { get set }
    var startDate: Date { get set }
    var endDate: Date { get set }
    func overlapsDay(_ date: Date) -> Bool
}

// Default реализация:
extension CalendarEvent {
    func overlapsDay(_ date: Date) -> Bool {
        let dayStart = Calendar.current.startOfDay(for: date)
        let dayEnd = Calendar.current.date(byAdding: .day, value: 1, to: dayStart)!
        return (startDate < dayEnd) && (endDate > dayStart)
    }
}

@Model
final class TimeOffRequest: CalendarEvent {
    @Attribute(.unique) var id: UUID
    var startDate: Date
    var endDate: Date

    // Примерно:
    var reason: String
    var status: String

    // Rel към Employee
    @Relationship var employee: Employee

    init(
        employee: Employee,
        startDate: Date,
        endDate: Date,
        reason: String,
        status: String = "Pending",
        id: UUID = UUID()
    ) {
        self.employee = employee
        self.startDate = startDate
        self.endDate = endDate
        self.reason = reason
        self.status = status
        self.id = id
    }
}
