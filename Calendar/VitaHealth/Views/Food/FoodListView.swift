import SwiftUI
import SwiftData

struct FoodListView: View {
    // MARK: – Queries & dependencies
    @Query(
        filter: #Predicate<Food> { $0.isUserAdded == true },
        sort:   [SortDescriptor(\.name)]
    ) private var foods: [Food]
    
    @Environment(\.modelContext) private var modelContext

    // MARK: – External bindings
    @Binding var isPresentingNewFood: Bool
    @Binding var editingFood: Food?
    
    // MARK: – UI state
    @State private var searchText: String = ""

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
                                        editingFood = food
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
            Button {
                isPresentingNewFood = true
            } label: {
                Image(systemName: "plus")
            }
            
            // Delete all foods
            Button(role: .destructive) {
                deleteAllFoods()
            } label: {
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
