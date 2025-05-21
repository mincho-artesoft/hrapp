//
//  LocationSearchViewModel.swift
//  Weather-Calendar
//

import Combine
import MapKit
import CoreLocation

@MainActor
class LocationSearchViewModel: NSObject,
                               ObservableObject,
                               @preconcurrency MKLocalSearchCompleterDelegate {

    // MARK: – Public @Published
    @Published var queryFragment: String = ""
    @Published var searchResults: [MKLocalSearchCompletion] = []
    @Published var selectedPlacemark: MKPlacemark? = nil
    @Published var searchError: Error? = nil

    // MARK: – Private
    private let searchCompleter: MKLocalSearchCompleter
    private var cancellable: AnyCancellable?

    // Инжектиран WeatherKit модел (singleton)
    private let weatherKitViewModel = WeatherKitViewModel.shared

    // MARK: – Init
    override init() {
        self.searchCompleter = MKLocalSearchCompleter()
        super.init()

        searchCompleter.delegate = self
        searchCompleter.filterType            = .locationsOnly   // маха “Query” предложения
        searchCompleter.resultTypes           = .address         // само адреси
        searchCompleter.pointOfInterestFilter = .excludingAll    // без POI

        if #available(iOS 17.0, *) {
            // ➜ показва само населени места (градове / села)
            searchCompleter.addressFilter = MKAddressFilter(including: .locality)
        }

        // Debounce + removeDuplicates за по-икономично търсене
        cancellable = $queryFragment
            .debounce(for: .milliseconds(300), scheduler: RunLoop.main)
            .removeDuplicates()
            .sink { [weak self] newQuery in
                guard let self = self else { return }

                if newQuery.isEmpty {
                    self.searchResults     = []
                    self.selectedPlacemark = nil
                    self.searchError       = nil
                } else {
                    self.searchCompleter.queryFragment = newQuery
                }
            }
    }

    // MARK: – MKLocalSearchCompleterDelegate
    func completerDidUpdateResults(_ completer: MKLocalSearchCompleter) {
        // ➤ На iOS 17+ системният филтър вече връща само градове
        if #available(iOS 17.0, *) {
            self.searchResults = completer.results
            self.searchError   = nil
            return
        }

        // ➤ Ръчно филтриране (iOS 16 и по-стари)
        let query = queryFragment
            .trimmingCharacters(in: .whitespacesAndNewlines)
            .folding(options: .diacriticInsensitive, locale: .current)
            .lowercased()

        self.searchResults = completer.results.filter { item in
            // 1) Премахваме адреси/улици, които съдържат цифри
            guard item.title.rangeOfCharacter(from: .decimalDigits) == nil,
                  item.subtitle.rangeOfCharacter(from: .decimalDigits) == nil else { return false }

            // 2) Градът (частта преди запетаята) трябва да започва с въведения текст
            let city = item.title.components(separatedBy: ",").first!
            let normalizedCity = city
                .folding(options: .diacriticInsensitive, locale: .current)
                .lowercased()

            return normalizedCity.hasPrefix(query)
            // ⚠️ НЕ елиминираме дубликати → всички “Sofia, …” остават
        }

        self.searchError = nil
    }

    func completer(_ completer: MKLocalSearchCompleter,
                   didFailWithError error: Error) {
        self.searchError   = error
        self.searchResults = []
    }

    // MARK: – Selecting a completion
    func selectCompletion(_ completion: MKLocalSearchCompletion) {
        let request = MKLocalSearch.Request(completion: completion)
        MKLocalSearch(request: request).start { [weak self] response, error in
            guard let self = self else { return }

            if let error = error {
                self.searchError       = error
                self.selectedPlacemark = nil
                return
            }

            guard let mapItem = response?.mapItems.first else {
                self.searchError = NSError(domain: "LocationSearch",
                                           code: 1,
                                           userInfo: [NSLocalizedDescriptionKey:
                                                      "No details found for selection."])
                return
            }

            // Запомняме избрания placemark
            self.selectedPlacemark = mapItem.placemark
            let coord = mapItem.placemark.coordinate

            //---------------------------------------------------------
            // 1) Опитваме директно timeZone от MKPlacemark -- най-точно
            //---------------------------------------------------------
            if let tz = mapItem.placemark.timeZone {
                self.weatherKitViewModel.setTimeZone(tz)
                self.weatherKitViewModel.fetchWeatherForCoords(
                    latitude: coord.latitude,
                    longitude: coord.longitude
                )

            //---------------------------------------------------------
            // 2) При липса на tz → reverse geocode за timeZone
            //---------------------------------------------------------
            } else {
                let clLocation = CLLocation(latitude: coord.latitude,
                                            longitude: coord.longitude)
                CLGeocoder().reverseGeocodeLocation(clLocation) { [weak self] placemarks, _ in
                    guard let self = self else { return }

                    if let tz = placemarks?.first?.timeZone {
                        self.weatherKitViewModel.setTimeZone(tz)
                    }
                    self.weatherKitViewModel.fetchWeatherForCoords(
                        latitude: coord.latitude,
                        longitude: coord.longitude
                    )
                }
            }

            // Нулираме UI състоянието
            self.queryFragment  = ""
            self.searchResults  = []
            self.searchError    = nil
        }
    }
}
