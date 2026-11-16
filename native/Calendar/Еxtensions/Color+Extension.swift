import SwiftUI
import UIKit

extension Color {
    /// sRGB components, resolved through `UIColor` so dynamic and named
    /// colours are flattened the same way the renderer would flatten them.
    private var sRGBComponents: (red: Double, green: Double, blue: Double, alpha: Double)? {
        var red: CGFloat = 0
        var green: CGFloat = 0
        var blue: CGFloat = 0
        var alpha: CGFloat = 0
        guard UIColor(self).getRed(&red, green: &green, blue: &blue, alpha: &alpha) else {
            return nil
        }
        return (Double(red), Double(green), Double(blue), Double(alpha))
    }

    /// Perceived brightness, using the sRGB luma coefficients.
    private var perceivedBrightness: Double? {
        guard let c = sRGBComponents else { return nil }
        return 0.2126 * c.red + 0.7152 * c.green + 0.0722 * c.blue
    }

    /// Scales the colour down until its perceived brightness is at most
    /// `ceiling`, keeping its hue. A colour that is already darker than the
    /// ceiling is returned unchanged.
    ///
    /// Used for surfaces that carry light text over an arbitrary,
    /// content-driven tint — a pale sky would otherwise leave white labels
    /// unreadable, while flattening the tint to black would throw the tint away.
    func darkened(toMaxBrightness ceiling: Double) -> Color {
        guard let components = sRGBComponents,
              let brightness = perceivedBrightness,
              brightness > ceiling,
              brightness > 0
        else {
            return self
        }

        let scale = ceiling / brightness
        return Color(
            .sRGB,
            red: components.red * scale,
            green: components.green * scale,
            blue: components.blue * scale,
            opacity: components.alpha
        )
    }
}
