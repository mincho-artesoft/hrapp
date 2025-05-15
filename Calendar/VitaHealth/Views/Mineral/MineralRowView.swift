import SwiftUI

struct MineralRowView: View {
    let mineral: Mineral
    let demographic: String?

    var body: some View {
        VStack(alignment: .leading) {
            Text(mineral.name)
                .font(.headline)
            Text("Unit: \(mineral.unit)")
                .font(.caption)

            if let demo = demographic,
               let req = mineral.requirements.first(where: { $0.demographic == demo }) {
                // Single demographic block
                Text("\(req.dailyNeed) / \(req.upperLimit)")
                    .font(.caption2)
            } else {
                // All groups (no profile or missing data)
                ForEach(mineral.requirements, id: \.self) { req in
                    Text("\(req.dailyNeed) / \(req.upperLimit)")
                        .font(.caption2)
                }
            }
        }
        .padding(.vertical, 4)
    }
}
