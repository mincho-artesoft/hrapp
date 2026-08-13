import SwiftUI
import UIKit
@preconcurrency import GoogleMobileAds

enum WeatherNativeAdLayout: Int {
    case standard
    case compact

    var totalHeight: CGFloat {
        switch self {
        case .standard: 286
        // Exact minimum for this layout: 120pt media plus the existing
        // attribution, bottom assets, gaps, and vertical card insets.
        case .compact: 224
        }
    }

    var mediaHeight: CGFloat {
        switch self {
        case .standard: 166
        case .compact: 120
        }
    }

    var bodyLineLimit: Int {
        switch self {
        case .standard: 2
        case .compact: 1
        }
    }
}

/// A native Google Mobile Ads placement shared by every Weather detail sheet.
/// It collapses completely until an ad is available, so failed or slow loads
/// never leave an empty card between the Weather sections.
struct WeatherNativeAdPlacement: View {
    @ObservedObject private var subscriptionManager = SubscriptionManager.shared
    @State private var isLoaded = false
    @State private var didFail = false

    let layout: WeatherNativeAdLayout

    var body: some View {
        Group {
            if subscriptionManager.subscriptionStatus == .base {
                WeatherNativeAdRepresentable(
                    layout: layout,
                    isLoaded: $isLoaded,
                    didFail: $didFail
                )
                    // Google validates the registered asset frames when the native
                    // ad is attached. The inner frame keeps UIKit at its real size
                    // while the outer frame collapses the still-loading placement.
                    .frame(height: layout.totalHeight)
                    .frame(
                        height: isLoaded && !didFail ? layout.totalHeight : 0,
                        alignment: .top
                    )
                    .clipped()
                    .opacity(isLoaded ? 1 : 0)
                    .accessibilityHidden(!isLoaded)
            } else {
                Color.clear
                    .frame(height: 0)
                    .accessibilityHidden(true)
            }
        }
    }
}

private struct WeatherNativeAdRepresentable: UIViewRepresentable {
    let layout: WeatherNativeAdLayout
    @Binding var isLoaded: Bool
    @Binding var didFail: Bool

    func makeCoordinator() -> Coordinator {
        Coordinator(isLoaded: $isLoaded, didFail: $didFail)
    }

    func makeUIView(context: Context) -> WeatherNativeAdContainerView {
        let view = WeatherNativeAdContainerView(layout: layout)
        context.coordinator.attach(to: view)
        return view
    }

    func updateUIView(_ uiView: WeatherNativeAdContainerView, context: Context) {}

    @MainActor
    final class Coordinator: NSObject, @preconcurrency NativeAdLoaderDelegate {
        @Binding private var isLoaded: Bool
        @Binding private var didFail: Bool
        private weak var containerView: WeatherNativeAdContainerView?
        private var adLoader: AdLoader?

        init(isLoaded: Binding<Bool>, didFail: Binding<Bool>) {
            _isLoaded = isLoaded
            _didFail = didFail
        }

        func attach(to containerView: WeatherNativeAdContainerView) {
            self.containerView = containerView

            #if DEBUG
            let adUnitID = "ca-app-pub-3940256099942544/3986624511"
            #else
            let adUnitID = "ca-app-pub-3759868960530173/8627112781"
            #endif

            let mediaOptions = NativeAdMediaAdLoaderOptions()
            mediaOptions.mediaAspectRatio = .landscape

            let loader = AdLoader(
                adUnitID: adUnitID,
                rootViewController: Self.presentingViewController,
                adTypes: [.native],
                options: [mediaOptions]
            )
            loader.delegate = self
            adLoader = loader
            loader.load(Request())
        }

        func adLoader(_ adLoader: AdLoader, didReceive nativeAd: NativeAd) {
            guard let containerView else { return }
            nativeAd.rootViewController = Self.presentingViewController
            didFail = false
            containerView.render(nativeAd)
            isLoaded = true
        }

        func adLoader(_ adLoader: AdLoader, didFailToReceiveAdWithError error: Error) {
            isLoaded = false
            didFail = true
            #if DEBUG
            print("❌ Weather native ad failed: \(error.localizedDescription)")
            #endif
        }

        private static var presentingViewController: UIViewController? {
            let root = UIApplication.shared.connectedScenes
                .compactMap { $0 as? UIWindowScene }
                .filter { $0.activationState == .foregroundActive }
                .flatMap(\.windows)
                .first(where: \.isKeyWindow)?
                .rootViewController

            var current = root
            while let presented = current?.presentedViewController {
                current = presented
            }
            return current
        }
    }
}

private final class WeatherNativeAdContainerView: UIView {
    private let layout: WeatherNativeAdLayout
    private let nativeAdView = NativeAdView()
    private let mediaView = MediaView()
    private let headlineLabel = UILabel()
    private let advertiserLabel = UILabel()
    private let bodyLabel = UILabel()
    private let iconImageView = UIImageView()
    private let callToActionButton = UIButton(type: .system)
    private let adBadgeLabel = UILabel()
    private let adChoicesView = AdChoicesView()
    private var pendingNativeAd: NativeAd?

    init(layout: WeatherNativeAdLayout) {
        self.layout = layout
        super.init(frame: .zero)
        configureView()
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    private func configureView() {
        backgroundColor = .clear

        nativeAdView.translatesAutoresizingMaskIntoConstraints = false
        nativeAdView.backgroundColor = UIColor.white.withAlphaComponent(0.15)
        nativeAdView.layer.cornerRadius = 20
        nativeAdView.layer.masksToBounds = true
        addSubview(nativeAdView)

        adChoicesView.translatesAutoresizingMaskIntoConstraints = false
        nativeAdView.addSubview(adChoicesView)

        let topStack = UIStackView()
        topStack.axis = .horizontal
        topStack.alignment = .center
        topStack.spacing = 8
        topStack.translatesAutoresizingMaskIntoConstraints = false

        adBadgeLabel.text = "Ad"
        adBadgeLabel.textColor = .white
        adBadgeLabel.font = .systemFont(ofSize: 10, weight: .bold)
        adBadgeLabel.textAlignment = .center
        adBadgeLabel.backgroundColor = UIColor.systemBlue.withAlphaComponent(0.9)
        adBadgeLabel.layer.cornerRadius = 4
        adBadgeLabel.layer.masksToBounds = true
        adBadgeLabel.translatesAutoresizingMaskIntoConstraints = false

        advertiserLabel.textColor = .secondaryLabel
        advertiserLabel.font = .systemFont(ofSize: 12, weight: .medium)
        advertiserLabel.setContentCompressionResistancePriority(.defaultLow, for: .horizontal)

        topStack.addArrangedSubview(adBadgeLabel)
        topStack.addArrangedSubview(advertiserLabel)
        topStack.addArrangedSubview(UIView())

        mediaView.translatesAutoresizingMaskIntoConstraints = false
        mediaView.backgroundColor = UIColor.black.withAlphaComponent(0.18)
        mediaView.layer.cornerRadius = 12
        mediaView.layer.masksToBounds = true

        iconImageView.translatesAutoresizingMaskIntoConstraints = false
        iconImageView.contentMode = .scaleAspectFill
        iconImageView.layer.cornerRadius = 10
        iconImageView.layer.masksToBounds = true

        headlineLabel.textColor = .label
        headlineLabel.font = .systemFont(ofSize: 16, weight: .semibold)
        headlineLabel.numberOfLines = 1
        headlineLabel.adjustsFontSizeToFitWidth = true
        headlineLabel.minimumScaleFactor = 0.72

        bodyLabel.textColor = .secondaryLabel
        bodyLabel.font = .systemFont(ofSize: 12)
        bodyLabel.numberOfLines = layout.bodyLineLimit

        let textStack = UIStackView(arrangedSubviews: [headlineLabel, bodyLabel])
        textStack.axis = .vertical
        textStack.alignment = .fill
        textStack.spacing = 3

        callToActionButton.translatesAutoresizingMaskIntoConstraints = false
        callToActionButton.setTitleColor(.white, for: .normal)
        callToActionButton.titleLabel?.font = .systemFont(ofSize: 13, weight: .semibold)
        callToActionButton.backgroundColor = .systemBlue
        callToActionButton.layer.cornerRadius = 10
        callToActionButton.isUserInteractionEnabled = false

        let bottomStack = UIStackView(arrangedSubviews: [iconImageView, textStack, callToActionButton])
        bottomStack.axis = .horizontal
        bottomStack.alignment = .center
        bottomStack.spacing = 10
        bottomStack.translatesAutoresizingMaskIntoConstraints = false

        nativeAdView.addSubview(topStack)
        nativeAdView.addSubview(mediaView)
        nativeAdView.addSubview(bottomStack)

        NSLayoutConstraint.activate([
            nativeAdView.topAnchor.constraint(equalTo: topAnchor),
            nativeAdView.leadingAnchor.constraint(equalTo: leadingAnchor),
            nativeAdView.trailingAnchor.constraint(equalTo: trailingAnchor),
            nativeAdView.bottomAnchor.constraint(equalTo: bottomAnchor),

            adChoicesView.topAnchor.constraint(equalTo: nativeAdView.topAnchor, constant: 8),
            adChoicesView.trailingAnchor.constraint(equalTo: nativeAdView.trailingAnchor, constant: -8),
            adChoicesView.widthAnchor.constraint(equalToConstant: 22),
            adChoicesView.heightAnchor.constraint(equalToConstant: 22),

            topStack.topAnchor.constraint(equalTo: nativeAdView.topAnchor, constant: 12),
            topStack.leadingAnchor.constraint(equalTo: nativeAdView.leadingAnchor, constant: 14),
            topStack.trailingAnchor.constraint(equalTo: nativeAdView.trailingAnchor, constant: -14),

            adBadgeLabel.widthAnchor.constraint(equalToConstant: 26),
            adBadgeLabel.heightAnchor.constraint(equalToConstant: 18),

            mediaView.topAnchor.constraint(equalTo: topStack.bottomAnchor, constant: 8),
            mediaView.leadingAnchor.constraint(equalTo: nativeAdView.leadingAnchor, constant: 12),
            mediaView.trailingAnchor.constraint(equalTo: nativeAdView.trailingAnchor, constant: -12),
            mediaView.heightAnchor.constraint(equalToConstant: layout.mediaHeight),

            bottomStack.topAnchor.constraint(equalTo: mediaView.bottomAnchor, constant: 10),
            bottomStack.leadingAnchor.constraint(equalTo: nativeAdView.leadingAnchor, constant: 12),
            bottomStack.trailingAnchor.constraint(equalTo: nativeAdView.trailingAnchor, constant: -12),
            bottomStack.bottomAnchor.constraint(equalTo: nativeAdView.bottomAnchor, constant: -12),

            iconImageView.widthAnchor.constraint(equalToConstant: 44),
            iconImageView.heightAnchor.constraint(equalToConstant: 44),
            callToActionButton.widthAnchor.constraint(greaterThanOrEqualToConstant: 76),
            callToActionButton.heightAnchor.constraint(equalToConstant: 38)
        ])

        nativeAdView.headlineView = headlineLabel
        nativeAdView.advertiserView = advertiserLabel
        nativeAdView.bodyView = bodyLabel
        nativeAdView.iconView = iconImageView
        nativeAdView.mediaView = mediaView
        nativeAdView.callToActionView = callToActionButton
        nativeAdView.adChoicesView = adChoicesView
    }

    func render(_ nativeAd: NativeAd) {
        headlineLabel.text = nativeAd.headline
        advertiserLabel.text = nativeAd.advertiser ?? nativeAd.store ?? ""
        bodyLabel.text = nativeAd.body
        bodyLabel.isHidden = nativeAd.body == nil
        iconImageView.image = nativeAd.icon?.image
        iconImageView.isHidden = nativeAd.icon == nil
        callToActionButton.setTitle(nativeAd.callToAction, for: .normal)
        callToActionButton.isHidden = nativeAd.callToAction == nil
        mediaView.mediaContent = nativeAd.mediaContent
        pendingNativeAd = nativeAd
        setNeedsLayout()
        layoutIfNeeded()
        registerPendingAdIfLayoutIsReady()
    }

    override func layoutSubviews() {
        super.layoutSubviews()
        registerPendingAdIfLayoutIsReady()
    }

    private func registerPendingAdIfLayoutIsReady() {
        guard let pendingNativeAd,
              bounds.width > 0,
              bounds.height > 0,
              nativeAdView.bounds.width > 0,
              nativeAdView.bounds.height > 0 else { return }

        nativeAdView.layoutIfNeeded()

        #if DEBUG
        let assetViews: [(String, UIView)] = [
            ("headline", headlineLabel),
            ("advertiser", advertiserLabel),
            ("body", bodyLabel),
            ("icon", iconImageView),
            ("media", mediaView),
            ("callToAction", callToActionButton),
            ("adChoices", adChoicesView)
        ]

        for (name, assetView) in assetViews where !assetView.isHidden {
            let assetFrame = assetView.convert(assetView.bounds, to: nativeAdView)
            if !nativeAdView.bounds.contains(assetFrame) {
                print(
                    "❌ Weather native ad asset outside NativeAdView: "
                    + "\(name), asset=\(assetFrame), native=\(nativeAdView.bounds)"
                )
            }
        }
        #endif

        // Associate the ad only after Auto Layout has produced the final,
        // non-zero frames for every registered asset.
        nativeAdView.nativeAd = pendingNativeAd
        self.pendingNativeAd = nil
    }
}
