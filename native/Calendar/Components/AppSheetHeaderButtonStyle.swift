import SwiftUI

private struct SheetHeaderIconGroupKey: EnvironmentKey {
    static let defaultValue = false
}

private extension EnvironmentValues {
    var sheetHeaderIconGroup: Bool {
        get { self[SheetHeaderIconGroupKey.self] }
        set { self[SheetHeaderIconGroupKey.self] = newValue }
    }
}

/// Opaque sheet actions keep their colour in every appearance and platform.
struct AppSheetHeaderButtonStyle: ButtonStyle {
    var isIcon = false
    var tint: Color = .appBlue
    @Environment(\.sheetHeaderIconGroup) private var isGrouped
    @Environment(\.isEnabled) private var isEnabled
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    func makeBody(configuration: Configuration) -> some View {
        let isTextCancellation = configuration.role == .cancel && !isIcon
        let fill = isEnabled ? (isTextCancellation ? Color.appCancel : configuration.role == .destructive ? Color.appRed : tint) : .appInactive
        configuration.label
            .modifier(AppSheetHeaderActionSurface(isIcon: isIcon, tint: fill,
                foreground: isTextCancellation || !isEnabled ? .appNeutralForeground : .white))
            .opacity(configuration.isPressed && isEnabled ? 0.8 : 1)
            .scaleEffect(configuration.isPressed && !reduceMotion && !isGrouped ? 0.97 : 1)
    }
}

/// Menus draw the same label surface as buttons; native Menu styles can replace
/// a ButtonStyle, so keep the shared geometry and colours on their label.
struct AppSheetHeaderActionSurface: ViewModifier {
    var isIcon = false
    var tint: Color = .appBlue
    var foreground: Color = .white
    @Environment(\.sheetHeaderIconGroup) private var isGrouped
    @ScaledMetric(relativeTo: .body) private var textSize = 17.0

    private var isJoined: Bool { isIcon && isGrouped }

    private var surface: RoundedRectangle {
        RoundedRectangle(cornerRadius: isJoined ? 0 : 19)
    }

    func body(content: Content) -> some View {
        content
            .font(.system(size: textSize, weight: .medium))
            .foregroundStyle(foreground)
            .lineLimit(1)
            .fixedSize(horizontal: true, vertical: false)
            .padding(.horizontal, isIcon ? 0 : 12)
            .frame(width: isIcon ? (isJoined ? 44 : 38) : nil, height: 38)
            .background(tint, in: surface)
            .contentShape(surface)
            .frame(minWidth: isIcon ? 44 : nil, minHeight: 44)
            .contentShape(Rectangle())
    }
}

struct AppSheetHeaderIconGroup<Content: View>: View {
    @ViewBuilder var content: () -> Content
    var body: some View {
        // Clip the coloured surfaces at their actual 38pt height, independently
        // of each button's 44pt hit target. Clipping a 44pt container instead
        // cuts flat corners into the visible capsule.
        Group(subviews: content()) { subviews in
            HStack(spacing: 0) {
                ForEach(subviews) { subview in subview }
            }
            .mask {
                Capsule().frame(width: subviews.count == 1 ? 38 : nil, height: 38)
            }
            .overlay {
                if subviews.count > 1 {
                    HStack(spacing: 0) {
                        ForEach(0..<subviews.count, id: \.self) { index in
                            Color.clear.frame(width: 44, height: 22)
                                .overlay(alignment: .trailing) {
                                    if index < subviews.count - 1 {
                                        Rectangle().fill(.white.opacity(0.3)).frame(width: 1)
                                    }
                                }
                        }
                    }.allowsHitTesting(false)
                }
            }
        }
        // Apply the environment before resolving children, including buttons
        // with an explicit style, so Mac and native iOS toolbars share geometry.
        .environment(\.sheetHeaderIconGroup, true)
        .buttonStyle(AppSheetHeaderButtonStyle(isIcon: true))
    }
}

/// Custom action surfaces replace the system toolbar background instead of
/// being enclosed in a second glass circle on iOS.
struct AppSheetToolbarItem<Content: View>: ToolbarContent {
    let placement: ToolbarItemPlacement
    @ViewBuilder var content: () -> Content

    var body: some ToolbarContent {
        ToolbarItem(placement: placement, content: content)
            #if os(iOS)
            .appSheetActionBackground()
            #endif
    }
}

#if os(iOS)
extension ToolbarContent {
    /// Keep app header controls in the top bar without disabling Duo's system
    /// side rail, which also changes the content safe area and status placement.
    @ToolbarContentBuilder
    func appHorizontalHeaderItem() -> some ToolbarContent {
        // Runtime availability alone cannot hide this API from the 27.0 SDK.
        #if canImport(SwiftUI, _version: 8.1)
        if #available(iOS 27.1, *) {
            axisBehavior(.horizontalOnly)
        } else {
            self
        }
        #else
        self
        #endif
    }

    /// The buttons draw their own opaque surface inside the native inline bar.
    @ToolbarContentBuilder
    func appSheetActionBackground() -> some ToolbarContent {
        if #available(iOS 26.0, *) {
            sharedBackgroundVisibility(.hidden)
                .appHorizontalHeaderItem()
        } else {
            self
        }
    }
}
#endif
