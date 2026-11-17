import Foundation
import EventKit

extension CalendarViewModel {
    var hiddenLegacyProviderCalendarIDs: Set<String> {
        Set(UserDefaults.standard.stringArray(forKey: "providerCalendar.retiredEventKitMirrors.v1") ?? [])
    }
    func hideLegacyProviderCalendars(for userID: UUID, provider: String) {
        let old = provider == "google" ? googleToLocalCalendarMap(for: userID) : msToLocalCalendarMap(for: userID)
        UserDefaults.standard.set(Array(hiddenLegacyProviderCalendarIDs.union(old.values)), forKey: "providerCalendar.retiredEventKitMirrors.v1")
        selectedCalendarIDs.subtract(old.values)
        reloadCalendars()
    }
    func providerCalendars(provider: String, identity: String) -> [AppLocalCalendarRecord] {
        AppLocalProviderCalendarStore.shared.calendars(accountID: AppLocalProviderCalendarStore.accountID(provider: provider, identity: identity))
    }
    func syncLocalProvider(provider: String, identity: String, email: String, token: String, userID: UUID) async {
        guard !token.isEmpty else { return }
        let store = AppLocalProviderCalendarStore.shared
        let accountID = AppLocalProviderCalendarStore.accountID(provider: provider, identity: identity)
        let oldMap = provider == "google" ? googleToLocalCalendarMap(for: userID) : msToLocalCalendarMap(for: userID)
        let previousIDs = Set(store.calendars(accountID: accountID).map(\.id))
        do {
            let legacy = try legacyProviderEdits(provider: provider, userID: userID, calendars: oldMap)
            try await store.sync(.init(id: accountID, provider: provider, email: email, accessToken: token), legacy: legacy)
            for calendar in store.calendars(accountID: accountID) where !previousIDs.contains(calendar.id) {
                if let remoteID = store.engine.remoteCalendarID(for: calendar.id), let oldID = oldMap[remoteID] {
                    if selectedCalendarIDs.contains(oldID) { selectedCalendarIDs.insert(calendar.id) }
                } else { selectedCalendarIDs.insert(calendar.id) }
            }
            hideLegacyProviderCalendars(for: userID, provider: provider)
            providerSyncError = nil
        } catch { providerSyncError = error.localizedDescription }
    }
    private func legacyProviderEdits(provider: String, userID: UUID, calendars: [String: String]) throws -> [String: [ProviderCalendarSyncEngine.LegacyEvent]] {
        guard isCalendarAccessGranted() else { return [:] }
        let adapter = DeviceEventKitAdapter(store: eventStore)
        let eventMap = provider == "google" ? googleToLocalEventMap(for: userID) : msToLocalEventMap(for: userID)
        let lastSync = UserDefaults.standard.object(forKey: (provider == "google" ? "LastSyncDateKey_" : "MsLastSyncDateKey_") + userID.uuidString) as? Date
        var edits: [String: [ProviderCalendarSyncEngine.LegacyEvent]] = [:]
        var backup: [DeviceCalendarDocument] = []
        for (remoteID, localID) in calendars where !hiddenLegacyProviderCalendarIDs.contains(localID) {
            guard let calendar = eventStore.calendar(withIdentifier: localID) else { continue }
            let events = adapter.events(in: calendar)
            backup.append(DeviceCalendarDocument(id: localID, deviceId: DeviceCalendarReplica.deviceID, deviceName: "iOS migration",
                title: calendar.title, source: calendar.source.title, color: "#2168DE", allowsChanges: calendar.allowsContentModifications,
                events: events.map(adapter.snapshot)))
            edits[remoteID] = events.compactMap { event in
                let remoteEventID = eventMap.first { $0.value == event.eventIdentifier }?.key
                    ?? (provider == "google" ? extractGoogleEventID(event) : extractMsEventID(from: event))
                // Only migrate edits made after the last completed old sync;
                // never overwrite fresh server data with an untracked old mirror.
                guard remoteEventID == nil || (lastSync != nil && (event.lastModifiedDate ?? .distantPast) > lastSync!) else { return nil }
                var snapshot = adapter.snapshot(event)
                if ["gcal", "mscal", "cloudcalendars"].contains(event.url?.scheme ?? "") { snapshot.url = nil }
                snapshot.updatedAt = event.lastModifiedDate.map(DeviceCalendarEvent.iso)
                return .init(remoteID: remoteEventID, snapshot: snapshot)
            }
        }
        if !backup.isEmpty {
            let url = AppLocalCalendarStore.shared.fileURL.deletingLastPathComponent().appendingPathComponent("provider-migration-" + provider + "-" + userID.uuidString + ".json")
            // Preserve original EventKit data as well as the untouched calendars.
            if !FileManager.default.fileExists(atPath: url.path) { try JSONEncoder().encode(backup).write(to: url, options: .atomic) }
        }
        return edits
    }
}
