//
//  CalendarEventFormView.swift
//  HR
//
//  Created by Mincho Milev on 1/21/25.
//

import SwiftUI

struct CalendarEventFormView: View {
    @Environment(\.dismiss) private var dismiss
    
    @ObservedObject var viewModel: CalendarViewModel
    
    @State var event: CalendarEvent
    var isNew: Bool
    
    var body: some View {
        NavigationStack {
            Form {
                Section("Event Details") {
                    TextField("Title", text: $event.title)
                    
                    Toggle("All Day", isOn: $event.allDay)
                    
                    DatePicker("Start", selection: $event.start,
                               displayedComponents: event.allDay ? .date : [.date, .hourAndMinute])
                    DatePicker("End", selection: $event.end,
                               displayedComponents: event.allDay ? .date : [.date, .hourAndMinute])
                    
                    ColorPicker("Color", selection: $event.color)
                }
                
                Section("Notes") {
                    TextEditor(text: $event.notes)
                        .frame(minHeight: 80)
                }
                
                if !isNew {
                    Section {
                        Button(role: .destructive) {
                            viewModel.deleteEvent(event)
                            dismiss()
                        } label: {
                            Label("Delete Event", systemImage: "trash")
                                .foregroundColor(.red)
                        }
                    }
                }
            }
            .navigationTitle(isNew ? "New Event" : "Edit Event")
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        // ensure start <= end for safety
                        if event.start > event.end {
                            // you can show an alert or do an automatic fix
                            event.end = event.start.addingTimeInterval(3600)
                        }
                        viewModel.upsertEvent(event)
                        dismiss()
                    }
                }
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
            }
        }
    }
}
