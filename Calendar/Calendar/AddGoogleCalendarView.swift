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
                    TextField("Calendar name", text: $calendarName)
                }

                Section {
                    NavigationLink {
                        CalendarColorSelectionView(selectedColor: $selectedColor)
                    } label: {
                        HStack {
                            Circle()
                                .fill(Color(selectedColor))
                                .frame(width: 20, height: 20)
                            Text("Color")
                                .padding(.leading, 6)
                        }
                    }
                }
            }
            .navigationTitle("Add Google Calendar")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") {
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

