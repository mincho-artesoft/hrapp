// Shared with the web symbol exporter so light calendar backgrounds use the iOS palette.
#if os(macOS)
import AppKit
typealias TimelineSymbolColor = NSColor
#else
import UIKit
typealias TimelineSymbolColor = UIColor
#endif

func timelineWeatherColors(_ name: String, hourly: Bool) -> [TimelineSymbolColor] {
    let moon: TimelineSymbolColor
    #if os(macOS)
    moon = hourly ? NSColor(srgbRed: 0.78, green: 0.78, blue: 0.80, alpha: 1) : .systemBlue
    #else
    moon = hourly ? .systemGray3 : .systemBlue
    #endif
    switch name {
    case "sun.max", "sunrise": return [.systemOrange, .systemOrange]
    case "sunset": return [.systemOrange, .systemRed]
    case "cloud.sun", "cloud.bolt", "cloud.sun.rain": return [.systemGray, .systemOrange]
    case "cloud.sun.bolt": return [.systemGray, .systemOrange, .systemOrange]
    case "cloud", "wind", "tornado": return [.systemGray]
    case "cloud.rain", "cloud.drizzle", "cloud.heavyrain", "cloud.rain.heavy": return [.systemGray, .systemIndigo]
    case "cloud.snow", "cloud.fog", "fog", "smoke", "haze", "wind.snow": return [.systemGray, .systemGray]
    case "mist": return [.systemGray, .systemBlue]
    case "moon", "moon.fill": return [moon, moon]
    case "moon.stars": return [moon, .systemOrange]
    case "cloud.moon.fill": return [hourly ? moon : .systemGray, .systemBlue, hourly ? moon : .systemGray]
    case "cloud.moon": return [.systemGray, moon]
    default: return [.systemBlue]
    }
}

#if os(macOS)
func timelineWeatherImage(_ name: String, light: Bool, hourly: Bool) -> NSImage? {
    guard let symbol = NSImage(systemSymbolName: name + ".fill", accessibilityDescription: nil)
            ?? NSImage(systemSymbolName: name, accessibilityDescription: nil) else { return nil }
    let configuration: NSImage.SymbolConfiguration = light
        ? .init(paletteColors: timelineWeatherColors(name, hourly: hourly))
        : .preferringMulticolor()
    return symbol.withSymbolConfiguration(configuration)
}
#endif
