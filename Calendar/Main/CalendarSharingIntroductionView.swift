import SwiftUI

struct CalendarSharingIntroductionView: View {
    let onContinue: () -> Void

    var body: some View {
        ScrollView {
            VStack(spacing: 28) {
                VStack(spacing: 18) {
                    Image("AppHeaderIcon")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 88, height: 88)
                        .accessibilityHidden(true)

                    Text(copy("title", "Local calendars & sharing"))
                        .font(.largeTitle.bold())
                        .multilineTextAlignment(.center)
                        .fixedSize(horizontal: false, vertical: true)
                        .accessibilityAddTraits(.isHeader)
                }

                VStack(alignment: .leading, spacing: 24) {
                    feature(
                        icon: "calendar.badge.plus", color: .blue,
                        title: copy("local.title", "Local calendars"),
                        message: copy("local.body", "Create calendars directly in Cloud Calendars, without connecting iCloud, Google or Microsoft.")
                    )
                    feature(
                        icon: "person.2.fill", color: .purple,
                        title: copy("sharing.title", "Share events & calendars"),
                        message: copy("sharing.body", "Share individual events or whole calendars, including your local and iCloud calendars.")
                    )
                    feature(
                        icon: "checkmark.shield", color: .green,
                        title: copy("access.title", "Choose access"),
                        message: copy("access.body", "Choose who can view, edit or manage what you share.")
                    )
                }

                Text(copy("account", "To share, sign in to a Cloud Calendars account with Apple, Google or Microsoft."))
                    .font(.footnote)
                    .foregroundStyle(.secondary)
                    .multilineTextAlignment(.center)
                    .fixedSize(horizontal: false, vertical: true)
            }
            .padding(24)
            .padding(.top, 16)
            .frame(maxWidth: 560)
            .frame(maxWidth: .infinity)
        }
        .background(Color(uiColor: .systemBackground))
        .safeAreaInset(edge: .bottom, spacing: 0) {
            Button(action: onContinue) {
                Text(copy("continue", "Got it"))
                    .font(.headline)
                    .frame(maxWidth: .infinity, minHeight: 36)
            }
            .buttonStyle(.borderedProminent)
            .controlSize(.large)
            .accessibilityIdentifier("calendarSharingIntroduction.continue")
            .padding(.horizontal, 24)
            .padding(.vertical, 16)
            .frame(maxWidth: 560)
            .frame(maxWidth: .infinity)
            .background(.regularMaterial)
        }
        .accessibilityIdentifier("calendarSharingIntroduction")
    }

    private func feature(icon: String, color: Color, title: String, message: String) -> some View {
        HStack(alignment: .top, spacing: 16) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundStyle(color)
                .frame(width: 32, height: 32)
                .accessibilityHidden(true)
            VStack(alignment: .leading, spacing: 6) {
                Text(title).font(.headline)
                Text(message).font(.body).foregroundStyle(.secondary)
            }
            .fixedSize(horizontal: false, vertical: true)
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .accessibilityElement(children: .combine)
    }

    private func copy(_ key: String, _ fallback: String) -> String {
        NSLocalizedString(key, tableName: "CalendarSharingIntroduction", value: fallback, comment: "One-time local calendar and sharing introduction")
    }
}
