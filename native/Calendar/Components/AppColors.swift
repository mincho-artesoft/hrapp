import SwiftUI
import Observation

extension ShapeStyle where Self == Color {
    /// Shared action colours from the filled chat call and broadcast buttons.
    /// Keep the same sRGB values in light/dark appearances and native controls.
    static var appBlue: Color { AppColorPreferences.shared.palette.primary }
    static var appPurple: Color { AppColorPreferences.shared.palette.secondary }
    static var appRed: Color { Color(.sRGB, red: 1.0, green: 0.35, blue: 0.42) }
    static var appCancel: Color { .appNeutral(light: 0.90, dark: 0.235) }
    static var appInactive: Color { .appNeutral(light: 0.92, dark: 0.56) }
    static var appNeutralForeground: Color { .appNeutral(light: 0, dark: 1) }

    private static func appNeutral(light: CGFloat, dark: CGFloat) -> Color {
        #if os(iOS)
        Color(uiColor: UIColor { traits in
            UIColor(white: traits.userInterfaceStyle == .dark ? dark : light, alpha: 1)
        })
        #else
        Color(nsColor: NSColor(name: nil) { appearance in
            NSColor(white: appearance.bestMatch(from: [.darkAqua, .aqua]) == .darkAqua ? dark : light, alpha: 1)
        })
        #endif
    }
}

#if os(iOS)
import UIKit

extension UIColor {
    static var appBlue: UIColor { UIColor(Color.appBlue) }
    static let appRed = UIColor(Color.appRed)
    static var appPurple: UIColor { UIColor(Color.appPurple) }
}
#elseif os(macOS)
import AppKit

extension NSColor {
    static var appBlue: NSColor { NSColor(Color.appBlue) }
    static let appRed = NSColor(Color.appRed)
    static var appPurple: NSColor { NSColor(Color.appPurple) }
}
#endif

/// Color identity is independent of the system/light/dark appearance and icon.
/// Stable raw values are stored locally, never translated or synced to contacts.
enum AppColorPalette: String, CaseIterable, Identifiable, Sendable {
    case blueViolet, greenBlue, violetPink, orangePink

    static let storageKey = "AppColorPalette"
    var id: String { rawValue }

    static func load(from defaults: UserDefaults = .standard) -> Self {
        defaults.string(forKey: storageKey).flatMap(Self.init(rawValue:)) ?? .blueViolet
    }

    // Opaque fills retain at least 4.5:1 contrast against white message text.
    var primary: Color { color(primaryHex) }
    var secondary: Color { color(secondaryHex) }
    var messagePrimary: Color { self == .blueViolet ? color(0x1463E6) : primary }
    var primaryHighlight: Color { color(highlightHex.0) }
    var secondaryHighlight: Color { color(highlightHex.1) }

    var primaryHex: UInt32 {
        switch self {
        case .blueViolet: 0x2168DE
        case .greenBlue: 0x087A58
        case .violetPink: 0x7843CC
        case .orangePink: 0xB9540B
        }
    }
    var secondaryHex: UInt32 {
        switch self {
        case .blueViolet: 0x6353D6
        case .greenBlue: 0x2168DE
        case .violetPink, .orangePink: 0xBD286C
        }
    }
    private var highlightHex: (UInt32, UInt32) {
        switch self {
        case .blueViolet: (0x568FFF, 0x9696FF)
        case .greenBlue: (0x57D5A5, 0x76A8FF)
        case .violetPink: (0xB398FF, 0xFF8DBF)
        case .orangePink: (0xFFAF69, 0xFF8DBF)
        }
    }
    private func color(_ hex: UInt32) -> Color {
        Color(.sRGB, red: Double((hex >> 16) & 255) / 255,
              green: Double((hex >> 8) & 255) / 255, blue: Double(hex & 255) / 255)
    }
}

/// Observation follows reads through shared color getters all the way to each
/// SwiftUI body. No root identity reset: navigation, sheets and drafts survive.
/// Native drawing can also read the selection safely off the main thread.
@Observable
final class AppColorPreferences: @unchecked Sendable {
    static let shared = AppColorPreferences()
    @ObservationIgnored private let lock = NSLock()
    @ObservationIgnored private let defaults: UserDefaults
    @ObservationIgnored private var storedPalette: AppColorPalette

    init(defaults: UserDefaults = .standard) {
        self.defaults = defaults
        self.storedPalette = AppColorPalette.load(from: defaults)
    }

    var palette: AppColorPalette {
        get {
            access(keyPath: \.palette)
            return lock.withLock { storedPalette }
        }
        set {
            guard palette != newValue else { return }
            withMutation(keyPath: \.palette) {
                lock.withLock {
                    storedPalette = newValue
                    defaults.set(newValue.rawValue, forKey: AppColorPalette.storageKey)
                }
            }
        }
    }
}

private struct AppColorPaletteKey: EnvironmentKey {
    static let defaultValue = AppColorPalette.blueViolet
}

extension EnvironmentValues {
    var appColorPalette: AppColorPalette {
        get { self[AppColorPaletteKey.self] }
        set { self[AppColorPaletteKey.self] = newValue }
    }
}
