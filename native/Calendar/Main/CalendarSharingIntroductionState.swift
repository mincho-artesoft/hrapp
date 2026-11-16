import Combine
import Foundation

/// This is a feature introduction, not a per-version prompt. Keep the key stable
/// across releases and separate from the app-open-ad launch counter.
@MainActor
final class CalendarSharingIntroductionState: ObservableObject {
    static let shared = CalendarSharingIntroductionState()
    static let completedKey = "hasSeenLocalCalendarSharingIntroduction"

    @Published private(set) var hasCompleted: Bool
    private(set) var presentationReserved = false
    private let defaults: UserDefaults

    init(defaults: UserDefaults = .standard) {
        self.defaults = defaults
        hasCompleted = defaults.bool(forKey: Self.completedKey)
    }

    func beginPresentation() -> Bool {
        guard !hasCompleted, !presentationReserved else { return false }
        presentationReserved = true
        return true
    }

    func complete() {
        defaults.set(true, forKey: Self.completedKey)
        hasCompleted = true
        presentationReserved = false
    }

    func releasePresentation() {
        presentationReserved = false
    }
}
