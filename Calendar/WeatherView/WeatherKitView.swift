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
    @State private var showSearchBar = false // <--- НОВО: Състояние за показване/скриване
    @State private var isEditing = false  // controls when suggestions list appears
    @State private var geocodedCityName = "" // Store city name from search results
    @State private var selectedDay: DayForecastItem? = nil // For daily forecast sheet
    @State private var initialLoadComplete = false

    var body: some View {
        ZStack(alignment: .top) { // <--- Увиваме всичко в ZStack

            // 1) Background gradient
            LinearGradient(
                gradient: Gradient(colors: [
                    Color.blue.opacity(0.6),
                    Color.gray.opacity(0.5)
                ]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .edgesIgnoringSafeArea(.all)
            // ----> НОВО: Добавяме onTapGesture към фона <----
            .onTapGesture {
                if showSearchBar { // Ако сърч барът е показан
                    hideSearch()   // Скрий го при тап на фона
                }
            }
            // ----------------------------------------------

            // 2) Main content area (ScrollView + Top Bar)
            VStack(spacing: 0) { // Use VStack to stack Top Bar and ScrollView
                
                // ---------- TOP BAR (Сега е извън ScrollView) ----------
                topBar
                    .padding(.top, 5) // Add slight padding from safe area edge
                    .padding(.bottom, 10) // Space between top bar and content
                    // ----> НОВО: Предотвратяване на тап върху topBar да скрива search <----
                    .onTapGesture {
                        // Do nothing here, just consume the tap
                        // This prevents the ZStack's tap gesture from firing
                        // when tapping the search bar or buttons within the topBar.
                    }
                    // --------------------------------------------------------------


                // ---------- ScrollView for main content ----------
                ScrollView(.vertical, showsIndicators: false) {
                    VStack(spacing: 20) { // Consistent spacing for major sections
                        // ---------- MAIN WEATHER CONTENT ----------
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
                    // ----> НОВО: Добавяме onTapGesture към ScrollView съдържанието <----
                    .padding(.top) // Add some top padding inside scroll view if needed
                    .contentShape(Rectangle()) // Define hittable area for the content
                    .onTapGesture {
                         if showSearchBar { // Ако сърч барът е показан
                            hideSearch() // Скрий го при тап върху съдържанието
                        }
                    }
                    // --------------------------------------------------------------------
                }
                .refreshable { // Pull to refresh
                    refreshWeatherData()
                }
            } // End VStack for Top Bar + ScrollView
            // ---------- End Main Content Area ----------


            // 3) Search Results Overlay (appears above everything else)
            searchResultsOverlay
                 // ----> НОВО: Предотвратяване на тап върху резултатите да скрива search <----
                 .onTapGesture {
                     // Do nothing, consume the tap on the results list itself
                 }
                 // --------------------------------------------------------------

        } // End ZStack
        // ---------- Sheets and Data Handling ----------
        .sheet(item: $selectedDay) { day in
            DayDetailSheetView(day: day)
                .presentationDetents([.medium]) // Start with medium detent
        }
        .onReceive(locationManager.$currentLocation) { location in
            // Fetch weather only if search is not active and initial load needed
            // Променено: Проверяваме И `showSearchBar`
            if let loc = location, !showSearchBar, geocodedCityName.isEmpty, !initialLoadComplete {
                vm.fetchWeatherForCoords(latitude: loc.coordinate.latitude, longitude: loc.coordinate.longitude)
                initialLoadComplete = true // Mark initial load done
            }
        }
        .onReceive(locationSearchVM.$selectedPlacemark) { placemark in
            guard let placemark = placemark else { return }
            handleSelectedLocation(placemark: placemark)
            // `handleSelectedLocation` вече вика `hideSearch`
        }
        // Handle authorization changes
        .onReceive(locationManager.$authorizationStatus) { status in
             if status == .authorizedWhenInUse || status == .authorizedAlways {
                 if locationManager.currentLocation == nil {
                     locationManager.manager.requestLocation()
                 } else if !initialLoadComplete && !showSearchBar && geocodedCityName.isEmpty { // <--- Проверка за showSearchBar
                     vm.fetchWeatherForCoords(latitude: locationManager.currentLocation!.coordinate.latitude,
                                              longitude: locationManager.currentLocation!.coordinate.longitude)
                     initialLoadComplete = true
                 }
             } else if status == .denied || status == .restricted {
                 vm.errorMessage = "Location access denied. Search for a city or grant access in Settings."
                 initialLoadComplete = true
             }
        }
    }

    // MARK: - Computed Views / Subviews

    // Променяме topBar да показва или бутон, или поле за търсене
    private var topBar: some View {
        HStack {
            if showSearchBar {
                searchField // Показва полето за търсене
                    .transition(.asymmetric(insertion: .move(edge: .leading).combined(with: .opacity),
                                             removal: .move(edge: .leading).combined(with: .opacity))) // Анимация
            } else {
                searchButton // Показва бутона за търсене (лупа)
                    .transition(.asymmetric(insertion: .move(edge: .leading).combined(with: .opacity),
                                             removal: .move(edge: .leading).combined(with: .opacity))) // Анимация
            }
            Spacer()
            actionButton // Преименуван бутон (преди refreshButton)
        }
        .padding(.horizontal) // Standard horizontal padding
        // Анимация за целия HStack при смяна
//        .animation(.easeInOut(duration: 0.3), value: showSearchBar)
    }

    // Остава почти същото, но ще го анимираме
    private var searchField: some View {
        HStack(spacing: 8) {
            Image(systemName: "magnifyingglass")
                 .foregroundColor(.secondary)

            TextField("Search for a city...",
                      text: $locationSearchVM.queryFragment,
                      onEditingChanged: { editing in
                          // Запазваме isEditing за показване/скриване на списъка
                          isEditing = editing
                          // Ако започне редакция, показваме searchBar-а (ако вече не е)
                          // (това е по-скоро за случаи, ако има други начини за скриване)
                          if editing && !showSearchBar {
                              withAnimation { showSearchBar = true }
                          }
                      },
                      onCommit: {
                          isEditing = false
                          // Може да не искаме да скриваме бара при Commit,
                          // потребителят може да иска да види резултата преди да скрие.
                          // hideSearch() // Премахваме това
                      })
                .textFieldStyle(.plain)
                .autocorrectionDisabled(true)
                // ----> НОВО: Добавяме празен onTapGesture тук <----
                // Това гарантира, че тап ВЪТРЕ в TextField-а НЯМА
                // да задейства .onTapGesture на горните контейнери (ZStack/VStack).
                .onTapGesture { }
                // --------------------------------------------------

            if !locationSearchVM.queryFragment.isEmpty {
                 Button { locationSearchVM.queryFragment = "" } label: {
                      Image(systemName: "xmark.circle.fill")
                           .foregroundColor(.secondary)
                 }
                 // ----> НОВО: Добавяме празен onTapGesture и тук <----
                 .onTapGesture { }
                 // --------------------------------------------------
            }
        }
         .padding(.horizontal, 10)
         .padding(.vertical, 8)
         .background(.ultraThinMaterial, in: Capsule())
         // ----> НОВО: Добавяме празен onTapGesture към фона на капсулата <----
         .contentShape(Capsule()) // Дефинираме формата за тап
         .onTapGesture { }
         // --------------------------------------------------------------------
    }

    // Бутонът, който показва searchBar-а
    private var searchButton: some View {
        Button {
            // Не използваме withAnimation тук, защото го слагаме на topBar
            showSearchBar = true
            // Фокусираме полето веднага (трябва да се направи малко по-късно)
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                // Needs a way to focus the TextField programmatically
                // This is more complex involving FocusState
            }
        } label: {
            Image(systemName: "magnifyingglass")
                 .font(.title2) // Малко по-голяма икона
                 .frame(height: 36) // Да има същата височина като searchField-а за по-добра анимация
        }
        .buttonStyle(.plain)
    }

    // Бутонът, който е или Refresh, или Close
    private var actionButton: some View {
        Button {
            if showSearchBar {
                hideSearch() // Ако търсенето е активно, скриваме го
            } else {
                refreshWeatherData() // Иначе обновяваме
            }
        } label: {
             Image(systemName: showSearchBar ? "xmark" : "arrow.clockwise") // Иконата се сменя
                  .font(.title2) // Малко по-голяма
                  .frame(width: 30, height: 36) // Фиксирана рамка за стабилност при смяна
                  .contentTransition(.symbolEffect(.replace)) // Хубава анимация при смяна на иконата (iOS 17+)
                  // За по-стари версии може да се ползва .transition(.opacity) или подобно
        }
        .buttonStyle(.plain)
    }

    // Остава същото
    private var currentWeatherHeader: some View {
        VStack(spacing: 5) {
            Text(displayedCityName())
                .font(.system(size: 34, weight: .regular))
                .foregroundColor(.primary)

            if let temp = vm.currentTemp {
                Text("\(Int(temp.rounded()))°")
                    .font(.system(size: 96, weight: .thin))
                    .foregroundColor(.primary)
            } else {
                Text("—°")
                    .font(.system(size: 96, weight: .thin))
                    .foregroundColor(.primary)
            }

            Text(vm.currentCondition)
                .foregroundColor(.secondary)
                .font(.system(size: 18, weight: .medium))

            if let hi = vm.todayMaxTemp, let lo = vm.todayMinTemp {
                Text("H:\(Int(hi.rounded()))° L:\(Int(lo.rounded()))°")
                    .foregroundColor(.primary)
                    .font(.system(size: 18, weight: .medium))
            }
        }
        .padding(.vertical, 10)
    }

    // Остава същото
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

    // Остава същото
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

    // Остава същото
    private func dailyForecastRow(dayItem: DayForecastItem, globalMin: Double, globalMax: Double, isToday: Bool, currentTemp: Double?) -> some View {
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

    // Остава същото
    private var todayDetailsGrid: some View {
          // Changed from LazyVGrid to VStack to allow full-width items
          VStack(spacing: 15) {
              // Row 1: Feels Like & UV (Paired)
              HStack(spacing: 15) {
                  FeelsLikeCard(feelsLike: vm.currentFeelsLike, currentTemp: vm.currentTemp)
                  UVIndexCard(uvIndex: vm.currentUVIndex, categoryInfo: vm.uvCategory(for: vm.currentUVIndex))
              }

              // Row 2: Wind (Full Width)
              WindCard(windSpeedKmh: vm.metersPerSecondToKmh(vm.currentWindSpeed), gustSpeedKmh: vm.metersPerSecondToKmh(vm.currentWindGust), direction: vm.currentWindDirection, directionAbbreviation: vm.windDirectionAbbreviation(for: vm.currentWindDirection))

              // Row 3: Sunset (Full Width)
              SunsetCard(sunrise: vm.sunriseTime, sunset: vm.sunsetTime, formatTime: vm.formatTime)

              // Row 4: Precipitation & Visibility (Paired)
              HStack(spacing: 15) {
                   let nextRainInfo = findNextPrecipitationEvent()
                   PrecipitationTodayCard(amount: vm.todayPrecipitationAmount, nextExpectedAmount: nextRainInfo.amount, nextExpectedTimeString: nextRainInfo.timeString)
                  VisibilityCard(visibilityKm: (vm.currentVisibility ?? 0) / 1000)
              }

              // Row 5: Humidity & Pressure (Paired)
              HStack(spacing: 15) {
                  HumidityCard(humidity: vm.currentHumidity, dewPoint: vm.currentDewPoint)
                  PressureCard(pressure: vm.currentPressure, trend: vm.pressureTrend)
              }
          }
      }

    // Модифицираме searchResultsOverlay малко
    private var searchResultsOverlay: some View {
        // Overlay за предложенията
        Group {
            // Показваме го само ако searchBar е видим И редактираме И има резултати
            if showSearchBar && isEditing && !locationSearchVM.searchResults.isEmpty {
                List(locationSearchVM.searchResults, id: \.self) { completion in
                    Button {
                        locationSearchVM.selectCompletion(completion)
                        // `handleSelectedLocation` ще скрие бара и клавиатурата
                        // Не е нужно да правим нищо повече тук
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
                    // ----> НОВО: Консумиране на тап върху ред от списъка <----
                    .contentShape(Rectangle()) // Дефинираме област за тап
                    .onTapGesture {
                        // Избираме елемента, но *не* скриваме бара директно тук.
                        // Оставяме Button action-а да го направи.
                        // Това празно onTapGesture спира пропагацията към фона.
                        locationSearchVM.selectCompletion(completion)
                    }
                    .listRowBackground(Color(UIColor.systemBackground).opacity(0.2)
) 
                    // --------------------------------------------------------
                }
                .listStyle(.plain)
                .frame(maxHeight: 400)
                .background(.ultraThinMaterial) // Прозрачен фон зад списъка
                .clipShape(RoundedRectangle(cornerRadius: 10))
                .shadow(radius: 5)
                .padding(.horizontal)
                 // Позиционираме го под topBar (нагласете Y отместването според нуждите)
                .offset(y: 65) // Може да се наложи фина настройка
                .transition(.opacity.combined(with: .move(edge: .top)))
                .zIndex(1) // Да е над ScrollView съдържанието
            }
        }
        // Анимация за поява/изчезване на целия overlay
//        .animation(.easeInOut(duration: 0.2), value: showSearchBar && isEditing && !locationSearchVM.searchResults.isEmpty)
    }


    // MARK: - Helper Functions

    // Остава същото
    private func displayedCityName() -> String {
        if !geocodedCityName.isEmpty {
            return geocodedCityName
        }
        return locationManager.currentCityName ?? "Loading..."
    }

    // Модифицираме refreshWeatherData да ползва hideSearch
    private func refreshWeatherData() {
         vm.clearWeatherData()
         initialLoadComplete = false

         if !geocodedCityName.isEmpty, let placemark = locationSearchVM.selectedPlacemark {
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

         // Ако refresh е натиснат докато търсим, скриваме търсенето
         if showSearchBar {
             hideSearch()
         }
     }

     // Модифицираме handleSelectedLocation да ползва hideSearch
     private func handleSelectedLocation(placemark: MKPlacemark) {
         vm.clearWeatherData()
         let coords = placemark.coordinate
         vm.fetchWeatherForCoords(latitude: coords.latitude, longitude: coords.longitude)
         initialLoadComplete = true

         let city = placemark.locality ?? placemark.administrativeArea ?? placemark.name ?? "Selected Location"
         self.geocodedCityName = city

         // Скриваме търсенето след избор
         hideSearch()
     }

     // ---> НОВА ФУНКЦИЯ за скриване на search bar <---
     private func hideSearch() {
        // Не използваме withAnimation тук, защото е на topBar
         showSearchBar = false
         locationSearchVM.queryFragment = "" // Изчистваме полето
         isEditing = false // Спираме режима на редактиране
         hideKeyboard() // Скриваме клавиатурата
     }
     // -----------------------------------------------

     // ---> НОВА ФУНКЦИЯ за скриване на клавиатурата <---
     private func hideKeyboard() {
            UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
     }
     // ------------------------------------------------

     // Остава същото
     private func findNextPrecipitationEvent() -> (amount: Double?, timeString: String?) {
         if let nextHourPrecip = vm.hourlyForecast.first(where: { $0.temp >= 0.1 && $0.hour != "Now" }) {
             // Нуждае се от реални данни за валеж в hourlyForecast
             // return (amount: ???, timeString: "soon")
         }

         if let nextDayPrecip = vm.dailyForecast.first(where: { day in
             guard !Calendar.current.isDateInToday(day.date) else { return false }
             return (day.precipChance ?? 0) >= 0.1
         }) {
             let daysUntil = Calendar.current.dateComponents([.day], from: Date(), to: nextDayPrecip.date).day ?? 0
             let timeString: String
             if daysUntil <= 1 { timeString = "tomorrow" }
             else if daysUntil <= 7 { timeString = "on \(nextDayPrecip.day)" }
             else { timeString = "in \(daysUntil) days" }
             return (amount: 1.0, timeString: timeString) // Placeholder amount
         }
         return (amount: nil, timeString: nil)
     }
}

extension View {
    func hideKeyboard() {
        UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
    }
}
