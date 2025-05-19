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
        // 0. Ако е маркирана като бременна → Pregnant Women
//        if profile.selections.contains(where: { $0 == .pregnant }) {
//            return Demographic.pregnantWomen
//        }
//        // 0b. Ако е маркирана като кърмеща → Lactating Women
//        if profile.selections.contains(where: { $0 == .lactating }) {
//            return Demographic.lactatingWomen
//        }

        // 1. Бебета в месеци
        let months = Calendar.current
            .dateComponents([.month], from: profile.birthday, to: Date())
            .month ?? 0
        if months < 6 { return Demographic.babies0_6m }
        if months < 12 { return Demographic.babies7_12m }

        // 2. Деца и тийнейджъри (години)
        switch profile.age {
        case 1..<4:   return Demographic.children1_3y
        case 4..<9:   return Demographic.children4_8y
        case 9..<14:  return Demographic.children9_13y
        case 14..<19:
            return profile.gender.lowercased().hasPrefix("f")
                ? Demographic.adolescentFemales14_18y
                : Demographic.adolescentMales14_18y
        default:
            // 3. Възрастни
            let isFemale = profile.gender.lowercased().hasPrefix("f")
            if isFemale {
                return profile.age <= 50
                    ? Demographic.adultWomen19_50y
                    : Demographic.adultWomen51plusY
            } else {
                return profile.age <= 50
                    ? Demographic.adultMen19_50y
                    : Demographic.adultMen51plusY
            }
        }
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
