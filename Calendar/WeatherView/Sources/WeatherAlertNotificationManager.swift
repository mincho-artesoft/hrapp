import CoreLocation
import CryptoKit
import Foundation
@preconcurrency import UserNotifications
@preconcurrency import WeatherKit

/// Checks WeatherKit only for the device's last real GPS position and emits a
/// local notification for each newly discovered official alert.
actor WeatherAlertNotificationManager {
    static let shared = WeatherAlertNotificationManager()

    private static let logPrefix = "🌦️ [WeatherAlerts]"
    private static let notificationsEnabledKey = "WeatherAlertNotificationsEnabled"

    /// Weather warnings are opted in by default, but can only be delivered
    /// after the user has granted the app's shared iOS notification permission.
    nonisolated static var notificationsEnabled: Bool {
        let defaults = UserDefaults.standard
        guard defaults.object(forKey: notificationsEnabledKey) != nil else { return true }
        return defaults.bool(forKey: notificationsEnabledKey)
    }

    private struct StoredGPSLocation: Codable {
        let latitude: Double
        let longitude: Double
        let timestamp: Date
        var displayName: String?

        var location: CLLocation {
            CLLocation(
                coordinate: CLLocationCoordinate2D(latitude: latitude, longitude: longitude),
                altitude: 0,
                horizontalAccuracy: kCLLocationAccuracyKilometer,
                verticalAccuracy: -1,
                timestamp: timestamp
            )
        }
    }

    private let gpsLocationKey = "WeatherAlerts.LastGPSLocation.v1"
    // v4 intentionally retries currently active alerts once after fixing the
    // cold-launch presentation path used by the previous implementation.
    private let activeAlertFingerprintsKey = "WeatherAlerts.ActiveGPSFingerprints.v4"
    private let lastSuccessfulCheckKey = "WeatherAlerts.LastSuccessfulGPSCheck.v2"
    private let notificationPrefix = "weather.gps.alert."
    private let minimumCheckInterval: TimeInterval = 15 * 60
    private let maximumGPSAge: TimeInterval = 24 * 60 * 60
    private var directCheckIsRunning = false

    private init() {}

    func setNotificationsEnabled(_ enabled: Bool) async {
        UserDefaults.standard.set(enabled, forKey: Self.notificationsEnabledKey)
        log("Weather alert notifications were \(enabled ? "enabled" : "disabled") by the user")

        if enabled {
            await checkForNewGPSAlerts(force: true, reason: "weather-alert-toggle-enabled")
        } else {
            UserDefaults.standard.removeObject(forKey: activeAlertFingerprintsKey)
            UserDefaults.standard.removeObject(forKey: lastSuccessfulCheckKey)
            cancelPendingWeatherAlertNotifications()
        }
    }

    func recordGPSLocation(_ location: CLLocation, displayName: String? = nil) {
        guard location.horizontalAccuracy >= 0 else {
            log(
                "Ignored location with invalid accuracy "
                    + locationDescription(location, displayName: displayName)
            )
            return
        }

        log("Received GPS location " + locationDescription(location, displayName: displayName))

        let defaults = UserDefaults.standard
        var stored = StoredGPSLocation(
            latitude: location.coordinate.latitude,
            longitude: location.coordinate.longitude,
            timestamp: location.timestamp,
            displayName: displayName
        )

        if let data = defaults.data(forKey: gpsLocationKey),
           let previous = try? JSONDecoder().decode(StoredGPSLocation.self, from: data) {
            if Self.coordinatesAreNearby(previous, stored) {
                if stored.displayName == nil {
                    stored.displayName = previous.displayName
                }
            } else {
                // The user has moved to another GPS area. Do not let a recent
                // check for the old area throttle the new location.
                log(
                    "GPS area changed from "
                        + coordinateDescription(latitude: previous.latitude, longitude: previous.longitude)
                        + " to "
                        + coordinateDescription(latitude: stored.latitude, longitude: stored.longitude)
                        + "; clearing the alert throttle and active fingerprints"
                )
                defaults.removeObject(forKey: lastSuccessfulCheckKey)
                defaults.removeObject(forKey: activeAlertFingerprintsKey)
            }
        }

        guard let data = try? JSONEncoder().encode(stored) else {
            log("Could not encode the GPS location for persistence")
            return
        }
        defaults.set(data, forKey: gpsLocationKey)
        log("Saved GPS location for weather-alert checks")
    }

    func updateGPSDisplayName(_ displayName: String?, for location: CLLocation) {
        guard let displayName, !displayName.isEmpty,
              let data = UserDefaults.standard.data(forKey: gpsLocationKey),
              var stored = try? JSONDecoder().decode(StoredGPSLocation.self, from: data) else {
            log("GPS display name was not saved because the name or stored GPS location is missing")
            return
        }

        let candidate = StoredGPSLocation(
            latitude: location.coordinate.latitude,
            longitude: location.coordinate.longitude,
            timestamp: location.timestamp,
            displayName: displayName
        )
        guard Self.coordinatesAreNearby(stored, candidate) else {
            log("Ignored GPS display name '\(displayName)' because it belongs to another coordinate")
            return
        }

        stored.displayName = displayName
        if let updatedData = try? JSONEncoder().encode(stored) {
            UserDefaults.standard.set(updatedData, forKey: gpsLocationKey)
            log("Updated GPS display name to '\(displayName)'")
        } else {
            log("Could not encode the updated GPS display name")
        }
    }

    func checkForNewGPSAlerts(
        force: Bool = false,
        reason: String = "unspecified"
    ) async {
        log("Starting alert check (reason=\(reason), force=\(force))")

        guard Self.notificationsEnabled else {
            log("Stopped: weather alert notifications are disabled in the app")
            return
        }

        guard !directCheckIsRunning else {
            log("Stopped: another direct GPS alert check is already running")
            return
        }
        directCheckIsRunning = true
        defer { directCheckIsRunning = false }

        let center = UNUserNotificationCenter.current()
        let settings = await center.notificationSettings()
        logNotificationSettings(settings)
        guard Self.notificationsAreAllowed(settings.authorizationStatus) else {
            log("Stopped: notification authorization is \(authorizationDescription(settings.authorizationStatus))")
            return
        }

        let defaults = UserDefaults.standard
        if !force,
           let lastCheck = defaults.object(forKey: lastSuccessfulCheckKey) as? Date,
           Date().timeIntervalSince(lastCheck) < minimumCheckInterval {
            let secondsRemaining = max(
                0,
                minimumCheckInterval - Date().timeIntervalSince(lastCheck)
            )
            log("Stopped: throttled for another \(Int(secondsRemaining.rounded(.up))) seconds")
            return
        }

        guard let data = defaults.data(forKey: gpsLocationKey) else {
            log("Stopped: no real GPS location has been stored yet")
            return
        }
        guard let storedGPS = try? JSONDecoder().decode(StoredGPSLocation.self, from: data) else {
            log("Stopped: the stored GPS location could not be decoded")
            return
        }

        let gpsAge = Date().timeIntervalSince(storedGPS.timestamp)
        guard gpsAge <= maximumGPSAge else {
            log("Stopped: stored GPS location is stale (age=\(Int(gpsAge)) seconds)")
            return
        }

        log(
            "Requesting WeatherKit alerts for "
                + coordinateDescription(latitude: storedGPS.latitude, longitude: storedGPS.longitude)
                + ", name=\(storedGPS.displayName ?? "unknown"), gpsAge=\(Int(max(0, gpsAge))) seconds"
        )

        do {
            let alerts = try await WeatherService.shared.weather(
                for: storedGPS.location,
                including: .alerts
            ) ?? []
            logAlerts(alerts, source: "direct GPS WeatherKit check")
            await deliverNewAlerts(alerts, gps: storedGPS, center: center)
            defaults.set(Date(), forKey: lastSuccessfulCheckKey)
            log("Finished alert check successfully")
        } catch {
            log("WeatherKit request failed: \(error.localizedDescription)")
        }
    }

    /// Uses alerts already returned by the GPS forecast request. This avoids a
    /// second WeatherKit lookup and bypasses the background throttle whenever
    /// the visible GPS forecast has just proven that an alert is active.
    func processFetchedGPSAlerts(
        _ alerts: [WeatherAlert]?,
        location: CLLocation,
        displayName: String? = nil
    ) async {
        log(
            "Received alerts with the visible GPS forecast at "
                + coordinateDescription(
                    latitude: location.coordinate.latitude,
                    longitude: location.coordinate.longitude
                )
                + ", name=\(displayName ?? "unknown")"
        )
        logAlerts(alerts ?? [], source: "visible GPS forecast")
        recordGPSLocation(location, displayName: displayName)

        guard Self.notificationsEnabled else {
            log("Did not notify: weather alert notifications are disabled in the app")
            return
        }

        let center = UNUserNotificationCenter.current()
        let settings = await center.notificationSettings()
        logNotificationSettings(settings)
        guard Self.notificationsAreAllowed(settings.authorizationStatus) else {
            log("Did not notify: notification authorization is \(authorizationDescription(settings.authorizationStatus))")
            return
        }

        let gps = storedGPSLocation(fallback: location, displayName: displayName)
        await deliverNewAlerts(alerts ?? [], gps: gps, center: center)
        UserDefaults.standard.set(Date(), forKey: lastSuccessfulCheckKey)
    }

    private func deliverNewAlerts(
        _ alerts: [WeatherAlert],
        gps: StoredGPSLocation,
        center: UNUserNotificationCenter
    ) async {
        guard Self.notificationsEnabled else {
            log("Did not deliver alerts: weather alert notifications are disabled in the app")
            return
        }

        let defaults = UserDefaults.standard
        let alertEntries = alerts.map { alert in
            (alert: alert, fingerprint: fingerprint(for: alert, gps: gps))
        }
        let currentFingerprints = Set(alertEntries.map(\.fingerprint))
        let persistedFingerprints = Set(
            defaults.stringArray(forKey: activeAlertFingerprintsKey) ?? []
        )
        var recordedFingerprints = persistedFingerprints.intersection(currentFingerprints)

        log(
            "Processing \(alerts.count) active alert(s); "
                + "persisted=\(persistedFingerprints.count), stillActive=\(recordedFingerprints.count)"
        )

        if alerts.isEmpty {
            defaults.set([], forKey: activeAlertFingerprintsKey)
            log("No active GPS alerts; cleared active fingerprints")
            return
        }

        for entry in alertEntries {
            // Re-read actor-owned persisted state because another alert fetch
            // may have completed while this task was suspended awaiting iOS.
            let latestRecorded = Set(
                defaults.stringArray(forKey: activeAlertFingerprintsKey) ?? []
            )
            guard !latestRecorded.contains(entry.fingerprint) else {
                recordedFingerprints.insert(entry.fingerprint)
                log(
                    "Skipped already-notified alert fingerprint="
                        + shortFingerprint(entry.fingerprint)
                        + ", summary='\(singleLine(entry.alert.summary))'"
                )
                continue
            }

            // Persist before awaiting notification delivery so a concurrent
            // foreground/background callback cannot enqueue the same alert.
            recordedFingerprints.insert(entry.fingerprint)
            defaults.set(Array(recordedFingerprints).sorted(), forKey: activeAlertFingerprintsKey)

            do {
                let request = notificationRequest(
                    for: entry.alert,
                    fingerprint: entry.fingerprint,
                    gps: gps
                )
                log(
                    "Scheduling local notification id=\(request.identifier), "
                        + "summary='\(singleLine(entry.alert.summary))'"
                )
                try await center.add(request)
                log("iOS accepted local notification id=\(request.identifier)")
            } catch {
                recordedFingerprints.remove(entry.fingerprint)
                defaults.set(Array(recordedFingerprints).sorted(), forKey: activeAlertFingerprintsKey)
                log(
                    "iOS rejected local notification fingerprint="
                        + shortFingerprint(entry.fingerprint)
                        + ": \(error.localizedDescription)"
                )
            }
        }

        defaults.set(Array(recordedFingerprints).sorted(), forKey: activeAlertFingerprintsKey)
        log("Saved \(recordedFingerprints.count) active alert fingerprint(s)")
    }

    private func cancelPendingWeatherAlertNotifications() {
        let prefix = notificationPrefix
        let center = UNUserNotificationCenter.current()

        center.getPendingNotificationRequests { requests in
            let identifiers = requests
                .map(\.identifier)
                .filter { $0.hasPrefix(prefix) }

            guard !identifiers.isEmpty else { return }
            center.removePendingNotificationRequests(withIdentifiers: identifiers)
            print(
                "\(Self.logPrefix) Cancelled \(identifiers.count) "
                    + "pending weather alert notification(s)"
            )
        }
    }

    private func storedGPSLocation(
        fallback location: CLLocation,
        displayName: String?
    ) -> StoredGPSLocation {
        if let data = UserDefaults.standard.data(forKey: gpsLocationKey),
           let stored = try? JSONDecoder().decode(StoredGPSLocation.self, from: data) {
            return stored
        }
        return StoredGPSLocation(
            latitude: location.coordinate.latitude,
            longitude: location.coordinate.longitude,
            timestamp: location.timestamp,
            displayName: displayName
        )
    }

    private func notificationRequest(
        for alert: WeatherAlert,
        fingerprint: String,
        gps: StoredGPSLocation
    ) -> UNNotificationRequest {
        let content = UNMutableNotificationContent()
        content.title = "\(severityMarker(alert.severity)) \(NSLocalizedString("Weather", comment: "Weather notification title")) · \(alert.severity.description)"
        content.subtitle = gps.displayName
            ?? NSLocalizedString("Current Location", comment: "Current GPS weather location")
        content.body = alert.summary
        content.sound = .default
        content.threadIdentifier = "weather.alerts.gps"
        content.userInfo = [
            "weatherAlertGPS": true,
            "latitude": gps.latitude,
            "longitude": gps.longitude,
            "detailsURL": alert.detailsURL.absoluteString
        ]

        return UNNotificationRequest(
            identifier: notificationPrefix + fingerprint,
            content: content,
            // A short trigger avoids asking iOS to present a banner while the
            // app is still constructing its first scene during cold launch.
            trigger: UNTimeIntervalNotificationTrigger(timeInterval: 1, repeats: false)
        )
    }

    private func fingerprint(for alert: WeatherAlert, gps: StoredGPSLocation) -> String {
        let latitudeBucket = (gps.latitude * 10).rounded() / 10
        let longitudeBucket = (gps.longitude * 10).rounded() / 10
        let raw = [
            String(latitudeBucket),
            String(longitudeBucket),
            alert.source,
            alert.region ?? "",
            alert.summary,
            String(describing: alert.severity)
        ].joined(separator: "|")
        let digest = SHA256.hash(data: Data(raw.utf8))
        return digest.map { String(format: "%02x", $0) }.joined()
    }

    private func severityMarker(_ severity: WeatherSeverity) -> String {
        switch severity {
        case .extreme: return "🔴"
        case .severe: return "🟠"
        case .moderate: return "🟡"
        case .minor: return "🔵"
        case .unknown: return "⚠️"
        @unknown default: return "⚠️"
        }
    }

    private static func notificationsAreAllowed(_ status: UNAuthorizationStatus) -> Bool {
        switch status {
        case .authorized, .provisional, .ephemeral: return true
        case .denied, .notDetermined: return false
        @unknown default: return false
        }
    }

    private func logAlerts(_ alerts: [WeatherAlert], source: String) {
        log("\(source) returned \(alerts.count) alert(s)")
        for (index, alert) in alerts.enumerated() {
            log(
                "Alert[\(index)] severity=\(alert.severity.description), "
                    + "region=\(alert.region ?? "unknown"), source=\(alert.source), "
                    + "summary='\(singleLine(alert.summary))'"
            )
        }
    }

    private func logNotificationSettings(_ settings: UNNotificationSettings) {
        log(
            "Notification settings: authorization=\(authorizationDescription(settings.authorizationStatus)), "
                + "alert=\(notificationSettingDescription(settings.alertSetting)), "
                + "center=\(notificationSettingDescription(settings.notificationCenterSetting)), "
                + "lockScreen=\(notificationSettingDescription(settings.lockScreenSetting)), "
                + "sound=\(notificationSettingDescription(settings.soundSetting)), "
                + "badge=\(notificationSettingDescription(settings.badgeSetting))"
        )
    }

    private func authorizationDescription(_ status: UNAuthorizationStatus) -> String {
        switch status {
        case .notDetermined: return "notDetermined"
        case .denied: return "denied"
        case .authorized: return "authorized"
        case .provisional: return "provisional"
        case .ephemeral: return "ephemeral"
        @unknown default: return "unknown(\(status.rawValue))"
        }
    }

    private func notificationSettingDescription(_ setting: UNNotificationSetting) -> String {
        switch setting {
        case .notSupported: return "notSupported"
        case .disabled: return "disabled"
        case .enabled: return "enabled"
        @unknown default: return "unknown(\(setting.rawValue))"
        }
    }

    private func locationDescription(_ location: CLLocation, displayName: String?) -> String {
        coordinateDescription(
            latitude: location.coordinate.latitude,
            longitude: location.coordinate.longitude
        )
            + ", accuracy=\(Int(location.horizontalAccuracy))m"
            + ", age=\(Int(max(0, Date().timeIntervalSince(location.timestamp))))s"
            + ", name=\(displayName ?? "unknown")"
    }

    private func coordinateDescription(latitude: Double, longitude: Double) -> String {
        String(format: "%.5f,%.5f", latitude, longitude)
    }

    private func shortFingerprint(_ fingerprint: String) -> String {
        String(fingerprint.prefix(10))
    }

    private func singleLine(_ text: String) -> String {
        text.replacingOccurrences(of: "\n", with: " ")
    }

    private func log(_ message: String) {
        print("\(Self.logPrefix) \(message)")
    }

    private static func coordinatesAreNearby(
        _ lhs: StoredGPSLocation,
        _ rhs: StoredGPSLocation
    ) -> Bool {
        abs(lhs.latitude - rhs.latitude) < 0.02
            && abs(lhs.longitude - rhs.longitude) < 0.02
    }
}
