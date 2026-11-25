import Foundation

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
        case sessionStorageFailed

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
            case .sessionStorageFailed:
                NSLocalizedString(
                    "Cloud Calendars couldn’t save the session on this device. Please try again.",
                    comment: "Cloud account sandbox persistence error"
                )
            }
        }
    }

    private static let storageDirectoryName = "CloudCalendars"
    private static let storageFileName = "feed-session.json"

    private static var cached: CloudCalendarsAPI.Session?
    private static var didLoad = false

    static func isCurrent(_ session: CloudCalendarsAPI.Session) -> Bool {
        existing?.calendarId == session.calendarId && existing?.deviceToken == session.deviceToken
    }

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
              !appIdentities(in: session).isEmpty
        else { return nil }
        return session
    }

    private static var rawExisting: CloudCalendarsAPI.Session? {
        if !didLoad {
            didLoad = true
            cached = loadFromStorage()
            if let session = cached, session.provider != nil, appIdentities(in: session).isEmpty {
                // Web email recovery is not a native app login. Older builds
                // left this invisible identity active after the last Sign Out.
                #if os(iOS)
                InvitationPushRegistration.shared.prepareForSignOut(session: session)
                #endif
                forget()
            } else {
                ReceivedSharingVisibility.activate(accountID: cached.flatMap {
                    appIdentities(in: $0).isEmpty ? nil : $0.calendarId
                })
            }
        }
        return cached
    }

    static func forget() {
        // Invalidate memory before notifying any stores. A nil cache used to
        // reload the still-present file during synchronous store callbacks.
        didLoad = true
        cached = nil
        ReceivedSharingVisibility.activate(accountID: nil)
        WebStudioAuthenticatorStore.shared.clear()
        if let url = try? storageURL(createDirectory: false) {
            try? FileManager.default.removeItem(at: url)
        }
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
        guard isCurrent(session) else { throw CancellationError() }
        guard !appIdentities(in: updated).isEmpty else {
            #if os(iOS)
            InvitationPushRegistration.shared.prepareForSignOut(session: updated)
            #endif
            forget()
            return updated
        }
        try store(updated)
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
            ?? NSLocalizedString("Cloud Calendars", comment: "Account feed name")
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
        try Task.checkCancellation()
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
        try store(authenticated)
        #if os(iOS)
        Task { @MainActor in
            _ = await NativeCalendarSyncService.syncNow()
        }
        #endif
        return authenticated
    }

    static func validEmail(_ value: String?) -> Bool {
        guard let value else { return false }
        let parts = value.trimmingCharacters(in: .whitespacesAndNewlines).split(separator: "@")
        return parts.count == 2 && parts.allSatisfy { !$0.isEmpty } && parts[1].contains(".")
    }

    /// Only identities with a native Connect/Sign Out row keep this app signed
    /// in. The server can also return a web-only email recovery identity.
    static func appIdentities(in session: CloudCalendarsAPI.Session) -> [CloudCalendarsAPI.AccountIdentity] {
        let supported: Set<String> = ["apple", "google", "microsoft"]
        var identities: [String: CloudCalendarsAPI.AccountIdentity] = [:]
        // An explicit server list is authoritative; do not resurrect a provider
        // from the token's old primary identity after it has been disconnected.
        let candidates = session.identities ?? session.provider.map {
            [CloudCalendarsAPI.AccountIdentity(provider: $0, email: session.email)]
        } ?? []
        for identity in candidates where supported.contains(identity.provider) && validEmail(identity.email) {
            identities[identity.provider] = identity
        }
        return identities.values.sorted { $0.provider < $1.provider }
    }

    // MARK: - Device-local storage
    //
    // The sharing session deliberately does not use Keychain. It lives in the
    // app's private Application Support directory with iOS data protection and
    // therefore disappears on uninstall. A user can recover the server account
    // by signing in again with any linked identity.

    private static var storageAttributes: [FileAttributeKey: Any] {
        #if os(macOS)
        [.posixPermissions: 0o700]
        #else
        [.protectionKey: FileProtectionType.completeUntilFirstUserAuthentication]
        #endif
    }
    private static var storageWriteOptions: Data.WritingOptions {
        #if os(macOS)
        [.atomic]
        #else
        [.atomic, .completeFileProtectionUntilFirstUserAuthentication]
        #endif
    }

    private static func storageURL(createDirectory: Bool) throws -> URL {
        guard let root = FileManager.default.urls(
            for: .applicationSupportDirectory,
            in: .userDomainMask
        ).first else {
            throw SessionError.sessionStorageFailed
        }

        let directory = root.appendingPathComponent(
            storageDirectoryName,
            isDirectory: true
        )
        if createDirectory {
            do {
                try FileManager.default.createDirectory(
                    at: directory,
                    withIntermediateDirectories: true,
                    attributes: storageAttributes
                )
            } catch {
                throw SessionError.sessionStorageFailed
            }
        }
        return directory.appendingPathComponent(storageFileName, isDirectory: false)
    }

    private static func store(_ session: CloudCalendarsAPI.Session) throws {
        do {
            let data = try JSONEncoder().encode(session)
            let url = try storageURL(createDirectory: true)
            try data.write(
                to: url,
                options: storageWriteOptions
            )
        } catch {
            throw SessionError.sessionStorageFailed
        }

        // Never expose an in-memory authenticated account unless its session is
        // durably stored. Otherwise the UI would look connected only until the
        // next launch.
        cached = session
        didLoad = true
        ReceivedSharingVisibility.activate(accountID: session.calendarId)
    }

    private static func loadFromStorage() -> CloudCalendarsAPI.Session? {
        guard let url = try? storageURL(createDirectory: false),
              let data = try? Data(contentsOf: url)
        else { return nil }
        return try? JSONDecoder().decode(CloudCalendarsAPI.Session.self, from: data)
    }

    #if DEBUG
    /// Opt-in launch-time smoke test for the exact protected-file mechanism.
    static func runStorageSelfTest() -> Bool {
        do {
            let sessionURL = try storageURL(createDirectory: true)
            let probeURL = sessionURL
                .deletingLastPathComponent()
                .appendingPathComponent("storage-probe", isDirectory: false)
            let probe = Data("cloud-calendars-storage-probe".utf8)
            try probe.write(
                to: probeURL,
                options: storageWriteOptions
            )
            let loaded = try Data(contentsOf: probeURL)
            try FileManager.default.removeItem(at: probeURL)
            return loaded == probe
        } catch {
            return false
        }
    }
    #endif
}
