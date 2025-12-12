import SwiftUI
import GoogleMobileAds

struct BannerAdView: UIViewRepresentable {
    /// A single source of truth that SwiftUI can react to
    @Binding var adsBool: Bool
    
    /// Your ad-unit ID
    private let adUnitID = "ca-app-pub-2322123786875027/1752770566"

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
