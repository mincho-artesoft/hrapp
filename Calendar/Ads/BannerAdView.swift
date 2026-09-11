import SwiftUI
import GoogleMobileAds

struct BannerAdView: UIViewRepresentable {
    /// A single source of truth that SwiftUI can react to
    @Binding var adsBool: Bool
    let adWidth: CGFloat

    /// Observed so that consent landing after the banner is already on screen
    /// redraws this view and lets the request go out then.
    @ObservedObject private var consent = ConsentManager.shared

    #if DEBUG
    // Google Test ID за банери
    private let adUnitID = "ca-app-pub-3940256099942544/2934735716"
    #else
    // Твоят реален Banner ID
    private let adUnitID = "ca-app-pub-3759868960530173/2434919582"
    #endif
    
    // MARK: - UIViewRepresentable
    func makeUIView(context: Context) -> BannerView {
        let adSize = currentOrientationAnchoredAdaptiveBanner(width: adWidth)

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

        context.coordinator.loadIfAllowed(banner)
        return banner
    }

    func updateUIView(_ uiView: BannerView, context: Context) {
        context.coordinator.loadIfAllowed(uiView)
    }

    // MARK: - Coordinator
    func makeCoordinator() -> Coordinator {
        Coordinator(adsBool: $adsBool)
    }

    final class Coordinator: NSObject, BannerViewDelegate {
        @Binding var adsBool: Bool
        private var hasRequested = false

        init(adsBool: Binding<Bool>) { _adsBool = adsBool }

        /// One request per banner, and not before there is a consent string
        /// to send with it.
        @MainActor
        func loadIfAllowed(_ banner: BannerView) {
            guard !hasRequested, ConsentManager.shared.canRequestAds else { return }
            hasRequested = true
            banner.load(Request())
        }

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
