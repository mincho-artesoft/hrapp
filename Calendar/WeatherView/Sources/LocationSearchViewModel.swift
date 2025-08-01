import Combine
@preconcurrency import MapKit
import CoreLocation

@MainActor
class LocationSearchViewModel: NSObject,
                               ObservableObject,
                               @preconcurrency MKLocalSearchCompleterDelegate {

    // MARK: – Public @Published Properties
    @Published var queryFragment: String = ""
    @Published var searchResults: [MKLocalSearchCompletion] = []
    @Published var selectedPlacemark: MKPlacemark? = nil
    @Published var searchError: Error? = nil

    // MARK: – Private Properties
    private let searchCompleter: MKLocalSearchCompleter
    private var cancellable: AnyCancellable?

    // A singleton instance for your weather view model
    private let weatherKitViewModel = WeatherKitViewModel.shared

    // MARK: – Initializer
    override init() {
        self.searchCompleter = MKLocalSearchCompleter()
        super.init()

        searchCompleter.delegate = self
        searchCompleter.filterType = .locationsOnly
        searchCompleter.resultTypes = .address
        searchCompleter.region = MKCoordinateRegion(.world)

        if #available(iOS 18.0, *) {
            searchCompleter.addressFilter = MKAddressFilter(including: .locality)
        }
        
        cancellable = $queryFragment
            .debounce(for: .milliseconds(300), scheduler: RunLoop.main)
            .removeDuplicates()
            .sink { [weak self] text in
                guard let self = self else { return }
                if text.isEmpty {
                    self.searchResults = []
                    self.selectedPlacemark = nil
                    self.searchError = nil
                } else {
                    self.searchCompleter.queryFragment = text
                }
            }
    }

    // MARK: – MKLocalSearchCompleterDelegate Methods
    
    func completerDidUpdateResults(_ completer: MKLocalSearchCompleter) {
        // Filter out results that are likely specific street addresses
        self.searchResults = completer.results.filter {
            $0.title.rangeOfCharacter(from: .decimalDigits) == nil &&
            $0.subtitle.rangeOfCharacter(from: .decimalDigits) == nil
        }
        self.searchError = nil
    }

    func completer(_ completer: MKLocalSearchCompleter, didFailWithError error: Error) {
        self.searchError = error
        self.searchResults = []
    }

    // MARK: – Selection Logic
    
    /// Fetches detailed placemark information for a selected search completion.
    func selectCompletion(_ completion: MKLocalSearchCompletion) async {
        do {
            let request = MKLocalSearch.Request(completion: completion)
            // Use our new, safe async wrapper method from the extension below
            let response = try await MKLocalSearch(request: request).start()
            
            guard let mapItem = response.mapItems.first else {
                throw LocationError.noDetailsFound
            }

            self.selectedPlacemark = mapItem.placemark
            let coordinate = mapItem.placemark.coordinate
            
            // Attempt to get the time zone directly from the placemark.
            // If it's not available, fall back to reverse geocoding.
            let timeZone = try await findTimeZone(for: mapItem.placemark)
            weatherKitViewModel.setTimeZone(timeZone)
            
            // Fetch weather for the selected location.
            weatherKitViewModel.fetchWeatherForCoords(
                latitude: coordinate.latitude,
                longitude: coordinate.longitude
            )

            // Reset UI state after selection
            self.queryFragment = ""
            self.searchResults = []
            self.searchError = nil

        } catch {
            // Handle all errors from search, geocoding, etc.
            self.searchError = error
            self.selectedPlacemark = nil
        }
    }
    
    /// Helper to find TimeZone, preferring the placemark's value but falling back to geocoding.
    private func findTimeZone(for placemark: MKPlacemark) async throws -> TimeZone {
        if let timeZone = placemark.timeZone {
            return timeZone
        }
        
        // Fallback: Reverse geocode to find timezone if not in the original placemark
        let location = CLLocation(latitude: placemark.coordinate.latitude, longitude: placemark.coordinate.longitude)
        guard let placemarks = try? await CLGeocoder().reverseGeocodeLocation(location),
              let timeZone = placemarks.first?.timeZone else {
            throw LocationError.timeZoneNotFound
        }
        return timeZone
    }
}

// MARK: - Custom Errors for Clarity
enum LocationError: Error, LocalizedError {
    case noDetailsFound
    case timeZoneNotFound
    
    var errorDescription: String? {
        switch self {
        case .noDetailsFound:
            return "No details found for the selected location."
        case .timeZoneNotFound:
            return "Could not determine the time zone for the selected location."
        }
    }
}


// MARK: - Concurrency-Safe MKLocalSearch Extension
// This extension bridges the old completion handler API to a modern async/await API,
// resolving the `Non-sendable` type issue.
extension MKLocalSearch {
    func start() async throws -> MKLocalSearch.Response {
        try await withCheckedThrowingContinuation { continuation in
            // Use the completion handler version of start()
            start { response, error in
                if let error = error {
                    continuation.resume(throwing: error)
                } else if let response = response {
                    continuation.resume(returning: response)
                } else {
                    // This case should not happen, but we handle it for safety
                    continuation.resume(throwing: LocationError.noDetailsFound)
                }
            }
        }
    }
}
