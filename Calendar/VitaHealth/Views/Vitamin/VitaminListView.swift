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
            .listStyle(.plain)
        }
        .padding(.top, 10)
        .background(Color.clear)
    }
}
