import SwiftUI

extension WeatherDetailView{
    
    @ViewBuilder
    func hourlyGraphSection() -> some View {
        // Избираме актуалната дата (сега) и изчисляваме дял от деня (0.0...1.0)
        let now = Date()
        let startOfSelectedDay = customCalendar.startOfDay(for: selectedDate)
        let secondsFromMidnight = now.timeIntervalSince(startOfSelectedDay)
        let fractionOfDay = secondsFromMidnight / (24 * 3600)
        
        let currentTemperatures = temperatures
        let yRange = yAxisRange
        let hourMarkers = [0, 6, 12, 18, 24]
        
        let gradient = TemperatureColorScale.graphGradient(range: yRange)
        var feelsLikeMinMax: (min: Double, max: Double) {
            let feelsLikeTemps = hourlyItemsForSelectedDate.map { $0.feelsLikeTemp }
            return (feelsLikeTemps.min() ?? 0, feelsLikeTemps.max() ?? 0)
        }
        
        VStack(spacing: 0) {
            // Първата част: показване на текущата температура, минимална/максимална стойност и иконка
            HStack(alignment: .top) {
                if let dayItem = allDailyItems.first(where: {
                    Calendar.current.isDate($0.date, inSameDayAs: selectedDate)
                }) {
                    // 1) Проверяваме дали избраният ден е “днешният”
                    let isToday = Calendar.current.isDateInToday(dayItem.date)
                    
                    if isToday {
                        // =============== CASE 1: Днешен ден ===============
                        // Логиката за показване на текуща температура или feelsLike
                        
                        if showingFeelsLike{
                            VStack(alignment: .leading, spacing: 2) {
                                Text(NSLocalizedString("Feels Like", comment: "Feels like temperature label"))
                                    .font(.system(size: 14, weight: .medium))
                                    .foregroundColor(.secondary)
                                HStack(alignment: .top, spacing: 10) {
                                    Text("\(Int(round(vm.currentFeelsLike!)))°")
                                        .font(.system(size: 70, weight: .thin))
                                        .foregroundColor(.white)
                                }
                            }
                        } else {
                            VStack(alignment: .leading, spacing: 2) {
                                Text(NSLocalizedString("Actual", comment: "Actual temperature label"))
                                    .font(.system(size: 14, weight: .medium))
                                    .foregroundColor(.secondary)
                                HStack(alignment: .top, spacing: 10) {
                                    Text("\(Int(round(vm.currentTemp!)))°")
                                        .font(.system(size: 70, weight: .thin))
                                        .foregroundColor(.white)
                                    
                                    VStack(alignment: .leading, spacing: 4) {
                                        Text(String(
                                            format: NSLocalizedString("HighLabelFormat", comment: "Max temperature label"),
                                            Int(round(dayItem.maxTemp))
                                        ))
                                        .font(.system(size: 14, weight: .regular))

                                        Text(String(
                                            format: NSLocalizedString("LowLabelFormat", comment: "Min temperature label"),
                                            Int(round(dayItem.minTemp))
                                        ))
                                        .font(.system(size: 14, weight: .regular))
                                        .foregroundColor(.gray)

                                    }
                                }
                            }
                        }
                        
                        // Показваме символа (иконата) – без промяна
                        Image(systemName: dayItem.symbol)
                            .symbolVariant(.fill)
                            .symbolRenderingMode(.multicolor)
                            .font(.system(size: 40))
                            .shadow(color: .black.opacity(0.1), radius: 1, y: 1)
                            .offset(y: 14)
                        
                        Spacer()
                        
                        
                    } else {
                        HStack(){
                            
                            VStack(alignment: .leading, spacing: 6) {
                                HStack(alignment: .firstTextBaseline, spacing: 8) {
                                    // Ако showingFeelsLike == true, показваме feels like max; иначе реалният max
                                    if showingFeelsLike {
                                        Text("\(Int(round(feelsLikeMinMax.max)))°")
                                            .font(.system(size: 40, weight: .medium))
                                            .foregroundColor(.white)
                                        // Показваме и feels like min – можете да оцветите различно (например в сиво)
                                        Text("\(Int(round(feelsLikeMinMax.min)))°")
                                            .font(.system(size: 40, weight: .medium))
                                            .foregroundColor(.gray)
                                    } else {
                                        // При нормално състояние показваме реалните температури от dayItem
                                        Text("\(Int(round(dayItem.maxTemp)))°")
                                            .font(.system(size: 40, weight: .medium))
                                            .foregroundColor(.white)
                                        Text("\(Int(round(dayItem.minTemp)))°")
                                            .font(.system(size: 40, weight: .medium))
                                            .foregroundColor(.gray)
                                    }
                                }
                            }
                            .offset(y: 14)
                            
                            
                            
                            // Символът за време (например cloud.sun.fill)
                            Image(systemName: dayItem.symbol)
                                .symbolVariant(.fill)
                                .symbolRenderingMode(.multicolor)
                                .font(.system(size: 40))
                                .shadow(color: .black.opacity(0.1), radius: 1, y: 1)
                            
                            
                            Spacer()
                            
                            
                        }
                        .padding(.bottom, 25)
                        
                    }
                    
                } else {
                    // fallback, ако няма DayForecastItem за избрания ден
                    Text("--°")
                        .font(.system(size: 70, weight: .thin))
                    Spacer()
                }
            }
            
            Group{
                // Втората част: Часови икони с надложен затъмнителен слой за миналото.
                GeometryReader { geo in
                    ZStack(alignment: .leading) {
                        HStack(spacing: 0) {
                            let twoHourItemsForIcons = hourlyItemsForSelectedDate
                                .enumerated()
                                .filter { index, _ in index % 2 == 0 }
                                .map { $0.element }
                            
                            if twoHourItemsForIcons.isEmpty {
                                Text(NSLocalizedString("No hourly data available for this day.", comment: "No hourly data fallback"))
                                    .font(.caption)
                                    .foregroundColor(.gray)
                                    .frame(maxWidth: .infinity, alignment: .center)
                                    .padding(.vertical)
                            } else {
                                ForEach(twoHourItemsForIcons, id: \.id) { item in
                                    if item.symbol == "wind"{
                                        Image(systemName: "\(item.symbol)")
                                            .symbolRenderingMode(.multicolor)
                                            .font(.system(size: 13))
                                            .frame(maxWidth: .infinity)
                                    }else{
                                        Image(systemName: "\(item.symbol).fill")
                                            .symbolRenderingMode(.multicolor)
                                            .font(.system(size: 13))
                                            .frame(maxWidth: .infinity)
                                            .offset(y: item.symbol == "cloud.fill" ? -5 : 0)
                                    }
                                }
                            }
                        }
                        
                        // Ако избраният ден съвпада с днешния, поставяме затъмняващ слой и вертикална линия,
                        // които използват една и съща дробна стойност (fractionOfDay)
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
                .padding(.bottom, -15)
                
                
                Canvas { context, size in
                    guard !currentTemperatures.isEmpty,
                          currentTemperatures.count > 1,
                          size.width > graphPadding,
                          size.height > graphPadding * 2,
                          yRange.max > yRange.min else { return }
                    
                    let effectiveWidth = size.width
                    let effectiveHeight = size.height
                    let origin = CGPoint(x: graphPadding, y: effectiveHeight - graphPadding)
                    var graphContentWidth  = effectiveWidth - graphPadding * 2
                    let graphContentHeight = effectiveHeight - graphPadding * 2
                    let yStep = graphContentHeight / CGFloat(yRange.max - yRange.min)
                    
                    func yPosition(for temp: Double) -> CGFloat {
                        origin.y - CGFloat(temp - yRange.min) * yStep
                    }
                    
                    // Рисуване на хоризонталните линии и температурните етикети
                    for tempLabelValue in yAxisLabels {
                        let yPos = yPosition(for: tempLabelValue)
                        var hLine = Path()
                        hLine.move(to: CGPoint(x: origin.x, y: yPos))
                        hLine.addLine(to: CGPoint(x: origin.x + graphContentWidth, y: yPos))
                        context.stroke(
                            hLine,
                            with: .color(.gray.opacity(0.3)),
                            style: StrokeStyle(lineWidth: 0.5)
                        )
                        let textX = origin.x + graphContentWidth + 15
                        let textPoint = CGPoint(x: textX, y: yPos)
                        context.draw(
                            Text("\(Int(round(tempLabelValue)))°")
                                .font(.system(size: 10))
                                .foregroundColor(.gray),
                            at: textPoint,
                            anchor: .center
                        )
                    }
                    
                    // Вертикални часовникови маркери
                    for hour in hourMarkers {
                        let xPos = origin.x + (CGFloat(hour) * (graphContentWidth / 24.0))
                        var vLine = Path()
                        vLine.move(to: CGPoint(x: xPos, y: graphPadding))
                        vLine.addLine(to: CGPoint(x: xPos, y: origin.y))
                        context.stroke(
                            vLine,
                            with: .color(.gray.opacity(0.3)),
                            style: StrokeStyle(lineWidth: 0.5)
                        )
                    }
                    
                    var linePath = Path()
                    var fillPath = Path()
                    var points: [CGPoint] = []
                    let xStep = graphContentWidth / CGFloat(max(1, currentTemperatures.count - 1))
                    
                    // Изчисляване на точките за чертане на температурната линия
                    for (index, temp) in currentTemperatures.enumerated() {
                        let xPos = origin.x + CGFloat(index) * xStep
                        let yPos = yPosition(for: temp)
                        let point = CGPoint(x: xPos, y: yPos)
                        points.append(point)
                        if index == 0 {
                            linePath.move(to: point)
                            fillPath.move(to: CGPoint(x: xPos, y: origin.y))
                            fillPath.addLine(to: point)
                        } else {
                            linePath.addLine(to: point)
                            fillPath.addLine(to: point)
                        }
                    }
                    if let lastPoint = points.last {
                        fillPath.addLine(to: CGPoint(x: lastPoint.x, y: origin.y))
                        fillPath.closeSubpath()
                    }
                    
                    // Рисуване на запълнената област под линията
                    context.drawLayer { layerContext in
                        layerContext.fill(
                            fillPath,
                            with: .linearGradient(
                                gradient,
                                startPoint: CGPoint(x: 0, y: size.height),
                                endPoint: CGPoint(x: 0, y: 0)
                            )
                        )
                        let opacityGradient = Gradient(colors: [.clear, .black.opacity(0.8)])
                        layerContext.blendMode = .destinationOut
                        layerContext.fill(
                            fillPath,
                            with: .linearGradient(
                                opacityGradient,
                                startPoint: CGPoint(x: 0, y: size.height),
                                endPoint: CGPoint(x: 0, y: 0)
                            )
                        )
                        layerContext.blendMode = .normal
                    }
                    
                    // Рисуване на температурната линия с градиент
                    context.drawLayer { layerContext in
                        let lineWidth: CGFloat = 2.5
                        let stroked = linePath.strokedPath(.init(lineWidth: lineWidth, lineCap: .round, lineJoin: .round))
                        layerContext.clip(to: stroked)
                        layerContext.fill(
                            Path(CGRect(origin: .zero, size: size)),
                            with: .linearGradient(
                                gradient,
                                startPoint: CGPoint(x: 0, y: size.height),
                                endPoint: CGPoint(x: 0, y: 0)
                            )
                        )
                    }
                    
                    // Поставяне на маркери за най-висока и най-ниска температура
                    let validPoints = points.filter { !$0.x.isNaN && !$0.y.isNaN }
                    guard !validPoints.isEmpty else { return }
                    
                    if let maxTemp = currentTemperatures.max(),
                       let maxIndex = currentTemperatures.firstIndex(of: maxTemp),
                       validPoints.indices.contains(maxIndex) {
                        let highPoint = validPoints[maxIndex]
                        drawHLMarker(
                               context: context,
                               label: NSLocalizedString("HourlyGraph_HighLabel", comment: "High marker label"),
                               at: highPoint,
                               temperature: maxTemp,
                               range: yRange,
                               gradient: gradient
                           )
                    }
                    
                    if let minTemp = currentTemperatures.min(),
                       let minIndex = currentTemperatures.firstIndex(of: minTemp),
                       validPoints.indices.contains(minIndex) {
                        let lowPoint = validPoints[minIndex]
                        drawHLMarker(
                               context: context,
                               label: NSLocalizedString("HourlyGraph_LowLabel", comment: "Low marker label"),
                               at: lowPoint,
                               temperature: minTemp,
                               range: yRange,
                               gradient: gradient
                           )
                    }
                    
                    // Часовникови надписи под графиката
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
                    
                    // *** Блок за текущото време и затъмняване ***
                    let now = Date()

                    // 1) Начало на избрания ден според customCalendar

                    // 2) Час/минути/секунди от now според customCalendar
                    let comps = customCalendar.dateComponents([.hour, .minute, .second], from: now)
                    let secondsFromMidnight = Double(comps.hour ?? 0) * 3600
                                           + Double(comps.minute ?? 0) * 60
                                           + Double(comps.second ?? 0)

                    // 3) Дял от деня
                    let fractionOfDay = secondsFromMidnight / (24 * 3600)

                    // 4) Ширина на графиката
                    graphContentWidth = size.width - graphPadding * 2

                    if customCalendar.isDate(now, inSameDayAs: selectedDate) {
                        // X позиция според точните час/минути
                        let currentXPos = origin.x + CGFloat(fractionOfDay) * graphContentWidth
                        let currentLineYOffset: CGFloat = graphPadding - 120

                        // Вертикална линия
                        var verticalPath = Path()
                        verticalPath.move(to: CGPoint(x: currentXPos, y: currentLineYOffset))
                        verticalPath.addLine(to: CGPoint(x: currentXPos, y: origin.y))

                        // Интерполираме температурата за exact момент
                        let rawIndex = fractionOfDay * CGFloat(currentTemperatures.count - 1)
                        let lower = Int(floor(rawIndex))
                        let upper = min(currentTemperatures.count - 1, lower + 1)
                        let t = rawIndex - CGFloat(lower)
                        let interpolatedTemp = currentTemperatures[lower]
                                               + (currentTemperatures[upper] - currentTemperatures[lower]) * Double(t)
                        let currentColor = colorForTemperature(interpolatedTemp, in: yRange, using: gradient)

                        context.stroke(
                            verticalPath,
                            with: .color(currentColor),
                            style: StrokeStyle(lineWidth: 2)
                        )

                        // Затъмняваме до текущото време
                        let darkenRect = CGRect(
                            x: origin.x,
                            y: graphPadding,
                            width: currentXPos - origin.x,
                            height: size.height - graphPadding * 2
                        )
                        context.fill(
                            Path(darkenRect),
                            with: .color(.black.opacity(0.3))
                        )
                    }


                    
                    // *** Блок за Drag Gesture – вертикална линия с интерполация ***
                    if let dragPoint = dragLocationTEMP {
                        if dragPoint.x >= origin.x && dragPoint.x <= origin.x + graphContentWidth {
                            // 1) fractionIndex: figure out which hour(s) we’re between
                            let fractionIndex = (dragPoint.x - origin.x) / xStep
                            let lowerIndex = max(0, min(points.count - 1, Int(floor(fractionIndex))))
                            let upperIndex = max(0, min(points.count - 1, lowerIndex + 1))
                            let t: CGFloat = (upperIndex == lowerIndex) ? 0 : (fractionIndex - CGFloat(lowerIndex))
                            
                            // 2) Interpolate temperature
                            let interpolatedTemp = currentTemperatures[lowerIndex]
                            + (currentTemperatures[upperIndex] - currentTemperatures[lowerIndex]) * Double(t)
                            
                            // 3) Interpolate y
                            var interpolatedY: CGFloat = points[lowerIndex].y
                            if upperIndex != lowerIndex {
                                interpolatedY += t * (points[upperIndex].y - points[lowerIndex].y)
                            }
                            let dotPoint = CGPoint(x: dragPoint.x, y: interpolatedY)
                            
                            // 4) Vertical line
                            var verticalLine = Path()
                            verticalLine.move(to: CGPoint(x: dotPoint.x, y: graphPadding))
                            verticalLine.addLine(to: CGPoint(x: dotPoint.x, y: effectiveHeight - graphPadding))
                            context.stroke(verticalLine, with: .color(.white.opacity(0.5)), lineWidth: 1)
                            
                            // 5) Dot
                            let dotRect = CGRect(center: dotPoint, radius: 4)
                            context.fill(Path(ellipseIn: dotRect), with: .color(.white))
                            
                            let baseDate = hourlyItemsForSelectedDate[lowerIndex].date
                            let secondsOffset = (fractionIndex - CGFloat(lowerIndex)) * 3600.0
                            let interpolatedDate = baseDate.addingTimeInterval(TimeInterval(secondsOffset))
                            
                            let dateFormatter = DateFormatter()
                            dateFormatter.dateFormat = "HH:mm"
                            dateFormatter.timeZone = WeatherKitViewModel.shared.locationTimeZone // или вашият custom timeZone

                            let exactTime = dateFormatter.string(from: interpolatedDate)
                            
                            // 7) We want the text to go on the left side if hour >= 12
                            let hourOfDrag = Double(lowerIndex) + Double(t) // an approximate “hour index”
                            
                            // By default, place text on the right
                            var labelAnchor: UnitPoint = .bottomLeading
                            var textX = dotPoint.x + 8
                            
                            // If we’re after the 12th hour, place text on the LEFT
                            if hourOfDrag >= 12 {
                                labelAnchor = .bottomTrailing
                                textX = dotPoint.x - 8
                            }
                            
                            // 8) Draw the label
                            let labelText = Text("\(exactTime)\n\(Int(round(interpolatedTemp)))°")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(.white)
                            
                            let textPoint = CGPoint(x: textX, y: dotPoint.y - 20)
                            context.draw(labelText, at: textPoint, anchor: labelAnchor)
                        }
                    }
                }
                .gesture(
                    DragGesture(minimumDistance: 0)
                        .onChanged { value in
                            dragLocationTEMP = value.location
                        }
                        .onEnded { _ in
                            dragLocationTEMP = nil
                        }
                )
                
                .frame(height: graphHeight + 20)
                
                Divider()
                    .background(Color.gray.opacity(0.4))
                    .padding(.horizontal, graphPadding / 2)
                    .padding(.top, 2)
            }
            .offset(y: -10)
        }
        HStack(spacing: 5) {
            Button {
                showingFeelsLike = false
            } label: {
                Text(NSLocalizedString("Actual", comment: "Actual temperature label"))
                    .font(.system(size: 12, weight: .medium))
                    .padding(.vertical, 7)
                    .padding(.horizontal, 12)
                    .frame(maxWidth: .infinity)
                    .foregroundColor(!showingFeelsLike ? .black : .gray)
                    .background(!showingFeelsLike ? Color.white : Color.clear)
                    .cornerRadius(15)
            }
            .buttonStyle(.plain)
            .contentShape(Rectangle())

            Button {
                showingFeelsLike = true
            } label: {
                Text(NSLocalizedString("Feels Like", comment: "Feels like temperature label"))
                    .font(.system(size: 12, weight: .medium))
                    .padding(.vertical, 7)
                    .padding(.horizontal, 12)
                    .frame(maxWidth: .infinity)
                    .foregroundColor(showingFeelsLike ? .black : .gray)
                    .background(showingFeelsLike ? Color.white : Color.clear)
                    .cornerRadius(15)
            }
            .buttonStyle(.plain)
            .contentShape(Rectangle())

        }
        .padding(3)
        .background(Color.white.opacity(0.15))
        .clipShape(Capsule())
        HStack{
            Text(showingFeelsLike
                 ? "What the temperature feels like as a result of humidity, sunlight or wind."
                 : "The actual air temperature."
            )
            .font(.caption)
            .foregroundColor(.secondary)
            .lineSpacing(3)
            Spacer()
        }
        .offset(x: 2)
    }
    
    func colorForTemperature(
        _ temperature: Double,
        in range: (min: Double, max: Double),
        using gradient: Gradient
    ) -> Color {
        let loc = temperatureToGradientLocation(temperature, range: range)
        let stops = gradient.stops.sorted { $0.location < $1.location }
        guard let firstStop = stops.first, let lastStop = stops.last else {
            return .white
        }
        if loc <= firstStop.location { return firstStop.color }
        if loc >= lastStop.location { return lastStop.color }
        for i in 0..<stops.count - 1 {
            let lower = stops[i]
            let upper = stops[i+1]
            if loc >= lower.location && loc <= upper.location {
                let ratio = (loc - lower.location) / (upper.location - lower.location)
                return (ratio < 0.5) ? lower.color : upper.color
            }
        }
        return .white
    }
    
    private func temperatureToGradientLocation(_ temp: Double, range: (min: Double, max: Double)) -> CGFloat {
        guard range.max > range.min else { return 0.5 }
        let normalized = (temp - range.min) / (range.max - range.min)
        return CGFloat(max(0.0, min(1.0, normalized)))
    }
}
  
