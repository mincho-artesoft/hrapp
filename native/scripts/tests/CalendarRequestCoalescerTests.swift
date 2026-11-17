import Foundation

@MainActor
private final class Gate {
    var continuation: CheckedContinuation<Void, Never>?
    func wait() async { await withCheckedContinuation { continuation = $0 } }
    func open() { continuation?.resume(); continuation = nil }
}

@main
struct CalendarRequestCoalescerTests {
    enum Failure: Error { case expected }

    @MainActor
    static func main() async throws {
        let requests = CalendarRequestCoalescer<String, Int>()
        let gate = Gate()
        var starts = 0
        let first = Task { @MainActor in
            try await requests.run("calendar-a") {
                starts += 1
                await gate.wait()
                return 7
            }
        }
        while gate.continuation == nil { await Task.yield() }
        let second = Task { @MainActor in
            try await requests.run("calendar-a") { starts += 1; return 99 }
        }
        await Task.yield()
        let unrelated = try await requests.run("calendar-b") { 11 }
        precondition(unrelated == 11 && starts == 1, "Unrelated calendars must not wait for account-wide synchronization")
        second.cancel()
        gate.open()
        let firstValue = try await first.value
        let secondValue = try await second.value
        precondition(firstValue == 7 && secondValue == 7 && starts == 1,
                     "Concurrent callers share one operation; dismissing one screen does not cancel the shared sync")
        let later = try await requests.run("calendar-a") { starts += 1; return 8 }
        precondition(later == 8 && starts == 2, "Completed requests are not stale caches")
        do {
            _ = try await requests.run("retry") { throw Failure.expected }
            preconditionFailure("Expected failure")
        } catch Failure.expected { }
        let recovered = try await requests.run("retry") { 12 }
        precondition(recovered == 12, "Failed requests must allow a retry")
        print("PASS: resource-scoped concurrency, coalescing, cancellation isolation, refresh and failure retry")
    }
}
