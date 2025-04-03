import SwiftUI
import AltIcon

@main
struct CalendarApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    
    @Environment(\.scenePhase) private var scenePhase
    
    @StateObject var appViewModel = AppViewModel()
    
    var body: some Scene {
        WindowGroup {
            // ВМЕСТО да показваме LoginView/RequestEmailView/RootView в зависимост от логина,
            // винаги показваме RootView. Така приложението не изисква логин на старта.
            RootView()
                .environmentObject(appViewModel)
        }
        .onChange(of: scenePhase) { newPhase in
            switch newPhase {
            case .active:
                print("Приложението е на фокус. Пускаме sync таймерите.")
                CalendarViewModel.shared.startGoogleCalendarSync()
                CalendarViewModel.shared.startMicrosoftCalendarSync()
                
                // Примерна логика за смяна на иконата при активиране
                let date = Date()
                let calendar = Calendar.current
                let day = calendar.component(.day, from: date)
                let month = calendar.component(.month, from: date)
                let weekday = calendar.component(.weekday, from: date)
                
                let months = ["Jan","Feb","Mar","Apr","May","Jun",
                              "Jul","Aug","Sep","Oct","Nov","Dec"]
                let weekdays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
                
                let monthName = months[month - 1]
                let weekdayName = weekdays[weekday - 1]
                
                let weather = getCurrentWeatherType() ?? "sun"
                let iconName = "icon_\(monthName)_\(weekdayName)_\(day)_\(weather)"
                
                do {
                    try AltIcon.setAppIcon(iconName)
                } catch {
                    print("Не намирам \(iconName). Слагам fallback (слънце).")
                    try? AltIcon.setAppIcon("icon_\(monthName)_\(weekdayName)_\(day)_sun")
                }
                
            case .background:
                print("Приложението е на заден план. Спираме sync таймерите.")
                CalendarViewModel.shared.stopGoogleCalendarSync()
                CalendarViewModel.shared.stopMicrosoftCalendarSync()
                
            case .inactive:
                print("Приложението е временно неактивно.")
                
            @unknown default:
                break
            }
        }
    }
    
    /// Вашата функция, която връща типа време ("sun", "cloud", "cloud.rain", и т.н.)
    func getCurrentWeatherType() -> String? {
        // Примерно реална логика или API; тук просто nil
        return nil
    }
}
