// Ported from Wonek Main/MacCalendarFormStyle.swift. HRApp data adapters are in MacCalendarAdapters.swift.
#if os(macOS)
#if os(macOS)
import SwiftUI

/// Matches the iPad's inset-grouped Form without adopting macOS Form's
/// label/control columns or its smaller desktop font metrics.
struct MacCalendarForm<Content: View>: View {
    @ViewBuilder var content: () -> Content
    var body: some View {
        ScrollView {
            VStack(spacing: 28, content: content)
                .padding(20)
                .frame(maxWidth: 780)
                .frame(maxWidth: .infinity)
        }
        .font(CalendarTypography.body)
        .background(CalendarPalette.groupedBackground)
        .macCalendarNeutralInitialFocus()
    }
}

struct MacCalendarFormSection<Content: View>: View {
    var title: LocalizedStringKey? = nil
    @ViewBuilder var content: () -> Content
    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            if let title {
                Text(title).font(CalendarTypography.footnote).foregroundStyle(.secondary)
                    .padding(.horizontal, 16)
            }
            VStack(spacing: 0, content: content)
                .background(CalendarPalette.secondaryGroupedBackground, in: RoundedRectangle(cornerRadius: CalendarCorners.formSection))
        }
    }
}

struct MacCalendarFormRow<Content: View>: View {
    var separator = true
    @ViewBuilder var content: () -> Content
    var body: some View {
        VStack(spacing: 0) {
            content().frame(maxWidth: .infinity, minHeight: 44, alignment: .leading)
                .padding(.horizontal, 16)
            if separator { Divider().padding(.leading, 16) }
        }
    }
}

#endif

#endif
