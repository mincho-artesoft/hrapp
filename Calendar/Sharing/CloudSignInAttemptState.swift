import Foundation

/// A late callback from a cancelled system sheet must not finish a newer login.
struct CloudSignInAttemptState {
    struct Attempt: Equatable {
        let id: UUID
        let provider: String
    }
    private(set) var current: Attempt?

    mutating func begin(provider: String) -> Attempt? {
        guard current == nil else { return nil }
        let attempt = Attempt(id: UUID(), provider: provider)
        current = attempt
        return attempt
    }

    func contains(_ id: UUID) -> Bool { current?.id == id }

    @discardableResult
    mutating func finish(_ id: UUID) -> Bool {
        guard contains(id) else { return false }
        current = nil
        return true
    }
}
