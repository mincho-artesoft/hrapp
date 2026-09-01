import Foundation
import Security

/// Owns the device's link to the sync service.
///
/// Sharing uses a dedicated Cloud Calendars identity. It is deliberately not
/// inferred from the Google/Microsoft accounts connected for calendar sync:
/// those are provider credentials, while this account owns App Clip shares and
/// must be recoverable after reinstalling the app.
/// Isolated to the main actor rather than marked `nonisolated(unsafe)`: two
/// share sheets opened at once would otherwise race to establish the session
/// and register two calendars for the same person.
@MainActor
enum CalendarFeedSession {
    enum SessionError: LocalizedError {
        case signInRequired
        case emailRequired

        var errorDescription: String? {
            switch self {
            case .signInRequired:
                NSLocalizedString(
                    "Sign in with Google, Apple, or Microsoft to share and receive synced events.",
                    comment: "Cloud account required error"
                )
            case .emailRequired:
                NSLocalizedString(
                    "Share a verified email during sign-in to use synced events and invitations.",
                    comment: "Verified email required error"
                )
            }
        }
    }

    private static let keychainService = "com.cloudcalendars.feedsession"
    private static let keychainAccount = "session"

    private static var cached: CloudCalendarsAPI.Session?

    /// Returns only an explicitly authenticated Cloud Calendars session.
    @discardableResult
    static func current() async throws -> CloudCalendarsAPI.Session {
        guard let session = existing else { throw SessionError.signInRequired }
        return session
    }

    /// The already-established session, if there is one. Used where a network
    /// round-trip would be wrong - drawing a share sheet, for instance.
    static var existing: CloudCalendarsAPI.Session? {
        let session = rawExisting
        guard let session,
              session.provider != nil,
              sessionHasVerifiedEmail(session)
        else { return nil }
        return session
    }

    private static var rawExisting: CloudCalendarsAPI.Session? {
        if let cached { return cached }
        guard let stored = loadFromKeychain() else { return nil }
        cached = stored
        return stored
    }

    static func forget() {
        cached = nil
        var query = baseQuery()
        query[kSecClass as String] = kSecClassGenericPassword
        SecItemDelete(query as CFDictionary)
    }

    /// Disconnects one provider while retaining the stable shared-events
    /// account through another linked recovery identity.
    @discardableResult
    static func disconnect(provider: String) async throws -> CloudCalendarsAPI.Session {
        guard let session = existing else { throw SessionError.signInRequired }
        let updated = try await CloudCalendarsAPI.unlinkIdentity(
            provider: provider,
            session: session
        )
        guard sessionHasVerifiedEmail(updated) else { throw SessionError.emailRequired }
        store(updated)
        return updated
    }

    // MARK: - Authentication

    /// Resolves or links one dedicated app identity. The current session is
    /// always sent: on first login it claims a legacy anonymous calendar; on
    /// later logins it links another provider to the same stable owner.
    @discardableResult
    static func authenticate(
        provider: String,
        token: String,
        name: String? = nil
    ) async throws -> CloudCalendarsAPI.Session {
        let feedName = name
            ?? NSLocalizedString("Invites", comment: "Default name of the shared-events feed")
        let currentSession = rawExisting
        let resolved: CloudCalendarsAPI.Session
        do {
            resolved = try await CloudCalendarsAPI.resolve(
                provider: provider,
                token: token,
                linkingTo: currentSession,
                name: feedName
            )
        } catch CloudCalendarsAPI.Failure.http(let code, let body)
            where code == 422 && body.contains("email_required") {
            throw SessionError.emailRequired
        }
        var identitiesByProvider: [String: CloudCalendarsAPI.AccountIdentity] = [:]
        for identity in currentSession?.identities ?? [] {
            identitiesByProvider[identity.provider] = identity
        }
        if let oldProvider = currentSession?.provider {
            identitiesByProvider[oldProvider] = .init(
                provider: oldProvider,
                email: currentSession?.email
            )
        }
        for identity in resolved.identities ?? [] {
            identitiesByProvider[identity.provider] = identity
        }
        identitiesByProvider[provider] = .init(
            provider: provider,
            email: resolved.email ?? identitiesByProvider[provider]?.email
        )
        guard let providerIdentity = identitiesByProvider[provider],
              validEmail(providerIdentity.email)
        else {
            throw SessionError.emailRequired
        }

        let authenticated = CloudCalendarsAPI.Session(
            calendarId: resolved.calendarId,
            deviceToken: resolved.deviceToken,
            feedId: resolved.feedId,
            feedUrl: resolved.feedUrl,
            email: resolved.email,
            provider: resolved.provider ?? provider,
            ownerId: resolved.ownerId,
            identities: identitiesByProvider.values.sorted { $0.provider < $1.provider }
        )
        store(authenticated)
        return authenticated
    }

    static func validEmail(_ value: String?) -> Bool {
        guard let value else { return false }
        let parts = value.trimmingCharacters(in: .whitespacesAndNewlines).split(separator: "@")
        return parts.count == 2 && parts.allSatisfy { !$0.isEmpty } && parts[1].contains(".")
    }

    private static func sessionHasVerifiedEmail(_ session: CloudCalendarsAPI.Session) -> Bool {
        if validEmail(session.email) { return true }
        return (session.identities ?? []).contains { validEmail($0.email) }
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
