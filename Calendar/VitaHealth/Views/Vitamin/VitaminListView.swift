//
//  VitaminListView.swift
//  VitaHealth
//
//  Created by Mincho Milev on 2/3/25.
//

import SwiftUI
import SwiftData

struct VitaminListView: View {
    @Query private var vitamins: [Vitamin]
    @Environment(\.modelContext) private var modelContext
    @EnvironmentObject var selectedVitaminManager: SelectedVitaminManager

    @State private var showAddVitamin = false
    @State private var showEditVitamin = false
    @State private var searchText: String = ""

    private var filteredVitamins: [Vitamin] {
        vitamins.filter { vitamin in
            searchText.isEmpty ? true : vitamin.name.lowercased().contains(searchText.lowercased())
        }
    }

    var body: some View {
        List {
            ForEach(filteredVitamins) { vitamin in
                VitaminRowView(vitamin: vitamin)
                    .contentShape(Rectangle())
                    .onTapGesture {
                        selectedVitaminManager.selectedVitamin = vitamin
                        showEditVitamin = true
                    }
            }
            .onDelete(perform: deleteVitamin)
        }
        .searchable(text: $searchText, prompt: "Search vitamins")
        .navigationTitle("Vitamins")
        .toolbar {
            ToolbarItem(placement: .navigationBarLeading) {
                Button("Clear Data") { clearAllVitamins() }
            }
            ToolbarItem(placement: .navigationBarTrailing) {
                Button { showAddVitamin = true } label: { Image(systemName: "plus") }
            }
        }
        .sheet(isPresented: $showAddVitamin) { AddVitaminView() }
        .sheet(isPresented: $showEditVitamin) {
            // Pass the selected vitamin to the detail view.
            VitaminDetailView(vitamin: selectedVitaminManager.selectedVitamin!)
        }
    }

    private func deleteVitamin(at offsets: IndexSet) {
        withAnimation {
            for index in offsets {
                let vitamin = filteredVitamins[index]
                modelContext.delete(vitamin)
            }
            try? modelContext.save()
        }
    }

    private func clearAllVitamins() {
        withAnimation {
            for vitamin in vitamins {
                modelContext.delete(vitamin)
            }
            try? modelContext.save()
        }
    }
}
