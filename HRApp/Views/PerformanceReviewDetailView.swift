//
//  PerformanceReviewDetailView.swift
//  HRApp
//
//  Created by Mincho Milev on 1/18/25.
//

import SwiftUI
import SwiftData

struct PerformanceReviewDetailView: View {
    @Environment(\.modelContext) private var context
    let review: PerformanceReview

    // We don't have an edit or delete mechanism here yet,
    // but you could add one similarly to the Employee detail.

    var body: some View {
        Form {
            Section(header: Text("Employee")) {
                Text(review.employee.fullName)
            }
            Section(header: Text("Review")) {
                Text("Date: \(review.date.formatted())")
                Text("Feedback: \(review.feedback)")
                Text("Rating: \(review.rating)")
            }
        }
        .navigationTitle("Review Details")
    }
}
