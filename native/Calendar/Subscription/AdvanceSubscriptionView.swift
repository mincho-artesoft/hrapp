import SwiftUI

// MARK: - Advance Subscription View
struct AdvanceSubscriptionView: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text(LocalizedStringKey("Advanced Plan"))
                .font(.title.bold())

            VStack(alignment: .leading, spacing: 8) {
                FeatureRow(feature: "All Base Plan features")
                FeatureRow(feature: "Ads Free")
            }

            Spacer()
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding()
    }
}
