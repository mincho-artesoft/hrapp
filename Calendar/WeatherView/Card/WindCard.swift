import SwiftUI

struct WindCard: View {
    /// Скорост на вятъра (вече конвертирана съгласно GlobalState.measurementSystem)
    let windSpeed: Double
    /// Пориви на вятъра (вече конвертирани)
    let gustSpeed: Double?
    /// Посока на вятъра като ъгъл
    let direction: Angle?
    /// Абревиатура на посоката („N“, „NE“, „E“ и т.н.)
    let directionAbbreviation: String

    @Environment(\.colorScheme) private var colorScheme

    // Маркирано като ViewBuilder, за да може да го ползва SwiftUI
    @ViewBuilder
    private func windCompass() -> some View {
        let compassSize: CGFloat = 90
        let coverCircleRadius: CGFloat = compassSize * 0.25

        ZStack {
            // 60 тика по циферблата
            ForEach(0..<60) { i in
                let isMajor = i % 5 == 0
                Rectangle()
                    .fill(Color.secondary.opacity(0.6))
                    .frame(width: 1, height: isMajor ? 6 : 4)
                    .offset(y: -(compassSize / 2 - 8))
                    .rotationEffect(.degrees(Double(i) * 6))
            }

            // Основните компасни букви
            let letterOffset: CGFloat = compassSize / 2 - 1
            Text(NSLocalizedString("Compass_N", comment: "North"))
                .font(.caption.weight(.medium))
                .foregroundStyle(.secondary)
                .offset(y: -letterOffset)
            Text(NSLocalizedString("Compass_S", comment: "South"))
                .font(.caption.weight(.medium))
                .foregroundStyle(.secondary)
                .offset(y: letterOffset)
            Text(NSLocalizedString("Compass_W", comment: "West"))
                .font(.caption.weight(.medium))
                .foregroundStyle(.secondary)
                .offset(x: -letterOffset)
            Text(NSLocalizedString("Compass_E", comment: "East"))
                .font(.caption.weight(.medium))
                .foregroundStyle(.secondary)
                .offset(x: letterOffset)

            // (1) От къде духа: бяла стрелка
            Group {
                Capsule()
                    .fill(Color.white)
                    .frame(width: 2.5, height: compassSize * 0.22)
                Circle()
                    .fill(Color.white)
                    .frame(width: 10, height: 10)
                    .offset(y: -(compassSize * 0.11 + 5))
            }
            .offset(y: -compassSize * 0.15)
            .rotationEffect(direction ?? .zero)

            // (2) Къде отива: стрелка +180°
            Group {
                Capsule()
                    .fill(Color.white)
                    .frame(width: 2.5, height: compassSize * 0.22)
                TriangleArrow()              // Вашият custom Shape
                    .fill(Color.white)
                    .frame(width: 10, height: 10)
                    .offset(y: -(compassSize * 0.11 + 5))
            }
            .offset(y: -compassSize * 0.15)
            .rotationEffect((direction ?? .zero) + .degrees(180))

            // Централен полупрозрачен кръг
            Circle()
                .fill(.ultraThinMaterial)
                .frame(width: coverCircleRadius * 1.3,
                       height: coverCircleRadius * 1.3)
                .brightness(colorScheme == .dark ? 0.01 : 0.1)

            // Текстова индикация на скоростта
            VStack(spacing: -6) {
                Text(String(format: "%.0f", windSpeed))
                    .font(.system(size: 20, weight: .medium))
                Text(GlobalState.speedUnitLabel)
                    .font(.system(size: 6, weight: .medium))
                    .foregroundStyle(.secondary)
                    .padding(.top, 2)
            }
        }
        .frame(width: compassSize, height: compassSize)
    }

    @ViewBuilder
    private func detailRow(label: LocalizedStringKey, value: String) -> some View {
        HStack {
            Text(label)
            Spacer()
            Text(value)
        }
    }

    var body: some View {
        WeatherDetailCard {
            Label("WIND", systemImage: "wind")
                .font(.system(size: 10, weight: .medium))
                .foregroundStyle(.secondary)
                .padding(.bottom, 5)

            HStack(spacing: 15) {
                VStack(alignment: .leading, spacing: 8) {
                    // Основна скорост
                    detailRow(
                        label: "Wind",
                        value: String(format: "%d %@", Int(windSpeed.rounded()), GlobalState.speedUnitLabel)
                    )
                    Divider().background(.white.opacity(0.3))

                    // Пориви, ако има значима разлика
                    if let gust = gustSpeed, gust > windSpeed + 1 {
                        detailRow(
                            label: "Gusts",
                            value: String(format: "%d %@", Int(gust.rounded()), GlobalState.speedUnitLabel)
                        )
                        Divider().background(.white.opacity(0.3))
                    }

                    // Посока (напр. "279° WNW")
                    detailRow(
                        label: "Direction",
                        value: "\(Int(direction?.degrees.rounded() ?? 0))° \(directionAbbreviation)"
                    )
                }

                Spacer()

                windCompass()
            }
        }
    }
}
