import SwiftUI
import CoreLocation
import MapKit
@preconcurrency import WeatherKit

// MARK: - LOCATION MANAGER
@MainActor
class LocationManager: NSObject, ObservableObject {
    let manager = CLLocationManager()
    private let geocoder = CLGeocoder()
    
    @Published var currentLocation: CLLocation?
    @Published var currentCityName: String?
    @Published var authorizationStatus: CLAuthorizationStatus?
    
    override init() {
        super.init()
        manager.delegate = self
        manager.desiredAccuracy = kCLLocationAccuracyBest
        #if DEBUG
        if ScreenshotMode.isActive { return }
        #endif
        manager.requestWhenInUseAuthorization()
    }
}

extension LocationManager: @preconcurrency CLLocationManagerDelegate {
    func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        self.authorizationStatus = status
        #if DEBUG
        if ScreenshotMode.isActive { return }
        #endif
        
        print("🌦️ [WeatherAlerts] Location authorization changed: \(status.rawValue)")

        switch status {
        case .authorizedWhenInUse, .authorizedAlways:
            manager.startUpdatingLocation()
        case .denied, .restricted:
            print("Location denied or restricted")
            manager.stopUpdatingLocation()
        case .notDetermined:
            manager.requestWhenInUseAuthorization()
        @unknown default:
            break
        }
    }
    
    /// Ключовото място, където получаваме GPS координати.
    @MainActor
    func locationManager(_ manager: CLLocationManager,
                         didUpdateLocations locations: [CLLocation]) {

        #if DEBUG
        if ScreenshotMode.isActive { return }
        #endif

        guard let location = locations.last else { return }
        print(
            String(
                format: "🌦️ [WeatherAlerts] CLLocationManager update: %.5f,%.5f accuracy=%.0fm age=%.0fs",
                location.coordinate.latitude,
                location.coordinate.longitude,
                location.horizontalAccuracy,
                max(0, Date().timeIntervalSince(location.timestamp))
            )
        )
        currentLocation = location
        Task {
            await WeatherAlertNotificationManager.shared.recordGPSLocation(location)
            await WeatherAlertNotificationManager.shared.checkForNewGPSAlerts(
                reason: "gps-location-update"
            )
        }

        // Извършваме Reverse Geocoding, за да намерим името на града и часовата зона
        geocoder.reverseGeocodeLocation(location) { [weak self] placemarks, error in
            guard let self else { return }

            if let error {
                print("Reverse geocoding error:", error.localizedDescription)
                return
            }
            guard let first = placemarks?.first else { return }

            // Връщаме се на MainActor, за да обновим UI променливите
            Task { @MainActor [weak self] in
                guard let self else { return }

                self.currentCityName = first.locality ?? first.administrativeArea
                Task {
                    await WeatherAlertNotificationManager.shared.updateGPSDisplayName(
                        self.currentCityName,
                        for: location
                    )
                }

                // Само задаваме часовата зона, ако е налична
                if let tz = first.timeZone {
                    WeatherKitViewModel.shared.setTimeZone(tz)
                }

                let weatherVM = WeatherKitViewModel.shared
                if weatherVM.hourlyForecast.isEmpty && weatherVM.dailyForecast.isEmpty {
                    weatherVM.fetchWeatherForCoords(
                        latitude: location.coordinate.latitude,
                        longitude: location.coordinate.longitude,
                        isGPSLocation: true,
                        gpsDisplayName: self.currentCityName
                    )
                }
            }
        }
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        print("🌦️ [WeatherAlerts] CLLocationManager failed: \(error)")
    }
}
