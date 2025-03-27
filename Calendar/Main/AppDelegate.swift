import UIKit
import GoogleSignIn

class AppDelegate: NSObject, UIApplicationDelegate {
    
    // Ако ползваш Firebase или други услуги – инициализирай ги тук
    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
        // Пример: FirebaseApp.configure()
        // Пример: настройка на Analytics и т.н.
        
        return true
    }
    
    // Тук iOS се връща, когато приключи Google OAuth извън приложението
    func application(_ app: UIApplication,
                     open url: URL,
                     options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
        // Google SignIn callback:
        if GIDSignIn.sharedInstance.handle(url) {
            return true
        }
        // Ако имаш и други OAuth провайдъри, проверяваш тук
        return false
    }
}
