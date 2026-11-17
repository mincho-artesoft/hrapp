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
        guard let session, CalendarFeedSession.isCurrent(session),
              let ownerId = session.ownerId else { return nil }
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
        guard CalendarFeedSession.isCurrent(session),
              let ownerId = session.ownerId, !ownerId.isEmpty else { return }
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
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @ScaledMetric(relativeTo: .largeTitle) private var codeFontSize: CGFloat = 34
    @ScaledMetric(relativeTo: .largeTitle) private var codeCellHeight: CGFloat = 62

    private let ticker = Timer.publish(every: 0.5, on: .main, in: .common).autoconnect()

    init(initialChallenge: WebAuthChallengePayload? = nil) {
        self.initialChallenge = initialChallenge
        self._activeChallenge = State(initialValue: initialChallenge)
    }

    var body: some View {
        CalendarSheetNavigation {
            VStack(spacing: 0) {
                #if os(macOS)
                MacCalendarSheetHeader(title: Text(LocalizedStringKey(activeChallenge != nil && !approvedSuccessfully ? "Web Sign-In" : "Web Authenticator"))) {
                    AppToolbarTextButton("Close") { cloudAccountManager.cancelSignIn(); dismiss() }
                } trailing: { EmptyView() }
                #endif
            ScrollView {
                VStack(spacing: 16) {
                    headerCard

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
                .frame(maxWidth: 560)
                .padding(16)
                .frame(maxWidth: .infinity)
            }
            }
            .background(CalendarPalette.groupedBackground)
            .tint(.appBlue)
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
        .frame(width: 620, height: 720)
        #endif
    }

    private var headerCard: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack(spacing: 12) {
                sectionIcon("lock.laptopcomputer", size: 48)
                VStack(alignment: .leading, spacing: 4) {
                    Text("Cloud Calendars Web")
                        .font(CalendarTypography.title3.weight(.semibold))
                    Text("Your calendar, in any browser.")
                        .font(CalendarTypography.footnote)
                        .foregroundStyle(.secondary)
                        .fixedSize(horizontal: false, vertical: true)
                }
                Spacer(minLength: 0)
            }

            Link(destination: URL(string: "https://www.cloud-calendars.com/calendar/")!) {
                HStack(spacing: 10) {
                    Image(systemName: "globe")
                    Text("Open Web Calendar")
                    Spacer(minLength: 4)
                    Image(systemName: "arrow.up.right")
                }
            }
            .buttonStyle(WebAuthActionStyle(prominent: true))
            .accessibilityIdentifier("webAuth.openWebCalendar")
        }
        .modifier(WebAuthCardStyle())
    }

    private var signInRequiredCard: some View {
        CloudAccountSignInContent()
            .modifier(WebAuthCardStyle())
    }

    private func sectionIcon(_ symbol: String, size: CGFloat = 40) -> some View {
        Image(systemName: symbol)
            .font(CalendarTypography.title3.weight(.medium))
            .foregroundStyle(Color.appBlue)
            .frame(width: size, height: size)
            .background(Color.appBlue.opacity(0.12), in: RoundedRectangle(cornerRadius: 14))
            .accessibilityHidden(true)
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
            }
            .buttonStyle(WebAuthActionStyle(prominent: true))
            .disabled(isApproving || challengeInfo?.status == "expired")
        }
        .modifier(WebAuthCardStyle())
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

        return VStack(alignment: .leading, spacing: 16) {
            HStack(spacing: 12) {
                Label("Sign-in code", systemImage: "key.horizontal.fill")
                    .font(CalendarTypography.headline)
                    .foregroundStyle(.primary)
                Spacer(minLength: 4)
                if let token {
                    codeCountdown(seconds: token.secondsRemaining, progress: token.progress)
                }
            }

            if let token {
                codeDigits(token.raw)

                Button { copyAuthenticatorCode(token.raw) } label: {
                    Label(LocalizedStringKey(copiedCode ? "Copied" : "Copy Code"),
                          systemImage: copiedCode ? "checkmark" : "doc.on.doc")
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(WebAuthActionStyle())
                .accessibilityIdentifier("webAuth.copyCode")
                .animation(reduceMotion ? nil : .easeInOut(duration: 0.18), value: copiedCode)
                .onChange(of: token.raw) { _, _ in copiedCode = false }

                Divider()

                if let email = creds?.email ?? primaryAccountEmail {
                    HStack(spacing: 10) {
                        Image(systemName: "person.crop.circle")
                            .font(CalendarTypography.title3)
                            .foregroundStyle(Color.appBlue)
                            .accessibilityHidden(true)
                        VStack(alignment: .leading, spacing: 3) {
                            Text("Account")
                                .font(CalendarTypography.caption)
                                .foregroundStyle(.secondary)
                            Text(email)
                                .font(CalendarTypography.subheadline.weight(.medium))
                                .textSelection(.enabled)
                                .fixedSize(horizontal: false, vertical: true)
                        }
                        Spacer(minLength: 0)
                    }
                }
                Text("Enter this email and code on the website.")
                    .font(CalendarTypography.footnote)
                    .foregroundStyle(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
            } else if isLoading {
                HStack(spacing: 10) {
                    ProgressView()
                    Text("Preparing your Authenticator key…")
                        .font(CalendarTypography.footnote)
                        .foregroundStyle(.secondary)
                }
                .frame(maxWidth: .infinity, minHeight: 64)
            } else {
                Button {
                    Task { await ensureAuthenticatorConfigured() }
                } label: {
                    Label("Activate 6-Digit Authenticator Code", systemImage: "arrow.clockwise")
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(WebAuthActionStyle())
            }
        }
        .modifier(WebAuthCardStyle())
    }

    private func codeDigits(_ code: String) -> some View {
        HStack(spacing: 6) {
            ForEach(Array(code.enumerated()), id: \.offset) { index, digit in
                if index == 3 { Color.clear.frame(width: 6).accessibilityHidden(true) }
                Text(String(digit))
                    .font(.system(size: codeFontSize, weight: .semibold, design: .rounded).monospacedDigit())
                    .lineLimit(1)
                    .minimumScaleFactor(0.5)
                    .frame(maxWidth: .infinity)
                    .frame(height: codeCellHeight)
                    .background(Color.appBlue.opacity(0.08), in: RoundedRectangle(cornerRadius: 12))
                    .overlay {
                        RoundedRectangle(cornerRadius: 12)
                            .strokeBorder(Color.appBlue.opacity(0.12), lineWidth: 1)
                    }
                    .contentTransition(.numericText())
            }
        }
        .frame(maxWidth: 360)
        .frame(maxWidth: .infinity)
        .environment(\.layoutDirection, .leftToRight)
        .animation(reduceMotion ? nil : .easeInOut(duration: 0.2), value: code)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("6-Digit Authenticator Code")
        .accessibilityValue(code.map(String.init).joined(separator: " "))
        .accessibilityIdentifier("webAuth.code")
    }

    private func codeCountdown(seconds: Int, progress: Double) -> some View {
        ZStack {
            Circle().stroke(Color.appBlue.opacity(0.12), lineWidth: 3)
            Circle()
                .trim(from: 0, to: progress)
                .stroke(seconds <= 5 ? Color.orange : Color.appBlue,
                        style: StrokeStyle(lineWidth: 3, lineCap: .round))
                .rotationEffect(.degrees(-90))
            Text(seconds, format: .number)
                .font(CalendarTypography.caption.monospacedDigit().weight(.semibold))
                .foregroundStyle(.secondary)
        }
        .frame(width: 32, height: 32)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(Text(String(format: NSLocalizedString("New code in %lld seconds", comment: "Authenticator countdown"), Int64(seconds))))
        .accessibilityIdentifier("webAuth.countdown")
    }

    private func copyAuthenticatorCode(_ code: String) {
        #if os(macOS)
        NSPasteboard.general.clearContents()
        NSPasteboard.general.setString(code, forType: .string)
        #else
        UIPasteboard.general.string = code
        #endif
        copiedCode = true
        Task { @MainActor in
            try? await Task.sleep(for: .seconds(2))
            copiedCode = false
        }
    }

    private var scanAnotherQRButton: some View {
        Button { showInlineQRScanner = true } label: {
            HStack(spacing: 12) {
                sectionIcon("qrcode.viewfinder")
                VStack(alignment: .leading, spacing: 4) {
                    Text("Scan QR Code")
                        .font(CalendarTypography.headline)
                        .foregroundStyle(.primary)
                    Text("Scan the code shown on the website.")
                        .font(CalendarTypography.footnote)
                        .foregroundStyle(.secondary)
                        .fixedSize(horizontal: false, vertical: true)
                }
                Spacer(minLength: 0)
                Image(systemName: "chevron.forward")
                    .font(CalendarTypography.footnote.weight(.semibold))
                    .foregroundStyle(Color.appBlue)
            }
            .modifier(WebAuthCardStyle())
            .contentShape(RoundedRectangle(cornerRadius: 22))
        }
        .buttonStyle(WebAuthCardButtonStyle())
        .accessibilityIdentifier("webAuth.scanQR")
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
        errorMessage = nil
        guard cloudAccountManager.isSignedIn, let session = CalendarFeedSession.existing else {
            authenticatorStore.clear()
            activeChallenge = nil; challengeInfo = nil; approvedSuccessfully = false
            showInlineQRScanner = false; copiedCode = false; isLoading = false; isApproving = false
            return
        }
        if let challenge = activeChallenge, !approvedSuccessfully {
            await loadChallengeInfo(challenge)
        }
        if authenticatorStore.activeCredentials(for: session) == nil {
            await ensureAuthenticatorConfigured()
        }
        #if os(iOS)
        Task { _ = await NativeCalendarSyncService.syncNow() }
        #endif
    }

    private func loadChallengeInfo(_ challenge: WebAuthChallengePayload) async {
        guard let session = CalendarFeedSession.existing else { return }
        do {
            let info = try await CloudCalendarsAPI.fetchWebQRChallengeInfo(
                challengeId: challenge.challengeId,
                session: session
            )
            guard CalendarFeedSession.isCurrent(session) else { return }
            challengeInfo = info
            if info.status == "expired" {
                errorMessage = NSLocalizedString(
                    "This QR code has expired. Scan the refreshed QR code shown on your computer.",
                    comment: ""
                )
            }
        } catch {
            guard CalendarFeedSession.isCurrent(session) else { return }
            errorMessage = friendlyServerError(error)
        }
    }

    private func ensureAuthenticatorConfigured() async {
        guard let session = CalendarFeedSession.existing else { return }
        isLoading = true
        defer { isLoading = false }
        do {
            let setup = try await CloudCalendarsAPI.setupWebAuthenticator(session: session)
            guard CalendarFeedSession.isCurrent(session) else { return }
            authenticatorStore.save(response: setup, session: session)
        } catch {
            guard CalendarFeedSession.isCurrent(session) else { return }
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
            guard CalendarFeedSession.isCurrent(session) else { return }
            authenticatorStore.save(response: response, session: session)
            approvedSuccessfully = true
            #if os(iOS)
            UINotificationFeedbackGenerator().notificationOccurred(.success)
            #endif
            #if os(iOS)
        Task { _ = await NativeCalendarSyncService.syncNow() }
        #endif
        } catch {
            guard CalendarFeedSession.isCurrent(session) else { return }
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

/// A shared surface and button treatment keep iOS and Mac visually identical.
private struct WebAuthCardStyle: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding(18)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(CalendarPalette.secondaryGroupedBackground,
                        in: RoundedRectangle(cornerRadius: 22, style: .continuous))
            .overlay {
                RoundedRectangle(cornerRadius: 22, style: .continuous)
                    .strokeBorder(Color.primary.opacity(0.05), lineWidth: 1)
            }
    }
}

private struct WebAuthActionStyle: ButtonStyle {
    var prominent = false
    @Environment(\.isEnabled) private var isEnabled
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(CalendarTypography.subheadline.weight(.semibold))
            .foregroundStyle(prominent ? Color.white : Color.appBlue)
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .frame(minHeight: 44)
            .background(Color.appBlue.opacity(prominent ? 1 : 0.12), in: Capsule())
            .contentShape(Capsule())
            .opacity(isEnabled ? (configuration.isPressed ? 0.75 : 1) : 0.45)
            .scaleEffect(configuration.isPressed && !reduceMotion ? 0.98 : 1)
    }
}

private struct WebAuthCardButtonStyle: ButtonStyle {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .opacity(configuration.isPressed ? 0.75 : 1)
            .scaleEffect(configuration.isPressed && !reduceMotion ? 0.99 : 1)
    }
}
