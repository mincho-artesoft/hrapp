import AuthenticationServices
@preconcurrency import GoogleSignIn
@preconcurrency import MSAL
import SwiftUI
import UIKit

/// The identity that owns App Clip shares. This is intentionally separate from
/// the Google/Microsoft accounts connected as calendar data sources.
@MainActor
final class CloudAccountManager: NSObject, ObservableObject {
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
    @Published var errorMessage: String?

    private var appleAuthorizationController: ASAuthorizationController?

    var isSignedIn: Bool { account?.identities.isEmpty == false }

    func isLinked(_ provider: String) -> Bool {
        account?.identity(for: provider) != nil
    }

    private override init() {
        super.init()
        reloadFromKeychain()
    }

    func reloadFromKeychain() {
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
        guard !isSigningIn, let presenter = Self.presentingViewController() else { return }
        isSigningIn = true
        errorMessage = nil

        GIDSignIn.sharedInstance.configuration = GIDConfiguration(
            clientID: CalendarViewModel.shared.clientID
        )
        GIDSignIn.sharedInstance.signIn(
            withPresenting: presenter,
            hint: nil,
            additionalScopes: []
        ) { result, error in
            // GIDSignIn's result is not Sendable. Copy only primitive values
            // before hopping back to the main actor instead of moving the SDK
            // object across the concurrency boundary.
            let token = result?.user.idToken?.tokenString
            let name = result?.user.profile?.name
            let errorMessage = error?.localizedDescription

            Task { @MainActor [weak self, token, name, errorMessage] in
                guard let self else { return }
                guard let token, !token.isEmpty else {
                    self.isSigningIn = false
                    self.errorMessage = errorMessage
                    return
                }

                await self.authenticate(provider: "google", token: token, name: name)
            }
        }
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
        errorMessage = nil
        controller.performRequests()
    }

    func completeAppleSignIn(_ result: Result<ASAuthorization, Error>) {
        appleAuthorizationController = nil
        switch result {
        case .failure(let error):
            isSigningIn = false
            errorMessage = error.localizedDescription
        case .success(let authorization):
            guard let credential = authorization.credential as? ASAuthorizationAppleIDCredential,
                  let tokenData = credential.identityToken,
                  let token = String(data: tokenData, encoding: .utf8)
            else {
                errorMessage = NSLocalizedString(
                    "Apple did not return an identity token.",
                    comment: "Sign in with Apple missing token"
                )
                return
            }

            let name = PersonNameComponentsFormatter().string(from: credential.fullName ?? .init())
            errorMessage = nil
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
        guard !isSigningIn, let presenter = Self.presentingViewController() else { return }

        do {
            let viewModel = CalendarViewModel.shared
            let authority = try MSALAADAuthority(url: URL(string: viewModel.kAuthority)!)
            let config = MSALPublicClientApplicationConfig(
                clientId: viewModel.kClientID,
                redirectUri: viewModel.kRedirectUri,
                authority: authority
            )
            let application = try MSALPublicClientApplication(configuration: config)
            let webParameters = MSALWebviewParameters(authPresentationViewController: presenter)
            let parameters = MSALInteractiveTokenParameters(
                scopes: ["User.Read"],
                webviewParameters: webParameters
            )
            parameters.promptType = .selectAccount

            isSigningIn = true
            errorMessage = nil
            application.acquireToken(with: parameters) { result, error in
                let token = result?.accessToken
                let name = result?.account.username
                let errorMessage = error?.localizedDescription

                Task { @MainActor [weak self, token, name, errorMessage] in
                    guard let self else { return }
                    guard let token, !token.isEmpty else {
                        self.isSigningIn = false
                        self.errorMessage = errorMessage
                        return
                    }
                    await self.authenticate(provider: "microsoft", token: token, name: name)
                }
            }
        } catch {
            isSigningIn = false
            errorMessage = error.localizedDescription
        }
    }

    func requestMicrosoftSubscription() {
        errorMessage = NSLocalizedString(
            "A Premium subscription is required to connect Microsoft.",
            comment: "Microsoft identity subscription requirement"
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
        // Do not call GIDSignIn.signOut(): that SDK session may belong to one of
        // the independent Google Calendar connections shown below this account.
        CalendarFeedSession.forget()
        account = nil
        errorMessage = nil
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
        errorMessage = nil
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
                errorMessage = error.localizedDescription
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
            errorMessage = nil
            NotificationCenter.default.post(name: .cloudAccountChanged, object: nil)
            await SharedEventRecovery.restoreFromServer()
        } catch {
            errorMessage = error.localizedDescription
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
                        .font(.footnote.weight(.medium))
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
                .font(.footnote)
            }

            if let error = manager.errorMessage {
                Text(error)
                    .font(.footnote)
                    .foregroundStyle(.red)
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
                    .font(.subheadline.weight(.semibold))
                Text("Connect Google, Apple, Microsoft, or all three. Every connected identity opens the same shared-events account.")
                    .font(.footnote)
                    .foregroundStyle(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
                Text("You must share a verified email during sign-in. People will use it to find and invite you to calendars and events.")
                    .font(.footnote)
                    .foregroundStyle(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
        .padding(14)
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
    }

    private var microsoftRow: some View {
        Group {
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
                                .font(.caption.weight(.semibold))
                                .foregroundStyle(.secondary)
                        }
                    }
                }
                .buttonStyle(.plain)
                .disabled(manager.isSigningIn)
            }
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
                .font(.caption.weight(.semibold))
                .foregroundStyle(.green)
            } subtitle: {
                manager.account?.identity(for: provider)?.email
            }

            Button(role: .destructive) {
                manager.signOut(provider: provider)
            } label: {
                Label("Sign Out", systemImage: "rectangle.portrait.and.arrow.right")
                    .font(.footnote.weight(.semibold))
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 7)
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
                        .font(.caption)
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

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    CloudAccountSignInContent()
                } header: {
                    Text("Cloud Calendars account")
                } footer: {
                    Text("These identities are only for App Clip sharing and recovery. They remain separate from calendar-provider logins and sync.")
                }
            }
            .navigationTitle("Sign In")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Close") { dismiss() }
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") { dismiss() }
                        .disabled(!manager.isSignedIn)
                }
            }
        }
    }
}
