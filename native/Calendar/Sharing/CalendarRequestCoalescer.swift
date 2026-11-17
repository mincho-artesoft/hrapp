import Foundation

/// Shares an in-flight request for one resource without making unrelated
/// resources wait for the entire account's background synchronization.
@MainActor
final class CalendarRequestCoalescer<Key: Hashable, Value: Sendable> {
    private var requests: [Key: Task<Value, Error>] = [:]

    func run(_ key: Key, operation: @escaping @MainActor () async throws -> Value) async throws -> Value {
        if let existing = requests[key] { return try await existing.value }
        let task = Task { @MainActor in try await operation() }
        requests[key] = task
        defer { requests[key] = nil }
        return try await task.value
    }
}
