import SwiftUI

struct AppCalendarDisclosureStyle: DisclosureGroupStyle {
    func makeBody(configuration: Configuration) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Button { withAnimation(.easeInOut(duration: 0.18)) { configuration.isExpanded.toggle() } } label: {
                HStack {
                    configuration.label.foregroundStyle(.primary)
                    Spacer()
                    Image(systemName: configuration.isExpanded ? "chevron.down" : "chevron.forward")
                        .font(CalendarTypography.footnote.weight(.semibold)).foregroundStyle(.secondary)
                }.contentShape(Rectangle()).frame(minHeight: 28)
            }.buttonStyle(.plain)
            if configuration.isExpanded { configuration.content.padding(.leading, 32) }
        }
    }
}
