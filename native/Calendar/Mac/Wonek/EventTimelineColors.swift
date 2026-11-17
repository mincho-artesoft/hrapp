// Ported from Wonek CalendarKit/EventTimelineColors.swift. HRApp data adapters are in MacCalendarAdapters.swift.
#if os(macOS)
#if os(iOS) || os(macOS)
#if os(iOS)
import UIKit
typealias CalendarTimelineNativeColor = UIColor
#else
import AppKit
typealias CalendarTimelineNativeColor = NSColor
#endif

/// Shared palette for detail previews and the interactive day timelines.
enum EventTimelineColors {
    static func text(_ color: CalendarTimelineNativeColor, strength: CGFloat, dark: Bool) -> CalendarTimelineNativeColor {
        let strength = dark && strength < 0.8 ? 1 : strength
        var r: CGFloat = 0, g: CGFloat = 0, b: CGFloat = 0, a: CGFloat = 0
        guard components(color, red: &r, green: &g, blue: &b, alpha: &a) else { return color }
        return CalendarTimelineNativeColor(red: r * strength, green: g * strength, blue: b * strength, alpha: a)
    }

    static func background(_ color: CalendarTimelineNativeColor, selected: Bool, depth: Int, dark: Bool) -> CalendarTimelineNativeColor {
        var r: CGFloat = 0, g: CGFloat = 0, b: CGFloat = 0, a: CGFloat = 0
        guard components(color, red: &r, green: &g, blue: &b, alpha: &a) else { return color }
        if dark {
            let strength: CGFloat = selected ? 0.90 : 0.33 + CGFloat(min(depth, 2)) * 0.025
            return CalendarTimelineNativeColor(red: r * strength, green: g * strength, blue: b * strength, alpha: 1)
        }
        if selected {
            return CalendarTimelineNativeColor(red: r * 0.9 + 0.1, green: g * 0.9 + 0.1, blue: b * 0.9 + 0.1, alpha: 1)
        }
        return color.withAlphaComponent(depth == 0 ? 0.15 : (depth == 1 ? 0.09 : 0.07))
    }

    private static func components(_ color: CalendarTimelineNativeColor,
        red: inout CGFloat, green: inout CGFloat, blue: inout CGFloat, alpha: inout CGFloat) -> Bool {
        #if os(iOS)
        return color.getRed(&red, green: &green, blue: &blue, alpha: &alpha)
        #else
        guard let rgb = color.usingColorSpace(.deviceRGB) else { return false }
        rgb.getRed(&red, green: &green, blue: &blue, alpha: &alpha)
        return true
        #endif
    }
}

#endif

#endif
