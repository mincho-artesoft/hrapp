import SwiftUI

@main
struct CloudCalendarsAppClip: App {
    @State private var payload = SharedEventPayload.example
    @State private var pairing: ClipPairingRequest?
    @State private var bookings: ClipBookingsRequest?

    init() {
        #if DEBUG
        if let rawURL = ProcessInfo.processInfo.environment["_XCAppClipURL"],
           let url = URL(string: rawURL) {
            if let request = ClipBookingPairing.request(from: url) {
                _pairing = State(initialValue: request)
            } else if let request = ClipMyBookings.request(from: url) {
                _bookings = State(initialValue: request)
            } else {
                AppClipEventHandoffStore.save(url)
                _payload = State(initialValue: SharedEventPayload(url: url))
            }
        }
        #endif
    }

    var body: some Scene {
        WindowGroup {
            Group {
                if let bookings {
                    MyBookingsClipView(request: bookings)
                } else if let pairing {
                    ClipBookingPairingView(request: pairing)
                } else {
                    EventClipPreviewView(payload: payload)
                }
            }
            .onContinueUserActivity(NSUserActivityTypeBrowsingWeb) { activity in
                guard let url = activity.webpageURL else { return }
                route(url)
            }
            .onOpenURL { url in
                route(url)
            }
        }
    }

    /// The three invocation shapes — pairing, "my bookings", and a shared event —
    /// are mutually exclusive, so first match wins.
    private func route(_ url: URL) {
        if let request = ClipBookingPairing.request(from: url) {
            pairing = request
            return
        }
        if let request = ClipMyBookings.request(from: url) {
            bookings = request
            return
        }
        AppClipEventHandoffStore.save(url)
        payload = SharedEventPayload(url: url)
    }
}
