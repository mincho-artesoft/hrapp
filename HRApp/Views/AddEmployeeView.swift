//
//  AddEmployeeView.swift
//  HRApp
//
//  Created by Mincho Milev on 1/18/25.
//


import SwiftUI
import SwiftData

struct AddEmployeeView: View {
    @Environment(\.modelContext) private var context
    @Environment(\.dismiss) private var dismiss

    @StateObject private var employeeService = EmployeeService()
    
    @State private var firstName: String = ""
    @State private var lastName: String = ""
    @State private var email: String = ""
    @State private var phoneNumber: String = ""
    @State private var role: String = "Employee"
    
    var onSave: () -> Void

    var body: some View {
        NavigationStack {
            Form {
                Section(header: Text("Personal Info")) {
                    TextField("First Name", text: $firstName)
                    TextField("Last Name", text: $lastName)
                    TextField("Email", text: $email)
                    TextField("Phone Number", text: $phoneNumber)
                }
                Section(header: Text("Role")) {
                    Picker("Role", selection: $role) {
                        Text("Admin").tag("Admin")
                        Text("Manager").tag("Manager")
                        Text("Employee").tag("Employee")
                    }
                }
            }
            .navigationTitle("Add Employee")
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        Task {
                            do {
                                try employeeService.addEmployee(
                                    context: context,
                                    firstName: firstName,
                                    lastName: lastName,
                                    email: email,
                                    phone: phoneNumber,
                                    role: role
                                )
                                dismiss()
                                onSave()
                            } catch {
                                print("Error adding employee: \(error)")
                            }
                        }
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
