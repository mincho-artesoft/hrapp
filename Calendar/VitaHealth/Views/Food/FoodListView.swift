//
//  FoodListView.swift
//  VitaHealth
//
//  Updated: 2025-05-16
//  • Местени бутони „Add Food/Recipe“ под Picker-а; премахнати от тулбара.
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

            // Filter picker
            Picker("Filter", selection: $filter) {
                ForEach(Filter.allCases) { option in
                    Text(option.rawValue).tag(option)
                }
            }
            .pickerStyle(.segmented)
            .padding(.horizontal)
            .padding(.bottom, 6)

            // Action buttons under picker
            HStack {
                Spacer()
                
                Button {
                    if filter == .foods{
                        isPresentingNewFood = true
                    }else if filter == .recipes{
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
                let cardWidth = geo.size.width * 0.9
                let cardHeight = geo.size.height * 0.85
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
                }
                .frame(height: cardHeight)
            }
        }
        .padding(.top, 70)
    }

    // MARK: – Filtered data
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
