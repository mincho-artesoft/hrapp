import Foundation

@main
enum CalendarSharingIntroductionTests {
    @MainActor
    static func main() {
        let suite = "CalendarSharingIntroductionTests.\(UUID().uuidString)"
        let defaults = UserDefaults(suiteName: suite)!
        defer { defaults.removePersistentDomain(forName: suite) }

        // Existing installs also see the feature introduction once, without
        // resetting the unrelated app-open-ad launch state.
        defaults.set(true, forKey: "hasLaunchedBefore")
        let first = CalendarSharingIntroductionState(defaults: defaults)
        precondition(!first.hasCompleted)
        precondition(first.beginPresentation())
        precondition(!first.beginPresentation(), "A second window must not present another copy")
        first.releasePresentation()
        precondition(first.beginPresentation(), "An interrupted presentation can be retried")
        first.complete()
        precondition(first.hasCompleted)
        precondition(!first.beginPresentation())
        precondition(defaults.bool(forKey: "hasLaunchedBefore"))

        let relaunched = CalendarSharingIntroductionState(defaults: defaults)
        precondition(relaunched.hasCompleted)
        precondition(!relaunched.beginPresentation(), "Never show again after dismissal")
        print("PASS introduction: first display, duplicate suppression, interrupted presentation, persistent completion and existing installs")
    }
}
