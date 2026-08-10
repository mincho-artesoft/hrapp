import SwiftUI

extension WeatherDetailView{
    
    @ViewBuilder
    func chanceOfPrecipGraphSection() -> some View {
        
        
        // Извличаме стойностите за вероятностите от часовата прогноза.
        let precipData = hourlyItemsForSelectedDate.map { $0.precipChance }
        // Задаваме фиксиран диапазон – от 0% до 100% (0.0 ... 1.0)
        let yRange: (min: Double, max: Double) = (0.0, 1.0)
        // Маркерите по оста за определени часове (0, 6, 12, 18, 24)
        let hourMarkers = [0, 6, 12, 18, 24]
        
        let todayChance: Int = {
            if let dayItem = allDailyItems.first(where: { Calendar.current.isDate($0.date, inSameDayAs: selectedDate) }) {
                return Int(dayItem.precipChance!*100)
            }
            return 0
        }()
        
        VStack(spacing: 0) {
            
            VStack(alignment: .leading, spacing: 5) {
                Text(NSLocalizedString("ChanceOfPrecipitation_Title",
                                       comment: "Title for Chance of Precipitation section"))
                
                // build localized subtitle
                let subtitle: String = {
                    if Calendar.current.isDate(selectedDate, inSameDayAs: Date()) {
                        return localizedFormat(NSLocalizedString("TodaysChance",
                                                     comment: "Subtitle for today's precipitation chance"),
                            todayChance
                        )
                    } else {
                        let dayName = appDateFormatter(
                            template: "EEEE",
                            timeZone: WeatherKitViewModel.shared.locationTimeZone
                        ).string(from: selectedDate)
                        return localizedFormat(NSLocalizedString("OtherDayChance",
                                                     comment: "Subtitle for another day's precipitation chance"),
                            dayName, todayChance
                        )
                    }
                }()
                Text(subtitle)
                    .font(.system(size: 13))
                    .foregroundColor(.gray)
            }
            .frame(maxWidth: .infinity, alignment: .leading) // Задава максимална ширина и ляво подравняване
            .padding(.horizontal)
            .offset(x: -18)


            
            // Графиката с Canvas – чертае линия с запълнената област, марки и интерактивен drag gesture
            Canvas { context, size in
                guard precipData.count > 1,
                      size.width > graphPadding,
                      size.height > graphPadding * 2 else { return }
                
                let effectiveWidth = size.width
                let effectiveHeight = size.height
                let now = Date()
                // вместо Calendar.current, използваме customCalendar
                let comps = customCalendar.dateComponents([.hour, .minute, .second], from: now)
                let secondsFromMidnight = Double(comps.hour ?? 0) * 3600
                                       + Double(comps.minute ?? 0) * 60
                                       + Double(comps.second ?? 0)
                let fractionOfDay = secondsFromMidnight / (24 * 3600)

                let origin = CGPoint(x: graphPadding, y: effectiveHeight - graphPadding)
                let graphContentWidth = effectiveWidth - graphPadding * 2
                let graphContentHeight = effectiveHeight - graphPadding * 2
                let yStep = graphContentHeight / CGFloat(yRange.max - yRange.min)
                
                func yPosition(for chance: Double) -> CGFloat {
                    // По-голямата вероятност (до 1.0) води до по-висока позиция.
                    return origin.y - CGFloat(chance - yRange.min) * yStep
                }
                
                // Чертаме хоризонтални линии и надписи (0%, 25%, 50%, 75%, 100%)
                let percMarkers: [Double] = [0, 0.25, 0.5, 0.75, 1.0]
                for marker in percMarkers {
                    let yPos = yPosition(for: marker)
                    var hLine = Path()
                    hLine.move(to: CGPoint(x: origin.x, y: yPos))
                    hLine.addLine(to: CGPoint(x: origin.x + graphContentWidth, y: yPos))
                    context.stroke(hLine, with: .color(.gray.opacity(0.3)), style: StrokeStyle(lineWidth: 0.5))
                    let labelPoint = CGPoint(x: origin.x + graphContentWidth + 15, y: yPos)
                    context.draw(
                        Text(localizedFormat("%d%%", Int(marker * 100)))
                            .font(.system(size: 8))
                            .foregroundColor(.gray),
                        at: labelPoint,
                        anchor: .center
                    )
                }
                
                // Чертаме вертикални линии за избрани часове (0, 6, 12, 18, 24)
                for hour in hourMarkers {
                    let xPos = origin.x + (CGFloat(hour) * (graphContentWidth / 24.0))
                    var vLine = Path()
                    vLine.move(to: CGPoint(x: xPos, y: graphPadding))
                    vLine.addLine(to: CGPoint(x: xPos, y: origin.y))
                    context.stroke(vLine, with: .color(.gray.opacity(0.3)), style: StrokeStyle(lineWidth: 0.5))
                }
                
                // Изчисляваме точките по линията
                var linePath = Path()
                var fillPath = Path()
                var points: [CGPoint] = []
                let itemCount = precipData.count
                let xStep = graphContentWidth / CGFloat(max(1, itemCount - 1))
                for (index, chance) in precipData.enumerated() {
                    let xPos = origin.x + CGFloat(index) * xStep
                    let yPos = yPosition(for: chance)
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
                
                // Градиент от светло към наситен син
                let gradient = Gradient(stops: [
                    .init(color: Color.blue.opacity(0.4), location: 0),
                    .init(color: Color.blue.opacity(0.8), location: 1)
                ])
                
                // Запълване на областта под линията с градиент
                context.drawLayer { layerContext in
                    layerContext.fill(
                        fillPath,
                        with: .linearGradient(
                            gradient,
                            startPoint: CGPoint(x: 0, y: size.height),
                            endPoint: CGPoint(x: 0, y: 0)
                        )
                    )
                }
                
                // Чертаме линията на вероятностите
                context.stroke(linePath, with: .color(Color.blue), lineWidth: 2.5)
                
                // Ако не всички данни са 0, рисуваме маркерите за най-високата и най-ниската стойност.
                if !precipData.allSatisfy({ $0 == 0 }) {
                    if let maxChance = precipData.max(),
                       let maxIndex = precipData.firstIndex(of: maxChance),
                       points.indices.contains(maxIndex) {
                        let highPoint = points[maxIndex]
                        context.drawLayer { layerContext in
                            let outerRadius: CGFloat = 6
                            let innerRadius: CGFloat = 3
                            let outerRect = CGRect(center: highPoint, radius: outerRadius)
                            let innerRect = CGRect(center: highPoint, radius: innerRadius)
                            layerContext.fill(Path(ellipseIn: outerRect), with: .color(.black))
                            layerContext.fill(Path(ellipseIn: innerRect), with: .color(Color.blue))
                            let labelPoint = CGPoint(x: highPoint.x, y: highPoint.y - outerRadius - 4)
                            layerContext.draw(
                                Text(NSLocalizedString("Max", comment: "Maximum marker label"))
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(.gray),
                                at: labelPoint,
                                anchor: .center
                            )
                        }
                    }
                    if let minChance = precipData.min(),
                       let minIndex = precipData.firstIndex(of: minChance),
                       points.indices.contains(minIndex) {
                        let lowPoint = points[minIndex]
                        context.drawLayer { layerContext in
                            let outerRadius: CGFloat = 6
                            let innerRadius: CGFloat = 3
                            let outerRect = CGRect(center: lowPoint, radius: outerRadius)
                            let innerRect = CGRect(center: lowPoint, radius: innerRadius)
                            layerContext.fill(Path(ellipseIn: outerRect), with: .color(.black))
                            layerContext.fill(Path(ellipseIn: innerRect), with: .color(Color.blue))
                            let labelPoint = CGPoint(x: lowPoint.x, y: lowPoint.y - outerRadius - 4)
                            layerContext.draw(
                                Text(NSLocalizedString("Min", comment: "Minimum marker label"))
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(.gray),
                                at: labelPoint,
                                anchor: .center
                            )
                        }
                    }
                }
                
                // Изписваме часовите надписи под графиката.
                for hour in hourMarkers {
                    let xPos = origin.x + (CGFloat(hour) * (graphContentWidth / 24.0))
                    let textPoint = CGPoint(x: xPos, y: origin.y + 14)
                    context.draw(
                        Text(localizedFormat("%02d", hour))
                            .font(.system(size: 11))
                            .foregroundColor(.gray),
                        at: textPoint,
                        anchor: .center
                    )
                }
                
                // Шейд и вертикална линия в точния момент (час+минути) спрямо customCalendar
                if customCalendar.isDate(now, inSameDayAs: selectedDate) {
                    // graphContentWidth и graphContentHeight са вече дефинирани над Canvas
                    let currentXPos = origin.x + CGFloat(fractionOfDay) * graphContentWidth

                    // shading до текущото време
                    let darkRect = CGRect(
                        x: origin.x,
                        y: graphPadding,
                        width: currentXPos - origin.x,
                        height: graphContentHeight
                    )
                    context.fill(Path(darkRect), with: .color(.black.opacity(0.3)))

                    // вертикална линия
                    var timeLine = Path()
                    timeLine.move(to: CGPoint(x: currentXPos, y: graphPadding))
                    timeLine.addLine(to: CGPoint(x: currentXPos, y: origin.y))
                    context.stroke(timeLine, with: .color(.green), lineWidth: 2)
                }

                
                // Интерполация при Drag Gesture – показване на стойност на вероятността в проценти.
                // Интерполация при Drag Gesture – показване на стойност на вероятността в проценти.
                if let dragPoint = dragLocationPreci {
                    if dragPoint.x >= origin.x && dragPoint.x <= origin.x + graphContentWidth {
                        // 1) fractionIndex – позиция (0...n) между точките
                        let fractionIndex = (dragPoint.x - origin.x) / xStep

                        // 2) Индекси на „долната“ и „горната“ точки
                        let lowerIndex = max(0, min(points.count - 1, Int(floor(fractionIndex))))
                        let upperIndex = max(0, min(points.count - 1, lowerIndex + 1))
                        let t = (upperIndex == lowerIndex) ? 0 : (fractionIndex - CGFloat(lowerIndex))

                        // 3) Интерполация на вероятността за валеж (precipData)
                        let lowerValue = precipData[lowerIndex]
                        let upperValue = precipData[upperIndex]
                        let interpolatedChance = lowerValue + (upperValue - lowerValue) * Double(t)
                        let precipPercent = Int(interpolatedChance * 100)
                        
                        // 4) Интерполация на координатата по Y (графиката)
                        var interpolatedY = points[lowerIndex].y
                        if upperIndex != lowerIndex {
                            interpolatedY = points[lowerIndex].y + t * (points[upperIndex].y - points[lowerIndex].y)
                        }
                        let dotPoint = CGPoint(x: dragPoint.x, y: interpolatedY)

                        // 5) Вертикална линия, която показва текущата X позиция
                        var verticalPath = Path()
                        verticalPath.move(to: CGPoint(x: dotPoint.x, y: graphPadding))
                        verticalPath.addLine(to: CGPoint(x: dotPoint.x, y: effectiveHeight - graphPadding))
                        context.stroke(verticalPath, with: .color(.white.opacity(0.5)), lineWidth: 1)

                        // 6) Малка бяла точка (dot), за да маркираме мястото
                        let dotRect = CGRect(center: dotPoint, radius: 4)
                        context.fill(Path(ellipseIn: dotRect), with: .color(.white))

                        // 7) Интерполация на времето (чч:мм)
                        let timeLabelString: String
                        if lowerIndex < hourlyItemsForSelectedDate.count, upperIndex < hourlyItemsForSelectedDate.count {
                            let lowerDate = hourlyItemsForSelectedDate[lowerIndex].date
                            let upperDate = hourlyItemsForSelectedDate[upperIndex].date

                            let totalInterval = upperDate.timeIntervalSince(lowerDate)
                            let interpolatedDate = lowerDate.addingTimeInterval(totalInterval * Double(t))

                            timeLabelString = appTimeFormatter(
                                timeZone: WeatherKitViewModel.shared.locationTimeZone
                            ).string(from: interpolatedDate)
                        } else {
                            timeLabelString = "--:--"
                        }

                        // 8) Създаваме етикета с времето и процента
                        let combinedLabel = Text(timeLabelString + "\n" + localizedFormat("%d%%", precipPercent))
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(.white)

                        // 9) Определяме дали dragPoint е в дясната (след средата) или в лявата половина
                        let isAfterMidday = dragPoint.x > origin.x + graphContentWidth / 2
                        let labelOffset: CGFloat = 8
                        let textPoint: CGPoint
                        let anchor: UnitPoint

                        // Ако стойността е 50 или повече, етикетът да се показва под точката, иначе над нея.
                        if precipPercent >= 50 {
                            if isAfterMidday {
                                textPoint = CGPoint(x: dotPoint.x - labelOffset, y: dotPoint.y + 20)
                                anchor = .topTrailing
                            } else {
                                textPoint = CGPoint(x: dotPoint.x + labelOffset, y: dotPoint.y + 20)
                                anchor = .topLeading
                            }
                        } else {
                            if isAfterMidday {
                                textPoint = CGPoint(x: dotPoint.x - labelOffset, y: dotPoint.y - 20)
                                anchor = .bottomTrailing
                            } else {
                                textPoint = CGPoint(x: dotPoint.x + labelOffset, y: dotPoint.y - 20)
                                anchor = .bottomLeading
                            }
                        }
                        context.draw(combinedLabel, at: textPoint, anchor: anchor)
                    }
                }
            }
            .gesture(
                DragGesture(minimumDistance: 0)
                    .onChanged { value in
                        dragLocationPreci = value.location
                    }
                    .onEnded { _ in
                        dragLocationPreci = nil
                    }
            )
            .frame(height: graphHeight + 20)
            
            Divider()
                .background(Color.gray.opacity(0.4))
                .padding(.horizontal, graphPadding / 2)
                .padding(.top, 2)
        }
        HStack {
            Text(NSLocalizedString("DailyChanceExplanation",
                                   comment: "Footer note comparing daily vs. hourly precipitation chance"))
                .font(.caption)
                .foregroundColor(.secondary)
                .lineSpacing(3)
            Spacer()
        }
        .offset(x: 2, y: -10)
        
    }
    
}
