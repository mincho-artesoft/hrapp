import Foundation
import CoreImage.CIFilterBuiltins
import EventKit
import MessageUI
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
private final class WeakViewControllerBox {
    weak var controller: UIViewController?
}

@MainActor
private final class EventShareMailDelegate: NSObject, @preconcurrency MFMailComposeViewControllerDelegate {
    private let onComplete: (MFMailComposeResult) -> Void

    init(onComplete: @escaping (MFMailComposeResult) -> Void) {
        self.onComplete = onComplete
    }

    func mailComposeController(
        _ controller: MFMailComposeViewController,
        didFinishWith result: MFMailComposeResult,
        error: Error?
    ) {
        controller.dismiss(animated: true) { [onComplete] in
            onComplete(result)
        }
    }
}

@MainActor
private struct EventShareMethodPicker: View {
    let eventTitle: String
    let onAppClip: () -> Void
    let onEmail: () -> Void
    let onQRCode: () -> Void
    let onCancel: () -> Void

    var body: some View {
        NavigationStack {
            VStack(alignment: .leading, spacing: 18) {
                VStack(alignment: .leading, spacing: 4) {
                    Text(eventTitle)
                        .font(.title3.weight(.semibold))
                        .lineLimit(2)
                    Text("Choose how to share this synced event.")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }

                VStack(spacing: 12) {
                    methodButton(
                        title: "App Clip",
                        subtitle: "Messages, AirDrop, and more",
                        systemImage: "appclip",
                        color: .blue,
                        action: onAppClip
                    )
                    methodButton(
                        title: "Email",
                        subtitle: "Invite people and assign access",
                        systemImage: "envelope.fill",
                        color: .orange,
                        action: onEmail
                    )
                    methodButton(
                        title: "QR Code",
                        subtitle: "Let someone scan the event",
                        systemImage: "qrcode",
                        color: .purple,
                        action: onQRCode
                    )
                }

                Spacer(minLength: 0)
            }
            .padding(20)
            .background(Color(uiColor: .systemGroupedBackground))
            .navigationTitle("Share Event")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button(action: onCancel) {
                        Image(systemName: "xmark")
                    }
                    .accessibilityLabel("Cancel")
                }
            }
        }
    }

    private func methodButton(
        title: LocalizedStringKey,
        subtitle: LocalizedStringKey,
        systemImage: String,
        color: Color,
        action: @escaping () -> Void
    ) -> some View {
        Button(action: action) {
            HStack(spacing: 14) {
                Image(systemName: systemImage)
                    .font(.title2.weight(.semibold))
                    .foregroundStyle(color)
                    .frame(width: 42, height: 42)
                    .background(color.opacity(0.12), in: RoundedRectangle(cornerRadius: 12))

                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(.body.weight(.semibold))
                        .foregroundStyle(.primary)
                    Text(subtitle)
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                        .lineLimit(1)
                }

                Spacer(minLength: 8)
                Image(systemName: "chevron.right")
                    .font(.footnote.weight(.semibold))
                    .foregroundStyle(.tertiary)
            }
            .padding(14)
            .background(Color(uiColor: .secondarySystemGroupedBackground), in: RoundedRectangle(cornerRadius: 18))
        }
        .buttonStyle(.plain)
    }
}

@MainActor
private struct EventShareQRCodeView: View {
    let eventTitle: String
    let url: URL

    @Environment(\.dismiss) private var dismiss
    @State private var copied = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 22) {
                    VStack(spacing: 5) {
                        Text(eventTitle)
                            .font(.title2.weight(.bold))
                            .multilineTextAlignment(.center)
                        Text("Scan to open this event")
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                    }

                    if let image = qrImage {
                        Image(uiImage: image)
                            .interpolation(.none)
                            .resizable()
                            .scaledToFit()
                            .frame(maxWidth: 290)
                            .padding(18)
                            .background(.white, in: RoundedRectangle(cornerRadius: 24))
                            .shadow(color: .black.opacity(0.08), radius: 16, y: 6)
                            .accessibilityLabel("QR code for \(eventTitle)")
                    }

                    Text(url.absoluteString)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                        .lineLimit(2)
                        .multilineTextAlignment(.center)
                        .textSelection(.enabled)

                    Button {
                        UIPasteboard.general.url = url
                        copied = true
                    } label: {
                        Label(copied ? "Copied" : "Copy Link", systemImage: copied ? "checkmark" : "doc.on.doc")
                            .frame(maxWidth: .infinity)
                    }
                    .buttonStyle(.borderedProminent)
                    .controlSize(.large)
                }
                .padding(24)
            }
            .background(Color(uiColor: .systemGroupedBackground))
            .navigationTitle("QR Code")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") { dismiss() }
                }
            }
        }
    }

    private var qrImage: UIImage? {
        let filter = CIFilter.qrCodeGenerator()
        filter.message = Data(url.absoluteString.utf8)
        filter.correctionLevel = "M"
        guard let output = filter.outputImage?.transformed(
            by: CGAffineTransform(scaleX: 12, y: 12)
        ), let cgImage = CIContext().createCGImage(output, from: output.extent)
        else { return nil }
        return UIImage(cgImage: cgImage)
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
              !SharedInviteTracker.isReceived(event),
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

/// The App Clip is one delivery channel. Email and QR use a separate server
/// landing URL so they work without invoking or depending on the App Clip.
/// Both links carry the same bounded preview fields and scoped S3 feed id.
enum EventShareEndpoint {
    static var appClipBundleIdentifier: String { EventAppClipSharing.appClipBundleIdentifier }

    private static let appleHost = "appclip.apple.com"
    private static let applePath = "/id"
    private static let serverHost = "api.cloud-calendars.com"
    private static let serverPath = "/event-invites/open"

    static var appClipHost: String { appleHost }
    static var appClipPath: String { applePath }
    static var appClipRoutingQueryItems: [URLQueryItem] {
        [URLQueryItem(name: "p", value: appClipBundleIdentifier)]
    }

    static func serverInvitationURL(from appClipURL: URL) -> URL? {
        guard var components = URLComponents(
            url: appClipURL,
            resolvingAgainstBaseURL: false
        ) else { return nil }

        components.scheme = "https"
        components.host = serverHost
        components.path = serverPath
        components.queryItems = components.queryItems?.filter { $0.name != "p" }
        return components.url
    }

    /// The subscribable personal-calendar feed for a given feed identifier.
    static func feedURL(for feedID: String) -> URL? {
        URL(string: "webcal://cal.cloud-calendars.com/f/\(feedID).ics")
    }
}

/// Stable identifiers that let a shared event be updated later instead of
/// duplicated.
///
/// `shareID(for:)` returns a stable identifier for a given event, so resharing
/// the same event yields the same id. That is what lets a later update or
/// cancellation replace the original entry rather than create a second one -
/// the id becomes the `UID` in the generated `.ics`.
enum EventShareIdentity {
    private static let appGroupIdentifier = "group.ARTE-SOFT.sandBOX"
    private static let shareIDMapKey = "eventShare.shareIDsByEvent"

    private static var sharedDefaults: UserDefaults {
        UserDefaults(suiteName: appGroupIdentifier) ?? .standard
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

    /// EventKit has no private writable metadata slot. Older builds used the
    /// visible URL field as an identifier; remove only those legacy values and
    /// leave any real URL created by the organiser untouched.
    static func removeLegacyMarker(from event: EKEvent, store: EKEventStore) {
        guard event.url?.scheme?.lowercased() == "cloudcalendars",
              ["shared-event", "received-event"].contains(event.url?.host ?? ""),
              event.calendar.allowsContentModifications
        else { return }
        event.url = nil
        try? store.save(event, span: .thisEvent, commit: true)
    }

    /// Provider bookkeeping URLs are not event content and must never be sent
    /// to another person. EventKit also accepts relative/custom URL values, so
    /// preserve those instead of silently dropping anything that is not HTTP.
    static func shareableURL(from event: EKEvent) -> URL? {
        guard let url = event.url, url.absoluteString.count <= 1_024 else { return nil }
        let internalSchemes = ["cloudcalendars", "gcal", "mscal"]
        if let scheme = url.scheme?.lowercased(), internalSchemes.contains(scheme) {
            return nil
        }
        return url
    }

    /// Used once to seed the new "Shared by me" list from shares created by
    /// older builds, before successful share-sheet completions were tracked.
    static var knownShareIDsByEvent: [String: String] {
        sharedDefaults.dictionary(forKey: shareIDMapKey) as? [String: String] ?? [:]
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

/// A local index of events the person actually sent from the system share
/// sheet. Event content still lives in EventKit and on the scoped server feed;
/// this small record only makes the Sharing screen fast and available offline.
@MainActor
enum SharedOutgoingEventTracker {
    struct Snapshot: Codable, Equatable {
        let title: String
        let start: Date
        let end: Date
        let isAllDay: Bool
        let location: String?
        let url: String?
        /// Optional keeps records made by older app builds decodable.
        let details: SharedEventDetails?
    }

    struct SentEvent: Codable, Equatable, Identifiable {
        let eventID: String
        var localEventIdentifier: String?
        var feedID: String?
        var title: String
        var start: Date
        var end: Date
        var isAllDay: Bool
        var location: String?
        var sharedAt: Date
        /// The exact local state last accepted by the API. The display fields
        /// above are refreshed from EventKit, so they cannot also be used to
        /// decide whether something still needs uploading.
        var lastUploadedSnapshot: Snapshot?
        /// Nil in records written by older builds, false/true thereafter.
        var isCancelled: Bool?
        /// False for a server-restored event that could not yet be matched to
        /// EventKit. Such a record must not be mistaken for a local deletion.
        var tracksLocalDeletion: Bool?
        /// Version 1 moved the local EventKit identifier out of the visible
        /// URL; version 2 also persists the complete portable event content.
        var serverMetadataVersion: Int?
        /// Last revision observed from the canonical S3 event. Optional keeps
        /// records from older builds decodable.
        var lastServerSequence: Int? = nil

        var id: String { eventID }
    }

    private static let appGroupIdentifier = "group.ARTE-SOFT.sandBOX"
    private static let storageKey = "eventShare.sentEvents.v1"
    private static let migrationKey = "eventShare.sentEventsMigrated.v1"

    private static var defaults: UserDefaults {
        UserDefaults(suiteName: appGroupIdentifier) ?? .standard
    }

    static func record(url: URL, localEventIdentifier: String?) {
        guard let components = URLComponents(url: url, resolvingAgainstBaseURL: false) else { return }

        let values = components.sharedEventFormQueryValues

        guard let eventID = values["e"], !eventID.isEmpty,
              let title = values["title"], !title.isEmpty,
              let startTimestamp = values["start"].flatMap(TimeInterval.init),
              let endTimestamp = values["end"].flatMap(TimeInterval.init)
        else { return }

        let feedID = values["c"].flatMap { $0.isEmpty ? nil : $0 }
        let parsedSnapshot = Snapshot(
            title: title,
            start: Date(timeIntervalSince1970: startTimestamp),
            end: Date(timeIntervalSince1970: endTimestamp),
            isAllDay: values["allDay"] == "1",
            location: values["location"].flatMap { $0.isEmpty ? nil : $0 },
            url: values["eventURL"].flatMap { $0.isEmpty ? nil : $0 },
            details: nil
        )
        let eventSnapshot = localEventIdentifier
            .flatMap { CalendarViewModel.shared.eventStore.event(withIdentifier: $0) }
            .flatMap(snapshot(for:))

        var all = load()
        all[eventID] = SentEvent(
            eventID: eventID,
            localEventIdentifier: localEventIdentifier ?? all[eventID]?.localEventIdentifier,
            feedID: feedID,
            title: title,
            start: parsedSnapshot.start,
            end: parsedSnapshot.end,
            isAllDay: parsedSnapshot.isAllDay,
            location: parsedSnapshot.location,
            sharedAt: Date(),
            lastUploadedSnapshot: feedID == nil ? nil : (eventSnapshot ?? parsedSnapshot),
            isCancelled: false,
            tracksLocalDeletion: true,
            serverMetadataVersion: feedID == nil ? nil : 2
        )
        save(all)
        NotificationCenter.default.post(name: .sharedEventsTrackingChanged, object: nil)
    }

    static func sentEvents(in eventStore: EKEventStore) -> [SentEvent] {
        migrateLegacySharesIfNeeded(in: eventStore)

        var all = load()
        var changed = false

        for (id, record) in all {
            guard let localEventIdentifier = record.localEventIdentifier,
                  let event = eventStore.event(withIdentifier: localEventIdentifier)
            else { continue }

            EventShareIdentity.removeLegacyMarker(from: event, store: eventStore)

            var refreshed = record
            refreshed.title = event.title ?? record.title
            refreshed.start = event.startDate
            refreshed.end = event.endDate
            refreshed.isAllDay = event.isAllDay
            refreshed.location = event.location

            if refreshed != record {
                all[id] = refreshed
                changed = true
            }
        }

        if changed { save(all) }
        return all.values.sorted {
            if $0.start == $1.start { return $0.sharedAt > $1.sharedAt }
            return $0.start < $1.start
        }
    }

    /// Pushes edits made to the organiser's original EventKit events into the
    /// scoped feeds already handed to recipients. A missing original is sent
    /// as a cancellation once, rather than deleting recipients' local copies.
    @discardableResult
    static func syncAll(in eventStore: EKEventStore) async -> Int {
        guard let session = CalendarFeedSession.existing else { return 0 }

        var changedCount = 0
        for original in load().values {
            guard let localIdentifier = original.localEventIdentifier,
                  let event = eventStore.event(withIdentifier: localIdentifier)
            else {
                // A legacy entry with no feed was never syncable, so there is
                // no remote recipient to notify about its deletion.
                guard original.feedID != nil,
                      original.isCancelled != true,
                      original.tracksLocalDeletion != false
                else { continue }
                do {
                    try await CloudCalendarsAPI.cancelEvent(id: original.eventID, session: session)
                    updatePersisted(original.eventID) { current in
                        current.isCancelled = true
                    }
                    changedCount += 1
                } catch {
                    print("Shared-event cancellation failed for \(original.eventID) - \(error.localizedDescription)")
                }
                continue
            }

            EventShareIdentity.removeLegacyMarker(from: event, store: eventStore)

            // A received copy can never become a new owner revision, even if
            // corrupt local bookkeeping accidentally put it in both indexes.
            guard !SharedInviteTracker.isReceived(event),
                  let currentSnapshot = snapshot(for: event)
            else { continue }

            let needsFeedRecovery = original.feedID == nil
            guard needsFeedRecovery
                    || currentSnapshot != original.lastUploadedSnapshot
                    || original.isCancelled == true
                    || original.serverMetadataVersion != 2
            else { continue }

            let upload = SharedEventUpload(
                id: original.eventID,
                title: currentSnapshot.title,
                start: currentSnapshot.start,
                end: currentSnapshot.end,
                isAllDay: currentSnapshot.isAllDay,
                location: currentSnapshot.location,
                url: currentSnapshot.url.flatMap(URL.init(string:)),
                details: currentSnapshot.details ?? SharedEventDetails(event: event),
                localEventIdentifier: event.eventIdentifier,
                organizerName: nil,
                organizerEmail: nil
            )

            do {
                try await CloudCalendarsAPI.upsertEvent(upload, session: session)
                // Older builds knew the stable event id but did not persist the
                // scoped feed id. Grant creation is idempotent for an event, so
                // this recovers the exact feed the recipient already follows.
                let recoveredFeedID: String?
                if needsFeedRecovery {
                    let grant = try await CloudCalendarsAPI.createGrant(
                        role: "viewer",
                        eventId: original.eventID,
                        feedName: currentSnapshot.title,
                        session: session
                    )
                    recoveredFeedID = grant.feedId
                } else {
                    recoveredFeedID = original.feedID
                }

                updatePersisted(original.eventID) { current in
                    current.feedID = recoveredFeedID
                    current.title = currentSnapshot.title
                    current.start = currentSnapshot.start
                    current.end = currentSnapshot.end
                    current.isAllDay = currentSnapshot.isAllDay
                    current.location = currentSnapshot.location
                    current.lastUploadedSnapshot = currentSnapshot
                    current.isCancelled = false
                    current.serverMetadataVersion = 2
                }
                changedCount += 1
            } catch {
                print("Shared-event upload failed for \(original.eventID) - \(error.localizedDescription)")
            }
        }

        if changedCount > 0 {
            NotificationCenter.default.post(name: .sharedEventsTrackingChanged, object: nil)
        }
        return changedCount
    }

    private static func migrateLegacySharesIfNeeded(in eventStore: EKEventStore) {
        guard !defaults.bool(forKey: migrationKey) else { return }

        var all = load()
        for (localEventIdentifier, eventID) in EventShareIdentity.knownShareIDsByEvent {
            guard all[eventID] == nil,
                  let event = eventStore.event(withIdentifier: localEventIdentifier),
                  let start = event.startDate,
                  let end = event.endDate
            else { continue }

            all[eventID] = SentEvent(
                eventID: eventID,
                localEventIdentifier: localEventIdentifier,
                feedID: nil,
                title: event.title ?? NSLocalizedString("Shared event", comment: "Fallback shared event title"),
                start: start,
                end: end,
                isAllDay: event.isAllDay,
                location: event.location,
                sharedAt: Date(),
                lastUploadedSnapshot: nil,
                isCancelled: nil,
                tracksLocalDeletion: true,
                serverMetadataVersion: nil
            )
        }

        save(all)
        defaults.set(true, forKey: migrationKey)
    }

    static func restore(
        _ remote: CloudCalendarsAPI.RemoteSharedEvent,
        localEventIdentifier: String?
    ) {
        guard let start = remote.startDate, let end = remote.endDate else { return }
        let remoteSnapshot = Snapshot(
            title: remote.title,
            start: start,
            end: end,
            isAllDay: remote.allDay,
            location: remote.location,
            url: remote.url,
            details: remote.details
        )
        var all = load()
        let previous = all[remote.id]
        let recoveredLocalSnapshot = (localEventIdentifier ?? previous?.localEventIdentifier)
            .flatMap { CalendarViewModel.shared.eventStore.event(withIdentifier: $0) }
            .flatMap(snapshot(for:))
        all[remote.id] = SentEvent(
            eventID: remote.id,
            localEventIdentifier: localEventIdentifier ?? previous?.localEventIdentifier,
            feedID: remote.feedId,
            title: remote.title,
            start: start,
            end: end,
            isAllDay: remote.allDay,
            location: remote.location,
            sharedAt: previous?.sharedAt ?? Date(),
            // Recovery discovers server state; it does not mean EventKit has
            // applied it yet. Preserve the prior upload baseline, or use the
            // recovered local event as the baseline, so the pull phase (not a
            // stale owner upload) resolves a newer Writer revision.
            lastUploadedSnapshot: previous?.lastUploadedSnapshot
                ?? recoveredLocalSnapshot
                ?? remoteSnapshot,
            isCancelled: remote.isCancelled,
            tracksLocalDeletion: (localEventIdentifier ?? previous?.localEventIdentifier) != nil,
            serverMetadataVersion: remote.details == nil
                ? previous?.serverMetadataVersion
                : 2,
            lastServerSequence: previous?.lastServerSequence
        )
        save(all)
    }

    /// Pulls Writer edits back into the owner's original EventKit event. Local
    /// owner edits are pushed first by `syncAll`; if that upload failed, the
    /// differing snapshot below deliberately protects the unsent local work.
    @discardableResult
    static func pullRemoteChanges(in eventStore: EKEventStore) async -> Int {
        guard let session = CalendarFeedSession.existing else { return 0 }
        let state: CloudCalendarsAPI.SharedState
        do {
            state = try await CloudCalendarsAPI.sharedState(session: session)
        } catch {
            print("Shared owner refresh failed - \(error.localizedDescription)")
            return 0
        }

        var changedCount = 0
        for remote in state.outgoing {
            guard var record = load()[remote.id],
                  let identifier = record.localEventIdentifier,
                  let event = eventStore.event(withIdentifier: identifier),
                  let remoteSequence = remote.sequence,
                  record.lastServerSequence == nil || remoteSequence > record.lastServerSequence!
            else { continue }

            if let current = snapshot(for: event),
               let uploaded = record.lastUploadedSnapshot,
               current != uploaded {
                continue
            }

            var eventChanged = false
            let expectedTitle = remote.isCancelled
                ? "\(NSLocalizedString("Cancelled", comment: "")): \(remote.title)"
                : remote.title
            if event.title != expectedTitle {
                event.title = expectedTitle
                eventChanged = true
            }
            if let start = remote.startDate,
               abs(event.startDate.timeIntervalSince(start)) >= 0.5 {
                event.startDate = start
                eventChanged = true
            }
            if let end = remote.endDate {
                let safeEnd = max(event.startDate, end)
                if abs(event.endDate.timeIntervalSince(safeEnd)) >= 0.5 {
                    event.endDate = safeEnd
                    eventChanged = true
                }
            }
            if event.isAllDay != remote.allDay {
                event.isAllDay = remote.allDay
                eventChanged = true
            }
            if normalized(event.location) != normalized(remote.location) {
                event.location = normalized(remote.location).isEmpty ? nil : remote.location
                eventChanged = true
            }
            let remoteURL = remote.url.flatMap(URL.init(string:))
            let providerManagedURL = ["gcal", "mscal"].contains(
                event.url?.scheme?.lowercased() ?? ""
            )
            if !providerManagedURL, event.url != remoteURL {
                event.url = remoteURL
                eventChanged = true
            }
            if let details = remote.details,
               !details.matchesWritableFields(of: event) {
                details.applyWritableFields(to: event)
                eventChanged = true
            }

            do {
                if eventChanged {
                    let span: EKSpan = event.hasRecurrenceRules ? .futureEvents : .thisEvent
                    try eventStore.save(event, span: span, commit: true)
                    record.localEventIdentifier = event.eventIdentifier
                }
                record.title = remote.title
                record.start = remote.startDate ?? record.start
                record.end = remote.endDate ?? record.end
                record.isAllDay = remote.allDay
                record.location = remote.location
                record.isCancelled = remote.isCancelled
                record.lastServerSequence = remoteSequence
                record.lastUploadedSnapshot = snapshot(for: event)
                updatePersisted(remote.id) { $0 = record }
                changedCount += 1
            } catch {
                print("Shared owner event could not be refreshed - \(error.localizedDescription)")
            }
        }

        if changedCount > 0 {
            NotificationCenter.default.post(name: .sharedEventsTrackingChanged, object: nil)
            NotificationCenter.default.post(name: .sharedEventImported, object: nil)
        }
        return changedCount
    }

    private static func load() -> [String: SentEvent] {
        guard let data = defaults.data(forKey: storageKey),
              let decoded = try? JSONDecoder().decode([String: SentEvent].self, from: data)
        else { return [:] }
        return decoded
    }

    private static func save(_ all: [String: SentEvent]) {
        guard let data = try? JSONEncoder().encode(all) else { return }
        defaults.set(data, forKey: storageKey)
    }

    static func snapshot(for event: EKEvent) -> Snapshot? {
        guard let title = event.title?.trimmingCharacters(in: .whitespacesAndNewlines),
              !title.isEmpty,
              let start = event.startDate,
              let end = event.endDate
        else { return nil }

        return Snapshot(
            title: title,
            start: start,
            end: end,
            isAllDay: event.isAllDay,
            location: event.location,
            url: EventShareIdentity.shareableURL(from: event)?.absoluteString,
            details: SharedEventDetails(event: event)
        )
    }

    private static func updatePersisted(
        _ eventID: String,
        update: (inout SentEvent) -> Void
    ) {
        // Re-read after every network await so a share completed in the
        // meantime cannot be overwritten by an older in-memory dictionary.
        var all = load()
        guard var current = all[eventID] else { return }
        update(&current)
        all[eventID] = current
        save(all)
    }

    private static func normalized(_ value: String?) -> String {
        value?.trimmingCharacters(in: .whitespacesAndNewlines) ?? ""
    }
}

/// App Clip shares use the same foreground cadence as the Google and Microsoft
/// synchronisers: push organiser edits, then pull recipient feeds every 20s.
@MainActor
enum SharedEventSyncManager {
    private static let interval: TimeInterval = 20
    private static var timer: Timer?
    private static var changeTask: Task<Void, Never>?
    private static var isSyncing = false

    static func start() {
        guard timer == nil else { return }

        Task { await syncNow() }
        timer = Timer.scheduledTimer(withTimeInterval: interval, repeats: true) { _ in
            Task { @MainActor in
                await syncNow()
            }
        }
    }

    static func stop() {
        timer?.invalidate()
        timer = nil
        changeTask?.cancel()
        changeTask = nil
    }

    /// EventKit can emit several notifications for one Save. Debouncing keeps
    /// immediate sync responsive without producing duplicate API revisions.
    static func eventStoreDidChange() {
        changeTask?.cancel()
        changeTask = Task { @MainActor in
            try? await Task.sleep(for: .milliseconds(700))
            guard !Task.isCancelled else { return }
            await syncNow()
        }
    }

    static func syncNow() async {
        guard !isSyncing else { return }
        isSyncing = true
        defer { isSyncing = false }

        let store = CalendarViewModel.shared.eventStore
        await SharedEventRecovery.restoreFromServer(force: false)
        _ = await SharedICloudCalendarLocalStore.syncOwnedCalendars(in: store)
        _ = await SharedOutgoingEventTracker.syncAll(in: store)
        _ = await SharedOutgoingEventTracker.pullRemoteChanges(in: store)
        _ = await SharedInviteRefresher.refreshAll()
        _ = await SharedICloudCalendarLocalStore.refreshAll()
    }
}

/// Builds the invocation URL used by the Event Preview App Clip and presents
/// the system share sheet. The visible URL intentionally contains only preview
/// data; complete event content travels through the scoped S3-backed feed.
enum EventAppClipSharing {
    static let appClipBundleIdentifier = "Deksan.CalendarASD.Clip"

    static func invocationURL(
        for event: EKEvent,
        feedID: String? = nil,
        shareID explicitShareID: String? = nil
    ) -> URL? {
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
            eventURL: EventShareIdentity.shareableURL(from: event),
            shareID: explicitShareID ?? EventShareIdentity.shareID(for: event),
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
            eventURL: event.flatMap(EventShareIdentity.shareableURL(from:)),
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
        eventURL: URL?,
        shareID: String,
        feedID: String? = nil
    ) -> URL? {
        let normalizedTitle = title.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !normalizedTitle.isEmpty else { return nil }

        var components = URLComponents()
        components.scheme = "https"
        components.host = EventShareEndpoint.appClipHost
        components.path = EventShareEndpoint.appClipPath

        // `e` and `c` are what make the event syncable later: `e` is its stable
        // UID, while `c` is the server-issued id of the scoped S3 feed. Never
        // invent `c` locally: a link must not claim to sync unless that file
        // really exists. The inline fields let the App Clip render offline.
        var queryItems = EventShareEndpoint.appClipRoutingQueryItems + [
            URLQueryItem(name: "e", value: shareID),
        ]
        if let feedID = feedID?.trimmingCharacters(in: .whitespacesAndNewlines),
           !feedID.isEmpty {
            queryItems.append(URLQueryItem(name: "c", value: feedID))
        }
        queryItems += [
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
        if let eventURL {
            queryItems.append(
                URLQueryItem(name: "eventURL", value: limited(eventURL.absoluteString, to: 1_024))
            )
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
        // A received invitation follows somebody else's scoped feed. Never
        // turn the recipient's local EventKit copy into a new server revision.
        guard !SharedInviteTracker.isReceived(event) else { return nil }

        guard let title = event.title?.trimmingCharacters(in: .whitespacesAndNewlines),
              !title.isEmpty,
              let start = event.startDate,
              let end = event.endDate
        else { return nil }

        do {
            let session = try await CalendarFeedSession.current()
            let shareID = EventShareIdentity.shareID(for: event)
            EventShareIdentity.removeLegacyMarker(
                from: event,
                store: CalendarViewModel.shared.eventStore
            )
            let upload = SharedEventUpload(
                id: shareID,
                title: title,
                start: start,
                end: end,
                isAllDay: event.isAllDay,
                location: event.location,
                url: EventShareIdentity.shareableURL(from: event),
                details: SharedEventDetails(event: event),
                localEventIdentifier: event.eventIdentifier,
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
        guard CloudAccountManager.shared.isSignedIn,
              !SharedInviteTracker.isReceived(event),
              let feedID = await syncedFeedID(for: event)
        else { return nil }
        return invocationURL(for: event, feedID: feedID)
    }

    @MainActor
    static func shareableURL(for descriptor: EventDescriptor) async -> URL? {
        guard CloudAccountManager.shared.isSignedIn else { return nil }
        // Only a descriptor backed by a real EventKit event has an identity
        // stable enough to update later. A synthetic one - a placeholder drawn
        // for a multi-day span, say - would get a different id next time, so
        // registering it would create a second event rather than revise the
        // first. Those are shared as plain one-off links.
        guard let event = (descriptor as? EKMultiDayWrapper)?.realEvent else { return nil }
        guard !SharedInviteTracker.isReceived(event) else { return nil }
        guard let feedID = await syncedFeedID(for: event) else { return nil }
        return invocationURL(for: descriptor, feedID: feedID)
    }

    // MARK: - Presentation

    @MainActor
    static func present(for descriptor: EventDescriptor, from sourceView: UIView) {
        let presenter = presentingViewController(from: sourceView)
        guard CloudAccountManager.shared.isSignedIn else {
            presentAccountSignIn(from: presenter) {
                present(for: descriptor, from: sourceView)
            }
            return
        }
        Task { @MainActor in
            guard let url = await shareableURL(for: descriptor) else {
                presentSyncError(from: presenter)
                return
            }
            let localEventIdentifier = (descriptor as? EKMultiDayWrapper)?.realEvent.eventIdentifier
            presentSheet(
                with: url,
                localEventIdentifier: localEventIdentifier,
                from: presenter
            ) { popover in
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
        guard CloudAccountManager.shared.isSignedIn else {
            presentAccountSignIn(from: presenter) {
                present(
                    for: event,
                    from: presenter,
                    sourceBarButtonItem: sourceBarButtonItem
                )
            }
            return
        }
        Task { @MainActor in
            guard let url = await shareableURL(for: event) else {
                presentSyncError(from: presenter)
                return
            }
            presentSheet(
                with: url,
                localEventIdentifier: event.eventIdentifier,
                from: presenter
            ) { popover in
                popover.barButtonItem = sourceBarButtonItem
            }
        }
    }

    @MainActor
    static func present(for event: EKEvent) {
        let presenter = activePresentingViewController()
        guard CloudAccountManager.shared.isSignedIn else {
            presentAccountSignIn(from: presenter) {
                present(for: event)
            }
            return
        }
        Task { @MainActor in
            guard let presenter else { return }
            guard let url = await shareableURL(for: event) else {
                presentSyncError(from: presenter)
                return
            }

            presentSheet(
                with: url,
                localEventIdentifier: event.eventIdentifier,
                from: presenter
            ) { popover in
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

    /// Presents the app's three intentional delivery paths before handing the
    /// App Clip path to the broad system share sheet.
    @MainActor
    private static func presentSheet(
        with url: URL,
        localEventIdentifier: String?,
        from presenter: UIViewController?,
        configurePopover: @escaping (UIPopoverPresentationController) -> Void
    ) {
        guard let presenter else { return }

        let controllerBox = WeakViewControllerBox()
        let title = sharedEventTitle(from: url)
        guard let serverInvitationURL = EventShareEndpoint.serverInvitationURL(from: url) else {
            presentSyncError(from: presenter)
            return
        }
        let picker = EventShareMethodPicker(
            eventTitle: title,
            onAppClip: {
                controllerBox.controller?.dismiss(animated: true) {
                    Task { @MainActor in
                        presentSystemShareSheet(
                            with: url,
                            localEventIdentifier: localEventIdentifier,
                            from: presenter,
                            configurePopover: configurePopover
                        )
                    }
                }
            },
            onEmail: {
                controllerBox.controller?.dismiss(animated: true) {
                    Task { @MainActor in
                        presentEmailInvitations(
                            with: serverInvitationURL,
                            eventTitle: title,
                            localEventIdentifier: localEventIdentifier,
                            from: presenter
                        )
                    }
                }
            },
            onQRCode: {
                controllerBox.controller?.dismiss(animated: true) {
                    Task { @MainActor in
                        recordCompletedShare(
                            url: serverInvitationURL,
                            localEventIdentifier: localEventIdentifier
                        )
                        presentQRCode(
                            with: serverInvitationURL,
                            eventTitle: title,
                            from: presenter
                        )
                    }
                }
            },
            onCancel: {
                controllerBox.controller?.dismiss(animated: true)
            }
        )
        let controller = UIHostingController(rootView: picker)
        controllerBox.controller = controller
        controller.modalPresentationStyle = .pageSheet
        if let sheet = controller.sheetPresentationController {
            sheet.detents = [.medium()]
            sheet.selectedDetentIdentifier = .medium
            sheet.prefersGrabberVisible = true
        }
        presenter.present(controller, animated: true)
    }

    @MainActor
    private static func presentSystemShareSheet(
        with url: URL,
        localEventIdentifier: String?,
        from presenter: UIViewController,
        configurePopover: (UIPopoverPresentationController) -> Void
    ) {

        let activityController = UIActivityViewController(
            activityItems: [url],
            applicationActivities: nil
        )
        activityController.completionWithItemsHandler = { _, completed, _, _ in
            guard completed else { return }
            Task { @MainActor in
                recordCompletedShare(
                    url: url,
                    localEventIdentifier: localEventIdentifier
                )
            }
        }
        if let popover = activityController.popoverPresentationController {
            configurePopover(popover)
        }
        presenter.present(activityController, animated: true)
    }

    @MainActor
    private static func presentEmailInvitations(
        with url: URL,
        eventTitle: String,
        localEventIdentifier: String?,
        from presenter: UIViewController
    ) {
        guard let eventID = sharedEventValue(named: "e", from: url), !eventID.isEmpty else {
            presentSyncError(from: presenter)
            return
        }

        let controller = UIHostingController(
            rootView: EventEmailInvitationsView(
                eventID: eventID,
                eventTitle: eventTitle,
                eventURL: url
            ) {
                recordCompletedShare(
                    url: url,
                    localEventIdentifier: localEventIdentifier
                )
            }
        )
        controller.modalPresentationStyle = .pageSheet
        if let sheet = controller.sheetPresentationController {
            sheet.detents = [.large()]
            sheet.selectedDetentIdentifier = .large
            sheet.prefersGrabberVisible = true
        }
        presenter.present(controller, animated: true)
    }

    @MainActor
    private static func presentEmail(
        with url: URL,
        eventTitle: String,
        localEventIdentifier: String?,
        from presenter: UIViewController
    ) {
        let subject = String(
            format: NSLocalizedString("Shared event: %@", comment: "Shared-event email subject"),
            eventTitle
        )
        let body = String(
            format: NSLocalizedString(
                "Open this event with Cloud Calendars:\n\n%@",
                comment: "Shared-event email body"
            ),
            url.absoluteString
        )

        if MFMailComposeViewController.canSendMail() {
            let mail = MFMailComposeViewController()
            mail.setSubject(subject)
            mail.setMessageBody(body, isHTML: false)
            let delegate = EventShareMailDelegate { result in
                if result == .sent {
                    recordCompletedShare(
                        url: url,
                        localEventIdentifier: localEventIdentifier
                    )
                }
                activeMailDelegate = nil
            }
            activeMailDelegate = delegate
            mail.mailComposeDelegate = delegate
            presenter.present(mail, animated: true)
            return
        }

        var components = URLComponents()
        components.scheme = "mailto"
        components.queryItems = [
            URLQueryItem(name: "subject", value: subject),
            URLQueryItem(name: "body", value: body)
        ]
        guard let mailURL = components.url else { return }
        UIApplication.shared.open(mailURL) { opened in
            guard opened else {
                Task { @MainActor in
                    presentMailUnavailable(from: presenter)
                }
                return
            }
            Task { @MainActor in
                recordCompletedShare(
                    url: url,
                    localEventIdentifier: localEventIdentifier
                )
            }
        }
    }

    @MainActor
    private static func presentQRCode(
        with url: URL,
        eventTitle: String,
        from presenter: UIViewController
    ) {
        let controller = UIHostingController(
            rootView: EventShareQRCodeView(eventTitle: eventTitle, url: url)
        )
        controller.modalPresentationStyle = .pageSheet
        if let sheet = controller.sheetPresentationController {
            sheet.detents = [.large()]
            sheet.selectedDetentIdentifier = .large
            sheet.prefersGrabberVisible = true
        }
        presenter.present(controller, animated: true)
    }

    @MainActor
    private static func presentMailUnavailable(from presenter: UIViewController) {
        let alert = UIAlertController(
            title: NSLocalizedString("Mail is not configured", comment: "Email unavailable title"),
            message: NSLocalizedString(
                "Add a Mail account on this device, then try again.",
                comment: "Email unavailable message"
            ),
            preferredStyle: .alert
        )
        alert.addAction(UIAlertAction(title: NSLocalizedString("OK", comment: ""), style: .default))
        presenter.present(alert, animated: true)
    }

    @MainActor
    private static func recordCompletedShare(url: URL, localEventIdentifier: String?) {
        SharedOutgoingEventTracker.record(
            url: url,
            localEventIdentifier: localEventIdentifier
        )
    }

    private static func sharedEventTitle(from url: URL) -> String {
        sharedEventValue(named: "title", from: url)
            ?? NSLocalizedString("Shared event", comment: "Fallback shared event title")
    }

    private static func sharedEventValue(named name: String, from url: URL) -> String? {
        URLComponents(url: url, resolvingAgainstBaseURL: false)?
            .sharedEventFormQueryValues[name]
    }

    @MainActor
    private static var activeMailDelegate: EventShareMailDelegate?

    @MainActor
    private static func presentAccountSignIn(
        from presenter: UIViewController?,
        onAuthenticated: @escaping @MainActor () -> Void
    ) {
        guard let presenter, presenter.presentedViewController == nil else { return }
        let controller = UIHostingController(rootView: CloudAccountSignInView())
        controller.rootView = CloudAccountSignInView { [weak controller] in
            // Wait for UIKit's dismissal completion. Presenting an activity
            // controller while the login sheet is still being removed is
            // ignored, which is why a fixed async delay is not reliable.
            controller?.dismiss(animated: true) {
                Task { @MainActor in onAuthenticated() }
            }
        }
        controller.modalPresentationStyle = .pageSheet
        if let sheet = controller.sheetPresentationController {
            sheet.detents = [.large()]
            sheet.selectedDetentIdentifier = .large
            sheet.prefersGrabberVisible = true
        }
        presenter.present(controller, animated: true)
    }

    @MainActor
    private static func presentSyncError(from presenter: UIViewController?) {
        guard let presenter, presenter.presentedViewController == nil else { return }
        let alert = UIAlertController(
            title: NSLocalizedString("Unable to share event", comment: "Share sync failure title"),
            message: NSLocalizedString(
                "The event could not be saved to your Cloud Calendars account. Please try again.",
                comment: "Share sync failure message"
            ),
            preferredStyle: .alert
        )
        alert.addAction(UIAlertAction(title: NSLocalizedString("OK", comment: ""), style: .default))
        presenter.present(alert, animated: true)
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
