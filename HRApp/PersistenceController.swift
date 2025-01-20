import SwiftData
import Foundation

@MainActor
class PersistenceController: ObservableObject {
    static let shared = PersistenceController()

    let container: ModelContainer

    /// Pass `true` if you want an in-memory store. Default is on-disk.
    private init(inMemory: Bool = false) {
        // 1) Call the static removal function before assigning any instance properties
        Self.removeLegacyStoreIfExists()

        // 2) Create a ModelConfiguration (for older SwiftData betas)
        let config = ModelConfiguration()

        do {
            // 3) Pass your model types as a comma-separated list
            //    and supply `config` for configurations:
            container = try ModelContainer(
                for:
                    Employee.self,
                    Department.self,
                    TimeOffRequest.self,
                    PerformanceReview.self,
                    Candidate.self,
                    Interview.self,
                configurations: config
            )
        } catch {
            fatalError("Failed to create ModelContainer: \(error)")
        }

        // 4) Optionally insert mock data
        insertMockCandidatesIfNeeded()
    }

    private func insertMockCandidatesIfNeeded() {
        let context = container.mainContext
        do {
            let existingCandidates = try context.fetch(FetchDescriptor<Candidate>())
            if existingCandidates.isEmpty {
                let sampleCandidates: [Candidate] = [
                    Candidate(
                        firstName: "Alice",
                        lastName: "Johnson",
                        email: "alice@example.com",
                        phoneNumber: "1234567890",
                        region: "North",
                        skills: ["iOS", "Swift"]
                    ),
                    Candidate(
                        firstName: "Bob",
                        lastName: "Smith",
                        email: "bob@example.com",
                        phoneNumber: "9876543210",
                        region: "South",
                        skills: ["UI/UX"]
                    ),
                    Candidate(
                        firstName: "Charlie",
                        lastName: "Lee",
                        email: "charlie@example.com",
                        phoneNumber: "5555551234",
                        region: "East",
                        skills: ["Backend", "Node.js"]
                    )
                ]
                for cand in sampleCandidates {
                    context.insert(cand)
                }
                try context.save()
                print("Mock Candidates inserted.")
            }
        } catch {
            print("Error inserting mock candidates: \(error)")
        }
    }

    /// Make this a static function so we can call it without referencing self
    private static func removeLegacyStoreIfExists() {
        guard let storeURL = FileManager.default
            .urls(for: .applicationSupportDirectory, in: .userDomainMask)
            .first?
            .appendingPathComponent("default.store")
        else { return }

        if FileManager.default.fileExists(atPath: storeURL.path) {
            do {
                try FileManager.default.removeItem(at: storeURL)
                print("Removed old default.store at: \(storeURL.path)")
            } catch {
                print("Could not remove old default.store: \(error)")
            }
        }
    }
}
