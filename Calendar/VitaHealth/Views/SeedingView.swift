//
//  SeedingView.swift
//  VitaHealth
//
//  Created by Mincho Milev on 2/3/25.
//


import SwiftUI
import SwiftData

struct SeedingView: View {
    @Environment(\.modelContext) private var modelContext
    @Query private var foods: [Food]
    @Query private var vitamins: [Vitamin]
    @Query private var minerals: [Mineral]
    
    var body: some View {
        TabView {
            NavigationStack { FoodListView() }
                .tabItem { Label("Foods", systemImage: "list.bullet") }
            NavigationStack { VitaminListView() }
                .tabItem { Label("Vitamins", systemImage: "capsule") }
            NavigationStack { MineralListView() }
                .tabItem { Label("Minerals", systemImage: "drop") }
        }
        .task {
            if foods.isEmpty {
                // Convert each DefaultFood to a persistable Food model before insertion.
                for defaultFood in defaultFoodsList {
                    let food = Food.from(defaultFood: defaultFood)
                    modelContext.insert(food)
                }
            }
            if vitamins.isEmpty {
                for vitamin in defaultVitaminsList {
                    modelContext.insert(vitamin)
                }
            }
            if minerals.isEmpty {
                for mineral in defaultMineralsList {
                    modelContext.insert(mineral)
                }
            }
            try? modelContext.save()
        }
    }
}