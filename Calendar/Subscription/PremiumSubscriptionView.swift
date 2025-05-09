import SwiftUICore

// MARK: - Premium Subscription View
struct PremiumSubscriptionView: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Premium Plan")
                .font(.title.bold())

            VStack(alignment: .leading, spacing: 8) {
                FeatureRow(feature: "All Advance Plan features")
                FeatureRow(feature: "Sync with Microsoft Calendar")
                FeatureRow(feature: "Sync meets from Microsoft Teams")
            }
            .padding(.horizontal)

            Spacer()
        }
        .padding()
    }
}
