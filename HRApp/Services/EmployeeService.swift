//
//  EmployeeService.swift
//  HRApp
//
//  Created by Mincho Milev on 1/18/25.
//


import SwiftData
import Foundation

final class EmployeeService: ObservableObject {
    
    func fetchEmployees(context: ModelContext) throws -> [Employee] {
        let descriptor = FetchDescriptor<Employee>(
            sortBy: [SortDescriptor(\.lastName, order: .forward)]
        )
        return try context.fetch(descriptor)
    }

    func addEmployee(
        context: ModelContext,
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        role: String,
        department: Department? = nil
    ) throws {
        let newEmployee = Employee(
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phone,
            department: department,
            role: role
        )
        context.insert(newEmployee)
        try context.save()
    }
    
    func deleteEmployee(context: ModelContext, employee: Employee) throws {
        context.delete(employee)
        try context.save()
    }
}
