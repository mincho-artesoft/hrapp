import SwiftUI
import GoogleSignIn  // Ако ползвате GoogleSignIn

@main
struct CalendarApp: App {
    // 1) Свързваме SwiftUI App с AppDelegate, за да обработваме URL schemes
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate

    var body: some Scene {
        WindowGroup {
            RootView()  // <-- Вашият основен SwiftUI изглед
        }
    }
}

