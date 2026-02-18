import SwiftUI
import GoogleMobileAds

struct BannerAdView: UIViewRepresentable {
    /// A single source of truth that SwiftUI can react to
    @Binding var adsBool: Bool

    #if DEBUG
    // Google Test ID за банери
    private let adUnitID = "ca-app-pub-3940256099942544/2934735716"
    #else
    // Твоят реален Banner ID
    private let adUnitID = "ca-app-pub-3759868960530173/2434919582"
    #endif
    
    // MARK: - UIViewRepresentable
    func makeUIView(context: Context) -> BannerView {
        let width   = UIScreen.main.bounds.width
        let adSize  = currentOrientationAnchoredAdaptiveBanner(width: width)

        let banner  = BannerView(adSize: adSize)
        banner.adUnitID            = adUnitID
        banner.delegate            = context.coordinator
        banner.rootViewController  = UIApplication
            .shared
            .connectedScenes
            .compactMap { $0 as? UIWindowScene }
            .flatMap   { $0.windows }
            .first     { $0.isKeyWindow }?
            .rootViewController

        banner.load(Request())     // start loading the ad
        return banner
    }

    func updateUIView(_ uiView: BannerView, context: Context) {}

    // MARK: - Coordinator
    func makeCoordinator() -> Coordinator {
        Coordinator(adsBool: $adsBool)
    }

    final class Coordinator: NSObject, BannerViewDelegate {
        @Binding var adsBool: Bool
        init(adsBool: Binding<Bool>) { _adsBool = adsBool }

        func bannerViewDidReceiveAd(_ bannerView: BannerView) {
            print("✅ Banner received")
            adsBool = true             // show the banner if you want
        }

        func bannerView(
            _ bannerView: BannerView,
            didFailToReceiveAdWithError error: Error
        ) {
            adsBool = false            // hide the banner or fall back
            print("❌ Banner failed: \(error.localizedDescription)")
        }
    }
}
