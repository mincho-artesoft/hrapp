// SubscriptionView.swift
// ArteCalendar
// Created by Aleksandar Svinarov on 29/4/25.

import SwiftUI

// MARK: - Category Enum
enum SubscriptionCategory: String, CaseIterable, Identifiable {
    case base = "Base"
    case advance = "Advance"
    case premium = "Premium"
    var id: String { rawValue }
}

// MARK: - Main Subscription View
struct SubscriptionView: View {
    @StateObject private var manager = SubscriptionManager.shared
    @State private var selectedCategory: SubscriptionCategory = .advance
    @State private var selectedProductID: String?

    var body: some View {
        NavigationView {
            VStack {
                // Picker to switch sections
                Picker("Plan", selection: $selectedCategory) {
                    ForEach(SubscriptionCategory.allCases) { category in
                        Text(category.rawValue).tag(category)
                    }
                }
                .pickerStyle(SegmentedPickerStyle())
                .padding()

                // Show subview per category
                Group {
                    switch selectedCategory {
                    case .base:
                        BaseSubscriptionView()
                    case .advance:
                        SubscriptionListView(
                            title: "Advance Plans",
                            products: manager.sortedProducts.filter { $0.id.contains("advance") },
                            selectedProductID: $selectedProductID
                        )
                    case .premium:
                        SubscriptionListView(
                            title: "Premium Plans",
                            products: manager.sortedProducts.filter { $0.id.contains("premium") },
                            selectedProductID: $selectedProductID
                        )
                    }
                }
                .onAppear { setupDefaultSelection() }
                .onChange(of: manager.products) { _ in setupDefaultSelection() }
                .onChange(of: manager.hasActiveSubscription) { _ in
                    if manager.hasActiveSubscription {
                        selectedProductID = manager.purchasedProductIDs.first
                    } else {
                        setupDefaultSelection()
                    }
                }

                Spacer()
            }
            .background(Color(.systemGroupedBackground).ignoresSafeArea())
        }
    }

    private func setupDefaultSelection() {
        switch selectedCategory {
        case .advance:
            selectedProductID = manager.sortedProducts
                .first(where: { $0.id.contains("advance") && $0.id.contains("yearly") })?.id
        case .premium:
            selectedProductID = manager.sortedProducts
                .first(where: { $0.id.contains("premium") && $0.id.contains("yearly") })?.id
        case .base:
            selectedProductID = nil
        }
    }
}

// MARK: - Base Subscription View
struct BaseSubscriptionView: View {
    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "gift")
                .font(.system(size: 50))
                .foregroundColor(.secondary)
            Text("Base Plan")
                .font(.title.bold())
            Text("Enjoy basic features for free. Upgrade to Advance or Premium for more.")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal)
        }
        .padding()
    }
}
