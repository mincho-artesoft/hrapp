import Foundation

/// Received copies belong to the Cloud Calendars account that accepted them.
/// Only visibility changes on sign-out; source data, unsent edits, owned shares
/// and independent Google/Microsoft calendar connections are preserved.
enum ReceivedSharingVisibility {
    #if DEBUG
    private static let namespace = "receivedSharingVisibility.debug.v1."
    #else
    private static let namespace = "receivedSharingVisibility.v1."
    #endif

    // Event rendering calls this for every occurrence. Read preferences once,
    // then use a locked in-memory snapshot instead of decoding them per event.
    private final class Cache: @unchecked Sendable {
        let lock = NSLock()
        var snapshots: [ObjectIdentifier: Snapshot] = [:]
    }
    private struct Snapshot {
        var active: String?
        var owners: [String: [String: [String]]]
        init(_ defaults: UserDefaults) {
            active = defaults.string(forKey: namespace + "active")
            owners = [:]
            for kind in ["calendar", "event"] {
                owners[kind] = defaults.dictionary(forKey: namespace + kind) as? [String: [String]] ?? [:]
            }
        }
    }
    private static let cache = Cache()

    static func activate(accountID: String?, defaults: UserDefaults = .standard) {
        cache.lock.withLock {
            let key = ObjectIdentifier(defaults)
            var snapshot = cache.snapshots[key] ?? Snapshot(defaults)
            snapshot.active = accountID
            cache.snapshots[key] = snapshot
            if let accountID { defaults.set(accountID, forKey: namespace + "active") }
            else { defaults.removeObject(forKey: namespace + "active") }
        }
    }

    static func register(_ ids: Set<String>, kind: String, accountID: String,
                         onlyUnscoped: Bool = false, defaults: UserDefaults = .standard) {
        guard !ids.isEmpty else { return }
        cache.lock.withLock {
            let key = ObjectIdentifier(defaults)
            var snapshot = cache.snapshots[key] ?? Snapshot(defaults)
            var owners = snapshot.owners[kind] ?? [:]
            var changed = false
            for id in ids {
                if onlyUnscoped && owners[id] != nil { continue }
                var accounts = Set(owners[id] ?? [])
                if accounts.insert(accountID).inserted { owners[id] = accounts.sorted(); changed = true }
            }
            snapshot.owners[kind] = owners
            cache.snapshots[key] = snapshot
            if changed { defaults.set(owners, forKey: namespace + kind) }
        }
    }

    static func isVisible(_ id: String, kind: String, requiresAccount: Bool = false,
                          defaults: UserDefaults = .standard) -> Bool {
        cache.lock.withLock {
            let key = ObjectIdentifier(defaults)
            let snapshot = cache.snapshots[key] ?? Snapshot(defaults)
            cache.snapshots[key] = snapshot
            guard let accounts = snapshot.owners[kind]?[id] else { return !requiresAccount }
            guard let active = snapshot.active else { return false }
            return accounts.contains(active)
        }
    }
}
