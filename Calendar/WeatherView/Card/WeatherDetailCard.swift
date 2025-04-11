import SwiftUI
import WeatherKit // For Angle (Though not directly used now, Angle struct comes from Foundation/SwiftUI itself)

// MARK: - Base Card Styling (No Changes)
struct WeatherDetailCard<Content: View>: View {
    let content: Content

    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 5) { // Default spacing for inner card content if needed
            content
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .padding(.horizontal, 15)
        .padding(.vertical, 12)
        .background(
           .ultraThinMaterial, in: RoundedRectangle(cornerRadius: 12)
        )
        .colorScheme(.dark) // Force dark elements for contrast on light material
    }
}

