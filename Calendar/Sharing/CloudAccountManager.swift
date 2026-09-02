import AuthenticationServices
import CryptoKit
import Foundation
import SwiftUI
import UIKit

/// The identity that owns App Clip shares. This is intentionally separate from
/// the Google/Microsoft accounts connected as calendar data sources.
@MainActor
final class CloudAccountManager: NSObject, ObservableObject {
    private struct OAuthConfiguration: Sendable {
        let provider: String
        let clientID: String
        let authorizationEndpoint: URL
        let tokenEndpoint: URL
        let redirectURI: String
        let callbackScheme: String
        let scopes: String
        let backendToken: BackendToken

        enum BackendToken: Sendable {
            case identityToken
            case accessToken
        }

        static let google = OAuthConfiguration(
            provider: "google",
            clientID: "540859420644-a5mnvraqupd7l804e0s4e60doddqlktr.apps.googleusercontent.com",
            authorizationEndpoint: URL(string: "https://accounts.google.com/o/oauth2/v2/auth")!,
            tokenEndpoint: URL(string: "https://oauth2.googleapis.com/token")!,
            redirectURI: "com.googleusercontent.apps.540859420644-a5mnvraqupd7l804e0s4e60doddqlktr:/oauthredirect",
            callbackScheme: "com.googleusercontent.apps.540859420644-a5mnvraqupd7l804e0s4e60doddqlktr",
            scopes: "openid email profile",
            backendToken: .identityToken
        )

        static let microsoft = OAuthConfiguration(
            provider: "microsoft",
            clientID: "5b1a5159-948f-4b5b-ac6a-009df927c665",
            authorizationEndpoint: URL(string: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize")!,
            tokenEndpoint: URL(string: "https://login.microsoftonline.com/common/oauth2/v2.0/token")!,
            redirectURI: "msauth.Deksan.CalendarASD://auth",
            callbackScheme: "msauth.Deksan.CalendarASD",
            scopes: "openid profile email User.Read",
            backendToken: .accessToken
        )
    }

    private struct OAuthTokenResponse: Decodable, Sendable {
        let accessToken: String?
        let idToken: String?
        let error: String?
        let errorDescription: String?

        enum CodingKeys: String, CodingKey {
            case accessToken = "access_token"
            case idToken = "id_token"
            case error
            case errorDescription = "error_description"
        }
    }

    private struct IdentityTokenClaims: Decodable, Sendable {
        let name: String?
        let email: String?
    }

    private enum OAuthError: LocalizedError {
        case invalidAuthorizationURL
        case invalidCallback
        case stateMismatch
        case authorizationFailed(String)
        case missingCode
        case tokenExchangeFailed(String)
        case missingToken
        case couldNotStart

        var errorDescription: String? {
            switch self {
            case .invalidAuthorizationURL, .invalidCallback:
                NSLocalizedString(
                    "The sign-in response was invalid. Please try again.",
                    comment: "OAuth invalid response"
                )
            case .stateMismatch:
                NSLocalizedString(
                    "The sign-in response couldn’t be verified. Please try again.",
                    comment: "OAuth state mismatch"
                )
            case .authorizationFailed(let message), .tokenExchangeFailed(let message):
                message
            case .missingCode, .missingToken:
                NSLocalizedString(
                    "The provider didn’t return the information required to sign in.",
                    comment: "OAuth missing authorization data"
                )
            case .couldNotStart:
                NSLocalizedString(
                    "Sign-in couldn’t open. Please try again.",
                    comment: "OAuth browser session could not start"
                )
            }
        }
    }

    struct Account: Equatable {
        let identities: [CloudCalendarsAPI.AccountIdentity]
        let ownerId: String?

        func identity(for provider: String) -> CloudCalendarsAPI.AccountIdentity? {
            identities.first { $0.provider == provider }
        }
    }

    static let shared = CloudAccountManager()

    @Published private(set) var account: Account?
    @Published private(set) var isSigningIn = false
    @Published private var providerErrors: [String: String] = [:]

    private var appleAuthorizationController: ASAuthorizationController?
    private var webAuthenticationSession: ASWebAuthenticationSession?

    var isSignedIn: Bool { account?.identities.isEmpty == false }

    func isLinked(_ provider: String) -> Bool {
        account?.identity(for: provider) != nil
    }

    func errorMessage(for provider: String) -> String? {
        providerErrors[provider]
    }

    private func clearError(for provider: String) {
        providerErrors.removeValue(forKey: provider)
    }

    private func setError(_ message: String?, for provider: String) {
        guard let message, !message.isEmpty else {
            clearError(for: provider)
            return
        }
        providerErrors[provider] = message
    }

    private override init() {
        super.init()
        reloadFromStorage()
    }

    func reloadFromStorage() {
        guard let session = CalendarFeedSession.existing else {
            account = nil
            return
        }
        let identities = normalizedIdentities(from: session)
        account = identities.isEmpty
            ? nil
            : Account(identities: identities, ownerId: session.ownerId)
    }

    func signInWithGoogle() {
        startOAuth(.google)
    }

    func configureAppleRequest(_ request: ASAuthorizationAppleIDRequest) {
        request.requestedScopes = [.fullName, .email]
    }

    func signInWithApple() {
        guard !isSigningIn else { return }

        let request = ASAuthorizationAppleIDProvider().createRequest()
        configureAppleRequest(request)

        let controller = ASAuthorizationController(authorizationRequests: [request])
        controller.delegate = self
        controller.presentationContextProvider = self
        appleAuthorizationController = controller
        isSigningIn = true
        clearError(for: "apple")
        controller.performRequests()
    }

    func completeAppleSignIn(_ result: Result<ASAuthorization, Error>) {
        appleAuthorizationController = nil
        switch result {
        case .failure(let error):
            isSigningIn = false
            setError(error.localizedDescription, for: "apple")
        case .success(let authorization):
            guard let credential = authorization.credential as? ASAuthorizationAppleIDCredential,
                  let tokenData = credential.identityToken,
                  let token = String(data: tokenData, encoding: .utf8)
            else {
                isSigningIn = false
                setError(
                    NSLocalizedString(
                        "Apple did not return an identity token.",
                        comment: "Sign in with Apple missing token"
                    ),
                    for: "apple"
                )
                return
            }

            let name = PersonNameComponentsFormatter().string(from: credential.fullName ?? .init())
            clearError(for: "apple")
            Task {
                await authenticate(
                    provider: "apple",
                    token: token,
                    name: name.isEmpty ? nil : name
                )
            }
        }
    }

    /// Identity-only Microsoft login for the App Clip account. It requests no
    /// calendar scope and never writes to CalendarViewModel.storedMsUsers.
    func signInWithMicrosoft() {
        guard SubscriptionManager.shared.subscriptionStatus == .premium else {
            requestMicrosoftSubscription()
            return
        }
        startOAuth(.microsoft)
    }

    /// Uses an ephemeral browser OAuth session and PKCE. Provider access and
    /// identity tokens are held only long enough to establish the app's own
    /// server session; neither GoogleSignIn nor MSAL gets a chance to create a
    /// Keychain item for this dedicated sharing identity.
    private func startOAuth(_ configuration: OAuthConfiguration) {
        guard !isSigningIn else { return }

        let codeVerifier = Self.randomURLSafeValue()
        let state = Self.randomURLSafeValue()
        let nonce = Self.randomURLSafeValue()

        guard let authorizationURL = Self.authorizationURL(
            for: configuration,
            codeVerifier: codeVerifier,
            state: state,
            nonce: nonce
        ) else {
            setError(OAuthError.invalidAuthorizationURL.localizedDescription, for: configuration.provider)
            return
        }

        isSigningIn = true
        clearError(for: configuration.provider)

        let session = ASWebAuthenticationSession(
            url: authorizationURL,
            callbackURLScheme: configuration.callbackScheme
        ) { [weak self] callbackURL, error in
            let errorDescription = error?.localizedDescription
            let errorCode = (error as NSError?)?.code
            let errorDomain = (error as NSError?)?.domain

            Task { @MainActor [weak self, callbackURL, errorDescription, errorCode, errorDomain] in
                guard let self else { return }
                self.webAuthenticationSession = nil

                if errorDomain == ASWebAuthenticationSessionError.errorDomain,
                   errorCode == ASWebAuthenticationSessionError.canceledLogin.rawValue {
                    self.isSigningIn = false
                    self.clearError(for: configuration.provider)
                    return
                }

                guard let callbackURL else {
                    self.isSigningIn = false
                    self.setError(
                        errorDescription ?? OAuthError.invalidCallback.localizedDescription,
                        for: configuration.provider
                    )
                    return
                }

                do {
                    let code = try Self.authorizationCode(
                        from: callbackURL,
                        expectedState: state
                    )
                    let response = try await Self.exchangeAuthorizationCode(
                        code,
                        codeVerifier: codeVerifier,
                        configuration: configuration
                    )
                    let token: String?
                    switch configuration.backendToken {
                    case .identityToken:
                        token = response.idToken
                    case .accessToken:
                        token = response.accessToken
                    }
                    guard let token, !token.isEmpty else {
                        throw OAuthError.missingToken
                    }

                    let claims = response.idToken.flatMap(Self.identityClaims(from:))
                    await self.authenticate(
                        provider: configuration.provider,
                        token: token,
                        name: claims?.name ?? claims?.email
                    )
                } catch {
                    self.isSigningIn = false
                    self.setError(error.localizedDescription, for: configuration.provider)
                }
            }
        }
        session.presentationContextProvider = self
        session.prefersEphemeralWebBrowserSession = true
        webAuthenticationSession = session

        guard session.start() else {
            webAuthenticationSession = nil
            isSigningIn = false
            setError(OAuthError.couldNotStart.localizedDescription, for: configuration.provider)
            return
        }
    }

    private static func authorizationURL(
        for configuration: OAuthConfiguration,
        codeVerifier: String,
        state: String,
        nonce: String
    ) -> URL? {
        var components = URLComponents(
            url: configuration.authorizationEndpoint,
            resolvingAgainstBaseURL: false
        )
        components?.queryItems = [
            URLQueryItem(name: "client_id", value: configuration.clientID),
            URLQueryItem(name: "redirect_uri", value: configuration.redirectURI),
            URLQueryItem(name: "response_type", value: "code"),
            URLQueryItem(name: "scope", value: configuration.scopes),
            URLQueryItem(name: "code_challenge", value: codeChallenge(for: codeVerifier)),
            URLQueryItem(name: "code_challenge_method", value: "S256"),
            URLQueryItem(name: "state", value: state),
            URLQueryItem(name: "nonce", value: nonce),
            URLQueryItem(name: "prompt", value: "select_account")
        ]
        return components?.url
    }

    private static func authorizationCode(
        from callbackURL: URL,
        expectedState: String
    ) throws -> String {
        guard let components = URLComponents(url: callbackURL, resolvingAgainstBaseURL: false) else {
            throw OAuthError.invalidCallback
        }
        let values = Dictionary(
            uniqueKeysWithValues: (components.queryItems ?? []).map { ($0.name, $0.value ?? "") }
        )
        guard values["state"] == expectedState else { throw OAuthError.stateMismatch }
        if let providerError = values["error"], !providerError.isEmpty {
            throw OAuthError.authorizationFailed(
                values["error_description"]?.replacingOccurrences(of: "+", with: " ")
                    ?? providerError
            )
        }
        guard let code = values["code"], !code.isEmpty else { throw OAuthError.missingCode }
        return code
    }

    private static func exchangeAuthorizationCode(
        _ code: String,
        codeVerifier: String,
        configuration: OAuthConfiguration
    ) async throws -> OAuthTokenResponse {
        var request = URLRequest(url: configuration.tokenEndpoint)
        request.httpMethod = "POST"
        request.setValue(
            "application/x-www-form-urlencoded; charset=utf-8",
            forHTTPHeaderField: "Content-Type"
        )
        request.httpBody = formEncoded([
            "client_id": configuration.clientID,
            "code": code,
            "code_verifier": codeVerifier,
            "grant_type": "authorization_code",
            "redirect_uri": configuration.redirectURI,
            "scope": configuration.scopes
        ])

        let (data, response) = try await URLSession.shared.data(for: request)
        guard let http = response as? HTTPURLResponse else {
            throw OAuthError.tokenExchangeFailed(
                NSLocalizedString("The provider returned an invalid response.", comment: "OAuth invalid token response")
            )
        }
        let decoded = try JSONDecoder().decode(OAuthTokenResponse.self, from: data)
        guard (200..<300).contains(http.statusCode) else {
            throw OAuthError.tokenExchangeFailed(
                decoded.errorDescription ?? decoded.error ?? HTTPURLResponse.localizedString(forStatusCode: http.statusCode)
            )
        }
        return decoded
    }

    private static func formEncoded(_ values: [String: String]) -> Data {
        let allowed = CharacterSet.alphanumerics.union(CharacterSet(charactersIn: "-._~"))
        let body = values.keys.sorted().map { key in
            let encodedKey = key.addingPercentEncoding(withAllowedCharacters: allowed) ?? key
            let value = values[key] ?? ""
            let encodedValue = value.addingPercentEncoding(withAllowedCharacters: allowed) ?? value
            return "\(encodedKey)=\(encodedValue)"
        }.joined(separator: "&")
        return Data(body.utf8)
    }

    private static func randomURLSafeValue() -> String {
        UUID().uuidString.replacingOccurrences(of: "-", with: "")
            + UUID().uuidString.replacingOccurrences(of: "-", with: "")
    }

    private static func codeChallenge(for verifier: String) -> String {
        Data(SHA256.hash(data: Data(verifier.utf8)))
            .base64EncodedString()
            .replacingOccurrences(of: "+", with: "-")
            .replacingOccurrences(of: "/", with: "_")
            .replacingOccurrences(of: "=", with: "")
    }

    private static func identityClaims(from token: String) -> IdentityTokenClaims? {
        let parts = token.split(separator: ".")
        guard parts.count > 1 else { return nil }
        var payload = String(parts[1])
            .replacingOccurrences(of: "-", with: "+")
            .replacingOccurrences(of: "_", with: "/")
        let padding = (4 - payload.count % 4) % 4
        payload.append(String(repeating: "=", count: padding))
        guard let data = Data(base64Encoded: payload) else { return nil }
        return try? JSONDecoder().decode(IdentityTokenClaims.self, from: data)
    }

    func requestMicrosoftSubscription() {
        setError(
            NSLocalizedString(
                "A Premium subscription is required to connect Microsoft.",
                comment: "Microsoft identity subscription requirement"
            ),
            for: "microsoft"
        )
        let payload: [String: Any] = ["subscriptionStatusRaw": "Premium"]
        NotificationCenter.default.post(
            name: .notificationDraggableMenuViewSub,
            object: nil,
            userInfo: payload
        )
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            NotificationCenter.default.post(
                name: .notificationDraggableMenuViewSub,
                object: nil,
                userInfo: payload
            )
        }
    }

    func signOut() {
        // The browser OAuth session is ephemeral and provider tokens are never
        // retained. Calendar provider sessions remain entirely independent.
        CalendarFeedSession.forget()
        SharedInviteTracker.demoteAllToReader()
        account = nil
        providerErrors.removeAll()
        NotificationCenter.default.post(name: .cloudAccountChanged, object: nil)
    }

    func signOut(provider: String) {
        guard !isSigningIn, let account else { return }

        // The final identity remains linked on the server so this person's
        // events can still be recovered after signing in again. Locally this is
        // a complete Cloud Calendars sign-out.
        guard account.identities.count > 1 else {
            signOut()
            return
        }

        isSigningIn = true
        clearError(for: provider)
        Task {
            defer { isSigningIn = false }
            do {
                let session = try await CalendarFeedSession.disconnect(provider: provider)
                self.account = Account(
                    identities: normalizedIdentities(from: session),
                    ownerId: session.ownerId
                )
                NotificationCenter.default.post(name: .cloudAccountChanged, object: nil)
            } catch {
                setError(error.localizedDescription, for: provider)
            }
        }
    }

    private func authenticate(provider: String, token: String, name: String?) async {
        defer { isSigningIn = false }
        do {
            let session = try await CalendarFeedSession.authenticate(
                provider: provider,
                token: token,
                name: name
            )
            account = Account(
                identities: normalizedIdentities(from: session),
                ownerId: session.ownerId
            )
            clearError(for: provider)
            NotificationCenter.default.post(name: .cloudAccountChanged, object: nil)
            await SharedEventRecovery.restoreFromServer()
            await PendingEventInvitationManager.shared.refresh(
                notifyForNewInvitations: true
            )
        } catch CalendarFeedSession.SessionError.emailRequired where provider == "apple" {
            setError(
                NSLocalizedString(
                    "Apple didn’t return an email. In Settings, stop using Apple ID for Cloud Calendars, then connect again and choose Share My Email.",
                    comment: "Sign in with Apple previously authorized without a reusable email"
                ),
                for: provider
            )
        } catch {
            setError(error.localizedDescription, for: provider)
        }
    }

    private func normalizedIdentities(
        from session: CloudCalendarsAPI.Session
    ) -> [CloudCalendarsAPI.AccountIdentity] {
        var identities: [String: CloudCalendarsAPI.AccountIdentity] = [:]
        for identity in session.identities ?? [] {
            if CalendarFeedSession.validEmail(identity.email) {
                identities[identity.provider] = identity
            }
        }
        if let provider = session.provider,
           identities[provider] == nil,
           CalendarFeedSession.validEmail(session.email) {
            identities[provider] = .init(provider: provider, email: session.email)
        }
        return identities.values.sorted { $0.provider < $1.provider }
    }

    private static func presentingViewController() -> UIViewController? {
        let scenes = UIApplication.shared.connectedScenes
            .compactMap { $0 as? UIWindowScene }
            .filter { $0.activationState == .foregroundActive }
        var controller = scenes
            .flatMap(\.windows)
            .first(where: \.isKeyWindow)?
            .rootViewController

        while let presented = controller?.presentedViewController {
            controller = presented
        }
        return controller
    }
}

extension CloudAccountManager: ASAuthorizationControllerDelegate {
    func authorizationController(
        controller: ASAuthorizationController,
        didCompleteWithAuthorization authorization: ASAuthorization
    ) {
        completeAppleSignIn(.success(authorization))
    }

    func authorizationController(
        controller: ASAuthorizationController,
        didCompleteWithError error: Error
    ) {
        completeAppleSignIn(.failure(error))
    }
}

extension CloudAccountManager: ASAuthorizationControllerPresentationContextProviding {
    func presentationAnchor(for controller: ASAuthorizationController) -> ASPresentationAnchor {
        Self.presentingViewController()?.view.window
            ?? UIApplication.shared.connectedScenes
                .compactMap { $0 as? UIWindowScene }
                .flatMap(\.windows)
                .first
            ?? ASPresentationAnchor()
    }
}

extension CloudAccountManager: ASWebAuthenticationPresentationContextProviding {
    func presentationAnchor(for session: ASWebAuthenticationSession) -> ASPresentationAnchor {
        Self.presentingViewController()?.view.window
            ?? UIApplication.shared.connectedScenes
                .compactMap { $0 as? UIWindowScene }
                .flatMap(\.windows)
                .first
            ?? ASPresentationAnchor()
    }
}

struct CloudAccountSignInContent: View {
    @ObservedObject private var manager = CloudAccountManager.shared
    @ObservedObject private var subscriptionManager = SubscriptionManager.shared
    @Environment(\.colorScheme) private var colorScheme

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            guidanceCard

            providerRow(
                provider: "apple",
                title: "Apple",
                systemImage: "apple.logo",
                action: manager.signInWithApple
            )

            providerRow(
                provider: "google",
                title: "Google",
                assetName: "google_icon",
                action: manager.signInWithGoogle
            )

            microsoftRow

            if manager.isSignedIn {
                HStack {
                    Label("App Clip sharing account", systemImage: "checkmark.shield.fill")
                        .font(.subheadline.weight(.medium))
                        .foregroundStyle(.green)
                    Spacer()
                }
                .padding(.top, 2)
            }

            if manager.isSigningIn {
                HStack(spacing: 8) {
                    ProgressView()
                    Text("Signing in…")
                        .foregroundStyle(.secondary)
                }
                .font(.subheadline)
            }

        }
    }

    private var guidanceCard: some View {
        HStack(alignment: .top, spacing: 12) {
            Image(systemName: manager.isSignedIn ? "person.crop.circle.badge.checkmark" : "person.crop.circle.badge.exclamationmark")
                .font(.title2)
                .foregroundStyle(manager.isSignedIn ? .green : .blue)
                .frame(width: 30)

            VStack(alignment: .leading, spacing: 4) {
                Text("Sign in with at least one account")
                    .font(.body.weight(.semibold))
                    .fixedSize(horizontal: false, vertical: true)
                Text("Use Apple, Google, or Microsoft.")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
                Text("A verified email is required to share, recover, or use access granted by an owner.")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
        .padding(14)
        .fixedSize(horizontal: false, vertical: true)
        .layoutPriority(1)
        .background(Color.blue.opacity(colorScheme == .dark ? 0.16 : 0.08))
        .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
    }

    @ViewBuilder
    private func providerRow(
        provider: String,
        title: LocalizedStringKey,
        assetName: String? = nil,
        systemImage: String? = nil,
        action: @escaping () -> Void
    ) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            if manager.isLinked(provider) {
                connectedProviderRow(
                    provider: provider,
                    title: title,
                    assetName: assetName,
                    systemImage: systemImage
                )
            } else {
                Button(action: action) {
                    providerLabel(
                        title: title,
                        assetName: assetName,
                        systemImage: systemImage
                    ) {
                        Text("Connect")
                            .font(.subheadline.weight(.semibold))
                            .foregroundStyle(.blue)
                    }
                }
                .buttonStyle(.plain)
                .disabled(manager.isSigningIn)
            }

            providerError(for: provider)
        }
    }

    private var microsoftRow: some View {
        VStack(alignment: .leading, spacing: 6) {
            if manager.isLinked("microsoft") {
                connectedProviderRow(
                    provider: "microsoft",
                    title: "Microsoft",
                    assetName: "microsoft_icon"
                )
            } else {
                Button {
                    if subscriptionManager.subscriptionStatus == .premium {
                        manager.signInWithMicrosoft()
                    } else {
                        manager.requestMicrosoftSubscription()
                    }
                } label: {
                    providerLabel(title: "Microsoft", assetName: "microsoft_icon") {
                        if subscriptionManager.subscriptionStatus == .premium {
                            Text("Connect")
                                .font(.subheadline.weight(.semibold))
                                .foregroundStyle(.blue)
                        } else {
                            Label("Premium", systemImage: "lock.fill")
                                .font(.subheadline.weight(.semibold))
                                .foregroundStyle(.secondary)
                        }
                    }
                }
                .buttonStyle(.plain)
                .disabled(manager.isSigningIn)
            }

            providerError(for: "microsoft")
        }
    }

    @ViewBuilder
    private func providerError(for provider: String) -> some View {
        if let error = manager.errorMessage(for: provider) {
            HStack(alignment: .top, spacing: 8) {
                Image(systemName: "exclamationmark.circle.fill")
                    .padding(.top, 1)
                Text(error)
                    .fixedSize(horizontal: false, vertical: true)
            }
            .font(.subheadline)
            .foregroundStyle(.red)
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(Color.red.opacity(colorScheme == .dark ? 0.16 : 0.08))
            .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
        }
    }

    private func connectedProviderRow(
        provider: String,
        title: LocalizedStringKey,
        assetName: String? = nil,
        systemImage: String? = nil
    ) -> some View {
        VStack(spacing: 6) {
            providerLabel(title: title, assetName: assetName, systemImage: systemImage) {
                HStack(spacing: 5) {
                    Image(systemName: "checkmark.circle.fill")
                    Text("Connected")
                }
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(.green)
            } subtitle: {
                manager.account?.identity(for: provider)?.email
            }

            Button(role: .destructive) {
                manager.signOut(provider: provider)
            } label: {
                Label("Sign Out", systemImage: "rectangle.portrait.and.arrow.right")
                    .font(.subheadline.weight(.semibold))
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 10)
            }
            .buttonStyle(.plain)
            .foregroundStyle(.red)
            .background(Color.red.opacity(colorScheme == .dark ? 0.16 : 0.08))
            .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
            .disabled(manager.isSigningIn)
        }
    }

    private func providerLabel<Trailing: View>(
        title: LocalizedStringKey,
        assetName: String? = nil,
        systemImage: String? = nil,
        @ViewBuilder trailing: () -> Trailing,
        subtitle: () -> String? = { nil }
    ) -> some View {
        HStack(spacing: 12) {
            Group {
                if let assetName {
                    Image(assetName)
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                } else if let systemImage {
                    Image(systemName: systemImage)
                        .resizable()
                        .scaledToFit()
                        .foregroundStyle(.primary)
                }
            }
            .frame(width: 24, height: 24)

            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.body.weight(.semibold))
                    .foregroundStyle(.primary)
                if let subtitle = subtitle(), !subtitle.isEmpty {
                    Text(subtitle)
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                        .lineLimit(1)
                }
            }
            Spacer(minLength: 8)
            trailing()
        }
        .frame(maxWidth: .infinity)
        .padding(.horizontal, 14)
        .frame(minHeight: 50)
        .background(Color(uiColor: .secondarySystemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: 12, style: .continuous)
                .stroke(Color.primary.opacity(0.06), lineWidth: 1)
        }
    }
}

struct CloudAccountSignInView: View {
    @ObservedObject private var manager = CloudAccountManager.shared
    @Environment(\.dismiss) private var dismiss
    var onDone: (() -> Void)?

    init(onDone: (() -> Void)? = nil) {
        self.onDone = onDone
    }

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    CloudAccountSignInContent()
                } header: {
                    Text("Cloud Calendars account")
                }
            }
            .navigationTitle("Sign In")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Close") { dismiss() }
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") {
                        if let onDone {
                            onDone()
                        } else {
                            dismiss()
                        }
                    }
                        .disabled(!manager.isSignedIn)
                }
            }
        }
    }
}
