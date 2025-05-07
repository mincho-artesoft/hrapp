import SwiftUI

extension WeatherDetailView {
    
    @ViewBuilder
    func precipAmauntDiagranmSection() -> some View {
        // 1) Подготвяме данните за всеки час (Rain и Snow)
        let hourlyData = hourlyItemsForSelectedDate  // ВАЖНО: уверете се, че hourlyItemsForSelectedDate съдържа точно 24 елемента (0..<24)
        let maxRain = hourlyData.map { $0.precipitationAmount }.max() ?? 0
        let maxSnow = hourlyData.map { $0.snowfallAmount }.max() ?? 0
        let maxPrecip = max(maxRain, maxSnow)
        
        // 2) Изчисляваме y-обхвата с буфер и минимален размах
        let rangeBuffer: Double = 2
        let minRangeSpan: Double = 10
        let computedMax = ceil(maxPrecip / 1) * 1 + rangeBuffer
        let suggestedMax = computedMax < minRangeSpan ? minRangeSpan : computedMax
        let yRange: (min: Double, max: Double) = (0, suggestedMax)
        
        // Прагове за "Light"/"Moderate"/"Heavy" (мм/ч)
        let thresholds: [Double] = [1.0, 4.0, 10.0]
        
        // fractionOfDay – за засенчване на изминатата част от днес
        let now = Date()
        let startOfSelectedDay = Calendar.current.startOfDay(for: selectedDate)
        let fractionOfDay = now.timeIntervalSince(startOfSelectedDay) / (24 * 3600)
        
        VStack(spacing: 0) {
            // -- HEADER (Общ текст) --
            VStack() {
                VStack(alignment: .leading, spacing: 5) {
                    // Изчисляваме общите валежи от данните за деня
                    let unit = GlobalState.precipitationUnitLabel
                    let totalRain = hourlyData.reduce(0) { $0 + $1.precipitationAmount }
                    let totalSnow = hourlyData.reduce(0) { $0 + $1.snowfallAmount }

                    if totalRain > 0 && totalSnow > 0 {
                        Text(String(
                            format: NSLocalizedString("Precip_Total_RainSnowFormat", comment: ""),
                            totalRain, unit,
                            totalSnow, unit
                        ))
                        .font(.system(size: 16, weight: .semibold))
                    }
                    else if totalRain > 0 {
                        Text(String(
                            format: NSLocalizedString("Precip_Total_RainFormat", comment: ""),
                            totalRain, unit
                        ))
                        .font(.system(size: 16, weight: .semibold))
                    }
                    else if totalSnow > 0 {
                        Text(String(
                            format: NSLocalizedString("Precip_Total_SnowFormat", comment: ""),
                            totalSnow, unit
                        ))
                        .font(.system(size: 16, weight: .semibold))
                    }
                    else {
                        Text(String(
                            format: NSLocalizedString("Precip_Total_None", comment: ""),
                            unit
                        ))
                        .font(.system(size: 16, weight: .semibold))
                    }

                    // подзаглавие
                    Text(String(
                        format: NSLocalizedString("Precip_Bars_Subtitle", comment: ""),
                        unit
                    ))
                    .font(.system(size: 13))
                    .foregroundColor(.gray)

                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal)
                .offset(x: -15)
                
                Spacer()
            }
            
            Group{
                // -- Засенчване за текущия ден --
                GeometryReader { geo in
                    ZStack(alignment: .leading) {
                        Color.clear
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
                .offset(y: 20)
                
                // -- Графиката (Canvas) с барове за валеж --
                Canvas { context, size in
                    guard hourlyData.count > 1,
                          size.width > graphPadding,
                          size.height > graphPadding * 2 else { return }
                    
                    let w = size.width
                    let h = size.height
                    let origin = CGPoint(x: graphPadding, y: h - graphPadding)
                    let contentWidth = w - graphPadding * 2
                    let contentHeight = h - graphPadding * 2
                    
                    // Новата xStep се изчислява спрямо броя на елементите
                    let xStep = contentWidth / CGFloat(hourlyData.count)
                    
                    func yPos(_ val: Double) -> CGFloat {
                        let ratio = val / (yRange.max - yRange.min)
                        return origin.y - CGFloat(ratio) * contentHeight
                    }
                    
                    // (A) Хоризонтални линии на всеки 2 мм/ч
                    let step: Double = 2
                    let regularMarkers = stride(from: 0.0, through: yRange.max, by: step)
                    for marker in regularMarkers {
                        let lineY = yPos(marker)
                        var path = Path()
                        path.move(to: CGPoint(x: origin.x, y: lineY))
                        path.addLine(to: CGPoint(x: origin.x + contentWidth, y: lineY))
                        context.stroke(
                            path,
                            with: .color(.gray.opacity(0.3)),
                            style: StrokeStyle(lineWidth: 0.5)
                        )
                        
                        let labelPt = CGPoint(x: origin.x + contentWidth + 15, y: lineY)
                        context.draw(
                            Text("\(Int(marker))")
                                .font(.system(size: 10))
                                .foregroundColor(.gray),
                            at: labelPt,
                            anchor: .center
                        )
                    }
                    
                    // (B) Чертаем специални линии за праговете Light/Moderate/Heavy
                    for threshold in thresholds {
                        guard threshold <= yRange.max else { continue }
                        let lineY = yPos(threshold)
                        var path = Path()
                        path.move(to: CGPoint(x: origin.x, y: lineY))
                        path.addLine(to: CGPoint(x: origin.x + contentWidth, y: lineY))
                        context.stroke(
                            path,
                            with: .color(.white.opacity(0.5)),
                            style: StrokeStyle(lineWidth: 1, dash: [4, 4])
                        )
                        
                        let label: String
                        switch threshold {
                        case 1.0:
                            label = NSLocalizedString("Precip_Level_Light", comment: "Light precipitation intensity")
                        case 4.0:
                            label = NSLocalizedString("Precip_Level_Moderate", comment: "Moderate precipitation intensity")
                        case 10.0:
                            label = NSLocalizedString("Precip_Level_Heavy", comment: "Heavy precipitation intensity")
                        default:
                            label = ""
                        }

                        let labelPt = CGPoint(x: origin.x, y: lineY)
                        context.draw(
                            Text(label)
                                .font(.system(size: 10, weight: .semibold))
                                .foregroundColor(.gray),
                            at: labelPt,
                            anchor: .topLeading
                        )
                    }
                    
                    // (C) Вертикални часови маркери на 0, 6, 12, 18, 24
                    let hourMarkers = [0, 6, 12, 18, 24]
                    for hour in hourMarkers {
                        let xPos = origin.x + (CGFloat(hour) * (contentWidth / 24))
                        var vLine = Path()
                        vLine.move(to: CGPoint(x: xPos, y: graphPadding))
                        vLine.addLine(to: CGPoint(x: xPos, y: origin.y))
                        context.stroke(
                            vLine,
                            with: .color(.gray.opacity(0.3)),
                            style: StrokeStyle(lineWidth: 0.5)
                        )
                    }
                    
                    // (D) Рисуваме баровете за всеки час (2 колони – Rain и Snow)
                    for (i, item) in hourlyData.enumerated() {
                        let groupXCenter = origin.x + xStep * (CGFloat(i) + 0.5)
                        
                        // Rain бар
                        let rainVal = item.precipitationAmount
                        if rainVal > 0 {
                            let barLeftX = groupXCenter - (xStep * 0.4)
                            let topY = yPos(rainVal)
                            let barHeight = max(0, origin.y - topY)
                            let barRect = CGRect(x: barLeftX, y: topY, width: xStep * 0.4, height: barHeight)
                            context.fill(Path(barRect), with: .color(.blue))
                        }
                        
                        // Snow бар
                        let snowVal = item.snowfallAmount
                        if snowVal > 0 {
                            let barRightX = groupXCenter + (xStep * 0.0)  // малко отместване за дясната колона
                            let topY = yPos(snowVal)
                            let barHeight = max(0, origin.y - topY)
                            let barRect = CGRect(x: barRightX, y: topY, width: xStep * 0.4, height: barHeight)
                            context.fill(Path(barRect), with: .color(.white))
                        }
                    }
                    
                    // (E) Засенчване на изминалите часове за днешния ден
                    if Calendar.current.isDate(now, inSameDayAs: selectedDate),
                       let currentHourIndex = hourlyItemsForSelectedDate.firstIndex(where: {
                           Calendar.current.isDate($0.date, equalTo: now, toGranularity: .hour)
                       }) {
                        let currentXPos = origin.x + CGFloat(currentHourIndex) * xStep + xStep / 2
                        var nowLine = Path()
                        nowLine.move(to: CGPoint(x: currentXPos, y: graphPadding))
                        nowLine.addLine(to: CGPoint(x: currentXPos, y: origin.y))
                        context.stroke(
                            nowLine,
                            with: .color(.white.opacity(0.8)),
                            style: StrokeStyle(lineWidth: 2)
                        )
                        
                        let darkRect = CGRect(
                            x: origin.x,
                            y: graphPadding,
                            width: currentXPos - origin.x,
                            height: contentHeight
                        )
                        context.fill(Path(darkRect), with: .color(.black.opacity(0.3)))
                    }
                    
                    // (F) Часови надписи в долната част
                    for hour in hourMarkers {
                        let xPos = origin.x + (CGFloat(hour) * (contentWidth / 24))
                        let textPoint = CGPoint(x: xPos, y: origin.y + 14)
                        context.draw(
                            Text(String(format: "%02d", hour))
                                .font(.system(size: 11))
                                .foregroundColor(.gray),
                            at: textPoint,
                            anchor: .center
                        )
                    }
                    
                    // (G) Drag Gesture – показва данни за съответния час
                    if let dragPoint = dragPrecipAmauntVisibility {
                        let localX = dragPoint.x - origin.x
                        if localX >= 0, localX < contentWidth {
                            let hourIndex = Int(floor(localX / xStep))
                            if hourIndex >= 0, hourIndex < hourlyData.count {
                                let item = hourlyData[hourIndex]
                                let highlightX = origin.x + xStep * (CGFloat(hourIndex) + 0.5)
                                
                                var highlightLine = Path()
                                highlightLine.move(to: CGPoint(x: highlightX, y: graphPadding))
                                highlightLine.addLine(to: CGPoint(x: highlightX, y: origin.y))
                                context.stroke(highlightLine, with: .color(.white.opacity(0.5)), lineWidth: 1)
                                
                                let dateFormatter = DateFormatter()
                                dateFormatter.dateFormat = "HH"
                                dateFormatter.timeZone = WeatherKitViewModel.shared.locationTimeZone // или вашият custom timeZone
                                let hourStr = dateFormatter.string(from: item.date)
                                let rVal = item.precipitationAmount
                                let sVal = item.snowfallAmount

                                let unit = GlobalState.precipitationUnitLabel
                                let labelText = String(
                                    format: NSLocalizedString("Precip_Tooltip_Format", comment: ""),
                                    hourStr,
                                    rVal, unit,
                                    sVal, unit
                                )

                                if hourIndex >= 12 {
                                    let tooltipPt = CGPoint(x: highlightX - 6, y: graphPadding + 15)
                                    context.draw(
                                        Text(labelText)
                                            .font(.system(size: 12, weight: .bold))
                                            .foregroundColor(.white),
                                        at: tooltipPt,
                                        anchor: .topTrailing
                                    )
                                } else {
                                    let tooltipPt = CGPoint(x: highlightX + 6, y: graphPadding + 15)
                                    context.draw(
                                        Text(labelText)
                                            .font(.system(size: 12, weight: .bold))
                                            .foregroundColor(.white),
                                        at: tooltipPt,
                                        anchor: .topLeading
                                    )
                                }
                            }
                        }
                    }
                }
                .frame(height: 250)
                .gesture(
                    DragGesture(minimumDistance: 0)
                        .onChanged { value in
                            dragPrecipAmauntVisibility = value.location
                        }
                        .onEnded { _ in
                            dragPrecipAmauntVisibility = nil
                        }
                )
                
                // Divider
                Divider()
                    .background(Color.gray.opacity(0.4))
                    .padding(.horizontal, graphPadding / 2)
                    .padding(.top, 2)
            }
            .offset(y: -30)
        }
        .padding(.bottom, 8)
    }
}
