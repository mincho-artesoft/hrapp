import SwiftUI

struct SunsetCard: View {
    let sunrise: Date?
    let sunset: Date?
    let formatTime: (Date?) -> String // Expects a function like vm.formatTime

    // Sun arc view styled like the screenshot
    @ViewBuilder func sunArc() -> some View {
        Canvas { context, size in
            // Ensure size is valid for drawing
            guard size.width > 0, size.height > 0 else { return }

            // 1) Изчисляване на необходимите променливи
            let diameter = min(size.width, size.height * 2)
            let radius = diameter / 2
            guard radius > 0 else { return }

            let center = CGPoint(x: size.width / 2, y: size.height)

            // 2) Изчисляване на sunFraction (0 = изгрев, 1 = залез)
            let now = Date()
            var sunFraction: Double = 0.5
            if let rise = sunrise, let set = sunset, rise < set {
                let totalDuration = set.timeIntervalSince(rise)
                if totalDuration > 0 {
                    let elapsed = now.timeIntervalSince(rise)
                    sunFraction = max(0.0, min(1.0, elapsed / totalDuration))
                } else if now >= set {
                    sunFraction = 1.0
                } else if now < rise {
                    sunFraction = 0.0
                }
            } else if let set = sunset, now >= set {
                sunFraction = 1.0
            } else if let rise = sunrise, now < rise {
                sunFraction = 0.0
            }

            // Ъгли за дъгата
            let startAngle = Angle.degrees(180)
            let currentSweepDegrees = sunFraction * 180.0
            let endAngleProgress = Angle.degrees(180.0 + currentSweepDegrees)
            let finalSunAngle = endAngleProgress

            // 3) Позиция на слънцето по дъгата
            let sunX = center.x + radius * CGFloat(cos(finalSunAngle.radians))
            let sunY = center.y + radius * CGFloat(sin(finalSunAngle.radians))
            let drawPoint = CGPoint(x: sunX, y: sunY)

            // 4) Цялата пунктирана дъга (background arc)
            let fullArcPath = Path { path in
                path.addArc(center: center, radius: radius,
                            startAngle: startAngle, endAngle: .degrees(360), clockwise: false)
            }
            context.stroke(fullArcPath,
                           with: .color(.secondary.opacity(0.7)),
                           style: StrokeStyle(lineWidth: 1, dash: [3, 3]))

            // 5) Подготовка на текста с иконката на слънцето
            let sunSymbolText = Text(Image(systemName: "sun.max.fill"))
                .font(.system(size: 10))
                .foregroundStyle(.yellow)

            let resolvedSunText = context.resolve(sunSymbolText)

            // 6) Рисуваме слънцето + добавяме сияние (glow)
            if sunrise != nil || sunset != nil {
                // --- ADD GLOW: кръг с радиален градиент зад символа ---
                let glowRadius: CGFloat = 14
                let glowRect = CGRect(
                    x: drawPoint.x - glowRadius,
                    y: drawPoint.y - glowRadius,
                    width: glowRadius * 2,
                    height: glowRadius * 2
                )
                let glowCirclePath = Path(ellipseIn: glowRect)

                // Добавяме лек радиален градиент (от жълтеникаво към прозрачно)
                context.fill(
                    glowCirclePath,
                    with: .radialGradient(
                        Gradient(colors: [.yellow.opacity(0.4), .clear]),
                        center: drawPoint,
                        startRadius: 0,
                        endRadius: glowRadius
                    )
                )

                // Може да се сложи и stroke за външен контур, ако искате:
                /*
                context.stroke(
                    glowCirclePath,
                    with: .color(.yellow.opacity(0.6)),
                    style: StrokeStyle(lineWidth: 1)
                )
                */

                // --- Накрая рисуваме и самото "слънце" (иконката) отгоре ---
                context.draw(resolvedSunText, at: drawPoint, anchor: .center)
            }

        } // End Canvas
        .frame(height: 60)
        .overlay(alignment: .bottom) {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Sunrise")
                        .font(.system(size: 10, weight: .medium))
                        .foregroundStyle(.secondary.opacity(0.8))
                    Text(formatTime(sunrise))
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundStyle(.primary)
                }

                Spacer()

                VStack(alignment: .trailing, spacing: 2) {
                    Text("Sunset")
                        .font(.system(size: 10, weight: .medium))
                        .foregroundStyle(.secondary.opacity(0.8))
                    Text(formatTime(sunset))
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundStyle(.primary)
                }
            }
            .padding(.horizontal, 5)
        }
        .padding(.bottom, 5)
    }


    // The main body of the SunsetCard view
    var body: some View {
        // Use the base card styling
        WeatherDetailCard {
            // Card Title Label - Use "SUNRISE" to match the time displayed
            Label("SUNRISE", systemImage: "sunrise.fill") // Changed icon and label
                .symbolRenderingMode(.multicolor) // Use colors defined in the symbol
                .font(.system(size: 10, weight: .medium)) // Title font style
                .foregroundStyle(.secondary) // Title color


            // Add the Sun Arc Canvas View
            sunArc()
        }
    }
}

