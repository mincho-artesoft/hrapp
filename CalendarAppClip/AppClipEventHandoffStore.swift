import Foundation

enum AppClipEventHandoffStore {
    private static let appGroupIdentifier = "group.ARTE-SOFT.sandBOX"
    private static let pendingURLKey = "sharedEventImport.pendingURL"
    private static let storedAtKey = "sharedEventImport.pendingURL.storedAt"

    static func save(_ url: URL) {
        guard let defaults = UserDefaults(suiteName: appGroupIdentifier) else { return }
        defaults.set(url.absoluteString, forKey: pendingURLKey)
        defaults.set(Date(), forKey: storedAtKey)
    }
}
