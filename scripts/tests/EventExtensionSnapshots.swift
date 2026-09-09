import SwiftUI
import UIKit
import WebKit

@main struct EventExtensionSnapshots: App {
    var body: some Scene {
        WindowGroup {
            if ProcessInfo.processInfo.environment["FULL_SCREEN_APP_CLIP"] == "1" {
                EventClipPreviewView(payload: .example)
            } else if let template = ProcessInfo.processInfo.environment["FULL_SCREEN_TEMPLATE"] {
                NavigationStack {
                    FullScreenTemplateWebView(template: template)
                        .navigationTitle(template.hasPrefix("email-") ? "Email template preview" : "Shared link preview")
                        .navigationBarTitleDisplayMode(.inline)
                }
            } else {
                Text("Extension component snapshots").task { await render() }
            }
        }
    }
    @MainActor private func render() async {
        let start = Date(timeIntervalSince1970: 1788953400)
        let end = start.addingTimeInterval(5400)
        let settings = CalendarLiveActivitySettingsSnapshot(region: "US", calendarIdentifier: "gregorian",
            firstWeekday: 1, dateFormat: "M/d/yy", timeFormat: "h:mm a", numberFormat: "1,234,567.89")
        let liveEvent = CalendarLiveActivityEvent(id: "fixture", title: "Product Launch Planning",
            startDate: start, endDate: end, isAllDay: false, location: "Apple Park Visitor Center, Cupertino",
            videoCallPlatform: "Microsoft Teams", colorRed: 10/255, colorGreen: 132/255, colorBlue: 1, colorAlpha: 1)
        let payload = SharedEventPayload(title: liveEvent.title, start: start, end: end,
            isAllDay: false, location: liveEvent.location, timeZone: .current, eventColorHex: "#0A84FF")
        let titles = ["Product Launch Planning", "Design Review", "Lunch with Alex", "Local Project Review",
            "Two-Day Conference", "Client Call", "Release Check", "Team Retrospective", "Planning Workshop"]
        let colors: [(Double,Double,Double)] = [(10/255,132/255,1),(1,149/255,0),(52/255,199/255,89/255),(175/255,82/255,222/255)]
        let events = titles.enumerated().map { index, title in
            let c = colors[index % colors.count]
            return CalendarWidgetUpcomingEvent(id: "\(index)", title: title,
                startDate: start.addingTimeInterval(Double(index) * 5400),
                endDate: start.addingTimeInterval(Double(index) * 5400 + (index == 4 ? 172800 : index == 0 ? 5400 : 3600)),
                isAllDay: index == 8, colorRed: c.0, colorGreen: c.1, colorBlue: c.2, colorAlpha: 1)
        }
        let entry = CalendarIconEntry(date: Date(), weather: CalendarIconEntry.preview.weather,
            settings: CalendarIconEntry.preview.settings, events: events)
        for theme in [ColorScheme.light, .dark] {
            await EventSurfaceSnapshotSupport.saveHosted("app-clip", theme: theme, height: 680,
                view: EventClipPreviewView(payload: payload))
            EventSurfaceSnapshotSupport.save("live-activity", theme: theme,
                view: CalendarLiveActivityContentView(state: .init(updatedAt: Date(), events: [liveEvent]), settings: settings))
            EventSurfaceSnapshotSupport.save("dynamic-island-expanded-card", theme: theme, width: 365,
                view: CalendarLiveActivityEventCardView(event: liveEvent, settings: settings).padding(12))
            let widget = CalendarIconWidgetView(entry: entry)
            EventSurfaceSnapshotSupport.save("widget-medium", theme: theme, width: 364, height: 170,
                view: widget.mediumClassicBody.minimumScaleFactor(0.4).allowsTightening(true).background(widget.widgetBackground))
            EventSurfaceSnapshotSupport.save("widget-large", theme: theme, width: 364, height: 382,
                view: widget.largeEventsBody.minimumScaleFactor(0.4).allowsTightening(true).background(widget.widgetBackground))
        }
        let htmlDirectory = Bundle.main.bundleURL.appendingPathComponent("html")
        if let files = try? FileManager.default.contentsOfDirectory(at: htmlDirectory, includingPropertiesForKeys: nil) {
            for url in files.filter({ $0.pathExtension == "html" }).sorted(by: { $0.path < $1.path }) {
                for theme in [ColorScheme.light, .dark] {
                    await EventSurfaceSnapshotSupport.saveHTML(url, theme: theme)
                }
            }
        }
        EventSurfaceSnapshotSupport.finish()
    }
}

private struct FullScreenTemplateWebView: UIViewRepresentable {
    let template: String
    func makeCoordinator() -> Coordinator {
        Coordinator(captureID: ProcessInfo.processInfo.environment["FULL_SCREEN_CAPTURE_ID"] ?? template)
    }
    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        configuration.defaultWebpagePreferences.allowsContentJavaScript = false
        let web = WKWebView(frame: .zero, configuration: configuration)
        web.navigationDelegate = context.coordinator
        let directory = Bundle.main.bundleURL.appendingPathComponent("html")
        web.loadFileURL(directory.appendingPathComponent(template + ".html"), allowingReadAccessTo: directory)
        return web
    }
    func updateUIView(_ uiView: WKWebView, context: Context) {}
    final class Coordinator: NSObject, WKNavigationDelegate {
        let captureID: String
        init(captureID: String) { self.captureID = captureID }
        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            try? Data(captureID.utf8).write(to: URL.documentsDirectory.appendingPathComponent("full-screen-ready.txt"), options: .atomic)
        }
    }
}
