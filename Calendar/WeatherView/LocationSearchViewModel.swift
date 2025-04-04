import Combine
import MapKit

@MainActor
class LocationSearchViewModel: NSObject, ObservableObject, @preconcurrency MKLocalSearchCompleterDelegate {
    @Published var queryFragment: String = ""
    @Published var searchResults: [MKLocalSearchCompletion] = []
    @Published var selectedPlacemark: MKPlacemark? = nil
    @Published var searchError: Error? = nil

    private var searchCompleter: MKLocalSearchCompleter
    private var cancellable: AnyCancellable?
    
    override init() {
        self.searchCompleter = MKLocalSearchCompleter()
        super.init()
        
        searchCompleter.delegate = self
        searchCompleter.resultTypes = .address
        
        cancellable = $queryFragment
            .debounce(for: .milliseconds(300), scheduler: RunLoop.main)
            .removeDuplicates()
            .sink { [weak self] newQuery in
                guard let self = self else { return }
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
    
    func completerDidUpdateResults(_ completer: MKLocalSearchCompleter) {
        self.searchResults = completer.results
        self.searchError = nil
    }
    
    func completer(_ completer: MKLocalSearchCompleter, didFailWithError error: Error) {
        self.searchError = error
        self.searchResults = []
    }
    
    func selectCompletion(_ completion: MKLocalSearchCompletion) {
        let request = MKLocalSearch.Request(completion: completion)
        let search = MKLocalSearch(request: request)
        
        search.start { [weak self] (response, error) in
            guard let self = self else { return }
            if let error = error {
                self.searchError = error
                self.selectedPlacemark = nil
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
            self.queryFragment = ""
            self.searchResults = []
            self.searchError = nil
        }
    }
}
