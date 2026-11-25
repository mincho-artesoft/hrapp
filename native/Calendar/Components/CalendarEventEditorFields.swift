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
        button.buttonStyle(AppActionButtonStyle()).controlSize(.large)
        #else
        Section { button }
        #endif
    }

    private var button: some View {
        Button(role: .destructive, action: requestConfirmation) {
            Text(title).frame(maxWidth: .infinity).contentShape(Rectangle())
        }
    }
}
