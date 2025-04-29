
import SwiftUICore


// Shared helper за булет-списък
struct FeatureRow: View {
    let feature: String
    var body: some View {
        HStack(alignment: .top, spacing: 8) {
            Image(systemName: "checkmark.circle.fill")
                .foregroundColor(.accentColor)
            Text(feature)
                .font(.subheadline)
                .foregroundColor(.primary)
                .fixedSize(horizontal: false, vertical: true)
        }
    }
}

// MARK: - Base Subscription View
struct BaseSubscriptionView: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Image(systemName: "gift")
                .font(.system(size: 50))
                .foregroundColor(.secondary)

            Text("Base Plan")
                .font(.title.bold())

            VStack(alignment: .leading, spacing: 8) {
                FeatureRow(feature: "Single-day calendar view")
                FeatureRow(feature: "Multi-day calendar view")
                FeatureRow(feature: "Monthly calendar view")
                FeatureRow(feature: "Yearly overview")
                FeatureRow(feature: "List view for events")
                FeatureRow(feature: "Weather view")
            }
            .padding(.horizontal)

            Spacer()
        }
        .padding()
    }
}

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

// MARK: - Premium Subscription View
struct PremiumSubscriptionView: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Image(systemName: "star.circle.fill")
                .font(.system(size: 50))
                .foregroundColor(.secondary)

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
