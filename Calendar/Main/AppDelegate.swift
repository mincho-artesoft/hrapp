import UIKit
import Intents
import Network
import PushKit
import UserNotifications

class AppDelegate: NSObject, UIApplicationDelegate, UNUserNotificationCenterDelegate {
    var window: UIWindow?

    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
        UNUserNotificationCenter.current().delegate = self
        print("🌦️ [WeatherAlerts] AppDelegate installed as notification-center delegate")
        return true
    }

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

    nonisolated func userNotificationCenter(_ center: UNUserNotificationCenter,
                                            willPresent notification: UNNotification) async -> UNNotificationPresentationOptions {
        if notification.request.identifier.hasPrefix("weather.gps.alert.") {
            print("🌦️ [WeatherAlerts] iOS is presenting foreground notification id=\(notification.request.identifier)")
        } else if notification.request.identifier.hasPrefix("calendar.event.alarm.")
                    || notification.request.content.userInfo["eventIdentifier"] != nil {
            print("📅 [EventNotifications] iOS is presenting foreground event notification id=\(notification.request.identifier)")
        }
        return [.banner, .list, .sound]
    }

    nonisolated func userNotificationCenter(_ center: UNUserNotificationCenter,
                                            didReceive response: UNNotificationResponse,
                                            withCompletionHandler completionHandler: @escaping @Sendable () -> Void) {
        let userInfo = response.notification.request.content.userInfo
        let isWeatherAlert = userInfo["weatherAlertGPS"] as? Bool == true
        let eventIdentifier = userInfo["eventIdentifier"] as? String
        let calendarIdentifier = userInfo["calendarIdentifier"] as? String
        let eventStartDate = userInfo["eventStartDate"] as? TimeInterval
        let pendingInvitationID = userInfo["pendingEventInvitationID"] as? String
        let pendingCalendarInvitationID = userInfo["pendingCalendarInvitationID"] as? String
        let notificationIdentifier = response.notification.request.identifier

        DispatchQueue.main.async {
            // UIKit continues launch/state-restoration work after this callback finishes,
            // so both notification handling and completion must stay on the main thread.
            defer { completionHandler() }

            if pendingInvitationID != nil
                || pendingCalendarInvitationID != nil
                || notificationIdentifier.hasPrefix("shared.event.invitation.")
                || notificationIdentifier.hasPrefix("shared.calendar.invitation.") {
                print("📨 [Invitations] User opened a pending invitation notification")
                PendingEventInvitationNavigation.requestOpen()
                return
            }

            if isWeatherAlert {
                print("🌦️ [WeatherAlerts] User opened a GPS weather-alert notification")
                UserDefaults.standard.set(6, forKey: "selectedTabRoot")
                SavedWeatherRegionsStore.shared.select(nil)
                NotificationCenter.default.post(
                    name: .openWeatherNotification,
                    object: nil
                )
                return
            }

            EventNotificationNavigation.savePending(
                eventStartDate: eventStartDate,
                eventIdentifier: eventIdentifier
            )

            var safeUserInfo: [String: Any] = [:]
            if let eventIdentifier {
                safeUserInfo["eventIdentifier"] = eventIdentifier
            }
            if let calendarIdentifier {
                safeUserInfo["calendarIdentifier"] = calendarIdentifier
            }
            if let eventStartDate {
                safeUserInfo["eventStartDate"] = eventStartDate
            }

            NotificationCenter.default.post(
                name: .openEventNotificationDay,
                object: nil,
                userInfo: safeUserInfo
            )
        }
    }

}
