import SwiftUI

@main
struct CloudCalendarsAppClip: App {
    @State private var payload = SharedEventPayload.example

    init() {
        #if DEBUG
        if let rawURL = ProcessInfo.processInfo.environment["_XCAppClipURL"],
           let url = URL(string: rawURL) {
            AppClipEventHandoffStore.save(url)
            _payload = State(initialValue: SharedEventPayload(url: url))
        }
        #endif
    }

    var body: some Scene {
        WindowGroup {
            EventClipPreviewView(payload: payload)
                .onContinueUserActivity(NSUserActivityTypeBrowsingWeb) { activity in
                    guard let url = activity.webpageURL else { return }
                    AppClipEventHandoffStore.save(url)
                    payload = SharedEventPayload(url: url)
                }
                .onOpenURL { url in
                    AppClipEventHandoffStore.save(url)
                    payload = SharedEventPayload(url: url)
                }
        }
    }
}
