//
//  AutoCompleteRow.swift
//  VitaHealth
//
//  Created by Mincho Milev on 2/8/25.
//

import SwiftUI
import SwiftData


// MARK: - AutoCompleteRow

/// A row used in the suggestions overlay.
struct AutoCompleteRow: View {
    var food: Food
    var nutrientExtractor: (Food) -> Nutrient?
    var onSelect: () -> Void
    
    // Tracks whether a drag gesture is active (to avoid accidental taps while scrolling).
    @GestureState private var isDragging: Bool = false
    
    var body: some View {
        let dragGesture = DragGesture(minimumDistance: 10)
            .updating($isDragging) { _, state, _ in
                state = true
            }
        
        HStack {
            Text(food.name)
                .foregroundColor(.gray)
                .lineLimit(1)
                .frame(maxWidth: .infinity, alignment: .leading)
            if let nutrient = nutrientExtractor(food) {
                HStack(spacing: 4) {
                    Text("\(nutrient.amount, specifier: "%.2f")")
                        .foregroundColor(.secondary)
                    Text(nutrient.unit)
                        .foregroundColor(.secondary)
                }
                .lineLimit(1)
            }
        }
        .padding(.vertical, 8)
        .padding(.horizontal)
        .background(Color.white)
        .contentShape(Rectangle())
        .simultaneousGesture(dragGesture)
        .onTapGesture {
            if !isDragging {
                onSelect()
            }
        }
    }
}
