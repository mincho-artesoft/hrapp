//
//  PerformanceReview.swift
//  HRApp
//
//  Created by Mincho Milev on 1/18/25.
//


import SwiftData
import Foundation

@Model
class PerformanceReview {
    @Attribute(.unique) var id: UUID
    var employee: Employee
    var date: Date
    var feedback: String
    var rating: Int // e.g. 1-5

    init(
        id: UUID = UUID(),
        employee: Employee,
        date: Date = Date(),
        feedback: String,
        rating: Int
    ) {
        self.id = id
        self.employee = employee
        self.date = date
        self.feedback = feedback
        self.rating = rating
    }
}
