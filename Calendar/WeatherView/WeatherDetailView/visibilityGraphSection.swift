import SwiftUI

extension WeatherDetailView{
    
    @ViewBuilder
    func visibilityGraphSection() -> some View {
        // 1) Extract hourly visibility data (in km) for the selected date
        let visData = hourlyItemsForSelectedDate.map { $0.visibility }
        
        // 2) Get the corresponding DayForecastItem to display daily min/max
        let dayItem = allDailyItems.first {
            Calendar.current.isDate($0.date, inSameDayAs: selectedDate)
        }
        let dailyMinVis = dayItem?.visibilityMin ?? 0
        let dailyMaxVis = dayItem?.visibilityMax ?? 0
        
        // 3) Hardcode the y‑axis range from 0 to 50 (km)
        let yRange: (min: Double, max: Double) = (0.0, 50.0)
        
        // 4) If no data, show a fallback message
        if visData.isEmpty {
            VStack(alignment: .leading, spacing: 8) {
                Text(NSLocalizedString("Visibility_Title", comment: "Section title for visibility"))
                    .font(.system(size: 16, weight: .semibold))
                Text(NSLocalizedString("Visibility_NoData", comment: "No visibility data fallback"))
                    .font(.footnote)
                    .foregroundColor(.gray)
            }
            .padding(.bottom, 8)
        } else {
            // 5) Compute fraction of the day (for shading past hours if `selectedDate` is today)
            // 5) Compute fractionOfDay using customCalendar (with vm.locationTimeZone)
            let now = Date()
            let comps = customCalendar.dateComponents([.hour, .minute, .second], from: now)
            let secondsFromMidnight = Double(comps.hour ?? 0) * 3600
                                   + Double(comps.minute ?? 0) * 60
                                   + Double(comps.second ?? 0)
            let fractionOfDay = secondsFromMidnight / (24 * 3600)

            let unit = GlobalState.distanceUnitLabel

            VStack(spacing: 0) {
                VStack(alignment: .leading, spacing: 5) {
                           if Calendar.current.isDate(selectedDate, inSameDayAs: Date()) {
                               if let currentVis = vm.currentVisibility {
                                   Text(String(
                                       format: NSLocalizedString("Visibility_CurrentFormat", comment: "Current visibility display"),
                                       Int(round(currentVis)),
                                       unit
                                   ))
                                   .font(.system(size: 16, weight: .semibold))

                                   Text(String(
                                       format: NSLocalizedString("Visibility_DailyMinMaxFormat", comment: "Daily min/max visibility"),
                                       Int(round(dailyMinVis)), Int(round(dailyMaxVis)),
                                       unit
                                   ))
                                   .font(.system(size: 13))
                                   .foregroundColor(.gray)
                               } else {
                                   Text(NSLocalizedString("Visibility_NoCurrentData", comment: "No current visibility available"))
                                       .font(.system(size: 16, weight: .semibold))
                               }
                           } else {
                               Text(NSLocalizedString("Visibility_Title", comment: "Section title for visibility"))
                                   .font(.system(size: 16, weight: .semibold))
                               Text(String(
                                   format: NSLocalizedString("Visibility_DailyMinMaxFormat", comment: "Daily min/max visibility"),
                                   Int(round(dailyMinVis)), Int(round(dailyMaxVis)),
                                   unit
                               ))
                               .font(.system(size: 13))
                               .foregroundColor(.gray)
                           }
                       }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal)
                .offset(x: -15)


                // MARK: - Optional two-hour average row at the top
                let twoHourAverages: [Int] = stride(from: 0, to: visData.count, by: 2).map { startIndex in
                    let endIndex = min(startIndex + 2, visData.count)
                    let block = visData[startIndex..<endIndex]
                    return Int(block.reduce(0, +) / Double(block.count))
                }
                Group{
                    GeometryReader { geo in
                        ZStack(alignment: .leading) {
                            HStack(spacing: 0) {
                                if twoHourAverages.isEmpty {
                                    Text(NSLocalizedString("Visibility_HourlyAverages_NoData", comment: "No hourly averages"))
                                                                  .font(.caption)
                                                                  .foregroundColor(.gray)
                                                                  .frame(maxWidth: .infinity, alignment: .center)
                                                                  .padding(.vertical)
                                } else {
                                    ForEach(twoHourAverages.indices, id: \.self) { i in
                                        Text("\(twoHourAverages[i])")
                                            .font(.system(size: 12, weight: .bold))
                                            .frame(maxWidth: .infinity)
                                    }
                                }
                            }
                            
                            // Shading for "past" portion if this is today's date
                            if customCalendar.isDate(now, inSameDayAs: selectedDate) {
                                let overlayWidth = geo.size.width * CGFloat(fractionOfDay)
                                Rectangle()
                                    .fill(Color.black.opacity(0.4))
                                    .frame(width: overlayWidth)
                            }
                        }
                    }
                    .frame(height: 20)
                    .padding(.horizontal, graphPadding)
                    .offset(y: 20)
                    
                    // MARK: - Main line chart
                    Canvas { context, size in
                        guard visData.count > 1,
                              size.width > graphPadding,
                              size.height > graphPadding * 2 else { return }
                        
                        let effectiveWidth  = size.width
                        let effectiveHeight = size.height
                        let origin = CGPoint(x: graphPadding, y: effectiveHeight - graphPadding)
                        let graphWidth  = effectiveWidth  - graphPadding * 2
                        let graphHeight = effectiveHeight - graphPadding * 2
                        
                        // We'll map 0..50 (yRange) into the chart height
                        let yStep = graphHeight / CGFloat(yRange.max - yRange.min)
                        
                        func yPosition(_ vis: Double) -> CGFloat {
                            // higher visibility => higher up on chart
                            return origin.y - CGFloat(vis - yRange.min) * yStep
                        }
                        
                        // Horizontal grid lines at e.g. 0, 10, 20, 30, 40, 50
                        let step = 5.0
                        let horizontalMarkers = stride(from: yRange.min,
                                                       through: yRange.max,
                                                       by: step).map { $0 }
                        for marker in horizontalMarkers {
                            let yPos = yPosition(marker)
                            var linePath = Path()
                            linePath.move(to: CGPoint(x: origin.x, y: yPos))
                            linePath.addLine(to: CGPoint(x: origin.x + graphWidth, y: yPos))
                            context.stroke(
                                linePath,
                                with: .color(.gray.opacity(0.3)),
                                style: StrokeStyle(lineWidth: 0.5)
                            )
                            
                            // Label on the right (e.g. "10", "20", etc.)
                            let labelPoint = CGPoint(x: origin.x + graphWidth + 15, y: yPos)
                            context.draw(
                                Text("\(Int(marker))")
                                    .font(.system(size: 10))
                                    .foregroundColor(.gray),
                                at: labelPoint,
                                anchor: .center
                            )
                        }
                        
                        // Vertical hour markers for 0, 6, 12, 18, 24
                        let hourMarkers = [0, 6, 12, 18, 24]
                        for hour in hourMarkers {
                            let xPos = origin.x + (CGFloat(hour) * (graphWidth / 24.0))
                            var vLine = Path()
                            vLine.move(to: CGPoint(x: xPos, y: graphPadding))
                            vLine.addLine(to: CGPoint(x: xPos, y: origin.y))
                            context.stroke(
                                vLine,
                                with: .color(.gray.opacity(0.3)),
                                style: StrokeStyle(lineWidth: 0.5)
                            )
                        }
                        
                        // Build the path (line + fill) for visibility
                        var points: [CGPoint] = []
                        var linePath = Path()
                        var fillPath = Path()
                        
                        let xStep = graphWidth / CGFloat(max(1, visData.count - 1))
                        for (i, val) in visData.enumerated() {
                            let xPos = origin.x + CGFloat(i) * xStep
                            let yPos = yPosition(val)
                            let pt   = CGPoint(x: xPos, y: yPos)
                            points.append(pt)
                            
                            if i == 0 {
                                linePath.move(to: pt)
                                fillPath.move(to: CGPoint(x: xPos, y: origin.y))
                                fillPath.addLine(to: pt)
                            } else {
                                linePath.addLine(to: pt)
                                fillPath.addLine(to: pt)
                            }
                        }
                        
                        // Close the fill path
                        if let lastPt = points.last {
                            fillPath.addLine(to: CGPoint(x: lastPt.x, y: origin.y))
                            fillPath.closeSubpath()
                        }
                        
                        // A gradient from red (bad/low) → green (good/high)
                        let visibilityGradientLine = Gradient(stops: [
                            .init(color: .gray,  location: 0.0)
                        ])
                        
                        let visibilityGradient = Gradient(stops: [
                            .init(color: .gray.opacity(0.5),  location: 0.0),
                            .init(color: .clear, location: 1.0)
                        ])
                        
                        
                        // Fill area
                        context.drawLayer { layerContext in
                            layerContext.fill(
                                fillPath,
                                with: .linearGradient(
                                    visibilityGradient,
                                    startPoint: CGPoint(x: 0, y: size.height),
                                    endPoint:   CGPoint(x: 0, y: 0)
                                )
                            )
                        }
                        
                        // Stroke the line with the same gradient
                        context.drawLayer { layerContext in
                            let strokeStyle = StrokeStyle(lineWidth: 2.5, lineCap: .round, lineJoin: .round)
                            let stroked = linePath.strokedPath(strokeStyle)
                            layerContext.clip(to: stroked)
                            
                            layerContext.fill(
                                Path(CGRect(origin: .zero, size: size)),
                                with: .linearGradient(
                                    visibilityGradientLine,
                                    startPoint: CGPoint(x: 0, y: size.height),
                                    endPoint:   CGPoint(x: 0, y: 0)
                                )
                            )
                        }
                        
                        // Markers for min / max
                        if let maxVal = visData.max(),
                           let maxIdx = visData.firstIndex(of: maxVal),
                           points.indices.contains(maxIdx) {
                            let maxPoint = points[maxIdx]
                            drawHLMarker(
                                context: context,
                                label: NSLocalizedString("Visibility_MaxLabel", comment: "Label for maximum marker"),
                                at: maxPoint
                            )                        }
                        if let minVal = visData.min(),
                           let minIdx = visData.firstIndex(of: minVal),
                           points.indices.contains(minIdx) {
                            let minPoint = points[minIdx]
                            drawHLMarker(
                                context: context,
                                label: NSLocalizedString("Visibility_MinLabel", comment: "Label for minimum marker"),
                                at: minPoint
                            )                        }
                        
                        // Shade the “past” portion if it’s today
                        // shading & vertical line според точния момент (час+минути)
                        if customCalendar.isDate(now, inSameDayAs: selectedDate) {
                            // graphWidth/graphHeight вече са дефинирани:
                            //    let graphWidth  = effectiveWidth  - graphPadding * 2
                            //    let graphHeight = effectiveHeight - graphPadding * 2

                            // 1) Позиция по X
                            let currentXPos = origin.x + CGFloat(fractionOfDay) * graphWidth

                            // 2) Затъмняване до текущия момент
                            let darkRect = CGRect(
                                x: origin.x,
                                y: graphPadding,
                                width: currentXPos - origin.x,
                                height: graphHeight
                            )
                            context.fill(Path(darkRect), with: .color(.black.opacity(0.3)))

                            // 3) Вертикална линия през точния момент
                            var timeLine = Path()
                            timeLine.move(to: CGPoint(x: currentXPos, y: graphPadding))
                            timeLine.addLine(to: CGPoint(x: currentXPos, y: origin.y))
                            context.stroke(
                                timeLine,
                                with: .color(.white.opacity(0.7)),
                                style: StrokeStyle(lineWidth: 2)
                            )
                        }

                        
                        // Hour labels at the bottom
                        for hour in hourMarkers {
                            let xPos = origin.x + (CGFloat(hour) * (graphWidth / 24.0))
                            let labelPoint = CGPoint(x: xPos, y: origin.y + 14)
                            context.draw(
                                Text(String(format: "%02d", hour))
                                    .font(.system(size: 11))
                                    .foregroundColor(.gray),
                                at: labelPoint,
                                anchor: .center
                            )
                        }
                        
                        // Drag interpolation
                        // DRAG Gesture интерполация – показва видимостта в km и времето
                        if let dragPt = dragLocationVisibility {
                            if dragPt.x >= origin.x && dragPt.x <= origin.x + graphWidth {
                                let fractionIndex = (dragPt.x - origin.x) / xStep
                                let lowerIdx = max(0, min(points.count - 1, Int(floor(fractionIndex))))
                                let upperIdx = max(0, min(points.count - 1, lowerIdx + 1))
                                let t = (upperIdx == lowerIdx) ? 0 : (fractionIndex - CGFloat(lowerIdx))
                                
                                let lowerVal = visData[lowerIdx]
                                let upperVal = visData[upperIdx]
                                let interpolatedVis = lowerVal + (upperVal - lowerVal) * Double(t)
                                
                                var yVal = points[lowerIdx].y
                                if upperIdx != lowerIdx {
                                    yVal += t * (points[upperIdx].y - points[lowerIdx].y)
                                }
                                let dotPoint = CGPoint(x: dragPt.x, y: yVal)
                                
                                // Вертикална линия
                                var verticalLine = Path()
                                verticalLine.move(to: CGPoint(x: dotPoint.x, y: graphPadding))
                                verticalLine.addLine(to: CGPoint(x: dotPoint.x, y: origin.y))
                                context.stroke(verticalLine, with: .color(.white.opacity(0.5)), lineWidth: 1)
                                
                                // Начертай точка (dot)
                                let dotRect = CGRect(center: dotPoint, radius: 4)
                                context.fill(Path(ellipseIn: dotRect), with: .color(.white))
                                
                                // Интерполиране на времето
                                let timeLabelString: String
                                if lowerIdx < hourlyItemsForSelectedDate.count,
                                   upperIdx < hourlyItemsForSelectedDate.count {
                                    let lowerDate = hourlyItemsForSelectedDate[lowerIdx].date
                                    let upperDate = hourlyItemsForSelectedDate[upperIdx].date
                                    let totalInterval = upperDate.timeIntervalSince(lowerDate)
                                    let interpolatedDate = lowerDate.addingTimeInterval(totalInterval * Double(t))
                                    
                                    let dateFormatter = DateFormatter()
                                    dateFormatter.dateFormat = "HH:mm"
                                    dateFormatter.timeZone = WeatherKitViewModel.shared.locationTimeZone // или вашият custom timeZone
                                    timeLabelString = dateFormatter.string(from: interpolatedDate)
                                } else {
                                    timeLabelString = "--:--"
                                }
                                
                                let labelText = String(
                                    format: NSLocalizedString("Visibility_TooltipFormat", comment: "Tooltip showing time and visibility value, e.g. \"12:00\n5.3 km\""),
                                    timeLabelString,
                                    interpolatedVis,
                                    unit
                                )

                                let label = Text(labelText)
                                    .font(.system(size: 12, weight: .bold))
                                    .foregroundColor(.white)
                                
                                let labelOffset: CGFloat = 8
                                // Ако след 12-тия час, поставяме текста от ляво (anchor .trailing и отрицателно x-отместване)
                                let horizontalAnchor: UnitPoint = lowerIdx >= 12 ? .trailing : .leading
                                let horizontalOffset: CGFloat = lowerIdx >= 12 ? -labelOffset : labelOffset
                                
                                // Примерно задаваме anchor – може да комбинирате с вертикалното подравняване, ако желаете.
                                let combinedAnchor: UnitPoint = (horizontalAnchor == .leading) ? .bottomLeading : .bottomTrailing
                                
                                let textPoint = CGPoint(x: dotPoint.x + horizontalOffset, y: dotPoint.y - 20)
                                context.draw(label, at: textPoint, anchor: combinedAnchor)
                            }
                        }
                        
                    }
                    .gesture(
                        DragGesture(minimumDistance: 0)
                            .onChanged { value in
                                dragLocationVisibility = value.location
                            }
                            .onEnded { _ in
                                dragLocationVisibility = nil
                            }
                    )
                    .frame(height: (graphHeight + 20) * 1.5)
                    
                    Divider()
                        .background(Color.gray.opacity(0.4))
                        .padding(.horizontal, graphPadding / 2)
                        .padding(.top, 2)
                }
                .offset(y: -2)
            }
            
        }
    }
}
