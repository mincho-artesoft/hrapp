// Ported from Wonek Components/AppActionButtonStyle.swift.
#if os(macOS)
import SwiftUI

/// Content actions share one capsule on Mac, iPhone and iPad instead of using
/// platform-specific bordered bezels. Navigation headers keep their own style.
struct AppActionButtonStyle: ButtonStyle {
    var prominent = false
    var tint: Color? = nil
    var compact = false
    var labelScale: CGFloat = 1

    @Environment(\.isEnabled) private var isEnabled
    @Environment(\.controlSize) private var controlSize
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @ScaledMetric(relativeTo: .body) private var textScale = 1.0

    private var metrics: (font: CGFloat, inset: CGFloat, vertical: CGFloat, height: CGFloat) {
        if compact { return (15, 14, 6, 36) }
        return switch controlSize {
        case .mini: (13, 10, 4, 24)
        case .small: (15, 12, 5, 28)
        case .large: (17, 20, 10, 50)
        case .extraLarge: (19, 24, 12, 56)
        default: (16, 16, 8, 44)
        }
    }

    func makeBody(configuration: Configuration) -> some View {
        let filled = prominent || configuration.role == .cancel
        let color = configuration.role == .cancel ? Color.appCancel : tint ?? (configuration.role == .destructive ? Color.appRed : nil)
        let accent = color.map { AnyShapeStyle($0) } ?? AnyShapeStyle(.tint)
        configuration.label
            .font(.system(size: metrics.font * textScale * labelScale, weight: .medium))
            .adaptiveSingleLine()
            .multilineTextAlignment(.center)
            .foregroundStyle(filled ? AnyShapeStyle(configuration.role == .cancel ? Color.appNeutralForeground : .white) : accent)
            .padding(.horizontal, metrics.inset)
            .padding(.vertical, metrics.vertical)
            .frame(minHeight: metrics.height)
            .background {
                Capsule().fill(accent).opacity(filled ? 1 : 0.14)
            }
            // Compact invitation capsules retain a 44-point touch target.
            .padding(.vertical, compact ? 4 : 0)
            .contentShape(Capsule())
            .opacity(isEnabled ? (configuration.isPressed ? 0.8 : 1) : 0.45)
            .scaleEffect(configuration.isPressed && !reduceMotion ? 0.98 : 1)
    }
}

/// Calendar and push-to-talk invitations use equal-width actions and one
/// localized label scale. Destructive roles stay red; acceptance stays blue.
struct AppInvitationActions<Content: View>: View {
    var labels: [LocalizedStringKey] = ["Decline", "Accept"]
    @ViewBuilder var content: Content
    @ScaledMetric(relativeTo: .body) private var textSize: CGFloat = 15

    var body: some View {
        UniformControlLabelGroup(labels: labels, font: .system(size: textSize, weight: .medium),
                                 spacing: 10, reservedWidth: 28) { scale in
            HStack(spacing: 10) { content }
                .buttonStyle(AppActionButtonStyle(prominent: true, compact: true, labelScale: scale))
                .tint(.appBlue)
        }
    }
}

#endif
