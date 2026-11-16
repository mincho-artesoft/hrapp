import Foundation
import Security
import UIKit
import UserNotifications

/// One private installation identity, independently bound to the signed-in
/// Cloud Calendars account. Provider calendar accounts are never used here.
@MainActor
final class InvitationPushRegistration {
    static let shared = InvitationPushRegistration()

    private struct Installation: Codable {
        var id: String
        var secret: String
        var revision: Int
        var lastToken: String?
        var registered: Bool = false
    }

    private var installation: Installation?
    private var deviceToken: String?
    private var syncTask: Task<Void, Never>?
    private var needsSync = false
    private var signingOut = false
    private(set) var remoteInvitationsEnabled = false
    private(set) var lastError: String?

    #if DEBUG
    var auditStatus: [String: Any] {
        ["hasAPNsToken": deviceToken != nil, "remoteInvitationsEnabled": remoteInvitationsEnabled,
         "lastError": lastError ?? "", "environment": Self.environment]
    }
    #endif

    private init() {}

    func start() {
        // Always ask APNs for a current token. A token saved for sign-out cleanup
        // is never treated as a successful registration for this launch.
        UIApplication.shared.registerForRemoteNotifications()
        requestSync()
    }

    func received(token: Data) {
        deviceToken = token.map { String(format: "%02x", $0) }.joined()
        lastError = nil
        print("[InvitationPush] APNs device registration succeeded")
        requestSync()
    }

    func failedToRegister() {
        remoteInvitationsEnabled = false
        lastError = "APNs registration failed"
        print("[InvitationPush] APNs registration failed; foreground fallback remains available")
    }

    func requestSync() {
        needsSync = true
        Task { await synchronize() }
    }

    func synchronize() async {
        if let syncTask { await syncTask.value; return }
        guard !signingOut else { return }
        needsSync = true
        let task = Task { @MainActor in
            while self.needsSync && !self.signingOut {
                self.needsSync = false
                await self.syncOnce()
            }
        }
        syncTask = task
        await task.value
        syncTask = nil
    }

    private func syncOnce() async {
        guard let token = deviceToken, let session = CalendarFeedSession.existing else {
            remoteInvitationsEnabled = false
            return
        }
        let settings = await UNUserNotificationCenter.current().notificationSettings()
        let authorized = settings.authorizationStatus == .authorized
            || settings.authorizationStatus == .provisional
            || settings.authorizationStatus == .ephemeral
        let enabled = authorized && PendingEventInvitationManager.shared.invitationNotificationsEnabled
        do {
            var state = try loadInstallation()
            state.lastToken = token
            state.revision += 1
            try save(state)
            let remote = try await CloudCalendarsAPI.registerInvitationPush(
                installationId: state.id, secret: state.secret, revision: state.revision,
                token: token, environment: Self.environment, enabled: enabled, session: session
            )
            state.registered = true
            try save(state)
            remoteInvitationsEnabled = remote
            lastError = nil
            print("[InvitationPush] Server registration complete; remote invitations: \(remote)")
        } catch {
            // Keep the previous remote state on a transient refresh error to
            // avoid doubling a push with the foreground polling notification.
            lastError = "Push registration could not reach the server"
            print("[InvitationPush] Server registration requires retry")
        }
    }

    /// Finish deregistration before forgetting the account. Otherwise a closed
    /// app could still disclose the previous user's invitation on this phone.
    func prepareForSignOut(session: CloudCalendarsAPI.Session?) async throws {
        signingOut = true
        defer { signingOut = false }
        if let syncTask { await syncTask.value }
        guard let session else { remoteInvitationsEnabled = false; return }
        var state = try loadInstallation()
        guard state.registered, let token = state.lastToken else { return }
        state.revision += 1
        try save(state)
        _ = try await CloudCalendarsAPI.registerInvitationPush(
            installationId: state.id, secret: state.secret, revision: state.revision,
            token: token, environment: Self.environment, enabled: false, session: session
        )
        state.registered = false
        try save(state)
        remoteInvitationsEnabled = false
    }

    private static var environment: String {
        // Simulator and development builds use Apple's sandbox, not live APNs.
        #if DEBUG || targetEnvironment(simulator)
        "sandbox"
        #else
        "production"
        #endif
    }

    private func storageURL() throws -> URL {
        let support = try FileManager.default.url(for: .applicationSupportDirectory,
            in: .userDomainMask, appropriateFor: nil, create: true)
        return support.appendingPathComponent("InvitationPushInstallation.json")
    }

    private func loadInstallation() throws -> Installation {
        if let installation { return installation }
        let url = try storageURL()
        if FileManager.default.fileExists(atPath: url.path) {
            let stored = try JSONDecoder().decode(Installation.self, from: Data(contentsOf: url))
            installation = stored
            return stored
        }
        var bytes = [UInt8](repeating: 0, count: 32)
        guard SecRandomCopyBytes(kSecRandomDefault, bytes.count, &bytes) == errSecSuccess else {
            throw CocoaError(.fileWriteUnknown)
        }
        let created = Installation(id: UUID().uuidString, secret: bytes.map { String(format: "%02x", $0) }.joined(), revision: 0)
        try save(created)
        return created
    }

    private func save(_ state: Installation) throws {
        var url = try storageURL()
        try JSONEncoder().encode(state).write(to: url, options: [.atomic, .completeFileProtectionUntilFirstUserAuthentication])
        var values = URLResourceValues()
        values.isExcludedFromBackup = true
        try url.setResourceValues(values)
        installation = state
    }
}
