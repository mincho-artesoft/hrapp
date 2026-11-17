import Combine
import CryptoKit
import Foundation
import Security
import SwiftUI
#if os(macOS)
import AppKit
#else
import UIKit
#endif

struct WebAuthChallengePayload: Identifiable, Equatable {
    let challengeId: String
    var id: String { challengeId }

    init(challengeId: String) {
        self.challengeId = challengeId
    }

    init?(url: URL) {
        guard let components = URLComponents(url: url, resolvingAgainstBaseURL: false) else {
            return nil
        }

        let scheme = components.scheme?.lowercased() ?? ""
        let host = components.host?.lowercased() ?? ""
        let pathSegments = components.path
            .split(separator: "/")
            .map { $0.lowercased() }

        let isCustomScheme: Bool = {
            guard scheme == "cloudcalendars" else { return false }
            return host == "app-auth" || pathSegments.contains("app-auth")
        }()

        let isUniversalLink: Bool = {
            guard scheme == "https" || scheme == "http" else { return false }
            guard host == "www.cloud-calendars.com"
                || host == "cloud-calendars.com"
                || host == "api.cloud-calendars.com"
                || host == "localhost"
            else {
                return false
            }
            return pathSegments.last == "app-auth" || pathSegments.contains("app-auth")
        }()

        let isAPIChallenge = SharedInvitationServer.baseURL(for: url, route: "app-auth") != nil
        guard isCustomScheme || isUniversalLink || isAPIChallenge else { return nil }

        let rawChallenge = components.queryItems?
            .first(where: { $0.name == "c" || $0.name == "challenge" || $0.name == "challengeId" })?
            .value?
            .trimmingCharacters(in: .whitespacesAndNewlines) ?? ""

        guard rawChallenge.count >= 12,
              rawChallenge.count <= 64,
              rawChallenge.range(of: #"^[A-Za-z0-9_-]+$"#, options: .regularExpression) != nil
        else {
            return nil
        }

        self.challengeId = rawChallenge
    }
}

enum WebStudioTOTPGenerator {
    private static let alphabet = Array("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567")

    static func decodeBase32(_ encoded: String) -> Data? {
        let cleaned = encoded
            .uppercased()
            .filter { !$0.isWhitespace && $0 != "=" && $0 != "-" }
        guard !cleaned.isEmpty else { return nil }

        var lookup = [Character: UInt32]()
        for (idx, char) in alphabet.enumerated() {
            lookup[char] = UInt32(idx)
        }

        var bits = 0
        var buffer: UInt32 = 0
        var bytes = [UInt8]()
        bytes.reserveCapacity((cleaned.count * 5) / 8)

        for char in cleaned {
            guard let val = lookup[char] else { return nil }
            buffer = (buffer << 5) | val
            bits += 5
            if bits >= 8 {
                let shift = bits - 8
                bytes.append(UInt8((buffer >> shift) & 0xff))
                bits -= 8
            }
        }
        return Data(bytes)
    }

    static func code(
        secretBase32: String,
        at date: Date = Date(),
        periodSeconds: Int = 30,
        digits: Int = 6
    ) -> (formatted: String, raw: String, secondsRemaining: Int, progress: Double)? {
        guard let keyData = decodeBase32(secretBase32), !keyData.isEmpty else {
            return nil
        }
        let timestamp = max(0, Int64(date.timeIntervalSince1970))
        let period = Int64(max(1, periodSeconds))
        let step = UInt64(timestamp / period)
        var bigEndianStep = step.bigEndian
        let counterData = Data(bytes: &bigEndianStep, count: MemoryLayout<UInt64>.size)

        let key = SymmetricKey(data: keyData)
        let digest = Array(HMAC<Insecure.SHA1>.authenticationCode(for: counterData, using: key))
        guard digest.count == 20 else { return nil }

        let offset = Int(digest[19] & 0x0f)
        let binary: UInt32 =
            (UInt32(digest[offset] & 0x7f) << 24)
            | (UInt32(digest[offset + 1]) << 16)
            | (UInt32(digest[offset + 2]) << 8)
            | UInt32(digest[offset + 3])

        var modulus: UInt32 = 1
        for _ in 0..<digits { modulus *= 10 }
        let raw = String(format: "%0*u", digits, binary % modulus)
        let formatted: String
        if raw.count == 6 {
            let split = raw.index(raw.startIndex, offsetBy: 3)
            formatted = "\(raw[..<split]) \(raw[split...])"
        } else {
            formatted = raw
        }

        let elapsedInWindow = Double(date.timeIntervalSince1970).truncatingRemainder(dividingBy: Double(period))
        let remaining = max(1, Int(ceil(Double(period) - elapsedInWindow)))
        let progress = max(0, min(1, 1.0 - (elapsedInWindow / Double(period))))
        return (formatted, raw, remaining, progress)
    }
}

@MainActor
final class WebStudioAuthenticatorStore: ObservableObject {
    struct StoredCredentials: Codable, Equatable {
        let ownerId: String
        let email: String?
        let displayName: String?
        let totpSecret: String
        let periodSeconds: Int
        let digits: Int
    }

    static let shared = WebStudioAuthenticatorStore()

    @Published private(set) var credentials: StoredCredentials?

    private let keychainService = "Deksan.CalendarASD.WebAuthenticator.v1"
    private let keychainAccount = "active"

    private init() {
        self.credentials = loadFromKeychain()
    }

    func activeCredentials(for session: CloudCalendarsAPI.Session?) -> StoredCredentials? {
        guard let session, let ownerId = session.ownerId else { return nil }
        if let current = credentials, current.ownerId == ownerId {
            return current
        }
        if let loaded = loadFromKeychain(), loaded.ownerId == ownerId {
            credentials = loaded
            return loaded
        }
        return nil
    }

    func save(
        response: CloudCalendarsAPI.WebAuthenticatorSetupResponse,
        session: CloudCalendarsAPI.Session
    ) {
        guard let ownerId = session.ownerId, !ownerId.isEmpty else { return }
        let item = StoredCredentials(
            ownerId: ownerId,
            email: response.email ?? session.email,
            displayName: response.displayName,
            totpSecret: response.totpSecret,
            periodSeconds: response.periodSeconds ?? 30,
            digits: response.digits ?? 6
        )
        credentials = item
        saveToKeychain(item)
    }

    func clear() {
        credentials = nil
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: keychainService,
            kSecAttrAccount as String: keychainAccount
        ]
        SecItemDelete(query as CFDictionary)
    }

    private func loadFromKeychain() -> StoredCredentials? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: keychainService,
            kSecAttrAccount as String: keychainAccount,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]
        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        guard status == errSecSuccess,
              let data = result as? Data,
              let decoded = try? JSONDecoder().decode(StoredCredentials.self, from: data)
        else {
            return nil
        }
        return decoded
    }

    private func saveToKeychain(_ item: StoredCredentials) {
        guard let data = try? JSONEncoder().encode(item) else { return }
        let baseQuery: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: keychainService,
            kSecAttrAccount as String: keychainAccount
        ]
        SecItemDelete(baseQuery as CFDictionary)

        var attributes = baseQuery
        attributes[kSecValueData as String] = data
        attributes[kSecAttrAccessible as String] = kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly
        SecItemAdd(attributes as CFDictionary, nil)
    }
}

@MainActor
struct WebStudioAuthSheetView: View {
    let initialChallenge: WebAuthChallengePayload?

    @Environment(\.dismiss) private var dismiss
    @ObservedObject private var cloudAccountManager = CloudAccountManager.shared
    @ObservedObject private var authenticatorStore = WebStudioAuthenticatorStore.shared

    @State private var activeChallenge: WebAuthChallengePayload?
    @State private var challengeInfo: CloudCalendarsAPI.WebQRChallengeInfo?
    @State private var isLoading = false
    @State private var isApproving = false
    @State private var approvedSuccessfully = false
    @State private var errorMessage: String?
    @State private var copiedCode = false
    @State private var showInlineQRScanner = false
    @State private var now = Date()

    private let ticker = Timer.publish(every: 0.5, on: .main, in: .common).autoconnect()

    init(initialChallenge: WebAuthChallengePayload? = nil) {
        self.initialChallenge = initialChallenge
        self._activeChallenge = State(initialValue: initialChallenge)
    }

    var body: some View {
        CalendarSheetNavigation {
            VStack(spacing: 0) {
                #if os(macOS)
                MacCalendarSheetHeader(title: Text(activeChallenge != nil && !approvedSuccessfully ? "Web Sign-In" : "Web Authenticator")) {
                    AppToolbarTextButton("Close") { cloudAccountManager.cancelSignIn(); dismiss() }
                } trailing: { EmptyView() }
                #endif
            ScrollView {
                VStack(spacing: 20) {
                    if cloudAccountManager.isSignedIn { headerCard }

                    if !cloudAccountManager.isSignedIn {
                        signInRequiredCard
                    } else {
                        if let challenge = activeChallenge, !approvedSuccessfully {
                            qrApprovalCard(for: challenge)
                        }

                        if approvedSuccessfully {
                            approvedBanner
                        }

                        authenticatorCodeCard

                        if activeChallenge == nil || approvedSuccessfully {
                            scanAnotherQRButton
                        }
                    }

                    if let errorMessage {
                        errorCard(errorMessage)
                    }
                }
                .padding(20)
            }
            }
            .background(CalendarSurfaceColors.gray6)
            #if os(iOS)
            .navigationTitle(
                LocalizedStringKey(
                    activeChallenge != nil && !approvedSuccessfully ? "Web Sign-In" : "Web Authenticator"
                )
            )
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                AppSheetToolbarItem(placement: .cancellationAction) {
                    AppToolbarTextButton("Close") {
                        cloudAccountManager.cancelSignIn()
                        dismiss()
                    }
                }
            }
            #endif
            .onAppear {
                Task { await refreshStateAfterAppearOrSignIn() }
            }
            .onReceive(NotificationCenter.default.publisher(for: .cloudAccountChanged)) { _ in
                Task { await refreshStateAfterAppearOrSignIn() }
            }
            .onReceive(ticker) { tick in
                now = tick
            }
            #if os(macOS)
            .appSheet(isPresented: $showInlineQRScanner) {
                MacCalendarQRImportView { url in
                    guard let payload = WebAuthChallengePayload(url: url) else { return false }
                    approvedSuccessfully = false; errorMessage = nil; activeChallenge = payload
                    showInlineQRScanner = false
                    Task { await loadChallengeInfo(payload) }
                    return true
                }
            }
            #else
            .appFullScreenCover(isPresented: $showInlineQRScanner) {
                SharedEventQRScannerView { scanned in
                    if case .webAuth(let payload) = scanned {
                        approvedSuccessfully = false
                        errorMessage = nil
                        activeChallenge = payload
                        Task { await loadChallengeInfo(payload) }
                    }
                }
            }
            #endif
        }
        #if os(macOS)
        .frame(width: 620, height: 680)
        #endif
    }

    private var headerCard: some View {
        HStack(spacing: 14) {
            Image(systemName: "lock.laptopcomputer")
                .font(CalendarTypography.title2.weight(.semibold))
                .foregroundStyle(.blue)
                .frame(width: 48, height: 48)
                .background(Color.blue.opacity(0.12), in: RoundedRectangle(cornerRadius: 14, style: .continuous))

            VStack(alignment: .leading, spacing: 3) {
                Text("Cloud Calendars Web")
                    .font(CalendarTypography.headline)
                Text(
                    LocalizedStringKey(
                        activeChallenge != nil && !approvedSuccessfully
                            ? "Confirm sign-in on your browser with your Cloud Calendars account."
                            : "Sign in at cloud-calendars.com by QR scan or with your 6-digit security code."
                    )
                )
                .font(CalendarTypography.footnote)
                .foregroundStyle(.secondary)
            }

            Spacer(minLength: 0)
        }
        .padding(16)
        .background(CalendarSurfaceColors.secondaryGrouped, in: RoundedRectangle(cornerRadius: 18, style: .continuous))
    }

    private var signInRequiredCard: some View {
        CloudAccountSignInContent()
    }

    private func qrApprovalCard(for challenge: WebAuthChallengePayload) -> some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack(spacing: 10) {
                Image(systemName: "qrcode.viewfinder")
                    .font(CalendarTypography.title3.weight(.semibold))
                    .foregroundStyle(.green)
                VStack(alignment: .leading, spacing: 2) {
                    Text("Approve Browser Sign-In")
                        .font(CalendarTypography.headline)
                    if let email = challengeInfo?.iosEmail ?? primaryAccountEmail {
                        Text(email)
                            .font(CalendarTypography.footnote)
                            .foregroundStyle(.secondary)
                    }
                }
                Spacer()
            }

            if let webEmail = challengeInfo?.webEmail,
               !webEmail.isEmpty,
               webEmail.lowercased() != (primaryAccountEmail ?? "").lowercased() {
                Text(
                    String(
                        format: NSLocalizedString(
                            "This will also link browser session %@ with your Cloud Calendars iOS account.",
                            comment: "Web QR link confirmation"
                        ),
                        webEmail
                    )
                )
                    .font(CalendarTypography.footnote)
                    .foregroundStyle(.secondary)
            } else {
                Text("Tap Approve below to sign in immediately on your computer.")
                    .font(CalendarTypography.footnote)
                    .foregroundStyle(.secondary)
            }

            Button {
                Task { await approve(challenge: challenge) }
            } label: {
                HStack(spacing: 8) {
                    if isApproving {
                        ProgressView()
                            .tint(.white)
                    } else {
                        Image(systemName: "checkmark.shield.fill")
                    }
                    Text(LocalizedStringKey(isApproving ? "Approving…" : "Approve Sign-In"))
                        .font(CalendarTypography.body.weight(.semibold))
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
                .foregroundStyle(.white)
                .background(Color.blue, in: RoundedRectangle(cornerRadius: 14, style: .continuous))
            }
            .buttonStyle(.plain)
            .disabled(isApproving || challengeInfo?.status == "expired")
        }
        .padding(18)
        .background(CalendarSurfaceColors.secondaryGrouped, in: RoundedRectangle(cornerRadius: 18, style: .continuous))
    }

    private var approvedBanner: some View {
        HStack(spacing: 12) {
            Image(systemName: "checkmark.circle.fill")
                .font(CalendarTypography.title2)
                .foregroundStyle(.green)
            VStack(alignment: .leading, spacing: 2) {
                Text("Browser Sign-In Approved")
                    .font(CalendarTypography.subheadline.weight(.semibold))
                Text("Your web workspace is now open and synced with this account.")
                    .font(CalendarTypography.footnote)
                    .foregroundStyle(.secondary)
            }
            Spacer(minLength: 0)
        }
        .padding(16)
        .background(Color.green.opacity(0.14), in: RoundedRectangle(cornerRadius: 16, style: .continuous))
    }

    private var authenticatorCodeCard: some View {
        let creds = authenticatorStore.activeCredentials(for: CalendarFeedSession.existing)
        let token = creds.flatMap {
            WebStudioTOTPGenerator.code(
                secretBase32: $0.totpSecret,
                at: now,
                periodSeconds: $0.periodSeconds,
                digits: $0.digits
            )
        }

        return VStack(alignment: .leading, spacing: 14) {
            HStack {
                Label("6-Digit Authenticator Code", systemImage: "key.horizontal.fill")
                    .font(CalendarTypography.subheadline.weight(.semibold))
                    .foregroundStyle(.primary)
                Spacer()
                if let token {
                    HStack(spacing: 6) {
                        ZStack {
                            Circle()
                                .stroke(Color.secondary.opacity(0.22), lineWidth: 3)
                            Circle()
                                .trim(from: 0, to: token.progress)
                                .stroke(
                                    token.secondsRemaining <= 5 ? Color.orange : Color.blue,
                                    style: StrokeStyle(lineWidth: 3, lineCap: .round)
                                )
                                .rotationEffect(.degrees(-90))
                        }
                        .frame(width: 18, height: 18)

                        Text("\(token.secondsRemaining)s")
                            .font(CalendarTypography.caption.monospacedDigit().weight(.semibold))
                            .foregroundStyle(token.secondsRemaining <= 5 ? .orange : .secondary)
                    }
                }
            }

            if let token {
                HStack(spacing: 12) {
                    Text(token.formatted)
                        .font(.system(size: 34, weight: .bold, design: .monospaced))
                        .tracking(2)
                        .foregroundStyle(.primary)

                    Spacer()

                    Button {
                        #if os(macOS)
                        NSPasteboard.general.clearContents()
                        NSPasteboard.general.setString(token.raw, forType: .string)
                        #else
                        UIPasteboard.general.string = token.raw
                        #endif
                        copiedCode = true
                        Task { @MainActor in
                            try? await Task.sleep(for: .seconds(2))
                            copiedCode = false
                        }
                    } label: {
                        Label(
                            LocalizedStringKey(copiedCode ? "Copied" : "Copy"),
                            systemImage: copiedCode ? "checkmark" : "doc.on.doc"
                        )
                            .font(CalendarTypography.footnote.weight(.semibold))
                            .padding(.horizontal, 12)
                            .padding(.vertical, 8)
                            .background(Color.blue.opacity(0.12), in: Capsule())
                            .foregroundStyle(.blue)
                    }
                    .buttonStyle(.plain)
                }
                .padding(.vertical, 4)

                if let email = creds?.email ?? primaryAccountEmail {
                    Text(
                        String(
                            format: NSLocalizedString(
                                "Account email: %@",
                                comment: "Authenticator linked email label"
                            ),
                            email
                        )
                    )
                        .font(CalendarTypography.caption.weight(.medium))
                        .foregroundStyle(.secondary)
                }

                Text("You can enter this email and 6-digit code anytime at cloud-calendars.com to sign in without scanning a QR code.")
                    .font(CalendarTypography.footnote)
                    .foregroundStyle(.secondary)
            } else if isLoading {
                HStack(spacing: 10) {
                    ProgressView()
                    Text("Preparing your Authenticator key…")
                        .font(CalendarTypography.footnote)
                        .foregroundStyle(.secondary)
                }
                .padding(.vertical, 8)
            } else {
                Button {
                    Task { await ensureAuthenticatorConfigured() }
                } label: {
                    Label("Activate 6-Digit Authenticator Code", systemImage: "arrow.clockwise")
                        .font(CalendarTypography.subheadline.weight(.semibold))
                }
            }
        }
        .padding(18)
        .background(CalendarSurfaceColors.secondaryGrouped, in: RoundedRectangle(cornerRadius: 18, style: .continuous))
    }

    private var scanAnotherQRButton: some View {
        Button {
            showInlineQRScanner = true
        } label: {
            HStack(spacing: 10) {
                Image(systemName: "qrcode.viewfinder")
                    .font(CalendarTypography.body.weight(.semibold))
                Text("Scan Web Sign-In QR Code")
                    .font(CalendarTypography.body.weight(.semibold))
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 13)
            .foregroundStyle(.blue)
            .background(Color.blue.opacity(0.12), in: RoundedRectangle(cornerRadius: 14, style: .continuous))
        }
        .buttonStyle(.plain)
    }

    private func errorCard(_ message: String) -> some View {
        HStack(alignment: .top, spacing: 10) {
            Image(systemName: "exclamationmark.triangle.fill")
                .foregroundStyle(.orange)
            Text(message)
                .font(CalendarTypography.footnote)
                .foregroundStyle(.primary)
            Spacer(minLength: 0)
        }
        .padding(14)
        .background(Color.orange.opacity(0.14), in: RoundedRectangle(cornerRadius: 14, style: .continuous))
    }

    private var primaryAccountEmail: String? {
        if let sessionEmail = CalendarFeedSession.existing?.email, !sessionEmail.isEmpty {
            return sessionEmail
        }
        return cloudAccountManager.account?.identities.compactMap(\.email).first(where: { !$0.isEmpty })
    }

    private func refreshStateAfterAppearOrSignIn() async {
        guard let session = CalendarFeedSession.existing else { return }
        errorMessage = nil
        if let challenge = activeChallenge, !approvedSuccessfully {
            await loadChallengeInfo(challenge)
        }
        if authenticatorStore.activeCredentials(for: session) == nil {
            await ensureAuthenticatorConfigured()
        }
        #if os(iOS)
        _ = await NativeCalendarSyncService.syncNow()
        #endif
    }

    private func loadChallengeInfo(_ challenge: WebAuthChallengePayload) async {
        guard let session = CalendarFeedSession.existing else { return }
        do {
            let info = try await CloudCalendarsAPI.fetchWebQRChallengeInfo(
                challengeId: challenge.challengeId,
                session: session
            )
            challengeInfo = info
            if info.status == "expired" {
                errorMessage = NSLocalizedString(
                    "This QR code has expired. Scan the refreshed QR code shown on your computer.",
                    comment: ""
                )
            }
        } catch {
            errorMessage = friendlyServerError(error)
        }
    }

    private func ensureAuthenticatorConfigured() async {
        guard let session = CalendarFeedSession.existing else { return }
        isLoading = true
        defer { isLoading = false }
        do {
            let setup = try await CloudCalendarsAPI.setupWebAuthenticator(session: session)
            authenticatorStore.save(response: setup, session: session)
        } catch {
            errorMessage = friendlyServerError(error)
        }
    }

    private func approve(challenge: WebAuthChallengePayload) async {
        guard let session = CalendarFeedSession.existing else { return }
        isApproving = true
        errorMessage = nil
        defer { isApproving = false }

        do {
            let response = try await CloudCalendarsAPI.approveWebQRChallenge(
                challengeId: challenge.challengeId,
                session: session
            )
            authenticatorStore.save(response: response, session: session)
            approvedSuccessfully = true
            #if os(iOS)
            UINotificationFeedbackGenerator().notificationOccurred(.success)
            #endif
            #if os(iOS)
        _ = await NativeCalendarSyncService.syncNow()
        #endif
        } catch {
            errorMessage = friendlyServerError(error)
        }
    }

    private func friendlyServerError(_ error: Error) -> String {
        if case CloudCalendarsAPI.Failure.http(_, let rawBody) = error,
           let data = rawBody.data(using: .utf8),
           let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
           let msg = json["error"] as? String,
           !msg.isEmpty {
            return msg
        }
        return error.localizedDescription
    }
}
