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
                requirementView(for: req)
            } else {
                // All groups (no profile or missing data)
                ForEach(mineral.requirements) { req in
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
