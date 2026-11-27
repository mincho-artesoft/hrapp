import SwiftUI

struct CalendarEventTitleLocationSection: View {
    @Binding var title: String
    let location: String
    var allowsVideoLink = false
    let editLocation: () -> Void
    let clearLocation: () -> Void

    var body: some View {
        #if os(macOS)
        MacCalendarFormSection {
            MacCalendarFormRow { TextField("Title", text: $title).appTextInputAlignment().textFieldStyle(.plain) }
            MacCalendarFormRow(separator: false) { locationRow }
        }
        #else
        Section {
            TextField("Title", text: $title)
            locationRow
        }
        #endif
    }

    private var locationRow: some View {
        HStack(spacing: 10) {
            Button(action: editLocation) {
                Group {
                    if location.isEmpty { Text(allowsVideoLink ? LocalizedStringKey("Location or Video Call") : "Location") }
                    else { Text(verbatim: location) }
                }
                .foregroundStyle(location.isEmpty ? AnyShapeStyle(.tertiary) : AnyShapeStyle(.primary))
                .lineLimit(1).frame(maxWidth: .infinity, alignment: .leading).contentShape(Rectangle())
            }
            .buttonStyle(.plain)
            if !location.isEmpty {
                Button(action: clearLocation) { Image(systemName: "xmark.circle.fill").foregroundStyle(.tertiary) }
                    .buttonStyle(.plain).accessibilityLabel("Clear").help(Text("Clear"))
            }
        }
    }
}

struct CalendarEventRemovalSection: View {
    var title: LocalizedStringKey = "Delete Event"
    let requestConfirmation: () -> Void

    var body: some View {
        #if os(macOS)
        CalendarEventRemovalButton(title: title, action: requestConfirmation)
        #else
        Section { CalendarEventRemovalButton(title: title, action: requestConfirmation) }
        #endif
    }
}

struct CalendarEventRemovalButton: View {
    let title: LocalizedStringKey
    let action: () -> Void

    var body: some View {
        Button(role: .destructive, action: action) {
            Text(title).multilineTextAlignment(.center).frame(maxWidth: .infinity).contentShape(Rectangle())
        }
        #if os(macOS)
        .buttonStyle(AppActionButtonStyle()).controlSize(.large)
        #else
        .buttonStyle(.borderless)
        #endif
    }
}
