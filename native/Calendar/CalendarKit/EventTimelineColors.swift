import UIKit

/// Shared palette for detail previews and the interactive day timelines.
enum EventTimelineColors {
    static func text(_ color: UIColor, strength: CGFloat, dark: Bool) -> UIColor {
        let strength = dark && strength < 0.8 ? 1 : strength
        var r: CGFloat = 0, g: CGFloat = 0, b: CGFloat = 0, a: CGFloat = 0
        guard color.getRed(&r, green: &g, blue: &b, alpha: &a) else { return color }
        return UIColor(red: r * strength, green: g * strength, blue: b * strength, alpha: a)
    }

    static func background(_ color: UIColor, selected: Bool, depth: Int, dark: Bool) -> UIColor {
        var r: CGFloat = 0, g: CGFloat = 0, b: CGFloat = 0, a: CGFloat = 0
        guard color.getRed(&r, green: &g, blue: &b, alpha: &a) else { return color }
        if dark {
            let strength: CGFloat = selected ? 0.90 : 0.33 + CGFloat(min(depth, 2)) * 0.025
            return UIColor(red: r * strength, green: g * strength, blue: b * strength, alpha: 1)
        }
        if selected {
            return UIColor(red: r * 0.9 + 0.1, green: g * 0.9 + 0.1, blue: b * 0.9 + 0.1, alpha: 1)
        }
        return color.withAlphaComponent(depth == 0 ? 0.15 : (depth == 1 ? 0.09 : 0.07))
    }
}
