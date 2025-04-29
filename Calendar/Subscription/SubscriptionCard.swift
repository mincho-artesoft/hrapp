// SubscriptionCard.swift
// ArteCalendar
// Created by Aleksandar Svinarov on 29/4/25.

import SwiftUI
import StoreKit

struct SubscriptionCard: View {
    let product: Product
    let isActive: Bool
    let isSelected: Bool
    let expirationDate: Date?
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 10) {
                VStack(alignment: .leading, spacing: 5) {
                    Text(product.periodUnitOnly)
                        .font(.headline)
                    Text(product.displayPrice)
                        .font(.title2.weight(.semibold))
                    if let monthly = product.pricePerMonth,
                       product.subscription?.subscriptionPeriod.unit == .year {
                        Text("Equivalent to \(monthly) per month")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    if !isActive, let intro = product.subscription?.introductoryOffer {
                        let plural = intro.period.value > 1
                        let unit = intro.period.unit.noun(plural: plural).lowercased()
                        Text("\(intro.period.value) \(unit) free")
                            .font(.subheadline.weight(.medium))
                            .foregroundColor(.orange)
                            .padding(.top, 2)
                    }
                }
                .frame(maxHeight: .infinity, alignment: .top)

                Spacer()

                Image(systemName: isSelected ? "checkmark.circle.fill" : "circle")
                    .resizable()
                    .frame(width: 24, height: 24)
                    .foregroundColor(isSelected ? .accentColor : Color(.systemGray3))
                    .animation(.easeInOut(duration: 0.2), value: isSelected)
            }
            .padding(.vertical, 18)
            .padding(.horizontal, 10)
            .background(Color(.secondarySystemGroupedBackground))
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .strokeBorder(isActive ? Color.green : (isSelected ? Color.accentColor : Color(.systemGray4)),
                                  lineWidth: isSelected || isActive ? 2.5 : 1.5)
            )
            .scaleEffect(isSelected ? 1.02 : 1.0)
            .animation(.spring(response: 0.3, dampingFraction: 0.6), value: isSelected)
        }
        .buttonStyle(.plain)
    }
}
