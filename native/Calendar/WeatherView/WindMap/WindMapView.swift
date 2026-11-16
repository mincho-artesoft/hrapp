import SwiftUI
import MapKit

enum WindMapLabels {
    static func text(_ key: String) -> String {
        NSLocalizedString(key, tableName: "WindMap", bundle: .main, value: key, comment: "Weather map")
    }
    static func direction(_ degrees: Double) -> String {
        let names = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
        let index = Int(((degrees + 360).truncatingRemainder(dividingBy: 360) / 22.5).rounded()) % 16
        return NSLocalizedString("cardinal." + names[index], value: names[index], comment: "Wind direction")
    }
}

extension WeatherMapLayer {
    var title: String {
        switch self {
        case .temperature: NSLocalizedString("Temperature", comment: "Weather layer")
        case .wind: WindMapLabels.text("Wind")
        }
    }
    var symbol: String {
        switch self {
        case .temperature: "thermometer.medium"
        case .wind: "wind"
        }
    }
    var hasTimeline: Bool { self == .wind }
}

struct WindMapCard: View {
    let coordinate: CLLocationCoordinate2D?
    let name: String
    let timeZone: TimeZone
    let pointForecast: WindMapPointForecast?
    let currentLocation: CLLocationCoordinate2D?
    let allowsNetwork: Bool
    let fullScreenColorScheme: ColorScheme?
    @StateObject private var store = WindMapStore()
    @State private var expanded = false
    @State private var visible = false
    @Environment(\.scenePhase) private var scenePhase
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    private var requestKey: String {
        guard visible, !expanded, allowsNetwork, let coordinate else { return "inactive" }
        return WindMapGrid(latitude: coordinate.latitude, longitude: coordinate.longitude).key
    }
    private var matchingField: WindMapField? {
        guard let coordinate, store.field?.grid == WindMapGrid(latitude: coordinate.latitude, longitude: coordinate.longitude) else { return nil }
        return store.field
    }
    var body: some View {
        WeatherDetailCard {
            Label(WindMapLabels.text("Wind Map").uppercased(with: .appFormatting), systemImage: "wind")
                .font(.caption.weight(.medium)).foregroundStyle(.white.opacity(0.65))
                .frame(maxWidth: .infinity, alignment: .leading)
            Button { expanded = true } label: {
                ZStack {
                    if let coordinate {
                        WindMapCanvas(field: matchingField, date: matchingField?.forecastDates().first ?? Date(),
                            coordinate: coordinate, name: name, interactive: false,
                            animated: visible && !expanded && scenePhase == .active && !reduceMotion,
                            recenterID: 0, imperial: GlobalState.measurementSystem == "Imperial", pointForecast: pointForecast)
                            .allowsHitTesting(false)
                    } else { Color(red: 0.04, green: 0.32, blue: 0.48) }
                    if store.isLoading {
                        ProgressView().tint(.white).padding(12).background(.ultraThinMaterial, in: Capsule())
                    } else if store.failed {
                        Label(WindMapLabels.text("Wind data unavailable"), systemImage: "exclamationmark.icloud")
                            .font(.caption).padding(10).background(.ultraThinMaterial, in: Capsule())
                    }
                }
                .aspectRatio(310.0 / 286, contentMode: .fit)
                .clipShape(RoundedRectangle(cornerRadius: 11))
                .contentShape(Rectangle())
            }
            .buttonStyle(.plain).disabled(coordinate == nil)
            .accessibilityLabel(WindMapLabels.text("Open wind map"))
            .accessibilityIdentifier("weather.windMap.open")
        }
        .onScrollVisibilityChange(threshold: 0.1) { visible = $0 }
        .task(id: requestKey) {
            guard requestKey != "inactive", let coordinate else { return }
            await store.load(coordinate)
        }
        .onChange(of: scenePhase) { _, phase in
            if phase == .active, visible, !expanded, allowsNetwork, let coordinate {
                Task { await store.load(coordinate) }
            }
        }
        .fullScreenCover(isPresented: $expanded, onDismiss: {
            store.isPlaying = false
            store.hour = 0
            if allowsNetwork, let coordinate { Task { await store.load(coordinate) } }
        }) {
            if let coordinate {
                WindMapFullScreen(store: store, initialCoordinate: coordinate, initialName: name,
                                  initialTimeZone: timeZone, initialPointForecast: pointForecast,
                                  currentLocation: currentLocation, allowsNetwork: allowsNetwork)
                    .environment(\.colorScheme, fullScreenColorScheme ?? .dark)
                    .environment(\.layoutDirection, AppPreferences.shared.layoutDirection)
                    .environment(\.locale, .appFormatting)
            }
        }
    }
}

private struct WindMapPlace: Identifiable {
    let id: String
    let name: String
    let coordinate: CLLocationCoordinate2D
    let timeZone: TimeZone
}

private struct WeatherMapPlaybackID: Hashable {
    let isPlaying: Bool
    let first: Date?
    let last: Date?
}

private struct WindMapFullScreen: View {
    @ObservedObject var store: WindMapStore
    let initialCoordinate: CLLocationCoordinate2D
    let initialName: String
    let initialTimeZone: TimeZone
    let initialPointForecast: WindMapPointForecast?
    let currentLocation: CLLocationCoordinate2D?
    let allowsNetwork: Bool
    @ObservedObject private var regions = SavedWeatherRegionsStore.shared
    @Environment(\.dismiss) private var dismiss
    @Environment(\.scenePhase) private var scenePhase
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @Environment(\.colorScheme) private var colorScheme
    @State private var selection: WindMapPlace?
    @State private var viewportGrid: WindMapGrid?
    @State private var recenterID = 0
    @State private var timelineVisible = true
    @State private var markerExpanded = true
    @State private var timelinePosition: Double = 4
    @State private var placesVisible = false
    @State private var infoVisible = false
    @State private var layer = WeatherMapLayer.wind
    @State private var conditions: [String: WeatherMapPlaceConditions] = [:]
    @State private var selectedPointForecast: WindMapPointForecast?

    private var place: WindMapPlace {
        selection ?? WindMapPlace(id: "initial", name: initialName, coordinate: initialCoordinate, timeZone: initialTimeZone)
    }
    private var imperial: Bool { GlobalState.measurementSystem == "Imperial" }
    private var timelineDates: [Date] {
        let now = floor(Date().timeIntervalSince1970 / 3_600) * 3_600
        return store.allDates.filter { $0.timeIntervalSince1970 >= now - 4 * 3_600 && $0.timeIntervalSince1970 <= now + 12 * 3_600 }
    }
    private var displayedDate: Date {
        guard layer.hasTimeline, let first = timelineDates.first else { return store.dates.first ?? Date() }
        return first.addingTimeInterval(min(Double(max(0, timelineDates.count - 1)), max(0, timelinePosition)) * 3_600)
    }
    private var nowPosition: Double {
        guard let first = timelineDates.first else { return 0 }
        return max(0, min(Double(timelineDates.count - 1), Date().timeIntervalSince(first) / 3_600))
    }
    private var panelTint: Color {
        layer == .wind ? Color(red: 0.015, green: 0.19, blue: 0.28).opacity(0.88) : Color(white: 0.14).opacity(0.88)
    }

    var body: some View {
        ZStack {
            WindMapCanvas(field: store.field, date: displayedDate,
                coordinate: place.coordinate, name: place.name, interactive: true,
                animated: scenePhase == .active && !reduceMotion && !placesVisible && !infoVisible,
                recenterID: recenterID, imperial: imperial, layer: layer, dark: colorScheme == .dark,
                pointForecast: selectedPointForecast ?? (selection == nil || place.id == "initial" ? initialPointForecast : nil),
                onRegionChanged: { region in
                    let grid = WindMapGrid(latitude: region.center.latitude, longitude: region.center.longitude,
                                           latitudeSpan: region.span.latitudeDelta, longitudeSpan: region.span.longitudeDelta)
                    if viewportGrid != grid { viewportGrid = grid }
                },
                onTap: { withAnimation(.easeInOut(duration: 0.2)) {
                    if markerExpanded { markerExpanded = false } else { timelineVisible.toggle() }
                } }, markerExpanded: markerExpanded,
                onMarkerTap: { markerExpanded.toggle() })
                .ignoresSafeArea()
            VStack(spacing: 8) {
                topControls
                Spacer(minLength: 0)
                if store.failed { retryPanel }
                if timelineVisible, layer.hasTimeline, !timelineDates.isEmpty {
                    timeline.transition(.move(edge: .bottom).combined(with: .opacity))
                }
            }
            .padding(.horizontal, 12).padding(.top, 8).padding(.bottom, 44)
        }
        .foregroundStyle(.white)
        .preferredColorScheme(.dark)
        .task(id: viewportGrid?.key) {
            guard allowsNetwork, let viewportGrid else { return }
            do { try await Task.sleep(for: .milliseconds(650)) } catch { return }
            guard !Task.isCancelled else { return }
            await store.load(viewportGrid)
        }
        .task(id: WeatherMapPlaybackID(isPlaying: store.isPlaying, first: timelineDates.first, last: timelineDates.last)) {
            guard store.isPlaying else { return }
            let clock = ContinuousClock()
            let started = clock.now
            let startPosition = timelinePosition
            let end = Double(max(0, timelineDates.count - 1))
            while !Task.isCancelled {
                do { try await Task.sleep(for: .milliseconds(100)) } catch { break }
                guard !Task.isCancelled else { break }
                let elapsed = started.duration(to: clock.now).components
                let seconds = Double(elapsed.seconds) + Double(elapsed.attoseconds) / 1e18
                let next = WeatherMapPlayback.position(start: startPosition, elapsed: seconds, end: end)
                // Animate the track between samples; wrapping starts a new pass.
                withAnimation(next >= timelinePosition ? .linear(duration: 0.1) : nil) { timelinePosition = next }
            }
        }
        .task(id: placesVisible) {
            guard placesVisible, allowsNetwork else { return }
            for location in availablePlaces {
                guard !Task.isCancelled else { return }
                if let value = try? await WeatherMapPlaceCache.shared.conditions(for: location.coordinate) {
                    conditions[location.id] = value
                }
            }
        }
        .task(id: place.id) {
            selectedPointForecast = nil
            guard allowsNetwork else { return }
            let coordinate = place.coordinate
            if let forecast = try? await WeatherMapPlaceCache.shared.forecast(for: coordinate), !Task.isCancelled {
                selectedPointForecast = forecast
            }
        }
        .onChange(of: layer) { _, _ in
            store.isPlaying = false; timelinePosition = nowPosition; markerExpanded = true
            if allowsNetwork, let viewportGrid {
                Task { await store.load(viewportGrid) }
            }
        }
        .onChange(of: store.allDates.first, initial: true) { old, new in
            // Layer/horizon changes already reset to Now. Only rebase when
            // downloaded forecast dates change, or that reset gets subtracted twice.
            if old == nil || old == new { timelinePosition = nowPosition }
            else if let old, let new { timelinePosition = max(0, timelinePosition + old.timeIntervalSince(new) / 3_600) }
        }
        .onChange(of: scenePhase) { _, phase in
            if phase != .active { store.isPlaying = false }
            else if allowsNetwork, let viewportGrid { Task { await store.load(viewportGrid) } }
        }
        .onDisappear { store.isPlaying = false }
        .sheet(isPresented: $placesVisible) { placesSheet }
        .sheet(isPresented: $infoVisible) { infoSheet }
    }

    private var topControls: some View {
        HStack(alignment: .top) {
            VStack(alignment: .leading, spacing: 10) {
                roundButton("Close", symbol: "xmark", identifier: "weather.windMap.close") { dismiss() }
                VStack(alignment: .leading, spacing: 3) {
                    WeatherMapLegend(layer: layer, imperial: imperial)
                        .fixedSize(horizontal: true, vertical: false)
                        .background(panelTint.opacity(0.72), in: RoundedRectangle(cornerRadius: 16))
                    Button { infoVisible = true; store.isPlaying = false } label: {
                        Text(WindMapLabels.text("Map Data")).underline().font(.system(size: 10))
                            .foregroundStyle(.white.opacity(0.65)).padding(.horizontal, 5).padding(.vertical, 3)
                    }.accessibilityIdentifier("weather.windMap.info")
                }
            }
            Spacer()
            VStack(spacing: 10) {
                VStack(spacing: 0) {
                    Menu {
                        ForEach(WeatherMapLayer.allCases, id: \.self) { option in
                            Button { layer = option } label: {
                                Label(option.title, systemImage: layer == option ? "checkmark" : option.symbol)
                            }
                            .accessibilityIdentifier("weather.map.layer." + option.rawValue)
                        }
                    } label: { Image(systemName: "square.3.layers.3d.top.filled").frame(width: 44, height: 44) }
                    .accessibilityLabel(WindMapLabels.text("Map layers"))
                    .accessibilityIdentifier("weather.windMap.layers")
                    Button {
                        if let currentLocation {
                            selection = WindMapPlace(id: "current", name: WindMapLabels.text("My Location"), coordinate: currentLocation, timeZone: .current)
                        } else { selection = nil }
                        recenterID += 1
                    } label: { Image(systemName: "location").frame(width: 44, height: 44) }
                    .accessibilityLabel(WindMapLabels.text("Center on location"))
                    .accessibilityIdentifier("weather.windMap.recenter")
                }.background(panelTint, in: Capsule())
                roundButton("Your Locations", symbol: "list.bullet", identifier: "weather.windMap.locations") {
                    store.isPlaying = false; placesVisible = true
                }
                if store.isLoading {
                    ProgressView().tint(.white).frame(width: 30, height: 30)
                        .background(panelTint, in: Circle())
                        .accessibilityLabel(NSLocalizedString("Loading...", comment: "Loading weather map"))
                }
            }
        }.font(.system(size: 18, weight: .medium)).buttonStyle(.plain)
    }

    private func roundButton(_ title: String, symbol: String, identifier: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Image(systemName: symbol).frame(width: 44, height: 44).background(panelTint, in: Circle())
        }.accessibilityLabel(WindMapLabels.text(title)).accessibilityIdentifier(identifier)
    }

    private var retryPanel: some View {
        Button {
            if let viewportGrid { Task { await store.load(viewportGrid) } }
        } label: {
            Label(WindMapLabels.text("Retry"), systemImage: "arrow.clockwise")
                .font(.callout).padding(12).background(panelTint, in: Capsule())
        }.accessibilityIdentifier("weather.windMap.retry")
    }

    private var timeline: some View {
        VStack(spacing: 3) {
            HStack(spacing: 2) {
                Button { store.isPlaying.toggle() } label: {
                    Image(systemName: store.isPlaying ? "pause.fill" : "play.fill")
                        .font(.system(size: 11, weight: .semibold)).frame(width: 28, height: 28)
                        .background(.white.opacity(0.17), in: Circle()).frame(width: 44, height: 44)
                }
                .accessibilityLabel(WindMapLabels.text(store.isPlaying ? "Pause" : "Play"))
                .accessibilityIdentifier("weather.windMap.play")
                VStack(alignment: .leading, spacing: 2) {
                    Text(WindMapLabels.text("Wind Speed"))
                        .font(.system(size: 13, weight: .semibold))
                    Text(formattedDate(displayedDate)).font(.system(size: 12))
                        .foregroundStyle(.white.opacity(0.62)).lineLimit(1).minimumScaleFactor(0.75)
                }
                Spacer(minLength: 0)

            }
            WeatherMapTimeTrack(position: $timelinePosition, isPlaying: $store.isPlaying, dates: timelineDates, timeZone: place.timeZone)
        }
        .padding(.horizontal, 12).padding(.top, 7).padding(.bottom, 9)
        .frame(maxWidth: 560).background(panelTint, in: RoundedRectangle(cornerRadius: 18))
        .buttonStyle(.plain)
    }

    private func formattedDate(_ date: Date) -> String {
        if AppPreferences.shared.dateFormat == .system {
            return appDateFormatter(template: "EEEEdMMMMy", timeZone: place.timeZone).string(from: date)
        }
        return appShortDateFormatter(timeZone: place.timeZone, includesWeekday: true, usesFullWeekday: true).string(from: date)
    }
    private var placesSheet: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack(spacing: 14) {
                Image(systemName: layer.symbol).font(.title2)
                VStack(alignment: .leading, spacing: 3) {
                    Text(layer.title).font(.headline)
                    Text(WindMapLabels.text("Your Locations")).font(.caption).foregroundStyle(.white.opacity(0.6))
                }
                Spacer()
                roundButton("Close", symbol: "xmark", identifier: "weather.map.locations.close") { placesVisible = false }
            }
            ScrollView {
                VStack(spacing: 0) {
                    ForEach(availablePlaces) { location in
                        Button {
                            selection = location; recenterID += 1; placesVisible = false; timelineVisible = true
                        } label: { placeRow(location).padding(14) }.buttonStyle(.plain)
                        if location.id != availablePlaces.last?.id { Divider().overlay(.white.opacity(0.12)).padding(.horizontal, 14) }
                    }
                }.background(.white.opacity(0.07), in: RoundedRectangle(cornerRadius: 20))
            }
        }
        .padding(16).foregroundStyle(.white).background(panelTint.ignoresSafeArea())
        .presentationDetents([.medium, .large]).presentationDragIndicator(.hidden)
    }

    private func placeRow(_ location: WindMapPlace) -> some View {
        let data = conditions[location.id]
        return HStack {
            VStack(alignment: .leading, spacing: 5) {
                Text(location.name).font(.system(size: 16, weight: .medium))
                Text(data?.summary(layer: layer, imperial: imperial) ?? NSLocalizedString("Data unavailable", comment: "No weather data"))
                    .font(.system(size: 13)).foregroundStyle(.white.opacity(0.6))
            }
            Spacer()
            if layer == .wind, let data {
                Image(systemName: "arrow.down").rotationEffect(.degrees(data.wind.direction))
                Text(WindMapLabels.direction(data.wind.direction)).font(.caption)
            }
        }.frame(maxWidth: .infinity, alignment: .leading).contentShape(Rectangle())
    }

    private var availablePlaces: [WindMapPlace] {
        var candidates = [WindMapPlace(id: "initial", name: initialName, coordinate: initialCoordinate, timeZone: initialTimeZone)]
        if let currentLocation {
            candidates.append(WindMapPlace(id: "current", name: WindMapLabels.text("My Location"), coordinate: currentLocation, timeZone: .current))
        }
        candidates += regions.regions.map { region in
            WindMapPlace(id: region.id.uuidString, name: region.name,
                coordinate: CLLocationCoordinate2D(latitude: region.latitude, longitude: region.longitude),
                timeZone: region.timeZoneIdentifier.flatMap(TimeZone.init(identifier:)) ?? .current)
        }
        return candidates.reduce(into: []) { result, candidate in
            if !result.contains(where: {
                abs($0.coordinate.latitude - candidate.coordinate.latitude) < 0.01 &&
                abs(WindMapCoordinate.wrappedLongitude($0.coordinate.longitude - candidate.coordinate.longitude)) < 0.01
            }) { result.append(candidate) }
        }
    }

    private var infoSheet: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    Label(layer.title, systemImage: layer.symbol).font(.title2.bold())
                    if layer == .wind {
                        Text(WindMapLabels.text("Wind between forecast locations is estimated. Local conditions can differ, especially near mountains and coasts."))
                        Text(WindMapLabels.text("The arrows move in the direction the wind travels. The direction label shows where the wind comes from."))

                    }
                    Text(WindMapLabels.text("Weather data provided by Apple has been modified to create forecast maps."))
                        .font(.footnote).foregroundStyle(.secondary)
                    Link(" Weather · " + WindMapLabels.text("Data sources"), destination: URL(string: "https://weatherkit.apple.com/legal-attribution.html")!)
                    Link("Natural Earth · " + WindMapLabels.text("Map Data"), destination: URL(string: "https://www.naturalearthdata.com/about/terms-of-use/")!)
                }.padding(24)
            }
            .navigationTitle(WindMapLabels.text("Map Data")).navigationBarTitleDisplayMode(.inline)
            .toolbar { ToolbarItem(placement: .confirmationAction) { Button(WindMapLabels.text("Done")) { infoVisible = false } } }
        }.presentationDetents([.medium, .large]).presentationDragIndicator(.visible)
    }
}

private struct WeatherMapTimeTrack: View {
    @Binding var position: Double
    @Binding var isPlaying: Bool
    let dates: [Date]
    let timeZone: TimeZone
    private var last: Int { max(1, dates.count - 1) }
    private var indices: [Int] { last <= 1 ? [0, last] : Array(stride(from: 2, to: last, by: 2)) }
    var body: some View {
        VStack(spacing: 1) {
            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    Capsule().fill(.white.opacity(0.22)).frame(height: 6)
                    HStack(spacing: 0) {
                        ForEach(0...last, id: \.self) { tick in
                            Rectangle().fill(.white.opacity(0.16)).frame(width: 1, height: 6)
                            if tick != last { Spacer(minLength: 0) }
                        }
                    }
                    Capsule().fill(.white).frame(width: max(6, geometry.size.width * CGFloat(min(position, Double(last))) / CGFloat(last)), height: 6)
                }
                .frame(height: 18).contentShape(Rectangle())
                .gesture(DragGesture(minimumDistance: 0).onChanged { value in
                    isPlaying = false
                    position = max(0, min(1, value.location.x / max(1, geometry.size.width))) * Double(last)
                })
            }.frame(height: 18)
            HStack(spacing: 0) {
                ForEach(indices, id: \.self) { index in
                    Text(isNow(index) ? WindMapLabels.text("Now") : hourLabel(index))
                        .font(.system(size: 10, weight: isNow(index) ? .semibold : .regular))
                        .foregroundStyle(.white.opacity(isNow(index) ? 0.9 : 0.6)).frame(maxWidth: .infinity)
                }
            }
        }
        .environment(\.layoutDirection, .leftToRight)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(WindMapLabels.text("Forecast time"))
        .accessibilityValue(dates.first.map { appTimeFormatter(timeZone: timeZone).string(from: $0.addingTimeInterval(position * 3_600)) } ?? "—")
        .accessibilityAdjustableAction { direction in
            isPlaying = false
            if direction == .increment { position = min(Double(last), position + 1) }
            else if direction == .decrement { position = max(0, position - 1) }
        }
        .accessibilityIdentifier("weather.windMap.time")
    }
    private func isNow(_ index: Int) -> Bool {
        guard dates.indices.contains(index) else { return false }
        return floor(dates[index].timeIntervalSince1970 / 3_600) == floor(Date().timeIntervalSince1970 / 3_600)
    }
    private func hourLabel(_ index: Int) -> String {
        guard dates.indices.contains(index) else { return "—" }
        return appTimeFormatter(timeZone: timeZone, includesMinutes: false).string(from: dates[index])
    }
}

private struct WeatherMapLegend: View {
    let layer: WeatherMapLayer
    let imperial: Bool
    private var values: [Double] {
        switch layer {
        case .wind: [120, 80, 40, 0]
        case .temperature: [55, 30, 20, 10, 0, -20, -40]
        }
    }
    var body: some View {
        WeatherMapLegendLayout(maximumWidth: 140) {
          VStack(alignment: .leading, spacing: 0) {
            VStack(alignment: .leading, spacing: 2) {
                Text(layer.title).font(.system(size: 13, weight: .medium))
                Text(layer == .wind ? GlobalState.speedUnitLabel : GlobalState.temperatureUnitSymbol)
                    .font(.system(size: 12)).foregroundStyle(.white.opacity(0.62))
            }
            .lineLimit(1).minimumScaleFactor(0.6).padding(10)
            Rectangle().fill(.white.opacity(0.10)).frame(height: 0.5)
            HStack(spacing: 8) {
                LinearGradient(colors: values.map { Color(WindMapPalette.color(value: layer == .wind ? $0 / 3.6 : $0, layer: layer, fullScreen: true)) }, startPoint: .top, endPoint: .bottom)
                    .frame(width: 4, height: layer == .temperature ? 138 : 120).clipShape(Capsule())
                VStack(alignment: .leading, spacing: 0) {
                    ForEach(values, id: \.self) { value in
                        Text(label(value)).font(.system(size: 12)).foregroundStyle(.white.opacity(0.62))
                        if value != values.last { Spacer(minLength: 0) }
                    }
                }.frame(height: layer == .temperature ? 138 : 120)
            }.padding(10)
          }
        }.accessibilityElement(children: .combine)
    }
    private func label(_ value: Double) -> String {
        let converted = layer == .wind ? (imperial ? value / 1.609344 : value) : (GlobalState.temperatureUnit == "°F" ? value * 1.8 + 32 : value)
        return localizedIntegerString(Int(converted.rounded()))
    }
}

/// Keep short translations compact, and shrink long labels only after the cap.
private struct WeatherMapLegendLayout: Layout {
    let maximumWidth: CGFloat
    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        guard let content = subviews.first else { return .zero }
        let ideal = content.sizeThatFits(.unspecified)
        let width = min(ideal.width, maximumWidth, proposal.width ?? maximumWidth)
        return content.sizeThatFits(ProposedViewSize(width: width, height: nil))
    }
    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        subviews.first?.place(at: bounds.origin, proposal: ProposedViewSize(bounds.size))
    }
}
