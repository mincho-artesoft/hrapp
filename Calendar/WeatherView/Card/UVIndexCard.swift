import SwiftUI

struct UVIndexCard: View {
    @Environment(\.layoutDirection) private var layoutDirection

    let uvIndex: Int?
    // Уверете се, че `categoryInfo.description` съдържа КЛЮЧА за локализация (напр. "Low", "Moderate")
    // А `categoryInfo.color` е цветът, асоцииран с тази категория.
    let categoryInfo: (description: String, color: Color)

    // UV Bar, стилизирана както в екранната снимка
    @ViewBuilder func uvBar() -> some View {
        GeometryReader { geometry in
            let totalWidth = geometry.size.width
            let barHeight: CGFloat = 5 // Намалена височина за по-добро съответствие с тънките линии в другите UI елементи
            let maxUV: Double = 11 // Скалата визуално завършва около 11+
            let fraction = min(1.0, max(0.0, Double(uvIndex ?? 0) / maxUV))
            let indicatorWidth: CGFloat = 3 // Ширина на белия индикатор
            // Изчисляване на позицията за *центъра* на индикатора
            let visualFraction = layoutDirection == .rightToLeft ? 1 - fraction : fraction
            let indicatorCenterX = (totalWidth - indicatorWidth) * visualFraction + (indicatorWidth / 2)
            let gradientStart: UnitPoint = layoutDirection == .rightToLeft ? .trailing : .leading
            let gradientEnd: UnitPoint = layoutDirection == .rightToLeft ? .leading : .trailing

            ZStack {
                // Градиентен фон на лентата
                LinearGradient(
                    gradient: Gradient(colors: [.green, .yellow, .orange, .red, .purple]),
                    startPoint: gradientStart,
                    endPoint: gradientEnd
                )
                    .frame(height: barHeight)
                    .clipShape(Capsule()) // Заоблени краища

                // Бял индикатор (вертикална капсула)
                Capsule()
                   .fill(Color.white)
                   .frame(width: indicatorWidth, height: barHeight * 1.8) // Леко по-висок и по-тънък
                   .shadow(color: .black.opacity(0.3), radius: 1, x: 0, y: 1)
                   // Позициониране на центъра на индикаторната капсула
                   .position(x: indicatorCenterX, y: geometry.size.height / 2)

            }
            // Центриране на ZStack вертикално в GeometryReader
            .frame(maxHeight: .infinity)
        }
        .frame(height: 12) // Височина за самия контейнер GeometryReader (леко увеличена за по-добро позициониране на индикатора)
    }

    var body: some View {
        WeatherDetailCard {
            VStack(alignment: .leading, spacing: 4) { // Намален spacing за по-компактен вид
                // Заглавие - Горе вляво
                // "UV INDEX" ще бъде автоматично потърсено в Localizable.strings
                Label(NSLocalizedString("UV INDEX", comment: "UV index card title"), systemImage: "sun.max.fill")
                    .font(.system(size: 10, weight: .medium))
                    .foregroundStyle(.secondary)
                    .adaptiveSingleLine(minimumScale: 0.4)
                    .symbolRenderingMode(.multicolor) // Жълто слънце

                // Основна стойност - Под заглавието
                Text(uvIndex.map { localizedIntegerString($0) } ?? "–") // Показва тире, ако uvIndex е nil
                    .font(.system(size: 34, weight: .regular)) // Стандартно тегло
                    .foregroundStyle(.primary)
                    .lineLimit(1) // Гарантира, че е на един ред
                    .minimumScaleFactor(0.5)
                    .allowsTightening(true)

                // Описание на категорията - Под основната стойност
                // categoryInfo.description (който е ключ) ще бъде потърсен в Localizable.strings
                Text(LocalizedStringKey(categoryInfo.description)) // Изрично използване на LocalizedStringKey
                    .font(.system(size: 12, weight: .regular)) // Стандартно тегло
                    .foregroundStyle(.primary)
                    .lineLimit(1)
                    .minimumScaleFactor(0.4)
                    .allowsTightening(true)

                Spacer(minLength: 8) // Минимално разстояние, за да бутне лентата надолу

                // UV Лента - Отдолу
                uvBar()
            }
        }
    }
}
