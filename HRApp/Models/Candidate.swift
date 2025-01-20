import SwiftData
import Foundation

@Model
class Candidate {
    @Attribute(.unique) var id: UUID

    var firstName: String
    var lastName: String
    var email: String
    var phoneNumber: String
    var region: String

    private var skillsData: Data?

    var skills: [String] {
        get {
            guard let data = skillsData else { return [] }
            return (try? JSONDecoder().decode([String].self, from: data)) ?? []
        }
        set {
            skillsData = try? JSONEncoder().encode(newValue)
        }
    }

    var cvURL: URL?

    // Relationship to interviews
    @Relationship(deleteRule: .cascade)
    var interviews: [Interview] = []

    init(
        id: UUID = UUID(),
        firstName: String,
        lastName: String,
        email: String,
        phoneNumber: String,
        region: String,
        skills: [String] = [],
        cvURL: URL? = nil
    ) {
        self.id = id
        self.firstName = firstName
        self.lastName  = lastName
        self.email = email
        self.phoneNumber = phoneNumber
        self.region = region
        self.cvURL = cvURL
        self.skillsData = try? JSONEncoder().encode(skills)
    }
}

// MARK: - Identifiable
extension Candidate: Identifiable { }

// MARK: - Hashable
//
// This lets us use Candidate directly in SwiftUI Pickers.
extension Candidate: Hashable {
    static func == (lhs: Candidate, rhs: Candidate) -> Bool {
        lhs.id == rhs.id
    }

    func hash(into hasher: inout Hasher) {
        hasher.combine(id)
    }
}

// MARK: - Convenience
extension Candidate {
    /// Computed property to display first + last name
    var fullName: String {
        "\(firstName) \(lastName)"
    }
}
