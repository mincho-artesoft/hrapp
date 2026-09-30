import Foundation
import Combine
import CoreLocation
@preconcurrency import WeatherKit

extension WindMapPointForecast {
    init(coordinate: WindMapCoordinate, hours: [HourWeather]) {
        let hours = hours.sorted { $0.date < $1.date }
        self.init(coordinate: coordinate, dates: hours.map(\.date),
            vectors: hours.map { WindMapVector(speed: $0.wind.speed.converted(to: .metersPerSecond).value,
                                               direction: $0.wind.direction.converted(to: .degrees).value) },
            temperaturesCelsius: hours.map { $0.temperature.converted(to: .celsius).value },
            gustsMetersPerSecond: hours.map { $0.wind.gust?.converted(to: .metersPerSecond).value },
            conditionSymbols: hours.map(\.symbolName))
    }
}

/// Shared across maps. Coverage is quantized and cached; obsolete viewport
/// requests are cancelled and each grid uses at most three requests at once.
actor WindMapForecastCache {
    static let shared = WindMapForecastCache()
    private var fields: [String: WindMapField] = [:]
    private struct Pending { let id: UUID; let task: Task<WindMapField, Error> }
    private var pending: [String: Pending] = [:]
    private var lastFailure: [String: Date] = [:]
    private let lifetime: TimeInterval = 30 * 60
    private var restored = false

    private var fileURL: URL {
        FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask)[0]
            .appendingPathComponent("WeatherMapForecast-v4.json")
    }

    func field(for grid: WindMapGrid) async throws -> WindMapField {
        restoreIfNeeded()
        if let cached = fields[grid.key], Date().timeIntervalSince(cached.fetchedAt) < lifetime,
           cached.dates.count >= 2 { return cached }
        if let existing = pending[grid.key] { return try await existing.task.value }
        for key in Array(pending.keys) where key != grid.key {
            pending.removeValue(forKey: key)?.task.cancel()
        }
        if let failure = lastFailure[grid.key], Date().timeIntervalSince(failure) < 15 {
            throw URLError(.cannotLoadFromNetwork)
        }
        let requestID = UUID()
        // Adjacent snapped viewports share sample coordinates. Reuse those
        // forecasts instead of issuing 49 new requests for every small pan.
        let fresh = fields.values.filter { Date().timeIntervalSince($0.fetchedAt) < lifetime }
        var cachedPoints: [String: WindMapPointForecast] = [:]
        for field in fresh.sorted(by: { $0.fetchedAt < $1.fetchedAt }) {
            for point in field.points { cachedPoints[Self.pointKey(point.coordinate)] = point }
        }
        let samples = cachedPoints
        let task = Task<WindMapField, Error> {
            let start = Date(timeIntervalSince1970: floor(Date().timeIntervalSince1970 / 3_600) * 3_600 - 4 * 3_600)
            let coordinates = grid.coordinates
            let forecasts = try await withThrowingTaskGroup(of: (Int, WindMapPointForecast).self) { group in
                var results: [Int: WindMapPointForecast] = [:]
                var nextIndex = 0
                func add(_ index: Int) {
                    let point = coordinates[index]
                    group.addTask {
                        try Task.checkCancellation()
                        if let cached = samples[Self.pointKey(point)] { return (index, cached) }
                        let forecast = try await WeatherService.shared.weather(
                            for: CLLocation(latitude: point.latitude, longitude: point.longitude),
                            including: .hourly(startDate: start, endDate: start.addingTimeInterval(25 * 3_600))
                        )
                        let hours = forecast.forecast.sorted { $0.date < $1.date }
                        guard hours.count >= 2 else { throw URLError(.badServerResponse) }
                        return (index, WindMapPointForecast(
                            coordinate: point,
                            dates: hours.map(\.date),
                            vectors: hours.map { WindMapVector(speed: $0.wind.speed.converted(to: .metersPerSecond).value,
                                                               direction: $0.wind.direction.value) },
                            temperaturesCelsius: hours.map { $0.temperature.converted(to: .celsius).value },
                            gustsMetersPerSecond: hours.map { $0.wind.gust?.converted(to: .metersPerSecond).value }
                        ))
                    }
                }
                for _ in 0..<3 { add(nextIndex); nextIndex += 1 }
                while let (index, forecast) = try await group.next() {
                    results[index] = forecast
                    if nextIndex < coordinates.count { add(nextIndex); nextIndex += 1 }
                }
                return coordinates.indices.compactMap { results[$0] }
            }
            try Task.checkCancellation()
            let field = WindMapField(grid: grid, fetchedAt: Date(), points: forecasts)
            guard field.dates.count >= 2 else { throw URLError(.badServerResponse) }
            return field
        }
        pending[grid.key] = Pending(id: requestID, task: task)
        do {
            let result = try await task.value
            if pending[grid.key]?.id == requestID { pending[grid.key] = nil }
            lastFailure[grid.key] = nil
            fields[grid.key] = result
            fields = fields.filter { Date().timeIntervalSince($0.value.fetchedAt) < lifetime }
            if fields.count > 12, let oldest = fields.min(by: { $0.value.fetchedAt < $1.value.fetchedAt })?.key {
                fields[oldest] = nil
            }
            if let data = try? JSONEncoder().encode(fields) { try? data.write(to: fileURL, options: .atomic) }
            return result
        } catch {
            if pending[grid.key]?.id == requestID {
                pending[grid.key] = nil
                if !(error is CancellationError) { lastFailure[grid.key] = Date() }
            }
            print("[WindMap] Forecast unavailable: \(error)")
            throw error
        }
    }

    private func restoreIfNeeded() {
        guard !restored else { return }
        restored = true
        guard let data = try? Data(contentsOf: fileURL),
              let saved = try? JSONDecoder().decode([String: WindMapField].self, from: data) else { return }
        fields = saved.filter { Date().timeIntervalSince($0.value.fetchedAt) < lifetime && $0.value.points.count == $0.value.grid.pointCount }
    }

    private nonisolated static func pointKey(_ point: WindMapCoordinate) -> String {
        "\(Int((point.latitude * 1_000_000).rounded())):\(Int((point.longitude * 1_000_000).rounded()))"
    }

    func cancel(_ grid: WindMapGrid) {
        pending.removeValue(forKey: grid.key)?.task.cancel()
    }
}

@MainActor
final class WindMapStore: ObservableObject {
    @Published private(set) var field: WindMapField?
    @Published private(set) var allDates: [Date] = []
    @Published private(set) var isLoading = false
    @Published private(set) var failed = false
    @Published var hour = 0
    @Published var isPlaying = false
    private var generation = UUID()

    var dates: [Date] {
        let hour = floor(Date().timeIntervalSince1970 / 3_600) * 3_600
        return allDates.filter { $0.timeIntervalSince1970 >= hour }
    }
    var selectedDate: Date { dates.isEmpty ? Date() : dates[min(max(0, hour), dates.count - 1)] }

    func load(_ coordinate: CLLocationCoordinate2D) async {
        guard CLLocationCoordinate2DIsValid(coordinate) else { return }
        await load(WindMapGrid(latitude: coordinate.latitude, longitude: coordinate.longitude))
    }

    func load(_ grid: WindMapGrid) async {
        let request = UUID()
        generation = request
        if field?.grid == grid, let fetchedAt = field?.fetchedAt, Date().timeIntervalSince(fetchedAt) < 30 * 60 {
            // Returning to the visible region also invalidates an in-flight pan.
            isLoading = false
            failed = false
            return
        }
        isLoading = true
        failed = false
        let timeout = Task { [weak self] in
            do { try await Task.sleep(for: .seconds(30)) } catch { return }
            guard let self, self.generation == request, self.isLoading else { return }
            self.generation = UUID()
            self.isLoading = false
            self.failed = true
            await WindMapForecastCache.shared.cancel(grid)
        }
        defer { timeout.cancel() }
        // Keep the existing area visible until the replacement is ready.
        // Sampling outside that field still returns nil, never extrapolated data.
        do {
            let loaded = try await WindMapForecastCache.shared.field(for: grid)
            guard generation == request else { return }
            allDates = loaded.dates
            field = loaded
            isLoading = false
        } catch {
            guard generation == request else { return }
            isLoading = false
            failed = true
        }
    }

    func advance() {
        guard isPlaying, !dates.isEmpty else { return }
        hour = (hour + 1) % dates.count
    }
}

struct WeatherMapPlaceConditions: Sendable {
    let wind: WindMapVector
    let gust: Double?
    let temperatureCelsius: Double

    @MainActor
    func summary(layer: WeatherMapLayer, imperial: Bool) -> String {
        switch layer {
        case .wind:
            let speed = localizedIntegerString(Int(wind.displaySpeed(imperial: imperial).rounded())) + " " + GlobalState.speedUnitLabel
            guard let gust else { return speed }
            let gustValue = gust * (imperial ? 3_600 / 1_609.344 : 3.6)
            return speed + ", " + NSLocalizedString("Gusts", comment: "Wind gusts") + " " + localizedIntegerString(Int(gustValue.rounded())) + " " + GlobalState.speedUnitLabel
        case .temperature:
            return localizedIntegerString(Int((GlobalState.temperatureUnit == "°F" ? temperatureCelsius * 1.8 + 32 : temperatureCelsius).rounded())) + GlobalState.temperatureUnitSymbol
        }
    }
}

actor WeatherMapPlaceCache {
    static let shared = WeatherMapPlaceCache()
    private var saved: [String: (Date, WeatherMapPlaceConditions)] = [:]
    private var forecasts: [String: (Date, WindMapPointForecast)] = [:]

    func forecast(for coordinate: CLLocationCoordinate2D) async throws -> WindMapPointForecast {
        let key = "\(coordinate.latitude):\(coordinate.longitude)"
        if let (date, value) = forecasts[key], Date().timeIntervalSince(date) < 1_800 { return value }
        let now = Date()
        let (hourly, daily, current) = try await WeatherService.shared.weather(
            for: CLLocation(latitude: coordinate.latitude, longitude: coordinate.longitude),
            including: .hourly(startDate: now.addingTimeInterval(-4 * 3_600), endDate: now.addingTimeInterval(24 * 3_600)), .daily, .current)
        try Task.checkCancellation()
        var value = WindMapPointForecast(coordinate: .init(latitude: coordinate.latitude, longitude: coordinate.longitude),
                                         hours: Array(hourly.forecast.prefix(48)))
        value.currentWind = WindMapVector(speed: current.wind.speed.converted(to: .metersPerSecond).value,
                                          direction: current.wind.direction.converted(to: .degrees).value)
        value.currentTemperatureCelsius = current.temperature.converted(to: .celsius).value
        value.currentSymbol = current.symbolName
        value.lowTemperatureCelsius = daily.forecast.first?.lowTemperature.converted(to: .celsius).value
        value.highTemperatureCelsius = daily.forecast.first?.highTemperature.converted(to: .celsius).value
        forecasts[key] = (Date(), value)
        forecasts = forecasts.filter { Date().timeIntervalSince($0.value.0) < 1_800 }
        return value
    }
    func conditions(for coordinate: CLLocationCoordinate2D) async throws -> WeatherMapPlaceConditions {
        let key = "\(coordinate.latitude):\(coordinate.longitude)"
        if let (date, value) = saved[key], Date().timeIntervalSince(date) < 1_800 { return value }
        let current = try await WeatherService.shared.weather(
            for: CLLocation(latitude: coordinate.latitude, longitude: coordinate.longitude), including: .current)
        let result = WeatherMapPlaceConditions(
            wind: WindMapVector(speed: current.wind.speed.converted(to: .metersPerSecond).value, direction: current.wind.direction.value),
            gust: current.wind.gust?.converted(to: .metersPerSecond).value,
            temperatureCelsius: current.temperature.converted(to: .celsius).value)
        saved[key] = (Date(), result)
        saved = saved.filter { Date().timeIntervalSince($0.value.0) < 1_800 }
        return result
    }
}
