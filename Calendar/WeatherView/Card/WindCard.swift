import SwiftUI

struct WindCard: View {
    let windSpeedKmh: Double
    let gustSpeedKmh: Double?
    let direction: Angle?
    let directionAbbreviation: String
    @Environment(\.colorScheme) var colorScheme

    // Компас (примерна визуализация)
    @ViewBuilder
    func windCompass() -> some View {
        let compassSize: CGFloat = 90
        let coverCircleRadius: CGFloat = compassSize * 0.25

        ZStack {
            // Тикове (0...59)
            ForEach(0..<60) { i in
                let isMajorTick = i % 5 == 0
                Rectangle()
                    .fill(Color.secondary.opacity(0.6))
                    .frame(width: 1, height: isMajorTick ? 6 : 4)
                    .offset(y: -(compassSize / 2 - 8))
                    .rotationEffect(.degrees(Double(i) * 6))
            }
            
            // Основни букви
            let letterOffset: CGFloat = compassSize / 2 - 1
            
            Text(NSLocalizedString("Compass_N", comment: "North"))
                .font(.caption.weight(.medium))
                .foregroundStyle(.secondary)
                .offset(y: -letterOffset)
            
            // Юг
            Text(NSLocalizedString("Compass_S", comment: "South"))
                .font(.caption.weight(.medium))
                .foregroundStyle(.secondary)
                .offset(y: letterOffset)
            
            // Запад
            Text(NSLocalizedString("Compass_W", comment: "West"))
                .font(.caption.weight(.medium))
                .foregroundStyle(.secondary)
                .offset(x: -letterOffset)
            
            // Изток
            Text(NSLocalizedString("Compass_E", comment: "East"))
                .font(.caption.weight(.medium))
                .foregroundStyle(.secondary)
                .offset(x: letterOffset)
            
            // (1) Стрелка (откъде духа)
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
            
            // (2) Стрелка (накъде отива) = +180°
            Group {
                Capsule()
                    .fill(Color.white)
                    .frame(width: 2.5, height: compassSize * 0.22)
                TriangleArrow()
                    .fill(Color.white)
                    .frame(width: 10, height: 10)
                    .offset(y: -(compassSize * 0.11 + 5))
            }
            .offset(y: -compassSize * 0.15)
            .rotationEffect((direction ?? .zero) + .degrees(180))
            
            // Ползваме опакования стил
            Circle()
                .fill(.ultraThinMaterial)
                .frame(width: coverCircleRadius * 1.3, height: coverCircleRadius * 1.3)
                .brightness((colorScheme == .dark) ? 0.01 : 0.1)
            
            // Текст за скоростта
            VStack(spacing: -6) {
                Text(String(format: "%.0f", windSpeedKmh))
                    .font(.system(size: 20, weight: .medium))
                Text("km/h") // Ще се локализира чрез Localizable.strings
                    .font(.system(size: 6, weight: .medium))
                    .foregroundStyle(.secondary)
                    .padding(.top, 2)
            }
        }
        .frame(width: compassSize, height: compassSize)
    }

    // Ред за детайли
    @ViewBuilder
    func detailRow(label: LocalizedStringKey, value: String) -> some View {
        HStack {
            Text(label)
            Spacer()
            Text(value)
        }
    }

    var body: some View {
        WeatherDetailCard {
            Label("WIND", systemImage: "wind") // Ще се локализира чрез Localizable.strings
                .font(.system(size: 10, weight: .medium))
                .foregroundStyle(.secondary)
                .padding(.bottom, 5)

            HStack(alignment: .center, spacing: 15) {
                VStack(alignment: .leading, spacing: 8) {
                    detailRow(
                        label: "Wind",
                        value: String(format: "%d %@", Int(windSpeedKmh.rounded()), NSLocalizedString("km/h", comment: "unit for kilometers per hour"))
                    )
                    Divider().background(.white.opacity(0.3))

                    if let gust = gustSpeedKmh, gust > windSpeedKmh + 1 {
                        detailRow(
                            label: "Gusts",
                            value: String(format: "%d %@", Int(gust.rounded()), NSLocalizedString("km/h", comment: "unit for kilometers per hour"))
                        )
                        Divider().background(.white.opacity(0.3))
                    }

                    // Пример: "279° WNW"
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
