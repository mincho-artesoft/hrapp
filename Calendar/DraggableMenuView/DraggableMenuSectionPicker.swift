import SwiftUI

struct DraggableMenuSectionPicker: View {
    private struct Item: Identifiable {
        let id: Int
        let title: LocalizedStringKey
    }

    @Binding var selection: Int

    private let rows: [[Item]] = [
        [
            Item(id: 0, title: "Calendar"),
            Item(id: 1, title: "MultiCalendar"),
            Item(id: 2, title: "Subscriptions")
        ],
        [
            Item(id: 4, title: "Sharing"),
            Item(id: 5, title: "Settings"),
            Item(id: 3, title: "Apps")
        ]
    ]

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
        .background(Color(uiColor: .tertiarySystemFill))
        .clipShape(RoundedRectangle(cornerRadius: 21, style: .continuous))
        .accessibilityElement(children: .contain)
    }

    private func sectionButton(_ item: Item) -> some View {
        let isSelected = selection == item.id

        return Button {
            selection = item.id
        } label: {
            Text(item.title)
                .font(.subheadline.weight(isSelected ? .semibold : .regular))
                .lineLimit(1)
                .minimumScaleFactor(0.65)
                .frame(maxWidth: .infinity, minHeight: 32)
                .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .background {
            if isSelected {
                RoundedRectangle(cornerRadius: 17, style: .continuous)
                    .fill(Color(uiColor: .systemBackground))
                    .shadow(color: .black.opacity(0.08), radius: 1, y: 1)
            }
        }
        .accessibilityAddTraits(isSelected ? .isSelected : [])
    }
}
