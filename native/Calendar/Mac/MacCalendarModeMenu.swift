#if os(macOS)
import SwiftUI

// Wonek's custom view picker, shared by the calendar header and HRApp Weather.
struct MacCalendarModeMenu: View {
    let selectedTab: Int
    let onSelect: (Int) -> Void
    var body: some View {
        MacChoiceMenu(items: MacCalendarMode.allCases.map {
            .init(id: $0.rawValue, title: $0.title, symbol: $0.symbol)
        }, selection: selectedTab, onSelect: onSelect)
    }
}

/// Shared surface for calendar and Weather choices: every row is fully clickable.
struct MacChoiceMenu: View {
    struct Item: Identifiable {
        let id: Int
        let title: String
        let symbol: String
    }
    let items: [Item]
    let selection: Int
    let onSelect: (Int) -> Void
    var body: some View {
        VStack(spacing: 1) {
            ForEach(items) { item in
                Button {
                    onSelect(item.id)
                } label: {
                    MacChoiceMenuRow(selected: selection == item.id) {
                        HStack(spacing: 12) {
                            Image(systemName: item.symbol).frame(width: 22)
                            Text(LocalizedStringKey(item.title))
                        }
                    }.frame(width: 270)

                }
                .buttonStyle(.plain)
                .accessibilityAddTraits(selection == item.id ? .isSelected : [])
            }
        }
        .padding(.vertical, 8)
        .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 18, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .stroke(Color.primary.opacity(0.08))
        }
        .shadow(color: .black.opacity(0.20), radius: 22, y: 8)
    }

}
/// The same neutral row and leading selection check used by every Mac picker.
struct MacChoiceMenuRow<Content: View>: View {
    let selected: Bool
    var highlighted = false
    @ViewBuilder var content: () -> Content
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: "checkmark").font(CalendarTypography.body.weight(.semibold))
                .opacity(selected ? 1 : 0).frame(width: 16).accessibilityHidden(true)
            content().frame(maxWidth: .infinity, alignment: .leading)
        }.font(CalendarTypography.body).foregroundStyle(Color.primary)
            .padding(.horizontal, 14).frame(minHeight: 44)
            .background(highlighted ? Color.primary.opacity(0.08) : .clear, in: RoundedRectangle(cornerRadius: 8))
            .contentShape(Rectangle())
    }
}

struct MacCalendarViewPicker: View {
    let selectedTab: Int
    let tint: Color
    let onSelect: (Int) -> Void
    @State private var isOpen = false
    var body: some View {
        Button { isOpen.toggle() } label: {
            Image(systemName: MacCalendarMode(rawValue: selectedTab)?.symbol ?? "calendar")
                .font(.system(size: 20)).frame(width: 30, height: 30).contentShape(Rectangle())
        }.buttonStyle(.plain).foregroundStyle(tint).help("Calendar views")
        .accessibilityLabel("Calendar views")
        .appMacMenu(isPresented: $isOpen) {
            MacCalendarModeMenu(selectedTab: selectedTab) { isOpen = false; onSelect($0) }
        }
    }
}
#endif
