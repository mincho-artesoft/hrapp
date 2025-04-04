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
    @State private var geocodedCityName = ""
    @State private var selectedDay: DayForecastItem? = nil
    
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
            
            // 2) ScrollView, в която е включен и topBar
            ScrollView(.vertical, showsIndicators: false) {
                VStack(spacing: 20) {
                    
                    // ---------- TOP BAR като част от скрол-вюто ----------
                    topBar
                    
                    // ---------- MAIN WEATHER CONTENT ----------
                    VStack(spacing: 20) {
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
                    }
                    .padding(.horizontal, 16)
                    
                    Spacer().frame(height: 40)
                }
            }
            .onAppear {
                if let loc = locationManager.currentLocation {
                    vm.fetchWeatherForCoords(latitude: loc.coordinate.latitude,
                                             longitude: loc.coordinate.longitude)
                }
            }
            .onChange(of: locationManager.currentLocation) { newLoc in
                // Ако потребителят не е търсил ръчно, ъпдейтваме
                if let loc = newLoc, locationSearchVM.queryFragment.isEmpty {
                    vm.fetchWeatherForCoords(latitude: loc.coordinate.latitude,
                                             longitude: loc.coordinate.longitude)
                }
            }
            // ---------- Край на ScrollView ----------
            
            // 3) Overlay с листа за предложения, за да е винаги “закован” отгоре
            if showSearchBar && isEditing && !locationSearchVM.searchResults.isEmpty {
                VStack(spacing: 0) {
                    // Може да сложите малко “background”, за да се вижда листът
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
                    .padding(.top, 70)
                    .listStyle(.plain)
                    .frame(maxHeight: 800) // limit how tall the list can grow
                    .transition(.move(edge: .top))
                    
                    Spacer() // Ще избутва списъка нагоре
                }
                .zIndex(1) // Да стои над ScrollView
            }
        }
        // ---------- SHEETS ----------
        .sheet(item: $selectedDay) { day in
            DayDetailSheetView(day: day)
        }
        // ---------- ON RECEIVE ----------
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
    }
}

// MARK: - TOP BAR
extension WeatherKitView {
    private var topBar: some View {
        HStack {
            if showSearchBar {
                HStack(spacing: 8) {
                    TextField("Search city...",
                              text: $locationSearchVM.queryFragment,
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
        VStack(alignment: .leading, spacing: 0) {
            // Заглавие ... (остава същото) ...
            Text("10-Day Forecast")
                .font(.callout).fontWeight(.medium)
                .foregroundColor(Color.white.opacity(0.7))
                .padding(.vertical, 10)
                .padding(.leading, 16)

            if !vm.dailyForecast.isEmpty {
                let globalMin = vm.dailyForecast.map(\.minTemp).min() ?? 0
                let globalMax = vm.dailyForecast.map(\.maxTemp).max() ?? 0

                ForEach(vm.dailyForecast, id: \.id) { dayItem in
                    let todayCheck = Calendar.current.isDateInToday(dayItem.date)

                    // --- ИЗВИКВАНЕ НА НОВАТА ФУНКЦИЯ ---
                    dailyForecastRow(
                        dayItem: dayItem,
                        globalMin: globalMin,
                        globalMax: globalMax,
                        isToday: todayCheck,
                        currentTemp: vm.currentTemp // Предаваме currentTemp
                    )
                    // --- Прилагане на модификаторите към резултата от функцията ---
                    .padding(.vertical, 6)
                    .padding(.horizontal, 16)
                    .background(Color.clear)
                    .contentShape(Rectangle())
                    .onTapGesture {
                        selectedDay = dayItem
                    }
                    // ---------------------------------------

                    // Разделител (остава същият)
                    if dayItem != vm.dailyForecast.last {
                        Divider()
                            .background(Color.white.opacity(0.2))
                            .padding(.leading, 16 + 60 + 12)
                            .padding(.trailing, 16)
                    }
                } // Край на ForEach
            } else {
                 // Loading индикатор ... (остава същият) ...
                 HStack {
                     Spacer()
                     ProgressView().tint(.white)
                     Spacer()
                 }
                 .padding()
            }
        } // Край на VStack
        .background(
             // Фон ... (остава същият) ...
            RoundedRectangle(cornerRadius: 12)
                .fill(.ultraThinMaterial)
        )
    }

    private func dailyForecastRow(
        dayItem: DayForecastItem,
        globalMin: Double,
        globalMax: Double,
        isToday: Bool,
        currentTemp: Double?
    ) -> some View {
        HStack(spacing: 8) {
            
            // КОЛОНА 1: Име на деня
            Text(dayItem.day)
                .foregroundColor(.white)
                .font(.system(size: 18, weight: .medium))
                .frame(width: 60, alignment: .leading)
            
            // КОЛОНА 2: Икона + Валежи
            HStack(alignment: .center, spacing: 20) {
                // Икона
                Image(systemName: dayItem.symbol)
                    .symbolVariant(.fill)
                    .symbolRenderingMode(.multicolor)
                    .font(.title3)
                
                // Вертикален стект за прогноза за валежи
                VStack(alignment: .leading, spacing: 4) {
                    if let chance = dayItem.precipChance, chance >= 0.1 {
                        VStack(alignment: .center, spacing: 4) {
                            Text("\(Int(chance * 100))%")
                                .font(.caption)
                                .fontWeight(.semibold)
                                .foregroundColor(.cyan)
                            
                            ProgressView(value: chance)
                                .progressViewStyle(.linear)
                                .tint(.cyan)
                                .frame(width: 50, height: 6)
                        }
                    } else {
                        // Ако няма валеж
                        Spacer()
                            .frame(height: 6)
                    }
                }
            }

            .frame(width: 90, alignment: .leading)
            
            // КОЛОНА 3: Минимална температура
            Text("\(Int(dayItem.minTemp.rounded()))°")
                .foregroundColor(Color.white.opacity(0.7))
                .font(.system(size: 18, weight: .medium))
                .frame(width: 35, alignment: .trailing)
            
            // КОЛОНА 4: Бар за температурния диапазон
            TemperatureRangeView(
                day: dayItem,
                globalMin: globalMin,
                globalMax: globalMax,
                isToday: isToday,
                currentTemp: currentTemp
            )
            .frame(width: 80, height: 5)
            
            // КОЛОНА 5: Максимална температура
            Text("\(Int(dayItem.maxTemp.rounded()))°")
                .foregroundColor(.white)
                .font(.system(size: 18, weight: .medium))
                .frame(width: 35, alignment: .trailing)
        }
        .padding(.vertical, 8)
        .contentShape(Rectangle())
        .onTapGesture {
            selectedDay = dayItem
        }
    }


} // Край на extension WeatherKitView
