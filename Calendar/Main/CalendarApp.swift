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
                let date = Date()
                               let calendar = Calendar.current
                               let day = calendar.component(.day, from: date)      // 1..31
                               let month = calendar.component(.month, from: date)  // 1..12
                               let weekday = calendar.component(.weekday, from: date) // 1..7 (Неделя=1)
                               
                               // 2) Преобразуваме ги в "Jan", "Mon", и т.н.
                               let months = ["Jan","Feb","Mar","Apr","May","Jun",
                                             "Jul","Aug","Sep","Oct","Nov","Dec"]
                               // Тук внимавайте: Sunday = 1, Monday = 2, ...
                               let weekdays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
                               
                               let monthName = months[month - 1]
                               let weekdayName = weekdays[weekday - 1]
                               
                               // 3) Проверяваме времето – ако не знаете, сложете "sun"
                               // Примерно имате някаква ваша функция getCurrentWeatherType() -> String
                               // или if let реално време, ако не -> "sun".
                               let weather = getCurrentWeatherType() ?? "sun"
                               
                               // 4) Сглобяваме името на иконата 1:1 с това, което сте генерирали в Python
                               let iconName = "icon_\(monthName)_\(weekdayName)_\(day)_\(weather)"
                               
                               // 5) Питаме AltIcon да смени иконата
                               do {
                                   try AltIcon.setAppIcon(iconName)
                               } catch {
                                   // Ако не стане (примерно липсва в Info.plist) -> fallback
                                   print("Не намирам \(iconName). Слагам fallback (слънце).")
                                   try? AltIcon.setAppIcon("icon_\(monthName)_\(weekdayName)_\(day)_sun")
                               }
                
                
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
    func getCurrentWeatherType() -> String? {
           // Някаква ваша логика. Примерно:
           // return "cloud" или "cloud.rain" и т.н., ако знаете време, иначе nil
           return nil
       }
}
