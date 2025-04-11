import SwiftUI

extension WeatherDetailView{
    
    @ViewBuilder
    func uVGraphSection() -> some View {
        let now = Date()
        let startOfSelectedDay = Calendar.current.startOfDay(for: selectedDate)
        let secondsFromMidnight = now.timeIntervalSince(startOfSelectedDay)
        let fractionOfDay = secondsFromMidnight / (24 * 3600)
        // 1) Извличане на UV данните за избрания ден (24 часа)
        let uvData = hourlyItemsForSelectedDate.map { $0.uvIndex }
        
        // 2) Фиксиран мащаб от 0 до 12
        let yRange: (min: Double, max: Double) = (0, 12)
        
        // 3) Часови маркери – обикновено на всеки 6 часа
        let hourMarkers = [0, 6, 12, 18, 24]
        
        // 4) Определяне на дневния максимален UV от дневната прогноза
        let dayItem = allDailyItems.first {
            Calendar.current.isDate($0.date, inSameDayAs: selectedDate)
        }
        let dailyMaxUV = dayItem?.maxUV ?? 0
        
    
        
        VStack(spacing: 8) {
            Group {
                  // Заглавната част
                  VStack(alignment: .leading, spacing: 5) {
                      Text("Today's \(uvCategory(for: dailyMaxUV)) \(dailyMaxUV)")
                          .font(.system(size: 16, weight: .semibold))
                  }
                  .frame(maxWidth: .infinity, alignment: .leading)
                  .padding(.horizontal)
                  .offset(x: -15)
                  
                  // Бутонът за менюто, преместен вдясно
                HStack {
                    Spacer()
                   
                }
                .offset(y: -48) // или друг offset
              }
              .offset(y: 10) // Поправи стойността според нуждите ти
           

            // Хедър със средните стойности за всеки 2 часа – използваме същия изглед, какъвто имате в hourlyGraphSection.
            let twoHourAverages: [Int] = stride(from: 0, to: uvData.count, by: 2).map { startIndex in
                let endIndex = min(startIndex + 2, uvData.count)
                let block = uvData[startIndex..<endIndex]
                return block.reduce(0, +) / block.count
            }
            Group {
                GeometryReader { geo in
                    ZStack(alignment: .leading) {
                        HStack(spacing: 0) {
                            let twoHourItemsForIcons = hourlyItemsForSelectedDate
                                .enumerated()
                                .filter { index, _ in index % 2 == 0 }
                                .map { $0.element }
                            
                            if twoHourItemsForIcons.isEmpty {
                                Text("No hourly data available for this day.")
                                    .font(.caption)
                                    .foregroundColor(.gray)
                                    .frame(maxWidth: .infinity, alignment: .center)
                                    .padding(.vertical)
                            } else {
                                ForEach(twoHourAverages.indices, id: \.self) { index in
                                    Text("\(twoHourAverages[index])")
                                        .font(.system(size: 12, weight: .bold))
                                        .frame(maxWidth: .infinity)
                                }
                            }
                        }
                        
                        // Ако избраният ден съвпада с днешния, поставяме затъмняващ слой и вертикална линия,
                        // които използват една и съща дробна стойност (fractionOfDay)
                        if Calendar.current.isDate(now, inSameDayAs: selectedDate) {
                            let overlayWidth = geo.size.width * CGFloat(fractionOfDay)
                            // Полупрозрачен правоъгълник, който покрива частта до текущото време
                            Rectangle()
                                .fill(Color.black.opacity(0.4))
                                .frame(width: overlayWidth)
                            
                        }
                    }
                }
                .frame(height: 20)
                .padding(.horizontal, graphPadding)
//                .offset(y: -25)
                
                // Графична част с Canvas – увеличена височина
                // Графична част с Canvas – увеличена височина
                Canvas { context, size in
                    guard uvData.count > 1,
                          size.width > graphPadding,
                          size.height > graphPadding * 2 else { return }
                    
                    let effectiveWidth = size.width
                    let effectiveHeight = size.height
                    let origin = CGPoint(x: graphPadding, y: effectiveHeight - graphPadding)
                    let graphContentWidth = effectiveWidth - graphPadding * 2
                    let graphContentHeight = effectiveHeight - graphPadding * 2
                    
                    let yStep = graphContentHeight / CGFloat(yRange.max - yRange.min)
                    func yPosition(for uv: Double) -> CGFloat {
                        return origin.y - CGFloat(uv - yRange.min) * yStep
                    }
                    let specialMarkers: [Int: String] = [
                        1: "Low",
                        3: "Moderate",
                        6: "High",
                        8: "Very High",
                        11: "Extreme"
                    ]
                    let gridMarkers: [Double] = Array(stride(from: 0, through: 12, by: 1))
                    for marker in gridMarkers {
                        let yPos = yPosition(for: marker)
                        var hLine = Path()
                        hLine.move(to: CGPoint(x: origin.x, y: yPos))
                        hLine.addLine(to: CGPoint(x: origin.x + graphContentWidth, y: yPos))
                        context.stroke(hLine,
                                       with: .color(.gray.opacity(0.3)),
                                       style: StrokeStyle(lineWidth: 0.5))
                        
                        // Надпис вдясно (числовия маркер)
                        let rightLabelPoint = CGPoint(x: origin.x + graphContentWidth + 15, y: yPos)
                        context.draw(
                            Text("\(Int(marker))")
                                .font(.system(size: 10))
                                .foregroundColor(.gray),
                            at: rightLabelPoint,
                            anchor: .center
                        )
                        
                        // Проверка дали текущият маркер се съдържа в речника за специални маркери
                        if let specialText = specialMarkers[Int(marker)] {
                            let leftLabelPoint = CGPoint(x: origin.x + 5, y: yPos + 5)
                            context.draw(
                                Text(specialText)
                                    .font(.system(size: 10))
                                    .foregroundColor(.gray),
                                at: leftLabelPoint,
                                anchor: .init(x: 0, y: 0.5) // x=0 -> ляво, y=0.5 -> центриране по вертикалата
                            )
                        }
                        
                    }
                    
                    // Рисуване на вертикални линии за часовите маркери
                    for hour in hourMarkers {
                        let xPos = origin.x + (CGFloat(hour) * (graphContentWidth / 24.0))
                        var vLine = Path()
                        vLine.move(to: CGPoint(x: xPos, y: graphPadding))
                        vLine.addLine(to: CGPoint(x: xPos, y: origin.y))
                        context.stroke(vLine,
                                       with: .color(.gray.opacity(0.3)),
                                       style: StrokeStyle(lineWidth: 0.5))
                    }
                    
                    // Построяване на пътя за линията и запълването под нея
                    var linePath = Path()
                    var fillPath = Path()
                    var points: [CGPoint] = []
                    let xStep = graphContentWidth / CGFloat(max(1, uvData.count - 1))
                    for (index, uv) in uvData.enumerated() {
                        let xPos = origin.x + CGFloat(index) * xStep
                        let yPos = yPosition(for: Double(uv))
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
                    
                    // Градиент за UV – от зелен към жълт, оранжев, червен и лилав
                    let uvGradientLine = Gradient(stops: [
                        .init(color: .green,   location: 0.0),
                        .init(color: .yellow,  location: 0.3),
                        .init(color: .orange,  location: 0.58),
                        .init(color: .red,     location: 0.75),
                        .init(color: .purple,  location: 1.0)
                    ])
                    let uvGradient = Gradient(stops: [
                        .init(color: .green.opacity(0.5),   location: 0.0),
                        .init(color: .yellow.opacity(0.5),  location: 0.3),
                        .init(color: .orange.opacity(0.5),  location: 0.58),
                        .init(color: .red.opacity(0.5),     location: 0.75),
                        .init(color: .purple.opacity(0.5),  location: 1.0)
                    ])
                    // Запълване под линията с градиент
                    context.drawLayer { layerContext in
                        layerContext.fill(
                            fillPath,
                            with: .linearGradient(
                                uvGradient,
                                startPoint: CGPoint(x: 0, y: size.height),
                                endPoint: CGPoint(x: 0, y: 0)
                            )
                        )
                    }
                    
                    // Рисуване на линията с градиент чрез клипване и запълване
                    context.drawLayer { layerContext in
                        let lineWidth: CGFloat = 2.5
                        let stroked = linePath.strokedPath(.init(lineWidth: lineWidth, lineCap: .round, lineJoin: .round))
                        layerContext.clip(to: stroked)
                        layerContext.fill(
                            Path(CGRect(origin: .zero, size: size)),
                            with: .linearGradient(
                                uvGradientLine,
                                startPoint: CGPoint(x: 0, y: size.height),
                                endPoint: CGPoint(x: 0, y: 0)
                            )
                        )
                    }
                    
                    // Рисуване на маркера за максималната стойност
                    if let maxUV = uvData.max(),
                       let maxIndex = uvData.firstIndex(of: maxUV),
                       points.indices.contains(maxIndex) {
                        let highPoint = points[maxIndex]
                        drawHLMarker(context: context, label: "Max", at: highPoint)
                    }
                    
                    // Затъмняване само на графичната област (fillPath) от началото до текущата точка и затъмняване на линията до текущия час
                    if Calendar.current.isDate(Date(), inSameDayAs: selectedDate),
                       let currentHourIndex = hourlyItemsForSelectedDate.firstIndex(where: {
                           Calendar.current.isDate($0.date, equalTo: Date(), toGranularity: .hour)
                       }) {
                        // Изчисляване на X позицията за текущия час
                        let currentXPos = origin.x + CGFloat(currentHourIndex) * xStep
                        
                        // Начертаване на вертикална линия (можете да зададете Y офсета според нуждите; тук използваме graphPadding)
                        var verticalPath = Path()
                        verticalPath.move(to: CGPoint(x: currentXPos, y: graphPadding))
                        verticalPath.addLine(to: CGPoint(x: currentXPos, y: origin.y))
                        
                        // Изчисляваме текущата UV стойност и нормализираме за извличане на цвят от градиента
                        let currentUV = uvData[currentHourIndex]
                        let normalized = (Double(currentUV) - yRange.min) / (yRange.max - yRange.min)
                        let currentColor: Color = colorFromGradient(gradient: uvGradient, location: normalized)
                        
                        // Начертаване на вертикалната линия с текущия цвят и дебелина 2
                        context.stroke(
                            verticalPath,
                            with: .color(currentColor),
                            style: StrokeStyle(lineWidth: 2)
                        )
                        
                        // Определяне на правоъгълник, който обхваща областта от началната X позиция до текущата,
                        // и запълване с полупрозрачен черен цвят за потъмняване
                        let darkenRect = CGRect(
                            x: origin.x,
                            y: graphPadding,
                            width: currentXPos - origin.x,
                            height: effectiveHeight - graphPadding * 2
                        )
                        context.fill(
                            Path(darkenRect),
                            with: .color(.black.opacity(0.3))
                        )
                    }
                    
                    
                    // Часови надписи под графиката
                    for hour in hourMarkers {
                        let xPos = origin.x + (CGFloat(hour) * (graphContentWidth / 24.0))
                        let textPoint = CGPoint(x: xPos, y: origin.y + 14)
                        context.draw(
                            Text(String(format: "%02d", hour))
                                .font(.system(size: 11))
                                .foregroundColor(.gray),
                            at: textPoint,
                            anchor: .center
                        )
                    }
                    
                    // Drag gesture интерполация – показване на стойност, взета от данните (като цяло число)
                    if let dragPoint = dragLocationUV {
                        if dragPoint.x >= origin.x && dragPoint.x <= origin.x + graphContentWidth {
                            let fractionIndex = (dragPoint.x - origin.x) / xStep
                            let lowerIdx = max(0, min(points.count - 1, Int(floor(fractionIndex))))
                            let upperIdx = max(0, min(points.count - 1, lowerIdx + 1))
                            let t = (upperIdx == lowerIdx) ? 0 : (fractionIndex - CGFloat(lowerIdx))
                            
                            // Интерполиране на UV стойността и Y координатата
                            let lowerValue = Double(uvData[lowerIdx])
                            let upperValue = Double(uvData[upperIdx])
                            let interpolatedValue = lowerValue + (upperValue - lowerValue) * Double(t)
                            let interpolatedUV = Int(round(interpolatedValue))
                            
                            var interpolatedY = points[lowerIdx].y
                            if upperIdx != lowerIdx {
                                interpolatedY += t * (points[upperIdx].y - points[lowerIdx].y)
                            }
                            let dotPoint = CGPoint(x: dragPoint.x, y: interpolatedY)
                            
                            // Вертикална линия
                            var verticalPath = Path()
                            verticalPath.move(to: CGPoint(x: dotPoint.x, y: graphPadding))
                            verticalPath.addLine(to: CGPoint(x: dotPoint.x, y: effectiveHeight - graphPadding))
                            context.stroke(verticalPath, with: .color(.white.opacity(0.5)), lineWidth: 1)
                            
                            // Създаваме етикет за показване на време и UV стойност
                            let dateFormatter = DateFormatter()
                            dateFormatter.dateFormat = "HH:mm"
                            let timeLabelString: String = {
                                if lowerIdx < hourlyItemsForSelectedDate.count, upperIdx < hourlyItemsForSelectedDate.count {
                                    let d1 = hourlyItemsForSelectedDate[lowerIdx].date
                                    let d2 = hourlyItemsForSelectedDate[upperIdx].date
                                    let totalInterval = d2.timeIntervalSince(d1)
                                    let interpolatedDate = d1.addingTimeInterval(totalInterval * Double(t))
                                    return dateFormatter.string(from: interpolatedDate)
                                } else {
                                    return "--:--"
                                }
                            }()
                            
                            let combinedLabel = Text("\(timeLabelString)\n\(interpolatedUV)")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(.white)
                            
                            // Изчисляваме приблизителния час за drag позицията:
                            let hourOfDrag = Double(lowerIdx) + Double(t)
                            
                            // По подразбиране: текстът да се появява отдясно
                            var labelAnchor: UnitPoint = .bottomLeading
                            var textX = dotPoint.x + 8
                            
                            // Ако приблизителният час е 12 или повече, позиционираме етикета наляво
                            if hourOfDrag >= 12 {
                                labelAnchor = .bottomTrailing
                                textX = dotPoint.x - 8
                            }
                            let textPoint = CGPoint(x: textX, y: dotPoint.y - 20)
                            
                            context.draw(combinedLabel, at: textPoint, anchor: labelAnchor)
                        }
                    }
                }
                .gesture(
                    DragGesture(minimumDistance: 0)
                        .onChanged { value in dragLocationUV = value.location }
                        .onEnded { _ in dragLocationUV = nil }
                )
                .frame(height: (graphHeight + 20) * 1.5)
                .offset(y: -30)
                Divider()
                    .background(Color.gray.opacity(0.4))
                    .padding(.horizontal, graphPadding / 2)
                    .padding(.top, 2)
                    .offset(y: -35)
                
                
                VStack(alignment: .leading, spacing: 4) {
                    HStack{
                        Text("Now, \(currentTimeString)")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .lineSpacing(3)
                        Spacer()
                    }
                    .offset(x: 2)
                 
                    HStack{
                        Text(generateUVAdvice(uvData: uvData, startOfSelectedDay: startOfSelectedDay))
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .lineSpacing(3)
                        Spacer()
                    }
                    .offset(x: 2)
                }
                .padding(.top, 5)
                .offset(y: -35)
            }
            .offset(y: 33)
        }
        .offset(y: -10)
    }
    
    func generateUVAdvice(uvData: [Int], startOfSelectedDay: Date) -> String {
        // 1) Филтрираме UV стойностите, които са поне 3 (Moderate или по-висок)
        let moderateOrHigher = uvData.enumerated().filter { $0.element >= 1 } // [(index, uv)]
        
        // 2) Ако няма нито една стойност ≥ 3, връщаме съответно съобщение
        if moderateOrHigher.isEmpty {
            return "No moderate or higher UV levels are expected for this day."
        } else {
            // earliest и latest – първият и последният час в деня, където UV ≥ 3
            let earliestHourIndex = moderateOrHigher.first!.offset
            let latestHourIndex   = moderateOrHigher.last!.offset
            
            // minUV и maxUV – най-ниската и най-високата UV стойност в този диапазон
            let minUV = moderateOrHigher.map { $0.element }.min() ?? 1
            let maxUV = moderateOrHigher.map { $0.element }.max() ?? 1
            
            // Преобразуваме index (час) в реални Date обекти
            let calendar = Calendar.current
            let earliestDate = calendar.date(byAdding: .hour, value: earliestHourIndex, to: startOfSelectedDay)!
            let latestDate   = calendar.date(byAdding: .hour, value: latestHourIndex,  to: startOfSelectedDay)!
            
            // Форматираме ги като час:минути (HH:mm) или друго, което предпочитате
            let formatter = DateFormatter()
            formatter.dateFormat = "HH:mm"
            let earliestStr = formatter.string(from: earliestDate) // "10:00"
            let latestStr   = formatter.string(from: latestDate)   // "15:00"
            
            // Определяме категориите за minUV и maxUV (пр. Moderate, High и т.н.)
            let minCategory = uvCategory(for: minUV)
            let maxCategory = uvCategory(for: maxUV)
            
            // Накрая сглобяваме динамичен текст
            let uvAdviceText = """
            Sun protection recommended. UV levels range from \(minCategory) to \(maxCategory), \
            reached between \(earliestStr) and \(latestStr).
            """
            
            return uvAdviceText
        }
    }
    
    func uvCategory(for uv: Int) -> String {
        if uv >= 11 {
            return "Extreme"
        } else if uv >= 8 {
            return "Very High"
        } else if uv >= 6 {
            return "High"
        } else if uv >= 3 {
            return "Moderate"
        } else if uv >= 1 {
            return "Low"
        } else {
            return "None" // или "0", ако искате да показвате конкретно число
        }
    }
}
