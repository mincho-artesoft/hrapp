import SwiftUI
import EventKit

/// One search transition for SwiftUI pages and UIKit calendar headers.
enum CalendarSearchPresentation {
    static let duration: TimeInterval = 0.25
    static var animation: Animation { .easeInOut(duration: duration) }
    static var transition: AnyTransition { .move(edge: .top).combined(with: .opacity) }
}

/// Match Day's UIKit header: keep its space, hide its controls immediately,
/// and slide/fade only the search field in and out over the same 0.25 seconds.
struct CalendarSearchHeader<Header: View, Search: View>: View {
    let isSearching: Bool
    let height: CGFloat
    @ViewBuilder var header: () -> Header
    @ViewBuilder var search: () -> Search

    var body: some View {
        ZStack {
            header()
                .opacity(isSearching ? 0 : 1)
                .allowsHitTesting(!isSearching)
                .accessibilityHidden(isSearching)
                .animation(nil, value: isSearching)
            if isSearching {
                search()
                    .transition(CalendarSearchPresentation.transition)
                    .zIndex(1)
            }
        }
        .frame(height: height)
        .animation(CalendarSearchPresentation.animation, value: isSearching)
    }
}

extension View {
    /// Wait until the opening transition has attached the input to its window.
    /// Cancellation on dismissal prevents a closed search from stealing focus.
    func calendarSearchAutofocus(_ focus: FocusState<Bool>.Binding) -> some View {
        task { @MainActor in
            do { try await Task.sleep(for: .seconds(CalendarSearchPresentation.duration)) }
            catch { return }
            focus.wrappedValue = true
        }
    }
}

/// The calendar keeps the iPad's typography on macOS. SwiftUI's semantic fonts
/// resolve to smaller sizes on Mac, even when the view source is identical.
enum CalendarTypography {
    #if os(macOS)
    static let body = Font.system(size: 17)
    static let headline = Font.system(size: 17, weight: .semibold)
    static let subheadline = Font.system(size: 15)
    static let footnote = Font.system(size: 13)
    static let caption = Font.system(size: 12)
    static let caption2 = Font.system(size: 11)
    static let title = Font.system(size: 28)
    static let title3 = Font.system(size: 20)
    static let title2 = Font.system(size: 22)
    #else
    static let body = Font.body
    static let headline = Font.headline
    static let subheadline = Font.subheadline
    static let footnote = Font.footnote
    static let caption = Font.caption
    static let caption2 = Font.caption2
    static let title = Font.title
    static let title3 = Font.title3
    static let title2 = Font.title2
    #endif
}

enum CalendarPalette {
    #if os(macOS)
    private static func adaptive(_ light: NSColor, _ dark: NSColor) -> Color {
        Color(nsColor: NSColor(name: nil) { appearance in
            appearance.bestMatch(from: [.aqua, .darkAqua]) == .darkAqua ? dark : light
        })
    }
    static let background = adaptive(.white, .black)
    static let groupedBackground = adaptive(
        NSColor(srgbRed: 0.949, green: 0.949, blue: 0.969, alpha: 1), .black)
    static let secondaryGroupedBackground = adaptive(.white,
        NSColor(srgbRed: 0.110, green: 0.110, blue: 0.118, alpha: 1))
    static let gray6 = adaptive(
        NSColor(srgbRed: 0.949, green: 0.949, blue: 0.969, alpha: 1),
        NSColor(srgbRed: 0.110, green: 0.110, blue: 0.118, alpha: 1))
    static let tertiaryFill = adaptive(
        NSColor(srgbRed: 0.463, green: 0.463, blue: 0.502, alpha: 0.12),
        NSColor(srgbRed: 0.463, green: 0.463, blue: 0.502, alpha: 0.24))
    static let selectedCalendar = adaptive(
        NSColor(srgbRed: 0.820, green: 0.820, blue: 0.839, alpha: 0.5),
        NSColor(srgbRed: 0.227, green: 0.227, blue: 0.235, alpha: 0.5))
    #else
    static let background = Color(uiColor: .systemBackground)
    static let groupedBackground = Color(uiColor: .systemGroupedBackground)
    static let secondaryGroupedBackground = Color(uiColor: .secondarySystemGroupedBackground)
    static let gray6 = Color(uiColor: .systemGray6)
    static let tertiaryFill = Color(uiColor: .tertiarySystemFill)
    static let selectedCalendar = Color(uiColor: .systemGray4.withAlphaComponent(0.5))
    #endif
}

