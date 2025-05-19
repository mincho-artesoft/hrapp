import SwiftUI

struct VitaminRowView: View {
    let vitamin: Vitamin
    let demographic: String?      // какъв етикет да показваме
    
    var body: some View {
        VStack(alignment: .leading) {
            Text(vitamin.name)
                .font(.headline)
            Text("Unit: \(vitamin.unit)")
                .font(.caption)
            
            if let demo = demographic,
               let req = vitamin.requirements.first(where: { $0.demographic == demo }) {
                // Само една група
                requirementView(for: req)
            } else {
                // Всички групи (ако няма профил или конкретните данни липсват)
                ForEach(vitamin.requirements) { req in
                    requirementView(for: req)
                }
            }
        }
        .padding(.vertical, 4)
    }
    
    @ViewBuilder
    private func requirementView(for req: Requirement) -> some View {
        if let upper = req.upperLimit {
            Text("min: \(req.dailyNeed)  max: \(upper)")
                .font(.caption2)
        } else {
            Text("min: \(req.dailyNeed)")
                .font(.caption2)
        }
    }
}
