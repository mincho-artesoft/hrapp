//
//  EmployeeDetailView.swift
//  HRApp
//
//  Created by Mincho Milev on 1/18/25.
//

import SwiftUI
import SwiftData

struct EmployeeDetailView: View {
    @Environment(\.modelContext) private var context
    let employee: Employee

    @StateObject private var employeeService = EmployeeService()
    @State private var showingDeleteAlert = false

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Name: \(employee.fullName)")
            Text("Email: \(employee.email)")
            Text("Phone: \(employee.phoneNumber)")
            Text("Role: \(employee.role)")
            if let department = employee.department {
                Text("Department: \(department.name)")
            } else {
                Text("Department: None")
            }
            Spacer()
            Button(role: .destructive) {
                showingDeleteAlert = true
            } label: {
                Text("Delete Employee")
                    .frame(maxWidth: .infinity)
            }
            .padding()
            .alert("Are you sure?", isPresented: $showingDeleteAlert) {
                Button("Delete", role: .destructive) {
                    deleteEmployee()
                }
                Button("Cancel", role: .cancel) {}
            }
        }
        .padding()
        .navigationTitle("Employee Details")
    }

    private func deleteEmployee() {
        Task {
            do {
                try employeeService.deleteEmployee(context: context, employee: employee)
            } catch {
                print("Failed to delete employee: \(error)")
            }
        }
    }
}
