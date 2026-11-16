import SwiftUI
import MapKit

struct WindMapCanvas: UIViewRepresentable {
    let field: WindMapField?
    let date: Date
    let coordinate: CLLocationCoordinate2D
    let name: String
    let interactive: Bool
    let animated: Bool
    let recenterID: Int
    let imperial: Bool
    var layer: WeatherMapLayer = .wind
    var dark: Bool = true
    var pointForecast: WindMapPointForecast?
    var onRegionChanged: ((MKCoordinateRegion) -> Void)?
    var onTap: (() -> Void)?
    var markerExpanded = true
    var onMarkerTap: (() -> Void)?

    func makeUIView(context: Context) -> WindMapContainer {
        let view = WindMapContainer()
        view.apply(self)
        return view
    }

    func updateUIView(_ view: WindMapContainer, context: Context) { view.apply(self) }
    static func dismantleUIView(_ view: WindMapContainer, coordinator: ()) { view.cancelRendering() }
}

@MainActor
final class WindMapContainer: UIView, MKMapViewDelegate, UIGestureRecognizerDelegate {
    let map = MKMapView()
    private let particles = WindMapParticleView()
    private let marker = WindMapPinView(annotation: nil, reuseIdentifier: "wind")
    private var input: WindMapCanvas?
    private var lastFocus: CLLocationCoordinate2D?
    private var lastRecenter = -1
    private var redraw: DispatchWorkItem?
    private var heatOverlay: WindMapHeatOverlay?
    private var heatTask: Task<Void, Never>?
    private var boundaryTask: Task<Void, Never>?
    private var heatWork: Task<WindMapHeatOverlay, Never>?
    private let heatView = WeatherMapHeatView()
    private let markerSurface = UIView()
    private var composition: UIHostingController<WeatherMapComposition>?

    override init(frame: CGRect) {
        super.init(frame: frame)
        map.overrideUserInterfaceStyle = .dark
        map.preferredConfiguration = MKStandardMapConfiguration(elevationStyle: .flat, emphasisStyle: .default)
        map.pointOfInterestFilter = .excludingAll
        map.showsCompass = false
        map.showsScale = false
        map.isRotateEnabled = false
        map.isPitchEnabled = false
        map.delegate = self
        addSubview(map)
        addSubview(particles)
        addSubview(marker)
        particles.isUserInteractionEnabled = false
        marker.isUserInteractionEnabled = false
        let tap = UITapGestureRecognizer(target: self, action: #selector(mapTapped(_:)))
        tap.cancelsTouchesInView = false
        tap.delegate = self
        map.addGestureRecognizer(tap)
        for recognizer in map.gestureRecognizers ?? [] {
            if let doubleTap = recognizer as? UITapGestureRecognizer, doubleTap.numberOfTapsRequired > 1 {
                tap.require(toFail: doubleTap)
            }
        }
    }

    required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }

    override func layoutSubviews() {
        super.layoutSubviews()
        if let composition {
            composition.view.frame = bounds
        } else { map.frame = bounds }
        if particles.frame != map.bounds {
            particles.frame = map.bounds
            updateField()
        }
        positionMarker()
    }

    func apply(_ newInput: WindMapCanvas) {
        let previous = input
        input = newInput
        if newInput.interactive, composition == nil {
            map.removeFromSuperview()
            particles.removeFromSuperview()
            marker.removeFromSuperview()
            markerSurface.addSubview(marker)
            markerSurface.isUserInteractionEnabled = false
            let configuration = MKStandardMapConfiguration(elevationStyle: .flat, emphasisStyle: .default)
            configuration.pointOfInterestFilter = .excludingAll
            map.preferredConfiguration = configuration
            boundaryTask = Task { [weak self] in
                let geometry = await WeatherMapBoundaries.geometry.value
                guard !Task.isCancelled else { return }
                self?.map.addOverlay(geometry.overlay, level: .aboveRoads)
            }
            let host = UIHostingController(rootView: WeatherMapComposition(map: map, heat: heatView,
                particles: particles, markers: markerSurface, weatherLayer: newInput.layer))
            host.overrideUserInterfaceStyle = .dark
            host.view.backgroundColor = .clear
            host.view.frame = bounds
            host.view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
            host.safeAreaRegions = []
            addSubview(host.view)
            composition = host
        }
        if previous?.layer != newInput.layer, let composition {
            composition.rootView = WeatherMapComposition(map: map, heat: heatView, particles: particles,
                                                         markers: markerSurface, weatherLayer: newInput.layer)
        }
        // Only the fullscreen presentation uses the neutral geographic base.
        map.overrideUserInterfaceStyle = .dark
        map.isScrollEnabled = newInput.interactive
        map.isZoomEnabled = newInput.interactive
        particles.isHidden = newInput.layer != .wind
        particles.animating = newInput.animated && newInput.layer == .wind
        particles.particleCount = newInput.interactive ? 1_200 : 520
        let moved = lastFocus.map { abs($0.latitude - newInput.coordinate.latitude) > 0.001 || abs($0.longitude - newInput.coordinate.longitude) > 0.001 } ?? true
        if moved || lastRecenter != newInput.recenterID {
            lastFocus = newInput.coordinate
            lastRecenter = newInput.recenterID
            map.setRegion(MKCoordinateRegion(center: newInput.coordinate,
                span: MKCoordinateSpan(latitudeDelta: newInput.interactive ? 6 : 5,
                                       longitudeDelta: newInput.interactive ? 4 : 7)), animated: previous != nil && newInput.interactive)
        }
        if previous?.date != newInput.date || previous?.field?.fetchedAt != newInput.field?.fetchedAt || previous?.layer != newInput.layer || moved {
            if newInput.interactive {
                prepareHeat(newInput, clear: previous?.layer != newInput.layer)
            } else {
                if let heatOverlay { map.removeOverlay(heatOverlay) }
                heatOverlay = newInput.field.map {
                    WindMapHeatOverlay(field: $0, date: newInput.date, layer: newInput.layer)
                }
                if let heatOverlay { map.addOverlay(heatOverlay, level: .aboveRoads) }
            }
            updateField()
        }
        updatePin()
    }

    func cancelRendering() {
        heatTask?.cancel()
        heatWork?.cancel()
        boundaryTask?.cancel()
        redraw?.cancel()
        particles.animating = false
    }

    private func prepareHeat(_ input: WindMapCanvas, clear: Bool) {
        heatTask?.cancel()
        heatWork?.cancel()
        if clear || input.field == nil { heatView.heat = nil }
        guard let field = input.field else { return }
        let date = input.date, layer = input.layer
        let work = Task.detached(priority: .userInitiated) {
            WindMapHeatOverlay(field: field, date: date, layer: layer, fullScreen: true)
        }
        heatWork = work
        heatTask = Task { [weak self] in
            let heat = await work.value
            guard !Task.isCancelled, let self else { return }
            self.heatOverlay = heat
            self.heatView.heat = heat
        }
    }

    func mapView(_ mapView: MKMapView, rendererFor overlay: any MKOverlay) -> MKOverlayRenderer {
        if let overlay = overlay as? MKMultiPolyline {
            let renderer = MKMultiPolylineRenderer(multiPolyline: overlay)
            renderer.strokeColor = UIColor.white.withAlphaComponent(0.55)
            renderer.lineWidth = 0.65
            return renderer
        }
        if let overlay = overlay as? WindMapHeatOverlay { return WindMapHeatRenderer(overlay: overlay) }
        return MKOverlayRenderer(overlay: overlay)
    }

    private func configure(_ view: WindMapPinView) {
        guard let input else { return }
        let point = input.pointForecast.flatMap { forecast in
            abs(forecast.coordinate.latitude - input.coordinate.latitude) < 0.001 &&
            abs(WindMapCoordinate.wrappedLongitude(forecast.coordinate.longitude - input.coordinate.longitude)) < 0.001 ? forecast : nil
        }
        // The selected place shows current conditions; playback changes the field.
        let vector = input.interactive ? point?.currentWind ?? point?.vector(at: Date()) : point?.vector(at: input.date)
        let scalar = point?.scalar(at: input.date, layer: input.layer)
        view.set(vector: vector, value: scalar, layer: input.layer, name: input.name,
                 compact: !input.interactive, imperial: input.imperial,
                 expanded: input.markerExpanded, temperature: point?.currentTemperatureCelsius ?? point?.scalar(at: input.date, layer: .temperature),
                 symbol: point?.currentSymbol ?? point?.symbol(at: input.date),
                 low: point?.lowTemperatureCelsius, high: point?.highTemperatureCelsius)
    }

    private func updatePin() {
        configure(marker)
        positionMarker()
    }

    private func positionMarker() {
        guard let input else { return }
        let point = map.convert(input.coordinate, toPointTo: self)
        marker.center = CGPoint(x: point.x, y: point.y + marker.centerOffset.y)
        marker.isHidden = !bounds.insetBy(dx: -40, dy: -40).contains(point)
    }

    func mapViewDidChangeVisibleRegion(_ mapView: MKMapView) {
        positionMarker()
        heatView.project(map: map)
        guard redraw == nil else { return }
        let work = DispatchWorkItem { [weak self] in
            guard let self else { return }
            self.redraw = nil
            self.updateField()
        }
        redraw = work
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.08, execute: work)
    }

    func mapView(_ mapView: MKMapView, regionDidChangeAnimated animated: Bool) {
        updateField()
        input?.onRegionChanged?(mapView.region)
    }

    private func updateField() {
        guard let input, map.bounds.width > 0, map.bounds.height > 0 else { return }
        heatView.project(map: map)
        if input.layer == .wind { particles.prepare(field: input.field, date: input.date, map: map) }
    }

    @objc private func mapTapped(_ gesture: UITapGestureRecognizer) {
        guard let input, input.interactive else { return }
        let point = gesture.location(in: markerSurface)
        if marker.frame.insetBy(dx: 0, dy: -8).contains(point) { input.onMarkerTap?() }
        else { input.onTap?() }
    }

    func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldRecognizeSimultaneouslyWith otherGestureRecognizer: UIGestureRecognizer) -> Bool { true }
}

/// Desaturate only the geographic base. Screen-compositing the weather texture
/// above it preserves MapKit's bright labels and borders, including during pans.
private struct WeatherMapComposition: View {
    let map: MKMapView
    let heat: WeatherMapHeatView
    let particles: UIView
    let markers: UIView
    let weatherLayer: WeatherMapLayer
    var body: some View {
        ZStack {
            WeatherMapSurface(view: map).saturation(0).contrast(2).brightness(-0.32)
            WeatherMapSurface(view: heat).blendMode(.screen).allowsHitTesting(false)
            WeatherMapSurface(view: particles).allowsHitTesting(false)
            WeatherMapSurface(view: markers).allowsHitTesting(false)
        }.compositingGroup().environment(\.colorScheme, .dark).ignoresSafeArea()
    }
}

/// Public-domain outlines complement MapKit's road/place labels. They are
/// bundled, so geographic readability does not depend on a second online API.
private enum WeatherMapBoundaries {
    // Construct the bundled geometry once off the UI executor.
    struct Geometry: @unchecked Sendable { let overlay: MKMultiPolyline }
    static let geometry = Task.detached(priority: .utility) { Geometry(overlay: load()) }
    private static func load() -> MKMultiPolyline {
        guard let url = Bundle.main.url(forResource: "WeatherMapBoundaries", withExtension: "geojson"),
              let data = try? Data(contentsOf: url),
              let objects = try? MKGeoJSONDecoder().decode(data) else { return MKMultiPolyline([]) }
        var lines: [MKPolyline] = []
        func append(_ polygon: MKPolygon) {
            lines.append(MKPolyline(points: polygon.points(), count: polygon.pointCount))
            for hole in polygon.interiorPolygons ?? [] { append(hole) }
        }
        for feature in objects.compactMap({ $0 as? MKGeoJSONFeature }) {
            for geometry in feature.geometry {
                if let polygon = geometry as? MKPolygon { append(polygon) }
                if let polygons = geometry as? MKMultiPolygon { polygons.polygons.forEach(append) }
            }
        }
        return MKMultiPolyline(lines)
    }
}

private struct WeatherMapSurface<Surface: UIView>: UIViewRepresentable {
    let view: Surface
    func makeUIView(context: Context) -> Surface { view }
    func updateUIView(_ uiView: Surface, context: Context) { uiView.overrideUserInterfaceStyle = .dark }
}

@MainActor
private final class WeatherMapHeatView: UIView {
    var heat: WindMapHeatOverlay? { didSet { setNeedsDisplay() } }
    private var visibleRect = MKMapRect.world
    override init(frame: CGRect) {
        super.init(frame: frame)
        isOpaque = false
        backgroundColor = .clear
        isUserInteractionEnabled = false
    }
    required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }
    func project(map: MKMapView) {
        visibleRect = map.visibleMapRect
        setNeedsDisplay()
    }
    override func draw(_ rect: CGRect) {
        guard let heat, let image = heat.image, let context = UIGraphicsGetCurrentContext(),
              visibleRect.width > 0, visibleRect.height > 0 else { return }
        context.interpolationQuality = .high
        let field = heat.boundingMapRect
        // Wrap copies are necessary when the viewport crosses the date line.
        let nearest = ((visibleRect.midX - field.midX) / MKMapSize.world.width).rounded()
        for copy in -1...1 {
            let x = field.minX + (nearest + Double(copy)) * MKMapSize.world.width
            let destination = CGRect(x: (x - visibleRect.minX) / visibleRect.width * bounds.width,
                y: (field.minY - visibleRect.minY) / visibleRect.height * bounds.height,
                width: field.width / visibleRect.width * bounds.width,
                height: field.height / visibleRect.height * bounds.height)
            guard destination.intersects(bounds) else { continue }
            UIImage(cgImage: image).draw(in: destination)
        }
    }
}

@MainActor
private final class WindMapPinView: MKAnnotationView {
    private let bubble = UILabel()
    private let caption = UILabel()
    private let tip = CAShapeLayer()
    private let dot = UIView()
    private let extremes = UILabel()
    private let temperatureArc = CAGradientLayer()
    private let arcMask = CAShapeLayer()
    private let temperatureIndicator = CAShapeLayer()

    override init(annotation: (any MKAnnotation)?, reuseIdentifier: String?) {
        super.init(annotation: annotation, reuseIdentifier: reuseIdentifier)
        addSubview(bubble)
        addSubview(caption)
        layer.insertSublayer(tip, at: 0)
        addSubview(dot)
        addSubview(extremes)
        extremes.textAlignment = .center
        extremes.font = .systemFont(ofSize: 10, weight: .semibold)
        layer.addSublayer(temperatureArc)
        layer.addSublayer(temperatureIndicator)
        temperatureIndicator.strokeColor = UIColor(white: 0.13, alpha: 1).cgColor
        temperatureIndicator.lineWidth = 1.5
        temperatureArc.mask = arcMask
        arcMask.fillColor = UIColor.clear.cgColor
        arcMask.strokeColor = UIColor.white.cgColor
        arcMask.lineWidth = 3
        arcMask.lineCap = .round
        dot.backgroundColor = .white
        dot.layer.cornerRadius = 4
        bubble.textColor = .white
        bubble.textAlignment = .center
        bubble.numberOfLines = 3
        bubble.backgroundColor = UIColor(red: 0.06, green: 0.37, blue: 0.53, alpha: 0.95)
        bubble.layer.borderColor = UIColor.white.withAlphaComponent(0.9).cgColor
        bubble.layer.borderWidth = 2
        bubble.layer.masksToBounds = true
        caption.textColor = .white
        caption.textAlignment = .center
        caption.font = .systemFont(ofSize: 10, weight: .medium)
        caption.layer.shadowColor = UIColor.black.cgColor
        caption.layer.shadowOpacity = 1
        caption.layer.shadowRadius = 2
        caption.layer.shadowOffset = .zero
        displayPriority = .required
        isAccessibilityElement = true
    }

    required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }

    func set(vector: WindMapVector?, value: Double?, layer: WeatherMapLayer, name: String, compact: Bool, imperial: Bool, expanded: Bool, temperature: Double?, symbol: String?, low: Double?, high: Double?) {
        let collapsed = compact || !expanded
        let diameter: CGFloat = collapsed ? (!compact && layer == .temperature ? 38 : 27) : (layer == .temperature ? 66 : 60)
        frame.size = CGSize(width: 160, height: diameter + (collapsed ? 20 : 42))
        centerOffset = CGPoint(x: 0, y: compact ? 10 : 5 - diameter / 2)
        bubble.frame = CGRect(x: (160 - diameter) / 2, y: 0, width: diameter, height: diameter)
        bubble.layer.cornerRadius = diameter / 2
        caption.frame = CGRect(x: 0, y: diameter + (compact ? 4 : 26), width: 160, height: 14)
        caption.text = name
        caption.alpha = 0.8
        let fill = layer == .wind ? UIColor(red: 0.05, green: 0.39, blue: 0.58, alpha: 0.95) : UIColor(white: 0.15, alpha: 0.9)
        bubble.backgroundColor = fill
        tip.isHidden = compact
        dot.isHidden = compact
        let path = UIBezierPath()
        path.move(to: CGPoint(x: 72, y: diameter - 3))
        path.addLine(to: CGPoint(x: 80, y: diameter + 7))
        path.addLine(to: CGPoint(x: 88, y: diameter - 3))
        tip.path = path.cgPath
        tip.fillColor = fill.cgColor
        dot.frame = CGRect(x: 76, y: diameter + 12, width: 8, height: 8)
        if !compact {
            centerOffset = CGPoint(x: 0, y: collapsed ? 10 : 5 - diameter / 2)
            caption.frame.origin.y = diameter + (collapsed ? 4 : 26)
            tip.isHidden = collapsed
            dot.isHidden = collapsed
            dot.backgroundColor = layer == .wind ? .white : UIColor(white: 0.16, alpha: 1)
            bubble.layer.borderWidth = layer == .wind ? 2 : 1.5
            bubble.layer.borderColor = (layer == .wind ? UIColor.white : UIColor(white: 0.15, alpha: 1)).cgColor
            if layer == .temperature { bubble.backgroundColor = UIColor(white: 0.18, alpha: 1) }
            tip.fillColor = (layer == .wind ? UIColor.white : UIColor(white: 0.15, alpha: 1)).cgColor
        }
        temperatureArc.isHidden = compact || collapsed || layer != .temperature || low == nil || high == nil
        temperatureIndicator.isHidden = temperatureArc.isHidden || temperature == nil
        extremes.isHidden = temperatureArc.isHidden
        if let low, let high {
            let a = WindMapPalette.color(value: low, layer: .temperature, fullScreen: true)
            let b = WindMapPalette.color(value: high, layer: .temperature, fullScreen: true)
            temperatureArc.frame = bubble.frame.insetBy(dx: 4, dy: 4)
            temperatureArc.colors = [a.cgColor, b.cgColor]
            temperatureArc.startPoint = CGPoint(x: 0, y: 0.5)
            temperatureArc.endPoint = CGPoint(x: 1, y: 0.5)
            let arcCenter = temperatureArc.bounds.width / 2
            let arcRadius = arcCenter - 1.5
            arcMask.path = UIBezierPath(arcCenter: CGPoint(x: arcCenter, y: arcCenter), radius: arcRadius,
                startAngle: .pi * 0.85, endAngle: .pi * 2.15, clockwise: true).cgPath
            if let temperature {
                let fraction = high > low ? min(1, max(0, (temperature - low) / (high - low))) : 0.5
                let angle = Double.pi * (0.85 + 1.3 * fraction)
                let position = CGPoint(x: temperatureArc.frame.midX + arcRadius * cos(angle),
                                       y: temperatureArc.frame.midY + arcRadius * sin(angle))
                temperatureIndicator.path = UIBezierPath(ovalIn: CGRect(x: position.x - 3.5, y: position.y - 3.5, width: 7, height: 7)).cgPath
                temperatureIndicator.fillColor = WindMapPalette.color(value: temperature, layer: .temperature, fullScreen: true).cgColor
            }
            let lowText = localizedIntegerString(Int((GlobalState.temperatureUnit == "°F" ? low * 1.8 + 32 : low).rounded()))
            let highText = localizedIntegerString(Int((GlobalState.temperatureUnit == "°F" ? high * 1.8 + 32 : high).rounded()))
            // Keep each value beside its matching arc endpoint in RTL too.
            let paragraph = NSMutableParagraphStyle()
            paragraph.alignment = .center
            paragraph.baseWritingDirection = .leftToRight
            let string = NSMutableAttributedString(string: "\u{2066}" + lowText + "°\u{2069}  ", attributes: [.foregroundColor: a])
            string.append(NSAttributedString(string: "\u{2066}" + highText + "°\u{2069}", attributes: [.foregroundColor: b]))
            string.addAttribute(.paragraphStyle, value: paragraph, range: NSRange(location: 0, length: string.length))
            extremes.attributedText = string
            extremes.frame = CGRect(x: (160 - diameter) / 2 + 7, y: diameter * 0.70, width: diameter - 14, height: 14)
        }
        let speed = vector.map { $0.displaySpeed(imperial: imperial) }
        let shownValue: Double? = layer == .wind ? speed : (compact ? value : temperature).map { (layer == .temperature) && GlobalState.temperatureUnit == "°F" ? $0 * 1.8 + 32 : $0 }
        let suffix = !compact && layer == .temperature ? GlobalState.temperatureUnitSymbol : (layer == .temperature) && !collapsed ? "°" : ""
        let speedText = shownValue.map { localizedIntegerString(Int($0.rounded())) + suffix } ?? "—"
        let unit = layer == .wind ? GlobalState.speedUnitLabel.uppercased(with: .appFormatting) : ""
        let direction = layer == .wind ? vector.map { WindMapLabels.direction($0.direction) } ?? "" : ""
        let mainText = speedText
        let text = NSMutableAttributedString(string: collapsed ? mainText : layer == .wind ? "\(direction)\n\(mainText)\n\(unit)" : "\(mainText)\n ",
            attributes: [.font: UIFont.systemFont(ofSize: collapsed ? 14 : 9, weight: .medium)])
        if !collapsed, let range = text.string.range(of: mainText) {
            text.addAttribute(.font, value: UIFont.systemFont(ofSize: 23, weight: .semibold), range: NSRange(range, in: text.string))
            if layer == .temperature, let suffixRange = text.string.range(of: suffix, options: .backwards) {
                text.addAttribute(.font, value: UIFont.systemFont(ofSize: 13, weight: .semibold), range: NSRange(suffixRange, in: text.string))
            }
        }
        bubble.attributedText = text
        accessibilityLabel = "\(name), \(layer.title), \(mainText) \(unit), \(direction)"
    }
}

@MainActor
private final class WindMapDisplayLinkTarget: NSObject {
    weak var view: WindMapParticleView?
    @objc func tick(_ link: CADisplayLink) { view?.tick(link) }
}

@MainActor
private final class WindMapParticleView: UIView {
    struct Particle { var point: CGPoint; var age: Double; var lifetime: Double; var trail: [CGPoint] = [] }
    var particleCount = 450
    var animating = true { didSet { if oldValue != animating { updateLink() } } }
    private var link: CADisplayLink?
    private let target = WindMapDisplayLinkTarget()
    private var particles: [Particle] = []
    private var vectors: [WindMapVector?] = []
    private var columns = 0
    private var rows = 0
    private var hasField = false
    private var lastTime: CFTimeInterval = 0
    private var sampledMapRect: MKMapRect?

    override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = .clear
        isOpaque = false
        target.view = self
    }
    required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }

    override func didMoveToWindow() { super.didMoveToWindow(); updateLink() }

    private func updateLink() {
        guard window != nil, animating, hasField else {
            link?.invalidate(); link = nil; lastTime = 0
            return
        }
        // Replacing forecast data must not restart the animation clock.
        guard link == nil else { return }
        let newLink = CADisplayLink(target: target, selector: #selector(WindMapDisplayLinkTarget.tick(_:)))
        newLink.preferredFrameRateRange = CAFrameRateRange(minimum: 20, maximum: 30, preferred: 24)
        newLink.add(to: .main, forMode: .common)
        link = newLink
    }

    func prepare(field: WindMapField?, date: Date, map: MKMapView) {
        guard bounds.width > 0, bounds.height > 0, let field else {
            vectors = []; hasField = false; updateLink(); setNeedsDisplay(); return
        }
        columns = max(2, Int(bounds.width / 14))
        rows = max(2, Int(bounds.height / 14))
        let slice = WindMapTimeSlice(field: field, date: date, layer: .wind)
        let visible = map.visibleMapRect
        // The map is north-up and flat. Project each row/column once rather
        // than asking MKMapView to convert every mesh cell on each frame.
        let latitudes = (0..<rows).map { row in
            MKMapPoint(x: visible.midX, y: visible.minY + (Double(row) + 0.5) / Double(rows) * visible.height).coordinate.latitude
        }
        let longitudes = (0..<columns).map { column in
            WindMapCoordinate.wrappedLongitude((visible.minX + (Double(column) + 0.5) / Double(columns) * visible.width) / MKMapSize.world.width * 360 - 180)
        }
        vectors = (0..<(columns * rows)).map { index in
            slice.vector(latitude: latitudes[index / columns], longitude: longitudes[index % columns])
        }
        hasField = true
        // Trails from the previous camera position must not cross the new map.
        let moved = sampledMapRect.map { $0.origin.x != map.visibleMapRect.origin.x || $0.origin.y != map.visibleMapRect.origin.y || $0.size.width != map.visibleMapRect.size.width || $0.size.height != map.visibleMapRect.size.height } ?? true
        sampledMapRect = map.visibleMapRect
        if particles.count != particleCount || moved {
            particles = (0..<particleCount).map { _ in makeParticle() }
        }
        updateLink()
        setNeedsDisplay()
    }

    private func vector(at point: CGPoint) -> WindMapVector? {
        guard bounds.contains(point), columns > 0, rows > 0 else { return nil }
        // Interpolate continuously so both the card and fullscreen map follow
        // the same curved field instead of stepping between mesh directions.
        let x = min(Double(columns - 1), max(0, point.x / bounds.width * Double(columns) - 0.5))
        let y = min(Double(rows - 1), max(0, point.y / bounds.height * Double(rows) - 0.5))
        let column = min(columns - 2, Int(x)), row = min(rows - 2, Int(y))
        guard vectors.count == columns * rows,
              let a = vectors[row * columns + column], let b = vectors[row * columns + column + 1],
              let c = vectors[(row + 1) * columns + column], let d = vectors[(row + 1) * columns + column + 1] else { return nil }
        return .blend(.blend(a, b, fraction: x - Double(column)),
                      .blend(c, d, fraction: x - Double(column)), fraction: y - Double(row))
    }

    private func makeParticle() -> Particle {
        Particle(point: CGPoint(x: .random(in: 0...max(1, bounds.width)), y: .random(in: 0...max(1, bounds.height))),
                 age: .random(in: 0...3), lifetime: .random(in: 3.5...6))
    }

    func tick(_ displayLink: CADisplayLink) {
        defer { lastTime = displayLink.timestamp }
        guard let window, convert(bounds, to: window).intersects(window.bounds) else { return }
        let delta = lastTime == 0 ? 0 : min(0.06, displayLink.timestamp - lastTime)
        for index in particles.indices {
            guard let wind = vector(at: particles[index].point), wind.speed > 0.15,
                  particles[index].age < particles[index].lifetime else {
                particles[index] = makeParticle(); continue
            }
            particles[index].trail.append(particles[index].point)
            if particles[index].trail.count > 24 { particles[index].trail.removeFirst() }
            // Keep the same trail length and midpoint motion in both sizes.
            let point = particles[index].point
            if let next = WindMapFlow.advance(from: SIMD2(point.x, point.y), seconds: delta, sample: {
                self.vector(at: CGPoint(x: $0.x, y: $0.y))
            }) {
                particles[index].point = CGPoint(x: next.x, y: next.y)
            }
            particles[index].age += delta
        }
        setNeedsDisplay()
    }

    override func draw(_ rect: CGRect) {
        guard let context = UIGraphicsGetCurrentContext() else { return }
        // Leave MapKit's bottom legal attribution unobscured.
        context.clip(to: CGRect(x: 0, y: 0, width: bounds.width, height: max(0, bounds.height - 30)))
        context.setLineWidth(0.55)
        context.setLineCap(.round)
        let paths = (0..<12).map { _ in CGMutablePath() }
        for particle in particles {
            guard let wind = vector(at: particle.point), wind.speed > 0.15 else { continue }
            let age = max(0, min(1, min(particle.age, particle.lifetime - particle.age)))
            let opacity = min(3, Int(age * 4))
            if particle.trail.count < 2 {
                paths[opacity * 3].move(to: particle.point)
                paths[opacity * 3].addLine(to: CGPoint(x: particle.point.x - wind.east / wind.speed * 5,
                                                     y: particle.point.y + wind.north / wind.speed * 5))
                continue
            }
            let points = [particle.point] + particle.trail.reversed()
            for band in 0..<3 {
                let path = paths[opacity * 3 + band]
                let start = band * (points.count - 1) / 3
                let end = (band + 1) * (points.count - 1) / 3
                guard end > start else { continue }
                path.move(to: points[start])
                for index in (start + 1)..<end {
                    let next = points[index + 1]
                    path.addQuadCurve(to: CGPoint(x: (points[index].x + next.x) / 2, y: (points[index].y + next.y) / 2), control: points[index])
                }
                path.addLine(to: points[end])
            }
        }
        for index in paths.indices {
            let alpha = (Double(index / 3) + 0.5) / 4 * 0.38 * [1.0, 0.55, 0.2][index % 3]
            context.setStrokeColor(UIColor.white.withAlphaComponent(alpha).cgColor)
            context.addPath(paths[index])
            context.strokePath()
        }
    }

}

enum WindMapPalette {
    static func color(value: Double, layer: WeatherMapLayer, fullScreen: Bool = false) -> UIColor {
        if fullScreen, layer == .temperature {
            // The reference holds cool/mild temperatures in cyan and teal;
            // green/yellow arrive later instead of tinting the whole region olive.
            return interpolate(value, stops: [(-40, (0.25, 0.04, 0.44)), (-20, (0.08, 0.22, 0.76)),
                (-10, (0.12, 0.43, 0.82)), (0, (0.16, 0.57, 0.72)), (10, (0.18, 0.57, 0.64)),
                (13, (0.21, 0.58, 0.61)), (16, (0.33, 0.61, 0.43)), (20, (0.74, 0.63, 0.06)),
                (24, (0.86, 0.53, 0.02)), (30, (0.94, 0.29, 0.04)), (40, (0.70, 0.08, 0.10)),
                (55, (0.42, 0.03, 0.11))])
        }
        switch layer {
        case .wind: return color(kph: value * 3.6)
        case .temperature:
            return interpolate(value, stops: [(-40, (0.5, 0.15, 0.6)), (-20, (0.15, 0.25, 0.8)),
                (0, (0.1, 0.65, 0.75)), (10, (0.45, 0.65, 0.3)), (20, (0.9, 0.6, 0.06)),
                (30, (0.9, 0.25, 0.07)), (55, (0.6, 0.1, 0.22))])
        }
    }

    private static func interpolate(_ value: Double, stops: [(Double, (Double, Double, Double))]) -> UIColor {
        let clipped = min(stops.last!.0, max(stops.first!.0, value))
        let upper = stops.firstIndex { $0.0 >= clipped } ?? stops.count - 1
        let lower = max(0, upper - 1)
        let t = upper == lower ? 0 : (clipped - stops[lower].0) / (stops[upper].0 - stops[lower].0)
        let a = stops[lower].1, b = stops[upper].1
        return UIColor(red: a.0 + (b.0 - a.0) * t, green: a.1 + (b.1 - a.1) * t, blue: a.2 + (b.2 - a.2) * t, alpha: 1)
    }
    static func color(kph: Double) -> UIColor {
        let stops: [(Double, (Double, Double, Double))] = [
            (0, (0.03, 0.38, 0.67)), (25, (0.04, 0.58, 0.73)), (50, (0.16, 0.7, 0.52)),
            (80, (0.83, 0.8, 0.23)), (120, (0.95, 0.36, 0.24)), (160, (0.66, 0.25, 0.7))
        ]
        let value = min(160, max(0, kph))
        let upper = stops.firstIndex(where: { $0.0 >= value }) ?? stops.count - 1
        let lower = max(0, upper - 1)
        let fraction = upper == lower ? 0 : (value - stops[lower].0) / (stops[upper].0 - stops[lower].0)
        let a = stops[lower].1, b = stops[upper].1
        return UIColor(red: a.0 + (b.0 - a.0) * fraction, green: a.1 + (b.1 - a.1) * fraction,
                       blue: a.2 + (b.2 - a.2) * fraction, alpha: 1)
    }
}

/// MapKit renders the heat layer below place labels. Particles are a separate
/// transparent view; neither layer relies on MapKit's private view hierarchy.
// Immutable after construction; Core Graphics images can cross executors.
private final class WindMapHeatOverlay: NSObject, MKOverlay, @unchecked Sendable {
    let coordinate: CLLocationCoordinate2D
    let boundingMapRect: MKMapRect
    let image: CGImage?
    let layer: WeatherMapLayer

    init(field: WindMapField, date: Date, layer: WeatherMapLayer, fullScreen: Bool = false) {
        self.layer = layer
        let grid = field.grid
        coordinate = CLLocationCoordinate2D(latitude: grid.latitude, longitude: grid.longitude)
        let north = MKMapPoint(CLLocationCoordinate2D(latitude: grid.latitude + grid.latitudeStep, longitude: grid.longitude))
        let south = MKMapPoint(CLLocationCoordinate2D(latitude: grid.latitude - grid.latitudeStep, longitude: grid.longitude))
        let x = (grid.longitude - grid.longitudeStep + 180) / 360 * MKMapSize.world.width
        let mapRect = MKMapRect(x: x, y: north.y,
                               width: grid.longitudeStep * 2 / 360 * MKMapSize.world.width,
                               height: south.y - north.y)
        boundingMapRect = mapRect
        if fullScreen {
            image = Self.raster(field: field, date: date, layer: layer, rect: mapRect)
            super.init()
            return
        }
        let resolution = 96
        let format = UIGraphicsImageRendererFormat()
        format.scale = 1
        image = UIGraphicsImageRenderer(size: CGSize(width: resolution, height: resolution), format: format).image { context in
            for row in 0..<resolution {
                for column in 0..<resolution {
                    let position = MKMapPoint(x: mapRect.minX + (Double(column) + 0.5) / Double(resolution) * mapRect.width,
                                              y: mapRect.minY + (Double(row) + 0.5) / Double(resolution) * mapRect.height).coordinate
                    guard let value = field.scalar(latitude: position.latitude, longitude: position.longitude, date: date, layer: layer) else { continue }
                    WindMapPalette.color(value: value, layer: layer, fullScreen: fullScreen).setFill()
                    context.fill(CGRect(x: column, y: row, width: 1, height: 1))
                }
            }
        }.cgImage
        super.init()
    }
    private static func raster(field: WindMapField, date: Date, layer: WeatherMapLayer, rect: MKMapRect) -> CGImage? {
        let size = 192
        let slice = WindMapTimeSlice(field: field, date: date, layer: layer)
        let range: ClosedRange<Double> = layer == .temperature ? -40...55 : 0...(160 / 3.6)
        let steps = 1_024
        let palette: [[UInt8]] = (0..<steps).map { index in
            let value = range.lowerBound + Double(index) / Double(steps - 1) * (range.upperBound - range.lowerBound)
            var r: CGFloat = 0, g: CGFloat = 0, b: CGFloat = 0, a: CGFloat = 0
            WindMapPalette.color(value: value, layer: layer, fullScreen: true).getRed(&r, green: &g, blue: &b, alpha: &a)
            return [UInt8((r * a * 255).rounded()), UInt8((g * a * 255).rounded()), UInt8((b * a * 255).rounded()), UInt8((a * 255).rounded())]
        }
        let longitudes = (0..<size).map { column in
            WindMapCoordinate.wrappedLongitude((rect.minX + (Double(column) + 0.5) / Double(size) * rect.width) / MKMapSize.world.width * 360 - 180)
        }
        var pixels = [UInt8](repeating: 0, count: size * size * 4)
        for row in 0..<size {
            guard !Task.isCancelled else { return nil }
            let latitude = MKMapPoint(x: rect.midX, y: rect.minY + (Double(row) + 0.5) / Double(size) * rect.height).coordinate.latitude
            for column in 0..<size {
                guard let value = slice.scalar(latitude: latitude, longitude: longitudes[column]), value.isFinite else { continue }
                let fraction = (value - range.lowerBound) / (range.upperBound - range.lowerBound)
                let color = palette[min(steps - 1, max(0, Int((fraction * Double(steps - 1)).rounded())))]
                let offset = (row * size + column) * 4
                pixels[offset] = color[0]; pixels[offset + 1] = color[1]
                pixels[offset + 2] = color[2]; pixels[offset + 3] = color[3]
            }
        }
        guard let provider = CGDataProvider(data: Data(pixels) as CFData) else { return nil }
        return CGImage(width: size, height: size, bitsPerComponent: 8, bitsPerPixel: 32, bytesPerRow: size * 4,
                       space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGBitmapInfo(rawValue: CGImageAlphaInfo.premultipliedLast.rawValue),
                       provider: provider, decode: nil, shouldInterpolate: true, intent: .defaultIntent)
    }
}

private final class WindMapHeatRenderer: MKOverlayRenderer {
    override func draw(_ mapRect: MKMapRect, zoomScale: MKZoomScale, in context: CGContext) {
        guard let heat = overlay as? WindMapHeatOverlay, let image = heat.image else { return }
        let destination = rect(for: heat.boundingMapRect)
        context.saveGState()
        context.clip(to: rect(for: mapRect))
        // Screen blending retains the light coastlines/roads from the dark
        // basemap instead of burying them under an opaque blue rectangle.
        context.setBlendMode(heat.layer == .wind ? .screen : .normal)
        context.setAlpha(heat.layer == .wind ? 0.72 : 0.76)
        context.translateBy(x: destination.minX, y: destination.maxY)
        context.scaleBy(x: 1, y: -1)
        context.interpolationQuality = .high
        context.draw(image, in: CGRect(origin: .zero, size: destination.size))
        context.restoreGState()
    }
}
