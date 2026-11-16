import SwiftUI

@main
struct CloudCalendarsAppClip: App {
    @State private var payload = SharedEventPayload.example
    @State private var unavailableLink = false
    @State private var sharedCalendar: ClipSharedCalendar?

    init() {
        #if DEBUG
        if let rawURL = ProcessInfo.processInfo.environment["_XCAppClipURL"],
           let url = URL(string: rawURL) {
            if Self.isRetiredLink(url) {
                _unavailableLink = State(initialValue: true)
            } else if let calendar = ClipSharedCalendar(url: url) {
                _sharedCalendar = State(initialValue: calendar)
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
                if unavailableLink {
                    ContentUnavailableView("Link unavailable", systemImage: "link.badge.plus",
                        description: Text("This link is no longer available."))
                } else if let sharedCalendar {
                    CalendarClipPreviewView(calendar: sharedCalendar)
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

    /// The invocation shapes — shared calendar and shared event —
    /// are mutually exclusive, so first match wins.
    private func route(_ url: URL) {
        unavailableLink = Self.isRetiredLink(url)
        guard !unavailableLink else { return }
        sharedCalendar = nil
        if let calendar = ClipSharedCalendar(url: url) {
            sharedCalendar = calendar
            return
        }
        AppClipEventHandoffStore.save(url)
        payload = SharedEventPayload(url: url)
    }

    /// Old portal links must not fall through to a made-up sample event.
    private static func isRetiredLink(_ url: URL) -> Bool {
        let path = url.path.trimmingCharacters(in: CharacterSet(charactersIn: "/"))
        let segments = path.split(separator: "/")
        return segments.contains { ["book", "booking", "bookings", "pair"].contains(String($0)) }
    }
}
