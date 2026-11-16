import SwiftUI

/// Legacy `BannerAdView` entry point upgraded to rich/video Native Advanced
/// (`WeatherNativeAdPlacement`) so no low-CPM `BannerView` requests are ever sent.
struct BannerAdView: View {
    @Binding var adsBool: Bool
    let adWidth: CGFloat

    var body: some View {
        WeatherNativeAdPlacement(layout: .compact)
            .frame(maxWidth: adWidth)
            .onAppear {
                adsBool = true
            }
    }
}
