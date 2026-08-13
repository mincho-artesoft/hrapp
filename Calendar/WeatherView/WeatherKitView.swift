import SwiftUI
import EventKit
import Combine
import CoreLocation
import MapKit
@preconcurrency import WeatherKit

private let weatherPrecipitationAccent = Color(
    hue: 0.55,
    saturation: 0.8,
    brightness: 1.0
)

private struct SavedRegionWeatherSummary: Equatable {
    let temperature: Double
    let lowTemperature: Double
    let highTemperature: Double
    let condition: String
    let conditionKey: String
    let symbolName: String
    let alertSummary: String?
    let isDaylight: Bool
}

struct WeatherKitView: View {
    
    @State private var shouldShowAds = true

    var selectedTab: Int
    var onViewChange: ((Int) -> Void)
    var onSavedRegionsPresentationChange: (Bool) -> Void
    @State private var eventToEdit: EKEvent? = nil
    @FocusState private var isSearchFieldFocused: Bool
    // MARK: - State Objects
    @StateObject private var locationManager = LocationManager()
    @StateObject private var vm = WeatherKitViewModel.shared
    @StateObject private var savedRegions = SavedWeatherRegionsStore.shared
    let viewModel = CalendarViewModel.shared

    @StateObject private var locationSearchVM = LocationSearchViewModel()

    // MARK: - UI State
    @State private var showSearchBar = false
    @State private var isEditing = false
    @State private var geocodedCityName = ""
    @State private var selectedDay: DayForecastItem? = nil
    @State private var initialLoadComplete = false
    @State private var showSavedRegions = false
    @State private var didRestoreSavedRegion = false
    @State private var savedRegionWeather: [UUID: SavedRegionWeatherSummary] = [:]
    @State private var currentLocationWeather: SavedRegionWeatherSummary?
    @State private var finishedLoadingRegionWeatherIDs: Set<UUID> = []
    @State private var finishedLoadingCurrentLocationWeather = false
    @State private var savedRegionInsertionIndex: Int?
    @State private var isShowingUnsavedSearchLocation = false

    // Sheets за различни детайли
    @State private var showFeelsLikeDetail = false
    @State private var showUVDetail = false
    @State private var showWindDetail = false
    @State private var showPrecipitationDetail = false
    @State private var showHumidityDetail = false
    @State private var showVisibilityDetail = false
    @State private var showPressureDetail = false
    @State private var showSolarDetail = false
    @State private var showMoonDetail = false

    
    init(
        selectedTab: Int,
        onViewChange: ((Int) -> Void)? = nil,
        onSavedRegionsPresentationChange: @escaping (Bool) -> Void = { _ in }
    ) {
        self.selectedTab = selectedTab
        self.onViewChange = onViewChange!
        self.onSavedRegionsPresentationChange = onSavedRegionsPresentationChange
        #if DEBUG
        _showSavedRegions = State(initialValue: ScreenshotMode.weatherPreviewSavedRegionsOpen)
        _showSolarDetail = State(initialValue: ScreenshotMode.weatherPreviewSolarDetail)
        _showMoonDetail = State(initialValue: ScreenshotMode.weatherPreviewMoonDetail)
        #endif
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

                    if !vm.weatherAlerts.isEmpty {
                        weatherAlertsSection
                            .padding(.horizontal, 16)
                    }
                    
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

                    // Keep the legal attribution and the final weather card
                    // above the shared draggable handle and bottom bar.
                    Spacer()
                        .frame(height: 96)
                        .accessibilityHidden(true)
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

            #if DEBUG
            if ScreenshotMode.weatherPreviewSolarCard {
                VStack {
                    Spacer()

                    SunsetCard(
                        sunrise: vm.sunriseTime,
                        sunset: vm.sunsetTime,
                        formatTime: vm.formatTime,
                        observationDate: weatherPreviewObservationDate
                    )
                    .frame(height: 132)
                    .padding(.horizontal, 16)

                    Spacer()
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(.black.opacity(0.18))
                .zIndex(200)
            }
            #endif
        }
        .navigationBarHidden(true)
        .onAppear {
            onSavedRegionsPresentationChange(showSavedRegions)
            guard !didRestoreSavedRegion else { return }
            didRestoreSavedRegion = true
            #if DEBUG
            if ScreenshotMode.weatherPreviewSavedRegionsOpen {
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.35) {
                    openSavedRegions()
                }
                return
            }
            #endif
            guard !weatherPreviewIsActive,
                  let selectedID = savedRegions.selectedRegionID,
                  let region = savedRegions.regions.first(where: { $0.id == selectedID }) else {
                return
            }
            selectSavedRegion(region)
        }
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
        .overlay {
            if showSavedRegions {
                savedRegionsScreen
                    .transition(.move(edge: .leading))
                    .zIndex(100)
            }
        }
        .animation(.easeInOut(duration: 0.34), value: showSavedRegions)

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
        .sheet(isPresented: $showSolarDetail) {
            SolarDetailSheet(
                days: vm.solarDayForecast,
                timeZone: vm.locationTimeZone,
                observationDate: weatherPreviewObservationDate ?? Date(),
                coordinate: vm.locationCoordinate
            )
        }
        .sheet(isPresented: $showMoonDetail) {
            MoonDetailSheet(
                forecastDays: vm.dailyForecast,
                timeZone: vm.locationTimeZone,
                observationDate: weatherPreviewObservationDate ?? Date()
            )
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
            if !weatherPreviewIsActive,
               let loc = location,
               !showSearchBar,
               geocodedCityName.isEmpty,
               !initialLoadComplete {
                vm.fetchWeatherForCoords(
                    latitude: loc.coordinate.latitude,
                    longitude: loc.coordinate.longitude,
                    isGPSLocation: true,
                    gpsDisplayName: locationManager.currentCityName
                )
                initialLoadComplete = true
            }
        }
        .onReceive(locationManager.$authorizationStatus) { status in
            if weatherPreviewIsActive {
                return
            } else if status == .authorizedWhenInUse || status == .authorizedAlways {
                if locationManager.currentLocation == nil {
                    locationManager.manager.requestLocation()
                } else if !initialLoadComplete && !showSearchBar && geocodedCityName.isEmpty {
                    vm.fetchWeatherForCoords(
                        latitude: locationManager.currentLocation!.coordinate.latitude,
                        longitude: locationManager.currentLocation!.coordinate.longitude,
                        isGPSLocation: true,
                        gpsDisplayName: locationManager.currentCityName
                    )
                    initialLoadComplete = true
                }
            } else if status == .denied || status == .restricted {
                vm.errorMessage = NSLocalizedString("Location access denied. Search for a city or grant access in Settings.", comment: "Location permission error")
                initialLoadComplete = true
            }
        }
        .onReceive(NotificationCenter.default.publisher(for: .openWeatherNotification)) { _ in
            selectCurrentLocation()
        }
        // The Weather experience has one intentional visual language. Keep
        // semantic labels, materials, controls and every presented subview on
        // the same palette regardless of the device's Light/Dark appearance.
        .colorScheme(.dark)
    }
    
    private var dynamicBackground: some View {
        WeatherSceneBackground(
            conditionKey: vm.currentConditionLocalizationKey,
            symbolName: vm.currentSymbol,
            sunrise: vm.sunriseTime,
            sunset: vm.sunsetTime,
            moonrise: vm.currentMoonEvents?.moonrise,
            moonset: vm.currentMoonEvents?.moonset,
            moonPhase: weatherPreviewMoonPhase ?? vm.currentMoonEvents?.phase.rawValue,
            precipitationType: vm.currentPrecipitationType,
            cloudCover: vm.currentCloudCover,
            windSpeedKPH: normalizedWindSpeedKPH(vm.currentWindSpeed),
            windGustKPH: normalizedWindSpeedKPH(vm.currentWindGust),
            windDirectionDegrees: vm.currentWindDirection?.degrees,
            observationDate: weatherPreviewObservationDate
        )
        .id("\(vm.currentConditionLocalizationKey)|\(vm.currentSymbol)|\(vm.currentPrecipitationType ?? "none")")
        .transition(.opacity)
        .animation(.easeInOut(duration: 0.8), value: vm.currentConditionLocalizationKey)
    }

    private func normalizedWindSpeedKPH(_ speed: Double?) -> Double? {
        guard let speed else { return nil }
        return GlobalState.measurementSystem == "Imperial" ? speed * 1.609_344 : speed
    }
    
    private var searchField: some View {
        HStack {
            TextField(
                "",
                text: $locationSearchVM.queryFragment,
                prompt: Text(NSLocalizedString("Search for a city…", comment: "City search placeholder"))
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
            if !showSearchBar {
                Button {
                    openSavedRegions()
                } label: {
                    Image(systemName: "list.bullet")
                        .font(.system(size: 22, weight: .medium))
                }
                .frame(width: 36, height: 36)
                .contentShape(Rectangle())
                .buttonStyle(.plain)
                .foregroundColor(.white)
                .accessibilityLabel(NSLocalizedString("Saved Regions", comment: "Saved weather regions"))
            }

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
                    Image(uiImage: CalendarSearchAppearance.iconImage)
                        .renderingMode(.template)
                }
                .frame(
                    width: CalendarSearchAppearance.buttonSize,
                    height: CalendarSearchAppearance.buttonSize
                )
                .contentShape(Rectangle())
                .buttonStyle(.plain)
                .foregroundColor(.white)

                UIMenuButtonRepresentable(
                    currentView: selectedTab,
                    tintColor: .white,
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

    private var savedRegionsScreen: some View {
        NavigationStack {
            ZStack {
                LinearGradient(
                    colors: savedRegionsBackgroundColors,
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                    .ignoresSafeArea()

                VStack(spacing: 12) {
                    savedRegionsSearchField

                    if !locationSearchVM.queryFragment.isEmpty {
                        savedRegionsSearchResults
                    } else {
                        ScrollView(.vertical, showsIndicators: false) {
                            VStack(spacing: 0) {
                                currentLocationCard

                                savedRegionDropPlaceholder(at: 0)

                                ForEach(Array(savedRegions.regions.enumerated()), id: \.element.id) { index, region in
                                    savedRegionListCard(
                                        region,
                                        isSelected: !isShowingUnsavedSearchLocation
                                            && savedRegions.selectedRegionID == region.id
                                    )
                                    savedRegionDropPlaceholder(at: index + 1)
                                }
                            }
                            // The saved-regions list has its own scroll view;
                            // reserve room for the shared draggable handle and
                            // bottom bar here as well.
                            .padding(.bottom, 120)
                        }
                        .refreshable {
                            await loadSavedRegionsWeather()
                        }
                    }
                }
                .padding(.horizontal, 14)
                .padding(.top, 8)
            }
            .toolbarBackground(.hidden, for: .navigationBar)
            .toolbarColorScheme(.dark, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button(NSLocalizedString("Done", comment: "Done button")) {
                        closeSavedRegions()
                    }
                    .font(.body.weight(.semibold))
                    .foregroundStyle(Color.white)
                }
            }
        }
        .task {
            await loadSavedRegionsWeather()
        }
        .background(savedRegionsBaseColor.ignoresSafeArea())
        .presentationBackground(savedRegionsBaseColor)
        .foregroundStyle(Color.white)
        .colorScheme(.dark)
    }

    private var savedRegionsBackgroundColors: [Color] {
        return [
            Color(red: 0.04, green: 0.12, blue: 0.22),
            Color(red: 0.04, green: 0.25, blue: 0.42),
            Color(red: 0.03, green: 0.13, blue: 0.24)
        ]
    }

    private var savedRegionsBaseColor: Color {
        Color(red: 0.04, green: 0.12, blue: 0.22)
    }

    private var currentLocationCard: some View {
        savedRegionWeatherCard(
            name: locationManager.currentCityName
                ?? NSLocalizedString("Current Location", comment: "Current weather location"),
            subtitle: regionLocalTime(timeZone: .current),
            summary: currentLocationWeather,
            isLoading: !finishedLoadingCurrentLocationWeather,
            isSelected: !isShowingUnsavedSearchLocation && savedRegions.selectedRegionID == nil,
            isCurrentLocation: true,
            reorderToken: nil,
            isDropTarget: false
        ) {
            selectCurrentLocation()
        }
    }

    @ViewBuilder
    private func savedRegionListCard(
        _ region: SavedWeatherRegion,
        isSelected: Bool
    ) -> some View {
        let card = savedRegionWeatherCard(
            name: region.name,
            subtitle: regionLocalTime(for: region),
            summary: savedRegionWeather[region.id],
            isLoading: !finishedLoadingRegionWeatherIDs.contains(region.id),
            isSelected: isSelected,
            isCurrentLocation: false,
            reorderToken: region.id.uuidString,
            isDropTarget: false
        ) {
            selectSavedRegion(region)
        }

        card.contextMenu {
            Button(role: .destructive) {
                let wasSelected = savedRegions.selectedRegionID == region.id
                savedRegions.remove(region.id)
                savedRegionWeather[region.id] = nil
                finishedLoadingRegionWeatherIDs.remove(region.id)
                if wasSelected {
                    selectCurrentLocation()
                }
            } label: {
                Label(NSLocalizedString("Delete", comment: "Delete action"), systemImage: "trash")
            }
        }
    }

    private func savedRegionDropPlaceholder(at insertionIndex: Int) -> some View {
        let isActive = savedRegionInsertionIndex == insertionIndex

        return ZStack {
            RoundedRectangle(cornerRadius: 27, style: .continuous)
                .fill(Color.white.opacity(0.08))
                .overlay {
                    RoundedRectangle(cornerRadius: 27, style: .continuous)
                        .strokeBorder(
                            Color.white.opacity(0.72),
                            style: StrokeStyle(lineWidth: 2, dash: [10, 8])
                        )
                }
                .overlay {
                    Image(systemName: "arrow.down.to.line.compact")
                        .font(.system(size: 28, weight: .semibold))
                        .foregroundStyle(Color.white.opacity(0.86))
                }
                .frame(height: 170)
                .opacity(isActive ? 1 : 0)
        }
        .frame(maxWidth: .infinity)
        // The active row reserves the full card height plus the same 14-point
        // separation on both sides. Clipping keeps the animated placeholder
        // inside that reserved row instead of drawing over its neighbours.
        .frame(height: isActive ? 198 : 14)
        .clipped()
        .background(Color.primary.opacity(0.001))
        .contentShape(Rectangle())
        .dropDestination(for: String.self) { items, _ in
            guard let value = items.first,
                  let draggedID = UUID(uuidString: value) else {
                return false
            }
            withAnimation(.snappy(duration: 0.28)) {
                savedRegions.move(draggedID, toInsertionIndex: insertionIndex)
                savedRegionInsertionIndex = nil
            }
            return true
        } isTargeted: { isTargeted in
            withAnimation(.snappy(duration: 0.22)) {
                if isTargeted {
                    savedRegionInsertionIndex = insertionIndex
                } else if savedRegionInsertionIndex == insertionIndex {
                    savedRegionInsertionIndex = nil
                }
            }
        }
        .animation(.snappy(duration: 0.22), value: isActive)
    }

    private var savedRegionsSearchField: some View {
        HStack(spacing: 10) {
            Image(systemName: "magnifyingglass")
                .foregroundStyle(Color.primary.opacity(0.78))
            TextField(
                "",
                text: $locationSearchVM.queryFragment,
                prompt: Text(NSLocalizedString("Search for a city…", comment: "City search placeholder"))
                    .foregroundStyle(Color.secondary)
            )
            .textInputAutocapitalization(.never)
            .autocorrectionDisabled(true)
            .foregroundStyle(Color.primary)

            if !locationSearchVM.queryFragment.isEmpty {
                Button {
                    locationSearchVM.queryFragment = ""
                } label: {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundStyle(Color.secondary)
                }
                .buttonStyle(.plain)
            }
        }
        .padding(.horizontal, 14)
        .frame(height: 48)
        .background(savedRegionsSearchBackground, in: Capsule())
        .overlay {
            Capsule()
                .stroke(Color.white.opacity(0.10), lineWidth: 1)
        }
        .shadow(color: .black.opacity(0.12), radius: 8, y: 3)
    }

    private var savedRegionsSearchBackground: Color {
        Color.black.opacity(0.32)
    }

    private var savedRegionsSearchResults: some View {
        ScrollView {
            LazyVStack(spacing: 0) {
                ForEach(locationSearchVM.searchResults, id: \.self) { completion in
                    Button {
                        Task {
                            await locationSearchVM.selectCompletion(completion)
                            if let placemark = locationSearchVM.selectedPlacemark {
                                handleSelectedLocation(placemark: placemark, saveRegion: true)
                                locationSearchVM.queryFragment = ""
                                await loadSavedRegionsWeather()
                            }
                        }
                    } label: {
                        HStack(spacing: 12) {
                            Image(systemName: "mappin.circle.fill")
                                .foregroundStyle(Color.accentColor.opacity(0.86))
                            VStack(alignment: .leading, spacing: 2) {
                                Text(completion.title)
                                    .foregroundStyle(Color.primary)
                                if !completion.subtitle.isEmpty {
                                    Text(completion.subtitle)
                                        .font(.caption)
                                        .foregroundStyle(Color.secondary)
                                }
                            }
                            Spacer()
                            Image(systemName: "plus.circle")
                                .foregroundStyle(Color.accentColor.opacity(0.84))
                        }
                        .padding(.horizontal, 14)
                        .frame(minHeight: 58)
                    }
                    .buttonStyle(.plain)
                    if completion != locationSearchVM.searchResults.last {
                        Divider().overlay(Color.primary.opacity(0.10))
                    }
                }
            }
            .padding(.bottom, 120)
        }
        .background(
            Color.black.opacity(0.26),
            in: RoundedRectangle(cornerRadius: 18, style: .continuous)
        )
        .overlay {
            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .stroke(Color.primary.opacity(0.08), lineWidth: 1)
        }
    }

    @ViewBuilder
    private func savedRegionWeatherCard(
        name: String,
        subtitle: String,
        summary: SavedRegionWeatherSummary?,
        isLoading: Bool,
        isSelected: Bool,
        isCurrentLocation: Bool,
        reorderToken: String?,
        isDropTarget: Bool,
        action: @escaping () -> Void
    ) -> some View {
        let card = Button(action: action) {
            ZStack {
                savedRegionCardBackground(summary)

                HStack(alignment: .top, spacing: 12) {
                    VStack(alignment: .leading, spacing: 5) {
                        HStack(spacing: 7) {
                            Text(name)
                                .font(.title2.weight(.bold))
                                .lineLimit(1)
                            if isSelected {
                                Image(systemName: "checkmark.circle.fill")
                                    .font(.subheadline)
                            }
                        }
                        if isCurrentLocation {
                            Label(
                                NSLocalizedString("Current Location", comment: "Current GPS weather location"),
                                systemImage: "location.fill"
                            )
                            .font(.caption2.weight(.bold))
                            .padding(.horizontal, 8)
                            .padding(.vertical, 4)
                            .background(.black.opacity(0.22), in: Capsule())
                        }
                        Text(subtitle)
                            .font(.subheadline.weight(.medium))
                            .foregroundStyle(.white.opacity(0.84))

                        Spacer(minLength: 18)

                        if let alert = summary?.alertSummary, !alert.isEmpty {
                            Label(alert, systemImage: "exclamationmark.triangle.fill")
                                .font(.caption.weight(.semibold))
                                .lineLimit(2)
                        } else {
                            Text(summary?.condition ?? "—")
                                .font(.subheadline.weight(.medium))
                                .lineLimit(1)
                        }
                    }

                    Spacer(minLength: 8)

                    VStack(alignment: .trailing, spacing: 8) {
                        if let summary {
                            Text(localizedFormat("%d°", Int(summary.temperature.rounded())))
                                .font(.system(size: 56, weight: .light, design: .rounded))
                                .monospacedDigit()
                            Text(
                                localizedFormat(
                                    NSLocalizedString(
                                        "HighLowLabelFormat",
                                        comment: "High and low temperature label"
                                    ),
                                    Int(summary.highTemperature.rounded()),
                                    Int(summary.lowTemperature.rounded())
                                )
                            )
                            .font(.subheadline.weight(.semibold))
                            .monospacedDigit()
                        } else if isLoading {
                            ProgressView()
                                .tint(.white)
                                .frame(width: 56, height: 56)
                        } else {
                            Text("—")
                                .font(.system(size: 48, weight: .light))
                                .frame(width: 56, height: 56)
                        }

                        if reorderToken != nil {
                            Image(systemName: "line.3.horizontal")
                                .font(.body.weight(.semibold))
                                .foregroundStyle(.white.opacity(0.74))
                                .frame(width: 40, height: 28)
                                .contentShape(Rectangle())
                                .accessibilityLabel(
                                    NSLocalizedString("Reorder Region", comment: "Reorder a saved weather region")
                                )
                        }
                    }
                }
                .foregroundStyle(.white)
                .padding(17)
            }
            .frame(height: 170)
            .clipShape(RoundedRectangle(cornerRadius: 27, style: .continuous))
            .overlay {
                RoundedRectangle(cornerRadius: 27, style: .continuous)
                    .stroke(
                        isDropTarget ? Color.cyan.opacity(0.95) : Color.white.opacity(isSelected ? 0.60 : 0.14),
                        lineWidth: isDropTarget ? 3 : (isSelected ? 2 : 1)
                    )
            }
            .shadow(color: .black.opacity(0.22), radius: 10, y: 5)
        }
        .buttonStyle(.plain)

        if let reorderToken {
            card.draggable(reorderToken)
        } else {
            card
        }
    }

    private func savedRegionCardBackground(_ summary: SavedRegionWeatherSummary?) -> some View {
        let key = summary?.conditionKey.lowercased() ?? ""
        let colors: [Color]
        if summary?.isDaylight == false {
            colors = [Color(red: 0.10, green: 0.18, blue: 0.30), Color(red: 0.03, green: 0.07, blue: 0.14)]
        } else if key.contains("clear") || key.contains("hot") {
            colors = [Color(red: 0.39, green: 0.69, blue: 0.92), Color(red: 0.18, green: 0.45, blue: 0.73)]
        } else if key.contains("thunder") || key.contains("storm") || key.contains("hurricane") {
            colors = [Color(red: 0.25, green: 0.31, blue: 0.39), Color(red: 0.08, green: 0.12, blue: 0.18)]
        } else if key.contains("rain") || key.contains("drizzle") {
            colors = [Color(red: 0.31, green: 0.52, blue: 0.65), Color(red: 0.12, green: 0.27, blue: 0.40)]
        } else if key.contains("snow") || key.contains("sleet") || key.contains("frigid") {
            colors = [Color(red: 0.55, green: 0.72, blue: 0.84), Color(red: 0.28, green: 0.48, blue: 0.65)]
        } else {
            colors = [Color(red: 0.35, green: 0.56, blue: 0.71), Color(red: 0.16, green: 0.34, blue: 0.49)]
        }

        return ZStack {
            LinearGradient(colors: colors, startPoint: .topLeading, endPoint: .bottomTrailing)
            Circle()
                .fill(.white.opacity(0.11))
                .frame(width: 150, height: 150)
                .blur(radius: 20)
                .offset(x: 125, y: -55)
            if let symbolName = summary?.symbolName {
                Image(systemName: symbolName)
                    .font(.system(size: 92, weight: .thin))
                    .symbolRenderingMode(.hierarchical)
                    .foregroundStyle(.white.opacity(0.12))
                    .offset(x: 112, y: 24)
            }
        }
    }

    private func regionLocalTime(for region: SavedWeatherRegion) -> String {
        regionLocalTime(
            timeZone: region.timeZoneIdentifier.flatMap(TimeZone.init(identifier:)) ?? .current
        )
    }

    private func regionLocalTime(timeZone: TimeZone) -> String {
        appTimeFormatter(timeZone: timeZone).string(from: Date())
    }

    private func loadSavedRegionsWeather() async {
        let regions = savedRegions.regions
        let service = WeatherService.shared
        let usesFahrenheit = GlobalState.temperatureUnit == UnitTemperature.fahrenheit.symbol

        #if DEBUG
        if ScreenshotMode.weatherPreviewSavedRegionsOpen {
            let previewConditions: [(String, String, Double, Double, Double)] = [
                ("WeatherCondition.clear", "sun.max.fill", 32, 17, 32),
                ("WeatherCondition.partlyCloudy", "cloud.sun.fill", 27, 16, 29),
                ("WeatherCondition.cloudy", "cloud.fill", 14, 14, 21),
                ("WeatherCondition.rain", "cloud.rain.fill", 19, 13, 22)
            ]
            for (index, region) in regions.enumerated() {
                let item = previewConditions[index % previewConditions.count]
                savedRegionWeather[region.id] = SavedRegionWeatherSummary(
                    temperature: item.2,
                    lowTemperature: item.3,
                    highTemperature: item.4,
                    condition: NSLocalizedString(item.0, comment: "Preview saved region condition"),
                    conditionKey: item.0,
                    symbolName: item.1,
                    alertSummary: index == 0
                        ? NSLocalizedString("WeatherAlert.Preview.HighTemperature", comment: "Preview high temperature alert")
                        : nil,
                    isDaylight: index != 2
                )
                finishedLoadingRegionWeatherIDs.insert(region.id)
            }
            finishedLoadingCurrentLocationWeather = true
            return
        }
        #endif

        finishedLoadingRegionWeatherIDs.subtract(regions.map(\.id))
        finishedLoadingCurrentLocationWeather = locationManager.currentLocation == nil

        await withTaskGroup(of: (UUID, SavedRegionWeatherSummary?).self) { group in
            for region in regions {
                group.addTask {
                    let location = CLLocation(latitude: region.latitude, longitude: region.longitude)
                    do {
                        let (current, daily, alerts) = try await service.weather(
                            for: location,
                            including: .current, .daily, .alerts
                        )
                        return (
                            region.id,
                            Self.makeSavedRegionWeatherSummary(
                                current: current,
                                daily: daily.forecast,
                                alerts: alerts,
                                usesFahrenheit: usesFahrenheit
                            )
                        )
                    } catch {
                        return (region.id, nil)
                    }
                }
            }

            for await (id, summary) in group {
                if let summary {
                    savedRegionWeather[id] = summary
                }
                finishedLoadingRegionWeatherIDs.insert(id)
            }
        }

        if let location = locationManager.currentLocation {
            do {
                let (current, daily, alerts) = try await service.weather(
                    for: location,
                    including: .current, .daily, .alerts
                )
                currentLocationWeather = Self.makeSavedRegionWeatherSummary(
                    current: current,
                    daily: daily.forecast,
                    alerts: alerts,
                    usesFahrenheit: usesFahrenheit
                )
            } catch {
                currentLocationWeather = nil
            }
            finishedLoadingCurrentLocationWeather = true
        }
    }

    private nonisolated static func makeSavedRegionWeatherSummary(
        current: CurrentWeather,
        daily: [DayWeather],
        alerts: [WeatherAlert]?,
        usesFahrenheit: Bool
    ) -> SavedRegionWeatherSummary {
        let tempUnit: UnitTemperature = usesFahrenheit ? .fahrenheit : .celsius
        let day = daily.first
        let conditionKey = "WeatherCondition.\(current.condition.rawValue)"
        return SavedRegionWeatherSummary(
            temperature: current.temperature.converted(to: tempUnit).value,
            lowTemperature: day?.lowTemperature.converted(to: tempUnit).value ?? current.temperature.converted(to: tempUnit).value,
            highTemperature: day?.highTemperature.converted(to: tempUnit).value ?? current.temperature.converted(to: tempUnit).value,
            condition: NSLocalizedString(conditionKey, comment: "Saved region weather condition"),
            conditionKey: conditionKey,
            symbolName: current.symbolName,
            alertSummary: alerts?.first?.summary,
            isDaylight: current.isDaylight
        )
    }

    private func selectSavedRegion(_ region: SavedWeatherRegion) {
        isShowingUnsavedSearchLocation = false
        savedRegions.select(region.id)
        geocodedCityName = region.name
        if let identifier = region.timeZoneIdentifier,
           let timeZone = TimeZone(identifier: identifier) {
            vm.setTimeZone(timeZone)
        }
        vm.clearWeatherData()
        vm.fetchWeatherForCoords(latitude: region.latitude, longitude: region.longitude)
        initialLoadComplete = true
    }

    private func selectCurrentLocation() {
        isShowingUnsavedSearchLocation = false
        savedRegions.select(nil)
        geocodedCityName = ""
        vm.clearWeatherData()
        guard let location = locationManager.currentLocation else {
            locationManager.manager.requestLocation()
            initialLoadComplete = false
            return
        }
        vm.fetchWeatherForCoords(
            latitude: location.coordinate.latitude,
            longitude: location.coordinate.longitude,
            isGPSLocation: true,
            gpsDisplayName: locationManager.currentCityName
        )
        initialLoadComplete = true
    }
    
    private var searchResultsOverlay: some View {
        Group {
            if showSearchBar && isEditing && !locationSearchVM.searchResults.isEmpty {
                List(locationSearchVM.searchResults, id: \.self) { completion in
                    Button {
                        Task {
                            await locationSearchVM.selectCompletion(completion)
                            if let placemark = locationSearchVM.selectedPlacemark {
                                handleSelectedLocation(placemark: placemark, saveRegion: false)
                            }
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
    private var weatherAlertsSection: some View {
        VStack(spacing: 10) {
            ForEach(vm.weatherAlerts) { alert in
                weatherAlertCard(alert)
            }
        }
    }

    @ViewBuilder
    private func weatherAlertCard(_ alert: WeatherAlertDisplayItem) -> some View {
        let content = HStack(alignment: .top, spacing: 12) {
            Image(systemName: alert.severity == .extreme ? "exclamationmark.triangle.fill" : "exclamationmark.shield.fill")
                .font(.system(size: 22, weight: .semibold))
                .foregroundStyle(weatherAlertAccent(alert.severity))
                .frame(width: 28)

            VStack(alignment: .leading, spacing: 4) {
                HStack(spacing: 8) {
                    Text(weatherAlertSeverityTitle(alert.severity))
                        .font(.caption.weight(.bold))
                        .textCase(.uppercase)
                    Spacer(minLength: 8)
                    Text(alert.source)
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                        .lineLimit(1)
                }

                Text(alert.summary)
                    .font(.subheadline.weight(.semibold))
                    .multilineTextAlignment(.leading)

                if let region = alert.region, !region.isEmpty {
                    Label(region, systemImage: "mappin.and.ellipse")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }
        }
        .foregroundStyle(.primary)
        .padding(14)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(
            weatherAlertAccent(alert.severity).opacity(0.16),
            in: RoundedRectangle(cornerRadius: 14, style: .continuous)
        )
        .overlay {
            RoundedRectangle(cornerRadius: 14, style: .continuous)
                .stroke(weatherAlertAccent(alert.severity).opacity(0.55), lineWidth: 1)
        }

        if let detailsURL = alert.detailsURL {
            Link(destination: detailsURL) { content }
                .buttonStyle(.plain)
        } else {
            content
        }
    }

    private func weatherAlertAccent(_ severity: WeatherSeverity) -> Color {
        switch severity {
        case .extreme: return .red
        case .severe: return .orange
        case .moderate: return .yellow
        case .minor: return .blue
        case .unknown: return .gray
        @unknown default: return .gray
        }
    }

    private func weatherAlertSeverityTitle(_ severity: WeatherSeverity) -> String {
        // WeatherKit supplies this label already localized by the system. It
        // therefore follows every supported app language, including future
        // languages, without maintaining a second translation table here.
        severity.description
    }

    private var currentWeatherHeader: some View {
        VStack(spacing: 10) {
            Text(displayedCityName())
                .font(.system(size: 34, weight: .regular))
                .foregroundColor(.white)
                .adaptiveSingleLine(minimumScale: 0.5)
            HStack(alignment: .lastTextBaseline, spacing: 8) {
                if let temp = vm.currentTemp {
                    Text(localizedFormat("%d°", Int(temp.rounded())))
                        .font(.system(size: 96, weight: .thin))
                        .foregroundColor(.white)
                } else {
                    Text("—°")
                        .font(.system(size: 96, weight: .thin))
                        .foregroundColor(.white)
                }
            }
            .frame(maxWidth: .infinity, alignment: .center)
            Text(vm.currentCondition)
                .foregroundColor(.white.opacity(0.62))
                .font(.system(size: 18, weight: .medium))
                .adaptiveSingleLine(minimumScale: 0.45)
            if let hi = vm.todayMaxTemp, let lo = vm.todayMinTemp {
                Text(localizedFormat(NSLocalizedString("HighLowLabelFormat", comment: "High and low temperature label"),
                    Int(hi.rounded()),
                    Int(lo.rounded())
                ))
                    .foregroundColor(.white)
                    .font(.system(size: 18, weight: .medium))
                    .adaptiveSingleLine(minimumScale: 0.5)
            }
        }
        .padding(.vertical, 10)
    }
    
    private var tenDayForecastCard: some View {
        VStack(alignment: .leading, spacing: 0) {
            Label("10-DAY FORECAST", systemImage: "calendar")
                .font(.system(size: 10, weight: .medium))
                .foregroundStyle(.secondary)
                .adaptiveSingleLine(minimumScale: 0.4)
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
        .colorScheme(.dark)
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
                .adaptiveSingleLine(minimumScale: 0.45)
                .frame(width: 55, alignment: .leading)
            HStack(spacing: 5) {
                Image(systemName: dayItem.symbol)
                    .symbolVariant(.fill)
                    .symbolRenderingMode(.multicolor)
                    .font(.title3)
                    .frame(width: 30)
                if let chance = dayItem.precipChance, chance >= 0.1 {
                    Text(localizedFormat("%d%%", Int((chance * 100).rounded())))
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundColor(weatherPrecipitationAccent)
                        .frame(width: 35)
                } else {
                    Spacer().frame(width: 35)
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            
            Text(localizedFormat("%d°", Int(dayItem.minTemp.rounded())))
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
            
            Text(localizedFormat("%d°", Int(dayItem.maxTemp.rounded())))
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
                formatTime: vm.formatTime,
                observationDate: weatherPreviewObservationDate
            )
            .contentShape(Rectangle())
            .onTapGesture {
                showSolarDetail = true
            }
            MoonCard(
                moonEvents: vm.currentMoonEvents
            )
            .contentShape(Rectangle())
            .onTapGesture {
                showMoonDetail = true
            }
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
        if weatherPreviewIsActive {
            return "Weather Preview"
        }
        if !geocodedCityName.isEmpty {
            return geocodedCityName
        }
        return locationManager.currentCityName ?? NSLocalizedString("Loading...", comment: "Loading fallback")
    }

    private var weatherPreviewIsActive: Bool {
        #if DEBUG
        ScreenshotMode.weatherPreviewCondition != nil
        #else
        false
        #endif
    }

    private var weatherPreviewObservationDate: Date? {
        #if DEBUG
        var calendar = Calendar.current
        calendar.timeZone = vm.locationTimeZone
        switch ScreenshotMode.weatherPreviewSky {
        case "day":
            return calendar.date(bySettingHour: 13, minute: 27, second: 0, of: Date())
        case "night":
            return calendar.date(bySettingHour: 23, minute: 12, second: 0, of: Date())
        case "sunrise":
            return calendar.date(bySettingHour: 6, minute: 22, second: 0, of: Date())
        case "sunset":
            return calendar.date(bySettingHour: 20, minute: 20, second: 0, of: Date())
        default:
            return nil
        }
        #else
        nil
        #endif
    }

    private var weatherPreviewMoonPhase: String? {
        #if DEBUG
        guard ScreenshotMode.weatherPreviewSky == "night" else { return nil }
        return ScreenshotMode.weatherPreviewMoonPhase ?? "waxingGibbous"
        #else
        nil
        #endif
    }

    private var weatherBackgroundIsNight: Bool {
        let date = weatherPreviewObservationDate ?? Date()
        if let sunrise = vm.sunriseTime,
           let sunset = vm.sunsetTime,
           sunset > sunrise {
            return date < sunrise || date >= sunset
        }
        let symbol = vm.currentSymbol.lowercased()
        return symbol.contains("moon") || symbol.contains("night")
    }

    private func refreshWeatherData() {
        vm.clearWeatherData()
        initialLoadComplete = false

        if let selectedID = savedRegions.selectedRegionID,
           let region = savedRegions.regions.first(where: { $0.id == selectedID }) {
            selectSavedRegion(region)
        } else if let loc = locationManager.currentLocation {
            vm.fetchWeatherForCoords(
                latitude: loc.coordinate.latitude,
                longitude: loc.coordinate.longitude,
                isGPSLocation: true,
                gpsDisplayName: locationManager.currentCityName
            )
            initialLoadComplete = true
        } else {
            locationManager.manager.requestLocation()
            vm.errorMessage = NSLocalizedString("Cannot refresh. Location unknown.", comment: "Weather refresh error")
            initialLoadComplete = true
        }
        
        if showSearchBar { hideSearch() }
    }
    
    private func handleSelectedLocation(
        placemark: MKPlacemark,
        saveRegion: Bool
    ) {
        vm.clearWeatherData()
        let coords = placemark.coordinate
        let city = locationSearchVM.selectedSearchTitle
            ?? placemark.locality
            ?? placemark.administrativeArea
            ?? placemark.name
            ?? NSLocalizedString("Selected Location", comment: "Selected location fallback")
        if saveRegion {
            isShowingUnsavedSearchLocation = false
            let savedRegion = savedRegions.save(
                name: city,
                subtitle: locationSearchVM.selectedSearchSubtitle,
                coordinate: coords,
                timeZone: locationSearchVM.selectedTimeZone ?? placemark.timeZone
            )
            geocodedCityName = savedRegion.name
        } else {
            isShowingUnsavedSearchLocation = true
            geocodedCityName = city
            if let timeZone = locationSearchVM.selectedTimeZone ?? placemark.timeZone {
                vm.setTimeZone(timeZone)
            }
        }
        vm.fetchWeatherForCoords(latitude: coords.latitude, longitude: coords.longitude)
        initialLoadComplete = true

        if saveRegion {
            locationSearchVM.queryFragment = ""
            locationSearchVM.searchResults = []
            isEditing = false
            isSearchFieldFocused = false
            hideKeyboard()
        } else {
            hideSearch()
        }
    }

    private func openSavedRegions() {
        hideKeyboard()
        onSavedRegionsPresentationChange(true)
        withAnimation(.easeInOut(duration: 0.34)) {
            showSavedRegions = true
        }
    }

    private func closeSavedRegions() {
        locationSearchVM.queryFragment = ""
        locationSearchVM.searchResults = []
        isEditing = false
        isSearchFieldFocused = false
        hideKeyboard()
        onSavedRegionsPresentationChange(false)
        withAnimation(.easeInOut(duration: 0.34)) {
            showSavedRegions = false
        }
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
                timeString = localizedFormat(format, nextDayPrecip.day)
            } else {
                let format = NSLocalizedString("in_days", comment: "Precipitation forecast in X days")
                timeString = localizedFormat(format, daysUntil)
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
        let semanticDirection: UISemanticContentAttribute =
            context.environment.layoutDirection == .rightToLeft ? .forceRightToLeft : .forceLeftToRight
        scrollView.semanticContentAttribute = semanticDirection
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
        host.view.semanticContentAttribute = semanticDirection
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
        let semanticDirection: UISemanticContentAttribute =
            context.environment.layoutDirection == .rightToLeft ? .forceRightToLeft : .forceLeftToRight
        uiView.semanticContentAttribute = semanticDirection
        // само заменяме корена на host-а
        if let host = uiView.subviews.compactMap({ $0.next as? UIHostingController<Content> }).first {
            host.view.semanticContentAttribute = semanticDirection
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
            Link(NSLocalizedString("Data provided by Apple Weather", comment: "Weather attribution link"), destination: URL(string: "https://weatherkit.apple.com/legal-attribution.html")!)
                .font(.footnote)
                .underline()
        }
        .foregroundColor(.white.opacity(0.62))
        .frame(maxWidth: .infinity)
    }
}

// MARK: - HourlyForecastCard
struct HourlyForecastCard: View {
    @ObservedObject var vm: WeatherKitViewModel
    var onHourTap: (Int) -> Void

    private var isAnyPrecip: Bool {
        vm.next24HourlyForecast.contains { $0.precipChance >= 0.1 }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            HourlyStrip(
                hours: vm.next24HourlyForecast,
                solarEvents: vm.next24SolarEvents,
                timeZone: vm.locationTimeZone,
                isAnyPrecip: isAnyPrecip,
                onHourTap: onHourTap
            )
            .frame(height: 120)

            HStack(spacing: 4) {
                Image(systemName: "info.circle")
                    .font(.system(size: 12))
                Text(NSLocalizedString("Tap an hour to quickly add a calendar event.", comment: "Hourly forecast tap hint"))
                    .font(.caption)
            }
            .foregroundStyle(.secondary)
            .padding(.horizontal, 15)
            .padding(.bottom, 5)
        }
        .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 12))
        .colorScheme(.dark)
    }
}

// MARK: - HourlyStrip
private struct HourlyStrip: View {
    let hours: [HourlyForecastItem]
    let solarEvents: [SolarForecastEvent]
    let timeZone: TimeZone
    let isAnyPrecip: Bool
    let onHourTap: (Int) -> Void

    private var entries: [HourlyStripEntry] {
        let hourEntries = hours.map(HourlyStripEntry.hour)
        let solarEntries = solarEvents.map(HourlyStripEntry.solar)
        return (hourEntries + solarEntries).sorted { lhs, rhs in
            if lhs.date == rhs.date { return lhs.sortPriority < rhs.sortPriority }
            return lhs.date < rhs.date
        }
    }

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 25) {
                ForEach(entries) { entry in
                    switch entry {
                    case .hour(let hour):
                        HourlyCell(
                            item: hour,
                            isAnyPrecip: isAnyPrecip
                        )
                        .contentShape(Rectangle())
                        .onTapGesture {
                            var calendar = Calendar.current
                            calendar.timeZone = timeZone
                            onHourTap(calendar.component(.hour, from: hour.date))
                        }
                    case .solar(let event):
                        SolarForecastCell(
                            event: event,
                            timeZone: timeZone,
                            reservesPrecipitationRow: isAnyPrecip
                        )
                    }
                }
            }
            .padding(.horizontal, 15)
            .padding(.vertical, 12)
        }
        .scrollIndicators(.hidden)
    }
}

private enum HourlyStripEntry: Identifiable {
    case hour(HourlyForecastItem)
    case solar(SolarForecastEvent)

    var id: String {
        switch self {
        case .hour(let item): return "hour-\(item.id.timeIntervalSinceReferenceDate)"
        case .solar(let event): return "solar-\(event.id)"
        }
    }

    var date: Date {
        switch self {
        case .hour(let item): return item.date
        case .solar(let event): return event.date
        }
    }

    var sortPriority: Int {
        switch self {
        case .hour: return 0
        case .solar: return 1
        }
    }
}

private struct SolarForecastCell: View {
    let event: SolarForecastEvent
    let timeZone: TimeZone
    let reservesPrecipitationRow: Bool

    private var formattedTime: String {
        let formatter = DateFormatter()
        formatter.locale = .current
        formatter.timeZone = timeZone
        formatter.setLocalizedDateFormatFromTemplate("jm")
        return formatter.string(from: event.date)
    }

    var body: some View {
        VStack(spacing: 8) {
            Text(event.kind.localizedTitle)
                .font(.system(size: 14, weight: .medium))
                .adaptiveSingleLine(minimumScale: 0.55)
                .frame(height: 17)

            Image(systemName: event.kind.symbolName)
                .symbolRenderingMode(.multicolor)
                .font(.title2)
                .frame(height: 30)

            if reservesPrecipitationRow {
                Text(" ")
                    .font(.system(size: 12, weight: .medium))
            }

            Text(formattedTime)
                .font(.system(size: 18, weight: .medium))
                .adaptiveSingleLine(minimumScale: 0.6)
                .frame(height: 22)
        }
        .frame(minWidth: 52, idealWidth: 62, maxWidth: 74)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("\(event.kind.localizedTitle), \(formattedTime)")
    }
}


// MARK: - HourlyCell
private struct HourlyCell: View {
    let item: HourlyForecastItem
    let isAnyPrecip: Bool

    var body: some View {
        VStack(spacing: 8) {
            Text(item.hour)
                .font(.system(size: 14, weight: .medium))
                .frame(height: 17)

            Image(systemName: item.symbol)
                .symbolVariant(.fill)
                .symbolRenderingMode(.multicolor)
                .font(.title2)
                .frame(height: 30)
                .offset(y: item.symbol == "cloud.fill" ? -5 : 0)

            if isAnyPrecip {
                Text(
                    item.precipChance >= 0.1
                        ? localizedFormat("%d%%", Int(item.precipChance * 100))
                        : " "
                )
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(weatherPrecipitationAccent)
            }

            Text(localizedFormat("%d°", Int(item.temp.rounded())))
                .font(.system(size: 18, weight: .medium))
                .frame(height: 22)
        }
        .frame(minWidth: 25, idealWidth: 35, maxWidth: 45)
        .contentShape(Rectangle())
    }
}
