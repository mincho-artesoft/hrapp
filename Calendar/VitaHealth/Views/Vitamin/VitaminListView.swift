import SwiftUI
import SwiftData

struct VitaminListView: View {
    // MARK: – Queries & dependencies
    @Query private var vitamins: [Vitamin]
    @Environment(\.modelContext) private var modelContext
    
    /// Избраният профил (може да е `nil`, ако още няма такъв).
    var profile: Profile?
    
    // MARK: – UI state
    @State private var searchText: String = ""
    
    // MARK: – Демографски етикет за даден профил
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

    
    // MARK: – Списък, „свит“ до конкретния демографски запис
    private var filteredVitamins: [Vitamin] {
        let demo = profile.map(demographicString)   // String?  (nil, ако няма профил)
        
        return vitamins
            .map { vitamin in
                guard let demo else { return vitamin }       // ако няма профил → непокътнат витамин
                
                // вземаме Requirement само за нужната група
                if let req = vitamin.requirements.first(where: { $0.demographic == demo }) {
                    // връщаме копие със „свит“ масив requirements
                    return Vitamin(name: vitamin.name,
                                   unit: vitamin.unit,
                                   requirements: [req])
                } else {
                    // ако липсва такъв запис – връщаме оригинала (ще покаже всички групи)
                    return vitamin
                }
            }
            .filter { vitamin in
                searchText.isEmpty
                || vitamin.name.lowercased().contains(searchText.lowercased())
            }
    }
    
    // MARK: – View
    var body: some View {
        VStack(spacing: 0) {
            // Търсачка
            TextField("Search vitamins",
                      text: $searchText,
                      prompt: Text("Search vitamins"))
                .padding(10)
                .background(Color(.secondarySystemBackground.withAlphaComponent(0.95)))
                .cornerRadius(8)
                .padding(.horizontal)
                .padding(.bottom, 6)
                .submitLabel(.search)
            
            // Списък
            GeometryReader { geo in
                let cardHeight = geo.size.height * 0.9
                List {
                    ForEach(filteredVitamins) { vitamin in
                        VitaminRowView(
                            vitamin: vitamin,
                            demographic: profile.map(demographicString)
                        )
                        .contentShape(Rectangle())
                        .listRowBackground(Color(.clear))
                    }
                }
                .frame(height: cardHeight)
                .listStyle(.plain)
            }
        }
        .padding(.top, 10)
        .background(Color.clear)
    }
}
