import SwiftUI

struct DraggableMenuSectionPicker: View {
    @Binding var selection: Int

    var body: some View {
        CalendarSectionPicker(selection: $selection, rows: [
            [.init(id: 0, title: "Calendar"), .init(id: 1, title: "MultiCalendar"), .init(id: 2, title: "Subscriptions")],
            [.init(id: 4, title: "Sharing"), .init(id: 5, title: "Settings"), .init(id: 3, title: "Apps")]
        ])
    }
}

struct CalendarSectionPicker<Selection: Hashable>: View {
    struct Item: Identifiable {
        let id: Selection
        let title: LocalizedStringKey
    }

    @Binding var selection: Selection
    let rows: [[Item]]

    var body: some View {
        VStack(spacing: 0) {
            ForEach(Array(rows.enumerated()), id: \.offset) { _, row in
                HStack(spacing: 0) {
                    ForEach(row) { item in
                        sectionButton(item)
                    }
                }
            }
        }
        .padding(3)
        .background(CalendarSurfaceColors.tertiaryFill)
        .clipShape(RoundedRectangle(cornerRadius: 21, style: .continuous))
        .accessibilityElement(children: .contain)
    }

    private func sectionButton(_ item: Item) -> some View {
        let isSelected = selection == item.id

        return Button {
            selection = item.id
        } label: {
            Text(item.title)
                .font(CalendarTypography.subheadline.weight(isSelected ? .semibold : .regular))
                .lineLimit(1)
                .minimumScaleFactor(0.8)
                .frame(maxWidth: .infinity, minHeight: 32)
                .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .background {
            if isSelected {
                RoundedRectangle(cornerRadius: 17, style: .continuous)
                    .fill(CalendarSurfaceColors.background)
                    .shadow(color: .black.opacity(0.08), radius: 1, y: 1)
            }
        }
        .accessibilityAddTraits(isSelected ? .isSelected : [])
    }
}
