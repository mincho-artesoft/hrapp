#if os(iOS)
import UIKit
typealias EventTimelinePlatformColor = UIColor
#else
import AppKit
typealias EventTimelinePlatformColor = NSColor
#endif

/// Shared palette for detail previews and the interactive day timelines.
enum EventTimelineColors {
    static func text(_ color: EventTimelinePlatformColor, strength: CGFloat, dark: Bool) -> EventTimelinePlatformColor {
        let strength = dark && strength < 0.8 ? 1 : strength
        var r: CGFloat = 0, g: CGFloat = 0, b: CGFloat = 0, a: CGFloat = 0
        #if os(iOS)
        guard color.getRed(&r, green: &g, blue: &b, alpha: &a) else { return color }
        #else
        guard let rgb = color.usingColorSpace(.deviceRGB) else { return color }
        rgb.getRed(&r, green: &g, blue: &b, alpha: &a)
        #endif
        return EventTimelinePlatformColor(red: r * strength, green: g * strength, blue: b * strength, alpha: a)
    }

    static func background(_ color: EventTimelinePlatformColor, selected: Bool, depth: Int, dark: Bool) -> EventTimelinePlatformColor {
        var r: CGFloat = 0, g: CGFloat = 0, b: CGFloat = 0, a: CGFloat = 0
        #if os(iOS)
        guard color.getRed(&r, green: &g, blue: &b, alpha: &a) else { return color }
        #else
        guard let rgb = color.usingColorSpace(.deviceRGB) else { return color }
        rgb.getRed(&r, green: &g, blue: &b, alpha: &a)
        #endif
        if dark {
            let strength: CGFloat = selected ? 0.90 : 0.33 + CGFloat(min(depth, 2)) * 0.025
            return EventTimelinePlatformColor(red: r * strength, green: g * strength, blue: b * strength, alpha: 1)
        }
        if selected {
            return EventTimelinePlatformColor(red: r * 0.9 + 0.1, green: g * 0.9 + 0.1, blue: b * 0.9 + 0.1, alpha: 1)
        }
        return color.withAlphaComponent(depth == 0 ? 0.15 : (depth == 1 ? 0.09 : 0.07))
    }
}
