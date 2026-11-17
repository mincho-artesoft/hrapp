import SwiftUI

/// The subscription presentation from Reel Screen Recorder, shared by native
/// Mac, iPhone and iPad. Only the plan content belongs to Cloud Calendars.
enum SubscriptionPalette {
    static let cardTop = CalendarSurfaceColors.secondaryGrouped
    static let cardBottom = CalendarSurfaceColors.secondaryGrouped
    static let text = Color.primary
    static let secondaryText = Color.secondary
    static let pro = Color.accentColor
    static let success = Color.green
    static let blue = Color.appBlue
}

struct SubscriptionScreenBackground: View {
    var body: some View { CalendarPalette.groupedBackground }
}

struct SubscriptionPanel<Content: View>: View {
    var tint: Color = SubscriptionPalette.pro
    @ViewBuilder var content: Content
    var body: some View {
        VStack(alignment: .leading, spacing: 14) { content }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(18)
            .background {
                RoundedRectangle(cornerRadius: 22, style: .continuous)
                    .fill(LinearGradient(colors: [SubscriptionPalette.cardTop, SubscriptionPalette.cardBottom],
                                         startPoint: .topLeading, endPoint: .bottomTrailing))
                    .overlay {
                        RoundedRectangle(cornerRadius: 22, style: .continuous)
                            .stroke(LinearGradient(colors: [Color.secondary.opacity(0.12), tint.opacity(0.16), Color.secondary.opacity(0.08)],
                                                   startPoint: .topLeading, endPoint: .bottomTrailing), lineWidth: 1)
                    }
            }

    }
}

struct SubscriptionActionButton: View {
    let title: LocalizedStringKey
    let icon: String
    var tint: Color = SubscriptionPalette.blue
    var prominent = false
    let action: () -> Void
    var body: some View {
        Button(action: action) {
            Label(title, systemImage: icon)
                .font(.system(size: prominent ? 16 : 14, weight: .bold, design: .rounded))
                .multilineTextAlignment(.center)
                .fixedSize(horizontal: false, vertical: true)
                .foregroundStyle(tint)
                .padding(.horizontal, 14).padding(.vertical, 10)
                .frame(maxWidth: .infinity, minHeight: prominent ? 50 : 44)
                .background(Capsule().fill(tint.opacity(0.14)))
                .overlay(Capsule().stroke(tint.opacity(0.42), lineWidth: 1))
                .contentShape(Capsule())
        }
        .buttonStyle(.plain)
        .shadow(color: tint.opacity(0.18), radius: 8)
    }
}

struct SubscriptionFeaturesView: View {
    let category: SubscriptionCategory
    private var features: [String] {
        switch category {
        case .base: return ["Single-day calendar view", "Multi-day calendar view", "Monthly calendar view", "Yearly overview",
                           "List view for events", "Weather view", "Multi-calendar view", "Sync with Google Calendar", "Sync meets from Google Meet"]
        case .advance: return ["All Base Plan features", "Ads Free"]
        case .premium: return ["All Advanced Plan features", "Sync with Microsoft Calendar", "Sync meets from Microsoft Teams"]
        }
    }
    var body: some View {
        SubscriptionPanel {
            Label(LocalizedStringKey(category == .base ? "Base Plan" : category == .advance ? "Advanced Plan" : "Premium Plan"),
                  systemImage: "sparkles")
                .font(.system(size: 17, weight: .bold, design: .rounded))
                .foregroundStyle(SubscriptionPalette.pro)
            ForEach(features, id: \.self) { feature in
                Rectangle().fill(Color.secondary.opacity(0.15)).frame(height: 1)
                Label(LocalizedStringKey(feature), systemImage: "checkmark.circle.fill")
                    .font(.system(size: 15, weight: .medium, design: .rounded))
                    .foregroundStyle(SubscriptionPalette.text)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
    }
}
