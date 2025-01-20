import SwiftData
import Foundation

final class TimeOffService: ObservableObject {
    
    func fetchRequests(context: ModelContext) throws -> [TimeOffRequest] {
        let descriptor = FetchDescriptor<TimeOffRequest>(
            sortBy: [SortDescriptor(\.startDate, order: .forward)]
        )
        return try context.fetch(descriptor)
    }

    /// Създаваме нов TimeOffRequest
    func requestTimeOff(
        context: ModelContext,
        employee: Employee,
        startDate: Date,
        endDate: Date,
        reason: String
    ) throws {
        // ВНИМАНИЕ: тук вече можем да викаме
        //   TimeOffRequest(employee:..., startDate:..., endDate:..., reason:...)
        // защото така е деклариран init
        let newRequest = TimeOffRequest(
            employee: employee,
            startDate: startDate,
            endDate: endDate,
            reason: reason
        )
        context.insert(newRequest)
        try context.save()
    }

    func updateRequestStatus(
        context: ModelContext,
        request: TimeOffRequest,
        status: String
    ) throws {
        request.status = status
        try context.save()
    }
}
