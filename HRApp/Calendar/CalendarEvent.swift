import SwiftUI
import SwiftData
import Foundation

/// Протокол CalendarEvent, за да са класове (AnyObject) и да имат start/end/overlapsDay:
protocol CalendarEvent: AnyObject, Identifiable {
    var id: UUID { get set }
    var startDate: Date { get set }
    var endDate: Date { get set }
    func overlapsDay(_ date: Date) -> Bool
}

extension CalendarEvent {
    func overlapsDay(_ date: Date) -> Bool {
        let dayStart = Calendar.current.startOfDay(for: date)
        let dayEnd = Calendar.current.date(byAdding: .day, value: 1, to: dayStart)!
        return (startDate < dayEnd) && (endDate > dayStart)
    }
}

/// SwiftData модел за TimeOffRequest, имплементиращ `CalendarEvent`.
@Model
final class TimeOffRequest: CalendarEvent {
    @Attribute(.unique) var id: UUID
    var startDate: Date
    var endDate: Date
    
    // Предполага се, че имате някакъв `Employee` модел:
    @Relationship var employee: Employee
    
    var reason: String
    var status: String

    /// Пренареждаме параметрите, за да може да викаме:
    /// TimeOffRequest(employee:..., startDate:..., endDate:..., reason:..., status:..., id:...)
    /// като "id" и "status" имат default стойности.
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
        self.endDate   = endDate
        self.reason    = reason
        self.status    = status
        self.id        = id
    }

    // Ако искате да override-нете overlapsDay(_:) със специфична логика, може:
    func overlapsDay(_ date: Date) -> Bool {
        let dayStart = Calendar.current.startOfDay(for: date)
        let dayEnd   = Calendar.current.date(byAdding: .day, value: 1, to: dayStart)!
        return (startDate < dayEnd) && (endDate > dayStart)
    }
}
