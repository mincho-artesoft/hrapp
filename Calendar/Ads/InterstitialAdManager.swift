#if targetEnvironment(macCatalyst)
import SwiftUI

@MainActor
final class InterstitialAdManager: ObservableObject {
    static let shared = InterstitialAdManager()

    func loadAd() {}
    func showAd() {}
}
#else
import GoogleMobileAds
import UIKit
import SwiftUI

@MainActor
final class InterstitialAdManager: NSObject, FullScreenContentDelegate, ObservableObject {
    static let shared = InterstitialAdManager()

    private var interstitial: InterstitialAd?

    #if DEBUG
    private let adUnitID = "ca-app-pub-3940256099942544/4411468910" // Google test interstitial
    #else
    private let adUnitID = "ca-app-pub-3759868960530173/2510258313" // TODO: replace with real ID
    #endif

    override init() {
        super.init()
        loadAd()
    }

    // В InterstitialAdManager.swift

    func loadAd() {
        // 1. Ако вече имаме заредена реклама, не правим нищо.
        if interstitial != nil {
            print("ℹ️ Interstitial ad already loaded/loading")
            return
        }

        let request = Request()
        
        InterstitialAd.load(with: adUnitID, request: request) { [weak self] ad, error in
            guard let self else { return }

            if let error {
                print("❌ Failed to load interstitial ad: \(error.localizedDescription)")
                return
            }

            self.interstitial = ad
            self.interstitial?.fullScreenContentDelegate = self
            print("✅ Interstitial ad loaded")
        }
    }
    func showAd() {
        guard let interstitial else {
            print("⚠️ Ad wasn't ready")
            loadAd()
            return
        }

        guard let topVC = UIApplication.shared.topMostViewController else {
            print("⚠️ Could not find a view controller to present from")
            return
        }

        interstitial.present(from: topVC)
    }

    // MARK: - FullScreenContentDelegate

    func adDidDismissFullScreenContent(_ ad: FullScreenPresentingAd) {
        print("🔹 Interstitial ad dismissed")
        interstitial = nil
        loadAd()
    }

    func ad(_ ad: FullScreenPresentingAd, didFailToPresentFullScreenContentWithError error: Error) {
        print("❌ Ad failed to present: \(error.localizedDescription)")
        interstitial = nil
        loadAd()
    }
}
#endif
