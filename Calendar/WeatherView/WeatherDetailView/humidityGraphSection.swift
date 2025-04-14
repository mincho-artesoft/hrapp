import SwiftUI

extension WeatherDetailView {
    
    @ViewBuilder
    func humidityGraphSection() -> some View {
        // Използваме само първите 24 часа, за да гарантираме 4 интервала
        let dayHourlyItems = Array(hourlyItemsForSelectedDate.prefix(24))
        let humidityData = dayHourlyItems.map { $0.humidity }

        // 2) Намираме съответния DayForecastItem за да получим минимална/максимална влажност за деня
        let dayItem = allDailyItems.first {
            Calendar.current.isDate($0.date, inSameDayAs: selectedDate)
        }
        let dailyMinH = dayItem?.humidityMin ?? 0
        let dailyMaxH = dayItem?.humidityMax ?? 1

        // 3) Разделяме 24-те часа на блокове от по 6 часа
        let hoursCount = dayHourlyItems.count
        let chunkSize  = 6
        
        // Създаваме масив от (start, end) за всеки 6-часов интервал
        let chunkRanges: [(start: Int, end: Int)] = stride(from: 0, to: hoursCount, by: chunkSize)
            .map { startIndex in
                let endIndex = min(startIndex + chunkSize, hoursCount)
                return (start: startIndex, end: endIndex)
            }

        // Общият VStack за секцията влажност
        VStack(spacing: 8) {
            // Хедър с текуща или средна влажност
            let now = Date()
            let averageHumidity = humidityData.reduce(0, +) / Double(humidityData.count)
            let startOfSelectedDay = Calendar.current.startOfDay(for: selectedDate)
            let fractionOfDay = now.timeIntervalSince(startOfSelectedDay) / (24 * 3600)

            VStack(alignment: .leading, spacing: 5) {
                if Calendar.current.isDate(selectedDate, inSameDayAs: now) {
                    if let currentHumidity = vm.currentHumidity {
                        Text("Humidity \(Int(currentHumidity * 100))%")
                            .font(.system(size: 16, weight: .semibold))
                    } else {
                        Text("Humidity")
                            .font(.system(size: 16, weight: .semibold))
                    }
                } else {
                    Text("Humidity Avg \(Int(averageHumidity * 100))%")
                        .font(.system(size: 16, weight: .semibold))
                }
                Text("Today's min \(Int(dailyMinH * 100))% – max \(Int(dailyMaxH * 100))%")
                    .font(.system(size: 13))
                    .foregroundColor(.gray)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.horizontal)
            .offset(x: -15, y: -5)
            Spacer()

            Group{
                // MARK: - Ред със средните стойности на всеки 6 часа
                GeometryReader { geo in
                    ZStack(alignment: .leading) {
                        HStack(spacing: 0) {
                            ForEach(chunkRanges.indices, id: \.self) { i in
                                let (startIndex, endIndex) = chunkRanges[i]
                                let block = dayHourlyItems[startIndex..<endIndex]
                                let avgHum = block.map { $0.humidity }.reduce(0, +) / Double(block.count)
                                let avgPct = Int(round(avgHum * 100))
                                
                                Text("\(avgPct)%")
                                    .font(.system(size: 12, weight: .bold))
                                    .frame(maxWidth: .infinity)
                            }
                        }
                        
                        // Ако е днес, засенчваме частта на деня, която е минала
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
                
                // MARK: - Canvas базиран график
                Canvas { context, size in
                    guard humidityData.count > 1,
                          size.width > graphPadding,
                          size.height > graphPadding * 2 else { return }
                    
                    let width = size.width
                    let height = size.height
                    let origin = CGPoint(x: graphPadding, y: height - graphPadding)
                    let chartWidth = width - graphPadding * 2
                    let chartHeight = height - graphPadding * 2
                    
                    func yPosition(_ h: Double) -> CGFloat {
                        let ratio = (h - 0.0) / 1.0
                        return origin.y - CGFloat(ratio) * chartHeight
                    }
                    
                    // Горизонтални линии и марки
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
                                .font(.system(size: 8))
                                .foregroundColor(.gray),
                            at: labelPt,
                            anchor: .center
                        )
                    }
                    
                    let hourMarkers = [0, 6, 12, 18, 24]
                    for hour in hourMarkers {
                        let xPos = origin.x + (CGFloat(hour) * (chartWidth / 24.0))
                        var vLine = Path()
                        vLine.move(to: CGPoint(x: xPos, y: graphPadding))
                        vLine.addLine(to: CGPoint(x: xPos, y: origin.y))
                        context.stroke(vLine, with: .color(.gray.opacity(0.3)), style: StrokeStyle(lineWidth: 0.5))
                    }
                    
                    var linePath = Path()
                    var fillPath = Path()
                    var points: [CGPoint] = []
                    
                    let xStep = chartWidth / CGFloat(max(1, humidityData.count - 1))
                    for (index, humVal) in humidityData.enumerated() {
                        let xPos = origin.x + CGFloat(index) * xStep
                        let yPos = yPosition(humVal)
                        let pt = CGPoint(x: xPos, y: yPos)
                        
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
                    if let lastPt = points.last {
                        fillPath.addLine(to: CGPoint(x: lastPt.x, y: origin.y))
                        fillPath.closeSubpath()
                    }
                    
                    let humidityGradientLine = Gradient(stops: [
                        .init(color: .yellow, location: 0.0),
                        .init(color: .blue, location: 1.0)
                    ])
                    
                    let humidityGradient = Gradient(stops: [
                        .init(color: .yellow.opacity(0.5), location: 0.0),
                        .init(color: .blue.opacity(0.5),   location: 1.0)
                    ])
                    context.drawLayer { layerContext in
                        layerContext.fill(
                            fillPath,
                            with: .linearGradient(
                                humidityGradient,
                                startPoint: CGPoint(x: 0, y: size.height),
                                endPoint: CGPoint(x: 0, y: 0)
                            )
                        )
                    }
                    
                    context.drawLayer { layerContext in
                        let strokeStyle = StrokeStyle(lineWidth: 2.5, lineCap: .round, lineJoin: .round)
                        let strokedPath = linePath.strokedPath(strokeStyle)
                        layerContext.clip(to: strokedPath)
                        layerContext.fill(
                            Path(CGRect(origin: .zero, size: size)),
                            with: .linearGradient(
                                humidityGradientLine,
                                startPoint: CGPoint(x: 0, y: size.height),
                                endPoint: CGPoint(x: 0, y: 0)
                            )
                        )
                    }
                    
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
                    
                    // Ако е днес, засенчваме частта, която е минала
                    if Calendar.current.isDate(now, inSameDayAs: selectedDate),
                       let currentHourIndex = dayHourlyItems.firstIndex(where: {
                           Calendar.current.isDate($0.date, equalTo: now, toGranularity: .hour)
                       }) {
                        let currentXPos = origin.x + CGFloat(currentHourIndex) * xStep
                        var verticalLine = Path()
                        verticalLine.move(to: CGPoint(x: currentXPos, y: graphPadding))
                        verticalLine.addLine(to: CGPoint(x: currentXPos, y: origin.y))
                        context.stroke(verticalLine, with: .color(.white.opacity(0.7)), style: StrokeStyle(lineWidth: 2))
                        
                        let darkRect = CGRect(
                            x: origin.x,
                            y: graphPadding,
                            width: currentXPos - origin.x,
                            height: chartHeight
                        )
                        context.fill(Path(darkRect), with: .color(.black.opacity(0.3)))
                    }
                    
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
                    
                    // DRAG Gesture интерполация – показва влажност % и време
                    if let dragPoint = dragLocationHumidity {
                        if dragPoint.x >= origin.x && dragPoint.x <= origin.x + chartWidth {
                            let fractionIndex = (dragPoint.x - origin.x) / xStep
                            let lowerIndex = max(0, min(points.count - 1, Int(floor(fractionIndex))))
                            let upperIndex = max(0, min(points.count - 1, lowerIndex + 1))
                            let t = (upperIndex == lowerIndex) ? 0 : (fractionIndex - CGFloat(lowerIndex))
                            
                            let lowerValue = humidityData[lowerIndex]
                            let upperValue = humidityData[upperIndex]
                            let hVal = lowerValue + (upperValue - lowerValue) * Double(t)
                            
                            var hY = points[lowerIndex].y
                            if upperIndex != lowerIndex {
                                hY += t * (points[upperIndex].y - points[lowerIndex].y)
                            }
                            let dotPoint = CGPoint(x: dragPoint.x, y: hY)
                            
                            var vLine = Path()
                            vLine.move(to: CGPoint(x: dotPoint.x, y: graphPadding))
                            vLine.addLine(to: CGPoint(x: dotPoint.x, y: origin.y))
                            context.stroke(vLine, with: .color(.white.opacity(0.5)), lineWidth: 1)
                            
                            let dotRect = CGRect(center: dotPoint, radius: 4)
                            context.fill(Path(ellipseIn: dotRect), with: .color(.white))
                            
                            let timeLabel: String
                            if lowerIndex < dayHourlyItems.count,
                               upperIndex < dayHourlyItems.count {
                                let d1 = dayHourlyItems[lowerIndex].date
                                let d2 = dayHourlyItems[upperIndex].date
                                let totalInterval = d2.timeIntervalSince(d1)
                                let interpolatedDate = d1.addingTimeInterval(totalInterval * Double(t))
                                let dateFormatter = DateFormatter()
                                dateFormatter.dateFormat = "HH:mm"
                                dateFormatter.timeZone = WeatherKitViewModel.shared.locationTimeZone // или вашият custom timeZone

                                timeLabel = dateFormatter.string(from: interpolatedDate)
                            } else {
                                timeLabel = "--:--"
                            }
                            
                            let labelText = "\(timeLabel)\n\(Int(round(hVal * 100)))%"
                            let label = Text(labelText)
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(.white)
                            
                            let labelOffset: CGFloat = 8
                            let horizontalAnchor: UnitPoint = lowerIndex >= 12 ? .trailing : .leading
                            let horizontalOffset: CGFloat = lowerIndex >= 12 ? -labelOffset : labelOffset
                            let verticalAnchor: UnitPoint = hVal > 0.5 ? .top : .bottom
                            let verticalOffset: CGFloat = hVal > 0.5 ? labelOffset : -20
                            
                            let combinedAnchor: UnitPoint = {
                                if horizontalAnchor == .leading && verticalAnchor == .bottom {
                                    return .bottomLeading
                                } else if horizontalAnchor == .trailing && verticalAnchor == .bottom {
                                    return .bottomTrailing
                                } else if horizontalAnchor == .leading && verticalAnchor == .top {
                                    return .topLeading
                                } else {
                                    return .topTrailing
                                }
                            }()
                            
                            let textPoint = CGPoint(x: dotPoint.x + horizontalOffset, y: dotPoint.y + verticalOffset)
                            context.draw(label, at: textPoint, anchor: combinedAnchor)
                        }
                    }
                }
                .gesture(
                    DragGesture(minimumDistance: 0)
                        .onChanged { value in
                            dragLocationHumidity = value.location
                        }
                        .onEnded { _ in
                            dragLocationHumidity = nil
                        }
                )
                .frame(height: (graphHeight + 20) * 1.5)
                
                Divider()
                    .background(Color.gray.opacity(0.4))
                    .padding(.horizontal, graphPadding / 2)
                    .padding(.top, 2)
                    .offset(y: -5)
            }
            .offset(y: -40)
        }
        .padding(.top, 5)
    }
}
