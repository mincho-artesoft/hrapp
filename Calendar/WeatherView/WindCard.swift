import SwiftUI

struct WindCard: View {
    let windSpeedKmh: Double
    let gustSpeedKmh: Double?
    let direction: Angle?
    let directionAbbreviation: String

    // Малка помощна функция за един ред текст + стойност
    @ViewBuilder
    func detailRow(label: String, value: String) -> some View {
        HStack {
            Text(label)
                .font(.system(size: 15, weight: .regular))
                .foregroundStyle(.primary)
            Spacer()
            Text(value)
                .font(.system(size: 15, weight: .regular))
                .foregroundStyle(.primary)
        }
    }

    // Компасът със стрелката
    @ViewBuilder
    func windCompass() -> some View {
         let compassSize: CGFloat = 90
         // Радиус на кръга, който ще скъса/прикрие средата на стрелката
         let coverCircleRadius: CGFloat = compassSize * 0.25

         ZStack {
             // Тикове (60 бр. през 6°)
              ForEach(0..<60) { i in
                  let isMajorTick = i % 5 == 0 // всеки 5‑ти (30°)
                  Rectangle()
                      .fill(Color.secondary.opacity(0.6))
                      .frame(width: 1, height: isMajorTick ? 6 : 4)
                      .offset(y: -(compassSize / 2 - 8))
                      .rotationEffect(.degrees(Double(i) * 6))
              }

             // Основни букви: N, E, S, W
             let letterOffset: CGFloat = compassSize / 2 - 1
             Text("N")
                 .font(.caption.weight(.medium))
                 .foregroundStyle(.secondary)
                 .offset(y: -letterOffset)
             Text("S")
                 .font(.caption.weight(.medium))
                 .foregroundStyle(.secondary)
                 .offset(y: letterOffset)
             Text("W")
                 .font(.caption.weight(.medium))
                 .foregroundStyle(.secondary)
                 .offset(x: -letterOffset)
             Text("E")
                 .font(.caption.weight(.medium))
                 .foregroundStyle(.secondary)
                 .offset(x: letterOffset)

             // --- Група за СТРЕЛКАТА (линия + връх) ---
             Group {
                 // Линия (Capsule)
                 Capsule()
                     .fill(Color.white)
                     // Височината = дължината на стрелката, широчината = дебелина
                     .frame(width: 2.5, height: compassSize * 0.22)

                 // Връх (Circle)
                 Circle()
                     .fill(Color.white)
                     .frame(width: 10, height: 10)
                     .offset(y: -(compassSize * 0.11 + 5))
             }
             .offset(y: -compassSize * 0.15) // Смъкваме малко нагоре, за да изглежда центрирано
             // Завъртаме спрямо посоката; 0° = North, 90° = East, и т.н.
             .rotationEffect(direction ?? Angle.zero)

             // Кръг, който покрива средата (ефект на "прекъсната" стрелка)
             Circle()
                 .fill(.ultraThinMaterial) // Или друг фон, ако имате
                 .frame(width: coverCircleRadius * 2, height: coverCircleRadius * 2)

             // Текст със скоростта (km/h) в центъра
             VStack(spacing: -2) {
                  Text(String(format: "%.0f", windSpeedKmh))
                       .font(.system(size: 26, weight: .medium))
                       .foregroundStyle(.primary)
                  Text("km/h")
                       .font(.system(size: 10, weight: .medium))
                       .foregroundStyle(.secondary)
                       .padding(.top, 2)
             }
         }
         .frame(width: compassSize, height: compassSize)
    }

    var body: some View {
        WeatherDetailCard {
            // Заглавие
            Label("WIND", systemImage: "wind")
                .font(.system(size: 10, weight: .medium))
                .foregroundStyle(.secondary)
                .padding(.bottom, 5)

            HStack(alignment: .center, spacing: 15) {
                // Лявата част (детайли)
                VStack(alignment: .leading, spacing: 8) {
                    // Основна скорост
                    detailRow(
                        label: "Wind",
                        value: "\(Int(windSpeedKmh.rounded())) km/h"
                    )
                    Divider().background(.white.opacity(0.3))

                    // Gusts, ако ги има и са по-високи
                    if let gust = gustSpeedKmh, gust > windSpeedKmh + 1 {
                        detailRow(
                            label: "Gusts",
                            value: "\(Int(gust.rounded())) km/h"
                        )
                        Divider().background(.white.opacity(0.3))
                    }

                    // Посока: примерно "279° WNW"
                    detailRow(
                        label: "Direction",
                        value: "\(Int(direction?.degrees.rounded() ?? 0))° \(directionAbbreviation)"
                    )
                }
                Spacer()

                // Компасът (дясната част)
                windCompass()
            }
        }
    }
}
