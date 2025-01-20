//
//  PerformanceReviewService.swift
//  HRApp
//
//  Created by Mincho Milev on 1/18/25.
//


import SwiftData
import Foundation

final class PerformanceReviewService: ObservableObject {
    
    func fetchReviews(context: ModelContext) throws -> [PerformanceReview] {
        let descriptor = FetchDescriptor<PerformanceReview>(
            sortBy: [SortDescriptor(\.date, order: .forward)]
        )
        return try context.fetch(descriptor)
    }

    func addReview(
        context: ModelContext,
        employee: Employee,
        feedback: String,
        rating: Int
    ) throws {
        let newReview = PerformanceReview(
            employee: employee,
            feedback: feedback,
            rating: rating
        )
        context.insert(newReview)
        try context.save()
    }
}
