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

    // WeatherKit view model (singleton)
    private let weatherKitViewModel = WeatherKitViewModel.shared

    // MARK: – Init
    override init() {
        self.searchCompleter = MKLocalSearchCompleter()
        super.init()

        searchCompleter.delegate = self
        searchCompleter.filterType            = .locationsOnly
        searchCompleter.resultTypes           = .address
        searchCompleter.pointOfInterestFilter = .excludingAll

        if #available(iOS 18.0, *) {
            // От iOS 18 нагоре можем да използваме вградената филтрация
            searchCompleter.addressFilter = MKAddressFilter(including: .locality)
            // все пак може да оставиш и ръчната, ако искаш еднакво поведение
        }

        // debounce, за да не стреляме излишни заявки
        cancellable = $queryFragment
            .debounce(for: .milliseconds(300), scheduler: RunLoop.main)
            .removeDuplicates()
            .sink { [weak self] text in
                guard let self = self else { return }
                if text.isEmpty {
                    self.searchResults     = []
                    self.selectedPlacemark = nil
                    self.searchError       = nil
                } else {
                    self.searchCompleter.queryFragment = text
                }
            }
    }

    // MARK: – MKLocalSearchCompleterDelegate
    func completerDidUpdateResults(_ completer: MKLocalSearchCompleter) {

        //-------------------------------------------------------------
        // Единна логика за всички версии – пазим само градове, чието
        // име (първата част на title преди запетая) започва с текста.
        //-------------------------------------------------------------
        let normalizedQuery = queryFragment
            .trimmingCharacters(in: .whitespacesAndNewlines)
            .folding(options: .diacriticInsensitive, locale: .current)
            .lowercased()

        guard !normalizedQuery.isEmpty else {
            self.searchResults = []
            self.searchError   = nil
            return
        }

        self.searchResults = completer.results.filter { item in
            // 1) махаме резултати, които съдържат цифри
            guard item.title.rangeOfCharacter(from: .decimalDigits) == nil,
                  item.subtitle.rangeOfCharacter(from: .decimalDigits) == nil else { return false }

            // 2) проверяваме префикса на първата част (града)
            let city = item.title.components(separatedBy: ",").first ?? item.title
            let normalizedCity = city
                .folding(options: .diacriticInsensitive, locale: .current)
                .lowercased()

            return normalizedCity.hasPrefix(normalizedQuery)
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

            // Spawn a new async context that is explicitly on the main actor
            Task { @MainActor [weak self] in
                guard let self = self else { return }

                if let error {            // -- error handling
                    self.searchError = error
                    self.selectedPlacemark = nil
                    return
                }

                guard let mapItem = response?.mapItems.first else {
                    self.searchError = NSError(
                        domain: "LocationSearch",
                        code: 1,
                        userInfo: [NSLocalizedDescriptionKey:
                                   "No details found for selection."])
                    return
                }

                self.selectedPlacemark = mapItem.placemark
                let coord             = mapItem.placemark.coordinate

                if let tz = mapItem.placemark.timeZone {
                    self.weatherKitViewModel.setTimeZone(tz)
                    self.weatherKitViewModel.fetchWeatherForCoords(
                        latitude: coord.latitude,
                        longitude: coord.longitude)
                } else {
                    let clLocation = CLLocation(latitude: coord.latitude,
                                                longitude: coord.longitude)

                    CLGeocoder().reverseGeocodeLocation(clLocation) { [weak self] placemarks, _ in
                        // again hop to MainActor inside THIS completion
                        Task { @MainActor [weak self] in
                            guard let self = self else { return }

                            if let tz = placemarks?.first?.timeZone {
                                self.weatherKitViewModel.setTimeZone(tz)
                            }
                            self.weatherKitViewModel.fetchWeatherForCoords(
                                latitude: coord.latitude,
                                longitude: coord.longitude)
                        }
                    }
                }

                // reset UI state
                self.queryFragment = ""
                self.searchResults = []
                self.searchError   = nil
            }
        }

    }
}
