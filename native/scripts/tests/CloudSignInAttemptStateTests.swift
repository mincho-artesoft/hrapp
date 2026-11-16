import Foundation

@main enum CloudSignInAttemptStateTests {
    static func main() {
        var state = CloudSignInAttemptState()
        var checks = 0
        func check(_ condition: Bool) {
            precondition(condition, "Cloud sign-in lifecycle regression at check \(checks + 1)")
            checks += 1
        }

        check(state.current == nil)
        for provider in ["google", "apple", "microsoft"] {
            let first = state.begin(provider: provider)!
            check(first.provider == provider)
            check(state.contains(first.id))
            check(state.begin(provider: provider) == nil) // Double tap.
            check(state.begin(provider: "another-provider") == nil)
            check(!state.finish(UUID())) // An unrelated callback cannot unlock buttons.
            check(state.current == first)
            check(state.finish(first.id)) // Success, failure, cancel and timeout all finish.
            check(state.current == nil)
            check(!state.finish(first.id)) // Delegate called twice.

            let retry = state.begin(provider: provider)!
            check(retry.id != first.id)
            check(!state.contains(first.id))
            check(!state.finish(first.id)) // Late response from cancelled system sheet.
            check(state.current == retry)
            check(state.finish(retry.id))
        }
        let google = state.begin(provider: "google")!
        check(state.finish(google.id))
        let apple = state.begin(provider: "apple")!
        check(!state.finish(google.id))
        check(state.current == apple)
        check(state.finish(apple.id))
        print("PASS: \(checks) cloud sign-in lifecycle checks")
    }
}
