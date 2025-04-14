import SwiftUI

extension WeatherDetailView{
    
    @ViewBuilder
    func pressureGraphSection() -> some View {
        // 1) Извличаме почасовите стойности (hPa) за избрания ден
        let pressureValues = hourlyItemsForSelectedDate.map { $0.pressure }

        // 2) Ако няма данни, показваме fallback
        if pressureValues.isEmpty {
            VStack(alignment: .leading, spacing: 8) {
                Text("Pressure")
                    .font(.system(size: 16, weight: .semibold))
                Text("No pressure data available for this day.")
                    .font(.footnote)
                    .foregroundColor(.gray)
            }
            .padding(.bottom, 8)

        } else {
            // 3) Изчисляваме препоръчителен мин/макс (с буфер)
            let (suggestedMin, suggestedMax) = calculatePressureRange(from: pressureValues)

            // Реален min/max (без буфер), ако искаме да ги показваме в текста
            let realMin = Int(round(pressureValues.min() ?? 1000))
            let realMax = Int(round(pressureValues.max() ?? 1020))

            // 4) fractionOfDay => колко част от деня е минала (за shading, ако е днес)
            let now = Date()
            let startOfSelectedDay = Calendar.current.startOfDay(for: selectedDate)
            let fractionOfDay = now.timeIntervalSince(startOfSelectedDay) / (24 * 3600)

            VStack(spacing: 0) {
                VStack {
                     // MARK: Заглавна част
                     VStack(alignment: .leading, spacing: 5) {
                         if Calendar.current.isDate(selectedDate, inSameDayAs: Date()) {
                             // Ако е текущия ден – показваме текущата стойност
                             if let currentPressure = vm.currentPressure {
                                 Text("Pressure \(Int(round(currentPressure))) hPa")
                                     .font(.system(size: 16, weight: .semibold))
                             } else {
                                 Text("Pressure: --")
                                     .font(.system(size: 16, weight: .semibold))
                             }
                             Text("Today's min \(realMin) hPa – max \(realMax) hPa")
                                 .font(.system(size: 13))
                                 .foregroundColor(.gray)
                         } else {
                             // Изчисляваме средната стойност от почасовите данни
                             let avgPressure = pressureValues.reduce(0, +) / Double(pressureValues.count)
                             Text("Pressure Average \(Int(round(avgPressure))) hPa")
                                 .font(.system(size: 16, weight: .semibold))
                             Text("Daily range: \(realMin)–\(realMax) hPa")
                                 .font(.system(size: 13))
                                 .foregroundColor(.gray)
                         }
                     }
                     .frame(maxWidth: .infinity, alignment: .leading)
                     .padding(.horizontal)
                     .offset(x: -14)
                     Spacer()
                 }
               
                Group{
                    // MARK: Ред с иконки (arrow.up / arrow.down / equal) – на всеки 2 часа
                    GeometryReader { geo in
                        ZStack(alignment: .leading) {
                            HStack(spacing: 0) {
                                // Взимаме всички почасови елементи, но само през 2 часа
                                let twoHourPressures = hourlyItemsForSelectedDate
                                    .enumerated()
                                    .filter { $0.offset % 2 == 0 } // взимаме на всеки 2 часа
                                
                                if twoHourPressures.isEmpty {
                                    Text("No hourly data available for this day.")
                                        .font(.caption)
                                        .foregroundColor(.gray)
                                        .frame(maxWidth: .infinity, alignment: .center)
                                        .padding(.vertical)
                                } else {
                                    ForEach(twoHourPressures, id: \.element.id) { (originalIndex, item) in
                                        
                                        // (A) Локален closure, който изчислява какво да бъде името на иконата.
                                        let iconName: String = {
                                            if originalIndex >= 2 {
                                                let prevItem = hourlyItemsForSelectedDate[originalIndex - 2]
                                                let diff = item.pressure - prevItem.pressure
                                                
                                                if diff > 0.2 {
                                                    return "arrowshape.up.fill"
                                                } else if diff < -0.2 {
                                                    return "arrowshape.down.fill"
                                                } else {
                                                    return "equal"
                                                }
                                            } else {
                                                return "equal"
                                            }
                                        }()
                                        
                                        // (B) Вече чертаем Image
                                        Image(systemName: iconName)
                                            .font(.system(size: 13))
                                            .frame(maxWidth: .infinity)
                                    }
                                    
                                }
                            }
                            
                            // Частично засенчваме миналите часове, ако избраният ден е "днес"
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
                    .offset(y: 20)  // може да коригирате offset според визията си
                    
                    
                    // MARK: - Основна графика (Canvas)
                    Canvas { context, size in
                        guard pressureValues.count > 1,
                              size.width > graphPadding,
                              size.height > graphPadding * 2
                        else { return }
                        
                        let w = size.width
                        let h = size.height
                        let origin = CGPoint(x: graphPadding, y: h - graphPadding)
                        let contentWidth  = w - graphPadding * 2
                        let contentHeight = h - graphPadding * 2
                        
                        func yPosition(_ val: Double) -> CGFloat {
                            let range = suggestedMax - suggestedMin
                            let ratio = (val - suggestedMin) / range
                            return origin.y - CGFloat(ratio) * contentHeight
                        }
                        
                        // Хоризонтални линии (примерно през 5 hPa)
                        let step: Double = 5
                        let horizontalMarkers = stride(from: suggestedMin,
                                                       through: suggestedMax,
                                                       by: step)
                        for marker in horizontalMarkers {
                            let yPos = yPosition(marker)
                            var hLine = Path()
                            hLine.move(to: CGPoint(x: origin.x, y: yPos))
                            hLine.addLine(to: CGPoint(x: origin.x + contentWidth, y: yPos))
                            context.stroke(
                                hLine,
                                with: .color(.gray.opacity(0.3)),
                                style: StrokeStyle(lineWidth: 0.5)
                            )
                            
                            // Надпис вдясно
                            let labelPt = CGPoint(x: origin.x + contentWidth + 15, y: yPos)
                            context.draw(
                                Text("\(Int(marker))")
                                    .font(.system(size: 8)) // може да нагласите размера
                                    .foregroundColor(.gray),
                                at: labelPt,
                                anchor: .center
                            )
                        }
                        
                        // Вертикални линии за часовете (0, 6, 12, 18, 24)
                        let hourMarkers = [0, 6, 12, 18, 24]
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
                        
                        // Линия + fillPath
                        var linePath = Path()
                        var fillPath = Path()
                        var points: [CGPoint] = []
                        
                        let xStep = contentWidth / CGFloat(max(1, pressureValues.count - 1))
                        
                        for (i, val) in pressureValues.enumerated() {
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
                        // Затваряме fillPath надолу
                        if let lastPt = points.last {
                            fillPath.addLine(to: CGPoint(x: lastPt.x, y: origin.y))
                            fillPath.closeSubpath()
                        }
                        
                        let pressureGradientLine = Gradient(stops: [
                            .init(color: .blue, location: 0),
                            .init(color: .red,  location: 1)
                        ])
                        
                        // Градиент (пример: синьо -> червено)
                        let pressureGradient = Gradient(stops: [
                            .init(color: .blue.opacity(0.5), location: 0),
                            .init(color: .red.opacity(0.5),  location: 1)
                        ])
                        
                        // Запълване под линията
                        context.drawLayer { layerContext in
                            layerContext.fill(
                                fillPath,
                                with: .linearGradient(
                                    pressureGradient,
                                    startPoint: CGPoint(x: 0, y: size.height),
                                    endPoint:   CGPoint(x: 0, y: 0)
                                )
                            )
                        }
                        
                        // Линията (stroke) с градиент
                        context.drawLayer { layerContext in
                            let strokeStyle = StrokeStyle(lineWidth: 2.5, lineCap: .round, lineJoin: .round)
                            let stroked     = linePath.strokedPath(strokeStyle)
                            layerContext.clip(to: stroked)
                            
                            layerContext.fill(
                                Path(CGRect(origin: .zero, size: size)),
                                with: .linearGradient(
                                    pressureGradientLine,
                                    startPoint: CGPoint(x: 0, y: size.height),
                                    endPoint:   CGPoint(x: 0, y: 0)
                                )
                            )
                        }
                        
                        // Маркери Min / Max (по желание)
                        if let maxVal = pressureValues.max(),
                           let maxIndex = pressureValues.firstIndex(of: maxVal),
                           points.indices.contains(maxIndex) {
                            let highPoint = points[maxIndex]
                            drawHLMarker(context: context, label: "Max", at: highPoint)
                        }
                        if let minVal = pressureValues.min(),
                           let minIndex = pressureValues.firstIndex(of: minVal),
                           points.indices.contains(minIndex) {
                            let lowPoint = points[minIndex]
                            drawHLMarker(context: context, label: "Min", at: lowPoint)
                        }
                        
                        // Затъмняваме “миналите” часове, ако денят е текущ
                        if Calendar.current.isDate(now, inSameDayAs: selectedDate),
                           let currentHourIndex = hourlyItemsForSelectedDate.firstIndex(where: {
                               Calendar.current.isDate($0.date, equalTo: now, toGranularity: .hour)
                           }) {
                            let currentXPos = origin.x + CGFloat(currentHourIndex) * xStep
                            
                            // Вертикална линия за текущия час
                            var verticalLine = Path()
                            verticalLine.move(to: CGPoint(x: currentXPos, y: graphPadding))
                            verticalLine.addLine(to: CGPoint(x: currentXPos, y: origin.y))
                            context.stroke(
                                verticalLine,
                                with: .color(.white.opacity(0.8)),
                                style: StrokeStyle(lineWidth: 2)
                            )
                            
                            // Правоъгълник за shading
                            let darkRect = CGRect(
                                x: origin.x,
                                y: graphPadding,
                                width: currentXPos - origin.x,
                                height: contentHeight
                            )
                            context.fill(Path(darkRect), with: .color(.black.opacity(0.3)))
                        }
                        
                        // Часови надписи долу
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
                        
                        // MARK: - Drag интерполация (показва налягане + точен час)
                        if let dragPoint = dragPressureVisibility {
                            if dragPoint.x >= origin.x && dragPoint.x <= origin.x + contentWidth {
                                let fractionIndex = (dragPoint.x - origin.x) / xStep
                                let lowerIdx = max(0, min(points.count - 1, Int(floor(fractionIndex))))
                                let upperIdx = max(0, min(points.count - 1, lowerIdx + 1))
                                let t = (upperIdx == lowerIdx) ? 0 : (fractionIndex - CGFloat(lowerIdx))
                                
                                let pLower = pressureValues[lowerIdx]
                                let pUpper = pressureValues[upperIdx]
                                let pVal = pLower + (pUpper - pLower) * Double(t)
                                
                                var interpolatedY = points[lowerIdx].y
                                if upperIdx != lowerIdx {
                                    interpolatedY += t * (points[upperIdx].y - points[lowerIdx].y)
                                }
                                let dotPoint = CGPoint(x: dragPoint.x, y: interpolatedY)
                                
                                // Вертикална линия
                                var vLine = Path()
                                vLine.move(to: CGPoint(x: dotPoint.x, y: graphPadding))
                                vLine.addLine(to: CGPoint(x: dotPoint.x, y: origin.y))
                                context.stroke(vLine, with: .color(.white.opacity(0.5)), lineWidth: 1)
                                
                                // Малка точка (dot)
                                let dotRect = CGRect(center: dotPoint, radius: 4)
                                context.fill(Path(ellipseIn: dotRect), with: .color(.white))
                                
                                // Интерполация на времето (за часовете и минутите)
                                let timeString: String
                                if lowerIdx < hourlyItemsForSelectedDate.count,
                                   upperIdx < hourlyItemsForSelectedDate.count {
                                    let d1 = hourlyItemsForSelectedDate[lowerIdx].date
                                    let d2 = hourlyItemsForSelectedDate[upperIdx].date
                                    let totalInterval = d2.timeIntervalSince(d1)
                                    let interpolatedDate = d1.addingTimeInterval(totalInterval * Double(t))
                                    
                                    let dateFormatter = DateFormatter()
                                    dateFormatter.dateFormat = "HH:mm"
                                    dateFormatter.timeZone = WeatherKitViewModel.shared.locationTimeZone // или вашият custom timeZone
                                    timeString = dateFormatter.string(from: interpolatedDate)
                                } else {
                                    timeString = "--:--"
                                }
                                
                                let labelText = "\(timeString)\n\(Int(round(pVal))) hPa"
                                let label = Text(labelText)
                                    .font(.system(size: 12, weight: .bold))
                                    .foregroundColor(.white)
                                
                                let labelOffset: CGFloat = 8
                                // Ако lowerIdx е >= 12 (след 12-тия час), текстът да се показва от ляво:
                                let horizontalAnchor: UnitPoint = lowerIdx >= 12 ? .trailing : .leading
                                let horizontalOffset: CGFloat = lowerIdx >= 12 ? -labelOffset : labelOffset
                                
                                // Създаваме комбиниран anchor за по-лесно задаване
                                let combinedAnchor: UnitPoint = horizontalAnchor == .leading ? .bottomLeading : .bottomTrailing
                                
                                let textPoint = CGPoint(x: dotPoint.x + horizontalOffset, y: dotPoint.y - 20)
                                context.draw(label, at: textPoint, anchor: combinedAnchor)
                            }
                        }
                    }
                    .frame(height: 240)
                    .gesture(
                        DragGesture(minimumDistance: 0)
                            .onChanged { value in
                                dragPressureVisibility = value.location
                            }
                            .onEnded { _ in
                                dragPressureVisibility = nil
                            }
                    )
                    
                    // Divider
                    Divider()
                        .background(Color.gray.opacity(0.4))
                        .padding(.horizontal, graphPadding / 2)
                        .padding(.top, 2)
                }
                .offset(y: -5)

            }
            .padding(.bottom, 8)
        }
    }
    
}
