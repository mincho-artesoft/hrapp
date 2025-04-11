import SwiftUI

extension WeatherDetailView{
    
    @ViewBuilder
    func precipAmauntDiagranmSection() -> some View {
        // 1) Подготвяме нужните данни за всеки час (RAIN + SNOW)
        let hourlyData = hourlyItemsForSelectedDate
        let maxRain = hourlyData.map { $0.precipitationAmount }.max() ?? 0
        let maxSnow = hourlyData.map { $0.snowfallAmount }.max() ?? 0
        let maxPrecip = max(maxRain, maxSnow)
        
        // 2) Задаваме горна граница (yRange.max) с буфер, гарантираме и минимален обхват
        let rangeBuffer: Double = 2
        let minRangeSpan: Double = 10
        
        let computedMax = ceil(maxPrecip / 1) * 1 + rangeBuffer
        let suggestedMax = computedMax < minRangeSpan ? minRangeSpan : computedMax

        let yRange: (min: Double, max: Double) = (0, suggestedMax)
        
        // Примерни прагове за light / moderate / heavy (mm/h)
        let thresholds: [Double] = [1.0, 4.0, 10.0]
        
        // fractionOfDay – за shading при текущия ден
        let now = Date()
        let startOfSelectedDay = Calendar.current.startOfDay(for: selectedDate)
        let fractionOfDay = now.timeIntervalSince(startOfSelectedDay) / (24 * 3600)
        
        // 3) Връщаме изглед (View)
        VStack(spacing: 0) {
            
            // Заглавие и кратък описателен текст
            VStack() {
                VStack(alignment: .leading, spacing: 5) {
                    Text("Precipitation Amount")
                        .font(.system(size: 16, weight: .semibold))
                    Text("Hourly bars for rain & snow (mm/h).")
                        .font(.system(size: 13))
                        .foregroundColor(.gray)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal)
                .offset(x: -10)
                
                Spacer()
               
            }
           
            // (По желание) горен ред за средни стойности на всеки 2 часа, тук само празно:
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    Color.clear
                    
                    // Ако е днешен ден, частично засенчваме изминалата част
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
            
            
            // Основната графика (Canvas) – барове за Rain и Snow
            Canvas { context, size in
                guard hourlyData.count > 1,
                      size.width > graphPadding,
                      size.height > graphPadding * 2
                else { return }
                
                let w = size.width
                let h = size.height
                let origin = CGPoint(x: graphPadding, y: h - graphPadding)
                let contentWidth  = w - graphPadding * 2
                let contentHeight = h - graphPadding * 2
                
                func yPos(_ val: Double) -> CGFloat {
                    // По-голяма стойност -> по-нагоре
                    let ratio = val / (yRange.max - yRange.min)
                    return origin.y - CGFloat(ratio) * contentHeight
                }
                
                // (A) Рисуваме хоризонталните линии през 2 mm/h
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
                    
                    // Надпис вдясно
                    let labelPt = CGPoint(x: origin.x + contentWidth + 15, y: lineY)
                    context.draw(
                        Text("\(Int(marker))")
                            .font(.system(size: 10))
                            .foregroundColor(.gray),
                        at: labelPt,
                        anchor: .center
                    )
                }
                
                // (B) Специални threshold линии (Light/Moderate/Heavy)
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
                    
                    // Малък надпис
                    let label: String
                    switch threshold {
                    case 1.0:  label = "Light"
                    case 4.0:  label = "Moderate"
                    case 10.0: label = "Heavy"
                    default:   label = ""
                    }
                    let labelPt = CGPoint(x: origin.x , y: lineY)
                    context.draw(
                        Text(label)
                            .font(.system(size: 10, weight: .semibold))
                            .foregroundColor(.gray),
                        at: labelPt,
                        anchor: .topLeading
                    )
                }
                
                // (C) Вертикални часови маркери (0,6,12,18,24)
                let hourMarkers = [0,6,12,18,24]
                for hour in hourMarkers {
                    let xPos = origin.x + (CGFloat(hour) * (contentWidth / 24.0))
                    var vLine = Path()
                    vLine.move(to: CGPoint(x: xPos, y: graphPadding))
                    vLine.addLine(to: CGPoint(x: xPos, y: origin.y))
                    context.stroke(
                        vLine,
                        with: .color(.gray.opacity(0.3)),
                        style: StrokeStyle(lineWidth: 0.5)
                    )
                }
                
                // (D) Барове за всеки час (2 колони: Rain / Snow)
                let xStep = contentWidth / 24
                let barWidth = xStep / 2.5
                
                for (i, item) in hourlyData.enumerated() {
                    let groupXCenter = origin.x + xStep * (CGFloat(i) + 0.5)
                    
                    // Rain бар
                    let rainVal = item.precipitationAmount
                    if rainVal > 0 {
                        let barLeftX  = groupXCenter - barWidth * 1.05
                        let topY      = yPos(rainVal)
                        let barHeight = max(0, origin.y - topY)
                        let barRect   = CGRect(x: barLeftX, y: topY, width: barWidth, height: barHeight)
                        context.fill(Path(barRect), with: .color(.blue))
                    }
                    
                    // Snow бар
                    let snowVal = item.snowfallAmount
                    if snowVal > 0 {
                        let barRightX = groupXCenter + (barWidth * 0.05)
                        let topY      = yPos(snowVal)
                        let barHeight = max(0, origin.y - topY)
                        let barRect   = CGRect(x: barRightX, y: topY, width: barWidth, height: barHeight)
                        context.fill(Path(barRect), with: .color(.white))
                    }
                }
                
                // (E) Засенчване на изминали часове, ако е днес
                if Calendar.current.isDate(now, inSameDayAs: selectedDate),
                   let currentHourIndex = hourlyItemsForSelectedDate.firstIndex(where: {
                       Calendar.current.isDate($0.date, equalTo: now, toGranularity: .hour)
                   }) {
                    
                    let currentXPos = origin.x + CGFloat(currentHourIndex) * xStep
                    // Вертикална линия за "сега"
                    var nowLine = Path()
                    nowLine.move(to: CGPoint(x: currentXPos, y: graphPadding))
                    nowLine.addLine(to: CGPoint(x: currentXPos, y: origin.y))
                    context.stroke(
                        nowLine,
                        with: .color(.white.opacity(0.8)),
                        style: StrokeStyle(lineWidth: 2)
                    )
                    
                    // Тъмно shading
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
                    let xPos = origin.x + (CGFloat(hour) * (contentWidth / 24.0))
                    let textPoint = CGPoint(x: xPos, y: origin.y + 14)
                    context.draw(
                        Text(String(format: "%02d", hour))
                            .font(.system(size: 11))
                            .foregroundColor(.gray),
                        at: textPoint,
                        anchor: .center
                    )
                }
                
                // (G) Drag Gesture – показва Rain / Snow за съответния час
                if let dragPoint = dragPrecipAmauntVisibility {
                    let localX = dragPoint.x - origin.x
                    if localX >= 0, localX < contentWidth {
                        let hourIndex = Int(floor(localX / xStep))
                        if hourIndex >= 0, hourIndex < hourlyData.count {
                            let item = hourlyData[hourIndex]
                            
                            let highlightX = origin.x + (CGFloat(hourIndex) + 0.5) * xStep
                            // Вертикална подсказваща линия
                            var highlightLine = Path()
                            highlightLine.move(to: CGPoint(x: highlightX, y: graphPadding))
                            highlightLine.addLine(to: CGPoint(x: highlightX, y: origin.y))
                            context.stroke(highlightLine, with: .color(.white.opacity(0.5)), lineWidth: 1)
                            
                            // Tooltip
                            let df = DateFormatter()
                            df.dateFormat = "HH"
                            let hourStr = df.string(from: item.date)
                            let rVal = item.precipitationAmount
                            let sVal = item.snowfallAmount
                            let labelText = """
                                \(hourStr)h
                                Rain: \(String(format: "%.1f", rVal)) mm/h
                                Snow: \(String(format: "%.1f", sVal)) mm/h
                                """
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
            
            
            VStack(alignment: .leading, spacing: 4) {
                Text("Bars show hourly Rain (blue) and Snow (white).")
                Text("Light <1 mm/h, moderate up to ~4 mm/h, heavy above 10 mm/h.")
            }
            .font(.caption)
            .foregroundColor(.secondary)
            .offset(y: 20)
            
        }
        .padding(.bottom, 8)
        // (H) Някакъв финален описателен текст
       
    }
    
}
