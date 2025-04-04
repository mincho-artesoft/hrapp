import SwiftUI
import Combine
import CoreLocation
import MapKit
@preconcurrency import WeatherKit

struct WeatherKitView: View {
    
    // MARK: - State Objects
    @StateObject private var locationManager = LocationManager()
    @StateObject private var vm = WeatherKitViewModel()
    @StateObject private var locationSearchVM = LocationSearchViewModel()

    // MARK: - UI State
    @State private var showSearchBar = false
    @State private var isEditing = false
    @State private var geocodedCityName = ""
    @State private var selectedDay: DayForecastItem? = nil
    @State private var initialLoadComplete = false
    
    // 1) Нов state, който контролира sheet за HourlyFeelsLikeDetailView
    @State private var showFeelsLikeDetail = false
    
    var body: some View {
        ZStack(alignment: .top) {
            
            // 1) ДИНАМИЧЕН ФОН
            dynamicBackground
                .edgesIgnoringSafeArea(.all)
                .onTapGesture {
                    // Тап върху фона -> скрий Search, ако е отворен
                    if showSearchBar {
                        hideSearch()
                    }
                }
            
            // 2) ScrollView + Main Content
            ScrollView(.vertical, showsIndicators: false) {
                VStack(spacing: 20) {
                    
                    // --- TOP BAR (част от ScrollView съдържанието) ---
                    topBar
                        .padding(.top, 10)
                        .onTapGesture {
                            // „Консумираме“ жеста, за да не стигне до фона
                        }
                    
                    // --- MAIN WEATHER CONTENT ---
                    Group {
                        currentWeatherHeader
                        hourlyForecastCard
                            .padding(.horizontal, 16)
                        tenDayForecastCard
                            .padding(.horizontal, 16)
                        
                        // Тук показваме grid с детайли за днешния ден
                        todayDetailsGrid
                            .padding(.horizontal, 16)
                        
                        if let error = vm.errorMessage {
                            Text(error)
                                .foregroundColor(.yellow)
                                .padding()
                                .frame(maxWidth: .infinity)
                                .background(.red.opacity(0.6))
                                .clipShape(RoundedRectangle(cornerRadius: 8))
                                .padding(.horizontal, 16)
                        }
                    }
                    
                    Spacer().frame(height: 40)
                }
                .onTapGesture {
                    // Тап върху съдържанието -> скрий Search, ако е отворен
                    if showSearchBar {
                        hideSearch()
                    }
                }
                .refreshable {
                    refreshWeatherData()
                }
            }
            
            // 3) Search Results Overlay
            searchResultsOverlay
                .onTapGesture {
                    // Консумираме жеста над списъка, за да не стига до фона
                }
                .zIndex(10) // По-висок индекс от Top Bar и др.
        }
        // Първи sheet: при избор на ден (selectedDay)
        .sheet(item: $selectedDay) { day in
            DayDetailSheetView(day: day)
                .presentationDetents([.medium])
        }
        // 2) Нов sheet: показва се при showFeelsLikeDetail == true
        .sheet(isPresented: $showFeelsLikeDetail) {
            HourlyFeelsLikeDetailView(
                hourlyItems: vm.hourlyForecast,   // Или подайте само часовете за "днес"
                currentActualTemp: vm.currentTemp,
                currentFeelsLikeTemp: vm.currentFeelsLike,
                selectedDate: Date()              // Или конкретна дата, ако имате логика
            )
        }
        .onReceive(locationManager.$currentLocation) { location in
            if let loc = location,
               !showSearchBar,
               geocodedCityName.isEmpty,
               !initialLoadComplete {
                vm.fetchWeatherForCoords(
                    latitude: loc.coordinate.latitude,
                    longitude: loc.coordinate.longitude
                )
                initialLoadComplete = true
            }
        }
        .onReceive(locationSearchVM.$selectedPlacemark) { placemark in
            guard let placemark = placemark else { return }
            handleSelectedLocation(placemark: placemark)
        }
        .onReceive(locationManager.$authorizationStatus) { status in
            if status == .authorizedWhenInUse || status == .authorizedAlways {
                if locationManager.currentLocation == nil {
                    locationManager.manager.requestLocation()
                } else if !initialLoadComplete && !showSearchBar && geocodedCityName.isEmpty {
                    vm.fetchWeatherForCoords(
                        latitude: locationManager.currentLocation!.coordinate.latitude,
                        longitude: locationManager.currentLocation!.coordinate.longitude
                    )
                    initialLoadComplete = true
                }
            } else if status == .denied || status == .restricted {
                vm.errorMessage = "Location access denied. Search for a city or grant access in Settings."
                initialLoadComplete = true
            }
        }
    }
    
    // MARK: - ДИНАМИЧЕН ФОН СПОРЕД КЛИМАТА
    private var dynamicBackground: some View {
        let condition = vm.currentCondition.lowercased()
        
        switch condition {
        case _ where condition.contains("sun"), _ where condition.contains("clear"):
            // Слънчево
            return AnyView(
                LinearGradient(
                    gradient: Gradient(colors: [Color.yellow, Color.blue]),
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
            )
            
        case _ where condition.contains("rain"):
            // Дъжд
            return AnyView(
                LinearGradient(
                    gradient: Gradient(colors: [Color.blue.opacity(0.6), Color.gray]),
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
            )
            
        case _ where condition.contains("cloud"):
            // Облаци
            return AnyView(
                LinearGradient(
                    gradient: Gradient(colors: [Color.gray, Color.blue.opacity(0.4)]),
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
            )
            
        default:
            // По подразбиране
            return AnyView(
                LinearGradient(
                    gradient: Gradient(colors: [
                        Color.blue.opacity(0.6),
                        Color.gray.opacity(0.5)
                    ]),
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
            )
        }
    }
    
    // MARK: - TOP BAR
    private var topBar: some View {
        HStack {
            if showSearchBar {
                searchField
                    .transition(
                        .asymmetric(
                            insertion: .move(edge: .leading).combined(with: .opacity),
                            removal: .move(edge: .leading).combined(with: .opacity)
                        )
                    )
            } else {
                searchButton
                    .transition(
                        .asymmetric(
                            insertion: .move(edge: .leading).combined(with: .opacity),
                            removal: .move(edge: .leading).combined(with: .opacity)
                        )
                    )
            }
            
            Spacer()
            
            // Показваме бутона за затваряне (xmark) само ако е отворено Search
            if showSearchBar {
                closeSearchButton
                    .transition(
                        .asymmetric(
                            insertion: .move(edge: .trailing).combined(with: .opacity),
                            removal: .move(edge: .trailing).combined(with: .opacity)
                        )
                    )
            }
        }
        .padding(.horizontal)
    }
    
    private var searchField: some View {
        HStack(spacing: 8) {
            Image(systemName: "magnifyingglass")
                .foregroundColor(.secondary)
            
            TextField("Search for a city...",
                      text: $locationSearchVM.queryFragment,
                      onEditingChanged: { editing in
                          isEditing = editing
                          if editing && !showSearchBar {
                              withAnimation { showSearchBar = true }
                          }
                      },
                      onCommit: {
                          isEditing = false
                      })
                .textFieldStyle(.plain)
                .autocorrectionDisabled(true)
                .onTapGesture { }
            
            if !locationSearchVM.queryFragment.isEmpty {
                Button {
                    locationSearchVM.queryFragment = ""
                } label: {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundColor(.secondary)
                }
                .onTapGesture { }
            }
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 8)
        .background(.ultraThinMaterial, in: Capsule())
        .contentShape(Capsule())
        .onTapGesture { }
    }
    
    private var searchButton: some View {
        Button {
            showSearchBar = true
        } label: {
            Image(systemName: "magnifyingglass")
                .font(.title2)
                .frame(height: 36)
        }
        .buttonStyle(.plain)
    }
    
    private var closeSearchButton: some View {
        Button {
            hideSearch()
        } label: {
            Image(systemName: "xmark")
                .font(.title2)
                .frame(width: 30, height: 36)
        }
        .buttonStyle(.plain)
    }
    
    // MARK: - SEARCH RESULTS OVERLAY
    private var searchResultsOverlay: some View {
        Group {
            if showSearchBar && isEditing && !locationSearchVM.searchResults.isEmpty {
                List(locationSearchVM.searchResults, id: \.self) { completion in
                    Button {
                        // При тап:
                        locationSearchVM.selectCompletion(completion)
                        // handleSelectedLocation(..) ще се извика от onReceive
                    } label: {
                        VStack(alignment: .leading) {
                            Text(completion.title).foregroundColor(.primary)
                            if !completion.subtitle.isEmpty {
                                Text(completion.subtitle)
                                    .font(.subheadline)
                                    .foregroundColor(.secondary)
                            }
                        }
                    }
                    .contentShape(Rectangle())
                    .onTapGesture {
                        // „Консумираме“ жеста
                        locationSearchVM.selectCompletion(completion)
                    }
                    .listRowBackground(
                        Color(UIColor.systemBackground).opacity(0.2)
                    )
                }
                .listStyle(.plain)
                .frame(maxHeight: 400)
                .background(.ultraThinMaterial)
                .clipShape(RoundedRectangle(cornerRadius: 10))
                .shadow(radius: 5)
                .padding(.horizontal)
                .offset(y: 100)
                .transition(.opacity.combined(with: .move(edge: .top)))
            }
        }
    }
    
    // MARK: - MAIN WEATHER SUBVIEWS
    private var currentWeatherHeader: some View {
        VStack(spacing: 10) {
            // Име на града
            Text(displayedCityName())
                .font(.system(size: 34, weight: .regular))
                .foregroundColor(.primary)

            // Температурата, центрирана хоризонтално
            HStack(alignment: .lastTextBaseline, spacing: 8) {
                if let temp = vm.currentTemp {
                    Text("\(Int(temp.rounded()))°")
                        .font(.system(size: 96, weight: .thin))
                        .foregroundColor(.primary)
                } else {
                    Text("—°")
                        .font(.system(size: 96, weight: .thin))
                        .foregroundColor(.primary)
                }
            }
            .frame(maxWidth: .infinity, alignment: .center)

            // Описание на текущото време
            Text(vm.currentCondition)
                .foregroundColor(.secondary)
                .font(.system(size: 18, weight: .medium))

            // H/L за днешния ден
            if let hi = vm.todayMaxTemp, let lo = vm.todayMinTemp {
                Text("H:\(Int(hi.rounded()))°   L:\(Int(lo.rounded()))°")
                    .foregroundColor(.primary)
                    .font(.system(size: 18, weight: .medium))
            }
        }
        .padding(.vertical, 10)
    }

    private var hourlyForecastCard: some View {
        VStack(alignment: .leading, spacing: 0) {
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 25) {
                    ForEach(vm.hourlyForecast.indices, id: \.self) { i in
                        let hourItem = vm.hourlyForecast[i]
                        VStack(spacing: 12) {
                            Text(hourItem.hour)
                                .font(.system(size: 14, weight: .medium))
                                .foregroundColor(.primary)
                            
                            Image(systemName: hourItem.symbol)
                                .symbolVariant(.fill)
                                .symbolRenderingMode(.multicolor)
                                .font(.title2)
                                .frame(height: 30)
                            
                            Text("\(Int(hourItem.temp.rounded()))°")
                                .font(.system(size: 18, weight: .medium))
                                .foregroundColor(.primary)
                        }
                        .padding(.vertical, 5)
                    }
                }
                .padding(.horizontal, 15)
                .padding(.vertical, 12)
            }
            .frame(height: 120)
        }
        .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 12))
    }
    
    private var tenDayForecastCard: some View {
        VStack(alignment: .leading, spacing: 0) {
            Label("10-DAY FORECAST", systemImage: "calendar")
                .font(.system(size: 10, weight: .medium))
                .foregroundStyle(.secondary)
                .padding(.horizontal, 15)
                .padding(.top, 12)
                .padding(.bottom, 5)
            
            if !vm.dailyForecast.isEmpty {
                let temps = vm.dailyForecast.flatMap { [$0.minTemp, $0.maxTemp] }
                let globalMin = temps.min() ?? 0
                let globalMax = temps.max() ?? 1
                
                ForEach(vm.dailyForecast) { dayItem in
                    dailyForecastRow(
                        dayItem: dayItem,
                        globalMin: globalMin,
                        globalMax: globalMax,
                        isToday: Calendar.current.isDateInToday(dayItem.date),
                        currentTemp: vm.currentTemp
                    )
                    
                    if dayItem.id != vm.dailyForecast.last?.id {
                        Divider()
                            .background(.white.opacity(0.2))
                            .padding(.leading, 15)
                    }
                }
                .padding(.bottom, 5)
                
            } else {
                HStack {
                    Spacer()
                    ProgressView().tint(.white)
                    Spacer()
                }
                .padding()
                .frame(height: 100)
            }
        }
        .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 12))
    }
    
    private func dailyForecastRow(
        dayItem: DayForecastItem,
        globalMin: Double,
        globalMax: Double,
        isToday: Bool,
        currentTemp: Double?
    ) -> some View {
        HStack(spacing: 10) {
            Text(dayItem.day)
                .font(.system(size: 16, weight: .medium))
                .foregroundColor(.primary)
                .frame(width: 55, alignment: .leading)
            
            HStack(spacing: 5) {
                Image(systemName: dayItem.symbol)
                    .symbolVariant(.fill)
                    .symbolRenderingMode(.multicolor)
                    .font(.title3)
                    .frame(width: 30)
                
                if let chance = dayItem.precipChance, chance >= 0.1 {
                    Text("\(Int((chance * 100).rounded()))%")
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundColor(Color(hue: 0.55, saturation: 0.8, brightness: 1.0))
                        .frame(width: 35)
                } else {
                    Spacer().frame(width: 35)
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            
            Text("\(Int(dayItem.minTemp.rounded()))°")
                .font(.system(size: 16, weight: .medium))
                .foregroundColor(.secondary)
                .frame(width: 35, alignment: .trailing)
            
            TemperatureRangeView(
                day: dayItem,
                globalMin: globalMin,
                globalMax: globalMax,
                isToday: isToday,
                currentTemp: isToday ? currentTemp : nil
            )
            .frame(width: 80)
            
            Text("\(Int(dayItem.maxTemp.rounded()))°")
                .font(.system(size: 16, weight: .medium))
                .foregroundColor(.primary)
                .frame(width: 35, alignment: .trailing)
        }
        .padding(.horizontal, 15)
        .padding(.vertical, 10)
        .contentShape(Rectangle())
        .onTapGesture {
            selectedDay = dayItem
        }
    }
    
    // MARK: - Примерен Grid с 2 колони / 3 реда (или както го имате)
    private var todayDetailsGrid: some View {
        VStack(spacing: 15) {
            // Ред 1: Feels Like + UV
            HStack(spacing: 15) {
                FeelsLikeCard(
                    feelsLike: vm.currentFeelsLike,
                    currentTemp: vm.currentTemp
                )
                // 3) Тук добавяме жест за отваряне на sheet-а
                .onTapGesture {
                    showFeelsLikeDetail = true
                }
                
                UVIndexCard(
                    uvIndex: vm.currentUVIndex,
                    categoryInfo: vm.uvCategory(for: vm.currentUVIndex)
                )
            }
            
            // Ред 2: Wind (цяла ширина)
            WindCard(
                windSpeedKmh: vm.currentWindSpeed ?? 0,
                gustSpeedKmh: vm.currentWindGust ?? 0,
                direction: vm.currentWindDirection,
                directionAbbreviation: vm.windDirectionAbbreviation(for: vm.currentWindDirection)
            )
            
            // Ред 3: Sunrise/Sunset (цяла ширина)
            SunsetCard(
                sunrise: vm.sunriseTime,
                sunset: vm.sunsetTime,
                formatTime: vm.formatTime
            )
            
            // Ред 4: Precip + Visibility
            HStack(spacing: 15) {
                let nextRainInfo = findNextPrecipitationEvent()
                PrecipitationTodayCard(
                    amount: vm.todayPrecipitationAmount,
                    nextExpectedAmount: nextRainInfo.amount,
                    nextExpectedTimeString: nextRainInfo.timeString
                )
                VisibilityCard(
                    visibilityKm: (vm.currentVisibility ?? 0) / 1000
                )
            }
            
            // Ред 5: Humidity + Pressure
            HStack(spacing: 15) {
                HumidityCard(
                    humidity: vm.currentHumidity,
                    dewPoint: vm.currentDewPoint
                )
                PressureCard(
                    pressure: vm.currentPressure,
                    trend: vm.pressureTrend
                )
            }
        }
    }
    
    // MARK: - HELPER FUNCTIONS
    private func displayedCityName() -> String {
        if !geocodedCityName.isEmpty {
            return geocodedCityName
        }
        return locationManager.currentCityName ?? "Loading..."
    }
    
    private func refreshWeatherData() {
        vm.clearWeatherData()
        initialLoadComplete = false
        
        if !geocodedCityName.isEmpty,
           let placemark = locationSearchVM.selectedPlacemark {
            handleSelectedLocation(placemark: placemark)
        }
        else if let loc = locationManager.currentLocation {
            vm.fetchWeatherForCoords(latitude: loc.coordinate.latitude, longitude: loc.coordinate.longitude)
            initialLoadComplete = true
        } else {
            locationManager.manager.requestLocation()
            vm.errorMessage = "Cannot refresh. Location unknown."
            initialLoadComplete = true
        }
        
        // Ако сме в режим на търсене, го затваряме
        if showSearchBar {
            hideSearch()
        }
    }
    
    private func handleSelectedLocation(placemark: MKPlacemark) {
        vm.clearWeatherData()
        let coords = placemark.coordinate
        vm.fetchWeatherForCoords(latitude: coords.latitude, longitude: coords.longitude)
        initialLoadComplete = true
        
        let city = placemark.locality ?? placemark.administrativeArea ?? placemark.name ?? "Selected Location"
        self.geocodedCityName = city
        
        hideSearch()
    }
    
    private func hideSearch() {
        showSearchBar = false
        locationSearchVM.queryFragment = ""
        isEditing = false
        hideKeyboard()
    }
    
    private func hideKeyboard() {
        UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder),
                                        to: nil, from: nil, for: nil)
    }
    
    private func findNextPrecipitationEvent() -> (amount: Double?, timeString: String?) {
        // Примерна логика:
        if let nextDayPrecip = vm.dailyForecast.first(where: { day in
            guard !Calendar.current.isDateInToday(day.date) else { return false }
            return (day.precipChance ?? 0) >= 0.1
        }) {
            let daysUntil = Calendar.current.dateComponents([.day], from: Date(), to: nextDayPrecip.date).day ?? 0
            let timeString: String
            if daysUntil <= 1 {
                timeString = "tomorrow"
            } else if daysUntil <= 7 {
                timeString = "on \(nextDayPrecip.day)"
            } else {
                timeString = "in \(daysUntil) days"
            }
            return (amount: 1.0, timeString: timeString)
        }
        
        return (amount: nil, timeString: nil)
    }
}

// MARK: - Доп. Extension за криене на клавиатурата
extension View {
    func hideKeyboard() {
        UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder),
                                        to: nil, from: nil, for: nil)
    }
}
