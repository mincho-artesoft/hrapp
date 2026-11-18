@preconcurrency import GoogleMobileAds
import UIKit
import SwiftUI

@MainActor
final class InterstitialAdManager: NSObject, FullScreenContentDelegate, ObservableObject {
    static let shared = InterstitialAdManager()

    private var interstitial: InterstitialAd?
    private var isLoading = false
    private var generation = 0
    private var loadedAt: Date?
    private(set) var isShowing = false

    #if DEBUG
    private let adUnitID = "ca-app-pub-3940256099942544/4411468910" // Google test interstitial
    #else
    private let adUnitID = "ca-app-pub-3759868960530173/2510258313"
    #endif

    override init() {
        super.init()
    }

    // В InterstitialAdManager.swift

    func loadAd() {
        // No request goes out without a consent string to carry.
        guard ConsentManager.shared.canLoadAds else { return }
        if let loadedAt, Date().timeIntervalSince(loadedAt) >= 3600 { interstitial = nil }

        if interstitial != nil || isLoading {
            return
        }

        isLoading = true
        let requestGeneration = generation
        let request = Request()
        let unit = adUnitID
        
        Task { @MainActor [weak self] in
            do {
                let ad = try await InterstitialAd.load(with: unit, request: request)
                guard let self, self.generation == requestGeneration else { return }
                self.isLoading = false
                guard ConsentManager.shared.canLoadAds else { return }
                self.loadedAt = Date()
                self.interstitial = ad
                self.interstitial?.fullScreenContentDelegate = self
                print("✅ Interstitial ad loaded")
            } catch {
                guard let self, self.generation == requestGeneration else { return }
                self.isLoading = false
                print("❌ Failed to load interstitial ad: \(error.localizedDescription)")
            }
        }
    }
    func reset() {
        generation += 1
        interstitial = nil
        loadedAt = nil
        isLoading = false
    }

    func showAd() {
        guard ConsentManager.shared.canLoadAds else { return }
        if let loadedAt, Date().timeIntervalSince(loadedAt) >= 3600 {
            interstitial = nil
        }
        guard !CloudAccountManager.shared.isSigningIn,
              !ReviewManager.shouldPauseAppOpenAds,
              !isShowing,
              !AppOpenAdManager.shared.isShowingAd else { return }
        guard let interstitial else {
            print("⚠️ Ad wasn't ready")
            loadAd()
            return
        }

        guard let topVC = UIApplication.shared.topMostViewController,
              topVC.viewIfLoaded?.window != nil,
              !topVC.isBeingPresented, !topVC.isBeingDismissed,
              !(topVC is UIAlertController) else {
            print("⚠️ Could not find a view controller to present from")
            return
        }

        isShowing = true
        interstitial.present(from: topVC)
    }

    // MARK: - FullScreenContentDelegate

    func adDidDismissFullScreenContent(_ ad: FullScreenPresentingAd) {
        print("🔹 Interstitial ad dismissed")
        isShowing = false
        interstitial = nil
        loadAd()
    }

    func ad(_ ad: FullScreenPresentingAd, didFailToPresentFullScreenContentWithError error: Error) {
        print("❌ Ad failed to present: \(error.localizedDescription)")
        isShowing = false
        interstitial = nil
        loadAd()
    }
}
