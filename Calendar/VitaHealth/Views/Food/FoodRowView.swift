import SwiftUI

struct FoodRowView: View {
    var food: Food
    
    // ─────────────────────────────────────────────────────────────
    // MARK: – Micro-data helpers
    // ─────────────────────────────────────────────────────────────
    
    /// (име, форматиран текст, количество) сортирани по количество ↓
    private var vitaminData: [(name: String, text: String, amount: Double)] {
        food.vitamins
            .filter { $0.amount > 0 }
            .map { ($0.name,
                    "\($0.name) \($0.amount.clean) \($0.unit)",
                    $0.amount) }
            .sorted { $0.amount > $1.amount }
    }
    
    private var mineralData: [(name: String, text: String, amount: Double)] {
        food.minerals
            .filter { $0.amount > 0 }
            .map { ($0.name,
                    "\($0.name) \($0.amount.clean) \($0.unit)",
                    $0.amount) }
            .sorted { $0.amount > $1.amount }
    }
    
    /// UIImage, ако обектът е рецепта и има корица
    private var coverUIImage: UIImage? {
        guard let data = food.coverImage else { return nil }
        return UIImage(data: data)
    }
    
    // ─────────────────────────────────────────────────────────────
    // MARK: – State (show / hide micro-lists)
    // ─────────────────────────────────────────────────────────────
    @State private var showAllVitamins = false
    @State private var showAllMinerals = false
    
    // ─────────────────────────────────────────────────────────────
    // MARK: – Body
    // ─────────────────────────────────────────────────────────────
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            
            // 1) Само заглавие
            Text(food.name)
                .font(.headline)
            
            // 2) Втори ред – изображение/placeholder + макроси + грамаж/време
            HStack(alignment: .top, spacing: 12) {
                
                // Изображение или placeholder
                ZStack {
                    if let img = coverUIImage {
                        Image(uiImage: img)
                            .resizable()
                            .scaledToFill()
                    } else {
                        Color(.systemGray5)
                            .opacity(0.4)
                        Image(systemName: "photo")
                            .imageScale(.large)
                            .foregroundColor(.secondary)
                    }
                }
                .frame(width: 80, height: 60)
                .clipped()
                .cornerRadius(6)
                .overlay(
                    RoundedRectangle(cornerRadius: 6)
                        .stroke(Color.secondary.opacity(0.2), lineWidth: 1)
                )
                
                Spacer()
                
                // Макро-стойности
                VStack(alignment: .leading, spacing: 2) {
                    Text("Carbs: \(food.carbohydrates, specifier: "%.1f") g")
                    Text("Fats:  \(food.fats,          specifier: "%.1f") g")
                    Text("Prot:  \(food.proteins,      specifier: "%.1f") g")
                }
                .font(.subheadline)
                .fixedSize(horizontal: false, vertical: true)
                
                Spacer()
                
                // Грамаж + време на приготвяне
                VStack(alignment: .trailing, spacing: 2) {
                    Text("\(food.servingSize, specifier: "%.0f") g")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                    
                    if let minutes = food.preparationTime {
                        Text("\(minutes) min")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                }
            }
            
            // 3) Под тях – витамини / минерали
            if !vitaminData.isEmpty {
                microLine(title: "Vits:",
                          data: vitaminData,
                          showAll: $showAllVitamins)
            }
            if !mineralData.isEmpty {
                microLine(title: "Mins:",
                          data: mineralData,
                          showAll: $showAllMinerals)
            }
        }
        .padding(.vertical, 4)
    }
    
    // ─────────────────────────────────────────────────────────────
    // MARK: – Helpers
    // ─────────────────────────────────────────────────────────────
    @ViewBuilder
    private func microLine(
        title: String,
        data: [(name: String, text: String, amount: Double)],
        showAll: Binding<Bool>
    ) -> some View {
        
        let remaining = max(0, data.count - 3)
        
        if showAll.wrappedValue || remaining == 0 {
            // показваме всичко
            Text("\(title) " + data.map(\.text).joined(separator: ", "))
                .multilineTextAlignment(.leading)
                .font(.subheadline)
            
        } else {
            // първите 3 + бутон  …+n
            let firstThree = data.prefix(3)
                .map(\.text)
                .joined(separator: ", ")
            
            HStack(alignment: .firstTextBaseline, spacing: 0) {
                Text("\(title) " + firstThree + ", ")
                    .multilineTextAlignment(.leading)
                    .font(.subheadline)
                
                Button("…+\(remaining)") {
                    withAnimation { showAll.wrappedValue = true }
                }
                .font(.subheadline)
                .buttonStyle(.plain) // без фон
            }
        }
    }
}
