// test private let adUnitID = "ca-app-pub-3940256099942544/5575463023"   // официалният тестов ID за iOS App-Open
//   private let adUnitID = "ca-app-pub-2492229660203559/2297380292"


@preconcurrency import GoogleMobileAds
import UIKit

@MainActor
class AppOpenAdManager: NSObject, FullScreenContentDelegate {

  static let shared = AppOpenAdManager()

  private var appOpenAd: AppOpenAd?
  private var isLoadingAd = false
  private var isShowingAd = false
  private var loadTime: Date?

  private let adUnitID = "ca-app-pub-3940256099942544/5575463023" 

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
        // 1. Ако вече показваме реклама → излизаме.
        guard !isShowingAd else { return }

        // 2. Ако още няма готова реклама → зареждаме и се връщаме.
        guard isAdAvailable() else {
            Task { await loadAd() }   // асинхронно презареждане
            return
        }

        // 3. Имаме спот → търсим root UIViewController, за да го презентираме.
        guard let ad = appOpenAd,
              let root = UIApplication.shared
                    .connectedScenes
                    .compactMap({ $0 as? UIWindowScene })        // сцени
                    .flatMap({ $0.windows })                     // всички прозорци
                    .first(where: { $0.isKeyWindow })?           // активният прозорец
                    .rootViewController                          // неговият root VC
        else { return }

        // 4. Показваме рекламата.
        isShowingAd = true
        ad.present(from: root)
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
