import Foundation

@main
struct WindMapFieldTests {
    static func close(_ actual: Double, _ expected: Double, _ message: String) {
        precondition(abs(actual - expected) < 0.000_001, "\(message): \(actual) != \(expected)")
    }

    static func main() {
        let north = WindMapVector(speed: 10, direction: 0)
        close(north.east, 0, "North wind east component")
        close(north.north, -10, "North wind travels south")
        close(north.displaySpeed(imperial: false), 36, "Metres per second to km/h")
        close(north.displaySpeed(imperial: true), 22.369362920544, "Metres per second to mph")
        let east = WindMapVector(speed: 10, direction: 90)
        close(east.east, -10, "East wind travels west")
        close(east.north, 0, "East wind north component")
        close(east.direction, 90, "Direction round trip")
        let acrossNorth = WindMapVector.blend(.init(speed: 10, direction: 350), .init(speed: 10, direction: 10), fraction: 0.5)
        precondition(acrossNorth.north < -9 && abs(acrossNorth.east) < 0.001, "Blend vectors across north, never angles through south")
        let opposing = WindMapVector.blend(.init(speed: 10, direction: 0), .init(speed: 10, direction: 180), fraction: 0.5)
        close(opposing.speed, 0, "Opposing wind cancels without a fabricated direction")

        let grid = WindMapGrid(latitude: 48, longitude: 24)
        let date = Date(timeIntervalSince1970: 1_800_000_000)
        let points = grid.coordinates.enumerated().map { index, coordinate in
            let x = Double(index % 3), y = Double(index / 3)
            return WindMapPointForecast(coordinate: coordinate, dates: [date, date.addingTimeInterval(3_600)],
                vectors: [.init(east: x * 2, north: y * 6), .init(east: x * 2 + 2, north: y * 6 + 4)])
        }
        let field = WindMapField(grid: grid, fetchedAt: date, points: points)
        precondition(field.forecastDates(from: date.addingTimeInterval(1_800)) == [date, date.addingTimeInterval(3_600)], "Retain the current hour while a cached forecast ages")
        precondition(field.forecastDates(from: date.addingTimeInterval(3_601)) == [date.addingTimeInterval(3_600)], "Do not label a previous cached hour as Now")
        precondition(field.forecastDates(from: date.addingTimeInterval(7_200)).isEmpty, "Expired forecasts have no future hours")
        let value = field.vector(latitude: 48 + grid.latitudeStep * 0.5,
                                 longitude: 24 - grid.longitudeStep * 0.5,
                                 date: date.addingTimeInterval(1_800))!
        close(value.east, 2, "Bilinear space + linear time interpolation, east")
        close(value.north, 11, "Bilinear space + linear time interpolation, north")
        precondition(field.vector(latitude: 70, longitude: 24, date: date) == nil, "Never extrapolate beyond downloaded area")
        precondition(field.vector(latitude: 48, longitude: 24, date: date.addingTimeInterval(7_200)) == nil, "Never invent unavailable forecast hours")
        let corner = field.vector(latitude: 52, longitude: 24 + grid.longitudeStep, date: date)!
        close(corner.east, 4, "Inclusive north-east grid boundary")
        close(corner.north, 12, "Inclusive north-east grid boundary")
        let incomplete = WindMapField(grid: grid, fetchedAt: date, points: Array(points.prefix(8)))
        precondition(incomplete.dates.isEmpty && incomplete.vector(latitude: 48, longitude: 24, date: date) == nil)
        let gap = WindMapPointForecast(coordinate: grid.center, dates: [date, date.addingTimeInterval(10_800)], vectors: [north, east])
        precondition(gap.vector(at: date.addingTimeInterval(3_600)) == nil, "Do not bridge missing hourly forecasts")
        let dateLine = WindMapGrid(latitude: 0, longitude: 179.9)
        precondition(dateLine.position(latitude: 0, longitude: 179) != nil)
        precondition(dateLine.position(latitude: 0, longitude: -179) != nil)
        precondition(dateLine.coordinates.allSatisfy { (-180..<180).contains($0.longitude) })
        let polar = WindMapGrid(latitude: 90, longitude: -180)
        precondition(polar.coordinates.allSatisfy { abs($0.latitude) <= 80 && $0.longitude.isFinite })

        // Visible corners must be covered after panning or changing zoom, even
        // across the date line and up to MapKit's Mercator latitude boundary.
        for latitude in [-84.0, -65, -20, 0, 42.7, 70, 84] {
            for longitude in [-179.9, -110, 23.3, 179.9] {
                for span in [0.05, 0.5, 3, 9, 35, 90, 170, 360] {
                    let viewport = WindMapGrid(latitude: latitude, longitude: longitude,
                                               latitudeSpan: min(170, span), longitudeSpan: span)
                    for vertical in [-0.5, 0.0, 0.5] {
                        for horizontal in [-0.5, 0.0, 0.5] {
                            let lat = min(85.05112878, max(-85.05112878, latitude + min(170, span) * vertical))
                            let lon = WindMapCoordinate.wrappedLongitude(longitude + span * horizontal)
                            precondition(viewport.position(latitude: lat, longitude: lon) != nil,
                                         "Viewport corner not covered: \(latitude), \(longitude), \(span), \(lat), \(lon)")
                        }
                    }
                    precondition(viewport.coordinates.allSatisfy { abs($0.latitude) <= 85.051129 && (-180..<180).contains($0.longitude) })
                }
            }
        }
        let zoomed = WindMapGrid(latitude: 42, longitude: 24, latitudeSpan: 3, longitudeSpan: 3)
        let wide = WindMapGrid(latitude: 42, longitude: 24, latitudeSpan: 30, longitudeSpan: 30)
        precondition(zoomed.key != wide.key, "Cache keys must distinguish zoom levels")
        precondition(zoomed.side == 7 && zoomed.coordinates.count == 49 && grid.side == 3,
                     "Only fullscreen requests the denser forecast field")
        let detailedPoints = zoomed.coordinates.enumerated().map { index, coordinate in
            let x = Double(index % zoomed.side), y = Double(index / zoomed.side)
            return WindMapPointForecast(coordinate: coordinate, dates: [date],
                vectors: [.init(east: x, north: y)], temperaturesCelsius: [x + y * 2])
        }
        let detailed = WindMapField(grid: zoomed, fetchedAt: date, points: detailedPoints)
        for row in 0..<7 {
            for column in 0..<7 {
                let point = detailedPoints[row * 7 + column]
                close(detailed.scalar(latitude: point.coordinate.latitude, longitude: point.coordinate.longitude,
                                      date: date, layer: .temperature)!, Double(column + row * 2), "Retain each local temperature sample")
            }
        }
        let restoredDetailed = try! JSONDecoder().decode(WindMapField.self, from: JSONEncoder().encode(detailed))
        precondition(restoredDetailed.grid.side == 7 && restoredDetailed.points.count == 49)
        var flow = SIMD2<Double>(60, 0)
        for _ in 0..<180 {
            flow = WindMapFlow.advance(from: flow, seconds: 1.0 / 30) { point in
                .init(east: -point.y / 10, north: -point.x / 10)
            }!
        }
        precondition(abs(hypot(flow.x, flow.y) - 60) < 0.1 && flow.x < 0 && flow.y > 0,
                     "A rotating vector field produces a curved streamline without drifting outward")
        let straight = WindMapFlow.advance(from: .zero, seconds: 1) { _ in .init(east: 4, north: 0) }!
        close(straight.y, 0, "A uniform wind stays straight; do not invent decorative curves")
        let lightFlow = WindMapFlow.advance(from: .zero, seconds: 1) { _ in .init(east: 2, north: 0) }!
        let strongFlow = WindMapFlow.advance(from: .zero, seconds: 1) { _ in .init(east: 8, north: 0) }!
        close(strongFlow.x / lightFlow.x, 4, "Local wind speed ratios must be visible in particle motion")
        let laterFlow = WindMapFlow.advance(from: .zero, seconds: 0.5) { _ in .init(east: 8, north: 0) }!
        close(laterFlow.x, strongFlow.x / 2, "Flow speed follows elapsed time, independent of frame rate")
        precondition(WindMapFlow.advance(from: .zero, seconds: 1, sample: { _ in nil }) == nil,
                     "No flow where forecast data is missing")
        let scalarPoints = points.enumerated().map { index, point in
            var point = point
            point.temperaturesCelsius = [Double(index) * 2, Double(index) * 2 + 4]
            return point
        }
        let scalarField = WindMapField(grid: grid, fetchedAt: date, points: scalarPoints)
        let middle = date.addingTimeInterval(1_800)
        close(scalarField.scalar(latitude: 48, longitude: 24, date: middle, layer: .temperature)!, 10, "Temperature uses Celsius, interpolated in time")
        close(scalarField.scalar(latitude: 50, longitude: 24 - grid.longitudeStep / 2, date: middle, layer: .temperature)!, 12, "Temperature interpolates in space and time")
        precondition(scalarField.scalar(latitude: 48, longitude: 24, date: date.addingTimeInterval(7_200), layer: .temperature) == nil)
        precondition(field.scalar(latitude: 48, longitude: 24, date: date, layer: .temperature) == nil, "Missing scalar series remains unavailable")
        var marker = scalarPoints[0]
        marker.conditionSymbols = ["cloud.sun", "sun.max"]
        precondition(marker.symbol(at: middle) == "cloud.sun", "A condition symbol belongs to its forecast hour")
        precondition(marker.symbol(at: date.addingTimeInterval(-1)) == nil, "No symbol before the forecast")
        precondition(marker.symbol(at: date.addingTimeInterval(7_201)) == nil, "Do not reuse an expired condition symbol")
        marker.currentTemperatureCelsius = 13
        marker.lowTemperatureCelsius = 10
        marker.highTemperatureCelsius = 19
        let restoredMarker = try! JSONDecoder().decode(WindMapPointForecast.self, from: JSONEncoder().encode(marker))
        precondition(restoredMarker.lowTemperatureCelsius == 10 && restoredMarker.highTemperatureCelsius == 19)
        let decoded = try! JSONDecoder().decode(WindMapField.self, from: JSONEncoder().encode(scalarField))
        close(decoded.scalar(latitude: 48, longitude: 24, date: middle, layer: .temperature)!, 10, "Cache round-trip preserves temperature")
        for candidate in [scalarField, detailed] {
            for selected in [date, middle, date.addingTimeInterval(7_200)] {
                for layer in WeatherMapLayer.allCases {
                    let slice = WindMapTimeSlice(field: candidate, date: selected, layer: layer)
                    for lat in stride(from: candidate.grid.latitude - candidate.grid.latitudeStep * 1.1,
                                      through: candidate.grid.latitude + candidate.grid.latitudeStep * 1.1,
                                      by: candidate.grid.latitudeStep / 8) {
                        for lon in stride(from: candidate.grid.longitude - candidate.grid.longitudeStep * 1.1,
                                          through: candidate.grid.longitude + candidate.grid.longitudeStep * 1.1,
                                          by: candidate.grid.longitudeStep / 8) {
                            let expected = candidate.scalar(latitude: lat, longitude: lon, date: selected, layer: layer)
                            let actual = slice.scalar(latitude: lat, longitude: lon)
                            if let expected, let actual { close(actual, expected, "Cached frame must preserve forecast interpolation") }
                            else { precondition((expected == nil) == (actual == nil), "Missing coverage/time remains missing") }
                        }
                    }
                }
            }
        }
        close(WeatherMapPlayback.position(start: 4, elapsed: 2, end: 16), 8, "Playback resumes at the paused position")
        close(WeatherMapPlayback.position(start: 4, elapsed: 8, end: 16), 4, "One reference playback cycle")
        close(WeatherMapPlayback.position(start: 4, elapsed: 25, end: 16), 6, "Delayed frames catch up without accumulated drift")
        close(WeatherMapPlayback.position(start: 16, elapsed: 0, end: 16), 0, "Playing at the end restarts")
        close(WeatherMapPlayback.position(start: 0, elapsed: 10, end: 0), 0, "No playback range")
        print("PASS: vector/scalar interpolation, units, hourly gaps, cache round-trip, viewport coverage at every zoom, date line and polar bounds")
    }
}
