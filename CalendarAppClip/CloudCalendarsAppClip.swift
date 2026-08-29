import SwiftUI

@main
struct CloudCalendarsAppClip: App {
    @State private var payload = SharedEventPayload.example
    @State private var pairing: ClipPairingRequest?

    init() {
        #if DEBUG
        if let rawURL = ProcessInfo.processInfo.environment["_XCAppClipURL"],
           let url = URL(string: rawURL) {
            if let request = ClipBookingPairing.request(from: url) {
                _pairing = State(initialValue: request)
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
                if let pairing {
                    ClipBookingPairingView(request: pairing)
                } else {
                    EventClipPreviewView(payload: payload)
                }
            }
            .onContinueUserActivity(NSUserActivityTypeBrowsingWeb) { activity in
                guard let url = activity.webpageURL else { return }
                // A pairing link is checked first; the two URL shapes never overlap.
                if let request = ClipBookingPairing.request(from: url) {
                    pairing = request
                    return
                }
                AppClipEventHandoffStore.save(url)
                payload = SharedEventPayload(url: url)
            }
            .onOpenURL { url in
                if let request = ClipBookingPairing.request(from: url) {
                    pairing = request
                    return
                }
                AppClipEventHandoffStore.save(url)
                payload = SharedEventPayload(url: url)
            }
        }
    }
}
