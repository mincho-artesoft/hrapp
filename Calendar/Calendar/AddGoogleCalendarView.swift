// AddGoogleCalendarView.swift
import SwiftUI
import EventKit

/// View for adding a new Google Calendar and returning name + color via callback
struct AddGoogleCalendarView: View {
    @Environment(\.dismiss) private var dismiss
    @ObservedObject private var viewModel = CalendarViewModel.shared

    let user: StoredGoogleUser
    let onDone: (String, UIColor) -> Void

    @State private var calendarName: String = ""
    @State private var selectedColor: UIColor = .systemBlue

    var body: some View {
        NavigationView {
            Form {
                Section {
                    TextField(NSLocalizedString("Calendar name", comment: "Google calendar name placeholder"), text: $calendarName)
                }

                Section {
                    NavigationLink {
                        CalendarColorSelectionView(selectedColor: $selectedColor)
                    } label: {
                        HStack {
                            Circle()
                                .fill(Color(selectedColor))
                                .frame(width: 20, height: 20)
                            Text(LocalizedStringKey("Color"))
                                .padding(.leading, 6)
                        }
                    }
                }
            }
            .navigationTitle(NSLocalizedString("Add Google Calendar", comment: "Add Google calendar screen title"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    AppToolbarTextButton(
                        localizedTitle: NSLocalizedString("Cancel", comment: "Cancel button")
                    ) {
                        dismiss()
                    }
                }
                ToolbarItem(placement: .confirmationAction) {
                    AppToolbarTextButton(
                        localizedTitle: NSLocalizedString("Done", comment: "Done button")
                    ) {
                        let name = calendarName.trimmingCharacters(in: .whitespaces)
                        let color = selectedColor
                        onDone(name, color)
                        dismiss()
                    }
                    .disabled(calendarName.trimmingCharacters(in: .whitespaces).isEmpty)
                }
            }
        }
    }
}
