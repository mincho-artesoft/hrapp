//
//  InterviewDetailView.swift
//  HRApp
//

import SwiftUI
import SwiftData

struct InterviewDetailView: View {
    @Environment(\.modelContext) private var context
    @Environment(\.dismiss) private var dismiss

    let interview: Interview

    @State private var showingEdit = false
    @State private var showingDeleteConfirm = false

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Candidate info
            Text("Candidate: \(interview.candidate.fullName)")
                .font(.title3)
            if !interview.candidate.email.isEmpty {
                Text("Email: \(interview.candidate.email)")
            }
            if !interview.candidate.phoneNumber.isEmpty {
                Text("Phone: \(interview.candidate.phoneNumber)")
            }
            Divider()

            // Interview info
            Text("Interview Dates:")
                .font(.headline)
            Text("\(interview.startDate.formatted(date: .long, time: .shortened)) — \(interview.endDate.formatted(date: .long, time: .shortened))")

            if !interview.location.isEmpty {
                Text("Location: \(interview.location)")
            }
            Text("Status: \(interview.status)")

            // Fix: now that `notes` is optional, we do a conditional binding:
            if let notes = interview.notes, !notes.isEmpty {
                Text("Notes: \(notes)")
            }

            Spacer()

            HStack(spacing: 20) {
                Button("Edit") {
                    showingEdit = true
                }
                .buttonStyle(.borderedProminent)

                Button("Delete", role: .destructive) {
                    showingDeleteConfirm = true
                }
                .buttonStyle(.bordered)
            }
        }
        .padding()
        .navigationTitle("Interview Details")
        .confirmationDialog(
            "Are you sure you want to delete this interview?",
            isPresented: $showingDeleteConfirm
        ) {
            Button("Delete Interview", role: .destructive) {
                deleteInterview()
            }
            Button("Cancel", role: .cancel) { }
        }
        .sheet(isPresented: $showingEdit) {
            EditInterviewView(interview: interview) {
                // Refresh logic if needed
            }
        }
    }

    private func deleteInterview() {
        do {
            context.delete(interview)
            try context.save()
            dismiss()
        } catch {
            print("Error deleting interview: \(error)")
        }
    }
}

// MARK: - Optional Subview for Editing
struct EditInterviewView: View {
    @Environment(\.modelContext) private var context
    @Environment(\.dismiss) private var dismiss

    let interview: Interview
    var onSave: () -> Void

    @State private var startDate: Date
    @State private var endDate: Date
    @State private var location: String
    @State private var status: String
    @State private var notes: String

    init(interview: Interview, onSave: @escaping () -> Void) {
        self.interview = interview
        self.onSave = onSave
        _startDate = State(initialValue: interview.startDate)
        _endDate   = State(initialValue: interview.endDate)
        _location  = State(initialValue: interview.location)
        _status    = State(initialValue: interview.status)
        _notes     = State(initialValue: interview.notes ?? "") // optional fallback to ""
    }

    var body: some View {
        NavigationStack {
            Form {
                Section("Schedule") {
                    DatePicker("Start", selection: $startDate, displayedComponents: [.date, .hourAndMinute])
                    DatePicker("End", selection: $endDate, displayedComponents: [.date, .hourAndMinute])
                }
                Section("Location") {
                    TextField("Location or Zoom link", text: $location)
                }
                Section("Status") {
                    Picker("Status", selection: $status) {
                        Text("Scheduled").tag("Scheduled")
                        Text("Completed").tag("Completed")
                        Text("Cancelled").tag("Cancelled")
                    }
                }
                Section("Notes") {
                    TextField("Notes", text: $notes, axis: .vertical)
                        .lineLimit(3)
                }
            }
            .navigationTitle("Edit Interview")
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        saveChanges()
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

    private func saveChanges() {
        Task {
            do {
                interview.startDate = startDate
                interview.endDate   = endDate
                interview.location  = location
                interview.status    = status
                interview.notes     = notes.isEmpty ? nil : notes // if empty, set nil

                try context.save()
                onSave()
                dismiss()
            } catch {
                print("Error editing interview: \(error)")
            }
        }
    }
}
