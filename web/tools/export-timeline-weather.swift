// Compile together with native/Calendar/Components/TimelineWeatherPalette.swift.
import AppKit
import SwiftUI

@main
struct ExportTimelineWeather {
    @MainActor static func main() throws {
        let directory = URL(filePath: CommandLine.arguments[1], directoryHint: .isDirectory)
        try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
        for name in CommandLine.arguments.dropFirst(2) {
            for hourly in [false, true] {
                if hourly && timelineWeatherColors(name, hourly: true) == timelineWeatherColors(name, hourly: false) { continue }
                guard let image = timelineWeatherImage(name, light: true, hourly: hourly) else { continue }
                let symbol = Image(nsImage: image).renderingMode(.original).resizable().scaledToFit()
                    .frame(width: 80, height: 80).environment(\.colorScheme, .light)
                let renderer = ImageRenderer(content: symbol)
                if let cg = renderer.cgImage, let data = NSBitmapImageRep(cgImage: cg).representation(using: .png, properties: [:]) {
                    try data.write(to: directory.appendingPathComponent((hourly ? "hourly-" : "") + name + ".png"))
                }
            }
        }
    }
}
