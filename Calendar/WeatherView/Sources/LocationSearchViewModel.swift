//
//  LocationSearchViewModel.swift
//  YourApp
//
//  Created by You on 12 May 2025.
//

import Combine
import MapKit
import CoreLocation

@MainActor
class LocationSearchViewModel: NSObject,
                               ObservableObject,
                               @preconcurrency MKLocalSearchCompleterDelegate {

    // MARK: - Published state

    @Published var queryFragment: String = ""
    @Published var searchResults: [MKLocalSearchCompletion] = []
    @Published var selectedPlacemark: MKPlacemark? = nil
    @Published var searchError: Error? = nil

    // MARK: - Private properties

    private let searchCompleter: MKLocalSearchCompleter
    private var cancellable: AnyCancellable?

    /// Регекс, който намира цифри ИЛИ често срещани думи / съкращения за „улица“.
    /// Ако има съвпадение → това е уличен адрес, а не град → филтрираме го.
    private static let streetRegex = try! NSRegularExpression(
        pattern: #"(\d)|\b(ul\.?|улица|str\.?|street|road|rd\.?|ave\.?|avenue|бул\.?|boulevard|blvd)\b"#,
        options: [.caseInsensitive]
    )

    /// Подаваме WeatherKitViewModel като singleton
    let weatherKitViewModel = WeatherKitViewModel.shared

    // MARK: - Init

    override init() {
        self.searchCompleter = MKLocalSearchCompleter()
        super.init()
        
        // Настройка на completer-а
        searchCompleter.delegate = self
        searchCompleter.resultTypes = [.address]
        if #available(iOS 15.0, *) {
            searchCompleter.pointOfInterestFilter = .excludingAll
        }
        
        // Наблюдаваме текста и филтрираме дубликатите "умно"
        cancellable = $queryFragment
            .debounce(for: .milliseconds(300), scheduler: RunLoop.main)
            .removeDuplicates { [weak self] old, new in
                // Ако списъкът ни е празен → позволи същия текст да мине
                guard let self else { return old == new }
                return old == new && !self.searchResults.isEmpty
            }
            .sink { [weak self] newQuery in
                guard let self else { return }
                
                if newQuery.isEmpty {
                    self.searchResults = []
                    self.selectedPlacemark = nil
                    self.searchError = nil
                } else {
                    self.searchCompleter.queryFragment = newQuery
                    self.searchError = nil
                }
            }
    }


    // MARK: - MKLocalSearchCompleterDelegate

    func completerDidUpdateResults(_ completer: MKLocalSearchCompleter) {
        // Пазим само резултатите, които **не** приличат на уличен адрес
        searchResults = completer.results.filter { completion in
            let range = NSRange(location: 0, length: completion.title.utf16.count)
            return Self.streetRegex.firstMatch(in: completion.title,
                                               options: [],
                                               range: range) == nil
        }
        searchError = nil
    }

    func completer(_ completer: MKLocalSearchCompleter, didFailWithError error: Error) {
        searchError = error
        searchResults = []
    }

    // MARK: - Selection

    /// Извиква се, когато потребителят избере конкретен `MKLocalSearchCompletion`.
    func selectCompletion(_ completion: MKLocalSearchCompletion) {
        let request = MKLocalSearch.Request(completion: completion)
        MKLocalSearch(request: request).start { [weak self] response, error in
            guard let self else { return }

            if let error {
                self.searchError = error
                self.selectedPlacemark = nil
                print("MKLocalSearch error →", error.localizedDescription)
                return
            }

            guard let mapItem = response?.mapItems.first else {
                self.searchError = NSError(
                    domain: "LocationSearch",
                    code: 1,
                    userInfo: [NSLocalizedDescriptionKey: "No details found for selection."]
                )
                self.selectedPlacemark = nil
                return
            }

            self.selectedPlacemark = mapItem.placemark
            let coord = mapItem.placemark.coordinate

            // 1) Първо опитваме директно от MKPlacemark
            if let tz = mapItem.placemark.timeZone {
                self.weatherKitViewModel.setTimeZone(tz)
                self.weatherKitViewModel.fetchWeatherForCoords(latitude: coord.latitude,
                                                               longitude: coord.longitude)
            } else {
                // 2) Ако няма timeZone → reverse geocode
                let clLocation = CLLocation(latitude: coord.latitude, longitude: coord.longitude)
                CLGeocoder().reverseGeocodeLocation(clLocation) { [weak self] placemarks, _ in
                    guard let self else { return }
                    if let tz = placemarks?.first?.timeZone {
                        self.weatherKitViewModel.setTimeZone(tz)
                    }
                    self.weatherKitViewModel.fetchWeatherForCoords(latitude: coord.latitude,
                                                                   longitude: coord.longitude)
                }
            }

            // Нулираме търсачката
            self.queryFragment = ""
            self.searchResults = []
            self.searchError = nil
        }
    }
}
