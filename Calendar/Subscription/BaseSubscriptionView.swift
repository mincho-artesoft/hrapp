
import SwiftUI

struct BaseSubscriptionView: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Base Plan")
                .font(.title.bold())

            VStack(alignment: .leading, spacing: 8) {
                FeatureRow(feature: "Single-day calendar view")
                FeatureRow(feature: "Multi-day calendar view")
                FeatureRow(feature: "Monthly calendar view")
                FeatureRow(feature: "Yearly overview")
                FeatureRow(feature: "List view for events")
                FeatureRow(feature: "Weather view")
                FeatureRow(feature: "Multi-calendar view")
                if AppConfig.googleSyncEnabled {
                    FeatureRow(feature: "Sync with Google Calendar")
                    FeatureRow(feature: "Sync meets from Google Meet")
                }
            }

            Spacer()
        }
        .frame(maxWidth: .infinity, alignment: .leading)   // <- ново
        .padding()                                         // единствен хор. отстъп
    }
}
