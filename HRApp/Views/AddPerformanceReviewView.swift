//
//  AddPerformanceReviewView.swift
//  HRApp
//
//  Created by Mincho Milev on 1/19/25.
//


import SwiftUI
import SwiftData

struct AddPerformanceReviewView: View {
    @Environment(\.modelContext) private var context
    @Environment(\.dismiss) private var dismiss

    @StateObject private var reviewService = PerformanceReviewService()
    @StateObject private var employeeService = EmployeeService()
    
    // Data
    @State private var employees: [Employee] = []
    @State private var loadingEmployees = false

    // Form fields
    @State private var selectedEmployee: Employee?
    @State private var rating: Int = 3
    @State private var feedback: String = ""

    var onSave: () -> Void

    var body: some View {
        NavigationStack {
            Form {
                if loadingEmployees {
                    Section {
                        LoadingSpinner()
                    }
                } else {
                    Section(header: Text("Employee")) {
                        Picker("Employee", selection: $selectedEmployee) {
                            ForEach(employees, id: \.id) { emp in
                                Text(emp.fullName).tag(Optional(emp))
                            }
                        }
                    }
                    Section(header: Text("Review Details")) {
                        Stepper("Rating: \(rating)", value: $rating, in: 1...5)
                        TextField("Feedback", text: $feedback, axis: .vertical)
                            .lineLimit(4, reservesSpace: true)
                    }
                }
            }
            .navigationTitle("Add Review")
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        saveReview()
                    }
                    .disabled(selectedEmployee == nil || feedback.isEmpty)
                }
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
            }
        }
        .onAppear {
            fetchEmployees()
        }
    }

    private func fetchEmployees() {
        Task {
            do {
                loadingEmployees = true
                employees = try employeeService.fetchEmployees(context: context)
                if let first = employees.first {
                    selectedEmployee = first
                }
            } catch {
                print("Failed to fetch employees for review: \(error)")
            }
            loadingEmployees = false
        }
    }

    private func saveReview() {
        guard let employee = selectedEmployee else { return }

        Task {
            do {
                try reviewService.addReview(
                    context: context,
                    employee: employee,
                    feedback: feedback,
                    rating: rating
                )
                dismiss()
                onSave()
            } catch {
                print("Failed to add performance review: \(error)")
            }
        }
    }
}
