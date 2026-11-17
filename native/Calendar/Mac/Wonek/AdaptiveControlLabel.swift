// Ported from Wonek Components/AdaptiveControlLabel.swift. HRApp data adapters are in MacCalendarAdapters.swift.
#if os(macOS)
import SwiftUI

/// Measure styled, localized labels at their natural size, then use one factor
/// for the entire row. Hidden measurement copies are excluded from accessibility.
struct UniformControlLabelGroup<Content: View>: View {
    let labels: [LocalizedStringKey]
    let font: Font
    var spacing: CGFloat = 0
    var reservedWidth: CGFloat = 0
    /// Vertical control groups share one column rather than dividing its width.
    var columns: Int? = nil
    @ViewBuilder var content: (CGFloat) -> Content
    @State private var availableWidth: CGFloat = 0
    @State private var naturalWidth: CGFloat = 0

    private var scale: CGFloat {
        guard availableWidth > 0, naturalWidth > 0, !labels.isEmpty else { return 1 }
        let count = max(1, columns ?? labels.count)
        let slot = (availableWidth - spacing * CGFloat(count - 1)) / CGFloat(count)
        return min(1, max(0.4, (slot - reservedWidth - 1) / naturalWidth))
    }

    var body: some View {
        content(scale)
            .background {
                GeometryReader { geometry in
                    Color.clear.preference(key: ControlGroupWidth.self, value: geometry.size.width)
                }
            }
            .overlay(alignment: .topLeading) {
                ZStack(alignment: .topLeading) {
                    ForEach(labels.indices, id: \.self) { index in
                        Text(labels[index]).font(font).lineLimit(1).fixedSize()
                            .background {
                                GeometryReader { geometry in
                                    Color.clear.preference(key: ControlLabelWidth.self, value: geometry.size.width)
                                }
                            }
                    }
                }
                .hidden().allowsHitTesting(false).accessibilityHidden(true)
            }
            .onPreferenceChange(ControlGroupWidth.self) { availableWidth = $0 }
            .onPreferenceChange(ControlLabelWidth.self) { naturalWidth = $0 }
    }
}

private struct ControlGroupWidth: PreferenceKey {
    static let defaultValue: CGFloat = 0
    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) { value = max(value, nextValue()) }
}

private struct ControlLabelWidth: PreferenceKey {
    static let defaultValue: CGFloat = 0
    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) { value = max(value, nextValue()) }
}

#endif
