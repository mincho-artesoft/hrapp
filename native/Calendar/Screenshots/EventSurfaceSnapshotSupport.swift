#if DEBUG
import SwiftUI
import UIKit
import WebKit

/// Opt-in visual test runner. It renders real views, without saving events,
/// changing preferences, requesting permissions or contacting services.
@MainActor
enum EventSurfaceSnapshotSupport {
    static var requested: Bool { ProcessInfo.processInfo.environment["EVENT_SURFACE_SNAPSHOTS"] == "1" }
    static let directory = URL.documentsDirectory.appendingPathComponent("EventSurfaceSnapshots")
    static func save<V: View>(_ name: String, theme: ColorScheme, width: CGFloat = 393, height: CGFloat? = nil, view: V) {
        // ImageRenderer has no hosting window from which to inherit the app's
        // layout direction. Preserve the actual simulator direction explicitly.
        let direction: LayoutDirection = UIApplication.shared.userInterfaceLayoutDirection == .rightToLeft ? .rightToLeft : .leftToRight
        let content = view.environment(\.colorScheme, theme)
            .environment(\.layoutDirection, direction)
            .frame(width: width, height: height)
            .background(Color(uiColor: theme == .dark ? .black : .systemGroupedBackground))
        let renderer = ImageRenderer(content: content)
        renderer.scale = 3
        renderer.isOpaque = true
        renderer.proposedSize = ProposedViewSize(width: width, height: height)
        do {
            try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
            guard let data = renderer.uiImage?.pngData() else { fatalError("No rendered image: \(name)") }
            try data.write(to: directory.appendingPathComponent("\(name)-\(theme == .dark ? "dark" : "light").png"))
        } catch { fatalError("Snapshot \(name): \(error)") }
    }
    static func finish() {
        try? Data("PASS".utf8).write(to: directory.appendingPathComponent("complete.txt"))
    }
    static func saveHosted<V: View>(_ name: String, theme: ColorScheme, width: CGFloat = 393, height: CGFloat = 680, view: V) async {
        let previous = UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }.flatMap(\.windows).first { $0.isKeyWindow }
        let scene = UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }.first!
        let window = UIWindow(windowScene: scene)
        window.frame = CGRect(x: 0, y: 0, width: width, height: height)
        let controller = UIHostingController(rootView: view.environment(\.colorScheme, theme))
        controller.overrideUserInterfaceStyle = theme == .dark ? .dark : .light
        window.rootViewController = controller
        window.makeKeyAndVisible()
        controller.view.frame = window.bounds
        controller.view.setNeedsLayout()
        controller.view.layoutIfNeeded()
        try? await Task.sleep(for: .milliseconds(500))
        let renderer = UIGraphicsImageRenderer(size: CGSize(width: width, height: height))
        let data = renderer.pngData { _ in controller.view.drawHierarchy(in: window.bounds, afterScreenUpdates: true) }
        try? FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
        try? data.write(to: directory.appendingPathComponent("\(name)-\(theme == .dark ? "dark" : "light").png"))
        window.isHidden = true
        previous?.makeKeyAndVisible()
    }

    static func saveHTML(_ url: URL, theme: ColorScheme) async {
        let config = WKWebViewConfiguration()
        config.defaultWebpagePreferences.allowsContentJavaScript = false
        let web = WKWebView(frame: CGRect(x: 0, y: 0, width: 393, height: 1200), configuration: config)
        web.overrideUserInterfaceStyle = theme == .dark ? .dark : .light
        let delegate = SnapshotWebDelegate()
        web.navigationDelegate = delegate
        let scene = UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }.first!
        let previous = scene.windows.first { $0.isKeyWindow }
        let window = UIWindow(windowScene: scene)
        let controller = UIViewController()
        controller.view = web
        window.frame = web.frame
        window.rootViewController = controller
        window.makeKeyAndVisible()
        await withCheckedContinuation { continuation in
            delegate.completion = { continuation.resume() }
            web.loadFileURL(url, allowingReadAccessTo: url.deletingLastPathComponent())
        }
        try? await Task.sleep(for: .milliseconds(300))
        web.frame.size = CGSize(width: 393, height: min(1600, max(700, web.scrollView.contentSize.height)))
        let image = try? await web.takeSnapshot(configuration: nil)
        let name = url.deletingPathExtension().lastPathComponent
        try? image?.pngData()?.write(to: directory.appendingPathComponent("\(name)-\(theme == .dark ? "dark" : "light").png"))
        window.isHidden = true
        previous?.makeKeyAndVisible()
    }
}

@MainActor private final class SnapshotWebDelegate: NSObject, WKNavigationDelegate {
    var completion: (() -> Void)?
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) { completion?(); completion = nil }
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) { fatalError("Snapshot HTML failed: \(error)") }
}
#endif
