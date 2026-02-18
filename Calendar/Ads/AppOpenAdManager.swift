@preconcurrency import GoogleMobileAds
import UIKit

@MainActor
class AppOpenAdManager: NSObject, FullScreenContentDelegate {

  static let shared = AppOpenAdManager()

  private var appOpenAd: AppOpenAd?
  private var isLoadingAd = false
  private var isShowingAd = false
  private var loadTime: Date?

    #if DEBUG
    // Google Test ID (За симулатор и тестове на устройство)
    private let adUnitID = "ca-app-pub-3940256099942544/5575463023"
    #else
    // Твоят реален ID (За App Store)
    private let adUnitID = "ca-app-pub-3759868960530173/8791851472"
    #endif
    
  /// Зарежда нов спот (ако няма или е експирал).
  func loadAd() async {
    guard !isLoadingAd, !isAdAvailable() else { return }
    isLoadingAd = true
    do {
      appOpenAd = try await AppOpenAd.load(
        with: adUnitID,
        request: Request()
      )
      appOpenAd?.fullScreenContentDelegate = self
      loadTime = Date()
      print("✅ App-open ad loaded")
    } catch {
      print("❌ Failed to load app-open ad:", error.localizedDescription)
    }
    isLoadingAd = false
  }

    @MainActor
    func showAdIfAvailable() {
        // 1. Ако вече показваме или зареждаме – не прави нищо
        guard !isShowingAd else { return }

        // 2. Провери дали имаме готова и "прясна" реклама
        if !isAdAvailable() {
            // Ако няма готова, просто пусни зареждане за следващия път и излез
            Task { await loadAd() }
            return
        }

        // 3. Намери активната сцена и Root ViewController
        guard let windowScene = UIApplication.shared.connectedScenes.first(where: { $0.activationState == .foregroundActive }) as? UIWindowScene,
              let root = windowScene.windows.first(where: { $0.isKeyWindow })?.rootViewController else {
            return
        }

        // 4. Покажи рекламата
        isShowingAd = true
        appOpenAd?.present(from: root)
    }


  // MARK: -- FullScreenContentDelegate

  func adDidDismissFullScreenContent(_ ad: FullScreenPresentingAd) {
    appOpenAd = nil
    isShowingAd = false
    Task { await loadAd() }          // презареди
  }

  // MARK: -- Helpers

  private func isAdAvailable() -> Bool {
    guard let loadTime else { return false }
    let fresh = Date().timeIntervalSince(loadTime) < 4 * 3600
    return appOpenAd != nil && fresh
  }
}
