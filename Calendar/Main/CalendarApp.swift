import SwiftUI

@main
struct CalendarApp: App {
    // Свързваме SwiftUI App с AppDelegate, за да обработваме URL schemes (Google Sign-In или др.)
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    
    // Главният ViewModel
    @StateObject var appViewModel = AppViewModel()
    
    var body: some Scene {
        WindowGroup {
            // Логика кой изглед да покажем
            if appViewModel.isLoggedIn {
                // Ако сме логнати, но нямаме email => RequestEmailView
                if appViewModel.email.isEmpty {
                    RequestEmailView()
                        .environmentObject(appViewModel)
                } else {
                    // Иначе – основният екран
                    RootView()
                        .environmentObject(appViewModel)
                }
            } else {
                // Ако не сме логнати, показваме LoginView
                LoginView()
                    .environmentObject(appViewModel)
            }
        }
    }
}
