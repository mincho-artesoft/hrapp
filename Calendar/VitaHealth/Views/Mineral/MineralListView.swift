//
//  MineralListView.swift
//  VitaHealth
//
//  Created by Mincho Milev on 2/3/25.
//

import SwiftUI
import SwiftData

struct MineralListView: View {
    @Query private var minerals: [Mineral]
    @Environment(\.modelContext) private var modelContext
    @EnvironmentObject var selectedMineralManager: SelectedMineralManager

    @State private var showAddMineral = false
    @State private var showEditMineral = false
    @State private var searchText: String = ""

    private var filteredMinerals: [Mineral] {
        minerals.filter { mineral in
            searchText.isEmpty ? true : mineral.name.lowercased().contains(searchText.lowercased())
        }
    }

    var body: some View {
        NavigationStack {
            List {
                ForEach(filteredMinerals) { mineral in
                    MineralRowView(mineral: mineral)
                        .contentShape(Rectangle())
                        .onTapGesture {
                            selectedMineralManager.selectedMineral = mineral
                            showEditMineral = true
                        }
                }
                .onDelete(perform: deleteMineral)
            }
            .searchable(text: $searchText, prompt: "Search minerals")
            .navigationTitle("Minerals")
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Clear Data") { clearAllMinerals() }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button { showAddMineral = true } label: { Image(systemName: "plus") }
                }
            }
            .sheet(isPresented: $showAddMineral) { AddMineralView() }
            .sheet(isPresented: $showEditMineral) {
                // Pass the selected mineral to the detail view.
                MineralDetailView(mineral: selectedMineralManager.selectedMineral!)
            }
        }
        // Print loaded minerals when the view appears.
        .onAppear {
            printLoadedMinerals()
        }
    }

    /// Prints all the loaded minerals and their details to the console.
    private func printLoadedMinerals() {
        print("----- Loaded Minerals -----")
        for mineral in minerals {
            print("Mineral: \(mineral.name), Unit: \(mineral.unit)")
            if mineral.requirements.isEmpty {
                print("  No requirements")
            } else {
                for req in mineral.requirements {
                    print("  Requirement: \(req.demographic) - Daily Need: \(req.dailyNeed) / Upper Limit: \(req.upperLimit)")
                }
            }
        }
        print("---------------------------")
    }

    private func deleteMineral(at offsets: IndexSet) {
        withAnimation {
            for index in offsets {
                let mineral = filteredMinerals[index]
                modelContext.delete(mineral)
            }
            try? modelContext.save()
        }
    }

    private func clearAllMinerals() {
        withAnimation {
            for mineral in minerals {
                modelContext.delete(mineral)
            }
            try? modelContext.save()
        }
    }
}
