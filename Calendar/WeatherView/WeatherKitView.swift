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
    @State private var isEditing = false  // controls when suggestions list appears
    @State private var geocodedCityName = "" // Store city name from search results
    @State private var selectedDay: DayForecastItem? = nil // For daily forecast sheet

    // Track if initial load is done to prevent flicker/multiple loads
    @State private var initialLoadComplete = false

    var body: some View {
        ZStack(alignment: .top) {

            // 1) Background gradient
            LinearGradient(
                gradient: Gradient(colors: [
                    Color.blue.opacity(0.6), // Slightly adjusted opacity
                    Color.gray.opacity(0.5)
                ]),
                startPoint: .topLeading, // Diagonal gradient
                endPoint: .bottomTrailing
            )
            .edgesIgnoringSafeArea(.all)

            // 2) ScrollView for main content
            ScrollView(.vertical, showsIndicators: false) {
                VStack(spacing: 20) { // Consistent spacing for major sections

                    // ---------- TOP BAR (Now part of ScrollView) ----------
                    topBar
                        .padding(.top, 5) // Add slight padding from safe area edge

                    // ---------- MAIN WEATHER CONTENT ----------
                    // Use a Group to avoid too many nested VStacks if needed
                    Group {
                        // --- Current Weather Header ---
                        currentWeatherHeader

                        // --- Hourly Forecast Card ---
                        hourlyForecastCard
                            .padding(.horizontal, 16)

                        // --- 10-Day Forecast Card ---
                        tenDayForecastCard
                            .padding(.horizontal, 16)

                        // --- Today's Details Grid ---
                        todayDetailsGrid
                            .padding(.horizontal, 16)

                        // --- Error Message Display ---
                        if let error = vm.errorMessage {
                            Text(error)
                                .foregroundColor(.yellow) // More visible error color
                                .padding()
                                .frame(maxWidth: .infinity)
                                .background(.red.opacity(0.6))
                                .clipShape(RoundedRectangle(cornerRadius: 8))
                                .padding(.horizontal, 16)
                        }
                    } // End Group

                    Spacer().frame(height: 40) // Bottom spacer inside ScrollView
                }
            }
            .refreshable { // Pull to refresh
                refreshWeatherData()
            }
            // ---------- End ScrollView ----------

            // 3) Search Results Overlay (appears above ScrollView)
            searchResultsOverlay
        }
        // ---------- Sheets and Data Handling ----------
        .sheet(item: $selectedDay) { day in
            DayDetailSheetView(day: day)
                .presentationDetents([.medium]) // Start with medium detent
        }
        .onReceive(locationManager.$currentLocation) { location in
            // Fetch weather only if search is not active and initial load needed
            if let loc = location, !showSearchBar, geocodedCityName.isEmpty, !initialLoadComplete {
                vm.fetchWeatherForCoords(latitude: loc.coordinate.latitude, longitude: loc.coordinate.longitude)
                initialLoadComplete = true // Mark initial load done
            }
        }
        .onReceive(locationSearchVM.$selectedPlacemark) { placemark in
            guard let placemark = placemark else { return }
            handleSelectedLocation(placemark: placemark)
        }
        // Handle authorization changes
        .onReceive(locationManager.$authorizationStatus) { status in
             if status == .authorizedWhenInUse || status == .authorizedAlways {
                 // If authorized, and no location yet, try fetching again
                 if locationManager.currentLocation == nil {
                     locationManager.manager.requestLocation() // Request one-time update
                 } else if !initialLoadComplete && !showSearchBar && geocodedCityName.isEmpty {
                     // Or if location exists but initial load didn't happen (e.g., granted later)
                     vm.fetchWeatherForCoords(latitude: locationManager.currentLocation!.coordinate.latitude,
                                              longitude: locationManager.currentLocation!.coordinate.longitude)
                     initialLoadComplete = true
                 }
             } else if status == .denied || status == .restricted {
                 // Handle denial - maybe show a message or default location?
                 vm.errorMessage = "Location access denied. Search for a city or grant access in Settings."
                 initialLoadComplete = true // Prevent further automatic attempts
             }
        }
    }

    // MARK: - Computed Views / Subviews

    private var topBar: some View {
        HStack {
            if showSearchBar {
                searchField
            } else {
                searchButton
            }
            Spacer()
            refreshButton
        }
        .padding(.horizontal) // Standard horizontal padding
    }

    private var searchField: some View {
        HStack(spacing: 8) {
            Image(systemName: "magnifyingglass") // Icon inside text field area
                 .foregroundColor(.secondary)

            TextField("Search for a city...",
                      text: $locationSearchVM.queryFragment,
                      onEditingChanged: { editing in
                          withAnimation(.easeInOut) { isEditing = editing }
                      },
                      onCommit: { // Optional: perform search on return key
                          isEditing = false
                      })
                .textFieldStyle(.plain) // Use plain style for better integration
                .autocorrectionDisabled(true)

            // Clear button inside text field area
            if !locationSearchVM.queryFragment.isEmpty {
                 Button { locationSearchVM.queryFragment = "" } label: {
                      Image(systemName: "xmark.circle.fill")
                           .foregroundColor(.secondary)
                 }
            }
        }
         .padding(.horizontal, 10)
         .padding(.vertical, 8)
         .background(.ultraThinMaterial, in: Capsule()) // Encapsulated background
         .transition(.asymmetric(insertion: .move(edge: .trailing), removal: .move(edge: .leading))) // Search bar animation

    }

    private var searchButton: some View {
        Button {
            withAnimation { showSearchBar = true }
        } label: {
            Image(systemName: "magnifyingglass")
        }
        .buttonStyle(.plain) // Use plain style for just the icon
        .transition(.move(edge: .leading)) // Animation
    }


    private var refreshButton: some View {
        Button {
            refreshWeatherData()
        } label: {
             if showSearchBar { // Show close button when search is active
                  Image(systemName: "xmark")
                       .font(.title3) // Slightly smaller xmark
             } else {
                  Image(systemName: "arrow.clockwise") // Refresh icon otherwise
             }
        }
        .buttonStyle(.plain)
    }

    private var currentWeatherHeader: some View {
        VStack(spacing: 5) { // Reduced spacing
            // City Name
            Text(displayedCityName())
                .font(.system(size: 34, weight: .regular)) // Match screenshot font
                .foregroundColor(.primary) // Use primary color

            // Current Temperature
            if let temp = vm.currentTemp {
                Text("\(Int(temp.rounded()))°")
                    .font(.system(size: 96, weight: .thin)) // Large thin temp
                    .foregroundColor(.primary)
            } else {
                Text("—°")
                    .font(.system(size: 96, weight: .thin))
                    .foregroundColor(.primary)
            }

            // Condition Description
            Text(vm.currentCondition)
                .foregroundColor(.secondary) // Secondary color for condition
                .font(.system(size: 18, weight: .medium)) // Match screenshot

            // High/Low Temperatures
            if let hi = vm.todayMaxTemp, let lo = vm.todayMinTemp {
                Text("H:\(Int(hi.rounded()))° L:\(Int(lo.rounded()))°")
                    .foregroundColor(.primary) // Primary color
                    .font(.system(size: 18, weight: .medium))
            }
        }
        .padding(.vertical, 10) // Add some vertical padding
    }


    private var hourlyForecastCard: some View {
        VStack(alignment: .leading, spacing: 0) { // Align card content
             // Optional: Add a title like "Hourly Forecast" if desired
             // Text("HOURLY FORECAST").font(.caption).foregroundColor(.secondary).padding([.leading, .top], 15)

             ScrollView(.horizontal, showsIndicators: false) {
                 HStack(spacing: 25) { // Increased spacing between items
                     ForEach(vm.hourlyForecast.indices, id: \.self) { i in
                         let hourItem = vm.hourlyForecast[i]
                         VStack(spacing: 12) { // Increased vertical spacing
                             // Hour Label (e.g., "Now", "3PM")
                             Text(hourItem.hour)
                                 .font(.system(size: 14, weight: .medium)) // Slightly bolder hour
                                 .foregroundColor(.primary)

                             // Weather Symbol
                             Image(systemName: hourItem.symbol)
                                 .symbolVariant(.fill)
                                 .symbolRenderingMode(.multicolor)
                                 .font(.title2) // Keep icon size reasonable
                                 .frame(height: 30) // Ensure consistent height

                             // Temperature
                             Text("\(Int(hourItem.temp.rounded()))°")
                                 .font(.system(size: 18, weight: .medium)) // Bolder temp
                                 .foregroundColor(.primary)
                         }
                         .padding(.vertical, 5) // Add slight vertical padding to center content
                     }
                 }
                 .padding(.horizontal, 15) // Padding inside the ScrollView
                 .padding(.vertical, 12) // Vertical padding for the content
             }
             .frame(height: 120) // Set fixed height for the card area
        }
        .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 12))
    }

    private var tenDayForecastCard: some View {
         VStack(alignment: .leading, spacing: 0) { // No spacing between rows/divider
              Label("10-DAY FORECAST", systemImage: "calendar")
                   .font(.system(size: 10, weight: .medium))
                   .foregroundStyle(.secondary)
                   .padding(.horizontal, 15)
                   .padding(.top, 12)
                   .padding(.bottom, 5)


             if !vm.dailyForecast.isEmpty {
                 // Determine global min/max across the displayed days for the bar range
                 let temps = vm.dailyForecast.flatMap { [$0.minTemp, $0.maxTemp] }
                 let globalMin = temps.min() ?? 0
                 let globalMax = temps.max() ?? 1 // Avoid division by zero if min=max

                 ForEach(vm.dailyForecast) { dayItem in
                     dailyForecastRow(
                         dayItem: dayItem,
                         globalMin: globalMin,
                         globalMax: globalMax,
                         isToday: Calendar.current.isDateInToday(dayItem.date),
                         currentTemp: vm.currentTemp // Pass current temp for today's dot
                     )
                     // Add Divider conditionally, except for the last item
                      if dayItem.id != vm.dailyForecast.last?.id {
                           Divider()
                                .background(.white.opacity(0.2)) // Make divider visible
                                .padding(.leading, 15) // Indent divider
                      }
                 }
                  .padding(.bottom, 5) // Padding below the last row

             } else {
                  // Loading indicator or empty state
                  HStack {
                      Spacer()
                      ProgressView().tint(.white)
                      Spacer()
                  }
                  .padding()
                  .frame(height: 100) // Give it some height while loading
             }
         } // End VStack
         .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 12))
     }

     // Function to create a row in the 10-day forecast
     private func dailyForecastRow(dayItem: DayForecastItem, globalMin: Double, globalMax: Double, isToday: Bool, currentTemp: Double?) -> some View {
         HStack(spacing: 10) { // Adjust spacing between columns

             // Day Name (e.g., "Today", "Tue")
             Text(dayItem.day)
                 .font(.system(size: 16, weight: .medium))
                 .foregroundColor(.primary)
                 .frame(width: 55, alignment: .leading) // Fixed width for alignment

             // Weather Symbol & Precipitation Chance
             HStack(spacing: 5) {
                 Image(systemName: dayItem.symbol)
                     .symbolVariant(.fill)
                     .symbolRenderingMode(.multicolor)
                     .font(.title3)
                     .frame(width: 30) // Fixed width for icon

                 // Precipitation Chance Text (if significant)
                 if let chance = dayItem.precipChance, chance >= 0.1 { // Threshold for showing chance
                     Text("\(Int((chance * 100).rounded()))%")
                         .font(.system(size: 11, weight: .semibold))
                         .foregroundColor(Color(hue: 0.55, saturation: 0.8, brightness: 1.0)) // Cyan color
                         .frame(width: 35) // Width for percentage
                 } else {
                     Spacer().frame(width: 35) // Placeholder for alignment
                 }
             }
             .frame(maxWidth: .infinity, alignment: .leading) // Take remaining space before temps


             // Min Temperature
             Text("\(Int(dayItem.minTemp.rounded()))°")
                 .font(.system(size: 16, weight: .medium))
                 .foregroundColor(.secondary) // Min temp is secondary
                 .frame(width: 35, alignment: .trailing)

             // Temperature Range Bar
             TemperatureRangeView(
                 day: dayItem,
                 globalMin: globalMin,
                 globalMax: globalMax,
                 isToday: isToday,
                 currentTemp: isToday ? currentTemp : nil // Only pass current temp if it's today
             )
             .frame(width: 80) // Fixed width for the bar

             // Max Temperature
             Text("\(Int(dayItem.maxTemp.rounded()))°")
                 .font(.system(size: 16, weight: .medium))
                 .foregroundColor(.primary) // Max temp is primary
                 .frame(width: 35, alignment: .trailing)
         }
         .padding(.horizontal, 15) // Padding for the row content
         .padding(.vertical, 10) // Vertical padding for the row
         .contentShape(Rectangle()) // Make the whole row tappable
         .onTapGesture {
             selectedDay = dayItem // Set the selected day for the sheet
         }
     }


    private var todayDetailsGrid: some View {
        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 15) {
            // Use the new individual card views
            FeelsLikeCard(feelsLike: vm.currentFeelsLike, currentTemp: vm.currentTemp)

            UVIndexCard(
                uvIndex: vm.currentUVIndex,
                categoryInfo: vm.uvCategory(for: vm.currentUVIndex)
            )

            WindCard(
                windSpeedKmh: vm.metersPerSecondToKmh(vm.currentWindSpeed),
                gustSpeedKmh: vm.metersPerSecondToKmh(vm.currentWindGust),
                direction: vm.currentWindDirection,
                directionAbbreviation: vm.windDirectionAbbreviation(for: vm.currentWindDirection)
            )

            SunsetCard(
                sunrise: vm.sunriseTime,
                sunset: vm.sunsetTime,
                formatTime: vm.formatTime // Pass the formatting helper
            )

            // Example data fetching logic for Precipitation card might be complex.
            // Here, we pass today's amount and rely on ViewModel for next expected.
             // You might need a more sophisticated way to determine the *next* rain event.
             let nextRainInfo = findNextPrecipitationEvent()
             PrecipitationTodayCard(
                 amount: vm.todayPrecipitationAmount,
                 nextExpectedAmount: nextRainInfo.amount,
                 nextExpectedTimeString: nextRainInfo.timeString
             )


            VisibilityCard(
                visibilityKm: (vm.currentVisibility ?? 0) / 1000 // Convert meters to km
            )

            HumidityCard(
                humidity: vm.currentHumidity,
                dewPoint: vm.currentDewPoint
            )

            PressureCard(
                pressure: vm.currentPressure,
                trend: vm.pressureTrend
            )

            // Add other cards like Moon Phase, Averages here when ready
        }
    }

    private var searchResultsOverlay: some View {
        // Overlay for search suggestions
        Group {
            if showSearchBar && isEditing && !locationSearchVM.searchResults.isEmpty {
                List(locationSearchVM.searchResults, id: \.self) { completion in
                    Button {
                        // When tapped, get details for that completion
                        locationSearchVM.selectCompletion(completion)
                        // Hide keyboard and list
                        hideKeyboard()
                        isEditing = false
                        // `onReceive(locationSearchVM.$selectedPlacemark)` will handle the rest
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
                    .listRowBackground(Color(.systemGray6)) // Background for list rows
                }
                .listStyle(.plain)
                .frame(maxHeight: 400) // Limit list height
                .background(.thinMaterial) // Background behind the list
                .clipShape(RoundedRectangle(cornerRadius: 10))
                .shadow(radius: 5)
                .padding(.horizontal)
                .offset(y: 60) // Position below the search bar area
                .transition(.opacity.combined(with: .move(edge: .top))) // Animation
                .zIndex(1) // Ensure it's above the main scroll view
            }
        }
    }

    // MARK: - Helper Functions

    private func displayedCityName() -> String {
        if !geocodedCityName.isEmpty {
            return geocodedCityName // Use searched city name if available
        }
        return locationManager.currentCityName ?? "Loading..." // Otherwise use GPS location name
    }

    private func refreshWeatherData() {
         vm.clearWeatherData() // Clear existing data immediately for refresh feel
         initialLoadComplete = false // Allow fetching again

         // If a city was searched, refresh that city
         if !geocodedCityName.isEmpty, let placemark = locationSearchVM.selectedPlacemark {
             handleSelectedLocation(placemark: placemark)
         }
         // Otherwise, refresh GPS location
         else if let loc = locationManager.currentLocation {
             vm.fetchWeatherForCoords(latitude: loc.coordinate.latitude, longitude: loc.coordinate.longitude)
             initialLoadComplete = true
         } else {
             // If no location available (e.g., denied), maybe try requesting again or show error
             locationManager.manager.requestLocation() // Try to get location again
             vm.errorMessage = "Cannot refresh. Location unknown."
             initialLoadComplete = true // Prevent infinite loop if denied
         }

         // Reset search state if refresh button was hit while searching
         if showSearchBar {
             hideSearch()
         }
     }

     // Central function to handle selecting a location from search
     private func handleSelectedLocation(placemark: MKPlacemark) {
         vm.clearWeatherData() // Clear old data
         let coords = placemark.coordinate
         vm.fetchWeatherForCoords(latitude: coords.latitude, longitude: coords.longitude)
         initialLoadComplete = true // Mark load complete for this location

         // Get a displayable city name from the placemark
         let city = placemark.locality ?? placemark.administrativeArea ?? placemark.name ?? "Selected Location"
         self.geocodedCityName = city // Store the searched city name

         // Update UI state
         hideSearch()
     }

     // Function to hide search bar and reset state
     private func hideSearch() {
         withAnimation {
             showSearchBar = false
             locationSearchVM.queryFragment = ""
             isEditing = false
             hideKeyboard()
         }
     }

     // Function to dismiss keyboard
     private func hideKeyboard() {
            UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
     }

     // Helper to find next precipitation event (simplified example)
     // NOTE: Accurate prediction requires analysing hourly/daily forecasts in detail.
     private func findNextPrecipitationEvent() -> (amount: Double?, timeString: String?) {
         // 1. Check hourly first for nearest significant precipitation
         if let nextHourPrecip = vm.hourlyForecast.first(where: { $0.temp >= 0.1 && $0.hour != "Now" }) { // Using temp field temporarily for precip chance >= 10%
             // This needs proper precipitation chance data in the hourly tuple
             // return (amount: ???, timeString: "soon") // Placeholder - need real precip data
         }

         // 2. If not soon, check daily forecast
         if let nextDayPrecip = vm.dailyForecast.first(where: { day in
             guard !Calendar.current.isDateInToday(day.date) else { return false } // Skip today
             return (day.precipChance ?? 0) >= 0.1 // Check if chance is > 10%
         }) {
             // Calculate days until that event
             let daysUntil = Calendar.current.dateComponents([.day], from: Date(), to: nextDayPrecip.date).day ?? 0
             let timeString: String
             if daysUntil <= 1 {
                 timeString = "tomorrow"
             } else if daysUntil <= 7 {
                 timeString = "on \(nextDayPrecip.day)" // e.g., "on Tue"
             } else {
                  timeString = "in \(daysUntil) days"
             }
             // We don't easily get the *amount* for that specific future event from daily summary
             return (amount: 1.0, timeString: timeString) // Placeholder amount
         }

         // 3. If nothing found
         return (amount: nil, timeString: nil)
     }

} // End of WeatherKitView
