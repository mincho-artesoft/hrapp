import SwiftUI

/// A pending request — arriving by universal link, or handed off from the App
/// Clip after an install — to authorise a web browser to create a booking page
/// under this device's calendar.
///
/// The owner sets availability at cloud-calendars.com/book/setup; that page
/// shows a QR encoding `…/pair?code=<code>`. Scanning it on a phone that has the
/// app opens the app straight here, so "I have the app" costs one tap and no
/// sign-in — the device already holds the calendar's token.
struct BookingPairingRequest: Identifiable {
    let code: String
    var id: String { code }
}

enum BookingPairing {
    /// Shared with the App Clip through the app group: the clip stashes a scanned
    /// code here so that, once someone installs from the clip, the full app can
    /// finish the approval it could not do itself.
    static let appGroup = "group.ARTE-SOFT.sandBOX"
    static let pendingCodeKey = "booking.pairing.pendingCode"
    static let storedAtKey = "booking.pairing.storedAt"
    /// A stashed code is only worth completing while the browser is still waiting
    /// on it; the server code expires in minutes, so an hour is generous.
    private static let handoffTTL: TimeInterval = 60 * 60

    /// Recognises a pairing universal link — `https://…cloud-calendars.com/pair?code=…`
    /// — and pulls the code out. Returns nil for anything else, so an event-share
    /// link falls through to its own handler untouched. The path is matched
    /// exactly so ordinary links into the marketing site never route into the app.
    static func request(from url: URL) -> BookingPairingRequest? {
        guard let comps = URLComponents(url: url, resolvingAgainstBaseURL: false),
              (comps.host ?? "").contains("cloud-calendars.com"),
              comps.path == "/pair" || comps.path.hasPrefix("/pair/"),
              let code = comps.queryItems?.first(where: { $0.name == "code" })?.value,
              !code.isEmpty
        else { return nil }
        return BookingPairingRequest(code: code)
    }

    /// Takes any code the App Clip left behind, clearing it so a stale one never
    /// re-fires. Returns nil once past its short shelf life.
    static func takeHandoff() -> BookingPairingRequest? {
        guard let defaults = UserDefaults(suiteName: appGroup),
              let code = defaults.string(forKey: pendingCodeKey), !code.isEmpty
        else { return nil }

        let storedAt = defaults.double(forKey: storedAtKey)
        defaults.removeObject(forKey: pendingCodeKey)
        defaults.removeObject(forKey: storedAtKey)

        guard storedAt > 0, Date().timeIntervalSince1970 - storedAt < handoffTTL else { return nil }
        return BookingPairingRequest(code: code)
    }
}

/// Confirmation sheet for a pairing request. Deliberately a tap, not automatic:
/// approving links a browser to the person's calendar, so it should be a thing
/// they chose, not something a scanned link did on its own.
struct BookingPairingView: View {
    let request: BookingPairingRequest
    @Environment(\.dismiss) private var dismiss

    private enum Phase: Equatable {
        case confirm, working, done, failed(String)
    }
    @State private var phase: Phase = .confirm

    var body: some View {
        VStack(spacing: 18) {
            Spacer(minLength: 8)

            Image(systemName: symbol)
                .font(.system(size: 52, weight: .semibold))
                .foregroundStyle(tint)
                .symbolRenderingMode(.hierarchical)

            Text(title)
                .font(.title2.bold())
                .multilineTextAlignment(.center)

            Text(subtitle)
                .font(.callout)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
                .fixedSize(horizontal: false, vertical: true)

            Spacer()

            actions
        }
        .padding(28)
        .presentationDetents([.medium])
        .interactiveDismissDisabled(phase == .working)
    }

    @ViewBuilder
    private var actions: some View {
        switch phase {
        case .confirm:
            Button {
                Task { await approve() }
            } label: {
                Text("Approve on this device").frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .controlSize(.large)

            Button("Not now") { dismiss() }
                .padding(.top, 2)

        case .working:
            ProgressView().controlSize(.large)

        case .done:
            Button {
                dismiss()
            } label: {
                Text("Done").frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .controlSize(.large)

        case .failed(let message):
            Text(message)
                .font(.footnote)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
            Button {
                Task { await approve() }
            } label: {
                Text("Try again").frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .controlSize(.large)
            Button("Close") { dismiss() }
        }
    }

    private func approve() async {
        phase = .working
        do {
            let session = try await CalendarFeedSession.current()
            try await CloudCalendarsAPI.pairApprove(code: request.code, session: session)
            phase = .done
        } catch {
            phase = .failed(error.localizedDescription)
        }
    }

    private var symbol: String {
        switch phase {
        case .confirm, .working: return "qrcode.viewfinder"
        case .done: return "checkmark.circle.fill"
        case .failed: return "exclamationmark.triangle.fill"
        }
    }

    private var tint: Color {
        switch phase {
        case .done: return .green
        case .failed: return .orange
        default: return .accentColor
        }
    }

    private var title: String {
        switch phase {
        case .confirm, .working: return "Set up web booking"
        case .done: return "You're all set"
        case .failed: return "Couldn't approve"
        }
    }

    private var subtitle: String {
        switch phase {
        case .confirm:
            return "Approve linking this browser to your calendar so you can create a booking page on the web — free, because you have the app."
        case .working:
            return "Linking…"
        case .done:
            return "Head back to your browser — it's ready to finish setting up your booking page."
        case .failed:
            return "The code may have expired. Reopen the QR on the web and try again."
        }
    }
}
