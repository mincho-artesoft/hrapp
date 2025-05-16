import SwiftUI
import SwiftData

struct MineralListView: View {
    // MARK: – Queries & dependencies
    @Query private var minerals: [Mineral]
    @Environment(\.modelContext) private var modelContext

    /// The currently‑selected profile. May be `nil` if the user hasn’t created one yet.
    var profile: Profile?

    // MARK: – UI state
    @State private var searchText: String = ""

    // MARK: – Demographic label helper (100 % identical to the one in VitaminListView)
    private func demographicString(for profile: Profile) -> String {
        // 1. Бебета → използваме възрастта в месеци
        let months = Calendar.current.dateComponents([.month], from: profile.birthday, to: Date()).month ?? 0
        if months < 6 { return "Babies (0-6 months)" }
        if months < 12 { return "Babies (7-12 months)" }
        
        // 2. Деца и тийнейджъри (години)
        switch profile.age {
        case 1..<4:   return "Children (1-3 years)"
        case 4..<9:   return "Children (4-8 years)"
        case 9..<14:  return "Children (9-13 years)"
        case 14..<19: return "Adolescents (14-18 years)"
        default:      break
        }
        
        // 3. Възрастни – решаваме по gender String-а
        let isFemale = profile.gender.lowercased().hasPrefix("f")   // "female", "F", "woman" и т.н.
        return isFemale ? "Adult Women (19+)" : "Adult Men (19+)"
    }

    // MARK: – Minerals narrowed down to the active demographic + search text
    private var filteredMinerals: [Mineral] {
        let demo = profile.map(demographicString) // String? (nil if no profile)

        return minerals
            .map { mineral in
                guard let demo else { return mineral } // nothing to slim down

                // Keep only the requirement matching the demo
                if let req = mineral.requirements.first(where: { $0.demographic == demo }) {
                    return Mineral(name: mineral.name,
                                   unit: mineral.unit,
                                   requirements: [req])
                } else {
                    return mineral // No such record – show everything
                }
            }
            .filter { mineral in
                searchText.isEmpty ||
                mineral.name.lowercased().contains(searchText.lowercased())
            }
    }

    // MARK: – View
    var body: some View {
        VStack(spacing: 0) {
            // Embedded search field (same look & feel as vitamins)
            TextField("Search minerals",
                      text: $searchText,
                      prompt: Text("Search minerals"))
                .padding(10)
                .background(Color(.secondarySystemBackground.withAlphaComponent(0.95)))
                .cornerRadius(8)
                .padding(.horizontal)
                .padding(.bottom, 6)
                .submitLabel(.search)

            // Mineral list
            GeometryReader { geo in
                let cardHeight = geo.size.height * 0.9

                List {
                    ForEach(filteredMinerals) { mineral in
                        MineralRowView(mineral: mineral,
                                       demographic: profile.map(demographicString))
                        .contentShape(Rectangle())
                        .listRowBackground(Color(.clear))
                    }
                    .onDelete(perform: deleteMineral)
                }
                .frame(height: cardHeight)
                .listStyle(.plain)
            }
        }
        .padding(.top, 10)
        .background(Color.clear)
    }

    // MARK: – Delete helper (keeps the swipe‑to‑delete gesture alive)
    private func deleteMineral(at offsets: IndexSet) {
        withAnimation {
            for index in offsets {
                let mineral = filteredMinerals[index]
                modelContext.delete(mineral)
            }
            try? modelContext.save()
        }
    }
}
