import EventKit
import SwiftUI
import UIKit
import CryptoKit

/// Maintains the local EventKit calendars that back calendar-level shares.
/// They stay hidden from the regular iCloud/Other sections and are rendered
/// exclusively under "Shared with me", where their selection controls event
/// visibility just like every other calendar row.
@MainActor
enum SharedICloudCalendarLocalStore {
    private static let defaultsKey = "SharedICloudCalendarLocalIdentifiers"
    private static let eventDefaultsKey = "SharedICloudCalendarLocalEventIdentifiers.v1"
    private static let ownedDefaultsKey = "SharedICloudCalendarOwnedIdentifiers.v1"
    private static let revokedDefaultsKey = "SharedICloudCalendarRevokedShareIDs.v1"
    private static let accessDefaultsKey = "SharedICloudCalendarAccessByShareID.v1"
    private static let syncBaselineDefaultsKey = "SharedICloudCalendarSyncBaselines.v1"
    private static let ownedSyncBaselineDefaultsKey =
        "SharedICloudCalendarOwnedSyncBaselines.v1"
    private static let localColorOverridesDefaultsKey =
        "SharedICloudCalendarLocalColorOverrides.v1"
    private static let removedLocallyDefaultsKey =
        "SharedICloudCalendarRemovedLocally.v1"
    private static var isRefreshing = false
    private static var pendingRefresh = false
    private static var isUploading = false
    private static var didDiscoverOwnedCalendars = false

    private struct SyncBaseline: Codable, Equatable {
        let eventFingerprint: String
        let title: String
        let color: String
        let metadataUpdatedAt: String?
        let eventsUpdatedAt: String?
    }

    private struct UploadResult {
        let metadataUploaded: Bool
        let eventsUploaded: Bool

        static let none = UploadResult(
            metadataUploaded: false,
            eventsUploaded: false
        )

        var didUpload: Bool { metadataUploaded || eventsUploaded }
    }

    private static var identifiers: [String: String] {
        get {
            UserDefaults.standard.dictionary(forKey: defaultsKey) as? [String: String] ?? [:]
        }
        set {
            UserDefaults.standard.set(newValue, forKey: defaultsKey)
        }
    }

    static var allLocalCalendarIdentifiers: Set<String> {
        Set(identifiers.values)
    }

    /// Calendar-level shares use the same permission semantics as event
    /// shares. Keep the lookup synchronous because drag, edit, and EventKit
    /// detail views must decide immediately whether an event is writable.
    nonisolated static func access(
        localCalendarIdentifier: String
    ) -> CloudCalendarsAPI.EventAccess? {
        let mappings = UserDefaults.standard.dictionary(
            forKey: "SharedICloudCalendarLocalIdentifiers"
        ) as? [String: String] ?? [:]
        guard let shareID = mappings.first(where: {
            $0.value == localCalendarIdentifier
        })?.key else { return nil }
        let rawValues = UserDefaults.standard.dictionary(
            forKey: "SharedICloudCalendarAccessByShareID.v1"
        ) as? [String: String] ?? [:]
        return rawValues[shareID].flatMap(CloudCalendarsAPI.EventAccess.init(rawValue:))
            ?? .reader
    }

    nonisolated static func isShared(
        localCalendarIdentifier: String
    ) -> Bool {
        let mappings = UserDefaults.standard.dictionary(
            forKey: "SharedICloudCalendarLocalIdentifiers"
        ) as? [String: String] ?? [:]
        return mappings.values.contains(localCalendarIdentifier)
    }

    nonisolated static func canEditEvents(
        localCalendarIdentifier: String
    ) -> Bool {
        guard !isRevoked(localCalendarIdentifier: localCalendarIdentifier),
              let access = access(localCalendarIdentifier: localCalendarIdentifier)
        else { return false }
        return access == .writer || access == .owner
    }

    nonisolated static func canManageSharing(
        localCalendarIdentifier: String
    ) -> Bool {
        !isRevoked(localCalendarIdentifier: localCalendarIdentifier)
            && access(localCalendarIdentifier: localCalendarIdentifier) == .owner
    }

    /// Safe for the synchronous event-rendering paths. Those views need to
    /// decide whether to draw a strike-through without starting an async sync.
    nonisolated static func isRevoked(localCalendarIdentifier: String) -> Bool {
        let mappings = UserDefaults.standard.dictionary(
            forKey: "SharedICloudCalendarLocalIdentifiers"
        ) as? [String: String] ?? [:]
        let revoked = Set(
            UserDefaults.standard.stringArray(
                forKey: "SharedICloudCalendarRevokedShareIDs.v1"
            ) ?? []
        )
        return mappings.contains {
            $0.value == localCalendarIdentifier && revoked.contains($0.key)
        }
    }

    private static var revokedShareIDs: Set<String> {
        get { Set(UserDefaults.standard.stringArray(forKey: revokedDefaultsKey) ?? []) }
        set { UserDefaults.standard.set(Array(newValue).sorted(), forKey: revokedDefaultsKey) }
    }

    private static var accessByShareID: [String: String] {
        get {
            UserDefaults.standard.dictionary(forKey: accessDefaultsKey)
                as? [String: String] ?? [:]
        }
        set { UserDefaults.standard.set(newValue, forKey: accessDefaultsKey) }
    }

    private static var syncBaselines: [String: SyncBaseline] {
        get {
            guard let data = UserDefaults.standard.data(forKey: syncBaselineDefaultsKey),
                  let decoded = try? JSONDecoder().decode(
                    [String: SyncBaseline].self,
                    from: data
                  )
            else { return [:] }
            return decoded
        }
        set {
            guard let data = try? JSONEncoder().encode(newValue) else { return }
            UserDefaults.standard.set(data, forKey: syncBaselineDefaultsKey)
        }
    }

    private static var ownedSyncBaselines: [String: SyncBaseline] {
        get {
            guard let data = UserDefaults.standard.data(
                forKey: ownedSyncBaselineDefaultsKey
            ), let decoded = try? JSONDecoder().decode(
                [String: SyncBaseline].self,
                from: data
            ) else { return [:] }
            return decoded
        }
        set {
            guard let data = try? JSONEncoder().encode(newValue) else { return }
            UserDefaults.standard.set(data, forKey: ownedSyncBaselineDefaultsKey)
        }
    }

    /// A recipient may choose a different display color without changing the
    /// canonical calendar for anybody else. The override is keyed by the
    /// server share ID so subsequent pulls do not overwrite it.
    private static var localColorOverrides: [String: String] {
        get {
            UserDefaults.standard.dictionary(forKey: localColorOverridesDefaultsKey)
                as? [String: String] ?? [:]
        }
        set { UserDefaults.standard.set(newValue, forKey: localColorOverridesDefaultsKey) }
    }

    /// Keep a local tombstone after a recipient leaves so a stale response
    /// already in flight cannot recreate the EventKit mirror.
    private static var removedLocallyShareIDs: Set<String> {
        get {
            Set(UserDefaults.standard.stringArray(forKey: removedLocallyDefaultsKey) ?? [])
        }
        set {
            UserDefaults.standard.set(
                Array(newValue).sorted(),
                forKey: removedLocallyDefaultsKey
            )
        }
    }

    static func isRemovedLocally(shareID: String) -> Bool {
        removedLocallyShareIDs.contains(shareID)
    }

    static func restoreLocally(shareID: String) {
        var values = removedLocallyShareIDs
        guard values.remove(shareID) != nil else { return }
        removedLocallyShareIDs = values
    }

    static func restoreLocally(ownerID: String, calendarID: String) {
        let identity = "\(ownerID):\(calendarID)"
        let shareID = SHA256.hash(data: Data(identity.utf8))
            .map { String(format: "%02x", $0) }
            .joined()
        restoreLocally(shareID: shareID)
    }

    static func localColorOverride(shareID: String) -> UIColor? {
        guard let value = localColorOverrides[shareID] else { return nil }
        return uiColor(value)
    }

    /// A signed-out device must never retain Writer/Owner capabilities from a
    /// previous authenticated session. The next successful refresh restores
    /// the roles granted by the canonical calendar record.
    static func demoteAllToReader() {
        var values = accessByShareID
        for shareID in identifiers.keys { values[shareID] = CloudCalendarsAPI.EventAccess.reader.rawValue }
        accessByShareID = values
    }

    private static var eventIdentifiers: [String: [String: String]] {
        get {
            UserDefaults.standard.dictionary(forKey: eventDefaultsKey) as? [String: [String: String]] ?? [:]
        }
        set {
            UserDefaults.standard.set(newValue, forKey: eventDefaultsKey)
        }
    }

    private static var ownedIdentifiers: [String: String] {
        get {
            UserDefaults.standard.dictionary(forKey: ownedDefaultsKey) as? [String: String] ?? [:]
        }
        set {
            UserDefaults.standard.set(newValue, forKey: ownedDefaultsKey)
        }
    }

    static func registerOwnedCalendar(
        shareID: String,
        localCalendarIdentifier: String
    ) {
        var values = ownedIdentifiers
        values[shareID] = localCalendarIdentifier
        ownedIdentifiers = values
    }

    static func markOwnedCalendarDeleted(shareID: String) async {
        guard let session = CalendarFeedSession.existing else { return }
        do {
            try await CloudCalendarsAPI.deleteICloudCalendarSharing(
                calendarId: shareID,
                session: session
            )
            var values = ownedIdentifiers
            values.removeValue(forKey: shareID)
            ownedIdentifiers = values
            var baselines = ownedSyncBaselines
            baselines.removeValue(forKey: shareID)
            ownedSyncBaselines = baselines
        } catch {
            print(
                "Shared calendar deletion sync failed for \(shareID): "
                    + error.localizedDescription
            )
        }
    }

    /// Pushes the current owner-side EventKit calendar to the canonical S3
    /// snapshot. Metadata is included on every pass, which also repairs name
    /// and color changes made from the normal calendar editor.
    @discardableResult
    static func syncOwnedCalendars(in eventStore: EKEventStore) async -> Int {
        guard !isUploading, let session = CalendarFeedSession.existing else { return 0 }
        isUploading = true
        defer { isUploading = false }

        await discoverOwnedCalendars(in: eventStore, session: session)

        let calendar = Calendar.current
        let windowStart = calendar.date(byAdding: .year, value: -1, to: Date()) ?? Date()
        let windowEnd = calendar.date(byAdding: .year, value: 3, to: Date()) ?? Date()
        var synced = 0
        var validMappings = ownedIdentifiers

        for (shareID, localIdentifier) in ownedIdentifiers {
            guard let localCalendar = eventStore.calendar(withIdentifier: localIdentifier) else {
                do {
                    try await CloudCalendarsAPI.deleteICloudCalendarSharing(
                        calendarId: shareID,
                        session: session
                    )
                    validMappings.removeValue(forKey: shareID)
                } catch {
                    print(
                        "Shared calendar deletion sync failed for \(shareID): "
                            + error.localizedDescription
                    )
                }
                continue
            }

            do {
                let existing = try await CloudCalendarsAPI.iCloudCalendarSharing(
                    calendarId: shareID,
                    session: session
                )
                guard !existing.title.isEmpty else {
                    validMappings.removeValue(forKey: shareID)
                    continue
                }

                let predicate = eventStore.predicateForEvents(
                    withStart: windowStart,
                    end: windowEnd,
                    calendars: [localCalendar]
                )
                let localEvents = eventStore.events(matching: predicate)
                let events = portableOwnedEvents(
                    localEvents,
                    shareID: shareID
                )
                let localFingerprint = eventFingerprint(events)
                let localTitle = localCalendar.title
                let localColor = colorHex(localCalendar.cgColor)
                let baseline = ownedSyncBaselines[shareID]

                // A Writer or delegated Owner may have changed the canonical
                // calendar since this device's last successful pass. Pull that
                // revision before considering local uploads, exactly like the
                // single-event sync. This prevents the original owner's stale
                // 20-second snapshot from undoing another user's edit.
                if let baseline {
                    let remoteMetadataChanged = existing.updatedAt
                        != baseline.metadataUpdatedAt
                    let remoteEventsChanged = existing.eventsUpdatedAt
                        != baseline.eventsUpdatedAt
                    if remoteMetadataChanged || remoteEventsChanged {
                        let didChange = try reconcileOwnedCalendar(
                            shareID: shareID,
                            sharing: existing,
                            localCalendar: localCalendar,
                            eventStore: eventStore,
                            applyMetadata: remoteMetadataChanged,
                            applyEvents: remoteEventsChanged
                        )
                        setOwnedSyncBaseline(
                            shareID: shareID,
                            sharing: existing,
                            localCalendar: localCalendar,
                            eventStore: eventStore,
                            windowStart: windowStart,
                            windowEnd: windowEnd
                        )
                        if didChange { synced += 1 }
                        continue
                    }

                    let metadataChanged = localTitle != baseline.title
                        || localColor != baseline.color
                    let eventsChanged = localFingerprint
                        != baseline.eventFingerprint
                    guard metadataChanged || eventsChanged else { continue }

                    var metadataUpdatedAt = existing.updatedAt
                    var eventsUpdatedAt = existing.eventsUpdatedAt
                    if metadataChanged {
                        let saved = try await CloudCalendarsAPI
                            .saveICloudCalendarSharing(
                                calendarId: shareID,
                                title: localTitle,
                                color: localColor,
                                timeZone: existing.timeZone,
                                recipients: existing.recipients.map {
                                    (email: $0.email, access: $0.access)
                                },
                                expectedUpdatedAt: existing.updatedAt,
                                session: session
                            )
                        metadataUpdatedAt = saved.updatedAt
                    }
                    if eventsChanged {
                        eventsUpdatedAt = try await CloudCalendarsAPI
                            .saveICloudCalendarEvents(
                                calendarId: shareID,
                                events: events,
                                windowStart: windowStart,
                                windowEnd: windowEnd,
                                expectedUpdatedAt: existing.eventsUpdatedAt,
                                session: session
                            )
                    }
                    var baselines = ownedSyncBaselines
                    baselines[shareID] = SyncBaseline(
                        eventFingerprint: localFingerprint,
                        title: localTitle,
                        color: localColor,
                        metadataUpdatedAt: metadataUpdatedAt,
                        eventsUpdatedAt: eventsUpdatedAt
                    )
                    ownedSyncBaselines = baselines
                    synced += 1
                    continue
                }

                // On first discovery, an existing server snapshot is safer
                // than blindly replacing it. A brand-new share has no event
                // revision yet, so seed it from its creator's EventKit copy.
                if existing.eventsUpdatedAt != nil {
                    let didChange = try reconcileOwnedCalendar(
                        shareID: shareID,
                        sharing: existing,
                        localCalendar: localCalendar,
                        eventStore: eventStore,
                        applyMetadata: true,
                        applyEvents: true
                    )
                    setOwnedSyncBaseline(
                        shareID: shareID,
                        sharing: existing,
                        localCalendar: localCalendar,
                        eventStore: eventStore,
                        windowStart: windowStart,
                        windowEnd: windowEnd
                    )
                    if didChange { synced += 1 }
                } else {
                    let eventsUpdatedAt = try await CloudCalendarsAPI
                        .saveICloudCalendarEvents(
                            calendarId: shareID,
                            events: events,
                            windowStart: windowStart,
                            windowEnd: windowEnd,
                            session: session
                        )
                    var baselines = ownedSyncBaselines
                    baselines[shareID] = SyncBaseline(
                        eventFingerprint: localFingerprint,
                        title: localTitle,
                        color: localColor,
                        metadataUpdatedAt: existing.updatedAt,
                        eventsUpdatedAt: eventsUpdatedAt
                    )
                    ownedSyncBaselines = baselines
                    synced += 1
                }
            } catch {
                print("Shared calendar upload failed for \(shareID): \(error.localizedDescription)")
            }
        }

        if validMappings != ownedIdentifiers { ownedIdentifiers = validMappings }
        return synced
    }

    /// Older app builds created the canonical S3 share before the local
    /// owner-calendar mapping existed. Discover those records once per app
    /// launch so existing shares start syncing without requiring the owner to
    /// open the sharing sheet or make a throwaway edit after updating.
    private static func discoverOwnedCalendars(
        in eventStore: EKEventStore,
        session: CloudCalendarsAPI.Session
    ) async {
        guard !didDiscoverOwnedCalendars else { return }

        var mappings = ownedIdentifiers
        var completed = true
        let receivedCalendarIDs = allLocalCalendarIdentifiers
        let candidates = eventStore.calendars(for: .event).filter { calendar in
            !receivedCalendarIDs.contains(calendar.calendarIdentifier)
                && (calendar.source.sourceType == .local || calendar.source.title == "iCloud")
        }

        for calendar in candidates {
            let shareID = SHA256.hash(data: Data(calendar.calendarIdentifier.utf8))
                .map { String(format: "%02x", $0) }
                .joined()
            do {
                let sharing = try await CloudCalendarsAPI.iCloudCalendarSharing(
                    calendarId: shareID,
                    session: session
                )
                if !sharing.title.isEmpty {
                    mappings[shareID] = calendar.calendarIdentifier
                }
            } catch {
                completed = false
                print(
                    "Shared calendar discovery failed for \(shareID): "
                        + error.localizedDescription
                )
            }
        }

        ownedIdentifiers = mappings
        didDiscoverOwnedCalendars = completed
    }

    static func localCalendar(
        for sharedCalendar: CloudCalendarsAPI.SharedICloudCalendar,
        in eventStore: EKEventStore
    ) -> EKCalendar? {
        guard let identifier = identifiers[sharedCalendar.id] else { return nil }
        return eventStore.calendar(withIdentifier: identifier)
    }

    /// Updates only this device's EventKit display color. It deliberately does
    /// not call the sharing API, even when the current user is an Owner.
    static func setLocalColorOverride(
        _ color: UIColor?,
        for sharedCalendar: CloudCalendarsAPI.SharedICloudCalendar,
        in eventStore: EKEventStore
    ) throws {
        guard let calendar = localCalendar(for: sharedCalendar, in: eventStore) else {
            throw SharedCalendarLocalError.calendarUnavailable
        }

        let effectiveColor = color ?? uiColor(sharedCalendar.color)
        calendar.cgColor = effectiveColor.cgColor
        try eventStore.saveCalendar(calendar, commit: true)

        var overrides = localColorOverrides
        if let color {
            overrides[sharedCalendar.id] = colorHex(color.cgColor)
        } else {
            overrides.removeValue(forKey: sharedCalendar.id)
        }
        localColorOverrides = overrides

        // Owners can upload canonical metadata. Align their baseline with the
        // local-only override so the foreground sync never leaks this personal
        // color choice back to S3.
        setSyncBaseline(for: sharedCalendar, in: eventStore)
    }

    /// Removes the EventKit mirror and its local mappings after the server has
    /// removed this account from the canonical recipient list.
    static func removeLocally(
        _ sharedCalendar: CloudCalendarsAPI.SharedICloudCalendar,
        in eventStore: EKEventStore
    ) throws {
        let shareID = sharedCalendar.id
        let localIdentifier = identifiers[shareID]
        if let localIdentifier,
           let calendar = eventStore.calendar(withIdentifier: localIdentifier) {
            try eventStore.removeCalendar(calendar, commit: true)
            CalendarViewModel.shared.selectedCalendarIDs.remove(localIdentifier)
        }

        var calendarMappings = identifiers
        calendarMappings.removeValue(forKey: shareID)
        identifiers = calendarMappings

        var events = eventIdentifiers
        events.removeValue(forKey: shareID)
        eventIdentifiers = events

        var accessValues = accessByShareID
        accessValues.removeValue(forKey: shareID)
        accessByShareID = accessValues

        var revokedValues = revokedShareIDs
        revokedValues.remove(shareID)
        revokedShareIDs = revokedValues

        var baselines = syncBaselines
        baselines.removeValue(forKey: shareID)
        syncBaselines = baselines

        var overrides = localColorOverrides
        overrides.removeValue(forKey: shareID)
        localColorOverrides = overrides

        var removed = removedLocallyShareIDs
        removed.insert(shareID)
        removedLocallyShareIDs = removed

        CalendarViewModel.shared.reloadCalendars()
        NotificationCenter.default.post(name: .sharedEventImported, object: nil)
    }

    /// Pulls calendar-level sharing metadata on the same foreground cadence as
    /// shared events. This keeps the recipient's local calendar name and color
    /// current even while the Calendars sheet is closed.
    @discardableResult
    static func refreshAll() async -> Int {
        guard let session = CalendarFeedSession.existing else {
            return 0
        }
        guard !isRefreshing else {
            pendingRefresh = true
            return 0
        }

        isRefreshing = true
        defer {
            isRefreshing = false
            if pendingRefresh {
                pendingRefresh = false
                Task { @MainActor in
                    _ = await refreshAll()
                }
            }
        }

        do {
            let sharedCalendars = try await CloudCalendarsAPI
                .iCloudCalendarsSharedWithMe(session: session)
            let eventStore = CalendarViewModel.shared.eventStore
            var changed = 0

            for sharedCalendar in sharedCalendars
                where !isRemovedLocally(shareID: sharedCalendar.id) {
                let upload = try await uploadReceivedChangesIfNeeded(
                    sharedCalendar,
                    in: eventStore,
                    session: session
                )

                let result = try reconcile(
                    sharedCalendar,
                    in: eventStore,
                    applyMetadata: !upload.metadataUploaded,
                    applyEvents: !upload.eventsUploaded
                )
                if result.created {
                    CalendarViewModel.shared.selectedCalendarIDs.insert(
                        result.calendar.calendarIdentifier
                    )
                }
                if result.changed || upload.didUpload {
                    changed += 1
                }
                if !upload.didUpload {
                    setSyncBaseline(for: sharedCalendar, in: eventStore)
                }
            }

            if changed > 0 {
                CalendarViewModel.shared.reloadCalendars()
                NotificationCenter.default.post(name: .sharedEventImported, object: nil)
            }
            return changed
        } catch {
            print("Shared calendar refresh failed: \(error.localizedDescription)")
            return 0
        }
    }

    @discardableResult
    static func reconcile(
        _ sharedCalendar: CloudCalendarsAPI.SharedICloudCalendar,
        in eventStore: EKEventStore,
        applyMetadata: Bool = true,
        applyEvents: Bool = true
    ) throws -> (calendar: EKCalendar, created: Bool, changed: Bool) {
        let revocationChanged = setRevoked(
            sharedCalendar.isRevoked,
            shareID: sharedCalendar.id
        )
        let accessChanged = setAccess(
            sharedCalendar.access,
            shareID: sharedCalendar.id
        )
        if let existing = localCalendar(for: sharedCalendar, in: eventStore) {
            let color = uiColor(
                localColorOverrides[sharedCalendar.id] ?? sharedCalendar.color
            )
            var changed = revocationChanged || accessChanged
            if applyMetadata && (existing.title != sharedCalendar.title
                || !colorsMatch(existing.cgColor, color.cgColor)) {
                existing.title = sharedCalendar.title
                existing.cgColor = color.cgColor
                try eventStore.saveCalendar(existing, commit: true)
                changed = true
            }
            if applyEvents {
                changed = try reconcileEvents(
                    sharedCalendar,
                    into: existing,
                    eventStore: eventStore
                ) || changed
            }
            return (existing, false, changed)
        }

        guard let source = eventStore.sources.first(where: { $0.sourceType == .local })
            ?? eventStore.defaultCalendarForNewEvents?.source
        else {
            throw SharedCalendarLocalError.noWritableSource
        }

        let calendar = EKCalendar(for: .event, eventStore: eventStore)
        calendar.title = sharedCalendar.title
        calendar.cgColor = uiColor(
            localColorOverrides[sharedCalendar.id] ?? sharedCalendar.color
        ).cgColor
        calendar.source = source
        try eventStore.saveCalendar(calendar, commit: true)

        var updated = identifiers
        updated[sharedCalendar.id] = calendar.calendarIdentifier
        identifiers = updated
        _ = try reconcileEvents(sharedCalendar, into: calendar, eventStore: eventStore)
        return (calendar, true, true)
    }

    /// Uploads edits made in a received calendar before the next pull can
    /// overwrite them. Reader calendars never enter this path. Writer may
    /// change events; Owner may additionally change calendar metadata and
    /// manage sharing through the dedicated sharing view.
    private static func uploadReceivedChangesIfNeeded(
        _ sharedCalendar: CloudCalendarsAPI.SharedICloudCalendar,
        in eventStore: EKEventStore,
        session: CloudCalendarsAPI.Session
    ) async throws -> UploadResult {
        guard !sharedCalendar.isRevoked,
              sharedCalendar.access == .writer || sharedCalendar.access == .owner,
              let localCalendar = localCalendar(for: sharedCalendar, in: eventStore),
              let baseline = syncBaselines[sharedCalendar.id]
        else { return .none }

        let range = syncWindow()
        let events = portableEvents(
            for: sharedCalendar,
            localCalendar: localCalendar,
            in: eventStore,
            windowStart: range.start,
            windowEnd: range.end
        )
        let currentEventFingerprint = eventFingerprint(events)
        let currentTitle = localCalendar.title
        let currentColor = colorHex(localCalendar.cgColor)
        let eventsChanged = currentEventFingerprint != baseline.eventFingerprint
        let metadataChanged = sharedCalendar.access == .owner
            && (currentTitle != baseline.title || currentColor != baseline.color)

        guard eventsChanged || metadataChanged else { return .none }

        let mayUploadMetadata = metadataChanged
            && sharedCalendar.updatedAt == baseline.metadataUpdatedAt
        let mayUploadEvents = eventsChanged
            && sharedCalendar.eventsUpdatedAt == baseline.eventsUpdatedAt

        // A newer remote revision wins first. On the next EventKit change the
        // user can edit that fresh version, but a stale full-calendar snapshot
        // is never allowed to roll another device back.
        guard mayUploadMetadata || mayUploadEvents else { return .none }

        var metadataUpdatedAt = sharedCalendar.updatedAt
        var eventsUpdatedAt = sharedCalendar.eventsUpdatedAt
        if mayUploadMetadata {
            let saved = try await CloudCalendarsAPI.saveICloudCalendarSharing(
                calendarId: sharedCalendar.calendarId,
                ownerId: sharedCalendar.ownerId,
                title: currentTitle,
                color: currentColor,
                timeZone: sharedCalendar.timeZone,
                recipients: try await currentRecipients(
                    for: sharedCalendar,
                    session: session
                ),
                expectedUpdatedAt: sharedCalendar.updatedAt,
                session: session
            )
            metadataUpdatedAt = saved.updatedAt
        }
        if mayUploadEvents {
            eventsUpdatedAt = try await CloudCalendarsAPI.saveICloudCalendarEvents(
                calendarId: sharedCalendar.calendarId,
                ownerId: sharedCalendar.ownerId,
                events: events,
                windowStart: range.start,
                windowEnd: range.end,
                expectedUpdatedAt: sharedCalendar.eventsUpdatedAt,
                session: session
            )
        }

        var baselines = syncBaselines
        baselines[sharedCalendar.id] = SyncBaseline(
            eventFingerprint: currentEventFingerprint,
            title: mayUploadMetadata ? currentTitle : sharedCalendar.title,
            color: mayUploadMetadata ? currentColor : sharedCalendar.color.uppercased(),
            metadataUpdatedAt: metadataUpdatedAt,
            eventsUpdatedAt: eventsUpdatedAt
        )
        syncBaselines = baselines
        return UploadResult(
            metadataUploaded: mayUploadMetadata,
            eventsUploaded: mayUploadEvents
        )
    }

    private static func currentRecipients(
        for sharedCalendar: CloudCalendarsAPI.SharedICloudCalendar,
        session: CloudCalendarsAPI.Session
    ) async throws -> [(email: String, access: CloudCalendarsAPI.EventAccess)] {
        let sharing = try await CloudCalendarsAPI.iCloudCalendarSharing(
            calendarId: sharedCalendar.calendarId,
            ownerId: sharedCalendar.ownerId,
            session: session
        )
        return sharing.recipients.map { (email: $0.email, access: $0.access) }
    }

    private static func setAccess(
        _ access: CloudCalendarsAPI.EventAccess,
        shareID: String
    ) -> Bool {
        var values = accessByShareID
        let rawValue = access.rawValue
        guard values[shareID] != rawValue else { return false }
        values[shareID] = rawValue
        accessByShareID = values
        return true
    }

    private static func setSyncBaseline(
        for sharedCalendar: CloudCalendarsAPI.SharedICloudCalendar,
        in eventStore: EKEventStore
    ) {
        let localCalendar = localCalendar(for: sharedCalendar, in: eventStore)
        let localEvents: [CloudCalendarsAPI.SharedICloudCalendarEvent]
        if let localCalendar {
            let range = syncWindow()
            localEvents = portableEvents(
                for: sharedCalendar,
                localCalendar: localCalendar,
                in: eventStore,
                windowStart: range.start,
                windowEnd: range.end
            )
        } else {
            localEvents = sharedCalendar.events ?? []
        }
        var baselines = syncBaselines
        baselines[sharedCalendar.id] = SyncBaseline(
            // EventKit normalizes fields such as availability and structured
            // location differently per store. Baseline the local result after
            // applying the server snapshot, otherwise two devices can upload
            // semantically identical JSON forever.
            eventFingerprint: eventFingerprint(localEvents),
            title: localCalendar?.title ?? sharedCalendar.title,
            color: localCalendar.map { colorHex($0.cgColor) }
                ?? (localColorOverrides[sharedCalendar.id]
                    ?? sharedCalendar.color).uppercased(),
            metadataUpdatedAt: sharedCalendar.updatedAt,
            eventsUpdatedAt: sharedCalendar.eventsUpdatedAt
        )
        syncBaselines = baselines
    }

    private static func syncWindow() -> (start: Date, end: Date) {
        let calendar = Calendar.current
        return (
            calendar.date(byAdding: .year, value: -1, to: Date()) ?? Date(),
            calendar.date(byAdding: .year, value: 3, to: Date()) ?? Date()
        )
    }

    private static func portableOwnedEvents(
        _ localEvents: [EKEvent],
        shareID: String
    ) -> [CloudCalendarsAPI.SharedICloudCalendarEvent] {
        var allMappings = eventIdentifiers
        var mapping = allMappings[shareID] ?? [:]
        let remoteIDByLocalIdentifier = Dictionary(
            uniqueKeysWithValues: mapping.map { ($0.value, $0.key) }
        )
        let events = localEvents.compactMap { event -> CloudCalendarsAPI.SharedICloudCalendarEvent? in
            let localIdentifier = event.eventIdentifier
                ?? event.calendarItemIdentifier
            let existingRemoteID = remoteIDByLocalIdentifier[localIdentifier]
            guard let portable = portableEvent(
                event,
                eventID: existingRemoteID
            ) else { return nil }
            mapping[portable.id] = localIdentifier
            return portable
        }.sorted {
            if $0.start == $1.start { return $0.id < $1.id }
            return $0.start < $1.start
        }
        allMappings[shareID] = mapping
        eventIdentifiers = allMappings
        return events
    }

    private static func reconcileOwnedCalendar(
        shareID: String,
        sharing: CloudCalendarsAPI.ICloudCalendarSharing,
        localCalendar: EKCalendar,
        eventStore: EKEventStore,
        applyMetadata: Bool,
        applyEvents: Bool
    ) throws -> Bool {
        var changed = false
        if applyMetadata {
            let remoteColor = uiColor(sharing.color)
            if localCalendar.title != sharing.title
                || !colorsMatch(localCalendar.cgColor, remoteColor.cgColor) {
                localCalendar.title = sharing.title
                localCalendar.cgColor = remoteColor.cgColor
                try eventStore.saveCalendar(localCalendar, commit: true)
                changed = true
            }
        }

        if applyEvents {
            let remote = CloudCalendarsAPI.SharedICloudCalendar(
                id: shareID,
                ownerId: sharing.ownerId ?? "",
                ownerEmail: sharing.ownerEmail,
                calendarId: shareID,
                title: sharing.title,
                color: sharing.color,
                timeZone: sharing.timeZone,
                access: .owner,
                invitedAt: nil,
                updatedAt: sharing.updatedAt,
                events: sharing.events,
                eventsUpdatedAt: sharing.eventsUpdatedAt,
                windowStart: sharing.windowStart,
                windowEnd: sharing.windowEnd,
                revokedAt: nil,
                revokedReason: nil
            )
            changed = try reconcileEvents(
                remote,
                into: localCalendar,
                eventStore: eventStore
            ) || changed
        }
        return changed
    }

    private static func setOwnedSyncBaseline(
        shareID: String,
        sharing: CloudCalendarsAPI.ICloudCalendarSharing,
        localCalendar: EKCalendar,
        eventStore: EKEventStore,
        windowStart: Date,
        windowEnd: Date
    ) {
        let predicate = eventStore.predicateForEvents(
            withStart: windowStart,
            end: windowEnd,
            calendars: [localCalendar]
        )
        let events = portableOwnedEvents(
            eventStore.events(matching: predicate),
            shareID: shareID
        )
        var baselines = ownedSyncBaselines
        baselines[shareID] = SyncBaseline(
            eventFingerprint: eventFingerprint(events),
            title: localCalendar.title,
            color: colorHex(localCalendar.cgColor),
            metadataUpdatedAt: sharing.updatedAt,
            eventsUpdatedAt: sharing.eventsUpdatedAt
        )
        ownedSyncBaselines = baselines
    }

    private static func portableEvents(
        for sharedCalendar: CloudCalendarsAPI.SharedICloudCalendar,
        localCalendar: EKCalendar,
        in eventStore: EKEventStore,
        windowStart: Date,
        windowEnd: Date
    ) -> [CloudCalendarsAPI.SharedICloudCalendarEvent] {
        var allMappings = eventIdentifiers
        var mapping = allMappings[sharedCalendar.id] ?? [:]
        let remoteIDByLocalIdentifier = Dictionary(
            uniqueKeysWithValues: mapping.map { ($0.value, $0.key) }
        )
        let predicate = eventStore.predicateForEvents(
            withStart: windowStart,
            end: windowEnd,
            calendars: [localCalendar]
        )
        let portable: [CloudCalendarsAPI.SharedICloudCalendarEvent] = eventStore
            .events(matching: predicate)
            .compactMap { event -> CloudCalendarsAPI.SharedICloudCalendarEvent? in
                let localIdentifier = event.eventIdentifier ?? event.calendarItemIdentifier
                let remoteID = remoteIDByLocalIdentifier[localIdentifier]
                guard let item = portableEvent(event, eventID: remoteID) else { return nil }
                mapping[item.id] = localIdentifier
                return item
            }
        let events = portable.sorted {
            if $0.start == $1.start { return $0.id < $1.id }
            return $0.start < $1.start
        }
        allMappings[sharedCalendar.id] = mapping
        eventIdentifiers = allMappings
        return events
    }

    private static func eventFingerprint(
        _ events: [CloudCalendarsAPI.SharedICloudCalendarEvent]
    ) -> String {
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.sortedKeys]
        let sorted = events.sorted {
            if $0.start == $1.start { return $0.id < $1.id }
            return $0.start < $1.start
        }
        guard let data = try? encoder.encode(sorted) else { return "" }
        return SHA256.hash(data: data)
            .map { String(format: "%02x", $0) }
            .joined()
    }

    @discardableResult
    private static func setRevoked(_ revoked: Bool, shareID: String) -> Bool {
        var values = revokedShareIDs
        let changed: Bool
        if revoked {
            changed = values.insert(shareID).inserted
        } else {
            changed = values.remove(shareID) != nil
        }
        if changed { revokedShareIDs = values }
        return changed
    }

    private static func portableEvent(
        _ event: EKEvent,
        eventID explicitEventID: String? = nil
    ) -> CloudCalendarsAPI.SharedICloudCalendarEvent? {
        guard let title = event.title?.trimmingCharacters(in: .whitespacesAndNewlines),
              !title.isEmpty,
              let start = event.startDate,
              let end = event.endDate
        else { return nil }
        let rawIdentifier = event.eventIdentifier ?? event.calendarItemIdentifier
        let eventID = explicitEventID ?? SHA256.hash(data: Data(rawIdentifier.utf8))
            .map { String(format: "%02x", $0) }
            .joined()
        return .init(
            id: eventID,
            title: title,
            start: ISO8601DateFormatter().string(from: start),
            end: ISO8601DateFormatter().string(from: end),
            allDay: event.isAllDay,
            location: event.location,
            url: EventShareIdentity.shareableURL(from: event)?.absoluteString,
            details: SharedEventDetails(event: event)
        )
    }

    private static func reconcileEvents(
        _ sharedCalendar: CloudCalendarsAPI.SharedICloudCalendar,
        into localCalendar: EKCalendar,
        eventStore: EKEventStore
    ) throws -> Bool {
        var allMappings = eventIdentifiers
        var mapping = allMappings[sharedCalendar.id] ?? [:]
        let remoteEvents = sharedCalendar.events ?? []
        let remoteIDs = Set(remoteEvents.map(\.id))
        var changed = false

        for remote in remoteEvents {
            guard let start = remote.startDate, let end = remote.endDate else { continue }
            let event: EKEvent
            if let identifier = mapping[remote.id],
               let existing = eventStore.event(withIdentifier: identifier) {
                event = existing
            } else {
                event = EKEvent(eventStore: eventStore)
                event.calendar = localCalendar
            }

            var eventChanged = event.eventIdentifier == nil
            if event.calendar?.calendarIdentifier != localCalendar.calendarIdentifier {
                event.calendar = localCalendar
                eventChanged = true
            }
            if event.title != remote.title { event.title = remote.title; eventChanged = true }
            if event.startDate == nil || abs(event.startDate.timeIntervalSince(start)) >= 0.5 {
                event.startDate = start
                eventChanged = true
            }
            let safeEnd = max(start, end)
            if event.endDate == nil || abs(event.endDate.timeIntervalSince(safeEnd)) >= 0.5 {
                event.endDate = safeEnd
                eventChanged = true
            }
            if event.isAllDay != remote.allDay { event.isAllDay = remote.allDay; eventChanged = true }
            if normalized(event.location) != normalized(remote.location) {
                event.location = normalized(remote.location).isEmpty ? nil : remote.location
                eventChanged = true
            }
            let remoteURL = remote.url.flatMap(URL.init(string:))
            if event.url != remoteURL { event.url = remoteURL; eventChanged = true }
            if let details = remote.details,
               !details.matchesWritableFields(
                    of: event,
                    canonicalLocation: remote.location
               ) {
                details.applyWritableFields(
                    to: event,
                    canonicalLocation: remote.location
                )
                eventChanged = true
            }

            if eventChanged {
                try eventStore.save(event, span: .thisEvent, commit: true)
                changed = true
            }
            if let identifier = event.eventIdentifier, mapping[remote.id] != identifier {
                mapping[remote.id] = identifier
            }
        }

        if let windowStart = sharedCalendar.windowStartDate,
           let windowEnd = sharedCalendar.windowEndDate {
            for (remoteID, localIdentifier) in Array(mapping) where !remoteIDs.contains(remoteID) {
                guard let localEvent = eventStore.event(withIdentifier: localIdentifier) else {
                    mapping.removeValue(forKey: remoteID)
                    continue
                }
                if localEvent.startDate < windowEnd && localEvent.endDate > windowStart {
                    try eventStore.remove(localEvent, span: .thisEvent, commit: true)
                    mapping.removeValue(forKey: remoteID)
                    changed = true
                }
            }

            // Reader is a server-backed, read-only mirror. EventKit calendars
            // themselves cannot be marked read-only, so remove any unmatched
            // local event that another app managed to create in that mirror.
            // Writer/Owner events are intentionally kept and uploaded by the
            // next foreground sync.
            if sharedCalendar.access == .reader || sharedCalendar.isRevoked {
                let mappedLocalIdentifiers = Set(mapping.values)
                let predicate = eventStore.predicateForEvents(
                    withStart: windowStart,
                    end: windowEnd,
                    calendars: [localCalendar]
                )
                for localEvent in eventStore.events(matching: predicate) {
                    let identifier = localEvent.eventIdentifier
                        ?? localEvent.calendarItemIdentifier
                    guard !mappedLocalIdentifiers.contains(identifier) else { continue }
                    try eventStore.remove(localEvent, span: .thisEvent, commit: true)
                    changed = true
                }
            }
        }

        allMappings[sharedCalendar.id] = mapping
        eventIdentifiers = allMappings
        return changed
    }

    private static func uiColor(_ hex: String) -> UIColor {
        let raw = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        guard raw.count == 6, let value = UInt64(raw, radix: 16) else {
            return .systemBlue
        }
        return UIColor(
            red: CGFloat((value >> 16) & 0xFF) / 255,
            green: CGFloat((value >> 8) & 0xFF) / 255,
            blue: CGFloat(value & 0xFF) / 255,
            alpha: 1
        )
    }

    private static func colorHex(_ color: CGColor?) -> String {
        let color = UIColor(cgColor: color ?? UIColor.systemBlue.cgColor)
        var red: CGFloat = 0
        var green: CGFloat = 0
        var blue: CGFloat = 0
        var alpha: CGFloat = 0
        guard color.getRed(&red, green: &green, blue: &blue, alpha: &alpha) else {
            return "#0088FF"
        }
        return String(
            format: "#%02X%02X%02X",
            Int((red * 255).rounded()),
            Int((green * 255).rounded()),
            Int((blue * 255).rounded())
        )
    }

    private static func normalized(_ value: String?) -> String {
        value?.trimmingCharacters(in: .whitespacesAndNewlines) ?? ""
    }

    private static func colorsMatch(_ first: CGColor?, _ second: CGColor) -> Bool {
        guard let first else { return false }
        return UIColor(cgColor: first).isEqual(UIColor(cgColor: second))
    }
}

private enum SharedCalendarLocalError: LocalizedError {
    case noWritableSource
    case calendarUnavailable

    var errorDescription: String? {
        switch self {
        case .noWritableSource:
            "Couldn’t create the local backing calendar."
        case .calendarUnavailable:
            "The local shared calendar is not available yet."
        }
    }
}
