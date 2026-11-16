import Foundation

enum WeatherMapLayer: String, CaseIterable, Sendable {
    case temperature, wind
}

/// East/north velocity in metres per second. Weather directions describe where
/// wind comes FROM; particles travel in the opposite direction.
struct WindMapVector: Codable, Equatable, Sendable {
    var east: Double
    var north: Double

    init(speed: Double, direction: Double) {
        let radians = direction * .pi / 180
        east = -speed * sin(radians)
        north = -speed * cos(radians)
    }

    init(east: Double, north: Double) {
        self.east = east
        self.north = north
    }

    var speed: Double { hypot(east, north) }
    func displaySpeed(imperial: Bool) -> Double { speed * (imperial ? 3_600 / 1_609.344 : 3.6) }
    var direction: Double { (atan2(-east, -north) * 180 / .pi + 360).truncatingRemainder(dividingBy: 360) }

    static func blend(_ a: Self, _ b: Self, fraction: Double) -> Self {
        Self(east: a.east + (b.east - a.east) * fraction,
             north: a.north + (b.north - a.north) * fraction)
    }
}

/// Screen-space midpoint integration. Curvature comes only from the sampled
/// forecast vectors; no decorative curl/noise is added to the weather data.
enum WindMapFlow {
    static func advance(from point: SIMD2<Double>, seconds: Double,
                        sample: (SIMD2<Double>) -> WindMapVector?) -> SIMD2<Double>? {
        guard seconds >= 0, let wind = sample(point), wind.speed > 0.15 else { return nil }
        // Preserve local speed ratios through ordinary weather conditions.
        // Bound only near-calm/extreme winds so motion remains readable.
        let speed = min(90, max(2, wind.speed * 3))
        let velocity = SIMD2(wind.east, -wind.north) / wind.speed * speed
        let middle = point + velocity * seconds / 2
        let direction = sample(middle) ?? wind
        guard direction.speed > 0.15 else { return point }
        return point + SIMD2(direction.east, -direction.north) / direction.speed * speed * seconds
    }
}

struct WindMapCoordinate: Codable, Equatable, Sendable {
    var latitude: Double
    var longitude: Double

    static func wrappedLongitude(_ value: Double) -> Double {
        (value + 540).truncatingRemainder(dividingBy: 360) - 180
    }
}

/// The card uses 3 × 3 samples; fullscreen uses 7 × 7 at the visible scale.
/// Steps describe the half-width of coverage, not the distance between samples.
struct WindMapGrid: Codable, Equatable, Sendable {
    let latitude: Double
    let longitude: Double
    let latitudeStep: Double
    let longitudeStep: Double
    let side: Int
    var pointCount: Int { side * side }

    init(latitude: Double, longitude: Double) {
        side = 3
        self.latitude = min(76, max(-76, (latitude / 2).rounded() * 2))
        self.longitude = WindMapCoordinate.wrappedLongitude((longitude / 2).rounded() * 2)
        latitudeStep = 4
        longitudeStep = 4 / max(0.3, cos(self.latitude * .pi / 180))
    }

    /// Quantized coverage grows with the viewport, including at world scale.
    /// The extra margin avoids a new request for every small pan.
    init(latitude: Double, longitude: Double, latitudeSpan: Double, longitudeSpan: Double) {
        side = 7
        let mercatorLimit = 85.05112878
        let latStep = min(mercatorLimit, pow(2, ceil(log2(max(0.125, abs(latitudeSpan) * 0.65)) * 2) / 2))
        let lonStep = min(180, pow(2, ceil(log2(max(0.125, abs(longitudeSpan) * 0.65)) * 2) / 2))
        latitudeStep = latStep
        longitudeStep = lonStep
        self.latitude = min(mercatorLimit - latStep, max(-mercatorLimit + latStep, (latitude / (latStep / 3)).rounded() * latStep / 3))
        self.longitude = lonStep == 180 ? 0 : WindMapCoordinate.wrappedLongitude((longitude / (lonStep / 3)).rounded() * lonStep / 3)
    }

    var key: String { "\(latitude):\(longitude):\(latitudeStep):\(longitudeStep):\(side)" }
    var center: WindMapCoordinate { .init(latitude: latitude, longitude: longitude) }

    var coordinates: [WindMapCoordinate] {
        (0..<pointCount).map { index in
            .init(latitude: latitude + (Double(index / side) * 2 / Double(side - 1) - 1) * latitudeStep,
                  longitude: WindMapCoordinate.wrappedLongitude(longitude + (Double(index % side) * 2 / Double(side - 1) - 1) * longitudeStep))
        }
    }

    func position(latitude: Double, longitude: Double) -> (x: Double, y: Double)? {
        let delta = WindMapCoordinate.wrappedLongitude(longitude - self.longitude)
        let x = delta / longitudeStep + 1
        let y = (latitude - self.latitude) / latitudeStep + 1
        guard x.isFinite, y.isFinite, x >= 0, x <= 2, y >= 0, y <= 2 else { return nil }
        let scale = Double(side - 1) / 2
        return (x * scale, y * scale)
    }
}

struct WindMapPointForecast: Codable, Sendable {
    let coordinate: WindMapCoordinate
    let dates: [Date]
    let vectors: [WindMapVector]
    var temperaturesCelsius: [Double] = []
    var gustsMetersPerSecond: [Double?] = []
    var conditionSymbols: [String]?
    var currentWind: WindMapVector?
    var currentTemperatureCelsius: Double?
    var currentSymbol: String?
    var lowTemperatureCelsius: Double?
    var highTemperatureCelsius: Double?

    func symbol(at date: Date) -> String? {
        guard let conditionSymbols, conditionSymbols.count == dates.count,
              let index = dates.lastIndex(where: { $0 <= date }),
              date.timeIntervalSince(dates[index]) < 3_600 else { return nil }
        return conditionSymbols[index]
    }

    func scalar(at date: Date, layer: WeatherMapLayer) -> Double? {
        let values: [Double]
        switch layer {
        case .temperature: values = temperaturesCelsius
        case .wind: return vector(at: date)?.speed
        }
        guard values.count == dates.count, let first = dates.first, let last = dates.last,
              date >= first, date <= last, let upper = dates.firstIndex(where: { $0 >= date }) else { return nil }
        if upper == 0 || dates[upper] == date { return values[upper] }
        let interval = dates[upper].timeIntervalSince(dates[upper - 1])
        guard interval > 0, interval <= 5_400 else { return nil }
        return values[upper - 1] + (values[upper] - values[upper - 1]) * date.timeIntervalSince(dates[upper - 1]) / interval
    }

    func vector(at date: Date) -> WindMapVector? {
        guard dates.count == vectors.count,
              let first = dates.first, let last = dates.last,
              date >= first, date <= last else { return nil }
        guard let upper = dates.firstIndex(where: { $0 >= date }) else { return nil }
        if upper == 0 || dates[upper] == date { return vectors[upper] }
        let lower = upper - 1
        let interval = dates[upper].timeIntervalSince(dates[lower])
        guard interval > 0, interval <= 3_600 * 1.5 else { return nil }
        return .blend(vectors[lower], vectors[upper], fraction: date.timeIntervalSince(dates[lower]) / interval)
    }
}

struct WindMapField: Codable, Sendable {
    let grid: WindMapGrid
    let fetchedAt: Date
    /// Row-major, south to north, west to east.
    let points: [WindMapPointForecast]

    var dates: [Date] {
        guard points.count == grid.pointCount, let first = points.first else { return [] }
        return first.dates.filter { date in points.allSatisfy { $0.vector(at: date) != nil } }
    }

    func forecastDates(from now: Date = Date()) -> [Date] {
        let hour = floor(now.timeIntervalSince1970 / 3_600) * 3_600
        return dates.filter { $0.timeIntervalSince1970 >= hour }
    }

    func vector(latitude: Double, longitude: Double, date: Date) -> WindMapVector? {
        guard points.count == grid.pointCount, let position = grid.position(latitude: latitude, longitude: longitude) else { return nil }
        let side = grid.side
        let column = min(side - 2, Int(position.x))
        let row = min(side - 2, Int(position.y))
        let fx = position.x - Double(column)
        let fy = position.y - Double(row)
        guard let a = points[row * side + column].vector(at: date),
              let b = points[row * side + column + 1].vector(at: date),
              let c = points[(row + 1) * side + column].vector(at: date),
              let d = points[(row + 1) * side + column + 1].vector(at: date) else { return nil }
        return .blend(.blend(a, b, fraction: fx), .blend(c, d, fraction: fx), fraction: fy)
    }

    func scalar(latitude: Double, longitude: Double, date: Date, layer: WeatherMapLayer) -> Double? {
        if layer == .wind { return vector(latitude: latitude, longitude: longitude, date: date)?.speed }
        guard points.count == grid.pointCount, let position = grid.position(latitude: latitude, longitude: longitude) else { return nil }
        let side = grid.side
        let column = min(side - 2, Int(position.x)), row = min(side - 2, Int(position.y))
        let fx = position.x - Double(column), fy = position.y - Double(row)
        guard let a = points[row * side + column].scalar(at: date, layer: layer),
              let b = points[row * side + column + 1].scalar(at: date, layer: layer),
              let c = points[(row + 1) * side + column].scalar(at: date, layer: layer),
              let d = points[(row + 1) * side + column + 1].scalar(at: date, layer: layer) else { return nil }
        return (a + (b - a) * fx) * (1 - fy) + (c + (d - c) * fx) * fy
    }
}

/// Resolve hourly interpolation once per forecast frame, not once per pixel.
/// This immutable value can be sampled by a background raster worker.
struct WindMapTimeSlice: Sendable {
    let grid: WindMapGrid
    let layer: WeatherMapLayer
    private let vectors: [WindMapVector?]
    private let values: [Double?]

    init(field: WindMapField, date: Date, layer: WeatherMapLayer) {
        grid = field.grid
        self.layer = layer
        vectors = layer == .wind ? field.points.map { $0.vector(at: date) } : []
        values = layer == .wind ? [] : field.points.map { $0.scalar(at: date, layer: layer) }
    }

    private func cell(latitude: Double, longitude: Double) -> (a: Int, b: Int, c: Int, d: Int, x: Double, y: Double)? {
        guard let p = grid.position(latitude: latitude, longitude: longitude) else { return nil }
        let column = min(grid.side - 2, Int(p.x)), row = min(grid.side - 2, Int(p.y))
        let a = row * grid.side + column
        return (a, a + 1, a + grid.side, a + grid.side + 1, p.x - Double(column), p.y - Double(row))
    }

    func vector(latitude: Double, longitude: Double) -> WindMapVector? {
        guard vectors.count == grid.pointCount, let c = cell(latitude: latitude, longitude: longitude),
              let a = vectors[c.a], let b = vectors[c.b], let bottom = vectors[c.c], let d = vectors[c.d] else { return nil }
        return .blend(.blend(a, b, fraction: c.x), .blend(bottom, d, fraction: c.x), fraction: c.y)
    }

    func scalar(latitude: Double, longitude: Double) -> Double? {
        if layer == .wind { return vector(latitude: latitude, longitude: longitude)?.speed }
        guard values.count == grid.pointCount, let c = cell(latitude: latitude, longitude: longitude),
              let a = values[c.a], let b = values[c.b], let bottom = values[c.c], let d = values[c.d] else { return nil }
        return (a + (b - a) * c.x) * (1 - c.y) + (bottom + (d - bottom) * c.x) * c.y
    }
}

/// The recorded Apple 12-hour rain and wind controls loop in about eight seconds.
/// Elapsed time keeps that cadence independent of network/rendering delays.
enum WeatherMapPlayback {
    static let duration: TimeInterval = 8
    static func position(start: Double, elapsed: TimeInterval, end: Double) -> Double {
        guard end > 0 else { return 0 }
        return (max(0, min(end, start)) + max(0, elapsed) / duration * end).truncatingRemainder(dividingBy: end)
    }
}
