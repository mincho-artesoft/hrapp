import Foundation
import EventKit
import UIKit

/// Builds the invocation URL used by the Event Preview App Clip and presents
/// the system share sheet. The URL intentionally contains only the event data
/// needed for a preview; calendar identifiers and notes are never shared.
enum EventAppClipSharing {
    static let appClipBundleIdentifier = "Deksan.CalendarASD.Clip"

    static func invocationURL(for event: EKEvent) -> URL? {
        let title = event.title?.trimmingCharacters(in: .whitespacesAndNewlines) ?? ""
        guard !title.isEmpty,
              let start = event.startDate,
              let end = event.endDate
        else { return nil }

        return invocationURL(
            title: title,
            start: start,
            end: end,
            isAllDay: event.isAllDay,
            timeZone: event.timeZone ?? .current,
            color: event.calendar?.cgColor.map(UIColor.init(cgColor:)) ?? .systemBlue,
            location: event.location
        )
    }

    static func invocationURL(for descriptor: EventDescriptor) -> URL? {
        let event = (descriptor as? EKMultiDayWrapper)?.realEvent
        let start = event?.startDate ?? descriptor.dateInterval.start
        let end = event?.endDate ?? descriptor.dateInterval.end
        let timeZone = event?.timeZone ?? .current

        return invocationURL(
            title: descriptor.text,
            start: start,
            end: end,
            isAllDay: descriptor.isAllDay,
            timeZone: timeZone,
            color: descriptor.color,
            location: event?.location
        )
    }

    private static func invocationURL(
        title: String,
        start: Date,
        end: Date,
        isAllDay: Bool,
        timeZone: TimeZone,
        color: UIColor,
        location: String?
    ) -> URL? {
        let normalizedTitle = title.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !normalizedTitle.isEmpty else { return nil }

        var components = URLComponents()
        components.scheme = "https"
        components.host = "appclip.apple.com"
        components.path = "/id"

        var queryItems = [
            URLQueryItem(name: "p", value: appClipBundleIdentifier),
            URLQueryItem(name: "title", value: limited(normalizedTitle, to: 120)),
            URLQueryItem(name: "start", value: String(start.timeIntervalSince1970)),
            URLQueryItem(name: "end", value: String(end.timeIntervalSince1970)),
            URLQueryItem(name: "allDay", value: isAllDay ? "1" : "0"),
            URLQueryItem(name: "timeZone", value: timeZone.identifier),
            URLQueryItem(name: "color", value: colorHex(color))
        ]

        if let location = location?.trimmingCharacters(in: .whitespacesAndNewlines),
           !location.isEmpty {
            queryItems.append(URLQueryItem(name: "location", value: limited(location, to: 160)))
        }

        components.queryItems = queryItems
        return components.url
    }

    @MainActor
    static func present(for descriptor: EventDescriptor, from sourceView: UIView) {
        guard let url = invocationURL(for: descriptor) else { return }

        let activityController = UIActivityViewController(
            activityItems: [url],
            applicationActivities: nil
        )

        if let popover = activityController.popoverPresentationController {
            popover.sourceView = sourceView
            popover.sourceRect = CGRect(
                x: sourceView.bounds.midX,
                y: sourceView.bounds.midY,
                width: 1,
                height: 1
            )
        }

        guard let presenter = presentingViewController(from: sourceView) else { return }
        presenter.present(activityController, animated: true)
    }

    @MainActor
    static func present(
        for event: EKEvent,
        from presenter: UIViewController,
        sourceBarButtonItem: UIBarButtonItem
    ) {
        guard let url = invocationURL(for: event) else { return }

        let activityController = UIActivityViewController(
            activityItems: [url],
            applicationActivities: nil
        )
        activityController.popoverPresentationController?.barButtonItem = sourceBarButtonItem
        presenter.present(activityController, animated: true)
    }

    private static func limited(_ value: String, to maximumLength: Int) -> String {
        String(value.prefix(maximumLength))
    }

    private static func colorHex(_ color: UIColor) -> String {
        let resolved = color.resolvedColor(with: UITraitCollection(userInterfaceStyle: .dark))
        var red: CGFloat = 0
        var green: CGFloat = 0
        var blue: CGFloat = 0
        guard resolved.getRed(&red, green: &green, blue: &blue, alpha: nil) else {
            return "#0A84FF"
        }
        return String(
            format: "#%02X%02X%02X",
            Int(round(red * 255)),
            Int(round(green * 255)),
            Int(round(blue * 255))
        )
    }

    @MainActor
    private static func presentingViewController(from sourceView: UIView) -> UIViewController? {
        var current = sourceView.window?.rootViewController
        while let presented = current?.presentedViewController {
            current = presented
        }
        return current
    }
}
