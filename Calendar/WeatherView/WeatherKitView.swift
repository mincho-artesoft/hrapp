import SwiftUI
import CoreLocation
import MapKit

// MARK: - SEARCH DELEGATE
class SearchCompleterHandler: NSObject, MKLocalSearchCompleterDelegate {
    var onResults: ([MKLocalSearchCompletion]) -> Void = { _ in }
    
    func completerDidUpdateResults(_ completer: MKLocalSearchCompleter) {
        onResults(completer.results)
    }
    
    func completer(_ completer: MKLocalSearchCompleter, didFailWithError error: Error) {
        print("Completer error: \(error.localizedDescription)")
        onResults([])
    }
}

// MARK: - MAIN VIEW
struct WeatherKitView: View {
    
    // 1) Location + Weather
    @StateObject private var locationManager = LocationManager()
    @StateObject private var vm = WeatherKitViewModel()
    
    // 2) Search
    @State private var showSearchBar = false
    @State private var searchText = ""
    @State private var isEditing = false
    @State private var suggestions: [MKLocalSearchCompletion] = []
    
    // 3) Запаметяваме "актуален град", намерен чрез геокодиране
    @State private var geocodedCityName = ""
    
    private let searchCompleter = MKLocalSearchCompleter()
    private let searchHandler = SearchCompleterHandler()
    
    var body: some View {
        ZStack {
            // --- Background Gradient ---
            LinearGradient(
                gradient: Gradient(colors: [
                    Color.blue.opacity(0.5),
                    Color.gray.opacity(0.4)
                ]),
                startPoint: .top,
                endPoint: .bottom
            )
            .edgesIgnoringSafeArea(.all)
            
            ScrollView(.vertical, showsIndicators: false) {
                VStack(spacing: 20) {
                    
                    // --- Top bar (Search + Reload)
                    topBar
                    
                    // --- Suggestions list
                    if showSearchBar && !suggestions.isEmpty && isEditing {
                        suggestionsList
                    }
                    
                    // --- Weather main info ---
                    VStack(spacing: 8) {
                        Text(displayedCityName())
                            .font(.system(size: 36, weight: .bold))
                            .foregroundColor(.white)
                        
                        // Температура + символ
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
                    
                    // --- Hourly Forecast
                    hourlyForecastCard
                    
                    // --- 10-Day Forecast
                    tenDayForecastCard
                    
                    // --- Today Details
                    TodayDetailsCardView(vm: vm)
                    
                    // --- Error message (if any)
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
        }
        .onAppear {
            // Ако вече имаме coords -> зареждаме
            if let loc = locationManager.currentLocation {
                vm.fetchWeatherForCoords(latitude: loc.coordinate.latitude,
                                         longitude: loc.coordinate.longitude)
                // В този случай geocodedCityName остава "",
                // и displayedCityName() ще показва
                // или `locationManager.currentCityName`
                // или "Loading..."
            }
            // Настройваме searchCompleter delegate
            searchHandler.onResults = { comps in
                self.suggestions = comps
            }
            searchCompleter.delegate = searchHandler
        }
        .onChange(of: locationManager.currentLocation) { newLoc in
            // Update weather if search is empty
            if let loc = newLoc, searchText.isEmpty {
                vm.fetchWeatherForCoords(latitude: loc.coordinate.latitude,
                                         longitude: loc.coordinate.longitude)
            }
        }
    }
}

// MARK: - TOP BAR (Search + Refresh)
extension WeatherKitView {
    private var topBar: some View {
        HStack {
            if showSearchBar {
                // Search TextField
                HStack(spacing: 8) {
                    // НЯМА onCommit: doSearchCity()
                    TextField("Search city...", text: $searchText, onEditingChanged: { edit in
                        isEditing = edit
                    })
                    .foregroundColor(.primary)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .frame(minWidth: 150)
                    // само за предложения:
                    .onChange(of: searchText) { newValue in
                        updateSearchSuggestions(for: newValue)
                    }
                    
                    // Search бутон - извиква doSearchCity()
                    Button {
                        doSearchCity()
                    } label: {
                        Image(systemName: "magnifyingglass")
                            .foregroundColor(.white)
                    }
                    
                    // Close search button
                    Button {
                        withAnimation {
                            showSearchBar = false
                            searchText = ""
                            suggestions = []
                            isEditing = false
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
                // Ако няма searchText, презареждаме текущата локация
                if let loc = locationManager.currentLocation, searchText.isEmpty {
                    vm.fetchWeatherForCoords(
                        latitude: loc.coordinate.latitude,
                        longitude: loc.coordinate.longitude
                    )
                } else if !searchText.isEmpty {
                    // Ако имаме текст - правим doSearchCity()
                    doSearchCity()
                }
            } label: {
                Image(systemName: "arrow.clockwise")
                    .foregroundColor(.white)
            }
        }
        .font(.title2)
        .padding()
    }
    
    // --- SUGGESTIONS LIST ---
    private var suggestionsList: some View {
        VStack(alignment: .leading, spacing: 0) {
            ForEach(suggestions, id: \.self) { item in
                Button {
                    // Избираме предложението, само попълваме searchText
                    // НЕ извикваме doSearchCity() -
                    // все още не търсим, докато не натиснем Search.
                    let full = item.subtitle.isEmpty
                        ? item.title
                        : "\(item.title), \(item.subtitle)"
                    searchText = full
                    suggestions = []
                    isEditing = false
                } label: {
                    HStack {
                        Text("\(item.title), \(item.subtitle)")
                            .foregroundColor(.white)
                            .padding(.vertical, 6)
                        Spacer()
                    }
                    .padding(.horizontal, 6)
                }
                // Divider след всеки ред освен последния
                if item != suggestions.last {
                    Divider()
                        .background(Color.white.opacity(0.2))
                }
            }
        }
        .background(
            LinearGradient(
                gradient: Gradient(colors: [.blue.opacity(0.8), .purple.opacity(0.8)]),
                startPoint: .top,
                endPoint: .bottom
            )
        )
        .cornerRadius(8)
        .padding(.horizontal, 16)
    }
}

// MARK: - SEARCH LOGIC
extension WeatherKitView {
    /// Генерираме само предложения, без да fetch-ваме времето
    private func updateSearchSuggestions(for query: String) {
        if query.isEmpty {
            suggestions = []
        } else {
            searchCompleter.queryFragment = query
        }
    }
    
    /// Тук реално търсим геокодиране и fetchWeather
    private func doSearchCity() {
        let q = searchText.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !q.isEmpty else { return }
        
        let geocoder = CLGeocoder()
        geocoder.geocodeAddressString(q) { placemarks, err in
            if let e = err {
                print("Geocode error: \(e.localizedDescription)")
                vm.errorMessage = "Could not find location."
                return
            }
            if let first = placemarks?.first, let loc = first.location {
                print("Found coords: \(loc.coordinate)")
                
                // Обновяваме "geocodedCityName" от placemark:
                // (или fallback към 'q', ако нямаме locality)
                let city = first.locality
                    ?? first.administrativeArea
                    ?? q
                self.geocodedCityName = city
                
                // Fetch weather
                vm.fetchWeatherForCoords(
                    latitude: loc.coordinate.latitude,
                    longitude: loc.coordinate.longitude
                )
                
            } else {
                vm.errorMessage = "Location not found."
            }
        }
    }
    
    /// Логика какво име да показваме най-отгоре
    private func displayedCityName() -> String {
        // 1) Ако имаме "geocodedCityName", показваме него
        if !geocodedCityName.isEmpty {
            return geocodedCityName
        }
        // 2) Иначе ако user не е търсил (geocodedCityName = ""),
        //    показваме името от locationManager
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
                
                ForEach(vm.dailyForecast.indices, id: \.self) { i in
                    let dayItem = vm.dailyForecast[i]
                    HStack {
                        Text(dayItem.day)
                            .foregroundColor(.white)
                            .font(.body)
                            .frame(width: 60, alignment: .leading)
                        
                        Spacer()
                        
                        Image(systemName: dayItem.symbol)
                            .symbolVariant(.fill)
                            .symbolRenderingMode(.multicolor)
                            .font(.headline)
                        
                        if let chance = dayItem.precipChance {
                            let percent = Int(chance * 100)
                            Text("\(percent)%")
                                .foregroundColor(.white)
                                .font(.footnote)
                                .padding(.leading, 6)
                        }
                        
                        Spacer()
                        
                        Text("\(Int(dayItem.minTemp.rounded()))°")
                            .foregroundColor(.white)
                            .frame(width: 40, alignment: .trailing)
                        Text("\(Int(dayItem.maxTemp.rounded()))°")
                            .foregroundColor(.white)
                            .frame(width: 40, alignment: .trailing)
                            .padding(.leading, 8)
                    }
                    .padding(.vertical, 8)
                    .padding(.horizontal, 16)
                    
                    if i < vm.dailyForecast.count - 1 {
                        Divider()
                            .overlay(Color.white.opacity(0.3))
                            .padding(.horizontal, 16)
                    }
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
                
                LazyVGrid(
                    columns: [GridItem(.flexible()), GridItem(.flexible())],
                    alignment: .leading,
                    spacing: 16
                ) {
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
