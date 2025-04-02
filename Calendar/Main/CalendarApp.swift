import SwiftUI
import AltIcon

@main
struct CalendarApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    
    @Environment(\.scenePhase) private var scenePhase
    
    @StateObject var appViewModel = AppViewModel()
    
    var body: some Scene {
        WindowGroup {
            if appViewModel.isLoggedIn {
                if appViewModel.email.isEmpty {
                    RequestEmailView()
                        .environmentObject(appViewModel)
                } else {
                    RootView()
                        .environmentObject(appViewModel)
                }
            } else {
                LoginView()
                    .environmentObject(appViewModel)
            }
        }
        .onChange(of: scenePhase) { newPhase in
            switch newPhase {
            case .active:
                print("Приложението се върна на фокус. Пускаме sync таймерите.")
                CalendarViewModel.shared.startGoogleCalendarSync()
                CalendarViewModel.shared.startMicrosoftCalendarSync()
                
            case .background:
                print("Приложението е минимизирано (background). Спираме sync таймерите.")
                CalendarViewModel.shared.stopGoogleCalendarSync()
                CalendarViewModel.shared.stopMicrosoftCalendarSync()
//                setAppIcon("AppIcon 2")
                
            case .inactive:
                print("Приложението е временно неактивно.")
                
            @unknown default:
                break
            }
        }
    }
}
