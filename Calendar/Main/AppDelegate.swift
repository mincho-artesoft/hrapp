import UIKit
import Intents
import Network
import PushKit
import UserNotifications

class AppDelegate: NSObject, UIApplicationDelegate, UNUserNotificationCenterDelegate, PKPushRegistryDelegate {
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
    // MARK: - PKPushRegistryDelegate
    
    
    nonisolated func pushRegistry(_ registry: PKPushRegistry, didUpdate pushCredentials: PKPushCredentials, for type: PKPushType) {
        let deviceToken = pushCredentials.token.map { String(format: "%02.2hhx", $0) }.joined()
        print("VoIP Device Token: \(deviceToken)")
    }
    
    nonisolated func pushRegistry(_ registry: PKPushRegistry, didReceiveIncomingPushWith payload: PKPushPayload, for type: PKPushType, completion: @escaping () -> Void) {
        print("Push Notification VoiP received: \(payload)")
        if let payloadData = payload.dictionaryPayload as? [String: Any] {
            print("Received payload data: \(payloadData)")
           
            
        }
//        completion()
    }
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        
        let voipRegistry = PKPushRegistry(queue: DispatchQueue.main)
        voipRegistry.delegate = self
        voipRegistry.desiredPushTypes = [.voIP]
        DispatchQueue.global(qos: .background).asyncAfter(deadline: .now() + 0.1) {
            // Request permission for notifications
            UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { (granted, error) in
                if granted {
                    DispatchQueue.main.async {
                        UIApplication.shared.registerForRemoteNotifications()
                    }
                }
            }
            UNUserNotificationCenter.current().delegate = self
            
            
        }
        return true
    }

    // MARK: UISceneSession Lifecycle

    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
           let tokenParts = deviceToken.map { data in String(format: "%02.2hhx", data) }
           let token = tokenParts.joined()
           print("Device Token: \(token)")
    }

    func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
           print("Failed to register: \(error)")
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

    nonisolated func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        willPresent notification: UNNotification,
        withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
    ) {
        // Достъп до payload-а, ако трябва
        _ = notification.request.content.userInfo

        // Вместо deprecated `.alert`, използваме новите опции `.banner` и/или `.list`
        completionHandler([.banner, .list, .sound, .badge])
    }

    func application(
        _ application: UIApplication,
        didReceiveRemoteNotification userInfo: [AnyHashable: Any],
        fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void
    ) {
        // 1. Extract relevant data from userInfo
        if let aps = userInfo["aps"] as? [String: Any],
           let contentAvailable = aps["content-available"] as? Int,
           contentAvailable == 1 {
            print("Silent Push Notification received.")
            
//            let uuid = UUID()
//            let handle = "asd"
//            callManagerGlobal.reportIncomingCall(uuid: uuid, handle: handle)
            completionHandler(.newData)
            return
        }
        
        // If the payload doesn’t match, just call completion
        completionHandler(.noData)
    }

    nonisolated func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
        let userInfo = response.notification.request.content.userInfo
        print("Push Notification received in background: \(userInfo)")
        if let aps = userInfo["aps"] as? [String: Any],
           let alert = aps["alert"] as? [String: Any],
           let type = alert["type"] as? String {
            if type == "silent"{
                completionHandler()
            }else if type == "call"{
            }else{
                completionHandler()
            }
        }
    }
}
