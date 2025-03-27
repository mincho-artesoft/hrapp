import SwiftUI

class AppViewModel: ObservableObject {
    @Published var isLoggedIn: Bool = false
    @Published var userID: String = ""
    @Published var email: String = "" {
        didSet {
            // синхронизиране с "глобалната" променлива
            GlobalState.email = email
        }
    }

    private let userDefaults = UserDefaults.standard

    init() {
        // Проверяваме дали вече имаме съхранен потребител
        if let savedUserID = userDefaults.string(forKey: "appleUserID") {
            self.userID = savedUserID
            self.isLoggedIn = true
            if let savedEmail = userDefaults.string(forKey: "userEmail") {
                self.email = savedEmail // автоматично ще повика didSet -> GlobalState.email = savedEmail
            }
        }
    }

    func saveUser(userID: String, email: String?) {
        userDefaults.set(userID, forKey: "appleUserID")
        if let email = email, !email.isEmpty {
            userDefaults.set(email, forKey: "userEmail")
        }
    }

    func logout() {
        userDefaults.removeObject(forKey: "appleUserID")
        userDefaults.removeObject(forKey: "userEmail")
        self.isLoggedIn = false
        self.userID = ""
        self.email = "" // автоматично ще изчисти и GlobalState.email
    }
}
