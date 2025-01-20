import SwiftData
import Foundation

/// A simple service for fetching candidates from the ModelContext
class CandidateService: ObservableObject {
    /// Fetch all candidates stored in SwiftData
    func fetchAll(context: ModelContext) throws -> [Candidate] {
        let descriptor = FetchDescriptor<Candidate>()
        return try context.fetch(descriptor)
    }
    
    /// (Optional) Add a new candidate
    func addCandidate(
        context: ModelContext,
        firstName: String,
        lastName: String,
        email: String,
        phoneNumber: String,
        region: String,
        skills: [String] = [],
        cvURL: URL? = nil
    ) throws {
        let candidate = Candidate(
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            region: region,
            skills: skills,
            cvURL: cvURL
        )
        context.insert(candidate)
        try context.save()
    }
}
