//
//  CalendarEventFormView.swift
//  HR
//
//  Created by Mincho Milev on 1/21/25.
//

import SwiftUI

struct CalendarEventFormView: View {
    // MARK: - Environment & Dependencies
    
    @Environment(\.dismiss) private var dismiss
    @ObservedObject var viewModel: CalendarViewModel
    
    // The event we’re editing or creating:
    @State var event: CalendarEvent
    
    // Whether this is a brand new event
    var isNew: Bool
    
    // MARK: - Local States
    
    @State private var formType: FormType = .event   // Event vs. Reminder
    @State private var location: String = ""
    @State private var travelTime: TravelTime = .none
    @State private var isEndDateInvalid: Bool = false
    @State private var urlString: String = ""
    @State private var alertSetting: AlertSetting = .none
    @State private var showAs: ShowAs = .busy
    
    // MARK: - Enums
    
    enum FormType: String, CaseIterable, Identifiable {
        case event = "Event"
        case reminder = "Reminder"
        var id: String { rawValue }
    }
    
    enum TravelTime: String, CaseIterable, Identifiable {
        case none = "None"
        case min5 = "5 minutes"
        case min15 = "15 minutes"
        case min30 = "30 minutes"
        case hour1 = "1 hour"
        case hour1_30 = "1 hour, 30 minutes"
        case hour2 = "2 hours"
        
        var id: String { rawValue }
        
        var interval: TimeInterval? {
            switch self {
            case .none:       return nil
            case .min5:       return 5 * 60
            case .min15:      return 15 * 60
            case .min30:      return 30 * 60
            case .hour1:      return 60 * 60
            case .hour1_30:   return 90 * 60
            case .hour2:      return 120 * 60
            }
        }
    }
    
    /// Matches our `RepeatRule` from the model (we’ll show them in a Picker)
    private var repeatRules: [RepeatRule] {
        [.never, .everyDay, .everyWeek, .every2Weeks, .everyMonth, .everyYear, .custom]
    }
    
    enum AlertSetting: String, CaseIterable, Identifiable {
        case none = "None"
        case min5 = "5 minutes before"
        case min15 = "15 minutes before"
        case min30 = "30 minutes before"
        case hour1 = "1 hour before"
        
        var id: String { rawValue }
    }
    
    enum ShowAs: String, CaseIterable, Identifiable {
        case busy = "Busy"
        case free = "Free"
        var id: String { rawValue }
    }
    
    // MARK: - Body
    
    var body: some View {
        NavigationStack {
            Form {
                // Segmented control: Event / Reminder
                Picker("", selection: $formType) {
                    Text("Event").tag(FormType.event)
                    Text("Reminder").tag(FormType.reminder)
                }
                .pickerStyle(.segmented)
                
                // Title & Location
                Section {
                    TextField("Title", text: $event.title)
                    TextField("Location or Video Call", text: $location)
                }
                
                // All-day & Start/End
                Section {
                    Toggle("All-day", isOn: $event.allDay)
                    
                    DatePicker("Starts", selection: $event.start,
                               displayedComponents: event.allDay ? .date : [.date, .hourAndMinute])
                        .datePickerStyle(.automatic)
                        .onChange(of: event.start) { newStart in
                            // If start surpasses end, push end forward 1 hour
                            if newStart > event.end {
                                event.end = newStart.addingTimeInterval(3600)
                            }
                            checkEndDateValidity()
                        }
                    
                    DatePicker("Ends", selection: $event.end,
                               displayedComponents: event.allDay ? .date : [.date, .hourAndMinute])
                        .datePickerStyle(.automatic)
                        .onChange(of: event.end) { _ in
                            checkEndDateValidity()
                        }
                    
                    if isEndDateInvalid {
                        Text("End time can’t be before start time.")
                            .font(.caption)
                            .foregroundColor(.red)
                    }
                    
                    Picker("Travel Time", selection: $travelTime) {
                        ForEach(TravelTime.allCases) { t in
                            Text(t.rawValue).tag(t)
                        }
                    }
                }
                
                // Repeat
                Section {
                    Picker("Repeat", selection: $event.repeatRule) {
                        ForEach(repeatRules, id: \.self) { rule in
                            Text(rule.rawValue).tag(rule)
                        }
                    }
                }
                
                // Calendar, Invitees, Alert, Show As
                Section {
                    // Just an example: picking which calendar
                    HStack {
                        Text("Calendar")
                        Spacer()
                        Text("Default (iCloud)")
                            .foregroundColor(.secondary)
                    }
                    
                    NavigationLink("Invitees") {
                        Text("Invitees Screen (not implemented)")
                    }
                    
                    Picker("Alert", selection: $alertSetting) {
                        ForEach(AlertSetting.allCases) { alert in
                            Text(alert.rawValue).tag(alert)
                        }
                    }
                    
                    Picker("Show As", selection: $showAs) {
                        ForEach(ShowAs.allCases) { mode in
                            Text(mode.rawValue).tag(mode)
                        }
                    }
                }
                
                // URL + Notes
                Section {
                    TextField("URL", text: $urlString)
                        .keyboardType(.URL)
                        .autocapitalization(.none)
                    
                    TextEditor(text: $event.notes)
                        .frame(minHeight: 80)
                } header: {
                    Text("Additional Info")
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
            .navigationTitle(isNew ? "New" : "Edit")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button(isNew ? "Add" : "Update") {
                        if saveAllowed() {
                            // Final safety check
                            if event.start > event.end {
                                event.end = event.start.addingTimeInterval(3600)
                            }
                            viewModel.upsertEvent(event)
                            dismiss()
                        }
                    }
                    .disabled(!saveAllowed())
                }
            }
        }
        .onAppear {
            // If you had location or travelTime in the actual model, you’d map them here
            // location = event.location
            // travelTime = ...
        }
    }
    
    // MARK: - Validation
    
    private func checkEndDateValidity() {
        isEndDateInvalid = (event.end < event.start)
    }
    
    private func saveAllowed() -> Bool {
        if event.title.trimmingCharacters(in: .whitespaces).isEmpty { return false }
        if event.end < event.start { return false }
        return true
    }
}
