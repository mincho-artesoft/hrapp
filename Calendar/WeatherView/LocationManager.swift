//import CoreLocation
//import SwiftUI
//
//@MainActor  // <-- казваме, че целият клас действа на main actor
//class LocationManager: NSObject, ObservableObject, @preconcurrency CLLocationManagerDelegate {
//    private let manager = CLLocationManager()
//
//    @Published var userLocation: CLLocationCoordinate2D?
//    @Published var locationStatus: CLAuthorizationStatus?
//
//    override init() {
//        super.init()
//        manager.delegate = self
//        manager.desiredAccuracy = kCLLocationAccuracyBest
//    }
//    
//    func requestLocation() {
//        manager.requestWhenInUseAuthorization()
//        manager.requestLocation()
//    }
//    
//    // Тъй като целият клас е @MainActor, този метод винаги ще се вика на main actor
//    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
//        guard let location = locations.last else { return }
//        userLocation = location.coordinate  // Вече без warning
//    }
//    
//    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
//        print("Грешка при локация: \(error.localizedDescription)")
//    }
//    
//    func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
//        locationStatus = status
//        if status == .authorizedWhenInUse || status == .authorizedAlways {
//            manager.requestLocation()
//        }
//    }
//}
