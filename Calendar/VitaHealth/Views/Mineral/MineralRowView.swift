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
        let formatter: NumberFormatter = {
            let nf = NumberFormatter()
            nf.minimumFractionDigits = 0
            nf.maximumFractionDigits = 2
            nf.numberStyle = .decimal
            return nf
        }()

        let dailyNeedFormatted = formatter.string(from: NSNumber(value: req.dailyNeed)) ?? "\(req.dailyNeed)"

        if let upper = req.upperLimit {
            let upperFormatted = formatter.string(from: NSNumber(value: upper)) ?? "\(upper)"
            Text("min: \(dailyNeedFormatted)  max: \(upperFormatted)")
                .font(.caption2)
        } else {
            Text("min: \(dailyNeedFormatted)")
                .font(.caption2)
        }
    }
}
