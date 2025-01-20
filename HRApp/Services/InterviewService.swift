import SwiftData
import Foundation

/// A simple service for creating/scheduling Interviews
class InterviewService: ObservableObject {
    
    func fetchAll(context: ModelContext) throws -> [Interview] {
        let descriptor = FetchDescriptor<Interview>()
        return try context.fetch(descriptor)
    }
    /// Schedules a new interview for a candidate
    func scheduleInterview(
        context: ModelContext,
        candidate: Candidate,
        startDate: Date,
        endDate: Date,
        location: String,
        status: String,
        notes: String
        
    ) throws {
        let interview = Interview(
            candidate: candidate,
            startDate: startDate,
            endDate: endDate,
            location: location,
            status: status,
            notes: notes
            
        )
        context.insert(interview)
        // Because Interview has a relationship to Candidate,
        // SwiftData will handle linking them automatically.
        try context.save()
    }
}
