//
//  FoodListView.swift
//  VitaHealth
//
//  Created by Mincho Milev on 2/3/25.
//

import SwiftUI
import SwiftData

struct FoodListView: View {
    // Fetch Food objects from the persistent store.
    @Query private var foods: [Food]
    @Environment(\.modelContext) private var modelContext
    @EnvironmentObject var selectedFoodManager: SelectedFoodManager
    
    @State private var showAddFood = false
    @State private var showEditFood = false
    @State private var searchText: String = ""
    
    // Filter foods based on search text.
    private var filteredFoods: [Food] {
        foods.filter { food in
            // When searchText is empty, include all foods.
            searchText.isEmpty || food.name.lowercased().contains(searchText.lowercased())
        }
    }
    
    var body: some View {
        NavigationStack {
            List {
                ForEach(filteredFoods) { food in
                    FoodRowView(food: food)
                        .contentShape(Rectangle())
                    // Double-tap gesture to open FoodDetailView for editing.
                        .highPriorityGesture(
                            TapGesture(count: 2)
                                .onEnded {
                                    selectedFoodManager.selectedFood = food
                                    showEditFood = true
                                }
                        )
                    // Long-press gesture to open the edit view.
                        .onLongPressGesture {
                            selectedFoodManager.selectedFood = food
                            showEditFood = true
                        }
                    // Single tap selects the food.
                        .onTapGesture {
                            selectedFoodManager.selectedFood = food
                        }
                }
                .onDelete(perform: deleteFood)
            }
            .searchable(text: $searchText, prompt: "Search foods")
            .navigationTitle("Foods")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Clear Data") { clearAllFoods() }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button { showAddFood = true } label: { Image(systemName: "plus") }
                }
            }
            // Present sheets for adding and editing food.
            .sheet(isPresented: $showAddFood) { AddFoodView() }
            .sheet(isPresented: $showEditFood) {
                // Force unwrap is safe as you guarantee a food is selected.
                FoodDetailView(food: selectedFoodManager.selectedFood!)
            }
        }
    }
    
    /// Deletes Food objects at the specified offsets.
    private func deleteFood(at offsets: IndexSet) {
        withAnimation {
            for index in offsets {
                let food = filteredFoods[index]
                modelContext.delete(food)
            }
            try? modelContext.save()
        }
    }
    
    /// Deletes all Food objects in the persistent store.
    private func clearAllFoods() {
        withAnimation {
            for food in foods {
                modelContext.delete(food)
            }
            try? modelContext.save()
        }
    }
}
