import SwiftUI
import Combine
import CoreLocation
import MapKit
@preconcurrency import WeatherKit

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

struct WeatherKitView: View {
    
    // MARK: - State Objects
    @StateObject private var locationManager = LocationManager()
    @StateObject private var vm = WeatherKitViewModel()
    @StateObject private var locationSearchVM = LocationSearchViewModel()
    
    // MARK: - UI State
    @State private var showSearchBar = false
    @State private var isEditing = false  // controls when suggestions list appears
    @State private var geocodedCityName = ""
    @State private var selectedDay: DayForecastItem? = nil
    
    // We'll measure the height of the top bar to position our list
    @State private var topBarHeight: CGFloat = 0
    
    var body: some View {
        ZStack(alignment: .top) {
            // 1) Background gradient
            LinearGradient(
                gradient: Gradient(colors: [
                    Color.blue.opacity(0.5),
                    Color.gray.opacity(0.4)
                ]),
                startPoint: .top,
                endPoint: .bottom
            )
            .edgesIgnoringSafeArea(.all)
            
            // 2) The main scrollable weather content, behind everything
            ScrollView(.vertical, showsIndicators: false) {
                VStack(spacing: 20) {
                    // Add empty space so your scroll content starts below the top bar
                    Spacer().frame(height: topBarHeight)
                    
                    // --- Weather main info ---
                    VStack(spacing: 8) {
                        Text(displayedCityName())
                            .font(.system(size: 36, weight: .bold))
                            .foregroundColor(.white)
                        
                        // Current Temp + Symbol
                        HStack(spacing: 8) {
                            Image(systemName: vm.currentSymbol)
                                .symbolVariant(.fill)
                                .symbolRenderingMode(.multicolor)
                                .font(.system(size: 52))
                            
                            if let temp = vm.currentTemp {
                                Text("\(Int(temp.rounded()))°")
                                    .font(.system(size: 80, weight: .thin))
                                    .foregroundColor(.white)
                            } else {
                                Text("—°")
                                    .font(.system(size: 80, weight: .thin))
                                    .foregroundColor(.white)
                            }
                        }
                        
                        Text(vm.currentCondition)
                            .foregroundColor(.white)
                            .font(.headline)
                        
                        if let hi = vm.todayMaxTemp, let lo = vm.todayMinTemp {
                            Text("H:\(Int(hi))°   L:\(Int(lo))°")
                                .foregroundColor(.white.opacity(0.9))
                                .font(.subheadline)
                        }
                    }
                    .padding(.top, 40)
                    
                    // Hourly Forecast
                    hourlyForecastCard
                    
                    // 10-Day Forecast
                    tenDayForecastCard
                    
                    // Today Details
                    TodayDetailsCardView(vm: vm)
                    
                    if let error = vm.errorMessage {
                        Text(error)
                            .foregroundColor(.red)
                            .multilineTextAlignment(.center)
                            .padding()
                    }
                    
                    Spacer().frame(height: 40)
                }
                .padding(.horizontal, 16)
            }
            
            // 3) Top bar overlay (measured so we know how tall it is)
            VStack(spacing: 0) {
                topBar
                    .background(
                        // Measure the top bar height so we can offset the list below it
                        GeometryReader { geo in
                            Color.clear
                                .onAppear {
                                    topBarHeight = geo.size.height
                                }
                        }
                    )
                
                // 4) The suggestions list (overlay), right below the top bar
                if showSearchBar && isEditing && !locationSearchVM.searchResults.isEmpty {
                    List(locationSearchVM.searchResults, id: \.self) { completion in
                        Button {
                            // When tapped, pick that completion
                            locationSearchVM.selectCompletion(completion)
                            // Hide the list
                            isEditing = false
                        } label: {
                            VStack(alignment: .leading) {
                                Text(completion.title)
                                    .foregroundColor(.primary)
                                if !completion.subtitle.isEmpty {
                                    Text(completion.subtitle)
                                        .font(.subheadline)
                                        .foregroundColor(.secondary)
                                }
                            }
                        }
                        .listRowBackground(Color.white.opacity(0.8))
                    }
                    .listStyle(.plain)
                    .frame(maxHeight: 300) // limit how tall the list can grow
                    .transition(.move(edge: .top))
                }
            }
            .zIndex(1) // ensure this stack is on top of the scroll content
        }
        // ---------- SHEETS AND ON-APPEAR -----------
        .sheet(item: $selectedDay) { day in
            DayDetailSheetView(day: day)
        }
        .onReceive(locationSearchVM.$selectedPlacemark) { placemark in
            guard let placemark = placemark else { return }
            let coords = placemark.coordinate
            vm.fetchWeatherForCoords(latitude: coords.latitude, longitude: coords.longitude)
            
            // Display city name from placemark
            let city = placemark.locality
                ?? placemark.administrativeArea
                ?? (placemark.name ?? "Location")
            self.geocodedCityName = city
        }
        .onAppear {
            if let loc = locationManager.currentLocation {
                vm.fetchWeatherForCoords(latitude: loc.coordinate.latitude,
                                         longitude: loc.coordinate.longitude)
            }
        }
        .onChange(of: locationManager.currentLocation) { newLoc in
            // If user hasn't typed a custom search, auto-update weather
            if let loc = newLoc, locationSearchVM.queryFragment.isEmpty {
                vm.fetchWeatherForCoords(latitude: loc.coordinate.latitude,
                                         longitude: loc.coordinate.longitude)
            }
        }
    }
}

// MARK: - TOP BAR
extension WeatherKitView {
    private var topBar: some View {
        HStack {
            if showSearchBar {
                HStack(spacing: 8) {
                    TextField("Search city...", text: $locationSearchVM.queryFragment,
                              onEditingChanged: { editing in
                                isEditing = editing
                              })
                    .foregroundColor(.primary)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .frame(minWidth: 150)
                    .disableAutocorrection(true)
                    .textInputAutocapitalization(.never)
                    
                    Button {
                        // Force refresh suggestions if needed
                        isEditing = true
                    } label: {
                        Image(systemName: "magnifyingglass")
                            .foregroundColor(.white)
                    }
                    
                    // Close search
                    Button {
                        withAnimation {
                            showSearchBar = false
                            locationSearchVM.queryFragment = ""
                            isEditing = false
                        }
                        // Return to the user’s location-based weather
                        if let loc = locationManager.currentLocation {
                            vm.fetchWeatherForCoords(
                                latitude: loc.coordinate.latitude,
                                longitude: loc.coordinate.longitude
                            )
                            geocodedCityName = ""
                        }
                    } label: {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundColor(.white)
                    }
                }
            } else {
                // Magnifying glass to open search
                Button {
                    withAnimation {
                        showSearchBar = true
                    }
                } label: {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(.white)
                }
            }
            
            Spacer()
            
            // Refresh button
            Button {
                withAnimation {
                    showSearchBar = false
                    locationSearchVM.queryFragment = ""
                    isEditing = false
                }
                // Return to the user’s location-based weather
                if let loc = locationManager.currentLocation {
                    vm.fetchWeatherForCoords(
                        latitude: loc.coordinate.latitude,
                        longitude: loc.coordinate.longitude
                    )
                    geocodedCityName = ""
                }
            } label: {
                Image(systemName: "arrow.clockwise")
                    .foregroundColor(.white)
            }
        }
        .font(.title2)
        .padding()
    }
    
    private func displayedCityName() -> String {
        if !geocodedCityName.isEmpty {
            return geocodedCityName
        }
        return locationManager.currentCityName ?? "Loading..."
    }
}

// MARK: - HOURLY FORECAST
extension WeatherKitView {
    private var hourlyForecastCard: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.white.opacity(0.2))
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 24) {
                    ForEach(vm.hourlyForecast.indices, id: \.self) { i in
                        let hourItem = vm.hourlyForecast[i]
                        VStack(spacing: 8) {
                            Text(hourItem.hour)
                                .font(.footnote)
                                .foregroundColor(.white)
                            Image(systemName: hourItem.symbol)
                                .symbolVariant(.fill)
                                .symbolRenderingMode(.multicolor)
                                .font(.title2)
                            Text("\(Int(hourItem.temp.rounded()))°")
                                .font(.headline)
                                .foregroundColor(.white)
                        }
                        .frame(minWidth: 50)
                    }
                }
                .padding()
            }
        }
        .frame(height: 130)
    }
}

// MARK: - TEN DAY FORECAST
extension WeatherKitView {
    private var tenDayForecastCard: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.white.opacity(0.2))
            
            VStack(spacing: 0) {
                Text("10-Day Forecast")
                    .font(.subheadline)
                    .foregroundColor(.white)
                    .padding(.vertical, 8)
                
                Divider().opacity(0.3)
                
                let globalMin = vm.dailyForecast.map(\.minTemp).min() ?? 0
                let globalMax = vm.dailyForecast.map(\.maxTemp).max() ?? 0
                
                ForEach(vm.dailyForecast) { dayItem in
                    HStack {
                        Text(dayItem.day)
                            .foregroundColor(.white)
                            .font(.body)
                            .frame(width: 60, alignment: .leading)
                        
                        Image(systemName: dayItem.symbol)
                            .symbolVariant(.fill)
                            .symbolRenderingMode(.multicolor)
                            .font(.headline)
                        
                        if let chance = dayItem.precipChance {
                            VStack(spacing: 2) {
                                ProgressView(value: chance)
                                    .progressViewStyle(.linear)
                                    .frame(width: 60)
                                let percent = Int(chance * 100)
                                Text("\(percent)%")
                                    .foregroundColor(.white)
                                    .font(.footnote)
                            }
                            .padding(.leading, 6)
                        }
                        
                        Spacer()
                        
                        Text("\(Int(dayItem.minTemp.rounded()))°")
                            .foregroundColor(.white)
                        
                        TemperatureRangeView(
                            day: dayItem,
                            globalMin: globalMin,
                            globalMax: globalMax
                        )
                        .frame(width: 70, height: 8)
                        .padding(.horizontal, 4)
                        
                        Text("\(Int(dayItem.maxTemp.rounded()))°")
                            .foregroundColor(.white)
                    }
                    .padding(.vertical, 10)
                    .padding(.horizontal, 16)
                    .onTapGesture {
                        selectedDay = dayItem
                    }
                    
                    if dayItem != vm.dailyForecast.last {
                        Divider()
                            .overlay(Color.white.opacity(0.3))
                            .padding(.horizontal, 16)
                    }
                }
            }
        }
    }
}

// MARK: - RANGE VIEW
struct TemperatureRangeView: View {
    let day: DayForecastItem
    let globalMin: Double
    let globalMax: Double
    
    var body: some View {
        GeometryReader { geo in
            let totalWidth = geo.size.width
            let range = globalMax - globalMin
            
            if range == 0 {
                Rectangle()
                    .fill(Color.blue)
                    .frame(width: totalWidth, height: 4)
            } else {
                let dayMinOffset = day.minTemp - globalMin
                let dayRange = day.maxTemp - day.minTemp
                let barX = (dayMinOffset / range) * totalWidth
                let barWidth = (dayRange / range) * totalWidth
                
                ZStack(alignment: .leading) {
                    Rectangle()
                        .fill(Color.white.opacity(0.3))
                        .frame(width: totalWidth, height: 4)
                    Rectangle()
                        .fill(
                            LinearGradient(
                                gradient: Gradient(colors: [.blue, .red]),
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .frame(width: totalWidth, height: 4)
                        .mask(
                            Rectangle()
                                .offset(x: barX)
                                .frame(width: barWidth, height: 4)
                        )
                }
            }
        }
    }
}

// MARK: - TODAY DETAILS
struct TodayDetailsCardView: View {
    @ObservedObject var vm: WeatherKitViewModel
    
    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.white.opacity(0.2))
            
            VStack(alignment: .leading, spacing: 12) {
                Text("More Details")
                    .font(.subheadline)
                    .foregroundColor(.white)
                    .padding(.top, 8)
                
                Divider().opacity(0.3)
                
                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())],
                          alignment: .leading,
                          spacing: 16) {
                    if let feels = vm.currentFeelsLike {
                        detailCell(icon: "thermometer.sun.fill",
                                   title: "Feels Like",
                                   value: "\(Int(feels.rounded()))°")
                    }
                    if let wind = vm.currentWindSpeed {
                        let windKmh = wind * 3.6
                        detailCell(icon: "wind",
                                   title: "Wind",
                                   value: String(format: "%.0f km/h", windKmh))
                    }
                    if let hum = vm.currentHumidity {
                        detailCell(icon: "humidity.fill",
                                   title: "Humidity",
                                   value: "\(Int(hum * 100))%")
                    }
                    if let vis = vm.currentVisibility {
                        let visKm = vis / 1000
                        detailCell(icon: "eye.fill",
                                   title: "Visibility",
                                   value: String(format: "%.1f km", visKm))
                    }
                    if let uv = vm.currentUVIndex {
                        detailCell(icon: "sun.max.fill",
                                   title: "UV Index",
                                   value: "\(uv)")
                    }
                    if let press = vm.currentPressure {
                        detailCell(icon: "barometer",
                                   title: "Pressure",
                                   value: "\(Int(press)) hPa")
                    }
                }
                .padding(.bottom, 12)
            }
            .padding(.horizontal, 16)
            .padding(.top, 8)
            .padding(.bottom, 8)
        }
    }
    
    @ViewBuilder
    private func detailCell(icon: String, title: String, value: String) -> some View {
        HStack(alignment: .center, spacing: 8) {
            Image(systemName: icon)
                .symbolRenderingMode(.multicolor)
                .symbolVariant(.fill)
                .font(.title3)
                .frame(width: 28, height: 28)
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .foregroundColor(.white.opacity(0.8))
                    .font(.caption)
                Text(value)
                    .foregroundColor(.white)
                    .font(.body).bold()
            }
        }
    }
}

// MARK: - DAY DETAIL SHEET
struct DayDetailSheetView: View {
    let day: DayForecastItem
    
    var body: some View {
        VStack(spacing: 16) {
            Text(day.day)
                .font(.largeTitle)
                .padding(.top, 20)
            
            Image(systemName: day.symbol)
                .symbolVariant(.fill)
                .symbolRenderingMode(.multicolor)
                .font(.system(size: 64))
            
            Text("Min: \(Int(day.minTemp))°")
                .font(.title2)
            Text("Max: \(Int(day.maxTemp))°")
                .font(.title2)
            
            if let precip = day.precipChance {
                Text("Precip Chance: \(Int(precip * 100))%")
                    .font(.headline)
            }
            
            Spacer()
        }
        .padding()
        .presentationDetents([.medium, .large])
    }
}
