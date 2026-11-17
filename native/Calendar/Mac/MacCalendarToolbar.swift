#if os(macOS)
import SwiftUI

/// iPad navigation-bar metrics for the calendar's custom Mac sheet headers.
/// Keep these out of the day/month toolbars: those controls are plain on iOS too.
enum MacCalendarToolbarMetrics {
    static let controlHeight: CGFloat = 44
    static let headerHeight: CGFloat = 64
    static let horizontalInset: CGFloat = 16
}

struct MacCalendarToolbarIconButton: View {
    let icon: String
    let title: LocalizedStringKey
    var prominentTint: Color? = nil
    let action: () -> Void

    var body: some View {
        Button(action: action) { Image(systemName: icon) }
            .buttonStyle(AppSheetHeaderButtonStyle(isIcon: true,
                tint: prominentTint ?? .appBlue))
            .accessibilityLabel(title)
            .help(Text(title))
    }
}

/// Related sheet actions share one capsule on both platforms.
struct MacCalendarToolbarIconGroup<Content: View>: View {
    @ViewBuilder var content: () -> Content
    var body: some View {
        AppSheetHeaderIconGroup(content: content)
    }
}

struct MacCalendarSheetHeader<Leading: View, Trailing: View>: View {
    let title: Text
    // The page owns its backdrop; headers inherit it, including Weather gradients.
    var showsBackground = false
    var movesWindow = false
    /// Limit the controls to the page's content column while keeping the backdrop full width.
    var contentMaxWidth: CGFloat? = nil
    var horizontalInset: CGFloat = MacCalendarToolbarMetrics.horizontalInset
    @ViewBuilder var leading: () -> Leading
    @ViewBuilder var trailing: () -> Trailing

    var body: some View {
        MacCalendarHeaderLayout {
            HStack(spacing: 0, content: leading)
            title.font(CalendarTypography.headline).foregroundStyle(Color.primary)
                .lineLimit(1).minimumScaleFactor(0.7).accessibilityAddTraits(.isHeader)
                .overlay {
                    if movesWindow { MacSheetWindowDragArea() }
                }
            HStack(spacing: 0, content: trailing)
        }
        .frame(maxWidth: contentMaxWidth)
        .padding(.horizontal, horizontalInset)
        .frame(maxWidth: .infinity)
        .frame(height: MacCalendarToolbarMetrics.headerHeight)
        .background {
            if showsBackground { CalendarPalette.groupedBackground.allowsHitTesting(false) }
        }
        .background {
            if movesWindow { MacSheetWindowDragArea() }
        }
    }
}

/// A borderless floating picker has no native title bar. Keep its header
/// draggable while the SwiftUI action buttons remain above this surface.
private struct MacSheetWindowDragArea: NSViewRepresentable {
    final class DragView: NSView {
        private var press: NSEvent?
        override var mouseDownCanMoveWindow: Bool { false }
        override func acceptsFirstMouse(for event: NSEvent?) -> Bool { true }
        override func mouseDown(with event: NSEvent) { press = event }
        override func mouseDragged(with event: NSEvent) {
            guard let press else { return }
            self.press = nil
            window?.performDrag(with: press)
        }
        override func mouseUp(with event: NSEvent) { press = nil }
    }
    func makeNSView(context: Context) -> DragView { DragView() }
    func updateNSView(_ view: DragView, context: Context) {}
}

/// Measure both actions before centering the title, including localized labels.
/// Fixed 70/85pt action columns clipped pill buttons and offset longer titles.
private struct MacCalendarHeaderLayout: Layout {
    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let sizes = subviews.map { $0.sizeThatFits(.unspecified) }
        let side = max(sizes[0].width, sizes[2].width)
        return CGSize(width: proposal.width ?? side * 2 + sizes[1].width + 24,
                      height: MacCalendarToolbarMetrics.headerHeight)
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        let leadingSize = subviews[0].sizeThatFits(.unspecified)
        let trailingSize = subviews[2].sizeThatFits(.unspecified)
        let titleSize = subviews[1].sizeThatFits(.unspecified)
        let titleStart = bounds.minX + leadingSize.width + 12
        let titleEnd = bounds.maxX - trailingSize.width - 12
        let titleWidth = min(titleSize.width, max(0, titleEnd - titleStart))
        // Keep the title centered when it fits. In a narrow info pane, use the
        // actual space between actions before shrinking translated titles.
        let titleCenter = min(max(bounds.midX, titleStart + titleWidth / 2), titleEnd - titleWidth / 2)
        // SwiftUI mirrors Layout placements for RTL. Swapping them here as well
        // puts the actions back on their LTR sides.
        subviews[0].place(at: CGPoint(x: bounds.minX, y: bounds.midY),
                          anchor: .leading, proposal: .unspecified)
        subviews[1].place(at: CGPoint(x: titleCenter, y: bounds.midY), anchor: .center,
                          proposal: ProposedViewSize(width: titleWidth, height: bounds.height))
        subviews[2].place(at: CGPoint(x: bounds.maxX, y: bounds.midY),
                          anchor: .trailing, proposal: .unspecified)
    }
}
#endif
