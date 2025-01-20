//
//  Employee.swift
//  HRApp
//

import SwiftData
import Foundation

@Model
class Employee {
    @Attribute(.unique) var id: UUID
    var firstName: String
    var lastName: String
    var email: String
    var phoneNumber: String
    var department: Department?
    var role: String
    var hireDate: Date
    var photoURL: URL?

    init(
        id: UUID = UUID(),
        firstName: String,
        lastName: String,
        email: String,
        phoneNumber: String,
        department: Department? = nil,
        role: String,
        hireDate: Date = Date(),
        photoURL: URL? = nil
    ) {
        self.id = id
        self.firstName = firstName
        self.lastName = lastName
        self.email = email
        self.phoneNumber = phoneNumber
        self.department = department
        self.role = role
        self.hireDate = hireDate
        self.photoURL = photoURL
    }
}

extension Employee {
    var fullName: String {
        "\(firstName) \(lastName)"
    }
}
