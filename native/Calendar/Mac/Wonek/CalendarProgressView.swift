// Ported from Wonek Main/CalendarProgressView.swift.
#if os(macOS)
import SwiftUI

/// A status row owns the available width instead of inheriting the form's
/// leading alignment. Keep the spinner and its localized label together.
struct CalendarProgressView: View {
    var title: LocalizedStringKey? = nil
    var fillsAvailableHeight = false

    init(_ title: LocalizedStringKey? = nil, fillsAvailableHeight: Bool = false) {
        self.title = title
        self.fillsAvailableHeight = fillsAvailableHeight
    }

    var body: some View {
        CalendarProgressIndicator(title: title)
            .frame(maxWidth: .infinity,
                   maxHeight: fillsAvailableHeight ? .infinity : nil,
                   alignment: .center)
    }
}

private struct CalendarProgressIndicator: View {
    let title: LocalizedStringKey?

    var body: some View {
        VStack(alignment: .center, spacing: 10) {
            ProgressView()
                .progressViewStyle(.circular)
                .tint(Color.primary)
            if let title {
                Text(title)
                    .font(.body)
                    .foregroundStyle(.secondary)
                    .multilineTextAlignment(.center)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
        .accessibilityElement(children: .combine)
        .accessibilityIdentifier("calendar.progress")
    }
}

private struct CalendarProgressOverlay: ViewModifier {
    let isPresented: Bool
    let title: LocalizedStringKey?

    func body(content: Content) -> some View {
        content
            .disabled(isPresented)
            .overlay {
                if isPresented {
                    ZStack {
                        Color.primary.opacity(0.04)
                            .contentShape(Rectangle())
                            .accessibilityHidden(true)
                        CalendarProgressIndicator(title: title)
                            .controlSize(.large)
                            .padding(24)
                            .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 18))
                            .padding(20)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .center)
                }
            }
    }
}

extension View {
    /// Attach to the viewport/sheet, never to the scrolling form content, so a
    /// blocking operation remains centered even after the user has scrolled.
    func calendarProgressOverlay(_ isPresented: Bool, title: LocalizedStringKey? = nil) -> some View {
        modifier(CalendarProgressOverlay(isPresented: isPresented, title: title))
    }
}

#endif
