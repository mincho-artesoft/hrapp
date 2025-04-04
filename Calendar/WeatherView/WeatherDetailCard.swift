import SwiftUI
import WeatherKit // For Angle

// MARK: - Base Card Styling
struct WeatherDetailCard<Content: View>: View {
    let content: Content

    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }

    var body: some View {
        // The VStack now arranges content vertically, Spacer will push elements apart
        VStack(alignment: .leading, spacing: 5) {
            content // The specific card's content goes here
        }
        // Ensure the VStack fills the card vertically to allow Spacer to work
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .padding(.horizontal, 15)
        .padding(.vertical, 12)
        .background(
            // Use ultraThinMaterial for the frosted glass look consistent with screenshots
           .ultraThinMaterial, in: RoundedRectangle(cornerRadius: 12)
        )
         // Force dark elements assuming the background material is light/translucent
         // Remove or change this if your app supports light mode differently
        .colorScheme(.dark)
    }
}

