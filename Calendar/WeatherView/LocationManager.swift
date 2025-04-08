import SwiftUI
import CoreLocation
import MapKit
@preconcurrency import WeatherKit

// MARK: - LOCATION MANAGER
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
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        if let location = locations.last {
            currentLocation = location
            
            geocoder.reverseGeocodeLocation(location) { placemarks, error in
                if let err = error {
                    print("Reverse geocoding error: \(err.localizedDescription)")
                    return
                }
                if let first = placemarks?.first {
                    // Пример: град/област
                    self.currentCityName = first.locality ?? first.administrativeArea
                    
                    // Ако placemark има timeZone
                    if let tz = first.timeZone {
                        WeatherKitViewModel.shared.setTimeZone(tz)
                    }
                    
                    // Викаме fetchWeather всеки път щом има нова локация
                    WeatherKitViewModel.shared.fetchWeatherForCoords(
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
