import SwiftUI
import StoreKit

struct SubscriptionCard: View {
    let product: Product
    let isActive: Bool
    let isSelected: Bool
    let expirationDate: Date?
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 10) {
                 // VStack с текстовото съдържание
                 VStack(alignment: .leading, spacing: 5) {
                    Text(product.periodUnitOnly)
                        .font(.headline)
                        .foregroundColor(.primary)

                    Text(product.displayPrice)
                        .font(.title2.weight(.semibold))
                        .foregroundColor(.primary)

                     // Equivalent price text
                     if let yearlyPricePerMonth = product.pricePerMonth, product.subscription?.subscriptionPeriod.unit == .year {
                         Text("Equivalent to \(yearlyPricePerMonth) per month")
                             .font(.caption)
                             .foregroundColor(.secondary)
                     }

                     // Intro offer text
                    if !isActive, let intro = product.subscription?.introductoryOffer {
                        let plural = intro.period.value > 1
                        let unitText = intro.period.unit.noun(plural: plural).lowercased()
                        Text("\(intro.period.value) \(unitText) free")
                            .font(.subheadline.weight(.medium))
                            .foregroundColor(.orange)
                            .padding(.top, 2)
                    }
                }
                 // >>> ДОБАВЕТЕ ТОЗИ МОДИФИКАТОР КЪМ VStack <<<
                .frame(maxHeight: .infinity, alignment: .top) // Кара VStack да заеме цялата височина, подравнява съдържанието горе

                Spacer() // Избутва checkmark-а надясно

                 Image(systemName: isSelected ? "checkmark.circle.fill" : "circle")
                   .resizable()
                   .frame(width: 24, height: 24)
                   .foregroundColor(isSelected ? .accentColor : Color(.systemGray3))
                   .animation(.easeInOut(duration: 0.2), value: isSelected)

            }
            // Padding и други модификатори за цялата карта
            .padding(.vertical, 18)   // Запазваме увеличената височина
            .padding(.horizontal, 10) // Запазваме намалената ширина
            .frame(maxWidth: .infinity)
            .background(backgroundColor)
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .strokeBorder(borderColor, lineWidth: isSelected || isActive ? 2.5 : 1.5)
            )
            .scaleEffect(isSelected ? 1.02 : 1.0)
            .animation(.spring(response: 0.3, dampingFraction: 0.6), value: isSelected)
        }
        .buttonStyle(.plain)
    }

    // ... borderColor, backgroundColor ...
    private var borderColor: Color {
        if isActive { return .green }
        if isSelected { return .accentColor }
        return Color(.systemGray4)
    }

    private var backgroundColor: Color {
         Color(.secondarySystemGroupedBackground)
    }
}
