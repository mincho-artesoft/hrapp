//
//  PerformanceReviewListView.swift
//  HRApp
//
//  Created by Mincho Milev on 1/18/25.
//


import SwiftUI
import SwiftData

struct PerformanceReviewListView: View {
    @Environment(\.modelContext) private var context
    
    @State private var reviews: [PerformanceReview] = []
    @State private var loading = false
    @State private var showingAddReview = false

    @StateObject private var reviewService = PerformanceReviewService()

    var body: some View {
        NavigationStack {
            Group {
                if loading {
                    LoadingSpinner()
                } else if reviews.isEmpty {
                    VStack(spacing: 10) {
                        Text("No performance reviews yet.")
                            .foregroundColor(.secondary)
                        Text("Tap + to add a new review.")
                            .foregroundColor(.secondary)
                    }
                } else {
                    List(reviews) { review in
                        NavigationLink(destination: PerformanceReviewDetailView(review: review)) {
                            VStack(alignment: .leading) {
                                Text(review.employee.fullName)
                                Text("Rating: \(review.rating)")
                                    .font(.subheadline)
                                Text("Date: \(review.date.formatted())")
                                    .font(.footnote)
                            }
                        }
                    }
                }
            }
            .navigationTitle("Performance Reviews")
            .toolbar {
                Button {
                    showingAddReview.toggle()
                } label: {
                    Image(systemName: "plus")
                }
            }
        }
        .sheet(isPresented: $showingAddReview) {
            AddPerformanceReviewView {
                fetchReviews() // refresh
            }
        }
        .onAppear {
            fetchReviews()
        }
    }

    private func fetchReviews() {
        Task {
            do {
                loading = true
                reviews = try reviewService.fetchReviews(context: context)
            } catch {
                print("Failed to fetch reviews: \(error)")
            }
            loading = false
        }
    }
}
