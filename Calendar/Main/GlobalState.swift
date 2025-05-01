import Foundation

struct GlobalState {
  
    private static let emailKey = "PrimaryEmail"

    nonisolated(unsafe) static var email: String = {
        // initial load
        UserDefaults.standard.string(forKey: emailKey) ?? ""
    }() {
        // every time someone sets GlobalState.email = …
        didSet {
            UserDefaults.standard.set(email, forKey: emailKey)
        }
    }
}
