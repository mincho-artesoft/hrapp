//
//  ScheduleInterviewView.swift
//  HRApp
//
//  Created by Mincho Milev on 1/19/25.
//


import SwiftUI
import SwiftData

struct ScheduleInterviewView: View {
    @Environment(\.modelContext) private var context
    @Environment(\.dismiss) private var dismiss

    @StateObject private var interviewService = InterviewService()

    let candidate: Candidate

    @State private var startDate: Date = Date()
    @State private var endDate: Date = Date().addingTimeInterval(3600) // 1 hour later
    @State private var location: String = ""
    @State private var notes: String = ""
    @State private var status: String = ""

    var onSave: () -> Void

    var body: some View {
        NavigationStack {
            Form {
                Section("Interview Times") {
                    DatePicker("Start", selection: $startDate, displayedComponents: [.date, .hourAndMinute])
                    DatePicker("End", selection: $endDate, displayedComponents: [.date, .hourAndMinute])
                }
                Section("Location") {
                    TextField("Location/Zoom URL", text: $location)
                }
                Section("Notes") {
                    TextField("Additional notes", text: $notes, axis: .vertical)
                        .lineLimit(4)
                }
            }
            .navigationTitle("Schedule Interview")
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        scheduleInterview()
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

    private func scheduleInterview() {
        Task {
            do {
                try interviewService.scheduleInterview(
                    context: context,
                    candidate: candidate,
                    startDate: startDate,
                    endDate: endDate,
                    location: location,
                    status: status,
                    notes: notes
                    
                )
                dismiss()
                onSave()
            } catch {
                print("Error scheduling interview: \(error)")
            }
        }
    }
}
