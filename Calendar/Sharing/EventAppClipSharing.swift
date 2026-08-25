import Foundation
import EventKit
import SwiftUI
import UIKit

enum EventSharePromptSettings {
    static let userDefaultsKey = "eventSharePromptEnabled"

    static var isEnabled: Bool {
        let defaults = UserDefaults.standard
        guard defaults.object(forKey: userDefaultsKey) != nil else { return true }
        return defaults.bool(forKey: userDefaultsKey)
    }

    static func setEnabled(_ isEnabled: Bool) {
        UserDefaults.standard.set(isEnabled, forKey: userDefaultsKey)
    }
}

@MainActor
final class EventSharePromptManager: ObservableObject {
    static let shared = EventSharePromptManager()
    static let displayDuration: TimeInterval = 10

    @Published private(set) var event: EKEvent?
    @Published private(set) var dismissalDeadline: Date?
    private var dismissalWorkItem: DispatchWorkItem?

    private init() {}

    func show(for event: EKEvent) {
        guard EventSharePromptSettings.isEnabled,
              EventAppClipSharing.invocationURL(for: event) != nil
        else { return }

        dismissalWorkItem?.cancel()
        dismissalDeadline = Date().addingTimeInterval(Self.displayDuration)
        self.event = event

        let workItem = DispatchWorkItem { [weak self] in
            Task { @MainActor in
                self?.dismiss()
            }
        }
        dismissalWorkItem = workItem
        DispatchQueue.main.asyncAfter(
            deadline: .now() + Self.displayDuration,
            execute: workItem
        )
    }

    func dismiss() {
        dismissalWorkItem?.cancel()
        dismissalWorkItem = nil
        dismissalDeadline = nil
        event = nil
    }

    func remainingFraction(at date: Date) -> Double {
        guard let dismissalDeadline else { return 0 }
        return min(
            1,
            max(0, dismissalDeadline.timeIntervalSince(date) / Self.displayDuration)
        )
    }

    func disableAndDismiss() {
        EventSharePromptSettings.setEnabled(false)
        dismiss()
    }

    func share() {
        guard let event else { return }
        dismiss()

        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            EventAppClipSharing.present(for: event)
        }
    }
}

struct EventSharePromptView: View {
    @ObservedObject var manager: EventSharePromptManager

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            TimelineView(.animation(minimumInterval: 1.0 / 30.0)) { context in
                ProgressView(value: manager.remainingFraction(at: context.date))
                    .progressViewStyle(.linear)
                    .tint(.blue)
            }
            .accessibilityHidden(true)

            HStack(spacing: 10) {
                Image(systemName: "square.and.arrow.up")
                    .font(.headline)
                    .foregroundStyle(.blue)

                Text(LocalizedStringKey("Would you like to share this event?"))
                    .font(.headline)
                    .fixedSize(horizontal: false, vertical: true)
            }

            HStack(spacing: 10) {
                Button {
                    manager.disableAndDismiss()
                } label: {
                    Text(LocalizedStringKey("Don't ask again"))
                        .font(.subheadline.weight(.semibold))
                        .frame(maxWidth: .infinity)
                        .frame(maxHeight: .infinity)
                        .lineLimit(2)
                        .minimumScaleFactor(0.72)
                }
                .frame(maxWidth: .infinity)
                .frame(height: 48)
                .background(Color.white.opacity(0.72), in: Capsule())
                .buttonStyle(.plain)

                Button {
                    manager.share()
                } label: {
                    Label(LocalizedStringKey("Share"), systemImage: "square.and.arrow.up")
                        .font(.subheadline.weight(.semibold))
                        .frame(maxWidth: .infinity)
                        .frame(maxHeight: .infinity)
                        .lineLimit(2)
                        .minimumScaleFactor(0.72)
                }
                .frame(maxWidth: .infinity)
                .frame(height: 48)
                .foregroundStyle(.white)
                .background(Color.blue, in: Capsule())
                .buttonStyle(.plain)
            }
        }
        .padding(16)
        .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 20, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: 20, style: .continuous)
                .stroke(Color.white.opacity(0.16), lineWidth: 1)
        }
        .shadow(color: .black.opacity(0.25), radius: 18, y: 8)
        .accessibilityElement(children: .contain)
    }
}

/// Where invite links point.
///
/// Today this is Apple's default App Clip host, which needs no domain setup but
/// only resolves on iOS. Flip `usesAppleHost` to `false` once the web landing
/// page is live on cloud-calendars.com (AASA + assetlinks.json) and Android and
/// desktop recipients get a real page instead of nothing.
///
/// The query-parameter names are deliberately identical on both hosts, so
/// `SharedEventPayload` needs no change when this flips - only the host, the
/// path, and the Apple-specific `p` parameter differ.
enum EventShareEndpoint {
    static let usesAppleHost = true

    static var appClipBundleIdentifier: String { EventAppClipSharing.appClipBundleIdentifier }

    private static let appleHost = "appclip.apple.com"
    private static let applePath = "/id"
    private static let webHost   = "cloud-calendars.com"
    private static let webPath   = "/i"

    static var host: String { usesAppleHost ? appleHost : webHost }
    static var path: String { usesAppleHost ? applePath : webPath }

    /// Apple routes to the clip through `p`; our own host will not need it.
    static var routingQueryItems: [URLQueryItem] {
        usesAppleHost
            ? [URLQueryItem(name: "p", value: appClipBundleIdentifier)]
            : []
    }

    /// The subscribable personal-calendar feed for a given feed identifier.
    static func feedURL(for feedID: String) -> URL? {
        URL(string: "webcal://cal.cloud-calendars.com/f/\(feedID).ics")
    }
}

/// Stable identifiers that let a shared event be updated later instead of
/// duplicated.
///
/// `feedID` names this user's personal calendar feed. It is generated once on
/// first share and then never changes, because every invite this user sends
/// flows into that one subscribable feed.
///
/// `shareID(for:)` returns a stable identifier for a given event, so resharing
/// the same event yields the same id. That is what lets a later update or
/// cancellation replace the original entry rather than create a second one -
/// the id becomes the `UID` in the generated `.ics`.
enum EventShareIdentity {
    private static let appGroupIdentifier = "group.ARTE-SOFT.sandBOX"
    private static let feedIDKey = "eventShare.feedID"
    private static let shareIDMapKey = "eventShare.shareIDsByEvent"

    private static var sharedDefaults: UserDefaults {
        UserDefaults(suiteName: appGroupIdentifier) ?? .standard
    }

    static var feedID: String {
        let defaults = sharedDefaults
        if let existing = defaults.string(forKey: feedIDKey), !existing.isEmpty {
            return existing
        }

        let generated = randomIdentifier(length: 22)
        defaults.set(generated, forKey: feedIDKey)
        return generated
    }

    static func shareID(for event: EKEvent) -> String {
        let key = event.eventIdentifier ?? event.calendarItemIdentifier
        return shareID(forEventKey: key)
    }

    static func shareID(forEventKey key: String) -> String {
        guard !key.isEmpty else { return randomIdentifier(length: 12) }

        let defaults = sharedDefaults
        var map = defaults.dictionary(forKey: shareIDMapKey) as? [String: String] ?? [:]
        if let existing = map[key] { return existing }

        let generated = randomIdentifier(length: 12)
        map[key] = generated
        defaults.set(map, forKey: shareIDMapKey)
        return generated
    }

    /// URL-safe alphabet with the look-alike characters removed, so an id
    /// survives being read aloud or retyped.
    private static let alphabet = Array(
        "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    )

    private static func randomIdentifier(length: Int) -> String {
        String((0..<length).compactMap { _ in alphabet.randomElement() })
    }
}

/// Builds the invocation URL used by the Event Preview App Clip and presents
/// the system share sheet. The URL intentionally contains only the event data
/// needed for a preview; calendar identifiers and notes are never shared.
enum EventAppClipSharing {
    static let appClipBundleIdentifier = "Deksan.CalendarASD.Clip"

    static func invocationURL(for event: EKEvent, feedID: String? = nil) -> URL? {
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
            location: event.location,
            shareID: EventShareIdentity.shareID(for: event),
            feedID: feedID
        )
    }

    static func invocationURL(for descriptor: EventDescriptor, feedID: String? = nil) -> URL? {
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
            location: event?.location,
            shareID: event.map(EventShareIdentity.shareID(for:))
                ?? EventShareIdentity.shareID(
                    forEventKey: "\(descriptor.text)|\(start.timeIntervalSince1970)"
                ),
            feedID: feedID
        )
    }

    private static func invocationURL(
        title: String,
        start: Date,
        end: Date,
        isAllDay: Bool,
        timeZone: TimeZone,
        color: UIColor,
        location: String?,
        shareID: String,
        feedID: String? = nil
    ) -> URL? {
        let normalizedTitle = title.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !normalizedTitle.isEmpty else { return nil }

        var components = URLComponents()
        components.scheme = "https"
        components.host = EventShareEndpoint.host
        components.path = EventShareEndpoint.path

        // `e` and `c` are what make the event syncable later: `e` is its stable
        // UID, `c` names the sender's personal feed. The inline fields below are
        // kept so the App Clip can draw the event with no network round-trip.
        var queryItems = EventShareEndpoint.routingQueryItems + [
            URLQueryItem(name: "e", value: shareID),
            URLQueryItem(name: "c", value: feedID ?? EventShareIdentity.feedID),
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

    /// Registers the event with the sync service so that later edits can reach
    /// whoever added it, and returns the feed the recipient should follow.
    ///
    /// The feed is scoped to this one event on purpose. Pointing recipients at
    /// the sender's whole feed would mean anyone given a single invite could
    /// see every other event that sender had ever shared with anybody.
    ///
    /// Returns nil when the event could not be registered. That is not treated
    /// as a failure by the callers: the link already carries the whole event
    /// inline, so an unreachable service costs the recipient future updates,
    /// not the invite itself. Refusing to share because a server was down would
    /// be the worse trade.
    @MainActor
    private static func syncedFeedID(for event: EKEvent) async -> String? {
        guard let title = event.title?.trimmingCharacters(in: .whitespacesAndNewlines),
              !title.isEmpty,
              let start = event.startDate,
              let end = event.endDate
        else { return nil }

        do {
            let session = try await CalendarFeedSession.current()
            let upload = SharedEventUpload(
                id: EventShareIdentity.shareID(for: event),
                title: title,
                start: start,
                end: end,
                isAllDay: event.isAllDay,
                location: event.location,
                organizerName: nil,
                organizerEmail: nil
            )
            try await CloudCalendarsAPI.upsertEvent(upload, session: session)

            // The event's own title names the subscription in the recipient's
            // calendar app, so it reads as the invite rather than as a feed.
            let grant = try await CloudCalendarsAPI.createGrant(
                role: "viewer",
                eventId: upload.id,
                feedName: title,
                session: session
            )
            return grant.feedId
        } catch {
            print("Share: link will not sync - \(error.localizedDescription)")
            return nil
        }
    }

    @MainActor
    static func shareableURL(for event: EKEvent) async -> URL? {
        let feedID = await syncedFeedID(for: event)
        return invocationURL(for: event, feedID: feedID)
    }

    @MainActor
    static func shareableURL(for descriptor: EventDescriptor) async -> URL? {
        // Only a descriptor backed by a real EventKit event has an identity
        // stable enough to update later. A synthetic one - a placeholder drawn
        // for a multi-day span, say - would get a different id next time, so
        // registering it would create a second event rather than revise the
        // first. Those are shared as plain one-off links.
        guard let event = (descriptor as? EKMultiDayWrapper)?.realEvent else {
            return invocationURL(for: descriptor)
        }
        let feedID = await syncedFeedID(for: event)
        return invocationURL(for: descriptor, feedID: feedID)
    }

    // MARK: - Presentation

    @MainActor
    static func present(for descriptor: EventDescriptor, from sourceView: UIView) {
        Task { @MainActor in
            guard let url = await shareableURL(for: descriptor) else { return }
            presentSheet(with: url, from: presentingViewController(from: sourceView)) { popover in
                popover.sourceView = sourceView
                popover.sourceRect = CGRect(
                    x: sourceView.bounds.midX,
                    y: sourceView.bounds.midY,
                    width: 1,
                    height: 1
                )
            }
        }
    }

    @MainActor
    static func present(
        for event: EKEvent,
        from presenter: UIViewController,
        sourceBarButtonItem: UIBarButtonItem
    ) {
        Task { @MainActor in
            guard let url = await shareableURL(for: event) else { return }
            presentSheet(with: url, from: presenter) { popover in
                popover.barButtonItem = sourceBarButtonItem
            }
        }
    }

    @MainActor
    static func present(for event: EKEvent) {
        Task { @MainActor in
            guard let url = await shareableURL(for: event),
                  let presenter = activePresentingViewController()
            else { return }

            presentSheet(with: url, from: presenter) { popover in
                popover.sourceView = presenter.view
                popover.sourceRect = CGRect(
                    x: presenter.view.bounds.midX,
                    y: presenter.view.bounds.minY + 80,
                    width: 1,
                    height: 1
                )
            }
        }
    }

    /// One place that builds the share sheet, so the three entry points cannot
    /// drift apart in how they anchor it on iPad.
    @MainActor
    private static func presentSheet(
        with url: URL,
        from presenter: UIViewController?,
        configurePopover: (UIPopoverPresentationController) -> Void
    ) {
        guard let presenter else { return }

        let activityController = UIActivityViewController(
            activityItems: [url],
            applicationActivities: nil
        )
        if let popover = activityController.popoverPresentationController {
            configurePopover(popover)
        }
        presenter.present(activityController, animated: true)
    }

    // MARK: - Formatting

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

    @MainActor
    private static func activePresentingViewController() -> UIViewController? {
        let activeScene = UIApplication.shared.connectedScenes
            .compactMap { $0 as? UIWindowScene }
            .first { $0.activationState == .foregroundActive }
        var current = activeScene?.windows.first(where: \.isKeyWindow)?.rootViewController

        while true {
            if let presented = current?.presentedViewController {
                current = presented
            } else if let navigation = current as? UINavigationController {
                current = navigation.visibleViewController
            } else if let tab = current as? UITabBarController {
                current = tab.selectedViewController
            } else {
                return current
            }
        }
    }
}
