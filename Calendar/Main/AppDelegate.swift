import UIKit
import GoogleSignIn


// Примерен AppDelegate, където можем да прихващаме
/// openURL callbacks, нужни за GoogleSignIn
class AppDelegate: NSObject, UIApplicationDelegate {
    
    // Ако искате да вършите някакви допълнителни неща при стартиране на приложението
    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
        // Например: настройвате Firebase, Analytics, други...
        return true
    }

    // Този метод се вика, когато потребителят приключи OAuth потока и iOS отвори вашето app обратно:
    func application(_ app: UIApplication,
                     open url: URL,
                     options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
        // Подаваме URL-а на GIDSignIn, за да завърши логина, ако е Google OAuth
        if GIDSignIn.sharedInstance.handle(url) {
            return true
        }
        // Ако имате и други URL schemes, проверете тук
        return false
    }
}
