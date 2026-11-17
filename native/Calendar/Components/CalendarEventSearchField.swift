import SwiftUI

/// Единният изглед за търсене във всички календарни екрани — SwiftUI и UIKit.
struct CalendarEventSearchField: View {
    @Binding var text: String
    let onClose: () -> Void

    @FocusState private var isFocused: Bool

    var body: some View {
        TextField(LocalizedStringKey("Search events..."), text: $text)
            .textFieldStyle(.plain)
            .font(CalendarTypography.body)
            #if os(macOS)
            .appTextInputAlignment()
            #endif
            .submitLabel(.search)
            .focused($isFocused)
            .padding(.vertical, 8)
            .padding(.leading, 12)
            .padding(.trailing, 36)
            .background(
                RoundedRectangle(cornerRadius: 10, style: .continuous)
                    .fill(.thinMaterial)
            )
            .overlay(alignment: .trailing) {
                Button {
                    isFocused = false
                    onClose()
                } label: {
                    Image(systemName: "xmark")
                        .font(.subheadline.weight(.semibold))
                        .foregroundStyle(.secondary)
                        .frame(width: 32, height: 32)
                        .contentShape(Rectangle())
                }
                .buttonStyle(.plain)
                .padding(.trailing, 2)
                .accessibilityLabel("Close search")
                .accessibilityIdentifier("calendar-search-close")
            }
            .padding(.horizontal, 16)
            .frame(height: CalendarHeaderLayout.height)
            .calendarSearchAutofocus($isFocused)
            .onSubmit {
                isFocused = false
            }
    }
}

