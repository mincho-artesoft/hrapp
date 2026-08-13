import SwiftUI

private enum WeatherAdPlacement: Int {
    case compactNative
    case banner
    case standardNative
}

/// Persists the exact Weather ad sequence across launches:
/// compact native -> banner -> standard native -> banner -> repeat.
@MainActor
private enum WeatherAdRotationStore {
    private static let nextIndexKey = "weather.adRotation.nextIndex.v2"
    private static let sequence: [WeatherAdPlacement] = [
        .compactNative,
        .banner,
        .standardNative,
        .banner
    ]

    static func claimNextPlacement(defaults: UserDefaults = .standard) -> WeatherAdPlacement {
        let storedIndex = max(0, defaults.integer(forKey: nextIndexKey))
        let index = storedIndex % sequence.count
        let placement = sequence[index]
        defaults.set((index + 1) % sequence.count, forKey: nextIndexKey)
        return placement
    }
}

/// One shared ad placement for the main Weather screen and all Weather sheets.
/// Each visible instance claims its format only once, so SwiftUI redraws do not
/// advance the persisted rotation.
struct WeatherRotatingAdPlacement: View {
    @ObservedObject private var subscriptionManager = SubscriptionManager.shared
    @State private var selectedPlacement: WeatherAdPlacement?
    @State private var bannerIsAvailable = true

    var nativeHorizontalPadding: CGFloat = 0

    var body: some View {
        Group {
            if subscriptionManager.subscriptionStatus == .base {
                switch selectedPlacement {
                case .compactNative:
                    WeatherNativeAdPlacement(layout: .compact)
                        .padding(.horizontal, nativeHorizontalPadding)

                case .banner:
                    WeatherBannerAdCard(isAvailable: $bannerIsAvailable)
                        .padding(.horizontal, nativeHorizontalPadding)

                case .standardNative:
                    WeatherNativeAdPlacement(layout: .standard)
                        .padding(.horizontal, nativeHorizontalPadding)

                case nil:
                    Color.clear
                        .frame(height: 0)
                        .accessibilityHidden(true)
                }
            }
        }
        .onAppear(perform: claimFormatIfNeeded)
        .onChange(of: subscriptionManager.subscriptionStatus) { _, _ in
            claimFormatIfNeeded()
        }
    }

    @MainActor
    private func claimFormatIfNeeded() {
        guard subscriptionManager.subscriptionStatus == .base,
              selectedPlacement == nil else { return }

        selectedPlacement = WeatherAdRotationStore.claimNextPlacement()

        #if DEBUG
        let placementName: String
        switch selectedPlacement {
        case .compactNative: placementName = "Compact NativeAd (224pt)"
        case .banner: placementName = "Banner"
        case .standardNative: placementName = "Standard NativeAd (286pt)"
        case nil: placementName = "None"
        }
        print("🔄 [WeatherAds] Claimed next persisted placement: \(placementName)")
        #endif
    }
}

private struct WeatherBannerAdCard: View {
    @Binding var isAvailable: Bool

    var body: some View {
        GeometryReader { proxy in
            let horizontalInset: CGFloat = 12
            let availableWidth = max(1, proxy.size.width - horizontalInset * 2)

            BannerAdView(
                adsBool: $isAvailable,
                adWidth: availableWidth
            )
            .frame(width: availableWidth, height: 60)
            .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .center)
            .padding(.horizontal, horizontalInset)
        }
        .frame(height: isAvailable ? 84 : 0)
        .background {
            if isAvailable {
                RoundedRectangle(cornerRadius: 20, style: .continuous)
                    .fill(Color.white.opacity(0.15))
            }
        }
        .clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))
        .accessibilityHidden(!isAvailable)
    }
}
