//
//  AddGoogleCalendarView.swift
//  Cloud Calendars for Google, Microsoft and iCloud
//
//  Created by Aleksandar Svinarov on 12/5/25.
//


import SwiftUI
import EventKit

/// Very similar to `AddCalendarView`, but calls Google Calendar API first,
/// then creates the **local copy** and refreshes the ViewModel.
///
/// You must pass the *specific* Google user that owns the new calendar.
struct AddGoogleCalendarView: View {
    @Environment(\.dismiss) private var dismiss
    @ObservedObject private var viewModel = CalendarViewModel.shared

    let user: StoredGoogleUser

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
            .navigationTitle("Add Google calendar")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") {
                        // 1. копираме нужните стойности,
                        //    защото след dismiss self вече няма да е на екран
                        let name  = calendarName.trimmingCharacters(in: .whitespaces)
                        let color = selectedColor
                        let gUser = user
                        
                        // 2. ЗАТВАРЯМЕ шийта веднага
                        dismiss()
                        
                        // 3. Стартираме добавянето в Google на заден план
                        Task {
                            await viewModel.addGoogleCalendar(name: name,
                                                              color: color,
                                                              for: gUser)
                        }
                    }
                    .disabled(calendarName.trimmingCharacters(in: .whitespaces).isEmpty)
                }
            }
        }
    }
}
