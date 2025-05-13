import SwiftUI

/// A unified disclosure row for nutrient groups that can have varying header layouts (with or without progress bars)
/// and provides a unique z-index for each row based on a provided order.
/// - Parameters:
///   - order: A unique integer (typically the row index) used to calculate the z-index. Lower order values
///            indicate that the row should appear on top.
///   - header: A view builder that supplies the header (for example, an HStack or VStack).
///   - content: A view builder that supplies the expanded content.
struct NutrientDisclosureRow<Header: View, Content: View>: View {
    let order: Int
    @ViewBuilder let header: () -> Header
    @ViewBuilder let content: () -> Content
    @State private var isExpanded: Bool = false

    var body: some View {
        VStack(spacing: 0) {
            // Tapping the header toggles the expansion.
            Button(action: {
                withAnimation {
                    isExpanded.toggle()
                }
            }) {
                HStack {
                    header()
                    Spacer()
                    Image(systemName: "chevron.right")
                        .rotationEffect(.degrees(isExpanded ? 90 : 0))
                        .foregroundColor(.gray)
                        .animation(.easeInOut, value: isExpanded)
                }
                .padding(.vertical, 5)
                .background(Color.white)
            }
            .buttonStyle(PlainButtonStyle())
            
            // When expanded, show the content (for example, the ProductAutoComplete)
            if isExpanded {
                content()
                    .padding(.top, 8)
                    .transition(.opacity)
            }
        }
        .zIndex(computedZIndex)
    }
    
    /// Computes a unique z-index for this row.
    /// We start at 1,000,000 and subtract the provided order.
    /// If the row is expanded, a bonus is added so that its expanded content always floats above collapsed rows.
    private var computedZIndex: Double {
        let baseIndex: Double = 1_000_000
        let expandedBonus: Double = 10_000
        return baseIndex - Double(order) + (isExpanded ? expandedBonus : 0)
    }
}
