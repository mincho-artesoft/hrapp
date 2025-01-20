//
//  AddTimeOffView.swift
//  HRApp
//
//  Created by Mincho Milev on 1/19/25.
//


import SwiftUI
import SwiftData

struct AddTimeOffView: View {
    @Environment(\.modelContext) private var context
    @Environment(\.dismiss) private var dismiss

    @StateObject private var timeOffService = TimeOffService()
    @StateObject private var employeeService = EmployeeService()
    
    // Form fields
    @State private var selectedEmployee: Employee?
    @State private var startDate = Date()
    @State private var endDate = Date()
    @State private var reason = ""

    // We'll fetch employees so the user can pick which employee is requesting time off
    @State private var employees: [Employee] = []
    @State private var loadingEmployees = false

    // Callback to refresh the parent list
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
                    Section(header: Text("Dates")) {
                        DatePicker("Start Date", selection: $startDate, displayedComponents: .date)
                        DatePicker("End Date", selection: $endDate, displayedComponents: .date)
                    }
                    Section(header: Text("Reason")) {
                        TextField("Reason for time off", text: $reason)
                    }
                }
            }
            .navigationTitle("Request Time Off")
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        saveTimeOff()
                    }
                    .disabled(selectedEmployee == nil || reason.isEmpty)
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
                // Preselect the first employee if you want
                if let first = employees.first {
                    selectedEmployee = first
                }
            } catch {
                print("Failed to fetch employees for time off request: \(error)")
            }
            loadingEmployees = false
        }
    }

    private func saveTimeOff() {
        guard let employee = selectedEmployee else { return }

        Task {
            do {
                try timeOffService.requestTimeOff(
                    context: context,
                    employee: employee,
                    startDate: startDate,
                    endDate: endDate,
                    reason: reason
                )
                dismiss()
                onSave()
            } catch {
                print("Error creating time off request: \(error)")
            }
        }
    }
}
