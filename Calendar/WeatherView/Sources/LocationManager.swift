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
        manager.requestWhenInUseAuthorization()
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
    @MainActor
    func locationManager(_ manager: CLLocationManager,
                         didUpdateLocations locations: [CLLocation]) {

        guard let location = locations.last else { return }
        currentLocation = location

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

                // Само задаваме часовата зона, ако е налична
                if let tz = first.timeZone {
                    WeatherKitViewModel.shared.setTimeZone(tz)
                }

                let weatherVM = WeatherKitViewModel.shared
                if weatherVM.hourlyForecast.isEmpty && weatherVM.dailyForecast.isEmpty {
                    weatherVM.fetchWeatherForCoords(
                        latitude: location.coordinate.latitude,
                        longitude: location.coordinate.longitude
                    )
                }
            }
        }
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        print("Location error: \(error)")
    }
}
