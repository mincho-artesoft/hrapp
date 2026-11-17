import SwiftUI
#if os(macOS)
import AppKit
#else
import UIKit
#endif

/// Shared surfaces let iPad and native Mac render the same components.
enum CalendarSurfaceColors {
    #if os(macOS)
    private static func adaptive(_ light: NSColor, _ dark: NSColor) -> Color {
        Color(nsColor: NSColor(name: nil) { $0.bestMatch(from: [.aqua, .darkAqua]) == .darkAqua ? dark : light })
    }
    static let background = adaptive(.white, .black)
    static let gray6 = adaptive(NSColor(white: 0.95, alpha: 1), NSColor(white: 0.11, alpha: 1))
    static let secondaryGrouped = adaptive(.white, NSColor(white: 0.11, alpha: 1))
    static let tertiaryFill = Color.primary.opacity(0.12)
    #else
    static let background = Color(uiColor: .systemBackground)
    static let gray6 = Color(uiColor: .systemGray6)
    static let secondaryGrouped = Color(uiColor: .secondarySystemGroupedBackground)
    static let tertiaryFill = Color(uiColor: .tertiarySystemFill)
    #endif
}
