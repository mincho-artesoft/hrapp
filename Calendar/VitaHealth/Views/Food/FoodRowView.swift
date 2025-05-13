//
//  FoodRowView.swift
//  VitaHealth
//
//  Created by Mincho Milev on 2/3/25.
//


import SwiftUI

struct FoodRowView: View {
    var food: Food
    
    var body: some View {
        HStack(alignment: .center) {
            Text(food.name)
                .font(.headline)
                .frame(minWidth: 100, alignment: .leading)
            VStack(alignment: .leading, spacing: 2) {
                if let topVits = topNutrients(from: food.vitamins, maxCount: 3) {
                    Text("Vits: " + topVits.map {
                        "\($0.name) (\(String(format: "%.0f", $0.amount)) IU)"
                    }.joined(separator: ", "))
                        .font(.caption)
                        .lineLimit(1)
                }
                if let topMins = topNutrients(from: food.minerals, maxCount: 3) {
                    Text("Mins: " + topMins.map {
                        "\($0.name) (\(String(format: "%.0f", $0.amount)) µg)"
                    }.joined(separator: ", "))
                        .font(.caption)
                        .lineLimit(1)
                }
                Text("Carbs: \(food.carbohydrates, specifier: "%.1f") g")
                    .font(.caption)
                    .lineLimit(1)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            Text("\(food.servingSize, specifier: "%.0f")g")
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
        .padding(.vertical, 4)
    }
    
    private func topNutrients(from nutrients: [Nutrient], maxCount: Int) -> [Nutrient]? {
        let sorted = nutrients.sorted { $0.amount > $1.amount }
        return sorted.isEmpty ? nil : Array(sorted.prefix(maxCount))
    }
}