import SwiftUI

extension WeatherDetailView{
    
    @ViewBuilder
    func humidityGraphSection() -> some View {
        // 1) Extract hourly humidity data (0.0–1.0) for the selected date
        let humidityData = hourlyItemsForSelectedDate.map { $0.humidity }

        // 2) Identify the corresponding DayForecastItem to get min/max daily humidity
        let dayItem = allDailyItems.first {
            Calendar.current.isDate($0.date, inSameDayAs: selectedDate)
        }
        let dailyMinH = dayItem?.humidityMin ?? 0
        let dailyMaxH = dayItem?.humidityMax ?? 1

        // 3) We'll chunk the 24 hours (or however many hours you have) into 6-hour blocks
        let hoursCount = hourlyItemsForSelectedDate.count
        let chunkSize  = 6
        
        // Create an array of (startIndex, endIndex) pairs for each 6-hour chunk
        let chunkRanges: [(start: Int, end: Int)] = stride(from: 0, to: hoursCount, by: chunkSize)
            .map { startIndex in
                let endIndex = min(startIndex + chunkSize, hoursCount)
                return (start: startIndex, end: endIndex)
            }

        // 4) Fraction of day for shading the “past” portion if selectedDate is “today”
        let now = Date()
        let startOfSelectedDay = Calendar.current.startOfDay(for: selectedDate)
        let fractionOfDay = now.timeIntervalSince(startOfSelectedDay) / (24 * 3600)

        // 5) The overall vertical stack for our humidity section
        VStack(spacing: 8) {
            VStack() {
                // Заглавна част
                VStack(alignment: .leading, spacing: 5) {
                    Text("Humidity")
                        .font(.system(size: 16, weight: .semibold))
                    Text("Today's min \(Int(dailyMinH * 100))% – max \(Int(dailyMaxH * 100))%")
                        .font(.system(size: 13))
                        .foregroundColor(.gray)
                }
                // Optional formatting/layout offsets
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal)
                .offset(x: -15)
                .offset(y: 30)
                Spacer()
        }
            // MARK: - Header with daily min–max
          

            
            // MARK: - A row showing 6‑hour chunk averages
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    HStack(spacing: 0) {
                        // ForEach over our chunkRanges
                        ForEach(chunkRanges.indices, id: \.self) { i in
                            let (startIndex, endIndex) = chunkRanges[i]
                            let block   = hourlyItemsForSelectedDate[startIndex..<endIndex]
                            let avgHum  = block.map(\.humidity).reduce(0, +) / Double(block.count)
                            let avgPct  = Int(round(avgHum * 100))

                            Text("\(avgPct)%")
                                .font(.system(size: 12, weight: .bold))
                                .frame(maxWidth: .infinity)
                        }
                    }
                    
                    // If this is “today,” shade the fraction of the day that’s already passed
                    if Calendar.current.isDate(now, inSameDayAs: selectedDate) {
                        let overlayWidth = geo.size.width * CGFloat(fractionOfDay)
                        Rectangle()
                            .fill(Color.black.opacity(0.4))
                            .frame(width: overlayWidth)
                    }
                }
            }
            .frame(height: 20)
            .padding(.horizontal, graphPadding)
            .offset(y: 35)


            // MARK: - Canvas-based line chart
            Canvas { context, size in
                // 6) Bail out if we have no data or zero-size
                guard humidityData.count > 1,
                      size.width > graphPadding,
                      size.height > graphPadding * 2 else { return }

                let width  = size.width
                let height = size.height
                let origin = CGPoint(x: graphPadding, y: height - graphPadding)
                let chartWidth  = width  - graphPadding * 2
                let chartHeight = height - graphPadding * 2

                // Y function for 0...1 humidity → chart space
                func yPosition(_ h: Double) -> CGFloat {
                    let ratio = (h - 0.0) / (1.0 - 0.0)  // i.e. 0..1
                    return origin.y - CGFloat(ratio) * chartHeight
                }

                // Horizontal lines at 0%, 20%, 40%, 60%, 80%, 100%
                let humidityMarkers: [Double] = [0, 0.2, 0.4, 0.6, 0.8, 1.0]
                for marker in humidityMarkers {
                    let yPos = yPosition(marker)
                    var hLine = Path()
                    hLine.move(to: CGPoint(x: origin.x, y: yPos))
                    hLine.addLine(to: CGPoint(x: origin.x + chartWidth, y: yPos))
                    context.stroke(hLine,
                                   with: .color(.gray.opacity(0.3)),
                                   style: StrokeStyle(lineWidth: 0.5))
                    
                    let labelPt = CGPoint(x: origin.x + chartWidth + 15, y: yPos)
                    context.draw(
                        Text("\(Int(marker * 100))%")
                            .font(.system(size: 10))
                            .foregroundColor(.gray),
                        at: labelPt,
                        anchor: .center
                    )
                }

                // Vertical lines at hours 0, 6, 12, 18, 24
                let hourMarkers = [0, 6, 12, 18, 24]
                for hour in hourMarkers {
                    let xPos = origin.x + (CGFloat(hour) * (chartWidth / 24.0))
                    var vLine = Path()
                    vLine.move(to: CGPoint(x: xPos, y: graphPadding))
                    vLine.addLine(to: CGPoint(x: xPos, y: origin.y))
                    context.stroke(vLine, with: .color(.gray.opacity(0.3)), style: StrokeStyle(lineWidth: 0.5))
                }

                // Build the line path + fill path
                var linePath = Path()
                var fillPath = Path()
                var points: [CGPoint] = []

                let xStep = chartWidth / CGFloat(max(1, humidityData.count - 1))
                for (index, humVal) in humidityData.enumerated() {
                    let xPos = origin.x + CGFloat(index) * xStep
                    let yPos = yPosition(humVal)
                    let pt   = CGPoint(x: xPos, y: yPos)

                    points.append(pt)
                    if index == 0 {
                        linePath.move(to: pt)
                        fillPath.move(to: CGPoint(x: xPos, y: origin.y))
                        fillPath.addLine(to: pt)
                    } else {
                        linePath.addLine(to: pt)
                        fillPath.addLine(to: pt)
                    }
                }
                // Close fill path from last point down to baseline
                if let lastPt = points.last {
                    fillPath.addLine(to: CGPoint(x: lastPt.x, y: origin.y))
                    fillPath.closeSubpath()
                }

                // Simple gradient from yellow (dry) to blue (wet)
                let humidityGradient = Gradient(stops: [
                    .init(color: .yellow, location: 0.0),
                    .init(color: .blue,   location: 1.0)
                ])

                // Fill under line
                context.drawLayer { layerContext in
                    layerContext.fill(
                        fillPath,
                        with: .linearGradient(
                            humidityGradient,
                            startPoint: CGPoint(x: 0, y: size.height),
                            endPoint:   CGPoint(x: 0, y: 0)
                        )
                    )
                }

                // Stroke the line with a gradient
                context.drawLayer { layerContext in
                    let strokeStyle = StrokeStyle(lineWidth: 2.5, lineCap: .round, lineJoin: .round)
                    let strokedPath = linePath.strokedPath(strokeStyle)
                    layerContext.clip(to: strokedPath)
                    layerContext.fill(
                        Path(CGRect(origin: .zero, size: size)),
                        with: .linearGradient(
                            humidityGradient,
                            startPoint: CGPoint(x: 0, y: size.height),
                            endPoint:   CGPoint(x: 0, y: 0)
                        )
                    )
                }

                // Min & Max markers
                if let maxHum = humidityData.max(),
                   let maxIndex = humidityData.firstIndex(of: maxHum),
                   points.indices.contains(maxIndex) {
                    let highPoint = points[maxIndex]
                    drawHLMarker(context: context, label: "Max", at: highPoint)
                }
                if let minHum = humidityData.min(),
                   let minIndex = humidityData.firstIndex(of: minHum),
                   points.indices.contains(minIndex) {
                    let lowPoint = points[minIndex]
                    drawHLMarker(context: context, label: "Min", at: lowPoint)
                }

                // Shade the “past” portion if selected date is today
                if Calendar.current.isDate(now, inSameDayAs: selectedDate),
                   let currentHourIndex = hourlyItemsForSelectedDate.firstIndex(where: {
                       Calendar.current.isDate($0.date, equalTo: now, toGranularity: .hour)
                   }) {
                    let currentXPos = origin.x + CGFloat(currentHourIndex) * xStep

                    // Vertical line at current hour
                    var verticalLine = Path()
                    verticalLine.move(to: CGPoint(x: currentXPos, y: graphPadding))
                    verticalLine.addLine(to: CGPoint(x: currentXPos, y: origin.y))
                    context.stroke(verticalLine, with: .color(.white.opacity(0.7)), style: StrokeStyle(lineWidth: 2))

                    // Dark rectangle for everything to the left
                    let darkRect = CGRect(
                        x: origin.x,
                        y: graphPadding,
                        width: currentXPos - origin.x,
                        height: chartHeight
                    )
                    context.fill(Path(darkRect), with: .color(.black.opacity(0.3)))
                }

                // Hour labels at bottom
                for hour in hourMarkers {
                    let xPos = origin.x + (CGFloat(hour) * (chartWidth / 24.0))
                    let labelPoint = CGPoint(x: xPos, y: origin.y + 14)
                    context.draw(
                        Text(String(format: "%02d", hour))
                            .font(.system(size: 11))
                            .foregroundColor(.gray),
                        at: labelPoint,
                        anchor: .center
                    )
                }

                // DRAG Gesture Interpolation – showing humidity % and time
                if let dragPoint = dragLocationHumidity {
                    if dragPoint.x >= origin.x && dragPoint.x <= origin.x + chartWidth {
                        let fractionIndex = (dragPoint.x - origin.x) / xStep
                        let lowerIndex = max(0, min(points.count - 1, Int(floor(fractionIndex))))
                        let upperIndex = max(0, min(points.count - 1, lowerIndex + 1))
                        let t = (upperIndex == lowerIndex) ? 0 : (fractionIndex - CGFloat(lowerIndex))

                        // Interpolate humidity
                        let lowerValue = humidityData[lowerIndex]
                        let upperValue = humidityData[upperIndex]
                        let hVal = lowerValue + (upperValue - lowerValue) * Double(t)

                        // Interpolate y
                        var hY = points[lowerIndex].y
                        if upperIndex != lowerIndex {
                            hY += t * (points[upperIndex].y - points[lowerIndex].y)
                        }
                        let dotPoint = CGPoint(x: dragPoint.x, y: hY)

                        // Vertical line
                        var vLine = Path()
                        vLine.move(to: CGPoint(x: dotPoint.x, y: graphPadding))
                        vLine.addLine(to: CGPoint(x: dotPoint.x, y: origin.y))
                        context.stroke(vLine, with: .color(.white.opacity(0.5)), lineWidth: 1)

                        // Dot
                        let dotRect = CGRect(center: dotPoint, radius: 4)
                        context.fill(Path(ellipseIn: dotRect), with: .color(.white))

                        // Time interpolation
                        let timeLabel: String
                        if lowerIndex < hourlyItemsForSelectedDate.count,
                           upperIndex < hourlyItemsForSelectedDate.count {
                            let d1 = hourlyItemsForSelectedDate[lowerIndex].date
                            let d2 = hourlyItemsForSelectedDate[upperIndex].date
                            let totalInterval = d2.timeIntervalSince(d1)
                            let interpolatedDate = d1.addingTimeInterval(totalInterval * Double(t))
                            let df = DateFormatter()
                            df.dateFormat = "HH:mm"
                            timeLabel = df.string(from: interpolatedDate)
                        } else {
                            timeLabel = "--:--"
                        }

                        let labelText = "\(timeLabel)\n\(Int(round(hVal * 100)))%"
                        let label = Text(labelText)
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(.white)

                        let labelOffset: CGFloat = 8
                        let textPoint = CGPoint(x: dotPoint.x + labelOffset, y: dotPoint.y - 20)
                        context.draw(label, at: textPoint, anchor: .bottomLeading)
                    }
                }
            }
            .gesture(
                DragGesture(minimumDistance: 0)
                    .onChanged { value in
                        // If you want a separate var for humidity drag location,
                        // create: @State private var dragLocationHumidity: CGPoint?
                        dragLocationHumidity = value.location
                    }
                    .onEnded { _ in
                        dragLocationHumidity = nil
                    }
            )
            // Increase the chart’s height for extra space
            .frame(height: (graphHeight + 20) * 1.5)

            Divider()
                .background(Color.gray.opacity(0.4))
                .padding(.horizontal, graphPadding / 2)
                .padding(.top, 2)
        }

        // Optionally, show a small textual summary
        VStack(alignment: .leading, spacing: 4) {
            Text("Now, \(currentTimeString)")
                .font(.caption)
                .foregroundColor(.secondary)
            Text("Today's humidity ranges from \(Int(dailyMinH * 100))% to \(Int(dailyMaxH * 100))%. A comfortable indoor humidity is around 40–60%.")
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding(.top, 5)
    }
    
}
