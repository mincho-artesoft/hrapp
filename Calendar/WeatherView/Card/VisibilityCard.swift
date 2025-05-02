import SwiftUI

struct VisibilityCard: View {
    let visibilityKm: Double?

    var body: some View {
        WeatherDetailCard {
            // Title - Top Left
            Label("VISIBILITY", systemImage: "eye.fill")
                .symbolRenderingMode(.hierarchical)
                .font(.system(size: 10, weight: .medium))
                .foregroundStyle(.secondary)

            // Main Value - Below Title
            HStack(alignment: .firstTextBaseline, spacing: 4) {
                if let vis = visibilityKm {
                    Text(String(format: "%.0f", vis))
                        .font(.system(size: 34, weight: .regular))
                        .foregroundStyle(.primary)
                    Text(GlobalState.distanceUnitLabel)
                        .font(.system(size: 14, weight: .regular))
                        .foregroundStyle(.secondary)
                } else {
                    Text("—")
                        .font(.system(size: 34, weight: .regular))
                        .foregroundStyle(.primary)
                    Text(GlobalState.distanceUnitLabel)
                        .font(.system(size: 14, weight: .regular))
                        .foregroundStyle(.secondary)
                }
            }

            Spacer()

            // Description - Bottom Left (локализуемый)
            Text(LocalizedStringKey(visibilityDescriptionKey(for: visibilityKm)))
                .font(.system(size: 12))
                .foregroundStyle(.primary)
        }
    }

    /// Возвращает ключ для описания видимости в зависимости от значения
    private func visibilityDescriptionKey(for vis: Double?) -> String {
        guard let v = vis else { return "visibility.unknown" }
        switch v {
        case _ where v > 20: return "visibility.perfect"
        case _ where v > 15: return "visibility.excellent"
        case _ where v > 10: return "visibility.good"
        case _ where v > 5:  return "visibility.moderate"
        case _ where v > 1:  return "visibility.poor"
        default:             return "visibility.verypoor"
        }
    }
}
