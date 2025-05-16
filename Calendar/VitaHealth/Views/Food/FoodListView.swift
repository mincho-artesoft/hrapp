//
//  FoodListView.swift
//  VitaHealth
//
//  Updated: 2025-05-16
//  • Местени бутони „Add Food/Recipe“ под Picker-а; премахнати от тулбара.
//  • Показва броя на продуктите и рецептите (динамично).
//

import SwiftUI
import SwiftData

struct FoodListView: View {

    // MARK: – Queries & dependencies
    @Query(
        filter: #Predicate<Food> { $0.isUserAdded },
        sort:   [SortDescriptor(\Food.name)]
    )
    private var foods: [Food]

    @Environment(\.modelContext) private var modelContext

    // MARK: – External bindings (идват от VitaHealth)
    @Binding var isPresentingNewFood:     Bool
    @Binding var editingFood:             Food?
    @Binding var isPresentingNewRecipe:   Bool
    @Binding var editingRecipe:           Food?

    // MARK: – UI state
    @State private var searchText = ""
    @State private var filter: Filter = .foods

    // MARK: – Filter options
    enum Filter: String, CaseIterable, Identifiable {
        case foods    = "Foods"
        case recipes  = "Recipes"

        var id: String { rawValue }
    }

    // MARK: – Derived data
    private var foodsOnly:   [Food] { foods.filter { !$0.isRecipe } }
    private var recipesOnly: [Food] { foods.filter {  $0.isRecipe } }

    private var foodsCountText: String   { "Foods (\(foodsOnly.count))" }
    private var recipesCountText: String { "Recipes (\(recipesOnly.count))" }

    private var filteredFoods: [Food] {
        foods.filter { food in
            let matchesSearch =
                searchText.isEmpty ||
                food.name.lowercased().contains(searchText.lowercased())

            let matchesFilter =
                (filter == .foods   && !food.isRecipe) ||
                (filter == .recipes &&  food.isRecipe)

            return matchesSearch && matchesFilter
        }
    }

    private var currentCountText: String {
        filter == .foods
        ? "\(foodsOnly.count) product\(foodsOnly.count == 1 ? "" : "s")"
        : "\(recipesOnly.count) recipe\(recipesOnly.count == 1 ? "" : "s")"
    }

    // MARK: – View
    var body: some View {
        VStack(spacing: 0) {

            // Search field
            TextField("Search foods",
                      text: $searchText,
                      prompt: Text("Search foods"))
            .padding(10)
            .background(Color(.secondarySystemBackground.withAlphaComponent(0.95)))
            .cornerRadius(8)
            .padding(.horizontal)
            .padding(.bottom, 6)
            .submitLabel(.search)

            // Filter picker with dynamic counts
            Picker("Filter", selection: $filter) {
                Text(foodsCountText).tag(Filter.foods)
                Text(recipesCountText).tag(Filter.recipes)
            }
            .pickerStyle(.segmented)
            .padding(.horizontal)
            .padding(.bottom, 4)

            // Current selection count
            Text(currentCountText)
                .font(.subheadline)
                .foregroundColor(.secondary)
                .padding(.bottom, 6)

            // Action buttons under picker
            HStack {
                Spacer()

                Button {
                    if filter == .foods {
                        isPresentingNewFood = true
                    } else {
                        isPresentingNewRecipe = true
                    }

                } label: {
                    Image(systemName: "plus")
                        .font(.title)
                }

                Button(role: .destructive) {
                    deleteAllFoods()
                } label: {
                    Image(systemName: "trash")
                        .font(.title)
                }
            }
            .padding(.vertical, 2)
            .padding(.horizontal, 20)

            GeometryReader { geo in
                let cardWidth  = geo.size.width * 0.9
                let cardHeight = geo.size.height * 0.88

                // Scrollable list of cards
                ScrollView {
                    LazyVStack(spacing: 12) {
                        ForEach(filteredFoods) { food in
                            row(for: food)
                                .contentShape(Rectangle())
                                .contextMenu {
                                    Button {
                                        food.isRecipe
                                        ? (editingRecipe = food)
                                        : (editingFood   = food)
                                    } label: {
                                        Label("Edit", systemImage: "pencil")
                                    }
                                    Button(role: .destructive) {
                                        delete(food: food)
                                    } label: {
                                        Label("Delete", systemImage: "trash")
                                    }
                                } preview: {
                                    row(for: food)
                                        .frame(width: cardWidth)
                                }
                                .frame(width: cardWidth)
                        }
                    }
                    .padding(.vertical, 8)
                    .padding(.horizontal)
                    Spacer()
                }
                .frame(height: cardHeight)
            }
        }
        .padding(.top, 70)
    }

    // MARK: – Single row (card)
    @ViewBuilder
    private func row(for food: Food) -> some View {
        FoodRowView(food: food)
            .padding()
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Color(.secondarySystemBackground))
            .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
            .shadow(radius: 1)
    }

    // MARK: – Helpers
    private func delete(food: Food) {
        withAnimation {
            modelContext.delete(food)
            try? modelContext.save()
        }
    }

    private func deleteAllFoods() {
        withAnimation {
            foods.forEach(modelContext.delete)
            try? modelContext.save()
        }
    }
}
