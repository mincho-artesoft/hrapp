//
//  NutrientRowView.swift
//  VitaHealth
//
//  Created by Mincho Milev on 2/3/25.
//


import SwiftUI

struct NutrientRowView: View {
    @ObservedObject var nutrient: Nutrient
    var maxAmount: Double
    var isEditing: Bool
    
    var body: some View {
        VStack(alignment: .leading) {
            Text(nutrient.name)
                .font(.headline)
            if isEditing {
                HStack {
                    TextField("Amount", value: $nutrient.amount, format: .number)
                        .textFieldStyle(.roundedBorder)
                        .frame(width: 80)
                    Text(nutrient.unit)
                }
            } else {
                HStack {
                    Text("\(nutrient.amount, specifier: "%.1f") \(nutrient.unit)")
                    Spacer()
                }
            }
            ProgressView(value: nutrient.amount, total: maxAmount)
                .progressViewStyle(.linear)
        }
        .padding(.vertical, 4)
    }
}