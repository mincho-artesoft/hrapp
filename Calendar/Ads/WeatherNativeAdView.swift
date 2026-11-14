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

/// One loader per stable placement. A one-point sentinel reserves no ad-sized
/// gap but allows visibility to be measured before requesting an ad.
struct WeatherNativeAdPlacement: View {
    @ObservedObject private var subscription = SubscriptionManager.shared
    @ObservedObject private var consent = ConsentManager.shared
    @StateObject private var model = WeatherNativeAdModel()
    let layout: WeatherNativeAdLayout

    var body: some View {
        Group {
            if subscription.hasCheckedEntitlements && subscription.subscriptionStatus == .base {
                WeatherNativeAdRepresentable(layout: layout, model: model)
                    .frame(height: layout.totalHeight)
                    .frame(height: model.isLoaded ? layout.totalHeight : 1, alignment: .top)
                    .clipped()
                    .accessibilityHidden(!model.isLoaded)
                    .task {
                        while !Task.isCancelled {
                            model.loadIfVisible()
                            do { try await Task.sleep(for: .milliseconds(500)) }
                            catch { break }
                        }
                    }
            }
        }
        .onChange(of: subscription.subscriptionStatus) { _, _ in model.reset() }
        .onChange(of: consent.privacyRevision) { _, _ in model.reset() }
    }
}

private struct WeatherNativeAdRepresentable: UIViewRepresentable {
    let layout: WeatherNativeAdLayout
    @ObservedObject var model: WeatherNativeAdModel

    func makeUIView(context: Context) -> WeatherNativeAdContainerView {
        let view = WeatherNativeAdContainerView(layout: layout)
        model.attach(to: view)
        return view
    }

    func updateUIView(_ view: WeatherNativeAdContainerView, context: Context) {
        model.attach(to: view)
    }
}

@MainActor
private final class WeatherNativeAdModel: NSObject, ObservableObject,
    @preconcurrency NativeAdLoaderDelegate, @preconcurrency NativeAdDelegate {
    @Published private(set) var isLoaded = false
    private weak var container: WeatherNativeAdContainerView?
    private var loader: AdLoader?
    private var ad: NativeAd?
    private var loadedAt: Date?
    private var retryAfter = Date.distantPast

    func attach(to view: WeatherNativeAdContainerView) {
        guard container !== view else { return }
        container = view
        if let ad { view.render(ad) }
    }

    func reset() {
        loader?.delegate = nil
        loader = nil
        ad = nil
        loadedAt = nil
        container?.clearAd()
        isLoaded = false
    }

    func loadIfVisible() {
        guard ConsentManager.shared.canLoadAds, let container,
              let window = container.window,
              let presenter = UIApplication.shared.topMostViewController,
              container.isDescendant(of: presenter.view),
              !presenter.isBeingPresented, !presenter.isBeingDismissed else { return }
        // Respect scroll clipping, hidden tabs and sheets above this placement.
        var visible = container.convert(container.bounds, to: window).intersection(window.bounds)
        var ancestor: UIView? = container
        while let view = ancestor {
            guard !view.isHidden, view.alpha > 0.01 else { return }
            if view.clipsToBounds {
                visible = visible.intersection(view.convert(view.bounds, to: window))
            }
            ancestor = view.superview
        }
        guard !visible.isNull, visible.width > 1, visible.height >= 0.5 else { return }
        if let loadedAt, Date().timeIntervalSince(loadedAt) >= 3600 { reset() }
        guard ad == nil, loader == nil, Date() >= retryAfter else { return }
        #if DEBUG
        let unit = "ca-app-pub-3940256099942544/3986624511"
        #else
        let unit = "ca-app-pub-3759868960530173/8627112781"
        #endif
        let options = NativeAdMediaAdLoaderOptions()
        options.mediaAspectRatio = .landscape
        let request = AdLoader(adUnitID: unit, rootViewController: presenter,
                               adTypes: [.native], options: [options])
        loader = request
        request.delegate = self
        request.load(Request())
        #if DEBUG
        print("[WeatherAds] Requested visible placement")
        #endif
    }

    func adLoader(_ adLoader: AdLoader, didReceive nativeAd: NativeAd) {
        guard adLoader === loader else { return }
        loader = nil
        guard ConsentManager.shared.canLoadAds else { return }
        ad = nativeAd
        loadedAt = Date()
        nativeAd.delegate = self
        nativeAd.rootViewController = UIApplication.shared.topMostViewController
        container?.render(nativeAd)
        isLoaded = true
    }

    func adLoader(_ adLoader: AdLoader, didFailToReceiveAdWithError error: Error) {
        guard adLoader === loader else { return }
        loader = nil
        retryAfter = Date().addingTimeInterval(60)
        #if DEBUG
        print("[WeatherAds] Load failed; retry only while visible after cooldown: \(error.localizedDescription)")
        #endif
    }

    func nativeAdDidRecordImpression(_ nativeAd: NativeAd) {
        #if DEBUG
        print("[WeatherAds] Impression recorded")
        #endif
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

        adBadgeLabel.text = NSLocalizedString("Ad", comment: "Advertisement disclosure")
        adBadgeLabel.textColor = .white
        adBadgeLabel.font = .systemFont(ofSize: 10, weight: .bold)
        adBadgeLabel.textAlignment = .center
        adBadgeLabel.backgroundColor = UIColor.systemBlue.withAlphaComponent(0.9)
        adBadgeLabel.layer.cornerRadius = 4
        adBadgeLabel.layer.masksToBounds = true
        adBadgeLabel.translatesAutoresizingMaskIntoConstraints = false
        adBadgeLabel.setContentCompressionResistancePriority(.required, for: .horizontal)

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

            adBadgeLabel.widthAnchor.constraint(greaterThanOrEqualToConstant: 26),
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

    func clearAd() {
        pendingNativeAd = nil
        nativeAdView.nativeAd = nil
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
