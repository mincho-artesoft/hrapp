import SwiftUI

/// A booking-pairing invocation that reached the App Clip — i.e. someone without
/// the full app scanned a "set up booking" QR. The clip cannot approve on its
/// own (that needs the owner's calendar token, which lives in the full app), so
/// its job is to stash the code and send them to install, after which the full
/// app finishes the approval.
struct ClipPairingRequest: Identifiable {
    let code: String
    var id: String { code }
}

enum ClipBookingPairing {
    static let appGroup = "group.ARTE-SOFT.sandBOX"
    static let pendingCodeKey = "booking.pairing.pendingCode"
    static let storedAtKey = "booking.pairing.storedAt"

    /// Recognises `https://…cloud-calendars.com/pair?code=…`. Matches the full
    /// app's parser exactly so both targets agree on what a pairing link is.
    static func request(from url: URL) -> ClipPairingRequest? {
        guard let comps = URLComponents(url: url, resolvingAgainstBaseURL: false),
              (comps.host ?? "").contains("cloud-calendars.com"),
              comps.path == "/pair" || comps.path.hasPrefix("/pair/"),
              let code = comps.queryItems?.first(where: { $0.name == "code" })?.value,
              !code.isEmpty
        else { return nil }
        return ClipPairingRequest(code: code)
    }

    /// Hands the code to the full app through the shared app group. Stored as a
    /// Unix timestamp so `BookingPairing.takeHandoff()` in the app reads it back
    /// with `double(forKey:)`.
    static func stash(_ code: String) {
        guard let defaults = UserDefaults(suiteName: appGroup) else { return }
        defaults.set(code, forKey: pendingCodeKey)
        defaults.set(Date().timeIntervalSince1970, forKey: storedAtKey)
    }
}

/// What a non-app owner sees when they scan a pairing QR: a nudge to install,
/// with the code saved so the full app resumes the setup automatically.
struct ClipBookingPairingView: View {
    let request: ClipPairingRequest

    // Same listing the event-preview clip links to.
    private let appStoreURL = URL(string: "https://apps.apple.com/app/id6744690319")!

    var body: some View {
        VStack(spacing: 18) {
            Spacer()

            Image(systemName: "calendar.badge.plus")
                .font(.system(size: 56, weight: .semibold))
                .foregroundStyle(.tint)
                .symbolRenderingMode(.hierarchical)

            Text("Set up your booking page")
                .font(.title2.bold())
                .multilineTextAlignment(.center)

            Text("Get Cloud Calendars to finish — set your hours, share one link, and every booking lands on your calendar. We've saved your setup code, so it picks up right where you left off.")
                .font(.callout)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
                .fixedSize(horizontal: false, vertical: true)

            Spacer()

            Link(destination: appStoreURL) {
                Text("Get Cloud Calendars").frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .controlSize(.large)
        }
        .padding(28)
        .onAppear { ClipBookingPairing.stash(request.code) }
    }
}
