import Combine
import MapKit
import SwiftUI // За @MainActor

@MainActor
class LocationSearchViewModel: NSObject, ObservableObject, @preconcurrency MKLocalSearchCompleterDelegate {

    @Published var queryFragment: String = ""
    @Published var searchResults: [MKLocalSearchCompletion] = []
    @Published var selectedPlacemark: MKPlacemark? = nil
    @Published var searchError: String? = nil

    private var searchCompleter: MKLocalSearchCompleter
    private var cancellables = Set<AnyCancellable>()

    // Добавете референция към споделения WeatherKitViewModel
    private let weatherKitViewModel = WeatherKitViewModel.shared

    override init() {
        self.searchCompleter = MKLocalSearchCompleter()
        super.init()

        self.searchCompleter.delegate = self
        self.searchCompleter.resultTypes = .address
        self.searchCompleter.filterType = .locationsOnly

        $queryFragment
            .debounce(for: .milliseconds(300), scheduler: RunLoop.main)
            .removeDuplicates()
            .sink { [weak self] currentQuery in
                guard let self = self else { return }
                if currentQuery.isEmpty {
                    self.searchResults = []
                    self.searchError = nil
                } else {
                    self.searchCompleter.queryFragment = currentQuery
                }
            }
            .store(in: &cancellables)
    }

    func completerDidUpdateResults(_ completer: MKLocalSearchCompleter) {
        self.searchResults = completer.results
        self.searchError = nil
    }

    func completer(_ completer: MKLocalSearchCompleter, didFailWithError error: Error) {
        self.searchResults = []
        self.searchError = "Location search failed: \(error.localizedDescription)"
        print("MKLocalSearchCompleter failed with error: \(error.localizedDescription)")
    }

    func selectCompletion(_ completion: MKLocalSearchCompletion) {
        self.searchError = nil
        let request = MKLocalSearch.Request(completion: completion)
        let search = MKLocalSearch(request: request)
        let capturedCompletionTitle = completion.title

        search.start { [weak self] (response, error) in
            Task { @MainActor in // Преминаваме към MainActor
                guard let self = self else { return }

                if let error = error {
                    self.selectedPlacemark = nil
                    self.searchError = "Failed to get location details: \(error.localizedDescription)"
                    print("MKLocalSearch failed for completion '\(capturedCompletionTitle)': \(error.localizedDescription)")
                    return
                }

                guard let placemark = response?.mapItems.first?.placemark else {
                    self.selectedPlacemark = nil
                    self.searchError = "No placemark details found for the selected location."
                    print("No placemark found for completion '\(capturedCompletionTitle)'")
                    return
                }
                
                self.selectedPlacemark = placemark // Това ще задейства .onReceive в WeatherKitView

                // ---- НОВО ----
                // Задайте часовата зона в WeatherKitViewModel
                // MKPlacemark.timeZone е NSTimeZone?, което е TimeZone? в Swift.
                self.weatherKitViewModel.setTimeZone(placemark.timeZone!)

            }
        }
    }
}
