import UIKit
import UserMessagingPlatform

/// Google's User Messaging Platform -- the IAB TCF-registered CMP that gives
/// every ad request from the EEA, the UK and Switzerland a consent string.
///
/// Without one AdMob files those requests under "Requirement to obtain
/// consent: No CMP" and limits what it will fill. The wording, styling and
/// languages of the form live in the AdMob console; all that is decided here
/// is when to show it. Nothing in the app asks for an ad until
/// `canRequestAds` says the answer is in.
@MainActor
final class ConsentManager: ObservableObject {
    static let shared = ConsentManager()

    /// Whether this user has to be given a way back into the form to change
    /// their mind. Drives the row in Settings: Google requires one wherever
    /// the answer is yes, and there is nothing to show anywhere else.
    @Published private(set) var isPrivacyOptionsRequired = false

    private var isGathering = false
    private var didGatherConsent = false

    private init() {
        refreshFromSDK()
    }

    /// Whether an ad request may go out. Outside the consent regions the SDK
    /// says yes as soon as the first lookup lands; inside them, only once the
    /// form has been answered. It is false before the very first lookup of
    /// the app's life comes back, which is what keeps ads off that launch.
    ///
    /// Published rather than read straight off the SDK so the banner and the
    /// weather ad, which are already on screen while the answer is still
    /// coming, get a redraw the moment it flips and can place their request.
    @Published private(set) var canRequestAds = false

    /// Refreshes the stored consent record and presents the form when the SDK
    /// says one is owed. Runs once a launch -- nothing appears outside the
    /// consent regions, or for anyone who has already answered.
    func gatherConsentIfNeeded() async {
        guard !didGatherConsent, !isGathering else { return }
        isGathering = true
        defer { isGathering = false }

        if let failure = await requestConsentInfoUpdate() {
            print("❌ Consent info update failed: \(failure)")
        }

        guard let presenter = UIApplication.shared.topMostViewController else {
            // No window to present from yet, so the form has not been put to
            // the user. Leave the launch unmarked and try again when the app
            // next becomes active rather than spending the session unasked.
            return
        }

        if let failure = await loadAndPresentFormIfRequired(from: presenter) {
            print("❌ Consent form failed: \(failure)")
        }

        refreshFromSDK()
        didGatherConsent = true
    }

    /// Reopens the form so consent can be changed or withdrawn -- the route
    /// the AdMob message points at when it tells the user to look for a
    /// button in the app's privacy settings.
    func presentPrivacyOptionsForm() {
        guard let presenter = UIApplication.shared.topMostViewController else { return }

        ConsentForm.presentPrivacyOptionsForm(from: presenter) { error in
            Task { @MainActor in
                if let error {
                    print("❌ Privacy options form failed: \(error.localizedDescription)")
                }
                self.refreshFromSDK()
            }
        }
    }

    /// Copies the SDK's view of the world onto the published properties.
    /// Called after every step that can change it.
    private func refreshFromSDK() {
        canRequestAds = ConsentInformation.shared.canRequestAds
        isPrivacyOptionsRequired =
            ConsentInformation.shared.privacyOptionsRequirementStatus == .required
    }

    /// The UMP callbacks hand back an `Error`, which cannot cross into the
    /// main actor on its own. Only the message is wanted, so that is what
    /// comes back -- `nil` meaning the step succeeded.
    private func requestConsentInfoUpdate() async -> String? {
        await withCheckedContinuation { continuation in
            ConsentInformation.shared.requestConsentInfoUpdate(with: RequestParameters()) { error in
                continuation.resume(returning: error?.localizedDescription)
            }
        }
    }

    private func loadAndPresentFormIfRequired(from viewController: UIViewController) async -> String? {
        await withCheckedContinuation { continuation in
            ConsentForm.loadAndPresentIfRequired(from: viewController) { error in
                continuation.resume(returning: error?.localizedDescription)
            }
        }
    }
}
