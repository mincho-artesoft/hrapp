import SwiftUI

/// Large trajectory used only by the dedicated solar sheet.
struct SheetSolarArcView: View {
    @Environment(\.layoutDirection) private var layoutDirection

    let sunrise: Date?
    let sunset: Date?
    let observationDate: Date
    let formatTime: (Date?) -> String
    var height: CGFloat = 60
    var sunSourceSide: CGFloat = 42
    var showsLabels = true

    var body: some View {
        VStack(spacing: height > 100 ? 10 : 4) {
            ZStack {
                Canvas { context, size in
                    guard size.width > 0, size.height > 0 else { return }

                    let geometry = arcGeometry(in: size)
                    guard geometry.radius > 0 else { return }

                    let fullArc = Path { path in
                        path.addArc(
                            center: geometry.center,
                            radius: geometry.radius,
                            startAngle: .degrees(180),
                            endAngle: .degrees(360),
                            clockwise: false
                        )
                    }
                    context.stroke(
                        fullArc,
                        with: .color(.secondary.opacity(0.7)),
                        style: StrokeStyle(lineWidth: height > 100 ? 1.5 : 1, dash: [4, 4])
                    )
                }
                .frame(height: height)

                GeometryReader { proxy in
                    if isSunAboveHorizon {
                        Image("weather_sun_realistic")
                            .resizable()
                            .scaledToFit()
                            .frame(width: sunSourceSide, height: sunSourceSide)
                            .position(sunPosition(in: proxy.size))
                            .allowsHitTesting(false)
                    }
                }
                // `sunPosition` already returns a physical RTL-aware point.
                .environment(\.layoutDirection, .leftToRight)
            }
            .frame(height: height)

            if showsLabels {
                HStack {
                    solarTimeLabel(
                        NSLocalizedString("Sunrise", comment: "Sunrise label"),
                        date: sunrise,
                        alignment: .leading
                    )

                    Spacer()

                    solarTimeLabel(
                        NSLocalizedString("Sunset", comment: "Sunset label"),
                        date: sunset,
                        alignment: .trailing
                    )
                }
                .padding(.horizontal, 5)
            }
        }
        .padding(.bottom, showsLabels ? 2 : 0)
        .accessibilityElement(children: .combine)
    }

    private func sunFraction(at date: Date) -> Double {
        guard let sunrise, let sunset, sunrise < sunset else {
            if let sunset, date >= sunset { return 1 }
            return 0
        }

        let duration = sunset.timeIntervalSince(sunrise)
        guard duration > 0 else { return date >= sunset ? 1 : 0 }
        return max(0, min(1, date.timeIntervalSince(sunrise) / duration))
    }

    private var isSunAboveHorizon: Bool {
        guard let sunrise, let sunset else { return false }
        return observationDate >= sunrise && observationDate <= sunset
    }

    private func arcGeometry(in size: CGSize) -> (center: CGPoint, radius: CGFloat) {
        let safeInset = sunSourceSide * 0.25
        let availableWidth = max(0, size.width - safeInset * 2)
        let centerY = max(safeInset, size.height - safeInset)
        return (
            CGPoint(x: size.width / 2, y: centerY),
            min(availableWidth / 2, centerY)
        )
    }

    private func sunPosition(in size: CGSize) -> CGPoint {
        let geometry = arcGeometry(in: size)
        let sweep = sunFraction(at: observationDate) * 180
        let angle = Angle.degrees(
            layoutDirection == .rightToLeft ? 360 - sweep : 180 + sweep
        )
        return CGPoint(
            x: geometry.center.x + geometry.radius * CGFloat(cos(angle.radians)),
            y: geometry.center.y + geometry.radius * CGFloat(sin(angle.radians))
        )
    }

    @ViewBuilder
    private func solarTimeLabel(
        _ title: String,
        date: Date?,
        alignment: HorizontalAlignment
    ) -> some View {
        VStack(alignment: alignment, spacing: 2) {
            Text(title)
                .font(.system(size: height > 100 ? 13 : 10, weight: .medium))
                .foregroundStyle(.secondary.opacity(0.8))
                .adaptiveSingleLine(minimumScale: 0.4)
            Text(formatTime(date))
                .font(.system(size: height > 100 ? 17 : 12, weight: .semibold))
                .foregroundStyle(.primary)
        }
    }
}

struct SunsetCard: View {
    let sunrise: Date?
    let sunset: Date?
    let formatTime: (Date?) -> String
    var observationDate: Date? = nil

    var body: some View {
        WeatherDetailCard {
            Label(
                NSLocalizedString("SUNRISE", comment: "Sunrise card title"),
                systemImage: "sunrise.fill"
            )
            .symbolRenderingMode(.multicolor)
            .font(.system(size: 10, weight: .medium))
            .foregroundStyle(.secondary)
            .adaptiveSingleLine(minimumScale: 0.4)

            TimelineView(.periodic(from: .now, by: 60)) { context in
                CompactSolarArcView(
                    sunrise: sunrise,
                    sunset: sunset,
                    observationDate: observationDate ?? context.date,
                    formatTime: formatTime
                )
            }
        }
    }
}

/// The original compact-card trajectory and layout. This component is kept
/// separate from `SheetSolarArcView`, which belongs exclusively to the sheet.
private struct CompactSolarArcView: View {
    @Environment(\.layoutDirection) private var layoutDirection

    let sunrise: Date?
    let sunset: Date?
    let observationDate: Date
    let formatTime: (Date?) -> String

    var body: some View {
        ZStack {
            Canvas { context, size in
                guard size.width > 0, size.height > 0 else { return }

                // Original card geometry: a 60 pt radius within a 60 pt canvas.
                let diameter = min(size.width, size.height * 2)
                let radius = diameter / 2
                guard radius > 0 else { return }

                let center = CGPoint(x: size.width / 2, y: size.height)
                let arc = Path { path in
                    path.addArc(
                        center: center,
                        radius: radius,
                        startAngle: .degrees(180),
                        endAngle: .degrees(360),
                        clockwise: false
                    )
                }
                context.stroke(
                    arc,
                    with: .color(.secondary.opacity(0.7)),
                    style: StrokeStyle(lineWidth: 1, dash: [3, 3])
                )
            }
            .frame(height: 60)

            // Kept outside Canvas so the bitmap is never clipped at solar
            // noon or either end of the original trajectory.
            GeometryReader { proxy in
                if sunrise != nil || sunset != nil {
                    Image("weather_sun_realistic")
                        .resizable()
                        .scaledToFit()
                        // The asset contains a wide transparent atmospheric
                        // margin. 64 pt yields approximately the same 25 pt
                        // visible sun/glow as the original compact symbol.
                        .frame(width: 64, height: 64)
                        .position(sunPosition(in: proxy.size, at: observationDate))
                        .allowsHitTesting(false)
                }
            }
            // `sunPosition` already returns a physical RTL-aware point.
            .environment(\.layoutDirection, .leftToRight)
        }
        .frame(height: 60)
        .overlay(alignment: .bottom) {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text(NSLocalizedString("Sunrise", comment: "Sunrise label"))
                        .font(.system(size: 10, weight: .medium))
                        .foregroundStyle(.secondary.opacity(0.8))
                        .adaptiveSingleLine(minimumScale: 0.4)
                    Text(formatTime(sunrise))
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundStyle(.primary)
                }

                Spacer()

                VStack(alignment: .trailing, spacing: 2) {
                    Text(NSLocalizedString("Sunset", comment: "Sunset label"))
                        .font(.system(size: 10, weight: .medium))
                        .foregroundStyle(.secondary.opacity(0.8))
                        .adaptiveSingleLine(minimumScale: 0.4)
                    Text(formatTime(sunset))
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundStyle(.primary)
                }
            }
            .padding(.horizontal, 5)
        }
        .padding(.bottom, 5)
    }

    private func sunFraction(at date: Date) -> Double {
        guard let sunrise, let sunset, sunrise < sunset else {
            return date >= (sunset ?? .distantFuture) ? 1 : 0
        }
        let duration = sunset.timeIntervalSince(sunrise)
        guard duration > 0 else { return date >= sunset ? 1 : 0 }
        return max(0, min(1, date.timeIntervalSince(sunrise) / duration))
    }

    private func sunPosition(in size: CGSize, at date: Date) -> CGPoint {
        let diameter = min(size.width, size.height * 2)
        let radius = diameter / 2
        let center = CGPoint(x: size.width / 2, y: size.height)
        let sweep = sunFraction(at: date) * 180
        let angle = Angle.degrees(
            layoutDirection == .rightToLeft ? 360 - sweep : 180 + sweep
        )
        return CGPoint(
            x: center.x + radius * CGFloat(cos(angle.radians)),
            y: center.y + radius * CGFloat(sin(angle.radians))
        )
    }
}
