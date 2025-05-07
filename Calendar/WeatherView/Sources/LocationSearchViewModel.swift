import Combine
import MapKit
import CoreLocation

@MainActor
class LocationSearchViewModel: NSObject, ObservableObject, @preconcurrency MKLocalSearchCompleterDelegate {
    
    @Published var queryFragment: String = ""
    @Published var searchResults: [MKLocalSearchCompletion] = []
    @Published var selectedPlacemark: MKPlacemark? = nil
    @Published var searchError: Error? = nil

    private var searchCompleter: MKLocalSearchCompleter
    private var cancellable: AnyCancellable?
    
    /// Примерно подаваме WeatherKitViewModel като singleton
    let weatherKitViewModel: WeatherKitViewModel = WeatherKitViewModel.shared
    
    override init() {
        self.searchCompleter = MKLocalSearchCompleter()
        super.init()
        
        searchCompleter.delegate = self
        searchCompleter.resultTypes = .address
        
        // MARK: - Наблюдение на queryFragment
        cancellable = $queryFragment
            .debounce(for: .milliseconds(300), scheduler: RunLoop.main)
            .removeDuplicates()
            .sink { [weak self] newQuery in
                guard let self = self else { return }
                
                if newQuery.isEmpty {
                    // Ако потребителят изтрие текста
                    self.searchResults = []
                    self.selectedPlacemark = nil
                    self.searchError = nil
                } else {
                    // Задаваме query, за да вземем нови резултати
                    self.searchCompleter.queryFragment = newQuery
                    self.searchError = nil
                }
            }
    }
    
    // MARK: - MKLocalSearchCompleterDelegate
    func completerDidUpdateResults(_ completer: MKLocalSearchCompleter) {
        self.searchResults = completer.results
        self.searchError = nil
        // print("DEBUG: completerDidUpdateResults -> \(completer.results)")
    }
    
    func completer(_ completer: MKLocalSearchCompleter, didFailWithError error: Error) {
        self.searchError = error
        self.searchResults = []
    }
    
    // MARK: - Избор на конкретен резултат от търсачката
    /// Избиране на конкретен резултат (MKLocalSearchCompletion) – тук правим MKLocalSearch
    func selectCompletion(_ completion: MKLocalSearchCompletion) {
        
        let request = MKLocalSearch.Request(completion: completion)
        let search = MKLocalSearch(request: request)
        
        // Стартираме самото търсене, за да получим MKMapItem
        search.start { [weak self] (response, error) in
            guard let self = self else { return }
            
            if let error = error {
                self.searchError = error
                self.selectedPlacemark = nil
                print("DEBUG: MKLocalSearch error -> \(error.localizedDescription)")
                return
            }
            
            // Взимаме първия намерен резултат
            guard let mapItem = response?.mapItems.first else {
                self.searchError = NSError(
                    domain: "LocationSearch",
                    code: 1,
                    userInfo: [NSLocalizedDescriptionKey: "No details found for selection."]
                )
                self.selectedPlacemark = nil
                return
            }
            
            // Задаваме selectedPlacemark
            self.selectedPlacemark = mapItem.placemark
            
            // Печатаме информация за debug
            let coord = mapItem.placemark.coordinate
            
            // 1) Опитваме да вземем timeZone от MKPlacemark
            if let tz = mapItem.placemark.timeZone {
                self.weatherKitViewModel.setTimeZone(tz)
                
                // Викаме fetchWeather веднага
                self.weatherKitViewModel.fetchWeatherForCoords(
                    latitude: coord.latitude,
                    longitude: coord.longitude
                )
                
            } else {
                // 2) Ако placemark.timeZone е nil, правим reverse geocode
                
                let clLocation = CLLocation(latitude: coord.latitude, longitude: coord.longitude)
                CLGeocoder().reverseGeocodeLocation(clLocation) { [weak self] placemarks, error in
                    guard let self = self else { return }
                    if let err = error {
                        print("DEBUG: reverseGeocode error ->", err.localizedDescription)
                    }
                    
                    if let first = placemarks?.first {
                        if let tz = first.timeZone {
                            self.weatherKitViewModel.setTimeZone(tz)
                        } else {
                        }
                    }
                    
                    // Дори да нямаме timeZone, fetchWeatherForCoords пак да се извика
                    self.weatherKitViewModel.fetchWeatherForCoords(
                        latitude: coord.latitude,
                        longitude: coord.longitude
                    )
                }
            }
            
            // Нулираме търсачката
            self.queryFragment = ""
            self.searchResults = []
            self.searchError = nil
        }
    }
}
