import SwiftUI
import CoreLocation
import MapKit
@preconcurrency import WeatherKit

// MARK: - LOCATION MANAGER (GPS + Reverse Geocoding)
class LocationManager: NSObject, ObservableObject {
    let manager = CLLocationManager()
    private let geocoder = CLGeocoder()
    
    @Published var currentLocation: CLLocation?
    @Published var currentCityName: String?  // от reverse geocoding
    @Published var authorizationStatus: CLAuthorizationStatus?
    
    override init() {
        super.init()
        manager.delegate = self
        manager.desiredAccuracy = kCLLocationAccuracyBest
        manager.requestWhenInUseAuthorization()
        manager.startUpdatingLocation()
    }
}

// Delegate
extension LocationManager: CLLocationManagerDelegate {
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
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        if let location = locations.last {
            currentLocation = location
            
            // Reverse geocode -> city name
            geocoder.reverseGeocodeLocation(location) { placemarks, error in
                if let err = error {
                    print("Reverse geocoding error: \(err.localizedDescription)")
                    return
                }
                if let first = placemarks?.first {
                    if let city = first.locality {
                        self.currentCityName = city
                    } else {
                        self.currentCityName = first.administrativeArea
                    }
                }
            }
        }
    }
    
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        print("Location error: \(error)")
    }
}

