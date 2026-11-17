#if os(macOS)
import SwiftUI

struct MacCalendarProviderConnections: View {
    @ObservedObject var providers: MacCalendarProviderStore
    @ObservedObject private var authentication = CloudAccountManager.calendarConnections
    var body: some View {
        VStack(spacing: 8) {
            providerButton("Sign in with Google", provider: "google", icon: .google)
            providerButton("Sign in with Microsoft", provider: "microsoft", icon: .microsoft)
            if authentication.isSigningIn {
                HStack {
                    ProgressView().controlSize(.small)
                    Text("Signing in…").foregroundStyle(.secondary)
                    Spacer()
                    if authentication.canOpenBrowserSignIn {
                        Button("Open Sign-In in Browser", action: authentication.openBrowserSignIn)
                    }
                    Button("Cancel", action: authentication.cancelSignIn)
                }.padding(16)
            }
            if let error = providers.error { Text(error).font(CalendarTypography.footnote).foregroundStyle(.red).padding(12) }
        }
        .background(CloudAccountWindowReader(onWindow: authentication.updatePresentationWindow))
    }
    private func providerButton(_ title: LocalizedStringKey, provider: String, icon: CalendarProviderActionLabel.Icon) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Button { providers.connect(provider) } label: {
                CalendarProviderActionLabel(title: title, icon: icon).padding(.horizontal, 16).padding(.vertical, 8)
            }.buttonStyle(.plain).disabled(authentication.isSigningIn)
                .background(CalendarPalette.secondaryGroupedBackground, in: RoundedRectangle(cornerRadius: 20))
            if let error = authentication.errorMessage(for: provider) {
                Text(error).font(CalendarTypography.footnote).foregroundStyle(.red).padding(.horizontal, 16)
            }
        }
    }
}
#endif
