import SwiftUI
import CoreLocation
import MapKit
@preconcurrency import WeatherKit

// MARK: - LOCATION MANAGER
@MainActor                // <── add this
class LocationManager: NSObject, ObservableObject {
    let manager = CLLocationManager()
    private let geocoder = CLGeocoder()
    
    @Published var currentLocation: CLLocation?
    @Published var currentCityName: String?
    @Published var authorizationStatus: CLAuthorizationStatus?
    
    // За да не „превикваме“ многократно API-то
    private var didSetInitialWeather = false
    
    override init() {
        super.init()
        manager.delegate = self
        manager.desiredAccuracy = kCLLocationAccuracyBest
        manager.requestWhenInUseAuthorization()
        // Тук не викаме веднага startUpdatingLocation(),
        // защото искаме да го стартираме след като потребителят даде разрешение.
    }
}

extension LocationManager: @preconcurrency CLLocationManagerDelegate {
    func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        self.authorizationStatus = status
        
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
    /// Тук правим reverse geocoding, вземаме timeZone (ако е налична) и тогава fetch-ваме времето.
    @MainActor
    func locationManager(_ manager: CLLocationManager,
                         didUpdateLocations locations: [CLLocation]) {

        guard let location = locations.last else { return }
        currentLocation = location          // ← already on MainActor here

        geocoder.reverseGeocodeLocation(location) { [weak self] placemarks, error in
            guard let self else { return }

            if let error {        // background queue
                print("Reverse geocoding error:", error.localizedDescription)
                return
            }
            guard let first = placemarks?.first else { return }

            // ⚠️ NOT on the MainActor right now!

            Task { @MainActor [weak self] in      // ← jump back
                guard let self else { return }

                self.currentCityName = first.locality ?? first.administrativeArea

                if let tz = first.timeZone {
                    WeatherKitViewModel.shared.setTimeZone(tz)
                }

                WeatherKitViewModel.shared.fetchWeatherForCoords(
                    latitude: location.coordinate.latitude,
                    longitude: location.coordinate.longitude
                )
            }
        }
    }


    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        print("Location error: \(error)")
    }
}
