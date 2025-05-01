import SwiftUI

// MARK: - Advance Subscription View
struct AdvanceSubscriptionView: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Image(systemName: "calendar.badge.plus")
                .font(.system(size: 50))
                .foregroundColor(.secondary)

            Text("Advance Plan")
                .font(.title.bold())

            VStack(alignment: .leading, spacing: 8) {
                FeatureRow(feature: "All Base Plan features")
                FeatureRow(feature: "Multi-calendar view")
                FeatureRow(feature: "Sync with Google Calendar")
                FeatureRow(feature: "Sync meets from Google Meet")
            }
            .padding(.horizontal)

            Spacer()
        }
        .padding()
    }
}
