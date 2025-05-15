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
                Text("\(req.dailyNeed) / \(req.upperLimit)")
                    .font(.caption2)
            } else {
                // Всички групи (ако няма профил или конкретните данни липсват)
                ForEach(vitamin.requirements, id: \.self) { req in
                    Text("\(req.dailyNeed) / \(req.upperLimit)")
                        .font(.caption2)
                }
            }
        }
        .padding(.vertical, 4)
    }
}
