import UIKit
import Intents
import Network
import PushKit
import UserNotifications

class AppDelegate: NSObject, UIApplicationDelegate {
    var window: UIWindow?

    func applicationWillTerminate(_ application: UIApplication) {
        if let userDefaults = UserDefaults(suiteName: "group.ARTE-SOFT.sandBOX") {
            userDefaults.set(true, forKey: "isStop")
        }
        
        print("Приложението ще бъде прекратено")
    }

    
    func application(_ application: UIApplication, supportedInterfaceOrientationsFor window: UIWindow?) -> UIInterfaceOrientationMask {
        return [.portrait, .landscapeLeft, .landscapeRight, .portraitUpsideDown]
    }

    
    func application(_ application: UIApplication, configurationForConnecting connectingSceneSession: UISceneSession, options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        // Called when a new scene session is being created.
        // Use this method to select a configuration to create the new scene with.
        return UISceneConfiguration(name: "Default Configuration", sessionRole: connectingSceneSession.role)
    }

    func application(_ application: UIApplication, didDiscardSceneSessions sceneSessions: Set<UISceneSession>) {
        // Called when the user discards a scene session.
        // If any sessions were discarded while the application was not running, this will be called shortly after application:didFinishLaunchingWithOptions.
        // Use this method to release any resources that were specific to the discarded scenes, as they will not return.
    }

}
