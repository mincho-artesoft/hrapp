import Foundation
@main struct Benchmark {
    static func main() {
        let grid = WindMapGrid(latitude: 42.7, longitude: 23.3, latitudeSpan: 6, longitudeSpan: 4)
        let now = Date()
        let dates = (0..<26).map { now.addingTimeInterval(Double($0) * 3600) }
        let points = grid.coordinates.enumerated().map { index, coordinate in
            WindMapPointForecast(coordinate: coordinate, dates: dates,
                vectors: dates.map { _ in WindMapVector(east: 3, north: 4) },
                temperaturesCelsius: dates.indices.map { Double($0 + index) / 3 })
        }
        let field = WindMapField(grid: grid, fetchedAt: now, points: points)
        let selected = now.addingTimeInterval(12.5 * 3600)
        let slice = WindMapTimeSlice(field: field, date: selected, layer: .temperature)
        let coordinates = (0..<(192 * 192)).map { i in
            WindMapCoordinate(latitude: grid.latitude + (Double(i / 192) / 192 * 2 - 1) * grid.latitudeStep,
                longitude: grid.longitude + (Double(i % 192) / 192 * 2 - 1) * grid.longitudeStep)
        }
        var referenceSum = 0.0, sliceSum = 0.0
        let start = Date()
        for _ in 0..<5 { for c in coordinates { referenceSum += field.scalar(latitude: c.latitude, longitude: c.longitude, date: selected, layer: .temperature) ?? 0 } }
        let middle = Date()
        for _ in 0..<5 { for c in coordinates { sliceSum += slice.scalar(latitude: c.latitude, longitude: c.longitude) ?? 0 } }
        let end = Date()
        precondition(abs(referenceSum - sliceSum) < 0.001)
        print("192×192 temperature sampling, 49 points, 26 hourly forecasts, macOS Debug, mean of 5 frames")
        print(String(format: "Previous %.2f ms/frame; time slice %.2f ms/frame; %.1fx faster; matching sums %.3f", middle.timeIntervalSince(start)*200, end.timeIntervalSince(middle)*200, middle.timeIntervalSince(start)/end.timeIntervalSince(middle), sliceSum))
    }
}
