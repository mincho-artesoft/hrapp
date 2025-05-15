//
//  FoodListView.swift
//  VitaHealth
//
//  Updated: 2025-05-15
//  • Sheet-овете са преместени в родителя (VitaHealth)
//  • Нови binding-и: isPresentingNewRecipe / editingRecipe
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

            // Scrollable list of cards
            ScrollView {
                GeometryReader { geo in
                    let cardWidth = geo.size.width * 0.9

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
            }
        }
        .padding(.top, 70)
        .toolbar {

            // Добавяне на нова храна
            Button { isPresentingNewFood = true } label: {
                Image(systemName: "plus")
            }
            .padding(.horizontal, -10)

            // Добавяне на нова рецепта
            Button { isPresentingNewRecipe = true } label: {
                Image(systemName: "text.badge.plus")
            }
            .padding(.horizontal, -10)

            // Изтрий всички
            Button(role: .destructive) { deleteAllFoods() } label: {
                Image(systemName: "trash")
            }
            .padding(.horizontal, -10)
        }
    }

    // MARK: – Filtered data
    private var filteredFoods: [Food] {
        foods.filter {
            searchText.isEmpty ||
            $0.name.lowercased().contains(searchText.lowercased())
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
