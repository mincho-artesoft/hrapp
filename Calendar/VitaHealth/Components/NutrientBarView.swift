import SwiftUI

struct NutrientBarView: View {
    var title:  String
    var amount: Double
    var unit:   String

    var need:   Double    // RDA
    var upper:  Double    // UL

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                Text(title)
                    .font(.subheadline.weight(.semibold))
                Spacer()
                Text("\(formatted(amount)) \(unit)")
                    .font(.subheadline)
            }

            GeometryReader { geo in
                let wMax   = geo.size.width
                let barMax = max(upper, need, amount, 1)

                ZStack(alignment: .leading) {
                    Rectangle()
                        .fill(Color(.systemGray4))
                        .frame(height: 6)

                    Rectangle()
                        .fill(Color.accentColor)
                        .frame(width: min(CGFloat(amount / barMax) * wMax, wMax),
                               height: 6)
                }
                .overlay(marker(at: need  / barMax * wMax, label: Int(need)))
                .overlay(marker(at: upper / barMax * wMax, label: Int(upper)))
            }
            .frame(height: 14)
        }
    }

    @ViewBuilder
    private func marker(at x: CGFloat, label: Int) -> some View {
        if x.isFinite && x > 0 {
            VStack(spacing: 2) {
                Image(systemName: "arrowtriangle.up.fill")
                    .font(.system(size: 6))
                    .foregroundColor(.gray)
                Text("\(label)")
                    .font(.caption2)
                    .foregroundColor(.gray)
            }
            .position(x: x, y: -4)
        }
    }

    private func formatted(_ v: Double) -> String {
        v >= 10 ? String(Int(v)) : String(format: "%.1f", v)
    }
}
