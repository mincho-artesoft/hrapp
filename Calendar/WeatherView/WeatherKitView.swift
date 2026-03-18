import SwiftUI
import EventKit
import Combine
import CoreLocation
import MapKit
@preconcurrency import WeatherKit

struct WeatherKitView: View {
    
    @State private var shouldShowAds = true

    var selectedTab: Int
    var onViewChange: ((Int) -> Void)
    @State private var eventToEdit: EKEvent? = nil
    @FocusState private var isSearchFieldFocused: Bool
    // MARK: - State Objects
    @StateObject private var locationManager = LocationManager()
    @StateObject private var vm = WeatherKitViewModel.shared
    let viewModel = CalendarViewModel.shared

    @StateObject private var locationSearchVM = LocationSearchViewModel()
    @Environment(\.colorScheme) var colorScheme

    // MARK: - UI State
    @State private var showSearchBar = false
    @State private var isEditing = false
    @State private var geocodedCityName = ""
    @State private var selectedDay: DayForecastItem? = nil
    @State private var initialLoadComplete = false

    // Sheets за различни детайли
    @State private var showFeelsLikeDetail = false
    @State private var showUVDetail = false
    @State private var showWindDetail = false
    @State private var showPrecipitationDetail = false
    @State private var showHumidityDetail = false
    @State private var showVisibilityDetail = false
    @State private var showPressureDetail = false

    
    init(selectedTab: Int, onViewChange: ((Int) -> Void)? = nil) {
        self.selectedTab = selectedTab
        self.onViewChange = onViewChange!
    }

    var body: some View {
        ZStack(alignment: .top) {
            // 1) Динамичен фон
            dynamicBackground
                .edgesIgnoringSafeArea(.all)
            
            // 2) ScrollView съдържащ цялото съдържание, включително и tърсачката (topBar)
            ScrollView(.vertical, showsIndicators: false) {
                VStack(spacing: 20) {
                    // Текущото време и град
                    currentWeatherHeader
                    
                    // Часов прогноз – хоризонтален ScrollView
                    hourlyForecastCard
                        .padding(.horizontal, 16)
                    
                    // Условие за показване на реклами: Base план И датата е след 1.04.2026
                    if SubscriptionManager.shared.subscriptionStatus == .base{
                        if shouldShowAds {
                            BannerAdView(adsBool: $shouldShowAds)
                            .frame(height: 60)
                            .padding(.vertical, 8)
                        }
                    }
                   
                    // 10-дневният прогноз
                    tenDayForecastCard
                        .padding(.horizontal, 16)
                    
                    // Допълнителни детайли за днес
                    todayDetailsGrid
                        .padding(.horizontal, 16)
                    
                    // Ако има съобщение за грешка
                    if let error = vm.errorMessage {
                        Text(error)
                            .foregroundColor(.yellow)
                            .padding()
                            .frame(maxWidth: .infinity)
                            .background(Color.red.opacity(0.6))
                            .clipShape(RoundedRectangle(cornerRadius: 8))
                            .padding(.horizontal, 16)
                    }
                    
                    
                    VStack {
                        Spacer(minLength: 40) // push down a bit
                        attributionFooter
                            .padding(.bottom, 8)
                    }
                }
                // Ако е необходимо, можете да запазите tap gesture за скриване на търсачката
                .onTapGesture {
                    if showSearchBar { hideSearch() }
                }
                .disabled(eventToEdit != nil)   // докато modal-ът е активен – клетките са неактивни

                .refreshable {
                    refreshWeatherData()
                }
            }
            
            // 3) Overlay със списък с резултати от търсенето
            searchResultsOverlay
                .zIndex(10) // overlay да е над останалото съдържание
        }
        .navigationBarHidden(true)
        .safeAreaInset(edge: .top) {
            VStack(spacing: 0) {
                weatherTopBar

                if showSearchBar {
                    searchField
                        .padding(.top, 8)
                        .padding(.horizontal)
                        .transition(.move(edge: .top).combined(with: .opacity))
                        .animation(.easeInOut(duration: 0.25), value: showSearchBar)
                }
            }
        }

        // Sheet-ове за детайлен изглед при избор на ден или тап върху определени данни
        .sheet(item: $selectedDay) { day in
            WeatherDetailView(
                allHourlyItems: vm.hourlyForecast,
                allDailyItems: vm.dailyForecast,
                currentActualTemp: vm.currentTemp,
                currentFeelsLikeTemp: vm.currentFeelsLike,
                initialDate: day.date,
                daySymbol: day.symbol,
                selectedOption: 0
            )
        }
        .sheet(isPresented: $showFeelsLikeDetail) {
            if let todayItem = vm.dailyForecast.first(where: { Calendar.current.isDate($0.date, inSameDayAs: Date()) }) {
                WeatherDetailView(
                    allHourlyItems: vm.hourlyForecast,
                    allDailyItems: vm.dailyForecast,
                    currentActualTemp: vm.currentTemp,
                    currentFeelsLikeTemp: vm.currentFeelsLike,
                    initialDate: Date(),
                    daySymbol: todayItem.symbol,
                    selectedOption: 0
                )
            } else {
                WeatherDetailView(
                    allHourlyItems: vm.hourlyForecast,
                    allDailyItems: vm.dailyForecast,
                    currentActualTemp: vm.currentTemp,
                    currentFeelsLikeTemp: vm.currentFeelsLike,
                    initialDate: Date(),
                    daySymbol: vm.currentSymbol,
                    selectedOption: 0
                )
            }
        }
        .sheet(isPresented: $showUVDetail) {
            if let todayItem = vm.dailyForecast.first(where: { Calendar.current.isDate($0.date, inSameDayAs: Date()) }) {
                WeatherDetailView(
                    allHourlyItems: vm.hourlyForecast,
                    allDailyItems: vm.dailyForecast,
                    currentActualTemp: vm.currentTemp,
                    currentFeelsLikeTemp: vm.currentFeelsLike,
                    initialDate: Date(),
                    daySymbol: todayItem.symbol,
                    selectedOption: 1
                )
            } else {
                WeatherDetailView(
                    allHourlyItems: vm.hourlyForecast,
                    allDailyItems: vm.dailyForecast,
                    currentActualTemp: vm.currentTemp,
                    currentFeelsLikeTemp: vm.currentFeelsLike,
                    initialDate: Date(),
                    daySymbol: vm.currentSymbol,
                    selectedOption: 1
                )
            }
        }
        .sheet(isPresented: $showWindDetail) {
            if let todayItem = vm.dailyForecast.first(where: { Calendar.current.isDate($0.date, inSameDayAs: Date()) }) {
                WeatherDetailView(
                    allHourlyItems: vm.hourlyForecast,
                    allDailyItems: vm.dailyForecast,
                    currentActualTemp: vm.currentTemp,
                    currentFeelsLikeTemp: vm.currentFeelsLike,
                    initialDate: Date(),
                    daySymbol: todayItem.symbol,
                    selectedOption: 2
                )
            } else {
                WeatherDetailView(
                    allHourlyItems: vm.hourlyForecast,
                    allDailyItems: vm.dailyForecast,
                    currentActualTemp: vm.currentTemp,
                    currentFeelsLikeTemp: vm.currentFeelsLike,
                    initialDate: Date(),
                    daySymbol: vm.currentSymbol,
                    selectedOption: 2
                )
            }
        }
        .sheet(isPresented: $showPrecipitationDetail) {
            if let todayItem = vm.dailyForecast.first(where: { Calendar.current.isDate($0.date, inSameDayAs: Date()) }) {
                WeatherDetailView(
                    allHourlyItems: vm.hourlyForecast,
                    allDailyItems: vm.dailyForecast,
                    currentActualTemp: vm.currentTemp,
                    currentFeelsLikeTemp: vm.currentFeelsLike,
                    initialDate: Date(),
                    daySymbol: todayItem.symbol,
                    selectedOption: 3
                )
            } else {
                WeatherDetailView(
                    allHourlyItems: vm.hourlyForecast,
                    allDailyItems: vm.dailyForecast,
                    currentActualTemp: vm.currentTemp,
                    currentFeelsLikeTemp: vm.currentFeelsLike,
                    initialDate: Date(),
                    daySymbol: vm.currentSymbol,
                    selectedOption: 3
                )
            }
        }
        .sheet(isPresented: $showHumidityDetail) {
            if let todayItem = vm.dailyForecast.first(where: { Calendar.current.isDate($0.date, inSameDayAs: Date()) }) {
                WeatherDetailView(
                    allHourlyItems: vm.hourlyForecast,
                    allDailyItems: vm.dailyForecast,
                    currentActualTemp: vm.currentTemp,
                    currentFeelsLikeTemp: vm.currentFeelsLike,
                    initialDate: Date(),
                    daySymbol: todayItem.symbol,
                    selectedOption: 4
                )
            } else {
                WeatherDetailView(
                    allHourlyItems: vm.hourlyForecast,
                    allDailyItems: vm.dailyForecast,
                    currentActualTemp: vm.currentTemp,
                    currentFeelsLikeTemp: vm.currentFeelsLike,
                    initialDate: Date(),
                    daySymbol: vm.currentSymbol,
                    selectedOption: 4
                )
            }
        }
        .sheet(isPresented: $showVisibilityDetail) {
            if let todayItem = vm.dailyForecast.first(where: { Calendar.current.isDate($0.date, inSameDayAs: Date()) }) {
                WeatherDetailView(
                    allHourlyItems: vm.hourlyForecast,
                    allDailyItems: vm.dailyForecast,
                    currentActualTemp: vm.currentTemp,
                    currentFeelsLikeTemp: vm.currentFeelsLike,
                    initialDate: Date(),
                    daySymbol: todayItem.symbol,
                    selectedOption: 5
                )
            } else {
                WeatherDetailView(
                    allHourlyItems: vm.hourlyForecast,
                    allDailyItems: vm.dailyForecast,
                    currentActualTemp: vm.currentTemp,
                    currentFeelsLikeTemp: vm.currentFeelsLike,
                    initialDate: Date(),
                    daySymbol: vm.currentSymbol,
                    selectedOption: 5
                )
            }
        }
        .sheet(isPresented: $showPressureDetail) {
            if let todayItem = vm.dailyForecast.first(where: { Calendar.current.isDate($0.date, inSameDayAs: Date()) }) {
                WeatherDetailView(
                    allHourlyItems: vm.hourlyForecast,
                    allDailyItems: vm.dailyForecast,
                    currentActualTemp: vm.currentTemp,
                    currentFeelsLikeTemp: vm.currentFeelsLike,
                    initialDate: Date(),
                    daySymbol: todayItem.symbol,
                    selectedOption: 6
                )
            } else {
                WeatherDetailView(
                    allHourlyItems: vm.hourlyForecast,
                    allDailyItems: vm.dailyForecast,
                    currentActualTemp: vm.currentTemp,
                    currentFeelsLikeTemp: vm.currentFeelsLike,
                    initialDate: Date(),
                    daySymbol: vm.currentSymbol,
                    selectedOption: 6
                )
            }
        }
        .sheet(isPresented: Binding(
                get: { eventToEdit != nil },
                set: { if !$0 { eventToEdit = nil } }   // зануляваме при затваряне
        )) {
            if let theEvent = eventToEdit {            // unwrap вътре
                EventEditViewWrapper(eventStore: viewModel.eventStore,
                                     event: theEvent)
            }
        }



        // MARK: - onReceive за Location и други събития
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
    
    private var dynamicBackground: some View {
        let condition = vm.currentCondition.lowercased()
        switch condition {
        case _ where condition.contains("sun"), _ where condition.contains("clear"):
            return AnyView(
                LinearGradient(
                    gradient: Gradient(colors: [Color.yellow, Color.blue]),
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
            )
        case _ where condition.contains("rain"):
            return AnyView(
                LinearGradient(
                    gradient: Gradient(colors: [Color.blue.opacity(0.6), Color.gray]),
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
            )
        case _ where condition.contains("cloud"):
            return AnyView(
                LinearGradient(
                    gradient: Gradient(colors: [Color.gray, Color.blue.opacity(0.4)]),
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
            )
        default:
            return AnyView(
                LinearGradient(
                    gradient: Gradient(colors: [Color.blue.opacity(0.6), Color.gray.opacity(0.5)]),
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
            )
        }
    }
    
    private var searchField: some View {
        HStack {
            TextField(
                "",
                text: $locationSearchVM.queryFragment,
                prompt: Text("Search for a city…")
                    .foregroundColor(.white.opacity(0.5))
            )
            .textInputAutocapitalization(.never)   // без автоматични главни букви
            .autocorrectionDisabled(true)          // без автокорекция
            .keyboardType(.asciiCapable)           // изчистена QWERTY, без локални „умни“ предложения
            .focused($isSearchFieldFocused)              // ← тук
            .onSubmit { isEditing = false }
            .onChange(of: locationSearchVM.queryFragment) { isEditing = true }
            .textFieldStyle(.plain)
            .font(.subheadline)
            .foregroundColor(.white.opacity(0.85))   // цвят на въведения текст
            .accentColor(.white)


            Button(action: hideSearch) {
                Image(systemName: "xmark")                  // ⨉ вместо текст
                    .font(.subheadline.weight(.semibold))   // същия размер като преди
                    .foregroundColor(Color.white.opacity(0.35))            // сив (и в light, и в dark)
            }
        }
        .padding(.vertical, 6)
        .padding(.horizontal, 12)
        .frame(height: 34)
        .background(
            RoundedRectangle(cornerRadius: 10, style: .continuous)
                .fill(Color.black.opacity(0.35))
        )
    }

    private var weatherTopBar: some View {
        HStack(spacing: 9) {
            Spacer()
            if !showSearchBar {
                Button {
                    withAnimation {
                        showSearchBar = true
                    }
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.25) {
                        isSearchFieldFocused = true
                    }
                } label: {
                    Image(systemName: "magnifyingglass")
                }
                .frame(width: 34, height: 34)
                .contentShape(Rectangle())
                .buttonStyle(.plain)
                .foregroundColor(colorScheme == .light ? .black : .white)

                UIMenuButtonRepresentable(
                    currentView: selectedTab,
                    tintColor: colorScheme == .light ? .black : .white,
                    onViewChange: onViewChange
                )
                .frame(width: 36, height: 36)
            }
        }
        .frame(maxWidth: .infinity)
        .padding(.horizontal)
        .padding(.top, 8)
        .padding(.bottom, 8)
        .background(Color.black.opacity(0.001))
        .contentShape(Rectangle())
        .zIndex(20)
    }
    
    private var searchResultsOverlay: some View {
        Group {
            if showSearchBar && isEditing && !locationSearchVM.searchResults.isEmpty {
                List(locationSearchVM.searchResults, id: \.self) { completion in
                    Button {
                        // ✅ FIX: Wrap the async call in a Task
                        Task {
                            await locationSearchVM.selectCompletion(completion)
                        }
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
                    .listRowBackground(Color(UIColor.systemBackground).opacity(0.2))
                }
                .listStyle(.plain)
                .frame(maxHeight: 400)
                .background(.ultraThinMaterial)
                .clipShape(RoundedRectangle(cornerRadius: 10))
                .shadow(radius: 5)
                .padding(.horizontal)
                .offset(y: 60)
                .transition(.opacity.combined(with: .move(edge: .top)))
            }
        }
    }
    
    // MARK: - MAIN WEATHER SUBVIEWS
    private var currentWeatherHeader: some View {
        VStack(spacing: 10) {
            Text(displayedCityName())
                .font(.system(size: 34, weight: .regular))
                .foregroundColor(.primary)
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
            Text(vm.currentCondition)
                .foregroundColor(.secondary)
                .font(.system(size: 18, weight: .medium))
            if let hi = vm.todayMaxTemp, let lo = vm.todayMinTemp {
                Text("H:\(Int(hi.rounded()))°   L:\(Int(lo.rounded()))°")
                    .foregroundColor(.primary)
                    .font(.system(size: 18, weight: .medium))
            }
        }
        .padding(.vertical, 10)
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
                            .background(Color.white.opacity(0.2))
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
                        .foregroundColor(Color(hue: 0.55, saturation: 0.8, brightness: colorScheme == .light ? 0.7 : 1.0))
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
    
    private var todayDetailsGrid: some View {
        VStack(spacing: 15) {
            HStack(spacing: 15) {
                FeelsLikeCard(
                    feelsLike: vm.currentFeelsLike,
                    currentTemp: vm.currentTemp
                )
                .onTapGesture {
                    showFeelsLikeDetail = true
                }
                UVIndexCard(
                    uvIndex: vm.currentUVIndex,
                    categoryInfo: vm.uvCategory(for: vm.currentUVIndex)
                )
                .onTapGesture {
                    showUVDetail = true
                }
            }
            WindCard(
                windSpeed: vm.currentWindSpeed ?? 0,
                gustSpeed: vm.currentWindGust ?? 0,
                direction: vm.currentWindDirection,
                directionAbbreviation: vm.windDirectionAbbreviation(for: vm.currentWindDirection)
            )
            .onTapGesture {
                showWindDetail = true
            }
            SunsetCard(
                sunrise: vm.sunriseTime,
                sunset: vm.sunsetTime,
                formatTime: vm.formatTime
            )
            MoonCard(
                moonEvents: vm.currentMoonEvents
            )
            HStack(spacing: 15) {
                let nextRainInfo = findNextPrecipitationEvent()
                PrecipitationTodayCard(
                    amount: vm.todayPrecipitationAmount,
                    nextExpectedAmount: nextRainInfo.amount,
                    nextExpectedTimeString: nextRainInfo.timeString
                )
                .onTapGesture {
                    showPrecipitationDetail = true
                }
                VisibilityCard(
                    visibilityKm: (vm.currentVisibility ?? 0)
                )
                .onTapGesture {
                    showVisibilityDetail = true
                }
            }
            HStack(spacing: 15) {
                HumidityCard(
                    humidity: vm.currentHumidity,
                    dewPoint: vm.currentDewPoint
                )
                .onTapGesture {
                    showHumidityDetail = true
                }
                PressureCard(
                    pressure: vm.currentPressure,
                    trend: vm.pressureTrend
                )
                .onTapGesture {
                    showPressureDetail = true
                }
            }
        }
    }
    
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
        
        if showSearchBar { hideSearch() }
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
        isSearchFieldFocused = false  // ← премахва фокуса и клавиатурата
        hideKeyboard()
    }

    
    private func hideKeyboard() {
        UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder),
                                        to: nil, from: nil, for: nil)
    }
    
    private func findNextPrecipitationEvent() -> (amount: Double?, timeString: String?) {
        if let nextDayPrecip = vm.dailyForecast.first(where: { day in
            guard !Calendar.current.isDateInToday(day.date) else { return false }
            return (day.precipChance ?? 0) >= 0.1
        }) {
            let daysUntil = Calendar.current.dateComponents([.day], from: Date(), to: nextDayPrecip.date).day ?? 0
            let timeString: String

            if daysUntil <= 1 {
                timeString = NSLocalizedString("tomorrow", comment: "Precipitation forecast for tomorrow")
            } else if daysUntil <= 7 {
                let format = NSLocalizedString("on_day", comment: "Precipitation forecast on specific day")
                timeString = String(format: format, nextDayPrecip.day)
            } else {
                let format = NSLocalizedString("in_days", comment: "Precipitation forecast in X days")
                timeString = String(format: format, daysUntil)
            }

            return (amount: nextDayPrecip.precipChance, timeString: timeString)
        }

        return (amount: nil, timeString: nil)
    }

    
    /// Функция, която създава ново събитие за даден ден и избран час.
    /// С използване на текущия календар, който работи с часовата зона на устройството.
    private func presentNewEvent(on day: Date, selectedHour: Int) {
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = vm.locationTimeZone
        var components = calendar.dateComponents([.year, .month, .day], from: day)
        components.hour = selectedHour
        components.minute = 0
        
        guard let eventStart = calendar.date(from: components) else {
            print("Грешка при конструирането на датата за началото на събитието.")
            return
        }
        
        let eventEnd = eventStart.addingTimeInterval(3600)
        let newEvent = EKEvent(eventStore: viewModel.eventStore)
        newEvent.startDate = eventStart
        newEvent.endDate = eventEnd
        newEvent.title = NSLocalizedString("New Event", comment: "Default title for newly created events")
        newEvent.calendar = viewModel.eventStore.defaultCalendarForNewEvents
        
        eventToEdit = newEvent
    }

    /// Функция, която се извиква при тап върху елемент от hourlyForecastCard.
    /// Тук трябва да извлечете избрания час (например от модела на елемента) и да подадете и деня.
    private func createAndEditNewEvent(from tappedHour: Int, for day: Date) {
        // Проверяваме статуса на достъпа до календар (примерно както имате в оригиналния метод)
        let status = EKEventStore.authorizationStatus(for: .event)
        if #available(iOS 17.0, *) {
            switch status {
            case .fullAccess, .writeOnly:
                presentNewEvent(on: day, selectedHour: tappedHour)
            case .notDetermined:
                print("Още не е поискан достъп.")
            default:
                print("Нямате достъп до календара.")
            }
        } else {
            if status == .authorized {
                presentNewEvent(on: day, selectedHour: tappedHour)
            } else if status == .notDetermined {
                print("Още не е поискан достъп.")
            } else {
                print("Нямате достъп до календара.")
            }
        }
    }

}

/// Хоризонтален scroll с directional-lock и без vertical bounce
struct DirectionLockedHScroll<Content: View>: UIViewRepresentable {
    let content: Content

    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }

    func makeUIView(context: Context) -> UIScrollView {
        // 1) конфигурираме UIScrollView
        let scrollView = UIScrollView()
        scrollView.backgroundColor = .clear            // ← прозрачно
        scrollView.alwaysBounceHorizontal = true
        scrollView.alwaysBounceVertical = false
        scrollView.showsHorizontalScrollIndicator = false
        scrollView.showsVerticalScrollIndicator = false
        scrollView.isDirectionalLockEnabled = true
        scrollView.delaysContentTouches = false   // изпрати tap веднага
        scrollView.canCancelContentTouches = true // но все пак може да скролва

        // 2) „hosting controller“ за SwiftUI съдържанието
        let host = UIHostingController(rootView: content)
        host.view.backgroundColor = .clear             // ← прозрачно
        host.view.isOpaque = false                     // ← важно за прозрачност
        host.view.translatesAutoresizingMaskIntoConstraints = false

        scrollView.addSubview(host.view)
        NSLayoutConstraint.activate([
            host.view.topAnchor.constraint(equalTo: scrollView.contentLayoutGuide.topAnchor),
            host.view.bottomAnchor.constraint(equalTo: scrollView.contentLayoutGuide.bottomAnchor),
            host.view.leadingAnchor.constraint(equalTo: scrollView.contentLayoutGuide.leadingAnchor),
            host.view.trailingAnchor.constraint(equalTo: scrollView.contentLayoutGuide.trailingAnchor),
            host.view.heightAnchor.constraint(equalTo: scrollView.frameLayoutGuide.heightAnchor)
        ])

        return scrollView
    }

    func updateUIView(_ uiView: UIScrollView, context: Context) {
        // само заменяме корена на host-а
        if let host = uiView.subviews.compactMap({ $0.next as? UIHostingController<Content> }).first {
            host.rootView = content
        }
    }
}

// MARK: - WeatherKitView extension
extension WeatherKitView {

    /// Готовият изглед-карта за 24-ч прогнозата.
    /// Използвайте го в тялото на WeatherKitView така:
    ///
    ///     hourlyForecastCard
    ///         .padding(.horizontal, 16)
    ///
    private var hourlyForecastCard: some View {
        HourlyForecastCard(
            vm: vm,
            onHourTap: { tappedHour in
                print(tappedHour)
                ReviewManager.eventCreated()
                createAndEditNewEvent(from: tappedHour, for: Date())
            }
        )
        .disabled(eventToEdit != nil)       // блокирайте, докато редактирате event
    }
    
    @ViewBuilder
    private var attributionFooter: some View {
        VStack(spacing: 4) {
            // 1) Trademark line
            Text(" Weather")
                .font(.footnote)
                .bold()

            // 2) Legal‐attribution link
            Link("Data provided by Apple Weather", destination: URL(string: "https://weatherkit.apple.com/legal-attribution.html")!)
                .font(.footnote)
                .underline()
        }
        .foregroundColor(.secondary)
        .frame(maxWidth: .infinity)
    }
}

// MARK: - HourlyForecastCard
struct HourlyForecastCard: View {
    @Environment(\.colorScheme) private var colorScheme
    @ObservedObject var vm: WeatherKitViewModel
    var onHourTap: (Int) -> Void

    private var isAnyPrecip: Bool {
        vm.next24HourlyForecast.contains { $0.precipChance >= 0.1 }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            HourlyStrip(
                hours: vm.next24HourlyForecast,
                isAnyPrecip: isAnyPrecip,
                colorScheme: colorScheme,
                onHourTap: onHourTap
            )
            .frame(height: 120)

            HStack(spacing: 4) {
                Image(systemName: "info.circle")
                    .font(.system(size: 12))
                Text("Tap an hour to quickly add a calendar event.")
                    .font(.caption)
            }
            .foregroundStyle(.secondary)
            .padding(.horizontal, 15)
            .padding(.bottom, 5)
        }
        .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 12))
    }
}

// MARK: - HourlyStrip
private struct HourlyStrip: View {
    let hours: [HourlyForecastItem]
    let isAnyPrecip: Bool
    let colorScheme: ColorScheme
    let onHourTap: (Int) -> Void

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 25) {
                ForEach(hours) { hour in
                    HourlyCell(
                        item: hour,
                        isAnyPrecip: isAnyPrecip,
                        colorScheme: colorScheme
                    )
                    .contentShape(Rectangle())          // за по-голяма зона за пипане
                    .onTapGesture {
                        onHourTap(Int(hour.hour) ?? 0)  // ще отпечата часа
                    }
                }
            }
            .padding(.horizontal, 15)
            .padding(.vertical, 12)
        }
        .scrollIndicators(.hidden)
    }
}


// MARK: - HourlyCell
private struct HourlyCell: View {
    let item: HourlyForecastItem
    let isAnyPrecip: Bool
    let colorScheme: ColorScheme

    var body: some View {
        VStack {
            Text(item.hour)
                .font(.system(size: 14, weight: .medium))

            Image(systemName: item.symbol)
                .symbolVariant(.fill)
                .symbolRenderingMode(.multicolor)
                .font(.title2)
                .frame(height: 30)
                .offset(y: item.symbol == "cloud.fill" ? -5 : 0)

            if isAnyPrecip {
                Text(item.precipChance >= 0.1 ? "\(Int(item.precipChance * 100))%" : " ")
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(
                        Color(
                            hue: 0.55,
                            saturation: 0.8,
                            brightness: colorScheme == .light ? 0.7 : 1.0
                        )
                    )
            }

            Text("\(Int(item.temp.rounded()))°")
                .font(.system(size: 18, weight: .medium))
        }
        .frame(minWidth: 25, idealWidth: 35, maxWidth: 45)
        .contentShape(Rectangle())
    }
}
