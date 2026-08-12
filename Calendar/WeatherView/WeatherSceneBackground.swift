import SwiftUI
import UIKit

/// A lightweight hybrid weather scene. AI-generated cloud sprite cycles add
/// organic detail while SwiftUI drives movement, lighting and precipitation.
struct WeatherSceneBackground: View {
    let conditionKey: String
    let symbolName: String
    let sunrise: Date?
    let sunset: Date?
    let moonrise: Date?
    let moonset: Date?
    let moonPhase: String?
    let precipitationType: String?
    let cloudCover: Double?
    let windSpeedKPH: Double?
    let windGustKPH: Double?
    let windDirectionDegrees: Double?
    let observationDate: Date?

    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    init(
        conditionKey: String,
        symbolName: String,
        sunrise: Date? = nil,
        sunset: Date? = nil,
        moonrise: Date? = nil,
        moonset: Date? = nil,
        moonPhase: String? = nil,
        precipitationType: String? = nil,
        cloudCover: Double? = nil,
        windSpeedKPH: Double? = nil,
        windGustKPH: Double? = nil,
        windDirectionDegrees: Double? = nil,
        observationDate: Date? = nil
    ) {
        self.conditionKey = conditionKey
        self.symbolName = symbolName
        self.sunrise = sunrise
        self.sunset = sunset
        self.moonrise = moonrise
        self.moonset = moonset
        self.moonPhase = moonPhase
        self.precipitationType = precipitationType
        self.cloudCover = cloudCover
        self.windSpeedKPH = windSpeedKPH
        self.windGustKPH = windGustKPH
        self.windDirectionDegrees = windDirectionDegrees
        self.observationDate = observationDate
    }

    var body: some View {
        TimelineView(.animation(minimumInterval: 1.0 / 60.0, paused: reduceMotion)) { timeline in
            let currentDate = observationDate ?? timeline.date
            let scene = WeatherSceneDescriptor(
                conditionKey: conditionKey,
                symbolName: symbolName,
                observationDate: currentDate,
                sunrise: sunrise,
                sunset: sunset,
                moonrise: moonrise,
                moonset: moonset,
                moonPhase: moonPhase,
                precipitationType: precipitationType,
                cloudCover: cloudCover,
                windSpeedKPH: windSpeedKPH,
                windGustKPH: windGustKPH,
                windDirectionDegrees: windDirectionDegrees
            )
            Canvas(opaque: true, rendersAsynchronously: true) { context, size in
                let time = reduceMotion ? 0 : timeline.date.timeIntervalSinceReferenceDate
                WeatherSceneRenderer.draw(scene: scene, time: time, in: &context, size: size)
            }
        }
        .allowsHitTesting(false)
        .accessibilityHidden(true)
    }
}

private enum WeatherSceneKind {
    case clear
    case hot
    case partlyCloudy
    case cloudy
    case drizzle
    case rain
    case heavyRain
    case freezingRain
    case snow
    case heavySnow
    case blizzard
    case hail
    case wintryMix
    case thunderstorm
    case hurricane
    case fog
    case haze
    case smoke
    case dust
    case windy
    case frigid
    case sunShowers
    case sunFlurries
}

private enum WeatherPrecipitationKind {
    case none
    case hail
    case mixed
    case rain
    case sleet
    case snow
}

private struct WeatherSceneDescriptor {
    let kind: WeatherSceneKind
    let isNight: Bool
    let intensity: Double
    let observationDate: Date
    let sunrise: Date?
    let sunset: Date?
    let moonrise: Date?
    let moonset: Date?
    let moonPhase: String?
    let precipitationKind: WeatherPrecipitationKind
    let reportedCloudCover: Double?
    let windSpeedKPH: Double
    let windGustKPH: Double
    let windDirectionDegrees: Double

    init(
        conditionKey: String,
        symbolName: String,
        observationDate: Date,
        sunrise: Date?,
        sunset: Date?,
        moonrise: Date?,
        moonset: Date?,
        moonPhase: String?,
        precipitationType: String?,
        cloudCover: Double?,
        windSpeedKPH: Double?,
        windGustKPH: Double?,
        windDirectionDegrees: Double?
    ) {
        let rawCondition = conditionKey
            .split(separator: ".")
            .last
            .map(String.init)?
            .lowercased() ?? conditionKey.lowercased()
        let symbol = symbolName.lowercased()
        self.observationDate = observationDate
        self.sunrise = sunrise
        self.sunset = sunset
        self.moonrise = moonrise
        self.moonset = moonset
        self.moonPhase = moonPhase
        switch precipitationType?.lowercased() {
        case "hail": precipitationKind = .hail
        case "mixed": precipitationKind = .mixed
        case "rain": precipitationKind = .rain
        case "sleet": precipitationKind = .sleet
        case "snow": precipitationKind = .snow
        default: precipitationKind = .none
        }
        self.reportedCloudCover = cloudCover
        self.windSpeedKPH = max(0, windSpeedKPH ?? 7)
        self.windGustKPH = max(self.windSpeedKPH, windGustKPH ?? self.windSpeedKPH)
        self.windDirectionDegrees = windDirectionDegrees ?? 270
        if let sunrise, let sunset, sunset > sunrise {
            isNight = observationDate < sunrise || observationDate >= sunset
        } else {
            isNight = symbol.contains("moon") || symbol.contains("night")
        }

        switch rawCondition {
        case "blizzard":
            kind = .blizzard; intensity = 1
        case "blowingdust":
            kind = .dust; intensity = 0.9
        case "blowingsnow":
            kind = .blizzard; intensity = 0.72
        case "breezy":
            kind = .windy; intensity = 0.45
        case "clear":
            kind = .clear; intensity = 0.2
        case "cloudy":
            kind = .cloudy; intensity = 0.7
        case "drizzle":
            kind = .drizzle; intensity = 0.35
        case "flurries":
            kind = .snow; intensity = 0.32
        case "foggy":
            kind = .fog; intensity = 0.75
        case "freezingdrizzle":
            kind = .freezingRain; intensity = 0.42
        case "freezingrain":
            kind = .freezingRain; intensity = 0.76
        case "frigid":
            kind = .frigid; intensity = 0.72
        case "hail":
            kind = .hail; intensity = 0.78
        case "haze":
            kind = .haze; intensity = 0.58
        case "heavyrain":
            kind = .heavyRain; intensity = 1
        case "heavysnow":
            kind = .heavySnow; intensity = 1
        case "hot":
            kind = .hot; intensity = 0.9
        case "hurricane":
            kind = .hurricane; intensity = 1
        case "isolatedthunderstorms":
            kind = .thunderstorm; intensity = 0.65
        case "mostlyclear":
            kind = .partlyCloudy; intensity = 0.25
        case "mostlycloudy":
            kind = .cloudy; intensity = 0.82
        case "partlycloudy":
            kind = .partlyCloudy; intensity = 0.52
        case "rain":
            kind = .rain; intensity = 0.68
        case "scatteredthunderstorms":
            kind = .thunderstorm; intensity = 0.78
        case "sleet":
            kind = .wintryMix; intensity = 0.7
        case "smoky":
            kind = .smoke; intensity = 0.72
        case "snow":
            kind = .snow; intensity = 0.64
        case "strongstorms":
            kind = .thunderstorm; intensity = 1
        case "sunflurries":
            kind = .sunFlurries; intensity = 0.42
        case "sunshowers":
            kind = .sunShowers; intensity = 0.48
        case "thunderstorms":
            kind = .thunderstorm; intensity = 0.88
        case "tropicalstorm":
            kind = .hurricane; intensity = 0.76
        case "windy":
            kind = .windy; intensity = 0.82
        case "wintrymix":
            kind = .wintryMix; intensity = 0.88
        default:
            if symbol.contains("bolt") {
                kind = .thunderstorm; intensity = 0.85
            } else if symbol.contains("sleet") || symbol.contains("hail") {
                kind = .wintryMix; intensity = 0.7
            } else if symbol.contains("snow") {
                kind = .snow; intensity = 0.65
            } else if symbol.contains("rain") || symbol.contains("drizzle") {
                kind = .rain; intensity = 0.65
            } else if symbol.contains("fog") || symbol.contains("haze") {
                kind = .fog; intensity = 0.65
            } else if symbol.contains("cloud") {
                kind = .cloudy; intensity = 0.65
            } else {
                kind = .clear; intensity = 0.2
            }
        }
    }

    var drawsClouds: Bool {
        switch kind {
        case .partlyCloudy, .cloudy, .drizzle, .rain, .heavyRain, .freezingRain,
             .snow, .heavySnow, .blizzard, .hail, .wintryMix, .thunderstorm,
             .hurricane, .sunShowers, .sunFlurries:
            return true
        default:
            return cloudCoverage > 0.18
        }
    }

    var cloudCoverage: Double {
        if let reportedCloudCover {
            return min(max(reportedCloudCover, 0), 1)
        }
        switch kind {
        case .partlyCloudy, .sunShowers, .sunFlurries: return 0.35
        case .cloudy: return 0.78
        case .hurricane, .thunderstorm, .heavyRain, .blizzard: return 1
        default: return 0.72
        }
    }

    var stormCloudWeight: Double {
        switch kind {
        case .thunderstorm, .hurricane, .heavyRain: return 1
        case .rain, .freezingRain: return 0.82
        case .drizzle, .hail, .wintryMix: return 0.62
        case .cloudy: return 0.46
        case .blizzard, .heavySnow: return 0.32
        case .snow: return 0.18
        default: return 0
        }
    }

    /// Wind direction from WeatherKit is the direction the wind comes from.
    /// The visual destination is 180° opposite on a compass coordinate system.
    var cloudTravelVector: CGVector {
        let destinationRadians = (windDirectionDegrees + 180) * .pi / 180
        return CGVector(
            dx: sin(destinationRadians),
            dy: -cos(destinationRadians) * 0.18
        )
    }

    /// Use sustained wind as the base and a restrained share of gust speed so
    /// rapid gust changes do not make the animation pulse unnaturally.
    var effectiveWindKPH: Double {
        min(150, windSpeedKPH * 0.78 + windGustKPH * 0.22)
    }

    var cloudMorphFramesPerSecond: Double {
        0.10 + min(effectiveWindKPH, 120) / 120 * 0.48
    }

    var starVisibility: Double {
        guard isNight else { return 0 }
        let atmosphericObstruction: Double
        switch kind {
        case .fog: atmosphericObstruction = 0.92
        case .smoke, .dust: atmosphericObstruction = 0.86
        case .haze: atmosphericObstruction = 0.72
        default: atmosphericObstruction = 0
        }
        let obstruction = max(cloudCoverage, atmosphericObstruction)
        return pow(max(0, 1 - obstruction), 1.35)
    }

    var sunProgress: Double? {
        guard let sunrise, let sunset, sunset > sunrise,
              observationDate >= sunrise, observationDate <= sunset else { return nil }
        return min(max(observationDate.timeIntervalSince(sunrise) / sunset.timeIntervalSince(sunrise), 0), 1)
    }

    var moonProgress: Double? {
        if let moonrise, let moonset {
            let start = moonrise
            var end = moonset
            if end <= start {
                end = Calendar.current.date(byAdding: .day, value: 1, to: end) ?? end.addingTimeInterval(86_400)
            }
            var observed = observationDate
            if observed < start {
                let nextDay = Calendar.current.date(byAdding: .day, value: 1, to: observed) ?? observed.addingTimeInterval(86_400)
                if nextDay <= end { observed = nextDay }
            }
            guard observed >= start, observed <= end else { return nil }
            return min(max(observed.timeIntervalSince(start) / end.timeIntervalSince(start), 0), 1)
        }

        guard isNight else { return nil }
        if let sunrise, let sunset {
            if observationDate >= sunset {
                let nextSunrise = Calendar.current.date(byAdding: .day, value: 1, to: sunrise) ?? sunrise.addingTimeInterval(86_400)
                return min(max(observationDate.timeIntervalSince(sunset) / nextSunrise.timeIntervalSince(sunset), 0), 1)
            }
            if observationDate < sunrise {
                let previousSunset = Calendar.current.date(byAdding: .day, value: -1, to: sunset) ?? sunset.addingTimeInterval(-86_400)
                return min(max(observationDate.timeIntervalSince(previousSunset) / sunrise.timeIntervalSince(previousSunset), 0), 1)
            }
        }
        return 0.5
    }
}

private struct WeatherCloudPlacement {
    let index: Int
    let depth: Double
    let rect: CGRect
    let usesStormSprite: Bool
    let opacity: Double
    let blur: Double
}

@MainActor
private enum WeatherSceneRenderer {
    static func draw(
        scene: WeatherSceneDescriptor,
        time: TimeInterval,
        in context: inout GraphicsContext,
        size: CGSize
    ) {
        drawSky(scene: scene, in: &context, size: size)

        if scene.starVisibility > 0.01 {
            drawStars(time: time, visibility: scene.starVisibility, in: &context, size: size)
        }

        drawAstronomy(scene: scene, time: time, in: &context, size: size)

        switch scene.kind {
        case .hot:
            drawHeatShimmer(time: time, in: &context, size: size)
        case .frigid:
            drawFrost(time: time, in: &context, size: size)
        case .fog, .haze, .smoke:
            drawAtmosphericBands(kind: scene.kind, time: time, in: &context, size: size)
        case .dust:
            drawDust(scene: scene, time: time, intensity: scene.intensity, in: &context, size: size)
        case .windy:
            drawWind(scene: scene, time: time, intensity: scene.intensity, in: &context, size: size)
        default:
            break
        }

        if scene.drawsClouds {
            drawCloudField(scene: scene, time: time, in: &context, size: size)
        }

        switch scene.kind {
        case .drizzle:
            drawRain(scene: scene, time: time, intensity: 0.32, in: &context, size: size)
        case .rain, .sunShowers:
            drawRain(scene: scene, time: time, intensity: scene.intensity, in: &context, size: size)
        case .heavyRain:
            drawRain(scene: scene, time: time, intensity: 1, in: &context, size: size)
            drawMist(scene: scene, time: time, in: &context, size: size)
        case .freezingRain:
            drawRain(scene: scene, time: time, intensity: scene.intensity, icy: true, in: &context, size: size)
        case .snow, .sunFlurries:
            drawSnow(scene: scene, time: time, intensity: scene.intensity, in: &context, size: size)
        case .heavySnow:
            drawSnow(scene: scene, time: time, intensity: 1, in: &context, size: size)
        case .blizzard:
            drawSnow(scene: scene, time: time, intensity: scene.intensity, in: &context, size: size)
            drawWind(scene: scene, time: time, intensity: 0.65, in: &context, size: size)
        case .hail:
            drawRain(scene: scene, time: time, intensity: scene.intensity * 0.36, icy: true, in: &context, size: size)
            drawHail(scene: scene, time: time, intensity: scene.intensity, in: &context, size: size)
        case .wintryMix:
            drawRain(scene: scene, time: time, intensity: scene.intensity * 0.48, icy: true, in: &context, size: size)
            drawSnow(scene: scene, time: time, intensity: scene.intensity * 0.55, in: &context, size: size)
            drawHail(scene: scene, time: time, intensity: scene.intensity * 0.32, in: &context, size: size)
        case .thunderstorm:
            drawRain(scene: scene, time: time, intensity: max(0.7, scene.intensity), in: &context, size: size)
            drawLightning(scene: scene, time: time, intensity: scene.intensity, in: &context, size: size)
        case .hurricane:
            drawRain(scene: scene, time: time, intensity: scene.intensity, in: &context, size: size)
            drawTropicalStormEffects(scene: scene, time: time, intensity: scene.intensity, in: &context, size: size)
            drawLightning(scene: scene, time: time + 1.7, intensity: scene.intensity * 0.7, in: &context, size: size)
        default:
            break
        }

        drawSupplementalPrecipitation(
            scene: scene,
            time: time,
            in: &context,
            size: size
        )

        drawVignette(in: &context, size: size)
    }

    private static func drawSupplementalPrecipitation(
        scene: WeatherSceneDescriptor,
        time: TimeInterval,
        in context: inout GraphicsContext,
        size: CGSize
    ) {
        let alreadyDrawsRain: Bool = {
            switch scene.kind {
            case .drizzle, .rain, .heavyRain, .freezingRain, .hail,
                 .wintryMix, .thunderstorm, .hurricane, .sunShowers:
                return true
            default:
                return false
            }
        }()
        let alreadyDrawsSnow: Bool = {
            switch scene.kind {
            case .snow, .heavySnow, .blizzard, .wintryMix, .sunFlurries:
                return true
            default:
                return false
            }
        }()
        let alreadyDrawsIce = scene.kind == .hail || scene.kind == .wintryMix

        // WeatherCondition describes the overall scene, while WeatherKit's
        // separate precipitation field describes what is actually falling.
        // Layering the latter preserves combinations such as a severe
        // thunderstorm that is producing hail.
        switch scene.precipitationKind {
        case .hail:
            if !alreadyDrawsRain {
                drawRain(scene: scene, time: time, intensity: 0.32, icy: true, in: &context, size: size)
            }
            if !alreadyDrawsIce {
                drawHail(scene: scene, time: time, intensity: max(0.72, scene.intensity), in: &context, size: size)
            }
        case .mixed:
            if !alreadyDrawsRain {
                drawRain(scene: scene, time: time, intensity: 0.46, in: &context, size: size)
            }
            if !alreadyDrawsSnow {
                drawSnow(scene: scene, time: time, intensity: 0.52, in: &context, size: size)
            }
        case .sleet:
            if !alreadyDrawsRain {
                drawRain(scene: scene, time: time, intensity: 0.44, icy: true, in: &context, size: size)
            }
            if !alreadyDrawsIce {
                drawHail(scene: scene, time: time, intensity: 0.46, in: &context, size: size)
            }
        case .snow:
            if !alreadyDrawsSnow {
                drawSnow(scene: scene, time: time, intensity: max(0.48, scene.intensity * 0.72), in: &context, size: size)
            }
        case .rain:
            if !alreadyDrawsRain {
                drawRain(scene: scene, time: time, intensity: max(0.42, scene.intensity * 0.72), in: &context, size: size)
            }
        case .none:
            break
        }
    }

    private static func drawSky(scene: WeatherSceneDescriptor, in context: inout GraphicsContext, size: CGSize) {
        let colors: [Color]
        if scene.isNight {
            switch scene.kind {
            case .thunderstorm, .hurricane, .heavyRain:
                colors = [Color(red: 0.02, green: 0.04, blue: 0.12), Color(red: 0.08, green: 0.13, blue: 0.24), Color(red: 0.14, green: 0.18, blue: 0.25)]
            default:
                colors = [Color(red: 0.025, green: 0.07, blue: 0.18), Color(red: 0.08, green: 0.18, blue: 0.35), Color(red: 0.18, green: 0.25, blue: 0.42)]
            }
        } else {
            switch scene.kind {
            case .clear, .partlyCloudy, .windy, .sunShowers, .sunFlurries:
                colors = [Color(red: 0.18, green: 0.63, blue: 0.95), Color(red: 0.38, green: 0.76, blue: 0.98), Color(red: 0.72, green: 0.88, blue: 1)]
            case .hot:
                colors = [
                    Color(red: 0.94, green: 0.36, blue: 0.10),
                    Color(red: 0.99, green: 0.59, blue: 0.18),
                    Color(red: 0.98, green: 0.82, blue: 0.47)
                ]
            case .cloudy:
                colors = [Color(red: 0.38, green: 0.50, blue: 0.62), Color(red: 0.55, green: 0.66, blue: 0.75), Color(red: 0.70, green: 0.77, blue: 0.82)]
            case .drizzle, .rain, .freezingRain:
                colors = [Color(red: 0.20, green: 0.30, blue: 0.42), Color(red: 0.34, green: 0.46, blue: 0.57), Color(red: 0.49, green: 0.59, blue: 0.67)]
            case .heavyRain, .thunderstorm, .hurricane:
                colors = [Color(red: 0.08, green: 0.12, blue: 0.20), Color(red: 0.16, green: 0.23, blue: 0.31), Color(red: 0.29, green: 0.34, blue: 0.40)]
            case .snow, .heavySnow, .blizzard, .hail, .wintryMix, .frigid:
                colors = [Color(red: 0.28, green: 0.52, blue: 0.72), Color(red: 0.58, green: 0.76, blue: 0.88), Color(red: 0.84, green: 0.92, blue: 0.97)]
            case .fog:
                colors = [Color(red: 0.48, green: 0.55, blue: 0.60), Color(red: 0.68, green: 0.73, blue: 0.75), Color(red: 0.81, green: 0.83, blue: 0.82)]
            case .haze:
                colors = [Color(red: 0.55, green: 0.59, blue: 0.57), Color(red: 0.73, green: 0.71, blue: 0.61), Color(red: 0.85, green: 0.78, blue: 0.62)]
            case .smoke:
                colors = [Color(red: 0.30, green: 0.28, blue: 0.29), Color(red: 0.48, green: 0.43, blue: 0.42), Color(red: 0.66, green: 0.57, blue: 0.51)]
            case .dust:
                colors = [Color(red: 0.50, green: 0.29, blue: 0.16), Color(red: 0.75, green: 0.50, blue: 0.27), Color(red: 0.88, green: 0.69, blue: 0.39)]
            }
        }

        let rect = CGRect(origin: .zero, size: size)
        context.fill(
            Path(rect),
            with: .linearGradient(
                Gradient(colors: colors),
                startPoint: CGPoint(x: size.width * 0.15, y: 0),
                endPoint: CGPoint(x: size.width * 0.85, y: size.height)
            )
        )
    }

    private static func drawStars(
        time: TimeInterval,
        visibility: Double,
        in context: inout GraphicsContext,
        size: CGSize
    ) {
        for index in 0..<45 {
            let x = hash(index, 1) * size.width
            let y = hash(index, 2) * size.height * 0.58
            let twinkle = 0.45 + 0.55 * abs(sin(time * (0.6 + hash(index, 3)) + Double(index)))
            let radius = 0.65 + hash(index, 4) * 1.35
            context.fill(
                Path(ellipseIn: CGRect(x: x, y: y, width: radius * 2, height: radius * 2)),
                with: .color(.white.opacity(twinkle * 0.82 * visibility))
            )
        }
    }

    private static func drawAstronomy(
        scene: WeatherSceneDescriptor,
        time: TimeInterval,
        in context: inout GraphicsContext,
        size: CGSize
    ) {
        if let sunProgress = scene.sunProgress {
            drawCelestialBody(
                isNight: false,
                time: time,
                center: celestialCenter(progress: sunProgress, size: size),
                moonPhase: nil,
                celestialProgress: sunProgress,
                opacity: max(0.015, 1 - scene.cloudCoverage * 1.12),
                in: &context,
                size: size,
                oversized: false
            )
        }

        if let moonProgress = scene.moonProgress {
            drawCelestialBody(
                isNight: true,
                time: time,
                center: celestialCenter(progress: moonProgress, size: size),
                moonPhase: scene.moonPhase ?? "full",
                celestialProgress: moonProgress,
                opacity: (scene.isNight ? 1 : 0.48) * max(0.02, 1 - scene.cloudCoverage * 1.08),
                in: &context,
                size: size
            )
        }
    }

    private static func celestialCenter(progress: Double, size: CGSize) -> CGPoint {
        let clamped = min(max(progress, 0), 1)
        let x = size.width * CGFloat(0.14 + clamped * 0.72)
        let horizon = size.height * 0.34
        let arcHeight = size.height * 0.25
        let y = horizon - arcHeight * CGFloat(sin(.pi * clamped))
        return CGPoint(x: x, y: y)
    }

    private static func drawCelestialBody(
        isNight: Bool,
        time: TimeInterval,
        center: CGPoint,
        moonPhase: String?,
        celestialProgress: Double,
        opacity: Double,
        in context: inout GraphicsContext,
        size: CGSize,
        oversized: Bool = false
    ) {
        let radius = min(size.width, size.height) * (oversized ? 0.16 : 0.115)
        let pulse = 1 + CGFloat(sin(time * 0.65)) * 0.035
        let glowRadius = radius * (oversized ? 2.3 : 1.85) * pulse

        context.fill(
            Path(ellipseIn: CGRect(x: center.x - glowRadius, y: center.y - glowRadius, width: glowRadius * 2, height: glowRadius * 2)),
            with: .radialGradient(
                Gradient(colors: [
                    (isNight ? Color.white : Color.yellow).opacity((isNight ? 0.28 : 0.48) * opacity),
                    Color.clear
                ]),
                center: center,
                startRadius: radius * 0.35,
                endRadius: glowRadius
            )
        )

        let bodyRect = CGRect(x: center.x - radius, y: center.y - radius, width: radius * 2, height: radius * 2)
        if isNight {
            let phaseImage = WeatherMoonPhaseImages.image(for: moonPhase ?? "full")
            context.drawLayer { layer in
                layer.opacity = opacity
                layer.addFilter(.shadow(color: .white.opacity(0.18 * opacity), radius: radius * 0.14))
                layer.draw(layer.resolve(phaseImage), in: bodyRect)
            }
        } else {
            // The source includes a broad atmospheric halo. Drawing a larger
            // source rect keeps the visible solar disc at a believable size
            // when viewed from the ground, without turning it into an icon.
            let sunRect = bodyRect.insetBy(dx: -radius * 1.55, dy: -radius * 1.55)
            let horizonWarmth = 1 - min(1, abs(celestialProgress - 0.5) * 2)
            let tint = Color(
                red: 1,
                green: 0.72 + horizonWarmth * 0.28,
                blue: 0.38 + horizonWarmth * 0.62
            )
            context.drawLayer { layer in
                layer.opacity = opacity
                layer.addFilter(.colorMultiply(tint))
                layer.addFilter(.shadow(color: tint.opacity(0.28 * opacity), radius: radius * 0.30))
                layer.draw(layer.resolve(WeatherSunImage.image), in: sunRect)
            }
        }
    }

    private static func drawCloudField(
        scene: WeatherSceneDescriptor,
        time: TimeInterval,
        in context: inout GraphicsContext,
        size: CGSize
    ) {
        let isOvercast = scene.cloudCoverage >= 0.75
        if scene.kind == .hurricane {
            drawTropicalStormCeiling(scene: scene, time: time, in: &context, size: size)
        } else if isOvercast {
            drawCloudVeil(scene: scene, time: time, in: &context, size: size)
        }

        for placement in cloudPlacements(scene: scene, time: time, size: size) {
            let index = placement.index
            let frames = placement.usesStormSprite
                ? WeatherCloudSpriteFrames.storm
                : WeatherCloudSpriteFrames.fair

            guard !frames.isEmpty else {
                drawFallbackCloud(
                    center: CGPoint(x: placement.rect.midX, y: placement.rect.midY),
                    scale: placement.rect.width / 180,
                    color: .white.opacity(0.58),
                    in: &context
                )
                continue
            }

            let lastFrame = max(1, frames.count - 1)
            let cycleLength = Double(lastFrame * 2)
            let rawProgress = (time * scene.cloudMorphFramesPerSecond * (0.82 + placement.depth * 0.36) + hash(index, 24) * cycleLength)
                .truncatingRemainder(dividingBy: cycleLength)
            let frameProgress = rawProgress <= Double(lastFrame)
                ? rawProgress
                : cycleLength - rawProgress
            let currentFrame = min(lastFrame, Int(floor(frameProgress)))
            let nextFrame = min(lastFrame, currentFrame + 1)
            let linearFade = frameProgress - floor(frameProgress)
            // A cosine fade has zero velocity at both ends. Combined with the
            // normalized sprite bounds below, this removes the visible snap
            // when the cloud changes from one generated shape to the next.
            let crossfade = 0.5 - 0.5 * cos(Double.pi * linearFade)
            drawCloudSprite(
                frames[currentFrame],
                in: placement.rect,
                opacity: placement.opacity * (1 - crossfade),
                blur: placement.blur,
                context: &context
            )
            drawCloudSprite(
                frames[nextFrame],
                in: placement.rect,
                opacity: placement.opacity * crossfade,
                blur: placement.blur,
                context: &context
            )
        }
    }

    private static func drawTropicalStormCeiling(
        scene: WeatherSceneDescriptor,
        time: TimeInterval,
        in context: inout GraphicsContext,
        size: CGSize
    ) {
        let severity = min(max((scene.intensity - 0.70) / 0.30, 0), 1)
        let direction: CGFloat = scene.cloudTravelVector.dx >= 0 ? 1 : -1
        let screen = CGRect(origin: .zero, size: size)

        // A tropical cyclone seen from the ground has a continuous, low cloud
        // ceiling. This base prevents clear-sky holes while the faster scud
        // layers below still make the wind direction readable.
        context.fill(
            Path(screen),
            with: .linearGradient(
                Gradient(stops: [
                    .init(color: Color(red: 0.08, green: 0.10, blue: 0.13).opacity(0.76 + severity * 0.10), location: 0),
                    .init(color: Color(red: 0.19, green: 0.23, blue: 0.27).opacity(0.66 + severity * 0.08), location: 0.24),
                    .init(color: Color(red: 0.31, green: 0.36, blue: 0.39).opacity(0.38 + severity * 0.08), location: 0.50),
                    .init(color: Color(red: 0.33, green: 0.39, blue: 0.42).opacity(0.12), location: 0.78),
                    .init(color: .clear, location: 1)
                ]),
                startPoint: .zero,
                endPoint: CGPoint(x: 0, y: size.height)
            )
        )

        for index in 0..<5 {
            let width = size.width * CGFloat(1.12 + hash(index, 121) * 0.52)
            let height = size.height * CGFloat(0.13 + hash(index, 122) * 0.11)
            let travel = size.width + width
            let speed = (23 + scene.effectiveWindKPH * (0.42 + hash(index, 123) * 0.18))
            let rawX = hash(index, 124) * Double(travel) + time * speed * Double(direction)
            let wrapped = rawX.truncatingRemainder(dividingBy: Double(travel))
            let normalized = CGFloat(wrapped < 0 ? wrapped + Double(travel) : wrapped)
            let x = normalized - width
            let y = size.height * CGFloat(-0.04 + Double(index) * 0.075 + (hash(index, 125) - 0.5) * 0.045)

            for copy in 0...1 {
                let copyX = x + CGFloat(copy) * travel
                let rect = CGRect(x: copyX, y: y, width: width, height: height)
                context.drawLayer { layer in
                    layer.addFilter(.blur(radius: 19 + CGFloat(hash(index, 126) * 13)))
                    layer.fill(
                        Path(ellipseIn: rect),
                        with: .linearGradient(
                            Gradient(colors: [
                                Color(red: 0.09, green: 0.11, blue: 0.14).opacity(0.10),
                                Color(red: 0.39, green: 0.43, blue: 0.45).opacity(0.27 + severity * 0.07),
                                Color(red: 0.14, green: 0.17, blue: 0.20).opacity(0.22 + severity * 0.08)
                            ]),
                            startPoint: CGPoint(x: direction > 0 ? rect.minX : rect.maxX, y: rect.midY),
                            endPoint: CGPoint(x: direction > 0 ? rect.maxX : rect.minX, y: rect.midY)
                        )
                    )
                }
            }
        }
    }

    /// Stable randomness avoids artificial rows and mirrored spacing without
    /// allowing clouds to jump when Canvas produces a new animation frame.
    private static func cloudPlacements(
        scene: WeatherSceneDescriptor,
        time: TimeInterval,
        size: CGSize
    ) -> [WeatherCloudPlacement] {
        let isOvercast = scene.cloudCoverage >= 0.75
        let count = isOvercast ? 8 : (scene.cloudCoverage > 0.45 ? 5 : 4)
        let direction = scene.cloudTravelVector

        return (0..<count).map { index in
            let depth = hash(index, 22)
            let shape = hash(index, 25)
            let scale = CGFloat(0.52 + depth * 0.38 + shape * 0.10)
            let cloudWidth = CGFloat(188 + hash(index, 26) * 58) * scale
            let usesStorm = hash(index, 23) < scene.stormCloudWeight
            let cloudHeight = cloudWidth * (usesStorm ? 0.66 : 0.58)

            // Each cloud has its own altitude and starting phase. Depth still
            // influences scale and blur, but never forces a visible row.
            let altitudeJitter = (hash(index, 27) - 0.5) * 0.105
            let baseY = size.height * CGFloat(0.085 + depth * 0.245 + altitudeJitter)
            let windLift = sin(CGFloat(time) * 0.017 + CGFloat(index) * 1.37)
                * size.height * 0.012 * CGFloat(direction.dy)
            let organicLift = sin(CGFloat(time) * 0.046 + CGFloat(index) * 2.11)
                * cloudWidth * CGFloat(0.010 + hash(index, 28) * 0.012)
            let centerY = baseY + windLift + organicLift

            let windSpeed = (2.8 + min(scene.effectiveWindKPH, 150) * 0.24)
                * (0.70 + depth * 0.48)
            let travel = Double(size.width + cloudWidth)
            let phase = hash(index, 20) * travel
            let rawX = phase + time * windSpeed * direction.dx
            let wrapped = rawX.truncatingRemainder(dividingBy: travel)
            let centerX = CGFloat(wrapped < 0 ? wrapped + travel : wrapped) - cloudWidth * 0.5

            return WeatherCloudPlacement(
                index: index,
                depth: depth,
                rect: CGRect(
                    x: centerX - cloudWidth * 0.5,
                    y: centerY - cloudHeight * 0.5,
                    width: cloudWidth,
                    height: cloudHeight
                ),
                usesStormSprite: usesStorm,
                opacity: (0.32 + depth * 0.34 + shape * 0.05) * (scene.isNight ? 0.76 : 1),
                blur: max(0.35, 2.8 - depth * 2.35)
            )
        }
        .sorted { $0.depth < $1.depth }
    }

    private static func precipitationSources(
        scene: WeatherSceneDescriptor,
        time: TimeInterval,
        size: CGSize
    ) -> [WeatherCloudPlacement] {
        let placements = cloudPlacements(scene: scene, time: time, size: size)
        let visibleBounds = CGRect(origin: .zero, size: size).insetBy(dx: -70, dy: 0)
        let visible = placements.filter { $0.rect.intersects(visibleBounds) }
        return visible.isEmpty ? placements : visible
    }

    private static func drawCloudVeil(
        scene: WeatherSceneDescriptor,
        time: TimeInterval,
        in context: inout GraphicsContext,
        size: CGSize
    ) {
        let drift = CGFloat(time * (1.5 + scene.effectiveWindKPH * 0.035))
        for index in 0..<3 {
            let width = size.width * CGFloat(0.78 + hash(index, 27) * 0.28)
            let xTravel = size.width + width
            let rawX = CGFloat(hash(index, 28)) * xTravel + drift * CGFloat(scene.cloudTravelVector.dx)
            let x = rawX.truncatingRemainder(dividingBy: xTravel) - width * 0.58
            let y = size.height * CGFloat(0.07 + Double(index) * 0.08)
            context.drawLayer { layer in
                layer.addFilter(.blur(radius: 34 + CGFloat(index) * 7))
                layer.fill(
                    Path(ellipseIn: CGRect(x: x, y: y, width: width, height: size.height * 0.15)),
                    with: .color(Color.white.opacity((0.045 + Double(index) * 0.012) * scene.cloudCoverage))
                )
            }
        }
    }

    private static func drawCloudSprite(
        _ image: Image,
        in rect: CGRect,
        opacity: Double,
        blur: Double,
        context: inout GraphicsContext
    ) {
        guard opacity > 0.001 else { return }
        context.drawLayer { layer in
            layer.opacity = opacity
            if blur > 0.05 {
                layer.addFilter(.blur(radius: blur))
            }
            layer.draw(layer.resolve(image), in: rect)
        }
    }

    private static func drawFallbackCloud(
        center: CGPoint,
        scale: CGFloat,
        color: Color,
        in context: inout GraphicsContext
    ) {
        var path = Path()
        path.addEllipse(in: CGRect(x: center.x - 78 * scale, y: center.y - 7 * scale, width: 90 * scale, height: 47 * scale))
        path.addEllipse(in: CGRect(x: center.x - 34 * scale, y: center.y - 35 * scale, width: 83 * scale, height: 72 * scale))
        path.addEllipse(in: CGRect(x: center.x + 18 * scale, y: center.y - 15 * scale, width: 75 * scale, height: 53 * scale))
        path.addRoundedRect(
            in: CGRect(x: center.x - 67 * scale, y: center.y + 4 * scale, width: 143 * scale, height: 34 * scale),
            cornerSize: CGSize(width: 16 * scale, height: 16 * scale)
        )
        context.drawLayer { layer in
            layer.addFilter(.blur(radius: 1.8 * scale))
            layer.fill(path, with: .color(color))
        }
        var highlight = Path()
        highlight.addEllipse(in: CGRect(x: center.x - 25 * scale, y: center.y - 28 * scale, width: 65 * scale, height: 35 * scale))
        context.fill(highlight, with: .color(.white.opacity(0.11)))
    }

    private static func drawRain(
        scene: WeatherSceneDescriptor,
        time: TimeInterval,
        intensity: Double,
        icy: Bool = false,
        in context: inout GraphicsContext,
        size: CGSize
    ) {
        let count = Int(40 + 82 * intensity)
        let speed = 330 + 260 * intensity
        let windStrength = min(1.4, scene.effectiveWindKPH / 70)
        let horizontalWind = scene.cloudTravelVector.dx * windStrength
        let sources = precipitationSources(scene: scene, time: time, size: size)
        guard !sources.isEmpty else { return }

        for index in 0..<count {
            let source = sources[(index &* 7 + 3) % sources.count]
            let cloudBase = source.rect.midY + source.rect.height * 0.12
            let fallDistance = max(120, size.height - cloudBase + 75)
            let particleSpeed = speed * (0.76 + hash(index, 34) * 0.46)
            let offset = hash(index, 32) * Double(fallDistance)
            let fallen = CGFloat((offset + time * particleSpeed).truncatingRemainder(dividingBy: Double(fallDistance)))
            let sourceX = source.rect.minX + source.rect.width * CGFloat(0.16 + hash(index, 31) * 0.68)
            let x = sourceX + fallen * CGFloat(horizontalWind * 0.28)
            let y = cloudBase + fallen
            let length = CGFloat(10 + 18 * hash(index, 33) + 12 * intensity)
            var drop = Path()
            drop.move(to: CGPoint(x: x, y: y))
            drop.addLine(to: CGPoint(x: x + length * CGFloat(horizontalWind), y: y + length))
            context.stroke(
                drop,
                with: .color(
                    (icy ? Color(red: 0.74, green: 0.89, blue: 1) : Color.white)
                        .opacity(0.22 + 0.36 * intensity)
                ),
                style: StrokeStyle(lineWidth: icy ? 1.7 : 1.15, lineCap: .round)
            )
        }

        // A restrained foreground layer uses real drop sprites for refraction
        // and shape detail; the fine line layer above preserves fluid motion.
        guard !icy else { return }
        let spriteCount = Int(7 + intensity * 10)
        let frames = WeatherPrecipitationSpriteFrames.rain
        guard !frames.isEmpty else { return }
        for index in 0..<spriteCount {
            let particleIndex = index + 700
            let source = sources[(particleIndex &* 5 + 1) % sources.count]
            let cloudBase = source.rect.midY + source.rect.height * 0.12
            let fallDistance = max(140, size.height - cloudBase + 95)
            let fallen = CGFloat((hash(particleIndex, 32) * Double(fallDistance) + time * speed * (0.68 + hash(particleIndex, 34) * 0.35))
                .truncatingRemainder(dividingBy: Double(fallDistance)))
            let sourceX = source.rect.minX + source.rect.width * CGFloat(0.18 + hash(particleIndex, 31) * 0.64)
            let x = sourceX + fallen * CGFloat(horizontalWind * 0.28)
            let y = cloudBase + fallen
            let dropHeight = CGFloat(25 + hash(particleIndex, 35) * 24 + intensity * 9)
            let dropWidth = dropHeight * CGFloat(0.30 + hash(particleIndex, 36) * 0.10)
            context.drawLayer { layer in
                layer.opacity = icy ? 0.56 : 0.48
                layer.draw(
                    layer.resolve(frames[particleIndex % frames.count]),
                    in: CGRect(x: x - dropWidth * 0.5, y: y - dropHeight * 0.5, width: dropWidth, height: dropHeight)
                )
            }
        }
    }

    private static func drawSnow(
        scene: WeatherSceneDescriptor,
        time: TimeInterval,
        intensity: Double,
        in context: inout GraphicsContext,
        size: CGSize
    ) {
        let count = Int(32 + 96 * intensity)
        let speed = 36 + 70 * intensity
        let wind = scene.cloudTravelVector.dx * min(1.5, scene.effectiveWindKPH / 45)
        let sources = precipitationSources(scene: scene, time: time, size: size)
        guard !sources.isEmpty else { return }

        for index in 0..<count {
            let source = sources[(index &* 5 + 2) % sources.count]
            let cloudBase = source.rect.midY + source.rect.height * 0.12
            let fallDistance = max(110, size.height - cloudBase + 50)
            let phase = hash(index, 41) * .pi * 2
            let yOffset = hash(index, 42) * Double(fallDistance)
            let fallen = CGFloat((yOffset + time * speed * (0.72 + hash(index, 43) * 0.58)).truncatingRemainder(dividingBy: Double(fallDistance)))
            let y = cloudBase + fallen
            let drift = sin(time * (0.55 + hash(index, 44)) + phase) * (13 + 17 * hash(index, 45))
            let xBase = source.rect.minX + source.rect.width * CGFloat(0.14 + hash(index, 46) * 0.72)
            let x = xBase + fallen * CGFloat(wind * 0.24) + CGFloat(drift)
            let radius = CGFloat(1.5 + hash(index, 47) * 3.6)
            context.fill(
                Path(ellipseIn: CGRect(x: x - radius, y: y - radius, width: radius * 2, height: radius * 2)),
                with: .color(.white.opacity(0.52 + hash(index, 48) * 0.42))
            )
        }

        let frames = WeatherPrecipitationSpriteFrames.snow
        guard !frames.isEmpty else { return }
        let spriteCount = Int(8 + intensity * 12)
        for index in 0..<spriteCount {
            let particleIndex = index + 900
            let source = sources[(particleIndex &* 7 + 1) % sources.count]
            let cloudBase = source.rect.midY + source.rect.height * 0.12
            let fallDistance = max(110, size.height - cloudBase + 60)
            let fallen = CGFloat((hash(particleIndex, 42) * Double(fallDistance) + time * speed * (0.62 + hash(particleIndex, 43) * 0.42))
                .truncatingRemainder(dividingBy: Double(fallDistance)))
            let sway = sin(time * (0.42 + hash(particleIndex, 44)) + hash(particleIndex, 41) * .pi * 2) * 18
            let x = source.rect.minX
                + source.rect.width * CGFloat(0.16 + hash(particleIndex, 46) * 0.68)
                + fallen * CGFloat(wind * 0.23)
                + CGFloat(sway)
            let y = cloudBase + fallen
            let side = CGFloat(13 + hash(particleIndex, 47) * 17)
            context.drawLayer { layer in
                layer.opacity = 0.50 + hash(particleIndex, 48) * 0.34
                layer.draw(
                    layer.resolve(frames[particleIndex % frames.count]),
                    in: CGRect(x: x - side * 0.5, y: y - side * 0.5, width: side, height: side)
                )
            }
        }
    }

    private static func drawHail(
        scene: WeatherSceneDescriptor,
        time: TimeInterval,
        intensity: Double,
        in context: inout GraphicsContext,
        size: CGSize
    ) {
        let count = Int(22 + 55 * intensity)
        let speed = 230 + intensity * 140
        let wind = scene.cloudTravelVector.dx * min(1.2, scene.effectiveWindKPH / 75)
        let sources = precipitationSources(scene: scene, time: time, size: size)
        let frames = WeatherPrecipitationSpriteFrames.hail
        guard !sources.isEmpty else { return }

        for index in 0..<count {
            let source = sources[(index &* 5 + 4) % sources.count]
            let cloudBase = source.rect.midY + source.rect.height * 0.12
            let fallDistance = max(120, size.height - cloudBase + 60)
            let fallen = CGFloat((hash(index, 51) * Double(fallDistance) + time * speed * (0.82 + hash(index, 54) * 0.32))
                .truncatingRemainder(dividingBy: Double(fallDistance)))
            let y = cloudBase + fallen
            let x = source.rect.minX
                + source.rect.width * CGFloat(0.16 + hash(index, 52) * 0.68)
                + fallen * CGFloat(wind * 0.18)
            let radius = CGFloat(2.2 + hash(index, 53) * 2.8)
            if frames.isEmpty {
                context.fill(
                    Path(ellipseIn: CGRect(x: x - radius, y: y - radius, width: radius * 2, height: radius * 2)),
                    with: .radialGradient(
                        Gradient(colors: [.white, Color.cyan.opacity(0.72)]),
                        center: CGPoint(x: x - radius * 0.3, y: y - radius * 0.3),
                        startRadius: 0,
                        endRadius: radius
                    )
                )
            } else {
                let side = radius * CGFloat(4.2 + hash(index, 55) * 1.4)
                context.drawLayer { layer in
                    layer.opacity = 0.70 + hash(index, 56) * 0.22
                    layer.draw(
                        layer.resolve(frames[index % frames.count]),
                        in: CGRect(x: x - side * 0.5, y: y - side * 0.5, width: side, height: side)
                    )
                }
            }
        }
    }

    private static func drawLightning(
        scene: WeatherSceneDescriptor,
        time: TimeInterval,
        intensity: Double,
        in context: inout GraphicsContext,
        size: CGSize
    ) {
        let variants = WeatherLightningSpriteFrames.variants
        guard !variants.isEmpty else { return }

        let cycleLength = max(2.7, 5.8 - intensity * 2.1)
        let strikeNumber = Int(floor(time / cycleLength))
        let frames = variants[abs(strikeNumber) % variants.count]
        guard !frames.isEmpty else { return }

        let eventLength = 0.48
        let rawCycle = time.truncatingRemainder(dividingBy: cycleLength)
        let cycle = rawCycle < 0 ? rawCycle + cycleLength : rawCycle
        guard cycle < eventLength else { return }

        let frameProgress = cycle / eventLength * Double(frames.count)
        let frameIndex = min(frames.count - 1, Int(frameProgress))

        let placements = cloudPlacements(scene: scene, time: time, size: size)
        let visibleBounds = CGRect(origin: .zero, size: size).insetBy(dx: -35, dy: 0)
        let visibleStormClouds = placements.filter {
            $0.usesStormSprite && $0.rect.intersects(visibleBounds)
        }
        let visibleClouds = placements.filter { $0.rect.intersects(visibleBounds) }
        let sourceClouds = visibleStormClouds.isEmpty ? visibleClouds : visibleStormClouds
        guard !sourceClouds.isEmpty else { return }
        let source = sourceClouds[abs(strikeNumber &* 7) % sourceClouds.count]

        // The atlas is top-anchored. Starting slightly inside the cloud's
        // lower edge visually hides the join and makes the leader emerge from
        // the cloud rather than from empty sky.
        let sourceX = source.rect.minX
            + source.rect.width * CGFloat(0.34 + hash(strikeNumber, 61) * 0.32)
        let sourceY = source.rect.midY + source.rect.height * 0.16
        let strikeWidth = size.width * CGFloat(0.055 + hash(strikeNumber, 62) * 0.022)
        let strikeRect = CGRect(
            x: sourceX - strikeWidth * 0.5,
            y: sourceY,
            width: strikeWidth,
            height: min(size.height * 0.52, size.height - sourceY + 18)
        )
        let flashCurve = [0.03, 0.10, 0.28, 0.92, 0.60, 0.24, 0.08, 0.0][frameIndex]
        context.fill(
            Path(CGRect(origin: .zero, size: size)),
            with: .color(.white.opacity(flashCurve * 0.13 * intensity))
        )
        context.drawLayer { layer in
            layer.opacity = min(0.92, 0.40 + intensity * 0.50)
            layer.addFilter(.shadow(color: Color(red: 0.68, green: 0.77, blue: 1).opacity(0.62), radius: 4))
            layer.draw(layer.resolve(frames[frameIndex]), in: strikeRect)
        }
    }

    private static func drawTropicalStormEffects(
        scene: WeatherSceneDescriptor,
        time: TimeInterval,
        intensity: Double,
        in context: inout GraphicsContext,
        size: CGSize
    ) {
        let severity = min(max((intensity - 0.70) / 0.30, 0), 1)
        let direction: CGFloat = scene.cloudTravelVector.dx >= 0 ? 1 : -1

        // Tropical cyclones are not visible as a satellite-style spiral from
        // the ground. Broad fast squall curtains and wind-blown sea spray give
        // the correct low, horizontal point of view.
        for index in 0..<7 {
            let width = size.width * CGFloat(0.48 + hash(index, 131) * 0.52)
            let height = size.height * CGFloat(0.055 + hash(index, 132) * 0.075)
            let travel = size.width + width * 1.35
            let speed = (82 + scene.effectiveWindKPH * (1.30 + severity * 0.55))
                * (0.72 + hash(index, 133) * 0.52)
            let rawX = hash(index, 134) * Double(travel) + time * speed * Double(direction)
            let wrappedX = rawX.truncatingRemainder(dividingBy: Double(travel))
            let normalizedX = CGFloat(wrappedX < 0 ? wrappedX + Double(travel) : wrappedX)
            let x = normalizedX - width
            let y = size.height * CGFloat(0.17 + hash(index, 135) * 0.64)
            let bandRect = CGRect(x: x, y: y, width: width, height: height)

            context.drawLayer { layer in
                layer.addFilter(.blur(radius: 13 + CGFloat(hash(index, 136) * 12)))
                layer.fill(
                    Path(ellipseIn: bandRect),
                    with: .linearGradient(
                        Gradient(colors: [
                            Color.clear,
                            Color(red: 0.76, green: 0.86, blue: 0.91)
                                .opacity(0.045 + severity * 0.040),
                            Color.white.opacity(0.035 + severity * 0.035),
                            Color.clear
                        ]),
                        startPoint: CGPoint(x: direction > 0 ? bandRect.minX : bandRect.maxX, y: bandRect.midY),
                        endPoint: CGPoint(x: direction > 0 ? bandRect.maxX : bandRect.minX, y: bandRect.midY)
                    )
                )
            }
        }

        let sprayCount = Int(34 + severity * 42)
        for index in 0..<sprayCount {
            let duration = max(0.65, 1.85 - severity * 0.55 + hash(index, 141) * 0.75)
            let rawProgress = (time / duration + hash(index, 142))
                .truncatingRemainder(dividingBy: 1)
            let progress = rawProgress < 0 ? rawProgress + 1 : rawProgress
            let eased = progress * progress * (3 - 2 * progress)
            let visibility = pow(sin(.pi * progress), 1.25)
            let travel = size.width + 110
            let x = direction > 0
                ? -55 + CGFloat(eased) * travel
                : size.width + 55 - CGFloat(eased) * travel
            let baseY = size.height * CGFloat(0.34 + hash(index, 143) * 0.62)
            let lift = sin(time * (1.4 + hash(index, 144)) + Double(index)) * (7 + severity * 9)
            let y = baseY + CGFloat(lift) - CGFloat(progress) * CGFloat(8 + severity * 18)
            let length = CGFloat(4 + hash(index, 145) * 11 + severity * 5)
            var spray = Path()
            spray.move(to: CGPoint(x: x, y: y))
            spray.addLine(to: CGPoint(x: x + length * direction, y: y - length * 0.14))
            context.stroke(
                spray,
                with: .color(Color(red: 0.83, green: 0.92, blue: 0.97).opacity((0.10 + severity * 0.10) * visibility)),
                style: StrokeStyle(lineWidth: 0.7 + severity * 0.55, lineCap: .round)
            )
        }

        drawWind(
            scene: scene,
            time: time,
            intensity: 0.70 + severity * 0.30,
            in: &context,
            size: size
        )
    }

    private static func drawAtmosphericBands(
        kind: WeatherSceneKind,
        time: TimeInterval,
        in context: inout GraphicsContext,
        size: CGSize
    ) {
        let tint: Color
        switch kind {
        case .smoke: tint = Color(red: 0.40, green: 0.34, blue: 0.32)
        case .haze: tint = Color(red: 0.88, green: 0.78, blue: 0.56)
        default: tint = .white
        }
        for index in 0..<9 {
            let width = size.width * CGFloat(0.70 + hash(index, 71) * 0.65)
            let height = CGFloat(35 + hash(index, 72) * 72)
            let travel = size.width + width
            let direction = index.isMultiple(of: 2) ? 1.0 : -1.0
            let raw = hash(index, 73) * travel + time * (7 + hash(index, 74) * 8) * direction
            let x = CGFloat(raw.truncatingRemainder(dividingBy: travel)) - width
            let y = size.height * CGFloat(0.13 + hash(index, 75) * 0.70)
            let rect = CGRect(x: x, y: y, width: width, height: height)
            context.drawLayer { layer in
                layer.addFilter(.blur(radius: height * 0.45))
                layer.fill(Path(ellipseIn: rect), with: .color(tint.opacity(kind == .fog ? 0.24 : 0.15)))
            }
        }
    }

    private static func drawDust(
        scene: WeatherSceneDescriptor,
        time: TimeInterval,
        intensity: Double,
        in context: inout GraphicsContext,
        size: CGSize
    ) {
        drawAtmosphericBands(kind: .dust, time: time, in: &context, size: size)
        let count = Int(60 + intensity * 80)
        let direction = scene.cloudTravelVector.dx >= 0 ? 1.0 : -1.0
        for index in 0..<count {
            let speed = (35 + hash(index, 81) * 90) * direction * (0.6 + min(scene.effectiveWindKPH, 100) / 70)
            let x = CGFloat((hash(index, 82) * (size.width + 30) + time * speed).truncatingRemainder(dividingBy: size.width + 30)) - 15
            let y = CGFloat(hash(index, 83)) * size.height
            let radius = CGFloat(0.7 + hash(index, 84) * 2.1)
            context.fill(
                Path(ellipseIn: CGRect(x: x, y: y, width: radius * 2, height: radius * 2)),
                with: .color(Color(red: 0.96, green: 0.76, blue: 0.46).opacity(0.22 + hash(index, 85) * 0.38))
            )
        }
    }

    private static func drawWind(
        scene: WeatherSceneDescriptor,
        time: TimeInterval,
        intensity: Double,
        in context: inout GraphicsContext,
        size: CGSize
    ) {
        let count = Int(7 + intensity * 10)
        let direction: CGFloat = scene.cloudTravelVector.dx >= 0 ? 1 : -1
        for index in 0..<count {
            let duration = max(0.95, 3.15 - intensity * 1.20 + hash(index, 91) * 1.05)
            let rawProgress = (time / duration + hash(index, 92))
                .truncatingRemainder(dividingBy: 1)
            let progress = rawProgress < 0 ? rawProgress + 1 : rawProgress
            let eased = progress * progress * (3 - 2 * progress)
            let visibility = pow(sin(.pi * progress), 1.45)
            let lengthPulse = 0.72 + sin(.pi * progress) * 0.38
            let length = CGFloat(52 + intensity * 105 + hash(index, 94) * 70) * CGFloat(lengthPulse)
            let travel = size.width + length * 2
            let x = direction > 0
                ? -length + CGFloat(eased) * travel
                : size.width + length - CGFloat(eased) * travel
            let baseY = CGFloat(0.10 + hash(index, 93) * 0.76) * size.height
            let verticalWave = sin(time * (1.15 + hash(index, 95) * 0.65) + Double(index) * 1.73)
                * (7 + intensity * 8)
            let y = baseY + CGFloat(verticalWave)
            let bend = CGFloat(sin(time * 1.35 + Double(index) * 0.91)) * (10 + intensity * 9)
            var streak = Path()
            streak.move(to: CGPoint(x: x, y: y))
            streak.addCurve(
                to: CGPoint(x: x + length * direction, y: y + bend * 0.20),
                control1: CGPoint(x: x + length * 0.28 * direction, y: y - bend),
                control2: CGPoint(x: x + length * 0.72 * direction, y: y + bend)
            )
            context.drawLayer { layer in
                if index % 3 == 0 {
                    layer.addFilter(.blur(radius: 1.6))
                }
                layer.stroke(
                    streak,
                    with: .linearGradient(
                        Gradient(colors: [
                            Color.white.opacity(0),
                            Color.white.opacity((0.13 + intensity * 0.20) * visibility),
                            Color.white.opacity(0)
                        ]),
                        startPoint: CGPoint(x: x, y: y),
                        endPoint: CGPoint(x: x + length * direction, y: y)
                    ),
                    style: StrokeStyle(lineWidth: 1.0 + intensity * 1.15, lineCap: .round)
                )
            }
        }
    }

    private static func drawHeatShimmer(time: TimeInterval, in context: inout GraphicsContext, size: CGSize) {
        let horizonRect = CGRect(x: 0, y: size.height * 0.31, width: size.width, height: size.height * 0.48)
        context.fill(
            Path(horizonRect),
            with: .linearGradient(
                Gradient(colors: [
                    Color.clear,
                    Color(red: 1, green: 0.88, blue: 0.64).opacity(0.075),
                    Color.white.opacity(0.065),
                    Color.clear
                ]),
                startPoint: CGPoint(x: horizonRect.midX, y: horizonRect.minY),
                endPoint: CGPoint(x: horizonRect.midX, y: horizonRect.maxY)
            )
        )

        for index in 0..<12 {
            let duration = 3.6 + hash(index, 121) * 3.0
            let rawProgress = (time / duration + hash(index, 122))
                .truncatingRemainder(dividingBy: 1)
            let progress = rawProgress < 0 ? rawProgress + 1 : rawProgress
            let visibility = pow(sin(.pi * progress), 1.35)
            let width = size.width * CGFloat(0.09 + hash(index, 123) * 0.15)
            let height = size.height * CGFloat(0.16 + hash(index, 124) * 0.12)
            let baseX = size.width * CGFloat(hash(index, 125))
            let sway = sin(time * (0.48 + hash(index, 126) * 0.24) + Double(index) * 1.19)
                * Double(size.width) * 0.035
            let x = baseX + CGFloat(sway) - width * 0.5
            let y = size.height * CGFloat(0.88 - progress * 0.60)
            context.drawLayer { layer in
                layer.blendMode = .screen
                layer.addFilter(.blur(radius: 13 + CGFloat(hash(index, 127) * 11)))
                layer.fill(
                    Path(ellipseIn: CGRect(x: x, y: y, width: width, height: height)),
                    with: .linearGradient(
                        Gradient(colors: [
                            Color.clear,
                            Color(red: 1, green: 0.83, blue: 0.55).opacity(0.070 * visibility),
                            Color.white.opacity(0.055 * visibility),
                            Color.clear
                        ]),
                        startPoint: CGPoint(x: x, y: y + height),
                        endPoint: CGPoint(x: x, y: y)
                    )
                )
            }
        }

        // A few broad, almost transparent lenses create the slow horizontal
        // breathing seen through very hot air without drawing visible waves.
        for index in 0..<4 {
            let phase = time * (0.20 + hash(index, 128) * 0.11) + Double(index) * 1.8
            let width = size.width * CGFloat(0.34 + hash(index, 129) * 0.22)
            let x = size.width * CGFloat(0.12 + hash(index, 130) * 0.76)
                - width * 0.5
                + CGFloat(sin(phase)) * size.width * 0.05
            let y = size.height * CGFloat(0.34 + Double(index) * 0.105)
            context.drawLayer { layer in
                layer.blendMode = .softLight
                layer.addFilter(.blur(radius: 22))
                layer.fill(
                    Path(ellipseIn: CGRect(x: x, y: y, width: width, height: size.height * 0.10)),
                    with: .color(Color.white.opacity(0.040 + abs(sin(phase)) * 0.018))
                )
            }
        }
    }

    private static func drawFrost(time: TimeInterval, in context: inout GraphicsContext, size: CGSize) {
        let frostOpacity = 0.20 + abs(sin(time * 0.16)) * 0.055
        context.drawLayer { layer in
            layer.opacity = frostOpacity
            layer.draw(
                layer.resolve(WeatherFrostEdgeImage.image),
                in: CGRect(origin: .zero, size: size)
            )
        }

        for index in 0..<7 {
            let duration = 4.5 + hash(index, 101) * 3.8
            let rawProgress = (time / duration + hash(index, 102))
                .truncatingRemainder(dividingBy: 1)
            let progress = rawProgress < 0 ? rawProgress + 1 : rawProgress
            let visibility = pow(sin(.pi * progress), 1.6)
            let width = size.width * CGFloat(0.18 + hash(index, 103) * 0.25)
            let height = width * CGFloat(0.30 + hash(index, 104) * 0.18)
            let x = size.width * CGFloat(hash(index, 105)) - width * 0.5
                + CGFloat(sin(time * 0.34 + Double(index))) * size.width * 0.035
            let y = size.height * CGFloat(0.86 - progress * 0.53)
            context.drawLayer { layer in
                layer.addFilter(.blur(radius: 15 + CGFloat(hash(index, 106) * 10)))
                layer.fill(
                    Path(ellipseIn: CGRect(x: x, y: y, width: width, height: height)),
                    with: .color(Color(red: 0.84, green: 0.94, blue: 1).opacity(0.075 * visibility))
                )
            }
        }

        for index in 0..<24 {
            let duration = 5.5 + hash(index, 107) * 4
            let rawProgress = (time / duration + hash(index, 108))
                .truncatingRemainder(dividingBy: 1)
            let progress = rawProgress < 0 ? rawProgress + 1 : rawProgress
            let x = size.width * CGFloat(hash(index, 109))
                + CGFloat(sin(time * 0.42 + Double(index))) * 12
            let y = size.height * CGFloat(1.02 - progress * 1.08)
            let radius = CGFloat(0.65 + hash(index, 110) * 1.45)
            context.fill(
                Path(ellipseIn: CGRect(x: x - radius, y: y - radius, width: radius * 2, height: radius * 2)),
                with: .color(Color.white.opacity(0.16 + hash(index, 111) * 0.28))
            )
        }
    }

    private static func drawMist(scene: WeatherSceneDescriptor, time: TimeInterval, in context: inout GraphicsContext, size: CGSize) {
        let direction = scene.cloudTravelVector.dx >= 0 ? 1.0 : -1.0
        let speed = 7 + min(scene.effectiveWindKPH, 80) * 0.28
        for index in 0..<4 {
            let width = size.width * CGFloat(0.8 + hash(index, 111) * 0.45)
            let travel = size.width + width
            let rawX = hash(index, 112) * travel + time * speed * direction
            let wrappedX = rawX.truncatingRemainder(dividingBy: travel)
            let x = CGFloat(wrappedX < 0 ? wrappedX + travel : wrappedX) - width
            let y = size.height * CGFloat(0.63 + hash(index, 113) * 0.29)
            context.drawLayer { layer in
                layer.addFilter(.blur(radius: 22))
                layer.fill(
                    Path(ellipseIn: CGRect(x: x, y: y, width: width, height: 70)),
                    with: .color(.white.opacity(0.10))
                )
            }
        }
    }

    private static func drawVignette(in context: inout GraphicsContext, size: CGSize) {
        let rect = CGRect(origin: .zero, size: size)
        context.fill(
            Path(rect),
            with: .radialGradient(
                Gradient(colors: [Color.clear, Color.black.opacity(0.20)]),
                center: CGPoint(x: size.width * 0.5, y: size.height * 0.38),
                startRadius: min(size.width, size.height) * 0.18,
                endRadius: max(size.width, size.height) * 0.82
            )
        )
    }

    /// Stable pseudo-random values keep particles from jumping between frames.
    private static func hash(_ value: Int, _ salt: Int) -> Double {
        let x = sin(Double(value &* 1_103_515_245 &+ salt &* 12_345)) * 43_758.545_312_3
        return x - floor(x)
    }
}

@MainActor
private enum WeatherCloudSpriteFrames {
    static let fair = makeFrames(named: "weather_cloud_fair_sprite")
    static let storm = makeFrames(named: "weather_cloud_storm_sprite")

    private static func makeFrames(named name: String) -> [Image] {
        guard let atlas = UIImage(named: name)?.cgImage else { return [] }

        let columns = 4
        let rows = 2
        let frameWidth = atlas.width / columns
        let frameHeight = atlas.height / rows

        return (0..<(columns * rows)).compactMap { index in
            let column = index % columns
            let row = index / columns
            let rect = CGRect(
                x: column * frameWidth,
                y: row * frameHeight,
                width: frameWidth,
                height: frameHeight
            )
            guard let frame = atlas.cropping(to: rect) else { return nil }
            return Image(decorative: frame, scale: 1, orientation: .up)
        }
    }
}

@MainActor
private enum WeatherLightningSpriteFrames {
    static let variants = [
        makeFrames(named: "weather_lightning_sprite"),
        makeFrames(named: "weather_lightning_sprite_b")
    ].filter { !$0.isEmpty }

    private static func makeFrames(named name: String) -> [Image] {
        guard let atlas = UIImage(named: name)?.cgImage else { return [] }
        let columns = 4
        let rows = 2
        let frameWidth = atlas.width / columns
        let frameHeight = atlas.height / rows
        return (0..<(columns * rows)).compactMap { index in
            let rect = CGRect(
                x: (index % columns) * frameWidth,
                y: (index / columns) * frameHeight,
                width: frameWidth,
                height: frameHeight
            )
            guard let frame = atlas.cropping(to: rect) else { return nil }
            return Image(decorative: frame, scale: 1, orientation: .up)
        }
    }
}

@MainActor
private enum WeatherPrecipitationSpriteFrames {
    static let rain = makeFrames(named: "weather_rain_particles")
    static let snow = makeFrames(named: "weather_snow_particles")
    static let hail = makeFrames(named: "weather_hail_particles")

    private static func makeFrames(named name: String) -> [Image] {
        guard let atlas = UIImage(named: name)?.cgImage else { return [] }
        let columns = 4
        let rows = 3
        let frameWidth = atlas.width / columns
        let frameHeight = atlas.height / rows
        return (0..<(columns * rows)).compactMap { index in
            let rect = CGRect(
                x: (index % columns) * frameWidth,
                y: (index / columns) * frameHeight,
                width: frameWidth,
                height: frameHeight
            )
            guard let frame = atlas.cropping(to: rect) else { return nil }
            return Image(decorative: frame, scale: 1, orientation: .up)
        }
    }
}

@MainActor
private enum WeatherMoonPhaseImages {
    private static let phases: [String: Image] = [
        "new": Image("phase_new"),
        "waxingCrescent": Image("phase_waxing_crescent"),
        "firstQuarter": Image("phase_first_quarter"),
        "waxingGibbous": Image("phase_waxing_gibbous"),
        "full": Image("phase_full"),
        "waningGibbous": Image("phase_waning_gibbous"),
        "lastQuarter": Image("phase_third_quarter"),
        "thirdQuarter": Image("phase_third_quarter"),
        "waningCrescent": Image("phase_waning_crescent")
    ]

    static func image(for phase: String) -> Image {
        phases[phase] ?? phases["full"]!
    }
}

@MainActor
private enum WeatherSunImage {
    static let image = Image("weather_sun_realistic")
}

@MainActor
private enum WeatherFrostEdgeImage {
    static let image = Image("weather_frost_edges")
}
