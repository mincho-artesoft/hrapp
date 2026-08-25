import Foundation
import Security

/// Owns the device's link to the sync service.
///
/// The session is established lazily - nothing is registered until the user
/// actually shares something, so a person who never shares never appears on the
/// server at all.
///
/// When a Google or Microsoft account is signed in, the session is resolved
/// from that identity, which is what makes the same feed appear on every device
/// the person owns without asking them to sign in to anything new. Without such
/// an account the session is anonymous and reachable only from this device.
/// Isolated to the main actor rather than marked `nonisolated(unsafe)`: two
/// share sheets opened at once would otherwise race to establish the session
/// and register two calendars for the same person.
@MainActor
enum CalendarFeedSession {
    private static let keychainService = "com.cloudcalendars.feedsession"
    private static let keychainAccount = "session"

    private static var cached: CloudCalendarsAPI.Session?

    /// Returns the session, establishing it on first use.
    @discardableResult
    static func current() async throws -> CloudCalendarsAPI.Session {
        if let cached { return cached }
        if let stored = loadFromKeychain() {
            cached = stored
            return stored
        }

        let session = try await establish()
        store(session)
        return session
    }

    /// The already-established session, if there is one. Used where a network
    /// round-trip would be wrong - drawing a share sheet, for instance.
    static var existing: CloudCalendarsAPI.Session? {
        cached ?? loadFromKeychain()
    }

    static func forget() {
        cached = nil
        var query = baseQuery()
        query[kSecClass as String] = kSecClassGenericPassword
        SecItemDelete(query as CFDictionary)
    }

    // MARK: - Establishing

    private static func establish() async throws -> CloudCalendarsAPI.Session {
        let name = NSLocalizedString("Invites", comment: "Default name of the shared-events feed")

        // A provider token proves the caller controls that account, which is
        // what lets the server hand back the *same* calendar on every device.
        for identity in providerIdentities() {
            do {
                return try await CloudCalendarsAPI.resolve(
                    provider: identity.provider,
                    token: identity.token,
                    name: name
                )
            } catch {
                // An expired token is the common case here and it is not fatal:
                // fall through to the next account, and to anonymous after that.
                print("Feed session: \(identity.provider) resolve failed - \(error.localizedDescription)")
                continue
            }
        }

        return try await CloudCalendarsAPI.register(name: name)
    }

    private struct ProviderIdentity {
        let provider: String
        let token: String
    }

    private static func providerIdentities() -> [ProviderIdentity] {
        var identities: [ProviderIdentity] = []

        for user in CalendarViewModel.shared.storedUsers {
            if let idToken = user.idToken, !idToken.isEmpty {
                identities.append(ProviderIdentity(provider: "google", token: idToken))
            }
        }

        // Microsoft is verified by calling Graph rather than by checking a
        // signature, so the access token is what the server needs.
        for user in CalendarViewModel.shared.storedMsUsers where !user.accessToken.isEmpty {
            identities.append(ProviderIdentity(provider: "microsoft", token: user.accessToken))
        }

        return identities
    }

    /// Attaches a newly signed-in account to the calendar this device already
    /// owns, rather than letting it resolve to a second one.
    static func link(provider: String, token: String) async throws {
        guard let session = existing else {
            _ = try await current()
            return
        }
        let linked = try await CloudCalendarsAPI.resolve(
            provider: provider,
            token: token,
            linkingTo: session
        )
        store(linked)
    }

    // MARK: - Keychain
    //
    // The device token is a bearer credential for someone's calendar, so it
    // belongs in the keychain rather than in UserDefaults - and with
    // ThisDeviceOnly, because a token restored onto a second device from a
    // backup would have both of them writing as the same client.

    private static func baseQuery() -> [String: Any] {
        [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: keychainService,
            kSecAttrAccount as String: keychainAccount
        ]
    }

    private static func store(_ session: CloudCalendarsAPI.Session) {
        cached = session
        guard let data = try? JSONEncoder().encode(session) else { return }

        var query = baseQuery()
        SecItemDelete(query as CFDictionary)
        query[kSecValueData as String] = data
        query[kSecAttrAccessible as String] = kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly
        SecItemAdd(query as CFDictionary, nil)
    }

    private static func loadFromKeychain() -> CloudCalendarsAPI.Session? {
        var query = baseQuery()
        query[kSecReturnData as String] = true
        query[kSecMatchLimit as String] = kSecMatchLimitOne

        var item: CFTypeRef?
        guard SecItemCopyMatching(query as CFDictionary, &item) == errSecSuccess,
              let data = item as? Data
        else { return nil }

        return try? JSONDecoder().decode(CloudCalendarsAPI.Session.self, from: data)
    }
}
